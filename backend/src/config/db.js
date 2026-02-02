import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// let mongod = null;

// const connectDB = async () => {
//   try {
//     let mongoUri = process.env.MONGO_URI;

//     // If no MONGO_URI or if connection fails, use in-memory MongoDB
//     if (!mongoUri || process.env.USE_MEMORY_DB === "true") {
//       console.log("Starting in-memory MongoDB server...");
//       mongod = await MongoMemoryServer.create();
//       mongoUri = mongod.getUri();
//       console.log("In-memory MongoDB started at:", mongoUri);
//     }

//     await mongoose.connect(mongoUri, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     console.log("MongoDB Connected Successfully");
//   } catch (error) {
//     // If connection to local MongoDB fails, try in-memory server
//     if (!mongod && error.message.includes("ECONNREFUSED")) {
//       console.log("Local MongoDB not available. Starting in-memory MongoDB...");
//       try {
//         mongod = await MongoMemoryServer.create();
//         const memoryUri = mongod.getUri();
//         console.log("In-memory MongoDB started at:", memoryUri);
//         await mongoose.connect(memoryUri, {
//           serverSelectionTimeoutMS: 5000,
//         });
//         console.log("MongoDB Connected Successfully (in-memory)");
//         return;
//       } catch (memoryError) {
//         console.log("Failed to start in-memory MongoDB:", memoryError.message);
//         process.exit(1);
//       }
//     }
//     console.log("MongoDB Connection Failed:", error.message);
//     process.exit(1);
//   }
// };

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// export const closeDB = async () => {
//   await mongoose.connection.close();
//   if (mongod) {
//     await mongod.stop();
//   }
// };

export default connectDB;
