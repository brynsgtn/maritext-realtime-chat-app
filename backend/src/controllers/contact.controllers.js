import User from "../models/user.model.js";
import Contact from "../models/contact.model.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");;

        if (!users) return res.status(400).json({ message: "No users found" });

        res.status(200).json({
            sucess: true,
            message: "Fetch successful",
            users: users
        });
    } catch (error) {
        console.log("error in getAllUsers controller", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const sendContactRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.userId;

        // Prevent self-request
        if (requesterId === recipientId) {
            return res.status(400).json({
                success: false,
                message: "Cannot send request to yourself"
            });
        }

        // Check if a contact already exists (in either direction)
        const existingContact = await Contact.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingContact) {
            if (existingContact.status === "pending") {
                return res.status(400).json({
                    success: false,
                    message: "Contact request already sent or received"
                });
            }

            if (existingContact.status === "accepted") {
                return res.status(400).json({
                    success: false,
                    message: "You are already connected"
                });
            }

            if (existingContact.status === "declined" && existingContact.requester.toString() === requesterId) {
                // Reactivate a previously declined request
                existingContact.status = "pending";
                await existingContact.save();

                return res.status(200).json({
                    success: true,
                    message: "Previously declined request is now pending again",
                    contact: existingContact
                });
            }

            // Declined by you or in reverse direction, don't allow resending
            return res.status(400).json({
                success: false,
                message: "Cannot send request again"
            });
        }

        // Create a new contact request
        const newContact = new Contact({
            requester: requesterId,
            recipient: recipientId,
            status: "pending",
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: "Contact request sent",
            contact: newContact,
        });

    } catch (error) {
        console.error("Error in sendContactRequest controller:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const getContactRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await Contact.find({
            recipient: userId,
            status: "pending"
        }).populate("requester", "username email profilePic")

        if (!requests) return res.status(400).json({ message: "No contact requests" });

        res.status(200).json({
            requests: requests
        });

    } catch (error) {
        console.log("error in getContactRequests controller", error);
        res.status(500).json({ success: false, message: "Server error" });
    };
};

export const acceptContactRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const recipientId = req.userId;
        // Prevent self-request
        if (requesterId === recipientId) {
            return res.status(400).json({
                success: false,
                message: "Invalid operation: requester and recipient cannot be the same"
            });
        }

        // Find the pending contact request
        const contactRequest = await Contact.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        if (!contactRequest) {
            return res.status(400).json({
                success: false,
                message: "No pending contact request found"
            });
        }

        // Update status

        contactRequest.status = "accepted"

        await contactRequest.save();

        res.status(201).json({
            success: true,
            message: "Contact request accepted",
            contact: contactRequest,
        });

    } catch (error) {
        console.error("Error in sendContactRequest controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const declineContactRequest = async (req, res) => {
    try {
        const recipientId = req.userId; // Authenticated user
        const { requesterId } = req.body;
        

        // Prevent self-request
        if (requesterId === recipientId) {
            return res.status(400).json({
                success: false,
                message: "Invalid operation: requester and recipient cannot be the same"
            });
        }

        // Find the pending contact request
        const contactRequest = await Contact.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        if (!contactRequest) {
            return res.status(400).json({
                success: false,
                message: "No pending contact request found"
            });
        }

        // Update status

        contactRequest.status = "declined"

        await contactRequest.save();

        res.status(201).json({
            success: true,
            message: "Contact request declined",
            contact: contactRequest,
        });

    } catch (error) {
        console.error("Error in declineContactRequest controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllUserContacts = async (req, res) => {
    try {
        const userId = req.userId;

        const contacts = await Contact.find({
            $or: [
                { requester: userId },
                { recipient: userId }
            ],
            status: "accepted"
        })
            .populate({
                path: "requester recipient",
                select: "username email profilePic"
            });

        // Format the response to show the "other" user's data for each contact
        const formattedContacts = contacts.map(contact => {
            const isRequester = contact.requester._id.toString() === userId;
            const otherUser = isRequester ? contact.recipient : contact.requester;

            return {
                _id: contact._id,
                status: contact.status,
                user: otherUser,
                createdAt: contact.createdAt,
                updatedAt: contact.updatedAt
            };
        });

        res.status(200).json({
            success: true,
            contacts: formattedContacts
        });

    } catch (error) {
        console.error("Error in getAllUserContacts controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const removeContact = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.userId;

        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: "Recipient ID is required.",
            });
        }

        const deletedContact = await Contact.findOneAndDelete({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId },
            ],
            status: "accepted",
        });

        if (!deletedContact) return res.status(404).json({
            success: false,
            message: "Contact not found or already removed.",
        });

        res.status(200).json({
            sucess: true,
            message: "Contact deleted",
            user: deletedContact
        });

    } catch (error) {
        console.error("Error in removeContact controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    };
};