import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World !!!");
});

app.listen(ENV.PORT, () => {
  console.log("Server is running on PORT:", ENV.PORT);
  connectDB();
});

export default app;
