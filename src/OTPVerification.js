import React, { useState } from 'react';
import './Login.css';

function OTPVerification({ email, onBack, onVerified, onResend }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter all 6 digits' });
      return false;
    }
    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ otp: 'OTP must contain only numbers' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateOTP()) return;

    setIsVerifying(true);
    const otpString = otp.join('');
    
    setTimeout(() => {
      console.log('Verifying OTP:', otpString, 'for email:', email);
      setIsVerifying(false);
      onVerified();
    }, 1500);
  };

  const handleResend = () => {
    console.log(`Requesting OTP resend to Gmail for ${email.includes('login') ? 'login' : email.includes('reset') ? 'password reset' : 'account verification'}:`, email);
    if (onResend) {
      onResend();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        
        <h2>{email.includes('login') ? 'Verify Login' : email.includes('reset') ? 'Verify Password Reset' : 'Verify Your Gmail'}</h2>
        <p className="login-subtitle">
          {email.includes('login') ? 
            `We've sent a 6-digit verification code to your Gmail account to complete your login:<br/><strong>${email}</strong>` :
            email.includes('reset') ?
            `We've sent a 6-digit verification code to your Gmail account to reset your password:<br/><strong>${email}</strong>` :
            `We've sent a 6-digit verification code to your Gmail account:<br/><strong>${email}</strong>`
          }
        </p>
        <p className="gmail-note">
          {email.includes('login') ? 
            `📧 Check your Gmail inbox (including spam folder) for the login verification code.<br/>
            <strong>For testing: Check the browser console for the OTP code!</strong>` :
            email.includes('reset') ?
            `📧 Check your Gmail inbox (including spam folder) for the password reset code.<br/>
            <strong>For testing: Check the browser console for the OTP code!</strong>` :
            `📧 Check your Gmail inbox (including spam folder) for the verification code.<br/>
            <strong>For testing: Check the browser console for the OTP code!</strong>`
          }
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Enter verification code</label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`otp-input ${errors.otp ? 'error' : ''}`}
                />
              ))}
            </div>
            {errors.otp && <span className="error-message">{errors.otp}</span>}
          </div>
          
          <button type="submit" className="login-button" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <div className="otp-footer">
          <p>Didn't receive the code?</p>
          <button onClick={handleResend} className="link-button">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
