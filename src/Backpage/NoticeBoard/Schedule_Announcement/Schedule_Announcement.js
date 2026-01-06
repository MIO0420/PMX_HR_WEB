// // // import React from 'react';
// // // import './Schedule_Announcement.css';

// // // const ScheduleAnnouncement = () => {
// // //   // 模擬排程公告資料
// // //   const scheduledAnnouncements = [
// // //     {
// // //       id: 1,
// // //       title: '中元節普渡祭拜活動',
// // //       scheduleDate: '08-26',
// // //       scheduleTime: '08:00',
// // //       period: 'PM',
// // //       creator: '管理員'
// // //     },
// // //     {
// // //       id: 2,
// // //       title: '員工健康檢查通知',
// // //       scheduleDate: '08-28',
// // //       scheduleTime: '09:30',
// // //       period: 'AM',
// // //       creator: '人事部'
// // //     },
// // //     {
// // //       id: 3,
// // //       title: '月度會議安排',
// // //       scheduleDate: '09-01',
// // //       scheduleTime: '02:00',
// // //       period: 'PM',
// // //       creator: '秘書室'
// // //     },
// // //     {
// // //       id: 4,
// // //       title: '系統維護公告',
// // //       scheduleDate: '09-05',
// // //       scheduleTime: '11:00',
// // //       period: 'PM',
// // //       creator: 'IT部門'
// // //     }
// // //   ];

// // //   return (
// // //     // 🔥 移除自己的主要內容容器，直接返回內容區域
// // //     <div className="schedule-announcement-content-area">
// // //       {/* 表頭 */}
// // //       <div className="schedule-announcement-header">
// // //         <div className="schedule-announcement-header-title">標題</div>
// // //         <div className="schedule-announcement-header-info">
// // //           <div className="schedule-announcement-header-date">排程日期</div>
// // //           <div className="schedule-announcement-header-creator">建立者</div>
// // //         </div>
// // //       </div>

// // //       {/* 公告列表 */}
// // //       <div className="schedule-announcement-list">
// // //         {scheduledAnnouncements.map((announcement) => (
// // //           <div key={announcement.id} className="schedule-announcement-item-frame">
// // //             <div className="schedule-announcement-item">
// // //               <div className="schedule-announcement-item-content">
// // //                 {/* 標題 */}
// // //                 <div className="schedule-announcement-item-title">
// // //                   {announcement.title}
// // //                 </div>
                
// // //                 {/* 右側資訊 */}
// // //                 <div className="schedule-announcement-item-info">
// // //                   {/* 日期 */}
// // //                   <div className="schedule-announcement-date-group">
// // //                     <div className="schedule-announcement-date">
// // //                       {announcement.scheduleDate}
// // //                     </div>
// // //                   </div>
                  
// // //                   {/* 時間 */}
// // //                   <div className="schedule-announcement-time-group">
// // //                     <div className="schedule-announcement-time">
// // //                       <div className="schedule-announcement-time-value">
// // //                         {announcement.scheduleTime}
// // //                       </div>
// // //                     </div>
// // //                     <div className="schedule-announcement-period">
// // //                       {announcement.period}
// // //                     </div>
// // //                   </div>
                  
// // //                   {/* 建立者 */}
// // //                   <div className="schedule-announcement-creator-group">
// // //                     <div className="schedule-announcement-creator">
// // //                       {announcement.creator}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* 捲軸 */}
// // //       <div className="schedule-announcement-scrollbar"></div>
// // //     </div>
// // //   );
// // // };

// // // export default ScheduleAnnouncement;
// // import React, { useState } from 'react';
// // import UploadAnnouncement from '../Upload_Announcement';
// // import './Schedule_Announcement.css';

// // const ScheduleAnnouncement = () => {
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [editingSchedule, setEditingSchedule] = useState(null);

