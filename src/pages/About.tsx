import './About.css'

const About = () => {
  return (
    <div className="about">
      {/* Deployment status indicator */}
      <div style={{ 
        background: 'green', 
        color: 'white', 
        padding: '10px', 
        textAlign: 'center',
        position: 'fixed',
        top: '150px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        borderRadius: '5px'
      }}>
        ✅ DEPLOYMENT STATUS: ACTIVE - {new Date().toLocaleString()}
      </div>
      
      <section className="about-hero">
        <h1 className="page-title">About Aeroband</h1>
        <p className="page-subtitle">
          Building the future of custom domain development
        </p>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              Aeroband is dedicated to providing developers and businesses with 
              the tools they need to create stunning, high-performance websites 
              on their own custom domains. We believe in the power of 
              customization and developer control.
            </p>
            
            <h2>Our Technology</h2>
            <p>
              Built with modern web technologies including React, TypeScript, 
              and Vite, Aeroband offers a fast, scalable foundation for your 
              web projects. Our platform is designed to be developer-friendly 
              while maintaining excellent performance and user experience.
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
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 