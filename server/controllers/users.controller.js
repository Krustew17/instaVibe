import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import validateUsername from "../utils/validateUsername.js";
import cloudinary from "../configs/cloudinary.js";
import generatePublicId from "../utils/generatePublicId.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
    try {
        // Retrieve all users
        const users = await User.find();

        // If users don't exist return 404 error
        if (!users)
            return res.status(404).json({ message: "Users not found." });

        // Send the response
        res.status(200).json(users);
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// GET USER DETAILS
export const getUserDetails = async (req, res) => {
    try {
        // Check if user exists
        const username = req.params.username;
        const user = await User.findOne({ username }).select("-password");

        // GET ALL POSTS OF THE USER
        const posts = await Post.find({ createdBy: user._id }).populate(
            "createdBy",
            "username displayName"
        );

        // GET ALL LIKED POSTS OF THE USER
        const likedPosts = await Post.find({ [`likes.${user._id}`]: true })
            .populate("createdBy", "username profilePicture")
            .exec();

        // If user doesn't exist return 404 error
        if (!user) return res.status(404).json({ message: "User not found." });

        // Send the response
        res.status(200).json({ user, posts, likedPosts });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// UPDATE USER DETAILS
export const updateUserDetails = async (req, res) => {
    try {
        const MAX_BIO_LENGTH = 150;
        // deconstruct the req.body
        const { username, email, displayName, bio, profilePicture } = req.body;
        const user = req.user;

        // Check if user exists
        if (!user) return res.status(404).json({ message: "User not found." });

        // Check for empty fields
        if (!username || !email || !displayName) {
            return res.status(400).json({
                message: "username, email and displayName are required.",
            });
        }

        // Check if username already exists
        const checkUsername = await User.findOne({ username });

        if (checkUsername && req.user.username !== username) {
            return res
                .status(400)
                .json({ message: "Username already exists." });
        }

        // Check if email already exists
        const checkEmail = await User.findOne({ email });
        if (checkEmail && email !== req.user.email) {
            return res.status(400).json({ message: "Email already exists." });
        }

        if (bio && bio.length > MAX_BIO_LENGTH) {
            return res.status(400).json({
                message: `bio length should be less than ${MAX_BIO_LENGTH} characters.`,
            });
        }

        // validate the username
        validateUsername(username);

        let imageUrl;
        const public_id = generatePublicId();

        if (req.file) {
            // Retrieve the image cloudinary public id
            const cloudinaryPublicId = user.profilePicture
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.shift();
            console.log(cloudinaryPublicId);

            // Delete image from cloudinary if not default avatar
            if (cloudinaryPublicId && cloudinaryPublicId !== "default_avatar") {
                await cloudinary.uploader.destroy([cloudinaryPublicId], {
                    resource_type: "image",
                });
            }

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
        if (profilePicture) {
            imageUrl = profilePicture;
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                username,
                email,
                displayName,
                description: bio,
                profilePicture: imageUrl,
            },
            { new: true }
        );

        // Send the response
        res.status(200).json({
            message: "User updated successfully",
            updatedUser,
        });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        // deconstruct the req.body
        const user = req.user;

        // Check if user exists
        if (!user) return res.status(404).json({ message: "User not found." });

        // Retrieve the image cloudinary public id
        const cloudinaryPublicId = user.profilePicture
            ?.split("/")
            ?.pop()
            ?.split(".")
            ?.shift();

        // Delete image from cloudinary if not default avatar
        if (cloudinaryPublicId && cloudinaryPublicId !== "default_avatar") {
            await cloudinary.uploader.destroy([cloudinaryPublicId], {
                resource_type: "image",
            });
        }

        // Delete comments
        await Comment.deleteMany({ user: user._id });

        // Delete posts
        await Post.deleteMany({ user: user._id });

        // Remove user from everybody's followers array
        await User.updateMany(
            { followers: user.id },
            { $pull: { followers: user.id } }
        );

        // Remove the user from everybody's following array
        await User.updateMany(
            { following: user.id },
            { $pull: { following: user.id } }
        );

        // // Delete notifications
        // await Notification.deleteMany({ user: user._id });

        // Delete the user
        await User.findByIdAndDelete(user._id);

        // Send the response
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};

// Follow user
export const followUser = async (req, res) => {
    try {
        // deconstruct the req.body
        const userId = req.params.id; // The ID of the user to be followed
        const user = req.user; // The current logged-in user

        // Check if user exists
        if (!user) return res.status(404).json({ message: "User not found." });

        // Check if followed user exists
        const followedUser = await User.findById(userId);
        if (!followedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user has already followed the followedUser
        if (user.following.includes(followedUser._id)) {
            await User.findByIdAndUpdate(
                user._id,
                { $pull: { following: followedUser._id } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                followedUser._id,
                { $pull: { followers: user._id } },
                { new: true }
            );

            // Send the response
            return res
                .status(200)
                .json({ message: "User unfollowed successfully." });
        }

        // Update the followed user's followers array
        await User.findByIdAndUpdate(
            followedUser._id,
            { $push: { followers: user._id } },
            { new: true }
        );

        // Update the user's following array
        await User.findByIdAndUpdate(
            user._id,
            { $push: { following: followedUser._id } },
            { new: true }
        );

        // Send the response
        res.status(200).json({ message: "User followed successfully." });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }
};
