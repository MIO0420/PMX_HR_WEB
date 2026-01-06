// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import './PMX_CSS/CheckinPMX.css';
// // import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// // import Cookies from 'js-cookie';
// // import { useLanguage } from './Hook/useLanguage'
// // import LanguageSwitch from './components/LanguageSwitch';
// // import { 
// //   validateUserFromCookies, 
// //   handleClockIn as handleClockInFunction, 
// //   handleClockOut as handleClockOutFunction,
// //   fetchAttendanceRecordsFunction,
// //   fetchPunchStatusFunction,
// //   getTagClassFromResult,
// //   getTagTextFromResult,
// //   handleApiWithOfflineCache  // 新增這行
// // } from './function/function';

// // function CheckinPMX() {
// //   // 使用語言 Hook - 必須先定義
// //   const { currentLanguage, changeLanguage, t } = useLanguage();
  
// //   // 所有 useState 定義
// //   const [currentTime, setCurrentTime] = useState('--:--');
// //   const [currentDate, setCurrentDate] = useState('');
// //   const [previousDate, setPreviousDate] = useState('');
// //   const [dayOfWeek, setDayOfWeek] = useState('');
// //   const [punchStatus, setPunchStatus] = useState('NOT_PUNCHED'); // 使用常數
// //   const [clockInTime, setClockInTime] = useState('--:--');
// //   const [clockOutTime, setClockOutTime] = useState('--:--');
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [userLocation, setUserLocation] = useState({
// //     latitude: null,
// //     longitude: null
// //   });
// //   const [locationError, setLocationError] = useState(null);
// //   const [privateIp, setPrivateIp] = useState('');
// //   const [publicIp, setPublicIp] = useState('');
// //   const [ipError, setIpError] = useState(null);
// //   const [networkInfo, setNetworkInfo] = useState({
// //     ssid: '',
// //     bssid: '',
// //     isWifi: true
// //   });
// //   const [networkError, setNetworkError] = useState(null);
// //   const [scriptUrl, setScriptUrl] = useState('');
// //   const [companyId, setCompanyId] = useState('');
// //   const [employeeId, setEmployeeId] = useState('');
// //   const [attendanceStatus, setAttendanceStatus] = useState(null);
// //   const [isLate, setIsLate] = useState(false);
// //   const [workDuration, setWorkDuration] = useState({ hours: 0, minutes: 0 });
// //   const [ssidError, setSsidError] = useState(null);
// //   const [clockOutStatus, setClockOutStatus] = useState(null);
// //   const [currentEventId, setCurrentEventId] = useState(null);
// //   const [isSmallScreen, setIsSmallScreen] = useState(false);
// //   const appWrapperRef = useRef(null);
// //   const [authToken, setAuthToken] = useState('');
  
// //   // 考勤結果狀態
// //   const [clockInResult, setClockInResult] = useState(null);
// //   const [clockOutResult, setClockOutResult] = useState(null);

// //   // 從 Flutter 獲取的完整信息狀態
// //   const [flutterInfo, setFlutterInfo] = useState({
// //     ssid: null,
// //     bssid: null,
// //     privateIp: null,
// //     latitude: null,
// //     longitude: null
// //   });

// //   // 狀態翻譯函數 - 現在可以安全使用 t 函數
// //   const translatePunchStatus = useCallback((status) => {
// //     switch (status) {
// //       case 'NOT_PUNCHED':
// //         return t('checkin.notPunched');
// //       case 'CLOCKED_IN':
// //         return t('checkin.clockedIn');
// //       case 'CLOCKED_OUT':
// //         return t('checkin.clockedOut');
// //       default:
// //         // 處理舊的中文狀態
// //         if (status === '未打卡' || status === 'Chưa chấm công') {
// //           return t('checkin.notPunched');
// //         } else if (status === '已上班' || status === 'Đã vào làm') {
// //           return t('checkin.clockedIn');
// //         } else if (status === '已下班' || status === 'Đã tan làm') {
// //           return t('checkin.clockedOut');
// //         }
// //         return status;
// //     }
// //   }, [t]);

// //   // 格式化星期幾
// //   const formatDayOfWeek = useCallback((dayIndex) => {
// //     const weekdays = [
// //       t('checkin.weekdays.sunday'),
// //       t('checkin.weekdays.monday'),
// //       t('checkin.weekdays.tuesday'),
// //       t('checkin.weekdays.wednesday'),
// //       t('checkin.weekdays.thursday'),
// //       t('checkin.weekdays.friday'),
// //       t('checkin.weekdays.saturday')
// //     ];
// //     return weekdays[dayIndex];
// //   }, [t]);

// //   // 修改後的標籤文字轉換函數 - 根據當前語言動態翻譯
// //   const getTagTextFromResult = useCallback((result) => {
// //     const statusMap = {
// //       '準時': t('checkin.tags.ontime'),
// //       '遲到': t('checkin.tags.late'),
// //       '早退': t('checkin.tags.early'),
// //       '曠職': t('attendance.statusTags.absent'),
// //       '請假': t('attendance.statusTags.leave'),
// //       '異常': t('attendance.statusTags.abnormal'),
// //       '未打卡': t('checkin.notPunched'),
// //       '已上班': t('checkin.clockedIn'),
// //       '已下班': t('checkin.clockedOut'),
// //       '加班': t('checkin.tags.overtime'),
// //       '滯留': t('checkin.tags.stay'),
// //       // 越南文對照
// //       'Đúng giờ': t('checkin.tags.ontime'),
// //       'Muộn': t('checkin.tags.late'),
// //       'Về sớm': t('checkin.tags.early'),
// //       'Vắng mặt': t('attendance.statusTags.absent'),
// //       'Nghỉ phép': t('attendance.statusTags.leave'),
// //       'Bất thường': t('attendance.statusTags.abnormal'),
// //       'Chưa chấm công': t('checkin.notPunched'),
// //       'Đã vào làm': t('checkin.clockedIn'),
// //       'Đã tan làm': t('checkin.clockedOut'),
// //       'Tăng ca': t('checkin.tags.overtime'),
// //       'Lưu lại': t('checkin.tags.stay')
// //     };
    
// //     return statusMap[result] || result;
// //   }, [t]);

// //   // 修改後的標籤樣式函數
// //   const getTagClassFromResult = useCallback((result) => {
// //     const classMap = {
// //       '準時': 'status-ontime',
// //       '遲到': 'status-late',
// //       '早退': 'status-early',
// //       '曠職': 'status-absent',
// //       '請假': 'status-leave',
// //       '異常': 'status-abnormal',
// //       '未打卡': 'status-not-punched',
// //       '已上班': 'status-clocked-in',
// //       '已下班': 'status-clocked-out',
// //       '加班': 'status-overtime',
// //       '滯留': 'status-stay',
// //       // 越南文對照
// //       'Đúng giờ': 'status-ontime',
// //       'Muộn': 'status-late',
// //       'Về sớm': 'status-early',
// //       'Vắng mặt': 'status-absent',
// //       'Nghỉ phép': 'status-leave',
// //       'Bất thường': 'status-abnormal',
// //       'Chưa chấm công': 'status-not-punched',
// //       'Đã vào làm': 'status-clocked-in',
// //       'Đã tan làm': 'status-clocked-out',
// //       'Tăng ca': 'status-overtime',
// //       'Lưu lại': 'status-stay'
// //     };
    
// //     return classMap[result] || 'status-default';
// //   }, []);

// //   // 當語言改變時，重新翻譯打卡狀態
// //   useEffect(() => {
// //     if (punchStatus) {
// //       // 將現有狀態轉換為常數格式
// //       let normalizedStatus = punchStatus;
      
// //       if (punchStatus === '未打卡' || punchStatus === 'Chưa chấm công') {
// //         normalizedStatus = 'NOT_PUNCHED';
// //       } else if (punchStatus === '已上班' || punchStatus === 'Đã vào làm') {
// //         normalizedStatus = 'CLOCKED_IN';
// //       } else if (punchStatus === '已下班' || punchStatus === 'Đã tan làm') {
// //         normalizedStatus = 'CLOCKED_OUT';
// //       }
      
// //       // 如果狀態發生變化，更新它
// //       if (normalizedStatus !== punchStatus) {
// //         setPunchStatus(normalizedStatus);
// //       }
// //     }
// //   }, [currentLanguage, punchStatus]);

// //   // 使用共用函數驗證用戶
// //   useEffect(() => {
// //     validateUserFromCookies(
// //       setLoading,
// //       setAuthToken,
// //       setCompanyId,
// //       setEmployeeId
// //     );
// //   }, []);

// //   // Checkinfo 函數 - 從 Flutter 獲取完整信息
// //   const Checkinfo = useCallback(async () => {
// //     try {
// //       console.log('開始從 Flutter 獲取完整打卡信息...');
      
// //       let info = {
// //         ssid: null,
// //         bssid: null,
// //         privateIp: null,
// //         latitude: null,
// //         longitude: null
// //       };

// //       // 嘗試從全局變量獲取位置信息（這些變量由 Flutter 注入）
// //       if (window.latitude !== undefined && window.longitude !== undefined) {
// //         info.latitude = window.latitude;
// //         info.longitude = window.longitude;
// //         console.log('從全局變量獲取位置信息:', { 
// //           latitude: info.latitude, 
// //           longitude: info.longitude 
// //         });
// //       }
      
// //       // 嘗試從全局變量獲取 WiFi 信息
// //       if (window.ssid !== undefined && window.bssid !== undefined) {
// //         info.ssid = window.ssid;
// //         info.bssid = window.bssid;
// //         console.log('從全局變量獲取 WiFi 信息:', { 
// //           ssid: info.ssid, 
// //           bssid: info.bssid 
// //         });
// //       }
      
// //       // 嘗試從全局變量獲取私有 IP
// //       if (window.xtbbddtx !== undefined) {
// //         info.privateIp = window.xtbbddtx;
// //         console.log('從全局變量獲取私有 IP:', info.privateIp);
// //       }

// //       // 方法1: 嘗試使用 Flutter WebView 通道
// //       if (window.flutter) {
// //         try {
// //           // 獲取位置信息 (經緯度) - 優先使用 getLocation 方法
// //           if (typeof window.flutter.getLocation === 'function') {
// //             const locationInfo = await window.flutter.getLocation();
// //             if (locationInfo) {
// //               // 確保經緯度格式正確
// //               if (typeof locationInfo.latitude === 'number' && typeof locationInfo.longitude === 'number') {
// //                 info.latitude = locationInfo.latitude;
// //                 info.longitude = locationInfo.longitude;
// //                 console.log('從 Flutter getLocation 獲取位置信息:', { 
// //                   latitude: info.latitude, 
// //                   longitude: info.longitude 
// //                 });
// //               } else if (locationInfo.latitude && locationInfo.longitude) {
// //                 // 嘗試轉換字符串為數字
// //                 info.latitude = parseFloat(locationInfo.latitude);
// //                 info.longitude = parseFloat(locationInfo.longitude);
// //                 console.log('從 Flutter getLocation 獲取並轉換位置信息:', { 
// //                   latitude: info.latitude, 
// //                   longitude: info.longitude 
// //                 });
// //               }
// //             }
// //           }
          
// //           // 獲取 WiFi 信息 - 使用 getWifiInfo 方法
// //           if (typeof window.flutter.getWifiInfo === 'function') {
// //             const wifiInfo = await window.flutter.getWifiInfo();
// //             if (wifiInfo) {
// //               info.ssid = wifiInfo.ssid;
// //               info.bssid = wifiInfo.bssid;
// //               console.log('從 Flutter getWifiInfo 獲取 WiFi 信息:', { 
// //                 ssid: info.ssid, 
// //                 bssid: info.bssid 
// //               });
// //             }
// //           }
          
// //           // 獲取私有 IP - 使用 getxtbbddtx 方法
// //           if (typeof window.flutter.getxtbbddtx === 'function') {
// //             const privateIp = await window.flutter.getxtbbddtx();
// //             if (privateIp) {
// //               info.privateIp = privateIp;
// //               console.log('從 Flutter getxtbbddtx 獲取私有 IP:', privateIp);
// //             }
// //           }
          
// //           // 獲取完整信息 - 使用 getCheckInfo 方法
// //           if (typeof window.flutter.getCheckInfo === 'function') {
// //             const checkInfo = await window.flutter.getCheckInfo();
// //             if (checkInfo) {
// //               // 合併信息，優先使用 getCheckInfo 的結果
// //               info = {
// //                 ...info,
// //                 ...checkInfo,
// //                 // 確保經緯度是數字類型
// //                 latitude: checkInfo.latitude !== undefined ? parseFloat(checkInfo.latitude) : info.latitude,
// //                 longitude: checkInfo.longitude !== undefined ? parseFloat(checkInfo.longitude) : info.longitude
// //               };
// //               console.log('從 Flutter getCheckInfo 獲取完整信息:', checkInfo);
// //             }
// //           }
// //         } catch (flutterError) {
// //           console.error('從 Flutter 獲取信息失敗:', flutterError);
// //         }
// //       }

// //       // 更新狀態
// //       setFlutterInfo(info);

// //       // 同步更新現有的狀態以保持兼容性
// //       if (info.latitude && info.longitude) {
// //         setUserLocation({
// //           latitude: info.latitude,
// //           longitude: info.longitude
// //         });
// //         setLocationError(null);
// //       }
      
// //       if (info.ssid && info.bssid) {
// //         setNetworkInfo({
// //           ssid: info.ssid,
// //           bssid: info.bssid,
// //           isWifi: info.ssid !== 'Network line'
// //         });
// //         setNetworkError(null);
// //       }
      
// //       if (info.privateIp) {
// //         setPrivateIp(info.privateIp);
// //       }

// //       console.log('Checkinfo 完成，獲取到的信息:', info);
// //       return info;

// //     } catch (error) {
// //       console.error('Checkinfo 執行失敗:', error);
// //       return {
// //         ssid: null,
// //         bssid: null,
// //         privateIp: null,
// //         latitude: null,
// //         longitude: null
// //       };
// //     }
// //   }, []);

// //   // 獲取完整網路資訊的函數，包含重試機制
// //   const getCompleteNetworkInfo = async (maxRetries = 3, retryDelay = 500) => {
// //     console.log('開始獲取完整網路資訊，最大重試次數:', maxRetries);
    
// //     for (let i = 0; i < maxRetries; i++) {
// //       const info = await Checkinfo();
      
// //       // 檢查是否已獲取到完整資訊
// //       if (info.ssid && info.bssid && info.privateIp) {
// //         console.log(`第 ${i+1} 次嘗試獲取到完整網路資訊:`, info);
// //         return info;
// //       }
      
// //       console.log(`第 ${i+1} 次嘗試未獲取到完整網路資訊，等待 ${retryDelay}ms 後重試...`);
// //       // 等待一段時間再重試
// //       await new Promise(resolve => setTimeout(resolve, retryDelay));
// //     }
    
// //     // 達到最大重試次數後，返回最後一次獲取的資訊
// //     console.log('達到最大重試次數，返回最後一次獲取的資訊');
// //     return await Checkinfo();
// //   };

// //   // 修改後的 updateLocation 函數 - 優先使用 Checkinfo，不使用預設經緯度
// //   const updateLocation = async () => {
// //     try {
// //       // 優先從 Checkinfo 獲取位置
// //       const info = await Checkinfo();
// //       if (info.latitude && info.longitude) {
// //         const location = {
// //           latitude: info.latitude,
// //           longitude: info.longitude
// //         };
// //         setUserLocation(location);
// //         setLocationError(null);
// //         console.log('已從 Checkinfo 更新位置:', location);
// //         return location;
// //       }

// //       // 如果 Checkinfo 沒有位置信息，使用瀏覽器 API 獲取位置
// //       console.log('Checkinfo 無位置信息，使用瀏覽器獲取位置');
      
// //       return new Promise((resolve, reject) => {
// //         if (navigator.geolocation) {
// //           navigator.geolocation.getCurrentPosition(
// //             (position) => {
// //               const updatedLocation = {
// //                 latitude: position.coords.latitude,
// //                 longitude: position.coords.longitude
// //               };
// //               setUserLocation(updatedLocation);
// //               setLocationError(null);
// //               console.log('已從瀏覽器更新位置:', updatedLocation);
// //               resolve(updatedLocation);
// //             },
// //             (error) => {
// //               console.error('瀏覽器位置獲取失敗:', error.message);
// //               let errorMessage;
// //               switch (error.code) {
// //                 case error.PERMISSION_DENIED:
// //                   errorMessage = t('errors.locationPermissionDenied');
// //                   break;
// //                 case error.POSITION_UNAVAILABLE:
// //                   errorMessage = t('errors.locationUnavailable');
// //                   break;
// //                 case error.TIMEOUT:
// //                   errorMessage = t('errors.locationTimeout');
// //                   break;
// //                 default:
// //                   errorMessage = t('checkin.locationError');
// //                   break;
// //               }
// //               setLocationError(errorMessage);
// //               // 如果已有位置信息，則繼續使用
// //               if (userLocation.latitude && userLocation.longitude) {
// //                 resolve(userLocation);
// //               } else {
// //                 // 如果沒有位置信息，則拒絕 Promise
// //                 reject(new Error(errorMessage));
// //               }
// //             },
// //             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
// //           );
// //         } else {
// //           const errorMessage = t('errors.locationUnavailable');
// //           console.error('瀏覽器不支持地理位置功能');
// //           setLocationError(errorMessage);
// //           // 如果已有位置信息，則繼續使用
// //           if (userLocation.latitude && userLocation.longitude) {
// //             resolve(userLocation);
// //           } else {
// //             // 如果沒有位置信息，則拒絕 Promise
// //             reject(new Error(errorMessage));
// //           }
// //         }
// //       });
// //     } catch (error) {
// //       console.error('更新位置過程中發生錯誤:', error);
// //       // 如果已有位置信息，則繼續使用
// //       if (userLocation.latitude && userLocation.longitude) {
// //         return userLocation;
// //       }
// //       // 如果沒有位置信息，則拋出錯誤
// //       throw new Error(t('checkin.locationError'));
// //     }
// //   };

// //   // 修改後的 updateNetworkInfo 函數 - 優先使用 Checkinfo
// //   const updateNetworkInfo = async () => {
// //     try {
// //       // 優先從 Checkinfo 獲取網絡信息
// //       const info = await Checkinfo();
// //       if (info.ssid || info.bssid) {
// //         const networkInfo = {
// //           ssid: info.ssid || 'UNKNOWN',
// //           bssid: info.bssid || 'XX:XX:XX:XX:XX:XX',
// //           isWifi: info.ssid !== 'Network line'
// //         };
// //         console.log('從 Checkinfo 獲取網絡信息:', networkInfo);
// //         return networkInfo;
// //       }

// //       // 如果 Checkinfo 沒有網絡信息，使用現有的網絡獲取邏輯
// //       console.log('Checkinfo 無網絡信息，使用現有邏輯');
      
// //       // 檢查是否為移動設備
// //       const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
// //       // 檢查是否支持Network Information API
// //       if ('connection' in navigator && navigator.connection) {
// //         const connection = navigator.connection;
        
// //         // 檢查是否為Wi-Fi連接
// //         const isWifiConnection = connection.type === 'wifi';
        
// //         // 如果不是Wi-Fi連接，標記為固定網絡
// //         if (!isWifiConnection) {
// //           console.log('檢測到固定網絡連接');
// //           return {
// //             ssid: 'Network line',
// //             bssid: 'Network line',
// //             isWifi: false
// //           };
// //         }
// //       }
      
// //       // 其他現有的網絡信息獲取邏輯...
// //       if (isMobileDevice) {
// //         console.log('移動設備無法獲取Wi-Fi信息，使用默認值');
// //         return {
// //           ssid: 'UNKNOWN',
// //           bssid: 'XX:XX:XX:XX:XX:XX',
// //           isWifi: true
// //         };
// //       } else {
// //         console.log('桌面設備，可能使用固定網絡');
// //         return {
// //           ssid: 'Network line',
// //           bssid: 'Network line',
// //           isWifi: false
// //         };
// //       }
// //     } catch (err) {
// //       console.error('獲取網絡信息失敗:', err);
// //       return {
// //         ssid: 'UNKNOWN',
// //         bssid: 'XX:XX:XX:XX:XX:XX',
// //         isWifi: true
// //       };
// //     }
// //   };

// //   // 更新localStorage中的考勤結果
// //   const updateLocalStorageWithResults = useCallback((clockInResult, clockOutResult) => {
// //     try {
// //       const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
// //       const storedData = localStorage.getItem(storageKey);
      
// //       if (storedData) {
// //         const punchData = JSON.parse(storedData);
        
// //         if (clockInResult) {
// //           punchData.clockInResult = clockInResult;
// //           console.log('更新localStorage中的上班考勤結果:', clockInResult);
// //         }
        
// //         if (clockOutResult) {
// //           punchData.clockOutResult = clockOutResult;
// //           console.log('更新localStorage中的下班考勤結果:', clockOutResult);
// //         }
        
// //         localStorage.setItem(storageKey, JSON.stringify(punchData));
// //         console.log('已更新localStorage中的考勤結果');
// //       }
// //     } catch (err) {
// //       console.error('更新localStorage中的考勤結果失敗:', err);
// //     }
// //   }, [companyId, employeeId, currentDate]);

// //   // 使用新的 API 查詢考勤記錄並更新標籤狀態
// //   const fetchAttendanceRecords = useCallback(async () => {
// //     const result = await fetchAttendanceRecordsFunction({
// //       companyId,
// //       employeeId,
// //       currentDate,
// //       authToken,
// //       setClockInTime,
// //       setClockOutTime,
// //       setPunchStatus: (status) => {
// //         // 使用常數而不是硬編碼的中文
// //         if (status === '未打卡' || status === 'NOT_PUNCHED') {
// //           setPunchStatus('NOT_PUNCHED');
// //         } else if (status === '已上班' || status === 'CLOCKED_IN') {
// //           setPunchStatus('CLOCKED_IN');
// //         } else if (status === '已下班' || status === 'CLOCKED_OUT') {
// //           setPunchStatus('CLOCKED_OUT');
// //         } else {
// //           setPunchStatus(status);
// //         }
// //       },
// //       setCurrentEventId,
// //       setClockInResult,
// //       setClockOutResult,
// //       setIsLate,
// //       updateLocalStorageWithResults
// //     });
    
// //     if (!result.success) {
// //       console.error('查詢考勤記錄失敗:', result.message);
// //     }
// //   }, [companyId, employeeId, currentDate, authToken, updateLocalStorageWithResults]);

// //   // 修改後的 fetchPunchStatus 函數
// //   const fetchPunchStatus = useCallback(async () => {
// //     const result = await fetchPunchStatusFunction({
// //       companyId,
// //       employeeId,
// //       currentDate,
// //       clockInTime,
// //       setError: (error) => {
// //         if (error) {
// //           setError(error);
// //         }
// //       },
// //       setClockInTime,
// //       setClockOutTime,
// //       setPunchStatus: (status) => {
// //         // 使用常數而不是硬編碼的中文
// //         if (status === '未打卡' || status === 'NOT_PUNCHED') {
// //           setPunchStatus('NOT_PUNCHED');
// //         } else if (status === '已上班' || status === 'CLOCKED_IN') {
// //           setPunchStatus('CLOCKED_IN');
// //         } else if (status === '已下班' || status === 'CLOCKED_OUT') {
// //           setPunchStatus('CLOCKED_OUT');
// //         } else {
// //           setPunchStatus(status);
// //         }
// //       },
// //       setAttendanceStatus,
// //       setIsLate,
// //       setSsidError,
// //       setClockOutStatus,
// //       setCurrentEventId,
// //       setClockInResult,
// //       setClockOutResult,
// //       setFlutterInfo,
// //       fetchAttendanceRecords
// //     });
    
// //     if (!result.success) {
// //       console.error('獲取打卡狀態失敗:', result.message);
// //     }
// //   }, [companyId, employeeId, currentDate, clockInTime, fetchAttendanceRecords]);

// //   // 修改後的 handleClockIn 函數
// //   const handleClockIn = async () => {
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       console.log('開始上班打卡流程...');
      
// //       // 使用重試機制獲取完整網路資訊
// //       console.log('獲取完整網路資訊中...');
// //       const completeInfo = await getCompleteNetworkInfo(3, 800);
// //       console.log('獲取到的完整網路資訊:', completeInfo);
      
// //       // 確保位置資訊有效
// //       let location = {
// //         latitude: completeInfo.latitude || userLocation.latitude,
// //         longitude: completeInfo.longitude || userLocation.longitude
// //       };
      
// //       // 如果沒有位置資訊，嘗試更新位置
// //       if (!location.latitude || !location.longitude) {
// //         try {
// //           location = await updateLocation();
// //           console.log('已更新位置資訊:', location);
// //         } catch (locError) {
// //           console.error('獲取位置失敗:', locError);
// //           setError(t('checkin.clockInFailed') + ': ' + t('checkin.locationError'));
// //           return {
// //             success: false,
// //             message: t('checkin.locationError')
// //           };
// //         }
// //       }
      
// //       // 準備網路資訊
// //       let networkData = {
// //         ssid: completeInfo.ssid || networkInfo.ssid || 'UNKNOWN',
// //         bssid: completeInfo.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
// //         isWifi: (completeInfo.ssid || networkInfo.ssid) !== 'Network line'
// //       };
      
// //       // 準備私有 IP
// //       let privateIpValue = completeInfo.privateIp || privateIp;
      
// //       // 獲取當前時間 - 使用帶時區的 ISO 格式
// //       const now = new Date();
      
// //       // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
// //       const tzOffset = -now.getTimezoneOffset();
// //       const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
// //       const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
// //       const tzSign = tzOffset >= 0 ? '+' : '-';
      
// //       const year = now.getFullYear();
// //       const month = (now.getMonth() + 1).toString().padStart(2, '0');
// //       const day = now.getDate().toString().padStart(2, '0');
// //       const hours = now.getHours().toString().padStart(2, '0');
// //       const minutes = now.getMinutes().toString().padStart(2, '0');
// //       const seconds = now.getSeconds().toString().padStart(2, '0');
      
// //       const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
// //       // 本地時間格式化 - 僅用於顯示
// //       const formattedTime = `${hours}:${minutes}:${seconds}`;
// //       const formattedDate = `${year}-${month}-${day}`;
// //       const timeForDisplay = `${hours}:${minutes}`;
      
// //       // 準備網路資訊 - 根據連接類型設置
// //       let ssidValue;
// //       if (networkData.isWifi) {
// //         // 如果是WiFi連接，使用SSID
// //         ssidValue = networkData.ssid;
// //       } else {
// //         // 如果是固定網路，設為Network line
// //         ssidValue = 'Network line';
// //       }
      
// //       // 構建打卡數據
// //       const payload = {
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         utc_timestamp: utcTimestamp,
// //         ssid: ssidValue,
// //         bssid: networkData.bssid,
// //         xtbbddtx: privateIpValue || '',
// //         public_ip: publicIp || '',
// //         longitude: location.longitude,
// //         latitude: location.latitude
// //       };
      
// //       console.log(`發送上班打卡請求:`, JSON.stringify(payload, null, 2));
      
// //       // 使用 Google API 處理打卡，添加 auth_xtbb token
// //       const response = await fetch('https://rabbit.54ucl.com:3004/api/check-in-google', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${authToken}`
// //         },
// //         body: JSON.stringify(payload)
// //       });
      
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('API回應錯誤:', response.status, errorText);
// //         throw new Error(`${t('checkin.clockInFailed')}: ${response.status} - ${errorText}`);
// //       }
      
// //       const responseData = await response.json();
      
// //       if (responseData.Status !== "Ok") {
// //         throw new Error(responseData.Msg || t('checkin.clockInFailed'));
// //       }
      
// //       console.log('上班打卡成功:', responseData);
      
// //       // 獲取事件 ID
// //       const eventId = responseData.Data?.event_id || null;
      
// //       // 更新UI - 使用常數
// //       setClockInTime(timeForDisplay);
// //       setPunchStatus('CLOCKED_IN');
// //       setClockOutTime('--:--'); // 重置下班時間
// //       setClockOutStatus(null); // 重置下班打卡狀態
// //       setClockOutResult(null); // 重置下班考勤結果
// //       setCurrentEventId(eventId); // 設置當前事件ID
      
// //       // 檢查打卡時間是否遲到，並檢查 SSID
// //       const attendanceCheckResult = await checkAttendanceStatus(
// //         formattedTime,
// //         formattedDate,
// //         eventId,
// //         utcTimestamp
// //       );
      
// //       console.log('打卡狀態檢查結果:', attendanceCheckResult);
      
// //       // 重要：查詢考勤記錄以獲取上班標籤狀態
// //       setTimeout(() => {
// //         fetchAttendanceRecords();
// //       }, 2000);
      
// //       // 保存打卡記錄到本地存儲
// //       const punchData = {
// //         clockInTime: timeForDisplay,
// //         clockInFullTime: formattedTime,
// //         clockInDate: formattedDate,
// //         clockInUtcTimestamp: utcTimestamp,
// //         clockOutTime: null,
// //         clockOutFullTime: null,
// //         clockOutDate: null,
// //         clockOutUtcTimestamp: null,
// //         eventId: eventId,
// //         attendanceStatus: attendanceCheckResult.status === 'success' ? attendanceCheckResult.data : null,
// //         clockOutStatus: null,
// //         clockInResult: clockInResult,
// //         clockOutResult: null,
// //         flutterInfo: completeInfo,
// //         locationUsed: location
// //       };
      
// //       localStorage.setItem(`punchData_${companyId}_${employeeId}_${formattedDate}`, JSON.stringify(punchData));
      
// //       return {
// //         success: true,
// //         data: responseData.Data,
// //         eventId: eventId,
// //         message: t('checkin.clockInSuccess')
// //       };
      
// //     } catch (err) {
// //       console.error('上班打卡失敗:', err);
// //       setError(t('checkin.clockInFailed') + ': ' + (err.message || t('errors.networkError')));
      
// //       return {
// //         success: false,
// //         message: err.message || t('checkin.clockInFailed'),
// //         error: err
// //       };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 修改後的 handleClockOut 函數
// //   const handleClockOut = async () => {
// //     if (clockInTime === '--:--') {
// //       setError(t('checkin.clockInFirst'));
// //       return {
// //         success: false,
// //         message: t('checkin.clockInFirst')
// //       };
// //     }
    
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       console.log('開始下班打卡流程...');
      
// //       // 使用重試機制獲取完整網路資訊
// //       console.log('獲取完整網路資訊中...');
// //       const completeInfo = await getCompleteNetworkInfo(3, 800);
// //       console.log('獲取到的完整網路資訊:', completeInfo);
      
// //       // 確保位置資訊有效
// //       let location = {
// //         latitude: completeInfo.latitude || userLocation.latitude,
// //         longitude: completeInfo.longitude || userLocation.longitude
// //       };
      
// //       // 如果沒有位置資訊，嘗試更新位置
// //       if (!location.latitude || !location.longitude) {
// //         try {
// //           location = await updateLocation();
// //           console.log('已更新位置資訊:', location);
// //         } catch (locError) {
// //           console.error('獲取位置失敗:', locError);
// //           setError(t('checkin.clockOutFailed') + ': ' + t('checkin.locationError'));
// //           return {
// //             success: false,
// //             message: t('checkin.locationError')
// //           };
// //         }
// //       }
      
// //       // 準備網路資訊
// //       let networkData = {
// //         ssid: completeInfo.ssid || networkInfo.ssid || 'UNKNOWN',
// //         bssid: completeInfo.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
// //         isWifi: (completeInfo.ssid || networkInfo.ssid) !== 'Network line'
// //       };
      
// //       // 準備私有 IP
// //       let privateIpValue = completeInfo.privateIp || privateIp;
      
// //       // 重新獲取公共 IP 地址 - 確保使用最新的公共 IP
// //       let currentPublicIp = publicIp;
// //       try {
// //         console.log('下班打卡前重新獲取公共 IP...');
        
// //         // 嘗試使用多個服務獲取公共 IP
// //         // 方法1: 使用 ipify API
// //         try {
// //           const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
// //             cache: 'no-store',
// //             headers: {
// //               'Cache-Control': 'no-cache, no-store, must-revalidate',
// //               'Pragma': 'no-cache',
// //               'Expires': '0'
// //             }
// //           });
          
// //           if (ipifyResponse.ok) {
// //             const ipifyData = await ipifyResponse.json();
// //             if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
// //               currentPublicIp = ipifyData.ip;
// //               console.log('下班打卡: 從 ipify 獲取公共 IP:', ipifyData.ip);
// //             } else {
// //               console.log('下班打卡: ipify 返回伺服器 IP，嘗試其他方法');
// //             }
// //           }
// //         } catch (err) {
// //           console.error('下班打卡: 從 ipify 獲取公共 IP 失敗:', err);
// //         }
        
// //         // 如果 ipify 失敗，嘗試 ipinfo.io
// //         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
// //           try {
// //             const ipinfoResponse = await fetch('https://ipinfo.io/json', {
// //               cache: 'no-store',
// //               headers: {
// //                 'Cache-Control': 'no-cache, no-store, must-revalidate',
// //                 'Pragma': 'no-cache',
// //                 'Expires': '0'
// //               }
// //             });
            
// //             if (ipinfoResponse.ok) {
// //               const ipinfoData = await ipinfoResponse.json();
// //               if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
// //                 currentPublicIp = ipinfoData.ip;
// //                 console.log('下班打卡: 從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
// //               } else {
// //                 console.log('下班打卡: ipinfo.io 返回伺服器 IP，嘗試其他方法');
// //               }
// //             }
// //           } catch (err) {
// //             console.error('下班打卡: 從 ipinfo.io 獲取公共 IP 失敗:', err);
// //           }
// //         }
        
// //         // 如果 ipinfo.io 也失敗，嘗試 cloudflare
// //         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
// //           try {
// //             const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
// //               cache: 'no-store',
// //               headers: {
// //                 'Cache-Control': 'no-cache, no-store, must-revalidate',
// //                 'Pragma': 'no-cache',
// //                 'Expires': '0'
// //               }
// //             });
            
// //             if (cfResponse.ok) {
// //               const cfText = await cfResponse.text();
// //               const ipMatch = cfText.match(/ip=([0-9.]+)/);
// //               if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
// //                 currentPublicIp = ipMatch[1];
// //                 console.log('下班打卡: 從 Cloudflare 獲取公共 IP:', ipMatch[1]);
// //               } else {
// //                 console.log('下班打卡: Cloudflare 返回伺服器 IP，嘗試其他方法');
// //               }
// //             }
// //           } catch (err) {
// //             console.error('下班打卡: 從 Cloudflare 獲取公共 IP 失敗:', err);
// //           }
// //         }
        
// //         // 最後嘗試自定義 API
// //         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
// //           try {
// //             const customApiResponse = await fetch('https://rabbit.54ucl.com:3004/api/client-ip', {
// //               cache: 'no-store',
// //               headers: {
// //                 'Cache-Control': 'no-cache, no-store, must-revalidate',
// //                 'Pragma': 'no-cache',
// //                 'Expires': '0'
// //               }
// //             });
            
// //             if (customApiResponse.ok) {
// //               const customApiData = await customApiResponse.json();
// //               if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
// //                 currentPublicIp = customApiData.ip;
// //                 console.log('下班打卡: 從自定義 API 獲取公共 IP:', customApiData.ip);
// //               } else {
// //                 console.log('下班打卡: 自定義 API 返回伺服器 IP，使用備用方法');
// //               }
// //             }
// //           } catch (err) {
// //             console.error('下班打卡: 從自定義 API 獲取公共 IP 失敗:', err);
// //           }
// //         }
        
// //         // 如果所有方法都失敗，使用空字符串
// //         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
// //           console.log('下班打卡: 所有方法獲取公共 IP 失敗，使用空字符串');
// //           currentPublicIp = '';
// //         }
        
// //       } catch (ipError) {
// //         console.error('下班打卡: 獲取公共 IP 過程中發生錯誤:', ipError);
// //         currentPublicIp = ''; // 出錯時使用空字符串
// //       }
      
// //       // 獲取當前時間 - 使用帶時區的 ISO 格式
// //       const now = new Date();
      
// //       // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
// //       const tzOffset = -now.getTimezoneOffset();
// //       const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
// //       const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
// //       const tzSign = tzOffset >= 0 ? '+' : '-';
      
// //       const year = now.getFullYear();
// //       const month = (now.getMonth() + 1).toString().padStart(2, '0');
// //       const day = now.getDate().toString().padStart(2, '0');
// //       const hours = now.getHours().toString().padStart(2, '0');
// //       const minutes = now.getMinutes().toString().padStart(2, '0');
// //       const seconds = now.getSeconds().toString().padStart(2, '0');
      
// //       const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
// //       // 本地時間格式化 - 僅用於顯示
// //       const formattedTime = `${hours}:${minutes}:${seconds}`;
// //       const formattedDate = `${year}-${month}-${day}`;
// //       const timeForDisplay = `${hours}:${minutes}`;
      
// //       // 準備網路資訊 - 根據連接類型設置
// //       let ssidValue;
// //       if (networkData.isWifi) {
// //         // 如果是WiFi連接，使用SSID
// //         ssidValue = networkData.ssid;
// //       } else {
// //         // 如果是固定網路，設為Network line
// //         ssidValue = 'Network line';
// //       }
      
// //       // 準備下班原因（如有需要）
// //       let reason = '';
      
// //       // 檢查是否有 SSID 錯誤，如果有，加入到 reason
// //       if (ssidError) {
// //         reason = `SSID錯誤: ${ssidError}`;
// //       }
      
// //       // 構建打卡數據
// //       const payload = {
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         utc_timestamp: utcTimestamp,
// //         event_id: currentEventId || null, // 使用當前事件ID
// //         ssid: ssidValue,
// //         bssid: networkData.bssid,
// //         xtbbddtx: privateIpValue || '',
// //         public_ip: currentPublicIp, // 使用重新獲取的公共 IP
// //         longitude: location.longitude,
// //         latitude: location.latitude,
// //         reason: reason || null // 添加下班原因
// //       };
      
// //       console.log(`發送下班打卡請求:`, JSON.stringify(payload, null, 2));
      
// //       // 使用 Google API 處理打卡，添加 auth_xtbb token
// //       const response = await fetch('https://rabbit.54ucl.com:3004/api/check-out-google', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${authToken}`
// //         },
// //         body: JSON.stringify(payload)
// //       });
      
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('API回應錯誤:', response.status, errorText);
// //         throw new Error(`${t('checkin.clockOutFailed')}: ${response.status} - ${errorText}`);
// //       }
      
// //       const responseData = await response.json();
      
// //       if (responseData.Status !== "Ok") {
// //         throw new Error(responseData.Msg || t('checkin.clockOutFailed'));
// //       }
      
// //       console.log('下班打卡成功:', responseData);
      
// //       // 更新UI - 使用常數
// //       setClockOutTime(timeForDisplay);
// //       setPunchStatus('CLOCKED_OUT');
      
// //       // 檢查下班打卡狀態
// //       const clockOutCheckResult = await checkClockOutStatus(
// //         formattedTime,
// //         formattedDate,
// //         currentEventId,
// //         utcTimestamp
// //       );
      
// //       console.log('下班打卡狀態檢查結果:', clockOutCheckResult);
      
// //       // 查詢最新打卡記錄
// //       setTimeout(() => {
// //         fetchAttendanceRecords();
// //       }, 2000);
      
// //       // 更新本地存儲中的打卡記錄
// //       const storedData = localStorage.getItem(`punchData_${companyId}_${employeeId}_${currentDate}`);
// //       let punchData = storedData ? JSON.parse(storedData) : {};
      
// //       punchData.clockOutTime = timeForDisplay;
// //       punchData.clockOutFullTime = formattedTime;
// //       punchData.clockOutDate = formattedDate;
// //       punchData.clockOutUtcTimestamp = utcTimestamp;
// //       punchData.clockOutReason = reason; // 儲存下班原因
// //       punchData.clockOutStatus = clockOutCheckResult.status === 'success' ? clockOutCheckResult.data?.attendance_status : null; // 儲存下班打卡狀態
// //       punchData.clockOutResult = clockOutResult; // 保持現有的下班考勤結果
// //       // 更新從 Flutter 獲取的信息
// //       punchData.flutterInfo = { ...punchData.flutterInfo, ...completeInfo };
// //       // 儲存使用的公共 IP
// //       punchData.publicIp = currentPublicIp;
// //       // 儲存使用的位置信息
// //       punchData.locationUsedForClockOut = location;
      
// //       localStorage.setItem(`punchData_${companyId}_${employeeId}_${currentDate}`, JSON.stringify(punchData));
      
// //       return {
// //         success: true,
// //         data: responseData.Data,
// //         message: t('checkin.clockOutSuccess')
// //       };
      
// //     } catch (err) {
// //       console.error('下班打卡失敗:', err);
// //       setError(t('checkin.clockOutFailed') + ': ' + (err.message || t('errors.networkError')));
      
// //       return {
// //         success: false,
// //         message: err.message || t('checkin.clockOutFailed'),
// //         error: err
// //       };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 檢測螢幕尺寸
// //   useEffect(() => {
// //     const checkScreenSize = () => {
// //       if (appWrapperRef.current) {
// //         const width = appWrapperRef.current.offsetWidth;
// //         setIsSmallScreen(width < 360);
// //       }
// //     };
    
// //     checkScreenSize();
// //     window.addEventListener('resize', checkScreenSize);
    
// //     return () => {
// //       window.removeEventListener('resize', checkScreenSize);
// //     };
// //   }, []);
  
// //   // 初始化時從 Flutter 獲取信息並定期更新
// //   useEffect(() => {
// //     if (companyId && employeeId) {
// //       console.log('開始初始化 Checkinfo...');
      
// //       // 立即執行一次獲取資訊
// //       Checkinfo();
      
// //       // 設置定時器，每 30 秒更新一次網路資訊，確保始終有最新資訊
// //       const interval = setInterval(() => {
// //         console.log('定期更新網路資訊...');
// //         Checkinfo();
// //       }, 30000);
      
// //       return () => clearInterval(interval);
// //     }
// //   }, [companyId, employeeId, Checkinfo]);

// //   // 獲取用戶位置 - 修改為不使用預設經緯度
// //   useEffect(() => {
// //     // 如果已經從 Flutter 獲取到位置信息，就不需要再用瀏覽器 API
// //     if (flutterInfo.latitude && flutterInfo.longitude) {
// //       console.log('已從 Flutter 獲取位置信息，跳過瀏覽器位置獲取');
// //       return;
// //     }

// //     if (navigator.geolocation) {
// //       setLocationError(null);
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           setUserLocation({
// //             latitude: position.coords.latitude,
// //             longitude: position.coords.longitude
// //           });
// //           console.log('成功獲取地理位置:', position.coords.latitude, position.coords.longitude);
// //         },
// //         (error) => {
// //           console.error('獲取地理位置失敗:', error.message);
// //           let errorMessage;
// //           switch (error.code) {
// //             case error.PERMISSION_DENIED:
// //               errorMessage = t('errors.locationPermissionDenied');
// //               break;
// //             case error.POSITION_UNAVAILABLE:
// //               errorMessage = t('errors.locationUnavailable');
// //               break;
// //             case error.TIMEOUT:
// //               errorMessage = t('errors.locationTimeout');
// //               break;
// //             default:
// //               errorMessage = t('checkin.locationError');
// //               break;
// //           }
// //           setLocationError(errorMessage);
// //           // 不再設置預設位置
// //         },
// //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
// //       );
// //     } else {
// //       setLocationError(t('errors.locationUnavailable'));
// //       // 不再設置預設位置
// //     }
// //   }, [flutterInfo.latitude, flutterInfo.longitude, t]);

// //   // 獲取IP地址 - 修改為使用更可靠的公共 IP 獲取服務
// //   useEffect(() => {
// //     const getIpAddresses = async () => {
// //       try {
// //         setIpError(null);
        
// //         // 優先使用 Checkinfo 獲取私有 IP
// //         const info = await Checkinfo();
// //         if (info.privateIp) {
// //           setPrivateIp(info.privateIp);
// //           console.log('從 Checkinfo 獲取私有 IP:', info.privateIp);
// //         } else {
// //           // 備用方案：使用 WebRTC 獲取私有 IP
// //           console.log('嘗試使用 WebRTC 獲取私有IP作為備用方案');
          
// //           const RTCPeerConnection = window.RTCPeerConnection || 
// //                                   window.webkitRTCPeerConnection || 
// //                                   window.mozRTCPeerConnection;
          
// //           if (RTCPeerConnection) {
// //             const pc = new RTCPeerConnection({
// //               iceServers: []
// //             });
            
// //             // 非必要，但可以用來觸發ICE候選項收集
// //             pc.createDataChannel('');
            
// //             // 創建offer並設置本地描述
// //             const offer = await pc.createOffer();
// //             await pc.setLocalDescription(offer);
            
// //             // 監聽ICE候選項事件
// //             pc.onicecandidate = (ice) => {
// //               if (ice.candidate) {
// //                 // 從候選項中提取IP地址
// //                 const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
// //                 const matches = ipRegex.exec(ice.candidate.candidate);
                
// //                 if (matches && matches.length > 1) {
// //                   const ip = matches[1];
                  
// //                   // 檢查是否為私有IP
// //                   if (
// //                     ip.startsWith('10.') || 
// //                     ip.startsWith('192.168.') || 
// //                     ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
// //                   ) {
// //                     console.log('通過WebRTC獲取到私有IP:', ip);
// //                     setPrivateIp(ip);
// //                     pc.onicecandidate = null;
// //                     pc.close();
// //                   }
// //                 }
// //               }
// //             };
            
// //           } else {
// //             console.log('瀏覽器不支持WebRTC，無法獲取私有IP');
// //           }
// //         }
        
// //         // 使用多個公共 IP 獲取服務，提高可靠性
// //         try {
// //           // 方法1: 使用 ipify API
// //           const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
// //             cache: 'no-store',
// //             headers: {
// //               'Cache-Control': 'no-cache, no-store, must-revalidate',
// //               'Pragma': 'no-cache',
// //               'Expires': '0'
// //             }
// //           });
          
// //           if (ipifyResponse.ok) {
// //             const ipifyData = await ipifyResponse.json();
// //             if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
// //               setPublicIp(ipifyData.ip);
// //               console.log('從 ipify 獲取公共 IP:', ipifyData.ip);
// //               return; // 成功獲取，退出函數
// //             } else {
// //               console.log('ipify 返回伺服器 IP，嘗試其他方法');
// //             }
// //           }
// //         } catch (err) {
// //           console.error('從 ipify 獲取公共 IP 失敗:', err);
// //         }
        
// //         try {
// //           // 方法2: 使用 ipinfo.io API
// //           const ipinfoResponse = await fetch('https://ipinfo.io/json', {
// //             cache: 'no-store',
// //             headers: {
// //               'Cache-Control': 'no-cache, no-store, must-revalidate',
// //               'Pragma': 'no-cache',
// //               'Expires': '0'
// //             }
// //           });
          
// //           if (ipinfoResponse.ok) {
// //             const ipinfoData = await ipinfoResponse.json();
// //             if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
// //               setPublicIp(ipinfoData.ip);
// //               console.log('從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
// //               return; // 成功獲取，退出函數
// //             } else {
// //               console.log('ipinfo.io 返回伺服器 IP，嘗試其他方法');
// //             }
// //           }
// //         } catch (err) {
// //           console.error('從 ipinfo.io 獲取公共 IP 失敗:', err);
// //         }
        
// //         try {
// //           // 方法3: 使用 cloudflare API
// //           const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
// //             cache: 'no-store',
// //             headers: {
// //               'Cache-Control': 'no-cache, no-store, must-revalidate',
// //               'Pragma': 'no-cache',
// //               'Expires': '0'
// //             }
// //           });
          
// //           if (cfResponse.ok) {
// //             const cfText = await cfResponse.text();
// //             const ipMatch = cfText.match(/ip=([0-9.]+)/);
// //             if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
// //               setPublicIp(ipMatch[1]);
// //               console.log('從 Cloudflare 獲取公共 IP:', ipMatch[1]);
// //               return; // 成功獲取，退出函數
// //             } else {
// //               console.log('Cloudflare 返回伺服器 IP，嘗試其他方法');
// //             }
// //           }
// //         } catch (err) {
// //           console.error('從 Cloudflare 獲取公共 IP 失敗:', err);
// //         }
        
// //         // 方法4: 使用自定義 API 端點
// //         try {
// //           const customApiResponse = await fetch('https://rabbit.54ucl.com:3004/api/client-ip', {
// //             cache: 'no-store',
// //             headers: {
// //               'Cache-Control': 'no-cache, no-store, must-revalidate',
// //               'Pragma': 'no-cache',
// //               'Expires': '0'
// //             }
// //           });
          
// //           if (customApiResponse.ok) {
// //             const customApiData = await customApiResponse.json();
// //             if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
// //               setPublicIp(customApiData.ip);
// //               console.log('從自定義 API 獲取公共 IP:', customApiData.ip);
// //               return; // 成功獲取，退出函數
// //             } else {
// //               console.log('自定義 API 返回伺服器 IP，使用備用方法');
// //             }
// //           }
// //         } catch (err) {
// //           console.error('從自定義 API 獲取公共 IP 失敗:', err);
// //         }
        
// //         // 如果所有方法都失敗，使用空字符串而不是伺服器 IP
// //         console.log('所有方法獲取公共 IP 失敗，使用空字符串');
// //         setPublicIp('');
        
// //       } catch (error) {
// //         console.error('獲取 IP 地址失敗:', error);
// //         setIpError(t('errors.networkError'));
// //         setPublicIp(''); // 使用空字符串而不是伺服器 IP
// //       }
// //     };

// //     if (companyId && employeeId) {
// //       getIpAddresses();
// //     }
// //   }, [companyId, employeeId, Checkinfo, t]);

// //   // 獲取網絡信息 - 修改為備用方案
// //   useEffect(() => {
// //     // 如果已經從 Flutter 獲取到網絡信息，就不需要再用其他方法
// //     if (flutterInfo.ssid || flutterInfo.bssid) {
// //       console.log('已從 Flutter 獲取網絡信息，跳過其他網絡信息獲取');
// //       setNetworkInfo({
// //         ssid: flutterInfo.ssid || 'UNKNOWN',
// //         bssid: flutterInfo.bssid || 'XX:XX:XX:XX:XX:XX',
// //         isWifi: flutterInfo.ssid !== 'Network line'
// //       });
// //       return;
// //     }

// //     const getNetworkInfo = async () => {
// //       try {
// //         setNetworkError(null);
        
// //         // 檢查是否為移動設備
// //         const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
// //         // 檢查是否支持Network Information API
// //         if ('connection' in navigator && navigator.connection) {
// //           const connection = navigator.connection;
// //           console.log('連接類型:', connection.type);
// //           console.log('有效類型:', connection.effectiveType);
          
// //           // 檢查是否為Wi-Fi連接
// //           const isWifiConnection = connection.type === 'wifi';
          
// //           // 如果不是Wi-Fi連接，標記為固定網絡
// //           if (!isWifiConnection) {
// //             console.log('檢測到固定網絡連接');
// //             setNetworkInfo({
// //               ssid: 'Network line',
// //               bssid: 'Network line',
// //               isWifi: false
// //             });
// //             return;
// //           }
// //         }
        
// //         // 其他現有的網絡信息獲取邏輯...
// //         if (isMobileDevice) {
// //           console.log('移動設備無法獲取Wi-Fi信息，使用默認值');
// //           setNetworkInfo({
// //             ssid: 'UNKNOWN',
// //             bssid: 'XX:XX:XX:XX:XX:XX',
// //             isWifi: true
// //           });
// //         } else {
// //           // 如果是桌面設備，更可能是固定網絡
// //           console.log('桌面設備，可能使用固定網絡');
// //           setNetworkInfo({
// //             ssid: 'Network line',
// //             bssid: 'Network line',
// //             isWifi: false
// //           });
// //         }
        
// //       } catch (err) {
// //         console.error('獲取網絡信息失敗:', err);
// //         setNetworkError(t('errors.networkError'));
// //         setNetworkInfo({
// //           ssid: 'UNKNOWN',
// //           bssid: 'XX:XX:XX:XX:XX:XX',
// //           isWifi: true
// //         });
// //       }
// //     };
    
// //     getNetworkInfo();
// //   }, [flutterInfo.ssid, flutterInfo.bssid, t]);

// //   // 計算工作時長
// //   const calculateWorkDuration = useCallback(() => {
// //     if (clockInTime === '--:--' || !isLate) return;

// //     // 從打卡時間獲取小時和分鐘
// //     const [hours, minutes] = clockInTime.split(':').map(Number);
// //     if (isNaN(hours) || isNaN(minutes)) return;

// //     // 獲取當前時間
// //     const now = new Date();
// //     const currentHours = now.getHours();
// //     const currentMinutes = now.getMinutes();

// //     // 計算工作時長（小時和分鐘）
// //     let durationMinutes = (currentHours - hours) * 60 + (currentMinutes - minutes);
    
// //     // 如果是負數（可能是跨天的情況），加上24小時
// //     if (durationMinutes < 0) {
// //       durationMinutes += 24 * 60;
// //     }

// //     const durationHours = Math.floor(durationMinutes / 60);
// //     const remainingMinutes = durationMinutes % 60;

// //     setWorkDuration({
// //       hours: durationHours,
// //       minutes: remainingMinutes
// //     });
// //   }, [clockInTime, isLate]);

// //   // 定期更新工作時長
// //   useEffect(() => {
// //     if (isLate && clockInTime !== '--:--') {
// //       calculateWorkDuration();
// //       const interval = setInterval(calculateWorkDuration, 60000); // 每分鐘更新一次
// //       return () => clearInterval(interval);
// //     }
// //   }, [isLate, clockInTime, calculateWorkDuration]);

// //   // 查詢最新打卡記錄並獲取 event_id
// //   const fetchLatestCheckRecord = useCallback(async () => {
// //     if (!companyId || !employeeId) {
// //       console.log('缺少查詢打卡記錄的必要參數');
// //       return null;
// //     }

// //     try {
// //       console.log('開始查詢最新打卡記錄...');
      
// //       // 獲取當前日期
// //       const now = new Date();
// //       const year = now.getFullYear();
// //       const month = (now.getMonth() + 1).toString().padStart(2, '0');
// //       const day = now.getDate().toString().padStart(2, '0');
// //       const today = `${year}-${month}-${day}`;
      
// //       // 使用 API 查詢打卡記錄，添加 auth_xtbb token
// //       const response = await fetch(`https://rabbit.54ucl.com:3004/api/check-records?company_id=${companyId}&employee_id=${employeeId}&start_date=${today}&end_date=${today}`, {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
// //         }
// //       });
      
// //       if (!response.ok) {
// //         throw new Error(`API 回應錯誤: ${response.status}`);
// //       }
      
// //       const responseData = await response.json();
      
// //       if (responseData.Status === "Ok" && responseData.Data.records.length > 0) {
// //         // 獲取最新的打卡記錄（第一筆）
// //         const latestRecord = responseData.Data.records[0];
// //         console.log('最新打卡記錄:', latestRecord);
// //         return latestRecord;
// //       } else {
// //         console.log('沒有找到打卡記錄或查詢失敗:', responseData.Msg);
// //         return null;
// //       }
// //     } catch (err) {
// //       console.error('查詢最新打卡記錄失敗:', err);
// //       return null;
// //     }
// //   }, [companyId, employeeId, authToken]);

// //   // 檢查考勤狀態
// //   const checkAttendanceStatus = async (time, date, eventId, utcTimestamp) => {
// //     try {
// //       console.log('開始檢查考勤狀態...');
// //       console.log('- 時間:', time);
// //       console.log('- 日期:', date);
// //       console.log('- 事件ID:', eventId);
// //       console.log('- UTC時間戳:', utcTimestamp);
      
// //       // 使用 API 檢查考勤狀態，添加 auth_xtbb token
// //       const response = await fetch('https://rabbit.54ucl.com:3004/api/check-attendance-status', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
// //         },
// //         body: JSON.stringify({
// //           company_id: companyId,
// //           employee_id: employeeId,
// //           time: time,
// //           date: date,
// //           event_id: eventId,
// //           utc_timestamp: utcTimestamp,
// //           ssid: networkInfo.ssid
// //         })
// //       });
      
// //       if (!response.ok) {
// //         throw new Error(`API 回應錯誤: ${response.status}`);
// //       }
      
// //       const responseData = await response.json();
// //       console.log('考勤狀態檢查結果:', responseData);
      
// //       if (responseData.Status === "Ok") {
// //         // 檢查是否有 SSID 錯誤
// //         if (responseData.Data.message && responseData.Data.message.includes('使用非公司網路')) {
// //           const ssidErrorMsg = responseData.Data.message.split('；')[1] || responseData.Data.message;
// //           setSsidError(ssidErrorMsg);
// //         }
        
// //         return {
// //           status: 'success',
// //           data: responseData.Data
// //         };
// //       } else {
// //         return {
// //           status: 'error',
// //           message: responseData.Msg || '檢查考勤狀態失敗'
// //         };
// //       }
// //     } catch (err) {
// //       console.error('檢查考勤狀態失敗:', err);
// //       return {
// //         status: 'error',
// //         message: err.message
// //       };
// //     }
// //   };

// //   // 檢查下班打卡狀態
// //   const checkClockOutStatus = async (time, date, eventId, utcTimestamp) => {
// //     try {
// //       console.log('開始檢查下班打卡狀態...');
// //       console.log('- 時間:', time);
// //       console.log('- 日期:', date);
// //       console.log('- 事件ID:', eventId);
// //       console.log('- UTC時間戳:', utcTimestamp);
      
// //       // 使用 API 檢查下班打卡狀態，添加 auth_xtbb token
// //       const response = await fetch('https://rabbit.54ucl.com:3004/api/check-clock-out-status', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
// //         },
// //         body: JSON.stringify({
// //           company_id: companyId,
// //           employee_id: employeeId,
// //           time: time,
// //           date: date,
// //           event_id: eventId,
// //           utc_timestamp: utcTimestamp
// //         })
// //       });
      
// //       if (!response.ok) {
// //         throw new Error(`API 回應錯誤: ${response.status}`);
// //       }
      
// //       const responseData = await response.json();
// //       console.log('下班打卡狀態檢查結果:', responseData);
      
// //       if (responseData.Status === "Ok") {
// //         return {
// //           status: 'success',
// //           data: responseData.Data
// //         };
// //       } else {
// //         return {
// //           status: 'error',
// //           message: responseData.Msg || '檢查下班打卡狀態失敗'
// //         };
// //       }
// //     } catch (err) {
// //       console.error('檢查下班打卡狀態失敗:', err);
// //       return {
// //         status: 'error',
// //         message: err.message
// //       };
// //     }
// //   };

// //   // 獲取當前日期和時間，並檢測日期變化
// //   useEffect(() => {
// //     const updateDateTime = () => {
// //       const now = new Date();
      
// //       // 格式化時間為 HH:MM
// //       const hours = now.getHours().toString().padStart(2, '0');
// //       const minutes = now.getMinutes().toString().padStart(2, '0');
// //       setCurrentTime(`${hours}:${minutes}`);
      
// //       // 格式化日期為 YYYY-MM-DD
// //       const year = now.getFullYear();
// //       const month = (now.getMonth() + 1).toString().padStart(2, '0');
// //       const day = now.getDate().toString().padStart(2, '0');
// //       const formattedDate = `${year}-${month}-${day}`;
      
// //       // 檢查日期是否變化（過了凌晨12點）
// //       if (previousDate && previousDate !== formattedDate) {
// //         console.log('檢測到日期變化，從', previousDate, '到', formattedDate);
// //         console.log('自動刷新頁面以獲取新的打卡記錄...');
        
// //         // 重置打卡狀態
// //         setClockInTime('--:--');
// //         setClockOutTime('--:--');
// //         setPunchStatus('NOT_PUNCHED');
// //         setClockInResult(null);
// //         setClockOutResult(null);
        
// //         // 重新獲取打卡記錄
// //         if (companyId && employeeId) {
// //           fetchPunchStatus();
// //         }
// //       }
      
// //       // 更新當前日期和前一天日期
// //       setCurrentDate(formattedDate);
// //       setPreviousDate(formattedDate);
      
// //       // 獲取星期幾
// //       const dayOfWeekIndex = now.getDay();
// //       setDayOfWeek(formatDayOfWeek(dayOfWeekIndex));
// //     };
    
// //     updateDateTime();
    
// //     // 設置定時器，每分鐘更新一次時間和日期
// //     const interval = setInterval(updateDateTime, 60000);
    
// //     // 設置一個定時器，每分鐘檢查是否為台灣時間凌晨 00:00，如果是則刷新頁面資訊
// //     const midnightRefreshInterval = setInterval(() => {
// //       const now = new Date();
// //       const taiwanHours = now.getHours();
// //       const taiwanMinutes = now.getMinutes();
      
// //       // 如果是台灣時間凌晨 00:00
// //       if (taiwanHours === 0 && taiwanMinutes === 0) {
// //         console.log('台灣時間凌晨 00:00，執行頁面資訊刷新...');
        
// //         // 重置打卡狀態
// //         setClockInTime('--:--');
// //         setClockOutTime('--:--');
// //         setPunchStatus('NOT_PUNCHED');
// //         setClockInResult(null);
// //         setClockOutResult(null);
        
// //         // 重新獲取打卡記錄
// //         if (companyId && employeeId) {
// //           fetchPunchStatus();
// //         }
// //       }
// //     }, 60000); // 每分鐘檢查一次
    
// //     return () => {
// //       clearInterval(interval);
// //       clearInterval(midnightRefreshInterval);
// //     };
// //   }, [companyId, employeeId, fetchPunchStatus, previousDate, formatDayOfWeek, t]);

// //   // 在認證完成後獲取打卡狀態
// //   useEffect(() => {
// //     if (companyId && employeeId && currentDate) {
// //       fetchPunchStatus();
// //     }
// //   }, [companyId, employeeId, currentDate, fetchPunchStatus]);
// // // 新增處理 Flutter 傳回的快取請求
// // useEffect(() => {
// //   // 定義全域函數讓 Flutter 呼叫
// //   window.processCachedRequest = async (dbId, requestPacket) => {
// //     console.log("收到 Flutter 歸還的暫存資料，準備上傳:", requestPacket);

// //     try {
// //       // 這裡才真正執行 API Call（使用 Web 原有的 fetch）
// //       const response = await fetch(requestPacket.url, {
// //         method: requestPacket.method,
// //         headers: requestPacket.headers,
// //         body: JSON.stringify(requestPacket.body)
// //       });

// //       if (!response.ok) {
// //         throw new Error(`API 請求失敗: ${response.status}`);
// //       }

// //       const responseData = await response.json();
      
// //       if (responseData.Status === "Ok") {
// //         console.log("快取請求上傳成功:", responseData);
        
// //         // 成功後，通知 Flutter 刪除該筆 SQLite 資料
// //         if (window.FlutterBridge) {
// //           window.FlutterBridge.postMessage(JSON.stringify({
// //             action: 'REQUEST_PROCESSED',
// //             id: dbId // 告訴 Flutter 哪一筆處理完了
// //           }));
// //         }
        
// //         // 根據請求類型更新相關狀態
// //         if (requestPacket.url.includes('check-in-google')) {
// //           console.log('快取的上班打卡請求已成功處理');
          
// //           // 如果有 event_id，更新到狀態中
// //           if (responseData.Data?.event_id) {
// //             setCurrentEventId(responseData.Data.event_id);
// //           }
          
// //           // 靜默更新考勤記錄
// //           setTimeout(() => {
// //             fetchAttendanceRecords();
// //           }, 1000);
          
// //         } else if (requestPacket.url.includes('check-out-google')) {
// //           console.log('快取的下班打卡請求已成功處理');
          
// //           // 靜默更新考勤記錄
// //           setTimeout(() => {
// //             fetchAttendanceRecords();
// //           }, 1000);
// //         }
        
// //         console.log("上傳成功，已通知 Flutter 清除快取");

// //       } else {
// //         throw new Error(responseData.Msg || '處理快取請求失敗');
// //       }

// //     } catch (error) {
// //       console.error("快取請求上傳失敗，稍後再試", error);
// //       // 失敗就不通知刪除，讓 Flutter 下次連線再丟一次
// //     }
// //   };

// //   // 清理函數
// //   return () => {
// //     if (window.processCachedRequest) {
// //       delete window.processCachedRequest;
// //     }
// //   };
// // }, [fetchAttendanceRecords, setCurrentEventId]);

// //   // 語言變化時更新標籤文字
// //   useEffect(() => {
// //     // 當語言變化時，重新設置考勤結果以觸發標籤文字更新
// //     if (clockInResult) {
// //       setClockInResult({ ...clockInResult });
// //     }
// //     if (clockOutResult) {
// //       setClockOutResult({ ...clockOutResult });
// //     }
// //   }, [currentLanguage, clockInResult, clockOutResult]);

// //   // 渲染考勤狀態信息
// //   const renderAttendanceStatus = () => {
// //     if (attendanceStatus && attendanceStatus.is_late && clockInTime !== '--:--') {
// //       return (
// //         <div className="checkin-attendance-status late">
// //           <div className="checkin-status-icon">
// //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M12 6V12L16 14" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             </svg>
// //           </div>
// //           <div className="checkin-status-text">
// //             <span>{t('checkin.lateMinutes').replace('{minutes}', attendanceStatus.late_minutes)}</span>
// //             {attendanceStatus.message && <span className="checkin-status-message">{attendanceStatus.message}</span>}
// //           </div>
// //         </div>
// //       );
// //     } else if (ssidError && clockInTime !== '--:--') {
// //       return (
// //         <div className="checkin-attendance-status ssid-error">
// //           <div className="checkin-status-icon">
// //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M12 8V12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M12 16H12.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             </svg>
// //           </div>
// //           <div className="checkin-status-text">
// //             <span>{t('checkin.nonCompanyNetwork')}</span>
// //             <span className="checkin-status-message">{ssidError}</span>
// //           </div>
// //         </div>
// //       );
// //     } else if (clockOutStatus && clockOutStatus.is_early_leave && clockOutTime !== '--:--') {
// //       return (
// //         <div className="checkin-attendance-status early-leave">
// //           <div className="checkin-status-icon">
// //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M8 12L12 16L16 12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M12 8V16" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             </svg>
// //           </div>
// //           <div className="checkin-status-text">
// //             <span>{t('checkin.earlyLeaveMinutes').replace('{minutes}', clockOutStatus.early_leave_minutes)}</span>
// //             {clockOutStatus.message && <span className="checkin-status-message">{clockOutStatus.message}</span>}
// //           </div>
// //         </div>
// //       );
// //     } else if (clockOutStatus && clockOutStatus.is_overtime && clockOutTime !== '--:--') {
// //       return (
// //         <div className="checkin-attendance-status overtime">
// //           <div className="checkin-status-icon">
// //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M16 12L12 8L8 12" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               <path d="M12 16V8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             </svg>
// //           </div>
// //           <div className="checkin-status-text">
// //             <span>{t('checkin.overtimeMinutes').replace('{minutes}', clockOutStatus.overtime_minutes)}</span>
// //             {clockOutStatus.message && <span className="checkin-status-message">{clockOutStatus.message}</span>}
// //           </div>
// //         </div>
// //       );
// //     } else if (clockInTime !== '--:--' && clockOutTime !== '--:--') {
// //     } 
// //     return null;
// //   };

// //   // 獲取上班打卡狀態標籤 - 使用動態翻譯
// //   const getClockInStatusTag = () => {
// //     if (!clockInResult) return null;
    
// //     return {
// //       tagClass: getTagClassFromResult(clockInResult.tagText),
// //       tagText: getTagTextFromResult(clockInResult.tagText)
// //     };
// //   };

// //   // 獲取下班打卡狀態標籤 - 使用動態翻譯
// //   const getClockOutStatusTag = () => {
// //     if (!clockOutResult) return null;
    
// //     return {
// //       tagClass: getTagClassFromResult(clockOutResult.tagText),
// //       tagText: getTagTextFromResult(clockOutResult.tagText)
// //     };
// //   };

// //   const handleGoHome = () => {
// //     window.location.replace('/frontpagepmx');
// //   };

// //   // 處理查詢考勤
// //   const handleQueryAttendance = () => {
// //     window.location.replace('/attendancepagepmx');
// //   };

// //   return (
// //     <div className="checkin-container" data-language={currentLanguage}>
// //       <div className={`checkin-app-wrapper ${isSmallScreen ? 'small-screen' : ''}`} ref={appWrapperRef}>
// //         <header className="checkin-header">
// //           {/* 使用語言切換組件 - 絕對定位 */}
// //           <LanguageSwitch 
// //             position="absolute"
// //             containerClassName="checkin-language-switch"
// //           />
          
// //           <div className="checkin-home-icon" onClick={handleGoHome}>
// //             <img 
// //               src={homeIcon} 
// //               alt={t('checkin.home')} 
// //               width="22" 
// //               height="22" 
// //               style={{ objectFit: 'contain' }}
// //             />
// //           </div>
// //           <div className="checkin-page-title">{t('checkin.title')}</div>
// //         </header>
        
// //         <div className="checkin-content">
// //           {/* 打卡區塊 */}
// //           <div className="checkin-punch-card">
// //             <div className="checkin-date-status">
// //               <span className="checkin-date">{currentDate} ({dayOfWeek})</span>
// //               <span className="checkin-status">{translatePunchStatus(punchStatus)}</span>
// //             </div>
            
// //             <div className="checkin-time-section">
// //               <div className="checkin-time-header">
// //                 <span>{t('checkin.clockInTime')}</span>
// //                 <span>{t('checkin.clockOutTime')}</span>
// //               </div>
              
// //               <div className="checkin-time-values">
// //                 {/* 上班時間容器，包含時間和考勤標籤（透過API查詢並持續保持） */}
// //                 <div className="checkin-time-container">
// //                   <span className="checkin-time-value">{clockInTime}</span>
// //                   {getClockInStatusTag() && clockInTime !== '--:--' && (
// //                     <span className={`checkin-late-tag ${getClockInStatusTag().tagClass}`}>
// //                       {getClockInStatusTag().tagText}
// //                     </span>
// //                   )}
// //                 </div>
                
// //                 <span className="checkin-time-arrow">
// //                   <svg width="55" height="55" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                     <path d="M9 6L15 12L9 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //                   </svg>
// //                 </span>
                
// //                 {/* 下班時間容器，包含時間和考勤標籤（透過API查詢並持續保持） */}
// //                 <div className="checkin-time-container">
// //                   <span className="checkin-time-value">{clockOutTime}</span>
// //                   {getClockOutStatusTag() && clockOutTime !== '--:--' && (
// //                     <span className={`checkin-late-tag ${getClockOutStatusTag().tagClass}`}>
// //                       {getClockOutStatusTag().tagText}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
            
// //             {/* 渲染考勤狀態信息 */}
// //             {renderAttendanceStatus()}
            
// //             <div className="checkin-button-group">
// //               <button 
// //                 className="checkin-button checkin-clock-in-button"
// //                 onClick={handleClockIn}
// //                 disabled={loading}
// //               >
// //                 {t('checkin.clockIn')}
// //               </button>
// //               <button 
// //                 className={`checkin-button checkin-clock-out-button ${loading ? 'loading' : ''}`}
// //                 onClick={handleClockOut}
// //                 disabled={clockInTime === '--:--' || loading}
// //               >
// //                 {t('checkin.clockOut')}
// //               </button>
// //             </div>
            
// //             {error && <div className="checkin-error-message">{error}</div>}
// //           </div>
// //         </div>

// //         {/* 查詢按鈕 */}
// //         <div className="checkin-query-button" onClick={handleQueryAttendance}>
// //           {t('checkin.queryAttendance')}
// //         </div>

// //         {/* 載入中覆蓋層 */}
// //         {loading && (
// //           <div className="checkin-loading-overlay">
// //             <div className="checkin-loading-container">
// //               <div className="checkin-loading-spinner"></div>
// //               <div>{t('checkin.processing')}</div>
// //             </div>
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   )
// // }

// // export default CheckinPMX;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import './PMX_CSS/CheckinPMX.css';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
// import Cookies from 'js-cookie';
// import { useLanguage } from './Hook/useLanguage'
// import LanguageSwitch from './components/LanguageSwitch';
// import { 
//   validateUserFromCookies, 
//   handleClockIn as handleClockInFunction, 
//   handleClockOut as handleClockOutFunction,
//   fetchAttendanceRecordsFunction,
//   fetchPunchStatusFunction,
//   getTagClassFromResult,
//   getTagTextFromResult,
//   handleApiWithOfflineCache  // 新增這行
// } from './function/function';

// function CheckinPMX() {
//   // 使用語言 Hook - 必須先定義
//   const { currentLanguage, changeLanguage, t } = useLanguage();
  
//   // 所有 useState 定義
//   const [currentTime, setCurrentTime] = useState('--:--');
//   const [currentDate, setCurrentDate] = useState('');
//   const [previousDate, setPreviousDate] = useState('');
//   const [dayOfWeek, setDayOfWeek] = useState('');
//   const [punchStatus, setPunchStatus] = useState('NOT_PUNCHED'); // 使用常數
//   const [clockInTime, setClockInTime] = useState('--:--');
//   const [clockOutTime, setClockOutTime] = useState('--:--');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userLocation, setUserLocation] = useState({
//     latitude: null,
//     longitude: null
//   });
//   const [locationError, setLocationError] = useState(null);
//   const [privateIp, setPrivateIp] = useState('');
//   const [publicIp, setPublicIp] = useState('');
//   const [ipError, setIpError] = useState(null);
//   const [networkInfo, setNetworkInfo] = useState({
//     ssid: '',
//     bssid: '',
//     isWifi: true
//   });
//   const [networkError, setNetworkError] = useState(null);
//   const [scriptUrl, setScriptUrl] = useState('');
//   const [companyId, setCompanyId] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [attendanceStatus, setAttendanceStatus] = useState(null);
//   const [isLate, setIsLate] = useState(false);
//   const [workDuration, setWorkDuration] = useState({ hours: 0, minutes: 0 });
//   const [ssidError, setSsidError] = useState(null);
//   const [clockOutStatus, setClockOutStatus] = useState(null);
//   const [currentEventId, setCurrentEventId] = useState(null);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const appWrapperRef = useRef(null);
//   const [authToken, setAuthToken] = useState('');
  
//   // 考勤結果狀態
//   const [clockInResult, setClockInResult] = useState(null);
//   const [clockOutResult, setClockOutResult] = useState(null);

//   // 從 Flutter 獲取的完整信息狀態
//   const [flutterInfo, setFlutterInfo] = useState({
//     ssid: null,
//     bssid: null,
//     privateIp: null,
//     latitude: null,
//     longitude: null
//   });

//   // 狀態翻譯函數 - 現在可以安全使用 t 函數
//   const translatePunchStatus = useCallback((status) => {
//     switch (status) {
//       case 'NOT_PUNCHED':
//         return t('checkin.notPunched');
//       case 'CLOCKED_IN':
//         return t('checkin.clockedIn');
//       case 'CLOCKED_OUT':
//         return t('checkin.clockedOut');
//       default:
//         // 處理舊的中文狀態
//         if (status === '未打卡' || status === 'Chưa chấm công') {
//           return t('checkin.notPunched');
//         } else if (status === '已上班' || status === 'Đã vào làm') {
//           return t('checkin.clockedIn');
//         } else if (status === '已下班' || status === 'Đã tan làm') {
//           return t('checkin.clockedOut');
//         }
//         return status;
//     }
//   }, [t]);

//   // 格式化星期幾
//   const formatDayOfWeek = useCallback((dayIndex) => {
//     const weekdays = [
//       t('checkin.weekdays.sunday'),
//       t('checkin.weekdays.monday'),
//       t('checkin.weekdays.tuesday'),
//       t('checkin.weekdays.wednesday'),
//       t('checkin.weekdays.thursday'),
//       t('checkin.weekdays.friday'),
//       t('checkin.weekdays.saturday')
//     ];
//     return weekdays[dayIndex];
//   }, [t]);

//   // 修改後的標籤文字轉換函數 - 根據當前語言動態翻譯
//   const getTagTextFromResult = useCallback((result) => {
//     const statusMap = {
//       '準時': t('checkin.tags.ontime'),
//       '遲到': t('checkin.tags.late'),
//       '早退': t('checkin.tags.early'),
//       '曠職': t('attendance.statusTags.absent'),
//       '請假': t('attendance.statusTags.leave'),
//       '異常': t('attendance.statusTags.abnormal'),
//       '未打卡': t('checkin.notPunched'),
//       '已上班': t('checkin.clockedIn'),
//       '已下班': t('checkin.clockedOut'),
//       '加班': t('checkin.tags.overtime'),
//       '滯留': t('checkin.tags.stay'),
//       // 越南文對照
//       'Đúng giờ': t('checkin.tags.ontime'),
//       'Muộn': t('checkin.tags.late'),
//       'Về sớm': t('checkin.tags.early'),
//       'Vắng mặt': t('attendance.statusTags.absent'),
//       'Nghỉ phép': t('attendance.statusTags.leave'),
//       'Bất thường': t('attendance.statusTags.abnormal'),
//       'Chưa chấm công': t('checkin.notPunched'),
//       'Đã vào làm': t('checkin.clockedIn'),
//       'Đã tan làm': t('checkin.clockedOut'),
//       'Tăng ca': t('checkin.tags.overtime'),
//       'Lưu lại': t('checkin.tags.stay')
//     };
    
//     return statusMap[result] || result;
//   }, [t]);

//   // 修改後的標籤樣式函數
//   const getTagClassFromResult = useCallback((result) => {
//     const classMap = {
//       '準時': 'status-ontime',
//       '遲到': 'status-late',
//       '早退': 'status-early',
//       '曠職': 'status-absent',
//       '請假': 'status-leave',
//       '異常': 'status-abnormal',
//       '未打卡': 'status-not-punched',
//       '已上班': 'status-clocked-in',
//       '已下班': 'status-clocked-out',
//       '加班': 'status-overtime',
//       '滯留': 'status-stay',
//       // 越南文對照
//       'Đúng giờ': 'status-ontime',
//       'Muộn': 'status-late',
//       'Về sớm': 'status-early',
//       'Vắng mặt': 'status-absent',
//       'Nghỉ phép': 'status-leave',
//       'Bất thường': 'status-abnormal',
//       'Chưa chấm công': 'status-not-punched',
//       'Đã vào làm': 'status-clocked-in',
//       'Đã tan làm': 'status-clocked-out',
//       'Tăng ca': 'status-overtime',
//       'Lưu lại': 'status-stay'
//     };
    
//     return classMap[result] || 'status-default';
//   }, []);

//   // 當語言改變時，重新翻譯打卡狀態
//   useEffect(() => {
//     if (punchStatus) {
//       // 將現有狀態轉換為常數格式
//       let normalizedStatus = punchStatus;
      
//       if (punchStatus === '未打卡' || punchStatus === 'Chưa chấm công') {
//         normalizedStatus = 'NOT_PUNCHED';
//       } else if (punchStatus === '已上班' || punchStatus === 'Đã vào làm') {
//         normalizedStatus = 'CLOCKED_IN';
//       } else if (punchStatus === '已下班' || punchStatus === 'Đã tan làm') {
//         normalizedStatus = 'CLOCKED_OUT';
//       }
      
//       // 如果狀態發生變化，更新它
//       if (normalizedStatus !== punchStatus) {
//         setPunchStatus(normalizedStatus);
//       }
//     }
//   }, [currentLanguage, punchStatus]);

//   // 使用共用函數驗證用戶
//   useEffect(() => {
//     validateUserFromCookies(
//       setLoading,
//       setAuthToken,
//       setCompanyId,
//       setEmployeeId
//     );
//   }, []);

//   // Checkinfo 函數 - 從 Flutter 獲取完整信息
//   const Checkinfo = useCallback(async () => {
//     try {
//       console.log('開始從 Flutter 獲取完整打卡信息...');
      
//       let info = {
//         ssid: null,
//         bssid: null,
//         privateIp: null,
//         latitude: null,
//         longitude: null
//       };

//       // 嘗試從全局變量獲取位置信息（這些變量由 Flutter 注入）
//       if (window.latitude !== undefined && window.longitude !== undefined) {
//         info.latitude = window.latitude;
//         info.longitude = window.longitude;
//         console.log('從全局變量獲取位置信息:', { 
//           latitude: info.latitude, 
//           longitude: info.longitude 
//         });
//       }
      
//       // 嘗試從全局變量獲取 WiFi 信息
//       if (window.ssid !== undefined && window.bssid !== undefined) {
//         info.ssid = window.ssid;
//         info.bssid = window.bssid;
//         console.log('從全局變量獲取 WiFi 信息:', { 
//           ssid: info.ssid, 
//           bssid: info.bssid 
//         });
//       }
      
//       // 嘗試從全局變量獲取私有 IP
//       if (window.xtbbddtx !== undefined) {
//         info.privateIp = window.xtbbddtx;
//         console.log('從全局變量獲取私有 IP:', info.privateIp);
//       }

//       // 方法1: 嘗試使用 Flutter WebView 通道
//       if (window.flutter) {
//         try {
//           // 獲取位置信息 (經緯度) - 優先使用 getLocation 方法
//           if (typeof window.flutter.getLocation === 'function') {
//             const locationInfo = await window.flutter.getLocation();
//             if (locationInfo) {
//               // 確保經緯度格式正確
//               if (typeof locationInfo.latitude === 'number' && typeof locationInfo.longitude === 'number') {
//                 info.latitude = locationInfo.latitude;
//                 info.longitude = locationInfo.longitude;
//                 console.log('從 Flutter getLocation 獲取位置信息:', { 
//                   latitude: info.latitude, 
//                   longitude: info.longitude 
//                 });
//               } else if (locationInfo.latitude && locationInfo.longitude) {
//                 // 嘗試轉換字符串為數字
//                 info.latitude = parseFloat(locationInfo.latitude);
//                 info.longitude = parseFloat(locationInfo.longitude);
//                 console.log('從 Flutter getLocation 獲取並轉換位置信息:', { 
//                   latitude: info.latitude, 
//                   longitude: info.longitude 
//                 });
//               }
//             }
//           }
          
//           // 獲取 WiFi 信息 - 使用 getWifiInfo 方法
//           if (typeof window.flutter.getWifiInfo === 'function') {
//             const wifiInfo = await window.flutter.getWifiInfo();
//             if (wifiInfo) {
//               info.ssid = wifiInfo.ssid;
//               info.bssid = wifiInfo.bssid;
//               console.log('從 Flutter getWifiInfo 獲取 WiFi 信息:', { 
//                 ssid: info.ssid, 
//                 bssid: info.bssid 
//               });
//             }
//           }
          
//           // 獲取私有 IP - 使用 getxtbbddtx 方法
//           if (typeof window.flutter.getxtbbddtx === 'function') {
//             const privateIp = await window.flutter.getxtbbddtx();
//             if (privateIp) {
//               info.privateIp = privateIp;
//               console.log('從 Flutter getxtbbddtx 獲取私有 IP:', privateIp);
//             }
//           }
          
//           // 獲取完整信息 - 使用 getCheckInfo 方法
//           if (typeof window.flutter.getCheckInfo === 'function') {
//             const checkInfo = await window.flutter.getCheckInfo();
//             if (checkInfo) {
//               // 合併信息，優先使用 getCheckInfo 的結果
//               info = {
//                 ...info,
//                 ...checkInfo,
//                 // 確保經緯度是數字類型
//                 latitude: checkInfo.latitude !== undefined ? parseFloat(checkInfo.latitude) : info.latitude,
//                 longitude: checkInfo.longitude !== undefined ? parseFloat(checkInfo.longitude) : info.longitude
//               };
//               console.log('從 Flutter getCheckInfo 獲取完整信息:', checkInfo);
//             }
//           }
//         } catch (flutterError) {
//           console.error('從 Flutter 獲取信息失敗:', flutterError);
//         }
//       }

//       // 更新狀態
//       setFlutterInfo(info);

//       // 同步更新現有的狀態以保持兼容性
//       if (info.latitude && info.longitude) {
//         setUserLocation({
//           latitude: info.latitude,
//           longitude: info.longitude
//         });
//         setLocationError(null);
//       }
      
//       if (info.ssid && info.bssid) {
//         setNetworkInfo({
//           ssid: info.ssid,
//           bssid: info.bssid,
//           isWifi: info.ssid !== 'Network line'
//         });
//         setNetworkError(null);
//       }
      
//       if (info.privateIp) {
//         setPrivateIp(info.privateIp);
//       }

//       console.log('Checkinfo 完成，獲取到的信息:', info);
//       return info;

//     } catch (error) {
//       console.error('Checkinfo 執行失敗:', error);
//       return {
//         ssid: null,
//         bssid: null,
//         privateIp: null,
//         latitude: null,
//         longitude: null
//       };
//     }
//   }, []);

//   // 獲取完整網路資訊的函數，包含重試機制
//   const getCompleteNetworkInfo = async (maxRetries = 3, retryDelay = 500) => {
//     console.log('開始獲取完整網路資訊，最大重試次數:', maxRetries);
    
//     for (let i = 0; i < maxRetries; i++) {
//       const info = await Checkinfo();
      
//       // 檢查是否已獲取到完整資訊
//       if (info.ssid && info.bssid && info.privateIp) {
//         console.log(`第 ${i+1} 次嘗試獲取到完整網路資訊:`, info);
//         return info;
//       }
      
//       console.log(`第 ${i+1} 次嘗試未獲取到完整網路資訊，等待 ${retryDelay}ms 後重試...`);
//       // 等待一段時間再重試
//       await new Promise(resolve => setTimeout(resolve, retryDelay));
//     }
    
//     // 達到最大重試次數後，返回最後一次獲取的資訊
//     console.log('達到最大重試次數，返回最後一次獲取的資訊');
//     return await Checkinfo();
//   };

//   // 修改後的 updateLocation 函數 - 優先使用 Checkinfo，不使用預設經緯度
//   const updateLocation = async () => {
//     try {
//       // 優先從 Checkinfo 獲取位置
//       const info = await Checkinfo();
//       if (info.latitude && info.longitude) {
//         const location = {
//           latitude: info.latitude,
//           longitude: info.longitude
//         };
//         setUserLocation(location);
//         setLocationError(null);
//         console.log('已從 Checkinfo 更新位置:', location);
//         return location;
//       }

//       // 如果 Checkinfo 沒有位置信息，使用瀏覽器 API 獲取位置
//       console.log('Checkinfo 無位置信息，使用瀏覽器獲取位置');
      
//       return new Promise((resolve, reject) => {
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const updatedLocation = {
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude
//               };
//               setUserLocation(updatedLocation);
//               setLocationError(null);
//               console.log('已從瀏覽器更新位置:', updatedLocation);
//               resolve(updatedLocation);
//             },
//             (error) => {
//               console.error('瀏覽器位置獲取失敗:', error.message);
//               let errorMessage;
//               switch (error.code) {
//                 case error.PERMISSION_DENIED:
//                   errorMessage = t('errors.locationPermissionDenied');
//                   break;
//                 case error.POSITION_UNAVAILABLE:
//                   errorMessage = t('errors.locationUnavailable');
//                   break;
//                 case error.TIMEOUT:
//                   errorMessage = t('errors.locationTimeout');
//                   break;
//                 default:
//                   errorMessage = t('checkin.locationError');
//                   break;
//               }
//               setLocationError(errorMessage);
//               // 如果已有位置信息，則繼續使用
//               if (userLocation.latitude && userLocation.longitude) {
//                 resolve(userLocation);
//               } else {
//                 // 如果沒有位置信息，則拒絕 Promise
//                 reject(new Error(errorMessage));
//               }
//             },
//             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//           );
//         } else {
//           const errorMessage = t('errors.locationUnavailable');
//           console.error('瀏覽器不支持地理位置功能');
//           setLocationError(errorMessage);
//           // 如果已有位置信息，則繼續使用
//           if (userLocation.latitude && userLocation.longitude) {
//             resolve(userLocation);
//           } else {
//             // 如果沒有位置信息，則拒絕 Promise
//             reject(new Error(errorMessage));
//           }
//         }
//       });
//     } catch (error) {
//       console.error('更新位置過程中發生錯誤:', error);
//       // 如果已有位置信息，則繼續使用
//       if (userLocation.latitude && userLocation.longitude) {
//         return userLocation;
//       }
//       // 如果沒有位置信息，則拋出錯誤
//       throw new Error(t('checkin.locationError'));
//     }
//   };

//   // 修改後的 updateNetworkInfo 函數 - 優先使用 Checkinfo
//   const updateNetworkInfo = async () => {
//     try {
//       // 優先從 Checkinfo 獲取網絡信息
//       const info = await Checkinfo();
//       if (info.ssid || info.bssid) {
//         const networkInfo = {
//           ssid: info.ssid || 'UNKNOWN',
//           bssid: info.bssid || 'XX:XX:XX:XX:XX:XX',
//           isWifi: info.ssid !== 'Network line'
//         };
//         console.log('從 Checkinfo 獲取網絡信息:', networkInfo);
//         return networkInfo;
//       }

//       // 如果 Checkinfo 沒有網絡信息，使用現有的網絡獲取邏輯
//       console.log('Checkinfo 無網絡信息，使用現有邏輯');
      
//       // 檢查是否為移動設備
//       const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
//       // 檢查是否支持Network Information API
//       if ('connection' in navigator && navigator.connection) {
//         const connection = navigator.connection;
        
//         // 檢查是否為Wi-Fi連接
//         const isWifiConnection = connection.type === 'wifi';
        
//         // 如果不是Wi-Fi連接，標記為固定網絡
//         if (!isWifiConnection) {
//           console.log('檢測到固定網絡連接');
//           return {
//             ssid: 'Network line',
//             bssid: 'Network line',
//             isWifi: false
//           };
//         }
//       }
      
//       // 其他現有的網絡信息獲取邏輯...
//       if (isMobileDevice) {
//         console.log('移動設備無法獲取Wi-Fi信息，使用默認值');
//         return {
//           ssid: 'UNKNOWN',
//           bssid: 'XX:XX:XX:XX:XX:XX',
//           isWifi: true
//         };
//       } else {
//         console.log('桌面設備，可能使用固定網絡');
//         return {
//           ssid: 'Network line',
//           bssid: 'Network line',
//           isWifi: false
//         };
//       }
//     } catch (err) {
//       console.error('獲取網絡信息失敗:', err);
//       return {
//         ssid: 'UNKNOWN',
//         bssid: 'XX:XX:XX:XX:XX:XX',
//         isWifi: true
//       };
//     }
//   };

//   // 更新localStorage中的考勤結果
//   const updateLocalStorageWithResults = useCallback((clockInResult, clockOutResult) => {
//     try {
//       const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
//       const storedData = localStorage.getItem(storageKey);
      
//       if (storedData) {
//         const punchData = JSON.parse(storedData);
        
//         if (clockInResult) {
//           punchData.clockInResult = clockInResult;
//           console.log('更新localStorage中的上班考勤結果:', clockInResult);
//         }
        
//         if (clockOutResult) {
//           punchData.clockOutResult = clockOutResult;
//           console.log('更新localStorage中的下班考勤結果:', clockOutResult);
//         }
        
//         localStorage.setItem(storageKey, JSON.stringify(punchData));
//         console.log('已更新localStorage中的考勤結果');
//       }
//     } catch (err) {
//       console.error('更新localStorage中的考勤結果失敗:', err);
//     }
//   }, [companyId, employeeId, currentDate]);

//   // 使用新的 API 查詢考勤記錄並更新標籤狀態
//   const fetchAttendanceRecords = useCallback(async () => {
//     const result = await fetchAttendanceRecordsFunction({
//       companyId,
//       employeeId,
//       currentDate,
//       authToken,
//       setClockInTime,
//       setClockOutTime,
//       setPunchStatus: (status) => {
//         // 使用常數而不是硬編碼的中文
//         if (status === '未打卡' || status === 'NOT_PUNCHED') {
//           setPunchStatus('NOT_PUNCHED');
//         } else if (status === '已上班' || status === 'CLOCKED_IN') {
//           setPunchStatus('CLOCKED_IN');
//         } else if (status === '已下班' || status === 'CLOCKED_OUT') {
//           setPunchStatus('CLOCKED_OUT');
//         } else {
//           setPunchStatus(status);
//         }
//       },
//       setCurrentEventId,
//       setClockInResult,
//       setClockOutResult,
//       setIsLate,
//       updateLocalStorageWithResults
//     });
    
//     if (!result.success) {
//       console.error('查詢考勤記錄失敗:', result.message);
//     }
//   }, [companyId, employeeId, currentDate, authToken, updateLocalStorageWithResults]);

//   // 修改後的 fetchPunchStatus 函數
//   const fetchPunchStatus = useCallback(async () => {
//     const result = await fetchPunchStatusFunction({
//       companyId,
//       employeeId,
//       currentDate,
//       clockInTime,
//       setError: (error) => {
//         if (error) {
//           setError(error);
//         }
//       },
//       setClockInTime,
//       setClockOutTime,
//       setPunchStatus: (status) => {
//         // 使用常數而不是硬編碼的中文
//         if (status === '未打卡' || status === 'NOT_PUNCHED') {
//           setPunchStatus('NOT_PUNCHED');
//         } else if (status === '已上班' || status === 'CLOCKED_IN') {
//           setPunchStatus('CLOCKED_IN');
//         } else if (status === '已下班' || status === 'CLOCKED_OUT') {
//           setPunchStatus('CLOCKED_OUT');
//         } else {
//           setPunchStatus(status);
//         }
//       },
//       setAttendanceStatus,
//       setIsLate,
//       setSsidError,
//       setClockOutStatus,
//       setCurrentEventId,
//       setClockInResult,
//       setClockOutResult,
//       setFlutterInfo,
//       fetchAttendanceRecords
//     });
    
//     if (!result.success) {
//       console.error('獲取打卡狀態失敗:', result.message);
//     }
//   }, [companyId, employeeId, currentDate, clockInTime, fetchAttendanceRecords]);

//   // 修改後的 handleClockIn 函數 - 使用離線功能
//   const handleClockIn = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('開始上班打卡流程...');
      
//       // 使用重試機制獲取完整網路資訊
//       console.log('獲取完整網路資訊中...');
//       const completeInfo = await getCompleteNetworkInfo(3, 800);
//       console.log('獲取到的完整網路資訊:', completeInfo);
      
//       // 確保位置資訊有效
//       let location = {
//         latitude: completeInfo.latitude || userLocation.latitude,
//         longitude: completeInfo.longitude || userLocation.longitude
//       };
      
//       // 如果沒有位置資訊，嘗試更新位置
//       if (!location.latitude || !location.longitude) {
//         try {
//           location = await updateLocation();
//           console.log('已更新位置資訊:', location);
//         } catch (locError) {
//           console.error('獲取位置失敗:', locError);
//           setError(t('checkin.clockInFailed') + ': ' + t('checkin.locationError'));
//           return {
//             success: false,
//             message: t('checkin.locationError')
//           };
//         }
//       }
      
//       // 準備網路資訊
//       let networkData = {
//         ssid: completeInfo.ssid || networkInfo.ssid || 'UNKNOWN',
//         bssid: completeInfo.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
//         isWifi: (completeInfo.ssid || networkInfo.ssid) !== 'Network line'
//       };
      
//       // 準備私有 IP
//       let privateIpValue = completeInfo.privateIp || privateIp;
      
//       // 獲取當前時間 - 使用帶時區的 ISO 格式
//       const now = new Date();
      
//       // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
//       const tzOffset = -now.getTimezoneOffset();
//       const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
//       const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
//       const tzSign = tzOffset >= 0 ? '+' : '-';
      
//       const year = now.getFullYear();
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
//       const day = now.getDate().toString().padStart(2, '0');
//       const hours = now.getHours().toString().padStart(2, '0');
//       const minutes = now.getMinutes().toString().padStart(2, '0');
//       const seconds = now.getSeconds().toString().padStart(2, '0');
      
//       const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
//       // 本地時間格式化 - 僅用於顯示
//       const formattedTime = `${hours}:${minutes}:${seconds}`;
//       const formattedDate = `${year}-${month}-${day}`;
//       const timeForDisplay = `${hours}:${minutes}`;
      
//       // 準備網路資訊 - 根據連接類型設置
//       let ssidValue;
//       if (networkData.isWifi) {
//         // 如果是WiFi連接，使用SSID
//         ssidValue = networkData.ssid;
//       } else {
//         // 如果是固定網路，設為Network line
//         ssidValue = 'Network line';
//       }
      
//       // 構建打卡數據
//       const payload = {
//         company_id: companyId,
//         employee_id: employeeId,
//         utc_timestamp: utcTimestamp,
//         ssid: ssidValue,
//         bssid: networkData.bssid,
//         xtbbddtx: privateIpValue || '',
//         public_ip: publicIp || '',
//         longitude: location.longitude,
//         latitude: location.latitude
//       };
      
//       console.log(`發送上班打卡請求:`, JSON.stringify(payload, null, 2));
      
//       // 🔥 使用支援離線的 API 呼叫
//       const apiResult = await handleApiWithOfflineCache(
//         'https://rabbit.54ucl.com:3004/api/check-in-google',
//         payload,
//         {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         }
//       );

//       let responseData;
//       if (apiResult.cached) {
//         // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
//         console.log('上班打卡已快取，等待網路恢復後上傳');
        
//         // 模擬成功回應以繼續 UI 更新
//         responseData = {
//           Status: "Ok",
//           Data: {
//             event_id: null // 離線時沒有 event_id
//           }
//         };
//       } else {
//         // 線上狀態 - 處理正常的 API 回應
//         responseData = apiResult.data;
        
//         if (responseData.Status !== "Ok") {
//           throw new Error(responseData.Msg || t('checkin.clockInFailed'));
//         }
//       }
      
//       console.log('上班打卡成功:', responseData);
      
//       // 獲取事件 ID
//       const eventId = responseData.Data?.event_id || null;
      
//       // 更新UI - 使用常數
//       setClockInTime(timeForDisplay);
//       setPunchStatus('CLOCKED_IN');
//       setClockOutTime('--:--'); // 重置下班時間
//       setClockOutStatus(null); // 重置下班打卡狀態
//       setClockOutResult(null); // 重置下班考勤結果
//       setCurrentEventId(eventId); // 設置當前事件ID
      
//       // 檢查打卡時間是否遲到，並檢查 SSID
//       const attendanceCheckResult = await checkAttendanceStatus(
//         formattedTime,
//         formattedDate,
//         eventId,
//         utcTimestamp
//       );
      
//       console.log('打卡狀態檢查結果:', attendanceCheckResult);
      
//       // 重要：查詢考勤記錄以獲取上班標籤狀態
//       setTimeout(() => {
//         fetchAttendanceRecords();
//       }, 2000);
      
//       // 保存打卡記錄到本地存儲
//       const punchData = {
//         clockInTime: timeForDisplay,
//         clockInFullTime: formattedTime,
//         clockInDate: formattedDate,
//         clockInUtcTimestamp: utcTimestamp,
//         clockOutTime: null,
//         clockOutFullTime: null,
//         clockOutDate: null,
//         clockOutUtcTimestamp: null,
//         eventId: eventId,
//         attendanceStatus: attendanceCheckResult.status === 'success' ? attendanceCheckResult.data : null,
//         clockOutStatus: null,
//         clockInResult: clockInResult,
//         clockOutResult: null,
//         flutterInfo: completeInfo,
//         locationUsed: location
//       };
      
//       localStorage.setItem(`punchData_${companyId}_${employeeId}_${formattedDate}`, JSON.stringify(punchData));
      
//       return {
//         success: true,
//         data: responseData.Data,
//         eventId: eventId,
//         message: t('checkin.clockInSuccess')
//       };
      
//     } catch (err) {
//       console.error('上班打卡失敗:', err);
//       setError(t('checkin.clockInFailed') + ': ' + (err.message || t('errors.networkError')));
      
//       return {
//         success: false,
//         message: err.message || t('checkin.clockInFailed'),
//         error: err
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 修改後的 handleClockOut 函數 - 使用離線功能
//   const handleClockOut = async () => {
//     if (clockInTime === '--:--') {
//       setError(t('checkin.clockInFirst'));
//       return {
//         success: false,
//         message: t('checkin.clockInFirst')
//       };
//     }
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('開始下班打卡流程...');
      
//       // 使用重試機制獲取完整網路資訊
//       console.log('獲取完整網路資訊中...');
//       const completeInfo = await getCompleteNetworkInfo(3, 800);
//       console.log('獲取到的完整網路資訊:', completeInfo);
      
//       // 確保位置資訊有效
//       let location = {
//         latitude: completeInfo.latitude || userLocation.latitude,
//         longitude: completeInfo.longitude || userLocation.longitude
//       };
      
//       // 如果沒有位置資訊，嘗試更新位置
//       if (!location.latitude || !location.longitude) {
//         try {
//           location = await updateLocation();
//           console.log('已更新位置資訊:', location);
//         } catch (locError) {
//           console.error('獲取位置失敗:', locError);
//           setError(t('checkin.clockOutFailed') + ': ' + t('checkin.locationError'));
//           return {
//             success: false,
//             message: t('checkin.locationError')
//           };
//         }
//       }
      
//       // 準備網路資訊
//       let networkData = {
//         ssid: completeInfo.ssid || networkInfo.ssid || 'UNKNOWN',
//         bssid: completeInfo.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
//         isWifi: (completeInfo.ssid || networkInfo.ssid) !== 'Network line'
//       };
      
//       // 準備私有 IP
//       let privateIpValue = completeInfo.privateIp || privateIp;
      
//       // 重新獲取公共 IP 地址 - 確保使用最新的公共 IP
//       let currentPublicIp = publicIp;
//       try {
//         console.log('下班打卡前重新獲取公共 IP...');
        
//         // 嘗試使用多個服務獲取公共 IP
//         // 方法1: 使用 ipify API
//         try {
//           const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (ipifyResponse.ok) {
//             const ipifyData = await ipifyResponse.json();
//             if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
//               currentPublicIp = ipifyData.ip;
//               console.log('下班打卡: 從 ipify 獲取公共 IP:', ipifyData.ip);
//             } else {
//               console.log('下班打卡: ipify 返回伺服器 IP，嘗試其他方法');
//             }
//           }
//         } catch (err) {
//           console.error('下班打卡: 從 ipify 獲取公共 IP 失敗:', err);
//         }
        
//         // 如果 ipify 失敗，嘗試 ipinfo.io
//         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//           try {
//             const ipinfoResponse = await fetch('https://ipinfo.io/json', {
//               cache: 'no-store',
//               headers: {
//                 'Cache-Control': 'no-cache, no-store, must-revalidate',
//                 'Pragma': 'no-cache',
//                 'Expires': '0'
//               }
//             });
            
//             if (ipinfoResponse.ok) {
//               const ipinfoData = await ipinfoResponse.json();
//               if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
//                 currentPublicIp = ipinfoData.ip;
//                 console.log('下班打卡: 從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
//               } else {
//                 console.log('下班打卡: ipinfo.io 返回伺服器 IP，嘗試其他方法');
//               }
//             }
//           } catch (err) {
//             console.error('下班打卡: 從 ipinfo.io 獲取公共 IP 失敗:', err);
//           }
//         }
        
//         // 如果 ipinfo.io 也失敗，嘗試 cloudflare
//         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//           try {
//             const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
//               cache: 'no-store',
//               headers: {
//                 'Cache-Control': 'no-cache, no-store, must-revalidate',
//                 'Pragma': 'no-cache',
//                 'Expires': '0'
//               }
//             });
            
//             if (cfResponse.ok) {
//               const cfText = await cfResponse.text();
//               const ipMatch = cfText.match(/ip=([0-9.]+)/);
//               if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
//                 currentPublicIp = ipMatch[1];
//                 console.log('下班打卡: 從 Cloudflare 獲取公共 IP:', ipMatch[1]);
//               } else {
//                 console.log('下班打卡: Cloudflare 返回伺服器 IP，嘗試其他方法');
//               }
//             }
//           } catch (err) {
//             console.error('下班打卡: 從 Cloudflare 獲取公共 IP 失敗:', err);
//           }
//         }
        
//         // 最後嘗試自定義 API
//         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//           try {
//             const customApiResponse = await fetch('https://rabbit.54ucl.com:3004/api/client-ip', {
//               cache: 'no-store',
//               headers: {
//                 'Cache-Control': 'no-cache, no-store, must-revalidate',
//                 'Pragma': 'no-cache',
//                 'Expires': '0'
//               }
//             });
            
//             if (customApiResponse.ok) {
//               const customApiData = await customApiResponse.json();
//               if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
//                 currentPublicIp = customApiData.ip;
//                 console.log('下班打卡: 從自定義 API 獲取公共 IP:', customApiData.ip);
//               } else {
//                 console.log('下班打卡: 自定義 API 返回伺服器 IP，使用備用方法');
//               }
//             }
//           } catch (err) {
//             console.error('下班打卡: 從自定義 API 獲取公共 IP 失敗:', err);
//           }
//         }
        
//         // 如果所有方法都失敗，使用空字符串
//         if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//           console.log('下班打卡: 所有方法獲取公共 IP 失敗，使用空字符串');
//           currentPublicIp = '';
//         }
        
//       } catch (ipError) {
//         console.error('下班打卡: 獲取公共 IP 過程中發生錯誤:', ipError);
//         currentPublicIp = ''; // 出錯時使用空字符串
//       }
      
//       // 獲取當前時間 - 使用帶時區的 ISO 格式
//       const now = new Date();
      
//       // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
//       const tzOffset = -now.getTimezoneOffset();
//       const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
//       const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
//       const tzSign = tzOffset >= 0 ? '+' : '-';
      
//       const year = now.getFullYear();
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
//       const day = now.getDate().toString().padStart(2, '0');
//       const hours = now.getHours().toString().padStart(2, '0');
//       const minutes = now.getMinutes().toString().padStart(2, '0');
//       const seconds = now.getSeconds().toString().padStart(2, '0');
      
//       const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
//       // 本地時間格式化 - 僅用於顯示
//       const formattedTime = `${hours}:${minutes}:${seconds}`;
//       const formattedDate = `${year}-${month}-${day}`;
//       const timeForDisplay = `${hours}:${minutes}`;
      
//       // 準備網路資訊 - 根據連接類型設置
//       let ssidValue;
//       if (networkData.isWifi) {
//         // 如果是WiFi連接，使用SSID
//         ssidValue = networkData.ssid;
//       } else {
//         // 如果是固定網路，設為Network line
//         ssidValue = 'Network line';
//       }
      
//       // 準備下班原因（如有需要）
//       let reason = '';
      
//       // 檢查是否有 SSID 錯誤，如果有，加入到 reason
//       if (ssidError) {
//         reason = `SSID錯誤: ${ssidError}`;
//       }
      
//       // 構建打卡數據
//       const payload = {
//         company_id: companyId,
//         employee_id: employeeId,
//         utc_timestamp: utcTimestamp,
//         event_id: currentEventId || null, // 使用當前事件ID
//         ssid: ssidValue,
//         bssid: networkData.bssid,
//         xtbbddtx: privateIpValue || '',
//         public_ip: currentPublicIp, // 使用重新獲取的公共 IP
//         longitude: location.longitude,
//         latitude: location.latitude,
//         reason: reason || null // 添加下班原因
//       };
      
//       console.log(`發送下班打卡請求:`, JSON.stringify(payload, null, 2));
      
//       // 🔥 使用支援離線的 API 呼叫
//       const apiResult = await handleApiWithOfflineCache(
//         'https://rabbit.54ucl.com:3004/api/check-out-google',
//         payload,
//         {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         }
//       );

//       let responseData;
//       if (apiResult.cached) {
//         // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
//         console.log('下班打卡已快取，等待網路恢復後上傳');
        
//         // 模擬成功回應以繼續 UI 更新
//         responseData = {
//           Status: "Ok",
//           Data: {}
//         };
//       } else {
//         // 線上狀態 - 處理正常的 API 回應
//         responseData = apiResult.data;
        
//         if (responseData.Status !== "Ok") {
//           throw new Error(responseData.Msg || t('checkin.clockOutFailed'));
//         }
//       }
      
//       console.log('下班打卡成功:', responseData);
      
//       // 更新UI - 使用常數
//       setClockOutTime(timeForDisplay);
//       setPunchStatus('CLOCKED_OUT');
      
//       // 檢查下班打卡狀態
//       const clockOutCheckResult = await checkClockOutStatus(
//         formattedTime,
//         formattedDate,
//         currentEventId,
//         utcTimestamp
//       );
      
//       console.log('下班打卡狀態檢查結果:', clockOutCheckResult);
      
//       // 查詢最新打卡記錄
//       setTimeout(() => {
//         fetchAttendanceRecords();
//       }, 2000);
      
//       // 更新本地存儲中的打卡記錄
//       const storedData = localStorage.getItem(`punchData_${companyId}_${employeeId}_${currentDate}`);
//       let punchData = storedData ? JSON.parse(storedData) : {};
      
//       punchData.clockOutTime = timeForDisplay;
//       punchData.clockOutFullTime = formattedTime;
//       punchData.clockOutDate = formattedDate;
//       punchData.clockOutUtcTimestamp = utcTimestamp;
//       punchData.clockOutReason = reason; // 儲存下班原因
//       punchData.clockOutStatus = clockOutCheckResult.status === 'success' ? clockOutCheckResult.data?.attendance_status : null; // 儲存下班打卡狀態
//       punchData.clockOutResult = clockOutResult; // 保持現有的下班考勤結果
//       // 更新從 Flutter 獲取的信息
//       punchData.flutterInfo = { ...punchData.flutterInfo, ...completeInfo };
//       // 儲存使用的公共 IP
//       punchData.publicIp = currentPublicIp;
//       // 儲存使用的位置信息
//       punchData.locationUsedForClockOut = location;
      
//       localStorage.setItem(`punchData_${companyId}_${employeeId}_${currentDate}`, JSON.stringify(punchData));
      
//       return {
//         success: true,
//         data: responseData.Data,
//         message: t('checkin.clockOutSuccess')
//       };
      
//     } catch (err) {
//       console.error('下班打卡失敗:', err);
//       setError(t('checkin.clockOutFailed') + ': ' + (err.message || t('errors.networkError')));
      
//       return {
//         success: false,
//         message: err.message || t('checkin.clockOutFailed'),
//         error: err
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 檢測螢幕尺寸
//   useEffect(() => {
//     const checkScreenSize = () => {
//       if (appWrapperRef.current) {
//         const width = appWrapperRef.current.offsetWidth;
//         setIsSmallScreen(width < 360);
//       }
//     };
    
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
    
//     return () => {
//       window.removeEventListener('resize', checkScreenSize);
//     };
//   }, []);
  
//   // 初始化時從 Flutter 獲取信息並定期更新
//   useEffect(() => {
//     if (companyId && employeeId) {
//       console.log('開始初始化 Checkinfo...');
      
//       // 立即執行一次獲取資訊
//       Checkinfo();
      
//       // 設置定時器，每 30 秒更新一次網路資訊，確保始終有最新資訊
//       const interval = setInterval(() => {
//         console.log('定期更新網路資訊...');
//         Checkinfo();
//       }, 30000);
      
//       return () => clearInterval(interval);
//     }
//   }, [companyId, employeeId, Checkinfo]);

//   // 獲取用戶位置 - 修改為不使用預設經緯度
//   useEffect(() => {
//     // 如果已經從 Flutter 獲取到位置信息，就不需要再用瀏覽器 API
//     if (flutterInfo.latitude && flutterInfo.longitude) {
//       console.log('已從 Flutter 獲取位置信息，跳過瀏覽器位置獲取');
//       return;
//     }

//     if (navigator.geolocation) {
//       setLocationError(null);
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           });
//           console.log('成功獲取地理位置:', position.coords.latitude, position.coords.longitude);
//         },
//         (error) => {
//           console.error('獲取地理位置失敗:', error.message);
//           let errorMessage;
//           switch (error.code) {
//             case error.PERMISSION_DENIED:
//               errorMessage = t('errors.locationPermissionDenied');
//               break;
//             case error.POSITION_UNAVAILABLE:
//               errorMessage = t('errors.locationUnavailable');
//               break;
//             case error.TIMEOUT:
//               errorMessage = t('errors.locationTimeout');
//               break;
//             default:
//               errorMessage = t('checkin.locationError');
//               break;
//           }
//           setLocationError(errorMessage);
//           // 不再設置預設位置
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     } else {
//       setLocationError(t('errors.locationUnavailable'));
//       // 不再設置預設位置
//     }
//   }, [flutterInfo.latitude, flutterInfo.longitude, t]);

//   // 獲取IP地址 - 修改為使用更可靠的公共 IP 獲取服務
//   useEffect(() => {
//     const getIpAddresses = async () => {
//       try {
//         setIpError(null);
        
//         // 優先使用 Checkinfo 獲取私有 IP
//         const info = await Checkinfo();
//         if (info.privateIp) {
//           setPrivateIp(info.privateIp);
//           console.log('從 Checkinfo 獲取私有 IP:', info.privateIp);
//         } else {
//           // 備用方案：使用 WebRTC 獲取私有 IP
//           console.log('嘗試使用 WebRTC 獲取私有IP作為備用方案');
          
//           const RTCPeerConnection = window.RTCPeerConnection || 
//                                   window.webkitRTCPeerConnection || 
//                                   window.mozRTCPeerConnection;
          
//           if (RTCPeerConnection) {
//             const pc = new RTCPeerConnection({
//               iceServers: []
//             });
            
//             // 非必要，但可以用來觸發ICE候選項收集
//             pc.createDataChannel('');
            
//             // 創建offer並設置本地描述
//             const offer = await pc.createOffer();
//             await pc.setLocalDescription(offer);
            
//             // 監聽ICE候選項事件
//             pc.onicecandidate = (ice) => {
//               if (ice.candidate) {
//                 // 從候選項中提取IP地址
//                 const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
//                 const matches = ipRegex.exec(ice.candidate.candidate);
                
//                 if (matches && matches.length > 1) {
//                   const ip = matches[1];
                  
//                   // 檢查是否為私有IP
//                   if (
//                     ip.startsWith('10.') || 
//                     ip.startsWith('192.168.') || 
//                     ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
//                   ) {
//                     console.log('通過WebRTC獲取到私有IP:', ip);
//                     setPrivateIp(ip);
//                     pc.onicecandidate = null;
//                     pc.close();
//                   }
//                 }
//               }
//             };
            
//           } else {
//             console.log('瀏覽器不支持WebRTC，無法獲取私有IP');
//           }
//         }
        
//         // 使用多個公共 IP 獲取服務，提高可靠性
//         try {
//           // 方法1: 使用 ipify API
//           const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (ipifyResponse.ok) {
//             const ipifyData = await ipifyResponse.json();
//             if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
//               setPublicIp(ipifyData.ip);
//               console.log('從 ipify 獲取公共 IP:', ipifyData.ip);
//               return; // 成功獲取，退出函數
//             } else {
//               console.log('ipify 返回伺服器 IP，嘗試其他方法');
//             }
//           }
//         } catch (err) {
//           console.error('從 ipify 獲取公共 IP 失敗:', err);
//         }
        
//         try {
//           // 方法2: 使用 ipinfo.io API
//           const ipinfoResponse = await fetch('https://ipinfo.io/json', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (ipinfoResponse.ok) {
//             const ipinfoData = await ipinfoResponse.json();
//             if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
//               setPublicIp(ipinfoData.ip);
//               console.log('從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
//               return; // 成功獲取，退出函數
//             } else {
//               console.log('ipinfo.io 返回伺服器 IP，嘗試其他方法');
//             }
//           }
//         } catch (err) {
//           console.error('從 ipinfo.io 獲取公共 IP 失敗:', err);
//         }
        
//         try {
//           // 方法3: 使用 cloudflare API
//           const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (cfResponse.ok) {
//             const cfText = await cfResponse.text();
//             const ipMatch = cfText.match(/ip=([0-9.]+)/);
//             if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
//               setPublicIp(ipMatch[1]);
//               console.log('從 Cloudflare 獲取公共 IP:', ipMatch[1]);
//               return; // 成功獲取，退出函數
//             } else {
//               console.log('Cloudflare 返回伺服器 IP，嘗試其他方法');
//             }
//           }
//         } catch (err) {
//           console.error('從 Cloudflare 獲取公共 IP 失敗:', err);
//         }
        
//         // 方法4: 使用自定義 API 端點
//         try {
//           const customApiResponse = await fetch('https://rabbit.54ucl.com:3004/api/client-ip', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (customApiResponse.ok) {
//             const customApiData = await customApiResponse.json();
//             if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
//               setPublicIp(customApiData.ip);
//               console.log('從自定義 API 獲取公共 IP:', customApiData.ip);
//               return; // 成功獲取，退出函數
//             } else {
//               console.log('自定義 API 返回伺服器 IP，使用備用方法');
//             }
//           }
//         } catch (err) {
//           console.error('從自定義 API 獲取公共 IP 失敗:', err);
//         }
        
//         // 如果所有方法都失敗，使用空字符串而不是伺服器 IP
//         console.log('所有方法獲取公共 IP 失敗，使用空字符串');
//         setPublicIp('');
        
//       } catch (error) {
//         console.error('獲取 IP 地址失敗:', error);
//         setIpError(t('errors.networkError'));
//         setPublicIp(''); // 使用空字符串而不是伺服器 IP
//       }
//     };

//     if (companyId && employeeId) {
//       getIpAddresses();
//     }
//   }, [companyId, employeeId, Checkinfo, t]);

//   // 獲取網絡信息 - 修改為備用方案
//   useEffect(() => {
//     // 如果已經從 Flutter 獲取到網絡信息，就不需要再用其他方法
//     if (flutterInfo.ssid || flutterInfo.bssid) {
//       console.log('已從 Flutter 獲取網絡信息，跳過其他網絡信息獲取');
//       setNetworkInfo({
//         ssid: flutterInfo.ssid || 'UNKNOWN',
//         bssid: flutterInfo.bssid || 'XX:XX:XX:XX:XX:XX',
//         isWifi: flutterInfo.ssid !== 'Network line'
//       });
//       return;
//     }

//     const getNetworkInfo = async () => {
//       try {
//         setNetworkError(null);
        
//         // 檢查是否為移動設備
//         const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
//         // 檢查是否支持Network Information API
//         if ('connection' in navigator && navigator.connection) {
//           const connection = navigator.connection;
//           console.log('連接類型:', connection.type);
//           console.log('有效類型:', connection.effectiveType);
          
//           // 檢查是否為Wi-Fi連接
//           const isWifiConnection = connection.type === 'wifi';
          
//           // 如果不是Wi-Fi連接，標記為固定網絡
//           if (!isWifiConnection) {
//             console.log('檢測到固定網絡連接');
//             setNetworkInfo({
//               ssid: 'Network line',
//               bssid: 'Network line',
//               isWifi: false
//             });
//             return;
//           }
//         }
        
//         // 其他現有的網絡信息獲取邏輯...
//         if (isMobileDevice) {
//           console.log('移動設備無法獲取Wi-Fi信息，使用默認值');
//           setNetworkInfo({
//             ssid: 'UNKNOWN',
//             bssid: 'XX:XX:XX:XX:XX:XX',
//             isWifi: true
//           });
//         } else {
//           // 如果是桌面設備，更可能是固定網絡
//           console.log('桌面設備，可能使用固定網絡');
//           setNetworkInfo({
//             ssid: 'Network line',
//             bssid: 'Network line',
//             isWifi: false
//           });
//         }
        
//       } catch (err) {
//         console.error('獲取網絡信息失敗:', err);
//         setNetworkError(t('errors.networkError'));
//         setNetworkInfo({
//           ssid: 'UNKNOWN',
//           bssid: 'XX:XX:XX:XX:XX:XX',
//           isWifi: true
//         });
//       }
//     };
    
//     getNetworkInfo();
//   }, [flutterInfo.ssid, flutterInfo.bssid, t]);

//   // 計算工作時長
//   const calculateWorkDuration = useCallback(() => {
//     if (clockInTime === '--:--' || !isLate) return;

//     // 從打卡時間獲取小時和分鐘
//     const [hours, minutes] = clockInTime.split(':').map(Number);
//     if (isNaN(hours) || isNaN(minutes)) return;

//     // 獲取當前時間
//     const now = new Date();
//     const currentHours = now.getHours();
//     const currentMinutes = now.getMinutes();

//     // 計算工作時長（小時和分鐘）
//     let durationMinutes = (currentHours - hours) * 60 + (currentMinutes - minutes);
    
//     // 如果是負數（可能是跨天的情況），加上24小時
//     if (durationMinutes < 0) {
//       durationMinutes += 24 * 60;
//     }

//     const durationHours = Math.floor(durationMinutes / 60);
//     const remainingMinutes = durationMinutes % 60;

//     setWorkDuration({
//       hours: durationHours,
//       minutes: remainingMinutes
//     });
//   }, [clockInTime, isLate]);

//   // 定期更新工作時長
//   useEffect(() => {
//     if (isLate && clockInTime !== '--:--') {
//       calculateWorkDuration();
//       const interval = setInterval(calculateWorkDuration, 60000); // 每分鐘更新一次
//       return () => clearInterval(interval);
//     }
//   }, [isLate, clockInTime, calculateWorkDuration]);

//   // 查詢最新打卡記錄並獲取 event_id
//   const fetchLatestCheckRecord = useCallback(async () => {
//     if (!companyId || !employeeId) {
//       console.log('缺少查詢打卡記錄的必要參數');
//       return null;
//     }

//     try {
//       console.log('開始查詢最新打卡記錄...');
      
//       // 獲取當前日期
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
//       const day = now.getDate().toString().padStart(2, '0');
//       const today = `${year}-${month}-${day}`;
      
//       // 使用 API 查詢打卡記錄，添加 auth_xtbb token
//       const response = await fetch(`https://rabbit.54ucl.com:3004/api/check-records?company_id=${companyId}&employee_id=${employeeId}&start_date=${today}&end_date=${today}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`API 回應錯誤: ${response.status}`);
//       }
      
//       const responseData = await response.json();
      
//       if (responseData.Status === "Ok" && responseData.Data.records.length > 0) {
//         // 獲取最新的打卡記錄（第一筆）
//         const latestRecord = responseData.Data.records[0];
//         console.log('最新打卡記錄:', latestRecord);
//         return latestRecord;
//       } else {
//         console.log('沒有找到打卡記錄或查詢失敗:', responseData.Msg);
//         return null;
//       }
//     } catch (err) {
//       console.error('查詢最新打卡記錄失敗:', err);
//       return null;
//     }
//   }, [companyId, employeeId, authToken]);

//   // 檢查考勤狀態
//   const checkAttendanceStatus = async (time, date, eventId, utcTimestamp) => {
//     try {
//       console.log('開始檢查考勤狀態...');
//       console.log('- 時間:', time);
//       console.log('- 日期:', date);
//       console.log('- 事件ID:', eventId);
//       console.log('- UTC時間戳:', utcTimestamp);
      
//       // 使用 API 檢查考勤狀態，添加 auth_xtbb token
//       const response = await fetch('https://rabbit.54ucl.com:3004/api/check-attendance-status', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
//         },
//         body: JSON.stringify({
//           company_id: companyId,
//           employee_id: employeeId,
//           time: time,
//           date: date,
//           event_id: eventId,
//           utc_timestamp: utcTimestamp,
//           ssid: networkInfo.ssid
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`API 回應錯誤: ${response.status}`);
//       }
      
//       const responseData = await response.json();
//       console.log('考勤狀態檢查結果:', responseData);
      
//       if (responseData.Status === "Ok") {
//         // 檢查是否有 SSID 錯誤
//         if (responseData.Data.message && responseData.Data.message.includes('使用非公司網路')) {
//           const ssidErrorMsg = responseData.Data.message.split('；')[1] || responseData.Data.message;
//           setSsidError(ssidErrorMsg);
//         }
        
//         return {
//           status: 'success',
//           data: responseData.Data
//         };
//       } else {
//         return {
//           status: 'error',
//           message: responseData.Msg || '檢查考勤狀態失敗'
//         };
//       }
//     } catch (err) {
//       console.error('檢查考勤狀態失敗:', err);
//       return {
//         status: 'error',
//         message: err.message
//       };
//     }
//   };

//   // 檢查下班打卡狀態
//   const checkClockOutStatus = async (time, date, eventId, utcTimestamp) => {
//     try {
//       console.log('開始檢查下班打卡狀態...');
//       console.log('- 時間:', time);
//       console.log('- 日期:', date);
//       console.log('- 事件ID:', eventId);
//       console.log('- UTC時間戳:', utcTimestamp);
      
//       // 使用 API 檢查下班打卡狀態，添加 auth_xtbb token
//       const response = await fetch('https://rabbit.54ucl.com:3004/api/check-clock-out-status', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
//         },
//         body: JSON.stringify({
//           company_id: companyId,
//           employee_id: employeeId,
//           time: time,
//           date: date,
//           event_id: eventId,
//           utc_timestamp: utcTimestamp
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`API 回應錯誤: ${response.status}`);
//       }
      
