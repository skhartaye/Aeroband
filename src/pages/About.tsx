import './About.css'

const About = () => {
  return (
    <div className="about fade-in">
      <section className="about-hero fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="page-title fade-in" style={{ animationDelay: '0.4s' }}>About Aeroband.org</h1>
        <p className="page-subtitle fade-in" style={{ animationDelay: '0.6s' }}>
          Building the future of IoT development at www.aeroband.org
        </p>
      </section>

      <section className="about-content fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="about-grid">
          <div className="about-text fade-in" style={{ animationDelay: '1s' }}>
            <h2>Our Mission</h2>
            <p>
              At Aeroband.org, we're dedicated to providing developers and businesses with 
              the tools they need to create stunning, high-performance IoT solutions. 
              We believe in the power of customization and developer control, 
              especially when it comes to IoT projects like www.aeroband.org.
            </p>
            
            <h2>Our Technology</h2>
            <p>
              Built with modern web technologies including React, TypeScript, 
              and Vite, Aeroband.org offers a fast, scalable foundation for your 
              web projects. Our platform is designed to be developer-friendly 
              while maintaining excellent performance and user experience.
            </p>
            
            <h2>IoT Expertise</h2>
            <p>
              We specialize in IoT development, particularly for projects like 
              www.aeroband.org. Our expertise includes sensor integration, data analytics, 
              and performance optimization for IoT solutions.
            </p>
          </div>
          
          <div className="about-stats fade-in" style={{ animationDelay: '1.2s' }}>
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