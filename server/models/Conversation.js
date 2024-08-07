import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    lastMessageDate: {
        type: Date,
        default: Date.now,
    },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
