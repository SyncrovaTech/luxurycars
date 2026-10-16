"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = createConfiguration;
exports.listConfigurations = listConfigurations;
exports.getConfiguration = getConfiguration;
exports.removeConfiguration = removeConfiguration;
const configuration_service_js_1 = require("./configuration.service.js");
// Add these two functions to configuration.service.ts
// after checking your existing database model:
//
// getAllConfigurations()
// getConfigurationByIdForAdmin(id)
function getUserId(req) {
    const user = req.user;
    return (user?.userId ||
        null);
}
function isSuperAdmin(req) {
    const user = req.user;
    return user?.role === "SUPER_ADMIN";
}
async function createConfiguration(req, res, next) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const configuration = await (0, configuration_service_js_1.saveConfiguration)(userId, req.body);
        return res.status(201).json({
            success: true,
            message: "Car configuration saved successfully.",
            data: configuration,
        });
    }
    catch (error) {
        next(error);
    }
}
async function listConfigurations(req, res, next) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        if (isSuperAdmin(req)) {
            // Implement getAllConfigurations() in the service.
            return res.status(501).json({
                success: false,
                message: "Implement getAllConfigurations() in configuration.service.ts before enabling this endpoint.",
            });
        }
        const configurations = await (0, configuration_service_js_1.getCustomerConfigurations)(userId);
        return res.status(200).json({
            success: true,
            data: configurations,
        });
    }
    catch (error) {
        next(error);
    }
}
async function getConfiguration(req, res, next) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        if (isSuperAdmin(req)) {
            // Implement getConfigurationByIdForAdmin(id)
            // in configuration.service.ts.
            return res.status(501).json({
                success: false,
                message: "Implement getConfigurationByIdForAdmin() in configuration.service.ts before enabling this endpoint.",
            });
        }
        const configuration = await (0, configuration_service_js_1.getConfigurationById)(userId, req.params.id);
        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: "Configuration not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: configuration,
        });
    }
    catch (error) {
        next(error);
    }
}
async function removeConfiguration(req, res, next) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        // The current service deletes only records owned by userId.
        // Keep this ownership check until an admin-specific delete
        // function has been implemented and reviewed.
        const configuration = await (0, configuration_service_js_1.deleteConfiguration)(userId, req.params.id);
        if (!configuration) {
            return res.status(404).json({
                success: false,
                message: "Configuration not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Configuration deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
}
