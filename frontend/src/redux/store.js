import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { interviewReducer } from "./reducers/interviewReducer";
import { reportsReducer } from "./reducers/reportsReducer";

const store = configureStore({
  reducer: {
    userReducer: userReducer,
    interviewReducer: interviewReducer,
    reportsReducer: reportsReducer,
  },
});

export default store;
