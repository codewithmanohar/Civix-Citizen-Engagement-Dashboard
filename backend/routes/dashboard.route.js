import express from "express";
import {
  getPetitionStats,
  getPetitionCategoryStats,
  getRecentPetitions,
} from "../controllers/dashboard.controller.js";



const router = express.Router();

router.get("/petition-stats", getPetitionStats);
router.get("/petition-category-stats", getPetitionCategoryStats);
router.get("/recent-petitions", getRecentPetitions);

export default router;
