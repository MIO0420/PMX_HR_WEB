// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom'; // 引入 useNavigate hook
// import axios from 'axios'; // 引入 axios 進行 API 請求

// function Apply() {
//   const [currentTime, setCurrentTime] = useState('');
//   const [selectedLeaveType, setSelectedLeaveType] = useState('事假');
//   const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
//   const [illustrate, setIllustrate] = useState(''); // 新增說明文字的狀態
//   const navigate = useNavigate(); // 初始化 navigate 函數
//   const proxyServerUrl = '/api/erp-gateway';
//   const [loading, setLoading] = useState(false); // 新增載入狀態
//   const [error, setError] = useState(null); // 新增錯誤狀態
  
//   // 新增日期時間選擇器狀態
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [startDate, setStartDate] = useState('2024年 9月25日');
//   const [startTime, setStartTime] = useState('09:00');
//   const [endDate, setEndDate] = useState('2024年 9月25日');
//   const [endTime, setEndTime] = useState('18:00');
//   const [isEditingStart, setIsEditingStart] = useState(true); // 標記是否編輯開始時間
//   const [selectedWeekday, setSelectedWeekday] = useState('週三'); // 星期幾
//   const [leaveHours, setLeaveHours] = useState('0天 8小時 0分鐘'); // 請假時數
  
//   // 新增附件相關狀態
//   const [attachments, setAttachments] = useState([]);
//   const [uploadingFile, setUploadingFile] = useState(false);
//   const fileInputRef = useRef(null);
//   const [applicationId, setApplicationId] = useState(''); // 用於存儲請假申請的ID

//   // 格式化日期為 API 格式 (YYYY-MM-DD)
//   const formatDateForApi = (dateStr) => {
//     const year = parseInt(dateStr.match(/(\d+)年/)[1]);
//     const month = parseInt(dateStr.match(/(\d+)月/)[1]);
//     const day = parseInt(dateStr.match(/(\d+)日/)[1]);
//     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
//         navigate('/frontpage');
//       }
//     } else {
//       console.log('瀏覽器環境，使用 React Router 導航');
//       navigate('/frontpage');
//     }
//   };

//   // 格式化時間為 API 格式 (HH:MM:SS)
//   const formatTimeForApi = (timeStr) => {
//     return `${timeStr}:00`;
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
//     const timer = setInterval(updateClock, 1000);
//     return () => clearInterval(timer);
//   }, []);

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
  
//   // 處理日期選擇
//   const handleDateSelect = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     const formattedDate = `${year}年 ${month}月${day}日`;
    
//     const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//     const weekday = weekdays[date.getDay()];
    
//     if (isEditingStart) {
//       setStartDate(formattedDate);
//       setSelectedWeekday(weekday);
//     } else {
//       setEndDate(formattedDate);
//       setSelectedWeekday(weekday);
//     }
    
//     setShowDatePicker(false);
//     calculateLeaveHours();
//   };
  
//   // 處理時間選擇
//   const handleTimeSelect = (hour, minute) => {
//     const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
//     if (isEditingStart) {
//       setStartTime(formattedTime);
//     } else {
//       setEndTime(formattedTime);
//     }
    
//     setShowTimePicker(false);
//     calculateLeaveHours();
//   };

//   // 計算請假時數
//   const calculateLeaveHours = () => {
//     const parseDateTime = (dateStr, timeStr) => {
//       const year = parseInt(dateStr.match(/(\d+)年/)[1]);
//       const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
//       const day = parseInt(dateStr.match(/(\d+)日/)[1]);
//       const [hours, minutes] = timeStr.split(':').map(Number);
      
//       return new Date(year, month, day, hours, minutes);
//     };
    
//     try {
//       const startDateTime = parseDateTime(startDate, startTime);
//       const endDateTime = parseDateTime(endDate, endTime);
      
//       const diffMs = endDateTime - startDateTime;
      
//       if (diffMs < 0) {
//         setLeaveHours('0天 0小時 0分鐘');
//         return;
//       }
      
//       const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
//       const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
//       const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
//       setLeaveHours(`${days}天 ${hours}小時 ${minutes}分鐘`);
//     } catch (e) {
//       console.error('日期時間解析錯誤', e);
//       setLeaveHours('0天 0小時 0分鐘');
//     }
//   };
  
//   useEffect(() => {
//     calculateLeaveHours();
//   }, [startDate, startTime, endDate, endTime]);

//   // 處理表單提交
//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const formattedStartDate = formatDateForApi(startDate);
//       const formattedEndDate = formatDateForApi(endDate);
//       const formattedStartTime = formatTimeForApi(startTime);
//       const formattedEndTime = formatTimeForApi(endTime);
      
//       const requestBody = {
//         "action": "leave_application",
//         "company_id": "polime",
//         "data": {
//           "client_id": "HR_00001",
//           "start_date": formattedStartDate,
//           "start_time": formattedStartTime,
//           "end_date": formattedEndDate,
//           "end_time": formattedEndTime,
//           "leavetype": selectedLeaveTypeApi,
//           "illustrate": illustrate
//         }
//       };
      
//       console.log('發送請假申請:', JSON.stringify(requestBody, null, 2));
//       console.log('使用代理伺服器:', `${proxyServerUrl}/process-request`);
      
//       const axiosConfig = {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         timeout: 30000
//       };
      
//       const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
//       console.log('API 回應:', response.data);
      
//       // 如果回應中包含申請ID，保存它用於附件上傳
//       if (response.data && response.data.application_id) {
//         setApplicationId(response.data.application_id);
        
//         // 如果有附件，上傳它們
//         if (attachments.length > 0) {
//           await Promise.all(attachments.map(file => uploadFile(file, response.data.application_id)));
//         }
//       }
      
//       alert('請假申請已送出');
//       navigate('/leave');  
//     } catch (err) {
//       console.error('請假申請失敗:', err);
      
//       let errorMsg = `API 連接失敗: ${err.message}`;
      
//       if (err.response) {
//         errorMsg += ` (狀態碼: ${err.response.status})`;
//         console.error('錯誤響應數據:', err.response.data);
//       } else if (err.request) {
//         errorMsg += ' (沒有收到響應)';
//       }
      
//       setError(errorMsg);
//       alert(`請假申請失敗: ${errorMsg}`);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleCancel = () => {
//     console.log('取消請假申請');
//     navigate('/leave');
//   };

