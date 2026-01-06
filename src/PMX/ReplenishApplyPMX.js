// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import './PMX_CSS/ReplenishApplyPMX.css';
// import { 
//   validateUserFromCookies,
//   getCurrentDateTimeInfo,
//   formatDateForApi,
//   generateFormNumber,
//   fetchEmployeeInfoFunction,
//   submitReplenishForm,
//   handleGoHomeFunction
// } from './function/function'; // 引入共用函數
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png'; // 引入首頁圖標
// import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
// import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
// import LanguageSwitch from './components/LanguageSwitch';
// import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook

// function ReplenishApply() {
//   // 引入語言功能
//   const { t } = useLanguage();
  
//   // 獲取當前日期時間信息
//   const currentDateTimeInfo = getCurrentDateTimeInfo();

//   const [currentTime, setCurrentTime] = useState('--:--');
//   const [selectedCardType, setSelectedCardType] = useState(t('replenishApply.clockIn'));
//   const [reason, setReason] = useState(t('replenishApply.businessTrip'));
//   const [illustrate, setIllustrate] = useState('');
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formId, setFormId] = useState('');
//   const [error, setError] = useState(null);
//   const [employeeInfo, setEmployeeInfo] = useState(null); // 存儲員工資料
//   const [companyId, setCompanyId] = useState(""); // 公司ID
//   const [employeeId, setEmployeeId] = useState(""); // 員工ID
//   const [authToken, setAuthToken] = useState(''); // 認證令牌
//   const authInProgress = useRef(false); // 使用 ref 追蹤認證進度
//   const formSubmitInProgress = useRef(false); // 使用 ref 追蹤表單提交進度

//   // 日期和時間的狀態 - 初始化為當前日期和時間
//   const [replenishDate, setReplenishDate] = useState(currentDateTimeInfo.formattedDate);
//   const [originalTime, setOriginalTime] = useState(currentDateTimeInfo.formattedTime);
//   const [modifiedTime, setModifiedTime] = useState(currentDateTimeInfo.formattedTime);

//   // 日期和時間選擇器狀態
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [showReasonOptions, setShowReasonOptions] = useState(false);
//   const [isEditingOriginal, setIsEditingOriginal] = useState(true); // 標記是否編輯原始時間
//   const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday); // 星期幾

//   // 補卡事由選項 - 使用翻譯
//   const reasonOptions = [
//     { name: t('replenishApply.businessTrip'), category: t('replenishApply.reasonCategory') },
//     { name: t('replenishApply.forgotToClock'), category: t('replenishApply.reasonCategory') },
//     { name: t('replenishApply.personalBusiness'), category: t('replenishApply.reasonCategory') },
//     { name: t('replenishApply.other'), category: t('replenishApply.reasonCategory') }
//   ];

//   // 將 cookie 工具函數移到 useRef 中，避免重新創建
//   const cookieUtils = useRef({
//     get: (name) => {
//       const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//         const [key, value] = cookie.split('=');
//         if (key && value) {
//           acc[decodeURIComponent(key)] = decodeURIComponent(value);
//         }
//         return acc;
//       }, {});
//       return cookies[name];
//     },
    
//     set: (name, value, expirationHours = 3) => {
//       const date = new Date();
//       date.setTime(date.getTime() + (expirationHours * 60 * 60 * 1000));
//       const expires = `expires=${date.toUTCString()}`;
//       document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};${expires};path=/`;
//       console.log(`已設置 cookie: ${name}=${value}, 有效期 ${expirationHours} 小時`);
//     },
    
//     remove: (name) => {
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
//     }
//   }).current;

//   // 使用共用函數驗證用戶
//   useEffect(() => {
//     validateUserFromCookies(
//       setLoading,
//       setAuthToken,
//       setCompanyId,
//       setEmployeeId
//     );
//   }, []);

//   // 生成本地表單ID - 不再依賴API
//   useEffect(() => {
//     if (!companyId || formId) return; // 如果已經有 formId 或沒有 companyId，則不執行
    
//     try {
//       // 直接生成本地表單ID
//       const localFormId = `FORM-${companyId}-${Date.now()}`;
//       setFormId(localFormId);
//       console.log(`已生成本地表單ID: ${localFormId}`);
//     } catch (err) {
//       console.error('生成表單ID時發生錯誤:', err);
//       setError(t('errors.dataLoadFailed'));
//     }
//   }, [companyId, formId, t]);

