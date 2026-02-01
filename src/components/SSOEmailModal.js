import React, { useState } from 'react';
import './SSOEmailModal.css';

function SSOEmailModal({ isOpen, onClose, onSSO, provider }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate SSO authentication with user's email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call SSO handler with the user's email
      onSSO(email);
      
      // Close modal
      onClose();
      
      // Reset form
      setEmail('');
    } catch (error) {
      console.error('SSO Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sso-email-modal-overlay">
      <div className="sso-email-modal">
        <div className="sso-email-modal-header">
          <h3>Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}</h3>
          <button 
            className="sso-email-modal-close" 
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="sso-email-modal-body">
          <p className="sso-email-modal-description">
            Enter your email address to continue with {provider.charAt(0).toUpperCase() + provider.slice(1)} SSO
          </p>
          
          <form onSubmit={handleSubmit} className="sso-email-form">
            <div className="sso-email-input-group">
              <label htmlFor="sso-email">Email Address</label>
              <input
                type="email"
                id="sso-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="sso-email-input"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="sso-email-submit"
              disabled={isLoading || !email || !/\S+@\S+\.\S+/.test(email)}
            >
              {isLoading ? 'Signing in...' : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
            </button>
          </form>
          
          <div className="sso-email-modal-footer">
            <p className="sso-email-note">
              By continuing, you agree to let {provider.charAt(0).toUpperCase() + provider.slice(1)} share your email address with this application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SSOEmailModal;
