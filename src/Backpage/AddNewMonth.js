// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Cookies from 'js-cookie'; 

// const AddNewMonth = () => {
//   const navigate = useNavigate();
  
//   const [schedules, setSchedules] = useState([]);
//   const [showAddDropdown, setShowAddDropdown] = useState(false);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [holidayDate, setHolidayDate] = useState('');
//   const [holidayDates, setHolidayDates] = useState([]);
//   const [scheduleName, setScheduleName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const dropdownRef = useRef(null);
//   const buttonRef = useRef(null);

//   // 從 cookies 中獲取值的函數
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   // ✅ 新增：取得員工姓名的函數
//   const getEmployeeName = async (companyId, employeeId) => {
//     try {
//       const response = await fetch('https://rabbit.54ucl.com:3004/api/employees', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           company_id: companyId,
//           employee_id: employeeId
//         })
//       });
      
//       const result = await response.json();
      
//       if (result.Status === 'Ok') {
//         return result.Data.name;
//       } else {
//         console.error('取得員工姓名失敗:', result.Msg);
//         return null;
//       }
//     } catch (error) {
//       console.error('取得員工姓名錯誤:', error);
//       return null;
//     }
//   };

//   // 載入班表列表
//   const loadSchedules = async () => {
//     try {
//       setLoading(true);
//       const companyId = getCookie('company_id');
      
//       if (!companyId) {
//         setError('未找到公司資訊，請重新登入');
//         return;
//       }

//       const response = await fetch(`https://rabbit.54ucl.com:3004/api/class-months?company_id=${companyId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       const result = await response.json();
      
//       if (result.Status === 'Ok') {
//         console.log('🔍 API 返回的原始資料:', result.Data);
        
//         const formattedSchedules = result.Data.map((item, index) => {
//           console.log(`🔍 處理第 ${index + 1} 筆資料:`, item);
          
//           return {
//             id: item.id || 
//                 item.class_month_id || 
//                 item.schedule_id || 
//                 item.month_id || 
//                 `${item.company_id}-${item.year}-${item.month}` || 
//                 `schedule-${index}`,
//             name: item.class_months_name || `${item.year}年${item.month}月班表`,
//             publishDate: formatPublishDate(item.created_at),
//             creator: item.created_by || '系統',
//             year: item.year,
//             month: item.month,
//             fullName: item.class_months_name,
//             originalData: item
//           };
//         });
        
//         console.log('✅ 格式化後的班表資料:', formattedSchedules);
//         setSchedules(formattedSchedules);
//       } else {
//         console.error('載入班表失敗:', result.Msg);
//         setError(result.Msg || '載入班表失敗');
//       }
//     } catch (error) {
//       console.error('載入班表錯誤:', error);
//       setError('載入班表失敗，請檢查網路連線');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 格式化發布日期
//   const formatPublishDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return `${month}-${day} ${hours}:${minutes}PM`;
//   };

//   useEffect(() => {
//     // 設定預設的下個月日期
//     const today = new Date();
//     const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
//     const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
//     const holidayDefault = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    
//     setStartDate(formatDate(nextMonth));
//     setEndDate(formatDate(nextMonthEnd));
//     setHolidayDate(formatDate(holidayDefault));
    
//     // 設定預設班表名稱
//     const year = nextMonth.getFullYear();
//     const month = nextMonth.getMonth() + 1;
//     setScheduleName(`${year}年${month}月班表`);
    
//     // 載入現有班表
//     loadSchedules();
    
//     // 點擊外部關閉下拉選單
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
//           buttonRef.current && !buttonRef.current.contains(event.target)) {
//         setShowAddDropdown(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // 日期格式化函數
//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // 新增班表按鈕樣式
//   const addButtonStyle = {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: '25px 26px',
//     gap: '10px',
//     width: '310px',
//     height: '70px',
//     background: loading ? '#ccc' : '#3A6CA6',
//     borderRadius: '5px',
//     border: 'none',
//     cursor: loading ? 'not-allowed' : 'pointer',
//     color: 'white',
//     position: 'relative'
//   };

//   // 處理新增班表
//   const handleAddSchedule = () => {
//     if (loading) return;
//     console.log('按鈕被點擊，當前狀態:', showAddDropdown);
//     setShowAddDropdown(!showAddDropdown);
//     setError('');
//   };

//   // ✅ 修改：處理提交新增班表
//   const handleSubmitSchedule = async () => {
//     // 基本驗證
//     if (!scheduleName.trim()) {
//       setError('請輸入班表名稱');
//       return;
//     }
    
//     if (!startDate || !endDate) {
//       setError('請選擇班表期間');
//       return;
//     }
    
//     if (new Date(startDate) >= new Date(endDate)) {
//       setError('結束日期必須晚於開始日期');
//       return;
//     }

//     // 從 cookies 獲取公司 ID 和員工 ID
//     const companyId = getCookie('company_id');
//     const employeeId = getCookie('employee_id');
    
//     if (!companyId) {
//       setError('未找到公司資訊，請重新登入');
//       return;
//     }
    
//     if (!employeeId) {
//       setError('未找到員工資訊，請重新登入');
//       return;
//     }
    
//     setLoading(true);
//     setError('');
    
//     try {
//       // ✅ 先取得員工姓名
//       const employeeName = await getEmployeeName(companyId, employeeId);
      
//       if (!employeeName) {
//         setError('無法取得員工姓名，請重新登入');
//         setLoading(false);
//         return;
//       }
      
//       const startDateObj = new Date(startDate);
//       const year = startDateObj.getFullYear();
//       const month = startDateObj.getMonth() + 1;
      
