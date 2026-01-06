// // import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// // import axios from 'axios';
// // import Cookies from 'js-cookie';

// // const PayrollAccountRelated = forwardRef(({ employee, isEditing = false, onDataChange }, ref) => {
// //   // 薪資帳戶狀態
// //   const [payrollAccount, setPayrollAccount] = useState(null);
// //   const [loadingPayrollAccount, setLoadingPayrollAccount] = useState(false);
// //   const [editForm, setEditForm] = useState({
// //     Bank_Name: '',
// //     Branch_Name: '',
// //     Bank_account: ''
// //   });

// //   // 查詢薪資帳戶的函數
// //   const fetchPayrollAccount = async () => {
// //     if (!employee?.employee_id) return;
    
// //     setLoadingPayrollAccount(true);
// //     try {
// //       const companyId = Cookies.get('company_id') || '76014406';
      
// //       console.log('查詢薪資帳戶:', {
// //         company_id: companyId,
// //         employee_id: employee.employee_id
// //       });

// //       const response = await axios.get(
// //         `https://rabbit.54ucl.com:3004/api/payroll-accounts/employee/${companyId}/${employee.employee_id}`,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           }
// //         }
// //       );

// //       console.log('薪資帳戶 API 回應:', response.data);

// //       if (response.data.Status === 'Ok') {
// //         setPayrollAccount(response.data.Data);
// //         setEditForm({
// //           Bank_Name: response.data.Data.Bank_Name || '',
// //           Branch_Name: response.data.Data.Branch_Name || '',
// //           Bank_account: response.data.Data.Bank_account || ''
// //         });
// //       } else {
// //         console.log('未找到薪資帳戶資料:', response.data.Msg);
// //         setPayrollAccount(null);
// //         setEditForm({
// //           Bank_Name: '',
// //           Branch_Name: '',
// //           Bank_account: ''
// //         });
// //       }
// //     } catch (error) {
// //       console.error('查詢薪資帳戶失敗:', error);
// //       setPayrollAccount(null);
// //       setEditForm({
// //         Bank_Name: '',
// //         Branch_Name: '',
// //         Bank_account: ''
// //       });
// //     } finally {
// //       setLoadingPayrollAccount(false);
// //     }
// //   };

// //   // 當員工資料變更時，重新查詢相關資料
// //   useEffect(() => {
// //     if (employee?.employee_id) {
// //       fetchPayrollAccount();
// //     }
// //   }, [employee?.employee_id]);

// //   // 處理表單變更
// //   const handleFormChange = (fieldName, value) => {
// //     setEditForm(prev => ({
// //       ...prev,
// //       [fieldName]: value
// //     }));
    
// //     // 通知父組件數據變更
// //     if (onDataChange) {
// //       onDataChange(fieldName, value);
// //     }
// //   };

// //   // 獲取銀行代碼的函數
// //   const getBankCode = (bankName) => {
// //     const bankCodes = {
// //       '台灣銀行': '004',
// //       '中國信託': '822',
// //       '玉山銀行': '808',
// //       '第一銀行': '007',
// //       '華南銀行': '008',
// //       '彰化銀行': '009',
// //       '上海商銀': '011',
// //       '台北富邦': '012',
// //       '國泰世華': '013'
// //     };
// //     return bankCodes[bankName] || '';
// //   };

// //   // 銀行選項
// //   const bankOptions = [
// //     { value: '台灣銀行', label: '台灣銀行' },
// //     { value: '中國信託', label: '中國信託' },
// //     { value: '玉山銀行', label: '玉山銀行' },
// //     { value: '第一銀行', label: '第一銀行' },
// //     { value: '華南銀行', label: '華南銀行' },
// //     { value: '彰化銀行', label: '彰化銀行' },
// //     { value: '上海商銀', label: '上海商銀' },
// //     { value: '台北富邦', label: '台北富邦' },
// //     { value: '國泰世華', label: '國泰世華' }
// //   ];

