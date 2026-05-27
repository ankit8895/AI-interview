import express from "express";
import {
  analyzeResume,
  generateQuestions,
  getInterviewReport,
  getInterviewScore,
  getUserInterviewHistory,
  submitAnswer,
} from "../controllers/interview.controller.js";
import isAuth from "../middleware/auth.middleware.js";
import { multerError } from "../middleware/error.middleware.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, multerError, analyzeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestions);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish", isAuth, getInterviewScore);

interviewRouter.get("/get-interviews", isAuth, getUserInterviewHistory);
interviewRouter.get("/report/:id", isAuth, getInterviewReport);

export default interviewRouter;
