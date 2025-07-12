import { Link } from 'react-router-dom'
import './Header.css'

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
      <div className="header-container" style={{ justifyContent: 'center' }}>
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <img src="/Aeroband_logo.png" alt="Aeroband Logo" style={{ height: '96px', width: '96px', objectFit: 'contain', borderRadius: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'inherit' }}>Aeroband.org</h1>
        </Link>
      </div>
    </header>
  )
}

export default Header 