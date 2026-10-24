//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../../core/middleware/auth.middleware.js";

import {
  UserRole,
} from "../users/user.model.js";

import {
  createConfiguration,
  listConfigurations,
  getConfiguration,
  removeConfiguration,
} from "./configuration.controller.js";

const router = Router();

/* =========================================================
   AUTHENTICATION
========================================================= */

router.use(authenticate);

/* =========================================================
   CREATE CONFIGURATION
========================================================= */

router.post(
  "/",
  authorize(UserRole.CUSTOMER),
  createConfiguration
);

/* =========================================================
   LIST CONFIGURATIONS
========================================================= */

router.get(
  "/",
  authorize(UserRole.CUSTOMER),
  listConfigurations
);

/* =========================================================
   GET CONFIGURATION BY ID
========================================================= */

router.get(
  "/:id",
  authorize(UserRole.CUSTOMER),
  getConfiguration
);

/* =========================================================
   DELETE CONFIGURATION
========================================================= */

router.delete(
  "/:id",
  authorize(UserRole.CUSTOMER),
  removeConfiguration
);

export default router;