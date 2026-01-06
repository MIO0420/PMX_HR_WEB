// // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // import { GOOGLE_API_KEY, MASTER_SHEET_ID, MASTER_RANGE, SHEET_NAMES, SERVER_API_URL, APPLICATION_FORM_API_URL } from '../contexts/config';
// // // import './css/Apply.css';
// // // import { validateUserFromCookies } from './function/function';
// // // import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// // // import TimeSelector from './Time Selector/Time Selector';
// // // import CalendarSelector from './Time Selector/Calendar Selector'; // 引入日期選擇器組件

// // // function Apply() {
// // //   // 獲取當前日期和時間的函數
// // //   const getCurrentDateTimeInfo = () => {
// // //     const now = new Date();
// // //     const year = now.getFullYear();
// // //     const month = now.getMonth() + 1;
// // //     const day = now.getDate();
    
// // //     // 獲取星期幾
// // //     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
// // //     const weekday = weekdays[now.getDay()];
    
// // //     // 格式化日期
// // //     const formattedDate = `${year}年 ${month}月${day}日`;
    
// // //     // 獲取當前時間，並向上取整到最近的五分鐘
// // //     const hours = now.getHours();
// // //     const minutes = Math.floor(now.getMinutes() / 5) * 5;
// // //     const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
// // //     return {
// // //       formattedDate,
// // //       weekday,
// // //       formattedTime
// // //     };
// // //   };

// // //   // 獲取當前日期時間信息
// // //   const currentDateTimeInfo = getCurrentDateTimeInfo();
  
// // //   // 移除 EmployeeContext 依賴，改用本地狀態管理員工資料
// // //   const [employeeInfo, setEmployeeInfo] = useState({
// // //     department: '',
// // //     position: '',
// // //     jobGrade: '',
// // //     supervisor: ''
// // //   });
  
// // //   const [currentTime, setCurrentTime] = useState('--:--');
// // //   const [selectedLeaveType, setSelectedLeaveType] = useState('事假');
// // //   const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
// // //   const [illustrate, setIllustrate] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [formId, setFormId] = useState('');
// // //   const [lunchBreakHours, setLunchBreakHours] = useState(1);
  
// // //   // 新增用於存儲驗證後的用戶資訊
// // //   const [companyId, setCompanyId] = useState("");
// // //   const [employeeId, setEmployeeId] = useState("");
// // //   const [authToken, setAuthToken] = useState('');
  
// // //   // 日期時間選擇器狀態 - 初始化為當前日期和時間
// // //   const [showDatePicker, setShowDatePicker] = useState(false);
// // //   const [showTimePicker, setShowTimePicker] = useState(false);
// // //   const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
// // //   const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedTime);
// // //   const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
// // //   const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedTime);
// // //   const [isEditingStart, setIsEditingStart] = useState(true);
  
// // //   // 修改：分別管理開始和結束日期的星期
// // //   const [startWeekday, setStartWeekday] = useState(currentDateTimeInfo.weekday);
// // //   const [endWeekday, setEndWeekday] = useState(currentDateTimeInfo.weekday);
  
// // //   const [leaveHours, setLeaveHours] = useState('0天 0小時 0分鐘');
// // //   const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');
  
// // //   // 新增 ref 來追蹤狀態
// // //   const formSubmitInProgress = useRef(false);

// // //   // 將 cookieUtils 移到組件外部或使用 useRef 來避免重新創建
// // //   const cookieUtils = useRef({
// // //     get: (name) => {
// // //       const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
// // //         const [key, value] = cookie.split('=');
// // //         if (key && value) {
// // //           acc[decodeURIComponent(key)] = decodeURIComponent(value);
// // //         }
// // //         return acc;
// // //       }, {});
// // //       return cookies[name];
// // //     },
    
// // //     set: (name, value, days = 7) => {
// // //       const expires = new Date();
// // //       expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
// // //       document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
// // //     },
    
// // //     remove: (name) => {
// // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
// // //     }
// // //   }).current;

// // //   // 使用共用函數驗證用戶
// // //   useEffect(() => {
// // //     validateUserFromCookies(
// // //       setLoading,
// // //       setAuthToken,
// // //       setCompanyId,
// // //       setEmployeeId
// // //     );
// // //   }, []);

// // //   // 獲取員工資料
// // //   const fetchEmployeeInfo = useCallback(async () => {
// // //     if (!companyId || !employeeId || !authToken) {
// // //       console.log('缺少獲取員工資料的必要參數');
// // //       return;
// // //     }
    
// // //     try {
// // //       setLoading(true);
      
// // //       // 檢查 sessionStorage 中是否有緩存的員工資料
// // //       const cachedEmployeeInfo = sessionStorage.getItem('employee_info_cache');
// // //       if (cachedEmployeeInfo) {
// // //         const cacheData = JSON.parse(cachedEmployeeInfo);
// // //         const cacheTime = new Date(cacheData.timestamp);
// // //         const now = new Date();
// // //         // 緩存 5 分鐘內有效
// // //         if ((now - cacheTime) < 5 * 60 * 1000) {
// // //           console.log('使用緩存的員工資料');
// // //           const employeeData = cacheData.data.Data || cacheData.data;
// // //           setEmployeeInfo({
// // //             department: employeeData.department || '',
// // //             position: employeeData.position || '',
// // //             jobGrade: employeeData.job_grade || '',
// // //             supervisor: employeeData.supervisor || ''
// // //           });
// // //           return;
// // //         }
// // //       }
      
// // //       console.log('查詢員工資料，參數:', {
// // //         company_id: companyId,
// // //         employee_id: employeeId,
// // //         authToken: authToken ? '已設置' : '未設置'
// // //       });
      
// // //       // 使用新系統API端點
// // //       const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${authToken}`
// // //         },
// // //         body: JSON.stringify({
// // //           company_id: companyId,
// // //           employee_id: employeeId
// // //         })
// // //       });
      
// // //       const result = await response.json();
      
// // //       if (result.Status === "Ok") {
// // //         // 將員工資料存入 sessionStorage
// // //         sessionStorage.setItem('employee_info_cache', JSON.stringify({
// // //           data: result,
// // //           timestamp: new Date().toISOString()
// // //         }));
        
// // //         const employeeData = result.Data;
        
// // //         // 設置員工資料
// // //         setEmployeeInfo({
// // //           department: employeeData.department || '',
// // //           position: employeeData.position || '',
// // //           jobGrade: employeeData.job_grade || '',
// // //           supervisor: employeeData.supervisor || ''
// // //         });
        
// // //         console.log('員工資料查詢成功:', employeeData);
// // //       } else {
// // //         console.error('員工資料查詢失敗:', result.Msg);
// // //         setError(`員工資料查詢失敗: ${result.Msg}`);
// // //       }
// // //     } catch (err) {
// // //       console.error('查詢員工資料時發生錯誤:', err);
// // //       setError(`查詢員工資料時發生錯誤: ${err.message}`);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [companyId, employeeId, authToken]);

// // //   // 當認證信息更新後，獲取員工資料
// // //   useEffect(() => {
// // //     if (companyId && employeeId && authToken) {
// // //       fetchEmployeeInfo();
// // //     }
// // //   }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

// // //   // 修改後的函數，使用本地隨機數生成表單編號
// // //   const generateFormNumber = () => {
// // //     const now = new Date();
// // //     const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
// // //     const year = taiwanTime.getUTCFullYear();
// // //     const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
// // //     const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
// // //     const datePart = `${year}${month}${day}`;
// // //     const sequenceNumber = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    
// // //     return `${datePart}${sequenceNumber}`;
// // //   };

// // //   // 從總表獲取表單ID
// // //   useEffect(() => {
// // //     if (companyId && !formId) {
// // //       fetchFormId();
// // //     }
// // //   }, [companyId, formId]);
  
// // //   // 獲取表單ID
// // //   const fetchFormId = async () => {
// // //     try {
// // //       console.log(`正在從總表獲取 ${companyId} 的表單ID...`);
// // //       const response = await fetch(`${SERVER_API_URL}/api/get-form-id/${companyId}`);
// // //       const data = await response.json();
      
// // //       if (data.success && data.formId) {
// // //         setFormId(data.formId);
// // //         console.log(`已設置 ${companyId} 的表單ID: ${data.formId}`);
        
// // //         // 獲取中午休息時間
// // //         fetchLunchBreakHours(data.formId);
// // //       } else {
// // //         console.error('獲取表單ID失敗:', data.error);
// // //       }
// // //     } catch (error) {
// // //       console.error('獲取表單ID時出錯:', error);
// // //     }
// // //   };
  
// // //   // 從 Google Sheets 獲取中午休息時間
// // //   const fetchLunchBreakHours = async (formId) => {
// // //     if (!formId) return;
    
// // //     try {
// // //       console.log(`正在獲取公司中午休息時間，表單ID: ${formId}`);
      
// // //       const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${formId}/values/${SHEET_NAMES.COMPANY_INFO}!F2?key=${GOOGLE_API_KEY}`);
      
// // //       if (!response.ok) {
// // //         throw new Error(`獲取中午休息時間失敗: ${response.status}`);
// // //       }
      
// // //       const data = await response.json();
      
// // //       if (data && data.values && data.values[0] && data.values[0][0]) {
// // //         const hours = parseFloat(data.values[0][0]);
// // //         setLunchBreakHours(isNaN(hours) ? 1 : hours);
// // //         console.log(`已設置中午休息時間: ${hours}小時`);
// // //       } else {
// // //         console.log('找不到中午休息時間資料，使用預設值1小時');
// // //         setLunchBreakHours(1);
// // //       }
// // //     } catch (error) {
// // //       console.error('獲取中午休息時間出錯:', error);
// // //       setLunchBreakHours(1);
// // //     }
// // //   };

// // //   // 假別資料
// // //   const leaveTypes = [
// // //     { name: '換休', apiValue: 'compensatory_leave', remaining: '4小時', category: '法定假別' },
// // //     { name: '特休', apiValue: 'annual_leave', remaining: '6小時', category: '法定假別' },
// // //     { name: '事假', apiValue: 'personal_leave', remaining: '2天23小時', category: '法定假別' },
// // //     { name: '病假', apiValue: 'sick_leave', remaining: '23小時', category: '法定假別' },
// // //     { name: '生理假', apiValue: 'menstrual_leave', remaining: '1天 0小時', category: '法定假別' },
// // //     { name: '補休', apiValue: 'makeup_leave', remaining: '0小時', category: '法定假別' },
// // //     { name: '公假', apiValue: 'official_leave', remaining: '10小時', category: '法定假別' },
// // //     { name: '婚假', apiValue: 'marriage_leave', remaining: '8天 0小時', category: '法定假別' },
// // //     { name: '產檢假', apiValue: 'prenatal_checkup_leave', remaining: '24小時', category: '法定假別' },
// // //     { name: '產假', apiValue: 'maternity_leave', remaining: '56天 0小時', category: '法定假別' },
// // //     { name: '陪產假', apiValue: 'paternity_leave', remaining: '7天 0小時', category: '法定假別' },
// // //     { name: '溫書假', apiValue: 'study_leave', remaining: '14天 0小時', category: '法定假別' },
// // //     { name: '生日假', apiValue: 'birthday_leave', remaining: '0小時', category: '公司福利假別' }
// // //   ];
  
