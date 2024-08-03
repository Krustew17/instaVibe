import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        // Ensure the Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch user from the database
        const user = await User.findById(decoded.user._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(user);

        // Attach user information to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Unauthorized" });
    }
};