// //   // 🔥 修改：保存薪資帳戶資料 - 使用 PUT API
// //   const savePayrollAccount = async () => {
// //     if (!employee?.employee_id) return false;
    
// //     try {
// //       const companyId = Cookies.get('company_id') || '76014406';
      
// //       // 如果已有薪資帳戶資料，使用 PUT 更新；否則使用 POST 新增
// //       if (payrollAccount && payrollAccount.id) {
// //         // 🔥 使用 PUT API 更新現有薪資帳戶
// //         const updateData = {
// //           company_id: companyId,
// //           employee_id: employee.employee_id,
// //           Bank_Name: editForm.Bank_Name,
// //           Branch_Name: editForm.Branch_Name,
// //           Bank_account: editForm.Bank_account,
// //           updated_by: 'admin'
// //         };

// //         console.log('更新薪資帳戶資料:', updateData);
// //         console.log('使用 PUT API，帳戶 ID:', payrollAccount.id);

// //         const response = await axios.put(
// //           `https://rabbit.54ucl.com:3004/api/payroll-accounts/${payrollAccount.id}`,
// //           updateData,
// //           {
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Accept': 'application/json'
// //             }
// //           }
// //         );

// //         console.log('更新薪資帳戶 API 回應:', response.data);

// //         if (response.data.Status === 'Ok') {
// //           setPayrollAccount(response.data.Data);
// //           return true;
// //         } else {
// //           console.error('更新失敗:', response.data.Msg);
// //           return false;
// //         }
// //       } else {
// //         // 🔥 使用 POST API 新增薪資帳戶
// //         const saveData = {
// //           company_id: companyId,
// //           employee_id: employee.employee_id,
// //           Bank_Name: editForm.Bank_Name,
// //           Branch_Name: editForm.Branch_Name,
// //           Bank_account: editForm.Bank_account,
// //           created_by: 'admin'
// //         };

// //         console.log('新增薪資帳戶資料:', saveData);

// //         const response = await axios.post(
// //           'https://rabbit.54ucl.com:3004/api/payroll-accounts',
// //           saveData,
// //           {
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Accept': 'application/json'
// //             }
// //           }
// //         );

// //         console.log('新增薪資帳戶 API 回應:', response.data);

// //         if (response.data.Status === 'Ok') {
// //           setPayrollAccount(response.data.Data);
// //           return true;
// //         } else {
// //           console.error('新增失敗:', response.data.Msg);
// //           return false;
// //         }
// //       }
// //     } catch (error) {
// //       console.error('保存薪資帳戶失敗:', error);
// //       return false;
// //     }
// //   };

// //   // 🔥 修改：暴露保存方法給父組件
// //   useImperativeHandle(ref, () => ({
// //     savePayrollAccount,
// //     getEditForm: () => editForm,
// //     resetForm: () => {
// //       if (payrollAccount) {
// //         setEditForm({
// //           Bank_Name: payrollAccount.Bank_Name || '',
// //           Branch_Name: payrollAccount.Branch_Name || '',
// //           Bank_account: payrollAccount.Bank_account || ''
// //         });
// //       } else {
// //         setEditForm({
// //           Bank_Name: '',
// //           Branch_Name: '',
// //           Bank_account: ''
// //         });
// //       }
// //     }
// //   }));

// //   return (
// //     <div className="salary-account-block">
// //       <div className="salary-account-title">
// //         薪資帳戶
// //       </div>

