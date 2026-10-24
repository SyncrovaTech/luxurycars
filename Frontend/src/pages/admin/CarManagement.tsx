
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../api/axios";
import CarAssetUpload from "../../components/cars/CarAssetUpload";
import type { UploadedCarAssets } from "../../api/uploads.api";

import "../../styles/pages/admin/CarManagement.css";

type CarCategory = "Sedan" | "SUV" | "Coupe" | "Electric";
type FuelType = "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";

type CarOption = {
  name: string;
  price: number;
  isAvailable: boolean;
  hex?: string;
  color?: string;
  imageUrl?: string;
  size?: number;
  design?: string;
  material?: string;
  description?: string;
  fuelType?: FuelType;
  horsepower?: number;
  torqueNm?: number;
  transmission?: string;
  drivetrain?: string;
  displacementCc?: number;
  cylinders?: number;
  batteryCapacityKwh?: number;
  rangeKm?: number;
  chargingTimeHours?: number;
};

type CarSpecifications = {
  accelerationSeconds?: number;
  topSpeedKmh?: number;
  mileageKmpl?: number;
  seatingCapacity?: number;
  doors?: number;
  bootSpaceLitres?: number;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  groundClearanceMm?: number;
};

type Car = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  basePrice: number;
  shortDescription: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  galleryImages: string[];
  colors: CarOption[];
  wheels: CarOption[];
  interiors: CarOption[];
  engines: CarOption[];
  variants: CarOption[];
  features: string[];
  safetyFeatures: string[];
  technologyFeatures: string[];
  specifications: CarSpecifications;
  stockQuantity: number;
  featured: boolean;
  isActive: boolean;
};

type CarForm = Omit<Car, "_id">;

type OptionField =
  | "colors"
  | "wheels"
  | "interiors"
  | "engines"
  | "variants";

type StringListField =
  | "features"
  | "safetyFeatures"
  | "technologyFeatures"
  | "galleryImages";

const emptyOption = (): CarOption => ({
  name: "",
  price: 0,
  isAvailable: true,
});

const emptyUploadedAssets = (): UploadedCarAssets => ({
  imageUrl: "",
  modelUrl: "",
  galleryImages: [],
});

