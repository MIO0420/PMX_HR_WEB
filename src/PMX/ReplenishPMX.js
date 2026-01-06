// import React, { useState, useEffect } from "react";
// import './PMX_CSS/ReplenishPMX.css';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import { 
//   validateUserFromCookies, 
//   formatFormNumber, 
//   fetchAndProcessFormData,
//   getFilteredRequests 
// } from './function/function';
// import LanguageSwitch from './components/LanguageSwitch';
// import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook

// function Replenish() {
//   // 引入語言功能
//   const { t } = useLanguage();
  
//   const [companyId, setCompanyId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   // 修正：使用語言翻譯的預設值，並在語言變更時更新
//   const [activeTab, setActiveTab] = useState("總覽"); // 先用中文作為預設值
//   const [currentTime, setCurrentTime] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [replenishRequests, setReplenishRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [authToken, setAuthToken] = useState(''); // 新增 authToken 狀態
  
//   // 解析 description 欄位，分離補卡原因和詳細說明
//   const parseDescription = (description) => {
//     if (!description) return { reason: t('replenish.notFilled'), detail: t('common.none') };
    
//     const reasons = [t('replenish.businessTrip'), t('replenish.forgotPunch'), t('replenish.personalMatter'), t('replenish.other')];
//     let reason = t('replenish.notFilled');
//     let detail = t('common.none');
    
//     // 尋找匹配的補卡原因
//     for (const r of reasons) {
//       if (description.startsWith(r)) {
//         reason = r;
//         // 提取詳細說明（去除前面的原因和可能的空格）
//         detail = description.substring(r.length).trim();
//         if (!detail) detail = t('common.none');
//         break;
//       }
//     }
    
//     return { reason, detail };
//   };

//   // 狀態映射函數
//   const mapStatus = (status) => {
//     switch (status) {
//       case "ok":
//         return t('replenish.statusApproved');
//       case "no":
//         return t('replenish.statusRejected');
//       case "pending":
//         return t('replenish.statusPending');
//       default:
//         return t('replenish.statusPending');
//     }
//   };

//   // 安全的日期格式化函數
//   const formatDate = (dateString) => {
//     if (!dateString) return t('common.notSpecified');
//     try {
//       return new Date(dateString).toLocaleDateString('zh-TW');
//     } catch (error) {
//       return t('common.notSpecified');
//     }
//   };

//   // 安全的日期時間格式化函數
//   const formatDateTime = (dateString) => {
//     if (!dateString) return t('common.notSpecified');
//     try {
//       return new Date(dateString).toLocaleString('zh-TW', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false
//       });
//     } catch (error) {
//       return t('common.notSpecified');
//     }
//   };

//   // 處理 API 資料並轉換為前端需要的格式
//   const processReplenishData = (apiData) => {
//     if (!Array.isArray(apiData)) return [];
    
//     return apiData.map(item => {
//       // 安全檢查 item 是否存在且有必要欄位
//       if (!item || !item.form_number) return null;
      
//       const { reason, detail } = parseDescription(item.description);
      
//       return {
//         // 使用 formatFormNumber 函數格式化申請單號，與加班申請單相同
//         id: formatFormNumber(item.form_number, 'R'), // 使用 'R' 作為補卡申請的前綴
//         status: mapStatus(item.status),
//         submitTime: formatDateTime(item.application_date),
//         employeeName: item.employee_name || t('common.notSpecified'),
//         // 列表顯示用
//         type: item.application_type || t('common.notSpecified'), // 補卡類型（上班/下班）
//         reason: reason, // 補卡原因（出差/忘記打卡等）
//         applicationDate: formatDate(item.start_date), // 使用 start_date 作為補卡日期
//         // 彈窗詳細資訊用
//         details: {
//           type: item.application_type || t('common.notSpecified'), // 補卡類型
//           reason: reason, // 補卡事由
//           date: formatDate(item.start_date), // 補卡日期
//           start_time: item.start_time || t('common.notSpecified'), // 補卡時間
//           detail: detail, // 詳細說明
//           reviewer: item.reviewer || t('common.notSpecified'), // 審核者
//           department: item.department || t('common.notSpecified'), // 部門
//           position: item.position || t('common.notSpecified') // 職位
//         }
//       };
//     }).filter(item => item !== null); // 過濾掉 null 值
//   };

