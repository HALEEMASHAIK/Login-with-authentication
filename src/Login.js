import React, { useState } from 'react';
import DynamicSSO from './components/DynamicSSO';
import database from './database';
import './Login.css';

function Login({ onSwitchToSignup, onSSO, onForgotPassword, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const user = database.authenticateUser(formData.email, formData.password);
        console.log('Login successful:', user);
        
        // After successful login, send OTP to registered email
        onLoginSuccess(formData.email);
      } catch (error) {
        console.error('Login error:', error.message);
        if (error.message === 'User not found') {
          setErrors({ email: 'No account found with this email' });
        } else if (error.message === 'Invalid password') {
          setErrors({ password: 'Incorrect password' });
        } else {
          setErrors({ email: error.message });
        }
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Please sign in to your account</p>
        <div className="login-form">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          
          <DynamicSSO 
            onSSO={onSSO} 
            buttonText="Continue with"
          />
          
          <div className="login-footer">
            <p>
              Don't have an account? <button onClick={onSwitchToSignup} className="link-button">Sign up</button>
            </p>
            <p>
              <button onClick={onForgotPassword} className="link-button">Forgot your password?</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
