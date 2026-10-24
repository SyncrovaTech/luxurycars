//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../../core/middleware/auth.middleware.js";

import {
  UserRole,
} from "../users/user.model.js";

import {
  createQuotationController,
  listCustomerQuotations,
  getCustomerQuotation,
  listAllQuotations,
  updateQuotation,
} from "./quotation.controller.js";

const router = Router();

/* =========================================================
   AUTHENTICATION
========================================================= */

router.use(authenticate);

/* =========================================================
   CUSTOMER — CREATE QUOTATION
========================================================= */

router.post(
  "/",
  authorize(UserRole.CUSTOMER),
  createQuotationController
);

/* =========================================================
   CUSTOMER — MY QUOTATIONS
========================================================= */

router.get(
  "/my",
  authorize(UserRole.CUSTOMER),
  listCustomerQuotations
);

/* =========================================================
   CUSTOMER — MY QUOTATION DETAILS
========================================================= */

router.get(
  "/my/:id",
  authorize(UserRole.CUSTOMER),
  getCustomerQuotation
);

/* =========================================================
   ADMIN / MANAGER / SUPER ADMIN
   VIEW ALL QUOTATIONS
========================================================= */

router.get(
  "/",
  authorize(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SUPER_ADMIN
  ),
  listAllQuotations
);

/* =========================================================
   ADMIN / MANAGER / SUPER ADMIN
   UPDATE QUOTATION
========================================================= */

router.patch(
  "/:id",
  authorize(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SUPER_ADMIN
  ),
  updateQuotation
);

export default router;