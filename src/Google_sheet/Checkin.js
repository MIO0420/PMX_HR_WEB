import React, { useState, useEffect, useCallback, useRef } from 'react';
import './css/Checkin.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import Cookies from 'js-cookie';
import { 
  validateUserFromCookies, 
  handleClockIn as handleClockInFunction, 
  handleClockOut as handleClockOutFunction,
  fetchAttendanceRecordsFunction,
  fetchPunchStatusFunction,
  getTagClassFromResult,
  getTagTextFromResult,
  fetchApprovedApplications,  // 新增
  checkLeaveApplicationAndUpdateStatus  // 新增
} from './function/function';

function Checkin() {
  const [currentTime, setCurrentTime] = useState('--:--');
  const [currentDate, setCurrentDate] = useState('');
  const [previousDate, setPreviousDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [punchStatus, setPunchStatus] = useState('未打卡');
  const [clockInTime, setClockInTime] = useState('--:--');
  const [clockOutTime, setClockOutTime] = useState('--:--');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // 完整頁面刷新函數
const handleRefresh = () => {
  setIsRefreshing(true);
  console.log('🔄 執行完整頁面刷新...');
  
  // 強制刷新頁面
  window.location.reload(true);
};

  
  // 🆕 新增：班表相關狀態
  const [scheduleData, setScheduleData] = useState(null);
  const [isClockInDisabled, setIsClockInDisabled] = useState(false);
  const [isClockOutDisabled, setIsClockOutDisabled] = useState(false);
  const [timeRestrictionMessage, setTimeRestrictionMessage] = useState('');
  const [hasCheckedIn, setHasCheckedIn] = useState(false); // 追蹤是否已經上班打卡

  // 🆕 新增：背景處理狀態
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);
  const [backgroundInfo, setBackgroundInfo] = useState({
    networkData: null,
    location: null,
    complete: false
  });

  // 其他現有狀態...
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
  const [clockInResult, setClockInResult] = useState(null);
  const [clockOutResult, setClockOutResult] = useState(null);
  const [flutterInfo, setFlutterInfo] = useState({
    ssid: null,
    bssid: null,
    privateIp: null,
    latitude: null,
    longitude: null
  });

  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

  // 🆕 新增：獲取班表資料的函數
const fetchScheduleData = useCallback(async () => {
  if (!companyId || !authToken) {
    console.log('缺少獲取班表的必要參數');
    setScheduleData(null);
    return;
  }

  try {
    console.log('開始獲取班表資料，參數:', {
      companyId,
      employeeId,
      currentDate
    });
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const response = await fetch(`https://rabbit.54ucl.com:3004/api/company/schedule?company_id=${companyId}&month=${currentMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`班表API回應錯誤: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('班表API完整回應:', responseData);
    
    if (responseData.Status === "Ok" && responseData.Data && responseData.Data.schedules) {
      console.log('班表資料獲取成功，共', responseData.Data.schedules.length, '筆記錄');
      
      // 🔥 關鍵修改：統一員工ID格式進行比較
      const normalizeEmployeeId = (id) => {
        // 將員工ID統一轉換為數字進行比較（去除前導零）
        if (!id) return 0;
        return parseInt(String(id).replace(/^0+/, '') || '0', 10);
      };
      
      const currentEmployeeIdNormalized = normalizeEmployeeId(employeeId);
      
      console.log('🔍 員工ID標準化比較:', {
        前端員工ID: employeeId,
        標準化後: currentEmployeeIdNormalized,
        資料庫中的員工ID: responseData.Data.schedules.map(s => ({
          原始: s.employee_id,
          標準化: normalizeEmployeeId(s.employee_id)
        }))
      });
      
      // 找到當前員工的班表
      const currentEmployeeSchedule = responseData.Data.schedules.find(
        schedule => {
          const scheduleEmployeeIdNormalized = normalizeEmployeeId(schedule.employee_id);
          const employeeMatch = scheduleEmployeeIdNormalized === currentEmployeeIdNormalized;
          
          // 日期比較
          const scheduleStartDate = new Date(schedule.start_date).toISOString().split('T')[0];
          const scheduleEndDate = new Date(schedule.end_date).toISOString().split('T')[0];
          const currentDateFormatted = new Date(currentDate).toISOString().split('T')[0];
          
          const dateMatch = scheduleStartDate <= currentDateFormatted && 
                           scheduleEndDate >= currentDateFormatted;
          
          console.log('📋 排班匹配檢查:', {
            資料庫員工ID: schedule.employee_id,
            標準化資料庫員工ID: scheduleEmployeeIdNormalized,
            當前員工ID: employeeId,
            標準化當前員工ID: currentEmployeeIdNormalized,
            員工匹配: employeeMatch,
            開始日期: scheduleStartDate,
            結束日期: scheduleEndDate,
            當前日期: currentDateFormatted,
            日期匹配: dateMatch,
            整體匹配: employeeMatch && dateMatch
          });
          
          return employeeMatch && dateMatch;
        }
      );

      if (currentEmployeeSchedule) {
        setScheduleData(currentEmployeeSchedule);
        console.log('✅ 找到當前員工班表:', currentEmployeeSchedule);
      } else {
        console.log('❌ 未找到當前員工的班表資料');
        console.log('可用的員工ID:', responseData.Data.schedules.map(s => s.employee_id));
        setScheduleData(null);
      }
    } else {
      console.log('班表資料獲取失敗或無資料:', responseData.Msg || '無回應訊息');
      setScheduleData(null);
    }
  } catch (err) {
    console.error('獲取班表資料失敗:', err);
    setScheduleData(null);
  }
}, [companyId, employeeId, currentDate, authToken]);


// 🆕 新增：檢查時間限制的函數（基於班表）
const checkTimeRestrictions = useCallback(() => {
  // 🆕 新增：首先檢查是否有排班資料
  if (!scheduleData || !scheduleData.shift_info) {
    console.log('沒有班表資料，禁用打卡功能');
    
    // 🆕 如果沒有排班資料，禁用所有打卡功能
    setIsClockInDisabled(true);
    setIsClockOutDisabled(true);
    setTimeRestrictionMessage('今日無排班，無法打卡');
    
    return;
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // 從班表獲取時間資訊
  const shiftInfo = scheduleData.shift_info;
  const startTime = shiftInfo.start_time; // 例如: "09:00:00"
  const endTime = shiftInfo.end_time; // 例如: "18:00:00"
  const flexibleRange = shiftInfo.flexible_range || 15; // 彈性時間，預設15分鐘
  
  // 解析開始時間
  const [startHour, startMin] = startTime.split(':').map(Number);
  const startTimeInMinutes = startHour * 60 + startMin;
  
  // 解析結束時間
  const [endHour, endMin] = endTime.split(':').map(Number);
  const endTimeInMinutes = endHour * 60 + endMin;
  
  // 計算可打卡時間範圍
  const earliestClockInTime = startTimeInMinutes - flexibleRange; // 上班前15分鐘開放
  const latestClockInTime = endTimeInMinutes; // 下班時間前都可以上班打卡
  
  console.log('時間檢查:', {
    currentTime: `${currentHour}:${String(currentMinute).padStart(2, '0')}`,
    currentTimeInMinutes,
    startTime,
    endTime,
    flexibleRange,
    earliestClockInTime: `${Math.floor(earliestClockInTime/60)}:${String(earliestClockInTime%60).padStart(2, '0')}`,
    latestClockInTime: `${Math.floor(latestClockInTime/60)}:${String(latestClockInTime%60).padStart(2, '0')}`,
    hasCheckedIn,
    hasScheduleData: !!scheduleData // 🆕 新增排班資料檢查日誌
  });

  // 檢查上班打卡限制
  let clockInDisabled = false;
  let clockInMessage = '';
  
  if (currentTimeInMinutes < earliestClockInTime) {
    // 太早不能打卡
    clockInDisabled = true;
    clockInMessage = `上班打卡開放時間：${Math.floor(earliestClockInTime/60)}:${String(earliestClockInTime%60).padStart(2, '0')} - ${endTime.substring(0,5)}`;
  } else if (currentTimeInMinutes > latestClockInTime) {
    // 超過下班時間不能上班打卡
    clockInDisabled = true;
    clockInMessage = `已超過上班打卡時間`;
  }

  // 檢查下班打卡限制
  let clockOutDisabled = false;
  let clockOutMessage = '';
  
  if (!hasCheckedIn) {
    // 沒有上班打卡就不能下班打卡
    clockOutDisabled = true;
    clockOutMessage = '請先完成上班打卡';
  } else {
    // 檢查是否超過下班時間4小時後不能打下班卡
    const maxClockOutTime = endTimeInMinutes + (4 * 60); // 下班時間後4小時
    if (currentTimeInMinutes > maxClockOutTime) {
      clockOutDisabled = true;
      const maxTime = `${Math.floor(maxClockOutTime/60)}:${String(maxClockOutTime%60).padStart(2, '0')}`;
      clockOutMessage = `下班打卡已超時（最晚至 ${maxTime}）`;
    }
  }

  // 更新狀態
  setIsClockInDisabled(clockInDisabled);
  setIsClockOutDisabled(clockOutDisabled);
  setTimeRestrictionMessage(clockInMessage || clockOutMessage);

  console.log('時間限制檢查結果:', {
    clockInDisabled,
    clockOutDisabled,
    clockInMessage,
    clockOutMessage,
    hasScheduleData: !!scheduleData // 🆕 新增排班資料檢查結果
  });
}, [scheduleData, hasCheckedIn]);


  // 🆕 新增：每分鐘檢查時間限制
  useEffect(() => {
    // 立即檢查一次
    checkTimeRestrictions();
    
    // 每分鐘檢查一次時間限制
    const timeCheckInterval = setInterval(() => {
      checkTimeRestrictions();
    }, 1000);
    
    console.log('已設置時間限制檢查，每分鐘檢查一次');
    
    return () => {
      clearInterval(timeCheckInterval);
    };
  }, [checkTimeRestrictions]);

  // 🆕 新增：當獲得公司ID和員工ID後，獲取班表資料
  useEffect(() => {
    if (companyId && employeeId && authToken && currentDate) {
      fetchScheduleData();
    }
  }, [companyId, employeeId, authToken, currentDate, fetchScheduleData]);

  // 🆕 修改：監聽打卡狀態變化，更新 hasCheckedIn
  useEffect(() => {
    setHasCheckedIn(clockInTime !== '--:--');
  }, [clockInTime]);

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

  // 🆕 修改：優化的獲取完整網路資訊函數
  const getCompleteNetworkInfo = async (maxRetries = 2, retryDelay = 300) => {
    console.log('開始獲取完整網路資訊，最大重試次數:', maxRetries);
    
    for (let i = 0; i < maxRetries; i++) {
      const info = await Checkinfo();
      
      // 🔥 降低完整資訊要求，只要有基本資訊就返回
      if (info.ssid || info.bssid || info.privateIp) {
        console.log(`第 ${i+1} 次嘗試獲取到網路資訊:`, info);
        return info;
      }
      
      console.log(`第 ${i+1} 次嘗試未獲取到網路資訊，等待 ${retryDelay}ms 後重試...`);
      // 等待一段時間再重試
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    
    // 達到最大重試次數後，返回最後一次獲取的資訊
    console.log('達到最大重試次數，返回最後一次獲取的資訊');
    return await Checkinfo();
  };

  // 修改後的 updateLocation 函數 - 允許沒有位置信息也能打卡
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
              
              // 修改：如果無法獲取位置，使用空值
              const defaultLocation = {
                latitude: null,
                longitude: null
              };
              setUserLocation(defaultLocation);
              resolve(defaultLocation);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          console.error('瀏覽器不支持地理位置功能');
          
          // 修改：如果瀏覽器不支持，使用空值
          const defaultLocation = {
            latitude: null,
            longitude: null
          };
          setUserLocation(defaultLocation);
          resolve(defaultLocation);
        }
      });
    } catch (error) {
      console.error('更新位置過程中發生錯誤:', error);
      
      // 修改：發生錯誤時也使用空值
      const defaultLocation = {
        latitude: null,
        longitude: null
      };
      setUserLocation(defaultLocation);
      return defaultLocation;
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

  // 新增：更新localStorage中的考勤結果
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

// 在 Checkin.js 中修正 fetchAttendanceRecords 函數
const fetchAttendanceRecords = useCallback(async () => {
  try {
    console.log('🔍 開始查詢考勤記錄，參數:', {
      companyId,
      employeeId,
      currentDate,
      authToken: authToken ? '已設置' : '未設置'
    });
    
    // 🔥 使用當天日期作為查詢範圍
    const response = await fetch(`https://rabbit.54ucl.com:3004/api/company/attendance?company_id=${companyId}&date=${currentDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`打卡記錄API回應錯誤: ${response.status}`);
    }

    const data = await response.json();
    console.log('打卡記錄API完整回應:', data);

    if (data.Status === "Ok" && data.Data && data.Data.records) {
      console.log('打卡記錄獲取成功，共', data.Data.records.length, '筆記錄');

      // 🔥 員工ID標準化函數
      const normalizeEmployeeId = (id) => {
        if (!id) return 0;
        return parseInt(String(id).replace(/^0+/, '') || '0', 10);
      };

      // 🔥 過濾當前員工的記錄
      const currentEmployeeIdNormalized = normalizeEmployeeId(employeeId);
      
      const currentEmployeeRecords = data.Data.records.filter(record => {
        const recordEmployeeIdNormalized = normalizeEmployeeId(record.employee_id);
        const match = recordEmployeeIdNormalized === currentEmployeeIdNormalized;
        
        console.log('🔍 打卡記錄過濾:', {
          記錄員工ID: record.employee_id,
          標準化記錄員工ID: recordEmployeeIdNormalized,
          當前員工ID: employeeId,
          標準化當前員工ID: currentEmployeeIdNormalized,
          匹配: match
        });
        
        return match;
      });

      console.log('當前員工的打卡記錄:', currentEmployeeRecords);

      if (currentEmployeeRecords.length > 0) {
        // 🔥 關鍵修改：分別處理上班和下班記錄
        
        // 找出所有上班打卡記錄，按時間排序（最新的在前）
        const checkInRecords = currentEmployeeRecords
          .filter(record => record.attendance_type === 'check_in')
          .sort((a, b) => {
            const timeA = new Date(a.record_date + ' ' + a.record_time);
            const timeB = new Date(b.record_date + ' ' + b.record_time);
            return timeB - timeA; // 降序排序，最新的在前
          });
        
        // 找出所有下班打卡記錄，按時間排序
        const checkOutRecords = currentEmployeeRecords
          .filter(record => record.attendance_type === 'check_out')
          .sort((a, b) => {
            const timeA = new Date(a.record_date + ' ' + a.record_time);
            const timeB = new Date(b.record_date + ' ' + b.record_time);
            
            // 🔥 如果你要最舊的下班記錄，使用升序排序
            // return timeA - timeB; // 升序排序，最舊的在前
            
            // 🔥 如果你要最新的下班記錄，使用降序排序
            return timeB - timeA; // 降序排序，最新的在前
          });
        
        console.log('上班打卡記錄:', checkInRecords);
        console.log('下班打卡記錄:', checkOutRecords);
        
        // 🔥 更新上班記錄 - 取最新的一筆
        if (checkInRecords.length > 0) {
          const latestCheckIn = checkInRecords[0]; // 最新的上班記錄
          const clockInTime = latestCheckIn.work_time ? 
            latestCheckIn.work_time.substring(0, 5) : '--:--';
          setClockInTime(clockInTime);
          
          console.log('✅ 設置上班時間:', clockInTime, '來自記錄:', latestCheckIn);
          
          // 設置上班考勤結果
          if (latestCheckIn.result) {
            const clockInResultData = {
              originalResult: latestCheckIn.result,
              tagClass: getTagClassFromResult(latestCheckIn.result),
              tagText: getTagTextFromResult(latestCheckIn.result)
            };
            setClockInResult(clockInResultData);
            console.log('✅ 設置上班考勤結果:', clockInResultData);
          }
          
          // 設置事件ID
          if (latestCheckIn.event_id) {
            setCurrentEventId(latestCheckIn.event_id);
          }
        }
        
        // 🔥 更新下班記錄 - 取最新的一筆（或最舊的一筆，根據你的需求）
        if (checkOutRecords.length > 0) {
          const targetCheckOut = checkOutRecords[0]; // 根據排序取第一筆
          const clockOutTime = targetCheckOut.get_off_work_time ? 
            targetCheckOut.get_off_work_time.substring(0, 5) : '--:--';
          setClockOutTime(clockOutTime);
          
          console.log('✅ 設置下班時間:', clockOutTime, '來自記錄:', targetCheckOut);
          
          // 設置下班考勤結果
          if (targetCheckOut.result) {
            const clockOutResultData = {
              originalResult: targetCheckOut.result,
              tagClass: getTagClassFromResult(targetCheckOut.result),
              tagText: getTagTextFromResult(targetCheckOut.result)
            };
            setClockOutResult(clockOutResultData);
            console.log('✅ 設置下班考勤結果:', clockOutResultData);
          }
        }
        
        // 更新打卡狀態
        if (checkOutRecords.length > 0) {
          setPunchStatus('已下班');
        } else if (checkInRecords.length > 0) {
          setPunchStatus('已上班');
        }
        
        console.log('✅ 成功更新打卡記錄顯示');
        
      } else {
        console.log('❌ 沒有找到當前員工的打卡記錄');
        
        // 🔥 如果 API 查詢失敗，嘗試從 localStorage 恢復
        const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
        const storedData = localStorage.getItem(storageKey);
        
        if (storedData) {
          try {
            const punchData = JSON.parse(storedData);
            console.log('📦 從 localStorage 找到打卡資料:', punchData);
            
            if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
              setClockInTime(punchData.clockInTime);
              console.log('✅ 從 localStorage 恢復上班時間:', punchData.clockInTime);
            }
            
            if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
              setClockOutTime(punchData.clockOutTime);
              console.log('✅ 從 localStorage 恢復下班時間:', punchData.clockOutTime);
            }
            
            // 恢復打卡狀態
            if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
              setPunchStatus('已下班');
            } else if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
              setPunchStatus('已上班');
            }
            
            // 恢復考勤結果
            if (punchData.clockInResult) {
              setClockInResult(punchData.clockInResult);
            }
            if (punchData.clockOutResult) {
              setClockOutResult(punchData.clockOutResult);
            }
            
          } catch (parseErr) {
            console.error('解析 localStorage 資料失敗:', parseErr);
          }
        }
      }
    } else {
      console.log('❌ API 查詢失敗，嘗試從 localStorage 恢復');
      
      // 從 localStorage 恢復數據的邏輯...
      const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        try {
          const punchData = JSON.parse(storedData);
          console.log('📦 從 localStorage 找到打卡資料:', punchData);
          
          if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
            setClockInTime(punchData.clockInTime);
            console.log('✅ 從 localStorage 恢復上班時間:', punchData.clockInTime);
          }
          
          if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
            setClockOutTime(punchData.clockOutTime);
            console.log('✅ 從 localStorage 恢復下班時間:', punchData.clockOutTime);
          }
          
          // 恢復打卡狀態
          if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
            setPunchStatus('已下班');
          } else if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
            setPunchStatus('已上班');
          }
          
          // 恢復考勤結果
          if (punchData.clockInResult) {
            setClockInResult(punchData.clockInResult);
          }
          if (punchData.clockOutResult) {
            setClockOutResult(punchData.clockOutResult);
          }
          
        } catch (parseErr) {
          console.error('解析 localStorage 資料失敗:', parseErr);
        }
      } else {
        console.log('❌ localStorage 中也沒有找到打卡資料');
      }
    }
    
  } catch (err) {
    console.error('❌ 查詢考勤記錄失敗:', err);
  }
}, [companyId, employeeId, currentDate, authToken, updateLocalStorageWithResults]);



// 修改後的 fetchPunchStatus 函數調用
const fetchPunchStatus = useCallback(async () => {
  const result = await fetchPunchStatusFunction({
    companyId,
    employeeId,
    currentDate,
    clockInTime,
    authToken, // 🔥 添加 authToken
    setError,
    setClockInTime,
    setClockOutTime,
    setPunchStatus,
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
    // console.error('獲取打卡狀態失敗:', result.message);
  }
}, [companyId, employeeId, currentDate, clockInTime, authToken, fetchAttendanceRecords]); // 🔥 添加 authToken 到依賴數組


  // 🔥 關鍵修改：上班打卡函數 - 立即顯示時間，背景處理其他資訊
  const handleClockIn = async () => {
    // 檢查時間限制
    if (isClockInDisabled) {
      alert(timeRestrictionMessage || '目前不在上班打卡時間範圍內');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('開始上班打卡流程...');
      
      // 🔥 關鍵修改：立即獲取並顯示當前時間
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeForDisplay = `${hours}:${minutes}`;
      
      // 🔥 立即更新UI顯示時間和狀態
      setClockInTime(timeForDisplay);
      setPunchStatus('已上班');
      setClockOutTime('--:--');
      setClockOutStatus(null);
      setClockOutResult(null);
      
      console.log('✅ 立即顯示打卡時間:', timeForDisplay);
      
      // 🔥 準備基本打卡資料（使用現有資訊）
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formattedDate = `${year}-${month}-${day}`;
      
      // 創建帶時區的 ISO 字符串
      const tzOffset = -now.getTimezoneOffset();
      const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
      const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
      const tzSign = tzOffset >= 0 ? '+' : '-';
      const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
      // 🔥 使用現有資訊構建初始 payload
      let initialPayload = {
        company_id: companyId,
        employee_id: employeeId,
        utc_timestamp: utcTimestamp,
        ssid: networkInfo.ssid || flutterInfo.ssid || 'UNKNOWN',
        bssid: networkInfo.bssid || flutterInfo.bssid || 'XX:XX:XX:XX:XX:XX',
        xtbbddtx: privateIp || flutterInfo.privateIp || '',
        public_ip: publicIp || '',
        longitude: userLocation.longitude || flutterInfo.longitude,
        latitude: userLocation.latitude || flutterInfo.latitude
      };
      
      console.log('🚀 發送初始打卡請求...');
      
      // 🔥 發送打卡請求
      const response = await fetch('https://rabbit.54ucl.com:3004/api/check-in-with-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(initialPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API回應錯誤:', response.status, errorText);
        throw new Error(`打卡失敗: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.Status !== "Ok") {
        throw new Error(responseData.Msg || '打卡處理失敗');
      }
      
      console.log('✅ 上班打卡成功:', responseData);
      
      // 獲取事件 ID
      const eventId = responseData.Data?.event_id || null;
      setCurrentEventId(eventId);
      
      // 🔥 背景處理：異步獲取其他資訊並更新記錄
      setBackgroundProcessing(true);
      
      const backgroundProcess = async () => {
        try {
          console.log('🔄 背景處理：開始獲取完整資訊...');
          
          // 並行獲取所有需要的資訊
          const [completeInfo, locationResult] = await Promise.allSettled([
            getCompleteNetworkInfo(2, 300), // 減少重試次數和間隔
            updateLocation()
          ]);
          
          // 處理網路資訊結果
          const networkData = completeInfo.status === 'fulfilled' ? completeInfo.value : {
            ssid: networkInfo.ssid || 'UNKNOWN',
            bssid: networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
            privateIp: privateIp || ''
          };
          
          // 處理位置資訊結果
          const location = locationResult.status === 'fulfilled' ? locationResult.value : {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          };
          
          console.log('🔄 背景處理：獲取到的資訊', { networkData, location });
          
          // 更新背景資訊狀態
          setBackgroundInfo({
            networkData,
            location,
            complete: true
          });
          
          // 從新 API 回應中獲取數據
          const checkInRecord = responseData.Data?.check_in_record;
          const attendanceStatus = responseData.Data?.attendance_status;

          // 獲取實際打卡時間 - 使用 work_time 而不是當前時間
          const actualWorkTime = checkInRecord?.work_time;
          let displayTime = timeForDisplay; // 預設使用當前時間

          if (actualWorkTime) {
            // 格式化 work_time 為 HH:MM 格式
            const timeParts = actualWorkTime.split(':');
            if (timeParts.length >= 2) {
              displayTime = `${timeParts[0]}:${timeParts[1]}`;
            }
          }

          // 🔄 更新UI - 使用實際打卡時間（如果與顯示時間不同）
          if (displayTime !== timeForDisplay) {
            setClockInTime(displayTime);
            console.log('🔄 更新為實際打卡時間:', displayTime);
          }

          // 處理新 API 回傳的考勤狀態
          if (attendanceStatus) {
            console.log('🔄 處理新 API 的考勤狀態:', attendanceStatus);
            
            // 設置考勤結果
            const clockInResultData = {
              originalResult: attendanceStatus.attendance_status,
              tagClass: getTagClassFromResult(attendanceStatus.attendance_status),
              tagText: attendanceStatus.message || getTagTextFromResult(attendanceStatus.attendance_status)
            };
            
            setClockInResult(clockInResultData);
            setIsLate(attendanceStatus.is_late || false);
            
            // 如果有 SSID 訊息，設置錯誤
            if (attendanceStatus.ssid_message) {
              setSsidError(attendanceStatus.ssid_message);
            }
            
            console.log('🔄 設置上班考勤結果:', clockInResultData);
          }

          // 保存打卡記錄到本地存儲 - 使用新 API 的數據
          const punchData = {
            clockInTime: displayTime, // 使用實際打卡時間
            clockInFullTime: actualWorkTime || formattedTime, // 使用完整的實際打卡時間
            clockInDate: formattedDate,
            clockInUtcTimestamp: utcTimestamp,
            clockOutTime: null,
            clockOutFullTime: null,
            clockOutDate: null,
            clockOutUtcTimestamp: null,
            eventId: eventId, // 儲存事件 ID 以便下班打卡時使用
            attendanceStatus: attendanceStatus || null, // 直接使用新 API 的狀態
            clockOutStatus: null, // 重置下班打卡狀態
            clockInResult: clockInResult, // 保持現有的上班考勤結果
            clockOutResult: null, // 重置下班考勤結果
            // 儲存從 Flutter 獲取的信息
            flutterInfo: networkData,
            // 儲存使用的位置信息
            locationUsed: location,
            // 新增：儲存完整的 API 回應數據
            apiResponse: responseData.Data
          };
          
          localStorage.setItem(`punchData_${companyId}_${employeeId}_${formattedDate}`, JSON.stringify(punchData));
          
          console.log('🔄 背景處理完成，已保存完整資料');
          
          // 🔄 延遲查詢考勤記錄以獲取上班標籤狀態
          setTimeout(() => {
            fetchAttendanceRecords();
          }, 2000);
          
        } catch (error) {
          console.error('🔄 背景處理失敗:', error);
        } finally {
          setBackgroundProcessing(false);
        }
      };
      
      // 🔥 立即開始背景處理，但不等待結果
      backgroundProcess();
      
      return {
        success: true,
        data: responseData.Data,
        eventId: eventId,
        message: '上班打卡成功'
      };
      
    } catch (err) {
      console.error('上班打卡失敗:', err);
      setError('上班打卡失敗: ' + (err.message || '未知錯誤'));
      
      // 🔥 如果打卡失敗，恢復原始狀態
      setClockInTime('--:--');
      setPunchStatus('未打卡');
      
      return {
        success: false,
        message: err.message || '上班打卡失敗',
        error: err
      };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 關鍵修改：下班打卡函數 - 立即顯示時間，背景處理其他資訊
  const handleClockOut = async () => {
    // 檢查是否已上班打卡
    if (clockInTime === '--:--') {
      setError('請先進行上班打卡');
      return {
        success: false,
        message: '請先進行上班打卡'
      };
    }

    // 檢查時間限制
    if (isClockOutDisabled) {
      alert(timeRestrictionMessage || '目前不能進行下班打卡');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('開始下班打卡流程...');
      
      // 🔥 關鍵修改：立即獲取並顯示當前時間
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeForDisplay = `${hours}:${minutes}`;
      
      // 🔥 立即更新UI顯示時間和狀態
      setClockOutTime(timeForDisplay);
      setPunchStatus('已下班');
      
      console.log('✅ 立即顯示下班打卡時間:', timeForDisplay);
      
      // 🔥 準備基本打卡資料（使用現有資訊）
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formattedDate = `${year}-${month}-${day}`;
      
      // 創建帶時區的 ISO 字符串
      const tzOffset = -now.getTimezoneOffset();
      const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
      const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
      const tzSign = tzOffset >= 0 ? '+' : '-';
      const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
      
      // 準備下班原因（如有需要）
      let reason = '';
      if (ssidError) {
        reason = `SSID錯誤: ${ssidError}`;
      }
      
      // 🔥 使用現有資訊構建初始 payload
      let initialPayload = {
        company_id: companyId,
        employee_id: employeeId,
        utc_timestamp: utcTimestamp,
        event_id: currentEventId || null,
        ssid: networkInfo.ssid || flutterInfo.ssid || 'UNKNOWN',
        bssid: networkInfo.bssid || flutterInfo.bssid || 'XX:XX:XX:XX:XX:XX',
        xtbbddtx: privateIp || flutterInfo.privateIp || '',
        public_ip: publicIp || '',
        longitude: userLocation.longitude || flutterInfo.longitude,
        latitude: userLocation.latitude || flutterInfo.latitude,
        reason: reason || null
      };
      
      console.log('🚀 發送初始下班打卡請求...');
      
      // 🔥 發送打卡請求
      const response = await fetch('https://rabbit.54ucl.com:3004/api/check-out-with-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(initialPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API回應錯誤:', response.status, errorText);
        throw new Error(`打卡失敗: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.Status !== "Ok") {
        throw new Error(responseData.Msg || '打卡處理失敗');
      }
      
      console.log('✅ 下班打卡成功:', responseData);
      
      // 🔥 背景處理：異步獲取其他資訊並更新記錄
      setBackgroundProcessing(true);
      
      const backgroundProcess = async () => {
        try {
          console.log('🔄 背景處理：開始獲取完整資訊...');
          
          // 並行獲取所有需要的資訊，包括重新獲取公共 IP
          const [completeInfo, locationResult, publicIpResult] = await Promise.allSettled([
            getCompleteNetworkInfo(2, 300),
            updateLocation(),
            // 重新獲取公共 IP
            (async () => {
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
                    return ipifyData.ip;
                  }
                }
                return publicIp || '';
              } catch (err) {
                console.error('背景獲取公共 IP 失敗:', err);
                return publicIp || '';
              }
            })()
          ]);
          
          // 處理結果
          const networkData = completeInfo.status === 'fulfilled' ? completeInfo.value : {
            ssid: networkInfo.ssid || 'UNKNOWN',
            bssid: networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
            privateIp: privateIp || ''
          };
          
          const location = locationResult.status === 'fulfilled' ? locationResult.value : {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          };
          
          const currentPublicIp = publicIpResult.status === 'fulfilled' ? publicIpResult.value : publicIp || '';
          
          console.log('🔄 背景處理：獲取到的資訊', { networkData, location, currentPublicIp });
          
          // 從新 API 回應中獲取下班數據
          const checkOutRecord = responseData.Data?.check_out_record;
          const clockOutAttendanceStatus = responseData.Data?.attendance_status;

          // 獲取實際下班打卡時間
          const actualClockOutTime = checkOutRecord?.get_off_work_time;
          let clockOutDisplayTime = timeForDisplay;

          if (actualClockOutTime) {
            const timeParts = actualClockOutTime.split(':');
            if (timeParts.length >= 2) {
              clockOutDisplayTime = `${timeParts[0]}:${timeParts[1]}`;
            }
          }

          // 🔄 更新UI - 使用實際下班打卡時間（如果與顯示時間不同）
          if (clockOutDisplayTime !== timeForDisplay) {
            setClockOutTime(clockOutDisplayTime);
            console.log('🔄 更新為實際下班打卡時間:', clockOutDisplayTime);
          }

          // 🆕 處理下班考勤狀態 - 包含事前加班申請檢查
          if (clockOutAttendanceStatus) {
            console.log('🔄 處理新 API 的下班考勤狀態:', clockOutAttendanceStatus);
            
            // 🆕 檢查是否有事前加班申請轉換
            let finalTagClass, finalTagText;
            let isPreApprovedOvertime = false;
            let overtimeApplication = null;
            
            if (clockOutAttendanceStatus.overtime_status === 'pre_approved_overtime') {
              // 如果是事前申請加班，顯示加班狀態而非滯留
              console.log('檢測到事前申請加班，更新顯示狀態');
              finalTagClass = 'overtime';
              finalTagText = '加班';
              isPreApprovedOvertime = true;
              overtimeApplication = clockOutAttendanceStatus.overtime_application;
              
              // 可以顯示額外的加班資訊提示
              if (overtimeApplication) {
                console.log(`事前加班資訊: 申請單號 ${overtimeApplication.form_number}, 加班時數 ${overtimeApplication.total_hours} 小時`);
                
                // 可選：顯示加班資訊的提示
                setTimeout(() => {
                  if (window.confirm(`下班打卡成功！\n狀態：加班 (事前申請)\n加班時數：${overtimeApplication.total_hours} 小時\n申請單號：${overtimeApplication.form_number}\n\n點擊確定查看詳細資訊`)) {
                    // 可以導向加班申請詳情頁面或顯示更多資訊
                    console.log('用戶選擇查看加班申請詳情');
                  }
                }, 1000);
              }
            } else {
              // 使用原本的狀態
              finalTagClass = getTagClassFromResult(clockOutAttendanceStatus.attendance_status);
              finalTagText = clockOutAttendanceStatus.message || getTagTextFromResult(clockOutAttendanceStatus.attendance_status);
            }
            
            const clockOutResultData = {
              originalResult: clockOutAttendanceStatus.attendance_status,
              tagClass: finalTagClass,
              tagText: finalTagText,
              // 🆕 新增加班相關資訊
              overtimeStatus: clockOutAttendanceStatus.overtime_status || null,
              overtimeApplication: overtimeApplication,
              isPreApprovedOvertime: isPreApprovedOvertime
            };
            
            setClockOutResult(clockOutResultData);
            console.log('🔄 設置下班考勤結果:', clockOutResultData);
          }

          // 更新本地存儲中的打卡記錄
          const storedData = localStorage.getItem(`punchData_${companyId}_${employeeId}_${currentDate}`);
          let punchData = storedData ? JSON.parse(storedData) : {};

          punchData.clockOutTime = clockOutDisplayTime;
          punchData.clockOutFullTime = actualClockOutTime || formattedTime;
          punchData.clockOutDate = formattedDate;
          punchData.clockOutUtcTimestamp = utcTimestamp;
          punchData.clockOutReason = reason;
          punchData.clockOutStatus = clockOutAttendanceStatus || null;
          // 🆕 保存加班相關資訊
          punchData.clockOutResult = {
            ...clockOutResult,
            overtimeStatus: clockOutAttendanceStatus?.overtime_status || null,
            overtimeApplication: clockOutAttendanceStatus?.overtime_application || null,
            isPreApprovedOvertime: clockOutAttendanceStatus?.overtime_status === 'pre_approved_overtime'
          };
          // 更新從 Flutter 獲取的信息
          punchData.flutterInfo = { ...punchData.flutterInfo, ...networkData };
          // 儲存使用的公共 IP
          punchData.publicIp = currentPublicIp;
          // 儲存使用的位置信息
          punchData.locationUsedForClockOut = location;
          // 儲存完整的 API 回應數據
          punchData.clockOutApiResponse = responseData.Data;

          localStorage.setItem(`punchData_${companyId}_${employeeId}_${currentDate}`, JSON.stringify(punchData));
          
          console.log('🔄 背景處理完成，已保存完整資料');
          
          // 🔄 延遲查詢考勤記錄
          setTimeout(() => {
            fetchAttendanceRecords();
          }, 2000);
          
        } catch (error) {
          console.error('🔄 背景處理失敗:', error);
        } finally {
          setBackgroundProcessing(false);
        }
      };
      
      // 🔥 立即開始背景處理，但不等待結果
      backgroundProcess();

      return {
        success: true,
        data: responseData.Data,
        message: '下班打卡成功'
      };
      
    } catch (err) {
      console.error('下班打卡失敗:', err);
      setError('下班打卡失敗: ' + (err.message || '未知錯誤'));
      
      // 🔥 如果打卡失敗，恢復原始狀態
      setClockOutTime('--:--');
      if (clockInTime !== '--:--') {
        setPunchStatus('已上班');
      } else {
        setPunchStatus('未打卡');
      }
      
      return {
        success: false,
        message: err.message || '下班打卡失敗',
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

  // 獲取用戶位置 - 修改為允許沒有位置信息
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
          // 修改：設置空值而不顯示錯誤
          setUserLocation({
            latitude: null,
            longitude: null
          });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      // 修改：瀏覽器不支持時也設置空值
      setUserLocation({
        latitude: null,
        longitude: null
      });
    }
  }, [flutterInfo.latitude, flutterInfo.longitude, companyId, employeeId]);

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
          const customApiResponse = await fetch('https://rabbit.54ucl.com:3004/api/client-ip', {
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
        setIpError('無法獲取 IP 地址');
        setPublicIp(''); // 使用空字符串而不是伺服器 IP
      }
    };

    if (companyId && employeeId) {
      getIpAddresses();
    }
  }, [companyId, employeeId, Checkinfo]);

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
        setNetworkError('無法獲取網絡信息');
        setNetworkInfo({
          ssid: 'UNKNOWN',
          bssid: 'XX:XX:XX:XX:XX:XX',
          isWifi: true
        });
      }
    };
    
    getNetworkInfo();
  }, [flutterInfo.ssid, flutterInfo.bssid, companyId, employeeId]);

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

  // 🆕 修改：午夜自動刷新功能
  useEffect(() => {
    // 設置精確的午夜自動刷新
    const setupMidnightAutoRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // 設定為明天的 00:00:00
      
      const timeToMidnight = tomorrow.getTime() - now.getTime();
      
      console.log(`設置午夜自動刷新，距離午夜還有 ${Math.floor(timeToMidnight / 1000 / 60)} 分鐘`);
      
      // 在午夜時自動刷新頁面
      const midnightRefreshTimer = setTimeout(() => {
        console.log('午夜到達，自動刷新頁面...');
        window.location.reload(true); // 強制從服務器重新加載
      }, timeToMidnight);
      
      return midnightRefreshTimer;
    };
    
    // 立即設置午夜刷新
    const refreshTimer = setupMidnightAutoRefresh();
    
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, []); // 空依賴數組，只在組件掛載時執行一次

  // 🆕 修改：每分鐘檢查午夜（雙重保險）
  useEffect(() => {
    // 每分鐘檢查一次是否到了午夜
    const checkMidnightAndRefresh = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // 如果是 00:00，立即刷新頁面
      if (hours === 0 && minutes === 0) {
        console.log('檢測到午夜 00:00，自動刷新頁面...');
        window.location.reload(true);
      }
    };
    
    // 立即檢查一次
    checkMidnightAndRefresh();
    
    // 每分鐘檢查一次
    const midnightCheckInterval = setInterval(checkMidnightAndRefresh, 60000);
    
    console.log('已設置午夜自動刷新檢查，每分鐘檢查一次');
    
    return () => {
      clearInterval(midnightCheckInterval);
    };
  }, []);

  // 🆕 修改：獲取當前日期和時間，並檢測日期變化（結合午夜刷新）
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
        console.log('自動刷新整個頁面...');
        
        // 直接刷新頁面，不只是重置狀態
        window.location.reload(true);
        return; // 刷新後就不需要繼續執行了
      }
      
      // 更新當前日期和前一天日期
      setCurrentDate(formattedDate);
      setPreviousDate(formattedDate);
      
      // 獲取星期幾
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      const dayOfWeek = days[now.getDay()];
      setDayOfWeek('星期' + dayOfWeek);
    };
    
    updateDateTime();
    
    // 設置定時器，每分鐘更新一次時間和日期
    const interval = setInterval(updateDateTime, 60000);
    
    // 額外的午夜檢查（雙重保險）
    const midnightCheck = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        console.log('午夜檢查：檢測到 00:00，自動刷新頁面...');
        window.location.reload(true);
      }
    }, 60000);
    
    return () => {
      clearInterval(interval);
      clearInterval(midnightCheck);
    };
  }, [previousDate]);

  // 在認證完成後獲取打卡狀態
  useEffect(() => {
    if (companyId && employeeId && currentDate) {
      fetchPunchStatus();
    }
  }, [companyId, employeeId, currentDate, fetchPunchStatus]);

  // 渲染考勤狀態信息 - 簡化版本，只保留 SSID 錯誤顯示
  const renderAttendanceStatus = () => {
    // 只保留 SSID 錯誤的顯示
    if (ssidError && clockInTime !== '--:--') {
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
            <span>使用非公司網路打卡</span>
            <span className="checkin-status-message">{ssidError}</span>
          </div>
        </div>
      );
    }
    
    // 不再顯示任何其他考勤狀態信息
    return null;
  };

// 🆕 新增：渲染時間限制提示
const renderTimeRestrictionMessage = () => {
  // 🆕 優先檢查是否有排班資料
  if (!scheduleData) {
    return (
      <div className="checkin-time-restriction-message no-schedule">
        <div className="checkin-restriction-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="#FF6B6B" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="#FF6B6B" strokeWidth="2"/>
          </svg>
        </div>
        {/* <span className="checkin-restriction-text">今日無排班，無法打卡</span> */}
      </div>
    );
  }
  
  if (timeRestrictionMessage && (isClockInDisabled || isClockOutDisabled)) {
    return (
      <div className="checkin-time-restriction-message">
        <div className="checkin-restriction-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="#FF6B6B" strokeWidth="2"/>
          </svg>
        </div>
        <span className="checkin-restriction-text">{timeRestrictionMessage}</span>
      </div>
    );
  }
  return null;
};


  // 🆕 新增：渲染班表信息（可選）
  const renderScheduleInfo = () => {
    if (scheduleData && scheduleData.shift_info) {
      const shiftInfo = scheduleData.shift_info;
      return (
        <div className="checkin-schedule-info">
          {/* <div className="checkin-schedule-title">今日班表</div> */}
          <div className="checkin-schedule-details">
            <span className="checkin-schedule-time">
              {shiftInfo.start_time.substring(0,5)} - {shiftInfo.end_time.substring(0,5)}
            </span>
            <span className="checkin-schedule-type">
              {shiftInfo.shift_category}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // 🆕 新增：渲染加班資訊
  const renderOvertimeInfo = () => {
    if (clockOutResult && clockOutResult.isPreApprovedOvertime && clockOutResult.overtimeApplication) {
      const overtimeApp = clockOutResult.overtimeApplication;
      return (
        <div className="checkin-overtime-info">
          <div className="checkin-overtime-header">
            <div className="checkin-overtime-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="#4CAF50" strokeWidth="2"/>
              </svg>
            </div>
            <span className="checkin-overtime-title">事前申請加班</span>
          </div>
          <div className="checkin-overtime-details">
            <div className="checkin-overtime-item">
              <span className="checkin-overtime-label">申請單號：</span>
              <span className="checkin-overtime-value">{overtimeApp.form_number}</span>
            </div>
            <div className="checkin-overtime-item">
              <span className="checkin-overtime-label">加班時數：</span>
              <span className="checkin-overtime-value">{overtimeApp.total_hours} 小時</span>
            </div>
            <div className="checkin-overtime-item">
              <span className="checkin-overtime-label">加班時間：</span>
              <span className="checkin-overtime-value">
                {overtimeApp.start_time?.substring(0,5)} - {overtimeApp.end_time?.substring(0,5)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 獲取上班打卡狀態標籤
  const getClockInStatusTag = () => {
    // 🔥 新增：檢查是否為請假狀態
    if (clockInTime === '--:--' && punchStatus === '請假') {
      return {
        tagClass: 'leave',
        tagText: '請假'
      };
    }
    
    if (!clockInResult) return null;
    
    return {
      tagClass: clockInResult.tagClass || '',
      tagText: clockInResult.tagText || ''
    };
  };

  // 🆕 修改：獲取下班打卡狀態標籤 - 處理事前加班申請
  const getClockOutStatusTag = () => {
    // 檢查是否為請假狀態
    if (clockOutTime === '--:--' && punchStatus === '請假') {
      return {
        tagClass: 'leave',
        tagText: '請假'
      };
    }
    
    if (!clockOutResult) return null;
    
    // 🆕 優先檢查是否為事前申請加班
    if (clockOutResult.isPreApprovedOvertime) {
      return {
        tagClass: 'overtime',
        tagText: '加班'
      };
    }
    
    return {
      tagClass: clockOutResult.tagClass || '',
      tagText: clockOutResult.tagText || ''
    };
  };

  // 🔥 添加缺失的 handleGoHome 函數
  const handleGoHome = () => {
    window.location.replace('/frontpage01');
  };

  // 處理查詢考勤
  const handleQueryAttendance = () => {
    window.location.replace('/attendance01');
  };

  return (
    <div className="checkin-container">
      <div className={`checkin-app-wrapper ${isSmallScreen ? 'small-screen' : ''}`} ref={appWrapperRef}>
        {/* 頁面標題與時間 */}
<header className="checkin-header">
  <div className="checkin-home-icon" onClick={handleGoHome}>
    <img 
      src={homeIcon} 
      alt="首頁" 
      width="22" 
      height="22" 
      style={{ objectFit: 'contain' }}
    />
  </div>
  <div className="checkin-page-title">打卡系統</div>
  
  {/* 🆕 新增完整頁面刷新按鈕 */}
  <div 
    className={`checkin-refresh-icon ${isRefreshing ? 'refreshing' : ''}`}
    onClick={handleRefresh}
    title="重新整理頁面"
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M3.51 15A9 9 0 0 0 18.36 18.36L23 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
</header>

        
        <div className="checkin-content">
          {/* 打卡區塊 */}
          <div className="checkin-punch-card">
            <div className="checkin-date-status">
              <span className="checkin-date">{currentDate} ({dayOfWeek})</span>
              <span className="checkin-status">{punchStatus}</span>
            </div>
            
            {/* 🆕 新增：顯示班表信息（可選） */}
            {/* {renderScheduleInfo()} */}
            
            <div className="checkin-time-section">
              <div className="checkin-time-header">
                <span>上班打卡時間</span>
                <span>下班打卡時間</span>
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
            
            {/* 🆕 新增：渲染加班資訊 */}
            {renderOvertimeInfo()}
            
            {/* 🆕 新增：渲染時間限制提示 */}
            {/* {renderTimeRestrictionMessage()} */}
            
<div className="checkin-button-group">
  <button 
    className={`checkin-button checkin-clock-in-button ${isClockInDisabled ? 'disabled' : ''}`}
    onClick={handleClockIn}
    disabled={loading || isClockInDisabled || !scheduleData} // 🆕 新增：沒有排班資料時也禁用
  >
    上班
  </button>
  <button 
    className={`checkin-button checkin-clock-out-button ${loading ? 'loading' : ''} ${isClockOutDisabled ? 'disabled' : ''}`}
    onClick={handleClockOut}
    disabled={clockInTime === '--:--' || loading || isClockOutDisabled || !scheduleData} // 🆕 新增：沒有排班資料時也禁用
  >
    下班
  </button>
</div>

            
            {error && <div className="checkin-error-message">{error}</div>}
          </div>
        </div>

        {/* 查詢按鈕 */}
        <div className="checkin-query-button" onClick={handleQueryAttendance}>查詢出勤狀況</div>

        {/* 載入中覆蓋層 */}
        {loading && (
          <div className="checkin-loading-overlay">
            <div className="checkin-loading-container">
              <div className="checkin-loading-spinner"></div>
              <div>處理中...</div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Checkin;
