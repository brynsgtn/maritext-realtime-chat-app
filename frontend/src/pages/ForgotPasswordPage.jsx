
import { useState } from "react";
import { ArrowLeft, Loader2, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isForgettingPassword, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await forgotPassword(email);

    if (success == true) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <AuthImagePattern
        title="Password Recovery"
        subtitle="Reset your password to regain access to your account and continue your conversations."
      />

      {/* Right Side - Image/Pattern */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
            transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>
              <p className="text-base-content/60">Reset your account password</p>
            </div>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-base-content/60 text-center mb-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="form-control mt-5">
                <label className="label mb-2">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40 z-20" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 focus:outline-none"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isForgettingPassword}>
                {isForgettingPassword ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Check Your Email</h3>
              <p className="text-base-content/60">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <Link to="/login" className="text-primary inline-flex items-center hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
export default ForgotPasswordPage;