// //   // 模擬排程公告資料 - 🔥 參考草稿的資料結構
// //   const [scheduledAnnouncements, setScheduledAnnouncements] = useState([
// //     {
// //       id: 1,
// //       title: '中元節普渡祭拜活動',
// //       content: '親愛的同仁大家早上好，中元節將至，公司將舉辦普渡祭拜活動...',
// //       createDate: '08-26', // 🔥 改為與草稿一致的欄位名稱
// //       createTime: '08:00',
// //       period: 'PM',
// //       creator: '管理員',
// //       attachments: [],
// //       images: [],
// //       schedulePublish: true,
// //       scheduleRemove: false,
// //       publishDateTime: '2024-08-26T20:00',
// //       removeDateTime: null
// //     },
// //     {
// //       id: 2,
// //       title: '員工健康檢查通知',
// //       content: '為關心同仁健康，公司安排年度健康檢查...',
// //       createDate: '08-28',
// //       createTime: '09:30',
// //       period: 'AM',
// //       creator: '人事部',
// //       attachments: [],
// //       images: [],
// //       schedulePublish: true,
// //       scheduleRemove: true,
// //       publishDateTime: '2024-08-28T09:30',
// //       removeDateTime: '2024-08-30T18:00'
// //     },
// //     {
// //       id: 3,
// //       title: '系統維護通知',
// //       content: '為提升系統效能，將進行系統維護...',
// //       createDate: '09-01',
// //       createTime: '11:00',
// //       period: 'PM',
// //       creator: 'IT部門',
// //       attachments: [],
// //       images: [],
// //       schedulePublish: true,
// //       scheduleRemove: true,
// //       publishDateTime: '2024-09-01T23:00',
// //       removeDateTime: '2024-09-02T06:00'
// //     },
// //     {
// //       id: 4,
// //       title: '月度會議通知',
// //       content: '本月份部門會議將於下週舉行...',
// //       createDate: '09-05',
// //       createTime: '02:00',
// //       period: 'PM',
// //       creator: '秘書室',
// //       attachments: [],
// //       images: [],
// //       schedulePublish: true,
// //       scheduleRemove: false,
// //       publishDateTime: '2024-09-05T14:00',
// //       removeDateTime: null
// //     }
// //   ]);

// //   // 🔥 完全參考草稿的處理編輯函數
// //   const handleEditSchedule = (schedule) => {
// //     setEditingSchedule(schedule);
// //     setIsEditMode(true);
// //   };

// //   // 🔥 完全參考草稿的儲存編輯函數
// //   const handleSaveEdit = (updatedData, isPublish = false) => {
// //     if (isPublish) {
// //       // 發布邏輯
// //       console.log('發布公告:', updatedData);
// //       // 從排程中移除
// //       setScheduledAnnouncements(scheduledAnnouncements.filter(s => s.id !== editingSchedule.id));
// //       alert('公告已發布！');
// //     } else {
// //       // 更新排程
// //       const currentDate = new Date();
// //       const updateDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
// //       const updateTime = currentDate.toTimeString().slice(0, 5);
      
// //       setScheduledAnnouncements(scheduledAnnouncements.map(s => 
// //         s.id === editingSchedule.id 
// //           ? { 
// //               ...s, 
// //               ...updatedData, 
// //               createDate: updateDate,
// //               createTime: updateTime,
// //               period: parseInt(updateTime.split(':')[0]) >= 12 ? 'PM' : 'AM'
// //             }
// //           : s
// //       ));
// //       alert('排程已更新！');
// //     }
    
// //     setIsEditMode(false);
// //     setEditingSchedule(null);
// //   };

// //   // 🔥 完全參考草稿的取消編輯函數
// //   const handleCancelEdit = () => {
// //     setIsEditMode(false);
// //     setEditingSchedule(null);
// //   };

// //   // 🔥 完全參考草稿的編輯模式判斷
// //   if (isEditMode && editingSchedule) {
// //     return (
// //       <div className="schedule-edit-mode-container">
// //         <UploadAnnouncement
// //           isEditMode={true}
// //           editData={editingSchedule}
// //           onSave={handleSaveEdit}
// //           onCancel={handleCancelEdit}
// //         />
// //       </div>
// //     );
// //   }

// //   // 🔥 完全參考草稿的返回結構
// //   return (
// //     <div className="schedule-announcement-content-area">
// //       {/* 表頭 - 🔥 參考草稿的表頭結構 */}
// //       <div className="schedule-announcement-header">
// //         <div className="schedule-announcement-header-title">標題</div>
// //         <div className="schedule-announcement-header-info">
// //           <div className="schedule-announcement-header-date">排程時間</div>
// //           <div className="schedule-announcement-header-creator">建立者</div>
// //         </div>
// //       </div>

