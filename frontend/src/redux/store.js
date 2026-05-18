import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { interviewReducer } from "./reducers/interviewReducer";
import { reportsReducer } from "./reducers/reportsReducer";
import { paymentReducer } from "./reducers/paymentReducer";

const store = configureStore({
  reducer: {
    userReducer: userReducer,
    interviewReducer: interviewReducer,
    reportsReducer: reportsReducer,
    paymentReducer: paymentReducer,
  },
});

export default store;
