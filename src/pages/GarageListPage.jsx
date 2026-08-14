import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const garages = [
  {
    id: 1,
    name: 'Precision Auto Care',
    rating: 4.8,
    reviews: 128,
    distance: '1.2 miles away',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsaSuH6p3PknQWUU6q8lxzMCqhRucYO1zIBdUXleYhF9ogB8ZPxVHNCPF8YNpisPGmNipUWiIteno3bxS9xZgC2trd6-Y9tCl3zhMPcR9JDMrn9Fdf9OKx5WFZryBxCJQ65m3-_il2OkX8TAhFb3uuzZ7X2gRLkfCxj0B5f7A6jnC15pX8S-t5_cGUcMuL_7cA71xKs5x3Zf24FVXrxj9yFpRPMSC3aRwOBzhVFlrkgWcW71w16eb7bepca9XJ62jubsD0jzsiOxY',
    tags: ['Engine Repair', 'Diagnostics', 'Oil Change'],
    fullStars: 4,
    halfStar: true,
  },
  {
    id: 2,
    name: 'Master Mechanics',
    rating: 5.0,
    reviews: 342,
    distance: '3.4 miles away',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOFa5K02S-0mkqe6vdNXePb5jaJMlwzGM0zBMrKDL3l-ki9kP9Nrz9MyK5cUChmFs-jUjZOvWXd3TsG1OTvymTvp8xy4AAnOMQY0x5Lw_wuXmCiy87-oyZG0Rj0WsbmIzqub3CuL-svr0bAxa0on2W6abgdabbR4dhXp4eN6dKWweOykTuVWtthm3BmQNmF817t4OLuaxh9VK7A1hqyub6a-jMrfteA1OVmOqQSxt-Iit7rt3sLmeN-ueG1D2yzRsyyWFZt5nNN0',
    tags: ['Hybrid Expert', 'EV Service', 'Certified Tech'],
    fullStars: 5,
    halfStar: false,
  },
  {
    id: 3,
    name: 'Elite Service Center',
    rating: 4.2,
    reviews: 87,
    distance: '5.1 miles away',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8Jw8XOgDTV-XePdXtAiA06uyRI2Oq6tfTnsVKmmadr-G3H1VtFYXto6SA6tbEtHtcBzNmPUvhSgJ9KPfw3LU3MjxDsoBd4W5c7-2aTNCW20sAzEHbAPBDRSJeU2BwzDqMN4o8VgtIhDdEiB878zN_QgDA1fn5CJ-TOPSyX-J8Q2j3NsV8p2PbOzCVvzoSFFjfFXRHB8z6LfndgqUXBrcFAs0AbJVXluCv9UXTaY5U-8fThY2NntO8OSP4tPHv_jXUGeLgMUMe-JQ',
    tags: ['Brake Specialist', 'Alignment', 'Busy Now'],
    fullStars: 4,
    halfStar: false,
  },
];

export default function GarageListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('open');

  const renderStars = (full, half) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(
          <span key={i} className="material-symbols-outlined filled text-[16px]" style={{ color: '#84CC16' }}>
            star
          </span>
        );
      } else if (i === full && half) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[16px]" style={{ color: '#84CC16' }}>
            award_star
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[16px]" style={{ color: '#4a4a4a' }}>
            star
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="iphone-screen animate-fadeIn" style={{ backgroundColor: '#121212' }}>
      {/* ── Top Header ── */}
      <header className="fixed top-0 left-0 w-full z-40" style={{ backgroundColor: '#121212', borderBottom: '1px solid #2a2a2a' }}>
        {/* Top bar: menu + title + search */}
        <div className="flex items-center justify-between px-5 py-3 w-full">
          <button
            className="p-2 text-[#c4c9b1] hover:text-white hover:bg-[#1E1F1E] transition-colors rounded-full flex items-center justify-center"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-white">Nearby Providers</h1>
          <button className="p-2 text-[#c4c9b1] hover:text-white hover:bg-[#1E1F1E] transition-colors rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 pb-2">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#71717A] transition-all"
              style={{ backgroundColor: '#1E1F1E', border: '1px solid #2a2a2a' }}
              placeholder="Search garages, services..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
          <button
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeFilter === 'open'
                ? 'bg-[#84CC16] text-[#121212]'
                : 'bg-[#1E1F1E] text-[#c4c9b1] border border-[#2a2a2a] hover:border-[#84CC16]/30'
            }`}
            onClick={() => setActiveFilter('open')}
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            Open Now
          </button>
          <button
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeFilter === 'top'
                ? 'bg-[#84CC16] text-[#121212]'
                : 'bg-[#1E1F1E] text-[#c4c9b1] border border-[#2a2a2a] hover:border-[#84CC16]/30'
            }`}
            onClick={() => setActiveFilter('top')}
          >
            Top Rated
          </button>
          <button
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeFilter === 'specialized'
                ? 'bg-[#84CC16] text-[#121212]'
                : 'bg-[#1E1F1E] text-[#c4c9b1] border border-[#2a2a2a] hover:border-[#84CC16]/30'
            }`}
            onClick={() => setActiveFilter('specialized')}
          >
            Specialized
          </button>
          <button
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeFilter === 'distance'
                ? 'bg-[#84CC16] text-[#121212]'
                : 'bg-[#1E1F1E] text-[#c4c9b1] border border-[#2a2a2a] hover:border-[#84CC16]/30'
            }`}
            onClick={() => setActiveFilter('distance')}
          >
            Distance
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </button>
        </div>
      </header>

      {/* ── Main Content List ── */}
      <main className="flex-grow overflow-y-auto px-5 py-4" style={{ paddingTop: '170px' }}>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {garages.map((garage) => (
            <article
              key={garage.id}
              className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-[#84CC16]/30"
              style={{ backgroundColor: '#1C1C1C', border: '1px solid #2a2a2a' }}
            >
              {/* Row: Image + Info */}
              <div className="flex gap-3">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden" style={{ backgroundColor: '#121212' }}>
                  <img
                    className="w-full h-full object-cover"
                    alt={garage.name}
                    src={garage.image}
                  />
                </div>
                <div className="flex flex-col flex-grow justify-between py-0.5">
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">{garage.name}</h2>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex">
                        {renderStars(garage.fullStars, garage.halfStar)}
                      </div>
                      <span className="text-xs font-medium text-[#c4c9b1]">({garage.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#71717A]">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="text-xs">{garage.distance}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {garage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: '#121212', color: '#c4c9b1' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t" style={{ borderColor: '#2a2a2a' }} />

              {/* Action Buttons - boxy style */}
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#84CC16', color: '#121212', borderRadius: '4px' }}
                  onClick={() => navigate('/service-tracking')}
                >
                  Book Now
                </button>
                <button
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-center transition-colors"
                  style={{ backgroundColor: 'transparent', border: '1px solid #84CC16', color: '#84CC16', borderRadius: '4px' }}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ── No bottom navigation bar ── */}
    </div>
  );
}
