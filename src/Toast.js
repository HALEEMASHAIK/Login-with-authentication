import React, { useState, useEffect } from 'react';
import './Toast.css';

function Toast({ message, type, onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast with slight delay for animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-hide after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '✅';
    }
  };

  return (
    <div className={`toast-container ${isVisible ? 'show' : ''}`}>
      <div className={`toast toast-${type}`}>
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }} className="toast-close">×</button>
      </div>
    </div>
  );
}

export default Toast;
