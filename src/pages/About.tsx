import './About.css'

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero section">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">
              About <span className="text-gradient">Aeroband</span>
            </h1>
            <p className="about-subtitle">
              Pioneering IoT air quality monitoring for a healthier, more sustainable future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-description">
                Aeroband is dedicated to democratizing access to environmental monitoring technology. 
                We believe everyone deserves to know the quality of the air they breathe. Our advanced 
                IoT sensors provide comprehensive data on humidity, temperature, pressure, VOC levels, 
                and particulate matter to help create healthier environments.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <h3>Environmental Awareness</h3>
                  <p>Empowering individuals and organizations with real-time air quality data for informed decision-making</p>
                </div>
                <div className="value-item">
                  <h3>Health Protection</h3>
                  <p>Protecting vulnerable populations and improving public health through proactive air quality monitoring</p>
                </div>
                <div className="value-item">
                  <h3>Innovation</h3>
                  <p>Pushing the boundaries of IoT technology to create more accurate and accessible environmental sensors</p>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="iot-visual">
                <div className="device device-1"></div>
                <div className="device device-2"></div>
                <div className="device device-3"></div>
                <div className="data-stream data-1"></div>
                <div className="data-stream data-2"></div>
                <div className="data-stream data-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section section">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          <p className="section-subtitle">
            Meet the passionate individuals behind Aeroband's IoT air quality monitoring innovation
          </p>
          <div className="team-grid">
            <div className="team-top-row">
              <div className="team-card card">
                <div className="team-avatar">
                  <div className="avatar-bg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <h3>Vince Vinas</h3>
                <div className="team-role">Project Head & Co-Founder</div>
                <p className="team-bio">
                  Leading strategic direction and project management for Aeroband's environmental monitoring initiatives.
                </p>
              </div>
              <div className="team-card card">
                <div className="team-avatar">
                  <div className="avatar-bg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <h3>Skhart Aye Mercado</h3>
                <div className="team-role">Lead Developer & Co-Founder</div>
                <p className="team-bio">
                  Leading the technical development of Aeroband's IoT platform and sensor integration systems.
                </p>
              </div>
            </div>
            <div className="team-bottom-row">
              <div className="team-card card">
                <div className="team-avatar">
                  <div className="avatar-bg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <h3>Paolo Barrado</h3>
                <div className="team-role">Lead Hardware Developer & Co-Founder</div>
                <p className="team-bio">
                  Designing and developing the physical sensor hardware and IoT device architecture for Aeroband.
                </p>
              </div>
              <div className="team-card card">
                <div className="team-avatar">
                  <div className="avatar-bg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <h3>John Paul Pascual</h3>
                <div className="team-role">Lead Specialist & Co-Founder</div>
                <p className="team-bio">
                  Providing specialized expertise in environmental monitoring and IoT system optimization for Aeroband.
                </p>
              </div>
              <div className="team-card card">
                <div className="team-avatar">
                  <div className="avatar-bg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <h3>Clarizza Reyes</h3>
                <div className="team-role">Analyst & Co-Founder</div>
                <p className="team-bio">
                  Conducting data analysis and research to optimize Aeroband's air quality monitoring algorithms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section section">
        <div className="container">
          <h2 className="section-title">Our Technology Stack</h2>
          <p className="section-subtitle">
            Built with cutting-edge IoT and environmental monitoring technologies
          </p>
          <div className="tech-grid grid grid-4">
            <div className="tech-card card">
              <div className="tech-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <h3>IoT Sensors</h3>
              <p>High-precision environmental sensors</p>
            </div>
            <div className="tech-card card">
              <div className="tech-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
              </div>
              <h3>BLE Connectivity</h3>
              <p>Bluetooth Low Energy data transmission</p>
            </div>
            <div className="tech-card card">
              <div className="tech-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <h3>Local Processing</h3>
              <p>On-device data analysis</p>
            </div>
            <div className="tech-card card">
              <div className="tech-icon">
                <div className="icon-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
              <h3>React</h3>
              <p>Modern dashboard interface</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="roadmap-section section">
        <div className="container">
          <h2 className="section-title">Development Roadmap</h2>
          <p className="section-subtitle">
            Our journey to revolutionize environmental monitoring with blockchain technology
          </p>
          <div className="roadmap">
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q1 2025</h3>
                <h4>Prototype Development</h4>
                <p>Initial sensor development and testing with basic air quality monitoring capabilities</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q2 2025</h3>
                <h4>Beta Testing</h4>
                <p>Field testing with early adopters and refinement of sensor accuracy and reliability</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q3 2025</h3>
                <h4>Commercial Launch</h4>
                <p>Full commercial release with comprehensive dashboard and mobile application</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q4 2025</h3>
                <h4>Advanced Features</h4>
                <p>AI-powered air quality predictions and advanced analytics for research applications</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q1 2026</h3>
                <h4>Aptos Blockchain Integration</h4>
                <p>Integration of Aptos blockchain for decentralized data storage and transparency</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q2 2026</h3>
                <h4>Aptos Shelby Implementation</h4>
                <p>Implementation of Aptos Shelby for enhanced smart contract functionality and data validation</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q3 2026</h3>
                <h4>Rewards System Launch</h4>
                <p>Launch of tokenized rewards system for environmental data contribution and community engagement</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <h3>Q4 2026</h3>
                <h4>Token Generation Event (TGE)</h4>
                <p>Official token launch and distribution to create a sustainable ecosystem for environmental monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 