//   // 處理附件上傳
//   const handleAddAttachment = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };
  
//   // 當選擇檔案後的處理
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setAttachments([...attachments, ...files]);
      
//       // 如果已經有申請ID，立即上傳檔案
//       if (applicationId) {
//         files.forEach(file => {
//           uploadFile(file, applicationId);
//         });
//       }
//     }
//   };
  
//   // 移除附件
//   const handleRemoveAttachment = (index) => {
//     const newAttachments = [...attachments];
//     newAttachments.splice(index, 1);
//     setAttachments(newAttachments);
//   };
  
//   // 上傳檔案到伺服器
//   const uploadFile = async (file, appId) => {
//     if (!file || !appId) return;
    
//     setUploadingFile(true);
    
//     try {
//       const formData = new FormData();
//       formData.append('action', 'upload_file');
//       formData.append('company_id', 'polime');
//       formData.append('doctype', 'Leave Application');
//       formData.append('name', appId);
//       formData.append('file', file);
      
//       const uploadUrl = '/api/erp-gateway/process-upload-file';
      
//       console.log(`正在上傳檔案 ${file.name} 到請假申請 ${appId}`);
      
//       const response = await axios.post(uploadUrl, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 60000 // 檔案上傳可能需要更長時間
//       });
      
//       console.log('檔案上傳回應:', response.data);
      
//       if (response.data && response.data.success) {
//         console.log(`檔案 ${file.name} 上傳成功`);
//       } else {
//         console.error(`檔案 ${file.name} 上傳失敗:`, response.data);
//         alert(`檔案 ${file.name} 上傳失敗: ${response.data.message || '伺服器錯誤'}`);
//       }
//     } catch (err) {
//       console.error('檔案上傳錯誤:', err);
//       alert(`檔案 ${file.name} 上傳失敗: ${err.message}`);
//     } finally {
//       setUploadingFile(false);
//     }
//   };
  
//   const handleLeaveTypeSelect = (type) => {
//     setSelectedLeaveType(type.name);
//     setSelectedLeaveTypeApi(type.apiValue);
//     setShowLeaveTypeOptions(false);
//   };
  
//   const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');

