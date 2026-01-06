// import React, { useState, useEffect } from 'react';
// import './AddEmployeePermissions.css';
// import { API_BASE_URL } from '../../../config'; // 引入配置
// import EditingComplete from '../dialog box/Editing complete'; // 🔥 新增引入

// // 導入圖示
// import CompanyInformationIcon from '../../ICON/SidebarICON/CompanyInformation.png';
// import PermissionsIcon from '../../ICON/SidebarICON/Permissions.png';
// import HypothesisSettingIcon from '../../ICON/SidebarICON/HypothesisSetting.png';
// import EmployeeInformationIcon from '../../ICON/SidebarICON/EmployeeInformation.png';
// import UploadAnnouncementIcon from '../../ICON/SidebarICON/UploadAnnouncement.png';
// import ShiftScheduleIcon from '../../ICON/SidebarICON/ShiftSchedule.png';
// import AdvertisingPushIcon from '../../ICON/SidebarICON/Advertising_push.png';
// import ApprovingIcon from '../../ICON/SidebarICON/Approving.png';

// const AddEmployeePermissions = ({ 
//   isOpen, 
//   onClose, 
//   selectedEmployees = [], 
//   onConfirm 
// }) => {
//   const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);
//   const [permissions, setPermissions] = useState({
//     company_data: false,
//     set_permissions: false,
//     leave_settings: false,
//     employee_data: false,
//     upload_announcement: false,
//     schedule_table: false,
//     ad_push: false,
//     supervisor_approval: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showEditingComplete, setShowEditingComplete] = useState(false); // 🔥 新增狀態

//   // 權限選項配置
//   const permissionOptions = [
//     {
//       key: 'company_data',
//       name: '公司資料',
//       icon: CompanyInformationIcon,
//       category: 'backend'
//     },
//     {
//       key: 'set_permissions',
//       name: '設定權限',
//       icon: PermissionsIcon,
//       category: 'backend'
//     },
//     {
//       key: 'leave_settings',
//       name: '假別設定',
//       icon: HypothesisSettingIcon,
//       category: 'backend'
//     },
//     {
//       key: 'employee_data',
//       name: '員工資料',
//       icon: EmployeeInformationIcon,
//       category: 'backend'
//     },
//     {
//       key: 'upload_announcement',
//       name: '上傳公告',
//       icon: UploadAnnouncementIcon,
//       category: 'backend'
//     },
//     {
//       key: 'schedule_table',
//       name: '排班表',
//       icon: ShiftScheduleIcon,
//       category: 'backend'
//     },
//     {
//       key: 'ad_push',
//       name: '廣告推播',
//       icon: AdvertisingPushIcon,
//       category: 'backend'
//     },
//     {
//       key: 'supervisor_approval',
//       name: '主管審核',
//       icon: ApprovingIcon,
//       category: 'app'
//     }
//   ];

//   const currentEmployee = selectedEmployees[currentEmployeeIndex];

//   // 調試：檢查員工資料結構
//   useEffect(() => {
//     if (currentEmployee) {
//       console.log('=== 當前員工資料結構 ===');
//       console.log('完整員工物件:', currentEmployee);
//       console.log('可能的ID欄位:');
//       console.log('- id:', currentEmployee.id);
//       console.log('- employee_id:', currentEmployee.employee_id);
//       console.log('- emp_id:', currentEmployee.emp_id);
//       console.log('- user_id:', currentEmployee.user_id);
//       console.log('所有欄位:', Object.keys(currentEmployee));
//     }
//   }, [currentEmployee]);

//   // 重置權限狀態
//   useEffect(() => {
//     if (isOpen && currentEmployee) {
//       setPermissions({
//         company_data: false,
//         set_permissions: false,
//         leave_settings: false,
//         employee_data: false,
//         upload_announcement: false,
//         schedule_table: false,
//         ad_push: false,
//         supervisor_approval: false
//       });
//     }
//   }, [isOpen, currentEmployeeIndex, currentEmployee]);

//   // 處理權限勾選
//   const handlePermissionChange = (permissionKey) => {
//     setPermissions(prev => ({
//       ...prev,
//       [permissionKey]: !prev[permissionKey]
//     }));
//   };

