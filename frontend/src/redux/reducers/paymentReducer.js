import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { setUserData } from "./userReducer";

// THUNK 1 - Create an order
export const createUserOrder = createAsyncThunk(
  "payment/createUserOrder",
  async ({ planId, amount, credits }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/payment/order", {
        planId,
        amount,
        credits,
      });

      return response.data.order;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create order",
      );
    }
  },
);

// THUNK 2 - verify payment and credit user
export const verifyUserPayment = createAsyncThunk(
  "payment/verifyUserPayment",
  async (razorpayResponse, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        "/api/payment/verify",
        razorpayResponse,
      );
      dispatch(setUserData(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Payment verification failed",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    order: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.order = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // createUserOrder
      .addCase(createUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verifyUserPayment
      .addCase(verifyUserPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.order = null;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
