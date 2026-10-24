import api from "./axios";

export interface RecommendationPreferences {
  budgetMin: number;
  budgetMax: number;
  message?: string;
  brand: string;
  category: string;
  fuelType: string;
  transmission: string;
  usage: string;
}

export interface RecommendedCar {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  fuelType: string;
  transmission: string;
  year: number;
  description: string;
  matchScore: number;
  reasons: string[];
}

interface RecommendationResponse {
  success: boolean;
  message: string;
  data: RecommendedCar[];
}

export async function getCarRecommendations(
  preferences: RecommendationPreferences,
): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>(
    "/cars/recommendations",
    preferences,
  );

  return response.data;
}