// import mongoose from "mongoose";
// import { ENV } from "./env.js";

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(ENV.MONGODB_URI);
//     console.log("MongoDB connected successfully:", conn.connection.host);
//   } catch (error) {
//     console.error("Error connecting to database:", error);
//     process.exit(1);
//   }
// };

import { connect } from "mongoose";
import { ENV } from "./env.js";

const connectDB = async () => {
  const uri = ENV.MONGODB_URI;

  console.log(
    "MONGODB_URI prefix:",
    uri ? uri.split("@")[1]?.slice(0, 40) + "..." : "undefined",
  );

  if (!uri) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  await connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  });

  console.log("MongoDB connected successfully");
};

export default connectDB;
