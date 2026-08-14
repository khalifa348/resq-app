import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ChevronRight, LogOut, Info } from 'lucide-react';

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('Khalifa');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ justifyContent: 'flex-start', background: '#121212' }}
    >
      {/* ── Header ── */}
      <header className="flex items-center px-4 pt-12 pb-4 shrink-0">
        <button
          className="text-white hover:opacity-80 transition-opacity mr-4"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold">Profile Settings</h1>
      </header>

      {/* ── Profile Card ── */}
      <section className="px-4 mb-6">
        <div className="bg-card-bg rounded-2xl p-6 border border-white/5 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-lime mb-4">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSv8HkyYkP-WphugJYP0YNjVOwVw-_8R-s6P9-clwcqBtSMZMIrbEDKsOGC5YxzVWL98GFisJPJtvFd7gWyQaMllQLWvWi-Cjgf6ut4a3TMR60tAwL803_IhDjc4A-Byh432epeh-1seRNLh2gH0lmOfcZ62bqgjGWRvV6eopBD6rEkvaak1YaKblY1ke0mkJlOgK0yZt-hwA-99xMv69sCwRGLmms-WrziJzEZgI8vrcBeei32tTdgHsserAcxyY1XGWpXuKoNz3J"
            />
          </div>
          <h2 className="text-lg font-semibold text-white">{name}</h2>
          <p className="text-sm text-gray-400">Premium Member</p>
        </div>
      </section>

      {/* ── Settings List ── */}
      <section className="px-4 flex-1">
        <div className="bg-card-bg rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
          {/* Change Name */}
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            onClick={() => {
              setTempName(name);
              setIsEditing(true);
            }}
          >
            <div className="flex items-center gap-3">
              <User size={20} strokeWidth={2} className="text-brand-lime" />
              <span className="text-white text-sm">Change Name</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">{name}</span>
              <ChevronRight size={16} strokeWidth={2} className="text-gray-600" />
            </div>
          </button>

          {/* App Version */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Info size={20} strokeWidth={2} className="text-brand-lime" />
              <span className="text-white text-sm">App Version</span>
            </div>
            <span className="text-gray-500 text-sm">1.0.0</span>
          </div>

          {/* Logout */}
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} strokeWidth={2} className="text-red-400" />
              <span className="text-red-400 text-sm">Logout</span>
            </div>
            <ChevronRight size={16} strokeWidth={2} className="text-gray-600" />
          </button>
        </div>
      </section>

      {/* ── Name Edit Modal ── */}
      {isEditing && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center px-8"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-card-bg rounded-2xl p-6 w-full max-w-xs border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Change Name</h3>
            <input
              className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none mb-4"
              placeholder="Enter your name"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-brand-lime text-black text-sm font-bold hover:opacity-90 transition-opacity"
                onClick={handleSaveName}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
