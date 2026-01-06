// // import React, { useState, useEffect } from 'react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
// // import { useNavigate } from 'react-router-dom';
// // import { API_BASE_URL } from '../config';
// // import './css/Announcement.css';
// // import homeIcon from './HomePageImage/homepage.png';
// // import returnIcon from './ICON/return.png';
// // import calendarIcon from './ICON/Calendar.png';

// // function Announcement() {
// //   // ✅ 狀態管理
// //   const [selectedTab, setSelectedTab] = useState('總覽');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [isApp, setIsApp] = useState(false);
// //   const [announcements, setAnnouncements] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [companyId, setCompanyId] = useState('');
// //   const [employeeId, setEmployeeId] = useState('');
// //   const [readStatusData, setReadStatusData] = useState([]); // 新增：存儲已讀狀態數據

// //   // ✅ 全螢幕詳情頁面狀態
// //   const [showDetailView, setShowDetailView] = useState(false);
// //   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
// //   const [hasRead, setHasRead] = useState(false);
// //   const [readList, setReadList] = useState([]);
  
// //   const announcementsPerPage = 5;
// //   const navigate = useNavigate();

// //   // ✅ 從 cookies 中獲取 company_id
// //   const getCompanyIdFromCookies = () => {
// //     const cookies = document.cookie.split(';');
// //     for (let cookie of cookies) {
// //       const [name, value] = cookie.trim().split('=');
// //       if (name === 'company_id') {
// //         return decodeURIComponent(value);
// //       }
// //     }
// //     return null;
// //   };

// //   // ✅ 從 cookies 中獲取 employee_id
// //   const getEmployeeIdFromCookies = () => {
// //     const cookies = document.cookie.split(';');
// //     for (let cookie of cookies) {
// //       const [name, value] = cookie.trim().split('=');
// //       if (name === 'employee_id') {
// //         return decodeURIComponent(value);
// //       }
// //     }
// //     return null;
// //   };

// //   // ✅ 檢查公告是否已經可以發布（發布時間是否已過）
// //   const isAnnouncementPublished = (announcement) => {
// //     const now = new Date();
    
// //     try {
// //       // 處理 publish_date 和 publish_time
// //       let publishDateTime = null;
      
// //       if (announcement.publish_date && announcement.publish_time) {
// //         // 如果有分別的日期和時間欄位
// //         const dateStr = announcement.publish_date;
// //         const timeStr = announcement.publish_time;
        
// //         // 組合日期和時間
// //         publishDateTime = new Date(`${dateStr} ${timeStr}`);
        
// //       } else if (announcement.publish_date) {
// //         // 如果只有日期欄位，檢查是否包含時間資訊
// //         publishDateTime = new Date(announcement.publish_date);
        
// //       } else if (announcement.date) {
// //         // 備用日期欄位
// //         publishDateTime = new Date(announcement.date);
        
// //       } else if (announcement.created_at) {
// //         // 建立時間作為備用
// //         publishDateTime = new Date(announcement.created_at);
// //       }
      
// //       // 如果無法解析發布時間，預設為可以發布
// //       if (!publishDateTime || isNaN(publishDateTime.getTime())) {
// //         console.warn('無法解析公告發布時間，預設為可發布:', announcement);
// //         return true;
// //       }
      
// //       const isPublished = publishDateTime <= now;
      
// //       console.log(`公告 "${announcement.title || announcement.name}" 發布時間檢查:`, {
// //         publishDateTime: publishDateTime.toISOString(),
// //         currentTime: now.toISOString(),
// //         isPublished: isPublished
// //       });
      
// //       return isPublished;
      
// //     } catch (error) {
// //       console.warn('檢查公告發布時間時出錯:', error, announcement);
// //       return true; // 發生錯誤時預設為可發布
// //     }
// //   };

// //   // 檢測是否為 App 發出的請求
// //   useEffect(() => {
// //     const userAgent = window.navigator.userAgent;
// //     const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
// //     setIsApp(isFlutterApp);
// //   }, []);

// //   // ✅ 初始化時從 cookies 獲取公司 ID 和員工 ID
// //   useEffect(() => {
// //     const cookieCompanyId = getCompanyIdFromCookies();
// //     const cookieEmployeeId = getEmployeeIdFromCookies();
    
// //     if (cookieCompanyId) {
// //       setCompanyId(cookieCompanyId);
// //       console.log(`從 cookies 獲取到公司 ID: ${cookieCompanyId}`);
// //     } else {
// //       setError('找不到公司資料，請重新登入');
// //       setIsLoading(false);
// //     }

// //     if (cookieEmployeeId) {
// //       setEmployeeId(cookieEmployeeId);
// //       console.log(`從 cookies 獲取到員工 ID: ${cookieEmployeeId}`);
// //     } else {
// //       setError('找不到員工資料，請重新登入');
// //       setIsLoading(false);
// //     }
// //   }, []);

// //   // ✅ 當公司 ID 和員工 ID 都存在時，獲取數據
// //   useEffect(() => {
// //     if (companyId && employeeId) {
// //       fetchAnnouncementsAndReadStatus();
// //     }
// //   }, [companyId, employeeId]);

// //   // ✅ 獲取員工的已讀狀態
// //   const fetchReadStatus = async () => {
// //     if (!companyId || !employeeId) {
// //       return [];
// //     }

// //     try {
// //       console.log(`正在獲取員工 ${employeeId} 的已讀狀態...`);
      
// //       const apiUrl = `${API_BASE_URL}/api/announcement-read-status/employee/${encodeURIComponent(companyId)}/${encodeURIComponent(employeeId)}`;
// //       console.log(`已讀狀態 API URL: ${apiUrl}`);
      
// //       const response = await fetch(apiUrl, {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //       });
      
// //       if (!response.ok) {
// //         throw new Error(`獲取已讀狀態失敗 (${response.status})`);
// //       }
      
// //       const data = await response.json();
// //       console.log('已讀狀態 API 返回的數據:', data);
      
// //       if (data.Status === "Ok" && data.Data) {
// //         const readStatusArray = Array.isArray(data.Data) ? data.Data : [];
// //         setReadStatusData(readStatusArray);
// //         return readStatusArray;
// //       } else {
// //         console.warn('已讀狀態數據格式異常:', data);
// //         return [];
// //       }
      
// //     } catch (error) {
// //       console.error('獲取已讀狀態時出錯:', error);
// //       return [];
// //     }
// //   };

// //   // ✅ 獲取公告列表和已讀狀態
// //   const fetchAnnouncementsAndReadStatus = async () => {
// //     if (!companyId || !employeeId) {
// //       setError('找不到公司或員工資料，請重新登入');
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       setIsLoading(true);
// //       setError(null);
      
// //       console.log(`正在獲取公司 ${companyId} 的公告數據...`);
      
// //       // 同時獲取公告列表和已讀狀態
// //       const [announcementsResponse, readStatusArray] = await Promise.all([
// //         fetch(`${API_BASE_URL}/api/company/${encodeURIComponent(companyId)}/announcements`, {
// //           method: 'GET',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //         }),
// //         fetchReadStatus()
// //       ]);
      
// //       if (!announcementsResponse.ok) {
// //         throw new Error(`API 請求失敗 (${announcementsResponse.status})`);
// //       }
      
// //       const announcementsData = await announcementsResponse.json();
// //       console.log('公告 API 返回的原始數據:', announcementsData);
      
// //       if (announcementsData.Status !== "Ok") {
// //         throw new Error(announcementsData.Msg || '獲取公告數據失敗');
// //       }
      
// //       // ✅ 驗證數據結構並處理不同的數據格式
// //       let announcementData = [];
      
// //       if (announcementsData.Data) {
// //         if (Array.isArray(announcementsData.Data)) {
// //           announcementData = announcementsData.Data;
// //         } else if (typeof announcementsData.Data === 'object' && announcementsData.Data !== null) {
// //           if (Array.isArray(announcementsData.Data.announcements)) {
// //             announcementData = announcementsData.Data.announcements;
// //           } else if (Array.isArray(announcementsData.Data.list)) {
// //             announcementData = announcementsData.Data.list;
// //           } else if (Array.isArray(announcementsData.Data.items)) {
// //             announcementData = announcementsData.Data.items;
// //           } else {
// //             announcementData = [announcementsData.Data];
// //           }
// //         }
// //       } else if (Array.isArray(announcementsData)) {
// //         announcementData = announcementsData;
// //       }
      
// //       console.log('處理後的公告數據:', announcementData);
// //       console.log('已讀狀態數據:', readStatusArray);
      
// //       if (!Array.isArray(announcementData)) {
// //         console.warn('公告數據不是陣列格式，使用空陣列');
// //         announcementData = [];
// //       }
      
// //       // ✅ 過濾掉尚未到發布時間的公告
// //       const publishedAnnouncements = announcementData.filter(announcement => {
// //         const isPublished = isAnnouncementPublished(announcement);
// //         if (!isPublished) {
// //           console.log(`過濾掉尚未發布的公告: ${announcement.title || announcement.name}`);
// //         }
// //         return isPublished;
// //       });
      
// //       console.log(`原始公告數量: ${announcementData.length}, 已發布公告數量: ${publishedAnnouncements.length}`);
      
// //       // ✅ 建立已讀狀態映射表
// //       const readStatusMap = new Map();
// //       readStatusArray.forEach(status => {
// //         if (status.document_number) {
// //           readStatusMap.set(status.document_number, true);
// //         }
// //       });
      
