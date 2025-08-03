import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CompleteProfile.css';
import registrationVideo from '/videos/video2.mp4';

export const CompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    profilePassword: "",
  });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    if (!emailParam) {
      navigate('/registration');
    } else {
      setEmail(emailParam);
    }
  }, [location, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isValidLength = password.length >= minLength;

    if (!isValidLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }

    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, password, confirmPassword, profilePassword } = user;

    // Validate password
    const passwordValidation = validatePassword(password);
    if (passwordValidation !== true) {
      setIsError(true);
      setMessage(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    if (password === profilePassword) {
      setIsError(true);
      setMessage("Password and Profile password cannot be the same");
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setMessage("");

    try {
      const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
      const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
      const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

      const response = await fetch(`${apiUrl}/user/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password, confirmPassword, profilePassword }),
      });

      const data = await response.json();

      if (data.status === "400") {
        setIsError(true);
        setMessage(data.message || 'All fields are required');
      } else if (data.status === "403") {
        setIsError(true);
        setMessage("Passwords do not match");
      } else if (data.status === "409") {
        setIsError(true);
        setMessage("Password and Profile password cannot be the same");
      } else if (data.status === "404") {
        setIsError(true);
        setMessage("User not verified");
        navigate('/registration');
      } else if (data.status === "200") {
        setIsError(false);
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setIsError(true);
        setMessage("An unexpected error occurred");
      }
    } catch (error) {
      console.error('Error completing profile:', error);
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

      <div className="registration-form profile-completion">
        <h2 className="form-title">Complete Your Profile</h2>
        <p className="form-subtitle">Registered email: <strong>{email}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <i className="zmdi zmdi-account form-icon"></i> Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-input"
              placeholder="Enter your full name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i className="zmdi zmdi-lock form-icon"></i> Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-input"
              placeholder="Create a password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <div className="password-hints">
              <span>Must be at least 8 characters</span>
              <span>Include uppercase letter</span>
              <span>Include number</span>
              <span>Include special character</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <i className="zmdi zmdi-lock form-icon"></i> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePassword" className="form-label">
              <i className="zmdi zmdi-lock-outline form-icon"></i> Profile Password
            </label>
            <input
              type="password"
              name="profilePassword"
              id="profilePassword"
              className="form-input"
              placeholder="Create a profile password (different from login)"
              value={user.profilePassword}
              onChange={handleChange}
              required
            />
            <div className="password-note">
              This will be used for sensitive account actions
            </div>
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
              'Complete Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};