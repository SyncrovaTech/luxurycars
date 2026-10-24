// D:\D-Luxury-Car-Showroom\Frontend\src\api\configurations.api.ts

import { api } from "./axios";

export interface Configuration {
  _id: string;
  customerId: string;

  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;

  // Engine and Variant
  engine: string;
  variant: string;

  basePrice: number;
  finalPrice: number;

  status: string;

  createdAt: string;
  updatedAt: string;
}

export interface SaveConfigurationPayload {
  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;

  // Engine and Variant
  engine: string;
  variant: string;

  basePrice: number;
  finalPrice: number;
}

export async function saveConfiguration(
  payload: SaveConfigurationPayload,
) {
  const response = await api.post(
    "/configurations",
    payload,
  );

  return response.data;
}

export async function getMyConfigurations() {
  const response = await api.get(
    "/configurations",
  );

  return response.data;
}

export async function deleteConfiguration(
  id: string,
) {
  const response = await api.delete(
    `/configurations/${id}`,
  );

  return response.data;
}