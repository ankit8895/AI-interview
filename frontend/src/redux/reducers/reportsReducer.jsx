import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// THUNK 1 - Get all past interviews
export const getUserInterviews = createAsyncThunk(
  "reports/getUserInterviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/interview/get-interviews");
      return response.data.interviews;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch interviews",
      );
    }
  },
);

// THUNK 2 - Get single interview report by ID
export const fetchInterviewReport = createAsyncThunk(
  "reports/fetchInterviewReport",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/interview/report/" + id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch report",
      );
    }
  },
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    interviews: [],
    selectedReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // getUserInterviews
      .addCase(getUserInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })
      .addCase(getUserInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //fetchInterviewReport
      .addCase(fetchInterviewReport.pending, (state) => {
        state.loading = true;
        state.selectedReport = null;
        state.error = null;
      })
      .addCase(fetchInterviewReport.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchInterviewReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedReport } = reportsSlice.actions;
export const reportsReducer = reportsSlice.reducer;
