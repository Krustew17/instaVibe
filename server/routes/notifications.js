import express from "express";
import {
    fetchNotifications,
    createNotification,
} from "../controllers/notifications.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { io } from "../index.js";

const router = express.Router();

router.get("/", authMiddleware, fetchNotifications);
router.post("/create", authMiddleware, (req, res) => {
    createNotification(req, res, io);
});

export default router;
