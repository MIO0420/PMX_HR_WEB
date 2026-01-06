// import React, { useState, useEffect } from 'react';
// import './Revise_Permissions.css';
// import Remove from '../dialog box/Remove'; // 移除權限對話框
// import EditingComplete from '../dialog box/Editing complete'; // 🔥 新增引入編輯完成對話框

// // 導入圖示 - 完全相同
// import CompanyInformationIcon from '../../ICON/SidebarICON/CompanyInformation.png';
// import PermissionsIcon from '../../ICON/SidebarICON/Permissions.png';
// import HypothesisSettingIcon from '../../ICON/SidebarICON/HypothesisSetting.png';
// import EmployeeInformationIcon from '../../ICON/SidebarICON/EmployeeInformation.png';
// import UploadAnnouncementIcon from '../../ICON/SidebarICON/UploadAnnouncement.png';
// import ShiftScheduleIcon from '../../ICON/SidebarICON/ShiftSchedule.png';
// import AdvertisingPushIcon from '../../ICON/SidebarICON/Advertising_push.png';
// import ApprovingIcon from '../../ICON/SidebarICON/Approving.png';

// const RevisePermissions = ({ 
//   isOpen, 
//   onClose, 
//   employee, 
//   onConfirm 
// }) => {
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
//   const [showRemoveDialog, setShowRemoveDialog] = useState(false); // 移除權限對話框
//   const [showEditingComplete, setShowEditingComplete] = useState(false); // 🔥 新增編輯完成對話框狀態

//   // 權限選項配置 - 完全相同
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

//   // 初始化權限狀態 - 載入現有權限
//   useEffect(() => {
//     if (isOpen && employee && employee.permissionDetails) {
//       console.log('初始化權限狀態:', employee.permissionDetails);
//       const newPermissions = {};
//       permissionOptions.forEach(option => {
//         newPermissions[option.key] = employee.permissionDetails[option.key] === 1;
//       });
//       setPermissions(newPermissions);
//       console.log('設定權限狀態:', newPermissions);
//     }
//   }, [isOpen, employee]);

//   // 處理權限勾選
//   const handlePermissionChange = (permissionKey) => {
//     setPermissions(prev => ({
//       ...prev,
//       [permissionKey]: !prev[permissionKey]
//     }));
//   };

//   // 更新員工權限
//   const updateEmployeePermissions = async (permissionsData) => {
//     try {
//       setIsLoading(true);
      
//       const employeeId = employee.employee_id || employee.id;
      
//       if (!employeeId) {
//         throw new Error('員工ID不存在');
//       }
      
//       const formattedPermissions = {};
//       Object.keys(permissionsData).forEach(key => {
//         formattedPermissions[key] = permissionsData[key] ? 1 : 0;
//       });

//       // 檢查是否有任何權限被選中
//       const hasAnyPermission = Object.values(permissionsData).some(value => value === true);
//       formattedPermissions.permissions = hasAnyPermission ? 1 : 0;

//       console.log('發送權限更新請求:', formattedPermissions);

//       const response = await fetch(`https://rabbit.54ucl.com:3004/api/company/employee-permissions/${employeeId}`, {
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

//   // 🔥 修改：處理確認更新 - 顯示對話框
//   const handleConfirm = async () => {
//     if (!employee) return;

//     // 檢查是否有權限變更
//     if (!hasChanges()) {
//       alert('沒有權限變更需要更新');
//       return;
//     }

//     // 🔥 顯示編輯完成確認對話框
//     setShowEditingComplete(true);
//   };

//   // 🔥 新增：處理編輯完成對話框的確認
//   const handleEditingCompleteConfirm = async () => {
//     try {
//       const result = await updateEmployeePermissions(permissions);
      
//       if (!result.success) {
//         alert(`更新 ${employee.name} 的權限失敗：${result.error}`);
//         return;
//       }

//       alert(`${employee.name} 的權限已成功更新！`);
//       onConfirm();
//       onClose();

