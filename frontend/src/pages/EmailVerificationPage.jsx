import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, MessageSquare, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthImagePattern from "../components/AuthImagePattern";


const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [manualEmail, setManualEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const { verifyEmail, isVerifying, resendVerificationEmail, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await verifyEmail(code.join(""));
    console.log(success)
    if (success) navigate("/login");
  };

  const handleResendVerificationEmail = async (e) => {
    e.preventDefault();

    const emailToUse = authUser?.user?.email || manualEmail;

    if (!emailToUse) {
      toast.error("Please enter your email address.");
      setShowEmailInput(true);
      return;
    }
    await resendVerificationEmail(emailToUse);


  };

  const handleSendManualEmail = async () => {
    if (!manualEmail || !manualEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmittingEmail(true);
    try {
      await resendVerificationEmail(manualEmail);
      setShowEmailInput(false);
      setManualEmail("");
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleCloseEmailInput = () => {
    setShowEmailInput(false);
    setManualEmail("");
  };


  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      (async () => {
        const success = await verifyEmail(code.join(""));
        if (success) navigate("/login");
      })();
    }

    console.log(code.join(""))
  }, [code]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}

      <AuthImagePattern
        title="Verify Your Email"
        subtitle="Thanks for signing up! Please verify your email to secure your account and access all features."
      />


      {/* right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-4">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Verify Your Email</h1>
              <p className="text-base-content/60">Enter the 6-digit code sent to your email address.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex justify-between'>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type='text'
                  maxLength='6'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='input input-bordered w-12 h-12 text-center text-2xl font-bold text-base-content focus:outline-hidden'
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="text-center">
            {!showEmailInput && (
              <p className="text-base-content/60">
                Didn't receive the verification email?{" "}
                <button className="link link-primary" onClick={handleResendVerificationEmail}>
                  Resend verification email
                </button>
              </p>
            )}

            {showEmailInput && (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered flex-1"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleCloseEmailInput}
                    className="btn btn-outline"
                    aria-label="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendManualEmail}
                    className="btn btn-primary"
                    disabled={isSubmittingEmail}
                    aria-label="Send"
                  >
                    {isSubmittingEmail ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-base-content/60 mt-1">
                  Enter your email to receive a new verification code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
export default EmailVerificationPage;