import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appErrors";

// central error handler, needs to be registered after all routes
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // deliberate errors
  if (err instanceof AppError) {
    console.log("**AppError**")
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    })
  }

  // any other bugs
  console.error(err);
  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred"
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  console.log("**notFoundHandler**")
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.method} ${req.path} not found`,
  });
}