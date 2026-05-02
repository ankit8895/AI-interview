import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.error("error in generating token:", error);
  }
};
