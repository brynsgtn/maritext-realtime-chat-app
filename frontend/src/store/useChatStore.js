import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    contacts: [],
    isContactsLoading: false,
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingContactRequest: false,
    isGettingContactRequests: false,
    contactRequests: [],
    isAcceptingContact: false,
    isDecliningContact: false,
    isInvitingUser: false,
    isRemovingContact: false,
    isUnsendingMessage: false,
    typingUsers: [], // Array of user IDs who are currently typing
    isCurrentUserTyping: false, // Track if current user is typing

    getUserContacts: async () => {
        set({ isContactsLoading: true });
        try {
            const res = await axiosInstance.get("/contacts/get-all-user-contacts");
            set({ contacts: res.data.contacts });
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isContactsLoading: false });
        };
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isMessagesLoading: false });
        };
    },

    getAllUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/contacts/users");
            set({ users: res.data });
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isUsersLoading: false });
        };
    },

    sendContactRequest: async (recipientId) => {
        set({ isSendingContactRequest: true });
        try {
            const res = await axiosInstance.post("/contacts/send-contact-request", { recipientId });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isSendingContactRequest: false });
        };
    },

    getContactRequests: async () => {
        set({ isGettingContactRequests: true });
        try {
            const res = await axiosInstance.get("/contacts/get-contact-requests");
            console.log(res.data)
            set({ contactRequests: res.data });
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isGettingContactRequests: false });
        };
    },

    acceptContactRequest: async (requesterId) => {
        set({ isAcceptingContact: true });
        try {
            const res = await axiosInstance.post("/contacts/accept-contact-request", { requesterId });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isAcceptingContact: false });
        };
    },

    declineContactRequest: async (requesterId) => {
        set({ isDecliningContact: true });
        try {
            const res = await axiosInstance.post("/contacts/decline-contact-request", { requesterId });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isDecliningContact: false });
        };
    },

    inviteUser: async (email) => {
        set({ isInvitingUser: true });
        try {
            const res = await axiosInstance.post("/auth/invite-user", { email });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isInvitingUser: false });
        };
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] })
            // toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            // return false;
        };
        // finally {
        //     set({ isInvitingUser: false });
        // };
    },

    removeContact: async (recipientId) => {
        set({ isRemovingContact: true });
        try {
            const res = await axiosInstance.delete(`/contacts/remove-contact`, {
                data: { recipientId },
            });
            toast.success(res.data.message);

            // Remove from selectedUser if it's the one being deleted
            set((state) => {
                if (state.selectedUser?._id === recipientId) {
                    return { selectedUser: null };
                }
                return {};
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isRemovingContact: false });
        };
    },

    unsendMessage: async (messageId) => {
        set({ isUnsendingMessage: true });

        try {
            const res = await axiosInstance.post(`/messages/unsend-message/${messageId}`);
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isUnsendingMessage: false });
        };
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        const authUser = useAuthStore.getState().authUser;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set((state) => ({
                messages: [...state.messages, newMessage],
            }));

            // Confirm delivery of the message to the sender
            socket.emit("confirmMessageDelivery", {
                messageId: newMessage._id,
                senderId: newMessage.senderId
            });

            // IMMEDIATELY mark as read since chat window is open
            socket.emit("markMessagesAsRead", {
                senderId: newMessage.senderId,
                receiverId: authUser.user._id,
            });

        });

        // Listen for delivery confirmations
        socket.on("messagesDelivered", ({ receiverId, deliveredOnConnection, updatedCount }) => {
            console.log("Messages delivered event received:", { receiverId, deliveredOnConnection, updatedCount });

            set((state) => ({
                messages: state.messages.map((msg) => {
                    // Update messages sent by current user to the receiver who just came online
                    if (msg.senderId === authUser.user._id &&
                        msg.receiverId === receiverId &&
                        !msg.isDelivered &&
                        !msg.isUnsent) {
                        return { ...msg, isDelivered: true, deliveredAt: new Date() };
                    }
                    return msg;
                }),
            }));
        });

        // Listen for individual message delivery confirmations
        socket.on("messageDelivered", ({ messageId, receiverId, deliveredAt }) => {
            console.log("Single message delivered event received:", { messageId, receiverId, deliveredAt });

            set((state) => ({
                messages: state.messages.map((msg) => {
                    if (msg._id === messageId && msg.senderId === authUser.user._id) {
                        return { ...msg, isDelivered: true, deliveredAt: new Date(deliveredAt) };
                    }
                    return msg;
                }),
            }));
        });


        // Listen for read confirmations
        socket.on("messagesRead", ({ receiverId, readAt, updatedCount }) => {
            console.log("Messages read event received:", { receiverId, readAt, updatedCount });

            set((state) => ({
                messages: state.messages.map((msg) => {
                    // Update messages sent by current user to the receiver who read them
                    if (msg.senderId === authUser.user._id &&
                        msg.receiverId === receiverId &&
                        !msg.isUnsent) {
                        return {
                            ...msg,
                            isRead: true,
                            readAt: new Date(readAt),
                            // Ensure it's also marked as delivered if it wasn't already
                            isDelivered: true,
                            deliveredAt: msg.deliveredAt || new Date(readAt)
                        };
                    }
                    return msg;
                }),
            }));
        });

        // Listen for unsent messages
        socket.on("messageUnsent", ({ messageId, unsentMessage }) => {
            set((state) => ({
                messages: state.messages.map((msg) => {
                    if (msg._id === messageId) {
                        return unsentMessage;
                    }
                    return msg;
                }),
            }));
        });

        // Handle typing events
        socket.on("userStartedTyping", ({ userId, timestamp }) => {
            console.log(`User ${userId} started typing`);

            // Only show typing indicator for the currently selected user
            if (userId === selectedUser._id) {
                set((state) => ({
                    typingUsers: [...new Set([...state.typingUsers, userId])]
                }));
            }
        });

        socket.on("userStoppedTyping", ({ userId }) => {
            console.log(`User ${userId} stopped typing`);

            set((state) => ({
                typingUsers: state.typingUsers.filter(id => id !== userId)
            }));
        });


        socket.emit("markMessagesDelivered", {
            senderId: selectedUser._id,
            receiverId: authUser.user._id,
        });

        // Mark messages as read when opening chat
        socket.emit("markMessagesAsRead", {
            senderId: selectedUser._id,
            receiverId: authUser.user._id,
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageDelivered");
        socket.off("messagesDelivered");
        socket.off("messagesRead");
        socket.off("messageReadUpdate");
        socket.off("messageUnsent");
        socket.off("userStartedTyping");
        socket.off("userStoppedTyping");

        // Clear typing status when unsubscribing
        set({ typingUsers: [], isCurrentUserTyping: false });
    },

    markMessageAsDelivered: (messageId, receiverId) => {
        const socket = useAuthStore.getState().socket;
        socket.emit("messageDelivered", { messageId, receiverId });
    },

    markMessagesAsRead: async (senderId) => {
        try {
            await axiosInstance.post(`/messages/read-message/${senderId}`);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    },

    // Typing methods
    startTyping: (targetUserId) => {
        const socket = useAuthStore.getState().socket;
        const { isCurrentUserTyping } = get();

        if (!isCurrentUserTyping) {
            set({ isCurrentUserTyping: true });
            socket.emit("startTyping", { targetUserId });
        }
    },

    stopTyping: (targetUserId) => {
        const socket = useAuthStore.getState().socket;
        const { isCurrentUserTyping } = get();

        if (isCurrentUserTyping) {
            set({ isCurrentUserTyping: false });
            socket.emit("stopTyping", { targetUserId });
        }
    },

    setSelectedUser: (selectedUser) => {
        set({
            selectedUser,
            typingUsers: [], // Clear typing indicators when switching chats
            isCurrentUserTyping: false
        })
        console.log(selectedUser)
    }
}));