// //       <div className="salary-account-content">
// //         {loadingPayrollAccount ? (
// //           <div className="loading-message">
// //             載入薪資帳戶資料中...
// //           </div>
// //         ) : (
// //           <>
// //             {/* 銀行名稱 */}
// //             <div className="salary-info-row">
// //               <span className="info-label">銀行名稱(代碼)</span>
// //               {isEditing ? (
// //                 <select
// //                   value={editForm.Bank_Name}
// //                   onChange={(e) => handleFormChange('Bank_Name', e.target.value)}
// //                   className="bank-select"
// //                 >
// //                   <option value="">請選擇銀行</option>
// //                   {bankOptions.map(option => (
// //                     <option key={option.value} value={option.value}>
// //                       {option.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //               ) : (
// //                 <div className="bank-info">
// //                   <span className="bank-name">{payrollAccount?.Bank_Name || editForm.Bank_Name || '尚未設定薪資帳戶'}</span>
// //                   {(payrollAccount?.Bank_Name || editForm.Bank_Name) && (
// //                     <span className="bank-code">({getBankCode(payrollAccount?.Bank_Name || editForm.Bank_Name)})</span>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {/* 分行名稱 */}
// //             <div className="salary-info-row">
// //               <span className="info-label">分行名稱(代碼)</span>
// //               {isEditing ? (
// //                 <input
// //                   type="text"
// //                   value={editForm.Branch_Name}
// //                   onChange={(e) => handleFormChange('Branch_Name', e.target.value)}
// //                   className="branch-input"
// //                   placeholder="請輸入分行名稱"
// //                 />
// //               ) : (
// //                 <div className="bank-info">
// //                   <span className="branch-name">{payrollAccount?.Branch_Name || editForm.Branch_Name || '-'}</span>
// //                   <span className="branch-code"></span>
// //                 </div>
// //               )}
// //             </div>

// //             {/* 帳號 */}
// //             <div className="salary-info-row">
// //               <span className="info-label">帳號</span>
// //               {isEditing ? (
// //                 <input
// //                   type="text"
// //                   value={editForm.Bank_account}
// //                   onChange={(e) => handleFormChange('Bank_account', e.target.value)}
// //                   className="account-input"
// //                   placeholder="請輸入銀行帳號"
// //                 />
// //               ) : (
// //                 <span className="account-number">{payrollAccount?.Bank_account || editForm.Bank_account || '-'}</span>
// //               )}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // });

// // PayrollAccountRelated.displayName = 'PayrollAccountRelated';

// // export default PayrollAccountRelated;

// import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const PayrollAccountRelated = forwardRef(({ employee, isEditing = false, onDataChange }, ref) => {
//   // 薪資帳戶狀態
//   const [payrollAccount, setPayrollAccount] = useState(null);
//   const [loadingPayrollAccount, setLoadingPayrollAccount] = useState(false);
//   const [editForm, setEditForm] = useState({
//     Bank_Name: '',
//     Branch_Name: '',
//     Bank_account: ''
//   });

//   // 查詢薪資帳戶的函數
//   const fetchPayrollAccount = async () => {
//     if (!employee?.employee_id) return;
    
//     setLoadingPayrollAccount(true);
//     try {
//       const companyId = Cookies.get('company_id') || '76014406';
      
//       console.log('查詢薪資帳戶:', {
//         company_id: companyId,
//         employee_id: employee.employee_id
//       });

//       const response = await axios.get(
//         `https://rabbit.54ucl.com:3004/api/payroll-accounts/employee/${companyId}/${employee.employee_id}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         }
//       );

//       console.log('薪資帳戶 API 回應:', response.data);

//       if (response.data.Status === 'Ok') {
//         setPayrollAccount(response.data.Data);
//         setEditForm({
//           Bank_Name: response.data.Data.Bank_Name || '',
//           Branch_Name: response.data.Data.Branch_Name || '',
//           Bank_account: response.data.Data.Bank_account || ''
//         });
//       } else {
//         console.log('未找到薪資帳戶資料:', response.data.Msg);
//         setPayrollAccount(null);
//         setEditForm({
//           Bank_Name: '',
//           Branch_Name: '',
//           Bank_account: ''
//         });
//       }
//     } catch (error) {
//       console.error('查詢薪資帳戶失敗:', error);
//       setPayrollAccount(null);
//       setEditForm({
//         Bank_Name: '',
//         Branch_Name: '',
//         Bank_account: ''
//       });
//     } finally {
//       setLoadingPayrollAccount(false);
//     }
//   };

