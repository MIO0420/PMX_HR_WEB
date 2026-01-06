// // // import React, { useState, useEffect, useMemo } from 'react';
// // // import { 
// // //   fetchAttendanceRecords,
// // //   formatTimeToMinutes,
// // //   getDayOfWeek
// // // } from '../../../../Google_sheet/function/function';
// // // import './Attendance_Status.css';

// // // const Attendance_Status = ({ 
// // //   employee, // 🔥 接收員工資料 prop
// // //   onClose   // 🔥 接收關閉函數 prop
// // // }) => {
// // //   // 狀態定義
// // //   const [attendanceData, setAttendanceData] = useState([]);
// // //   const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [noRecords, setNoRecords] = useState(false);

// // //   // 🔥 從員工資料中獲取 company_id 和 employee_id
// // //   const companyId = employee?.company_id;
// // //   const employeeId = employee?.employee_id;

// // //   // 初始化時自動獲取出勤資料
// // //   useEffect(() => {
// // //     if (companyId && employeeId) {
// // //       console.log(`開始獲取員工出勤資料: 公司ID=${companyId}, 員工ID=${employeeId}`);
// // //       fetchSelectedEmployeeAttendance();
// // //     } else {
// // //       console.error('缺少必要的員工資訊:', { companyId, employeeId });
// // //       setError('員工資訊不完整，無法查詢出勤記錄');
// // //     }
// // //   }, [companyId, employeeId]);

// // //   // 計算上個月的日期範圍
// // //   const getLastMonthDateRange = () => {
// // //     const now = new Date();
// // //     let targetMonth = now.getMonth(); // 當前月份 (0-11)
// // //     let targetYear = now.getFullYear();
    
// // //     // 計算上個月
// // //     if (targetMonth === 0) {
// // //       targetMonth = 12;
// // //       targetYear = targetYear - 1;
// // //     }
    
// // //     const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
// // //     const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${new Date(targetYear, targetMonth, 0).getDate()}`;
    
// // //     return { startDate, endDate, targetYear, targetMonth };
// // //   };

// // //   // 獲取上個月顯示文字
// // //   const getLastMonthDisplay = useMemo(() => {
// // //     const { targetYear, targetMonth } = getLastMonthDateRange();
// // //     return `${targetYear}年${targetMonth}月`;
// // //   }, []);

// // //   // 獲取選中員工的出勤數據
// // //   const fetchSelectedEmployeeAttendance = async () => {
// // //     if (!companyId || !employeeId) {
// // //       setError('員工資訊不完整，無法查詢出勤記錄');
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError(null);
// // //     setNoRecords(false);

// // //     try {
// // //       const { startDate, endDate, targetYear, targetMonth } = getLastMonthDateRange();
      
// // //       console.log(`查詢員工 ${employeeId} 從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
// // //       // 🔥 使用從員工資料獲取的 company_id
// // //       const result = await fetchAttendanceRecords(
// // //         companyId,
// // //         employeeId,
// // //         startDate,
// // //         endDate,
// // //         '不限'
// // //       );
      
// // //       if (result.success) {
// // //         console.log('成功獲取出勤記錄:', result.data);
        
// // //         // 處理出勤數據
// // //         const processedData = await processAttendanceDataWithWeekends(result.data, targetYear, targetMonth);
        
// // //         setAttendanceData(processedData);
// // //         setFilteredAttendanceData(processedData);
        
// // //         if (processedData.length === 0) {
// // //           setNoRecords(true);
// // //         }
// // //       } else {
// // //         console.error('獲取出勤記錄失敗:', result.message);
// // //         setNoRecords(true);
// // //         setAttendanceData([]);
// // //         setFilteredAttendanceData([]);
// // //       }
// // //     } catch (err) {
// // //       console.error('獲取出勤數據失敗:', err);
// // //       setError(`資料讀取失敗: ${err.message}`);
// // //       setAttendanceData([]);
// // //       setFilteredAttendanceData([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 處理出勤數據（參考 AttendancePage 的邏輯）
// // //   const processAttendanceDataWithWeekends = async (data, targetYear, targetMonth) => {
// // //     try {
// // //       console.log('處理出勤記錄（包含六日）...', data);
      
// // //       const groupedRecords = {};
// // //       const datesWithRecords = new Set();
      
// // //       if (data && data.records && Array.isArray(data.records) && data.records.length > 0) {
// // //         const recordsByDate = {};
        
// // //         data.records.forEach(record => {
// // //           const workDate = record.work_date;
// // //           if (!workDate) return;
          
// // //           if (!recordsByDate[workDate]) {
// // //             recordsByDate[workDate] = {};
// // //           }
          
// // //           if (!recordsByDate[workDate][record.event_id]) {
// // //             recordsByDate[workDate][record.event_id] = [];
// // //           }
          
// // //           recordsByDate[workDate][record.event_id].push(record);
// // //         });
        
// // //         // 處理每個日期的記錄
// // //         for (const dateKey in recordsByDate) {
// // //           datesWithRecords.add(dateKey);
          
// // //           const dateParts = dateKey.split(/[/-]/);
// // //           if (dateParts.length !== 3) continue;
          
// // //           const month = parseInt(dateParts[1], 10);
// // //           const day = parseInt(dateParts[2], 10);
// // //           const formattedDate = `${day}`;
          
// // //           const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
// // //           const dayOfWeek = getDayOfWeek(dateObj);
          
// // //           groupedRecords[dateKey] = {
// // //             date: formattedDate,
// // //             day: dayOfWeek,
// // //             fullDate: dateKey,
// // //             checkIn: '--:--',
// // //             checkOut: '--:--',
// // //             checkInResult: '',
// // //             checkOutResult: '',
// // //             checkInResultText: '',
// // //             checkOutResultText: '',
// // //             checkInAbnormal: false,
// // //             checkOutAbnormal: false
// // //           };

// // //           // 處理上班和下班記錄
// // //           let latestCheckIn = null;
// // //           let latestCheckOut = null;
          
// // //           for (const eventId in recordsByDate[dateKey]) {
// // //             const records = recordsByDate[dateKey][eventId];
            
// // //             const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
// // //             const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
            
// // //             if (checkInRecords.length > 0) {
// // //               const newestCheckIn = checkInRecords.reduce((newest, current) => {
// // //                 const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
// // //                 const currentDate = new Date(current.record_date + ' ' + current.record_time);
// // //                 return currentDate > newestDate ? current : newest;
// // //               }, checkInRecords[0]);
              
// // //               if (!latestCheckIn || new Date(newestCheckIn.record_date + ' ' + newestCheckIn.record_time) > 
// // //                                    new Date(latestCheckIn.record_date + ' ' + latestCheckIn.record_time)) {
// // //                 latestCheckIn = newestCheckIn;
// // //               }
// // //             }
            
// // //             if (checkOutRecords.length > 0) {
// // //               const newestCheckOut = checkOutRecords.reduce((newest, current) => {
// // //                 const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
// // //                 const currentDate = new Date(current.record_date + ' ' + current.record_time);
// // //                 return currentDate > newestDate ? current : newest;
// // //               }, checkOutRecords[0]);
              
// // //               if (!latestCheckOut || new Date(newestCheckOut.record_date + ' ' + newestCheckOut.record_time) > 
// // //                                     new Date(latestCheckOut.record_date + ' ' + latestCheckOut.record_time)) {
// // //                 latestCheckOut = newestCheckOut;
// // //               }
// // //             }
// // //           }
          
// // //           // 更新上班記錄
// // //           if (latestCheckIn) {
// // //             groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
// // //             groupedRecords[dateKey].checkInResult = latestCheckIn.result;
            
// // //             const isLeaveResult = [
// // //               'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
// // //               'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
// // //               'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
// // //               'study_leave', 'birthday_leave', 'leave'
// // //             ].includes(latestCheckIn.result);
            
// // //             if (isLeaveResult) {
// // //               groupedRecords[dateKey].checkInResultText = '請假';
// // //               groupedRecords[dateKey].checkInAbnormal = false;
// // //             } else if (latestCheckIn.result === 'late') {
// // //               groupedRecords[dateKey].checkInResultText = '遲到';
// // //               groupedRecords[dateKey].checkInAbnormal = true;
// // //             } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
// // //               groupedRecords[dateKey].checkInResultText = '準時';
// // //               groupedRecords[dateKey].checkInAbnormal = false;
// // //             } else {
// // //               groupedRecords[dateKey].checkInResultText = '準時';
// // //               groupedRecords[dateKey].checkInAbnormal = false;
// // //             }
// // //           }
          
// // //           // 更新下班記錄
// // //           if (latestCheckOut) {
// // //             groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
// // //             groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
            
// // //             const isLeaveResult = [
// // //               'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
// // //               'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
// // //               'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
// // //               'study_leave', 'birthday_leave', 'leave'
// // //             ].includes(latestCheckOut.result);
            
// // //             if (isLeaveResult) {
// // //               groupedRecords[dateKey].checkOutResultText = '請假';
// // //               groupedRecords[dateKey].checkOutAbnormal = false;
// // //             } else if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
// // //               groupedRecords[dateKey].checkOutResultText = '早退';
// // //               groupedRecords[dateKey].checkOutAbnormal = true;
// // //             } else if (latestCheckOut.result === 'stay_late' || latestCheckOut.result === 'stay') {
// // //               groupedRecords[dateKey].checkOutResultText = '滯留';
// // //               groupedRecords[dateKey].checkOutAbnormal = true;
// // //             } else if (latestCheckOut.result === 'on_time') {
// // //               groupedRecords[dateKey].checkOutResultText = '準時';
// // //               groupedRecords[dateKey].checkOutAbnormal = false;
// // //             } else {
// // //               groupedRecords[dateKey].checkOutResultText = '準時';
// // //               groupedRecords[dateKey].checkOutAbnormal = false;
// // //             }
// // //           }
// // //         }
// // //       }
      
// // //       // 添加所有日期（包含週末）
// // //       await addAllDaysWithConditionalAbsent(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
// // //       // 轉換為陣列並按日期排序
// // //       const formattedData = Object.values(groupedRecords)
// // //         .map(item => {
// // //           if (item.isAbsent) {
// // //             return {
// // //               ...item,
// // //               checkInAbnormal: true,
// // //               checkOutAbnormal: true,
// // //               checkInResultText: '曠職',
// // //               checkOutResultText: '曠職'
// // //             };
// // //           }
// // //           return item;
// // //         })
// // //         .sort((a, b) => {
// // //           const dateA = new Date(a.fullDate);
// // //           const dateB = new Date(b.fullDate);
// // //           return dateA - dateB; 
// // //         });
      
// // //       console.log('格式化後的數據:', formattedData);
// // //       return formattedData;
// // //     } catch (err) {
// // //       console.error('處理出勤記錄時出錯:', err);
// // //       throw err;
// // //     }
// // //   };

// // //   // 添加所有日期記錄
// // //   const addAllDaysWithConditionalAbsent = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
// // //     const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    
// // //     for (let day = 1; day <= daysInMonth; day++) {
// // //       const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
// // //       if (datesWithRecords.has(dateStr)) {
// // //         continue;
// // //       }
      
// // //       const dateObj = new Date(targetYear, targetMonth - 1, day);
// // //       const dayOfWeek = dateObj.getDay();
// // //       const dayOfWeekText = getDayOfWeek(dateObj);
      
// // //       const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
// // //       const shouldMarkAsAbsent = isWorkday; // 上個月的平日都標記為曠職（如果沒有記錄）
      
// // //       groupedRecords[dateStr] = {
// // //         date: String(day),
// // //         day: dayOfWeekText,
// // //         fullDate: dateStr,
// // //         checkIn: '--:--',
// // //         checkOut: '--:--',
// // //         checkInTimestamp: 0,
// // //         checkOutTimestamp: 0,
// // //         checkInEventId: null,
// // //         checkOutEventId: null,
// // //         checkInResult: '',
// // //         checkOutResult: '',
// // //         isAbsent: shouldMarkAsAbsent,
// // //         checkInAbnormal: shouldMarkAsAbsent,
// // //         checkOutAbnormal: shouldMarkAsAbsent,
// // //         checkInResultText: shouldMarkAsAbsent ? '曠職' : '',
// // //         checkOutResultText: shouldMarkAsAbsent ? '曠職' : ''
// // //       };
// // //     }
// // //   };

// // //   // 獲取日曆數據
// // //   const getCalendarData = () => {
// // //     const { targetYear, targetMonth } = getLastMonthDateRange();

// // //     const firstDay = new Date(targetYear, targetMonth - 1, 1);
// // //     const lastDay = new Date(targetYear, targetMonth, 0);
// // //     const daysInMonth = lastDay.getDate();
// // //     const startingDayOfWeek = firstDay.getDay();

// // //     const calendarDays = [];
    
// // //     // 填充上個月的日期
// // //     for (let i = startingDayOfWeek - 1; i >= 0; i--) {
// // //       const prevDate = new Date(targetYear, targetMonth - 1, -i);
// // //       calendarDays.push({
// // //         date: prevDate.getDate(),
// // //         isCurrentMonth: false,
// // //         fullDate: prevDate,
// // //         attendance: null
// // //       });
// // //     }

// // //     // 填充當月的日期
// // //     for (let day = 1; day <= daysInMonth; day++) {
// // //       const date = new Date(targetYear, targetMonth - 1, day);
// // //       const dateString = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// // //       const attendanceRecord = filteredAttendanceData.find(record => record.fullDate === dateString);
      
// // //       calendarDays.push({
// // //         date: day,
// // //         isCurrentMonth: true,
// // //         fullDate: date,
// // //         attendance: attendanceRecord
// // //       });
// // //     }

