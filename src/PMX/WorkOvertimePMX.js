// // import React, { useState, useEffect } from "react";
// // import './PMX_CSS/WorkOvertimePMX.css';
// // import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// // import { 
// //   validateUserFromCookies, 
// //   formatFormNumber, 
// //   fetchAndProcessFormData,
// //   getFilteredRequests 
// // } from './function/function';

// // function WorkOvertime() {
// //   const [companyId, setCompanyId] = useState("");
// //   const [employeeId, setEmployeeId] = useState("");
// //   const [activeTab, setActiveTab] = useState("總覽");
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedRequest, setSelectedRequest] = useState(null);
// //   const [overtimeRequests, setOvertimeRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [authToken, setAuthToken] = useState('');
  
// //   // 使用共用函數驗證用戶
// //   useEffect(() => {
// //     validateUserFromCookies(
// //       setLoading,
// //       setAuthToken,
// //       setCompanyId,
// //       setEmployeeId
// //     );
// //   }, []);
  
// //   // 使用 API 獲取加班申請數據
// //   useEffect(() => {
// //     if (!companyId || !employeeId || !authToken) {
// //       return;
// //     }

// //     const fetchOvertimeRequests = async () => {
// //       try {
// //         setLoading(true);
        
// //         // 使用從 LeavePage 提取的通用函數
// //         const processedRequests = await fetchAndProcessFormData(companyId, employeeId, "work_overtime", authToken);
        
// //         setOvertimeRequests(processedRequests);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("獲取加班申請失敗:", err);
// //         setError(err.message);
// //         setLoading(false);
// //       }
// //     };
    
// //     fetchOvertimeRequests();
// //   }, [companyId, employeeId, authToken]);

// //   // 處理標籤點擊
// //   const handleTabClick = (tabName) => {
// //     setActiveTab(tabName);
// //   };

// //   // 處理新增加班申請按鈕
// //   const handleNewOvertimeRequest = () => {
// //     window.location.href = "/workovertimeapplypmx";
// //   };
  
// //   // 處理返回首頁 - 能夠區分瀏覽器請求和手機app請求
// //   const handleGoHome = () => {
// //     // 檢查是否為手機 app 環境
// //     const isInMobileApp = () => {
// //       const urlParams = new URLSearchParams(window.location.search);
// //       const isApp = urlParams.get('platform') === 'app';
      
// //       const userAgent = navigator.userAgent.toLowerCase();
// //       const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
// //       const hasFlutterContext = 
// //         typeof window.flutter !== 'undefined' || 
// //         typeof window.FlutterNativeWeb !== 'undefined';
        
// //       return isApp || hasFlutterAgent || hasFlutterContext;
// //     };

// //     if (isInMobileApp()) {
// //       console.log('檢測到 App 環境，使用 Flutter 導航');
      
// //       try {
// //         if (window.flutter && window.flutter.postMessage) {
// //           window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
// //         } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
// //           window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
// //         } else {
// //           const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
// //             detail: { action: 'navigate_home' }
// //           });
// //           document.dispatchEvent(event);
// //         }
// //       } catch (err) {
// //         console.error('無法使用 Flutter 導航:', err);
// //         window.location.href = '/frontpagepmx';
// //       }
// //     } else {
// //       console.log('瀏覽器環境，使用 window.location.href 導航');
// //       window.location.href = '/frontpagepmx';
// //     }
// //   };

// //   // 處理點擊申請單
// //   const handleRequestClick = (request) => {
// //     setSelectedRequest(request);
// //     setShowModal(true);
// //   };

// //   // 處理關閉彈窗
// //   const handleCloseModal = () => {
// //     setShowModal(false);
// //   };

// //   // 處理撤銷申請
// //   const handleCancelRequest = () => {
// //     // 這裡可以加入撤銷申請的邏輯
// //     alert(`已撤銷申請 ${selectedRequest.id}`);
// //     setShowModal(false);
// //   };

// //   // 添加全局樣式以防止滾動
// //   useEffect(() => {
// //     document.body.style.overflow = 'hidden';
// //     document.body.style.margin = '0';
// //     document.body.style.padding = '0';
// //     document.documentElement.style.overflow = 'hidden';
// //     document.documentElement.style.margin = '0';
// //     document.documentElement.style.padding = '0';
    
// //     return () => {
// //       document.body.style.overflow = '';
// //       document.body.style.margin = '';
// //       document.body.style.padding = '';
// //       document.documentElement.style.overflow = '';
// //       document.documentElement.style.margin = '';
// //       document.documentElement.style.padding = '';
// //     };
// //   }, []);

