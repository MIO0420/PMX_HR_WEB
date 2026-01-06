// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import Sidebar from '../Sidebar';
// import PortraitImage from '../ICON/Portrait.png'; 
// import './AttendanceStatus.css';

// const AttendanceStatus = () => {
//   const [activeTab, setActiveTab] = useState('全部部門');
//   const [currentPage, setCurrentPage] = useState('attendance');
//   const [activeButton, setActiveButton] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 部門相關狀態
//   const [departments, setDepartments] = useState([
//     { id: 0, name: '全部部門' }
//   ]);
//   const [departmentsLoading, setDepartmentsLoading] = useState(false);
//   const [departmentsError, setDepartmentsError] = useState(null);

//   const navigate = useNavigate();

//   // 模擬出勤資料
//   const mockAttendanceData = [
//     {
//       employee_id: '15682',
//       name: '王大明',
//       department: '進院',
//       clock_in: '08:30',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15547',
//       name: '朱春光',
//       department: '進院',
//       clock_in: '08:45',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'hr'
//     },
//     {
//       employee_id: '15883',
//       name: '李正發',
//       department: '進院',
//       clock_in: '09:00',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15602',
//       name: '陳小華',
//       department: '進院',
//       clock_in: '08:15',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15555',
//       name: '張美麗',
//       department: '進院',
//       clock_in: '08:20',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15666',
//       name: '林小明',
//       department: '進院',
//       clock_in: '08:35',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15777',
//       name: '黃大雄',
//       department: '進院',
//       clock_in: '08:40',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15888',
//       name: '大崎店',
//       department: '編制',
//       clock_in: '09:15',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '15999',
//       name: '布丁折',
//       department: '編制',
//       clock_in: '09:30',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '16000',
//       name: '小李',
//       department: '編制',
//       clock_in: '09:45',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '16111',
//       name: '中生',
//       department: '麻袋',
//       clock_in: '10:00',
//       clock_out: null,
//       status: 'working',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '16222',
//       name: '小王',
//       department: '請假',
//       clock_in: null,
//       clock_out: null,
//       status: 'leave',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '16333',
//       name: '阿明',
//       department: '休假',
//       clock_in: null,
//       clock_out: null,
//       status: 'off',
//       job_grade: 'staff'
//     },
//     {
//       employee_id: '16444',
//       name: '小張',
//       department: '休假',
//       clock_in: null,
//       clock_out: null,
//       status: 'off',
//       job_grade: 'staff'
//     }
//   ];

//   // 獲取部門資料的函數
//   const fetchDepartments = async () => {
//     try {
//       setDepartmentsLoading(true);
//       setDepartmentsError(null);
      
//       const companyId = Cookies.get('company_id') || '76014406';
      
//       const response = await axios.get(`https://rabbit.54ucl.com:3004/api/departments?company_id=${companyId}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       if (response.data.Status === 'Ok') {
//         const apiDepartments = response.data.Data || [];
//         const formattedDepartments = apiDepartments
//           .map((dept) => ({
//             id: dept.id,
//             name: dept.department
//           }))
//           .sort((a, b) => a.id - b.id);
        
//         setDepartments([
//           { id: 0, name: '全部部門' },
//           ...formattedDepartments
//         ]);
//       } else {
//         setDepartmentsError(response.data.Msg || '獲取部門資料失敗');
//         console.error('獲取部門資料失敗:', response.data.Msg);
//       }
//     } catch (err) {
//       console.error('獲取部門資料失敗:', err);
//       setDepartmentsError('無法連接到伺服器，請稍後再試');
//     } finally {
//       setDepartmentsLoading(false);
//     }
//   };

//   // 處理返回按鈕
//   const handleBackToAttendance = () => {
//     navigate('/Human');
//   };

//   // 自定義側邊欄項目點擊處理
//   const handleCustomSidebarClick = (item) => {
//     console.log('自定義處理側邊欄點擊:', item.id);
    
