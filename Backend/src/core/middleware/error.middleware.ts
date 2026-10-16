//D:\D-Luxury-Car-Showroom\Backend\src\core\middleware\error.middleware.ts
import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../utils/app-error.js";

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(
      error.statusCode
    ).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message:
      "Internal server error",
  });
}