// // //     // 填充下個月的日期
// // //     const remainingDays = 42 - calendarDays.length;
// // //     for (let day = 1; day <= remainingDays; day++) {
// // //       const nextDate = new Date(targetYear, targetMonth, day);
// // //       calendarDays.push({
// // //         date: day,
// // //         isCurrentMonth: false,
// // //         fullDate: nextDate,
// // //         attendance: null
// // //       });
// // //     }

// // //     return calendarDays;
// // //   };

// // //   // 獲取出勤狀態樣式
// // //   const getAttendanceStyle = (attendance) => {
// // //     if (!attendance) return '';
    
// // //     const hasCheckInAbnormal = attendance.checkInAbnormal;
// // //     const hasCheckOutAbnormal = attendance.checkOutAbnormal;
    
// // //     if (attendance.isAbsent) {
// // //       return 'attendance-absent'; // 曠職
// // //     }
    
// // //     if (attendance.checkInResultText === '請假' || attendance.checkOutResultText === '請假') {
// // //       return 'attendance-dayoff'; // 請假
// // //     }
    
// // //     if (hasCheckInAbnormal && hasCheckOutAbnormal) {
// // //       return 'attendance-mixed'; // 上下班都異常
// // //     } else if (hasCheckInAbnormal || hasCheckOutAbnormal) {
// // //       return 'attendance-late'; // 部分異常
// // //     } else if (attendance.checkIn !== '--:--' || attendance.checkOut !== '--:--') {
// // //       return 'attendance-normal'; // 正常
// // //     }
    
// // //     return '';
// // //   };

// // //   // 匯出 Excel 功能
// // //   const handleExportExcel = () => {
// // //     if (!employee) {
// // //       alert('員工資訊不完整');
// // //       return;
// // //     }
// // //     console.log('匯出 Excel - 員工:', employee.name);
// // //     // 這裡可以實作實際的 Excel 匯出邏輯
// // //     alert(`匯出 ${employee.name} 的出勤記錄 Excel`);
// // //   };

// // //   // 匯出 PDF 功能
// // //   const handleExportPDF = () => {
// // //     if (!employee) {
// // //       alert('員工資訊不完整');
// // //       return;
// // //     }
// // //     console.log('匯出 PDF - 員工:', employee.name);
// // //     // 這裡可以實作實際的 PDF 匯出邏輯
// // //     alert(`匯出 ${employee.name} 的出勤記錄 PDF`);
// // //   };

// // //   // 渲染日曆日期
// // //   const renderCalendarDay = (dayData, index) => {
// // //     const { date, isCurrentMonth, attendance } = dayData;
// // //     const attendanceClass = attendance ? getAttendanceStyle(attendance) : '';
// // //     const otherMonthClass = !isCurrentMonth ? 'other-month' : '';
    
// // //     return (
// // //       <div key={index} className="calendar-date-element">
// // //         <div className={`date-circle ${attendanceClass} ${otherMonthClass}`}>
// // //           <span className="date-number">{date}</span>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // 渲染出勤詳情表格
// // //   const renderAttendanceTable = () => {
// // //     if (loading) {
// // //       return <div className="attendance-loading-text">載入中...</div>;
// // //     }

// // //     if (error) {
// // //       return (
// // //         <div>
// // //           <div className="attendance-error-text">{error}</div>
// // //           <button className="attendance-retry-button" onClick={() => fetchSelectedEmployeeAttendance()}>
// // //             重試
// // //           </button>
// // //         </div>
// // //       );
// // //     }

// // //     if (!employee) {
// // //       return <div className="no-records-message">員工資訊不完整</div>;
// // //     }

// // //     if (noRecords || filteredAttendanceData.length === 0) {
// // //       return <div className="no-records-message">該員工上月無出勤記錄</div>;
// // //     }

// // //     return (
// // //       <table className="attendance-table">
// // //         <thead>
// // //           <tr>
// // //             <th className="attendance-date-column">日期</th>
// // //             <th className="attendance-time-column">上班時間</th>
// // //             <th className="attendance-time-column">下班時間</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {filteredAttendanceData.map((record, index) => {
// // //             const day = parseInt(record.date);
            
// // //             return (
// // //               <tr key={index} className="attendance-table-row">
// // //                 <td className="attendance-date-cell">
// // //                   <div className="attendance-date-block">
// // //                     <div className="attendance-date-number">{day}</div>
// // //                     <div className="attendance-day-of-week">{record.day}</div>
// // //                   </div>
// // //                 </td>
// // //                 <td className="attendance-time-cell">
// // //                   <div>
// // //                     {record.checkInResultText && record.checkInResultText !== '準時' && (
// // //                       <span className={`attendance-status-tag ${record.checkInAbnormal ? 'abnormal' : 'normal'}`}>
// // //                         {record.checkInResultText}
// // //                       </span>
// // //                     )}
// // //                     {record.checkIn}
// // //                     {record.checkInAbnormal && record.checkInResultText !== '請假' && (
// // //                       <span className="attendance-abnormal-label">異常</span>
// // //                     )}
// // //                   </div>
// // //                 </td>
// // //                 <td className="attendance-time-cell">
// // //                   <div>
// // //                     {record.checkOutResultText && record.checkOutResultText !== '準時' && (
// // //                       <span className={`attendance-status-tag ${record.checkOutAbnormal ? 'abnormal' : 'normal'}`}>
// // //                         {record.checkOutResultText}
// // //                       </span>
// // //                     )}
// // //                     {record.checkOut}
// // //                     {record.checkOutAbnormal && record.checkOutResultText !== '請假' && (
// // //                       <span className="attendance-abnormal-label">異常</span>
// // //                     )}
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             );
// // //           })}
// // //         </tbody>
// // //       </table>
// // //     );
// // //   };

// // //   // 渲染圖例
// // //   const renderLegend = () => {
// // //     const legendItems = [
// // //       { color: '#3AA672', text: '正常' },
// // //       { color: '#ED1313', text: '遲到/早退' },
// // //       { color: '#3A6CA6', text: '請假' },
// // //       { color: '#FF6B6B', text: '曠職' },
// // //       { color: 'linear-gradient(180deg, #ED1313 0%, #3AA672 100%)', text: '異常混合' }
// // //     ];

// // //     return (
// // //       <div className="legend-container">
// // //         {legendItems.map((item, index) => (
// // //           <div key={index} className="legend-item">
// // //             <div 
// // //               className="legend-color" 
// // //               style={{ background: item.color }}
// // //             ></div>
// // //             <span className="legend-text">{item.text}</span>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     );
// // //   };

// // //   // 🔥 如果沒有員工資料，顯示錯誤訊息
// // //   if (!employee) {
// // //     return (
// // //       <div className="attendance-status-container">
// // //         <div className="attendance-main-frame">
// // //           <div className="attendance-error-text">
// // //             員工資訊不完整，無法查詢出勤記錄
// // //           </div>
// // //           {onClose && (
// // //             <button className="attendance-retry-button" onClick={onClose}>
// // //               返回
// // //             </button>
// // //           )}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const calendarData = getCalendarData();
// // //   const weeks = [];
// // //   for (let i = 0; i < calendarData.length; i += 7) {
// // //     weeks.push(calendarData.slice(i, i + 7));
// // //   }

// // //   return (
// // //     <div className="attendance-status-container">
// // //       <div className="attendance-main-frame">
// // //         {/* 🔥 員工資訊顯示區域 */}
// // //         <div className="employee-info-section">
// // //           <div className="employee-info-header">
// // //             <h3>員工出勤狀況 - {employee.name} ({employee.employee_id})</h3>
// // //             {onClose && (
// // //               <button className="close-button" onClick={onClose}>
// // //                 ✕ 關閉
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>

// // //         <div className="attendance-layout">
// // //           {/* 左側日曆區域 */}
// // //           <div className="calendar-section">
// // //             <div className="calendar-container">
// // //               {/* 月份標題 */}
// // //               <div className="month-header">
// // //                 <div className="month-display">
// // //                   <span className="month-title">{getLastMonthDisplay}</span>
// // //                 </div>
// // //               </div>

// // //               {/* 星期標題 */}
// // //               <div className="weekday-header">
// // //                 {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
// // //                   <div key={index} className="weekday-cell">
// // //                     <span>{day}</span>
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               {/* 日曆網格 */}
// // //               <div className="calendar-grid">
// // //                 {weeks.map((week, weekIndex) => (
// // //                   <div key={weekIndex} className="calendar-week">
// // //                     {week.map((day, dayIndex) => renderCalendarDay(day, `${weekIndex}-${dayIndex}`))}
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               {/* 圖例 */}
// // //               {renderLegend()}
// // //             </div>
// // //           </div>

// // //           {/* 右側出勤詳情區域 */}
// // //           <div className="attendance-details-section">
// // //             <div className="attendance-month-display">
// // //               {employee.name} - {getLastMonthDisplay} 出勤記錄
// // //             </div>
            
// // //             <div className="attendance-table-container">
// // //               {renderAttendanceTable()}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* 底部匯出按鈕區域 */}
// // //         <div className="bottom-export-buttons-container">
// // //           <button 
// // //             className="bottom-export-button excel-button" 
// // //             onClick={handleExportExcel}
// // //             disabled={loading || !employee}
// // //           >
// // //             匯出 Excel
// // //           </button>
// // //           <button 
// // //             className="bottom-export-button pdf-button" 
// // //             onClick={handleExportPDF}
// // //             disabled={loading || !employee}
// // //           >
// // //             匯出 PDF
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Attendance_Status;
// // import React, { useState, useEffect, useMemo } from 'react';
// // import { 
// //   fetchAttendanceRecords,
// //   formatTimeToMinutes,
// //   getDayOfWeek
// // } from '../../../../Google_sheet/function/function';
// // import './Attendance_Status.css';
// // // 🔥 新增匯出功能套件
// // import * as XLSX from 'xlsx';
// // import { jsPDF } from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // const Attendance_Status = ({ 
// //   employee, // 🔥 接收員工資料 prop
// //   onClose   // 🔥 接收關閉函數 prop
// // }) => {
// //   // 狀態定義
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [noRecords, setNoRecords] = useState(false);
// //   // 🔥 新增匯出狀態
// //   const [exporting, setExporting] = useState(false);

// //   // 🔥 從員工資料中獲取 company_id 和 employee_id
// //   const companyId = employee?.company_id;
// //   const employeeId = employee?.employee_id;

// //   // 初始化時自動獲取出勤資料
// //   useEffect(() => {
// //     if (companyId && employeeId) {
// //       console.log(`開始獲取員工出勤資料: 公司ID=${companyId}, 員工ID=${employeeId}`);
// //       fetchSelectedEmployeeAttendance();
// //     } else {
// //       console.error('缺少必要的員工資訊:', { companyId, employeeId });
// //       setError('員工資訊不完整，無法查詢出勤記錄');
// //     }
// //   }, [companyId, employeeId]);

// //   // 計算上個月的日期範圍
// //   const getLastMonthDateRange = () => {
// //     const now = new Date();
// //     let targetMonth = now.getMonth(); // 當前月份 (0-11)
// //     let targetYear = now.getFullYear();
    
// //     // 計算上個月
// //     if (targetMonth === 0) {
// //       targetMonth = 12;
// //       targetYear = targetYear - 1;
// //     }
    
// //     const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
// //     const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${new Date(targetYear, targetMonth, 0).getDate()}`;
    
// //     return { startDate, endDate, targetYear, targetMonth };
// //   };

// //   // 獲取上個月顯示文字
// //   const getLastMonthDisplay = useMemo(() => {
// //     const { targetYear, targetMonth } = getLastMonthDateRange();
// //     return `${targetYear}年${targetMonth}月`;
// //   }, []);

// //   // 獲取選中員工的出勤數據
// //   const fetchSelectedEmployeeAttendance = async () => {
// //     if (!companyId || !employeeId) {
// //       setError('員工資訊不完整，無法查詢出勤記錄');
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
// //     setNoRecords(false);

// //     try {
// //       const { startDate, endDate, targetYear, targetMonth } = getLastMonthDateRange();
      
// //       console.log(`查詢員工 ${employeeId} 從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
// //       // 🔥 使用從員工資料獲取的 company_id
// //       const result = await fetchAttendanceRecords(
// //         companyId,
// //         employeeId,
// //         startDate,
// //         endDate,
// //         '不限'
// //       );
      
// //       if (result.success) {
// //         console.log('成功獲取出勤記錄:', result.data);
        
// //         // 處理出勤數據
// //         const processedData = await processAttendanceDataWithWeekends(result.data, targetYear, targetMonth);
        
// //         setAttendanceData(processedData);
// //         setFilteredAttendanceData(processedData);
        
// //         if (processedData.length === 0) {
// //           setNoRecords(true);
// //         }
// //       } else {
// //         console.error('獲取出勤記錄失敗:', result.message);
// //         setNoRecords(true);
// //         setAttendanceData([]);
// //         setFilteredAttendanceData([]);
// //       }
// //     } catch (err) {
// //       console.error('獲取出勤數據失敗:', err);
// //       setError(`資料讀取失敗: ${err.message}`);
// //       setAttendanceData([]);
// //       setFilteredAttendanceData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 處理出勤數據（參考 AttendancePage 的邏輯）
// //   const processAttendanceDataWithWeekends = async (data, targetYear, targetMonth) => {
// //     try {
// //       console.log('處理出勤記錄（包含六日）...', data);
      
// //       const groupedRecords = {};
// //       const datesWithRecords = new Set();
      
// //       if (data && data.records && Array.isArray(data.records) && data.records.length > 0) {
// //         const recordsByDate = {};
        
