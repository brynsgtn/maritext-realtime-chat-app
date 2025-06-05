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
    }


});

export { io, app, server };