import { useReducer, useEffect, createContext, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Registration } from './pages/Registration';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import { initialState, reducer } from '../src/Reducer/Reducer.js';
import HomePage from './pages/Home/HomePage.jsx';

import Logout from './pages/Logout';
import NotFound from './pages/NotFound.jsx';

import Display_Files from './pages/Display/Display_Files.jsx';
import AccountManager from './pages/Account/AccountManager.jsx';
import { ForgotPassword } from './pages/ForgetPassword/ForgotPassword.jsx';
import { ResetPassword } from './pages/ForgetPassword/ResetPassword.jsx';
import Loading from './pages/Loading.jsx';

import Calendra from './pages/Calendra/Calendra.jsx';

import DisplayEmails from './pages/Emails/DisplayEmails.jsx';
import AllCategoryEntry from './pages/Calendra/AllCategoryEntry.jsx';
import FileUploadForm from './pages/FileUploadSection/FileUploadForm.jsx';
import FileUploadAndCalendar from './pages/UploadSection/FileUploadAndCalendar.jsx';

// below under testing

import AndroidApps from './pages/Android/Android_apps.jsx';
import AllUserDownloads from './pages/UsersDownload/UserDownloads.jsx';
import UserDownloads from './pages/Android/UserDownloadList.jsx';
import ComputerProducts from './pages/Computer/ComputerApps.jsx';
import ComputerUserDownload from './pages/Computer/ComputerUserDownload.jsx';
import ReportedIssues from './pages/Report/ReportIssue.jsx';

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
                <HomePage />
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
          <Route path="/homepage" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/messages" element={state.isAuthenticated && state.userInfo?.isAdmin ? <DisplayEmails /> : <LoginPage />} />
          
          <Route
            path="/upload-files"
            element={state.isAuthenticated && state.userInfo?.isAdmin ? <FileUploadForm /> : <Navigate to="/login" />}
          />
          <Route path="/calendar-entry" element={state.isAuthenticated && state.userInfo?.isAdmin ? <AllCategoryEntry /> : <LoginPage />} />
          <Route path="/uploadsection" element={state.isAuthenticated && state.userInfo?.isAdmin ? <FileUploadAndCalendar /> : <LoginPage />} />

          <Route
            path="/displayfiles"
            element={state.isAuthenticated && state.userInfo?.isAdmin ? <Display_Files /> : <Navigate to="/login" />}
          />
          <Route
            path="/accounting"
            element={state.isAuthenticated && state.userInfo?.isAdmin ? <AccountManager /> : <Navigate to="/login" />}
          />
          
          <Route path="/calendar" element={state.isAuthenticated ? <Calendra /> : <LoginPage />} />

          <Route path="/android" element={<AndroidApps />} />
          <Route path="/userdownloads" element={state.isAuthenticated ?  <UserDownloads /> : <LoginPage />} />

          {/* For computer routes */}
          <Route path="/computerapps" element={<ComputerProducts />} />
          <Route path="/userdownloadscomputer" element={state.isAuthenticated ? <ComputerUserDownload /> : <LoginPage />} />

          {/* download list for all users  */}
          <Route path="/downloadlists" element={state.isAuthenticated && state.userInfo?.isAdmin ? <AllUserDownloads /> : <AndroidApps />} />          
          <Route path="/report-issue" element={state.isAuthenticated && state.userInfo?.isAdmin ? <ReportedIssues /> : <AndroidApps />} />          


          
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
