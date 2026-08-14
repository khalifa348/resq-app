import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  const handleSignUp = () => {
    setExiting(true);
    setTimeout(() => navigate('/signup'), 350);
  };

  const handleSignIn = () => {
    setExiting(true);
    setTimeout(() => navigate('/signin'), 350);
  };

  return (
    <div
      className={`iphone-screen ${exiting ? 'animate-fadeOut' : 'animate-fadeIn'}`}
      style={{ backgroundColor: '#100F0F' }}
    >
      {/* Spacer with speeder loader animation */}
      <div className="relative z-10 flex-1 overflow-hidden flex items-center justify-center">
        <div className="loader">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div className="base">
            <span></span>
            <div className="face"></div>
          </div>
        </div>
        <div className="longfazers">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="clouds">
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
          <div className="cloud cloud3"></div>
          <div className="cloud cloud4"></div>
          <div className="cloud cloud5"></div>
        </div>
      </div>

      {/* Glassmorphism Card (bottom sheet) */}
      <div className="relative z-10 backdrop-blur-xl bg-black/5 border-t border-white/10 rounded-t-[32px] px-10 pb-10 pt-10 shadow-2xl">
        {/* Headline */}
        <h1 className="flex flex-col gap-1.5">
          <span className="text-[17px] font-normal tracking-tight text-gray-400/90">
            Reliable Roadside Help,
          </span>
          <span className="text-[28px] font-bold tracking-tight text-white leading-tight inline-flex items-center gap-2">
            Anytime
            <span className="word-roller inline-flex items-center text-[#84CC16]">
              <span className="words">
                <span className="word">Anywhere</span>
                <span className="word">Available</span>
                <span className="word">On Time</span>
                <span className="word">Instant</span>
              </span>
            </span>
          </span>
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mt-10">
          <button
            onClick={handleSignUp}
            disabled={exiting}
            className="w-full py-[18px] bg-[#84CC16] text-[#0A0A0A] rounded-full text-[17px] font-semibold tracking-tight cursor-pointer transition-all duration-200 active:scale-[0.97] hover:brightness-110 disabled:opacity-60"
          >
            Sign up
          </button>

          <button
            onClick={handleSignIn}
            disabled={exiting}
            className="w-full py-[18px] text-white rounded-full text-[17px] font-medium tracking-tight border-2 border-white/30 cursor-pointer transition-all duration-200 active:scale-[0.97] hover:bg-white/10 disabled:opacity-60"
          >
            I have an account
          </button>
        </div>
        {/* Trust text */}
        <p className="text-center text-xs font-normal tracking-tight text-gray-500/70 mt-6">
          Trusted by 10,000+ drivers
        </p>
      </div>
    </div>
  );
}
