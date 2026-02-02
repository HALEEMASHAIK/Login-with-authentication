import React, { useState } from 'react';
import './SimpleAuth.css';

function SimpleAuth({ onLogin, onSignup, buttonText = "Continue" }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Simple login logic
        if (!email || !password) {
          setError('Please enter email and password');
          return;
        }

        // Mock authentication (you can replace with real API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=667eea&color=fff`,
          provider: 'simple'
        };

        onLogin(userData);
      } else {
        // Simple signup logic
        if (!email || !password) {
          setError('Please enter email and password');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }

        // Mock signup (you can replace with real API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=667eea&color=fff`,
          provider: 'simple'
        };

        onSignup(userData);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="simple-auth-container">
      <div className="simple-auth-divider">
        <span>OR</span>
      </div>
      
      <div className="simple-auth-form">
        <h3>{isLogin ? 'Quick Sign In' : 'Quick Sign Up'}</h3>
        <p className="simple-auth-description">
          {isLogin 
            ? 'Enter your email and password to sign in quickly' 
            : 'Create an account with just your email and password'
          }
        </p>
        
        <form onSubmit={handleSubmit} className="simple-auth-form-content">
          <div className="simple-auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="simple-auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          
          {error && (
            <div className="simple-auth-error">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="simple-auth-button"
            disabled={loading}
          >
            {loading ? (
              <span className="simple-auth-spinner"></span>
            ) : (
              `${buttonText  } ${  isLogin ? 'In' : 'Up'}`
            )}
          </button>
        </form>
        
        <div className="simple-auth-toggle">
          <span>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={toggleMode}
              className="simple-auth-toggle-button"
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SimpleAuth;
