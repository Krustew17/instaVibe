import Post from "../models/Post.js";

export default async function validation(postId, user, res) {
    // Check if user exists
    if (!user) {
        throw new Error("bad request");
    }

    // Check if post exists
    const post = await Post.findById(postId);

    // Check if user is the creator of the post
    if (post && post.createdBy.toString() !== user._id.toString()) {
        throw new Error("unauthorized");
    }
    return post;
}
