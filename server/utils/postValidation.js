import Post from "../models/Post.js";

export default async function postValidation(postId, user, res) {
    // Check if user exists
    if (!user) return res.status(400).json({ message: "bad request" });

    // Check if post exists
    const post = await Post.findById(postId);

    // Check if user is the creator of the post
    if (post.createdBy.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if post exists
    if (!post) return res.status(404).json({ message: "Post not found" });
    return post;
}
