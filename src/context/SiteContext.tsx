import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteSettings {
  site_name: string;
  primary_color: string;
  secondary_color: string;
  font_family: 'sans' | 'serif';
  logo_url?: string;
  intro_title: string;
  intro_subtitle: string;
  intro_content: string;
  intro_quote: string;
  intro_image_url: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  show_contact: boolean;
  show_email: boolean;
  show_bank_info: boolean;
  bank_name: string;
  bank_account: string;
  bank_owner: string;
  social_instagram: string;
  social_youtube: string;
  social_facebook: string;
}

interface SiteContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '미션컴 (MissionCom)',
    primary_color: '#2E7D32',
    secondary_color: '#A5D6A7',
    font_family: 'sans',
    logo_url: '/logo.png',
    intro_title: '함께 걷는 길, 더 나은 내일을 만듭니다',
    intro_subtitle: 'Our Vision',
    intro_content: '미션컴(MissionCom)은 2010년, 한 사람의 작은 기도로 시작되었습니다. 우리는 단순한 원조를 넘어, 현지 공동체가 스스로 일어설 수 있는 지속 가능한 선교 모델을 지향합니다.\n\n청년들의 열정과 전문성을 선교 현장과 연결하며, 복음이 필요한 곳에 가장 창의적이고 따뜻한 방법으로 다가갑니다.',
    intro_quote: '우리는 말보다 삶으로, 사랑을 증명합니다.',
    intro_image_url: 'https://picsum.photos/seed/intro-mission/800/1000',
    contact_address: '서울특별시 강남구 선릉로 123',
    contact_phone: '02-1234-5678',
    contact_email: 'hello@missioncom.org',
    show_contact: true,
    show_email: true,
    show_bank_info: true,
    bank_name: '우리은행',
    bank_account: '1002-123-456789',
    bank_owner: '미션컴',
    social_instagram: 'https://instagram.com',
    social_youtube: 'https://youtube.com',
    social_facebook: 'https://facebook.com',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch settings:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary', settings.primary_color);
    document.documentElement.style.setProperty('--primary-light', settings.secondary_color);
    document.body.style.fontFamily = settings.font_family === 'serif' ? '"Noto Serif KR", serif' : '"Inter", sans-serif';
  }, [settings]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <SiteContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