//   const handleIllustrateChange = (e) => {
//     setIllustrate(e.target.value);
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       backgroundColor: '#f5f7fa',
//       margin: 0,
//       padding: 0,
//       overflow: 'hidden',
//       width: '100%',
//       maxWidth: '100%',
//       boxSizing: 'border-box',
//     },
//     appWrapper: {
//       width: '100%',
//       maxWidth: '360px',
//       height: '100%',
//       backgroundColor: 'white',
//       fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//       display: 'flex',
//       flexDirection: 'column',
//       position: 'relative',
//       overflow: 'hidden',
//       boxSizing: 'border-box',
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       backgroundColor: '#3a75b5',
//       color: 'white',
//       padding: '0 16px',
//       height: '50px',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     homeIcon: {
//       width: '30px',
//       height: '30px',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       cursor: 'pointer',
//     },
//     timeDisplay: {
//       fontSize: '16px',
//       color: '#FFFFFF',
//     },
//     pageTitle: {
//       fontSize: '16px',
//       fontWeight: 'normal',
//       color: '#FFFFFF',
//       textAlign: 'center',
//       flex: 1,
//     },
//     formContainer: {
//       flex: 1,
//       overflowY: 'auto',
//       overflowX: 'hidden',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     formRow: {
//       display: 'flex',
//       borderBottom: '1px solid #f0f0f0',
//       padding: '15px',
//       alignItems: 'center',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     formLabel: {
//       width: '60px',
//       fontSize: '14px',
//       color: '#666',
//       flexShrink: 0,
//     },
//     formValue: {
//       flex: 1,
//       fontSize: '14px',
//       color: '#333',
//       display: 'flex',
//       alignItems: 'center',
//       width: 'calc(100% - 60px)',
//       boxSizing: 'border-box',
//     },
//     leaveTypeSelector: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       width: '100%',
//       cursor: 'pointer',
//     },
//     leaveTypeName: {
//       fontWeight: 'bold',
//     },
//     availableHours: {
//       fontSize: '12px',
//       color: '#666',
//       marginLeft: 'auto',
//       marginRight: '5px',
//     },
//     dateTimeRow: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     dateTime: {
//       fontSize: '14px',
//       cursor: 'pointer',
//     },
//     weekday: {
//       color: '#666',
//       marginRight: '20px',
//     },
//     timeInput: {
//       fontSize: '14px',
//       textAlign: 'right',
//       cursor: 'pointer',
//     },
//     hours: {
//       fontSize: '14px',
//       textAlign: 'center',
//       width: '100%',
//     },
//     descriptionContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       borderBottom: '1px solid #f0f0f0',
//       padding: '15px',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     descriptionLabel: {
//       fontSize: '14px',
//       color: '#666',
//       marginBottom: '10px',
//     },
//     descriptionTextarea: {
//       minHeight: '100px',
//       width: '100%',
//       border: 'none',
//       backgroundColor: '#f9f9f9',
//       borderRadius: '4px',
//       padding: '10px',
//       fontSize: '14px',
//       resize: 'none',
//       fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//       boxSizing: 'border-box',
//     },
//     attachmentButton: {
//       display: 'flex',
//       alignItems: 'center',
//       color: '#3a75b5',
//       fontSize: '14px',
//       border: 'none',
//       background: 'none',
//       padding: '15px 0 0 0',
//       cursor: 'pointer',
//       marginTop: '10px',
//       width: 'fit-content',
//     },
//     attachmentIcon: {
//       marginRight: '8px',
//       color: '#3a75b5',
//     },
//     attachmentsList: {
//       marginTop: '10px',
//       width: '100%',
//     },
//     attachmentItem: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '8px',
//       backgroundColor: '#f9f9f9',
//       borderRadius: '4px',
//       marginBottom: '5px',
//     },
//     attachmentName: {
//       fontSize: '12px',
//       color: '#333',
//       flex: 1,
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'nowrap',
//     },
//     removeAttachmentButton: {
//       background: 'none',
//       border: 'none',
//       color: '#ff4d4f',
//       cursor: 'pointer',
//       fontSize: '12px',
//       padding: '0 5px',
//     },
//     fileInput: {
//       display: 'none',
//     },
//     buttonContainer: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '16px',
//       borderTop: '1px solid #f0f0f0',
//       marginTop: 'auto',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     cancelButton: {
//       width: '45%',
//       padding: '10px',
//       border: '1px solid #ddd',
//       borderRadius: '4px',
//       backgroundColor: 'white',
//       fontSize: '14px',
//       cursor: 'pointer',
//     },
//     submitButton: {
//       width: '45%',
//       padding: '10px',
//       border: 'none',
//       borderRadius: '4px',
//       backgroundColor: '#3a75b5',
//       color: 'white',
//       fontSize: '14px',
//       cursor: 'pointer',
//       opacity: loading ? 0.7 : 1,
//     },
//     leaveTypeOptionsContainer: {
//       position: 'absolute',
//       top: '100px',
//       left: '0',
//       right: '0',
//       backgroundColor: 'white',
//       zIndex: 10,
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       maxHeight: '70vh',
//       overflowY: 'auto',
//       overflowX: 'hidden',
//       display: showLeaveTypeOptions ? 'block' : 'none',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     leaveTypeCategory: {
//       padding: '10px 16px',
//       backgroundColor: '#f5f7fa',
//       color: '#666',
//       fontSize: '14px',
//       fontWeight: 'bold',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     leaveTypeOption: {
//       padding: '12px 16px',
//       borderBottom: '1px solid #f0f0f0',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       cursor: 'pointer',
//       width: '100%',
//       boxSizing: 'border-box',
//     },
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       zIndex: 5,
//       display: showLeaveTypeOptions || showDatePicker || showTimePicker ? 'block' : 'none',
//     },
//     dropdownIcon: {
//       width: '16px',
//       height: '16px',
//       flexShrink: 0,
//     },
//     pickerContainer: {
//       position: 'absolute',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       backgroundColor: 'white',
//       borderTopLeftRadius: '12px',
//       borderTopRightRadius: '12px',
//       padding: '16px',
//       boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
//       zIndex: 15,
//       maxHeight: '80vh',
//       overflowY: 'auto',
//     },
//     calendarContainer: {
//       width: '100%',
//       padding: '10px 0',
//     },
//     calendarHeader: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '10px',
//     },
//     calendarTitle: {
//       fontSize: '16px',
//       fontWeight: 'bold',
//     },
//     calendarNavButton: {
//       background: 'none',
//       border: 'none',
//       fontSize: '16px',
//       cursor: 'pointer',
//       padding: '5px 10px',
//     },
//     calendarGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(7, 1fr)',
//       gap: '5px',
//     },
//     calendarWeekday: {
//       textAlign: 'center',
//       padding: '5px',
//       fontSize: '12px',
//       color: '#666',
//     },
//     calendarDay: {
//       textAlign: 'center',
//       padding: '8px',
//       borderRadius: '50%',
//       cursor: 'pointer',
//       fontSize: '14px',
//     },
//     calendarDaySelected: {
//       backgroundColor: '#3a75b5',
//       color: 'white',
//     },
//     calendarDayToday: {
//       border: '1px solid #3a75b5',
//     },
//     calendarDayOtherMonth: {
//       color: '#ccc',
//     },
//     timePickerContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       padding: '20px 0',
//     },
//     timePickerColumn: {
//       flex: 1,
//       textAlign: 'center',
//       height: '150px',
//       overflowY: 'auto',
//       scrollbarWidth: 'none',
//     },
//     timePickerItem: {
//       padding: '10px 0',
//       fontSize: '16px',
//       cursor: 'pointer',
//     },
//     timePickerItemSelected: {
//       fontWeight: 'bold',
//       color: '#3a75b5',
//     },
//     pickerActions: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '10px 0',
//       borderTop: '1px solid #f0f0f0',
//       marginTop: '10px',
//     },
//     pickerCancelButton: {
//       padding: '10px 20px',
//       border: 'none',
//       background: 'none',
//       fontSize: '14px',
//       cursor: 'pointer',
//       color: '#666',
//     },
//     pickerConfirmButton: {
//       padding: '10px 20px',
//       border: 'none',
//       background: 'none',
//       fontSize: '14px',
//       fontWeight: 'bold',
//       cursor: 'pointer',
//       color: '#3a75b5',
//     },
//     apiInfo: {
//       padding: '5px 10px',
//       backgroundColor: '#f0f8ff',
//       fontSize: '12px',
//       color: '#666',
//       textAlign: 'center',
//       borderBottom: '1px solid #eee',
//     },
//     loadingOverlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.3)',
//       zIndex: 100,
//       display: uploadingFile ? 'flex' : 'none',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     loadingSpinner: {
//       width: '40px',
//       height: '40px',
//       border: '4px solid rgba(255,255,255,0.3)',
//       borderRadius: '50%',
//       borderTop: '4px solid white',
//       animation: 'spin 1s linear infinite',
//     },
//   };

//   useEffect(() => {
//     document.documentElement.style.overflow = 'hidden';
//     document.documentElement.style.margin = '0';
//     document.documentElement.style.padding = '0';
    
//     // 添加 CSS 動畫
//     const style = document.createElement('style');
//     style.innerHTML = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `;
//     document.head.appendChild(style);
    
//     return () => {
//       document.body.style.overflow = '';
//       document.body.style.margin = '';
//       document.body.style.padding = '';
//       document.documentElement.style.overflow = '';
//       document.documentElement.style.margin = '';
//       document.documentElement.style.padding = '';
//       document.head.removeChild(style);
//     };
//   }, []);

//   const Calendar = () => {
//     const [currentMonth, setCurrentMonth] = useState(new Date());
//     const [selectedDate, setSelectedDate] = useState(new Date());
    
//     const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//     const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
//     const daysInMonth = lastDayOfMonth.getDate();
    
//     const firstDayOfWeek = firstDayOfMonth.getDay();
    
//     const days = [];
    
//     const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
    
//     for (let i = firstDayOfWeek - 1; i >= 0; i--) {
//       days.push({
//         day: prevMonthLastDay - i,
//         isCurrentMonth: false,
//         isSelected: false,
//         isToday: false
//       });
//     }
    
