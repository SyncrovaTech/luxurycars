import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiRefreshCw,
  FiSliders,
  FiZap,
} from "react-icons/fi";

import {
  getCarRecommendations,
  type RecommendationPreferences,
  type RecommendedCar,
} from "../../api/recommendations.api";

import "../../styles/pages/cars/CarRecommendation.css";

const initialPreferences: RecommendationPreferences = {
  budgetMin: 0,
  budgetMax: 50000000,
  message: "",
  brand: "",
  category: "",
  fuelType: "",
  transmission: "",
  usage: "",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CarRecommendation() {
  const navigate = useNavigate();

  const [preferences, setPreferences] =
    useState<RecommendationPreferences>(initialPreferences);

  const [cars, setCars] = useState<RecommendedCar[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updatePreference<K extends keyof RecommendationPreferences>(
    key: K,
    value: RecommendationPreferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (preferences.budgetMin > preferences.budgetMax) {
      setError("Minimum budget cannot be greater than maximum budget.");
      return;
    }

    setLoading(true);

    try {
      const response = await getCarRecommendations(preferences);
      setCars(response.data);
      setMessage(response.message);
      setSearched(true);
    } catch (err) {
      const apiError = err as {
        response?: { data?: { message?: string } };
      };

      setError(
        apiError.response?.data?.message ??
          "Recommendations could not be loaded. Please check the backend API.",
      );
      setCars([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function resetPreferences() {
    setPreferences(initialPreferences);
    setCars([]);
    setSearched(false);
    setError("");
    setMessage("");
  }

  function openCar(car: RecommendedCar) {
    if (car.slug) {
      navigate(`/configurator/${car.slug}`);
    } else {
      navigate("/cars");
    }
  }

  return (
    <main className="recommendation-page">
      <section className="recommendation-hero">
        <div className="recommendation-hero__content">
          <span className="recommendation-eyebrow">
            <FiCpu /> SMART CAR FINDER
          </span>

          <h1>
            Find the car that
            <span> fits your life.</span>
          </h1>

          <p>
            Tell us what matters to you. We’ll match your preferences with
            cars available in our showroom.
          </p>

          <div className="recommendation-hero__features">
            <span><FiCheckCircle /> Personalized matches</span>
            <span><FiZap /> Instant results</span>
          </div>
        </div>

        <div className="recommendation-hero__visual" aria-hidden="true">
          <div className="recommendation-orbit recommendation-orbit--one" />
          <div className="recommendation-orbit recommendation-orbit--two" />
          <FiCpu className="recommendation-hero__icon" />
          <span className="recommendation-hero__visual-label">
            YOUR NEXT DRIVE
          </span>
        </div>
      </section>

      <section className="recommendation-workspace">
        <form className="recommendation-form" onSubmit={handleSubmit}>
          <div className="recommendation-form__heading">
            <div className="recommendation-section-icon">
              <FiSliders />
            </div>
            <div>
              <span className="recommendation-kicker">PERSONALIZE</span>
              <h2>Your preferences</h2>
              <p>Choose what matters most. Leave fields blank to skip them.</p>
            </div>
          </div>

          <div className="recommendation-field">
            <label htmlFor="budgetMin">Minimum budget (₹)</label>
            <input
              id="budgetMin"
              type="number"
              min="0"
              step="100000"
              value={preferences.budgetMin}
              onChange={(event) =>
                updatePreference("budgetMin", Number(event.target.value))
              }
            />
          </div>

          <div className="recommendation-field">
            <label htmlFor="budgetMax">Maximum budget (₹)</label>
            <input
              id="budgetMax"
              type="number"
              min="0"
              step="100000"
              required
              value={preferences.budgetMax}
              onChange={(event) =>
                updatePreference("budgetMax", Number(event.target.value))
              }
            />
            <small>
              Current maximum: {formatPrice(preferences.budgetMax || 0)}
            </small>
          </div>

          <div className="recommendation-field">
            <label htmlFor="brand">Preferred brand</label>
            <input
              id="brand"
              type="text"
              placeholder="e.g. BMW, Mercedes-Benz"
              value={preferences.brand}
              onChange={(event) => updatePreference("brand", event.target.value)}
            />
          </div>

          <div className="recommendation-field">
            <label htmlFor="category">Car type</label>
            <select
              id="category"
              value={preferences.category}
              onChange={(event) =>
                updatePreference("category", event.target.value)
              }
            >
              <option value="">Any type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Sports">Sports / Supercar</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="recommendation-field">
            <label htmlFor="fuelType">Fuel type</label>
            <select
              id="fuelType"
              value={preferences.fuelType}
              onChange={(event) =>
                updatePreference("fuelType", event.target.value)
              }
            >
              <option value="">Any fuel type</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div className="recommendation-field">
            <label htmlFor="transmission">Transmission</label>
            <select
              id="transmission"
              value={preferences.transmission}
              onChange={(event) =>
                updatePreference("transmission", event.target.value)
              }
            >
              <option value="">Any transmission</option>
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          <div className="recommendation-field">
            <label htmlFor="usage">Main purpose</label>
            <select
              id="usage"
              value={preferences.usage}
              onChange={(event) => updatePreference("usage", event.target.value)}
            >
              <option value="">All purposes</option>
              <option value="city">City driving</option>
              <option value="family">Family use</option>
              <option value="performance">Performance & sport</option>
              <option value="business">Business & comfort</option>
            </select>
          </div>

          {error && (
            <div className="recommendation-error" role="alert">
              {error}
            </div>
          )}

          <div className="recommendation-form__actions">
            <button
              className="recommendation-reset"
              type="button"
              onClick={resetPreferences}
            >
              <FiRefreshCw /> Reset
            </button>

            <button
              className="recommendation-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Finding cars..." : "Find my car"}
              {!loading && <FiArrowRight />}
            </button>
          </div>
        </form>

        <section className="recommendation-results" aria-live="polite">
          <div className="recommendation-results__heading">
            <div>
              <span className="recommendation-kicker">CURATED FOR YOU</span>
              <h2>Recommended cars</h2>
              <p>
                {searched
                  ? `${cars.length} matching car${cars.length === 1 ? "" : "s"}`
                  : "Your personalized shortlist will appear here."}
              </p>
            </div>

            {searched && cars.length > 0 && (
              <span className="recommendation-result-count">
                {cars.length} RESULTS
              </span>
            )}
          </div>

          {loading && (
            <div className="recommendation-state">
              <div className="recommendation-spinner" />
              <h3>Finding your match</h3>
              <p>Comparing your preferences with available cars...</p>
            </div>
          )}

          {!loading && !searched && (
            <div className="recommendation-state">
              <FiCpu className="recommendation-state__icon" />
              <h3>Your next car starts here</h3>
              <p>Set your preferences and discover cars matched to your needs.</p>
            </div>
          )}

          {!loading && searched && cars.length === 0 && (
            <div className="recommendation-state">
              <h3>No matching cars found</h3>
              <p>{message || "Try increasing your budget or removing some filters."}</p>
            </div>
          )}

          {!loading && cars.length > 0 && (
            <div className="recommendation-grid">
              {cars.map((car) => (
                <article className="recommendation-card" key={car.id}>
                  <div className="recommendation-card__image">
                    {car.image ? (
                      <img src={car.image} alt={car.name} loading="lazy" />
                    ) : (
                      <div className="recommendation-card__placeholder">
                        <FiCpu />
                        <span>PREMIUM AUTOMOTIVE</span>
                      </div>
                    )}

                    <span className="recommendation-match">
                      {car.matchScore}% match
                    </span>
                  </div>

                  <div className="recommendation-card__body">
                    <span className="recommendation-card__brand">
                      {car.brand || "LUXURY COLLECTION"}
                    </span>

                    <h3>{car.name}</h3>
                    <p className="recommendation-card__price">
                      {formatPrice(car.price)}
                    </p>

                    <div className="recommendation-card__specs">
                      {car.category && <span>{car.category}</span>}
                      {car.fuelType && <span>{car.fuelType}</span>}
                      {car.transmission && <span>{car.transmission}</span>}
                    </div>

                    <div className="recommendation-card__reasons">
                      <strong>Why this car?</strong>
                      {car.reasons.slice(0, 3).map((reason) => (
                        <span key={reason}>
                          <FiCheckCircle /> {reason}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="recommendation-card__button"
                      onClick={() => openCar(car)}
                    >
                      Explore car <FiArrowRight />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}