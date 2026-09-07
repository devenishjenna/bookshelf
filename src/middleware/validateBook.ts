import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/appErrors";

// 3 arguments so express knows it's non-error handling middleware
// check if ALL required fields are present AND are valid
export function validateCreateBook(req: Request, res: Response, next: NextFunction): void {
  // express 5 leaves req.body undefined when no body is sent
  if (!req.body || typeof req.body !== "object") {
    throw new ValidationError("Request body is required");
  }

  // no id fields allowed
  if ("id" in req.body) {
   throw new ValidationError("'id' must not be provided, it is assigned by the server");
  }

  const { title, author, genre, price } = req.body

  if (typeof title !== "string" || title.trim() === "") {
    throw new ValidationError("'title' is required and must be a non-empty string");
  }

  if (typeof author !== "string" || author.trim() === "") {
    throw new ValidationError("'author' is required and must be a non-empty string");
  }

  if (typeof genre !== "string" || genre.trim() === "") {
    throw new ValidationError("'genre' is required and must be a non-empty string");
  }

  if (typeof price !== "number" || price <= 0) {
    throw new ValidationError("'price' is required and must be positive number");
  }
  // if all validations pass, give control of flow to next function
  next();
}

export function validateUpdateBook(req: Request, res: Response, next: NextFunction): void {
  // express 5 leaves req.body undefined when no body is sent
  if (!req.body || typeof req.body !== "object") {
    throw new ValidationError("Request body is required");
  }

  if ("id" in req.body) {
   throw new ValidationError("'id' must not be provided, it is assigned by the server");
  }
  
  const { title, author, genre, price } = req.body
  
  // throws if defined and not valid
  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    throw new ValidationError("'title' must be a non-empty string")
  }

  if (author !== undefined && (typeof author !== "string" || author.trim() === "")) {
    throw new ValidationError("'author' must be a non-empty string")
  }

  if (genre !== undefined && (typeof genre !== "string" || genre.trim() === "")) {
    throw new ValidationError("'genre' must be a non-empty string")
  }
  
  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    throw new ValidationError("'price' is required and must be positive number")
  }
  // if all validations pass, give control of flow to next function
  next();
}