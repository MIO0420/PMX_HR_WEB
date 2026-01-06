// // import React, { useState, useRef, useEffect } from 'react';
// // import Sidebar from '../Sidebar';
// // import './Upload_Announcement.css';
// // import ScheduleAnnouncement from './Schedule_Announcement/Schedule_Announcement';
// // import Draft from './Draft/Draft';
// // import Release_Record from './Release_Record/Release_Record';

// // // 🔥 引入 API_BASE_URL
// // import { API_BASE_URL } from '../../config';

// // // 引入圖標
// // import newAnnouncementIcon from '../ICON/New_Announcement.png';
// // import scheduleAnnouncementIcon from '../ICON/Schedule_Announcement.png';
// // import draftIcon from '../ICON/Draft.png';
// // import listIcon from '../ICON/List.png';
// // import uploadAttachmentsIcon from '../ICON/Upload_attachments.png';
// // import uploadPhotosIcon from '../ICON/Upload_photos.png';
// // import uploadedPhotosIcon from '../ICON/Uploaded_photos.png';
// // import uploadedAttachmentsIcon from '../ICON/Uploaded_attachments.png';
// // import trashIcon from '../ICON/tabler_trash.png';
// // import { TimePickerInput } from './SamllitemsForNot/Clock';
// // import CalendarSelector from './SamllitemsForNot/Calendar Selector';

// // // 🔥 新增 readOnly 參數
// // const UploadAnnouncement = ({ 
// //   editData = null, 
// //   isEditMode = false, 
// //   onSave = null, 
// //   onCancel = null, 
// //   hideBottomButtons = false,
// //   readOnly = false // 🔥 新增：只讀模式
// // }) => {
// //   const [activeTab, setActiveTab] = useState('create');
// //   const [title, setTitle] = useState('');
// //   const [content, setContent] = useState('');
// //   const [attachments, setAttachments] = useState([]);
// //   const [images, setImages] = useState([]);
// //   const [schedulePublish, setSchedulePublish] = useState(false);
// //   const [scheduleRemove, setScheduleRemove] = useState(false);
  
// //   // 🔥 修改：分別管理日期和時間
// //   const [publishDate, setPublishDate] = useState(null); // 改為 Date 對象
// //   const [publishTime, setPublishTime] = useState('');
// //   const [removeDate, setRemoveDate] = useState(null); // 改為 Date 對象
// //   const [removeTime, setRemoveTime] = useState('');
  
// //   // 🔥 新增：日曆選擇器顯示狀態
// //   const [showPublishCalendar, setShowPublishCalendar] = useState(false);
// //   const [showRemoveCalendar, setShowRemoveCalendar] = useState(false);
  
// //   const attachmentInputRef = useRef(null);
// //   const imageInputRef = useRef(null);

// //   // 🔥 新增：從 cookies 獲取資料的輔助函數
// //   const getCookie = (name) => {
// //     const value = `; ${document.cookie}`;
// //     const parts = value.split(`; ${name}=`);
// //     if (parts.length === 2) return parts.pop().split(';').shift();
// //     return null;
// //   };
// //   // 🔥 新增：處理更新草稿
// // const handleUpdateDraft = async () => {
// //   if (!title.trim()) {
// //     alert('請輸入公告標題！');
// //     return;
// //   }

// //   try {
// //     const currentDateTime = getCurrentDateTime();
// //     const updateData = {
// //       title: title.trim(),
// //       content: content.trim(),
// //       publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
// //       publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
// //       ...(scheduleRemove && removeDate && removeTime && {
// //         end_date: formatDate(removeDate),
// //         end_time: formatTime(removeTime)
// //       }),
// //       status: 'draft' // 🔥 更新草稿保持 draft 狀態
// //     };

// //     console.log('準備更新的草稿資料:', updateData);

// //     // 🔥 使用 PUT API 更新草稿
// //     const response = await fetch(`${API_BASE_URL}/api/announcements/${editData.id}`, {
// //       method: 'PUT',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(updateData)
// //     });

// //     const result = await response.json();

// //     if (response.ok && result.Status === 'Ok') {
// //       console.log('草稿更新成功:', result);
// //       alert('草稿已更新！');

// //       if (isEditMode && onSave) {
// //         onSave(result.Data, false);
// //       }

// //     } else {
// //       console.error('草稿更新失敗:', result);
// //       alert(`更新失敗：${result.Msg || '未知錯誤'}`);
// //     }

// //   } catch (error) {
// //     console.error('更新草稿時發生錯誤:', error);
// //     alert('更新失敗：網路錯誤，請稍後再試！');
// //   }
// // };

// // // 🔥 新增：處理更新並發布
// // const handleUpdateAndPublish = async () => {
// //   if (!title.trim()) {
// //     alert('請輸入公告標題！');
// //     return;
// //   }
// //   if (!content.trim()) {
// //     alert('請輸入公告內容！');
// //     return;
// //   }
  
// //   // 驗證排程時間
// //   if (schedulePublish) {
// //     if (!publishDate || !publishTime) {
// //       alert('請選擇完整的發布日期和時間！');
// //       return;
// //     }
    
// //     const publishDateTime = combineDateTime(publishDate, publishTime);
// //     const selectedTime = new Date(publishDateTime);
// //     const currentTime = new Date();
    
// //     if (selectedTime <= currentTime) {
// //       alert('發布時間必須晚於目前時間！');
// //       return;
// //     }
// //   }

// //   // 驗證下架時間
// //   if (scheduleRemove) {
// //     if (!removeDate || !removeTime) {
// //       alert('請選擇完整的下架日期和時間！');
// //       return;
// //     }
    
// //     const removeDateTime = combineDateTime(removeDate, removeTime);
// //     const publishDateTime = schedulePublish ? combineDateTime(publishDate, publishTime) : new Date().toISOString();
// //     const removeTimeObj = new Date(removeDateTime);
// //     const publishTimeObj = new Date(publishDateTime);
    
// //     if (removeTimeObj <= publishTimeObj) {
// //       alert('下架時間必須晚於發布時間！');
// //       return;
// //     }
// //   }

// //   try {
// //     const currentDateTime = getCurrentDateTime();
// //     const updateData = {
// //       title: title.trim(),
// //       content: content.trim(),
// //       publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
// //       publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
// //       ...(scheduleRemove && removeDate && removeTime && {
// //         end_date: formatDate(removeDate),
// //         end_time: formatTime(removeTime)
// //       }),
// //       status: 'published' // 🔥 更新並發布改為 published 狀態
// //     };

// //     console.log('準備更新並發布的資料:', updateData);

// //     // 🔥 使用 PUT API 更新並發布
// //     const response = await fetch(`${API_BASE_URL}/api/announcements/${editData.id}`, {
// //       method: 'PUT',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(updateData)
// //     });

// //     const result = await response.json();

// //     if (response.ok && result.Status === 'Ok') {
// //       console.log('公告更新並發布成功:', result);
      
// //       if (schedulePublish) {
// //         alert(`公告已排程於 ${formatDate(publishDate)} ${publishTime} 發布！`);
// //       } else {
// //         alert('公告已立即發布！');
// //       }

// //       if (isEditMode && onSave) {
// //         onSave(result.Data, true);
// //       }

// //     } else {
// //       console.error('API 錯誤:', result);
// //       alert(`發布失敗：${result.Msg || '未知錯誤'}`);
// //     }

// //   } catch (error) {
// //     console.error('更新並發布公告時發生錯誤:', error);
// //     alert('發布失敗：網路錯誤，請稍後再試！');
// //   }
// // };


// //   // 🔥 新增：生成公告編號的函數
// //   const generateDocumentNumber = () => {
// //     const now = new Date();
// //     const year = now.getFullYear();
// //     const month = (now.getMonth() + 1).toString().padStart(2, '0');
// //     const day = now.getDate().toString().padStart(2, '0');
// //     const timestamp = now.getTime().toString().slice(-6); // 取時間戳後6位
// //     return `ANN-${year}${month}${day}-${timestamp}`;
// //   };

// //   // 🔥 新增：格式化日期為 YYYY-MM-DD 格式
// //   const formatDate = (date) => {
// //     if (!date) return null;
// //     const year = date.getFullYear();
// //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
// //     const day = date.getDate().toString().padStart(2, '0');
// //     return `${year}-${month}-${day}`;
// //   };

// //   // 🔥 新增：格式化時間為 HH:MM:SS 格式
// //   const formatTime = (timeString) => {
// //     if (!timeString) return null;
// //     // 如果時間格式是 HH:MM，補上秒數
// //     if (timeString.length === 5) {
// //       return `${timeString}:00`;
// //     }
// //     return timeString;
// //   };

// //   // 🔥 新增：獲取當前日期和時間
// //   const getCurrentDateTime = () => {
// //     const now = new Date();
// //     const date = formatDate(now);
// //     const time = now.toTimeString().split(' ')[0]; // HH:MM:SS 格式
// //     return { date, time };
// //   };

// //   // 🔥 新增：編輯模式初始化
// //   useEffect(() => {
// //     if (isEditMode && editData) {
// //       setTitle(editData.title || '');
// //       setContent(editData.content || '');
// //       setAttachments(editData.attachments || []);
// //       setImages(editData.images || []);
// //       setSchedulePublish(editData.schedulePublish || false);
// //       setScheduleRemove(editData.scheduleRemove || false);
      
// //       // 處理日期時間
// //       if (editData.publishDateTime) {
// //         const publishDate = new Date(editData.publishDateTime);
// //         setPublishDate(publishDate);
// //         setPublishTime(publishDate.toTimeString().slice(0, 5));
// //       }
      
// //       if (editData.removeDateTime) {
// //         const removeDate = new Date(editData.removeDateTime);
// //         setRemoveDate(removeDate);
// //         setRemoveTime(removeDate.toTimeString().slice(0, 5));
// //       }
// //     }
// //   }, [isEditMode, editData]);

// //   // 🔥 新增：組合日期和時間的輔助函數
// //   const combineDateTime = (dateObj, time) => {
// //     if (!dateObj || !time) return '';
// //     const year = dateObj.getFullYear();
// //     const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
// //     const day = dateObj.getDate().toString().padStart(2, '0');
// //     return `${year}-${month}-${day}T${time}`;
// //   };

// //   // 🔥 新增：格式化日期顯示
// //   const formatDateDisplay = (dateObj) => {
// //     if (!dateObj) {
// //       return {
// //         year: '2024',
// //         month: '8',
// //         day: '26'
// //       };
// //     }
    
// //     return {
// //       year: dateObj.getFullYear().toString(),
// //       month: (dateObj.getMonth() + 1).toString(),
// //       day: dateObj.getDate().toString()
// //     };
// //   };

// //   // 處理標籤切換
// //   const handleTabClick = (tab) => {
// //     setActiveTab(tab);
// //   };

// //   // 🔥 修改：處理標題輸入 - 只讀模式禁用
// //   const handleTitleChange = (e) => {
// //     if (readOnly) return;
// //     const value = e.target.value;
// //     if (value.length <= 36) {
// //       setTitle(value);
// //     }
// //   };

// //   // 🔥 修改：處理內容輸入 - 只讀模式禁用
// //   const handleContentChange = (e) => {
// //     if (readOnly) return;
// //     const value = e.target.value;
// //     if (value.length <= 800) {
// //       setContent(value);
// //     }
// //   };

// //   // 🔥 修改：處理附件上傳 - 只讀模式禁用
// //   const handleAttachmentUpload = (e) => {
// //     if (readOnly) return;
// //     const files = Array.from(e.target.files);
// //     if (attachments.length + images.length + files.length <= 12) {
// //       const newAttachments = files.map(file => ({
// //         id: Date.now() + Math.random(),
// //         name: file.name,
// //         file: file,
// //         type: 'attachment'
// //       }));
// //       setAttachments([...attachments, ...newAttachments]);
// //     }
// //   };

// //   // 🔥 修改：處理圖片上傳 - 只讀模式禁用
// //   const handleImageUpload = (e) => {
// //     if (readOnly) return;
// //     const files = Array.from(e.target.files);
// //     if (attachments.length + images.length + files.length <= 12) {
// //       const newImages = files.map(file => ({
// //         id: Date.now() + Math.random(),
// //         name: file.name,
// //         file: file,
// //         type: 'image',
// //         url: URL.createObjectURL(file)
// //       }));
// //       setImages([...images, ...newImages]);
// //     }
// //   };

// //   // 🔥 修改：刪除附件 - 只讀模式禁用
// //   const handleDeleteAttachment = (id) => {
// //     if (readOnly) return;
// //     setAttachments(attachments.filter(item => item.id !== id));
// //   };

// //   // 🔥 修改：刪除圖片 - 只讀模式禁用
// //   const handleDeleteImage = (id) => {
// //     if (readOnly) return;
// //     const imageToDelete = images.find(img => img.id === id);
// //     if (imageToDelete) {
// //       URL.revokeObjectURL(imageToDelete.url);
// //     }
// //     setImages(images.filter(item => item.id !== id));
// //   };

// //   // 🔥 修改：處理排程發布切換 - 只讀模式禁用
// //   const handleSchedulePublishToggle = () => {
// //     if (readOnly) return;
// //     setSchedulePublish(!schedulePublish);
// //     if (schedulePublish) {
// //       setPublishDate(null);
// //       setPublishTime('');
// //     }
// //   };

// //   // 🔥 修改：處理排程下架切換 - 只讀模式禁用
// //   const handleScheduleRemoveToggle = () => {
// //     if (readOnly) return;
// //     setScheduleRemove(!scheduleRemove);
// //     if (scheduleRemove) {
// //       setRemoveDate(null);
// //       setRemoveTime('');
// //     }
// //   };

// //   // 🔥 修改：處理日期選擇 - 只讀模式禁用
// //   const handlePublishDateSelect = (date) => {
// //     if (readOnly) return;
// //     setPublishDate(date);
// //     setShowPublishCalendar(false);
// //   };

// //   const handleRemoveDateSelect = (date) => {
// //     if (readOnly) return;
// //     setRemoveDate(date);
// //     setShowRemoveCalendar(false);
// //   };

// //   // 🔥 修改：處理日期點擊 - 只讀模式禁用
// //   const handlePublishDateClick = () => {
// //     if (readOnly) return;
// //     setShowPublishCalendar(true);
// //   };

// //   const handleRemoveDateClick = () => {
// //     if (readOnly) return;
// //     setShowRemoveCalendar(true);
// //   };

// //   // 🔥 修改：處理取消
// //   const handleCancel = () => {
// //     if (isEditMode && onCancel) {
// //       onCancel();
// //       return;
// //     }
    
