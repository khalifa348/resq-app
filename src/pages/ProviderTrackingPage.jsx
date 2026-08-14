import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Phone, Star, Timer, ChevronDown, ArrowRight, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

const SERVICE_META = {
  battery: { icon: 'battery_charging_full', label: 'Battery Repair' },
  tire: { icon: 'tire_repair', label: 'Tire Repair' },
  towing: { icon: 'rv_hookup', label: 'Towing Service' },
  fuel: { icon: 'local_gas_station', label: 'Fuel Delivery' },
  lockout: { icon: 'lock', label: 'Car Lockout' },
  'wont-start': { icon: 'car_crash', label: "Won't Start" },
  engine: { icon: 'build', label: 'Engine Trouble' },
  overheating: { icon: 'device_thermostat', label: 'Overheating' },
  other: { icon: 'more_horiz', label: 'Other Problem' },
};

export default function ProviderTrackingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceId = location.state?.serviceId || 'battery';
  const providerName = location.state?.providerName || 'Rashid Al Mansoori';
  const distance = location.state?.distance || '12 mins';
  const price = location.state?.price || '48.00';
  const serviceLabel = SERVICE_META[serviceId]?.label || 'Battery Repair';
  const passedUserPos = location.state?.userPos || null;
  const passedServicePos = location.state?.servicePos || null;

  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // ── Mapbox state ──
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!mapboxgl.accessToken) {
      setMapError('Missing Mapbox access token.');
      return;
    }

    // Helper: initialise map with given user + service positions
    const initMap = (userPos, servicePos) => {
      if (cancelled) return;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [userPos.lng, userPos.lat],
        zoom: 13,
      });

      map.on('load', () => {
        if (cancelled) return;
        mapRef.current = map;

        // ── User marker ──
        const userEl = document.createElement('div');
        userEl.style.cssText =
          'width:16px;height:16px;background:#4A90D9;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(74,144,217,0.6);';
        new mapboxgl.Marker({ element: userEl, anchor: 'center' })
          .setLngLat([userPos.lng, userPos.lat])
          .addTo(map);

        // ── Provider marker ──
        if (servicePos) {
          const svcEl = document.createElement('div');
          svcEl.style.cssText =
            'width:24px;height:24px;background:#84CC16;border-radius:50%;border:3px solid #121212;box-shadow:0 0 15px rgba(132,204,22,0.5);';
          new mapboxgl.Marker({ element: svcEl, anchor: 'center' })
            .setLngLat([servicePos.lng, servicePos.lat])
            .addTo(map);

          // ── Route line ──
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [userPos.lng, userPos.lat],
                  [servicePos.lng, servicePos.lat],
                ],
              },
            },
          });
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#84CC16',
              'line-width': 4,
              'line-opacity': 0.8,
            },
          });

          // Fit bounds to show both points
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([userPos.lng, userPos.lat]);
          bounds.extend([servicePos.lng, servicePos.lat]);
          map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
        }

        setMapReady(true);
      });
    };

    // If positions were passed from the previous screen, use them directly
    if (passedUserPos && passedServicePos) {
      initMap(passedUserPos, passedServicePos);
      return;
    }

    if (passedUserPos) {
      initMap(passedUserPos, null);
      return;
    }

    // Fallback: get current geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        initMap(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          null
        );
      },
      (err) => {
        if (cancelled) return;
        console.error('Geolocation error:', err);
        // Dubai fallback
        initMap({ lat: 25.2048, lng: 55.2708 }, null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      cancelled = true;
    };
  }, [passedUserPos, passedServicePos]);

  // ── Handlers ──
  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: send message to provider
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleRecenter = () => {
    if (!mapRef.current || !passedUserPos) return;
    mapRef.current.flyTo({
      center: [passedUserPos.lng, passedUserPos.lat],
      zoom: 15,
    });
  };

  const handleCallProvider = () => {
    navigate('/ringing-screen', { state: location.state });
  };

  return (
    <div className="iphone-screen animate-fadeIn" style={{ justifyContent: 'flex-start', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <header className="pt-12 px-6 pb-4 shrink-0">
        <div className="flex items-center mb-6">
          <button
            className="text-white hover:opacity-80 transition-opacity"
            onClick={() => navigate('/dashboard')}
            aria-label="Close"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Help is on the way!</h1>
        <p className="text-gray-400 text-sm">Your provider is heading to you.</p>
      </header>

      {/* ── Provider Card ── */}
      <section className="px-4 mb-4 shrink-0">
        <div className="bg-card-bg rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                alt="Provider"
                className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY3BaUjWs77IMGAk1UPttwgTjiUb9xYBVUUYc9hUxMEGDkWKBO4CBJ6m9hJUmb5AcQI37esDtqWybe1lcrp977cZRr-YKm4nS4v2mjxqxLmtIqEMQNKkr5OsMEIFsGnILUMCvwsK4hPLTAnPTDGX0geLVVWhJfouf4LjP4ghd2wirIXq_7TWOQeQZ4pv45E19rFtnGFiZZ5M8JixZbEgyv1hgN3FonOsim94KyJeVWtVowambkCWjbChNPz_TXAaOZPJfTyqJa_C0"
              />
            </div>
            <div>
              <h2 className="font-semibold text-base">{providerName}</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={14} className="text-brand-lime fill-brand-lime" />
                <span className="text-sm font-medium">
                  4.9 <span className="text-gray-500 font-normal">(128)</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Certified Technician</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-gray-500">Provider by</span>
                <img
                  alt="Company Logo"
                  className="h-6 w-auto object-contain"
                  src="/logo1.png"
                />
              </div>
            </div>
          </div>
          <button
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-brand-lime hover:bg-brand-lime/10 transition-colors"
            onClick={handleCallProvider}
            aria-label="Call provider"
          >
            <Phone size={20} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* ── Map View ── */}
      <section className="px-4 flex-1 mb-4 min-h-0">
        <div className="w-full h-full min-h-[300px] rounded-3xl relative overflow-hidden border border-white/5">
          {mapError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card-bg text-gray-400 gap-3 px-8">
              <svg className="h-10 w-10 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-gray-500 text-center">{mapError}</p>
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
          )}

          {/* ── Map Overlays ── */}
          {/* Destination Label */}
          <div className="absolute top-12 right-6 bg-card-bg/90 backdrop-blur-sm border border-brand-lime/30 p-2 rounded-xl text-[10px] pointer-events-none">
            <div className="font-bold">You</div>
            <div className="text-gray-300">Sheikh Zayed Road</div>
          </div>

          {/* Time Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card-bg/90 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-xl text-center pointer-events-none">
            <div className="text-brand-lime font-bold text-sm">12 mins</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest">away</div>
          </div>

          {/* Recenter Button */}
          {mapReady && (
            <button
              className="absolute bottom-4 right-4 w-10 h-10 bg-card-bg/80 backdrop-blur shadow-lg rounded-xl flex items-center justify-center border border-white/10 text-white hover:bg-card-bg transition-colors"
              onClick={handleRecenter}
              aria-label="Recenter map"
            >
              <Navigation size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </section>

      {/* ── Arrival Details Card ── */}
      <section className="px-4 mb-4 shrink-0">
        <div className="bg-card-bg rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-brand-lime">
                <Timer size={28} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Estimated arrival</p>
                <p className="text-brand-lime font-bold text-lg">{distance} away</p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
              onClick={() => setShowDetails(!showDetails)}
            >
              View Details
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-fadeIn">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Provider</span>
                <span className="text-white font-medium">{providerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vehicle</span>
                <span className="text-white font-medium">White Toyota Hilux</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">License Plate</span>
                <span className="text-white font-medium">A 12345</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Service</span>
                <span className="text-brand-lime font-medium">{serviceLabel}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Message Input ── */}
      <section className="px-4 mb-4 shrink-0">
        <label className="text-xs text-gray-500 font-medium ml-1 mb-2 block">
          Send a message
        </label>
        <div className="relative">
          <input
            className="w-full bg-card-bg border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:ring-1 focus:ring-brand-lime focus:border-brand-lime placeholder-gray-600 outline-none transition-colors"
            placeholder="Type your message..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-lime/10 rounded-xl flex items-center justify-center text-brand-lime hover:bg-brand-lime hover:text-black transition-all"
            onClick={handleSendMessage}
            aria-label="Send message"
          >
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* ── Bottom Actions ── */}
      <footer className="px-4 pb-2 shrink-0 space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex items-center justify-center gap-2 border border-white/20 rounded-2xl py-4 font-semibold text-white hover:bg-white/5 active:scale-95 transition-transform"
            onClick={handleCallProvider}
          >
            <Phone size={20} strokeWidth={2} />
            Call Provider
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-brand-lime rounded-2xl py-4 font-bold text-black hover:opacity-90 active:scale-95 transition-transform"
            onClick={() => navigate('/chat-screen', { state: location.state })}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Message
          </button>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 border border-brand-lime/30 text-brand-lime rounded-2xl py-3.5 font-semibold text-sm hover:bg-brand-lime/5 active:scale-95 transition-all"
          onClick={() => navigate('/service-complete', { state: location.state })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Service Complete (Demo)
        </button>
      </footer>
    </div>
  );
}
