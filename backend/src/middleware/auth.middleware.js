import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    let verifyToken;
    try {
      verifyToken = jwt.verify(token, ENV.JWT_SECRET);
    } catch (error) {
      const message =
        error.name === "TokenExpiredError"
          ? "Session expired. Please log in again"
          : "Invalid token";

      return res.status(401).json({ message });
    }

    const user = await User.findById(verifyToken.userId).select("-password");

    if (!user)
      return res.status(401).json({ message: "Authentication required" });

    req.user = user;
    next();
  } catch (error) {
    console.error("[isAuth]", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default isAuth;
