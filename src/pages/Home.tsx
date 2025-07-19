import { useRef } from 'react'
import './Home.css'

const Home = () => {
  const featuresRef = useRef<HTMLDivElement>(null)
  const sensorsRef = useRef<HTMLDivElement>(null)

  const handleExploreFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleExploreSensors = () => {
    sensorsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleViewDashboard = () => {
    alert('Aeroband Dashboard Coming Soon!')
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="text-gradient">Aeroband</span>
              </h1>
              <p className="hero-subtitle">
                Advanced IoT air quality monitoring system that collects comprehensive environmental data 
                including humidity, temperature, pressure, VOC levels, and particulate matter for a healthier environment.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={handleViewDashboard}>
                  View Dashboard
                </button>
                <button className="btn btn-secondary" onClick={handleExploreFeatures}>
                  Learn More
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="sensor-animation">
                <div className="sensor sensor-1">
                  <div className="sensor-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 1 5 0v11.26a4.5 4.5 0 1 1-5 0z"/>
                      <path d="M9 12h1"/>
                      <path d="M9 16h1"/>
                      <path d="M9 20h1"/>
                      <path d="M14.5 4v2.5a2.5 2.5 0 0 1-5 0V4"/>
                    </svg>
                  </div>
                  <span>Temp</span>
                </div>
                <div className="sensor sensor-2">
                  <div className="sensor-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3a6 6 0 0 0-6 6v7a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6Z"/>
                      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                      <path d="M12 12v6"/>
                      <path d="M8 12h8"/>
                    </svg>
                  </div>
                  <span>Humidity</span>
                </div>
                <div className="sensor sensor-3">
                  <div className="sensor-icon">📊</div>
                  <span>Pressure</span>
                </div>
                <div className="sensor sensor-4">
                  <div className="sensor-icon">☁️</div>
                  <span>VOC</span>
                </div>
                <div className="sensor sensor-5">
                  <div className="sensor-icon">🌫️</div>
                  <span>PM2.5</span>
                </div>
                <div className="data-flow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Real-time Monitoring</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5</div>
              <div className="stat-label">Sensor Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Data Points/Day</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section" ref={featuresRef}>
        <div className="container">
          <h2 className="section-title">Why Monitor Air Quality?</h2>
          <p className="section-subtitle">
            Comprehensive environmental monitoring for health, safety, and research
          </p>
          <div className="features-grid grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <h3>Real-Time Data</h3>
              <p>Continuous monitoring of air quality parameters with instant alerts and notifications for immediate response.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <h3>Health Protection</h3>
              <p>Proactive monitoring to ensure safe air quality levels and protect against harmful pollutants and allergens.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                  </svg>
                </div>
              </div>
              <h3>Data Analytics</h3>
              <p>Advanced analytics and insights to understand air quality trends and make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sensors Section */}
      <section className="sensors-section section" ref={sensorsRef}>
        <div className="container">
          <h2 className="section-title">Our Sensor Technology</h2>
          <p className="section-subtitle">
            State-of-the-art IoT sensors for comprehensive environmental monitoring
          </p>
          <div className="sensors-grid">
            <div className="sensor-card card" data-card-number="1">
              <div className="sensor-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 1 5 0v11.26a4.5 4.5 0 1 1-5 0z"/>
                    <path d="M9 12h1"/>
                    <path d="M9 16h1"/>
                    <path d="M9 20h1"/>
                    <path d="M14.5 4v2.5a2.5 2.5 0 0 1-5 0V4"/>
                  </svg>
                </div>
              </div>
              <h3>Temperature Sensor</h3>
              <p>High-precision temperature monitoring with ±0.5°C accuracy. Tracks ambient temperature variations for climate control and comfort assessment.</p>
              <div className="sensor-specs">
                <span>Range: -40°C to +85°C</span>
                <span>Accuracy: ±0.5°C</span>
              </div>
            </div>
            <div className="sensor-card card" data-card-number="2">
              <div className="sensor-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3a6 6 0 0 0-6 6v7a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6Z"/>
                    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    <path d="M12 12v6"/>
                    <path d="M8 12h8"/>
                  </svg>
                </div>
              </div>
              <h3>Humidity Sensor</h3>
              <p>Relative humidity monitoring with capacitive sensing technology. Essential for comfort, health, and equipment protection.</p>
              <div className="sensor-specs">
                <span>Range: 0-100% RH</span>
                <span>Accuracy: ±2% RH</span>
              </div>
            </div>
            <div className="sensor-card card" data-card-number="3">
              <div className="sensor-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
              </div>
              <h3>Barometric Pressure</h3>
              <p>Atmospheric pressure monitoring for weather prediction and altitude calculations. High-resolution pressure sensing.</p>
              <div className="sensor-specs">
                <span>Range: 300-1100 hPa</span>
                <span>Accuracy: ±1 hPa</span>
              </div>
            </div>
            <div className="sensor-card card" data-card-number="4">
              <div className="sensor-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
              <h3>VOC Sensor</h3>
              <p>Volatile Organic Compounds detection for indoor air quality assessment. Monitors harmful chemical emissions.</p>
              <div className="sensor-specs">
                <span>Range: 0-1000 ppm</span>
                <span>Accuracy: ±5%</span>
              </div>
            </div>
            <div className="sensor-card card" data-card-number="5">
              <div className="sensor-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <h3>Particulate Matter</h3>
              <p>PM2.5 and PM10 particle monitoring for air quality assessment. Laser-based optical particle counting.</p>
              <div className="sensor-specs">
                <span>Range: 0-1000 μg/m³</span>
                <span>Accuracy: ±10%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="applications-section section">
        <div className="container">
          <h2 className="section-title">Applications</h2>
          <p className="section-subtitle">
            Versatile IoT solution for various environmental monitoring needs
          </p>
          <div className="applications-grid grid grid-3">
            <div className="application-card card">
              <h3>Indoor Air Quality</h3>
              <p>Monitor homes, offices, and public spaces for optimal health and comfort conditions.</p>
            </div>
            <div className="application-card card">
              <h3>Industrial Monitoring</h3>
              <p>Factory and workplace air quality monitoring for safety compliance and worker health.</p>
            </div>
            <div className="application-card card">
              <h3>Research & Development</h3>
              <p>Environmental research, climate studies, and air quality impact assessments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Monitor Your Environment?</h2>
            <p className="cta-subtitle">
              Join the future of IoT air quality monitoring with Aeroband
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={handleViewDashboard}>
                Get Started Now
              </button>
              <button className="btn btn-secondary">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 
