// // import { 
// //   validateUserFromCookies, 
// //   fetchAttendanceRecords, 
// //   processAttendanceData,
// //   calculateDateRange,
// //   formatTimeToMinutes,
// //   getDayOfWeek
// // } from './function/function'; // 引入共用函數

// // import React, { useState, useEffect, useMemo, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './PMX_CSS/AttendancePagePMX.css';
// // import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// // import { useLanguage } from './Hook/useLanguage'; // 添加多語言支持
// // import LanguageSwitch from './components/LanguageSwitch'; // 添加語言切換組件

// // const NEW_API_URL = "https://rabbit.54ucl.com:3004"; // 新系統API基礎地址

// // function AttendancePage() {
// //   // 添加多語言支持
// //   const { t, currentLanguage } = useLanguage();
  
// //   // 狀態定義
// //   const [currentTime, setCurrentTime] = useState('');
// //   const [statusFilter, setStatusFilter] = useState(t('attendance.filters.unlimited'));
// //   const [resultFilter, setResultFilter] = useState(t('attendance.filters.unlimited'));
// //   const [timeFilter, setTimeFilter] = useState(t('attendance.filters.thisMonth'));
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [noRecords, setNoRecords] = useState(false);
// //   const [employeeInfo, setEmployeeInfo] = useState(null);
// //   const [validatedCompanyId, setValidatedCompanyId] = useState('');
// //   const [validatedEmployeeId, setValidatedEmployeeId] = useState('');
// //   const [showStatusPicker, setShowStatusPicker] = useState(false);
// //   const navigate = useNavigate();
// //   const isInitialMount = useRef(true);
// //   const flutterMessageHandler = useRef(null);

// //   // 狀態選項 - 使用多語言
// //   const statusOptions = [
// //     t('attendance.statusOptions.unlimited'),
// //     t('attendance.statusOptions.onTime'),
// //     t('attendance.statusOptions.leave'),
// //     t('attendance.statusOptions.late'),
// //     t('attendance.statusOptions.earlyLeave'),
// //     t('attendance.statusOptions.absent')
// //   ];

// //   // 當語言變更時重置篩選器
// //   useEffect(() => {
// //     setStatusFilter(t('attendance.filters.unlimited'));
// //     setResultFilter(t('attendance.filters.unlimited'));
// //     setTimeFilter(t('attendance.filters.thisMonth'));
// //   }, [currentLanguage, t]);

// //   // 修改狀態映射函數
// //   const mapStatusToKey = (status) => {
// //     const statusMap = {
// //       [t('attendance.statusOptions.unlimited')]: '不限',
// //       [t('attendance.statusOptions.onTime')]: '準時',
// //       [t('attendance.statusOptions.leave')]: '請假',
// //       [t('attendance.statusOptions.late')]: '遲到',
// //       [t('attendance.statusOptions.earlyLeave')]: '早退',
// //       [t('attendance.statusOptions.absent')]: '曠職'
// //     };
// //     return statusMap[status] || status;
// //   };

// //   // 修改時間篩選映射函數
// //   const mapTimeFilterToKey = (timeFilter) => {
// //     const timeMap = {
// //       [t('attendance.filters.lastMonth')]: '上月',
// //       [t('attendance.filters.thisMonth')]: '本月'
// //     };
// //     return timeMap[timeFilter] || timeFilter;
// //   };

// //   // 修改結果篩選映射函數
// //   const mapResultFilterToKey = (resultFilter) => {
// //     const resultMap = {
// //       [t('attendance.filters.unlimited')]: '不限',
// //       [t('attendance.filters.normal')]: '正常',
// //       [t('attendance.filters.abnormal')]: '異常'
// //     };
// //     return resultMap[resultFilter] || resultFilter;
// //   };

// //   // 修改狀態標籤映射函數
// //   const getStatusTagText = (statusText) => {
// //     const statusTagMap = {
// //       '準時': t('attendance.statusTags.onTime'),
// //       '遲到': t('attendance.statusTags.late'),
// //       '早退': t('attendance.statusTags.earlyLeave'),
// //       '曠職': t('attendance.statusTags.absent'),
// //       '請假': t('attendance.statusTags.leave'),
// //       '異常': t('attendance.statusTags.abnormal')
// //     };
// //     return statusTagMap[statusText] || statusText;
// //   };

// //   // 從 cookies 獲取值的函數 - 增強版，支持 Flutter WebView
// //   const getCookie = (name) => {
// //     try {
// //       // 方法1: 標準 document.cookie 方式
// //       const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
// //         const [key, value] = cookie.split('=');
// //         acc[key] = value;
// //         return acc;
// //       }, {});

// //       // 方法2: 從 URL 參數獲取 (Flutter WebView 常用方法)
// //       const urlParams = new URLSearchParams(window.location.search);
// //       const paramValue = urlParams.get(name);
      
// //       // 方法3: 從 localStorage 獲取 (Flutter 可能存儲在這裡)
// //       const localStorageValue = localStorage.getItem(name);
      
// //       // 方法4: 從 sessionStorage 獲取
// //       const sessionStorageValue = sessionStorage.getItem(name);
      
// //       // 按優先順序返回值
// //       return cookies[name] || paramValue || localStorageValue || sessionStorageValue || null;
// //     } catch (e) {
// //       console.error('獲取 cookie 時出錯:', e);
// //       return null;
// //     }
// //   };

// //   // 設置 Flutter 消息處理器
// //   useEffect(() => {
// //     // 設置 Flutter 消息處理函數
// //     const handleFlutterMessage = (event) => {
// //       try {
// //         const data = JSON.parse(event.data);
// //         console.log('收到 Flutter 消息:', data);
        
// //         // 如果收到認證資訊，更新狀態
// //         if (data.company_id && data.employee_id) {
// //           console.log('從 Flutter 獲取認證資訊:', data);
// //           setValidatedCompanyId(data.company_id);
// //           setValidatedEmployeeId(data.employee_id);
          
// //           // 可選：保存到 localStorage 以便後續使用
// //           localStorage.setItem('company_id', data.company_id);
// //           localStorage.setItem('employee_id', data.employee_id);
// //         }
// //       } catch (e) {
// //         console.error('處理 Flutter 消息時出錯:', e);
// //       }
// //     };

// //     // 註冊 Flutter 消息監聽器
// //     if (window.flutter) {
// //       window.addEventListener('message', handleFlutterMessage);
// //       flutterMessageHandler.current = handleFlutterMessage;
      
// //       // 通知 Flutter 頁面已準備好接收數據
// //       try {
// //         window.flutter.postMessage(JSON.stringify({ action: 'page_ready', page: 'attendance' }));
// //       } catch (e) {
// //         console.error('無法發送準備就緒消息到 Flutter:', e);
// //       }
// //     }
    
// //     // 監聽 Flutter WebView 就緒事件
// //     document.addEventListener('flutterInAppWebViewPlatformReady', (event) => {
// //       console.log('Flutter WebView 已準備就緒');
// //       // 請求認證資訊
// //       if (window.flutter) {
// //         try {
// //           window.flutter.postMessage(JSON.stringify({ action: 'request_auth_info' }));
// //         } catch (e) {
// //           console.error('無法請求認證資訊:', e);
// //         }
// //       }
// //     });

// //     return () => {
// //       // 清理監聽器
// //       if (flutterMessageHandler.current) {
// //         window.removeEventListener('message', flutterMessageHandler.current);
// //       }
// //     };
// //   }, []);

// //   // 初始驗證
// //   useEffect(() => {
// //     if (isInitialMount.current) {
// //       console.log('初始驗證: 從 cookies/Flutter 驗證用戶身份');
// //       // 使用引入的驗證函數
// //       validateUserFromCookies(
// //         setLoading,
// //         null, // 不需要設置 authToken
// //         setValidatedCompanyId,
// //         setValidatedEmployeeId,
// //         '/applogin01/'
// //       );
// //       isInitialMount.current = false;
// //     }
// //   }, []);

// //   // 監聽認證狀態變化，當獲取到有效認證時自動加載數據
// //   useEffect(() => {
// //     if (validatedCompanyId && validatedEmployeeId) {
// //       console.log('認證狀態變化: 檢測到有效認證，加載數據');
// //       fetchAttendanceData();
// //     }
// //   }, [validatedCompanyId, validatedEmployeeId]);

// //   // 獲取出勤數據
// //   useEffect(() => {
// //     if (validatedCompanyId && validatedEmployeeId) {
// //       fetchAttendanceData();
// //     }
// //   }, [timeFilter, statusFilter]);

// //   // 根據 resultFilter 篩選資料
// //   useEffect(() => {
// //     if (attendanceData.length > 0) {
// //       applyResultFilter();
// //     }
// //   }, [resultFilter, attendanceData]);

// //   // 修改結果篩選函數
// //   const applyResultFilterWithData = (data) => {
// //     const mappedFilter = mapResultFilterToKey(resultFilter);
    
// //     if (mappedFilter === '不限') {
// //       setFilteredAttendanceData(data);
// //     } else if (mappedFilter === '正常') {
// //       const filtered = data.filter(record => 
// //         !record.checkInAbnormal && !record.checkOutAbnormal
// //       );
// //       setFilteredAttendanceData(filtered);
// //     } else if (mappedFilter === '異常') {
// //       const filtered = data.filter(record => 
// //         record.checkInAbnormal || record.checkOutAbnormal
// //       );
// //       setFilteredAttendanceData(filtered);
// //     }
// //   };

// //   // 應用結果篩選邏輯
// //   const applyResultFilter = () => {
// //     if (attendanceData.length > 0) {
// //       applyResultFilterWithData(attendanceData);
// //     }
// //   };

// //   // 根據選擇的月份獲取數據
// //   const fetchAttendanceData = async () => {
// //     if (!validatedCompanyId || !validatedEmployeeId) {
// //       console.log('獲取數據失敗: 缺少認證資訊');
// //       // 只在本月模式顯示錯誤
// //       if (mapTimeFilterToKey(timeFilter) === '本月') {
// //         setError(t('attendance.messages.employeeNotFound'));
// //       } else {
// //         setNoRecords(true);
// //       }
// //       return;
// //     }
    
