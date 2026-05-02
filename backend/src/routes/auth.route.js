import express from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);

export default authRouter;
