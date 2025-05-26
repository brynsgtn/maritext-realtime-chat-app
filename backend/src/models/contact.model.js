import mongoose from "mongoose";
import Message from "./message.model.js"

const contactSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
    },
    { 
        timestamps: true 
    }
);


// Middleware to remove messages when a contact is deleted
contactSchema.pre("findOneAndDelete", async function (next) {
  const contact = await this.model.findOne(this.getFilter());

  if (contact) {
    await Message.deleteMany({
      $or: [
        { senderId: contact.requester, receiverId: contact.recipient },
        { senderId: contact.recipient, receiverId: contact.requester },
      ],
    });
  }

  next();
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