//   // 當語言變更時，更新 activeTab 為對應的翻譯
//   useEffect(() => {
//     // 如果當前 activeTab 是中文的預設值，則更新為對應的翻譯
//     if (activeTab === "總覽") {
//       setActiveTab(t('replenish.overview'));
//     } else if (activeTab === "簽核中") {
//       setActiveTab(t('replenish.statusPending'));
//     } else if (activeTab === "已通過") {
//       setActiveTab(t('replenish.statusApproved'));
//     } else if (activeTab === "未通過") {
//       setActiveTab(t('replenish.statusRejected'));
//     }
//   }, [t]); // 當語言變更時觸發
  
//   // 使用共用函數驗證用戶
//   useEffect(() => {
//     validateUserFromCookies(
//       setLoading,
//       setAuthToken,
//       setCompanyId,
//       setEmployeeId
//     );
//   }, []);
  
//   // 獲取補卡申請數據 - 使用與原版相同的邏輯
//   useEffect(() => {
//     if (!companyId || !employeeId || !authToken) {
//       return;
//     }

//     const fetchReplenishRequests = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // 使用完整的 API URL
//         const apiUrl = 'https://rabbit.54ucl.com:3004/api/forms/advanced-search';
        
//         const requestBody = {
//           company_id: companyId,
//           employee_id: employeeId,
//           category: "replenish"
//         };
        
