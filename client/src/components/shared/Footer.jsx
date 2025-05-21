import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your premier platform for event management and booking.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>Email: ghorabam9@gmail.com</li>
            <li>Phone: +201153382196</li>
            <li>Address: GIU,Administrative capital, Cairo, Egypt</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Event Management. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 