// //     if (window.confirm('確定要捨棄目前的編輯內容嗎？')) {
// //       setTitle('');
// //       setContent('');
// //       setAttachments([]);
// //       setImages([]);
// //       setSchedulePublish(false);
// //       setScheduleRemove(false);
// //       setPublishDate(null);
// //       setPublishTime('');
// //       setRemoveDate(null);
// //       setRemoveTime('');
// //     }
// //   };

// //   // 🔥 修改：處理儲存草稿 - status 設為 'draft'
// //   const handleSaveDraft = async () => {
// //     if (!title.trim()) {
// //       alert('請輸入公告標題！');
// //       return;
// //     }

// //     try {
// //       const companyId = getCookie('company_id');
// //       const employeeId = getCookie('employee_id');
      
// //       if (!companyId || !employeeId) {
// //         alert('無法獲取用戶資訊，請重新登入！');
// //         return;
// //       }

// //       const currentDateTime = getCurrentDateTime();
// //       const draftData = {
// //         document_number: generateDocumentNumber(),
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         title: title.trim(),
// //         content: content.trim(),
// //         publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
// //         publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
// //         ...(scheduleRemove && removeDate && removeTime && {
// //           end_date: formatDate(removeDate),
// //           end_time: formatTime(removeTime)
// //         }),
// //         status: 'draft' // 🔥 儲存草稿按鈕 → status: 'draft'
// //       };

// //       console.log('準備儲存的草稿資料:', draftData);

// //       // 🔥 使用 config 中的 API_BASE_URL
// //       const response = await fetch(`${API_BASE_URL}/api/announcements`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(draftData)
// //       });

// //       const result = await response.json();

// //       if (response.ok && result.Status === 'Ok') {
// //         console.log('草稿儲存成功:', result);
// //         alert('草稿已儲存！');

// //         if (isEditMode && onSave) {
// //           onSave(result.Data, false);
// //         }

// //       } else {
// //         console.error('草稿儲存失敗:', result);
// //         alert(`儲存失敗：${result.Msg || '未知錯誤'}`);
// //       }

// //     } catch (error) {
// //       console.error('儲存草稿時發生錯誤:', error);
// //       alert('儲存失敗：網路錯誤，請稍後再試！');
// //     }
// //   };

// //   // 🔥 修改：處理發布 - status 設為 'published'
// //   const handlePublish = async () => {
// //     if (!title.trim()) {
// //       alert('請輸入公告標題！');
// //       return;
// //     }
// //     if (!content.trim()) {
// //       alert('請輸入公告內容！');
// //       return;
// //     }
    
// //     // 驗證排程時間
// //     if (schedulePublish) {
// //       if (!publishDate || !publishTime) {
// //         alert('請選擇完整的發布日期和時間！');
// //         return;
// //       }
      
// //       const publishDateTime = combineDateTime(publishDate, publishTime);
// //       const selectedTime = new Date(publishDateTime);
// //       const currentTime = new Date();
      
// //       if (selectedTime <= currentTime) {
// //         alert('發布時間必須晚於目前時間！');
// //         return;
// //       }
// //     }

// //     // 驗證下架時間
// //     if (scheduleRemove) {
// //       if (!removeDate || !removeTime) {
// //         alert('請選擇完整的下架日期和時間！');
// //         return;
// //       }
      
// //       const removeDateTime = combineDateTime(removeDate, removeTime);
// //       const publishDateTime = schedulePublish ? combineDateTime(publishDate, publishTime) : new Date().toISOString();
// //       const removeTimeObj = new Date(removeDateTime);
// //       const publishTimeObj = new Date(publishDateTime);
      
// //       if (removeTimeObj <= publishTimeObj) {
// //         alert('下架時間必須晚於發布時間！');
// //         return;
// //       }
// //     }

// //     try {
// //       const companyId = getCookie('company_id');
// //       const employeeId = getCookie('employee_id');
      
// //       if (!companyId || !employeeId) {
// //         alert('無法獲取用戶資訊，請重新登入！');
// //         return;
// //       }

// //       const currentDateTime = getCurrentDateTime();
// //       const apiData = {
// //         document_number: generateDocumentNumber(),
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         title: title.trim(),
// //         content: content.trim(),
// //         publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
// //         publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
// //         ...(scheduleRemove && removeDate && removeTime && {
// //           end_date: formatDate(removeDate),
// //           end_time: formatTime(removeTime)
// //         }),
// //         status: 'published' // 🔥 完成按鈕 → status: 'published'
// //       };

// //       console.log('準備發送的 API 資料:', apiData);

// //       // 🔥 使用 config 中的 API_BASE_URL
// //       const response = await fetch(`${API_BASE_URL}/api/announcements`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(apiData)
// //       });

// //       const result = await response.json();

// //       if (response.ok && result.Status === 'Ok') {
// //         console.log('公告創建成功:', result);
        
// //         if (schedulePublish) {
// //           alert(`公告已排程於 ${formatDate(publishDate)} ${publishTime} 發布！`);
// //         } else {
// //           alert('公告已立即發布！');
// //         }

// //         // 清空表單
// //         setTitle('');
// //         setContent('');
// //         setAttachments([]);
// //         setImages([]);
// //         setSchedulePublish(false);
// //         setScheduleRemove(false);
// //         setPublishDate(null);
// //         setPublishTime('');
// //         setRemoveDate(null);
// //         setRemoveTime('');

// //         if (isEditMode && onSave) {
// //           onSave(result.Data, true);
// //         }

// //       } else {
// //         console.error('API 錯誤:', result);
// //         alert(`發布失敗：${result.Msg || '未知錯誤'}`);
// //       }

// //     } catch (error) {
// //       console.error('發布公告時發生錯誤:', error);
// //       alert('發布失敗：網路錯誤，請稍後再試！');
// //     }
// //   };

// //   // 🔥 修改：渲染建立新公告內容
// //   const renderCreateContent = () => {
// //     const publishDisplayTime = formatDateDisplay(publishDate);
// //     const removeDisplayTime = formatDateDisplay(removeDate);

// //     return (
// //       <div className="upload-announcement-content-frame">
// //         {/* 🔥 新增：只讀模式標題 */}
// //         {isEditMode && readOnly && (
// //           <div className="upload-announcement-readonly-header">
// //             <h3 style={{ 
// //               color: '#666', 
// //               marginBottom: '20px', 
// //               fontSize: '18px',
// //               fontWeight: 'normal'
// //             }}>
// //               查看公告內容
// //             </h3>
// //           </div>
// //         )}

// //         {/* 主編輯區域 */}
// //         <div className="upload-announcement-main-edit-area">
// //           <div className="upload-announcement-edit-content-container">
// //             {/* 文字編輯區域 */}
// //             <div className="upload-announcement-text-edit-area">
// //               {/* 標題區域 */}
// //               <div className="upload-announcement-title-frame">
// //                 <input
// //                   type="text"
// //                   className="upload-announcement-title-input"
// //                   placeholder="中元節普渡祭拜活動"
// //                   value={title}
// //                   onChange={handleTitleChange}
// //                   readOnly={readOnly} // 🔥 根據 readOnly 設定是否可編輯
// //                   style={readOnly ? { 
// //                     // backgroundColor: '#f5f5f5', 
// //                     cursor: 'default',
// //                     // border: '1px solid #e0e0e0'
// //                   } : {}}
// //                 />
// //                 {/* 🔥 只讀模式不顯示字數限制警告 */}
// //                 {!readOnly && (
// //                   <div className={`upload-announcement-title-limit-warning ${title.length > 30 ? 'show' : ''}`}>
// //                     標題上限36個字！
// //                   </div>
// //                 )}
// //               </div>
              
// //               {/* 內文區域 */}
// //               <div className="upload-announcement-content-text-frame">
// //                 <textarea
// //                   className="upload-announcement-content-textarea"
// //                   placeholder="寫點內容吧......"
// //                   value={content}
// //                   onChange={handleContentChange}
// //                   readOnly={readOnly} // 🔥 根據 readOnly 設定是否可編輯
// //                   style={readOnly ? { 
// //                     // backgroundColor: '#f5f5f5', 
// //                     cursor: 'default',
// //                     // border: '1px solid #e0e0e0',
// //                     resize: 'none'
// //                   } : {}}
// //                 />
// //                 {/* 🔥 只讀模式不顯示字數限制警告 */}
// //                 {!readOnly && (
// //                   <div className={`upload-announcement-content-limit-warning ${content.length > 700 ? 'show' : ''}`}>
// //                     內文上限800字！
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* 🔥 修改：附件上傳區域 - 只讀模式隱藏上傳按鈕 */}
// //             <div className="upload-announcement-attachment-area">
// //               {/* 🔥 只讀模式不顯示上傳按鈕 */}
// //               {!readOnly && (
// //                 <>
// //                   {/* 上傳附件按鈕 */}
// //                   <button className="upload-announcement-upload-button" onClick={() => attachmentInputRef.current?.click()}>
// //                     <div className="upload-announcement-upload-border"></div>
// //                     <div className="upload-announcement-upload-icon">
// //                       <img 
// //                         src={uploadAttachmentsIcon} 
// //                         alt="上傳附件" 
// //                         className="upload-announcement-upload-icon-image"
// //                       />
// //                     </div>
// //                     <div className="upload-announcement-upload-text">上傳附件</div>
// //                   </button>

// //                   {/* 上傳圖片按鈕 */}
// //                   <button className="upload-announcement-upload-button" onClick={() => imageInputRef.current?.click()}>
// //                     <div className="upload-announcement-upload-border"></div>
// //                     <div className="upload-announcement-upload-icon">
// //                       <img 
// //                         src={uploadPhotosIcon} 
// //                         alt="上傳圖片" 
// //                         className="upload-announcement-upload-icon-image"
// //                       />
// //                     </div>
// //                     <div className="upload-announcement-upload-text">上傳圖片</div>
// //                   </button>
// //                 </>
// //               )}

// //               {/* 🔥 修改：顯示已上傳的附件 - 只讀模式移除刪除按鈕 */}
// //               {attachments.map((attachment) => (
// //                 <div key={attachment.id} className="upload-announcement-uploaded-item attachment">
// //                   {/* 🔥 只讀模式不顯示刪除按鈕 */}
// //                   {!readOnly && (
// //                     <button 
// //                       className="upload-announcement-delete-button" 
// //                       onClick={() => handleDeleteAttachment(attachment.id)}
// //                     >
// //                       <img 
// //                         src={trashIcon} 
// //                         alt="刪除" 
// //                         className="upload-announcement-delete-icon"
// //                       />
// //                     </button>
// //                   )}
// //                   <div className="upload-announcement-uploaded-icon">
// //                     <img 
// //                       src={uploadedAttachmentsIcon} 
// //                       alt="已上傳附件" 
// //                       className="upload-announcement-uploaded-icon-image"
// //                     />
// //                   </div>
// //                   <div className="upload-announcement-uploaded-name">
// //                     {attachment.name}
// //                   </div>
// //                 </div>
// //               ))}

// //               {/* 🔥 修改：顯示已上傳的圖片 - 只讀模式移除刪除按鈕 */}
// //               {images.map((image) => (
// //                 <div key={image.id} className="upload-announcement-uploaded-item image">
// //                   {/* 🔥 只讀模式不顯示刪除按鈕 */}
// //                   {!readOnly && (
// //                     <button 
// //                       className="upload-announcement-delete-button" 
// //                       onClick={() => handleDeleteImage(image.id)}
// //                     >
// //                       <img 
// //                         src={trashIcon} 
// //                         alt="刪除" 
// //                         className="upload-announcement-delete-icon"
// //                       />
// //                     </button>
// //                   )}
// //                   <div className="upload-announcement-uploaded-icon">
// //                     <img 
// //                       src={uploadedPhotosIcon} 
// //                       alt="已上傳照片" 
// //                       className="upload-announcement-uploaded-icon-image"
// //                     />
// //                   </div>
// //                   <div className="upload-announcement-uploaded-name">
// //                     {image.name}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* 🔥 只讀模式不顯示附件數量限制提示 */}
// //             {!readOnly && (
// //               <div className={`upload-announcement-attachment-limit-warning ${attachments.length + images.length > 10 ? 'show' : ''}`}>
// //                 最多僅能上傳12個附件與圖片！
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* 🔥 修改：設定區域 - 只讀模式禁用所有開關 */}
// //         <div className="upload-announcement-settings-area">
// //           {/* 排程發布 */}
// //           <div className="upload-announcement-setting-item">
// //             <div className="upload-announcement-setting-content">
// //               <div className="upload-announcement-setting-title-group">
// //                 <div className="upload-announcement-setting-title">預約發布</div>
// //                 <div className="upload-announcement-setting-subtitle">設定時間發布公告</div>
// //               </div>
// //               <div 
// //                 className="upload-announcement-toggle-switch" 
// //                 onClick={readOnly ? null : handleSchedulePublishToggle} // 🔥 只讀模式禁用點擊
// //                 style={readOnly ? { cursor: 'default', opacity: 0.6 } : {}}
// //               >
// //                 <div className={`upload-announcement-toggle-circle ${schedulePublish ? 'active' : 'inactive'}`}></div>
// //               </div>
// //             </div>
// //             {schedulePublish && (
// //               <div className="upload-announcement-datetime-picker show">
// //                 <div className="upload-announcement-datetime-container">
// //                   <div 
// //                     className="upload-announcement-datetime-section" 
// //                     onClick={readOnly ? null : handlePublishDateClick} // 🔥 只讀模式禁用點擊
// //                     style={readOnly ? { cursor: 'default', opacity: 0.6 } : {}}
// //                   >
// //                     <div className="upload-announcement-datetime-icon">
// //                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
// //                         <rect x="3.5" y="5.25" width="21" height="19.25" rx="2" stroke="#C4D4E8" strokeWidth="2"/>
// //                         <path d="M8.75 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
// //                         <path d="M19.25 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
// //                         <path d="M3.5 12.25H24.5" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
// //                       </svg>
// //                     </div>
// //                     <div className="upload-announcement-datetime-display">
// //                       <span className="upload-announcement-year">{publishDisplayTime.year}</span>
// //                       <span className="upload-announcement-unit">年</span>
// //                       <span className="upload-announcement-month">{publishDisplayTime.month}</span>
// //                       <span className="upload-announcement-unit">月</span>
// //                       <span className="upload-announcement-day">{publishDisplayTime.day}</span>
// //                       <span className="upload-announcement-unit">日</span>
// //                     </div>
// //                   </div>
// //                   <div className="upload-announcement-datetime-section-time">
// //                     <div className="upload-announcement-datetime-icon">
// //                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
// //                         <circle cx="14" cy="14" r="10.5" stroke="#C4D4E8" strokeWidth="2.33333"/>
// //                         <path d="M14 7V14L18.6667 16.3333" stroke="#C4D4E8" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
// //                       </svg>
// //                     </div>
// //                     <div className="upload-announcement-datetime-display">
// //                       {/* 🔥 只讀模式禁用時鐘選擇器 */}
// //                       <TimePickerInput
// //                         value={publishTime}
// //                         onChange={readOnly ? null : (time) => setPublishTime(time)}
// //                         placeholder="選擇時間"
// //                         disabled={readOnly}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* 🔥 修改：公告下架時間 - 只讀模式禁用 */}
// //           <div className="upload-announcement-setting-item">
// //             <div className="upload-announcement-setting-content">
// //               <div className="upload-announcement-setting-title-group">
// //                 <div className="upload-announcement-setting-title">預約下架時間</div>
// //                 <div className="upload-announcement-setting-subtitle">設定公告下架時間</div>
// //               </div>
// //               <div 
// //                 className="upload-announcement-toggle-switch" 
// //                 onClick={readOnly ? null : handleScheduleRemoveToggle} // 🔥 只讀模式禁用點擊
// //                 style={readOnly ? { cursor: 'default', opacity: 0.6 } : {}}
// //               >
// //                 <div className={`upload-announcement-toggle-circle ${scheduleRemove ? 'active' : 'inactive'}`}></div>
// //               </div>
// //             </div>
// //             {scheduleRemove && (
// //               <div className="upload-announcement-datetime-picker show">
// //                 <div className="upload-announcement-datetime-container">
// //                   <div 
// //                     className="upload-announcement-datetime-section" 
// //                     onClick={readOnly ? null : handleRemoveDateClick} // 🔥 只讀模式禁用點擊
// //                     style={readOnly ? { cursor: 'default', opacity: 0.6 } : {}}
// //                   >
// //                     <div className="upload-announcement-datetime-icon">
// //                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
// //                         <rect x="3.5" y="5.25" width="21" height="19.25" rx="2" stroke="#C4D4E8" strokeWidth="2"/>
// //                         <path d="M8.75 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
// //                         <path d="M19.25 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
// //                         <path d="M3.5 12.25H24.5" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
// //                       </svg>
// //                     </div>
// //                     <div className="upload-announcement-datetime-display">
// //                       <span className="upload-announcement-year">{removeDisplayTime.year}</span>
// //                       <span className="upload-announcement-unit">年</span>
// //                       <span className="upload-announcement-month">{removeDisplayTime.month}</span>
// //                       <span className="upload-announcement-unit">月</span>
// //                       <span className="upload-announcement-day">{removeDisplayTime.day}</span>
// //                       <span className="upload-announcement-unit">日</span>
// //                     </div>
// //                   </div>
// //                   <div className="upload-announcement-datetime-section-time">
// //                     <div className="upload-announcement-datetime-icon">
// //                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
// //                         <circle cx="14" cy="14" r="10.5" stroke="#C4D4E8" strokeWidth="2.33333"/>
// //                         <path d="M14 7V14L18.6667 16.3333" stroke="#C4D4E8" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
// //                       </svg>
// //                     </div>
// //                     <div className="upload-announcement-datetime-display">
// //                       {/* 🔥 只讀模式禁用時鐘選擇器 */}
// //                       <TimePickerInput
// //                         value={removeTime}
// //                         onChange={readOnly ? null : (time) => setRemoveTime(time)}
// //                         placeholder="選擇時間"
// //                         disabled={readOnly}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// // {/* 🔥 修改：動作按鈕區域 - 根據編輯模式使用不同的處理函數 */}
// // {!hideBottomButtons && (
// //   <div className="upload-announcement-action-area">
// //     <div className="upload-announcement-button-group">
// //       {/* 取消按鈕 */}
// //       <button className="upload-announcement-cancel-button" onClick={handleCancel}>
// //         <div className="upload-announcement-cancel-button-main-text">
// //           {isEditMode ? '返回' : '取消'}
// //         </div>
// //         <div className="upload-announcement-cancel-button-sub-text">
// //           {isEditMode ? '返回草稿' : '捨棄資料'}
// //         </div>
// //       </button>

