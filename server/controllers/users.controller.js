import User from "../models/User.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
    try {
        // Retrieve all users
        const users = await User.find();

        // If users don't exist return 404 error
        if (!users) return res.status(404).json({ message: "Users not found" });

        // Send the response
        res.status(200).json(users);
    } catch (error) {
        // Handle any errors
        res.status(404).json({ message: error.message });
    }
};

// GET USER DETAILS
export const getUserDetails = async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ username: req.params.username });

        // If user doesn't exist return 404 error
        if (!user) return res.status(404).json({ message: "User not found" });

        // Send the response
        res.status(200).json(user);
    } catch (error) {
        // Handle any errors
        res.status(404).json({ message: error.message });
    }
};
