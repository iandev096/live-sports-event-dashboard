import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
};
