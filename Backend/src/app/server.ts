
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

import {
  errorMiddleware,
} from "../core/middleware/error.middleware.js";

const app = express();

/* =========================================
   PROXY
========================================= */

app.set(
  "trust proxy",
  env.NODE_ENV === "production" ? 1 : 0,
);

/* =========================================
   CORS CONFIGURATION
========================================= */

// CLIENT_URL supports comma-separated frontend URLs.
const allowedOrigins = env.CLIENT_URL
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin are allowed for server-to-server
      // requests and local health checks.
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin
        .trim()
        .replace(/\/+$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(
        new Error(`CORS blocked for origin: ${origin}`),
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  }),
);

/* =========================================
   COMMON MIDDLEWARE
========================================= */

app.use(compression());

app.use(cookieParser());

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(morgan("dev"));

/* =========================================
   STATIC UPLOADS
========================================= */

app.use(
  "/uploads",
  express.static(
    path.resolve(process.cwd(), "uploads"),
  ),
);

/* =========================================
   HEALTH CHECK
========================================= */

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Luxury Car Showroom API is running",
  });
});

/* =========================================
   AUTH ROUTES
========================================= */

app.use(
  "/api/v1/auth",
  authRoutes,
);

/* =========================================
   DASHBOARD ROUTES
========================================= */

app.use(
  "/api/v1/dashboard",
  dashboardRoutes,
);

/* =========================================
   CAR ROUTES
========================================= */

app.use(
  "/api/v1/cars",
  carRoutes,
);

/* =========================================
   SHOWROOM ROUTES
========================================= */

app.use(
  "/api/v1/showrooms",
  showroomRoutes,
);

/* =========================================
   UPLOAD ROUTES
========================================= */

app.use(
  "/api/v1/uploads",
  uploadRoutes,
);

/* =========================================
   CONFIGURATION ROUTES
========================================= */

app.use(
  "/api/v1/configurations",
  configurationRoutes,
);

/* =========================================
   TEST DRIVE ROUTES
========================================= */

app.use(
  "/api/v1/test-drives",
  testDriveRoutes,
);

/* =========================================
   QUOTATION ROUTES
========================================= */

app.use(
  "/api/v1/quotations",
  quotationRoutes,
);

/* =========================================
   USER MANAGEMENT ROUTES
========================================= */

app.use(
  "/api/v1/users",
  userRoutes,
);

/* =========================================
   ERROR HANDLER
========================================= */

app.use(errorMiddleware);

/* =========================================
   START SERVER
========================================= */

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    console.log("MongoDB connected successfully.");

    console.log(
      "Allowed frontend origins:",
      allowedOrigins,
    );

    app.listen(env.PORT, () => {
      console.log(
        `Luxury Car Showroom API running at http://localhost:${env.PORT}`,
      );

      console.log(
        `Health check: http://localhost:${env.PORT}/health`,
      );
    });
  } catch (error) {
    console.error(
      "Failed to start Luxury Car Showroom API:",
      error,
    );

    process.exit(1);
  }
}

void startServer();

export default app;
