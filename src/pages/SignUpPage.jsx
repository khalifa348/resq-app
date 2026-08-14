import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { sendPhoneOTP } = useAuth();
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const termsRef = useRef(null);

  const handleSubmit = async () => {
    setError('');

    const digits = phone.replace(/\D/g, '').replace(/^0+/, '');
    if (digits.length < 9) {
      setError('Please enter a valid UAE phone number (at least 9 digits).');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const fullPhone = `+971${digits}`;
    let otpSent = false;

    setLoading(true);
    try {
      await sendPhoneOTP(fullPhone);
      otpSent = true;
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
      navigate('/verify-otp', { state: { phone: fullPhone, otpSent } });
    }
  };

  const handlePhoneChange = (e) => {
    // Allow only digits, spaces, dashes, parentheses
    const val = e.target.value.replace(/[^0-9\s\-\(\)]/g, '');
    setPhone(val);
  };

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 z-50">
        <div className="h-full w-1/3 bg-[#84CC16] rounded-full transition-all duration-700" />
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
          Step 1 of 3
        </span>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 pb-8 overflow-y-auto">
        {/* Logo & Header Section */}
        <div className="flex flex-col items-start mb-8 relative">
          {/* Decorative background blob */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#84CC16] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />

          {/* Logo */}
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
            Create your account
          </h1>
          <p className="text-base text-[#a1a8c0] max-w-[90%] leading-relaxed">
            Join thousands of users managing their digital lives effortlessly.
          </p>

          {/* Social Proof Pill */}
          <div className="inline-flex items-center gap-2 mt-4 bg-[#1d1f27] border border-[#434656] rounded-full py-1 px-3">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#1d1f27] bg-gradient-to-br from-purple-400 to-pink-500" />
              <div className="w-6 h-6 rounded-full border-2 border-[#1d1f27] bg-gradient-to-br from-lime-400 to-lime-500" />
              <div className="w-6 h-6 rounded-full border-2 border-[#1d1f27] bg-[#84CC16] flex items-center justify-center text-[10px] font-bold text-black">
                +
              </div>
            </div>
            <span className="text-xs font-medium text-[#c3c5d9]">Join 10k+ active users</span>
          </div>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Phone Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] uppercase tracking-wider text-white font-bold ml-1"
              htmlFor="phone"
            >
              Mobile number
            </label>
            <div className="flex items-center bg-[#1d1f27] rounded-lg border border-[#434656] overflow-hidden transition-all duration-200 focus-within:border-[#84CC16]/60 focus-within:shadow-[0_0_0_4px_rgba(132,204,22,0.1)]">
              {/* Country Code Selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1b21] cursor-pointer hover:bg-[#2e323e] transition-colors select-none">
                <svg className="w-5 h-4 rounded-sm" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="20" height="15" fill="#ffffff"/>
                  <rect width="5" height="15" fill="#ff0000"/>
                  <rect y="0" width="20" height="5" fill="#007b3a"/>
                  <rect y="10" width="20" height="5" fill="#000000"/>
                </svg>
                <span className="text-sm font-semibold text-white">+971</span>
                <span className="material-symbols-outlined text-[18px] text-[#737688]">expand_more</span>
              </div>
              {/* Vertical Divider */}
              <div className="w-px h-8 bg-[#434656]" />
              {/* Phone Input */}
              <div className="flex-1 relative px-4">
                <input
                  className="w-full h-[52px] bg-transparent border-none outline-none text-base text-white placeholder:text-white/70 tracking-widest"
                  id="phone"
                  placeholder="05X XXX XXXX"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mt-1">
            <div className="relative flex items-center h-5 mt-0.5">
              <input
                ref={termsRef}
                className="w-5 h-5 border-2 border-[#434656] rounded text-[#84CC16] focus:ring-[#84CC16] focus:ring-offset-2 focus:ring-offset-[#121318] transition-colors cursor-pointer bg-[#1d1f27] accent-[#84CC16]"
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            </div>
            <label className="text-sm text-[#a1a8c0] cursor-pointer leading-snug" htmlFor="terms">
              I agree to the{' '}
              <a className="text-[#84CC16] hover:underline font-medium" href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="text-[#84CC16] hover:underline font-medium" href="#">
                Privacy Policy
              </a>.
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1 min-h-[20px]" />

          {/* Submit Button */}
          <div className="flex flex-col gap-4 mt-auto">
            <button
              className={`w-full h-16 text-[17px] font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 group ${
                loading
                  ? 'bg-[#84CC16]/50 text-black/50 cursor-not-allowed'
                  : 'bg-[#84CC16] text-black hover:bg-[#A3E635] active:scale-[0.98] shadow-sm'
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending code...
                </>
              ) : (
                <>
                  <span>Continue to Verification</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
            <div className="text-center">
              <span className="text-sm text-[#a1a8c0]">Already have an account?</span>
              <button
                type="button"
                className="text-sm font-semibold text-[#84CC16] hover:underline ml-1"
                onClick={() => navigate('/signin')}
              >
                Log in
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Decorative Ambient Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1d1f27] to-transparent pointer-events-none opacity-50" />
    </div>
  );
}
