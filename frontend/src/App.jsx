import Navbar from "./components/Navbar"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import SettingsPage from "./pages/SettingsPage"
import SignUpPage from "./pages/SignUpPage"

import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react"

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast"


function App() {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  const ProtectedRoute = ({ children }) => {
    if (!authUser) return <Navigate to="/login" replace />;
    if (!authUser.isVerified) return <Navigate to="/verify-email" replace />;
    return children;
  };

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={
          authUser ? (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/email-verification" element={!authUser ? <EmailVerificationPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>

  )
}

export default App


// to do - verify email and login page