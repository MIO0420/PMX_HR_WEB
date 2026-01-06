// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useEmployee } from '../contexts/EmployeeContext';
// import Cookies from 'js-cookie';
// import homeIcon from './HomePageImage/homepage.png';
// import { API_BASE_URL } from '../config'; // 引入 API_BASE_URL

// function Schedule() {
//   const [selectedMonth, setSelectedMonth] = useState('本月');
//   const [scheduleData, setScheduleData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { companyId, employeeId } = useEmployee();

//   // 班別對應的顏色
//   const shiftColors = {
//     '早': '#4CAF50', // 綠色
//     '午': '#FF9800', // 橙色
//     '晚': '#E91E63', // 粉紅色
//     '夜': '#9C27B0', // 紫色
//     '開早': '#4CAF50', // 綠色
//     '關店': '#E91E63', // 粉紅色
//     '休': '#9E9E9E', // 灰色
//     '代班': '#FFC107', // 黃色
//     '白班': '#4CAF50', // 綠色
//   };

//   // 獲取當前日期資訊
//   const getCurrentDateInfo = () => {
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth(); // 0-11
    
//     return {
//       currentYear,
//       currentMonth,
//       thisMonthStart: new Date(currentYear, currentMonth, 1),
//       thisMonthEnd: new Date(currentYear, currentMonth + 1, 0),
//       nextMonthStart: new Date(currentYear, currentMonth + 1, 1),
//       nextMonthEnd: new Date(currentYear, currentMonth + 2, 0)
//     };
//   };

//   // 格式化日期為 API 需要的格式 (YYYY-MM-DD)
//   const formatDateForAPI = (date) => {
//     return date.toISOString().split('T')[0];
//   };

//   // 獲取顯示的年月
//   const getDisplayYearMonth = () => {
//     const { currentYear, currentMonth } = getCurrentDateInfo();
//     if (selectedMonth === '本月') {
//       return `${currentYear}年${currentMonth + 1}月`;
//     } else {
//       const nextMonth = currentMonth + 1;
//       const displayYear = nextMonth > 11 ? currentYear + 1 : currentYear;
//       const displayMonth = nextMonth > 11 ? 1 : nextMonth + 1;
//       return `${displayYear}年${displayMonth}月`;
//     }
//   };

//   // 獲取該月的天數
//   const getDaysInMonth = () => {
//     const { thisMonthEnd, nextMonthEnd } = getCurrentDateInfo();
//     return selectedMonth === '本月' ? thisMonthEnd.getDate() : nextMonthEnd.getDate();
//   };

//   // 獲取該月第一天是星期幾
//   const getFirstDayOfMonth = () => {
//     const { thisMonthStart, nextMonthStart } = getCurrentDateInfo();
//     const firstDay = selectedMonth === '本月' ? thisMonthStart : nextMonthStart;
//     return firstDay.getDay(); // 0=星期日, 1=星期一...
//   };

//   // 獲取日期範圍
//   const getDateRange = () => {
//     const { thisMonthStart, thisMonthEnd, nextMonthStart, nextMonthEnd } = getCurrentDateInfo();
    
//     if (selectedMonth === '本月') {
//       return {
//         start_date: formatDateForAPI(thisMonthStart),
//         end_date: formatDateForAPI(thisMonthEnd)
//       };
//     } else {
//       return {
//         start_date: formatDateForAPI(nextMonthStart),
//         end_date: formatDateForAPI(nextMonthEnd)
//       };
//     }
//   };

//   // 從 API 獲取排班資料
//   const fetchScheduleData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // 從 cookies 和 context 獲取參數
//       const company_id = Cookies.get('company_id') || companyId;
//       const employee_id = Cookies.get('employee_id') || employeeId;
//       const authToken = Cookies.get('auth_xtbb');

//       console.log('Debug - 用戶資訊:', {
//         company_id,
//         employee_id,
//         authToken: authToken ? '已設定' : '未設定',
//         companyId,
//         employeeId
//       });

//       if (!company_id || !employee_id) {
//         throw new Error('缺少必要的用戶資訊 (company_id 或 employee_id)');
//       }

//       if (!authToken) {
//         throw new Error('缺少認證 token，請重新登入');
//       }

//       const { start_date, end_date } = getDateRange();
      
