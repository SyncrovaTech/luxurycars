
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCars, type Car } from "../../api/cars.api";
import "../../styles/pages/cars/CarCollection.css";

export default function CarCollection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCars = useCallback(async () => {
    try {
      setError("");
      const data = await getCars();
      setCars(data);
    } catch (err) {
      console.error("Failed to load cars:", err);
      setError("Unable to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCars();
  }, [loadCars]);

  if (loading) {
    return (
      <main className="lux-collection-page">
        <div className="lux-collection-status">
          <span className="lux-collection-loader" />
          <p>Preparing your luxury collection...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="lux-collection-page">
        <div className="lux-collection-status">
          <span className="lux-collection-status-icon">!</span>
          <h2>Collection unavailable</h2>
          <p>{error}</p>
          <button
            className="lux-collection-retry"
            onClick={() => void loadCars()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (cars.length === 0) {
    return (
      <main className="lux-collection-page">
        <div className="lux-collection-status">
          <span className="lux-collection-status-icon">◇</span>
          <h2>Collection coming soon</h2>
          <p>No cars are currently available.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="lux-collection-page">
      <header className="lux-collection-header">
        <div className="lux-collection-eyebrow">
          <span className="lux-collection-eyebrow-line" />
          LUXORA AUTOMOTIVE
          <span className="lux-collection-eyebrow-line" />
        </div>

        <h1 className="lux-collection-title">
          Discover Your
          <span> Next Obsession.</span>
        </h1>

        <p className="lux-collection-subtitle">
          Exceptional engineering. Unmistakable presence.
          Find the vehicle that reflects your ambition.
        </p>

        <div className="lux-collection-count">
          <span className="lux-collection-count-dot" />
          {cars.length} VEHICLES IN COLLECTION
        </div>
      </header>

      <section
        className="lux-collection-grid"
        aria-label="Available luxury cars"
      >
        {cars.map((car, index) => (
          <article className="lux-collection-card" key={car._id}>
            <div className="lux-collection-image-wrap">
              <span className="lux-collection-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="lux-collection-image-label">
                LUXURY SERIES
              </span>

              {car.imageUrl ? (
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="lux-collection-image"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
              ) : null}

              <div className="lux-collection-image-shade" />
            </div>

            <div className="lux-collection-card-body">
              <p className="lux-collection-brand">{car.brand}</p>

              <h2 className="lux-collection-car-name">{car.name}</h2>

              <div className="lux-collection-price-row">
                <span className="lux-collection-price-label">
                  Starting from
                </span>
                <span className="lux-collection-price">
                  ₹{Number(car.basePrice).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="lux-collection-divider" />

              <Link
                className="lux-collection-configure"
                to={`/cars/${car.slug}/configure`}
              >
                <span>Configure Your Car</span>
                <span className="lux-collection-arrow">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <footer className="lux-collection-footer">
        <span>ENGINEERED FOR EXCELLENCE</span>
        <span className="lux-collection-footer-line" />
        <span>THE LUXORA EXPERIENCE</span>
      </footer>
    </main>
  );
}
