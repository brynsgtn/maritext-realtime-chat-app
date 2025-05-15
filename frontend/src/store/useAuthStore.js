import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfilePicture: false,
    isUpdatingUsername: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isVerifyingEmail: false,
    isForgettingPassword: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");

            set({ authUser: res.data });

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
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            set({ isForgettingPassword: false });
        }
    },
}));