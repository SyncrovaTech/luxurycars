import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getShowrooms,
  type Showroom,
} from "../../api/showrooms.api";

import ShowroomCard from "../../components/showroom/ShowroomCard";

import "../../styles/pages//home/Contact.css";

function Contact() {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadShowrooms = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getShowrooms({
          city: city || undefined,
          search: search.trim() || undefined,
          limit: 50,
        });

        if (!cancelled) {
          setShowrooms(result.showrooms);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load showrooms. Please try again later."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timeout = window.setTimeout(() => {
      void loadShowrooms();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [city, search]);

  const cities = Array.from(
    new Set(showrooms.map((showroom) => showroom.city))
  ).sort();

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__content">
          <span className="contact-eyebrow">
            PERSONALIZED LUXURY EXPERIENCE
          </span>

          <h1>
            Find Your
            <br />
            <span>BMW Showroom</span>
          </h1>

          <p>
            Connect with our showroom team for vehicle
            enquiries, test drives and personalized assistance.
            Find the branch closest to you.
          </p>

          <a href="#showroom-list" className="contact-hero__button">
            Explore Showrooms
          </a>
        </div>
      </section>

      <section className="contact-intro">
        <span className="contact-eyebrow">WE ARE HERE FOR YOU</span>

        <h2>Our Showroom Network</h2>

        <p>
          Every showroom offers a personalized experience.
          Choose your preferred location to find its contact
          details, directions and opening hours.
        </p>
      </section>

      <section
        className="contact-directory"
        id="showroom-list"
      >
        <div className="contact-directory__heading">
          <div>
            <span className="contact-eyebrow">
              OUR LOCATIONS
            </span>

            <h2>Visit Us</h2>
          </div>

          <Link
            to="/cars"
            className="contact-directory__cars-link"
          >
            Explore Cars →
          </Link>
        </div>

        <div className="contact-filters">
          <label className="contact-search">
            <span>Search Showrooms</span>

            <input
              type="search"
              placeholder="Search by name, city or branch code..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </label>

          <label className="contact-city-filter">
            <span>City</span>

            <select
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
            >
              <option value="">All Cities</option>

              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="contact-state">
            <div className="contact-loader" />
            <p>Finding your showroom...</p>
          </div>
        ) : error ? (
          <div className="contact-state contact-state--error">
            <h3>Something went wrong</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => {
                setSearch((value) => value);
                setCity((value) => value);
                window.location.reload();
              }}
            >
              Try Again
            </button>
          </div>
        ) : showrooms.length === 0 ? (
          <div className="contact-state">
            <h3>No Showrooms Found</h3>

            <p>
              Try another search or select a different city.
            </p>
          </div>
        ) : (
          <>
            <div className="contact-results">
              Showing {showrooms.length} showroom
              {showrooms.length === 1 ? "" : "s"}
            </div>

            <div className="showroom-grid">
              {showrooms.map((showroom) => (
                <ShowroomCard
                  key={showroom._id}
                  showroom={showroom}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="contact-cta">
        <span className="contact-eyebrow">
          YOUR NEXT JOURNEY STARTS HERE
        </span>

        <h2>Ready to Experience BMW?</h2>

        <p>
          Explore our collection and discover the vehicle
          that matches your lifestyle.
        </p>

        <Link to="/cars" className="contact-cta__button">
          Discover Our Cars
        </Link>
      </section>
    </main>
  );
}

export default Contact;