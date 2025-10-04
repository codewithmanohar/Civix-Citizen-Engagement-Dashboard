import express from "express";
import { addComment, getComments } from "../controllers/comments.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", getComments);
router.post("/:id", jwtAuthMiddleware, addComment);

export default router;
