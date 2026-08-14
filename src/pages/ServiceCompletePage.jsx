import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  Star,
  Timer,
  ChevronDown,
  CreditCard,
  Download,
  Sparkles,
} from 'lucide-react';

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

const TIP_OPTIONS = [5, 10, 15, 20];

export default function ServiceCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceId = location.state?.serviceId || 'battery';
  const providerName = location.state?.providerName || 'Rashid Al Mansoori';
  const estimatedPrice = parseFloat(location.state?.price || '48.00');
  const finalPrice = parseFloat(location.state?.finalPrice) || estimatedPrice;
  const serviceLabel = SERVICE_META[serviceId]?.label || 'Battery Repair';

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalPrice = finalPrice + (selectedTip || 0) + (parseFloat(customTip) || 0);

  const handleSubmitRating = () => {
    if (rating === 0) return;
    setIsSubmitted(true);
    // TODO: send rating to backend
  };

  const handleDone = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ justifyContent: 'flex-start', background: '#121413' }}
    >
      {/* ── Header ── */}
      <header className="pt-12 px-6 pb-2 shrink-0 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Service Complete</h1>
        <button
          className="text-white hover:opacity-80 transition-opacity"
          onClick={() => navigate('/dashboard')}
          aria-label="Close"
        >
          <X size={24} strokeWidth={2} />
        </button>
      </header>

      <main className="flex-grow overflow-y-auto px-4 space-y-4 pb-6">
        {/* ── Success Banner ── */}
        <div className="flex flex-col items-center py-6 animate-slideUp delay-0">
          <div className="w-20 h-20 rounded-full bg-brand-lime/15 flex items-center justify-center mb-4">
            <CheckCircle2 size={48} strokeWidth={1.5} className="text-brand-lime" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">All Done!</h2>
          <p className="text-gray-400 text-sm">Your service has been completed.</p>
        </div>

        {/* ── Provider & Service Summary ── */}
        <div className="bg-card-bg rounded-2xl p-5 border border-white/5 animate-slideUp delay-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-brand-lime/10 rounded-xl flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-brand-lime text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {SERVICE_META[serviceId]?.icon || 'build'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">{serviceLabel}</h3>
              <p className="text-sm text-gray-400">with {providerName}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Provider</span>
              <span className="text-white font-medium">{providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle</span>
              <span className="text-white font-medium">White Toyota Hilux</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">License Plate</span>
              <span className="text-white font-medium">A 12345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Timer size={14} className="text-brand-lime" />
                24 min
              </span>
            </div>
          </div>
        </div>

        {/* ── Price Breakdown ── */}
        <div className="bg-card-bg rounded-2xl p-5 border border-white/5 animate-slideUp delay-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Payment Summary</h3>
            <CreditCard size={18} strokeWidth={1.5} className="text-brand-lime" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated price</span>
              <span className="text-gray-400">${estimatedPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-lime">
              <span className="flex items-center gap-1">
                <Sparkles size={14} strokeWidth={1.5} />
                Final price
              </span>
              <span className="font-semibold">${finalPrice.toFixed(2)}</span>
            </div>
            {selectedTip && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tip</span>
                <span className="text-white">${selectedTip.toFixed(2)}</span>
              </div>
            )}
            {customTip && parseFloat(customTip) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Custom tip</span>
                <span className="text-white">${parseFloat(customTip).toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 mt-2 border-t border-white/5 flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="font-bold text-brand-lime text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tip Section ── */}
        {!isSubmitted && (
          <div className="bg-card-bg rounded-2xl p-5 border border-white/5 animate-slideUp delay-300">
            <h3 className="font-semibold text-white mb-3">Add a Tip</h3>
            <p className="text-xs text-gray-500 mb-4">
              Thank {providerName} for great service
            </p>
            <div className="flex gap-2 mb-3">
              {TIP_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedTip === amount
                      ? 'bg-brand-lime text-black'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setSelectedTip(selectedTip === amount ? null : amount);
                    setCustomTip('');
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Custom amount"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none transition-colors"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                  setSelectedTip(null);
                }}
              />
              {customTip && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  USD
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Rating Section ── */}
        {!isSubmitted ? (
          <div className="bg-card-bg rounded-2xl p-5 border border-white/5 animate-slideUp delay-400">
            <h3 className="font-semibold text-white mb-1">Rate Your Experience</h3>
            <p className="text-xs text-gray-500 mb-4">
              How was your service with {providerName}?
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="transition-transform hover:scale-110 active:scale-95"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={36}
                    strokeWidth={1.5}
                    className={`transition-all ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick feedback chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {['Fast', 'Professional', 'Friendly', 'Affordable'].map((tag) => (
                <button
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:border-brand-lime hover:text-brand-lime transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                rating > 0
                  ? 'bg-brand-lime text-black hover:opacity-90 active:scale-95'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSubmitRating}
              disabled={rating === 0}
            >
              Submit Review
            </button>
          </div>
        ) : (
          /* ── Thank You Message ── */
          <div className="bg-card-bg rounded-2xl p-6 border border-brand-lime/20 animate-slideUp delay-0 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-lime/15 flex items-center justify-center mb-3">
              <Sparkles size={32} strokeWidth={1.5} className="text-brand-lime" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">Thank You!</h3>
            <p className="text-gray-400 text-sm">
              Your review helps other drivers find the best service providers.
            </p>
          </div>
        )}

        {/* ── Receipt Toggle ── */}
        <button
          className="w-full flex items-center justify-between bg-card-bg rounded-2xl p-4 border border-white/5 hover:bg-white/5 transition-colors animate-slideUp delay-500"
          onClick={() => setShowReceipt(!showReceipt)}
        >
          <div className="flex items-center gap-3">
            <Download size={20} strokeWidth={1.5} className="text-brand-lime" />
            <span className="text-sm font-medium text-white">View Receipt</span>
          </div>
          <ChevronDown
            size={18}
            strokeWidth={2}
            className={`text-gray-400 transition-transform duration-200 ${
              showReceipt ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showReceipt && (
          <div className="bg-card-bg rounded-2xl p-5 border border-white/5 animate-fadeIn space-y-3 text-sm">
            <h3 className="font-semibold text-white text-base mb-2">Receipt</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="text-white">{serviceLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Provider</span>
              <span className="text-white">{providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="text-white">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="text-white">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-white/5">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total Charged</span>
                <span className="text-brand-lime">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-xl flex items-center justify-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              <span className="text-gray-400 text-xs">Paid via •••• 4242</span>
            </div>
          </div>
        )}

        {/* ── Done Button ── */}
        <button
          className="w-full bg-brand-lime rounded-2xl py-4 font-bold text-black text-sm hover:opacity-90 active:scale-95 transition-all animate-slideUp delay-500"
          onClick={handleDone}
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}
