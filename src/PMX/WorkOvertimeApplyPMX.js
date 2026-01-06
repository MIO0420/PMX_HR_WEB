// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import './PMX_CSS/WorkOvertimeApplyPMX.css';
// import { validateUserFromCookies } from './function/function';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
// import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
// // 後端API地址
// const APPLICATION_FORMS_API = "https://rabbit.54ucl.com:3004/application-forms";
// const NEW_API_URL = "https://rabbit.54ucl.com:3004"; // 新系統API基礎地址

// function WorkOvertimeApply() {
//   // 獲取當前日期和時間的函數
//   const getCurrentDateTimeInfo = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth() + 1;
//     const day = now.getDate();
    
//     // 獲取星期幾
//     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//     const weekday = weekdays[now.getDay()];
    
//     // 格式化日期
//     const formattedDate = `${year}年 ${month}月${day}日`;
    
//     // 獲取當前時間，並向上取整到最近的半小時
//     const hours = now.getHours();
//     const minutes = now.getMinutes() >= 30 ? 30 : 0;
//     const formattedStartTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
//     // 設定結束時間為開始時間後2小時
//     const endTime = new Date(now);
//     endTime.setHours(hours + 2);
//     endTime.setMinutes(minutes);
//     const formattedEndTime = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
    
//     return {
//       formattedDate,
//       weekday,
//       formattedStartTime,
//       formattedEndTime
//     };
//   };

//   // 獲取當前日期時間信息
//   const currentDateTimeInfo = getCurrentDateTimeInfo();

//   const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
//   const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedStartTime);
//   const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
//   const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedEndTime);
//   const [totalTime, setTotalTime] = useState('2小時 0分鐘');
//   const [overtimeType, setOvertimeType] = useState('平日加班');
//   const [showOvertimeTypeOptions, setShowOvertimeTypeOptions] = useState(false);
//   const [reason, setReason] = useState('');
//   const [selectedOption, setSelectedOption] = useState('加班費');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formId, setFormId] = useState('');
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [overtimeTypeValue, setOvertimeTypeValue] = useState('Overtime on Workdays');
//   const [employeeInfo, setEmployeeInfo] = useState(null);
//   const formSubmitInProgress = useRef(false);
//   const [authToken, setAuthToken] = useState('');
//   const [companyId, setCompanyId] = useState('');
//   const [employeeId, setEmployeeId] = useState('');

//   // 日期時間選擇器狀態
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [isEditingStart, setIsEditingStart] = useState(true);
//   const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday);

//   // 使用共用驗證函數進行用戶驗證
//   useEffect(() => {
//     validateUserFromCookies(
//       setLoading,
//       setAuthToken,
//       setCompanyId,
//       setEmployeeId
//     );
//   }, []);

//   // 生成表單編號函數
//   const generateFormNumber = () => {
//     const now = new Date();
//     const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
//     const year = taiwanTime.getUTCFullYear();
//     const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
//     const datePart = `${year}${month}${day}`;
//     const randomNumber = Math.floor(Math.random() * 99999) + 1;
//     const sequenceNumber = String(randomNumber).padStart(5, '0');
    
//     return `${datePart}${sequenceNumber}`;
//   };

//   // 獲取表單ID
//   useEffect(() => {
//     if (!companyId || formId) return;
    
//     const fetchFormIdOnce = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${NEW_API_URL}/api/get-form-id/${companyId}`);
//         const data = await response.json();
        
//         if (data.success) {
//           setFormId(data.formId);
//           console.log(`已設置 ${companyId} 的表單ID: ${data.formId}`);
//         } else {
//           const generatedFormId = generateFormNumber();
//           setFormId(generatedFormId);
//           console.log(`API 調用失敗，使用生成的表單ID: ${generatedFormId}`);
//         }
//       } catch (err) {
//         const generatedFormId = generateFormNumber();
//         setFormId(generatedFormId);
//         console.log(`發生錯誤，使用生成的表單ID: ${generatedFormId}`, err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchFormIdOnce();
//   }, [companyId, formId]);

//   // 查詢員工基本資料
//   useEffect(() => {
//     if (!companyId || !employeeId || !authToken) return;
    
//     const fetchEmployeeInfo = async () => {
//       try {
//         setLoading(true);
        
//         const response = await fetch(`${NEW_API_URL}/api/employee/info`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authToken}`
//           },
//           body: JSON.stringify({
//             company_id: companyId,
//             employee_id: employeeId
//           })
//         });
        
//         const result = await response.json();
        
