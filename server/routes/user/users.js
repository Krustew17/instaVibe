import expess from "express";

const router = expess.Router();

router.get("/", (req, res) => {
    res.send("users");
});

export default router;
