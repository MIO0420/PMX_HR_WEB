
// // import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// // import axios from 'axios';
// // import Cookies from 'js-cookie';
// // import { API_BASE_URL } from '../../../../config';
// // import CalendarSelector from '../Calendar_Selector';

// // const JobRelated = forwardRef(({ 
// //   employee,
// //   ToggleSwitch,
// //   onJobDetailsUpdated
// // }, ref) => {
// //   // 將所有職務相關的狀態移到這裡
// //   const [jobDetails, setJobDetails] = useState(null);
// //   const [loadingJobDetails, setLoadingJobDetails] = useState(false);
// //   const [editingJobDetails, setEditingJobDetails] = useState(false);
// //   const [updatingField, setUpdatingField] = useState(null);
// //   const [shiftOptions, setShiftOptions] = useState([]);
// //   const [loadingShiftOptions, setLoadingShiftOptions] = useState(false);
// //   const [showCalendar, setShowCalendar] = useState({
// //     training_control_until: false,
// //     probation_start_date: false,
// //     probation_end_date: false,
// //     hire_date: false,
// //     resignation_date: false
// //   });
// //   const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
// //   const [jobDetailsForm, setJobDetailsForm] = useState({
// //     employment_status: '',
// //     salary_type: '',
// //     department: '',
// //     job_grade: '',
// //     position: '',
// //     shift_system: '',
// //     shift_option: '',
// //     is_manager: false,
// //     supervisor_name: '',
// //     post_training_control: false,
// //     training_control_until: '',
// //     hire_date: '',
// //     probation_start_date: '',
// //     probation_end_date: '',
// //     resignation_date: '',
// //     clock_free_treatment: false
// //   });

// //   // 🔥 新增：權限相關狀態
// //   const [permissions, setPermissions] = useState(null);
// //   const [hasEditPermission, setHasEditPermission] = useState(false);
// //   const [permissionLoading, setPermissionLoading] = useState(false);
// //   const [permissionError, setPermissionError] = useState('');

// //   // 🔥 新增：檢查必要的 cookies 是否存在
// //   const checkRequiredCookies = () => {
// //     const companyId = Cookies.get('company_id');
// //     const employeeId = Cookies.get('employee_id');
    
// //     if (!companyId) {
// //       console.error('缺少 company_id cookie，請重新登入');
// //       return false;
// //     }
    
// //     if (!employeeId) {
// //       console.error('缺少 employee_id cookie，請重新登入');
// //       return false;
// //     }
    
// //     return true;
// //   };

// //   // 🔥 修正：檢查當前登入使用者的權限，而不是被查看員工的權限
// //   const checkCurrentUserPermissions = async () => {
// //     try {
// //       const companyId = Cookies.get('company_id');
// //       const currentUserId = Cookies.get('employee_id'); // 🔥 當前登入使用者的ID
      
// //       if (!companyId || !currentUserId) {
// //         return {
// //           success: false,
// //           message: '無法獲取公司ID或使用者ID',
// //           hasEditPermission: false
// //         };
// //       }
      
// //       console.log('🔍 檢查當前使用者職務相關權限:', currentUserId);
      
// //       const response = await axios.get(
// //         `${API_BASE_URL}/api/company/employee-permissions/${currentUserId}`, // 🔥 使用當前使用者ID
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json',
// //             'x-company-id': companyId
// //           },
// //           params: {
// //             company_id: companyId
// //           },
// //           timeout: 10000,
// //           validateStatus: function (status) {
// //             return status < 500;
// //           }
// //         }
// //       );

// //       console.log('🔍 當前使用者職務相關權限檢查 API 回應:', response.data);
      
// //       if (response.data && response.data.Status === 'Ok') {
// //         // 🔥 從 raw_data 中讀取權限
// //         const rawData = response.data.Data?.raw_data;
// //         const hasPermission = rawData?.employee_data === 1 || rawData?.employee_data === '1';
        
// //         console.log('🔍 當前使用者職務相關原始權限資料:', rawData);
// //         console.log('🔍 employee_data 權限值:', rawData?.employee_data);
// //         console.log('🔍 職務相關最終權限判斷:', hasPermission);
        
// //         return {
// //           success: true,
// //           permissions: rawData,
// //           hasEditPermission: hasPermission
// //         };
// //       } else {
// //         return {
// //           success: false,
// //           message: response.data?.Msg || '權限檢查失敗',
// //           hasEditPermission: false
// //         };
// //       }
// //     } catch (error) {
// //       console.error('❌ 職務相關權限檢查 API 錯誤:', error);
// //       return {
// //         success: false,
// //         message: error.message || '權限檢查失敗',
// //         hasEditPermission: false
// //       };
// //     }
// //   };

// //   // 🔥 修正：只在組件初始化時檢查一次當前使用者權限，不依賴被查看的員工
// //   useEffect(() => {
// //     // 🔥 在組件初始化時檢查 cookies
// //     if (!checkRequiredCookies()) {
// //       setPermissionError('登入資訊不完整，請重新登入');
// //       return;
// //     }

// //     const loadCurrentUserPermissions = async () => {
// //       setPermissionLoading(true);
// //       setPermissionError('');
      
// //       try {
// //         const result = await checkCurrentUserPermissions();
        
// //         if (result.success) {
// //           setPermissions(result.permissions);
// //           setHasEditPermission(result.hasEditPermission);
// //           console.log('✅ 當前使用者職務相關權限檢查成功:', result.permissions);
// //           console.log('✅ 職務相關編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
// //         } else {
// //           setPermissionError(result.message);
// //           setHasEditPermission(false);
// //           console.error('❌ 當前使用者職務相關權限檢查失敗:', result.message);
// //         }
// //       } catch (error) {
// //         setPermissionError('權限檢查發生錯誤');
// //         setHasEditPermission(false);
// //         console.error('❌ 當前使用者職務相關權限檢查異常:', error);
// //       } finally {
// //         setPermissionLoading(false);
// //       }
// //     };

// //     loadCurrentUserPermissions();
// //   }, []); // 🔥 移除對 employee?.employee_id 的依賴，只在組件初始化時執行一次

// //   // 將所有職務相關的函數移到這裡
// //   const getJobGradeText = (jobGrade) => {
// //     switch (jobGrade) {
// //       case 'staff':
// //         return '員工';
// //       case 'hr':
// //         return '主管';
// //       default:
// //         return jobGrade || '';
// //     }
// //   };

// //   const getEmploymentStatusText = (status) => {
// //     switch (status) {
// //       case 'Full-time':
// //         return '全時';
// //       case 'Active':
// //         return '部分工時';
// //       default:
// //         return status || '';
// //     }
// //   };

// //   const getSalaryTypeText = (salaryType) => {
// //     switch (salaryType) {
// //       case 'Monthly':
// //         return '月薪';
// //       case 'Hourly':
// //         return '時薪';
// //       default:
// //         return salaryType || '';
// //     }
// //   };

// //   const calculateYearsOfService = (hireDate) => {
// //     if (!hireDate) return '-年-月1日';
    
// //     const hire = new Date(hireDate);
// //     const today = new Date('2025-12-14');
// //     const diffTime = today - hire;
// //     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
// //     const years = Math.floor(diffDays / 365);
// //     const months = Math.floor((diffDays % 365) / 30);
    
// //     return `${years}年${months}月1日`;
// //   };

// //   // 🔥 新增：設定預設班別選項的函數
// //   const setDefaultShiftOptions = () => {
// //     const defaultOptions = [
// //       { value: '早班', label: '早班' },
// //       { value: '中班', label: '中班' },
// //       { value: '晚班', label: '晚班' },
// //       { value: '大夜班', label: '大夜班' },
// //       { value: '正常班', label: '正常班' }
// //     ];
    
// //     setShiftOptions(defaultOptions);
// //     console.log('使用預設班別選項:', defaultOptions);
// //   };

// // // 🔥 修正：不傳送 department 參數，查詢公司所有班別
// // const fetchCompanyShifts = async () => {
// //   setLoadingShiftOptions(true);
// //   try {
// //     // 🔥 從 cookies 動態獲取公司ID，不寫死
// //     const companyId = Cookies.get('company_id');
    
// //     if (!companyId) {
// //       console.error('無法獲取公司ID，請重新登入');
// //       setDefaultShiftOptions();
// //       return;
// //     }
    
// //     console.log('查詢公司排班資訊:', {
// //       company_id: companyId
// //       // 🔥 移除 department 參數
// //     });

// //     const response = await axios.get(
// //       `${API_BASE_URL}/api/company/shifts`,
// //       {
// //         params: {
// //           company_id: companyId
// //           // 🔥 不傳送 department 參數，讓後端查詢該公司所有班別
// //         },
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json'
// //         },
// //         timeout: 10000
// //       }
// //     );

// //     console.log('公司排班資訊 API 回應:', response.data);

// //     if (response.data.Status === 'Ok' && response.data.Data && Array.isArray(response.data.Data)) {
// //       if (response.data.Data.length > 0) {
// //         // 🔥 根據您的資料庫結構調整
// //         const options = response.data.Data.map(shift => ({
// //           value: shift.shift_category || shift.shift_name || shift.name || shift.shift_type,
// //           label: shift.shift_category || shift.shift_name || shift.name || shift.shift_type
// //         }));
        
// //         setShiftOptions(options);
// //         console.log('✅ 成功載入班別選項:', options);
// //       } else {
// //         console.log('該公司沒有設定班別，使用預設選項');
// //         setDefaultShiftOptions();
// //       }
// //     } else {
// //       console.log('API 回應格式異常或無資料:', response.data);
// //       setDefaultShiftOptions();
// //     }
// //   } catch (error) {
// //     console.error('查詢公司排班資訊失敗:', error);
    
// //     // 根據錯誤類型提供不同的處理
// //     if (error.code === 'ECONNABORTED') {
// //       console.error('API 請求超時');
// //     } else if (error.response) {
// //       console.error('API 回應錯誤:', error.response.status, error.response.data);
// //     } else if (error.request) {
// //       console.error('API 請求失敗，無回應');
// //     }
    
// //     setDefaultShiftOptions();
// //   } finally {
// //     setLoadingShiftOptions(false);
// //   }
// // };

// // // 🔥 修正：從 cookies 動態獲取公司ID
// // const fetchJobDetails = async () => {
// //   if (!employee?.employee_id) return;
  
// //   setLoadingJobDetails(true);
// //   try {
// //     // 🔥 從 cookies 動態獲取公司ID
// //     const companyId = Cookies.get('company_id');
    
// //     if (!companyId) {
// //       console.error('無法獲取公司ID，請重新登入');
// //       setLoadingJobDetails(false);
// //       return;
// //     }
    
// //     console.log('查詢員工職務詳細資料:', {
// //       company_id: companyId,
// //       employee_id: employee.employee_id
// //     });

// //     const response = await axios.get(
// //       `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
// //       {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json'
// //         }
// //       }
// //     );

// //     console.log('職務詳細資料 API 回應:', response.data);

// //     if (response.data.Status === 'Ok') {
// //       setJobDetails(response.data.Data);
// //       setJobDetailsForm({
// //         employment_status: response.data.Data.employment_status || '',
// //         salary_type: response.data.Data.salary_type || '',
// //         department: response.data.Data.department || '',
// //         job_grade: response.data.Data.job_grade || '',
// //         position: response.data.Data.position || '',
// //         shift_system: response.data.Data.shift_system || '',
// //         shift_option: response.data.Data.shift_option || '',
// //         is_manager: response.data.Data.is_manager || false,
// //         supervisor_name: response.data.Data.supervisor_name || '',
// //         post_training_control: response.data.Data.post_training_control || false,
// //         training_control_until: response.data.Data.training_control_until || '',
// //         hire_date: response.data.Data.hire_date || '',
// //         probation_start_date: response.data.Data.probation_start_date || '',
// //         probation_end_date: response.data.Data.probation_end_date || '',
// //         resignation_date: response.data.Data.resignation_date || '',
// //         clock_free_treatment: response.data.Data.clock_free_treatment || false
// //       });
      
// //       // 🔥 修正：不傳入部門參數
// //       await fetchCompanyShifts();
// //     } else {
// //       console.log('未找到職務詳細資料:', response.data.Msg);
// //       setJobDetails(null);
// //       setJobDetailsForm({
// //         employment_status: employee.employment_status || '',
// //         salary_type: employee.salary_type || '',
// //         department: employee.department || '',
// //         job_grade: employee.job_grade || '',
// //         position: employee.position || '',
// //         shift_system: employee.shift_system || '',
// //         shift_option: employee.shift_option || '',
// //         is_manager: false,
// //         supervisor_name: employee.supervisor_name || '',
// //         post_training_control: false,
// //         training_control_until: '',
// //         hire_date: '',
// //         probation_start_date: '',
// //         probation_end_date: '',
// //         resignation_date: '',
// //         clock_free_treatment: false
// //       });
      
// //       // 🔥 修正：不傳入參數
// //       await fetchCompanyShifts();
// //     }
// //   } catch (error) {
// //     console.error('查詢職務詳細資料失敗:', error);
// //     setJobDetails(null);
// //     setJobDetailsForm({
// //       employment_status: employee.employment_status || '',
// //       salary_type: employee.salary_type || '',
// //       department: employee.department || '',
// //       job_grade: employee.job_grade || '',
// //       position: employee.position || '',
// //       shift_system: employee.shift_system || '',
// //       shift_option: employee.shift_option || '',
// //       is_manager: false,
// //       supervisor_name: employee.supervisor_name || '',
// //       post_training_control: false,
// //       training_control_until: '',
// //       hire_date: '',
// //       probation_start_date: '',
// //       probation_end_date: '',
// //       resignation_date: '',
// //       clock_free_treatment: false
// //     });
    
// //     // 🔥 修正：不傳入參數
// //     await fetchCompanyShifts();
// //   } finally {
// //     setLoadingJobDetails(false);
// //   }
// // };


// //   const cleanFormData = (formData) => {
// //     const cleaned = { ...formData };
    
// //     const dateFields = ['hire_date', 'probation_start_date', 'probation_end_date', 'resignation_date', 'training_control_until'];
// //     dateFields.forEach(field => {
// //       if (cleaned[field] === '' || cleaned[field] === null || cleaned[field] === undefined) {
// //         cleaned[field] = null;
// //       }
// //     });
    
// //     cleaned.is_manager = Boolean(cleaned.is_manager);
// //     cleaned.post_training_control = Boolean(cleaned.post_training_control);
// //     cleaned.clock_free_treatment = Boolean(cleaned.clock_free_treatment);
    
// //     return cleaned;
// //   };

// // // 🔥 修正：處理職務詳情變更 - 移除部門變更時的班別重新載入
// // const handleJobDetailsChange = (field, value) => {
// //   if (!hasEditPermission) {
// //     alert('您沒有權限修改職務相關資料');
// //     return;
// //   }

// //   setJobDetailsForm(prev => ({
// //     ...prev,
// //     [field]: value
// //   }));
  
// //   // 🔥 移除：因為不按部門過濾，所以部門變更時不需要重新載入班別
// //   // if (field === 'department') {
// //   //   fetchCompanyShifts(value);
// //   // }
// // };


// //   // 🔥 修正：更新單一欄位 - 加入權限檢查和動態公司ID
// //   const updateSingleField = async (fieldName, newValue) => {
// //     if (!hasEditPermission) {
// //       alert('您沒有權限修改職務相關資料');
// //       return;
// //     }