//   // 當員工資料變更時，重新查詢相關資料
//   useEffect(() => {
//     if (employee?.employee_id) {
//       fetchPayrollAccount();
//     }
//   }, [employee?.employee_id]);

//   // 處理表單變更
//   const handleFormChange = (fieldName, value) => {
//     setEditForm(prev => ({
//       ...prev,
//       [fieldName]: value
//     }));
    
//     // 通知父組件數據變更
//     if (onDataChange) {
//       onDataChange(fieldName, value);
//     }
//   };

//   // 獲取銀行代碼的函數
//   const getBankCode = (bankName) => {
//     const bankCodes = {
//       '台灣銀行': '004',
//       '中國信託': '822',
//       '玉山銀行': '808',
//       '第一銀行': '007',
//       '華南銀行': '008',
//       '彰化銀行': '009',
//       '上海商銀': '011',
//       '台北富邦': '012',
//       '國泰世華': '013'
//     };
//     return bankCodes[bankName] || '';
//   };

//   // 銀行選項
//   const bankOptions = [
//     { value: '台灣銀行', label: '台灣銀行' },
//     { value: '中國信託', label: '中國信託' },
//     { value: '玉山銀行', label: '玉山銀行' },
//     { value: '第一銀行', label: '第一銀行' },
//     { value: '華南銀行', label: '華南銀行' },
//     { value: '彰化銀行', label: '彰化銀行' },
//     { value: '上海商銀', label: '上海商銀' },
//     { value: '台北富邦', label: '台北富邦' },
//     { value: '國泰世華', label: '國泰世華' }
//   ];

//   // 🔥 修改：保存薪資帳戶資料，返回結果對象
//   const savePayrollAccount = async () => {
//     if (!employee?.employee_id) {
//       return { success: false, message: '員工ID不存在' };
//     }
    
//     try {
//       const companyId = Cookies.get('company_id') || '76014406';
      
//       // 如果已有薪資帳戶資料，使用 PUT 更新；否則使用 POST 新增
//       if (payrollAccount && payrollAccount.id) {
//         // 使用 PUT API 更新現有薪資帳戶
//         const updateData = {
//           company_id: companyId,
//           employee_id: employee.employee_id,
//           Bank_Name: editForm.Bank_Name,
//           Branch_Name: editForm.Branch_Name,
//           Bank_account: editForm.Bank_account,
//           updated_by: 'admin'
//         };

//         console.log('更新薪資帳戶資料:', updateData);
//         console.log('使用 PUT API，帳戶 ID:', payrollAccount.id);

//         const response = await axios.put(
//           `https://rabbit.54ucl.com:3004/api/payroll-accounts/${payrollAccount.id}`,
//           updateData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           }
//         );

//         console.log('更新薪資帳戶 API 回應:', response.data);

//         if (response.data.Status === 'Ok') {
//           setPayrollAccount(response.data.Data);
//           return { success: true, message: '薪資帳戶更新成功' };
//         } else {
//           console.error('更新失敗:', response.data.Msg);
//           return { success: false, message: response.data.Msg || '更新失敗' };
//         }
//       } else {
//         // 使用 POST API 新增薪資帳戶
//         const saveData = {
//           company_id: companyId,
//           employee_id: employee.employee_id,
//           Bank_Name: editForm.Bank_Name,
//           Branch_Name: editForm.Branch_Name,
//           Bank_account: editForm.Bank_account,
//           created_by: 'admin'
//         };

//         console.log('新增薪資帳戶資料:', saveData);

//         const response = await axios.post(
//           'https://rabbit.54ucl.com:3004/api/payroll-accounts',
//           saveData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           }
//         );

//         console.log('新增薪資帳戶 API 回應:', response.data);

