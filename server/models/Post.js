import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
            max: 200,
        },
        picturePath: {
            type: String,
            required: true,
        },
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        createdAt: {
            type: Date,
            default: new Date(),
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
