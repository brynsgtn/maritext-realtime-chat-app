import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();


router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;