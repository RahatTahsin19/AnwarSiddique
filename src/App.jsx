import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  FileText, 
  Image as ImageIcon,
  Share2, 
  Facebook, 
  Twitter, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Clock,
  Calendar,
  Send,
  Sparkles,
  Bot,
  RefreshCcw
} from 'lucide-react';

const App = () => {
  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [activeNewsTab, setActiveNewsTab] = useState('সব');
  const [darkMode, setDarkMode] = useState(false);

  // Gemini API States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [message, setMessage] = useState('');

  // Dynamic features
  const [countdown, setCountdown] = useState({});
  const [stats, setStats] = useState([
    { label: 'শিক্ষার হার বৃদ্ধি', value: 85, suffix: '%', color: '#40864C', current: 0 },
    { label: 'নতুন রাস্তা (কিমি)', value: 120, suffix: '+', color: '#D3342D', current: 0 },
    { label: 'জনসেবা ইভেন্ট', value: 500, suffix: '+', color: '#0B3022', current: 0 },
    { label: 'কর্মসংস্থান', value: 10000, suffix: '', color: '#40864C', current: 0 }
  ]);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredTimerRef = useRef(null);

  const [galleryModal, setGalleryModal] = useState({ open: false, src: '' });

  // Use env or runtime for API key
  const apiKey = ""; // Gemini API Key (Runtime provides this)

  // থিম কালারস (dynamic via darkMode)
  const colors = {
    primary: darkMode ? '#07221a' : '#0B3022',
    secondary: '#D3342D',
    accent: '#40864C',
    highlight: '#FFF15B',
    textDark: darkMode ? '#e6f7ee' : '#1A1A1A',
    light: darkMode ? '#0b0b0b' : '#F4F4F4'
  };

  // Manifesto data (cleaned)
  const manifestoData = [
    { title: 'শিক্ষা ও প্রযুক্তি', desc: 'স্মার্ট ক্লাসরুম, ডিজিটাল ল্যাব ও সকল বিদ্যালয়ে ফ্রি ওয়াই-ফাই জোন।', icon: <FileText size={28} /> },
    { title: 'স্বাস্থ্যসেবা', desc: 'আধুনিক হাসপাতাল, ফ্রি স্বাস্থ্য কার্ড ও জরুরি সেবা সম্প্রসারণ।', icon: <CheckCircle2 size={28} /> },
    { title: 'অবকাঠামো', desc: 'নিরাপদ সড়ক, উন্নত ড্রেনেজ ও দূর্ণীতি-মুক্ত নির্মাণ মান নিশ্চিত করা।', icon: <MapPin size={28} /> },
    { title: 'তরুণ উন্নয়ন', desc: 'দক্ষতা বৃদ্ধির প্রশিক্ষণ, স্টার্টআপ সহায়তা ও সহজ শর্তে ঋণ প্রদান।', icon: <User size={28} /> }
  ];

  // News data (sample images + content)
  const newsData = [
    { id: 1, category: 'জনসভা', date: '২৪ জানুয়ারি, ২০২৬', title: 'বিশাল জনসভায় প্রার্থীর উন্নয়ন অঙ্গীকারে উজ্জ্বল প্রতিশ্রুতি', img: 'https://images.unsplash.com/photo-1520975681913-8f2b3a90a8a9?auto=format&fit=crop&q=80&w=1200' },
    { id: 2, category: 'প্রচারণা', date: '২২ জানুয়ারি, ২০২৬', title: 'বাড়ি বাড়ি গিয়ে ভোটারদের সাথে হৃদ্য আলাপ', img: 'https://images.unsplash.com/photo-1509099836639-18ba8a6aa4a3?auto=format&fit=crop&q=80&w=1200' },
    { id: 3, category: 'উন্নয়ন', date: '২০ জানুয়ারি, ২০২৬', title: 'নতুন পাঠাগার উদ্বোধন: শিশুদের জন্য মুক্ত পাঠ্যসামগ্রী', img: 'https://images.unsplash.com/photo-1526318472351-c75fcf070b8f?auto=format&fit=crop&q=80&w=1200' }
  ];

  const filteredNews = activeNewsTab === 'সব' ? newsData : newsData.filter(n => n.category === activeNewsTab);

  // SCROLL listener for header style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown target (example election date)
  useEffect(() => {
    const target = new Date('2026-01-31T00:00:00');
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hrs, mins, secs });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Animate stat counters (smooth)
  useEffect(() => {
    let rafId;
    const start = performance.now();
    const duration = 1800;
    const initial = stats.map(s => s.current);
    const animate = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setStats(prev => prev.map((s, i) => {
        const target = [85, 120, 500, 10000][i];
        const value = Math.floor(target * t);
        return { ...s, current: value };
      }));
      if (t < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Featured news auto-advance
  useEffect(() => {
    featuredTimerRef.current = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % filteredNews.length);
    }, 5000);
    return () => clearInterval(featuredTimerRef.current);
  }, [filteredNews.length]);

  // Prefill message when AI response arrives (if user hasn't edited)
  useEffect(() => {
    if (aiResponse && (!message || message.length < 20)) {
      setMessage(prev => prev && prev.length > 10 ? prev : aiResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiResponse]);

  // Gemini API Integration - AI Manifesto Assistant (with retries)
  const askGemini = async (query) => {
    if (!query) return;
    setAiLoading(true);
    setAiResponse('');
    setUserQuery(query);

    const systemPrompt = `You are an AI political assistant for a candidate running in Bangladesh in 2026. The manifesto focuses on:
1) Education & Tech (smart classrooms, WiFi)
2) Health (modern hospitals, health cards)
3) Infrastructure (safe roads, drainage)
4) Youth (skills training, startup support)
Respond in Bangla, polite and concise (3-4 sentences). If user mentions a local problem, suggest tangible manifesto actions.`;

    let retries = 0;
    const maxRetries = 4;

    const callApi = async () => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: query }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            // short responses
            temperature: 0.3,
            maxOutputTokens: 300
          })
        });

        if (!response.ok) {
          const txt = await response.text();
          throw new Error(`API error: ${response.status} ${txt}`);
        }
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setAiResponse(text.trim());
      } catch (error) {
        retries++;
        if (retries <= maxRetries) {
          const delay = Math.pow(2, retries) * 1000;
          setTimeout(callApi, delay);
        } else {
          setAiResponse("দুঃখিত, এই মুহূর্তে এআই সেবা পাওয়া যাচ্ছেনা। অনুগ্রহ করে কিছুক্ষণ পরে চেষ্টা করুন।");
        }
      } finally {
        setAiLoading(false);
      }
    };

    // If apiKey missing, short-circuit with sample response (useful for local dev)
    if (!apiKey) {
      setTimeout(() => {
        setAiResponse("আপনার এলাকায় সমস্যার জন্য প্রাথমিক সমাধান: রাস্তাঘাট পুনরুদ্ধার, স্থানীয় স্বাস্থ্যকেন্দ্র সক্রিয় করা এবং তরুণদের প্রশিক্ষণের ব্যবস্থা করা হবে। এটি দীর্ঘমেয়াদে কর্মসংস্থান ও স্থানীয় উন্নয়ন বৃদ্ধিতে সাহায্য করবে。);
        setAiLoading(false);
      }, 700);
      return;
    }

    callApi();
  };

  // Form handling
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('পাঠানো হচ্ছে...');
    // Simulate send
    setTimeout(() => {
      setFormStatus('ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি।');
      setMessage('');
      e.target.reset();
      setTimeout(() => setFormStatus(null), 4000);
    }, 1300);
  };

  // Accessibility helpers
  const openGallery = (src) => setGalleryModal({ open: true, src });
  const closeGallery = () => setGalleryModal({ open: false, src: '' });

  // Small utilities
  const formatNumber = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className={`font-sans ${darkMode ? 'bg-[#07120f] text-[#e8f6ee]' : 'bg-white text-[#0f1720]'} selection:bg-red-200 min-h-screen`}> 
      {/* NAV */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (darkMode ? 'bg-[#07120f]/95 backdrop-blur-md shadow-xl py-2' : 'bg-white/95 backdrop-blur-md shadow-xl py-2') : 'bg-transparent py-5'}`}> 
        <div className="container mx-auto px-6 flex justify-between items-center"> 
          <div className="flex items-center gap-3"> 
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform" style={{ backgroundColor: colors.secondary }}> 
              <span className="text-white font-bold text-2xl">প্র</span> 
            </div> 
            <div> 
              <p className={`font-bold text-xl leading-none ${scrolled ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-white'}`}>জনাব [প্রার্থীর নাম]</p> 
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${scrolled ? 'text-green-800' : 'text-yellow-300'}`}>দেশ ও জনগণের সেবক</p> 
            </div> 
          </div> 

          <div className="hidden md:flex items-center gap-8"> 
            {['পরিচিতি', 'ইশতেহার', 'নিউজ', 'গ্যালারি', 'যোগাযোগ'].map((item) => ( 
              <a key={item} href={`#${item}`} className={`font-bold text-sm uppercase tracking-wide transition-all hover:scale-110 ${scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white/90 hover:text-yellow-200'}`}> 
                {item} 
              </a> 
            ))} 
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-6 py-3 rounded-full font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition-all" style={{ backgroundColor: colors.secondary }}> 
              ভোট দিন 
            </button> 
          </div> 

          <div className="flex items-center gap-3"> 
            <button aria-label="Toggle theme" onClick={() => setDarkMode(d => !d)} className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-opacity-10 transition-all" style={{ borderColor: colors.accent }}> 
              {darkMode ? 'ডার্ক' : 'লাইট'} 
            </button> 

            <button className="md:hidden p-2 rounded-lg bg-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen}> 
              {isMenuOpen ? <X className={scrolled ? 'text-black' : 'text-white'} /> : <Menu className={scrolled ? 'text-black' : 'text-white'} />} 
            </button> 
          </div> 
        </div> 

        {/* Mobile menu */} 
        {isMenuOpen && ( 
          <div className="md:hidden bg-white/95 shadow-xl"> 
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4"> 
              {['পরিচিতি', 'ইশতেহার', 'নিউজ', 'গ্যালারি', 'যোগাযোগ'].map((item) => ( 
                <a key={item} href={`#${item}`} onClick={() => setIsMenuOpen(false)} className="font-bold text-lg"> 
                  {item} 
                </a> 
              ))} 
              <div className="flex gap-3 mt-2"> 
                <button onClick={() => setDarkMode(d => !d)} className="px-4 py-2 rounded-lg border">থিম টগল</button> 
                <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-4 py-2 rounded-lg bg-red-600 text-white">ভোট দিন</button> 
              </div> 
            </div> 
          </div> 
        )} 
      </nav> 

      {/* HERO */} 
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: colors.primary }}> 
        <div className="absolute inset-0 z-0"> 
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div> 
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div> 
        </div> 

        <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-16 items-center"> 
          <div className="text-white space-y-6"> 
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-inner" style={{ backgroundColor: 'rgba(255,241,91,0.12)', border: `1px solid rgba(255,241,91,0.25)` }}> 
              <Clock size={16} /> নির্বাচনী কাউন্টডাউন শুরু 
              <span className="ml-3 text-xs font-bold bg-white/10 px-3 py-1 rounded-full">{countdown.days ?? 0} দিন</span> 
            </div> 

            <h1 className="text-5xl md:text-7xl font-black leading-[1.02]"> 
              উন্নয়ন ও <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">সমৃদ্ধির</span> <br /> 
              নতুন দিগন্ত 
            </h1> 

            <p className="text-lg text-white/85 max-w-xl leading-relaxed border-l-4 pl-6" style={{ borderColor: colors.secondary }}> 
              আমরা কথায় নয়, কাজে বিশ্বাস করি — স্বচ্ছতা ও দ্রুত ব্যবস্থাপনার মাধ্যমে আপনার জীবনের মান উন্নয়ন করাই আমাদের প্রধান লক্ষ্য। 
            </p> 

            <div className="flex flex-col sm:flex-row gap-4 pt-4"> 
              <a href="#ইশতেহার" className="px-8 py-4 rounded-xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 group transition-all hover:-translate-y-1" style={{ backgroundColor: colors.accent }}> 
                ইশতেহার পড়ুন <ChevronRight className="group-hover:translate-x-1 transition-transform" /> 
              </a> 
              <button onClick={() => alert('স্লোগান: উন্নয়ন, স্বচ্ছতা, সুযোগ')} className="px-8 py-4 rounded-xl font-black text-lg border-2 border-white/20 hover:bg-white hover:text-green-900 transition-all text-white shadow-xl"> 
                স্লোগান দেখুন 
              </button> 
            </div> 

            <div className="flex gap-4 mt-4"> 
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg"> 
                <Sparkles size={16} /> AI জিজ্ঞাসা 
              </div> 
              <div className="text-sm bg-white/10 px-3 py-2 rounded-lg">থিম: {darkMode ? 'ডার্ক' : 'লাইট'}</div> 
            </div> 
          </div> 

          <div className="relative group"> 
            <div className="absolute -inset-10 bg-green-500/20 rounded-full blur-[100px] animate-pulse"></div> 
            <div className="relative z-10 border-[10px] border-white/10 rounded-[28px] shadow-2xl overflow-hidden aspect-[4/5] bg-neutral-800"> 
               <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=900" alt="Candidate" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" /> 
               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent"> 
                  <p className="text-yellow-400 font-bold text-lg mb-1">আপনার সেবায় নিয়োজিত</p> 
                  <h3 className="text-white text-2xl font-black">জনাব [প্রার্থীর নাম]</h3> 
               </div> 
            </div> 

            <div className="mt-6 flex gap-3.justify-center"> 
              {['রাস্তাঘাট', 'বেকারত্ব', 'চিকিৎসা', 'ওয়াইফাই'].map((tag, i) => ( 
                <button key={tag} onClick={() => { const q = `আমাদের এলাকায় ${tag} নিয়ে প্রার্থীর পরিকল্পনা কী?`; setUserQuery(q); askGemini(q); }} className="bg-white/90 text-green-900 px-3 py-2 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition"> 
                  #{tag} 
                </button> 
              ))} 
            </div> 
          </div> 
        </div> 
      </section> 

      {/* AI MANIFESTO ASSISTANT */} 
      <section className={`py-20 ${darkMode ? 'bg-[#04120f]' : 'bg-white'}`}> 
        <div className="container mx-auto px-6"> 
          <div className="max-w-4xl mx-auto rounded-[26px] p-6 md:p-10 border" style={{ backgroundColor: darkMode ? '#07221a' : '#f0fdf4', borderColor: '#dbe7d7' }}> 
            <div className="flex items-center justify-between mb-6"> 
              <div className="flex items-center gap-3"> 
                <div className="w-14 h-14 bg-green-900 rounded-3xl flex items-center justify-center text-white shadow"> 
                  <Bot size={34} /> 
                </div> 
                <div> 
                  <h3 className="text-2xl font-black">ইশতেহার জিজ্ঞাসু ✨</h3> 
                  <p className="text-sm text-green-800/80">আপনার এলাকার সমস্যা লিখুন, আমাদের AI ছোট করে actionable উত্তর দেবে।</p> 
                </div> 
              </div> 
              <div className="text-xs font-black uppercase tracking-wider text-green-800 flex items-center gap-2"> 
                <Sparkles /> এআই চালিত 
              </div> 
            </div> 

            <div className="grid md:grid-cols-3 gap-4 items-start"> 
              <div className="md:col-span-2"> 
                <div className="relative"> 
                  <input  
                    type="text" 
                    aria-label="AI query" 
                    value={userQuery} 
                    onChange={(e) => setUserQuery(e.target.value)} 
                    placeholder="যেমন: আমাদের এলাকায় রাস্তাঘাট খুব খারাপ..." 
                    className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-green-700 outline-none" 
                  /> 
                  <button  
                    onClick={() => askGemini(userQuery)} 
                    disabled={aiLoading} 
                    className="absolute right-2 top-2 bottom-2 px-4 bg-green-900 text-white rounded-xl hover:bg-green-800 transition-all flex items-center" 
                    aria-label="Send query" 
                  > 
                    {aiLoading ? <RefreshCcw className="animate-spin" /> : <Send size={18} />} 
                  </button> 
                </div> 

                {aiResponse && ( 
                  <div className="mt-4 p-4 rounded-xl border bg-white shadow-sm"> 
                    <p className="text-gray-800 italic">"{aiResponse}"</p> 
                  </div> 
                )} 

                <div className="flex flex-wrap gap-3 mt-3"> 
                  {['রাস্তাঘাট', 'বেকারত্ব', 'চিকিৎসা', 'ওয়াইফাই'].map(tag => ( 
                    <button key={tag} onClick={() => { const q = `আমাদের এলাকায় ${tag} নিয়ে প্রার্থীর পরিকল্পনা কী?`; setUserQuery(q); askGemini(q); }} className="text-sm px-3 py-2 rounded-full border bg-white"> 
                      #{tag} 
                    </button> 
                  ))} 
                </div> 
              </div> 

              <div className="md:col-span-1"> 
                <div className="text-sm"> 
                  <p className="font-bold mb-2">কাউন্টডাউন</p> 
                  <div className="grid grid-cols-2 gap-2"> 
                    <div className="bg-white p-3 rounded-lg text-center"> 
                      <div className="text-2xl font-black">{countdown.days}</div> 
                      <div className="text-xs">দিন</div> 
                    </div> 
                    <div className="bg-white p-3 rounded-lg text-center"> 
                      <div className="text-2xl font-black">{String(countdown.hrs).padStart(2,'0')}</div> 
                      <div className="text-xs">ঘণ্টা</div> 
                    </div> 
                    <div className="bg-white p-3 rounded-lg text-center"> 
                      <div className="text-2xl font-black">{String(countdown.mins).padStart(2,'0')}</div> 
                      <div className="text-xs">মিনিট</div> 
                    </div> 
                    <div className="bg-white p-3 rounded-lg text-center"> 
                      <div className="text-2xl font-black">{String(countdown.secs).padStart(2,'0')}</div> 
                      <div className="text-xs">সেকেন্ড</div> 
                    </div> 
                  </div> 
                </div> 
              </div> 
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow hover:-translate-y-2 transition-transform" style={{ borderBottom: `4px solid ${stat.color}` }}>
              <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>
                {stat.suffix === '%' ? `${stat.current}${stat.suffix}` : (stat.current >= 1000 ? `${formatNumber(stat.current)}${stat.suffix}` : `${stat.current}${stat.suffix}`)}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* manifesto */}
      <section id="ইশতেহার" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div className="max-w-2xl">
              <span className="font-black text-red-600 uppercase tracking-widest text-sm">আমাদের লক্ষ্য</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2 leading-tight">পরিবর্তন আসবেই, আমরা পথ দেখাবো</h2>
            </div>
            <p className="text-gray-500 max-w-sm text-sm">আমাদের প্রতিটি অঙ্গীকার বাস্তবসম্মত ও ফলাফলভিত্তিক — পরিকল্পনা ও বাস্তবায়ন দুটোই গুরুত্বপূর্ণ।</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {manifestoData.map((item, idx) => (
              <div key={idx} className="group p-6 rounded-2xl border hover:border-green-800 transition-all hover:bg-green-50/50">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: colors.primary }}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="নিউজ" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-4">সর্বশেষ নিউজ ও ইভেন্ট</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['সব', 'জনসভা', 'প্রচারণা', 'উন্নয়ন'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveNewsTab(tab)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeNewsTab === tab ? 'bg-green-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredNews.map((news, i) => (
              <article key={news.id} className={`group bg-white rounded-2xl overflow-hidden shadow transition-all ${featuredIndex === i ? 'scale-105 shadow-2xl' : ''}`}> 
                <div className="relative h-56 overflow-hidden"> 
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> 
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: colors.secondary }}> 
                    {news.category} 
                  </div> 
                </div> 
                <div className="p-4"> 
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-2"> 
                    <Calendar size={14} /> {news.date} 
                  </div> 
                  <h3 className="text-lg font-bold mb-2">{news.title}</h3> 
                  <div className="flex items-center gap-2"> 
                    <button onClick={() => openGallery(news.img)} className="text-sm text-green-800 font-bold">ছবি দেখুন</button> 
                    <button className="text-sm text-red-600 font-bold">বিস্তারিত জানুন</button> 
                  </div> 
                </div> 
              </article> 
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="যোগাযোগ" className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-green-950 rounded-[30px] p-6 md:p-10 text-white relative overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-6 relative z-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black mb-4">আপনার পরামর্শ আমাদের শক্তি</h2>
                <p className="text-white/80 mb-6">অত্র এলাকার সুষম উন্নয়নে আপনার যেকোনো সুচিন্তিত মতামত আমাদের কাজে সহায়তা করবে।</p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center"><Phone /></div>
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">সরাসরি কল</p>
                      <p className="text-xl font-bold">+৮৮০ ১৭০০-০০০০০</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center"><Mail /></div>
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">ইমেইল</p>
                      <p className="text-xl font-bold">vision2026@candidate.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400 font-bold uppercase w-full">এআই দিয়ে মেসেজ লিখুন ✨</span>
                    {['শিক্ষা উন্নয়ন', 'স্বাস্থ্য সেবা', 'বেকারত্ব সমস্যা'].map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => {
                          const query = `${t} নিয়ে একটি ভদ্র ও প্রস্তাবনামূলক বাংলা বার্তা লিখুন, পলিটিক্যাল ক্যান্ডিডেটকে উদ্দেশ্য করে.`;
                          askGemini(query);
                        }}
                        className="text-[12px] font-black uppercase tracking-tighter bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-all"
                      >
                        {t} ✨
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[12px] font-bold uppercase mb-2">আপনার পূর্ণ নাম</label>
                    <input required type="text" className="w-full bg-gray-50 border rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-green-800 outline-none" />
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[12px] font-bold uppercase mb-2">বার্তার বিষয়</label>
                    <textarea 
                      required 
                      rows="5" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 border rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-green-800 outline-none" 
                      placeholder="আপনার কথা লিখুন..."
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow">
                    বার্তা পাঠান <Send size={16} />
                  </button>

                  {formStatus && <p className="text-center text-green-800 font-bold text-sm mt-2">{formStatus}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY MODAL */}
      {galleryModal.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-6" onClick={closeGallery} role="dialog" aria-modal="true"> 
          <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full" onClick={(e) => e.stopPropagation()}> 
            <div className="p-2 flex justify-end"> 
              <button onClick={closeGallery} className="px-3 py-1">বন্ধ করুন</button> 
            </div> 
            <img src={galleryModal.src} alt="Gallery" className="w-full h-96 object-cover" /> 
          </div> 
        </div> 
      )} 

      {/* FOOTER */} 
      <footer className="py-12" style={{ backgroundColor: darkMode ? '#000' : '#000' }}> 
        <div className="container mx-auto px-6 text-center text-white"> 
          <div className="flex items-center gap-3 justify-center mb-6"> 
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">প্র</div> 
            <span className="text-2xl font-black">জনাব [প্রার্থীর নাম]</span> 
          </div> 

          <div className="flex gap-4 justify-center mb-6"> 
            {[Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"> 
                <Icon size={16} /> 
              </a> 
            ))}
          </div> 

          <p className="text-white/60 text-sm font-bold tracking-widest">&copy; ২০২৬ সকল স্বত্ব সংরক্ষিত | আপনার নির্বাচনী সল্যুশন পার্টনার</p> 
        </div> 
      </footer> 
    </div> 
  );
};

export default App;