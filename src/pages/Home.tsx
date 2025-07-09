import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Aeroband</span>
          </h1>
          <p className="hero-subtitle">
            Your custom domain development platform
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-graphic">
            <div className="floating-card card-1"></div>
            <div className="floating-card card-2"></div>
            <div className="floating-card card-3"></div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose Aeroband?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Performance</h3>
            <p>Lightning-fast loading times and optimized for modern browsers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Custom Design</h3>
            <p>Fully customizable to match your brand and vision.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Developer Friendly</h3>
            <p>Built with modern technologies for easy customization.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 