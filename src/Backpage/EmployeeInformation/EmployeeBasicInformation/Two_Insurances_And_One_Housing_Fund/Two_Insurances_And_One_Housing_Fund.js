// import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './Two_Insurances_And_One_Housing_Fund.css';
// import IncreaseIcon from '../icon/Increase.png';
// import ReduceIcon from '../icon/reduce.png';
// // 新增箭頭圖片導入
// import DownIcon from '../icon/down.png';
// import UpIcon from '../icon/up.png';

// const TwoInsurancesAndOneHousingFund = forwardRef(({ employee, isEditing }, ref) => {
//   // 狀態管理
//   const [insuranceData, setInsuranceData] = useState({
//     // 基本薪資
//     base_salary: 33000,
    
//     // 保險相關
//     labor_insurance_salary: 33000,
//     labor_insurance_grade: 5,
//     labor_insurance_employee_fee: 1358,
//     labor_insurance_employer_fee: 2027,
    
//     health_insurance_salary: 33000,
//     health_insurance_grade: 5,
//     health_insurance_employee_fee: 1358,
//     health_insurance_employer_fee: 2358,
    
//     // 眷保設定
//     dependents_enabled: false,
//     dependents_expanded: false,
    
//     // 勞退設定
//     pension_contribution_rate: 0,
//     pension_expanded: false,
//     pension_record_expanded: false, // 新增：變更記錄展開狀態
//     employer_contribution_rate: 6, // 新增：雇主提繳率
//     employee_voluntary_rate: 1, // 新增：自願提繳率
//     employee_voluntary_enabled: true // 新增：自願提繳是否啟用
//   });

//   // 眷保資料狀態
//   const [dependentsData, setDependentsData] = useState([
//     {
//       id: 1,
//       name: '',
//       birthday: '',
//       id_number: '',
//       relationship: ''
//     }
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [editMode, setEditMode] = useState(false);

//   // 暴露給父組件的方法
//   useImperativeHandle(ref, () => ({
//     saveInsuranceData: handleSaveData,
//     resetForm: handleResetForm,
//     isEditing: editMode
//   }));

//   // 載入資料
//   useEffect(() => {
//     if (employee?.employee_id) {
//       loadInsuranceData();
//     }
//   }, [employee]);

//   // 監聽編輯模式變化
//   useEffect(() => {
//     setEditMode(isEditing);
//   }, [isEditing]);

//   // 載入保險資料
//   const loadInsuranceData = async () => {
//     if (!employee?.employee_id) return;
    
//     // 使用員工薪資初始化
//     if (employee.salary) {
//       const salary = Number(employee.salary);
//       setInsuranceData(prev => ({
//         ...prev,
//         base_salary: salary,
//         labor_insurance_salary: salary,
//         health_insurance_salary: salary
//       }));
//     }
//   };

//   // 切換眷保設定
//   const toggleDependents = () => {
//     setInsuranceData(prev => ({
//       ...prev,
//       dependents_enabled: !prev.dependents_enabled,
//       // 當啟用眷保時自動展開，關閉時自動收起
//       dependents_expanded: !prev.dependents_enabled
//     }));
//   };

//   // 展開/收起眷保詳情
//   const toggleDependentsExpanded = () => {
//     setInsuranceData(prev => ({
//       ...prev,
//       dependents_expanded: !prev.dependents_expanded
//     }));
//   };

//   // 新增：切換勞退變更記錄展開狀態
//   const togglePensionRecordExpanded = () => {
//     setInsuranceData(prev => ({
//       ...prev,
//       pension_record_expanded: !prev.pension_record_expanded
//     }));
//   };

//   // 新增：切換自願提繳啟用狀態
//   const toggleEmployeeVoluntaryEnabled = () => {
//     setInsuranceData(prev => ({
//       ...prev,
//       employee_voluntary_enabled: !prev.employee_voluntary_enabled
//     }));
//   };

//   // 新增：更新雇主提繳率
//   const updateEmployerContributionRate = (rate) => {
//     setInsuranceData(prev => ({
//       ...prev,
//       employer_contribution_rate: rate
//     }));
//   };

//   // 新增：更新自願提繳率
//   const updateEmployeeVoluntaryRate = (rate) => {
//     setInsuranceData(prev => ({
//       ...prev,
//       employee_voluntary_rate: rate
//     }));
//   };

//   // 新增眷屬
//   const addDependent = () => {
//     const newDependent = {
//       id: Date.now(),
//       name: '',
//       birthday: '',
//       id_number: '',
//       relationship: ''
//     };
//     setDependentsData(prev => [...prev, newDependent]);
//   };