// //     console.log(`開始獲取出勤數據，使用認證資訊: 公司ID=${validatedCompanyId}, 員工ID=${validatedEmployeeId}`);
    
// //     setLoading(true);
// //     setError(null);
// //     setNoRecords(false);

// //     try {
// //       // 使用共用函數計算日期範圍
// //       const { startDate, endDate, targetYear, targetMonth } = calculateDateRange(mapTimeFilterToKey(timeFilter));
      
// //       console.log(`查詢從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
// //       // 使用共用函數獲取出勤記錄
// //       const result = await fetchAttendanceRecords(
// //         validatedCompanyId, 
// //         validatedEmployeeId, 
// //         startDate, 
// //         endDate, 
// //         mapStatusToKey(statusFilter)
// //       );
      
// //       if (result.success) {
// //         console.log(`成功獲取出勤記錄:`, result.data);
        
// //         // 使用共用函數處理出勤數據
// //         const processedData = await processAttendanceData(result.data, targetYear, targetMonth);
        
// //         setAttendanceData(processedData);
        
// //         // 應用結果篩選
// //         if (processedData.length === 0) {
// //           // 根據時間篩選設定不同的處理方式
// //           if (mapTimeFilterToKey(timeFilter) === '上月') {
// //             setNoRecords(true);  // 上月無記錄時設置無記錄狀態
// //           } else {
// //             setError(t('attendance.messages.noRecordsThisMonth'));
// //           }
// //           setFilteredAttendanceData([]);
// //         } else {
// //           // 應用結果篩選
// //           applyResultFilterWithData(processedData);
// //         }
// //       } else {
// //         console.error('獲取出勤記錄失敗:', result.message);
// //         // 根據時間篩選設定不同的處理方式
// //         if (mapTimeFilterToKey(timeFilter) === '上月') {
// //           setNoRecords(true);  // 上月無記錄時設置無記錄狀態
// //         } else {
// //           setError(`${t('attendance.messages.fetchFailed')}: ${result.message || t('attendance.errors.networkError')}`);
// //         }
// //         setAttendanceData([]);
// //         setFilteredAttendanceData([]);
// //       }
// //     } catch (err) {
// //       console.error('獲取出勤數據失敗:', err);
// //       // 根據時間篩選設定不同的處理方式
// //       if (mapTimeFilterToKey(timeFilter) === '上月') {
// //         setNoRecords(true);  // 上月無記錄時設置無記錄狀態
// //       } else {
// //         setError(`${t('attendance.messages.dataLoadFailed')}: ${err.message}`);
// //       }
// //       setAttendanceData([]);
// //       setFilteredAttendanceData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 顯示當前選擇的月份
// //   const getCurrentMonthDisplay = useMemo(() => {
// //     const now = new Date();
// //     let targetMonth, targetYear;

// //     if (mapTimeFilterToKey(timeFilter) === '本月') {
// //       targetMonth = now.getMonth() + 1;
// //       targetYear = now.getFullYear();
// //     } else {
// //       targetMonth = now.getMonth();
// //       if (targetMonth === 0) {
// //         targetMonth = 12;
// //         targetYear = now.getFullYear() - 1;
// //       } else {
// //         targetYear = now.getFullYear();
// //       }
// //     }

// //     return `${targetYear}年${targetMonth}月`;
// //   }, [timeFilter, t]);

// //   // 重試功能
// //   const handleRetry = () => {
// //     setError(null);
// //     // 使用引入的驗證函數
// //     validateUserFromCookies(
// //       setLoading,
// //       null, // 不需要設置 authToken
// //       setValidatedCompanyId,
// //       setValidatedEmployeeId,
// //       '/applogin01/'
// //     ); // 重新驗證並獲取數據
// //   };

// //   // 處理狀態選擇
// //   const handleStatusSelect = (status) => {
// //     setStatusFilter(status);
// //     setShowStatusPicker(false);
// //   };

// //   // 處理返回首頁 - 修改為使用 replace 而不是 href
// //   const handleGoHome = () => {
// //     // 檢查是否為手機 app 環境
// //     const isInMobileApp = () => {
// //       // 檢查是否存在 Flutter 相關的全域變數或特定的 User-Agent
// //       // 或者檢查 URL 參數中是否有 app 標記
// //       const urlParams = new URLSearchParams(window.location.search);
// //       const isApp = urlParams.get('platform') === 'app';
      
// //       // 檢查 User-Agent 是否包含 Flutter 相關標記
// //       const userAgent = navigator.userAgent.toLowerCase();
// //       const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
// //       // 檢查是否有 Flutter 注入的全域變數或方法
// //       const hasFlutterContext = 
// //         typeof window.flutter !== 'undefined' || 
// //         typeof window.FlutterNativeWeb !== 'undefined';
        
// //       return isApp || hasFlutterAgent || hasFlutterContext;
// //     };

// //     if (isInMobileApp()) {
// //       // 如果是 app 環境，使用 Flutter 的導航方法
// //       console.log('檢測到 App 環境，使用 Flutter 導航');
      
// //       try {
// //         // 嘗試調用 Flutter 提供的導航方法，添加 replace 參數
// //         if (window.flutter && window.flutter.postMessage) {
// //           window.flutter.postMessage(JSON.stringify({ 
// //             action: 'navigate_home',
// //             replace: true // 添加 replace 參數
// //           }));
// //         } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
// //           window.FlutterNativeWeb.postMessage(JSON.stringify({ 
// //             action: 'navigate_home',
// //             replace: true // 添加 replace 參數
// //           }));
// //         } else {
// //           // 發送自定義事件，Flutter 可以監聽此事件
// //           const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
// //             detail: { 
// //               action: 'navigate_home',
// //               replace: true // 添加 replace 參數
// //             }
// //           });
// //           document.dispatchEvent(event);
// //         }
// //       } catch (err) {
// //         console.error('無法使用 Flutter 導航:', err);
// //         // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用 replace 導航
// //         window.location.replace('/frontpagepmx');
// //       }
// //     } else {
// //       // 如果是瀏覽器環境，使用 window.location.replace 導航
// //       console.log('瀏覽器環境，使用 window.location.replace 導航');
// //       window.location.replace('/frontpagepmx');
// //     }
// //   };

// //   // 添加登出/切換帳號處理函數
// //   const handleLogout = () => {
// //     // 清除狀態
// //     setValidatedCompanyId('');
// //     setValidatedEmployeeId('');
// //     setAttendanceData([]);
// //     setFilteredAttendanceData([]);
    
// //     // 清除 localStorage
// //     localStorage.removeItem('company_id');
// //     localStorage.removeItem('employee_id');
    
// //     // 通知 Flutter 登出
// //     if (window.flutter) {
// //       try {
// //         window.flutter.postMessage(JSON.stringify({ action: 'logout' }));
// //       } catch (e) {
// //         console.error('無法通知 Flutter 登出:', e);
// //       }
// //     }
    
// //     // 重新導向到登入頁面
// //     window.location.replace = '/applogin01/';
// //   };

// //   // 添加錯誤處理組件
// //   const ErrorMessage = ({ message, onClose }) => {
// //     return (
// //       <div className="attendance-error-container">
// //         <div className="attendance-error-message">
// //           <div className="attendance-error-icon">⚠️</div>
// //           <div className="attendance-error-text">{message}</div>
// //           <button className="attendance-error-close" onClick={onClose}>✕</button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="attendance-container">
// //       <div className="attendance-app-wrapper" data-language={currentLanguage}>
// //         {/* 頁面標題與語言選擇 */}
// //         <header className="attendance-header">
// //           <div className="attendance-home-icon" onClick={handleGoHome}>
// //             <img 
// //               src={homeIcon} 
// //               alt={t('attendance.home')} 
// //               width="20" 
// //               height="20" 
// //               style={{ objectFit: 'contain' }}
// //             />
// //           </div>
// //           <div className="attendance-page-title">{t('attendance.title')}</div>
          
// //           {/* 語言切換按鈕 */}
// //           <LanguageSwitch className="attendance-language-switch" />
// //         </header>

// //         {/* 顯示錯誤訊息 - 只在本月且有真正錯誤時顯示 */}
// //         {error && mapTimeFilterToKey(timeFilter) === '本月' && error !== t('attendance.messages.noRecords') && error !== t('attendance.messages.noRecordsThisMonth') && (
// //           <ErrorMessage 
// //             message={error} 
// //             onClose={() => setError(null)} 
// //           />
// //         )}
        
// //         {/* 篩選區域 */}
// //         <div className="attendance-filter-section">
// //           {/* 出勤狀況 */}
// //           <div className="attendance-filter-group">
// //             <div className="attendance-filter-label">{t('attendance.filters.attendanceStatus')}</div>
// //             <div 
// //               className="attendance-status-selector"
// //               onClick={() => setShowStatusPicker(true)}
// //             >
// //               <span className="attendance-status-value">{statusFilter}</span>
// //               <span className="attendance-dropdown-arrow">▼</span>
// //             </div>
// //           </div>
          
// //           {/* 打卡結果 */}
// //           <div className="attendance-filter-group">
// //             <div className="attendance-filter-label">{t('attendance.filters.punchResult')}</div>
// //             <div className="attendance-button-group">
// //               <button 
// //                 className={`attendance-button ${resultFilter === t('attendance.filters.unlimited') ? 'active' : ''}`}
// //                 onClick={() => setResultFilter(t('attendance.filters.unlimited'))}
// //               >
// //                 {t('attendance.filters.unlimited')}
// //               </button>
// //               <button 
// //                 className={`attendance-button ${resultFilter === t('attendance.filters.normal') ? 'active' : ''}`}
// //                 onClick={() => setResultFilter(t('attendance.filters.normal'))}
// //               >
// //                 {t('attendance.filters.normal')}
// //               </button>
// //               <button 
// //                 className={`attendance-button ${resultFilter === t('attendance.filters.abnormal') ? 'active' : ''}`}
// //                 onClick={() => setResultFilter(t('attendance.filters.abnormal'))}
// //               >
// //                 {t('attendance.filters.abnormal')}
// //               </button>
// //             </div>
// //           </div>
          
