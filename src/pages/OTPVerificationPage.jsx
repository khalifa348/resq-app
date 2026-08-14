import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 4;
const RESEND_TIMEOUT = 30;

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendPhoneOTP, verifyPhoneOTP } = useAuth();

  const phone = location.state?.phone || '';
  const otpSent = location.state?.otpSent === true;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const inputRefs = useRef([]);

  // Send OTP — called on mount only if the previous page failed to send it
  const sendOtp = useCallback(async () => {
    if (!phone) {
      setError('No phone number provided. Please go back and try again.');
      setSendingOtp(false);
      return;
    }

    setSendingOtp(true);
    setError('');
    try {
      await sendPhoneOTP(phone);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setSendingOtp(false);
    }
  }, [phone, sendPhoneOTP]);

  // Auto-send OTP on mount only if the previous page could not send it
  useEffect(() => {
    if (!otpSent && phone) {
      sendOtp();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = useCallback((index, value) => {
    if (!/^\d*$/.test(value)) return;
    setError('');

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }, [otp]);

  const handleVerify = useCallback(async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the full 4-digit code.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      await verifyPhoneOTP(phone, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setVerifying(false);
    }
  }, [otp, phone, navigate, verifyPhoneOTP]);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_TIMEOUT);
    setError('');
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    sendOtp();
  }, [canResend, sendOtp]);

  const isComplete = otp.every((d) => d !== '');

  // No phone — show error with back link
  if (!phone) {
    return (
      <div
        className="iphone-screen animate-fadeIn"
        style={{ background: 'linear-gradient(180deg, #1a1414 0%, #100F0F 100%)' }}
      >
        <main className="relative z-10 flex-grow flex flex-col px-6 pb-12 max-w-md mx-auto w-full justify-center">
          <p className="text-red-400 text-sm text-center">{error || 'Missing phone number. Please go back and try again.'}</p>
          <div className="mt-8 text-center">
            <button
              className="text-[#84CC16] text-sm font-semibold hover:underline"
              onClick={() => navigate('/signin')}
            >
              ← Back to Sign In
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ background: 'linear-gradient(180deg, #1a1414 0%, #100F0F 100%)' }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 z-50">
        <div className="h-full w-2/3 bg-[#84CC16] rounded-full transition-all duration-700" />
      </div>

      {/* Top App Bar */}
      <header className="relative z-40 flex items-center justify-between px-5 w-full h-12 mt-4">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10 rounded-full p-3 transition-transform duration-200 active:scale-95 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <span className="text-[#a1a8c0] text-xs font-semibold tracking-wide uppercase">
          Step 2 of 3
        </span>
      </header>

      {/* Scrollable Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 pb-8 overflow-y-auto">
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center mb-8 relative text-center">
          {/* Decorative background blob */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#84CC16] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />

          {/* ResQ Logo */}
          <button
            onClick={() => navigate('/')}
            className="mb-4 transition-transform duration-200 active:scale-95 cursor-pointer"
            aria-label="Go to home"
          >
            <img
              src="/Screenshot_2026-06-25_150813-removebg-preview (1).png"
              alt="ResQ Logo"
              className="h-10 w-auto object-contain"
            />
          </button>

          <h1 className="text-[32px] font-bold text-white leading-tight tracking-tight mb-2 font-manrope">
            Verify your phone
          </h1>
          <p className="text-base text-[#a1a8c0] max-w-[90%] leading-relaxed">
            We've sent a 4-digit code to{' '}
            <span className="text-[#005a3c] font-semibold">{phone}</span>
          </p>
        </div>

        {/* Sending indicator */}
        {sendingOtp && (
          <div className="flex justify-center mb-6">
            <span className="text-sm text-[#84CC16] flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending OTP...
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-6 text-center">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* OTP Input Form */}
        <div className="flex flex-col items-center w-full gap-6">
          {/* Input Boxes */}
          <div className="flex justify-center gap-3 max-w-[320px]" id="otp-container">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                className={`w-16 h-20 rounded-full bg-[#1d1f27] border text-center text-[32px] font-bold text-white outline-none transition-all duration-200 shadow-inner ${
                  digit
                    ? 'border-[#84CC16]/60 shadow-[0_0_0_4px_rgba(132,204,22,0.15)]'
                    : error
                      ? 'border-red-500'
                      : 'border-[#434656] focus:border-[#84CC16] focus:shadow-[0_0_0_4px_rgba(132,204,22,0.15)]'
                }`}
                maxLength={1}
                type="tel"
                value={digit}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onChange={(e) => handleChange(idx, e.target.value)}
                onPaste={idx === 0 ? handlePaste : undefined}
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={sendingOtp}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          {/* Spacer to push button to bottom on short screens */}
          <div className="flex-1 min-h-[32px]" />

          {/* Action Button */}
          <div className="flex flex-col gap-4 mt-auto w-full">
            <button
              className={`w-full h-16 text-[17px] font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 group ${
                verifying
                  ? 'bg-[#84CC16]/50 text-black/50 cursor-not-allowed'
                  : isComplete
                    ? 'bg-[#84CC16] text-black hover:bg-[#A3E635] active:scale-[0.98] shadow-sm'
                    : 'bg-[#84CC16] text-black opacity-60 cursor-not-allowed'
              }`}
              disabled={!isComplete || verifying || sendingOtp}
              onClick={handleVerify}
            >
              {verifying ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              <span className="text-sm text-[#a1a8c0]">Didn't receive the code?</span>
              {canResend ? (
                <button
                  className="text-sm font-semibold text-[#84CC16] hover:underline ml-1 bg-transparent border-none cursor-pointer focus:outline-none"
                  onClick={handleResend}
                >
                  Resend
                </button>
              ) : (
                <span className="text-sm text-[#a1a8c0] ml-1">
                  Resend in <span className="text-white font-semibold">{countdown}s</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Ambient Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1d1f27] to-transparent pointer-events-none opacity-50" />
    </div>
  );
}