//       const requestData = {
//         company_id: companyId,
//         year: year,
//         month: month,
//         class_months_name: scheduleName.trim(),
//         start_date: startDate,
//         end_date: endDate,
//         holiday_dates: holidayDates,
//         // ✅ 使用從 API 取得的員工姓名
//         created_by: employeeName
//       };
      
//       console.log('提交資料:', requestData);
      
//       const response = await fetch('https://rabbit.54ucl.com:3004/api/class-months', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData)
//       });
      
//       const result = await response.json();
      
//       if (result.Status === 'Ok') {
//         console.log('新增成功:', result);
        
//         // 重新載入班表列表
//         await loadSchedules();
        
//         // 重置表單
//         setShowAddDropdown(false);
//         setHolidayDates([]);
        
//         // 設定下個月的預設值
//         const nextMonth = new Date(year, month, 1);
//         const nextMonthEnd = new Date(year, month + 1, 0);
//         setStartDate(formatDate(nextMonth));
//         setEndDate(formatDate(nextMonthEnd));
//         setScheduleName(`${year}年${month + 1}月班表`);
        
//         alert('班表新增成功！');
//       } else {
//         setError(result.Msg || '新增班表失敗');
//         console.error('新增失敗:', result);
//       }
//     } catch (error) {
//       console.error('新增班表錯誤:', error);
//       setError('網路錯誤，請檢查連線後再試');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 處理編輯班表
//   const handleEditSchedule = (id) => {
//     console.log(`🔍 編輯班表 ID: ${id}`);
//     console.log('📋 所有班表資料:', schedules);
    
//     // 找到對應的班表資料
//     let schedule = schedules.find(s => s.id === id);
    
//     if (!schedule && schedules.length > 0) {
//       console.log('⚠️ 通過 ID 找不到班表，嘗試其他方式');
      
//       if (id === undefined || id === null) {
//         console.log('❌ ID 無效，無法確定要編輯的班表');
//         alert('無法確定要編輯的班表，請重新載入頁面後再試');
//         return;
//       }
//     }
    
//     console.log('🎯 找到的班表資料:', schedule);
    
//     if (schedule) {
//       const companyId = getCookie('company_id');
//       console.log('🏢 公司 ID:', companyId);
      
//       // 清除舊的 cookies
//       Cookies.remove('scheduling_year');
//       Cookies.remove('scheduling_month');
//       Cookies.remove('scheduling_company_id');
      
//       console.log('🧹 已清除舊的 cookies');
      
//       setTimeout(() => {
//         // 設定新的 cookies
//         Cookies.set('scheduling_year', String(schedule.year), { 
//           expires: 1,
//           path: '/',
//           sameSite: 'lax'
//         });
//         Cookies.set('scheduling_month', String(schedule.month), { 
//           expires: 1,
//           path: '/',
//           sameSite: 'lax'
//         });
//         Cookies.set('scheduling_company_id', String(companyId), { 
//           expires: 1,
//           path: '/',
//           sameSite: 'lax'
//         });
        
//         if (schedule.fullName) {
//           Cookies.set('scheduling_class_name', String(schedule.fullName), {
//             expires: 1,
//             path: '/',
//             sameSite: 'lax'
//           });
//           console.log('✅ 已設定班表名稱 cookie:', schedule.fullName);
//         }
        
//         console.log('✅ 已設定新的 cookies:', {
//           scheduling_year: String(schedule.year),
//           scheduling_month: String(schedule.month),
//           scheduling_company_id: String(companyId),
//           scheduling_class_name: schedule.fullName || '未設定'
//         });
        
//         // 驗證 cookies 設定
//         setTimeout(() => {
//           const verifyYear = Cookies.get('scheduling_year');
//           const verifyMonth = Cookies.get('scheduling_month');
//           const verifyCompany = Cookies.get('scheduling_company_id');
//           const verifyClassName = Cookies.get('scheduling_class_name');
          
//           console.log('🔍 驗證 cookies 設定結果:', {
//             scheduling_year: verifyYear,
//             scheduling_month: verifyMonth,
//             scheduling_company_id: verifyCompany,
//             scheduling_class_name: verifyClassName
//           });
          
//           if (verifyYear !== String(schedule.year) || verifyMonth !== String(schedule.month)) {
//             console.error('❌ Cookies 設定失敗！');
//             alert('設定失敗，請重試');
//           } else {
//             console.log('✅ Cookies 設定成功，準備跳轉');
//             console.log('🚀 跳轉到 /schedulingsystem');
//             navigate('/schedulingsystem');
//           }
//         }, 100);
//       }, 100);
      
//     } else {
//       console.error('❌ 找不到對應的班表資料，ID:', id);
//       alert('找不到對應的班表資料，請重新載入頁面後再試');
//     }
//   };

//   // 處理複製班表
//   const handleCopySchedule = (id) => {
//     console.log(`複製班表 ID: ${id}`);
//   };

//   // 處理新增公休假日
//   const handleAddHoliday = () => {
//     if (!holidayDate) {
//       setError('請選擇公休日期');
//       return;
//     }
    
//     if (holidayDates.includes(holidayDate)) {
//       setError('此日期已經是公休日');
//       return;
//     }
    
//     setHolidayDates([...holidayDates, holidayDate]);
//     console.log('新增公休假日:', holidayDate);
//     setError('');
//   };

