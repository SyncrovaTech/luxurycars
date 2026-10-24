
import { useEffect, useState } from "react";

import {
  uploadCarAssets,
  type UploadedCarAssets,
} from "../../api/uploads.api";

import "../../styles/components/cars/CarAssetUpload.css";

interface Props {
  initialAssets?: Partial<UploadedCarAssets>;
  onUploaded: (assets: UploadedCarAssets) => void;
}

export default function CarAssetUpload({
  initialAssets,
  onUploaded,
}: Props) {
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [model, setModel] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    const urls = gallery.map((file) => URL.createObjectURL(file));

    setGalleryPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [gallery]);

  async function handleUpload() {
    if (!image && gallery.length === 0 && !model) {
      setError("Please select at least one file.");
      setSuccess("");
      return;
    }

    if (gallery.length > 20) {
      setError("You can select a maximum of 20 gallery images.");
      return;
    }

    const selectedFiles = [
      ...(image ? [image] : []),
      ...gallery,
      ...(model ? [model] : []),
    ];

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 100 * 1024 * 1024,
    );

    if (oversizedFile) {
      setError(`${oversizedFile.name} exceeds the 100 MB limit.`);
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const uploaded = await uploadCarAssets(
        image,
        gallery,
        model,
      );

      const combinedAssets: UploadedCarAssets = {
        imageUrl:
          uploaded.imageUrl ||
          initialAssets?.imageUrl ||
          "",

        modelUrl:
          uploaded.modelUrl ||
          initialAssets?.modelUrl ||
          "",

        galleryImages: [
          ...(initialAssets?.galleryImages ?? []),
          ...uploaded.galleryImages,
        ],
      };

      onUploaded(combinedAssets);

      setImage(null);
      setGallery([]);
      setModel(null);

      setSuccess("Car assets uploaded successfully.");
    } catch (err: unknown) {
      console.error("Asset upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="car-asset-upload">
      <h3>Car Media Upload</h3>

      <label>
        Main Car Image
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={(event) => {
            setImage(event.target.files?.[0] ?? null);
            setError("");
            setSuccess("");
          }}
        />
      </label>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Selected main car"
          className="car-asset-upload__preview"
        />
      )}

      {initialAssets?.imageUrl && !imagePreview && (
        <img
          src={initialAssets.imageUrl}
          alt="Current main car"
          className="car-asset-upload__preview"
        />
      )}

      <label>
        Gallery Images (maximum 20)
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => {
            setGallery(Array.from(event.target.files ?? []));
            setError("");
            setSuccess("");
          }}
        />
      </label>

      <div className="car-asset-upload__gallery">
        {galleryPreviews.map((url, index) => (
          <img
            key={url}
            src={url}
            alt={`Gallery preview ${index + 1}`}
          />
        ))}
      </div>

      {initialAssets?.galleryImages &&
        initialAssets.galleryImages.length > 0 && (
          <div className="car-asset-upload__gallery">
            {initialAssets.galleryImages.map((url, index) => (
              <img
                key={`${url}-${index}`}
                src={url}
                alt={`Saved gallery image ${index + 1}`}
              />
            ))}
          </div>
        )}

      <label>
        3D Model (.glb / .gltf)
        <input
          type="file"
          accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
          onChange={(event) => {
            setModel(event.target.files?.[0] ?? null);
            setError("");
            setSuccess("");
          }}
        />
      </label>

      {model && <p>Selected model: {model.name}</p>}

      {initialAssets?.modelUrl && !model && (
        <p>Existing 3D model is saved.</p>
      )}

      {error && (
        <p className="car-asset-upload__error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="car-asset-upload__success" role="status">
          {success}
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleUpload()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Selected Files"}
      </button>
    </section>
  );
}
