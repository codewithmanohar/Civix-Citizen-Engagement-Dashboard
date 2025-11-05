import express from "express";
import { createPoll, getPolls, getMyPolls, getPollById, getPollResults, closePoll, getClosedPolls } from "../controllers/polls.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", jwtAuthMiddleware, createPoll);  
router.get("/", (req, res, next) => {
  // Try to authenticate, but don't fail if no token
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwtAuthMiddleware(req, res, next);
  } else {
    next();
  }
}, getPolls);                        
router.get("/my-polls", jwtAuthMiddleware, getMyPolls);
router.get("/closed", getClosedPolls);
router.get("/:id", getPollById);                  
router.get("/:id/results", jwtAuthMiddleware , getPollResults);
router.patch("/:pollId/close", closePoll);

export default router;