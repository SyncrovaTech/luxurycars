import { Link } from "react-router-dom";

import type { Showroom } from "../../api/showrooms.api";

import "../../styles/components/showroom/ShowroomCard.css";

interface ShowroomCardProps {
  showroom: Showroom;
}

function ShowroomCard({ showroom }: ShowroomCardProps) {
  const mapUrl =
    showroom.mapUrl ||
    (typeof showroom.latitude === "number" &&
    typeof showroom.longitude === "number"
      ? `https://www.google.com/maps?q=${showroom.latitude},${showroom.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${showroom.address}, ${showroom.city}, ${showroom.state}`
        )}`);

  return (
    <article className="showroom-card">
      <div className="showroom-card__image">
        {showroom.imageUrl ? (
          <img
            src={showroom.imageUrl}
            alt={showroom.name}
            loading="lazy"
          />
        ) : (
          <div className="showroom-card__image-placeholder">
            <span>BMW</span>
            <p>Luxury Showroom</p>
          </div>
        )}

        <span className="showroom-card__badge">
          Official Showroom
        </span>
      </div>

      <div className="showroom-card__body">
        <div className="showroom-card__branch">
          {showroom.branchCode}
        </div>

        <h3>{showroom.name}</h3>

        {showroom.description && (
          <p className="showroom-card__description">
            {showroom.description}
          </p>
        )}

        <div className="showroom-card__detail">
          <span className="showroom-card__icon">⌖</span>

          <p>
            {showroom.address}
            <br />
            {showroom.city}, {showroom.state}{" "}
            {showroom.postalCode}
          </p>
        </div>

        <div className="showroom-card__detail">
          <span className="showroom-card__icon">☎</span>

          <div>
            {showroom.phoneNumbers.map((phone) => (
              <a
                className="showroom-card__contact"
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                key={phone}
              >
                {phone}
              </a>
            ))}
          </div>
        </div>

        <div className="showroom-card__detail">
          <span className="showroom-card__icon">✉</span>

          <a
            className="showroom-card__contact"
            href={`mailto:${showroom.email}`}
          >
            {showroom.email}
          </a>
        </div>

        <div className="showroom-card__actions">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="showroom-card__map-button"
          >
            Get Directions ↗
          </a>

          <Link
            to={`/contact/${encodeURIComponent(showroom.slug)}`}
            className="showroom-card__details-button"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ShowroomCard;