"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerDashboard = customerDashboard;
exports.managerDashboard = managerDashboard;
exports.adminDashboard = adminDashboard;
exports.superAdminDashboard = superAdminDashboard;
function customerDashboard(req, res) {
    return res.status(200).json({
        success: true,
        data: {
            dashboard: "CUSTOMER",
            userId: req.user?.userId,
            message: "Welcome to Customer Dashboard",
        },
    });
}
function managerDashboard(req, res) {
    return res.status(200).json({
        success: true,
        data: {
            dashboard: "MANAGER",
            userId: req.user?.userId,
            message: "Welcome to Manager Dashboard",
        },
    });
}
function adminDashboard(req, res) {
    return res.status(200).json({
        success: true,
        data: {
            dashboard: "ADMIN",
            userId: req.user?.userId,
            message: "Welcome to Admin Dashboard",
        },
    });
}
function superAdminDashboard(req, res) {
    return res.status(200).json({
        success: true,
        data: {
            dashboard: "SUPER_ADMIN",
            userId: req.user?.userId,
            message: "Welcome to Super Admin Dashboard",
            permissions: {
                customerAccess: true,
                managerAccess: true,
                adminAccess: true,
                carManagement: true,
                configurationManagement: true,
                quotationManagement: true,
                testDriveManagement: true,
                userManagement: true,
                systemSettings: true,
                reports: true,
            },
        },
    });
}
