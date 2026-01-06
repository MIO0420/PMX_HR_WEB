
// import React, { useState, useEffect, useRef } from 'react';
// import './Release_Record.css';
// import { API_BASE_URL } from '../../../config';

// // 🔥 添加圖片引入
// import uploadedAttachmentsIcon from '../../ICON/Uploaded_attachments.png';
// import uploadedPhotosIcon from '../../ICON/Uploaded_photos.png';
// import portraitIcon from '../../ICON/Portrait.png';

// const ReleaseRecord = () => {
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [releaseRecords, setReleaseRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [recordDetail, setRecordDetail] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);
  
//   // 🔥 新增：閱讀狀態相關狀態
//   const [readStatusData, setReadStatusData] = useState(null);
//   const [readStatusLoading, setReadStatusLoading] = useState(false);
//   const [readStatusError, setReadStatusError] = useState(null);
  
//   const isLoadingRef = useRef(false);

//   // 🔥 從 cookies 獲取資料的輔助函數
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   // 🔥 格式化日期顯示 (YYYY-MM-DD 格式)
//   const formatDateDisplay = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // 🔥 查詢公司所有員工
//   const fetchAllEmployees = async () => {
//     try {
//       const companyId = getCookie('company_id');
      
//       if (!companyId) {
//         throw new Error('無法獲取公司資訊');
//       }

//       console.log('🔥 查詢公司所有員工，公司ID:', companyId);

//       const response = await fetch(`${API_BASE_URL}/api/employees`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({
//           company_id: companyId
//         })
//       });

//       const result = await response.json();
//       console.log('🔥 所有員工 API 回應:', result);

//       if (response.ok && result.Status === 'Ok') {
//         return result.Data || [];
//       } else {
//         throw new Error(result.Msg || '查詢員工資料失敗');
//       }
//     } catch (error) {
//       console.error('查詢所有員工失敗:', error);
//       return [];
//     }
//   };

//   // 🔥 查詢所有公告記錄
//   const fetchReleaseRecords = async () => {
//     if (isLoadingRef.current) {
//       console.log('🔥 已在載入中，跳過重複查詢');
//       return;
//     }

//     try {
//       isLoadingRef.current = true;
//       setLoading(true);
      
//       const companyId = getCookie('company_id');
      
//       if (!companyId) {
//         setError('無法獲取公司資訊，請重新登入！');
//         return;
//       }

//       console.log('🔥 開始查詢所有公告記錄，公司ID:', companyId);

//       const response = await fetch(`${API_BASE_URL}/api/announcements?company_id=${companyId}&_t=${Date.now()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const result = await response.json();
//       console.log('🔥 API 回應:', result);

//       if (response.ok && result.Status === 'Ok') {
//         console.log('🔥 查詢到的公告總數:', result.Data.announcements.length);

//         const formattedRecords = result.Data.announcements
//           .map(record => ({
//             id: record.id,
//             releaseDate: formatDateDisplay(record.publish_date),
//             documentNumber: record.document_number,
//             title: record.title,
//             publisher: record.employee_id,
//             content: record.content,
//             publish_date: record.publish_date,
//             publish_time: record.publish_time,
//             end_date: record.end_date,
//             end_time: record.end_time,
//             status: record.status,
//             created_at: record.created_at,
//             updated_at: record.updated_at,
//             sortTimestamp: new Date(record.publish_date + 'T' + (record.publish_time || '00:00:00')).getTime(),
//             attachments: [],
//             images: []
//           }))
//           .sort((a, b) => b.sortTimestamp - a.sortTimestamp);

//         console.log('🔥 格式化並排序後的記錄數量:', formattedRecords.length);
//         setReleaseRecords(formattedRecords);
//         setError(null);
//       } else {
//         setError(result.Msg || '查詢失敗');
//       }
//     } catch (error) {
//       console.error('查詢發布記錄失敗:', error);
//       setError('網路錯誤，請稍後再試！');
//     } finally {
//       setLoading(false);
//       isLoadingRef.current = false;
//     }
//   };

//   // 🔥 重新設計：整合所有員工和閱讀狀態
//   const fetchReadStatus = async (documentNumber) => {
//     try {
//       setReadStatusLoading(true);
//       setReadStatusError(null);
      
//       const companyId = getCookie('company_id');
      