// //     if (!jobDetails) {
// //       console.log('沒有職務詳細資料，無法更新');
// //       return;
// //     }

// //     try {
// //       setUpdatingField(fieldName);
      
// //       // 🔥 從 cookies 動態獲取公司ID
// //       const companyId = Cookies.get('company_id');
      
// //       if (!companyId) {
// //         console.error('無法獲取公司ID，請重新登入');
// //         return;
// //       }
      
// //       const updateData = {
// //         ...jobDetailsForm,
// //         [fieldName]: newValue,
// //         updated_by: 'admin'
// //       };

// //       const cleanedData = cleanFormData(updateData);

// //       console.log(`準備更新 ${fieldName}:`, { [fieldName]: newValue });

// //       const response = await axios.put(
// //         `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
// //         cleanedData,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           }
// //         }
// //       );

// //       console.log(`更新 ${fieldName} API 回應:`, response.data);

// //       if (response.data.Status === 'Ok') {
// //         setJobDetails(response.data.Data);
// //         setJobDetailsForm(prev => ({
// //           ...prev,
// //           [fieldName]: newValue
// //         }));
        
// //         console.log(`${fieldName} 更新成功`);
        
// //         if (onJobDetailsUpdated) {
// //           onJobDetailsUpdated(response.data.Data);
// //         }
// //       } else {
// //         console.error('API 錯誤:', response.data.Msg || '更新失敗');
// //         setJobDetailsForm(prev => ({
// //           ...prev,
// //           [fieldName]: jobDetailsForm[fieldName]
// //         }));
// //       }
// //     } catch (error) {
// //       console.error(`更新 ${fieldName} 失敗:`, error);
// //       setJobDetailsForm(prev => ({
// //         ...prev,
// //         [fieldName]: jobDetailsForm[fieldName]
// //       }));
// //     } finally {
// //       setUpdatingField(null);
// //     }
// //   };

// //   // 🔥 修正：更新多個欄位 - 加入權限檢查和動態公司ID
// //   const updateMultipleFields = async (fieldsToUpdate) => {
// //     if (!hasEditPermission) {
// //       alert('您沒有權限修改職務相關資料');
// //       return;
// //     }

// //     if (!jobDetails) {
// //       console.log('沒有職務詳細資料，無法更新');
// //       return;
// //     }

// //     try {
// //       setUpdatingField('shift_system');
      
// //       // 🔥 從 cookies 動態獲取公司ID
// //       const companyId = Cookies.get('company_id');
      
// //       if (!companyId) {
// //         console.error('無法獲取公司ID，請重新登入');
// //         return;
// //       }
      
// //       const updateData = {
// //         ...jobDetailsForm,
// //         ...fieldsToUpdate,
// //         updated_by: 'admin'
// //       };

// //       const cleanedData = cleanFormData(updateData);

// //       console.log('準備同時更新多個欄位:', fieldsToUpdate);

// //       const response = await axios.put(
// //         `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
// //         cleanedData,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           }
// //         }
// //       );

// //       console.log('更新多個欄位 API 回應:', response.data);

// //       if (response.data.Status === 'Ok') {
// //         setJobDetails(response.data.Data);
// //         setJobDetailsForm(prev => ({
// //           ...prev,
// //           ...fieldsToUpdate
// //         }));
        
// //         console.log('多個欄位更新成功');
        
// //         if (onJobDetailsUpdated) {
// //           onJobDetailsUpdated(response.data.Data);
// //         }
// //       } else {
// //         console.error('API 錯誤:', response.data.Msg || '更新失敗');
// //         setJobDetailsForm(prev => ({
// //           ...prev,
// //           shift_system: jobDetailsForm.shift_system,
// //           shift_option: jobDetailsForm.shift_option
// //         }));
// //       }
// //     } catch (error) {
// //       console.error('更新多個欄位失敗:', error);
// //       setJobDetailsForm(prev => ({
// //         ...prev,
// //         shift_system: jobDetailsForm.shift_system,
// //         shift_option: jobDetailsForm.shift_option
// //       }));
// //     } finally {
// //       setUpdatingField(null);
// //     }
// //   };

// //   // 🔥 修正：處理管理職切換 - 加入權限檢查
// //   const handleManagerToggle = async () => {
// //     if (!hasEditPermission) {
// //       alert('您沒有權限修改職務相關資料');
// //       return;
// //     }

// //     const newValue = !jobDetailsForm.is_manager;
    
// //     setJobDetailsForm(prev => ({
// //       ...prev,
// //       is_manager: newValue
// //     }));
    
// //     await updateSingleField('is_manager', newValue);
// //   };

// //   // 🔥 修正：處理受訓管制切換 - 加入權限檢查
// //   const handleTrainingControlToggle = async () => {
// //     if (!hasEditPermission) {
// //       alert('您沒有權限修改職務相關資料');
// //       return;
// //     }

// //     const newValue = !jobDetailsForm.post_training_control;
    
// //     setJobDetailsForm(prev => ({
// //       ...prev,
// //       post_training_control: newValue
// //     }));
    
// //     await updateSingleField('post_training_control', newValue);
// //   };

// //   // 🔥 修正：處理免打卡切換 - 加入權限檢查
// //   const handleClockFreeToggle = async () => {
// //     if (!hasEditPermission) {
// //       alert('您沒有權限修改職務相關資料');
// //       return;
// //     }

// //     const newValue = !jobDetailsForm.clock_free_treatment;
    
// //     setJobDetailsForm(prev => ({
// //       ...prev,
// //       clock_free_treatment: newValue
// //     }));
    
// //     await updateSingleField('clock_free_treatment', newValue);
// //   };

// // // 🔥 修正：處理班制變更 - 移除部門參數
// // const handleShiftSystemChange = async (systemType, shiftOption = '') => {
// //   if (!hasEditPermission) {
// //     alert('您沒有權限修改職務相關資料');
// //     return;
// //   }

// //   let newShiftSystem = systemType;
// //   let newShiftOption = shiftOption;

// //   if (systemType === 'Fixed Shift') {
// //     newShiftSystem = 'Fixed Shift';
    
// //     // 🔥 如果班別選項為空或載入中，先載入班別
// //     if (shiftOptions.length === 0 && !loadingShiftOptions) {
// //       console.log('班別選項為空，重新載入...');
// //       await fetchCompanyShifts(); // 🔥 修正：不傳入參數
// //     }
    
// //     // 🔥 設定預設班別選項
// //     if (!shiftOption) {
// //       // 等待班別載入完成後再設定預設值
// //       setTimeout(() => {
// //         if (shiftOptions.length > 0) {
// //           const defaultOption = shiftOptions[0].value;
// //           setJobDetailsForm(prev => ({
// //             ...prev,
// //             shift_system: 'Fixed Shift',
// //             shift_option: defaultOption
// //           }));
          
// //           updateMultipleFields({
// //             shift_system: 'Fixed Shift',
// //             shift_option: defaultOption
// //           });
// //         }
// //       }, 500);
      
// //       return;
// //     } else {
// //       newShiftOption = shiftOption;
// //     }
// //   } else if (systemType === 'Flexible working') {
// //     newShiftSystem = 'Flexible working';
// //     newShiftOption = '';
// //   } else if (systemType === 'Scheduled Shift') {
// //     newShiftSystem = 'Scheduled Shift';
// //     newShiftOption = '';
// //   }

// //   setJobDetailsForm(prev => ({
// //     ...prev,
// //     shift_system: newShiftSystem,
// //     shift_option: newShiftOption
// //   }));

// //   await updateMultipleFields({
// //     shift_system: newShiftSystem,
// //     shift_option: newShiftOption
// //   });
// // };


// //   const showDateCalendar = (fieldName, event) => {
// //     const rect = event.target.getBoundingClientRect();
// //     setCalendarPosition({
// //       top: rect.bottom + window.scrollY + 5,
// //       left: rect.left + window.scrollX
// //     });
    
// //     setShowCalendar(prev => ({
// //       ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
// //       [fieldName]: true
// //     }));
// //   };

// //   const handleDateSelect = (fieldName, selectedDate) => {
// //     let dateString = '';
// //     if (selectedDate instanceof Date) {
// //       const year = selectedDate.getFullYear();
// //       const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
// //       const day = String(selectedDate.getDate()).padStart(2, '0');
// //       dateString = `${year}-${month}-${day}`;
// //     } else if (typeof selectedDate === 'string') {
// //       dateString = selectedDate;
// //     }
    
// //     handleJobDetailsChange(fieldName, dateString);
// //     setShowCalendar(prev => ({ ...prev, [fieldName]: false }));
// //   };

// //   // 🔥 修正：渲染可編輯欄位 - 加入權限檢查
// //   const renderEditableField = (label, fieldName, value, type = 'text', options = null) => {
// //     return (
// //       <div className="job-info-row">
// //         <span className="job-label">{label}</span>
// //         {editingJobDetails ? (
// //           type === 'select' ? (
// //             <select
// //               value={value}
// //               onChange={(e) => handleJobDetailsChange(fieldName, e.target.value)}
// //               className="job-select"
// //               disabled={!hasEditPermission}
// //               style={{
// //                 backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                 cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //               }}
// //             >
// //               <option value="">請選擇</option>
// //               {options && options.map(option => (
// //                 <option key={option.value} value={option.value}>
// //                   {option.label}
// //                 </option>
// //               ))}
// //             </select>
// //           ) : type === 'date' ? (
// //             <div className="date-input-container">
// //               <input
// //                 type="text"
// //                 value={value}
// //                 onClick={hasEditPermission ? (e) => showDateCalendar(fieldName, e) : undefined}
// //                 readOnly
// //                 className="job-input date-input"
// //                 placeholder="點擊選擇日期"
// //                 disabled={!hasEditPermission}
// //                 style={{
// //                   backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                 }}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={hasEditPermission ? (e) => showDateCalendar(fieldName, e) : undefined}
// //                 className="calendar-trigger-btn"
// //                 disabled={!hasEditPermission}
// //                 style={{
// //                   opacity: !hasEditPermission ? 0.5 : 1,
// //                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                 }}
// //               >
// //                 📅
// //               </button>
// //             </div>
// //           ) : (
// //             <input
// //               type={type}
// //               value={value}
// //               onChange={(e) => handleJobDetailsChange(fieldName, e.target.value)}
// //               className="job-input"
// //               placeholder={`請輸入${label}`}
// //               disabled={!hasEditPermission}
// //               style={{
// //                 backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                 cursor: !hasEditPermission ? 'not-allowed' : 'text'
// //               }}
// //             />
// //           )
// //         ) : (
// //           <span className="job-value">{value || ''}</span>
// //         )}
// //       </div>
// //     );
// //   };

// //   // 當員工資料變更時，重新查詢職務詳情
// //   useEffect(() => {
// //     if (employee?.employee_id) {
// //       fetchJobDetails();
// //     }
// //   }, [employee?.employee_id]);

// //   // 🔥 修改：暴露方法給父組件，返回結果對象
// //   const startEditing = () => setEditingJobDetails(true);
  
// //   // 🔥 修正：完成編輯 - 加入權限檢查和動態公司ID
// //   const finishEditing = async () => {
// //     if (!hasEditPermission) {
// //       return { success: false, message: '您沒有權限修改職務相關資料' };
// //     }

// //     try {
// //       // 🔥 從 cookies 動態獲取公司ID
// //       const companyId = Cookies.get('company_id');
      
// //       if (!companyId) {
// //         return { success: false, message: '無法獲取公司ID，請重新登入' };
// //       }
      
// //       const cleanedData = cleanFormData(jobDetailsForm);
      
// //       if (jobDetails) {
// //         // 更新現有職務詳情
// //         const updateData = {
// //           ...cleanedData,
// //           updated_by: 'admin'
// //         };

// //         console.log('準備更新職務詳細資料:', updateData);

// //         const response = await axios.put(
// //           `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
// //           updateData,
// //           {
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Accept': 'application/json'
// //             }
// //           }
// //         );

// //         console.log('更新職務詳細資料 API 回應:', response.data);

// //         if (response.data.Status === 'Ok') {
// //           setJobDetails(response.data.Data);
// //           setEditingJobDetails(false);
          
// //           if (onJobDetailsUpdated) {
// //             onJobDetailsUpdated(response.data.Data);
// //           }
          
// //           return { success: true, message: '職務詳細資料更新成功' };
// //         } else {
// //           console.error('API 錯誤:', response.data.Msg || '更新失敗');
// //           return { success: false, message: response.data.Msg || '更新失敗' };
// //         }
// //       } else {
// //         // 新增職務詳情
// //         const jobDetailsData = {
// //           company_id: companyId,
// //           employee_id: employee.employee_id,
// //           ...cleanedData,
// //           created_by: 'admin',
// //           updated_by: 'admin'
// //         };

// //         console.log('準備新增職務詳細資料:', jobDetailsData);

// //         const response = await axios.post(
// //           `${API_BASE_URL}/api/employee-job-details`,
// //           jobDetailsData,
// //           {
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Accept': 'application/json'
// //             }
// //           }
// //         );

// //         console.log('新增職務詳細資料 API 回應:', response.data);

// //         if (response.data.Status === 'Ok') {
// //           setJobDetails(response.data.Data);
// //           setEditingJobDetails(false);
          
// //           if (onJobDetailsUpdated) {
// //             onJobDetailsUpdated(response.data.Data);
// //           }
          
// //           return { success: true, message: '職務詳細資料新增成功' };
// //         } else {
// //           console.error('API 錯誤:', response.data.Msg || '新增失敗');
// //           return { success: false, message: response.data.Msg || '新增失敗' };
// //         }
// //       }
// //     } catch (error) {
// //       console.error('保存職務詳細資料失敗:', error);
// //       return { 
// //         success: false, 
// //         message: error.response?.data?.Msg || '網路錯誤，請稍後再試' 
// //       };
// //     }
// //   };
  
// //   const cancelEditing = () => {
// //     if (jobDetails) {
// //       setJobDetailsForm({
// //         employment_status: jobDetails.employment_status || '',
// //         salary_type: jobDetails.salary_type || '',
// //         department: jobDetails.department || '',
// //         job_grade: jobDetails.job_grade || '',
// //         position: jobDetails.position || '',
// //         shift_system: jobDetails.shift_system || '',
// //         shift_option: jobDetails.shift_option || '',
// //         is_manager: jobDetails.is_manager || false,
// //         supervisor_name: jobDetails.supervisor_name || '',
// //         post_training_control: jobDetails.post_training_control || false,
// //         training_control_until: jobDetails.training_control_until || '',
// //         hire_date: jobDetails.hire_date || '',
// //         probation_start_date: jobDetails.probation_start_date || '',
// //         probation_end_date: jobDetails.probation_end_date || '',
// //         resignation_date: jobDetails.resignation_date || '',
// //         clock_free_treatment: jobDetails.clock_free_treatment || false
// //       });
// //     } else {
// //       setJobDetailsForm({
// //         employment_status: employee.employment_status || '',
// //         salary_type: employee.salary_type || '',
// //         department: employee.department || '',
// //         job_grade: employee.job_grade || '',
// //         position: employee.position || '',
// //         shift_system: employee.shift_system || '',
// //         shift_option: employee.shift_option || '',
// //         is_manager: false,
// //         supervisor_name: employee.supervisor_name || '',
// //         post_training_control: false,
// //         training_control_until: '',
// //         hire_date: '',
// //         probation_start_date: '',
// //         probation_end_date: '',
// //         resignation_date: '',
// //         clock_free_treatment: false
// //       });
// //     }
// //     setEditingJobDetails(false);
// //   };

