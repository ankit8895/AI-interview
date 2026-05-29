import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// THUNK 1 - Upload & analyze resume
export const analyzeResume = createAsyncThunk(
  "interview/analyzeResume",
  async (resumeFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await axiosInstance.post(
        "/api/interview/resume",
        formData,
      );

      return response?.data?.resume;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Resume analysis failed",
      );
    }
  },
);

// THUNK 2 - Generate interview questions
export const generateQuestions = createAsyncThunk(
  "interview/generateQuestions",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/interview/generate-questions",
        payload,
      );
      return response?.data?.questions;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to generate questions",
      );
    }
  },
);

// THNUK 3 - Submit a single answer
export const submitAnswer = createAsyncThunk(
  "interview/submitAnswer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/interview/submit-answer",
        payload,
      );
      return {
        questionIndex: payload.questionIndex,
        feedback: response.data.feedback,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to submit answer",
      );
    }
  },
);

// THUNK 4 - Finish interview and get final score
export const finishInterview = createAsyncThunk(
  "interview/finishInterview",
  async ({ interviewId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/interview/finish", {
        interviewId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to finish interview",
      );
    }
  },
);

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    // step 1 - setup
    role: "",
    experience: "",
    mode: "Technical",
    resumeText: "",
    projects: [],
    skills: [],
    analysisDone: false,
    analyzing: false,

    // step 2 - active interview
    interviewId: null,
    questions: [],
    currentQuestionIndex: 0,
    feedbacks: [], // per question feedback from submitAnswer

    // step 3 - report
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    // for controlled inputs in RoleExpResume
    setField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    resetInterview: (state) => {
      // reset everthing back to initial for a new session
      state.role = "";
      state.experience = "";
      state.mode = "Technical";
      state.resumeText = "";
      state.projects = [];
      state.skills = [];
      state.analysisDone = false;
      state.analyzing = false;
      state.interviewId = null;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.feedbacks = [];
      state.report = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // analyzeResume
      .addCase(analyzeResume.pending, (state) => {
        state.analyzing = true;
        state.error = null;
      })

      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.analyzing = false;
        state.analysisDone = true;
        state.role = action.payload.role || "";
        state.experience = action.payload.experience || "";
        state.projects = action.payload.projects || [];
        state.skills = action.payload.skills || [];
        state.resumeText = action.payload.resumeText || "";
      })

      .addCase(analyzeResume.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      })

      // generateQuestions
      .addCase(generateQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewId = action.payload.interviewId;
        state.questions = action.payload.questions;
        state.currentQuestionIndex = 0;
        state.feedbacks = [];
      })

      .addCase(generateQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // submitAnswer
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks[action.payload.questionIndex] = action.payload.feedback;
      })

      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // finishInterview
      .addCase(finishInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(finishInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })

      .addCase(finishInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setField, nextQuestion, resetInterview } =
  interviewSlice.actions;
export const interviewReducer = interviewSlice.reducer;
