
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getCarBySlug,
  type Car,
  type CarColor,
  type CarWheel,
  type CarInterior,
  type CarEngine,
  type CarVariant,
} from "../../api/cars.api";

import ConfiguratorScene from "./ConfiguratorScene";
import { saveConfiguration } from "../../api/configurations.api";
import { requestQuotation } from "../../api/quotations.api";
import { useAuth } from "../../auth/AuthContext";
import { useRequireAuth } from "../../auth/useRequireAuth";

import TestDriveModal from "../../components/test-drive/TestDriveModal";

import "../../styles/pages/configurator/CarConfigurator.css";

type AuthUser = {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
};

type PreviewMode = "360" | "gallery";

type ImageOption = {
  imageUrl?: string;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

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
    err.response?.data?.message ??
    err.message ??
    "Something went wrong. Please try again."
  );
}

function resolveImageUrl(
  source: string | undefined | null,
): string {
  if (!source || typeof source !== "string") {
    return "";
  }

  const imagePath = source.trim();

  if (!imagePath) {
    return "";
  }

  if (/^(https?:\/\/|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  const apiBase =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1";

  try {
    const backendOrigin = new URL(
      apiBase,
      window.location.origin,
    ).origin;

    const normalizedPath = imagePath.replace(/^\/+/, "");

    return new URL(
      normalizedPath,
      `${backendOrigin}/`,
    ).toString();
  } catch {
    return imagePath;
  }
}

function getCustomerName(
  customer?: AuthUser | null,
): string {
  if (!customer) {
    return "";
  }

  return (
    customer.fullName ||
    customer.name ||
    `${customer.firstName ?? ""} ${customer.lastName ?? ""}`
  ).trim();
}

export default function CarConfigurator() {
  const { slug } = useParams<{ slug: string }>();

  const authContext = useAuth() as {
    user?: AuthUser | null;
    customer?: AuthUser | null;
  };

  const user = authContext.user ?? authContext.customer;
  const customer = authContext.customer ?? authContext.user;

  const { requireAuth } = useRequireAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedWheelId, setSelectedWheelId] = useState("");
  const [selectedInteriorId] = useState("");
  const [selectedEngineId, setSelectedEngineId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const [previewMode, setPreviewMode] =
    useState<PreviewMode>("360");

  const [selectedGalleryIndex, setSelectedGalleryIndex] =
    useState(0);

  const [failedGalleryImages, setFailedGalleryImages] =
    useState<string[]>([]);

  const [showTestDrive, setShowTestDrive] = useState(false);

  const [savingConfiguration, setSavingConfiguration] =
    useState(false);

  const [requestingQuotation, setRequestingQuotation] =
    useState(false);

  // --------------------------------------------------
  // LOAD CAR
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadCar() {
      if (!slug) {
        setLoadError("Vehicle URL is missing.");
        setCar(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");
      setCar(null);

      try {
        const data = await getCarBySlug(slug);

        if (cancelled) {
          return;
        }

        setCar(data);

        setSelectedColorId(
          data.colors?.find(
            (item) => item.isAvailable !== false,
          )?.name ?? "",
        );

        setSelectedWheelId(
          data.wheels?.find(
            (item) => item.isAvailable !== false,
          )?.name ?? "",
        );

        setSelectedEngineId(
          data.engines?.find(
            (item) => item.isAvailable !== false,
          )?.name ?? "",
        );

        setSelectedVariantId(
          data.variants?.find(
            (item) => item.isAvailable !== false,
          )?.name ?? "",
        );

        setPreviewMode("360");
        setSelectedGalleryIndex(0);
        setFailedGalleryImages([]);
      } catch (error: unknown) {
        if (!cancelled) {
          setLoadError(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCar();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // --------------------------------------------------
  // AVAILABLE OPTIONS
  // --------------------------------------------------

  const availableColors = useMemo(
    () =>
      car?.colors?.filter(
        (item) => item.isAvailable !== false,
      ) ?? [],
    [car],
  );

  const availableWheels = useMemo(
    () =>
      car?.wheels?.filter(
        (item) => item.isAvailable !== false,
      ) ?? [],
    [car],
  );

  const availableInteriors = useMemo(
    () =>
      car?.interiors?.filter(
        (item) => item.isAvailable !== false,
      ) ?? [],
    [car],
  );

  const availableEngines = useMemo(
    () =>
      car?.engines?.filter(
        (item) => item.isAvailable !== false,
      ) ?? [],
    [car],
  );

  const availableVariants = useMemo(
    () =>
      car?.variants?.filter(
        (item) => item.isAvailable !== false,
      ) ?? [],
    [car],
  );

  // --------------------------------------------------
  // SELECTED OPTIONS
  // --------------------------------------------------

  const color: CarColor | undefined =
    availableColors.find(
      (item) => item.name === selectedColorId,
    ) ?? availableColors[0];

  const wheel: CarWheel | undefined =
    availableWheels.find(
      (item) => item.name === selectedWheelId,
    ) ?? availableWheels[0];

  const interior: CarInterior | undefined =
    availableInteriors.find(
      (item) => item.name === selectedInteriorId,
    ) ?? availableInteriors[0];

  const engine: CarEngine | undefined =
    availableEngines.find(
      (item) => item.name === selectedEngineId,
    ) ?? availableEngines[0];

  const variant: CarVariant | undefined =
    availableVariants.find(
      (item) => item.name === selectedVariantId,
    ) ?? availableVariants[0];

  // --------------------------------------------------
  // GALLERY IMAGES
  // --------------------------------------------------

  const galleryImages = useMemo(() => {
    const images = [
      car?.imageUrl,
      ...(car?.galleryImages ?? []),
    ];

    return [
      ...new Set(
        images.filter(
          (image): image is string =>
            typeof image === "string" &&
            image.trim().length > 0,
        ),
      ),
    ];
  }, [car]);

  const selectedGalleryImage =
    galleryImages[selectedGalleryIndex] ?? galleryImages[0];

  // --------------------------------------------------
  // PRICE CALCULATION
  // --------------------------------------------------

  const totalPrice = useMemo(() => {
    if (!car) {
      return 0;
    }

    return (
      car.basePrice +
      (color?.price ?? 0) +
      (wheel?.price ?? 0) +
      (interior?.price ?? 0) +
      (engine?.price ?? 0) +
      (variant?.price ?? 0)
    );
  }, [car, color, wheel, interior, engine, variant]);

  // --------------------------------------------------
  // OPEN TEST DRIVE MODAL
  // --------------------------------------------------

  function handleOpenTestDrive() {
    setShowTestDrive(true);
  }

  // --------------------------------------------------
  // SAVE CONFIGURATION
  // --------------------------------------------------

  async function handleSaveConfiguration() {
    const currentCar = car;

    if (!currentCar) {
      window.alert("Vehicle information is not available.");
      return;
    }

    requireAuth("SAVE_CONFIGURATION", async () => {
      if (savingConfiguration) {
        return;
      }

      setSavingConfiguration(true);

      try {
        await saveConfiguration({
          carId: currentCar._id,
          carSlug: currentCar.slug,
          carName: currentCar.name,

          color: color?.name ?? "",
          wheel: wheel?.name ?? "",
          interior: interior?.name ?? "",
          engine: engine?.name ?? "",
          variant: variant?.name ?? "",

          basePrice: currentCar.basePrice,
          finalPrice: totalPrice,
        });

        window.alert(
          "Your configuration has been saved successfully.",
        );
      } catch (error: unknown) {
        window.alert(getErrorMessage(error));
      } finally {
        setSavingConfiguration(false);
      }
    });
  }

  // --------------------------------------------------
  // REQUEST QUOTATION
  // --------------------------------------------------

  async function handleRequestQuotation() {
    const currentCar = car;

    if (!currentCar) {
      window.alert("Vehicle information is not available.");
      return;
    }

    requireAuth("REQUEST_QUOTATION", async () => {
      if (requestingQuotation) {
        return;
      }

      const currentCustomer = customer;

      if (!currentCustomer) {
        window.alert(
          "Please log in to request a quotation.",
        );
        return;
      }

      const customerName = getCustomerName(currentCustomer);
      const customerEmail =
        currentCustomer.email?.trim() ?? "";

      if (!customerName || !customerEmail) {
        window.alert(
          "Please complete your name and email in your profile.",
        );
        return;
      }

      if (!color?.name || !wheel?.name || !interior?.name) {
        window.alert(
          "Please select an available color, wheel and interior.",
        );
        return;
      }

      if (
        !Number.isFinite(currentCar.basePrice) ||
        !Number.isFinite(totalPrice) ||
        currentCar.basePrice < 0 ||
        totalPrice < 0
      ) {
        window.alert(
          "Invalid vehicle price. Please reload the configurator.",
        );
        return;
      }

      setRequestingQuotation(true);

      try {
        await requestQuotation({
          carId: currentCar._id,
          carSlug: currentCar.slug,
          carName: currentCar.name,

          color: color.name,
          wheel: wheel.name,
          interior: interior.name,

          engine: engine?.name ?? "Standard",
          variant: variant?.name ?? "Standard",

          basePrice: currentCar.basePrice,
          finalPrice: totalPrice,

          customerName,
          customerEmail,

          notes: "Quotation requested from 3D configurator.",
        });

        window.alert(
          "Quotation request submitted successfully.",
        );
      } catch (error: unknown) {
        console.error(
          "Quotation submission failed:",
          error,
        );

        window.alert(getErrorMessage(error));
      } finally {
        setRequestingQuotation(false);
      }
    });
  }

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="bmw-cfg-loading">
        <div className="bmw-cfg-loader" />

        <h2>Preparing Your Experience</h2>

        <p>Loading 3D vehicle configurator...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------

  if (!car) {
    return (
      <main className="bmw-cfg-loading">
        <span className="bmw-cfg-error-icon">!</span>

        <h2>Vehicle Could Not Be Loaded</h2>

        <p>{loadError || "Vehicle not found."}</p>

        <Link to="/cars" className="bmw-cfg-back-link">
          ← Back to Collection
        </Link>
      </main>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <main className="bmw-cfg-page">
      <header className="bmw-cfg-header">
        <Link to="/cars" className="bmw-cfg-back-link">
          <span aria-hidden="true">←</span>
          Collection
        </Link>

        <div className="bmw-cfg-header-brand">
          <span className="bmw-cfg-header__title">
            Luxury Automotive
          </span>

          <span className="bmw-cfg-header-subtitle">
            3D Vehicle Configurator
          </span>
        </div>

        <span className="bmw-cfg-header-status">
          <span className="bmw-cfg-status-dot" />
          Personalize
        </span>
      </header>

      <section className="bmw-cfg-layout">
        {/* LEFT: VEHICLE PREVIEW */}

        <div className="bmw-cfg-visual">
          <div className="bmw-cfg-view-switch">
            <button
              type="button"
              className={`bmw-cfg-view-btn ${
                previewMode === "360" ? "is-active" : ""
              }`}
              onClick={() => setPreviewMode("360")}
              aria-pressed={previewMode === "360"}
            >
              <span aria-hidden="true">⟳</span>
              360° View
            </button>

            <button
              type="button"
              className={`bmw-cfg-view-btn ${
                previewMode === "gallery" ? "is-active" : ""
              }`}
              onClick={() => {
                setPreviewMode("gallery");
                setSelectedGalleryIndex(0);
              }}
              aria-pressed={previewMode === "gallery"}
            >
              <span aria-hidden="true">▧</span>
              Gallery Photos
            </button>
          </div>

          {previewMode === "360" ? (
            <div className="bmw-cfg-360-stage">
              {color ? (
                <ConfiguratorScene
                  car={car}
                  color={color.hex}
                  interiorColor={interior?.color}
                  wheelName={wheel?.name}
                  wheelDesign={wheel?.design}
                  wheelSize={wheel?.size}
                  baseWheelSize={car.wheels?.[0]?.size}
                />
              ) : (
                <div className="bmw-cfg-preview-message">
                  <div>
                    <span className="bmw-cfg-empty-icon">
                      ◈
                    </span>

                    <h3>No Available Exterior Colors</h3>

                    <p>
                      Please add an available exterior color
                      in car management.
                    </p>
                  </div>
                </div>
              )}

              <div className="bmw-cfg-stage-caption">
                <span className="bmw-cfg-stage-caption-dot" />

                INTERACTIVE VEHICLE PREVIEW

                {color && (
                  <span className="bmw-cfg-stage-color">
                    {color.name}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bmw-cfg-gallery">
              {galleryImages.length > 0 &&
              selectedGalleryImage ? (
                <>
                  <div className="bmw-cfg-gallery-main">
                    {!failedGalleryImages.includes(
                      selectedGalleryImage,
                    ) ? (
                      <img
                        key={selectedGalleryImage}
                        src={resolveImageUrl(
                          selectedGalleryImage,
                        )}
                        alt={`${car.name} gallery photo ${
                          selectedGalleryIndex + 1
                        }`}
                        onError={() => {
                          setFailedGalleryImages((previous) =>
                            previous.includes(selectedGalleryImage)
                              ? previous
                              : [
                                  ...previous,
                                  selectedGalleryImage,
                                ],
                          );
                        }}
                      />
                    ) : (
                      <div className="bmw-cfg-preview-message">
                        <div>
                          <span className="bmw-cfg-empty-icon">
                            ▧
                          </span>

                          <h3>Photo Unavailable</h3>

                          <p>
                            Check the image URL and backend
                            static-file configuration.
                          </p>
                        </div>
                      </div>
                    )}

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="bmw-cfg-gallery-nav bmw-cfg-gallery-nav--prev"
                          aria-label="Previous photo"
                          onClick={() => {
                            setSelectedGalleryIndex((previous) =>
                              previous === 0
                                ? galleryImages.length - 1
                                : previous - 1,
                            );
                          }}
                        >
                          ‹
                        </button>

                        <button
                          type="button"
                          className="bmw-cfg-gallery-nav bmw-cfg-gallery-nav--next"
                          aria-label="Next photo"
                          onClick={() => {
                            setSelectedGalleryIndex(
                              (previous) =>
                                (previous + 1) %
                                galleryImages.length,
                            );
                          }}
                        >
                          ›
                        </button>
                      </>
                    )}

                    <span className="bmw-cfg-gallery-counter">
                      {selectedGalleryIndex + 1}
                      {" / "}
                      {galleryImages.length}
                    </span>
                  </div>

                  <div className="bmw-cfg-gallery-thumbnails">
                    {galleryImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`bmw-cfg-gallery-thumb ${
                          selectedGalleryIndex === index
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedGalleryIndex(index)
                        }
                        aria-label={`View gallery photo ${
                          index + 1
                        }`}
                        aria-pressed={
                          selectedGalleryIndex === index
                        }
                      >
                        {!failedGalleryImages.includes(image) ? (
                          <img
                            src={resolveImageUrl(image)}
                            alt={`${car.name} thumbnail ${
                              index + 1
                            }`}
                            loading="lazy"
                            onError={() => {
                              setFailedGalleryImages(
                                (previous) =>
                                  previous.includes(image)
                                    ? previous
                                    : [...previous, image],
                              );
                            }}
                          />
                        ) : (
                          <span>Unavailable</span>
                        )}

                        <span className="bmw-cfg-thumb-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bmw-cfg-gallery-empty">
                  <span className="bmw-cfg-empty-icon">
                    ▧
                  </span>

                  <h3>No Gallery Photos</h3>

                  <p>
                    No images are available for this vehicle.
                    Add the main image or gallery images in
                    car management.
                  </p>

                  <button
                    type="button"
                    className="bmw-cfg-view-btn"
                    onClick={() => setPreviewMode("360")}
                  >
                    Return to 360° View
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bmw-cfg-visual-footer">
            <span>
              <span className="bmw-cfg-footer-icon">◈</span>
              Premium Configuration Studio
            </span>

            <span>DESIGN YOUR DRIVE</span>
          </div>
        </div>

        {/* RIGHT: CONFIGURATION PANEL */}

        <aside className="bmw-cfg-panel">
          <div className="bmw-cfg-panel-top">
            <span className="bmw-cfg-panel__brand">
              {car.brand}
            </span>

            <span className="bmw-cfg-build-status">
              CONFIGURATION
            </span>
          </div>

          <h1 className="bmw-cfg-panel__name">
            {car.name}
          </h1>

          <p className="bmw-cfg-panel__desc">
            {car.shortDescription || car.description}
          </p>

          <div className="bmw-cfg-panel-divider">
            <span>PERSONALIZE YOUR VEHICLE</span>
          </div>

          {/* EXTERIOR COLORS */}

          {availableColors.length > 0 && (
            <div className="bmw-cfg-group">
              <div className="bmw-cfg-group__header">
                <div>
                  <span className="bmw-cfg-group__step">
                    01
                  </span>

                  <span className="bmw-cfg-group__label">
                    Exterior Color
                  </span>
                </div>

                <strong className="bmw-cfg-group__val">
                  {color?.name}
                </strong>
              </div>

              <div className="bmw-cfg-colors">
                {availableColors.map((item) => (
                  <button
                    key={item._id ?? item.name}
                    type="button"
                    aria-label={`Select ${item.name} exterior color`}
                    aria-pressed={color?.name === item.name}
                    title={`${item.name} — ${
                      item.price > 0
                        ? formatPrice(item.price)
                        : "Included"
                    }`}
                    className={`bmw-cfg-color-btn ${
                      color?.name === item.name
                        ? "is-selected"
                        : ""
                    }`}
                    style={{
                      backgroundColor: item.hex,
                    }}
                    onClick={() =>
                      setSelectedColorId(item.name)
                    }
                  >
                    {color?.name === item.name && (
                      <span aria-hidden="true">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <p className="bmw-cfg-option-price">
                {color && color.price > 0
                  ? `Additional ${formatPrice(color.price)}`
                  : "Included in base price"}
              </p>
            </div>
          )}

          {/* WHEELS */}

          {availableWheels.length > 0 && (
            <div className="bmw-cfg-group">
              <div className="bmw-cfg-group__header">
                <div>
                  <span className="bmw-cfg-group__step">
                    02
                  </span>

                  <span className="bmw-cfg-group__label">
                    Wheels
                  </span>
                </div>

                <strong className="bmw-cfg-group__val">
                  {wheel?.name}
                </strong>
              </div>

              <div className="bmw-cfg-options-list">
                {availableWheels.map((item) => {
                  const imageUrl = (
                    item as CarWheel & ImageOption
                  ).imageUrl;

                  return (
                    <button
                      key={item._id ?? item.name}
                      type="button"
                      aria-pressed={wheel?.name === item.name}
                      className={`bmw-cfg-option-item ${
                        wheel?.name === item.name
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedWheelId(item.name)
                      }
                    >
                      {imageUrl && (
                        <img
                          className="bmw-cfg-option-image"
                          src={resolveImageUrl(imageUrl)}
                          alt={`${item.name} wheel`}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      )}

                      <span className="bmw-cfg-option-copy">
                        {item.name}
                        {item.size ? ` · ${item.size}"` : ""}
                        {item.design ? ` · ${item.design}` : ""}
                      </span>

                      <strong>
                        {item.price > 0
                          ? `+${formatPrice(item.price)}`
                          : "Included"}
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* INTERIOR */}

          {availableInteriors.length > 0 && (
            <div className="bmw-cfg-group">
              <div className="bmw-cfg-group__header">
                <div>
                  <span className="bmw-cfg-group__step">
                    03
                  </span>

                  <span className="bmw-cfg-group__label">
                    Interior
                  </span>
                </div>

                <strong className="bmw-cfg-group__val">
                  {interior?.name}
                </strong>
              </div>

              <div className="bmw-cfg-options-list">
                {availableInteriors.map((item) => {
                  const imageUrl = (
                    item as CarInterior & ImageOption
                  ).imageUrl;

                  return (
                    <button
                      key={item._id ?? item.name}
                      type="button"
                      aria-pressed={interior?.name === item.name}
                      className={`bmw-cfg-option-item ${
                        interior?.name === item.name
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() => {
                        // See the note below about interior selection.
                      }}
                    >
                      {imageUrl && (
                        <img
                          className="bmw-cfg-option-image"
                          src={resolveImageUrl(imageUrl)}
                          alt={`${item.name} interior`}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      )}

                      <span className="bmw-cfg-option-label">
                        <span
                          className="bmw-cfg-interior-dot"
                          style={{
                            backgroundColor:
                              item.color || "#64748b",
                          }}
                        />

                        <span className="bmw-cfg-option-copy">
                          {item.name}
                          {item.material
                            ? ` · ${item.material}`
                            : ""}
                        </span>
                      </span>

                      <strong>
                        {item.price > 0
                          ? `+${formatPrice(item.price)}`
                          : "Included"}
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ENGINE */}

          {availableEngines.length > 0 && (
            <div className="bmw-cfg-group">
              <div className="bmw-cfg-group__header">
                <div>
                  <span className="bmw-cfg-group__step">
                    04
                  </span>

                  <span className="bmw-cfg-group__label">
                    Engine
                  </span>
                </div>

                <strong className="bmw-cfg-group__val">
                  {engine?.name}
                </strong>
              </div>

              <div className="bmw-cfg-options-list">
                {availableEngines.map((item) => (
                  <button
                    key={item._id ?? item.name}
                    type="button"
                    aria-pressed={engine?.name === item.name}
                    className={`bmw-cfg-option-item ${
                      engine?.name === item.name
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedEngineId(item.name)
                    }
                  >
                    <span className="bmw-cfg-option-copy">
                      {item.name}

                      <small className="bmw-cfg-option-meta">
                        {item.horsepower
                          ? `${item.horsepower} HP`
                          : ""}
                        {item.fuelType
                          ? ` · ${item.fuelType}`
                          : ""}
                        {item.transmission
                          ? ` · ${item.transmission}`
                          : ""}
                      </small>
                    </span>

                    <strong>
                      {item.price > 0
                        ? `+${formatPrice(item.price)}`
                        : "Included"}
                    </strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANT */}

          {availableVariants.length > 0 && (
            <div className="bmw-cfg-group">
              <div className="bmw-cfg-group__header">
                <div>
                  <span className="bmw-cfg-group__step">
                    05
                  </span>

                  <span className="bmw-cfg-group__label">
                    Variant
                  </span>
                </div>

                <strong className="bmw-cfg-group__val">
                  {variant?.name}
                </strong>
              </div>

              <div className="bmw-cfg-options-list">
                {availableVariants.map((item) => (
                  <button
                    key={item._id ?? item.name}
                    type="button"
                    aria-pressed={variant?.name === item.name}
                    className={`bmw-cfg-option-item ${
                      variant?.name === item.name
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedVariantId(item.name)
                    }
                  >
                    <span className="bmw-cfg-option-copy">
                      {item.name}

                      {item.description && (
                        <small className="bmw-cfg-option-meta">
                          {item.description}
                        </small>
                      )}
                    </span>

                    <strong>
                      {item.price > 0
                        ? `+${formatPrice(item.price)}`
                        : "Included"}
                    </strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRICE SUMMARY */}

          <div className="bmw-cfg-price-box">
            <div className="bmw-cfg-price-heading">
              <span>YOUR CONFIGURATION</span>

              <span className="bmw-cfg-price-badge">
                ESTIMATE
              </span>
            </div>

            <span className="bmw-cfg-price-title">
              Estimated Configuration Price
            </span>

            <strong className="bmw-cfg-total-price">
              {formatPrice(totalPrice)}
            </strong>

            <p className="bmw-cfg-price-disclaimer">
              Final pricing may vary depending on availability,
              taxes and dealer charges.
            </p>

            <div className="bmw-cfg-price-breakdown">
              <div>
                <span>Base Price</span>
                <span>{formatPrice(car.basePrice)}</span>
              </div>

              {color && color.price > 0 && (
                <div>
                  <span>{color.name}</span>
                  <span>+{formatPrice(color.price)}</span>
                </div>
              )}

              {wheel && wheel.price > 0 && (
                <div>
                  <span>{wheel.name}</span>
                  <span>+{formatPrice(wheel.price)}</span>
                </div>
              )}

              {interior && interior.price > 0 && (
                <div>
                  <span>{interior.name}</span>
                  <span>+{formatPrice(interior.price)}</span>
                </div>
              )}

              {engine && engine.price > 0 && (
                <div>
                  <span>{engine.name}</span>
                  <span>+{formatPrice(engine.price)}</span>
                </div>
              )}

              {variant && variant.price > 0 && (
                <div>
                  <span>{variant.name}</span>
                  <span>+{formatPrice(variant.price)}</span>
                </div>
              )}

              <div className="bmw-cfg-price-final">
                <span>Total Estimated Price</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}

          <div className="bmw-cfg-actions">
            <button
              type="button"
              className="bmw-cfg-btn bmw-cfg-btn--save"
              onClick={() => void handleSaveConfiguration()}
              disabled={savingConfiguration}
            >
              {savingConfiguration
                ? "Saving Configuration..."
                : "Save Configuration"}
            </button>

            <button
              type="button"
              className="bmw-cfg-btn bmw-cfg-btn--test-drive"
              onClick={handleOpenTestDrive}
            >
              Book Test Drive
            </button>

            <button
              type="button"
              className="bmw-cfg-btn bmw-cfg-btn--quotation"
              onClick={() => void handleRequestQuotation()}
              disabled={requestingQuotation}
            >
              {requestingQuotation
                ? "Submitting Request..."
                : "Request Quotation"}
            </button>
          </div>

          <div className="bmw-cfg-secure-note">
            <span aria-hidden="true">✓</span>
            Your configuration is ready to personalize.
          </div>
        </aside>
      </section>

      {/* SEPARATE TEST DRIVE MODAL */}

      {showTestDrive && (
        <TestDriveModal
          car={{
            _id: car._id,
            slug: car.slug,
            name: car.name,
          }}
          onClose={() => setShowTestDrive(false)}
        />
      )}
    </main>
  );
}