//         if (response.data.Status === 'Ok') {
//           setPayrollAccount(response.data.Data);
//           return { success: true, message: '薪資帳戶新增成功' };
//         } else {
//           console.error('新增失敗:', response.data.Msg);
//           return { success: false, message: response.data.Msg || '新增失敗' };
//         }
//       }
//     } catch (error) {
//       console.error('保存薪資帳戶失敗:', error);
//       return { 
//         success: false, 
//         message: error.response?.data?.Msg || '網路錯誤，請稍後再試' 
//       };
//     }
//   };

//   // 🔥 修改：暴露方法給父組件
//   useImperativeHandle(ref, () => ({
//     savePayrollAccount,
//     getEditForm: () => editForm,
//     resetForm: () => {
//       if (payrollAccount) {
//         setEditForm({
//           Bank_Name: payrollAccount.Bank_Name || '',
//           Branch_Name: payrollAccount.Branch_Name || '',
//           Bank_account: payrollAccount.Bank_account || ''
//         });
//       } else {
//         setEditForm({
//           Bank_Name: '',
//           Branch_Name: '',
//           Bank_account: ''
//         });
//       }
//     }
//   }));

//   return (
//     <div className="salary-account-block">
//       <div className="salary-account-title">
//         薪資帳戶
//       </div>

//       <div className="salary-account-content">
//         {loadingPayrollAccount ? (
//           <div className="loading-message">
//             載入薪資帳戶資料中...
//           </div>
//         ) : (
//           <>
//             {/* 銀行名稱 */}
//             <div className="salary-info-row">
//               <span className="info-label">銀行名稱(代碼)</span>
//               {isEditing ? (
//                 <select
//                   value={editForm.Bank_Name}
//                   onChange={(e) => handleFormChange('Bank_Name', e.target.value)}
//                   className="bank-select"
//                 >
//                   <option value="">請選擇銀行</option>
//                   {bankOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <div className="bank-info">
//                   <span className="bank-name">{payrollAccount?.Bank_Name || editForm.Bank_Name || '尚未設定薪資帳戶'}</span>
//                   {(payrollAccount?.Bank_Name || editForm.Bank_Name) && (
//                     <span className="bank-code">({getBankCode(payrollAccount?.Bank_Name || editForm.Bank_Name)})</span>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* 分行名稱 */}
//             <div className="salary-info-row">
//               <span className="info-label">分行名稱(代碼)</span>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={editForm.Branch_Name}
//                   onChange={(e) => handleFormChange('Branch_Name', e.target.value)}
//                   className="branch-input"
//                   placeholder="請輸入分行名稱"
//                 />
//               ) : (
//                 <div className="bank-info">
//                   <span className="branch-name">{payrollAccount?.Branch_Name || editForm.Branch_Name || '-'}</span>
//                   <span className="branch-code"></span>
//                 </div>
//               )}
//             </div>

//             {/* 帳號 */}
//             <div className="salary-info-row">
//               <span className="info-label">帳號</span>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={editForm.Bank_account}
//                   onChange={(e) => handleFormChange('Bank_account', e.target.value)}
//                   className="account-input"
//                   placeholder="請輸入銀行帳號"
//                 />
//               ) : (
//                 <span className="account-number">{payrollAccount?.Bank_account || editForm.Bank_account || '-'}</span>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// });

// PayrollAccountRelated.displayName = 'PayrollAccountRelated';

// export default PayrollAccountRelated;
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// 🔥 引入 API_BASE_URL 配置
import { API_BASE_URL } from '../../../../config';

