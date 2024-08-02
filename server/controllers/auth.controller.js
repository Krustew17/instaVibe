import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER USER
export const register = async (req, res) => {
    try {
        // deconstruct the req.body
        const { username, email, password, confirmPassword } = req.body;
        console.log(req.body);

        // Check if username is taken
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Check if email is taken
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }

        // Check for empty fields
        if (!password || !username || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check password length
        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            console.log(password, confirmPassword);
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // Hash the password and save the user
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        const savedUser = await newUser.save();

        // Create a JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send the response
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        // Handle any errors
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        // deconstruct the req.body
        const { email, password } = req.body;

        // Check for empty fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if username is taken
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const { password: userPassword, ...userData } = user._doc;

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, userPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect credentials." });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({
            token,
            user: userData,
        });
    } catch (error) {
        // Handle any errors
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
