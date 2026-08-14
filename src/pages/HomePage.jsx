import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { COLORS, getIconSvg, getIconInnerHtml } from '../data/providerIcons';

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

const MOCK_PROVIDERS = [
  {
    id: 'p1', name: 'Dubai Auto Care', vicinity: 'Sheikh Zayed Road, Dubai',
    lat: 25.2140, lng: 55.2730,
    rating: 4.8, reviewCount: 342,
    phone: '+971 50 123 4567',
    services: ['Battery Repair', 'Tire Repair', 'Engine Trouble', 'Towing Service'],
    icon: 'battery', hours: 'Open 24 hours',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop',
  },
  {
    id: 'p2', name: 'QuickFix Garage', vicinity: 'Al Barsha 1, Dubai',
    lat: 25.1020, lng: 55.2000,
    rating: 4.6, reviewCount: 218,
    phone: '+971 55 987 6543',
    services: ['Fuel Delivery', 'Car Lockout', "Won't Start", 'Overheating'],
    icon: 'fuel', hours: '6 AM - 12 AM',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=300&fit=crop',
  },
  {
    id: 'p3', name: 'Premier Motors', vicinity: 'Business Bay, Dubai',
    lat: 25.1860, lng: 55.2580,
    rating: 4.9, reviewCount: 520,
    phone: '+971 52 111 2233',
    services: ['Tire Repair', 'Towing Service', 'Battery Repair', 'Engine Trouble'],
    icon: 'tire', hours: 'Open 24 hours',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
  },
  {
    id: 'p4', name: 'Desert Star Tyres', vicinity: 'Al Quoz Industrial 3, Dubai',
    lat: 25.1380, lng: 55.2280,
    rating: 4.5, reviewCount: 189,
    phone: '+971 56 444 5566',
    services: ['Tire Repair', 'Towing Service', 'Overheating', 'Fuel Delivery'],
    icon: 'tire', hours: '7 AM - 10 PM',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
  },
  {
    id: 'p5', name: 'Royal Auto Service', vicinity: 'Jumeirah Lake Towers, Dubai',
    lat: 25.0780, lng: 55.1450,
    rating: 4.7, reviewCount: 405,
    phone: '+971 50 777 8899',
    services: ['Battery Repair', 'Car Lockout', "Won't Start", 'Fuel Delivery'],
    icon: 'lockout', hours: 'Open 24 hours',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  },
  {
    id: 'p6', name: 'SpeedFix Center', vicinity: 'Deira, Dubai',
    lat: 25.2720, lng: 55.3200,
    rating: 4.4, reviewCount: 156,
    phone: '+971 55 333 2211',
    services: ['Towing Service', 'Engine Trouble', 'Overheating', 'Battery Repair'],
    icon: 'towing', hours: '6 AM - 11 PM',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
  },
  {
    id: 'p7', name: 'Al Futtaim Auto', vicinity: 'Dubai Festival City, Dubai',
    lat: 25.2260, lng: 55.3400,
    rating: 4.8, reviewCount: 630,
    phone: '+971 52 666 7788',
    services: ['Engine Trouble', "Won't Start", 'Battery Repair', 'Tire Repair'],
    icon: 'engine', hours: 'Open 24 hours',
    image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&h=300&fit=crop',
  },
  {
    id: 'p8', name: 'Green Garage UAE', vicinity: 'Al Nahda, Dubai',
    lat: 25.2850, lng: 55.3750,
    rating: 4.3, reviewCount: 97,
    phone: '+971 56 999 0011',
    services: ['Overheating', 'Fuel Delivery', 'Car Lockout', 'Tire Repair'],
    icon: 'overheating', hours: '8 AM - 8 PM',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
  },
];

const FALLBACK_POS = { lat: 25.2048, lng: 55.2708 };

function buildMockPlaces(location) {
  return MOCK_PROVIDERS.map((p) => {
    const distKm = haversineDistance(location.lat, location.lng, p.lat, p.lng);
    const dist = distKm < 1 ? `${(distKm * 1000).toFixed(0)}m` : `${distKm.toFixed(1)} km`;
    return {
      feature: { text: p.name, place_name: p.vicinity },
      marker: null,
      distance: dist,
      distKm,
      lat: p.lat,
      lng: p.lng,
      provider: p,
    };
  });
}

