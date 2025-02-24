import React, { useEffect, useState, useContext } from 'react';
import { Button } from "@material-tailwind/react";
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import whatsappicon from '../Images/gif/whatsapp.gif';
import loginImage from '../Images/gif/purple_flower.gif';
import successIcon from '../Images/gif/success.gif';
import Snowfall from 'react-snowfall'; // Import Snowfall library
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return window.alert("Please fill all the details...");
    }

    setLoading(true);
    const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;

    try {
      const res = await fetch(`${apiUrl}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log("Response Data:", data); // ✅ Check if user info is received

      if (res.status === 200 && data.status === "SUCCESS") {
        localStorage.setItem('jwtoken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user)); // ✅ Store userInfo

        console.log("Storing userInfo in localStorage:", data.user);

        dispatch({ type: 'USER', payload: { isAuthenticated: true, userInfo: data.user } });

        // Show success message and redirect
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/android');
        }, 1500);
      } else {
        window.alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
};



  return (
    <>
      {/* Snowfall outside the main container */}
      <Snowfall
        color="rgba(255, 0, 0, 0.5)" // Red transparent color
        snowflakeCount={80}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1, // Ensures snowflakes appear behind content
        }}
      />

      {showSuccess ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <img src={successIcon} alt="Login Successful" className="w-20 h-20 animate-bounce" />
        </div>
      ) : (
        <div
          className="loginMainContainer"
          
        >
          {/* Login Box */}
          <div className="loginImage">

            <form onSubmit={loginUser} className="space-y-6 relative z-10">
              {/* Email Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-800">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-black rounded-lg bg-transparent text-green-800 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-800">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-black rounded-lg bg-transparent text-red-800 placeholder-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-start">
                <NavLink
                  to="/forgot-password"
                  className="text-red-500 uppercase hover:text-green-700 flex items-center text-sm"
                >
                  <img src={whatsappicon} alt="Forgot Password Icon" className="inline-block w-4 h-4 mr-2" />
                  Forgot password?
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
