import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Settings, Layout, FileText, Plus, Trash2, Save, Palette, Type, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useSite();
  const [activeTab, setActiveTab] = useState<'theme' | 'posts'>('theme');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '공지사항', image_url: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
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

  const handleDeletePost = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

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
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'posts' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-200'}`}
            >
              <FileText size={18} />
              <span className="font-medium">게시글 관리</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
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
                      <span className="block font-sans font-bold text-lg">Noto Sans KR</span>
                      <span className="text-sm text-slate-500">현대적이고 깔끔한 느낌</span>
                    </button>
                    <button 
                      onClick={() => updateSettings({ font_family: 'serif' })}
                      className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${settings.font_family === 'serif' ? 'border-primary bg-primary/5' : 'hover:border-slate-300'}`}
                    >
                      <span className="block font-serif font-bold text-lg">Noto Serif KR</span>
                      <span className="text-sm text-slate-500">고전적이고 신뢰감 있는 느낌</span>
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
                  </div>
                </section>
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
                      <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-slate-400">
                          <ImageIcon size={18} />
                          <span className="text-sm">이미지 업로드 (시뮬레이션)</span>
                        </div>
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
