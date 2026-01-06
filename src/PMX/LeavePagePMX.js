// import React, { useState, useEffect } from 'react';
// import './PMX_CSS/LeavePagePMX.css';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import { useLanguage } from './Hook/useLanguage';
// import LanguageSwitch from './components/LanguageSwitch';
// import Cookies from 'js-cookie'; // 引入 js-cookie 庫
// import { validateUserFromCookies, formatFormNumber } from './function/function'; // 引入共用函數

// function LeavePage() {
//   // 添加語言 Hook
//   const { t } = useLanguage();
  
//   const [companyId, setCompanyId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [authToken, setAuthToken] = useState(""); // 新增 authToken 狀態
//   const [activeTab, setActiveTab] = useState('假別');
//   const [activeSubTab, setActiveSubTab] = useState('總覽');
//   const [currentTime, setCurrentTime] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cancelingLeave, setCancelingLeave] = useState(false);
//   const [cancelMessage, setCancelMessage] = useState('');

//   // 使用共用函數驗證用戶
//   useEffect(() => {
//     validateUserFromCookies(
//       setLoading,
//       setAuthToken,
//       setCompanyId,
//       setEmployeeId
//     );
//   }, []);

//   const formatDateTime = (dateTimeStr) => {
//     if (!dateTimeStr) return t('common.noRecord');
//     const date = new Date(dateTimeStr);
//     if (isNaN(date.getTime())) return dateTimeStr; // 如果無法解析日期，返回原始字符串
    
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     }).replace(/\//g, '-');
//   };

//   // 使用 API 獲取請假申請數據 - 修改為使用 auth_xtbb token
//   useEffect(() => {
//     if (activeTab === t('leave.approvalProgress')) {
//       if (!companyId || !employeeId || !authToken) {
//         return;
//       }

//       const fetchLeaveRequests = async () => {
//         try {
//           setLoading(true);
          
//           console.log(`正在查詢員工 ${employeeId} 的請假申請...`);
          
//           // 使用 /api/forms/advanced-search API 查詢請假申請，添加 auth_xtbb token
//           const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/advanced-search', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
//             },
//             body: JSON.stringify({
//               company_id: parseInt(companyId),
//               employee_id: employeeId,
//               category: "leave",
//               includeDetails: true
//             })
//           });
          
//           console.log('發送的請求參數:', {
//             company_id: parseInt(companyId),
//             employee_id: employeeId,
//             category: "leave",
//             includeDetails: true
//           });
          
//           if (!response.ok) {
//             throw new Error(`API 請求失敗: ${response.status}`);
//           }
          
//           const data = await response.json();
//           console.log('API 完整回應:', data);
          
//           if (data.Status !== "Ok") {
//             throw new Error(data.Msg || "查詢失敗");
//           }
          
//           if (!data.Data || data.Data.length === 0) {
//             console.log('沒有找到請假申請數據');
//             setLeaveRequests([]);
//             setLoading(false);
//             return;
//           }
          
//           // 強制在前端過濾，確保只顯示當前員工的申請
//           const currentEmployeeRequests = data.Data.filter(item => {
//             const itemEmployeeId = String(item.employee_id);
//             const currentEmployeeId = String(employeeId);
            
//             console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
            
//             return itemEmployeeId === currentEmployeeId;
//           });
          
//           console.log(`過濾前共 ${data.Data.length} 筆申請`);
//           console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的請假申請`);
          
//           // 如果沒有找到當前員工的申請，顯示空列表
//           if (currentEmployeeRequests.length === 0) {
//             console.log('當前員工沒有請假申請');
//             setLeaveRequests([]);
//             setLoading(false);
//             return;
//           }
          
//           // 處理回應數據，轉換為前端需要的格式
//           const userLeaveRequests = currentEmployeeRequests.map((item, index) => {
//             console.log('處理申請項目:', item);
//             console.log('詳細資料:', item.details);
            
//             // 狀態映射 - 根據後端的狀態欄位，更全面地處理所有可能的狀態
//             let statusText = t('leave.statusPending');
//             const currentStatus = item.status || '';
            
//             // 轉換為小寫進行比較，確保大小寫不敏感
//             const statusLower = currentStatus.toLowerCase();
            
//             // 更全面的狀態映射
//             if (statusLower === 'approved' || 
//                 statusLower === 'ok' || 
//                 statusLower === '已完成' || 
//                 statusLower === '1') {
//               statusText = t('leave.statusApproved');
//             } 
//             else if (statusLower === 'rejected' || 
//                      statusLower === 'no' || 
//                      statusLower === '未通過' || 
//                      statusLower === '2') {
//               statusText = t('leave.statusRejected');
//             }
//             else if (statusLower === 'pending' || 
//                      statusLower === '待審核' || 
//                      statusLower === 'approved_pending_hr') {
//               statusText = t('leave.statusPending');
//             }
            
//             // 格式化申請日期
//             let submitTime = t('common.noRecord');
//             if (item.application_date) {
//               submitTime = formatDateTime(item.application_date);
//             }

//             // 定義請假類型映射表
//             const leaveTypeMap = {
//               'compensatory_leave': { name: t('apply.leaveTypes.compensatory'), short: t('leave.typeShort.compensatory') },
//               'annual_leave': { name: t('apply.leaveTypes.annual'), short: t('leave.typeShort.annual') },
//               'personal_leave': { name: t('apply.leaveTypes.personal'), short: t('leave.typeShort.personal') },
//               'sick_leave': { name: t('apply.leaveTypes.sick'), short: t('leave.typeShort.sick') },
//               'menstrual_leave': { name: t('apply.leaveTypes.menstrual'), short: t('leave.typeShort.menstrual') },
//               'makeup_leave': { name: t('apply.leaveTypes.makeup'), short: t('leave.typeShort.makeup') },
//               'official_leave': { name: t('apply.leaveTypes.official'), short: t('leave.typeShort.official') },
//               'marriage_leave': { name: t('apply.leaveTypes.marriage'), short: t('leave.typeShort.marriage') },
//               'prenatal_checkup_leave': { name: t('apply.leaveTypes.prenatalCheckup'), short: t('leave.typeShort.prenatalCheckup') },
//               'maternity_leave': { name: t('apply.leaveTypes.maternity'), short: t('leave.typeShort.maternity') },
//               'paternity_leave': { name: t('apply.leaveTypes.paternity'), short: t('leave.typeShort.paternity') },
//               'study_leave': { name: t('apply.leaveTypes.study'), short: t('leave.typeShort.study') },
//               'birthday_leave': { name: t('apply.leaveTypes.birthday'), short: t('leave.typeShort.birthday') }
//             };
            
//             // 處理請假類型 - 根據資料庫結構優先使用 type 欄位
//             let leaveTypeName = t('leave.unspecified');
//             let leaveTypeShort = t('leave.typeShort.unspecified');
            
//             // 1. 優先使用基本資料的 type 欄位
//             if (item.type) {
//               // 將 API 值轉換為顯示名稱
//               if (leaveTypeMap[item.type]) {
//                 leaveTypeName = leaveTypeMap[item.type].name;
//                 leaveTypeShort = leaveTypeMap[item.type].short;
//               } else {
//                 leaveTypeName = item.type;
//                 leaveTypeShort = item.type.substring(0, 1);
//               }
//             }
//             // 2. 如果基本資料沒有，嘗試從詳細資料獲取
//             else if (item.details && item.details.type) {
//               // 同樣使用映射表處理詳細資料中的 type
//               if (leaveTypeMap[item.details.type]) {
//                 leaveTypeName = leaveTypeMap[item.details.type].name;
//                 leaveTypeShort = leaveTypeMap[item.details.type].short;
//               } else {
//                 leaveTypeName = item.details.type;
//                 leaveTypeShort = item.details.type.substring(0, 1);
//               }
//             }
            
//             console.log('請假類型處理結果:', {
//               基本資料type: item.type,
//               詳細資料type: item.details?.type,
//               最終結果: leaveTypeName
//             });
            
//             // 處理請假原因 - 根據資料庫結構使用 illustrate 欄位
//             let reason = t('leave.noReason');
            
//             // 1. 優先使用詳細資料的 illustrate 欄位
//             if (item.details && item.details.illustrate) {
//               reason = item.details.illustrate;
//             }
//             // 2. 備用：使用基本資料的 description
//             else if (item.description) {
//               reason = item.description;
//             }
            
//             console.log('請假原因處理結果:', {
//               詳細資料illustrate: item.details?.illustrate,
//               基本資料description: item.description,
//               最終結果: reason
//             });
            
//             // 格式化請假時間 - 根據資料庫結構處理
//             let startDateTime = t('leave.unspecified');
//             let endDateTime = t('leave.unspecified');
//             let totalTime = `0${t('leave.hours')} 0${t('leave.minutes')}`;
            
//             if (item.details) {
//               const startDate = item.details.start_date;
//               const startTime = item.details.start_time;
//               const endDate = item.details.end_date;
//               const endTime = item.details.end_time;
//               const totalHours = item.details.total_calculation_hours;
              
//               // 格式化時間顯示（去除秒數）
//               const formatTime = (timeStr) => {
//                 if (!timeStr) return '';
//                 return timeStr.split(':').slice(0, 2).join(':');
//               };
              
//               if (startDate && startTime) {
//                 startDateTime = `${startDate} ${formatTime(startTime)}`;
//               }
              
//               if (endDate && endTime) {
//                 endDateTime = `${endDate} ${formatTime(endTime)}`;
//               } else {
//                 endDateTime = startDateTime;
//               }
              
//               // 計算總時數
//               if (totalHours) {
//                 const hours = Math.floor(totalHours);
//                 const minutes = Math.round((totalHours - hours) * 60);
//                 totalTime = `${hours}${t('leave.hours')}${minutes}${t('leave.minutes')}`;
//               }
//             }
            
//             console.log('請假時間處理結果:', {
//               開始日期: item.details?.start_date,
//               開始時間: item.details?.start_time,
//               結束日期: item.details?.end_date,
//               結束時間: item.details?.end_time,
//               總時數: item.details?.total_calculation_hours,
//               最終顯示: { startDateTime, endDateTime, totalTime }
//             });
            
//             // 獲取員工姓名和其他基本資訊
//             const employeeName = item.employee_name || "朱彥光";
//             const reviewer = item.reviewer;
            
//             // 修改這裡，使用 formatFormNumber 函數並指定前綴為 'J'
//             const formNumber = item.form_number ? 
//               (typeof formatFormNumber === 'function' ? formatFormNumber(item.form_number, 'J') : `J${item.form_number}`) : 
//               `J${index + 1}`;
            
//             return {
//               id: formNumber, // 使用修改後的表單編號
//               status: statusText,
//               originalStatus: currentStatus,
//               submitTime: submitTime,
//               startTime: startDateTime,
//               endTime: endDateTime,
//               totalTime: totalTime,
//               employee: item.employee_id || employeeId,
//               employeeName: employeeName,
//               leaveType: leaveTypeName,
//               leaveTypeShort: leaveTypeShort,
//               reason: reason,
//               reviewer: reviewer,
//               reviewerJobGrade: item.reviewer_job_grade || "",
//               approver: reviewer,
//               attachment: item.attachment || '附件名稱.pdf',
//               // 保留原始資料以供詳細檢視使用
//               originalData: item,
//               details: item.details || null
//             };
//           });
          
//           console.log(`成功處理 ${userLeaveRequests.length} 筆請假申請`);
//           console.log('處理後的申請列表:', userLeaveRequests);
//           setLeaveRequests(userLeaveRequests);
//           setLoading(false);
//         } catch (err) {
//           console.error("獲取請假申請失敗:", err);
//           setError(err.message);
//           setLoading(false);
//         }
//       };
      
//       fetchLeaveRequests();
//     }
//   }, [activeTab, companyId, employeeId, authToken, t]);
  
//   // 假別資料，使用翻譯
//   const leaveTypes = [
//     { 
//       category: t('leave.legalLeaveTypes'), 
//       types: [
//         { name: t('apply.leaveTypes.personal'), remaining: t('leave.zeroDaysHours') },
//         { name: t('apply.leaveTypes.sick'), remaining: t('leave.zeroHours') },
//         { name: t('apply.leaveTypes.official'), remaining: t('leave.zeroHours') },
//         { name: t('apply.leaveTypes.menstrual'), remaining: t('leave.zeroDaysHours') },
//         { name: t('leave.familyCareLeave'), remaining: t('leave.zeroHours') },
//         { name: t('leave.workInjurySickLeave'), remaining: t('leave.zeroHours') },
//         { name: t('apply.leaveTypes.marriage'), remaining: t('leave.zeroDaysHours') },
//         { name: t('apply.leaveTypes.prenatalCheckup'), remaining: t('leave.zeroHours') },
//         { name: t('leave.paternityCheckupLeave'), remaining: t('leave.zeroDaysHours') },
//         { name: t('leave.bedRestLeave'), remaining: t('leave.zeroDaysHours') },
//         { name: t('apply.leaveTypes.maternity'), remaining: t('leave.zeroDaysHours') },
//         { name: t('leave.parentalLeave'), remaining: t('leave.zeroDaysHours') },
//         { name: t('apply.leaveTypes.compensatory'), remaining: t('leave.zeroHours') },
//         { name: t('apply.leaveTypes.annual'), remaining: t('leave.zeroHours') },
//         { name: t('leave.bereavementLeave'), remaining: t('leave.zeroDaysHours') },
//       ]
//     },
//     { 
//       category: t('leave.companyBenefitLeaveTypes'), 
//       types: [
//         { name: t('apply.leaveTypes.birthday'), remaining: t('leave.zeroHours') },
//       ]
//     }
//   ];

//   // 處理主標籤點擊
//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };
  
//   // 處理子標籤點擊
//   const handleSubTabClick = (subTabName) => {
//     setActiveSubTab(subTabName);
//   };

//   // 處理新增請假申請按鈕點擊
//   const handleNewLeaveRequest = () => {
//     window.location.href = '/applypmx';
//   };
  
//   // 處理返回首頁
//   const handleGoHome = () => {
//     // 檢查是否為手機 app 環境
//     const isInMobileApp = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const isApp = urlParams.get('platform') === 'app';
      
//       const userAgent = navigator.userAgent.toLowerCase();
//       const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
//       const hasFlutterContext = 
//         typeof window.flutter !== 'undefined' || 
//         typeof window.FlutterNativeWeb !== 'undefined';
        
//       return isApp || hasFlutterAgent || hasFlutterContext;
//     };

//     if (isInMobileApp()) {
//       console.log('檢測到 App 環境，使用 Flutter 導航');
      
//       try {
//         if (window.flutter && window.flutter.postMessage) {
//           window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
//         } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
//           window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
//         } else {
//           const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
//             detail: { action: 'navigate_home' }
//           });
//           document.dispatchEvent(event);
//         }
//       } catch (err) {
//         console.error('無法使用 Flutter 導航:', err);
//         window.location.href = '/frontpagepmx';
//       }
//     } else {
//       console.log('瀏覽器環境，使用 window.location.href 導航');
//       window.location.href = '/frontpagepmx';
//     }
//   };
  
//   // 解析剩餘時間字符串，分離天數和小時數
//   const parseRemaining = (remaining) => {
//     // 檢查是否包含天數
//     const hasDays = remaining.includes(t('leave.days'));
    
//     if (hasDays) {
//       const parts = remaining.split(t('leave.days'));
//       return { 
//         hasDays: true, 
//         days: parts[0], 
//         hours: parts[1].replace(t('leave.hours'), '') 
//       };
//     } else {
//       return { 
//         hasDays: false, 
//         days: null, 
//         hours: remaining.replace(t('leave.hours'), '') 
//       };
//     }
//   };
  
//   // 處理點擊申請單
//   const handleRequestClick = (request) => {
//     setSelectedRequest(request);
//     setShowModal(true);
//   };

//   // 處理關閉彈窗
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCancelMessage('');
//   };

//   // 處理撤銷申請 - 修改為使用 auth_xtbb token
//   const handleCancelRequest = async () => {
//     if (!selectedRequest || !selectedRequest.id) {
//       setCancelMessage(t('leave.cannotCancelNoId'));
//       return;
//     }

//     setCancelingLeave(true);
//     setCancelMessage(t('leave.canceling'));

//     try {
//       // 實際調用 API 進行撤銷
//       const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/cancel', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
//         },
//         body: JSON.stringify({
//           company_id: companyId,
//           employee_id: employeeId,
//           form_number: selectedRequest.id
//         })
//       });
      
//       const data = await response.json();
      
//       if (response.ok && data.Status === "Ok") {
//         // 從列表中移除已撤銷的請假記錄
//         setLeaveRequests(prevRequests => 
//           prevRequests.filter(request => request.id !== selectedRequest.id)
//         );
        
//         setCancelMessage(t('leave.cancelSuccess'));
        
//         // 延遲關閉詳情視窗，讓用戶看到成功訊息
//         setTimeout(() => {
//           handleCloseModal();
//         }, 1500);
//       } else {
//         throw new Error(data.Msg || t('leave.cancelFailed'));
//       }
//     } catch (err) {
//       console.error('撤銷請假出錯:', err);
//       setCancelMessage(`${t('leave.cancelFailed')}：${err.message}`);
//     } finally {
//       setCancelingLeave(false);
//     }
//   };
  
//   // 根據子標籤過濾請假申請 - 修改為使用 originalStatus 進行過濾
//   const getFilteredRequests = () => {
//     if (activeSubTab === t('leave.overview')) {
//       return leaveRequests;
//     } else if (activeSubTab === t('leave.statusPending')) {
//       return leaveRequests.filter(request => {
//         const status = request.originalStatus.toLowerCase();
//         return status === "pending" || status === "待審核" || status === "approved_pending_hr";
//       });
//     } else if (activeSubTab === t('leave.statusApproved')) {
//       return leaveRequests.filter(request => {
//         const status = request.originalStatus.toLowerCase();
//         return status === "ok" || status === "approved" || status === "已完成" || status === "1";
//       });
//     } else if (activeSubTab === t('leave.statusRejected')) {
//       return leaveRequests.filter(request => {
//         const status = request.originalStatus.toLowerCase();
//         return status === "no" || status === "rejected" || status === "未通過" || status === "2";
//       });
//     }
//     return leaveRequests;
//   };

//   // 獲取請假類型對應的顏色
//   const getLeaveTypeColor = (leaveType) => {
//     const colorMap = {
//       [t('apply.leaveTypes.personal')]: '#909090',
//       [t('apply.leaveTypes.sick')]: '#FF4D4F',
//       [t('apply.leaveTypes.annual')]: '#4CAF50',
//       [t('apply.leaveTypes.compensatory')]: '#2196F3',
//       [t('apply.leaveTypes.official')]: '#9C27B0',
//       [t('apply.leaveTypes.menstrual')]: '#FF9800',
//       [t('apply.leaveTypes.makeup')]: '#607D8B',
//       [t('apply.leaveTypes.marriage')]: '#E91E63',
//       [t('apply.leaveTypes.prenatalCheckup')]: '#00BCD4',
//       [t('apply.leaveTypes.maternity')]: '#8BC34A',
//       [t('apply.leaveTypes.paternity')]: '#673AB7',
//       [t('apply.leaveTypes.study')]: '#795548',
//       [t('apply.leaveTypes.birthday')]: '#FFC107'
//     };
    
//     return colorMap[leaveType] || '#909090';
//   };

//   // 獲取狀態對應的顏色 - 修改為符合要求的顏色標準
//   const getStatusColor = (status) => {
//     if (status === t('leave.statusApproved')) {
//       return "#4CAF50"; // 綠色
//     } else if (status === t('leave.statusRejected')) {
//       return "#FF4D4F"; // 紅色
//     } else {
//       return "#909090"; // 灰色 - 簽核中
//     }
//   };

//   // 獲取根據當前子標籤過濾後的申請列表
//   const filteredRequests = getFilteredRequests();

//   return (
//     <div className="container">
//       <div className="app-wrapper">
//         {/* 頁面標題與時間 */}
//         <header className="header">
//           <div className="home-icon" onClick={handleGoHome}>
//             <img src={homeIcon} alt="Home" width="20" height="20" />
//           </div>
//           <div className="page-title">{t('leave.title')}</div>
//           <div className="time-display">{currentTime}</div>
//           {/* 新增：語言切換器 */}
//           <div className="leave-language-switch">
//             <LanguageSwitch 
//               className="leave-language-switch-component"
//               containerClassName="leave-language-container"
//               position="relative"
//             />
//           </div>
//         </header>

//         <div className="content-container">
//           <div className="tab-container">
//             {/* 假別額度按鈕 */}
//             <div 
//               className={`tab ${activeTab === t('leave.leaveTypes') ? 'active' : ''}`}
//               onClick={() => handleTabClick(t('leave.leaveTypes'))}
//             >
//               {t('leave.leaveTypes')}
//             </div>
            
//             {/* 審核進度按鈕 */}
//             <div 
//               className={`tab ${activeTab === t('leave.approvalProgress') ? 'active' : ''}`}
//               onClick={() => handleTabClick(t('leave.approvalProgress'))}
//             >
//               {t('leave.approvalProgress')}
//             </div>
//           </div>
          
//           <div className="leave-content-frame">
//             {activeTab === t('leave.leaveTypes') && (
//               <>
//                 {leaveTypes.map((category, categoryIndex) => (
//                   <div key={categoryIndex} className="category-section">
//                     <div className="category-header">{category.category}</div>
//                     <div className="leave-grid">
//                       {category.types.map((type, typeIndex) => {
//                         const { hasDays, days, hours } = parseRemaining(type.remaining);
//                         return (
//                           <div 
//                             key={typeIndex} 
//                             className="leave-card"
//                           >
//                             <div className="leave-card-content">
//                               <div className="leave-name">{type.name}</div>
//                               <div className="remaining-container">
//                                 <div className="remaining-label">{t('leave.remaining')}</div>
//                                 {hasDays && (
//                                   <div className={`days-container ${!hasDays ? 'hidden' : ''}`}>
//                                     <div className="days-value">{days}</div>
//                                     <div className="days-unit">{t('leave.days')}</div>
//                                   </div>
//                                 )}
//                                 <div className="hours-container">
//                                   <div className="hours-value">{hours}</div>
//                                   <div className="hours-unit">{t('leave.hours')}</div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}

//             {activeTab === t('leave.approvalProgress') && (
//               <>
//                 {/* 子標籤容器 - 放在 leave-content-frame 內部 */}
//                 <div className="sub-tab-container" key="sub-tab-container">
//                   <div 
//                     className={`sub-tab ${activeSubTab === t('leave.overview') ? 'active' : ''} first-sub-tab`}
//                     onClick={() => handleSubTabClick(t('leave.overview'))}
//                   >
//                     {t('leave.overview')}
//                   </div>
//                   <div 
//                     className={`sub-tab ${activeSubTab === t('leave.statusPending') ? 'active' : ''}`}
//                     onClick={() => handleSubTabClick(t('leave.statusPending'))}
//                   >
//                     {t('leave.statusPending')}
//                   </div>
//                   <div 
//                     className={`sub-tab ${activeSubTab === t('leave.statusApproved') ? 'active' : ''}`}
//                     onClick={() => handleSubTabClick(t('leave.statusApproved'))}
//                   >
//                     {t('leave.statusApproved')}
//                   </div>
//                   <div 
//                     className={`sub-tab ${activeSubTab === t('leave.statusRejected') ? 'active' : ''} last-sub-tab`}
//                     onClick={() => handleSubTabClick(t('leave.statusRejected'))}
//                   >
//                     {t('leave.statusRejected')}
//                   </div>
//                 </div>
                
//                 {/* 申請單列表內容 */}
//                 {loading ? (
//                   <div className="loading-container">
//                     <div>{t('common.loading')}</div>
//                     <div className="loading-text">{t('leave.loadingData')}</div>
//                   </div>
//                 ) : error ? (
//                   <div className="error-container">
//                     <div>{t('leave.errorOccurred')}: {error}</div>
//                     <div>{t('leave.tryAgainLater')}</div>
//                   </div>
//                 ) : filteredRequests.length === 0 ? (
//                   <div className="empty-message">
//                     {activeSubTab === t('leave.overview') ? t('leave.noRequests') : `${t('leave.noCurrent')}${activeSubTab}${t('leave.requests')}`}
//                   </div>
//                 ) : (
//                   <div className="requests-list">
//                     {filteredRequests.map((request, index) => (
//                       <div                       
//                         key={index} 
//                         className="request-card"
//                         onClick={() => handleRequestClick(request)}
//                       >
//                         <div className="request-id">{request.id}</div>
//                         <div className="submit-time">{t('leave.submitTime')}：{request.submitTime}</div>
//                         <div className="divider"></div>
                        
//                         <div 
//                           className="leave-type-circle"
//                           style={{borderColor: getStatusColor(request.status)}}
//                         ></div>
//                         <div 
//                           className={`leave-type-text ${request.leaveTypeShort.length > 1 ? 'small-text' : ''}`}
//                           style={{color: getStatusColor(request.status)}}
//                         >
//                           {request.leaveTypeShort}
//                         </div>
                        
//                         <div className="leave-type-label">{t('leave.leaveType')}：{request.leaveType}</div>
//                         <div className="leave-time-range">{t('leave.timeRange')}：{request.startTime.split(' ')[0]} {request.startTime.split(' ')[1]}</div>
//                         <div className="leave-time-end">{request.endTime.split(' ')[0]} {request.endTime.split(' ')[1]}</div>
//                         <div className="leave-duration">{t('leave.leaveDuration')}：{request.totalTime}</div>
                        
//                         <div 
//                           className="status-badge"
//                           style={{backgroundColor: getStatusColor(request.status)}}
//                         ></div>
//                         <div className="status-text">{request.status}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
          
//           {/* 只在審核進度頁面顯示新增請假申請按鈕 */}
//           {activeTab === t('leave.approvalProgress') && (
//             <div className="bottom-button">
//               <button 
//                 className="new-leave-request-button"
//                 onClick={handleNewLeaveRequest}
//               >
//                 {t('leave.newRequest')}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 請假申請詳情彈窗 - 修改為與補卡申請一致的樣式 */}
//       {showModal && selectedRequest && (
//         <div className="modal-overlay" onClick={handleCloseModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <button className="close-button" onClick={handleCloseModal}>×</button>
//               <div className="modal-title">{t('leave.modalTitle')}</div>
//             </div>
            
//             <div className="modal-body">
//               <div className="modal-info-section">
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.submitTime')}：</span>
//                   <span className="modal-value">{selectedRequest.submitTime}</span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.formNumber')}：<span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{selectedRequest.id}</span></span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.employee')}：{selectedRequest.employeeName}</span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.status')}：</span>
//                   <span style={{ 
//                     padding: '4px 10px', 
//                     backgroundColor: getStatusColor(selectedRequest.status),
//                     borderRadius: '8px', 
//                     color: '#ffffff', 
//                     fontSize: '14px',
//                     display: 'inline-block', 
//                     textAlign: 'center', 
//                     minWidth: '60px',
//                     marginLeft: '0',  // 移除左邊距
//                     position: 'relative',
//                     top: '0',
//                     left: '-35px'  // 向左移動一點，使其更接近冒號
//                   }}>
//                     {selectedRequest.status}
//                   </span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.leaveType')}：{selectedRequest.leaveType}</span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.leaveTimeRange')}：{selectedRequest.startTime}</span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{selectedRequest.endTime}</span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.totalHours')}：{selectedRequest.totalTime}</span>
//                 </div>
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.leaveDescription')}：{selectedRequest.reason}</span>
//                 </div>
                
//                 {selectedRequest.attachment && (
//                   <div className="modal-row">
//                     <span className="modal-label">{t('leave.attachment')}：{selectedRequest.attachment}</span>
//                   </div>
//                 )}
                
//                 <div className="modal-row">
//                   <span className="modal-label">{t('leave.approver')}：{selectedRequest.approver}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="modal-footer">
//               {(selectedRequest.status === t('leave.statusPending') || selectedRequest.status === t('leave.statusPendingHR')) && (
//                 <button 
//                   className="cancel-request-button" 
//                   onClick={handleCancelRequest}
//                   disabled={cancelingLeave}
//                 >
//                   {cancelingLeave ? t('common.processing') : t('leave.cancel')}
//                 </button>
//               )}
//               <button 
//                 className={`close-modal-button ${
//                   selectedRequest.status !== t('leave.statusPending') && selectedRequest.status !== t('leave.statusPendingHR') ? "full-width" : ""
//                 }`}
//                 onClick={handleCloseModal}
//               >
//                 {t('common.close')}
//               </button>
//             </div>
            
//             {cancelMessage && (
//               <div className="cancel-message">
//                 {cancelMessage}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LeavePage;
import React, { useState, useEffect } from 'react';
import './PMX_CSS/LeavePagePMX.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import { useLanguage } from './Hook/useLanguage';
import LanguageSwitch from './components/LanguageSwitch';
import Cookies from 'js-cookie'; // 引入 js-cookie 庫
import { validateUserFromCookies, formatFormNumber } from './function/function'; // 引入共用函數
import { API_BASE_URL } from '../config';

function LeavePage() {
  // 添加語言 Hook
  const { t } = useLanguage();
  
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [authToken, setAuthToken] = useState(""); // 新增 authToken 狀態
  const [activeTab, setActiveTab] = useState('假別');
  const [activeSubTab, setActiveSubTab] = useState('總覽');
  const [currentTime, setCurrentTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingLeave, setCancelingLeave] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return t('common.noRecord');
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr; // 如果無法解析日期，返回原始字符串
    
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  // 使用 API 獲取請假申請數據 - 修改為使用 auth_xtbb token
  useEffect(() => {
    if (activeTab === t('leave.approvalProgress')) {
      if (!companyId || !employeeId || !authToken) {
        return;
      }

      const fetchLeaveRequests = async () => {
        try {
          setLoading(true);
          
          console.log(`正在查詢員工 ${employeeId} 的請假申請...`);
          
          // 使用 /api/forms/advanced-search API 查詢請假申請，添加 auth_xtbb token
          const response = await fetch(`${API_BASE_URL}/api/forms/advanced-search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
            },
            body: JSON.stringify({
              company_id: parseInt(companyId),
              employee_id: employeeId,
              category: "leave",
              includeDetails: true
            })
          });
          
          console.log('發送的請求參數:', {
            company_id: parseInt(companyId),
            employee_id: employeeId,
            category: "leave",
            includeDetails: true
          });
          
          if (!response.ok) {
            throw new Error(`API 請求失敗: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('API 完整回應:', data);
          
          if (data.Status !== "Ok") {
            throw new Error(data.Msg || "查詢失敗");
          }
          
          if (!data.Data || data.Data.length === 0) {
            console.log('沒有找到請假申請數據');
            setLeaveRequests([]);
            setLoading(false);
            return;
          }
          
          // 強制在前端過濾，確保只顯示當前員工的申請
          const currentEmployeeRequests = data.Data.filter(item => {
            const itemEmployeeId = String(item.employee_id);
            const currentEmployeeId = String(employeeId);
            
            console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
            
            return itemEmployeeId === currentEmployeeId;
          });
          
          console.log(`過濾前共 ${data.Data.length} 筆申請`);
          console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的請假申請`);
          
          // 如果沒有找到當前員工的申請，顯示空列表
          if (currentEmployeeRequests.length === 0) {
            console.log('當前員工沒有請假申請');
            setLeaveRequests([]);
            setLoading(false);
            return;
          }
          
          // 處理回應數據，轉換為前端需要的格式
          const userLeaveRequests = currentEmployeeRequests.map((item, index) => {
            console.log('處理申請項目:', item);
            console.log('詳細資料:', item.details);
            
            // 狀態映射 - 根據後端的狀態欄位，更全面地處理所有可能的狀態
            let statusText = t('leave.statusPending');
            const currentStatus = item.status || '';
            
            // 轉換為小寫進行比較，確保大小寫不敏感
            const statusLower = currentStatus.toLowerCase();
            
            // 更全面的狀態映射
            if (statusLower === 'approved' || 
                statusLower === 'ok' || 
                statusLower === '已完成' || 
                statusLower === '1') {
              statusText = t('leave.statusApproved');
            } 
            else if (statusLower === 'rejected' || 
                     statusLower === 'no' || 
                     statusLower === '未通過' || 
                     statusLower === '2') {
              statusText = t('leave.statusRejected');
            }
            else if (statusLower === 'pending' || 
                     statusLower === '待審核' || 
                     statusLower === 'approved_pending_hr') {
              statusText = t('leave.statusPending');
            }
            
            // 格式化申請日期
            let submitTime = t('common.noRecord');
            if (item.application_date) {
              submitTime = formatDateTime(item.application_date);
            }

            // 定義請假類型映射表
            const leaveTypeMap = {
              'compensatory_leave': { name: t('apply.leaveTypes.compensatory'), short: t('leave.typeShort.compensatory') },
              'annual_leave': { name: t('apply.leaveTypes.annual'), short: t('leave.typeShort.annual') },
              'personal_leave': { name: t('apply.leaveTypes.personal'), short: t('leave.typeShort.personal') },
              'sick_leave': { name: t('apply.leaveTypes.sick'), short: t('leave.typeShort.sick') },
              'menstrual_leave': { name: t('apply.leaveTypes.menstrual'), short: t('leave.typeShort.menstrual') },
              'makeup_leave': { name: t('apply.leaveTypes.makeup'), short: t('leave.typeShort.makeup') },
              'official_leave': { name: t('apply.leaveTypes.official'), short: t('leave.typeShort.official') },
              'marriage_leave': { name: t('apply.leaveTypes.marriage'), short: t('leave.typeShort.marriage') },
              'prenatal_checkup_leave': { name: t('apply.leaveTypes.prenatalCheckup'), short: t('leave.typeShort.prenatalCheckup') },
              'maternity_leave': { name: t('apply.leaveTypes.maternity'), short: t('leave.typeShort.maternity') },
              'paternity_leave': { name: t('apply.leaveTypes.paternity'), short: t('leave.typeShort.paternity') },
              'study_leave': { name: t('apply.leaveTypes.study'), short: t('leave.typeShort.study') },
              'birthday_leave': { name: t('apply.leaveTypes.birthday'), short: t('leave.typeShort.birthday') }
            };
            
            // 處理請假類型 - 根據資料庫結構優先使用 type 欄位
            let leaveTypeName = t('leave.unspecified');
            let leaveTypeShort = t('leave.typeShort.unspecified');
            
            // 1. 優先使用基本資料的 type 欄位
            if (item.type) {
              // 將 API 值轉換為顯示名稱
              if (leaveTypeMap[item.type]) {
                leaveTypeName = leaveTypeMap[item.type].name;
                leaveTypeShort = leaveTypeMap[item.type].short;
              } else {
                leaveTypeName = item.type;
                leaveTypeShort = item.type.substring(0, 1);
              }
            }
            // 2. 如果基本資料沒有，嘗試從詳細資料獲取
            else if (item.details && item.details.type) {
              // 同樣使用映射表處理詳細資料中的 type
              if (leaveTypeMap[item.details.type]) {
                leaveTypeName = leaveTypeMap[item.details.type].name;
                leaveTypeShort = leaveTypeMap[item.details.type].short;
              } else {
                leaveTypeName = item.details.type;
                leaveTypeShort = item.details.type.substring(0, 1);
              }
            }
            
            console.log('請假類型處理結果:', {
              基本資料type: item.type,
              詳細資料type: item.details?.type,
              最終結果: leaveTypeName
            });
            
            // 處理請假原因 - 根據資料庫結構使用 illustrate 欄位
            let reason = t('leave.noReason');
            
            // 1. 優先使用詳細資料的 illustrate 欄位
            if (item.details && item.details.illustrate) {
              reason = item.details.illustrate;
            }
            // 2. 備用：使用基本資料的 description
            else if (item.description) {
              reason = item.description;
            }
            
            console.log('請假原因處理結果:', {
              詳細資料illustrate: item.details?.illustrate,
              基本資料description: item.description,
              最終結果: reason
            });
            
            // 格式化請假時間 - 根據資料庫結構處理
            let startDateTime = t('leave.unspecified');
            let endDateTime = t('leave.unspecified');
            let totalTime = `0${t('leave.hours')} 0${t('leave.minutes')}`;
            
            if (item.details) {
              const startDate = item.details.start_date;
              const startTime = item.details.start_time;
              const endDate = item.details.end_date;
              const endTime = item.details.end_time;
              const totalHours = item.details.total_calculation_hours;
              
              // 格式化時間顯示（去除秒數）
              const formatTime = (timeStr) => {
                if (!timeStr) return '';
                return timeStr.split(':').slice(0, 2).join(':');
              };
              
              if (startDate && startTime) {
                startDateTime = `${startDate} ${formatTime(startTime)}`;
              }
              
              if (endDate && endTime) {
                endDateTime = `${endDate} ${formatTime(endTime)}`;
              } else {
                endDateTime = startDateTime;
              }
              
              // 計算總時數
              if (totalHours) {
                const hours = Math.floor(totalHours);
                const minutes = Math.round((totalHours - hours) * 60);
                totalTime = `${hours}${t('leave.hours')}${minutes}${t('leave.minutes')}`;
              }
            }
            
            console.log('請假時間處理結果:', {
              開始日期: item.details?.start_date,
              開始時間: item.details?.start_time,
              結束日期: item.details?.end_date,
              結束時間: item.details?.end_time,
              總時數: item.details?.total_calculation_hours,
              最終顯示: { startDateTime, endDateTime, totalTime }
            });
            
            // 獲取員工姓名和其他基本資訊
            const employeeName = item.employee_name || "朱彥光";
            const reviewer = item.reviewer;
            
            // 修改這裡，使用 formatFormNumber 函數並指定前綴為 'J'
            const formNumber = item.form_number ? 
              (typeof formatFormNumber === 'function' ? formatFormNumber(item.form_number, 'J') : `J${item.form_number}`) : 
              `J${index + 1}`;
            
            return {
              id: formNumber, // 使用修改後的表單編號
              status: statusText,
              originalStatus: currentStatus,
              submitTime: submitTime,
              startTime: startDateTime,
              endTime: endDateTime,
              totalTime: totalTime,
              employee: item.employee_id || employeeId,
              employeeName: employeeName,
              leaveType: leaveTypeName,
              leaveTypeShort: leaveTypeShort,
              reason: reason,
              reviewer: reviewer,
              reviewerJobGrade: item.reviewer_job_grade || "",
              approver: reviewer,
              attachment: item.attachment || '附件名稱.pdf',
              // 保留原始資料以供詳細檢視使用
              originalData: item,
              details: item.details || null
            };
          });
          
          console.log(`成功處理 ${userLeaveRequests.length} 筆請假申請`);
          console.log('處理後的申請列表:', userLeaveRequests);
          setLeaveRequests(userLeaveRequests);
          setLoading(false);
        } catch (err) {
          console.error("獲取請假申請失敗:", err);
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchLeaveRequests();
    }
  }, [activeTab, companyId, employeeId, authToken, t]);
  
  // 假別資料，使用翻譯
  const leaveTypes = [
    { 
      category: t('leave.legalLeaveTypes'), 
      types: [
        { name: t('apply.leaveTypes.personal'), remaining: t('leave.zeroDaysHours') },
        { name: t('apply.leaveTypes.sick'), remaining: t('leave.zeroHours') },
        { name: t('apply.leaveTypes.official'), remaining: t('leave.zeroHours') },
        { name: t('apply.leaveTypes.menstrual'), remaining: t('leave.zeroDaysHours') },
        { name: t('leave.familyCareLeave'), remaining: t('leave.zeroHours') },
        { name: t('leave.workInjurySickLeave'), remaining: t('leave.zeroHours') },
        { name: t('apply.leaveTypes.marriage'), remaining: t('leave.zeroDaysHours') },
        { name: t('apply.leaveTypes.prenatalCheckup'), remaining: t('leave.zeroHours') },
        { name: t('leave.paternityCheckupLeave'), remaining: t('leave.zeroDaysHours') },
        { name: t('leave.bedRestLeave'), remaining: t('leave.zeroDaysHours') },
        { name: t('apply.leaveTypes.maternity'), remaining: t('leave.zeroDaysHours') },
        { name: t('leave.parentalLeave'), remaining: t('leave.zeroDaysHours') },
        { name: t('apply.leaveTypes.compensatory'), remaining: t('leave.zeroHours') },
        { name: t('apply.leaveTypes.annual'), remaining: t('leave.zeroHours') },
        { name: t('leave.bereavementLeave'), remaining: t('leave.zeroDaysHours') },
      ]
    },
    { 
      category: t('leave.companyBenefitLeaveTypes'), 
      types: [
        { name: t('apply.leaveTypes.birthday'), remaining: t('leave.zeroHours') },
      ]
    }
  ];

  // 處理主標籤點擊
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  
  // 處理子標籤點擊
  const handleSubTabClick = (subTabName) => {
    setActiveSubTab(subTabName);
  };

  // 處理新增請假申請按鈕點擊
  const handleNewLeaveRequest = () => {
    window.location.href = '/applypmx';
  };
  
  // 處理返回首頁
  const handleGoHome = () => {
    // 檢查是否為手機 app 環境
    const isInMobileApp = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isApp = urlParams.get('platform') === 'app';
      
      const userAgent = navigator.userAgent.toLowerCase();
      const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
      const hasFlutterContext = 
        typeof window.flutter !== 'undefined' || 
        typeof window.FlutterNativeWeb !== 'undefined';
        
      return isApp || hasFlutterAgent || hasFlutterContext;
    };

    if (isInMobileApp()) {
      console.log('檢測到 App 環境，使用 Flutter 導航');
      
      try {
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else {
          const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
            detail: { action: 'navigate_home' }
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error('無法使用 Flutter 導航:', err);
        window.location.href = '/frontpagepmx';
      }
    } else {
      console.log('瀏覽器環境，使用 window.location.href 導航');
      window.location.href = '/frontpagepmx';
    }
  };
  
  // 解析剩餘時間字符串，分離天數和小時數
  const parseRemaining = (remaining) => {
    // 檢查是否包含天數
    const hasDays = remaining.includes(t('leave.days'));
    
    if (hasDays) {
      const parts = remaining.split(t('leave.days'));
      return { 
        hasDays: true, 
        days: parts[0], 
        hours: parts[1].replace(t('leave.hours'), '') 
      };
    } else {
      return { 
        hasDays: false, 
        days: null, 
        hours: remaining.replace(t('leave.hours'), '') 
      };
    }
  };
  
  // 處理點擊申請單
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // 處理關閉彈窗
  const handleCloseModal = () => {
    setShowModal(false);
    setCancelMessage('');
  };

  // 處理撤銷申請 - 修改為使用 auth_xtbb token
  const handleCancelRequest = async () => {
    if (!selectedRequest || !selectedRequest.id) {
      setCancelMessage(t('leave.cannotCancelNoId'));
      return;
    }

    setCancelingLeave(true);
    setCancelMessage(t('leave.canceling'));

    try {
      // 實際調用 API 進行撤銷
      const response = await fetch(`${API_BASE_URL}/api/forms/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
        },
        body: JSON.stringify({
          company_id: companyId,
          employee_id: employeeId,
          form_number: selectedRequest.id
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.Status === "Ok") {
        // 從列表中移除已撤銷的請假記錄
        setLeaveRequests(prevRequests => 
          prevRequests.filter(request => request.id !== selectedRequest.id)
        );
        
        setCancelMessage(t('leave.cancelSuccess'));
        
        // 延遲關閉詳情視窗，讓用戶看到成功訊息
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        throw new Error(data.Msg || t('leave.cancelFailed'));
      }
    } catch (err) {
      console.error('撤銷請假出錯:', err);
      setCancelMessage(`${t('leave.cancelFailed')}：${err.message}`);
    } finally {
      setCancelingLeave(false);
    }
  };
  
  // 根據子標籤過濾請假申請 - 修改為使用 originalStatus 進行過濾
  const getFilteredRequests = () => {
    if (activeSubTab === t('leave.overview')) {
      return leaveRequests;
    } else if (activeSubTab === t('leave.statusPending')) {
      return leaveRequests.filter(request => {
        const status = request.originalStatus.toLowerCase();
        return status === "pending" || status === "待審核" || status === "approved_pending_hr";
      });
    } else if (activeSubTab === t('leave.statusApproved')) {
      return leaveRequests.filter(request => {
        const status = request.originalStatus.toLowerCase();
        return status === "ok" || status === "approved" || status === "已完成" || status === "1";
      });
    } else if (activeSubTab === t('leave.statusRejected')) {
      return leaveRequests.filter(request => {
        const status = request.originalStatus.toLowerCase();
        return status === "no" || status === "rejected" || status === "未通過" || status === "2";
      });
    }
    return leaveRequests;
  };

  // 獲取請假類型對應的顏色
  const getLeaveTypeColor = (leaveType) => {
    const colorMap = {
      [t('apply.leaveTypes.personal')]: '#909090',
      [t('apply.leaveTypes.sick')]: '#FF4D4F',
      [t('apply.leaveTypes.annual')]: '#4CAF50',
      [t('apply.leaveTypes.compensatory')]: '#2196F3',
      [t('apply.leaveTypes.official')]: '#9C27B0',
      [t('apply.leaveTypes.menstrual')]: '#FF9800',
      [t('apply.leaveTypes.makeup')]: '#607D8B',
      [t('apply.leaveTypes.marriage')]: '#E91E63',
      [t('apply.leaveTypes.prenatalCheckup')]: '#00BCD4',
      [t('apply.leaveTypes.maternity')]: '#8BC34A',
      [t('apply.leaveTypes.paternity')]: '#673AB7',
      [t('apply.leaveTypes.study')]: '#795548',
      [t('apply.leaveTypes.birthday')]: '#FFC107'
    };
    
    return colorMap[leaveType] || '#909090';
  };

  // 獲取狀態對應的顏色 - 修改為符合要求的顏色標準
  const getStatusColor = (status) => {
    if (status === t('leave.statusApproved')) {
      return "#4CAF50"; // 綠色
    } else if (status === t('leave.statusRejected')) {
      return "#FF4D4F"; // 紅色
    } else {
      return "#909090"; // 灰色 - 簽核中
    }
  };

  // 獲取根據當前子標籤過濾後的申請列表
  const filteredRequests = getFilteredRequests();

  return (
    <div className="container">
      <div className="app-wrapper">
        {/* 頁面標題與時間 */}
        <header className="header">
          <div className="home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt="Home" width="20" height="20" />
          </div>
          <div className="page-title">{t('leave.title')}</div>
          <div className="time-display">{currentTime}</div>
          {/* 新增：語言切換器 */}
          <div className="leave-language-switch">
            <LanguageSwitch 
              className="leave-language-switch-component"
              containerClassName="leave-language-container"
              position="relative"
            />
          </div>
        </header>

        <div className="content-container">
          <div className="tab-container">
            {/* 假別額度按鈕 */}
            <div 
              className={`tab ${activeTab === t('leave.leaveTypes') ? 'active' : ''}`}
              onClick={() => handleTabClick(t('leave.leaveTypes'))}
            >
              {t('leave.leaveTypes')}
            </div>
            
            {/* 審核進度按鈕 */}
            <div 
              className={`tab ${activeTab === t('leave.approvalProgress') ? 'active' : ''}`}
              onClick={() => handleTabClick(t('leave.approvalProgress'))}
            >
              {t('leave.approvalProgress')}
            </div>
          </div>
          
          <div className="leave-content-frame">
            {activeTab === t('leave.leaveTypes') && (
              <>
                {leaveTypes.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="category-section">
                    <div className="category-header">{category.category}</div>
                    <div className="leave-grid">
                      {category.types.map((type, typeIndex) => {
                        const { hasDays, days, hours } = parseRemaining(type.remaining);
                        return (
                          <div 
                            key={typeIndex} 
                            className="leave-card"
                          >
                            <div className="leave-card-content">
                              <div className="leave-name">{type.name}</div>
                              <div className="remaining-container">
                                <div className="remaining-label">{t('leave.remaining')}</div>
                                {hasDays && (
                                  <div className={`days-container ${!hasDays ? 'hidden' : ''}`}>
                                    <div className="days-value">{days}</div>
                                    <div className="days-unit">{t('leave.days')}</div>
                                  </div>
                                )}
                                <div className="hours-container">
                                  <div className="hours-value">{hours}</div>
                                  <div className="hours-unit">{t('leave.hours')}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === t('leave.approvalProgress') && (
              <>
                {/* 子標籤容器 - 放在 leave-content-frame 內部 */}
                <div className="sub-tab-container" key="sub-tab-container">
                  <div 
                    className={`sub-tab ${activeSubTab === t('leave.overview') ? 'active' : ''} first-sub-tab`}
                    onClick={() => handleSubTabClick(t('leave.overview'))}
                  >
                    {t('leave.overview')}
                  </div>
                  <div 
                    className={`sub-tab ${activeSubTab === t('leave.statusPending') ? 'active' : ''}`}
                    onClick={() => handleSubTabClick(t('leave.statusPending'))}
                  >
                    {t('leave.statusPending')}
                  </div>
                  <div 
                    className={`sub-tab ${activeSubTab === t('leave.statusApproved') ? 'active' : ''}`}
                    onClick={() => handleSubTabClick(t('leave.statusApproved'))}
                  >
                    {t('leave.statusApproved')}
                  </div>
                  <div 
                    className={`sub-tab ${activeSubTab === t('leave.statusRejected') ? 'active' : ''} last-sub-tab`}
                    onClick={() => handleSubTabClick(t('leave.statusRejected'))}
                  >
                    {t('leave.statusRejected')}
                  </div>
                </div>
                
                {/* 申請單列表內容 */}
                {loading ? (
                  <div className="loading-container">
                    <div>{t('common.loading')}</div>
                    <div className="loading-text">{t('leave.loadingData')}</div>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <div>{t('leave.errorOccurred')}: {error}</div>
                    <div>{t('leave.tryAgainLater')}</div>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="empty-message">
                    {activeSubTab === t('leave.overview') ? t('leave.noRequests') : `${t('leave.noCurrent')}${activeSubTab}${t('leave.requests')}`}
                  </div>
                ) : (
                  <div className="requests-list">
                    {filteredRequests.map((request, index) => (
                      <div                       
                        key={index} 
                        className="request-card"
                        onClick={() => handleRequestClick(request)}
                      >
                        <div className="request-id">{request.id}</div>
                        <div className="submit-time">{t('leave.submitTime')}：{request.submitTime}</div>
                        <div className="divider"></div>
                        
                        <div 
                          className="leave-type-circle"
                          style={{borderColor: getStatusColor(request.status)}}
                        ></div>
                        <div 
                          className={`leave-type-text ${request.leaveTypeShort.length > 1 ? 'small-text' : ''}`}
                          style={{color: getStatusColor(request.status)}}
                        >
                          {request.leaveTypeShort}
                        </div>
                        
                        <div className="leave-type-label">{t('leave.leaveType')}：{request.leaveType}</div>
                        <div className="leave-time-range">{t('leave.timeRange')}：{request.startTime.split(' ')[0]} {request.startTime.split(' ')[1]}</div>
                        <div className="leave-time-end">{request.endTime.split(' ')[0]} {request.endTime.split(' ')[1]}</div>
                        <div className="leave-duration">{t('leave.leaveDuration')}：{request.totalTime}</div>
                        
                        <div 
                          className="status-badge"
                          style={{backgroundColor: getStatusColor(request.status)}}
                        ></div>
                        <div className="status-text">{request.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* 只在審核進度頁面顯示新增請假申請按鈕 */}
          {activeTab === t('leave.approvalProgress') && (
            <div className="bottom-button">
              <button 
                className="new-leave-request-button"
                onClick={handleNewLeaveRequest}
              >
                {t('leave.newRequest')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 請假申請詳情彈窗 - 修改為與補卡申請一致的樣式 */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-button" onClick={handleCloseModal}>×</button>
              <div className="modal-title">{t('leave.modalTitle')}</div>
            </div>
            
            <div className="modal-body">
              <div className="modal-info-section">
                <div className="modal-row">
                  <span className="modal-label">{t('leave.submitTime')}：</span>
                  <span className="modal-value">{selectedRequest.submitTime}</span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.formNumber')}：<span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{selectedRequest.id}</span></span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.employee')}：{selectedRequest.employeeName}</span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.status')}：</span>
                  <span style={{ 
                    padding: '4px 10px', 
                    backgroundColor: getStatusColor(selectedRequest.status),
                    borderRadius: '8px', 
                    color: '#ffffff', 
                    fontSize: '14px',
                    display: 'inline-block', 
                    textAlign: 'center', 
                    minWidth: '60px',
                    marginLeft: '0',  // 移除左邊距
                    position: 'relative',
                    top: '0',
                    left: '-35px'  // 向左移動一點，使其更接近冒號
                  }}>
                    {selectedRequest.status}
                  </span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.leaveType')}：{selectedRequest.leaveType}</span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.leaveTimeRange')}：{selectedRequest.startTime}</span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{selectedRequest.endTime}</span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.totalHours')}：{selectedRequest.totalTime}</span>
                </div>
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.leaveDescription')}：{selectedRequest.reason}</span>
                </div>
                
                {selectedRequest.attachment && (
                  <div className="modal-row">
                    <span className="modal-label">{t('leave.attachment')}：{selectedRequest.attachment}</span>
                  </div>
                )}
                
                <div className="modal-row">
                  <span className="modal-label">{t('leave.approver')}：{selectedRequest.approver}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              {(selectedRequest.status === t('leave.statusPending') || selectedRequest.status === t('leave.statusPendingHR')) && (
                <button 
                  className="cancel-request-button" 
                  onClick={handleCancelRequest}
                  disabled={cancelingLeave}
                >
                  {cancelingLeave ? t('common.processing') : t('leave.cancel')}
                </button>
              )}
              <button 
                className={`close-modal-button ${
                  selectedRequest.status !== t('leave.statusPending') && selectedRequest.status !== t('leave.statusPendingHR') ? "full-width" : ""
                }`}
                onClick={handleCloseModal}
              >
                {t('common.close')}
              </button>
            </div>
            
            {cancelMessage && (
              <div className="cancel-message">
                {cancelMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeavePage;