//     } catch (error) {
//       console.error('確認更新錯誤:', error);
//       alert('更新權限時發生錯誤');
//     }
//   };

//   // 🔥 新增：處理編輯完成對話框的取消
//   const handleEditingCompleteCancel = () => {
//     setShowEditingComplete(false);
//   };

//   // 處理移除所有權限 - 顯示對話框
//   const handleRemoveAllPermissions = () => {
//     if (!employee) return;
//     setShowRemoveDialog(true);
//   };

//   // 處理移除對話框的確認
//   const handleRemoveDialogConfirm = async () => {
//     if (!employee) return;

//     try {
//       const allPermissionsOff = {
//         company_data: false,
//         set_permissions: false,
//         leave_settings: false,
//         employee_data: false,
//         upload_announcement: false,
//         schedule_table: false,
//         ad_push: false,
//         permissions: false,
//         supervisor_approval: false
//       };

//       const result = await updateEmployeePermissions(allPermissionsOff);
      
//       if (!result.success) {
//         alert(`移除 ${employee.name} 的權限失敗：${result.error}`);
//         return;
//       }

//       alert(`${employee.name} 的所有權限已成功移除！`);
//       onConfirm();
//       onClose();

//     } catch (error) {
//       console.error('移除所有權限錯誤:', error);
//       alert('移除權限時發生錯誤');
//     }
//   };

//   // 處理移除對話框的取消
//   const handleRemoveDialogCancel = () => {
//     setShowRemoveDialog(false);
//   };

//   // 檢查是否有權限變更
//   const hasChanges = () => {
//     if (!employee || !employee.permissionDetails) return false;
    
//     return permissionOptions.some(option => {
//       const currentValue = permissions[option.key];
//       const originalValue = employee.permissionDetails[option.key] === 1;
//       return currentValue !== originalValue;
//     });
//   };

//   if (!isOpen || !employee) return null;

//   const backendOptions = permissionOptions.filter(option => option.category === 'backend');
//   const appOptions = permissionOptions.filter(option => option.category === 'app');

//   console.log('渲染組件:', { isOpen, employee, permissions });

//   return (
//     <>
//       {/* 原有的 RevisePermissions 內容 */}
//       <div className="revise-permissions-overlay" onClick={onClose}>
//         <div className="revise-permissions-modal" onClick={(e) => e.stopPropagation()}>
//           <div className="revise-permissions-content">
//             {/* 標題 */}
//             <div className="revise-permissions-header">
//               <div className="revise-permissions-title-container">
//                 <div className="revise-permissions-title">請選擇該員工開通之權限：</div>
//                 <div className="revise-permissions-counter">1/1</div>
//               </div>
//             </div>

//             {/* 主要內容 */}
//             <div className="revise-permissions-main-content">
//               <div className="revise-permissions-employee-section">
//                 {/* 員工資訊 */}
//                 <div className="revise-permissions-employee-info">
//                   <div className="revise-permissions-employee-label">員工姓名</div>
//                   <div className="revise-permissions-employee-name">{employee.name}</div>
//                 </div>

//                 {/* 部門職稱 */}
//                 <div className="revise-permissions-department-info">
//                   <div className="revise-permissions-department-label">部門職稱</div>
//                   <div className="revise-permissions-department-value">
//                     {employee.department} {employee.position || '員工'}
//                   </div>
//                 </div>

