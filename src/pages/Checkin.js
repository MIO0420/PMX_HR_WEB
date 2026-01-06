import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Checkin() {
  const [currentTime, setCurrentTime] = useState('--:--');
  const [currentDate, setCurrentDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [punchStatus, setPunchStatus] = useState('未打卡');
  const [clockInTime, setClockInTime] = useState('--:--');
  const [clockOutTime, setClockOutTime] = useState('--:--');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null
  });
  const [locationError, setLocationError] = useState(null);
  const [networkInfo, setNetworkInfo] = useState({
    privateIp: '',
    wifiSSID: 'netline',
    wifiBSSID: 'netline'
  });
  const navigate = useNavigate();
  
  // API的代理伺服器URL
  const proxyServerUrl = '/api/erp-gateway';

  // 獲取用戶位置
  useEffect(() => {
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
          setLocationError(`無法獲取位置: ${error.message}`);
          
          // 設置默認位置（台北市）
          setUserLocation({
            latitude: 25.0330,
            longitude: 121.5654
          });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setLocationError('您的瀏覽器不支持地理位置功能');
      
      // 設置默認位置（台北市）
      setUserLocation({
        latitude: 25.0330,
        longitude: 121.5654
      });
    }
  }, []);

  // 獲取網絡信息
  useEffect(() => {
    const getNetworkInfo = async () => {
      try {
        // 嘗試獲取本地IP地址
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // 初始化網絡信息對象
        const info = {
          privateIp: ipData.ip || '',
          wifiSSID: 'netline',
          wifiBSSID: 'netline'
        };

        // 嘗試獲取WiFi信息（如果瀏覽器支持）
        if (navigator.connection && 'type' in navigator.connection) {
          console.log('連接類型:', navigator.connection.type);
          
          // 檢查是否為WiFi連接
          if (navigator.connection.type === 'wifi') {
            try {
              // 嘗試使用Network Information API獲取WiFi信息
              // 注意：大多數瀏覽器出於安全考慮不允許直接訪問WiFi SSID和BSSID
              // 這裡我們嘗試使用可能的API，但可能無法在所有瀏覽器中工作
              if (navigator.wifi && navigator.wifi.getCurrentNetworks) {
                const networks = await navigator.wifi.getCurrentNetworks();
                if (networks && networks.length > 0) {
                  info.wifiSSID = networks[0].ssid || 'netline';
                  info.wifiBSSID = networks[0].bssid || 'netline';
                }
              }
            } catch (wifiErr) {
              console.log('無法獲取WiFi詳細信息:', wifiErr);
            }
          }
        }
        
        console.log('網絡信息:', info);
        setNetworkInfo(info);
      } catch (err) {
        console.error('獲取網絡信息失敗:', err);
        setNetworkInfo({
          privateIp: '',
          wifiSSID: 'netline',
          wifiBSSID: 'netline'
        });
      }
    };

    getNetworkInfo();
  }, []);

  // 使用 useCallback 記憶化 fetchPunchStatus 函數
  const fetchPunchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 獲取當前日期
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // 構建API請求體
      const requestBody = {
        "action": "query",
        "company_id": "polime",
        "data": {
          "doctype": "Attendance",
          "fields": ["name", "client_id", "checkin_time", "type", "longitude", "latitude", "device_id", "attempt"],
          "filters": [
            ["client_id", "=", "HR_00001"],
            ["checkin_time", ">=", `${dateStr} 00:00:00`],
            ["checkin_time", "<=", `${dateStr} 23:59:59`],
            ["attempt", "<=", 3]
          ],
          "or_filters": [
            ["type", "=", "checkout"],
            ["type", "=", "checkin"]
          ],
          "start": 0,
          "limit": 10,
          "order_by": "checkin_time asc"
        }
      };
      
      console.log('發送請求以獲取今日打卡狀態:', JSON.stringify(requestBody, null, 2));
      
      // 發送API請求
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      const response = await axios.post(`${proxyServerUrl}/process-query`, requestBody, axiosConfig);
      
      console.log('成功獲取打卡狀態');
      console.log('API回應:', response.data);
      
      // 處理API回應
      let records = [];
      
      if (Array.isArray(response.data)) {
        records = response.data;
      } else if (typeof response.data === 'object' && response.data !== null) {
        if (Array.isArray(response.data.data)) {
          records = response.data.data;
        } else if (response.data.message && Array.isArray(response.data.message.data)) {
          records = response.data.message.data;
        }
      }
      
      // 處理打卡記錄
      let hasCheckin = false;
      let hasCheckout = false;
      let checkinTimeValue = null;
      let checkoutTimeValue = null;
      
      records.forEach(record => {
        if (!record || typeof record !== 'object') return;
        
        const recordType = record.type ? record.type.toLowerCase() : '';
        const checkinTimeStr = record.checkin_time;
        
        if (!checkinTimeStr) return;
        
        const checkinDate = new Date(checkinTimeStr);
        if (isNaN(checkinDate.getTime())) return;
        
        const hours = checkinDate.getHours().toString().padStart(2, '0');
        const minutes = checkinDate.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        
        if (recordType.includes('checkin')) {
          hasCheckin = true;
          checkinTimeValue = timeStr;
          setClockInTime(timeStr);
        } else if (recordType.includes('checkout')) {
          hasCheckout = true;
          checkoutTimeValue = timeStr;
          setClockOutTime(timeStr);
        }
      });
      
      // 更新打卡狀態
      if (hasCheckin && hasCheckout) {
        setPunchStatus('已下班');
      } else if (hasCheckin) {
        setPunchStatus('已上班');
      } else {
        setPunchStatus('未打卡');
        setClockInTime('--:--');
        setClockOutTime('--:--');
      }
      
    } catch (err) {
      console.error('獲取打卡狀態失敗:', err);
      setError('獲取打卡狀態失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新當前時間
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      // 更新日期和星期
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      setCurrentDate(`${year}-${month}-${day}`);
      
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      setDayOfWeek(weekdays[now.getDay()]);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 每分鐘更新一次
    
    // 獲取打卡狀態
    fetchPunchStatus();
    
    return () => clearInterval(interval);
  }, [fetchPunchStatus]);

  // 更新位置和網絡信息
  const updateLocationAndNetwork = async () => {
    try {
      // 更新位置
      let updatedLocation = userLocation;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });
          
          updatedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(updatedLocation);
          setLocationError(null);
          console.log('已更新位置:', updatedLocation);
        } catch (error) {
          console.error('更新位置失敗:', error.message);
          setLocationError(`無法獲取位置: ${error.message}`);
          // 使用已有的位置或默認位置
          if (!updatedLocation.latitude) {
            updatedLocation = { latitude: 25.0330, longitude: 121.5654 };
            setUserLocation(updatedLocation);
          }
        }
      }
      
      // 更新網絡信息
      try {
        // 嘗試獲取本地IP地址
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        const updatedNetworkInfo = {
          privateIp: ipData.ip || '',
          wifiSSID: 'netline',
          wifiBSSID: 'netline'
        };

        // 嘗試獲取WiFi信息（如果瀏覽器支持）
        if (navigator.connection && 'type' in navigator.connection) {
          if (navigator.connection.type === 'wifi') {
            try {
              if (navigator.wifi && navigator.wifi.getCurrentNetworks) {
                const networks = await navigator.wifi.getCurrentNetworks();
                if (networks && networks.length > 0) {
                  updatedNetworkInfo.wifiSSID = networks[0].ssid || 'netline';
                  updatedNetworkInfo.wifiBSSID = networks[0].bssid || 'netline';
                }
              }
            } catch (wifiErr) {
              console.log('無法獲取WiFi詳細信息:', wifiErr);
            }
          }
        }
        
        setNetworkInfo(updatedNetworkInfo);
        console.log('已更新網絡信息:', updatedNetworkInfo);
      } catch (err) {
        console.error('更新網絡信息失敗:', err);
      }
      
      return {
        location: updatedLocation,
        networkInfo: networkInfo
      };
    } catch (err) {
      console.error('更新位置和網絡信息失敗:', err);
      return {
        location: userLocation.latitude ? userLocation : { latitude: 25.0330, longitude: 121.5654 },
        networkInfo: networkInfo
      };
    }
  };

  // 處理上班打卡
  const handleClockIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 先更新位置和網絡信息
      const { location, networkInfo } = await updateLocationAndNetwork();
      
      // 獲取當前時間
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const checkinTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      // 構建API請求體
      const requestBody = {
        "action": "attendance",
        "company_id": "polime",
        "data": { 
          "client_id": "HR_00001",
          "device_id": "DEVICE001",
          "checkin_time": checkinTime,
          "longitude": location.longitude,
          "latitude": location.latitude, 
          "type": "checkin",
          "attempt": 1,
          "private_ip": networkInfo.privateIp,
          "wifi_ssid": networkInfo.wifiSSID,
          "wifi_bssid": networkInfo.wifiBSSID
        } 
      };
      
      console.log('發送上班打卡請求:', JSON.stringify(requestBody, null, 2));
      
      // 發送API請求
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
      console.log('上班打卡成功');
      console.log('API回應:', response.data);
      
      // 更新UI
      setClockInTime(currentTime);
      setPunchStatus('已上班');
      
    } catch (err) {
      console.error('上班打卡失敗:', err);
      setError('上班打卡失敗: ' + (err.message || '未知錯誤'));
    } finally {
      setLoading(false);
    }
  };

  // 處理下班打卡
  const handleClockOut = async () => {
    if (clockInTime === '--:--') {
      setError('請先進行上班打卡');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 先更新位置和網絡信息
      const { location, networkInfo } = await updateLocationAndNetwork();
      
      // 獲取當前時間
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const checkinTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      // 構建API請求體
      const requestBody = {
        "action": "attendance",
        "company_id": "polime",
        "data": { 
          "client_id": "HR_00001",
          "device_id": "DEVICE001",
          "checkin_time": checkinTime,
          "longitude": location.longitude,
          "latitude": location.latitude, 
          "type": "checkout",
          "attempt": 1,
          "private_ip": networkInfo.privateIp,
          "wifi_ssid": networkInfo.wifiSSID,
          "wifi_bssid": networkInfo.wifiBSSID
        } 
      };
      
      console.log('發送下班打卡請求:', JSON.stringify(requestBody, null, 2));
      
      // 發送API請求
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
      console.log('下班打卡成功');
      console.log('API回應:', response.data);
      
      // 更新UI
      setClockOutTime(currentTime);
      setPunchStatus('已下班');
      
    } catch (err) {
      console.error('下班打卡失敗:', err);
      setError('下班打卡失敗: ' + (err.message || '未知錯誤'));
    } finally {
      setLoading(false);
    }
  };

  // 處理查詢出勤狀況
  const handleQueryAttendance = () => {
    navigate('/attendance');
  };

  // 處理返回首頁 - 修改後的函數，能夠區分瀏覽器請求和手機app請求
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
        // 嘗試調用 Flutter 提供的導航方法
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else {
          // 發送自定義事件，Flutter 可以監聽此事件
          const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
            detail: { action: 'navigate_home' }
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error('無法使用 Flutter 導航:', err);
        // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用普通導航
        navigate('/frontpage');
      }
    } else {
      // 如果是瀏覽器環境，使用正常的 React Router 導航
      console.log('瀏覽器環境，使用 React Router 導航');
      navigate('/frontpage');
    }
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

  // 樣式定義
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
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    punchCard: {
      backgroundColor: '#3a75b5',
      borderRadius: '10px',
      padding: '16px',
      color: 'white',
    },
    dateStatus: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    date: {
      fontSize: '14px',
      fontWeight: 'bold',
    },
    status: {
      fontSize: '16px',
      fontWeight: 'bold',
    },
    timeSection: {
      textAlign: 'center',
    },
    timeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#C4D4E8',
      marginBottom: '8px',
    },
    timeValues: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    timeValue: {
      fontSize: '28px',
      fontWeight: 'bold',
    },
    timeArrow: {
      fontSize: '20px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '16px',
    },
    button: {
      width: '48%',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
    },
    clockInButton: {
      backgroundColor: clockInTime === '--:--' ? '#FFFFFF' : '#C5C5C5',
      color: clockInTime === '--:--' ? '#3a75b5' : '#919191',
      cursor: clockInTime === '--:--' && !loading ? 'pointer' : 'not-allowed',
      opacity: loading ? 0.7 : 1,
    },
    clockOutButton: {
      backgroundColor: clockInTime !== '--:--' && clockOutTime === '--:--' ? '#FFFFFF' : '#C5C5C5',
      color: clockInTime !== '--:--' && clockOutTime === '--:--' ? '#3a75b5' : '#919191',
      cursor: clockInTime !== '--:--' && clockOutTime === '--:--' && !loading ? 'pointer' : 'not-allowed',
      opacity: loading ? 0.7 : 1,
    },
    attendanceSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      padding: '16px',
      border: '1px solid #E9E9E9',
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#3a75b5',
      marginBottom: '12px',
    },
    attendanceList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    attendanceItem: {
      fontSize: '14px',
      color: '#1F1F1F',
      paddingBottom: '8px',
      borderBottom: '1px solid #E9E9E9',
    },
    queryButton: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      padding: '12px',
      backgroundColor: '#FFFFFF',
      border: '2px solid #C4D4E8',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#3a75b5',
      textAlign: 'center',
      cursor: 'pointer',
    },
    errorMessage: {
      color: '#ff4d4f',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '8px',
    },
    serverInfo: {
      padding: '5px 10px',
      backgroundColor: '#f0f8ff',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
    },
    locationInfo: {
      padding: '5px 10px',
      backgroundColor: '#f8fff0',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
    },
    networkInfo: {
      padding: '5px 10px',
      backgroundColor: '#fff8f0',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
    },
    locationError: {
      backgroundColor: '#fff0f0',
      color: '#ff4d4f',
    },
    loadingOverlay: loading ? {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    } : { display: 'none' },
    loadingText: {
      color: '#3a75b5',
      fontSize: '18px',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* 頁面標題與時間 */}
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={handleGoHome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div style={styles.pageTitle}>打卡系統</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        {/* 顯示代理伺服器資訊 */}
        <div style={styles.serverInfo}>
          使用API代理: {`${proxyServerUrl}/process-request`}
        </div>

        {/* 顯示位置資訊 */}
        <div style={{...styles.locationInfo, ...(locationError ? styles.locationError : {})}}>
          {locationError ? 
            `${locationError} (使用預設位置)` : 
            userLocation.latitude ? 
              `位置已獲取: 緯度 ${userLocation.latitude.toFixed(4)}, 經度 ${userLocation.longitude.toFixed(4)}` : 
              '正在獲取位置...'
          }
        </div>

        {/* 顯示網絡資訊 */}
        <div style={styles.networkInfo}>
          網絡資訊: IP {networkInfo.privateIp || '未獲取'}, 
          SSID {networkInfo.wifiSSID}, 
          BSSID {networkInfo.wifiBSSID}
        </div>

        <div style={styles.content}>
          {/* 打卡區塊 */}
          <div style={styles.punchCard}>
            <div style={styles.dateStatus}>
              <span style={styles.date}>{currentDate} ({dayOfWeek})</span>
              <span style={styles.status}>{punchStatus}</span>
            </div>
            <div style={styles.timeSection}>
              <div style={styles.timeHeader}>
                <span>上班打卡時間</span>
                <span>下班打卡時間</span>
              </div>
              <div style={styles.timeValues}>
                <span style={styles.timeValue}>{clockInTime}</span>
                <span style={styles.timeArrow}>&gt;</span>
                <span style={styles.timeValue}>{clockOutTime}</span>
              </div>
            </div>
            <div style={styles.buttonGroup}>
              <button 
                style={{...styles.button, ...styles.clockInButton}} 
                onClick={handleClockIn}
                disabled={clockInTime !== '--:--' || loading}
              >
                上班
              </button>
              <button 
                style={{...styles.button, ...styles.clockOutButton}} 
                onClick={handleClockOut}
                disabled={(clockInTime === '--:--' || clockOutTime !== '--:--') || loading}
              >
                下班
              </button>
            </div>
            {error && <div style={styles.errorMessage}>{error}</div>}
          </div>

          {/* 本月考勤通知 */}
          <div style={styles.attendanceSection}>
            <div style={styles.sectionTitle}>本月考勤通知</div>
            <div style={styles.attendanceList}>
              <div style={styles.attendanceItem}>【遲到】5次，共計15分鐘</div>
              <div style={styles.attendanceItem}>【曠職】1次</div>
              <div style={styles.attendanceItem}>【早退】3次</div>
              <div style={styles.attendanceItem}>【下班滯留】2次</div>
            </div>
          </div>
        </div>

        {/* 查詢按鈕 */}
        <div style={styles.queryButton} onClick={handleQueryAttendance}>查詢出勤狀況</div>

        {/* 載入中覆蓋層 */}
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingText}>處理中...</div>
        </div>
      </div>
    </div>
  );
}

export default Checkin;
