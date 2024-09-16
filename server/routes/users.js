import express from "express";
import {
    getUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    followUser,
    searchUsers,
    changePrivacy,
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
router.post("/search", searchUsers);

router.delete("/delete", authMiddleware, deleteUser);

router.post("/:id/follow", authMiddleware, followUser);

router.put("/change-privacy", authMiddleware, (req, res) => {
    changePrivacy(req, res);
});
export default router;
