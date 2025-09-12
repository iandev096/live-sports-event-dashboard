import express from "express";
import { corsMiddleware } from "./cors";
import { errorHandler, notFoundHandler } from "./errorHandler";
import { loggingMiddleware } from "./logging";
import { securityMiddleware } from "./security";

export const setupMiddleware = (app: express.Application) => {
  // Security middleware
  app.use(securityMiddleware);

  // CORS middleware
  app.use(corsMiddleware);

  // Logging middleware
  app.use(loggingMiddleware);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

export { errorHandler, notFoundHandler };