//         if (result.Status === "Ok") {
//           setEmployeeInfo(result.Data);
//           console.log('員工資料查詢成功:', result.Data);
//         } else {
//           console.error('員工資料查詢失敗:', result.Msg);
//           setError(`員工資料查詢失敗: ${result.Msg}`);
//         }
//       } catch (err) {
//         console.error('查詢員工資料時發生錯誤:', err);
//         setError(`查詢員工資料時發生錯誤: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchEmployeeInfo();
//   }, [companyId, employeeId, authToken]);

//   // 加班類型選項
//   const overtimeTypes = [
//     { name: '平日加班', category: '加班類型', value: 'Overtime on Workdays' },
//     { name: '休息日加班', category: '加班類型', value: 'Overtime on Rest Days' },
//     { name: '例假日加班', category: '加班類型', value: 'Overtime on Regular Holidays' },
//     { name: '休假日加班', category: '加班類型', value: 'Overtime on Leave Days' }
//   ];

//   // 格式化日期為 API 格式 (YYYY-MM-DD)
//   const formatDateForApi = (dateStr) => {
//     const match = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
//     if (match) {
//       const year = parseInt(match[1]);
//       const month = parseInt(match[2]);
//       const day = parseInt(match[3]);
//       return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     }
//     return '';
//   };

//   // 處理日期點擊
//   const handleDateClick = (isStart) => {
//     setIsEditingStart(isStart);
//     setShowDatePicker(true);
//   };
  
//   // 處理時間點擊
//   const handleTimeClick = (isStart) => {
//     setIsEditingStart(isStart);
//     setShowTimePicker(true);
//   };
  
//   // 處理日期選擇 - 修改版本，實現自動流程
//   const handleDateSelect = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     const formattedDate = `${year}年 ${month}月${day}日`;
    
//     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//     const weekday = weekdays[date.getDay()];
    
//     if (isEditingStart) {
//       // 選擇開始日期
//       setStartDate(formattedDate);
//       setSelectedWeekday(weekday);
//       setShowDatePicker(false);
//       calculateTotalTime();
      
//       // 自動開啟開始時間選擇
//       setTimeout(() => {
//         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
//       }, 300);
      
//     } else {
//       // 選擇結束日期
//       setEndDate(formattedDate);
//       setSelectedWeekday(weekday);
//       setShowDatePicker(false);
//       calculateTotalTime();
      
//       // 自動開啟結束時間選擇
//       setTimeout(() => {
//         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = false
//       }, 300);
//     }
//   };
  
//   // 處理時間選擇 - 修改版本，實現自動流程
//   const handleTimeSelect = (hour, minute) => {
//     const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
//     if (isEditingStart) {
//       // 選擇開始時間
//       setStartTime(formattedTime);
//       setShowTimePicker(false);
//       calculateTotalTime();
      
//       // 自動開啟結束日期選擇
//       setTimeout(() => {
//         setIsEditingStart(false); // 切換到編輯結束日期
//         setShowDatePicker(true);  // 開啟日期選擇器
//       }, 300);
      
//     } else {
//       // 選擇結束時間
//       setEndTime(formattedTime);
//       setShowTimePicker(false);
//       calculateTotalTime();
      
//       // 完成所有選擇，重置狀態
//       setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
//     }
//   };

//   // 計算總時數
//   const calculateTotalTime = useCallback(() => {
//     const parseDateTime = (dateStr, timeStr) => {
//       try {
//         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
//         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
//         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
//         const [hours, minutes] = timeStr.split(':').map(Number);
        
//         return new Date(year, month, day, hours, minutes);
//       } catch (e) {
//         console.error('日期時間解析錯誤', e);
//         return new Date();
//       }
//     };
    
//     try {
//       const startDateTime = parseDateTime(startDate, startTime);
//       const endDateTime = parseDateTime(endDate, endTime);
      
//       const diffMs = endDateTime - startDateTime;
      
//       if (diffMs < 0) {
//         setTotalTime('0小時 0分鐘');
//         return;
//       }
      
//       const hours = Math.floor(diffMs / (60 * 60 * 1000));
//       const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
//       setTotalTime(`${hours}小時 ${minutes}分鐘`);
//     } catch (e) {
//       console.error('日期時間計算錯誤', e);
//       setTotalTime('0小時 0分鐘');
//     }
//   }, [startDate, startTime, endDate, endTime]);
  
//   useEffect(() => {
//     calculateTotalTime();
//   }, [startDate, startTime, endDate, endTime, calculateTotalTime]);

//   // 處理加班類型點擊
//   const handleOvertimeTypeClick = () => {
//     setShowOvertimeTypeOptions(true);
//     setShowDatePicker(false);
//     setShowTimePicker(false);
//   };

