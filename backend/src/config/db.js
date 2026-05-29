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

let isConnected = false; // track connection state in this process

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const uri = ENV.MONGODB_URI;

  console.log(
    "MONGODB_URI prefix:",
    uri ? uri.split("@")[1]?.slice(0, 40) + "..." : "undefined",
  );

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    const conn = await connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 15000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log(
      "MongoDB connected, readyState:",
      conn.connections[0].readyState,
    );
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // let the caller handle it instead of process.exit
  }
};

export default connectDB;
