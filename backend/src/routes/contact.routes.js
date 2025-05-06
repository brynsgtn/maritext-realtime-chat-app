import express from "express";
import { 
    getAllUsers, 
    getContactRequests, 
    sendContactRequest,
    acceptContactRequest, 
    declineContactRequest,
    getAllUserContacts
} from "../controllers/contact.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/send-contact-request", sendContactRequest);
router.get("/get-contact-requests", protectRoute, getContactRequests);
router.post("/accept-contact-request", protectRoute, acceptContactRequest);
router.post("/decline-contact-request", protectRoute, declineContactRequest);
router.get("/get-all-user-contacts", protectRoute, getAllUserContacts);

export default router;