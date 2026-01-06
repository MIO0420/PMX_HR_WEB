import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Schedule() {
  const [currentTime, setCurrentTime] = useState('--:--');
  const [selectedMonth, setSelectedMonth] = useState('本月');
  const [isInFlutterWebView, setIsInFlutterWebView] = useState(false);
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([
    { date: '1', shift: '開早' },
    { date: '2', shift: '休' },
    { date: '3', shift: '晚' },
    { date: '4', shift: '早' },
    { date: '5', shift: '休' },
    { date: '6', shift: '開早' },
    { date: '7', shift: '休' },
    { date: '8', shift: '晚' },
    { date: '9', shift: '早' },
    { date: '10', shift: '休' },
    { date: '11', shift: '晚' },
    { date: '12', shift: '早' },
    { date: '13', shift: '休' },
    { date: '14', shift: '晚' },
    { date: '15', shift: '早' },
    { date: '16', shift: '休' },
    { date: '17', shift: '晚' },
    { date: '18', shift: '早' },
    { date: '19', shift: '休' },
    { date: '20', shift: '晚' },
    { date: '21', shift: '早' },
    { date: '22', shift: '夜' },
    { date: '23', shift: '休' },
    { date: '24', shift: '晚' },
    { date: '25', shift: '早' },
    { date: '26', shift: '休' },
    { date: '27', shift: '晚' },
    { date: '28', shift: '早' },
    { date: '29', shift: '休' },
    { date: '30', shift: '晚' },
    { date: '31', shift: '早' },
  ]);

  // 班別對應的顏色
  const shiftColors = {
    '早': '#27ae60', // 綠色
    '午': '#f39c12', // 橙色
    '晚': '#e84393', // 粉紅色
    '夜': '#9b59b6', // 紫色
    '開早': '#1abc9c', // 青綠色
    '關店': '#a29bfe', // 淺紫色
    '休': '#bdc3c7', // 灰色
    '代班': '#f1c40f', // 黃色
  };

  // 檢測是否在 Flutter WebView 中運行
  useEffect(() => {
    // 方法1：檢查 User-Agent 是否包含 Flutter WebView 相關字串
    const userAgent = navigator.userAgent.toLowerCase();
    const isFlutterWebView = userAgent.includes('wv') || 
                             userAgent.includes('flutter') || 
                             userAgent.includes('ucl.hrapp'); // 假設您的 Flutter 應用程式有特定標識

    // 方法2：檢查是否有 Flutter 注入的全局變數或方法
    const hasFlutterInAppWebView = 
      window.flutter_inappwebview !== undefined || 
      window.FlutterInAppWebView !== undefined;

    // 方法3：嘗試通過 window.flutter 或其他 Flutter 特定對象進行通信
    const hasFlutterBridge = 
      window.flutter !== undefined || 
      window.flutterWebViewProxy !== undefined;

    // 綜合判斷
    setIsInFlutterWebView(isFlutterWebView || hasFlutterInAppWebView || hasFlutterBridge);
    
    // 在控制台輸出檢測結果，方便調試
    console.log('檢測環境：', {
      userAgent,
      isFlutterWebView,
      hasFlutterInAppWebView,
      hasFlutterBridge
    });
  }, []);

  // 更新右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 60000); // 每分鐘更新一次
    return () => clearInterval(timer);
  }, []);

  // 處理返回首頁
  const handleHomeClick = () => {
    if (isInFlutterWebView) {
      // 如果是在 Flutter WebView 中，發送消息給 Flutter 應用
      if (window.flutter_inappwebview) {
        // 使用 flutter_inappwebview 提供的方法
        window.flutter_inappwebview.callHandler('goToFlutterHome');
      } else if (window.flutter) {
        // 使用 Flutter JavaScript Channel
        window.flutter.postMessage('goToFlutterHome');
      } else {
        // 嘗試使用 postMessage API
        window.parent.postMessage('goToFlutterHome', '*');
      }
      
      // 備用方案：使用特殊的 URL scheme
      window.location.href = 'ucl://home';
    } else {
      // 如果是在瀏覽器中，使用 React Router 導航
      navigate('/frontpage');
    }
  };

  // 獲取班別顏色
  const getShiftColor = (shift) => {
    if (!shift) return 'transparent';
    
    for (const [key, color] of Object.entries(shiftColors)) {
      if (shift.includes(key)) {
        return color;
      }
    }
    return '#3a75b5'; // 預設顏色
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
      flexShrink: 0,
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
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '0',
      boxSizing: 'border-box',
    },
    monthSelector: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#fff',
      flexShrink: 0,
    },
    monthButton: {
      padding: '8px 16px',
      backgroundColor: '#e5f0fc',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#3a75b5',
      border: 'none',
    },
    activeMonthButton: {
      padding: '8px 16px',
      backgroundColor: '#3a75b5',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#fff',
      border: 'none',
    },
    calendarContainer: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
    },
    calendarHeader: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333',
      width: '100%',
      textAlign: 'center',
    },
    calendarDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      width: '100%',
      marginBottom: '8px',
      textAlign: 'center',
    },
    calendarDay: {
      fontSize: '14px',
      color: '#3a75b5',
      padding: '8px 0',
    },
    calendarDates: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      width: '100%',
    },
    calendarDate: (shift) => ({
      aspectRatio: '1/1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: getShiftColor(shift),
      borderRadius: '8px',
      fontSize: '14px',
      color: shift ? '#fff' : '#3a75b5',
      padding: '2px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }),
    emptyDate: {
      aspectRatio: '1/1',
      backgroundColor: 'transparent',
    },
    environmentIndicator: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      padding: '4px 8px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      borderRadius: '4px',
      fontSize: '10px',
      zIndex: 1000,
    },
  };

  // 獲取當前月份和年份
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  
  // 顯示的月份和年份
  const displayMonth = selectedMonth === '本月' ? currentMonth : nextMonth;
  const displayYear = selectedMonth === '本月' ? currentYear : nextMonthYear;
  
  // 計算該月的第一天是星期幾 (0-6, 0 是星期日)
  const firstDayOfMonth = new Date(displayYear, displayMonth - 1, 1).getDay();
  
  // 計算該月有多少天
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
  
  // 創建日曆格子數據
  const calendarCells = [];
  
  // 填充月份開始前的空白格子
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ isEmpty: true });
  }
  
  // 填充月份的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const dayData = scheduleData.find(item => parseInt(item.date) === day);
    calendarCells.push({
      date: day,
      shift: dayData ? dayData.shift : '',
      isEmpty: false
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* 頁面標題與時間 */}
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={handleHomeClick}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div style={styles.pageTitle}>班表查詢</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        <div style={styles.content}>
          {/* 月份選擇器 */}
          <div style={styles.monthSelector}>
            <button
              style={selectedMonth === '本月' ? styles.activeMonthButton : styles.monthButton}
              onClick={() => setSelectedMonth('本月')}
            >
              本月
            </button>
            <button
              style={selectedMonth === '下月' ? styles.activeMonthButton : styles.monthButton}
              onClick={() => setSelectedMonth('下月')}
            >
              下月
            </button>
          </div>

          {/* 日曆 */}
          <div style={styles.calendarContainer}>
            <div style={styles.calendarHeader}>{displayYear}年{displayMonth}月</div>
            
            <div style={styles.calendarDays}>
              {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                <div key={index} style={styles.calendarDay}>
                  {day}
                </div>
              ))}
            </div>
            
            <div style={styles.calendarDates}>
              {calendarCells.map((cell, index) => (
                cell.isEmpty ? (
                  <div key={index} style={styles.emptyDate}></div>
                ) : (
                  <div key={index} style={styles.calendarDate(cell.shift)}>
                    {cell.date}
                    {cell.shift && <div>{cell.shift}</div>}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        
        {/* 僅在開發環境顯示的環境指示器 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={styles.environmentIndicator}>
            {isInFlutterWebView ? 'Flutter WebView' : '瀏覽器'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;
