import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        message: "user does not have token",
      });
    }

    const verifyToken = jwt.verify(token, ENV.JWT_SECRET);

    if (!verifyToken) {
      return res.status(400).json({
        message: "user does not have verified token",
      });
    }

    const user = await User.findById(verifyToken.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: `Invalid token: ${error}`,
    });
  }
};

export default isAuth;
