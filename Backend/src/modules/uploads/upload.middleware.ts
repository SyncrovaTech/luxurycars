
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadRoot = path.resolve(process.cwd(), "uploads");

const directories: Record<string, string> = {
  image: path.join(uploadRoot, "cars", "images"),
  galleryImages: path.join(uploadRoot, "cars", "gallery"),
  model: path.join(uploadRoot, "cars", "models"),
};

Object.values(directories).forEach((directory) => {
  fs.mkdirSync(directory, { recursive: true });
});

const allowedImageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const allowedModelExtensions = [".glb", ".gltf"];

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    const directory = directories[file.fieldname];

    if (!directory) {
      return callback(new Error("Invalid upload field."), "");
    }

    callback(null, directory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 60);

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}${extension}`;

    callback(null, uniqueName);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    file.fieldname === "image" ||
    file.fieldname === "galleryImages"
  ) {
    const validExtension = allowedImageExtensions.includes(extension);

    const validMimeType = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/octet-stream",
    ].includes(file.mimetype);

    if (!validExtension || !validMimeType) {
      return callback(
        new Error(
          `Invalid image "${file.originalname}". Use JPG, JPEG, PNG or WEBP.`,
        ),
      );
    }

    return callback(null, true);
  }

  if (file.fieldname === "model") {
    if (!allowedModelExtensions.includes(extension)) {
      return callback(
        new Error(
          `Invalid model "${file.originalname}". Only GLB and GLTF files are allowed.`,
        ),
      );
    }

    return callback(null, true);
  }

  return callback(
    new Error(`Unsupported upload field: ${file.fieldname}.`),
  );
}

export const uploadCarAssets = multer({
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
