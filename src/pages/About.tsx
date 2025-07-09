import './About.css'

const About = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <h1 className="page-title">About Aeroband.org</h1>
        <p className="page-subtitle">
          Building the future of custom domain development at www.aeroband.org
        </p>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              At Aeroband.org, we're dedicated to providing developers and businesses with 
              the tools they need to create stunning, high-performance websites 
              on their own custom domains. We believe in the power of 
              customization and developer control, especially when it comes to domains like www.aeroband.org.
            </p>
            
            <h2>Our Technology</h2>
            <p>
              Built with modern web technologies including React, TypeScript, 
              and Vite, Aeroband.org offers a fast, scalable foundation for your 
              web projects. Our platform is designed to be developer-friendly 
              while maintaining excellent performance and user experience.
            </p>
            
            <h2>Domain Expertise</h2>
            <p>
              We specialize in custom domain development, particularly for domains like 
              www.aeroband.org. Our expertise includes DNS configuration, SSL certificates, 
              and performance optimization for custom domains.
            </p>
          </div>
          
          <div className="about-stats">
            <div className="stat-card">
              <h3>100%</h3>
              <p>Customizable</p>
            </div>
            <div className="stat-card">
              <h3>Fast</h3>
              <p>Performance</p>
            </div>
            <div className="stat-card">
              <h3>Modern</h3>
              <p>Technology</p>
            </div>
            <div className="stat-card">
              <h3>Secure</h3>
              <p>SSL Ready</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 