// //       {/* 排程公告列表 - 🔥 參考草稿的列表結構 */}
// //       <div className="schedule-announcement-list">
// //         {scheduledAnnouncements.map((announcement) => (
// //           <div key={announcement.id} className="schedule-announcement-item-frame">
// //             <div 
// //               className="schedule-announcement-item"
// //               onClick={() => handleEditSchedule(announcement)} // 🔥 與草稿一樣的點擊事件
// //             >
// //               <div className="schedule-announcement-item-content">
// //                 {/* 標題 */}
// //                 <div className="schedule-announcement-item-title">
// //                   {announcement.title}
// //                 </div>
                
// //                 {/* 右側資訊 - 🔥 參考草稿的資訊結構 */}
// //                 <div className="schedule-announcement-item-info">
// //                   {/* 日期 */}
// //                   <div className="schedule-announcement-date-group">
// //                     <div className="schedule-announcement-date">
// //                       {announcement.createDate}
// //                     </div>
// //                   </div>
                  
// //                   {/* 時間 */}
// //                   <div className="schedule-announcement-time-group">
// //                     <div className="schedule-announcement-time">
// //                       <div className="schedule-announcement-time-value">
// //                         {announcement.createTime}
// //                       </div>
// //                     </div>
// //                     <div className="schedule-announcement-period">
// //                       {announcement.period}
// //                     </div>
// //                   </div>
                  
// //                   {/* 建立者 */}
// //                   <div className="schedule-announcement-creator-group">
// //                     <div className="schedule-announcement-creator">
// //                       {announcement.creator}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* 捲軸 */}
// //       <div className="schedule-announcement-scrollbar"></div>
// //     </div>
// //   );
// // };

// // export default ScheduleAnnouncement;
// import React, { useState, useEffect } from 'react';
// import UploadAnnouncement from '../Upload_Announcement';
// import './Schedule_Announcement.css';
// import { API_BASE_URL } from '../../../config';

// const ScheduleAnnouncement = () => {
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingSchedule, setEditingSchedule] = useState(null);
//   const [scheduledAnnouncements, setScheduledAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔥 從 cookies 獲取資料的輔助函數
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   // 🔥 格式化日期顯示 (MM-DD 格式)
//   const formatDateDisplay = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${month}-${day}`;
//   };

//   // 🔥 格式化時間顯示 (HH:MM 格式)
//   const formatTimeDisplay = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // 取 HH:MM 部分
//   };

//   // 🔥 判斷 AM/PM
//   const getPeriod = (timeString) => {
//     if (!timeString) return '';
//     const hour = parseInt(timeString.split(':')[0]);
//     return hour >= 12 ? 'PM' : 'AM';
//   };

//   // 🔥 查詢排程公告資料
//   const fetchScheduledAnnouncements = async () => {
//     try {
//       setLoading(true);
//       const companyId = getCookie('company_id');
      
//       if (!companyId) {
//         setError('無法獲取公司資訊，請重新登入！');
//         return;
//       }

//       // 🔥 查詢草稿狀態的公告（排程公告）
//       const response = await fetch(`${API_BASE_URL}/api/announcements?company_id=${companyId}&status=draft`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const result = await response.json();

//       if (response.ok && result.Status === 'Ok') {
//         // 🔥 轉換資料格式
//         const formattedAnnouncements = result.Data.announcements.map(announcement => ({
//           id: announcement.id,
//           document_number: announcement.document_number,
//           title: announcement.title,
//           content: announcement.content,
//           createDate: formatDateDisplay(announcement.publish_date),
//           createTime: formatTimeDisplay(announcement.publish_time),
//           period: getPeriod(announcement.publish_time),
//           creator: announcement.employee_id, // 🔥 使用 employee_id 作為建立者
//           company_id: announcement.company_id,
//           employee_id: announcement.employee_id,
//           publish_date: announcement.publish_date,
//           publish_time: announcement.publish_time,
//           end_date: announcement.end_date,
//           end_time: announcement.end_time,
//           status: announcement.status,
//           created_at: announcement.created_at,
//           updated_at: announcement.updated_at,
//           // 🔥 為編輯模式準備的資料
//           attachments: [],
//           images: [],
//           schedulePublish: true,
//           scheduleRemove: announcement.end_date && announcement.end_time ? true : false,
//           publishDateTime: announcement.publish_date && announcement.publish_time 
//             ? `${announcement.publish_date}T${announcement.publish_time}` 
//             : null,
//           removeDateTime: announcement.end_date && announcement.end_time 
//             ? `${announcement.end_date}T${announcement.end_time}` 
//             : null
//         }));

