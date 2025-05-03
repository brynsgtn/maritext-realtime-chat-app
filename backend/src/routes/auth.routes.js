import express from "express";
import { 
    signup,
    verifyEmail,
    login,
    logout,
    updateProfilePicture,
    forgotPassword,
    resetPassword,
    checkAuth, 
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile-picture", protectRoute, updateProfilePicture);
router.get("/forgot-password", forgotPassword);
router.get("/reset-password", resetPassword);
router.get("/check-auth", checkAuth);

export default router;