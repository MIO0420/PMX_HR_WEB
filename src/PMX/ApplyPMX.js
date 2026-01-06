
// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import { GOOGLE_API_KEY, MASTER_SHEET_ID, MASTER_RANGE, SHEET_NAMES, SERVER_API_URL, APPLICATION_FORM_API_URL } from '../contexts/config';
// // import './PMX_CSS/ApplyPMX.css';
// // import { validateUserFromCookies } from './function/function';
// // import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// // import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
// // import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
// // import LanguageSwitch from './components/LanguageSwitch';
// // import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook

// // function Apply() {
// //   // 獲取當前日期和時間的函數
// //   const getCurrentDateTimeInfo = () => {
// //     const now = new Date();
// //     const year = now.getFullYear();
// //     const month = now.getMonth() + 1;
// //     const day = now.getDate();
    
// //     // 獲取星期幾
// //     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
// //     const weekday = weekdays[now.getDay()];
    
// //     // 格式化日期
// //     const formattedDate = `${year}年 ${month}月${day}日`;
    
// //     // 獲取當前時間，並向上取整到最近的五分鐘
// //     const hours = now.getHours();
// //     const minutes = Math.floor(now.getMinutes() / 5) * 5;
// //     const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
// //     return {
// //       formattedDate,
// //       weekday,
// //       formattedTime
// //     };
// //   };

// //   // 獲取當前日期時間信息
// //   const currentDateTimeInfo = getCurrentDateTimeInfo();
  
// //   // 移除 EmployeeContext 依賴，改用本地狀態管理員工資料
// //   const [employeeInfo, setEmployeeInfo] = useState({
// //     department: '',
// //     position: '',
// //     jobGrade: '',
// //     supervisor: ''
// //   });
  
// //   const [currentTime, setCurrentTime] = useState('--:--');
// //   const [selectedLeaveType, setSelectedLeaveType] = useState('事假');
// //   const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
// //   const [illustrate, setIllustrate] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [formId, setFormId] = useState('');
// //   const [lunchBreakHours, setLunchBreakHours] = useState(1);
  
// //   // 新增用於存儲驗證後的用戶資訊
// //   const [companyId, setCompanyId] = useState("");
// //   const [employeeId, setEmployeeId] = useState("");
// //   const [authToken, setAuthToken] = useState('');
  
// //   // 日期時間選擇器狀態 - 初始化為當前日期和時間
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);
// //   const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
// //   const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedTime);
// //   const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
// //   const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedTime);
// //   const [isEditingStart, setIsEditingStart] = useState(true);
// //   const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday);
// //   const [leaveHours, setLeaveHours] = useState('0天 0小時 0分鐘');
// //   const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');
  
// //   // 新增 ref 來追蹤狀態
// //   const formSubmitInProgress = useRef(false);

// //   // 將 cookieUtils 移到組件外部或使用 useRef 來避免重新創建
// //   const cookieUtils = useRef({
// //     get: (name) => {
// //       const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
// //         const [key, value] = cookie.split('=');
// //         if (key && value) {
// //           acc[decodeURIComponent(key)] = decodeURIComponent(value);
// //         }
// //         return acc;
// //       }, {});
// //       return cookies[name];
// //     },
    
// //     set: (name, value, days = 7) => {
// //       const expires = new Date();
// //       expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
// //       document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
// //     },
    
// //     remove: (name) => {
// //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
// //     }
// //   }).current;

// //   // 使用共用函數驗證用戶
// //   useEffect(() => {
// //     validateUserFromCookies(
// //       setLoading,
// //       setAuthToken,
// //       setCompanyId,
// //       setEmployeeId
// //     );
// //   }, []);

// //   // 獲取員工資料
// //   const fetchEmployeeInfo = useCallback(async () => {
// //     if (!companyId || !employeeId || !authToken) {
// //       console.log('缺少獲取員工資料的必要參數');
// //       return;
// //     }
    
// //     try {
// //       setLoading(true);
      
// //       // 檢查 sessionStorage 中是否有緩存的員工資料
// //       const cachedEmployeeInfo = sessionStorage.getItem('employee_info_cache');
// //       if (cachedEmployeeInfo) {
// //         const cacheData = JSON.parse(cachedEmployeeInfo);
// //         const cacheTime = new Date(cacheData.timestamp);
// //         const now = new Date();
// //         // 緩存 5 分鐘內有效
// //         if ((now - cacheTime) < 5 * 60 * 1000) {
// //           console.log('使用緩存的員工資料');
// //           const employeeData = cacheData.data.Data || cacheData.data;
// //           setEmployeeInfo({
// //             department: employeeData.department || '',
// //             position: employeeData.position || '',
// //             jobGrade: employeeData.job_grade || '',
// //             supervisor: employeeData.supervisor || ''
// //           });
// //           return;
// //         }
// //       }
      
// //       console.log('查詢員工資料，參數:', {
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         authToken: authToken ? '已設置' : '未設置'
// //       });
      
// //       // 使用新系統API端點
// //       const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${authToken}`
// //         },
// //         body: JSON.stringify({
// //           company_id: companyId,
// //           employee_id: employeeId
// //         })
// //       });
      
// //       const result = await response.json();
      
// //       if (result.Status === "Ok") {
// //         // 將員工資料存入 sessionStorage
// //         sessionStorage.setItem('employee_info_cache', JSON.stringify({
// //           data: result,
// //           timestamp: new Date().toISOString()
// //         }));
        
// //         const employeeData = result.Data;
        
// //         // 設置員工資料
// //         setEmployeeInfo({
// //           department: employeeData.department || '',
// //           position: employeeData.position || '',
// //           jobGrade: employeeData.job_grade || '',
// //           supervisor: employeeData.supervisor || ''
// //         });
        
// //         console.log('員工資料查詢成功:', employeeData);
// //       } else {
// //         console.error('員工資料查詢失敗:', result.Msg);
// //         setError(`員工資料查詢失敗: ${result.Msg}`);
// //       }
// //     } catch (err) {
// //       console.error('查詢員工資料時發生錯誤:', err);
// //       setError(`查詢員工資料時發生錯誤: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [companyId, employeeId, authToken]);

// //   // 當認證信息更新後，獲取員工資料
// //   useEffect(() => {
// //     if (companyId && employeeId && authToken) {
// //       fetchEmployeeInfo();
// //     }
// //   }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

// //   // 修改後的函數，使用本地隨機數生成表單編號
// //   const generateFormNumber = () => {
// //     const now = new Date();
// //     const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
// //     const year = taiwanTime.getUTCFullYear();
// //     const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
// //     const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
// //     const datePart = `${year}${month}${day}`;
// //     const sequenceNumber = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    
// //     return `${datePart}${sequenceNumber}`;
// //   };

// //   // 從總表獲取表單ID
// //   useEffect(() => {
// //     if (companyId && !formId) {
// //       fetchFormId();
// //     }
// //   }, [companyId, formId]);
  
// //   // 獲取表單ID
// //   const fetchFormId = async () => {
// //     try {
// //       console.log(`正在從總表獲取 ${companyId} 的表單ID...`);
// //       const response = await fetch(`${SERVER_API_URL}/api/get-form-id/${companyId}`);
// //       const data = await response.json();
      
// //       if (data.success && data.formId) {
// //         setFormId(data.formId);
// //         console.log(`已設置 ${companyId} 的表單ID: ${data.formId}`);
        
// //         // 獲取中午休息時間
// //         fetchLunchBreakHours(data.formId);
// //       } else {
// //         console.error('獲取表單ID失敗:', data.error);
// //       }
// //     } catch (error) {
// //       console.error('獲取表單ID時出錯:', error);
// //     }
// //   };
  
// //   // 從 Google Sheets 獲取中午休息時間
// //   const fetchLunchBreakHours = async (formId) => {
// //     if (!formId) return;
    
// //     try {
// //       console.log(`正在獲取公司中午休息時間，表單ID: ${formId}`);
      
// //       const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${formId}/values/${SHEET_NAMES.COMPANY_INFO}!F2?key=${GOOGLE_API_KEY}`);
      
// //       if (!response.ok) {
// //         throw new Error(`獲取中午休息時間失敗: ${response.status}`);
// //       }
      
// //       const data = await response.json();
      
// //       if (data && data.values && data.values[0] && data.values[0][0]) {
// //         const hours = parseFloat(data.values[0][0]);
// //         setLunchBreakHours(isNaN(hours) ? 1 : hours);
// //         console.log(`已設置中午休息時間: ${hours}小時`);
// //       } else {
// //         console.log('找不到中午休息時間資料，使用預設值1小時');
// //         setLunchBreakHours(1);
// //       }
// //     } catch (error) {
// //       console.error('獲取中午休息時間出錯:', error);
// //       setLunchBreakHours(1);
// //     }
// //   };

// //   // 假別資料
// //   const leaveTypes = [
// //     { name: '換休', apiValue: 'compensatory_leave', remaining: '4小時', category: '法定假別' },
// //     { name: '特休', apiValue: 'annual_leave', remaining: '6小時', category: '法定假別' },
// //     { name: '事假', apiValue: 'personal_leave', remaining: '2天23小時', category: '法定假別' },
// //     { name: '病假', apiValue: 'sick_leave', remaining: '23小時', category: '法定假別' },
// //     { name: '生理假', apiValue: 'menstrual_leave', remaining: '1天 0小時', category: '法定假別' },
// //     { name: '補休', apiValue: 'makeup_leave', remaining: '0小時', category: '法定假別' },
// //     { name: '公假', apiValue: 'official_leave', remaining: '10小時', category: '法定假別' },
// //     { name: '婚假', apiValue: 'marriage_leave', remaining: '8天 0小時', category: '法定假別' },
// //     { name: '產檢假', apiValue: 'prenatal_checkup_leave', remaining: '24小時', category: '法定假別' },
// //     { name: '產假', apiValue: 'maternity_leave', remaining: '56天 0小時', category: '法定假別' },
// //     { name: '陪產假', apiValue: 'paternity_leave', remaining: '7天 0小時', category: '法定假別' },
// //     { name: '溫書假', apiValue: 'study_leave', remaining: '14天 0小時', category: '法定假別' },
// //     { name: '生日假', apiValue: 'birthday_leave', remaining: '0小時', category: '公司福利假別' }
// //   ];
  
// //   // 取得目前選擇假別的剩餘時數
// //   const getSelectedLeaveRemaining = () => {
// //     const selected = leaveTypes.find(type => type.name === selectedLeaveType);
// //     return selected ? selected.remaining : '';
// //   };
  
