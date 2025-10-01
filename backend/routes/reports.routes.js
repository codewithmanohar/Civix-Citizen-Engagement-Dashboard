import express from "express";
import {
  getDashboardStats,
  getPetitionCategories,
  getCombinedTrends,
  getPollsInsights,
} from "../controllers/reports.controllers.js";

const router = express.Router();

// Dashboard overview
router.get("/dashboard", getDashboardStats);

// Petition breakdown
router.get("/petitions/categories", getPetitionCategories);

// Poll insights
router.get("/polls/insights", getPollsInsights);

// Trends (Petitions + Polls + Votes per month)
router.get("/trends/combined", getCombinedTrends);

export default router;
