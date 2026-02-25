import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteSettings {
  site_name: string;
  primary_color: string;
  secondary_color: string;
  font_family: 'sans' | 'serif';
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
    document.body.style.fontFamily = settings.font_family === 'serif' ? '"Noto Serif KR", serif' : '"Noto Sans KR", sans-serif';
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
