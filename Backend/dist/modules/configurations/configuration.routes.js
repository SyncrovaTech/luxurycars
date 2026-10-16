"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.routes.ts
const express_1 = require("express");
const auth_middleware_js_1 = require("../../core/middleware/auth.middleware.js");
const user_model_js_1 = require("../users/user.model.js");
const configuration_controller_js_1 = require("./configuration.controller.js");
const router = (0, express_1.Router)();
/* =========================================================
   AUTHENTICATION
========================================================= */
router.use(auth_middleware_js_1.authenticate);
/* =========================================================
   CREATE CONFIGURATION
========================================================= */
router.post("/", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), configuration_controller_js_1.createConfiguration);
/* =========================================================
   LIST CONFIGURATIONS
========================================================= */
router.get("/", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), configuration_controller_js_1.listConfigurations);
/* =========================================================
   GET CONFIGURATION BY ID
========================================================= */
router.get("/:id", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), configuration_controller_js_1.getConfiguration);
/* =========================================================
   DELETE CONFIGURATION
========================================================= */
router.delete("/:id", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), configuration_controller_js_1.removeConfiguration);
exports.default = router;
