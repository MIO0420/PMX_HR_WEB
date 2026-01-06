import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AttendancePage() {
  // 狀態定義
  const [currentTime, setCurrentTime] = useState('');
  const [statusFilter, setStatusFilter] = useState('不限');
  const [resultFilter, setResultFilter] = useState('不限');
  const [timeFilter, setTimeFilter] = useState('本月');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // API的代理伺服器URL - 調整為正確的代理路徑
  const proxyServerUrl = '/api/erp-gateway';

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

  // 獲取出勤數據
  useEffect(() => {
    fetchAttendanceData();
  }, [timeFilter, statusFilter, resultFilter]);

  // 改進的環境檢測函數
  const isInMobileApp = useCallback(() => {
    // 檢查是否存在 JavascriptChannel
    if (window.flutterBridge) {
      return true;
    }
    
    // 檢查 URL 參數
    const urlParams = new URLSearchParams(window.location.search);
    const isApp = urlParams.get('platform') === 'app';
    
    // 檢查 User-Agent
    const userAgent = navigator.userAgent.toLowerCase();
    const hasFlutterAgent = userAgent.includes('flutter') || 
                           userAgent.includes('widiget') || 
                           userAgent.includes('inappwebview');
    
    // 檢查全域變數
    const hasFlutterContext = 
      typeof window.flutter !== 'undefined' || 
      typeof window.FlutterNativeWeb !== 'undefined';
      
    return isApp || hasFlutterAgent || hasFlutterContext;
  }, []);

  // 處理返回首頁 - 優化的 Flutter 通信機制
  const handleGoHome = useCallback(() => {
    if (isInMobileApp()) {
      console.log('檢測到 App 環境，使用 Flutter 導航');
      
      try {
        // 優先使用 JavascriptChannel 通信
        if (window.flutterBridge) {
          window.flutterBridge.postMessage(JSON.stringify({ action: 'navigate_home' }));
          return;
        }
        
        // 備用方案 1: 使用 flutter.postMessage
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
          return;
        }
        
        // 備用方案 2: 使用 FlutterNativeWeb.postMessage
        if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
          return;
        }
        
        // 備用方案 3: 使用自定義事件
        const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
          detail: { action: 'navigate_home' }
        });
        document.dispatchEvent(event);
        
        // 備用方案 4: 使用 window.webkit (iOS WKWebView)
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.flutterBridge) {
          window.webkit.messageHandlers.flutterBridge.postMessage(
            JSON.stringify({ action: 'navigate_home' })
          );
          return;
        }
        
        // 如果以上方法都失敗，嘗試使用 URL scheme
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'flutterapp://navigate_home';
        document.body.appendChild(iframe);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
        
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
  }, [navigate, isInMobileApp]);

  // 根據選擇的月份獲取數據
  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 獲取當前日期
      const now = new Date();
      let targetYear, targetMonth;
      let startDate, endDate;
      
      // 計算目標月份的第一天和最後一天
      if (timeFilter === '本月') {
        targetYear = now.getFullYear();
        targetMonth = now.getMonth() + 1; // JavaScript月份從0開始
        
        // 格式化日期為YYYY-MM-01（本月第一天）
        startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        
        // 計算本月最後一天
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      } else { // 上月
        if (now.getMonth() === 0) { // 如果是1月，則上個月是去年12月
          targetYear = now.getFullYear() - 1;
          targetMonth = 12;
        } else {
          targetYear = now.getFullYear();
          targetMonth = now.getMonth(); // 上個月
        }
        
        // 格式化日期為YYYY-MM-01（上月第一天）
        startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        
        // 計算上月最後一天
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      }

      // 構建API請求體
      const requestBody = {
        "action": "query",
        "company_id": "polime",
        "data": {
          "doctype": "Attendance",
          "fields": ["name", "client_id", "checkin_time", "type", "longitude", "latitude", "device_id", "attempt"],
          "filters": [
            ["client_id", "=", "HR_00001"],
            ["checkin_time", ">=", startDate],
            ["checkin_time", "<=", endDate],
            ["attempt", "<=", 3]
          ],
          "or_filters": [
            ["type", "=", "checkout"],
            ["type", "=", "checkin"]
          ],
          "start": 0,
          "limit": 100,
          "order_by": "client_id asc, checkin_time desc"
        }
        // 移除 target_server 參數，讓代理服務器自行處理轉發
      };

      console.log('發送請求到API，請求體:', JSON.stringify(requestBody, null, 2));
      console.log('使用代理伺服器:', `${proxyServerUrl}/process-query`);
      
      // 透過代理服務器發送請求
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      // 發送API請求到正確的端點
      const response = await axios.post(`${proxyServerUrl}/process-query`, requestBody, axiosConfig);
      
      console.log('成功連接API');
      console.log('收到API回應:', response.data);
      
      // 處理API回應
      processApiResponse(response.data);
      
    } catch (err) {
      console.error('獲取出勤數據失敗:', err);
      
      // 添加錯誤詳情以便調試
      let errorMsg = `API連接失敗: ${err.message}`;
      
      if (err.response) {
        // 服務器返回錯誤響應
        errorMsg += ` (狀態碼: ${err.response.status})`;
        console.error('錯誤響應數據:', err.response.data);
      } else if (err.request) {
        // 請求發送成功但沒有收到響應
        errorMsg += ' (沒有收到響應)';
      }
      
      setError(`${errorMsg}，請手動重試。`);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // 處理API回應 - 不管格式如何都嘗試提取資料
  const processApiResponse = (apiResponse) => {
    try {
      console.log('處理API回應:', apiResponse);
      
      // 嘗試從API回應中提取記錄
      let records = [];
      
      // 如果是陣列，直接使用
      if (Array.isArray(apiResponse)) {
        records = apiResponse;
      }
      // 如果是物件，嘗試尋找資料陣列
      else if (typeof apiResponse === 'object' && apiResponse !== null) {
        // 嘗試常見的資料位置
        if (Array.isArray(apiResponse.data)) {
          records = apiResponse.data;
        } else if (apiResponse.message && Array.isArray(apiResponse.message.data)) {
          records = apiResponse.message.data;
        } else if (apiResponse.google_sheet_response && 
                  apiResponse.google_sheet_response.values && 
                  Array.isArray(apiResponse.google_sheet_response.values)) {
          // 處理Google Sheet格式
          const values = apiResponse.google_sheet_response.values;
          if (values.length > 1) {
            const headers = values[0];
            records = values.slice(1).map(row => {
              const record = {};
              headers.forEach((header, index) => {
                if (index < row.length) {
                  record[header] = row[index];
                }
              });
              return record;
            });
          }
        } else {
          // 遞迴搜尋物件中的任何陣列
          const findArrays = (obj, path = '') => {
            let foundArrays = [];
            
            Object.keys(obj).forEach(key => {
              const value = obj[key];
              const newPath = path ? `${path}.${key}` : key;
              
              if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                foundArrays.push({ path: newPath, array: value });
              } else if (typeof value === 'object' && value !== null) {
                foundArrays = [...foundArrays, ...findArrays(value, newPath)];
              }
            });
            
            return foundArrays;
          };
          
          const possibleArrays = findArrays(apiResponse);
          console.log('找到的可能陣列:', possibleArrays);
          
          // 使用找到的第一個陣列
          if (possibleArrays.length > 0) {
            records = possibleArrays[0].array;
            console.log(`使用路徑 ${possibleArrays[0].path} 的陣列`);
          }
        }
      }
      
      console.log('提取的記錄:', records);
      
      // 如果找到記錄，處理它們
      if (Array.isArray(records) && records.length > 0) {
        processAttendanceRecords(records);
      } else {
        // 如果沒有找到記錄，顯示空數據
        console.log('無法從API回應提取記錄');
        setAttendanceData([]);
        setError('無出勤記錄');
      }
    } catch (error) {
      console.error('處理API回應時出錯:', error);
      setAttendanceData([]);
      setError('處理API回應時出錯');
    }
  };

  // 處理出勤記錄
  const processAttendanceRecords = (records) => {
    try {
      console.log('處理出勤記錄:', records);
      const groupedByDate = {};
      
      // 確保記錄是陣列並且有內容
      if (!Array.isArray(records) || records.length === 0) {
        console.log('沒有記錄或記錄不是陣列');
        setAttendanceData([]);
        return;
      }
      
      records.forEach(record => {
        // 確保記錄是物件
        if (!record || typeof record !== 'object') {
          console.log('無效的記錄:', record);
          return;
        }
        
        // 嘗試提取時間和類型，適應不同的欄位名稱
        let checkinTime = null;
        let recordType = null;
        
        // 嘗試不同的可能欄位名稱
        const timeFields = ['checkin_time', 'checkinTime', 'time', 'date', 'timestamp'];
        for (const field of timeFields) {
          if (record[field]) {
            checkinTime = record[field];
            break;
          }
        }
        
        const typeFields = ['type', 'recordType', 'status', 'action'];
        for (const field of typeFields) {
          if (record[field]) {
            recordType = String(record[field]).toLowerCase();
            break;
          }
        }
        
        // 如果沒有時間信息，跳過此記錄
        if (!checkinTime) {
          console.log('記錄缺少時間信息:', record);
          return;
        }
        
        // 解析日期時間
        const checkinDate = new Date(checkinTime);
        if (isNaN(checkinDate.getTime())) {
          console.log('無效的日期:', checkinTime);
          return;
        }
        
        // 提取日期和時間
        const dateKey = checkinDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const month = checkinDate.getMonth() + 1; // 月份（1-12）
        const day = checkinDate.getDate(); // 日期（1-31）
        const formattedDate = `${month}/${day}`; // 格式化為 MM/DD
        
        // 提取時間部分 (HH:MM)
        const hours = checkinDate.getHours();
        const minutes = checkinDate.getMinutes();
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        // 如果該日期不存在於分組中，初始化
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = {
            date: formattedDate, // 使用 MM/DD 格式
            day: getDayOfWeek(checkinDate), // 星期幾
            checkIn: '--:--',
            checkOut: '--:--'
          };
        }
        
        // 根據類型更新簽到或簽退時間
        if (recordType && (recordType.includes('checkin') || recordType.includes('in'))) {
          groupedByDate[dateKey].checkIn = timeStr;
        } else if (recordType && (recordType.includes('checkout') || recordType.includes('out'))) {
          groupedByDate[dateKey].checkOut = timeStr;
        }
      });
      
      // 轉換為陣列並按日期排序
      const formattedData = Object.values(groupedByDate).sort((a, b) => {
        // 將 MM/DD 格式轉換回可比較的格式
        const [aMonth, aDay] = a.date.split('/').map(Number);
        const [bMonth, bDay] = b.date.split('/').map(Number);
        
        // 先比較月份，再比較日期
        if (aMonth !== bMonth) return bMonth - aMonth;
        return bDay - aDay;
      });
      
      console.log('格式化後的數據:', formattedData);
      setAttendanceData(formattedData);
    } catch (err) {
      console.error('處理出勤記錄時出錯:', err);
      setAttendanceData([]);
      setError('處理出勤記錄時出錯');
    }
  };

  // 輔助函數：根據日期獲取星期幾
  const getDayOfWeek = useCallback((date) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[date.getDay()];
  }, []);

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
    fetchAttendanceData();
  };

  // 樣式定義
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      height: '100vh',
      backgroundColor: '#f5f7fa',
    },
    appWrapper: {
      width: '360px',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3a75b5',
      color: 'white',
      padding: '0 16px',
      height: '50px',
    },
    homeIcon: {
      width: '30px',
      height: '30px',
      backgroundColor: '#3a75b5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    pageTitle: {
      fontSize: '16px',
      fontWeight: 'normal',
    },
    timeDisplay: {
      fontSize: '16px',
    },
    filterSection: {
      padding: '16px',
    },
    filterGroup: {
      marginBottom: '16px',
    },
    filterLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px',
      fontWeight: 'normal',
    },
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      color: '#3a75b5',
      fontWeight: 'bold',
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
    },
    button: (isActive) => ({
      padding: '10px 0',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: isActive ? '#3a75b5' : 'white',
      color: isActive ? 'white' : '#3a75b5',
      fontWeight: 'bold',
      flex: '1',
      textAlign: 'center',
      cursor: 'pointer',
    }),
    retryButton: {
      padding: '8px 16px',
      fontSize: '14px',
      backgroundColor: '#3a75b5',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '10px auto',
      display: 'block',
    },
    loadingText: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
    },
    errorText: {
      textAlign: 'center',
      padding: '20px',
      color: 'red',
    },
    monthDisplay: {
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#f5f7fa',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#3a75b5',
    },
    tableContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    dateColumn: {
      width: '80px',
      padding: '8px',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
      color: '#666',
      fontWeight: 'normal',
    },
    timeColumn: {
      padding: '8px',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
      color: '#666',
      fontWeight: 'normal',
    },
    tableRow: (isEven) => ({
      backgroundColor: isEven ? '#f5f5f5' : 'white',
      borderBottom: '1px solid #eee',
    }),
    dateCell: {
      padding: '8px',
      textAlign: 'center',
      verticalAlign: 'middle',
    },
    timeCell: {
      padding: '8px',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontSize: '16px',
    },
    dateBlock: {
      width: '45px',
      height: '45px',
      margin: '0 auto',
      borderRadius: '4px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    dateNumber: {
      backgroundColor: 'white',
      color: '#333',
      flex: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      borderBottom: '1px solid #eee'
    },
    dayOfWeek: {
      backgroundColor: '#3a75b5',
      color: 'white',
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
    },
    serverInfo: {
      padding: '5px 10px',
      backgroundColor: '#f0f8ff',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
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
          <div style={styles.pageTitle}>查詢出勤紀錄</div>
          <div style={styles.timeDisplay}>{currentTime || '15:37'}</div>
        </header>

        {/* 顯示代理伺服器資訊 */}
        <div style={styles.serverInfo}>
          使用API代理: {`${proxyServerUrl}/process-query`}
        </div>

        {/* 篩選區域 */}
        <div style={styles.filterSection}>
          {/* 出勤狀況 */}
          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>出勤狀況</div>
            <select 
              style={styles.select}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
            >
              <option>不限</option>
              <option>準時</option>
              <option>請假</option>
              <option>遲到</option>
              <option>早退</option>
              <option>曠職</option>
            </select>
          </div>
          {/* 打卡結果 */}
          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>打卡結果</div>
            <div style={styles.buttonGroup}>
              <button 
                style={styles.button(resultFilter === '不限')}
                onClick={() => setResultFilter('不限')}
              >
                不限
              </button>
              <button 
                style={styles.button(resultFilter === '正常')}
                onClick={() => setResultFilter('正常')}
              >
                正常
              </button>
              <button 
                style={styles.button(resultFilter === '異常')}
                onClick={() => setResultFilter('異常')}
              >
                異常
              </button>
            </div>
          </div>

          {/* 時間 */}
          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>時間</div>
            <div style={styles.buttonGroup}>
              <button 
                style={styles.button(timeFilter === '上月')}
                onClick={() => setTimeFilter('上月')}
              >
                上月
              </button>
              <button 
                style={styles.button(timeFilter === '本月')}
                onClick={() => setTimeFilter('本月')}
              >
                本月
              </button>
            </div>
          </div>
        </div>

        {/* 顯示當前選擇的月份 */}
        <div style={styles.monthDisplay}>
          {getCurrentMonthDisplay}
        </div>

        {/* 出勤紀錄表格 */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.dateColumn}>日期</th>
                <th style={styles.timeColumn}>上班打卡時間</th>
                <th style={styles.timeColumn}>下班打卡時間</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={styles.loadingText}>載入中...</td>
                </tr>
              ) : error && !attendanceData.length ? (
                <tr>
                  <td colSpan="3" style={styles.errorText}>
                    {error}
                    <button style={styles.retryButton} onClick={handleRetry}>
                      重新嘗試連接
                    </button>
                  </td>
                </tr>
              ) : attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="3" style={styles.loadingText}>無出勤紀錄</td>
                </tr>
              ) : (
                attendanceData.map((record, index) => {
                  return (
                    <tr key={index} style={styles.tableRow(index % 2 === 0)}>
                      {/* 日期欄位 */}
                      <td style={styles.dateCell}>
                        <div style={styles.dateBlock}>
                          <div style={styles.dateNumber}>{record.date}</div>
                          <div style={styles.dayOfWeek}>{record.day}</div>
                        </div>
                      </td>
                      
                      {/* 上班打卡時間 */}
                      <td style={styles.timeCell}>
                        {record.checkIn}
                      </td>
                      
                      {/* 下班打卡時間 */}
                      <td style={styles.timeCell}>
                        {record.checkOut}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 使用 Flutter 與 JavaScript 通信的輔助函數
const flutterCommunication = {
  // 檢查是否在 Flutter WebView 中
  isInFlutterWebView: () => {
    // 檢查是否存在 JavascriptChannel
    if (window.flutterBridge) {
      return true;
    }
    
    // 檢查 URL 參數
    const urlParams = new URLSearchParams(window.location.search);
    const isApp = urlParams.get('platform') === 'app';
    
    // 檢查 User-Agent
    const userAgent = navigator.userAgent.toLowerCase();
    const hasFlutterAgent = userAgent.includes('flutter') || 
                           userAgent.includes('widiget') || 
                           userAgent.includes('inappwebview');
    
    // 檢查全域變數
    const hasFlutterContext = 
      typeof window.flutter !== 'undefined' || 
      typeof window.FlutterNativeWeb !== 'undefined';
      
    return isApp || hasFlutterAgent || hasFlutterContext;
  },
  
  // 發送消息到 Flutter
  sendMessageToFlutter: (action, data = {}) => {
    const message = JSON.stringify({
      action,
      ...data
    });
    
    try {
      // 嘗試多種方法發送消息到 Flutter
      
      // 方法 1: 使用 JavascriptChannel (推薦方式)
      if (window.flutterBridge) {
        window.flutterBridge.postMessage(message);
        console.log('使用 flutterBridge 發送消息:', message);
        return true;
      }
      
      // 方法 2: 使用 flutter.postMessage
      if (window.flutter && window.flutter.postMessage) {
        window.flutter.postMessage(message);
        console.log('使用 flutter.postMessage 發送消息:', message);
        return true;
      }
      
      // 方法 3: 使用 FlutterNativeWeb.postMessage
      if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
        window.FlutterNativeWeb.postMessage(message);
        console.log('使用 FlutterNativeWeb.postMessage 發送消息:', message);
        return true;
      }
      
      // 方法 4: 使用自定義事件
      const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
        detail: { message }
      });
      document.dispatchEvent(event);
      console.log('使用自定義事件發送消息:', message);
      
      // 方法 5: 使用 window.webkit (iOS WKWebView)
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.flutterBridge) {
        window.webkit.messageHandlers.flutterBridge.postMessage(message);
        console.log('使用 webkit 發送消息:', message);
        return true;
      }
      
      // 方法 6: 使用 URL scheme
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `flutterapp://${action}?data=${encodeURIComponent(message)}`;
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
      console.log('使用 URL scheme 發送消息:', message);
      
      return true;
    } catch (err) {
      console.error('發送消息到 Flutter 失敗:', err);
      return false;
    }
  },
  
  // 接收來自 Flutter 的消息
  setupFlutterMessageListener: (callback) => {
    // 設置全域函數供 Flutter 調用
    window.receiveMessageFromFlutter = (message) => {
      console.log('接收到來自 Flutter 的消息:', message);
      if (typeof callback === 'function') {
        try {
          const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
          callback(parsedMessage);
        } catch (err) {
          console.error('處理 Flutter 消息時出錯:', err);
          callback(message);
        }
      }
    };
    
    // 監聽自定義事件
    document.addEventListener('messageFromFlutter', (event) => {
      console.log('接收到來自 Flutter 的事件:', event.detail);
      if (typeof callback === 'function') {
        callback(event.detail);
      }
    });
    
    console.log('已設置 Flutter 消息監聽器');
  },
  
  // 初始化 Flutter 通信
  initialize: (callback) => {
    // 設置接收消息的監聽器
    flutterCommunication.setupFlutterMessageListener(callback);
    
    // 通知 Flutter 網頁已準備好
    setTimeout(() => {
      flutterCommunication.sendMessageToFlutter('webview_ready', {
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
    }, 500);
    
    console.log('Flutter 通信已初始化');
  }
};

// 在組件外導出這個頁面
export default AttendancePage;
