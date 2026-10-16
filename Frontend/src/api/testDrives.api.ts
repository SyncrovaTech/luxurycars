//D:\D-Luxury-Car-Showroom\Frontend\src\api\testDrives.api.ts
import { api } from "./axios";

export interface TestDrive {
  _id: string;

  customerId: string;

  carId?: string;

  carSlug: string;
  carName: string;

  fullName: string;
  email: string;
  mobile: string;

  date: string;
  time: string;

  location: string;

  notes?: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";

  createdAt: string;
  updatedAt: string;
}

export interface BookTestDrivePayload {
  carId?: string;

  carSlug: string;
  carName: string;

  fullName: string;
  email: string;
  mobile: string;

  date: string;
  time: string;

  location: string;

  notes?: string;
}

export async function bookTestDrive(
  payload: BookTestDrivePayload,
) {
  const response = await api.post(
    "/test-drives",
    payload,
  );

  return response.data;
}

export async function getMyTestDrives() {
  const response = await api.get(
    "/test-drives",
  );

  return response.data;
}

export async function cancelTestDrive(
  id: string,
) {
  const response = await api.patch(
    `/test-drives/${id}/cancel`,
  );

  return response.data;
}