//   // 移除公休假日
//   const handleRemoveHoliday = (dateToRemove) => {
//     setHolidayDates(holidayDates.filter(date => date !== dateToRemove));
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         height: '100vh',
//         backgroundColor: '#f5f5f5',
//         fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//         overflow: 'hidden',
//       }}
//     >
//       <Sidebar currentPage="schedule" />

//       <div
//         style={{
//           flexGrow: 1,
//           padding: '20px',
//           backgroundColor: 'white',
//           margin: '15px',
//           marginLeft: '265px',
//           overflowY: 'auto',
//           height: 'calc(100vh - 30px)',
//           display: 'flex',
//           flexDirection: 'column',
//           position: 'relative',
//         }}
//       >
//         {/* 錯誤訊息顯示 */}
//         {error && (
//           <div style={{
//             backgroundColor: '#ffebee',
//             color: '#c62828',
//             padding: '10px',
//             borderRadius: '4px',
//             marginBottom: '20px',
//             border: '1px solid #ffcdd2'
//           }}>
//             {error}
//           </div>
//         )}

//         {/* 載入中顯示 */}
//         {loading && (
//           <div style={{
//             backgroundColor: '#e3f2fd',
//             color: '#1976d2',
//             padding: '10px',
//             borderRadius: '4px',
//             marginBottom: '20px',
//             border: '1px solid #bbdefb'
//           }}>
//             載入中...
//           </div>
//         )}

//         {/* 主要內容區域 - 左右分佈 */}
//         <div style={{ 
//           display: 'flex',
//           flexDirection: 'row',
//           gap: '20px',
//           height: '100%'
//         }}>
//           {/* 左側 - 新增下月班表按鈕區域 */}
//           <div style={{ 
//             position: 'relative',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'flex-start',
//             width: '350px',
//             flexShrink: 0
//           }}>
//             <button 
//               ref={buttonRef}
//               style={addButtonStyle}
//               onClick={handleAddSchedule}
//               disabled={loading}
//             >
//               <div style={{ 
//                 display: 'flex', 
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 width: '100%'
//               }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <span style={{ 
//                     width: '40px',
//                     height: '40px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
//                       <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
//                     </svg>
//                   </span>
//                   <span style={{ 
//                     fontSize: '22px',
//                     fontWeight: '700',
//                     letterSpacing: '0.01em'
//                   }}>新增下月班表</span>
//                 </div>
//                 <span style={{
//                   width: '40px',
//                   height: '40px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   transform: showAddDropdown ? 'rotate(0deg)' : 'rotate(180deg)',
//                   transition: 'transform 0.3s ease'
//                 }}>
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
//                     <path d="M7 10l5 5 5-5z"/>
//                   </svg>
//                 </span>
//               </div>
//             </button>

//             {/* 下拉選單 */}
//             {showAddDropdown && (
//               <div
//                 ref={dropdownRef}
//                 style={{
//                   position: 'absolute',
//                   top: '70px',
//                   left: '0',
//                   width: '310px',
//                   backgroundColor: 'white',
//                   borderRadius: '0 0 10px 10px',
//                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
//                   zIndex: 999999,
//                   border: '1px solid #ddd',
//                   marginTop: '0px',
//                   maxHeight: '600px',
//                   overflowY: 'auto',
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: '15px 22px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '30px'
//                   }}
//                 >
//                   {/* 班表名稱 */}
//                   <div style={{ 
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '2px'
//                   }}>
//                     <h3
//                       style={{
//                         margin: '0',
//                         fontSize: '18px',
//                         fontWeight: 'bold',
//                         color: '#3A6CA6',
//                         letterSpacing: '0.01em',
//                         height: '24px'
//                       }}
//                     >
//                       班表名稱
//                     </h3>

//                     <div style={{ 
//                       width: '266px',
//                       height: '40px',
//                       border: '1px solid rgba(233, 233, 233, 0.5)',
//                       boxSizing: 'border-box',
//                       display: 'flex',
//                       alignItems: 'center'
//                     }}>
//                       <input
//                         type="text"
//                         value={scheduleName}
//                         onChange={(e) => setScheduleName(e.target.value)}
//                         placeholder="請輸入班表名稱"
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           border: 'none',
//                           padding: '8px 12px',
//                           fontSize: '14px',
//                           color: '#666',
//                           outline: 'none',
//                           boxSizing: 'border-box'
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* 班表期間 */}
//                   <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '15px'
//                   }}>
//                     <div style={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: '2px'
//                     }}>
//                       <h4
//                         style={{
//                           fontSize: '18px',
//                           color: '#3A6CA6',
//                           margin: '0',
//                           fontWeight: 'bold',
//                           letterSpacing: '0.01em',
//                           height: '24px'
//                         }}
//                       >
//                         班表期間
//                       </h4>
//                       <span
//                         style={{
//                           fontSize: '14px',
//                           color: '#909090',
//                           letterSpacing: '0.01em',
//                           height: '19px'
//                         }}
//                       >
//                         設定排班期間
//                       </span>
//                     </div>
                    
