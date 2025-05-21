import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="EventHub Logo" />
          <span className="brand-text">EventHub</span>
        </Link>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/events" className="nav-link">Events</Link>
          {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
          
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">Admin Dashboard</Link>
          )}

          {user ? (
            <div className="user-menu">
              <button className="user-button" onClick={toggleDropdown}>
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt="User Avatar" 
                  className="user-avatar"
                />
                <span>{user.name}</span>
              </button>
              
              <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item">
                  <i>👤</i> Profile
                </Link>
                {user.role === 'organizer' && (
                  <Link to="/my-events" className="dropdown-item">
                    <i>🎫</i> My Events
                  </Link>
                )}
                <button onClick={handleLogout} className="dropdown-item">
                  <i>🚪</i> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 