//     if (item.id === 'employee') {
//       setCurrentPage('employee');
//       return false;
//     }
    
//     setCurrentPage(item.id);
//     return true;
//   };

//   // 自定義登出處理
//   const handleCustomLogout = () => {
//     console.log('執行自定義登出邏輯');
//     navigate('/login');
//   };

//   // 獲取出勤資料
//   const fetchAttendanceData = async (department = '全部部門') => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // 使用模擬資料，根據部門篩選
//       let filteredData = mockAttendanceData;
//       if (department !== '全部部門') {
//         filteredData = mockAttendanceData.filter(emp => emp.department === department);
//       }
      
//       setAttendanceData(filteredData);
//     } catch (err) {
//       console.error('獲取出勤資料失敗:', err);
//       setError('無法連接到伺服器，請稍後再試');
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchAttendanceData('全部部門');
//   }, []);

//   const handleDepartmentChange = (departmentName) => {
//     setActiveTab(departmentName);
//     fetchAttendanceData(departmentName);
//   };

//   // 格式化時間顯示
//   const formatTime = (timeString) => {
//     if (!timeString) return '-';
//     return timeString;
//   };

//   // 計算出勤狀態
//   const getAttendanceStatus = (employee) => {
//     if (employee.status === 'leave') {
//       return { status: '請假', className: 'status-leave' };
//     } else if (employee.status === 'off') {
//       return { status: '休假', className: 'status-off' };
//     } else if (employee.clock_in && employee.clock_out) {
//       return { status: '已下班', className: 'status-completed' };
//     } else if (employee.clock_in) {
//       return { status: '已上班', className: 'status-working' };
//     } else {
//       return { status: '未出勤', className: 'status-absent' };
//     }
//   };

//   // 出勤卡片組件 - 使用與員工卡片相同的樣式
//   const AttendanceCard = ({ employee }) => {
//     const attendanceStatus = getAttendanceStatus(employee);
    
//     return (
//       <div className="employee-card">
//         <div className="employee-card-content">
//           {/* 頭像 */}
//           <div className="employee-card-avatar">
//             <img 
//               src={PortraitImage} 
//               alt={`${employee.name}的大頭貼`}
//               className="employee-card-image"
//               onError={(e) => {
//                 e.target.style.display = 'none';
//                 e.target.nextSibling.style.display = 'flex';
//               }}
//             />
//             <div className="employee-card-fallback" style={{display: 'none'}}>
//               👤
//             </div>
//           </div>
          
//           {/* 兩行資訊 */}
//           <div className="employee-card-main-info">
//             {/* 第一行：姓名 + 部門 */}
//             <div className="employee-card-avatar-info">
//               <div className="employee-card-name">{employee.name}</div>
//               <div className="employee-card-department">{employee.department}</div>
//             </div>
            
//             {/* 第二行：員工編號 + 出勤狀態 */}
//             <div className="employee-card-department-position">
//               <div className="employee-card-id">{employee.employee_id}</div>
//               <div className={`employee-card-position ${attendanceStatus.className}`}>
//                 {attendanceStatus.status}
//               </div>
//             </div>
//           </div>
          
//           {/* 時間資訊 */}
//           <div className="attendance-time-info">
//             <div className="time-item">
//               <span className="time-label">上班</span>
//               <span className="time-value">{formatTime(employee.clock_in)}</span>
//             </div>
//             <div className="time-item">
//               <span className="time-label">下班</span>
//               <span className="time-value">{formatTime(employee.clock_out)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // 修改職級分組函數，調整顯示順序：主管優先
//   const groupEmployeesByJobGrade = (employees) => {
//     const jobGradeGroups = {};
    
//     employees.forEach(emp => {
//       let gradeLabel;
//       if (emp.job_grade === 'hr') {
//         gradeLabel = '主管';
//       } else if (emp.job_grade === 'staff') {
//         gradeLabel = '員工';
//       } else {
//         gradeLabel = '未設定職級';
//       }
      
