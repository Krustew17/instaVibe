import Post from "../models/Post.js";
import cloudinary from "../configs/cloudinary.js";

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
    try {
        // Retrieve all posts and sort them by createdAt in descending order
        const posts = await Post.find().sort({ createdAt: -1 });

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

        // Check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user is the creator of the post
        if (post.createdBy.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

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

        // Check if user exists
        if (!user) return res.status(400).json({ message: "bad request" });

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user is the creator of the post
        if (post.createdBy.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const cloudinaryPublicId = post.picturePath
            .split("/")
            .pop()
            .split(".")
            .shift();
        console.log(cloudinaryPublicId);

        // Delete image from cloudinary
        await cloudinary.uploader.destroy(cloudinaryPublicId);

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Send the response
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};
