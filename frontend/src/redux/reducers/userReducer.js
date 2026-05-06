import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

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
        error?.response?.data?.message || "Logout Failed. try Again",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    userInfo: null,
    error: null,
  },
  // reducers: {
  //   setUserData: (state, action) => {
  //     state.loading = true;
  //     state.userInfo = action.payload;
  //   },
  // },
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
      });
  },
});

// export const { setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