// //   // 使用從 LeavePage 提取的過濾函數
// //   const filteredRequests = getFilteredRequests(overtimeRequests, activeTab);

// //   return (
// //     <div className="work-overtime-container">
// //       <div className="work-overtime-app-wrapper">
// //         {/* 頁面標題與時間 */}
// //         <header className="work-overtime-header">
// //           <div className="work-overtime-home-icon" onClick={handleGoHome}>
// //             <img src={homeIcon} alt="Home" width="20" height="20" />
// //           </div>
// //           <div className="work-overtime-page-title">加班</div>
// //         </header>
        
// //         <div className="work-overtime-content-container">
// //           <div className="work-overtime-tab-container">
// //             <div 
// //               className={`work-overtime-tab ${activeTab === "總覽" ? "work-overtime-tab-active" : ""}`}
// //               onClick={() => handleTabClick("總覽")}
// //             >
// //               總覽
// //             </div>
// //             <div 
// //               className={`work-overtime-tab ${activeTab === "簽核中" ? "work-overtime-tab-active" : ""}`}
// //               onClick={() => handleTabClick("簽核中")}
// //             >
// //               簽核中
// //             </div>
// //             <div 
// //               className={`work-overtime-tab ${activeTab === "已通過" ? "work-overtime-tab-active" : ""}`}
// //               onClick={() => handleTabClick("已通過")}
// //             >
// //               已通過
// //             </div>
// //             <div 
// //               className={`work-overtime-tab ${activeTab === "未通過" ? "work-overtime-tab-active" : ""}`}
// //               onClick={() => handleTabClick("未通過")}
// //             >
// //               未通過
// //             </div>
// //           </div>
          
// //           <div className="work-overtime-content-frame">
// //             {loading ? (
// //               <div className="work-overtime-loading-container">
// //                 <div className="work-overtime-loading-spinner"></div>
// //                 <div className="work-overtime-loading-text">正在獲取加班申請數據</div>
// //               </div>
// //             ) : error ? (
// //               <div className="work-overtime-error-container">
// //                 <div>發生錯誤: {error}</div>
// //                 <div>請稍後再試或聯繫系統管理員</div>
// //               </div>
// //             ) : filteredRequests.length === 0 ? (
// //               <div className="work-overtime-empty-message">
// //                 {activeTab === "總覽" ? "目前無申請單" : `目前無${activeTab}的申請單`}
// //               </div>
// //             ) : (
// //               <div className="work-overtime-requests-container">
// //                 {filteredRequests.map((request, index) => (
// //                   <div 
// //                     key={index} 
// //                     className="work-overtime-request-card"
// //                     onClick={() => handleRequestClick(request)}
// //                   >
// //                     <div className="work-overtime-request-id">{request.id}</div>
// //                     <div className="work-overtime-submit-time">送出時間：{request.submitTime}</div>
// //                     <div className="work-overtime-request-line"></div>
                    
// //                     <div className={`work-overtime-status-badge ${
// //                       request.status === "已通過" ? "work-overtime-status-approved" : 
// //                       request.status === "未通過" ? "work-overtime-status-rejected" : ""
// //                     }`}>
// //                       <span className="work-overtime-status-text">{request.status}</span>
// //                     </div>
                  
// // <div className="work-overtime-time-container">
// //   <div className="work-overtime-time-row">
// //     <span className="work-overtime-time-label">加班時間起迄：</span>
// //     <span className="work-overtime-time-value">{request.startTime}</span>
// //   </div>
// //   <div className="work-overtime-time-row">
// //     <span className="work-overtime-time-label" style={{ visibility: 'hidden' }}>加班時間起迄：</span>
// //     <span className="work-overtime-time-value">{request.endTime}</span>
// //   </div>
// //   <div className="work-overtime-hours">加班總時數：{request.totalHours}小時0分鐘</div>
// // </div>

// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
        
// //         {/* 新增加班申請按鈕 */}
// //         <button 
// //           className="work-overtime-new-request-button"
// //           onClick={handleNewOvertimeRequest}
// //         >
// //           新增加班申請
// //         </button>
// //       </div>
      
// // {/* 彈出視窗 */}
// // {showModal && selectedRequest && (
// //   <div className="work-overtime-modal-overlay" onClick={handleCloseModal}>
// //     <div className="work-overtime-modal-content" onClick={(e) => e.stopPropagation()}>
// //       <div className="work-overtime-modal-header-new">
// //         <button className="work-overtime-close-button-new" onClick={handleCloseModal}>×</button>
// //         <div className="work-overtime-modal-title-new">加班申請單</div>
// //       </div>
      