// //           {/* 時間 */}
// //           <div className="attendance-filter-group">
// //             <div className="attendance-filter-label">{t('attendance.filters.time')}</div>
// //             <div className="attendance-button-group">
// //               <button 
// //                 className={`attendance-button ${timeFilter === t('attendance.filters.lastMonth') ? 'active' : ''}`}
// //                 onClick={() => setTimeFilter(t('attendance.filters.lastMonth'))}
// //               >
// //                 {t('attendance.filters.lastMonth')}
// //               </button>
// //               <button 
// //                 className={`attendance-button ${timeFilter === t('attendance.filters.thisMonth') ? 'active' : ''}`}
// //                 onClick={() => setTimeFilter(t('attendance.filters.thisMonth'))}
// //               >
// //                 {t('attendance.filters.thisMonth')}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* 出勤紀錄表格 */}
// //         <div className="attendance-table-container">
// //           <table className="attendance-table">
// //             <thead>
// //               <tr>
// //                 <th className="attendance-date-column"></th>
// //                 <th className="attendance-time-column">{t('attendance.table.clockInTime')}</th>
// //                 <th className="attendance-time-column">{t('attendance.table.clockOutTime')}</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan="3" className="attendance-loading-text">{t('attendance.messages.loading')}</td>
// //                 </tr>
// //               ) : noRecords || (error && !filteredAttendanceData.length) ? (
// //                 <tr>
// //                   <td colSpan="3" className="attendance-error-text">
// //                     {t('attendance.messages.noRecords')}
// //                     {/* 只在本月且有真正錯誤時顯示重試按鈕 */}
// //                     {mapTimeFilterToKey(timeFilter) === '本月' && error && error !== t('attendance.messages.noRecords') && error !== t('attendance.messages.noRecordsThisMonth') && (
// //                       <button className="attendance-retry-button" onClick={handleRetry}>
// //                         {t('attendance.messages.retry')}
// //                       </button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ) : filteredAttendanceData.length === 0 ? (
// //                 <tr>
// //                   <td colSpan="3" className="attendance-loading-text">{t('attendance.messages.noMatchingRecords')}</td>
// //                 </tr>
// //               ) : (
// //                 filteredAttendanceData.map((record, index) => {
// //                   return (
// //                     <tr key={index} className={`attendance-table-row ${
// //                       record.isAbsent 
// //                         ? 'attendance-absent-row'  // 曠職記錄使用灰色背景
// //                         : (record.checkInAbnormal || record.checkOutAbnormal) 
// //                           ? 'attendance-late-row'  // 其他異常記錄（如遲到、早退）使用紅色背景
// //                           : ''
// //                     }`}>
// //                       {/* 日期欄位 */}
// //                       <td className="attendance-date-cell">
// //                         <div className="attendance-date-block">
// //                           <div className="attendance-date-number">{record.date}</div>
// //                           <div className="attendance-day-of-week">{record.day}</div>
// //                         </div>
// //                       </td>
                      
// //                       {/* 上班打卡時間 */}
// //                       <td className="attendance-time-cell">
// //                         {record.isAbsent ? (
// //                           <div className="attendance-status-tag">{getStatusTagText('曠職')}</div>
// //                         ) : record.checkInResultText && record.checkInResultText !== '準時' && (
// //                           <div className="attendance-status-tag">{getStatusTagText(record.checkInResultText)}</div>
// //                         )}
// //                         <span className={record.checkInAbnormal ? 'attendance-abnormal-time' : ''}>
// //                           {record.checkIn}
// //                         </span>
// //                         {!record.isAbsent && record.checkInAbnormal && (
// //                           <span className="attendance-abnormal-label">{getStatusTagText('異常')}</span>
// //                         )}
// //                       </td>
                      
// //                       {/* 下班打卡時間 */}
// //                       <td className="attendance-time-cell">
// //                         {record.isAbsent ? (
// //                           <div className="attendance-status-tag">{getStatusTagText('曠職')}</div>
// //                         ) : record.checkOutResultText && record.checkOutResultText !== '準時' && (
// //                           <div className="attendance-status-tag">{getStatusTagText(record.checkOutResultText)}</div>
// //                         )}
// //                         <span className={record.checkOutAbnormal ? 'attendance-abnormal-time' : ''}>
// //                           {record.checkOut === '--:--' ? '--:--' : record.checkOut}
// //                         </span>
// //                         {!record.isAbsent && record.checkOutAbnormal && (
// //                           <span className="attendance-abnormal-label">{getStatusTagText('異常')}</span>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   );
// //                 })
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* 載入中指示器 */}
// //         {loading && (
// //           <div className="attendance-loading-overlay">
// //             <div className="attendance-loading-spinner"></div>
// //             <div className="attendance-loading-text">{t('attendance.messages.processing')}</div>
// //           </div>
// //         )}

// //         {/* 狀態選擇器彈出視窗 */}
// //         {showStatusPicker && (
// //           <div className="attendance-picker-overlay" onClick={() => setShowStatusPicker(false)}>
// //             <div className="attendance-picker-container" onClick={(e) => e.stopPropagation()}>
// //               <div className="attendance-picker-header">
// //                 <span className="attendance-picker-title">{t('attendance.picker.attendanceStatus')}</span>
// //                 <button 
// //                   className="attendance-picker-close"
// //                   onClick={() => setShowStatusPicker(false)}
// //                 >
// //                   ✕
// //                 </button>
// //               </div>
// //               <div className="attendance-picker-options">
// //                 {statusOptions.map((option) => (
// //                   <div
// //                     key={option}
// //                     className={`attendance-picker-option ${statusFilter === option ? 'selected' : ''}`}
// //                     onClick={() => handleStatusSelect(option)}
// //                   >
// //                     {option}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default AttendancePage;
// import { 
//   validateUserFromCookies, 
//   fetchAttendanceRecords, 
//   processAttendanceData,
//   calculateDateRange,
//   formatTimeToMinutes,
//   getDayOfWeek,
//   // 🔥 新增：引入員工編號映射功能
//   mapPmxToBasicEmployeeId,
//   mapBasicToPmxEmployeeId,
//   hasEmployeeIdMapping
// } from './function/function'; // 引入共用函數

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './PMX_CSS/AttendancePagePMX.css';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import { useLanguage } from './Hook/useLanguage'; // 添加多語言支持
// import LanguageSwitch from './components/LanguageSwitch'; // 添加語言切換組件

// const NEW_API_URL = "https://rabbit.54ucl.com:3004"; // 新系統API基礎地址

// function AttendancePage() {
//   // 添加多語言支持
//   const { t, currentLanguage } = useLanguage();
  
//   // 狀態定義
//   const [currentTime, setCurrentTime] = useState('');
//   const [statusFilter, setStatusFilter] = useState(t('attendance.filters.unlimited'));
//   const [resultFilter, setResultFilter] = useState(t('attendance.filters.unlimited'));
//   const [timeFilter, setTimeFilter] = useState(t('attendance.filters.thisMonth'));
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [noRecords, setNoRecords] = useState(false);
//   const [employeeInfo, setEmployeeInfo] = useState(null);
//   const [validatedCompanyId, setValidatedCompanyId] = useState('');
//   const [validatedEmployeeId, setValidatedEmployeeId] = useState('');
//   // 🔥 新增：原始員工編號和映射後的員工編號狀態
//   const [originalEmployeeId, setOriginalEmployeeId] = useState('');
//   const [mappedEmployeeId, setMappedEmployeeId] = useState('');
//   const [showStatusPicker, setShowStatusPicker] = useState(false);
//   const navigate = useNavigate();
//   const isInitialMount = useRef(true);
//   const flutterMessageHandler = useRef(null);

//   // 狀態選項 - 使用多語言
//   const statusOptions = [
//     t('attendance.statusOptions.unlimited'),
//     t('attendance.statusOptions.onTime'),
//     t('attendance.statusOptions.leave'),
//     t('attendance.statusOptions.late'),
//     t('attendance.statusOptions.earlyLeave'),
//     t('attendance.statusOptions.absent')
//   ];

//   // 🔥 新增：員工編號映射處理函數
//   const handleEmployeeIdMapping = (employeeId) => {
//     if (!employeeId) {
//       console.warn('員工編號為空，無法進行映射');
//       return employeeId;
//     }

//     console.log('開始處理員工編號映射:', employeeId);
    
//     // 儲存原始員工編號
//     setOriginalEmployeeId(employeeId);
    
//     // 檢查是否存在映射
//     if (hasEmployeeIdMapping(employeeId)) {
//       // 如果是 PMX 系統的員工編號，映射到 Basic 系統
//       const basicEmployeeId = mapPmxToBasicEmployeeId(employeeId);
//       console.log(`員工編號映射成功: ${employeeId} -> ${basicEmployeeId}`);
//       setMappedEmployeeId(basicEmployeeId);
//       return basicEmployeeId;
//     } else {
//       // 如果沒有映射，直接使用原始編號
//       console.log(`員工編號 ${employeeId} 不需要映射，使用原始編號`);
//       setMappedEmployeeId(employeeId);
//       return employeeId;
//     }
//   };

//   // 當語言變更時重置篩選器
//   useEffect(() => {
//     setStatusFilter(t('attendance.filters.unlimited'));
//     setResultFilter(t('attendance.filters.unlimited'));
//     setTimeFilter(t('attendance.filters.thisMonth'));
//   }, [currentLanguage, t]);