// //       // ✅ 處理 API 返回的公告數據並合併已讀狀態
// //       const processedAnnouncements = publishedAnnouncements.map((announcement, index) => {
// //         const announcementObj = announcement || {};
        
// //         // 格式化日期
// //         let formattedDate = '';
// //         const publishDate = announcementObj.publish_date || announcementObj.date || announcementObj.created_at;
// //         if (publishDate) {
// //           try {
// //             const date = new Date(publishDate);
// //             if (!isNaN(date.getTime())) {
// //               formattedDate = date.toISOString().split('T')[0];
// //             }
// //           } catch (e) {
// //             console.warn('日期格式化失敗:', publishDate);
// //           }
// //         }
        
// //         // 格式化時間
// //         let displayTime = '';
// //         const publishTime = announcementObj.publish_time || announcementObj.time;
// //         if (publishTime) {
// //           displayTime = publishTime;
// //         } else if (publishDate) {
// //           try {
// //             const date = new Date(publishDate);
// //             if (!isNaN(date.getTime())) {
// //               displayTime = date.toTimeString().split(' ')[0].substring(0, 5);
// //             }
// //           } catch (e) {
// //             console.warn('時間格式化失敗:', publishDate);
// //           }
// //         }
        
// //         const title = announcementObj.title || announcementObj.name || announcementObj.subject || `公告 ${index + 1}`;
// //         const content = announcementObj.content || announcementObj.message || announcementObj.description || '';
// //         const announcementId = announcementObj.id || announcementObj._id || `announcement-${index}-${Date.now()}`;
// //         const documentNumber = announcementObj.document_number || announcementId;
        
// //         // ✅ 根據 API 查詢結果判斷是否已讀
// //         const isRead = readStatusMap.has(documentNumber);
        
// //         return {
// //           id: announcementId,
// //           document_number: documentNumber,
// //           announcement_name: title,
// //           announcement_content: content,
// //           formatted_date: formattedDate,
// //           display_time: displayTime,
// //           status: announcementObj.status || 'active',
// //           publish_date: publishDate,
// //           publish_time: announcementObj.publish_time, // 保留原始發布時間
// //           attachments: announcementObj.attachments || [],
// //           read_by: announcementObj.read_by || [],
// //           unread: !isRead // 根據 API 結果設置未讀狀態
// //         };
// //       });
      
// //       // 按發布日期排序，最新的在前面
// //       const sortedAnnouncements = processedAnnouncements.sort((a, b) => {
// //         const dateA = new Date(a.publish_date || '2000-01-01');
// //         const dateB = new Date(b.publish_date || '2000-01-01');
// //         return dateB - dateA;
// //       });
      
// //       setAnnouncements(sortedAnnouncements);
// //       setIsLoading(false);
      
// //       console.log(`成功獲取 ${sortedAnnouncements.length} 條已發布公告`);
// //       console.log(`其中已讀 ${sortedAnnouncements.filter(a => !a.unread).length} 條，未讀 ${sortedAnnouncements.filter(a => a.unread).length} 條`);
      
// //     } catch (error) {
// //       console.error('獲取數據時出錯:', error);
// //       setError(`獲取數據時出錯: ${error.message}`);
// //       setIsLoading(false);
// //     }
// //   };

// //   const getCurrentUser = () => {
// //     // 這裡需要實現獲取當前用戶的邏輯
// //     return '當前用戶';
// //   };

// //   // ✅ 處理回到首頁的邏輯
// //   const handleHomeClick = () => {
// //     if (isApp) {
// //       if (window.flutter) {
// //         window.flutter.postMessage('navigateToHome');
// //       }
// //     } else {
// //       navigate('/frontpage01');
// //     }
// //   };

// //   // ✅ 重試功能
// //   const handleRetry = () => {
// //     setError(null);
// //     const cookieCompanyId = getCompanyIdFromCookies();
// //     const cookieEmployeeId = getEmployeeIdFromCookies();
    
// //     if (cookieCompanyId) {
// //       setCompanyId(cookieCompanyId);
// //     } else {
// //       setError('找不到公司資料，請重新登入');
// //     }

// //     if (cookieEmployeeId) {
// //       setEmployeeId(cookieEmployeeId);
// //     } else {
// //       setError('找不到員工資料，請重新登入');
// //     }
// //   };

// //   // ✅ 處理公告點擊，顯示全螢幕詳情
// //   const handleAnnouncementClick = (announcement) => {
// //     // ✅ 設置選中的公告並顯示全螢幕詳情
// //     setSelectedAnnouncement(announcement);
// //     setReadList(announcement.read_by || []);
    
// //     // ✅ 根據當前公告的已讀狀態設置 hasRead
// //     setHasRead(!announcement.unread);
    
// //     setShowDetailView(true);
// //     // 防止背景滾動
// //     document.body.classList.add('fullscreen-open');
// //   };

// //   // ✅ 返回公告列表
// //   const handleBackToList = () => {
// //     setShowDetailView(false);
// //     setSelectedAnnouncement(null);
// //     setHasRead(false);
// //     setReadList([]);
// //     // 恢復背景滾動
// //     document.body.classList.remove('fullscreen-open');
// //   };

// //   // ✅ 標記為已讀 - 使用新的 API
// //   const handleMarkAsRead = async () => {
// //     if (!selectedAnnouncement) return;

// //     try {
// //       // 獲取必要的參數
// //       const documentNumber = selectedAnnouncement.document_number || selectedAnnouncement.id;
      
// //       if (!employeeId) {
// //         console.error('找不到員工 ID');
// //         alert('找不到員工資料，請重新登入');
// //         return;
// //       }

// //       if (!companyId) {
// //         console.error('找不到公司 ID');
// //         alert('找不到公司資料，請重新登入');
// //         return;
// //       }

// //       console.log('準備標記公告為已讀:', {
// //         document_number: documentNumber,
// //         company_id: companyId,
// //         employee_id: employeeId
// //       });

// //       // 呼叫標記已讀 API
// //       const apiUrl = `${API_BASE_URL}/api/announcement-read-status/mark-read`;
      
// //       const response = await fetch(apiUrl, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           document_number: documentNumber,
// //           company_id: companyId,
// //           employee_id: employeeId
// //         })
// //       });

// //       const result = await response.json();
// //       console.log('API 回應:', result);

// //       if (response.ok && result.Status === "Ok") {
// //         // 成功標記為已讀
// //         setHasRead(true);
        
// //         // 更新公告列表中的已讀狀態
// //         setAnnouncements(prev => 
// //           prev.map(item => 
// //             item.id === selectedAnnouncement.id ? { ...item, unread: false } : item
// //           )
// //         );

// //         // 更新已讀狀態數據
// //         const newReadStatus = {
// //           document_number: documentNumber,
// //           company_id: companyId,
// //           employee_id: employeeId,
// //           read_at: new Date().toISOString()
// //         };
// //         setReadStatusData(prev => [...prev, newReadStatus]);

// //         // 顯示成功訊息
// //         alert('已成功標記為已讀');
        
// //       } else {
// //         // API 返回錯誤
// //         console.error('標記已讀失敗:', result);
// //         alert(result.Msg || '標記已讀失敗，請稍後再試');
// //       }

// //     } catch (error) {
// //       console.error('標記已讀 API 呼叫失敗:', error);
// //       alert('網路錯誤，請檢查連線後再試');
// //     }
// //   };

// //   // ✅ 處理文件下載
// //   const handleDownload = (attachment) => {
// //     window.open(attachment.url, '_blank');
// //   };

// //   // ✅ 根據選項卡過濾公告
// //   const getFilteredAnnouncements = () => {
// //     switch (selectedTab) {
// //       case '未讀':
// //         return announcements.filter(a => a.unread);
// //       case '已讀':
// //         return announcements.filter(a => !a.unread);
// //       case '總覽':
// //       default:
// //         return announcements;
// //     }
// //   };

// //   const filteredAnnouncements = getFilteredAnnouncements();
// //   const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
// //   const currentAnnouncements = filteredAnnouncements.slice(
// //     (currentPage - 1) * announcementsPerPage,
// //     currentPage * announcementsPerPage
// //   );

// //   const handlePageChange = (page) => {
// //     setCurrentPage(page);
// //   };

// //   const handleTabChange = (tab) => {
// //     setSelectedTab(tab);
// //     setCurrentPage(1);
// //   };

// // // ✅ 全螢幕詳情頁面渲染
// // if (showDetailView && selectedAnnouncement) {
// //   return (
// //     <div className="fullScreenContainer">
// //       <div className="fullScreenWrapper">
// //         {/* Header - 與列表頁面完全相同的結構 */}
// //         <header className="fullScreenHeader">
// //           <div className="homeIcon" onClick={handleHomeClick}>
// //             <img src={homeIcon} alt="Home" width="20" height="20" />
// //           </div>
// //           <div className="pageTitle">公告</div>
// //           <div className="headerSpacer"></div>
// //         </header>

// //         {/* ✅ 修改：返回按鈕 - 使用圖標 + 文字 */}
// //         <div className="backLink" onClick={handleBackToList}>
// //           <img src={returnIcon} alt="Return" className="backIcon" />
// //           <span>返回公告</span>
// //         </div>

