import cors from "cors";

export const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
