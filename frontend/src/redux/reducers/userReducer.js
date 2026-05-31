import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { generateQuestions } from "./interviewReducer";

// USER LOGIN
export const userLogin = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { name, email } = credentials;

      const response = await axiosInstance.post("/api/auth/login", {
        name,
        email,
      });

      return response?.data?.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Login Failed. Try Again",
      );
    }
  },
);

// USER LOGOUT
export const userLogout = createAsyncThunk(
  "user/logout",
  async (arg, { rejectWithValue }) => {
    try {
      await axiosInstance.get("/api/auth/logout");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Logout Failed. Try Again",
      );
    }
  },
);

// GET CURRENT USER
export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user/current-user");
      return response?.data?.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "User logged out. Login again",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    userInfo: null,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN ADD CASES
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.error = action.payload;
      })

      // LOGOUT ADD CASES
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREDITS UPDATE
      .addCase(generateQuestions.fulfilled, (state, action) => {
        if (state.userInfo) {
          state.userInfo.credits = action.payload.creditsLeft;
        }
      })

      // GET CURRENT USER CASES
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })

      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.error = action.payload;
      });
  },
});

export const { setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
