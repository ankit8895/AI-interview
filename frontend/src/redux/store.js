import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { interviewReducer } from "./reducers/interviewReducer";

const store = configureStore({
  reducer: {
    userReducer: userReducer,
    interviewReducer: interviewReducer,
  },
});

export default store;