//   // 創建員工權限記錄的 API
//   const createEmployeePermissions = async (employeeId) => {
//     try {
//       console.log('嘗試創建員工權限記錄:', employeeId);
      
//       const response = await fetch(`${API_BASE_URL}/api/company/employee-permissions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           employee_id: employeeId,
//           name: currentEmployee.name || '未知員工',
//           // 初始化所有權限為 0
//           company_data: 0,
//           set_permissions: 0,
//           leave_settings: 0,
//           employee_data: 0,
//           upload_announcement: 0,
//           schedule_table: 0,
//           ad_push: 0,
//           supervisor_approval: 0
//         })
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.Msg || `HTTP error! status: ${response.status}`);
//       }

//       return { success: true, data: result };
      
//     } catch (error) {
//       console.error('創建員工權限記錄錯誤:', error);
//       return { 
//         success: false, 
//         error: error.message || '創建權限記錄失敗' 
//       };
//     }
//   };

//   const updateEmployeePermissions = async (employee, permissionsData) => {
//     try {
//       setIsLoading(true);
      
//       const employeeId = employee.employee_id || employee.id || employee.emp_id || employee.user_id;
      
//       if (!employeeId) {
//         throw new Error('員工ID不存在，請檢查員工資料');
//       }
      
//       const formattedPermissions = {};
//       Object.keys(permissionsData).forEach(key => {
//         formattedPermissions[key] = permissionsData[key] ? 1 : 0;
//       });

//       // 🔧 修正 URL - 使用配置檔案中的 API_BASE_URL
//       const response = await fetch(`${API_BASE_URL}/api/company/employee-permissions/${employeeId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-company-id': '76014406'
//         },
//         credentials: 'include',
//         body: JSON.stringify(formattedPermissions)
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.Msg || `HTTP error! status: ${response.status}`);
//       }

//       if (result.Status === "Ok") {
//         console.log('權限更新成功:', result);
//         return { success: true, data: result };
//       } else {
//         throw new Error(result.Msg || '更新失敗');
//       }

//     } catch (error) {
//       console.error('更新員工權限錯誤:', error);
//       return { 
//         success: false, 
//         error: error.message || '網路錯誤，請稍後再試' 
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🔥 修改：處理確認 - 顯示對話框
//   const handleConfirm = async () => {
//     if (!currentEmployee) return;

//     // 檢查是否有選擇任何權限
//     const hasSelectedPermissions = Object.values(permissions).some(value => value === true);
    
//     if (!hasSelectedPermissions) {
//       alert('請至少選擇一個權限');
//       return;
//     }

//     // 🔥 顯示確認對話框而不是直接執行
//     setShowEditingComplete(true);
//   };

//   // 🔥 新增：處理確認對話框的確認
//   const handleEditingCompleteConfirm = async () => {
//     try {
//       // 檢查員工物件
//       console.log('當前員工資料:', currentEmployee);

//       // 🔥 重要修改：當有選擇權限時，同時設定 permissions 為 1
//       const permissionsToUpdate = {
//         ...permissions,
//         permissions: 1  // 🔥 強制設定 permissions 為 1
//       };

//       console.log('即將更新的權限資料:', permissionsToUpdate);

//       // 調用 API 更新當前員工權限
//       const result = await updateEmployeePermissions(currentEmployee, permissionsToUpdate);
      
//       if (!result.success) {
//         alert(`更新 ${currentEmployee.name} 的權限失敗：${result.error}`);
//         return;
//       }

//       // 顯示成功訊息
//       alert(`${currentEmployee.name} 的權限已成功更新！`);

//       const employeePermissions = {
//         employee: currentEmployee,
//         permissions: permissionsToUpdate,  // 🔥 使用更新後的權限資料
//         result: result.data
//       };

//       // 如果還有下一個員工，繼續設定
//       if (currentEmployeeIndex < selectedEmployees.length - 1) {
//         setCurrentEmployeeIndex(prev => prev + 1);
//         console.log('已完成員工權限設定:', employeePermissions);
//       } else {
//         // 🔥 所有員工都設定完成 - 刷新頁面
//         alert('所有員工權限設定完成！');
        