//   // 查詢員工基本資料 - 使用從 function.js 引入的函數
//   const fetchEmployeeInfo = useCallback(async () => {
//     await fetchEmployeeInfoFunction(
//       companyId, 
//       employeeId, 
//       authToken, 
//       setLoading, 
//       setEmployeeInfo, 
//       setError, 
//       cookieUtils,
//       authInProgress
//     );
//   }, [companyId, employeeId, authToken, cookieUtils]);

//   // 當認證資訊更新後，獲取員工資料
//   useEffect(() => {
//     if (companyId && employeeId && authToken) {
//       fetchEmployeeInfo();
//     }
//   }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

//   // 處理日期點擊
//   const handleDateClick = () => {
//     setShowDatePicker(true);
//   };
  
//   // 處理時間點擊
//   const handleTimeClick = (isOriginal) => {
//     setIsEditingOriginal(isOriginal);
//     setShowTimePicker(true);
//   };
  
//   // 處理日期選擇 - 修改版本，實現自動流程
//   const handleDateSelect = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
    
//     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//     const weekday = weekdays[date.getDay()];
    
//     setReplenishDate(`${year}年 ${month}月${day}日 ${weekday}`);
//     setSelectedWeekday(weekday);
//     setShowDatePicker(false);
    
//     // 選擇完日期後自動開啟原始時間選擇
//     setTimeout(() => {
//       setIsEditingOriginal(true); // 設置為編輯原始時間
//       setShowTimePicker(true);
//     }, 300);
//   };
  
//   // 處理時間選擇 - 修改版本，實現自動流程
//   const handleTimeSelect = (hour, minute) => {
//     const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
//     if (isEditingOriginal) {
//       // 選擇原始時間
//       setOriginalTime(formattedTime);
//       setShowTimePicker(false);
      
//       // 自動開啟修改時間選擇
//       setTimeout(() => {
//         setIsEditingOriginal(false); // 切換到編輯修改時間
//         setShowTimePicker(true);
//       }, 300);
      
//     } else {
//       // 選擇修改時間
//       setModifiedTime(formattedTime);
//       setShowTimePicker(false);
      
//       // 完成所有選擇，重置狀態
//       setIsEditingOriginal(true); // 重置為編輯原始時間狀態，以備下次使用
//     }
//   };

//   // 處理表單提交 - 使用從 function.js 引入的函數
//   const handleSubmit = async () => {
//     const result = await submitReplenishForm({
//       loading,
//       formSubmitInProgress,
//       companyId,
//       employeeId,
//       authToken,
//       illustrate,
//       replenishDate,
//       originalTime,
//       modifiedTime,
//       reason,
//       selectedCardType,
//       employeeInfo,
//       cookieUtils,
//       setLoading,
//       setFormSubmitted,
//       setError
//     });
    
//     if (result && result.success) {
//       window.location.href = '/replenishpmx';
//     }
//   };
  
//   // 處理返回首頁 - 使用從 function.js 引入的函數
//   const handleGoHome = () => {
//     handleGoHomeFunction();
//   };
  
//   const handleCancel = () => {
//     console.log('取消補卡申請');
//     window.location.href = 'replenishpmx';
//   };
  
//   const handleCardTypeChange = (type) => {
//     setSelectedCardType(type);
//   };
  
//   const handleReasonSelect = (selectedReason) => {
//     setReason(selectedReason.name);
//     setShowReasonOptions(false);
//   };
  
//   const handleIllustrateChange = (e) => {
//     setIllustrate(e.target.value);
//   };

//   // 添加全局樣式以防止滾動
//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     document.body.style.margin = '0';
//     document.body.style.padding = '0';
//     document.documentElement.style.overflow = 'hidden';
//     document.documentElement.style.margin = '0';
//     document.documentElement.style.padding = '0';
    
//     return () => {
//       document.body.style.overflow = '';
//       document.body.style.margin = '';
//       document.body.style.padding = '';
//       document.documentElement.style.overflow = '';
//       document.documentElement.style.margin = '';
//       document.documentElement.style.padding = '';
//     };
//   }, []);

