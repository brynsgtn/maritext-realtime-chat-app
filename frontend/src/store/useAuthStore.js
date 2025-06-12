import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfilePicture: false,
    isUpdatingUsername: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isVerifyingEmail: false,
    isForgettingPassword: false,
    isResettingPasword: false,
    socket: null,
    onlineUsers: [],


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");

            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isSigningUp: false });
        };
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isLoggingOut: false });
        };
    },

    verifyEmail: async (code) => {
        set({ isVerifyingEmail: true });
        try {
            const res = await axiosInstance.post("/auth/verify-email", { code });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isVerifyingEmail: false });
        }
    },

    resendVerificationEmail: async (email) => {
        try {
            const res = await axiosInstance.post("/auth/resend-verification-email", { email });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("You are now logged in");

            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isLoggingIn: false });
        };
    },

    updateProfilePicture: async (data) => {
        set({ isUpdatingProfilePicture: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile-picture", data);

            set(state => ({
                authUser: {
                    ...state.authUser,
                    user: {
                        ...state.authUser.user,
                        profilePic: res.data.user.profilePic
                    }
                }
            }));

            toast.success("Profile picture updated")
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isUpdatingProfilePicture: false });
        };
    },

    updateUsername: async (data) => {
        set({ isUpdatingUsername: true });
        try {
            const res = await axiosInstance.put("/auth/update-username", data);

            set(state => ({
                authUser: {
                    ...state.authUser,
                    user: {
                        ...state.authUser.user,
                        username: res.data.user.username,
                    }
                }
            }));

            toast.success("Username updated")
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isUpdatingUsername: false });
        }
    },

    forgotPassword: async (email) => {
        set({ isForgettingPassword: true });
        try {
            console.log(email)
            const res = await axiosInstance.post("/auth/forgot-password", { email })
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false
        } finally {
            set({ isForgettingPassword: false });
        }
    },

    resetPassword: async (token, password) => {
        set({ isResettingPasword: true });
        try {
            console.log(`Token sent to resetPassword in authstore: ${token}`);
            console.log(`Password sent to resetPassword in authstore: ${password}`);
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isResettingPasword: false });
        };
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser.user._id,
            },
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));