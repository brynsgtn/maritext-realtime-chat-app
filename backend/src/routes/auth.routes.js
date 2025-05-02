import express from "express";
import { 
    signup,
    verifyEmail,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    checkAuth, 
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.get("/update-profile", updateProfile);
router.get("/forgot-password", forgotPassword);
router.get("/reset-password", resetPassword);
router.get("/check-auth", checkAuth);

export default router;