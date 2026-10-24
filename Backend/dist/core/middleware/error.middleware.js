"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const app_error_js_1 = require("../utils/app-error.js");
function errorMiddleware(error, req, res, next) {
    console.error(error);
    if (error instanceof app_error_js_1.AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