//       // 構建 API URL
//       const apiUrl = `${API_BASE_URL}/api/schedule/employee`;
//       const params = new URLSearchParams({
//         company_id,
//         employee_id,
//         start_date,
//         end_date
//       });

//       const fullUrl = `${apiUrl}?${params.toString()}`;
      
//       console.log('API 請求資訊:', {
//         url: fullUrl,
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         params: {
//           company_id,
//           employee_id,
//           start_date,
//           end_date
//         }
//       });

//       const response = await fetch(fullUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         }
//       });

//       console.log('API 回應狀態:', response.status, response.statusText);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API 錯誤回應:', errorText);
//         throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
//       }

//       const result = await response.json();
//       console.log('API 回應資料:', result);

//       if (result.Status === 'Ok') {
//         // 處理 API 回應資料
//         const processedData = processAPIData(result.Data || []);
//         console.log('處理後的資料:', processedData);
//         setScheduleData(processedData);
//       } else {
//         throw new Error(result.Msg || 'API 回應錯誤');
//       }
//     } catch (error) {
//       console.error('獲取排班資料錯誤:', error);
//       setError(error.message);
//       // 發生錯誤時使用空資料，全部顯示為休假
//       setScheduleData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 處理 API 資料
//   const processAPIData = (apiData) => {
//     if (!Array.isArray(apiData)) {
//       console.warn('API 資料不是陣列格式:', apiData);
//       return [];
//     }

//     return apiData.map(item => {
//       // 處理日期，確保能正確解析
//       let dateNum;
//       if (item.date) {
//         const date = new Date(item.date);
//         dateNum = date.getDate();
//       } else if (item.day) {
//         dateNum = parseInt(item.day);
//       } else {
//         dateNum = 1;
//       }

//       return {
//         date: dateNum.toString(),
//         shift: item.shift_type || item.shift || item.type || '休',
//         // 可以根據需要添加更多欄位
//         start_time: item.start_time,
//         end_time: item.end_time,
//         location: item.location
//       };
//     });
//   };

//   // 等待用戶資訊載入完成後再呼叫 API
//   useEffect(() => {
//     // 檢查是否有必要的用戶資訊
//     const company_id = Cookies.get('company_id') || companyId;
//     const employee_id = Cookies.get('employee_id') || employeeId;
    
//     if (company_id && employee_id) {
//       console.log('用戶資訊已準備，開始獲取排班資料');
//       fetchScheduleData();
//     } else {
//       console.log('等待用戶資訊載入...');
//     }
//   }, [selectedMonth, companyId, employeeId]);

//   // 處理返回首頁
//   const handleHomeClick = () => {
//     navigate('/frontpage01');
//   };

//   // 獲取班別顏色
//   const getShiftColor = (shift) => {
//     if (!shift || shift === '休') return '#9E9E9E';
    
//     for (const [key, color] of Object.entries(shiftColors)) {
//       if (shift.includes(key)) {
//         return color;
//       }
//     }
//     return '#3a75b5';
//   };

//   const styles = {
//     // 🎯 參考補打卡的容器樣式
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
//     // 🎯 參考補打卡的 app-wrapper 樣式
//     appWrapper: {
//       width: '100%',
//       maxWidth: '100%',
//       height: '100%',
//       backgroundColor: 'white',
//       fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//       display: 'flex',
//       flexDirection: 'column',
//       position: 'relative',
//       overflow: 'hidden',
//       boxSizing: 'border-box',
      
//       // 防止整個應用變形
//       transform: 'translate3d(0, 0, 0) !important',
//       WebkitTransform: 'translate3d(0, 0, 0) !important',
//       willChange: 'auto',
//     },
//     // 🎯 參考補打卡的 header 樣式 - 左右填滿畫面
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       backgroundColor: '#2b6cb0',
//       color: 'white',
//       padding: '0 16px',
//       height: '92px',
//       width: '100vw',
//       maxWidth: '100vw',
//       boxSizing: 'border-box',
//       position: 'relative',
//       left: 0,
//       right: 0,
      
//       // 固定標題欄
//       minHeight: '70px',
//       maxHeight: '100px',
//       flexShrink: 0,
//       margin: 0,
//     },
//     // 🎯 參考補打卡的 home-icon 樣式
//     homeIcon: {
//       width: '30px',
//       height: '30px',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       cursor: 'pointer',
//       marginTop: '20px',
//     },
//     // 🎯 參考補打卡的 page-title 樣式
//     pageTitle: {
//       fontSize: '18px',
//       fontWeight: 'normal',
//       color: '#FFFFFF',
//       textAlign: 'center',
//       flex: 1,
//       marginTop: '20px',
//     },
//     // 🎯 右側佔位符，保持佈局平衡
//     rightPlaceholder: {
//       width: '30px',
//       height: '30px',
//       marginTop: '20px',
//     },
//     // 🎯 參考補打卡的 content-container 樣式
//     contentContainer: {
//       flex: 1,
//       overflowY: 'auto',
//       padding: '16px',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '16px',
      
//       // 防止內容區域變化
//       width: '100%',
//       boxSizing: 'border-box',
//       position: 'relative',
//       maxWidth: '360px',
//       margin: '0 auto',
//     },
//     // 🎯 參考補打卡的 tab-container 樣式
//     tabContainer: {
//       width: '100%',
//       display: 'flex',
//       height: '36px',
//       marginBottom: '5px',
//       justifyContent: 'space-between',
//       boxSizing: 'border-box',
//     },
//     // 🎯 參考補打卡的 tab 樣式
//     monthButton: {
//       flex: 1,
//       height: '36px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: '#FFFFFF',
//       color: '#3A6CA6',
//       fontWeight: 700,
//       fontSize: '14px',
//       cursor: 'pointer',
//       border: '1px solid #E9E9E9',
//       borderRadius: '4px',
//       margin: '0 2px',
//     },
//     activeMonthButton: {
//       flex: 1,
//       height: '36px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: '#3A6CA6',
//       color: '#FFFFFF',
//       fontWeight: 700,
//       fontSize: '14px',
//       cursor: 'pointer',
//       border: 'none',
//       borderRadius: '4px',
//       margin: '0 2px',
//     },
//     // 🎯 參考補打卡的 content-frame 樣式
//     contentFrame: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'flex-start',
//       padding: '0px',
//       gap: '5px',
//       width: '100%',
//       flexGrow: 1,
//       overflowY: 'auto',
//       overflowX: 'hidden',
//       boxSizing: 'border-box',
//     },
//     // 載入和錯誤狀態樣式
//     loadingContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '200px',
//       fontSize: '16px',
//       color: '#666',
//     },
//     errorContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '200px',
//       fontSize: '14px',
//       color: '#e74c3c',
//       textAlign: 'center',
//       padding: '20px',
//     },
//     calendarHeader: {
//       fontSize: '14px',
//       fontWeight: 'normal',
//       marginBottom: '12px',
//       color: '#333',
//       width: '100%',
//       textAlign: 'center',
//     },
//     calendarDays: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(7, 1fr)',
//       width: '100%',
//       marginBottom: '4px',
//       textAlign: 'center',
//       borderBottom: '1px solid #eee',
//       paddingBottom: '4px',
//     },
//     calendarDay: {
//       fontSize: '12px',
//       color: '#666',
//       padding: '4px 0',
//     },
//     calendarDates: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(7, 1fr)',
//       gap: '4px',
//       width: '100%',
//       marginBottom: '16px',
//     },
//     calendarDate: (shift) => ({
//       aspectRatio: '1/1.3',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'flex-start',
//       backgroundColor: '#fff',
//       fontSize: '14px',
//       color: '#333',
//       padding: '6px 2px',
//       borderRadius: '8px',
//       boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//       position: 'relative',
//     }),
//     shiftTag: (shift) => ({
//       backgroundColor: getShiftColor(shift),
//       color: '#fff',
//       fontSize: '9px',
//       padding: '2px 6px',
//       borderRadius: '8px',
//       marginTop: '2px',
//       minWidth: '18px',
//       textAlign: 'center',
//       fontWeight: 'bold',
//       lineHeight: '12px',
//     }),
//     emptyDate: {
//       aspectRatio: '1/1.3',
//       backgroundColor: 'transparent',
//     },
//   };
  
//   // 創建日曆格子數據
//   const firstDayOfMonth = getFirstDayOfMonth();
//   const daysInMonth = getDaysInMonth();
//   const calendarCells = [];
  
//   // 填充月份開始前的空白格子
//   for (let i = 0; i < firstDayOfMonth; i++) {
//     calendarCells.push({ isEmpty: true });
//   }
  
//   // 填充月份的日期
//   for (let day = 1; day <= daysInMonth; day++) {
//     const dayData = scheduleData.find(item => parseInt(item.date) === day);
//     calendarCells.push({
//       date: day,
//       shift: dayData ? dayData.shift : '休',
//       isEmpty: false
//     });
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.appWrapper}>
//         {/* Header */}
//         <header style={styles.header}>
//           <div style={styles.homeIcon} onClick={handleHomeClick}>
//             <img src={homeIcon} alt="Home" width="20" height="20" />
//           </div>
//           <div style={styles.pageTitle}>班表查詢</div>
//           <div style={styles.rightPlaceholder}></div>
//         </header>

