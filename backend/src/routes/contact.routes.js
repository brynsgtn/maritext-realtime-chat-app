import express from "express";
import { 
    getAllUsers, 
    getContactRequests, 
    sendContactRequest,
    acceptContactRequest, 
    declineContactRequest,
    getAllUserContacts,
    removeContact
} from "../controllers/contact.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/send-contact-request", protectRoute, sendContactRequest);
router.get("/get-contact-requests", protectRoute, getContactRequests);
router.post("/accept-contact-request", protectRoute, acceptContactRequest);
router.post("/decline-contact-request", protectRoute, declineContactRequest);
router.get("/get-all-user-contacts", protectRoute, getAllUserContacts);
router.delete("/remove-contact", protectRoute, removeContact);

export default router;