//                     <div style={{ marginBottom: '12px' }}>
//                       <div
//                         style={{
//                           boxSizing: 'border-box',
//                           width: '266px',
//                           height: '54px',
//                           border: '1px solid rgba(233, 233, 233, 0.5)',
//                           position: 'relative'
//                         }}
//                       >
//                         <div style={{
//                           position: 'absolute',
//                           left: '18px',
//                           top: 'calc(50% - 44px/2)',
//                           display: 'flex',
//                           flexDirection: 'column',
//                           width: '189px',
//                           height: '44px'
//                         }}>
//                           <span style={{
//                             fontSize: '12px',
//                             color: '#919191',
//                             letterSpacing: '0.01em',
//                             height: '16px'
//                           }}>
//                             開始時間
//                           </span>
//                           <div style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             gap: '10px',
//                             height: '28px'
//                           }}>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4D4E8" strokeWidth="2">
//                               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                               <line x1="16" y1="2" x2="16" y2="6"></line>
//                               <line x1="8" y1="2" x2="8" y2="6"></line>
//                               <line x1="3" y1="10" x2="21" y2="10"></line>
//                             </svg>
//                             <input
//                               type="date"
//                               value={startDate}
//                               onChange={(e) => setStartDate(e.target.value)}
//                               style={{
//                                 border: 'none',
//                                 fontSize: '14px',
//                                 color: '#333',
//                                 outline: 'none',
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div style={{ marginBottom: '15px' }}>
//                       <div
//                         style={{
//                           boxSizing: 'border-box',
//                           width: '266px',
//                           height: '54px',
//                           border: '1px solid rgba(233, 233, 233, 0.5)',
//                           position: 'relative'
//                         }}
//                       >
//                         <div style={{
//                           position: 'absolute',
//                           left: '18px',
//                           top: 'calc(50% - 44px/2)',
//                           display: 'flex',
//                           flexDirection: 'column',
//                           width: '189px',
//                           height: '44px'
//                         }}>
//                           <span style={{
//                             fontSize: '12px',
//                             color: '#919191',
//                             letterSpacing: '0.01em',
//                             height: '16px'
//                           }}>
//                             結束時間
//                           </span>
//                           <div style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             gap: '10px',
//                             height: '28px'
//                           }}>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4D4E8" strokeWidth="2">
//                               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                               <line x1="16" y1="2" x2="16" y2="6"></line>
//                               <line x1="8" y1="2" x2="8" y2="6"></line>
//                               <line x1="3" y1="10" x2="21" y2="10"></line>
//                             </svg>
//                             <input
//                               type="date"
//                               value={endDate}
//                               onChange={(e) => setEndDate(e.target.value)}
//                               style={{
//                                 border: 'none',
//                                 fontSize: '14px',
//                                 color: '#333',
//                                 outline: 'none',
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* 公休日期 */}
//                   <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '15px'
//                   }}>
//                     <div style={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: '2px'
//                     }}>
//                       <h4
//                         style={{
//                           fontSize: '18px',
//                           color: '#3A6CA6',
//                           margin: '0',
//                           fontWeight: 'bold',
//                           letterSpacing: '0.01em',
//                         }}
//                       >
//                         公休日期
//                       </h4>
//                       <span
//                         style={{
//                           fontSize: '14px',
//                           color: '#909090',
//                           letterSpacing: '0.01em',
//                         }}
//                       >
//                         設定公休日期，該天全體員工將無法排班
//                       </span>
//                     </div>
                    
//                     <div
//                       style={{
//                         boxSizing: 'border-box',
//                         width: '266px',
//                         height: '54px',
//                         border: '1px solid rgba(233, 233, 233, 0.5)',
//                         position: 'relative',
//                         display: 'flex',
//                         alignItems: 'center',
//                         padding: '0 18px',
//                       }}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4D4E8" strokeWidth="2">
//                         <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                         <line x1="16" y1="2" x2="16" y2="6"></line>
//                         <line x1="8" y1="2" x2="8" y2="6"></line>
//                         <line x1="3" y1="10" x2="21" y2="10"></line>
//                       </svg>
//                       <input
//                         type="date"
//                         value={holidayDate}
//                         onChange={(e) => setHolidayDate(e.target.value)}
//                         style={{
//                           border: 'none',
//                           width: '100%',
//                           marginLeft: '8px',
//                           fontSize: '14px',
//                           color: '#333',
//                           outline: 'none',
//                         }}
//                       />
//                     </div>
                    
//                     <button
//                       onClick={handleAddHoliday}
//                       style={{
//                         width: '100%',
//                         padding: '8px',
//                         backgroundColor: '#e6f0ff',
//                         color: '#4a86e8',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         fontSize: '14px',
//                         marginTop: '8px',
//                       }}
//                     >
//                       + 新增公休假日
//                     </button>

//                     {/* 顯示已新增的公休日期 */}
//                     {holidayDates.length > 0 && (
//                       <div style={{ marginTop: '10px' }}>
//                         <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
//                           已設定公休日期：
//                         </h5>
//                         {holidayDates.map((date, index) => {
//                           const stableKey = `holiday-item-${index}-${date.split('-').join('')}`;
                          
//                           return (
//                             <div key={stableKey} style={{
//                               display: 'flex',
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                               padding: '4px 8px',
//                               backgroundColor: '#f5f5f5',
//                               borderRadius: '4px',
//                               marginBottom: '4px',
//                               fontSize: '12px'
//                             }}>
//                               <span>{date}</span>
//                               <button
//                                 onClick={() => handleRemoveHoliday(date)}
//                                 style={{
//                                   background: 'none',
//                                   border: 'none',
//                                   color: '#ff4444',
//                                   cursor: 'pointer',
//                                   fontSize: '12px'
//                                 }}
//                               >
//                                 ✕
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     onClick={handleSubmitSchedule}
//                     disabled={loading}
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       backgroundColor: loading ? '#ccc' : '#4a86e8',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: loading ? 'not-allowed' : 'pointer',
//                       fontSize: '14px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     {loading ? '處理中...' : '設定完成'}
//                     {!loading && (
//                       <span
//                         style={{
//                           fontSize: '12px',
//                           marginLeft: '5px',
//                           opacity: 0.8,
//                         }}
//                       >
//                         設定完成後可編輯班表內容
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* 右側 - 排班表列表區域 */}
//           <div style={{ 
//             flexGrow: 1,
//             display: 'flex',
//             flexDirection: 'column'
//           }}>
//             {/* 表格標題行 */}
//             <div style={{ 
//               display: 'flex', 
//               borderBottom: '1px solid #eee',
//               color: '#666',
//               padding: '15px 10px',
//             }}>
//               <div style={{ width: '40%', textAlign: 'left' }}>排班表名稱</div>
//               <div style={{ width: '30%', textAlign: 'left' }}>班表發布日期</div>
//               <div style={{ width: '20%', textAlign: 'left' }}>建立者</div>
//               <div style={{ width: '5%', textAlign: 'center' }}>編輯</div>
//               <div style={{ width: '5%', textAlign: 'center' }}>複製</div>
//             </div>