// //         {/* Content */}
// //         <div className="fullScreenContent">
// //           {/* 公告詳情卡片 */}
// //           <div className="announcementDetailCard">
// //             <div className="announcementDetailContent">
// //               {/* 公告標題和日期 */}
// //               <div className="announcementTitleSection">
// //                 <div className="announcementDetailHeader">
// //                   <h2 className="announcementDetailTitle">{selectedAnnouncement.announcement_name}</h2>
// //                   <div className="announcementDetailDate">
// //                     <img src={calendarIcon} alt="Calendar" className="calendarIcon" />
// //                     <span>{selectedAnnouncement.formatted_date}</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* 公告內容 */}
// //               <div className="announcementContent">
// //                 <pre>{selectedAnnouncement.announcement_content}</pre>
// //               </div>

// //               {/* 附件區域 */}
// //               {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
// //                 <div className="attachmentSection">
// //                   <div className="attachmentTitle">附件下載</div>
// //                   {selectedAnnouncement.attachments.map((attachment, index) => (
// //                     <div key={index} className="attachmentItem" onClick={() => handleDownload(attachment)}>
// //                       <div className="attachmentInfo">
// //                         <div className="attachmentIcon">
// //                           {attachment.type === 'pdf' ? '📄' : '📊'}
// //                         </div>
// //                         <span className="attachmentName">{attachment.name}</span>
// //                       </div>
// //                       <div className="downloadIcon">⬇</div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* 已讀名單 */}
// //             <div className="readSection">
// //               <span className="readLabel">已讀：{readList.join('、')}</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* 底部按鈕 */}
// //         <div className="fullScreenFooter">
// //           {hasRead ? (
// //             <div className="readButton disabled">
// //               <span>您已閱讀並簽署此公告</span>
// //             </div>
// //           ) : (
// //             <div className="submitButton" onClick={handleMarkAsRead}>
// //               <span>已讀簽署</span>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// //   // ✅ 載入狀態
// //   if (isLoading) {
// //     return (
// //       <div className="container">
// //         <div className="appWrapper">
// //           <header className="header">
// //             <div className="homeIcon" onClick={handleHomeClick}>
// //               <img src={homeIcon} alt="Home" width="20" height="20" />
// //             </div>
// //             <div className="pageTitle">公告</div>
// //           </header>
// //           <div className="loadingContainer">
// //             <p>載入中...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ✅ 錯誤狀態
// //   if (error) {
// //     return (
// //       <div className="container">
// //         <div className="appWrapper">
// //           <header className="header">
// //             <div className="homeIcon" onClick={handleHomeClick}>
// //               <img src={homeIcon} alt="Home" width="20" height="20" />
// //             </div>
// //             <div className="pageTitle">公告</div>
// //           </header>
// //           <div className="errorContainer">
// //             <p>{error}</p>
// //             <button onClick={handleRetry}>重新嘗試</button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ✅ 主頁面渲染（公告列表）
// //   return (
// //     <div className="container">
// //       <div className="appWrapper">
// //         <header className="header">
// //           <div className="homeIcon" onClick={handleHomeClick}>
// //             <img src={homeIcon} alt="Home" width="20" height="20" />
// //           </div>
// //           <div className="pageTitle">公告</div>
// //         </header>

// //         <div className="contentContainer">
// //           <div className="tabContainer">
// //             {['總覽', '未讀', '已讀'].map((tab) => (
// //               <div
// //                 key={tab}
// //                 className={`tab ${selectedTab === tab ? 'tabActive' : ''}`}
// //                 onClick={() => handleTabChange(tab)}
// //               >
// //                 {tab}
// //               </div>
// //             ))}
// //           </div>

// //           <div className="announcementListContainer">
// //             <div className="announcementList">
// //               {currentAnnouncements.length === 0 ? (
// //                 <div className="noAnnouncements">
// //                   <p>沒有{selectedTab === '總覽' ? '' : selectedTab}公告</p>
// //                 </div>
// //               ) : (
// //                 currentAnnouncements.map((announcement, index) => (
// //                   <div 
// //                     key={announcement.id || index} 
// //                     className="announcementItem"
// //                     onClick={() => handleAnnouncementClick(announcement)}
// //                   >
// //                     <div className="announcementHeader">
// //                       <div className="announcementLeft">
// //                         {announcement.unread && <div className="redDot" />}
// //                         <div className={`announcementText ${!announcement.unread ? 'read' : ''}`}>
// //                           {announcement.announcement_name}
// //                         </div>
// //                       </div>
                      
// //                       <div className="announcementRight">
// //                         <img 
// //                           src={calendarIcon} 
// //                           alt="Calendar" 
// //                           className="calendarIcon"
// //                         />
// //                         <div className="announcementDate">
// //                           {announcement.formatted_date}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           </div>

// //           {filteredAnnouncements.length > 0 && totalPages > 1 && (
// //             <div className="pagination">
// //               <span
// //                 className={`arrowButton ${currentPage === 1 ? 'disabledArrowButton' : ''}`}
// //                 onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
// //               >
// //                 {'<<'}
// //               </span>
// //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //                 <span
// //                   key={page}
// //                   className={`pageButton ${currentPage === page ? 'activePageButton' : 'inactivePageButton'}`}
// //                   onClick={() => handlePageChange(page)}
// //                 >
// //                   {page}
// //                 </span>
// //               ))}
// //               <span
// //                 className={`arrowButton ${currentPage === totalPages ? 'disabledArrowButton' : ''}`}
// //                 onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
// //               >
// //                 {'>>'}
// //               </span>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Announcement;
// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from '../config';
// import './css/Announcement.css';
// import homeIcon from './HomePageImage/homepage.png';
// import returnIcon from './ICON/return.png';
// import calendarIcon from './ICON/Calendar.png';

// function Announcement() {
//   // ✅ 狀態管理
//   const [selectedTab, setSelectedTab] = useState('總覽');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isApp, setIsApp] = useState(false);
//   const [announcements, setAnnouncements] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [companyId, setCompanyId] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [readStatusData, setReadStatusData] = useState([]); // 新增：存儲已讀狀態數據

//   // ✅ 全螢幕詳情頁面狀態
//   const [showDetailView, setShowDetailView] = useState(false);
//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
//   const [hasRead, setHasRead] = useState(false);
//   const [readList, setReadList] = useState([]);
  
//   // 🔥 新增：已讀人員名單
//   const [readEmployeeNames, setReadEmployeeNames] = useState([]);
//   const [readStatusLoading, setReadStatusLoading] = useState(false);
  
//   const announcementsPerPage = 5;
//   const navigate = useNavigate();

//   // ✅ 從 cookies 中獲取 company_id
//   const getCompanyIdFromCookies = () => {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'company_id') {
//         return decodeURIComponent(value);
//       }
//     }
//     return null;
//   };

//   // ✅ 從 cookies 中獲取 employee_id
//   const getEmployeeIdFromCookies = () => {
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'employee_id') {
//         return decodeURIComponent(value);
//       }
//     }
//     return null;
//   };

//   // ✅ 檢查公告是否已經可以發布（發布時間是否已過）
//   const isAnnouncementPublished = (announcement) => {
//     const now = new Date();
    
//     try {
//       // 處理 publish_date 和 publish_time
//       let publishDateTime = null;
      
//       if (announcement.publish_date && announcement.publish_time) {
//         // 如果有分別的日期和時間欄位
//         const dateStr = announcement.publish_date;
//         const timeStr = announcement.publish_time;
        
//         // 組合日期和時間
//         publishDateTime = new Date(`${dateStr} ${timeStr}`);
        
//       } else if (announcement.publish_date) {
//         // 如果只有日期欄位，檢查是否包含時間資訊
//         publishDateTime = new Date(announcement.publish_date);
        
//       } else if (announcement.date) {
//         // 備用日期欄位
//         publishDateTime = new Date(announcement.date);
        
//       } else if (announcement.created_at) {
//         // 建立時間作為備用
//         publishDateTime = new Date(announcement.created_at);
//       }
      
//       // 如果無法解析發布時間，預設為可以發布
//       if (!publishDateTime || isNaN(publishDateTime.getTime())) {
//         console.warn('無法解析公告發布時間，預設為可發布:', announcement);
//         return true;
//       }
      
//       const isPublished = publishDateTime <= now;
      
//       console.log(`公告 "${announcement.title || announcement.name}" 發布時間檢查:`, {
//         publishDateTime: publishDateTime.toISOString(),
//         currentTime: now.toISOString(),
//         isPublished: isPublished
//       });
      
//       return isPublished;
      
//     } catch (error) {
//       console.warn('檢查公告發布時間時出錯:', error, announcement);
//       return true; // 發生錯誤時預設為可發布
//     }
//   };

//   // 檢測是否為 App 發出的請求
//   useEffect(() => {
//     const userAgent = window.navigator.userAgent;
//     const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
//     setIsApp(isFlutterApp);
//   }, []);

//   // ✅ 初始化時從 cookies 獲取公司 ID 和員工 ID
//   useEffect(() => {
//     const cookieCompanyId = getCompanyIdFromCookies();
//     const cookieEmployeeId = getEmployeeIdFromCookies();
    
//     if (cookieCompanyId) {
//       setCompanyId(cookieCompanyId);
//       console.log(`從 cookies 獲取到公司 ID: ${cookieCompanyId}`);
//     } else {
//       setError('找不到公司資料，請重新登入');
//       setIsLoading(false);
//     }

//     if (cookieEmployeeId) {
//       setEmployeeId(cookieEmployeeId);
//       console.log(`從 cookies 獲取到員工 ID: ${cookieEmployeeId}`);
//     } else {
//       setError('找不到員工資料，請重新登入');
//       setIsLoading(false);
//     }
//   }, []);

//   // ✅ 當公司 ID 和員工 ID 都存在時，獲取數據
//   useEffect(() => {
//     if (companyId && employeeId) {
//       fetchAnnouncementsAndReadStatus();
//     }
//   }, [companyId, employeeId]);

//   // ✅ 獲取員工的已讀狀態
//   const fetchReadStatus = async () => {
//     if (!companyId || !employeeId) {
//       return [];
//     }

//     try {
//       console.log(`正在獲取員工 ${employeeId} 的已讀狀態...`);
      
//       const apiUrl = `${API_BASE_URL}/api/announcement-read-status/employee/${encodeURIComponent(companyId)}/${encodeURIComponent(employeeId)}`;
//       console.log(`已讀狀態 API URL: ${apiUrl}`);
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`獲取已讀狀態失敗 (${response.status})`);
//       }
      