// //       <div className="work-overtime-modal-body">
// //         <div className="work-overtime-modal-info-section">
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">送出時間：</span>
// //             <span className="work-overtime-modal-value">{selectedRequest.submitTime}</span>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">單號：</span>
// //             <span className="work-overtime-modal-value work-overtime-modal-id">{selectedRequest.id}</span>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">員工：</span>
// //             <span className="work-overtime-modal-value">{selectedRequest.employeeName}</span>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">狀態：</span>
// //             <div className={`work-overtime-modal-status-badge ${
// //               selectedRequest.status === "已通過" ? "work-overtime-modal-status-approved" : 
// //               selectedRequest.status === "未通過" ? "work-overtime-modal-status-rejected" : 
// //               "work-overtime-modal-status-pending"
// //             }`}>
// //               {selectedRequest.status}
// //             </div>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">加班類型：</span>
// //             <span className="work-overtime-modal-value">{selectedRequest.overtimeType}</span>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">補償：</span>
// //             <span className="work-overtime-modal-value">{selectedRequest.compensationType}</span>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">加班時間起迄：</span>
// //             <div className="work-overtime-modal-time-range-horizontal">
// //               <span className="work-overtime-modal-value">{selectedRequest.startTime}</span>
// //               <span className="work-overtime-modal-value">{selectedRequest.endTime}</span>
// //             </div>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">總時數：</span>
// //             <span className="work-overtime-modal-value">{selectedRequest.totalHours}小時0分鐘</span>
// //           </div>
          
// //           <div className="work-overtime-modal-row-horizontal">
// //             <span className="work-overtime-modal-label">申請說明：</span>
// //             <span className="work-overtime-modal-value">{selectedRequest.reason}</span>
// //           </div>
          
// //           {selectedRequest.reviewer && selectedRequest.reviewer !== "未指定" && (
// //             <div className="work-overtime-modal-row-horizontal">
// //               <span className="work-overtime-modal-label">核准人：</span>
// //               <span className="work-overtime-modal-value">{selectedRequest.reviewer}</span>
// //             </div>
// //           )}
// //         </div>
// //       </div>
      
// //       <div className="work-overtime-modal-footer">
// //         {(selectedRequest.status === "簽核中" || selectedRequest.status === "待HR審核") && (
// //           <button className="work-overtime-cancel-button" onClick={handleCancelRequest}>
// //             撤銷
// //           </button>
// //         )}
// //         <button 
// //           className={`work-overtime-close-modal-button ${
// //             selectedRequest.status !== "簽核中" && selectedRequest.status !== "待HR審核" ? "work-overtime-full-width" : ""
// //           }`}
// //           onClick={handleCloseModal}
// //         >
// //           關閉
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // )}

// //     </div>
// //   );
// // }

// // export default WorkOvertime;
// import React, { useState, useEffect } from "react";
// import './PMX_CSS/WorkOvertimePMX.css';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import { 
//   validateUserFromCookies, 
//   formatFormNumber, 
//   fetchAndProcessFormData,
//   getFilteredRequests 
// } from './function/function';

// function WorkOvertime() {
//   const [companyId, setCompanyId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [activeTab, setActiveTab] = useState("總覽");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [overtimeRequests, setOvertimeRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [authToken, setAuthToken] = useState('');
  
//   // 處理員工ID，去除前導零
//   const normalizeEmployeeId = (id) => {
//     if (!id) return id;
//     return id.toString().replace(/^0+/, '') || '0';
//   };
  
//   // 使用共用函數驗證用戶
//   useEffect(() => {
//     validateUserFromCookies(
//       setLoading,
//       setAuthToken,
//       setCompanyId,
//       setEmployeeId
//     );
//   }, []);
  
//   // 使用 API 獲取加班申請數據
//   useEffect(() => {
//     if (!companyId || !employeeId || !authToken) {
//       return;
//     }

//     const fetchOvertimeRequests = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // 正規化員工ID，去除前導零
//         const normalizedEmployeeId = normalizeEmployeeId(employeeId);
//         console.log('原始員工ID:', employeeId);
//         console.log('正規化後員工ID:', normalizedEmployeeId);
        
//         // 使用完整的 API URL，參考補卡頁面的實作
//         const apiUrl = 'https://rabbit.54ucl.com:3004/api/forms/advanced-search';
        
