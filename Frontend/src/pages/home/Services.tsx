import { Link } from "react-router-dom";

import "../../styles/pages/home/Services.css";

const services = [
  {
    number: "01",
    icon: "◈",
    title: "Personalized Consultation",
    description:
      "Get assistance in selecting a vehicle that matches your preferences, lifestyle and driving requirements.",
  },
  {
    number: "02",
    icon: "↗",
    title: "Test Drive Experience",
    description:
      "Connect with a showroom to enquire about arranging a test drive for your preferred vehicle.",
  },
  {
    number: "03",
    icon: "◇",
    title: "Vehicle Configuration",
    description:
      "Explore available vehicle configurations, colors, wheels and interiors using our online configurator.",
  },
  {
    number: "04",
    icon: "◎",
    title: "Showroom Assistance",
    description:
      "Find branch addresses, contact numbers, directions and available showroom opening hours.",
  },
  {
    number: "05",
    icon: "⌘",
    title: "Ownership Assistance",
    description:
      "Contact your preferred showroom to discuss vehicle ownership enquiries and available support.",
  },
  {
    number: "06",
    icon: "✧",
    title: "Digital Showroom",
    description:
      "Explore vehicles online before connecting with a showroom for more information.",
  },
];

function Services() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <span className="services-eyebrow">
          PREMIUM AUTOMOTIVE EXPERIENCE
        </span>

        <h1>
          Service Beyond
          <br />
          <span>Expectations.</span>
        </h1>

        <p>
          Explore our digital showroom services and connect
          with a showroom for personalized assistance.
        </p>

        <Link to="/contact" className="services-primary-button">
          Find a Showroom
        </Link>
      </section>

      <section className="services-content">
        <div className="services-section-heading">
          <span className="services-eyebrow">
            WHAT WE OFFER
          </span>

          <h2>Designed Around You</h2>

          <p>
            Discover convenient ways to explore vehicles and
            connect with our showroom network.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article
              className="services-card"
              key={service.number}
            >
              <div className="services-card__top">
                <span className="services-card__icon">
                  {service.icon}
                </span>

                <span className="services-card__number">
                  {service.number}
                </span>
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <Link
                to="/contact"
                className="services-card__link"
              >
                Learn More →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="services-bottom">
        <h2>Your Next Step Starts Here</h2>

        <p>
          Find your nearest showroom or browse the available
          vehicles in our collection.
        </p>

        <div className="services-bottom__actions">
          <Link to="/contact">Explore Locations</Link>

          <Link to="/cars">Browse Cars</Link>
        </div>
      </section>
    </main>
  );
}

export default Services;