//       if (!companyId) {
//         setReadStatusError('無法獲取公司資訊，請重新登入！');
//         return;
//       }

//       console.log('🔥 查詢公告閱讀狀態，文件編號:', documentNumber);

//       // 🔥 同時查詢所有員工和閱讀狀態
//       const [allEmployeesResponse, readStatusResponse] = await Promise.all([
//         fetchAllEmployees(),
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

//       console.log('🔥 所有員工資料:', allEmployeesResponse);

//       const readStatusResult = await readStatusResponse.json();
//       console.log('🔥 閱讀狀態 API 回應:', readStatusResult);

//       // 🔥 建立已讀員工的映射表
//       const readEmployeeMap = {};
//       if (readStatusResponse.ok && readStatusResult.Status === 'Ok') {
//         const readRecords = readStatusResult.Data?.records || [];
//         readRecords.forEach(record => {
//           if (record.status === 'read') {
//             readEmployeeMap[record.employee_id] = {
//               employee_id: record.employee_id,
//               employee_name: record.employee_name || record.employee_id,
//               department: record.department || '未知部門',
//               status: 'read',
//               read_at: record.read_at,
//               created_at: record.created_at,
//               updated_at: record.updated_at
//             };
//           }
//         });
//       }

//       console.log('🔥 已讀員工映射表:', readEmployeeMap);

//       // 🔥 處理所有員工資料
//       const readEmployees = [];
//       const unreadEmployees = [];

//       allEmployeesResponse.forEach(employee => {
//         if (readEmployeeMap[employee.employee_id]) {
//           // 🔥 該員工已讀過這則公告
//           readEmployees.push({
//             employee_id: employee.employee_id,
//             employee_name: employee.name,
//             department: employee.department || '未知部門',
//             job_grade: employee.job_grade,
//             status: 'read',
//             read_at: readEmployeeMap[employee.employee_id].read_at
//           });
//         } else {
//           // 🔥 該員工尚未讀過這則公告
//           unreadEmployees.push({
//             employee_id: employee.employee_id,
//             employee_name: employee.name,
//             department: employee.department || '未知部門',
//             job_grade: employee.job_grade,
//             status: 'unread',
//             read_at: null
//           });
//         }
//       });

//       console.log('🔥 公司總員工數:', allEmployeesResponse.length);
//       console.log('🔥 已讀員工數:', readEmployees.length);
//       console.log('🔥 未讀員工數:', unreadEmployees.length);
//       console.log('🔥 已讀員工詳情:', readEmployees);
//       console.log('🔥 未讀員工詳情:', unreadEmployees);

//       setReadStatusData({
//         readEmployees,
//         unreadEmployees,
//         totalEmployees: allEmployeesResponse.length,
//         readCount: readEmployees.length,
//         unreadCount: unreadEmployees.length,
//         total: allEmployeesResponse.length
//       });

//     } catch (error) {
//       console.error('查詢閱讀狀態錯誤:', error);
//       setReadStatusError('網路錯誤，請稍後再試！');
      
//       // 🔥 錯誤時也嘗試顯示所有員工為未讀
//       try {
//         const allEmployees = await fetchAllEmployees();
//         if (allEmployees.length > 0) {
//           const unreadEmployees = allEmployees.map(employee => ({
//             employee_id: employee.employee_id,
//             employee_name: employee.name,
//             department: employee.department || '未知部門',
//             job_grade: employee.job_grade,
//             status: 'unread',
//             read_at: null
//           }));

//           setReadStatusData({
//             readEmployees: [],
//             unreadEmployees,
//             totalEmployees: unreadEmployees.length,
//             readCount: 0,
//             unreadCount: unreadEmployees.length,
//             total: unreadEmployees.length
//           });
//         }
//       } catch (employeeError) {
//         console.error('查詢員工資料也失敗:', employeeError);
//         setReadStatusData({
//           readEmployees: [],
//           unreadEmployees: [],
//           totalEmployees: 0,
//           readCount: 0,
//           unreadCount: 0,
//           total: 0
//         });
//       }
//     } finally {
//       setReadStatusLoading(false);
//     }
//   };

//   // 🔥 組件載入時查詢資料
//   useEffect(() => {
//     fetchReleaseRecords();
//   }, []);

//   const handleRecordClick = (record) => {
//     console.log('🔥 點擊公告:', record);
//     setSelectedRecord(record);
//     setReadStatusData(null);
//     setReadStatusError(null);
//     fetchReadStatus(record.documentNumber);
//   };