// //   // 更新右上角時間
// //   useEffect(() => {
// //     const updateClock = () => {
// //       const now = new Date();
// //       const hours = String(now.getHours()).padStart(2, '0');
// //       const minutes = String(now.getMinutes()).padStart(2, '0');
// //       setCurrentTime(`${hours}:${minutes}`);
// //     };
// //     updateClock();
// //     const timer = setInterval(updateClock, 60000);
// //     return () => clearInterval(timer);
// //   }, []);

// //   // 格式化日期為 API 格式 (YYYY-MM-DD)
// //   const formatDateForApi = (dateStr) => {
// //     const year = parseInt(dateStr.match(/(\d+)年/)[1]);
// //     const month = parseInt(dateStr.match(/(\d+)月/)[1]);
// //     const day = parseInt(dateStr.match(/(\d+)日/)[1]);
// //     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// //   };

// //   // 格式化時間為 API 格式 (HH:MM:SS)
// //   const formatTimeForApi = (timeStr) => {
// //     return `${timeStr}:00`;
// //   };

// //   // 處理日期點擊
// //   const handleDateClick = (isStart) => {
// //     setIsEditingStart(isStart);
// //     setShowDatePicker(true);
// //   };
  
// //   // 處理時間點擊
// //   const handleTimeClick = (isStart) => {
// //     setIsEditingStart(isStart);
// //     setShowTimePicker(true);
// //   };
  
// // // 處理日期選擇 - 修改版本，實現自動流程
// // const handleDateSelect = (date) => {
// //   const year = date.getFullYear();
// //   const month = date.getMonth() + 1;
// //   const day = date.getDate();
// //   const formattedDate = `${year}年 ${month}月${day}日`;
  
// //   const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
// //   const weekday = weekdays[date.getDay()];
  
// //   if (isEditingStart) {
// //     // 選擇開始日期
// //     setStartDate(formattedDate);
// //     setSelectedWeekday(weekday);
// //     setShowDatePicker(false);
// //     calculateLeaveHours();
    
// //     // 自動開啟開始時間選擇
// //     setTimeout(() => {
// //       setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
// //     }, 300);
    
// //   } else {
// //     // 選擇結束日期
// //     setEndDate(formattedDate);
// //     setSelectedWeekday(weekday);
// //     setShowDatePicker(false);
// //     calculateLeaveHours();
    
// //     // 自動開啟結束時間選擇
// //     setTimeout(() => {
// //       setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = false
// //     }, 300);
// //   }
// // };

// // // 處理時間選擇 - 修改版本，實現自動流程
// // const handleTimeSelect = (hour, minute) => {
// //   const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
// //   if (isEditingStart) {
// //     // 選擇開始時間
// //     setStartTime(formattedTime);
// //     setShowTimePicker(false);
// //     calculateLeaveHours();
    
// //     // 自動開啟結束日期選擇
// //     setTimeout(() => {
// //       setIsEditingStart(false); // 切換到編輯結束日期
// //       setShowDatePicker(true);  // 開啟日期選擇器
// //     }, 300);
    
// //   } else {
// //     // 選擇結束時間
// //     setEndTime(formattedTime);
// //     setShowTimePicker(false);
// //     calculateLeaveHours();
    
// //     // 完成所有選擇，重置狀態
// //     setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
// //   }
// // };



// //   // 計算請假時數，扣除中午休息時間
// //   const calculateLeaveHours = useCallback(() => {
// //     const parseDateTime = (dateStr, timeStr) => {
// //       try {
// //         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
// //         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
// //         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
        
// //         const [hours, minutes] = timeStr.split(':').map(Number);
        
// //         return new Date(year, month, day, hours, minutes);
// //       } catch (e) {
// //         console.error('日期時間解析錯誤', e);
// //         return new Date();
// //       }
// //     };
    
// //     try {
// //       const startDateTime = parseDateTime(startDate, startTime);
// //       const endDateTime = parseDateTime(endDate, endTime);
      
// //       let diffMs = endDateTime - startDateTime;
      
// //       if (diffMs < 0) {
// //         setLeaveHours('0天 0小時 0分鐘');
// //         return;
// //       }
      
// //       // 檢查是否需要扣除中午休息時間
// //       const lunchStartHour = 12;
// //       const lunchEndHour = lunchStartHour + lunchBreakHours;
      
// //       const startDateDay = startDateTime.getDate();
// //       const endDateDay = endDateTime.getDate();
      
// //       // 計算請假天數
// //       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
// //       // 計算需要扣除的中午休息時間（毫秒）
// //       let lunchBreakMs = 0;
      
// //       // 如果請假時間跨越了中午休息時間
// //       if (days === 0 && startDateDay === endDateDay) {
// //         // 同一天的情況
// //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
// //         // 檢查請假時間是否完全包含中午休息時間
// //         if (startHour < lunchStartHour && endHour > lunchEndHour) {
// //           lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
// //         } 
// //         // 檢查請假時間是否部分包含中午休息時間
// //         else if (
// //           (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
// //           (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
// //         ) {
// //           const overlapStart = Math.max(startHour, lunchStartHour);
// //           const overlapEnd = Math.min(endHour, lunchEndHour);
// //           lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
// //         }
// //         // 檢查請假時間是否完全在中午休息時間內
// //         else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
// //           lunchBreakMs = diffMs;
// //         }
// //       } else {
// //         // 跨天的情況，每天都需要扣除中午休息時間
// //         lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
// //         // 檢查起始日是否需要扣除中午休息時間
// //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// //         if (startHour < lunchEndHour) {
// //           const overlapEnd = Math.min(24, lunchEndHour);
// //           lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
// //         }
        
// //         // 檢查結束日是否需要扣除中午休息時間
// //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
// //         if (endHour > lunchStartHour) {
// //           const overlapStart = Math.max(0, lunchStartHour);
// //           lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
// //         }
// //       }
      
// //       // 確保不會扣除過多
// //       lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
// //       // 扣除中午休息時間
// //       diffMs -= lunchBreakMs;
      
// //       // 重新計算天、小時、分鐘
// //       const adjustedDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
// //       const adjustedHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
// //       const adjustedMinutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
// //       setLeaveHours(`${adjustedDays}天 ${adjustedHours}小時 ${adjustedMinutes}分鐘`);
      
// //       console.log(`請假總時數: ${diffMs / (60 * 60 * 1000)}小時，已扣除中午休息時間: ${lunchBreakMs / (60 * 60 * 1000)}小時`);
      
// //     } catch (e) {
// //       console.error('日期時間計算錯誤', e);
// //       setLeaveHours('0天 0小時 0分鐘');
// //     }
// //   }, [startDate, startTime, endDate, endTime, lunchBreakHours]);
  
// //   useEffect(() => {
// //     calculateLeaveHours();
// //   }, [calculateLeaveHours]);

// //   // 處理表單提交 - 修改版本
// //   const handleSubmit = async () => {
// //     // 避免重複提交
// //     if (loading || formSubmitInProgress.current) {
// //       console.log('表單提交已在進行中，跳過重複提交');
// //       return;
// //     }
    
// //     if (!companyId || !employeeId || !authToken) {
// //       alert('請先登入系統');
// //       window.location.href = '/applogin01/';
// //       return;
// //     }
    
// //     // 檢查是否已獲取員工資料
// //     if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
// //       console.log('員工資料不完整，重新獲取...');
// //       await fetchEmployeeInfo();
// //       if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
// //         alert('無法獲取員工資料，請重新登入');
// //         return;
// //       }
// //     }
    
// //     try {
// //       formSubmitInProgress.current = true;
// //       setLoading(true);
// //       setError(null);
      
// //       console.log('使用員工資料:', employeeInfo);
      
// //       const formattedStartDate = formatDateForApi(startDate);
// //       const formattedEndDate = formatDateForApi(endDate);
// //       const formattedStartTime = formatTimeForApi(startTime);
// //       const formattedEndTime = formatTimeForApi(endTime);
      
// //       // 計算總時數 (小時)
// //       const parseDateTime = (dateStr, timeStr) => {
// //         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
// //         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
// //         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
// //         const [hours, minutes] = timeStr.split(':').map(Number);
        
// //         return new Date(year, month, day, hours, minutes);
// //       };
      
// //       const startDateTime = parseDateTime(startDate, startTime);
// //       const endDateTime = parseDateTime(endDate, endTime);
// //       let diffMs = endDateTime - startDateTime;
      
// //       // 扣除中午休息時間
// //       const lunchStartHour = 12;
// //       const lunchEndHour = lunchStartHour + lunchBreakHours;
      
// //       const startDateDay = startDateTime.getDate();
// //       const endDateDay = endDateTime.getDate();
      
// //       // 計算請假天數
// //       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
// //       // 計算需要扣除的中午休息時間（毫秒）
// //       let lunchBreakMs = 0;
      
// //       // 如果請假時間跨越了中午休息時間
// //       if (days === 0 && startDateDay === endDateDay) {
// //         // 同一天的情況
// //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
// //         // 檢查請假時間是否完全包含中午休息時間
// //         if (startHour < lunchStartHour && endHour > lunchEndHour) {
// //           lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
// //         } 
// //         // 檢查請假時間是否部分包含中午休息時間
// //         else if (
// //           (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
// //           (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
// //         ) {
// //           const overlapStart = Math.max(startHour, lunchStartHour);
// //           const overlapEnd = Math.min(endHour, lunchEndHour);
// //           lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
// //         }
// //         // 檢查請假時間是否完全在中午休息時間內
// //         else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
// //           lunchBreakMs = diffMs;
// //         }
// //       } else {
// //         // 跨天的情況，每天都需要扣除中午休息時間
// //         lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
// //         // 檢查起始日是否需要扣除中午休息時間
// //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// //         if (startHour < lunchEndHour) {
// //           const overlapEnd = Math.min(24, lunchEndHour);
// //           lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
// //         }
        
// //         // 檢查結束日是否需要扣除中午休息時間
// //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
// //         if (endHour > lunchStartHour) {
// //           const overlapStart = Math.max(0, lunchStartHour);
// //           lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
// //         }
// //       }
      
// //       // 確保不會扣除過多
// //       lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
// //       // 扣除中午休息時間
// //       diffMs -= lunchBreakMs;
      
// //       const totalHours = diffMs / (60 * 60 * 1000);
      
// //       if (totalHours <= 0) {
// //         alert('請假時間必須大於0');
// //         return;
// //       }
      
// //       if (!illustrate.trim()) {
// //         alert('請填寫請假說明');
// //         return;
// //       }
      
// //       // 生成表單編號
// //       const formNumber = generateFormNumber();
      