//         setScheduledAnnouncements(formattedAnnouncements);
//         setError(null);
//       } else {
//         setError(result.Msg || '查詢失敗');
//       }
//     } catch (error) {
//       console.error('查詢排程公告失敗:', error);
//       setError('網路錯誤，請稍後再試！');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 組件載入時查詢資料
//   useEffect(() => {
//     fetchScheduledAnnouncements();
//   }, []);

//   // 🔥 處理編輯排程
//   const handleEditSchedule = (schedule) => {
//     setEditingSchedule(schedule);
//     setIsEditMode(true);
//   };

//   // 🔥 處理儲存編輯
//   const handleSaveEdit = async (updatedData, isPublish = false) => {
//     try {
//       if (isPublish) {
//         // 🔥 發布邏輯 - 更新狀態為 published
//         const updateResponse = await fetch(`${API_BASE_URL}/api/announcements/${editingSchedule.id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             ...updatedData,
//             status: 'published'
//           })
//         });

//         if (updateResponse.ok) {
//           alert('公告已發布！');
//           // 重新載入資料
//           await fetchScheduledAnnouncements();
//         } else {
//           alert('發布失敗，請稍後再試！');
//         }
//       } else {
//         // 🔥 更新排程邏輯 - 保持 draft 狀態
//         const updateResponse = await fetch(`${API_BASE_URL}/api/announcements/${editingSchedule.id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             ...updatedData,
//             status: 'draft'
//           })
//         });

//         if (updateResponse.ok) {
//           alert('排程已更新！');
//           // 重新載入資料
//           await fetchScheduledAnnouncements();
//         } else {
//           alert('更新失敗，請稍後再試！');
//         }
//       }
//     } catch (error) {
//       console.error('儲存編輯失敗:', error);
//       alert('操作失敗，請稍後再試！');
//     }
    
//     setIsEditMode(false);
//     setEditingSchedule(null);
//   };

//   // 🔥 處理取消編輯
//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     setEditingSchedule(null);
//   };

//   // 🔥 編輯模式
//   if (isEditMode && editingSchedule) {
//     return (
//       <div className="schedule-edit-mode-container">
//         <UploadAnnouncement
//           isEditMode={true}
//           editData={editingSchedule}
//           onSave={handleSaveEdit}
//           onCancel={handleCancelEdit}
//         />
//       </div>
//     );
//   }

//   // 🔥 載入中狀態
//   if (loading) {
//     return (
//       <div className="schedule-announcement-content-area">
//         <div className="schedule-announcement-loading">
//           <div className="schedule-announcement-loading-text">載入中...</div>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 錯誤狀態
//   if (error) {
//     return (
//       <div className="schedule-announcement-content-area">
//         <div className="schedule-announcement-error">
//           <div className="schedule-announcement-error-text">{error}</div>
//           <button 
//             className="schedule-announcement-retry-button"
//             onClick={fetchScheduledAnnouncements}
//           >
//             重試
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 主要內容
//   return (
//     <div className="schedule-announcement-content-area">
//       {/* 表頭 */}
//       <div className="schedule-announcement-header">
//         <div className="schedule-announcement-header-title">標題</div>
//         <div className="schedule-announcement-header-info">
//           <div className="schedule-announcement-header-date">排程時間</div>
//           <div className="schedule-announcement-header-creator">建立者</div>
//         </div>
//       </div>

//       {/* 排程公告列表 */}
//       <div className="schedule-announcement-list">
//         {scheduledAnnouncements.length === 0 ? (
//           <div className="schedule-announcement-empty">
//             <div className="schedule-announcement-empty-text">目前沒有排程公告</div>
//           </div>
//         ) : (
//           scheduledAnnouncements.map((announcement) => (
//             <div key={announcement.id} className="schedule-announcement-item-frame">
//               <div 
//                 className="schedule-announcement-item"
//                 onClick={() => handleEditSchedule(announcement)}
//               >
//                 <div className="schedule-announcement-item-content">
//                   {/* 標題 */}
//                   <div className="schedule-announcement-item-title">
//                     {announcement.title}
//                   </div>
                  