//   // 🔥 處理返回列表
//   const handleBackToList = () => {
//     setSelectedRecord(null);
//     setRecordDetail(null);
//     setReadStatusData(null);
//     setReadStatusError(null);
//   };

//   // 🔥 載入中狀態
//   if (loading) {
//     return (
//       <div className="release-record-content-area">

//       </div>
//     );
//   }

//   // 🔥 錯誤狀態
//   if (error) {
//     return (
//       <div className="release-record-content-area">

//       </div>
//     );
//   }

//   // 🔥 如果選中了記錄，顯示詳細檢視
//   if (selectedRecord) {
//     return (
//       <div className="release-record-upload-announcement-container">
//         <div className="release-record-upload-announcement-main-content-area">
//           <div className="release-record-upload-announcement-content-frame">
//             {/* 返回按鈕 */}
//             <div className="release-record-back-button-container">
//               <button className="release-record-back-button" onClick={handleBackToList}>
//                 <div className="release-record-back-arrow">↑</div>
//                 <div className="release-record-back-text">返回發布記錄</div>
//               </button>
//             </div>

//             {/* 主編輯區域 - 顯示公告內容 */}
//             <div className="release-record-upload-announcement-main-edit-area">
//               <div className="release-record-upload-announcement-edit-content-container">
//                 {/* 文字顯示區域 */}
//                 <div className="release-record-upload-announcement-text-edit-area">
//                   {/* 標題區域 */}
//                   <div className="release-record-upload-announcement-title-frame">
//                     <div className="release-record-upload-announcement-title-display">
//                       {selectedRecord.title}
//                     </div>
//                   </div>

//                   {/* 內文區域 */}
//                   <div className="release-record-upload-announcement-content-text-frame">
//                     <div className="release-record-upload-announcement-content-display">
//                       {selectedRecord.content || '無內容'}
//                     </div>
//                   </div>
//                 </div>

//                 {/* 附件顯示區域 */}
//                 <div className="release-record-upload-announcement-attachment-area">
//                   {/* 🔥 安全地顯示附件 */}
//                   {(selectedRecord.attachments || []).map((attachment, index) => (
//                     <div key={`attachment-${index}`} className="release-record-upload-announcement-uploaded-item attachment">
//                       <div className="release-record-upload-announcement-uploaded-icon">
//                         <img src={uploadedAttachmentsIcon} alt="附件" style={{width: '70px', height: '70px'}} />
//                       </div>
//                       <div className="release-record-upload-announcement-uploaded-name">
//                         {attachment.name || '附件名稱.pdf'}
//                       </div>
//                     </div>
//                   ))}

//                   {/* 🔥 安全地顯示圖片 */}
//                   {(selectedRecord.images || []).map((image, index) => (
//                     <div key={`image-${index}`} className="release-record-upload-announcement-uploaded-item image">
//                       <div className="release-record-upload-announcement-uploaded-icon">
//                         <img src={uploadedPhotosIcon} alt="圖片" style={{width: '70px', height: '70px'}} />
//                       </div>
//                       <div className="release-record-upload-announcement-uploaded-name">
//                         {image.name || '圖片名稱.png'}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* 🔥 修改：已讀和未讀人數區域 - 顯示完整員工資料 */}
//             <div className="release-record-upload-announcement-settings-area">
//               {readStatusLoading ? (
//                 <div style={{ 
//                   display: 'flex', 
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   minHeight: '100px',
//                   fontSize: '16px',
//                   color: '#666666'
//                 }}>
//                   載入閱讀狀態中...
//                 </div>
//               ) : readStatusError ? (
//                 <div style={{ 
//                   display: 'flex', 
//                   flexDirection: 'column',
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   minHeight: '100px',
//                   gap: '10px'
//                 }}>
//                   <div style={{ fontSize: '14px', color: '#e74c3c' }}>{readStatusError}</div>
//                   <button 
//                     onClick={() => fetchReadStatus(selectedRecord.documentNumber)}
//                     style={{
//                       padding: '6px 12px',
//                       background: '#007bff',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     重新載入
//                   </button>
//                 </div>
//               ) : readStatusData ? (
//                 <>
//                   {/* 🔥 新增：統計資訊 */}
//                   <div style={{
//                     display: 'flex',
//                     gap: '20px',
//                     marginBottom: '20px',
//                     padding: '15px',
//                     background: '#f8f9fa',
//                     borderRadius: '8px',
//                     border: '1px solid #e9ecef',
//                     flexWrap: 'wrap'
//                   }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <span style={{ fontWeight: '500', color: '#666' }}>公司總員工：</span>
//                       <span style={{ fontWeight: '700', color: '#3A6CA6', fontSize: '18px' }}>
//                         {readStatusData.totalEmployees}
//                       </span>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <span style={{ fontWeight: '500', color: '#666' }}>已讀：</span>
//                       <span style={{ fontWeight: '700', color: '#28a745', fontSize: '18px' }}>
//                         {readStatusData.readCount}
//                       </span>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <span style={{ fontWeight: '500', color: '#666' }}>未讀：</span>
//                       <span style={{ fontWeight: '700', color: '#dc3545', fontSize: '18px' }}>
//                         {readStatusData.unreadCount}
//                       </span>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <span style={{ fontWeight: '500', color: '#666' }}>閱讀率：</span>
//                       <span style={{ fontWeight: '700', color: '#3A6CA6', fontSize: '18px' }}>
//                         {readStatusData.totalEmployees > 0 
//                           ? Math.round((readStatusData.readCount / readStatusData.totalEmployees) * 100) 
//                           : 0}%
//                       </span>
//                     </div>
//                   </div>

