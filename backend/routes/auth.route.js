import express from "express";
import { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser, sendOtp, verifyOtp, resetPassword } from "../controllers/auth.controller.js";
import { jwtAuthMiddleware } from "../middlewares/auth.js";
import { roleCheck } from "../middlewares/role.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", jwtAuthMiddleware, roleCheck , getUsers);
router.get("/user", jwtAuthMiddleware, getUserById);
router.put("/user", jwtAuthMiddleware,  updateUser);
router.delete("/user/:id", jwtAuthMiddleware , roleCheck , deleteUser);
router.post("/send-otp",  sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;