//     const today = new Date();
//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
//       days.push({
//         day: i,
//         isCurrentMonth: true,
//         isSelected: selectedDate && 
//                     date.getDate() === selectedDate.getDate() && 
//                     date.getMonth() === selectedDate.getMonth() && 
//                     date.getFullYear() === selectedDate.getFullYear(),
//         isToday: today.getDate() === i && 
//                 today.getMonth() === currentMonth.getMonth() && 
//                 today.getFullYear() === currentMonth.getFullYear()
//       });
//     }
    
//     const daysNeeded = 42 - days.length;
//     for (let i = 1; i <= daysNeeded; i++) {
//       days.push({
//         day: i,
//         isCurrentMonth: false,
//         isSelected: false,
//         isToday: false
//       });
//     }
    
//     const prevMonth = () => {
//       setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
//     };
    
//     const nextMonth = () => {
//       setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
//     };
    
//     const handleDayClick = (day, isCurrentMonth) => {
//       if (isCurrentMonth) {
//         const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//         setSelectedDate(newDate);
//         handleDateSelect(newDate);
//       }
//     };
    
//     const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    
//     const formatMonthTitle = () => {
//       return `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`;
//     };
    
//     return (
//       <div style={styles.calendarContainer}>
//         <div style={styles.calendarHeader}>
//           <button style={styles.calendarNavButton} onClick={prevMonth}>&#8249;</button>
//           <div style={styles.calendarTitle}>{formatMonthTitle()}</div>
//           <button style={styles.calendarNavButton} onClick={nextMonth}>&#8250;</button>
//         </div>
        
//         <div style={styles.calendarGrid}>
//           {weekdays.map((day, index) => (
//             <div key={index} style={styles.calendarWeekday}>
//               {day}
//             </div>
//           ))}
          
//           {days.map((day, index) => (
//             <div 
//               key={index} 
//               style={{
//                 ...styles.calendarDay,
//                 ...(day.isSelected ? styles.calendarDaySelected : {}),
//                 ...(day.isToday && !day.isSelected ? styles.calendarDayToday : {}),
//                 ...(day.isCurrentMonth ? {} : styles.calendarDayOtherMonth)
//               }}
//               onClick={() => handleDayClick(day.day, day.isCurrentMonth)}
//             >
//               {day.day}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   const TimePicker = () => {
//     const [selectedHour, setSelectedHour] = useState(parseInt(isEditingStart ? startTime.split(':')[0] : endTime.split(':')[0]));
//     const [selectedMinute, setSelectedMinute] = useState(parseInt(isEditingStart ? startTime.split(':')[1] : endTime.split(':')[1]));
    
//     const hours = Array.from({ length: 24 }, (_, i) => i);
    
//     const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    
//     const confirmSelection = () => {
//       handleTimeSelect(selectedHour, selectedMinute);
//     };
    
//     const cancelSelection = () => {
//       setShowTimePicker(false);
//     };
    
//     return (
//       <div>
//         <div style={styles.timePickerContainer}>
//           <div style={styles.timePickerColumn}>
//             {hours.map((hour) => (
//               <div 
//                 key={hour} 
//                 style={{
//                   ...styles.timePickerItem,
//                   ...(hour === selectedHour ? styles.timePickerItemSelected : {})
//                 }}
//                 onClick={() => setSelectedHour(hour)}
//               >
//                 {String(hour).padStart(2, '0')}
//               </div>
//             ))}
//           </div>
          
//           <div style={styles.timePickerColumn}>
//             {minutes.map((minute) => (
//               <div 
//                 key={minute} 
//                 style={{
//                   ...styles.timePickerItem,
//                   ...(minute === selectedMinute ? styles.timePickerItemSelected : {})
//                 }}
//                 onClick={() => setSelectedMinute(minute)}
//               >
//                 {String(minute).padStart(2, '0')}
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <div style={styles.pickerActions}>
//           <button style={styles.pickerCancelButton} onClick={cancelSelection}>
//             取消
//           </button>
//           <button style={styles.pickerConfirmButton} onClick={confirmSelection}>
//             確認
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // 格式化檔案大小顯示
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.appWrapper}>
//         <header style={styles.header}>
//           <div style={styles.homeIcon} onClick={handleGoHome}>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" stroke="white" strokeWidth="2" fill="none"/>
//               <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none"/>
//             </svg>
//           </div>
//           <div style={styles.pageTitle}>請假申請</div>
//           <div style={styles.timeDisplay}>{currentTime}</div>
//         </header>
        
//         <div style={styles.apiInfo}>
//           API 端點: {`${proxyServerUrl}/process-request`}
//         </div>
        
//         <div style={styles.formContainer}>
//           <div style={styles.formRow}>
//             <div style={styles.formLabel}>假別</div>
//             <div style={styles.formValue}>
//               <div 
//                 style={styles.leaveTypeSelector} 
//                 onClick={() => setShowLeaveTypeOptions(true)}
//               >
//                 <div style={styles.leaveTypeName}>{selectedLeaveType}</div>
//                 <div style={styles.availableHours}>剩餘：{getSelectedLeaveRemaining()}</div>
//                 <div style={styles.dropdownIcon}>▼</div>
//               </div>
//             </div>
//           </div>
          
//           <div style={styles.formRow}>
//             <div style={styles.formLabel}>自</div>
//             <div style={styles.formValue}>
//               <div style={styles.dateTimeRow}>
//                 <div style={styles.dateTime} onClick={() => handleDateClick(true)}>{startDate}</div>
//                 <div style={styles.weekday}>{selectedWeekday}</div>
//                 <div style={styles.timeInput} onClick={() => handleTimeClick(true)}>{startTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div style={styles.formRow}>
//             <div style={styles.formLabel}>到</div>
//             <div style={styles.formValue}>
//               <div style={styles.dateTimeRow}>
//                 <div style={styles.dateTime} onClick={() => handleDateClick(false)}>{endDate}</div>
//                 <div style={styles.weekday}>{selectedWeekday}</div>
//                 <div style={styles.timeInput} onClick={() => handleTimeClick(false)}>{endTime}</div>
//               </div>
//             </div>
//           </div>
          
//           <div style={styles.formRow}>
//             <div style={styles.formLabel}>時數</div>
//             <div style={styles.formValue}>
//               <div style={styles.hours}>{leaveHours}</div>
//             </div>
//           </div>
          
