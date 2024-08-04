import express from "express";
import {
    getUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    followUser,
} from "../controllers/users.controller.js";
import { upload } from "../configs/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUserDetails);

router.put(
    "/update",
    authMiddleware,
    upload.single("image"),
    updateUserDetails
);

router.delete("/delete", authMiddleware, deleteUser);

router.post("/:id/follow", authMiddleware, followUser);

export default router;