// //   // 🔥 修正：暴露這些方法和狀態給父組件 - 加入權限狀態
// //   useImperativeHandle(ref, () => ({
// //     startEditing,
// //     finishEditing,
// //     cancelEditing,
// //     isEditing: editingJobDetails,
// //     hasJobDetails: !!jobDetails,
// //     hasEditPermission: hasEditPermission, // 🔥 暴露權限狀態
// //     getFormData: () => jobDetailsForm
// //   }));

// //   if (loadingJobDetails || permissionLoading) {
// //     return (
// //       <div className="job-related-content">
// //         <div className="loading-message">
// //           {permissionLoading ? '檢查權限中...' : '載入職務資料中...'}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="job-related-content">
// //       {/* 🔥 權限錯誤訊息顯示 */}
// //       {permissionError && (
// //         <div className="job-permission-error" style={{
// //           backgroundColor: '#fff3cd',
// //           color: '#856404',
// //           padding: '10px',
// //           borderRadius: '4px',
// //           margin: '10px 0',
// //           border: '1px solid #ffeaa7'
// //         }}>
// //           <strong>權限警告：</strong>{permissionError}
// //         </div>
// //       )}

// //       {/* 🔥 無權限提示 */}
// //       {!hasEditPermission && !permissionLoading && (
// //         <div className="job-no-permission" style={{
// //           backgroundColor: '#f8f9fa',
// //           color: '#6c757d',
// //           padding: '15px',
// //           borderRadius: '4px',
// //           margin: '10px 0',
// //           border: '1px solid #dee2e6',
// //           textAlign: 'center'
// //         }}>
// //           <strong>提示：</strong>您目前沒有編輯職務相關的權限，僅能查看資料
// //         </div>
// //       )}

// //       {/* 標題區域 */}
// //       <div className="job-title-area">
// //         <span className="job-title">職務相關</span>
// //         <div className="personnel-record-button">
// //           <span className="personnel-record-text">人事變更記錄</span>
// //         </div>
// //       </div>

// //       {/* 職務相關內容 */}
// //       <div className="job-content">
// //         {/* 身分別 */}
// //         {renderEditableField(
// //           '身分別', 
// //           'employment_status', 
// //           editingJobDetails ? jobDetailsForm.employment_status : getEmploymentStatusText(jobDetailsForm.employment_status),
// //           'select',
// //           [
// //             { value: 'Full-time', label: '全時' },
// //             { value: 'Active', label: '部分工時' }
// //           ]
// //         )}

// //         {/* 薪別 */}
// //         {renderEditableField(
// //           '薪別', 
// //           'salary_type', 
// //           editingJobDetails ? jobDetailsForm.salary_type : getSalaryTypeText(jobDetailsForm.salary_type),
// //           'select',
// //           [
// //             { value: 'Monthly', label: '月薪' },
// //             { value: 'Hourly', label: '時薪' }
// //           ]
// //         )}

// //         {/* 🔥 修正：班別 - 加入權限檢查和改善下拉選單 */}
// //         <div className="job-info-row">
// //           <span className="job-label">班別</span>
// //           <div className="shift-type-container">
// //             <div className="shift-type-options">
// //               {/* 固定班制 */}
// //               <div className="shift-type-option">
// //                 <input
// //                   type="radio"
// //                   id="fixed-shift"
// //                   name="shift_system"
// //                   value="Fixed Shift"
// //                   checked={jobDetailsForm.shift_system === 'Fixed Shift'}
// //                   onChange={async (e) => {
// //                     if (e.target.checked) {
// //                       // 🔥 先載入班別選項，然後選擇第一個
// //                       if (shiftOptions.length === 0) {
// //                         await fetchCompanyShifts(jobDetailsForm.department || employee.department);
// //                       }
// //                       await handleShiftSystemChange('Fixed Shift');
// //                     }
// //                   }}
// //                   className="shift-type-radio"
// //                   disabled={updatingField === 'shift_system' || !hasEditPermission}
// //                 />
// //                 <label htmlFor="fixed-shift" className="shift-type-label">
// //                   固定班制
// //                 </label>
// //                 {jobDetailsForm.shift_system === 'Fixed Shift' && (
// //                   <select
// //                     value={jobDetailsForm.shift_option || ''}
// //                     onChange={async (e) => {
// //                       await handleShiftSystemChange('Fixed Shift', e.target.value);
// //                     }}
// //                     className="fixed-shift-select"
// //                     disabled={updatingField === 'shift_system' || loadingShiftOptions || !hasEditPermission}
// //                     style={{
// //                       backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                       cursor: !hasEditPermission ? 'not-allowed' : 'pointer',
// //                       minWidth: '120px' // 確保下拉選單有足夠寬度
// //                     }}
// //                   >
// //                     {loadingShiftOptions ? (
// //                       <option value="">載入班別中...</option>
// //                     ) : shiftOptions.length === 0 ? (
// //                       <option value="">無可用班別</option>
// //                     ) : (
// //                       <>
// //                         {shiftOptions.map(option => (
// //                           <option key={option.value} value={option.value}>
// //                             {option.label}
// //                           </option>
// //                         ))}
// //                       </>
// //                     )}
// //                   </select>
// //                 )}
// //               </div>

// //               {/* 輪班制 */}
// //               <div className="shift-type-option">
// //                 <input
// //                   type="radio"
// //                   id="flexible-shift"
// //                   name="shift_system"
// //                   value="Flexible working"
// //                   checked={jobDetailsForm.shift_system === 'Flexible working'}
// //                   onChange={async (e) => {
// //                     if (e.target.checked) {
// //                       await handleShiftSystemChange('Flexible working');
// //                     }
// //                   }}
// //                   className="shift-type-radio"
// //                   disabled={updatingField === 'shift_system' || !hasEditPermission}
// //                 />
// //                 <label htmlFor="flexible-shift" className="shift-type-label">
// //                   輪班制
// //                 </label>
// //               </div>

// //               {/* 排班制 */}
// //               <div className="shift-type-option">
// //                 <input
// //                   type="radio"
// //                   id="scheduled-shift"
// //                   name="shift_system"
// //                   value="Scheduled Shift"
// //                   checked={jobDetailsForm.shift_system === 'Scheduled Shift'}
// //                   onChange={async (e) => {
// //                     if (e.target.checked) {
// //                       await handleShiftSystemChange('Scheduled Shift');
// //                     }
// //                   }}
// //                   className="shift-type-radio"
// //                   disabled={updatingField === 'shift_system' || !hasEditPermission}
// //                 />
// //                 <label htmlFor="scheduled-shift" className="shift-type-label">
// //                   排班制
// //                 </label>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* 部門 */}
// //         {renderEditableField(
// //           '部門', 
// //           'department', 
// //           jobDetailsForm.department,
// //           'select',
// //           [
// //             { value: '業務部', label: '業務部' },
// //             { value: '人資部', label: '人資部' },
// //             { value: '財務部', label: '財務部' },
// //             { value: '技術部', label: '技術部' },
// //             { value: '行銷部', label: '行銷部' }
// //           ]
// //         )}

// //         {/* 職稱 */}
// //         {renderEditableField('職稱', 'position', jobDetailsForm.position, 'text')}

// //         {/* 🔥 修正：管理職 - 加入權限檢查 */}
// //         <div className="job-info-row">
// //           <span className="job-label">管理職</span>
// //           <ToggleSwitch 
// //             isOn={jobDetailsForm.is_manager}
// //             onToggle={handleManagerToggle}
// //             disabled={updatingField === 'is_manager' || !hasEditPermission}
// //           />
// //         </div>

// //         {/* 🔥 修正：上級主管 - 加入權限檢查 */}
// //         <div className="job-info-row">
// //           <span className="job-label">上級主管</span>
// //           {editingJobDetails ? (
// //             <input
// //               type="text"
// //               value={jobDetailsForm.supervisor_name}
// //               onChange={(e) => handleJobDetailsChange('supervisor_name', e.target.value)}
// //               className="job-input"
// //               placeholder="請輸入上級主管姓名"
// //               disabled={!hasEditPermission}
// //               style={{
// //                 backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                 cursor: !hasEditPermission ? 'not-allowed' : 'text'
// //               }}
// //             />
// //           ) : (
// //             <span className="job-value">{jobDetailsForm.supervisor_name || ''}</span>
// //           )}
// //         </div>

// //         {/* 職級 */}
// //         {renderEditableField(
// //           '職級', 
// //           'job_grade', 
// //           editingJobDetails ? jobDetailsForm.job_grade : getJobGradeText(jobDetailsForm.job_grade),
// //           'select',
// //           [
// //             { value: 'staff', label: '員工' },
// //             { value: 'hr', label: '主管' }
// //           ]
// //         )}

// //         {/* 🔥 修正：受訓後管制 - 加入權限檢查 */}
// //         <div className="job-info-row">
// //           <span className="job-label">受訓後管制</span>
// //           <div className="training-control-container">
// //             <ToggleSwitch 
// //               isOn={jobDetailsForm.post_training_control}
// //               onToggle={handleTrainingControlToggle}
// //               disabled={updatingField === 'post_training_control' || !hasEditPermission}
// //             />
// //             {jobDetailsForm.post_training_control && jobDetailsForm.training_control_until && (
// //               <span className="training-until">至 {jobDetailsForm.training_control_until}</span>
// //             )}
// //           </div>
// //         </div>

// //         {/* 受訓管制日期 */}
// //         {jobDetailsForm.post_training_control && editingJobDetails && !jobDetailsForm.training_control_until && (
// //           <div className="job-info-row">
// //             <span className="job-label">至</span>
// //             <div className="date-input-container">
// //               <input
// //                 type="text"
// //                 value={jobDetailsForm.training_control_until}
// //                 onClick={hasEditPermission ? (e) => showDateCalendar('training_control_until', e) : undefined}
// //                 readOnly
// //                 className="job-input date-input"
// //                 placeholder="點擊選擇日期"
// //                 disabled={!hasEditPermission}
// //                 style={{
// //                   backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                 }}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={hasEditPermission ? (e) => showDateCalendar('training_control_until', e) : undefined}
// //                 className="calendar-trigger-btn"
// //                 disabled={!hasEditPermission}
// //                 style={{
// //                   opacity: !hasEditPermission ? 0.5 : 1,
// //                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                 }}
// //               >
// //                 📅
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* 年資（自動計算） */}
// //         <div className="job-info-row">
// //           <span className="job-label">年資（自動計算）</span>
// //           <span className="job-value">
// //             {jobDetailsForm.hire_date ? calculateYearsOfService(jobDetailsForm.hire_date) : '-年-月1日'}
// //           </span>
// //         </div>

// //         {/* 到職日 */}
// //         {renderEditableField('到職日', 'hire_date', jobDetailsForm.hire_date, 'date')}

// //         {/* 🔥 修正：試用期 - 加入權限檢查 */}
// //         <div className="job-info-row">
// //           <span className="job-label">試用期</span>
// //           {editingJobDetails ? (
// //             <div className="probation-period-container">
// //               <div className="date-input-container">
// //                 <input
// //                   type="text"
// //                   value={jobDetailsForm.probation_start_date}
// //                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_start_date', e) : undefined}
// //                   readOnly
// //                   className="job-input date-input"
// //                   placeholder="開始日期"
// //                   style={{ 
// //                     width: '45%',
// //                     backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                   }}
// //                   disabled={!hasEditPermission}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_start_date', e) : undefined}
// //                   className="calendar-trigger-btn"
// //                   disabled={!hasEditPermission}
// //                   style={{
// //                     opacity: !hasEditPermission ? 0.5 : 1,
// //                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                   }}
// //                 >
// //                   📅
// //                 </button>
// //               </div>
// //               <span>至</span>
// //               <div className="date-input-container">
// //                 <input
// //                   type="text"
// //                   value={jobDetailsForm.probation_end_date}
// //                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_end_date', e) : undefined}
// //                   readOnly
// //                   className="job-input date-input"
// //                   placeholder="結束日期"
// //                   style={{ 
// //                     width: '45%',
// //                     backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
// //                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                   }}
// //                   disabled={!hasEditPermission}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_end_date', e) : undefined}
// //                   className="calendar-trigger-btn"
// //                   disabled={!hasEditPermission}
// //                   style={{
// //                     opacity: !hasEditPermission ? 0.5 : 1,
// //                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
// //                   }}
// //                 >
// //                   📅
// //                 </button>
// //               </div>
// //             </div>
// //           ) : (
// //             <span className="job-value">
// //               {jobDetailsForm.probation_start_date && jobDetailsForm.probation_end_date ? 
// //                 `${jobDetailsForm.probation_start_date} 至 ${jobDetailsForm.probation_end_date}` : 
// //                 jobDetailsForm.probation_start_date ? `${jobDetailsForm.probation_start_date} 至 未設定` :
// //                 jobDetailsForm.probation_end_date ? `未設定 至 ${jobDetailsForm.probation_end_date}` : ''}
// //             </span>
// //           )}
// //         </div>

// //         {/* 離職日 */}
// //         {renderEditableField('離職日', 'resignation_date', jobDetailsForm.resignation_date, 'date')}

// //         {/* 🔥 修正：免打卡待遇 - 加入權限檢查 */}
// //         <div className="job-info-row">
// //           <span className="job-label">免打卡待遇</span>
// //           <ToggleSwitch 
// //             isOn={jobDetailsForm.clock_free_treatment}
// //             onToggle={handleClockFreeToggle}
// //             disabled={updatingField === 'clock_free_treatment' || !hasEditPermission}
// //           />
// //         </div>
// //       </div>
      
// //       {/* 🔥 修正：日曆選擇器 - 只在有權限時顯示 */}
// //       {hasEditPermission && Object.entries(showCalendar).map(([fieldName, isVisible]) => 
// //         isVisible && (
// //           <CalendarSelector
// //             key={fieldName}
// //             isVisible={isVisible}
// //             selectedDate={jobDetailsForm[fieldName] ? new Date(jobDetailsForm[fieldName]) : null}
// //             onDateSelect={(date) => handleDateSelect(fieldName, date)}
// //             onClose={() => setShowCalendar(prev => ({ ...prev, [fieldName]: false }))}
// //             position={calendarPosition}
// //           />
// //         )
// //       )}
// //     </div>
// //   );
// // });

// // export default JobRelated;
// import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { API_BASE_URL } from '../../../../config';
// import CalendarSelector from '../Calendar_Selector';

// const JobRelated = forwardRef(({ 
//   employee,
//   ToggleSwitch,
//   onJobDetailsUpdated
// }, ref) => {
//   // 將所有職務相關的狀態移到這裡
//   const [jobDetails, setJobDetails] = useState(null);
//   const [loadingJobDetails, setLoadingJobDetails] = useState(false);
//   const [editingJobDetails, setEditingJobDetails] = useState(false);
//   const [updatingField, setUpdatingField] = useState(null);
//   const [shiftOptions, setShiftOptions] = useState([]);
//   const [loadingShiftOptions, setLoadingShiftOptions] = useState(false);
//   const [showCalendar, setShowCalendar] = useState({
//     training_control_until: false,
//     probation_start_date: false,
//     probation_end_date: false,
//     hire_date: false,
//     resignation_date: false
//   });
//   const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
//   const [jobDetailsForm, setJobDetailsForm] = useState({
//     employment_status: '',
//     salary_type: '',
//     department: '',
//     job_grade: '',
//     position: '',
//     shift_system: '',
//     shift_option: '',
//     is_manager: false,
//     supervisor_name: '',
//     post_training_control: false,
//     training_control_until: '',
//     hire_date: '',
//     probation_start_date: '',
//     probation_end_date: '',
//     resignation_date: '',
//     clock_free_treatment: false
//   });