//           <div style={styles.descriptionContainer}>
//             <div style={styles.descriptionLabel}>說明</div>
//             <textarea 
//               style={styles.descriptionTextarea} 
//               placeholder="請輸入請假原因..."
//               value={illustrate}
//               onChange={handleIllustrateChange}
//             />
            
//             {/* 附件上傳按鈕 */}
//             <button style={styles.attachmentButton} onClick={handleAddAttachment}>
//               <span style={styles.attachmentIcon}>
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
//                 </svg>
//               </span>
//               新增附件
//             </button>
            
//             {/* 隱藏的檔案輸入框 */}
//             <input 
//               type="file" 
//               ref={fileInputRef} 
//               style={styles.fileInput} 
//               onChange={handleFileChange}
//               multiple
//             />
            
//             {/* 顯示已選擇的附件 */}
//             {attachments.length > 0 && (
//               <div style={styles.attachmentsList}>
//                 {attachments.map((file, index) => (
//                   <div key={index} style={styles.attachmentItem}>
//                     <div style={styles.attachmentName}>{file.name} ({formatFileSize(file.size)})</div>
//                     <button 
//                       style={styles.removeAttachmentButton}
//                       onClick={() => handleRemoveAttachment(index)}
//                       disabled={loading || uploadingFile}
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div style={styles.buttonContainer}>
//           <button 
//             style={styles.cancelButton} 
//             onClick={handleCancel} 
//             disabled={loading || uploadingFile}
//           >
//             取消
//           </button>
//           <button 
//             style={{
//               ...styles.submitButton, 
//               opacity: (loading || uploadingFile) ? 0.7 : 1,
//               cursor: (loading || uploadingFile) ? 'not-allowed' : 'pointer'
//             }} 
//             onClick={handleSubmit}
//             disabled={loading || uploadingFile}
//           >
//             {loading ? '處理中...' : '送出'}
//           </button>
//         </div>
        
//         {showLeaveTypeOptions && (
//           <>
//             <div style={styles.overlay} onClick={() => setShowLeaveTypeOptions(false)}></div>
//             <div style={styles.leaveTypeOptionsContainer}>
//               <div style={styles.leaveTypeCategory}>法定假別</div>
//               {leaveTypes
//                 .filter(type => type.category === '法定假別')
//                 .map((type, index) => (
//                   <div 
//                     key={index} 
//                     style={styles.leaveTypeOption} 
//                     onClick={() => handleLeaveTypeSelect(type)}
//                   >
//                     <div>{type.name}</div>
//                     <div>{type.remaining}</div>
//                   </div>
//                 ))
//               }
              
//               <div style={styles.leaveTypeCategory}>公司福利假別</div>
//               {leaveTypes
//                 .filter(type => type.category === '公司福利假別')
//                 .map((type, index) => (
//                   <div 
//                     key={index} 
//                     style={styles.leaveTypeOption} 
//                     onClick={() => handleLeaveTypeSelect(type)}
//                   >
//                     <div>{type.name}</div>
//                     <div>{type.remaining}</div>
//                   </div>
//                 ))
//               }
//             </div>
//           </>
//         )}

//         {showDatePicker && (
//           <>
//             <div style={styles.overlay} onClick={() => setShowDatePicker(false)}></div>
//             <div style={styles.pickerContainer}>
//               <Calendar />
//             </div>
//           </>
//         )}
        
//         {showTimePicker && (
//           <>
//             <div style={styles.overlay} onClick={() => setShowTimePicker(false)}></div>
//             <div style={styles.pickerContainer}>
//               <TimePicker />
//             </div>
//           </>
//         )}
        
//         {/* 檔案上傳中的載入遮罩 */}
//         <div style={styles.loadingOverlay}>
//           <div style={styles.loadingSpinner}></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Apply;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate hook
import axios from 'axios'; // 引入 axios 進行 API 請求

