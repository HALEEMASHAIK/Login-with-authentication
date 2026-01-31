import React, { useState, useEffect } from 'react';
import './OTPNotification.css';

function OTPNotification({ otp, email, type, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show notification with a slight delay for animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-hide after 30 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy OTP:', err);
    }
  };

  const getTypeIcon = () => {
    switch(type) {
      case 'login': return '🔐';
      case 'sso': return '📧';
      case 'reset': return '🔑';
      default: return '✉️';
    }
  };

  const getTypeTitle = () => {
    switch(type) {
      case 'login': return 'Login Verification';
      case 'sso': return 'Account Verification';
      case 'reset': return 'Password Reset';
      default: return 'Verification Code';
    }
  };

  return (
    <div className={`otp-notification-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`otp-notification ${isVisible ? 'show' : ''}`}>
        <div className="otp-notification-header">
          <div className="otp-notification-title">
            <span className="otp-icon">{getTypeIcon()}</span>
            <h3>{getTypeTitle()}</h3>
          </div>
          <button onClick={handleClose} className="otp-close-button">×</button>
        </div>
        
        <div className="otp-notification-content">
          <div className="otp-email-info">
            <p><strong>Gmail:</strong> {email}</p>
            <p className="otp-subtitle">Your verification code has arrived!</p>
          </div>
          
          <div className="otp-code-container">
            <div className="otp-code-display">
              {otp.split('').map((digit, index) => (
                <span key={index} className="otp-digit">{digit}</span>
              ))}
            </div>
            <button onClick={copyToClipboard} className="otp-copy-button">
              {copied ? '✓ Copied!' : '📋 Copy Code'}
            </button>
          </div>
          
          <div className="otp-instructions">
            <p><strong>Instructions:</strong></p>
            <ul>
              <li>Enter this 6-digit code in the verification form</li>
              <li>The code will expire in 30 minutes</li>
              <li>Keep this code secure and don't share it</li>
            </ul>
          </div>
        </div>
        
        <div className="otp-notification-footer">
          <button onClick={handleClose} className="otp-acknowledge-button">
            I've Got It
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPNotification;
