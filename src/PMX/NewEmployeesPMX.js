// import React, { useState } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faUser, 
//   faBuilding, 
//   faSpinner, 
//   faSave, 
//   faTimes, 
//   faCalendarAlt, 
//   faPhone, 
//   faEnvelope, 
//   faMapMarkerAlt,
//   faIdCard,
//   faDollarSign,
//   faUsers,
//   faCheck,
//   faExclamationTriangle
// } from '@fortawesome/free-solid-svg-icons';

// const CreateEmployeeForm = React.memo(() => {
//   // 🔥 基本資料狀態 - 預設公司統編和公司名稱
//   const [formData, setFormData] = useState({
//     company_id: '12400620',        // 🔥 寫死公司統編
//     employee_id: '',
//     password: '',
//     confirmPassword: '',
//     company_name: '台灣波力梅',    // 🔥 寫死公司名稱
//     name: '',
//     date_of_birth: '',
//     gender: '',
//     id_number: '',
//     registered_address: '',
//     mailing_address: '',
//     mobile_number: '',
//     landline_number: '',
//     shift_system: '',
//     employment_status: 'Active',
//     salary_type: '',
//     department: '',
//     position: '',
//     job_grade: '',
//     post_training_control: null,
//     retirement_fund_self_contribution: '',
//     dependent_insurance: null,
//     supervisor: ''
//   });

//   // 表單狀態
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showError, setShowError] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // API 端點
//   const EMPLOYEE_CREATE_API_URL = 'https://rabbit.54ucl.com:3004/api/employee/create';
//   const SSO_REGISTER_API_URL = 'https://identityprovider.54ucl.com:1989/api/register';

//   // 🔥 新增市話號碼格式化函數
//   const formatLandlineNumber = (value) => {
//     // 移除所有非數字字符
//     const numbers = value.replace(/\D/g, '');
    
//     // 如果長度不足，直接返回
//     if (numbers.length < 3) return numbers;
    
//     // 根據長度進行格式化
//     if (numbers.length <= 9) {
//       // 2碼區碼格式：07-3562988
//       return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
//     } else if (numbers.length <= 10) {
//       // 3碼區碼格式：037-562988
//       return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
//     } else {
//       // 超過10碼，截斷並格式化
//       const truncated = numbers.slice(0, 10);
//       return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
//     }
//   };

//   // 🔥 修改處理輸入變更函數
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     let processedValue = value;
    
//     // 身分證號自動轉換為大寫
//     if (name === 'id_number') {
//       processedValue = value.toUpperCase();
//     }
    
//     // 🔥 市話號碼自動格式化
//     if (name === 'landline_number') {
//       processedValue = formatLandlineNumber(value);
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : processedValue
//     }));

//     // 清除該欄位的驗證錯誤
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   // 驗證表單
//   const validateForm = () => {
//     const errors = {};

//     // 必要欄位驗證
//     const requiredFields = [
//       'company_id', 'employee_id', 'password', 'company_name', 
//       'name', 'date_of_birth', 'gender', 'id_number', 
//       'registered_address', 'mobile_number', 'employment_status', 
//       'salary_type', 'supervisor'
//     ];

//     requiredFields.forEach(field => {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         errors[field] = '此欄位為必填';
//       }
//     });

//     // 公司ID格式驗證
//     if (formData.company_id && formData.company_id.length < 8) {
//       errors.company_id = '公司統編至少需要8位數字';
//     }

//     // 員工ID格式驗證
//     if (formData.employee_id && !/^\d+$/.test(formData.employee_id)) {
//       errors.employee_id = '員工ID只能包含數字';
//     }

//     // 密碼驗證
//     if (formData.password && formData.password.length < 6) {
//       errors.password = '密碼長度至少需要6個字元';
//     }

//     // 確認密碼驗證
//     if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = '密碼確認不一致';
//     }

//     // 身分證號格式驗證（台灣格式）
//     if (formData.id_number && !/^[A-Z][0-9]{9}$/.test(formData.id_number)) {
//       errors.id_number = '身分證號格式不正確（例：A123456789）';
//     }

//     // 手機號碼格式驗證
//     if (formData.mobile_number && !/^09\d{8}$/.test(formData.mobile_number)) {
//       errors.mobile_number = '手機號碼格式不正確（例：0912345678）';
//     }

//     // 🔥 市話號碼格式驗證（更新正則表達式）
//     if (formData.landline_number && !/^\d{2,3}-\d{6,8}$/.test(formData.landline_number)) {
//       errors.landline_number = '市話號碼格式不正確（例：07-3562988）';
//     }

//     // 退休金提撥率驗證（如果有填寫）
//     if (formData.retirement_fund_self_contribution && 
//         (isNaN(formData.retirement_fund_self_contribution) || 
//          formData.retirement_fund_self_contribution < 0 || 
//          formData.retirement_fund_self_contribution > 100)) {
//       errors.retirement_fund_self_contribution = '退休金提撥率必須是0-100之間的數字';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // SSO 註冊函數
//   const registerSSO = async (employeeId, name, password) => {
//     try {
//       const ssoData = {
//         username: name,
//         email: `${employeeId}@2330.rm`,
//         password: password
//       };

//       console.log('正在註冊 SSO 帳號:', ssoData);

//       const response = await axios.post(SSO_REGISTER_API_URL, ssoData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         timeout: 30000
//       });

//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error) {
//       console.error('SSO 註冊失敗:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.response?.data?.error || error.message || 'SSO 註冊失敗'
//       };
//     }
//   };

//   // 處理表單提交
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setError('請修正表單中的錯誤');
//       setShowError(true);
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');
//     setShowError(false);
//     setShowSuccess(false);

//     let employeeCreated = false;
//     let ssoRegistered = false;
//     let employeeResult = null;
//     let ssoResult = null;

//     try {
//       // 準備提交資料（移除確認密碼欄位）
//       const { confirmPassword, ...submitData } = formData;
      
