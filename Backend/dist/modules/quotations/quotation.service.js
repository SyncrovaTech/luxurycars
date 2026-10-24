"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuotation = createQuotation;
exports.getCustomerQuotations = getCustomerQuotations;
exports.getQuotationById = getQuotationById;
exports.getAllQuotations = getAllQuotations;
exports.updateQuotationStatus = updateQuotationStatus;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.service.ts
const mongoose_1 = __importDefault(require("mongoose"));
const quotation_model_js_1 = require("./quotation.model.js");
function generateQuotationNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BMW-Q-${timestamp}-${random}`;
}
async function createQuotation(customerId, data) {
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid customer ID.");
    }
    if (data.configurationId &&
        !mongoose_1.default.Types.ObjectId.isValid(data.configurationId)) {
        throw new Error("Invalid configuration ID.");
    }
    const quotationTotal = Math.max(0, data.finalPrice);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    const quotation = await quotation_model_js_1.Quotation.create({
        quotationNumber: generateQuotationNumber(),
        customerId: new mongoose_1.default.Types.ObjectId(customerId),
        configurationId: data.configurationId
            ? new mongoose_1.default.Types.ObjectId(data.configurationId)
            : undefined,
        carId: data.carId &&
            mongoose_1.default.Types.ObjectId.isValid(data.carId)
            ? new mongoose_1.default.Types.ObjectId(data.carId)
            : undefined,
        carSlug: data.carSlug,
        carName: data.carName,
        color: data.color,
        wheel: data.wheel,
        interior: data.interior,
        basePrice: data.basePrice,
        finalPrice: data.finalPrice,
        discountAmount: 0,
        taxAmount: 0,
        quotationTotal,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerMobile: data.customerMobile,
        notes: data.notes,
        status: "PENDING",
        validUntil,
    });
    return quotation;
}
async function getCustomerQuotations(customerId) {
    return quotation_model_js_1.Quotation.find({
        customerId,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
}
async function getQuotationById(customerId, quotationId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(quotationId)) {
        throw new Error("Invalid quotation ID.");
    }
    return quotation_model_js_1.Quotation.findOne({
        _id: quotationId,
        customerId,
    }).lean();
}
async function getAllQuotations() {
    return quotation_model_js_1.Quotation.find()
        .sort({
        createdAt: -1,
    })
        .lean();
}
async function updateQuotationStatus(quotationId, data) {
    if (!mongoose_1.default.Types.ObjectId.isValid(quotationId)) {
        throw new Error("Invalid quotation ID.");
    }
    const quotation = await quotation_model_js_1.Quotation.findById(quotationId);
    if (!quotation) {
        return null;
    }
    quotation.status =
        data.status;
    if (typeof data.discountAmount ===
        "number") {
        quotation.discountAmount =
            Math.max(0, data.discountAmount);
        quotation.quotationTotal =
            Math.max(0, quotation.finalPrice -
                quotation.discountAmount +
                quotation.taxAmount);
    }
    if (data.notes !== undefined) {
        quotation.notes =
            data.notes;
    }
    await quotation.save();
    return quotation;
}
