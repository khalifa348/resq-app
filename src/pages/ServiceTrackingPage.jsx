import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

const PRICE_MAP = {
  battery: 48, tire: 35, towing: 120, fuel: 25, lockout: 55,
  'wont-start': 65, engine: 95, overheating: 70, other: 50,
};

export default function ServiceTrackingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceId = location.state?.serviceId || 'battery';
  const meta = SERVICE_META[serviceId] || SERVICE_META.battery;
  const price = PRICE_MAP[serviceId] || 48;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const serviceMarkerRef = useRef(null);

  const sliderContainerRef = useRef(null);
  const thumbRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [servicePos, setServicePos] = useState(null);
  const [distanceStr, setDistanceStr] = useState('--');
  const [providerName, setProviderName] = useState('Ahmed');

  const [isDragging, setIsDragging] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [maxDrag, setMaxDrag] = useState(0);
  const startXRef = useRef(0);

  // ── Init Mapbox Map ──
  useEffect(() => {
    let cancelled = false;

    if (!mapboxgl.accessToken) {
      setMapError('Missing Mapbox access token.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        const uPos = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserPos(uPos);

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [uPos.lng, uPos.lat],
          zoom: 13,
        });

        map.on('load', () => {
          if (cancelled) return;
          mapRef.current = map;

          // User marker
          const userEl = document.createElement('div');
          userEl.style.cssText =
            'width:16px;height:16px;background:#4A90D9;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(74,144,217,0.6);';
          userMarkerRef.current = new mapboxgl.Marker({ element: userEl, anchor: 'center' })
            .setLngLat([uPos.lng, uPos.lat])
            .addTo(map);

          // Search for nearby car repair
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/car_repair.json?country=AE&proximity=${uPos.lng},${uPos.lat}&limit=1&access_token=${mapboxgl.accessToken}`;

          fetch(url)
            .then((r) => r.json())
            .then((data) => {
              if (cancelled) return;
              if (data.features && data.features.length > 0) {
                const [sLng, sLat] = data.features[0].center;
                const sPos = { lat: sLat, lng: sLng };
                setServicePos(sPos);
                setProviderName(data.features[0].text || 'Ahmed');

                const distKm = haversineDistance(uPos.lat, uPos.lng, sLat, sLng);
                setDistanceStr(
                  distKm < 1 ? `${(distKm * 1000).toFixed(0)}m` : `${distKm.toFixed(1)} km`
                );

                // Service marker
                const svcEl = document.createElement('div');
                svcEl.style.cssText =
                  'width:24px;height:24px;background:#84CC16;border-radius:50%;border:3px solid #121212;box-shadow:0 0 15px rgba(132,204,22,0.5);';
                serviceMarkerRef.current = new mapboxgl.Marker({ element: svcEl, anchor: 'center' })
                  .setLngLat([sLng, sLat])
                  .addTo(map);

                // Route line
                map.addSource('route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: [[uPos.lng, uPos.lat], [sLng, sLat]],
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

                // Fit bounds
                const bounds = new mapboxgl.LngLatBounds();
                bounds.extend([uPos.lng, uPos.lat]);
                bounds.extend([sLng, sLat]);
                map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
              } else {
                // Fallback simulated point
                const sPos = { lat: uPos.lat + 0.015, lng: uPos.lng + 0.012 };
                setServicePos(sPos);
                const distKm = haversineDistance(uPos.lat, uPos.lng, sPos.lat, sPos.lng);
                setDistanceStr(
                  distKm < 1 ? `${(distKm * 1000).toFixed(0)}m` : `${distKm.toFixed(1)} km`
                );

                const svcEl = document.createElement('div');
                svcEl.style.cssText =
                  'width:24px;height:24px;background:#84CC16;border-radius:50%;border:3px solid #121212;box-shadow:0 0 15px rgba(132,204,22,0.5);';
                serviceMarkerRef.current = new mapboxgl.Marker({ element: svcEl, anchor: 'center' })
                  .setLngLat([sPos.lng, sPos.lat])
                  .addTo(map);

                map.addSource('route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: [[uPos.lng, uPos.lat], [sPos.lng, sPos.lat]],
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

                const bounds = new mapboxgl.LngLatBounds();
                bounds.extend([uPos.lng, uPos.lat]);
                bounds.extend([sPos.lng, sPos.lat]);
                map.fitBounds(bounds, { padding: 80, maxZoom: 14 });
              }
              setMapReady(true);
            })
            .catch(() => {
              if (cancelled) return;
              setMapError('Search failed.');
            });
        });
      },
      (err) => {
        if (cancelled) return;
        console.error('Geolocation error:', err);

        const fallbackPos = { lat: 25.2048, lng: 55.2708 };
        setUserPos(fallbackPos);

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [fallbackPos.lng, fallbackPos.lat],
          zoom: 13,
        });

        map.on('load', () => {
          if (cancelled) return;
          mapRef.current = map;

          const userEl = document.createElement('div');
          userEl.style.cssText =
            'width:16px;height:16px;background:#4A90D9;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(74,144,217,0.6);';
          userMarkerRef.current = new mapboxgl.Marker({ element: userEl, anchor: 'center' })
            .setLngLat([fallbackPos.lng, fallbackPos.lat])
            .addTo(map);

          const sPos = { lat: fallbackPos.lat + 0.015, lng: fallbackPos.lng + 0.012 };
          setServicePos(sPos);
          const distKm = haversineDistance(fallbackPos.lat, fallbackPos.lng, sPos.lat, sPos.lng);
          setDistanceStr(
            distKm < 1 ? `${(distKm * 1000).toFixed(0)}m` : `${distKm.toFixed(1)} km`
          );

          const svcEl = document.createElement('div');
          svcEl.style.cssText =
            'width:24px;height:24px;background:#84CC16;border-radius:50%;border:3px solid #121212;box-shadow:0 0 15px rgba(132,204,22,0.5);';
          serviceMarkerRef.current = new mapboxgl.Marker({ element: svcEl, anchor: 'center' })
            .setLngLat([sPos.lng, sPos.lat])
            .addTo(map);

          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[fallbackPos.lng, fallbackPos.lat], [sPos.lng, sPos.lat]],
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

          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([fallbackPos.lng, fallbackPos.lat]);
          bounds.extend([sPos.lng, sPos.lat]);
          map.fitBounds(bounds, { padding: 80, maxZoom: 14 });

          setMapReady(true);
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => { cancelled = true; };
  }, []);

  // ── Slider init ──
  const initSlider = useCallback(() => {
    const container = sliderContainerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;
    setMaxDrag(container.clientWidth - thumb.clientWidth - 8);
  }, []);

  useEffect(() => {
    initSlider();
    window.addEventListener('resize', initSlider);
    return () => window.removeEventListener('resize', initSlider);
  }, [initSlider]);

  const startDrag = useCallback(
    (e) => {
      if (isConfirmed) return;
      setIsDragging(true);
      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      startXRef.current = clientX - currentX;
    },
    [isConfirmed, currentX]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      if (isConfirmed) return;
      e.preventDefault();
      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      const rawX = clientX - startXRef.current;
      setCurrentX(Math.max(0, Math.min(rawX, maxDrag)));
    };
    const onEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, isConfirmed, maxDrag]);

  useEffect(() => {
    if (isDragging || maxDrag === 0) return;
    const progress = currentX / maxDrag;
    if (progress > 0.9 && !isConfirmed) {
      setIsConfirmed(true);
      setCurrentX(maxDrag);
    } else if (!isConfirmed && progress <= 0.9) {
      setCurrentX(0);
    }
  }, [isDragging, currentX, maxDrag, isConfirmed]);

  // Navigate to provider tracking after confirmation animation
  useEffect(() => {
    if (!isConfirmed) return;
    const timer = setTimeout(() => {
      navigate('/loading-screen', {
        state: {
          serviceId,
          providerName,
          distance: distanceStr,
          price: price.toFixed(2),
          userPos,
          servicePos,
        },
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [isConfirmed, navigate, serviceId, providerName, distanceStr, price, userPos, servicePos]);

  const fillWidth = isConfirmed ? '100%' : `${Math.min(currentX + 28, maxDrag + 28)}px`;
  const progress = currentX / (maxDrag || 1);
  const textOpacity = isConfirmed ? 1 : Math.max(0, 1 - progress * 1.5);

  return (
    <div className="iphone-screen animate-fadeIn" style={{ justifyContent: 'flex-start', overflow: 'hidden' }}>
      {/* ── TopAppBar ── */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 py-2 h-14"
        style={{ background: 'rgba(18,20,20,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#282a2b] transition-colors active:scale-95 text-[#e2e2e2]"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>arrow_back</span>
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#c5c9ac] hover:bg-[#282a2b] transition-colors active:scale-95"
          onClick={() => navigate('/dashboard')}
          aria-label="Close"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
        </button>
      </header>

      {/* ── Progress Stepper ── */}
      <div
        className="fixed top-[56px] left-0 w-full z-40 py-4 px-5"
        style={{ background: 'rgba(18,20,20,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-[#333535]" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center">
              <span className="material-symbols-outlined text-[#171e00] text-xl font-bold" style={{ fontVariationSettings: "'wght' 600" }}>check</span>
            </div>
            <span className="text-[12px] font-semibold tracking-[0.1em] text-brand-lime">Service</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center">
              <span className="material-symbols-outlined text-[#171e00] text-xl font-bold" style={{ fontVariationSettings: "'wght' 600" }}>check</span>
            </div>
            <span className="text-[12px] font-semibold tracking-[0.1em] text-brand-lime">Location</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center ring-4 ring-brand-lime/20">
              <span className="text-[#171e00] font-bold text-sm">3</span>
            </div>
            <span className="text-[12px] font-semibold tracking-[0.1em] text-brand-lime">Confirm</span>
          </div>
        </div>
      </div>

      {/* ── Mapbox Map Area ── */}
      <main className="flex-grow relative w-full pt-[88px]">
        {mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-400 gap-3 px-8">
            <svg className="h-12 w-12 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-gray-500 text-center">{mapError}</p>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
        )}

        {mapReady && (
          <div className="absolute right-5 bottom-[45%] flex flex-col gap-2 z-30">
            <button
              className="w-12 h-12 bg-[#1e2020]/90 backdrop-blur-md rounded-xl border border-white/5 flex items-center justify-center text-brand-lime hover:bg-[#282a2b] transition-colors"
              onClick={() => { if (mapRef.current && userPos) mapRef.current.flyTo({ center: [userPos.lng, userPos.lat], zoom: 15 }); }}
            >
              <span className="material-symbols-outlined">my_location</span>
            </button>
            <button
              className="w-12 h-12 bg-[#1e2020]/90 backdrop-blur-md rounded-xl border border-white/5 flex items-center justify-center text-brand-lime hover:bg-[#282a2b] transition-colors"
              onClick={() => { if (mapRef.current && servicePos) mapRef.current.flyTo({ center: [servicePos.lng, servicePos.lat], zoom: 15 }); }}
            >
              <span className="material-symbols-outlined">{meta.icon}</span>
            </button>
          </div>
        )}
      </main>

      {/* ── Bottom Sheet ── */}
      <div className="glass-sheet absolute bottom-0 left-0 w-full rounded-t-[32px] pt-4 pb-10 px-6 z-40 flex flex-col gap-6">
        <div className="w-12 h-1 bg-[#333535] rounded-full mx-auto mb-2" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-lime rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <span className="material-symbols-outlined text-[#171e00] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
          </div>
          <div>
            <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.01em] text-white">{meta.label}</h2>
            <p className="text-base text-[#c5c9ac] mt-0.5">with {providerName}</p>
          </div>
        </div>
        <div className="h-px w-full bg-white/5" />
        <div className="grid grid-cols-2 gap-4 items-center px-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c5c9ac] font-light text-2xl">route</span>
            <div className="flex flex-col">
              <span className="text-[24px] leading-[32px] font-semibold text-white mb-1">{distanceStr}</span>
              <span className="text-[12px] font-semibold tracking-[0.1em] text-[#c5c9ac]">Distance</span>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-start pl-4 border-l border-white/5">
            <span className="material-symbols-outlined text-[#c5c9ac] font-light text-2xl">sell</span>
            <div className="flex flex-col">
              <span className="text-[24px] leading-[32px] font-semibold text-white mb-1">${price.toFixed(2)}</span>
              <span className="text-[12px] font-semibold tracking-[0.1em] text-[#c5c9ac]">Estimated Price</span>
            </div>
          </div>
        </div>

        {/* ── Drag-to-Confirm Slider ── */}
        <div
          ref={sliderContainerRef}
          className={`slider-container mt-4 relative w-full h-16 slider-track rounded-full flex items-center overflow-hidden cursor-pointer select-none touch-none ${isDragging ? '' : 'snapping'} ${isConfirmed ? 'confirmed' : ''}`}
        >
          <div
            id="slider-fill"
            className={`absolute inset-y-0 left-0 pointer-events-none rounded-l-full ${isConfirmed ? 'bg-brand-lime' : 'bg-brand-lime/30'}`}
            style={{ width: fillWidth }}
          />
          <div className="absolute inset-0 flex items-center justify-center w-full pointer-events-none z-10">
            <span
              id="slider-text"
              className={`text-[16px] leading-[20px] font-semibold ml-12 transition-all duration-300 ${isConfirmed ? 'text-[#171e00]' : 'text-brand-lime'}`}
              style={{ opacity: textOpacity }}
            >
              {isConfirmed ? 'Booking Confirmed!' : 'Drag to confirm booking'}
            </span>
          </div>
          <div
            ref={thumbRef}
            id="slider-thumb"
            className={`slider-thumb absolute top-1 bottom-1 w-14 bg-brand-lime rounded-full flex items-center justify-center z-20 cursor-grab active:cursor-grabbing transition-transform duration-200 ${isConfirmed ? 'opacity-0' : ''}`}
            style={{ transform: `translateX(${isConfirmed ? maxDrag : currentX}px)`, transition: isDragging ? 'none' : undefined }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            <span className="material-symbols-outlined text-[#171e00] font-bold text-xl">chevron_right</span>
          </div>
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </div>
  );
}