//   // 🔥 新增：權限相關狀態
//   const [permissions, setPermissions] = useState(null);
//   const [hasEditPermission, setHasEditPermission] = useState(false);
//   const [permissionLoading, setPermissionLoading] = useState(false);
//   const [permissionError, setPermissionError] = useState('');

//   // 🔥 新增：檢查必要的 cookies 是否存在
//   const checkRequiredCookies = () => {
//     const companyId = Cookies.get('company_id');
//     const employeeId = Cookies.get('employee_id');
    
//     if (!companyId) {
//       console.error('缺少 company_id cookie，請重新登入');
//       return false;
//     }
    
//     if (!employeeId) {
//       console.error('缺少 employee_id cookie，請重新登入');
//       return false;
//     }
    
//     return true;
//   };

//   // 🔥 修正：檢查當前登入使用者的權限，而不是被查看員工的權限
//   const checkCurrentUserPermissions = async () => {
//     try {
//       const companyId = Cookies.get('company_id');
//       const currentUserId = Cookies.get('employee_id'); // 🔥 當前登入使用者的ID
      
//       if (!companyId || !currentUserId) {
//         return {
//           success: false,
//           message: '無法獲取公司ID或使用者ID',
//           hasEditPermission: false
//         };
//       }
      
//       console.log('🔍 檢查當前使用者職務相關權限:', currentUserId);
      
//       const response = await axios.get(
//         `${API_BASE_URL}/api/company/employee-permissions/${currentUserId}`, // 🔥 使用當前使用者ID
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'x-company-id': companyId
//           },
//           params: {
//             company_id: companyId
//           },
//           timeout: 10000,
//           validateStatus: function (status) {
//             return status < 500;
//           }
//         }
//       );

//       console.log('🔍 當前使用者職務相關權限檢查 API 回應:', response.data);
      
//       if (response.data && response.data.Status === 'Ok') {
//         // 🔥 從 raw_data 中讀取權限
//         const rawData = response.data.Data?.raw_data;
//         const hasPermission = rawData?.employee_data === 1 || rawData?.employee_data === '1';
        
//         console.log('🔍 當前使用者職務相關原始權限資料:', rawData);
//         console.log('🔍 employee_data 權限值:', rawData?.employee_data);
//         console.log('🔍 職務相關最終權限判斷:', hasPermission);
        
//         return {
//           success: true,
//           permissions: rawData,
//           hasEditPermission: hasPermission
//         };
//       } else {
//         return {
//           success: false,
//           message: response.data?.Msg || '權限檢查失敗',
//           hasEditPermission: false
//         };
//       }
//     } catch (error) {
//       console.error('❌ 職務相關權限檢查 API 錯誤:', error);
//       return {
//         success: false,
//         message: error.message || '權限檢查失敗',
//         hasEditPermission: false
//       };
//     }
//   };

//   // 🔥 修正：只在組件初始化時檢查一次當前使用者權限，不依賴被查看的員工
//   useEffect(() => {
//     // 🔥 在組件初始化時檢查 cookies
//     if (!checkRequiredCookies()) {
//       setPermissionError('登入資訊不完整，請重新登入');
//       return;
//     }

//     const loadCurrentUserPermissions = async () => {
//       setPermissionLoading(true);
//       setPermissionError('');
      
//       try {
//         const result = await checkCurrentUserPermissions();
        
//         if (result.success) {
//           setPermissions(result.permissions);
//           setHasEditPermission(result.hasEditPermission);
//           console.log('✅ 當前使用者職務相關權限檢查成功:', result.permissions);
//           console.log('✅ 職務相關編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
//         } else {
//           setPermissionError(result.message);
//           setHasEditPermission(false);
//           console.error('❌ 當前使用者職務相關權限檢查失敗:', result.message);
//         }
//       } catch (error) {
//         setPermissionError('權限檢查發生錯誤');
//         setHasEditPermission(false);
//         console.error('❌ 當前使用者職務相關權限檢查異常:', error);
//       } finally {
//         setPermissionLoading(false);
//       }
//     };

//     loadCurrentUserPermissions();
//   }, []); // 🔥 移除對 employee?.employee_id 的依賴，只在組件初始化時執行一次

//   // 將所有職務相關的函數移到這裡
//   const getJobGradeText = (jobGrade) => {
//     switch (jobGrade) {
//       case 'staff':
//         return '員工';
//       case 'hr':
//         return '主管';
//       default:
//         return jobGrade || '';
//     }
//   };

//   const getEmploymentStatusText = (status) => {
//     switch (status) {
//       case 'Full-time':
//         return '全時';
//       case 'Active':
//         return '部分工時';
//       default:
//         return status || '';
//     }
//   };

//   const getSalaryTypeText = (salaryType) => {
//     switch (salaryType) {
//       case 'Monthly':
//         return '月薪';
//       case 'Hourly':
//         return '時薪';
//       default:
//         return salaryType || '';
//     }
//   };

//   const calculateYearsOfService = (hireDate) => {
//     if (!hireDate) return '-年-月1日';
    
//     const hire = new Date(hireDate);
//     const today = new Date('2025-12-14');
//     const diffTime = today - hire;
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
//     const years = Math.floor(diffDays / 365);
//     const months = Math.floor((diffDays % 365) / 30);
    
//     return `${years}年${months}月1日`;
//   };

//   // 🔥 新增：設定預設班別選項的函數
//   const setDefaultShiftOptions = () => {
//     const defaultOptions = [
//       { value: '早班', label: '早班' },
//       { value: '中班', label: '中班' },
//       { value: '晚班', label: '晚班' },
//       { value: '大夜班', label: '大夜班' },
//       { value: '正常班', label: '正常班' }
//     ];
    
//     setShiftOptions(defaultOptions);
//     console.log('使用預設班別選項:', defaultOptions);
//   };

//   // 🔥 修正：不傳送 department 參數，查詢公司所有班別
//   const fetchCompanyShifts = async () => {
//     setLoadingShiftOptions(true);
//     try {
//       // 🔥 從 cookies 動態獲取公司ID，不寫死
//       const companyId = Cookies.get('company_id');
      
//       if (!companyId) {
//         console.error('無法獲取公司ID，請重新登入');
//         setDefaultShiftOptions();
//         return;
//       }
      
//       console.log('查詢公司排班資訊:', {
//         company_id: companyId
//         // 🔥 移除 department 參數
//       });

//       const response = await axios.get(
//         `${API_BASE_URL}/api/company/shifts`,
//         {
//           params: {
//             company_id: companyId
//             // 🔥 不傳送 department 參數，讓後端查詢該公司所有班別
//           },
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       console.log('公司排班資訊 API 回應:', response.data);

//       if (response.data.Status === 'Ok' && response.data.Data && Array.isArray(response.data.Data)) {
//         if (response.data.Data.length > 0) {
//           // 🔥 根據您的資料庫結構調整
//           const options = response.data.Data.map(shift => ({
//             value: shift.shift_category || shift.shift_name || shift.name || shift.shift_type,
//             label: shift.shift_category || shift.shift_name || shift.name || shift.shift_type
//           }));
          
//           setShiftOptions(options);
//           console.log('✅ 成功載入班別選項:', options);
//         } else {
//           console.log('該公司沒有設定班別，使用預設選項');
//           setDefaultShiftOptions();
//         }
//       } else {
//         console.log('API 回應格式異常或無資料:', response.data);
//         setDefaultShiftOptions();
//       }
//     } catch (error) {
//       console.error('查詢公司排班資訊失敗:', error);
      
//       // 根據錯誤類型提供不同的處理
//       if (error.code === 'ECONNABORTED') {
//         console.error('API 請求超時');
//       } else if (error.response) {
//         console.error('API 回應錯誤:', error.response.status, error.response.data);
//       } else if (error.request) {
//         console.error('API 請求失敗，無回應');
//       }
      
//       setDefaultShiftOptions();
//     } finally {
//       setLoadingShiftOptions(false);
//     }
//   };

//   // 🔥 修正：從 cookies 動態獲取公司ID - 處理 TINYINT 轉布林值
//   const fetchJobDetails = async () => {
//     if (!employee?.employee_id) {
//       console.log('沒有員工ID，無法查詢職務詳情');
//       return;
//     }
    
//     setLoadingJobDetails(true);
//     try {
//       // 🔥 從 cookies 動態獲取公司ID
//       const companyId = Cookies.get('company_id');
      
//       if (!companyId) {
//         console.error('無法獲取公司ID，請重新登入');
//         setLoadingJobDetails(false);
//         return;
//       }
      
//       console.log('查詢員工職務詳細資料:', {
//         company_id: companyId,
//         employee_id: employee.employee_id
//       });

//       const response = await axios.get(
//         `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         }
//       );

//       console.log('職務詳細資料 API 回應:', response.data);

//       if (response.data.Status === 'Ok' && response.data.Data) {
//         console.log('✅ 成功載入職務詳情:', response.data.Data);
//         setJobDetails(response.data.Data);
        
//         const data = response.data.Data;
        
//         setJobDetailsForm({
//           employment_status: data.employment_status || '',
//           salary_type: data.salary_type || '',
//           department: data.department || '',
//           job_grade: data.job_grade || '',
//           position: data.position || '',
//           shift_system: data.shift_system || '',
//           shift_option: data.shift_option || '',
//           // 🔥 修正：將 TINYINT 轉換為布林值
//           is_manager: Boolean(data.is_manager),
//           supervisor_name: data.supervisor_name || '',
//           post_training_control: Boolean(data.post_training_control),
//           training_control_until: data.training_control_until || '',
//           hire_date: data.hire_date || '',
//           probation_start_date: data.probation_start_date || '',
//           probation_end_date: data.probation_end_date || '',
//           resignation_date: data.resignation_date || '',
//           clock_free_treatment: Boolean(data.clock_free_treatment)
//         });
        
//         console.log('設定的表單資料:', {
//           supervisor_name: data.supervisor_name,
//           is_manager: Boolean(data.is_manager),
//           post_training_control: Boolean(data.post_training_control),
//           clock_free_treatment: Boolean(data.clock_free_treatment)
//         });
        
//         await fetchCompanyShifts();
//       } else {
//         console.log('❌ 未找到職務詳細資料:', response.data.Msg);
//         setJobDetails(null);
        
//         setJobDetailsForm({
//           employment_status: employee.employment_status || '',
//           salary_type: employee.salary_type || '',
//           department: employee.department || '',
//           job_grade: employee.job_grade || '',
//           position: employee.position || '',
//           shift_system: employee.shift_system || '',
//           shift_option: employee.shift_option || '',
//           is_manager: false,
//           supervisor_name: employee.supervisor_name || '',
//           post_training_control: false,
//           training_control_until: '',
//           hire_date: '',
//           probation_start_date: '',
//           probation_end_date: '',
//           resignation_date: '',
//           clock_free_treatment: false
//         });
        
//         await fetchCompanyShifts();
//       }
//     } catch (error) {
//       console.error('❌ 查詢職務詳細資料失敗:', error);
//       setJobDetails(null);
      
//       setJobDetailsForm({
//         employment_status: employee.employment_status || '',
//         salary_type: employee.salary_type || '',
//         department: employee.department || '',
//         job_grade: employee.job_grade || '',
//         position: employee.position || '',
//         shift_system: employee.shift_system || '',
//         shift_option: employee.shift_option || '',
//         is_manager: false,
//         supervisor_name: employee.supervisor_name || '',
//         post_training_control: false,
//         training_control_until: '',
//         hire_date: '',
//         probation_start_date: '',
//         probation_end_date: '',
//         resignation_date: '',
//         clock_free_treatment: false
//       });
      
//       await fetchCompanyShifts();
//     } finally {
//       setLoadingJobDetails(false);
//     }
//   };

//   // 🔥 修正：cleanFormData 函數 - 處理 TINYINT 布林值
//   const cleanFormData = (formData) => {
//     const cleaned = { ...formData };
    
//     const dateFields = ['hire_date', 'probation_start_date', 'probation_end_date', 'resignation_date', 'training_control_until'];
//     dateFields.forEach(field => {
//       if (cleaned[field] === '' || cleaned[field] === null || cleaned[field] === undefined) {
//         cleaned[field] = null;
//       }
//     });
    
//     // 🔥 修正：將布林值轉換為 TINYINT (0 或 1)
//     cleaned.is_manager = cleaned.is_manager ? 1 : 0;
//     cleaned.post_training_control = cleaned.post_training_control ? 1 : 0;
//     cleaned.clock_free_treatment = cleaned.clock_free_treatment ? 1 : 0;
    
//     console.log('清理後的表單資料:', cleaned);
    
//     return cleaned;
//   };

//   // 🔥 修正：處理職務詳情變更 - 移除部門變更時的班別重新載入
//   const handleJobDetailsChange = (field, value) => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     setJobDetailsForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // 🔥 修正：更新單一欄位 - 移除 jobDetails 檢查，改用 upsert 邏輯
//   const updateSingleField = async (fieldName, newValue) => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     if (!employee?.employee_id) {
//       console.log('缺少員工資訊，無法更新');
//       return;
//     }

//     try {
//       setUpdatingField(fieldName);
      
//       // 🔥 從 cookies 動態獲取公司ID
//       const companyId = Cookies.get('company_id');
      
//       if (!companyId) {
//         console.error('無法獲取公司ID，請重新登入');
//         return;
//       }
      
//       const updateData = {
//         ...jobDetailsForm,
//         [fieldName]: newValue,
//         updated_by: 'admin'
//       };

//       const cleanedData = cleanFormData(updateData);

//       console.log(`準備更新 ${fieldName}:`, { [fieldName]: newValue });

//       // 🔥 統一使用 PUT，後端會自動處理建立或更新
//       const response = await axios.put(
//         `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
//         cleanedData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         }
//       );

//       console.log(`更新 ${fieldName} API 回應:`, response.data);

//       if (response.data.Status === 'Ok') {
//         setJobDetails(response.data.Data);
//         setJobDetailsForm(prev => ({
//           ...prev,
//           [fieldName]: newValue
//         }));
        
//         console.log(`${fieldName} 更新成功`);
        
//         if (onJobDetailsUpdated) {
//           onJobDetailsUpdated(response.data.Data);
//         }
//       } else {
//         console.error('API 錯誤:', response.data.Msg || '更新失敗');
//         setJobDetailsForm(prev => ({
//           ...prev,
//           [fieldName]: jobDetailsForm[fieldName]
//         }));
//       }
//     } catch (error) {
//       console.error(`更新 ${fieldName} 失敗:`, error);
//       setJobDetailsForm(prev => ({
//         ...prev,
//         [fieldName]: jobDetailsForm[fieldName]
//       }));
//     } finally {
//       setUpdatingField(null);
//     }
//   };

//   // 🔥 修正：更新多個欄位 - 移除 jobDetails 檢查，改用 upsert 邏輯
//   const updateMultipleFields = async (fieldsToUpdate) => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     if (!employee?.employee_id) {
//       console.log('缺少員工資訊，無法更新');
//       return;
//     }

