import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Settings, Layout, FileText, Plus, Trash2, Save, Palette, Type, Image as ImageIcon, X, Upload, Heart, Users, LogOut, Phone, Mail, MapPin, CreditCard, Share2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface Ministry {
  id: number;
  title: string;
  description: string;
  image_url: string;
  icon_name: string;
}

interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  category: string;
}

interface HistoryEntry {
  id: number;
  year: string;
  month: string;
  content: string;
  created_at: string;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useSite();
  const [activeTab, setActiveTab] = useState<'theme' | 'intro' | 'ministries' | 'partners' | 'posts' | 'contact' | 'history'>('theme');
  const [posts, setPosts] = useState<Post[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingMinistry, setIsAddingMinistry] = useState(false);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingHistory, setEditingHistory] = useState<HistoryEntry | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '공지사항', image_url: '' });
  const [newMinistry, setNewMinistry] = useState({ title: '', description: '', image_url: '', icon_name: 'Globe' });
  const [newPartner, setNewPartner] = useState({ name: '', description: '', logo_url: '', website_url: '', category: '협력교회' });
  const [newHistory, setNewHistory] = useState({ year: new Date().getFullYear().toString(), month: (new Date().getMonth() + 1).toString().padStart(2, '0'), content: '' });
  const [localContact, setLocalContact] = useState({ ...settings });

  useEffect(() => {
    setLocalContact({ ...settings });
  }, [settings]);

  useEffect(() => {
    fetchPosts();
    fetchMinistries();
    fetchPartners();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch(`/api/history?t=${Date.now()}`);
    const data = await res.json();
    setHistory(data);
  };

  const fetchPosts = async () => {
    const res = await fetch(`/api/posts?t=${Date.now()}`);
    const data = await res.json();
    setPosts(data);
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

  const handleAddPost = async () => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    setIsAddingPost(false);
    setNewPost({ title: '', content: '', category: '공지사항', image_url: '' });
    fetchPosts();
  };

  const handleAddMinistry = async () => {
    await fetch('/api/ministries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMinistry),
    });
    setIsAddingMinistry(false);
    setNewMinistry({ title: '', description: '', image_url: '', icon_name: 'Globe' });
    fetchMinistries();
  };

  const handleAddPartner = async () => {
    await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPartner),
    });
    setIsAddingPartner(false);
    setNewPartner({ name: '', description: '', logo_url: '', website_url: '', category: '업체' });
    fetchPartners();
  };

  const handleUpdateMinistry = async () => {
    if (!editingMinistry) return;
    await fetch(`/api/ministries/${editingMinistry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingMinistry),
    });
    setEditingMinistry(null);
    fetchMinistries();
  };

  const handleUpdatePartner = async () => {
    if (!editingPartner) return;
    await fetch(`/api/partners/${editingPartner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPartner),
    });
    setEditingPartner(null);
    fetchPartners();
  };

  const handleDeletePost = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleDeleteMinistry = async (id: number) => {
    await fetch(`/api/ministries/${id}`, { method: 'DELETE' });
    fetchMinistries();
  };

  const handleDeletePartner = async (id: number) => {
    await fetch(`/api/partners/${id}`, { method: 'DELETE' });
    fetchPartners();
  };

  const handleAddHistory = async () => {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHistory),
    });
    setIsAddingHistory(false);
    setNewHistory({ year: new Date().getFullYear().toString(), month: (new Date().getMonth() + 1).toString().padStart(2, '0'), content: '' });
    fetchHistory();
  };

  const handleUpdateHistory = async () => {
    if (!editingHistory) return;
    await fetch(`/api/history/${editingHistory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingHistory),
    });
    setEditingHistory(null);
    fetchHistory();
  };

  const handleDeleteHistory = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    fetchHistory();
  };

  const handleSaveContact = async () => {
    await updateSettings(localContact);
    alert('저장되었습니다.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ImageUploadField = ({ 
    label, 
    value, 
    onChange, 
    placeholder = "이미지 URL" 
  }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    placeholder?: string
  }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold cursor-pointer transition-colors">
          <Upload size={16} />
          <span>파일 선택</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => handleFileChange(e, onChange)}
          />
        </label>
        {value && (
          <div className="w-10 h-10 rounded-lg border overflow-hidden bg-slate-50 flex-shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg text-white">
              <Settings size={20} />
            </div>
            <h2 className="text-xl font-bold">관리자 대시보드</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r p-4 space-y-2 bg-slate-50">
            <button 
              onClick={() => setActiveTab('theme')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'theme' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <Palette size={18} />
              <span className="font-medium">테마 설정</span>
            </button>
            <button 
              onClick={() => setActiveTab('intro')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'intro' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <Layout size={18} />
              <span className="font-medium">소개 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('ministries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ministries' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <Heart size={18} />
              <span className="font-medium">사역 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('partners')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'partners' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <Users size={18} />
              <span className="font-medium">파트너 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <Clock size={18} />
              <span className="font-medium">연혁 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <FileText size={18} />
              <span className="font-medium">게시글 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contact' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <Phone size={18} />
              <span className="font-medium">연락처 관리</span>
            </button>

            <div className="pt-4 mt-4 border-t">
              <button 
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  window.location.reload();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium">로그아웃</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Horizontal Sub-nav Bar */}
            <div className="px-8 py-4 border-b bg-white sticky top-0 z-10 flex gap-6 overflow-x-auto no-scrollbar">
              {[
                { id: 'theme', label: '테마', icon: Palette },
                { id: 'intro', label: '소개', icon: Layout },
                { id: 'ministries', label: '사역', icon: Heart },
                { id: 'partners', label: '파트너', icon: Users },
                { id: 'history', label: '연혁', icon: Clock },
                { id: 'posts', label: '게시글', icon: FileText },
                { id: 'contact', label: '정보/연락처', icon: Phone },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap text-sm font-bold ${
                    activeTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'theme' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-primary" />
                    브랜드 컬러
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">포인트 컬러 (Primary)</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={settings.primary_color}
                          onChange={(e) => updateSettings({ primary_color: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border-none"
                        />
                        <input 
                          type="text" 
                          value={settings.primary_color}
                          onChange={(e) => updateSettings({ primary_color: e.target.value })}
                          className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">보조 컬러 (Secondary)</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={settings.secondary_color}
                          onChange={(e) => updateSettings({ secondary_color: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border-none"
                        />
                        <input 
                          type="text" 
                          value={settings.secondary_color}
                          onChange={(e) => updateSettings({ secondary_color: e.target.value })}
                          className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Type size={20} className="text-primary" />
                    타이포그래피
                  </h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => updateSettings({ font_family: 'sans' })}
                      className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${settings.font_family === 'sans' ? 'border-primary bg-primary/5' : 'hover:border-slate-300'}`}
                    >
                      <span className="block font-sans font-bold text-lg">Inter</span>
                      <span className="text-sm text-slate-500">현대적이고 깔끔한 느낌</span>
                    </button>
                    <button 
                      onClick={() => updateSettings({ font_family: 'serif' })}
                      className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${settings.font_family === 'serif' ? 'border-primary bg-primary/5' : 'hover:border-slate-300'}`}
                    >
                      <span className="block font-kr-serif font-bold text-lg">Noto Serif KR</span>
                      <span className="text-sm text-slate-500">신뢰감 있고 정중한 느낌</span>
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Layout size={20} className="text-primary" />
                    기본 정보
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">사이트 이름</label>
                      <input 
                        type="text" 
                        value={settings.site_name}
                        onChange={(e) => updateSettings({ site_name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-600">사이트 로고</label>
                      <div className="p-6 border-2 border-dashed rounded-2xl bg-slate-50 space-y-6">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-32 h-32 bg-white rounded-2xl border shadow-sm flex items-center justify-center overflow-hidden relative group">
                            {settings.logo_url ? (
                              <>
                                <img src={settings.logo_url} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button 
                                    onClick={() => updateSettings({ logo_url: '' })}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    title="로고 제거"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-slate-300">
                                <ImageIcon size={48} />
                                <span className="text-xs font-medium">로고 없음</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-4">권장 사이즈: 200x200px (PNG, JPG, SVG)</p>
                            <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold cursor-pointer hover:shadow-lg transition-all active:scale-95">
                              <Upload size={18} />
                              {settings.logo_url ? '로고 변경하기' : '새 로고 업로드'}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      updateSettings({ logo_url: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'intro' && (
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Layout size={20} className="text-primary" />
                    선교회 소개 관리
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">소제목 (Subtitle)</label>
                      <input 
                        type="text" 
                        value={settings.intro_subtitle}
                        onChange={(e) => updateSettings({ intro_subtitle: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="예: Our Vision"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">메인 제목 (Title)</label>
                      <input 
                        type="text" 
                        value={settings.intro_title}
                        onChange={(e) => updateSettings({ intro_title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">소개 내용 (Content)</label>
                      <textarea 
                        value={settings.intro_content}
                        onChange={(e) => updateSettings({ intro_content: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg h-40 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">핵심 인용구 (Quote)</label>
                      <input 
                        type="text" 
                        value={settings.intro_quote}
                        onChange={(e) => updateSettings({ intro_quote: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <ImageUploadField 
                      label="소개 이미지"
                      value={settings.intro_image_url}
                      onChange={(val) => updateSettings({ intro_image_url: val })}
                    />
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'ministries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">사역 목록 ({ministries.length})</h3>
                  <button 
                    onClick={() => setIsAddingMinistry(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={18} />
                    사역 추가
                  </button>
                </div>

                <AnimatePresence>
                  {(isAddingMinistry || editingMinistry) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">사역 명칭</label>
                          <input 
                            placeholder="사역 명칭" 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingMinistry ? editingMinistry.title : newMinistry.title}
                            onChange={e => editingMinistry ? setEditingMinistry({...editingMinistry, title: e.target.value}) : setNewMinistry({...newMinistry, title: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">아이콘 (Lucide Icon Name)</label>
                          <select 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingMinistry ? editingMinistry.icon_name : newMinistry.icon_name}
                            onChange={e => editingMinistry ? setEditingMinistry({...editingMinistry, icon_name: e.target.value}) : setNewMinistry({...newMinistry, icon_name: e.target.value})}
                          >
                            <option value="Globe">Globe (지구본)</option>
                            <option value="BookOpen">BookOpen (책)</option>
                            <option value="Users">Users (사람들)</option>
                            <option value="Heart">Heart (하트)</option>
                            <option value="Sun">Sun (태양)</option>
                            <option value="Compass">Compass (나침반)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">사역 설명</label>
                        <textarea 
                          placeholder="사역에 대한 설명을 입력하세요..." 
                          className="w-full px-4 py-2 border rounded-lg h-24 bg-white resize-none"
                          value={editingMinistry ? editingMinistry.description : newMinistry.description}
                          onChange={e => editingMinistry ? setEditingMinistry({...editingMinistry, description: e.target.value}) : setNewMinistry({...newMinistry, description: e.target.value})}
                        />
                      </div>
                      <ImageUploadField 
                        label="사역 이미지"
                        value={editingMinistry ? editingMinistry.image_url : newMinistry.image_url}
                        onChange={(val) => editingMinistry ? setEditingMinistry({...editingMinistry, image_url: val}) : setNewMinistry({...newMinistry, image_url: val})}
                      />
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setIsAddingMinistry(false); setEditingMinistry(null); }}
                          className="px-6 py-2 border rounded-lg font-bold"
                        >
                          취소
                        </button>
                        <button 
                          onClick={editingMinistry ? handleUpdateMinistry : handleAddMinistry}
                          className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
                        >
                          {editingMinistry ? '수정 완료' : '추가하기'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4">
                  {ministries.map(ministry => (
                    <div key={ministry.id} className="p-4 border rounded-xl flex items-center gap-4 bg-white hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                        <img src={ministry.image_url} alt={ministry.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{ministry.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{ministry.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingMinistry(ministry)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                          <Palette size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteMinistry(ministry.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">파트너 목록 ({partners.length})</h3>
                  <button 
                    onClick={() => setIsAddingPartner(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={18} />
                    파트너 추가
                  </button>
                </div>

                <AnimatePresence>
                  {(isAddingPartner || editingPartner) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">파트너 명칭</label>
                          <input 
                            placeholder="파트너 명칭" 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingPartner ? editingPartner.name : newPartner.name}
                            onChange={e => editingPartner ? setEditingPartner({...editingPartner, name: e.target.value}) : setNewPartner({...newPartner, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">카테고리</label>
                          <select 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingPartner ? editingPartner.category : newPartner.category}
                            onChange={e => editingPartner ? setEditingPartner({...editingPartner, category: e.target.value}) : setNewPartner({...newPartner, category: e.target.value})}
                          >
                            <option value="협력교회">협력교회</option>
                            <option value="총회">총회</option>
                            <option value="NGO/기구">NGO/기구</option>
                            <option value="교육기관">교육기관</option>
                            <option value="해외지부">해외지부</option>
                            <option value="업체">업체</option>
                            <option value="기타">기타</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">설명</label>
                        <textarea 
                          placeholder="파트너에 대한 설명을 입력하세요..." 
                          className="w-full px-4 py-2 border rounded-lg h-24 bg-white resize-none"
                          value={editingPartner ? editingPartner.description : newPartner.description}
                          onChange={e => editingPartner ? setEditingPartner({...editingPartner, description: e.target.value}) : setNewPartner({...newPartner, description: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <ImageUploadField 
                          label="로고 이미지"
                          value={editingPartner ? editingPartner.logo_url : newPartner.logo_url}
                          onChange={(val) => editingPartner ? setEditingPartner({...editingPartner, logo_url: val}) : setNewPartner({...newPartner, logo_url: val})}
                        />
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">웹사이트 URL</label>
                          <input 
                            placeholder="https://..." 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingPartner ? editingPartner.website_url : newPartner.website_url}
                            onChange={e => editingPartner ? setEditingPartner({...editingPartner, website_url: e.target.value}) : setNewPartner({...newPartner, website_url: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setIsAddingPartner(false); setEditingPartner(null); }}
                          className="px-6 py-2 border rounded-lg font-bold"
                        >
                          취소
                        </button>
                        <button 
                          onClick={editingPartner ? handleUpdatePartner : handleAddPartner}
                          className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
                        >
                          {editingPartner ? '수정 완료' : '추가하기'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4">
                  {partners.map(partner => (
                    <div key={partner.id} className="p-4 border rounded-xl flex items-center gap-4 bg-white hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 bg-slate-50 flex items-center justify-center">
                        {partner.logo_url ? (
                          <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <ImageIcon size={24} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800">{partner.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">{partner.category}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{partner.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingPartner(partner)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                          <Palette size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeletePartner(partner.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {partners.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      등록된 파트너가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">연혁 목록 ({history.length})</h3>
                  <button 
                    onClick={() => setIsAddingHistory(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={18} />
                    연혁 추가
                  </button>
                </div>

                <AnimatePresence>
                  {(isAddingHistory || editingHistory) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 space-y-4"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">연도 (Year)</label>
                          <input 
                            placeholder="2024" 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingHistory ? editingHistory.year : newHistory.year}
                            onChange={e => editingHistory ? setEditingHistory({...editingHistory, year: e.target.value}) : setNewHistory({...newHistory, year: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">월 (Month)</label>
                          <input 
                            placeholder="01" 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingHistory ? editingHistory.month : newHistory.month}
                            onChange={e => editingHistory ? setEditingHistory({...editingHistory, month: e.target.value}) : setNewHistory({...newHistory, month: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">내용</label>
                          <input 
                            placeholder="내용을 입력하세요" 
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={editingHistory ? editingHistory.content : newHistory.content}
                            onChange={e => editingHistory ? setEditingHistory({...editingHistory, content: e.target.value}) : setNewHistory({...newHistory, content: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setIsAddingHistory(false); setEditingHistory(null); }}
                          className="px-6 py-2 border rounded-lg font-bold"
                        >
                          취소
                        </button>
                        <button 
                          onClick={editingHistory ? handleUpdateHistory : handleAddHistory}
                          className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
                        >
                          {editingHistory ? '수정 완료' : '추가하기'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {history.map(item => (
                    <div key={item.id} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-center">
                          <span className="text-lg font-bold text-primary">{item.year}</span>
                          <span className="text-xs text-slate-400 block">{item.month}월</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <span className="font-medium">{item.content}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingHistory(item)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                          <Palette size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteHistory(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      등록된 연혁이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">게시글 목록 ({posts.length})</h3>
                  <button 
                    onClick={() => setIsAddingPost(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={18} />
                    새 글 작성
                  </button>
                </div>

                <AnimatePresence>
                  {isAddingPost && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          placeholder="제목" 
                          className="px-4 py-2 border rounded-lg bg-white"
                          value={newPost.title}
                          onChange={e => setNewPost({...newPost, title: e.target.value})}
                        />
                        <select 
                          className="px-4 py-2 border rounded-lg bg-white"
                          value={newPost.category}
                          onChange={e => setNewPost({...newPost, category: e.target.value})}
                        >
                          <option>공지사항</option>
                          <option>선교소식</option>
                          <option>기도제목</option>
                        </select>
                      </div>
                      <textarea 
                        placeholder="내용을 입력하세요..." 
                        className="w-full px-4 py-2 border rounded-lg h-32 bg-white"
                        value={newPost.content}
                        onChange={e => setNewPost({...newPost, content: e.target.value})}
                      />
                      <ImageUploadField 
                        label="게시글 이미지"
                        value={newPost.image_url}
                        onChange={(val) => setNewPost({...newPost, image_url: val})}
                      />
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={handleAddPost}
                          className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
                        >
                          저장하기
                        </button>
                        <button 
                          onClick={() => setIsAddingPost(false)}
                          className="px-6 py-2 border rounded-lg font-bold"
                        >
                          취소
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {posts.map(post => (
                    <div key={post.id} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full mr-3">
                          {post.category}
                        </span>
                        <span className="font-medium">{post.title}</span>
                        <p className="text-xs text-slate-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      등록된 게시글이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-8">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Phone size={20} className="text-primary" />
                      선교회 연락처 및 정보 관리
                    </h3>
                    <button 
                      onClick={handleSaveContact}
                      className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-bold"
                    >
                      <Save size={18} />
                      정보 저장하기
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Visibility Settings */}
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Layout size={14} /> 노출 설정
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
                          <div>
                            <p className="font-bold text-slate-800">푸터 연락처 정보 노출</p>
                            <p className="text-xs text-slate-500">메인 페이지 하단에 연락처 정보를 표시할지 결정합니다.</p>
                          </div>
                          <button 
                            onClick={() => setLocalContact({ ...localContact, show_contact: !localContact.show_contact })}
                            className={`w-14 h-8 rounded-full transition-colors relative ${localContact.show_contact ? 'bg-primary' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localContact.show_contact ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
                          <div>
                            <p className="font-bold text-slate-800">이메일 문의 버튼 노출</p>
                            <p className="text-xs text-slate-500">푸터에 이메일 문의하기 버튼을 표시할지 결정합니다.</p>
                          </div>
                          <button 
                            onClick={() => setLocalContact({ ...localContact, show_email: !localContact.show_email })}
                            className={`w-14 h-8 rounded-full transition-colors relative ${localContact.show_email ? 'bg-primary' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localContact.show_email ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} /> 기본 연락처
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-slate-500">이메일</label>
                          <input 
                            type="email" 
                            value={localContact.contact_email}
                            onChange={(e) => setLocalContact({ ...localContact, contact_email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">전화번호</label>
                          <input 
                            type="text" 
                            value={localContact.contact_phone}
                            onChange={(e) => setLocalContact({ ...localContact, contact_phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">주소</label>
                          <input 
                            type="text" 
                            value={localContact.contact_address}
                            onChange={(e) => setLocalContact({ ...localContact, contact_address: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Share2 size={14} /> 소셜 미디어 링크
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Instagram</label>
                          <input 
                            type="text" 
                            value={localContact.social_instagram}
                            onChange={(e) => setLocalContact({ ...localContact, social_instagram: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500">Youtube</label>
                          <input 
                            type="text" 
                            value={localContact.social_youtube}
                            onChange={(e) => setLocalContact({ ...localContact, social_youtube: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  );
}