// //       // 獲取當前日期時間（使用台灣時間 UTC+8）
// //       const now = new Date();
// //       const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      
// //       const year = taiwanTime.getUTCFullYear();
// //       const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
// //       const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
// //       const hours = String(taiwanTime.getUTCHours()).padStart(2, '0');
// //       const minutes = String(taiwanTime.getUTCMinutes()).padStart(2, '0');
// //       const seconds = String(taiwanTime.getUTCSeconds()).padStart(2, '0');
      
// //       const applicationDate = `${year}-${month}-${day}`;
// //       const applicationTime = `${hours}:${minutes}:${seconds}`;
      
// //       // 使用後端API提交申請表單 - 包含從API獲取的員工資料
// //       const payload = {
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         department: employeeInfo.department || '', // 從API獲取的部門
// //         position: employeeInfo.position || '',     // 從API獲取的職位
// //         job_grade: employeeInfo.jobGrade || '',    // 從API獲取的職級
// //         leave_type: selectedLeaveType,
// //         leave_type_api: selectedLeaveTypeApi,
// //         start_date: formattedStartDate,
// //         start_time: formattedStartTime,
// //         end_date: formattedEndDate,
// //         end_time: formattedEndTime,
// //         leave_hours: leaveHours,
// //         total_calculation_hours: totalHours.toFixed(2),
// //         lunch_break_hours: lunchBreakHours,
// //         illustrate: illustrate || '',
// //         application_id: formNumber,
// //         application_status: '待審核',
// //         application_date: applicationDate,
// //         application_time: applicationTime
// //       };
      
// //       console.log('正在提交申請表單資料（包含API獲取的員工資料）:', payload);
      
// //       // 使用 Promise.all 並行處理兩個 API 請求
// //       const [response1, response2] = await Promise.all([
// //         // 1. 原本的 API
// //         fetch(`${SERVER_API_URL}/api/apply-form`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify(payload),
// //         }).then(res => res.json()).catch(err => {
// //           console.error('原系統 API 請求失敗:', err);
// //           return { error: err.message };
// //         }),
        
// //         // 2. 新增的 Application_Form API - 包含從API獲取的員工資料
// //         fetch(APPLICATION_FORM_API_URL, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json',
// //             'Authorization': `Bearer ${authToken}` // 添加 auth_token
// //           },
// //           body: JSON.stringify({
// //             form_number: formNumber,
// //             company_id: parseInt(companyId),
// //             employee_id: employeeId,
// //             category: "leave",
// //             type: selectedLeaveTypeApi, // 使用API值而不是顯示名稱
// //             start_date: formattedStartDate,
// //             start_time: formattedStartTime,
// //             end_date: formattedEndDate,
// //             end_time: formattedEndTime,
// //             total_calculation_hours: parseFloat(totalHours.toFixed(2)),
// //             illustrate: illustrate || '',
// //             department: employeeInfo.department || '',  // 從API獲取的部門
// //             position: employeeInfo.position || '',      // 從API獲取的職位
// //             job_grade: employeeInfo.jobGrade || '',     // 從API獲取的職級
// //             status: "pending",  // 使用英文狀態值
// //             application_date: applicationDate,
// //             reviewer_name: null,
// //             reviewer_job_grade: null,
// //             reviewer_status: "pending",  // 使用英文狀態值
// //             hr_name: null,
// //             hr_status: "pending",  // 使用英文狀態值
// //             reviewer: employeeInfo.supervisor || null   // 從API獲取的主管
// //           }),
          
// //         }).then(res => res.json()).catch(err => {
// //           console.error('新系統 API 請求失敗:', err);
// //           return { error: err.message };
// //         })
// //       ]);
      
// //       // 檢查兩個 API 的回應
// //       let hasSuccess = false;
      
// //       if (response1.success && !response1.error) {
// //         console.log('原 API 申請表單提交成功:', response1);
// //         hasSuccess = true;
// //       } else {
// //         console.error('原 API 提交失敗:', response1);
// //       }
      
// //       if (!response2.error && response2.Status === "Ok") {
// //         console.log('Application_Form API 提交成功:', response2);
// //         hasSuccess = true;
// //       } else {
// //         console.error('Application_Form API 提交失敗:', response2);
// //       }
      
// //       if (hasSuccess) {
// //         alert('請假申請已送出');
// //         window.location.href = '/leave01';
// //       } else {
// //         throw new Error('所有API都提交失敗');
// //       }
      
// //     } catch (err) {
// //       if (err.name === 'AbortError') {
// //         console.error('提交請求超時');
// //         alert('提交請求超時，請稍後再試');
// //       } else {
// //         console.error('請假申請失敗:', err);
// //         setError(`處理請求時發生錯誤: ${err.message}`);
// //         alert(`請假申請失敗: ${err.message}`);
// //       }
// //     } finally {
// //       // 確保無論成功或失敗，loading 狀態和提交標記都會被重置
// //       setLoading(false);
// //       formSubmitInProgress.current = false;
// //     }
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
  
// //   const handleCancel = () => {
// //     console.log('取消請假申請');
// //     window.location.href = '/leave01';
// //   };

// //   const handleAddAttachment = () => {
// //     console.log('新增附件');
// //     alert('附件功能尚未開放，請在說明欄位中描述相關資訊');
// //   };
  
// //   const handleLeaveTypeSelect = (type) => {
// //     setSelectedLeaveType(type.name);
// //     setSelectedLeaveTypeApi(type.apiValue);
// //     setShowLeaveTypeOptions(false);
// //   };
  
// //   const handleIllustrateChange = (e) => {
// //     setIllustrate(e.target.value);
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

// //   // 添加錯誤處理組件
// //   const ErrorMessage = ({ message, onClose }) => {
// //     return (
// //       <div className="error-container">
// //         <div className="error-message">
// //           <div className="error-icon">⚠️</div>
// //           <div className="error-text">{message}</div>
// //           <button className="error-close" onClick={onClose}>✕</button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="container">
// //       <div className="app-wrapper">
// //         <header className="header">
// //           <div className="home-icon" onClick={handleGoHome}>
// //             <img 
// //               src={homeIcon} 
// //               alt="首頁" 
// //               width="22" 
// //               height="22" 
// //               style={{ objectFit: 'contain' }}
// //             />
// //           </div>
// //           <div className="page-title">請假申請</div>
// //         </header>

// //         {/* 顯示錯誤訊息 */}
// //         {error && (
// //           <ErrorMessage 
// //             message={error} 
// //             onClose={() => setError(null)} 
// //           />
// //         )}
        
// //         <div className="form-container">
// //           <div className="form-row">
// //             <div className="form-label">假別</div>
// //             <div className="form-value">
// //               <div 
// //                 className="leave-type-selector" 
// //                 onClick={() => setShowLeaveTypeOptions(true)}
// //               >
// //                 <div className="leave-type-name">{selectedLeaveType}</div>
// //                 <div className="available-hours">剩餘：{getSelectedLeaveRemaining()}</div>
// //                 <div className="dropdown-icon">▼</div>
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="form-row">
// //             <div className="form-label">自</div>
// //             <div className="form-value">
// //               <div className="date-time-row">
// //                 <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
// //                 <div className="weekday">{selectedWeekday}</div>
// //                 <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="form-row">
// //             <div className="form-label">到</div>
// //             <div className="form-value">
// //               <div className="date-time-row">
// //                 <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
// //                 <div className="weekday">{selectedWeekday}</div>
// //                 <div className="time-input" onClick={() => handleTimeClick(false)}>{endTime}</div>
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="form-row">
// //             <div className="form-label">時數</div>
// //             <div className="form-value">
// //               <div className="hours">{leaveHours}</div>
// //             </div>
// //           </div>
          
// //           <div className="description-container">
// //             <div className="description-label">說明</div>
// //             <textarea 
// //               className="description-textarea" 
// //               placeholder="請輸入請假原因..."
// //               value={illustrate}
// //               onChange={handleIllustrateChange}
// //             />
// //             <button className="attachment-button" onClick={handleAddAttachment}>
// //               <span className="attachment-icon">
// //                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                   <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
// //                 </svg>
// //               </span>
// //               新增附件
// //             </button>
// //           </div>
// //         </div>
        
// //         <div className="button-container">
// //           <button 
// //             className="cancel-button" 
// //             onClick={handleCancel} 
// //             disabled={loading || formSubmitInProgress.current}
// //           >
// //             取消
// //           </button>
// //           <button 
// //             className={`submit-button ${loading || formSubmitInProgress.current ? 'loading' : ''}`}
// //             onClick={handleSubmit}
// //             disabled={loading || formSubmitInProgress.current}
// //           >
// //             {loading || formSubmitInProgress.current ? '處理中...' : '送出'}
// //           </button>
// //         </div>
        
// //         {showLeaveTypeOptions && (
// //           <>
// //             <div className="overlay" onClick={() => setShowLeaveTypeOptions(false)}></div>
// //             <div className="leave-type-options-container">
// //               <div className="leave-type-category">法定假別</div>
// //               {leaveTypes
// //                 .filter(type => type.category === '法定假別')
// //                 .map((type, index) => (
// //                   <div 
// //                     key={index} 
// //                     className="leave-type-option"
// //                     onClick={() => handleLeaveTypeSelect(type)}
// //                   >
// //                     <div>{type.name}</div>
// //                     <div className="available-hours">剩餘：{type.remaining}</div>
// //                   </div>
// //                 ))
// //               }
              
// //               <div className="leave-type-category">公司福利假別</div>
// //               {leaveTypes
// //                 .filter(type => type.category === '公司福利假別')
// //                 .map((type, index) => (
// //                   <div 
// //                     key={index} 
// //                     className="leave-type-option"
// //                     onClick={() => handleLeaveTypeSelect(type)}
// //                   >
// //                     <div>{type.name}</div>
// //                     <div className="available-hours">剩餘：{type.remaining}</div>
// //                   </div>
// //                 ))
// //               }
// //             </div>
// //           </>
// //         )}
        
// //         {/* 使用新的 CalendarSelector 組件 */}
// //         <CalendarSelector
// //           isVisible={showDatePicker}
// //           onClose={() => setShowDatePicker(false)}
// //           onDateSelect={handleDateSelect}
// //           isEditingStart={isEditingStart}
// //         />
        
// //         {/* 使用新的 TimeSelector 組件 */}
// //         <TimeSelector
// //           isVisible={showTimePicker}
// //           onClose={() => setShowTimePicker(false)}
// //           onTimeSelect={handleTimeSelect}
// //           currentTime={isEditingStart ? startTime : endTime}
// //           isEditingStart={isEditingStart}
// //         />
        