// // //   // 取得目前選擇假別的剩餘時數
// // //   const getSelectedLeaveRemaining = () => {
// // //     const selected = leaveTypes.find(type => type.name === selectedLeaveType);
// // //     return selected ? selected.remaining : '';
// // //   };
  
// // //   // 更新右上角時間
// // //   useEffect(() => {
// // //     const updateClock = () => {
// // //       const now = new Date();
// // //       const hours = String(now.getHours()).padStart(2, '0');
// // //       const minutes = String(now.getMinutes()).padStart(2, '0');
// // //       setCurrentTime(`${hours}:${minutes}`);
// // //     };
// // //     updateClock();
// // //     const timer = setInterval(updateClock, 60000);
// // //     return () => clearInterval(timer);
// // //   }, []);

// // //   // 格式化日期為 API 格式 (YYYY-MM-DD)
// // //   const formatDateForApi = (dateStr) => {
// // //     const year = parseInt(dateStr.match(/(\d+)年/)[1]);
// // //     const month = parseInt(dateStr.match(/(\d+)月/)[1]);
// // //     const day = parseInt(dateStr.match(/(\d+)日/)[1]);
// // //     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// // //   };

// // //   // 格式化時間為 API 格式 (HH:MM:SS)
// // //   const formatTimeForApi = (timeStr) => {
// // //     return `${timeStr}:00`;
// // //   };

// // //   // 處理日期點擊
// // //   const handleDateClick = (isStart) => {
// // //     setIsEditingStart(isStart);
// // //     setShowDatePicker(true);
// // //   };
  
// // //   // 處理時間點擊
// // //   const handleTimeClick = (isStart) => {
// // //     setIsEditingStart(isStart);
// // //     setShowTimePicker(true);
// // //   };
  
// // //   // 修改：處理日期選擇，分別設置開始和結束日期的星期
// // //   const handleDateSelect = (date) => {
// // //     const year = date.getFullYear();
// // //     const month = date.getMonth() + 1;
// // //     const day = date.getDate();
// // //     const formattedDate = `${year}年 ${month}月${day}日`;
    
// // //     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
// // //     const weekday = weekdays[date.getDay()];
    
// // //     if (isEditingStart) {
// // //       // 選擇開始日期
// // //       setStartDate(formattedDate);
// // //       setStartWeekday(weekday); // 設置開始日期的星期
// // //       setShowDatePicker(false);
// // //       calculateLeaveHours();
      
// // //       // 自動開啟開始時間選擇
// // //       setTimeout(() => {
// // //         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
// // //       }, 300);
      
// // //     } else {
// // //       // 選擇結束日期
// // //       setEndDate(formattedDate);
// // //       setEndWeekday(weekday); // 設置結束日期的星期
// // //       setShowDatePicker(false);
// // //       calculateLeaveHours();
      
// // //       // 自動開啟結束時間選擇
// // //       setTimeout(() => {
// // //         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = false
// // //       }, 300);
// // //     }
// // //   };

// // //   // 處理時間選擇 - 修改版本，實現自動流程
// // //   const handleTimeSelect = (hour, minute) => {
// // //     const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
// // //     if (isEditingStart) {
// // //       // 選擇開始時間
// // //       setStartTime(formattedTime);
// // //       setShowTimePicker(false);
// // //       calculateLeaveHours();
      
// // //       // 自動開啟結束日期選擇
// // //       setTimeout(() => {
// // //         setIsEditingStart(false); // 切換到編輯結束日期
// // //         setShowDatePicker(true);  // 開啟日期選擇器
// // //       }, 300);
      
// // //     } else {
// // //       // 選擇結束時間
// // //       setEndTime(formattedTime);
// // //       setShowTimePicker(false);
// // //       calculateLeaveHours();
      
// // //       // 完成所有選擇，重置狀態
// // //       setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
// // //     }
// // //   };

// // //   // 計算請假時數，扣除中午休息時間
// // //   const calculateLeaveHours = useCallback(() => {
// // //     const parseDateTime = (dateStr, timeStr) => {
// // //       try {
// // //         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
// // //         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
// // //         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
        
// // //         const [hours, minutes] = timeStr.split(':').map(Number);
        
// // //         return new Date(year, month, day, hours, minutes);
// // //       } catch (e) {
// // //         console.error('日期時間解析錯誤', e);
// // //         return new Date();
// // //       }
// // //     };
    
// // //     try {
// // //       const startDateTime = parseDateTime(startDate, startTime);
// // //       const endDateTime = parseDateTime(endDate, endTime);
      
// // //       let diffMs = endDateTime - startDateTime;
      
// // //       if (diffMs < 0) {
// // //         setLeaveHours('0天 0小時 0分鐘');
// // //         return;
// // //       }
      
// // //       // 檢查是否需要扣除中午休息時間
// // //       const lunchStartHour = 12;
// // //       const lunchEndHour = lunchStartHour + lunchBreakHours;
      
// // //       const startDateDay = startDateTime.getDate();
// // //       const endDateDay = endDateTime.getDate();
      
// // //       // 計算請假天數
// // //       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
// // //       // 計算需要扣除的中午休息時間（毫秒）
// // //       let lunchBreakMs = 0;
      
// // //       // 如果請假時間跨越了中午休息時間
// // //       if (days === 0 && startDateDay === endDateDay) {
// // //         // 同一天的情況
// // //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// // //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
// // //         // 檢查請假時間是否完全包含中午休息時間
// // //         if (startHour < lunchStartHour && endHour > lunchEndHour) {
// // //           lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
// // //         } 
// // //         // 檢查請假時間是否部分包含中午休息時間
// // //         else if (
// // //           (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
// // //           (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
// // //         ) {
// // //           const overlapStart = Math.max(startHour, lunchStartHour);
// // //           const overlapEnd = Math.min(endHour, lunchEndHour);
// // //           lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
// // //         }
// // //         // 檢查請假時間是否完全在中午休息時間內
// // //         else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
// // //           lunchBreakMs = diffMs;
// // //         }
// // //       } else {
// // //         // 跨天的情況，每天都需要扣除中午休息時間
// // //         lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
// // //         // 檢查起始日是否需要扣除中午休息時間
// // //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// // //         if (startHour < lunchEndHour) {
// // //           const overlapEnd = Math.min(24, lunchEndHour);
// // //           lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
// // //         }
        
// // //         // 檢查結束日是否需要扣除中午休息時間
// // //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
// // //         if (endHour > lunchStartHour) {
// // //           const overlapStart = Math.max(0, lunchStartHour);
// // //           lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
// // //         }
// // //       }
      
// // //       // 確保不會扣除過多
// // //       lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
// // //       // 扣除中午休息時間
// // //       diffMs -= lunchBreakMs;
      
// // //       // 重新計算天、小時、分鐘
// // //       const adjustedDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
// // //       const adjustedHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
// // //       const adjustedMinutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
// // //       setLeaveHours(`${adjustedDays}天 ${adjustedHours}小時 ${adjustedMinutes}分鐘`);
      
// // //       console.log(`請假總時數: ${diffMs / (60 * 60 * 1000)}小時，已扣除中午休息時間: ${lunchBreakMs / (60 * 60 * 1000)}小時`);
      
// // //     } catch (e) {
// // //       console.error('日期時間計算錯誤', e);
// // //       setLeaveHours('0天 0小時 0分鐘');
// // //     }
// // //   }, [startDate, startTime, endDate, endTime, lunchBreakHours]);
  
// // //   useEffect(() => {
// // //     calculateLeaveHours();
// // //   }, [calculateLeaveHours]);

// // //   // 處理表單提交 - 修改版本
// // //   const handleSubmit = async () => {
// // //     // 避免重複提交
// // //     if (loading || formSubmitInProgress.current) {
// // //       console.log('表單提交已在進行中，跳過重複提交');
// // //       return;
// // //     }
    
// // //     if (!companyId || !employeeId || !authToken) {
// // //       alert('請先登入系統');
// // //       window.location.href = '/applogin01/';
// // //       return;
// // //     }
    
// // //     // 檢查是否已獲取員工資料
// // //     if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
// // //       console.log('員工資料不完整，重新獲取...');
// // //       await fetchEmployeeInfo();
// // //       if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
// // //         alert('無法獲取員工資料，請重新登入');
// // //         return;
// // //       }
// // //     }
    
// // //     try {
// // //       formSubmitInProgress.current = true;
// // //       setLoading(true);
// // //       setError(null);
      
// // //       console.log('使用員工資料:', employeeInfo);
      
// // //       const formattedStartDate = formatDateForApi(startDate);
// // //       const formattedEndDate = formatDateForApi(endDate);
// // //       const formattedStartTime = formatTimeForApi(startTime);
// // //       const formattedEndTime = formatTimeForApi(endTime);
      
// // //       // 計算總時數 (小時)
// // //       const parseDateTime = (dateStr, timeStr) => {
// // //         const year = parseInt(dateStr.match(/(\d+)年/)[1]);
// // //         const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
// // //         const day = parseInt(dateStr.match(/(\d+)日/)[1]);
// // //         const [hours, minutes] = timeStr.split(':').map(Number);
        
// // //         return new Date(year, month, day, hours, minutes);
// // //       };
      
// // //       const startDateTime = parseDateTime(startDate, startTime);
// // //       const endDateTime = parseDateTime(endDate, endTime);
// // //       let diffMs = endDateTime - startDateTime;
      
// // //       // 扣除中午休息時間
// // //       const lunchStartHour = 12;
// // //       const lunchEndHour = lunchStartHour + lunchBreakHours;
      
// // //       const startDateDay = startDateTime.getDate();
// // //       const endDateDay = endDateTime.getDate();
      
// // //       // 計算請假天數
// // //       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
// // //       // 計算需要扣除的中午休息時間（毫秒）
// // //       let lunchBreakMs = 0;
      
// // //       // 如果請假時間跨越了中午休息時間
// // //       if (days === 0 && startDateDay === endDateDay) {
// // //         // 同一天的情況
// // //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// // //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
        
// // //         // 檢查請假時間是否完全包含中午休息時間
// // //         if (startHour < lunchStartHour && endHour > lunchEndHour) {
// // //           lunchBreakMs = lunchBreakHours * 60 * 60 * 1000;
// // //         } 
// // //         // 檢查請假時間是否部分包含中午休息時間
// // //         else if (
// // //           (startHour < lunchStartHour && endHour > lunchStartHour && endHour <= lunchEndHour) ||
// // //           (startHour >= lunchStartHour && startHour < lunchEndHour && endHour > lunchEndHour)
// // //         ) {
// // //           const overlapStart = Math.max(startHour, lunchStartHour);
// // //           const overlapEnd = Math.min(endHour, lunchEndHour);
// // //           lunchBreakMs = (overlapEnd - overlapStart) * 60 * 60 * 1000;
// // //         }
// // //         // 檢查請假時間是否完全在中午休息時間內
// // //         else if (startHour >= lunchStartHour && endHour <= lunchEndHour) {
// // //           lunchBreakMs = diffMs;
// // //         }
// // //       } else {
// // //         // 跨天的情況，每天都需要扣除中午休息時間
// // //         lunchBreakMs = days * lunchBreakHours * 60 * 60 * 1000;
        
