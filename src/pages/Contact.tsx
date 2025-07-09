import { useState } from 'react'
import './Contact.css'
import emailjs from 'emailjs-com'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // EmailJS integration
    emailjs.send(
      'service_ydzskmc',
      'template_b40fmg6',
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message
      },
      'QcGF9hIvY60lRudys'
    )
    .then(() => {
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
    })
    .catch((error) => {
      alert('There was an error sending your message. Please try again later.')
      console.error('EmailJS error:', error)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact fade-in">
      <section className="contact-hero fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="page-title fade-in" style={{ animationDelay: '0.4s' }}>Contact Aeroband.org</h1>
        <p className="page-subtitle fade-in" style={{ animationDelay: '0.6s' }}>
          Get in touch with the Aeroband.org team for custom domain solutions
        </p>
      </section>

      <section className="contact-content fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="contact-grid">
          <div className="contact-info fade-in" style={{ animationDelay: '1s' }}>
            <h2>Get In Touch</h2>
            <p>
              Have questions about Aeroband.org or need help with your custom domain setup? 
              We're here to help you build something amazing for www.aeroband.org.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p>mercadoskhartaye@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <div>
                  <h3>Website</h3>
                  <p>www.aeroband.org</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">🔧</span>
                <div>
                  <h3>Services</h3>
                  <p>Custom Domain Development<br/>Contact: mercadoskhartaye@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form fade-in" style={{ animationDelay: '1.2s' }}>
            <h2>Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Tell us about your custom domain needs..."
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact 