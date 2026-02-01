import React, { useState } from 'react';
import './SSOEmailModal.css';

function SSOEmailModal({ isOpen, onClose, onSSO, provider }) {
  const [loadingEmail, setLoadingEmail] = useState(null);

  // Predefined email options for SSO login
  const emailOptions = [
    {
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4285f4&color=fff'
    },
    {
      email: 'jane.smith@gmail.com',
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ea4335&color=fff'
    },
    {
      email: 'mike.wilson@gmail.com',
      name: 'Mike Wilson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=34a853&color=fff'
    },
    {
      email: 'sarah.johnson@gmail.com',
      name: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=fbbc05&color=fff'
    },
    {
      email: 'alex.brown@gmail.com',
      name: 'Alex Brown',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Brown&background=9c27b0&color=fff'
    },
    {
      email: 'emma.davis@gmail.com',
      name: 'Emma Davis',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=ff5722&color=fff'
    }
  ];

  const handleEmailSelect = async (selectedEmail) => {
    setLoadingEmail(selectedEmail);
    
    try {
      // Simulate SSO authentication with selected email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call SSO handler with the selected email
      onSSO(selectedEmail);
      
      // Close modal after a short delay to ensure the parent processes the login
      setTimeout(() => {
        onClose();
        setLoadingEmail(null);
      }, 100);
    } catch (error) {
      console.error('SSO Error:', error);
      setLoadingEmail(null);
    }
  };

  const handleClose = () => {
    if (!loadingEmail) {
      onClose();
    }
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
            disabled={loadingEmail !== null}
          >
            ×
          </button>
        </div>
        
        <div className="sso-email-modal-body">
          <p className="sso-email-modal-description">
            Select an account to continue with {provider.charAt(0).toUpperCase() + provider.slice(1)} SSO
          </p>
          
          <div className="sso-email-options">
            {emailOptions.map((option, index) => (
              <button
                key={index}
                className={`sso-email-option ${loadingEmail === option.email ? 'loading' : ''}`}
                onClick={() => handleEmailSelect(option.email)}
                disabled={loadingEmail !== null}
              >
                <div className="sso-email-avatar">
                  <img src={option.avatar} alt={option.name} />
                </div>
                <div className="sso-email-info">
                  <div className="sso-email-name">{option.name}</div>
                  <div className="sso-email-address">{option.email}</div>
                </div>
                <div className="sso-email-provider">
                  <span className={`provider-badge ${provider}`}>
                    {provider === 'google' && '🔗 Google'}
                    {provider === 'facebook' && '🔗 Facebook'}
                    {provider === 'github' && '🔗 GitHub'}
                  </span>
                </div>
                {loadingEmail === option.email && (
                  <div className="sso-email-loader">
                    <div className="spinner"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="sso-email-modal-footer">
            <p className="sso-email-note">
              By selecting an account, you agree to let {provider.charAt(0).toUpperCase() + provider.slice(1)} share your email address with this application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SSOEmailModal;
