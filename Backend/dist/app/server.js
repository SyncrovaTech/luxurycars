"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\app\server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const node_path_1 = __importDefault(require("node:path"));
const env_js_1 = require("../config/env.js");
const database_js_1 = require("../config/database.js");
const auth_routes_js_1 = __importDefault(require("../modules/auth/auth.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("../modules/dashboard/dashboard.routes.js"));
const car_routes_js_1 = __importDefault(require("../modules/cars/routes/car.routes.js"));
const configuration_routes_js_1 = __importDefault(require("../modules/configurations/configuration.routes.js"));
const test_drive_routes_js_1 = __importDefault(require("../modules/test-drives/test-drive.routes.js"));
const quotation_routes_js_1 = __importDefault(require("../modules/quotations/quotation.routes.js"));
const user_routes_js_1 = __importDefault(require("../modules/users/user.routes.js"));
const upload_routes_js_1 = __importDefault(require("../modules/uploads/upload.routes.js"));
//import { seedCars } from "../modules/cars/car.seed.js";
const error_middleware_js_1 = require("../core/middleware/error.middleware.js");
const app = (0, express_1.default)();
/* =========================
   PROXY
========================= */
app.set("trust proxy", env_js_1.env.NODE_ENV === "production"
    ? 1
    : 0);
/* =========================
   SECURITY
========================= */
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_js_1.env.CLIENT_URL,
    credentials: true,
}));
/* =========================
   MIDDLEWARE
========================= */
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({
    limit: "1mb",
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "1mb",
}));
app.use((0, morgan_1.default)("dev"));
// Uploaded car images, gallery and 3D models
app.use("/uploads", express_1.default.static(node_path_1.default.resolve(process.cwd(), "uploads"), {
    dotfiles: "deny",
    index: false,
    fallthrough: false,
}));
/* =========================
   HEALTH
========================= */
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Luxury Car Showroom API is running",
    });
});
/* =========================
   AUTH
========================= */
app.use("/api/v1/auth", auth_routes_js_1.default);
/* =========================
   DASHBOARD
========================= */
app.use("/api/v1/dashboard", dashboard_routes_js_1.default);
/* =========================
   CARS
========================= */
app.use("/api/v1/cars", car_routes_js_1.default);
/* =========================
   CAR ASSET UPLOADS
========================= */
app.use("/api/v1/uploads", upload_routes_js_1.default);
/* =========================
   CONFIGURATIONS
========================= */
app.use("/api/v1/configurations", configuration_routes_js_1.default);
/* =========================
   TEST DRIVES
========================= */
app.use("/api/v1/test-drives", test_drive_routes_js_1.default);
/* =========================
   QUOTATIONS
========================= */
app.use("/api/v1/quotations", quotation_routes_js_1.default);
/* =========================
   USER MANAGEMENT
========================= */
app.use("/api/v1/users", user_routes_js_1.default);
/* =========================
   ERROR HANDLER
========================= */
app.use(error_middleware_js_1.errorMiddleware);
/* =========================
   START SERVER
========================= */
async function startServer() {
    try {
        await (0, database_js_1.connectDatabase)();
        console.log("MongoDB connected successfully.");
        //await seedCars();
        // console.log(
        //   "Car seeding completed successfully."
        // );
        app.listen(env_js_1.env.PORT, () => {
            console.log(`Luxury Car Showroom API running at http://localhost:${env_js_1.env.PORT}`);
            console.log(`Health check: http://localhost:${env_js_1.env.PORT}/health`);
        });
    }
    catch (error) {
        console.error("Failed to start Luxury Car Showroom API:", error);
        process.exit(1);
    }
}
startServer();