//       // 轉換資料類型
//       const processedData = {
//         ...submitData,
//         company_id: parseInt(submitData.company_id),
//         employee_id: parseInt(submitData.employee_id),
//         post_training_control: submitData.post_training_control === null ? null : submitData.post_training_control,
//         dependent_insurance: submitData.dependent_insurance === null ? null : submitData.dependent_insurance,
//         retirement_fund_self_contribution: submitData.retirement_fund_self_contribution ? 
//           parseFloat(submitData.retirement_fund_self_contribution) : null
//       };

//       console.log('開始建立員工帳號...');

//       // 步驟 1: 建立員工帳號
//       try {
//         const employeeResponse = await axios.post(EMPLOYEE_CREATE_API_URL, processedData, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 30000
//         });

//         if (employeeResponse.data.Status === 'Ok') {
//           employeeCreated = true;
//           employeeResult = employeeResponse.data;
//           console.log('員工帳號建立成功');
//         } else {
//           throw new Error(employeeResponse.data.Msg || '員工帳號建立失敗');
//         }
//       } catch (employeeError) {
//         console.error('員工帳號建立失敗:', employeeError);
//         throw new Error(`員工帳號建立失敗: ${employeeError.response?.data?.Msg || employeeError.message}`);
//       }

//       // 步驟 2: 註冊 SSO 帳號
//       console.log('開始註冊 SSO 帳號...');
//       ssoResult = await registerSSO(formData.employee_id, formData.name, formData.password);
      
//       if (ssoResult.success) {
//         ssoRegistered = true;
//         console.log('SSO 帳號註冊成功');
//       } else {
//         console.warn('SSO 帳號註冊失敗，但員工帳號已建立');
//       }

//       // 根據結果顯示訊息
//       const externalEmail = `${formData.employee_id}@2330.rm`;
//       let successMessage = `員工帳號建立成功！\n員工ID: ${formData.employee_id}\n姓名: ${formData.name}\n`;
      
//       if (ssoRegistered) {
//         successMessage += `外部系統帳號: ${externalEmail}\n外部系統註冊: 成功`;
//       } else {
//         successMessage += `外部系統帳號: ${externalEmail}\n外部系統註冊: 失敗 (${ssoResult.error})\n\n⚠️ 員工帳號已建立，但外部系統註冊失敗，請手動處理`;
//       }

//       setSuccess(successMessage);
//       setShowSuccess(true);
      
//       // 🔥 清空表單時保留公司資訊
//       setFormData({
//         company_id: '12400620',        // 🔥 保持寫死的公司統編
//         employee_id: '',
//         password: '',
//         confirmPassword: '',
//         company_name: '台灣波力梅',    // 🔥 保持寫死的公司名稱
//         name: '',
//         date_of_birth: '',
//         gender: '',
//         id_number: '',
//         registered_address: '',
//         mailing_address: '',
//         mobile_number: '',
//         landline_number: '',
//         shift_system: '',
//         employment_status: 'Active',
//         salary_type: '',
//         department: '',
//         position: '',
//         job_grade: '',
//         post_training_control: null,
//         retirement_fund_self_contribution: '',
//         dependent_insurance: null,
//         supervisor: ''
//       });
//       setValidationErrors({});

//     } catch (err) {
//       console.error('建立帳號過程出錯:', err);
      
//       let errorMessage = '';
      
//       if (!employeeCreated) {
//         errorMessage = `員工帳號建立失敗: ${err.message}`;
//       } else if (!ssoRegistered) {
//         errorMessage = `員工帳號已建立，但外部系統註冊失敗: ${ssoResult?.error || '未知錯誤'}\n\n請手動處理外部系統註冊`;
//       }
      
//       if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
//         errorMessage += '\n\n請求超時，請稍後再試';
//       } else if (!navigator.onLine) {
//         errorMessage += '\n\n網路連線異常，請檢查網路狀態';
//       }
      
//       setError(errorMessage);
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 重置表單時保留公司資訊
//   const handleReset = () => {
//     setFormData({
//       company_id: '12400620',        // 🔥 保持寫死的公司統編
//       employee_id: '',
//       password: '',
//       confirmPassword: '',
//       company_name: '台灣波力梅',    // 🔥 保持寫死的公司名稱
//       name: '',
//       date_of_birth: '',
//       gender: '',
//       id_number: '',
//       registered_address: '',
//       mailing_address: '',
//       mobile_number: '',
//       landline_number: '',
//       shift_system: '',
//       employment_status: 'Active',
//       salary_type: '',
//       department: '',
//       position: '',
//       job_grade: '',
//       post_training_control: null,
//       retirement_fund_self_contribution: '',
//       dependent_insurance: null,
//       supervisor: ''
//     });
//     setValidationErrors({});
//     setError('');
//     setSuccess('');
//     setShowError(false);
//     setShowSuccess(false);
//   };

//   // 關閉錯誤訊息
//   const handleCloseError = () => {
//     setShowError(false);
//   };

//   // 關閉成功訊息
//   const handleCloseSuccess = () => {
//     setShowSuccess(false);
//   };

//   return (
//     <div style={{
//       height: '100%',
//       width: '100%',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       overflow: 'auto',
//       backgroundColor: '#f5f5f5',
//     }}>
//       {/* 全螢幕載入提示 */}
//       {loading && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 10000,
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '30px',
//             borderRadius: '12px',
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//             textAlign: 'center',
//             minWidth: '350px'
//           }}>
//             <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color: '#1976d2', marginBottom: '20px' }} />
//             <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>正在建立帳號...</h3>
//             <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
//               步驟 1: 建立內部員工資料
//             </p>
//             <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
//               步驟 2: 註冊外部系統帳號 ({formData.employee_id}@2330.rm)
//             </p>
//           </div>
//         </div>
//       )}