//             {/* 排班表列表 */}
//             <div style={{ width: '100%', flexGrow: 1 }}>
//               {schedules.length === 0 ? (
//                 <div style={{
//                   padding: '40px',
//                   textAlign: 'center',
//                   color: '#999',
//                   fontSize: '16px'
//                 }}>
//                   {loading ? '載入中...' : '暫無班表資料'}
//                 </div>
//               ) : (
//                 schedules.map((schedule) => (
//                   <div
//                     key={schedule.id}
//                     style={{
//                       display: 'flex',
//                       borderBottom: '1px solid #f5f5f5',
//                       height: '70px',
//                       backgroundColor: '#FFFFFF',
//                       alignItems: 'center',
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: '40%',
//                         padding: '15px 10px',
//                         color: '#3A6CA6',
//                         fontWeight: 'bold',
//                         fontSize: '22px',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       {schedule.name}
//                     </div>
//                     <div
//                       style={{
//                         width: '30%',
//                         padding: '15px 10px',
//                         color: '#1F1F1F',
//                         fontSize: '22px',
//                       }}
//                     >
//                       {schedule.publishDate}
//                     </div>
//                     <div
//                       style={{
//                         width: '20%',
//                         padding: '15px 10px',
//                         color: '#1F1F1F',
//                         fontSize: '22px',
//                         textAlign: 'left',
//                       }}
//                     >
//                       {schedule.creator}
//                     </div>
//                     <div
//                       style={{
//                         width: '5%',
//                         padding: '15px 10px',
//                         textAlign: 'center',
//                       }}
//                     >
//                       <button
//                         style={{
//                           background: 'none',
//                           border: 'none',
//                           color: '#3A6CA6',
//                           cursor: 'pointer',
//                         }}
//                         onClick={() => handleEditSchedule(schedule.id)}
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
//                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
//                         </svg>
//                       </button>
//                     </div>
//                     <div
//                       style={{
//                         width: '5%',
//                         padding: '15px 10px',
//                         textAlign: 'center',
//                       }}
//                     >
//                       <button
//                         style={{
//                           background: 'none',
//                           border: 'none',
//                           color: '#3A6CA6',
//                           cursor: 'pointer',
//                         }}
//                         onClick={() => handleCopySchedule(schedule.id)}
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//                           <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                           <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewMonth;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Hook/useAuth'; // 🔥 引入 useAuth
import Sidebar from './Sidebar';
import Cookies from 'js-cookie'; 

