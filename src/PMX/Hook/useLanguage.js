import { useState, useEffect, useContext, createContext } from 'react';
import zhTW from '../locales/zh-TW';
import viVN from '../locales/vi-VN';

const LanguageContext = createContext();

const translations = {
  'zh-TW': zhTW,
  'vi-VN': viVN
};

export const LanguageProvider = ({ children }) => {
  // 從 localStorage 讀取保存的語言設定，預設為中文
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('app_language');
    console.log('初始化語言:', savedLanguage || 'zh-TW');
    return savedLanguage || 'zh-TW';
  });

  // 語言切換函數
  const changeLanguage = (newLanguage) => {
    console.log('切換語言從', currentLanguage, '到', newLanguage);
    if (translations[newLanguage]) {
      setCurrentLanguage(newLanguage);
      localStorage.setItem('app_language', newLanguage);
      console.log('語言切換成功:', newLanguage);
    } else {
      console.error('不支援的語言:', newLanguage);
    }
  };

  // 翻譯函數
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (value === undefined) {
      console.warn(`翻譯鍵未找到: ${key} (語言: ${currentLanguage})`);
      return key;
    }
    
    return value;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
