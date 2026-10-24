"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveConfiguration = saveConfiguration;
exports.getCustomerConfigurations = getCustomerConfigurations;
exports.getConfigurationById = getConfigurationById;
exports.deleteConfiguration = deleteConfiguration;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.service.ts
const mongoose_1 = __importDefault(require("mongoose"));
const configuration_model_js_1 = require("./configuration.model.js");
async function saveConfiguration(customerId, data) {
    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid customer ID.");
    }
    const configuration = await configuration_model_js_1.Configuration.create({
        customerId: new mongoose_1.default.Types.ObjectId(customerId),
        carId: data.carId &&
            mongoose_1.default.Types.ObjectId.isValid(data.carId)
            ? new mongoose_1.default.Types.ObjectId(data.carId)
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
async function getCustomerConfigurations(customerId) {
    return configuration_model_js_1.Configuration.find({
        customerId,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
}
async function getConfigurationById(customerId, configurationId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(configurationId)) {
        throw new Error("Invalid configuration ID.");
    }
    return configuration_model_js_1.Configuration.findOne({
        _id: configurationId,
        customerId,
    }).lean();
}
async function deleteConfiguration(customerId, configurationId) {
    if (!mongoose_1.default.Types.ObjectId.isValid(configurationId)) {
        throw new Error("Invalid configuration ID.");
    }
    return configuration_model_js_1.Configuration.findOneAndDelete({
        _id: configurationId,
        customerId,
    });
}
