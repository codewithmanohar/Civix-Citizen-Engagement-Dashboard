import express from "express";
import { createPoll, getPolls, getMyPolls, getPollById, getPollResults, deletePoll } from "../controllers/polls.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", jwtAuthMiddleware, createPoll);  
router.get("/", (req, res, next) => {
  // Try to authenticate, but don't fail if no token
  const authorization = req.headers.authorization;
  if (authorization) {
    jwtAuthMiddleware(req, res, next);
  } else {
    next();
  }
}, getPolls);                        
router.get("/my-polls", jwtAuthMiddleware, getMyPolls);
router.get("/:id", getPollById);                  
router.get("/:id/results", getPollResults);
router.delete("/:id", jwtAuthMiddleware , deletePoll);

export default router;