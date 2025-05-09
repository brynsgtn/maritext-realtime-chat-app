import Navbar from "./components/Navbar"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import SettingsPage from "./pages/SettingsPage"
import SignUpPage from "./pages/SignUpPage"

import { Routes, Route } from "react-router-dom";

import { useAuthStore} from "./store/useAuthStore.js";
import { useEffect } from "react"

import { Loader } from "lucide-react";


function App() {

 const { authUser, checkAuth, isCheckingAuth} = useAuthStore();

 useEffect(() => {
  checkAuth();
 },[checkAuth]);

 console.log(authUser);

 if (isCheckingAuth && !authUser) return (
  <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin" />
  </div>
)

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>

  )
}

export default App
