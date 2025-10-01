import express from "express";
import { createPoll, getPolls, getMyPolls, getPollById, getPollResults, closePoll, getClosedPolls } from "../controllers/polls.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", jwtAuthMiddleware, createPoll);  
router.get("/", getPolls);                        
router.get("/my-polls", jwtAuthMiddleware, getMyPolls);
router.get("/closed", getClosedPolls);
router.get("/:id", getPollById);                  
router.get("/:id/results", getPollResults);
router.patch("/:pollId/close", closePoll);

export default router;