"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCars = getAllCars;
exports.getAllCarsForManagement = getAllCarsForManagement;
exports.getFeaturedCars = getFeaturedCars;
exports.getCarBySlug = getCarBySlug;
exports.getCarById = getCarById;
exports.createCar = createCar;
exports.updateCar = updateCar;
exports.deactivateCar = deactivateCar;
exports.activateCar = activateCar;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\cars\services\car.service.ts
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_js_1 = require("../models/car.model.js");
function normalizeCarInput(data) {
    return {
        ...data,
        name: data.name.trim(),
        slug: data.slug.trim().toLowerCase(),
        brand: data.brand.trim(),
        model: data.model?.trim() ?? "",
        description: data.description.trim(),
        shortDescription: data.shortDescription?.trim() ?? "",
        colors: (data.colors ?? []).map((item) => ({
            ...item,
            name: item.name.trim(),
            hex: item.hex.toUpperCase(),
            price: item.price ?? 0,
        })),
        wheels: (data.wheels ?? []).map((item) => ({
            ...item,
            name: item.name.trim(),
            price: item.price ?? 0,
        })),
        interiors: (data.interiors ?? []).map((item) => ({
            ...item,
            name: item.name.trim(),
            price: item.price ?? 0,
        })),
        engines: (data.engines ?? []).map((item) => ({
            ...item,
            name: item.name.trim(),
            price: item.price ?? 0,
        })),
        variants: (data.variants ?? []).map((item) => ({
            ...item,
            name: item.name.trim(),
        })),
    };
}
function validateCarInput(data) {
    if (!data.name?.trim()) {
        throw new Error("Car name is required.");
    }
    if (!data.slug?.trim()) {
        throw new Error("Car slug is required.");
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(data.slug.trim())) {
        throw new Error("Slug must contain only letters, numbers and hyphens.");
    }
    if (!data.brand?.trim()) {
        throw new Error("Car brand is required.");
    }
    if (!Number.isFinite(data.basePrice) || data.basePrice < 0) {
        throw new Error("Base price must be a valid non-negative number.");
    }
    if (!data.description?.trim()) {
        throw new Error("Car description is required.");
    }
    for (const color of data.colors ?? []) {
        if (!/^#[0-9A-Fa-f]{6}$/.test(color.hex)) {
            throw new Error(`Invalid hex color for "${color.name}".`);
        }
        if (!Number.isFinite(color.price ?? 0) || (color.price ?? 0) < 0) {
            throw new Error(`Invalid price for color "${color.name}".`);
        }
    }
    for (const option of [
        ...(data.wheels ?? []),
        ...(data.interiors ?? []),
        ...(data.engines ?? []),
    ]) {
        if (!Number.isFinite(option.price ?? 0) || (option.price ?? 0) < 0) {
            throw new Error(`Invalid option price for "${option.name}".`);
        }
    }
    for (const variant of data.variants ?? []) {
        if (!Number.isFinite(variant.price) || variant.price < 0) {
            throw new Error(`Invalid price for variant "${variant.name}".`);
        }
    }
}
async function getAllCars() {
    return car_model_js_1.Car.find({
        isActive: true,
    })
        .sort({ createdAt: -1 })
        .lean();
}
async function getAllCarsForManagement() {
    return car_model_js_1.Car.find({})
        .sort({ createdAt: -1 })
        .lean();
}
async function getFeaturedCars() {
    return car_model_js_1.Car.find({
        isActive: true,
        featured: true,
    }).sort({
        createdAt: -1,
    }).lean();
}
async function getCarBySlug(slug) {
    return car_model_js_1.Car.findOne({
        slug: slug.trim().toLowerCase(),
        isActive: true,
    }).lean();
}
async function getCarById(id) {
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new Error("Invalid car ID.");
    }
    return car_model_js_1.Car.findById(id).lean();
}
async function createCar(data) {
    const normalized = normalizeCarInput(data);
    const existingCar = await car_model_js_1.Car.findOne({
        slug: normalized.slug,
    });
    if (existingCar) {
        throw new Error("A car with this slug already exists.");
    }
    return car_model_js_1.Car.create({
        ...normalized,
        isActive: normalized.isActive ?? true,
    });
}
async function updateCar(id, data) {
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new Error("Invalid car ID.");
    }
    const existingCar = await car_model_js_1.Car.findById(id);
    if (!existingCar) {
        return null;
    }
    const mergedData = {
        ...existingCar.toObject(),
        ...data,
    };
    validateCarInput(mergedData);
    const normalized = normalizeCarInput(mergedData);
    const duplicate = await car_model_js_1.Car.findOne({
        slug: normalized.slug,
        _id: { $ne: id },
    });
    if (duplicate) {
        throw new Error("A car with this slug already exists.");
    }
    return car_model_js_1.Car.findByIdAndUpdate(id, {
        $set: normalized,
    }, {
        new: true,
        runValidators: true,
    }).lean();
}
async function deactivateCar(id) {
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new Error("Invalid car ID.");
    }
    const car = await car_model_js_1.Car.findByIdAndUpdate(id, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
        runValidators: true,
    }).lean();
    if (!car) {
        throw new Error("Car not found.");
    }
    return car;
}
async function activateCar(id) {
    if (!mongoose_1.default.isValidObjectId(id)) {
        throw new Error("Invalid car ID.");
    }
    const car = await car_model_js_1.Car.findByIdAndUpdate(id, {
        $set: {
            isActive: true,
        },
    }, {
        new: true,
        runValidators: true,
    }).lean();
    if (!car) {
        throw new Error("Car not found.");
    }
    return car;
}
