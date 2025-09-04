import express from "express";
import { approveVerification, getPendingVerifications, rejectVerification, requestVerification } from "../controllers/verification.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";
import { roleCheck } from "../middlewares/role.js";

const router = express.Router();


router.post("/request",jwtAuthMiddleware , requestVerification);


router.post("/approve/:userId", jwtAuthMiddleware , roleCheck, approveVerification);

router.post("/reject/:userId", jwtAuthMiddleware, roleCheck, rejectVerification);

router.get("/pendings", jwtAuthMiddleware, roleCheck, getPendingVerifications);


export default router;  