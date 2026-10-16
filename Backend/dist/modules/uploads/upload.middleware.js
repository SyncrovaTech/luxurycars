"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCarAssets = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const uploadRoot = node_path_1.default.resolve(process.cwd(), "uploads");
const directories = {
    image: node_path_1.default.join(uploadRoot, "cars", "images"),
    galleryImages: node_path_1.default.join(uploadRoot, "cars", "gallery"),
    model: node_path_1.default.join(uploadRoot, "cars", "models"),
};
Object.values(directories).forEach((directory) => {
    node_fs_1.default.mkdirSync(directory, { recursive: true });
});
const allowedImageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
];
const allowedModelExtensions = [
    ".glb",
    ".gltf",
];
const storage = multer_1.default.diskStorage({
    destination: (_req, file, callback) => {
        const directory = directories[file.fieldname];
        if (!directory) {
            return callback(new Error("Invalid upload field."), "");
        }
        callback(null, directory);
    },
    filename: (_req, file, callback) => {
        const extension = node_path_1.default
            .extname(file.originalname)
            .toLowerCase();
        const safeName = node_path_1.default
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9_-]/g, "-")
            .slice(0, 60);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}${extension}`;
        callback(null, uniqueName);
    },
});
function fileFilter(_req, file, callback) {
    const extension = node_path_1.default
        .extname(file.originalname)
        .toLowerCase();
    if (file.fieldname === "image" ||
        file.fieldname === "galleryImages") {
        const valid = allowedImageExtensions.includes(extension) &&
            [
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(file.mimetype);
        if (!valid) {
            return callback(new Error("Only JPG, PNG and WEBP images are allowed."));
        }
        return callback(null, true);
    }
    if (file.fieldname === "model") {
        const validExtension = allowedModelExtensions.includes(extension);
        const validMimeType = [
            "model/gltf-binary",
            "model/gltf+json",
            "application/octet-stream",
            "application/json",
        ].includes(file.mimetype);
        if (!validExtension || !validMimeType) {
            return callback(new Error("Only GLB and GLTF models are allowed."));
        }
        return callback(null, true);
    }
    callback(new Error("Unsupported upload field."));
}
exports.uploadCarAssets = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 22,
        fields: 10,
    },
}).fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 },
    { name: "model", maxCount: 1 },
]);
