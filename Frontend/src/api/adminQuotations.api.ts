//D:\D-Luxury-Car-Showroom\Frontend\src\api\adminQuotations.api.ts
import { api } from "./axios";

import type {
  Quotation,
} from "./quotations.api";

export async function getAllQuotations(): Promise<Quotation[]> {
  const response =
    await api.get(
      "/quotations",
    );

  return response.data.data || [];
}

export async function updateQuotation(
  id: string,
  payload: {
    status:
      | "PENDING"
      | "UNDER_REVIEW"
      | "APPROVED"
      | "REJECTED"
      | "EXPIRED";

    discountAmount?: number;

    notes?: string;
  },
) {
  const response =
    await api.patch(
      `/quotations/${id}`,
      payload,
    );

  return response.data;
}