// // //         // 檢查起始日是否需要扣除中午休息時間
// // //         const startHour = startDateTime.getHours() + (startDateTime.getMinutes() / 60);
// // //         if (startHour < lunchEndHour) {
// // //           const overlapEnd = Math.min(24, lunchEndHour);
// // //           lunchBreakMs += (overlapEnd - Math.max(startHour, lunchStartHour)) * 60 * 60 * 1000;
// // //         }
        
// // //         // 檢查結束日是否需要扣除中午休息時間
// // //         const endHour = endDateTime.getHours() + (endDateTime.getMinutes() / 60);
// // //         if (endHour > lunchStartHour) {
// // //           const overlapStart = Math.max(0, lunchStartHour);
// // //           lunchBreakMs += (Math.min(endHour, lunchEndHour) - overlapStart) * 60 * 60 * 1000;
// // //         }
// // //       }
      
// // //       // 確保不會扣除過多
// // //       lunchBreakMs = Math.min(lunchBreakMs, diffMs);
      
// // //       // 扣除中午休息時間
// // //       diffMs -= lunchBreakMs;
      
// // //       const totalHours = diffMs / (60 * 60 * 1000);
      
// // //       if (totalHours <= 0) {
// // //         alert('請假時間必須大於0');
// // //         return;
// // //       }
      
// // //       if (!illustrate.trim()) {
// // //         alert('請填寫請假說明');
// // //         return;
// // //       }
      
// // //       // 生成表單編號
// // //       const formNumber = generateFormNumber();
      
// // //       // 獲取當前日期時間（使用台灣時間 UTC+8）
// // //       const now = new Date();
// // //       const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      
// // //       const year = taiwanTime.getUTCFullYear();
// // //       const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
// // //       const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
// // //       const hours = String(taiwanTime.getUTCHours()).padStart(2, '0');
// // //       const minutes = String(taiwanTime.getUTCMinutes()).padStart(2, '0');
// // //       const seconds = String(taiwanTime.getUTCSeconds()).padStart(2, '0');
      
// // //       const applicationDate = `${year}-${month}-${day}`;
// // //       const applicationTime = `${hours}:${minutes}:${seconds}`;
      
// // //       // 使用後端API提交申請表單 - 包含從API獲取的員工資料
// // //       const payload = {
// // //         company_id: companyId,
// // //         employee_id: employeeId,
// // //         department: employeeInfo.department || '', // 從API獲取的部門
// // //         position: employeeInfo.position || '',     // 從API獲取的職位
// // //         job_grade: employeeInfo.jobGrade || '',    // 從API獲取的職級
// // //         leave_type: selectedLeaveType,
// // //         leave_type_api: selectedLeaveTypeApi,
// // //         start_date: formattedStartDate,
// // //         start_time: formattedStartTime,
// // //         end_date: formattedEndDate,
// // //         end_time: formattedEndTime,
// // //         leave_hours: leaveHours,
// // //         total_calculation_hours: totalHours.toFixed(2),
// // //         lunch_break_hours: lunchBreakHours,
// // //         illustrate: illustrate || '',
// // //         application_id: formNumber,
// // //         application_status: '待審核',
// // //         application_date: applicationDate,
// // //         application_time: applicationTime
// // //       };
      
// // //       console.log('正在提交申請表單資料（包含API獲取的員工資料）:', payload);
      
// // //       // 使用 Promise.all 並行處理兩個 API 請求
// // //       const [response1, response2] = await Promise.all([
// // //         // 1. 原本的 API
// // //         fetch(`${SERVER_API_URL}/api/apply-form`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify(payload),
// // //         }).then(res => res.json()).catch(err => {
// // //           console.error('原系統 API 請求失敗:', err);
// // //           return { error: err.message };
// // //         }),
        
// // //         // 2. 新增的 Application_Form API - 包含從API獲取的員工資料
// // //         fetch(APPLICATION_FORM_API_URL, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json',
// // //             'Authorization': `Bearer ${authToken}` // 添加 auth_token
// // //           },
// // //           body: JSON.stringify({
// // //             form_number: formNumber,
// // //             company_id: parseInt(companyId),
// // //             employee_id: employeeId,
// // //             category: "leave",
// // //             type: selectedLeaveTypeApi, // 使用API值而不是顯示名稱
// // //             start_date: formattedStartDate,
// // //             start_time: formattedStartTime,
// // //             end_date: formattedEndDate,
// // //             end_time: formattedEndTime,
// // //             total_calculation_hours: parseFloat(totalHours.toFixed(2)),
// // //             illustrate: illustrate || '',
// // //             department: employeeInfo.department || '',  // 從API獲取的部門
// // //             position: employeeInfo.position || '',      // 從API獲取的職位
// // //             job_grade: employeeInfo.jobGrade || '',     // 從API獲取的職級
// // //             status: "pending",  // 使用英文狀態值
// // //             application_date: applicationDate,
// // //             reviewer_name: null,
// // //             reviewer_job_grade: null,
// // //             reviewer_status: "pending",  // 使用英文狀態值
// // //             hr_name: null,
// // //             hr_status: "pending",  // 使用英文狀態值
// // //             reviewer: employeeInfo.supervisor || null   // 從API獲取的主管
// // //           }),
          
// // //         }).then(res => res.json()).catch(err => {
// // //           console.error('新系統 API 請求失敗:', err);
// // //           return { error: err.message };
// // //         })
// // //       ]);
      
// // //       // 檢查兩個 API 的回應
// // //       let hasSuccess = false;
      
// // //       if (response1.success && !response1.error) {
// // //         console.log('原 API 申請表單提交成功:', response1);
// // //         hasSuccess = true;
// // //       } else {
// // //         console.error('原 API 提交失敗:', response1);
// // //       }
      
// // //       if (!response2.error && response2.Status === "Ok") {
// // //         console.log('Application_Form API 提交成功:', response2);
// // //         hasSuccess = true;
// // //       } else {
// // //         console.error('Application_Form API 提交失敗:', response2);
// // //       }
      
// // //       if (hasSuccess) {
// // //         alert('請假申請已送出');
// // //         window.location.href = '/leave01';
// // //       } else {
// // //         throw new Error('所有API都提交失敗');
// // //       }
      
// // //     } catch (err) {
// // //       if (err.name === 'AbortError') {
// // //         console.error('提交請求超時');
// // //         alert('提交請求超時，請稍後再試');
// // //       } else {
// // //         console.error('請假申請失敗:', err);
// // //         setError(`處理請求時發生錯誤: ${err.message}`);
// // //         alert(`請假申請失敗: ${err.message}`);
// // //       }
// // //     } finally {
// // //       // 確保無論成功或失敗，loading 狀態和提交標記都會被重置
// // //       setLoading(false);
// // //       formSubmitInProgress.current = false;
// // //     }
// // //   };

// // //   // 處理返回首頁 - 能夠區分瀏覽器請求和手機app請求
// // //   const handleGoHome = () => {
// // //     // 檢查是否為手機 app 環境
// // //     const isInMobileApp = () => {
// // //       const urlParams = new URLSearchParams(window.location.search);
// // //       const isApp = urlParams.get('platform') === 'app';
      
// // //       const userAgent = navigator.userAgent.toLowerCase();
// // //       const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
// // //       const hasFlutterContext = 
// // //         typeof window.flutter !== 'undefined' || 
// // //         typeof window.FlutterNativeWeb !== 'undefined';
        
// // //       return isApp || hasFlutterAgent || hasFlutterContext;
// // //     };

// // //     if (isInMobileApp()) {
// // //       console.log('檢測到 App 環境，使用 Flutter 導航');
      
// // //       try {
// // //         if (window.flutter && window.flutter.postMessage) {
// // //           window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
// // //         } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
// // //           window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
// // //         } else {
// // //           const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
// // //             detail: { action: 'navigate_home' }
// // //           });
// // //           document.dispatchEvent(event);
// // //         }
// // //       } catch (err) {
// // //         console.error('無法使用 Flutter 導航:', err);
// // //         window.location.href = '/frontpage01';
// // //       }
// // //     } else {
// // //       console.log('瀏覽器環境，使用 window.location.href 導航');
// // //       window.location.href = '/frontpage01';
// // //     }
// // //   };
  
// // //   const handleCancel = () => {
// // //     console.log('取消請假申請');
// // //     window.location.href = '/leave01';
// // //   };

// // //   const handleAddAttachment = () => {
// // //     console.log('新增附件');
// // //     alert('附件功能尚未開放，請在說明欄位中描述相關資訊');
// // //   };
  
// // //   const handleLeaveTypeSelect = (type) => {
// // //     setSelectedLeaveType(type.name);
// // //     setSelectedLeaveTypeApi(type.apiValue);
// // //     setShowLeaveTypeOptions(false);
// // //   };
  
// // //   const handleIllustrateChange = (e) => {
// // //     setIllustrate(e.target.value);
// // //   };

// // //   // 添加全局樣式以防止滾動
// // //   useEffect(() => {
// // //     document.body.style.overflow = 'hidden';
// // //     document.body.style.margin = '0';
// // //     document.body.style.padding = '0';
// // //     document.documentElement.style.overflow = 'hidden';
// // //     document.documentElement.style.margin = '0';
// // //     document.documentElement.style.padding = '0';
    
// // //     return () => {
// // //       document.body.style.overflow = '';
// // //       document.body.style.margin = '';
// // //       document.body.style.padding = '';
// // //       document.documentElement.style.overflow = '';
// // //       document.documentElement.style.margin = '';
// // //       document.documentElement.style.padding = '';
// // //     };
// // //   }, []);

// // //   // 添加錯誤處理組件
// // //   const ErrorMessage = ({ message, onClose }) => {
// // //     return (
// // //       <div className="error-container">
// // //         <div className="error-message">
// // //           <div className="error-icon">⚠️</div>
// // //           <div className="error-text">{message}</div>
// // //           <button className="error-close" onClick={onClose}>✕</button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="container">
// // //       <div className="app-wrapper">
// // //         <header className="header">
// // //           <div className="home-icon" onClick={handleGoHome}>
// // //             <img 
// // //               src={homeIcon} 
// // //               alt="首頁" 
// // //               width="22" 
// // //               height="22" 
// // //               style={{ objectFit: 'contain' }}
// // //             />
// // //           </div>
// // //           <div className="page-title">請假申請</div>
// // //         </header>

// // //         {/* 顯示錯誤訊息 */}
// // //         {error && (
// // //           <ErrorMessage 
// // //             message={error} 
// // //             onClose={() => setError(null)} 
// // //           />
// // //         )}
        
