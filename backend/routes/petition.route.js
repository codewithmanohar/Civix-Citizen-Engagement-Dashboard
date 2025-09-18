import express from "express"; 
import { jwtAuthMiddleware } from "../middlewares/auth.js";
import {
  createPetition,
  deletePetition,
  getAllPetitions,
  getPetitionById,
  updatePetition,
} from "../controllers/petition.controller.js";

const router = express.Router();

// Create a new petition
router.post("/create", jwtAuthMiddleware, createPetition);

// Get all petitions
router.get("/petitions", jwtAuthMiddleware, getAllPetitions);

// Get a specific petition by ID (for View Details)
router.get("/petition/:id", jwtAuthMiddleware, getPetitionById);

// Update a petition by ID
router.put("/update/:id", jwtAuthMiddleware, updatePetition);

// Delete a petition by ID
router.delete("/delete/:id", jwtAuthMiddleware, deletePetition);

export default router;
