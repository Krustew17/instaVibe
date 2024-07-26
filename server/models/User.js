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
            default: "",
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        followings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        desc: {
            type: String,
            max: 100,
            default: "",
        },
    },
    { timestamps: true }
);

UserSchema.virtual("followersCount").get(function () {
    return this.followers.length;
});

UserSchema.virtual("followingsCount").get(function () {
    return this.followings.length;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", UserSchema);
export default User;
