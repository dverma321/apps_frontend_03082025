import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHome, faFileAlt, faCloudUploadAlt, faSignInAlt, faUserPlus, faDoorOpen, faBars, faCalendarAlt, faComments, faUsers, faHistory, faCartPlus, faExclamationTriangle, faUser } from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faWindows } from '@fortawesome/free-brands-svg-icons';

import useFetchUser from '../pages/API/FetchUserInfo.jsx'; // Import the custom hook


import './Navbar.css';

const Navbar = () => {
  const { state, loading } = useFetchUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Updated state:", state);

    let storedUserInfo = localStorage.getItem('userInfo');

    if (state?.isAuthenticated) {
      if (state?.userInfo) {
        setIsAuthenticated(true);
        setIsAdmin(state.userInfo.isAdmin || false);
      } else if (storedUserInfo) {
        // ✅ If `userInfo` is missing in state but exists in `localStorage`, use it
        let userInfo = JSON.parse(storedUserInfo);
        dispatch({ type: 'USER', payload: { isAuthenticated: true, userInfo } });
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [state?.isAuthenticated, state?.userInfo]);





  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-opacity-50s p-5 mb-5 fixed w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand / Logo */}
        <div className="text-blue-gray-500 text-lg font-semibold uppercase">
          {loading ? (
            'Loading...'
          ) : isAuthenticated && state?.userInfo?.name ? (
            <Link to="/">Welcome {state.userInfo.name}!</Link>
          ) : (
            <Link to="/">Anonymous user</Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="text-green-700 md:hidden">
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="md:flex md:space-x-4 hidden">
          {isAuthenticated ? (
            isAdmin ? (
              <>
                <li><Link className="nav-link" to="/messages"><FontAwesomeIcon icon={faComments} /> Messages</Link></li>
                <li><Link className="nav-link  d-flex align-items-center" to="/android"><FontAwesomeIcon icon={faAndroid} className="me-2" /> Android</Link></li>
                <li><Link className="nav-link  d-flex align-items-center" to="/computerapps"><FontAwesomeIcon icon={faWindows} className="me-2" /> Windows</Link></li>
                <li><Link className="nav-link  d-flex align-items-center" to="/allusers"><FontAwesomeIcon icon={faUser} />  Users</Link></li>
                <li><Link className="nav-link  d-flex align-items-center" to="/report-issue"> <FontAwesomeIcon icon={faExclamationTriangle} />  Report</Link></li>
                <li><Link className="nav-link" to="/logout"><FontAwesomeIcon icon={faDoorOpen} /> Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link className="nav-link d-flex align-items-center" to="/android"><FontAwesomeIcon icon={faAndroid} className="me-2" /> Android</Link></li>
                <li><Link className="nav-link d-flex align-items-center" to="/computerapps"><FontAwesomeIcon icon={faWindows} className="me-2" /> Windows</Link></li>
                <li><Link className="nav-link d-flex align-items-center" to="/history"><FontAwesomeIcon icon={faHistory} /> History</Link></li>
                <li><Link className="nav-link" to="/logout"><FontAwesomeIcon icon={faDoorOpen} /> Logout</Link></li>
              </>
            )
          ) : (
            <>
              <li><Link className="nav-link" to="/"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
              <li><Link className="nav-link" to="/login"><FontAwesomeIcon icon={faSignInAlt} /> Login</Link></li>
              <li><Link className="nav-link" to="/registration"><FontAwesomeIcon icon={faUserPlus} /> Register</Link></li>
              <li><Link className="nav-link" to="/android"><FontAwesomeIcon icon={faAndroid} /> Android</Link></li>
              <li><Link className="nav-link" to="/computerapps"><FontAwesomeIcon icon={faWindows} /> Windows</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="mobile-menu">
          {isAuthenticated ? (
            isAdmin ? (
              <>
                <li><Link className="nav-link" to="/messages" onClick={toggleMenu}><FontAwesomeIcon icon={faComments} /> Messages</Link></li>
                <li><Link className="nav-link" to="/android" onClick={toggleMenu}><FontAwesomeIcon icon={faAndroid} /> Android</Link></li>
                <li><Link className="nav-link" to="/computerapps" onClick={toggleMenu}><FontAwesomeIcon icon={faWindows} /> Windows</Link></li>
                <li><Link className="nav-link" to="/allusers" onClick={toggleMenu}><FontAwesomeIcon icon={faUser} /> Users</Link></li>
                <li><Link className="nav-link" to="/report-issue" onClick={toggleMenu} ><FontAwesomeIcon icon={faExclamationTriangle} /> Report</Link></li>
                <li><Link className="nav-link" to="/logout" onClick={toggleMenu}><FontAwesomeIcon icon={faDoorOpen} /> Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link className="nav-link" to="/android" onClick={toggleMenu}><FontAwesomeIcon icon={faAndroid} /> Android</Link></li>
                <li><Link className="nav-link" to="/computerapps" onClick={toggleMenu}><FontAwesomeIcon icon={faWindows} /> Windows</Link></li>
                <li><Link className="nav-link" to="/history" onClick={toggleMenu}><FontAwesomeIcon icon={faHistory} /> History</Link></li>
                <li><Link className="nav-link" to="/logout" onClick={toggleMenu}><FontAwesomeIcon icon={faDoorOpen} /> Logout</Link></li>
              </>
            )
          ) : (
            <>
              <li><Link className="nav-link" to="/" onClick={toggleMenu}><FontAwesomeIcon icon={faHome} /> Home</Link></li>
              <li><Link className="nav-link" to="/login" onClick={toggleMenu}><FontAwesomeIcon icon={faSignInAlt} /> Login</Link></li>
              <li><Link className="nav-link" to="/registration" onClick={toggleMenu}><FontAwesomeIcon icon={faUserPlus} /> Register</Link></li>
              <li><Link className="nav-link" to="/android" onClick={toggleMenu} ><FontAwesomeIcon icon={faAndroid} /> Android</Link></li>
              <li><Link className="nav-link" to="/computerapps" onClick={toggleMenu}><FontAwesomeIcon icon={faWindows} />Windows</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