// // //         <div className="form-container">
// // //           <div className="form-row">
// // //             <div className="form-label">假別</div>
// // //             <div className="form-value">
// // //               <div 
// // //                 className="leave-type-selector" 
// // //                 onClick={() => setShowLeaveTypeOptions(true)}
// // //               >
// // //                 <div className="leave-type-name">{selectedLeaveType}</div>
// // //                 <div className="available-hours">剩餘：{getSelectedLeaveRemaining()}</div>
// // //                 <div className="dropdown-icon">▼</div>
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           {/* 開始時間 - 修改：使用 startWeekday */}
// // //           <div className="form-row">
// // //             <div className="form-label">自</div>
// // //             <div className="form-value">
// // //               <div className="date-time-row">
// // //                 <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
// // //                 <div className="weekday">{startWeekday}</div>
// // //                 <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           {/* 結束時間 - 修改：使用 endWeekday */}
// // //           <div className="form-row">
// // //             <div className="form-label">到</div>
// // //             <div className="form-value">
// // //               <div className="date-time-row">
// // //                 <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
// // //                 <div className="weekday">{endWeekday}</div>
// // //                 <div className="time-input" onClick={() => handleTimeClick(false)}>{endTime}</div>
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="form-row">
// // //             <div className="form-label">時數</div>
// // //             <div className="form-value">
// // //               <div className="hours">{leaveHours}</div>
// // //             </div>
// // //           </div>
          
// // //           <div className="description-container">
// // //             <div className="description-label">說明</div>
// // //             <textarea 
// // //               className="description-textarea" 
// // //               placeholder="請輸入請假原因..."
// // //               value={illustrate}
// // //               onChange={handleIllustrateChange}
// // //             />
// // //             <button className="attachment-button" onClick={handleAddAttachment}>
// // //               <span className="attachment-icon">
// // //                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// // //                   <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
// // //                 </svg>
// // //               </span>
// // //               新增附件
// // //             </button>
// // //           </div>
// // //         </div>
        
// // //         <div className="button-container">
// // //           <button 
// // //             className="applycancel-button" 
// // //             onClick={handleCancel} 
// // //             disabled={loading || formSubmitInProgress.current}
// // //           >
// // //             取消
// // //           </button>
// // //           <button 
// // //             className={`submit-button ${loading || formSubmitInProgress.current ? 'loading' : ''}`}
// // //             onClick={handleSubmit}
// // //             disabled={loading || formSubmitInProgress.current}
// // //           >
// // //             {loading || formSubmitInProgress.current ? '處理中...' : '送出'}
// // //           </button>
// // //         </div>
        
// // //         {showLeaveTypeOptions && (
// // //           <>
// // //             <div className="overlay" onClick={() => setShowLeaveTypeOptions(false)}></div>
// // //             <div className="leave-type-options-container">
// // //               <div className="leave-type-category">法定假別</div>
// // //               {leaveTypes
// // //                 .filter(type => type.category === '法定假別')
// // //                 .map((type, index) => (
// // //                   <div 
// // //                     key={index} 
// // //                     className="leave-type-option"
// // //                     onClick={() => handleLeaveTypeSelect(type)}
// // //                   >
// // //                     <div>{type.name}</div>
// // //                     <div className="available-hours">剩餘：{type.remaining}</div>
// // //                   </div>
// // //                 ))
// // //               }
              
// // //               <div className="leave-type-category">公司福利假別</div>
// // //               {leaveTypes
// // //                 .filter(type => type.category === '公司福利假別')
// // //                 .map((type, index) => (
// // //                   <div 
// // //                     key={index} 
// // //                     className="leave-type-option"
// // //                     onClick={() => handleLeaveTypeSelect(type)}
// // //                   >
// // //                     <div>{type.name}</div>
// // //                     <div className="available-hours">剩餘：{type.remaining}</div>
// // //                   </div>
// // //                 ))
// // //               }
// // //             </div>
// // //           </>
// // //         )}
        
// // //         {/* 使用新的 CalendarSelector 組件 - 修改版本，傳入選中的日期 */}
// // //         <CalendarSelector
// // //           isVisible={showDatePicker}
// // //           onClose={() => setShowDatePicker(false)}
// // //           onDateSelect={handleDateSelect}
// // //           isEditingStart={isEditingStart}
// // //           selectedDate={isEditingStart ? 
// // //             (() => {
// // //               // 將開始日期字符串轉換為 Date 對象
// // //               const match = startDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
// // //               if (match) {
// // //                 const year = parseInt(match[1]);
// // //                 const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
// // //                 const day = parseInt(match[3]);
// // //                 return new Date(year, month, day);
// // //               }
// // //               return new Date();
// // //             })() : 
// // //             (() => {
// // //               // 將結束日期字符串轉換為 Date 對象
// // //               const match = endDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
// // //               if (match) {
// // //                 const year = parseInt(match[1]);
// // //                 const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
// // //                 const day = parseInt(match[3]);
// // //                 return new Date(year, month, day);
// // //               }
// // //               return new Date();
// // //             })()
// // //           }
// // //         />
        
// // //         {/* 使用新的 TimeSelector 組件 */}
// // //         <TimeSelector
// // //           isVisible={showTimePicker}
// // //           onClose={() => setShowTimePicker(false)}
// // //           onTimeSelect={handleTimeSelect}
// // //           currentTime={isEditingStart ? startTime : endTime}
// // //           isEditingStart={isEditingStart}
// // //         />
        
// // //         {/* 載入中指示器 */}
// // //         {loading && (
// // //           <div className="loading-overlay">
// // //             <div className="loading-spinner"></div>
// // //             <div className="loading-text">處理中，請稍候...</div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Apply;
// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import { GOOGLE_API_KEY, MASTER_SHEET_ID, MASTER_RANGE, SHEET_NAMES, SERVER_API_URL, APPLICATION_FORM_API_URL } from '../contexts/config';
// // import './css/Apply.css';
// // import { validateUserFromCookies } from './function/function';
// // import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// // import TimeSelector from './Time Selector/Time Selector';
// // import CalendarSelector from './Time Selector/Calendar Selector';

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

// //   // 🆕 新增：檢查並處理異常資料的函數
// //   const processAbnormalData = () => {
// //     try {
// //       // 從 sessionStorage 獲取異常資料
// //       const abnormalDataStr = sessionStorage.getItem('abnormalLeaveData');
      
// //       if (abnormalDataStr) {
// //         const abnormalData = JSON.parse(abnormalDataStr);
// //         console.log('檢測到異常請假資料:', abnormalData);
        
// //         // 檢查資料是否新鮮（30分鐘內）
// //         const now = Date.now();
// //         const dataAge = now - (abnormalData.timestamp || 0);
// //         const maxAge = 30 * 60 * 1000; // 30分鐘
        
// //         if (dataAge > maxAge) {
// //           console.log('異常資料已過期，清除並使用預設值');
// //           sessionStorage.removeItem('abnormalLeaveData');
// //           return null;
// //         }
        
// //         // 清除已使用的資料
// //         sessionStorage.removeItem('abnormalLeaveData');
        
// //         return abnormalData;
// //       }
      
// //       return null;
// //     } catch (error) {
// //       console.error('處理異常資料時發生錯誤:', error);
// //       sessionStorage.removeItem('abnormalLeaveData');
// //       return null;
// //     }
// //   };

// // // 🆕 修改：根據異常資料設定初始日期和時間 - 支援具體時間設定
// // const initializeDateTimeFromAbnormalData = (abnormalData) => {
// //   if (!abnormalData) {
// //     // 沒有異常資料，使用當前日期時間
// //     const currentInfo = getCurrentDateTimeInfo();
// //     return {
// //       startDate: currentInfo.formattedDate,
// //       startWeekday: currentInfo.weekday,
// //       startTime: currentInfo.formattedTime,
// //       endDate: currentInfo.formattedDate,
// //       endWeekday: currentInfo.weekday,
// //       endTime: currentInfo.formattedTime
// //     };
// //   }
  
// //   // 🔥 修改：處理異常資料的日期格式轉換 - 參考 ReplenishApply.js 的做法
// //   const abnormalDate = new Date(abnormalData.date);
// //   const year = abnormalDate.getFullYear();
// //   const month = abnormalDate.getMonth() + 1;
// //   const day = abnormalDate.getDate();
  
// //   // 🔥 修改：使用傳入的星期幾資訊，或重新計算（與補卡申請相同邏輯）
// //   const weekday = abnormalData.dayOfWeek || (() => {
// //     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
// //     return weekdays[abnormalDate.getDay()];
// //   })();
  
// //   // 🔥 修改：轉換為包含星期的中文日期格式（與補卡申請相同格式）
// //   const formattedDate = `${year}年 ${month}月${day}日 ${weekday}`;
  
// //   console.log('🔍 異常資料日期轉換:', {
// //     原始日期: abnormalData.date,
// //     原始星期: abnormalData.dayOfWeek,
// //     計算星期: weekday,
// //     轉換後: formattedDate
// //   });
  
// //   // 🆕 修改：優先使用從 AttendancePage 傳來的具體時間
// //   let startTime = '09:00'; // 預設上班時間
// //   let endTime = '18:00';   // 預設下班時間
  
// //   // 如果異常資料中包含具體的開始和結束時間，則使用它們
// //   if (abnormalData.startTime) {
// //     startTime = abnormalData.startTime;
// //     console.log('🔍 使用傳遞的開始時間:', startTime);
// //   }
// //   if (abnormalData.endTime) {
// //     endTime = abnormalData.endTime;
// //     console.log('🔍 使用傳遞的結束時間:', endTime);
// //   }
  
// //   // 🆕 備用邏輯：如果沒有具體時間，則根據異常類型推斷
// //   if (!abnormalData.startTime || !abnormalData.endTime) {
// //     console.log('🔍 沒有具體時間，根據異常類型推斷...');
// //     if (abnormalData.abnormalType === 'checkIn') {
// //       // 上班異常
// //       if (abnormalData.abnormalReason === '遲到' && abnormalData.actualCheckInTime) {
// //         // 遲到：從9:00開始到實際打卡時間
// //         startTime = '09:00';
// //         endTime = abnormalData.actualCheckInTime;
// //         console.log('🔍 遲到推斷時間:', startTime, '->', endTime);
// //       }
// //     } else if (abnormalData.abnormalType === 'checkOut') {
// //       // 下班異常
// //       if (abnormalData.abnormalReason === '早退' && abnormalData.actualCheckOutTime) {
// //         // 早退：從實際打卡時間到18:00
// //         startTime = abnormalData.actualCheckOutTime;
// //         endTime = '18:00';
// //         console.log('🔍 早退推斷時間:', startTime, '->', endTime);
// //       }
// //     } else if (abnormalData.abnormalType === 'absent') {
// //       // 曠職：全天請假 9:00-18:00
// //       startTime = '09:00';
// //       endTime = '18:00';
// //       console.log('🔍 曠職推斷時間:', startTime, '->', endTime);
// //     }
// //   }
  
// //   const result = {
// //     startDate: formattedDate,
// //     startWeekday: weekday,
// //     startTime: startTime,
// //     endDate: formattedDate,
// //     endWeekday: weekday,
// //     endTime: endTime
// //   };
  
// //   console.log('🔍 最終初始化結果:', result);
  
// //   return result;
// // };