//                   {/* 右側資訊 */}
//                   <div className="schedule-announcement-item-info">
//                     {/* 日期 */}
//                     <div className="schedule-announcement-date-group">
//                       <div className="schedule-announcement-date">
//                         {announcement.createDate}
//                       </div>
//                     </div>
                    
//                     {/* 時間 */}
//                     <div className="schedule-announcement-time-group">
//                       <div className="schedule-announcement-time">
//                         <div className="schedule-announcement-time-value">
//                           {announcement.createTime}
//                         </div>
//                       </div>
//                       <div className="schedule-announcement-period">
//                         {announcement.period}
//                       </div>
//                     </div>
                    
//                     {/* 建立者 */}
//                     <div className="schedule-announcement-creator-group">
//                       <div className="schedule-announcement-creator">
//                         {announcement.creator}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* 捲軸 */}
//       <div className="schedule-announcement-scrollbar"></div>
//     </div>
//   );
// };

// export default ScheduleAnnouncement;
import React, { useState, useEffect, useRef } from 'react';
import UploadAnnouncement from '../Upload_Announcement';
import './Schedule_Announcement.css';
import { API_BASE_URL } from '../../../config';

const ScheduleAnnouncement = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduledAnnouncements, setScheduledAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false);

  // 🔥 從 cookies 獲取資料的輔助函數
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // 🔥 格式化日期顯示 (MM-DD 格式)
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };

  // 🔥 格式化時間顯示 (HH:MM 格式)
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // 取 HH:MM 部分
  };

  // 🔥 判斷 AM/PM
  const getPeriod = (timeString) => {
    if (!timeString) return '';
    const hour = parseInt(timeString.split(':')[0]);
    return hour >= 12 ? 'PM' : 'AM';
  };

  // 🔥 查詢已發布公告資料 - 改為 status: 'published'
  const fetchScheduledAnnouncements = async () => {
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

      console.log('🔥 開始查詢已發布公告，公司ID:', companyId);

      // 🔥 修改查詢條件：status=published
      const response = await fetch(`${API_BASE_URL}/api/announcements?company_id=${companyId}&status=published&_t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log('🔥 API 回應:', result);

      if (response.ok && result.Status === 'Ok') {
        console.log('🔥 查詢到的已發布公告數量:', result.Data.announcements.length);
        console.log('🔥 公告詳細資料:', result.Data.announcements);

        // 🔥 轉換資料格式
        const formattedAnnouncements = result.Data.announcements.map(announcement => {
          console.log('🔥 處理公告:', announcement.document_number, 'status:', announcement.status);
          return {
            id: announcement.id,
            document_number: announcement.document_number,
            title: announcement.title,
            content: announcement.content,
            createDate: formatDateDisplay(announcement.publish_date),
            createTime: formatTimeDisplay(announcement.publish_time),
            period: getPeriod(announcement.publish_time),
            creator: announcement.employee_id, // 🔥 使用 employee_id 作為建立者
            company_id: announcement.company_id,
            employee_id: announcement.employee_id,
            publish_date: announcement.publish_date,
            publish_time: announcement.publish_time,
            end_date: announcement.end_date,
            end_time: announcement.end_time,
            status: announcement.status,
            created_at: announcement.created_at,
            updated_at: announcement.updated_at,
            // 🔥 為編輯模式準備的資料
            attachments: [],
            images: [],
            schedulePublish: false, // 🔥 已發布的公告不是排程狀態
            scheduleRemove: announcement.end_date && announcement.end_time ? true : false,
            publishDateTime: announcement.publish_date && announcement.publish_time 
              ? `${announcement.publish_date}T${announcement.publish_time}` 
              : null,
            removeDateTime: announcement.end_date && announcement.end_time 
              ? `${announcement.end_date}T${announcement.end_time}` 
              : null
          };
        });

        console.log('🔥 格式化後的公告數量:', formattedAnnouncements.length);
        setScheduledAnnouncements(formattedAnnouncements);
        setError(null);
      } else {
        setError(result.Msg || '查詢失敗');
      }
    } catch (error) {
      console.error('查詢已發布公告失敗:', error);
      setError('網路錯誤，請稍後再試！');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // 🔥 組件載入時查詢資料
  useEffect(() => {
    fetchScheduledAnnouncements();
  }, []);

  // 🔥 處理編輯已發布公告
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsEditMode(true);
  };

  // 🔥 處理儲存編輯
  const handleSaveEdit = async (updatedData, isPublish = false) => {
    try {
      // 🔥 更新已發布公告
      const updateResponse = await fetch(`${API_BASE_URL}/api/announcements/${editingSchedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedData,
          status: 'published' // 🔥 保持已發布狀態
        })
      });

      if (updateResponse.ok) {
        alert('公告已更新！');
        // 重新載入資料
        await fetchScheduledAnnouncements();
      } else {
        alert('更新失敗，請稍後再試！');
      }
    } catch (error) {
      console.error('儲存編輯失敗:', error);
      alert('操作失敗，請稍後再試！');
    }
    
    setIsEditMode(false);
    setEditingSchedule(null);
  };

  // 🔥 處理取消編輯
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingSchedule(null);
  };

