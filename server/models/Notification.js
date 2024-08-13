import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["follow", "unfollow", "like", "unlike", "comment"],
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: function () {
            return this.type === "like" || this.type === "unlike";
        },
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

NotificationSchema.pre("validate", async function (next) {
    if (!this.isModified("type") && !this.isModified("sender")) {
        return next();
    }

    await this.populate("sender", "username");

    switch (this.type) {
        case "follow":
            this.message = `${this.sender.username} started following you.`;
            break;
        case "unfollow":
            this.message = `${this.sender.username} stopped following you.`;
            break;
        case "like":
            this.message = `${this.sender.username} liked your post.`;
            break;
        case "unlike":
            this.message = `${this.sender.username} unliked your post.`;
            break;
        case "comment":
            this.message = `${this.sender.username} commented on your post.`;
            break;
    }

    next();
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