//   // 修改狀態映射函數
//   const mapStatusToKey = (status) => {
//     const statusMap = {
//       [t('attendance.statusOptions.unlimited')]: '不限',
//       [t('attendance.statusOptions.onTime')]: '準時',
//       [t('attendance.statusOptions.leave')]: '請假',
//       [t('attendance.statusOptions.late')]: '遲到',
//       [t('attendance.statusOptions.earlyLeave')]: '早退',
//       [t('attendance.statusOptions.absent')]: '曠職'
//     };
//     return statusMap[status] || status;
//   };

//   // 修改時間篩選映射函數
//   const mapTimeFilterToKey = (timeFilter) => {
//     const timeMap = {
//       [t('attendance.filters.lastMonth')]: '上月',
//       [t('attendance.filters.thisMonth')]: '本月'
//     };
//     return timeMap[timeFilter] || timeFilter;
//   };

//   // 修改結果篩選映射函數
//   const mapResultFilterToKey = (resultFilter) => {
//     const resultMap = {
//       [t('attendance.filters.unlimited')]: '不限',
//       [t('attendance.filters.normal')]: '正常',
//       [t('attendance.filters.abnormal')]: '異常'
//     };
//     return resultMap[resultFilter] || resultFilter;
//   };

//   // 修改狀態標籤映射函數
//   const getStatusTagText = (statusText) => {
//     const statusTagMap = {
//       '準時': t('attendance.statusTags.onTime'),
//       '遲到': t('attendance.statusTags.late'),
//       '早退': t('attendance.statusTags.earlyLeave'),
//       '曠職': t('attendance.statusTags.absent'),
//       '請假': t('attendance.statusTags.leave'),
//       '異常': t('attendance.statusTags.abnormal')
//     };
//     return statusTagMap[statusText] || statusText;
//   };

//   // 從 cookies 獲取值的函數 - 增強版，支持 Flutter WebView
//   const getCookie = (name) => {
//     try {
//       // 方法1: 標準 document.cookie 方式
//       const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//         const [key, value] = cookie.split('=');
//         acc[key] = value;
//         return acc;
//       }, {});

//       // 方法2: 從 URL 參數獲取 (Flutter WebView 常用方法)
//       const urlParams = new URLSearchParams(window.location.search);
//       const paramValue = urlParams.get(name);
      
//       // 方法3: 從 localStorage 獲取 (Flutter 可能存儲在這裡)
//       const localStorageValue = localStorage.getItem(name);
      
//       // 方法4: 從 sessionStorage 獲取
//       const sessionStorageValue = sessionStorage.getItem(name);
      
//       // 按優先順序返回值
//       return cookies[name] || paramValue || localStorageValue || sessionStorageValue || null;
//     } catch (e) {
//       console.error('獲取 cookie 時出錯:', e);
//       return null;
//     }
//   };

//   // 設置 Flutter 消息處理器
//   useEffect(() => {
//     // 設置 Flutter 消息處理函數
//     const handleFlutterMessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log('收到 Flutter 消息:', data);
        
//         // 如果收到認證資訊，更新狀態
//         if (data.company_id && data.employee_id) {
//           console.log('從 Flutter 獲取認證資訊:', data);
//           setValidatedCompanyId(data.company_id);
          
//           // 🔥 修改：對員工編號進行映射處理
//           const mappedEmployeeId = handleEmployeeIdMapping(data.employee_id);
//           setValidatedEmployeeId(mappedEmployeeId);
          
//           // 可選：保存到 localStorage 以便後續使用
//           localStorage.setItem('company_id', data.company_id);
//           localStorage.setItem('employee_id', mappedEmployeeId); // 儲存映射後的員工編號
//         }
//       } catch (e) {
//         console.error('處理 Flutter 消息時出錯:', e);
//       }
//     };

//     // 註冊 Flutter 消息監聽器
//     if (window.flutter) {
//       window.addEventListener('message', handleFlutterMessage);
//       flutterMessageHandler.current = handleFlutterMessage;
      
//       // 通知 Flutter 頁面已準備好接收數據
//       try {
//         window.flutter.postMessage(JSON.stringify({ action: 'page_ready', page: 'attendance' }));
//       } catch (e) {
//         console.error('無法發送準備就緒消息到 Flutter:', e);
//       }
//     }
    
//     // 監聽 Flutter WebView 就緒事件
//     document.addEventListener('flutterInAppWebViewPlatformReady', (event) => {
//       console.log('Flutter WebView 已準備就緒');
//       // 請求認證資訊
//       if (window.flutter) {
//         try {
//           window.flutter.postMessage(JSON.stringify({ action: 'request_auth_info' }));
//         } catch (e) {
//           console.error('無法請求認證資訊:', e);
//         }
//       }
//     });

//     return () => {
//       // 清理監聽器
//       if (flutterMessageHandler.current) {
//         window.removeEventListener('message', flutterMessageHandler.current);
//       }
//     };
//   }, []);

//   // 🔥 修改：初始驗證時也要處理員工編號映射
//   useEffect(() => {
//     if (isInitialMount.current) {
//       console.log('初始驗證: 從 cookies/Flutter 驗證用戶身份');
      
//       // 自定義設置函數，包含員工編號映射
//       const setValidatedCompanyIdWrapper = (companyId) => {
//         setValidatedCompanyId(companyId);
//       };
      
//       const setValidatedEmployeeIdWrapper = (employeeId) => {
//         if (employeeId) {
//           // 🔥 對員工編號進行映射處理
//           const mappedEmployeeId = handleEmployeeIdMapping(employeeId);
//           setValidatedEmployeeId(mappedEmployeeId);
//         }
//       };
      
//       // 使用引入的驗證函數
//       validateUserFromCookies(
//         setLoading,
//         null, // 不需要設置 authToken
//         setValidatedCompanyIdWrapper,
//         setValidatedEmployeeIdWrapper,
//         '/applogin01/'
//       );
//       isInitialMount.current = false;
//     }
//   }, []);

//   // 監聽認證狀態變化，當獲取到有效認證時自動加載數據
//   useEffect(() => {
//     if (validatedCompanyId && validatedEmployeeId) {
//       console.log('認證狀態變化: 檢測到有效認證，加載數據');
//       console.log(`使用映射後的員工編號進行查詢: 原始=${originalEmployeeId}, 映射後=${validatedEmployeeId}`);
//       fetchAttendanceData();
//     }
//   }, [validatedCompanyId, validatedEmployeeId]);

//   // 獲取出勤數據
//   useEffect(() => {
//     if (validatedCompanyId && validatedEmployeeId) {
//       fetchAttendanceData();
//     }
//   }, [timeFilter, statusFilter]);

//   // 根據 resultFilter 篩選資料
//   useEffect(() => {
//     if (attendanceData.length > 0) {
//       applyResultFilter();
//     }
//   }, [resultFilter, attendanceData]);

//   // 修改結果篩選函數
//   const applyResultFilterWithData = (data) => {
//     const mappedFilter = mapResultFilterToKey(resultFilter);
    
//     if (mappedFilter === '不限') {
//       setFilteredAttendanceData(data);
//     } else if (mappedFilter === '正常') {
//       const filtered = data.filter(record => 
//         !record.checkInAbnormal && !record.checkOutAbnormal
//       );
//       setFilteredAttendanceData(filtered);
//     } else if (mappedFilter === '異常') {
//       const filtered = data.filter(record => 
//         record.checkInAbnormal || record.checkOutAbnormal
//       );
//       setFilteredAttendanceData(filtered);
//     }
//   };

//   // 應用結果篩選邏輯
//   const applyResultFilter = () => {
//     if (attendanceData.length > 0) {
//       applyResultFilterWithData(attendanceData);
//     }
//   };

//   // 🔥 修改：根據選擇的月份獲取數據，使用映射後的員工編號
//   const fetchAttendanceData = async () => {
//     if (!validatedCompanyId || !validatedEmployeeId) {
//       console.log('獲取數據失敗: 缺少認證資訊');
//       // 只在本月模式顯示錯誤
//       if (mapTimeFilterToKey(timeFilter) === '本月') {
//         setError(t('attendance.messages.employeeNotFound'));
//       } else {
//         setNoRecords(true);
//       }
//       return;
//     }
    
//     console.log(`開始獲取出勤數據，使用認證資訊: 公司ID=${validatedCompanyId}, 員工ID=${validatedEmployeeId}`);
//     console.log(`員工編號映射資訊: 原始=${originalEmployeeId}, 映射後=${validatedEmployeeId}`);
    
//     setLoading(true);
//     setError(null);
//     setNoRecords(false);

//     try {
//       // 使用共用函數計算日期範圍
//       const { startDate, endDate, targetYear, targetMonth } = calculateDateRange(mapTimeFilterToKey(timeFilter));
      
//       console.log(`查詢從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
//       // 🔥 使用映射後的員工編號進行查詢
//       const result = await fetchAttendanceRecords(
//         validatedCompanyId, 
//         validatedEmployeeId, // 這裡使用的是映射後的員工編號
//         startDate, 
//         endDate, 
//         mapStatusToKey(statusFilter)
//       );
      
//       if (result.success) {
//         console.log(`成功獲取出勤記錄:`, result.data);
        
//         // 使用共用函數處理出勤數據
//         const processedData = await processAttendanceData(result.data, targetYear, targetMonth);
        
//         setAttendanceData(processedData);
        
//         // 應用結果篩選
//         if (processedData.length === 0) {
//           // 根據時間篩選設定不同的處理方式
//           if (mapTimeFilterToKey(timeFilter) === '上月') {
//             setNoRecords(true);  // 上月無記錄時設置無記錄狀態
//           } else {
//             setError(t('attendance.messages.noRecordsThisMonth'));
//           }
//           setFilteredAttendanceData([]);
//         } else {
//           // 應用結果篩選
//           applyResultFilterWithData(processedData);
//         }
//       } else {
//         console.error('獲取出勤記錄失敗:', result.message);
//         // 根據時間篩選設定不同的處理方式
//         if (mapTimeFilterToKey(timeFilter) === '上月') {
//           setNoRecords(true);  // 上月無記錄時設置無記錄狀態
//         } else {
//           setError(`${t('attendance.messages.fetchFailed')}: ${result.message || t('attendance.errors.networkError')}`);
//         }
//         setAttendanceData([]);
//         setFilteredAttendanceData([]);
//       }
//     } catch (err) {
//       console.error('獲取出勤數據失敗:', err);
//       // 根據時間篩選設定不同的處理方式
//       if (mapTimeFilterToKey(timeFilter) === '上月') {
//         setNoRecords(true);  // 上月無記錄時設置無記錄狀態
//       } else {
//         setError(`${t('attendance.messages.dataLoadFailed')}: ${err.message}`);
//       }
//       setAttendanceData([]);
//       setFilteredAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 顯示當前選擇的月份
//   const getCurrentMonthDisplay = useMemo(() => {
//     const now = new Date();
//     let targetMonth, targetYear;