//       const responseData = await response.json();
//       console.log('下班打卡狀態檢查結果:', responseData);
      
//       if (responseData.Status === "Ok") {
//         return {
//           status: 'success',
//           data: responseData.Data
//         };
//       } else {
//         return {
//           status: 'error',
//           message: responseData.Msg || '檢查下班打卡狀態失敗'
//         };
//       }
//     } catch (err) {
//       console.error('檢查下班打卡狀態失敗:', err);
//       return {
//         status: 'error',
//         message: err.message
//       };
//     }
//   };

//   // 獲取當前日期和時間，並檢測日期變化
//   useEffect(() => {
//     const updateDateTime = () => {
//       const now = new Date();
      
//       // 格式化時間為 HH:MM
//       const hours = now.getHours().toString().padStart(2, '0');
//       const minutes = now.getMinutes().toString().padStart(2, '0');
//       setCurrentTime(`${hours}:${minutes}`);
      
//       // 格式化日期為 YYYY-MM-DD
//       const year = now.getFullYear();
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
//       const day = now.getDate().toString().padStart(2, '0');
//       const formattedDate = `${year}-${month}-${day}`;
      
//       // 檢查日期是否變化（過了凌晨12點）
//       if (previousDate && previousDate !== formattedDate) {
//         console.log('檢測到日期變化，從', previousDate, '到', formattedDate);
//         console.log('自動刷新頁面以獲取新的打卡記錄...');
        
