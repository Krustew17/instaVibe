import {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    likePost,
    commentPost,
    deleteComment,
} from "../controllers/posts.controller.js";
import { upload } from "../configs/multer.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all", getAllPosts);
router.post("/create", authMiddleware, upload.single("image"), createPost);
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, commentPost);
router.post(
    "/:postId/comment/:commentId/delete",
    authMiddleware,
    deleteComment
);
router.put("/:id/update", authMiddleware, updatePost);
router.delete("/:id/delete", authMiddleware, deletePost);

export default router;
