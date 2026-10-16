"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuotationController = createQuotationController;
exports.listCustomerQuotations = listCustomerQuotations;
exports.getCustomerQuotation = getCustomerQuotation;
exports.listAllQuotations = listAllQuotations;
exports.updateQuotation = updateQuotation;
const quotation_service_js_1 = require("./quotation.service.js");
function getUserId(req) {
    const user = req.user;
    return user?.userId || null;
}
async function createQuotationController(req, res, next) {
    try {
        const customerId = getUserId(req);
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const quotation = await (0, quotation_service_js_1.createQuotation)(customerId, req.body);
        return res.status(201).json({
            success: true,
            message: "Quotation request submitted successfully.",
            data: quotation,
        });
    }
    catch (error) {
        next(error);
    }
}
async function listCustomerQuotations(req, res, next) {
    try {
        const customerId = getUserId(req);
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const quotations = await (0, quotation_service_js_1.getCustomerQuotations)(customerId);
        return res.status(200).json({
            success: true,
            data: quotations,
        });
    }
    catch (error) {
        next(error);
    }
}
async function getCustomerQuotation(req, res, next) {
    try {
        const customerId = getUserId(req);
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const quotation = await (0, quotation_service_js_1.getQuotationById)(customerId, req.params.id);
        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Quotation not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: quotation,
        });
    }
    catch (error) {
        next(error);
    }
}
async function listAllQuotations(_req, res, next) {
    try {
        const quotations = await (0, quotation_service_js_1.getAllQuotations)();
        return res.status(200).json({
            success: true,
            data: quotations,
        });
    }
    catch (error) {
        next(error);
    }
}
async function updateQuotation(req, res, next) {
    try {
        const quotation = await (0, quotation_service_js_1.updateQuotationStatus)(req.params.id, req.body);
        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Quotation not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Quotation updated successfully.",
            data: quotation,
        });
    }
    catch (error) {
        next(error);
    }
}
