import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {} // {userId: socketId}

// Store typing users: { userId: { targetUserId: timestamp } }
const typingUsers = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id

    // When user comes online, mark all undelivered messages as delivered
    markMessagesAsDeliveredOnConnection(userId);

    // io.emit() is used to send events to all the conneted clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Handle individual message delivery confirmation
    socket.on("confirmMessageDelivery", async ({ messageId, senderId }) => {
        try {
            const message = await Message.findByIdAndUpdate(
                messageId,
                {
                    isDelivered: true,
                    deliveredAt: new Date()
                },
                { new: true }
            );

            if (message) {
                // Notify the sender about delivery
                const senderSocketId = userSocketMap[senderId];
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messageDelivered", {
                        messageId,
                        receiverId: userId,
                        deliveredAt: message.deliveredAt
                    });
                }
            }
        } catch (err) {
            console.error("Error in confirmMessageDelivery:", err.message);
        }
    });

    socket.on("markMessagesDelivered", async ({ senderId, receiverId }) => {
        try {
            const updatedMessages = await Message.updateMany(
                {
                    senderId,
                    receiverId,
                    isDelivered: false,
                    isUnsent: false,
                },
                {
                    $set: { isDelivered: true, deliveredAt: new Date() },
                }
            );

            // Notify the sender about the delivery if they're online
            const senderSocketId = userSocketMap[senderId];
            if (senderSocketId && updatedMessages.modifiedCount > 0) {
                io.to(senderSocketId).emit("messagesDelivered", {
                    receiverId,
                    updatedCount: updatedMessages.modifiedCount
                });
            }

        } catch (err) {
            console.error("Error in markMessagesDelivered:", err.message);
        }
    });


    socket.on("markMessagesAsRead", async ({ senderId, receiverId }) => {
        try {
            const updatedMessages = await Message.updateMany(
                {
                    senderId,
                    receiverId,
                    isRead: false,
                    isUnsent: false,
                },
                {
                    $set: { isRead: true, readAt: new Date() },
                }
            );

            // Notify the sender about the read status if they're online
            const senderSocketId = userSocketMap[senderId];
            if (senderSocketId && updatedMessages.modifiedCount > 0) {
                io.to(senderSocketId).emit("messagesRead", {
                    receiverId,
                    readAt: new Date(),
                    updatedCount: updatedMessages.modifiedCount
                });
            }

        } catch (err) {
            console.error("Error in markMessagesAsRead:", err.message);
        }
    });

    // Handle user started typing
    socket.on("startTyping", ({ targetUserId }) => {
        console.log(`User ${userId} started typing to ${targetUserId}`);
        
        // Store typing status
        if (!typingUsers[userId]) {
            typingUsers[userId] = {};
        }
        typingUsers[userId][targetUserId] = Date.now();

        // Notify the target user
        const targetSocketId = userSocketMap[targetUserId];
        if (targetSocketId) {
            io.to(targetSocketId).emit("userStartedTyping", {
                userId,
                timestamp: Date.now()
            });
        }
    });

        // Handle user stopped typing
    socket.on("stopTyping", ({ targetUserId }) => {
        console.log(`User ${userId} stopped typing to ${targetUserId}`);
        
        // Remove typing status
        if (typingUsers[userId]) {
            delete typingUsers[userId][targetUserId];
            if (Object.keys(typingUsers[userId]).length === 0) {
                delete typingUsers[userId];
            }
        }

        // Notify the target user
        const targetSocketId = userSocketMap[targetUserId];
        if (targetSocketId) {
            io.to(targetSocketId).emit("userStoppedTyping", {
                userId
            });
        }
    });

    // Clear typing status when user disconnects
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        
        // Clear typing status for this user
        if (typingUsers[userId]) {
            // Notify all users this user was typing to
            Object.keys(typingUsers[userId]).forEach(targetUserId => {
                const targetSocketId = userSocketMap[targetUserId];
                if (targetSocketId) {
                    io.to(targetSocketId).emit("userStoppedTyping", {
                        userId
                    });
                }
            });
            delete typingUsers[userId];
        }

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // Cleanup stale typing indicators (optional)
    setInterval(() => {
        const now = Date.now();
        const TYPING_TIMEOUT = 10000; // 10 seconds

        Object.keys(typingUsers).forEach(userId => {
            Object.keys(typingUsers[userId]).forEach(targetUserId => {
                if (now - typingUsers[userId][targetUserId] > TYPING_TIMEOUT) {
                    // Remove stale typing status
                    delete typingUsers[userId][targetUserId];
                    if (Object.keys(typingUsers[userId]).length === 0) {
                        delete typingUsers[userId];
                    }

                    // Notify target user
                    const targetSocketId = userSocketMap[targetUserId];
                    if (targetSocketId) {
                        io.to(targetSocketId).emit("userStoppedTyping", {
                            userId
                        });
                    }
                }
            });
        });
    }, 5000); // Check every 5 seconds


    // Function to mark messages as delivered when user comes online
    async function markMessagesAsDeliveredOnConnection(userId) {
        try {
            // Find all undelivered messages where this user is the receiver
            const undeliveredMessages = await Message.find({
                receiverId: userId,
                isDelivered: false,
                isUnsent: false,
            }).select('senderId');

            if (undeliveredMessages.length > 0) {
                // Update messages to delivered
                await Message.updateMany(
                    {
                        receiverId: userId,
                        isDelivered: false,
                        isUnsent: false,
                    },
                    {
                        $set: { isDelivered: true, deliveredAt: new Date() },
                    }
                );

                // Notify all senders about delivery
                const senders = [...new Set(undeliveredMessages.map(msg => msg.senderId.toString()))];

                senders.forEach(senderId => {
                    const senderSocketId = userSocketMap[senderId];
                    if (senderSocketId) {
                        io.to(senderSocketId).emit("messagesDelivered", {
                            receiverId: userId,
                            deliveredOnConnection: true
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error marking messages as delivered on connection:", error);
        }
    };



});

export { io, app, server };