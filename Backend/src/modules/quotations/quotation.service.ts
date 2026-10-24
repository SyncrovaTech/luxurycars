
import mongoose from "mongoose";

import { Quotation } from "./quotation.model.js";

import type {
  CreateQuotationRequest,
  UpdateQuotationStatusRequest,
} from "./quotation.types.js";

function generateQuotationNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `BMW-Q-${timestamp}-${random}`;
}

function requiredText(
  value: unknown,
  field: string,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function validPrice(value: unknown, field: string): number {
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`${field} must be a valid non-negative number.`);
  }

  return price;
}

export async function createQuotation(
  customerId: string,
  data: CreateQuotationRequest,
) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID.");
  }

  if (
    data.configurationId &&
    !mongoose.Types.ObjectId.isValid(data.configurationId)
  ) {
    throw new Error("Invalid configuration ID.");
  }

  if (
    data.carId &&
    !mongoose.Types.ObjectId.isValid(data.carId)
  ) {
    throw new Error("Invalid car ID.");
  }

  const carSlug = requiredText(data.carSlug, "Car slug");
  const carName = requiredText(data.carName, "Car name");
  const color = requiredText(data.color, "Color");
  const wheel = requiredText(data.wheel, "Wheel");
  const interior = requiredText(data.interior, "Interior");

  const customerName = requiredText(data.customerName, "Customer name");
  const customerEmail = requiredText(data.customerEmail, "Customer email");
  //const customerMobile = requiredText(data.customerMobile, "Customer mobile");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new Error("Please provide a valid customer email.");
  }

  const basePrice = validPrice(data.basePrice, "Base price");
  const finalPrice = validPrice(data.finalPrice, "Final price");

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  const quotation = await Quotation.create({
    quotationNumber: generateQuotationNumber(),

    customerId: new mongoose.Types.ObjectId(customerId),

    configurationId: data.configurationId
      ? new mongoose.Types.ObjectId(data.configurationId)
      : undefined,

    carId: data.carId
      ? new mongoose.Types.ObjectId(data.carId)
      : undefined,

    carSlug,
    carName,

    color,
    wheel,
    interior,

    engine: data.engine?.trim() || "Standard",
    variant: data.variant?.trim() || "Standard",

    basePrice,
    finalPrice,

    discountAmount: 0,
    taxAmount: 0,
    quotationTotal: finalPrice,

    customerName,
    customerEmail: customerEmail.toLowerCase(),
    //customerMobile,

    notes: data.notes?.trim() || undefined,

    status: "PENDING",
    validUntil,
  });

  return quotation;
}

export async function getCustomerQuotations(customerId: string) {
  return Quotation.find({ customerId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getQuotationById(
  customerId: string,
  quotationId: string,
) {
  if (!mongoose.Types.ObjectId.isValid(quotationId)) {
    throw new Error("Invalid quotation ID.");
  }

  return Quotation.findOne({
    _id: quotationId,
    customerId,
  }).lean();
}

export async function getAllQuotations() {
  return Quotation.find()
    .sort({ createdAt: -1 })
    .lean();
}

export async function updateQuotationStatus(
  quotationId: string,
  data: UpdateQuotationStatusRequest,
) {
  if (!mongoose.Types.ObjectId.isValid(quotationId)) {
    throw new Error("Invalid quotation ID.");
  }

  const quotation = await Quotation.findById(quotationId);

  if (!quotation) {
    return null;
  }

  quotation.status = data.status;

  if (typeof data.discountAmount === "number") {
    if (
      !Number.isFinite(data.discountAmount) ||
      data.discountAmount < 0
    ) {
      throw new Error("Discount amount must be a non-negative number.");
    }

    quotation.discountAmount = Math.min(
      data.discountAmount,
      quotation.finalPrice + quotation.taxAmount,
    );

    quotation.quotationTotal = Math.max(
      0,
      quotation.finalPrice -
        quotation.discountAmount +
        quotation.taxAmount,
    );
  }

  if (data.notes !== undefined) {
    quotation.notes = data.notes;
  }

  await quotation.save();

  return quotation;
}