// //       {/* 發布按鈕組 */}
// //       <div className="upload-announcement-publish-group">
// //         <div className="upload-announcement-publish-buttons">
// //           {/* 🔥 修改：儲存草稿按鈕 - 根據編輯模式使用不同處理函數 */}
// //           <button 
// //             className="upload-announcement-save-draft-button" 
// //             onClick={isEditMode ? handleUpdateDraft : handleSaveDraft}
// //           >
// //             <div className="upload-announcement-save-draft-text">
// //               {isEditMode ? '儲存修改' : '儲存草稿'}
// //             </div>
// //           </button>

// //           {/* 🔥 修改：發布按鈕 - 根據編輯模式使用不同處理函數 */}
// //           <button 
// //             className="upload-announcement-publish-button" 
// //             onClick={isEditMode ? handleUpdateAndPublish : handlePublish}
// //           >
// //             <div className="upload-announcement-publish-button-main-text">完成</div>
// //             <div className="upload-announcement-publish-button-sub-text">
// //               {schedulePublish ? '排程後發布公告' : '立即發布公告'}
// //             </div>
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // )}


// //         {/* 🔥 只讀模式不顯示隱藏的文件輸入 */}
// //         {!readOnly && (
// //           <>
// //             <input
// //               ref={attachmentInputRef}
// //               type="file"
// //               className="upload-announcement-hidden-file-input"
// //               multiple
// //               onChange={handleAttachmentUpload}
// //             />
// //             <input
// //               ref={imageInputRef}
// //               type="file"
// //               className="upload-announcement-hidden-file-input"
// //               accept="image/*"
// //               multiple
// //               onChange={handleImageUpload}
// //             />
// //           </>
// //         )}

// //         {/* 🔥 只讀模式不顯示日曆選擇器 */}
// //         {!readOnly && (
// //           <>
// //             <CalendarSelector
// //               isVisible={showPublishCalendar}
// //               onClose={() => setShowPublishCalendar(false)}
// //               onDateSelect={handlePublishDateSelect}
// //               selectedDate={publishDate}
// //             />

// //             <CalendarSelector
// //               isVisible={showRemoveCalendar}
// //               onClose={() => setShowRemoveCalendar(false)}
// //               onDateSelect={handleRemoveDateSelect}
// //               selectedDate={removeDate}
// //             />
// //           </>
// //         )}
// //       </div>
// //     );
// //   };

// //   // 渲染開發中訊息
// //   const renderDevelopmentMessage = (feature) => (
// //     <div className="upload-announcement-development-message">
// //       <div className="upload-announcement-development-icon">🚧</div>
// //       <h4 className="upload-announcement-development-title">{feature} 功能開發中</h4>
// //       <p className="upload-announcement-development-text">
// //         此功能正在開發中，敬請期待
// //       </p>
// //     </div>
// //   );

// //   // 🔥 修改編輯模式的返回，移除額外的側邊欄和功能選單
// //   if (isEditMode) {
// //     return (
// //       <div className="upload-announcement-container">
// //         {/* 🔥 使用正常的主要內容區域，確保響應式 */}
// //         <div className="upload-announcement-main-content-area">
// //           {renderCreateContent()}
// //         </div>
// //       </div>
// //     );
// //   }

// //   // 在 Upload_Announcement.js 中修改 return 部分
// //   return (
// //     <div className="upload-announcement-container">
// //       {/* 側邊欄區域 */}
// //       <div className="upload-announcement-sidebar-wrapper">
// //         <Sidebar currentPage="notice" />
// //       </div>

// //       {/* 功能表 */}
// //       <div className="upload-announcement-submenu-wrapper">
// //         <div className="upload-announcement-submenu-content">
// //           {/* 建立新公告 */}
// //           <div 
// //             className={`upload-announcement-menu-item ${activeTab === 'create' ? 'active' : 'inactive'}`}
// //             onClick={() => handleTabClick('create')}
// //           >
// //             <div className="upload-announcement-menu-icon">
// //               <img 
// //                 src={newAnnouncementIcon} 
// //                 alt="建立新公告" 
// //                 className={`upload-announcement-menu-icon-image ${activeTab === 'create' ? '' : 'upload-announcement-inactive-icon-image'}`}
// //               />
// //             </div>
// //             <div className={`upload-announcement-menu-text ${activeTab === 'create' ? 'active' : 'inactive'}`}>
// //               建立新公告
// //             </div>
// //           </div>

// //           {/* 已排程公告 */}
// //           <div 
// //             className={`upload-announcement-menu-item ${activeTab === 'scheduled' ? 'active' : 'inactive'}`}
// //             onClick={() => handleTabClick('scheduled')}
// //           >
// //             <div className="upload-announcement-menu-icon">
// //               <img 
// //                 src={scheduleAnnouncementIcon} 
// //                 alt="已排程公告" 
// //                 className={`upload-announcement-menu-icon-image ${activeTab === 'scheduled' ? '' : 'upload-announcement-inactive-icon-image'}`}
// //               />
// //             </div>
// //             <div className={`upload-announcement-menu-text ${activeTab === 'scheduled' ? 'active' : 'inactive'}`}>
// //               已排程公告
// //             </div>
// //           </div>

// //           {/* 草稿 */}
// //           <div 
// //             className={`upload-announcement-menu-item ${activeTab === 'draft' ? 'active' : 'inactive'}`}
// //             onClick={() => handleTabClick('draft')}
// //           >
// //             <div className="upload-announcement-menu-icon">
// //               <img 
// //                 src={draftIcon} 
// //                 alt="草稿" 
// //                 className={`upload-announcement-menu-icon-image ${activeTab === 'draft' ? '' : 'upload-announcement-inactive-icon-image'}`}
// //               />
// //             </div>
// //             <div className={`upload-announcement-menu-text ${activeTab === 'draft' ? 'active' : 'inactive'}`}>
// //               草稿
// //             </div>
// //           </div>

// //           {/* 公告發布紀錄 */}
// //           <div 
// //             className={`upload-announcement-menu-item ${activeTab === 'record' ? 'active' : 'inactive'}`}
// //             onClick={() => handleTabClick('record')}
// //           >
// //             <div className="upload-announcement-menu-icon">
// //               <img 
// //                 src={listIcon} 
// //                 alt="公告發布紀錄" 
// //                 className={`upload-announcement-menu-icon-image ${activeTab === 'record' ? '' : 'upload-announcement-inactive-icon-image'}`}
// //               />
// //             </div>
// //             <div className={`upload-announcement-menu-text ${activeTab === 'record' ? 'active' : 'inactive'}`}>
// //               公告發布紀錄
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 🔥 修改：統一使用主要內容範圍容器 */}
// //       <div className="upload-announcement-main-content-area">
// //         {activeTab === 'create' && renderCreateContent()}
// //         {activeTab === 'scheduled' && <ScheduleAnnouncement />}
// //         {activeTab === 'draft' && <Draft />}
// //         {activeTab === 'record' && <Release_Record />}
// //       </div>
// //     </div>
// //   );
// // };

// // export default UploadAnnouncement;
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import Sidebar from '../Sidebar';
// import './Upload_Announcement.css';
// import ScheduleAnnouncement from './Schedule_Announcement/Schedule_Announcement';
// import Draft from './Draft/Draft';
// import Release_Record from './Release_Record/Release_Record';

// // 🔥 引入 API_BASE_URL
// import { API_BASE_URL } from '../../config';

// // 引入圖標
// import newAnnouncementIcon from '../ICON/New_Announcement.png';
// import scheduleAnnouncementIcon from '../ICON/Schedule_Announcement.png';
// import draftIcon from '../ICON/Draft.png';
// import listIcon from '../ICON/List.png';
// import uploadAttachmentsIcon from '../ICON/Upload_attachments.png';
// import uploadPhotosIcon from '../ICON/Upload_photos.png';
// import uploadedPhotosIcon from '../ICON/Uploaded_photos.png';
// import uploadedAttachmentsIcon from '../ICON/Uploaded_attachments.png';
// import trashIcon from '../ICON/tabler_trash.png';
// import { TimePickerInput } from './SamllitemsForNot/Clock';
// import CalendarSelector from './SamllitemsForNot/Calendar Selector';

// // 🔥 新增 readOnly 參數
// const UploadAnnouncement = ({ 
//   editData = null, 
//   isEditMode = false, 
//   onSave = null, 
//   onCancel = null, 
//   hideBottomButtons = false,
//   readOnly = false // 🔥 新增：只讀模式
// }) => {
//   const [activeTab, setActiveTab] = useState('create');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [images, setImages] = useState([]);
//   const [schedulePublish, setSchedulePublish] = useState(false);
//   const [scheduleRemove, setScheduleRemove] = useState(false);
  
//   // 🔥 修改：分別管理日期和時間
//   const [publishDate, setPublishDate] = useState(null); // 改為 Date 對象
//   const [publishTime, setPublishTime] = useState('');
//   const [removeDate, setRemoveDate] = useState(null); // 改為 Date 對象
//   const [removeTime, setRemoveTime] = useState('');
  
//   // 🔥 新增：日曆選擇器顯示狀態
//   const [showPublishCalendar, setShowPublishCalendar] = useState(false);
//   const [showRemoveCalendar, setShowRemoveCalendar] = useState(false);
  
//   const attachmentInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   // 🔥 新增：權限相關狀態
//   const [permissions, setPermissions] = useState(null);
//   const [hasEditPermission, setHasEditPermission] = useState(false);
//   const [permissionLoading, setPermissionLoading] = useState(false);
//   const [permissionError, setPermissionError] = useState('');

//   // 🔥 新增：檢查員工權限的 API 函數
//   const checkEmployeePermissions = async () => {
//     try {
//       const companyId = Cookies.get('company_id');
//       const employeeId = Cookies.get('employee_id');
      
//       if (!companyId || !employeeId) {
//         return {
//           success: false,
//           message: '無法獲取公司ID或員工ID',
//           hasEditPermission: false
//         };
//       }
      
//       const response = await axios.get(
//         `${API_BASE_URL}/api/company/employee-permissions/${employeeId}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'x-company-id': companyId
//           },
//           params: {
//             company_id: companyId
//           },
//           timeout: 10000,
//           validateStatus: function (status) {
//             return status < 500;
//           }
//         }
//       );

//       console.log('🔍 公告權限檢查 API 回應:', response.data);
      
//       if (response.data && response.data.Status === 'Ok') {
//         return {
//           success: true,
//           permissions: response.data.Data,
//           hasEditPermission: response.data.Data?.raw_data?.upload_announcement === 1
//         };
//       } else {
//         return {
//           success: false,
//           message: response.data?.Msg || '權限檢查失敗',
//           hasEditPermission: false
//         };
//       }
//     } catch (error) {
//       console.error('❌ 公告權限檢查 API 錯誤:', error);
//       return {
//         success: false,
//         message: error.message || '權限檢查失敗',
//         hasEditPermission: false
//       };
//     }
//   };

//   // 🔥 新增：檢查權限
//   useEffect(() => {
//     const loadPermissions = async () => {
//       setPermissionLoading(true);
//       setPermissionError('');
      
