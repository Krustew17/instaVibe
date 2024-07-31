import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import * as dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

/* CONFIGURATIONS */

const corsOptions = {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Define __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    )
    .catch((err) => console.log(`error: ${err.message}`));