//         // 重置打卡狀態
//         setClockInTime('--:--');
//         setClockOutTime('--:--');
//         setPunchStatus('NOT_PUNCHED');
//         setClockInResult(null);
//         setClockOutResult(null);
        
//         // 重新獲取打卡記錄
//         if (companyId && employeeId) {
//           fetchPunchStatus();
//         }
//       }
      
//       // 更新當前日期和前一天日期
//       setCurrentDate(formattedDate);
//       setPreviousDate(formattedDate);
      
//       // 獲取星期幾
//       const dayOfWeekIndex = now.getDay();
//       setDayOfWeek(formatDayOfWeek(dayOfWeekIndex));
//     };
    
//     updateDateTime();
    
//     // 設置定時器，每分鐘更新一次時間和日期
//     const interval = setInterval(updateDateTime, 60000);
    
//     // 設置一個定時器，每分鐘檢查是否為台灣時間凌晨 00:00，如果是則刷新頁面資訊
//     const midnightRefreshInterval = setInterval(() => {
//       const now = new Date();
//       const taiwanHours = now.getHours();
//       const taiwanMinutes = now.getMinutes();
      
//       // 如果是台灣時間凌晨 00:00
//       if (taiwanHours === 0 && taiwanMinutes === 0) {
//         console.log('台灣時間凌晨 00:00，執行頁面資訊刷新...');
        
