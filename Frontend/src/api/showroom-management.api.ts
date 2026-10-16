//D:\D-Luxury-Car-Showroom\Frontend\src\api\showroom-management.api.ts
import api from "./axios";

export interface ShowroomOpeningHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Showroom {
  _id: string;
  name: string;
  slug: string;
  branchCode: string;
  description?: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  phoneNumbers: string[];
  email: string;

  mapUrl?: string;
  latitude?: number;
  longitude?: number;

  openingHours: ShowroomOpeningHour[];

  imageUrl?: string;
  galleryImages: string[];

  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShowroomPayload {
  name: string;
  slug: string;
  branchCode: string;
  description?: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  phoneNumbers: string[];
  email: string;

  mapUrl?: string;
  latitude?: number;
  longitude?: number;

  openingHours: ShowroomOpeningHour[];

  imageUrl?: string;
  galleryImages: string[];

  isActive: boolean;
}

export interface ShowroomListResult {
  success: boolean;
  showrooms: Showroom[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getManagementShowrooms = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<ShowroomListResult> => {
  const response = await api.get<ShowroomListResult>(
    "/showrooms/management",
    {
      params: {
        page,
        limit,
        search: search || undefined,
      },
    }
  );

  return response.data;
};

export const getManagementShowroomById = async (
  id: string
): Promise<Showroom> => {
  const response = await api.get<{
    success: boolean;
    showroom: Showroom;
  }>(`/showrooms/management/${id}`);

  return response.data.showroom;
};

export const createShowroom = async (
  payload: ShowroomPayload
): Promise<Showroom> => {
  const response = await api.post<{
    success: boolean;
    showroom: Showroom;
  }>("/showrooms", payload);

  return response.data.showroom;
};

export const updateShowroom = async (
  id: string,
  payload: Partial<ShowroomPayload>
): Promise<Showroom> => {
  const response = await api.patch<{
    success: boolean;
    showroom: Showroom;
  }>(`/showrooms/${id}`, payload);

  return response.data.showroom;
};

export const updateShowroomStatus = async (
  id: string,
  isActive: boolean
): Promise<Showroom> => {
  const response = await api.patch<{
    success: boolean;
    showroom: Showroom;
  }>(`/showrooms/${id}/status`, {
    isActive,
  });

  return response.data.showroom;
};

export const deleteShowroom = async (
  id: string
): Promise<void> => {
  await api.delete(`/showrooms/${id}`);
};