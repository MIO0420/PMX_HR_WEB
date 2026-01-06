import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../config'; // 引入配置
import Sidebar from '../Sidebar'; // 從指定路徑引入 Sidebar 組件
import EmployeeBasicInformationTable from './EmployeeBasicInformation/EmployeeBasicInformationTable';
import NewDepartments from './NewDepartments'; // 新增引入 NewDepartments 組件
import PortraitImage from '../ICON/Portrait.png'; 
import './Human.css';

const Human = () => {
  const [activeTab, setActiveTab] = useState('全部部門'); // 預設為全部部門
  const [currentPage, setCurrentPage] = useState('employee');
  const [activeButton, setActiveButton] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  
  // 新增部門模態框狀態
  const [showNewDepartmentModal, setShowNewDepartmentModal] = useState(false);
  
  // 添加開關狀態管理
  const [switches, setSwitches] = useState({
    shiftWork: false,      // 輪班制
    management: false,     // 管理職
    training: true,        // 受訓後管制 (預設開啟)
    clockFree: false       // 免打卡待遇
  });
  
  const [newEmployee, setNewEmployee] = useState({ 
    id: '', 
    name: '', 
    gender: '', 
    identity: '', 
    salaryType: '', 
    shiftType: '', 
    department: '全部部門', // 修改預設值
    insuranceLevel: '' 
  });
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 新增部門相關狀態
  const [departments, setDepartments] = useState([
    { id: 0, name: '全部部門' } // 移除 icon 屬性
  ]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState(null);

  const navigate = useNavigate();

  // 獲取部門資料的函數
  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      setDepartmentsError(null);
      
      const companyId = Cookies.get('company_id') || '76014406';
      
      const response = await axios.get(`${API_BASE_URL}/api/departments?company_id=${companyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.Status === 'Ok') {
        const apiDepartments = response.data.Data || [];
        
        // 將 API 資料轉換為組件需要的格式，不加圖示，並按 id 排序
        const formattedDepartments = apiDepartments
          .map((dept) => ({
            id: dept.id,
            name: dept.department
          }))
          .sort((a, b) => a.id - b.id); // 新增這行：按 id 數字大小排序，數字越小越靠前
        
        // 將全部部門選項加到最前面
        setDepartments([
          { id: 0, name: '全部部門' },
          ...formattedDepartments
        ]);
      } else {
        setDepartmentsError(response.data.Msg || '獲取部門資料失敗');
        console.error('獲取部門資料失敗:', response.data.Msg);
      }
    } catch (err) {
      console.error('獲取部門資料失敗:', err);
      setDepartmentsError('無法連接到伺服器，請稍後再試');
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // 處理新增部門按鈕點擊
  const handleAddDepartmentClick = () => {
    setShowNewDepartmentModal(true);
  };

  // 處理新增部門模態框關閉
  const handleNewDepartmentClose = () => {
    setShowNewDepartmentModal(false);
  };

  // 處理新增部門成功後的回調
  const handleNewDepartmentSuccess = () => {
    // 重新載入部門列表
    fetchDepartments();
    // 如果當前顯示的是全部部門，也重新載入員工資料
    if (activeTab === '全部部門') {
      fetchEmployees('全部部門');
    }
  };

  // 處理返回按鈕
  const handleBackToAttendance = () => {
    if (showEmployeeModal) {
      closeEmployeeModal();
    } else {
      navigate('/homepage');
    }
  };

  // 自定義側邊欄項目點擊處理
  const handleCustomSidebarClick = (item) => {
    console.log('自定義處理側邊欄點擊:', item.id);
    
    // 在這裡可以添加特殊的處理邏輯
    if (item.id === 'employee') {
      // 如果點擊員工資料，保持在當前頁面
      setCurrentPage('employee');
      return true; // 返回 false 阻止預設的導航行為
    }
    
    // 對於其他項目，允許預設處理繼續
    setCurrentPage(item.id);
    return true;
  };

  // 自定義登出處理
  const handleCustomLogout = () => {
    console.log('執行自定義登出邏輯');
    // 可以在這裡添加清除資料、顯示確認對話框等邏輯
    navigate('/login');
  };

  // 🔥 新增：統一處理按鈕點擊的函數
  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
    // 如果有打開的員工詳情模態框，就關閉它
    if (showEmployeeModal) {
      closeEmployeeModal();
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return { years: 0, months: 0 };
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`;
  };

  const toggleSwitch = (switchName) => {
    setSwitches(prev => ({
      ...prev,
      [switchName]: !prev[switchName]
    }));
  };

  const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => (
    <div 
      className={`emp-toggle-switch ${isOn ? 'emp-toggle-switch-on' : 'emp-toggle-switch-off'} ${disabled ? 'emp-toggle-switch-disabled' : ''}`}
      onClick={disabled ? undefined : onToggle}
    >
      <div className={`emp-toggle-switch-slider ${isOn ? 'emp-toggle-switch-slider-on' : 'emp-toggle-switch-slider-off'}`}></div>
    </div>
  );

  // 修改 fetchEmployees 函數以支援查詢全部部門
  const fetchEmployees = async (department = '全部部門') => {
    try {
      setLoading(true);
      setError(null);
      
      const companyId = Cookies.get('company_id') || '76014406';
      
      // 如果是全部部門，則不傳入 department 參數或傳入特殊值
      const requestData = {
        company_id: companyId
      };
      
      // 只有在不是全部部門時才加入 department 參數
      if (department !== '全部部門') {
        requestData.department = department;
      }
      
      const response = await axios.post(`${API_BASE_URL}/api/employees`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.Status === 'Ok') {
        setEmployees(response.data.Data || []);
      } else {
        setError(response.data.Msg || '獲取員工資料失敗');
        setEmployees([]);
      }
    } catch (err) {
      console.error('獲取員工資料失敗:', err);
      setError('無法連接到伺服器，請稍後再試');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // 修改 useEffect 以同時載入部門資料和員工資料
  useEffect(() => {
    // 同時載入部門資料和員工資料
    fetchDepartments();
    fetchEmployees('全部部門');
  }, []);

  const handleDepartmentChange = (departmentName) => {
    setActiveTab(departmentName);
    fetchEmployees(departmentName);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
    
    setSwitches({
      shiftWork: employee.shift_system === 'Fixed Shift' ? false : true,
      management: employee.job_grade === 'hr' ? true : false,
      training: employee.post_training_control === 1 ? true : false,
      clockFree: false
    });
  };

  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const EmployeeCard = ({ employee }) => (
    <button className="emp-employee-card" onClick={() => handleEmployeeClick(employee)}>
      <div className="emp-employee-card-content">
        {/* 頭像 */}
        <div className="emp-employee-card-avatar">
          {employee.avatar_url ? (
            <img 
              src={employee.avatar_url} 
              alt={employee.name}
              className="emp-employee-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <img 
              src={PortraitImage} 
              alt={`${employee.name}的大頭貼`}
              className="emp-employee-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          )}
          <div className="emp-employee-card-fallback" style={{display: employee.avatar_url || PortraitImage ? 'none' : 'flex'}}>
            👤
          </div>
        </div>
        
        {/* 兩行資訊 */}
        <div className="emp-employee-card-main-info">
          {/* 第一行：姓名 + 部門 */}
          <div className="emp-employee-card-avatar-info">
            <div className="emp-employee-card-name">{employee.name}</div>
            <div className="emp-employee-card-department">{employee.department}</div>
          </div>
          
          {/* 第二行：員工編號 + 職位 */}
          <div className="emp-employee-card-department-position">
            <div className="emp-employee-card-id">{employee.employee_id}</div>
            <div className="emp-employee-card-position">
              {employee.position || (employee.job_grade === 'hr' ? '主管' : employee.job_grade === 'staff' ? '員工' : '未設定')}
            </div>
          </div>
        </div>
      </div>
    </button>
  );

  // 修改職級分組函數，調整顯示順序：主管優先
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
    
    // 修改排序：主管優先，然後員工，最後未設定
    const sortOrder = ['主管', '員工', '未設定職級'];
    const sortedGroups = {};
    
    sortOrder.forEach(grade => {
      if (jobGradeGroups[grade]) {
        sortedGroups[grade] = jobGradeGroups[grade];
      }
    });
    
    return sortedGroups;
  };

  // 修改部門和職級雙重分組函數，也調整職級順序
  const groupEmployeesByDepartmentAndJobGrade = (employees) => {
    const departmentGroups = {};
    
    employees.forEach(emp => {
      const department = emp.department || '未設定部門';
      
      if (!departmentGroups[department]) {
        departmentGroups[department] = {};
      }
      
      let gradeLabel;
      if (emp.job_grade === 'hr') {
        gradeLabel = '主管';
      } else if (emp.job_grade === 'staff') {
        gradeLabel = '員工';
      } else {
        gradeLabel = '未設定職級';
      }
      
      if (!departmentGroups[department][gradeLabel]) {
        departmentGroups[department][gradeLabel] = [];
      }
      departmentGroups[department][gradeLabel].push(emp);
    });
    
    // 對每個部門內的職級進行排序
    const sortOrder = ['主管', '員工', '未設定職級'];
    Object.keys(departmentGroups).forEach(department => {
      const sortedJobGrades = {};
      sortOrder.forEach(grade => {
        if (departmentGroups[department][grade]) {
          sortedJobGrades[grade] = departmentGroups[department][grade];
        }
      });
      departmentGroups[department] = sortedJobGrades;
    });
    
    return departmentGroups;
  };

  const JobGradeSection = ({ jobGrade, employees, departmentName = null }) => (
    <div className="emp-position-section">
      <div className="emp-position-section-header">
        <h3 className="emp-position-section-title">
          {jobGrade}
        </h3>
      </div>
      
      <div className="emp-position-section-grid">
        {employees.map((employee) => (
          <EmployeeCard 
            key={employee.employee_id} 
            employee={employee}
          />
        ))}
      </div>
    </div>
  );

  const filteredEmployees = employees.filter(employee => 
    employee.name.includes(searchQuery) || 
    employee.employee_id.toString().includes(searchQuery) ||
    (employee.position && employee.position.includes(searchQuery))
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="emp-loading-container">
          <div className="emp-loading-content">
            <div className="emp-loading-spinner"></div>
            載入中...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="emp-error-container">
          <p>{error}</p>
          <button 
            onClick={() => fetchEmployees(activeTab)}
            className="emp-error-retry-button"
          >
            重新載入
          </button>
        </div>
      );
    }

    if (activeButton === 0) {
      return (
        <>
          <div className="emp-departments-container">
            {departmentsLoading ? (
              <div className="emp-departments-loading">
                <div className="emp-loading-spinner"></div>
                載入部門中...
              </div>
            ) : departmentsError ? (
              <div className="emp-departments-error">
                <p>{departmentsError}</p>
                <button 
                  onClick={fetchDepartments}
                  className="emp-error-retry-button"
                >
                  重新載入部門
                </button>
              </div>
            ) : (
              <>
                {departments.map(department => (
                  <div 
                    key={department.id} 
                    className={`emp-department-tab ${activeTab === department.name ? 'emp-department-tab-active' : ''}`}
                    onClick={() => handleDepartmentChange(department.name)}
                  >
                    {department.name}
                  </div>
                ))}
                <button 
                  className="emp-add-department-button"
                  onClick={handleAddDepartmentClick}
                >
                  <span className="emp-add-department-icon">+</span>
                  新增部門
                </button>
              </>
            )}
          </div>

          {employees.length === 0 ? (
            <div className="emp-no-employees-container">
              <p>目前{activeTab === '全部部門' ? '' : ` ${activeTab} 部門`}沒有員工資料</p>
            </div>
          ) : (
            <>
              {activeTab === '全部部門' ? (
                // 如果是全部部門，按職級分組顯示（不顯示部門標題）
                (() => {
                  const jobGradeGroups = groupEmployeesByJobGrade(employees);
                  return Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
                    <JobGradeSection
                      key={jobGrade}
                      jobGrade={jobGrade}
                      employees={gradeEmployees}
                    />
                  ));
                })()
              ) : (
                // 如果是特定部門，只按職級分組
                (() => {
                  const jobGradeGroups = groupEmployeesByJobGrade(employees);
                  return Object.entries(jobGradeGroups).map(([jobGrade, gradeEmployees]) => (
                    <JobGradeSection
                      key={jobGrade}
                      jobGrade={jobGrade}
                      employees={gradeEmployees}
                    />
                  ));
                })()
              )}
            </>
          )}
        </>
      );
    }

    if (activeButton === 1) {
      const jobGradeGroups = groupEmployeesByJobGrade(filteredEmployees);
      
      return (
        <>
          {/* 搜尋輸入框容器 - 按照 Figma 規範 */}
          <div className="emp-search-input-container">
            <input
              type="text"
              placeholder="輸入員工姓名/員工編號"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="emp-search-input"
            />
            <button 
              className="emp-search-button"
              onClick={() => {
                // 可以在這裡添加搜尋邏輯，目前是即時搜尋
                console.log('執行搜尋:', searchQuery);
              }}
            >
              <svg className="emp-search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
          
          {searchQuery && (
            <>
              {filteredEmployees.length === 0 ? (
                <div className="emp-no-employees-container">
                  <p>找不到符合條件的員工</p>
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
      return (
        <div className="emp-employee-detail-placeholder">
          <h3>新增員工</h3>
          <p>此功能正在開發中...</p>
        </div>
      );
    }
  };

  return (
    <div className="emp-employee-management-page">
      {/* 使用從 Backpage 引入的 Sidebar 組件 */}
      <Sidebar 
        currentPage={currentPage}
        onItemClick={handleCustomSidebarClick}
        onLogout={handleCustomLogout}
      />

      {/* 主內容區 - 調整左邊距以配合 Sidebar */}
      <div className="emp-main-content" style={{ marginLeft: '250px' }}>
        <div className="emp-main-content-inner">
          <div className="emp-breadcrumb">
            <button 
              className="emp-breadcrumb-button"
              onClick={handleBackToAttendance}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4a86e8" className="emp-breadcrumb-icon">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              查看今日出勤狀況
            </button>
          </div>

          <h2 className="emp-page-title">員工資料</h2>

          <div className="emp-button-group-container">
            <div className="emp-query-method-container">
              {/* 🔥 修改：使用新的 handleButtonClick 函數 */}
              <div
                className={`emp-query-button ${activeButton === 0 ? 'emp-query-button-active' : ''}`}
                onClick={() => handleButtonClick(0)}
              >
                <span className={`emp-query-button-text ${activeButton === 0 ? 'emp-query-button-text-active' : ''}`}>
                  選擇部門
                </span>
              </div>

              <div
                className={`emp-query-button ${activeButton === 1 ? 'emp-query-button-active' : ''}`}
                onClick={() => handleButtonClick(1)}
              >
                <span className={`emp-query-button-text ${activeButton === 1 ? 'emp-query-button-text-active' : ''}`}>
                  搜尋員工
                </span>
              </div>

              <div
                className={`emp-query-button ${activeButton === 2 ? 'emp-query-button-active' : ''}`}
                onClick={() => handleButtonClick(2)}
              >
                <span className={`emp-query-button-text ${activeButton === 2 ? 'emp-query-button-text-active' : ''}`}>
                  新增員工
                </span>
              </div>
            </div>
          </div>

          <div className="emp-content-area">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* 員工詳情模態框 */}
      {showEmployeeModal && selectedEmployee && (
        <div className="emp-employee-detail-modal">
          <div className="emp-employee-detail-main">
            <EmployeeBasicInformationTable
              employee={selectedEmployee}
              switches={switches}
              toggleSwitch={toggleSwitch}
              ToggleSwitch={ToggleSwitch}
              calculateAge={calculateAge}
              formatDate={formatDate}
              onClose={closeEmployeeModal}
            />
          </div>
        </div>
      )}

      {/* 新增部門模態框 */}
      <NewDepartments
        isOpen={showNewDepartmentModal}
        onClose={handleNewDepartmentClose}
        onSuccess={handleNewDepartmentSuccess}
      />
    </div>
  );
};

export default Human;