//         // 重置打卡狀態
//         setClockInTime('--:--');
//         setClockOutTime('--:--');
//         setPunchStatus('NOT_PUNCHED');
//         setClockInResult(null);
//         setClockOutResult(null);
        
//         // 重新獲取打卡記錄
//         if (companyId && employeeId) {
//           fetchPunchStatus();
//         }
//       }
//     }, 60000); // 每分鐘檢查一次
    
//     return () => {
//       clearInterval(interval);
//       clearInterval(midnightRefreshInterval);
//     };
//   }, [companyId, employeeId, fetchPunchStatus, previousDate, formatDayOfWeek, t]);

//   // 在認證完成後獲取打卡狀態
//   useEffect(() => {
//     if (companyId && employeeId && currentDate) {
//       fetchPunchStatus();
//     }
//   }, [companyId, employeeId, currentDate, fetchPunchStatus]);

//   // 新增處理 Flutter 傳回的快取請求
//   useEffect(() => {
//     // 定義全域函數讓 Flutter 呼叫
//     window.processCachedRequest = async (dbId, requestPacket) => {
//       console.log("收到 Flutter 歸還的暫存資料，準備上傳:", requestPacket);

//       try {
//         // 這裡才真正執行 API Call（使用 Web 原有的 fetch）
//         const response = await fetch(requestPacket.url, {
//           method: requestPacket.method,
//           headers: requestPacket.headers,
//           body: JSON.stringify(requestPacket.body)
//         });

