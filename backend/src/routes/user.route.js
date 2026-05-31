import express from "express";
import isAuth from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, getCurrentUser);

export default userRouter;