// //         {/* 載入中指示器 */}
// //         {loading && (
// //           <div className="loading-overlay">
// //             <div className="loading-spinner"></div>
// //             <div className="loading-text">處理中，請稍候...</div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Apply;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { GOOGLE_API_KEY, MASTER_SHEET_ID, MASTER_RANGE, SHEET_NAMES, SERVER_API_URL, APPLICATION_FORM_API_URL } from '../contexts/config';
// import './PMX_CSS/ApplyPMX.css';
// import { validateUserFromCookies } from './function/function';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
// import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
// import LanguageSwitch from './components/LanguageSwitch';
// import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook

// function Apply() {
//   // 引入語言功能
//   const { t } = useLanguage();
  
//   // 獲取當前日期和時間的函數
//   const getCurrentDateTimeInfo = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth() + 1;
//     const day = now.getDate();
    
//     // 獲取星期幾
//     const weekdays = [
//       t('apply.weekdays.sunday'), 
//       t('apply.weekdays.monday'), 
//       t('apply.weekdays.tuesday'), 
//       t('apply.weekdays.wednesday'), 
//       t('apply.weekdays.thursday'), 
//       t('apply.weekdays.friday'), 
//       t('apply.weekdays.saturday')
//     ];
//     const weekday = weekdays[now.getDay()];
    
//     // 格式化日期
//     const formattedDate = `${year}${t('apply.year')} ${month}${t('apply.month')}${day}${t('apply.day')}`;
    
//     // 獲取當前時間，並向上取整到最近的五分鐘
//     const hours = now.getHours();
//     const minutes = Math.floor(now.getMinutes() / 5) * 5;
//     const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
//     return {
//       formattedDate,
//       weekday,
//       formattedTime
//     };
//   };

//   // 獲取當前日期時間信息
//   const currentDateTimeInfo = getCurrentDateTimeInfo();
  
//   // 移除 EmployeeContext 依賴，改用本地狀態管理員工資料
//   const [employeeInfo, setEmployeeInfo] = useState({
//     department: '',
//     position: '',
//     jobGrade: '',
//     supervisor: ''
//   });
  
//   const [currentTime, setCurrentTime] = useState('--:--');
//   const [selectedLeaveType, setSelectedLeaveType] = useState(t('apply.leaveTypes.personal'));
//   const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
//   const [illustrate, setIllustrate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formId, setFormId] = useState('');
//   const [lunchBreakHours, setLunchBreakHours] = useState(1);
  
//   // 新增用於存儲驗證後的用戶資訊
//   const [companyId, setCompanyId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [authToken, setAuthToken] = useState('');
  
//   // 日期時間選擇器狀態 - 初始化為當前日期和時間
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
//   const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedTime);
//   const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
//   const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedTime);
//   const [isEditingStart, setIsEditingStart] = useState(true);
//   const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday);
//   const [leaveHours, setLeaveHours] = useState(`0${t('apply.days')} 0${t('apply.hours')} 0${t('apply.minutes')}`);
//   const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');
  
//   // 新增 ref 來追蹤狀態
//   const formSubmitInProgress = useRef(false);

//   // 將 cookieUtils 移到組件外部或使用 useRef 來避免重新創建
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
    
//     set: (name, value, days = 7) => {
//       const expires = new Date();
//       expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
//       document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
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

//   // 獲取員工資料
//   const fetchEmployeeInfo = useCallback(async () => {
//     if (!companyId || !employeeId || !authToken) {
//       console.log('缺少獲取員工資料的必要參數');
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       // 檢查 sessionStorage 中是否有緩存的員工資料
//       const cachedEmployeeInfo = sessionStorage.getItem('employee_info_cache');
//       if (cachedEmployeeInfo) {
//         const cacheData = JSON.parse(cachedEmployeeInfo);
//         const cacheTime = new Date(cacheData.timestamp);
//         const now = new Date();
//         // 緩存 5 分鐘內有效
//         if ((now - cacheTime) < 5 * 60 * 1000) {
//           console.log('使用緩存的員工資料');
//           const employeeData = cacheData.data.Data || cacheData.data;
//           setEmployeeInfo({
//             department: employeeData.department || '',
//             position: employeeData.position || '',
//             jobGrade: employeeData.job_grade || '',
//             supervisor: employeeData.supervisor || ''
//           });
//           return;
//         }
//       }
      
//       console.log('查詢員工資料，參數:', {
//         company_id: companyId,
//         employee_id: employeeId,
//         authToken: authToken ? '已設置' : '未設置'
//       });
      
//       // 使用新系統API端點
//       const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           company_id: companyId,
//           employee_id: employeeId
//         })
//       });
      
//       const result = await response.json();
      
//       if (result.Status === "Ok") {
//         // 將員工資料存入 sessionStorage
//         sessionStorage.setItem('employee_info_cache', JSON.stringify({
//           data: result,
//           timestamp: new Date().toISOString()
//         }));
        
//         const employeeData = result.Data;
        
//         // 設置員工資料
//         setEmployeeInfo({
//           department: employeeData.department || '',
//           position: employeeData.position || '',
//           jobGrade: employeeData.job_grade || '',
//           supervisor: employeeData.supervisor || ''
//         });
        
//         console.log('員工資料查詢成功:', employeeData);
//       } else {
//         console.error('員工資料查詢失敗:', result.Msg);
//         setError(`${t('apply.employeeDataQueryFailed')}: ${result.Msg}`);
//       }
//     } catch (err) {
//       console.error('查詢員工資料時發生錯誤:', err);
//       setError(`${t('apply.employeeDataQueryError')}: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [companyId, employeeId, authToken, t]);

//   // 當認證信息更新後，獲取員工資料
//   useEffect(() => {
//     if (companyId && employeeId && authToken) {
//       fetchEmployeeInfo();
//     }
//   }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

//   // 修改後的函數，使用本地隨機數生成表單編號
//   const generateFormNumber = () => {
//     const now = new Date();
//     const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
//     const year = taiwanTime.getUTCFullYear();
//     const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
//     const datePart = `${year}${month}${day}`;
//     const sequenceNumber = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    
//     return `${datePart}${sequenceNumber}`;
//   };

//   // 從總表獲取表單ID
//   useEffect(() => {
//     if (companyId && !formId) {
//       fetchFormId();
//     }
//   }, [companyId, formId]);
  
//   // 獲取表單ID
//   const fetchFormId = async () => {
//     try {
//       console.log(`正在從總表獲取 ${companyId} 的表單ID...`);
//       const response = await fetch(`${SERVER_API_URL}/api/get-form-id/${companyId}`);
//       const data = await response.json();
      
//       if (data.success && data.formId) {
//         setFormId(data.formId);
//         console.log(`已設置 ${companyId} 的表單ID: ${data.formId}`);
        
//         // 獲取中午休息時間
//         fetchLunchBreakHours(data.formId);
//       } else {
//         console.error('獲取表單ID失敗:', data.error);
//       }
//     } catch (error) {
//       console.error('獲取表單ID時出錯:', error);
//     }
//   };
  
//   // 從 Google Sheets 獲取中午休息時間
//   const fetchLunchBreakHours = async (formId) => {
//     if (!formId) return;
    
//     try {
//       console.log(`正在獲取公司中午休息時間，表單ID: ${formId}`);
      
//       const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${formId}/values/${SHEET_NAMES.COMPANY_INFO}!F2?key=${GOOGLE_API_KEY}`);
      
//       if (!response.ok) {
//         throw new Error(`${t('apply.fetchLunchBreakFailed')}: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data && data.values && data.values[0] && data.values[0][0]) {
//         const hours = parseFloat(data.values[0][0]);
//         setLunchBreakHours(isNaN(hours) ? 1 : hours);
//         console.log(`已設置中午休息時間: ${hours}小時`);
//       } else {
//         console.log('找不到中午休息時間資料，使用預設值1小時');
//         setLunchBreakHours(1);
//       }
//     } catch (error) {
//       console.error('獲取中午休息時間出錯:', error);
//       setLunchBreakHours(1);
//     }
//   };

//   // 假別資料
//   const leaveTypes = [
//     { name: t('apply.leaveTypes.compensatory'), apiValue: 'compensatory_leave', remaining: `4${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.annual'), apiValue: 'annual_leave', remaining: `6${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.personal'), apiValue: 'personal_leave', remaining: `2${t('apply.days')}23${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.sick'), apiValue: 'sick_leave', remaining: `23${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.menstrual'), apiValue: 'menstrual_leave', remaining: `1${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.makeup'), apiValue: 'makeup_leave', remaining: `0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.official'), apiValue: 'official_leave', remaining: `10${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.marriage'), apiValue: 'marriage_leave', remaining: `8${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.prenatalCheckup'), apiValue: 'prenatal_checkup_leave', remaining: `24${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.maternity'), apiValue: 'maternity_leave', remaining: `56${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.paternity'), apiValue: 'paternity_leave', remaining: `7${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.study'), apiValue: 'study_leave', remaining: `14${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
//     { name: t('apply.leaveTypes.birthday'), apiValue: 'birthday_leave', remaining: `0${t('apply.hours')}`, category: t('apply.companyBenefitLeaveTypes') }
//   ];
  
//   // 取得目前選擇假別的剩餘時數
//   const getSelectedLeaveRemaining = () => {
//     const selected = leaveTypes.find(type => type.name === selectedLeaveType);
//     return selected ? selected.remaining : '';
//   };
  
//   // 更新右上角時間
//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const hours = String(now.getHours()).padStart(2, '0');
//       const minutes = String(now.getMinutes()).padStart(2, '0');
//       setCurrentTime(`${hours}:${minutes}`);
//     };
//     updateClock();
//     const timer = setInterval(updateClock, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   // 格式化日期為 API 格式 (YYYY-MM-DD)
//   const formatDateForApi = (dateStr) => {
//     const year = parseInt(dateStr.match(/(\d+)年/)[1]);
//     const month = parseInt(dateStr.match(/(\d+)月/)[1]);
//     const day = parseInt(dateStr.match(/(\d+)日/)[1]);
//     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//   };

//   // 格式化時間為 API 格式 (HH:MM:SS)
//   const formatTimeForApi = (timeStr) => {
//     return `${timeStr}:00`;
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
  
// // 處理日期選擇 - 修改版本，實現自動流程
// const handleDateSelect = (date) => {
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const formattedDate = `${year}${t('apply.year')} ${month}${t('apply.month')}${day}${t('apply.day')}`;
  
//   const weekdays = [
//     t('apply.weekdays.sunday'), 
//     t('apply.weekdays.monday'), 
//     t('apply.weekdays.tuesday'), 
//     t('apply.weekdays.wednesday'), 
//     t('apply.weekdays.thursday'), 
//     t('apply.weekdays.friday'), 
//     t('apply.weekdays.saturday')
//   ];
//   const weekday = weekdays[date.getDay()];
  
