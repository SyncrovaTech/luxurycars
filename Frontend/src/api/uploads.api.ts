
import { api } from "./axios";

export interface UploadedCarAssets {
  imageUrl: string;
  modelUrl: string;
  galleryImages: string[];
}

type UploadResponse = {
  success: boolean;
  message: string;
  data: UploadedCarAssets;
};

export async function uploadCarAssets(
  image: File | null,
  galleryImages: File[],
  model: File | null,
): Promise<UploadedCarAssets> {
  const formData = new FormData();

  if (image) {
    formData.append("image", image);
  }

  galleryImages.forEach((file) => {
    formData.append("galleryImages", file);
  });

  if (model) {
    formData.append("model", model);
  }

  if (!image && galleryImages.length === 0 && !model) {
    throw new Error("Please select at least one file.");
  }

  try {
    const response = await api.post<UploadResponse>(
      "/uploads/car-assets",
      formData,
      {
        // Browser multipart boundary જાતે ઉમેરશે.
        headers: {
          "Content-Type": undefined,
        },
      },
    );

    if (!response.data?.success || !response.data.data) {
      throw new Error(
        response.data?.message || "Upload response is invalid.",
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Car assets upload failed.";

    console.error("Car asset upload error:", {
      message,
      response: err.response?.data,
    });

    throw new Error(message);
  }
}
