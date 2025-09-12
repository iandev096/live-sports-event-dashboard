import { Application } from "express";
import commentaryRoutes from "./commentaryRoutes";
import matchRoutes from "./matchRoutes";
import pollRoutes from "./pollRoutes";

export const setupRoutes = (app: Application) => {
  const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";

  // API Documentation endpoint
  app.get(API_BASE_URL, (req, res) => {
    res.json({
      status: "success",
      message: "Sports Dashboard API",
      version: "1.0.0",
      endpoints: {
        health: `GET ${API_BASE_URL}/health`,
        database: `GET ${API_BASE_URL}/db-test`,
        matches: {
          list: `GET ${API_BASE_URL}/matches`,
          live: `GET ${API_BASE_URL}/matches/live`,
          get: `GET ${API_BASE_URL}/matches/:id`,
          create: `POST ${API_BASE_URL}/matches`,
          update: `PUT ${API_BASE_URL}/matches/:id`,
          delete: `DELETE ${API_BASE_URL}/matches/:id`,
        },
        polls: {
          list: `GET ${API_BASE_URL}/polls`,
          get: `GET ${API_BASE_URL}/polls/:id`,
          results: `GET ${API_BASE_URL}/polls/:id/results`,
          create: `POST ${API_BASE_URL}/polls`,
          vote: `POST ${API_BASE_URL}/polls/:id/vote`,
          update: `PUT ${API_BASE_URL}/polls/:id`,
          delete: `DELETE ${API_BASE_URL}/polls/:id`,
        },
        commentary: {
          list: `GET ${API_BASE_URL}/commentary`,
          get: `GET ${API_BASE_URL}/commentary/:id`,
          byMatch: `GET ${API_BASE_URL}/commentary/match/:matchId`,
          create: `POST ${API_BASE_URL}/commentary`,
          update: `PUT ${API_BASE_URL}/commentary/:id`,
          delete: `DELETE ${API_BASE_URL}/commentary/:id`,
        },
      },
    });
  });

  // Health check endpoint
  app.get(`${API_BASE_URL}/health`, (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Test database connection
  app.get(`${API_BASE_URL}/db-test`, async (req, res) => {
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
  app.use(`${API_BASE_URL}/matches`, matchRoutes);
  app.use(`${API_BASE_URL}/polls`, pollRoutes);
  app.use(`${API_BASE_URL}/commentary`, commentaryRoutes);
};
