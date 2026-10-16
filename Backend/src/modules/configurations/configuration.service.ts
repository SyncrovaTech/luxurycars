//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.service.ts
import mongoose from "mongoose";

import {
  Configuration,
} from "./configuration.model.js";

import type {
  SaveConfigurationRequest,
} from "./configuration.types.js";

export async function saveConfiguration(
  customerId: string,
  data: SaveConfigurationRequest,
) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID.");
  }

  const configuration =
    await Configuration.create({
      customerId:
        new mongoose.Types.ObjectId(customerId),

      carId:
        data.carId &&
        mongoose.Types.ObjectId.isValid(data.carId)
          ? new mongoose.Types.ObjectId(data.carId)
          : undefined,

      carSlug: data.carSlug,
      carName: data.carName,

      color: data.color,
      wheel: data.wheel,
      interior: data.interior,

      engine: data.engine,
      variant: data.variant,

      basePrice: data.basePrice,
      finalPrice: data.finalPrice,

      status: "SAVED",
    });

  return configuration;
}

export async function getCustomerConfigurations(
  customerId: string,
) {
  return Configuration.find({
    customerId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
}

export async function getConfigurationById(
  customerId: string,
  configurationId: string,
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      configurationId,
    )
  ) {
    throw new Error(
      "Invalid configuration ID.",
    );
  }

  return Configuration.findOne({
    _id: configurationId,
    customerId,
  }).lean();
}

export async function deleteConfiguration(
  customerId: string,
  configurationId: string,
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      configurationId,
    )
  ) {
    throw new Error(
      "Invalid configuration ID.",
    );
  }

  return Configuration.findOneAndDelete({
    _id: configurationId,
    customerId,
  });
}