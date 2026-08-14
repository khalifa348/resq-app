import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Mic, MicOff, Volume2, VolumeX, MapPin } from 'lucide-react';

export default function CallScreenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const providerName = location.state?.providerName || 'Rashid Al Mansoori';

  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // ── Live timer (starts immediately — provider already answered) ──
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback(() => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [seconds]);

  const handleEndCall = () => {
    navigate('/provider-tracking', { state: location.state });
  };

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ justifyContent: 'flex-start', background: '#1F1F1E' }}
    >
      {/* ── Status Bar ── */}
      <header className="pt-4 px-6 flex justify-between items-center w-full shrink-0">
        <div className="font-semibold text-sm">9:41</div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21L3 12h18l-9 9z" />
          </svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 12h22L12 2z" />
          </svg>
          <div className="w-6 h-3 border border-white rounded-sm relative">
            <div className="absolute inset-y-0 left-0 bg-white" style={{ width: '80%' }} />
          </div>
        </div>
      </header>

      {/* ── Top Navigation ── */}
      <nav className="px-6 pt-2 shrink-0">
        <button
          className="text-white hover:opacity-70 transition-opacity"
          onClick={() => navigate(-1)}
          aria-label="Minimize call"
        >
          <ChevronDown size={24} strokeWidth={2} />
        </button>
      </nav>

      {/* ── Call Info ── */}
      <main className="flex-grow flex flex-col items-center pt-4">
        {/* Call Status */}
        <div className="text-center space-y-1 mb-8">
          <p className="text-gray-400 text-sm font-medium tracking-wide">On call</p>
          <h1 className="text-3xl font-bold">{providerName}</h1>
          <p className="text-brand-lime text-lg font-medium tabular-nums">{formatTime()}</p>
        </div>

        {/* Provider Profile */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-transparent relative">
            <img
              alt={providerName}
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQRHYYrcHTUiuLqtry0L9UbuG829xQ4JRIzfpN-6IU7m6WmKWkjZpGYe_nBfiIkFnBGr5lgELKP6D1HOTHG5K8yeIyi7dk5SnbXK6qjmUesKPwkXQAnw7RO003MvZZOUqqG_P29BGdbvg2zgrpfzzSnotE31BAtzKctAyOQPo60dwXLq6pwcMHDBpvvVU6LuvGoAh4YpN3YiI6dzjPD8NoSzF4K3QPVwgIrv83Q0di-LLYxZ3QWaozCzBLwFu2bsOyIZDKTVLnLM"
            />
          </div>
          {/* Rating */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center space-x-1 mb-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-lg">4.9</span>
              <span className="text-gray-400 text-base">(128)</span>
            </div>
            <p className="text-gray-400 text-sm">Certified Technician</p>
          </div>
        </div>

        {/* Location Card */}
        <div className="w-[90%] bg-[#181817] border border-white/5 rounded-2xl p-5 flex items-start space-x-4 mb-12">
          <div className="bg-card-bg p-2 rounded-lg">
            <MapPin size={24} className="text-brand-lime" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Your location
            </span>
            <span className="text-white text-base font-medium">Sheikh Zayed Road</span>
          </div>
        </div>

        {/* ── Call Controls ── */}
        <div className="grid grid-cols-3 gap-10">
          {/* Mute */}
          <div className="flex flex-col items-center space-y-2">
            <button
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isMuted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <MicOff size={32} className="text-white" strokeWidth={2} />
              ) : (
                <Mic size={32} className="text-white" strokeWidth={2} />
              )}
            </button>
            <span className="text-xs font-medium text-gray-400">Mute</span>
          </div>

          {/* Keypad */}
          <div className="flex flex-col items-center space-y-2">
            <button
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              aria-label="Keypad"
            >
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle cx="9" cy="11" fill="currentColor" r="1" />
                <circle cx="12" cy="11" fill="currentColor" r="1" />
                <circle cx="15" cy="11" fill="currentColor" r="1" />
                <circle cx="9" cy="14" fill="currentColor" r="1" />
                <circle cx="12" cy="14" fill="currentColor" r="1" />
                <circle cx="15" cy="14" fill="currentColor" r="1" />
                <circle cx="9" cy="17" fill="currentColor" r="1" />
                <circle cx="12" cy="17" fill="currentColor" r="1" />
                <circle cx="15" cy="17" fill="currentColor" r="1" />
              </svg>
            </button>
            <span className="text-xs font-medium text-gray-400">Keypad</span>
          </div>

          {/* Speaker */}
          <div className="flex flex-col items-center space-y-2">
            <button
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isSpeakerOn ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              aria-label={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
            >
              {isSpeakerOn ? (
                <Volume2 size={32} className="text-brand-lime" strokeWidth={2} />
              ) : (
                <VolumeX size={32} className="text-white" strokeWidth={2} />
              )}
            </button>
            <span className="text-xs font-medium text-gray-400">Speaker</span>
          </div>
        </div>
      </main>

      {/* ── End Call Footer ── */}
      <footer className="pb-12 flex justify-center w-full shrink-0">
        <button
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          style={{ boxShadow: '0 4px 20px rgba(255, 59, 48, 0.3)' }}
          onClick={handleEndCall}
          aria-label="End call"
        >
          <svg
            className="h-10 w-10 text-white"
            style={{ transform: 'rotate(135deg)' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </button>
      </footer>
    </div>
  );
}