//   // 添加錯誤處理組件
//   const ErrorMessage = ({ message, onClose }) => {
//     return (
//       <div className="replenish-apply-error-container">
//         <div className="replenish-apply-error-message">
//           <div className="replenish-apply-error-icon">⚠️</div>
//           <div className="replenish-apply-error-text">{message}</div>
//           <button className="replenish-apply-error-close" onClick={onClose}>✕</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="replenish-apply-container">
//       <div className="replenish-apply-wrapper">
//         <header className="replenish-apply-header">
//           <div className="replenish-apply-home-icon" onClick={handleGoHome}>
//             <img src={homeIcon} alt={t('home.title')} width="20" height="20" />
//           </div>
//           <div className="replenish-apply-page-title">{t('replenishApply.title')}</div>
//           {/* 語言切換器 */}
//           <div className="replenish-apply-language-switch">
//             <LanguageSwitch 
//               className="replenish-apply-language-switch-component"
//               containerClassName="replenish-apply-language-container"
//               position="relative"
//             />
//           </div>
//         </header>

//         {/* 顯示錯誤訊息 */}
//         {error && (
//           <ErrorMessage 
//             message={error} 
//             onClose={() => setError(null)} 
//           />
//         )}
        
//         <div className="replenish-apply-form-container">
//           <div className="replenish-apply-form-row">
//             <div className="replenish-apply-form-label">{t('replenishApply.type')}</div>
//             <div className="replenish-apply-form-value">
//               <div className="replenish-apply-card-type-container">
//                 <button 
//                   className={`replenish-apply-card-type-button ${selectedCardType === t('replenishApply.clockIn') ? 'replenish-apply-card-type-button-active' : ''}`}
//                   onClick={() => handleCardTypeChange(t('replenishApply.clockIn'))}
//                 >
//                   {t('replenishApply.clockIn')}
//                 </button>
//                 <button 
//                   className={`replenish-apply-card-type-button ${selectedCardType === t('replenishApply.clockOut') ? 'replenish-apply-card-type-button-active' : ''}`}
//                   onClick={() => handleCardTypeChange(t('replenishApply.clockOut'))}
//                 >
//                   {t('replenishApply.clockOut')}
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="replenish-apply-form-row">
//             <div className="replenish-apply-form-label">{t('replenishApply.reason')}</div>
//             <div className="replenish-apply-form-value">
//               <div 
//                 className="replenish-apply-reason-selector" 
//                 onClick={() => setShowReasonOptions(true)}
//               >
//                 <div className="replenish-apply-reason-name">{reason}</div>
//                 <div className="replenish-apply-dropdown-icon">▼</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="replenish-apply-form-row">
//             <div className="replenish-apply-form-label">{t('replenishApply.date')}</div>
//             <div className="replenish-apply-form-value">
//               <div className="replenish-apply-date-time-row">
//                 <div className="replenish-apply-date-time" onClick={handleDateClick}>{replenishDate}</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="replenish-apply-form-row">
//             <div className="replenish-apply-form-label">{t('replenishApply.originalTime')}</div>
//             <div className="replenish-apply-form-value">
//               <div className="replenish-apply-date-time-row">
//                 <div className="replenish-apply-time-input" onClick={() => handleTimeClick(true)}>{originalTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="replenish-apply-form-row">
//             <div className="replenish-apply-form-label">{t('replenishApply.modifiedTime')}</div>
//             <div className="replenish-apply-form-value">
//               <div className="replenish-apply-date-time-row">
//                 <div className="replenish-apply-time-input" onClick={() => handleTimeClick(false)}>{modifiedTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="replenish-apply-description-container">
//             <div className="replenish-apply-description-label">{t('replenishApply.description')}</div>
//             <textarea
//               className="replenish-apply-description-textarea"
//               placeholder={t('replenishApply.descriptionPlaceholder')}
//               value={illustrate}
//               onChange={handleIllustrateChange}
//             ></textarea>
//           </div>
//         </div>
        
//         <div className="replenish-apply-button-container">
//           <button 
//             className="replenish-apply-cancel-button"
//             onClick={handleCancel}
//             disabled={loading || formSubmitInProgress.current}
//           >
//             {t('replenishApply.cancel')}
//           </button>
//           <button 
//             className={`replenish-apply-submit-button ${loading || formSubmitInProgress.current ? 'replenish-apply-button-loading' : ''}`}
//             onClick={handleSubmit}
//             disabled={loading || formSubmitInProgress.current}
//           >
//             {loading || formSubmitInProgress.current ? t('replenishApply.submitting') : t('replenishApply.submit')}
//           </button>
//         </div>
        
