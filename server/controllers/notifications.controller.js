import Notification from "../models/Notification.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Post from "../models/Post.js";

// FETCH NOTIFICATIONS
export const fetchNotifications = async (req, res) => {
    try {
        const user = req.user;
        const notifications = await Notification.find({
            receiver: user._id,
        })
            .sort({ createdAt: -1 })
            .populate([{ path: "sender", select: "username profilePicture" }]);

        if (!notifications) {
            return res.status(404).json({ message: "Notifications not found" });
        }
        return res.status(200).json({ notifications });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// CREATE NOTIFICATION OBJECT
export const createNotification = async (req, res, io) => {
    try {
        const { sender, receiver, type, postId = null } = req.body;

        const validateSender = await User.findOne({ _id: sender });
        const validateReceiver = await User.findOne({ _id: receiver });
        if (!validateSender || !validateReceiver) {
            return res
                .status(404)
                .json({ message: "Sender or receiver not found" });
        }

        // validate the post if it exists
        if (postId && !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Post not found" });
        }
        if (postId) {
            const post = await Post.findById({ _id: postId });
            if (!post) {
                return res.status(400).json({ message: "Post not found" });
            }
        }
        const newNotification = new Notification({
            sender,
            receiver,
            type,
            post: postId,
            createdAt: new Date(),
        });

        await newNotification.save();

        const notification = await newNotification.populate([
            { path: "sender", select: "username profilePicture" },
        ]);

        io.emit("notification", notification);

        return res
            .status(201)
            .json({ message: "Notification created successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