//         const requestBody = {
//           company_id: companyId,
//           employee_id: normalizedEmployeeId, // 使用正規化後的員工ID
//           category: "work_overtime"
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
//             // 過濾並處理資料
//             const validData = result.Data.filter(item => 
//               item && 
//               item.form_number && 
//               normalizeEmployeeId(item.employee_id) === normalizedEmployeeId && 
//               item.company_id == companyId
//             );
            
//             const processedRequests = processOvertimeData(validData);
//             console.log("處理後的加班申請資料:", processedRequests);
//             setOvertimeRequests(processedRequests);
//           } else {
//             console.warn("Data 不是陣列:", result.Data);
//             setOvertimeRequests([]);
//           }
//         } else {
//           console.warn("API 狀態非 Ok:", result);
//           setError(`API 回傳錯誤: ${result.Msg || result.Message || '未知錯誤'}`);
//           setOvertimeRequests([]);
//         }
        
//       } catch (err) {
//         console.error("獲取加班申請失敗:", err);
        
//         // 更詳細的錯誤處理
//         if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
//           setError('網路連線錯誤，請檢查網路連線');
//         } else if (err.message.includes('CORS')) {
//           setError('跨域請求錯誤，請聯繫系統管理員');
//         } else if (err.message.includes('404')) {
//           setError('API 端點不存在，請聯繫系統管理員');
//         } else {
//           setError(`請求失敗: ${err.message}`);
//         }
        
//         setOvertimeRequests([]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchOvertimeRequests();
//   }, [companyId, employeeId, authToken]);

//   // 處理加班申請資料的函數
//   const processOvertimeData = (apiData) => {
//     if (!Array.isArray(apiData)) return [];
    
//     return apiData.map(item => {
//       if (!item || !item.form_number) return null;
      
//       return {
//         id: formatFormNumber(item.form_number, 'O'), // 使用 'O' 作為加班申請的前綴
//         status: mapStatus(item.status),
//         submitTime: formatDateTime(item.application_date),
//         employeeName: item.employee_name || '未指定',
//         startTime: formatDateTime(item.start_date, item.start_time),
//         endTime: formatDateTime(item.end_date, item.end_time),
//         totalHours: item.total_hours || '0',
//         overtimeType: item.application_type || '未指定',
//         compensationType: '加班費', // 預設值，可根據實際需求調整
//         reason: item.description || '無',
//         reviewer: item.reviewer || '未指定',
//         department: item.department || '未指定',
//         position: item.position || '未指定'
//       };
//     }).filter(item => item !== null);
//   };

//   // 狀態映射函數
//   const mapStatus = (status) => {
//     switch (status) {
//       case "ok":
//         return "已通過";
//       case "no":
//         return "未通過";
//       case "pending":
//         return "簽核中";
//       default:
//         return "簽核中";
//     }
//   };

//   // 安全的日期時間格式化函數
//   const formatDateTime = (dateString, timeString = null) => {
//     if (!dateString) return '未指定';
//     try {
//       let dateTimeStr = dateString;
//       if (timeString) {
//         dateTimeStr = `${dateString} ${timeString}`;
//       }
//       return new Date(dateTimeStr).toLocaleString('zh-TW', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false
//       });
//     } catch (error) {
//       return '未指定';
//     }
//   };

//   // 處理標籤點擊
//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };

//   // 處理新增加班申請按鈕
//   const handleNewOvertimeRequest = () => {
//     window.location.href = "/workovertimeapplypmx";
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
//     alert(`已撤銷申請 ${selectedRequest.id}`);
//     setShowModal(false);
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

//   // 過濾申請單
//   const filteredRequests = Array.isArray(overtimeRequests) ? overtimeRequests.filter(request => {
//     if (!request) return false;
//     if (activeTab === "總覽") return true;
//     return request.status === activeTab;
//   }) : [];

//   return (
//     <div className="work-overtime-container">
//       <div className="work-overtime-app-wrapper">
//         {/* 頁面標題與時間 */}
//         <header className="work-overtime-header">
//           <div className="work-overtime-home-icon" onClick={handleGoHome}>
//             <img src={homeIcon} alt="Home" width="20" height="20" />
//           </div>
//           <div className="work-overtime-page-title">加班</div>
//         </header>
        