// //         data.records.forEach(record => {
// //           const workDate = record.work_date;
// //           if (!workDate) return;
          
// //           if (!recordsByDate[workDate]) {
// //             recordsByDate[workDate] = {};
// //           }
          
// //           if (!recordsByDate[workDate][record.event_id]) {
// //             recordsByDate[workDate][record.event_id] = [];
// //           }
          
// //           recordsByDate[workDate][record.event_id].push(record);
// //         });
        
// //         // 處理每個日期的記錄
// //         for (const dateKey in recordsByDate) {
// //           datesWithRecords.add(dateKey);
          
// //           const dateParts = dateKey.split(/[/-]/);
// //           if (dateParts.length !== 3) continue;
          
// //           const month = parseInt(dateParts[1], 10);
// //           const day = parseInt(dateParts[2], 10);
// //           const formattedDate = `${day}`;
          
// //           const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
// //           const dayOfWeek = getDayOfWeek(dateObj);
          
// //           groupedRecords[dateKey] = {
// //             date: formattedDate,
// //             day: dayOfWeek,
// //             fullDate: dateKey,
// //             checkIn: '--:--',
// //             checkOut: '--:--',
// //             checkInResult: '',
// //             checkOutResult: '',
// //             checkInResultText: '',
// //             checkOutResultText: '',
// //             checkInAbnormal: false,
// //             checkOutAbnormal: false
// //           };

// //           // 處理上班和下班記錄
// //           let latestCheckIn = null;
// //           let latestCheckOut = null;
          
// //           for (const eventId in recordsByDate[dateKey]) {
// //             const records = recordsByDate[dateKey][eventId];
            
// //             const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
// //             const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
            
// //             if (checkInRecords.length > 0) {
// //               const newestCheckIn = checkInRecords.reduce((newest, current) => {
// //                 const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
// //                 const currentDate = new Date(current.record_date + ' ' + current.record_time);
// //                 return currentDate > newestDate ? current : newest;
// //               }, checkInRecords[0]);
              
// //               if (!latestCheckIn || new Date(newestCheckIn.record_date + ' ' + newestCheckIn.record_time) > 
// //                                    new Date(latestCheckIn.record_date + ' ' + latestCheckIn.record_time)) {
// //                 latestCheckIn = newestCheckIn;
// //               }
// //             }
            
// //             if (checkOutRecords.length > 0) {
// //               const newestCheckOut = checkOutRecords.reduce((newest, current) => {
// //                 const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
// //                 const currentDate = new Date(current.record_date + ' ' + current.record_time);
// //                 return currentDate > newestDate ? current : newest;
// //               }, checkOutRecords[0]);
              
// //               if (!latestCheckOut || new Date(newestCheckOut.record_date + ' ' + newestCheckOut.record_time) > 
// //                                     new Date(latestCheckOut.record_date + ' ' + latestCheckOut.record_time)) {
// //                 latestCheckOut = newestCheckOut;
// //               }
// //             }
// //           }
          
// //           // 更新上班記錄
// //           if (latestCheckIn) {
// //             groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
// //             groupedRecords[dateKey].checkInResult = latestCheckIn.result;
            
// //             const isLeaveResult = [
// //               'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
// //               'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
// //               'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
// //               'study_leave', 'birthday_leave', 'leave'
// //             ].includes(latestCheckIn.result);
            
// //             if (isLeaveResult) {
// //               groupedRecords[dateKey].checkInResultText = '請假';
// //               groupedRecords[dateKey].checkInAbnormal = false;
// //             } else if (latestCheckIn.result === 'late') {
// //               groupedRecords[dateKey].checkInResultText = '遲到';
// //               groupedRecords[dateKey].checkInAbnormal = true;
// //             } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
// //               groupedRecords[dateKey].checkInResultText = '準時';
// //               groupedRecords[dateKey].checkInAbnormal = false;
// //             } else {
// //               groupedRecords[dateKey].checkInResultText = '準時';
// //               groupedRecords[dateKey].checkInAbnormal = false;
// //             }
// //           }
          
// //           // 更新下班記錄
// //           if (latestCheckOut) {
// //             groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
// //             groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
            
// //             const isLeaveResult = [
// //               'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
// //               'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
// //               'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
// //               'study_leave', 'birthday_leave', 'leave'
// //             ].includes(latestCheckOut.result);
            
// //             if (isLeaveResult) {
// //               groupedRecords[dateKey].checkOutResultText = '請假';
// //               groupedRecords[dateKey].checkOutAbnormal = false;
// //             } else if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
// //               groupedRecords[dateKey].checkOutResultText = '早退';
// //               groupedRecords[dateKey].checkOutAbnormal = true;
// //             } else if (latestCheckOut.result === 'stay_late' || latestCheckOut.result === 'stay') {
// //               groupedRecords[dateKey].checkOutResultText = '滯留';
// //               groupedRecords[dateKey].checkOutAbnormal = true;
// //             } else if (latestCheckOut.result === 'on_time') {
// //               groupedRecords[dateKey].checkOutResultText = '準時';
// //               groupedRecords[dateKey].checkOutAbnormal = false;
// //             } else {
// //               groupedRecords[dateKey].checkOutResultText = '準時';
// //               groupedRecords[dateKey].checkOutAbnormal = false;
// //             }
// //           }
// //         }
// //       }
      
// //       // 添加所有日期（包含週末）
// //       await addAllDaysWithConditionalAbsent(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
// //       // 轉換為陣列並按日期排序
// //       const formattedData = Object.values(groupedRecords)
// //         .map(item => {
// //           if (item.isAbsent) {
// //             return {
// //               ...item,
// //               checkInAbnormal: true,
// //               checkOutAbnormal: true,
// //               checkInResultText: '曠職',
// //               checkOutResultText: '曠職'
// //             };
// //           }
// //           return item;
// //         })
// //         .sort((a, b) => {
// //           const dateA = new Date(a.fullDate);
// //           const dateB = new Date(b.fullDate);
// //           return dateA - dateB; 
// //         });
      
// //       console.log('格式化後的數據:', formattedData);
// //       return formattedData;
// //     } catch (err) {
// //       console.error('處理出勤記錄時出錯:', err);
// //       throw err;
// //     }
// //   };

// //   // 添加所有日期記錄
// //   const addAllDaysWithConditionalAbsent = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
// //     const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    
// //     for (let day = 1; day <= daysInMonth; day++) {
// //       const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
// //       if (datesWithRecords.has(dateStr)) {
// //         continue;
// //       }
      
// //       const dateObj = new Date(targetYear, targetMonth - 1, day);
// //       const dayOfWeek = dateObj.getDay();
// //       const dayOfWeekText = getDayOfWeek(dateObj);
      
// //       const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
// //       const shouldMarkAsAbsent = isWorkday; // 上個月的平日都標記為曠職（如果沒有記錄）
      
// //       groupedRecords[dateStr] = {
// //         date: String(day),
// //         day: dayOfWeekText,
// //         fullDate: dateStr,
// //         checkIn: '--:--',
// //         checkOut: '--:--',
// //         checkInTimestamp: 0,
// //         checkOutTimestamp: 0,
// //         checkInEventId: null,
// //         checkOutEventId: null,
// //         checkInResult: '',
// //         checkOutResult: '',
// //         isAbsent: shouldMarkAsAbsent,
// //         checkInAbnormal: shouldMarkAsAbsent,
// //         checkOutAbnormal: shouldMarkAsAbsent,
// //         checkInResultText: shouldMarkAsAbsent ? '曠職' : '',
// //         checkOutResultText: shouldMarkAsAbsent ? '曠職' : ''
// //       };
// //     }
// //   };

// //   // 獲取日曆數據
// //   const getCalendarData = () => {
// //     const { targetYear, targetMonth } = getLastMonthDateRange();

// //     const firstDay = new Date(targetYear, targetMonth - 1, 1);
// //     const lastDay = new Date(targetYear, targetMonth, 0);
// //     const daysInMonth = lastDay.getDate();
// //     const startingDayOfWeek = firstDay.getDay();

// //     const calendarDays = [];
    
// //     // 填充上個月的日期
// //     for (let i = startingDayOfWeek - 1; i >= 0; i--) {
// //       const prevDate = new Date(targetYear, targetMonth - 1, -i);
// //       calendarDays.push({
// //         date: prevDate.getDate(),
// //         isCurrentMonth: false,
// //         fullDate: prevDate,
// //         attendance: null
// //       });
// //     }

// //     // 填充當月的日期
// //     for (let day = 1; day <= daysInMonth; day++) {
// //       const date = new Date(targetYear, targetMonth - 1, day);
// //       const dateString = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// //       const attendanceRecord = filteredAttendanceData.find(record => record.fullDate === dateString);
      
// //       calendarDays.push({
// //         date: day,
// //         isCurrentMonth: true,
// //         fullDate: date,
// //         attendance: attendanceRecord
// //       });
// //     }

// //     // 填充下個月的日期
// //     const remainingDays = 42 - calendarDays.length;
// //     for (let day = 1; day <= remainingDays; day++) {
// //       const nextDate = new Date(targetYear, targetMonth, day);
// //       calendarDays.push({
// //         date: day,
// //         isCurrentMonth: false,
// //         fullDate: nextDate,
// //         attendance: null
// //       });
// //     }

// //     return calendarDays;
// //   };

// //   // 獲取出勤狀態樣式
// //   const getAttendanceStyle = (attendance) => {
// //     if (!attendance) return '';
    
// //     const hasCheckInAbnormal = attendance.checkInAbnormal;
// //     const hasCheckOutAbnormal = attendance.checkOutAbnormal;
    
// //     if (attendance.isAbsent) {
// //       return 'attendance-absent'; // 曠職
// //     }
    
// //     if (attendance.checkInResultText === '請假' || attendance.checkOutResultText === '請假') {
// //       return 'attendance-dayoff'; // 請假
// //     }
    
// //     if (hasCheckInAbnormal && hasCheckOutAbnormal) {
// //       return 'attendance-mixed'; // 上下班都異常
// //     } else if (hasCheckInAbnormal || hasCheckOutAbnormal) {
// //       return 'attendance-late'; // 部分異常
// //     } else if (attendance.checkIn !== '--:--' || attendance.checkOut !== '--:--') {
// //       return 'attendance-normal'; // 正常
// //     }
    
// //     return '';
// //   };

// //   // 🔥 實際的 Excel 匯出功能
// //   const handleExportExcel = async () => {
// //     if (!employee) {
// //       alert('員工資訊不完整');
// //       return;
// //     }

// //     if (filteredAttendanceData.length === 0) {
// //       alert('沒有出勤資料可以匯出');
// //       return;
// //     }

// //     setExporting(true);
    
// //     try {
// //       console.log('開始匯出 Excel - 員工:', employee.name);
      
// //       // 🔥 準備匯出資料
// //       const exportData = filteredAttendanceData.map(record => {
// //         // 計算異常狀況
// //         let abnormalStatus = '';
// //         const abnormalItems = [];
        
// //         if (record.checkInAbnormal && record.checkInResultText !== '請假') {
// //           abnormalItems.push(`上班${record.checkInResultText}`);
// //         }
// //         if (record.checkOutAbnormal && record.checkOutResultText !== '請假') {
// //           abnormalItems.push(`下班${record.checkOutResultText}`);
// //         }
        
// //         if (abnormalItems.length > 0) {
// //           abnormalStatus = abnormalItems.join('、');
// //         } else if (record.checkInResultText === '請假' || record.checkOutResultText === '請假') {
// //           abnormalStatus = '請假';
// //         } else {
// //           abnormalStatus = '正常';
// //         }

// //         return {
// //           '日期': `${getLastMonthDisplay}${record.date}日`,
// //           '星期': record.day,
// //           '上班時間': record.checkIn,
// //           '上班狀態': record.checkInResultText || '正常',
// //           '下班時間': record.checkOut,
// //           '下班狀態': record.checkOutResultText || '正常',
// //           '出勤狀況': abnormalStatus
// //         };
// //       });

// //       // 🔥 建立工作簿
// //       const wb = XLSX.utils.book_new();
// //       const ws = XLSX.utils.json_to_sheet(exportData);

// //       // 🔥 設定欄位寬度
// //       ws['!cols'] = [
// //         { width: 18 }, // 日期
// //         { width: 8 },  // 星期
// //         { width: 12 }, // 上班時間
// //         { width: 12 }, // 上班狀態
// //         { width: 12 }, // 下班時間
// //         { width: 12 }, // 下班狀態
// //         { width: 15 }  // 出勤狀況
// //       ];

// //       // 🔥 設定標題樣式
// //       const range = XLSX.utils.decode_range(ws['!ref']);
// //       for (let col = range.s.c; col <= range.e.c; col++) {
// //         const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
// //         if (!ws[cellAddress]) continue;
        
// //         ws[cellAddress].s = {
// //           font: { bold: true },
// //           fill: { fgColor: { rgb: "3A6CA6" } },
// //           alignment: { horizontal: "center" }
// //         };
// //       }

// //       XLSX.utils.book_append_sheet(wb, ws, '出勤記錄');

// //       // 🔥 生成檔案名稱
// //       const fileName = `${employee.name}_${getLastMonthDisplay}_出勤記錄.xlsx`;
      
// //       // 🔥 匯出檔案
// //       XLSX.writeFile(wb, fileName);

// //       console.log(`✅ Excel 檔案已成功匯出: ${fileName}`);
// //       alert(`Excel 檔案已匯出完成！\n檔案名稱：${fileName}`);
      
// //     } catch (error) {
// //       console.error('❌ Excel 匯出失敗:', error);
// //       alert('Excel 匯出失敗，請稍後再試');
// //     } finally {
// //       setExporting(false);
// //     }
// //   };