//     if (mapTimeFilterToKey(timeFilter) === '本月') {
//       targetMonth = now.getMonth() + 1;
//       targetYear = now.getFullYear();
//     } else {
//       targetMonth = now.getMonth();
//       if (targetMonth === 0) {
//         targetMonth = 12;
//         targetYear = now.getFullYear() - 1;
//       } else {
//         targetYear = now.getFullYear();
//       }
//     }

//     return `${targetYear}年${targetMonth}月`;
//   }, [timeFilter, t]);

//   // 🔥 修改：重試功能也要處理員工編號映射
//   const handleRetry = () => {
//     setError(null);
    
//     // 自定義設置函數，包含員工編號映射
//     const setValidatedCompanyIdWrapper = (companyId) => {
//       setValidatedCompanyId(companyId);
//     };
    
//     const setValidatedEmployeeIdWrapper = (employeeId) => {
//       if (employeeId) {
//         // 🔥 對員工編號進行映射處理
//         const mappedEmployeeId = handleEmployeeIdMapping(employeeId);
//         setValidatedEmployeeId(mappedEmployeeId);
//       }
//     };
    
//     // 使用引入的驗證函數
//     validateUserFromCookies(
//       setLoading,
//       null, // 不需要設置 authToken
//       setValidatedCompanyIdWrapper,
//       setValidatedEmployeeIdWrapper,
//       '/applogin01/'
//     ); // 重新驗證並獲取數據
//   };

//   // 處理狀態選擇
//   const handleStatusSelect = (status) => {
//     setStatusFilter(status);
//     setShowStatusPicker(false);
//   };

//   // 處理返回首頁 - 修改為使用 replace 而不是 href
//   const handleGoHome = () => {
//     // 檢查是否為手機 app 環境
//     const isInMobileApp = () => {
//       // 檢查是否存在 Flutter 相關的全域變數或特定的 User-Agent
//       // 或者檢查 URL 參數中是否有 app 標記
//       const urlParams = new URLSearchParams(window.location.search);
//       const isApp = urlParams.get('platform') === 'app';
      
//       // 檢查 User-Agent 是否包含 Flutter 相關標記
//       const userAgent = navigator.userAgent.toLowerCase();
//       const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
//       // 檢查是否有 Flutter 注入的全域變數或方法
//       const hasFlutterContext = 
//         typeof window.flutter !== 'undefined' || 
//         typeof window.FlutterNativeWeb !== 'undefined';
        
//       return isApp || hasFlutterAgent || hasFlutterContext;
//     };

//     if (isInMobileApp()) {
//       // 如果是 app 環境，使用 Flutter 的導航方法
//       console.log('檢測到 App 環境，使用 Flutter 導航');
      
//       try {
//         // 嘗試調用 Flutter 提供的導航方法，添加 replace 參數
//         if (window.flutter && window.flutter.postMessage) {
//           window.flutter.postMessage(JSON.stringify({ 
//             action: 'navigate_home',
//             replace: true // 添加 replace 參數
//           }));
//         } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
//           window.FlutterNativeWeb.postMessage(JSON.stringify({ 
//             action: 'navigate_home',
//             replace: true // 添加 replace 參數
//           }));
//         } else {
//           // 發送自定義事件，Flutter 可以監聽此事件
//           const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
//             detail: { 
//               action: 'navigate_home',
//               replace: true // 添加 replace 參數
//             }
//           });
//           document.dispatchEvent(event);
//         }
//       } catch (err) {
//         console.error('無法使用 Flutter 導航:', err);
//         // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用 replace 導航
//         window.location.replace('/frontpagepmx');
//       }
//     } else {
//       // 如果是瀏覽器環境，使用 window.location.replace 導航
//       console.log('瀏覽器環境，使用 window.location.replace 導航');
//       window.location.replace('/frontpagepmx');
//     }
//   };

//   // 添加登出/切換帳號處理函數
//   const handleLogout = () => {
//     // 清除狀態
//     setValidatedCompanyId('');
//     setValidatedEmployeeId('');
//     // 🔥 新增：清除員工編號映射狀態
//     setOriginalEmployeeId('');
//     setMappedEmployeeId('');
//     setAttendanceData([]);
//     setFilteredAttendanceData([]);
    
//     // 清除 localStorage
//     localStorage.removeItem('company_id');
//     localStorage.removeItem('employee_id');
    
//     // 通知 Flutter 登出
//     if (window.flutter) {
//       try {
//         window.flutter.postMessage(JSON.stringify({ action: 'logout' }));
//       } catch (e) {
//         console.error('無法通知 Flutter 登出:', e);
//       }
//     }
    
//     // 重新導向到登入頁面
//     window.location.replace('/applogin01/');
//   };

//   // 添加錯誤處理組件
//   const ErrorMessage = ({ message, onClose }) => {
//     return (
//       <div className="attendance-error-container">
//         <div className="attendance-error-message">
//           <div className="attendance-error-icon">⚠️</div>
//           <div className="attendance-error-text">{message}</div>
//           <button className="attendance-error-close" onClick={onClose}>✕</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="attendance-container">
//       <div className="attendance-app-wrapper" data-language={currentLanguage}>
//         {/* 頁面標題與語言選擇 */}
//         <header className="attendance-header">
//           <div className="attendance-home-icon" onClick={handleGoHome}>
//             <img 
//               src={homeIcon} 
//               alt={t('attendance.home')} 
//               width="20" 
//               height="20" 
//               style={{ objectFit: 'contain' }}
//             />
//           </div>
//           <div className="attendance-page-title">{t('attendance.title')}</div>
          
//           {/* 🔥 新增：顯示員工編號映射資訊（僅在開發模式下顯示） */}
//           {process.env.NODE_ENV === 'development' && originalEmployeeId && (
//             <div className="attendance-debug-info" style={{
//               position: 'absolute',
//               top: '60px',
//               right: '10px',
//               fontSize: '10px',
//               color: '#666',
//               backgroundColor: '#f0f0f0',
//               padding: '4px',
//               borderRadius: '4px'
//             }}>
//               原始ID: {originalEmployeeId} → 映射ID: {mappedEmployeeId}
//             </div>
//           )}
          
//           {/* 語言切換按鈕 */}
//           <LanguageSwitch className="attendance-language-switch" />
//         </header>

//         {/* 顯示錯誤訊息 - 只在本月且有真正錯誤時顯示 */}
//         {error && mapTimeFilterToKey(timeFilter) === '本月' && error !== t('attendance.messages.noRecords') && error !== t('attendance.messages.noRecordsThisMonth') && (
//           <ErrorMessage 
//             message={error} 
//             onClose={() => setError(null)} 
//           />
//         )}
        
//         {/* 篩選區域 */}
//         <div className="attendance-filter-section">
//           {/* 出勤狀況 */}
//           <div className="attendance-filter-group">
//             <div className="attendance-filter-label">{t('attendance.filters.attendanceStatus')}</div>
//             <div 
//               className="attendance-status-selector"
//               onClick={() => setShowStatusPicker(true)}
//             >
//               <span className="attendance-status-value">{statusFilter}</span>
//               <span className="attendance-dropdown-arrow">▼</span>
//             </div>
//           </div>
          
//           {/* 打卡結果 */}
//           <div className="attendance-filter-group">
//             <div className="attendance-filter-label">{t('attendance.filters.punchResult')}</div>
//             <div className="attendance-button-group">
//               <button 
//                 className={`attendance-button ${resultFilter === t('attendance.filters.unlimited') ? 'active' : ''}`}
//                 onClick={() => setResultFilter(t('attendance.filters.unlimited'))}
//               >
//                 {t('attendance.filters.unlimited')}
//               </button>
//               <button 
//                 className={`attendance-button ${resultFilter === t('attendance.filters.normal') ? 'active' : ''}`}
//                 onClick={() => setResultFilter(t('attendance.filters.normal'))}
//               >
//                 {t('attendance.filters.normal')}
//               </button>
//               <button 
//                 className={`attendance-button ${resultFilter === t('attendance.filters.abnormal') ? 'active' : ''}`}
//                 onClick={() => setResultFilter(t('attendance.filters.abnormal'))}
//               >
//                 {t('attendance.filters.abnormal')}
//               </button>
//             </div>
//           </div>
          