//         <div className="work-overtime-content-container">
//           <div className="work-overtime-tab-container">
//             <div 
//               className={`work-overtime-tab ${activeTab === "總覽" ? "work-overtime-tab-active" : ""}`}
//               onClick={() => handleTabClick("總覽")}
//             >
//               總覽
//             </div>
//             <div 
//               className={`work-overtime-tab ${activeTab === "簽核中" ? "work-overtime-tab-active" : ""}`}
//               onClick={() => handleTabClick("簽核中")}
//             >
//               簽核中
//             </div>
//             <div 
//               className={`work-overtime-tab ${activeTab === "已通過" ? "work-overtime-tab-active" : ""}`}
//               onClick={() => handleTabClick("已通過")}
//             >
//               已通過
//             </div>
//             <div 
//               className={`work-overtime-tab ${activeTab === "未通過" ? "work-overtime-tab-active" : ""}`}
//               onClick={() => handleTabClick("未通過")}
//             >
//               未通過
//             </div>
//           </div>
          
//           <div className="work-overtime-content-frame">
//             {loading ? (
//               <div className="work-overtime-loading-container">
//                 <div className="work-overtime-loading-spinner"></div>
//                 <div className="work-overtime-loading-text">正在獲取加班申請數據</div>
//               </div>
//             ) : error ? (
//               <div className="work-overtime-error-container">
//                 <div className="work-overtime-error-title">發生錯誤</div>
//                 <div className="work-overtime-error-message">{error}</div>
//                 <button 
//                   className="work-overtime-retry-button"
//                   onClick={() => {
//                     setError(null);
//                     setLoading(true);
//                     // 重新觸發 useEffect
//                     window.location.reload();
//                   }}
//                 >
//                   重試
//                 </button>
//               </div>
//             ) : filteredRequests.length === 0 ? (
//               <div className="work-overtime-empty-message">
//                 {activeTab === "總覽" ? "目前無申請單" : `目前無${activeTab}的申請單`}
//               </div>
//             ) : (
//               <div className="work-overtime-requests-container">
//                 {filteredRequests.map((request, index) => (
//                   <div 
//                     key={request?.id || index} 
//                     className="work-overtime-request-card"
//                     onClick={() => handleRequestClick(request)}
//                   >
//                     <div className="work-overtime-request-id">{request?.id || '未指定'}</div>
//                     <div className="work-overtime-submit-time">送出時間：{request?.submitTime || '未指定'}</div>
//                     <div className="work-overtime-request-line"></div>
                    
//                     <div className={`work-overtime-status-badge ${
//                       request?.status === "已通過" ? "work-overtime-status-approved" : 
//                       request?.status === "未通過" ? "work-overtime-status-rejected" : ""
//                     }`}>
//                       <span className="work-overtime-status-text">{request?.status || '未知'}</span>
//                     </div>
                  
//                     <div className="work-overtime-time-container">
//                       <div className="work-overtime-time-row">
//                         <span className="work-overtime-time-label">加班時間起迄：</span>
//                         <span className="work-overtime-time-value">{request?.startTime || '未指定'}</span>
//                       </div>
//                       <div className="work-overtime-time-row">
//                         <span className="work-overtime-time-label" style={{ visibility: 'hidden' }}>加班時間起迄：</span>
//                         <span className="work-overtime-time-value">{request?.endTime || '未指定'}</span>
//                       </div>
//                       <div className="work-overtime-hours">加班總時數：{request?.totalHours || '0'}小時0分鐘</div>
//                     </div>

//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* 新增加班申請按鈕 */}
//         <button 
//           className="work-overtime-new-request-button"
//           onClick={handleNewOvertimeRequest}
//         >
//           新增加班申請
//         </button>
//       </div>
      
//       {/* 彈出視窗 */}
//       {showModal && selectedRequest && (
//         <div className="work-overtime-modal-overlay" onClick={handleCloseModal}>
//           <div className="work-overtime-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="work-overtime-modal-header-new">
//               <button className="work-overtime-close-button-new" onClick={handleCloseModal}>×</button>
//               <div className="work-overtime-modal-title-new">加班申請單</div>
//             </div>
            