// //   // 🆕 處理異常資料
// //   const abnormalData = processAbnormalData();
// //   const initialDateTime = initializeDateTimeFromAbnormalData(abnormalData);

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
  
// //   // 🆕 修改：根據異常資料設定初始說明
// //   const [illustrate, setIllustrate] = useState(() => {
// //     if (abnormalData) {
// //       if (abnormalData.abnormalType === 'absent') {
// //         return '曠職補請假申請';
// //       } else if (abnormalData.abnormalType === 'checkIn' && abnormalData.abnormalReason === '遲到') {
// //         return '遲到補請假申請';
// //       } else {
// //         return '異常補請假申請';
// //       }
// //     }
// //     return '';
// //   });
  
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [formId, setFormId] = useState('');
// //   const [lunchBreakHours, setLunchBreakHours] = useState(1);
  
// //   // 新增用於存儲驗證後的用戶資訊
// //   const [companyId, setCompanyId] = useState("");
// //   const [employeeId, setEmployeeId] = useState("");
// //   const [authToken, setAuthToken] = useState('');
  
// //   // 🆕 修改：使用初始化的日期時間資料
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);
// //   const [startDate, setStartDate] = useState(initialDateTime.startDate);
// //   const [startTime, setStartTime] = useState(initialDateTime.startTime);
// //   const [endDate, setEndDate] = useState(initialDateTime.endDate);
// //   const [endTime, setEndTime] = useState(initialDateTime.endTime);
// //   const [isEditingStart, setIsEditingStart] = useState(true);
  
// //   // 修改：分別管理開始和結束日期的星期
// //   const [startWeekday, setStartWeekday] = useState(initialDateTime.startWeekday);
// //   const [endWeekday, setEndWeekday] = useState(initialDateTime.endWeekday);
  
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

// //   // 🆕 新增：顯示異常資料來源提示
// //   useEffect(() => {
// //     if (abnormalData) {
// //       console.log('已自動填入異常資料:', abnormalData);
      
// //       // 可選：顯示提示訊息
// //       const message = abnormalData.abnormalType === 'absent' 
// //         ? '已自動填入曠職日期，請確認請假時間並填寫原因'
// //         : abnormalData.abnormalType === 'checkIn' && abnormalData.abnormalReason === '遲到'
// //         ? '已自動填入遲到日期，請確認請假時間並填寫原因'
// //         : '已自動填入異常日期，請確認請假時間並填寫原因';
      
// //       // 可以選擇是否顯示 alert，或者用其他方式提示用戶
// //       // alert(message);
// //       console.log('提示訊息:', message);
// //     }
// //   }, [abnormalData]);

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
  
// //   // 修改：處理日期選擇，分別設置開始和結束日期的星期
// //   const handleDateSelect = (date) => {
// //     const year = date.getFullYear();
// //     const month = date.getMonth() + 1;
// //     const day = date.getDate();
// //     const formattedDate = `${year}年 ${month}月${day}日`;
    
// //     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
// //     const weekday = weekdays[date.getDay()];
    
// //     if (isEditingStart) {
// //       // 選擇開始日期
// //       setStartDate(formattedDate);
// //       setStartWeekday(weekday); // 設置開始日期的星期
// //       setShowDatePicker(false);
// //       calculateLeaveHours();
      
// //       // 自動開啟開始時間選擇
// //       setTimeout(() => {
// //         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
// //       }, 300);
      
// //     } else {
// //       // 選擇結束日期
// //       setEndDate(formattedDate);
// //       setEndWeekday(weekday); // 設置結束日期的星期
// //       setShowDatePicker(false);
// //       calculateLeaveHours();
      
// //       // 自動開啟結束時間選擇
// //       setTimeout(() => {
// //         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = false
// //       }, 300);
// //     }
// //   };

// //   // 處理時間選擇 - 修改版本，實現自動流程
// //   const handleTimeSelect = (hour, minute) => {
// //     const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
// //     if (isEditingStart) {
// //       // 選擇開始時間
// //       setStartTime(formattedTime);
// //       setShowTimePicker(false);
// //       calculateLeaveHours();
      
// //       // 自動開啟結束日期選擇
// //       setTimeout(() => {
// //         setIsEditingStart(false); // 切換到編輯結束日期
// //         setShowDatePicker(true);  // 開啟日期選擇器
// //       }, 300);
      
// //     } else {
// //       // 選擇結束時間
// //       setEndTime(formattedTime);
// //       setShowTimePicker(false);
// //       calculateLeaveHours();
      
// //       // 完成所有選擇，重置狀態
// //       setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
// //     }
// //   };

// //   // 計算請假時數，扣除中午休息時間
// //   const calculateLeaveHours = useCallback(() => {
// // const parseDateTime = (dateStr, timeStr) => {
// //   try {
// //     // 🔥 修改：處理不同的日期格式
// //     let year, month, day;
    
// //     // 處理 "YYYY年 MM月DD日 週X" 格式（包含星期）
// //     const chineseDateWithWeekMatch = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日\s*週[一二三四五六日]/);
// //     if (chineseDateWithWeekMatch) {
// //       year = parseInt(chineseDateWithWeekMatch[1]);
// //       month = parseInt(chineseDateWithWeekMatch[2]) - 1;
// //       day = parseInt(chineseDateWithWeekMatch[3]);
// //     }
// //     // 處理 "YYYY年 MM月DD日" 格式（不包含星期）
// //     else {
// //       const chineseDateMatch = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
// //       if (chineseDateMatch) {
// //         year = parseInt(chineseDateMatch[1]);
// //         month = parseInt(chineseDateMatch[2]) - 1;
// //         day = parseInt(chineseDateMatch[3]);
// //       } 
// //       // 🔥 新增：處理 "YYYY-MM-DD" 格式（來自異常資料）
// //       else if (dateStr.includes('-')) {
// //         const parts = dateStr.split('-');
// //         if (parts.length === 3) {
// //           year = parseInt(parts[0]);
// //           month = parseInt(parts[1]) - 1;
// //           day = parseInt(parts[2]);
// //         } else {
// //           throw new Error('無法解析日期格式: ' + dateStr);
// //         }
// //       } else {
// //         throw new Error('未知的日期格式: ' + dateStr);
// //       }
// //     }
    
// //     // 🔥 修改：處理時間格式，確保正確解析
// //     let hours, minutes;
// //     if (timeStr.includes(':')) {
// //       const timeParts = timeStr.split(':');
// //       hours = parseInt(timeParts[0]);
// //       minutes = parseInt(timeParts[1]);
// //     } else {
// //       throw new Error('無法解析時間格式: ' + timeStr);
// //     }
    
// //     const dateTime = new Date(year, month, day, hours, minutes);
    
// //     console.log('🔍 解析日期時間:', {
// //       輸入日期: dateStr,
// //       輸入時間: timeStr,
// //       解析結果: dateTime,
// //       年: year,
// //       月: month + 1,
// //       日: day,
// //       時: hours,
// //       分: minutes
// //     });
    
// //     return dateTime;
// //   } catch (e) {
// //     console.error('日期時間解析錯誤:', e, '日期:', dateStr, '時間:', timeStr);
// //     return new Date();
// //   }
// // };

    
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
// //         window.location.href = '/frontpage01';
// //       }
// //     } else {
// //       console.log('瀏覽器環境，使用 window.location.href 導航');
// //       window.location.href = '/frontpage01';
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

// //         {/* 🆕 新增：顯示異常資料來源提示 */}
// //         {abnormalData && (
// //           <div className="abnormal-data-notice">
// //             <div className="notice-icon">ℹ️</div>
// //             <div className="notice-text">
// //               {abnormalData.abnormalType === 'absent' 
// //                 ? '已自動填入曠職日期資訊'
// //                 : abnormalData.abnormalType === 'checkIn' && abnormalData.abnormalReason === '遲到'
// //                 ? '已自動填入遲到日期資訊'
// //                 : '已自動填入異常日期資訊'}
// //               ，請確認時間並填寫原因
// //             </div>
// //           </div>
// //         )}

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
          
// //           {/* 開始時間 - 修改：使用 startWeekday */}
// //           <div className="form-row">
// //             <div className="form-label">自</div>
// //             <div className="form-value">
// //               <div className="date-time-row">
// //                 <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
// //                 <div className="weekday">{startWeekday}</div>
// //                 <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
// //               </div>
// //             </div>
// //           </div>
          
// //           {/* 結束時間 - 修改：使用 endWeekday */}
// //           <div className="form-row">
// //             <div className="form-label">到</div>
// //             <div className="form-value">
// //               <div className="date-time-row">
// //                 <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
// //                 <div className="weekday">{endWeekday}</div>
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
// //             className="applycancel-button" 
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
        
// //         {/* 使用新的 CalendarSelector 組件 - 修改版本，傳入選中的日期 */}
// //         <CalendarSelector
// //           isVisible={showDatePicker}
// //           onClose={() => setShowDatePicker(false)}
// //           onDateSelect={handleDateSelect}
// //           isEditingStart={isEditingStart}
// //           selectedDate={isEditingStart ? 
// //             (() => {
// //               // 將開始日期字符串轉換為 Date 對象
// //               const match = startDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
// //               if (match) {
// //                 const year = parseInt(match[1]);
// //                 const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
// //                 const day = parseInt(match[3]);
// //                 return new Date(year, month, day);
// //               }
// //               return new Date();
// //             })() : 
// //             (() => {
// //               // 將結束日期字符串轉換為 Date 對象
// //               const match = endDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
// //               if (match) {
// //                 const year = parseInt(match[1]);
// //                 const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
// //                 const day = parseInt(match[3]);
// //                 return new Date(year, month, day);
// //               }
// //               return new Date();
// //             })()
// //           }
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
// import './css/Apply.css';
// import { validateUserFromCookies } from './function/function';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import TimeSelector from './Time Selector/Time Selector';
// import CalendarSelector from './Time Selector/Calendar Selector';

// function Apply() {
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

// // 🆕 新增：檢查並處理異常資料的函數 - 參考補卡申請邏輯
// const processAbnormalData = () => {
//   try {
//     // 從 sessionStorage 獲取異常資料
//     const abnormalDataStr = sessionStorage.getItem('abnormalLeaveData');
    
//     if (abnormalDataStr) {
//       const abnormalData = JSON.parse(abnormalDataStr);
//       console.log('🔍 檢測到異常請假資料:', abnormalData);
      
//       // 🔥 新增：詳細檢查異常資料內容
//       console.log('🔍 異常資料詳細內容:', {
//         date: abnormalData.date,
//         startTime: abnormalData.startTime,
//         endTime: abnormalData.endTime,
//         abnormalType: abnormalData.abnormalType,
//         fromLate: abnormalData.fromLate,
//         actualCheckInTime: abnormalData.actualCheckInTime
//       });
      
//       // 檢查資料是否新鮮（30分鐘內）- 與補卡申請相同邏輯
//       const now = Date.now();
//       const dataAge = now - (abnormalData.timestamp || 0);
//       const maxAge = 30 * 60 * 1000; // 30分鐘
      