//   // 處理加班類型選擇
//   const handleOvertimeTypeSelect = (type) => {
//     setOvertimeType(type.name);
//     setOvertimeTypeValue(type.value);
//     setShowOvertimeTypeOptions(false);
//   };

//   // 處理表單提交
//   const handleSubmit = async () => {
//     if (loading || formSubmitInProgress.current) {
//       console.log('表單提交已在進行中，跳過重複提交');
//       return;
//     }
    
//     if (!companyId || !employeeId || !authToken) {
//       alert('認證資訊不完整，請重新登入');
//       return;
//     }
    
//     if (!reason.trim()) {
//       alert('請填寫加班事由');
//       return;
//     }
    
//     try {
//       formSubmitInProgress.current = true;
//       setLoading(true);
      
//       const applicationId = generateFormNumber();
//       const formattedStartDate = formatDateForApi(startDate);
//       const formattedEndDate = formatDateForApi(endDate);
      
//       const parseDateTime = (dateStr, timeStr) => {
//         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
//         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
//         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
//         const [hours, minutes] = timeStr.split(':').map(Number);
        
//         return new Date(year, month, day, hours, minutes);
//       };
      
//       const startDateTime = parseDateTime(startDate, startTime);
//       const endDateTime = parseDateTime(endDate, endTime);
//       const diffMs = endDateTime - startDateTime;
//       const totalHours = diffMs / (60 * 60 * 1000);
      
//       if (totalHours <= 0) {
//         alert('加班時間必須大於0');
//         setLoading(false);
//         formSubmitInProgress.current = false;
//         return;
//       }
      
//       const now = new Date();
//       const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
//       const applicationDate = `${taiwanTime.getUTCFullYear()}-${String(taiwanTime.getUTCMonth() + 1).padStart(2, '0')}-${String(taiwanTime.getUTCDate()).padStart(2, '0')}`;
//       const applicationTime = `${String(taiwanTime.getUTCHours()).padStart(2, '0')}:${String(taiwanTime.getUTCMinutes()).padStart(2, '0')}:${String(taiwanTime.getUTCSeconds()).padStart(2, '0')}`;
      
//       const employeeDepartment = employeeInfo?.department || '';
//       const employeePosition = employeeInfo?.position || '';
//       const employeeJobGrade = employeeInfo?.job_grade || '';
//       const employeeSupervisor = employeeInfo?.supervisor || '';
      
//       const response = await fetch(APPLICATION_FORMS_API, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           employee_id: parseInt(employeeId),
//           company_id: parseInt(companyId),
//           employee_name: employeeInfo?.name || '',
//           id_number: employeeInfo?.id_number || '',
//           mobile_number: employeeInfo?.mobile_number || '',
//           department: employeeDepartment || '',
//           position: employeePosition || '',
//           job_grade: employeeJobGrade || '',
//           category: "work_overtime",
//           type: overtimeType,
//           compensation_type: selectedOption,
//           application_date: applicationDate,
//           application_time: applicationTime,
//           date: formattedStartDate,
//           start_date: formattedStartDate,
//           start_time: `${startTime}:00`,
//           end_date: formattedEndDate,
//           end_time: `${endTime}:00`,
//           total_hours: parseFloat(totalHours.toFixed(2)),
//           total_calculation_hours: parseFloat(totalHours.toFixed(2)),
//           illustrate: reason,
//           description: reason,
//           reviewer: employeeSupervisor || '',
//           application_status: '待審核',
//           application_id: applicationId,
//           form_id: formId || ''
//         }),
//       });
      
//       const result = await response.json();
      
//       if (result.Status === "Ok") {
//         console.log('加班申請提交成功:', result);
//         alert('加班申請已成功提交');
//         window.location.href = '/workovertime01';
//       } else {
//         throw new Error(result.Msg || '提交失敗');
//       }
//     } catch (err) {
//       if (err.name === 'AbortError') {
//         console.error('提交請求超時');
//         alert('提交請求超時，請稍後再試');
//       } else {
//         console.error('加班申請失敗:', err);
//         setError(err.message || '提交表單時發生錯誤');
//         alert(`提交失敗: ${err.message || '未知錯誤'}`);
//       }
//     } finally {
//       setLoading(false);
//       formSubmitInProgress.current = false;
//     }
//   };
  
//   // 處理返回首頁
//   const handleGoHome = () => {
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
  
//   const handleCancel = () => {
//     console.log('取消加班申請');
//     window.location.href = '/workovertime01';
//   };

//   const handleAddAttachment = () => {
//     console.log('新增附件');
//     alert('附件功能尚未開放，請在說明欄位中描述相關資訊');
//   };
  
