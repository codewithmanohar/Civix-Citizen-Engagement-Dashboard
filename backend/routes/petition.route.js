import express from "express"; 
import { jwtAuthMiddleware } from "../middlewares/auth.js";
import { createPetition, deletePetition, getAllPetitions, getPetitionById, updatePetition } from "../controllers/petition.controller.js";


const router = express.Router(); 


router.post("/create" , jwtAuthMiddleware , createPetition); 
router.get("/petitions" , jwtAuthMiddleware , getAllPetitions); 
router.get("/getPetitionById/:userId" , jwtAuthMiddleware , getPetitionById);
router.put("/update/:userId" , jwtAuthMiddleware , updatePetition); 
router.delete("/delete" , jwtAuthMiddleware , deletePetition); 


export default router ; 