//       const data = await response.json();
//       console.log('已讀狀態 API 返回的數據:', data);
      
//       if (data.Status === "Ok" && data.Data) {
//         const readStatusArray = Array.isArray(data.Data) ? data.Data : [];
//         setReadStatusData(readStatusArray);
//         return readStatusArray;
//       } else {
//         console.warn('已讀狀態數據格式異常:', data);
//         return [];
//       }
      
//     } catch (error) {
//       console.error('獲取已讀狀態時出錯:', error);
//       return [];
//     }
//   };

//   // 🔥 新增：獲取公告的已讀人員姓名
//   const fetchReadEmployeeNames = async (documentNumber) => {
//     try {
//       if (!companyId || !documentNumber) {
//         console.warn('缺少必要參數:', { companyId, documentNumber });
//         return [];
//       }

//       setReadStatusLoading(true);
//       console.log('🔥 查詢公告已讀人員姓名，文件編號:', documentNumber);

//       // 🔥 同時查詢所有員工和閱讀狀態
//       const [allEmployeesResponse, readStatusResponse] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/employees`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           body: JSON.stringify({
//             company_id: companyId
//           })
//         }),
//         fetch(
//           `${API_BASE_URL}/api/announcement-read-status?company_id=${companyId}&document_number=${documentNumber}&_t=${Date.now()}`,
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           }
//         )
//       ]);

//       // 處理所有員工資料
//       let allEmployees = [];
//       if (allEmployeesResponse.ok) {
//         const allEmployeesResult = await allEmployeesResponse.json();
//         if (allEmployeesResult.Status === 'Ok') {
//           allEmployees = allEmployeesResult.Data || [];
//         }
//       }

//       // 處理閱讀狀態
//       const readEmployeeIds = new Set();
//       if (readStatusResponse.ok) {
//         const readStatusResult = await readStatusResponse.json();
//         if (readStatusResult.Status === 'Ok') {
//           const readRecords = readStatusResult.Data?.records || [];
//           readRecords.forEach(record => {
//             if (record.status === 'read') {
//               readEmployeeIds.add(record.employee_id);
//             }
//           });
//         }
//       }

//       // 🔥 提取已讀員工的姓名
//       const readNames = allEmployees
//         .filter(employee => readEmployeeIds.has(employee.employee_id))
//         .map(employee => employee.name || employee.employee_id || '未知用戶');

//       console.log('🔥 已讀員工姓名:', readNames);
//       return readNames;

//     } catch (error) {
//       console.error('查詢已讀員工姓名錯誤:', error);
//       return [];
//     } finally {
//       setReadStatusLoading(false);
//     }
//   };

//   // ✅ 獲取公告列表和已讀狀態
//   const fetchAnnouncementsAndReadStatus = async () => {
//     if (!companyId || !employeeId) {
//       setError('找不到公司或員工資料，請重新登入');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
      
//       console.log(`正在獲取公司 ${companyId} 的公告數據...`);
      
//       // 同時獲取公告列表和已讀狀態
//       const [announcementsResponse, readStatusArray] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/company/${encodeURIComponent(companyId)}/announcements`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }),
//         fetchReadStatus()
//       ]);
      
//       if (!announcementsResponse.ok) {
//         throw new Error(`API 請求失敗 (${announcementsResponse.status})`);
//       }
      
//       const announcementsData = await announcementsResponse.json();
//       console.log('公告 API 返回的原始數據:', announcementsData);
      
//       if (announcementsData.Status !== "Ok") {
//         throw new Error(announcementsData.Msg || '獲取公告數據失敗');
//       }
      
//       // ✅ 驗證數據結構並處理不同的數據格式
//       let announcementData = [];
      
//       if (announcementsData.Data) {
//         if (Array.isArray(announcementsData.Data)) {
//           announcementData = announcementsData.Data;
//         } else if (typeof announcementsData.Data === 'object' && announcementsData.Data !== null) {
//           if (Array.isArray(announcementsData.Data.announcements)) {
//             announcementData = announcementsData.Data.announcements;
//           } else if (Array.isArray(announcementsData.Data.list)) {
//             announcementData = announcementsData.Data.list;
//           } else if (Array.isArray(announcementsData.Data.items)) {
//             announcementData = announcementsData.Data.items;
//           } else {
//             announcementData = [announcementsData.Data];
//           }
//         }
//       } else if (Array.isArray(announcementsData)) {
//         announcementData = announcementsData;
//       }
      
//       console.log('處理後的公告數據:', announcementData);
//       console.log('已讀狀態數據:', readStatusArray);
      
//       if (!Array.isArray(announcementData)) {
//         console.warn('公告數據不是陣列格式，使用空陣列');
//         announcementData = [];
//       }
      
//       // ✅ 過濾掉尚未到發布時間的公告
//       const publishedAnnouncements = announcementData.filter(announcement => {
//         const isPublished = isAnnouncementPublished(announcement);
//         if (!isPublished) {
//           console.log(`過濾掉尚未發布的公告: ${announcement.title || announcement.name}`);
//         }
//         return isPublished;
//       });
      
//       console.log(`原始公告數量: ${announcementData.length}, 已發布公告數量: ${publishedAnnouncements.length}`);
      
//       // ✅ 建立已讀狀態映射表
//       const readStatusMap = new Map();
//       readStatusArray.forEach(status => {
//         if (status.document_number) {
//           readStatusMap.set(status.document_number, true);
//         }
//       });
      
//       // ✅ 處理 API 返回的公告數據並合併已讀狀態
//       const processedAnnouncements = publishedAnnouncements.map((announcement, index) => {
//         const announcementObj = announcement || {};
        
//         // 格式化日期
//         let formattedDate = '';
//         const publishDate = announcementObj.publish_date || announcementObj.date || announcementObj.created_at;
//         if (publishDate) {
//           try {
//             const date = new Date(publishDate);
//             if (!isNaN(date.getTime())) {
//               formattedDate = date.toISOString().split('T')[0];
//             }
//           } catch (e) {
//             console.warn('日期格式化失敗:', publishDate);
//           }
//         }
        
//         // 格式化時間
//         let displayTime = '';
//         const publishTime = announcementObj.publish_time || announcementObj.time;
//         if (publishTime) {
//           displayTime = publishTime;
//         } else if (publishDate) {
//           try {
//             const date = new Date(publishDate);
//             if (!isNaN(date.getTime())) {
//               displayTime = date.toTimeString().split(' ')[0].substring(0, 5);
//             }
//           } catch (e) {
//             console.warn('時間格式化失敗:', publishDate);
//           }
//         }
        
//         const title = announcementObj.title || announcementObj.name || announcementObj.subject || `公告 ${index + 1}`;
//         const content = announcementObj.content || announcementObj.message || announcementObj.description || '';
//         const announcementId = announcementObj.id || announcementObj._id || `announcement-${index}-${Date.now()}`;
//         const documentNumber = announcementObj.document_number || announcementId;
        
//         // ✅ 根據 API 查詢結果判斷是否已讀
//         const isRead = readStatusMap.has(documentNumber);
        
//         return {
//           id: announcementId,
//           document_number: documentNumber,
//           announcement_name: title,
//           announcement_content: content,
//           formatted_date: formattedDate,
//           display_time: displayTime,
//           status: announcementObj.status || 'active',
//           publish_date: publishDate,
//           publish_time: announcementObj.publish_time, // 保留原始發布時間
//           attachments: announcementObj.attachments || [],
//           read_by: announcementObj.read_by || [],
//           unread: !isRead // 根據 API 結果設置未讀狀態
//         };
//       });
      
//       // 按發布日期排序，最新的在前面
//       const sortedAnnouncements = processedAnnouncements.sort((a, b) => {
//         const dateA = new Date(a.publish_date || '2000-01-01');
//         const dateB = new Date(b.publish_date || '2000-01-01');
//         return dateB - dateA;
//       });
      
//       setAnnouncements(sortedAnnouncements);
//       setIsLoading(false);
      
//       console.log(`成功獲取 ${sortedAnnouncements.length} 條已發布公告`);
//       console.log(`其中已讀 ${sortedAnnouncements.filter(a => !a.unread).length} 條，未讀 ${sortedAnnouncements.filter(a => a.unread).length} 條`);
      
//     } catch (error) {
//       console.error('獲取數據時出錯:', error);
//       setError(`獲取數據時出錯: ${error.message}`);
//       setIsLoading(false);
//     }
//   };