//   const handleReasonChange = (e) => {
//     setReason(e.target.value);
//   };
  
//   const handleOptionSelect = (option) => {
//     setSelectedOption(option);
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
//       <div className="overtime-error-container">
//         <div className="overtime-error-message">
//           <div className="overtime-error-icon">⚠️</div>
//           <div className="overtime-error-text">{message}</div>
//           <button className="overtime-error-close" onClick={onClose}>✕</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="overtime-container">
//       <div className="overtime-app-wrapper">
//         {/* 頂部導航欄 */}
//         <div className="overtime-header">
//           <div className="overtime-home-icon" onClick={handleGoHome}>
//             <img 
//               src={homeIcon} 
//               alt="首頁" 
//               width="22" 
//               height="22" 
//               style={{ objectFit: 'contain' }}
//             />
//           </div>
//           <div className="overtime-page-title">加班申請</div>
//         </div>

//         {/* 顯示錯誤訊息 */}
//         {error && (
//           <ErrorMessage 
//             message={error} 
//             onClose={() => setError(null)} 
//           />
//         )}

//         {/* 表單內容 */}
//         <div className="overtime-form-container">
//           {/* 加班類型 */}
//           <div className="overtime-form-row">
//             <div className="overtime-form-label">加班類型</div>
//             <div className="overtime-form-value">
//             <div className="overtime-type-selector" onClick={handleOvertimeTypeClick}>
//                 <div className="overtime-type-name">{overtimeType}</div>
//                 <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#666666">
//                   <path d="M0 0h24v24H0V0z" fill="none"/>
//                   <path d="M7 10l5 5 5-5H7z"/>
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           {/* 開始時間 */}
//           <div className="overtime-form-row">
//             <div className="overtime-form-label">開始時間</div>
//             <div className="overtime-form-value">
//               <div className="overtime-date-time-row">
//                 <div className="overtime-date-time" onClick={() => handleDateClick(true)}>
//                   {startDate} <span className="overtime-weekday">{selectedWeekday}</span>
//                 </div>
//                 <div className="overtime-time-input" onClick={() => handleTimeClick(true)}>
//                   {startTime}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* 結束時間 */}
//           <div className="overtime-form-row">
//             <div className="overtime-form-label">結束時間</div>
//             <div className="overtime-form-value">
//               <div className="overtime-date-time-row">
//                 <div className="overtime-date-time" onClick={() => handleDateClick(false)}>
//                   {endDate} <span className="overtime-weekday">{selectedWeekday}</span>
//                 </div>
//                 <div className="overtime-time-input" onClick={() => handleTimeClick(false)}>
//                   {endTime}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* 總時數 */}
//           <div className="overtime-form-row">
//             <div className="overtime-form-label">總時數</div>
//             <div className="overtime-form-value">
//               <div className="overtime-hours">{totalTime}</div>
//             </div>
//           </div>
          
//           {/* 說明 */}
//           <div className="overtime-description-container">
//             <div className="overtime-description-label">加班事由</div>
//             <textarea 
//               className="overtime-description-textarea" 
//               placeholder="請輸入加班事由..." 
//               value={reason}
//               onChange={handleReasonChange}
//             />
//             <button className="overtime-attachment-button" onClick={handleAddAttachment}>
//               <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#3a75b5" className="overtime-attachment-icon">
//                 <path d="M0 0h24v24H0V0z" fill="none"/>
//                 <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
//               </svg>
//               新增附件
//             </button>
//           </div>
          
//           {/* 加班費/換休選項 */}
//           <div className="overtime-options-container">
//             <button 
//               className={`overtime-option-button ${selectedOption === '加班費' ? 'overtime-option-button-active' : 'overtime-option-button-inactive'}`}
//               onClick={() => handleOptionSelect('加班費')}
//             >
//               加班費
//             </button>
//             <button 
//               className={`overtime-option-button ${selectedOption === '換休' ? 'overtime-option-button-active' : 'overtime-option-button-inactive'}`}
//               onClick={() => handleOptionSelect('換休')}
//             >
//               換休
//             </button>
//           </div>
//         </div>
        
//         {/* 底部按鈕 */}
//         <div className="overtime-button-container">
//           <button 
//             className="overtime-cancel-button" 
//             onClick={handleCancel}
//             disabled={loading || formSubmitInProgress.current}
//           >
//             取消
//           </button>
//           <button 
//             className={`overtime-submit-button ${loading || formSubmitInProgress.current ? 'overtime-button-loading' : ''}`}
//             onClick={handleSubmit}
//             disabled={loading || formSubmitInProgress.current || !reason.trim()}
//           >
//             {loading || formSubmitInProgress.current ? '提交中...' : '提交'}
//           </button>
//         </div>
        
