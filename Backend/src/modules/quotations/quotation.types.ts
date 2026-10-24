//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.types.ts

export interface CreateQuotationRequest {
  configurationId?: string;
  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;

  engine?: string;
  variant?: string;

  basePrice: number;
  finalPrice: number;

  customerName: string;
  customerEmail: string;
  //customerMobile: string;

  notes?: string;
}

export interface UpdateQuotationStatusRequest {
  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED";

  discountAmount?: number;
  notes?: string;
}