//       <div style={{
//         maxWidth: '1000px',
//         margin: '20px auto',
//         padding: '0 15px 50px',
//         fontFamily: 'Arial, sans-serif',
//       }}>
//         <div style={{
//           backgroundColor: '#fff',
//           borderRadius: '8px',
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//           padding: '20px',
//           marginBottom: '20px',
//         }}>
//           <h2 style={{ marginBottom: '20px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
//             <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#4a86e8' }} />
//             新增員工帳號
//             <span style={{ 
//               fontSize: '14px', 
//               fontWeight: 'normal', 
//               color: '#666', 
//               display: 'block', 
//               marginTop: '5px' 
//             }}>
//               {/* 將分別在內部系統和外部 SSO 系統建立帳號 */}
//             </span>
//           </h2>

//           {/* 錯誤訊息 */}
//           {showError && (
//             <div style={{
//               backgroundColor: '#ffebee',
//               color: '#d32f2f',
//               padding: '12px 16px',
//               borderRadius: '4px',
//               marginBottom: '20px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'flex-start' }}>
//                 <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px', marginTop: '2px' }} />
//                 <span style={{ whiteSpace: 'pre-line' }}>{error}</span>
//               </div>
//               <button style={{
//                 background: 'none',
//                 border: 'none',
//                 color: '#d32f2f',
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//               }} onClick={handleCloseError}>×</button>
//             </div>
//           )}

//           {/* 成功訊息 */}
//           {showSuccess && (
//             <div style={{
//               backgroundColor: '#e8f5e8',
//               color: '#2e7d32',
//               padding: '12px 16px',
//               borderRadius: '4px',
//               marginBottom: '20px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'flex-start' }}>
//                 <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px', marginTop: '2px' }} />
//                 <span style={{ whiteSpace: 'pre-line' }}>{success}</span>
//               </div>
//               <button style={{
//                 background: 'none',
//                 border: 'none',
//                 color: '#2e7d32',
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//               }} onClick={handleCloseSuccess}>×</button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* 外部帳號預覽區塊 */}
//             {formData.employee_id && (
//               <div style={{
//                 backgroundColor: '#e3f2fd',
//                 border: '1px solid #2196f3',
//                 borderRadius: '4px',
//                 padding: '12px 16px',
//                 marginBottom: '20px',
//               }}>
//                 {/* <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
//                   <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
//                   外部 SSO 帳號預覽
//                 </h4>
//                 <p style={{ margin: '0', color: '#0d47a1', fontSize: '14px' }}>
//                   將建立外部帳號: <strong>{formData.employee_id}@2330.rm</strong>
//                   {formData.name && <span> (顯示名稱: {formData.name})</span>}
//                 </p> */}
//               </div>
//             )}

//             {/* 基本資訊區塊 */}
//             <div style={{ marginBottom: '30px' }}>
//               <h3 style={{ 
//                 color: '#333', 
//                 borderBottom: '2px solid #4a86e8', 
//                 paddingBottom: '8px',
//                 marginBottom: '20px'
//               }}>
//                 <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', color: '#4a86e8' }} />
//                 基本資訊
//               </h3>

//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//                 gap: '20px',
//               }}>
//                 {/* 🔥 公司統編 - 設為唯讀 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
//                     公司統編 <span style={{ color: '#f44336' }}>*</span>
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (系統預設)
//                     </span> */}
//                   </label>
//                   <input
//                     type="text"
//                     name="company_id"
//                     value={formData.company_id}
//                     readOnly
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       backgroundColor: '#f5f5f5',
//                       color: '#666',
//                       cursor: 'not-allowed'
//                     }}
//                   />
//                 </div>

//                 {/* 🔥 公司名稱 - 設為唯讀 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
//                     公司名稱 <span style={{ color: '#f44336' }}>*</span>
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (系統預設)
//                     </span> */}
//                   </label>
//                   <input
//                     type="text"
//                     name="company_name"
//                     value={formData.company_name}
//                     readOnly
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       backgroundColor: '#f5f5f5',
//                       color: '#666',
//                       cursor: 'not-allowed'
//                     }}
//                   />
//                 </div>

//                 {/* 員工編號 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px' }} />
//                     員工編號 <span style={{ color: '#f44336' }}>*</span>
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (將用於建立 SSO 帳號)
//                     </span> */}
//                   </label>
//                   <input
//                     type="text"
//                     name="employee_id"
//                     value={formData.employee_id}
//                     onChange={handleInputChange}
//                     placeholder="請輸入員工編號"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.employee_id ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.employee_id && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.employee_id}
//                     </span>
//                   )}
//                 </div>

//                 {/* 姓名 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
//                     姓名 <span style={{ color: '#f44336' }}>*</span>
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (將用作 SSO 顯示名稱)
//                     </span> */}
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="請輸入員工姓名"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.name ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.name && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.name}
//                     </span>
//                   )}
//                 </div>

//                 {/* 出生日期 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
//                     出生日期 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="date_of_birth"
//                     value={formData.date_of_birth}
//                     onChange={handleInputChange}
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.date_of_birth ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.date_of_birth && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.date_of_birth}
//                     </span>
//                   )}
//                 </div>

//                 {/* 性別 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     性別 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.gender ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   >
//                     <option value="">請選擇性別</option>
//                     <option value="Male">男性</option>
//                     <option value="Female">女性</option>
//                     <option value="Other">其他</option>
//                   </select>
//                   {validationErrors.gender && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.gender}
//                     </span>
//                   )}
//                 </div>

//                 {/* 身分證號 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px' }} />
//                     身分證號 <span style={{ color: '#f44336' }}>*</span>
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (英文字母將自動轉為大寫)
//                     </span> */}
//                   </label>
//                   <input
//                     type="text"
//                     name="id_number"
//                     value={formData.id_number}
//                     onChange={handleInputChange}
//                     placeholder="例：A123456789"
//                     maxLength="10"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.id_number ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.id_number && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.id_number}
//                     </span>
//                   )}
//                 </div>

