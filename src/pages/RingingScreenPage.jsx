import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RingingScreenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const providerName = location.state?.providerName || 'Rashid Al Mansoori';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/call-screen', { state: location.state });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ justifyContent: 'center', background: '#1F1F1E' }}
    >
      <div className="flex flex-col items-center justify-center gap-6 px-8">
        {/* Lottie Calling Animation */}
        <dotlottie-wc
          src="https://lottie.host/19dabb26-d131-467e-8961-3a07151b94d3/3uRSZjUOpn.lottie"
          style={{ width: '280px', height: '280px' }}
          autoplay
          loop
        />

        {/* Provider Info */}
        <div className="text-center space-y-2">
          <h2 className="text-white text-xl font-semibold">{providerName}</h2>
          <p className="text-gray-400 text-sm">Calling...</p>
        </div>

        {/* Cancel Button */}
        <button
          className="mt-4 px-8 py-3 border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/5 transition-colors"
          onClick={() => navigate('/provider-tracking', { state: location.state })}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
