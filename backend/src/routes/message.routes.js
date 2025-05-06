import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controllers.js";

const router = express.Router();


router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, );

export default router;