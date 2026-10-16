//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";


import mongoose from "mongoose";


import {
  createQuotation,
  getCustomerQuotations,
  getQuotationById,
  getAllQuotations,
  updateQuotationStatus,
} from "./quotation.service.js";

import type {
  AuthenticatedRequest,
} from "../../core/middleware/auth.middleware.js";

function getUserId(req: Request): string | null {
  const user = (req as AuthenticatedRequest).user;

  return user?.userId || null;
}

export async function createQuotationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = getUserId(req);

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    console.log("Quotation request received:", {
      customerId,
      body: req.body,
    });

    const quotation = await createQuotation(
      customerId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Quotation request submitted successfully.",
      data: quotation,
    });
  } catch (error: unknown) {
    console.error("Create quotation failed:", error);

    // Show validation errors as 400 instead of hiding them as 500.
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof Error && error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return next(error);
  }
}

export async function listCustomerQuotations(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = getUserId(req);

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const quotations =
      await getCustomerQuotations(customerId);

    return res.status(200).json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerQuotation(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = getUserId(req);

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const quotation = await getQuotationById(
      customerId,
      req.params.id,
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAllQuotations(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const quotations = await getAllQuotations();

    return res.status(200).json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateQuotation(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const quotation = await updateQuotationStatus(
      req.params.id,
      req.body,
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully.",
      data: quotation,
    });
  
  } catch (error) {
    console.error("Create quotation failed:", error);

    if (
      error instanceof mongoose.Error.ValidationError ||
      error instanceof mongoose.Error.CastError
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      (
        error.message === "Invalid customer ID." ||
        error.message === "Invalid configuration ID." ||
        error.message === "Invalid car ID." ||
        error.message.endsWith(" is required.") ||
        error.message.includes("must be a valid non-negative number.") ||
        error.message === "Please provide a valid customer email."
      )
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return next(error);
  }
}