import { useEffect, useState } from "react";

import {
  type Showroom,
  type ShowroomPayload,
  type ShowroomOpeningHour,
} from "../../../api/showroom-management.api";

import "../../../styles/pages/super-admin/showrooms/ShowroomForm.css";

interface ShowroomFormProps {
  initialData?: Showroom | null;
  submitting: boolean;

  onSubmit: (
    payload: ShowroomPayload
  ) => Promise<void>;

  onCancel: () => void;
}

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createDefaultHours = (): ShowroomOpeningHour[] =>
  WEEK_DAYS.map((day) => ({
    day,
    open: "09:00",
    close: "18:00",
    isClosed: day === "Sunday",
  }));

const createEmptyForm = (): ShowroomPayload => ({
  name: "",
  slug: "",
  branchCode: "",
  description: "",

  address: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",

  phoneNumbers: [""],
  email: "",

  mapUrl: "",
  latitude: undefined,
  longitude: undefined,

  openingHours: createDefaultHours(),

  imageUrl: "",
  galleryImages: [],

  isActive: true,
});

function ShowroomForm({
  initialData,
  submitting,
  onSubmit,
  onCancel,
}: ShowroomFormProps) {
  const [form, setForm] = useState<ShowroomPayload>(
    createEmptyForm
  );

  const [galleryText, setGalleryText] = useState("");

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!initialData) {
      setForm(createEmptyForm());
      setGalleryText("");
      return;
    }

    const defaults = createEmptyForm();

    const savedHours = initialData.openingHours ?? [];

    const openingHours = WEEK_DAYS.map((day) => {
      const saved = savedHours.find(
        (hour) => hour.day === day
      );

      return (
        saved ?? {
          day,
          open: "09:00",
          close: "18:00",
          isClosed: day === "Sunday",
        }
      );
    });

    setForm({
      name: initialData.name,
      slug: initialData.slug,
      branchCode: initialData.branchCode,
      description: initialData.description ?? "",

      address: initialData.address,
      city: initialData.city,
      state: initialData.state,
      country: initialData.country,
      postalCode: initialData.postalCode,

      phoneNumbers:
        initialData.phoneNumbers?.length > 0
          ? initialData.phoneNumbers
          : [""],

      email: initialData.email,

      mapUrl: initialData.mapUrl ?? "",
      latitude: initialData.latitude,
      longitude: initialData.longitude,

      openingHours,

      imageUrl: initialData.imageUrl ?? "",
      galleryImages: initialData.galleryImages ?? [],

      isActive: initialData.isActive,
    });

    setGalleryText(
      (initialData.galleryImages ?? []).join("\n")
    );

    setFormError("");
  }, [initialData]);

  const updateField = <
    K extends keyof ShowroomPayload
  >(
    field: K,
    value: ShowroomPayload[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updatePhone = (
    index: number,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      phoneNumbers: previous.phoneNumbers.map(
        (phone, phoneIndex) =>
          phoneIndex === index ? value : phone
      ),
    }));
  };

  const addPhone = () => {
    setForm((previous) => ({
      ...previous,
      phoneNumbers: [
        ...previous.phoneNumbers,
        "",
      ],
    }));
  };

  const removePhone = (index: number) => {
    setForm((previous) => ({
      ...previous,
      phoneNumbers: previous.phoneNumbers.filter(
        (_, phoneIndex) => phoneIndex !== index
      ),
    }));
  };

  const updateOpeningHour = (
    index: number,
    changes: Partial<ShowroomOpeningHour>
  ) => {
    setForm((previous) => ({
      ...previous,
      openingHours: previous.openingHours.map(
        (hour, hourIndex) =>
          hourIndex === index
            ? { ...hour, ...changes }
            : hour
      ),
    }));
  };

  const handleNameChange = (value: string) => {
    setForm((previous) => {
      const oldGeneratedSlug = previous.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const currentSlug = previous.slug;

      const shouldUpdateSlug =
        !currentSlug ||
        currentSlug === oldGeneratedSlug;

      const generatedSlug = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        ...previous,
        name: value,
        slug: shouldUpdateSlug
          ? generatedSlug
          : currentSlug,
      };
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormError("");

    const phoneNumbers = form.phoneNumbers
      .map((phone) => phone.trim())
      .filter(Boolean);

    if (phoneNumbers.length === 0) {
      setFormError(
        "At least one contact number is required."
      );
      return;
    }

    if (
      form.latitude !== undefined &&
      (form.latitude < -90 || form.latitude > 90)
    ) {
      setFormError("Latitude must be between -90 and 90.");
      return;
    }

    if (
      form.longitude !== undefined &&
      (form.longitude < -180 || form.longitude > 180)
    ) {
      setFormError(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    const payload: ShowroomPayload = {
      ...form,

      name: form.name.trim(),
      slug: form.slug.trim(),
      branchCode: form.branchCode.trim().toUpperCase(),

      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      postalCode: form.postalCode.trim(),

      email: form.email.trim().toLowerCase(),

      phoneNumbers,

      galleryImages: galleryText
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save showroom."
      );
    }
  };

  return (
    <form
      className="showroom-form"
      onSubmit={handleSubmit}
    >
      {formError && (
        <div className="showroom-form__error">
          {formError}
        </div>
      )}

      <section className="showroom-form__section">
        <h3>Branch Information</h3>

        <div className="showroom-form__grid">
          <label>
            Showroom Name *
            <input
              required
              maxLength={150}
              value={form.name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              placeholder="BMW Ahmedabad Central"
            />
          </label>

          <label>
            Branch Code *
            <input
              required
              maxLength={30}
              value={form.branchCode}
              onChange={(event) =>
                updateField(
                  "branchCode",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="AMD001"
            />
          </label>

          <label>
            URL Slug *
            <input
              required
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              placeholder="ahmedabad-central"
            />
          </label>

          <label>
            Status
            <select
              value={String(form.isActive)}
              onChange={(event) =>
                updateField(
                  "isActive",
                  event.target.value === "true"
                )
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        </div>

        <label className="showroom-form__full">
          Description
          <textarea
            rows={4}
            maxLength={2000}
            value={form.description ?? ""}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            placeholder="Write about this showroom..."
          />
        </label>
      </section>

      <section className="showroom-form__section">
        <h3>Address Information</h3>

        <div className="showroom-form__grid">
          <label className="showroom-form__full">
            Full Address *
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(event) =>
                updateField("address", event.target.value)
              }
              placeholder="Street, area and building..."
            />
          </label>

          <label>
            City *
            <input
              required
              value={form.city}
              onChange={(event) =>
                updateField("city", event.target.value)
              }
            />
          </label>

          <label>
            State *
            <input
              required
              value={form.state}
              onChange={(event) =>
                updateField("state", event.target.value)
              }
            />
          </label>

          <label>
            Country *
            <input
              required
              value={form.country}
              onChange={(event) =>
                updateField("country", event.target.value)
              }
            />
          </label>

          <label>
            Postal Code *
            <input
              required
              value={form.postalCode}
              onChange={(event) =>
                updateField(
                  "postalCode",
                  event.target.value
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="showroom-form__section">
        <h3>Contact Information</h3>

        <label className="showroom-form__full">
          Email Address *
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
          />
        </label>

        <div className="showroom-form__phone-heading">
          <strong>Phone Numbers *</strong>

          <button
            type="button"
            onClick={addPhone}
          >
            + Add Number
          </button>
        </div>

        {form.phoneNumbers.map((phone, index) => (
          <div
            className="showroom-form__phone-row"
            key={index}
          >
            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                updatePhone(index, event.target.value)
              }
              placeholder="+91..."
            />

            <button
              type="button"
              disabled={form.phoneNumbers.length === 1}
              onClick={() => removePhone(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="showroom-form__section">
        <h3>Map & Location</h3>

        <div className="showroom-form__grid">
          <label className="showroom-form__full">
            Google Maps URL
            <input
              type="url"
              value={form.mapUrl ?? ""}
              onChange={(event) =>
                updateField("mapUrl", event.target.value)
              }
              placeholder="https://maps.google.com/..."
            />
          </label>

          <label>
            Latitude
            <input
              type="number"
              min="-90"
              max="90"
              step="any"
              value={form.latitude ?? ""}
              onChange={(event) =>
                updateField(
                  "latitude",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value)
                )
              }
            />
          </label>

          <label>
            Longitude
            <input
              type="number"
              min="-180"
              max="180"
              step="any"
              value={form.longitude ?? ""}
              onChange={(event) =>
                updateField(
                  "longitude",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value)
                )
              }
            />
          </label>

          <label className="showroom-form__full">
            Main Image URL
            <input
              type="url"
              value={form.imageUrl ?? ""}
              onChange={(event) =>
                updateField("imageUrl", event.target.value)
              }
              placeholder="https://..."
            />
          </label>

          <label className="showroom-form__full">
            Gallery Image URLs
            <textarea
              rows={4}
              value={galleryText}
              onChange={(event) =>
                setGalleryText(event.target.value)
              }
              placeholder={
                "Enter one image URL per line\nhttps://example.com/image-1.jpg"
              }
            />
          </label>
        </div>
      </section>

      <section className="showroom-form__section">
        <h3>Opening Hours</h3>

        <div className="showroom-hours">
          {form.openingHours.map((hour, index) => (
            <div
              className="showroom-hours__row"
              key={hour.day}
            >
              <strong>{hour.day}</strong>

              <label>
                Open
                <input
                  type="time"
                  disabled={hour.isClosed}
                  value={hour.open}
                  onChange={(event) =>
                    updateOpeningHour(index, {
                      open: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Close
                <input
                  type="time"
                  disabled={hour.isClosed}
                  value={hour.close}
                  onChange={(event) =>
                    updateOpeningHour(index, {
                      close: event.target.value,
                    })
                  }
                />
              </label>

              <label className="showroom-hours__closed">
                <input
                  type="checkbox"
                  checked={hour.isClosed}
                  onChange={(event) =>
                    updateOpeningHour(index, {
                      isClosed: event.target.checked,
                    })
                  }
                />

                Closed
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className="showroom-form__actions">
        <button
          type="button"
          className="showroom-form__cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="showroom-form__submit"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : initialData
              ? "Update Showroom"
              : "Create Showroom"}
        </button>
      </div>
    </form>
  );
}

export default ShowroomForm;