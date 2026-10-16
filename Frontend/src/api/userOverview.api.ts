import { api } from "./axios";

import type { ManagedUser } from "./users.api";

import type { Configuration } from "./configurations.api";

import type { Quotation } from "./quotations.api";

export interface UserTestDrive {
  _id: string;
  customerId: string;
  carName: string;
  carSlug: string;
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

export interface UserOverview {
  user: ManagedUser;

  summary: {
    configurations: number;
    testDrives: number;
    quotations: number;
  };

  configurations: Configuration[];
  testDrives: UserTestDrive[];
  quotations: Quotation[];
}

interface UserOverviewResponse {
  success: boolean;
  data: UserOverview;
}

export async function getUserOverview(
  userId: string,
): Promise<UserOverview> {
  const response =
    await api.get<UserOverviewResponse>(
      `/users/${userId}/overview`,
    );

  return response.data.data;
}