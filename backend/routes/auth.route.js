import express from "express";
import { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser, sendOtp, verifyOtp, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users",getUsers);
router.get("/user/:id",getUserById);
router.put("/user/:id",updateUser);
router.delete("/user/:id", deleteUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;