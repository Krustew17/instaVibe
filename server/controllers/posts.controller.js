import Post from "../models/Post.js";
import cloudinary from "../configs/cloudinary.js";
import validation from "../utils/postValidation.js";
import Comment from "../models/Comment.js";

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
            .populate({ path: "createdBy", select: "username" });

        // If posts don't exist return 404 error
        if (!posts) return res.status(404).json({ message: "Posts not found" });

        // Send the response
        res.status(200).json(posts);
    } catch (error) {
        // Handle any errors
        res.status(404).json({ message: error.message });
    }
};

// CREATE POST
export const createPost = async (req, res) => {
    try {
        // deconstruct the req.body
        const { description } = req.body;

        // Get the request user and save into variable
        const user = req.user;

        // Check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        let imageUrl = "";

        // check if the request has a file
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                // Upload image to cloudinary
                req.file.path,
                (error, result) => {
                    if (error) {
                        // Check for errors
                        return res.status(500).json({ message: error.message }); // Send error
                    }
                    imageUrl = result.secure_url; // Save image url
                }
            );
        }

        // Create the new post object
        const newPost = new Post({
            createdBy: user._id,
            location: user.location,
            description,
            picturePath: imageUrl,
            likes: {},
            comments: [],
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

        // Retrieve the image cloudinary public id
        const cloudinaryPublicId = post.picturePath
            .split("/")
            .pop()
            .split(".")
            .shift();

        // Delete image from cloudinary
        await cloudinary.uploader.destroy([cloudinaryPublicId], {
            resource_type: "image",
        });

        // Delete the post
        await Post.findOneAndDelete(postId);

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

        // check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        const post = await validation(postId, user, res);

        // Check if comment is empty
        if (!comment) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        // Create new comment object

        const newComment = new Comment({
            user,
            comment,
        });
        await newComment.save();
        post.comments.push(newComment);
        console.log(post.comments);

        // Update the post
        await post.save();

        // Send the response
        return res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};