const AddNewMonth = () => {
  const navigate = useNavigate();
  
  // 🔥 使用 useAuth - 只用於 token 驗證
  const { hasValidAuth, logout } = useAuth();

  // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ AddNewMonth Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    console.log('✅ AddNewMonth Token 驗證通過');
  }, [hasValidAuth, logout]);
  
  const [schedules, setSchedules] = useState([]);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayDates, setHolidayDates] = useState([]);
  const [scheduleName, setScheduleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // 從 cookies 中獲取值的函數
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // ✅ 新增：取得員工姓名的函數
  const getEmployeeName = async (companyId, employeeId) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 取得員工姓名時 Token 驗證失敗');
      logout();
      return null;
    }

    try {
      const response = await fetch('https://rabbit.54ucl.com:3004/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: companyId,
          employee_id: employeeId
        })
      });
      
      const result = await response.json();
      
      if (result.Status === 'Ok') {
        return result.Data.name;
      } else {
        console.error('取得員工姓名失敗:', result.Msg);
        return null;
      }
    } catch (error) {
      console.error('取得員工姓名錯誤:', error);
      return null;
    }
  };

  // 載入班表列表
  const loadSchedules = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 載入班表時 Token 驗證失敗');
      logout();
      return;
    }

    try {
      setLoading(true);
      const companyId = getCookie('company_id');
      
      if (!companyId) {
        setError('未找到公司資訊，請重新登入');
        return;
      }

      const response = await fetch(`https://rabbit.54ucl.com:3004/api/class-months?company_id=${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.Status === 'Ok') {
        console.log('🔍 API 返回的原始資料:', result.Data);
        
        const formattedSchedules = result.Data.map((item, index) => {
          console.log(`🔍 處理第 ${index + 1} 筆資料:`, item);
          
          return {
            id: item.id || 
                item.class_month_id || 
                item.schedule_id || 
                item.month_id || 
                `${item.company_id}-${item.year}-${item.month}` || 
                `schedule-${index}`,
            name: item.class_months_name || `${item.year}年${item.month}月班表`,
            publishDate: formatPublishDate(item.created_at),
            creator: item.created_by || '系統',
            year: item.year,
            month: item.month,
            fullName: item.class_months_name,
            originalData: item
          };
        });
        
        console.log('✅ 格式化後的班表資料:', formattedSchedules);
        setSchedules(formattedSchedules);
      } else {
        console.error('載入班表失敗:', result.Msg);
        setError(result.Msg || '載入班表失敗');
      }
    } catch (error) {
      console.error('載入班表錯誤:', error);
      setError('載入班表失敗，請檢查網路連線');
    } finally {
      setLoading(false);
    }
  };

  // 格式化發布日期
  const formatPublishDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}PM`;
  };

  useEffect(() => {
    // 設定預設的下個月日期
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const holidayDefault = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    
    setStartDate(formatDate(nextMonth));
    setEndDate(formatDate(nextMonthEnd));
    setHolidayDate(formatDate(holidayDefault));
    
    // 設定預設班表名稱
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth() + 1;
    setScheduleName(`${year}年${month}月班表`);
    
    // 載入現有班表
    loadSchedules();
    
    // 點擊外部關閉下拉選單
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowAddDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 日期格式化函數
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 新增班表按鈕樣式
  const addButtonStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '25px 26px',
    gap: '10px',
    width: '310px',
    height: '70px',
    background: loading ? '#ccc' : '#3A6CA6',
    borderRadius: '5px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    color: 'white',
    position: 'relative'
  };

  // 處理新增班表
  const handleAddSchedule = () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 新增班表時 Token 驗證失敗');
      logout();
      return;
    }

    if (loading) return;
    console.log('按鈕被點擊，當前狀態:', showAddDropdown);
    setShowAddDropdown(!showAddDropdown);
    setError('');
  };

  // ✅ 修改：處理提交新增班表
  const handleSubmitSchedule = async () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 提交班表時 Token 驗證失敗');
      logout();
      return;
    }

    // 基本驗證
    if (!scheduleName.trim()) {
      setError('請輸入班表名稱');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('請選擇班表期間');
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      setError('結束日期必須晚於開始日期');
      return;
    }

    // 從 cookies 獲取公司 ID 和員工 ID
    const companyId = getCookie('company_id');
    const employeeId = getCookie('employee_id');
    
    if (!companyId) {
      setError('未找到公司資訊，請重新登入');
      return;
    }
    
    if (!employeeId) {
      setError('未找到員工資訊，請重新登入');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // ✅ 先取得員工姓名
      const employeeName = await getEmployeeName(companyId, employeeId);
      
      if (!employeeName) {
        setError('無法取得員工姓名，請重新登入');
        setLoading(false);
        return;
      }
      
      const startDateObj = new Date(startDate);
      const year = startDateObj.getFullYear();
      const month = startDateObj.getMonth() + 1;
      
      const requestData = {
        company_id: companyId,
        year: year,
        month: month,
        class_months_name: scheduleName.trim(),
        start_date: startDate,
        end_date: endDate,
        holiday_dates: holidayDates,
        // ✅ 使用從 API 取得的員工姓名
        created_by: employeeName
      };
      
      console.log('提交資料:', requestData);
      
      const response = await fetch('https://rabbit.54ucl.com:3004/api/class-months', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await response.json();
      
      if (result.Status === 'Ok') {
        console.log('新增成功:', result);
        
        // 重新載入班表列表
        await loadSchedules();
        
        // 重置表單
        setShowAddDropdown(false);
        setHolidayDates([]);
        
        // 設定下個月的預設值
        const nextMonth = new Date(year, month, 1);
        const nextMonthEnd = new Date(year, month + 1, 0);
        setStartDate(formatDate(nextMonth));
        setEndDate(formatDate(nextMonthEnd));
        setScheduleName(`${year}年${month + 1}月班表`);
        
        alert('班表新增成功！');
      } else {
        setError(result.Msg || '新增班表失敗');
        console.error('新增失敗:', result);
      }
    } catch (error) {
      console.error('新增班表錯誤:', error);
      setError('網路錯誤，請檢查連線後再試');
    } finally {
      setLoading(false);
    }
  };

  // 處理編輯班表
  const handleEditSchedule = (id) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 編輯班表時 Token 驗證失敗');
      logout();
      return;
    }

    console.log(`🔍 編輯班表 ID: ${id}`);
    console.log('📋 所有班表資料:', schedules);
    
    // 找到對應的班表資料
    let schedule = schedules.find(s => s.id === id);
    
    if (!schedule && schedules.length > 0) {
      console.log('⚠️ 通過 ID 找不到班表，嘗試其他方式');
      
      if (id === undefined || id === null) {
        console.log('❌ ID 無效，無法確定要編輯的班表');
        alert('無法確定要編輯的班表，請重新載入頁面後再試');
        return;
      }
    }
    
    console.log('🎯 找到的班表資料:', schedule);
    
    if (schedule) {
      const companyId = getCookie('company_id');
      console.log('🏢 公司 ID:', companyId);
      
      // 清除舊的 cookies
      Cookies.remove('scheduling_year');
      Cookies.remove('scheduling_month');
      Cookies.remove('scheduling_company_id');
      
      console.log('🧹 已清除舊的 cookies');
      
      setTimeout(() => {
        // 設定新的 cookies
        Cookies.set('scheduling_year', String(schedule.year), { 
          expires: 1,
          path: '/',
          sameSite: 'lax'
        });
        Cookies.set('scheduling_month', String(schedule.month), { 
          expires: 1,
          path: '/',
          sameSite: 'lax'
        });
        Cookies.set('scheduling_company_id', String(companyId), { 
          expires: 1,
          path: '/',
          sameSite: 'lax'
        });
        
        if (schedule.fullName) {
          Cookies.set('scheduling_class_name', String(schedule.fullName), {
            expires: 1,
            path: '/',
            sameSite: 'lax'
          });
          console.log('✅ 已設定班表名稱 cookie:', schedule.fullName);
        }
        
        console.log('✅ 已設定新的 cookies:', {
          scheduling_year: String(schedule.year),
          scheduling_month: String(schedule.month),
          scheduling_company_id: String(companyId),
          scheduling_class_name: schedule.fullName || '未設定'
        });
        
        // 驗證 cookies 設定
        setTimeout(() => {
          const verifyYear = Cookies.get('scheduling_year');
          const verifyMonth = Cookies.get('scheduling_month');
          const verifyCompany = Cookies.get('scheduling_company_id');
          const verifyClassName = Cookies.get('scheduling_class_name');
          
          console.log('🔍 驗證 cookies 設定結果:', {
            scheduling_year: verifyYear,
            scheduling_month: verifyMonth,
            scheduling_company_id: verifyCompany,
            scheduling_class_name: verifyClassName
          });
          
          if (verifyYear !== String(schedule.year) || verifyMonth !== String(schedule.month)) {
            console.error('❌ Cookies 設定失敗！');
            alert('設定失敗，請重試');
          } else {
            console.log('✅ Cookies 設定成功，準備跳轉');
            console.log('🚀 跳轉到 /schedulingsystem');
            navigate('/schedulingsystem');
          }
        }, 100);
      }, 100);
      
    } else {
      console.error('❌ 找不到對應的班表資料，ID:', id);
      alert('找不到對應的班表資料，請重新載入頁面後再試');
    }
  };

  // 處理複製班表
  const handleCopySchedule = (id) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 複製班表時 Token 驗證失敗');
      logout();
      return;
    }

    console.log(`複製班表 ID: ${id}`);
  };

  // 處理新增公休假日
  const handleAddHoliday = () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 新增公休假日時 Token 驗證失敗');
      logout();
      return;
    }

    if (!holidayDate) {
      setError('請選擇公休日期');
      return;
    }
    
    if (holidayDates.includes(holidayDate)) {
      setError('此日期已經是公休日');
      return;
    }
    
    setHolidayDates([...holidayDates, holidayDate]);
    console.log('新增公休假日:', holidayDate);
    setError('');
  };

  // 移除公休假日
  const handleRemoveHoliday = (dateToRemove) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 移除公休假日時 Token 驗證失敗');
      logout();
      return;
    }

    setHolidayDates(holidayDates.filter(date => date !== dateToRemove));
  };

  // 🔥 處理輸入變更時的身份驗證檢查
  const handleScheduleNameChange = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改班表名稱時 Token 驗證失敗');
      logout();
      return;
    }
    setScheduleName(e.target.value);
  };

  const handleStartDateChange = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改開始日期時 Token 驗證失敗');
      logout();
      return;
    }
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改結束日期時 Token 驗證失敗');
      logout();
      return;
    }
    setEndDate(e.target.value);
  };

  const handleHolidayDateChange = (e) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改公休日期時 Token 驗證失敗');
      logout();
      return;
    }
    setHolidayDate(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <Sidebar currentPage="schedule" />

      <div
        style={{
          flexGrow: 1,
          padding: '20px',
          backgroundColor: 'white',
          margin: '15px',
          marginLeft: '265px',
          overflowY: 'auto',
          height: 'calc(100vh - 30px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* 錯誤訊息顯示 */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        {/* 載入中顯示 */}
        {loading && (
          <div style={{
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #bbdefb'
          }}>
            載入中...
          </div>
        )}

        {/* 主要內容區域 - 左右分佈 */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          height: '100%'
        }}>
          {/* 左側 - 新增下月班表按鈕區域 */}
          <div style={{ 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '350px',
            flexShrink: 0
          }}>
            <button 
              ref={buttonRef}
              style={addButtonStyle}
              onClick={handleAddSchedule}
              disabled={loading}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </span>
                  <span style={{ 
                    fontSize: '22px',
                    fontWeight: '700',
                    letterSpacing: '0.01em'
                  }}>新增下月班表</span>
                </div>
                <span style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: showAddDropdown ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </span>
              </div>
            </button>

            {/* 下拉選單 */}
            {showAddDropdown && (
              <div
                ref={dropdownRef}
                style={{
                  position: 'absolute',
                  top: '70px',
                  left: '0',
                  width: '310px',
                  backgroundColor: 'white',
                  borderRadius: '0 0 10px 10px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  zIndex: 999999,
                  border: '1px solid #ddd',
                  marginTop: '0px',
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}
              >
                <div
                  style={{
                    padding: '15px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px'
                  }}
                >
                  {/* 班表名稱 */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <h3
                      style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#3A6CA6',
                        letterSpacing: '0.01em',
                        height: '24px'
                      }}
                    >
                      班表名稱
                    </h3>

                    <div style={{ 
                      width: '266px',
                      height: '40px',
                      border: '1px solid rgba(233, 233, 233, 0.5)',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        value={scheduleName}
                        onChange={handleScheduleNameChange}
                        placeholder="請輸入班表名稱"
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          padding: '8px 12px',
                          fontSize: '14px',
                          color: '#666',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* 班表期間 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <h4
                        style={{
                          fontSize: '18px',
                          color: '#3A6CA6',
                          margin: '0',
                          fontWeight: 'bold',
                          letterSpacing: '0.01em',
                          height: '24px'
                        }}
                      >
                        班表期間
                      </h4>
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#909090',
                          letterSpacing: '0.01em',
                          height: '19px'
                        }}
                      >
                        設定排班期間
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          boxSizing: 'border-box',
                          width: '266px',
                          height: '54px',
                          border: '1px solid rgba(233, 233, 233, 0.5)',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          left: '18px',
                          top: 'calc(50% - 44px/2)',
                          display: 'flex',
                          flexDirection: 'column',
                          width: '189px',
                          height: '44px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#919191',
                            letterSpacing: '0.01em',
                            height: '16px'
                          }}>
                            開始時間
                          </span>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                            height: '28px'
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4D4E8" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <input
                              type="date"
                              value={startDate}
                              onChange={handleStartDateChange}
                              style={{
                                border: 'none',
                                fontSize: '14px',
                                color: '#333',
                                outline: 'none',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <div
                        style={{
                          boxSizing: 'border-box',
                          width: '266px',
                          height: '54px',
                          border: '1px solid rgba(233, 233, 233, 0.5)',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          left: '18px',
                          top: 'calc(50% - 44px/2)',
                          display: 'flex',
                          flexDirection: 'column',
                          width: '189px',
                          height: '44px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#919191',
                            letterSpacing: '0.01em',
                            height: '16px'
                          }}>
                            結束時間
                          </span>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                            height: '28px'
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4D4E8" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <input
                              type="date"
                              value={endDate}
                              onChange={handleEndDateChange}
                              style={{
                                border: 'none',
                                fontSize: '14px',
                                color: '#333',
                                outline: 'none',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 公休日期 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <h4
                        style={{
                          fontSize: '18px',
                          color: '#3A6CA6',
                          margin: '0',
                          fontWeight: 'bold',
                          letterSpacing: '0.01em',
                        }}
                      >
                        公休日期
                      </h4>
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#909090',
                          letterSpacing: '0.01em',
                        }}
                      >
                        設定公休日期，該天全體員工將無法排班
                      </span>
                    </div>
                    
                    <div
                      style={{
                        boxSizing: 'border-box',
                        width: '266px',
                        height: '54px',
                        border: '1px solid rgba(233, 233, 233, 0.5)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 18px',
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4D4E8" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <input
                        type="date"
                        value={holidayDate}
                        onChange={handleHolidayDateChange}
                        style={{
                          border: 'none',
                          width: '100%',
                          marginLeft: '8px',
                          fontSize: '14px',
                          color: '#333',
                          outline: 'none',
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={handleAddHoliday}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#e6f0ff',
                        color: '#4a86e8',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginTop: '8px',
                      }}
                    >
                      + 新增公休假日
                    </button>

                    {/* 顯示已新增的公休日期 */}
                    {holidayDates.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                          已設定公休日期：
                        </h5>
                        {holidayDates.map((date, index) => {
                          const stableKey = `holiday-item-${index}-${date.split('-').join('')}`;
                          
                          return (
                            <div key={stableKey} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '4px 8px',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '4px',
                              marginBottom: '4px',
                              fontSize: '12px'
                            }}>
                              <span>{date}</span>
                              <button
                                onClick={() => handleRemoveHoliday(date)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ff4444',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmitSchedule}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: loading ? '#ccc' : '#4a86e8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {loading ? '處理中...' : '設定完成'}
                    {!loading && (
                      <span
                        style={{
                          fontSize: '12px',
                          marginLeft: '5px',
                          opacity: 0.8,
                        }}
                      >
                        設定完成後可編輯班表內容
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右側 - 排班表列表區域 */}
          <div style={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 表格標題行 */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid #eee',
              color: '#666',
              padding: '15px 10px',
            }}>
              <div style={{ width: '40%', textAlign: 'left' }}>排班表名稱</div>
              <div style={{ width: '30%', textAlign: 'left' }}>班表發布日期</div>
              <div style={{ width: '20%', textAlign: 'left' }}>建立者</div>
              <div style={{ width: '5%', textAlign: 'center' }}>編輯</div>
              <div style={{ width: '5%', textAlign: 'center' }}>複製</div>
            </div>

            {/* 排班表列表 */}
            <div style={{ width: '100%', flexGrow: 1 }}>
              {schedules.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '16px'
                }}>
                  {loading ? '載入中...' : '暫無班表資料'}
                </div>
              ) : (
                schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    style={{
                      display: 'flex',
                      borderBottom: '1px solid #f5f5f5',
                      height: '70px',
                      backgroundColor: '#FFFFFF',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '40%',
                        padding: '15px 10px',
                        color: '#3A6CA6',
                        fontWeight: 'bold',
                        fontSize: '22px',
                        cursor: 'pointer',
                      }}
                    >
                      {schedule.name}
                    </div>
                    <div
                      style={{
                        width: '30%',
                        padding: '15px 10px',
                        color: '#1F1F1F',
                        fontSize: '22px',
                      }}
                    >
                      {schedule.publishDate}
                    </div>
                    <div
                      style={{
                        width: '20%',
                        padding: '15px 10px',
                        color: '#1F1F1F',
                        fontSize: '22px',
                        textAlign: 'left',
                      }}
                    >
                      {schedule.creator}
                    </div>
                    <div
                      style={{
                        width: '5%',
                        padding: '15px 10px',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#3A6CA6',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleEditSchedule(schedule.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                    <div
                      style={{
                        width: '5%',
                        padding: '15px 10px',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#3A6CA6',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleCopySchedule(schedule.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewMonth;
