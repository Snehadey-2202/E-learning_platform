import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { GraduationCap, BookOpen, LayoutDashboard, LogOut, Menu, X, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <GraduationCap size={32} color="hsl(var(--primary-raw))" />
          <span style={styles.logoText}>Edu<span className="text-gradient">Stream</span></span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.desktopNav}>
          <Link to="/catalog" style={{ ...styles.navLink, ...(isActive('/catalog') ? styles.activeLink : {}) }}>
            <BookOpen size={18} />
            Explore Courses
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" style={{ ...styles.navLink, ...(isActive('/dashboard') ? styles.activeLink : {}) }}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <div style={styles.profileSection}>
                <span style={styles.welcomeText}>Hi, {user.full_name || user.username}</span>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button style={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div style={styles.mobileDropdown} className="animate-fade-in">
          <Link 
            to="/catalog" 
            style={{ ...styles.mobileNavLink, ...(isActive('/catalog') ? styles.activeMobileLink : {}) }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen size={20} />
            Explore Courses
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                style={{ ...styles.mobileNavLink, ...(isActive('/dashboard') ? styles.activeMobileLink : {}) }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              <div style={styles.mobileProfile}>
                <span>Hi, {user.full_name || user.username}</span>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger" style={{ width: '100%', marginTop: '10px' }}>
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px 20px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(15, 23, 42, 0.65)',
    borderBottom: '1px solid var(--glass-border)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '22px',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.5px',
  },
  logoText: {
    color: '#fff',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'hsl(var(--text-secondary))',
    transition: 'color var(--transition-fast)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
  },
  activeLink: {
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '1px solid hsl(var(--border-raw))',
    paddingLeft: '16px',
  },
  welcomeText: {
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'hsl(var(--error))',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block',
    }
  },
  mobileDropdown: {
    position: 'absolute',
    top: '70px',
    left: 0,
    width: '100%',
    background: 'hsl(var(--bg-raw-dark))',
    borderBottom: '1px solid hsl(var(--border-raw))',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    fontSize: '16px',
    color: 'hsl(var(--text-secondary))',
    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
  },
  activeMobileLink: {
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  mobileProfile: {
    padding: '15px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid hsl(var(--border-raw))',
  }
};

// Injection of media queries to stylesheet
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 768px) {
    div[style*="desktopNav"] { display: none !important; }
    button[style*="mobileMenuBtn"] { display: block !important; }
  }
`;
document.head.appendChild(styleSheet);
