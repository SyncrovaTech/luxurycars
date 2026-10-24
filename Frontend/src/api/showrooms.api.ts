//D:\D-Luxury-Car-Showroom\Frontend\src\api\showrooms.api.ts
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

interface ShowroomListResponse {
  success: boolean;
  showrooms: Showroom[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ShowroomDetailResponse {
  success: boolean;
  showroom: Showroom;
}

export interface ShowroomFilters {
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getShowrooms = async (
  filters: ShowroomFilters = {}
): Promise<ShowroomListResponse> => {
  const response = await api.get<ShowroomListResponse>(
    "/showrooms",
    {
      params: filters,
    }
  );

  return response.data;
};

export const getShowroomBySlug = async (
  slug: string
): Promise<Showroom> => {
  const response = await api.get<ShowroomDetailResponse>(
    `/showrooms/${encodeURIComponent(slug)}`
  );

  return response.data.showroom;
};