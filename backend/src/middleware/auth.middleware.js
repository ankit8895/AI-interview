import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookie;
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

    next();
  } catch (error) {
    return res.statu(500).json({
      message: `Invalid token: ${error}`,
    });
  }
};

export default isAuth;