//         {/* 事由選項列表 */}
//         {showReasonOptions && (
//           <>
//             <div className="replenish-apply-overlay" onClick={() => setShowReasonOptions(false)}></div>
//             <div className="replenish-apply-reason-options-container">
//               <div className="replenish-apply-reason-category">{t('replenishApply.reasonCategory')}</div>
//               {reasonOptions.map((option, index) => (
//                 <div 
//                   key={index} 
//                   className="replenish-apply-reason-option"
//                   onClick={() => handleReasonSelect(option)}
//                 >
//                   {option.name}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
        
//         {/* 使用引入的日期選擇器組件 */}
//         <CalendarSelector
//           isVisible={showDatePicker}
//           onClose={() => setShowDatePicker(false)}
//           onDateSelect={handleDateSelect}
//           isEditingStart={true} // 補卡申請只有一個日期
//         />
        
//         {/* 使用引入的時間選擇器組件 */}
//         <TimeSelector
//           isVisible={showTimePicker}
//           onClose={() => setShowTimePicker(false)}
//           onTimeSelect={handleTimeSelect}
//           currentTime={isEditingOriginal ? originalTime : modifiedTime}
//           isEditingStart={isEditingOriginal}
//         />
        
//         {/* 載入中指示器 */}
//         {loading && (
//           <div className="replenish-apply-loading-overlay">
//             <div className="replenish-apply-loading-spinner"></div>
//             <div className="replenish-apply-loading-text">{t('replenishApply.processingPleaseWait')}</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ReplenishApply;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PMX_CSS/ReplenishApplyPMX.css';
import { 
  validateUserFromCookies,
  getCurrentDateTimeInfo,
  formatDateForApi,
  generateFormNumber,
  fetchEmployeeInfoFunction,
  submitReplenishForm,
  handleGoHomeFunction
} from './function/function'; // 引入共用函數
import homeIcon from '../Google_sheet/HomePageImage/homepage.png'; // 引入首頁圖標
import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
import LanguageSwitch from './components/LanguageSwitch';
import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook
import { API_BASE_URL } from '../config'; // 引入 API_BASE_URL

