"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quotation = void 0;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const quotationSchema = new mongoose_1.Schema({
    quotationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    configurationId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    carId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    carSlug: {
        type: String,
        required: true,
        trim: true,
    },
    carName: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
    wheel: {
        type: String,
        required: true,
        trim: true,
    },
    interior: {
        type: String,
        required: true,
        trim: true,
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    finalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    taxAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    quotationTotal: {
        type: Number,
        required: true,
        min: 0,
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    customerEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    customerMobile: {
        type: String,
        required: true,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: [
            "PENDING",
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED",
            "EXPIRED",
        ],
        default: "PENDING",
    },
    validUntil: {
        type: Date,
    },
}, {
    timestamps: true,
});
quotationSchema.index({
    customerId: 1,
    createdAt: -1,
});
exports.Quotation = mongoose_1.default.models.Quotation ||
    mongoose_1.default.model("Quotation", quotationSchema);
