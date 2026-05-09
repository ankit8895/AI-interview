import express from "express";
import isAuth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  analyzeResume,
  generateQuestions,
  getInterviewScore,
  submitAnswer,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestions);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish", isAuth, getInterviewScore);

export default interviewRouter;