//   const getCurrentUser = () => {
//     // 這裡需要實現獲取當前用戶的邏輯
//     return '當前用戶';
//   };

//   // ✅ 處理回到首頁的邏輯
//   const handleHomeClick = () => {
//     if (isApp) {
//       if (window.flutter) {
//         window.flutter.postMessage('navigateToHome');
//       }
//     } else {
//       navigate('/frontpage01');
//     }
//   };

//   // ✅ 重試功能
//   const handleRetry = () => {
//     setError(null);
//     const cookieCompanyId = getCompanyIdFromCookies();
//     const cookieEmployeeId = getEmployeeIdFromCookies();
    
//     if (cookieCompanyId) {
//       setCompanyId(cookieCompanyId);
//     } else {
//       setError('找不到公司資料，請重新登入');
//     }

//     if (cookieEmployeeId) {
//       setEmployeeId(cookieEmployeeId);
//     } else {
//       setError('找不到員工資料，請重新登入');
//     }
//   };

//   // 🔥 修改：處理公告點擊，顯示全螢幕詳情
//   const handleAnnouncementClick = async (announcement) => {
//     // ✅ 設置選中的公告並顯示全螢幕詳情
//     setSelectedAnnouncement(announcement);
//     setReadList(announcement.read_by || []);
    
//     // ✅ 根據當前公告的已讀狀態設置 hasRead
//     setHasRead(!announcement.unread);
    
//     setShowDetailView(true);
//     // 防止背景滾動
//     document.body.classList.add('fullscreen-open');

//     // 🔥 新增：獲取已讀人員姓名
//     const documentNumber = announcement.document_number || announcement.id;
//     const readNames = await fetchReadEmployeeNames(documentNumber);
//     setReadEmployeeNames(readNames);
//   };

//   // 🔥 修改：返回公告列表
//   const handleBackToList = () => {
//     setShowDetailView(false);
//     setSelectedAnnouncement(null);
//     setHasRead(false);
//     setReadList([]);
//     // 🔥 新增：清理已讀人員姓名
//     setReadEmployeeNames([]);
//     setReadStatusLoading(false);
//     // 恢復背景滾動
//     document.body.classList.remove('fullscreen-open');
//   };

//   // 🔥 修改：標記為已讀 - 使用新的 API
//   const handleMarkAsRead = async () => {
//     if (!selectedAnnouncement) return;

//     try {
//       // 獲取必要的參數
//       const documentNumber = selectedAnnouncement.document_number || selectedAnnouncement.id;
      
//       if (!employeeId) {
//         console.error('找不到員工 ID');
//         alert('找不到員工資料，請重新登入');
//         return;
//       }

//       if (!companyId) {
//         console.error('找不到公司 ID');
//         alert('找不到公司資料，請重新登入');
//         return;
//       }

//       console.log('準備標記公告為已讀:', {
//         document_number: documentNumber,
//         company_id: companyId,
//         employee_id: employeeId
//       });

//       // 呼叫標記已讀 API
//       const apiUrl = `${API_BASE_URL}/api/announcement-read-status/mark-read`;
      
//       const response = await fetch(apiUrl, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           document_number: documentNumber,
//           company_id: companyId,
//           employee_id: employeeId
//         })
//       });

//       const result = await response.json();
//       console.log('API 回應:', result);

//       if (response.ok && result.Status === "Ok") {
//         // 成功標記為已讀
//         setHasRead(true);
        
//         // 更新公告列表中的已讀狀態
//         setAnnouncements(prev => 
//           prev.map(item => 
//             item.id === selectedAnnouncement.id ? { ...item, unread: false } : item
//           )
//         );

//         // 更新已讀狀態數據
//         const newReadStatus = {
//           document_number: documentNumber,
//           company_id: companyId,
//           employee_id: employeeId,
//           read_at: new Date().toISOString()
//         };
//         setReadStatusData(prev => [...prev, newReadStatus]);

//         // 🔥 新增：重新獲取已讀人員姓名
//         const updatedReadNames = await fetchReadEmployeeNames(documentNumber);
//         setReadEmployeeNames(updatedReadNames);

//         // 顯示成功訊息
//         alert('已成功標記為已讀');
        
//       } else {
//         // API 返回錯誤
//         console.error('標記已讀失敗:', result);
//         alert(result.Msg || '標記已讀失敗，請稍後再試');
//       }

//     } catch (error) {
//       console.error('標記已讀 API 呼叫失敗:', error);
//       alert('網路錯誤，請檢查連線後再試');
//     }
//   };

//   // ✅ 處理文件下載
//   const handleDownload = (attachment) => {
//     window.open(attachment.url, '_blank');
//   };

//   // ✅ 根據選項卡過濾公告
//   const getFilteredAnnouncements = () => {
//     switch (selectedTab) {
//       case '未讀':
//         return announcements.filter(a => a.unread);
//       case '已讀':
//         return announcements.filter(a => !a.unread);
//       case '總覽':
//       default:
//         return announcements;
//     }
//   };

//   const filteredAnnouncements = getFilteredAnnouncements();
//   const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
//   const currentAnnouncements = filteredAnnouncements.slice(
//     (currentPage - 1) * announcementsPerPage,
//     currentPage * announcementsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleTabChange = (tab) => {
//     setSelectedTab(tab);
//     setCurrentPage(1);
//   };

//   // 🔥 修改：全螢幕詳情頁面渲染
//   if (showDetailView && selectedAnnouncement) {
//     return (
//       <div className="fullScreenContainer">
//         <div className="fullScreenWrapper">
//           {/* Header - 與列表頁面完全相同的結構 */}
//           <header className="fullScreenHeader">
//             <div className="homeIcon" onClick={handleHomeClick}>
//               <img src={homeIcon} alt="Home" width="20" height="20" />
//             </div>
//             <div className="pageTitle">公告</div>
//             <div className="headerSpacer"></div>
//           </header>

//           {/* ✅ 修改：返回按鈕 - 使用圖標 + 文字 */}
//           <div className="backLink" onClick={handleBackToList}>
//             <img src={returnIcon} alt="Return" className="backIcon" />
//             <span>返回公告</span>
//           </div>

//           {/* Content */}
//           <div className="fullScreenContent">
//             {/* 公告詳情卡片 */}
//             <div className="announcementDetailCard">
//               <div className="announcementDetailContent">
//                 {/* 公告標題和日期 */}
//                 <div className="announcementTitleSection">
//                   <div className="announcementDetailHeader">
//                     <h2 className="announcementDetailTitle">{selectedAnnouncement.announcement_name}</h2>
//                     <div className="announcementDetailDate">
//                       <img src={calendarIcon} alt="Calendar" className="calendarIcon" />
//                       <span>{selectedAnnouncement.formatted_date}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 公告內容 */}
//                 <div className="announcementContent">
//                   <pre>{selectedAnnouncement.announcement_content}</pre>
//                 </div>

//                 {/* 附件區域 */}
//                 {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
//                   <div className="attachmentSection">
//                     <div className="attachmentTitle">附件下載</div>
//                     {selectedAnnouncement.attachments.map((attachment, index) => (
//                       <div key={index} className="attachmentItem" onClick={() => handleDownload(attachment)}>
//                         <div className="attachmentInfo">
//                           <div className="attachmentIcon">
//                             {attachment.type === 'pdf' ? '📄' : '📊'}
//                           </div>
//                           <span className="attachmentName">{attachment.name}</span>
//                         </div>
//                         <div className="downloadIcon">⬇</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* 🔥 修改：已讀名單 - 只顯示人名 */}
//               <div className="readSection">
//                 {readStatusLoading ? (
//                   <span className="readLabel">載入已讀名單中...</span>
//                 ) : (
//                   <span className="readLabel">
//                     已讀：{readEmployeeNames.length > 0 ? readEmployeeNames.join('、') : '目前沒有人已讀'}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* 底部按鈕 */}
//           <div className="fullScreenFooter">
//             {hasRead ? (
//               <div className="readButton disabled">
//                 <span>您已閱讀並簽署此公告</span>
//               </div>
//             ) : (
//               <div className="submitButton" onClick={handleMarkAsRead}>
//                 <span>已讀簽署</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ 載入狀態
//   if (isLoading) {
//     return (
//       <div className="container">
//         <div className="appWrapper">
//           <header className="header">
//             <div className="homeIcon" onClick={handleHomeClick}>
//               <img src={homeIcon} alt="Home" width="20" height="20" />
//             </div>
//             <div className="pageTitle">公告</div>
//           </header>
//           <div className="loadingContainer">
//             <p>載入中...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ 錯誤狀態
//   if (error) {
//     return (
//       <div className="container">
//         <div className="appWrapper">
//           <header className="header">
//             <div className="homeIcon" onClick={handleHomeClick}>
//               <img src={homeIcon} alt="Home" width="20" height="20" />
//             </div>
//             <div className="pageTitle">公告</div>
//           </header>
//           <div className="errorContainer">
//             <p>{error}</p>
//             <button onClick={handleRetry}>重新嘗試</button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ 主頁面渲染（公告列表）
//   return (
//     <div className="container">
//       <div className="appWrapper">
//         <header className="header">
//           <div className="homeIcon" onClick={handleHomeClick}>
//             <img src={homeIcon} alt="Home" width="20" height="20" />
//           </div>
//           <div className="pageTitle">公告</div>
//         </header>

