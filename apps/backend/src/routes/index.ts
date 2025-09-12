import { Application } from "express";
import commentaryRoutes from "./commentaryRoutes";
import matchRoutes from "./matchRoutes";
import pollRoutes from "./pollRoutes";

export const setupRoutes = (app: Application) => {
  // API Documentation endpoint
  app.get("/api", (req, res) => {
    res.json({
      status: "success",
      message: "Sports Dashboard API",
      version: "1.0.0",
      endpoints: {
        health: "GET /api/health",
        database: "GET /api/db-test",
        matches: {
          list: "GET /api/matches",
          live: "GET /api/matches/live",
          get: "GET /api/matches/:id",
          create: "POST /api/matches",
          update: "PUT /api/matches/:id",
          delete: "DELETE /api/matches/:id",
        },
        polls: {
          list: "GET /api/polls",
          get: "GET /api/polls/:id",
          results: "GET /api/polls/:id/results",
          create: "POST /api/polls",
          vote: "POST /api/polls/:id/vote",
          update: "PUT /api/polls/:id",
          delete: "DELETE /api/polls/:id",
        },
        commentary: {
          list: "GET /api/commentary",
          get: "GET /api/commentary/:id",
          byMatch: "GET /api/commentary/match/:matchId",
          create: "POST /api/commentary",
          update: "PUT /api/commentary/:id",
          delete: "DELETE /api/commentary/:id",
        },
      },
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Test database connection
  app.get("/api/db-test", async (req, res) => {
    try {
      const { prisma } = await import("../lib/prisma");
      const matchCount = await prisma.match.count();
      res.json({
        status: "connected",
        matchCount,
        message: "Database connection successful",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API Routes
  app.use("/api/matches", matchRoutes);
  app.use("/api/polls", pollRoutes);
  app.use("/api/commentary", commentaryRoutes);
};