//         // 🔥 通知父組件並刷新頁面
//         onConfirm && onConfirm(employeePermissions);
        
//         // 🔥 延遲一下讓 alert 顯示完畢，然後刷新頁面
//         setTimeout(() => {
//           window.location.reload();
//         }, 100);
//       }

//     } catch (error) {
//       console.error('處理確認時發生錯誤:', error);
//       alert('操作失敗，請稍後再試');
//     }
//   };

//   // 🔥 新增：處理確認對話框的取消
//   const handleEditingCompleteCancel = () => {
//     setShowEditingComplete(false);
//   };

//   // 處理取消
//   const handleCancel = () => {
//     if (isLoading) {
//       alert('正在處理中，請稍候...');
//       return;
//     }
//     handleClose();
//   };

//   // 關閉彈窗
//   const handleClose = () => {
//     if (isLoading) return;
    
//     setCurrentEmployeeIndex(0);
//     setPermissions({
//       company_data: false,
//       set_permissions: false,
//       leave_settings: false,
//       employee_data: false,
//       upload_announcement: false,
//       schedule_table: false,
//       ad_push: false,
//       supervisor_approval: false
//     });
//     onClose && onClose();
//   };

//   // 處理背景點擊
//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget && !isLoading) {
//       handleClose();
//     }
//   };

//   if (!isOpen || !currentEmployee) {
//     return null;
//   }

//   const backendPermissions = permissionOptions.filter(option => option.category === 'backend');
//   const appPermissions = permissionOptions.filter(option => option.category === 'app');

//   return (
//     <>
//       {/* 原有的 AddEmployeePermissions 內容 */}
//       <div className="add-employee-permissions-overlay" onClick={handleOverlayClick}>
//         <div className="add-employee-permissions-modal">
//           <div className="add-employee-permissions-content">
//             {/* 標題區域 */}
//             <div className="add-employee-permissions-header">
//               <div className="add-employee-permissions-title-container">
//                 <div className="add-employee-permissions-title">
//                   請選擇該員工開通之權限：
//                 </div>
//                 <div className="add-employee-permissions-counter">
//                   {currentEmployeeIndex + 1}/{selectedEmployees.length}
//                 </div>
//               </div>
//             </div>

//             {/* 主要內容 */}
//             <div className="add-employee-permissions-main-content">
//               <div className="add-employee-permissions-employee-section">
//                 {/* 員工姓名 */}
//                 <div className="add-employee-permissions-employee-info">
//                   <div className="add-employee-permissions-employee-label">
//                     員工姓名
//                   </div>
//                   <div className="add-employee-permissions-employee-name">
//                     {currentEmployee.name}
//                   </div>
//                 </div>

//                 {/* 部門職稱 */}
//                 <div className="add-employee-permissions-department-info">
//                   <div className="add-employee-permissions-department-label">
//                     部門職稱
//                   </div>
//                   <div className="add-employee-permissions-department-value">
//                     {currentEmployee.department} {currentEmployee.position || (currentEmployee.job_grade === 'hr' ? '主管' : '員工')}
//                   </div>
//                 </div>