//   // 刪除眷屬
//   const removeDependent = (id) => {
//     setDependentsData(prev => prev.filter(item => item.id !== id));
//   };

//   // 更新眷屬資料
//   const updateDependent = (id, field, value) => {
//     setDependentsData(prev => 
//       prev.map(item => 
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   // 計算眷保人數和金額
//   const calculateDependentsInfo = () => {
//     const validDependents = dependentsData.filter(dep => 
//       dep.name && dep.birthday && dep.id_number && dep.relationship
//     );
//     const count = validDependents.length;
//     const amount = count * 326; // 每人326元
//     return { count, amount };
//   };

//   // 保存資料
//   const handleSaveData = async () => {
//     if (!employee?.employee_id) {
//       return { success: false, message: '員工ID不存在' };
//     }

//     try {
//       setLoading(true);
//       // 模擬保存成功
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       return { success: true, message: '保險資料更新成功' };
//     } catch (error) {
//       return { success: false, message: '保存失敗' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 重置表單
//   const handleResetForm = () => {
//     loadInsuranceData();
//     setError('');
//   };

//   // 格式化金額顯示
//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('zh-TW').format(amount || 0);
//   };

//   // 計算總計
//   const calculateTotals = () => {
//     const { amount: dependentsAmount } = calculateDependentsInfo();
//     const employeeTotal = insuranceData.labor_insurance_employee_fee + 
//                          insuranceData.health_insurance_employee_fee + 
//                          (insuranceData.dependents_enabled ? dependentsAmount : 0);
                         
//     const employerTotal = insuranceData.labor_insurance_employer_fee + 
//                          insuranceData.health_insurance_employer_fee;
                         
//     return { employeeTotal, employerTotal };
//   };

//   const { employeeTotal, employerTotal } = calculateTotals();
//   const { count: dependentsCount, amount: dependentsAmount } = calculateDependentsInfo();

//   if (loading) {
//     return (
//       <div className="insurance-loading-container">
//         <div className="insurance-loading-spinner"></div>
//         <p>載入資料中...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="insurance-container">
      
//       {/* 自動計算區塊 */}
//       <div className="insurance-auto-calc-section">
        
//         {/* 全薪 (以月計算) */}
//         <div className="insurance-salary-row">
//           <div className="insurance-salary-label">全薪 (以月計算)</div>
//           <div className="insurance-salary-value">{formatAmount(insuranceData.base_salary)}</div>
//         </div>

//         {/* 投保級距 */}
//         <div className="insurance-grade-row">
//           <div className="insurance-grade-info">
//             <span className="insurance-grade-label">投保級距</span>
//             <span className="insurance-grade-auto">(自動計算)</span>
//           </div>
//           <div className="insurance-grade-value">
//             <span className="insurance-grade-amount">{formatAmount(insuranceData.labor_insurance_salary)}</span>
//             <span className="insurance-grade-level">( 第{insuranceData.labor_insurance_grade}級 )</span>
//           </div>
//         </div>

//       </div>

//       {/* 勞保自負額 */}
//       <div className="insurance-fee-row labor-insurance">
//         <div className="insurance-fee-info">
//           <span className="insurance-fee-label">勞保自負額</span>
//           <span className="insurance-fee-desc">依政府規定自動計算</span>
//         </div>
//         <div className="insurance-fee-amount">
//           <span className="insurance-currency">$</span>
//           <span className="insurance-amount">{formatAmount(insuranceData.labor_insurance_employee_fee)}</span>
//         </div>
//       </div>

//       {/* 健保自負額 */}
//       <div className="insurance-fee-row health-insurance">
//         <div className="insurance-fee-info">
//           <span className="insurance-fee-label">健保自負額</span>
//           <span className="insurance-fee-desc">依政府規定自動計算</span>
//         </div>
//         <div className="insurance-fee-amount">
//           <span className="insurance-currency">$</span>
//           <span className="insurance-amount">{formatAmount(insuranceData.health_insurance_employee_fee)}</span>
//         </div>
//       </div>

//       {/* 眷保設定 */}
//       <div className={`insurance-dependents-row ${insuranceData.dependents_enabled ? 'active' : ''}`}>
//         <div className="insurance-dependents-info">
//           <span className="insurance-dependents-label">眷保設定</span>
//           <div 
//             className={`insurance-toggle-switch ${insuranceData.dependents_enabled ? 'active' : ''}`}
//             onClick={toggleDependents}
//           >
//             <div className="insurance-switch-slider">
//               <div className="insurance-switch-knob"></div>
//             </div>
//           </div>
//         </div>
//         <div className="insurance-expand-control">
//           <button 
//             className="insurance-expand-btn"
//             onClick={toggleDependentsExpanded}
//             type="button"
//           >
//             <img 
//               src={insuranceData.dependents_expanded ? UpIcon : DownIcon} 
//               alt={insuranceData.dependents_expanded ? "收起" : "展開"} 
//               className="insurance-expand-icon-img"
//             />
//           </button>
//         </div>
//       </div>