//         if (!response.ok) {
//           throw new Error(`API 請求失敗: ${response.status}`);
//         }

//         const responseData = await response.json();
        
//         if (responseData.Status === "Ok") {
//           console.log("快取請求上傳成功:", responseData);
          
//           // 成功後，通知 Flutter 刪除該筆 SQLite 資料
//           if (window.FlutterBridge) {
//             window.FlutterBridge.postMessage(JSON.stringify({
//               action: 'REQUEST_PROCESSED',
//               id: dbId // 告訴 Flutter 哪一筆處理完了
//             }));
//           }
          
//           // 根據請求類型更新相關狀態
//           if (requestPacket.url.includes('check-in-google')) {
//             console.log('快取的上班打卡請求已成功處理');
            
//             // 如果有 event_id，更新到狀態中
//             if (responseData.Data?.event_id) {
//               setCurrentEventId(responseData.Data.event_id);
//             }
            
//             // 靜默更新考勤記錄
//             setTimeout(() => {
//               fetchAttendanceRecords();
//             }, 1000);
            
//           } else if (requestPacket.url.includes('check-out-google')) {
//             console.log('快取的下班打卡請求已成功處理');
            
//             // 靜默更新考勤記錄
//             setTimeout(() => {
//               fetchAttendanceRecords();
//             }, 1000);
//           }
          