//       try {
//         const result = await checkEmployeePermissions();
        
//         if (result.success) {
//           setPermissions(result.permissions);
//           setHasEditPermission(result.hasEditPermission);
//           console.log('✅ 公告權限檢查成功:', result.permissions);
//           console.log('✅ 公告編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
//         } else {
//           setPermissionError(result.message);
//           setHasEditPermission(false);
//           console.error('❌ 公告權限檢查失敗:', result.message);
//         }
//       } catch (error) {
//         setPermissionError('權限檢查發生錯誤');
//         setHasEditPermission(false);
//         console.error('❌ 公告權限檢查異常:', error);
//       } finally {
//         setPermissionLoading(false);
//       }
//     };

//     loadPermissions();
//   }, []);

//   // 🔥 新增：從 cookies 獲取資料的輔助函數
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   // 🔥 新增：處理更新草稿
//   const handleUpdateDraft = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限編輯公告');
//       return;
//     }

//     if (!title.trim()) {
//       alert('請輸入公告標題！');
//       return;
//     }

//     try {
//       const currentDateTime = getCurrentDateTime();
//       const updateData = {
//         title: title.trim(),
//         content: content.trim(),
//         publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
//         publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
//         ...(scheduleRemove && removeDate && removeTime && {
//           end_date: formatDate(removeDate),
//           end_time: formatTime(removeTime)
//         }),
//         status: 'draft' // 🔥 更新草稿保持 draft 狀態
//       };

//       console.log('準備更新的草稿資料:', updateData);

//       // 🔥 使用 PUT API 更新草稿
//       const response = await fetch(`${API_BASE_URL}/api/announcements/${editData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData)
//       });

//       const result = await response.json();

//       if (response.ok && result.Status === 'Ok') {
//         console.log('草稿更新成功:', result);
//         alert('草稿已更新！');

//         if (isEditMode && onSave) {
//           onSave(result.Data, false);
//         }

//       } else {
//         console.error('草稿更新失敗:', result);
//         alert(`更新失敗：${result.Msg || '未知錯誤'}`);
//       }

//     } catch (error) {
//       console.error('更新草稿時發生錯誤:', error);
//       alert('更新失敗：網路錯誤，請稍後再試！');
//     }
//   };

//   // 🔥 新增：處理更新並發布
//   const handleUpdateAndPublish = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限編輯公告');
//       return;
//     }

//     if (!title.trim()) {
//       alert('請輸入公告標題！');
//       return;
//     }
//     if (!content.trim()) {
//       alert('請輸入公告內容！');
//       return;
//     }
    
//     // 驗證排程時間
//     if (schedulePublish) {
//       if (!publishDate || !publishTime) {
//         alert('請選擇完整的發布日期和時間！');
//         return;
//       }
      
//       const publishDateTime = combineDateTime(publishDate, publishTime);
//       const selectedTime = new Date(publishDateTime);
//       const currentTime = new Date();
      
//       if (selectedTime <= currentTime) {
//         alert('發布時間必須晚於目前時間！');
//         return;
//       }
//     }

//     // 驗證下架時間
//     if (scheduleRemove) {
//       if (!removeDate || !removeTime) {
//         alert('請選擇完整的下架日期和時間！');
//         return;
//       }
      
//       const removeDateTime = combineDateTime(removeDate, removeTime);
//       const publishDateTime = schedulePublish ? combineDateTime(publishDate, publishTime) : new Date().toISOString();
//       const removeTimeObj = new Date(removeDateTime);
//       const publishTimeObj = new Date(publishDateTime);
      
//       if (removeTimeObj <= publishTimeObj) {
//         alert('下架時間必須晚於發布時間！');
//         return;
//       }
//     }

//     try {
//       const currentDateTime = getCurrentDateTime();
//       const updateData = {
//         title: title.trim(),
//         content: content.trim(),
//         publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
//         publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
//         ...(scheduleRemove && removeDate && removeTime && {
//           end_date: formatDate(removeDate),
//           end_time: formatTime(removeTime)
//         }),
//         status: 'published' // 🔥 更新並發布改為 published 狀態
//       };

//       console.log('準備更新並發布的資料:', updateData);

//       // 🔥 使用 PUT API 更新並發布
//       const response = await fetch(`${API_BASE_URL}/api/announcements/${editData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData)
//       });

//       const result = await response.json();

//       if (response.ok && result.Status === 'Ok') {
//         console.log('公告更新並發布成功:', result);
        
//         if (schedulePublish) {
//           alert(`公告已排程於 ${formatDate(publishDate)} ${publishTime} 發布！`);
//         } else {
//           alert('公告已立即發布！');
//         }

//         if (isEditMode && onSave) {
//           onSave(result.Data, true);
//         }

//       } else {
//         console.error('API 錯誤:', result);
//         alert(`發布失敗：${result.Msg || '未知錯誤'}`);
//       }

//     } catch (error) {
//       console.error('更新並發布公告時發生錯誤:', error);
//       alert('發布失敗：網路錯誤，請稍後再試！');
//     }
//   };

//   // 🔥 新增：生成公告編號的函數
//   const generateDocumentNumber = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = (now.getMonth() + 1).toString().padStart(2, '0');
//     const day = now.getDate().toString().padStart(2, '0');
//     const timestamp = now.getTime().toString().slice(-6); // 取時間戳後6位
//     return `ANN-${year}${month}${day}-${timestamp}`;
//   };

//   // 🔥 新增：格式化日期為 YYYY-MM-DD 格式
//   const formatDate = (date) => {
//     if (!date) return null;
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // 🔥 新增：格式化時間為 HH:MM:SS 格式
//   const formatTime = (timeString) => {
//     if (!timeString) return null;
//     // 如果時間格式是 HH:MM，補上秒數
//     if (timeString.length === 5) {
//       return `${timeString}:00`;
//     }
//     return timeString;
//   };

//   // 🔥 新增：獲取當前日期和時間
//   const getCurrentDateTime = () => {
//     const now = new Date();
//     const date = formatDate(now);
//     const time = now.toTimeString().split(' ')[0]; // HH:MM:SS 格式
//     return { date, time };
//   };

//   // 🔥 新增：編輯模式初始化
//   useEffect(() => {
//     if (isEditMode && editData) {
//       setTitle(editData.title || '');
//       setContent(editData.content || '');
//       setAttachments(editData.attachments || []);
//       setImages(editData.images || []);
//       setSchedulePublish(editData.schedulePublish || false);
//       setScheduleRemove(editData.scheduleRemove || false);
      
//       // 處理日期時間
//       if (editData.publishDateTime) {
//         const publishDate = new Date(editData.publishDateTime);
//         setPublishDate(publishDate);
//         setPublishTime(publishDate.toTimeString().slice(0, 5));
//       }
      
//       if (editData.removeDateTime) {
//         const removeDate = new Date(editData.removeDateTime);
//         setRemoveDate(removeDate);
//         setRemoveTime(removeDate.toTimeString().slice(0, 5));
//       }
//     }
//   }, [isEditMode, editData]);

//   // 🔥 新增：組合日期和時間的輔助函數
//   const combineDateTime = (dateObj, time) => {
//     if (!dateObj || !time) return '';
//     const year = dateObj.getFullYear();
//     const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
//     const day = dateObj.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}T${time}`;
//   };

//   // 🔥 新增：格式化日期顯示
//   const formatDateDisplay = (dateObj) => {
//     if (!dateObj) {
//       return {
//         year: '2024',
//         month: '8',
//         day: '26'
//       };
//     }
    
//     return {
//       year: dateObj.getFullYear().toString(),
//       month: (dateObj.getMonth() + 1).toString(),
//       day: dateObj.getDate().toString()
//     };
//   };

//   // 處理標籤切換
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   // 🔥 修改：處理標題輸入 - 加入權限檢查
//   const handleTitleChange = (e) => {
//     if (readOnly || !hasEditPermission) return;
//     const value = e.target.value;
//     if (value.length <= 36) {
//       setTitle(value);
//     }
//   };

//   // 🔥 修改：處理內容輸入 - 加入權限檢查
//   const handleContentChange = (e) => {
//     if (readOnly || !hasEditPermission) return;
//     const value = e.target.value;
//     if (value.length <= 800) {
//       setContent(value);
//     }
//   };

//   // 🔥 修改：處理附件上傳 - 加入權限檢查
//   const handleAttachmentUpload = (e) => {
//     if (readOnly || !hasEditPermission) return;
//     const files = Array.from(e.target.files);
//     if (attachments.length + images.length + files.length <= 12) {
//       const newAttachments = files.map(file => ({
//         id: Date.now() + Math.random(),
//         name: file.name,
//         file: file,
//         type: 'attachment'
//       }));
//       setAttachments([...attachments, ...newAttachments]);
//     }
//   };

//   // 🔥 修改：處理圖片上傳 - 加入權限檢查
//   const handleImageUpload = (e) => {
//     if (readOnly || !hasEditPermission) return;
//     const files = Array.from(e.target.files);
//     if (attachments.length + images.length + files.length <= 12) {
//       const newImages = files.map(file => ({
//         id: Date.now() + Math.random(),
//         name: file.name,
//         file: file,
//         type: 'image',
//         url: URL.createObjectURL(file)
//       }));
//       setImages([...images, ...newImages]);
//     }
//   };

//   // 🔥 修改：刪除附件 - 加入權限檢查
//   const handleDeleteAttachment = (id) => {
//     if (readOnly || !hasEditPermission) return;
//     setAttachments(attachments.filter(item => item.id !== id));
//   };

//   // 🔥 修改：刪除圖片 - 加入權限檢查
//   const handleDeleteImage = (id) => {
//     if (readOnly || !hasEditPermission) return;
//     const imageToDelete = images.find(img => img.id === id);
//     if (imageToDelete) {
//       URL.revokeObjectURL(imageToDelete.url);
//     }
//     setImages(images.filter(item => item.id !== id));
//   };

//   // 🔥 修改：處理排程發布切換 - 加入權限檢查
//   const handleSchedulePublishToggle = () => {
//     if (readOnly || !hasEditPermission) return;
//     setSchedulePublish(!schedulePublish);
//     if (schedulePublish) {
//       setPublishDate(null);
//       setPublishTime('');
//     }
//   };

//   // 🔥 修改：處理排程下架切換 - 加入權限檢查
//   const handleScheduleRemoveToggle = () => {
//     if (readOnly || !hasEditPermission) return;
//     setScheduleRemove(!scheduleRemove);
//     if (scheduleRemove) {
//       setRemoveDate(null);
//       setRemoveTime('');
//     }
//   };

//   // 🔥 修改：處理日期選擇 - 加入權限檢查
//   const handlePublishDateSelect = (date) => {
//     if (readOnly || !hasEditPermission) return;
//     setPublishDate(date);
//     setShowPublishCalendar(false);
//   };

//   const handleRemoveDateSelect = (date) => {
//     if (readOnly || !hasEditPermission) return;
//     setRemoveDate(date);
//     setShowRemoveCalendar(false);
//   };

//   // 🔥 修改：處理日期點擊 - 加入權限檢查
//   const handlePublishDateClick = () => {
//     if (readOnly || !hasEditPermission) return;
//     setShowPublishCalendar(true);
//   };

//   const handleRemoveDateClick = () => {
//     if (readOnly || !hasEditPermission) return;
//     setShowRemoveCalendar(true);
//   };

//   // 🔥 修改：處理取消
//   const handleCancel = () => {
//     if (isEditMode && onCancel) {
//       onCancel();
//       return;
//     }
    
//     if (window.confirm('確定要捨棄目前的編輯內容嗎？')) {
//       setTitle('');
//       setContent('');
//       setAttachments([]);
//       setImages([]);
//       setSchedulePublish(false);
//       setScheduleRemove(false);
//       setPublishDate(null);
//       setPublishTime('');
//       setRemoveDate(null);
//       setRemoveTime('');
//     }
//   };

//   // 🔥 修改：處理儲存草稿 - 加入權限檢查
//   const handleSaveDraft = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限編輯公告');
//       return;
//     }

//     if (!title.trim()) {
//       alert('請輸入公告標題！');
//       return;
//     }

//     try {
//       const companyId = getCookie('company_id');
//       const employeeId = getCookie('employee_id');
      
//       if (!companyId || !employeeId) {
//         alert('無法獲取用戶資訊，請重新登入！');
//         return;
//       }

//       const currentDateTime = getCurrentDateTime();
//       const draftData = {
//         document_number: generateDocumentNumber(),
//         company_id: companyId,
//         employee_id: employeeId,
//         title: title.trim(),
//         content: content.trim(),
//         publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
//         publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
//         ...(scheduleRemove && removeDate && removeTime && {
//           end_date: formatDate(removeDate),
//           end_time: formatTime(removeTime)
//         }),
//         status: 'draft' // 🔥 儲存草稿按鈕 → status: 'draft'
//       };

//       console.log('準備儲存的草稿資料:', draftData);

//       // 🔥 使用 config 中的 API_BASE_URL
//       const response = await fetch(`${API_BASE_URL}/api/announcements`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(draftData)
//       });

//       const result = await response.json();

//       if (response.ok && result.Status === 'Ok') {
//         console.log('草稿儲存成功:', result);
//         alert('草稿已儲存！');

//         if (isEditMode && onSave) {
//           onSave(result.Data, false);
//         }

//       } else {
//         console.error('草稿儲存失敗:', result);
//         alert(`儲存失敗：${result.Msg || '未知錯誤'}`);
//       }

//     } catch (error) {
//       console.error('儲存草稿時發生錯誤:', error);
//       alert('儲存失敗：網路錯誤，請稍後再試！');
//     }
//   };

//   // 🔥 修改：處理發布 - 加入權限檢查
//   const handlePublish = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限編輯公告');
//       return;
//     }

//     if (!title.trim()) {
//       alert('請輸入公告標題！');
//       return;
//     }
//     if (!content.trim()) {
//       alert('請輸入公告內容！');
//       return;
//     }
    
//     // 驗證排程時間
//     if (schedulePublish) {
//       if (!publishDate || !publishTime) {
//         alert('請選擇完整的發布日期和時間！');
//         return;
//       }
      
//       const publishDateTime = combineDateTime(publishDate, publishTime);
//       const selectedTime = new Date(publishDateTime);
//       const currentTime = new Date();
      
//       if (selectedTime <= currentTime) {
//         alert('發布時間必須晚於目前時間！');
//         return;
//       }
//     }

//     // 驗證下架時間
//     if (scheduleRemove) {
//       if (!removeDate || !removeTime) {
//         alert('請選擇完整的下架日期和時間！');
//         return;
//       }
      
