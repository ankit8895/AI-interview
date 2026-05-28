import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  timeLimit: Number,
  answer: String,
  feedback: String,
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  communication: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  correctness: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },
    resumeText: {
      type: String,
    },
    questions: [questionsSchema],
    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Incompleted", "Completed"],
      default: "Incompleted",
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