//                 {/* 後台功能 */}
//                 <div className="revise-permissions-backend-functions">
//                   <div className="revise-permissions-backend-title">後台功能</div>
//                   <div className="revise-permissions-backend-options">
//                     {backendOptions.map((option) => (
//                       <div key={option.key} className="revise-permissions-option-item">
//                         <div className="revise-permissions-option-row">
//                           <div 
//                             className={`revise-permissions-checkbox ${
//                               permissions[option.key] 
//                                 ? 'revise-permissions-checkbox-checked' 
//                                 : 'revise-permissions-checkbox-unchecked'
//                             }`}
//                             onClick={() => handlePermissionChange(option.key)}
//                           />
//                           <div className="revise-permissions-option-content">
//                             <img 
//                               src={option.icon} 
//                               alt={option.name}
//                               className="revise-permissions-option-icon"
//                             />
//                             <div className="revise-permissions-option-text">
//                               <div className="revise-permissions-option-name">
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
//                 <div className="revise-permissions-app-functions">
//                   <div className="revise-permissions-app-title">APP 功能</div>
//                   <div className="revise-permissions-app-options">
//                     {appOptions.map((option) => (
//                       <div key={option.key} className="revise-permissions-option-item">
//                         <div className="revise-permissions-option-row">
//                           <div 
//                             className={`revise-permissions-checkbox ${
//                               permissions[option.key] 
//                                 ? 'revise-permissions-checkbox-checked' 
//                                 : 'revise-permissions-checkbox-unchecked'
//                             }`}
//                             onClick={() => handlePermissionChange(option.key)}
//                           />
//                           <div className="revise-permissions-option-content">
//                             <img 
//                               src={option.icon} 
//                               alt={option.name}
//                               className="revise-permissions-option-icon"
//                             />
//                             <div className="revise-permissions-option-text">
//                               <div className="revise-permissions-option-name">
//                                 {option.name}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 按鈕組 */}
//             <div className="revise-permissions-button-group">
//               {/* 第一行：取消和確認 */}
//               <div className="revise-permissions-top-buttons">
//                 <button 
//                   className="revise-permissions-cancel-button"
//                   onClick={onClose}
//                   disabled={isLoading}
//                 >
//                   <span className="revise-permissions-cancel-text">取消</span>
//                 </button>

//                 <button 
//                   className={`revise-permissions-confirm-button ${
//                     hasChanges() && !isLoading ? 'enabled' : 'disabled'
//                   }`}
//                   onClick={handleConfirm}
//                   disabled={!hasChanges() || isLoading}
//                 >
//                   <span className="revise-permissions-confirm-main-text">
//                     {isLoading ? '更新中...' : '確定更新'}
//                   </span>
//                   <span className="revise-permissions-confirm-sub-text">
//                     更新後將通知員工
//                   </span>
//                 </button>
//               </div>

//               {/* 第二行：移除所有權限按鈕 */}
//               <button 
//                 className="revise-permissions-remove-all-button"
//                 onClick={handleRemoveAllPermissions}
//                 disabled={isLoading}
//               >
//                 <span className="revise-permissions-remove-all-text">移除所有權限</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 移除權限確認對話框 */}
//       <Remove
//         isOpen={showRemoveDialog}
//         title="移除所有權限"
//         message="確定要移除權限嗎？"
//         cancelText="取消"
//         confirmText="確定"
//         onCancel={handleRemoveDialogCancel}
//         onConfirm={handleRemoveDialogConfirm}
//         onClose={() => setShowRemoveDialog(false)}
//       />

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

// export default RevisePermissions;
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // 🔥 新增引入
import './Revise_Permissions.css';
import Remove from '../dialog box/Remove';
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

