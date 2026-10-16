//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.service.ts
import mongoose from "mongoose";

import { TestDrive } from "./test-drive.model.js";

import type {
  BookTestDriveRequest,
} from "./test-drive.types.js";

type TestDriveStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Book a test drive for the authenticated customer.
 */
export async function bookTestDrive(
  customerId: string,
  data: BookTestDriveRequest,
) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID.");
  }

  const selectedDate = new Date(data.date);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid test drive date.");
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new Error(
      "Test drive date cannot be in the past.",
    );
  }

  const existing = await TestDrive.findOne({
    customerId,
    date: selectedDate,
    time: data.time,
    status: {
      $ne: "CANCELLED",
    },
  });

  if (existing) {
    throw new Error(
      "You already have a test drive booked for this date and time.",
    );
  }

  return TestDrive.create({
    customerId: new mongoose.Types.ObjectId(
      customerId,
    ),

    carId:
      data.carId &&
      mongoose.Types.ObjectId.isValid(data.carId)
        ? new mongoose.Types.ObjectId(data.carId)
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
export async function getCustomerTestDrives(
  customerId: string,
) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID.");
  }

  return TestDrive.find({
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
export async function getAllTestDrives() {
  return TestDrive.find({})
    .sort({
      date: -1,
      createdAt: -1,
    })
    .lean();
}

/**
 * Cancel a test drive owned by the customer.
 */
export async function cancelTestDrive(
  customerId: string,
  testDriveId: string,
) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID.");
  }

  if (!mongoose.Types.ObjectId.isValid(testDriveId)) {
    throw new Error("Invalid test drive ID.");
  }

  return TestDrive.findOneAndUpdate(
    {
      _id: testDriveId,
      customerId,
      status: {
        $nin: ["CANCELLED", "COMPLETED"],
      },
    },
    {
      $set: {
        status: "CANCELLED",
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}

/**
 * Staff cancellation.
 * Does not require the test drive to belong to the logged-in staff member.
 */
export async function cancelTestDriveAsStaff(
  testDriveId: string,
) {
  if (!mongoose.Types.ObjectId.isValid(testDriveId)) {
    throw new Error("Invalid test drive ID.");
  }

  return TestDrive.findOneAndUpdate(
    {
      _id: testDriveId,
      status: {
        $nin: ["CANCELLED", "COMPLETED"],
      },
    },
    {
      $set: {
        status: "CANCELLED",
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}

/**
 * Update the status of any test drive.
 * Call only from an authorized staff route.
 */
export async function updateTestDriveStatus(
  testDriveId: string,
  status: TestDriveStatus,
) {
  if (!mongoose.Types.ObjectId.isValid(testDriveId)) {
    throw new Error("Invalid test drive ID.");
  }

  const allowedStatuses: TestDriveStatus[] = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid test drive status.");
  }

  return TestDrive.findByIdAndUpdate(
    testDriveId,
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}