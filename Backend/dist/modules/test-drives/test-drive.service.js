"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookTestDrive = bookTestDrive;
exports.getCustomerTestDrives = getCustomerTestDrives;
exports.getAllTestDrives = getAllTestDrives;
exports.cancelTestDrive = cancelTestDrive;
exports.cancelTestDriveAsStaff = cancelTestDriveAsStaff;
exports.updateTestDriveStatus = updateTestDriveStatus;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.service.ts
const mongoose_1 = __importDefault(require("mongoose"));
const test_drive_model_js_1 = require("./test-drive.model.js");
/**
 * Book a test drive for the authenticated customer.
 */
async function bookTestDrive(customerId, data) {
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid customer ID.");
    }
    const selectedDate = new Date(data.date);
    if (Number.isNaN(selectedDate.getTime())) {
        throw new Error("Invalid test drive date.");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        throw new Error("Test drive date cannot be in the past.");
    }
    const existing = await test_drive_model_js_1.TestDrive.findOne({
        customerId,
        date: selectedDate,
        time: data.time,
        status: {
            $ne: "CANCELLED",
        },
    });
    if (existing) {
        throw new Error("You already have a test drive booked for this date and time.");
    }
    return test_drive_model_js_1.TestDrive.create({
        customerId: new mongoose_1.default.Types.ObjectId(customerId),
        carId: data.carId &&
            mongoose_1.default.Types.ObjectId.isValid(data.carId)
            ? new mongoose_1.default.Types.ObjectId(data.carId)
            : undefined,
        carSlug: data.carSlug,
        carName: data.carName,
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        date: selectedDate,
        time: data.time,
        location: data.location,
        notes: data.notes,
        status: "PENDING",
    });
}
/**
 * Get test drives belonging to one customer.
 */
async function getCustomerTestDrives(customerId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid customer ID.");
    }
    return test_drive_model_js_1.TestDrive.find({
        customerId,
    })
        .sort({
        date: -1,
        createdAt: -1,
    })
        .lean();
}
/**
 * Get every customer's test drives.
 * Use only from authorized staff routes.
 */
async function getAllTestDrives() {
    return test_drive_model_js_1.TestDrive.find({})
        .sort({
        date: -1,
        createdAt: -1,
    })
        .lean();
}
/**
 * Cancel a test drive owned by the customer.
 */
async function cancelTestDrive(customerId, testDriveId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid customer ID.");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(testDriveId)) {
        throw new Error("Invalid test drive ID.");
    }
    return test_drive_model_js_1.TestDrive.findOneAndUpdate({
        _id: testDriveId,
        customerId,
        status: {
            $nin: ["CANCELLED", "COMPLETED"],
        },
    }, {
        $set: {
            status: "CANCELLED",
        },
    }, {
        new: true,
        runValidators: true,
    }).lean();
}
/**
 * Staff cancellation.
 * Does not require the test drive to belong to the logged-in staff member.
 */
async function cancelTestDriveAsStaff(testDriveId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(testDriveId)) {
        throw new Error("Invalid test drive ID.");
    }
    return test_drive_model_js_1.TestDrive.findOneAndUpdate({
        _id: testDriveId,
        status: {
            $nin: ["CANCELLED", "COMPLETED"],
        },
    }, {
        $set: {
            status: "CANCELLED",
        },
    }, {
        new: true,
        runValidators: true,
    }).lean();
}
/**
 * Update the status of any test drive.
 * Call only from an authorized staff route.
 */
async function updateTestDriveStatus(testDriveId, status) {
    if (!mongoose_1.default.Types.ObjectId.isValid(testDriveId)) {
        throw new Error("Invalid test drive ID.");
    }
    const allowedStatuses = [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
    ];
    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid test drive status.");
    }
    return test_drive_model_js_1.TestDrive.findByIdAndUpdate(testDriveId, {
        $set: {
            status,
        },
    }, {
        new: true,
        runValidators: true,
    }).lean();
}
