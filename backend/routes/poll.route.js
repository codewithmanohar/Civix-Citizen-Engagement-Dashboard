import express from "express";
import { createPoll, getPolls, getPollById } from "../controllers/polls.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", jwtAuthMiddleware, createPoll);  // create poll
router.get("/", getPolls);                        // list polls
router.get("/:id", getPollById);                  // single poll

export default router;
