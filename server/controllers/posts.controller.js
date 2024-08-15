import Post from "../models/Post.js";
import cloudinary from "../configs/cloudinary.js";
import validation from "../utils/postValidation.js";
import Comment from "../models/Comment.js";
import generatePublicId from "../utils/generatePublicId.js";
import Reply from "../models/Reply.js";
import mongoose from "mongoose";

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
    try {
        // Retrieve all posts and sort them by createdAt in descending order
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                select: "comment user createdAt",
                populate: {
                    path: "user",
                    select: "username",
                },
            })
            .populate({ path: "createdBy", select: "username profilePicture" });

        // If posts don't exist return 404 error
        if (!posts) return res.status(404).json({ message: "Posts not found" });

        // Send the response
        res.status(200).json(posts);
    } catch (error) {
        // Handle any errors
        res.status(404).json({ message: error.message });
    }
};

// SEARCH POSTS
export const searchPosts = async (req, res) => {
    try {
        // Ensure query is properly extracted and sanitized
        const { query } = req.query;

        // Validate query input
        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "Invalid query" });
        }

        // Perform the search operation
        const posts = await Post.find({
            description: { $regex: query, $options: "i" }, // Case-insensitive search
        }).populate("createdBy", "username profilePicture");

        // Send back the filtered users
        res.status(200).json(posts);
    } catch (error) {
        // Log the error for debugging
        console.error("Error filtering users:", error);

        // Send error response
        res.status(500).json({ message: error.message });
    }
};

// GET POST DETAILS
export const getPostDetails = async (req, res) => {
    try {
        // Retrieve the post

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Post not found" });
        }

        const post = await Post.findById(req.params.id)
            .populate({
                path: "comments",
                select: "comment user createdAt replies likes",
                populate: [
                    {
                        path: "user",
                        select: "username profilePicture",
                    },
                    {
                        path: "replies",
                        select: "comment user createdAt",
                    },
                ],
            })
            .populate({ path: "createdBy", select: "username profilePicture" });

        // If post doesn't exist return 404 erro
        if (!post) return res.status(400).json({ message: "Post not found" });

        // Sort the comments by createdAt in descending order
        post.comments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Send the response
        res.status(200).json(post);
    } catch (error) {
        // Handle any errors
        res.status(404).json({ message: error.message });
    }
};

// CREATE POST
export const createPost = async (req, res) => {
    try {
        // deconstruct the req.body
        const { gifUrl, description } = req.body;

        // Get the request user and save into variable
        const user = req.user;

        // Check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        let imageUrl = "";

        const public_id = generatePublicId();

        // check if the request has a file
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                // Upload image to cloudinary
                req.file.path,
                { public_id },
                (error, result) => {
                    if (error) {
                        // Check for errors
                        return res.status(500).json({ message: error.message }); // Send error
                    }
                    imageUrl = result.secure_url; // Save image url
                }
            );
        }
        // check if the request has a gif
        if (gifUrl) {
            imageUrl = gifUrl;
        }

        // Validate the post
        if (!imageUrl)
            return res.status(400).json({ message: "image/gif required!" });

        // Create the new post object
        const newPost = new Post({
            createdBy: user._id,
            location: user.location,
            description,
            picturePath: imageUrl,
            likes: {},
            comments: [],
            createdAt: new Date(),
        });

        // Save the new post
        await newPost.save();

        // Send the response
        res.status(201).json(newPost);
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// UPDATE POST
export const updatePost = async (req, res) => {
    try {
        // deconstruct the req.body
        const { description } = req.body;
        const postId = req.params.id;
        const user = req.user;

        await validation(postId, user, res);

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { description },
            { new: true }
        );

        // Send the response
        res.status(200).json(updatedPost);
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        // deconstruct the req.body
        const postId = req.params.id;
        const user = req.user;

        const post = await validation(postId, user, res);

        if (!post) return res.status(400).json({ message: "post not found" });

        // // Retrieve the image cloudinary public id
        // const cloudinaryPublicId = post.picturePath
        //     .split("/")
        //     .pop()
        //     .split(".")
        //     .shift();

        // // Delete image from cloudinary
        // await cloudinary.uploader.destroy([cloudinaryPublicId], {
        //     resource_type: "image",
        // });

        // Delete the post
        await Post.deleteOne({ _id: postId });

        // Send the response
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        // Handle any errors
        return res.status(400).json({ message: error.message });
    }
};

// Like a post
export const likePost = async (req, res) => {
    try {
        // deconstruct the req.body
        const postId = req.params.id;
        const user = req.user;

        // Check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message: "post not found" });

        // Check if user has already liked the post
        if (post.likes.get(user._id)) {
            post.likes.delete(user._id);
            await post.save();
            return res
                .status(200)
                .json({ message: "Post unliked successfully" });
        }

        // Add the user to the likes array
        post.likes.set(user._id, true);
        await post.save();

        // Send the response
        res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// COMMENT POST
export const commentPost = async (req, res) => {
    try {
        // deconstruct the req.body
        const { comment } = req.body;

        const postId = req.params.id;
        const user = req.user;

        // validate the comment
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Post not found" });
        }

        const post = await Post.findById(postId);
        if (!post)
            return res.status(400).json({ message: "Comment not found" });

        // check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        // Check if comment is empty
        if (!comment) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        // Create new comment object

        const newComment = new Comment({
            user,
            comment,
            post,
            likes: {},
            comments: [],
            createdAt: new Date(),
        });

        // Save the new comment
        await newComment.save();

        // Add the comment to the post
        post.comments.push(newComment);

        // Update the post
        await post.save();

        // Send the response
        return res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// DELETE COMMENT

export const deleteComment = async (req, res) => {
    try {
        // deconstruct the req.body
        const commentId = req.params.commentId;
        const postId = req.params.postId;

        const user = req.user;

        const post = await Post.findById(postId);

        if (!post) return res.status(400).json({ message: "post not found" });

        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(400).json({ message: "comment not found" });

        if (!comment.user.equals(user._id)) {
            return res.status(400).json({ message: "Something went wrong" });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Send the response
        return res
            .status(200)
            .json({ message: "Comment deleted successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// REPLY TO COMMENT

export const replyComment = async (req, res) => {
    try {
        // deconstruct the req.body
        const { reply } = req.body;
        const commentId = req.params.commentId;
        const postId = req.params.postId;
        const user = req.user;

        // validate the post
        // const post = await validation(postId, user, res);
        const post = await Post.findById(post);
        if (!post) return res.status(400).json({ message: "post not found" });

        // validate the comment
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Comment not found" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(400).json({ message: "Comment not found" });

        // create new reply
        const newReply = new Reply({
            user,
            reply,
            comment,
            createdAt: new Date(),
        });

        // save the reply
        await newReply.save();

        // add the reply to the comment
        comment.replies.push(newReply);

        // save the comment
        await comment.save();

        // Send the response
        return res.status(201).json({ message: "Reply added successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// LIKE COMMENT
export const likeComment = async (req, res) => {
    try {
        // deconstruct the req.body
        const commentId = req.params.commentId;
        const user = req.user;

        // validate the comment
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Comment not found" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(400).json({ message: "Comment not found" });

        // Check if user has already liked the comment
        if (comment.likes.get(user._id)) {
            comment.likes.delete(user._id);
            await comment.save();
            return res
                .status(200)
                .json({ message: "Comment unliked successfully" });
        }

        // Like the comment
        comment.likes.set(user._id, true);

        // Save the comment
        await comment.save();

        // Send the response
        res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};