//   if (isEditingStart) {
//     // 選擇開始日期
//     setStartDate(formattedDate);
//     setSelectedWeekday(weekday);
//     setShowDatePicker(false);
//     calculateLeaveHours();
    
//     // 自動開啟開始時間選擇
//     setTimeout(() => {
//       setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
//     }, 300);
    
//   } else {
//     // 選擇結束日期
//     setEndDate(formattedDate);
//     setSelectedWeekday(weekday);
//     setShowDatePicker(false);
//     calculateLeaveHours();
    
//     // 自動開啟結束時間選擇
//     setTimeout(() => {
//       setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = false
//     }, 300);
//   }
// };

// // 處理時間選擇 - 修改版本，實現自動流程
// const handleTimeSelect = (hour, minute) => {
//   const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
//   if (isEditingStart) {
//     // 選擇開始時間
//     setStartTime(formattedTime);
//     setShowTimePicker(false);
//     calculateLeaveHours();
    
//     // 自動開啟結束日期選擇
//     setTimeout(() => {
//       setIsEditingStart(false); // 切換到編輯結束日期
//       setShowDatePicker(true);  // 開啟日期選擇器
//     }, 300);
    
//   } else {
//     // 選擇結束時間
//     setEndTime(formattedTime);
//     setShowTimePicker(false);
//     calculateLeaveHours();
    
//     // 完成所有選擇，重置狀態
//     setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
//   }
// };



//   // 計算請假時數，扣除中午休息時間
//   const calculateLeaveHours = useCallback(() => {
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
      
//       let diffMs = endDateTime - startDateTime;
      
//       if (diffMs < 0) {
//         setLeaveHours(`0${t('apply.days')} 0${t('apply.hours')} 0${t('apply.minutes')}`);
//         return;
//       }
      
//       // 檢查是否需要扣除中午休息時間
//       const lunchStartHour = 12;
//       const lunchEndHour = lunchStartHour + lunchBreakHours;
      
//       const startDateDay = startDateTime.getDate();
//       const endDateDay = endDateTime.getDate();
      
//       // 計算請假天數
//       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
//       // 計算需要扣除的中午休息時間（毫秒）
//       let lunchBreakMs = 0;
      
//       // 如果請假時間跨越了中午休息時間
//       if (days === 0 && startDateDay === endDateDay) {
//         // 同一天的情況
//         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
//         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
//         // 檢查請假時間是否完全包含中午休息時間
//         if (startHour < lunchStartHour && endHour > lunchEndHour) {
//           lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
//         } 
//         // 檢查請假時間是否部分包含中午休息時間
//         else if (
//           (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
//           (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
//         ) {
//           const overlapStart = Math.max(startHour, lunchStartHour);
//           const overlapEnd = Math.min(endHour, lunchEndHour);
//           lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
//         }
//         // 檢查請假時間是否完全在中午休息時間內
//         else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
//           lunchBreakMs = diffMs;
//         }
//       } else {
//         // 跨天的情況，每天都需要扣除中午休息時間
//         lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
//         // 檢查起始日是否需要扣除中午休息時間
//         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
//         if (startHour < lunchEndHour) {
//           const overlapEnd = Math.min(24, lunchEndHour);
//           lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
//         }
        
//         // 檢查結束日是否需要扣除中午休息時間
//         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
//         if (endHour > lunchStartHour) {
//           const overlapStart = Math.max(0, lunchStartHour);
//           lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
//         }
//       }
      
//       // 確保不會扣除過多
//       lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
//       // 扣除中午休息時間
//       diffMs -= lunchBreakMs;
      
//       // 重新計算天、小時、分鐘
//       const adjustedDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
//       const adjustedHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
//       const adjustedMinutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
//       setLeaveHours(`${adjustedDays}${t('apply.days')} ${adjustedHours}${t('apply.hours')} ${adjustedMinutes}${t('apply.minutes')}`);
      
//       console.log(`請假總時數: ${diffMs / (60 * 60 * 1000)}小時，已扣除中午休息時間: ${lunchBreakMs / (60 * 60 * 1000)}小時`);
      
//     } catch (e) {
//       console.error('日期時間計算錯誤', e);
//       setLeaveHours(`0${t('apply.days')} 0${t('apply.hours')} 0${t('apply.minutes')}`);
//     }
//   }, [startDate, startTime, endDate, endTime, lunchBreakHours, t]);
  
//   useEffect(() => {
//     calculateLeaveHours();
//   }, [calculateLeaveHours]);

//   // 處理表單提交 - 修改版本
//   const handleSubmit = async () => {
//     // 避免重複提交
//     if (loading || formSubmitInProgress.current) {
//       console.log('表單提交已在進行中，跳過重複提交');
//       return;
//     }
    
//     if (!companyId || !employeeId || !authToken) {
//       alert(t('apply.loginRequired'));
//       window.location.href = '/applogin01/';
//       return;
//     }
    
//     // 檢查是否已獲取員工資料
//     if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
//       console.log('員工資料不完整，重新獲取...');
//       await fetchEmployeeInfo();
//       if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
//         alert(t('apply.employeeDataIncomplete'));
//         return;
//       }
//     }
    
//     try {
//       formSubmitInProgress.current = true;
//       setLoading(true);
//       setError(null);
      
//       console.log('使用員工資料:', employeeInfo);
      
//       const formattedStartDate = formatDateForApi(startDate);
//       const formattedEndDate = formatDateForApi(endDate);
//       const formattedStartTime = formatTimeForApi(startTime);
//       const formattedEndTime = formatTimeForApi(endTime);
      
//       // 計算總時數 (小時)
//       const parseDateTime = (dateStr, timeStr) => {
//         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
//         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
//         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
//         const [hours, minutes] = timeStr.split(':').map(Number);
        
//         return new Date(year, month, day, hours, minutes);
//       };
      
//       const startDateTime = parseDateTime(startDate, startTime);
//       const endDateTime = parseDateTime(endDate, endTime);
//       let diffMs = endDateTime - startDateTime;
      
//       // 扣除中午休息時間
//       const lunchStartHour = 12;
//       const lunchEndHour = lunchStartHour + lunchBreakHours;
      
//       const startDateDay = startDateTime.getDate();
//       const endDateDay = endDateTime.getDate();
      
//       // 計算請假天數
//       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
//       // 計算需要扣除的中午休息時間（毫秒）
//       let lunchBreakMs = 0;
      
//       // 如果請假時間跨越了中午休息時間
//       if (days === 0 && startDateDay === endDateDay) {
//         // 同一天的情況
//         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
//         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
//         // 檢查請假時間是否完全包含中午休息時間
//         if (startHour < lunchStartHour && endHour > lunchEndHour) {
//           lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
//         } 
//         // 檢查請假時間是否部分包含中午休息時間
//         else if (
//           (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
//           (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
//         ) {
//           const overlapStart = Math.max(startHour, lunchStartHour);
//           const overlapEnd = Math.min(endHour, lunchEndHour);
//           lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
//         }
//         // 檢查請假時間是否完全在中午休息時間內
//         else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
//           lunchBreakMs = diffMs;
//         }
//       } else {
//         // 跨天的情況，每天都需要扣除中午休息時間
//         lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
//         // 檢查起始日是否需要扣除中午休息時間
//         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
//         if (startHour < lunchEndHour) {
//           const overlapEnd = Math.min(24, lunchEndHour);
//           lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
//         }
        
//         // 檢查結束日是否需要扣除中午休息時間
//         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
//         if (endHour > lunchStartHour) {
//           const overlapStart = Math.max(0, lunchStartHour);
//           lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
//         }
//       }
      
//       // 確保不會扣除過多
//       lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
//       // 扣除中午休息時間
//       diffMs -= lunchBreakMs;
      
//       const totalHours = diffMs / (60 * 60 * 1000);
      
//       if (totalHours <= 0) {
//         alert(t('apply.invalidDuration'));
//         return;
//       }
      
//       if (!illustrate.trim()) {
//         alert(t('apply.missingReason'));
//         return;
//       }
      
//       // 生成表單編號
//       const formNumber = generateFormNumber();
      
//       // 獲取當前日期時間（使用台灣時間 UTC+8）
//       const now = new Date();
//       const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      
//       const year = taiwanTime.getUTCFullYear();
//       const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
//       const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
//       const hours = String(taiwanTime.getUTCHours()).padStart(2, '0');
//       const minutes = String(taiwanTime.getUTCMinutes()).padStart(2, '0');
//       const seconds = String(taiwanTime.getUTCSeconds()).padStart(2, '0');
      
//       const applicationDate = `${year}-${month}-${day}`;
//       const applicationTime = `${hours}:${minutes}:${seconds}`;
      
//       // 使用後端API提交申請表單 - 包含從API獲取的員工資料
//       const payload = {
//         company_id: companyId,
//         employee_id: employeeId,
//         department: employeeInfo.department || '', // 從API獲取的部門
//         position: employeeInfo.position || '',     // 從API獲取的職位
//         job_grade: employeeInfo.jobGrade || '',    // 從API獲取的職級
//         leave_type: selectedLeaveType,
//         leave_type_api: selectedLeaveTypeApi,
//         start_date: formattedStartDate,
//         start_time: formattedStartTime,
//         end_date: formattedEndDate,
//         end_time: formattedEndTime,
//         leave_hours: leaveHours,
//         total_calculation_hours: totalHours.toFixed(2),
//         lunch_break_hours: lunchBreakHours,
//         illustrate: illustrate || '',
//         application_id: formNumber,
//         application_status: '待審核',
//         application_date: applicationDate,
//         application_time: applicationTime
//       };
      
//       console.log('正在提交申請表單資料（包含API獲取的員工資料）:', payload);
      
//       // 使用 Promise.all 並行處理兩個 API 請求
//       const [response1, response2] = await Promise.all([
//         // 1. 原本的 API
//         fetch(`${SERVER_API_URL}/api/apply-form`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         }).then(res => res.json()).catch(err => {
//           console.error('原系統 API 請求失敗:', err);
//           return { error: err.message };
//         }),
        
//         // 2. 新增的 Application_Form API - 包含從API獲取的員工資料
//         fetch(APPLICATION_FORM_API_URL, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${authToken}` // 添加 auth_token
//           },
//           body: JSON.stringify({
//             form_number: formNumber,
//             company_id: parseInt(companyId),
//             employee_id: employeeId,
//             category: "leave",
//             type: selectedLeaveTypeApi, // 使用API值而不是顯示名稱
//             start_date: formattedStartDate,
//             start_time: formattedStartTime,
//             end_date: formattedEndDate,
//             end_time: formattedEndTime,
//             total_calculation_hours: parseFloat(totalHours.toFixed(2)),
//             illustrate: illustrate || '',
//             department: employeeInfo.department || '',  // 從API獲取的部門
//             position: employeeInfo.position || '',      // 從API獲取的職位
//             job_grade: employeeInfo.jobGrade || '',     // 從API獲取的職級
//             status: "pending",  // 使用英文狀態值
//             application_date: applicationDate,
//             reviewer_name: null,
//             reviewer_job_grade: null,
//             reviewer_status: "pending",  // 使用英文狀態值
//             hr_name: null,
//             hr_status: "pending",  // 使用英文狀態值
//             reviewer: employeeInfo.supervisor || null   // 從API獲取的主管
//           }),
          
