import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
            max: 100,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