//         {/* Content */}
//         <div style={styles.contentContainer}>
//           {/* 月份選擇標籤 */}
//           <div style={styles.tabContainer}>
//             <button
//               style={selectedMonth === '本月' ? styles.activeMonthButton : styles.monthButton}
//               onClick={() => setSelectedMonth('本月')}
//             >
//               本月
//             </button>
//             <button
//               style={selectedMonth === '下月' ? styles.activeMonthButton : styles.monthButton}
//               onClick={() => setSelectedMonth('下月')}
//             >
//               下月
//             </button>
//           </div>

//           {/* 內容框架 */}
//           <div style={styles.contentFrame}>
//             {loading ? (
//               <div style={styles.loadingContainer}>
//                 <div>載入中...</div>
//                 <div style={{fontSize: '12px', marginTop: '10px', color: '#999'}}>
//                   正在獲取排班資料
//                 </div>
//               </div>
//             ) : error ? (
//               <div style={styles.errorContainer}>
//                 <div>載入失敗</div>
//                 <div style={{fontSize: '12px', marginTop: '5px'}}>
//                   {error}
//                 </div>
//                 <button 
//                   onClick={fetchScheduleData}
//                   style={{
//                     marginTop: '15px',
//                     padding: '8px 16px',
//                     backgroundColor: '#3A6CA6',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     fontSize: '14px'
//                   }}
//                 >
//                   重新載入
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div style={styles.calendarHeader}>
//                   {getDisplayYearMonth()}
//                 </div>
                
