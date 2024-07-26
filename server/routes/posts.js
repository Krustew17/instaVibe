import {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
} from "../controllers/posts.controller.js";
import { upload } from "../configs/multer.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), createPost);
router.get("/all", getAllPosts);
router.put("/:id/update", authMiddleware, updatePost);
router.delete("/:id/delete", authMiddleware, deletePost);
export default router;
