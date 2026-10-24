import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  getShowrooms,
  type Showroom,
} from "../../api/showrooms.api";

import { bookTestDrive } from "../../api/testDrives.api";
import { useAuth } from "../../auth/AuthContext";
import { useRequireAuth } from "../../auth/useRequireAuth";

import "../../styles/components/test-drive/TestDriveModal.css";

interface TestDriveCar {
  _id: string;
  slug: string;
  name: string;
}

interface TestDriveModalProps {
  car: TestDriveCar;
  onClose: () => void;
}

function getCustomerName(user: unknown): string {
  if (!user || typeof user !== "object") {
    return "";
  }

  const customer = user as {
    fullName?: string;
    name?: string;
  };

  return customer.fullName || customer.name || "";
}

function getCustomerEmail(user: unknown): string {
  if (!user || typeof user !== "object") {
    return "";
  }

  const customer = user as {
    email?: string;
  };

  return customer.email || "";
}

function getErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err
  ) {
    const response = err.response;

    if (
      response &&
      typeof response === "object" &&
      "data" in response
    ) {
      const data = response.data;

      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }
    }
  }

  return "Test Drive booking થઈ શકી નથી. કૃપા કરીને ફરી પ્રયાસ કરો.";
}

export default function TestDriveModal({
  car,
  onClose,
}: TestDriveModalProps) {
  const { user } = useAuth();

  // IMPORTANT: useRequireAuth returns an object.
  const { requireAuth } = useRequireAuth();

  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [showroomId, setShowroomId] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingShowrooms, setLoadingShowrooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date();

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    let active = true;

    async function loadShowrooms() {
      try {
        setLoadingShowrooms(true);
        setError("");

        const result = await getShowrooms({
          page: 1,
          limit: 100,
        });

        if (!active) {
          return;
        }

        const activeShowrooms = result.showrooms.filter(
          (showroom) => showroom.isActive
        );

        setShowrooms(activeShowrooms);

        if (activeShowrooms.length === 1) {
          setShowroomId(activeShowrooms[0]._id);
        }
      } catch (err: unknown) {
        console.error("Failed to load showrooms:", err);

        if (active) {
          setError(
            "Showrooms load થઈ શક્યા નથી. કૃપા કરીને ફરી પ્રયાસ કરો."
          );
        }
      } finally {
        if (active) {
          setLoadingShowrooms(false);
        }
      }
    }

    void loadShowrooms();

    return () => {
      active = false;
    };
  }, []);

  const selectedShowroom = showrooms.find(
    (showroom) => showroom._id === showroomId
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (loadingShowrooms) {
      setError("Showrooms load થઈ રહ્યાં છે. કૃપા કરીને રાહ જુઓ.");
      return;
    }

    if (!selectedShowroom) {
      setError("કૃપા કરીને showroom પસંદ કરો.");
      return;
    }

    if (!date || date < minDate) {
      setError("કૃપા કરીને આજની અથવા ભવિષ્યની તારીખ પસંદ કરો.");
      return;
    }

    if (!time) {
      setError("કૃપા કરીને test drive માટે સમય પસંદ કરો.");
      return;
    }

    const normalizedMobile = mobile.replace(/\s+/g, "").trim();

    if (!/^\+?[0-9]{10,15}$/.test(normalizedMobile)) {
      setError("કૃપા કરીને સાચો mobile number દાખલ કરો.");
      return;
    }

    const bookingLocation =
      `${selectedShowroom.name} - ${selectedShowroom.city}`;

    try {
      setSubmitting(true);

      await requireAuth("BOOK_TEST_DRIVE", async () => {
        try {
          setError("");

          await bookTestDrive({
            carId: car._id,
            carSlug: car.slug,
            carName: car.name,

            fullName: getCustomerName(user) || "Luxury Customer",
            email: getCustomerEmail(user),

            mobile: normalizedMobile,
            date,
            time,

            showroomId: selectedShowroom._id,
            location: bookingLocation,

            notes: notes.trim(),
          });

          setSuccess(
            "તમારી Test Drive request સફળતાપૂર્વક મોકલવામાં આવી છે."
          );

          window.setTimeout(() => {
            onClose();
          }, 1400);
        } catch (err: unknown) {
          console.error("Test drive booking failed:", err);
          setError(getErrorMessage(err));
        } finally {
          setSubmitting(false);
        }
      });
    } catch (err: unknown) {
      console.error("Authentication check failed:", err);
      setSubmitting(false);
      setError(
        "Request પૂર્ણ થઈ શકી નથી. કૃપા કરીને ફરી પ્રયાસ કરો."
      );
    }
  }

  return (
    <div
      className="bmw-tdm-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <section
        className="bmw-tdm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bmw-tdm-title"
      >
        <button
          type="button"
          className="bmw-tdm-close"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close test drive form"
        >
          ×
        </button>

        <div className="bmw-tdm-header">
          <span className="bmw-tdm-eyebrow">
            BMW EXPERIENCE
          </span>

          <h2 id="bmw-tdm-title">Book a Test Drive</h2>

          <p>
            Experience the {car.name} at your preferred showroom.
          </p>
        </div>

        <form
          className="bmw-tdm-form"
          onSubmit={handleSubmit}
        >
          <div className="bmw-tdm-car">
            <span>Selected vehicle</span>
            <strong>{car.name}</strong>
          </div>

          <label className="bmw-tdm-field">
            <span>Preferred Showroom *</span>

            <select
              className="bmw-tdm-select"
              value={showroomId}
              onChange={(event) =>
                setShowroomId(event.target.value)
              }
              required
              disabled={loadingShowrooms || submitting}
            >
              <option value="">
                {loadingShowrooms
                  ? "Loading showrooms..."
                  : showrooms.length === 0
                    ? "No active showrooms available"
                    : "Select showroom"}
              </option>

              {showrooms.map((showroom) => (
                <option
                  key={showroom._id}
                  value={showroom._id}
                >
                  {showroom.name} — {showroom.city}
                </option>
              ))}
            </select>
          </label>

          {selectedShowroom && (
            <div className="bmw-tdm-showroom-info">
              <strong>{selectedShowroom.name}</strong>

              <span>
                {selectedShowroom.address},{" "}
                {selectedShowroom.city},{" "}
                {selectedShowroom.state}{" "}
                {selectedShowroom.postalCode}
              </span>

              {selectedShowroom.phoneNumbers.length > 0 && (
                <span>
                  Contact:{" "}
                  {selectedShowroom.phoneNumbers.join(", ")}
                </span>
              )}
            </div>
          )}

          <div className="bmw-tdm-row">
            <label className="bmw-tdm-field">
              <span>Preferred Date *</span>

              <input
                className="bmw-tdm-input"
                type="date"
                value={date}
                min={minDate}
                onChange={(event) => setDate(event.target.value)}
                required
                disabled={submitting}
              />
            </label>

            <label className="bmw-tdm-field">
              <span>Preferred Time *</span>

              <input
                className="bmw-tdm-input"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
                disabled={submitting}
              />
            </label>
          </div>

          <label className="bmw-tdm-field">
            <span>Mobile Number *</span>

            <input
              className="bmw-tdm-input"
              type="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="Enter your mobile number"
              autoComplete="tel"
              required
              disabled={submitting}
            />
          </label>

          <label className="bmw-tdm-field">
            <span>Additional Notes</span>

            <textarea
              className="bmw-tdm-textarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Any preferences or questions?"
              rows={3}
              maxLength={1000}
              disabled={submitting}
            />
          </label>

          {error && (
            <p className="bmw-tdm-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="bmw-tdm-success" role="status">
              {success}
            </p>
          )}

          <div className="bmw-tdm-actions">
            <button
              type="button"
              className="bmw-tdm-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bmw-tdm-submit"
              disabled={
                submitting ||
                loadingShowrooms ||
                showrooms.length === 0 ||
                Boolean(success)
              }
            >
              {submitting
                ? "Submitting..."
                : "Request Test Drive"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}