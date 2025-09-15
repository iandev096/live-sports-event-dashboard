import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { prisma } from "./lib/prisma";
import { errorHandler, notFoundHandler, setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";
import { setupSocket } from "./socket";

// Load environment variables from root .env file
dotenv.config({ path: "../../.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 3001;

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Setup Socket.IO
setupSocket(io);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  console.log(
    `📊 Database: ${process.env.DATABASE_URL?.split("@")[1] || "Not connected"}`
  );
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
