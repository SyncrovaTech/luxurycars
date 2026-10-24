//D:\D-Luxury-Car-Showroom\Backend\src\modules\cars\services\car.service.ts
import mongoose from "mongoose";
import { Car } from "../models/car.model.js";

export interface CarInput {
  name: string;
  slug: string;
  brand: string;
  model?: string;
  year?: number;

  category: "Sedan" | "SUV" | "Coupe" | "Electric";

  basePrice: number;
  description: string;
  shortDescription?: string;

  colors?: Array<{
    name: string;
    hex: string;
    price?: number;
    imageUrl?: string;
    isAvailable?: boolean;
  }>;

  wheels?: Array<{
    name: string;
    size?: number;
    design?: string;
    imageUrl?: string;
    price?: number;
    isAvailable?: boolean;
  }>;

  interiors?: Array<{
    name: string;
    color: string;
    material?: string;
    imageUrl?: string;
    price?: number;
    isAvailable?: boolean;
  }>;

  engines?: Array<{
    name: string;
    fuelType: "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";
    displacementCc?: number;
    cylinders?: number;
    horsepower?: number;
    torqueNm?: number;
    transmission?: string;
    drivetrain?: string;
    batteryCapacityKwh?: number;
    rangeKm?: number;
    chargingTimeHours?: number;
    price?: number;
    isAvailable?: boolean;
  }>;

  variants?: Array<{
    name: string;
    description?: string;
    price: number;
    isAvailable?: boolean;
  }>;

  specifications?: {
    accelerationSeconds?: number;
    topSpeedKmh?: number;
    mileageKmpl?: number;
    seatingCapacity?: number;
    doors?: number;
    bootSpaceLitres?: number;
    lengthMm?: number;
    widthMm?: number;
    heightMm?: number;
    groundClearanceMm?: number;
  };

  features?: string[];
  safetyFeatures?: string[];
  technologyFeatures?: string[];

  imageUrl?: string;
  galleryImages?: string[];
  modelUrl?: string;

  stockQuantity?: number;
  featured?: boolean;
  isActive?: boolean;
}

function normalizeCarInput(data: CarInput) {
  return {
    ...data,

    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    brand: data.brand.trim(),
    model: data.model?.trim() ?? "",
    description: data.description.trim(),
    shortDescription: data.shortDescription?.trim() ?? "",

    colors: (data.colors ?? []).map((item) => ({
      ...item,
      name: item.name.trim(),
      hex: item.hex.toUpperCase(),
      price: item.price ?? 0,
    })),

    wheels: (data.wheels ?? []).map((item) => ({
      ...item,
      name: item.name.trim(),
      price: item.price ?? 0,
    })),

    interiors: (data.interiors ?? []).map((item) => ({
      ...item,
      name: item.name.trim(),
      price: item.price ?? 0,
    })),

    engines: (data.engines ?? []).map((item) => ({
      ...item,
      name: item.name.trim(),
      price: item.price ?? 0,
    })),

    variants: (data.variants ?? []).map((item) => ({
      ...item,
      name: item.name.trim(),
    })),
  };
}

function validateCarInput(data: CarInput) {
  if (!data.name?.trim()) {
    throw new Error("Car name is required.");
  }

  if (!data.slug?.trim()) {
    throw new Error("Car slug is required.");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(data.slug.trim())) {
    throw new Error(
      "Slug must contain only letters, numbers and hyphens.",
    );
  }

  if (!data.brand?.trim()) {
    throw new Error("Car brand is required.");
  }

  if (!Number.isFinite(data.basePrice) || data.basePrice < 0) {
    throw new Error("Base price must be a valid non-negative number.");
  }

  if (!data.description?.trim()) {
    throw new Error("Car description is required.");
  }

  for (const color of data.colors ?? []) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color.hex)) {
      throw new Error(`Invalid hex color for "${color.name}".`);
    }

    if (!Number.isFinite(color.price ?? 0) || (color.price ?? 0) < 0) {
      throw new Error(`Invalid price for color "${color.name}".`);
    }
  }

  for (const option of [
    ...(data.wheels ?? []),
    ...(data.interiors ?? []),
    ...(data.engines ?? []),
  ]) {
    if (!Number.isFinite(option.price ?? 0) || (option.price ?? 0) < 0) {
      throw new Error(`Invalid option price for "${option.name}".`);
    }
  }

  for (const variant of data.variants ?? []) {
    if (!Number.isFinite(variant.price) || variant.price < 0) {
      throw new Error(`Invalid price for variant "${variant.name}".`);
    }
  }
}

export async function getAllCars() {
  return Car.find({
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getAllCarsForManagement() {
  return Car.find({})
    .sort({ createdAt: -1 })
    .lean();
}

export async function getFeaturedCars() {
  return Car.find({
    isActive: true,
    featured: true,
  }).sort({
    createdAt: -1,
  }).lean();
}

export async function getCarBySlug(slug: string) {
  return Car.findOne({
    slug: slug.trim().toLowerCase(),
    isActive: true,
  }).lean();
}

export async function getCarById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid car ID.");
  }

  return Car.findById(id).lean();
}

export async function createCar(data: CarInput) {
  const normalized = normalizeCarInput(data);

  const existingCar = await Car.findOne({
    slug: normalized.slug,
  });

  if (existingCar) {
    throw new Error("A car with this slug already exists.");
  }

  return Car.create({
    ...normalized,
    isActive: normalized.isActive ?? true,
  });
}


export async function updateCar(
  id: string,
  data: Partial<CarInput>,
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid car ID.");
  }

  const existingCar = await Car.findById(id);

  if (!existingCar) {
    return null;
  }

  const mergedData = {
    ...existingCar.toObject(),
    ...data,
  } as CarInput;

  validateCarInput(mergedData);

  const normalized = normalizeCarInput(mergedData);

  const duplicate = await Car.findOne({
    slug: normalized.slug,
    _id: { $ne: id },
  });

  if (duplicate) {
    throw new Error("A car with this slug already exists.");
  }

  return Car.findByIdAndUpdate(
    id,
    {
      $set: normalized,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}

export async function deleteCar(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid car ID.");
  }

  const deletedCar = await Car.findByIdAndDelete(id).lean();

  if (!deletedCar) {
    return null;
  }

  return deletedCar;
}

export async function deactivateCar(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid car ID.");
  }

  const car = await Car.findByIdAndUpdate(
    id,
    {
      $set: {
        isActive: false,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!car) {
    throw new Error("Car not found.");
  }

  return car;
}

export async function activateCar(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid car ID.");
  }

  const car = await Car.findByIdAndUpdate(
    id,
    {
      $set: {
        isActive: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!car) {
    throw new Error("Car not found.");
  }

  return car;
}