//           console.log("上傳成功，已通知 Flutter 清除快取");

//         } else {
//           throw new Error(responseData.Msg || '處理快取請求失敗');
//         }

//       } catch (error) {
//         console.error("快取請求上傳失敗，稍後再試", error);
//         // 失敗就不通知刪除，讓 Flutter 下次連線再丟一次
//       }
//     };

//     // 清理函數
//     return () => {
//       if (window.processCachedRequest) {
//         delete window.processCachedRequest;
//       }
//     };
//   }, [fetchAttendanceRecords, setCurrentEventId]);

//   // 語言變化時更新標籤文字
//   useEffect(() => {
//     // 當語言變化時，重新設置考勤結果以觸發標籤文字更新
//     if (clockInResult) {
//       setClockInResult({ ...clockInResult });
//     }
//     if (clockOutResult) {
//       setClockOutResult({ ...clockOutResult });
//     }
//   }, [currentLanguage, clockInResult, clockOutResult]);

//   // 渲染考勤狀態信息
//   const renderAttendanceStatus = () => {
//     if (attendanceStatus && attendanceStatus.is_late && clockInTime !== '--:--') {
//       return (
//         <div className="checkin-attendance-status late">
//           <div className="checkin-status-icon">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 6V12L16 14" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="checkin-status-text">
//             <span>{t('checkin.lateMinutes').replace('{minutes}', attendanceStatus.late_minutes)}</span>
//             {attendanceStatus.message && <span className="checkin-status-message">{attendanceStatus.message}</span>}
//           </div>
//         </div>
//       );
//     } else if (ssidError && clockInTime !== '--:--') {
//       return (
//         <div className="checkin-attendance-status ssid-error">
//           <div className="checkin-status-icon">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 8V12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 16H12.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="checkin-status-text">
//             <span>{t('checkin.nonCompanyNetwork')}</span>
//             <span className="checkin-status-message">{ssidError}</span>
//           </div>
//         </div>
//       );
//     } else if (clockOutStatus && clockOutStatus.is_early_leave && clockOutTime !== '--:--') {
//       return (
//         <div className="checkin-attendance-status early-leave">
//           <div className="checkin-status-icon">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M8 12L12 16L16 12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 8V16" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="checkin-status-text">
//             <span>{t('checkin.earlyLeaveMinutes').replace('{minutes}', clockOutStatus.early_leave_minutes)}</span>
//             {clockOutStatus.message && <span className="checkin-status-message">{clockOutStatus.message}</span>}
//           </div>
//         </div>
//       );
//     } else if (clockOutStatus && clockOutStatus.is_overtime && clockOutTime !== '--:--') {
//       return (
//         <div className="checkin-attendance-status overtime">
//           <div className="checkin-status-icon">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M16 12L12 8L8 12" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 16V8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="checkin-status-text">
//             <span>{t('checkin.overtimeMinutes').replace('{minutes}', clockOutStatus.overtime_minutes)}</span>
//             {clockOutStatus.message && <span className="checkin-status-message">{clockOutStatus.message}</span>}
//           </div>
//         </div>
//       );
//     } else if (clockInTime !== '--:--' && clockOutTime !== '--:--') {
//     } 
//     return null;
//   };

//   // 獲取上班打卡狀態標籤 - 使用動態翻譯
//   const getClockInStatusTag = () => {
//     if (!clockInResult) return null;
    
//     return {
//       tagClass: getTagClassFromResult(clockInResult.tagText),
//       tagText: getTagTextFromResult(clockInResult.tagText)
//     };
//   };

//   // 獲取下班打卡狀態標籤 - 使用動態翻譯
//   const getClockOutStatusTag = () => {
//     if (!clockOutResult) return null;
    
//     return {
//       tagClass: getTagClassFromResult(clockOutResult.tagText),
//       tagText: getTagTextFromResult(clockOutResult.tagText)
//     };
//   };

//   const handleGoHome = () => {
//     window.location.replace('/frontpagepmx');
//   };

//   // 處理查詢考勤
//   const handleQueryAttendance = () => {
//     window.location.replace('/attendancepagepmx');
//   };

//   return (
//     <div className="checkin-container" data-language={currentLanguage}>
//       <div className={`checkin-app-wrapper ${isSmallScreen ? 'small-screen' : ''}`} ref={appWrapperRef}>
//         <header className="checkin-header">
//           {/* 使用語言切換組件 - 絕對定位 */}
//           <LanguageSwitch 
//             position="absolute"
//             containerClassName="checkin-language-switch"
//           />
          
//           <div className="checkin-home-icon" onClick={handleGoHome}>
//             <img 
//               src={homeIcon} 
//               alt={t('checkin.home')} 
//               width="22" 
//               height="22" 
//               style={{ objectFit: 'contain' }}
//             />
//           </div>
//           <div className="checkin-page-title">{t('checkin.title')}</div>
//         </header>
        
//         <div className="checkin-content">
//           {/* 打卡區塊 */}
//           <div className="checkin-punch-card">
//             <div className="checkin-date-status">
//               <span className="checkin-date">{currentDate} ({dayOfWeek})</span>
//               <span className="checkin-status">{translatePunchStatus(punchStatus)}</span>
//             </div>
            
//             <div className="checkin-time-section">
//               <div className="checkin-time-header">
//                 <span>{t('checkin.clockInTime')}</span>
//                 <span>{t('checkin.clockOutTime')}</span>
//               </div>
              
//               <div className="checkin-time-values">
//                 {/* 上班時間容器，包含時間和考勤標籤（透過API查詢並持續保持） */}
//                 <div className="checkin-time-container">
//                   <span className="checkin-time-value">{clockInTime}</span>
//                   {getClockInStatusTag() && clockInTime !== '--:--' && (
//                     <span className={`checkin-late-tag ${getClockInStatusTag().tagClass}`}>
//                       {getClockInStatusTag().tagText}
//                     </span>
//                   )}
//                 </div>
                
//                 <span className="checkin-time-arrow">
//                   <svg width="55" height="55" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M9 6L15 12L9 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </span>
                
//                 {/* 下班時間容器，包含時間和考勤標籤（透過API查詢並持續保持） */}
//                 <div className="checkin-time-container">
//                   <span className="checkin-time-value">{clockOutTime}</span>
//                   {getClockOutStatusTag() && clockOutTime !== '--:--' && (
//                     <span className={`checkin-late-tag ${getClockOutStatusTag().tagClass}`}>
//                       {getClockOutStatusTag().tagText}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             {/* 渲染考勤狀態信息 */}
//             {renderAttendanceStatus()}
            
//             <div className="checkin-button-group">
//               <button 
//                 className="checkin-button checkin-clock-in-button"
//                 onClick={handleClockIn}
//                 disabled={loading}
//               >
//                 {t('checkin.clockIn')}
//               </button>
//               <button 
//                 className={`checkin-button checkin-clock-out-button ${loading ? 'loading' : ''}`}
//                 onClick={handleClockOut}
//                 disabled={clockInTime === '--:--' || loading}
//               >
//                 {t('checkin.clockOut')}
//               </button>
//             </div>
            
//             {error && <div className="checkin-error-message">{error}</div>}
//           </div>
//         </div>

//         {/* 查詢按鈕 */}
//         <div className="checkin-query-button" onClick={handleQueryAttendance}>
//           {t('checkin.queryAttendance')}
//         </div>

//         {/* 載入中覆蓋層 */}
//         {loading && (
//           <div className="checkin-loading-overlay">
//             <div className="checkin-loading-container">
//               <div className="checkin-loading-spinner"></div>
//               <div>{t('checkin.processing')}</div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   )
// }

// export default CheckinPMX;
              
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PMX_CSS/CheckinPMX.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import Cookies from 'js-cookie';
import { useLanguage } from './Hook/useLanguage'
import LanguageSwitch from './components/LanguageSwitch';
import { 
  validateUserFromCookies, 
  handleClockIn as handleClockInFunction, 
  handleClockOut as handleClockOutFunction,
  fetchAttendanceRecordsFunction,
  fetchPunchStatusFunction,
  getTagClassFromResult,
  getTagTextFromResult,
  handleApiWithOfflineCache  // 新增這行
} from './function/function';
import { API_BASE_URL } from '../config'; // 引入 API_BASE_URL

