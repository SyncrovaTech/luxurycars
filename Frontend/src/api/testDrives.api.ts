// Frontend/src/api/testDrives.api.ts

import api from "./axios";

export type TestDriveStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

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

  showroomId: string;
  location: string;

  notes?: string;
  status: TestDriveStatus;

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

  showroomId: string;
  location: string;

  notes?: string;
}

export interface TestDriveApiResponse {
  success: boolean;
  message?: string;
  testDrive?: TestDrive;
  data?: TestDrive;
}

export const bookTestDrive = async (
  payload: BookTestDrivePayload
): Promise<TestDriveApiResponse> => {
  const response = await api.post<TestDriveApiResponse>(
    "/test-drives",
    payload
  );

  return response.data;
};

export const getMyTestDrives = async () => {
  const response = await api.get("/test-drives");
  return response.data;
};

export const cancelTestDrive = async (id: string) => {
  const response = await api.patch(
    `/test-drives/${encodeURIComponent(id)}/cancel`
  );

  return response.data;
};