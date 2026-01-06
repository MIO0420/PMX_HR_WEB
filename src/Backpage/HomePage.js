
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import Sidebar from './Sidebar'; // 引入您的 Sidebar 組件
// import PortraitImage from './ICON/Portrait.png'; // 引入頭像圖片

// const HomePage = () => {
//   const [currentDateTime, setCurrentDateTime] = useState(new Date());
//   const [attendanceData, setAttendanceData] = useState({
//     onTime: [],
//     late: [],
//     absent: [],
//     leave: [],
//     vacation: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [companyId, setCompanyId] = useState('');
//   const [allEmployees, setAllEmployees] = useState([]); // 存儲所有員工資料
  
//   // 新增：請假統計狀態
//   const [todayLeaveCount, setTodayLeaveCount] = useState(0);
//   const [todayLeaveApps, setTodayLeaveApps] = useState([]);
//   const [leaveStatistics, setLeaveStatistics] = useState({});
  
//   const navigate = useNavigate();

//   // 更新當前時間
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // 從 cookies 獲取公司ID
//   useEffect(() => {
//     const storedCompanyId = Cookies.get('company_id') || '76014406';
//     setCompanyId(storedCompanyId);
//   }, []);

//   // 獲取所有員工資料
//   const fetchAllEmployees = async (companyId) => {
//     try {
//       const response = await axios.post('https://rabbit.54ucl.com:3004/api/employees', {
//         company_id: companyId
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       if (response.data.Status === 'Ok') {
//         setAllEmployees(response.data.Data || []);
//         return response.data.Data || [];
//       } else {
//         console.error('獲取員工資料失敗:', response.data.Msg);
//         return [];
//       }
//     } catch (err) {
//       console.error('獲取員工資料失敗:', err);
//       return [];
//     }
//   };

// // 修改：獲取今日請假統計
// const fetchTodayLeaveStatistics = async (companyId) => {
//   try {
//     const today = new Date().toISOString().split('T')[0];
    
//     const apiUrl = `https://rabbit.54ucl.com:3004/api/applications/filter?company_id=${companyId}&category=leave`;
    
//     const response = await fetch(apiUrl, {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error(`API請求失敗: ${response.status}`);
//     }
    
//     const result = await response.json();
    
//     if (result.Status === "Ok" && result.Data) {
//       // 過濾出今天開始請假的申請
//       const todayApplications = result.Data.filter(item => {
//         const startDate = item.primary_date || item.start_date;
//         return startDate === today;
//       });
      
//       setTodayLeaveCount(todayApplications.length);
//       setTodayLeaveApps(todayApplications);
      
//       // 獲取所有員工資料以查找正確的姓名
//       const allEmployeesData = await fetchAllEmployees(companyId);
//       const employeeMap = {};
//       allEmployeesData.forEach(emp => {
//         employeeMap[emp.employee_id] = emp;
//       });
      
//       // 將請假的員工加入到 leave 分類中，使用正確的員工姓名
//       const leaveEmployees = todayApplications.map(app => {
//         const employeeData = employeeMap[app.employee_id];
//         return {
//           id: app.employee_id,
//           name: employeeData ? employeeData.name : (app.employee_name || app.name || `員工${app.employee_id}`),
//           position: employeeData ? (employeeData.position || (employeeData.job_grade === 'hr' ? '主管' : employeeData.job_grade === 'staff' ? '員工' : '未設定')) : (app.position || '未設定'),
//           department: employeeData ? (employeeData.department || '未設定') : (app.department || '未設定'),
//           leaveType: getLeaveTypeName(app.type),
//           startDate: app.primary_date || app.start_date,
//           endDate: app.end_date,
//           totalHours: app.total_hours || 0
//         };
//       });
      
//       return leaveEmployees;
//     }
    
//     return [];
    
//   } catch (error) {
//     console.error("查詢今日請假統計失敗:", error);
//     return [];
//   }
// };


//   // 新增：假期類型中英文對照
//   const getLeaveTypeName = (englishType) => {
//     const leaveTypeMap = {
//       'compensatory_leave': '換休',
//       'annual_leave': '特休',
//       'personal_leave': '事假',
//       'sick_leave': '病假',
//       'menstrual_leave': '生理假',
//       'makeup_leave': '補休',
//       'official_leave': '公假',
//       'marriage_leave': '婚假',
//       'prenatal_checkup_leave': '產檢假',
//       'maternity_leave': '產假',
//       'paternity_leave': '陪產假',
//       'study_leave': '溫書假',
//       'birthday_leave': '生日假'
//     };
    
//     return leaveTypeMap[englishType] || englishType || '未分類';
//   };

//   // 修改：獲取今日出勤資料（包含請假統計）
//   const fetchTodayAttendance = async () => {
//     if (!companyId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       console.log(`獲取公司 ${companyId} 今日出勤資料`);

//       // 同時獲取出勤記錄、所有員工資料和請假統計
//       const [attendanceResponse, employeesData, leaveEmployees] = await Promise.all([
//         fetch(`https://rabbit.54ucl.com:3004/api/company/${companyId}/today-attendance`),
//         fetchAllEmployees(companyId),
//         fetchTodayLeaveStatistics(companyId)
//       ]);

//       if (!attendanceResponse.ok) {
//         throw new Error(`API請求失敗: ${attendanceResponse.status}`);
//       }

//       const attendanceResult = await attendanceResponse.json();
//       console.log('出勤API回應:', attendanceResult);
      
//       if (attendanceResult.Status === "Ok") {
//         processAttendanceData(attendanceResult.Data, employeesData, leaveEmployees);
//       } else {
//         throw new Error(attendanceResult.Msg || '獲取出勤資料失敗');
//       }
//     } catch (err) {
//       console.error('獲取出勤資料失敗:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 修改：處理出勤資料（包含請假資料）
//   const processAttendanceData = (attendanceData, employeesData, leaveEmployees) => {
//     console.log('處理出勤資料:', { attendanceData, employeesData, leaveEmployees });
    
//     const categorizedData = {
//       onTime: [],
//       late: [],
//       absent: [],
//       leave: leaveEmployees || [], // 直接使用請假員工資料
//       vacation: []
//     };

//     // 建立員工ID到員工資訊的映射
//     const employeeMap = {};
//     employeesData.forEach(emp => {
//       employeeMap[emp.employee_id] = {
//         id: emp.employee_id,
//         name: emp.name,
//         position: emp.position || (emp.job_grade === 'hr' ? '主管' : emp.job_grade === 'staff' ? '員工' : '未設定'),
//         department: emp.department || '未設定'
//       };
//     });

//     // 建立請假員工ID集合
//     const leaveEmployeeIds = new Set(leaveEmployees.map(emp => parseInt(emp.id)));

//     // 處理有出勤記錄的員工
//     const attendedEmployeeIds = new Set();
    
//     if (attendanceData.records && attendanceData.records.length > 0) {
//       // 按員工分組出勤記錄
//       const employeeRecords = {};
//       attendanceData.records.forEach(record => {
//         if (!employeeRecords[record.employee_id]) {
//           employeeRecords[record.employee_id] = [];
//         }
//         employeeRecords[record.employee_id].push(record);
//       });

//       // 處理每個有記錄的員工
//       Object.entries(employeeRecords).forEach(([employeeId, records]) => {
//         const empId = parseInt(employeeId);
//         attendedEmployeeIds.add(empId);
        
//         // 如果員工今天請假，不處理出勤記錄
//         if (leaveEmployeeIds.has(empId)) {
//           return;
//         }
        
//         const employee = employeeMap[empId];
//         if (!employee) return; // 如果找不到員工資訊，跳過

//         // 找到最早的上班記錄和最晚的下班記錄
//         const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
//         const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
        
//         const earliestCheckIn = checkInRecords.length > 0 ? 
//           checkInRecords.reduce((earliest, current) => 
//             current.work_time < earliest.work_time ? current : earliest
//           ) : null;

//         const latestCheckOut = checkOutRecords.length > 0 ? 
//           checkOutRecords.reduce((latest, current) => 
//             current.get_off_work_time > latest.get_off_work_time ? current : latest
//           ) : null;

//         const employeeInfo = {
//           ...employee,
//           checkInTime: earliestCheckIn ? earliestCheckIn.work_time : null,
//           checkOutTime: latestCheckOut ? latestCheckOut.get_off_work_time : null,
//           result: earliestCheckIn ? earliestCheckIn.result : null,
//           statusDescription: earliestCheckIn ? earliestCheckIn.status_description : null
//         };

//         // 根據結果分類
//         if (earliestCheckIn) {
//           switch (earliestCheckIn.result) {
//             case 'late':
//               categorizedData.late.push(employeeInfo);
//               break;
//             case 'early_leave':
//               categorizedData.onTime.push({...employeeInfo, isEarlyLeave: true});
//               break;
//             case 'normal':
//             case 'on_time':
//               categorizedData.onTime.push(employeeInfo);
//               break;
//             case 'overtime':
//               categorizedData.onTime.push({...employeeInfo, isOvertime: true});
//               break;
//             default:
//               // 根據時間判斷
//               if (earliestCheckIn.work_time) {
//                 const timeStr = earliestCheckIn.work_time.toString();
//                 const hour = parseInt(timeStr.split(':')[0]);
                
//                 if (hour >= 9) { // 9點後算遲到
//                   categorizedData.late.push(employeeInfo);
//                 } else {
//                   categorizedData.onTime.push(employeeInfo);
//                 }
//               } else {
//                 categorizedData.onTime.push(employeeInfo);
//               }
//               break;
//           }
//         }
//       });
//     }

//     // 處理沒有打卡記錄且沒有請假的員工（曠職）
//     employeesData.forEach(emp => {
//       if (!attendedEmployeeIds.has(emp.employee_id) && !leaveEmployeeIds.has(emp.employee_id)) {
//         categorizedData.absent.push({
//           id: emp.employee_id,
//           name: emp.name,
//           position: emp.position || (emp.job_grade === 'hr' ? '主管' : emp.job_grade === 'staff' ? '員工' : '未設定'),
//           department: emp.department || '未設定',
//           checkInTime: null,
//           checkOutTime: null,
//           result: 'absent'
//         });
//       }
//     });

//     console.log('分類後的出勤資料:', categorizedData);
//     setAttendanceData(categorizedData);
//   };

//   // 當公司ID變更時重新獲取資料
//   useEffect(() => {
//     if (companyId) {
//       fetchTodayAttendance();
//     }
//   }, [companyId]);

//   // 格式化日期 - 移除上下午標記
//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
//     const weekday = weekdays[date.getDay()];
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');

//     return `${year}-${month}-${day}(${weekday}) ${hours}:${minutes}`;
//   };

//   // 修改：員工卡片元件 - 使用與 Human 頁面完全相同的樣式，移除額外資訊
//   const EmployeeCard = ({ employee }) => (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: '12px 16px',
//         gap: '12px',
//         width: '380px',
//         minWidth: '380px',
//         height: '70px',
//         background: '#FFFFFF',
//         border: '1px solid #E9E9E9',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         boxSizing: 'border-box',
//         position: 'relative',
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.background = '#F8F8F8';
//         e.currentTarget.style.borderColor = '#D0D0D0';
//         e.currentTarget.style.transform = 'translateY(-2px)';
//         e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.background = '#FFFFFF';
//         e.currentTarget.style.borderColor = '#E9E9E9';
//         e.currentTarget.style.transform = 'translateY(0px)';
//         e.currentTarget.style.boxShadow = 'none';
//       }}
//     >
//       {/* 頭像 */}
//       <div
//         style={{
//           width: '40px',
//           height: '40px',
//           minWidth: '40px',
//           borderRadius: '50%',
//           overflow: 'hidden',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: '#C4D4E8',
//           flexShrink: 0,
//           border: 'none',
//         }}
//       >
//         {employee.avatar_url ? (
//           <img 
//             src={employee.avatar_url} 
//             alt={employee.name}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               borderRadius: '50%',
//             }}
//             onError={(e) => {
//               e.target.style.display = 'none';
//               e.target.nextSibling.style.display = 'flex';
//             }}
//           />
//         ) : (
//           <img 
//             src={PortraitImage} 
//             alt={`${employee.name}的大頭貼`}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               borderRadius: '50%',
//             }}
//             onError={(e) => {
//               e.target.style.display = 'none';
//               e.target.nextSibling.style.display = 'flex';
//             }}
//           />
//         )}
//         <div 
//           style={{ 
//             display: employee.avatar_url || PortraitImage ? 'none' : 'flex',
//             width: '100%',
//             height: '100%',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: '#FFFFFF',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             backgroundColor: '#C4D4E8',
//           }}
//         >
//           👤
//         </div>
//       </div>
      
//       {/* 主要資訊區域 - 兩行佈局 */}
//       <div
//         style={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           height: '100%',
//           gap: '4px',
//         }}
//       >
//         {/* 第一行：姓名 + 部門 */}
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             height: '24px',
//             gap: '15px',
//           }}
//         >
//           <div
//             style={{
//               fontFamily: 'Microsoft JhengHei',
//               fontStyle: 'normal',
//               fontWeight: '400',
//               fontSize: '18px',
//               lineHeight: '24px',
//               letterSpacing: '0.05em',
//               color: '#1F1F1F',
//               margin: '0',
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               maxWidth: '180px',
//               flexShrink: 1,
//             }}
//           >
//             {employee.name}
//           </div>
//           <div
//             style={{
//               fontFamily: 'Microsoft JhengHei',
//               fontStyle: 'normal',
//               fontWeight: '400',
//               fontSize: '12px',
//               lineHeight: '16px',
//               textAlign: 'right',
//               letterSpacing: '0.05em',
//               color: '#1F1F1F',
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               maxWidth: '120px',
//               flexShrink: 0,
//             }}
//           >
//             {employee.department}
//           </div>
//         </div>
        
//         {/* 第二行：員工編號 + 職位 */}
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             height: '20px',
//             gap: '15px',
//           }}
//         >
//           <div
//             style={{
//               fontFamily: 'Microsoft JhengHei',
//               fontStyle: 'normal',
//               fontWeight: '400',
//               fontSize: '12px',
//               lineHeight: '20px',
//               letterSpacing: '0.05em',
//               color: '#919191',
//               margin: '0',
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               maxWidth: '180px',
//               flexShrink: 1,
//             }}
//           >
//             {employee.id}
//           </div>
          
//           <div
//             style={{
//               fontFamily: 'Microsoft JhengHei',
//               fontStyle: 'normal',
//               fontWeight: '400',
//               fontSize: '12px',
//               lineHeight: '16px',
//               textAlign: 'right',
//               letterSpacing: '0.05em',
//               color: '#1F1F1F',
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               maxWidth: '120px',
//               flexShrink: 0,
//             }}
//           >
//             {employee.position}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // 修改：出勤狀態區塊 - 使用與 Human 頁面相同的標題樣式和藍色線條
//   const AttendanceSection = ({ title, employees, count }) => (
//     <div
//       style={{
//         marginBottom: '24px',
//         backgroundColor: 'transparent',
//         borderRadius: '0',
//         padding: '0',
//       }}
//     >
//       {/* 標題區域 - 與 Human 頁面相同的樣式 */}
//       <div
//         style={{
//           marginBottom: '16px',
//           paddingBottom: '8px',
//           borderBottom: '2px solid #00B1FF', // 藍色線條
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <h3
//           style={{
//             fontFamily: 'Microsoft JhengHei',
//             fontStyle: 'normal',
//             fontWeight: '700',
//             fontSize: '20px', // 與 Human 頁面相同的字體大小
//             lineHeight: '28px',
//             letterSpacing: '0.01em',
//             color: '#000000ff',
//             margin: '0',
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           {title}：{count}人
//         </h3>
//         {/* {title === '準時' && (
//           <button
//             onClick={fetchTodayAttendance}
//             disabled={loading}
//             style={{
//               background: '#1890ff',
//               color: 'white',
//               border: 'none',
//               padding: '4px 8px',
//               borderRadius: '4px',
//               fontSize: '12px',
//               cursor: loading ? 'not-allowed' : 'pointer',
//             }}
//           >
//             {loading ? '載入中...' : '重新整理'}
//           </button>
//         )} */}
//       </div>
      
//       {/* 員工卡片網格 - 與 Human 頁面相同的佈局 */}
//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
//           gap: '18px',
//           marginTop: '20px',
//           marginBottom: '25px',
//           justifyContent: 'start',
//         }}
//       >
//         {employees.length > 0 ? (
//           employees.map((employee, index) => (
//             <EmployeeCard key={`${employee.id}-${index}`} employee={employee} />
//           ))
//         ) : (
//           <div style={{ 
//             color: '#999', 
//             fontStyle: 'normal', 
//             padding: '20px',
//             width: '100%',
//             textAlign: 'center',
//             gridColumn: '1 / -1',
//           }}>
//             {loading ? '載入中...' : '無資料'}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // 處理 Sidebar 項目點擊
//   const handleSidebarItemClick = (item) => {
//     console.log('Sidebar 項目被點擊:', item);
//     return true; // 返回 true 讓 Sidebar 繼續執行預設的導航行為
//   };

//   // 處理登出
//   const handleLogout = () => {
//     console.log('登出');
//     // 清除認證資訊
//     Cookies.remove('company_id');
//     navigate('/');
//   };

//   // 如果發生錯誤，顯示錯誤訊息
//   if (error && !loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         flexDirection: 'column',
//         gap: '20px'
//       }}>
//         <div style={{ color: '#f5222d', fontSize: '18px' }}>載入失敗: {error}</div>
//         <button 
//           onClick={fetchTodayAttendance}
//           style={{
//             background: '#1890ff',
//             color: 'white',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           重試
//         </button>
//       </div>
//     );
//   }

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
//       {/* 使用 Sidebar 組件 */}
//       <Sidebar 
//         currentPage="home" // 設定當前頁面為 home
//         onItemClick={handleSidebarItemClick}
//         onLogout={handleLogout}
//       />

//       {/* 主內容區 - 需要調整左邊距以配合 Sidebar */}
//       <div
//         style={{
//           flexGrow: 1,
//           marginLeft: '250px', // 配合 Sidebar 的寬度
//           padding: '20px',
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           margin: '15px 15px 15px 265px', // 左邊距調整為 265px (250px + 15px)
//           overflowY: 'auto',
//           height: 'calc(100vh - 30px)',
//         }}
//       >
//         {/* 修改：移除統計摘要，只保留標題和時間 */}
//         <div
//           style={{
//             marginBottom: '20px',
//           }}
//         >
//           <h2
//             style={{
//               fontSize: '16px',
//               color: '#666',
//               fontWeight: 'normal',
//               margin: '0 0 10px 0',
//             }}
//           >
//             今日出勤狀況
//           </h2>
//           <div
//             style={{
//               color: '#3A6CA6',
//               fontSize: '24px',
//               fontWeight: 'bold',
//             }}
//           >
//             {formatDate(currentDateTime)}
//           </div>
//         </div>

//         {loading && (
//           <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '200px',
//             color: '#666'
//           }}>
//             載入中...
//           </div>
//         )}

//         {!loading && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             <AttendanceSection title="準時" employees={attendanceData.onTime} count={attendanceData.onTime.length} />
//             <AttendanceSection title="遲到" employees={attendanceData.late} count={attendanceData.late.length} />
//             <AttendanceSection title="曠職" employees={attendanceData.absent} count={attendanceData.absent.length} />
//             <AttendanceSection title="請假" employees={attendanceData.leave} count={attendanceData.leave.length} />
//             <AttendanceSection title="休假" employees={attendanceData.vacation} count={attendanceData.vacation.length} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAuth } from './Hook/useAuth'; // 🔥 引入 useAuth
import Sidebar from './Sidebar';
import PortraitImage from './ICON/Portrait.png';

const HomePage = () => {
  // 🔥 使用 useAuth - 只用於 token 驗證
  const { hasValidAuth, logout } = useAuth();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({
    onTime: [],
    late: [],
    absent: [],
    leave: [],
    vacation: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState('');
  const [allEmployees, setAllEmployees] = useState([]);
  
  // 請假統計狀態
  const [todayLeaveCount, setTodayLeaveCount] = useState(0);
  const [todayLeaveApps, setTodayLeaveApps] = useState([]);
  const [leaveStatistics, setLeaveStatistics] = useState({});
  
  const navigate = useNavigate();

  // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ HomePage Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    console.log('✅ HomePage Token 驗證通過');
  }, [hasValidAuth, logout]);

  // 更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 從 cookies 獲取公司ID
  useEffect(() => {
    const storedCompanyId = Cookies.get('company_id') || '76014406';
    setCompanyId(storedCompanyId);
  }, []);

  // 獲取所有員工資料
  const fetchAllEmployees = async (companyId) => {
    try {
      const response = await axios.post('https://rabbit.54ucl.com:3004/api/employees', {
        company_id: companyId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.Status === 'Ok') {
        setAllEmployees(response.data.Data || []);
        return response.data.Data || [];
      } else {
        console.error('獲取員工資料失敗:', response.data.Msg);
        return [];
      }
    } catch (err) {
      console.error('獲取員工資料失敗:', err);
      return [];
    }
  };

  // 獲取今日請假統計
  const fetchTodayLeaveStatistics = async (companyId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const apiUrl = `https://rabbit.54ucl.com:3004/api/applications/filter?company_id=${companyId}&category=leave`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API請求失敗: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.Status === "Ok" && result.Data) {
        // 過濾出今天開始請假的申請
        const todayApplications = result.Data.filter(item => {
          const startDate = item.primary_date || item.start_date;
          return startDate === today;
        });
        
        setTodayLeaveCount(todayApplications.length);
        setTodayLeaveApps(todayApplications);
        
        // 獲取所有員工資料以查找正確的姓名
        const allEmployeesData = await fetchAllEmployees(companyId);
        const employeeMap = {};
        allEmployeesData.forEach(emp => {
          employeeMap[emp.employee_id] = emp;
        });
        
        // 將請假的員工加入到 leave 分類中，使用正確的員工姓名
        const leaveEmployees = todayApplications.map(app => {
          const employeeData = employeeMap[app.employee_id];
          return {
            id: app.employee_id,
            name: employeeData ? employeeData.name : (app.employee_name || app.name || `員工${app.employee_id}`),
            position: employeeData ? (employeeData.position || (employeeData.job_grade === 'hr' ? '主管' : employeeData.job_grade === 'staff' ? '員工' : '未設定')) : (app.position || '未設定'),
            department: employeeData ? (employeeData.department || '未設定') : (app.department || '未設定'),
            leaveType: getLeaveTypeName(app.type),
            startDate: app.primary_date || app.start_date,
            endDate: app.end_date,
            totalHours: app.total_hours || 0
          };
        });
        
        return leaveEmployees;
      }
      
      return [];
      
    } catch (error) {
      console.error("查詢今日請假統計失敗:", error);
      return [];
    }
  };

  // 假期類型中英文對照
  const getLeaveTypeName = (englishType) => {
    const leaveTypeMap = {
      'compensatory_leave': '換休',
      'annual_leave': '特休',
      'personal_leave': '事假',
      'sick_leave': '病假',
      'menstrual_leave': '生理假',
      'makeup_leave': '補休',
      'official_leave': '公假',
      'marriage_leave': '婚假',
      'prenatal_checkup_leave': '產檢假',
      'maternity_leave': '產假',
      'paternity_leave': '陪產假',
      'study_leave': '溫書假',
      'birthday_leave': '生日假'
    };
    
    return leaveTypeMap[englishType] || englishType || '未分類';
  };

  // 獲取今日出勤資料（包含請假統計）
  const fetchTodayAttendance = async () => {
    if (!companyId) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`獲取公司 ${companyId} 今日出勤資料`);

      // 同時獲取出勤記錄、所有員工資料和請假統計
      const [attendanceResponse, employeesData, leaveEmployees] = await Promise.all([
        fetch(`https://rabbit.54ucl.com:3004/api/company/${companyId}/today-attendance`),
        fetchAllEmployees(companyId),
        fetchTodayLeaveStatistics(companyId)
      ]);

      if (!attendanceResponse.ok) {
        throw new Error(`API請求失敗: ${attendanceResponse.status}`);
      }

      const attendanceResult = await attendanceResponse.json();
      console.log('出勤API回應:', attendanceResult);
      
      if (attendanceResult.Status === "Ok") {
        processAttendanceData(attendanceResult.Data, employeesData, leaveEmployees);
      } else {
        throw new Error(attendanceResult.Msg || '獲取出勤資料失敗');
      }
    } catch (err) {
      console.error('獲取出勤資料失敗:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 處理出勤資料（包含請假資料）
  const processAttendanceData = (attendanceData, employeesData, leaveEmployees) => {
    console.log('處理出勤資料:', { attendanceData, employeesData, leaveEmployees });
    
    const categorizedData = {
      onTime: [],
      late: [],
      absent: [],
      leave: leaveEmployees || [], // 直接使用請假員工資料
      vacation: []
    };

    // 建立員工ID到員工資訊的映射
    const employeeMap = {};
    employeesData.forEach(emp => {
      employeeMap[emp.employee_id] = {
        id: emp.employee_id,
        name: emp.name,
        position: emp.position || (emp.job_grade === 'hr' ? '主管' : emp.job_grade === 'staff' ? '員工' : '未設定'),
        department: emp.department || '未設定'
      };
    });

    // 建立請假員工ID集合
    const leaveEmployeeIds = new Set(leaveEmployees.map(emp => parseInt(emp.id)));

    // 處理有出勤記錄的員工
    const attendedEmployeeIds = new Set();
    
    if (attendanceData.records && attendanceData.records.length > 0) {
      // 按員工分組出勤記錄
      const employeeRecords = {};
      attendanceData.records.forEach(record => {
        if (!employeeRecords[record.employee_id]) {
          employeeRecords[record.employee_id] = [];
        }
        employeeRecords[record.employee_id].push(record);
      });

      // 處理每個有記錄的員工
      Object.entries(employeeRecords).forEach(([employeeId, records]) => {
        const empId = parseInt(employeeId);
        attendedEmployeeIds.add(empId);
        
        // 如果員工今天請假，不處理出勤記錄
        if (leaveEmployeeIds.has(empId)) {
          return;
        }
        
        const employee = employeeMap[empId];
        if (!employee) return; // 如果找不到員工資訊，跳過

        // 找到最早的上班記錄和最晚的下班記錄
        const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
        const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
        
        const earliestCheckIn = checkInRecords.length > 0 ? 
          checkInRecords.reduce((earliest, current) => 
            current.work_time < earliest.work_time ? current : earliest
          ) : null;

        const latestCheckOut = checkOutRecords.length > 0 ? 
          checkOutRecords.reduce((latest, current) => 
            current.get_off_work_time > latest.get_off_work_time ? current : latest
          ) : null;

        const employeeInfo = {
          ...employee,
          checkInTime: earliestCheckIn ? earliestCheckIn.work_time : null,
          checkOutTime: latestCheckOut ? latestCheckOut.get_off_work_time : null,
          result: earliestCheckIn ? earliestCheckIn.result : null,
          statusDescription: earliestCheckIn ? earliestCheckIn.status_description : null
        };

        // 根據結果分類
        if (earliestCheckIn) {
          switch (earliestCheckIn.result) {
            case 'late':
              categorizedData.late.push(employeeInfo);
              break;
            case 'early_leave':
              categorizedData.onTime.push({...employeeInfo, isEarlyLeave: true});
              break;
            case 'normal':
            case 'on_time':
              categorizedData.onTime.push(employeeInfo);
              break;
            case 'overtime':
              categorizedData.onTime.push({...employeeInfo, isOvertime: true});
              break;
            default:
              // 根據時間判斷
              if (earliestCheckIn.work_time) {
                const timeStr = earliestCheckIn.work_time.toString();
                const hour = parseInt(timeStr.split(':')[0]);
                
                if (hour >= 9) { // 9點後算遲到
                  categorizedData.late.push(employeeInfo);
                } else {
                  categorizedData.onTime.push(employeeInfo);
                }
              } else {
                categorizedData.onTime.push(employeeInfo);
              }
              break;
          }
        }
      });
    }

    // 處理沒有打卡記錄且沒有請假的員工（曠職）
    employeesData.forEach(emp => {
      if (!attendedEmployeeIds.has(emp.employee_id) && !leaveEmployeeIds.has(emp.employee_id)) {
        categorizedData.absent.push({
          id: emp.employee_id,
          name: emp.name,
          position: emp.position || (emp.job_grade === 'hr' ? '主管' : emp.job_grade === 'staff' ? '員工' : '未設定'),
          department: emp.department || '未設定',
          checkInTime: null,
          checkOutTime: null,
          result: 'absent'
        });
      }
    });

    console.log('分類後的出勤資料:', categorizedData);
    setAttendanceData(categorizedData);
  };

  // 當公司ID變更時重新獲取資料
  useEffect(() => {
    if (companyId) {
      fetchTodayAttendance();
    }
  }, [companyId]);

  // 格式化日期 - 移除上下午標記
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}(${weekday}) ${hours}:${minutes}`;
  };

  // 員工卡片元件
  const EmployeeCard = ({ employee }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px 16px',
        gap: '12px',
        width: '380px',
        minWidth: '380px',
        height: '70px',
        background: '#FFFFFF',
        border: '1px solid #E9E9E9',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#F8F8F8';
        e.currentTarget.style.borderColor = '#D0D0D0';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#FFFFFF';
        e.currentTarget.style.borderColor = '#E9E9E9';
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 頭像 */}
      <div
        style={{
          width: '40px',
          height: '40px',
          minWidth: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#C4D4E8',
          flexShrink: 0,
          border: 'none',
        }}
      >
        {employee.avatar_url ? (
          <img 
            src={employee.avatar_url} 
            alt={employee.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <img 
            src={PortraitImage} 
            alt={`${employee.name}的大頭貼`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        )}
        <div 
          style={{ 
            display: employee.avatar_url || PortraitImage ? 'none' : 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#C4D4E8',
          }}
        >
          👤
        </div>
      </div>
      
      {/* 主要資訊區域 - 兩行佈局 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          gap: '4px',
        }}
      >
        {/* 第一行：姓名 + 部門 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '24px',
            gap: '15px',
          }}
        >
          <div
            style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '18px',
              lineHeight: '24px',
              letterSpacing: '0.05em',
              color: '#1F1F1F',
              margin: '0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '180px',
              flexShrink: 1,
            }}
          >
            {employee.name}
          </div>
          <div
            style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '16px',
              textAlign: 'right',
              letterSpacing: '0.05em',
              color: '#1F1F1F',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px',
              flexShrink: 0,
            }}
          >
            {employee.department}
          </div>
        </div>
        
        {/* 第二行：員工編號 + 職位 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '20px',
            gap: '15px',
          }}
        >
          <div
            style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '20px',
              letterSpacing: '0.05em',
              color: '#919191',
              margin: '0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '180px',
              flexShrink: 1,
            }}
          >
            {employee.id}
          </div>
          
          <div
            style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '16px',
              textAlign: 'right',
              letterSpacing: '0.05em',
              color: '#1F1F1F',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px',
              flexShrink: 0,
            }}
          >
            {employee.position}
          </div>
        </div>
      </div>
    </div>
  );

  // 出勤狀態區塊
  const AttendanceSection = ({ title, employees, count }) => (
    <div
      style={{
        marginBottom: '24px',
        backgroundColor: 'transparent',
        borderRadius: '0',
        padding: '0',
      }}
    >
      {/* 標題區域 */}
      <div
        style={{
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '2px solid #00B1FF', // 藍色線條
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontFamily: 'Microsoft JhengHei',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '20px',
            lineHeight: '28px',
            letterSpacing: '0.01em',
            color: '#000000ff',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}：{count}人
        </h3>
      </div>
      
      {/* 員工卡片網格 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '18px',
          marginTop: '20px',
          marginBottom: '25px',
          justifyContent: 'start',
        }}
      >
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <EmployeeCard key={`${employee.id}-${index}`} employee={employee} />
          ))
        ) : (
          <div style={{ 
            color: '#999', 
            fontStyle: 'normal', 
            padding: '20px',
            width: '100%',
            textAlign: 'center',
            gridColumn: '1 / -1',
          }}>
            {loading ? '載入中...' : '無資料'}
          </div>
        )}
      </div>
    </div>
  );

  // 處理 Sidebar 項目點擊
  const handleSidebarItemClick = (item) => {
    console.log('Sidebar 項目被點擊:', item);
    return true;
  };

  // 🔥 修改：處理登出 - 使用 useAuth 的 logout
  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) {
      logout(); // 使用 useAuth 的 logout 函數
    }
  };

  // 如果發生錯誤，顯示錯誤訊息
  if (error && !loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: '#f5222d', fontSize: '18px' }}>載入失敗: {error}</div>
        <button 
          onClick={fetchTodayAttendance}
          style={{
            background: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          重試
        </button>
      </div>
    );
  }

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
      {/* 使用 Sidebar 組件 */}
      <Sidebar 
        currentPage="home"
        onItemClick={handleSidebarItemClick}
        onLogout={handleLogout}
      />

      {/* 主內容區 */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: '250px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          margin: '15px 15px 15px 265px',
          overflowY: 'auto',
          height: 'calc(100vh - 30px)',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              color: '#666',
              fontWeight: 'normal',
              margin: '0 0 10px 0',
            }}
          >
            今日出勤狀況
          </h2>
          <div
            style={{
              color: '#3A6CA6',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            {formatDate(currentDateTime)}
          </div>
        </div>

        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            color: '#666'
          }}>
            載入中...
          </div>
        )}

        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AttendanceSection title="準時" employees={attendanceData.onTime} count={attendanceData.onTime.length} />
            <AttendanceSection title="遲到" employees={attendanceData.late} count={attendanceData.late.length} />
            <AttendanceSection title="曠職" employees={attendanceData.absent} count={attendanceData.absent.length} />
            <AttendanceSection title="請假" employees={attendanceData.leave} count={attendanceData.leave.length} />
            <AttendanceSection title="休假" employees={attendanceData.vacation} count={attendanceData.vacation.length} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
