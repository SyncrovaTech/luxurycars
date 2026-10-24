"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
//D:\D-Luxury-Car-Showroom\Backend\src\core\utils\app-error.ts
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
