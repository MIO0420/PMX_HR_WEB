
import React from 'react';
import { useLanguage } from '../Hook/useLanguage';
import './LanguageSwitch.css';

const LanguageSwitch = ({ 
  className = '', 
  containerClassName = '',
  position = 'relative' // 'absolute' 或 'relative'
}) => {
  const { currentLanguage, changeLanguage } = useLanguage();

  // 語言選項 - 只保留中文和越南文
  const languages = [
    { code: 'zh-TW', label: '中文' },
    { code: 'vi-VN', label: 'Tiếng Việt' }
  ];

  // 處理語言切換
  const handleLanguageChange = (langCode) => {
    console.log('點擊語言按鈕:', langCode);
    console.log('當前語言:', currentLanguage);
    
    if (langCode !== currentLanguage) {
      console.log('執行語言切換...');
      changeLanguage(langCode);
    } else {
      console.log('語言相同，無需切換');
    }
  };

  return (
    <div className={`language-switch-container ${containerClassName} ${position === 'absolute' ? 'absolute-position' : ''}`}>
      <div className={`language-switch ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
            type="button"
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitch;
