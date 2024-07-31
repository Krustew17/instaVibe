import mongoose from "mongoose";

export const ReplySchema = new mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reply: {
        type: String,
        required: true,
    },
    likes: {
        type: Map,
        of: Boolean,
        default: {},
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
ReplySchema.virtual("likesCount").get(function () {
    return this.likes ? this.likes.size : 0;
});

ReplySchema.set("toJSON", { virtuals: true });
ReplySchema.set("toObject", { virtuals: true });

const Reply = mongoose.model("Reply", ReplySchema);
export default Reply;