//         <div className="contentContainer">
//           <div className="tabContainer">
//             {['總覽', '未讀', '已讀'].map((tab) => (
//               <div
//                 key={tab}
//                 className={`tab ${selectedTab === tab ? 'tabActive' : ''}`}
//                 onClick={() => handleTabChange(tab)}
//               >
//                 {tab}
//               </div>
//             ))}
//           </div>

//           <div className="announcementListContainer">
//             <div className="announcementList">
//               {currentAnnouncements.length === 0 ? (
//                 <div className="noAnnouncements">
//                   <p>沒有{selectedTab === '總覽' ? '' : selectedTab}公告</p>
//                 </div>
//               ) : (
//                 currentAnnouncements.map((announcement, index) => (
//                   <div 
//                     key={announcement.id || index} 
//                     className="announcementItem"
//                     onClick={() => handleAnnouncementClick(announcement)}
//                   >
//                     <div className="announcementHeader">
//                       <div className="announcementLeft">
//                         {announcement.unread && <div className="redDot" />}
//                         <div className={`announcementText ${!announcement.unread ? 'read' : ''}`}>
//                           {announcement.announcement_name}
//                         </div>
//                       </div>
                      
//                       <div className="announcementRight">
//                         <img 
//                           src={calendarIcon} 
//                           alt="Calendar" 
//                           className="calendarIcon"
//                         />
//                         <div className="announcementDate">
//                           {announcement.formatted_date}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {filteredAnnouncements.length > 0 && totalPages > 1 && (
//             <div className="pagination">
//               <span
//                 className={`arrowButton ${currentPage === 1 ? 'disabledArrowButton' : ''}`}
//                 onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
//               >
//                 {'<<'}
//               </span>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <span
//                   key={page}
//                   className={`pageButton ${currentPage === page ? 'activePageButton' : 'inactivePageButton'}`}
//                   onClick={() => handlePageChange(page)}
//                 >
//                   {page}
//                 </span>
//               ))}
//               <span
//                 className={`arrowButton ${currentPage === totalPages ? 'disabledArrowButton' : ''}`}
//                 onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
//               >
//                 {'>>'}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Announcement;
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './css/Announcement.css';
import homeIcon from './HomePageImage/homepage.png';
import returnIcon from './ICON/return.png';
import calendarIcon from './ICON/Calendar.png';