//       if (!jobGradeGroups[gradeLabel]) {
//         jobGradeGroups[gradeLabel] = [];
//       }
//       jobGradeGroups[gradeLabel].push(emp);
//     });
    
//     const sortOrder = ['主管', '員工', '未設定職級'];
//     const sortedGroups = {};
    
//     sortOrder.forEach(grade => {
//       if (jobGradeGroups[grade]) {
//         sortedGroups[grade] = jobGradeGroups[grade];
//       }
//     });
    
//     return sortedGroups;
//   };

//   const JobGradeSection = ({ jobGrade, employees, departmentName = null }) => (
//     <div className="position-section">
//       <div className="position-section-header">
//         <h3 className="position-section-title">
//           {jobGrade}
//         </h3>
//       </div>
      
//       <div className="position-section-grid">
//         {employees.map((employee) => (
//           <AttendanceCard 
//             key={employee.employee_id} 
//             employee={employee}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   const filteredAttendance = attendanceData.filter(employee => 
//     employee.name.includes(searchQuery) || 
//     employee.employee_id.toString().includes(searchQuery) ||
//     (employee.department && employee.department.includes(searchQuery))
//   );

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="loading-container">
//           <div className="loading-content">
//             <div className="loading-spinner"></div>
//             載入中...
//           </div>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="error-container">
//           <p>{error}</p>
//           <button 
//             onClick={() => fetchAttendanceData(activeTab)}
//             className="error-retry-button"
//           >
//             重新載入
//           </button>
//         </div>
//       );
//     }

