import { generateToken } from "../config/generateToken.js";
import User from "../models/user.model.js";

export const loginUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User authenticate successfully",
      user: {
        _id: user._id,
        name,
        email,
        credits: user.credits,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `User authentiation failed: ${error}`,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({
      message: "User logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `User logout unsuccessful: ${error}`,
    });
  }
};
