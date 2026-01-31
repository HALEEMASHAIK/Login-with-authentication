import React, { useState } from 'react';
import database from './database';
import './Login.css';

function ForgotPassword({ onBack, onEmailSubmit }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateEmail();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        
        try {
          const user = database.findUserByEmail(email);
          if (!user) {
            setErrors({ email: 'No account found with this email address' });
            return;
          }
          
          console.log('Password reset requested for:', email);
          onEmailSubmit(email);
        } catch (error) {
          console.error('Password reset error:', error.message);
          setErrors({ email: 'An error occurred. Please try again.' });
        }
      }, 1500);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button onClick={onBack} className="back-button">
          ← Back to Login
        </button>
        
        <h2>Reset Password</h2>
        <p className="login-subtitle">
          Enter your email address and we'll send you a verification code to reset your password
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={errors.email ? 'error' : ''}
              autoFocus
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Remember your password? <button onClick={onBack} className="link-button">Sign in</button></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