//         {/* 加班類型選項 */}
//         {showOvertimeTypeOptions && (
//           <>
//             <div className="overtime-overlay" onClick={() => setShowOvertimeTypeOptions(false)}></div>
//             <div className="overtime-type-options-container">
//               <div className="overtime-type-category">加班類型</div>
//               {overtimeTypes.map((type, index) => (
//                 <div 
//                   key={index} 
//                   className="overtime-type-option"
//                   onClick={() => handleOvertimeTypeSelect(type)}
//                 >
//                   {type.name}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
        
//         {/* 使用新的 CalendarSelector 組件 */}
//         <CalendarSelector
//           isVisible={showDatePicker}
//           onClose={() => setShowDatePicker(false)}
//           onDateSelect={handleDateSelect}
//           isEditingStart={isEditingStart}
//         />
        
//         {/* 使用新的 TimeSelector 組件 */}
//         <TimeSelector
//           isVisible={showTimePicker}
//           onClose={() => setShowTimePicker(false)}
//           onTimeSelect={handleTimeSelect}
//           currentTime={isEditingStart ? startTime : endTime}
//           isEditingStart={isEditingStart}
//         />
        
//         {/* 載入中指示器 */}
//         {loading && (
//           <div className="overtime-loading-overlay">
//             <div className="overtime-loading-spinner"></div>
//             <div className="overtime-loading-text">處理中，請稍候...</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default WorkOvertimeApply;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PMX_CSS/WorkOvertimeApplyPMX.css';
import { validateUserFromCookies } from './function/function';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
import { API_BASE_URL } from '../config';

// 後端API地址
const APPLICATION_FORMS_API = `${API_BASE_URL}/api/application-forms`;
const NEW_API_URL = API_BASE_URL; // 新系統API基礎地址