//         }).then(res => res.json()).catch(err => {
//           console.error('新系統 API 請求失敗:', err);
//           return { error: err.message };
//         })
//       ]);
      
//       // 檢查兩個 API 的回應
//       let hasSuccess = false;
      
//       if (response1.success && !response1.error) {
//         console.log('原 API 申請表單提交成功:', response1);
//         hasSuccess = true;
//       } else {
//         console.error('原 API 提交失敗:', response1);
//       }
      
//       if (!response2.error && response2.Status === "Ok") {
//         console.log('Application_Form API 提交成功:', response2);
//         hasSuccess = true;
//       } else {
//         console.error('Application_Form API 提交失敗:', response2);
//       }
      
//       if (hasSuccess) {
//         alert(t('apply.success'));
//         window.location.href = '/leave01';
//       } else {
//         throw new Error(t('apply.allApiFailed'));
//       }
      
//     } catch (err) {
//       if (err.name === 'AbortError') {
//         console.error('提交請求超時');
//         alert(t('apply.submitTimeout'));
//       } else {
//         console.error('請假申請失敗:', err);
//         setError(`${t('apply.requestProcessingError')}: ${err.message}`);
//         alert(`${t('apply.failed')}: ${err.message}`);
//       }
//     } finally {
//       // 確保無論成功或失敗，loading 狀態和提交標記都會被重置
//       setLoading(false);
//       formSubmitInProgress.current = false;
//     }
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
  
//   const handleCancel = () => {
//     console.log('取消請假申請');
//     window.location.href = '/leave01';
//   };

//   const handleAddAttachment = () => {
//     console.log('新增附件');
//     alert(t('apply.attachmentNotAvailable'));
//   };
  
//   const handleLeaveTypeSelect = (type) => {
//     setSelectedLeaveType(type.name);
//     setSelectedLeaveTypeApi(type.apiValue);
//     setShowLeaveTypeOptions(false);
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
//       <div className="error-container">
//         <div className="error-message">
//           <div className="error-icon">⚠️</div>
//           <div className="error-text">{message}</div>
//           <button className="error-close" onClick={onClose}>✕</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container">
//       <div className="app-wrapper">
//         <header className="header">
//           <div className="home-icon" onClick={handleGoHome}>
//             <img 
//               src={homeIcon} 
//               alt={t('home.title')} 
//               width="22" 
//               height="22" 
//               style={{ objectFit: 'contain' }}
//             />
//           </div>
//           <div className="page-title">{t('apply.title')}</div>
//           <div className="apply-language-switch">
//             <LanguageSwitch 
//               className="apply-language-switch-component"
//               containerClassName="apply-language-container"
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
        
//         <div className="form-container">
//           <div className="form-row">
//             <div className="form-label">{t('apply.leaveType')}</div>
//             <div className="form-value">
//               <div 
//                 className="leave-type-selector" 
//                 onClick={() => setShowLeaveTypeOptions(true)}
//               >
//                 <div className="leave-type-name">{selectedLeaveType}</div>
//                 <div className="available-hours">{t('apply.remaining')}：{getSelectedLeaveRemaining()}</div>
//                 <div className="dropdown-icon">▼</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-label">{t('apply.startDate')}</div>
//             <div className="form-value">
//               <div className="date-time-row">
//                 <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
//                 <div className="weekday">{selectedWeekday}</div>
//                 <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-label">{t('apply.endDate')}</div>
//             <div className="form-value">
//               <div className="date-time-row">
//                 <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
//                 <div className="weekday">{selectedWeekday}</div>
//                 <div className="time-input" onClick={() => handleTimeClick(false)}>{endTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-label">{t('apply.duration')}</div>
//             <div className="form-value">
//               <div className="hours">{leaveHours}</div>
//             </div>
//           </div>
          
//           <div className="description-container">
//             <div className="description-label">{t('apply.description')}</div>
//             <textarea 
//               className="description-textarea" 
//               placeholder={t('apply.descriptionPlaceholder')}
//               value={illustrate}
//               onChange={handleIllustrateChange}
//             />
//             <button className="attachment-button" onClick={handleAddAttachment}>
//               <span className="attachment-icon">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
//                 </svg>
//               </span>
//               {t('apply.addAttachment')}
//             </button>
//           </div>
//         </div>
        
//         <div className="button-container">
//           <button 
//             className="cancel-button" 
//             onClick={handleCancel} 
//             disabled={loading || formSubmitInProgress.current}
//           >
//             {t('common.cancel')}
//           </button>
//           <button 
//             className={`submit-button ${loading || formSubmitInProgress.current ? 'loading' : ''}`}
//             onClick={handleSubmit}
//             disabled={loading || formSubmitInProgress.current}
//           >
//             {loading || formSubmitInProgress.current ? t('common.processing') : t('common.submit')}
//           </button>
//         </div>
        
//         {showLeaveTypeOptions && (
//           <>
//             <div className="overlay" onClick={() => setShowLeaveTypeOptions(false)}></div>
//             <div className="leave-type-options-container">
//               <div className="leave-type-category">{t('apply.legalLeaveTypes')}</div>
//               {leaveTypes
//                 .filter(type => type.category === t('apply.legalLeaveTypes'))
//                 .map((type, index) => (
//                   <div 
//                     key={index} 
//                     className="leave-type-option"
//                     onClick={() => handleLeaveTypeSelect(type)}
//                   >
//                     <div>{type.name}</div>
//                     <div className="available-hours">{t('apply.remaining')}：{type.remaining}</div>
//                   </div>
//                 ))
//               }
              
//               <div className="leave-type-category">{t('apply.companyBenefitLeaveTypes')}</div>
//               {leaveTypes
//                 .filter(type => type.category === t('apply.companyBenefitLeaveTypes'))
//                 .map((type, index) => (
//                   <div 
//                     key={index} 
//                     className="leave-type-option"
//                     onClick={() => handleLeaveTypeSelect(type)}
//                   >
//                     <div>{type.name}</div>
//                     <div className="available-hours">{t('apply.remaining')}：{type.remaining}</div>
//                   </div>
//                 ))
//               }
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
//           <div className="loading-overlay">
//             <div className="loading-spinner"></div>
//             <div className="loading-text">{t('common.processing')}</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Apply;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GOOGLE_API_KEY, MASTER_SHEET_ID, MASTER_RANGE, SHEET_NAMES, SERVER_API_URL, APPLICATION_FORM_API_URL } from '../contexts/config';
import './PMX_CSS/ApplyPMX.css';
import { validateUserFromCookies } from './function/function';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import CalendarSelector from '../Google_sheet/Time Selector/Calendar Selector'; // 引入日期選擇器組件
import TimeSelector from '../Google_sheet/Time Selector/Time Selector'; // 引入時間選擇器組件
import LanguageSwitch from './components/LanguageSwitch';
import { useLanguage } from './Hook/useLanguage'; // 引入語言 hook
import { API_BASE_URL } from '../config';

