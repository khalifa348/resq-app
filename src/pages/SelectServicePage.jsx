import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { id: 'battery', icon: 'battery_charging_full', label: 'Battery\nProblem' },
  { id: 'tire', icon: 'tire_repair', label: 'Tire Issue' },
  { id: 'towing', icon: 'rv_hookup', label: 'Towing\nService' },
  { id: 'fuel', icon: 'local_gas_station', label: 'Fuel Delivery' },
  { id: 'lockout', icon: 'lock', label: 'Car Lockout' },
  { id: 'wont-start', icon: 'car_crash', label: "Won't Start" },
  { id: 'engine', icon: 'build', label: 'Engine\nTrouble' },
  { id: 'overheating', icon: 'device_thermostat', label: 'Overheating' },
  { id: 'other', icon: 'more_horiz', label: 'Other\nProblem' },
];

export default function SelectServicePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('lockout');

  const handleCardClick = (id) => {
    setSelected(id);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <div className="iphone-screen animate-fadeIn" style={{ justifyContent: 'flex-start' }}>
      {/* ── Top Navigation Bar ── */}
      <header className="fixed top-0 left-0 w-full z-50 px-5 py-2 flex justify-between items-center h-16"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#353535] transition-colors active:scale-95"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[#e4e2e1]">arrow_back</span>
        </button>

        <div className="relative w-10 h-10 rounded-full border border-[#8e937d] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="User avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3aWNYmR9hrQi8RBMdeUPds3Z4gPFXCv0z4cL482yPEYLnYaI1j8Ig72lNbVXKEo4CoXWTQgZAuukjlbp2EpGxN2qPP_Sz6pPHwW_p7gucSA3Ve92jc-m1KYpritf2qLwmV8fU22aBYUZ7oA-JoVRM81QFtAThqeVZceAwZ1GKTd4pNoTXxZeb0JMcwi5vWqjyYpWgCcaBwZgnSRRRV6gVYgAtRgA3WjsDXAnKfNEujAec41ritETvZNgk01kYvtmLQLw-4UHq48I7"
          />
        </div>
      </header>

      {/* ── Content Area ── */}
      <main
        className="flex-grow pt-24 px-5 pb-12 overflow-y-auto"
        style={{ paddingBottom: '100px' }}
      >
        {/* ── Progress Stepper ── */}
        <div className="flex items-center justify-between mb-12 max-w-sm mx-auto">
          {/* Step 1: Service (active) */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[#121212] text-[18px]"
                style={{ fontVariationSettings: "'wght' 600" }}
              >
                check
              </span>
            </div>
            <span className="text-xs font-medium text-brand-lime">Service</span>
          </div>

          <div className="flex-grow h-[2px] bg-brand-lime mx-3 mb-6" />

          {/* Step 2: Location */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-brand-lime flex items-center justify-center">
              <span className="text-xs font-medium text-brand-lime">2</span>
            </div>
            <span className="text-xs font-medium text-brand-lime">Location</span>
          </div>

          <div className="flex-grow h-[2px] bg-[#353535] mx-3 mb-6" />

          {/* Step 3: Confirm */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#353535] flex items-center justify-center">
              <span className="text-xs font-medium text-[#c4c9b1]">3</span>
            </div>
            <span className="text-xs font-medium text-[#c4c9b1]">Confirm</span>
          </div>
        </div>

        {/* ── Title Section ── */}
        <div className="mb-6">
          <h1 className="text-[28px] leading-[36px] font-bold text-white mb-2">
            Select your service
          </h1>
          <p className="text-base text-[#c4c9b1]">What do you need help with?</p>
        </div>

        {/* ── Service Bento Grid (3×3) ── */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => {
            const isActive = selected === service.id;
            return (
              <button
                key={service.id}
                onClick={() => handleCardClick(service.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 group h-32 ${
                  isActive
                    ? 'card-active'
                    : 'bg-[#1b1c1c] border border-transparent hover:border-brand-lime/30'
                }`}
              >
                <span
                  className="material-symbols-outlined text-brand-lime text-[40px] mb-3 group-hover:scale-110 transition-transform"
                  style={{
                    fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 40",
                  }}
                >
                  {service.icon}
                </span>
                <span className="text-xs font-medium text-center leading-tight text-[#e4e2e1] whitespace-pre-line">
                  {service.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* ── Bottom Action Button ── */}
      <footer
        className="fixed bottom-0 left-0 w-full z-50 px-5 py-4"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 16px)',
        }}
      >
        <button
          className="w-full h-14 bg-brand-lime rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform"
          onClick={() => navigate('/service-tracking', { state: { serviceId: selected } })}
        >
          <span className="text-sm font-bold tracking-wide text-black uppercase">
            CONTINUE TO LOCATION
          </span>
        </button>
      </footer>
    </div>
  );
}
