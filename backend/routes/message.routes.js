import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsers } from "../controllers/message.controller.js";
const router=express.Router();

router.get("/users",protectRoute,getUsers);

router.get("/:id",protectRoute,getMessages);

router.post("/send/:id",protectRoute,)

export default router;