function Apply() {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('事假');
  const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
  const [illustrate, setIllustrate] = useState(''); // 新增說明文字的狀態
  const navigate = useNavigate(); // 初始化 navigate 函數
  const proxyServerUrl = '/api/erp-gateway';
  const [loading, setLoading] = useState(false); // 新增載入狀態
  const [error, setError] = useState(null); // 新增錯誤狀態
  
  // 新增日期時間選擇器狀態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startDate, setStartDate] = useState('2024年 9月25日');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('2024年 9月25日');
  const [endTime, setEndTime] = useState('18:00');
  const [isEditingStart, setIsEditingStart] = useState(true); // 標記是否編輯開始時間
  const [selectedWeekday, setSelectedWeekday] = useState('週三'); // 星期幾
  const [leaveHours, setLeaveHours] = useState('0天 8小時 0分鐘'); // 請假時數
  
  // 新增附件相關狀態
  const [attachments, setAttachments] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);
  const [applicationId, setApplicationId] = useState(''); // 用於存儲請假申請的ID

  // 格式化日期為 API 格式 (YYYY-MM-DD)
  const formatDateForApi = (dateStr) => {
    const year = parseInt(dateStr.match(/(\d+)年/)[1]);
    const month = parseInt(dateStr.match(/(\d+)月/)[1]);
    const day = parseInt(dateStr.match(/(\d+)日/)[1]);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
        navigate('/frontpage');
      }
    } else {
      console.log('瀏覽器環境，使用 React Router 導航');
      navigate('/frontpage');
    }
  };

  // 格式化時間為 API 格式 (HH:MM:SS)
  const formatTimeForApi = (timeStr) => {
    return `${timeStr}:00`;
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
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

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
  
  // 處理日期選擇
  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}年 ${month}月${day}日`;
    
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[date.getDay()];
    
    if (isEditingStart) {
      setStartDate(formattedDate);
      setSelectedWeekday(weekday);
    } else {
      setEndDate(formattedDate);
      setSelectedWeekday(weekday);
    }
    
    setShowDatePicker(false);
    calculateLeaveHours();
  };
  
  // 處理時間選擇
  const handleTimeSelect = (hour, minute) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    if (isEditingStart) {
      setStartTime(formattedTime);
    } else {
      setEndTime(formattedTime);
    }
    
    setShowTimePicker(false);
    calculateLeaveHours();
  };

  // 計算請假時數
  const calculateLeaveHours = () => {
    const parseDateTime = (dateStr, timeStr) => {
      const year = parseInt(dateStr.match(/(\d+)年/)[1]);
      const month = parseInt(dateStr.match(/(\d+)月/)[1]) - 1;
      const day = parseInt(dateStr.match(/(\d+)日/)[1]);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      return new Date(year, month, day, hours, minutes);
    };
    
    try {
      const startDateTime = parseDateTime(startDate, startTime);
      const endDateTime = parseDateTime(endDate, endTime);
      
      const diffMs = endDateTime - startDateTime;
      
      if (diffMs < 0) {
        setLeaveHours('0天 0小時 0分鐘');
        return;
      }
      
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
      
      setLeaveHours(`${days}天 ${hours}小時 ${minutes}分鐘`);
    } catch (e) {
      console.error('日期時間解析錯誤', e);
      setLeaveHours('0天 0小時 0分鐘');
    }
  };
  
  useEffect(() => {
    calculateLeaveHours();
  }, [startDate, startTime, endDate, endTime]);

  // 處理表單提交
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);
      const formattedStartTime = formatTimeForApi(startTime);
      const formattedEndTime = formatTimeForApi(endTime);
      
      const requestBody = {
        "action": "leave_application",
        "company_id": "polime",
        "data": {
          "client_id": "HR_00001",
          "start_date": formattedStartDate,
          "start_time": formattedStartTime,
          "end_date": formattedEndDate,
          "end_time": formattedEndTime,
          "leavetype": selectedLeaveTypeApi,
          "illustrate": illustrate
        }
      };
      
      console.log('發送請假申請:', JSON.stringify(requestBody, null, 2));
      console.log('使用代理伺服器:', `${proxyServerUrl}/process-request`);
      
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
      console.log('API 回應:', response.data);
      
      // 檢查回應是否成功並包含申請ID
      if (response.data && response.data.message && response.data.message.status === "success") {
        // 從回應中提取申請ID
        const applicationName = response.data.message.value?.name;
        
        if (applicationName) {
          console.log('成功獲取申請ID:', applicationName);
          setApplicationId(applicationName);
          
          // 如果有附件，上傳它們
          if (attachments.length > 0) {
            console.log(`開始上傳 ${attachments.length} 個附件檔案`);
            await Promise.all(attachments.map(file => uploadFile(file, applicationName)));
          } else {
            console.log('沒有附件需要上傳');
          }
          
          alert('請假申請已送出');
          navigate('/leave');
        } else {
          console.error('回應中找不到申請ID:', response.data);
          throw new Error('回應中找不到申請ID');
        }
      } else {
        console.error('請假申請API回應不成功:', response.data);
        throw new Error('請假申請失敗: ' + (response.data.message?.message || '伺服器錯誤'));
      }
    } catch (err) {
      console.error('請假申請失敗:', err);
      
      let errorMsg = `API 連接失敗: ${err.message}`;
      
      if (err.response) {
        errorMsg += ` (狀態碼: ${err.response.status})`;
        console.error('錯誤響應數據:', err.response.data);
      } else if (err.request) {
        errorMsg += ' (沒有收到響應)';
      }
      
      setError(errorMsg);
      alert(`請假申請失敗: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    console.log('取消請假申請');
    navigate('/leave');
  };

  // 處理附件上傳
  const handleAddAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 當選擇檔案後的處理
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments([...attachments, ...files]);
      
      // 如果已經有申請ID，立即上傳檔案
      if (applicationId) {
        files.forEach(file => {
          uploadFile(file, applicationId);
        });
      }
    }
  };
  
  // 移除附件
  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
