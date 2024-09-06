import expess from "express";
import {
    register,
    login,
    sendPasswordResetEmail,
    resetPassword,
    verifyEmail,
    changePassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = expess.Router();

router.post("/register", register);
router.get("/verify-email/:userId/:token", verifyEmail);
router.post("/login", login);
router.post("/password/reset", sendPasswordResetEmail);
router.post("/password/reset/:userId/:token", resetPassword);
router.post("/password/change", authMiddleware, changePassword);

export default router;