//                   {/* 已讀人數區域 */}
//                   <div className="release-record-upload-announcement-setting-item">
//                     <div className="release-record-read-header">
//                       <div className="release-record-read-title-group">
//                         <div className="release-record-read-label">已讀人數</div>
//                         <div className="release-record-read-count">{readStatusData.readCount}</div>
//                         <div className="release-record-read-unit">人</div>
//                       </div>
//                     </div>

//                     <div className="release-record-read-users">
//                       {readStatusData.readEmployees.length > 0 ? (
//                         readStatusData.readEmployees.map((user, index) => (
//                           <div key={`read-${index}`} className="release-record-user-item">
//                             <div className="release-record-user-content">
//                               <div className="release-record-user-info">
//                                 <div className="release-record-user-avatar">
//                                   <img src={portraitIcon} alt="員工頭像" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
//                                 </div>
//                                 <div className="release-record-user-details">
//                                   <div className="release-record-user-name">{user.employee_name || user.employee_id || '未知用戶'}</div>
//                                   <div className="release-record-user-id"> {user.employee_id || ''}</div>

//                                 </div>
//                               </div>
//                               <div className="release-record-user-department">
//                                 {user.department || '未知部門'}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div style={{ 
//                           textAlign: 'center', 
//                           color: '#999', 
//                           padding: '20px',
//                           width: '100%'
//                         }}>
//                           目前沒有已讀員工
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* 🔥 未讀人數區域 */}
//                   <div className="release-record-upload-announcement-setting-item">
//                     <div className="release-record-read-header">
//                       <div className="release-record-read-title-group">
//                         <div className="release-record-read-label">未讀人數</div>
//                         <div className="release-record-read-count">{readStatusData.unreadCount}</div>
//                         <div className="release-record-read-unit">人</div>
//                       </div>
//                     </div>

