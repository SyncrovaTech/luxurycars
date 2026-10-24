//D:\D-Luxury-Car-Showroom\Frontend\src\api\quotations.api.ts

import { api } from "./axios";

export interface Quotation {
  _id: string;
  quotationNumber: string;
  customerId: string;
  configurationId?: string;
  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;

  // NEW
  engine: string;
  variant: string;

  basePrice: number;
  finalPrice: number;

  discountAmount: number;
  taxAmount: number;
  quotationTotal: number;

  customerName: string;
  customerEmail: string;
  //customerMobile: string;

  notes?: string;

  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED";

  validUntil?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationPayload {
  configurationId?: string;
  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;

  // NEW
  engine: string;
  variant: string;

  basePrice: number;
  finalPrice: number;

  customerName: string;
  customerEmail: string;
  //customerMobile: string;

  notes?: string;
}

export async function requestQuotation(
  payload: CreateQuotationPayload,
) {
  try {
    const response = await api.post(
      "/quotations",
      payload,
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Unable to submit quotation.";

    console.error("Quotation request failed:", {
      message,
      response: err.response?.data,
      payload,
    });

    throw new Error(message);
  }
}

export async function getMyQuotations() {
  const response = await api.get(
    "/quotations/my",
  );

  return response.data;
}

export async function getMyQuotation(
  id: string,
) {
  const response = await api.get(
    `/quotations/my/${id}`,
  );

  return response.data;
}




