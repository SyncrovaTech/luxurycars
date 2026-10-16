//D:\D-Luxury-Car-Showroom\Backend\src\app\server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "node:path";

import { env } from "../config/env.js";
import { connectDatabase } from "../config/database.js";

import authRoutes from "../modules/auth/auth.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import carRoutes from "../modules/cars/routes/car.routes.js";
import configurationRoutes from "../modules/configurations/configuration.routes.js";
import testDriveRoutes from "../modules/test-drives/test-drive.routes.js";
import quotationRoutes from "../modules/quotations/quotation.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import uploadRoutes from "../modules/uploads/upload.routes.js";
import showroomRoutes from "../modules/showrooms/routes/showroom.routes.js";

//import { seedCars } from "../modules/cars/car.seed.js";

import {
  errorMiddleware,
} from "../core/middleware/error.middleware.js";

const app =
  express();

/* =========================
   PROXY
========================= */

app.set(
  "trust proxy",
  env.NODE_ENV === "production"
    ? 1
    : 0
);

/* =========================
   SECURITY
========================= */

// Frontend (localhost:5173) થી Backend (localhost:5000) ની
// uploaded images/models લોડ કરવા માટે cross-origin ની મંજૂરી જરૂરી છે.
// નહીંતર ERR_BLOCKED_BY_RESPONSE.NotSameOrigin error આવે છે.
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin:
      env.CLIENT_URL,

    credentials:
      true,
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(
  compression()
);

app.use(
  cookieParser()
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(
  morgan("dev")
);

// Uploaded car images, gallery and 3D models
// Uploaded images અને 3D models browserમાં access કરી શકાય
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads")),
);

// API routes
app.use("/api/v1/uploads", uploadRoutes);

/* =========================
   HEALTH
========================= */

app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,

      message:
        "Luxury Car Showroom API is running",
    });
  }
);

/* =========================
   AUTH
========================= */

app.use(
  "/api/v1/auth",
  authRoutes
);

/* =========================
   DASHBOARD
========================= */

app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

/* =========================
   CARS
========================= */

app.use(
  "/api/v1/cars",
  carRoutes
);

app.use("/api/v1/showrooms", showroomRoutes);

/* =========================
   CAR ASSET UPLOADS
========================= */

app.use(
  "/api/v1/uploads",
  uploadRoutes
);

/* =========================
   CONFIGURATIONS
========================= */

app.use(
  "/api/v1/configurations",
  configurationRoutes
);

/* =========================
   TEST DRIVES
========================= */

app.use(
  "/api/v1/test-drives",
  testDriveRoutes
);

/* =========================
   QUOTATIONS
========================= */

app.use(
  "/api/v1/quotations",
  quotationRoutes
);

/* =========================
   USER MANAGEMENT
========================= */

app.use(
  "/api/v1/users",
  userRoutes
);

/* =========================
   ERROR HANDLER
========================= */

app.use(
  errorMiddleware
);

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    await connectDatabase();

    console.log(
      "MongoDB connected successfully."
    );

    //await seedCars();

    // console.log(
    //   "Car seeding completed successfully."
    // );

    app.listen(
      env.PORT,
      () => {
        console.log(
          `Luxury Car Showroom API running at http://localhost:${env.PORT}`
        );

        console.log(
          `Health check: http://localhost:${env.PORT}/health`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start Luxury Car Showroom API:",
      error
    );

    process.exit(1);
  }
}

startServer();