//       const removeDateTime = combineDateTime(removeDate, removeTime);
//       const publishDateTime = schedulePublish ? combineDateTime(publishDate, publishTime) : new Date().toISOString();
//       const removeTimeObj = new Date(removeDateTime);
//       const publishTimeObj = new Date(publishDateTime);
      
//       if (removeTimeObj <= publishTimeObj) {
//         alert('下架時間必須晚於發布時間！');
//         return;
//       }
//     }

//     try {
//       const companyId = getCookie('company_id');
//       const employeeId = getCookie('employee_id');
      
//       if (!companyId || !employeeId) {
//         alert('無法獲取用戶資訊，請重新登入！');
//         return;
//       }

//       const currentDateTime = getCurrentDateTime();
//       const apiData = {
//         document_number: generateDocumentNumber(),
//         company_id: companyId,
//         employee_id: employeeId,
//         title: title.trim(),
//         content: content.trim(),
//         publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
//         publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
//         ...(scheduleRemove && removeDate && removeTime && {
//           end_date: formatDate(removeDate),
//           end_time: formatTime(removeTime)
//         }),
//         status: 'published' // 🔥 完成按鈕 → status: 'published'
//       };

//       console.log('準備發送的 API 資料:', apiData);

//       // 🔥 使用 config 中的 API_BASE_URL
//       const response = await fetch(`${API_BASE_URL}/api/announcements`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(apiData)
//       });

//       const result = await response.json();

//       if (response.ok && result.Status === 'Ok') {
//         console.log('公告創建成功:', result);
        
//         if (schedulePublish) {
//           alert(`公告已排程於 ${formatDate(publishDate)} ${publishTime} 發布！`);
//         } else {
//           alert('公告已立即發布！');
//         }

//         // 清空表單
//         setTitle('');
//         setContent('');
//         setAttachments([]);
//         setImages([]);
//         setSchedulePublish(false);
//         setScheduleRemove(false);
//         setPublishDate(null);
//         setPublishTime('');
//         setRemoveDate(null);
//         setRemoveTime('');

//         if (isEditMode && onSave) {
//           onSave(result.Data, true);
//         }

//       } else {
//         console.error('API 錯誤:', result);
//         alert(`發布失敗：${result.Msg || '未知錯誤'}`);
//       }

//     } catch (error) {
//       console.error('發布公告時發生錯誤:', error);
//       alert('發布失敗：網路錯誤，請稍後再試！');
//     }
//   };

//   // 🔥 修改：渲染建立新公告內容
//   const renderCreateContent = () => {
//     const publishDisplayTime = formatDateDisplay(publishDate);
//     const removeDisplayTime = formatDateDisplay(removeDate);

//     // 🔥 權限載入中顯示
//     if (permissionLoading) {
//       return (
//         <div className="upload-announcement-content-frame">
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//             height: '200px',
//             color: '#666'
//           }}>
//             檢查權限中...
//           </div>
//         </div>
//       );
//     }

//     // 🔥 權限錯誤顯示
//     if (permissionError) {
//       return (
//         <div className="upload-announcement-content-frame">
//           <div style={{
//             backgroundColor: '#fff3cd',
//             color: '#856404',
//             padding: '15px',
//             borderRadius: '4px',
//             margin: '20px',
//             border: '1px solid #ffeaa7',
//             textAlign: 'center'
//           }}>
//             <strong>權限警告：</strong>{permissionError}
//           </div>
//         </div>
//       );
//     }

//     // 🔥 計算是否應該禁用編輯功能
//     const isReadOnlyMode = readOnly || !hasEditPermission;

//     return (
//       <div className="upload-announcement-content-frame">
//         {/* 🔥 新增：只讀模式標題 */}
//         {isEditMode && readOnly && (
//           <div className="upload-announcement-readonly-header">
//             <h3 style={{ 
//               color: '#666', 
//               marginBottom: '20px', 
//               fontSize: '18px',
//               fontWeight: 'normal'
//             }}>
//               查看公告內容
//             </h3>
//           </div>
//         )}

//         {/* 主編輯區域 */}
//         <div className="upload-announcement-main-edit-area">
//           <div className="upload-announcement-edit-content-container">
//             {/* 文字編輯區域 */}
//             <div className="upload-announcement-text-edit-area">
//               {/* 標題區域 */}
//               <div className="upload-announcement-title-frame">
//                 <input
//                   type="text"
//                   className="upload-announcement-title-input"
//                   placeholder="中元節普渡祭拜活動"
//                   value={title}
//                   onChange={handleTitleChange}
//                   readOnly={isReadOnlyMode} // 🔥 根據權限設定是否可編輯
//                   style={isReadOnlyMode ? { 
//                     cursor: 'default',
//                     opacity: 0.8
//                   } : {}}
//                 />
//                 {/* 🔥 只讀模式或無權限不顯示字數限制警告 */}
//                 {!isReadOnlyMode && (
//                   <div className={`upload-announcement-title-limit-warning ${title.length > 30 ? 'show' : ''}`}>
//                     標題上限36個字！
//                   </div>
//                 )}
//               </div>
              
//               {/* 內文區域 */}
//               <div className="upload-announcement-content-text-frame">
//                 <textarea
//                   className="upload-announcement-content-textarea"
//                   placeholder="寫點內容吧......"
//                   value={content}
//                   onChange={handleContentChange}
//                   readOnly={isReadOnlyMode} // 🔥 根據權限設定是否可編輯
//                   style={isReadOnlyMode ? { 
//                     cursor: 'default',
//                     resize: 'none',
//                     opacity: 0.8
//                   } : {}}
//                 />
//                 {/* 🔥 只讀模式或無權限不顯示字數限制警告 */}
//                 {!isReadOnlyMode && (
//                   <div className={`upload-announcement-content-limit-warning ${content.length > 700 ? 'show' : ''}`}>
//                     內文上限800字！
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* 🔥 修改：附件上傳區域 - 根據權限隱藏上傳按鈕 */}
//             <div className="upload-announcement-attachment-area">
//               {/* 🔥 無權限或只讀模式不顯示上傳按鈕 */}
//               {!isReadOnlyMode && (
//                 <>
//                   {/* 上傳附件按鈕 */}
//                   <button className="upload-announcement-upload-button" onClick={() => attachmentInputRef.current?.click()}>
//                     <div className="upload-announcement-upload-border"></div>
//                     <div className="upload-announcement-upload-icon">
//                       <img 
//                         src={uploadAttachmentsIcon} 
//                         alt="上傳附件" 
//                         className="upload-announcement-upload-icon-image"
//                       />
//                     </div>
//                     <div className="upload-announcement-upload-text">上傳附件</div>
//                   </button>

//                   {/* 上傳圖片按鈕 */}
//                   <button className="upload-announcement-upload-button" onClick={() => imageInputRef.current?.click()}>
//                     <div className="upload-announcement-upload-border"></div>
//                     <div className="upload-announcement-upload-icon">
//                       <img 
//                         src={uploadPhotosIcon} 
//                         alt="上傳圖片" 
//                         className="upload-announcement-upload-icon-image"
//                       />
//                     </div>
//                     <div className="upload-announcement-upload-text">上傳圖片</div>
//                   </button>
//                 </>
//               )}

//               {/* 🔥 修改：顯示已上傳的附件 - 根據權限移除刪除按鈕 */}
//               {attachments.map((attachment) => (
//                 <div key={attachment.id} className="upload-announcement-uploaded-item attachment">
//                   {/* 🔥 無權限或只讀模式不顯示刪除按鈕 */}
//                   {!isReadOnlyMode && (
//                     <button 
//                       className="upload-announcement-delete-button" 
//                       onClick={() => handleDeleteAttachment(attachment.id)}
//                     >
//                       <img 
//                         src={trashIcon} 
//                         alt="刪除" 
//                         className="upload-announcement-delete-icon"
//                       />
//                     </button>
//                   )}
//                   <div className="upload-announcement-uploaded-icon">
//                     <img 
//                       src={uploadedAttachmentsIcon} 
//                       alt="已上傳附件" 
//                       className="upload-announcement-uploaded-icon-image"
//                     />
//                   </div>
//                   <div className="upload-announcement-uploaded-name">
//                     {attachment.name}
//                   </div>
//                 </div>
//               ))}

//               {/* 🔥 修改：顯示已上傳的圖片 - 根據權限移除刪除按鈕 */}
//               {images.map((image) => (
//                 <div key={image.id} className="upload-announcement-uploaded-item image">
//                   {/* 🔥 無權限或只讀模式不顯示刪除按鈕 */}
//                   {!isReadOnlyMode && (
//                     <button 
//                       className="upload-announcement-delete-button" 
//                       onClick={() => handleDeleteImage(image.id)}
//                     >
//                       <img 
//                         src={trashIcon} 
//                         alt="刪除" 
//                         className="upload-announcement-delete-icon"
//                       />
//                     </button>
//                   )}
//                   <div className="upload-announcement-uploaded-icon">
//                     <img 
//                       src={uploadedPhotosIcon} 
//                       alt="已上傳照片" 
//                       className="upload-announcement-uploaded-icon-image"
//                     />
//                   </div>
//                   <div className="upload-announcement-uploaded-name">
//                     {image.name}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* 🔥 無權限或只讀模式不顯示附件數量限制提示 */}
//             {!isReadOnlyMode && (
//               <div className={`upload-announcement-attachment-limit-warning ${attachments.length + images.length > 10 ? 'show' : ''}`}>
//                 最多僅能上傳12個附件與圖片！
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 🔥 修改：設定區域 - 根據權限禁用所有開關 */}
//         <div className="upload-announcement-settings-area">
//           {/* 排程發布 */}
//           <div className="upload-announcement-setting-item">
//             <div className="upload-announcement-setting-content">
//               <div className="upload-announcement-setting-title-group">
//                 <div className="upload-announcement-setting-title">預約發布</div>
//                 <div className="upload-announcement-setting-subtitle">設定時間發布公告</div>
//               </div>
//               <div 
//                 className="upload-announcement-toggle-switch" 
//                 onClick={isReadOnlyMode ? null : handleSchedulePublishToggle} // 🔥 根據權限禁用點擊
//                 style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
//               >
//                 <div className={`upload-announcement-toggle-circle ${schedulePublish ? 'active' : 'inactive'}`}></div>
//               </div>
//             </div>
//             {schedulePublish && (
//               <div className="upload-announcement-datetime-picker show">
//                 <div className="upload-announcement-datetime-container">
//                   <div 
//                     className="upload-announcement-datetime-section" 
//                     onClick={isReadOnlyMode ? null : handlePublishDateClick} // 🔥 根據權限禁用點擊
//                     style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
//                   >
//                     <div className="upload-announcement-datetime-icon">
//                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
//                         <rect x="3.5" y="5.25" width="21" height="19.25" rx="2" stroke="#C4D4E8" strokeWidth="2"/>
//                         <path d="M8.75 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
//                         <path d="M19.25 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
//                         <path d="M3.5 12.25H24.5" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
//                       </svg>
//                     </div>
//                     <div className="upload-announcement-datetime-display">
//                       <span className="upload-announcement-year">{publishDisplayTime.year}</span>
//                       <span className="upload-announcement-unit">年</span>
//                       <span className="upload-announcement-month">{publishDisplayTime.month}</span>
//                       <span className="upload-announcement-unit">月</span>
//                       <span className="upload-announcement-day">{publishDisplayTime.day}</span>
//                       <span className="upload-announcement-unit">日</span>
//                     </div>
//                   </div>
//                   <div className="upload-announcement-datetime-section-time">
//                     <div className="upload-announcement-datetime-icon">
//                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
//                         <circle cx="14" cy="14" r="10.5" stroke="#C4D4E8" strokeWidth="2.33333"/>
//                         <path d="M14 7V14L18.6667 16.3333" stroke="#C4D4E8" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                     <div className="upload-announcement-datetime-display">
//                       {/* 🔥 根據權限禁用時鐘選擇器 */}
//                       <TimePickerInput
//                         value={publishTime}
//                         onChange={isReadOnlyMode ? null : (time) => setPublishTime(time)}
//                         placeholder="選擇時間"
//                         disabled={isReadOnlyMode}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* 🔥 修改：公告下架時間 - 根據權限禁用 */}
//           <div className="upload-announcement-setting-item">
//             <div className="upload-announcement-setting-content">
//               <div className="upload-announcement-setting-title-group">
//                 <div className="upload-announcement-setting-title">預約下架時間</div>
//                 <div className="upload-announcement-setting-subtitle">設定公告下架時間</div>
//               </div>
//               <div 
//                 className="upload-announcement-toggle-switch" 
//                 onClick={isReadOnlyMode ? null : handleScheduleRemoveToggle} // 🔥 根據權限禁用點擊
//                 style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
//               >
//                 <div className={`upload-announcement-toggle-circle ${scheduleRemove ? 'active' : 'inactive'}`}></div>
//               </div>
//             </div>
//             {scheduleRemove && (
//               <div className="upload-announcement-datetime-picker show">
//                 <div className="upload-announcement-datetime-container">
//                   <div 
//                     className="upload-announcement-datetime-section" 
//                     onClick={isReadOnlyMode ? null : handleRemoveDateClick} // 🔥 根據權限禁用點擊
//                     style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
//                   >
//                     <div className="upload-announcement-datetime-icon">
//                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
//                         <rect x="3.5" y="5.25" width="21" height="19.25" rx="2" stroke="#C4D4E8" strokeWidth="2"/>
//                         <path d="M8.75 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
//                         <path d="M19.25 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
//                         <path d="M3.5 12.25H24.5" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
//                       </svg>
//                     </div>
//                     <div className="upload-announcement-datetime-display">
//                       <span className="upload-announcement-year">{removeDisplayTime.year}</span>
//                       <span className="upload-announcement-unit">年</span>
//                       <span className="upload-announcement-month">{removeDisplayTime.month}</span>
//                       <span className="upload-announcement-unit">月</span>
//                       <span className="upload-announcement-day">{removeDisplayTime.day}</span>
//                       <span className="upload-announcement-unit">日</span>
//                     </div>
//                   </div>
//                   <div className="upload-announcement-datetime-section-time">
//                     <div className="upload-announcement-datetime-icon">
//                       <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
//                         <circle cx="14" cy="14" r="10.5" stroke="#C4D4E8" strokeWidth="2.33333"/>
//                         <path d="M14 7V14L18.6667 16.3333" stroke="#C4D4E8" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                     <div className="upload-announcement-datetime-display">
//                       {/* 🔥 根據權限禁用時鐘選擇器 */}
//                       <TimePickerInput
//                         value={removeTime}
//                         onChange={isReadOnlyMode ? null : (time) => setRemoveTime(time)}
//                         placeholder="選擇時間"
//                         disabled={isReadOnlyMode}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 🔥 修改：動作按鈕區域 - 根據權限顯示按鈕 */}
//         {!hideBottomButtons && hasEditPermission && (
//           <div className="upload-announcement-action-area">
//             <div className="upload-announcement-button-group">
//               {/* 取消按鈕 */}
//               <button className="upload-announcement-cancel-button" onClick={handleCancel}>
//                 <div className="upload-announcement-cancel-button-main-text">
//                   {isEditMode ? '返回' : '取消'}
//                 </div>
//                 <div className="upload-announcement-cancel-button-sub-text">
//                   {isEditMode ? '返回草稿' : '捨棄資料'}
//                 </div>
//               </button>