//                 {/* 手機號碼 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
//                     手機號碼 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="mobile_number"
//                     value={formData.mobile_number}
//                     onChange={handleInputChange}
//                     placeholder=""
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.mobile_number ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.mobile_number && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.mobile_number}
//                     </span>
//                   )}
//                 </div>

//                 {/* 🔥 市話號碼 - 新增自動格式化功能 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
//                     市話號碼
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (將自動格式化，例：073562988 → 07-3562988)
//                     </span> */}
//                   </label>
//                   <input
//                     type="text"
//                     name="landline_number"
//                     value={formData.landline_number}
//                     onChange={handleInputChange}
//                     placeholder=""
//                     maxLength="12"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.landline_number ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.landline_number && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.landline_number}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 地址資訊區塊 */}
//             <div style={{ marginBottom: '30px' }}>
//               <h3 style={{ 
//                 color: '#333', 
//                 borderBottom: '2px solid #4a86e8', 
//                 paddingBottom: '8px',
//                 marginBottom: '20px'
//               }}>
//                 <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4a86e8' }} />
//                 地址資訊
//               </h3>

//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: '1fr',
//                 gap: '20px',
//               }}>
//                 {/* 戶籍地址 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
//                     戶籍地址 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <textarea
//                     name="registered_address"
//                     value={formData.registered_address}
//                     onChange={handleInputChange}
//                     placeholder="請輸入戶籍地址"
//                     rows="2"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.registered_address ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       resize: 'vertical',
//                     }}
//                   />
//                   {validationErrors.registered_address && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.registered_address}
//                     </span>
//                   )}
//                 </div>

//                 {/* 通訊地址 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
//                     通訊地址
//                   </label>
//                   <textarea
//                     name="mailing_address"
//                     value={formData.mailing_address}
//                     onChange={handleInputChange}
//                     placeholder="請輸入通訊地址（如與戶籍地址相同可留空）"
//                     rows="2"
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       resize: 'vertical',
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* 帳號設定區塊 */}
//             <div style={{ marginBottom: '30px' }}>
//               <h3 style={{ 
//                 color: '#333', 
//                 borderBottom: '2px solid #4a86e8', 
//                 paddingBottom: '8px',
//                 marginBottom: '20px'
//               }}>
//                 帳號設定
//                 <span style={{ 
//                   fontSize: '14px', 
//                   fontWeight: 'normal', 
//                   color: '#666', 
//                   display: 'block', 
//                   marginTop: '5px' 
//                 }}>
                  
//                 </span>
//               </h3>

//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//                 gap: '20px',
//               }}>
//                 {/* 密碼 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     密碼 <span style={{ color: '#f44336' }}>*</span>
//                     {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
//                       (將用於兩個系統)
//                     </span> */}
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="請輸入密碼（至少6個字元）"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.password ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.password && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.password}
//                     </span>
//                   )}
//                 </div>

//                 {/* 確認密碼 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     確認密碼 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="請再次輸入密碼"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.confirmPassword ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.confirmPassword && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.confirmPassword}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 工作資訊區塊 */}
//             <div style={{ marginBottom: '30px' }}>
//               <h3 style={{ 
//                 color: '#333', 
//                 borderBottom: '2px solid #4a86e8', 
//                 paddingBottom: '8px',
//                 marginBottom: '20px'
//               }}>
//                 <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px', color: '#4a86e8' }} />
//                 工作資訊
//               </h3>

//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//                 gap: '20px',
//               }}>
//                 {/* 部門 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
//                     部門
//                   </label>
//                   <input
//                     type="text"
//                     name="department"
//                     value={formData.department}
//                     onChange={handleInputChange}
//                     placeholder="請輸入部門"
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                 </div>

//                 {/* 職位 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     職位
//                   </label>
//                   <input
//                     type="text"
//                     name="position"
//                     value={formData.position}
//                     onChange={handleInputChange}
//                     placeholder="請輸入職位"
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                 </div>

// {/* 職級 */}
// <div style={{ display: 'flex', flexDirection: 'column' }}>
//   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//     職級
//   </label>
//   <select
//     name="job_grade"
//     value={formData.job_grade}
//     onChange={handleInputChange}
//     style={{
//       padding: '10px 12px',
//       border: '1px solid #ddd',
//       borderRadius: '4px',
//       fontSize: '14px',
//     }}
//   >
//     <option value="">請選擇職級</option>
//     <option value="staff">員工</option>
//     <option value="hr">主管</option>
//   </select>
// </div>


//                 {/* 直屬主管 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     直屬主管 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="supervisor"
//                     value={formData.supervisor}
//                     onChange={handleInputChange}
//                     placeholder="請輸入直屬主管姓名"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.supervisor ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.supervisor && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.supervisor}
//                     </span>
//                   )}
//                 </div>

//                 {/* 班制 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     班制
//                   </label>
//                   <select
//                     name="shift_system"
//                     value={formData.shift_system}
//                     onChange={handleInputChange}
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   >
//                     <option value="">請選擇班制</option>
//                     <option value="日班">日班</option>
//                     <option value="夜班">夜班</option>
//                     <option value="輪班">輪班</option>
//                     <option value="彈性班">彈性班</option>
//                   </select>
//                 </div>

//                 {/* 就業狀態 */}
//                 {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     就業狀態 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <select
//                     name="employment_status"
//                     value={formData.employment_status}
//                     onChange={handleInputChange}
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.employment_status ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   >
//                     <option value="Active">在職</option>
//                     <option value="Inactive">離職</option>
//                     <option value="On Leave">留職停薪</option>
//                   </select>
//                   {validationErrors.employment_status && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.employment_status}
//                     </span>
//                   )}
//                 </div> */}

