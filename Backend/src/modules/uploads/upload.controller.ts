
import type {
  Request,
  Response,
  NextFunction,
} from "express";

type UploadedFiles = {
  image?: Express.Multer.File[];
  galleryImages?: Express.Multer.File[];
  model?: Express.Multer.File[];
};

function pathToUploadUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const marker = "/uploads/";
  const index = normalized.lastIndexOf(marker);

  if (index === -1) {
    throw new Error("Uploaded file path is invalid.");
  }

  const relativePath = normalized.slice(index + marker.length);

  return `/uploads/${relativePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function getFileUrl(
  req: Request,
  file?: Express.Multer.File,
): string {
  if (!file) {
    return "";
  }

  const relativePath = pathToUploadUrl(file.path);
  return `${req.protocol}://${req.get("host")}${relativePath}`;
}

export function uploadCarAssetsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const files = (req.files ?? {}) as UploadedFiles;

    const image = files.image?.[0];
    const model = files.model?.[0];

    const galleryImages = (files.galleryImages ?? []).map(
      (file) => getFileUrl(req, file),
    );

    if (!image && !model && galleryImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one file.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car assets uploaded successfully.",
      data: {
        imageUrl: getFileUrl(req, image),
        modelUrl: getFileUrl(req, model),
        galleryImages,
      },
    });
  } catch (error) {
    return next(error);
  }
}