function ReplenishApply() {
  // 引入語言功能
  const { t } = useLanguage();
  
  // 獲取當前日期時間信息
  const currentDateTimeInfo = getCurrentDateTimeInfo();

  const [currentTime, setCurrentTime] = useState('--:--');
  const [selectedCardType, setSelectedCardType] = useState(t('replenishApply.clockIn'));
  const [reason, setReason] = useState(t('replenishApply.businessTrip'));
  const [illustrate, setIllustrate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState('');
  const [error, setError] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null); // 存儲員工資料
  const [companyId, setCompanyId] = useState(""); // 公司ID
  const [employeeId, setEmployeeId] = useState(""); // 員工ID
  const [authToken, setAuthToken] = useState(''); // 認證令牌
  const authInProgress = useRef(false); // 使用 ref 追蹤認證進度
  const formSubmitInProgress = useRef(false); // 使用 ref 追蹤表單提交進度

  // 日期和時間的狀態 - 初始化為當前日期和時間
  const [replenishDate, setReplenishDate] = useState(currentDateTimeInfo.formattedDate);
  const [originalTime, setOriginalTime] = useState(currentDateTimeInfo.formattedTime);
  const [modifiedTime, setModifiedTime] = useState(currentDateTimeInfo.formattedTime);

  // 日期和時間選擇器狀態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showReasonOptions, setShowReasonOptions] = useState(false);
  const [isEditingOriginal, setIsEditingOriginal] = useState(true); // 標記是否編輯原始時間
  const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday); // 星期幾

  // 補卡事由選項 - 使用翻譯
  const reasonOptions = [
    { name: t('replenishApply.businessTrip'), category: t('replenishApply.reasonCategory') },
    { name: t('replenishApply.forgotToClock'), category: t('replenishApply.reasonCategory') },
    { name: t('replenishApply.personalBusiness'), category: t('replenishApply.reasonCategory') },
    { name: t('replenishApply.other'), category: t('replenishApply.reasonCategory') }
  ];

  // 將 cookie 工具函數移到 useRef 中，避免重新創建
  const cookieUtils = useRef({
    get: (name) => {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        if (key && value) {
          acc[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        return acc;
      }, {});
      return cookies[name];
    },
    
    set: (name, value, expirationHours = 3) => {
      const date = new Date();
      date.setTime(date.getTime() + (expirationHours * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};${expires};path=/`;
      console.log(`已設置 cookie: ${name}=${value}, 有效期 ${expirationHours} 小時`);
    },
    
    remove: (name) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }).current;

  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

  // 生成本地表單ID - 不再依賴API
  useEffect(() => {
    if (!companyId || formId) return; // 如果已經有 formId 或沒有 companyId，則不執行
    
    try {
      // 直接生成本地表單ID
      const localFormId = `FORM-${companyId}-${Date.now()}`;
      setFormId(localFormId);
      console.log(`已生成本地表單ID: ${localFormId}`);
    } catch (err) {
      console.error('生成表單ID時發生錯誤:', err);
      setError(t('errors.dataLoadFailed'));
    }
  }, [companyId, formId, t]);

  // 查詢員工基本資料 - 使用從 function.js 引入的函數
  const fetchEmployeeInfo = useCallback(async () => {
    await fetchEmployeeInfoFunction(
      companyId, 
      employeeId, 
      authToken, 
      setLoading, 
      setEmployeeInfo, 
      setError, 
      cookieUtils,
      authInProgress
    );
  }, [companyId, employeeId, authToken, cookieUtils]);

  // 當認證資訊更新後，獲取員工資料
  useEffect(() => {
    if (companyId && employeeId && authToken) {
      fetchEmployeeInfo();
    }
  }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

  // 處理日期點擊
  const handleDateClick = () => {
    setShowDatePicker(true);
  };
  
  // 處理時間點擊
  const handleTimeClick = (isOriginal) => {
    setIsEditingOriginal(isOriginal);
    setShowTimePicker(true);
  };
  
  // 處理日期選擇 - 修改版本，實現自動流程
  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[date.getDay()];
    
    setReplenishDate(`${year}年 ${month}月${day}日 ${weekday}`);
    setSelectedWeekday(weekday);
    setShowDatePicker(false);
    
    // 選擇完日期後自動開啟原始時間選擇
    setTimeout(() => {
      setIsEditingOriginal(true); // 設置為編輯原始時間
      setShowTimePicker(true);
    }, 300);
  };
  
  // 處理時間選擇 - 修改版本，實現自動流程
  const handleTimeSelect = (hour, minute) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    if (isEditingOriginal) {
      // 選擇原始時間
      setOriginalTime(formattedTime);
      setShowTimePicker(false);
      
      // 自動開啟修改時間選擇
      setTimeout(() => {
        setIsEditingOriginal(false); // 切換到編輯修改時間
        setShowTimePicker(true);
      }, 300);
      
    } else {
      // 選擇修改時間
      setModifiedTime(formattedTime);
      setShowTimePicker(false);
      
      // 完成所有選擇，重置狀態
      setIsEditingOriginal(true); // 重置為編輯原始時間狀態，以備下次使用
    }
  };

  // 處理表單提交 - 使用從 function.js 引入的函數
  const handleSubmit = async () => {
    const result = await submitReplenishForm({
      loading,
      formSubmitInProgress,
      companyId,
      employeeId,
      authToken,
      illustrate,
      replenishDate,
      originalTime,
      modifiedTime,
      reason,
      selectedCardType,
      employeeInfo,
      cookieUtils,
      setLoading,
      setFormSubmitted,
      setError
    });
    
    if (result && result.success) {
      window.location.href = '/replenishpmx';
    }
  };
  
  // 處理返回首頁 - 使用從 function.js 引入的函數
  const handleGoHome = () => {
    handleGoHomeFunction('/frontpagepmx'); // 🔥 修改為 PMX 首頁路徑
  };
  
  const handleCancel = () => {
    console.log('取消補卡申請');
    window.location.href = '/replenishpmx'; // 🔥 修改為相對路徑
  };
  
  const handleCardTypeChange = (type) => {
    setSelectedCardType(type);
  };
  
  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason.name);
    setShowReasonOptions(false);
  };
  
  const handleIllustrateChange = (e) => {
    setIllustrate(e.target.value);
  };

  // 添加全局樣式以防止滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  // 添加錯誤處理組件
  const ErrorMessage = ({ message, onClose }) => {
    return (
      <div className="replenish-apply-error-container">
        <div className="replenish-apply-error-message">
          <div className="replenish-apply-error-icon">⚠️</div>
          <div className="replenish-apply-error-text">{message}</div>
          <button className="replenish-apply-error-close" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div className="replenish-apply-container">
      <div className="replenish-apply-wrapper">
        <header className="replenish-apply-header">
          <div className="replenish-apply-home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt={t('home.title')} width="20" height="20" />
          </div>
          <div className="replenish-apply-page-title">{t('replenishApply.title')}</div>
          {/* 語言切換器 */}
          <div className="replenish-apply-language-switch">
            <LanguageSwitch 
              className="replenish-apply-language-switch-component"
              containerClassName="replenish-apply-language-container"
              position="relative"
            />
          </div>
        </header>

        {/* 顯示錯誤訊息 */}
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        <div className="replenish-apply-form-container">
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">{t('replenishApply.type')}</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-card-type-container">
                <button 
                  className={`replenish-apply-card-type-button ${selectedCardType === t('replenishApply.clockIn') ? 'replenish-apply-card-type-button-active' : ''}`}
                  onClick={() => handleCardTypeChange(t('replenishApply.clockIn'))}
                >
                  {t('replenishApply.clockIn')}
                </button>
                <button 
                  className={`replenish-apply-card-type-button ${selectedCardType === t('replenishApply.clockOut') ? 'replenish-apply-card-type-button-active' : ''}`}
                  onClick={() => handleCardTypeChange(t('replenishApply.clockOut'))}
                >
                  {t('replenishApply.clockOut')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">{t('replenishApply.reason')}</div>
            <div className="replenish-apply-form-value">
              <div 
                className="replenish-apply-reason-selector" 
                onClick={() => setShowReasonOptions(true)}
              >
                <div className="replenish-apply-reason-name">{reason}</div>
                <div className="replenish-apply-dropdown-icon">▼</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">{t('replenishApply.date')}</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-date-time-row">
                <div className="replenish-apply-date-time" onClick={handleDateClick}>{replenishDate}</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">{t('replenishApply.originalTime')}</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-date-time-row">
                <div className="replenish-apply-time-input" onClick={() => handleTimeClick(true)}>{originalTime}</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">{t('replenishApply.modifiedTime')}</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-date-time-row">
                <div className="replenish-apply-time-input" onClick={() => handleTimeClick(false)}>{modifiedTime}</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-description-container">
            <div className="replenish-apply-description-label">{t('replenishApply.description')}</div>
            <textarea
              className="replenish-apply-description-textarea"
              placeholder={t('replenishApply.descriptionPlaceholder')}
              value={illustrate}
              onChange={handleIllustrateChange}
            ></textarea>
          </div>
        </div>
        
        <div className="replenish-apply-button-container">
          <button 
            className="replenish-apply-cancel-button"
            onClick={handleCancel}
            disabled={loading || formSubmitInProgress.current}
          >
            {t('replenishApply.cancel')}
          </button>
          <button 
            className={`replenish-apply-submit-button ${loading || formSubmitInProgress.current ? 'replenish-apply-button-loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading || formSubmitInProgress.current}
          >
            {loading || formSubmitInProgress.current ? t('replenishApply.submitting') : t('replenishApply.submit')}
          </button>
        </div>
        
        {/* 事由選項列表 */}
        {showReasonOptions && (
          <>
            <div className="replenish-apply-overlay" onClick={() => setShowReasonOptions(false)}></div>
            <div className="replenish-apply-reason-options-container">
              <div className="replenish-apply-reason-category">{t('replenishApply.reasonCategory')}</div>
              {reasonOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="replenish-apply-reason-option"
                  onClick={() => handleReasonSelect(option)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* 使用引入的日期選擇器組件 */}
        <CalendarSelector
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDateSelect}
          isEditingStart={true} // 補卡申請只有一個日期
        />
        
        {/* 使用引入的時間選擇器組件 */}
        <TimeSelector
          isVisible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onTimeSelect={handleTimeSelect}
          currentTime={isEditingOriginal ? originalTime : modifiedTime}
          isEditingStart={isEditingOriginal}
        />
        
        {/* 載入中指示器 */}
        {loading && (
          <div className="replenish-apply-loading-overlay">
            <div className="replenish-apply-loading-spinner"></div>
            <div className="replenish-apply-loading-text">{t('replenishApply.processingPleaseWait')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReplenishApply;
