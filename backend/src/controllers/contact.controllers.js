import User from "../models/user.model.js";
import Contact from "../models/contact.model.js"


export const getAllUsers = async (req, res) => {
    try {
        const requesterId = req.userId;

        // Fetch all users except the requester
        const users = await User.find({ _id: { $ne: requesterId } }).select("-password");

        if (!users || users.length === 0) {
            return res.status(400).json({ success: false, message: "No users found" });
        }

        // Extract all user IDs
        const userIds = users.map(user => user._id);

        // Find all contact requests where current user is requester or recipient and the other user is in the user list
        const contacts = await Contact.find({
            $or: [
                { requester: requesterId, recipient: { $in: userIds } },
                { recipient: requesterId, requester: { $in: userIds } }
            ]
        }).populate('requester', 'username email profilePic')
            .populate('recipient', 'username email profilePic');

        // Map users to include related contact request (if any)
        const usersWithRequests = users.map(user => {
            // Find the contact between current user and this user
            const relatedContact = contacts.find(contact =>
                (contact.requester._id.equals(requesterId) && contact.recipient._id.equals(user._id)) ||
                (contact.recipient._id.equals(requesterId) && contact.requester._id.equals(user._id))
            );

            return {
                ...user.toObject(),
                contactRequest: relatedContact ? {
                    status: relatedContact.status,
                    requester: relatedContact.requester._id,
                    recipient: relatedContact.recipient._id,
                    contactId: relatedContact._id
                } : null
            };
        });

        res.status(200).json({
            success: true,
            message: "Fetch successful",
            users: usersWithRequests,
        });
    } catch (error) {
        console.error("error in getAllUsers controller", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const sendContactRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const requesterId = req.userId;

        // Prevent self-request
        if (recipientId === requesterId.toString()) {
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
        const deletedContactRequest = await Contact.findOneAndDelete({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });

        if (!deletedContactRequest) {
            return res.status(400).json({
                success: false,
                message: "No pending contact request found"
            });
        }

        // Update status

        // deletedContactRequest.status = "declined"

        // await deletedContactRequest.save();

        res.status(200).json({
            success: true,
            message: "Contact request declined",
            // contact: deletedContactRequest,
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
            const isRequester = contact.requester._id.toString() === userId.toString();
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