//     if (activeButton === 0) {
//       return (
//         <>
//           <div className="departments-container">
//             {departmentsLoading ? (
//               <div className="departments-loading">
//                 <div className="loading-spinner"></div>
//                 載入部門中...
//               </div>
//             ) : departmentsError ? (
//               <div className="departments-error">
//                 <p>{departmentsError}</p>
//                 <button 
//                   onClick={fetchDepartments}
//                   className="error-retry-button"
//                 >
//                   重新載入部門
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {departments.map(department => (
//                   <div 
//                     key={department.id} 
//                     className={`department-tab ${activeTab === department.name ? 'department-tab-active' : ''}`}
//                     onClick={() => handleDepartmentChange(department.name)}
//                   >
//                     {department.name}
//                   </div>
//                 ))}
//                 {/* 日期選擇器 */}
//                 <div className="date-selector">
//                   <label>查詢日期：</label>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="date-input"
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           {attendanceData.length === 0 ? (
//             <div className="no-employees-container">
//               <p>目前{activeTab === '全部部門' ? '' : ` ${activeTab} 部門`}沒有出勤資料</p>
//             </div>
//           ) : (
//             <>
//               {activeTab === '全部部門' ? (
//                 (() => {
//                   const jobGradeGroups = groupEmployeesByJobGrade(attendanceData);
//                   return Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
//                     <JobGradeSection
//                       key={jobGrade}
//                       jobGrade={jobGrade}
//                       employees={gradeEmployees}
//                     />
//                   ));
//                 })()
//               ) : (
//                 (() => {
//                   const jobGradeGroups = groupEmployeesByJobGrade(attendanceData);
//                   return Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
//                     <JobGradeSection
//                       key={jobGrade}
//                       jobGrade={jobGrade}
//                       employees={gradeEmployees}
//                     />
//                   ));
//                 })()
//               )}
//             </>
//           )}
//         </>
//       );
//     }

//     if (activeButton === 1) {
//       const jobGradeGroups = groupEmployeesByJobGrade(filteredAttendance);
      
//       return (
//         <>
//           <div className="search-input-container">
//             <input
//               type="text"
//               placeholder="輸入員工姓名/員工編號"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             <button 
//               className="search-button"
//               onClick={() => {
//                 console.log('執行搜尋:', searchQuery);
//               }}
//             >
//               <svg className="search-icon" viewBox="0 0 24 24">
//                 <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
//               </svg>
//             </button>
//           </div>
          
//           {searchQuery && (
//             <>
//               {filteredAttendance.length === 0 ? (
//                 <div className="no-employees-container">
//                   <p>找不到符合條件的出勤記錄</p>
//                 </div>
//               ) : (
//                 <>
//                   {Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
//                     <JobGradeSection
//                       key={jobGrade}
//                       jobGrade={jobGrade}
//                       employees={gradeEmployees}
//                     />
//                   ))}
//                 </>
//               )}
//             </>
//           )}
//         </>
//       );
//     }

//     if (activeButton === 2) {
//       return (
//         <div className="employee-detail-placeholder">
//           <h3>出勤統計</h3>
//           <div className="attendance-summary">
//             <div className="summary-item">
//               <span className="summary-label">進院：</span>
//               <span className="summary-value">7人</span>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">編制：</span>
//               <span className="summary-value">3人</span>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">麻袋：</span>
//               <span className="summary-value">1人</span>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">請假：</span>
//               <span className="summary-value">1人</span>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">休假：</span>
//               <span className="summary-value">2人</span>
//             </div>
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="employee-management-page">
//       <Sidebar 
//         currentPage={currentPage}
//         onItemClick={handleCustomSidebarClick}
//         onLogout={handleCustomLogout}
//       />

//       <div className="main-content" style={{ marginLeft: '250px' }}>
//         <div className="main-content-inner">
//           <div className="breadcrumb">
//             <button 
//               className="breadcrumb-button"
//               onClick={handleBackToAttendance}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4a86e8" className="breadcrumb-icon">
//                 <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
//               </svg>
//               返回員工資料
//             </button>
//           </div>

//           <h2 className="page-title">今日出勤狀況</h2>

//           <div className="button-group-container">
//             <div className="query-method-container">
//               <div
//                 className={`query-button ${activeButton === 0 ? 'query-button-active' : ''}`}
//                 onClick={() => setActiveButton(0)}
//               >
//                 <span className={`query-button-text ${activeButton === 0 ? 'query-button-text-active' : ''}`}>
//                   選擇部門
//                 </span>
//               </div>

//               <div
//                 className={`query-button ${activeButton === 1 ? 'query-button-active' : ''}`}
//                 onClick={() => setActiveButton(1)}
//               >
//                 <span className={`query-button-text ${activeButton === 1 ? 'query-button-text-active' : ''}`}>
//                   搜尋員工
//                 </span>
//               </div>

//               <div
//                 className={`query-button ${activeButton === 2 ? 'query-button-active' : ''}`}
//                 onClick={() => setActiveButton(2)}
//               >
//                 <span className={`query-button-text ${activeButton === 2 ? 'query-button-text-active' : ''}`}>
//                   出勤統計
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="content-area">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceStatus;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../config'; // 🔥 從 config 引入 API_BASE_URL
import { useAuth } from '../Hook/useAuth'; // 🔥 引入 useAuth Hook
import Sidebar from '../Sidebar';
import PortraitImage from '../ICON/Portrait.png'; 
import './AttendanceStatus.css';

const AttendanceStatus = () => {
  // 🔥 使用 useRef 防止重複初始化
  const initializationRef = useRef(false);
  const mountedRef = useRef(true);

  // 🔥 使用 useAuth Hook
  const { hasValidAuth, logout, getCookie } = useAuth();

  const [activeTab, setActiveTab] = useState('全部部門');
  const [currentPage, setCurrentPage] = useState('attendance');
  const [activeButton, setActiveButton] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 簡化初始化狀態
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState('');

  // 部門相關狀態
  const [departments, setDepartments] = useState([
    { id: 0, name: '全部部門' }
  ]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState(null);

  const navigate = useNavigate();

  // 🔥 清理函數
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 🔥 獲取部門資料的函數 - 使用 useCallback 和 config
  const fetchDepartments = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      setDepartmentsLoading(true);
      setDepartmentsError(null);
      
      const companyId = getCookie('company_id') || '76014406';
      
      const response = await axios.get(`${API_BASE_URL}/api/departments?company_id=${companyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookie('auth_xtbb')}` // 🔥 加入 auth_xtbb 檢查
        }
      });

      if (!mountedRef.current) return;

      if (response.data.Status === 'Ok') {
        const apiDepartments = response.data.Data || [];
        const formattedDepartments = apiDepartments
          .map((dept) => ({
            id: dept.id,
            name: dept.department
          }))
          .sort((a, b) => a.id - b.id);
        
        setDepartments([
          { id: 0, name: '全部部門' },
          ...formattedDepartments
        ]);
      } else {
        setDepartmentsError(response.data.Msg || '獲取部門資料失敗');
        console.error('獲取部門資料失敗:', response.data.Msg);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('獲取部門資料失敗:', err);
      
      // 🔥 檢查 401 錯誤
      if (err.response?.status === 401) {
        console.log('🔥 Token 可能已過期，重新登入');
        logout();
        return;
      }
      
      setDepartmentsError('無法連接到伺服器，請稍後再試');
    } finally {
      if (mountedRef.current) {
        setDepartmentsLoading(false);
      }
    }
  }, []); // 🔥 空依賴陣列

  // 🔥 獲取出勤資料 - 使用 useCallback 和實際 API
  const fetchAttendanceData = useCallback(async (department = '全部部門') => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const companyId = getCookie('company_id') || '76014406';
      
      // 🔥 構建請求參數
      const requestData = {
        company_id: companyId,
        date: selectedDate // 使用選擇的日期
      };
      
      if (department !== '全部部門') {
        requestData.department = department;
      }
      
      // 🔥 調用實際的出勤 API（假設有這個端點）
      const response = await axios.post(`${API_BASE_URL}/api/attendance`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getCookie('auth_xtbb')}` // 🔥 加入 auth_xtbb 檢查
        }
      });

      if (!mountedRef.current) return;

      if (response.data.Status === 'Ok') {
        setAttendanceData(response.data.Data || []);
      } else {
        setError(response.data.Msg || '獲取出勤資料失敗');
        setAttendanceData([]);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('獲取出勤資料失敗:', err);
      
      // 🔥 檢查 401 錯誤
      if (err.response?.status === 401) {
        console.log('🔥 Token 可能已過期，重新登入');
        logout();
        return;
      }
      
      setError('無法連接到伺服器，請稍後再試');
      setAttendanceData([]);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [selectedDate]); // 🔥 依賴選擇的日期

  // 🔥 處理返回按鈕
  const handleBackToAttendance = useCallback(() => {
    navigate('/Human');
  }, [navigate]);

  // 🔥 自定義側邊欄項目點擊處理
  const handleCustomSidebarClick = useCallback((item) => {
    console.log('自定義處理側邊欄點擊:', item.id);
    
    if (item.id === 'employee') {
      setCurrentPage('employee');
      return false;
    }
    
    setCurrentPage(item.id);
    return true;
  }, []);

  // 🔥 自定義登出處理
  const handleCustomLogout = useCallback(() => {
    console.log('執行自定義登出邏輯');
    if (window.confirm('確定要登出嗎？')) {
      logout();
    }
  }, [logout]);

  const handleDepartmentChange = useCallback((departmentName) => {
    setActiveTab(departmentName);
    fetchAttendanceData(departmentName);
  }, [fetchAttendanceData]);

  const handleButtonClick = useCallback((buttonIndex) => {
    setActiveButton(buttonIndex);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateChange = useCallback((e) => {
    setSelectedDate(e.target.value);
    // 當日期改變時，重新獲取出勤資料
    fetchAttendanceData(activeTab);
  }, [activeTab, fetchAttendanceData]);

  const handleSearch = useCallback(() => {
    console.log('執行搜尋:', searchQuery);
  }, [searchQuery]);

  // 🔥 修正：只執行一次的初始化
  useEffect(() => {
    const initializeComponent = async () => {
      // 🔥 防止重複初始化
      if (initializationRef.current) {
        console.log('🔥 AttendanceStatus 已經初始化過，跳過');
        return;
      }

      console.log('🔍 AttendanceStatus 頁面：開始初始化');
      initializationRef.current = true;
      
      try {
        setIsLoading(true);
        setInitError('');
        
        // 🔥 檢查身份驗證
        const isAuthenticated = hasValidAuth();
        
        if (!isAuthenticated) {
          console.log('❌ AttendanceStatus 頁面：身份驗證失敗');
          setInitError('身份驗證失敗，請重新登入');
          setTimeout(() => {
            logout();
          }, 2000);
          return;
        }
        
        console.log('✅ AttendanceStatus 頁面：身份驗證成功');
        
        // 🔥 並行載入資料
        if (mountedRef.current) {
          await Promise.all([
            fetchDepartments(),
            fetchAttendanceData('全部部門')
          ]);
        }
        
        console.log('✅ AttendanceStatus 頁面：初始化完成');
        
      } catch (error) {
        console.error('❌ AttendanceStatus 組件初始化異常:', error);
        setInitError('初始化失敗');
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initializeComponent();
  }, []); // 🔥 空依賴陣列 - 只執行一次

  // 格式化時間顯示
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString;
  };

  // 計算出勤狀態
  const getAttendanceStatus = (employee) => {
    if (employee.status === 'leave') {
      return { status: '請假', className: 'status-leave' };
    } else if (employee.status === 'off') {
      return { status: '休假', className: 'status-off' };
    } else if (employee.clock_in && employee.clock_out) {
      return { status: '已下班', className: 'status-completed' };
    } else if (employee.clock_in) {
      return { status: '已上班', className: 'status-working' };
    } else {
      return { status: '未出勤', className: 'status-absent' };
    }
  };

  // 出勤卡片組件
  const AttendanceCard = ({ employee }) => {
    const attendanceStatus = getAttendanceStatus(employee);
    
    return (
      <div className="employee-card">
        <div className="employee-card-content">
          {/* 頭像 */}
          <div className="employee-card-avatar">
            <img 
              src={employee.avatar_url || PortraitImage} 
              alt={`${employee.name}的大頭貼`}
              className="employee-card-image"
              onError={(e) => {
                e.target.src = PortraitImage;
              }}
            />
          </div>
          
          {/* 兩行資訊 */}
          <div className="employee-card-main-info">
            {/* 第一行：姓名 + 部門 */}
            <div className="employee-card-avatar-info">
              <div className="employee-card-name">{employee.name}</div>
              <div className="employee-card-department">{employee.department}</div>
            </div>
            
            {/* 第二行：員工編號 + 出勤狀態 */}
            <div className="employee-card-department-position">
              <div className="employee-card-id">{employee.employee_id}</div>
              <div className={`employee-card-position ${attendanceStatus.className}`}>
                {attendanceStatus.status}
              </div>
            </div>
          </div>
          
          {/* 時間資訊 */}
          <div className="attendance-time-info">
            <div className="time-item">
              <span className="time-label">上班</span>
              <span className="time-value">{formatTime(employee.clock_in)}</span>
            </div>
            <div className="time-item">
              <span className="time-label">下班</span>
              <span className="time-value">{formatTime(employee.clock_out)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 職級分組函數
  const groupEmployeesByJobGrade = (employees) => {
    const jobGradeGroups = {};
    
    employees.forEach(emp => {
      let gradeLabel;
      if (emp.job_grade === 'hr') {
        gradeLabel = '主管';
      } else if (emp.job_grade === 'staff') {
        gradeLabel = '員工';
      } else {
        gradeLabel = '未設定職級';
      }
      
      if (!jobGradeGroups[gradeLabel]) {
        jobGradeGroups[gradeLabel] = [];
      }
      jobGradeGroups[gradeLabel].push(emp);
    });
    
    const sortOrder = ['主管', '員工', '未設定職級'];
    const sortedGroups = {};
    
    sortOrder.forEach(grade => {
      if (jobGradeGroups[grade]) {
        sortedGroups[grade] = jobGradeGroups[grade];
      }
    });
    
    return sortedGroups;
  };

  const JobGradeSection = ({ jobGrade, employees }) => (
    <div className="position-section">
      <div className="position-section-header">
        <h3 className="position-section-title">
          {jobGrade}
        </h3>
      </div>
      
      <div className="position-section-grid">
        {employees.map((employee) => (
          <AttendanceCard 
            key={employee.employee_id} 
            employee={employee}
          />
        ))}
      </div>
    </div>
  );

  const filteredAttendance = attendanceData.filter(employee => 
    employee.name.includes(searchQuery) || 
    employee.employee_id.toString().includes(searchQuery) ||
    (employee.department && employee.department.includes(searchQuery))
  );

  // 🔥 early return
  if (isLoading) {
    return (
      <div className="employee-management-page">
        <Sidebar 
          currentPage={currentPage}
          onItemClick={() => {}}
          onLogout={handleCustomLogout}
        />

        <div className="main-content" style={{ marginLeft: '250px' }}>
          <div className="main-content-inner">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px',
              color: '#666'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div className="loading-spinner" style={{ marginBottom: '20px' }}></div>
                初始化中...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="employee-management-page">
        <Sidebar 
          currentPage={currentPage}
          onItemClick={handleCustomSidebarClick}
          onLogout={handleCustomLogout}
        />

        <div className="main-content" style={{ marginLeft: '250px' }}>
          <div className="main-content-inner">
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '20px',
              borderRadius: '4px',
              margin: '20px',
              border: '1px solid #f5c6cb',
              textAlign: 'center'
            }}>
              <strong>初始化失敗：</strong>{initError}
              <br />
              <button 
                onClick={() => window.location.reload()} 
                style={{ marginTop: '10px', padding: '5px 15px' }}
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            載入中...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p>{error}</p>
          <button 
            onClick={() => fetchAttendanceData(activeTab)}
            className="error-retry-button"
          >
            重新載入
          </button>
        </div>
      );
    }

    if (activeButton === 0) {
      return (
        <>
          <div className="departments-container">
            {departmentsLoading ? (
              <div className="departments-loading">
                <div className="loading-spinner"></div>
                載入部門中...
              </div>
            ) : departmentsError ? (
              <div className="departments-error">
                <p>{departmentsError}</p>
                <button 
                  onClick={fetchDepartments}
                  className="error-retry-button"
                >
                  重新載入部門
                </button>
              </div>
            ) : (
              <>
                {departments.map(department => (
                  <div 
                    key={department.id} 
                    className={`department-tab ${activeTab === department.name ? 'department-tab-active' : ''}`}
                    onClick={() => handleDepartmentChange(department.name)}
                  >
                    {department.name}
                  </div>
                ))}
                {/* 日期選擇器 */}
                <div className="date-selector">
                  <label>查詢日期：</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="date-input"
                  />
                </div>
              </>
            )}
          </div>

          {attendanceData.length === 0 ? (
            <div className="no-employees-container">
              <p>目前{activeTab === '全部部門' ? '' : ` ${activeTab} 部門`}沒有出勤資料</p>
            </div>
          ) : (
            <>
              {(() => {
                const jobGradeGroups = groupEmployeesByJobGrade(attendanceData);
                return Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
                  <JobGradeSection
                    key={jobGrade}
                    jobGrade={jobGrade}
                    employees={gradeEmployees}
                  />
                ));
              })()}
            </>
          )}
        </>
      );
    }

    if (activeButton === 1) {
      const jobGradeGroups = groupEmployeesByJobGrade(filteredAttendance);
      
      return (
        <>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="輸入員工姓名/員工編號"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button 
              className="search-button"
              onClick={handleSearch}
            >
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
          
          {searchQuery && (
            <>
              {filteredAttendance.length === 0 ? (
                <div className="no-employees-container">
                  <p>找不到符合條件的出勤記錄</p>
                </div>
              ) : (
                <>
                  {Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
                    <JobGradeSection
                      key={jobGrade}
                      jobGrade={jobGrade}
                      employees={gradeEmployees}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </>
      );
    }

    if (activeButton === 2) {
      // 🔥 計算實際的出勤統計
      const attendanceStats = attendanceData.reduce((stats, employee) => {
        const dept = employee.department || '未知部門';
        if (!stats[dept]) {
          stats[dept] = 0;
        }
        stats[dept]++;
        return stats;
      }, {});

      const statusStats = attendanceData.reduce((stats, employee) => {
        const status = getAttendanceStatus(employee).status;
        if (!stats[status]) {
          stats[status] = 0;
        }
        stats[status]++;
        return stats;
      }, {});

      return (
        <div className="employee-detail-placeholder">
          <h3>出勤統計 ({selectedDate})</h3>
          
          <div className="attendance-summary">
            <h4>部門統計</h4>
            {Object.entries(attendanceStats).map(([dept, count]) => (
              <div key={dept} className="summary-item">
                <span className="summary-label">{dept}：</span>
                <span className="summary-value">{count}人</span>
              </div>
            ))}
          </div>

          <div className="attendance-summary">
            <h4>狀態統計</h4>
            {Object.entries(statusStats).map(([status, count]) => (
              <div key={status} className="summary-item">
                <span className="summary-label">{status}：</span>
                <span className="summary-value">{count}人</span>
              </div>
            ))}
          </div>

          <div className="attendance-summary">
            <div className="summary-item">
              <span className="summary-label">總計：</span>
              <span className="summary-value">{attendanceData.length}人</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="employee-management-page">
      <Sidebar 
        currentPage={currentPage}
        onItemClick={handleCustomSidebarClick}
        onLogout={handleCustomLogout}
      />

      <div className="main-content" style={{ marginLeft: '250px' }}>
        <div className="main-content-inner">
          <div className="breadcrumb">
            <button 
              className="breadcrumb-button"
              onClick={handleBackToAttendance}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4a86e8" className="breadcrumb-icon">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              返回員工資料
            </button>
          </div>

          <h2 className="page-title">今日出勤狀況</h2>

          <div className="button-group-container">
            <div className="query-method-container">
              <div
                className={`query-button ${activeButton === 0 ? 'query-button-active' : ''}`}
                onClick={() => handleButtonClick(0)}
              >
                <span className={`query-button-text ${activeButton === 0 ? 'query-button-text-active' : ''}`}>
                  選擇部門
                </span>
              </div>

              <div
                className={`query-button ${activeButton === 1 ? 'query-button-active' : ''}`}
                onClick={() => handleButtonClick(1)}
              >
                <span className={`query-button-text ${activeButton === 1 ? 'query-button-text-active' : ''}`}>
                  搜尋員工
                </span>
              </div>

              <div
                className={`query-button ${activeButton === 2 ? 'query-button-active' : ''}`}
                onClick={() => handleButtonClick(2)}
              >
                <span className={`query-button-text ${activeButton === 2 ? 'query-button-text-active' : ''}`}>
                  出勤統計
                </span>
              </div>
            </div>
          </div>

          <div className="content-area">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatus;
