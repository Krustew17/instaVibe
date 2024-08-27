import expess from "express";
import {
    register,
    login,
    sendPasswordResetEmail,
    resetPassword,
    verifyEmail,
} from "../controllers/auth.controller.js";

const router = expess.Router();

router.post("/register", register);
router.get("/verify-email/:userId/:token", verifyEmail);
router.post("/login", login);
router.post("/password/reset", sendPasswordResetEmail);
router.post("/password/reset/:userId/:token", resetPassword);

export default router;
