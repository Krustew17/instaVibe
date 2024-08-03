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
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
        replies: [
            {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "Comment",
            },
        ],
        likes: {
            type: Map,
            of: Boolean,
        },
    },
    { timestamps: true }
);
CommentSchema.virtual("likesCount").get(function () {
    return this.likes ? this.likes.size : 0;
});

CommentSchema.set("toJSON", { virtuals: true });
CommentSchema.set("toObject", { virtuals: true });

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
