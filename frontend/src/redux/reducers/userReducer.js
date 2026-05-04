import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    userInfo: {},
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
