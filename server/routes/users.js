import express from "express";
import {
    getUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    followUser,
} from "../controllers/users.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUserDetails);

router.put("/update", authMiddleware, updateUserDetails);

router.delete("/delete", authMiddleware, deleteUser);

router.post("/:id/follow", authMiddleware, followUser);

export default router;
