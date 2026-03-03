import React, { useState, useEffect } from 'react';
import { useSite } from './context/SiteContext';
import { 
  Menu, X, Instagram, Youtube, Facebook, 
  ChevronRight, Heart, Globe, Users, MessageSquare,
  ArrowRight, Mail, Phone, MapPin, Settings as SettingsIcon,
  Quote, Compass, BookOpen, Sun, LogOut, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';

// Main Application Component
export default function App() {
  const { settings } = useSite();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    fetchPosts();
    fetchMinistries();
    fetchPartners();
    fetchHistory();

    // Check for admin token
    const token = localStorage.getItem('admin_token');
    if (token === 'admin-token-xyz') {
      setIsLoggedIn(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPosts = async () => {
    const res = await fetch(`/api/posts?t=${Date.now()}`);
    const data = await res.json();
    setPosts(data.slice(0, 3));
  };

  const fetchMinistries = async () => {
    const res = await fetch(`/api/ministries?t=${Date.now()}`);
    const data = await res.json();
    setMinistries(data);
  };

  const fetchPartners = async () => {
    const res = await fetch(`/api/partners?t=${Date.now()}`);
    const data = await res.json();
    setPartners(data);
  };

  const fetchHistory = async () => {
    const res = await fetch(`/api/history?t=${Date.now()}`);
    const data = await res.json();
    setHistory(data);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe size={32} />;
      case 'BookOpen': return <BookOpen size={32} />;
      case 'Users': return <Users size={32} />;
      case 'Heart': return <Heart size={32} />;
      case 'Sun': return <Sun size={32} />;
      case 'Compass': return <Compass size={32} />;
      default: return <Globe size={32} />;
    }
  };

  const navItems = [
    { name: '선교회 소개', href: '#intro' },
    { name: '연혁', href: '#history' },
    { name: '사역 안내', href: '#ministry' },
    { name: '협력 기관', href: '#partners' },
    { name: '커뮤니티', href: '#community' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-slate-800 selection:bg-primary/10 selection:text-primary">
      {/* Header */}
      <header className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt="MissionCom Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white';
                    fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  <Compass size={22} />
                </div>
              )}
            </div>
            <span className={`text-2xl font-bold tracking-tight font-kr-serif ${scrolled ? 'text-primary' : 'text-white'}`}>
              {settings.site_name}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <a 
                key={item.name} 
                href={item.href} 
                className={`text-sm font-bold tracking-tight hover:text-primary transition-colors ${scrolled ? 'text-slate-600' : 'text-white/90'}`}
              >
                {item.name}
              </a>
            ))}
            {isLoggedIn && (
              <button 
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  window.location.reload();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  scrolled 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <LogOut size={14} />
                로그아웃
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className={`${scrolled ? 'text-primary' : 'text-white'} md:hidden`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-50 p-8 flex flex-col pt-24"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-slate-400"><X size={32} /></button>
            <nav className="flex flex-col gap-6 text-3xl font-bold font-kr-serif">
              {navItems.map(item => (
                <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-slate-800 hover:text-primary">{item.name}</a>
              ))}
              <button 
                onClick={() => { 
                  if (isLoggedIn) {
                    setIsAdminOpen(true);
                  } else {
                    setIsLoginOpen(true);
                  }
                  setIsMenuOpen(false); 
                }}
                className="text-lg font-bold text-slate-400 flex items-center gap-2 mt-8"
              >
                <SettingsIcon size={20} /> 관리자 설정
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    localStorage.removeItem('admin_token');
                    window.location.reload();
                  }}
                  className="text-lg font-bold text-red-400 flex items-center gap-2 mt-4"
                >
                  <LogOut size={20} /> 로그아웃
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/mission-warm/1920/1080" 
              className="w-full h-full object-cover"
              alt="Hero Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
            >
              <Sun size={14} className="text-yellow-400" /> 사랑과 소통의 공동체
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-[1.2] font-kr-serif"
            >
              세상을 향한 <br />
              <span className="italic font-serif text-primary-light">따뜻한 발걸음</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              미션컴은 복음의 가치를 삶으로 실천하며, <br />
              소외된 이웃들에게 그리스도의 사랑을 전하는 선교 공동체입니다.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <a href="#ministry" className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:shadow-xl transition-all">
                사역 안내
              </a>
              <a href="#support" className="w-full sm:w-auto px-10 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-slate-50 transition-all">
                후원하기
              </a>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent mx-auto"></div>
          </div>
        </section>

        {/* Intro Section */}
        <section id="intro" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-light/30 rounded-full -z-10 blur-3xl"></div>
                <img 
                  src={settings.intro_image_url} 
                  className="rounded-[40px] shadow-2xl w-full aspect-[4/5] object-cover"
                  alt="Mission Intro"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[40px] shadow-xl border border-slate-50 max-w-xs hidden md:block">
                  <Quote size={40} className="text-primary/20 mb-4" />
                  <p className="text-lg font-kr-serif font-bold leading-relaxed text-slate-700 whitespace-pre-line">
                    {settings.intro_quote}
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">{settings.intro_subtitle}</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 font-kr-serif leading-tight whitespace-pre-line">
                  {settings.intro_title}
                </h2>
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {settings.intro_content}
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div className="flex flex-col">
                    <span className="text-4xl font-serif font-bold text-primary mb-2">15+</span>
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Global Nations</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-serif font-bold text-primary mb-2">120+</span>
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Missionaries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section id="history" className="py-32 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-20">
              <div className="md:w-1/3">
                <h2 className="text-4xl font-bold mb-6 font-kr-serif">선교회 연혁</h2>
                <p className="text-slate-500 leading-relaxed">
                  미션컴이 걸어온 발자취입니다. <br />
                  작은 시작이 큰 울림이 되기까지의 기록을 전합니다.
                </p>
                <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10">
                  <Clock className="text-primary mb-4" size={32} />
                  <h4 className="font-bold text-slate-800 mb-2">지속 가능한 선교</h4>
                  <p className="text-sm text-slate-500">우리는 멈추지 않고 복음의 지경을 넓혀가고 있습니다.</p>
                </div>
              </div>
              
              <div className="md:w-2/3 relative">
                <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-slate-200"></div>
                <div className="space-y-12">
                  {history.length > 0 ? history.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12 md:pl-20"
                    >
                      <div className="absolute left-[-4px] md:left-[28px] top-2 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20"></div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-2">
                        <span className="text-2xl font-serif font-bold text-primary">{item.year}</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.month}월</span>
                      </div>
                      <p className="text-lg text-slate-700 font-medium leading-relaxed">
                        {item.content}
                      </p>
                    </motion.div>
                  )) : (
                    <div className="text-slate-400 py-10">연혁 정보가 없습니다.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ministry Section */}
        <section id="ministry" className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 font-kr-serif">주요 사역 안내</h2>
              <div className="w-12 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-slate-500 max-w-xl mx-auto">미션컴은 하나님의 사랑을 전하기 위해 다양한 영역에서 활동하고 있습니다.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {ministries.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
                >
                  <div className="h-56 overflow-hidden">
                    <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-10">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
                      {getIcon(item.icon_name)}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-kr-serif">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed mb-8">{item.description}</p>
                    <a href="#" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                      자세히 보기 <ChevronRight size={18} />
                    </a>
                  </div>
                </motion.div>
              ))}
              {ministries.length === 0 && (
                <div className="col-span-3 text-center py-20 text-slate-400">
                  등록된 사역 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="partners" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 font-kr-serif">함께하는 업체 및 총회</h2>
              <div className="w-12 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-slate-500 max-w-xl mx-auto">미션컴과 함께 열방을 향해 나아가는 소중한 파트너들입니다.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {partners.map((partner) => (
                <motion.a
                  key={partner.id}
                  href={partner.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="group flex flex-col items-center p-8 bg-slate-50 rounded-[32px] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="w-20 h-20 mb-6 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Users size={40} className="text-slate-300" />
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-1 block">{partner.category}</span>
                    <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{partner.name}</h4>
                  </div>
                </motion.a>
              ))}
              {partners.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-400">
                  등록된 협력 기관 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section id="community" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-2 font-kr-serif">최신 소식</h2>
                <p className="text-slate-500">선교지의 생생한 이야기를 전해드립니다.</p>
              </div>
              <a href="#" className="px-6 py-2 border border-slate-200 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                전체보기 <ArrowRight size={16} />
              </a>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {posts.length > 0 ? posts.map((post: any) => (
                <div key={post.id} className="group cursor-pointer">
                  <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-slate-100">
                    <img 
                      src={post.image_url || `https://picsum.photos/seed/${post.id}/800/500`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors font-kr-serif leading-snug">{post.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </div>
              )) : (
                [1,2,3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] bg-slate-100 rounded-3xl mb-6"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-3">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 flex items-center justify-center">
                  {settings.logo_url ? (
                    <img 
                      src={settings.logo_url} 
                      alt="MissionCom Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Compass className="text-primary" size={32} />
                  )}
                </div>
                <span className="text-2xl font-bold font-kr-serif text-primary">{settings.site_name}</span>
              </div>
              <p className="text-slate-500 text-lg max-w-md leading-relaxed mb-10">
                미션컴은 복음 전파와 사랑의 실천을 통해 하나님의 나라를 이 땅에 실현하는 선교 공동체입니다.
              </p>
              <div className="flex gap-6">
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-primary transition-colors"><Instagram size={24} /></a>
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-primary transition-colors"><Youtube size={24} /></a>
                <a href={settings.social_blog} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-primary transition-colors" title="Blog"><BookOpen size={24} /></a>
              </div>
            </div>
            
            {settings.show_email && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-widest">Inquiry</h4>
                <button 
                  onClick={() => window.location.href = `mailto:${settings.contact_email}`}
                  className="flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-bold text-sm shadow-lg shadow-primary/20"
                >
                  <Mail size={18} /> 
                  <span>이메일 문의하기</span>
                </button>
              </div>
            )}

            {settings.show_contact && (
              <div className="md:col-span-3">
                <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-widest">Contact</h4>
                <ul className="space-y-4 text-slate-500">
                  <li className="flex items-center gap-3"><Phone size={18} className="text-primary/50" /> {settings.contact_phone}</li>
                  <li className="flex items-start gap-3"><MapPin size={18} className="mt-1 text-primary/50" /> {settings.contact_address}</li>
                </ul>
              </div>
            )}
            
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-slate-900 mb-8 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-4 text-slate-500">
                {navItems.map(item => (
                  <li key={item.name}><a href={item.href} className="hover:text-primary transition-colors">{item.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-xs font-bold tracking-widest">
            <span>© 2024 MISSIONCOM. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-8 items-center">
              <a href="#" className="hover:text-slate-900 transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-slate-900 transition-colors">TERMS OF SERVICE</a>
              <button 
                onClick={() => isLoggedIn ? setIsAdminOpen(true) : setIsLoginOpen(true)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <SettingsIcon size={14} />
                ADMIN
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal 
            onLogin={(token) => {
              setIsLoggedIn(true);
              setIsLoginOpen(false);
              setIsAdminOpen(true);
              // In a real app, we'd store the token
              localStorage.setItem('admin_token', token);
            }}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
        {isAdminOpen && (
          <AdminDashboard onClose={() => setIsAdminOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
