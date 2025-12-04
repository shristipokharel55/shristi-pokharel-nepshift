import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();           // Load environment variables
connectDB();               // Connect MongoDB

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Nepshift Backend Running with ES Modules 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
