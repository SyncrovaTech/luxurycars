//D:\D-Luxury-Car-Showroom\Backend\src\modules\cars\controllers\car.controller.ts
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
  getAllCars,
  getAllCarsForManagement,
  getFeaturedCars,
  getCarBySlug,
  getCarById,
  createCar,
  updateCar,
  deleteCar, 
  deactivateCar,
  activateCar,
  type CarInput,
} from "../services/car.service.js";

// ========================================
// GET ALL ACTIVE CARS
// GET /api/v1/cars
// ========================================
export async function getCars(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cars = await getAllCars();

    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// GET FEATURED CARS
// GET /api/v1/cars/featured
// ========================================
export async function getFeatured(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cars = await getFeaturedCars();

    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// GET ALL CARS FOR MANAGEMENT
// GET /api/v1/cars/management
// ========================================
export async function getCarManagementList(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cars = await getAllCarsForManagement();

    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// GET SINGLE CAR FOR MANAGEMENT
// GET /api/v1/cars/management/:id
// ========================================
export async function getCarManagementDetails(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID.",
      });
    }

    const car = await getCarById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// GET SINGLE CAR BY ID OR SLUG
// GET /api/v1/cars/:slug
// ========================================
export async function getCar(
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const identifier = req.params.slug?.trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Car ID or slug is required.",
      });
    }

    // A MongoDB ObjectId is searched by ID.
    // Any other identifier is searched by slug.
    const car = mongoose.isValidObjectId(identifier)
      ? await getCarById(identifier)
      : await getCarBySlug(identifier);

    if (!car || car.isActive !== true) {
      return res.status(404).json({
        success: false,
        message: "Car not found or inactive.",
      });
    }

    return res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// CREATE CAR
// POST /api/v1/cars
// ========================================
export async function createCarHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const car = await createCar(req.body as CarInput);

    return res.status(201).json({
      success: true,
      message: "Car created successfully.",
      data: car,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// UPDATE CAR
// PATCH /api/v1/cars/:id
// ========================================
export async function updateCarHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID.",
      });
    }

    const car = await updateCar(
      id,
      req.body as Partial<CarInput>,
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car updated successfully.",
      data: car,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCarHandler(
  req: import("express").Request<{id : string}>,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  try {
    const deletedCar = await deleteCar(req.params.id);

    if (!deletedCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully.",
      data: deletedCar,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// DEACTIVATE CAR
// PATCH /api/v1/cars/:id/deactivate
// ========================================
export async function deactivateCarHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID.",
      });
    }

    const car = await deactivateCar(id);

    return res.status(200).json({
      success: true,
      message: "Car deactivated successfully.",
      data: car,
    });
  } catch (error) {
    return next(error);
  }
}

// ========================================
// ACTIVATE CAR
// PATCH /api/v1/cars/:id/activate
// ========================================
export async function activateCarHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID.",
      });
    }

    const car = await activateCar(id);

    return res.status(200).json({
      success: true,
      message: "Car activated successfully.",
      data: car,
    });
  } catch (error) {
    return next(error);
  }
}