//                 {/* 薪資類型 */}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} />
//                     薪資類型 <span style={{ color: '#f44336' }}>*</span>
//                   </label>
//                   <select
//                     name="salary_type"
//                     value={formData.salary_type}
//                     onChange={handleInputChange}
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.salary_type ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   >
//                     <option value="">請選擇薪資類型</option>
//                     <option value="Monthly">月薪</option>
//                     <option value="Hourly">時薪</option>

//                   </select>
//                   {validationErrors.salary_type && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.salary_type}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 其他設定區塊 */}
//             <div style={{ marginBottom: '30px' }}>
//               {/* <h3 style={{ 
//                 color: '#333', 
//                 borderBottom: '2px solid #4a86e8', 
//                 paddingBottom: '8px',
//                 marginBottom: '20px'
//               }}>
//                 其他設定
//               </h3> */}

//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//                 gap: '20px',
//               }}>
//                 {/* 崗位訓練控制 */}
//                 {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     崗位訓練控制
//                   </label>
//                   <select
//                     name="post_training_control"
//                     value={formData.post_training_control === null ? '' : formData.post_training_control}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       setFormData(prev => ({
//                         ...prev,
//                         post_training_control: value === '' ? null : value === 'true'
//                       }));
//                     }}
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   >
//                     <option value="">請選擇</option>
//                     <option value="true">是</option>
//                     <option value="false">否</option>
//                   </select>
//                 </div> */}

//                 {/* 退休金自提比例 */}
//                 {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     退休金自提比例 (%)
//                   </label>
//                   <input
//                     type="number"
//                     name="retirement_fund_self_contribution"
//                     value={formData.retirement_fund_self_contribution}
//                     onChange={handleInputChange}
//                     placeholder="0-100"
//                     min="0"
//                     max="100"
//                     step="0.01"
//                     style={{
//                       padding: '10px 12px',
//                       border: `1px solid ${validationErrors.retirement_fund_self_contribution ? '#f44336' : '#ddd'}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   />
//                   {validationErrors.retirement_fund_self_contribution && (
//                     <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
//                       {validationErrors.retirement_fund_self_contribution}
//                     </span>
//                   )}
//                 </div> */}

//                 {/* 眷屬保險 */}
//                 {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
//                     眷屬保險
//                   </label>
//                   <select
//                     name="dependent_insurance"
//                     value={formData.dependent_insurance === null ? '' : formData.dependent_insurance}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       setFormData(prev => ({
//                         ...prev,
//                         dependent_insurance: value === '' ? null : value === 'true'
//                       }));
//                     }}
//                     style={{
//                       padding: '10px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                     }}
//                   >
//                     <option value="">請選擇</option>
//                     <option value="true">有</option>
//                     <option value="false">無</option>
//                   </select>
//                 </div> */}
//               </div>
//             </div>

//             {/* 按鈕區域 */}
//             <div style={{
//               display: 'flex',
//               justifyContent: 'flex-end',
//               gap: '10px',
//               paddingTop: '20px',
//               borderTop: '1px solid #eee',
//             }}>
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 disabled={loading}
//                 style={{
//                   backgroundColor: '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '12px 24px',
//                   fontSize: '14px',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   transition: 'background-color 0.3s',
//                 }}
//               >
//                 <FontAwesomeIcon icon={faTimes} />
//                 重置
//               </button>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   backgroundColor: loading ? '#b0bec5' : '#4caf50',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '12px 24px',
//                   fontSize: '14px',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   transition: 'background-color 0.3s',
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <FontAwesomeIcon icon={faSpinner} spin />
//                     建立中...
//                   </>
//                 ) : (
//                   <>
//                     <FontAwesomeIcon icon={faSave} />
//                     建立雙系統帳號
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default CreateEmployeeForm;
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBuilding, 
  faSpinner, 
  faSave, 
  faTimes, 
  faCalendarAlt, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt,
  faIdCard,
  faDollarSign,
  faUsers,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../config'; // 引入 API_BASE_URL