// 🔥 編輯模式時傳入 readOnly={true}
if (isEditMode && editingSchedule) {
  return (
    <div className="schedule-edit-mode-container">
      <UploadAnnouncement
        isEditMode={true}
        editData={editingSchedule}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        hideBottomButtons={true} // 🔥 隱藏底部按鈕
        readOnly={true} // 🔥 設定為只讀模式
      />
    </div>
  );
}


  // 🔥 載入中狀態
  if (loading) {
    return (
      <div className="schedule-announcement-content-area">
        <div className="schedule-announcement-loading">
          <div className="schedule-announcement-loading-text">載入中...</div>
        </div>
      </div>
    );
  }

  // 🔥 錯誤狀態
  if (error) {
    return (
      <div className="schedule-announcement-content-area">
        <div className="schedule-announcement-error">
          <div className="schedule-announcement-error-text">{error}</div>
          <button 
            className="schedule-announcement-retry-button"
            onClick={fetchScheduledAnnouncements}
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  // 🔥 主要內容
  return (
    <div className="schedule-announcement-content-area">
      {/* 表頭 - 🔥 修改標題 */}
      <div className="schedule-announcement-header">
        <div className="schedule-announcement-header-title">標題</div>
        <div className="schedule-announcement-header-info">
          <div className="schedule-announcement-header-date">發布時間</div> {/* 🔥 改為發布時間 */}
          <div className="schedule-announcement-header-creator">建立者</div>
        </div>
      </div>

      {/* 已發布公告列表 */}
      <div className="schedule-announcement-list">
        {scheduledAnnouncements.length === 0 ? (
          <div className="schedule-announcement-empty">
            <div className="schedule-announcement-empty-text">目前沒有已發布公告</div> {/* 🔥 修改提示文字 */}
          </div>
        ) : (
          scheduledAnnouncements.map((announcement) => (
            <div key={announcement.id} className="schedule-announcement-item-frame">
              <div 
                className="schedule-announcement-item"
                onClick={() => handleEditSchedule(announcement)}
              >
                <div className="schedule-announcement-item-content">
                  {/* 標題 */}
                  <div className="schedule-announcement-item-title">
                    {announcement.title}
                  </div>
                  
                  {/* 右側資訊 */}
                  <div className="schedule-announcement-item-info">
                    {/* 日期 */}
                    <div className="schedule-announcement-date-group">
                      <div className="schedule-announcement-date">
                        {announcement.createDate}
                      </div>
                    </div>
                    
                    {/* 時間 */}
                    <div className="schedule-announcement-time-group">
                      <div className="schedule-announcement-time">
                        <div className="schedule-announcement-time-value">
                          {announcement.createTime}
                        </div>
                      </div>
                      <div className="schedule-announcement-period">
                        {announcement.period}
                      </div>
                    </div>
                    
                    {/* 建立者 */}
                    <div className="schedule-announcement-creator-group">
                      <div className="schedule-announcement-creator">
                        {announcement.creator}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 捲軸 */}
      <div className="schedule-announcement-scrollbar"></div>
    </div>
  );
};

export default ScheduleAnnouncement;