//     try {
//       setUpdatingField('shift_system');
      
//       // 🔥 從 cookies 動態獲取公司ID
//       const companyId = Cookies.get('company_id');
      
//       if (!companyId) {
//         console.error('無法獲取公司ID，請重新登入');
//         return;
//       }
      
//       const updateData = {
//         ...jobDetailsForm,
//         ...fieldsToUpdate,
//         updated_by: 'admin'
//       };

//       const cleanedData = cleanFormData(updateData);

//       console.log('準備同時更新多個欄位:', fieldsToUpdate);

//       // 🔥 統一使用 PUT，後端會自動處理建立或更新
//       const response = await axios.put(
//         `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
//         cleanedData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         }
//       );

//       console.log('更新多個欄位 API 回應:', response.data);

//       if (response.data.Status === 'Ok') {
//         setJobDetails(response.data.Data);
//         setJobDetailsForm(prev => ({
//           ...prev,
//           ...fieldsToUpdate
//         }));
        
//         console.log('多個欄位更新成功');
        
//         if (onJobDetailsUpdated) {
//           onJobDetailsUpdated(response.data.Data);
//         }
//       } else {
//         console.error('API 錯誤:', response.data.Msg || '更新失敗');
//         setJobDetailsForm(prev => ({
//           ...prev,
//           shift_system: jobDetailsForm.shift_system,
//           shift_option: jobDetailsForm.shift_option
//         }));
//       }
//     } catch (error) {
//       console.error('更新多個欄位失敗:', error);
//       setJobDetailsForm(prev => ({
//         ...prev,
//         shift_system: jobDetailsForm.shift_system,
//         shift_option: jobDetailsForm.shift_option
//       }));
//     } finally {
//       setUpdatingField(null);
//     }
//   };

//   // 🔥 修正：處理管理職切換 - 加入權限檢查
//   const handleManagerToggle = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     const newValue = !jobDetailsForm.is_manager;
    
//     setJobDetailsForm(prev => ({
//       ...prev,
//       is_manager: newValue
//     }));
    
//     await updateSingleField('is_manager', newValue);
//   };

//   // 🔥 修正：處理受訓管制切換 - 加入權限檢查
//   const handleTrainingControlToggle = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     const newValue = !jobDetailsForm.post_training_control;
    
//     setJobDetailsForm(prev => ({
//       ...prev,
//       post_training_control: newValue
//     }));
    
//     await updateSingleField('post_training_control', newValue);
//   };

//   // 🔥 修正：處理免打卡切換 - 加入權限檢查
//   const handleClockFreeToggle = async () => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     const newValue = !jobDetailsForm.clock_free_treatment;
    
//     setJobDetailsForm(prev => ({
//       ...prev,
//       clock_free_treatment: newValue
//     }));
    
//     await updateSingleField('clock_free_treatment', newValue);
//   };

//   // 🔥 修正：處理班制變更 - 移除部門參數
//   const handleShiftSystemChange = async (systemType, shiftOption = '') => {
//     if (!hasEditPermission) {
//       alert('您沒有權限修改職務相關資料');
//       return;
//     }

//     let newShiftSystem = systemType;
//     let newShiftOption = shiftOption;

//     if (systemType === 'Fixed Shift') {
//       newShiftSystem = 'Fixed Shift';
      
//       // 🔥 如果班別選項為空或載入中，先載入班別
//       if (shiftOptions.length === 0 && !loadingShiftOptions) {
//         console.log('班別選項為空，重新載入...');
//         await fetchCompanyShifts(); // 🔥 修正：不傳入參數
//       }
      
//       // 🔥 設定預設班別選項
//       if (!shiftOption) {
//         // 等待班別載入完成後再設定預設值
//         setTimeout(() => {
//           if (shiftOptions.length > 0) {
//             const defaultOption = shiftOptions[0].value;
//             setJobDetailsForm(prev => ({
//               ...prev,
//               shift_system: 'Fixed Shift',
//               shift_option: defaultOption
//             }));
            
//             updateMultipleFields({
//               shift_system: 'Fixed Shift',
//               shift_option: defaultOption
//             });
//           }
//         }, 500);
        
//         return;
//       } else {
//         newShiftOption = shiftOption;
//       }
//     } else if (systemType === 'Flexible working') {
//       newShiftSystem = 'Flexible working';
//       newShiftOption = '';
//     } else if (systemType === 'Scheduled Shift') {
//       newShiftSystem = 'Scheduled Shift';
//       newShiftOption = '';
//     }

//     setJobDetailsForm(prev => ({
//       ...prev,
//       shift_system: newShiftSystem,
//       shift_option: newShiftOption
//     }));

//     await updateMultipleFields({
//       shift_system: newShiftSystem,
//       shift_option: newShiftOption
//     });
//   };

//   const showDateCalendar = (fieldName, event) => {
//     const rect = event.target.getBoundingClientRect();
//     setCalendarPosition({
//       top: rect.bottom + window.scrollY + 5,
//       left: rect.left + window.scrollX
//     });
    
//     setShowCalendar(prev => ({
//       ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
//       [fieldName]: true
//     }));
//   };

//   const handleDateSelect = (fieldName, selectedDate) => {
//     let dateString = '';
//     if (selectedDate instanceof Date) {
//       const year = selectedDate.getFullYear();
//       const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
//       const day = String(selectedDate.getDate()).padStart(2, '0');
//       dateString = `${year}-${month}-${day}`;
//     } else if (typeof selectedDate === 'string') {
//       dateString = selectedDate;
//     }
    
//     handleJobDetailsChange(fieldName, dateString);
//     setShowCalendar(prev => ({ ...prev, [fieldName]: false }));
//   };

//   // 🔥 修正：渲染可編輯欄位 - 加入權限檢查
//   const renderEditableField = (label, fieldName, value, type = 'text', options = null) => {
//     return (
//       <div className="job-info-row">
//         <span className="job-label">{label}</span>
//         {editingJobDetails ? (
//           type === 'select' ? (
//             <select
//               value={value}
//               onChange={(e) => handleJobDetailsChange(fieldName, e.target.value)}
//               className="job-select"
//               disabled={!hasEditPermission}
//               style={{
//                 backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                 cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//               }}
//             >
//               <option value="">請選擇</option>
//               {options && options.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           ) : type === 'date' ? (
//             <div className="date-input-container">
//               <input
//                 type="text"
//                 value={value}
//                 onClick={hasEditPermission ? (e) => showDateCalendar(fieldName, e) : undefined}
//                 readOnly
//                 className="job-input date-input"
//                 placeholder="點擊選擇日期"
//                 disabled={!hasEditPermission}
//                 style={{
//                   backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={hasEditPermission ? (e) => showDateCalendar(fieldName, e) : undefined}
//                 className="calendar-trigger-btn"
//                 disabled={!hasEditPermission}
//                 style={{
//                   opacity: !hasEditPermission ? 0.5 : 1,
//                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 📅
//               </button>
//             </div>
//           ) : (
//             <input
//               type={type}
//               value={value}
//               onChange={(e) => handleJobDetailsChange(fieldName, e.target.value)}
//               className="job-input"
//               placeholder={`請輸入${label}`}
//               disabled={!hasEditPermission}
//               style={{
//                 backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                 cursor: !hasEditPermission ? 'not-allowed' : 'text'
//               }}
//             />
//           )
//         ) : (
//           <span className="job-value">{value || ''}</span>
//         )}
//       </div>
//     );
//   };

//   // 當員工資料變更時，重新查詢職務詳情
//   useEffect(() => {
//     if (employee?.employee_id) {
//       fetchJobDetails();
//     }
//   }, [employee?.employee_id]);

//   // 🔥 修改：暴露方法給父組件，返回結果對象
//   const startEditing = () => setEditingJobDetails(true);
  
//   // 🔥 修正：完成編輯 - 改用 upsert 邏輯
//   const finishEditing = async () => {
//     if (!hasEditPermission) {
//       return { success: false, message: '您沒有權限修改職務相關資料' };
//     }

//     try {
//       // 🔥 從 cookies 動態獲取公司ID
//       const companyId = Cookies.get('company_id');
      
//       if (!companyId) {
//         return { success: false, message: '無法獲取公司ID，請重新登入' };
//       }
      
//       const cleanedData = cleanFormData(jobDetailsForm);
      
//       // 🔥 統一使用 PUT，後端會自動處理建立或更新
//       const updateData = {
//         ...cleanedData,
//         updated_by: 'admin'
//       };

//       console.log('準備保存職務詳細資料:', updateData);

//       const response = await axios.put(
//         `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
//         updateData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         }
//       );

//       console.log('保存職務詳細資料 API 回應:', response.data);

//       if (response.data.Status === 'Ok') {
//         setJobDetails(response.data.Data);
//         setEditingJobDetails(false);
        
//         if (onJobDetailsUpdated) {
//           onJobDetailsUpdated(response.data.Data);
//         }
        
//         return { 
//           success: true, 
//           message: jobDetails ? '職務詳細資料更新成功' : '職務詳細資料建立成功' 
//         };
//       } else {
//         console.error('API 錯誤:', response.data.Msg || '保存失敗');
//         return { success: false, message: response.data.Msg || '保存失敗' };
//       }
//     } catch (error) {
//       console.error('保存職務詳細資料失敗:', error);
//       return { 
//         success: false, 
//         message: error.response?.data?.Msg || '網路錯誤，請稍後再試' 
//       };
//     }
//   };
  
//   const cancelEditing = () => {
//     if (jobDetails) {
//       setJobDetailsForm({
//         employment_status: jobDetails.employment_status || '',
//         salary_type: jobDetails.salary_type || '',
//         department: jobDetails.department || '',
//         job_grade: jobDetails.job_grade || '',
//         position: jobDetails.position || '',
//         shift_system: jobDetails.shift_system || '',
//         shift_option: jobDetails.shift_option || '',
//         is_manager: Boolean(jobDetails.is_manager), // 🔥 修正：轉換為布林值
//         supervisor_name: jobDetails.supervisor_name || '',
//         post_training_control: Boolean(jobDetails.post_training_control), // 🔥 修正：轉換為布林值
//         training_control_until: jobDetails.training_control_until || '',
//         hire_date: jobDetails.hire_date || '',
//         probation_start_date: jobDetails.probation_start_date || '',
//         probation_end_date: jobDetails.probation_end_date || '',
//         resignation_date: jobDetails.resignation_date || '',
//         clock_free_treatment: Boolean(jobDetails.clock_free_treatment) // 🔥 修正：轉換為布林值
//       });
//     } else {
//       setJobDetailsForm({
//         employment_status: employee.employment_status || '',
//         salary_type: employee.salary_type || '',
//         department: employee.department || '',
//         job_grade: employee.job_grade || '',
//         position: employee.position || '',
//         shift_system: employee.shift_system || '',
//         shift_option: employee.shift_option || '',
//         is_manager: false,
//         supervisor_name: employee.supervisor_name || '',
//         post_training_control: false,
//         training_control_until: '',
//         hire_date: '',
//         probation_start_date: '',
//         probation_end_date: '',
//         resignation_date: '',
//         clock_free_treatment: false
//       });
//     }
//     setEditingJobDetails(false);
//   };

//   // 🔥 修正：暴露這些方法和狀態給父組件 - 加入權限狀態
//   useImperativeHandle(ref, () => ({
//     startEditing,
//     finishEditing,
//     cancelEditing,
//     isEditing: editingJobDetails,
//     hasJobDetails: !!jobDetails,
//     hasEditPermission: hasEditPermission, // 🔥 暴露權限狀態
//     getFormData: () => jobDetailsForm
//   }));

//   if (loadingJobDetails || permissionLoading) {
//     return (
//       <div className="job-related-content">
//         <div className="loading-message">
//           {permissionLoading ? '檢查權限中...' : '載入職務資料中...'}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="job-related-content">
//       {/* 🔥 權限錯誤訊息顯示 */}
//       {permissionError && (
//         <div className="job-permission-error" style={{
//           backgroundColor: '#fff3cd',
//           color: '#856404',
//           padding: '10px',
//           borderRadius: '4px',
//           margin: '10px 0',
//           border: '1px solid #ffeaa7'
//         }}>
//           <strong>權限警告：</strong>{permissionError}
//         </div>
//       )}

//       {/* 🔥 無權限提示 */}
//       {!hasEditPermission && !permissionLoading && (
//         <div className="job-no-permission" style={{
//           backgroundColor: '#f8f9fa',
//           color: '#6c757d',
//           padding: '15px',
//           borderRadius: '4px',
//           margin: '10px 0',
//           border: '1px solid #dee2e6',
//           textAlign: 'center'
//         }}>
//           <strong>提示：</strong>您目前沒有編輯職務相關的權限，僅能查看資料
//         </div>
//       )}

//       {/* 標題區域 */}
//       <div className="job-title-area">
//         <span className="job-title">職務相關</span>
//         <div className="personnel-record-button">
//           <span className="personnel-record-text">人事變更記錄</span>
//         </div>
//       </div>

//       {/* 職務相關內容 */}
//       <div className="job-content">
//         {/* 身分別 */}
//         {renderEditableField(
//           '身分別', 
//           'employment_status', 
//           editingJobDetails ? jobDetailsForm.employment_status : getEmploymentStatusText(jobDetailsForm.employment_status),
//           'select',
//           [
//             { value: 'Full-time', label: '全時' },
//             { value: 'Active', label: '部分工時' }
//           ]
//         )}

//         {/* 薪別 */}
//         {renderEditableField(
//           '薪別', 
//           'salary_type', 
//           editingJobDetails ? jobDetailsForm.salary_type : getSalaryTypeText(jobDetailsForm.salary_type),
//           'select',
//           [
//             { value: 'Monthly', label: '月薪' },
//             { value: 'Hourly', label: '時薪' }
//           ]
//         )}

//         {/* 🔥 修正：班別 - 移除部門相關邏輯 */}
//         <div className="job-info-row">
//           <span className="job-label">班別</span>
//           <div className="shift-type-container">
//             <div className="shift-type-options">
//               {/* 固定班制 */}
//               <div className="shift-type-option">
//                 <input
//                   type="radio"
//                   id="fixed-shift"
//                   name="shift_system"
//                   value="Fixed Shift"
//                   checked={jobDetailsForm.shift_system === 'Fixed Shift'}
//                   onChange={async (e) => {
//                     if (e.target.checked) {
//                       // 🔥 先載入班別選項，然後選擇第一個
//                       if (shiftOptions.length === 0) {
//                         await fetchCompanyShifts(); // 🔥 修正：不傳入參數
//                       }
//                       await handleShiftSystemChange('Fixed Shift');
//                     }
//                   }}
//                   className="shift-type-radio"
//                   disabled={updatingField === 'shift_system' || !hasEditPermission}
//                 />
//                 <label htmlFor="fixed-shift" className="shift-type-label">
//                   固定班制
//                 </label>
//                 {jobDetailsForm.shift_system === 'Fixed Shift' && (
//                   <select
//                     value={jobDetailsForm.shift_option || ''}
//                     onChange={async (e) => {
//                       await handleShiftSystemChange('Fixed Shift', e.target.value);
//                     }}
//                     className="fixed-shift-select"
//                     disabled={updatingField === 'shift_system' || loadingShiftOptions || !hasEditPermission}
//                     style={{
//                       backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                       cursor: !hasEditPermission ? 'not-allowed' : 'pointer',
//                       minWidth: '120px'
//                     }}
//                   >
//                     {loadingShiftOptions ? (
//                       <option value="">載入班別中...</option>
//                     ) : shiftOptions.length === 0 ? (
//                       <option value="">無可用班別</option>
//                     ) : (
//                       <>
//                         {shiftOptions.map(option => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </>
//                     )}
//                   </select>
//                 )}
//               </div>

