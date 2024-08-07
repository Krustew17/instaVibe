import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    sendMessage,
    getMessages,
    getConversations,
    createOrFetchConversation,
    getConversationObject,
} from "../controllers/chat.controller.js";
import { io } from "../index.js";

const router = express.Router();

router.post("/send-message", authMiddleware, (req, res) => {
    sendMessage(req, res, io);
});
router.get("/messages/:conversationId", authMiddleware, (req, res) => {
    getMessages(req, res, io);
});
router.get("/conversations/", authMiddleware, (req, res) => {
    getConversations(req, res, io);
});
router.post("/conversation", authMiddleware, (req, res) => {
    createOrFetchConversation(req, res, io);
});
router.get("/conversation/:conversationId", authMiddleware, (req, res) => {
    getConversationObject(req, res, io);
});

export default router;
