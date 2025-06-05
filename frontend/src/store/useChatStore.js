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

        // Listen for read confirmations
        socket.on("messagesRead", ({ receiverId, readAt, updatedCount }) => {
            console.log("Messages read event received:", { receiverId, readAt, updatedCount });

            set((state) => ({
                messages: state.messages.map((msg) => {
                    // Update messages sent by current user to the receiver who read them
                    if (msg.senderId === authUser.user._id &&
                        msg.receiverId === receiverId &&
                        !msg.isRead &&
                        !msg.isUnsent) {
                        return { ...msg, isRead: true, readAt: new Date(readAt) };
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
        socket.off("messagesDelivered");
        socket.off("messagesRead");
        socket.off("messageUnsent");
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

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
        console.log(selectedUser)
    }
}));