// //   // 🔥 實際的 PDF 匯出功能
// //   const handleExportPDF = async () => {
// //     if (!employee) {
// //       alert('員工資訊不完整');
// //       return;
// //     }

// //     if (filteredAttendanceData.length === 0) {
// //       alert('沒有出勤資料可以匯出');
// //       return;
// //     }

// //     setExporting(true);
    
// //     try {
// //       console.log('開始匯出 PDF - 員工:', employee.name);
      
// //       // 🔥 建立 PDF 文件
// //       const doc = new jsPDF();
      
// //       // 🔥 設定字體（使用內建字體）
// //       doc.setFont('helvetica');
      
// //       // 🔥 添加標題
// //       doc.setFontSize(18);
// //       doc.setTextColor(58, 108, 166); // 藍色標題
// //       const title = `${employee.name} - ${getLastMonthDisplay} Attendance Record`;
// //       const titleWidth = doc.getTextWidth(title);
// //       const pageWidth = doc.internal.pageSize.getWidth();
// //       doc.text(title, (pageWidth - titleWidth) / 2, 25);
      
// //       // 🔥 添加員工資訊
// //       doc.setFontSize(12);
// //       doc.setTextColor(0, 0, 0); // 黑色文字
// //       doc.text(`Employee ID: ${employee.employee_id}`, 20, 40);
// //       doc.text(`Company ID: ${employee.company_id}`, 20, 50);
// //       doc.text(`Export Date: ${new Date().toLocaleDateString('zh-TW')}`, 20, 60);
      
// //       // 🔥 準備表格資料
// //       const tableData = filteredAttendanceData.map(record => {
// //         // 計算異常狀況
// //         let abnormalStatus = '';
// //         const abnormalItems = [];
        
// //         if (record.checkInAbnormal && record.checkInResultText !== '請假') {
// //           abnormalItems.push(`In: ${record.checkInResultText}`);
// //         }
// //         if (record.checkOutAbnormal && record.checkOutResultText !== '請假') {
// //           abnormalItems.push(`Out: ${record.checkOutResultText}`);
// //         }
        
// //         if (abnormalItems.length > 0) {
// //           abnormalStatus = abnormalItems.join(', ');
// //         } else if (record.checkInResultText === '請假' || record.checkOutResultText === '請假') {
// //           abnormalStatus = 'Leave';
// //         } else {
// //           abnormalStatus = 'Normal';
// //         }

// //         return [
// //           `${record.date}`,
// //           record.day,
// //           record.checkIn,
// //           record.checkInResultText || 'Normal',
// //           record.checkOut,
// //           record.checkOutResultText || 'Normal',
// //           abnormalStatus
// //         ];
// //       });

// //       // 🔥 建立表格
// //       autoTable(doc,{
// //         startY: 75,
// //         head: [['Date', 'Day', 'Check In', 'In Status', 'Check Out', 'Out Status', 'Summary']],
// //         body: tableData,
// //         styles: {
// //           fontSize: 9,
// //           cellPadding: 2,
// //           halign: 'center'
// //         },
// //         headStyles: {
// //           fillColor: [58, 108, 166],
// //           textColor: [255, 255, 255],
// //           fontSize: 10,
// //           fontStyle: 'bold'
// //         },
// //         columnStyles: {
// //           0: { cellWidth: 20 }, // Date
// //           1: { cellWidth: 20 }, // Day
// //           2: { cellWidth: 25 }, // Check In
// //           3: { cellWidth: 25 }, // In Status
// //           4: { cellWidth: 25 }, // Check Out
// //           5: { cellWidth: 25 }, // Out Status
// //           6: { cellWidth: 35 }  // Summary
// //         },
// //         alternateRowStyles: {
// //           fillColor: [245, 245, 245]
// //         },
// //         margin: { left: 15, right: 15 }
// //       });

// //       // 🔥 添加頁尾
// //       const pageCount = doc.internal.getNumberOfPages();
// //       for (let i = 1; i <= pageCount; i++) {
// //         doc.setPage(i);
// //         doc.setFontSize(8);
// //         doc.setTextColor(128, 128, 128);
// //         doc.text(
// //           `Page ${i} of ${pageCount}`, 
// //           pageWidth - 30, 
// //           doc.internal.pageSize.getHeight() - 10
// //         );
// //         doc.text(
// //           `Generated on ${new Date().toLocaleString('zh-TW')}`, 
// //           20, 
// //           doc.internal.pageSize.getHeight() - 10
// //         );
// //       }

// //       // 🔥 生成檔案名稱
// //       const fileName = `${employee.name}_${getLastMonthDisplay}_出勤記錄.pdf`;
      
// //       // 🔥 匯出檔案
// //       doc.save(fileName);

// //       console.log(`✅ PDF 檔案已成功匯出: ${fileName}`);
// //       alert(`PDF 檔案已匯出完成！\n檔案名稱：${fileName}`);
      
// //     } catch (error) {
// //       console.error('❌ PDF 匯出失敗:', error);
// //       alert('PDF 匯出失敗，請稍後再試');
// //     } finally {
// //       setExporting(false);
// //     }
// //   };

// //   // 渲染日曆日期
// //   const renderCalendarDay = (dayData, index) => {
// //     const { date, isCurrentMonth, attendance } = dayData;
// //     const attendanceClass = attendance ? getAttendanceStyle(attendance) : '';
// //     const otherMonthClass = !isCurrentMonth ? 'other-month' : '';
    
// //     return (
// //       <div key={index} className="calendar-date-element">
// //         <div className={`date-circle ${attendanceClass} ${otherMonthClass}`}>
// //           <span className="date-number">{date}</span>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // 渲染出勤詳情表格
// //   const renderAttendanceTable = () => {
// //     if (loading) {
// //       return <div className="attendance-loading-text">載入中...</div>;
// //     }

// //     if (error) {
// //       return (
// //         <div>
// //           <div className="attendance-error-text">{error}</div>
// //           <button className="attendance-retry-button" onClick={() => fetchSelectedEmployeeAttendance()}>
// //             重試
// //           </button>
// //         </div>
// //       );
// //     }

// //     if (!employee) {
// //       return <div className="no-records-message">員工資訊不完整</div>;
// //     }

// //     if (noRecords || filteredAttendanceData.length === 0) {
// //       return <div className="no-records-message">該員工上月無出勤記錄</div>;
// //     }

// //     return (
// //       <table className="attendance-table">
// //         <thead>
// //           <tr>
// //             <th className="attendance-date-column">日期</th>
// //             <th className="attendance-time-column">上班時間</th>
// //             <th className="attendance-time-column">下班時間</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {filteredAttendanceData.map((record, index) => {
// //             const day = parseInt(record.date);
            
// //             return (
// //               <tr key={index} className="attendance-table-row">
// //                 <td className="attendance-date-cell">
// //                   <div className="attendance-date-block">
// //                     <div className="attendance-date-number">{day}</div>
// //                     <div className="attendance-day-of-week">{record.day}</div>
// //                   </div>
// //                 </td>
// //                 <td className="attendance-time-cell">
// //                   <div>
// //                     {record.checkInResultText && record.checkInResultText !== '準時' && (
// //                       <span className={`attendance-status-tag ${record.checkInAbnormal ? 'abnormal' : 'normal'}`}>
// //                         {record.checkInResultText}
// //                       </span>
// //                     )}
// //                     {record.checkIn}
// //                     {record.checkInAbnormal && record.checkInResultText !== '請假' && (
// //                       <span className="attendance-abnormal-label">異常</span>
// //                     )}
// //                   </div>
// //                 </td>
// //                 <td className="attendance-time-cell">
// //                   <div>
// //                     {record.checkOutResultText && record.checkOutResultText !== '準時' && (
// //                       <span className={`attendance-status-tag ${record.checkOutAbnormal ? 'abnormal' : 'normal'}`}>
// //                         {record.checkOutResultText}
// //                       </span>
// //                     )}
// //                     {record.checkOut}
// //                     {record.checkOutAbnormal && record.checkOutResultText !== '請假' && (
// //                       <span className="attendance-abnormal-label">異常</span>
// //                     )}
// //                   </div>
// //                 </td>
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //     );
// //   };

// //   // 渲染圖例
// //   const renderLegend = () => {
// //     const legendItems = [
// //       { color: '#3AA672', text: '正常' },
// //       { color: '#ED1313', text: '遲到/早退' },
// //       { color: '#3A6CA6', text: '請假' },
// //       { color: '#FF6B6B', text: '曠職' },
// //       { color: 'linear-gradient(180deg, #ED1313 0%, #3AA672 100%)', text: '異常混合' }
// //     ];

// //     return (
// //       <div className="legend-container">
// //         {legendItems.map((item, index) => (
// //           <div key={index} className="legend-item">
// //             <div 
// //               className="legend-color" 
// //               style={{ background: item.color }}
// //             ></div>
// //             <span className="legend-text">{item.text}</span>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   // 🔥 如果沒有員工資料，顯示錯誤訊息
// //   if (!employee) {
// //     return (
// //       <div className="attendance-status-container">
// //         <div className="attendance-main-frame">
// //           <div className="attendance-error-text">
// //             員工資訊不完整，無法查詢出勤記錄
// //           </div>
// //           {onClose && (
// //             <button className="attendance-retry-button" onClick={onClose}>
// //               返回
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   const calendarData = getCalendarData();
// //   const weeks = [];
// //   for (let i = 0; i < calendarData.length; i += 7) {
// //     weeks.push(calendarData.slice(i, i + 7));
// //   }

// //   return (
// //     <div className="attendance-status-container">
// //       <div className="attendance-main-frame">
// //         {/* 🔥 員工資訊顯示區域 */}
// //         <div className="employee-info-section">
// //           <div className="employee-info-header">
// //             <h3>員工出勤狀況 - {employee.name} ({employee.employee_id})</h3>
// //             {onClose && (
// //               <button className="close-button" onClick={onClose}>
// //                 ✕ 關閉
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="attendance-layout">
// //           {/* 左側日曆區域 */}
// //           <div className="calendar-section">
// //             <div className="calendar-container">
// //               {/* 月份標題 */}
// //               <div className="month-header">
// //                 <div className="month-display">
// //                   <span className="month-title">{getLastMonthDisplay}</span>
// //                 </div>
// //               </div>

// //               {/* 星期標題 */}
// //               <div className="weekday-header">
// //                 {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
// //                   <div key={index} className="weekday-cell">
// //                     <span>{day}</span>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* 日曆網格 */}
// //               <div className="calendar-grid">
// //                 {weeks.map((week, weekIndex) => (
// //                   <div key={weekIndex} className="calendar-week">
// //                     {week.map((day, dayIndex) => renderCalendarDay(day, `${weekIndex}-${dayIndex}`))}
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* 圖例 */}
// //               {renderLegend()}
// //             </div>
// //           </div>

// //           {/* 右側出勤詳情區域 */}
// //           <div className="attendance-details-section">
// //             <div className="attendance-month-display">
// //               {employee.name} - {getLastMonthDisplay} 出勤記錄
// //             </div>
            
// //             <div className="attendance-table-container">
// //               {renderAttendanceTable()}
// //             </div>
// //           </div>
// //         </div>

