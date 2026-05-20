import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { Mail, KeyRound, AlertTriangle, ArrowRight, User, CircleUser } from 'lucide-react';

export default function Register() {
  const { login, apiFetch } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          full_name: fullName 
        })
      });
      
      login(data.access, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different username or email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer} className="animate-fade-in">
      <div className="glass-card" style={styles.authCard}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Start mastering full-stack technical skills today</p>
        </div>

        {error && (
          <div style={styles.errorAlert} className="animate-scale-in">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={styles.inputWrapper}>
              <CircleUser size={18} style={styles.inputIcon} />
              <input 
                type="text" 
                id="fullName" 
                className="form-input" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input 
                type="text" 
                id="username" 
                className="form-input" 
                placeholder="johndoe12" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input 
                type="password" 
                id="confirmPassword" 
                className="form-input" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                Register Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footerLink}>
          <p>Already have an account? <Link to="/login" style={styles.linkText}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '40px 24px',
  },
  authCard: {
    width: '100%',
    maxWidth: '440px',
    padding: '40px',
    background: 'rgba(15, 23, 42, 0.55)',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '14px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: 'var(--radius-sm)',
    color: 'hsl(var(--error))',
    fontSize: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'hsl(var(--text-muted))',
  },
  footerLink: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
  },
  linkText: {
    color: 'hsl(var(--primary-raw))',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    }
  }
};