//       if (dataAge > maxAge) {
//         console.log('異常資料已過期，清除並使用預設值');
//         sessionStorage.removeItem('abnormalLeaveData');
//         return null;
//       }
      
//       // 清除已使用的資料
//       sessionStorage.removeItem('abnormalLeaveData');
      
//       return abnormalData;
//     }
    
//     return null;
//   } catch (error) {
//     console.error('處理異常資料時發生錯誤:', error);
//     sessionStorage.removeItem('abnormalLeaveData');
//     return null;
//   }
// };


//   // 🆕 修改：根據異常資料設定初始日期和時間 - 參考補卡申請邏輯
//   const initializeDateTimeFromAbnormalData = (abnormalData) => {
//     if (!abnormalData) {
//       // 沒有異常資料，使用當前日期時間
//       const currentInfo = getCurrentDateTimeInfo();
//       return {
//         startDate: currentInfo.formattedDate,
//         startWeekday: currentInfo.weekday,
//         startTime: currentInfo.formattedTime,
//         endDate: currentInfo.formattedDate,
//         endWeekday: currentInfo.weekday,
//         endTime: currentInfo.formattedTime
//       };
//     }
    
//     // 🔥 處理異常資料的日期格式轉換 - 與補卡申請相同邏輯
//     const abnormalDate = new Date(abnormalData.date);
//     const year = abnormalDate.getFullYear();
//     const month = abnormalDate.getMonth() + 1;
//     const day = abnormalDate.getDate();
    
//     const weekday = abnormalData.dayOfWeek || (() => {
//       const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//       return weekdays[abnormalDate.getDay()];
//     })();
    
//     // 🔥 轉換為中文日期格式
//     const formattedDate = `${year}年 ${month}月${day}日`;
    
//     console.log('🔍 異常資料日期轉換:', {
//       原始日期: abnormalData.date,
//       原始星期: abnormalData.dayOfWeek,
//       計算星期: weekday,
//       轉換後: formattedDate
//     });
    
//     // 🔥 關鍵：使用異常資料中的時間設定
//     let startTime = abnormalData.startTime || '09:00'; // 🔥 預設 9:00
//     let endTime = abnormalData.endTime || '18:00';     // 預設 18:00
    
//     console.log('🔍 異常資料時間設定:', {
//       開始時間: startTime,
//       結束時間: endTime,
//       異常類型: abnormalData.abnormalType,
//       是否遲到: abnormalData.fromLate
//     });
    
//     const result = {
//       startDate: formattedDate,
//       startWeekday: weekday,
//       startTime: startTime,
//       endDate: formattedDate,
//       endWeekday: weekday,
//       endTime: endTime
//     };
    
//     console.log('🔍 最終初始化結果:', result);
    
//     return result;
//   };

//   // 🔥 關鍵：處理異常資料（與補卡申請相同邏輯）
//   const abnormalData = processAbnormalData();
//   const initialDateTime = initializeDateTimeFromAbnormalData(abnormalData);

//   // 移除 EmployeeContext 依賴，改用本地狀態管理員工資料
//   const [employeeInfo, setEmployeeInfo] = useState({
//     department: '',
//     position: '',
//     jobGrade: '',
//     supervisor: ''
//   });
  
//   const [currentTime, setCurrentTime] = useState('--:--');
//   const [selectedLeaveType, setSelectedLeaveType] = useState('事假');
//   const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
  
//   // 🔥 關鍵：根據異常資料設定初始說明（與補卡申請相同邏輯）
//   const [illustrate, setIllustrate] = useState(() => {
//     if (abnormalData) {
//       return abnormalData.reason || '異常補請假申請';
//     }
//     return '';
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formId, setFormId] = useState('');
//   const [lunchBreakHours, setLunchBreakHours] = useState(1);
  
//   // 新增用於存儲驗證後的用戶資訊
//   const [companyId, setCompanyId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [authToken, setAuthToken] = useState('');
  
//   // 🔥 關鍵：使用初始化的日期時間資料（與補卡申請相同邏輯）
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [startDate, setStartDate] = useState(initialDateTime.startDate);
//   const [startTime, setStartTime] = useState(initialDateTime.startTime);
//   const [endDate, setEndDate] = useState(initialDateTime.endDate);
//   const [endTime, setEndTime] = useState(initialDateTime.endTime);
//   const [isEditingStart, setIsEditingStart] = useState(true);
  
//   // 修改：分別管理開始和結束日期的星期
//   const [startWeekday, setStartWeekday] = useState(initialDateTime.startWeekday);
//   const [endWeekday, setEndWeekday] = useState(initialDateTime.endWeekday);
  
//   const [leaveHours, setLeaveHours] = useState('0天 0小時 0分鐘');
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

//   // 🔥 顯示異常資料來源提示（與補卡申請相同邏輯）
//   useEffect(() => {
//     if (abnormalData) {
//       console.log('已自動填入異常資料:', abnormalData);
      
//       // 可選：顯示提示訊息
//       const message = abnormalData.fromLate 
//         ? '已自動填入遲到資料，開始時間預設為 9:00，結束時間為實際打卡時間'
//         : abnormalData.fromAbsent
//         ? '已自動填入曠職資料，請確認請假時間並填寫原因'
//         : '已自動填入異常資料，請確認請假時間並填寫原因';
      
//       console.log('提示訊息:', message);
//     }
//   }, [abnormalData]);

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
//         setError(`員工資料查詢失敗: ${result.Msg}`);
//       }
//     } catch (err) {
//       console.error('查詢員工資料時發生錯誤:', err);
//       setError(`查詢員工資料時發生錯誤: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [companyId, employeeId, authToken]);

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
//         throw new Error(`獲取中午休息時間失敗: ${response.status}`);
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
//     { name: '換休', apiValue: 'compensatory_leave', remaining: '4小時', category: '法定假別' },
//     { name: '特休', apiValue: 'annual_leave', remaining: '6小時', category: '法定假別' },
//     { name: '事假', apiValue: 'personal_leave', remaining: '2天23小時', category: '法定假別' },
//     { name: '病假', apiValue: 'sick_leave', remaining: '23小時', category: '法定假別' },
//     { name: '生理假', apiValue: 'menstrual_leave', remaining: '1天 0小時', category: '法定假別' },
//     { name: '補休', apiValue: 'makeup_leave', remaining: '0小時', category: '法定假別' },
//     { name: '公假', apiValue: 'official_leave', remaining: '10小時', category: '法定假別' },
//     { name: '婚假', apiValue: 'marriage_leave', remaining: '8天 0小時', category: '法定假別' },
//     { name: '產檢假', apiValue: 'prenatal_checkup_leave', remaining: '24小時', category: '法定假別' },
//     { name: '產假', apiValue: 'maternity_leave', remaining: '56天 0小時', category: '法定假別' },
//     { name: '陪產假', apiValue: 'paternity_leave', remaining: '7天 0小時', category: '法定假別' },
//     { name: '溫書假', apiValue: 'study_leave', remaining: '14天 0小時', category: '法定假別' },
//     { name: '生日假', apiValue: 'birthday_leave', remaining: '0小時', category: '公司福利假別' }
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
  
//   // 修改：處理日期選擇，分別設置開始和結束日期的星期
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
//       setStartWeekday(weekday); // 設置開始日期的星期
//       setShowDatePicker(false);
//       calculateLeaveHours();
      
//       // 自動開啟開始時間選擇
//       setTimeout(() => {
//         setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
//       }, 300);
      
//     } else {
//       // 選擇結束日期
//       setEndDate(formattedDate);
//       setEndWeekday(weekday); // 設置結束日期的星期
//       setShowDatePicker(false);
//       calculateLeaveHours();
      
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
//       calculateLeaveHours();
      
//       // 自動開啟結束日期選擇
//       setTimeout(() => {
//         setIsEditingStart(false); // 切換到編輯結束日期
//         setShowDatePicker(true);  // 開啟日期選擇器
//       }, 300);
      
//     } else {
//       // 選擇結束時間
//       setEndTime(formattedTime);
//       setShowTimePicker(false);
//       calculateLeaveHours();
      
//       // 完成所有選擇，重置狀態
//       setIsEditingStart(true); // 重置為編輯開始狀態，以備下次使用
//     }
//   };

//   // 計算請假時數，扣除中午休息時間
//   const calculateLeaveHours = useCallback(() => {
//     const parseDateTime = (dateStr, timeStr) => {
//       try {
//         // 🔥 修改：處理不同的日期格式，支援異常資料格式
//         let year, month, day;
        
//         // 處理 "YYYY年 MM月DD日 週X" 格式（包含星期）
//         const chineseDateWithWeekMatch = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日\s*週[一二三四五六日]/);
//         if (chineseDateWithWeekMatch) {
//           year = parseInt(chineseDateWithWeekMatch[1]);
//           month = parseInt(chineseDateWithWeekMatch[2]) - 1;
//           day = parseInt(chineseDateWithWeekMatch[3]);
//         }
//         // 處理 "YYYY年 MM月DD日" 格式（不包含星期）
//         else {
//           const chineseDateMatch = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
//           if (chineseDateMatch) {
//             year = parseInt(chineseDateMatch[1]);
//             month = parseInt(chineseDateMatch[2]) - 1;
//             day = parseInt(chineseDateMatch[3]);
//           } 
//           // 🔥 新增：處理 "YYYY-MM-DD" 格式（來自異常資料）
//           else if (dateStr.includes('-')) {
//             const parts = dateStr.split('-');
//             if (parts.length === 3) {
//               year = parseInt(parts[0]);
//               month = parseInt(parts[1]) - 1;
//               day = parseInt(parts[2]);
//             } else {
//               throw new Error('無法解析日期格式: ' + dateStr);
//             }
//           } else {
//             throw new Error('未知的日期格式: ' + dateStr);
//           }
//         }
        
//         // 🔥 修改：處理時間格式，確保正確解析
//         let hours, minutes;
//         if (timeStr.includes(':')) {
//           const timeParts = timeStr.split(':');
//           hours = parseInt(timeParts[0]);
//           minutes = parseInt(timeParts[1]);
//         } else {
//           throw new Error('無法解析時間格式: ' + timeStr);
//         }
        
//         const dateTime = new Date(year, month, day, hours, minutes);
        
//         console.log('🔍 解析日期時間:', {
//           輸入日期: dateStr,
//           輸入時間: timeStr,
//           解析結果: dateTime,
//           年: year,
//           月: month + 1,
//           日: day,
//           時: hours,
//           分: minutes
//         });
        
//         return dateTime;
//       } catch (e) {
//         console.error('日期時間解析錯誤:', e, '日期:', dateStr, '時間:', timeStr);
//         return new Date();
//       }
//     };
    
//     try {
//       const startDateTime = parseDateTime(startDate, startTime);
//       const endDateTime = parseDateTime(endDate, endTime);
      
//       let diffMs = endDateTime - startDateTime;
      
//       if (diffMs < 0) {
//         setLeaveHours('0天 0小時 0分鐘');
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
      
//       setLeaveHours(`${adjustedDays}天 ${adjustedHours}小時 ${adjustedMinutes}分鐘`);
      
