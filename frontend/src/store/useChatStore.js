import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


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

    getUserContacts: async () => {
        set({ isContactsLoading: true });
        try {
            const res = await axiosInstance.get("/contacts/get-all-user-contacts");
            set({ contacts: res.data.contacts });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
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
            toast.error(error?.response?.data?.message || error.message);
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
            toast.error(error?.response?.data?.message || error.message);
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
            toast.error(error?.response?.data?.message || error.message);
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

    // todo:optimize this later
    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
        console.log(selectedUser)
    }
}));