//               {/* 發布按鈕組 */}
//               <div className="upload-announcement-publish-group">
//                 <div className="upload-announcement-publish-buttons">
//                   {/* 🔥 修改：儲存草稿按鈕 - 根據編輯模式使用不同處理函數 */}
//                   <button 
//                     className="upload-announcement-save-draft-button" 
//                     onClick={isEditMode ? handleUpdateDraft : handleSaveDraft}
//                   >
//                     <div className="upload-announcement-save-draft-text">
//                       {isEditMode ? '儲存修改' : '儲存草稿'}
//                     </div>
//                   </button>

//                   {/* 🔥 修改：發布按鈕 - 根據編輯模式使用不同處理函數 */}
//                   <button 
//                     className="upload-announcement-publish-button" 
//                     onClick={isEditMode ? handleUpdateAndPublish : handlePublish}
//                   >
//                     <div className="upload-announcement-publish-button-main-text">完成</div>
//                     <div className="upload-announcement-publish-button-sub-text">
//                       {schedulePublish ? '排程後發布公告' : '立即發布公告'}
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 🔥 有權限且非只讀模式才顯示隱藏的文件輸入 */}
//         {!isReadOnlyMode && (
//           <>
//             <input
//               ref={attachmentInputRef}
//               type="file"
//               className="upload-announcement-hidden-file-input"
//               multiple
//               onChange={handleAttachmentUpload}
//             />
//             <input
//               ref={imageInputRef}
//               type="file"
//               className="upload-announcement-hidden-file-input"
//               accept="image/*"
//               multiple
//               onChange={handleImageUpload}
//             />
//           </>
//         )}

//         {/* 🔥 有權限且非只讀模式才顯示日曆選擇器 */}
//         {!isReadOnlyMode && (
//           <>
//             <CalendarSelector
//               isVisible={showPublishCalendar}
//               onClose={() => setShowPublishCalendar(false)}
//               onDateSelect={handlePublishDateSelect}
//               selectedDate={publishDate}
//             />

//             <CalendarSelector
//               isVisible={showRemoveCalendar}
//               onClose={() => setShowRemoveCalendar(false)}
//               onDateSelect={handleRemoveDateSelect}
//               selectedDate={removeDate}
//             />
//           </>
//         )}
//       </div>
//     );
//   };

//   // 渲染開發中訊息
//   const renderDevelopmentMessage = (feature) => (
//     <div className="upload-announcement-development-message">
//       <div className="upload-announcement-development-icon">🚧</div>
//       <h4 className="upload-announcement-development-title">{feature} 功能開發中</h4>
//       <p className="upload-announcement-development-text">
//         此功能正在開發中，敬請期待
//       </p>
//     </div>
//   );

//   // 🔥 修改編輯模式的返回，移除額外的側邊欄和功能選單
//   if (isEditMode) {
//     return (
//       <div className="upload-announcement-container">
//         {/* 🔥 使用正常的主要內容區域，確保響應式 */}
//         <div className="upload-announcement-main-content-area">
//           {renderCreateContent()}
//         </div>
//       </div>
//     );
//   }

//   // 在 Upload_Announcement.js 中修改 return 部分
//   return (
//     <div className="upload-announcement-container">
//       {/* 側邊欄區域 */}
//       <div className="upload-announcement-sidebar-wrapper">
//         <Sidebar currentPage="notice" />
//       </div>

//       {/* 功能表 */}
//       <div className="upload-announcement-submenu-wrapper">
//         <div className="upload-announcement-submenu-content">
//           {/* 建立新公告 */}
//           <div 
//             className={`upload-announcement-menu-item ${activeTab === 'create' ? 'active' : 'inactive'}`}
//             onClick={() => handleTabClick('create')}
//           >
//             <div className="upload-announcement-menu-icon">
//               <img 
//                 src={newAnnouncementIcon} 
//                 alt="建立新公告" 
//                 className={`upload-announcement-menu-icon-image ${activeTab === 'create' ? '' : 'upload-announcement-inactive-icon-image'}`}
//               />
//             </div>
//             <div className={`upload-announcement-menu-text ${activeTab === 'create' ? 'active' : 'inactive'}`}>
//               建立新公告
//             </div>
//           </div>

//           {/* 已排程公告 */}
//           <div 
//             className={`upload-announcement-menu-item ${activeTab === 'scheduled' ? 'active' : 'inactive'}`}
//             onClick={() => handleTabClick('scheduled')}
//           >
//             <div className="upload-announcement-menu-icon">
//               <img 
//                 src={scheduleAnnouncementIcon} 
//                 alt="已排程公告" 
//                 className={`upload-announcement-menu-icon-image ${activeTab === 'scheduled' ? '' : 'upload-announcement-inactive-icon-image'}`}
//               />
//             </div>
//             <div className={`upload-announcement-menu-text ${activeTab === 'scheduled' ? 'active' : 'inactive'}`}>
//               已排程公告
//             </div>
//           </div>

//           {/* 草稿 */}
//           <div 
//             className={`upload-announcement-menu-item ${activeTab === 'draft' ? 'active' : 'inactive'}`}
//             onClick={() => handleTabClick('draft')}
//           >
//             <div className="upload-announcement-menu-icon">
//               <img 
//                 src={draftIcon} 
//                 alt="草稿" 
//                 className={`upload-announcement-menu-icon-image ${activeTab === 'draft' ? '' : 'upload-announcement-inactive-icon-image'}`}
//               />
//             </div>
//             <div className={`upload-announcement-menu-text ${activeTab === 'draft' ? 'active' : 'inactive'}`}>
//               草稿
//             </div>
//           </div>

//           {/* 公告發布紀錄 */}
//           <div 
//             className={`upload-announcement-menu-item ${activeTab === 'record' ? 'active' : 'inactive'}`}
//             onClick={() => handleTabClick('record')}
//           >
//             <div className="upload-announcement-menu-icon">
//               <img 
//                 src={listIcon} 
//                 alt="公告發布紀錄" 
//                 className={`upload-announcement-menu-icon-image ${activeTab === 'record' ? '' : 'upload-announcement-inactive-icon-image'}`}
//               />
//             </div>
//             <div className={`upload-announcement-menu-text ${activeTab === 'record' ? 'active' : 'inactive'}`}>
//               公告發布紀錄
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🔥 修改：統一使用主要內容範圍容器 */}
//       <div className="upload-announcement-main-content-area">
//         {activeTab === 'create' && renderCreateContent()}
//         {activeTab === 'scheduled' && <ScheduleAnnouncement />}
//         {activeTab === 'draft' && <Draft />}
//         {activeTab === 'record' && <Release_Record />}
//       </div>
//     </div>
//   );
// };

// export default UploadAnnouncement;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../Hook/useAuth'; // 🔥 引入 useAuth
import Sidebar from '../Sidebar';
import './Upload_Announcement.css';
import ScheduleAnnouncement from './Schedule_Announcement/Schedule_Announcement';
import Draft from './Draft/Draft';
import Release_Record from './Release_Record/Release_Record';

// 🔥 引入 API_BASE_URL
import { API_BASE_URL } from '../../config';

// 引入圖標
import newAnnouncementIcon from '../ICON/New_Announcement.png';
import scheduleAnnouncementIcon from '../ICON/Schedule_Announcement.png';
import draftIcon from '../ICON/Draft.png';
import listIcon from '../ICON/List.png';
import uploadAttachmentsIcon from '../ICON/Upload_attachments.png';
import uploadPhotosIcon from '../ICON/Upload_photos.png';
import uploadedPhotosIcon from '../ICON/Uploaded_photos.png';
import uploadedAttachmentsIcon from '../ICON/Uploaded_attachments.png';
import trashIcon from '../ICON/tabler_trash.png';
import { TimePickerInput } from './SamllitemsForNot/Clock';
import CalendarSelector from './SamllitemsForNot/Calendar Selector';

