import express from "express";
import { getUsers, getUserDetails } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUserDetails);

export default router;