// 上傳檔案到伺服器
const uploadFile = async (file, appId) => {
  if (!file || !appId) {
    console.error('上傳檔案失敗: 缺少檔案或申請ID');
    return;
  }
  
  setUploadingFile(true);
  
  try {
    const formData = new FormData();
    formData.append('action', 'upload_file');
    formData.append('company_id', 'polime');
    formData.append('doctype', 'Leave Application');
    formData.append('name', appId);
    formData.append('file', file);
    
    // 使用代理伺服器路徑，而不是直接 URL
    const uploadUrl = `${proxyServerUrl}/process-upload-file`;
    
    console.log(`正在上傳檔案 ${file.name} 到請假申請 ${appId}`);
    console.log('上傳URL:', uploadUrl);
    
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000 // 檔案上傳可能需要更長時間
    });
    
    console.log('檔案上傳回應:', response.data);
    
    if (response.data && response.data.message && response.data.message.status === "success") {
      console.log(`檔案 ${file.name} 上傳成功`);
      return response.data.message.value;
    } else {
      console.error(`檔案 ${file.name} 上傳失敗:`, response.data);
      alert(`檔案 ${file.name} 上傳失敗: ${response.data.message?.message || '伺服器錯誤'}`);
      return null;
    }
  } catch (err) {
    console.error('檔案上傳錯誤:', err);
    
    let errorMsg = `上傳失敗: ${err.message}`;
    
    if (err.response) {
      errorMsg += ` (狀態碼: ${err.response.status})`;
      console.error('上傳錯誤響應數據:', err.response.data);
    } else if (err.request) {
      errorMsg += ' (沒有收到響應)';
    }
    
    alert(`檔案 ${file.name} 上傳失敗: ${errorMsg}`);
    return null;
  } finally {
    setUploadingFile(false);
  }
};


  
  const handleLeaveTypeSelect = (type) => {
    setSelectedLeaveType(type.name);
    setSelectedLeaveTypeApi(type.apiValue);
    setShowLeaveTypeOptions(false);
  };
  
  const [selectedLeaveTypeApi, setSelectedLeaveTypeApi] = useState('personal_leave');

  const handleIllustrateChange = (e) => {
    setIllustrate(e.target.value);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    appWrapper: {
      width: '100%',
      maxWidth: '360px',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3a75b5',
      color: 'white',
      padding: '0 16px',
      height: '50px',
      width: '100%',
      boxSizing: 'border-box',
    },
    homeIcon: {
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    timeDisplay: {
      fontSize: '16px',
      color: '#FFFFFF',
    },
    pageTitle: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      flex: 1,
    },
    formContainer: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    },
    formRow: {
      display: 'flex',
      borderBottom: '1px solid #f0f0f0',
      padding: '15px',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
    },
    formLabel: {
      width: '60px',
      fontSize: '14px',
      color: '#666',
      flexShrink: 0,
    },
    formValue: {
      flex: 1,
      fontSize: '14px',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      width: 'calc(100% - 60px)',
      boxSizing: 'border-box',
    },
    leaveTypeSelector: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      cursor: 'pointer',
    },
    leaveTypeName: {
      fontWeight: 'bold',
    },
    availableHours: {
      fontSize: '12px',
      color: '#666',
      marginLeft: 'auto',
      marginRight: '5px',
    },
    dateTimeRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      boxSizing: 'border-box',
    },
    dateTime: {
      fontSize: '14px',
      cursor: 'pointer',
    },
    weekday: {
      color: '#666',
      marginRight: '20px',
    },
    timeInput: {
      fontSize: '14px',
      textAlign: 'right',
      cursor: 'pointer',
    },
    hours: {
      fontSize: '14px',
      textAlign: 'center',
      width: '100%',
    },
    descriptionContainer: {
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid #f0f0f0',
      padding: '15px',
      width: '100%',
      boxSizing: 'border-box',
    },
    descriptionLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
    },
    descriptionTextarea: {
      minHeight: '100px',
      width: '100%',
      border: 'none',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      padding: '10px',
      fontSize: '14px',
      resize: 'none',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      boxSizing: 'border-box',
    },
    attachmentButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#3a75b5',
      fontSize: '14px',
      border: 'none',
      background: 'none',
      padding: '15px 0 0 0',
      cursor: 'pointer',
      marginTop: '10px',
      width: 'fit-content',
    },
    attachmentIcon: {
      marginRight: '8px',
      color: '#3a75b5',
    },
    attachmentsList: {
      marginTop: '10px',
      width: '100%',
    },
    attachmentItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      marginBottom: '5px',
    },
    attachmentName: {
      fontSize: '12px',
      color: '#333',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    removeAttachmentButton: {
      background: 'none',
      border: 'none',
      color: '#ff4d4f',
      cursor: 'pointer',
      fontSize: '12px',
      padding: '0 5px',
    },
    fileInput: {
      display: 'none',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px',
      borderTop: '1px solid #f0f0f0',
      marginTop: 'auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    cancelButton: {
      width: '45%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
    submitButton: {
      width: '45%',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#3a75b5',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
      opacity: loading ? 0.7 : 1,
    },
    leaveTypeOptionsContainer: {
      position: 'absolute',
      top: '100px',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      zIndex: 10,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxHeight: '70vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: showLeaveTypeOptions ? 'block' : 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    leaveTypeCategory: {
      padding: '10px 16px',
      backgroundColor: '#f5f7fa',
      color: '#666',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '100%',
      boxSizing: 'border-box',
    },
    leaveTypeOption: {
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 5,
      display: showLeaveTypeOptions || showDatePicker || showTimePicker ? 'block' : 'none',
    },
    dropdownIcon: {
      width: '16px',
      height: '16px',
      flexShrink: 0,
    },
    pickerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      padding: '16px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 15,
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    calendarContainer: {
      width: '100%',
      padding: '10px 0',
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    calendarTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
    },
    calendarNavButton: {
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '5px 10px',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '5px',
    },
    calendarWeekday: {
      textAlign: 'center',
      padding: '5px',
      fontSize: '12px',
      color: '#666',
    },
    calendarDay: {
      textAlign: 'center',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '14px',
    },
    calendarDaySelected: {
      backgroundColor: '#3a75b5',
      color: 'white',
    },
    calendarDayToday: {
      border: '1px solid #3a75b5',
    },
    calendarDayOtherMonth: {
      color: '#ccc',
    },
    timePickerContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '20px 0',
    },
    timePickerColumn: {
      flex: 1,
      textAlign: 'center',
      height: '150px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
    },
    timePickerItem: {
      padding: '10px 0',
      fontSize: '16px',
      cursor: 'pointer',
    },
    timePickerItemSelected: {
      fontWeight: 'bold',
      color: '#3a75b5',
    },
    pickerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderTop: '1px solid #f0f0f0',
      marginTop: '10px',
    },
    pickerCancelButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      color: '#666',
    },
    pickerConfirmButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      color: '#3a75b5',
    },
    apiInfo: {
      padding: '5px 10px',
      backgroundColor: '#f0f8ff',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 100,
      display: uploadingFile ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
      borderTop: '4px solid white',
      animation: 'spin 1s linear infinite',
    },
  };

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // 添加 CSS 動畫
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.head.removeChild(style);
    };
  }, []);

  const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false
      });
    }
    
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        day: i,
        isCurrentMonth: true,
        isSelected: selectedDate && 
                    date.getDate() === selectedDate.getDate() && 
                    date.getMonth() === selectedDate.getMonth() && 
                    date.getFullYear() === selectedDate.getFullYear(),
        isToday: today.getDate() === i && 
                today.getMonth() === currentMonth.getMonth() && 
                today.getFullYear() === currentMonth.getFullYear()
      });
    }
    
    const daysNeeded = 42 - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false
      });
    }
    
    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    
    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    
    const handleDayClick = (day, isCurrentMonth) => {
      if (isCurrentMonth) {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        handleDateSelect(newDate);
      }
    };
    
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    
    const formatMonthTitle = () => {
      return `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`;
    };
    
    return (
      <div style={styles.calendarContainer}>
        <div style={styles.calendarHeader}>
          <button style={styles.calendarNavButton} onClick={prevMonth}>&#8249;</button>
          <div style={styles.calendarTitle}>{formatMonthTitle()}</div>
          <button style={styles.calendarNavButton} onClick={nextMonth}>&#8250;</button>
        </div>
        
        <div style={styles.calendarGrid}>
          {weekdays.map((day, index) => (
            <div key={index} style={styles.calendarWeekday}>
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index} 
              style={{
                ...styles.calendarDay,
                ...(day.isSelected ? styles.calendarDaySelected : {}),
                ...(day.isToday && !day.isSelected ? styles.calendarDayToday : {}),
                ...(day.isCurrentMonth ? {} : styles.calendarDayOtherMonth)
              }}
              onClick={() => handleDayClick(day.day, day.isCurrentMonth)}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const TimePicker = () => {
    const [selectedHour, setSelectedHour] = useState(parseInt(isEditingStart ? startTime.split(':')[0] : endTime.split(':')[0]));
    const [selectedMinute, setSelectedMinute] = useState(parseInt(isEditingStart ? startTime.split(':')[1] : endTime.split(':')[1]));
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    
    const confirmSelection = () => {
      handleTimeSelect(selectedHour, selectedMinute);
    };
    
    const cancelSelection = () => {
      setShowTimePicker(false);
    };
    
    return (
      <div>
        <div style={styles.timePickerContainer}>
          <div style={styles.timePickerColumn}>
            {hours.map((hour) => (
              <div 
                key={hour} 
                style={{
                  ...styles.timePickerItem,
                  ...(hour === selectedHour ? styles.timePickerItemSelected : {})
                }}
                onClick={() => setSelectedHour(hour)}
              >
                {String(hour).padStart(2, '0')}
              </div>
            ))}
          </div>
          
          <div style={styles.timePickerColumn}>
            {minutes.map((minute) => (
              <div 
                key={minute} 
                style={{
                  ...styles.timePickerItem,
                  ...(minute === selectedMinute ? styles.timePickerItemSelected : {})
                }}
                onClick={() => setSelectedMinute(minute)}
              >
                {String(minute).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.pickerActions}>
          <button style={styles.pickerCancelButton} onClick={cancelSelection}>
            取消
          </button>
          <button style={styles.pickerConfirmButton} onClick={confirmSelection}>
            確認
          </button>
        </div>
      </div>
    );
  };

  // 格式化檔案大小顯示
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={handleGoHome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div style={styles.pageTitle}>請假申請</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>
        
        <div style={styles.apiInfo}>
          API 端點: {`${proxyServerUrl}/process-request`}
        </div>
        
        <div style={styles.formContainer}>
          <div style={styles.formRow}>
            <div style={styles.formLabel}>假別</div>
            <div style={styles.formValue}>
              <div 
                style={styles.leaveTypeSelector} 
                onClick={() => setShowLeaveTypeOptions(true)}
              >
                <div style={styles.leaveTypeName}>{selectedLeaveType}</div>
                <div style={styles.availableHours}>剩餘：{getSelectedLeaveRemaining()}</div>
                <div style={styles.dropdownIcon}>▼</div>
              </div>
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formLabel}>自</div>
            <div style={styles.formValue}>
              <div style={styles.dateTimeRow}>
                <div style={styles.dateTime} onClick={() => handleDateClick(true)}>{startDate}</div>
                <div style={styles.weekday}>{selectedWeekday}</div>
                <div style={styles.timeInput} onClick={() => handleTimeClick(true)}>{startTime}</div>
              </div>
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formLabel}>到</div>
            <div style={styles.formValue}>
              <div style={styles.dateTimeRow}>
                <div style={styles.dateTime} onClick={() => handleDateClick(false)}>{endDate}</div>
                <div style={styles.weekday}>{selectedWeekday}</div>
                <div style={styles.timeInput} onClick={() => handleTimeClick(false)}>{endTime}</div>
              </div>
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formLabel}>時數</div>
            <div style={styles.formValue}>
              <div style={styles.hours}>{leaveHours}</div>
            </div>
          </div>
          
          <div style={styles.descriptionContainer}>
            <div style={styles.descriptionLabel}>說明</div>
            <textarea 
              style={styles.descriptionTextarea} 
              placeholder="請輸入請假原因..."
              value={illustrate}
              onChange={handleIllustrateChange}
            />
            
            {/* 附件上傳按鈕 */}
            <button style={styles.attachmentButton} onClick={handleAddAttachment}>
              <span style={styles.attachmentIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              新增附件
            </button>
            
            {/* 隱藏的檔案輸入框 */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={styles.fileInput} 
              onChange={handleFileChange}
              multiple
            />
            
            {/* 顯示已選擇的附件 */}
            {attachments.length > 0 && (
              <div style={styles.attachmentsList}>
                {attachments.map((file, index) => (
                  <div key={index} style={styles.attachmentItem}>
                    <div style={styles.attachmentName}>{file.name} ({formatFileSize(file.size)})</div>
                    <button 
                      style={styles.removeAttachmentButton}
                      onClick={() => handleRemoveAttachment(index)}
                      disabled={loading || uploadingFile}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.buttonContainer}>
          <button 
            style={styles.cancelButton} 
            onClick={handleCancel} 
            disabled={loading || uploadingFile}
          >
            取消
          </button>
          <button 
            style={{
              ...styles.submitButton, 
              opacity: (loading || uploadingFile) ? 0.7 : 1,
              cursor: (loading || uploadingFile) ? 'not-allowed' : 'pointer'
            }} 
            onClick={handleSubmit}
            disabled={loading || uploadingFile}
          >
            {loading ? '處理中...' : '送出'}
          </button>
        </div>
        
        {showLeaveTypeOptions && (
          <>
            <div style={styles.overlay} onClick={() => setShowLeaveTypeOptions(false)}></div>
            <div style={styles.leaveTypeOptionsContainer}>
              <div style={styles.leaveTypeCategory}>法定假別</div>
              {leaveTypes
                .filter(type => type.category === '法定假別')
                .map((type, index) => (
                  <div 
                    key={index} 
                    style={styles.leaveTypeOption} 
                    onClick={() => handleLeaveTypeSelect(type)}
                  >
                    <div>{type.name}</div>
                    <div>{type.remaining}</div>
                  </div>
                ))
              }
              
              <div style={styles.leaveTypeCategory}>公司福利假別</div>
              {leaveTypes
                .filter(type => type.category === '公司福利假別')
                .map((type, index) => (
                  <div 
                    key={index} 
                    style={styles.leaveTypeOption} 
                    onClick={() => handleLeaveTypeSelect(type)}
                  >
                    <div>{type.name}</div>
                    <div>{type.remaining}</div>
                  </div>
                ))
              }
            </div>
          </>
        )}

        {showDatePicker && (
          <>
            <div style={styles.overlay} onClick={() => setShowDatePicker(false)}></div>
            <div style={styles.pickerContainer}>
              <Calendar />
            </div>
          </>
        )}
        
        {showTimePicker && (
          <>
            <div style={styles.overlay} onClick={() => setShowTimePicker(false)}></div>
            <div style={styles.pickerContainer}>
              <TimePicker />
            </div>
          </>
        )}
        
        {/* 檔案上傳中的載入遮罩 */}
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}></div>
        </div>
      </div>
    </div>
  );
}

export default Apply;