//                 <div style={styles.calendarDays}>
//                   {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
//                     <div key={index} style={styles.calendarDay}>
//                       {day}
//                     </div>
//                   ))}
//                 </div>
                
//                 <div style={styles.calendarDates}>
//                   {calendarCells.map((cell, index) => {
//                     if (cell.isEmpty) {
//                       return <div key={index} style={styles.emptyDate}></div>;
//                     }
                    
//                     return (
//                       <div key={index} style={styles.calendarDate(cell.shift)}>
//                         <div>{cell.date}</div>
//                         {cell.shift && (
//                           <div style={styles.shiftTag(cell.shift)}>
//                             {cell.shift}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Schedule;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';
import Cookies from 'js-cookie';
import homeIcon from './HomePageImage/homepage.png';
import { API_BASE_URL } from '../config';

function Schedule() {
  const [selectedMonth, setSelectedMonth] = useState('本月');
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { companyId, employeeId } = useEmployee();

  // 班別對應的顏色
  const shiftColors = {
    '早': '#4CAF50', // 綠色
    '午': '#FF9800', // 橙色
    '晚': '#E91E63', // 粉紅色
    '夜': '#9C27B0', // 紫色
    '開早': '#4CAF50', // 綠色
    '關店': '#E91E63', // 粉紅色
    '休': '#9E9E9E', // 灰色
    '代班': '#FFC107', // 黃色
    '白班': '#4CAF50', // 綠色
  };

  // 獲取當前日期資訊
  const getCurrentDateInfo = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    return {
      currentYear,
      currentMonth,
      thisMonthStart: new Date(currentYear, currentMonth, 1),
      thisMonthEnd: new Date(currentYear, currentMonth + 1, 0),
      nextMonthStart: new Date(currentYear, currentMonth + 1, 1),
      nextMonthEnd: new Date(currentYear, currentMonth + 2, 0)
    };
  };

  // 格式化日期為 API 需要的格式 (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  // 獲取顯示的年月
  const getDisplayYearMonth = () => {
    const { currentYear, currentMonth } = getCurrentDateInfo();
    if (selectedMonth === '本月') {
      return `${currentYear}年${currentMonth + 1}月`;
    } else {
      const nextMonth = currentMonth + 1;
      const displayYear = nextMonth > 11 ? currentYear + 1 : currentYear;
      const displayMonth = nextMonth > 11 ? 1 : nextMonth + 1;
      return `${displayYear}年${displayMonth}月`;
    }
  };

  // 獲取該月的天數
  const getDaysInMonth = () => {
    const { thisMonthEnd, nextMonthEnd } = getCurrentDateInfo();
    return selectedMonth === '本月' ? thisMonthEnd.getDate() : nextMonthEnd.getDate();
  };

  // 獲取該月第一天是星期幾
  const getFirstDayOfMonth = () => {
    const { thisMonthStart, nextMonthStart } = getCurrentDateInfo();
    const firstDay = selectedMonth === '本月' ? thisMonthStart : nextMonthStart;
    return firstDay.getDay(); // 0=星期日, 1=星期一...
  };

  // 獲取日期範圍
  const getDateRange = () => {
    const { thisMonthStart, thisMonthEnd, nextMonthStart, nextMonthEnd } = getCurrentDateInfo();
    
    if (selectedMonth === '本月') {
      return {
        start_date: formatDateForAPI(thisMonthStart),
        end_date: formatDateForAPI(thisMonthEnd)
      };
    } else {
      return {
        start_date: formatDateForAPI(nextMonthStart),
        end_date: formatDateForAPI(nextMonthEnd)
      };
    }
  };

  // 🎯 自定義的員工排班查詢函數
  const fetchEmployeeSchedule = async (companyId, employeeId, startDate, endDate) => {
    try {
      console.log('🔍 開始查詢員工排班:', {
        companyId,
        employeeId,
        startDate,
        endDate
      });

      const authToken = Cookies.get('auth_xtbb');
      if (!authToken) {
        throw new Error('缺少認證 token，請重新登入');
      }

      // 構建查詢參數
      const params = new URLSearchParams({
        company_id: String(companyId).trim(),
        employee_id: String(employeeId).trim(),
        start_date: startDate,
        end_date: endDate
      });

      const apiUrl = `${API_BASE_URL}/api/schedule/employee?${params.toString()}`;
      
      console.log('📡 API 請求 URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 15000
      });

      console.log('📨 API 回應狀態:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 錯誤回應:', errorText);
        
        // 嘗試解析錯誤訊息
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.Msg || `API 請求失敗: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('✅ API 回應資料:', result);

      return result;
    } catch (error) {
      console.error('❌ 查詢員工排班失敗:', error);
      throw error;
    }
  };

  // 🎯 主要的獲取排班資料函數
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 從 cookies 和 context 獲取參數
      const company_id = Cookies.get('company_id') || companyId;
      const employee_id = Cookies.get('employee_id') || employeeId;

      console.log('👤 用戶資訊:', {
        company_id,
        employee_id,
        companyId,
        employeeId
      });

      if (!company_id || !employee_id) {
        throw new Error('缺少必要的用戶資訊 (company_id 或 employee_id)');
      }

      const { start_date, end_date } = getDateRange();
      
      console.log('📅 查詢日期範圍:', {
        start_date,
        end_date,
        selectedMonth
      });

      // 🎯 呼叫自定義的查詢函數
      const result = await fetchEmployeeSchedule(
        company_id,
        employee_id,
        start_date,
        end_date
      );

      if (result.Status === 'Ok') {
        // 處理 API 回應資料
        const processedData = processAPIData(result.Data);
        console.log('✨ 處理後的排班資料:', processedData);
        setScheduleData(processedData);
      } else {
        throw new Error(result.Msg || 'API 回應錯誤');
      }
    } catch (error) {
      console.error('💥 獲取排班資料錯誤:', error);
      setError(error.message);
      
      // 使用預設資料作為備用方案
      console.log('🔄 使用預設排班資料作為備用方案');
      const fallbackData = generateFallbackSchedule();
      setScheduleData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 處理 API 回應資料
  const processAPIData = (apiData) => {
    if (!apiData) {
      console.warn('⚠️ API 資料為空:', apiData);
      return [];
    }

    console.log('🔄 開始處理 API 資料:', apiData);

    // 情況 1: 新的資料結構（有 schedules 物件）
    if (apiData.schedules && typeof apiData.schedules === 'object') {
      console.log('📋 處理 schedules 物件格式');
      const schedules = apiData.schedules;
      const processedData = [];

      Object.keys(schedules).forEach(dateStr => {
        const schedule = schedules[dateStr];
        const date = new Date(dateStr);
        const dayOfMonth = date.getDate();

        processedData.push({
          date: dayOfMonth.toString(),
          shift: schedule.shift_name || '休',
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          schedule_id: schedule.schedule_id
        });
      });

      return processedData.sort((a, b) => parseInt(a.date) - parseInt(b.date));
    }

    // 情況 2: 陣列格式
    if (Array.isArray(apiData)) {
      console.log('📋 處理陣列格式');
      return apiData.map(item => {
        let dateNum;
        if (item.date) {
          const date = new Date(item.date);
          dateNum = date.getDate();
        } else if (item.day) {
          dateNum = parseInt(item.day);
        } else {
          dateNum = 1;
        }

        return {
          date: dateNum.toString(),
          shift: item.shift_name || item.shift_type || item.shift || '休',
          start_time: item.start_time,
          end_time: item.end_time,
          schedule_id: item.schedule_id || item.id
        };
      }).sort((a, b) => parseInt(a.date) - parseInt(b.date));
    }

    // 情況 3: 直接是排班資料物件
    if (apiData.employee_name || apiData.employee_id) {
      console.log('📋 處理員工排班物件格式');
      // 如果有 schedules 屬性
      if (apiData.schedules) {
        return processAPIData(apiData.schedules);
      }
      // 如果有 original_schedules 屬性
      if (apiData.original_schedules) {
        return processAPIData(apiData.original_schedules);
      }
    }

    console.warn('⚠️ 未知的 API 資料格式:', apiData);
    return [];
  };

  // 🎯 產生預設排班資料（備用方案）
  const generateFallbackSchedule = () => {
    const daysInMonth = getDaysInMonth();
    const schedule = [];
    
    // 更真實的排班模式
    const workPatterns = [
      // 模式1: 早班為主
      ['早', '早', '休', '早', '早', '休', '休'],
      // 模式2: 午班為主  
      ['午', '午', '休', '午', '午', '休', '休'],
      // 模式3: 晚班為主
      ['晚', '晚', '休', '晚', '晚', '休', '休'],
      // 模式4: 夜班為主
      ['夜', '夜', '休', '夜', '夜', '休', '休'],
      // 模式5: 混合班
      ['早', '午', '休', '晚', '夜', '休', '休']
    ];
    
    // 根據員工ID選擇排班模式
    const employee_id = Cookies.get('employee_id') || '123';
    const patternIndex = parseInt(employee_id) % workPatterns.length;
    const selectedPattern = workPatterns[patternIndex];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = (day - 1) % 7;
      const shift = selectedPattern[dayIndex];
      
      schedule.push({
        date: day.toString(),
        shift: shift,
        start_time: getShiftTime(shift).start,
        end_time: getShiftTime(shift).end
      });
    }
    
    return schedule;
  };

  // 獲取班別時間
  const getShiftTime = (shift) => {
    const times = {
      '早': { start: '06:00', end: '14:00' },
      '午': { start: '14:00', end: '22:00' },
      '晚': { start: '18:00', end: '02:00' },
      '夜': { start: '22:00', end: '06:00' },
      '休': { start: '', end: '' }
    };
    return times[shift] || { start: '', end: '' };
  };

  // 當選擇的月份改變時，重新獲取資料
  useEffect(() => {
    const company_id = Cookies.get('company_id') || companyId;
    const employee_id = Cookies.get('employee_id') || employeeId;
    
    if (company_id && employee_id) {
      console.log('🚀 用戶資訊已準備，開始獲取排班資料');
      fetchScheduleData();
    } else {
      console.log('⏳ 等待用戶資訊載入...');
      const fallbackData = generateFallbackSchedule();
      setScheduleData(fallbackData);
    }
  }, [selectedMonth, companyId, employeeId]);

  // 處理返回首頁
  const handleHomeClick = () => {
    navigate('/frontpage01');
  };

  // 獲取班別顏色
  const getShiftColor = (shift) => {
    if (!shift || shift === '休') return '#9E9E9E';
    
    for (const [key, color] of Object.entries(shiftColors)) {
      if (shift.includes(key)) {
        return color;
      }
    }
    return '#3a75b5';
  };

  // 🎯 樣式定義
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
      maxWidth: '100%',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      
      transform: 'translate3d(0, 0, 0) !important',
      WebkitTransform: 'translate3d(0, 0, 0) !important',
      willChange: 'auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#2b6cb0',
      color: 'white',
      padding: '0 16px',
      height: '92px',
      width: '100vw',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      position: 'relative',
      left: 0,
      right: 0,
      
      minHeight: '70px',
      maxHeight: '100px',
      flexShrink: 0,
      margin: 0,
    },
    homeIcon: {
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      marginTop: '20px',
    },
    pageTitle: {
      fontSize: '18px',
      fontWeight: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      flex: 1,
      marginTop: '20px',
    },
    rightPlaceholder: {
      width: '30px',
      height: '30px',
      marginTop: '20px',
    },
    contentContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      maxWidth: '360px',
      margin: '0 auto',
    },
    tabContainer: {
      width: '100%',
      display: 'flex',
      height: '36px',
      marginBottom: '5px',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
    },
    monthButton: {
      flex: 1,
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      color: '#3A6CA6',
      fontWeight: 700,
      fontSize: '14px',
      cursor: 'pointer',
      border: '1px solid #E9E9E9',
      borderRadius: '4px',
      margin: '0 2px',
    },
    activeMonthButton: {
      flex: 1,
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3A6CA6',
      color: '#FFFFFF',
      fontWeight: 700,
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      margin: '0 2px',
    },
    contentFrame: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '5px',
      width: '100%',
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: '#666',
    },
    errorNotice: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      marginBottom: '10px',
      textAlign: 'center',
      border: '1px solid #ffeaa7',
    },
    calendarHeader: {
      fontSize: '14px',
      fontWeight: 'normal',
      marginBottom: '12px',
      color: '#333',
      width: '100%',
      textAlign: 'center',
    },
    calendarDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      width: '100%',
      marginBottom: '4px',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
      paddingBottom: '4px',
    },
    calendarDay: {
      fontSize: '12px',
      color: '#666',
      padding: '4px 0',
    },
    calendarDates: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      width: '100%',
      marginBottom: '16px',
    },
    calendarDate: (shift) => ({
      aspectRatio: '1/1.3',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#fff',
      fontSize: '14px',
      color: '#333',
      padding: '6px 2px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'relative',
    }),
    shiftTag: (shift) => ({
      backgroundColor: getShiftColor(shift),
      color: '#fff',
      fontSize: '9px',
      padding: '2px 6px',
      borderRadius: '8px',
      marginTop: '2px',
      minWidth: '18px',
      textAlign: 'center',
      fontWeight: 'bold',
      lineHeight: '12px',
    }),
    emptyDate: {
      aspectRatio: '1/1.3',
      backgroundColor: 'transparent',
    },
  };
  
  // 創建日曆格子數據
  const firstDayOfMonth = getFirstDayOfMonth();
  const daysInMonth = getDaysInMonth();
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
      shift: dayData ? dayData.shift : '休',
      isEmpty: false
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={handleHomeClick}>
            <img src={homeIcon} alt="Home" width="20" height="20" />
          </div>
          <div style={styles.pageTitle}>班表查詢</div>
          <div style={styles.rightPlaceholder}></div>
        </header>

        {/* Content */}
        <div style={styles.contentContainer}>
          {/* 月份選擇標籤 */}
          <div style={styles.tabContainer}>
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

          {/* 內容框架 */}
          <div style={styles.contentFrame}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div>載入中...</div>
                <div style={{fontSize: '12px', marginTop: '10px', color: '#999'}}>
                  正在獲取排班資料
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div style={styles.errorNotice}>
                    ⚠️ API 連線問題，顯示預設排班資料
                  </div>
                )}
                
                <div style={styles.calendarHeader}>
                  {getDisplayYearMonth()}
                </div>
                
                <div style={styles.calendarDays}>
                  {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                    <div key={index} style={styles.calendarDay}>
                      {day}
                    </div>
                  ))}
                </div>
                
                <div style={styles.calendarDates}>
                  {calendarCells.map((cell, index) => {
                    if (cell.isEmpty) {
                      return <div key={index} style={styles.emptyDate}></div>;
                    }
                    
                    return (
                      <div key={index} style={styles.calendarDate(cell.shift)}>
                        <div>{cell.date}</div>
                        {cell.shift && (
                          <div style={styles.shiftTag(cell.shift)}>
                            {cell.shift}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
