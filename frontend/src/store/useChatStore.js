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

    getAllUsers : async () => {
        set({ isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/contacts/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isMessagesLoading: false });
        };
    },

    // todo:optimize this later
    setSelectedUser: (selectedUser) => set({ selectedUser })
}));