//             <div className="work-overtime-modal-body">
//               <div className="work-overtime-modal-info-section">
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">送出時間：</span>
//                   <span className="work-overtime-modal-value">{selectedRequest?.submitTime || '未指定'}</span>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">單號：</span>
//                   <span className="work-overtime-modal-value work-overtime-modal-id">{selectedRequest?.id || '未指定'}</span>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">員工：</span>
//                   <span className="work-overtime-modal-value">{selectedRequest?.employeeName || '未指定'}</span>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">狀態：</span>
//                   <div className={`work-overtime-modal-status-badge ${
//                     selectedRequest?.status === "已通過" ? "work-overtime-modal-status-approved" : 
//                     selectedRequest?.status === "未通過" ? "work-overtime-modal-status-rejected" : 
//                     "work-overtime-modal-status-pending"
//                   }`}>
//                     {selectedRequest?.status || '未知'}
//                   </div>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">加班類型：</span>
//                   <span className="work-overtime-modal-value">{selectedRequest?.overtimeType || '未指定'}</span>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">補償：</span>
//                   <span className="work-overtime-modal-value">{selectedRequest?.compensationType || '未指定'}</span>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">加班時間起迄：</span>
//                   <div className="work-overtime-modal-time-range-horizontal">
//                     <span className="work-overtime-modal-value">{selectedRequest?.startTime || '未指定'}</span>
//                     <span className="work-overtime-modal-value">{selectedRequest?.endTime || '未指定'}</span>
//                   </div>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">總時數：</span>
//                   <span className="work-overtime-modal-value">{selectedRequest?.totalHours || '0'}小時0分鐘</span>
//                 </div>
                
//                 <div className="work-overtime-modal-row-horizontal">
//                   <span className="work-overtime-modal-label">申請說明：</span>
//                   <span className="work-overtime-modal-value">{selectedRequest?.reason || '無'}</span>
//                 </div>
                
//                 {selectedRequest?.reviewer && selectedRequest.reviewer !== "未指定" && (
//                   <div className="work-overtime-modal-row-horizontal">
//                     <span className="work-overtime-modal-label">核准人：</span>
//                     <span className="work-overtime-modal-value">{selectedRequest.reviewer}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="work-overtime-modal-footer">
//               {(selectedRequest?.status === "簽核中" || selectedRequest?.status === "待HR審核") && (
//                 <button className="work-overtime-cancel-button" onClick={handleCancelRequest}>
//                   撤銷
//                 </button>
//               )}
//               <button 
//                 className={`work-overtime-close-modal-button ${
//                   selectedRequest?.status !== "簽核中" && selectedRequest?.status !== "待HR審核" ? "work-overtime-full-width" : ""
//                 }`}
//                 onClick={handleCloseModal}
//               >
//                 關閉
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default WorkOvertime;
import React, { useState, useEffect } from "react";
import './PMX_CSS/WorkOvertimePMX.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import { 
  validateUserFromCookies, 
  formatFormNumber, 
  fetchAndProcessFormData,
  getFilteredRequests 
} from './function/function';
import { API_BASE_URL } from '../config';

