import { 
  validateUserFromCookies, 
  fetchAttendanceRecords, 
  processAttendanceData,
  calculateDateRange,
  formatTimeToMinutes,
  getDayOfWeek
} from './function/function'; // 引入共用函數

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AttendancePage.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';

const NEW_API_URL = "https://rabbit.54ucl.com:3004"; // 新系統API基礎地址

function AttendancePage() {
  // 狀態定義
  const [currentTime, setCurrentTime] = useState('');
  const [statusFilter, setStatusFilter] = useState('不限');
  const [resultFilter, setResultFilter] = useState('不限');
  const [timeFilter, setTimeFilter] = useState('本月');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState({ show: false });
  const [noRecords, setNoRecords] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [validatedCompanyId, setValidatedCompanyId] = useState('');
  const [validatedEmployeeId, setValidatedEmployeeId] = useState('');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showAbnormalModal, setShowAbnormalModal] = useState(false);
  const [selectedAbnormalRecord, setSelectedAbnormalRecord] = useState(null);
  const [abnormalType, setAbnormalType] = useState(''); // 新增：區分上班或下班異常
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const flutterMessageHandler = useRef(null);

  // 狀態選項
  const statusOptions = ['不限', '準時', '請假', '遲到', '早退', '曠職'];

  // 🆕 修改：檢查是否需要顯示異常按鈕的函數 - 曠職記錄也要顯示異常按鈕
  const shouldShowAbnormalButton = (record, type) => {
    // 🆕 修改：曠職記錄也要顯示異常按鈕
    if (record.isAbsent) return true;
    
    if (type === 'checkOut') {
      return record.checkOutAbnormal || 
             record.checkOutResultText === '滯留' || 
             record.checkOutResultText === '延滯' ||
             record.checkOutResultText === '早退';
    }
    
    if (type === 'checkIn') {
      return record.checkInAbnormal;
    }
    
    return false;
  };

  // 從 cookies 獲取值的函數 - 增強版，支持 Flutter WebView
  const getCookie = (name) => {
    try {
      // 方法1: 標準 document.cookie 方式
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      }, {});

      // 方法2: 從 URL 參數獲取 (Flutter WebView 常用方法)
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(name);
      
      // 方法3: 從 localStorage 獲取 (Flutter 可能存儲在這裡)
      const localStorageValue = localStorage.getItem(name);
      
      // 方法4: 從 sessionStorage 獲取
      const sessionStorageValue = sessionStorage.getItem(name);
      
      // 按優先順序返回值
      return cookies[name] || paramValue || localStorageValue || sessionStorageValue || null;
    } catch (e) {
      console.error('獲取 cookie 時出錯:', e);
      return null;
    }
  };

  // 設置 Flutter 消息處理器
  useEffect(() => {
    // 設置 Flutter 消息處理函數
    const handleFlutterMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('收到 Flutter 消息:', data);
        
        // 如果收到認證資訊，更新狀態
        if (data.company_id && data.employee_id) {
          console.log('從 Flutter 獲取認證資訊:', data);
          setValidatedCompanyId(data.company_id);
          setValidatedEmployeeId(data.employee_id);
          
          // 可選：保存到 localStorage 以便後續使用
          localStorage.setItem('company_id', data.company_id);
          localStorage.setItem('employee_id', data.employee_id);
        }
      } catch (e) {
        console.error('處理 Flutter 消息時出錯:', e);
      }
    };

    // 註冊 Flutter 消息監聽器
    if (window.flutter) {
      window.addEventListener('message', handleFlutterMessage);
      flutterMessageHandler.current = handleFlutterMessage;
      
      // 通知 Flutter 頁面已準備好接收數據
      try {
        window.flutter.postMessage(JSON.stringify({ action: 'page_ready', page: 'attendance' }));
      } catch (e) {
        console.error('無法發送準備就緒消息到 Flutter:', e);
      }
    }
    
    // 監聽 Flutter WebView 就緒事件
    document.addEventListener('flutterInAppWebViewPlatformReady', (event) => {
      console.log('Flutter WebView 已準備就緒');
      // 請求認證資訊
      if (window.flutter) {
        try {
          window.flutter.postMessage(JSON.stringify({ action: 'request_auth_info' }));
        } catch (e) {
          console.error('無法請求認證資訊:', e);
        }
      }
    });

    return () => {
      // 清理監聽器
      if (flutterMessageHandler.current) {
        window.removeEventListener('message', flutterMessageHandler.current);
      }
    };
  }, []);

  // 初始驗證
  useEffect(() => {
    if (isInitialMount.current) {
      console.log('初始驗證: 從 cookies/Flutter 驗證用戶身份');
      // 使用引入的驗證函數，修正參數順序
      validateUserFromCookies(
        setLoading,
        null, // setAuthToken
        setValidatedCompanyId,
        setValidatedEmployeeId,
        setNetworkError, // 添加網路錯誤處理
        '/applogin01/' // redirectUrl
      );
      isInitialMount.current = false;
    }
  }, []);

  // 監聽認證狀態變化，當獲取到有效認證時自動加載數據
  useEffect(() => {
    if (validatedCompanyId && validatedEmployeeId) {
      console.log('認證狀態變化: 檢測到有效認證，加載數據');
      fetchAttendanceData();
    }
  }, [validatedCompanyId, validatedEmployeeId]);

  // 獲取出勤數據
  useEffect(() => {
    if (validatedCompanyId && validatedEmployeeId) {
      fetchAttendanceData();
    }
  }, [timeFilter, statusFilter]);

  // 根據 resultFilter 篩選資料
  useEffect(() => {
    if (attendanceData.length > 0) {
      applyResultFilter();
    }
  }, [resultFilter, attendanceData]);

  // 應用結果篩選邏輯
  const applyResultFilter = () => {
    if (resultFilter === '不限') {
      // 不限制，顯示所有資料
      setFilteredAttendanceData(attendanceData);
    } else if (resultFilter === '正常') {
      // 只顯示正常的打卡記錄（沒有異常標記）
      const filtered = attendanceData.filter(record => 
        !record.checkInAbnormal && !record.checkOutAbnormal
      );
      setFilteredAttendanceData(filtered);
    } else if (resultFilter === '異常') {
      // 只顯示異常的打卡記錄（有異常標記）
      const filtered = attendanceData.filter(record => 
        record.checkInAbnormal || record.checkOutAbnormal
      );
      setFilteredAttendanceData(filtered);
    }
  };

  // 根據選擇的月份獲取數據
  const fetchAttendanceData = async () => {
    if (!validatedCompanyId || !validatedEmployeeId) {
      console.log('獲取數據失敗: 缺少認證資訊');
      // 只在本月模式顯示錯誤
      if (timeFilter === '本月') {
        setError('找不到員工資料，請重新登入');
      } else {
        setNoRecords(true);
      }
      return;
    }
    
    console.log(`開始獲取出勤數據，使用認證資訊: 公司ID=${validatedCompanyId}, 員工ID=${validatedEmployeeId}`);
    
    setLoading(true);
    setError(null);
    setNoRecords(false);

    try {
      // 使用共用函數計算日期範圍
      const { startDate, endDate, targetYear, targetMonth } = calculateDateRange(timeFilter);
      
      console.log(`查詢從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
      // 使用共用函數獲取出勤記錄
      const result = await fetchAttendanceRecords(
        validatedCompanyId, 
        validatedEmployeeId, 
        startDate, 
        endDate, 
        statusFilter
      );
      
      if (result.success) {
        console.log(`成功獲取出勤記錄:`, result.data);
        
        // 使用修改後的共用函數處理出勤數據（包含六日但不顯示曠職）
        const processedData = await processAttendanceDataWithWeekends(result.data, targetYear, targetMonth);
        
        // 統一將延滯改為滯留
        const normalizedData = processedData.map(record => ({
          ...record,
          checkOutResultText: record.checkOutResultText === '延滯' ? '滯留' : record.checkOutResultText
        }));
        
        setAttendanceData(normalizedData);
        
        // 應用結果篩選
        if (normalizedData.length === 0) {
          // 根據時間篩選設定不同的處理方式
          if (timeFilter === '上月') {
            setNoRecords(true);  // 上月無記錄時設置無記錄狀態
          } else {
            setError('本月無出勤記錄');
          }
          setFilteredAttendanceData([]);
        } else {
          // 應用結果篩選
          if (resultFilter === '不限') {
            setFilteredAttendanceData(normalizedData);
          } else if (resultFilter === '正常') {
            const filtered = normalizedData.filter(record => 
              !record.checkInAbnormal && !record.checkOutAbnormal
            );
            setFilteredAttendanceData(filtered);
          } else if (resultFilter === '異常') {
            const filtered = normalizedData.filter(record => 
              record.checkInAbnormal || record.checkOutAbnormal
            );
            setFilteredAttendanceData(filtered);
          }
        }
      } else {
        console.error('獲取出勤記錄失敗:', result.message);
        // 根據時間篩選設定不同的處理方式
        if (timeFilter === '上月') {
          setNoRecords(true);  // 上月無記錄時設置無記錄狀態
        } else {
          setError(`獲取出勤記錄失敗: ${result.message || '未知錯誤'}`);
        }
        setAttendanceData([]);
        setFilteredAttendanceData([]);
      }
    } catch (err) {
      console.error('獲取出勤數據失敗:', err);
      // 根據時間篩選設定不同的處理方式
      if (timeFilter === '上月') {
        setNoRecords(true);  // 上月無記錄時設置無記錄狀態
      } else {
        setError(`資料讀取失敗: ${err.message}`);
      }
      setAttendanceData([]);
      setFilteredAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 新增：修改後的處理出勤數據函數，包含六日但不顯示曠職
  const processAttendanceDataWithWeekends = async (data, targetYear, targetMonth) => {
    try {
      console.log('處理出勤記錄（包含六日）...', data);
      
      // 將記錄按日期分組，分別記錄上班和下班資訊
      const groupedRecords = {};
      
      // 存儲已有記錄的日期
      const datesWithRecords = new Set();
      
      // 如果有出勤記錄，先處理現有記錄
      if (data && data.records && Array.isArray(data.records) && data.records.length > 0) {
        // 按日期分組並分離上班和下班記錄
        console.log('按日期分組並分離上班和下班記錄...');
        
        // 首先按日期和事件ID對記錄進行分組
        const recordsByDate = {};
        
        data.records.forEach(record => {
          const workDate = record.work_date;
          if (!workDate) return;
          
          if (!recordsByDate[workDate]) {
            recordsByDate[workDate] = {};
          }
          
          if (!recordsByDate[workDate][record.event_id]) {
            recordsByDate[workDate][record.event_id] = [];
          }
          
          recordsByDate[workDate][record.event_id].push(record);
        });
        
        // 遍歷每個日期，找出最新的上班和下班記錄
        for (const dateKey in recordsByDate) {
          datesWithRecords.add(dateKey);
          
          const dateParts = dateKey.split(/[/-]/);
          if (dateParts.length !== 3) continue;
          
          const month = parseInt(dateParts[1], 10);
          const day = parseInt(dateParts[2], 10);
          const formattedDate = `${day}`;
          
          // 建立日期物件以獲取星期幾
          const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
          const dayOfWeek = getDayOfWeek(dateObj);
          
          // 初始化該日期的記錄
          groupedRecords[dateKey] = {
            date: formattedDate,
            day: dayOfWeek,
            fullDate: dateKey,
            checkIn: '--:--',
            checkOut: '--:--',
            checkInResult: '',
            checkOutResult: '',
            checkInResultText: '',
            checkOutResultText: '',
            checkInAbnormal: false,
            checkOutAbnormal: false
          };
          
          // 找出最新的上班和下班記錄
          let latestCheckIn = null;
          let latestCheckOut = null;
          
          for (const eventId in recordsByDate[dateKey]) {
            const records = recordsByDate[dateKey][eventId];
            
            // 分離上班和下班記錄
            const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
            const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
            
            // 如果有上班記錄，找出最新的一筆
            if (checkInRecords.length > 0) {
              const newestCheckIn = checkInRecords.reduce((newest, current) => {
                const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
                const currentDate = new Date(current.record_date + ' ' + current.record_time);
                return currentDate > newestDate ? current : newest;
              }, checkInRecords[0]);
              
              if (!latestCheckIn || new Date(newestCheckIn.record_date + ' ' + newestCheckIn.record_time) > 
                                   new Date(latestCheckIn.record_date + ' ' + latestCheckIn.record_time)) {
                latestCheckIn = newestCheckIn;
              }
            }
            
            // 如果有下班記錄，找出最新的一筆
            if (checkOutRecords.length > 0) {
              const newestCheckOut = checkOutRecords.reduce((newest, current) => {
                const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
                const currentDate = new Date(current.record_date + ' ' + current.record_time);
                return currentDate > newestDate ? current : newest;
              }, checkOutRecords[0]);
              
              if (!latestCheckOut || new Date(newestCheckOut.record_date + ' ' + newestCheckOut.record_time) > 
                                    new Date(latestCheckOut.record_date + ' ' + latestCheckOut.record_time)) {
                latestCheckOut = newestCheckOut;
              }
            }
          }
          
          // 更新該日期的上班記錄
          if (latestCheckIn) {
            groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
            groupedRecords[dateKey].checkInResult = latestCheckIn.result;
            
            // 完整的請假狀態檢查
            const isLeaveResult = [
              'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
              'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
              'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
              'study_leave', 'birthday_leave', 'leave'
            ].includes(latestCheckIn.result);
            
            if (isLeaveResult) {
              // 所有請假類型統一顯示為「請假」
              groupedRecords[dateKey].checkInResultText = '請假';
              groupedRecords[dateKey].checkInAbnormal = false; // 請假不算異常
            } else if (latestCheckIn.result === 'late') {
              groupedRecords[dateKey].checkInResultText = '遲到';
              groupedRecords[dateKey].checkInAbnormal = true;
            } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
              groupedRecords[dateKey].checkInResultText = '準時';
              groupedRecords[dateKey].checkInAbnormal = false;
            } else if (latestCheckIn.result === 'too_early') {
              groupedRecords[dateKey].checkInResultText = '過早';
              groupedRecords[dateKey].checkInAbnormal = true;
            } else if (latestCheckIn.result === 'overtime' || latestCheckIn.result === 'over_time') {
              groupedRecords[dateKey].checkInResultText = '加班';
              groupedRecords[dateKey].checkInAbnormal = false; // 加班不標記為異常
            } else {
              groupedRecords[dateKey].checkInResultText = '準時';
              groupedRecords[dateKey].checkInAbnormal = false;
            }
          }
          
          // 更新該日期的下班記錄
          if (latestCheckOut) {
            groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
            groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
            
            // 完整的請假狀態檢查
            const isLeaveResult = [
              'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
              'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
              'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
              'study_leave', 'birthday_leave', 'leave'
            ].includes(latestCheckOut.result);
            
            if (isLeaveResult) {
              // 所有請假類型統一顯示為「請假」
              groupedRecords[dateKey].checkOutResultText = '請假';
              groupedRecords[dateKey].checkOutAbnormal = false; // 請假不算異常
            } else if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
              groupedRecords[dateKey].checkOutResultText = '早退';
              groupedRecords[dateKey].checkOutAbnormal = true;
            } else if (latestCheckOut.result === 'stay_late') {
              groupedRecords[dateKey].checkOutResultText = '滯留';
              groupedRecords[dateKey].checkOutAbnormal = true; // 標記為異常
            } else if (latestCheckOut.result === 'stay') {
              groupedRecords[dateKey].checkOutResultText = '滯留';
              groupedRecords[dateKey].checkOutAbnormal = true;
            } else if (latestCheckOut.result === 'overtime') {
              groupedRecords[dateKey].checkOutResultText = '加班';
              groupedRecords[dateKey].checkOutAbnormal = false; // 加班不標記為異常
            } else if (latestCheckOut.result === 'over_time') {
              groupedRecords[dateKey].checkOutResultText = '延滯';
              groupedRecords[dateKey].checkOutAbnormal = false;
            } else if (latestCheckOut.result === 'on_time') {
              groupedRecords[dateKey].checkOutResultText = '準時';
              groupedRecords[dateKey].checkOutAbnormal = false;
            } else if (latestCheckOut.result === 'unknown') {
              groupedRecords[dateKey].checkOutResultText = '準時'; // 改為準時而不是未知
              groupedRecords[dateKey].checkOutAbnormal = false;
            } else {
              groupedRecords[dateKey].checkOutResultText = '準時';
              groupedRecords[dateKey].checkOutAbnormal = false;
            }
          }
        }
      }
      
      // 🆕 修改：為沒有打卡記錄的日期添加空白記錄（包含六日，但只有平日才標記曠職）
      await addAllDaysWithConditionalAbsent(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
      // 轉換為陣列並按日期排序 - 修改為降序排序（由新到舊）
      console.log('格式化最終數據...');
      const formattedData = Object.values(groupedRecords)
        .map(item => {
          // 🆕 修改：只有平日的曠職記錄才標記為異常
          if (item.isAbsent) {
            return {
              ...item,
              checkInAbnormal: true,
              checkOutAbnormal: true,
              checkInResultText: '曠職',
              checkOutResultText: '曠職'
            };
          }
          
          return item;
        })
        .sort((a, b) => {
          // 按照日期降序排序
          const dateA = new Date(a.fullDate);
          const dateB = new Date(b.fullDate);
          return dateB - dateA;
        });
      
      console.log('格式化後的數據（包含六日）:', formattedData);
      return formattedData;
    } catch (err) {
      console.error('處理出勤記錄時出錯:', err);
      throw err;
    }
  };

// 🆕 新增：為所有日期添加記錄，但只有平日才標記曠職
const addAllDaysWithConditionalAbsent = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
  // 獲取該月的天數
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  
  // 獲取當前日期
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  
  // 🆕 修改：計算應該顯示到哪一天
  let maxDay;
  if (targetYear === currentYear && targetMonth === currentMonth) {
    // 如果是當前月份，只顯示到今天
    maxDay = currentDay;
  } else {
    // 如果是過去的月份，顯示整個月
    maxDay = daysInMonth;
  }
  
  // 🆕 修改：遍歷該月的每一天，但只到 maxDay
  for (let day = 1; day <= maxDay; day++) {
    // 格式化日期
    const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 如果該日期已有記錄，則跳過
    if (datesWithRecords.has(dateStr)) {
      continue;
    }
    
    // 建立日期物件
    const dateObj = new Date(targetYear, targetMonth - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0是星期日，1-5是星期一到五，6是星期六
    const dayOfWeekText = getDayOfWeek(dateObj);
    
    // 判斷是否為過去的日期（在當前日期之前）
    const isPastDate = (targetYear < currentYear) || 
                       (targetYear === currentYear && targetMonth < currentMonth) ||
                       (targetYear === currentYear && targetMonth === currentMonth && day < currentDay);
    
    // 🆕 修改：所有日期都添加記錄，但只有平日的過去日期才標記為曠職
    const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5; // 平日
    const shouldMarkAsAbsent = isPastDate && isWorkday; // 只有過去的平日才標記曠職
    
    groupedRecords[dateStr] = {
      date: String(day),
      day: dayOfWeekText,
      fullDate: dateStr,
      checkIn: '--:--',
      checkOut: '--:--',
      checkInTimestamp: 0,
      checkOutTimestamp: 0,
      checkInEventId: null,
      checkOutEventId: null,
      checkInResult: '',
      checkOutResult: '',
      isAbsent: shouldMarkAsAbsent, // 🆕 只有過去的平日才標記為曠職
      checkInAbnormal: shouldMarkAsAbsent, // 🆕 只有曠職才標記為異常
      checkOutAbnormal: shouldMarkAsAbsent, // 🆕 只有曠職才標記為異常
      checkInResultText: shouldMarkAsAbsent ? '曠職' : '', // 🆕 只有曠職才顯示曠職文字
      checkOutResultText: shouldMarkAsAbsent ? '曠職' : '' // 🆕 只有曠職才顯示曠職文字
    };
  }
};


  // 顯示當前選擇的月份
  const getCurrentMonthDisplay = useMemo(() => {
    const now = new Date();
    let targetMonth, targetYear;

    if (timeFilter === '本月') {
      targetMonth = now.getMonth() + 1;
      targetYear = now.getFullYear();
    } else {
      targetMonth = now.getMonth();
      if (targetMonth === 0) {
        targetMonth = 12;
        targetYear = now.getFullYear() - 1;
      } else {
        targetYear = now.getFullYear();
      }
    }

    return `${targetYear}年${targetMonth}月`;
  }, [timeFilter]);

  // 重試功能
  const handleRetry = () => {
    setError(null);
    // 使用引入的驗證函數，修正參數順序
    validateUserFromCookies(
      setLoading,
      null, // setAuthToken
      setValidatedCompanyId,
      setValidatedEmployeeId,
      setNetworkError, // 添加網路錯誤處理
      '/applogin01/' // redirectUrl
    ); // 重新驗證並獲取數據
  };

  // 網路錯誤重試功能
  const handleNetworkRetry = () => {
    setNetworkError({ show: false });
    validateUserFromCookies(
      setLoading,
      null,
      setValidatedCompanyId,
      setValidatedEmployeeId,
      setNetworkError,
      '/applogin01/'
    );
  };

  // 處理狀態選擇
  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setShowStatusPicker(false);
  };

  // 處理上班異常按鈕點擊
  const handleCheckInAbnormalClick = (record) => {
    setSelectedAbnormalRecord(record);
    setAbnormalType('checkIn'); // 設置為上班異常
    setShowAbnormalModal(true);
  };

  // 處理下班異常按鈕點擊
  const handleCheckOutAbnormalClick = (record) => {
    setSelectedAbnormalRecord(record);
    setAbnormalType('checkOut'); // 設置為下班異常
    setShowAbnormalModal(true);
  };

  // 🆕 新增：處理曠職記錄的異常按鈕點擊
  const handleAbsentAbnormalClick = (record) => {
    setSelectedAbnormalRecord(record);
    setAbnormalType('absent'); // 🆕 設置為曠職異常
    setShowAbnormalModal(true);
  };

  // 關閉異常彈窗
  const closeAbnormalModal = () => {
    setShowAbnormalModal(false);
    setSelectedAbnormalRecord(null);
    setAbnormalType('');
  };

// 🆕 處理請假申請 - 參考補卡申請的邏輯
const handleLeaveApply = () => {
  console.log('跳轉到請假申請頁面');
  
  if (!selectedAbnormalRecord) {
    console.error('沒有選中的異常記錄');
    return;
  }
  
  // 🔥 關鍵：參考補卡申請的邏輯，準備異常資料
  const abnormalData = {
    // 基本資訊 - 與補卡申請相同格式
    date: selectedAbnormalRecord.fullDate, // 異常日期 (YYYY-MM-DD)
    displayDate: selectedAbnormalRecord.fullDate, // 用於顯示的日期
    dayOfWeek: selectedAbnormalRecord.day, // 星期幾
    
    // 🔥 關鍵：根據異常類型智能設定請假時間
    startTime: '09:00', // 🔥 統一預設開始時間為 9:00
    endTime: (() => {
      if (abnormalType === 'absent') {
        // 曠職：全天請假到 18:00
        return '18:00';
      } else if (abnormalType === 'checkIn' && selectedAbnormalRecord.checkInResultText === '遲到') {
        // 🔥 遲到：結束時間為實際打卡時間
        const actualCheckInTime = selectedAbnormalRecord.checkIn;
        if (actualCheckInTime && actualCheckInTime !== '--:--') {
          return actualCheckInTime; // 例如：14:06
        }
        return '10:00'; // 備用時間
      } else if (abnormalType === 'checkOut' && selectedAbnormalRecord.checkOutResultText === '早退') {
        // 早退：從實際下班時間開始請假到 18:00
        return '18:00';
      } else {
        // 其他情況預設到 18:00
        return '18:00';
      }
    })(),
    
    // 🔥 關鍵：請假類型和原因設定
    // 🔥 關鍵：請假類型和原因設定
    type: (() => {
      if (abnormalType === 'absent') return '曠職補請假';
      if (abnormalType === 'checkIn' && selectedAbnormalRecord.checkInResultText === '遲到') return '遲到補請假';
      if (abnormalType === 'checkOut' && selectedAbnormalRecord.checkOutResultText === '早退') return '早退補請假';
      return '異常補請假';
    })(),
    
    reason: (() => {
      if (abnormalType === 'absent') return '曠職補請假申請';
      if (abnormalType === 'checkIn' && selectedAbnormalRecord.checkInResultText === '遲到') return '遲到補請假申請';
      if (abnormalType === 'checkOut' && selectedAbnormalRecord.checkOutResultText === '早退') return '早退補請假申請';
      return '異常補請假申請';
    })(),
    
    // 異常相關資訊
    abnormalType: abnormalType,
    abnormalReason: abnormalType === 'checkIn' 
      ? selectedAbnormalRecord.checkInResultText 
      : (abnormalType === 'absent' ? '曠職' : selectedAbnormalRecord.checkOutResultText),
    
    // 🔥 關鍵：實際打卡時間資訊（用於時間計算）
    actualCheckInTime: selectedAbnormalRecord.checkIn || null,
    actualCheckOutTime: selectedAbnormalRecord.checkOut || null,
    
    // 🔥 關鍵：標記資訊（與補卡申請相同邏輯）
    fromAbnormal: true, // 標記來源為異常按鈕
    fromAbsent: abnormalType === 'absent',
    fromLate: abnormalType === 'checkIn' && selectedAbnormalRecord.checkInResultText === '遲到',
    fromEarlyLeave: abnormalType === 'checkOut' && selectedAbnormalRecord.checkOutResultText === '早退',
    timestamp: Date.now() // 時間戳，用於驗證資料新鮮度
  };
  
  console.log('🔍 準備傳遞的請假異常資料:', abnormalData);
  
  // 🔥 關鍵：將異常資料存入 sessionStorage（與補卡申請相同方式）
  sessionStorage.setItem('abnormalLeaveData', JSON.stringify(abnormalData));
  
  // 關閉異常彈窗
  closeAbnormalModal();
  
  // 導航邏輯（與補卡申請相同）
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
    try {
      if (window.flutter && window.flutter.postMessage) {
        window.flutter.postMessage(JSON.stringify({ 
          action: 'navigate_to_page',
          page: '/apply01',
          data: abnormalData
        }));
      } else {
        window.location.href = '/apply01';
      }
    } catch (err) {
      console.error('無法使用 Flutter 導航:', err);
      window.location.href = '/apply01';
    }
  } else {
    window.location.href = '/apply01';
  }
};


// 處理申請補打卡 - 修改版本，自動帶入異常資料
const handleReplenishApply = () => {
  console.log('跳轉到補打卡申請頁面，帶入異常資料');
  
  if (!selectedAbnormalRecord) {
    console.error('沒有選中的異常記錄');
    return;
  }
  
  // 準備要傳遞的異常資料
  const abnormalData = {
    // 基本資訊
    date: selectedAbnormalRecord.fullDate, // 異常日期 (YYYY-MM-DD)
    displayDate: selectedAbnormalRecord.fullDate, // 用於顯示的日期
    dayOfWeek: selectedAbnormalRecord.day, // 星期幾
    
    // 補卡類型和時間
    type: abnormalType === 'checkIn' ? '上班' : (abnormalType === 'absent' ? '上班' : '下班'), // 🆕 修改：曠職預設為上班補卡
    originalTime: abnormalType === 'checkIn' 
      ? selectedAbnormalRecord.checkIn 
      : (abnormalType === 'absent' ? '--:--' : selectedAbnormalRecord.checkOut), // 🆕 修改：曠職時間顯示為 --:--
    
    // 異常資訊
    abnormalReason: abnormalType === 'checkIn' 
      ? selectedAbnormalRecord.checkInResultText 
      : (abnormalType === 'absent' ? '曠職' : selectedAbnormalRecord.checkOutResultText), // 🆕 修改：曠職原因
    abnormalType: abnormalType, // 'checkIn'、'checkOut' 或 'absent'
    
    // 標記資訊
    fromAbnormal: true, // 標記來源為異常按鈕
    isAbsent: abnormalType === 'absent', // 🆕 新增：標記是否為曠職
    timestamp: Date.now() // 時間戳，用於驗證資料新鮮度
  };
  
  console.log('準備傳遞的異常資料:', abnormalData);
  
  // 將異常資料存入 sessionStorage
  sessionStorage.setItem('abnormalReplenishData', JSON.stringify(abnormalData));
  
  // 關閉異常彈窗
  closeAbnormalModal();
  
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
    // App 環境：使用 Flutter 導航
    try {
      if (window.flutter && window.flutter.postMessage) {
        window.flutter.postMessage(JSON.stringify({ 
          action: 'navigate_to_page',
          page: '/replenishapply01',
          data: abnormalData // 傳遞異常資料給 Flutter
        }));
      } else {
        // 備用方案
        window.location.href = '/replenishapply01';
      }
    } catch (err) {
      console.error('無法使用 Flutter 導航:', err);
      window.location.href = '/replenishapply01';
    }
  } else {
    // 瀏覽器環境：直接導航
    window.location.href = '/replenishapply01';
  }
};

// 🆕 處理忙自己的事按鈕 - 修改版本，也導航到補卡申請頁面並自動填入資料
const handlePersonalBusiness = () => {
  console.log('跳轉到補卡申請頁面（忙自己的事），帶入異常資料');
  
  if (!selectedAbnormalRecord) {
    console.error('沒有選中的異常記錄');
    return;
  }
  
  // 🆕 準備要傳遞的異常資料（與申請補打卡相同的邏輯）
  const abnormalData = {
    // 基本資訊
    date: selectedAbnormalRecord.fullDate, // 異常日期 (YYYY-MM-DD)
    displayDate: selectedAbnormalRecord.fullDate, // 用於顯示的日期
    dayOfWeek: selectedAbnormalRecord.day, // 星期幾
    
    // 補卡類型和時間 - 忙自己的事通常是下班相關
    type: abnormalType === 'checkIn' ? '上班' : '下班', // 補卡類型
    originalTime: abnormalType === 'checkIn' 
      ? selectedAbnormalRecord.checkIn 
      : selectedAbnormalRecord.checkOut, // 已打卡時間
    
    // 異常資訊
    abnormalReason: abnormalType === 'checkIn' 
      ? selectedAbnormalRecord.checkInResultText 
      : selectedAbnormalRecord.checkOutResultText, // 異常原因
    abnormalType: abnormalType, // 'checkIn' 或 'checkOut'
    
    // 🆕 標記資訊 - 特別標記為忙自己的事
    fromAbnormal: true, // 標記來源為異常按鈕
    isPersonalBusiness: true, // 🆕 標記為忙自己的事
    timestamp: Date.now() // 時間戳，用於驗證資料新鮮度
  };
  
  console.log('準備傳遞的忙自己的事異常資料:', abnormalData);
  
  // 將異常資料存入 sessionStorage
  sessionStorage.setItem('abnormalReplenishData', JSON.stringify(abnormalData));
  
  // 關閉異常彈窗
  closeAbnormalModal();
  
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
    // App 環境：使用 Flutter 導航到補卡申請頁面
    try {
      if (window.flutter && window.flutter.postMessage) {
        window.flutter.postMessage(JSON.stringify({ 
          action: 'navigate_to_page',
          page: '/replenishapply01', // 🆕 修改：導航到補卡申請頁面
          data: abnormalData // 傳遞異常資料給 Flutter
        }));
      } else {
        // 備用方案
        window.location.href = '/replenishapply01';
      }
    } catch (err) {
      console.error('無法使用 Flutter 導航:', err);
      window.location.href = '/replenishapply01';
    }
  } else {
    // 瀏覽器環境：直接導航到補卡申請頁面
    window.location.href = '/replenishapply01';
  }
};

// 🆕 處理加班按鈕 - 修改版本，導航到加班申請頁面並自動填入資料
const handleOvertime = () => {
  console.log('跳轉到加班申請頁面，帶入異常資料');
  
  if (!selectedAbnormalRecord) {
    console.error('沒有選中的異常記錄');
    return;
  }
  
  // 🆕 準備要傳遞的加班資料
  const overtimeData = {
    // 基本資訊
    date: selectedAbnormalRecord.fullDate, // 異常日期 (YYYY-MM-DD)
    displayDate: selectedAbnormalRecord.fullDate, // 用於顯示的日期
    dayOfWeek: selectedAbnormalRecord.day, // 星期幾
    
    // 加班時間設定
    startTime: '18:00', // 🆕 開始時間固定為18:00
    endTime: abnormalType === 'checkOut' 
      ? selectedAbnormalRecord.checkOut 
      : '20:00', // 🆕 結束時間使用打卡時間，如果沒有則預設20:00
    
    // 異常資訊
    abnormalReason: abnormalType === 'checkIn' 
      ? selectedAbnormalRecord.checkInResultText 
      : selectedAbnormalRecord.checkOutResultText, // 異常原因
    abnormalType: abnormalType, // 'checkIn' 或 'checkOut'
    
    // 🆕 標記資訊 - 特別標記為加班申請
    fromAbnormal: true, // 標記來源為異常按鈕
    isOvertimeApplication: true, // 🆕 標記為加班申請
    timestamp: Date.now() // 時間戳，用於驗證資料新鮮度
  };
  
  console.log('準備傳遞的加班異常資料:', overtimeData);
  
  // 將加班資料存入 sessionStorage
  sessionStorage.setItem('abnormalOvertimeData', JSON.stringify(overtimeData));
  
  // 關閉異常彈窗
  closeAbnormalModal();
  
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
    // App 環境：使用 Flutter 導航到加班申請頁面
    try {
      if (window.flutter && window.flutter.postMessage) {
        window.flutter.postMessage(JSON.stringify({ 
          action: 'navigate_to_page',
          page: '/workovertimeapply01', // 🆕 修改：導航到加班申請頁面
          data: overtimeData // 傳遞加班資料給 Flutter
        }));
      } else {
        // 備用方案
        window.location.href = '/workovertimeapply01';
      }
    } catch (err) {
      console.error('無法使用 Flutter 導航:', err);
      window.location.href = '/workovertimeapply01';
    }
  } else {
    // 瀏覽器環境：直接導航到加班申請頁面
    window.location.href = '/workovertimeapply01';
  }
};


  // 處理返回首頁 - 修改為使用 replace 而不是 href
  const handleGoHome = () => {
    // 檢查是否為手機 app 環境
    const isInMobileApp = () => {
      // 檢查是否存在 Flutter 相關的全域變數或特定的 User-Agent
      // 或者檢查 URL 參數中是否有 app 標記
      const urlParams = new URLSearchParams(window.location.search);
      const isApp = urlParams.get('platform') === 'app';
      
      // 檢查 User-Agent 是否包含 Flutter 相關標記
      const userAgent = navigator.userAgent.toLowerCase();
      const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
      // 檢查是否有 Flutter 注入的全域變數或方法
      const hasFlutterContext = 
        typeof window.flutter !== 'undefined' || 
        typeof window.FlutterNativeWeb !== 'undefined';
        
      return isApp || hasFlutterAgent || hasFlutterContext;
    };

    if (isInMobileApp()) {
      // 如果是 app 環境，使用 Flutter 的導航方法
      console.log('檢測到 App 環境，使用 Flutter 導航');
      
      try {
        // 嘗試調用 Flutter 提供的導航方法，添加 replace 參數
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ 
            action: 'navigate_home',
            replace: true // 添加 replace 參數
          }));
        } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ 
            action: 'navigate_home',
            replace: true // 添加 replace 參數
          }));
        } else {
          // 發送自定義事件，Flutter 可以監聽此事件
          const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
            detail: { 
              action: 'navigate_home',
              replace: true // 添加 replace 參數
            }
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error('無法使用 Flutter 導航:', err);
        // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用 replace 導航
        window.location.replace('/frontpage01');
      }
    } else {
      // 如果是瀏覽器環境，使用 window.location.replace 導航
      console.log('瀏覽器環境，使用 window.location.replace 導航');
      window.location.replace('/frontpage01');
    }
  };

  // 添加登出/切換帳號處理函數
  const handleLogout = () => {
    // 清除狀態
    setValidatedCompanyId('');
    setValidatedEmployeeId('');
    setAttendanceData([]);
    setFilteredAttendanceData([]);
    
    // 清除 localStorage
    localStorage.removeItem('company_id');
    localStorage.removeItem('employee_id');
    
    // 通知 Flutter 登出
    if (window.flutter) {
      try {
        window.flutter.postMessage(JSON.stringify({ action: 'logout' }));
      } catch (e) {
        console.error('無法通知 Flutter 登出:', e);
      }
    }
    
    // 重新導向到登入頁面
    window.location.replace = '/applogin01/';
  };

  // 添加錯誤處理組件
  const ErrorMessage = ({ message, onClose, onRetry }) => {
    return (
      <div className="attendance-error-container">
        <div className="attendance-error-message">
          <div className="attendance-error-icon">⚠️</div>
          <div className="attendance-error-text">{message}</div>
          <div className="attendance-error-actions">
            {onRetry && (
              <button className="attendance-error-retry" onClick={onRetry}>重試</button>
            )}
            <button className="attendance-error-close" onClick={onClose}>✕</button>
          </div>
        </div>
      </div>
    );
  };

  // 🆕 修改：異常詳情彈窗組件 - 支援曠職記錄和遲到請假
  const AbnormalModal = ({ record, abnormalType, onClose }) => {
    if (!record || !abnormalType) return null;

    // 🆕 修改：獲取異常詳細信息的函數 - 支援曠職和遲到請假
    const getAbnormalDetails = (record, abnormalType) => {
      // 格式化日期為 MM/DD 格式
      const formatDateForModal = (record) => {
        const currentDate = new Date();
        let targetMonth, targetYear;
        
        // 根據 timeFilter 判斷是本月還是上月
        if (timeFilter === '本月') {
          targetMonth = currentDate.getMonth() + 1;
          targetYear = currentDate.getFullYear();
        } else {
          targetMonth = currentDate.getMonth();
          if (targetMonth === 0) {
            targetMonth = 12;
            targetYear = currentDate.getFullYear() - 1;
          } else {
            targetYear = currentDate.getFullYear();
          }
        }
        
        // 返回 MM/DD 格式
        return `${targetMonth}/${record.date}`;
      };

      const details = {
        date: formatDateForModal(record),
        abnormalTime: '',
        reasons: [],
        type: '',
        isAbsent: record.isAbsent, // 🆕 新增：標記是否為曠職
        isLate: false // 🆕 新增：標記是否為遲到
      };

      // 🆕 修改：處理曠職情況
      if (record.isAbsent || abnormalType === 'absent') {
        details.abnormalTime = '--:--';
        details.type = '曠職';
        details.reasons = [
          '• 未打卡上班',
          '• 未申請請假或補打卡'
        ];
        return details;
      }

      if (abnormalType === 'checkIn') {
        // 上班異常
        details.abnormalTime = record.checkIn;
        details.type = record.checkInResultText || '上班異常';
        
        // 🆕 新增：檢查是否為遲到
        if (record.checkInResultText === '遲到') {
          details.isLate = true;
          details.reasons = [
            '• 未申請補打卡',
            '• 未申請請假' // 🆕 新增：遲到也可以申請請假
          ];
        } else {
          details.reasons = [
            '• 未申請補打卡'
          ];
        }
      } else if (abnormalType === 'checkOut') {
        // 下班異常
        details.abnormalTime = record.checkOut;
        details.type = record.checkOutResultText || '下班異常';
        
        // 根據下班異常類型設定不同的原因，統一處理滯留
        if (record.checkOutResultText === '早退') {
          details.reasons = [
            '• 提早下班未申請',
            '• 未申請補卡/請假'
          ];
        } else if (record.checkOutResultText === '滯留' || record.checkOutResultText === '延滯') {
          details.reasons = [
            '• 未選擇滯留事由',
            '• 未申請補卡/加班'
          ];
        } else {
          details.reasons = [
            '• 未選擇滯留事由',
            '• 未申請補卡/加班'
          ];
        }
      }

      return details;
    };

    const abnormalDetails = getAbnormalDetails(record, abnormalType);

    return (
      <div className="attendance-abnormal-overlay" onClick={onClose}>
        <div className="attendance-abnormal-container" onClick={(e) => e.stopPropagation()}>
          <div className="attendance-abnormal-header">
            <span className="attendance-abnormal-title">出勤異常原因</span>
            <button className="attendance-abnormal-close" onClick={onClose}>✕</button>
          </div>
          
          <div className="attendance-abnormal-content">
            <div className="attendance-abnormal-date">
              {abnormalDetails.date} {abnormalDetails.abnormalTime} {abnormalDetails.type}
            </div>
            
            <div className="attendance-abnormal-reasons">
              {abnormalDetails.reasons.map((reason, index) => (
                <div key={index} className="attendance-abnormal-reason-item">
                  {reason}
                </div>
              ))}
            </div>
            
            {/* 🆕 修改：根據異常類型顯示不同的按鈕 */}
            <div className="attendance-abnormal-actions">
              {abnormalDetails.isAbsent || abnormalType === 'absent' ? (
                // 🆕 曠職記錄：顯示請假和申請補打卡按鈕
                <>
                  <button 
                    className="attendance-abnormal-action-btn leave-apply"
                    onClick={handleLeaveApply}
                  >
                    請假
                  </button>
                  <button 
                    className="attendance-abnormal-action-btn replenish-apply"
                    onClick={handleReplenishApply}
                  >
                    申請補打卡
                  </button>
                </>
              ) : abnormalType === 'checkIn' ? (
                // 🆕 修改：上班異常 - 遲到顯示請假和申請補打卡，其他只顯示申請補打卡
                abnormalDetails.isLate ? (
                  <>
                    <button 
                      className="attendance-abnormal-action-btn leave-apply"
                      onClick={handleLeaveApply}
                    >
                      請假
                    </button>
                    <button 
                      className="attendance-abnormal-action-btn replenish-apply"
                      onClick={handleReplenishApply}
                    >
                      申請補打卡
                    </button>
                  </>
                ) : (
                  <button 
                    className="attendance-abnormal-action-btn replenish-apply"
                    onClick={handleReplenishApply}
                  >
                    申請補打卡
                  </button>
                )
              ) : (
                // 下班異常：顯示忙自己的事和加班按鈕
                <>
                  <button 
                    className="attendance-abnormal-action-btn personal"
                    onClick={handlePersonalBusiness}
                  >
                    忙自己的事
                  </button>
                  <button 
                    className="attendance-abnormal-action-btn overtime"
                    onClick={handleOvertime}
                  >
                    加班
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="attendance-container">
      <div className="attendance-app-wrapper">
        {/* 頁面標題與時間 */}
        <header className="attendance-header">
          <div className="attendance-home-icon" onClick={handleGoHome}>
            <img 
              src={homeIcon} 
              alt="首頁" 
              width="20" 
              height="20" 
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div className="attendance-page-title">查詢出勤紀錄</div>
          <div className="attendance-time-display">{currentTime}</div>
        </header>

        {/* 顯示網路錯誤訊息 */}
        {networkError.show && (
          <ErrorMessage 
            message={networkError.message} 
            onClose={() => setNetworkError({ show: false })}
            onRetry={
              networkError.type === 'network_error' || 
              networkError.type === 'timeout_error' || 
              networkError.type === 'api_error' 
                ? handleNetworkRetry 
                : null
            }
          />
        )}

        {/* 顯示一般錯誤訊息 - 只在本月且有真正錯誤時顯示 */}
        {error && timeFilter === '本月' && error !== '無出勤紀錄' && error !== '本月無出勤記錄' && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        {/* 篩選區域 */}
        <div className="attendance-filter-section">
          {/* 出勤狀況 */}
          <div className="attendance-filter-group">
            <div className="attendance-filter-label">出勤狀況</div>
            <div 
              className="attendance-status-selector"
              onClick={() => setShowStatusPicker(true)}
            >
              <span className="attendance-status-value">{statusFilter}</span>
              <span className="attendance-dropdown-arrow">▼</span>
            </div>
          </div>
          {/* 打卡結果 */}
          <div className="attendance-filter-group">
            <div className="attendance-filter-label">打卡結果</div>
            <div className="attendance-button-group">
              <button 
                className={`attendance-button ${resultFilter === '不限' ? 'active' : ''}`}
                onClick={() => setResultFilter('不限')}
              >
                不限
              </button>
              <button 
                className={`attendance-button ${resultFilter === '正常' ? 'active' : ''}`}
                onClick={() => setResultFilter('正常')}
              >
                正常
              </button>
              <button 
                className={`attendance-button ${resultFilter === '異常' ? 'active' : ''}`}
                onClick={() => setResultFilter('異常')}
              >
                異常
              </button>
            </div>
          </div>
          {/* 時間 */}
          <div className="attendance-filter-group">
            <div className="attendance-filter-label">時間</div>
            <div className="attendance-button-group">
              <button 
                className={`attendance-button ${timeFilter === '上月' ? 'active' : ''}`}
                onClick={() => setTimeFilter('上月')}
              >
                上月
              </button>
              <button 
                className={`attendance-button ${timeFilter === '本月' ? 'active' : ''}`}
                onClick={() => setTimeFilter('本月')}
              >
                本月
              </button>
            </div>
          </div>
        </div>
        
        {/* 出勤紀錄表格 */}
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="attendance-date-column"></th>
                <th className="attendance-time-column">上班打卡時間</th>
                <th className="attendance-time-column">下班打卡時間</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="attendance-loading-text">載入中...</td>
                </tr>
              ) : noRecords || (error && !filteredAttendanceData.length) ? (
                <tr>
                  <td colSpan="3" className="attendance-error-text">
                    無出勤紀錄
                    {/* 只在本月且有真正錯誤時顯示重試按鈕 */}
                    {timeFilter === '本月' && error && error !== '無出勤紀錄' && error !== '本月無出勤記錄' && (
                      <button className="attendance-retry-button" onClick={handleRetry}>
                        重新嘗試連接
                      </button>
                    )}
                  </td>
                </tr>
              ) : filteredAttendanceData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="attendance-loading-text">無符合條件的出勤紀錄</td>
                </tr>
              ) : (
                filteredAttendanceData.map((record, index) => {
                  return (
                    <tr key={index} className={`attendance-table-row ${
                      record.isAbsent 
                        ? 'attendance-absent-row'  // 曠職記錄使用灰色背景
                        : (record.checkInAbnormal || record.checkOutAbnormal) 
                          ? 'attendance-late-row'  // 其他異常記錄（如遲到、早退）使用紅色背景
                          : ''
                    }`}>
                      {/* 日期欄位 */}
                      <td className="attendance-date-cell">
                        <div className="attendance-date-block">
                          <div className="attendance-date-number">{record.date}</div>
                          <div className="attendance-day-of-week">{record.day}</div>
                        </div>
                      </td>
                      
{/* 🆕 修改：上班打卡時間 - 曠職記錄也顯示異常按鈕 */}
<td className="attendance-time-cell">
  {/* 曠職標籤顯示 */}
  {record.isAbsent ? (
    <div className="attendance-status-tag">曠職</div>
  ) : (record.checkInResultText && record.checkInResultText !== '準時') || 
      ['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
       'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
       'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave', 'leave'].includes(record.checkInResult) ? (
    <div className={`attendance-status-tag ${
      record.checkInResultText === '加班' || record.checkInResult === 'overtime' ? 'overtime-tag' : 
      (['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
        'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
        'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave', 'leave'].includes(record.checkInResult) || 
       record.checkInResultText === '請假') ? 'leave-tag' : ''
    }`}>
      {['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
        'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
        'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave', 'leave'].includes(record.checkInResult) 
        ? '請假' 
        : record.checkInResultText}
    </div>
  ) : null}
  <span className={record.checkInAbnormal ? 'attendance-abnormal-time' : ''}>
    {record.checkIn}
  </span>
  {/* 🆕 修改：曠職記錄也顯示異常按鈕 */}
  {shouldShowAbnormalButton(record, 'checkIn') && (
    <button 
      className="attendance-abnormal-button"
      onClick={() => record.isAbsent ? handleAbsentAbnormalClick(record) : handleCheckInAbnormalClick(record)}
    >
      異常
    </button>
  )}
</td>

{/* 🆕 修改：下班打卡時間 - 曠職記錄也顯示異常按鈕 */}
<td className="attendance-time-cell">
  {/* 曠職標籤顯示 */}
  {record.isAbsent ? (
    <div className="attendance-status-tag">曠職</div>
  ) : record.checkOutResultText && record.checkOutResultText !== '準時' && (
    <div className={`attendance-status-tag ${
      record.checkOutResultText === '加班' ? 'overtime-tag' : 
      (
        ['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
         'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
         'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave', 'leave'].includes(record.leaveStatus) ||
        ['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
         'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
         'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave'].includes(record.checkOutResultText) ||
        (record.checkOutResultText && record.checkOutResultText.includes('假'))
      ) ? 'leave-tag' : ''
    }`}>
      {/* 檢查多個條件來判斷是否為請假 */}
      {(
        // 檢查 leaveStatus
        ['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
         'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
         'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave', 'leave'].includes(record.leaveStatus) ||
        // 檢查 checkOutResultText 是否包含請假相關字詞
        ['annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 'menstrual_leave', 
         'compensatory_leave', 'makeup_leave', 'marriage_leave', 'prenatal_checkup_leave', 
         'maternity_leave', 'paternity_leave', 'study_leave', 'birthday_leave'].includes(record.checkOutResultText) ||
        // 檢查是否包含「假」字
        (record.checkOutResultText && record.checkOutResultText.includes('假'))
      ) ? '請假' : (record.checkOutResultText === '延滯' ? '滯留' : record.checkOutResultText)}
    </div>
  )}
  <span className={record.checkOutAbnormal ? 'attendance-abnormal-time' : ''}>
    {record.checkOut === '--:--' ? '--:--' : record.checkOut}
  </span>
  {/* 🆕 修改：曠職記錄也顯示異常按鈕 */}
  {shouldShowAbnormalButton(record, 'checkOut') && (
    <button 
      className="attendance-abnormal-button"
      onClick={() => record.isAbsent ? handleAbsentAbnormalClick(record) : handleCheckOutAbnormalClick(record)}
    >
      異常
    </button>
  )}
</td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 載入中指示器 */}
        {loading && (
          <div className="attendance-loading-overlay">
            <div className="attendance-loading-spinner"></div>
            <div className="attendance-loading-text">處理中，請稍候...</div>
          </div>
        )}

        {/* 狀態選擇器彈出視窗 */}
        {showStatusPicker && (
          <div className="attendance-picker-overlay" onClick={() => setShowStatusPicker(false)}>
            <div className="attendance-picker-container" onClick={(e) => e.stopPropagation()}>
              <div className="attendance-picker-header">
                <span className="attendance-picker-title">出勤狀態</span>
                <button 
                  className="attendance-picker-close"
                  onClick={() => setShowStatusPicker(false)}
                >
                  ✕
                </button>
              </div>
              <div className="attendance-picker-options">
                {statusOptions.map((option) => (
                  <div
                    key={option}
                    className={`attendance-picker-option ${statusFilter === option ? 'selected' : ''}`}
                    onClick={() => handleStatusSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 異常詳情彈窗 */}
        {showAbnormalModal && (
          <AbnormalModal 
            record={selectedAbnormalRecord}
            abnormalType={abnormalType}
            onClose={closeAbnormalModal}
          />
        )}
      </div>
    </div>
  );
}

export default AttendancePage;