const PayrollAccountRelated = forwardRef(({ employee, isEditing = false, onDataChange }, ref) => {
  // 薪資帳戶狀態
  const [payrollAccount, setPayrollAccount] = useState(null);
  const [loadingPayrollAccount, setLoadingPayrollAccount] = useState(false);
  const [editForm, setEditForm] = useState({
    Bank_Name: '',
    Branch_Name: '',
    Bank_account: ''
  });

  // 查詢薪資帳戶的函數
  const fetchPayrollAccount = async () => {
    if (!employee?.employee_id) return;
    
    setLoadingPayrollAccount(true);
    try {
      const companyId = Cookies.get('company_id') || '76014406';
      
      console.log('查詢薪資帳戶:', {
        company_id: companyId,
        employee_id: employee.employee_id
      });

      // 🔥 使用 API_BASE_URL 替換硬編碼的 URL
      const response = await axios.get(
        `${API_BASE_URL}/api/payroll-accounts/employee/${companyId}/${employee.employee_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('薪資帳戶 API 回應:', response.data);

      if (response.data.Status === 'Ok') {
        setPayrollAccount(response.data.Data);
        setEditForm({
          Bank_Name: response.data.Data.Bank_Name || '',
          Branch_Name: response.data.Data.Branch_Name || '',
          Bank_account: response.data.Data.Bank_account || ''
        });
      } else {
        console.log('未找到薪資帳戶資料:', response.data.Msg);
        setPayrollAccount(null);
        setEditForm({
          Bank_Name: '',
          Branch_Name: '',
          Bank_account: ''
        });
      }
    } catch (error) {
      console.error('查詢薪資帳戶失敗:', error);
      setPayrollAccount(null);
      setEditForm({
        Bank_Name: '',
        Branch_Name: '',
        Bank_account: ''
      });
    } finally {
      setLoadingPayrollAccount(false);
    }
  };

  // 當員工資料變更時，重新查詢相關資料
  useEffect(() => {
    if (employee?.employee_id) {
      fetchPayrollAccount();
    }
  }, [employee?.employee_id]);

  // 處理表單變更
  const handleFormChange = (fieldName, value) => {
    setEditForm(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // 通知父組件數據變更
    if (onDataChange) {
      onDataChange(fieldName, value);
    }
  };

  // 獲取銀行代碼的函數
  const getBankCode = (bankName) => {
    const bankCodes = {
      '台灣銀行': '004',
      '中國信託': '822',
      '玉山銀行': '808',
      '第一銀行': '007',
      '華南銀行': '008',
      '彰化銀行': '009',
      '上海商銀': '011',
      '台北富邦': '012',
      '國泰世華': '013'
    };
    return bankCodes[bankName] || '';
  };

  // 銀行選項
  const bankOptions = [
    { value: '台灣銀行', label: '台灣銀行' },
    { value: '中國信託', label: '中國信託' },
    { value: '玉山銀行', label: '玉山銀行' },
    { value: '第一銀行', label: '第一銀行' },
    { value: '華南銀行', label: '華南銀行' },
    { value: '彰化銀行', label: '彰化銀行' },
    { value: '上海商銀', label: '上海商銀' },
    { value: '台北富邦', label: '台北富邦' },
    { value: '國泰世華', label: '國泰世華' }
  ];

  // 🔥 修改：保存薪資帳戶資料，返回結果對象
  const savePayrollAccount = async () => {
    if (!employee?.employee_id) {
      return { success: false, message: '員工ID不存在' };
    }
    
    try {
      const companyId = Cookies.get('company_id') || '76014406';
      
      // 如果已有薪資帳戶資料，使用 PUT 更新；否則使用 POST 新增
      if (payrollAccount && payrollAccount.id) {
        // 使用 PUT API 更新現有薪資帳戶
        const updateData = {
          company_id: companyId,
          employee_id: employee.employee_id,
          Bank_Name: editForm.Bank_Name,
          Branch_Name: editForm.Branch_Name,
          Bank_account: editForm.Bank_account,
          updated_by: 'admin'
        };

        console.log('更新薪資帳戶資料:', updateData);
        console.log('使用 PUT API，帳戶 ID:', payrollAccount.id);

        // 🔥 使用 API_BASE_URL 替換硬編碼的 URL
        const response = await axios.put(
          `${API_BASE_URL}/api/payroll-accounts/${payrollAccount.id}`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('更新薪資帳戶 API 回應:', response.data);

        if (response.data.Status === 'Ok') {
          setPayrollAccount(response.data.Data);
          return { success: true, message: '薪資帳戶更新成功' };
        } else {
          console.error('更新失敗:', response.data.Msg);
          return { success: false, message: response.data.Msg || '更新失敗' };
        }
      } else {
        // 使用 POST API 新增薪資帳戶
        const saveData = {
          company_id: companyId,
          employee_id: employee.employee_id,
          Bank_Name: editForm.Bank_Name,
          Branch_Name: editForm.Branch_Name,
          Bank_account: editForm.Bank_account,
          created_by: 'admin'
        };

        console.log('新增薪資帳戶資料:', saveData);

        // 🔥 使用 API_BASE_URL 替換硬編碼的 URL
        const response = await axios.post(
          `${API_BASE_URL}/api/payroll-accounts`,
          saveData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('新增薪資帳戶 API 回應:', response.data);

        if (response.data.Status === 'Ok') {
          setPayrollAccount(response.data.Data);
          return { success: true, message: '薪資帳戶新增成功' };
        } else {
          console.error('新增失敗:', response.data.Msg);
          return { success: false, message: response.data.Msg || '新增失敗' };
        }
      }
    } catch (error) {
      console.error('保存薪資帳戶失敗:', error);
      return { 
        success: false, 
        message: error.response?.data?.Msg || '網路錯誤，請稍後再試' 
      };
    }
  };

  // 🔥 修改：暴露方法給父組件
  useImperativeHandle(ref, () => ({
    savePayrollAccount,
    getEditForm: () => editForm,
    resetForm: () => {
      if (payrollAccount) {
        setEditForm({
          Bank_Name: payrollAccount.Bank_Name || '',
          Branch_Name: payrollAccount.Branch_Name || '',
          Bank_account: payrollAccount.Bank_account || ''
        });
      } else {
        setEditForm({
          Bank_Name: '',
          Branch_Name: '',
          Bank_account: ''
        });
      }
    }
  }));

  return (
    <div className="salary-account-block">
      <div className="salary-account-title">
        薪資帳戶
      </div>

      <div className="salary-account-content">
        {loadingPayrollAccount ? (
          <div className="loading-message">
            載入薪資帳戶資料中...
          </div>
        ) : (
          <>
            {/* 銀行名稱 */}
            <div className="salary-info-row">
              <span className="info-label">銀行名稱(代碼)</span>
              {isEditing ? (
                <select
                  value={editForm.Bank_Name}
                  onChange={(e) => handleFormChange('Bank_Name', e.target.value)}
                  className="bank-select"
                >
                  <option value="">請選擇銀行</option>
                  {bankOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bank-info">
                  <span className="bank-name">{payrollAccount?.Bank_Name || editForm.Bank_Name || '尚未設定薪資帳戶'}</span>
                  {(payrollAccount?.Bank_Name || editForm.Bank_Name) && (
                    <span className="bank-code">({getBankCode(payrollAccount?.Bank_Name || editForm.Bank_Name)})</span>
                  )}
                </div>
              )}
            </div>

            {/* 分行名稱 */}
            <div className="salary-info-row">
              <span className="info-label">分行名稱(代碼)</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.Branch_Name}
                  onChange={(e) => handleFormChange('Branch_Name', e.target.value)}
                  className="branch-input"
                  placeholder="請輸入分行名稱"
                />
              ) : (
                <div className="bank-info">
                  <span className="branch-name">{payrollAccount?.Branch_Name || editForm.Branch_Name || '-'}</span>
                  <span className="branch-code"></span>
                </div>
              )}
            </div>

            {/* 帳號 */}
            <div className="salary-info-row">
              <span className="info-label">帳號</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.Bank_account}
                  onChange={(e) => handleFormChange('Bank_account', e.target.value)}
                  className="account-input"
                  placeholder="請輸入銀行帳號"
                />
              ) : (
                <span className="account-number">{payrollAccount?.Bank_account || editForm.Bank_account || '-'}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

PayrollAccountRelated.displayName = 'PayrollAccountRelated';

export default PayrollAccountRelated;
