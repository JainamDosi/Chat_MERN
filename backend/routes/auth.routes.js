import express from 'express';
import { loginUser, logoutUser, signupUser, updateUSer,checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/login",loginUser);

router.post("/signup",signupUser);

router.post("/logout",logoutUser);

router.put("/update-profile",protectRoute,updateUSer);

router.get("/check",protectRoute,checkAuth);

export default router;