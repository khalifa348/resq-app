import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* ── Background decorative letters ── */}
      <div className="bg-letters">
        <img src="/Q.png" className="letter-q" alt="" />
        <img src="/R.png" className="letter-r" alt="" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* ── App Logo ── */}
        <div className="flex flex-col items-center mb-12">
          <div
            className="w-40 h-40 rounded-3xl overflow-hidden flex items-center justify-center mb-6"
            style={{ backgroundColor: '#1C1C1C', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
          >
            <img
              src="/logo1.png"
              alt="ResQ"
              className="w-full h-full object-contain p-3"
            />
          </div>
          <h1 className="text-5xl font-bold tracking-tight" style={{ color: '#84CC16' }}>
            ResQ
          </h1>
          <p className="text-lg mt-2 text-center" style={{ color: '#c4c9b1' }}>
            Roadside assistance, anytime, anywhere.
          </p>
        </div>

        {/* ── Get Started Button ── */}
        <button
          className="flex items-center gap-3 py-4 px-10 text-[1rem] font-semibold rounded-xl transition-all focus:outline-none active:scale-95"
          style={{
            backgroundColor: '#84CC16',
            color: '#121212',
            border: 'none',
          }}
          type="button"
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#c4df4a';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#84CC16';
          }}
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </main>

      <style>{`
        .bg-letters {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .letter-q {
          position: absolute;
          top: -40px;
          right: -50px;
          width: 340px;
          height: auto;
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }
        .letter-r {
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 360px;
          height: auto;
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </div>
  );
}