//           {/* 時間 */}
//           <div className="attendance-filter-group">
//             <div className="attendance-filter-label">{t('attendance.filters.time')}</div>
//             <div className="attendance-button-group">
//               <button 
//                 className={`attendance-button ${timeFilter === t('attendance.filters.lastMonth') ? 'active' : ''}`}
//                 onClick={() => setTimeFilter(t('attendance.filters.lastMonth'))}
//               >
//                 {t('attendance.filters.lastMonth')}
//               </button>
//               <button 
//                 className={`attendance-button ${timeFilter === t('attendance.filters.thisMonth') ? 'active' : ''}`}
//                 onClick={() => setTimeFilter(t('attendance.filters.thisMonth'))}
//               >
//                 {t('attendance.filters.thisMonth')}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* 出勤紀錄表格 */}
//         <div className="attendance-table-container">
//           <table className="attendance-table">
//             <thead>
//               <tr>
//                 <th className="attendance-date-column"></th>
//                 <th className="attendance-time-column">{t('attendance.table.clockInTime')}</th>
//                 <th className="attendance-time-column">{t('attendance.table.clockOutTime')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="3" className="attendance-loading-text">{t('attendance.messages.loading')}</td>
//                 </tr>
//               ) : noRecords || (error && !filteredAttendanceData.length) ? (
//                 <tr>
//                   <td colSpan="3" className="attendance-error-text">
//                     {t('attendance.messages.noRecords')}
//                     {/* 只在本月且有真正錯誤時顯示重試按鈕 */}
//                     {mapTimeFilterToKey(timeFilter) === '本月' && error && error !== t('attendance.messages.noRecords') && error !== t('attendance.messages.noRecordsThisMonth') && (
//                       <button className="attendance-retry-button" onClick={handleRetry}>
//                         {t('attendance.messages.retry')}
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ) : filteredAttendanceData.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="attendance-loading-text">{t('attendance.messages.noMatchingRecords')}</td>
//                 </tr>
//               ) : (
//                 filteredAttendanceData.map((record, index) => {
//                   return (
//                     <tr key={index} className={`attendance-table-row ${
//                       record.isAbsent 
//                         ? 'attendance-absent-row'  // 曠職記錄使用灰色背景
//                         : (record.checkInAbnormal || record.checkOutAbnormal) 
//                           ? 'attendance-late-row'  // 其他異常記錄（如遲到、早退）使用紅色背景
//                           : ''
//                     }`}>
//                       {/* 日期欄位 */}
//                       <td className="attendance-date-cell">
//                         <div className="attendance-date-block">
//                           <div className="attendance-date-number">{record.date}</div>
//                           <div className="attendance-day-of-week">{record.day}</div>
//                         </div>
//                       </td>
                      
//                       {/* 上班打卡時間 */}
//                       <td className="attendance-time-cell">
//                         {record.isAbsent ? (
//                           <div className="attendance-status-tag">{getStatusTagText('曠職')}</div>
//                         ) : record.checkInResultText && record.checkInResultText !== '準時' && (
//                           <div className="attendance-status-tag">{getStatusTagText(record.checkInResultText)}</div>
//                         )}
//                         <span className={record.checkInAbnormal ? 'attendance-abnormal-time' : ''}>
//                           {record.checkIn}
//                         </span>
//                         {!record.isAbsent && record.checkInAbnormal && (
//                           <span className="attendance-abnormal-label">{getStatusTagText('異常')}</span>
//                         )}
//                       </td>
                      
//                       {/* 下班打卡時間 */}
//                       <td className="attendance-time-cell">
//                         {record.isAbsent ? (
//                           <div className="attendance-status-tag">{getStatusTagText('曠職')}</div>
//                         ) : record.checkOutResultText && record.checkOutResultText !== '準時' && (
//                           <div className="attendance-status-tag">{getStatusTagText(record.checkOutResultText)}</div>
//                         )}
//                         <span className={record.checkOutAbnormal ? 'attendance-abnormal-time' : ''}>
//                           {record.checkOut === '--:--' ? '--:--' : record.checkOut}
//                         </span>
//                         {!record.isAbsent && record.checkOutAbnormal && (
//                           <span className="attendance-abnormal-label">{getStatusTagText('異常')}</span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 載入中指示器 */}
//         {loading && (
//           <div className="attendance-loading-overlay">
//             <div className="attendance-loading-spinner"></div>
//             <div className="attendance-loading-text">{t('attendance.messages.processing')}</div>
//           </div>
//         )}

//         {/* 狀態選擇器彈出視窗 */}
//         {showStatusPicker && (
//           <div className="attendance-picker-overlay" onClick={() => setShowStatusPicker(false)}>
//             <div className="attendance-picker-container" onClick={(e) => e.stopPropagation()}>
//               <div className="attendance-picker-header">
//                 <span className="attendance-picker-title">{t('attendance.picker.attendanceStatus')}</span>
//                 <button 
//                   className="attendance-picker-close"
//                   onClick={() => setShowStatusPicker(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="attendance-picker-options">
//                 {statusOptions.map((option) => (
//                   <div
//                     key={option}
//                     className={`attendance-picker-option ${statusFilter === option ? 'selected' : ''}`}
//                     onClick={() => handleStatusSelect(option)}
//                   >
//                     {option}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AttendancePage;
import { 
  validateUserFromCookies, 
  fetchAttendanceRecords, 
  processAttendanceData,
  calculateDateRange,
  formatTimeToMinutes,
  getDayOfWeek,
  // 🔥 新增：引入員工編號映射功能
  mapPmxToBasicEmployeeId,
  mapBasicToPmxEmployeeId,
  hasEmployeeIdMapping
} from './function/function'; // 引入共用函數

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PMX_CSS/AttendancePagePMX.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import { useLanguage } from './Hook/useLanguage'; // 添加多語言支持
import LanguageSwitch from './components/LanguageSwitch'; // 添加語言切換組件
import { API_BASE_URL } from '../config'; // 引入 API_BASE_URL

