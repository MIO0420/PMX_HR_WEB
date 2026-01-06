import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../Hook/useAuth';
import Sidebar from '../Sidebar';
import PortraitImage from '../ICON/Portrait.png';
import './Permissions.css';
import AddEmployeePermissions from './AddEmployeePermissions/AddEmployeePermissions';
import RevisePermissions from './Revise_Permissions/Revise_Permissions';
import CompanyInformationIcon from '../ICON/SidebarICON/CompanyInformation.png';
import PermissionsIcon from '../ICON/SidebarICON/Permissions.png';
import HypothesisSettingIcon from '../ICON/SidebarICON/HypothesisSetting.png';
import EmployeeInformationIcon from '../ICON/SidebarICON/EmployeeInformation.png';
import UploadAnnouncementIcon from '../ICON/SidebarICON/UploadAnnouncement.png';
import ShiftScheduleIcon from '../ICON/SidebarICON/ShiftSchedule.png';
import ApprovingIcon from '../ICON/SidebarICON/Approving.png';

const Permissions = () => {
  const { hasValidAuth, logout } = useAuth();

  // 狀態定義
  const [activeTab, setActiveTab] = useState('全部部門');
  const [currentPage, setCurrentPage] = useState('permissions');
  const [activeButton, setActiveButton] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [selectedEmployeeForRevise, setSelectedEmployeeForRevise] = useState(null);

  // 權限相關狀態
  const [permissions, setPermissions] = useState(null);
  const [hasViewPermission, setHasViewPermission] = useState(true);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // 資料狀態
  const [departments, setDepartments] = useState([{ id: 0, name: '全部部門' }]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [authorizedEmployees, setAuthorizedEmployees] = useState([]);
  const [authorizedLoading, setAuthorizedLoading] = useState(false);
  const [authorizedError, setAuthorizedError] = useState(null);

  // 🔥 全域 company_id 檢查
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    
    const companyId = Cookies.get('company_id');
    if (!companyId) {
      console.error('❌ 無法獲取 company_id，可能需要重新登入');
      alert('無法獲取公司資訊，請重新登入');
      logout();
      return;
    }
    
    console.log('✅ Token 驗證通過');
    console.log('✅ 當前 company_id:', companyId);
  }, [hasValidAuth, logout]);

  // 🔥 修改：檢查員工權限的函數
  const checkEmployeePermissions = async () => {
    try {
      const companyId = Cookies.get('company_id');
      const employeeId = Cookies.get('employee_id');
      
      console.log('🔍 檢查權限開始');
      console.log('🔍 公司ID:', companyId);
      console.log('🔍 員工ID:', employeeId);
      
      if (!companyId || !employeeId) {
        return {
          success: false,
          message: '無法獲取公司ID或員工ID',
          hasViewPermission: false,
          hasEditPermission: false
        };
      }
      
      const response = await axios.get(
        `${API_BASE_URL}/api/company/employee-permissions/${employeeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-company-id': companyId
          },
          params: {
            company_id: companyId
          },
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );
      
      if (response.data && response.data.Status === 'Ok') {
        const rawData = response.data.Data?.raw_data;
        const setPermissionsValue = rawData?.set_permissions;
        
        const hasEditPermission = setPermissionsValue === 1 || setPermissionsValue === '1';
        const hasViewPermission = true;
        
        return {
          success: true,
          permissions: rawData,
          hasViewPermission: hasViewPermission,
          hasEditPermission: hasEditPermission
        };
      } else {
        return {
          success: true,
          message: response.data?.Msg || '權限檢查失敗',
          hasViewPermission: true,
          hasEditPermission: false
        };
      }
    } catch (error) {
      console.error('❌ 權限檢查 API 錯誤:', error);
      return {
        success: true,
        message: error.message || '權限檢查失敗',
        hasViewPermission: true,
        hasEditPermission: false
      };
    }
  };

  // 檢查權限
  useEffect(() => {
    const loadPermissions = async () => {
      setPermissionLoading(true);
      setPermissionError('');
      
      try {
        const result = await checkEmployeePermissions();
        
        if (result.success) {
          setPermissions(result.permissions);
          setHasViewPermission(result.hasViewPermission);
          setHasEditPermission(result.hasEditPermission);
          console.log('✅ 權限檢查成功:', {
            查看權限: result.hasViewPermission ? '有權限' : '無權限',
            編輯權限: result.hasEditPermission ? '有權限' : '無權限'
          });
        } else {
          setPermissionError(result.message);
          setHasViewPermission(false);
          setHasEditPermission(false);
          console.error('❌ 權限檢查失敗:', result.message);
        }
      } catch (error) {
        setPermissionError('權限檢查發生錯誤');
        setHasViewPermission(true);
        setHasEditPermission(false);
        console.error('❌ 權限檢查異常:', error);
      } finally {
        setPermissionLoading(false);
      }
    };

    loadPermissions();
  }, []);

  // 權限圖示映射
  const permissionIcons = {
    company_data: {
      icon: CompanyInformationIcon,
      name: '公司資料',
      color: '#4285F4'
    },
    set_permissions: {
      icon: PermissionsIcon,
      name: '設定權限',
      color: '#34A853'
    },
    leave_settings: {
      icon: HypothesisSettingIcon,
      name: '假別設定',
      color: '#FBBC05'
    },
    employee_data: {
      icon: EmployeeInformationIcon,
      name: '員工資料',
      color: '#EA4335'
    },
    upload_announcement: {
      icon: UploadAnnouncementIcon,
      name: '上傳公告',
      color: '#9C27B0'
    },
    schedule_table: {
      icon: ShiftScheduleIcon,
      name: '排班表',
      color: '#FF9800'
    },
    supervisor_approval: {
      icon: ApprovingIcon,
      name: '主管審核',
      color: '#795548'
    }
  };

  // 處理員工卡片點擊
  const handleEmployeeCardClick = useCallback((employee) => {
    if (expandedEmployeeId === employee.id) {
      setExpandedEmployeeId(null);
    } else {
      setExpandedEmployeeId(employee.id);
    }
  }, [expandedEmployeeId]);

  // 處理編輯權限
  const handleEditPermissions = useCallback((employee) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改員工權限設定');
      return;
    }
    
    setSelectedEmployeeForRevise(employee);
    setShowReviseModal(true);
  }, [hasEditPermission]);

  // 🔥 修改：獲取部門資料 - 移除寫死的 company_id
  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      setDepartmentsError(null);
      
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        setDepartmentsError('無法獲取公司資訊');
        return;
      }
      
      console.log('🔍 獲取部門 - 使用 company_id:', companyId);
      
      const response = await axios.get(`${API_BASE_URL}/api/departments?company_id=${companyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

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
      }
    } catch (err) {
      console.error('獲取部門資料失敗:', err);
      setDepartmentsError('無法連接到伺服器，請稍後再試');
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // 🔥 修改：獲取員工資料 - 移除寫死的 company_id
  const fetchEmployees = async (department = '全部部門') => {
    try {
      setLoading(true);
      setError(null);
      
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        setError('無法獲取公司資訊');
        return;
      }
      
      console.log('🔍 獲取員工 - 使用 company_id:', companyId);
      
      const requestData = {
        company_id: companyId
      };
      
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

  // 🔥 修改：獲取已授權員工資料 - 移除寫死的 company_id
  const fetchAuthorizedEmployees = async () => {
    try {
      setAuthorizedLoading(true);
      setAuthorizedError(null);
      
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        setAuthorizedError('無法獲取公司資訊');
        return;
      }
      
      console.log('🔍 獲取已授權員工 - 使用 company_id:', companyId);
      
      const [permissionsResponse, employeesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/company/employee-permissions?company_id=${companyId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }),
        axios.post(`${API_BASE_URL}/api/employees`, {
          company_id: companyId
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      ]);

      if (permissionsResponse.data.Status === 'Ok') {
        const allPermissionsData = permissionsResponse.data.Data?.permissions || [];
        const employeesData = employeesResponse.data.Status === 'Ok' ? 
          (employeesResponse.data.Data || []) : [];
        
        console.log('🔍 開始處理資料匹配...');
        
        const permissionsData = allPermissionsData.filter(emp => emp.permissions === 1);
        console.log('🔍 有權限的員工數量:', permissionsData.length);
        
        const formattedAuthorizedEmployees = permissionsData.map(emp => {
          console.log(`\n=== 處理員工: ${emp.name} ===`);
          console.log('🔍 權限資料 employee_id:', emp.employee_id, '(類型:', typeof emp.employee_id, ')');
          
          const employeeDetail = employeesData.find(e => {
            console.log(`  檢查員工:`, {
              name: e.name,
              employee_id: e.employee_id,
              employee_id_type: typeof e.employee_id
            });
            
            const match1 = e.employee_id === emp.employee_id;
            const match2 = e.employee_id === String(emp.employee_id);
            const match3 = String(e.employee_id) === String(emp.employee_id);
            const match4 = e.employee_id === parseInt(emp.employee_id);
            const match5 = e.name === emp.name;
            
            console.log(`  匹配結果:`, {
              'e.employee_id === emp.employee_id': match1,
              'e.employee_id === String(emp.employee_id)': match2,
              'String(e.employee_id) === String(emp.employee_id)': match3,
              'e.employee_id === parseInt(emp.employee_id)': match4,
              'e.name === emp.name': match5
            });
            
            return match1 || match2 || match3 || match4 || match5;
          });

          console.log(`  最終匹配結果:`, employeeDetail ? '✅ 成功' : '❌ 失敗');
          if (employeeDetail) {
            console.log('  匹配到的員工資料:', {
              name: employeeDetail.name,
              department: employeeDetail.department,
              job_grade: employeeDetail.job_grade
            });
          }

          return {
            id: emp.id,
            name: emp.name,
            employeeId: emp.employee_id,
            employee_id: emp.employee_id,
            department: employeeDetail?.department || '未知部門',
            position: employeeDetail?.job_grade === 'hr' ? '主管' : 
                     employeeDetail?.job_grade === 'staff' ? '員工' : '未設定',
            starred: true,
            permissions: emp.permissions === 1 ? ['全部權限'] : [],
            permissionDetails: {
              permissions: emp.permissions,
              company_data: emp.company_data,
              set_permissions: emp.set_permissions,
              leave_settings: emp.leave_settings,
              employee_data: emp.employee_data,
              upload_announcement: emp.upload_announcement,
              schedule_table: emp.schedule_table,
              ad_push: emp.ad_push,
              supervisor_approval: emp.supervisor_approval
            },
            employeeDetails: employeeDetail
          };
        });
        
        console.log('🔍 最終格式化的已授權員工數量:', formattedAuthorizedEmployees.length);
        console.log('🔍 最終格式化的已授權員工:', formattedAuthorizedEmployees);
        
        setAuthorizedEmployees(formattedAuthorizedEmployees);
      } else {
        setAuthorizedError(permissionsResponse.data.Msg || '獲取已授權員工資料失敗');
        setAuthorizedEmployees([]);
      }
    } catch (err) {
      console.error('❌ 獲取已授權員工資料失敗:', err);
      setAuthorizedError('無法連接到伺服器，請稍後再試');
      setAuthorizedEmployees([]);
    } finally {
      setAuthorizedLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    fetchDepartments();
    fetchEmployees('全部部門');
    fetchAuthorizedEmployees();
  }, []);

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

  // 員工卡片組件
  const EmployeeCard = ({ employee }) => {
    const isSelected = selectedEmployees.find(emp => emp.employee_id === employee.employee_id);
    
    return (
      <button 
        className={`permissions-employee-card ${isSelected ? 'permissions-employee-card-selected' : ''} ${!hasEditPermission ? 'permissions-employee-card-disabled' : ''}`}
        onClick={() => hasEditPermission ? handleEmployeeClick(employee) : null}
        disabled={!hasEditPermission}
        style={{
          cursor: hasEditPermission ? 'pointer' : 'not-allowed',
          opacity: hasEditPermission ? 1 : 0.7
        }}
      >
        <div className="permissions-employee-card-content">
          <div className="permissions-employee-card-avatar">
            {employee.avatar_url ? (
              <img 
                src={employee.avatar_url} 
                alt={employee.name}
                className="permissions-employee-card-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <img 
                src={PortraitImage} 
                alt={`${employee.name}的大頭貼`}
                className="permissions-employee-card-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            )}
            <div className="permissions-employee-card-fallback" style={{display: employee.avatar_url || PortraitImage ? 'none' : 'flex'}}>
              👤
            </div>
          </div>
          
          <div className="permissions-employee-card-main-info">
            <div className="permissions-employee-card-avatar-info">
              <div className="permissions-employee-card-name">{employee.name}</div>
              <div className="permissions-employee-card-department">{employee.department}</div>
            </div>
            
            <div className="permissions-employee-card-department-position">
              <div className="permissions-employee-card-id">{employee.employee_id}</div>
              <div className="permissions-employee-card-position">
                {employee.position || (employee.job_grade === 'hr' ? '主管' : employee.job_grade === 'staff' ? '員工' : '未設定')}
              </div>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="permissions-employee-card-selected-indicator">
            ✓
          </div>
        )}
      </button>
    );
  };

  // 職級區塊組件
  const JobGradeSection = ({ jobGrade, employees }) => (
    <div className="permissions-position-section">
      <div className="permissions-position-section-header">
        <h3 className="permissions-position-section-title">
          {jobGrade}
        </h3>
      </div>
      
      <div className="permissions-position-section-grid">
        {employees.map((employee) => (
          <EmployeeCard 
            key={employee.employee_id} 
            employee={employee}
          />
        ))}
      </div>
    </div>
  );

  // 過濾員工資料
  const filteredEmployees = employees.filter(employee => 
    employee.name.includes(searchQuery) || 
    employee.employee_id.toString().includes(searchQuery) ||
    (employee.position && employee.position.includes(searchQuery))
  );

  // 處理部門切換
  const handleDepartmentChange = useCallback((departmentName) => {
    setActiveTab(departmentName);
    setSelectedEmployees([]);
    fetchEmployees(departmentName);
  }, []);

  // 處理員工選擇
  const handleEmployeeClick = useCallback((employee) => {
    if (!hasEditPermission) return;
    
    setSelectedEmployees(prev => {
      const isSelected = prev.find(emp => emp.employee_id === employee.employee_id);
      if (isSelected) {
        return prev.filter(emp => emp.employee_id !== employee.employee_id);
      } else {
        return [...prev, employee];
      }
    });
  }, [hasEditPermission]);

  // 清除選擇
  const clearSelection = useCallback(() => {
    if (!hasEditPermission) return;
    setSelectedEmployees([]);
  }, [hasEditPermission]);

  // 處理搜尋
  const handleSearch = useCallback(() => {
    console.log('執行搜尋:', searchQuery);
  }, [searchQuery]);

  // 處理 Sidebar 項目點擊
  const handleSidebarClick = useCallback((item) => {
    setCurrentPage(item.id);
    return true;
  }, []);

  // 處理登出
  const handleLogout = useCallback(() => {
    if (window.confirm('確定要登出嗎？')) {
      logout();
    }
  }, [logout]);

  // 處理下一步
  const handleNextStep = useCallback(() => {
    if (!hasEditPermission) {
      alert('您沒有權限設定員工權限');
      return;
    }
    
    if (selectedEmployees.length === 0) {
      alert('請先選擇要設定權限的員工');
      return;
    }
    setShowPermissionsModal(true);
  }, [selectedEmployees, hasEditPermission]);

  // 處理權限設定確認
  const handlePermissionsConfirm = useCallback((employeePermissions) => {
    if (!hasEditPermission) {
      alert('您沒有權限設定員工權限');
      return;
    }
    
    setShowPermissionsModal(false);
    setSelectedEmployees([]);
    
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }, [hasEditPermission]);

  // 處理修改權限確認
  const handleRevisePermissionsConfirm = useCallback(() => {
    if (!hasEditPermission) {
      alert('您沒有權限修改員工權限');
      return;
    }
    
    setShowReviseModal(false);
    setSelectedEmployeeForRevise(null);
    setExpandedEmployeeId(null);
    
    fetchAuthorizedEmployees();
  }, [hasEditPermission]);

  // 處理返回
  const handleBack = useCallback(() => {
    console.log('返回上一頁');
  }, []);

  // 處理按鈕點擊
  const handleButtonClick = useCallback((buttonIndex) => {
    setActiveButton(buttonIndex);
    if (selectedEmployees.length > 0) {
      setSelectedEmployees([]);
    }
  }, [selectedEmployees]);

  // 權限載入中顯示
  if (permissionLoading) {
    return (
      <div className="permissions-management-page">
        <Sidebar 
          currentPage={currentPage}
          onItemClick={handleSidebarClick}
          onLogout={handleLogout}
        />
        
        <div className="permissions-main-content">
          <div className="permissions-main-content-inner">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '400px',
              color: '#666'
            }}>
              檢查權限中...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 權限錯誤顯示
  if (permissionError) {
    return (
      <div className="permissions-management-page">
        <Sidebar 
          currentPage={currentPage}
          onItemClick={handleSidebarClick}
          onLogout={handleLogout}
        />
        
        <div className="permissions-main-content">
          <div className="permissions-main-content-inner">
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '20px',
              borderRadius: '4px',
              margin: '20px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <strong>權限警告：</strong>{permissionError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染內容
  const renderContent = () => {
    if (loading) {
      return (
        <div className="permissions-loading-container">
          <div className="permissions-loading-content">
            <div className="permissions-loading-spinner"></div>
            載入中...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="permissions-error-container">
          <p>{error}</p>
          <button 
            onClick={() => fetchEmployees(activeTab)}
            className="permissions-error-retry-button"
          >
            重新載入
          </button>
        </div>
      );
    }

    if (activeButton === 0) {
      return (
        <>
          <div className="permissions-departments-container">
            {departmentsLoading ? (
              <div className="permissions-departments-loading">
                <div className="permissions-loading-spinner"></div>
                載入部門中...
              </div>
            ) : departmentsError ? (
              <div className="permissions-departments-error">
                <p>{departmentsError}</p>
                <button 
                  onClick={fetchDepartments}
                  className="permissions-error-retry-button"
                >
                  重新載入部門
                </button>
              </div>
            ) : (
              <>
                {departments.map(department => (
                  <div 
                    key={department.id} 
                    className={`permissions-department-tab ${activeTab === department.name ? 'permissions-department-tab-active' : ''}`}
                    onClick={() => handleDepartmentChange(department.name)}
                  >
                    <span className="permissions-department-icon">🏢</span>
                    {department.name}
                  </div>
                ))}
              </>
            )}
          </div>

          {employees.length === 0 ? (
            <div className="permissions-no-employees-container">
              <p>目前{activeTab === '全部部門' ? '' : ` ${activeTab} 部門`}沒有員工資料</p>
            </div>
          ) : (
            <>
              {(() => {
                const jobGradeGroups = groupEmployeesByJobGrade(employees);
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
      const jobGradeGroups = groupEmployeesByJobGrade(filteredEmployees);
      
      return (
        <>
          <div className="permissions-search-input-container">
            <input
              type="text"
              placeholder="輸入員工姓名/員工編號"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="permissions-search-input"
            />
            <button 
              className="permissions-search-button"
              onClick={handleSearch}
            >
              <svg className="permissions-search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
          
          {searchQuery && (
            <>
              {filteredEmployees.length === 0 ? (
                <div className="permissions-no-employees-container">
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
  };

  // 渲染右側邊欄已授權員工列表
  const renderAuthorizedEmployees = () => {
    if (authorizedLoading) {
      return (
        <div className="permissions-authorized-employees">
          <div className="permissions-loading-container" style={{ height: '100px' }}>
            <div className="permissions-loading-content">
              <div className="permissions-loading-spinner"></div>
              載入中...
            </div>
          </div>
        </div>
      );
    }

    if (authorizedError) {
      return (
        <div className="permissions-authorized-employees">
          <div className="permissions-error-container" style={{ margin: '10px 0' }}>
            <p style={{ fontSize: '12px' }}>{authorizedError}</p>
            <button 
              onClick={fetchAuthorizedEmployees}
              className="permissions-error-retry-button"
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              重試
            </button>
          </div>
        </div>
      );
    }

    if (authorizedEmployees.length === 0) {
      return (
        <div className="permissions-authorized-employees">
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '20px', 
            fontSize: '14px' 
          }}>
            目前沒有已授權的員工
          </div>
        </div>
      );
    }

    return (
      <div className="permissions-authorized-employees">
        {authorizedEmployees.map((employee) => {
          const isExpanded = expandedEmployeeId === employee.id;
          const permissions = employee.permissionDetails;
          
          return (
            <div 
              key={employee.id} 
              className={`permissions-employee-permission-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div 
                className="permissions-employee-row"
                onClick={() => handleEmployeeCardClick(employee)}
                style={{ cursor: 'pointer' }}
              >
                <div className="permissions-employee-info-container">
                  <div className="permissions-employee-left-section">
                    <div className="permissions-star-icon">
                      <svg viewBox="0 0 16 16">
                        <path d="M8 1L10.09 5.26L15 6L11.5 9.74L12.18 15L8 12.77L3.82 15L4.5 9.74L1 6L5.91 5.26L8 1Z"/>
                      </svg>
                    </div>
                    
                    <div className="permissions-user-avatar">
                      {employee.avatar_url ? (
                        <img 
                          src={employee.avatar_url} 
                          alt={employee.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
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
                            borderRadius: '50%'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      )}
                      <svg 
                        viewBox="0 0 24 24" 
                        style={{
                          display: employee.avatar_url || PortraitImage ? 'none' : 'flex',
                          width: '24px',
                          height: '24px',
                          fill: '#FFFFFF'
                        }}
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    
                    <div className="permissions-employee-text-info">
                      <div className="permissions-employee-name">{employee.name}</div>
                      <div className="permissions-employee-id">{employee.employeeId}</div>
                    </div>
                  </div>
                  
                  <div className="permissions-employee-department">
                    {employee.department}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="permissions-employee-permissions-icons">
                  <div className="permissions-icons-grid">
                    {Object.entries(permissionIcons).map(([key, iconInfo]) => {
                      const hasPermission = permissions[key] === 1;
                      return (
                        <div 
                          key={key} 
                          className="permissions-icon-item"
                          style={{ 
                            opacity: hasPermission ? 1 : 0.3,
                            filter: hasPermission ? 'none' : 'grayscale(100%)'
                          }}
                        >
                          <div 
                            style={{
                              width: '50px',
                              height: '50px',
                              marginBottom: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img 
                              src={iconInfo.icon} 
                              alt={iconInfo.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                filter: hasPermission ? 'none' : 'grayscale(100%)'
                              }}
                            />
                          </div>
                          <span style={{ 
                            color: hasPermission ? '#333' : '#ccc',
                            fontSize: '12px',
                            textAlign: 'center'
                          }}>
                            {iconInfo.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button 
                    className="permissions-edit-permissions-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPermissions(employee);
                    }}
                    disabled={!hasEditPermission}
                    style={{
                      opacity: hasEditPermission ? 1 : 0.5,
                      cursor: hasEditPermission ? 'pointer' : 'not-allowed'
                    }}
                  >
                    編輯權限
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="permissions-management-page">
      <Sidebar 
        currentPage={currentPage}
        onItemClick={handleSidebarClick}
        onLogout={handleLogout}
      />
      
      <div className="permissions-main-content">
        <div className="permissions-main-content-inner">
          <div className="permissions-breadcrumb">
          </div>

          <h1 className="permissions-page-title">設定權限</h1>

          <div className="permissions-button-group-container">
            <div className="permissions-query-method-container">
              <button 
                className={`permissions-query-button ${activeButton === 0 ? 'permissions-query-button-active' : ''}`}
                onClick={() => handleButtonClick(0)}
              >
                <span className={`permissions-query-button-text ${activeButton === 0 ? 'permissions-query-button-text-active' : ''}`}>
                  選擇部門
                </span>
              </button>
              <button 
                className={`permissions-query-button ${activeButton === 1 ? 'permissions-query-button-active' : ''}`}
                onClick={() => handleButtonClick(1)}
              >
                <span className={`permissions-query-button-text ${activeButton === 1 ? 'permissions-query-button-text-active' : ''}`}>
                  搜尋員工
                </span>
              </button>
            </div>
          </div>

          <div className="permissions-content-area">
            {renderContent()}

            {selectedEmployees.length > 0 && hasEditPermission && (
              <div className="permissions-selected-panel">
                <div className="permissions-selected-panel-content">
                  <div className="permissions-selected-employees-section">
                    <h3 className="permissions-selected-title">目前已選取員工</h3>
                    
                    <div className="permissions-selected-employees-container">
                      <div className="permissions-selected-employees-grid">
                        {selectedEmployees.map((employee) => (
                          <div key={employee.employee_id} className="permissions-selected-employee-card">
                            <div className="permissions-selected-employee-card-content">
                              <div className="permissions-selected-employee-avatar">
                                {employee.avatar_url ? (
                                  <img 
                                    src={employee.avatar_url} 
                                    alt={employee.name}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : (
                                  <img 
                                    src={PortraitImage} 
                                    alt={`${employee.name}的大頭貼`}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                )}
                                <div className="permissions-selected-employee-avatar-fallback" style={{display: employee.avatar_url || PortraitImage ? 'none' : 'flex'}}>
                                  👤
                                </div>
                              </div>
                              
                              <div className="permissions-selected-employee-main-info">
                                <div className="permissions-selected-employee-name-department">
                                  <div className="permissions-selected-employee-name">{employee.name}</div>
                                  <div className="permissions-selected-employee-department">{employee.department}</div>
                                </div>
                                
                                <div className="permissions-selected-employee-id-position">
                                  <div className="permissions-selected-employee-id">{employee.employee_id}</div>
                                  <div className="permissions-selected-employee-position">
                                    {employee.position || (employee.job_grade === 'hr' ? '主管' : employee.job_grade === 'staff' ? '員工' : '未設定')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="permissions-selected-actions">
                    <button className="permissions-clear-button" onClick={clearSelection}>
                      清除重選
                    </button>
                    <button className="permissions-next-button" onClick={handleNextStep}>
                      <span className="permissions-next-button-main-text">下一步</span>
                      <span className="permissions-next-button-sub-text">選擇開通權限</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {hasEditPermission && (
          <AddEmployeePermissions
            isOpen={showPermissionsModal}
            onClose={() => setShowPermissionsModal(false)}
            selectedEmployees={selectedEmployees}
            onConfirm={handlePermissionsConfirm}
          />
        )}

        {hasEditPermission && (
          <RevisePermissions
            isOpen={showReviseModal}
            onClose={() => {
              setShowReviseModal(false);
              setSelectedEmployeeForRevise(null);
            }}
            employee={selectedEmployeeForRevise}
            onConfirm={handleRevisePermissionsConfirm}
          />
        )}

        <div className="permissions-right-sidebar">
          <div className="permissions-sidebar-spacer"></div>
          
          <div className="permissions-sidebar-main">
            <div className="permissions-sidebar-content">
              <h2 className="permissions-sidebar-title">已開通權限</h2>
              
              {renderAuthorizedEmployees()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
