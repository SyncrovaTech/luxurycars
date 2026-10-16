
import { Link } from "react-router-dom";

import CarScene from "../../components/home/CarScene";
import "../../styles/pages/home/Home.css";

const stats = [
  { value: "25+", label: "Luxury Models" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const modelFeatures = [
  {
    number: "01",
    title: "Performance",
    description:
      "Precision engineering designed for an unforgettable drive with dynamic chassis controls.",
  },
  {
    number: "02",
    title: "Luxury",
    description:
      "Premium materials, handcrafted leather interiors and exceptional cabin acoustics.",
  },
  {
    number: "03",
    title: "Innovation",
    description:
      "Intelligent 3D visualization connecting your vehicle with your digital lifestyle.",
  },
];

const technologyFeatures = [
  {
    badge: "3D",
    title: "Virtual Configuration",
    description:
      "Configure colors, wheels and interiors inside our real-time 3D viewer.",
  },
  {
    badge: "AI",
    title: "Instant Quotations",
    description:
      "Explore vehicle pricing and request a personalized quotation.",
  },
  {
    badge: "VIP",
    title: "Private Test Drives",
    description:
      "Request a showroom or doorstep test drive through your personal portal.",
  },
];

const navigation = [
  { label: "Models", href: "#models" },
  { label: "Experience", href: "#experience" },
  { label: "Technology", href: "#technology" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  return (
    <main className="bmw-hm-page">
      <header className="bmw-hm-navbar">
        <Link to="/" className="bmw-hm-logo" aria-label="Luxora home">
          <span className="bmw-hm-logo-badge">L</span>
          <span className="bmw-hm-logo-text">LUXORA</span>
        </Link>

        <nav className="bmw-hm-nav-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="bmw-hm-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="bmw-hm-auth">
          <Link to="/login" className="bmw-hm-btn-login">
            Login
          </Link>
          <Link to="/register" className="bmw-hm-btn-register">
            Register
          </Link>
        </div>
      </header>

      <section className="bmw-hm-hero">
        <div className="bmw-hm-scene">
          <CarScene />
        </div>

        <div className="bmw-hm-hero-overlay" />

        <div className="bmw-hm-hero-content">
          <div className="bmw-hm-hero-label">
            Premium Automotive Experience
          </div>

          <h1 className="bmw-hm-hero-title">
            Drive The
            <br />
            <span>Extraordinary.</span>
          </h1>

          <p className="bmw-hm-hero-desc">
            Discover a new generation of luxury vehicles,
            personalized experiences and intelligent automotive
            technology.
          </p>

          <div className="bmw-hm-hero-actions">
            <Link to="/cars" className="bmw-hm-btn-primary">
              Explore Collection <span>→</span>
            </Link>

            <Link to="/cars" className="bmw-hm-btn-secondary">
              Book a Test Drive
            </Link>
          </div>

          <div className="bmw-hm-hero-stats">
            {stats.map((stat) => (
              <div className="bmw-hm-stat-item" key={stat.label}>
                <strong className="bmw-hm-stat-val">{stat.value}</strong>
                <span className="bmw-hm-stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bmw-hm-side-badge" aria-hidden="true">
          <span>01</span>
          <div className="bmw-hm-side-line" />
          <span className="bmw-hm-side-vert">LUXURY REDEFINED</span>
        </div>

        <a
          href="#models"
          className="bmw-hm-scroll-indicator"
          aria-label="Scroll to our collection"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="bmw-hm-scroll-mouse">
            <span />
          </span>
        </a>
      </section>

      <section id="models" className="bmw-hm-models-sec">
        <div className="bmw-hm-heading">
          <span className="bmw-hm-tag">Our Collection</span>
          <h2 className="bmw-hm-heading-title">
            Crafted for those
            <br />
            who demand more.
          </h2>
        </div>

        <div className="bmw-hm-model-grid">
          {modelFeatures.map((model) => (
            <article className="bmw-hm-model-card" key={model.number}>
              <span className="bmw-hm-model-num">{model.number}</span>
              <h3 className="bmw-hm-model-name">{model.title}</h3>
              <p className="bmw-hm-model-desc">{model.description}</p>
              <Link to="/cars" className="bmw-hm-card-link">
                Explore models <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="bmw-hm-exp-sec">
        <div className="bmw-hm-exp-box">
          <span className="bmw-hm-tag">The Experience</span>
          <h2 className="bmw-hm-heading-title">
            More than a car.
            <br />
            It&apos;s your statement.
          </h2>
          <p>
            Explore vehicles, configure your dream car in real-time 3D,
            and request a private consultation through our virtual showroom.
          </p>
          <Link to="/cars" className="bmw-hm-btn-primary">
            Start Your Journey <span>→</span>
          </Link>
        </div>
      </section>

      <section id="technology" className="bmw-hm-tech-sec">
        <div className="bmw-hm-heading center">
          <span className="bmw-hm-tag">Intelligent Technology</span>
          <h2 className="bmw-hm-heading-title">
            The future is already here.
          </h2>
        </div>

        <div className="bmw-hm-tech-grid">
          {technologyFeatures.map((feature) => (
            <article className="bmw-hm-tech-card" key={feature.badge}>
              <span className="bmw-hm-tech-badge">{feature.badge}</span>
              <h3 className="bmw-hm-tech-title">{feature.title}</h3>
              <p className="bmw-hm-tech-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bmw-hm-cta-sec">
        <div className="bmw-hm-cta-content">
          <span className="bmw-hm-tag">
            Ready to experience the difference?
          </span>
          <h2 className="bmw-hm-cta-title">
            Your next chapter
            <br />
            starts here.
          </h2>
          <Link to="/cars" className="bmw-hm-btn-primary">
            Enter Showroom <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="bmw-hm-footer">
        <Link to="/" className="bmw-hm-footer-logo">
          LUXORA
        </Link>
        <div>© 2026 Luxora Automotive. All rights reserved.</div>
        <div>Luxury · Performance · Innovation</div>
      </footer>
    </main>
  );
}