// 🔥 新增 readOnly 參數
const UploadAnnouncement = ({ 
  editData = null, 
  isEditMode = false, 
  onSave = null, 
  onCancel = null, 
  hideBottomButtons = false,
  readOnly = false // 🔥 新增：只讀模式
}) => {
  // 🔥 使用 useAuth - 只用於 token 驗證
  const { hasValidAuth, logout } = useAuth();

  // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ UploadAnnouncement Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    console.log('✅ UploadAnnouncement Token 驗證通過');
  }, [hasValidAuth, logout]);

  const [activeTab, setActiveTab] = useState('create');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [images, setImages] = useState([]);
  const [schedulePublish, setSchedulePublish] = useState(false);
  const [scheduleRemove, setScheduleRemove] = useState(false);
  
  // 🔥 修改：分別管理日期和時間
  const [publishDate, setPublishDate] = useState(null); // 改為 Date 對象
  const [publishTime, setPublishTime] = useState('');
  const [removeDate, setRemoveDate] = useState(null); // 改為 Date 對象
  const [removeTime, setRemoveTime] = useState('');
  
  // 🔥 新增：日曆選擇器顯示狀態
  const [showPublishCalendar, setShowPublishCalendar] = useState(false);
  const [showRemoveCalendar, setShowRemoveCalendar] = useState(false);
  
  const attachmentInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // 🔥 新增：權限相關狀態
  const [permissions, setPermissions] = useState(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // 🔥 新增：檢查員工權限的 API 函數
  const checkEmployeePermissions = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 檢查員工權限時 Token 驗證失敗');
      logout();
      return {
        success: false,
        message: '身份驗證失敗',
        hasEditPermission: false
      };
    }

    try {
      const companyId = Cookies.get('company_id');
      const employeeId = Cookies.get('employee_id');
      
      if (!companyId || !employeeId) {
        return {
          success: false,
          message: '無法獲取公司ID或員工ID',
          hasEditPermission: false
        };
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/company/employee-permissions/${employeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-company-id': companyId
          },
          params: {
            company_id: companyId
          },
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );

      console.log('🔍 公告權限檢查 API 回應:', response.data);
      
      if (response.data && response.data.Status === 'Ok') {
        return {
          success: true,
          permissions: response.data.Data,
          hasEditPermission: response.data.Data?.raw_data?.upload_announcement === 1
        };
      } else {
        return {
          success: false,
          message: response.data?.Msg || '權限檢查失敗',
          hasEditPermission: false
        };
      }
    } catch (error) {
      console.error('❌ 公告權限檢查 API 錯誤:', error);
      return {
        success: false,
        message: error.message || '權限檢查失敗',
        hasEditPermission: false
      };
    }
  };

  // 🔥 新增：檢查權限
  useEffect(() => {
    const loadPermissions = async () => {
      setPermissionLoading(true);
      setPermissionError('');
      
      try {
        const result = await checkEmployeePermissions();
        
        if (result.success) {
          setPermissions(result.permissions);
          setHasEditPermission(result.hasEditPermission);
          console.log('✅ 公告權限檢查成功:', result.permissions);
          console.log('✅ 公告編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
        } else {
          setPermissionError(result.message);
          setHasEditPermission(false);
          console.error('❌ 公告權限檢查失敗:', result.message);
        }
      } catch (error) {
        setPermissionError('權限檢查發生錯誤');
        setHasEditPermission(false);
        console.error('❌ 公告權限檢查異常:', error);
      } finally {
        setPermissionLoading(false);
      }
    };

    loadPermissions();
  }, []);

  // 🔥 新增：從 cookies 獲取資料的輔助函數
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // 🔥 新增：處理更新草稿
  const handleUpdateDraft = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 更新草稿時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasEditPermission) {
      alert('您沒有權限編輯公告');
      return;
    }

    if (!title.trim()) {
      alert('請輸入公告標題！');
      return;
    }

    try {
      const currentDateTime = getCurrentDateTime();
      const updateData = {
        title: title.trim(),
        content: content.trim(),
        publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
        publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
        ...(scheduleRemove && removeDate && removeTime && {
          end_date: formatDate(removeDate),
          end_time: formatTime(removeTime)
        }),
        status: 'draft' // 🔥 更新草稿保持 draft 狀態
      };

      console.log('準備更新的草稿資料:', updateData);

      // 🔥 使用 PUT API 更新草稿
      const response = await fetch(`${API_BASE_URL}/api/announcements/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (response.ok && result.Status === 'Ok') {
        console.log('草稿更新成功:', result);
        alert('草稿已更新！');

        if (isEditMode && onSave) {
          onSave(result.Data, false);
        }

      } else {
        console.error('草稿更新失敗:', result);
        alert(`更新失敗：${result.Msg || '未知錯誤'}`);
      }

    } catch (error) {
      console.error('更新草稿時發生錯誤:', error);
      alert('更新失敗：網路錯誤，請稍後再試！');
    }
  };

  // 🔥 新增：處理更新並發布
  const handleUpdateAndPublish = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 更新並發布時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasEditPermission) {
      alert('您沒有權限編輯公告');
      return;
    }

    if (!title.trim()) {
      alert('請輸入公告標題！');
      return;
    }
    if (!content.trim()) {
      alert('請輸入公告內容！');
      return;
    }
    
    // 驗證排程時間
    if (schedulePublish) {
      if (!publishDate || !publishTime) {
        alert('請選擇完整的發布日期和時間！');
        return;
      }
      
      const publishDateTime = combineDateTime(publishDate, publishTime);
      const selectedTime = new Date(publishDateTime);
      const currentTime = new Date();
      
      if (selectedTime <= currentTime) {
        alert('發布時間必須晚於目前時間！');
        return;
      }
    }

    // 驗證下架時間
    if (scheduleRemove) {
      if (!removeDate || !removeTime) {
        alert('請選擇完整的下架日期和時間！');
        return;
      }
      
      const removeDateTime = combineDateTime(removeDate, removeTime);
      const publishDateTime = schedulePublish ? combineDateTime(publishDate, publishTime) : new Date().toISOString();
      const removeTimeObj = new Date(removeDateTime);
      const publishTimeObj = new Date(publishDateTime);
      
      if (removeTimeObj <= publishTimeObj) {
        alert('下架時間必須晚於發布時間！');
        return;
      }
    }

    try {
      const currentDateTime = getCurrentDateTime();
      const updateData = {
        title: title.trim(),
        content: content.trim(),
        publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
        publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
        ...(scheduleRemove && removeDate && removeTime && {
          end_date: formatDate(removeDate),
          end_time: formatTime(removeTime)
        }),
        status: 'published' // 🔥 更新並發布改為 published 狀態
      };

      console.log('準備更新並發布的資料:', updateData);

      // 🔥 使用 PUT API 更新並發布
      const response = await fetch(`${API_BASE_URL}/api/announcements/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (response.ok && result.Status === 'Ok') {
        console.log('公告更新並發布成功:', result);
        
        if (schedulePublish) {
          alert(`公告已排程於 ${formatDate(publishDate)} ${publishTime} 發布！`);
        } else {
          alert('公告已立即發布！');
        }

        if (isEditMode && onSave) {
          onSave(result.Data, true);
        }

      } else {
        console.error('API 錯誤:', result);
        alert(`發布失敗：${result.Msg || '未知錯誤'}`);
      }

    } catch (error) {
      console.error('更新並發布公告時發生錯誤:', error);
      alert('發布失敗：網路錯誤，請稍後再試！');
    }
  };

  // 🔥 新增：生成公告編號的函數
  const generateDocumentNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6); // 取時間戳後6位
    return `ANN-${year}${month}${day}-${timestamp}`;
  };

  // 🔥 新增：格式化日期為 YYYY-MM-DD 格式
  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 🔥 新增：格式化時間為 HH:MM:SS 格式
  const formatTime = (timeString) => {
    if (!timeString) return null;
    // 如果時間格式是 HH:MM，補上秒數
    if (timeString.length === 5) {
      return `${timeString}:00`;
    }
    return timeString;
  };

  // 🔥 新增：獲取當前日期和時間
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = formatDate(now);
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS 格式
    return { date, time };
  };

  // 🔥 新增：編輯模式初始化
  useEffect(() => {
    if (isEditMode && editData) {
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setAttachments(editData.attachments || []);
      setImages(editData.images || []);
      setSchedulePublish(editData.schedulePublish || false);
      setScheduleRemove(editData.scheduleRemove || false);
      
      // 處理日期時間
      if (editData.publishDateTime) {
        const publishDate = new Date(editData.publishDateTime);
        setPublishDate(publishDate);
        setPublishTime(publishDate.toTimeString().slice(0, 5));
      }
      
      if (editData.removeDateTime) {
        const removeDate = new Date(editData.removeDateTime);
        setRemoveDate(removeDate);
        setRemoveTime(removeDate.toTimeString().slice(0, 5));
      }
    }
  }, [isEditMode, editData]);

  // 🔥 新增：組合日期和時間的輔助函數
  const combineDateTime = (dateObj, time) => {
    if (!dateObj || !time) return '';
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${time}`;
  };

  // 🔥 新增：格式化日期顯示
  const formatDateDisplay = (dateObj) => {
    if (!dateObj) {
      return {
        year: '2024',
        month: '8',
        day: '26'
      };
    }
    
    return {
      year: dateObj.getFullYear().toString(),
      month: (dateObj.getMonth() + 1).toString(),
      day: dateObj.getDate().toString()
    };
  };

  // 處理標籤切換
  const handleTabClick = (tab) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 切換標籤時 Token 驗證失敗');
      logout();
      return;
    }

    setActiveTab(tab);
  };

  // 🔥 修改：處理標題輸入 - 加入權限檢查和身份驗證
  const handleTitleChange = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改標題時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    const value = e.target.value;
    if (value.length <= 36) {
      setTitle(value);
    }
  };

  // 🔥 修改：處理內容輸入 - 加入權限檢查和身份驗證
  const handleContentChange = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改內容時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    const value = e.target.value;
    if (value.length <= 800) {
      setContent(value);
    }
  };

  // 🔥 修改：處理附件上傳 - 加入權限檢查和身份驗證
  const handleAttachmentUpload = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 上傳附件時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    const files = Array.from(e.target.files);
    if (attachments.length + images.length + files.length <= 12) {
      const newAttachments = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        file: file,
        type: 'attachment'
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  // 🔥 修改：處理圖片上傳 - 加入權限檢查和身份驗證
  const handleImageUpload = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 上傳圖片時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    const files = Array.from(e.target.files);
    if (attachments.length + images.length + files.length <= 12) {
      const newImages = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        file: file,
        type: 'image',
        url: URL.createObjectURL(file)
      }));
      setImages([...images, ...newImages]);
    }
  };

  // 🔥 修改：刪除附件 - 加入權限檢查和身份驗證
  const handleDeleteAttachment = (id) => {
    if (!hasValidAuth()) {
      console.log('❌ 刪除附件時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setAttachments(attachments.filter(item => item.id !== id));
  };

  // 🔥 修改：刪除圖片 - 加入權限檢查和身份驗證
  const handleDeleteImage = (id) => {
    if (!hasValidAuth()) {
      console.log('❌ 刪除圖片時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    const imageToDelete = images.find(img => img.id === id);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.url);
    }
    setImages(images.filter(item => item.id !== id));
  };

  // 🔥 修改：處理排程發布切換 - 加入權限檢查和身份驗證
  const handleSchedulePublishToggle = () => {
    if (!hasValidAuth()) {
      console.log('❌ 切換排程發布時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setSchedulePublish(!schedulePublish);
    if (schedulePublish) {
      setPublishDate(null);
      setPublishTime('');
    }
  };

  // 🔥 修改：處理排程下架切換 - 加入權限檢查和身份驗證
  const handleScheduleRemoveToggle = () => {
    if (!hasValidAuth()) {
      console.log('❌ 切換排程下架時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setScheduleRemove(!scheduleRemove);
    if (scheduleRemove) {
      setRemoveDate(null);
      setRemoveTime('');
    }
  };

  // 🔥 修改：處理日期選擇 - 加入權限檢查和身份驗證
  const handlePublishDateSelect = (date) => {
    if (!hasValidAuth()) {
      console.log('❌ 選擇發布日期時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setPublishDate(date);
    setShowPublishCalendar(false);
  };

  const handleRemoveDateSelect = (date) => {
    if (!hasValidAuth()) {
      console.log('❌ 選擇下架日期時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setRemoveDate(date);
    setShowRemoveCalendar(false);
  };

  // 🔥 修改：處理日期點擊 - 加入權限檢查和身份驗證
  const handlePublishDateClick = () => {
    if (!hasValidAuth()) {
      console.log('❌ 點擊發布日期時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setShowPublishCalendar(true);
  };

  const handleRemoveDateClick = () => {
    if (!hasValidAuth()) {
      console.log('❌ 點擊下架日期時 Token 驗證失敗');
      logout();
      return;
    }

    if (readOnly || !hasEditPermission) return;
    setShowRemoveCalendar(true);
  };

  // 🔥 修改：處理取消
  const handleCancel = () => {
    if (isEditMode && onCancel) {
      onCancel();
      return;
    }
    
    if (window.confirm('確定要捨棄目前的編輯內容嗎？')) {
      setTitle('');
      setContent('');
      setAttachments([]);
      setImages([]);
      setSchedulePublish(false);
      setScheduleRemove(false);
      setPublishDate(null);
      setPublishTime('');
      setRemoveDate(null);
      setRemoveTime('');
    }
  };

  // 🔥 修改：處理儲存草稿 - 加入權限檢查和身份驗證
  const handleSaveDraft = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 儲存草稿時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasEditPermission) {
      alert('您沒有權限編輯公告');
      return;
    }

    if (!title.trim()) {
      alert('請輸入公告標題！');
      return;
    }

    try {
      const companyId = getCookie('company_id');
      const employeeId = getCookie('employee_id');
      
      if (!companyId || !employeeId) {
        alert('無法獲取用戶資訊，請重新登入！');
        return;
      }

      const currentDateTime = getCurrentDateTime();
      const draftData = {
        document_number: generateDocumentNumber(),
        company_id: companyId,
        employee_id: employeeId,
        title: title.trim(),
        content: content.trim(),
        publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
        publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
        ...(scheduleRemove && removeDate && removeTime && {
          end_date: formatDate(removeDate),
          end_time: formatTime(removeTime)
        }),
        status: 'draft' // 🔥 儲存草稿按鈕 → status: 'draft'
      };

      console.log('準備儲存的草稿資料:', draftData);

      // 🔥 使用 config 中的 API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData)
      });

      const result = await response.json();

      if (response.ok && result.Status === 'Ok') {
        console.log('草稿儲存成功:', result);
        alert('草稿已儲存！');

        if (isEditMode && onSave) {
          onSave(result.Data, false);
        }

      } else {
        console.error('草稿儲存失敗:', result);
        alert(`儲存失敗：${result.Msg || '未知錯誤'}`);
      }

    } catch (error) {
      console.error('儲存草稿時發生錯誤:', error);
      alert('儲存失敗：網路錯誤，請稍後再試！');
    }
  };

  // 🔥 修改：處理發布 - 加入權限檢查和身份驗證
  const handlePublish = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 發布公告時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasEditPermission) {
      alert('您沒有權限編輯公告');
      return;
    }

    if (!title.trim()) {
      alert('請輸入公告標題！');
      return;
    }
    if (!content.trim()) {
      alert('請輸入公告內容！');
      return;
    }
    
    // 驗證排程時間
    if (schedulePublish) {
      if (!publishDate || !publishTime) {
        alert('請選擇完整的發布日期和時間！');
        return;
      }
      
      const publishDateTime = combineDateTime(publishDate, publishTime);
      const selectedTime = new Date(publishDateTime);
      const currentTime = new Date();
      
      if (selectedTime <= currentTime) {
        alert('發布時間必須晚於目前時間！');
        return;
      }
    }

    // 驗證下架時間
    if (scheduleRemove) {
      if (!removeDate || !removeTime) {
        alert('請選擇完整的下架日期和時間！');
        return;
      }
      
      const removeDateTime = combineDateTime(removeDate, removeTime);
      const publishDateTime = schedulePublish ? combineDateTime(publishDate, publishTime) : new Date().toISOString();
      const removeTimeObj = new Date(removeDateTime);
      const publishTimeObj = new Date(publishDateTime);
      
      if (removeTimeObj <= publishTimeObj) {
        alert('下架時間必須晚於發布時間！');
        return;
      }
    }

    try {
      const companyId = getCookie('company_id');
      const employeeId = getCookie('employee_id');
      
      if (!companyId || !employeeId) {
        alert('無法獲取用戶資訊，請重新登入！');
        return;
      }

      const currentDateTime = getCurrentDateTime();
      const apiData = {
        document_number: generateDocumentNumber(),
        company_id: companyId,
        employee_id: employeeId,
        title: title.trim(),
        content: content.trim(),
        publish_date: schedulePublish && publishDate ? formatDate(publishDate) : currentDateTime.date,
        publish_time: schedulePublish && publishTime ? formatTime(publishTime) : currentDateTime.time,
        ...(scheduleRemove && removeDate && removeTime && {
          end_date: formatDate(removeDate),
          end_time: formatTime(removeTime)
        }),
        status: 'published' // 🔥 完成按鈕 → status: 'published'
      };

      console.log('準備發送的 API 資料:', apiData);

      // 🔥 使用 config 中的 API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (response.ok && result.Status === 'Ok') {
        console.log('公告創建成功:', result);
        
        if (schedulePublish) {
          alert(`公告已排程於 ${formatDate(publishDate)} ${publishTime} 發布！`);
        } else {
          alert('公告已立即發布！');
        }

        // 清空表單
        setTitle('');
        setContent('');
        setAttachments([]);
        setImages([]);
        setSchedulePublish(false);
        setScheduleRemove(false);
        setPublishDate(null);
        setPublishTime('');
        setRemoveDate(null);
        setRemoveTime('');

        if (isEditMode && onSave) {
          onSave(result.Data, true);
        }

      } else {
        console.error('API 錯誤:', result);
        alert(`發布失敗：${result.Msg || '未知錯誤'}`);
      }

    } catch (error) {
      console.error('發布公告時發生錯誤:', error);
      alert('發布失敗：網路錯誤，請稍後再試！');
    }
  };

  // 🔥 修改：渲染建立新公告內容
  const renderCreateContent = () => {
    const publishDisplayTime = formatDateDisplay(publishDate);
    const removeDisplayTime = formatDateDisplay(removeDate);

    // 🔥 權限載入中顯示
    if (permissionLoading) {
      return (
        <div className="upload-announcement-content-frame">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: '#666'
          }}>
            檢查權限中...
          </div>
        </div>
      );
    }

    // 🔥 權限錯誤顯示
    if (permissionError) {
      return (
        <div className="upload-announcement-content-frame">
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '15px',
            borderRadius: '4px',
            margin: '20px',
            border: '1px solid #ffeaa7',
            textAlign: 'center'
          }}>
            <strong>權限警告：</strong>{permissionError}
          </div>
        </div>
      );
    }

    // 🔥 計算是否應該禁用編輯功能
    const isReadOnlyMode = readOnly || !hasEditPermission;

    return (
      <div className="upload-announcement-content-frame">
        {/* 🔥 新增：只讀模式標題 */}
        {isEditMode && readOnly && (
          <div className="upload-announcement-readonly-header">
            <h3 style={{ 
              color: '#666', 
              marginBottom: '20px', 
              fontSize: '18px',
              fontWeight: 'normal'
            }}>
              查看公告內容
            </h3>
          </div>
        )}

        {/* 主編輯區域 */}
        <div className="upload-announcement-main-edit-area">
          <div className="upload-announcement-edit-content-container">
            {/* 文字編輯區域 */}
            <div className="upload-announcement-text-edit-area">
              {/* 標題區域 */}
              <div className="upload-announcement-title-frame">
                <input
                  type="text"
                  className="upload-announcement-title-input"
                  placeholder="中元節普渡祭拜活動"
                  value={title}
                  onChange={handleTitleChange}
                  readOnly={isReadOnlyMode} // 🔥 根據權限設定是否可編輯
                  style={isReadOnlyMode ? { 
                    cursor: 'default',
                    opacity: 0.8
                  } : {}}
                />
                {/* 🔥 只讀模式或無權限不顯示字數限制警告 */}
                {!isReadOnlyMode && (
                  <div className={`upload-announcement-title-limit-warning ${title.length > 30 ? 'show' : ''}`}>
                    標題上限36個字！
                  </div>
                )}
              </div>
              
              {/* 內文區域 */}
              <div className="upload-announcement-content-text-frame">
                <textarea
                  className="upload-announcement-content-textarea"
                  placeholder="寫點內容吧......"
                  value={content}
                  onChange={handleContentChange}
                  readOnly={isReadOnlyMode} // 🔥 根據權限設定是否可編輯
                  style={isReadOnlyMode ? { 
                    cursor: 'default',
                    resize: 'none',
                    opacity: 0.8
                  } : {}}
                />
                {/* 🔥 只讀模式或無權限不顯示字數限制警告 */}
                {!isReadOnlyMode && (
                  <div className={`upload-announcement-content-limit-warning ${content.length > 700 ? 'show' : ''}`}>
                    內文上限800字！
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 修改：附件上傳區域 - 根據權限隱藏上傳按鈕 */}
            <div className="upload-announcement-attachment-area">
              {/* 🔥 無權限或只讀模式不顯示上傳按鈕 */}
              {!isReadOnlyMode && (
                <>
                  {/* 上傳附件按鈕 */}
                  <button className="upload-announcement-upload-button" onClick={() => attachmentInputRef.current?.click()}>
                    <div className="upload-announcement-upload-border"></div>
                    <div className="upload-announcement-upload-icon">
                      <img 
                        src={uploadAttachmentsIcon} 
                        alt="上傳附件" 
                        className="upload-announcement-upload-icon-image"
                      />
                    </div>
                    <div className="upload-announcement-upload-text">上傳附件</div>
                  </button>

                  {/* 上傳圖片按鈕 */}
                  <button className="upload-announcement-upload-button" onClick={() => imageInputRef.current?.click()}>
                    <div className="upload-announcement-upload-border"></div>
                    <div className="upload-announcement-upload-icon">
                      <img 
                        src={uploadPhotosIcon} 
                        alt="上傳圖片" 
                        className="upload-announcement-upload-icon-image"
                      />
                    </div>
                    <div className="upload-announcement-upload-text">上傳圖片</div>
                  </button>
                </>
              )}

              {/* 🔥 修改：顯示已上傳的附件 - 根據權限移除刪除按鈕 */}
              {attachments.map((attachment) => (
                <div key={attachment.id} className="upload-announcement-uploaded-item attachment">
                  {/* 🔥 無權限或只讀模式不顯示刪除按鈕 */}
                  {!isReadOnlyMode && (
                    <button 
                      className="upload-announcement-delete-button" 
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <img 
                        src={trashIcon} 
                        alt="刪除" 
                        className="upload-announcement-delete-icon"
                      />
                    </button>
                  )}
                  <div className="upload-announcement-uploaded-icon">
                    <img 
                      src={uploadedAttachmentsIcon} 
                      alt="已上傳附件" 
                      className="upload-announcement-uploaded-icon-image"
                    />
                  </div>
                  <div className="upload-announcement-uploaded-name">
                    {attachment.name}
                  </div>
                </div>
              ))}

              {/* 🔥 修改：顯示已上傳的圖片 - 根據權限移除刪除按鈕 */}
              {images.map((image) => (
                <div key={image.id} className="upload-announcement-uploaded-item image">
                  {/* 🔥 無權限或只讀模式不顯示刪除按鈕 */}
                  {!isReadOnlyMode && (
                    <button 
                      className="upload-announcement-delete-button" 
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <img 
                        src={trashIcon} 
                        alt="刪除" 
                        className="upload-announcement-delete-icon"
                      />
                    </button>
                  )}
                  <div className="upload-announcement-uploaded-icon">
                    <img 
                      src={uploadedPhotosIcon} 
                      alt="已上傳照片" 
                      className="upload-announcement-uploaded-icon-image"
                    />
                  </div>
                  <div className="upload-announcement-uploaded-name">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 無權限或只讀模式不顯示附件數量限制提示 */}
            {!isReadOnlyMode && (
              <div className={`upload-announcement-attachment-limit-warning ${attachments.length + images.length > 10 ? 'show' : ''}`}>
                最多僅能上傳12個附件與圖片！
              </div>
            )}
          </div>
        </div>

        {/* 🔥 修改：設定區域 - 根據權限禁用所有開關 */}
        <div className="upload-announcement-settings-area">
          {/* 排程發布 */}
          <div className="upload-announcement-setting-item">
            <div className="upload-announcement-setting-content">
              <div className="upload-announcement-setting-title-group">
                <div className="upload-announcement-setting-title">預約發布</div>
                <div className="upload-announcement-setting-subtitle">設定時間發布公告</div>
              </div>
              <div 
                className="upload-announcement-toggle-switch" 
                onClick={isReadOnlyMode ? null : handleSchedulePublishToggle} // 🔥 根據權限禁用點擊
                style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
              >
                <div className={`upload-announcement-toggle-circle ${schedulePublish ? 'active' : 'inactive'}`}></div>
              </div>
            </div>
            {schedulePublish && (
              <div className="upload-announcement-datetime-picker show">
                <div className="upload-announcement-datetime-container">
                  <div 
                    className="upload-announcement-datetime-section" 
                    onClick={isReadOnlyMode ? null : handlePublishDateClick} // 🔥 根據權限禁用點擊
                    style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
                  >
                    <div className="upload-announcement-datetime-icon">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="3.5" y="5.25" width="21" height="19.25" rx="2" stroke="#C4D4E8" strokeWidth="2"/>
                        <path d="M8.75 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M19.25 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M3.5 12.25H24.5" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="upload-announcement-datetime-display">
                      <span className="upload-announcement-year">{publishDisplayTime.year}</span>
                      <span className="upload-announcement-unit">年</span>
                      <span className="upload-announcement-month">{publishDisplayTime.month}</span>
                      <span className="upload-announcement-unit">月</span>
                      <span className="upload-announcement-day">{publishDisplayTime.day}</span>
                      <span className="upload-announcement-unit">日</span>
                    </div>
                  </div>
                  <div className="upload-announcement-datetime-section-time">
                    <div className="upload-announcement-datetime-icon">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="10.5" stroke="#C4D4E8" strokeWidth="2.33333"/>
                        <path d="M14 7V14L18.6667 16.3333" stroke="#C4D4E8" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="upload-announcement-datetime-display">
                      {/* 🔥 根據權限禁用時鐘選擇器 */}
                      <TimePickerInput
                        value={publishTime}
                        onChange={isReadOnlyMode ? null : (time) => setPublishTime(time)}
                        placeholder="選擇時間"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 🔥 修改：公告下架時間 - 根據權限禁用 */}
          <div className="upload-announcement-setting-item">
            <div className="upload-announcement-setting-content">
              <div className="upload-announcement-setting-title-group">
                <div className="upload-announcement-setting-title">預約下架時間</div>
                <div className="upload-announcement-setting-subtitle">設定公告下架時間</div>
              </div>
              <div 
                className="upload-announcement-toggle-switch" 
                onClick={isReadOnlyMode ? null : handleScheduleRemoveToggle} // 🔥 根據權限禁用點擊
                style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
              >
                <div className={`upload-announcement-toggle-circle ${scheduleRemove ? 'active' : 'inactive'}`}></div>
              </div>
            </div>
            {scheduleRemove && (
              <div className="upload-announcement-datetime-picker show">
                <div className="upload-announcement-datetime-container">
                  <div 
                    className="upload-announcement-datetime-section" 
                    onClick={isReadOnlyMode ? null : handleRemoveDateClick} // 🔥 根據權限禁用點擊
                    style={isReadOnlyMode ? { cursor: 'default', opacity: 0.6 } : {}}
                  >
                    <div className="upload-announcement-datetime-icon">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="3.5" y="5.25" width="21" height="19.25" rx="2" stroke="#C4D4E8" strokeWidth="2"/>
                        <path d="M8.75 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M19.25 2.625V7.875" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M3.5 12.25H24.5" stroke="#C4D4E8" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="upload-announcement-datetime-display">
                      <span className="upload-announcement-year">{removeDisplayTime.year}</span>
                      <span className="upload-announcement-unit">年</span>
                      <span className="upload-announcement-month">{removeDisplayTime.month}</span>
                      <span className="upload-announcement-unit">月</span>
                      <span className="upload-announcement-day">{removeDisplayTime.day}</span>
                      <span className="upload-announcement-unit">日</span>
                    </div>
                  </div>
                  <div className="upload-announcement-datetime-section-time">
                    <div className="upload-announcement-datetime-icon">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="10.5" stroke="#C4D4E8" strokeWidth="2.33333"/>
                        <path d="M14 7V14L18.6667 16.3333" stroke="#C4D4E8" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="upload-announcement-datetime-display">
                      {/* 🔥 根據權限禁用時鐘選擇器 */}
                      <TimePickerInput
                        value={removeTime}
                        onChange={isReadOnlyMode ? null : (time) => setRemoveTime(time)}
                        placeholder="選擇時間"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 修改：動作按鈕區域 - 根據權限顯示按鈕 */}
        {!hideBottomButtons && hasEditPermission && (
          <div className="upload-announcement-action-area">
            <div className="upload-announcement-button-group">
              {/* 取消按鈕 */}
              <button className="upload-announcement-cancel-button" onClick={handleCancel}>
                <div className="upload-announcement-cancel-button-main-text">
                  {isEditMode ? '返回' : '取消'}
                </div>
                <div className="upload-announcement-cancel-button-sub-text">
                  {isEditMode ? '返回草稿' : '捨棄資料'}
                </div>
              </button>

              {/* 發布按鈕組 */}
              <div className="upload-announcement-publish-group">
                <div className="upload-announcement-publish-buttons">
                  {/* 🔥 修改：儲存草稿按鈕 - 根據編輯模式使用不同處理函數 */}
                  <button 
                    className="upload-announcement-save-draft-button" 
                    onClick={isEditMode ? handleUpdateDraft : handleSaveDraft}
                  >
                    <div className="upload-announcement-save-draft-text">
                      {isEditMode ? '儲存修改' : '儲存草稿'}
                    </div>
                  </button>

                  {/* 🔥 修改：發布按鈕 - 根據編輯模式使用不同處理函數 */}
                  <button 
                    className="upload-announcement-publish-button" 
                    onClick={isEditMode ? handleUpdateAndPublish : handlePublish}
                  >
                    <div className="upload-announcement-publish-button-main-text">完成</div>
                    <div className="upload-announcement-publish-button-sub-text">
                      {schedulePublish ? '排程後發布公告' : '立即發布公告'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 有權限且非只讀模式才顯示隱藏的文件輸入 */}
        {!isReadOnlyMode && (
          <>
            <input
              ref={attachmentInputRef}
              type="file"
              className="upload-announcement-hidden-file-input"
              multiple
              onChange={handleAttachmentUpload}
            />
            <input
              ref={imageInputRef}
              type="file"
              className="upload-announcement-hidden-file-input"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </>
        )}

        {/* 🔥 有權限且非只讀模式才顯示日曆選擇器 */}
        {!isReadOnlyMode && (
          <>
            <CalendarSelector
              isVisible={showPublishCalendar}
              onClose={() => setShowPublishCalendar(false)}
              onDateSelect={handlePublishDateSelect}
              selectedDate={publishDate}
            />

            <CalendarSelector
              isVisible={showRemoveCalendar}
              onClose={() => setShowRemoveCalendar(false)}
              onDateSelect={handleRemoveDateSelect}
              selectedDate={removeDate}
            />
          </>
        )}
      </div>
    );
  };

  // 渲染開發中訊息
  const renderDevelopmentMessage = (feature) => (
    <div className="upload-announcement-development-message">
      <div className="upload-announcement-development-icon">🚧</div>
      <h4 className="upload-announcement-development-title">{feature} 功能開發中</h4>
      <p className="upload-announcement-development-text">
        此功能正在開發中，敬請期待
      </p>
    </div>
  );

  // 🔥 修改編輯模式的返回，移除額外的側邊欄和功能選單
  if (isEditMode) {
    return (
      <div className="upload-announcement-container">
        {/* 🔥 使用正常的主要內容區域，確保響應式 */}
        <div className="upload-announcement-main-content-area">
          {renderCreateContent()}
        </div>
      </div>
    );
  }

  // 在 Upload_Announcement.js 中修改 return 部分
  return (
    <div className="upload-announcement-container">
      {/* 側邊欄區域 */}
      <div className="upload-announcement-sidebar-wrapper">
        <Sidebar currentPage="notice" />
      </div>

      {/* 功能表 */}
      <div className="upload-announcement-submenu-wrapper">
        <div className="upload-announcement-submenu-content">
          {/* 建立新公告 */}
          <div 
            className={`upload-announcement-menu-item ${activeTab === 'create' ? 'active' : 'inactive'}`}
            onClick={() => handleTabClick('create')}
          >
            <div className="upload-announcement-menu-icon">
              <img 
                src={newAnnouncementIcon} 
                alt="建立新公告" 
                className={`upload-announcement-menu-icon-image ${activeTab === 'create' ? '' : 'upload-announcement-inactive-icon-image'}`}
              />
            </div>
            <div className={`upload-announcement-menu-text ${activeTab === 'create' ? 'active' : 'inactive'}`}>
              建立新公告
            </div>
          </div>

          {/* 已排程公告 */}
          <div 
            className={`upload-announcement-menu-item ${activeTab === 'scheduled' ? 'active' : 'inactive'}`}
            onClick={() => handleTabClick('scheduled')}
          >
            <div className="upload-announcement-menu-icon">
              <img 
                src={scheduleAnnouncementIcon} 
                alt="已排程公告" 
                className={`upload-announcement-menu-icon-image ${activeTab === 'scheduled' ? '' : 'upload-announcement-inactive-icon-image'}`}
              />
            </div>
            <div className={`upload-announcement-menu-text ${activeTab === 'scheduled' ? 'active' : 'inactive'}`}>
              已排程公告
            </div>
          </div>

          {/* 草稿 */}
          <div 
            className={`upload-announcement-menu-item ${activeTab === 'draft' ? 'active' : 'inactive'}`}
            onClick={() => handleTabClick('draft')}
          >
            <div className="upload-announcement-menu-icon">
              <img 
                src={draftIcon} 
                alt="草稿" 
                className={`upload-announcement-menu-icon-image ${activeTab === 'draft' ? '' : 'upload-announcement-inactive-icon-image'}`}
              />
            </div>
            <div className={`upload-announcement-menu-text ${activeTab === 'draft' ? 'active' : 'inactive'}`}>
              草稿
            </div>
          </div>

          {/* 公告發布紀錄 */}
          <div 
            className={`upload-announcement-menu-item ${activeTab === 'record' ? 'active' : 'inactive'}`}
            onClick={() => handleTabClick('record')}
          >
            <div className="upload-announcement-menu-icon">
              <img 
                src={listIcon} 
                alt="公告發布紀錄" 
                className={`upload-announcement-menu-icon-image ${activeTab === 'record' ? '' : 'upload-announcement-inactive-icon-image'}`}
              />
            </div>
            <div className={`upload-announcement-menu-text ${activeTab === 'record' ? 'active' : 'inactive'}`}>
              公告發布紀錄
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 修改：統一使用主要內容範圍容器 */}
      <div className="upload-announcement-main-content-area">
        {activeTab === 'create' && renderCreateContent()}
        {activeTab === 'scheduled' && <ScheduleAnnouncement />}
        {activeTab === 'draft' && <Draft />}
        {activeTab === 'record' && <Release_Record />}
      </div>
    </div>
  );
};

export default UploadAnnouncement;
