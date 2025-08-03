import React, { useEffect, useState, useContext } from 'react';
import { Button } from "@material-tailwind/react";
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import successIcon from '../Images/gif/success.gif';
import './Login.css';
import Login_video from '/videos/video2.mp4';

const LoginPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [apps, setApps] = useState([]);

  // Fetch apps data
  useEffect(() => {
    const fetchApps = async () => {
      const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;
      try {
        const res = await fetch(`${apiUrl}/android/all-apps`);
        const data = await res.json();
        if (data.apps) {
          setApps(data.apps);
        }
      } catch (error) {
        console.error('Error fetching apps:', error);
      }
    };
    fetchApps();
  }, []);

  // Update images with random properties
  const updateImages = (apps) => {
    const shuffled = [...apps].sort(() => 0.5 - Math.random()).slice(0, 8);
    const imagesWithPosition = shuffled.map(app => ({
      ...app,
      size: Math.floor(Math.random() * 150) + 100, // 100-250px
      top: Math.random() * 70 + 5, // 5-75%
      left: Math.random() * 70 + 5, // 5-75%
      rotation: Math.floor(Math.random() * 360), // 0-360deg
      zIndex: Math.floor(Math.random() * 5),
      opacity: Math.random() * 0.7 + 0.3, // 0.3-1.0
      scale: Math.random() * 0.5 + 0.8 // 0.8-1.3
    }));
    setCurrentImages(imagesWithPosition);
  };

  // Set up image rotation every 5 seconds
  useEffect(() => {
    let interval;
    if (apps.length > 0) {
      updateImages(apps); // Initial set
      interval = setInterval(() => updateImages(apps), 5000);
    }
    return () => clearInterval(interval);
  }, [apps]);

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

      if (res.status === 200 && data.status === "SUCCESS") {
        localStorage.setItem('jwtoken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        dispatch({ type: 'USER', payload: { isAuthenticated: true, userInfo: data.user } });

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
      {showSuccess ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <img src={successIcon} alt="Login Successful" className="w-20 h-20 animate-bounce" />
        </div>
      ) : (
        <div className="loginMainContainer relative h-screen w-full overflow-hidden">
          <video 
            src={Login_video} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"              
          />

          {/* Floating Images */}
          {currentImages.map((image, index) => (
            <div 
              key={`${image.id}-${index}`}
              className="absolute transition-all duration-1000 ease-in-out hover:z-10"
              style={{
                top: `${image.top}%`,
                left: `${image.left}%`,
                width: `${image.size}px`,
                height: `${image.size}px`,
                transform: `rotate(${image.rotation}deg) scale(${image.scale})`,
                zIndex: image.zIndex,
                opacity: image.opacity,
                animation: `float 8s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              <img 
                src={image.image} 
                alt={image.name} 
                className="w-full h-full object-contain rounded-lg shadow-xl border-2 border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}

          {/* Login Box */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-6 py-8 bg-black/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 z-20 transition-all duration-300 hover:backdrop-blur-md">
            <h2 className="text-xl font-bold text-center text-white mb-6">Welcome Back</h2>
            
            <form onSubmit={loginUser} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-green-400/30 rounded-lg bg-black/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-red-400/30 rounded-lg bg-black/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : 'Login'}
                </Button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-center">
                <NavLink
                  to="/forgot-password"
                  className="text-white/70 hover:text-white text-sm flex items-center"
                >
                  <i className="fas fa-question-circle mr-2"></i>
                  Forgot Password?
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