//                     <div className="release-record-read-users">
//                       {readStatusData.unreadEmployees.length > 0 ? (
//                         readStatusData.unreadEmployees.map((user, index) => (
//                           <div key={`unread-${index}`} className="release-record-user-item">
//                             <div className="release-record-user-content">
//                               <div className="release-record-user-info">
//                                 <div className="release-record-user-avatar">
//                                   <img src={portraitIcon} alt="員工頭像" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
//                                 </div>
//                                 <div className="release-record-user-details">
//                                   <div className="release-record-user-name">{user.employee_name || user.employee_id || '未知用戶'}</div>
//                                   <div className="release-record-user-id"> {user.employee_id || ''}</div>
//                                 </div>
//                               </div>
//                               <div className="release-record-user-department">
//                                 {user.department || '未知部門'}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div style={{ 
//                           textAlign: 'center', 
//                           color: '#999', 
//                           padding: '20px',
//                           width: '100%'
//                         }}>
//                           所有員工都已閱讀
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div style={{ 
//                   display: 'flex', 
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   minHeight: '100px',
//                   fontSize: '14px',
//                   color: '#999'
//                 }}>
//                   無閱讀狀態資料
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 顯示發布記錄列表
//   return (
//     <div className="release-record-content-area">
//       {/* 表頭 */}
//       <div className="release-record-header">
//         <div className="release-record-header-date">發布日期</div>
//         <div className="release-record-header-document">文號</div>
//         <div className="release-record-header-title">標題</div>
//         <div className="release-record-header-publisher">發布人</div>
//       </div>

//       {/* 公告列表 */}
//       <div className="release-record-announcement-list">
//         {releaseRecords.length === 0 ? (
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//             minHeight: '200px',
//             fontSize: '16px',
//             color: '#999999'
//           }}>
//             目前沒有發布記錄
//           </div>
//         ) : (
//           releaseRecords.map((record) => (
//             <div key={record.id} className="release-record-item-frame">
//               <div className="release-record-item">
//                 <div 
//                   className="release-record-item-content"
//                   onClick={() => handleRecordClick(record)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {/* 發布日期 */}
//                   <div className="release-record-item-date">
//                     {record.releaseDate}
//                   </div>
                  
//                   {/* 文號 */}
//                   <div className="release-record-item-document">
//                     {record.documentNumber}
//                   </div>
                  
//                   {/* 標題 */}
//                   <div className="release-record-item-title">
//                     {record.title}
//                   </div>
                  
//                   {/* 發布人 */}
//                   <div className="release-record-item-publisher">
//                     {record.publisher}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* 捲軸 */}
//       <div className="release-record-scrollbar"></div>
//     </div>
//   );
// };

// export default ReleaseRecord;
import React, { useState, useEffect, useRef } from 'react';
import './Release_Record.css';
import { API_BASE_URL } from '../../../config';

// 🔥 添加圖片引入
import uploadedAttachmentsIcon from '../../ICON/Uploaded_attachments.png';
import uploadedPhotosIcon from '../../ICON/Uploaded_photos.png';
import portraitIcon from '../../ICON/Portrait.png';

const ReleaseRecord = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [releaseRecords, setReleaseRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recordDetail, setRecordDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // 🔥 新增：閱讀狀態相關狀態
  const [readStatusData, setReadStatusData] = useState(null);
  const [readStatusLoading, setReadStatusLoading] = useState(false);
  const [readStatusError, setReadStatusError] = useState(null);
  
  const isLoadingRef = useRef(false);

  // 🔥 從 cookies 獲取資料的輔助函數
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // 🔥 格式化日期顯示 (YYYY-MM-DD 格式)
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 🔥 查詢公司所有員工
  const fetchAllEmployees = async () => {
    try {
      const companyId = getCookie('company_id');
      
      if (!companyId) {
        throw new Error('無法獲取公司資訊');
      }

      console.log('🔥 查詢公司所有員工，公司ID:', companyId);

      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          company_id: companyId
        })
      });

      const result = await response.json();
      console.log('🔥 所有員工 API 回應:', result);

      if (response.ok && result.Status === 'Ok') {
        return result.Data || [];
      } else {
        throw new Error(result.Msg || '查詢員工資料失敗');
      }
    } catch (error) {
      console.error('查詢所有員工失敗:', error);
      return [];
    }
  };

  // 🔥 查詢所有公告記錄
  const fetchReleaseRecords = async () => {
    if (isLoadingRef.current) {
      console.log('🔥 已在載入中，跳過重複查詢');
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      const companyId = getCookie('company_id');
      
      if (!companyId) {
        setError('無法獲取公司資訊，請重新登入！');
        return;
      }

      console.log('🔥 開始查詢所有公告記錄，公司ID:', companyId);

      const response = await fetch(`${API_BASE_URL}/api/announcements?company_id=${companyId}&_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log('🔥 API 回應:', result);

      if (response.ok && result.Status === 'Ok') {
        console.log('🔥 查詢到的公告總數:', result.Data.announcements.length);

        const formattedRecords = result.Data.announcements
          .map(record => ({
            id: record.id,
            releaseDate: formatDateDisplay(record.publish_date),
            documentNumber: record.document_number,
            title: record.title,
            publisher: record.employee_id,
            content: record.content,
            publish_date: record.publish_date,
            publish_time: record.publish_time,
            end_date: record.end_date,
            end_time: record.end_time,
            status: record.status,
            created_at: record.created_at,
            updated_at: record.updated_at,
            sortTimestamp: new Date(record.publish_date + 'T' + (record.publish_time || '00:00:00')).getTime(),
            attachments: [],
            images: []
          }))
          .sort((a, b) => b.sortTimestamp - a.sortTimestamp);

        console.log('🔥 格式化並排序後的記錄數量:', formattedRecords.length);
        setReleaseRecords(formattedRecords);
        setError(null);
      } else {
        setError(result.Msg || '查詢失敗');
      }
    } catch (error) {
      console.error('查詢發布記錄失敗:', error);
      setError('網路錯誤，請稍後再試！');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // 🔥 重新設計：整合所有員工和閱讀狀態
  const fetchReadStatus = async (documentNumber) => {
    try {
      setReadStatusLoading(true);
      setReadStatusError(null);
      
      const companyId = getCookie('company_id');
      
      if (!companyId) {
        setReadStatusError('無法獲取公司資訊，請重新登入！');
        return;
      }

      console.log('🔥 查詢公告閱讀狀態，文件編號:', documentNumber);

      // 🔥 同時查詢所有員工和閱讀狀態
      const [allEmployeesResponse, readStatusResponse] = await Promise.all([
        fetchAllEmployees(),
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

      console.log('🔥 所有員工資料:', allEmployeesResponse);

      const readStatusResult = await readStatusResponse.json();
      console.log('🔥 閱讀狀態 API 回應:', readStatusResult);

      // 🔥 建立已讀員工的映射表
      const readEmployeeMap = {};
      if (readStatusResponse.ok && readStatusResult.Status === 'Ok') {
        const readRecords = readStatusResult.Data?.records || [];
        readRecords.forEach(record => {
          if (record.status === 'read') {
            readEmployeeMap[record.employee_id] = {
              employee_id: record.employee_id,
              employee_name: record.employee_name || record.employee_id,
              department: record.department || '未知部門',
              status: 'read',
              read_at: record.read_at,
              created_at: record.created_at,
              updated_at: record.updated_at
            };
          }
        });
      }

      console.log('🔥 已讀員工映射表:', readEmployeeMap);

      // 🔥 處理所有員工資料
      const readEmployees = [];
      const unreadEmployees = [];

      allEmployeesResponse.forEach(employee => {
        if (readEmployeeMap[employee.employee_id]) {
          // 🔥 該員工已讀過這則公告
          readEmployees.push({
            employee_id: employee.employee_id,
            employee_name: employee.name,
            department: employee.department || '未知部門',
            job_grade: employee.job_grade,
            status: 'read',
            read_at: readEmployeeMap[employee.employee_id].read_at
          });
        } else {
          // 🔥 該員工尚未讀過這則公告
          unreadEmployees.push({
            employee_id: employee.employee_id,
            employee_name: employee.name,
            department: employee.department || '未知部門',
            job_grade: employee.job_grade,
            status: 'unread',
            read_at: null
          });
        }
      });

      console.log('🔥 公司總員工數:', allEmployeesResponse.length);
      console.log('🔥 已讀員工數:', readEmployees.length);
      console.log('🔥 未讀員工數:', unreadEmployees.length);
      console.log('🔥 已讀員工詳情:', readEmployees);
      console.log('🔥 未讀員工詳情:', unreadEmployees);

      setReadStatusData({
        readEmployees,
        unreadEmployees,
        totalEmployees: allEmployeesResponse.length,
        readCount: readEmployees.length,
        unreadCount: unreadEmployees.length,
        total: allEmployeesResponse.length
      });

    } catch (error) {
      console.error('查詢閱讀狀態錯誤:', error);
      setReadStatusError('網路錯誤，請稍後再試！');
      
      // 🔥 錯誤時也嘗試顯示所有員工為未讀
      try {
        const allEmployees = await fetchAllEmployees();
        if (allEmployees.length > 0) {
          const unreadEmployees = allEmployees.map(employee => ({
            employee_id: employee.employee_id,
            employee_name: employee.name,
            department: employee.department || '未知部門',
            job_grade: employee.job_grade,
            status: 'unread',
            read_at: null
          }));

          setReadStatusData({
            readEmployees: [],
            unreadEmployees,
            totalEmployees: unreadEmployees.length,
            readCount: 0,
            unreadCount: unreadEmployees.length,
            total: unreadEmployees.length
          });
        }
      } catch (employeeError) {
        console.error('查詢員工資料也失敗:', employeeError);
        setReadStatusData({
          readEmployees: [],
          unreadEmployees: [],
          totalEmployees: 0,
          readCount: 0,
          unreadCount: 0,
          total: 0
        });
      }
    } finally {
      setReadStatusLoading(false);
    }
  };

  // 🔥 組件載入時查詢資料
  useEffect(() => {
    fetchReleaseRecords();
  }, []);

  const handleRecordClick = (record) => {
    console.log('🔥 點擊公告:', record);
    setSelectedRecord(record);
    setReadStatusData(null);
    setReadStatusError(null);
    fetchReadStatus(record.documentNumber);
  };

  // 🔥 處理返回列表
  const handleBackToList = () => {
    setSelectedRecord(null);
    setRecordDetail(null);
    setReadStatusData(null);
    setReadStatusError(null);
  };

  // 🔥 載入中狀態
  if (loading) {
    return (
      <div className="release-record-content-area">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          fontSize: '16px',
          color: '#666666'
        }}>
          載入中...
        </div>
      </div>
    );
  }

  // 🔥 錯誤狀態
  if (error) {
    return (
      <div className="release-record-content-area">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          gap: '20px'
        }}>
          <div style={{ fontSize: '16px', color: '#666666' }}>{error}</div>
          <button 
            onClick={fetchReleaseRecords}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  // 🔥 如果選中了記錄，顯示詳細檢視
  if (selectedRecord) {
    return (
      <div className="release-record-upload-announcement-container">
        <div className="release-record-upload-announcement-main-content-area">
          <div className="release-record-upload-announcement-content-frame">
            {/* 返回按鈕 */}
            <div className="release-record-back-button-container">
              <button className="release-record-back-button" onClick={handleBackToList}>
                <div className="release-record-back-arrow">↑</div>
                <div className="release-record-back-text">返回發布記錄</div>
              </button>
            </div>

            {/* 主編輯區域 - 顯示公告內容 */}
            <div className="release-record-upload-announcement-main-edit-area">
              <div className="release-record-upload-announcement-edit-content-container">
                {/* 文字顯示區域 */}
                <div className="release-record-upload-announcement-text-edit-area">
                  {/* 標題區域 */}
                  <div className="release-record-upload-announcement-title-frame">
                    <div className="release-record-upload-announcement-title-display">
                      {selectedRecord.title}
                    </div>
                  </div>

                  {/* 內文區域 */}
                  <div className="release-record-upload-announcement-content-text-frame">
                    <div className="release-record-upload-announcement-content-display">
                      {selectedRecord.content || '無內容'}
                    </div>
                  </div>
                </div>

                {/* 附件顯示區域 */}
                <div className="release-record-upload-announcement-attachment-area">
                  {/* 🔥 安全地顯示附件 */}
                  {(selectedRecord.attachments || []).map((attachment, index) => (
                    <div key={`attachment-${index}`} className="release-record-upload-announcement-uploaded-item attachment">
                      <div className="release-record-upload-announcement-uploaded-icon">
                        <img src={uploadedAttachmentsIcon} alt="附件" style={{width: '70px', height: '70px'}} />
                      </div>
                      <div className="release-record-upload-announcement-uploaded-name">
                        {attachment.name || '附件名稱.pdf'}
                      </div>
                    </div>
                  ))}

                  {/* 🔥 安全地顯示圖片 */}
                  {(selectedRecord.images || []).map((image, index) => (
                    <div key={`image-${index}`} className="release-record-upload-announcement-uploaded-item image">
                      <div className="release-record-upload-announcement-uploaded-icon">
                        <img src={uploadedPhotosIcon} alt="圖片" style={{width: '70px', height: '70px'}} />
                      </div>
                      <div className="release-record-upload-announcement-uploaded-name">
                        {image.name || '圖片名稱.png'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🔥 修改：已讀和未讀人數區域 - 移除統計資訊 */}
            <div className="release-record-upload-announcement-settings-area">
              {readStatusLoading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '100px',
                  fontSize: '16px',
                  color: '#666666'
                }}>
                  載入閱讀狀態中...
                </div>
              ) : readStatusError ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '100px',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '14px', color: '#e74c3c' }}>{readStatusError}</div>
                  <button 
                    onClick={() => fetchReadStatus(selectedRecord.documentNumber)}
                    style={{
                      padding: '6px 12px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    重新載入
                  </button>
                </div>
              ) : readStatusData ? (
                <>
                  {/* 🔥 移除：統計資訊區域已完全刪除 */}

                  {/* 已讀人數區域 */}
                  <div className="release-record-upload-announcement-setting-item">
                    <div className="release-record-read-header">
                      <div className="release-record-read-title-group">
                        <div className="release-record-read-label">已讀人數</div>
                        <div className="release-record-read-count">{readStatusData.readCount}</div>
                        <div className="release-record-read-unit">人</div>
                      </div>
                    </div>

                    <div className="release-record-read-users">
                      {readStatusData.readEmployees.length > 0 ? (
                        readStatusData.readEmployees.map((user, index) => (
                          <div key={`read-${index}`} className="release-record-user-item">
                            <div className="release-record-user-content">
                              <div className="release-record-user-info">
                                <div className="release-record-user-avatar">
                                  <img src={portraitIcon} alt="員工頭像" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                                </div>
                                <div className="release-record-user-details">
                                  <div className="release-record-user-name">{user.employee_name || user.employee_id || '未知用戶'}</div>
                                  <div className="release-record-user-id">{user.employee_id || ''}</div>
                                </div>
                              </div>
                              <div className="release-record-user-department">
                                {user.department || '未知部門'}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          color: '#999', 
                          padding: '20px',
                          width: '100%'
                        }}>
                          目前沒有已讀員工
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🔥 未讀人數區域 */}
                  <div className="release-record-upload-announcement-setting-item">
                    <div className="release-record-read-header">
                      <div className="release-record-read-title-group">
                        <div className="release-record-read-label">未讀人數</div>
                        <div className="release-record-read-count">{readStatusData.unreadCount}</div>
                        <div className="release-record-read-unit">人</div>
                      </div>
                    </div>

                    <div className="release-record-read-users">
                      {readStatusData.unreadEmployees.length > 0 ? (
                        readStatusData.unreadEmployees.map((user, index) => (
                          <div key={`unread-${index}`} className="release-record-user-item">
                            <div className="release-record-user-content">
                              <div className="release-record-user-info">
                                <div className="release-record-user-avatar">
                                  <img src={portraitIcon} alt="員工頭像" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                                </div>
                                <div className="release-record-user-details">
                                  <div className="release-record-user-name">{user.employee_name || user.employee_id || '未知用戶'}</div>
                                  <div className="release-record-user-id">{user.employee_id || ''}</div>
                                </div>
                              </div>
                              <div className="release-record-user-department">
                                {user.department || '未知部門'}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          color: '#999', 
                          padding: '20px',
                          width: '100%'
                        }}>
                          所有員工都已閱讀
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '100px',
                  fontSize: '14px',
                  color: '#999'
                }}>
                  無閱讀狀態資料
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 顯示發布記錄列表
  return (
    <div className="release-record-content-area">
      {/* 表頭 */}
      <div className="release-record-header">
        <div className="release-record-header-date">發布日期</div>
        <div className="release-record-header-document">文號</div>
        <div className="release-record-header-title">標題</div>
        <div className="release-record-header-publisher">發布人</div>
      </div>

      {/* 公告列表 */}
      <div className="release-record-announcement-list">
        {releaseRecords.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            fontSize: '16px',
            color: '#999999'
          }}>
            目前沒有發布記錄
          </div>
        ) : (
          releaseRecords.map((record) => (
            <div key={record.id} className="release-record-item-frame">
              <div className="release-record-item">
                <div 
                  className="release-record-item-content"
                  onClick={() => handleRecordClick(record)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* 發布日期 */}
                  <div className="release-record-item-date">
                    {record.releaseDate}
                  </div>
                  
                  {/* 文號 */}
                  <div className="release-record-item-document">
                    {record.documentNumber}
                  </div>
                  
                  {/* 標題 */}
                  <div className="release-record-item-title">
                    {record.title}
                  </div>
                  
                  {/* 發布人 */}
                  <div className="release-record-item-publisher">
                    {record.publisher}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 捲軸 */}
      <div className="release-record-scrollbar"></div>
    </div>
  );
};

export default ReleaseRecord;