function CheckinPMX() {
  // 使用語言 Hook - 必須先定義
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  // 所有 useState 定義
  const [currentTime, setCurrentTime] = useState('--:--');
  const [currentDate, setCurrentDate] = useState('');
  const [previousDate, setPreviousDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [punchStatus, setPunchStatus] = useState('NOT_PUNCHED'); // 使用常數
  const [clockInTime, setClockInTime] = useState('--:--');
  const [clockOutTime, setClockOutTime] = useState('--:--');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null
  });
  const [locationError, setLocationError] = useState(null);
  const [privateIp, setPrivateIp] = useState('');
  const [publicIp, setPublicIp] = useState('');
  const [ipError, setIpError] = useState(null);
  const [networkInfo, setNetworkInfo] = useState({
    ssid: '',
    bssid: '',
    isWifi: true
  });
  const [networkError, setNetworkError] = useState(null);
  const [scriptUrl, setScriptUrl] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isLate, setIsLate] = useState(false);
  const [workDuration, setWorkDuration] = useState({ hours: 0, minutes: 0 });
  const [ssidError, setSsidError] = useState(null);
  const [clockOutStatus, setClockOutStatus] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const appWrapperRef = useRef(null);
  const [authToken, setAuthToken] = useState('');
  
  // 考勤結果狀態
  const [clockInResult, setClockInResult] = useState(null);
  const [clockOutResult, setClockOutResult] = useState(null);

  // 從 Flutter 獲取的完整信息狀態
  const [flutterInfo, setFlutterInfo] = useState({
    ssid: null,
    bssid: null,
    privateIp: null,
    latitude: null,
    longitude: null
  });

  // 狀態翻譯函數 - 現在可以安全使用 t 函數
  const translatePunchStatus = useCallback((status) => {
    switch (status) {
      case 'NOT_PUNCHED':
        return t('checkin.notPunched');
      case 'CLOCKED_IN':
        return t('checkin.clockedIn');
      case 'CLOCKED_OUT':
        return t('checkin.clockedOut');
      default:
        // 處理舊的中文狀態
        if (status === '未打卡' || status === 'Chưa chấm công') {
          return t('checkin.notPunched');
        } else if (status === '已上班' || status === 'Đã vào làm') {
          return t('checkin.clockedIn');
        } else if (status === '已下班' || status === 'Đã tan làm') {
          return t('checkin.clockedOut');
        }
        return status;
    }
  }, [t]);

  // 格式化星期幾
  const formatDayOfWeek = useCallback((dayIndex) => {
    const weekdays = [
      t('checkin.weekdays.sunday'),
      t('checkin.weekdays.monday'),
      t('checkin.weekdays.tuesday'),
      t('checkin.weekdays.wednesday'),
      t('checkin.weekdays.thursday'),
      t('checkin.weekdays.friday'),
      t('checkin.weekdays.saturday')
    ];
    return weekdays[dayIndex];
  }, [t]);

  // 修改後的標籤文字轉換函數 - 根據當前語言動態翻譯
  const getTagTextFromResult = useCallback((result) => {
    const statusMap = {
      '準時': t('checkin.tags.ontime'),
      '遲到': t('checkin.tags.late'),
      '早退': t('checkin.tags.early'),
      '曠職': t('attendance.statusTags.absent'),
      '請假': t('attendance.statusTags.leave'),
      '異常': t('attendance.statusTags.abnormal'),
      '未打卡': t('checkin.notPunched'),
      '已上班': t('checkin.clockedIn'),
      '已下班': t('checkin.clockedOut'),
      '加班': t('checkin.tags.overtime'),
      '滯留': t('checkin.tags.stay'),
      // 越南文對照
      'Đúng giờ': t('checkin.tags.ontime'),
      'Muộn': t('checkin.tags.late'),
      'Về sớm': t('checkin.tags.early'),
      'Vắng mặt': t('attendance.statusTags.absent'),
      'Nghỉ phép': t('attendance.statusTags.leave'),
      'Bất thường': t('attendance.statusTags.abnormal'),
      'Chưa chấm công': t('checkin.notPunched'),
      'Đã vào làm': t('checkin.clockedIn'),
      'Đã tan làm': t('checkin.clockedOut'),
      'Tăng ca': t('checkin.tags.overtime'),
      'Lưu lại': t('checkin.tags.stay')
    };
    
    return statusMap[result] || result;
  }, [t]);

  // 修改後的標籤樣式函數
  const getTagClassFromResult = useCallback((result) => {
    const classMap = {
      '準時': 'status-ontime',
      '遲到': 'status-late',
      '早退': 'status-early',
      '曠職': 'status-absent',
      '請假': 'status-leave',
      '異常': 'status-abnormal',
      '未打卡': 'status-not-punched',
      '已上班': 'status-clocked-in',
      '已下班': 'status-clocked-out',
      '加班': 'status-overtime',
      '滯留': 'status-stay',
      // 越南文對照
      'Đúng giờ': 'status-ontime',
      'Muộn': 'status-late',
      'Về sớm': 'status-early',
      'Vắng mặt': 'status-absent',
      'Nghỉ phép': 'status-leave',
      'Bất thường': 'status-abnormal',
      'Chưa chấm công': 'status-not-punched',
      'Đã vào làm': 'status-clocked-in',
      'Đã tan làm': 'status-clocked-out',
      'Tăng ca': 'status-overtime',
      'Lưu lại': 'status-stay'
    };
    
    return classMap[result] || 'status-default';
  }, []);

  // 當語言改變時，重新翻譯打卡狀態
  useEffect(() => {
    if (punchStatus) {
      // 將現有狀態轉換為常數格式
      let normalizedStatus = punchStatus;
      
      if (punchStatus === '未打卡' || punchStatus === 'Chưa chấm công') {
        normalizedStatus = 'NOT_PUNCHED';
      } else if (punchStatus === '已上班' || punchStatus === 'Đã vào làm') {
        normalizedStatus = 'CLOCKED_IN';
      } else if (punchStatus === '已下班' || punchStatus === 'Đã tan làm') {
        normalizedStatus = 'CLOCKED_OUT';
      }
      
      // 如果狀態發生變化，更新它
      if (normalizedStatus !== punchStatus) {
        setPunchStatus(normalizedStatus);
      }
    }
  }, [currentLanguage, punchStatus]);

  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

  // Checkinfo 函數 - 從 Flutter 獲取完整信息
  const Checkinfo = useCallback(async () => {
    try {
      console.log('開始從 Flutter 獲取完整打卡信息...');
      
      let info = {
        ssid: null,
        bssid: null,
        privateIp: null,
        latitude: null,
        longitude: null
      };

      // 嘗試從全局變量獲取位置信息（這些變量由 Flutter 注入）
      if (window.latitude !== undefined && window.longitude !== undefined) {
        info.latitude = window.latitude;
        info.longitude = window.longitude;
        console.log('從全局變量獲取位置信息:', { 
          latitude: info.latitude, 
          longitude: info.longitude 
        });
      }
      
      // 嘗試從全局變量獲取 WiFi 信息
      if (window.ssid !== undefined && window.bssid !== undefined) {
        info.ssid = window.ssid;
        info.bssid = window.bssid;
        console.log('從全局變量獲取 WiFi 信息:', { 
          ssid: info.ssid, 
          bssid: info.bssid 
        });
      }
      
      // 嘗試從全局變量獲取私有 IP
      if (window.xtbbddtx !== undefined) {
        info.privateIp = window.xtbbddtx;
        console.log('從全局變量獲取私有 IP:', info.privateIp);
      }

      // 方法1: 嘗試使用 Flutter WebView 通道
      if (window.flutter) {
        try {
          // 獲取位置信息 (經緯度) - 優先使用 getLocation 方法
          if (typeof window.flutter.getLocation === 'function') {
            const locationInfo = await window.flutter.getLocation();
            if (locationInfo) {
              // 確保經緯度格式正確
              if (typeof locationInfo.latitude === 'number' && typeof locationInfo.longitude === 'number') {
                info.latitude = locationInfo.latitude;
                info.longitude = locationInfo.longitude;
                console.log('從 Flutter getLocation 獲取位置信息:', { 
                  latitude: info.latitude, 
                  longitude: info.longitude 
                });
              } else if (locationInfo.latitude && locationInfo.longitude) {
                // 嘗試轉換字符串為數字
                info.latitude = parseFloat(locationInfo.latitude);
                info.longitude = parseFloat(locationInfo.longitude);
                console.log('從 Flutter getLocation 獲取並轉換位置信息:', { 
                  latitude: info.latitude, 
                  longitude: info.longitude 
                });
              }
            }
          }
          
          // 獲取 WiFi 信息 - 使用 getWifiInfo 方法
          if (typeof window.flutter.getWifiInfo === 'function') {
            const wifiInfo = await window.flutter.getWifiInfo();
            if (wifiInfo) {
              info.ssid = wifiInfo.ssid;
              info.bssid = wifiInfo.bssid;
              console.log('從 Flutter getWifiInfo 獲取 WiFi 信息:', { 
                ssid: info.ssid, 
                bssid: info.bssid 
              });
            }
          }
          
          // 獲取私有 IP - 使用 getxtbbddtx 方法
          if (typeof window.flutter.getxtbbddtx === 'function') {
            const privateIp = await window.flutter.getxtbbddtx();
            if (privateIp) {
              info.privateIp = privateIp;
              console.log('從 Flutter getxtbbddtx 獲取私有 IP:', privateIp);
            }
          }
          
          // 獲取完整信息 - 使用 getCheckInfo 方法
          if (typeof window.flutter.getCheckInfo === 'function') {
            const checkInfo = await window.flutter.getCheckInfo();
            if (checkInfo) {
              // 合併信息，優先使用 getCheckInfo 的結果
              info = {
                ...info,
                ...checkInfo,
                // 確保經緯度是數字類型
                latitude: checkInfo.latitude !== undefined ? parseFloat(checkInfo.latitude) : info.latitude,
                longitude: checkInfo.longitude !== undefined ? parseFloat(checkInfo.longitude) : info.longitude
              };
              console.log('從 Flutter getCheckInfo 獲取完整信息:', checkInfo);
            }
          }
        } catch (flutterError) {
          console.error('從 Flutter 獲取信息失敗:', flutterError);
        }
      }

      // 更新狀態
      setFlutterInfo(info);

      // 同步更新現有的狀態以保持兼容性
      if (info.latitude && info.longitude) {
        setUserLocation({
          latitude: info.latitude,
          longitude: info.longitude
        });
        setLocationError(null);
      }
      
      if (info.ssid && info.bssid) {
        setNetworkInfo({
          ssid: info.ssid,
          bssid: info.bssid,
          isWifi: info.ssid !== 'Network line'
        });
        setNetworkError(null);
      }
      
      if (info.privateIp) {
        setPrivateIp(info.privateIp);
      }

      console.log('Checkinfo 完成，獲取到的信息:', info);
      return info;

    } catch (error) {
      console.error('Checkinfo 執行失敗:', error);
      return {
        ssid: null,
        bssid: null,
        privateIp: null,
        latitude: null,
        longitude: null
      };
    }
  }, []);

  // 獲取完整網路資訊的函數，包含重試機制
  const getCompleteNetworkInfo = async (maxRetries = 3, retryDelay = 500) => {
    console.log('開始獲取完整網路資訊，最大重試次數:', maxRetries);
    
    for (let i = 0; i < maxRetries; i++) {
      const info = await Checkinfo();
      
      // 檢查是否已獲取到完整資訊
      if (info.ssid && info.bssid && info.privateIp) {
        console.log(`第 ${i+1} 次嘗試獲取到完整網路資訊:`, info);
        return info;
      }
      
      console.log(`第 ${i+1} 次嘗試未獲取到完整網路資訊，等待 ${retryDelay}ms 後重試...`);
      // 等待一段時間再重試
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    
    // 達到最大重試次數後，返回最後一次獲取的資訊
    console.log('達到最大重試次數，返回最後一次獲取的資訊');
    return await Checkinfo();
  };

  // 修改後的 updateLocation 函數 - 優先使用 Checkinfo，不使用預設經緯度
  const updateLocation = async () => {
    try {
      // 優先從 Checkinfo 獲取位置
      const info = await Checkinfo();
      if (info.latitude && info.longitude) {
        const location = {
          latitude: info.latitude,
          longitude: info.longitude
        };
        setUserLocation(location);
        setLocationError(null);
        console.log('已從 Checkinfo 更新位置:', location);
        return location;
      }

      // 如果 Checkinfo 沒有位置信息，使用瀏覽器 API 獲取位置
      console.log('Checkinfo 無位置信息，使用瀏覽器獲取位置');
      
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const updatedLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              setUserLocation(updatedLocation);
              setLocationError(null);
              console.log('已從瀏覽器更新位置:', updatedLocation);
              resolve(updatedLocation);
            },
            (error) => {
              console.error('瀏覽器位置獲取失敗:', error.message);
              let errorMessage;
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = t('errors.locationPermissionDenied');
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = t('errors.locationUnavailable');
                  break;
                case error.TIMEOUT:
                  errorMessage = t('errors.locationTimeout');
                  break;
                default:
                  errorMessage = t('checkin.locationError');
                  break;
              }
              setLocationError(errorMessage);
              // 如果已有位置信息，則繼續使用
              if (userLocation.latitude && userLocation.longitude) {
                resolve(userLocation);
              } else {
                // 如果沒有位置信息，則拒絕 Promise
                reject(new Error(errorMessage));
              }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          const errorMessage = t('errors.locationUnavailable');
          console.error('瀏覽器不支持地理位置功能');
          setLocationError(errorMessage);
          // 如果已有位置信息，則繼續使用
          if (userLocation.latitude && userLocation.longitude) {
            resolve(userLocation);
          } else {
            // 如果沒有位置信息，則拒絕 Promise
            reject(new Error(errorMessage));
          }
        }
      });
    } catch (error) {
      console.error('更新位置過程中發生錯誤:', error);
      // 如果已有位置信息，則繼續使用
      if (userLocation.latitude && userLocation.longitude) {
        return userLocation;
      }
      // 如果沒有位置信息，則拋出錯誤
      throw new Error(t('checkin.locationError'));
    }
  };

  // 修改後的 updateNetworkInfo 函數 - 優先使用 Checkinfo
  const updateNetworkInfo = async () => {
    try {
      // 優先從 Checkinfo 獲取網絡信息
      const info = await Checkinfo();
      if (info.ssid || info.bssid) {
        const networkInfo = {
          ssid: info.ssid || 'UNKNOWN',
          bssid: info.bssid || 'XX:XX:XX:XX:XX:XX',
          isWifi: info.ssid !== 'Network line'
        };
        console.log('從 Checkinfo 獲取網絡信息:', networkInfo);
        return networkInfo;
      }

      // 如果 Checkinfo 沒有網絡信息，使用現有的網絡獲取邏輯
      console.log('Checkinfo 無網絡信息，使用現有邏輯');
      
      // 檢查是否為移動設備
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // 檢查是否支持Network Information API
      if ('connection' in navigator && navigator.connection) {
        const connection = navigator.connection;
        
        // 檢查是否為Wi-Fi連接
        const isWifiConnection = connection.type === 'wifi';
        
        // 如果不是Wi-Fi連接，標記為固定網絡
        if (!isWifiConnection) {
          console.log('檢測到固定網絡連接');
          return {
            ssid: 'Network line',
            bssid: 'Network line',
            isWifi: false
          };
        }
      }
      
      // 其他現有的網絡信息獲取邏輯...
      if (isMobileDevice) {
        console.log('移動設備無法獲取Wi-Fi信息，使用默認值');
        return {
          ssid: 'UNKNOWN',
          bssid: 'XX:XX:XX:XX:XX:XX',
          isWifi: true
        };
      } else {
        console.log('桌面設備，可能使用固定網絡');
        return {
          ssid: 'Network line',
          bssid: 'Network line',
          isWifi: false
        };
      }
    } catch (err) {
      console.error('獲取網絡信息失敗:', err);
      return {
        ssid: 'UNKNOWN',
        bssid: 'XX:XX:XX:XX:XX:XX',
        isWifi: true
      };
    }
  };

  // 更新localStorage中的考勤結果
  const updateLocalStorageWithResults = useCallback((clockInResult, clockOutResult) => {
    try {
      const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const punchData = JSON.parse(storedData);
        
        if (clockInResult) {
          punchData.clockInResult = clockInResult;
          console.log('更新localStorage中的上班考勤結果:', clockInResult);
        }
        
        if (clockOutResult) {
          punchData.clockOutResult = clockOutResult;
          console.log('更新localStorage中的下班考勤結果:', clockOutResult);
        }
        
        localStorage.setItem(storageKey, JSON.stringify(punchData));
        console.log('已更新localStorage中的考勤結果');
      }
    } catch (err) {
      console.error('更新localStorage中的考勤結果失敗:', err);
    }
  }, [companyId, employeeId, currentDate]);

  // 使用新的 API 查詢考勤記錄並更新標籤狀態
  const fetchAttendanceRecords = useCallback(async () => {
    const result = await fetchAttendanceRecordsFunction({
      companyId,
      employeeId,
      currentDate,
      authToken,
      setClockInTime,
      setClockOutTime,
      setPunchStatus: (status) => {
        // 使用常數而不是硬編碼的中文
        if (status === '未打卡' || status === 'NOT_PUNCHED') {
          setPunchStatus('NOT_PUNCHED');
        } else if (status === '已上班' || status === 'CLOCKED_IN') {
          setPunchStatus('CLOCKED_IN');
        } else if (status === '已下班' || status === 'CLOCKED_OUT') {
          setPunchStatus('CLOCKED_OUT');
        } else {
          setPunchStatus(status);
        }
      },
      setCurrentEventId,
      setClockInResult,
      setClockOutResult,
      setIsLate,
      updateLocalStorageWithResults
    });
    
    if (!result.success) {
      console.error('查詢考勤記錄失敗:', result.message);
    }
  }, [companyId, employeeId, currentDate, authToken, updateLocalStorageWithResults]);

  // 修改後的 fetchPunchStatus 函數
  const fetchPunchStatus = useCallback(async () => {
    const result = await fetchPunchStatusFunction({
      companyId,
      employeeId,
      currentDate,
      clockInTime,
      setError: (error) => {
        if (error) {
          setError(error);
        }
      },
      setClockInTime,
      setClockOutTime,
      setPunchStatus: (status) => {
        // 使用常數而不是硬編碼的中文
        if (status === '未打卡' || status === 'NOT_PUNCHED') {
          setPunchStatus('NOT_PUNCHED');
        } else if (status === '已上班' || status === 'CLOCKED_IN') {
          setPunchStatus('CLOCKED_IN');
        } else if (status === '已下班' || status === 'CLOCKED_OUT') {
          setPunchStatus('CLOCKED_OUT');
        } else {
          setPunchStatus(status);
        }
      },
      setAttendanceStatus,
      setIsLate,
      setSsidError,
      setClockOutStatus,
      setCurrentEventId,
      setClockInResult,
      setClockOutResult,
      setFlutterInfo,
      fetchAttendanceRecords
    });
    
    if (!result.success) {
      console.error('獲取打卡狀態失敗:', result.message);
    }
  }, [companyId, employeeId, currentDate, clockInTime, fetchAttendanceRecords]);

  // 修改後的 handleClockIn 函數 - 使用離線功能
  const handleClockIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('開始上班打卡流程...');
      
      // 使用重試機制獲取完整網路資訊
      console.log('獲取完整網路資訊中...');
      const completeInfo = await getCompleteNetworkInfo(3, 800);
      console.log('獲取到的完整網路資訊:', completeInfo);
      
      // 確保位置資訊有效
      let location = {
        latitude: completeInfo.latitude || userLocation.latitude,
        longitude: completeInfo.longitude || userLocation.longitude
      };
      
      // 如果沒有位置資訊，嘗試更新位置
      if (!location.latitude || !location.longitude) {
        try {
          location = await updateLocation();
          console.log('已更新位置資訊:', location);
        } catch (locError) {
          console.error('獲取位置失敗:', locError);
          setError(t('checkin.clockInFailed') + ': ' + t('checkin.locationError'));
          return {
            success: false,
            message: t('checkin.locationError')
          };
        }
      }
      
      // 準備網路資訊
      let networkData = {
        ssid: completeInfo.ssid || networkInfo.ssid || 'UNKNOWN',
        bssid: completeInfo.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
        isWifi: (completeInfo.ssid || networkInfo.ssid) !== 'Network line'
      };
      
      // 準備私有 IP
      let privateIpValue = completeInfo.privateIp || privateIp;
      
      // 獲取當前時間 - 使用帶時區的 ISO 格式
      const now = new Date();
      
      // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
      const tzOffset = -now.getTimezoneOffset();
      const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
      const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
      const tzSign = tzOffset >= 0 ? '+' : '-';
      
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
      // 本地時間格式化 - 僅用於顯示
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formattedDate = `${year}-${month}-${day}`;
      const timeForDisplay = `${hours}:${minutes}`;
      
      // 準備網路資訊 - 根據連接類型設置
      let ssidValue;
      if (networkData.isWifi) {
        // 如果是WiFi連接，使用SSID
        ssidValue = networkData.ssid;
      } else {
        // 如果是固定網路，設為Network line
        ssidValue = 'Network line';
      }
      
      // 構建打卡數據
      const payload = {
        company_id: companyId,
        employee_id: employeeId,
        utc_timestamp: utcTimestamp,
        ssid: ssidValue,
        bssid: networkData.bssid,
        xtbbddtx: privateIpValue || '',
        public_ip: publicIp || '',
        longitude: location.longitude,
        latitude: location.latitude
      };
      
      console.log(`發送上班打卡請求:`, JSON.stringify(payload, null, 2));
      
      // 🔥 使用支援離線的 API 呼叫
      const apiResult = await handleApiWithOfflineCache(
        `${API_BASE_URL}/api/check-in-google`,
        payload,
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      );

      let responseData;
      if (apiResult.cached) {
        // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
        console.log('上班打卡已快取，等待網路恢復後上傳');
        
        // 模擬成功回應以繼續 UI 更新
        responseData = {
          Status: "Ok",
          Data: {
            event_id: null // 離線時沒有 event_id
          }
        };
      } else {
        // 線上狀態 - 處理正常的 API 回應
        responseData = apiResult.data;
        
        if (responseData.Status !== "Ok") {
          throw new Error(responseData.Msg || t('checkin.clockInFailed'));
        }
      }
      
      console.log('上班打卡成功:', responseData);
      
      // 獲取事件 ID
      const eventId = responseData.Data?.event_id || null;
      
      // 更新UI - 使用常數
      setClockInTime(timeForDisplay);
      setPunchStatus('CLOCKED_IN');
      setClockOutTime('--:--'); // 重置下班時間
      setClockOutStatus(null); // 重置下班打卡狀態
      setClockOutResult(null); // 重置下班考勤結果
      setCurrentEventId(eventId); // 設置當前事件ID
      
      // 檢查打卡時間是否遲到，並檢查 SSID
      const attendanceCheckResult = await checkAttendanceStatus(
        formattedTime,
        formattedDate,
        eventId,
        utcTimestamp
      );
      
      console.log('打卡狀態檢查結果:', attendanceCheckResult);
      
      // 重要：查詢考勤記錄以獲取上班標籤狀態
      setTimeout(() => {
        fetchAttendanceRecords();
      }, 2000);
      
      // 保存打卡記錄到本地存儲
      const punchData = {
        clockInTime: timeForDisplay,
        clockInFullTime: formattedTime,
        clockInDate: formattedDate,
        clockInUtcTimestamp: utcTimestamp,
        clockOutTime: null,
        clockOutFullTime: null,
        clockOutDate: null,
        clockOutUtcTimestamp: null,
        eventId: eventId,
        attendanceStatus: attendanceCheckResult.status === 'success' ? attendanceCheckResult.data : null,
        clockOutStatus: null,
        clockInResult: clockInResult,
        clockOutResult: null,
        flutterInfo: completeInfo,
        locationUsed: location
      };
      
      localStorage.setItem(`punchData_${companyId}_${employeeId}_${formattedDate}`, JSON.stringify(punchData));
      
      return {
        success: true,
        data: responseData.Data,
        eventId: eventId,
        message: t('checkin.clockInSuccess')
      };
      
    } catch (err) {
      console.error('上班打卡失敗:', err);
      setError(t('checkin.clockInFailed') + ': ' + (err.message || t('errors.networkError')));
      
      return {
        success: false,
        message: err.message || t('checkin.clockInFailed'),
        error: err
      };
    } finally {
      setLoading(false);
    }
  };

  // 修改後的 handleClockOut 函數 - 使用離線功能
  const handleClockOut = async () => {
    if (clockInTime === '--:--') {
      setError(t('checkin.clockInFirst'));
      return {
        success: false,
        message: t('checkin.clockInFirst')
      };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('開始下班打卡流程...');
      
      // 使用重試機制獲取完整網路資訊
      console.log('獲取完整網路資訊中...');
      const completeInfo = await getCompleteNetworkInfo(3, 800);
      console.log('獲取到的完整網路資訊:', completeInfo);
      
      // 確保位置資訊有效
      let location = {
        latitude: completeInfo.latitude || userLocation.latitude,
        longitude: completeInfo.longitude || userLocation.longitude
      };
      
      // 如果沒有位置資訊，嘗試更新位置
      if (!location.latitude || !location.longitude) {
        try {
          location = await updateLocation();
          console.log('已更新位置資訊:', location);
        } catch (locError) {
          console.error('獲取位置失敗:', locError);
          setError(t('checkin.clockOutFailed') + ': ' + t('checkin.locationError'));
          return {
            success: false,
            message: t('checkin.locationError')
          };
        }
      }
      
      // 準備網路資訊
      let networkData = {
        ssid: completeInfo.ssid || networkInfo.ssid || 'UNKNOWN',
        bssid: completeInfo.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
        isWifi: (completeInfo.ssid || networkInfo.ssid) !== 'Network line'
      };
      
      // 準備私有 IP
      let privateIpValue = completeInfo.privateIp || privateIp;
      
      // 重新獲取公共 IP 地址 - 確保使用最新的公共 IP
      let currentPublicIp = publicIp;
      try {
        console.log('下班打卡前重新獲取公共 IP...');
        
        // 嘗試使用多個服務獲取公共 IP
        // 方法1: 使用 ipify API
        try {
          const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (ipifyResponse.ok) {
            const ipifyData = await ipifyResponse.json();
            if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
              currentPublicIp = ipifyData.ip;
              console.log('下班打卡: 從 ipify 獲取公共 IP:', ipifyData.ip);
            } else {
              console.log('下班打卡: ipify 返回伺服器 IP，嘗試其他方法');
            }
          }
        } catch (err) {
          console.error('下班打卡: 從 ipify 獲取公共 IP 失敗:', err);
        }
        
        // 如果 ipify 失敗，嘗試 ipinfo.io
        if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
          try {
            const ipinfoResponse = await fetch('https://ipinfo.io/json', {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
            
            if (ipinfoResponse.ok) {
              const ipinfoData = await ipinfoResponse.json();
              if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
                currentPublicIp = ipinfoData.ip;
                console.log('下班打卡: 從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
              } else {
                console.log('下班打卡: ipinfo.io 返回伺服器 IP，嘗試其他方法');
              }
            }
          } catch (err) {
            console.error('下班打卡: 從 ipinfo.io 獲取公共 IP 失敗:', err);
          }
        }
        
        // 如果 ipinfo.io 也失敗，嘗試 cloudflare
        if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
          try {
            const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
            
            if (cfResponse.ok) {
              const cfText = await cfResponse.text();
              const ipMatch = cfText.match(/ip=([0-9.]+)/);
              if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
                currentPublicIp = ipMatch[1];
                console.log('下班打卡: 從 Cloudflare 獲取公共 IP:', ipMatch[1]);
              } else {
                console.log('下班打卡: Cloudflare 返回伺服器 IP，嘗試其他方法');
              }
            }
          } catch (err) {
            console.error('下班打卡: 從 Cloudflare 獲取公共 IP 失敗:', err);
          }
        }
        
        // 最後嘗試自定義 API
        if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
          try {
            const customApiResponse = await fetch(`${API_BASE_URL}/api/client-ip`, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
            
            if (customApiResponse.ok) {
              const customApiData = await customApiResponse.json();
              if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
                currentPublicIp = customApiData.ip;
                console.log('下班打卡: 從自定義 API 獲取公共 IP:', customApiData.ip);
              } else {
                console.log('下班打卡: 自定義 API 返回伺服器 IP，使用備用方法');
              }
            }
          } catch (err) {
            console.error('下班打卡: 從自定義 API 獲取公共 IP 失敗:', err);
          }
        }
        
        // 如果所有方法都失敗，使用空字符串
        if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
          console.log('下班打卡: 所有方法獲取公共 IP 失敗，使用空字符串');
          currentPublicIp = '';
        }
        
      } catch (ipError) {
        console.error('下班打卡: 獲取公共 IP 過程中發生錯誤:', ipError);
        currentPublicIp = ''; // 出錯時使用空字符串
      }
      
      // 獲取當前時間 - 使用帶時區的 ISO 格式
      const now = new Date();
      
      // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
      const tzOffset = -now.getTimezoneOffset();
      const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
      const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
      const tzSign = tzOffset >= 0 ? '+' : '-';
      
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
      // 本地時間格式化 - 僅用於顯示
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formattedDate = `${year}-${month}-${day}`;
      const timeForDisplay = `${hours}:${minutes}`;
      
      // 準備網路資訊 - 根據連接類型設置
      let ssidValue;
      if (networkData.isWifi) {
        // 如果是WiFi連接，使用SSID
        ssidValue = networkData.ssid;
      } else {
        // 如果是固定網路，設為Network line
        ssidValue = 'Network line';
      }
      
      // 準備下班原因（如有需要）
      let reason = '';
      
      // 檢查是否有 SSID 錯誤，如果有，加入到 reason
      if (ssidError) {
        reason = `SSID錯誤: ${ssidError}`;
      }
      
      // 構建打卡數據
      const payload = {
        company_id: companyId,
        employee_id: employeeId,
        utc_timestamp: utcTimestamp,
        event_id: currentEventId || null, // 使用當前事件ID
        ssid: ssidValue,
        bssid: networkData.bssid,
        xtbbddtx: privateIpValue || '',
        public_ip: currentPublicIp, // 使用重新獲取的公共 IP
        longitude: location.longitude,
        latitude: location.latitude,
        reason: reason || null // 添加下班原因
      };
      
      console.log(`發送下班打卡請求:`, JSON.stringify(payload, null, 2));
      
      // 🔥 使用支援離線的 API 呼叫
      const apiResult = await handleApiWithOfflineCache(
        `${API_BASE_URL}/api/check-out-google`,
        payload,
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      );

      let responseData;
      if (apiResult.cached) {
        // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
        console.log('下班打卡已快取，等待網路恢復後上傳');
        
        // 模擬成功回應以繼續 UI 更新
        responseData = {
          Status: "Ok",
          Data: {}
        };
      } else {
        // 線上狀態 - 處理正常的 API 回應
        responseData = apiResult.data;
        
        if (responseData.Status !== "Ok") {
          throw new Error(responseData.Msg || t('checkin.clockOutFailed'));
        }
      }
      
      console.log('下班打卡成功:', responseData);
      
      // 更新UI - 使用常數
      setClockOutTime(timeForDisplay);
      setPunchStatus('CLOCKED_OUT');
      
      // 檢查下班打卡狀態
      const clockOutCheckResult = await checkClockOutStatus(
        formattedTime,
        formattedDate,
        currentEventId,
        utcTimestamp
      );
      
      console.log('下班打卡狀態檢查結果:', clockOutCheckResult);
      
      // 查詢最新打卡記錄
      setTimeout(() => {
        fetchAttendanceRecords();
      }, 2000);
      
      // 更新本地存儲中的打卡記錄
      const storedData = localStorage.getItem(`punchData_${companyId}_${employeeId}_${currentDate}`);
      let punchData = storedData ? JSON.parse(storedData) : {};
      
      punchData.clockOutTime = timeForDisplay;
      punchData.clockOutFullTime = formattedTime;
      punchData.clockOutDate = formattedDate;
      punchData.clockOutUtcTimestamp = utcTimestamp;
      punchData.clockOutReason = reason; // 儲存下班原因
      punchData.clockOutStatus = clockOutCheckResult.status === 'success' ? clockOutCheckResult.data?.attendance_status : null; // 儲存下班打卡狀態
      punchData.clockOutResult = clockOutResult; // 保持現有的下班考勤結果
      // 更新從 Flutter 獲取的信息
      punchData.flutterInfo = { ...punchData.flutterInfo, ...completeInfo };
      // 儲存使用的公共 IP
      punchData.publicIp = currentPublicIp;
      // 儲存使用的位置信息
      punchData.locationUsedForClockOut = location;
      
      localStorage.setItem(`punchData_${companyId}_${employeeId}_${currentDate}`, JSON.stringify(punchData));
      
      return {
        success: true,
        data: responseData.Data,
        message: t('checkin.clockOutSuccess')
      };
      
    } catch (err) {
      console.error('下班打卡失敗:', err);
      setError(t('checkin.clockOutFailed') + ': ' + (err.message || t('errors.networkError')));
      
      return {
        success: false,
        message: err.message || t('checkin.clockOutFailed'),
        error: err
      };
    } finally {
      setLoading(false);
    }
  };

  // 檢測螢幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      if (appWrapperRef.current) {
        const width = appWrapperRef.current.offsetWidth;
        setIsSmallScreen(width < 360);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // 初始化時從 Flutter 獲取信息並定期更新
  useEffect(() => {
    if (companyId && employeeId) {
      console.log('開始初始化 Checkinfo...');
      
      // 立即執行一次獲取資訊
      Checkinfo();
      
      // 設置定時器，每 30 秒更新一次網路資訊，確保始終有最新資訊
      const interval = setInterval(() => {
        console.log('定期更新網路資訊...');
        Checkinfo();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [companyId, employeeId, Checkinfo]);

  // 獲取用戶位置 - 修改為不使用預設經緯度
  useEffect(() => {
    // 如果已經從 Flutter 獲取到位置信息，就不需要再用瀏覽器 API
    if (flutterInfo.latitude && flutterInfo.longitude) {
      console.log('已從 Flutter 獲取位置信息，跳過瀏覽器位置獲取');
      return;
    }

    if (navigator.geolocation) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log('成功獲取地理位置:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('獲取地理位置失敗:', error.message);
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t('errors.locationPermissionDenied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t('errors.locationUnavailable');
              break;
            case error.TIMEOUT:
              errorMessage = t('errors.locationTimeout');
              break;
            default:
              errorMessage = t('checkin.locationError');
              break;
          }
          setLocationError(errorMessage);
          // 不再設置預設位置
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setLocationError(t('errors.locationUnavailable'));
      // 不再設置預設位置
    }
  }, [flutterInfo.latitude, flutterInfo.longitude, t]);

  // 獲取IP地址 - 修改為使用更可靠的公共 IP 獲取服務
  useEffect(() => {
    const getIpAddresses = async () => {
      try {
        setIpError(null);
        
        // 優先使用 Checkinfo 獲取私有 IP
        const info = await Checkinfo();
        if (info.privateIp) {
          setPrivateIp(info.privateIp);
          console.log('從 Checkinfo 獲取私有 IP:', info.privateIp);
        } else {
          // 備用方案：使用 WebRTC 獲取私有 IP
          console.log('嘗試使用 WebRTC 獲取私有IP作為備用方案');
          
          const RTCPeerConnection = window.RTCPeerConnection || 
                                  window.webkitRTCPeerConnection || 
                                  window.mozRTCPeerConnection;
          
          if (RTCPeerConnection) {
            const pc = new RTCPeerConnection({
              iceServers: []
            });
            
            // 非必要，但可以用來觸發ICE候選項收集
            pc.createDataChannel('');
            
            // 創建offer並設置本地描述
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            // 監聽ICE候選項事件
            pc.onicecandidate = (ice) => {
              if (ice.candidate) {
                // 從候選項中提取IP地址
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                const matches = ipRegex.exec(ice.candidate.candidate);
                
                if (matches && matches.length > 1) {
                  const ip = matches[1];
                  
                  // 檢查是否為私有IP
                  if (
                    ip.startsWith('10.') || 
                    ip.startsWith('192.168.') || 
                    ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
                  ) {
                    console.log('通過WebRTC獲取到私有IP:', ip);
                    setPrivateIp(ip);
                    pc.onicecandidate = null;
                    pc.close();
                  }
                }
              }
            };
            
          } else {
            console.log('瀏覽器不支持WebRTC，無法獲取私有IP');
          }
        }
        
        // 使用多個公共 IP 獲取服務，提高可靠性
        try {
          // 方法1: 使用 ipify API
          const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (ipifyResponse.ok) {
            const ipifyData = await ipifyResponse.json();
            if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
              setPublicIp(ipifyData.ip);
              console.log('從 ipify 獲取公共 IP:', ipifyData.ip);
              return; // 成功獲取，退出函數
            } else {
              console.log('ipify 返回伺服器 IP，嘗試其他方法');
            }
          }
        } catch (err) {
          console.error('從 ipify 獲取公共 IP 失敗:', err);
        }
        
        try {
          // 方法2: 使用 ipinfo.io API
          const ipinfoResponse = await fetch('https://ipinfo.io/json', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (ipinfoResponse.ok) {
            const ipinfoData = await ipinfoResponse.json();
            if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
              setPublicIp(ipinfoData.ip);
              console.log('從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
              return; // 成功獲取，退出函數
            } else {
              console.log('ipinfo.io 返回伺服器 IP，嘗試其他方法');
            }
          }
        } catch (err) {
          console.error('從 ipinfo.io 獲取公共 IP 失敗:', err);
        }
        
        try {
          // 方法3: 使用 cloudflare API
          const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (cfResponse.ok) {
            const cfText = await cfResponse.text();
            const ipMatch = cfText.match(/ip=([0-9.]+)/);
            if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
              setPublicIp(ipMatch[1]);
              console.log('從 Cloudflare 獲取公共 IP:', ipMatch[1]);
              return; // 成功獲取，退出函數
            } else {
              console.log('Cloudflare 返回伺服器 IP，嘗試其他方法');
            }
          }
        } catch (err) {
          console.error('從 Cloudflare 獲取公共 IP 失敗:', err);
        }
        
        // 方法4: 使用自定義 API 端點
        try {
          const customApiResponse = await fetch(`${API_BASE_URL}/api/client-ip`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (customApiResponse.ok) {
            const customApiData = await customApiResponse.json();
            if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
              setPublicIp(customApiData.ip);
              console.log('從自定義 API 獲取公共 IP:', customApiData.ip);
              return; // 成功獲取，退出函數
            } else {
              console.log('自定義 API 返回伺服器 IP，使用備用方法');
            }
          }
        } catch (err) {
          console.error('從自定義 API 獲取公共 IP 失敗:', err);
        }
        
        // 如果所有方法都失敗，使用空字符串而不是伺服器 IP
        console.log('所有方法獲取公共 IP 失敗，使用空字符串');
        setPublicIp('');
        
      } catch (error) {
        console.error('獲取 IP 地址失敗:', error);
        setIpError(t('errors.networkError'));
        setPublicIp(''); // 使用空字符串而不是伺服器 IP
      }
    };

    if (companyId && employeeId) {
      getIpAddresses();
    }
  }, [companyId, employeeId, Checkinfo, t]);

  // 獲取網絡信息 - 修改為備用方案
  useEffect(() => {
    // 如果已經從 Flutter 獲取到網絡信息，就不需要再用其他方法
    if (flutterInfo.ssid || flutterInfo.bssid) {
      console.log('已從 Flutter 獲取網絡信息，跳過其他網絡信息獲取');
      setNetworkInfo({
        ssid: flutterInfo.ssid || 'UNKNOWN',
        bssid: flutterInfo.bssid || 'XX:XX:XX:XX:XX:XX',
        isWifi: flutterInfo.ssid !== 'Network line'
      });
      return;
    }

    const getNetworkInfo = async () => {
      try {
        setNetworkError(null);
        
        // 檢查是否為移動設備
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 檢查是否支持Network Information API
        if ('connection' in navigator && navigator.connection) {
          const connection = navigator.connection;
          console.log('連接類型:', connection.type);
          console.log('有效類型:', connection.effectiveType);
          
          // 檢查是否為Wi-Fi連接
          const isWifiConnection = connection.type === 'wifi';
          
          // 如果不是Wi-Fi連接，標記為固定網絡
          if (!isWifiConnection) {
            console.log('檢測到固定網絡連接');
            setNetworkInfo({
              ssid: 'Network line',
              bssid: 'Network line',
              isWifi: false
            });
            return;
          }
        }
        
        // 其他現有的網絡信息獲取邏輯...
        if (isMobileDevice) {
          console.log('移動設備無法獲取Wi-Fi信息，使用默認值');
          setNetworkInfo({
            ssid: 'UNKNOWN',
            bssid: 'XX:XX:XX:XX:XX:XX',
            isWifi: true
          });
        } else {
          // 如果是桌面設備，更可能是固定網絡
          console.log('桌面設備，可能使用固定網絡');
          setNetworkInfo({
            ssid: 'Network line',
            bssid: 'Network line',
            isWifi: false
          });
        }
        
      } catch (err) {
        console.error('獲取網絡信息失敗:', err);
        setNetworkError(t('errors.networkError'));
        setNetworkInfo({
          ssid: 'UNKNOWN',
          bssid: 'XX:XX:XX:XX:XX:XX',
          isWifi: true
        });
      }
    };
    
    getNetworkInfo();
  }, [flutterInfo.ssid, flutterInfo.bssid, t]);

  // 計算工作時長
  const calculateWorkDuration = useCallback(() => {
    if (clockInTime === '--:--' || !isLate) return;

    // 從打卡時間獲取小時和分鐘
    const [hours, minutes] = clockInTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    // 獲取當前時間
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // 計算工作時長（小時和分鐘）
    let durationMinutes = (currentHours - hours) * 60 + (currentMinutes - minutes);
    
    // 如果是負數（可能是跨天的情況），加上24小時
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }

    const durationHours = Math.floor(durationMinutes / 60);
    const remainingMinutes = durationMinutes % 60;

    setWorkDuration({
      hours: durationHours,
      minutes: remainingMinutes
    });
  }, [clockInTime, isLate]);

  // 定期更新工作時長
  useEffect(() => {
    if (isLate && clockInTime !== '--:--') {
      calculateWorkDuration();
      const interval = setInterval(calculateWorkDuration, 60000); // 每分鐘更新一次
      return () => clearInterval(interval);
    }
  }, [isLate, clockInTime, calculateWorkDuration]);

  // 查詢最新打卡記錄並獲取 event_id
  const fetchLatestCheckRecord = useCallback(async () => {
    if (!companyId || !employeeId) {
      console.log('缺少查詢打卡記錄的必要參數');
      return null;
    }

    try {
      console.log('開始查詢最新打卡記錄...');
      
      // 獲取當前日期
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      
      // 使用 API 查詢打卡記錄，添加 auth_xtbb token
      const response = await fetch(`${API_BASE_URL}/api/check-records?company_id=${companyId}&employee_id=${employeeId}&start_date=${today}&end_date=${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
        }
      });
      
      if (!response.ok) {
        throw new Error(`API 回應錯誤: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.Status === "Ok" && responseData.Data.records.length > 0) {
        // 獲取最新的打卡記錄（第一筆）
        const latestRecord = responseData.Data.records[0];
        console.log('最新打卡記錄:', latestRecord);
        return latestRecord;
      } else {
        console.log('沒有找到打卡記錄或查詢失敗:', responseData.Msg);
        return null;
      }
    } catch (err) {
      console.error('查詢最新打卡記錄失敗:', err);
      return null;
    }
  }, [companyId, employeeId, authToken]);

  // 檢查考勤狀態
  const checkAttendanceStatus = async (time, date, eventId, utcTimestamp) => {
    try {
      console.log('開始檢查考勤狀態...');
      console.log('- 時間:', time);
      console.log('- 日期:', date);
      console.log('- 事件ID:', eventId);
      console.log('- UTC時間戳:', utcTimestamp);
      
      // 使用 API 檢查考勤狀態，添加 auth_xtbb token
      const response = await fetch(`${API_BASE_URL}/api/check-attendance-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
        },
        body: JSON.stringify({
          company_id: companyId,
          employee_id: employeeId,
          time: time,
          date: date,
          event_id: eventId,
          utc_timestamp: utcTimestamp,
          ssid: networkInfo.ssid
        })
      });
      
      if (!response.ok) {
        throw new Error(`API 回應錯誤: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('考勤狀態檢查結果:', responseData);
      
      if (responseData.Status === "Ok") {
        // 檢查是否有 SSID 錯誤
        if (responseData.Data.message && responseData.Data.message.includes('使用非公司網路')) {
          const ssidErrorMsg = responseData.Data.message.split('；')[1] || responseData.Data.message;
          setSsidError(ssidErrorMsg);
        }
        
        return {
          status: 'success',
          data: responseData.Data
        };
      } else {
        return {
          status: 'error',
          message: responseData.Msg || '檢查考勤狀態失敗'
        };
      }
    } catch (err) {
      console.error('檢查考勤狀態失敗:', err);
      return {
        status: 'error',
        message: err.message
      };
    }
  };

  // 檢查下班打卡狀態
  const checkClockOutStatus = async (time, date, eventId, utcTimestamp) => {
    try {
      console.log('開始檢查下班打卡狀態...');
      console.log('- 時間:', time);
      console.log('- 日期:', date);
      console.log('- 事件ID:', eventId);
      console.log('- UTC時間戳:', utcTimestamp);
      
      // 使用 API 檢查下班打卡狀態，添加 auth_xtbb token
      const response = await fetch(`${API_BASE_URL}/api/check-clock-out-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
        },
        body: JSON.stringify({
          company_id: companyId,
          employee_id: employeeId,
          time: time,
          date: date,
          event_id: eventId,
          utc_timestamp: utcTimestamp
        })
      });
      
      if (!response.ok) {
        throw new Error(`API 回應錯誤: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('下班打卡狀態檢查結果:', responseData);
      
      if (responseData.Status === "Ok") {
        return {
          status: 'success',
          data: responseData.Data
        };
      } else {
        return {
          status: 'error',
          message: responseData.Msg || '檢查下班打卡狀態失敗'
        };
      }
    } catch (err) {
      console.error('檢查下班打卡狀態失敗:', err);
      return {
        status: 'error',
        message: err.message
      };
    }
  };

  // 獲取當前日期和時間，並檢測日期變化
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // 格式化時間為 HH:MM
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      // 格式化日期為 YYYY-MM-DD
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // 檢查日期是否變化（過了凌晨12點）
      if (previousDate && previousDate !== formattedDate) {
        console.log('檢測到日期變化，從', previousDate, '到', formattedDate);
        console.log('自動刷新頁面以獲取新的打卡記錄...');
        
        // 重置打卡狀態
        setClockInTime('--:--');
        setClockOutTime('--:--');
        setPunchStatus('NOT_PUNCHED');
        setClockInResult(null);
        setClockOutResult(null);
        
        // 重新獲取打卡記錄
        if (companyId && employeeId) {
          fetchPunchStatus();
        }
      }
      
      // 更新當前日期和前一天日期
      setCurrentDate(formattedDate);
      setPreviousDate(formattedDate);
      
      // 獲取星期幾
      const dayOfWeekIndex = now.getDay();
      setDayOfWeek(formatDayOfWeek(dayOfWeekIndex));
    };
    
    updateDateTime();
    
    // 設置定時器，每分鐘更新一次時間和日期
    const interval = setInterval(updateDateTime, 60000);
    
    // 設置一個定時器，每分鐘檢查是否為台灣時間凌晨 00:00，如果是則刷新頁面資訊
    const midnightRefreshInterval = setInterval(() => {
      const now = new Date();
      const taiwanHours = now.getHours();
      const taiwanMinutes = now.getMinutes();
      
      // 如果是台灣時間凌晨 00:00
      if (taiwanHours === 0 && taiwanMinutes === 0) {
        console.log('台灣時間凌晨 00:00，執行頁面資訊刷新...');
        
        // 重置打卡狀態
        setClockInTime('--:--');
        setClockOutTime('--:--');
        setPunchStatus('NOT_PUNCHED');
        setClockInResult(null);
        setClockOutResult(null);
        
        // 重新獲取打卡記錄
        if (companyId && employeeId) {
          fetchPunchStatus();
        }
      }
    }, 60000); // 每分鐘檢查一次
    
    return () => {
      clearInterval(interval);
      clearInterval(midnightRefreshInterval);
    };
  }, [companyId, employeeId, fetchPunchStatus, previousDate, formatDayOfWeek, t]);

  // 在認證完成後獲取打卡狀態
  useEffect(() => {
    if (companyId && employeeId && currentDate) {
      fetchPunchStatus();
    }
  }, [companyId, employeeId, currentDate, fetchPunchStatus]);

  // 新增處理 Flutter 傳回的快取請求
  useEffect(() => {
    // 定義全域函數讓 Flutter 呼叫
    window.processCachedRequest = async (dbId, requestPacket) => {
      console.log("收到 Flutter 歸還的暫存資料，準備上傳:", requestPacket);

      try {
        // 這裡才真正執行 API Call（使用 Web 原有的 fetch）
        const response = await fetch(requestPacket.url, {
          method: requestPacket.method,
          headers: requestPacket.headers,
          body: JSON.stringify(requestPacket.body)
        });

        if (!response.ok) {
          throw new Error(`API 請求失敗: ${response.status}`);
        }

        const responseData = await response.json();
        
        if (responseData.Status === "Ok") {
          console.log("快取請求上傳成功:", responseData);
          
          // 成功後，通知 Flutter 刪除該筆 SQLite 資料
          if (window.FlutterBridge) {
            window.FlutterBridge.postMessage(JSON.stringify({
              action: 'REQUEST_PROCESSED',
              id: dbId // 告訴 Flutter 哪一筆處理完了
            }));
          }
          
          // 根據請求類型更新相關狀態
          if (requestPacket.url.includes('check-in-google')) {
            console.log('快取的上班打卡請求已成功處理');
            
            // 如果有 event_id，更新到狀態中
            if (responseData.Data?.event_id) {
              setCurrentEventId(responseData.Data.event_id);
            }
            
            // 靜默更新考勤記錄
            setTimeout(() => {
              fetchAttendanceRecords();
            }, 1000);
            
          } else if (requestPacket.url.includes('check-out-google')) {
            console.log('快取的下班打卡請求已成功處理');
            
            // 靜默更新考勤記錄
            setTimeout(() => {
              fetchAttendanceRecords();
            }, 1000);
          }
          
          console.log("上傳成功，已通知 Flutter 清除快取");

        } else {
          throw new Error(responseData.Msg || '處理快取請求失敗');
        }

      } catch (error) {
        console.error("快取請求上傳失敗，稍後再試", error);
        // 失敗就不通知刪除，讓 Flutter 下次連線再丟一次
      }
    };

    // 清理函數
    return () => {
      if (window.processCachedRequest) {
        delete window.processCachedRequest;
      }
    };
  }, [fetchAttendanceRecords, setCurrentEventId]);

  // 語言變化時更新標籤文字
  useEffect(() => {
    // 當語言變化時，重新設置考勤結果以觸發標籤文字更新
    if (clockInResult) {
      setClockInResult({ ...clockInResult });
    }
    if (clockOutResult) {
      setClockOutResult({ ...clockOutResult });
    }
  }, [currentLanguage, clockInResult, clockOutResult]);

  // 渲染考勤狀態信息
  const renderAttendanceStatus = () => {
    if (attendanceStatus && attendanceStatus.is_late && clockInTime !== '--:--') {
      return (
        <div className="checkin-attendance-status late">
          <div className="checkin-status-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="checkin-status-text">
            <span>{t('checkin.lateMinutes').replace('{minutes}', attendanceStatus.late_minutes)}</span>
            {attendanceStatus.message && <span className="checkin-status-message">{attendanceStatus.message}</span>}
          </div>
        </div>
      );
    } else if (ssidError && clockInTime !== '--:--') {
      return (
        <div className="checkin-attendance-status ssid-error">
          <div className="checkin-status-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16H12.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="checkin-status-text">
            <span>{t('checkin.nonCompanyNetwork')}</span>
            <span className="checkin-status-message">{ssidError}</span>
          </div>
        </div>
      );
    } else if (clockOutStatus && clockOutStatus.is_early_leave && clockOutTime !== '--:--') {
      return (
        <div className="checkin-attendance-status early-leave">
          <div className="checkin-status-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12L12 16L16 12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="checkin-status-text">
            <span>{t('checkin.earlyLeaveMinutes').replace('{minutes}', clockOutStatus.early_leave_minutes)}</span>
            {clockOutStatus.message && <span className="checkin-status-message">{clockOutStatus.message}</span>}
          </div>
        </div>
      );
    } else if (clockOutStatus && clockOutStatus.is_overtime && clockOutTime !== '--:--') {
      return (
        <div className="checkin-attendance-status overtime">
          <div className="checkin-status-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 12L12 8L8 12" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="checkin-status-text">
            <span>{t('checkin.overtimeMinutes').replace('{minutes}', clockOutStatus.overtime_minutes)}</span>
            {clockOutStatus.message && <span className="checkin-status-message">{clockOutStatus.message}</span>}
          </div>
        </div>
      );
    } else if (clockInTime !== '--:--' && clockOutTime !== '--:--') {
    } 
    return null;
  };

  // 獲取上班打卡狀態標籤 - 使用動態翻譯
  const getClockInStatusTag = () => {
    if (!clockInResult) return null;
    
    return {
      tagClass: getTagClassFromResult(clockInResult.tagText),
      tagText: getTagTextFromResult(clockInResult.tagText)
    };
  };

  // 獲取下班打卡狀態標籤 - 使用動態翻譯
  const getClockOutStatusTag = () => {
    if (!clockOutResult) return null;
    
    return {
      tagClass: getTagClassFromResult(clockOutResult.tagText),
      tagText: getTagTextFromResult(clockOutResult.tagText)
    };
  };

  const handleGoHome = () => {
    window.location.replace('/frontpagepmx');
  };

  // 處理查詢考勤
  const handleQueryAttendance = () => {
    window.location.replace('/attendancepagepmx');
  };

  return (
    <div className="checkin-container" data-language={currentLanguage}>
      <div className={`checkin-app-wrapper ${isSmallScreen ? 'small-screen' : ''}`} ref={appWrapperRef}>
        <header className="checkin-header">
          {/* 使用語言切換組件 - 絕對定位 */}
          <LanguageSwitch 
            position="absolute"
            containerClassName="checkin-language-switch"
          />
          
          <div className="checkin-home-icon" onClick={handleGoHome}>
            <img 
              src={homeIcon} 
              alt={t('checkin.home')} 
              width="22" 
              height="22" 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="checkin-page-title">{t('checkin.title')}</div>
        </header>
        
        <div className="checkin-content">
          {/* 打卡區塊 */}
          <div className="checkin-punch-card">
            <div className="checkin-date-status">
              <span className="checkin-date">{currentDate} ({dayOfWeek})</span>
              <span className="checkin-status">{translatePunchStatus(punchStatus)}</span>
            </div>
            
            <div className="checkin-time-section">
              <div className="checkin-time-header">
                <span>{t('checkin.clockInTime')}</span>
                <span>{t('checkin.clockOutTime')}</span>
              </div>
              
              <div className="checkin-time-values">
                {/* 上班時間容器，包含時間和考勤標籤（透過API查詢並持續保持） */}
                <div className="checkin-time-container">
                  <span className="checkin-time-value">{clockInTime}</span>
                  {getClockInStatusTag() && clockInTime !== '--:--' && (
                    <span className={`checkin-late-tag ${getClockInStatusTag().tagClass}`}>
                      {getClockInStatusTag().tagText}
                    </span>
                  )}
                </div>
                
                <span className="checkin-time-arrow">
                  <svg width="55" height="55" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                
                {/* 下班時間容器，包含時間和考勤標籤（透過API查詢並持續保持） */}
                <div className="checkin-time-container">
                  <span className="checkin-time-value">{clockOutTime}</span>
                  {getClockOutStatusTag() && clockOutTime !== '--:--' && (
                    <span className={`checkin-late-tag ${getClockOutStatusTag().tagClass}`}>
                      {getClockOutStatusTag().tagText}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* 渲染考勤狀態信息 */}
            {renderAttendanceStatus()}
            
            <div className="checkin-button-group">
              <button 
                className="checkin-button checkin-clock-in-button"
                onClick={handleClockIn}
                disabled={loading}
              >
                {t('checkin.clockIn')}
              </button>
              <button 
                className={`checkin-button checkin-clock-out-button ${loading ? 'loading' : ''}`}
                onClick={handleClockOut}
                disabled={clockInTime === '--:--' || loading}
              >
                {t('checkin.clockOut')}
              </button>
            </div>
            
            {error && <div className="checkin-error-message">{error}</div>}
          </div>
        </div>

        {/* 查詢按鈕 */}
        <div className="checkin-query-button" onClick={handleQueryAttendance}>
          {t('checkin.queryAttendance')}
        </div>

        {/* 載入中覆蓋層 */}
        {loading && (
          <div className="checkin-loading-overlay">
            <div className="checkin-loading-container">
              <div className="checkin-loading-spinner"></div>
              <div>{t('checkin.processing')}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CheckinPMX;
            
