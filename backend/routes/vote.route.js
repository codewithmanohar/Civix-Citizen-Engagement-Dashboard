import express from "express";
import { voteInPoll, deleteVotesByUserId } from "../controllers/vote.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Cast vote in poll
router.post("/:id", jwtAuthMiddleware, voteInPoll);

// Delete all votes by user ID (admin function)
router.delete("/user/:userId", deleteVotesByUserId);

export default router;
