import express from "express";
import connectToSocket from "./controllers/socketManager.js";
import cors from "cors";
import { createServer } from "node:http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "../src/routes/users.route.js";
// Load environment variables
dotenv.config();

const app = express(); // Initialize express app

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/users", userRoutes);
// Set port
app.set("port", process.env.PORT || 3000);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Create HTTP server
const server = createServer(app);

// Initialize socket connection
const io = connectToSocket(server);

// MongoDB connection
server.listen(app.get("port"), async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://zmulani95:zoomclone123@zoomclone.61cck.mongodb.net/"
      // { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(
      `Connected to MongoDB and server is running on port ${app.get("port")}`
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});