//         console.log('發送 API 請求:', {
//           url: apiUrl,
//           body: requestBody,
//           token: authToken ? '已設置' : '未設置'
//         });
        
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authToken}`
//           },
//           mode: 'cors',
//           // 移除 credentials: 'include' 來避免 CORS 問題
//           body: JSON.stringify(requestBody)
//         });

//         console.log('API 回應狀態:', response.status);
//         console.log('API 回應 headers:', Object.fromEntries(response.headers.entries()));

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('API 錯誤回應:', errorText);
//           throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
//         }

//         const contentType = response.headers.get('content-type');
//         console.log('回應內容類型:', contentType);
        
//         if (!contentType || !contentType.includes('application/json')) {
//           const textResponse = await response.text();
//           console.error('非 JSON 回應內容:', textResponse);
//           throw new Error(`伺服器回傳非 JSON 格式資料，內容類型: ${contentType}`);
//         }

//         const result = await response.json();
//         console.log('API 成功回應:', result);
        
//         if (result.Status === "Ok") {
//           if (Array.isArray(result.Data)) {
//             // 過濾掉無效的資料項目
//             const validData = result.Data.filter(item => 
//               item && 
//               item.form_number && 
//               item.employee_id === employeeId && 
//               item.company_id == companyId
//             );
            
//             const processedRequests = processReplenishData(validData);
//             console.log("處理後的補卡申請資料:", processedRequests);
//             setReplenishRequests(processedRequests);
//           } else {
//             console.warn("Data 不是陣列:", result.Data);
//             setReplenishRequests([]);
//           }
//         } else {
//           console.warn("API 狀態非 Ok:", result);
//           setError(`API 回傳錯誤: ${result.Msg || result.Message || '未知錯誤'}`);
//           setReplenishRequests([]);
//         }
        
//       } catch (err) {
//         console.error("獲取補卡申請失敗:", err);
        
//         // 更詳細的錯誤處理
//         if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
//           setError(t('replenish.networkError'));
//         } else if (err.message.includes('CORS')) {
//           setError(t('replenish.corsError'));
//         } else if (err.message.includes('404')) {
//           setError(t('replenish.apiNotFoundError'));
//         } else {
//           setError(`${t('replenish.requestFailed')}: ${err.message}`);
//         }
        
//         setReplenishRequests([]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchReplenishRequests();
//   }, [companyId, employeeId, authToken, t]); // 添加 t 作為依賴

//   // 處理標籤點擊
//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };

//   // 處理新增補卡申請按鈕
//   const handleNewReplenishRequest = () => {
//     window.location.href = "/replenishapplypmx";
//   };
  
//   // 處理返回首頁 - 能夠區分瀏覽器請求和手機app請求
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

//   // 處理點擊申請單
//   const handleRequestClick = (request) => {
//     setSelectedRequest(request);
//     setShowModal(true);
//   };

//   // 處理關閉彈窗
//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   // 處理撤銷申請
//   const handleCancelRequest = () => {
//     // 這裡可以加入撤銷申請的邏輯
//     alert(t('replenish.cancelRequestMessage', { id: selectedRequest?.id || '' }));
//     setShowModal(false);
//   };
  
//   // 獲取狀態對應的顏色
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "已通過":
//       case t('replenish.statusApproved'):
//         return "#3AA672"; // 綠色
//       case "未通過":
//       case t('replenish.statusRejected'):
//         return "#F44336"; // 紅色
//       case "待HR審核":
//       case t('replenish.statusPendingHR'):
//         return "#FF9800"; // 橙色
//       default:
//         return "#919191"; // 灰色 - 簽核中
//     }
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

//   // 過濾申請單 - 加入安全檢查和多語言支援
//   const filteredRequests = Array.isArray(replenishRequests) ? replenishRequests.filter(request => {
//     if (!request) return false;
//     if (activeTab === "總覽" || activeTab === t('replenish.overview')) return true;
//     return request.status === activeTab;
//   }) : [];

//   return (
//     <div className="replenish-container">
//       <div className="replenish-app-wrapper">
//         {/* 頁面標題與時間 */}
//         <header className="replenish-header">
//           <div className="replenish-home-icon" onClick={handleGoHome}>
//             <img src={homeIcon} alt={t('home.title')} width="20" height="20" />
//           </div>
//           <div className="replenish-page-title">{t('replenish.title')}</div>
//           <div className="replenish-time-display">{currentTime}</div>
//           {/* 新增：語言切換器 */}
//           <div className="replenish-language-switch">
//             <LanguageSwitch 
//               className="replenish-language-switch-component"
//               containerClassName="replenish-language-container"
//               position="relative"
//             />
//           </div>
//         </header>
        
//         <div className="replenish-content-container">
//           <div className="replenish-tab-container">
//             <div 
//               className={`replenish-tab ${activeTab === t('replenish.overview') ? "replenish-tab-active" : ""}`}
//               onClick={() => handleTabClick(t('replenish.overview'))}
//             >
//               {t('replenish.overview')}
//             </div>
//             <div 
//               className={`replenish-tab ${activeTab === t('replenish.statusPending') ? "replenish-tab-active" : ""}`}
//               onClick={() => handleTabClick(t('replenish.statusPending'))}
//             >
//               {t('replenish.statusPending')}
//             </div>
//             <div 
//               className={`replenish-tab ${activeTab === t('replenish.statusApproved') ? "replenish-tab-active" : ""}`}
//               onClick={() => handleTabClick(t('replenish.statusApproved'))}
//             >
//               {t('replenish.statusApproved')}
//             </div>
//             <div 
//               className={`replenish-tab ${activeTab === t('replenish.statusRejected') ? "replenish-tab-active" : ""}`}
//               onClick={() => handleTabClick(t('replenish.statusRejected'))}
//             >
//               {t('replenish.statusRejected')}
//             </div>
//           </div>
          
//           <div className="replenish-content-frame">
//             {loading ? (
//               <div className="replenish-loading-container">
//                 {/* 添加旋轉的圈圈 */}
//                 <div className="replenish-loading-spinner"></div>
//                 <div className="replenish-loading-text">{t('replenish.loadingData')}</div>
//               </div>
//             ) : error ? (
//               <div className="replenish-error-container">
//                 <div className="replenish-error-title">{t('replenish.errorOccurred')}</div>
//                 <div className="replenish-error-message">{error}</div>
//                 <button 
//                   className="replenish-retry-button"
//                   onClick={() => {
//                     setError(null);
//                     setLoading(true);
//                     // 重新觸發 useEffect
//                     window.location.reload();
//                   }}
//                 >
//                   {t('common.retry')}
//                 </button>
//               </div>
//             ) : filteredRequests.length === 0 ? (
//               <div className="replenish-empty-message">
//                 {(() => {
//                   if (activeTab === t('replenish.overview')) {
//                     return t('replenish.noRequests');
//                   } else if (activeTab === t('replenish.statusPending')) {
//                     return t('replenish.noPendingRequests');
//                   } else if (activeTab === t('replenish.statusApproved')) {
//                     return t('replenish.noApprovedRequests');
//                   } else if (activeTab === t('replenish.statusRejected')) {
//                     return t('replenish.noRejectedRequests');
//                   } else {
//                     return t('replenish.noRequests');
//                   }
//                 })()}
//               </div>
//             ) : (
//               <div className="replenish-requests-container">
//                 {filteredRequests.map((request, index) => (
//                   <div 
//                     key={request?.id || index} 
//                     className="replenish-request-card"
//                     onClick={() => handleRequestClick(request)}
//                   >
//                     <div className="replenish-request-id">{request?.id || t('common.notSpecified')}</div>
//                     <div className="replenish-submit-time">{t('replenish.submitTime')}：{request?.submitTime || t('common.notSpecified')}</div>
//                     <div className="replenish-request-line"></div>
                    
//                     <div className={`replenish-status-badge ${
//                       request?.status === t('replenish.statusApproved') ? "replenish-status-approved" : 
//                       request?.status === t('replenish.statusRejected') ? "replenish-status-rejected" : ""
//                     }`}>
//                       <span className="replenish-status-text">{request?.status || t('common.unknown')}</span>
//                     </div>
                  
//                     {/* 列表顯示 - 加入安全檢查 */}
//                     <div className="replenish-type">
//                       {t('replenish.replenishType')}：{request?.type || t('common.notSpecified')}
//                     </div>
//                     <div className="replenish-reason">
//                       {t('replenish.replenishReason')}：{request?.reason || t('replenish.notFilled')}
//                     </div>
//                     <div className="replenish-time">
//                       {t('replenish.replenishDate')}：{request?.applicationDate || t('common.notSpecified')}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* 新增補打卡申請按鈕 - 移到與加班頁面相同的位置 */}
//         <button 
//           className="replenish-new-request-button"
//           onClick={handleNewReplenishRequest}
//         >
//           {t('replenish.newRequest')}
//         </button>
//       </div>
    
//       {/* 彈出視窗 - 加入安全檢查和多語言支援 */}
//       {showModal && selectedRequest && (
//         <div className="replenish-modal-overlay" onClick={handleCloseModal}>
//           <div className="replenish-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="replenish-modal-header">
//               <button className="replenish-close-button" onClick={handleCloseModal}>×</button>
//               <div className="replenish-modal-title">{t('replenish.modalTitle')}</div>
//             </div>
            
//             <div className="replenish-modal-body">
//               <div className="replenish-modal-info-section">
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.formNumber')}：</span>
//                   <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>
//                     {selectedRequest?.id || t('common.notSpecified')}
//                   </span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.submitTime')}：{selectedRequest?.submitTime || t('common.notSpecified')}</span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.employee')}：{selectedRequest?.employeeName || t('common.notSpecified')}</span>
//                 </div>

//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.department')}：{selectedRequest?.details?.department || t('common.notSpecified')}</span>
//                 </div>

//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.position')}：{selectedRequest?.details?.position || t('common.notSpecified')}</span>
//                 </div>

//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.reviewer')}：{selectedRequest?.details?.reviewer || t('common.notSpecified')}</span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.status')}：</span>
//                   <span style={{ 
//                     padding: '4px 10px', 
//                     backgroundColor: getStatusColor(selectedRequest?.status),
//                     borderRadius: '8px', 
//                     color: '#ffffff', 
//                     fontSize: '14px',
//                     display: 'inline-block', 
//                     textAlign: 'center', 
//                     minWidth: '60px',
//                     marginLeft: '10px'
//                   }}>
//                     {selectedRequest?.status || t('common.unknown')}
//                   </span>
//                 </div>
                
//                 <div className="replenish-modal-divider"></div>
                
//                 {/* 補卡詳細資訊 */}
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.replenishType')}：{selectedRequest?.details?.type || t('common.notSpecified')}</span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.replenishReason')}：{selectedRequest?.details?.reason || t('replenish.notFilled')}</span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.replenishDate')}：{selectedRequest?.details?.date || t('common.notSpecified')}</span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.replenishTime')}：{selectedRequest?.details?.start_time || t('common.notSpecified')}</span>
//                 </div>
                
