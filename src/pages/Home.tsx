import './Home.css'
import { useRef } from 'react'
import prototype1st from '../assets/prototype_1st.jpg'

const Home = () => {
  const featuresRef = useRef<HTMLDivElement>(null)

  const handleLearnMore = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleGetStarted = () => {
    alert('Coming soon!')
  }

  return (
    <div className="home fade-in">
      <section className="hero fade-in">
        <div className="hero-content fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="hero-title fade-in" style={{ animationDelay: '0.4s' }}>
            Welcome to <span className="highlight">Aeroband.org</span>
          </h1>
          <p className="hero-subtitle fade-in" style={{ animationDelay: '0.6s' }}>
            IoT-powered Air Quality Monitoring for a Safer, Healthier Environment
          </p>
          <div className="hero-buttons fade-in" style={{ animationDelay: '0.8s' }}>
            <button className="btn btn-primary" onClick={handleGetStarted}>Get Started</button>
            <button className="btn btn-secondary" onClick={handleLearnMore}>Learn More</button>
          </div>
        </div>
        <div className="hero-visual fade-in" style={{ animationDelay: '1s' }}>
          <div className="hero-graphic">
            <div className="floating-card card-1"></div>
            <div className="floating-card card-2"></div>
            <div className="floating-card card-3"></div>
          </div>
        </div>
      </section>

      <section className="mission-section fade-in" style={{ animationDelay: '1.1s' }}>
        <h2 className="section-title">Our Mission & Vision</h2>
        <p className="mission-lead">We aim to help everyone become more aware of the air we breathe—empowering people to make safer, healthier choices for themselves and their communities.</p>
        <ul className="mission-beneficiaries">
          <li><strong>Patients & Sensitive Individuals:</strong> Real-time alerts and data for those most at risk from poor air quality.</li>
          <li><strong>Researchers:</strong> Access to reliable, actionable air quality data for studies and innovation.</li>
          <li><strong>Governments & Policy Makers:</strong> Tools and insights to inform public health decisions and create safer environments.</li>
        </ul>
        <p className="mission-summary">Together, we can build a world where everyone is informed and protected from the dangers of air pollution—at home, at work, and in public spaces.</p>
      </section>

      <section className="features fade-in" style={{ animationDelay: '1.2s' }} ref={featuresRef}>
        <h2 className="section-title">Why Monitor Air Quality?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌬️</div>
            <h3>Real-Time Monitoring</h3>
            <p>Track air quality instantly with IoT sensors for peace of mind and proactive health protection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safe Environments</h3>
            <p>Ensure your home, office, or public space maintains safe, breathable air for everyone.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data-Driven Insights</h3>
            <p>Access historical and live data to make informed decisions about your environment.</p>
          </div>
        </div>
      </section>

      <section className="services fade-in" style={{ animationDelay: '1.4s' }}>
        <h2 className="section-title">Our IoT Solutions</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Air Quality Sensors</h3>
            <p>Deploy advanced IoT sensors to monitor pollutants, humidity, and temperature in real time.</p>
          </div>
          <div className="service-card">
            <h3>Smart Alerts</h3>
            <p>Receive instant notifications when air quality drops below safe thresholds.</p>
          </div>
          <div className="service-card">
            <h3>Analytics Dashboard</h3>
            <p>Visualize trends and get actionable recommendations for improving air quality.</p>
          </div>
        </div>
      </section>

      <div className="product-timeline-row">
        <div className="timeline-section">
          <h2>Prototype Timeline</h2>
          <ul className="timeline-list">
            <li className="timeline-item">
              <span className="timeline-dot"></span>
              <strong>May: 1st Prototype</strong>
              <div>
                <img src={prototype1st} alt="1st Prototype" style={{ maxWidth: '200px', marginTop: '0.5rem', borderRadius: '6px' }} />
              </div>
              <p>Initial working prototype, featuring core hardware and basic functionality. Completed in May.</p>
            </li>
            <li className="timeline-item">
              <span className="timeline-dot"></span>
              <strong>Second Iteration</strong>
              <div style={{ marginTop: '0.5rem', width: '200px', height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', color: '#888' }}>
                Coming soon!
              </div>
              <p>The next iteration is currently in development and will be released soon with improved features and design.</p>
            </li>
          </ul>
        </div>

        <div className="product-feature-section">
          <img className="product-feature-image" src={prototype1st} alt="1st Prototype" />
          <div className="product-feature-content">
            <h2>Featured Product: Aeroband Prototype</h2>
            <p>
              This is the first prototype of our Aeroband project, designed to bring innovative technology to your fingertips. Stay tuned for more updates as we continue to improve and develop our product!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 
