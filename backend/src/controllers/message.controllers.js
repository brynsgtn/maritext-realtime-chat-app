import Message from "../models/message.model.js";
import mongoose from "mongoose";

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

        // to do - delivered feature
        // const receiverSocketId = getReceiverSocketId(receiverId);
        // const isDelivered = Boolean(receiverSocketId);

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            // to do - delivered feature
            // isDelivered,
            // deliveredAt: isDelivered ? new Date() : null,
        });

        await newMessage.save();

        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("newMessage", newMessage);
        // }

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

        // Find the latest unread message from sender to receiver
        const latestUnread = await Message.findOne({
            senderId,
            receiverId,
            isRead: false,
        }).sort({ createdAt: -1 });

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

        // to do -socket.io for unsent messages

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



