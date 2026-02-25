import React, { useState, useEffect } from 'react';
import { useSite } from './context/SiteContext';
import { 
  Menu, X, Instagram, Youtube, Facebook, 
  ChevronRight, Heart, Globe, Users, MessageSquare,
  ArrowRight, Mail, Phone, MapPin, Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const { settings } = useSite();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    fetchPosts();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data.slice(0, 3)); // Show latest 3 on home
  };

  const navItems = [
    { name: '선교회 소개', href: '#intro' },
    { name: '사역 안내', href: '#ministry' },
    { name: '커뮤니티', href: '#community' },
    { name: '후원 안내', href: '#support' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              {settings.site_name}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a 
                key={item.name} 
                href={item.href} 
                className={`font-medium transition-colors hover:text-primary ${scrolled ? 'text-slate-600' : 'text-white/90'}`}
              >
                {item.name}
              </a>
            ))}
            <button 
              onClick={() => setIsAdminOpen(true)}
              className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-white/70'}`}
            >
              <SettingsIcon size={20} />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-50 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-bold text-primary">{settings.site_name}</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
            </div>
            <nav className="flex flex-col gap-6 text-2xl font-bold">
              {navItems.map(item => (
                <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>{item.name}</a>
              ))}
              <button 
                onClick={() => { setIsAdminOpen(true); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-slate-400"
              >
                <SettingsIcon size={24} />
                관리자 설정
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/mission/1920/1080?blur=2" 
              className="w-full h-full object-cover opacity-60"
              alt="Hero Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold tracking-widest uppercase mb-6"
            >
              MissionCom Global Ministry
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] font-serif"
            >
              땅 끝까지 복음을,<br />
              <span className="text-primary-light">사랑과 희망</span>을 전합니다
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              미션컴은 전 세계 소외된 이웃들에게 그리스도의 사랑을 실천하며, 
              지속 가능한 선교 공동체를 세워갑니다.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#ministry" className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20">
                사역 둘러보기
              </a>
              <a href="#support" className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                후원 참여하기
              </a>
            </motion.div>
          </div>
        </section>

        {/* Intro Section */}
        <section id="intro" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">About Us</span>
                <h2 className="text-4xl font-bold mb-8 font-serif leading-tight">
                  우리는 복음의 통로가 되어<br />
                  세상을 변화시킵니다
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  미션컴(MissionCom)은 2010년 설립된 개신교 선교 단체로, 
                  '소통(Communication)'과 '공동체(Community)'를 핵심 가치로 삼고 있습니다. 
                  우리는 단순한 원조를 넘어, 현지인들이 스스로 일어설 수 있도록 돕는 
                  교육과 자립 지원 사업에 집중하고 있습니다.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-primary font-bold text-3xl mb-2">15+</div>
                    <div className="text-slate-500 text-sm">파송 국가</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-primary font-bold text-3xl mb-2">120+</div>
                    <div className="text-slate-500 text-sm">협력 선교사</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/people/800/1000" 
                  className="rounded-3xl shadow-2xl"
                  alt="Mission Field"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-8 -left-8 bg-primary p-8 rounded-3xl text-white shadow-xl hidden lg:block">
                  <p className="text-2xl font-serif italic mb-2">"너희는 온 천하에 다니며 만민에게 복음을 전파하라"</p>
                  <p className="text-sm opacity-80">— 마가복음 16:15</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ministry Section */}
        <section id="ministry" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-serif">주요 사역 안내</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">미션컴은 국내외 다양한 영역에서 하나님의 나라를 확장해 나가고 있습니다.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Globe size={32} />, title: '해외 선교', desc: '아시아, 아프리카, 남미 등 복음의 불모지에 선교사를 파송하고 교회를 개척합니다.' },
                { icon: <Users size={32} />, title: '교육 지원', desc: '현지 아동들을 위한 학교 설립 및 장학 사업을 통해 미래의 리더를 양성합니다.' },
                { icon: <Heart size={32} />, title: '의료/구호', desc: '재난 지역 긴급 구호 및 의료 봉사단을 통해 육체적 치유와 회복을 돕습니다.' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">{item.desc}</p>
                  <a href="#" className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                    자세히 보기 <ChevronRight size={18} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section id="community" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2 font-serif">최신 소식</h2>
                <p className="text-slate-500">선교지의 생생한 소식을 전해드립니다.</p>
              </div>
              <a href="#" className="text-primary font-bold flex items-center gap-2">전체보기 <ArrowRight size={18} /></a>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {posts.length > 0 ? posts.map((post: any) => (
                <div key={post.id} className="group cursor-pointer">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100">
                    <img 
                      src={post.image_url || `https://picsum.photos/seed/${post.id}/600/400`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={post.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full mb-3 inline-block">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </div>
              )) : (
                // Skeleton/Placeholder
                [1,2,3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-slate-200 rounded-2xl mb-6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">
                여러분의 작은 정성이<br />
                누군가에게는 큰 희망이 됩니다
              </h2>
              <p className="text-xl text-white/80 mb-12 leading-relaxed">
                미션컴의 모든 사역은 후원자분들의 기도와 헌신으로 이루어집니다. 
                보내는 선교사로서 열방을 향한 하나님의 마음에 동참해 주세요.
              </p>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl mb-12">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Heart size={20} className="text-primary-light" />
                  후원 계좌 안내
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="opacity-70">사단법인 미션컴</span>
                    <span className="font-mono text-xl font-bold">국민은행 123456-01-123456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">해외 선교 후원</span>
                    <span className="font-mono text-xl font-bold">우리은행 1002-123-456789</span>
                  </div>
                </div>
              </div>
              <button className="px-12 py-5 bg-white text-primary rounded-full font-bold text-xl hover:bg-slate-100 transition-all shadow-2xl">
                정기 후원 신청하기
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <Globe className="text-primary" size={32} />
                <span className="text-2xl font-bold">{settings.site_name}</span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed mb-8">
                미션컴은 복음 전파와 사랑의 실천을 통해 하나님의 나라를 이 땅에 실현하는 선교 공동체입니다. 
                우리는 모든 민족이 주를 찬양하는 그날까지 멈추지 않겠습니다.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Youtube size={20} /></a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Facebook size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-8">Contact</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center gap-3"><MapPin size={18} className="text-primary" /> 서울특별시 강남구 선릉로 123</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-primary" /> 02-1234-5678</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-primary" /> contact@missioncom.org</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-8">Links</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">이메일무단수집거부</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">사역보고서</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            © 2024 MissionCom. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard onClose={() => setIsAdminOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
