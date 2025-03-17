import { useReducer, useEffect, createContext, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Registration } from './pages/Registration';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import { initialState, reducer } from '../src/Reducer/Reducer.js';

import Logout from './pages/Logout';
import NotFound from './pages/NotFound.jsx';

import { ForgotPassword } from './pages/ForgetPassword/ForgotPassword.jsx';
import { ResetPassword } from './pages/ForgetPassword/ResetPassword.jsx';
import Loading from './pages/Loading.jsx';

import DisplayEmails from './pages/Emails/DisplayEmails.jsx';

// below under testing

import AndroidApps from './pages/Android/Android_apps.jsx';
import ComputerProducts from './pages/Computer/ComputerApps.jsx';
import ReportedIssues from './pages/Report/ReportIssue.jsx';
import History from './pages/History/history.jsx';
import AllUserDownloads from './pages/History/AllUsersHistory.jsx';
import New from './pages/Home/New.jsx';

export const userContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtoken');
    if (token) {
      dispatch({ type: 'USER', payload: true }); // Set isAuthenticated to true if token exists
    }
    setAuthInitialized(true); // Mark auth as initialized
  }, []);

  if (!authInitialized) {
    return <Loading />;
  }

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar /> {/* Navbar outside of Routes */}
        <Routes>
          <Route
            path="/"
            element={
              !authInitialized ? ( // Wait until authentication is initialized
                <Loading />
              ) : state.isAuthenticated ? ( // Show welcome message if authenticated
                <AndroidApps />
              ) : ( // Otherwise, show the Main component
                <New />
              )
            }
          />
          
          <Route
            path="/login"
            element={state.isAuthenticated ? <AndroidApps /> : <LoginPage />}
          />

          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/new" element={<New />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/messages" element={state.isAuthenticated && state.userInfo?.isAdmin ? <DisplayEmails /> : <LoginPage />} />
          
          
          <Route path="/android" element={<AndroidApps />} />

          {/* For computer routes */}
          <Route path="/computerapps" element={<ComputerProducts />} />

          {/* history for download apps */}

          <Route path="/history" element={state.isAuthenticated ?  <History /> : <LoginPage />} />
          <Route path="/allusers" element={state.isAuthenticated && state.userInfo?.isAdmin ? <AllUserDownloads /> : <AndroidApps />} />    

          <Route path="/report-issue" element={state.isAuthenticated && state.userInfo?.isAdmin ? <ReportedIssues /> : <AndroidApps />} />  




          
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