function Announcement() {
  // ✅ 狀態管理
  const [selectedTab, setSelectedTab] = useState('總覽');
  const [currentPage, setCurrentPage] = useState(1);
  const [isApp, setIsApp] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [readStatusData, setReadStatusData] = useState([]); // 新增：存儲已讀狀態數據

  // ✅ 全螢幕詳情頁面狀態
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [hasRead, setHasRead] = useState(false);
  const [readList, setReadList] = useState([]);
  
  // 🔥 新增：已讀人員名單
  const [readEmployeeNames, setReadEmployeeNames] = useState([]);
  const [readStatusLoading, setReadStatusLoading] = useState(false);
  
  const announcementsPerPage = 5;
  const navigate = useNavigate();

  // ✅ 從 cookies 中獲取 company_id
  const getCompanyIdFromCookies = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'company_id') {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  // ✅ 從 cookies 中獲取 employee_id
  const getEmployeeIdFromCookies = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'employee_id') {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  // 🔥 新增：檢查公告是否已過期（根據 end_date 和 end_time）
  const isAnnouncementExpired = (announcement) => {
    const now = new Date();
    
    try {
      // 處理 end_date 和 end_time
      let endDateTime = null;
      
      if (announcement.end_date && announcement.end_time) {
        // 如果有分別的結束日期和時間欄位
        const dateStr = announcement.end_date;
        const timeStr = announcement.end_time;
        
        // 組合日期和時間
        endDateTime = new Date(`${dateStr} ${timeStr}`);
        
      } else if (announcement.end_date) {
        // 如果只有結束日期欄位，設定為當天 23:59:59
        const dateStr = announcement.end_date;
        endDateTime = new Date(`${dateStr} 23:59:59`);
        
      } else {
        // 如果沒有設定結束時間，預設為永不過期
        console.log(`公告 "${announcement.title || announcement.name}" 沒有設定結束時間，預設為永不過期`);
        return false;
      }
      
      // 如果無法解析結束時間，預設為不過期
      if (!endDateTime || isNaN(endDateTime.getTime())) {
        console.warn('無法解析公告結束時間，預設為不過期:', announcement);
        return false;
      }
      
      const isExpired = now > endDateTime;
      
      console.log(`公告 "${announcement.title || announcement.name}" 過期檢查:`, {
        endDateTime: endDateTime.toISOString(),
        currentTime: now.toISOString(),
        isExpired: isExpired
      });
      
      return isExpired;
      
    } catch (error) {
      console.warn('檢查公告過期時間時出錯:', error, announcement);
      return false; // 發生錯誤時預設為不過期
    }
  };

  // ✅ 修改：檢查公告是否已經可以發布且未過期
  const isAnnouncementPublished = (announcement) => {
    const now = new Date();
    
    try {
      // 🔥 首先檢查是否已過期
      if (isAnnouncementExpired(announcement)) {
        console.log(`公告 "${announcement.title || announcement.name}" 已過期，不顯示`);
        return false;
      }
      
      // 處理 publish_date 和 publish_time
      let publishDateTime = null;
      
      if (announcement.publish_date && announcement.publish_time) {
        // 如果有分別的日期和時間欄位
        const dateStr = announcement.publish_date;
        const timeStr = announcement.publish_time;
        
        // 組合日期和時間
        publishDateTime = new Date(`${dateStr} ${timeStr}`);
        
      } else if (announcement.publish_date) {
        // 如果只有日期欄位，檢查是否包含時間資訊
        publishDateTime = new Date(announcement.publish_date);
        
      } else if (announcement.date) {
        // 備用日期欄位
        publishDateTime = new Date(announcement.date);
        
      } else if (announcement.created_at) {
        // 建立時間作為備用
        publishDateTime = new Date(announcement.created_at);
      }
      
      // 如果無法解析發布時間，預設為可以發布
      if (!publishDateTime || isNaN(publishDateTime.getTime())) {
        console.warn('無法解析公告發布時間，預設為可發布:', announcement);
        return true;
      }
      
      const isPublished = publishDateTime <= now;
      
      console.log(`公告 "${announcement.title || announcement.name}" 發布時間檢查:`, {
        publishDateTime: publishDateTime.toISOString(),
        currentTime: now.toISOString(),
        isPublished: isPublished,
        isExpired: false // 已經在上面檢查過了
      });
      
      return isPublished;
      
    } catch (error) {
      console.warn('檢查公告發布時間時出錯:', error, announcement);
      return true; // 發生錯誤時預設為可發布
    }
  };

  // 檢測是否為 App 發出的請求
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
    setIsApp(isFlutterApp);
  }, []);

  // ✅ 初始化時從 cookies 獲取公司 ID 和員工 ID
  useEffect(() => {
    const cookieCompanyId = getCompanyIdFromCookies();
    const cookieEmployeeId = getEmployeeIdFromCookies();
    
    if (cookieCompanyId) {
      setCompanyId(cookieCompanyId);
      console.log(`從 cookies 獲取到公司 ID: ${cookieCompanyId}`);
    } else {
      setError('找不到公司資料，請重新登入');
      setIsLoading(false);
    }

    if (cookieEmployeeId) {
      setEmployeeId(cookieEmployeeId);
      console.log(`從 cookies 獲取到員工 ID: ${cookieEmployeeId}`);
    } else {
      setError('找不到員工資料，請重新登入');
      setIsLoading(false);
    }
  }, []);

  // ✅ 當公司 ID 和員工 ID 都存在時，獲取數據
  useEffect(() => {
    if (companyId && employeeId) {
      fetchAnnouncementsAndReadStatus();
    }
  }, [companyId, employeeId]);

  // 🔥 新增：定時檢查並移除過期公告
  useEffect(() => {
    if (announcements.length === 0) return;

    const checkExpiredAnnouncements = () => {
      const validAnnouncements = announcements.filter(announcement => {
        const isExpired = isAnnouncementExpired(announcement);
        if (isExpired) {
          console.log(`移除過期公告: ${announcement.announcement_name}`);
        }
        return !isExpired;
      });

      if (validAnnouncements.length !== announcements.length) {
        console.log(`移除了 ${announcements.length - validAnnouncements.length} 條過期公告`);
        setAnnouncements(validAnnouncements);
        
        // 如果當前頁面沒有公告了，回到第一頁
        const newTotalPages = Math.ceil(validAnnouncements.length / announcementsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(1);
        }
      }
    };

    // 每分鐘檢查一次過期公告
    const intervalId = setInterval(checkExpiredAnnouncements, 60000);

    // 組件卸載時清理定時器
    return () => clearInterval(intervalId);
  }, [announcements, currentPage, announcementsPerPage]);

  // ✅ 獲取員工的已讀狀態
  const fetchReadStatus = async () => {
    if (!companyId || !employeeId) {
      return [];
    }

    try {
      console.log(`正在獲取員工 ${employeeId} 的已讀狀態...`);
      
      const apiUrl = `${API_BASE_URL}/api/announcement-read-status/employee/${encodeURIComponent(companyId)}/${encodeURIComponent(employeeId)}`;
      console.log(`已讀狀態 API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`獲取已讀狀態失敗 (${response.status})`);
      }
      
      const data = await response.json();
      console.log('已讀狀態 API 返回的數據:', data);
      
      if (data.Status === "Ok" && data.Data) {
        const readStatusArray = Array.isArray(data.Data) ? data.Data : [];
        setReadStatusData(readStatusArray);
        return readStatusArray;
      } else {
        console.warn('已讀狀態數據格式異常:', data);
        return [];
      }
      
    } catch (error) {
      console.error('獲取已讀狀態時出錯:', error);
      return [];
    }
  };

  // 🔥 新增：獲取公告的已讀人員姓名
  const fetchReadEmployeeNames = async (documentNumber) => {
    try {
      if (!companyId || !documentNumber) {
        console.warn('缺少必要參數:', { companyId, documentNumber });
        return [];
      }

      setReadStatusLoading(true);
      console.log('🔥 查詢公告已讀人員姓名，文件編號:', documentNumber);

      // 🔥 同時查詢所有員工和閱讀狀態
      const [allEmployeesResponse, readStatusResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            company_id: companyId
          })
        }),
        fetch(
          `${API_BASE_URL}/api/announcement-read-status?company_id=${companyId}&document_number=${documentNumber}&_t=${Date.now()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
      ]);

      // 處理所有員工資料
      let allEmployees = [];
      if (allEmployeesResponse.ok) {
        const allEmployeesResult = await allEmployeesResponse.json();
        if (allEmployeesResult.Status === 'Ok') {
          allEmployees = allEmployeesResult.Data || [];
        }
      }

      // 處理閱讀狀態
      const readEmployeeIds = new Set();
      if (readStatusResponse.ok) {
        const readStatusResult = await readStatusResponse.json();
        if (readStatusResult.Status === 'Ok') {
          const readRecords = readStatusResult.Data?.records || [];
          readRecords.forEach(record => {
            if (record.status === 'read') {
              readEmployeeIds.add(record.employee_id);
            }
          });
        }
      }

      // 🔥 提取已讀員工的姓名
      const readNames = allEmployees
        .filter(employee => readEmployeeIds.has(employee.employee_id))
        .map(employee => employee.name || employee.employee_id || '未知用戶');

      console.log('🔥 已讀員工姓名:', readNames);
      return readNames;

    } catch (error) {
      console.error('查詢已讀員工姓名錯誤:', error);
      return [];
    } finally {
      setReadStatusLoading(false);
    }
  };

  // ✅ 修改：獲取公告列表和已讀狀態
  const fetchAnnouncementsAndReadStatus = async () => {
    if (!companyId || !employeeId) {
      setError('找不到公司或員工資料，請重新登入');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`正在獲取公司 ${companyId} 的公告數據...`);
      
      // 同時獲取公告列表和已讀狀態
      const [announcementsResponse, readStatusArray] = await Promise.all([
        fetch(`${API_BASE_URL}/api/company/${encodeURIComponent(companyId)}/announcements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetchReadStatus()
      ]);
      
      if (!announcementsResponse.ok) {
        throw new Error(`API 請求失敗 (${announcementsResponse.status})`);
      }
      
      const announcementsData = await announcementsResponse.json();
      console.log('公告 API 返回的原始數據:', announcementsData);
      
      if (announcementsData.Status !== "Ok") {
        throw new Error(announcementsData.Msg || '獲取公告數據失敗');
      }
      
      // ✅ 驗證數據結構並處理不同的數據格式
      let announcementData = [];
      
      if (announcementsData.Data) {
        if (Array.isArray(announcementsData.Data)) {
          announcementData = announcementsData.Data;
        } else if (typeof announcementsData.Data === 'object' && announcementsData.Data !== null) {
          if (Array.isArray(announcementsData.Data.announcements)) {
            announcementData = announcementsData.Data.announcements;
          } else if (Array.isArray(announcementsData.Data.list)) {
            announcementData = announcementsData.Data.list;
          } else if (Array.isArray(announcementsData.Data.items)) {
            announcementData = announcementsData.Data.items;
          } else {
            announcementData = [announcementsData.Data];
          }
        }
      } else if (Array.isArray(announcementsData)) {
        announcementData = announcementsData;
      }
      
      console.log('處理後的公告數據:', announcementData);
      console.log('已讀狀態數據:', readStatusArray);
      
      if (!Array.isArray(announcementData)) {
        console.warn('公告數據不是陣列格式，使用空陣列');
        announcementData = [];
      }
      
      // 🔥 修改：過濾掉尚未到發布時間或已過期的公告
      const validAnnouncements = announcementData.filter(announcement => {
        const isPublished = isAnnouncementPublished(announcement);
        const isExpired = isAnnouncementExpired(announcement);
        
        if (!isPublished) {
          console.log(`過濾掉尚未發布的公告: ${announcement.title || announcement.name}`);
          return false;
        }
        
        if (isExpired) {
          console.log(`過濾掉已過期的公告: ${announcement.title || announcement.name}`);
          return false;
        }
        
        return true;
      });
      
      console.log(`原始公告數量: ${announcementData.length}, 有效公告數量: ${validAnnouncements.length}`);
      
      // ✅ 建立已讀狀態映射表
      const readStatusMap = new Map();
      readStatusArray.forEach(status => {
        if (status.document_number) {
          readStatusMap.set(status.document_number, true);
        }
      });
      
      // ✅ 處理 API 返回的公告數據並合併已讀狀態
      const processedAnnouncements = validAnnouncements.map((announcement, index) => {
        const announcementObj = announcement || {};
        
        // 格式化日期
        let formattedDate = '';
        const publishDate = announcementObj.publish_date || announcementObj.date || announcementObj.created_at;
        if (publishDate) {
          try {
            const date = new Date(publishDate);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn('日期格式化失敗:', publishDate);
          }
        }
        
        // 格式化時間
        let displayTime = '';
        const publishTime = announcementObj.publish_time || announcementObj.time;
        if (publishTime) {
          displayTime = publishTime;
        } else if (publishDate) {
          try {
            const date = new Date(publishDate);
            if (!isNaN(date.getTime())) {
              displayTime = date.toTimeString().split(' ')[0].substring(0, 5);
            }
          } catch (e) {
            console.warn('時間格式化失敗:', publishDate);
          }
        }
        
        const title = announcementObj.title || announcementObj.name || announcementObj.subject || `公告 ${index + 1}`;
        const content = announcementObj.content || announcementObj.message || announcementObj.description || '';
        const announcementId = announcementObj.id || announcementObj._id || `announcement-${index}-${Date.now()}`;
        const documentNumber = announcementObj.document_number || announcementId;
        
        // ✅ 根據 API 查詢結果判斷是否已讀
        const isRead = readStatusMap.has(documentNumber);
        
        return {
          id: announcementId,
          document_number: documentNumber,
          announcement_name: title,
          announcement_content: content,
          formatted_date: formattedDate,
          display_time: displayTime,
          status: announcementObj.status || 'active',
          publish_date: publishDate,
          publish_time: announcementObj.publish_time, // 保留原始發布時間
          end_date: announcementObj.end_date, // 🔥 新增：保留結束日期
          end_time: announcementObj.end_time, // 🔥 新增：保留結束時間
          attachments: announcementObj.attachments || [],
          read_by: announcementObj.read_by || [],
          unread: !isRead // 根據 API 結果設置未讀狀態
        };
      });
      
      // 按發布日期排序，最新的在前面
      const sortedAnnouncements = processedAnnouncements.sort((a, b) => {
        const dateA = new Date(a.publish_date || '2000-01-01');
        const dateB = new Date(b.publish_date || '2000-01-01');
        return dateB - dateA;
      });
      
      setAnnouncements(sortedAnnouncements);
      setIsLoading(false);
      
      console.log(`成功獲取 ${sortedAnnouncements.length} 條有效公告`);
      console.log(`其中已讀 ${sortedAnnouncements.filter(a => !a.unread).length} 條，未讀 ${sortedAnnouncements.filter(a => a.unread).length} 條`);
      
    } catch (error) {
      console.error('獲取數據時出錯:', error);
      setError(`獲取數據時出錯: ${error.message}`);
      setIsLoading(false);
    }
  };

  // 🔥 可選：格式化結束時間顯示
  const formatEndDateTime = (endDate, endTime) => {
    if (!endDate) return null;
    
    try {
      let endDateTime;
      if (endTime) {
        endDateTime = new Date(`${endDate} ${endTime}`);
      } else {
        endDateTime = new Date(`${endDate} 23:59:59`);
      }
      
      if (isNaN(endDateTime.getTime())) return null;
      
      return endDateTime.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return null;
    }
  };

  const getCurrentUser = () => {
    // 這裡需要實現獲取當前用戶的邏輯
    return '當前用戶';
  };

  // ✅ 處理回到首頁的邏輯
  const handleHomeClick = () => {
    if (isApp) {
      if (window.flutter) {
        window.flutter.postMessage('navigateToHome');
      }
    } else {
      navigate('/frontpage01');
    }
  };

  // ✅ 重試功能
  const handleRetry = () => {
    setError(null);
    const cookieCompanyId = getCompanyIdFromCookies();
    const cookieEmployeeId = getEmployeeIdFromCookies();
    
    if (cookieCompanyId) {
      setCompanyId(cookieCompanyId);
    } else {
      setError('找不到公司資料，請重新登入');
    }

    if (cookieEmployeeId) {
      setEmployeeId(cookieEmployeeId);
    } else {
      setError('找不到員工資料，請重新登入');
    }
  };

  // 🔥 修改：處理公告點擊，顯示全螢幕詳情
  const handleAnnouncementClick = async (announcement) => {
    // ✅ 設置選中的公告並顯示全螢幕詳情
    setSelectedAnnouncement(announcement);
    setReadList(announcement.read_by || []);
    
    // ✅ 根據當前公告的已讀狀態設置 hasRead
    setHasRead(!announcement.unread);
    
    setShowDetailView(true);
    // 防止背景滾動
    document.body.classList.add('fullscreen-open');

    // 🔥 新增：獲取已讀人員姓名
    const documentNumber = announcement.document_number || announcement.id;
    const readNames = await fetchReadEmployeeNames(documentNumber);
    setReadEmployeeNames(readNames);
  };

  // 🔥 修改：返回公告列表
  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedAnnouncement(null);
    setHasRead(false);
    setReadList([]);
    // 🔥 新增：清理已讀人員姓名
    setReadEmployeeNames([]);
    setReadStatusLoading(false);
    // 恢復背景滾動
    document.body.classList.remove('fullscreen-open');
  };

  // 🔥 修改：標記為已讀 - 使用新的 API
  const handleMarkAsRead = async () => {
    if (!selectedAnnouncement) return;

    try {
      // 獲取必要的參數
      const documentNumber = selectedAnnouncement.document_number || selectedAnnouncement.id;
      
      if (!employeeId) {
        console.error('找不到員工 ID');
        alert('找不到員工資料，請重新登入');
        return;
      }

      if (!companyId) {
        console.error('找不到公司 ID');
        alert('找不到公司資料，請重新登入');
        return;
      }

      console.log('準備標記公告為已讀:', {
        document_number: documentNumber,
        company_id: companyId,
        employee_id: employeeId
      });

      // 呼叫標記已讀 API
      const apiUrl = `${API_BASE_URL}/api/announcement-read-status/mark-read`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_number: documentNumber,
          company_id: companyId,
          employee_id: employeeId
        })
      });

      const result = await response.json();
      console.log('API 回應:', result);

      if (response.ok && result.Status === "Ok") {
        // 成功標記為已讀
        setHasRead(true);
        
        // 更新公告列表中的已讀狀態
        setAnnouncements(prev => 
          prev.map(item => 
            item.id === selectedAnnouncement.id ? { ...item, unread: false } : item
          )
        );

        // 更新已讀狀態數據
        const newReadStatus = {
          document_number: documentNumber,
          company_id: companyId,
          employee_id: employeeId,
          read_at: new Date().toISOString()
        };
        setReadStatusData(prev => [...prev, newReadStatus]);

        // 🔥 新增：重新獲取已讀人員姓名
        const updatedReadNames = await fetchReadEmployeeNames(documentNumber);
        setReadEmployeeNames(updatedReadNames);

        // 顯示成功訊息
        alert('已成功標記為已讀');
        
      } else {
        // API 返回錯誤
        console.error('標記已讀失敗:', result);
        alert(result.Msg || '標記已讀失敗，請稍後再試');
      }

    } catch (error) {
      console.error('標記已讀 API 呼叫失敗:', error);
      alert('網路錯誤，請檢查連線後再試');
    }
  };

  // ✅ 處理文件下載
  const handleDownload = (attachment) => {
    window.open(attachment.url, '_blank');
  };

  // ✅ 根據選項卡過濾公告
  const getFilteredAnnouncements = () => {
    switch (selectedTab) {
      case '未讀':
        return announcements.filter(a => a.unread);
      case '已讀':
        return announcements.filter(a => !a.unread);
      case '總覽':
      default:
        return announcements;
    }
  };

  const filteredAnnouncements = getFilteredAnnouncements();
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
  const currentAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * announcementsPerPage,
    currentPage * announcementsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  // 🔥 修改：全螢幕詳情頁面渲染
  if (showDetailView && selectedAnnouncement) {
    return (
      <div className="fullScreenContainer">
        <div className="fullScreenWrapper">
          {/* Header - 與列表頁面完全相同的結構 */}
          <header className="fullScreenHeader">
            <div className="homeIcon" onClick={handleHomeClick}>
              <img src={homeIcon} alt="Home" width="20" height="20" />
            </div>
            <div className="pageTitle">公告</div>
            <div className="headerSpacer"></div>
          </header>

          {/* ✅ 修改：返回按鈕 - 使用圖標 + 文字 */}
          <div className="backLink" onClick={handleBackToList}>
            <img src={returnIcon} alt="Return" className="backIcon" />
            <span>返回公告</span>
          </div>

          {/* Content */}
          <div className="fullScreenContent">
            {/* 公告詳情卡片 */}
            <div className="announcementDetailCard">
              <div className="announcementDetailContent">
                {/* 公告標題和日期 */}
                <div className="announcementTitleSection">
                  <div className="announcementDetailHeader">
                    <h2 className="announcementDetailTitle">{selectedAnnouncement.announcement_name}</h2>
                    <div className="announcementDetailDate">
                      <img src={calendarIcon} alt="Calendar" className="calendarIcon" />
                      <span>{selectedAnnouncement.formatted_date}</span>
                      {/* 🔥 新增：顯示結束時間 */}
                      {selectedAnnouncement.end_date && (
                        <div className="announcementEndDate">
                          <span>有效期至: {formatEndDateTime(selectedAnnouncement.end_date, selectedAnnouncement.end_time)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 公告內容 */}
                <div className="announcementContent">
                  <pre>{selectedAnnouncement.announcement_content}</pre>
                </div>

                {/* 附件區域 */}
                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                  <div className="attachmentSection">
                    <div className="attachmentTitle">附件下載</div>
                    {selectedAnnouncement.attachments.map((attachment, index) => (
                      <div key={index} className="attachmentItem" onClick={() => handleDownload(attachment)}>
                        <div className="attachmentInfo">
                          <div className="attachmentIcon">
                            {attachment.type === 'pdf' ? '📄' : '📊'}
                          </div>
                          <span className="attachmentName">{attachment.name}</span>
                        </div>
                        <div className="downloadIcon">⬇</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 🔥 修改：已讀名單 - 只顯示人名 */}
              <div className="readSection">
                {readStatusLoading ? (
                  <span className="readLabel">載入已讀名單中...</span>
                ) : (
                  <span className="readLabel">
                    已讀：{readEmployeeNames.length > 0 ? readEmployeeNames.join('、') : '目前沒有人已讀'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 底部按鈕 */}
          <div className="fullScreenFooter">
            {hasRead ? (
              <div className="readButton disabled">
                <span>您已閱讀並簽署此公告</span>
              </div>
            ) : (
              <div className="submitButton" onClick={handleMarkAsRead}>
                <span>已讀簽署</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ 載入狀態
  if (isLoading) {
    return (
      <div className="container">
        <div className="appWrapper">
          <header className="header">
            <div className="homeIcon" onClick={handleHomeClick}>
              <img src={homeIcon} alt="Home" width="20" height="20" />
            </div>
            <div className="pageTitle">公告</div>
          </header>
          <div className="loadingContainer">
            <p>載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 錯誤狀態
  if (error) {
    return (
      <div className="container">
        <div className="appWrapper">
          <header className="header">
            <div className="homeIcon" onClick={handleHomeClick}>
              <img src={homeIcon} alt="Home" width="20" height="20" />
            </div>
            <div className="pageTitle">公告</div>
          </header>
          <div className="errorContainer">
            <p>{error}</p>
            <button onClick={handleRetry}>重新嘗試</button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 主頁面渲染（公告列表）
  return (
    <div className="container">
      <div className="appWrapper">
        <header className="header">
          <div className="homeIcon" onClick={handleHomeClick}>
            <img src={homeIcon} alt="Home" width="20" height="20" />
          </div>
          <div className="pageTitle">公告</div>
        </header>

        <div className="contentContainer">
          <div className="tabContainer">
            {['總覽', '未讀', '已讀'].map((tab) => (
              <div
                key={tab}
                className={`tab ${selectedTab === tab ? 'tabActive' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="announcementListContainer">
            <div className="announcementList">
              {currentAnnouncements.length === 0 ? (
                <div className="noAnnouncements">
                  <p>沒有{selectedTab === '總覽' ? '' : selectedTab}公告</p>
                </div>
              ) : (
                currentAnnouncements.map((announcement, index) => (
                  <div 
                    key={announcement.id || index} 
                    className="announcementItem"
                    onClick={() => handleAnnouncementClick(announcement)}
                  >
                    <div className="announcementHeader">
                      <div className="announcementLeft">
                        {announcement.unread && <div className="redDot" />}
                        <div className={`announcementText ${!announcement.unread ? 'read' : ''}`}>
                          {announcement.announcement_name}
                        </div>
                      </div>
                      
                      <div className="announcementRight">
                        <img 
                          src={calendarIcon} 
                          alt="Calendar" 
                          className="calendarIcon"
                        />
                        <div className="announcementDate">
                          {announcement.formatted_date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {filteredAnnouncements.length > 0 && totalPages > 1 && (
            <div className="pagination">
              <span
                className={`arrowButton ${currentPage === 1 ? 'disabledArrowButton' : ''}`}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              >
                {'<<'}
              </span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <span
                  key={page}
                  className={`pageButton ${currentPage === page ? 'activePageButton' : 'inactivePageButton'}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </span>
              ))}
              <span
                className={`arrowButton ${currentPage === totalPages ? 'disabledArrowButton' : ''}`}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              >
                {'>>'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Announcement;