function WorkOvertime() {
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [activeTab, setActiveTab] = useState("總覽");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [overtimeRequests, setOvertimeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState('');
  
  // 處理員工ID，去除前導零
  const normalizeEmployeeId = (id) => {
    if (!id) return id;
    return id.toString().replace(/^0+/, '') || '0';
  };
  
  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);
  
  // 使用 API 獲取加班申請數據
  useEffect(() => {
    if (!companyId || !employeeId || !authToken) {
      return;
    }

    const fetchOvertimeRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 正規化員工ID，去除前導零
        const normalizedEmployeeId = normalizeEmployeeId(employeeId);
        console.log('原始員工ID:', employeeId);
        console.log('正規化後員工ID:', normalizedEmployeeId);
        
        // 使用完整的 API URL，參考補卡頁面的實作
        const apiUrl = `${API_BASE_URL}/api/forms/advanced-search`;
        
        const requestBody = {
          company_id: companyId,
          employee_id: normalizedEmployeeId, // 使用正規化後的員工ID
          category: "work_overtime"
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
            // 過濾並處理資料
            const validData = result.Data.filter(item => 
              item && 
              item.form_number && 
              normalizeEmployeeId(item.employee_id) === normalizedEmployeeId && 
              item.company_id == companyId
            );
            
            const processedRequests = processOvertimeData(validData);
            console.log("處理後的加班申請資料:", processedRequests);
            setOvertimeRequests(processedRequests);
          } else {
            console.warn("Data 不是陣列:", result.Data);
            setOvertimeRequests([]);
          }
        } else {
          console.warn("API 狀態非 Ok:", result);
          setError(`API 回傳錯誤: ${result.Msg || result.Message || '未知錯誤'}`);
          setOvertimeRequests([]);
        }
        
      } catch (err) {
        console.error("獲取加班申請失敗:", err);
        
        // 更詳細的錯誤處理
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          setError('網路連線錯誤，請檢查網路連線');
        } else if (err.message.includes('CORS')) {
          setError('跨域請求錯誤，請聯繫系統管理員');
        } else if (err.message.includes('404')) {
          setError('API 端點不存在，請聯繫系統管理員');
        } else {
          setError(`請求失敗: ${err.message}`);
        }
        
        setOvertimeRequests([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOvertimeRequests();
  }, [companyId, employeeId, authToken]);

  // 處理加班申請資料的函數
  const processOvertimeData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map(item => {
      if (!item || !item.form_number) return null;
      
      return {
        id: formatFormNumber(item.form_number, 'O'), // 使用 'O' 作為加班申請的前綴
        status: mapStatus(item.status),
        submitTime: formatDateTime(item.application_date),
        employeeName: item.employee_name || '未指定',
        startTime: formatDateTime(item.start_date, item.start_time),
        endTime: formatDateTime(item.end_date, item.end_time),
        totalHours: item.total_hours || '0',
        overtimeType: item.application_type || '未指定',
        compensationType: '加班費', // 預設值，可根據實際需求調整
        reason: item.description || '無',
        reviewer: item.reviewer || '未指定',
        department: item.department || '未指定',
        position: item.position || '未指定'
      };
    }).filter(item => item !== null);
  };

  // 狀態映射函數
  const mapStatus = (status) => {
    switch (status) {
      case "ok":
        return "已通過";
      case "no":
        return "未通過";
      case "pending":
        return "簽核中";
      default:
        return "簽核中";
    }
  };

  // 安全的日期時間格式化函數
  const formatDateTime = (dateString, timeString = null) => {
    if (!dateString) return '未指定';
    try {
      let dateTimeStr = dateString;
      if (timeString) {
        dateTimeStr = `${dateString} ${timeString}`;
      }
      return new Date(dateTimeStr).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return '未指定';
    }
  };

  // 處理標籤點擊
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 處理新增加班申請按鈕
  const handleNewOvertimeRequest = () => {
    window.location.href = "/workovertimeapplypmx";
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
    alert(`已撤銷申請 ${selectedRequest.id}`);
    setShowModal(false);
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

  // 過濾申請單
  const filteredRequests = Array.isArray(overtimeRequests) ? overtimeRequests.filter(request => {
    if (!request) return false;
    if (activeTab === "總覽") return true;
    return request.status === activeTab;
  }) : [];

  return (
    <div className="work-overtime-container">
      <div className="work-overtime-app-wrapper">
        {/* 頁面標題與時間 */}
        <header className="work-overtime-header">
          <div className="work-overtime-home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt="Home" width="20" height="20" />
          </div>
          <div className="work-overtime-page-title">加班</div>
        </header>
        
        <div className="work-overtime-content-container">
          <div className="work-overtime-tab-container">
            <div 
              className={`work-overtime-tab ${activeTab === "總覽" ? "work-overtime-tab-active" : ""}`}
              onClick={() => handleTabClick("總覽")}
            >
              總覽
            </div>
            <div 
              className={`work-overtime-tab ${activeTab === "簽核中" ? "work-overtime-tab-active" : ""}`}
              onClick={() => handleTabClick("簽核中")}
            >
              簽核中
            </div>
            <div 
              className={`work-overtime-tab ${activeTab === "已通過" ? "work-overtime-tab-active" : ""}`}
              onClick={() => handleTabClick("已通過")}
            >
              已通過
            </div>
            <div 
              className={`work-overtime-tab ${activeTab === "未通過" ? "work-overtime-tab-active" : ""}`}
              onClick={() => handleTabClick("未通過")}
            >
              未通過
            </div>
          </div>
          
          <div className="work-overtime-content-frame">
            {loading ? (
              <div className="work-overtime-loading-container">
                <div className="work-overtime-loading-spinner"></div>
                <div className="work-overtime-loading-text">正在獲取加班申請數據</div>
              </div>
            ) : error ? (
              <div className="work-overtime-error-container">
                <div className="work-overtime-error-title">發生錯誤</div>
                <div className="work-overtime-error-message">{error}</div>
                <button 
                  className="work-overtime-retry-button"
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    // 重新觸發 useEffect
                    window.location.reload();
                  }}
                >
                  重試
                </button>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="work-overtime-empty-message">
                {activeTab === "總覽" ? "目前無申請單" : `目前無${activeTab}的申請單`}
              </div>
            ) : (
              <div className="work-overtime-requests-container">
                {filteredRequests.map((request, index) => (
                  <div 
                    key={request?.id || index} 
                    className="work-overtime-request-card"
                    onClick={() => handleRequestClick(request)}
                  >
                    <div className="work-overtime-request-id">{request?.id || '未指定'}</div>
                    <div className="work-overtime-submit-time">送出時間：{request?.submitTime || '未指定'}</div>
                    <div className="work-overtime-request-line"></div>
                    
                    <div className={`work-overtime-status-badge ${
                      request?.status === "已通過" ? "work-overtime-status-approved" : 
                      request?.status === "未通過" ? "work-overtime-status-rejected" : ""
                    }`}>
                      <span className="work-overtime-status-text">{request?.status || '未知'}</span>
                    </div>
                  
                    <div className="work-overtime-time-container">
                      <div className="work-overtime-time-row">
                        <span className="work-overtime-time-label">加班時間起迄：</span>
                        <span className="work-overtime-time-value">{request?.startTime || '未指定'}</span>
                      </div>
                      <div className="work-overtime-time-row">
                        <span className="work-overtime-time-label" style={{ visibility: 'hidden' }}>加班時間起迄：</span>
                        <span className="work-overtime-time-value">{request?.endTime || '未指定'}</span>
                      </div>
                      <div className="work-overtime-hours">加班總時數：{request?.totalHours || '0'}小時0分鐘</div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 新增加班申請按鈕 */}
        <button 
          className="work-overtime-new-request-button"
          onClick={handleNewOvertimeRequest}
        >
          新增加班申請
        </button>
      </div>
      
      {/* 彈出視窗 */}
      {showModal && selectedRequest && (
        <div className="work-overtime-modal-overlay" onClick={handleCloseModal}>
          <div className="work-overtime-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="work-overtime-modal-header-new">
              <button className="work-overtime-close-button-new" onClick={handleCloseModal}>×</button>
              <div className="work-overtime-modal-title-new">加班申請單</div>
            </div>
            
            <div className="work-overtime-modal-body">
              <div className="work-overtime-modal-info-section">
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">送出時間：</span>
                  <span className="work-overtime-modal-value">{selectedRequest?.submitTime || '未指定'}</span>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">單號：</span>
                  <span className="work-overtime-modal-value work-overtime-modal-id">{selectedRequest?.id || '未指定'}</span>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">員工：</span>
                  <span className="work-overtime-modal-value">{selectedRequest?.employeeName || '未指定'}</span>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">狀態：</span>
                  <div className={`work-overtime-modal-status-badge ${
                    selectedRequest?.status === "已通過" ? "work-overtime-modal-status-approved" : 
                    selectedRequest?.status === "未通過" ? "work-overtime-modal-status-rejected" : 
                    "work-overtime-modal-status-pending"
                  }`}>
                    {selectedRequest?.status || '未知'}
                  </div>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">加班類型：</span>
                  <span className="work-overtime-modal-value">{selectedRequest?.overtimeType || '未指定'}</span>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">補償：</span>
                  <span className="work-overtime-modal-value">{selectedRequest?.compensationType || '未指定'}</span>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">加班時間起迄：</span>
                  <div className="work-overtime-modal-time-range-horizontal">
                    <span className="work-overtime-modal-value">{selectedRequest?.startTime || '未指定'}</span>
                    <span className="work-overtime-modal-value">{selectedRequest?.endTime || '未指定'}</span>
                  </div>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">總時數：</span>
                  <span className="work-overtime-modal-value">{selectedRequest?.totalHours || '0'}小時0分鐘</span>
                </div>
                
                <div className="work-overtime-modal-row-horizontal">
                  <span className="work-overtime-modal-label">申請說明：</span>
                  <span className="work-overtime-modal-value">{selectedRequest?.reason || '無'}</span>
                </div>
                
                {selectedRequest?.reviewer && selectedRequest.reviewer !== "未指定" && (
                  <div className="work-overtime-modal-row-horizontal">
                    <span className="work-overtime-modal-label">核准人：</span>
                    <span className="work-overtime-modal-value">{selectedRequest.reviewer}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="work-overtime-modal-footer">
              {(selectedRequest?.status === "簽核中" || selectedRequest?.status === "待HR審核") && (
                <button className="work-overtime-cancel-button" onClick={handleCancelRequest}>
                  撤銷
                </button>
              )}
              <button 
                className={`work-overtime-close-modal-button ${
                  selectedRequest?.status !== "簽核中" && selectedRequest?.status !== "待HR審核" ? "work-overtime-full-width" : ""
                }`}
                onClick={handleCloseModal}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default WorkOvertime;