export default function HomePage() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [geoError, setGeoError] = useState(null);
  const [mapLoadError, setMapLoadError] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [usingMock, setUsingMock] = useState(false);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const selectMarker = useCallback((place) => {
    const provider = place.provider || null;
    setSelectedPlace({
      name: place.feature.text || place.feature.place_name,
      distance: place.distance,
      distKm: place.distKm || 0,
      lat: place.lat,
      lng: place.lng,
      vicinity: place.feature.place_name,
      provider,
    });
  }, []);
  const createMarker = useCallback(
    (place, map) => {
      const p = place.provider || {};
      const iconType = p.icon || 'default';
      const color = COLORS[iconType] || COLORS.default;

      const el = document.createElement('div');
      el.style.cssText =
        `width:24px;height:24px;background:${color};border-radius:50%;border:3px solid #121212;cursor:pointer;box-shadow:0 0 12px ${color}66;touch-action:none;pointer-events:auto;`;
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.3)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([place.lng, place.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        selectMarker(place);
      }, true); // capture phase – intercepts before Mapbox internal handlers

      return marker;
    },
    [selectMarker]
  );
  const searchNearbyPlaces = useCallback(
    (location) => {
      if (!mapRef.current) return;
      setLoadingPlaces(true);
      clearMarkers();
      setSelectedPlace(null);
      setUsingMock(false);

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/car_repair.json?country=AE&proximity=${location.lng},${location.lat}&limit=8&access_token=${mapboxgl.accessToken}`;

      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          if (!data.features || data.features.length === 0) {
            // Fall back to mock providers
            const mockPlaces = buildMockPlaces(location);
            const bounds = new mapboxgl.LngLatBounds();
            mockPlaces.forEach((p) => {
              p.marker = createMarker(p, mapRef.current);
              bounds.extend([p.lng, p.lat]);
            });
            markersRef.current = mockPlaces.map((m) => m.marker);
            setPlaces(mockPlaces);
            setUsingMock(true);
            bounds.extend([location.lng, location.lat]);
            setLoadingPlaces(false);
            return;
          }

          const bounds = new mapboxgl.LngLatBounds();
          const mapped = data.features.map((feature) => {
            const [lng, lat] = feature.center;
            const distKm = haversineDistance(location.lat, location.lng, lat, lng);
            const dist =
              distKm < 1 ? `${(distKm * 1000).toFixed(0)}m` : `${distKm.toFixed(1)} km`;

            const place = { feature, marker: null, distance: dist, distKm, lat, lng, provider: null };
            place.marker = createMarker(place, mapRef.current);
            bounds.extend([lng, lat]);
            return place;
          });

          markersRef.current = mapped.map((m) => m.marker);
          setPlaces(mapped);

          if (mapped.length > 0) {
            bounds.extend([location.lng, location.lat]);
          }
          setLoadingPlaces(false);
        })
        .catch(() => {
          // Fall back to mock providers on error
          const mockPlaces = buildMockPlaces(location);
          const bounds = new mapboxgl.LngLatBounds();
          mockPlaces.forEach((p) => {
            p.marker = createMarker(p, mapRef.current);
            bounds.extend([p.lng, p.lat]);
          });
          markersRef.current = mockPlaces.map((m) => m.marker);
          setPlaces(mockPlaces);
          setUsingMock(true);
          setGeoError('Using demo data (API unavailable).');
          bounds.extend([location.lng, location.lat]);
          setLoadingPlaces(false);
        });
    },
    [clearMarkers, createMarker]
  );

  useEffect(() => {
    let cancelled = false;

    if (!mapboxgl.accessToken) {
      // No token - show mock data without map
      const mockPlaces = buildMockPlaces(FALLBACK_POS);
      setPlaces(mockPlaces);
      setUserLocation(FALLBACK_POS);
      setUsingMock(true);
      setLoadingPlaces(false);
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);

          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [userPos.lng, userPos.lat],
            zoom: 13,
          });

          map.addControl(new mapboxgl.NavigationControl(), 'top-right');

          map.on('load', () => {
            if (cancelled) return;
            mapRef.current = map;

            const userEl = document.createElement('div');
            userEl.style.cssText =
              'width:16px;height:16px;background:#4A90D9;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(74,144,217,0.6);';

            userMarkerRef.current = new mapboxgl.Marker({ element: userEl, anchor: 'center' })
              .setLngLat([userPos.lng, userPos.lat])
              .addTo(map);

            setMapReady(true);
            searchNearbyPlaces(userPos);
          });
        },
        (err) => {
          if (cancelled) return;
          console.error('Geolocation error:', err);
          setGeoError('Unable to get your location. Using demo location.');

          setUserLocation(FALLBACK_POS);

          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [FALLBACK_POS.lng, FALLBACK_POS.lat],
            zoom: 13,
          });

          map.on('load', () => {
            if (cancelled) return;
            mapRef.current = map;

            const userEl = document.createElement('div');
            userEl.style.cssText =
              'width:16px;height:16px;background:#4A90D9;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(74,144,217,0.6);';

            userMarkerRef.current = new mapboxgl.Marker({ element: userEl, anchor: 'center' })
              .setLngLat([FALLBACK_POS.lng, FALLBACK_POS.lat])
              .addTo(map);

            setMapReady(true);
            searchNearbyPlaces(FALLBACK_POS);
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } catch (err) {
      if (cancelled) return;
      console.error('Map init error:', err);

      // Fall back to mock data
      const mockPlaces = buildMockPlaces(FALLBACK_POS);
      setPlaces(mockPlaces);
      setUserLocation(FALLBACK_POS);
      setUsingMock(true);
      setLoadingPlaces(false);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationSearch = useCallback(() => {
    if (!locationInput.trim() || !mapRef.current) return;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationInput)}.json?access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.features && data.features[0]) {
          const [lng, lat] = data.features[0].center;
          const newPos = { lat, lng };
          setUserLocation(newPos);
          mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([lng, lat]);
          }
          searchNearbyPlaces(newPos);
        }
      })
      .catch(() => {});
  }, [locationInput, searchNearbyPlaces]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleLocationSearch();
  };

  return (
    <div className="iphone-screen animate-fadeIn" style={{ justifyContent: 'flex-start' }}>
      {/* ── MainHeader ── */}
      <header className="flex justify-between items-center p-6 bg-[#121212] shrink-0">
        <button
          aria-label="Menu"
          className="w-12 h-12 rounded-full border border-gray-700 flex flex-col items-center justify-center gap-1.5"
        >
          <div className="w-6 h-0.5 bg-white" />
          <div className="w-6 h-0.5 bg-white" />
        </button>

        <button
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
          onClick={() => navigate('/profile-settings')}
          aria-label="Profile settings"
        >
          <img
            alt="Khalifa Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSv8HkyYkP-WphugJYP0YNjVOwVw-_8R-s6P9-clwcqBtSMZMIrbEDKsOGC5YxzVWL98GFisJPJtvFd7gWyQaMllQLWvWi-Cjgf6ut4a3TMR60tAwL803_IhDjc4A-Byh432epeh-1seRNLh2gH0lmOfcZ62bqgjGWRvV6eopBD6rEkvaak1YaKblY1ke0mkJlOgK0yZt-hwA-99xMv69sCwRGLmms-WrziJzEZgI8vrcBeei32tTdgHsserAcxyY1XGWpXuKoNz3J"
          />
        </button>
      </header>

      {/* ── GreetingAndControls ── */}
      <section className="px-6 pt-4 pb-6 bg-[#121212] shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white leading-tight">
            Good Morning, <span className="text-brand-lime font-bold">Khalifa</span>
          </h1>
          <p className="text-4xl font-semibold text-white">How can help you?</p>
        </div>

        <div className="relative mb-4">
          <input
            className="w-full bg-transparent border border-gray-700 rounded-2xl py-4 px-6 text-white placeholder-gray-400 focus:ring-1 focus:ring-brand-lime outline-none"
            placeholder="What's your location"
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-lime"
            onClick={handleLocationSearch}
            aria-label="Search location"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <button
          className="w-full bg-brand-lime text-black font-bold py-4 rounded-3xl text-lg hover:brightness-110 transition-all shadow-lg"
          onClick={() => navigate('/select-service')}
        >
          Get Help Now
        </button>
            </section>
            {/* ── MapSection / ListSection ── */}
            {viewMode === 'map' ? (
              <section className="flex-1 relative" style={{ minHeight: '300px' }}>
          <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 flex justify-between items-center bg-[#121212]/80 backdrop-blur-sm">
            <h2 className="text-xl font-medium text-white">
              {mapLoadError ? 'Demo Map' : 'Nearest service point'}
            </h2>
            {loadingPlaces && <span className="text-brand-lime text-xs animate-pulse">Searching...</span>}
            {mapLoadError && !loadingPlaces && (
              <span className="text-red-400 text-xs max-w-[160px] text-right leading-tight">{mapLoadError}</span>
            )}
            {geoError && !mapLoadError && !loadingPlaces && (
              <span className="text-yellow-400 text-xs max-w-[140px] text-right leading-tight">{geoError}</span>
            )}
          </div>

          {mapLoadError ? (
            <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-400 gap-3">
              <svg className="h-12 w-12 text-brand-lime/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <p className="text-sm text-gray-500 text-center px-8">{mapLoadError}</p>
              {places.length > 0 && (
                <p className="text-xs text-brand-lime/70">Showing {places.length} demo providers below</p>
              )}
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full absolute inset-0" style={{ minHeight: '300px' }} />
          )}

          {/* Active Info Panel */}
          {selectedPlace && (() => {
            const p = selectedPlace.provider;
            const iconType = p?.icon || 'default';
            const color = COLORS[iconType] || COLORS.default;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#1C1C1C]/98 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-white/10 animate-fadeIn overflow-hidden" style={{ maxHeight: '70%' }}>
      <button
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
        onClick={() => setSelectedPlace(null)}
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Shop image */}
      {p?.image && (
        <div className="w-full h-36 overflow-hidden">
          <img src={p.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: `${color}22`, border: `2px solid ${color}44` }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: getIconInnerHtml(iconType) }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight">{selectedPlace.name}</h3>
            {p?.rating && (
              <div className="flex items-center gap-1.5 mt-1">
                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-400 font-semibold text-sm">{p.rating}</span>
                {p.reviewCount && (
                  <span className="text-gray-400 text-xs">({p.reviewCount} reviews)</span>
                )}
              </div>
            )}
            {p?.hours && (
              <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/40">
                {p.hours}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="truncate">{selectedPlace.vicinity || 'Location'}</span>
          <span className="text-brand-lime font-semibold ml-auto shrink-0">{selectedPlace.distance}</span>
        </div>

        {p?.services && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.services.map((svc, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">{svc}</span>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-6 flex gap-3">
        <button
          className="flex-1 bg-brand-lime text-black font-bold py-3.5 rounded-2xl text-sm hover:brightness-110 transition-all shadow-lg"
          onClick={() => {
            navigate('/service-tracking', {
              state: {
                serviceId: iconType === 'default' ? 'battery' : iconType,
                providerName: selectedPlace.name,
                userPos: userLocation,
                servicePos: { lat: selectedPlace.lat, lng: selectedPlace.lng },
                distance: selectedPlace.distance,
              },
            });
          }}
        >
          Book Now
        </button>
        <a
          href={`tel:${(p?.phone || '').replace(/\s/g, '')}`}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shrink-0"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
          </svg>
        </a>
      </div>
    </div>
  );
})()}
</section>
) : (
/* ── List View ── */
<section className="flex-1 overflow-y-auto px-6 py-4 bg-[#121212]">
<h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
  <svg className="h-5 w-5 text-brand-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
  Providers Near You
  {usingMock && <span className="text-yellow-400 text-xs font-normal ml-1">(Demo)</span>}
</h2>

{loadingPlaces ? (
  <div className="flex items-center justify-center py-20">
    <span className="text-brand-lime text-sm animate-pulse">Finding providers...</span>
  </div>
) : places.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
    <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
    <p className="text-sm">No providers found nearby</p>
    <p className="text-xs text-gray-600">Try searching a different location</p>
  </div>
) : (
  <div className="flex flex-col gap-3 pb-24">
    {places.map((place, idx) => {
      const p = place.provider;
      const name = place.feature?.text || 'Provider';
      const vicinity = place.feature?.place_name || '';
      const phone = p?.phone || '';
      const iconType = p?.icon || 'default';
      const color = COLORS[iconType] || COLORS.default;

      return (
        <div
          key={idx}
          className="bg-[#1C1C1C] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 active:scale-[0.985] transition-all cursor-pointer"
          onClick={() => selectMarker(place)}
        >
          {p?.image && (
            <div className="w-full h-28 overflow-hidden">
              <img src={p.image} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: `${color}22`, border: `2px solid ${color}44` }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: getIconInnerHtml(iconType) }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-sm truncate">{name}</h3>
                  {p?.rating && (
                    <span className="text-yellow-400 text-xs flex items-center gap-0.5 shrink-0">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {p.rating}
                    </span>
                  )}
                </div>
                <p className="text-brand-lime font-medium text-xs mt-0.5">{place.distance}</p>
                {vicinity && <p className="text-gray-500 text-xs truncate mt-0.5">{vicinity}</p>}
              </div>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-1.5 bg-brand-lime text-black font-semibold px-4 py-2 rounded-xl text-xs hover:brightness-110 transition-all shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                  </svg>
                  Call
                </a>
              )}
            </div>
            {p?.services && (
              <div className="flex flex-wrap gap-1 mt-3">
                {p.services.slice(0, 3).map((svc, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{svc}</span>
                ))}
                {p.services.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">+{p.services.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
)}
</section>
)}

      {/* ── BottomNavigation ── */}
      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center p-1.5 rounded-full border border-white/10 shadow-2xl bg-[#1A1A1A]/90 backdrop-blur-md">
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full transition-all text-white/70 hover:text-white hover:bg-brand-lime/10"
            onClick={() => navigate('/garages')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="text-sm font-medium">List</span>
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
              viewMode === 'map'
                ? 'bg-brand-lime text-black'
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => setViewMode('map')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 20l-5.447-2.724A2 2 0 013 15.483V5.517a2 2 0 011.553-1.943L9 2l6 3 5.447-2.724A2 2 0 0121 4.517v9.966a2 2 0 01-1.553 1.943L15 19l-6 1z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="text-sm font-bold">Map</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
