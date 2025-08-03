import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import registrationVideo from '/videos/video2.mp4';

export const Registration = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showVerificationSent, setShowVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    setMessage("");

    try {
      const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
      const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
      const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

      const response = await fetch(`${apiUrl}/user/signup-new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === "400") {
        setIsError(true);
        setMessage(data.message || 'Email is required');
      } else if (data.status === "409") {
        setShowVerificationSent(true);
        setIsError(false);
        setMessage("Verification email resent. Please check your inbox.");
      } else if (data.status === "ALREADY_REGISTERED") {
        navigate('/login');
      } else if (data.status === "VERIFIED_NOT_COMPLETED") {
        navigate(`/complete-profile?email=${encodeURIComponent(email)}`);
      } else if (data.status === "200") {
        setShowVerificationSent(true);
        setIsError(false);
        setMessage("Verification email sent. Please check your inbox.");
      } else {
        setIsError(true);
        setMessage("An unexpected error occurred");
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setIsError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <video
        src={registrationVideo}
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      />

      <div className={`registration-form ${showVerificationSent ? 'verification-sent' : ''}`}>
        {!showVerificationSent ? (
          <>
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-subtitle">Start your journey with us</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="zmdi zmdi-email form-icon"></i> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {message && (
                <div className={`form-message ${isError ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <span className="button-loader"></span>
                ) : (
                  'Send Verification Email'
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>Already have an account? <a href="/login" className="footer-link">Sign In</a></p>
            </div>
          </>
        ) : (
          <div className="verification-sent-container">
            <div className="verification-icon">
              <i className="zmdi zmdi-email"></i>
            </div>
            <h2>Verify Your Email</h2>
            <p className="verification-text">
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your inbox and click the link to verify your email address.
            </p>
            <p className="verification-note">
              Didn't receive the email? <button 
                className="resend-link"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Resend Verification'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};