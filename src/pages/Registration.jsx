import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Registration.css';

export const Registration = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // New state for button disabling


  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password); // Checks for at least one uppercase letter
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Checks for at least one special character
    const hasNumber = /[0-9]/.test(password); // Checks for at least one number
    const isValidLength = password.length >= minLength; // Ensures minimum length of 8 characters
  
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
  
    return true; // If all conditions are met
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { name, email, password, confirmPassword, profilePassword } = user;

    if (!name || !email || !password || !confirmPassword || !profilePassword) {
      return window.alert("Please fill all the fields...");
    }

     // Assuming 'user.profilePassword' is the password field
  const passwordValidation = validatePassword(user.profilePassword);

  if (passwordValidation !== true) {
    alert(passwordValidation); // Show the validation error to the user
    return; // Prevent form submission if password is invalid
  }

  setIsSubmitting(true); // Disable button after clicking


    try {
      const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
      const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
      const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

      const response = await fetch(`${apiUrl}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      console.log("Data : ", data);

      if (data.status === "400") {
        window.alert("Please fill all the details...");
      } else if (data.status === "402") {
        window.alert("Email Already Exits...");
      } else if (data.status === "403") {
        window.alert("Password doesn't match...");
      }
      else if (data.status === "404") {
        window.alert("Password and profile password can not be the same");
      }  
      else if (data.status === "500") {
        window.alert("Email is not Registered, please register first...");
      } else {
        window.alert('Registration Successful Please Login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
    finally {
      setIsSubmitting(false); // Re-enable button after request completes
    }
  }

  return (
    <div className="RegistrationMainContainer">
      <div className="RegistrationImage">
        <form method='POST' onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor='name'>
              <i className="zmdi zmdi-account mr-2" style={{color:'green'}}></i>Name
            </label>
            <input
              type="text"
              className='bg-transparent text-green-800 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-black'
              name="name"
              id="name"
              placeholder='Enter your name'
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email">
              <i className="zmdi zmdi-email mr-2" style={{color:'red'}}></i>Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className='bg-transparent text-red-800 placeholder-red-500 focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='Enter your email'
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password">
              <i className="zmdi zmdi-lock mr-2" style={{color:'green'}}></i>Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className='bg-transparent text-green-800 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='Enter password'
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword">
              <i className="zmdi zmdi-lock mr-2" style={{color:'red'}}></i>Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className='bg-transparent text-red-800 placeholder-red-500 focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='Repeat password'
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="profilePassword">
              <i className="zmdi zmdi-lock mr-2" style={{color:'green'}}></i>Profile Password
            </label>
            <input
              type="password"
              name="profilePassword"
              id="profilePassword"
              className='bg-transparent text-green-800 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-black'
              placeholder='Secure account password'
              value={user.profilePassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-center mb-6">

          <button 
              type='submit'
              disabled={isSubmitting} // Disable button when submitting
              className={`font-semibold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 ease-in-out ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed'  // Greyed-out style
                  : 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white transform hover:scale-110'
              }`}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>           
          </div>
        </form>

        <div className="text-center">
          <NavLink to="/login"
           className="text-red-500 uppercase hover:text-green-700  text-sm"          
          >I am Already a Registered User</NavLink>
        </div>
      </div>
    </div>

  );
};
