import expess from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = expess.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
