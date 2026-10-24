import { Link } from "react-router-dom";

import "../../styles/pages/home/About.css";

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero__content">
          <span className="about-eyebrow">
            OUR VISION
          </span>

          <h1>
            Where Luxury
            <br />
            Meets <span>Innovation.</span>
          </h1>

          <p>
            A digital luxury automotive showroom experience
            designed to make discovering, configuring and
            exploring vehicles more convenient.
          </p>

          <Link to="/cars" className="about-primary-button">
            Explore Our Collection
          </Link>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story__label">
          <span className="about-eyebrow">ABOUT OUR PLATFORM</span>

          <h2>A More Connected Showroom Experience</h2>
        </div>

        <div className="about-story__text">
          <p>
            Our platform brings together a digital vehicle
            collection, personalized configuration and a
            multi-location showroom directory.
          </p>

          <p>
            Visitors can explore vehicles online, review
            available specifications and find showroom contact
            information in one convenient place.
          </p>

          <p>
            Our goal is to connect digital discovery with
            real-world showroom experiences through a simple
            and intuitive interface.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values__heading">
          <span className="about-eyebrow">WHAT GUIDES US</span>

          <h2>Our Core Principles</h2>
        </div>

        <div className="about-values__grid">
          <article>
            <span>01</span>
            <h3>Customer First</h3>
            <p>
              Keep vehicle discovery and showroom information
              easy to understand and access.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Digital Innovation</h3>
            <p>
              Make modern digital tools part of the vehicle
              exploration experience.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Connected Locations</h3>
            <p>
              Bring multiple showroom locations and their
              contact details together in one directory.
            </p>
          </article>
        </div>
      </section>

      <section className="about-cta">
        <span className="about-eyebrow">
          DISCOVER YOUR NEXT DRIVE
        </span>

        <h2>Explore. Configure. Connect.</h2>

        <p>
          Start exploring the collection or find a showroom
          for personalized assistance.
        </p>

        <div className="about-cta__actions">
          <Link to="/cars">Explore Cars</Link>
          <Link to="/contact">Find a Showroom</Link>
        </div>
      </section>
    </main>
  );
}

export default About;