function WorkOvertimeApply() {
  // 獲取當前日期和時間的函數
  const getCurrentDateTimeInfo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 獲取星期幾
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[now.getDay()];
    
    // 格式化日期
    const formattedDate = `${year}年 ${month}月${day}日`;
    
    // 獲取當前時間，並向上取整到最近的半小時
    const hours = now.getHours();
    const minutes = now.getMinutes() >= 30 ? 30 : 0;
    const formattedStartTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // 設定結束時間為開始時間後2小時
    const endTime = new Date(now);
    endTime.setHours(hours + 2);
    endTime.setMinutes(minutes);
    const formattedEndTime = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
    
    return {
      formattedDate,
      weekday,
      formattedStartTime,
      formattedEndTime
    };
  };

  // 獲取當前日期時間信息
  const currentDateTimeInfo = getCurrentDateTimeInfo();

  const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
  const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedStartTime);
  const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
  const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedEndTime);
  const [totalTime, setTotalTime] = useState('2小時 0分鐘');
  const [overtimeType, setOvertimeType] = useState('平日加班');
  const [showOvertimeTypeOptions, setShowOvertimeTypeOptions] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedOption, setSelectedOption] = useState('加班費');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formId, setFormId] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [overtimeTypeValue, setOvertimeTypeValue] = useState('Overtime on Workdays');
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const formSubmitInProgress = useRef(false);
  const [authToken, setAuthToken] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // 日期時間選擇器狀態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isEditingStart, setIsEditingStart] = useState(true);
  const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday);

  // 使用共用驗證函數進行用戶驗證
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

  // 生成表單編號函數
  const generateFormNumber = () => {
    const now = new Date();
    const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    const year = taiwanTime.getUTCFullYear();
    const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
    const datePart = `${year}${month}${day}`;
    const randomNumber = Math.floor(Math.random() * 99999) + 1;
    const sequenceNumber = String(randomNumber).padStart(5, '0');
    
    return `${datePart}${sequenceNumber}`;
  };

  // 獲取表單ID
  useEffect(() => {
    if (!companyId || formId) return;
    
    const fetchFormIdOnce = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${NEW_API_URL}/api/get-form-id/${companyId}`);
        const data = await response.json();
        
        if (data.success) {
          setFormId(data.formId);
          console.log(`已設置 ${companyId} 的表單ID: ${data.formId}`);
        } else {
          const generatedFormId = generateFormNumber();
          setFormId(generatedFormId);
          console.log(`API 調用失敗，使用生成的表單ID: ${generatedFormId}`);
        }
      } catch (err) {
        const generatedFormId = generateFormNumber();
        setFormId(generatedFormId);
        console.log(`發生錯誤，使用生成的表單ID: ${generatedFormId}`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormIdOnce();
  }, [companyId, formId]);

  // 查詢員工基本資料
  useEffect(() => {
    if (!companyId || !employeeId || !authToken) return;
    
    const fetchEmployeeInfo = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${NEW_API_URL}/api/employee/info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            company_id: companyId,
            employee_id: employeeId
          })
        });
        
        const result = await response.json();
        
        if (result.Status === "Ok") {
          setEmployeeInfo(result.Data);
          console.log('員工資料查詢成功:', result.Data);
        } else {
          console.error('員工資料查詢失敗:', result.Msg);
          setError(`員工資料查詢失敗: ${result.Msg}`);
        }
      } catch (err) {
        console.error('查詢員工資料時發生錯誤:', err);
        setError(`查詢員工資料時發生錯誤: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployeeInfo();
  }, [companyId, employeeId, authToken]);

  // 加班類型選項
  const overtimeTypes = [
    { name: '平日加班', category: '加班類型', value: 'Overtime on Workdays' },
    { name: '休息日加班', category: '加班類型', value: 'Overtime on Rest Days' },
    { name: '例假日加班', category: '加班類型', value: 'Overtime on Regular Holidays' },
    { name: '休假日加班', category: '加班類型', value: 'Overtime on Leave Days' }
  ];

  // 格式化日期為 API 格式 (YYYY-MM-DD)
  const formatDateForApi = (dateStr) => {
    const match = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]);
      const day = parseInt(match[3]);
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return '';
  };

  // 處理日期點擊
  const handleDateClick = (isStart) => {
    setIsEditingStart(isStart);
    setShowDatePicker(true);
  };
  
  // 處理時間點擊
  const handleTimeClick = (isStart) => {
    setIsEditingStart(isStart);
    setShowTimePicker(true);
  };
  
  // 處理日期選擇 - 修改版本，實現自動流程
  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}年 ${month}月${day}日`;
    
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[date.getDay()];
    
    if (isEditingStart) {
      // 選擇開始日期
      setStartDate(formattedDate);
      setSelectedWeekday(weekday);
      setShowDatePicker(false);
      calculateTotalTime();
      
      // 自動開啟開始時間選擇
      setTimeout(() => {
        setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
      }, 300);
      
    } else {
      // 選擇結束日期
      setEndDate(formattedDate);
      setSelectedWeekday(weekday);
      setShowDatePicker(false);
      calculateTotalTime();
      
      // 自動開啟結束時間選擇
      setTimeout(() => {
        setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = false
      }, 300);
    }
  };
  
  // 處理時間選擇 - 修改版本，實現自動流程
  const handleTimeSelect = (hour, minute) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    if (isEditingStart) {
      // 選擇開始時間
      setStartTime(formattedTime);
      setShowTimePicker(false);
      calculateTotalTime();
      
      // 自動開啟結束日期選擇
      setTimeout(() => {
        setIsEditingStart(false); // 切換到編輯結束日期
        setShowDatePicker(true);  // 開啟日期選擇器
      }, 300);
      
    } else {
      // 選擇結束時間
      setEndTime(formattedTime);
      setShowTimePicker(false);
      calculateTotalTime();
      
      // 完成所有選擇，重置狀態
      setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
    }
  };

  // 計算總時數
  const calculateTotalTime = useCallback(() => {
    const parseDateTime = (dateStr, timeStr) => {
      try {
        const year = parseInt(dateStr.match(/(\d+)年/)[1]);
        const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
        const day = parseInt(dateStr.match(/(\d+)日/)[1]);
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        return new Date(year, month, day, hours, minutes);
      } catch (e) {
        console.error('日期時間解析錯誤', e);
        return new Date();
      }
    };
    
    try {
      const startDateTime = parseDateTime(startDate, startTime);
      const endDateTime = parseDateTime(endDate, endTime);
      
      const diffMs = endDateTime - startDateTime;
      
      if (diffMs < 0) {
        setTotalTime('0小時 0分鐘');
        return;
      }
      
      const hours = Math.floor(diffMs / (60 * 60 * 1000));
      const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
      setTotalTime(`${hours}小時 ${minutes}分鐘`);
    } catch (e) {
      console.error('日期時間計算錯誤', e);
      setTotalTime('0小時 0分鐘');
    }
  }, [startDate, startTime, endDate, endTime]);
  
  useEffect(() => {
    calculateTotalTime();
  }, [startDate, startTime, endDate, endTime, calculateTotalTime]);

  // 處理加班類型點擊
  const handleOvertimeTypeClick = () => {
    setShowOvertimeTypeOptions(true);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  // 處理加班類型選擇
  const handleOvertimeTypeSelect = (type) => {
    setOvertimeType(type.name);
    setOvertimeTypeValue(type.value);
    setShowOvertimeTypeOptions(false);
  };

  // 處理表單提交
  const handleSubmit = async () => {
    if (loading || formSubmitInProgress.current) {
      console.log('表單提交已在進行中，跳過重複提交');
      return;
    }
    
    if (!companyId || !employeeId || !authToken) {
      alert('認證資訊不完整，請重新登入');
      return;
    }
    
    if (!reason.trim()) {
      alert('請填寫加班事由');
      return;
    }
    
    try {
      formSubmitInProgress.current = true;
      setLoading(true);
      
      const applicationId = generateFormNumber();
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);
      
      const parseDateTime = (dateStr, timeStr) => {
        const year = parseInt(dateStr.match(/(\d+)年/)[1]);
        const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
        const day = parseInt(dateStr.match(/(\d+)日/)[1]);
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        return new Date(year, month, day, hours, minutes);
      };
      
      const startDateTime = parseDateTime(startDate, startTime);
      const endDateTime = parseDateTime(endDate, endTime);
      const diffMs = endDateTime - startDateTime;
      const totalHours = diffMs / (60 * 60 * 1000);
      
      if (totalHours <= 0) {
        alert('加班時間必須大於0');
        setLoading(false);
        formSubmitInProgress.current = false;
        return;
      }
      
      const now = new Date();
      const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      const applicationDate = `${taiwanTime.getUTCFullYear()}-${String(taiwanTime.getUTCMonth() + 1).padStart(2, '0')}-${String(taiwanTime.getUTCDate()).padStart(2, '0')}`;
      const applicationTime = `${String(taiwanTime.getUTCHours()).padStart(2, '0')}:${String(taiwanTime.getUTCMinutes()).padStart(2, '0')}:${String(taiwanTime.getUTCSeconds()).padStart(2, '0')}`;
      
      const employeeDepartment = employeeInfo?.department || '';
      const employeePosition = employeeInfo?.position || '';
      const employeeJobGrade = employeeInfo?.job_grade || '';
      const employeeSupervisor = employeeInfo?.supervisor || '';
      
      const response = await fetch(APPLICATION_FORMS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          employee_id: parseInt(employeeId),
          company_id: parseInt(companyId),
          employee_name: employeeInfo?.name || '',
          id_number: employeeInfo?.id_number || '',
          mobile_number: employeeInfo?.mobile_number || '',
          department: employeeDepartment || '',
          position: employeePosition || '',
          job_grade: employeeJobGrade || '',
          category: "work_overtime",
          type: overtimeType,
          compensation_type: selectedOption,
          application_date: applicationDate,
          application_time: applicationTime,
          date: formattedStartDate,
          start_date: formattedStartDate,
          start_time: `${startTime}:00`,
          end_date: formattedEndDate,
          end_time: `${endTime}:00`,
          total_hours: parseFloat(totalHours.toFixed(2)),
          total_calculation_hours: parseFloat(totalHours.toFixed(2)),
          illustrate: reason,
          description: reason,
          reviewer: employeeSupervisor || '',
          application_status: '待審核',
          application_id: applicationId,
          form_id: formId || ''
        }),
      });
      
      const result = await response.json();
      
      if (result.Status === "Ok") {
        console.log('加班申請提交成功:', result);
        alert('加班申請已成功提交');
        window.location.href = '/workovertime01';
      } else {
        throw new Error(result.Msg || '提交失敗');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('提交請求超時');
        alert('提交請求超時，請稍後再試');
      } else {
        console.error('加班申請失敗:', err);
        setError(err.message || '提交表單時發生錯誤');
        alert(`提交失敗: ${err.message || '未知錯誤'}`);
      }
    } finally {
      setLoading(false);
      formSubmitInProgress.current = false;
    }
  };
  
  // 處理返回首頁
  const handleGoHome = () => {
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
  
  const handleCancel = () => {
    console.log('取消加班申請');
    window.location.href = '/workovertime01';
  };

  const handleAddAttachment = () => {
    console.log('新增附件');
    alert('附件功能尚未開放，請在說明欄位中描述相關資訊');
  };
  
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
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
      <div className="overtime-error-container">
        <div className="overtime-error-message">
          <div className="overtime-error-icon">⚠️</div>
          <div className="overtime-error-text">{message}</div>
          <button className="overtime-error-close" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div className="overtime-container">
      <div className="overtime-app-wrapper">
        {/* 頂部導航欄 */}
        <div className="overtime-header">
          <div className="overtime-home-icon" onClick={handleGoHome}>
            <img 
              src={homeIcon} 
              alt="首頁" 
              width="22" 
              height="22" 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="overtime-page-title">加班申請</div>
        </div>

        {/* 顯示錯誤訊息 */}
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}

        {/* 表單內容 */}
        <div className="overtime-form-container">
          {/* 加班類型 */}
          <div className="overtime-form-row">
            <div className="overtime-form-label">加班類型</div>
            <div className="overtime-form-value">
            <div className="overtime-type-selector" onClick={handleOvertimeTypeClick}>
                <div className="overtime-type-name">{overtimeType}</div>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#666666">
                  <path d="M0 0h24v24H0V0z" fill="none"/>
                  <path d="M7 10l5 5 5-5H7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* 開始時間 */}
          <div className="overtime-form-row">
            <div className="overtime-form-label">開始時間</div>
            <div className="overtime-form-value">
              <div className="overtime-date-time-row">
                <div className="overtime-date-time" onClick={() => handleDateClick(true)}>
                  {startDate} <span className="overtime-weekday">{selectedWeekday}</span>
                </div>
                <div className="overtime-time-input" onClick={() => handleTimeClick(true)}>
                  {startTime}
                </div>
              </div>
            </div>
          </div>
          
          {/* 結束時間 */}
          <div className="overtime-form-row">
            <div className="overtime-form-label">結束時間</div>
            <div className="overtime-form-value">
              <div className="overtime-date-time-row">
                <div className="overtime-date-time" onClick={() => handleDateClick(false)}>
                  {endDate} <span className="overtime-weekday">{selectedWeekday}</span>
                </div>
                <div className="overtime-time-input" onClick={() => handleTimeClick(false)}>
                  {endTime}
                </div>
              </div>
            </div>
          </div>
          
          {/* 總時數 */}
          <div className="overtime-form-row">
            <div className="overtime-form-label">總時數</div>
            <div className="overtime-form-value">
              <div className="overtime-hours">{totalTime}</div>
            </div>
          </div>
          
          {/* 說明 */}
          <div className="overtime-description-container">
            <div className="overtime-description-label">加班事由</div>
            <textarea 
              className="overtime-description-textarea" 
              placeholder="請輸入加班事由..." 
              value={reason}
              onChange={handleReasonChange}
            />
            <button className="overtime-attachment-button" onClick={handleAddAttachment}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#3a75b5" className="overtime-attachment-icon">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
              </svg>
              新增附件
            </button>
          </div>
          
          {/* 加班費/換休選項 */}
          <div className="overtime-options-container">
            <button 
              className={`overtime-option-button ${selectedOption === '加班費' ? 'overtime-option-button-active' : 'overtime-option-button-inactive'}`}
              onClick={() => handleOptionSelect('加班費')}
            >
              加班費
            </button>
            <button 
              className={`overtime-option-button ${selectedOption === '換休' ? 'overtime-option-button-active' : 'overtime-option-button-inactive'}`}
              onClick={() => handleOptionSelect('換休')}
            >
              換休
            </button>
          </div>
        </div>
        
        {/* 底部按鈕 */}
        <div className="overtime-button-container">
          <button 
            className="overtime-cancel-button" 
            onClick={handleCancel}
            disabled={loading || formSubmitInProgress.current}
          >
            取消
          </button>
          <button 
            className={`overtime-submit-button ${loading || formSubmitInProgress.current ? 'overtime-button-loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading || formSubmitInProgress.current || !reason.trim()}
          >
            {loading || formSubmitInProgress.current ? '提交中...' : '提交'}
          </button>
        </div>
        
        {/* 加班類型選項 */}
        {showOvertimeTypeOptions && (
          <>
            <div className="overtime-overlay" onClick={() => setShowOvertimeTypeOptions(false)}></div>
            <div className="overtime-type-options-container">
              <div className="overtime-type-category">加班類型</div>
              {overtimeTypes.map((type, index) => (
                <div 
                  key={index} 
                  className="overtime-type-option"
                  onClick={() => handleOvertimeTypeSelect(type)}
                >
                  {type.name}
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* 使用新的 CalendarSelector 組件 */}
        <CalendarSelector
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDateSelect}
          isEditingStart={isEditingStart}
        />
        
        {/* 使用新的 TimeSelector 組件 */}
        <TimeSelector
          isVisible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onTimeSelect={handleTimeSelect}
          currentTime={isEditingStart ? startTime : endTime}
          isEditingStart={isEditingStart}
        />
        
        {/* 載入中指示器 */}
        {loading && (
          <div className="overtime-loading-overlay">
            <div className="overtime-loading-spinner"></div>
            <div className="overtime-loading-text">處理中，請稍候...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkOvertimeApply;
