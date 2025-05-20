import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create((set) => ({
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

    // todo:optimize this later
    setSelectedUser: (selectedUser) => set({ selectedUser })
}));