//       {/* 眷保資料細項 (展開時顯示) */}
//       {insuranceData.dependents_expanded && (
//         <div className="insurance-dependents-details">
//           <div className="insurance-dependents-sidebar"></div>
//           <div className="insurance-dependents-content">
//             <div className="insurance-dependents-header">
//               <h4 className="insurance-dependents-title">眷保資料</h4>
//             </div>
            
//             <div className="insurance-dependents-list">
//               {dependentsData.map((dependent, index) => (
//                 <div key={dependent.id} className="insurance-dependent-item">
//                   <div className="insurance-dependent-row">
//                     {/* 姓名輸入框 */}
//                     <div className="insurance-input-group">
//                       <input
//                         type="text"
//                         className="insurance-input-field"
//                         placeholder="姓名"
//                         value={dependent.name}
//                         onChange={(e) => updateDependent(dependent.id, 'name', e.target.value)}
//                       />
//                     </div>

//                     {/* 生日文字標籤 */}
//                     <div className="insurance-date-label">
//                       <span>生日</span>
//                     </div>

//                     {/* 生日輸入框 */}
//                     <div className="insurance-input-group">
//                       <div className="insurance-date-input">
//                         <input
//                           type="text"
//                           className="insurance-input-field date-field"
//                           value={dependent.birthday}
//                           onChange={(e) => updateDependent(dependent.id, 'birthday', e.target.value)}
//                         />
//                         <div className="insurance-date-placeholders">
//                           <span>民</span>
//                           <span>年</span>
//                           <span>月</span>
//                           <span>日</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* 身分證字號輸入框 */}
//                     <div className="insurance-input-group">
//                       <input
//                         type="text"
//                         className="insurance-input-field"
//                         placeholder="身分證字號"
//                         value={dependent.id_number}
//                         onChange={(e) => updateDependent(dependent.id, 'id_number', e.target.value)}
//                       />
//                     </div>

//                     {/* 稱謂輸入框 */}
//                     <div className="insurance-input-group">
//                       <div className="insurance-select-wrapper">
//                         <select
//                           className="insurance-select-field"
//                           value={dependent.relationship}
//                           onChange={(e) => updateDependent(dependent.id, 'relationship', e.target.value)}
//                         >
//                           <option value="">稱謂</option>
//                           <option value="1-配偶">1-配偶</option>
//                           <option value="2-父母">2-父母</option>
//                           <option value="3-子女">3-子女</option>
//                         </select>
//                         <svg className="insurance-select-arrow" viewBox="0 0 24 24">
//                           <path d="M7 10l5 5 5-5z" fill="#3A6CA6"/>
//                         </svg>
//                       </div>
//                     </div>

//                     {/* 操作按鈕 */}
//                     <div className="insurance-action-buttons">
//                       <button
//                         type="button"
//                         className="insurance-remove-btn"
//                         onClick={() => removeDependent(dependent.id)}
//                       >
//                         <img src={ReduceIcon} alt="刪除" className="insurance-btn-icon" />
//                       </button>
//                       <button
//                         type="button"
//                         className="insurance-add-btn"
//                         onClick={addDependent}
//                       >
//                         <img src={IncreaseIcon} alt="新增" className="insurance-btn-icon" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* 眷保統計資訊 */}
//             <div className="insurance-dependents-summary">
//               <div className="insurance-summary-row">
//                 <span className="insurance-summary-text">眷保人數</span>
//                 <span className="insurance-summary-value">{dependentsCount}人</span>
//               </div>
//               <div className="insurance-summary-row">
//                 <span className="insurance-summary-text">眷保金額</span>
//                 <span className="insurance-summary-value">${dependentsAmount}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 勞工退休金提繳率 */}
//       <div className="insurance-pension-row">
//         <div className="insurance-pension-info">
//           <span className="insurance-pension-label">勞工退休金提繳率</span>
//         </div>
//         <div className="insurance-pension-control">
//           <button 
//             className="insurance-record-btn"
//             onClick={togglePensionRecordExpanded}
//             type="button"
//           >
//             變更記錄
//           </button>
//         </div>
//       </div>

