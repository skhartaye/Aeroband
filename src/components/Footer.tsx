import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <div className="hexagon-logo"></div>
              </div>
              <span className="logo-text">Aeroband</span>
            </div>
            <p className="footer-description">
              Advanced IoT air quality monitoring system for a healthier environment. 
              Monitoring humidity, temperature, pressure, VOC, and particulate matter.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#" onClick={() => alert('Dashboard Coming Soon!')}>Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul className="footer-links">
              <li><a href="#">Air Quality Monitoring</a></li>
              <li><a href="#">Sensor Deployment</a></li>
              <li><a href="#">Data Analytics</a></li>
              <li><a href="#">Research Support</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p>📧 Aerobandtech@gmail.com</p>
              <p>🐦 <a href="https://x.com/AerobandTech" target="_blank" rel="noopener noreferrer">@AerobandTech</a></p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Aeroband. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 