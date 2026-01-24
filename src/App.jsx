import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  FileText, 
  Newspaper, 
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [activeNewsTab, setActiveNewsTab] = useState('সব');
  
  // Gemini API States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [suggestionType, setSuggestionType] = useState('শিক্ষা');

  const apiKey = ""; // Gemini API Key (Runtime provides this)

  // কালার থিম
  const colors = {
    primary: '#0B3022',
    secondary: '#D3342D',
    accent: '#40864C',
    highlight: '#FFF15B',
    textDark: '#1A1A1A',
    light: '#F4F4F4'
  };

  const manifestoData = [
    { title: 'শিক্ষা ও প্রযুক্তি', desc: 'স্মার্ট ক্লাসরুম ও ফ্রি ওয়াই-ফাই জোন।', icon: <FileText size={32} /> },
    { title: 'স্বাস্থ্যসেবা', desc: 'আধুনিক হাসপাতাল ও ফ্রি হেলথ কার্ড।', icon: <CheckCircle2 size={32} /> },
    { title: 'অবকাঠামো', desc: 'নিরাপদ সড়ক ও উন্নত ড্রেনেজ সিস্টেম।', icon: <MapPin size={32} /> },
    { title: 'তরুণ উন্নয়ন', desc: 'দক্ষতা বৃদ্ধি ও সহজ শর্তে উদ্যোক্তা ঋণ।', icon: <User size={32} /> }
  ];

  const newsData = [
    { id: 1, category: 'জনসভা', date: '২৪ জানুয়ারি, ২০২৬', title: 'বিশাল জনসভায় প্রার্থীর উন্নয়ন পরিকল্পনা ঘোষণা', img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=400' },
    { id: 2, category: 'প্রচারণা', date: '২২ জানুয়ারি, ২০২৬', title: 'বাড়ি বাড়ি গিয়ে ভোটারদের সাথে মতবিনিময়', img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=400' },
    { id: 3, category: 'উন্নয়ন', date: '২০ জানুয়ারি, ২০২৬', title: 'নতুন পাঠাগার উদ্বোধনে শিক্ষা প্রসারের অঙ্গীকার', img: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&q=80&w=400' }
  ];

  const filteredNews = activeNewsTab === 'সব' ? newsData : newsData.filter(n => n.category === activeNewsTab);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gemini API Integration - AI Manifesto Assistant
  const askGemini = async (query) => {
    if (!query) return;
    setAiLoading(true);
    setAiResponse('');

    const systemPrompt = `You are an AI political assistant for a candidate named [Candidate Name] for the 2026 election in Bangladesh. 
    The candidate's manifesto covers: 1. Education & Tech (Smart classrooms, WiFi), 2. Health (Modern hospitals, Health cards), 3. Infrastructure (Safe roads, Drainage), 4. Youth Development (Skills training, Entrepreneur loans).
    Respond in Bangla. Be polite, visionary, and persuasive. If a user asks a problem, explain how these points will solve it. Keep response within 3-4 sentences.`;

    let retries = 0;
    const maxRetries = 5;

    const callApi = async () => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: query }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setAiResponse(text);
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          const delay = Math.pow(2, retries) * 1000;
          setTimeout(callApi, delay);
        } else {
          setAiResponse("দুঃখিত, এই মুহূর্তে এআই সংযোগ বিচ্ছিন্ন। দয়া করে পরে চেষ্টা করুন।");
        }
      } finally {
        setAiLoading(false);
      }
    };

    callApi();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('পাঠানো হচ্ছে...');
    setTimeout(() => {
      setFormStatus('ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি।');
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-red-200">
      {/* ১. নেভিগেশন বার */}
      <nav className={`fixed w-full z-[60] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl py-2' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform" style={{ backgroundColor: colors.secondary }}>
              <span className="text-white font-bold text-2xl">প্র</span>
            </div>
            <div>
              <p className={`font-bold text-xl leading-none ${scrolled ? 'text-gray-900' : 'text-white'}`}>প্রার্থীর নাম</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${scrolled ? 'text-green-800' : 'text-yellow-300'}`}>দেশ ও জনগণের সেবক</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['পরিচিতি', 'ইশতেহার', 'নিউজ', 'গ্যালারি', 'যোগাযোগ'].map((item) => (
              <a key={item} href={`#${item}`} className={`font-bold text-sm uppercase tracking-wide transition-all hover:scale-110 ${scrolled ? 'text-gray-700 hover:text-red-600' : 'text-white/90 hover:text-white'}`}>
                {item}
              </a>
            ))}
            <button className="px-8 py-3 rounded-full font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition-all" style={{ backgroundColor: colors.secondary }}>
              ভোট দিন
            </button>
          </div>

          <button className="md:hidden p-2 rounded-lg bg-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className={scrolled ? 'text-black' : 'text-white'} /> : <Menu className={scrolled ? 'text-black' : 'text-white'} />}
          </button>
        </div>
      </nav>

      {/* ২. হিরো সেকশন */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ backgroundColor: colors.primary }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm shadow-inner" style={{ backgroundColor: 'rgba(255,241,91,0.1)', border: `1px solid ${colors.highlight}`, color: colors.highlight }}>
              <Clock size={16} /> নির্বাচনী কাউন্টডাউন শুরু
            </div>
            <h1 className="text-5xl md:text-8xl font-black leading-[1.1]">
              উন্নয়ন ও <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">সমৃদ্ধির</span> <br /> 
              নতুন দিগন্ত
            </h1>
            <p className="text-xl text-white/80 max-w-xl leading-relaxed border-l-4 pl-6" style={{ borderColor: colors.secondary }}>
              আমরা কথার ফুলঝুরিতে নয়, কাজে বিশ্বাসী। আপনার একটি ভোট নিশ্চিত করবে আমাদের আগামী প্রজন্মের নিরাপদ ভবিষ্যৎ।
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button className="px-10 py-5 rounded-xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 group transition-all hover:-translate-y-1" style={{ backgroundColor: colors.secondary, color: 'white' }}>
                ইশতেহার পড়ুন <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 rounded-xl font-black text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white hover:text-green-900 transition-all text-white shadow-xl">
                স্লোগান দেখুন
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-10 bg-green-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="relative z-10 border-[12px] border-white/10 rounded-[40px] shadow-2xl overflow-hidden aspect-[4/5] bg-neutral-800">
               <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" alt="Candidate" className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700" />
               <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-yellow-400 font-bold text-lg mb-1">আপনার সেবায় নিয়োজিত</p>
                  <h3 className="text-white text-3xl font-black">জনাব [প্রার্থীর নাম]</h3>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ৩. এআই ইশতেহার বিশ্লেষক (✨ NEW GEMINI FEATURE) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-green-50 rounded-[40px] p-8 md:p-12 border border-green-100 shadow-2xl relative">
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-white px-6 py-2 rounded-full border border-green-200 flex items-center gap-2 shadow-sm">
              <Sparkles className="text-green-700" size={18} />
              <span className="text-xs font-black text-green-800 uppercase tracking-widest">এআই চালিত</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/3 text-center md:text-left">
                <div className="w-20 h-20 bg-green-900 rounded-3xl flex items-center justify-center text-white mb-6 mx-auto md:mx-0 shadow-xl shadow-green-900/20">
                  <Bot size={40} />
                </div>
                <h3 className="text-3xl font-black text-green-950 mb-4">ইশতেহার জিজ্ঞাসু ✨</h3>
                <p className="text-sm text-green-800/60 font-medium">আপনার এলাকার সমস্যা লিখুন, আমাদের এআই জানাবে প্রার্থী কীভাবে তা সমাধান করবেন।</p>
              </div>

              <div className="md:w-2/3 w-full">
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="যেমন: আমাদের এলাকায় রাস্তাঘাট খুব খারাপ..."
                      className="w-full p-6 bg-white rounded-2xl border-none shadow-inner focus:ring-2 focus:ring-green-700 outline-none pr-16"
                    />
                    <button 
                      onClick={() => askGemini(userQuery)}
                      disabled={aiLoading}
                      className="absolute right-3 top-3 bottom-3 px-6 bg-green-900 text-white rounded-xl hover:bg-green-800 transition-all flex items-center justify-center"
                    >
                      {aiLoading ? <RefreshCcw className="animate-spin" /> : <Send size={20} />}
                    </button>
                  </div>
                  
                  {aiResponse && (
                    <div className="p-6 bg-white border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-4">
                      <p className="text-gray-800 leading-relaxed italic text-sm">"{aiResponse}"</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {['রাস্তাঘাট', 'বেকারত্ব', 'চিকিৎসা', 'ওয়াইফাই'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => { setUserQuery(`আমাদের এলাকায় ${tag} নিয়ে প্রার্থীর পরিকল্পনা কী?`); askGemini(`আমাদের এলাকায় ${tag} নিয়ে প্রার্থীর পরিকল্পনা কী?`); }}
                        className="text-[10px] font-bold bg-white text-green-900 border border-green-100 px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ৪. স্ট্যাটিসটিক্স কার্ডস */}
      <section className="py-12 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'শিক্ষার হার বৃদ্ধি', value: '৮৫%', color: colors.accent },
            { label: 'নতুন রাস্তা (কিমি)', value: '১২০+', color: colors.secondary },
            { label: 'জনসেবা ইভেন্ট', value: '৫০০+', color: colors.primary },
            { label: 'কর্মসংস্থান', value: '১০হাজার', color: colors.accent }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-xl text-center border-b-4 hover:-translate-y-2 transition-transform" style={{ borderColor: stat.color }}>
              <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ৫. ইশতেহার */}
      <section id="ইশতেহার" className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="font-black text-red-600 uppercase tracking-widest text-sm">আমাদের লক্ষ্য</span>
              <h2 className="text-4xl md:text-5xl font-black mt-2 leading-tight">পরিবর্তন আসবেই, <br /> আমরা পথ দেখাবো</h2>
            </div>
            <p className="text-gray-500 max-w-sm text-sm">আমাদের প্রতিটি অঙ্গীকার বিচার-বিশ্লেষণ করে তৈরি করা হয়েছে যা এলাকার দীর্ঘমেয়াদী উন্নয়নে ভূমিকা রাখবে।</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {manifestoData.map((item, idx) => (
              <div key={idx} className="group p-8 rounded-3xl border-2 border-gray-100 hover:border-green-800 transition-all hover:bg-green-50/50">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-6 shadow-lg" style={{ backgroundColor: colors.primary, color: colors.highlight }}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৬. নিউজ সেকশন */}
      <section id="নিউজ" className="py-32 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">সর্বশেষ নিউজ ও ইভেন্ট</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['সব', 'জনসভা', 'প্রচারণা', 'উন্নয়ন'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveNewsTab(tab)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeNewsTab === tab ? 'bg-green-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {filteredNews.map((news) => (
              <article key={news.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg" style={{ backgroundColor: colors.secondary }}>
                    {news.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-4">
                    <Calendar size={14} /> {news.date}
                  </div>
                  <h3 className="text-xl font-bold mb-4 leading-snug group-hover:text-green-800 transition-colors">
                    {news.title}
                  </h3>
                  <button className="flex items-center gap-2 text-red-600 font-bold text-sm group/btn">
                    বিস্তারিত জানুন <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ৭. কন্টাক্ট ফরম */}
      <section id="যোগাযোগ" className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-green-950 rounded-[60px] p-8 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/10 skew-x-12 translate-x-32"></div>
            
            <div className="grid lg:grid-cols-2 gap-20 relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">আপনার পরামর্শ <br /> আমাদের শক্তি</h2>
                <p className="text-white/60 mb-12 text-lg">অত্র এলাকার সুষম উন্নয়নে আপনার যেকোনো সুচিন্তিত মতামত সরাসরি আমাদের কাছে পৌঁছে দিন।</p>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Phone /></div>
                    <div><p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">সরাসরি কল</p><p className="text-xl font-bold">+৮৮০ ১৭০০-০০০০০০</p></div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Mail /></div>
                    <div><p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">ইমেইল করুন</p><p className="text-xl font-bold">vision2026@candidate.com</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs text-gray-400 font-black uppercase w-full">এআই দিয়ে মেসেজ লিখুন ✨</span>
                    {['শিক্ষা উন্নয়ন', 'স্বাস্থ্য সেবা', 'বেকারত্ব সমস্যা'].map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => {
                          const query = `Write a polite suggestion message to a political candidate about ${t}. Use Bangla. Keep it professional.`;
                          askGemini(query);
                        }}
                        className="text-[9px] font-black uppercase tracking-tighter bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-green-100 hover:text-green-800 transition-all"
                      >
                        {t} ✨
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase mb-2">আপনার পূর্ণ নাম</label>
                    <input required type="text" className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-green-800 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase mb-2">বার্তার বিষয়</label>
                    <textarea 
                      required 
                      rows="4" 
                      value={aiResponse && aiResponse.length > 100 ? aiResponse : undefined}
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-green-800 transition-all outline-none" 
                      placeholder="আপনার কথা লিখুন..."
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 transition-all active:scale-95">
                    বার্তা পাঠান <Send size={20} />
                  </button>
                  {formStatus && <p className="text-center text-green-800 font-bold text-sm animate-bounce mt-4">{formStatus}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ৮. ফুটার */}
      <footer className="py-16 bg-black text-white">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">প্র</div>
            <span className="text-2xl font-black">প্রার্থীর নাম</span>
          </div>
          
          <div className="flex gap-8 mb-12">
            {[Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Icon size={20} />
              </a>
            ))}
          </div>
          
          <div className="w-full h-px bg-white/10 mb-10"></div>
          
          <p className="text-white/40 text-sm font-bold tracking-widest text-center uppercase">
            &copy; ২০২৬ সকল স্বত্ব সংরক্ষিত | আপনার নির্বাচনী সল্যুশন পার্টনার
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;