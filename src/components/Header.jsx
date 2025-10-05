import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBook, FaHome, FaSearch, FaComments, FaQuestionCircle, FaSignOutAlt, FaUser, FaPlus, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, directLogout, unreadCount } = useAuth(); // ✅ ADD UNREADCOUNT
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      directLogout();
      setDropdownOpen(false);
    }
  };

  return (
    <header className="header" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '0.5rem 1rem' }}>
      <nav className="nav" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2c5aa0', fontWeight: 'bold', fontSize: '1.8rem' }}>
          <img src="/boibondhu-logo.svg" alt="BoiBondhu Logo" width="28" height="28" style={{ display: 'block' }} />
          <span>BoiBondhu</span>
        </div>
        <ul className="nav-links" style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', alignItems: 'center', color: '#333' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FaHome />
            <NavLink to="/" style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
              color: isActive ? '#2c5aa0' : '#333'
            })}>
              Home
            </NavLink>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FaSearch />
            <NavLink to="/search" style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
              color: isActive ? '#2c5aa0' : '#333'
            })}>
              Search Books
            </NavLink>
          </li>

          {user && (
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaComments />
              <NavLink to="/discussions" style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: isActive ? 'underline' : 'none',
                color: isActive ? '#2c5aa0' : '#333'
              })}>
                Discussions
              </NavLink>
            </li>
          )}

          {user ? (
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', position: 'relative' }}>
              <FaEnvelope />
              <NavLink to="/messages" style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: isActive ? 'underline' : 'none',
                color: isActive ? '#2c5aa0' : '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              })}>
                Messages
                {/* ✅ NOTIFICATION BADGE */}
                {unreadCount > 0 && (
                  <span style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ) : (
          <>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <NavLink to="/about" style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: isActive ? 'underline' : 'none',
                color: isActive ? '#2c5aa0' : '#333'
              })}>
                About Us
              </NavLink>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <NavLink to="/contact" style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: isActive ? 'underline' : 'none',
                color: isActive ? '#2c5aa0' : '#333'
              })}>
                Contact Us
              </NavLink>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaQuestionCircle />
              <NavLink to="/faq" style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: isActive ? 'underline' : 'none',
                color: isActive ? '#2c5aa0' : '#333'
              })}>
                FAQ
              </NavLink>
            </li>
          </>
          )}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333' 
                  }}
                >
                  <FaUser />
                  {user.name} ▼
                </button>
                {dropdownOpen && (
                  <ul style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    background: 'white', 
                    border: '1px solid #ccc', 
                    borderRadius: '5px', 
                    listStyle: 'none', 
                    padding: '0.5rem 0', 
                    margin: 0, 
                    minWidth: '150px', 
                    zIndex: 10 
                  }}>
                    <li>
                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 1rem', textDecoration: 'none', color: '#333' }}
                      >
                        📊 My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/my-listings" 
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 1rem', textDecoration: 'none', color: '#333' }}
                      >
                        📚 My Listings
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/wishlist" 
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 1rem', textDecoration: 'none', color: '#333' }}
                      >
                        ❤️ My Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/reviews" 
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 1rem', textDecoration: 'none', color: '#333' }}
                      >
                        ⭐ My Reviews
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/settings" 
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 1rem', textDecoration: 'none', color: '#333' }}
                      >
                        ⚙️ Settings
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout} 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          width: '100%', 
                          textAlign: 'left', 
                          padding: '0.5rem 1rem', 
                          cursor: 'pointer', 
                          color: 'red' 
                        }}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <Link 
                to="/add-listing" 
                className="sell-books-btn" 
                style={{ 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '5px', 
                  fontWeight: '600', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}
              >
                <FaPlus /> Sell Books
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="login-btn" 
                style={{ 
                  color: '#2c5aa0', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minWidth: '70px', 
                  height: '36px', 
                  lineHeight: '36px' 
                }}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="signup-btn" 
                style={{ 
                  backgroundColor: '#2c5aa0', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '5px', 
                  fontWeight: '600', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minWidth: '70px', 
                  height: '36px', 
                  lineHeight: '36px' 
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;