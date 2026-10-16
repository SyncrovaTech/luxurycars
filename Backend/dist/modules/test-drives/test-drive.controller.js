"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestDrive = createTestDrive;
exports.listTestDrives = listTestDrives;
exports.cancelCustomerTestDrive = cancelCustomerTestDrive;
exports.changeTestDriveStatus = changeTestDriveStatus;
const test_drive_service_js_1 = require("./test-drive.service.js");
function getUserId(req) {
    const user = req.user;
    return user?.userId || null;
}
async function createTestDrive(req, res, next) {
    try {
        const customerId = getUserId(req);
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const testDrive = await (0, test_drive_service_js_1.bookTestDrive)(customerId, req.body);
        return res.status(201).json({
            success: true,
            message: "Test drive booked successfully.",
            data: testDrive,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Customer: get own test drives.
 * Staff: get all customers' test drives.
 */
async function listTestDrives(req, res, next) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const user = req.user;
        const role = user.role;
        const staffRoles = [
            "MANAGER",
            "ADMIN",
            "SUPER_ADMIN",
        ];
        const testDrives = staffRoles.includes(role)
            ? await (0, test_drive_service_js_1.getAllTestDrives)()
            : await (0, test_drive_service_js_1.getCustomerTestDrives)(userId);
        return res.status(200).json({
            success: true,
            data: testDrives,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Customer: cancel own test drive.
 * Staff: cancel any test drive.
 */
async function cancelCustomerTestDrive(req, res, next) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const user = req.user;
        const role = user.role;
        const staffRoles = [
            "MANAGER",
            "ADMIN",
            "SUPER_ADMIN",
        ];
        const testDrive = staffRoles.includes(role)
            ? await (0, test_drive_service_js_1.cancelTestDriveAsStaff)(req.params.id)
            : await (0, test_drive_service_js_1.cancelTestDrive)(userId, req.params.id);
        if (!testDrive) {
            return res.status(404).json({
                success: false,
                message: "Test drive not found or cannot be cancelled.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Test drive cancelled successfully.",
            data: testDrive,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Staff: update test drive status.
 */
async function changeTestDriveStatus(req, res, next) {
    try {
        const { status } = req.body;
        const testDrive = await (0, test_drive_service_js_1.updateTestDriveStatus)(req.params.id, status);
        if (!testDrive) {
            return res.status(404).json({
                success: false,
                message: "Test drive not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Test drive status updated successfully.",
            data: testDrive,
        });
    }
    catch (error) {
        next(error);
    }
}
