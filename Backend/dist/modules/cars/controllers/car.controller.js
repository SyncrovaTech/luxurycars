"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCars = getCars;
exports.getFeatured = getFeatured;
exports.getCarManagementList = getCarManagementList;
exports.getCarManagementDetails = getCarManagementDetails;
exports.getCar = getCar;
exports.createCarHandler = createCarHandler;
exports.updateCarHandler = updateCarHandler;
exports.deactivateCarHandler = deactivateCarHandler;
exports.activateCarHandler = activateCarHandler;
const car_service_js_1 = require("../services/car.service.js");
// ========================================
// GET ALL ACTIVE CARS
// GET /api/v1/cars
// ========================================
async function getCars(_req, res, next) {
    try {
        const cars = await (0, car_service_js_1.getAllCars)();
        return res.status(200).json({
            success: true,
            count: cars.length,
            data: cars,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// GET FEATURED CARS
// GET /api/v1/cars/featured
// ========================================
async function getFeatured(_req, res, next) {
    try {
        const cars = await (0, car_service_js_1.getFeaturedCars)();
        return res.status(200).json({
            success: true,
            count: cars.length,
            data: cars,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// GET ALL CARS FOR ADMIN MANAGEMENT
// GET /api/v1/cars/management
// ========================================
async function getCarManagementList(_req, res, next) {
    try {
        const cars = await (0, car_service_js_1.getAllCarsForManagement)();
        return res.status(200).json({
            success: true,
            count: cars.length,
            data: cars,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// GET SINGLE CAR FOR ADMIN MANAGEMENT
// GET /api/v1/cars/management/:id
// ========================================
async function getCarManagementDetails(req, res, next) {
    try {
        const car = await (0, car_service_js_1.getCarById)(req.params.id);
        return res.status(200).json({
            success: true,
            data: car,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// GET SINGLE ACTIVE CAR BY SLUG
// GET /api/v1/cars/:slug
// ========================================
async function getCar(req, res, next) {
    try {
        const car = await (0, car_service_js_1.getCarBySlug)(req.params.slug);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: car,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// CREATE CAR
// POST /api/v1/cars
// ========================================
async function createCarHandler(req, res, next) {
    try {
        const car = await (0, car_service_js_1.createCar)(req.body);
        return res.status(201).json({
            success: true,
            message: "Car created successfully",
            data: car,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// UPDATE CAR
// PATCH /api/v1/cars/:id
// ========================================
async function updateCarHandler(req, res, next) {
    try {
        const car = await (0, car_service_js_1.updateCar)(req.params.id, req.body);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Car updated successfully",
            data: car,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// DEACTIVATE CAR
// PATCH /api/v1/cars/:id/deactivate
// ========================================
async function deactivateCarHandler(req, res, next) {
    try {
        const car = await (0, car_service_js_1.deactivateCar)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Car deactivated successfully",
            data: car,
        });
    }
    catch (error) {
        next(error);
    }
}
// ========================================
// ACTIVATE CAR
// PATCH /api/v1/cars/:id/activate
// ========================================
async function activateCarHandler(req, res, next) {
    try {
        const car = await (0, car_service_js_1.activateCar)(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Car activated successfully",
            data: car,
        });
    }
    catch (error) {
        next(error);
    }
}