// //         {/* 🔥 底部匯出按鈕區域 - 加入載入狀態 */}
// //         <div className="bottom-export-buttons-container">
// //           <button 
// //             className="bottom-export-button excel-button" 
// //             onClick={handleExportExcel}
// //             disabled={loading || !employee || exporting || filteredAttendanceData.length === 0}
// //           >
// //             {exporting ? '匯出中...' : '匯出 Excel'}
// //           </button>
// //           <button 
// //             className="bottom-export-button pdf-button" 
// //             onClick={handleExportPDF}
// //             disabled={loading || !employee || exporting || filteredAttendanceData.length === 0}
// //           >
// //             {exporting ? '匯出中...' : '匯出 PDF'}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Attendance_Status;
// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   fetchAttendanceRecords,
//   formatTimeToMinutes,
//   getDayOfWeek
// } from '../../../../Google_sheet/function/function';
// import './Attendance_Status.css';
// // 🔥 修正匯出功能套件
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const Attendance_Status = ({ 
//   employee, // 🔥 接收員工資料 prop
//   onClose   // 🔥 接收關閉函數 prop
// }) => {
//   // 狀態定義
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [noRecords, setNoRecords] = useState(false);
//   // 🔥 新增匯出狀態
//   const [exporting, setExporting] = useState(false);

//   // 🔥 從員工資料中獲取 company_id 和 employee_id
//   const companyId = employee?.company_id;
//   const employeeId = employee?.employee_id;

//   // 初始化時自動獲取出勤資料
//   useEffect(() => {
//     if (companyId && employeeId) {
//       console.log(`開始獲取員工出勤資料: 公司ID=${companyId}, 員工ID=${employeeId}`);
//       fetchSelectedEmployeeAttendance();
//     } else {
//       console.error('缺少必要的員工資訊:', { companyId, employeeId });
//       setError('員工資訊不完整，無法查詢出勤記錄');
//     }
//   }, [companyId, employeeId]);

//   // 計算上個月的日期範圍
//   const getLastMonthDateRange = () => {
//     const now = new Date();
//     let targetMonth = now.getMonth(); // 當前月份 (0-11)
//     let targetYear = now.getFullYear();
    
//     // 計算上個月
//     if (targetMonth === 0) {
//       targetMonth = 12;
//       targetYear = targetYear - 1;
//     }
    
//     const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
//     const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${new Date(targetYear, targetMonth, 0).getDate()}`;
    
//     return { startDate, endDate, targetYear, targetMonth };
//   };

//   // 獲取上個月顯示文字
//   const getLastMonthDisplay = useMemo(() => {
//     const { targetYear, targetMonth } = getLastMonthDateRange();
//     return `${targetYear}年${targetMonth}月`;
//   }, []);

//   // 獲取選中員工的出勤數據
//   const fetchSelectedEmployeeAttendance = async () => {
//     if (!companyId || !employeeId) {
//       setError('員工資訊不完整，無法查詢出勤記錄');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setNoRecords(false);

//     try {
//       const { startDate, endDate, targetYear, targetMonth } = getLastMonthDateRange();
      
//       console.log(`查詢員工 ${employeeId} 從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
//       // 🔥 使用從員工資料獲取的 company_id
//       const result = await fetchAttendanceRecords(
//         companyId,
//         employeeId,
//         startDate,
//         endDate,
//         '不限'
//       );
      
//       if (result.success) {
//         console.log('成功獲取出勤記錄:', result.data);
        
//         // 處理出勤數據
//         const processedData = await processAttendanceDataWithWeekends(result.data, targetYear, targetMonth);
        
//         setAttendanceData(processedData);
//         setFilteredAttendanceData(processedData);
        
//         if (processedData.length === 0) {
//           setNoRecords(true);
//         }
//       } else {
//         console.error('獲取出勤記錄失敗:', result.message);
//         setNoRecords(true);
//         setAttendanceData([]);
//         setFilteredAttendanceData([]);
//       }
//     } catch (err) {
//       console.error('獲取出勤數據失敗:', err);
//       setError(`資料讀取失敗: ${err.message}`);
//       setAttendanceData([]);
//       setFilteredAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 處理出勤數據（參考 AttendancePage 的邏輯）
//   const processAttendanceDataWithWeekends = async (data, targetYear, targetMonth) => {
//     try {
//       console.log('處理出勤記錄（包含六日）...', data);
      
//       const groupedRecords = {};
//       const datesWithRecords = new Set();
      
//       if (data && data.records && Array.isArray(data.records) && data.records.length > 0) {
//         const recordsByDate = {};
        
//         data.records.forEach(record => {
//           const workDate = record.work_date;
//           if (!workDate) return;
          
//           if (!recordsByDate[workDate]) {
//             recordsByDate[workDate] = {};
//           }
          
//           if (!recordsByDate[workDate][record.event_id]) {
//             recordsByDate[workDate][record.event_id] = [];
//           }
          
//           recordsByDate[workDate][record.event_id].push(record);
//         });
        
//         // 處理每個日期的記錄
//         for (const dateKey in recordsByDate) {
//           datesWithRecords.add(dateKey);
          
//           const dateParts = dateKey.split(/[/-]/);
//           if (dateParts.length !== 3) continue;
          
//           const month = parseInt(dateParts[1], 10);
//           const day = parseInt(dateParts[2], 10);
//           const formattedDate = `${day}`;
          
//           const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
//           const dayOfWeek = getDayOfWeek(dateObj);
          
//           groupedRecords[dateKey] = {
//             date: formattedDate,
//             day: dayOfWeek,
//             fullDate: dateKey,
//             checkIn: '--:--',
//             checkOut: '--:--',
//             checkInResult: '',
//             checkOutResult: '',
//             checkInResultText: '',
//             checkOutResultText: '',
//             checkInAbnormal: false,
//             checkOutAbnormal: false
//           };

//           // 處理上班和下班記錄
//           let latestCheckIn = null;
//           let latestCheckOut = null;
          
//           for (const eventId in recordsByDate[dateKey]) {
//             const records = recordsByDate[dateKey][eventId];
            
//             const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
//             const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
            
//             if (checkInRecords.length > 0) {
//               const newestCheckIn = checkInRecords.reduce((newest, current) => {
//                 const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
//                 const currentDate = new Date(current.record_date + ' ' + current.record_time);
//                 return currentDate > newestDate ? current : newest;
//               }, checkInRecords[0]);
              
//               if (!latestCheckIn || new Date(newestCheckIn.record_date + ' ' + newestCheckIn.record_time) > 
//                                    new Date(latestCheckIn.record_date + ' ' + latestCheckIn.record_time)) {
//                 latestCheckIn = newestCheckIn;
//               }
//             }
            
//             if (checkOutRecords.length > 0) {
//               const newestCheckOut = checkOutRecords.reduce((newest, current) => {
//                 const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
//                 const currentDate = new Date(current.record_date + ' ' + current.record_time);
//                 return currentDate > newestDate ? current : newest;
//               }, checkOutRecords[0]);
              
//               if (!latestCheckOut || new Date(newestCheckOut.record_date + ' ' + newestCheckOut.record_time) > 
//                                     new Date(latestCheckOut.record_date + ' ' + latestCheckOut.record_time)) {
//                 latestCheckOut = newestCheckOut;
//               }
//             }
//           }
          
//           // 更新上班記錄
//           if (latestCheckIn) {
//             groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
//             groupedRecords[dateKey].checkInResult = latestCheckIn.result;
            
//             const isLeaveResult = [
//               'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
//               'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
//               'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
//               'study_leave', 'birthday_leave', 'leave'
//             ].includes(latestCheckIn.result);
            
//             if (isLeaveResult) {
//               groupedRecords[dateKey].checkInResultText = '請假';
//               groupedRecords[dateKey].checkInAbnormal = false;
//             } else if (latestCheckIn.result === 'late') {
//               groupedRecords[dateKey].checkInResultText = '遲到';
//               groupedRecords[dateKey].checkInAbnormal = true;
//             } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
//               groupedRecords[dateKey].checkInResultText = '準時';
//               groupedRecords[dateKey].checkInAbnormal = false;
//             } else {
//               groupedRecords[dateKey].checkInResultText = '準時';
//               groupedRecords[dateKey].checkInAbnormal = false;
//             }
//           }
          
//           // 更新下班記錄
//           if (latestCheckOut) {
//             groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
//             groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
            
//             const isLeaveResult = [
//               'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
//               'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
//               'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
//               'study_leave', 'birthday_leave', 'leave'
//             ].includes(latestCheckOut.result);
            
//             if (isLeaveResult) {
//               groupedRecords[dateKey].checkOutResultText = '請假';
//               groupedRecords[dateKey].checkOutAbnormal = false;
//             } else if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
//               groupedRecords[dateKey].checkOutResultText = '早退';
//               groupedRecords[dateKey].checkOutAbnormal = true;
//             } else if (latestCheckOut.result === 'stay_late' || latestCheckOut.result === 'stay') {
//               groupedRecords[dateKey].checkOutResultText = '滯留';
//               groupedRecords[dateKey].checkOutAbnormal = true;
//             } else if (latestCheckOut.result === 'on_time') {
//               groupedRecords[dateKey].checkOutResultText = '準時';
//               groupedRecords[dateKey].checkOutAbnormal = false;
//             } else {
//               groupedRecords[dateKey].checkOutResultText = '準時';
//               groupedRecords[dateKey].checkOutAbnormal = false;
//             }
//           }
//         }
//       }
      
//       // 添加所有日期（包含週末）
//       await addAllDaysWithConditionalAbsent(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
//       // 轉換為陣列並按日期排序
//       const formattedData = Object.values(groupedRecords)
//         .map(item => {
//           if (item.isAbsent) {
//             return {
//               ...item,
//               checkInAbnormal: true,
//               checkOutAbnormal: true,
//               checkInResultText: '曠職',
//               checkOutResultText: '曠職'
//             };
//           }
//           return item;
//         })
//         .sort((a, b) => {
//           const dateA = new Date(a.fullDate);
//           const dateB = new Date(b.fullDate);
//           return dateA - dateB; 
//         });
      
//       console.log('格式化後的數據:', formattedData);
//       return formattedData;
//     } catch (err) {
//       console.error('處理出勤記錄時出錯:', err);
//       throw err;
//     }
//   };

//   // 添加所有日期記錄
//   const addAllDaysWithConditionalAbsent = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
//     const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
//       if (datesWithRecords.has(dateStr)) {
//         continue;
//       }
      
//       const dateObj = new Date(targetYear, targetMonth - 1, day);
//       const dayOfWeek = dateObj.getDay();
//       const dayOfWeekText = getDayOfWeek(dateObj);
      
//       const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
//       const shouldMarkAsAbsent = isWorkday; // 上個月的平日都標記為曠職（如果沒有記錄）
      
//       groupedRecords[dateStr] = {
//         date: String(day),
//         day: dayOfWeekText,
//         fullDate: dateStr,
//         checkIn: '--:--',
//         checkOut: '--:--',
//         checkInTimestamp: 0,
//         checkOutTimestamp: 0,
//         checkInEventId: null,
//         checkOutEventId: null,
//         checkInResult: '',
//         checkOutResult: '',
//         isAbsent: shouldMarkAsAbsent,
//         checkInAbnormal: shouldMarkAsAbsent,
//         checkOutAbnormal: shouldMarkAsAbsent,
//         checkInResultText: shouldMarkAsAbsent ? '曠職' : '',
//         checkOutResultText: shouldMarkAsAbsent ? '曠職' : ''
//       };
//     }
//   };

//   // 獲取日曆數據
//   const getCalendarData = () => {
//     const { targetYear, targetMonth } = getLastMonthDateRange();

//     const firstDay = new Date(targetYear, targetMonth - 1, 1);
//     const lastDay = new Date(targetYear, targetMonth, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const calendarDays = [];
    
//     // 填充上個月的日期
//     for (let i = startingDayOfWeek - 1; i >= 0; i--) {
//       const prevDate = new Date(targetYear, targetMonth - 1, -i);
//       calendarDays.push({
//         date: prevDate.getDate(),
//         isCurrentMonth: false,
//         fullDate: prevDate,
//         attendance: null
//       });
//     }

//     // 填充當月的日期
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(targetYear, targetMonth - 1, day);
//       const dateString = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//       const attendanceRecord = filteredAttendanceData.find(record => record.fullDate === dateString);
      
//       calendarDays.push({
//         date: day,
//         isCurrentMonth: true,
//         fullDate: date,
//         attendance: attendanceRecord
//       });
//     }

//     // 填充下個月的日期
//     const remainingDays = 42 - calendarDays.length;
//     for (let day = 1; day <= remainingDays; day++) {
//       const nextDate = new Date(targetYear, targetMonth, day);
//       calendarDays.push({
//         date: day,
//         isCurrentMonth: false,
//         fullDate: nextDate,
//         attendance: null
//       });
//     }

//     return calendarDays;
//   };

//   // 獲取出勤狀態樣式
//   const getAttendanceStyle = (attendance) => {
//     if (!attendance) return '';
    
//     const hasCheckInAbnormal = attendance.checkInAbnormal;
//     const hasCheckOutAbnormal = attendance.checkOutAbnormal;
    
//     if (attendance.isAbsent) {
//       return 'attendance-absent'; // 曠職
//     }
    
//     if (attendance.checkInResultText === '請假' || attendance.checkOutResultText === '請假') {
//       return 'attendance-dayoff'; // 請假
//     }
    
//     if (hasCheckInAbnormal && hasCheckOutAbnormal) {
//       return 'attendance-mixed'; // 上下班都異常
//     } else if (hasCheckInAbnormal || hasCheckOutAbnormal) {
//       return 'attendance-late'; // 部分異常
//     } else if (attendance.checkIn !== '--:--' || attendance.checkOut !== '--:--') {
//       return 'attendance-normal'; // 正常
//     }
    
//     return '';
//   };

//   // 🔥 實際的 Excel 匯出功能
//   const handleExportExcel = async () => {
//     if (!employee) {
//       alert('員工資訊不完整');
//       return;
//     }

//     if (filteredAttendanceData.length === 0) {
//       alert('沒有出勤資料可以匯出');
//       return;
//     }

//     setExporting(true);
    
//     try {
//       console.log('開始匯出 Excel - 員工:', employee.name);
      
//       // 🔥 準備匯出資料
//       const exportData = filteredAttendanceData.map(record => {
//         // 計算異常狀況
//         let abnormalStatus = '';
//         const abnormalItems = [];
        
//         if (record.checkInAbnormal && record.checkInResultText !== '請假') {
//           abnormalItems.push(`上班${record.checkInResultText}`);
//         }
//         if (record.checkOutAbnormal && record.checkOutResultText !== '請假') {
//           abnormalItems.push(`下班${record.checkOutResultText}`);
//         }
        
//         if (abnormalItems.length > 0) {
//           abnormalStatus = abnormalItems.join('、');
//         } else if (record.checkInResultText === '請假' || record.checkOutResultText === '請假') {
//           abnormalStatus = '請假';
//         } else {
//           abnormalStatus = '正常';
//         }

//         return {
//           '日期': `${getLastMonthDisplay}${record.date}日`,
//           '星期': record.day,
//           '上班時間': record.checkIn,
//           '上班狀態': record.checkInResultText || '正常',
//           '下班時間': record.checkOut,
//           '下班狀態': record.checkOutResultText || '正常',
//           '出勤狀況': abnormalStatus
//         };
//       });

//       // 🔥 建立工作簿
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(exportData);

//       // 🔥 設定欄位寬度
//       ws['!cols'] = [
//         { width: 18 }, // 日期
//         { width: 8 },  // 星期
//         { width: 12 }, // 上班時間
//         { width: 12 }, // 上班狀態
//         { width: 12 }, // 下班時間
//         { width: 12 }, // 下班狀態
//         { width: 15 }  // 出勤狀況
//       ];

//       XLSX.utils.book_append_sheet(wb, ws, '出勤記錄');

//       // 🔥 生成檔案名稱
//       const fileName = `${employee.name}_${getLastMonthDisplay}_出勤記錄.xlsx`;
      
//       // 🔥 匯出檔案
//       XLSX.writeFile(wb, fileName);

//       console.log(`✅ Excel 檔案已成功匯出: ${fileName}`);
//       alert(`Excel 檔案已匯出完成！\n檔案名稱：${fileName}`);
      
//     } catch (error) {
//       console.error('❌ Excel 匯出失敗:', error);
//       alert('Excel 匯出失敗，請稍後再試');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // 🔥 修正的 PDF 匯出功能 - 解決中文亂碼問題
//   const handleExportPDF = async () => {
//     if (!employee) {
//       alert('員工資訊不完整');
//       return;
//     }

//     if (filteredAttendanceData.length === 0) {
//       alert('沒有出勤資料可以匯出');
//       return;
//     }

//     setExporting(true);
    
//     try {
//       console.log('開始匯出 PDF - 員工:', employee.name);
      
//       // 🔥 建立 PDF 文件
//       const doc = new jsPDF();
      
//       // 🔥 設定字體為 Arial（支援基本英文和數字）
//       doc.setFont('helvetica');
      
//       // 🔥 添加標題（使用英文避免亂碼）
//       doc.setFontSize(18);
//       doc.setTextColor(58, 108, 166);
//       const title = `Attendance Record - ${getLastMonthDisplay}`;
//       const titleWidth = doc.getTextWidth(title);
//       const pageWidth = doc.internal.pageSize.getWidth();
//       doc.text(title, (pageWidth - titleWidth) / 2, 25);
      
//       // 🔥 添加員工資訊（使用英文標籤）
//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0);
//       doc.text(`Employee Name: ${employee.name}`, 20, 40);
//       doc.text(`Employee ID: ${employee.employee_id}`, 20, 50);
//       doc.text(`Company ID: ${employee.company_id}`, 20, 60);
//       doc.text(`Export Date: ${new Date().toLocaleDateString('en-US')}`, 20, 70);
      
//       // 🔥 準備表格資料（使用英文標籤）
//       const tableData = filteredAttendanceData.map(record => {
//         // 轉換中文狀態為英文
//         const getEnglishStatus = (chineseStatus) => {
//           const statusMap = {
//             '準時': 'On Time',
//             '遲到': 'Late',
//             '早退': 'Early Leave',
//             '請假': 'Leave',
//             '曠職': 'Absent',
//             '滯留': 'Overtime'
//           };
//           return statusMap[chineseStatus] || chineseStatus || 'Normal';
//         };

//         // 轉換星期為英文
//         const getEnglishDay = (chineseDay) => {
//           const dayMap = {
//             '星期日': 'Sun',
//             '星期一': 'Mon',
//             '星期二': 'Tue',
//             '星期三': 'Wed',
//             '星期四': 'Thu',
//             '星期五': 'Fri',
//             '星期六': 'Sat'
//           };
//           return dayMap[chineseDay] || chineseDay;
//         };

//         // 計算異常狀況
//         let abnormalStatus = '';
//         const abnormalItems = [];
        
//         if (record.checkInAbnormal && record.checkInResultText !== '請假') {
//           abnormalItems.push(`In: ${getEnglishStatus(record.checkInResultText)}`);
//         }
//         if (record.checkOutAbnormal && record.checkOutResultText !== '請假') {
//           abnormalItems.push(`Out: ${getEnglishStatus(record.checkOutResultText)}`);
//         }
        
//         if (abnormalItems.length > 0) {
//           abnormalStatus = abnormalItems.join(', ');
//         } else if (record.checkInResultText === '請假' || record.checkOutResultText === '請假') {
//           abnormalStatus = 'Leave';
//         } else {
//           abnormalStatus = 'Normal';
//         }

//         return [
//           record.date, // 只顯示日期數字
//           getEnglishDay(record.day),
//           record.checkIn,
//           getEnglishStatus(record.checkInResultText),
//           record.checkOut,
//           getEnglishStatus(record.checkOutResultText),
//           abnormalStatus
//         ];
//       });

//       // 🔥 建立表格
//       autoTable(doc, {
//         startY: 85,
//         head: [['Date', 'Day', 'Check In', 'In Status', 'Check Out', 'Out Status', 'Summary']],
//         body: tableData,
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//           halign: 'center',
//           font: 'helvetica' // 確保使用支援的字體
//         },
//         headStyles: {
//           fillColor: [58, 108, 166],
//           textColor: [255, 255, 255],
//           fontSize: 10,
//           fontStyle: 'bold',
//           font: 'helvetica'
//         },
//         columnStyles: {
//           0: { cellWidth: 20, halign: 'center' }, // Date
//           1: { cellWidth: 20, halign: 'center' }, // Day
//           2: { cellWidth: 25, halign: 'center' }, // Check In
//           3: { cellWidth: 25, halign: 'center' }, // In Status
//           4: { cellWidth: 25, halign: 'center' }, // Check Out
//           5: { cellWidth: 25, halign: 'center' }, // Out Status
//           6: { cellWidth: 35, halign: 'center' }  // Summary
//         },
//         alternateRowStyles: {
//           fillColor: [245, 245, 245]
//         },
//         margin: { left: 15, right: 15 },
//         theme: 'striped'
//       });

//       // 🔥 添加統計資訊
//       const finalY = doc.lastAutoTable.finalY + 20;
      
//       // 計算統計數據
//       const totalDays = filteredAttendanceData.length;
//       const normalDays = filteredAttendanceData.filter(r => 
//         !r.checkInAbnormal && !r.checkOutAbnormal && 
//         r.checkInResultText !== '請假' && r.checkOutResultText !== '請假' &&
//         r.checkIn !== '--:--'
//       ).length;
//       const leaveDays = filteredAttendanceData.filter(r => 
//         r.checkInResultText === '請假' || r.checkOutResultText === '請假'
//       ).length;
//       const absentDays = filteredAttendanceData.filter(r => 
//         r.checkInResultText === '曠職' || r.checkOutResultText === '曠職'
//       ).length;
//       const lateDays = filteredAttendanceData.filter(r => 
//         (r.checkInAbnormal && r.checkInResultText !== '請假' && r.checkInResultText !== '曠職') ||
//         (r.checkOutAbnormal && r.checkOutResultText !== '請假' && r.checkOutResultText !== '曠職')
//       ).length;

//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0);
//       doc.text('Attendance Summary:', 20, finalY);
      
//       doc.setFontSize(10);
//       doc.text(`Total Days: ${totalDays}`, 20, finalY + 15);
//       doc.text(`Normal Days: ${normalDays}`, 20, finalY + 25);
//       doc.text(`Leave Days: ${leaveDays}`, 20, finalY + 35);
//       doc.text(`Late/Early Days: ${lateDays}`, 20, finalY + 45);
//       doc.text(`Absent Days: ${absentDays}`, 20, finalY + 55);

//       // 🔥 添加頁尾
//       const pageCount = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setFontSize(8);
//         doc.setTextColor(128, 128, 128);
//         doc.text(
//           `Page ${i} of ${pageCount}`, 
//           pageWidth - 30, 
//           doc.internal.pageSize.getHeight() - 10
//         );
//         doc.text(
//           `Generated on ${new Date().toLocaleDateString('en-US')}`, 
//           20, 
//           doc.internal.pageSize.getHeight() - 10
//         );
//       }

//       // 🔥 生成檔案名稱（使用英文）
//       const fileName = `${employee.name}_${getLastMonthDisplay}_Attendance_Record.pdf`;
      
//       // 🔥 匯出檔案
//       doc.save(fileName);

//       console.log(`✅ PDF 檔案已成功匯出: ${fileName}`);
//       alert(`PDF 檔案已匯出完成！\n檔案名稱：${fileName}\n\n注意：PDF 使用英文標籤以避免亂碼問題`);
      
//     } catch (error) {
//       console.error('❌ PDF 匯出失敗:', error);
//       alert(`PDF 匯出失敗: ${error.message}`);
//     } finally {
//       setExporting(false);
//     }
//   };

//   // 渲染日曆日期
//   const renderCalendarDay = (dayData, index) => {
//     const { date, isCurrentMonth, attendance } = dayData;
//     const attendanceClass = attendance ? getAttendanceStyle(attendance) : '';
//     const otherMonthClass = !isCurrentMonth ? 'other-month' : '';
    
//     return (
//       <div key={index} className="calendar-date-element">
//         <div className={`date-circle ${attendanceClass} ${otherMonthClass}`}>
//           <span className="date-number">{date}</span>
//         </div>
//       </div>
//     );
//   };

//   // 渲染出勤詳情表格
//   const renderAttendanceTable = () => {
//     if (loading) {
//       return <div className="attendance-loading-text">載入中...</div>;
//     }

//     if (error) {
//       return (
//         <div>
//           <div className="attendance-error-text">{error}</div>
//           <button className="attendance-retry-button" onClick={() => fetchSelectedEmployeeAttendance()}>
//             重試
//           </button>
//         </div>
//       );
//     }

//     if (!employee) {
//       return <div className="no-records-message">員工資訊不完整</div>;
//     }

//     if (noRecords || filteredAttendanceData.length === 0) {
//       return <div className="no-records-message">該員工上月無出勤記錄</div>;
//     }

//     return (
//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th className="attendance-date-column">日期</th>
//             <th className="attendance-time-column">上班時間</th>
//             <th className="attendance-time-column">下班時間</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredAttendanceData.map((record, index) => {
//             const day = parseInt(record.date);
            
//             return (
//               <tr key={index} className="attendance-table-row">
//                 <td className="attendance-date-cell">
//                   <div className="attendance-date-block">
//                     <div className="attendance-date-number">{day}</div>
//                     <div className="attendance-day-of-week">{record.day}</div>
//                   </div>
//                 </td>
//                 <td className="attendance-time-cell">
//                   <div>
//                     {record.checkInResultText && record.checkInResultText !== '準時' && (
//                       <span className={`attendance-status-tag ${record.checkInAbnormal ? 'abnormal' : 'normal'}`}>
//                         {record.checkInResultText}
//                       </span>
//                     )}
//                     {record.checkIn}
//                     {record.checkInAbnormal && record.checkInResultText !== '請假' && (
//                       <span className="attendance-abnormal-label">異常</span>
//                     )}
//                   </div>
//                 </td>
//                 <td className="attendance-time-cell">
//                   <div>
//                     {record.checkOutResultText && record.checkOutResultText !== '準時' && (
//                       <span className={`attendance-status-tag ${record.checkOutAbnormal ? 'abnormal' : 'normal'}`}>
//                         {record.checkOutResultText}
//                       </span>
//                     )}
//                     {record.checkOut}
//                     {record.checkOutAbnormal && record.checkOutResultText !== '請假' && (
//                       <span className="attendance-abnormal-label">異常</span>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     );
//   };

//   // 渲染圖例
//   const renderLegend = () => {
//     const legendItems = [
//       { color: '#3AA672', text: '正常' },
//       { color: '#ED1313', text: '遲到/早退' },
//       { color: '#3A6CA6', text: '請假' },
//       { color: '#FF6B6B', text: '曠職' },
//       { color: 'linear-gradient(180deg, #ED1313 0%, #3AA672 100%)', text: '異常混合' }
//     ];

//     return (
//       <div className="legend-container">
//         {legendItems.map((item, index) => (
//           <div key={index} className="legend-item">
//             <div 
//               className="legend-color" 
//               style={{ background: item.color }}
//             ></div>
//             <span className="legend-text">{item.text}</span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // 🔥 如果沒有員工資料，顯示錯誤訊息
//   if (!employee) {
//     return (
//       <div className="attendance-status-container">
//         <div className="attendance-main-frame">
//           <div className="attendance-error-text">
//             員工資訊不完整，無法查詢出勤記錄
//           </div>
//           {onClose && (
//             <button className="attendance-retry-button" onClick={onClose}>
//               返回
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   const calendarData = getCalendarData();
//   const weeks = [];
//   for (let i = 0; i < calendarData.length; i += 7) {
//     weeks.push(calendarData.slice(i, i + 7));
//   }

//   return (
//     <div className="attendance-status-container">
//       <div className="attendance-main-frame">
//         {/* 🔥 員工資訊顯示區域 */}
//         <div className="employee-info-section">
//           <div className="employee-info-header">
//             <h3>員工出勤狀況 - {employee.name} ({employee.employee_id})</h3>
//             {onClose && (
//               <button className="close-button" onClick={onClose}>
//                 ✕ 關閉
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="attendance-layout">
//           {/* 左側日曆區域 */}
//           <div className="calendar-section">
//             <div className="calendar-container">
//               {/* 月份標題 */}
//               <div className="month-header">
//                 <div className="month-display">
//                   <span className="month-title">{getLastMonthDisplay}</span>
//                 </div>
//               </div>

//               {/* 星期標題 */}
//               <div className="weekday-header">
//                 {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
//                   <div key={index} className="weekday-cell">
//                     <span>{day}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* 日曆網格 */}
//               <div className="calendar-grid">
//                 {weeks.map((week, weekIndex) => (
//                   <div key={weekIndex} className="calendar-week">
//                     {week.map((day, dayIndex) => renderCalendarDay(day, `${weekIndex}-${dayIndex}`))}
//                   </div>
//                 ))}
//               </div>

//               {/* 圖例 */}
//               {renderLegend()}
//             </div>
//           </div>

//           {/* 右側出勤詳情區域 */}
//           <div className="attendance-details-section">
//             <div className="attendance-month-display">
//               {employee.name} - {getLastMonthDisplay} 出勤記錄
//             </div>
            
//             <div className="attendance-table-container">
//               {renderAttendanceTable()}
//             </div>
//           </div>
//         </div>

//         {/* 🔥 底部匯出按鈕區域 - 加入載入狀態 */}
//         <div className="bottom-export-buttons-container">
//           <button 
//             className="bottom-export-button excel-button" 
//             onClick={handleExportExcel}
//             disabled={loading || !employee || exporting || filteredAttendanceData.length === 0}
//           >
//             {exporting ? '匯出中...' : '匯出 Excel'}
//           </button>
//           <button 
//             className="bottom-export-button pdf-button" 
//             onClick={handleExportPDF}
//             disabled={loading || !employee || exporting || filteredAttendanceData.length === 0}
//           >
//             {exporting ? '匯出中...' : '匯出 PDF'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance_Status;
import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchAttendanceRecords,
  formatTimeToMinutes,
  getDayOfWeek
} from '../../../../Google_sheet/function/function';
import './Attendance_Status.css';
// 🔥 修正匯出功能套件
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle';

const Attendance_Status = ({ 
  employee, // 🔥 接收員工資料 prop
  onClose   // 🔥 接收關閉函數 prop
}) => {
  // 狀態定義
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noRecords, setNoRecords] = useState(false);
  // 🔥 新增匯出狀態
  const [exporting, setExporting] = useState(false);

  // 🔥 從員工資料中獲取 company_id 和 employee_id
  const companyId = employee?.company_id;
  const employeeId = employee?.employee_id;

  // 初始化時自動獲取出勤資料
  useEffect(() => {
    if (companyId && employeeId) {
      console.log(`開始獲取員工出勤資料: 公司ID=${companyId}, 員工ID=${employeeId}`);
      fetchSelectedEmployeeAttendance();
    } else {
      console.error('缺少必要的員工資訊:', { companyId, employeeId });
      setError('員工資訊不完整，無法查詢出勤記錄');
    }
  }, [companyId, employeeId]);

  // 計算上個月的日期範圍
  const getLastMonthDateRange = () => {
    const now = new Date();
    let targetMonth = now.getMonth(); // 當前月份 (0-11)
    let targetYear = now.getFullYear();
    
    // 計算上個月
    if (targetMonth === 0) {
      targetMonth = 12;
      targetYear = targetYear - 1;
    }
    
    const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
    const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${new Date(targetYear, targetMonth, 0).getDate()}`;
    
    return { startDate, endDate, targetYear, targetMonth };
  };

  // 獲取上個月顯示文字
  const getLastMonthDisplay = useMemo(() => {
    const { targetYear, targetMonth } = getLastMonthDateRange();
    return `${targetYear}年${targetMonth}月`;
  }, []);

  // 獲取選中員工的出勤數據
  const fetchSelectedEmployeeAttendance = async () => {
    if (!companyId || !employeeId) {
      setError('員工資訊不完整，無法查詢出勤記錄');
      return;
    }

    setLoading(true);
    setError(null);
    setNoRecords(false);

    try {
      const { startDate, endDate, targetYear, targetMonth } = getLastMonthDateRange();
      
      console.log(`查詢員工 ${employeeId} 從 ${startDate} 到 ${endDate} 的出勤記錄`);
      
      // 🔥 使用從員工資料獲取的 company_id
      const result = await fetchAttendanceRecords(
        companyId,
        employeeId,
        startDate,
        endDate,
        '不限'
      );
      
      if (result.success) {
        console.log('成功獲取出勤記錄:', result.data);
        
        // 處理出勤數據
        const processedData = await processAttendanceDataWithWeekends(result.data, targetYear, targetMonth);
        
        setAttendanceData(processedData);
        setFilteredAttendanceData(processedData);
        
        if (processedData.length === 0) {
          setNoRecords(true);
        }
      } else {
        console.error('獲取出勤記錄失敗:', result.message);
        setNoRecords(true);
        setAttendanceData([]);
        setFilteredAttendanceData([]);
      }
    } catch (err) {
      console.error('獲取出勤數據失敗:', err);
      setError(`資料讀取失敗: ${err.message}`);
      setAttendanceData([]);
      setFilteredAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // 處理出勤數據（參考 AttendancePage 的邏輯）
  const processAttendanceDataWithWeekends = async (data, targetYear, targetMonth) => {
    try {
      console.log('處理出勤記錄（包含六日）...', data);
      
      const groupedRecords = {};
      const datesWithRecords = new Set();
      
      if (data && data.records && Array.isArray(data.records) && data.records.length > 0) {
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
        
        // 處理每個日期的記錄
        for (const dateKey in recordsByDate) {
          datesWithRecords.add(dateKey);
          
          const dateParts = dateKey.split(/[/-]/);
          if (dateParts.length !== 3) continue;
          
          const month = parseInt(dateParts[1], 10);
          const day = parseInt(dateParts[2], 10);
          const formattedDate = `${day}`;
          
          const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
          const dayOfWeek = getDayOfWeek(dateObj);
          
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

          // 處理上班和下班記錄
          let latestCheckIn = null;
          let latestCheckOut = null;
          
          for (const eventId in recordsByDate[dateKey]) {
            const records = recordsByDate[dateKey][eventId];
            
            const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
            const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
            
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
          
          // 更新上班記錄
          if (latestCheckIn) {
            groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
            groupedRecords[dateKey].checkInResult = latestCheckIn.result;
            
            const isLeaveResult = [
              'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
              'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
              'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
              'study_leave', 'birthday_leave', 'leave'
            ].includes(latestCheckIn.result);
            
            if (isLeaveResult) {
              groupedRecords[dateKey].checkInResultText = '請假';
              groupedRecords[dateKey].checkInAbnormal = false;
            } else if (latestCheckIn.result === 'late') {
              groupedRecords[dateKey].checkInResultText = '遲到';
              groupedRecords[dateKey].checkInAbnormal = true;
            } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
              groupedRecords[dateKey].checkInResultText = '準時';
              groupedRecords[dateKey].checkInAbnormal = false;
            } else {
              groupedRecords[dateKey].checkInResultText = '準時';
              groupedRecords[dateKey].checkInAbnormal = false;
            }
          }
          
          // 更新下班記錄
          if (latestCheckOut) {
            groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
            groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
            
            const isLeaveResult = [
              'annual_leave', 'sick_leave', 'personal_leave', 'official_leave', 
              'menstrual_leave', 'compensatory_leave', 'makeup_leave', 'marriage_leave', 
              'prenatal_checkup_leave', 'maternity_leave', 'paternity_leave', 
              'study_leave', 'birthday_leave', 'leave'
            ].includes(latestCheckOut.result);
            
            if (isLeaveResult) {
              groupedRecords[dateKey].checkOutResultText = '請假';
              groupedRecords[dateKey].checkOutAbnormal = false;
            } else if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
              groupedRecords[dateKey].checkOutResultText = '早退';
              groupedRecords[dateKey].checkOutAbnormal = true;
            } else if (latestCheckOut.result === 'stay_late' || latestCheckOut.result === 'stay') {
              groupedRecords[dateKey].checkOutResultText = '滯留';
              groupedRecords[dateKey].checkOutAbnormal = true;
            } else if (latestCheckOut.result === 'on_time') {
              groupedRecords[dateKey].checkOutResultText = '準時';
              groupedRecords[dateKey].checkOutAbnormal = false;
            } else {
              groupedRecords[dateKey].checkOutResultText = '準時';
              groupedRecords[dateKey].checkOutAbnormal = false;
            }
          }
        }
      }
      
      // 添加所有日期（包含週末）
      await addAllDaysWithConditionalAbsent(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
      // 轉換為陣列並按日期排序
      const formattedData = Object.values(groupedRecords)
        .map(item => {
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
          const dateA = new Date(a.fullDate);
          const dateB = new Date(b.fullDate);
          return dateA - dateB; 
        });
      
      console.log('格式化後的數據:', formattedData);
      return formattedData;
    } catch (err) {
      console.error('處理出勤記錄時出錯:', err);
      throw err;
    }
  };

  // 添加所有日期記錄
  const addAllDaysWithConditionalAbsent = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      if (datesWithRecords.has(dateStr)) {
        continue;
      }
      
      const dateObj = new Date(targetYear, targetMonth - 1, day);
      const dayOfWeek = dateObj.getDay();
      const dayOfWeekText = getDayOfWeek(dateObj);
      
      const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const shouldMarkAsAbsent = isWorkday; // 上個月的平日都標記為曠職（如果沒有記錄）
      
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
        isAbsent: shouldMarkAsAbsent,
        checkInAbnormal: shouldMarkAsAbsent,
        checkOutAbnormal: shouldMarkAsAbsent,
        checkInResultText: shouldMarkAsAbsent ? '曠職' : '',
        checkOutResultText: shouldMarkAsAbsent ? '曠職' : ''
      };
    }
  };

  // 獲取日曆數據
  const getCalendarData = () => {
    const { targetYear, targetMonth } = getLastMonthDateRange();

    const firstDay = new Date(targetYear, targetMonth - 1, 1);
    const lastDay = new Date(targetYear, targetMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];
    
    // 填充上個月的日期
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(targetYear, targetMonth - 1, -i);
      calendarDays.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        fullDate: prevDate,
        attendance: null
      });
    }

    // 填充當月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(targetYear, targetMonth - 1, day);
      const dateString = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const attendanceRecord = filteredAttendanceData.find(record => record.fullDate === dateString);
      
      calendarDays.push({
        date: day,
        isCurrentMonth: true,
        fullDate: date,
        attendance: attendanceRecord
      });
    }

    // 填充下個月的日期
    const remainingDays = 42 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(targetYear, targetMonth, day);
      calendarDays.push({
        date: day,
        isCurrentMonth: false,
        fullDate: nextDate,
        attendance: null
      });
    }

    return calendarDays;
  };

  // 獲取出勤狀態樣式
  const getAttendanceStyle = (attendance) => {
    if (!attendance) return '';
    
    const hasCheckInAbnormal = attendance.checkInAbnormal;
    const hasCheckOutAbnormal = attendance.checkOutAbnormal;
    
    if (attendance.isAbsent) {
      return 'attendance-absent'; // 曠職
    }
    
    if (attendance.checkInResultText === '請假' || attendance.checkOutResultText === '請假') {
      return 'attendance-dayoff'; // 請假
    }
    
    if (hasCheckInAbnormal && hasCheckOutAbnormal) {
      return 'attendance-mixed'; // 上下班都異常
    } else if (hasCheckInAbnormal || hasCheckOutAbnormal) {
      return 'attendance-late'; // 部分異常
    } else if (attendance.checkIn !== '--:--' || attendance.checkOut !== '--:--') {
      return 'attendance-normal'; // 正常
    }
    
    return '';
  };

  // 🔥 獲取星期幾
  const getWeekday = (dateString) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const date = new Date(dateString);
    return weekdays[date.getDay()];
  };

  // 🔥 格式化時間
  const formatTime = (timeString) => {
    if (!timeString || timeString === '--:--') return '無記錄';
    
    if (timeString.length === 8 && timeString.indexOf(':') !== -1) {
      return timeString.substring(0, 5);
    }
    
    return timeString;
  };

  // 🔥 計算工時函數（扣除午休時間，格式為 00時00分）
  const calculateWorkingHours = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime || checkInTime === '無記錄' || checkOutTime === '無記錄' || checkInTime === '--:--' || checkOutTime === '--:--') {
      return '-';
    }
    
    try {
      const checkIn = new Date(`2000-01-01T${checkInTime}`);
      let checkOut = new Date(`2000-01-01T${checkOutTime}`);
      
      // 如果下班時間早於上班時間，表示跨日
      if (checkOut < checkIn) {
        checkOut.setDate(checkOut.getDate() + 1);
      }
      
      let diffMs = checkOut - checkIn;
      
      // 處理午休時間扣除 (12:00-13:00)
      const lunchStart = new Date(`2000-01-01T12:00:00`);
      const lunchEnd = new Date(`2000-01-01T13:00:00`);
      
      // 檢查是否需要扣除午休時間
      if (checkIn < lunchEnd && checkOut > lunchStart) {
        // 計算實際的午休重疊時間
        const actualLunchStart = checkIn > lunchStart ? checkIn : lunchStart;
        const actualLunchEnd = checkOut < lunchEnd ? checkOut : lunchEnd;
        
        // 如果有重疊，扣除重疊的時間
        if (actualLunchStart < actualLunchEnd) {
          const lunchOverlapMs = actualLunchEnd - actualLunchStart;
          diffMs -= lunchOverlapMs;
        }
      }
      
      // 特殊處理：如果上班時間在12:15，從13:00開始計算
      if (checkInTime >= '12:15' && checkInTime < '13:00') {
        const adjustedCheckIn = new Date(`2000-01-01T13:00:00`);
        diffMs = checkOut - adjustedCheckIn;
      }
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours < 0 || diffHours > 24) {
        return '-';
      }
      
      return `${diffHours.toString().padStart(2, '0')}時${diffMinutes.toString().padStart(2, '0')}分`;
    } catch (error) {
      return '-';
    }
  };

  // 🔥 判斷假別函數
  const getHolidayType = (weekday, record) => {
    if (record.holiday_type === '國定') {
      return '國定假日';
    } else if (weekday === '六') {
      return '休息日';
    } else if (weekday === '日') {
      return '例假日';
    } else {
      return '';
    }
  };

  // 🔥 格式化上下班時間顯示（時間|狀態）
  const formatTimeWithStatus = (timeString, statusString) => {
    const time = formatTime(timeString);
    if (time === '無記錄') {
      return '無記錄';
    }
    
    if (statusString && statusString !== '準時') {
      return `${time}|${statusString}`;
    }
    
    return time;
  };

  // 🔥 獲取合併備註
  const getCombinedRemarks = (record) => {
    if (record.checkInResultText === '曠職' || record.checkOutResultText === '曠職') {
      return '曠職';
    }
    
    const remarks = [];
    if (record.checkInResultText && record.checkInResultText !== '準時' && record.checkInResultText !== '曠職') {
      remarks.push(`上班${record.checkInResultText}`);
    }
    if (record.checkOutResultText && record.checkOutResultText !== '準時' && record.checkOutResultText !== '曠職') {
      remarks.push(`下班${record.checkOutResultText}`);
    }
    
    return remarks.length > 0 ? remarks.join('、') : '-';
  };

  // 🔥 實際的 Excel 匯出功能 - 參考 TunQueryResults 格式
  const handleExportExcel = async () => {
    if (!employee) {
      alert('員工資訊不完整');
      return;
    }

    if (filteredAttendanceData.length === 0) {
      alert('沒有出勤資料可以匯出');
      return;
    }

    setExporting(true);
    
    try {
      console.log('開始匯出 Excel - 員工:', employee.name);
      
      // 🔥 準備匯出資料 - 按照 TunQueryResults 格式
      const exportData = filteredAttendanceData.map(record => {
        const weekday = getWeekday(record.fullDate);
        const isHoliday = record.holiday_type === '國定';
        const isWeekend = weekday === '六' || weekday === '日';
        const isAbsent = record.checkInResultText === '曠職' || record.checkOutResultText === '曠職';
        
        // 格式化上班時間和狀態
        let checkInDisplay = '';
        if (isHoliday) {
          checkInDisplay = '國定';
        } else if (isAbsent) {
          checkInDisplay = '曠職';
        } else {
          checkInDisplay = formatTimeWithStatus(record.checkIn, record.checkInResultText);
        }
        
        // 格式化下班時間和狀態
        let checkOutDisplay = '';
        if (isHoliday || isAbsent) {
          checkOutDisplay = '';
        } else {
          checkOutDisplay = formatTimeWithStatus(record.checkOut, record.checkOutResultText);
        }

        // 計算工時
        const workingHours = (isHoliday || isAbsent) ? '-' : calculateWorkingHours(record.checkIn, record.checkOut);

        // 獲取假別
        const holidayType = getHolidayType(weekday, record);

        // 獲取備註
        const combinedRemarks = getCombinedRemarks(record);

        return {
          '日期': record.fullDate,
          '星期': weekday,
          '假別': holidayType,
          '上班時間': checkInDisplay,
          '下班時間': checkOutDisplay,
          '工時': workingHours,
          '備註/申請狀態': combinedRemarks
        };
      });

      // 🔥 建立工作簿
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // 🔥 設定欄位寬度
      ws['!cols'] = [
        { width: 12 }, // 日期
        { width: 8 },  // 星期
        { width: 12 }, // 假別
        { width: 15 }, // 上班時間
        { width: 15 }, // 下班時間
        { width: 12 }, // 工時
        { width: 20 }  // 備註/申請狀態
      ];

      XLSX.utils.book_append_sheet(wb, ws, '出勤記錄');

      // 🔥 生成檔案名稱
      const fileName = `${employee.name} 打卡紀錄表.xlsx`;
      
      // 🔥 匯出檔案
      XLSX.writeFile(wb, fileName);

      console.log(`✅ Excel 檔案已成功匯出: ${fileName}`);
      alert(`Excel 檔案已匯出完成！\n檔案名稱：${fileName}`);
      
    } catch (error) {
      console.error('❌ Excel 匯出失敗:', error);
      alert('Excel 匯出失敗，請稍後再試');
    } finally {
      setExporting(false);
    }
  };

  // 🔥 實際的 PDF 匯出功能 - 使用 html2pdf 並參考 TunQueryResults 格式
  const handleExportPDF = async () => {
    if (!employee) {
      alert('員工資訊不完整');
      return;
    }

    if (filteredAttendanceData.length === 0) {
      alert('沒有出勤資料可以匯出');
      return;
    }

    setExporting(true);
    
    try {
      console.log('開始匯出 PDF - 員工:', employee.name);
      
      // 🔥 查詢公司名稱
      let companyName = '';
      try {
        const response = await fetch(`https://rabbit.54ucl.com:3004/api/employee?company_id=${companyId}&employee_id=${employeeId}`);
        const data = await response.json();
        if (data.Status === 'Ok' && data.Data && data.Data.company_name) {
          companyName = data.Data.company_name;
        } else {
          companyName = `公司ID: ${companyId}`;
        }
      } catch (err) {
        console.error('查詢公司名稱失敗:', err);
        companyName = `公司ID: ${companyId}`;
      }

      const filename = `${employee.name} 打卡紀錄表.pdf`;

      // 🔥 建立匯出內容 - 參考 TunQueryResults 格式
      const exportContent = document.createElement('div');
      exportContent.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 10px; color: #333; font-size: 24px;">${companyName}</h2>
        <h3 style="text-align: center; margin-bottom: 5px; color: #666; font-size: 18px;">工號: ${employeeId}</h3>
        <h4 style="text-align: center; margin-bottom: 20px; color: #666; font-size: 16px;">姓名: ${employee.name} - ${employee.department || ''}</h4>
        <div style="margin-bottom: 20px;">
          <p><strong>查詢期間:</strong> ${getLastMonthDateRange().startDate} 至 ${getLastMonthDateRange().endDate}</p>
        </div>
      `;

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginBottom = '20px';

      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">日期</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">星期</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">假別</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">上班時間</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">下班時間</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">工時</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">備註/申請狀態</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      filteredAttendanceData.forEach((record) => {
        const tr = document.createElement('tr');
        
        const weekday = getWeekday(record.fullDate);
        const isHoliday = record.holiday_type === '國定';
        const isWeekend = weekday === '六' || weekday === '日';
        const isAbsent = record.checkInResultText === '曠職' || record.checkOutResultText === '曠職';
        
        // 格式化上班時間和狀態
        let checkInDisplay = '';
        if (isHoliday) {
          checkInDisplay = '國定';
        } else if (isAbsent) {
          checkInDisplay = '曠職';
        } else {
          checkInDisplay = formatTimeWithStatus(record.checkIn, record.checkInResultText);
        }
        
        // 格式化下班時間和狀態
        let checkOutDisplay = '';
        if (isHoliday || isAbsent) {
          checkOutDisplay = '';
        } else {
          checkOutDisplay = formatTimeWithStatus(record.checkOut, record.checkOutResultText);
        }

        // 計算工時
        const workingHours = (isHoliday || isAbsent) ? '-' : calculateWorkingHours(record.checkIn, record.checkOut);

        // 獲取假別
        const holidayType = getHolidayType(weekday, record);

        // 獲取備註
        const combinedRemarks = getCombinedRemarks(record);
        
        tr.innerHTML = `
          <td style="border: 1px solid #ddd; padding: 8px;">${record.fullDate}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${weekday}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: ${holidayType ? '#f44336' : '#666'};">${holidayType}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${checkInDisplay}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${checkOutDisplay}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #2196f3;">${workingHours}</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: ${isAbsent ? '#f44336' : '#666'};">${combinedRemarks}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      exportContent.appendChild(table);

      const footer = document.createElement('div');
      footer.innerHTML = `
        <p style="text-align: right; font-size: 12px;">匯出時間: ${new Date().toLocaleString()}</p>
      `;
      exportContent.appendChild(footer);

      const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(exportContent).set(opt).save().then(() => {
        console.log(`✅ PDF 檔案已成功匯出: ${filename}`);
        alert(`PDF 檔案已匯出完成！\n檔案名稱：${filename}`);
        setExporting(false);
      }).catch(err => {
        console.error('PDF匯出錯誤:', err);
        alert('PDF 匯出失敗: ' + err.message);
        setExporting(false);
      });

    } catch (err) {
      console.error('匯出PDF時發生錯誤:', err);
      alert('匯出PDF失敗: ' + err.message);
      setExporting(false);
    }
  };

  // 渲染日曆日期
  const renderCalendarDay = (dayData, index) => {
    const { date, isCurrentMonth, attendance } = dayData;
    const attendanceClass = attendance ? getAttendanceStyle(attendance) : '';
    const otherMonthClass = !isCurrentMonth ? 'other-month' : '';
    
    return (
      <div key={index} className="calendar-date-element">
        <div className={`date-circle ${attendanceClass} ${otherMonthClass}`}>
          <span className="date-number">{date}</span>
        </div>
      </div>
    );
  };

  // 渲染出勤詳情表格
  const renderAttendanceTable = () => {
    if (loading) {
      return <div className="attendance-loading-text">載入中...</div>;
    }

    if (error) {
      return (
        <div>
          <div className="attendance-error-text">{error}</div>
          <button className="attendance-retry-button" onClick={() => fetchSelectedEmployeeAttendance()}>
            重試
          </button>
        </div>
      );
    }

    if (!employee) {
      return <div className="no-records-message">員工資訊不完整</div>;
    }

    if (noRecords || filteredAttendanceData.length === 0) {
      return <div className="no-records-message">該員工上月無出勤記錄</div>;
    }

    return (
      <table className="attendance-table">
        <thead>
          <tr>
            <th className="attendance-date-column">日期</th>
            <th className="attendance-time-column">上班時間</th>
            <th className="attendance-time-column">下班時間</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendanceData.map((record, index) => {
            const day = parseInt(record.date);
            
            return (
              <tr key={index} className="attendance-table-row">
                <td className="attendance-date-cell">
                  <div className="attendance-date-block">
                    <div className="attendance-date-number">{day}</div>
                    <div className="attendance-day-of-week">{record.day}</div>
                  </div>
                </td>
                <td className="attendance-time-cell">
                  <div>
                    {record.checkInResultText && record.checkInResultText !== '準時' && (
                      <span className={`attendance-status-tag ${record.checkInAbnormal ? 'abnormal' : 'normal'}`}>
                        {record.checkInResultText}
                      </span>
                    )}
                    {record.checkIn}
                    {record.checkInAbnormal && record.checkInResultText !== '請假' && (
                      <span className="attendance-abnormal-label">異常</span>
                    )}
                  </div>
                </td>
                <td className="attendance-time-cell">
                  <div>
                    {record.checkOutResultText && record.checkOutResultText !== '準時' && (
                      <span className={`attendance-status-tag ${record.checkOutAbnormal ? 'abnormal' : 'normal'}`}>
                        {record.checkOutResultText}
                      </span>
                    )}
                    {record.checkOut}
                    {record.checkOutAbnormal && record.checkOutResultText !== '請假' && (
                      <span className="attendance-abnormal-label">異常</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // 渲染圖例
  const renderLegend = () => {
    const legendItems = [
      { color: '#3AA672', text: '正常' },
      { color: '#ED1313', text: '遲到/早退' },
      { color: '#3A6CA6', text: '請假' },
      { color: '#FF6B6B', text: '曠職' },
      { color: 'linear-gradient(180deg, #ED1313 0%, #3AA672 100%)', text: '異常混合' }
    ];

    return (
      <div className="legend-container">
        {legendItems.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ background: item.color }}
            ></div>
            <span className="legend-text">{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // 🔥 如果沒有員工資料，顯示錯誤訊息
  if (!employee) {
    return (
      <div className="attendance-status-container">
        <div className="attendance-main-frame">
          <div className="attendance-error-text">
            員工資訊不完整，無法查詢出勤記錄
          </div>
          {onClose && (
            <button className="attendance-retry-button" onClick={onClose}>
              返回
            </button>
          )}
        </div>
      </div>
    );
  }

  const calendarData = getCalendarData();
  const weeks = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  return (
    <div className="attendance-status-container">
      <div className="attendance-main-frame">
        {/* 🔥 員工資訊顯示區域 */}
        <div className="employee-info-section">
          <div className="employee-info-header">
            <h3>員工出勤狀況 - {employee.name} ({employee.employee_id})</h3>
            {onClose && (
              <button className="close-button" onClick={onClose}>
                ✕ 關閉
              </button>
            )}
          </div>
        </div>

        <div className="attendance-layout">
          {/* 左側日曆區域 */}
          <div className="calendar-section">
            <div className="calendar-container">
              {/* 月份標題 */}
              <div className="month-header">
                <div className="month-display">
                  <span className="month-title">{getLastMonthDisplay}</span>
                </div>
              </div>

              {/* 星期標題 */}
              <div className="weekday-header">
                {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                  <div key={index} className="weekday-cell">
                    <span>{day}</span>
                  </div>
                ))}
              </div>

              {/* 日曆網格 */}
              <div className="calendar-grid">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="calendar-week">
                    {week.map((day, dayIndex) => renderCalendarDay(day, `${weekIndex}-${dayIndex}`))}
                  </div>
                ))}
              </div>

              {/* 圖例 */}
              {renderLegend()}
            </div>
          </div>

          {/* 右側出勤詳情區域 */}
          <div className="attendance-details-section">
            <div className="attendance-month-display">
              {employee.name} - {getLastMonthDisplay} 出勤記錄
            </div>
            
            <div className="attendance-table-container">
              {renderAttendanceTable()}
            </div>
          </div>
        </div>

        {/* 🔥 底部匯出按鈕區域 - 加入載入狀態 */}
        <div className="bottom-export-buttons-container">
          <button 
            className="bottom-export-button excel-button" 
            onClick={handleExportExcel}
            disabled={loading || !employee || exporting || filteredAttendanceData.length === 0}
          >
            {exporting ? '匯出中...' : '匯出 Excel'}
          </button>
          <button 
            className="bottom-export-button pdf-button" 
            onClick={handleExportPDF}
            disabled={loading || !employee || exporting || filteredAttendanceData.length === 0}
          >
            {exporting ? '匯出中...' : '匯出 PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance_Status;
