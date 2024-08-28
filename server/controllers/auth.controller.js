import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateUsername from "../utils/validateUsername.js";
import nodemailer from "nodemailer";
import getPRHTML from "../utils/htmlTemplates.js";
import sendEmailVerificationEmail from "../utils/sendEmails.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        // deconstruct the req.body
        const { username, displayName, email, password, confirmPassword } =
            req.body;

        // Check if username is taken
        if (!username) {
            return res
                .status(400)
                .json({ message: "Username cannot be empty" });
        }
        const lowerUsername = username.toString().toLowerCase();

        const user = await User.findOne({ username: lowerUsername });
        if (user) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // check if display name is taken
        if (!displayName) {
            return res
                .status(400)
                .json({ message: "Display name cannot be empty" });
        }
        const lowerDisplayName = displayName.toString().toLowerCase();

        const displayNameTaken = await User.findOne({
            displayName: lowerDisplayName,
        });
        if (displayNameTaken) {
            return res
                .status(400)
                .json({ message: "Display name already taken" });
        }

        // validate the username
        validateUsername(username, "username");

        // validate the display name
        validateUsername(displayName, "display name");

        // Check if email is taken

        const lowerEmail = email.toString().toLowerCase();

        const userEmail = await User.findOne({ email: lowerEmail });
        if (userEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }

        // Check for empty fields
        if (!password || !username || !email || !displayName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check password length
        if (password.trim().length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters" });
        }

        if (password.includes(" ")) {
            return res
                .status(400)
                .json({ message: "Password cannot contain spaces" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // Hash the password and save the user
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            username: lowerUsername,
            displayName: lowerDisplayName,
            email: lowerEmail,
            password: passwordHash,
        });

        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: savedUser }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const emailSent = await sendEmailVerificationEmail(savedUser, token);
        if (!emailSent) {
            await User.deleteOne({ _id: savedUser._id });
            return res.status(500).json({ message: "Failed to send email" });
        }

        // Send the response
        res.status(201).json({
            message: "Verification email sent",
        });
    } catch (error) {
        // Handle any errors
        console.error("Error registering user:", error);
        res.status(500).json({ message: error.message });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        // deconstruct the req.body
        const { email, password } = req.body;

        const lowerEmail = email.toString().toLowerCase();

        // Check for empty fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if username is taken

        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.verified) {
            return res
                .status(400)
                .json({ message: "Please verify your email" });
        }

        const { password: userPassword, ...userData } = user._doc;

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, userPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect credentials." });
        }

        // Create a JWT token
        const token = jwt.sign({ user: userData }, process.env.JWT_SECRET, {
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

// SEND PASSWORD RESET EMAIL
export const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const lowerEmail = email.toString().toLowerCase();

        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const host = process.env.CLIENT_HOST;

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const resetLink = `${host}/reset-password/${user._id}/${token}`;

        const htmlTemplate = getPRHTML(user.username, resetLink);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: lowerEmail,
            subject: "Password Reset",
            html: htmlTemplate,
        });

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
    // TODO: ADD PASSWORD VALIDATIONS
    try {
        const { password, confirmPassword } = req.body;
        const { userId, token } = req.params;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        const salt = await bcrypt.genSalt();

        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;

        await User.findOneAndUpdate(
            { _id: userId },
            { password: passwordHash }
        );
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { userId, token } = req.params;
        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        await User.findOneAndUpdate({ _id: userId }, { verified: true });

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