const RevisePermissions = ({ 
  isOpen, 
  onClose, 
  employee, 
  onConfirm 
}) => {
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
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
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

  // 初始化權限狀態
  useEffect(() => {
    if (isOpen && employee && employee.permissionDetails) {
      console.log('初始化權限狀態:', employee.permissionDetails);
      const newPermissions = {};
      permissionOptions.forEach(option => {
        newPermissions[option.key] = employee.permissionDetails[option.key] === 1;
      });
      setPermissions(newPermissions);
      console.log('設定權限狀態:', newPermissions);
    }
  }, [isOpen, employee]);

  // 處理權限勾選
  const handlePermissionChange = (permissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  // 🔥 修改：更新員工權限 - 動態獲取 company_id
  const updateEmployeePermissions = async (permissionsData) => {
    try {
      setIsLoading(true);
      
      const employeeId = employee.employee_id || employee.id;
      
      if (!employeeId) {
        throw new Error('員工ID不存在');
      }

      // 🔥 動態獲取 company_id
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('無法獲取公司資訊');
      }

      console.log('🔍 使用的 company_id:', companyId);
      console.log('🔍 使用的 employee_id:', employeeId);
      
      const formattedPermissions = {
        company_id: companyId // 🔥 加入 company_id 到請求體
      };
      
      Object.keys(permissionsData).forEach(key => {
        formattedPermissions[key] = permissionsData[key] ? 1 : 0;
      });

      // 檢查是否有任何權限被選中
      const hasAnyPermission = Object.values(permissionsData).some(value => value === true);
      formattedPermissions.permissions = hasAnyPermission ? 1 : 0;

      console.log('🔍 發送權限更新請求:', formattedPermissions);

      const response = await fetch(`https://rabbit.54ucl.com:3004/api/company/employee-permissions/${employeeId}`, {
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

  // 處理確認更新
  const handleConfirm = async () => {
    if (!employee) return;

    // 檢查是否有權限變更
    if (!hasChanges()) {
      alert('沒有權限變更需要更新');
      return;
    }

    // 顯示編輯完成確認對話框
    setShowEditingComplete(true);
  };

  // 處理編輯完成對話框的確認
  const handleEditingCompleteConfirm = async () => {
    try {
      const result = await updateEmployeePermissions(permissions);
      
      if (!result.success) {
        alert(`更新 ${employee.name} 的權限失敗：${result.error}`);
        return;
      }

      alert(`${employee.name} 的權限已成功更新！`);
      onConfirm();
      onClose();

    } catch (error) {
      console.error('確認更新錯誤:', error);
      alert('更新權限時發生錯誤');
    } finally {
      setShowEditingComplete(false);
    }
  };

  // 處理編輯完成對話框的取消
  const handleEditingCompleteCancel = () => {
    setShowEditingComplete(false);
  };

  // 處理移除所有權限
  const handleRemoveAllPermissions = () => {
    if (!employee) return;
    setShowRemoveDialog(true);
  };

  // 處理移除對話框的確認
  const handleRemoveDialogConfirm = async () => {
    if (!employee) return;

    try {
      const allPermissionsOff = {
        company_data: false,
        set_permissions: false,
        leave_settings: false,
        employee_data: false,
        upload_announcement: false,
        schedule_table: false,
        ad_push: false,
        permissions: false,
        supervisor_approval: false
      };

      const result = await updateEmployeePermissions(allPermissionsOff);
      
      if (!result.success) {
        alert(`移除 ${employee.name} 的權限失敗：${result.error}`);
        return;
      }

      alert(`${employee.name} 的所有權限已成功移除！`);
      onConfirm();
      onClose();

    } catch (error) {
      console.error('移除所有權限錯誤:', error);
      alert('移除權限時發生錯誤');
    } finally {
      setShowRemoveDialog(false);
    }
  };

  // 處理移除對話框的取消
  const handleRemoveDialogCancel = () => {
    setShowRemoveDialog(false);
  };

  // 檢查是否有權限變更
  const hasChanges = () => {
    if (!employee || !employee.permissionDetails) return false;
    
    return permissionOptions.some(option => {
      const currentValue = permissions[option.key];
      const originalValue = employee.permissionDetails[option.key] === 1;
      return currentValue !== originalValue;
    });
  };

  if (!isOpen || !employee) return null;

  const backendOptions = permissionOptions.filter(option => option.category === 'backend');
  const appOptions = permissionOptions.filter(option => option.category === 'app');

  console.log('渲染組件:', { isOpen, employee, permissions });

  return (
    <>
      {/* RevisePermissions 主要內容 */}
      <div className="revise-permissions-overlay" onClick={onClose}>
        <div className="revise-permissions-modal" onClick={(e) => e.stopPropagation()}>
          <div className="revise-permissions-content">
            {/* 標題 */}
            <div className="revise-permissions-header">
              <div className="revise-permissions-title-container">
                <div className="revise-permissions-title">請選擇該員工開通之權限：</div>
                <div className="revise-permissions-counter">1/1</div>
              </div>
            </div>

            {/* 主要內容 */}
            <div className="revise-permissions-main-content">
              <div className="revise-permissions-employee-section">
                {/* 員工資訊 */}
                <div className="revise-permissions-employee-info">
                  <div className="revise-permissions-employee-label">員工姓名</div>
                  <div className="revise-permissions-employee-name">{employee.name}</div>
                </div>

                {/* 部門職稱 */}
                <div className="revise-permissions-department-info">
                  <div className="revise-permissions-department-label">部門職稱</div>
                  <div className="revise-permissions-department-value">
                    {employee.department} {employee.position || '員工'}
                  </div>
                </div>

                {/* 後台功能 */}
                <div className="revise-permissions-backend-functions">
                  <div className="revise-permissions-backend-title">後台功能</div>
                  <div className="revise-permissions-backend-options">
                    {backendOptions.map((option) => (
                      <div key={option.key} className="revise-permissions-option-item">
                        <div className="revise-permissions-option-row">
                          <div 
                            className={`revise-permissions-checkbox ${
                              permissions[option.key] 
                                ? 'revise-permissions-checkbox-checked' 
                                : 'revise-permissions-checkbox-unchecked'
                            }`}
                            onClick={() => handlePermissionChange(option.key)}
                          />
                          <div className="revise-permissions-option-content">
                            <img 
                              src={option.icon} 
                              alt={option.name}
                              className="revise-permissions-option-icon"
                            />
                            <div className="revise-permissions-option-text">
                              <div className="revise-permissions-option-name">
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
                <div className="revise-permissions-app-functions">
                  <div className="revise-permissions-app-title">APP 功能</div>
                  <div className="revise-permissions-app-options">
                    {appOptions.map((option) => (
                      <div key={option.key} className="revise-permissions-option-item">
                        <div className="revise-permissions-option-row">
                          <div 
                            className={`revise-permissions-checkbox ${
                              permissions[option.key] 
                                ? 'revise-permissions-checkbox-checked' 
                                : 'revise-permissions-checkbox-unchecked'
                            }`}
                            onClick={() => handlePermissionChange(option.key)}
                          />
                          <div className="revise-permissions-option-content">
                            <img 
                              src={option.icon} 
                              alt={option.name}
                              className="revise-permissions-option-icon"
                            />
                            <div className="revise-permissions-option-text">
                              <div className="revise-permissions-option-name">
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
            </div>

            {/* 按鈕組 */}
            <div className="revise-permissions-button-group">
              {/* 第一行：取消和確認 */}
              <div className="revise-permissions-top-buttons">
                <button 
                  className="revise-permissions-cancel-button"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <span className="revise-permissions-cancel-text">取消</span>
                </button>

                <button 
                  className={`revise-permissions-confirm-button ${
                    hasChanges() && !isLoading ? 'enabled' : 'disabled'
                  }`}
                  onClick={handleConfirm}
                  disabled={!hasChanges() || isLoading}
                >
                  <span className="revise-permissions-confirm-main-text">
                    {isLoading ? '更新中...' : '確定更新'}
                  </span>
                  <span className="revise-permissions-confirm-sub-text">
                    更新後將通知員工
                  </span>
                </button>
              </div>

              {/* 第二行：移除所有權限按鈕 */}
              <button 
                className="revise-permissions-remove-all-button"
                onClick={handleRemoveAllPermissions}
                disabled={isLoading}
              >
                <span className="revise-permissions-remove-all-text">移除所有權限</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移除權限確認對話框 */}
      <Remove
        isOpen={showRemoveDialog}
        title="移除所有權限"
        message="確定要移除權限嗎？"
        cancelText="取消"
        confirmText="確定"
        onCancel={handleRemoveDialogCancel}
        onConfirm={handleRemoveDialogConfirm}
        onClose={() => setShowRemoveDialog(false)}
      />

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

export default RevisePermissions;
