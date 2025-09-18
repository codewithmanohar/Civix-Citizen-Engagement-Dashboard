import express from "express";
import { voteInPoll } from "../controllers/vote.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Cast vote in poll
router.post("/:id", jwtAuthMiddleware, voteInPoll);

export default router;
