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
exports.Car = void 0;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\cars\models
const mongoose_1 = __importStar(require("mongoose"));
const nonNegativePrice = {
    type: Number,
    default: 0,
    min: 0,
};
const colorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    hex: {
        type: String,
        required: true,
        match: /^#[0-9A-Fa-f]{6}$/,
    },
    price: nonNegativePrice,
    imageUrl: {
        type: String,
        default: "",
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { _id: true });
const wheelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    size: {
        type: Number,
        min: 1,
        default: 19,
    },
    design: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        default: "",
    },
    price: nonNegativePrice,
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { _id: true });
const interiorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        match: /^#[0-9A-Fa-f]{6}$/,
    },
    material: {
        type: String,
        default: "Leather",
    },
    imageUrl: {
        type: String,
        default: "",
    },
    price: nonNegativePrice,
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { _id: true });
const engineSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    fuelType: {
        type: String,
        enum: ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"],
        required: true,
    },
    displacementCc: {
        type: Number,
        min: 0,
        default: 0,
    },
    cylinders: {
        type: Number,
        min: 0,
        default: 0,
    },
    horsepower: {
        type: Number,
        min: 0,
        default: 0,
    },
    torqueNm: {
        type: Number,
        min: 0,
        default: 0,
    },
    transmission: {
        type: String,
        default: "Automatic",
    },
    drivetrain: {
        type: String,
        default: "AWD",
    },
    batteryCapacityKwh: {
        type: Number,
        min: 0,
        default: 0,
    },
    rangeKm: {
        type: Number,
        min: 0,
        default: 0,
    },
    chargingTimeHours: {
        type: Number,
        min: 0,
        default: 0,
    },
    price: nonNegativePrice,
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { _id: true });
const variantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { _id: true });
const specificationSchema = new mongoose_1.Schema({
    accelerationSeconds: {
        type: Number,
        min: 0,
        default: 0,
    },
    topSpeedKmh: {
        type: Number,
        min: 0,
        default: 0,
    },
    mileageKmpl: {
        type: Number,
        min: 0,
        default: 0,
    },
    seatingCapacity: {
        type: Number,
        min: 1,
        default: 5,
    },
    doors: {
        type: Number,
        min: 1,
        default: 4,
    },
    bootSpaceLitres: {
        type: Number,
        min: 0,
        default: 0,
    },
    lengthMm: {
        type: Number,
        min: 0,
        default: 0,
    },
    widthMm: {
        type: Number,
        min: 0,
        default: 0,
    },
    heightMm: {
        type: Number,
        min: 0,
        default: 0,
    },
    groundClearanceMm: {
        type: Number,
        min: 0,
        default: 0,
    },
}, { _id: false });
const carSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    model: {
        type: String,
        default: "",
        trim: true,
    },
    year: {
        type: Number,
        min: 1900,
        max: 2100,
        default: new Date().getFullYear(),
    },
    category: {
        type: String,
        enum: ["Sedan", "SUV", "Coupe", "Electric"],
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        default: "",
        trim: true,
    },
    colors: {
        type: [colorSchema],
        default: [],
    },
    wheels: {
        type: [wheelSchema],
        default: [],
    },
    interiors: {
        type: [interiorSchema],
        default: [],
    },
    engines: {
        type: [engineSchema],
        default: [],
    },
    variants: {
        type: [variantSchema],
        default: [],
    },
    specifications: {
        type: specificationSchema,
        default: () => ({}),
    },
    features: {
        type: [String],
        default: [],
    },
    safetyFeatures: {
        type: [String],
        default: [],
    },
    technologyFeatures: {
        type: [String],
        default: [],
    },
    imageUrl: {
        type: String,
        default: "",
    },
    galleryImages: {
        type: [String],
        default: [],
    },
    modelUrl: {
        type: String,
        default: "",
    },
    stockQuantity: {
        type: Number,
        min: 0,
        default: 0,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    strict: true,
});
carSchema.index({
    isActive: 1,
    featured: 1,
    createdAt: -1,
});
exports.Car = mongoose_1.default.models.Car ||
    mongoose_1.default.model("Car", carSchema);
