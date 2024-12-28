import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#about" className="footer-link">About Us</a>
          <a href="#contact" className="footer-link">Contact</a>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#privacy" className="footer-link">Privacy Policy</a>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">Instagram</a>
        </div>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} MyWebsite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