//               {/* 輪班制 */}
//               <div className="shift-type-option">
//                 <input
//                   type="radio"
//                   id="flexible-shift"
//                   name="shift_system"
//                   value="Flexible working"
//                   checked={jobDetailsForm.shift_system === 'Flexible working'}
//                   onChange={async (e) => {
//                     if (e.target.checked) {
//                       await handleShiftSystemChange('Flexible working');
//                     }
//                   }}
//                   className="shift-type-radio"
//                   disabled={updatingField === 'shift_system' || !hasEditPermission}
//                 />
//                 <label htmlFor="flexible-shift" className="shift-type-label">
//                   輪班制
//                 </label>
//               </div>

//               {/* 排班制 */}
//               <div className="shift-type-option">
//                 <input
//                   type="radio"
//                   id="scheduled-shift"
//                   name="shift_system"
//                   value="Scheduled Shift"
//                   checked={jobDetailsForm.shift_system === 'Scheduled Shift'}
//                   onChange={async (e) => {
//                     if (e.target.checked) {
//                       await handleShiftSystemChange('Scheduled Shift');
//                     }
//                   }}
//                   className="shift-type-radio"
//                   disabled={updatingField === 'shift_system' || !hasEditPermission}
//                 />
//                 <label htmlFor="scheduled-shift" className="shift-type-label">
//                   排班制
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 部門 */}
//         {renderEditableField(
//           '部門', 
//           'department', 
//           jobDetailsForm.department,
//           'select',
//           [
//             { value: '董事長室', label: '董事長室' },
//             { value: '業務部', label: '業務部' },
//             { value: '人資部', label: '人資部' },
//             { value: '財務部', label: '財務部' },
//             { value: '技術部', label: '技術部' },
//             { value: '行銷部', label: '行銷部' }
//           ]
//         )}

//         {/* 職稱 */}
//         {renderEditableField('職稱', 'position', jobDetailsForm.position, 'text')}

//         {/* 🔥 修正：管理職 - 加入權限檢查 */}
//         <div className="job-info-row">
//           <span className="job-label">管理職</span>
//           <ToggleSwitch 
//             isOn={jobDetailsForm.is_manager}
//             onToggle={handleManagerToggle}
//             disabled={updatingField === 'is_manager' || !hasEditPermission}
//           />
//         </div>

//         {/* 🔥 修正：上級主管 - 加入權限檢查 */}
//         <div className="job-info-row">
//           <span className="job-label">上級主管</span>
//           {editingJobDetails ? (
//             <input
//               type="text"
//               value={jobDetailsForm.supervisor_name}
//               onChange={(e) => handleJobDetailsChange('supervisor_name', e.target.value)}
//               className="job-input"
//               placeholder="請輸入上級主管姓名"
//               disabled={!hasEditPermission}
//               style={{
//                 backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                 cursor: !hasEditPermission ? 'not-allowed' : 'text'
//               }}
//             />
//           ) : (
//             <span className="job-value">{jobDetailsForm.supervisor_name || ''}</span>
//           )}
//         </div>

//         {/* 職級 */}
//         {renderEditableField(
//           '職級', 
//           'job_grade', 
//           editingJobDetails ? jobDetailsForm.job_grade : getJobGradeText(jobDetailsForm.job_grade),
//           'select',
//           [
//             { value: 'staff', label: '員工' },
//             { value: 'hr', label: '主管' }
//           ]
//         )}

//         {/* 🔥 修正：受訓後管制 - 加入權限檢查 */}
//         <div className="job-info-row">
//           <span className="job-label">受訓後管制</span>
//           <div className="training-control-container">
//             <ToggleSwitch 
//               isOn={jobDetailsForm.post_training_control}
//               onToggle={handleTrainingControlToggle}
//               disabled={updatingField === 'post_training_control' || !hasEditPermission}
//             />
//             {jobDetailsForm.post_training_control && jobDetailsForm.training_control_until && (
//               <span className="training-until">至 {jobDetailsForm.training_control_until}</span>
//             )}
//           </div>
//         </div>

//         {/* 受訓管制日期 */}
//         {jobDetailsForm.post_training_control && editingJobDetails && !jobDetailsForm.training_control_until && (
//           <div className="job-info-row">
//             <span className="job-label">至</span>
//             <div className="date-input-container">
//               <input
//                 type="text"
//                 value={jobDetailsForm.training_control_until}
//                 onClick={hasEditPermission ? (e) => showDateCalendar('training_control_until', e) : undefined}
//                 readOnly
//                 className="job-input date-input"
//                 placeholder="點擊選擇日期"
//                 disabled={!hasEditPermission}
//                 style={{
//                   backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={hasEditPermission ? (e) => showDateCalendar('training_control_until', e) : undefined}
//                 className="calendar-trigger-btn"
//                 disabled={!hasEditPermission}
//                 style={{
//                   opacity: !hasEditPermission ? 0.5 : 1,
//                   cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 📅
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 年資（自動計算） */}
//         <div className="job-info-row">
//           <span className="job-label">年資（自動計算）</span>
//           <span className="job-value">
//             {jobDetailsForm.hire_date ? calculateYearsOfService(jobDetailsForm.hire_date) : '-年-月1日'}
//           </span>
//         </div>

//         {/* 到職日 */}
//         {renderEditableField('到職日', 'hire_date', jobDetailsForm.hire_date, 'date')}

//         {/* 🔥 修正：試用期 - 加入權限檢查 */}
//         <div className="job-info-row">
//           <span className="job-label">試用期</span>
//           {editingJobDetails ? (
//             <div className="probation-period-container">
//               <div className="date-input-container">
//                 <input
//                   type="text"
//                   value={jobDetailsForm.probation_start_date}
//                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_start_date', e) : undefined}
//                   readOnly
//                   className="job-input date-input"
//                   placeholder="開始日期"
//                   style={{ 
//                     width: '45%',
//                     backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                   }}
//                   disabled={!hasEditPermission}
//                 />
//                 <button
//                   type="button"
//                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_start_date', e) : undefined}
//                   className="calendar-trigger-btn"
//                   disabled={!hasEditPermission}
//                   style={{
//                     opacity: !hasEditPermission ? 0.5 : 1,
//                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   📅
//                 </button>
//               </div>
//               <span>至</span>
//               <div className="date-input-container">
//                 <input
//                   type="text"
//                   value={jobDetailsForm.probation_end_date}
//                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_end_date', e) : undefined}
//                   readOnly
//                   className="job-input date-input"
//                   placeholder="結束日期"
//                   style={{ 
//                     width: '45%',
//                     backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
//                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                   }}
//                   disabled={!hasEditPermission}
//                 />
//                 <button
//                   type="button"
//                   onClick={hasEditPermission ? (e) => showDateCalendar('probation_end_date', e) : undefined}
//                   className="calendar-trigger-btn"
//                   disabled={!hasEditPermission}
//                   style={{
//                     opacity: !hasEditPermission ? 0.5 : 1,
//                     cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   📅
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <span className="job-value">
//               {jobDetailsForm.probation_start_date && jobDetailsForm.probation_end_date ? 
//                 `${jobDetailsForm.probation_start_date} 至 ${jobDetailsForm.probation_end_date}` : 
//                 jobDetailsForm.probation_start_date ? `${jobDetailsForm.probation_start_date} 至 未設定` :
//                 jobDetailsForm.probation_end_date ? `未設定 至 ${jobDetailsForm.probation_end_date}` : ''}
//             </span>
//           )}
//         </div>

//         {/* 離職日 */}
//         {renderEditableField('離職日', 'resignation_date', jobDetailsForm.resignation_date, 'date')}

//         {/* 🔥 修正：免打卡待遇 - 加入權限檢查 */}
//         <div className="job-info-row">
//           <span className="job-label">免打卡待遇</span>
//           <ToggleSwitch 
//             isOn={jobDetailsForm.clock_free_treatment}
//             onToggle={handleClockFreeToggle}
//             disabled={updatingField === 'clock_free_treatment' || !hasEditPermission}
//           />
//         </div>
//       </div>
      
//       {/* 🔥 修正：日曆選擇器 - 只在有權限時顯示 */}
//       {hasEditPermission && Object.entries(showCalendar).map(([fieldName, isVisible]) => 
//         isVisible && (
//           <CalendarSelector
//             key={fieldName}
//             isVisible={isVisible}
//             selectedDate={jobDetailsForm[fieldName] ? new Date(jobDetailsForm[fieldName]) : null}
//             onDateSelect={(date) => handleDateSelect(fieldName, date)}
//             onClose={() => setShowCalendar(prev => ({ ...prev, [fieldName]: false }))}
//             position={calendarPosition}
//           />
//         )
//       )}
//     </div>
//   );
// });

// export default JobRelated;
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../../../config';
import CalendarSelector from '../Calendar_Selector';

