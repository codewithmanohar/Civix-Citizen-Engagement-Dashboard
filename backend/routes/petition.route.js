import express from "express"; 
import { jwtAuthMiddleware } from "../middlewares/auth.js";
import { createPetition, deletePetition, filterPetitions, getAllPetitions, getPetitionById, getPetitionSignatures, signPetition, updatePetition, updatePetitionStatus } from "../controllers/petition.controller.js";
import { roleCheck } from "../middlewares/role.js";


const router = express.Router(); 

// Create Petitions 
router.post("/create" , jwtAuthMiddleware , createPetition); 

// Get All Petitions
router.get("/" , jwtAuthMiddleware, roleCheck , getAllPetitions); 

// Filter Petitions
router.get("/filter" , jwtAuthMiddleware , roleCheck , filterPetitions);


// Get Petition By ID
router.get("/:id" , jwtAuthMiddleware , getPetitionById);

// Update Petition
router.put("/update/:id" , jwtAuthMiddleware , updatePetition); 

// Sign Petition
router.post("/sign/:id", jwtAuthMiddleware , signPetition); 

// Get Signature 
router.get("/signature/:id", jwtAuthMiddleware, getPetitionSignatures);

// Delete Petition
router.delete("/delete/:id" , jwtAuthMiddleware , roleCheck , deletePetition); 

// Update Status Petition
router.put("/petition/:petitionId/status", jwtAuthMiddleware, roleCheck, updatePetitionStatus);

export default router ; 