const CreateEmployeeForm = React.memo(() => {
  // 🔥 基本資料狀態 - 預設公司統編和公司名稱
  const [formData, setFormData] = useState({
    company_id: '12400620',        // 🔥 寫死公司統編
    employee_id: '',
    password: '',
    confirmPassword: '',
    company_name: '台灣波力梅',    // 🔥 寫死公司名稱
    name: '',
    date_of_birth: '',
    gender: '',
    id_number: '',
    registered_address: '',
    mailing_address: '',
    mobile_number: '',
    landline_number: '',
    shift_system: '',
    employment_status: 'Active',
    salary_type: '',
    department: '',
    position: '',
    job_grade: '',
    post_training_control: null,
    retirement_fund_self_contribution: '',
    dependent_insurance: null,
    supervisor: ''
  });

  // 表單狀態
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // API 端點
  const EMPLOYEE_CREATE_API_URL = `${API_BASE_URL}/api/employee/create`;
  const SSO_REGISTER_API_URL = 'https://identityprovider.54ucl.com:1989/api/register';

  // 🔥 新增市話號碼格式化函數
  const formatLandlineNumber = (value) => {
    // 移除所有非數字字符
    const numbers = value.replace(/\D/g, '');
    
    // 如果長度不足，直接返回
    if (numbers.length < 3) return numbers;
    
    // 根據長度進行格式化
    if (numbers.length <= 9) {
      // 2碼區碼格式：07-3562988
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      // 3碼區碼格式：037-562988
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      // 超過10碼，截斷並格式化
      const truncated = numbers.slice(0, 10);
      return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
    }
  };

  // 🔥 修改處理輸入變更函數
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // 身分證號自動轉換為大寫
    if (name === 'id_number') {
      processedValue = value.toUpperCase();
    }
    
    // 🔥 市話號碼自動格式化
    if (name === 'landline_number') {
      processedValue = formatLandlineNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // 清除該欄位的驗證錯誤
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 驗證表單
  const validateForm = () => {
    const errors = {};

    // 必要欄位驗證
    const requiredFields = [
      'company_id', 'employee_id', 'password', 'company_name', 
      'name', 'date_of_birth', 'gender', 'id_number', 
      'registered_address', 'mobile_number', 'employment_status', 
      'salary_type', 'supervisor'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = '此欄位為必填';
      }
    });

    // 公司ID格式驗證
    if (formData.company_id && formData.company_id.length < 8) {
      errors.company_id = '公司統編至少需要8位數字';
    }

    // 員工ID格式驗證
    if (formData.employee_id && !/^\d+$/.test(formData.employee_id)) {
      errors.employee_id = '員工ID只能包含數字';
    }

    // 密碼驗證
    if (formData.password && formData.password.length < 6) {
      errors.password = '密碼長度至少需要6個字元';
    }

    // 確認密碼驗證
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '密碼確認不一致';
    }

    // 身分證號格式驗證（台灣格式）
    if (formData.id_number && !/^[A-Z][0-9]{9}$/.test(formData.id_number)) {
      errors.id_number = '身分證號格式不正確（例：A123456789）';
    }

    // 手機號碼格式驗證
    if (formData.mobile_number && !/^09\d{8}$/.test(formData.mobile_number)) {
      errors.mobile_number = '手機號碼格式不正確（例：0912345678）';
    }

    // 🔥 市話號碼格式驗證（更新正則表達式）
    if (formData.landline_number && !/^\d{2,3}-\d{6,8}$/.test(formData.landline_number)) {
      errors.landline_number = '市話號碼格式不正確（例：07-3562988）';
    }

    // 退休金提撥率驗證（如果有填寫）
    if (formData.retirement_fund_self_contribution && 
        (isNaN(formData.retirement_fund_self_contribution) || 
         formData.retirement_fund_self_contribution < 0 || 
         formData.retirement_fund_self_contribution > 100)) {
      errors.retirement_fund_self_contribution = '退休金提撥率必須是0-100之間的數字';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // SSO 註冊函數
  const registerSSO = async (employeeId, name, password) => {
    try {
      const ssoData = {
        username: name,
        email: `${employeeId}@2330.rm`,
        password: password
      };

      console.log('正在註冊 SSO 帳號:', ssoData);

      const response = await axios.post(SSO_REGISTER_API_URL, ssoData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('SSO 註冊失敗:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || error.message || 'SSO 註冊失敗'
      };
    }
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('請修正表單中的錯誤');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setShowError(false);
    setShowSuccess(false);

    let employeeCreated = false;
    let ssoRegistered = false;
    let employeeResult = null;
    let ssoResult = null;

    try {
      // 準備提交資料（移除確認密碼欄位）
      const { confirmPassword, ...submitData } = formData;
      
      // 轉換資料類型
      const processedData = {
        ...submitData,
        company_id: parseInt(submitData.company_id),
        employee_id: parseInt(submitData.employee_id),
        post_training_control: submitData.post_training_control === null ? null : submitData.post_training_control,
        dependent_insurance: submitData.dependent_insurance === null ? null : submitData.dependent_insurance,
        retirement_fund_self_contribution: submitData.retirement_fund_self_contribution ? 
          parseFloat(submitData.retirement_fund_self_contribution) : null
      };

      console.log('開始建立員工帳號...');

      // 步驟 1: 建立員工帳號
      try {
        const employeeResponse = await axios.post(EMPLOYEE_CREATE_API_URL, processedData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000
        });

        if (employeeResponse.data.Status === 'Ok') {
          employeeCreated = true;
          employeeResult = employeeResponse.data;
          console.log('員工帳號建立成功');
        } else {
          throw new Error(employeeResponse.data.Msg || '員工帳號建立失敗');
        }
      } catch (employeeError) {
        console.error('員工帳號建立失敗:', employeeError);
        throw new Error(`員工帳號建立失敗: ${employeeError.response?.data?.Msg || employeeError.message}`);
      }

      // 步驟 2: 註冊 SSO 帳號
      console.log('開始註冊 SSO 帳號...');
      ssoResult = await registerSSO(formData.employee_id, formData.name, formData.password);
      
      if (ssoResult.success) {
        ssoRegistered = true;
        console.log('SSO 帳號註冊成功');
      } else {
        console.warn('SSO 帳號註冊失敗，但員工帳號已建立');
      }

      // 根據結果顯示訊息
      const externalEmail = `${formData.employee_id}@2330.rm`;
      let successMessage = `員工帳號建立成功！\n員工ID: ${formData.employee_id}\n姓名: ${formData.name}\n`;
      
      if (ssoRegistered) {
        successMessage += `外部系統帳號: ${externalEmail}\n外部系統註冊: 成功`;
      } else {
        successMessage += `外部系統帳號: ${externalEmail}\n外部系統註冊: 失敗 (${ssoResult.error})\n\n⚠️ 員工帳號已建立，但外部系統註冊失敗，請手動處理`;
      }

      setSuccess(successMessage);
      setShowSuccess(true);
      
      // 🔥 清空表單時保留公司資訊
      setFormData({
        company_id: '12400620',        // 🔥 保持寫死的公司統編
        employee_id: '',
        password: '',
        confirmPassword: '',
        company_name: '台灣波力梅',    // 🔥 保持寫死的公司名稱
        name: '',
        date_of_birth: '',
        gender: '',
        id_number: '',
        registered_address: '',
        mailing_address: '',
        mobile_number: '',
        landline_number: '',
        shift_system: '',
        employment_status: 'Active',
        salary_type: '',
        department: '',
        position: '',
        job_grade: '',
        post_training_control: null,
        retirement_fund_self_contribution: '',
        dependent_insurance: null,
        supervisor: ''
      });
      setValidationErrors({});

    } catch (err) {
      console.error('建立帳號過程出錯:', err);
      
      let errorMessage = '';
      
      if (!employeeCreated) {
        errorMessage = `員工帳號建立失敗: ${err.message}`;
      } else if (!ssoRegistered) {
        errorMessage = `員工帳號已建立，但外部系統註冊失敗: ${ssoResult?.error || '未知錯誤'}\n\n請手動處理外部系統註冊`;
      }
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage += '\n\n請求超時，請稍後再試';
      } else if (!navigator.onLine) {
        errorMessage += '\n\n網路連線異常，請檢查網路狀態';
      }
      
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 重置表單時保留公司資訊
  const handleReset = () => {
    setFormData({
      company_id: '12400620',        // 🔥 保持寫死的公司統編
      employee_id: '',
      password: '',
      confirmPassword: '',
      company_name: '台灣波力梅',    // 🔥 保持寫死的公司名稱
      name: '',
      date_of_birth: '',
      gender: '',
      id_number: '',
      registered_address: '',
      mailing_address: '',
      mobile_number: '',
      landline_number: '',
      shift_system: '',
      employment_status: 'Active',
      salary_type: '',
      department: '',
      position: '',
      job_grade: '',
      post_training_control: null,
      retirement_fund_self_contribution: '',
      dependent_insurance: null,
      supervisor: ''
    });
    setValidationErrors({});
    setError('');
    setSuccess('');
    setShowError(false);
    setShowSuccess(false);
  };

  // 關閉錯誤訊息
  const handleCloseError = () => {
    setShowError(false);
  };

  // 關閉成功訊息
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'auto',
      backgroundColor: '#f5f5f5',
    }}>
      {/* 全螢幕載入提示 */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '350px'
          }}>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color: '#1976d2', marginBottom: '20px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>正在建立帳號...</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              步驟 1: 建立內部員工資料
            </p>
            <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
              步驟 2: 註冊外部系統帳號 ({formData.employee_id}@2330.rm)
            </p>
          </div>
        </div>
      )}

      <div style={{
        maxWidth: '1000px',
        margin: '20px auto',
        padding: '0 15px 50px',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#4a86e8' }} />
            新增員工帳號
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 'normal', 
              color: '#666', 
              display: 'block', 
              marginTop: '5px' 
            }}>
              {/* 將分別在內部系統和外部 SSO 系統建立帳號 */}
            </span>
          </h2>

          {/* 錯誤訊息 */}
          {showError && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              padding: '12px 16px',
              borderRadius: '4px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px', marginTop: '2px' }} />
                <span style={{ whiteSpace: 'pre-line' }}>{error}</span>
              </div>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#d32f2f',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '18px',
              }} onClick={handleCloseError}>×</button>
            </div>
          )}

          {/* 成功訊息 */}
          {showSuccess && (
            <div style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '12px 16px',
              borderRadius: '4px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px', marginTop: '2px' }} />
                <span style={{ whiteSpace: 'pre-line' }}>{success}</span>
              </div>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#2e7d32',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '18px',
              }} onClick={handleCloseSuccess}>×</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 外部帳號預覽區塊 */}
            {formData.employee_id && (
              <div style={{
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                padding: '12px 16px',
                marginBottom: '20px',
              }}>
                {/* <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                  外部 SSO 帳號預覽
                </h4>
                <p style={{ margin: '0', color: '#0d47a1', fontSize: '14px' }}>
                  將建立外部帳號: <strong>{formData.employee_id}@2330.rm</strong>
                  {formData.name && <span> (顯示名稱: {formData.name})</span>}
                </p> */}
              </div>
            )}

            {/* 基本資訊區塊 */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#333', 
                borderBottom: '2px solid #4a86e8', 
                paddingBottom: '8px',
                marginBottom: '20px'
              }}>
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px', color: '#4a86e8' }} />
                基本資訊
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {/* 🔥 公司統編 - 設為唯讀 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
                    公司統編 <span style={{ color: '#f44336' }}>*</span>
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (系統預設)
                    </span> */}
                  </label>
                  <input
                    type="text"
                    name="company_id"
                    value={formData.company_id}
                    readOnly
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* 🔥 公司名稱 - 設為唯讀 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
                    公司名稱 <span style={{ color: '#f44336' }}>*</span>
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (系統預設)
                    </span> */}
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    readOnly
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* 員工編號 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px' }} />
                    員工編號 <span style={{ color: '#f44336' }}>*</span>
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (將用於建立 SSO 帳號)
                    </span> */}
                  </label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    placeholder="請輸入員工編號"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.employee_id ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.employee_id && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.employee_id}
                    </span>
                  )}
                </div>

                {/* 姓名 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                    姓名 <span style={{ color: '#f44336' }}>*</span>
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (將用作 SSO 顯示名稱)
                    </span> */}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="請輸入員工姓名"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.name ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.name && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.name}
                    </span>
                  )}
                </div>

                {/* 出生日期 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                    出生日期 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.date_of_birth ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.date_of_birth && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.date_of_birth}
                    </span>
                  )}
                </div>

                {/* 性別 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    性別 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.gender ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">請選擇性別</option>
                    <option value="Male">男性</option>
                    <option value="Female">女性</option>
                    <option value="Other">其他</option>
                  </select>
                  {validationErrors.gender && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.gender}
                    </span>
                  )}
                </div>

                {/* 身分證號 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px' }} />
                    身分證號 <span style={{ color: '#f44336' }}>*</span>
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (英文字母將自動轉為大寫)
                    </span> */}
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                    placeholder="例：A123456789"
                    maxLength="10"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.id_number ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.id_number && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.id_number}
                    </span>
                  )}
                </div>

                {/* 手機號碼 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                    手機號碼 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    placeholder=""
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.mobile_number ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.mobile_number && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.mobile_number}
                    </span>
                  )}
                </div>

                {/* 🔥 市話號碼 - 新增自動格式化功能 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                    市話號碼
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (將自動格式化，例：073562988 → 07-3562988)
                    </span> */}
                  </label>
                  <input
                    type="text"
                    name="landline_number"
                    value={formData.landline_number}
                    onChange={handleInputChange}
                    placeholder=""
                    maxLength="12"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.landline_number ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.landline_number && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.landline_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 地址資訊區塊 */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#333', 
                borderBottom: '2px solid #4a86e8', 
                paddingBottom: '8px',
                marginBottom: '20px'
              }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: '#4a86e8' }} />
                地址資訊
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '20px',
              }}>
                {/* 戶籍地址 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                    戶籍地址 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <textarea
                    name="registered_address"
                    value={formData.registered_address}
                    onChange={handleInputChange}
                    placeholder="請輸入戶籍地址"
                    rows="2"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.registered_address ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                  {validationErrors.registered_address && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.registered_address}
                    </span>
                  )}
                </div>

                {/* 通訊地址 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                    通訊地址
                  </label>
                  <textarea
                    name="mailing_address"
                    value={formData.mailing_address}
                    onChange={handleInputChange}
                    placeholder="請輸入通訊地址（如與戶籍地址相同可留空）"
                    rows="2"
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 帳號設定區塊 */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#333', 
                borderBottom: '2px solid #4a86e8', 
                paddingBottom: '8px',
                marginBottom: '20px'
              }}>
                帳號設定
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 'normal', 
                  color: '#666', 
                  display: 'block', 
                  marginTop: '5px' 
                }}>
                  
                </span>
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {/* 密碼 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    密碼 <span style={{ color: '#f44336' }}>*</span>
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                      (將用於兩個系統)
                    </span> */}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="請輸入密碼（至少6個字元）"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.password ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.password && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.password}
                    </span>
                  )}
                </div>

                {/* 確認密碼 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    確認密碼 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="請再次輸入密碼"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.confirmPassword ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.confirmPassword && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 工作資訊區塊 */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                color: '#333', 
                borderBottom: '2px solid #4a86e8', 
                paddingBottom: '8px',
                marginBottom: '20px'
              }}>
                <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px', color: '#4a86e8' }} />
                工作資訊
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {/* 部門 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                    部門
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="請輸入部門"
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                {/* 職位 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    職位
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="請輸入職位"
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>

{/* 職級 */}
<div style={{ display: 'flex', flexDirection: 'column' }}>
  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
    職級
  </label>
  <select
    name="job_grade"
    value={formData.job_grade}
    onChange={handleInputChange}
    style={{
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    }}
  >
    <option value="">請選擇職級</option>
    <option value="staff">員工</option>
    <option value="hr">主管</option>
  </select>
