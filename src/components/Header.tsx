import { Link } from 'react-router-dom'
import './Header.css'
import aerobandLogo from '../assets/aeroband_logo.png'

interface HeaderProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

const Header = ({ isMenuOpen, setIsMenuOpen }: HeaderProps) => {
  const handleAppClick = () => {
    setIsMenuOpen(false)
    alert('Coming Soon!')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <img src={aerobandLogo} alt="Aeroband Logo" style={{ height: '96px', width: '96px', objectFit: 'contain', borderRadius: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'inherit' }}>Aeroband.org</h1>
        </Link>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <button 
            className="nav-link coming-soon" 
            onClick={handleAppClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
          >
            App
          </button>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
        </nav>
        <button 
          className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header 