//       {/* 勞退提撥資料細項 (展開時顯示) */}
//       {insuranceData.pension_record_expanded && (
//         <div className="insurance-pension-details">
//           <div className="insurance-pension-sidebar"></div>
//           <div className="insurance-pension-content">
            
//             {/* 雇主提繳率 */}
//             <div className="insurance-pension-item">
//               <div className="insurance-pension-item-content">
//                 <div className="insurance-pension-setting">
//                   <div className="insurance-pension-title-group">
//                     <span className="insurance-pension-title">雇主提繳率</span>
//                   </div>
//                   <div className="insurance-pension-dropdown">
//                     <div className="insurance-pension-dropdown-content">
//                       <span className="insurance-pension-rate">{insuranceData.employer_contribution_rate}%</span>
//                       <img src={DownIcon} alt="下拉" className="insurance-pension-arrow" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 自願提繳率 */}
//             <div className="insurance-pension-item">
//               <div className="insurance-pension-item-content">
//                 <div className="insurance-pension-setting">
//                   <div className="insurance-pension-title-group">
//                     <span className="insurance-pension-title">自願提繳率</span>
//                     <div 
//                       className={`insurance-toggle-switch ${insuranceData.employee_voluntary_enabled ? 'active' : ''}`}
//                       onClick={toggleEmployeeVoluntaryEnabled}
//                     >
//                       <div className="insurance-switch-slider">
//                         <div className="insurance-switch-knob"></div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* 只有在滑竿打開時才顯示下拉選單 */}
//                   {insuranceData.employee_voluntary_enabled && (
//                     <div className="insurance-pension-dropdown">
//                       <div className="insurance-pension-dropdown-content">
//                         <span className="insurance-pension-rate">{insuranceData.employee_voluntary_rate}%</span>
//                         <img src={DownIcon} alt="下拉" className="insurance-pension-arrow" />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* 總計區域 */}
//       <div className="insurance-summary">
//         <div className="insurance-summary-left">
//           <span className="insurance-summary-label">雇主負擔合計</span>
//           <span className="insurance-summary-amount">{formatAmount(employerTotal)}</span>
//           <span className="insurance-summary-unit">元</span>
//         </div>
//         <div className="insurance-summary-divider"></div>
//         <div className="insurance-summary-right">
//           <span className="insurance-summary-label">勞工自負合計</span>
//           <span className="insurance-summary-amount">{formatAmount(employeeTotal)}</span>
//           <span className="insurance-summary-unit">元</span>
//         </div>
//       </div>

//     </div>
//   );
// });

// TwoInsurancesAndOneHousingFund.displayName = 'TwoInsurancesAndOneHousingFund';

// export default TwoInsurancesAndOneHousingFund;
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../../../config'; // 🔥 引入 config
import './Two_Insurances_And_One_Housing_Fund.css';
import IncreaseIcon from '../icon/Increase.png';
import ReduceIcon from '../icon/reduce.png';
// 新增箭頭圖片導入
import DownIcon from '../icon/down.png';
import UpIcon from '../icon/up.png';

