// D:\D-Luxury-Car-Showroom\Frontend\src\api\cars.api.ts
import { api } from "./axios";

export type CarCategory =
  | "Sedan"
  | "SUV"
  | "Coupe"
  | "Electric";

export type FuelType =
  | "PETROL"
  | "DIESEL"
  | "HYBRID"
  | "ELECTRIC";

export interface CarColor {
  _id?: string;
  name: string;
  hex: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CarWheel {
  _id?: string;
  name: string;
  size?: number;
  design?: string;
  imageUrl?: string;
  price: number;
  isAvailable?: boolean;
}

export interface CarInterior {
  _id?: string;
  name: string;
  color: string;
  material?: string;
  imageUrl?: string;
  price: number;
  isAvailable?: boolean;
}

export interface CarEngine {
  _id?: string;
  name: string;
  fuelType: FuelType;
  displacementCc?: number;
  cylinders?: number;
  horsepower?: number;
  torqueNm?: number;
  transmission?: string;
  drivetrain?: string;
  batteryCapacityKwh?: number;
  rangeKm?: number;
  chargingTimeHours?: number;
  price: number;
  isAvailable?: boolean;
}

export interface CarVariant {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
}

export interface CarSpecifications {
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
}

export interface Car {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  model?: string;
  year?: number;
  category: CarCategory;
  basePrice: number;
  description: string;
  shortDescription?: string;

  colors: CarColor[];
  wheels: CarWheel[];
  interiors: CarInterior[];
  engines?: CarEngine[];
  variants?: CarVariant[];

  specifications?: CarSpecifications;

  features?: string[];
  safetyFeatures?: string[];
  technologyFeatures?: string[];

  imageUrl?: string;
  galleryImages?: string[];
  modelUrl?: string;

  stockQuantity?: number;
  featured: boolean;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export type CarInput = Omit<
  Car,
  "_id" | "createdAt" | "updatedAt"
>;

// ========================================
// RESPONSE TYPE
// ========================================
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

// ========================================
// GET ALL ACTIVE CARS
// GET /api/v1/cars
// ========================================
export async function getCars(): Promise<Car[]> {
  const response = await api.get<ApiResponse<Car[]>>("/cars");

  return response.data.data;
}

// ========================================
// GET FEATURED CARS
// GET /api/v1/cars/featured
// ========================================
export async function getFeaturedCars(): Promise<Car[]> {
  const response =
    await api.get<ApiResponse<Car[]>>("/cars/featured");

  return response.data.data;
}

// ========================================
// GET CAR BY ID OR SLUG
// GET /api/v1/cars/:identifier
// ========================================
export async function getCarBySlug(
  identifier: string,
): Promise<Car> {
  if (!identifier?.trim()) {
    throw new Error("Car ID or slug is required.");
  }

  const response = await api.get<ApiResponse<Car>>(
    `/cars/${encodeURIComponent(identifier.trim())}`,
  );

  return response.data.data;
}

// ========================================
// GET CARS FOR ADMIN MANAGEMENT
// GET /api/v1/cars/management
// ========================================
export async function getManagedCars(): Promise<Car[]> {
  const response =
    await api.get<ApiResponse<Car[]>>("/cars/management");

  return response.data.data;
}

// ========================================
// GET SINGLE CAR FOR MANAGEMENT BY ID
// GET /api/v1/cars/management/:id
// ========================================
export async function getManagedCarById(
  id: string,
): Promise<Car> {
  const response = await api.get<ApiResponse<Car>>(
    `/cars/management/${encodeURIComponent(id)}`,
  );

  return response.data.data;
}

// ========================================
// CREATE CAR
// POST /api/v1/cars
// ========================================
export async function createCar(
  payload: CarInput,
): Promise<Car> {
  const response = await api.post<ApiResponse<Car>>(
    "/cars",
    payload,
  );

  return response.data.data;
}

// ========================================
// UPDATE CAR
// PATCH /api/v1/cars/:id
// ========================================
export async function updateCar(
  id: string,
  payload: Partial<CarInput>,
): Promise<Car> {
  const response = await api.patch<ApiResponse<Car>>(
    `/cars/${encodeURIComponent(id)}`,
    payload,
  );

  return response.data.data;
}

// ========================================
// ACTIVATE CAR
// PATCH /api/v1/cars/:id/activate
// ========================================
export async function activateCar(
  id: string,
): Promise<Car> {
  const response = await api.patch<ApiResponse<Car>>(
    `/cars/${encodeURIComponent(id)}/activate`,
  );

  return response.data.data;
}

// ========================================
// DEACTIVATE CAR
// PATCH /api/v1/cars/:id/deactivate
// ========================================
export async function deactivateCar(
  id: string,
): Promise<Car> {
  const response = await api.patch<ApiResponse<Car>>(
    `/cars/${encodeURIComponent(id)}/deactivate`,
  );

  return response.data.data;
}