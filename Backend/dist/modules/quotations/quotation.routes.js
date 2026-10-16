"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.routes.ts
const express_1 = require("express");
const auth_middleware_js_1 = require("../../core/middleware/auth.middleware.js");
const user_model_js_1 = require("../users/user.model.js");
const quotation_controller_js_1 = require("./quotation.controller.js");
const router = (0, express_1.Router)();
/* =========================================================
   AUTHENTICATION
========================================================= */
router.use(auth_middleware_js_1.authenticate);
/* =========================================================
   CUSTOMER — CREATE QUOTATION
========================================================= */
router.post("/", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), quotation_controller_js_1.createQuotationController);
/* =========================================================
   CUSTOMER — MY QUOTATIONS
========================================================= */
router.get("/my", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), quotation_controller_js_1.listCustomerQuotations);
/* =========================================================
   CUSTOMER — MY QUOTATION DETAILS
========================================================= */
router.get("/my/:id", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), quotation_controller_js_1.getCustomerQuotation);
/* =========================================================
   ADMIN / MANAGER / SUPER ADMIN
   VIEW ALL QUOTATIONS
========================================================= */
router.get("/", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.MANAGER, user_model_js_1.UserRole.SUPER_ADMIN), quotation_controller_js_1.listAllQuotations);
/* =========================================================
   ADMIN / MANAGER / SUPER ADMIN
   UPDATE QUOTATION
========================================================= */
router.patch("/:id", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.MANAGER, user_model_js_1.UserRole.SUPER_ADMIN), quotation_controller_js_1.updateQuotation);
exports.default = router;
