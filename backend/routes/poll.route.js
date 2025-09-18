import express from "express";
import { createPoll, getPolls, getPollById, getPollResults } from "../controllers/polls.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", jwtAuthMiddleware, createPoll);  
router.get("/", getPolls);                        
router.get("/:id", getPollById);                  
router.get("/:id/results", jwtAuthMiddleware, getPollResults);

export default router;