function AttendancePage() {
  // 添加多語言支持
  const { t, currentLanguage } = useLanguage();
  
  // 狀態定義
  const [currentTime, setCurrentTime] = useState('');
  const [statusFilter, setStatusFilter] = useState(t('attendance.filters.unlimited'));
  const [resultFilter, setResultFilter] = useState(t('attendance.filters.unlimited'));
  const [timeFilter, setTimeFilter] = useState(t('attendance.filters.thisMonth'));
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noRecords, setNoRecords] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [validatedCompanyId, setValidatedCompanyId] = useState('');
  const [validatedEmployeeId, setValidatedEmployeeId] = useState('');
  // 🔥 新增：原始員工編號和映射後的員工編號狀態
  const [originalEmployeeId, setOriginalEmployeeId] = useState('');
  const [mappedEmployeeId, setMappedEmployeeId] = useState('');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const flutterMessageHandler = useRef(null);

  // 狀態選項 - 使用多語言
  const statusOptions = [
    t('attendance.statusOptions.unlimited'),
    t('attendance.statusOptions.onTime'),
    t('attendance.statusOptions.leave'),
    t('attendance.statusOptions.late'),
    t('attendance.statusOptions.earlyLeave'),
    t('attendance.statusOptions.absent')
  ];

  // 🔥 新增：員工編號映射處理函數
  const handleEmployeeIdMapping = (employeeId) => {
    if (!employeeId) {
      console.warn('員工編號為空，無法進行映射');
      return employeeId;
    }

    console.log('開始處理員工編號映射:', employeeId);
    
    // 儲存原始員工編號
    setOriginalEmployeeId(employeeId);
    
    // 檢查是否存在映射
    if (hasEmployeeIdMapping(employeeId)) {
      // 如果是 PMX 系統的員工編號，映射到 Basic 系統
      const basicEmployeeId = mapPmxToBasicEmployeeId(employeeId);
      console.log(`員工編號映射成功: ${employeeId} -> ${basicEmployeeId}`);
      setMappedEmployeeId(basicEmployeeId);
      return basicEmployeeId;
    } else {
      // 如果沒有映射，直接使用原始編號
      console.log(`員工編號 ${employeeId} 不需要映射，使用原始編號`);
      setMappedEmployeeId(employeeId);
      return employeeId;
    }
  };

  // 當語言變更時重置篩選器
  useEffect(() => {
    setStatusFilter(t('attendance.filters.unlimited'));
    setResultFilter(t('attendance.filters.unlimited'));
    setTimeFilter(t('attendance.filters.thisMonth'));
  }, [currentLanguage, t]);

  // 修改狀態映射函數
  const mapStatusToKey = (status) => {
    const statusMap = {
      [t('attendance.statusOptions.unlimited')]: '不限',
      [t('attendance.statusOptions.onTime')]: '準時',
      [t('attendance.statusOptions.leave')]: '請假',
      [t('attendance.statusOptions.late')]: '遲到',
      [t('attendance.statusOptions.earlyLeave')]: '早退',
      [t('attendance.statusOptions.absent')]: '曠職'
    };
    return statusMap[status] || status;
  };

  // 修改時間篩選映射函數
  const mapTimeFilterToKey = (timeFilter) => {
    const timeMap = {
      [t('attendance.filters.lastMonth')]: '上月',
      [t('attendance.filters.thisMonth')]: '本月'
    };
    return timeMap[timeFilter] || timeFilter;
  };

  // 修改結果篩選映射函數
  const mapResultFilterToKey = (resultFilter) => {
    const resultMap = {
      [t('attendance.filters.unlimited')]: '不限',
      [t('attendance.filters.normal')]: '正常',
      [t('attendance.filters.abnormal')]: '異常'
    };
    return resultMap[resultFilter] || resultFilter;
  };

  // 修改狀態標籤映射函數
  const getStatusTagText = (statusText) => {
    const statusTagMap = {
      '準時': t('attendance.statusTags.onTime'),
      '遲到': t('attendance.statusTags.late'),
      '早退': t('attendance.statusTags.earlyLeave'),
      '曠職': t('attendance.statusTags.absent'),
      '請假': t('attendance.statusTags.leave'),
      '異常': t('attendance.statusTags.abnormal')
    };
    return statusTagMap[statusText] || statusText;
  };

  // 從 cookies 獲取值的函數 - 增強版，支持 Flutter WebView
  const getCookie = (name) => {
    try {
      // 方法1: 標準 document.cookie 方式
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      }, {});

      // 方法2: 從 URL 參數獲取 (Flutter WebView 常用方法)
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(name);
      
      // 方法3: 從 localStorage 獲取 (Flutter 可能存儲在這裡)
      const localStorageValue = localStorage.getItem(name);
      
      // 方法4: 從 sessionStorage 獲取
      const sessionStorageValue = sessionStorage.getItem(name);
      
      // 按優先順序返回值
      return cookies[name] || paramValue || localStorageValue || sessionStorageValue || null;
    } catch (e) {
      console.error('獲取 cookie 時出錯:', e);
      return null;
    }
  };

  // 設置 Flutter 消息處理器
  useEffect(() => {
    // 設置 Flutter 消息處理函數
    const handleFlutterMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('收到 Flutter 消息:', data);
        
        // 如果收到認證資訊，更新狀態
        if (data.company_id && data.employee_id) {
          console.log('從 Flutter 獲取認證資訊:', data);
          setValidatedCompanyId(data.company_id);
          
          // 🔥 修改：對員工編號進行映射處理
          const mappedEmployeeId = handleEmployeeIdMapping(data.employee_id);
          setValidatedEmployeeId(mappedEmployeeId);
          
          // 可選：保存到 localStorage 以便後續使用
          localStorage.setItem('company_id', data.company_id);
          localStorage.setItem('employee_id', mappedEmployeeId); // 儲存映射後的員工編號
        }
      } catch (e) {
        console.error('處理 Flutter 消息時出錯:', e);
      }
    };

    // 註冊 Flutter 消息監聽器
    if (window.flutter) {
      window.addEventListener('message', handleFlutterMessage);
      flutterMessageHandler.current = handleFlutterMessage;
      
      // 通知 Flutter 頁面已準備好接收數據
      try {
        window.flutter.postMessage(JSON.stringify({ action: 'page_ready', page: 'attendance' }));
      } catch (e) {
        console.error('無法發送準備就緒消息到 Flutter:', e);
      }
    }
    
    // 監聽 Flutter WebView 就緒事件
    document.addEventListener('flutterInAppWebViewPlatformReady', (event) => {
      console.log('Flutter WebView 已準備就緒');
      // 請求認證資訊
      if (window.flutter) {
        try {
          window.flutter.postMessage(JSON.stringify({ action: 'request_auth_info' }));
        } catch (e) {
          console.error('無法請求認證資訊:', e);
        }
      }
    });

    return () => {
      // 清理監聽器
      if (flutterMessageHandler.current) {
        window.removeEventListener('message', flutterMessageHandler.current);
      }
    };
  }, []);

  // 🔥 修改：初始驗證時也要處理員工編號映射
  useEffect(() => {
    if (isInitialMount.current) {
      console.log('初始驗證: 從 cookies/Flutter 驗證用戶身份');
      
      // 自定義設置函數，包含員工編號映射
      const setValidatedCompanyIdWrapper = (companyId) => {
        setValidatedCompanyId(companyId);
      };
      
      const setValidatedEmployeeIdWrapper = (employeeId) => {
        if (employeeId) {
          // 🔥 對員工編號進行映射處理
          const mappedEmployeeId = handleEmployeeIdMapping(employeeId);
          setValidatedEmployeeId(mappedEmployeeId);
        }
      };
      
      // 使用引入的驗證函數
      validateUserFromCookies(
        setLoading,
        null, // 不需要設置 authToken
        setValidatedCompanyIdWrapper,
        setValidatedEmployeeIdWrapper,
        '/apploginpmx/' // 🔥 修改為 PMX 登入頁面
      );
      isInitialMount.current = false;
    }
  }, []);

  // 監聽認證狀態變化，當獲取到有效認證時自動加載數據
  useEffect(() => {
    if (validatedCompanyId && validatedEmployeeId) {
      console.log('認證狀態變化: 檢測到有效認證，加載數據');
      console.log(`使用映射後的員工編號進行查詢: 原始=${originalEmployeeId}, 映射後=${validatedEmployeeId}`);
      fetchAttendanceData();
    }
  }, [validatedCompanyId, validatedEmployeeId]);

  // 獲取出勤數據
  useEffect(() => {
    if (validatedCompanyId && validatedEmployeeId) {
      fetchAttendanceData();
    }
  }, [timeFilter, statusFilter]);

  // 根據 resultFilter 篩選資料
  useEffect(() => {
    if (attendanceData.length > 0) {
      applyResultFilter();
    }
  }, [resultFilter, attendanceData]);

  // 修改結果篩選函數
  const applyResultFilterWithData = (data) => {
    const mappedFilter = mapResultFilterToKey(resultFilter);
    
    if (mappedFilter === '不限') {
      setFilteredAttendanceData(data);
    } else if (mappedFilter === '正常') {
      const filtered = data.filter(record => 
        !record.checkInAbnormal && !record.checkOutAbnormal
      );
      setFilteredAttendanceData(filtered);
    } else if (mappedFilter === '異常') {
      const filtered = data.filter(record => 
        record.checkInAbnormal || record.checkOutAbnormal
      );
      setFilteredAttendanceData(filtered);
    }
  };

  // 應用結果篩選邏輯
  const applyResultFilter = () => {
    if (attendanceData.length > 0) {
      applyResultFilterWithData(attendanceData);
    }
  };

  // 🔥 修改：根據選擇的月份獲取數據，使用映射後的員工編號
  const fetchAttendanceData = async () => {
    if (!validatedCompanyId || !validatedEmployeeId) {
      console.log('獲取數據失敗: 缺少認證資訊');
      // 只在本月模式顯示錯誤
      if (mapTimeFilterToKey(timeFilter) === '本月') {
        setError(t('attendance.messages.employeeNotFound'));
      } else {
        setNoRecords(true);
      }
      return;
    }
    
    console.log(`開始獲取出勤數據，使用認證資訊: 公司ID=${validatedCompanyId}, 員工ID=${validatedEmployeeId}`);
    console.log(`員工編號映射資訊: 原始=${originalEmployeeId}, 映射後=${validatedEmployeeId}`);
    
    setLoading(true);
    setError(null);
    setNoRecords(false);

    try {
      // 使用共用函數計算日期範圍
      const { startDate, endDate, targetYear, targetMonth } = calculateDateRange(mapTimeFilterToKey(timeFilter));
      
      console.log(`查詢從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
      // 🔥 使用映射後的員工編號進行查詢
      const result = await fetchAttendanceRecords(
        validatedCompanyId, 
        validatedEmployeeId, // 這裡使用的是映射後的員工編號
        startDate, 
        endDate, 
        mapStatusToKey(statusFilter)
      );
      
      if (result.success) {
        console.log(`成功獲取出勤記錄:`, result.data);
        
        // 使用共用函數處理出勤數據
        const processedData = await processAttendanceData(result.data, targetYear, targetMonth);
        
        setAttendanceData(processedData);
        
        // 應用結果篩選
        if (processedData.length === 0) {
          // 根據時間篩選設定不同的處理方式
          if (mapTimeFilterToKey(timeFilter) === '上月') {
            setNoRecords(true);  // 上月無記錄時設置無記錄狀態
          } else {
            setError(t('attendance.messages.noRecordsThisMonth'));
          }
          setFilteredAttendanceData([]);
        } else {
          // 應用結果篩選
          applyResultFilterWithData(processedData);
        }
      } else {
        console.error('獲取出勤記錄失敗:', result.message);
        // 根據時間篩選設定不同的處理方式
        if (mapTimeFilterToKey(timeFilter) === '上月') {
          setNoRecords(true);  // 上月無記錄時設置無記錄狀態
        } else {
          setError(`${t('attendance.messages.fetchFailed')}: ${result.message || t('attendance.errors.networkError')}`);
        }
        setAttendanceData([]);
        setFilteredAttendanceData([]);
      }
    } catch (err) {
      console.error('獲取出勤數據失敗:', err);
      // 根據時間篩選設定不同的處理方式
      if (mapTimeFilterToKey(timeFilter) === '上月') {
        setNoRecords(true);  // 上月無記錄時設置無記錄狀態
      } else {
        setError(`${t('attendance.messages.dataLoadFailed')}: ${err.message}`);
      }
      setAttendanceData([]);
      setFilteredAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // 顯示當前選擇的月份
  const getCurrentMonthDisplay = useMemo(() => {
    const now = new Date();
    let targetMonth, targetYear;

    if (mapTimeFilterToKey(timeFilter) === '本月') {
      targetMonth = now.getMonth() + 1;
      targetYear = now.getFullYear();
    } else {
      targetMonth = now.getMonth();
      if (targetMonth === 0) {
        targetMonth = 12;
        targetYear = now.getFullYear() - 1;
      } else {
        targetYear = now.getFullYear();
      }
    }

    return `${targetYear}年${targetMonth}月`;
  }, [timeFilter, t]);

  // 🔥 修改：重試功能也要處理員工編號映射
  const handleRetry = () => {
    setError(null);
    
    // 自定義設置函數，包含員工編號映射
    const setValidatedCompanyIdWrapper = (companyId) => {
      setValidatedCompanyId(companyId);
    };
    
    const setValidatedEmployeeIdWrapper = (employeeId) => {
      if (employeeId) {
        // 🔥 對員工編號進行映射處理
        const mappedEmployeeId = handleEmployeeIdMapping(employeeId);
        setValidatedEmployeeId(mappedEmployeeId);
      }
    };
    
    // 使用引入的驗證函數
    validateUserFromCookies(
      setLoading,
      null, // 不需要設置 authToken
      setValidatedCompanyIdWrapper,
      setValidatedEmployeeIdWrapper,
      '/apploginpmx/' // 🔥 修改為 PMX 登入頁面
    ); // 重新驗證並獲取數據
  };

  // 處理狀態選擇
  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setShowStatusPicker(false);
  };

  // 處理返回首頁 - 修改為使用 replace 而不是 href
  const handleGoHome = () => {
    // 檢查是否為手機 app 環境
    const isInMobileApp = () => {
      // 檢查是否存在 Flutter 相關的全域變數或特定的 User-Agent
      // 或者檢查 URL 參數中是否有 app 標記
      const urlParams = new URLSearchParams(window.location.search);
      const isApp = urlParams.get('platform') === 'app';
      
      // 檢查 User-Agent 是否包含 Flutter 相關標記
      const userAgent = navigator.userAgent.toLowerCase();
      const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
      // 檢查是否有 Flutter 注入的全域變數或方法
      const hasFlutterContext = 
        typeof window.flutter !== 'undefined' || 
        typeof window.FlutterNativeWeb !== 'undefined';
        
      return isApp || hasFlutterAgent || hasFlutterContext;
    };

    if (isInMobileApp()) {
      // 如果是 app 環境，使用 Flutter 的導航方法
      console.log('檢測到 App 環境，使用 Flutter 導航');
      
      try {
        // 嘗試調用 Flutter 提供的導航方法，添加 replace 參數
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ 
            action: 'navigate_home',
            replace: true // 添加 replace 參數
          }));
        } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ 
            action: 'navigate_home',
            replace: true // 添加 replace 參數
          }));
        } else {
          // 發送自定義事件，Flutter 可以監聽此事件
          const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
            detail: { 
              action: 'navigate_home',
              replace: true // 添加 replace 參數
            }
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error('無法使用 Flutter 導航:', err);
        // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用 replace 導航
        window.location.replace('/frontpagepmx');
      }
    } else {
      // 如果是瀏覽器環境，使用 window.location.replace 導航
      console.log('瀏覽器環境，使用 window.location.replace 導航');
      window.location.replace('/frontpagepmx');
    }
  };

  // 添加登出/切換帳號處理函數
  const handleLogout = () => {
    // 清除狀態
    setValidatedCompanyId('');
    setValidatedEmployeeId('');
    // 🔥 新增：清除員工編號映射狀態
    setOriginalEmployeeId('');
    setMappedEmployeeId('');
    setAttendanceData([]);
    setFilteredAttendanceData([]);
    
    // 清除 localStorage
    localStorage.removeItem('company_id');
    localStorage.removeItem('employee_id');
    
    // 通知 Flutter 登出
    if (window.flutter) {
      try {
        window.flutter.postMessage(JSON.stringify({ action: 'logout' }));
      } catch (e) {
        console.error('無法通知 Flutter 登出:', e);
      }
    }
    
    // 重新導向到登入頁面
    window.location.replace('/apploginpmx/'); // 🔥 修改為 PMX 登入頁面
  };

  // 添加錯誤處理組件
  const ErrorMessage = ({ message, onClose }) => {
    return (
      <div className="attendance-error-container">
        <div className="attendance-error-message">
          <div className="attendance-error-icon">⚠️</div>
          <div className="attendance-error-text">{message}</div>
          <button className="attendance-error-close" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div className="attendance-container">
      <div className="attendance-app-wrapper" data-language={currentLanguage}>
        {/* 頁面標題與語言選擇 */}
        <header className="attendance-header">
          <div className="attendance-home-icon" onClick={handleGoHome}>
            <img 
              src={homeIcon} 
              alt={t('attendance.home')} 
              width="20" 
              height="20" 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="attendance-page-title">{t('attendance.title')}</div>
          
          {/* 🔥 新增：顯示員工編號映射資訊（僅在開發模式下顯示） */}
          {process.env.NODE_ENV === 'development' && originalEmployeeId && (
            <div className="attendance-debug-info" style={{
              position: 'absolute',
              top: '60px',
              right: '10px',
              fontSize: '10px',
              color: '#666',
              backgroundColor: '#f0f0f0',
              padding: '4px',
              borderRadius: '4px'
            }}>
              原始ID: {originalEmployeeId} → 映射ID: {mappedEmployeeId}
            </div>
          )}
          
          {/* 語言切換按鈕 */}
          <LanguageSwitch className="attendance-language-switch" />
        </header>

        {/* 顯示錯誤訊息 - 只在本月且有真正錯誤時顯示 */}
        {error && mapTimeFilterToKey(timeFilter) === '本月' && error !== t('attendance.messages.noRecords') && error !== t('attendance.messages.noRecordsThisMonth') && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        {/* 篩選區域 */}
        <div className="attendance-filter-section">
          {/* 出勤狀況 */}
          <div className="attendance-filter-group">
            <div className="attendance-filter-label">{t('attendance.filters.attendanceStatus')}</div>
            <div 
              className="attendance-status-selector"
              onClick={() => setShowStatusPicker(true)}
            >
              <span className="attendance-status-value">{statusFilter}</span>
              <span className="attendance-dropdown-arrow">▼</span>
            </div>
          </div>
          
          {/* 打卡結果 */}
          <div className="attendance-filter-group">
            <div className="attendance-filter-label">{t('attendance.filters.punchResult')}</div>
            <div className="attendance-button-group">
              <button 
                className={`attendance-button ${resultFilter === t('attendance.filters.unlimited') ? 'active' : ''}`}
                onClick={() => setResultFilter(t('attendance.filters.unlimited'))}
              >
                {t('attendance.filters.unlimited')}
              </button>
              <button 
                className={`attendance-button ${resultFilter === t('attendance.filters.normal') ? 'active' : ''}`}
                onClick={() => setResultFilter(t('attendance.filters.normal'))}
              >
                {t('attendance.filters.normal')}
              </button>
              <button 
                className={`attendance-button ${resultFilter === t('attendance.filters.abnormal') ? 'active' : ''}`}
                onClick={() => setResultFilter(t('attendance.filters.abnormal'))}
              >
                {t('attendance.filters.abnormal')}
              </button>
            </div>
          </div>
          
          {/* 時間 */}
          <div className="attendance-filter-group">
            <div className="attendance-filter-label">{t('attendance.filters.time')}</div>
            <div className="attendance-button-group">
              <button 
                className={`attendance-button ${timeFilter === t('attendance.filters.lastMonth') ? 'active' : ''}`}
                onClick={() => setTimeFilter(t('attendance.filters.lastMonth'))}
              >
                {t('attendance.filters.lastMonth')}
              </button>
              <button 
                className={`attendance-button ${timeFilter === t('attendance.filters.thisMonth') ? 'active' : ''}`}
                onClick={() => setTimeFilter(t('attendance.filters.thisMonth'))}
              >
                {t('attendance.filters.thisMonth')}
              </button>
            </div>
          </div>
        </div>
        
        {/* 出勤紀錄表格 */}
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="attendance-date-column"></th>
                <th className="attendance-time-column">{t('attendance.table.clockInTime')}</th>
                <th className="attendance-time-column">{t('attendance.table.clockOutTime')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="attendance-loading-text">{t('attendance.messages.loading')}</td>
                </tr>
              ) : noRecords || (error && !filteredAttendanceData.length) ? (
                <tr>
                  <td colSpan="3" className="attendance-error-text">
                    {t('attendance.messages.noRecords')}
                    {/* 只在本月且有真正錯誤時顯示重試按鈕 */}
                    {mapTimeFilterToKey(timeFilter) === '本月' && error && error !== t('attendance.messages.noRecords') && error !== t('attendance.messages.noRecordsThisMonth') && (
                      <button className="attendance-retry-button" onClick={handleRetry}>
                        {t('attendance.messages.retry')}
                      </button>
                    )}
                  </td>
                </tr>
              ) : filteredAttendanceData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="attendance-loading-text">{t('attendance.messages.noMatchingRecords')}</td>
                </tr>
              ) : (
                filteredAttendanceData.map((record, index) => {
                  return (
                    <tr key={index} className={`attendance-table-row ${
                      record.isAbsent 
                        ? 'attendance-absent-row'  // 曠職記錄使用灰色背景
                        : (record.checkInAbnormal || record.checkOutAbnormal) 
                          ? 'attendance-late-row'  // 其他異常記錄（如遲到、早退）使用紅色背景
                          : ''
                    }`}>
                      {/* 日期欄位 */}
                      <td className="attendance-date-cell">
                        <div className="attendance-date-block">
                          <div className="attendance-date-number">{record.date}</div>
                          <div className="attendance-day-of-week">{record.day}</div>
                        </div>
                      </td>
                      
                      {/* 上班打卡時間 */}
                      <td className="attendance-time-cell">
                        {record.isAbsent ? (
                          <div className="attendance-status-tag">{getStatusTagText('曠職')}</div>
                        ) : record.checkInResultText && record.checkInResultText !== '準時' && (
                          <div className="attendance-status-tag">{getStatusTagText(record.checkInResultText)}</div>
                        )}
                        <span className={record.checkInAbnormal ? 'attendance-abnormal-time' : ''}>
                          {record.checkIn}
                        </span>
                        {!record.isAbsent && record.checkInAbnormal && (
                          <span className="attendance-abnormal-label">{getStatusTagText('異常')}</span>
                        )}
                      </td>
                      
                      {/* 下班打卡時間 */}
                      <td className="attendance-time-cell">
                        {record.isAbsent ? (
                          <div className="attendance-status-tag">{getStatusTagText('曠職')}</div>
                        ) : record.checkOutResultText && record.checkOutResultText !== '準時' && (
                          <div className="attendance-status-tag">{getStatusTagText(record.checkOutResultText)}</div>
                        )}
                        <span className={record.checkOutAbnormal ? 'attendance-abnormal-time' : ''}>
                          {record.checkOut === '--:--' ? '--:--' : record.checkOut}
                        </span>
                        {!record.isAbsent && record.checkOutAbnormal && (
                          <span className="attendance-abnormal-label">{getStatusTagText('異常')}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 載入中指示器 */}
        {loading && (
          <div className="attendance-loading-overlay">
            <div className="attendance-loading-spinner"></div>
            <div className="attendance-loading-text">{t('attendance.messages.processing')}</div>
          </div>
        )}

        {/* 狀態選擇器彈出視窗 */}
        {showStatusPicker && (
          <div className="attendance-picker-overlay" onClick={() => setShowStatusPicker(false)}>
            <div className="attendance-picker-container" onClick={(e) => e.stopPropagation()}>
              <div className="attendance-picker-header">
                <span className="attendance-picker-title">{t('attendance.picker.attendanceStatus')}</span>
                <button 
                  className="attendance-picker-close"
                  onClick={() => setShowStatusPicker(false)}
                >
                  ✕
                </button>
              </div>
              <div className="attendance-picker-options">
                {statusOptions.map((option) => (
                  <div
                    key={option}
                    className={`attendance-picker-option ${statusFilter === option ? 'selected' : ''}`}
                    onClick={() => handleStatusSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
