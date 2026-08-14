import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { sendPhoneOTP } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    const fullPhone = `+1${digits}`;
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

  return (
    <div className="iphone-screen animate-fadeIn" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-3 pb-2">
        <span className="text-xs font-semibold text-white/70">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
          </svg>
        </div>
      </div>

      {/* ResQ Logo */}
      <div className="relative z-10 flex justify-center mt-8 mb-10">
        <div className="flex items-center gap-0.5">
          <span className="text-xl font-bold text-white tracking-tight">Res</span>
          <span className="text-xl font-bold text-[#84CC16] tracking-tight">Q</span>
        </div>
      </div>

      {/* Glass form card */}
      <main className="relative z-10 px-5 max-w-md mx-auto w-full">
        <div className="backdrop-blur-md bg-white/8 border border-white/15 rounded-3xl px-5 py-7 shadow-2xl">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Sign In</h1>
          <p className="text-sm text-gray-400 mb-6">Enter your phone number to receive a verification code.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Phone Input */}
            <div>
              <div className="flex items-center bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-3.5 transition-all duration-200 focus-within:border-[#84CC16]/60 focus-within:shadow-[0_0_10px_rgba(132,204,22,0.1)]">
                <Phone size={17} className="text-white/40 shrink-0" />
                <span className="text-white/50 text-sm ml-3 mr-1 select-none">+1</span>
                <input
                  className="bg-transparent border-none p-0 w-full text-white placeholder-gray-500 text-sm outline-none"
                  id="phone"
                  placeholder="(555) 123-4567"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s\-\(\)]/g, ''))}
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                <p className="text-red-400 text-xs text-center">{error}</p>
              </div>
            )}

            {/* Send OTP */}
            <button
              className={`w-full font-semibold py-3.5 rounded-full text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
                loading
                  ? 'bg-[#84CC16]/50 text-[#0A0A0A]/50 cursor-not-allowed'
                  : 'bg-[#84CC16] text-[#0A0A0A] hover:brightness-110 active:scale-[0.97] shadow-lg shadow-[#84CC16]/20'
              }`}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending code...
                </>
              ) : (
                <>
                  Continue to Verification
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          We'll send a 6-digit verification code via SMS. Message and data rates may apply.
        </p>
      </main>
    </div>
  );
}
