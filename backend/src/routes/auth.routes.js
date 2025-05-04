import express from "express";
import {
    checkAuth,
    signup,
    verifyEmail,
    login,
    logout,
    updateProfilePicture,
    updateUserName,
    forgotPassword,
    resetPassword,
    deleteUser,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/check-auth", protectRoute, checkAuth);
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile-picture", protectRoute, updateProfilePicture);
router.put("/update-username", protectRoute, updateUserName);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/delete-user", protectRoute, deleteUser);

export default router;