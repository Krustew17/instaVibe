import express from "express";
import {
    fetchNotifications,
    createNotification,
} from "../controllers/notifications.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, fetchNotifications);
router.post("/create", authMiddleware, createNotification);

export default router;