const TwoInsurancesAndOneHousingFund = forwardRef(({ employee, isEditing }, ref) => {
  // 狀態管理
  const [insuranceData, setInsuranceData] = useState({
    // 基本薪資
    base_salary: 33000,
    
    // 保險相關
    labor_insurance_salary: 33000,
    labor_insurance_grade: 5,
    labor_insurance_employee_fee: 1358,
    labor_insurance_employer_fee: 2027,
    
    health_insurance_salary: 33000,
    health_insurance_grade: 5,
    health_insurance_employee_fee: 1358,
    health_insurance_employer_fee: 2358,
    
    // 眷保設定
    dependents_enabled: false,
    dependents_expanded: false,
    
    // 勞退設定
    pension_contribution_rate: 0,
    pension_expanded: false,
    pension_record_expanded: false, // 新增：變更記錄展開狀態
    employer_contribution_rate: 6, // 新增：雇主提繳率
    employee_voluntary_rate: 1, // 新增：自願提繳率
    employee_voluntary_enabled: true // 新增：自願提繳是否啟用
  });

  // 眷保資料狀態
  const [dependentsData, setDependentsData] = useState([
    {
      id: 1,
      name: '',
      birthday: '',
      id_number: '',
      relationship: ''
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  // 🔥 新增：權限相關狀態
  const [permissions, setPermissions] = useState(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // 🔥 新增：檢查員工權限的 API 函數
  const checkEmployeePermissions = async (employeeId) => {
    try {
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        return {
          success: false,
          message: '無法獲取公司ID',
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

      console.log('🔍 二險一金權限檢查 API 回應:', response.data);
      
      if (response.data && response.data.Status === 'Ok') {
        return {
          success: true,
          permissions: response.data.Data,
          hasEditPermission: response.data.Data?.employee_data === 1
        };
      } else {
        return {
          success: false,
          message: response.data?.Msg || '權限檢查失敗',
          hasEditPermission: false
        };
      }
    } catch (error) {
      console.error('❌ 二險一金權限檢查 API 錯誤:', error);
      return {
        success: false,
        message: error.message || '權限檢查失敗',
        hasEditPermission: false
      };
    }
  };

  // 暴露給父組件的方法
  useImperativeHandle(ref, () => ({
    saveInsuranceData: handleSaveData,
    resetForm: handleResetForm,
    isEditing: editMode,
    hasEditPermission: hasEditPermission // 🔥 暴露權限狀態
  }));

  // 🔥 新增：檢查員工權限
  useEffect(() => {
    const loadEmployeePermissions = async () => {
      if (employee?.employee_id) {
        setPermissionLoading(true);
        setPermissionError('');
        
        try {
          const result = await checkEmployeePermissions(employee.employee_id);
          
          if (result.success) {
            setPermissions(result.permissions);
            setHasEditPermission(result.hasEditPermission);
            console.log('✅ 二險一金權限檢查成功:', result.permissions);
            console.log('✅ 二險一金編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
          } else {
            setPermissionError(result.message);
            setHasEditPermission(false);
            console.error('❌ 二險一金權限檢查失敗:', result.message);
          }
        } catch (error) {
          setPermissionError('權限檢查發生錯誤');
          setHasEditPermission(false);
          console.error('❌ 二險一金權限檢查異常:', error);
        } finally {
          setPermissionLoading(false);
        }
      }
    };

    loadEmployeePermissions();
  }, [employee?.employee_id]);

  // 載入資料
  useEffect(() => {
    if (employee?.employee_id) {
      loadInsuranceData();
    }
  }, [employee]);

  // 監聽編輯模式變化
  useEffect(() => {
    setEditMode(isEditing);
  }, [isEditing]);

  // 載入保險資料
  const loadInsuranceData = async () => {
    if (!employee?.employee_id) return;
    
    // 使用員工薪資初始化
    if (employee.salary) {
      const salary = Number(employee.salary);
      setInsuranceData(prev => ({
        ...prev,
        base_salary: salary,
        labor_insurance_salary: salary,
        health_insurance_salary: salary
      }));
    }
  };

  // 🔥 修正：切換眷保設定 - 加入權限檢查
  const toggleDependents = () => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    setInsuranceData(prev => ({
      ...prev,
      dependents_enabled: !prev.dependents_enabled,
      // 當啟用眷保時自動展開，關閉時自動收起
      dependents_expanded: !prev.dependents_enabled
    }));
  };

  // 展開/收起眷保詳情
  const toggleDependentsExpanded = () => {
    setInsuranceData(prev => ({
      ...prev,
      dependents_expanded: !prev.dependents_expanded
    }));
  };

  // 新增：切換勞退變更記錄展開狀態
  const togglePensionRecordExpanded = () => {
    setInsuranceData(prev => ({
      ...prev,
      pension_record_expanded: !prev.pension_record_expanded
    }));
  };

  // 🔥 修正：切換自願提繳啟用狀態 - 加入權限檢查
  const toggleEmployeeVoluntaryEnabled = () => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    setInsuranceData(prev => ({
      ...prev,
      employee_voluntary_enabled: !prev.employee_voluntary_enabled
    }));
  };

  // 🔥 修正：更新雇主提繳率 - 加入權限檢查
  const updateEmployerContributionRate = (rate) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    setInsuranceData(prev => ({
      ...prev,
      employer_contribution_rate: rate
    }));
  };

  // 🔥 修正：更新自願提繳率 - 加入權限檢查
  const updateEmployeeVoluntaryRate = (rate) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    setInsuranceData(prev => ({
      ...prev,
      employee_voluntary_rate: rate
    }));
  };

  // 🔥 修正：新增眷屬 - 加入權限檢查
  const addDependent = () => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    const newDependent = {
      id: Date.now(),
      name: '',
      birthday: '',
      id_number: '',
      relationship: ''
    };
    setDependentsData(prev => [...prev, newDependent]);
  };

  // 🔥 修正：刪除眷屬 - 加入權限檢查
  const removeDependent = (id) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    setDependentsData(prev => prev.filter(item => item.id !== id));
  };

  // 🔥 修正：更新眷屬資料 - 加入權限檢查
  const updateDependent = (id, field, value) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改二險一金設定');
      return;
    }

    setDependentsData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 計算眷保人數和金額
  const calculateDependentsInfo = () => {
    const validDependents = dependentsData.filter(dep => 
      dep.name && dep.birthday && dep.id_number && dep.relationship
    );
    const count = validDependents.length;
    const amount = count * 326; // 每人326元
    return { count, amount };
  };

  // 🔥 修正：保存資料 - 加入權限檢查
  const handleSaveData = async () => {
    if (!employee?.employee_id) {
      return { success: false, message: '員工ID不存在' };
    }

    if (!hasEditPermission) {
      return { success: false, message: '您沒有權限修改二險一金設定' };
    }

    try {
      setLoading(true);
      // 模擬保存成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: '保險資料更新成功' };
    } catch (error) {
      return { success: false, message: '保存失敗' };
    } finally {
      setLoading(false);
    }
  };

  // 重置表單
  const handleResetForm = () => {
    loadInsuranceData();
    setError('');
  };

  // 格式化金額顯示
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('zh-TW').format(amount || 0);
  };

  // 計算總計
  const calculateTotals = () => {
    const { amount: dependentsAmount } = calculateDependentsInfo();
    const employeeTotal = insuranceData.labor_insurance_employee_fee + 
                         insuranceData.health_insurance_employee_fee + 
                         (insuranceData.dependents_enabled ? dependentsAmount : 0);
                         
    const employerTotal = insuranceData.labor_insurance_employer_fee + 
                         insuranceData.health_insurance_employer_fee;
                         
    return { employeeTotal, employerTotal };
  };

  const { employeeTotal, employerTotal } = calculateTotals();
  const { count: dependentsCount, amount: dependentsAmount } = calculateDependentsInfo();

  if (loading || permissionLoading) {
    return (
      <div className="insurance-loading-container">
        <div className="insurance-loading-spinner"></div>
        <p>{permissionLoading ? '檢查權限中...' : '載入資料中...'}</p>
      </div>
    );
  }

  return (
    <div className="insurance-container">
      
      {/* 🔥 權限錯誤訊息顯示 */}
      {permissionError && (
        <div className="insurance-permission-error" style={{
    color: '#856404',
    padding: '10px',
    margin: '10px 0'
        }}>
          {/* <strong>權限警告：</strong>{permissionError} */}
        </div>
      )}

      {/* 🔥 無權限提示 */}
      {/* {!hasEditPermission && !permissionLoading && (
        <div className="insurance-no-permission" style={{
          backgroundColor: '#f8f9fa',
          color: '#6c757d',
          padding: '15px',
          borderRadius: '4px',
          margin: '10px 0',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <strong>提示：</strong>您目前沒有編輯二險一金的權限，僅能查看資料
        </div>
      )}
       */}
      {/* 自動計算區塊 */}
      <div className="insurance-auto-calc-section">
        
        {/* 全薪 (以月計算) */}
        <div className="insurance-salary-row">
          <div className="insurance-salary-label">全薪 (以月計算)</div>
          <div className="insurance-salary-value">{formatAmount(insuranceData.base_salary)}</div>
        </div>

        {/* 投保級距 */}
        <div className="insurance-grade-row">
          <div className="insurance-grade-info">
            <span className="insurance-grade-label">投保級距</span>
            <span className="insurance-grade-auto">(自動計算)</span>
          </div>
          <div className="insurance-grade-value">
            <span className="insurance-grade-amount">{formatAmount(insuranceData.labor_insurance_salary)}</span>
            <span className="insurance-grade-level">( 第{insuranceData.labor_insurance_grade}級 )</span>
          </div>
        </div>

      </div>

      {/* 勞保自負額 */}
      <div className="insurance-fee-row labor-insurance">
        <div className="insurance-fee-info">
          <span className="insurance-fee-label">勞保自負額</span>
          <span className="insurance-fee-desc">依政府規定自動計算</span>
        </div>
        <div className="insurance-fee-amount">
          <span className="insurance-currency">$</span>
          <span className="insurance-amount">{formatAmount(insuranceData.labor_insurance_employee_fee)}</span>
        </div>
      </div>

      {/* 健保自負額 */}
      <div className="insurance-fee-row health-insurance">
        <div className="insurance-fee-info">
          <span className="insurance-fee-label">健保自負額</span>
          <span className="insurance-fee-desc">依政府規定自動計算</span>
        </div>
        <div className="insurance-fee-amount">
          <span className="insurance-currency">$</span>
          <span className="insurance-amount">{formatAmount(insuranceData.health_insurance_employee_fee)}</span>
        </div>
      </div>

      {/* 🔥 修正：眷保設定 - 加入權限檢查 */}
      <div className={`insurance-dependents-row ${insuranceData.dependents_enabled ? 'active' : ''} ${!hasEditPermission ? 'disabled' : ''}`}>
        <div className="insurance-dependents-info">
          <span className="insurance-dependents-label">眷保設定</span>
          <div 
            className={`insurance-toggle-switch ${insuranceData.dependents_enabled ? 'active' : ''} ${!hasEditPermission ? 'disabled' : ''}`}
            onClick={hasEditPermission ? toggleDependents : undefined}
            style={{
              cursor: hasEditPermission ? 'pointer' : 'not-allowed',
              opacity: hasEditPermission ? 1 : 0.6
            }}
          >
            <div className="insurance-switch-slider">
              <div className="insurance-switch-knob"></div>
            </div>
          </div>
        </div>
        <div className="insurance-expand-control">
          <button 
            className="insurance-expand-btn"
            onClick={toggleDependentsExpanded}
            type="button"
          >
            <img 
              src={insuranceData.dependents_expanded ? UpIcon : DownIcon} 
              alt={insuranceData.dependents_expanded ? "收起" : "展開"} 
              className="insurance-expand-icon-img"
            />
          </button>
        </div>
      </div>

      {/* 眷保資料細項 (展開時顯示) */}
      {insuranceData.dependents_expanded && (
        <div className="insurance-dependents-details">
          <div className="insurance-dependents-sidebar"></div>
          <div className="insurance-dependents-content">
            <div className="insurance-dependents-header">
              <h4 className="insurance-dependents-title">眷保資料</h4>
            </div>
            
            <div className="insurance-dependents-list">
              {dependentsData.map((dependent, index) => (
                <div key={dependent.id} className="insurance-dependent-item">
                  <div className="insurance-dependent-row">
                    {/* 🔥 修正：姓名輸入框 - 加入權限檢查 */}
                    <div className="insurance-input-group">
                      <input
                        type="text"
                        className="insurance-input-field"
                        placeholder="姓名"
                        value={dependent.name}
                        onChange={(e) => updateDependent(dependent.id, 'name', e.target.value)}
                        disabled={!hasEditPermission}
                        style={{
                          backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                          cursor: !hasEditPermission ? 'not-allowed' : 'text'
                        }}
                      />
                    </div>

                    {/* 生日文字標籤 */}
                    <div className="insurance-date-label">
                      <span>生日</span>
                    </div>

                    {/* 🔥 修正：生日輸入框 - 加入權限檢查 */}
                    <div className="insurance-input-group">
                      <div className="insurance-date-input">
                        <input
                          type="text"
                          className="insurance-input-field date-field"
                          value={dependent.birthday}
                          onChange={(e) => updateDependent(dependent.id, 'birthday', e.target.value)}
                          disabled={!hasEditPermission}
                          style={{
                            backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                            cursor: !hasEditPermission ? 'not-allowed' : 'text'
                          }}
                        />
                        <div className="insurance-date-placeholders">
                          <span>民</span>
                          <span>年</span>
                          <span>月</span>
                          <span>日</span>
                        </div>
                      </div>
                    </div>

                    {/* 🔥 修正：身分證字號輸入框 - 加入權限檢查 */}
                    <div className="insurance-input-group">
                      <input
                        type="text"
                        className="insurance-input-field"
                        placeholder="身分證字號"
                        value={dependent.id_number}
                        onChange={(e) => updateDependent(dependent.id, 'id_number', e.target.value)}
                        disabled={!hasEditPermission}
                        style={{
                          backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                          cursor: !hasEditPermission ? 'not-allowed' : 'text'
                        }}
                      />
                    </div>

                    {/* 🔥 修正：稱謂輸入框 - 加入權限檢查 */}
                    <div className="insurance-input-group">
                      <div className="insurance-select-wrapper">
                        <select
                          className="insurance-select-field"
                          value={dependent.relationship}
                          onChange={(e) => updateDependent(dependent.id, 'relationship', e.target.value)}
                          disabled={!hasEditPermission}
                          style={{
                            backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                            cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="">稱謂</option>
                          <option value="1-配偶">1-配偶</option>
                          <option value="2-父母">2-父母</option>
                          <option value="3-子女">3-子女</option>
                        </select>
                        <svg className="insurance-select-arrow" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" fill="#3A6CA6"/>
                        </svg>
                      </div>
                    </div>

                    {/* 🔥 修正：操作按鈕 - 加入權限檢查 */}
                    <div className="insurance-action-buttons">
                      <button
                        type="button"
                        className="insurance-remove-btn"
                        onClick={() => removeDependent(dependent.id)}
                        disabled={!hasEditPermission}
                        style={{
                          opacity: !hasEditPermission ? 0.5 : 1,
                          cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <img src={ReduceIcon} alt="刪除" className="insurance-btn-icon" />
                      </button>
                      <button
                        type="button"
                        className="insurance-add-btn"
                        onClick={addDependent}
                        disabled={!hasEditPermission}
                        style={{
                          opacity: !hasEditPermission ? 0.5 : 1,
                          cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <img src={IncreaseIcon} alt="新增" className="insurance-btn-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 眷保統計資訊 */}
            <div className="insurance-dependents-summary">
              <div className="insurance-summary-row">
                <span className="insurance-summary-text">眷保人數</span>
                <span className="insurance-summary-value">{dependentsCount}人</span>
              </div>
              <div className="insurance-summary-row">
                <span className="insurance-summary-text">眷保金額</span>
                <span className="insurance-summary-value">${dependentsAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 勞工退休金提繳率 */}
      <div className="insurance-pension-row">
        <div className="insurance-pension-info">
          <span className="insurance-pension-label">勞工退休金提繳率</span>
        </div>
        <div className="insurance-pension-control">
          <button 
            className="insurance-record-btn"
            onClick={togglePensionRecordExpanded}
            type="button"
          >
            變更記錄
          </button>
        </div>
      </div>

      {/* 勞退提撥資料細項 (展開時顯示) */}
      {insuranceData.pension_record_expanded && (
        <div className="insurance-pension-details">
          <div className="insurance-pension-sidebar"></div>
          <div className="insurance-pension-content">
            
            {/* 雇主提繳率 */}
            <div className="insurance-pension-item">
              <div className="insurance-pension-item-content">
                <div className="insurance-pension-setting">
                  <div className="insurance-pension-title-group">
                    <span className="insurance-pension-title">雇主提繳率</span>
                  </div>
                  <div 
                    className="insurance-pension-dropdown"
                    style={{
                      opacity: !hasEditPermission ? 0.6 : 1,
                      cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <div className="insurance-pension-dropdown-content">
                      <span className="insurance-pension-rate">{insuranceData.employer_contribution_rate}%</span>
                      <img src={DownIcon} alt="下拉" className="insurance-pension-arrow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔥 修正：自願提繳率 - 加入權限檢查 */}
            <div className="insurance-pension-item">
              <div className="insurance-pension-item-content">
                <div className="insurance-pension-setting">
                  <div className="insurance-pension-title-group">
                    <span className="insurance-pension-title">自願提繳率</span>
                    <div 
                      className={`insurance-toggle-switch ${insuranceData.employee_voluntary_enabled ? 'active' : ''} ${!hasEditPermission ? 'disabled' : ''}`}
                      onClick={hasEditPermission ? toggleEmployeeVoluntaryEnabled : undefined}
                      style={{
                        cursor: hasEditPermission ? 'pointer' : 'not-allowed',
                        opacity: hasEditPermission ? 1 : 0.6
                      }}
                    >
                      <div className="insurance-switch-slider">
                        <div className="insurance-switch-knob"></div>
                      </div>
                    </div>
                  </div>
                  {/* 只有在滑竿打開時才顯示下拉選單 */}
                  {insuranceData.employee_voluntary_enabled && (
                    <div 
                      className="insurance-pension-dropdown"
                      style={{
                        opacity: !hasEditPermission ? 0.6 : 1,
                        cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <div className="insurance-pension-dropdown-content">
                        <span className="insurance-pension-rate">{insuranceData.employee_voluntary_rate}%</span>
                        <img src={DownIcon} alt="下拉" className="insurance-pension-arrow" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 總計區域 */}
      <div className="insurance-summary">
        <div className="insurance-summary-left">
          <span className="insurance-summary-label">雇主負擔合計</span>
          <span className="insurance-summary-amount">{formatAmount(employerTotal)}</span>
          <span className="insurance-summary-unit">元</span>
        </div>
        <div className="insurance-summary-divider"></div>
        <div className="insurance-summary-right">
          <span className="insurance-summary-label">勞工自負合計</span>
          <span className="insurance-summary-amount">{formatAmount(employeeTotal)}</span>
          <span className="insurance-summary-unit">元</span>
        </div>
      </div>

    </div>
  );
});

TwoInsurancesAndOneHousingFund.displayName = 'TwoInsurancesAndOneHousingFund';

export default TwoInsurancesAndOneHousingFund;
