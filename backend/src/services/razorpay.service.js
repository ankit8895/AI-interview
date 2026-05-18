import Razorpay from "razorpay";
import { ENV } from "../config/env.js";

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_TEST_API_KEY,
  key_secret: ENV.RAZORPAY_TEST_KEY_SECRET,
});

export default razorpay;
