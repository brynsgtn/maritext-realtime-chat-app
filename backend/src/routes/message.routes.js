import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, markLatestMessageAsRead, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();


router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/read-message/:id", protectRoute, markLatestMessageAsRead);

export default router;