//       console.log(`請假總時數: ${diffMs / (60 * 60 * 1000)}小時，已扣除中午休息時間: ${lunchBreakMs / (60 * 60 * 1000)}小時`);
      
//     } catch (e) {
//       console.error('日期時間計算錯誤', e);
//       setLeaveHours('0天 0小時 0分鐘');
//     }
//   }, [startDate, startTime, endDate, endTime, lunchBreakHours]);
  
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
//       alert('請先登入系統');
//       window.location.href = '/applogin01/';
//       return;
//     }
    
//     // 檢查是否已獲取員工資料
//     if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
//       console.log('員工資料不完整，重新獲取...');
//       await fetchEmployeeInfo();
//       if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
//         alert('無法獲取員工資料，請重新登入');
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
//         alert('請假時間必須大於0');
//         return;
//       }
      
//       if (!illustrate.trim()) {
//         alert('請填寫請假說明');
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
//         alert('請假申請已送出');
//         window.location.href = '/leave01';
//       } else {
//         throw new Error('所有API都提交失敗');
//       }
      
//     } catch (err) {
//       if (err.name === 'AbortError') {
//         console.error('提交請求超時');
//         alert('提交請求超時，請稍後再試');
//       } else {
//         console.error('請假申請失敗:', err);
//         setError(`處理請求時發生錯誤: ${err.message}`);
//         alert(`請假申請失敗: ${err.message}`);
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
//         window.location.href = '/frontpage01';
//       }
//     } else {
//       console.log('瀏覽器環境，使用 window.location.href 導航');
//       window.location.href = '/frontpage01';
//     }
//   };
  
//   const handleCancel = () => {
//     console.log('取消請假申請');
//     window.location.href = '/leave01';
//   };

//   const handleAddAttachment = () => {
//     console.log('新增附件');
//     alert('附件功能尚未開放，請在說明欄位中描述相關資訊');
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
//               alt="首頁" 
//               width="22" 
//               height="22" 
//               style={{ objectFit: 'contain' }}
//             />
//           </div>
//           <div className="page-title">請假申請</div>
//         </header>

//         {/* 🔥 新增：顯示異常資料來源提示（與補卡申請相同） */}
//         {abnormalData && (
//           <div className="abnormal-data-notice">
//             <div className="notice-icon">ℹ️</div>
//             <div className="notice-text">
//               {abnormalData.fromLate 
//                 ? '已自動填入遲到資料，開始時間預設為 9:00，結束時間為實際打卡時間'
//                 : abnormalData.fromAbsent
//                 ? '已自動填入曠職資料，請確認請假時間並填寫原因'
//                 : '已自動填入異常資料，請確認請假時間並填寫原因'}
//             </div>
//           </div>
//         )}

//         {/* 顯示錯誤訊息 */}
//         {error && (
//           <ErrorMessage 
//             message={error} 
//             onClose={() => setError(null)} 
//           />
//         )}
        
//         <div className="form-container">
//           <div className="form-row">
//             <div className="form-label">假別</div>
//             <div className="form-value">
//               <div 
//                 className="leave-type-selector" 
//                 onClick={() => setShowLeaveTypeOptions(true)}
//               >
//                 <div className="leave-type-name">{selectedLeaveType}</div>
//                 <div className="available-hours">剩餘：{getSelectedLeaveRemaining()}</div>
//                 <div className="dropdown-icon">▼</div>
//               </div>
//             </div>
//           </div>
          
//           {/* 開始時間 - 修改：使用 startWeekday */}
//           <div className="form-row">
//             <div className="form-label">自</div>
//             <div className="form-value">
//               <div className="date-time-row">
//                 <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
//                 <div className="weekday">{startWeekday}</div>
//                 <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
//               </div>
//             </div>
//           </div>
          
//           {/* 結束時間 - 修改：使用 endWeekday */}
//           <div className="form-row">
//             <div className="form-label">到</div>
//             <div className="form-value">
//               <div className="date-time-row">
//                 <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
//                 <div className="weekday">{endWeekday}</div>
//                 <div className="time-input" onClick={() => handleTimeClick(false)}>{endTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-label">時數</div>
//             <div className="form-value">
//               <div className="hours">{leaveHours}</div>
//             </div>
//           </div>
          
//           <div className="description-container">
//             <div className="description-label">說明</div>
//             <textarea 
//               className="description-textarea" 
//               placeholder="請輸入請假原因..."
//               value={illustrate}
//               onChange={handleIllustrateChange}
//             />
//             <button className="attachment-button" onClick={handleAddAttachment}>
//               <span className="attachment-icon">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
//                 </svg>
//               </span>
//               新增附件
//             </button>
//           </div>
//         </div>
        
//         <div className="button-container">
//           <button 
//             className="applycancel-button" 
//             onClick={handleCancel} 
//             disabled={loading || formSubmitInProgress.current}
//           >
//             取消
//           </button>
//           <button 
//             className={`submit-button ${loading || formSubmitInProgress.current ? 'loading' : ''}`}
//             onClick={handleSubmit}
//             disabled={loading || formSubmitInProgress.current}
//           >
//             {loading || formSubmitInProgress.current ? '處理中...' : '送出'}
//           </button>
//         </div>
        
//         {showLeaveTypeOptions && (
//           <>
//             <div className="overlay" onClick={() => setShowLeaveTypeOptions(false)}></div>
//             <div className="leave-type-options-container">
//               <div className="leave-type-category">法定假別</div>
//               {leaveTypes
//                 .filter(type => type.category === '法定假別')
//                 .map((type, index) => (
//                   <div 
//                     key={index} 
//                     className="leave-type-option"
//                     onClick={() => handleLeaveTypeSelect(type)}
//                   >
//                     <div>{type.name}</div>
//                     <div className="available-hours">剩餘：{type.remaining}</div>
//                   </div>
//                 ))
//               }
              
//               <div className="leave-type-category">公司福利假別</div>
//               {leaveTypes
//                 .filter(type => type.category === '公司福利假別')
//                 .map((type, index) => (
//                   <div 
//                     key={index} 
//                     className="leave-type-option"
//                     onClick={() => handleLeaveTypeSelect(type)}
//                   >
//                     <div>{type.name}</div>
//                     <div className="available-hours">剩餘：{type.remaining}</div>
//                   </div>
//                 ))
//               }
//             </div>
//           </>
//         )}
        
//         {/* 使用新的 CalendarSelector 組件 - 修改版本，傳入選中的日期 */}
//         <CalendarSelector
//           isVisible={showDatePicker}
//           onClose={() => setShowDatePicker(false)}
//           onDateSelect={handleDateSelect}
//           isEditingStart={isEditingStart}
//           selectedDate={isEditingStart ? 
//             (() => {
//               // 將開始日期字符串轉換為 Date 對象
//               const match = startDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
//               if (match) {
//                 const year = parseInt(match[1]);
//                 const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
//                 const day = parseInt(match[3]);
//                 return new Date(year, month, day);
//               }
//               return new Date();
//             })() : 
//             (() => {
//               // 將結束日期字符串轉換為 Date 對象
//               const match = endDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
//               if (match) {
//                 const year = parseInt(match[1]);
//                 const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
//                 const day = parseInt(match[3]);
//                 return new Date(year, month, day);
//               }
//               return new Date();
//             })()
//           }
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
//             <div className="loading-text">處理中，請稍候...</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Apply;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GOOGLE_API_KEY, MASTER_SHEET_ID, MASTER_RANGE, SHEET_NAMES, SERVER_API_URL, APPLICATION_FORM_API_URL } from '../contexts/config';
import './css/Apply.css';
import { validateUserFromCookies } from './function/function';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import TimeSelector from './Time Selector/Time Selector';
import CalendarSelector from './Time Selector/Calendar Selector';

