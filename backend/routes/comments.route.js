import express from "express";
import { addComment, deleteComment, editComment, getComments } from "../controllers/comments.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", getComments);
router.post("/:id", jwtAuthMiddleware, addComment);
router.put("/:commentId", jwtAuthMiddleware, editComment);
router.delete("/:commentId", jwtAuthMiddleware, deleteComment);

export default router;
