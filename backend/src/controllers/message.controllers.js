import Message from "../models/message.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.userId;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        if (String(senderId) === String(receiverId)) return res.status(400).json({ success: false, message: "Cannot send message to yourself" });
        let imageUrl;
        if (image) {
            // Upload base 64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        };



        const receiverSocketId = getReceiverSocketId(receiverId);
        const isDelivered = Boolean(receiverSocketId); // If socket exists, mark as delivered

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            isDelivered,
            deliveredAt: isDelivered ? new Date() : null,
        });

        await newMessage.save();

        // Send message to receiver if they're online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);

            // Immediately notify sender about delivery since receiver is online
            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageDelivered", {
                    messageId: newMessage._id,
                    receiverId,
                    deliveredAt: newMessage.deliveredAt
                });
            }
        }


        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markLatestMessageAsRead = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.userId;

        // Update all unread messages from sender to receiver
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

        if (!latestUnread) {
            return res.status(200).json({
                success: true,
                message: "No unread messages to mark as read.",
            });
        };

        latestUnread.isRead = true;
        latestUnread.readAt = new Date();
        await latestUnread.save();

        // Notify the sender in real time
        // const senderSocketId = getReceiverSocketId(senderId);
        // if (senderSocketId) {
        //     io.to(senderSocketId).emit("messageSeen", {
        //         messageId: latestUnread._id,
        //         seenBy: receiverId,
        //         seenAt: latestUnread.readAt,
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "Latest unread message marked as read.",
            messageId: latestUnread._id,
        });
    } catch (error) {
        console.error("Error in markLatestMessageAsRead: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.userId;

        // Update all unread messages from sender to receiver
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

        // Notify the sender in real time if they're online
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId && updatedMessages.modifiedCount > 0) {
            io.to(senderSocketId).emit("messagesRead", {
                receiverId,
                readAt: new Date(),
                updatedCount: updatedMessages.modifiedCount,
            });
        }

        res.status(200).json({
            success: true,
            message: "Messages marked as read.",
            updatedCount: updatedMessages.modifiedCount,
        });
    } catch (error) {
        console.error("Error in markMessagesAsRead: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const unsendMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const senderId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ error: "Invalid message ID format." });
        }

        const messageToUnsend = await Message.findOneAndUpdate(
            { _id: messageId, senderId: senderId },
            {
                text: "This message was unsent",
                image: null,
                isUnsent: true,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );

        if (!messageToUnsend) {
            return res.status(400).json({
                success: false,
                message: "Message not found",
            });
        };

        // Emit socket event for real-time unsend update
        const receiverSocketId = getReceiverSocketId(messageToUnsend.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageUnsent", {
                messageId: messageToUnsend._id,
                unsentMessage: messageToUnsend
            });
        }

        // Also emit to sender for their own UI update if they're on another device
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageUnsent", {
                messageId: messageToUnsend._id,
                unsentMessage: messageToUnsend
            });
        }

        res.status(200).json({
            success: true,
            message: "Message unsent successfully.",
            unsentMessage: messageToUnsend
        });
    } catch (error) {
        console.error("Error in unsendMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