</div>


                {/* 直屬主管 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    直屬主管 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="supervisor"
                    value={formData.supervisor}
                    onChange={handleInputChange}
                    placeholder="請輸入直屬主管姓名"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.supervisor ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.supervisor && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.supervisor}
                    </span>
                  )}
                </div>

                {/* 班制 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    班制
                  </label>
                  <select
                    name="shift_system"
                    value={formData.shift_system}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">請選擇班制</option>
                    <option value="日班">日班</option>
                    <option value="夜班">夜班</option>
                    <option value="輪班">輪班</option>
                    <option value="彈性班">彈性班</option>
                  </select>
                </div>

                {/* 就業狀態 */}
                {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    就業狀態 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.employment_status ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="Active">在職</option>
                    <option value="Inactive">離職</option>
                    <option value="On Leave">留職停薪</option>
                  </select>
                  {validationErrors.employment_status && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.employment_status}
                    </span>
                  )}
                </div> */}

                {/* 薪資類型 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} />
                    薪資類型 <span style={{ color: '#f44336' }}>*</span>
                  </label>
                  <select
                    name="salary_type"
                    value={formData.salary_type}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.salary_type ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">請選擇薪資類型</option>
                    <option value="Monthly">月薪</option>
                    <option value="Hourly">時薪</option>

                  </select>
                  {validationErrors.salary_type && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.salary_type}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 其他設定區塊 */}
            <div style={{ marginBottom: '30px' }}>
              {/* <h3 style={{ 
                color: '#333', 
                borderBottom: '2px solid #4a86e8', 
                paddingBottom: '8px',
                marginBottom: '20px'
              }}>
                其他設定
              </h3> */}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {/* 崗位訓練控制 */}
                {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    崗位訓練控制
                  </label>
                  <select
                    name="post_training_control"
                    value={formData.post_training_control === null ? '' : formData.post_training_control}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        post_training_control: value === '' ? null : value === 'true'
                      }));
                    }}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">請選擇</option>
                    <option value="true">是</option>
                    <option value="false">否</option>
                  </select>
                </div> */}

                {/* 退休金自提比例 */}
                {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    退休金自提比例 (%)
                  </label>
                  <input
                    type="number"
                    name="retirement_fund_self_contribution"
                    value={formData.retirement_fund_self_contribution}
                    onChange={handleInputChange}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    step="0.01"
                    style={{
                      padding: '10px 12px',
                      border: `1px solid ${validationErrors.retirement_fund_self_contribution ? '#f44336' : '#ddd'}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  {validationErrors.retirement_fund_self_contribution && (
                    <span style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.retirement_fund_self_contribution}
                    </span>
                  )}
                </div> */}

                {/* 眷屬保險 */}
                {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                    眷屬保險
                  </label>
                  <select
                    name="dependent_insurance"
                    value={formData.dependent_insurance === null ? '' : formData.dependent_insurance}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        dependent_insurance: value === '' ? null : value === 'true'
                      }));
                    }}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">請選擇</option>
                    <option value="true">有</option>
                    <option value="false">無</option>
                  </select>
                </div> */}
              </div>
            </div>

            {/* 按鈕區域 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '20px',
              borderTop: '1px solid #eee',
            }}>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s',
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
                重置
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#b0bec5' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s',
                }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    建立中...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    建立雙系統帳號
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CreateEmployeeForm;