//                 {/* 後台功能 */}
//                 <div className="add-employee-permissions-backend-section">
//                   <div className="add-employee-permissions-backend-title">
//                     後台功能
//                   </div>
//                   <div className="add-employee-permissions-backend-options">
//                     {backendPermissions.map((option) => (
//                       <div key={option.key} className="add-employee-permissions-option">
//                         <div 
//                           className="add-employee-permissions-option-row"
//                           onClick={() => !isLoading && handlePermissionChange(option.key)}
//                           style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
//                         >
//                           <div 
//                             className={`add-employee-permissions-checkbox ${
//                               permissions[option.key] 
//                                 ? 'add-employee-permissions-checkbox-checked' 
//                                 : 'add-employee-permissions-checkbox-unchecked'
//                             }`}
//                           />
//                           <div className="add-employee-permissions-option-content">
//                             <div className="add-employee-permissions-option-icon">
//                               <img 
//                                 src={option.icon} 
//                                 alt={option.name}
//                                 className="add-employee-permissions-icon-image"
//                               />
//                             </div>
//                             <div className="add-employee-permissions-option-text-container">
//                               <div className="add-employee-permissions-option-text">
//                                 {option.name}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* APP功能 */}
//                 <div className="add-employee-permissions-app-section">
//                   <div className="add-employee-permissions-app-title">
//                     APP 功能
//                   </div>
//                   {appPermissions.map((option) => (
//                     <div key={option.key} className="add-employee-permissions-option">
//                       <div 
//                         className="add-employee-permissions-option-row"
//                         onClick={() => !isLoading && handlePermissionChange(option.key)}
//                         style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
//                       >
//                         <div 
//                           className={`add-employee-permissions-checkbox ${
//                             permissions[option.key] 
//                               ? 'add-employee-permissions-checkbox-checked' 
//                               : 'add-employee-permissions-checkbox-unchecked'
//                           }`}
//                         />
//                         <div className="add-employee-permissions-option-content">
//                           <div className="add-employee-permissions-option-icon">
//                             <img 
//                               src={option.icon} 
//                               alt={option.name}
//                               className="add-employee-permissions-icon-image"
//                             />
//                           </div>
//                           <div className="add-employee-permissions-option-text-container">
//                             <div className="add-employee-permissions-option-text">
//                               {option.name}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* 按鈕組 */}
//             <div className="add-employee-permissions-button-group">
//               <button 
//                 className="add-employee-permissions-cancel-button"
//                 onClick={handleCancel}
//                 disabled={isLoading}
//                 style={{ 
//                   opacity: isLoading ? 0.6 : 1,
//                   cursor: isLoading ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 <span className="add-employee-permissions-cancel-text">取消</span>
//               </button>
              
//               <button 
//                 className="add-employee-permissions-confirm-button"
//                 onClick={handleConfirm}
//                 disabled={isLoading}
//                 style={{ 
//                   opacity: isLoading ? 0.6 : 1,
//                   cursor: isLoading ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 <span className="add-employee-permissions-confirm-main-text">
//                   {isLoading ? '處理中...' : '確定開通'}
//                 </span>
//                 <span className="add-employee-permissions-confirm-sub-text">
//                   {isLoading ? '請稍候' : '開通後將通知員工'}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🔥 新增：編輯完成確認對話框 */}
//       <EditingComplete
//         isOpen={showEditingComplete}
//         title="編輯權限"
//         message="請確認資料編輯完成無誤並傳送通知。"
//         cancelText="取消"
//         confirmText="確定"
//         onCancel={handleEditingCompleteCancel}
//         onConfirm={handleEditingCompleteConfirm}
//         onClose={() => setShowEditingComplete(false)}
//       />
//     </>
//   );
// };

// export default AddEmployeePermissions;
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // 🔥 新增引入
import './AddEmployeePermissions.css';
import { API_BASE_URL } from '../../../config';
import EditingComplete from '../dialog box/Editing complete';

// 導入圖示
import CompanyInformationIcon from '../../ICON/SidebarICON/CompanyInformation.png';
import PermissionsIcon from '../../ICON/SidebarICON/Permissions.png';
import HypothesisSettingIcon from '../../ICON/SidebarICON/HypothesisSetting.png';
import EmployeeInformationIcon from '../../ICON/SidebarICON/EmployeeInformation.png';
import UploadAnnouncementIcon from '../../ICON/SidebarICON/UploadAnnouncement.png';
import ShiftScheduleIcon from '../../ICON/SidebarICON/ShiftSchedule.png';
import AdvertisingPushIcon from '../../ICON/SidebarICON/Advertising_push.png';
import ApprovingIcon from '../../ICON/SidebarICON/Approving.png';

