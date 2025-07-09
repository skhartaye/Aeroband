import './Home.css'

const Home = () => {
  return (
    <div className="home fade-in">
      <section className="hero fade-in">
        <div className="hero-content fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="hero-title fade-in" style={{ animationDelay: '0.4s' }}>
            Welcome to <span className="highlight">Aeroband.org</span>
          </h1>
          <p className="hero-subtitle fade-in" style={{ animationDelay: '0.6s' }}>
            Your premier destination for custom domain development and web solutions
          </p>
          <div className="hero-buttons fade-in" style={{ animationDelay: '0.8s' }}>
            <button className="btn btn-primary">Explore Services</button>
            <button className="btn btn-secondary">View Portfolio</button>
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

      <section className="features fade-in" style={{ animationDelay: '1.2s' }}>
        <h2 className="section-title">Why Choose Aeroband.org?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Custom Domain Expertise</h3>
            <p>Specialized in www.aeroband.org and custom domain development with full control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Optimized performance with modern React and TypeScript for blazing speed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Developer Focused</h3>
            <p>Built for developers who want complete control over their web presence.</p>
          </div>
        </div>
      </section>

      <section className="services fade-in" style={{ animationDelay: '1.4s' }}>
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Domain Development</h3>
            <p>Custom domain setup and optimization for www.aeroband.org</p>
          </div>
          <div className="service-card">
            <h3>Web Applications</h3>
            <p>Modern React applications with TypeScript and Vite</p>
          </div>
          <div className="service-card">
            <h3>Performance Optimization</h3>
            <p>Speed optimization and SEO best practices</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 