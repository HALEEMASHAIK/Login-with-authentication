import React, { useState } from 'react';
import './Login.css';

function EmailInputModal({ onEmailSubmit, onCancel }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

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
      onEmailSubmit(email);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Enter Your Gmail Address</h3>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>
        
        <p className="modal-subtitle">
          We'll send a verification code to your Gmail account
        </p>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="email">Gmail Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.gmail@gmail.com"
              className={errors.email ? 'error' : ''}
              autoFocus
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="modal-buttons">
            <button type="button" onClick={onCancel} className="modal-button cancel">
              Cancel
            </button>
            <button type="submit" className="modal-button submit">
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailInputModal;
