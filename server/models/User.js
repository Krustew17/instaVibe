import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 2,
            max: 20,
        },
        displayName: {
            type: String,
            unique: true,
            min: 2,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        profilePicture: {
            type: String,
            default: "/default_avatar.jpg",
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        description: {
            type: String,
            max: 100,
            default: "",
        },
    },
    { timestamps: true }
);

UserSchema.virtual("followersCount").get(function () {
    return this.followers ? this.followers.length : 0;
});

UserSchema.virtual("followingCount").get(function () {
    return this.following ? this.following.length : 0;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", UserSchema);
export default User;
