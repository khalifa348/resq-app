import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoadingScreenPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/provider-tracking', { state: location.state });
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="iphone-screen animate-fadeIn" style={{ justifyContent: 'center' }}>
      <div className="flex flex-col items-center justify-center gap-8 px-8">
        {/* Lottie Animation */}
        <div className="flex justify-center items-center">
          <dotlottie-wc
            src="https://lottie.host/886eafb2-e50c-4e4f-ba1b-cf5dc5fd4d28/GAKlWM6FKJ.lottie"
            style={{ width: '300px', height: '300px' }}
            autoplay
            loop
          />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-white text-xl font-semibold">Contacting your helper...</h2>
          <p className="text-gray-400 text-sm">Please wait while we connect you</p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-lime animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-lime animate-bounce" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-lime animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}