function Apply() {
  // 引入語言功能
  const { t } = useLanguage();
  
  // 獲取當前日期和時間的函數
  const getCurrentDateTimeInfo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 獲取星期幾
    const weekdays = [
      t('apply.weekdays.sunday'), 
      t('apply.weekdays.monday'), 
      t('apply.weekdays.tuesday'), 
      t('apply.weekdays.wednesday'), 
      t('apply.weekdays.thursday'), 
      t('apply.weekdays.friday'), 
      t('apply.weekdays.saturday')
    ];
    const weekday = weekdays[now.getDay()];
    
    // 格式化日期
    const formattedDate = `${year}${t('apply.year')} ${month}${t('apply.month')}${day}${t('apply.day')}`;
    
    // 獲取當前時間，並向上取整到最近的五分鐘
    const hours = now.getHours();
    const minutes = Math.floor(now.getMinutes() / 5) * 5;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    return {
      formattedDate,
      weekday,
      formattedTime
    };
  };

  // 獲取當前日期時間信息
  const currentDateTimeInfo = getCurrentDateTimeInfo();
  
  // 移除 EmployeeContext 依賴，改用本地狀態管理員工資料
  const [employeeInfo, setEmployeeInfo] = useState({
    department: '',
    position: '',
    jobGrade: '',
    supervisor: ''
  });
  
  const [currentTime, setCurrentTime] = useState('--:--');
  const [selectedLeaveType, setSelectedLeaveType] = useState(t('apply.leaveTypes.personal'));
  const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
  const [illustrate, setIllustrate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formId, setFormId] = useState('');
  const [lunchBreakHours, setLunchBreakHours] = useState(1);
  
  // 新增用於存儲驗證後的用戶資訊
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [authToken, setAuthToken] = useState('');
  
  // 日期時間選擇器狀態 - 初始化為當前日期和時間
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
  const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedTime);
  const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
  const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedTime);
  const [isEditingStart, setIsEditingStart] = useState(true);
  const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday);
  const [leaveHours, setLeaveHours] = useState(`0${t('apply.days')} 0${t('apply.hours')} 0${t('apply.minutes')}`);
  const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');
  
  // 新增 ref 來追蹤狀態
  const formSubmitInProgress = useRef(false);

  // 將 cookieUtils 移到組件外部或使用 useRef 來避免重新創建
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
    
    set: (name, value, days = 7) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
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

  // 獲取員工資料
  const fetchEmployeeInfo = useCallback(async () => {
    if (!companyId || !employeeId || !authToken) {
      console.log('缺少獲取員工資料的必要參數');
      return;
    }
    
    try {
      setLoading(true);
      
      // 檢查 sessionStorage 中是否有緩存的員工資料
      const cachedEmployeeInfo = sessionStorage.getItem('employee_info_cache');
      if (cachedEmployeeInfo) {
        const cacheData = JSON.parse(cachedEmployeeInfo);
        const cacheTime = new Date(cacheData.timestamp);
        const now = new Date();
        // 緩存 5 分鐘內有效
        if ((now - cacheTime) < 5 * 60 * 1000) {
          console.log('使用緩存的員工資料');
          const employeeData = cacheData.data.Data || cacheData.data;
          setEmployeeInfo({
            department: employeeData.department || '',
            position: employeeData.position || '',
            jobGrade: employeeData.job_grade || '',
            supervisor: employeeData.supervisor || ''
          });
          return;
        }
      }
      
      console.log('查詢員工資料，參數:', {
        company_id: companyId,
        employee_id: employeeId,
        authToken: authToken ? '已設置' : '未設置'
      });
      
      // 使用新系統API端點
      const response = await fetch(`${API_BASE_URL}/api/employee/info`, {
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
        // 將員工資料存入 sessionStorage
        sessionStorage.setItem('employee_info_cache', JSON.stringify({
          data: result,
          timestamp: new Date().toISOString()
        }));
        
        const employeeData = result.Data;
        
        // 設置員工資料
        setEmployeeInfo({
          department: employeeData.department || '',
          position: employeeData.position || '',
          jobGrade: employeeData.job_grade || '',
          supervisor: employeeData.supervisor || ''
        });
        
        console.log('員工資料查詢成功:', employeeData);
      } else {
        console.error('員工資料查詢失敗:', result.Msg);
        setError(`${t('apply.employeeDataQueryFailed')}: ${result.Msg}`);
      }
    } catch (err) {
      console.error('查詢員工資料時發生錯誤:', err);
      setError(`${t('apply.employeeDataQueryError')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [companyId, employeeId, authToken, t]);

  // 當認證信息更新後，獲取員工資料
  useEffect(() => {
    if (companyId && employeeId && authToken) {
      fetchEmployeeInfo();
    }
  }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

  // 修改後的函數，使用本地隨機數生成表單編號
  const generateFormNumber = () => {
    const now = new Date();
    const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    const year = taiwanTime.getUTCFullYear();
    const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
    const datePart = `${year}${month}${day}`;
    const sequenceNumber = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    
    return `${datePart}${sequenceNumber}`;
  };

  // 從總表獲取表單ID
  useEffect(() => {
    if (companyId && !formId) {
      fetchFormId();
    }
  }, [companyId, formId]);
  
  // 獲取表單ID
  const fetchFormId = async () => {
    try {
      console.log(`正在從總表獲取 ${companyId} 的表單ID...`);
      const response = await fetch(`${SERVER_API_URL}/api/get-form-id/${companyId}`);
      const data = await response.json();
      
      if (data.success && data.formId) {
        setFormId(data.formId);
        console.log(`已設置 ${companyId} 的表單ID: ${data.formId}`);
        
        // 獲取中午休息時間
        fetchLunchBreakHours(data.formId);
      } else {
        console.error('獲取表單ID失敗:', data.error);
      }
    } catch (error) {
      console.error('獲取表單ID時出錯:', error);
    }
  };
  
  // 從 Google Sheets 獲取中午休息時間
  const fetchLunchBreakHours = async (formId) => {
    if (!formId) return;
    
    try {
      console.log(`正在獲取公司中午休息時間，表單ID: ${formId}`);
      
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${formId}/values/${SHEET_NAMES.COMPANY_INFO}!F2?key=${GOOGLE_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`${t('apply.fetchLunchBreakFailed')}: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.values && data.values[0] && data.values[0][0]) {
        const hours = parseFloat(data.values[0][0]);
        setLunchBreakHours(isNaN(hours) ? 1 : hours);
        console.log(`已設置中午休息時間: ${hours}小時`);
      } else {
        console.log('找不到中午休息時間資料，使用預設值1小時');
        setLunchBreakHours(1);
      }
    } catch (error) {
      console.error('獲取中午休息時間出錯:', error);
      setLunchBreakHours(1);
    }
  };

  // 假別資料
  const leaveTypes = [
    { name: t('apply.leaveTypes.compensatory'), apiValue: 'compensatory_leave', remaining: `4${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.annual'), apiValue: 'annual_leave', remaining: `6${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.personal'), apiValue: 'personal_leave', remaining: `2${t('apply.days')}23${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.sick'), apiValue: 'sick_leave', remaining: `23${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.menstrual'), apiValue: 'menstrual_leave', remaining: `1${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.makeup'), apiValue: 'makeup_leave', remaining: `0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.official'), apiValue: 'official_leave', remaining: `10${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.marriage'), apiValue: 'marriage_leave', remaining: `8${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.prenatalCheckup'), apiValue: 'prenatal_checkup_leave', remaining: `24${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.maternity'), apiValue: 'maternity_leave', remaining: `56${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.paternity'), apiValue: 'paternity_leave', remaining: `7${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.study'), apiValue: 'study_leave', remaining: `14${t('apply.days')} 0${t('apply.hours')}`, category: t('apply.legalLeaveTypes') },
    { name: t('apply.leaveTypes.birthday'), apiValue: 'birthday_leave', remaining: `0${t('apply.hours')}`, category: t('apply.companyBenefitLeaveTypes') }
  ];
  
  // 取得目前選擇假別的剩餘時數
  const getSelectedLeaveRemaining = () => {
    const selected = leaveTypes.find(type => type.name === selectedLeaveType);
    return selected ? selected.remaining : '';
  };
  
  // 更新右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  // 格式化日期為 API 格式 (YYYY-MM-DD)
  const formatDateForApi = (dateStr) => {
    const year = parseInt(dateStr.match(/(\d+)年/)[1]);
    const month = parseInt(dateStr.match(/(\d+)月/)[1]);
    const day = parseInt(dateStr.match(/(\d+)日/)[1]);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // 格式化時間為 API 格式 (HH:MM:SS)
  const formatTimeForApi = (timeStr) => {
    return `${timeStr}:00`;
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
  const formattedDate = `${year}${t('apply.year')} ${month}${t('apply.month')}${day}${t('apply.day')}`;
  
  const weekdays = [
    t('apply.weekdays.sunday'), 
    t('apply.weekdays.monday'), 
    t('apply.weekdays.tuesday'), 
    t('apply.weekdays.wednesday'), 
    t('apply.weekdays.thursday'), 
    t('apply.weekdays.friday'), 
    t('apply.weekdays.saturday')
  ];
  const weekday = weekdays[date.getDay()];
  
  if (isEditingStart) {
    // 選擇開始日期
    setStartDate(formattedDate);
    setSelectedWeekday(weekday);
    setShowDatePicker(false);
    calculateLeaveHours();
    
    // 自動開啟開始時間選擇
    setTimeout(() => {
      setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
    }, 300);
    
  } else {
    // 選擇結束日期
    setEndDate(formattedDate);
    setSelectedWeekday(weekday);
    setShowDatePicker(false);
    calculateLeaveHours();
    
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
    calculateLeaveHours();
    
    // 自動開啟結束日期選擇
    setTimeout(() => {
      setIsEditingStart(false); // 切換到編輯結束日期
      setShowDatePicker(true);  // 開啟日期選擇器
    }, 300);
    
  } else {
    // 選擇結束時間
    setEndTime(formattedTime);
    setShowTimePicker(false);
    calculateLeaveHours();
    
    // 完成所有選擇，重置狀態
    setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
  }
};



  // 計算請假時數，扣除中午休息時間
  const calculateLeaveHours = useCallback(() => {
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
      
      let diffMs = endDateTime - startDateTime;
      
      if (diffMs < 0) {
        setLeaveHours(`0${t('apply.days')} 0${t('apply.hours')} 0${t('apply.minutes')}`);
        return;
      }
      
      // 檢查是否需要扣除中午休息時間
      const lunchStartHour = 12;
      const lunchEndHour = lunchStartHour + lunchBreakHours;
      
      const startDateDay = startDateTime.getDate();
      const endDateDay = endDateTime.getDate();
      
      // 計算請假天數
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
      // 計算需要扣除的中午休息時間（毫秒）
      let lunchBreakMs = 0;
      
      // 如果請假時間跨越了中午休息時間
      if (days === 0 && startDateDay === endDateDay) {
        // 同一天的情況
        const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
        const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
        // 檢查請假時間是否完全包含中午休息時間
        if (startHour < lunchStartHour && endHour > lunchEndHour) {
          lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
        } 
        // 檢查請假時間是否部分包含中午休息時間
        else if (
          (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
          (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
        ) {
          const overlapStart = Math.max(startHour, lunchStartHour);
          const overlapEnd = Math.min(endHour, lunchEndHour);
          lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
        }
        // 檢查請假時間是否完全在中午休息時間內
        else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
          lunchBreakMs = diffMs;
        }
      } else {
        // 跨天的情況，每天都需要扣除中午休息時間
        lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
        // 檢查起始日是否需要扣除中午休息時間
        const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
        if (startHour < lunchEndHour) {
          const overlapEnd = Math.min(24, lunchEndHour);
          lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
        }
        
        // 檢查結束日是否需要扣除中午休息時間
        const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        if (endHour > lunchStartHour) {
          const overlapStart = Math.max(0, lunchStartHour);
          lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
        }
      }
      
      // 確保不會扣除過多
      lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
      // 扣除中午休息時間
      diffMs -= lunchBreakMs;
      
      // 重新計算天、小時、分鐘
      const adjustedDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      const adjustedHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const adjustedMinutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
      setLeaveHours(`${adjustedDays}${t('apply.days')} ${adjustedHours}${t('apply.hours')} ${adjustedMinutes}${t('apply.minutes')}`);
      
      console.log(`請假總時數: ${diffMs / (60 * 60 * 1000)}小時，已扣除中午休息時間: ${lunchBreakMs / (60 * 60 * 1000)}小時`);
      
    } catch (e) {
      console.error('日期時間計算錯誤', e);
      setLeaveHours(`0${t('apply.days')} 0${t('apply.hours')} 0${t('apply.minutes')}`);
    }
  }, [startDate, startTime, endDate, endTime, lunchBreakHours, t]);
  
  useEffect(() => {
    calculateLeaveHours();
  }, [calculateLeaveHours]);

  // 處理表單提交 - 修改版本
  const handleSubmit = async () => {
    // 避免重複提交
    if (loading || formSubmitInProgress.current) {
      console.log('表單提交已在進行中，跳過重複提交');
      return;
    }
    
    if (!companyId || !employeeId || !authToken) {
      alert(t('apply.loginRequired'));
      window.location.href = '/applogin01/';
      return;
    }
    
    // 檢查是否已獲取員工資料
    if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
      console.log('員工資料不完整，重新獲取...');
      await fetchEmployeeInfo();
      if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
        alert(t('apply.employeeDataIncomplete'));
        return;
      }
    }
    
    try {
      formSubmitInProgress.current = true;
      setLoading(true);
      setError(null);
      
      console.log('使用員工資料:', employeeInfo);
      
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);
      const formattedStartTime = formatTimeForApi(startTime);
      const formattedEndTime = formatTimeForApi(endTime);
      
      // 計算總時數 (小時)
      const parseDateTime = (dateStr, timeStr) => {
        const year = parseInt(dateStr.match(/(\d+)年/)[1]);
        const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
        const day = parseInt(dateStr.match(/(\d+)日/)[1]);
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        return new Date(year, month, day, hours, minutes);
      };
      
      const startDateTime = parseDateTime(startDate, startTime);
      const endDateTime = parseDateTime(endDate, endTime);
      let diffMs = endDateTime - startDateTime;
      
      // 扣除中午休息時間
      const lunchStartHour = 12;
      const lunchEndHour = lunchStartHour + lunchBreakHours;
      
      const startDateDay = startDateTime.getDate();
      const endDateDay = endDateTime.getDate();
      
      // 計算請假天數
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
      // 計算需要扣除的中午休息時間（毫秒）
      let lunchBreakMs = 0;
      
      // 如果請假時間跨越了中午休息時間
      if (days === 0 && startDateDay === endDateDay) {
        // 同一天的情況
        const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
        const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
        // 檢查請假時間是否完全包含中午休息時間
        if (startHour < lunchStartHour && endHour > lunchEndHour) {
          lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
        } 
        // 檢查請假時間是否部分包含中午休息時間
        else if (
          (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
          (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
        ) {
          const overlapStart = Math.max(startHour, lunchStartHour);
          const overlapEnd = Math.min(endHour, lunchEndHour);
          lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
        }
        // 檢查請假時間是否完全在中午休息時間內
        else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
          lunchBreakMs = diffMs;
        }
      } else {
        // 跨天的情況，每天都需要扣除中午休息時間
        lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
        // 檢查起始日是否需要扣除中午休息時間
        const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
        if (startHour < lunchEndHour) {
          const overlapEnd = Math.min(24, lunchEndHour);
          lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
        }
        
        // 檢查結束日是否需要扣除中午休息時間
        const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        if (endHour > lunchStartHour) {
          const overlapStart = Math.max(0, lunchStartHour);
          lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
        }
      }
      
      // 確保不會扣除過多
      lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
      // 扣除中午休息時間
      diffMs -= lunchBreakMs;
      
      const totalHours = diffMs / (60 * 60 * 1000);
      
      if (totalHours <= 0) {
        alert(t('apply.invalidDuration'));
        return;
      }
      
      if (!illustrate.trim()) {
        alert(t('apply.missingReason'));
        return;
      }
      
      // 生成表單編號
      const formNumber = generateFormNumber();
      
      // 獲取當前日期時間（使用台灣時間 UTC+8）
      const now = new Date();
      const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      
      const year = taiwanTime.getUTCFullYear();
      const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
      const hours = String(taiwanTime.getUTCHours()).padStart(2, '0');
      const minutes = String(taiwanTime.getUTCMinutes()).padStart(2, '0');
      const seconds = String(taiwanTime.getUTCSeconds()).padStart(2, '0');
      
      const applicationDate = `${year}-${month}-${day}`;
      const applicationTime = `${hours}:${minutes}:${seconds}`;
      
      // 使用後端API提交申請表單 - 包含從API獲取的員工資料
      const payload = {
        company_id: companyId,
        employee_id: employeeId,
        department: employeeInfo.department || '', // 從API獲取的部門
        position: employeeInfo.position || '',     // 從API獲取的職位
        job_grade: employeeInfo.jobGrade || '',    // 從API獲取的職級
        leave_type: selectedLeaveType,
        leave_type_api: selectedLeaveTypeApi,
        start_date: formattedStartDate,
        start_time: formattedStartTime,
        end_date: formattedEndDate,
        end_time: formattedEndTime,
        leave_hours: leaveHours,
        total_calculation_hours: totalHours.toFixed(2),
        lunch_break_hours: lunchBreakHours,
        illustrate: illustrate || '',
        application_id: formNumber,
        application_status: '待審核',
        application_date: applicationDate,
        application_time: applicationTime
      };
      
      console.log('正在提交申請表單資料（包含API獲取的員工資料）:', payload);
      
      // 使用 Promise.all 並行處理兩個 API 請求
      const [response1, response2] = await Promise.all([
        // 1. 原本的 API
        fetch(`${SERVER_API_URL}/api/apply-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).then(res => res.json()).catch(err => {
          console.error('原系統 API 請求失敗:', err);
          return { error: err.message };
        }),
        
        // 2. 新增的 Application_Form API - 包含從API獲取的員工資料
        fetch(APPLICATION_FORM_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}` // 添加 auth_token
          },
          body: JSON.stringify({
            form_number: formNumber,
            company_id: parseInt(companyId),
            employee_id: employeeId,
            category: "leave",
            type: selectedLeaveTypeApi, // 使用API值而不是顯示名稱
            start_date: formattedStartDate,
            start_time: formattedStartTime,
            end_date: formattedEndDate,
            end_time: formattedEndTime,
            total_calculation_hours: parseFloat(totalHours.toFixed(2)),
            illustrate: illustrate || '',
            department: employeeInfo.department || '',  // 從API獲取的部門
            position: employeeInfo.position || '',      // 從API獲取的職位
            job_grade: employeeInfo.jobGrade || '',     // 從API獲取的職級
            status: "pending",  // 使用英文狀態值
            application_date: applicationDate,
            reviewer_name: null,
            reviewer_job_grade: null,
            reviewer_status: "pending",  // 使用英文狀態值
            hr_name: null,
            hr_status: "pending",  // 使用英文狀態值
            reviewer: employeeInfo.supervisor || null   // 從API獲取的主管
          }),
          
        }).then(res => res.json()).catch(err => {
          console.error('新系統 API 請求失敗:', err);
          return { error: err.message };
        })
      ]);
      
      // 檢查兩個 API 的回應
      let hasSuccess = false;
      
      if (response1.success && !response1.error) {
        console.log('原 API 申請表單提交成功:', response1);
        hasSuccess = true;
      } else {
        console.error('原 API 提交失敗:', response1);
      }
      
      if (!response2.error && response2.Status === "Ok") {
        console.log('Application_Form API 提交成功:', response2);
        hasSuccess = true;
      } else {
        console.error('Application_Form API 提交失敗:', response2);
      }
      
      if (hasSuccess) {
        alert(t('apply.success'));
        window.location.href = '/leave01';
      } else {
        throw new Error(t('apply.allApiFailed'));
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('提交請求超時');
        alert(t('apply.submitTimeout'));
      } else {
        console.error('請假申請失敗:', err);
        setError(`${t('apply.requestProcessingError')}: ${err.message}`);
        alert(`${t('apply.failed')}: ${err.message}`);
      }
    } finally {
      // 確保無論成功或失敗，loading 狀態和提交標記都會被重置
      setLoading(false);
      formSubmitInProgress.current = false;
    }
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
  
  const handleCancel = () => {
    console.log('取消請假申請');
    window.location.href = '/leave01';
  };

  const handleAddAttachment = () => {
    console.log('新增附件');
    alert(t('apply.attachmentNotAvailable'));
  };
  
  const handleLeaveTypeSelect = (type) => {
    setSelectedLeaveType(type.name);
    setSelectedLeaveTypeApi(type.apiValue);
    setShowLeaveTypeOptions(false);
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
      <div className="error-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{message}</div>
          <button className="error-close" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="app-wrapper">
        <header className="header">
          <div className="home-icon" onClick={handleGoHome}>
            <img 
              src={homeIcon} 
              alt={t('home.title')} 
              width="22" 
              height="22" 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="page-title">{t('apply.title')}</div>
          <div className="apply-language-switch">
            <LanguageSwitch 
              className="apply-language-switch-component"
              containerClassName="apply-language-container"
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
        
        <div className="form-container">
          <div className="form-row">
            <div className="form-label">{t('apply.leaveType')}</div>
            <div className="form-value">
              <div 
                className="leave-type-selector" 
                onClick={() => setShowLeaveTypeOptions(true)}
              >
                <div className="leave-type-name">{selectedLeaveType}</div>
                <div className="available-hours">{t('apply.remaining')}：{getSelectedLeaveRemaining()}</div>
                <div className="dropdown-icon">▼</div>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-label">{t('apply.startDate')}</div>
            <div className="form-value">
              <div className="date-time-row">
                <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
                <div className="weekday">{selectedWeekday}</div>
                <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-label">{t('apply.endDate')}</div>
            <div className="form-value">
              <div className="date-time-row">
                <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
                <div className="weekday">{selectedWeekday}</div>
                <div className="time-input" onClick={() => handleTimeClick(false)}>{endTime}</div>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-label">{t('apply.duration')}</div>
            <div className="form-value">
              <div className="hours">{leaveHours}</div>
            </div>
          </div>
          
          <div className="description-container">
            <div className="description-label">{t('apply.description')}</div>
            <textarea 
              className="description-textarea" 
              placeholder={t('apply.descriptionPlaceholder')}
              value={illustrate}
              onChange={handleIllustrateChange}
            />
            <button className="attachment-button" onClick={handleAddAttachment}>
              <span className="attachment-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              {t('apply.addAttachment')}
            </button>
          </div>
        </div>
        
        <div className="button-container">
          <button 
            className="cancel-button" 
            onClick={handleCancel} 
            disabled={loading || formSubmitInProgress.current}
          >
            {t('common.cancel')}
          </button>
          <button 
            className={`submit-button ${loading || formSubmitInProgress.current ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading || formSubmitInProgress.current}
          >
            {loading || formSubmitInProgress.current ? t('common.processing') : t('common.submit')}
          </button>
        </div>
        
        {showLeaveTypeOptions && (
          <>
            <div className="overlay" onClick={() => setShowLeaveTypeOptions(false)}></div>
            <div className="leave-type-options-container">
              <div className="leave-type-category">{t('apply.legalLeaveTypes')}</div>
              {leaveTypes
                .filter(type => type.category === t('apply.legalLeaveTypes'))
                .map((type, index) => (
                  <div 
                    key={index} 
                    className="leave-type-option"
                    onClick={() => handleLeaveTypeSelect(type)}
                  >
                    <div>{type.name}</div>
                    <div className="available-hours">{t('apply.remaining')}：{type.remaining}</div>
                  </div>
                ))
              }
              
              <div className="leave-type-category">{t('apply.companyBenefitLeaveTypes')}</div>
              {leaveTypes
                .filter(type => type.category === t('apply.companyBenefitLeaveTypes'))
                .map((type, index) => (
                  <div 
                    key={index} 
                    className="leave-type-option"
                    onClick={() => handleLeaveTypeSelect(type)}
                  >
                    <div>{type.name}</div>
                    <div className="available-hours">{t('apply.remaining')}：{type.remaining}</div>
                  </div>
                ))
              }
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
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">{t('common.processing')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Apply;