const AddEmployeePermissions = ({ 
  isOpen, 
  onClose, 
  selectedEmployees = [], 
  onConfirm 
}) => {
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);
  const [permissions, setPermissions] = useState({
    company_data: false,
    set_permissions: false,
    leave_settings: false,
    employee_data: false,
    upload_announcement: false,
    schedule_table: false,
    ad_push: false,
    supervisor_approval: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEditingComplete, setShowEditingComplete] = useState(false);

  // 權限選項配置
  const permissionOptions = [
    {
      key: 'company_data',
      name: '公司資料',
      icon: CompanyInformationIcon,
      category: 'backend'
    },
    {
      key: 'set_permissions',
      name: '設定權限',
      icon: PermissionsIcon,
      category: 'backend'
    },
    {
      key: 'leave_settings',
      name: '假別設定',
      icon: HypothesisSettingIcon,
      category: 'backend'
    },
    {
      key: 'employee_data',
      name: '員工資料',
      icon: EmployeeInformationIcon,
      category: 'backend'
    },
    {
      key: 'upload_announcement',
      name: '上傳公告',
      icon: UploadAnnouncementIcon,
      category: 'backend'
    },
    {
      key: 'schedule_table',
      name: '排班表',
      icon: ShiftScheduleIcon,
      category: 'backend'
    },
    {
      key: 'ad_push',
      name: '廣告推播',
      icon: AdvertisingPushIcon,
      category: 'backend'
    },
    {
      key: 'supervisor_approval',
      name: '主管審核',
      icon: ApprovingIcon,
      category: 'app'
    }
  ];

  const currentEmployee = selectedEmployees[currentEmployeeIndex];

  // 調試：檢查員工資料結構
  useEffect(() => {
    if (currentEmployee) {
      console.log('=== 當前員工資料結構 ===');
      console.log('完整員工物件:', currentEmployee);
      console.log('可能的ID欄位:');
      console.log('- id:', currentEmployee.id);
      console.log('- employee_id:', currentEmployee.employee_id);
      console.log('- emp_id:', currentEmployee.emp_id);
      console.log('- user_id:', currentEmployee.user_id);
      console.log('所有欄位:', Object.keys(currentEmployee));
    }
  }, [currentEmployee]);

  // 重置權限狀態
  useEffect(() => {
    if (isOpen && currentEmployee) {
      setPermissions({
        company_data: false,
        set_permissions: false,
        leave_settings: false,
        employee_data: false,
        upload_announcement: false,
        schedule_table: false,
        ad_push: false,
        supervisor_approval: false
      });
    }
  }, [isOpen, currentEmployeeIndex, currentEmployee]);

  // 處理權限勾選
  const handlePermissionChange = (permissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  // 🔥 修改：創建員工權限記錄的 API - 動態獲取 company_id
  const createEmployeePermissions = async (employeeId) => {
    try {
      console.log('嘗試創建員工權限記錄:', employeeId);

      // 🔥 動態獲取 company_id
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('無法獲取公司資訊');
      }

      console.log('🔍 創建權限記錄 - 使用 company_id:', companyId);
      
      const response = await fetch(`${API_BASE_URL}/api/company/employee-permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-company-id': companyId // 🔥 使用動態獲取的 company_id
        },
        credentials: 'include',
        body: JSON.stringify({
          company_id: companyId, // 🔥 加入 company_id 到請求體
          employee_id: employeeId,
          name: currentEmployee.name || '未知員工',
          // 初始化所有權限為 0
          company_data: 0,
          set_permissions: 0,
          leave_settings: 0,
          employee_data: 0,
          upload_announcement: 0,
          schedule_table: 0,
          ad_push: 0,
          supervisor_approval: 0
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.Msg || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data: result };
      
    } catch (error) {
      console.error('創建員工權限記錄錯誤:', error);
      return { 
        success: false, 
        error: error.message || '創建權限記錄失敗' 
      };
    }
  };

  // 🔥 修改：更新員工權限 - 動態獲取 company_id
  const updateEmployeePermissions = async (employee, permissionsData) => {
    try {
      setIsLoading(true);
      
      const employeeId = employee.employee_id || employee.id || employee.emp_id || employee.user_id;
      
      if (!employeeId) {
        throw new Error('員工ID不存在，請檢查員工資料');
      }

      // 🔥 動態獲取 company_id
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('無法獲取公司資訊');
      }

      console.log('🔍 更新權限 - 使用 company_id:', companyId);
      console.log('🔍 更新權限 - 使用 employee_id:', employeeId);
      
      const formattedPermissions = {
        company_id: companyId // 🔥 加入 company_id 到請求體
      };
      
      Object.keys(permissionsData).forEach(key => {
        formattedPermissions[key] = permissionsData[key] ? 1 : 0;
      });

      console.log('🔍 發送權限更新請求:', formattedPermissions);

      const response = await fetch(`${API_BASE_URL}/api/company/employee-permissions/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-company-id': companyId // 🔥 使用動態獲取的 company_id
        },
        credentials: 'include',
        body: JSON.stringify(formattedPermissions)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.Msg || `HTTP error! status: ${response.status}`);
      }

      if (result.Status === "Ok") {
        console.log('權限更新成功:', result);
        return { success: true, data: result };
      } else {
        throw new Error(result.Msg || '更新失敗');
      }

    } catch (error) {
      console.error('更新員工權限錯誤:', error);
      return { 
        success: false, 
        error: error.message || '網路錯誤，請稍後再試' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 處理確認
  const handleConfirm = async () => {
    if (!currentEmployee) return;

    // 檢查是否有選擇任何權限
    const hasSelectedPermissions = Object.values(permissions).some(value => value === true);
    
    if (!hasSelectedPermissions) {
      alert('請至少選擇一個權限');
      return;
    }

    // 顯示確認對話框
    setShowEditingComplete(true);
  };

  // 處理確認對話框的確認
  const handleEditingCompleteConfirm = async () => {
    try {
      // 檢查員工物件
      console.log('當前員工資料:', currentEmployee);

      // 重要修改：當有選擇權限時，同時設定 permissions 為 1
      const permissionsToUpdate = {
        ...permissions,
        permissions: 1  // 強制設定 permissions 為 1
      };

      console.log('即將更新的權限資料:', permissionsToUpdate);

      // 調用 API 更新當前員工權限
      const result = await updateEmployeePermissions(currentEmployee, permissionsToUpdate);
      
      if (!result.success) {
        alert(`更新 ${currentEmployee.name} 的權限失敗：${result.error}`);
        return;
      }

      // 顯示成功訊息
      alert(`${currentEmployee.name} 的權限已成功更新！`);

      const employeePermissions = {
        employee: currentEmployee,
        permissions: permissionsToUpdate,
        result: result.data
      };

      // 如果還有下一個員工，繼續設定
      if (currentEmployeeIndex < selectedEmployees.length - 1) {
        setCurrentEmployeeIndex(prev => prev + 1);
        console.log('已完成員工權限設定:', employeePermissions);
        setShowEditingComplete(false); // 關閉對話框
      } else {
        // 所有員工都設定完成 - 刷新頁面
        alert('所有員工權限設定完成！');
        
        // 通知父組件並刷新頁面
        onConfirm && onConfirm(employeePermissions);
        
        // 延遲一下讓 alert 顯示完畢，然後刷新頁面
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }

    } catch (error) {
      console.error('處理確認時發生錯誤:', error);
      alert('操作失敗，請稍後再試');
    } finally {
      setShowEditingComplete(false);
    }
  };

  // 處理確認對話框的取消
  const handleEditingCompleteCancel = () => {
    setShowEditingComplete(false);
  };

  // 處理取消
  const handleCancel = () => {
    if (isLoading) {
      alert('正在處理中，請稍候...');
      return;
    }
    handleClose();
  };

  // 關閉彈窗
  const handleClose = () => {
    if (isLoading) return;
    
    setCurrentEmployeeIndex(0);
    setPermissions({
      company_data: false,
      set_permissions: false,
      leave_settings: false,
      employee_data: false,
      upload_announcement: false,
      schedule_table: false,
      ad_push: false,
      supervisor_approval: false
    });
    onClose && onClose();
  };

  // 處理背景點擊
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  if (!isOpen || !currentEmployee) {
    return null;
  }

  const backendPermissions = permissionOptions.filter(option => option.category === 'backend');
  const appPermissions = permissionOptions.filter(option => option.category === 'app');

  return (
    <>
      {/* AddEmployeePermissions 主要內容 */}
      <div className="add-employee-permissions-overlay" onClick={handleOverlayClick}>
        <div className="add-employee-permissions-modal">
          <div className="add-employee-permissions-content">
            {/* 標題區域 */}
            <div className="add-employee-permissions-header">
              <div className="add-employee-permissions-title-container">
                <div className="add-employee-permissions-title">
                  請選擇該員工開通之權限：
                </div>
                <div className="add-employee-permissions-counter">
                  {currentEmployeeIndex + 1}/{selectedEmployees.length}
                </div>
              </div>
            </div>

            {/* 主要內容 */}
            <div className="add-employee-permissions-main-content">
              <div className="add-employee-permissions-employee-section">
                {/* 員工姓名 */}
                <div className="add-employee-permissions-employee-info">
                  <div className="add-employee-permissions-employee-label">
                    員工姓名
                  </div>
                  <div className="add-employee-permissions-employee-name">
                    {currentEmployee.name}
                  </div>
                </div>

                {/* 部門職稱 */}
                <div className="add-employee-permissions-department-info">
                  <div className="add-employee-permissions-department-label">
                    部門職稱
                  </div>
                  <div className="add-employee-permissions-department-value">
                    {currentEmployee.department} {currentEmployee.position || (currentEmployee.job_grade === 'hr' ? '主管' : '員工')}
                  </div>
                </div>

                {/* 後台功能 */}
                <div className="add-employee-permissions-backend-section">
                  <div className="add-employee-permissions-backend-title">
                    後台功能
                  </div>
                  <div className="add-employee-permissions-backend-options">
                    {backendPermissions.map((option) => (
                      <div key={option.key} className="add-employee-permissions-option">
                        <div 
                          className="add-employee-permissions-option-row"
                          onClick={() => !isLoading && handlePermissionChange(option.key)}
                          style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        >
                          <div 
                            className={`add-employee-permissions-checkbox ${
                              permissions[option.key] 
                                ? 'add-employee-permissions-checkbox-checked' 
                                : 'add-employee-permissions-checkbox-unchecked'
                            }`}
                          />
                          <div className="add-employee-permissions-option-content">
                            <div className="add-employee-permissions-option-icon">
                              <img 
                                src={option.icon} 
                                alt={option.name}
                                className="add-employee-permissions-icon-image"
                              />
                            </div>
                            <div className="add-employee-permissions-option-text-container">
                              <div className="add-employee-permissions-option-text">
                                {option.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* APP功能 */}
                <div className="add-employee-permissions-app-section">
                  <div className="add-employee-permissions-app-title">
                    APP 功能
                  </div>
                  {appPermissions.map((option) => (
                    <div key={option.key} className="add-employee-permissions-option">
                      <div 
                        className="add-employee-permissions-option-row"
                        onClick={() => !isLoading && handlePermissionChange(option.key)}
                        style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                      >
                        <div 
                          className={`add-employee-permissions-checkbox ${
                            permissions[option.key] 
                              ? 'add-employee-permissions-checkbox-checked' 
                              : 'add-employee-permissions-checkbox-unchecked'
                          }`}
                        />
                        <div className="add-employee-permissions-option-content">
                          <div className="add-employee-permissions-option-icon">
                            <img 
                              src={option.icon} 
                              alt={option.name}
                              className="add-employee-permissions-icon-image"
                            />
                          </div>
                          <div className="add-employee-permissions-option-text-container">
                            <div className="add-employee-permissions-option-text">
                              {option.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 按鈕組 */}
            <div className="add-employee-permissions-button-group">
              <button 
                className="add-employee-permissions-cancel-button"
                onClick={handleCancel}
                disabled={isLoading}
                style={{ 
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <span className="add-employee-permissions-cancel-text">取消</span>
              </button>
              
              <button 
                className="add-employee-permissions-confirm-button"
                onClick={handleConfirm}
                disabled={isLoading}
                style={{ 
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <span className="add-employee-permissions-confirm-main-text">
                  {isLoading ? '處理中...' : '確定開通'}
                </span>
                <span className="add-employee-permissions-confirm-sub-text">
                  {isLoading ? '請稍候' : '開通後將通知員工'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 編輯完成確認對話框 */}
      <EditingComplete
        isOpen={showEditingComplete}
        title="編輯權限"
        message="請確認資料編輯完成無誤並傳送通知。"
        cancelText="取消"
        confirmText="確定"
        onCancel={handleEditingCompleteCancel}
        onConfirm={handleEditingCompleteConfirm}
        onClose={() => setShowEditingComplete(false)}
      />
    </>
  );
};

export default AddEmployeePermissions;
