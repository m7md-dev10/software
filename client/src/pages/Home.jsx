import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">EventHub</span>
          </h1>
          <p className="hero-subtitle">
            Your Ultimate Event Management Platform
          </p>
          <div className="hero-description">
            <p>
              Discover, book, and manage events all in one place. Whether you're an event organizer 
              looking to showcase your events or an attendee seeking unique experiences, EventHub 
              connects you with the perfect events.
            </p>
          </div>
          <div className="hero-cta">
            <Link to="/events" className="cta-button primary">Explore Events</Link>
            <Link to="/register" className="cta-button secondary">Get Started</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose EventHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Easy Booking</h3>
            <p>Book tickets with just a few clicks. Manage your bookings and get instant confirmations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Discovery</h3>
            <p>Find events that match your interests with our advanced search and filter system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access EventHub anywhere, anytime. Our platform works seamlessly on all devices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Your data and transactions are protected with our advanced security measures.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse Events</h3>
            <p>Explore our wide range of events from concerts to workshops.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Book Tickets</h3>
            <p>Select your preferred event and book tickets instantly.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Ready</h3>
            <p>Receive confirmation and prepare for your event.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Event Journey?</h2>
          <p>Join thousands of users who trust EventHub for their event needs.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Create Account</Link>
            <Link to="/events" className="cta-button secondary">View Events</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 