//                 <div className="replenish-modal-row">
//                   <span className="replenish-modal-label">{t('replenish.detailDescription')}：</span>
//                   <div className="replenish-modal-detail-text">
//                     {selectedRequest?.details?.detail || t('common.none')}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="replenish-modal-footer">
//               {(selectedRequest?.status === t('replenish.statusPending') || selectedRequest?.status === t('replenish.statusPendingHR')) && (
//                 <button className="replenish-cancel-button" onClick={handleCancelRequest}>
//                   {t('replenish.cancel')}
//                 </button>
//               )}
//               <button 
//                 className={`replenish-close-modal-button ${
//                   selectedRequest?.status !== t('replenish.statusPending') && selectedRequest?.status !== t('replenish.statusPendingHR') ? "replenish-full-width" : ""
//                 }`}
//                 onClick={handleCloseModal}
//               >
//                 {t('common.close')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Replenish;
import React, { useState, useEffect } from "react";
import './PMX_CSS/ReplenishPMX.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import { 
  validateUserFromCookies, 
  formatFormNumber, 
  fetchAndProcessFormData,
  getFilteredRequests 
} from './function/function';
import LanguageSwitch from './components/LanguageSwitch';
import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook
import { API_BASE_URL } from '../config';

function Replenish() {
  // 引入語言功能
  const { t } = useLanguage();
  
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  // 修正：使用語言翻譯的預設值，並在語言變更時更新
  const [activeTab, setActiveTab] = useState("總覽"); // 先用中文作為預設值
  const [currentTime, setCurrentTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replenishRequests, setReplenishRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(''); // 新增 authToken 狀態
  
  // 解析 description 欄位，分離補卡原因和詳細說明
  const parseDescription = (description) => {
    if (!description) return { reason: t('replenish.notFilled'), detail: t('common.none') };
    
    const reasons = [t('replenish.businessTrip'), t('replenish.forgotPunch'), t('replenish.personalMatter'), t('replenish.other')];
    let reason = t('replenish.notFilled');
    let detail = t('common.none');
    
    // 尋找匹配的補卡原因
    for (const r of reasons) {
      if (description.startsWith(r)) {
        reason = r;
        // 提取詳細說明（去除前面的原因和可能的空格）
        detail = description.substring(r.length).trim();
        if (!detail) detail = t('common.none');
        break;
      }
    }
    
    return { reason, detail };
  };

  // 狀態映射函數
  const mapStatus = (status) => {
    switch (status) {
      case "ok":
        return t('replenish.statusApproved');
      case "no":
        return t('replenish.statusRejected');
      case "pending":
        return t('replenish.statusPending');
      default:
        return t('replenish.statusPending');
    }
  };

  // 安全的日期格式化函數
  const formatDate = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    try {
      return new Date(dateString).toLocaleDateString('zh-TW');
    } catch (error) {
      return t('common.notSpecified');
    }
  };

  // 安全的日期時間格式化函數
  const formatDateTime = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    try {
      return new Date(dateString).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return t('common.notSpecified');
    }
  };

  // 處理 API 資料並轉換為前端需要的格式
  const processReplenishData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map(item => {
      // 安全檢查 item 是否存在且有必要欄位
      if (!item || !item.form_number) return null;
      
      const { reason, detail } = parseDescription(item.description);
      
      return {
        // 使用 formatFormNumber 函數格式化申請單號，與加班申請單相同
        id: formatFormNumber(item.form_number, 'R'), // 使用 'R' 作為補卡申請的前綴
        status: mapStatus(item.status),
        submitTime: formatDateTime(item.application_date),
        employeeName: item.employee_name || t('common.notSpecified'),
        // 列表顯示用
        type: item.application_type || t('common.notSpecified'), // 補卡類型（上班/下班）
        reason: reason, // 補卡原因（出差/忘記打卡等）
        applicationDate: formatDate(item.start_date), // 使用 start_date 作為補卡日期
        // 彈窗詳細資訊用
        details: {
          type: item.application_type || t('common.notSpecified'), // 補卡類型
          reason: reason, // 補卡事由
          date: formatDate(item.start_date), // 補卡日期
          start_time: item.start_time || t('common.notSpecified'), // 補卡時間
          detail: detail, // 詳細說明
          reviewer: item.reviewer || t('common.notSpecified'), // 審核者
          department: item.department || t('common.notSpecified'), // 部門
          position: item.position || t('common.notSpecified') // 職位
        }
      };
    }).filter(item => item !== null); // 過濾掉 null 值
  };

  // 當語言變更時，更新 activeTab 為對應的翻譯
  useEffect(() => {
    // 如果當前 activeTab 是中文的預設值，則更新為對應的翻譯
    if (activeTab === "總覽") {
      setActiveTab(t('replenish.overview'));
    } else if (activeTab === "簽核中") {
      setActiveTab(t('replenish.statusPending'));
    } else if (activeTab === "已通過") {
      setActiveTab(t('replenish.statusApproved'));
    } else if (activeTab === "未通過") {
      setActiveTab(t('replenish.statusRejected'));
    }
  }, [t]); // 當語言變更時觸發
  
  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);
  
  // 獲取補卡申請數據 - 使用與原版相同的邏輯
  useEffect(() => {
    if (!companyId || !employeeId || !authToken) {
      return;
    }

    const fetchReplenishRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 使用完整的 API URL
        const apiUrl = `${API_BASE_URL}/api/forms/advanced-search`;
        
        const requestBody = {
          company_id: companyId,
          employee_id: employeeId,
          category: "replenish"
        };
        
        console.log('發送 API 請求:', {
          url: apiUrl,
          body: requestBody,
          token: authToken ? '已設置' : '未設置'
        });
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          mode: 'cors',
          // 移除 credentials: 'include' 來避免 CORS 問題
          body: JSON.stringify(requestBody)
        });

        console.log('API 回應狀態:', response.status);
        console.log('API 回應 headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API 錯誤回應:', errorText);
          throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('回應內容類型:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('非 JSON 回應內容:', textResponse);
          throw new Error(`伺服器回傳非 JSON 格式資料，內容類型: ${contentType}`);
        }

        const result = await response.json();
        console.log('API 成功回應:', result);
        
        if (result.Status === "Ok") {
          if (Array.isArray(result.Data)) {
            // 過濾掉無效的資料項目
            const validData = result.Data.filter(item => 
              item && 
              item.form_number && 
              item.employee_id === employeeId && 
              item.company_id == companyId
            );
            
            const processedRequests = processReplenishData(validData);
            console.log("處理後的補卡申請資料:", processedRequests);
            setReplenishRequests(processedRequests);
          } else {
            console.warn("Data 不是陣列:", result.Data);
            setReplenishRequests([]);
          }
        } else {
          console.warn("API 狀態非 Ok:", result);
          setError(`API 回傳錯誤: ${result.Msg || result.Message || '未知錯誤'}`);
          setReplenishRequests([]);
        }
        
      } catch (err) {
        console.error("獲取補卡申請失敗:", err);
        
        // 更詳細的錯誤處理
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          setError(t('replenish.networkError'));
        } else if (err.message.includes('CORS')) {
          setError(t('replenish.corsError'));
        } else if (err.message.includes('404')) {
          setError(t('replenish.apiNotFoundError'));
        } else {
          setError(`${t('replenish.requestFailed')}: ${err.message}`);
        }
        
        setReplenishRequests([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReplenishRequests();
  }, [companyId, employeeId, authToken, t]); // 添加 t 作為依賴

  // 處理標籤點擊
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 處理新增補卡申請按鈕
  const handleNewReplenishRequest = () => {
    window.location.href = "/replenishapplypmx";
  };
  
  // 處理返回首頁 - 能夠區分瀏覽器請求和手機app請求
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

  // 處理點擊申請單
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // 處理關閉彈窗
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 處理撤銷申請
  const handleCancelRequest = () => {
    // 這裡可以加入撤銷申請的邏輯
    alert(t('replenish.cancelRequestMessage', { id: selectedRequest?.id || '' }));
    setShowModal(false);
  };
  
  // 獲取狀態對應的顏色
  const getStatusColor = (status) => {
    switch (status) {
      case "已通過":
      case t('replenish.statusApproved'):
        return "#3AA672"; // 綠色
      case "未通過":
      case t('replenish.statusRejected'):
        return "#F44336"; // 紅色
      case "待HR審核":
      case t('replenish.statusPendingHR'):
        return "#FF9800"; // 橙色
      default:
        return "#919191"; // 灰色 - 簽核中
    }
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

  // 過濾申請單 - 加入安全檢查和多語言支援
  const filteredRequests = Array.isArray(replenishRequests) ? replenishRequests.filter(request => {
    if (!request) return false;
    if (activeTab === "總覽" || activeTab === t('replenish.overview')) return true;
    return request.status === activeTab;
  }) : [];

  return (
    <div className="replenish-container">
      <div className="replenish-app-wrapper">
        {/* 頁面標題與時間 */}
        <header className="replenish-header">
          <div className="replenish-home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt={t('home.title')} width="20" height="20" />
          </div>
          <div className="replenish-page-title">{t('replenish.title')}</div>
          <div className="replenish-time-display">{currentTime}</div>
          {/* 新增：語言切換器 */}
          <div className="replenish-language-switch">
            <LanguageSwitch 
              className="replenish-language-switch-component"
              containerClassName="replenish-language-container"
              position="relative"
            />
          </div>
        </header>
        
        <div className="replenish-content-container">
          <div className="replenish-tab-container">
            <div 
              className={`replenish-tab ${activeTab === t('replenish.overview') ? "replenish-tab-active" : ""}`}
              onClick={() => handleTabClick(t('replenish.overview'))}
            >
              {t('replenish.overview')}
            </div>
            <div 
              className={`replenish-tab ${activeTab === t('replenish.statusPending') ? "replenish-tab-active" : ""}`}
              onClick={() => handleTabClick(t('replenish.statusPending'))}
            >
              {t('replenish.statusPending')}
            </div>
            <div 
              className={`replenish-tab ${activeTab === t('replenish.statusApproved') ? "replenish-tab-active" : ""}`}
              onClick={() => handleTabClick(t('replenish.statusApproved'))}
            >
              {t('replenish.statusApproved')}
            </div>
            <div 
              className={`replenish-tab ${activeTab === t('replenish.statusRejected') ? "replenish-tab-active" : ""}`}
              onClick={() => handleTabClick(t('replenish.statusRejected'))}
            >
              {t('replenish.statusRejected')}
            </div>
          </div>
          
          <div className="replenish-content-frame">
            {loading ? (
              <div className="replenish-loading-container">
                {/* 添加旋轉的圈圈 */}
                <div className="replenish-loading-spinner"></div>
                <div className="replenish-loading-text">{t('replenish.loadingData')}</div>
              </div>
            ) : error ? (
              <div className="replenish-error-container">
                <div className="replenish-error-title">{t('replenish.errorOccurred')}</div>
                <div className="replenish-error-message">{error}</div>
                <button 
                  className="replenish-retry-button"
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    // 重新觸發 useEffect
                    window.location.reload();
                  }}
                >
                  {t('common.retry')}
                </button>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="replenish-empty-message">
                {(() => {
                  if (activeTab === t('replenish.overview')) {
                    return t('replenish.noRequests');
                  } else if (activeTab === t('replenish.statusPending')) {
                    return t('replenish.noPendingRequests');
                  } else if (activeTab === t('replenish.statusApproved')) {
                    return t('replenish.noApprovedRequests');
                  } else if (activeTab === t('replenish.statusRejected')) {
                    return t('replenish.noRejectedRequests');
                  } else {
                    return t('replenish.noRequests');
                  }
                })()}
              </div>
            ) : (
              <div className="replenish-requests-container">
                {filteredRequests.map((request, index) => (
                  <div 
                    key={request?.id || index} 
                    className="replenish-request-card"
                    onClick={() => handleRequestClick(request)}
                  >
                    <div className="replenish-request-id">{request?.id || t('common.notSpecified')}</div>
                    <div className="replenish-submit-time">{t('replenish.submitTime')}：{request?.submitTime || t('common.notSpecified')}</div>
                    <div className="replenish-request-line"></div>
                    
                    <div className={`replenish-status-badge ${
                      request?.status === t('replenish.statusApproved') ? "replenish-status-approved" : 
                      request?.status === t('replenish.statusRejected') ? "replenish-status-rejected" : ""
                    }`}>
                      <span className="replenish-status-text">{request?.status || t('common.unknown')}</span>
                    </div>
                  
                    {/* 列表顯示 - 加入安全檢查 */}
                    <div className="replenish-type">
                      {t('replenish.replenishType')}：{request?.type || t('common.notSpecified')}
                    </div>
                    <div className="replenish-reason">
                      {t('replenish.replenishReason')}：{request?.reason || t('replenish.notFilled')}
                    </div>
                    <div className="replenish-time">
                      {t('replenish.replenishDate')}：{request?.applicationDate || t('common.notSpecified')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 新增補打卡申請按鈕 - 移到與加班頁面相同的位置 */}
        <button 
          className="replenish-new-request-button"
          onClick={handleNewReplenishRequest}
        >
          {t('replenish.newRequest')}
        </button>
      </div>
    
      {/* 彈出視窗 - 加入安全檢查和多語言支援 */}
      {showModal && selectedRequest && (
        <div className="replenish-modal-overlay" onClick={handleCloseModal}>
          <div className="replenish-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="replenish-modal-header">
              <button className="replenish-close-button" onClick={handleCloseModal}>×</button>
              <div className="replenish-modal-title">{t('replenish.modalTitle')}</div>
            </div>
            
            <div className="replenish-modal-body">
              <div className="replenish-modal-info-section">
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.formNumber')}：</span>
                  <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>
                    {selectedRequest?.id || t('common.notSpecified')}
                  </span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.submitTime')}：{selectedRequest?.submitTime || t('common.notSpecified')}</span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.employee')}：{selectedRequest?.employeeName || t('common.notSpecified')}</span>
                </div>

                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.department')}：{selectedRequest?.details?.department || t('common.notSpecified')}</span>
                </div>

                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.position')}：{selectedRequest?.details?.position || t('common.notSpecified')}</span>
                </div>

                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.reviewer')}：{selectedRequest?.details?.reviewer || t('common.notSpecified')}</span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.status')}：</span>
                  <span style={{ 
                    padding: '4px 10px', 
                    backgroundColor: getStatusColor(selectedRequest?.status),
                    borderRadius: '8px', 
                    color: '#ffffff', 
                    fontSize: '14px',
                    display: 'inline-block', 
                    textAlign: 'center', 
                    minWidth: '60px',
                    marginLeft: '10px'
                  }}>
                    {selectedRequest?.status || t('common.unknown')}
                  </span>
                </div>
                
                <div className="replenish-modal-divider"></div>
                
                {/* 補卡詳細資訊 */}
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.replenishType')}：{selectedRequest?.details?.type || t('common.notSpecified')}</span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.replenishReason')}：{selectedRequest?.details?.reason || t('replenish.notFilled')}</span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.replenishDate')}：{selectedRequest?.details?.date || t('common.notSpecified')}</span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.replenishTime')}：{selectedRequest?.details?.start_time || t('common.notSpecified')}</span>
                </div>
                
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">{t('replenish.detailDescription')}：</span>
                  <div className="replenish-modal-detail-text">
                    {selectedRequest?.details?.detail || t('common.none')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="replenish-modal-footer">
              {(selectedRequest?.status === t('replenish.statusPending') || selectedRequest?.status === t('replenish.statusPendingHR')) && (
                <button className="replenish-cancel-button" onClick={handleCancelRequest}>
                  {t('replenish.cancel')}
                </button>
              )}
              <button 
                className={`replenish-close-modal-button ${
                  selectedRequest?.status !== t('replenish.statusPending') && selectedRequest?.status !== t('replenish.statusPendingHR') ? "replenish-full-width" : ""
                }`}
                onClick={handleCloseModal}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Replenish;
