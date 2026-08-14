import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, ChevronDown, Plus, ArrowRight, ShieldCheck, CheckCheck } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'date',
    text: 'Today, 9:30 AM',
  },
  {
    id: 2,
    type: 'system',
    text: 'Messages are secured and end-to-end encrypted.',
  },
  {
    id: 3,
    from: 'user',
    text: "Hi Rashid, I need help with my car. It's not starting.",
    time: '9:30 AM',
    read: true,
  },
  {
    id: 4,
    from: 'provider',
    text: "Hello! I'm on my way and will be there in about 12 minutes.",
    time: '9:31 AM',
  },
  {
    id: 5,
    from: 'user',
    text: 'Great, thank you!',
    time: '9:31 AM',
    read: true,
  },
  {
    id: 6,
    from: 'provider',
    text: "You're welcome. See you soon!",
    time: '9:31 AM',
  },
];

export default function ChatScreenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const providerName = location.state?.providerName || 'Rashid Al Mansoori';

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'user',
      text: input.trim(),
      time: getTime(),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div
      className="iphone-screen animate-fadeIn"
      style={{ justifyContent: 'flex-start', background: '#121413' }}
    >
      {/* ── Status Bar ── */}
      <header className="flex justify-between items-center px-8 pt-4 pb-2 shrink-0">
        <div className="font-semibold text-sm">9:41</div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21l-12-18h24z" />
          </svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M0 20h24v-4h-24z" />
          </svg>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
      </header>

      {/* ── Navigation Header ── */}
      <nav className="flex items-center px-4 py-3 shrink-0">
        <button
          className="p-2 mr-2"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ArrowLeft size={24} strokeWidth={2} className="text-white" />
        </button>
        <div className="flex items-center flex-grow">
          <img
            alt={providerName}
            className="w-10 h-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV2KyEhd34hTjzSSjWLMSl-j01Jxds196OO74AuxdeXGyMOxWtYloDkfro8tpQ3gNmF8sRNFKArKtj51plEl0cRe6lHa5v3baia3pkoiPAyrT26DIAYlZW69Dsj-5pouZn4JesKyDunigYkZPWW2ZDVXtCdT3Co0Q6IWFUtIjBVW107SER4L9Pi7t2ZOIGTFA_pU9d_-2-GWFzlxRPAE8cnhbOc526Dy3QsaaogJdQktVlj-7dFzgU1hUiBd9bve4_qfYJxYHNsXY"
          />
          <div className="ml-3">
            <h1 className="text-base font-bold leading-tight">{providerName}</h1>
            <p className="text-xs text-gray-400">Certified Technician</p>
          </div>
        </div>
        <button
          className="p-2 border border-gray-700 rounded-full"
          onClick={() => navigate('/ringing-screen', { state: location.state })}
          aria-label="Call"
        >
          <Phone size={20} strokeWidth={2} className="text-brand-lime" />
        </button>
      </nav>

      {/* ── Chat Messages ── */}
      <main
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-4 space-y-4 pt-4 pb-4"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {/* Location Banner */}
        <div className="bg-[#1a1c1b] rounded-2xl p-4 flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-card-bg p-2 rounded-xl mr-3">
              <MapPin size={24} strokeWidth={2} className="text-brand-lime" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Your location</p>
              <p className="text-sm font-medium">Sheikh Zayed Road</p>
            </div>
          </div>
          <button className="flex items-center text-xs bg-[#1E1E1E] px-3 py-2 rounded-lg text-gray-300">
            View Details
            <ChevronDown size={16} strokeWidth={2} className="ml-1" />
          </button>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          if (msg.type === 'date') {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-[11px] text-gray-500 font-medium">{msg.text}</span>
              </div>
            );
          }
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-[#1E1E1E] rounded-xl px-4 py-3 max-w-[80%] flex items-start">
                  <ShieldCheck size={20} strokeWidth={2} className="text-brand-lime mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-[11px] text-gray-400 leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          }

          const isUser = msg.from === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isUser
                    ? 'bg-brand-lime text-black rounded-br-none'
                    : 'bg-[#1E1E1E] text-white rounded-bl-none'
                }`}
              >
                <p className={`text-sm ${isUser ? 'font-medium' : ''}`}>{msg.text}</p>
                <div className={`flex justify-end mt-1 ${isUser ? 'items-center space-x-1' : ''}`}>
                  <span className={`text-[10px] ${isUser ? 'opacity-60' : 'text-gray-500'}`}>
                    {msg.time}
                  </span>
                  {isUser && msg.read && (
                    <CheckCheck size={12} className="text-black opacity-60" strokeWidth={2} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ── Message Input ── */}
      <footer className="shrink-0 bg-[#121413]/95 backdrop-blur-md p-4">
        <div className="flex items-center bg-[#1a1c1b] rounded-full p-1 pl-4 pr-1">
          <button className="p-2" aria-label="Add Media">
            <Plus size={24} strokeWidth={2} className="text-brand-lime" />
          </button>
          <input
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-3 text-gray-300 placeholder-gray-500 outline-none"
            placeholder="Type your message..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-[#1E1E1E] p-3 rounded-full text-brand-lime"
            onClick={handleSend}
            aria-label="Send"
          >
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        </div>
      </footer>
    </div>
  );
}