function Apply() {
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
  const [selectedLeaveType, setSelectedLeaveType] = useState('事假');
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
  
  // 🔥 修改：使用當前日期時間初始化，稍後在 useEffect 中處理異常資料
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(currentDateTimeInfo.formattedDate);
  const [startTime, setStartTime] = useState(currentDateTimeInfo.formattedTime);
  const [endDate, setEndDate] = useState(currentDateTimeInfo.formattedDate);
  const [endTime, setEndTime] = useState(currentDateTimeInfo.formattedTime);
  const [isEditingStart, setIsEditingStart] = useState(true);
  
  // 修改：分別管理開始和結束日期的星期
  const [startWeekday, setStartWeekday] = useState(currentDateTimeInfo.weekday);
  const [endWeekday, setEndWeekday] = useState(currentDateTimeInfo.weekday);
  
  const [leaveHours, setLeaveHours] = useState('0天 0小時 0分鐘');
  const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');
  
  // 🆕 添加自動填入相關狀態
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  
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

  // 🔥 關鍵修改：參考補卡申請的邏輯，在 useEffect 中處理異常資料
  useEffect(() => {
    // 檢查是否有異常資料傳入
    const abnormalDataString = sessionStorage.getItem('abnormalLeaveData');
    
    if (abnormalDataString) {
      try {
        const abnormalData = JSON.parse(abnormalDataString);
        console.log('🔍 接收到請假異常資料:', abnormalData);
        
        // 驗證資料是否有效且新鮮（5分鐘內）
        const isDataFresh = abnormalData.timestamp && 
          (Date.now() - abnormalData.timestamp) < 5 * 60 * 1000;
        
        if (abnormalData.fromAbnormal && isDataFresh) {
          console.log('🔍 開始自動填入請假異常資料...');
          
          // 1. 設定日期
          if (abnormalData.date) {
            const dateObj = new Date(abnormalData.date);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            
            // 使用傳入的星期幾資訊，或重新計算
            const weekday = abnormalData.dayOfWeek || (() => {
              const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
              return weekdays[dateObj.getDay()];
            })();
            
            const formattedDate = `${year}年 ${month}月${day}日`;
            setStartDate(formattedDate);
            setEndDate(formattedDate);
            setStartWeekday(weekday);
            setEndWeekday(weekday);
            console.log(`🔍 設定請假日期: ${formattedDate} ${weekday}`);
          }
          
          // 2. 設定時間（這是關鍵！）
          if (abnormalData.startTime) {
            setStartTime(abnormalData.startTime);
            console.log(`🔍 設定開始時間: ${abnormalData.startTime}`);
          }
          
          if (abnormalData.endTime) {
            setEndTime(abnormalData.endTime);
            console.log(`🔍 設定結束時間: ${abnormalData.endTime}`);
          }
          
          // 3. 設定請假說明
          if (abnormalData.reason) {
            setIllustrate(abnormalData.reason);
            console.log(`🔍 設定請假說明: ${abnormalData.reason}`);
          }
          
          // 4. 顯示自動填入提示
          setIsAutoFilled(true);
          setTimeout(() => {
            setIsAutoFilled(false);
          }, 4000); // 4秒後隱藏提示
          
          console.log('🔍 請假異常資料自動填入完成！');
        } else {
          console.log('🔍 請假異常資料無效或已過期，清除資料');
        }
        
        // 清除 sessionStorage 中的異常資料，避免重複使用
        sessionStorage.removeItem('abnormalLeaveData');
        
      } catch (error) {
        console.error('解析請假異常資料失敗:', error);
        // 清除無效資料
        sessionStorage.removeItem('abnormalLeaveData');
      }
    }
  }, []); // 只在組件初始化時執行一次

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
      const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
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
        setError(`員工資料查詢失敗: ${result.Msg}`);
      }
    } catch (err) {
      console.error('查詢員工資料時發生錯誤:', err);
      setError(`查詢員工資料時發生錯誤: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [companyId, employeeId, authToken]);

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
        throw new Error(`獲取中午休息時間失敗: ${response.status}`);
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
    { name: '換休', apiValue: 'compensatory_leave', remaining: '4小時', category: '法定假別' },
    { name: '特休', apiValue: 'annual_leave', remaining: '6小時', category: '法定假別' },
    { name: '事假', apiValue: 'personal_leave', remaining: '2天23小時', category: '法定假別' },
    { name: '病假', apiValue: 'sick_leave', remaining: '23小時', category: '法定假別' },
    { name: '生理假', apiValue: 'menstrual_leave', remaining: '1天 0小時', category: '法定假別' },
    { name: '補休', apiValue: 'makeup_leave', remaining: '0小時', category: '法定假別' },
    { name: '公假', apiValue: 'official_leave', remaining: '10小時', category: '法定假別' },
    { name: '婚假', apiValue: 'marriage_leave', remaining: '8天 0小時', category: '法定假別' },
    { name: '產檢假', apiValue: 'prenatal_checkup_leave', remaining: '24小時', category: '法定假別' },
    { name: '產假', apiValue: 'maternity_leave', remaining: '56天 0小時', category: '法定假別' },
    { name: '陪產假', apiValue: 'paternity_leave', remaining: '7天 0小時', category: '法定假別' },
    { name: '溫書假', apiValue: 'study_leave', remaining: '14天 0小時', category: '法定假別' },
    { name: '生日假', apiValue: 'birthday_leave', remaining: '0小時', category: '公司福利假別' }
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
  
  // 修改：處理日期選擇，分別設置開始和結束日期的星期
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
      setStartWeekday(weekday); // 設置開始日期的星期
      setShowDatePicker(false);
      calculateLeaveHours();
      
      // 自動開啟開始時間選擇
      setTimeout(() => {
        setShowTimePicker(true);  // 開啟時間選擇器，保持 isEditingStart = true
      }, 300);
      
    } else {
      // 選擇結束日期
      setEndDate(formattedDate);
      setEndWeekday(weekday); // 設置結束日期的星期
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
        // 處理不同的日期格式，支援異常資料格式
        let year, month, day;
        
        // 處理 "YYYY年 MM月DD日 週X" 格式（包含星期）
        const chineseDateWithWeekMatch = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日\s*週[一二三四五六日]/);
        if (chineseDateWithWeekMatch) {
          year = parseInt(chineseDateWithWeekMatch[1]);
          month = parseInt(chineseDateWithWeekMatch[2]) - 1;
          day = parseInt(chineseDateWithWeekMatch[3]);
        }
        // 處理 "YYYY年 MM月DD日" 格式（不包含星期）
        else {
          const chineseDateMatch = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
          if (chineseDateMatch) {
            year = parseInt(chineseDateMatch[1]);
            month = parseInt(chineseDateMatch[2]) - 1;
            day = parseInt(chineseDateMatch[3]);
          } 
          // 處理 "YYYY-MM-DD" 格式（來自異常資料）
          else if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              year = parseInt(parts[0]);
              month = parseInt(parts[1]) - 1;
              day = parseInt(parts[2]);
            } else {
              throw new Error('無法解析日期格式: ' + dateStr);
            }
          } else {
            throw new Error('未知的日期格式: ' + dateStr);
          }
        }
        
        // 處理時間格式，確保正確解析
        let hours, minutes;
        if (timeStr.includes(':')) {
          const timeParts = timeStr.split(':');
          hours = parseInt(timeParts[0]);
          minutes = parseInt(timeParts[1]);
        } else {
          throw new Error('無法解析時間格式: ' + timeStr);
        }
        
        const dateTime = new Date(year, month, day, hours, minutes);
        
        console.log('🔍 解析日期時間:', {
          輸入日期: dateStr,
          輸入時間: timeStr,
          解析結果: dateTime,
          年: year,
          月: month + 1,
          日: day,
          時: hours,
          分: minutes
        });
        
        return dateTime;
      } catch (e) {
        console.error('日期時間解析錯誤:', e, '日期:', dateStr, '時間:', timeStr);
        return new Date();
      }
    };
    
    try {
      const startDateTime = parseDateTime(startDate, startTime);
      const endDateTime = parseDateTime(endDate, endTime);
      
      let diffMs = endDateTime - startDateTime;
      
      if (diffMs < 0) {
        setLeaveHours('0天 0小時 0分鐘');
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
      
      setLeaveHours(`${adjustedDays}天 ${adjustedHours}小時 ${adjustedMinutes}分鐘`);
      
      console.log(`請假總時數: ${diffMs / (60 * 60 * 1000)}小時，已扣除中午休息時間: ${lunchBreakMs / (60 * 60 * 1000)}小時`);
      
    } catch (e) {
      console.error('日期時間計算錯誤', e);
      setLeaveHours('0天 0小時 0分鐘');
    }
  }, [startDate, startTime, endDate, endTime, lunchBreakHours]);
  
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
      alert('請先登入系統');
      window.location.href = '/applogin01/';
      return;
    }
    
    // 檢查是否已獲取員工資料
    if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
      console.log('員工資料不完整，重新獲取...');
      await fetchEmployeeInfo();
      if (!employeeInfo.department || !employeeInfo.position || !employeeInfo.jobGrade) {
        alert('無法獲取員工資料，請重新登入');
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
        alert('請假時間必須大於0');
        return;
      }
      
      if (!illustrate.trim()) {
        alert('請填寫請假說明');
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
        alert('請假申請已送出');
        window.location.href = '/leave01';
      } else {
        throw new Error('所有API都提交失敗');
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('提交請求超時');
        alert('提交請求超時，請稍後再試');
      } else {
        console.error('請假申請失敗:', err);
        setError(`處理請求時發生錯誤: ${err.message}`);
        alert(`請假申請失敗: ${err.message}`);
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
        window.location.href = '/frontpage01';
      }
    } else {
      console.log('瀏覽器環境，使用 window.location.href 導航');
      window.location.href = '/frontpage01';
    }
  };
  
  const handleCancel = () => {
    console.log('取消請假申請');
    window.location.href = '/leave01';
  };

  const handleAddAttachment = () => {
    console.log('新增附件');
    alert('附件功能尚未開放，請在說明欄位中描述相關資訊');
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
              alt="首頁" 
              width="22" 
              height="22" 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="page-title">請假申請</div>
        </header>

        {/* 🔥 新增：顯示自動填入提示 */}


        {/* 顯示錯誤訊息 */}
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        <div className="form-container">
          <div className="form-row">
            <div className="form-label">假別</div>
            <div className="form-value">
              <div 
                className="leave-type-selector" 
                onClick={() => setShowLeaveTypeOptions(true)}
              >
                <div className="leave-type-name">{selectedLeaveType}</div>
                <div className="available-hours">剩餘：{getSelectedLeaveRemaining()}</div>
                <div className="dropdown-icon">▼</div>
              </div>
            </div>
          </div>
          
          {/* 開始時間 - 修改：使用 startWeekday */}
          <div className="form-row">
            <div className="form-label">自</div>
            <div className="form-value">
              <div className="date-time-row">
                <div className="date-time" onClick={() => handleDateClick(true)}>{startDate}</div>
                <div className="weekday">{startWeekday}</div>
                <div className="time-input" onClick={() => handleTimeClick(true)}>{startTime}</div>
              </div>
            </div>
          </div>
          
          {/* 結束時間 - 修改：使用 endWeekday */}
          <div className="form-row">
            <div className="form-label">到</div>
            <div className="form-value">
              <div className="date-time-row">
                <div className="date-time" onClick={() => handleDateClick(false)}>{endDate}</div>
                <div className="weekday">{endWeekday}</div>
                <div className="time-input" onClick={() => handleTimeClick(false)}>{endTime}</div>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-label">時數</div>
            <div className="form-value">
              <div className="hours">{leaveHours}</div>
            </div>
          </div>
          
          <div className="description-container">
            <div className="description-label">說明</div>
            <textarea 
              className="description-textarea" 
              placeholder="請輸入請假原因..."
              value={illustrate}
              onChange={handleIllustrateChange}
            />
            <button className="attachment-button" onClick={handleAddAttachment}>
              <span className="attachment-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              新增附件
            </button>
          </div>
        </div>
        
        <div className="button-container">
          <button 
            className="applycancel-button" 
            onClick={handleCancel} 
            disabled={loading || formSubmitInProgress.current}
          >
            取消
          </button>
          <button 
            className={`submit-button ${loading || formSubmitInProgress.current ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading || formSubmitInProgress.current}
          >
            {loading || formSubmitInProgress.current ? '處理中...' : '送出'}
          </button>
        </div>
        
        {showLeaveTypeOptions && (
          <>
            <div className="overlay" onClick={() => setShowLeaveTypeOptions(false)}></div>
            <div className="leave-type-options-container">
              <div className="leave-type-category">法定假別</div>
              {leaveTypes
                .filter(type => type.category === '法定假別')
                .map((type, index) => (
                  <div 
                    key={index} 
                    className="leave-type-option"
                    onClick={() => handleLeaveTypeSelect(type)}
                  >
                    <div>{type.name}</div>
                    <div className="available-hours">剩餘：{type.remaining}</div>
                  </div>
                ))
              }
              
              <div className="leave-type-category">公司福利假別</div>
              {leaveTypes
                .filter(type => type.category === '公司福利假別')
                .map((type, index) => (
                  <div 
                    key={index} 
                    className="leave-type-option"
                    onClick={() => handleLeaveTypeSelect(type)}
                  >
                    <div>{type.name}</div>
                    <div className="available-hours">剩餘：{type.remaining}</div>
                  </div>
                ))
              }
            </div>
          </>
        )}
        
        {/* 使用新的 CalendarSelector 組件 - 修改版本，傳入選中的日期 */}
        <CalendarSelector
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDateSelect}
          isEditingStart={isEditingStart}
          selectedDate={isEditingStart ? 
            (() => {
              // 將開始日期字符串轉換為 Date 對象
              const match = startDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
              if (match) {
                const year = parseInt(match[1]);
                const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
                const day = parseInt(match[3]);
                return new Date(year, month, day);
              }
              return new Date();
            })() : 
            (() => {
              // 將結束日期字符串轉換為 Date 對象
              const match = endDate.match(/(\d+)年\s*(\d+)月(\d+)日/);
              if (match) {
                const year = parseInt(match[1]);
                const month = parseInt(match[2]) - 1; // JavaScript 月份從 0 開始
                const day = parseInt(match[3]);
                return new Date(year, month, day);
              }
              return new Date();
            })()
          }
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
            <div className="loading-text">處理中，請稍候...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Apply;
