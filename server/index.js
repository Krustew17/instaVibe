import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import * as dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import notificationRoutes from "./routes/notifications.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

dotenv.config();

const app = express();

/* CONFIGURATIONS */

const corsOptions = {
    origin: [
        "https://insta-vibe-be.vercel.app",
        "insta-vibe-91rh1squw-krustew17s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": [
                "'self'",
                "data:",
                "https://cloudinary.com",
                "https://res.cloudinary.com",
                "https://media.tenor.com",
                "https://tenor.googleapis.com",
            ],
            "connect-src": ["'self'", "https://tenor.googleapis.com"],
        },
    })
);
// Define __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);
app.use("/notifications", notificationRoutes);
app.use("/chat", chatRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const socketIoCORSOptions = {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

// SOCKET IO SETUP
const server = http.createServer(app);
export const io = new SocketIOServer(server, { cors: socketIoCORSOptions });
io.on("connection", (socket) => {
    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("mongo connected"))
    .then(
        server.listen(PORT, () =>
            console.log(`Server running on port: ${PORT}`)
        )
    )
    .catch((err) => console.log(`error: ${err.message}`));