const JobRelated = forwardRef(({ 
  employee,
  ToggleSwitch,
  onJobDetailsUpdated
}, ref) => {
  // 將所有職務相關的狀態移到這裡
  const [jobDetails, setJobDetails] = useState(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [editingJobDetails, setEditingJobDetails] = useState(false);
  const [updatingField, setUpdatingField] = useState(null);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingShiftOptions, setLoadingShiftOptions] = useState(false);
  const [showCalendar, setShowCalendar] = useState({
    training_control_until: false,
    probation_start_date: false,
    probation_end_date: false,
    hire_date: false,
    resignation_date: false
  });
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [jobDetailsForm, setJobDetailsForm] = useState({
    employment_status: '',
    salary_type: '',
    department: '',
    job_grade: '',
    position: '',
    shift_system: '',
    shift_option: '',
    is_manager: false,
    supervisor_name: '',
    post_training_control: false,
    training_control_until: '',
    hire_date: '',
    probation_start_date: '',
    probation_end_date: '',
    resignation_date: '',
    clock_free_treatment: false
  });

  // 🔥 新增：權限相關狀態
  const [permissions, setPermissions] = useState(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // 🔥 新增：檢查必要的 cookies 是否存在
  const checkRequiredCookies = () => {
    const companyId = Cookies.get('company_id');
    const employeeId = Cookies.get('employee_id');
    
    if (!companyId) {
      console.error('缺少 company_id cookie，請重新登入');
      return false;
    }
    
    if (!employeeId) {
      console.error('缺少 employee_id cookie，請重新登入');
      return false;
    }
    
    return true;
  };

  // 🔥 修正：檢查當前登入使用者的權限，而不是被查看員工的權限
  const checkCurrentUserPermissions = async () => {
    try {
      const companyId = Cookies.get('company_id');
      const currentUserId = Cookies.get('employee_id'); // 🔥 當前登入使用者的ID
      
      if (!companyId || !currentUserId) {
        return {
          success: false,
          message: '無法獲取公司ID或使用者ID',
          hasEditPermission: false
        };
      }
      
      console.log('🔍 檢查當前使用者職務相關權限:', currentUserId);
      
      const response = await axios.get(
        `${API_BASE_URL}/api/company/employee-permissions/${currentUserId}`, // 🔥 使用當前使用者ID
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

      console.log('🔍 當前使用者職務相關權限檢查 API 回應:', response.data);
      
      if (response.data && response.data.Status === 'Ok') {
        // 🔥 從 raw_data 中讀取權限
        const rawData = response.data.Data?.raw_data;
        const hasPermission = rawData?.employee_data === 1 || rawData?.employee_data === '1';
        
        console.log('🔍 當前使用者職務相關原始權限資料:', rawData);
        console.log('🔍 employee_data 權限值:', rawData?.employee_data);
        console.log('🔍 職務相關最終權限判斷:', hasPermission);
        
        return {
          success: true,
          permissions: rawData,
          hasEditPermission: hasPermission
        };
      } else {
        return {
          success: false,
          message: response.data?.Msg || '權限檢查失敗',
          hasEditPermission: false
        };
      }
    } catch (error) {
      console.error('❌ 職務相關權限檢查 API 錯誤:', error);
      return {
        success: false,
        message: error.message || '權限檢查失敗',
        hasEditPermission: false
      };
    }
  };

  // 🔥 修正：只在組件初始化時檢查一次當前使用者權限，不依賴被查看的員工
  useEffect(() => {
    // 🔥 在組件初始化時檢查 cookies
    if (!checkRequiredCookies()) {
      setPermissionError('登入資訊不完整，請重新登入');
      return;
    }

    const loadCurrentUserPermissions = async () => {
      setPermissionLoading(true);
      setPermissionError('');
      
      try {
        const result = await checkCurrentUserPermissions();
        
        if (result.success) {
          setPermissions(result.permissions);
          setHasEditPermission(result.hasEditPermission);
          console.log('✅ 當前使用者職務相關權限檢查成功:', result.permissions);
          console.log('✅ 職務相關編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
        } else {
          setPermissionError(result.message);
          setHasEditPermission(false);
          console.error('❌ 當前使用者職務相關權限檢查失敗:', result.message);
        }
      } catch (error) {
        setPermissionError('權限檢查發生錯誤');
        setHasEditPermission(false);
        console.error('❌ 當前使用者職務相關權限檢查異常:', error);
      } finally {
        setPermissionLoading(false);
      }
    };

    loadCurrentUserPermissions();
  }, []); // 🔥 移除對 employee?.employee_id 的依賴，只在組件初始化時執行一次

  // 🔥 修正：職級判斷邏輯 - 根據您的 API 回應調整
  const getJobGradeText = (jobGrade) => {
    switch (jobGrade) {
      case 'staff':
        return '員工';
      case 'hr':
        return '主管';
      default:
        return jobGrade || '';
    }
  };

  // 🔥 修正：管理職判斷邏輯 - 根據 job_grade 而不是 is_manager
  const getIsManagerFromJobGrade = (jobGrade) => {
    return jobGrade === 'hr'; // hr 代表主管，滑竿打開
  };

  const getEmploymentStatusText = (status) => {
    switch (status) {
      case 'Full-time':
        return '全時';
      case 'Active':
        return '部分工時';
      default:
        return status || '';
    }
  };

  const getSalaryTypeText = (salaryType) => {
    switch (salaryType) {
      case 'Monthly':
        return '月薪';
      case 'Hourly':
        return '時薪';
      default:
        return salaryType || '';
    }
  };

  const calculateYearsOfService = (hireDate) => {
    if (!hireDate) return '-年-月1日';
    
    const hire = new Date(hireDate);
    const today = new Date(); // 🔥 使用當前日期而不是寫死的日期
    const diffTime = today - hire;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    return `${years}年${months}月1日`;
  };

  // 🔥 新增：設定預設班別選項的函數
  const setDefaultShiftOptions = () => {
    const defaultOptions = [
      { value: '早班', label: '早班' },
      { value: '中班', label: '中班' },
      { value: '晚班', label: '晚班' },
      { value: '大夜班', label: '大夜班' },
      { value: '正常班', label: '正常班' }
    ];
    
    setShiftOptions(defaultOptions);
    console.log('使用預設班別選項:', defaultOptions);
  };

  // 🔥 修正：不傳送 department 參數，查詢公司所有班別
  const fetchCompanyShifts = async () => {
    setLoadingShiftOptions(true);
    try {
      // 🔥 從 cookies 動態獲取公司ID，不寫死
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        console.error('無法獲取公司ID，請重新登入');
        setDefaultShiftOptions();
        return;
      }
      
      console.log('查詢公司排班資訊:', {
        company_id: companyId
      });

      const response = await axios.get(
        `${API_BASE_URL}/api/company/shifts`,
        {
          params: {
            company_id: companyId
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('公司排班資訊 API 回應:', response.data);

      if (response.data.Status === 'Ok' && response.data.Data && Array.isArray(response.data.Data)) {
        if (response.data.Data.length > 0) {
          const options = response.data.Data.map(shift => ({
            value: shift.shift_category || shift.shift_name || shift.name || shift.shift_type,
            label: shift.shift_category || shift.shift_name || shift.name || shift.shift_type
          }));
          
          setShiftOptions(options);
          console.log('✅ 成功載入班別選項:', options);
        } else {
          console.log('該公司沒有設定班別，使用預設選項');
          setDefaultShiftOptions();
        }
      } else {
        console.log('API 回應格式異常或無資料:', response.data);
        setDefaultShiftOptions();
      }
    } catch (error) {
      console.error('查詢公司排班資訊失敗:', error);
      setDefaultShiftOptions();
    } finally {
      setLoadingShiftOptions(false);
    }
  };

// 🔥 修正：確保 employee_id 格式正確
const fetchJobDetails = async () => {
  if (!employee?.employee_id) {
    console.log('沒有員工ID，無法查詢職務詳情');
    return;
  }
  
  setLoadingJobDetails(true);
  try {
    const companyId = Cookies.get('company_id');
    
    if (!companyId) {
      console.error('無法獲取公司ID，請重新登入');
      setLoadingJobDetails(false);
      return;
    }
    
    // 🔥 確保使用正確的 employee_id 格式
    let employeeId = employee.employee_id;
    
    // 🔥 如果是數字，轉換為三位數字串格式
    if (typeof employeeId === 'number') {
      employeeId = employeeId.toString().padStart(3, '0');
    } else if (typeof employeeId === 'string') {
      // 🔥 如果是字串但不是三位數，補零
      if (employeeId.length < 3 && !isNaN(employeeId)) {
        employeeId = employeeId.padStart(3, '0');
      }
    }
    
    console.log('查詢員工職務詳細資料:', {
      company_id: companyId,
      employee_id: employeeId,
      original_employee_id: employee.employee_id
    });

    const response = await axios.get(
      `${API_BASE_URL}/api/employee-job-details/${companyId}/${employeeId}`, // 🔥 使用格式化後的 employeeId
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('職務詳細資料 API 回應:', response.data);

    if (response.data.Status === 'Ok' && response.data.Data) {
      console.log('✅ 成功載入職務詳情:', response.data.Data);
      setJobDetails(response.data.Data);
      
      const data = response.data.Data;
      
      // 🔥 驗證載入的資料是否正確
      console.log('🔍 驗證載入的職務資料:', {
        department: data.department, // 應該是 "資管系"
        position: data.position, // 應該是 "老師的學生"
        supervisor_name: data.supervisor_name, // 應該是 "朱老師"
        is_manager: data.is_manager, // 應該是 0
        post_training_control: data.post_training_control, // 應該是 1
        salary_type: data.salary_type // 應該是 "Hourly"
      });
      
      setJobDetailsForm({
        employment_status: data.employment_status || '',
        salary_type: data.salary_type || '',
        department: data.department || '',
        job_grade: data.job_grade || '',
        position: data.position || '',
        shift_system: data.shift_system || '',
        shift_option: data.shift_option || '',
        // 🔥 直接使用 API 的 is_manager 值
        is_manager: Boolean(data.is_manager),
        supervisor_name: data.supervisor_name || '',
        // 🔥 直接使用 API 的 post_training_control 值
        post_training_control: Boolean(data.post_training_control),
        training_control_until: data.training_control_until || '',
        hire_date: data.hire_date || '',
        probation_start_date: data.probation_start_date || '',
        probation_end_date: data.probation_end_date || '',
        resignation_date: data.resignation_date || '',
        clock_free_treatment: Boolean(data.clock_free_treatment)
      });
      
      console.log('✅ 設定的表單資料:', {
        department: data.department, // 應該顯示 "資管系"
        position: data.position, // 應該顯示 "老師的學生"
        supervisor_name: data.supervisor_name, // 應該顯示 "朱老師"
        is_manager: Boolean(data.is_manager), // 應該是 false
        post_training_control: Boolean(data.post_training_control), // 應該是 true
        salary_type: data.salary_type // 應該顯示 "Hourly"
      });
      
      await fetchCompanyShifts();
    } else {
      console.log('❌ 未找到職務詳細資料:', response.data?.Msg);
      setJobDetails(null);
      
      // 🔥 設定預設值
      setJobDetailsForm({
        employment_status: employee.employment_status || '',
        salary_type: employee.salary_type || '',
        department: employee.department || '',
        job_grade: employee.job_grade || '',
        position: employee.position || '',
        shift_system: employee.shift_system || '',
        shift_option: employee.shift_option || '',
        is_manager: false,
        supervisor_name: employee.supervisor_name || '',
        post_training_control: false,
        training_control_until: '',
        hire_date: '',
        probation_start_date: '',
        probation_end_date: '',
        resignation_date: '',
        clock_free_treatment: false
      });
      
      await fetchCompanyShifts();
    }
  } catch (error) {
    console.error('❌ 查詢職務詳細資料失敗:', error);
    setJobDetails(null);
    
    // 🔥 錯誤時也設定預設值
    setJobDetailsForm({
      employment_status: employee.employment_status || '',
      salary_type: employee.salary_type || '',
      department: employee.department || '',
      job_grade: employee.job_grade || '',
      position: employee.position || '',
      shift_system: employee.shift_system || '',
      shift_option: employee.shift_option || '',
      is_manager: false,
      supervisor_name: employee.supervisor_name || '',
      post_training_control: false,
      training_control_until: '',
      hire_date: '',
      probation_start_date: '',
      probation_end_date: '',
      resignation_date: '',
      clock_free_treatment: false
    });
    
    await fetchCompanyShifts();
  } finally {
    setLoadingJobDetails(false);
  }
};

  // 🔥 修正：cleanFormData 函數 - 處理 TINYINT 布林值
  const cleanFormData = (formData) => {
    const cleaned = { ...formData };
    
    const dateFields = ['hire_date', 'probation_start_date', 'probation_end_date', 'resignation_date', 'training_control_until'];
    dateFields.forEach(field => {
      if (cleaned[field] === '' || cleaned[field] === null || cleaned[field] === undefined) {
        cleaned[field] = null;
      }
    });
    
    // 🔥 修正：將布林值轉換為 TINYINT (0 或 1)
    cleaned.is_manager = cleaned.is_manager ? 1 : 0;
    cleaned.post_training_control = cleaned.post_training_control ? 1 : 0;
    cleaned.clock_free_treatment = cleaned.clock_free_treatment ? 1 : 0;
    
    console.log('清理後的表單資料:', cleaned);
    
    return cleaned;
  };

  // 🔥 修正：處理職務詳情變更
  const handleJobDetailsChange = (field, value) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    setJobDetailsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 🔥 修正：更新單一欄位
  const updateSingleField = async (fieldName, newValue) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    if (!employee?.employee_id) {
      console.log('缺少員工資訊，無法更新');
      return;
    }

    try {
      setUpdatingField(fieldName);
      
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        console.error('無法獲取公司ID，請重新登入');
        return;
      }
      
      const updateData = {
        ...jobDetailsForm,
        [fieldName]: newValue,
        updated_by: 'admin'
      };

      const cleanedData = cleanFormData(updateData);

      console.log(`準備更新 ${fieldName}:`, { [fieldName]: newValue });

      const response = await axios.put(
        `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log(`更新 ${fieldName} API 回應:`, response.data);

      if (response.data.Status === 'Ok') {
        setJobDetails(response.data.Data);
        setJobDetailsForm(prev => ({
          ...prev,
          [fieldName]: newValue
        }));
        
        console.log(`${fieldName} 更新成功`);
        
        if (onJobDetailsUpdated) {
          onJobDetailsUpdated(response.data.Data);
        }
      } else {
        console.error('API 錯誤:', response.data.Msg || '更新失敗');
        setJobDetailsForm(prev => ({
          ...prev,
          [fieldName]: jobDetailsForm[fieldName]
        }));
      }
    } catch (error) {
      console.error(`更新 ${fieldName} 失敗:`, error);
      setJobDetailsForm(prev => ({
        ...prev,
        [fieldName]: jobDetailsForm[fieldName]
      }));
    } finally {
      setUpdatingField(null);
    }
  };

  // 🔥 修正：更新多個欄位
  const updateMultipleFields = async (fieldsToUpdate) => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    if (!employee?.employee_id) {
      console.log('缺少員工資訊，無法更新');
      return;
    }

    try {
      setUpdatingField('shift_system');
      
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        console.error('無法獲取公司ID，請重新登入');
        return;
      }
      
      const updateData = {
        ...jobDetailsForm,
        ...fieldsToUpdate,
        updated_by: 'admin'
      };

      const cleanedData = cleanFormData(updateData);

      console.log('準備同時更新多個欄位:', fieldsToUpdate);

      const response = await axios.put(
        `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('更新多個欄位 API 回應:', response.data);

      if (response.data.Status === 'Ok') {
        setJobDetails(response.data.Data);
        setJobDetailsForm(prev => ({
          ...prev,
          ...fieldsToUpdate
        }));
        
        console.log('多個欄位更新成功');
        
        if (onJobDetailsUpdated) {
          onJobDetailsUpdated(response.data.Data);
        }
      } else {
        console.error('API 錯誤:', response.data.Msg || '更新失敗');
        setJobDetailsForm(prev => ({
          ...prev,
          shift_system: jobDetailsForm.shift_system,
          shift_option: jobDetailsForm.shift_option
        }));
      }
    } catch (error) {
      console.error('更新多個欄位失敗:', error);
      setJobDetailsForm(prev => ({
        ...prev,
        shift_system: jobDetailsForm.shift_system,
        shift_option: jobDetailsForm.shift_option
      }));
    } finally {
      setUpdatingField(null);
    }
  };

  // 🔥 修正：處理管理職切換 - 根據 job_grade 判斷
  const handleManagerToggle = async () => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    // 🔥 根據當前狀態切換 job_grade
    const newJobGrade = jobDetailsForm.is_manager ? 'staff' : 'hr';
    const newIsManager = !jobDetailsForm.is_manager;
    
    setJobDetailsForm(prev => ({
      ...prev,
      is_manager: newIsManager,
      job_grade: newJobGrade
    }));
    
    // 🔥 同時更新 job_grade 和 is_manager
    await updateMultipleFields({
      job_grade: newJobGrade,
      is_manager: newIsManager
    });
  };

  // 🔥 修正：處理受訓管制切換
  const handleTrainingControlToggle = async () => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    const newValue = !jobDetailsForm.post_training_control;
    
    setJobDetailsForm(prev => ({
      ...prev,
      post_training_control: newValue
    }));
    
    await updateSingleField('post_training_control', newValue);
  };

  // 🔥 修正：處理免打卡切換
  const handleClockFreeToggle = async () => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    const newValue = !jobDetailsForm.clock_free_treatment;
    
    setJobDetailsForm(prev => ({
      ...prev,
      clock_free_treatment: newValue
    }));
    
    await updateSingleField('clock_free_treatment', newValue);
  };

  // 🔥 修正：處理班制變更
  const handleShiftSystemChange = async (systemType, shiftOption = '') => {
    if (!hasEditPermission) {
      alert('您沒有權限修改職務相關資料');
      return;
    }

    let newShiftSystem = systemType;
    let newShiftOption = shiftOption;

    if (systemType === 'Fixed Shift') {
      newShiftSystem = 'Fixed Shift';
      
      if (shiftOptions.length === 0 && !loadingShiftOptions) {
        console.log('班別選項為空，重新載入...');
        await fetchCompanyShifts();
      }
      
      if (!shiftOption) {
        setTimeout(() => {
          if (shiftOptions.length > 0) {
            const defaultOption = shiftOptions[0].value;
            setJobDetailsForm(prev => ({
              ...prev,
              shift_system: 'Fixed Shift',
              shift_option: defaultOption
            }));
            
            updateMultipleFields({
              shift_system: 'Fixed Shift',
              shift_option: defaultOption
            });
          }
        }, 500);
        
        return;
      } else {
        newShiftOption = shiftOption;
      }
    } else if (systemType === 'Flexible working') {
      newShiftSystem = 'Flexible working';
      newShiftOption = '';
    } else if (systemType === 'Scheduled Shift') {
      newShiftSystem = 'Scheduled Shift';
      newShiftOption = '';
    }

    setJobDetailsForm(prev => ({
      ...prev,
      shift_system: newShiftSystem,
      shift_option: newShiftOption
    }));

    await updateMultipleFields({
      shift_system: newShiftSystem,
      shift_option: newShiftOption
    });
  };

  const showDateCalendar = (fieldName, event) => {
    const rect = event.target.getBoundingClientRect();
    setCalendarPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    });
    
    setShowCalendar(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [fieldName]: true
    }));
  };

  const handleDateSelect = (fieldName, selectedDate) => {
    let dateString = '';
    if (selectedDate instanceof Date) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      dateString = `${year}-${month}-${day}`;
    } else if (typeof selectedDate === 'string') {
      dateString = selectedDate;
    }
    
    handleJobDetailsChange(fieldName, dateString);
    setShowCalendar(prev => ({ ...prev, [fieldName]: false }));
  };

  // 🔥 修正：渲染可編輯欄位
  const renderEditableField = (label, fieldName, value, type = 'text', options = null) => {
    return (
      <div className="job-info-row">
        <span className="job-label">{label}</span>
        {editingJobDetails ? (
          type === 'select' ? (
            <select
              value={value}
              onChange={(e) => handleJobDetailsChange(fieldName, e.target.value)}
              className="job-select"
              disabled={!hasEditPermission}
              style={{
                backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">請選擇</option>
              {options && options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'date' ? (
            <div className="date-input-container">
              <input
                type="text"
                value={value}
                onClick={hasEditPermission ? (e) => showDateCalendar(fieldName, e) : undefined}
                readOnly
                className="job-input date-input"
                placeholder="點擊選擇日期"
                disabled={!hasEditPermission}
                style={{
                  backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                  cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                }}
              />
              <button
                type="button"
                onClick={hasEditPermission ? (e) => showDateCalendar(fieldName, e) : undefined}
                className="calendar-trigger-btn"
                disabled={!hasEditPermission}
                style={{
                  opacity: !hasEditPermission ? 0.5 : 1,
                  cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                }}
              >
                📅
              </button>
            </div>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => handleJobDetailsChange(fieldName, e.target.value)}
              className="job-input"
              placeholder={`請輸入${label}`}
              disabled={!hasEditPermission}
              style={{
                backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                cursor: !hasEditPermission ? 'not-allowed' : 'text'
              }}
            />
          )
        ) : (
          <span className="job-value">{value || ''}</span>
        )}
      </div>
    );
  };

  // 當員工資料變更時，重新查詢職務詳情
  useEffect(() => {
    if (employee?.employee_id) {
      fetchJobDetails();
    }
  }, [employee?.employee_id]);

  // 🔥 修改：暴露方法給父組件，返回結果對象
  const startEditing = () => setEditingJobDetails(true);
  
  // 🔥 修正：完成編輯
  const finishEditing = async () => {
    if (!hasEditPermission) {
      return { success: false, message: '您沒有權限修改職務相關資料' };
    }

    try {
      const companyId = Cookies.get('company_id');
      
      if (!companyId) {
        return { success: false, message: '無法獲取公司ID，請重新登入' };
      }
      
      const cleanedData = cleanFormData(jobDetailsForm);
      
      const updateData = {
        ...cleanedData,
        updated_by: 'admin'
      };

      console.log('準備保存職務詳細資料:', updateData);

      const response = await axios.put(
        `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('保存職務詳細資料 API 回應:', response.data);

      if (response.data.Status === 'Ok') {
        setJobDetails(response.data.Data);
        setEditingJobDetails(false);
        
        if (onJobDetailsUpdated) {
          onJobDetailsUpdated(response.data.Data);
        }
        
        return { 
          success: true, 
          message: jobDetails ? '職務詳細資料更新成功' : '職務詳細資料建立成功' 
        };
      } else {
        console.error('API 錯誤:', response.data.Msg || '保存失敗');
        return { success: false, message: response.data.Msg || '保存失敗' };
      }
    } catch (error) {
      console.error('保存職務詳細資料失敗:', error);
      return { 
        success: false, 
        message: error.response?.data?.Msg || '網路錯誤，請稍後再試' 
      };
    }
  };
  
  const cancelEditing = () => {
    if (jobDetails) {
      setJobDetailsForm({
        employment_status: jobDetails.employment_status || '',
        salary_type: jobDetails.salary_type || '',
        department: jobDetails.department || '',
        job_grade: jobDetails.job_grade || '',
        position: jobDetails.position || '',
        shift_system: jobDetails.shift_system || '',
        shift_option: jobDetails.shift_option || '',
        is_manager: getIsManagerFromJobGrade(jobDetails.job_grade), // 🔥 修正：根據 job_grade 判斷
        supervisor_name: jobDetails.supervisor_name || '',
        post_training_control: Boolean(jobDetails.post_training_control),
        training_control_until: jobDetails.training_control_until || '',
        hire_date: jobDetails.hire_date || '',
        probation_start_date: jobDetails.probation_start_date || '',
        probation_end_date: jobDetails.probation_end_date || '',
        resignation_date: jobDetails.resignation_date || '',
        clock_free_treatment: Boolean(jobDetails.clock_free_treatment)
      });
    } else {
      setJobDetailsForm({
        employment_status: employee.employment_status || '',
        salary_type: employee.salary_type || '',
        department: employee.department || '',
        job_grade: employee.job_grade || '',
        position: employee.position || '',
        shift_system: employee.shift_system || '',
        shift_option: employee.shift_option || '',
        is_manager: false,
        supervisor_name: employee.supervisor_name || '',
        post_training_control: false,
        training_control_until: '',
        hire_date: '',
        probation_start_date: '',
        probation_end_date: '',
        resignation_date: '',
        clock_free_treatment: false
      });
    }
    setEditingJobDetails(false);
  };

  // 🔥 修正：暴露這些方法和狀態給父組件
  useImperativeHandle(ref, () => ({
    startEditing,
    finishEditing,
    cancelEditing,
    isEditing: editingJobDetails,
    hasJobDetails: !!jobDetails,
    hasEditPermission: hasEditPermission,
    getFormData: () => jobDetailsForm
  }));

  if (loadingJobDetails || permissionLoading) {
    return (
      <div className="job-related-content">
        <div className="loading-message">
          {permissionLoading ? '檢查權限中...' : '載入職務資料中...'}
        </div>
      </div>
    );
  }

  return (
    <div className="job-related-content">
      {/* 🔥 權限錯誤訊息顯示 */}
      {permissionError && (
        <div className="job-permission-error" style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0',
          border: '1px solid #ffeaa7'
        }}>
          <strong>權限警告：</strong>{permissionError}
        </div>
      )}

      {/* 🔥 無權限提示 */}
      {!hasEditPermission && !permissionLoading && (
        <div className="job-no-permission" style={{
          backgroundColor: '#f8f9fa',
          color: '#6c757d',
          padding: '15px',
          borderRadius: '4px',
          margin: '10px 0',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <strong>提示：</strong>您目前沒有編輯職務相關的權限，僅能查看資料
        </div>
      )}

      {/* 標題區域 */}
      <div className="job-title-area">
        <span className="job-title">職務相關</span>
        <div className="personnel-record-button">
          <span className="personnel-record-text">人事變更記錄</span>
        </div>
      </div>

      {/* 職務相關內容 */}
      <div className="job-content">
        {/* 身分別 */}
        {renderEditableField(
          '身分別', 
          'employment_status', 
          editingJobDetails ? jobDetailsForm.employment_status : getEmploymentStatusText(jobDetailsForm.employment_status),
          'select',
          [
            { value: 'Full-time', label: '全時' },
            { value: 'Active', label: '部分工時' }
          ]
        )}

        {/* 薪別 */}
        {renderEditableField(
          '薪別', 
          'salary_type', 
          editingJobDetails ? jobDetailsForm.salary_type : getSalaryTypeText(jobDetailsForm.salary_type),
          'select',
          [
            { value: 'Monthly', label: '月薪' },
            { value: 'Hourly', label: '時薪' }
          ]
        )}

        {/* 🔥 修正：班別 */}
        <div className="job-info-row">
          <span className="job-label">班別</span>
          <div className="shift-type-container">
            <div className="shift-type-options">
              {/* 固定班制 */}
              <div className="shift-type-option">
                <input
                  type="radio"
                  id="fixed-shift"
                  name="shift_system"
                  value="Fixed Shift"
                  checked={jobDetailsForm.shift_system === 'Fixed Shift'}
                  onChange={async (e) => {
                    if (e.target.checked) {
                      if (shiftOptions.length === 0) {
                        await fetchCompanyShifts();
                      }
                      await handleShiftSystemChange('Fixed Shift');
                    }
                  }}
                  className="shift-type-radio"
                  disabled={updatingField === 'shift_system' || !hasEditPermission}
                />
                <label htmlFor="fixed-shift" className="shift-type-label">
                  固定班制
                </label>
                {jobDetailsForm.shift_system === 'Fixed Shift' && (
                  <select
                    value={jobDetailsForm.shift_option || ''}
                    onChange={async (e) => {
                      await handleShiftSystemChange('Fixed Shift', e.target.value);
                    }}
                    className="fixed-shift-select"
                    disabled={updatingField === 'shift_system' || loadingShiftOptions || !hasEditPermission}
                    style={{
                      backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                      cursor: !hasEditPermission ? 'not-allowed' : 'pointer',
                      minWidth: '120px'
                    }}
                  >
                    {loadingShiftOptions ? (
                      <option value="">載入班別中...</option>
                    ) : shiftOptions.length === 0 ? (
                      <option value="">無可用班別</option>
                    ) : (
                      <>
                        {shiftOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                )}
              </div>

              {/* 輪班制 */}
              <div className="shift-type-option">
                <input
                  type="radio"
                  id="flexible-shift"
                  name="shift_system"
                  value="Flexible working"
                  checked={jobDetailsForm.shift_system === 'Flexible working'}
                  onChange={async (e) => {
                    if (e.target.checked) {
                      await handleShiftSystemChange('Flexible working');
                    }
                  }}
                  className="shift-type-radio"
                  disabled={updatingField === 'shift_system' || !hasEditPermission}
                />
                <label htmlFor="flexible-shift" className="shift-type-label">
                  輪班制
                </label>
              </div>

              {/* 排班制 */}
              <div className="shift-type-option">
                <input
                  type="radio"
                  id="scheduled-shift"
                  name="shift_system"
                  value="Scheduled Shift"
                  checked={jobDetailsForm.shift_system === 'Scheduled Shift'}
                  onChange={async (e) => {
                    if (e.target.checked) {
                      await handleShiftSystemChange('Scheduled Shift');
                    }
                  }}
                  className="shift-type-radio"
                  disabled={updatingField === 'shift_system' || !hasEditPermission}
                />
                <label htmlFor="scheduled-shift" className="shift-type-label">
                  排班制
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 修正：部門 - 直接顯示 API 回傳的部門名稱 */}
        {renderEditableField('部門', 'department', jobDetailsForm.department, 'text')}

        {/* 🔥 修正：職稱 - 直接顯示 API 回傳的職稱 */}
        {renderEditableField('職稱', 'position', jobDetailsForm.position, 'text')}

        {/* 🔥 修正：管理職 - 根據 job_grade 判斷 */}
        <div className="job-info-row">
          <span className="job-label">管理職</span>
          <ToggleSwitch 
            isOn={jobDetailsForm.is_manager}
            onToggle={handleManagerToggle}
            disabled={updatingField === 'is_manager' || !hasEditPermission}
          />
        </div>

        {/* 🔥 修正：上級主管 - 直接顯示 API 回傳的主管姓名 */}
        <div className="job-info-row">
          <span className="job-label">上級主管</span>
          {editingJobDetails ? (
            <input
              type="text"
              value={jobDetailsForm.supervisor_name}
              onChange={(e) => handleJobDetailsChange('supervisor_name', e.target.value)}
              className="job-input"
              placeholder="請輸入上級主管姓名"
              disabled={!hasEditPermission}
              style={{
                backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                cursor: !hasEditPermission ? 'not-allowed' : 'text'
              }}
            />
          ) : (
            <span className="job-value">{jobDetailsForm.supervisor_name || ''}</span>
          )}
        </div>

        {/* 職級 */}
        {renderEditableField(
          '職級', 
          'job_grade', 
          editingJobDetails ? jobDetailsForm.job_grade : getJobGradeText(jobDetailsForm.job_grade),
          'select',
          [
            { value: 'staff', label: '員工' },
            { value: 'hr', label: '主管' }
          ]
        )}

        {/* 🔥 修正：受訓後管制 - 根據 API 回傳的布林值 */}
        <div className="job-info-row">
          <span className="job-label">受訓後管制</span>
          <div className="training-control-container">
            <ToggleSwitch 
              isOn={jobDetailsForm.post_training_control}
              onToggle={handleTrainingControlToggle}
              disabled={updatingField === 'post_training_control' || !hasEditPermission}
            />
            {jobDetailsForm.post_training_control && jobDetailsForm.training_control_until && (
              <span className="training-until">至 {jobDetailsForm.training_control_until}</span>
            )}
          </div>
        </div>

        {/* 受訓管制日期 */}
        {jobDetailsForm.post_training_control && editingJobDetails && !jobDetailsForm.training_control_until && (
          <div className="job-info-row">
            <span className="job-label">至</span>
            <div className="date-input-container">
              <input
                type="text"
                value={jobDetailsForm.training_control_until}
                onClick={hasEditPermission ? (e) => showDateCalendar('training_control_until', e) : undefined}
                readOnly
                className="job-input date-input"
                placeholder="點擊選擇日期"
                disabled={!hasEditPermission}
                style={{
                  backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                  cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                }}
              />
              <button
                type="button"
                onClick={hasEditPermission ? (e) => showDateCalendar('training_control_until', e) : undefined}
                className="calendar-trigger-btn"
                disabled={!hasEditPermission}
                style={{
                  opacity: !hasEditPermission ? 0.5 : 1,
                  cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                }}
              >
                📅
              </button>
            </div>
          </div>
        )}

        {/* 年資（自動計算） */}
        <div className="job-info-row">
          <span className="job-label">年資（自動計算）</span>
          <span className="job-value">
            {jobDetailsForm.hire_date ? calculateYearsOfService(jobDetailsForm.hire_date) : '-年-月1日'}
          </span>
        </div>

        {/* 🔥 修正：到職日 - 使用 API 回傳的日期 */}
        {renderEditableField('到職日', 'hire_date', jobDetailsForm.hire_date, 'date')}

        {/* 🔥 修正：試用期 - 使用 API 回傳的日期 */}
        <div className="job-info-row">
          <span className="job-label">試用期</span>
          {editingJobDetails ? (
            <div className="probation-period-container">
              <div className="date-input-container">
                <input
                  type="text"
                  value={jobDetailsForm.probation_start_date}
                  onClick={hasEditPermission ? (e) => showDateCalendar('probation_start_date', e) : undefined}
                  readOnly
                  className="job-input date-input"
                  placeholder="開始日期"
                  style={{ 
                    width: '45%',
                    backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                    cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                  }}
                  disabled={!hasEditPermission}
                />
                <button
                  type="button"
                  onClick={hasEditPermission ? (e) => showDateCalendar('probation_start_date', e) : undefined}
                  className="calendar-trigger-btn"
                  disabled={!hasEditPermission}
                  style={{
                    opacity: !hasEditPermission ? 0.5 : 1,
                    cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                  }}
                >
                  📅
                </button>
              </div>
              <span>至</span>
              <div className="date-input-container">
                <input
                  type="text"
                  value={jobDetailsForm.probation_end_date}
                  onClick={hasEditPermission ? (e) => showDateCalendar('probation_end_date', e) : undefined}
                  readOnly
                  className="job-input date-input"
                  placeholder="結束日期"
                  style={{ 
                    width: '45%',
                    backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                    cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                  }}
                  disabled={!hasEditPermission}
                />
                <button
                  type="button"
                  onClick={hasEditPermission ? (e) => showDateCalendar('probation_end_date', e) : undefined}
                  className="calendar-trigger-btn"
                  disabled={!hasEditPermission}
                  style={{
                    opacity: !hasEditPermission ? 0.5 : 1,
                    cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                  }}
                >
                  📅
                </button>
              </div>
            </div>
          ) : (
            <span className="job-value">
              {jobDetailsForm.probation_start_date && jobDetailsForm.probation_end_date ? 
                `${jobDetailsForm.probation_start_date} 至 ${jobDetailsForm.probation_end_date}` : 
                jobDetailsForm.probation_start_date ? `${jobDetailsForm.probation_start_date} 至 未設定` :
                jobDetailsForm.probation_end_date ? `未設定 至 ${jobDetailsForm.probation_end_date}` : ''}
            </span>
          )}
        </div>

        {/* 🔥 修正：離職日 - 使用 API 回傳的日期 */}
        {renderEditableField('離職日', 'resignation_date', jobDetailsForm.resignation_date, 'date')}

        {/* 🔥 修正：免打卡待遇 */}
        <div className="job-info-row">
          <span className="job-label">免打卡待遇</span>
          <ToggleSwitch 
            isOn={jobDetailsForm.clock_free_treatment}
            onToggle={handleClockFreeToggle}
            disabled={updatingField === 'clock_free_treatment' || !hasEditPermission}
          />
        </div>
      </div>
      
      {/* 🔥 修正：日曆選擇器 */}
      {hasEditPermission && Object.entries(showCalendar).map(([fieldName, isVisible]) => 
        isVisible && (
          <CalendarSelector
            key={fieldName}
            isVisible={isVisible}
            selectedDate={jobDetailsForm[fieldName] ? new Date(jobDetailsForm[fieldName]) : null}
            onDateSelect={(date) => handleDateSelect(fieldName, date)}
            onClose={() => setShowCalendar(prev => ({ ...prev, [fieldName]: false }))}
            position={calendarPosition}
          />
        )
      )}
    </div>
  );
});

export default JobRelated;