const emptyForm = (): CarForm => ({
  name: "",
  slug: "",
  brand: "BMW",
  model: "",
  year: new Date().getFullYear(),
  category: "Sedan",
  basePrice: 0,
  shortDescription: "",
  description: "",
  imageUrl: "",
  modelUrl: "",
  galleryImages: [],
  colors: [
    {
      name: "Alpine White",
      hex: "#F5F5F5",
      price: 0,
      isAvailable: true,
    },
  ],
  wheels: [
    {
      name: "Standard Alloy",
      size: 18,
      design: "Standard",
      price: 0,
      isAvailable: true,
    },
  ],
  interiors: [
    {
      name: "Black Leather",
      color: "#202020",
      material: "Leather",
      price: 0,
      isAvailable: true,
    },
  ],
  engines: [
    {
      name: "Standard Engine",
      fuelType: "PETROL",
      horsepower: 0,
      torqueNm: 0,
      transmission: "Automatic",
      drivetrain: "RWD",
      price: 0,
      isAvailable: true,
    },
  ],
  variants: [
    {
      name: "Standard",
      description: "",
      price: 0,
      isAvailable: true,
    },
  ],
  features: [],
  safetyFeatures: [],
  technologyFeatures: [],
  specifications: {
    accelerationSeconds: 0,
    topSpeedKmh: 0,
    mileageKmpl: 0,
    seatingCapacity: 5,
    doors: 4,
    bootSpaceLitres: 0,
    lengthMm: 0,
    widthMm: 0,
    heightMm: 0,
    groundClearanceMm: 0,
  },
  stockQuantity: 0,
  featured: false,
  isActive: true,
});

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.message ||
    "Something went wrong. Please try again."
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeStringList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CarManagement() {
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState<CarForm>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const [uploadedAssets, setUploadedAssets] =
    useState<UploadedCarAssets>(emptyUploadedAssets());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/cars/management");
      const result = response.data?.data;

      setCars(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCars();
  }, [loadCars]);

  function updateField<K extends keyof CarForm>(
    field: K,
    value: CarForm[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateOption(
    field: OptionField,
    index: number,
    key: keyof CarOption,
    value: string | number | boolean,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].map((option, optionIndex) =>
        optionIndex === index
          ? { ...option, [key]: value }
          : option,
      ),
    }));
  }

  function addOption(field: OptionField) {
    // Each option starts with schema-valid defaults so adding a new option
    // does not cause a 500 when the vehicle is saved.
    const newOption: CarOption =
      field === "colors"
        ? { name: "", hex: "#FFFFFF", price: 0, isAvailable: true }
        : field === "wheels"
          ? { name: "", size: 18, design: "", price: 0, isAvailable: true }
          : field === "interiors"
            ? { name: "", color: "#202020", material: "Leather", price: 0, isAvailable: true }
            : field === "engines"
              ? {
                  name: "",
                  fuelType: "PETROL",
                  displacementCc: 0,
                  cylinders: 0,
                  horsepower: 0,
                  torqueNm: 0,
                  transmission: "Automatic",
                  drivetrain: "RWD",
                  batteryCapacityKwh: 0,
                  rangeKm: 0,
                  chargingTimeHours: 0,
                  price: 0,
                  isAvailable: true,
                }
              : { name: "", description: "", price: 0, isAvailable: true };

    setForm((previous) => ({
      ...previous,
      [field]: [...previous[field], newOption],
    }));
  }

  function removeOption(field: OptionField, index: number) {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].filter(
        (_, optionIndex) => optionIndex !== index,
      ),
    }));
  }

  function startEdit(car: Car) {
    const { _id, ...carData } = car;
    const defaults = emptyForm();

    setEditingId(_id);

    setForm({
      ...defaults,
      ...carData,
      colors: car.colors ?? [],
      wheels: car.wheels ?? [],
      interiors: car.interiors ?? [],
      engines: car.engines ?? [],
      variants: car.variants ?? [],
      galleryImages: car.galleryImages ?? [],
      features: car.features ?? [],
      safetyFeatures: car.safetyFeatures ?? [],
      technologyFeatures: car.technologyFeatures ?? [],
      specifications: {
        ...defaults.specifications,
        ...car.specifications,
      },
    });

    // Existing URLs formમાં રહે છે. અહીં માત્ર નવી uploads reset થાય છે.
    setUploadedAssets(emptyUploadedAssets());
    setActiveTab("basic");
    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
    setUploadedAssets(emptyUploadedAssets());
    setActiveTab("basic");
    setError("");
  }

  function handleAssetsUploaded(assets: UploadedCarAssets) {
    setUploadedAssets((previous) => ({
      imageUrl: assets.imageUrl || previous.imageUrl,
      modelUrl: assets.modelUrl || previous.modelUrl,
      galleryImages:
        assets.galleryImages.length > 0
          ? [...assets.galleryImages]
          : previous.galleryImages,
    }));

    setForm((previous) => ({
      ...previous,
      imageUrl: assets.imageUrl || previous.imageUrl,
      modelUrl: assets.modelUrl || previous.modelUrl,
      galleryImages:
        assets.galleryImages.length > 0
          ? [...new Set([
              ...previous.galleryImages,
              ...assets.galleryImages,
            ])]
          : previous.galleryImages,
    }));

    setError("");
    setSuccess("Files uploaded successfully. Save the vehicle to apply changes.");
  }

  function updateStringList(
    field: StringListField,
    value: string,
  ) {
    updateField(field, normalizeStringList(value));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: CarForm = {
        ...form,
        name: form.name.trim(),
        slug: makeSlug(form.slug || form.name),
        brand: form.brand.trim(),
        model: form.model.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        imageUrl: uploadedAssets.imageUrl || form.imageUrl.trim(),
        modelUrl: uploadedAssets.modelUrl || form.modelUrl.trim(),
        galleryImages: [
          ...new Set([
            ...form.galleryImages,
            ...uploadedAssets.galleryImages,
          ]),
        ],
      };

      if (!payload.name || !payload.brand || !payload.model) {
        setError("Please enter car name, brand and model.");
        return;
      }

      if (!payload.slug) {
        setError("Please enter a valid car name or slug.");
        return;
      }

      if (!payload.description) {
        setError("Please enter the full car description.");
        return;
      }

      if (!Number.isFinite(payload.basePrice) || payload.basePrice < 0) {
        setError("Please enter a valid base price.");
        return;
      }

      if (
        !Number.isFinite(payload.stockQuantity) ||
        payload.stockQuantity < 0
      ) {
        setError("Stock quantity cannot be negative.");
        return;
      }

      if (editingId) {
        await api.patch(`/cars/${editingId}`, payload);
      } else {
        await api.post("/cars", payload);
      }

      // Reset કરતી વખતે success message clear ન થાય તે માટે
      // success text resetForm પછી set થાય છે.
      resetForm();
      await loadCars();

      setSuccess(
        editingId
          ? "Car updated successfully."
          : "New car created successfully.",
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleCarStatus(car: Car) {
    const action = car.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${car.name}?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await api.patch(`/cars/${car._id}/${action}`);

      await loadCars();

      setSuccess(
        `${car.name} ${
          car.isActive ? "deactivated" : "activated"
        } successfully.`,
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function deleteCar(car: Car) {
    const confirmed = window.confirm(
      `Delete ${car.name} permanently? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(car._id);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/cars/${car._id}`);

      if (editingId === car._id) {
        resetForm();
      }

      await loadCars();
      setSuccess(`${car.name} deleted successfully.`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const filteredCars = cars.filter((car) => {
    const text =
      `${car.name} ${car.brand} ${car.model} ${car.slug}`.toLowerCase();

    return text.includes(search.toLowerCase().trim());
  });

  return (
    <main className="car-mgmt-page">
      <header className="car-mgmt-header">
        <div>
          <span className="car-mgmt-eyebrow">
            BMW SHOWROOM MANAGEMENT
          </span>
          <h1>Car Management</h1>
          <p>
            Manage vehicle details, configurations, prices and availability.
          </p>
        </div>

        <button
          type="button"
          className="car-mgmt-secondary-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </header>

      {error && (
        <div
          className="car-mgmt-alert car-mgmt-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="car-mgmt-alert car-mgmt-alert-success"
          role="status"
        >
          {success}
        </div>
      )}

      <section className="car-mgmt-stats">
        <article>
          <span>Total Cars</span>
          <strong>{cars.length}</strong>
        </article>

        <article>
          <span>Active Cars</span>
          <strong>{cars.filter((car) => car.isActive).length}</strong>
        </article>

        <article>
          <span>Featured Cars</span>
          <strong>{cars.filter((car) => car.featured).length}</strong>
        </article>

        <article>
          <span>Total Stock</span>
          <strong>
            {cars.reduce(
              (total, car) => total + (car.stockQuantity || 0),
              0,
            )}
          </strong>
        </article>
      </section>

      <section className="car-mgmt-panel">
        <div className="car-mgmt-panel-heading">
          <div>
            <h2>{editingId ? "Edit Vehicle" : "Add New Vehicle"}</h2>
            <p>
              Configure vehicle details, customization options and media.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="car-mgmt-secondary-btn"
              onClick={() => {
                resetForm();
                setSuccess("");
              }}
            >
              Cancel Editing
            </button>
          )}
        </div>

        <div className="car-mgmt-tabs">
          {[
            ["basic", "Basic Details"],
            ["options", "Customization"],
            ["specifications", "Specifications"],
            ["features", "Features & Media"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={activeTab === id ? "active" : ""}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "basic" && (
            <div className="car-mgmt-form-grid">
              <label>
                Car Name *
                <input
                  required
                  value={form.name}
                  placeholder="BMW 5 Series"
                  onChange={(event) => {
                    const name = event.target.value;

                    setForm((previous) => ({
                      ...previous,
                      name,
                      slug: editingId
                        ? previous.slug
                        : makeSlug(name),
                    }));
                  }}
                />
              </label>

              <label>
                URL Slug *
                <input
                  required
                  value={form.slug}
                  placeholder="bmw-5-series"
                  onChange={(event) =>
                    updateField("slug", makeSlug(event.target.value))
                  }
                />
              </label>

              <label>
                Brand *
                <input
                  required
                  value={form.brand}
                  onChange={(event) =>
                    updateField("brand", event.target.value)
                  }
                />
              </label>

              <label>
                Model *
                <input
                  required
                  value={form.model}
                  placeholder="530i M Sport"
                  onChange={(event) =>
                    updateField("model", event.target.value)
                  }
                />
              </label>

              <label>
                Manufacturing Year
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={(event) =>
                    updateField("year", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target.value as CarCategory,
                    )
                  }
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Electric">Electric</option>
                </select>
              </label>

              <label>
                Base Price (₹) *
                <input
                  type="number"
                  required
                  min="0"
                  value={form.basePrice}
                  onChange={(event) =>
                    updateField("basePrice", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Available Stock
                <input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    updateField(
                      "stockQuantity",
                      Number(event.target.value),
                    )
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                Short Description
                <input
                  value={form.shortDescription}
                  placeholder="Luxury, comfort and performance."
                  onChange={(event) =>
                    updateField("shortDescription", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                Full Description *
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-checkbox">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    updateField("featured", event.target.checked)
                  }
                />
                Show as featured car
              </label>

              <label className="car-mgmt-checkbox">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />
                Car is active and visible
              </label>
            </div>
          )}

          {activeTab === "options" && (
            <div className="car-mgmt-option-sections">
              <OptionEditor
                title="Exterior Colors"
                type="color"
                options={form.colors}
                onAdd={() => addOption("colors")}
                onRemove={(index) => removeOption("colors", index)}
                onChange={(index, key, value) =>
                  updateOption("colors", index, key, value)
                }
              />

              <OptionEditor
                title="Wheels"
                type="wheel"
                options={form.wheels}
                onAdd={() => addOption("wheels")}
                onRemove={(index) => removeOption("wheels", index)}
                onChange={(index, key, value) =>
                  updateOption("wheels", index, key, value)
                }
              />

              <OptionEditor
                title="Interior Options"
                type="interior"
                options={form.interiors}
                onAdd={() => addOption("interiors")}
                onRemove={(index) => removeOption("interiors", index)}
                onChange={(index, key, value) =>
                  updateOption("interiors", index, key, value)
                }
              />

              <OptionEditor
                title="Engine Options"
                type="engine"
                options={form.engines}
                onAdd={() => addOption("engines")}
                onRemove={(index) => removeOption("engines", index)}
                onChange={(index, key, value) =>
                  updateOption("engines", index, key, value)
                }
              />

              <OptionEditor
                title="Variants"
                type="variant"
                options={form.variants}
                onAdd={() => addOption("variants")}
                onRemove={(index) => removeOption("variants", index)}
                onChange={(index, key, value) =>
                  updateOption("variants", index, key, value)
                }
              />
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="car-mgmt-form-grid">
              {(
                [
                  ["accelerationSeconds", "0–100 km/h (seconds)"],
                  ["topSpeedKmh", "Top Speed (km/h)"],
                  ["mileageKmpl", "Mileage (km/l)"],
                  ["seatingCapacity", "Seating Capacity"],
                  ["doors", "Number of Doors"],
                  ["bootSpaceLitres", "Boot Space (litres)"],
                  ["lengthMm", "Length (mm)"],
                  ["widthMm", "Width (mm)"],
                  ["heightMm", "Height (mm)"],
                  ["groundClearanceMm", "Ground Clearance (mm)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.specifications[key] ?? ""}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        specifications: {
                          ...previous.specifications,
                          [key]:
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          )}

          {activeTab === "features" && (
            <div className="car-mgmt-form-grid">
              <div className="car-mgmt-full-width">
                <CarAssetUpload
                  initialAssets={{
                    imageUrl: form.imageUrl,
                    modelUrl: form.modelUrl,
                    galleryImages: form.galleryImages,
                  }}
                  onUploaded={handleAssetsUploaded}
                />
              </div>

              <label className="car-mgmt-full-width">
                Main Image URL
                <input
                  type="text"
                  value={form.imageUrl}
                  placeholder="https://example.com/bmw.jpg"
                  onChange={(event) =>
                    updateField("imageUrl", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                3D Model URL (.glb / .gltf)
                <input
                  type="text"
                  value={form.modelUrl}
                  placeholder="/uploads/cars/models/bmw.glb"
                  onChange={(event) =>
                    updateField("modelUrl", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                Gallery Image URLs (one URL per line)
                <textarea
                  rows={4}
                  value={form.galleryImages.join("\n")}
                  placeholder="https://example.com/bmw-front.jpg"
                  onChange={(event) =>
                    updateStringList("galleryImages", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                Features (one per line)
                <textarea
                  rows={4}
                  value={form.features.join("\n")}
                  onChange={(event) =>
                    updateStringList("features", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                Safety Features (one per line)
                <textarea
                  rows={4}
                  value={form.safetyFeatures.join("\n")}
                  onChange={(event) =>
                    updateStringList("safetyFeatures", event.target.value)
                  }
                />
              </label>

              <label className="car-mgmt-full-width">
                Technology Features (one per line)
                <textarea
                  rows={4}
                  value={form.technologyFeatures.join("\n")}
                  onChange={(event) =>
                    updateStringList(
                      "technologyFeatures",
                      event.target.value,
                    )
                  }
                />
              </label>
            </div>
          )}

          <div className="car-mgmt-form-actions">
            <button
              type="button"
              className="car-mgmt-secondary-btn"
              disabled={saving}
              onClick={() => {
                resetForm();
                setSuccess("");
              }}
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="car-mgmt-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Vehicle"
                  : "Create Vehicle"}
            </button>
          </div>
        </form>
      </section>

      <section className="car-mgmt-panel">
        <div className="car-mgmt-panel-heading">
          <div>
            <h2>All Vehicles</h2>
            <p>Search and manage your showroom inventory.</p>
          </div>

          <input
            className="car-mgmt-search"
            value={search}
            placeholder="Search cars..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="car-mgmt-loading">
            Loading vehicles...
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="car-mgmt-empty">
            No vehicles found. Add your first vehicle above.
          </div>
        ) : (
          <div className="car-mgmt-table-wrapper">
            <table className="car-mgmt-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car._id}>
                    <td>
                      <div className="car-mgmt-vehicle">
                        {car.imageUrl ? (
                          <img
                            src={car.imageUrl}
                            alt={car.name}
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <div className="car-mgmt-image-placeholder">
                            BMW
                          </div>
                        )}

                        <div>
                          <strong>{car.name}</strong>
                          <span>{car.model}</span>
                          {car.featured && (
                            <small className="car-mgmt-featured">
                              FEATURED
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{car.category}</td>
                    <td>{formatPrice(car.basePrice)}</td>
                    <td>{car.stockQuantity ?? 0}</td>

                    <td>
                      <span
                        className={`car-mgmt-status ${
                          car.isActive ? "is-active" : "is-inactive"
                        }`}
                      >
                        {car.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="car-mgmt-row-actions">
                        <button
                          type="button"
                          onClick={() => startEdit(car)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={loading}
                          className={
                            car.isActive
                              ? "danger-action"
                              : "activate-action"
                          }
                          onClick={() => void toggleCarStatus(car)}
                        >
                          {car.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === car._id}
                          className="danger-action"
                          onClick={() => void deleteCar(car)}
                          aria-label={`Delete ${car.name}`}
                        >
                          {deletingId === car._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

type OptionEditorProps = {
  title: string;
  options: CarOption[];
  type: "color" | "wheel" | "interior" | "engine" | "variant";
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    key: keyof CarOption,
    value: string | number | boolean,
  ) => void;
};

function OptionEditor({
  title,
  options,
  type,
  onAdd,
  onRemove,
  onChange,
}: OptionEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  async function uploadOptionImage(index: number, file?: File) {
  if (!file) return;

  // Validate image type
  if (!file.type.startsWith("image/")) {
    setUploadError("Please select a valid image file.");
    return;
  }

  // Validate image size (5 MB)
  if (file.size > 5 * 1024 * 1024) {
    setUploadError("Image size must be 5 MB or less.");
    return;
  }

  setUploadingIndex(index);
  setUploadError("");

  try {
    const formData = new FormData();

    // Backend multer field name
    formData.append("image", file);

    // Correct backend endpoint
    const response = await api.post(
      "/uploads/car-assets",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );

    const result = response.data?.data;
    const imageUrl = result?.imageUrl;

    if (
      typeof imageUrl !== "string" ||
      imageUrl.trim().length === 0
    ) {
      throw new Error(
        response.data?.message ||
          "Image upload succeeded, but no image URL was returned.",
      );
    }

    // Save the uploaded image URL in the selected option
    onChange(index, "imageUrl", imageUrl);

    setUploadError("");
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      let message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Image upload failed. Please try again.";

      if (err.response?.status === 401) {
        message = "Please log in again to upload an image.";
      } else if (err.response?.status === 403) {
        message = "You do not have permission to upload images.";
      } else if (err.response?.status === 404) {
        message =
          "Upload API not found. Check the backend uploads route.";
      }

      console.error("Option image upload failed:", error);

      setUploadError(message);
    } finally {
      setUploadingIndex(null);
    }
  }

  const singularTitle =
    type === "color"
      ? "Color"
      : type === "wheel"
        ? "Wheel"
        : type === "interior"
          ? "Interior"
          : type === "engine"
            ? "Engine"
            : "Variant";

  return (
    <section className="car-mgmt-option-panel">
      <div className="car-mgmt-option-heading">
        <h3>{title}</h3>

        <button
          type="button"
          className="car-mgmt-add-option"
          onClick={onAdd}
        >
          + Add Option
        </button>
      </div>

      {uploadError && (
        <p className="car-mgmt-alert car-mgmt-alert-error" role="alert">
          {uploadError}
        </p>
      )}

      {options.length === 0 && (
        <p className="car-mgmt-option-empty">
          No options added yet.
        </p>
      )}

      {options.map((option, index) => (
        <div
          className="car-mgmt-option-card"
          key={`${type}-${index}`}
        >
          <div className="car-mgmt-option-card-header">
            <strong>
              {singularTitle} #{index + 1}
            </strong>

            <button
              type="button"
              className="car-mgmt-remove-option"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </div>

          <div className="car-mgmt-form-grid">
            <label>
              {singularTitle} Name *
              <input
                required
                value={option.name}
                placeholder={`${singularTitle} name`}
                onChange={(event) =>
                  onChange(index, "name", event.target.value)
                }
              />
            </label>

            <label>
              Additional Price (₹)
              <input
                type="number"
                min="0"
                value={option.price}
                onChange={(event) =>
                  onChange(index, "price", Number(event.target.value))
                }
              />
            </label>

            {type === "color" && (
              <>
                <label>
                  Color Code
                  <div className="car-mgmt-color-input">
                    <input
                      type="color"
                      value={
                        /^#[0-9A-Fa-f]{6}$/.test(option.hex || "")
                          ? option.hex!
                          : "#F5F5F5"
                      }
                      onChange={(event) =>
                        onChange(index, "hex", event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={option.hex || ""}
                      onChange={(event) => {
                        let value = event.target.value.toUpperCase();

                        if (value && !value.startsWith("#")) {
                          value = `#${value}`;
                        }

                        onChange(index, "hex", value);
                      }}
                      placeholder="#F5F5F5"
                      maxLength={7}
                      className="hex-code-input"
                    />
                  </div>
                </label>


              </>
            )}

            {type === "wheel" && (
              <>
                <label>
                  Wheel Size (inches)
                  <input
                    type="number"
                    min="1"
                    value={option.size ?? 18}
                    onChange={(event) =>
                      onChange(index, "size", Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Design
                  <input
                    value={option.design || ""}
                    onChange={(event) =>
                      onChange(index, "design", event.target.value)
                    }
                  />
                </label>

                <div className="car-mgmt-full-width">
                  <label>
                    Wheel Image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      disabled={uploadingIndex === index}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        void uploadOptionImage(index, file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {uploadingIndex === index && <p>Uploading image...</p>}
                  {option.imageUrl && (
                    <div style={{ marginTop: 12 }}>
                      <img
                        src={option.imageUrl}
                        alt={`${option.name || "Wheel"} preview`}
                        style={{
                          display: "block",
                          width: 180,
                          height: 120,
                          objectFit: "contain",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                          padding: 8,
                          background: "#fff",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        className="car-mgmt-remove-option"
                        onClick={() => onChange(index, "imageUrl", "")}
                        style={{ marginTop: 8 }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {type === "interior" && (
              <>
                <label>
                  Interior Color
                  <div className="car-mgmt-color-input">
                    <input
                      type="color"
                      value={
                        /^#[0-9A-Fa-f]{6}$/.test(option.hex || "")
                          ? option.hex!
                          : "#F5F5F5"
                      }
                      onChange={(event) =>
                        onChange(index, "hex", event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={option.hex || ""}
                      onChange={(event) => {
                        let value = event.target.value.toUpperCase();

                        if (value && !value.startsWith("#")) {
                          value = `#${value}`;
                        }

                        onChange(index, "hex", value);
                      }}
                      placeholder="#F5F5F5"
                      maxLength={7}
                      className="hex-code-input"
                    />
                  </div>
                </label>

                <label>
                  Material
                  <input
                    value={option.material || ""}
                    placeholder="Leather, Alcantara..."
                    onChange={(event) =>
                      onChange(index, "material", event.target.value)
                    }
                  />
                </label>

                <div className="car-mgmt-full-width">
                  <label>
                    Interior Image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      disabled={uploadingIndex === index}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        void uploadOptionImage(index, file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {uploadingIndex === index && <p>Uploading image...</p>}
                  {option.imageUrl && (
                    <div style={{ marginTop: 12 }}>
                      <img
                        src={option.imageUrl}
                        alt={`${option.name || "Interior"} preview`}
                        style={{
                          display: "block",
                          width: 180,
                          height: 120,
                          objectFit: "contain",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                          padding: 8,
                          background: "#fff",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        className="car-mgmt-remove-option"
                        onClick={() => onChange(index, "imageUrl", "")}
                        style={{ marginTop: 8 }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {type === "engine" && (
              <>
                <label>
                  Fuel Type
                  <select
                    value={option.fuelType || "PETROL"}
                    onChange={(event) =>
                      onChange(index, "fuelType", event.target.value)
                    }
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ELECTRIC">Electric</option>
                  </select>
                </label>

                <label>
                  Horsepower (hp)
                  <input
                    type="number"
                    min="0"
                    value={option.horsepower ?? 0}
                    onChange={(event) =>
                      onChange(
                        index,
                        "horsepower",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>

                <label>
                  Torque (Nm)
                  <input
                    type="number"
                    min="0"
                    value={option.torqueNm ?? 0}
                    onChange={(event) =>
                      onChange(
                        index,
                        "torqueNm",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>

                <label>
                  Transmission
                  <input
                    value={option.transmission || "Automatic"}
                    onChange={(event) =>
                      onChange(index, "transmission", event.target.value)
                    }
                  />
                </label>

                <label>
                  Drivetrain
                  <select
                    value={option.drivetrain || "RWD"}
                    onChange={(event) =>
                      onChange(index, "drivetrain", event.target.value)
                    }
                  >
                    {/* ICE / Petrol / Diesel Options */}
                    <option value="RWD">RWD (Rear-Wheel Drive)</option>
                    <option value="FWD">FWD (Front-Wheel Drive)</option>
                    <option value="AWD">AWD (All-Wheel Drive)</option>
                    <option value="xDrive">xDrive (intelligent All-Wheel Drive)</option>

                    {/* Electric (EV) Options */}
                    <option value="eDrive_RWD">eDrive / sDrive (Electric RWD - Single Motor)</option>
                    <option value="electric_xDrive">xDrive (Electric AWD - Dual Motor)</option>
                    <option value="M_electric_xDrive">M xDrive (Performance Electric AWD)</option>
                  </select>
                </label>

                <label>
                  Engine Displacement (cc)
                  <input
                    type="number"
                    min="0"
                    value={option.displacementCc ?? 0}
                    onChange={(event) =>
                      onChange(
                        index,
                        "displacementCc",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>

                <label>
                  Cylinders
                  <input
                    type="number"
                    min="0"
                    value={option.cylinders ?? 0}
                    onChange={(event) =>
                      onChange(
                        index,
                        "cylinders",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>

                <label>
                  Battery Capacity (kWh)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={option.batteryCapacityKwh ?? 0}
                    onChange={(event) =>
                      onChange(
                        index,
                        "batteryCapacityKwh",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>

                <label>
                  Electric Range (km)
                  <input
                    type="number"
                    min="0"
                    value={option.rangeKm ?? 0}
                    onChange={(event) =>
                      onChange(index, "rangeKm", Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Charging Time (hours)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={option.chargingTimeHours ?? 0}
                    onChange={(event) =>
                      onChange(
                        index,
                        "chargingTimeHours",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>
              </>
            )}

            {type === "variant" && (
              <label className="car-mgmt-full-width">
                Description
                <textarea
                  rows={2}
                  value={option.description || ""}
                  onChange={(event) =>
                    onChange(index, "description", event.target.value)
                  }
                />
              </label>
            )}

            <label className="car-mgmt-checkbox">
              <input
                type="checkbox"
                checked={option.isAvailable}
                onChange={(event) =>
                  onChange(index, "isAvailable", event.target.checked)
                }
              />
              Available for selection
            </label>
          </div>
        </div>
      ))}
    </section>
  );
}
