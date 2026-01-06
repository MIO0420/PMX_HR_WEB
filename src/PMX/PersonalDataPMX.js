// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { useEmployee } from '../contexts/EmployeeContext';
// // // import { useFlutterIntegration } from './Hook/hooks'; // Flutter 整合
// // // import { useLanguage } from './Hook/useLanguage'; // 語言 hook
// // // import LanguageSwitch from './components/LanguageSwitch'; // 語言切換組件
// // // import './PMX_CSS/PersonalDataPMX.css';
// // // import Cookies from 'js-cookie';

// // // // 🔥 新增：檢查 PMX 登入狀態的函數
// // // const checkPMXLoginStatus = async () => {
// // //   try {
// // //     console.log('正在檢查 PMX 登入狀態...');
    
// // //     const response = await fetch('https://rabbit.54ucl.com:3004/pmx/employee/check-session', {
// // //       method: 'GET',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Accept': 'application/json',
// // //       },
// // //       credentials: 'include', // 🔥 發送 HTTP-only cookies
// // //     });
    
// // //     const result = await response.json();
// // //     console.log('登入狀態檢查結果:', result);
    
// // //     return result;
// // //   } catch (error) {
// // //     console.error('檢查登入狀態失敗:', error);
// // //     return {
// // //       Status: "Failed",
// // //       Msg: "檢查登入狀態失敗",
// // //       Data: { is_authenticated: false }
// // //     };
// // //   }
// // // };

// // // // 🔥 修正：查詢 PMX 員工資料的函數 - 加上 credentials
// // // const fetchPMXEmployeeInfoByLogin = async (companyId, employeeId) => {
// // //   try {
// // //     console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
    
// // //     // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
// // //     const response = await fetch(`https://rabbit.54ucl.com:3004/pmx/employee/${employeeId}`, {
// // //       method: 'GET',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Accept': 'application/json',
// // //       },
// // //       credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
// // //     });
    
// // //     if (!response.ok) {
// // //       // 🔥 提供更詳細的錯誤資訊
// // //       const errorText = await response.text();
// // //       console.error(`API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
// // //       throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
// // //     }
    
// // //     const result = await response.json();
// // //     console.log('PMX API 完整回應:', result);
    
// // //     if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
// // //       // 🔥 處理多筆資料：提取基本資料和訓練記錄
// // //       const allRecords = Array.isArray(result.Data) ? result.Data : [result.Data];
      
// // //       // 🔥 從第一筆記錄中提取基本員工資料
// // //       const basicEmployeeData = allRecords[0];
      
// // //       // 🔥 提取所有訓練記錄
// // //       const trainingRecords = allRecords.map((record, index) => ({
// // //         id: index + 1,
// // //         item_number: record.item_number,
// // //         course_name: record.course_name,
// // //         completion_date: record.completion_date,
// // //         retraining_date: record.retraining_date,
// // //         scheduled_retraining_date: record.scheduled_retraining_date,
// // //         training_record: record.training_record
// // //       }));
      
// // //       console.log('基本員工資料:', basicEmployeeData);
// // //       console.log('訓練記錄:', trainingRecords);
      
// // //       // 🔥 返回結構化的資料
// // //       return {
// // //         Status: "Ok",
// // //         Data: [{
// // //           ...basicEmployeeData,
// // //           training_records: trainingRecords // 🔥 添加訓練記錄
// // //         }]
// // //       };
// // //     }
    
// // //     return result;
// // //   } catch (error) {
// // //     console.error('查詢 PMX 員工資料失敗:', error);
// // //     throw error;
// // //   }
// // // };

// // // // 🔥 修正：更新員工資料的函數 - 加上 credentials
// // // const updatePMXEmployeeInfo = async (id, updateData) => {
// // //   try {
// // //     console.log(`正在更新 PMX 員工資料 - ID: ${id}`, updateData);
    
// // //     // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
// // //     const response = await fetch(`https://rabbit.54ucl.com:3004/api/pmx/employee/update/${id}`, {
// // //       method: 'PUT',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Accept': 'application/json',
// // //       },
// // //       credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
// // //       body: JSON.stringify(updateData)
// // //     });
    
// // //     if (!response.ok) {
// // //       // 🔥 提供更詳細的錯誤資訊
// // //       const errorText = await response.text();
// // //       console.error(`更新 API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
// // //       throw new Error(`更新請求失敗: ${response.status} - ${errorText}`);
// // //     }
    
// // //     const result = await response.json();
// // //     console.log('更新 PMX API 回應:', result);
// // //     return result;
// // //   } catch (error) {
// // //     console.error('更新 PMX 員工資料失敗:', error);
// // //     throw error;
// // //   }
// // // };

// // // function PersonalData() {
// // //   // 添加語言 hook
// // //   const { t } = useLanguage();
  
// // //   // Flutter 整合 hook
// // //   const { isFlutterEnvironment } = useFlutterIntegration('home');
  
// // //   // 🔥 新增：訓練記錄相關狀態
// // //   const [trainingRecords, setTrainingRecords] = useState([]);
// // //   const [showTrainingRecords, setShowTrainingRecords] = useState(false);
  
// // //   // 原有狀態保持不變...
// // //   const [currentTime, setCurrentTime] = useState('');
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [showDatePicker, setShowDatePicker] = useState(false);
// // //   const [showGenderSelector, setShowGenderSelector] = useState(false);
// // //   const [showYearSelector, setShowYearSelector] = useState(false);
// // //   const [showPensionSelector, setShowPensionSelector] = useState(false);
// // //   const [errors, setErrors] = useState({});
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
  
// // //   // 新增狀態來儲存從 cookies 獲取的資料
// // //   const [companyId, setCompanyId] = useState('');
// // //   const [employeeId, setEmployeeId] = useState('');
  
// // //   // 新增狀態來儲存員工資料的 ID（用於更新）
// // //   const [employeeDataId, setEmployeeDataId] = useState(null);
  
// // //   const datePickerRef = useRef(null);
// // //   const genderSelectorRef = useRef(null);
// // //   const yearSelectorRef = useRef(null);
// // //   const pensionSelectorRef = useRef(null);
// // //   const navigate = useNavigate();

// // //   // 其他狀態保持不變...
// // //   const [isEditingHealthInsurance, setIsEditingHealthInsurance] = useState(false);
// // //   const [selectedDependents, setSelectedDependents] = useState([]);
// // //   const [dependents, setDependents] = useState([
// // //     {
// // //       id: 1,
// // //       name: '朱大豬',
// // //       birthDate: '民062年12月26日',
// // //       idNumber: 'A123456789',
// // //       relation: '3子女'
// // //     },
// // //     {
// // //       id: 2,
// // //       name: '朱二豬',
// // //       birthDate: '民062年12月26日',
// // //       idNumber: 'A123456789',
// // //       relation: '3子女'
// // //     },
// // //     {
// // //       id: 3,
// // //       name: '朱三豬',
// // //       birthDate: '民062年12月26日',
// // //       idNumber: 'A123456789',
// // //       relation: '3子女'
// // //     }
// // //   ]);

// // //   // 從 context 取得公司和員工ID（作為備用）
// // //   const { companyId: contextCompanyId, employeeId: contextEmployeeId } = useEmployee();

// // //   // 退休金提撥比率選項
// // //   const pensionOptions = [
// // //     { value: '6%', label: '6%' },
// // //     { value: '5%', label: '5%' },
// // //     { value: '4%', label: '4%' },
// // //     { value: '3%', label: '3%' },
// // //     { value: '2%', label: '2%' },
// // //     { value: '1%', label: '1%' },
// // //     { value: '0%', label: '0%' }
// // //   ];

// // //   // 性別選項 - 使用翻譯
// // //   const genderOptions = [
// // //     { value: '男', label: t('personalData.genderOptions.male') || '男' },
// // //     { value: '女', label: t('personalData.genderOptions.female') || '女' },
// // //     { value: '非二元性別', label: t('personalData.genderOptions.nonBinary') || '非二元性別' }
// // //   ];

// // //   // 🔥 修改：個人資料狀態 - 包含所有欄位
// // //   const [formData, setFormData] = useState({
// // //     // 基本個人資料
// // //     employeeId: '',
// // //     name: '',
// // //     gender: '',
// // //     passportEnglishName: '',
// // //     nationality: '',
// // //     idNumber: '',
// // //     residencePermitNumber: '',
// // //     birthDate: '',
// // //     year113: '',
// // //     year114: '',
// // //     address: '',
// // //     homePhone: '',
// // //     mobilePhone: '',
// // //     companyPhone: '',
// // //     hireDate: '',
// // //     yearsOfService113: '',
// // //     annualLeaveHours: '',
// // //     annualLeaveExpiry: '',
// // //     resignationDate: '',
// // //     bloodType: '',
// // //     highestEducation: '',
// // //     schoolDepartment: '',
// // //     personalEmail: '',
// // //     companyEmail: '',
// // //     department: '',
// // //     position: '',
// // //     professionalCertificates: '',
    
// // //     // 保留原有欄位以保持相容性
// // //     photo: null,
// // //     residenceAddress: '',
// // //     mailingAddress: '',
// // //     mobile: '',
// // //     phone: '',
// // //     shiftSystem: '',
// // //     identity: '',
// // //     salaryType: '',
// // //     jobTitle: '',
// // //     jobLevel: '',
// // //     trainingControlDate: '',
// // //     pensionContribution: '',
// // //     dependentsInsured: '',
// // //     account: '',
// // //     password: '',
// // //     attachments: []
// // //   });

// // //   // 暫存修改前的資料，用於取消操作
// // //   const [originalData, setOriginalData] = useState({});
  
// // //   // 當前是否正在編輯退休金
// // //   const [isEditingPension, setIsEditingPension] = useState(false);

// // //   // 🔥 新增：欄位中文對應表
// // //   const fieldLabels = {
// // //     employeeId: '職編',
// // //     name: '中文名字',
// // //     gender: '性別',
// // //     passportEnglishName: '護照英文全名',
// // //     nationality: '國籍（具有雙重國籍者請分別列出）',
// // //     idNumber: '身分證字號',
// // //     residencePermitNumber: '居留證號碼',
// // //     birthDate: '西元出生日期',
// // //     year113: '113',
// // //     year114: '114',
// // //     address: '地址',
// // //     homePhone: '聯絡方式：市話',
// // //     mobilePhone: '聯絡方式：手機',
// // //     companyPhone: '公司手機',
// // //     hireDate: '到職日',
// // //     yearsOfService113: '113年資',
// // //     annualLeaveHours: '特休時數',
// // //     annualLeaveExpiry: '特休期限',
// // //     resignationDate: '離職日',
// // //     bloodType: '血型',
// // //     highestEducation: '最高學歷',
// // //     schoolDepartment: '就讀學校/科系',
// // //     personalEmail: '個人電子郵件',
// // //     companyEmail: '公司配發電子郵件',
// // //     department: '部門',
// // //     position: '職稱',
// // //     professionalCertificates: '專業證照（若有相關資料，請分別列出並備妥電子檔）'
// // //   };

// // //   // 🔥 新增：訓練記錄欄位中文對應
// // //   const trainingFieldLabels = {
// // //     item_number: '項次',
// // //     course_name: '課程名稱',
// // //     completion_date: '結訓日期',
// // //     retraining_date: '回訓日期',
// // //     scheduled_retraining_date: '應回訓日期',
// // //     training_record: '受訓紀錄'
// // //   };

// // //   // 🔥 新增：創建一個函數來渲染有內容的欄位
// // // // 🔥 修改：創建一個函數來渲染有內容的欄位，添加特殊樣式類
// // // const renderFieldIfExists = (label, value, key = null) => {
// // //   // 如果值存在且不為空字串，才顯示該欄位
// // //   if (value && value.toString().trim() !== '') {
// // //     // 判斷是否為長文字內容
// // //     const isLongText = value.toString().length > 20;
// // //     const isAddress = label.includes('地址');
// // //     const isEmail = label.includes('電子郵件') || label.includes('email');
// // //     const isCertificates = label.includes('證照');
    
// // //     // 為特殊內容添加CSS類
// // //     let valueClass = 'personal-value';
// // //     if (isLongText) valueClass += ' long-text';
// // //     if (isAddress) valueClass += ' address';
// // //     if (isEmail) valueClass += ' email';
// // //     if (isCertificates) valueClass += ' certificates';
    
// // //     return (
// // //       <div key={key} className="personal-row">
// // //         <div className="personal-label">{label}</div>
// // //         <div className={valueClass}>{value}</div>
// // //       </div>
// // //     );
// // //   }
// // //   return null;
// // // };


// // //   // 輔助函數保持不變...
// // //   const mapGender = (gender) => {
// // //     if (!gender) return '';
// // //     switch (gender.toLowerCase()) {
// // //       case 'male':
// // //       case '男':
// // //         return '男';
// // //       case 'female':
// // //       case '女':
// // //         return '女';
// // //       default:
// // //         return gender;
// // //     }
// // //   };

// // //   const mapPensionContribution = (contribution) => {
// // //     if (!contribution) return '';
// // //     const percentage = parseFloat(contribution);
// // //     if (isNaN(percentage)) return '';
// // //     return `${Math.round(percentage * 100)}%`;
// // //   };

// // //   const mapDependentsInsured = (dependents) => {
// // //     if (!dependents) return '';
// // //     return `${dependents}人`;
// // //   };

// // //   // 從 cookies 獲取登入資料
// // //   const getLoginDataFromCookies = () => {
// // //     try {
// // //       const cookieCompanyId = Cookies.get('company_id') || 
// // //                              Cookies.get('companyId') || 
// // //                              Cookies.get('Company_ID');
      
// // //       const cookieEmployeeId = Cookies.get('employee_id') || 
// // //                               Cookies.get('employeeId') || 
// // //                               Cookies.get('Employee_ID');

// // //       console.log('從 cookies 獲取的資料:', {
// // //         company_id: cookieCompanyId,
// // //         employee_id: cookieEmployeeId
// // //       });

// // //       if (!cookieCompanyId || !cookieEmployeeId) {
// // //         const sessionCompanyId = sessionStorage.getItem('cookie_company_id') || 
// // //                                  localStorage.getItem('temp_cookie_company_id');
// // //         const sessionEmployeeId = sessionStorage.getItem('cookie_employee_id') || 
// // //                                   localStorage.getItem('temp_cookie_employee_id');
        
// // //         console.log('從 storage 獲取的資料:', {
// // //           company_id: sessionCompanyId,
// // //           employee_id: sessionEmployeeId
// // //         });

// // //         return {
// // //           company_id: cookieCompanyId || sessionCompanyId,
// // //           employee_id: cookieEmployeeId || sessionEmployeeId
// // //         };
// // //       }

// // //       return {
// // //         company_id: cookieCompanyId,
// // //         employee_id: cookieEmployeeId
// // //       };
// // //     } catch (error) {
// // //       console.error('從 cookies 獲取資料失敗:', error);
// // //       return {
// // //         company_id: null,
// // //         employee_id: null
// // //       };
// // //     }
// // //   };

// // //   // 初始化時從 cookies 獲取資料
// // //   useEffect(() => {
// // //     console.log('初始化 PersonalData 組件');
    
// // //     const cookieData = getLoginDataFromCookies();
    
// // //     const finalCompanyId = cookieData.company_id || contextCompanyId || '';
// // //     const finalEmployeeId = cookieData.employee_id || contextEmployeeId || '';
    
// // //     console.log('最終使用的資料:', {
// // //       company_id: finalCompanyId,
// // //       employee_id: finalEmployeeId,
// // //       source: cookieData.company_id ? 'cookies' : (contextCompanyId ? 'context' : 'none')
// // //     });

// // //     setCompanyId(finalCompanyId);
// // //     setEmployeeId(finalEmployeeId);
// // //   }, [contextCompanyId, contextEmployeeId]);

// // //   // 點擊外部關閉選擇器
// // //   useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
// // //         setShowDatePicker(false);
// // //         setShowYearSelector(false);
// // //       }
// // //       if (genderSelectorRef.current && !genderSelectorRef.current.contains(event.target)) {
// // //         setShowGenderSelector(false);
// // //       }
// // //       if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target)) {
// // //         setShowYearSelector(false);
// // //       }
// // //       if (pensionSelectorRef.current && !pensionSelectorRef.current.contains(event.target)) {
// // //         setShowPensionSelector(false);
// // //       }
// // //     }
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => {
// // //       document.removeEventListener("mousedown", handleClickOutside);
// // //     };
// // //   }, []);

// // //   // 右上角時間
// // //   useEffect(() => {
// // //     const updateClock = () => {
// // //       const now = new Date();
// // //       const hours = String(now.getHours()).padStart(2, '0');
// // //       const minutes = String(now.getMinutes()).padStart(2, '0');
// // //       setCurrentTime(`${hours}:${minutes}`);
// // //     };
// // //     updateClock();
// // //     const timer = setInterval(updateClock, 1000);
// // //     return () => clearInterval(timer);
// // //   }, []);

// // //   // 🔥 修改：使用新的 PMX API 函數獲取完整員工資料，並加入登入狀態檢查
// // //   useEffect(() => {
// // //     const fetchEmployeeData = async () => {
// // //       if (!employeeId) {
// // //         console.log('缺少員工ID:', { employeeId });
// // //         setError(t('personalData.pleaseLogin') || '請先登入以查看個人資料');
// // //         return;
// // //       }

// // //       setLoading(true);
// // //       setError('');

// // //       try {
// // //         console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
        
// // //         // 🔥 首先檢查登入狀態
// // //         const loginStatus = await checkPMXLoginStatus();
        
// // //         if (loginStatus.Status !== "Ok" || !loginStatus.Data?.is_authenticated) {
// // //           console.error('登入狀態無效:', loginStatus);
// // //           setError('登入狀態已過期，請重新登入');
// // //           // 🔥 可以選擇重定向到登入頁面
// // //           setTimeout(() => {
// // //             navigate('/apploginpmx');
// // //           }, 2000);
// // //           return;
// // //         }
        
// // //         console.log('登入狀態有效，繼續查詢員工資料...');
        
// // //         // 🔥 使用修改後的 fetchPMXEmployeeInfo 函數
// // //         const result = await fetchPMXEmployeeInfoByLogin(companyId, employeeId);
// // //         console.log('PMX API 回傳結果:', result);
        
// // //         if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
// // //           // 取第一筆資料（基本員工資料）
// // //           const employeeData = result.Data[0];
// // //           console.log('PMX API 回傳的員工資料:', employeeData);
          
// // //           // 儲存資料 ID 用於後續更新
// // //           setEmployeeDataId(employeeData.id);
          
// // //           // 🔥 設置訓練記錄
// // //           if (employeeData.training_records && employeeData.training_records.length > 0) {
// // //             setTrainingRecords(employeeData.training_records);
// // //             console.log('設置訓練記錄:', employeeData.training_records);
// // //           } else {
// // //             setTrainingRecords([]);
// // //             console.log('無訓練記錄');
// // //           }
          
// // //           // 🔥 處理 department_position 分割
// // //           const departmentPosition = employeeData.department_position || '';
// // //           let departmentName = '';
// // //           let positionName = '';
          
// // //           if (departmentPosition.includes('/')) {
// // //             const parts = departmentPosition.split('/');
// // //             departmentName = parts[0].trim();
// // //             positionName = parts[1].trim();
// // //           } else {
// // //             departmentName = departmentPosition;
// // //             positionName = departmentPosition;
// // //           }
          
// // //           // 🔥 將 PMX API 回傳的所有資料對應到表單欄位
// // //           const mappedData = {
// // //             // 基本個人資料
// // //             employeeId: employeeData.employee_id || '',
// // //             name: employeeData.name || '',
// // //             gender: mapGender(employeeData.gender),
// // //             passportEnglishName: employeeData.passport_english_name || '',
// // //             nationality: employeeData.nationality || '',
// // //             idNumber: employeeData.id_card_number || '',
// // //             residencePermitNumber: employeeData.residence_permit_number || '',
// // //             birthDate: employeeData.birth_date || '',
// // //             year113: employeeData.years_of_service_113 || '',
// // //             year114: employeeData.years_of_service_114 || '',
// // //             address: employeeData.address || '',
// // //             homePhone: employeeData.home_phone || '',
// // //             mobilePhone: employeeData.mobile_phone || '',
// // //             companyPhone: employeeData.company_phone || '',
// // //             hireDate: employeeData.hire_date || '',
// // //             yearsOfService113: employeeData.years_of_service_113 || '',
// // //             annualLeaveHours: employeeData.annual_leave_hours || '',
// // //             annualLeaveExpiry: employeeData.annual_leave_expiry || '',
// // //             resignationDate: employeeData.resignation_date || '',
// // //             bloodType: employeeData.blood_type || '',
// // //             highestEducation: employeeData.highest_education || '',
// // //             schoolDepartment: employeeData.school_department || '',
// // //             personalEmail: employeeData.personal_email || '',
// // //             companyEmail: employeeData.company_email || '',
// // //             department: departmentName,
// // //             position: positionName,
// // //             professionalCertificates: employeeData.professional_certificates || '',
            
// // //             // 保留原有欄位以保持相容性
// // //             residenceAddress: employeeData.address || '',
// // //             mailingAddress: employeeData.address || '',
// // //             mobile: employeeData.mobile_phone || '',
// // //             phone: employeeData.home_phone || '',
// // //             jobTitle: positionName,
// // //             account: employeeData.employee_id ? employeeData.employee_id.toString() : '',
// // //             password: '••••••••',
            
// // //             // 其他欄位
// // //             shiftSystem: '',
// // //             identity: '',
// // //             salaryType: '',
// // //             jobLevel: '',
// // //             trainingControlDate: '',
// // //             pensionContribution: '',
// // //             dependentsInsured: '',
// // //             photo: null,
// // //             attachments: []
// // //           };

// // //           setFormData(mappedData);
// // //           console.log('已設定 PMX 完整表單資料:', mappedData);
          
// // //         } else {
// // //           console.error('PMX API 回傳錯誤:', result.Msg || '未知錯誤');
// // //           setError(result.Msg || t('personalData.fetchDataFailed') || '查詢員工資料失敗');
// // //         }
        
// // //       } catch (error) {
// // //         console.error('PMX API 請求失敗:', error);
        
// // //         // 🔥 更詳細的錯誤處理
// // //         if (error.message.includes('401')) {
// // //           setError('登入狀態已過期，請重新登入');
// // //           setTimeout(() => {
// // //             navigate('/apploginpmx');
// // //           }, 2000);
// // //         } else {
// // //           setError(`${t('personalData.networkError') || '網路連線錯誤'}: ${error.message}`);
// // //         }
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     if (employeeId) {
// // //       fetchEmployeeData();
// // //     }
// // //   }, [employeeId, t, navigate]);

// // //   // 其他處理函數保持不變...
// // //   const handleHomeClick = () => {
// // //     navigate('/frontpagepmx');
// // //   };

// // //   const handleEdit = () => {
// // //     setOriginalData({...formData});
// // //     setIsEditing(true);
// // //     setErrors({});
// // //   };

// // //   const handleCancel = () => {
// // //     setFormData(originalData);
// // //     setIsEditing(false);
// // //     setIsEditingPension(false);
// // //     setIsEditingHealthInsurance(false);
// // //     setErrors({});
// // //   };

// // //   const validateMobile = (mobile) => {
// // //     const regex = /^09\d{8}$/;
// // //     return regex.test(mobile);
// // //   };

// // //   const validateForm = () => {
// // //     const newErrors = {};
// // //     if (!validateMobile(formData.mobile)) {
// // //       newErrors.mobile = t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字';
// // //     }
// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   // 修改提交函數
// // //   const handleSubmit = async () => {
// // //     if (validateForm()) {
// // //       try {
// // //         setLoading(true);
// // //         console.log('提交的數據:', formData);
        
// // //         // 準備更新資料 - 根據 PMX API 的欄位格式
// // //         const updateData = {
// // //           address: formData.residenceAddress,
// // //           mobile_phone: formData.mobile,
// // //           home_phone: formData.phone,
// // //         };

// // //         // 呼叫更新 API
// // //         if (employeeDataId) {
// // //           const result = await updatePMXEmployeeInfo(employeeDataId, updateData);
          
// // //           if (result.Status === "Ok") {
// // //             setIsEditing(false);
// // //             setIsEditingPension(false);
// // //             setIsEditingHealthInsurance(false);
// // //             alert(t('personalData.updateSuccess') || '資料更新成功！');
// // //           } else {
// // //             throw new Error(result.Msg || '更新失敗');
// // //           }
// // //         } else {
// // //           throw new Error('缺少員工資料 ID');
// // //         }
        
// // //       } catch (error) {
// // //         console.error('更新 PMX 資料失敗:', error);
        
// // //         // 🔥 更詳細的錯誤處理
// // //         if (error.message.includes('401')) {
// // //           setError('登入狀態已過期，請重新登入');
// // //           setTimeout(() => {
// // //             navigate('/apploginpmx');
// // //           }, 2000);
// // //         } else {
// // //           setError(t('personalData.updateFailed') || '更新資料失敗，請稍後再試');
// // //           alert(`更新失敗: ${error.message}`);
// // //         }
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //   };

// // //   // 其他處理函數保持不變...
// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData({
// // //       ...formData,
// // //       [name]: value
// // //     });
// // //     if (name === 'mobile') {
// // //       if (!validateMobile(value)) {
// // //         setErrors({...errors, mobile: t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字'});
// // //       } else {
// // //         const newErrors = {...errors};
// // //         delete newErrors.mobile;
// // //         setErrors(newErrors);
// // //       }
// // //     }
// // //   };

// // //   const handlePensionEdit = () => {
// // //     setOriginalData({...formData});
// // //     setIsEditingPension(true);
// // //     setErrors({});
// // //   };

// // //   const handlePensionSelect = (value) => {
// // //     setFormData({
// // //       ...formData,
// // //       pensionContribution: value
// // //     });
// // //     setShowPensionSelector(false);
// // //   };

// // //   const handlePensionClick = () => {
// // //     setShowPensionSelector(true);
// // //   };

// // //   const handleHealthInsuranceEdit = () => {
// // //     setOriginalData({...formData});
// // //     setIsEditingHealthInsurance(true);
// // //     setSelectedDependents([1, 2, 3]);
// // //   };

// // //   const handleDependentSelect = (id) => {
// // //     if (selectedDependents.includes(id)) {
// // //       setSelectedDependents(selectedDependents.filter(depId => depId !== id));
// // //     } else {
// // //       setSelectedDependents([...selectedDependents, id]);
// // //     }
// // //   };

// // //   const handleAddNewDependent = () => {
// // //     console.log('新增眷屬');
// // //   };

// // //   const handleHealthInsuranceSubmit = () => {
// // //     console.log('提交選中的眷屬:', selectedDependents);
// // //     setFormData({
// // //       ...formData,
// // //       dependentsInsured: `${selectedDependents.length}人`
// // //     });
// // //     setIsEditingHealthInsurance(false);
// // //   };

// // //   const handleResetPassword = () => {
// // //     console.log('重設密碼');
// // //     alert(t('personalData.resetPasswordInDevelopment') || '密碼重設功能開發中...');
// // //   };

// // //   // 如果正在載入，顯示載入畫面
// // //   if (loading) {
// // //     return (
// // //       <div className="personal-container">
// // //         <div className="personal-app-wrapper">
// // //           <header className="personal-header">
// // //             <div className="personal-home-icon" onClick={handleHomeClick}>
// // //               <svg
// // //                 width="20"
// // //                 height="20"
// // //                 viewBox="0 0 24 24"
// // //                 fill="none"
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //               >
// // //                 <path
// // //                   d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
// // //                   stroke="white"
// // //                   strokeWidth="2"
// // //                   fill="none"
// // //                 />
// // //                 <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
// // //               </svg>
// // //             </div>
// // //             <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
// // //             <div className="personal-header-right">
// // //               <LanguageSwitch 
// // //                 className="personal-page-language-switch"
// // //                 position="relative"
// // //               />
// // //             </div>
// // //           </header>
// // //           <div className="personal-loading">
// // //             <div className="personal-loading-spinner"></div>
// // //             <div>{t('personalData.loading') || '載入中...'}</div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // 如果有錯誤，顯示錯誤訊息
// // //   if (error) {
// // //     return (
// // //       <div className="personal-container">
// // //         <div className="personal-app-wrapper">
// // //           <header className="personal-header">
// // //             <div className="personal-home-icon" onClick={handleHomeClick}>
// // //               <svg
// // //                 width="20"
// // //                 height="20"
// // //                 viewBox="0 0 24 24"
// // //                 fill="none"
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //               >
// // //                 <path
// // //                   d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
// // //                   stroke="white"
// // //                   strokeWidth="2"
// // //                   fill="none"
// // //                 />
// // //                 <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
// // //               </svg>
// // //             </div>
// // //             <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
// // //             <div className="personal-header-right">
// // //               <LanguageSwitch 
// // //                 className="personal-page-language-switch"
// // //                 position="relative"
// // //               />
// // //             </div>
// // //           </header>
// // //           <div className="personal-error">
// // //             <div>{t('personalData.loadFailed') || '載入失敗'}</div>
// // //             <div className="personal-error-message">{error}</div>
// // //             <div className="personal-debug-info">
// // //               Debug 資訊: 公司ID={companyId || '無'}, 員工ID={employeeId || '無'}
// // //             </div>
// // //             <button 
// // //               onClick={() => window.location.reload()} 
// // //               className="personal-reload-button"
// // //             >
// // //               {t('personalData.reload') || '重新載入'}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="personal-container">
// // //       <div className="personal-app-wrapper">
// // //         <header className="personal-header">
// // //           <div className="personal-home-icon" onClick={handleHomeClick}>
// // //             <svg
// // //               width="20"
// // //               height="20"
// // //               viewBox="0 0 24 24"
// // //               fill="none"
// // //               xmlns="http://www.w3.org/2000/svg"
// // //             >
// // //               <path
// // //                 d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
// // //                 stroke="white"
// // //                 strokeWidth="2"
// // //                 fill="none"
// // //               />
// // //               <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
// // //             </svg>
// // //           </div>
// // //           <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
// // //           <div className="personal-header-right">
// // //             <LanguageSwitch 
// // //               className="personal-page-language-switch"
// // //               position="relative"
// // //             />
// // //           </div>
// // //         </header>

// // //         {/* 🔥 修改：顯示訓練記錄的完整視圖 */}
// // //         {showTrainingRecords ? (
// // //           <div className="personal-training-records-view">
// // //             <div className="personal-training-header">
// // //               <button 
// // //                 className="personal-back-button"
// // //                 onClick={() => setShowTrainingRecords(false)}
// // //               >
// // //                 ← 返回
// // //               </button>
// // //               <h2>訓練記錄</h2>
// // //             </div>
            
// // //             <div className="personal-training-content">
// // //               {trainingRecords.length > 0 ? (
// // //                 <div className="personal-training-table">
// // //                   <div className="personal-training-table-header">
// // //                     {Object.values(trainingFieldLabels).map((label, index) => (
// // //                       <div key={index} className="personal-training-cell header-cell">
// // //                         {label}
// // //                       </div>
// // //                     ))}
// // //                   </div>
                  
// // //                   {trainingRecords.map((record, index) => (
// // //                     <div key={record.id || index} className="personal-training-table-row">
// // //                       {Object.entries(trainingFieldLabels).map(([key, label]) => (
// // //                         <div key={key} className="personal-training-cell">
// // //                           {record[key] || '無'}
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               ) : (
// // //                 <div className="personal-no-training-records">
// // //                   暫無訓練記錄
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         ) : isEditingHealthInsurance ? (
// // //           // 健保眷屬編輯視圖保持不變...
// // //           <div className="personal-editing-content">
// // //             <div className="personal-editing-header">
// // //               <h2>{t('personalData.editHealthInsurance') || '編輯健保眷屬'}</h2>
// // //               <div className="personal-editing-actions">
// // //                 <button onClick={handleCancel} className="personal-cancel-btn">
// // //                   {t('personalData.cancel') || '取消'}
// // //                 </button>
// // //                 <button onClick={handleHealthInsuranceSubmit} className="personal-submit-btn">
// // //                   {t('personalData.save') || '儲存'}
// // //                 </button>
// // //               </div>
// // //             </div>
            
// // //             <div className="personal-dependents-list">
// // //               {dependents.map((dependent) => (
// // //                 <div key={dependent.id} className="personal-dependent-item">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={selectedDependents.includes(dependent.id)}
// // //                     onChange={() => handleDependentSelect(dependent.id)}
// // //                   />
// // //                   <div className="personal-dependent-info">
// // //                     <div className="personal-dependent-name">{dependent.name}</div>
// // //                     <div className="personal-dependent-details">
// // //                       {dependent.birthDate} | {dependent.idNumber} | {dependent.relation}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
            
// // //             <button onClick={handleAddNewDependent} className="personal-add-dependent-btn">
// // //               + {t('personalData.addNewDependent') || '新增眷屬'}
// // //             </button>
// // //           </div>
// // //         ) : isEditingPension ? (
// // //           // 退休金編輯視圖保持不變...
// // //           <div className="personal-editing-content">
// // //             <div className="personal-editing-header">
// // //               <h2>{t('personalData.editPension') || '編輯退休金提撥'}</h2>
// // //               <div className="personal-editing-actions">
// // //                 <button onClick={handleCancel} className="personal-cancel-btn">
// // //                   {t('personalData.cancel') || '取消'}
// // //                 </button>
// // //                 <button onClick={handleSubmit} className="personal-submit-btn">
// // //                   {t('personalData.save') || '儲存'}
// // //                 </button>
// // //               </div>
// // //             </div>
            
// // //             <div className="personal-pension-editing">
// // //               <div className="personal-row">
// // //                 <div className="personal-label">{t('personalData.pensionContribution') || '退休金提撥比率'}</div>
// // //                 <div className="personal-value">
// // //                   <div 
// // //                     className="personal-pension-selector" 
// // //                     onClick={handlePensionClick}
// // //                     ref={pensionSelectorRef}
// // //                   >
// // //                     {formData.pensionContribution || t('personalData.selectPension') || '請選擇提撥比率'}
// // //                     <span className="personal-dropdown-arrow">▼</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ) : isEditing ? (
// // //           // 基本資料編輯視圖
// // //           <div className="personal-editing-content">
// // //             <div className="personal-editing-header">
// // //               <h2>{t('personalData.editBasicInfo') || '編輯基本資料'}</h2>
// // //               <div className="personal-editing-actions">
// // //                 <button onClick={handleCancel} className="personal-cancel-btn">
// // //                   {t('personalData.cancel') || '取消'}
// // //                 </button>
// // //                 <button onClick={handleSubmit} className="personal-submit-btn">
// // //                   {loading ? (t('personalData.saving') || '儲存中...') : (t('personalData.save') || '儲存')}
// // //                 </button>
// // //               </div>
// // //             </div>
            
// // //             <div className="personal-editing-form">
// // //               <div className="personal-row">
// // //                 <div className="personal-label">{t('personalData.residenceAddress') || '居住地址'}</div>
// // //                 <div className="personal-value">
// // //                   <input
// // //                     type="text"
// // //                     name="residenceAddress"
// // //                     value={formData.residenceAddress}
// // //                     onChange={handleInputChange}
// // //                     className="personal-input"
// // //                   />
// // //                 </div>
// // //               </div>
              
// // //               <div className="personal-row">
// // //                 <div className="personal-label">{t('personalData.mobile') || '手機號碼'}</div>
// // //                 <div className="personal-value">
// // //                   <input
// // //                     type="text"
// // //                     name="mobile"
// // //                     value={formData.mobile}
// // //                     onChange={handleInputChange}
// // //                     className={`personal-input ${errors.mobile ? 'personal-input-error' : ''}`}
// // //                   />
// // //                   {errors.mobile && (
// // //                     <div className="personal-error-text">{errors.mobile}</div>
// // //                   )}
// // //                 </div>
// // //               </div>
              
// // //               <div className="personal-row">
// // //                 <div className="personal-label">{t('personalData.phone') || '市話'}</div>
// // //                 <div className="personal-value">
// // //                   <input
// // //                     type="text"
// // //                     name="phone"
// // //                     value={formData.phone}
// // //                     onChange={handleInputChange}
// // //                     className="personal-input"
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           // 🔥 修改：主要個人資料視圖，顯示所有有內容的欄位
// // //           <div className="personal-content">
// // //             {/* 🔥 完整個人資料區塊 */}
// // //             <div className="personal-section">
// // //               <div className="personal-section-header">
// // //                 <div className="personal-section-title">完整個人資料</div>
// // //                 <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handleEdit(); }}>
// // //                   {t('personalData.edit') || '修改'}
// // //                 </a>
// // //               </div>
              
// // //               {/* 🔥 只顯示有內容的欄位 */}
// // //               {Object.entries(fieldLabels).map(([key, label]) => 
// // //                 renderFieldIfExists(label, formData[key], key)
// // //               ).filter(Boolean)}
// // //             </div>

// // //             {/* 🔥 訓練記錄區塊 */}
// // //             <div className="personal-section">
// // //               <div className="personal-section-header">
// // //                 <div className="personal-section-title">訓練記錄</div>
// // //                 {trainingRecords.length > 0 && (
// // //                   <a 
// // //                     href="#" 
// // //                     className="personal-edit-link" 
// // //                     onClick={(e) => { 
// // //                       e.preventDefault(); 
// // //                       setShowTrainingRecords(true); 
// // //                     }}
// // //                   >
// // //                     查看全部 ({trainingRecords.length})
// // //                   </a>
// // //                 )}
// // //               </div>
              
// // //               {trainingRecords.length > 0 ? (
// // //                 <>
// // //                   {/* 顯示前3筆訓練記錄 */}
// // //                   {trainingRecords.slice(0, 3).map((record, index) => (
// // //                     <div key={record.id || index} className="personal-training-summary">
// // //                       {renderFieldIfExists('項次', record.item_number, `${index}-item_number`)}
// // //                       {renderFieldIfExists('課程名稱', record.course_name, `${index}-course_name`)}
// // //                       {renderFieldIfExists('結訓日期', record.completion_date, `${index}-completion_date`)}
// // //                       {renderFieldIfExists('回訓日期', record.retraining_date, `${index}-retraining_date`)}
// // //                       {renderFieldIfExists('應回訓日期', record.scheduled_retraining_date, `${index}-scheduled_retraining_date`)}
// // //                       {renderFieldIfExists('受訓紀錄', record.training_record, `${index}-training_record`)}
                      
// // //                       {index < 2 && trainingRecords.length > 1 && (
// // //                         <div className="personal-training-divider"></div>
// // //                       )}
// // //                     </div>
// // //                   ))}
                  
// // //                   {trainingRecords.length > 3 && (
// // //                     <div className="personal-row">
// // //                       <div className="personal-label"></div>
// // //                       <div className="personal-value personal-more-records">
// // //                         還有 {trainingRecords.length - 3} 筆記錄...
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </>
// // //               ) : (
// // //                 <div className="personal-row">
// // //                   <div className="personal-label">訓練記錄</div>
// // //                   <div className="personal-value">暫無記錄</div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* 系統設定區塊 */}
// // //             <div className="personal-section">
// // //               <div className="personal-section-header">
// // //                 <div className="personal-section-title">{t('personalData.accountInfo') || '系統設定'}</div>
// // //               </div>
// // //               <div className="personal-row">
// // //                 <div className="personal-label">{t('personalData.account') || '帳號'}</div>
// // //                 <div className="personal-value">{formData.account}</div>
// // //               </div>
// // //               <div className="personal-row">
// // //                 <div className="personal-label">{t('personalData.password') || '密碼'}</div>
// // //                 <div className="personal-value">
// // //                   <button className="personal-reset-password-btn" onClick={handleResetPassword}>
// // //                     {t('personalData.resetPassword') || '重設密碼'}
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* 退休金提撥比率選擇器 */}
// // //         {showPensionSelector && (
// // //           <div className="personal-pension-selector-container" ref={pensionSelectorRef}>
// // //             {pensionOptions.map((option) => (
// // //               <div 
// // //                 key={option.value}
// // //                 className={`personal-pension-option ${formData.pensionContribution === option.value ? 'personal-selected-pension' : ''}`}
// // //                 onClick={() => handlePensionSelect(option.value)}
// // //               >
// // //                 {option.label}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default PersonalData;
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useEmployee } from '../contexts/EmployeeContext';
// // import { useFlutterIntegration } from './Hook/hooks'; // Flutter 整合
// // import { useLanguage } from './Hook/useLanguage'; // 語言 hook
// // import LanguageSwitch from './components/LanguageSwitch'; // 語言切換組件
// // import './PMX_CSS/PersonalDataPMX.css';
// // import Cookies from 'js-cookie';

// // // 🔥 新增：檢查 PMX 登入狀態的函數
// // const checkPMXLoginStatus = async () => {
// //   try {
// //     console.log('正在檢查 PMX 登入狀態...');
    
// //     const response = await fetch('https://rabbit.54ucl.com:3004/pmx/employee/check-session', {
// //       method: 'GET',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Accept': 'application/json',
// //       },
// //       credentials: 'include', // 🔥 發送 HTTP-only cookies
// //     });
    
// //     const result = await response.json();
// //     console.log('登入狀態檢查結果:', result);
    
// //     return result;
// //   } catch (error) {
// //     console.error('檢查登入狀態失敗:', error);
// //     return {
// //       Status: "Failed",
// //       Msg: "檢查登入狀態失敗",
// //       Data: { is_authenticated: false }
// //     };
// //   }
// // };

// // // 🔥 修正：查詢 PMX 員工資料的函數 - 加上 credentials
// // const fetchPMXEmployeeInfoByLogin = async (companyId, employeeId) => {
// //   try {
// //     console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
    
// //     // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
// //     const response = await fetch(`https://rabbit.54ucl.com:3004/pmx/employee/${employeeId}`, {
// //       method: 'GET',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Accept': 'application/json',
// //       },
// //       credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
// //     });
    
// //     if (!response.ok) {
// //       // 🔥 提供更詳細的錯誤資訊
// //       const errorText = await response.text();
// //       console.error(`API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
// //       throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
// //     }
    
// //     const result = await response.json();
// //     console.log('PMX API 完整回應:', result);
    
// //     if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
// //       // 🔥 處理多筆資料：提取基本資料和訓練記錄
// //       const allRecords = Array.isArray(result.Data) ? result.Data : [result.Data];
      
// //       // 🔥 從第一筆記錄中提取基本員工資料
// //       const basicEmployeeData = allRecords[0];
      
// //       // 🔥 提取所有訓練記錄
// //       const trainingRecords = allRecords.map((record, index) => ({
// //         id: index + 1,
// //         item_number: record.item_number,
// //         course_name: record.course_name,
// //         completion_date: record.completion_date,
// //         retraining_date: record.retraining_date,
// //         scheduled_retraining_date: record.scheduled_retraining_date,
// //         training_record: record.training_record
// //       }));
      
// //       console.log('基本員工資料:', basicEmployeeData);
// //       console.log('訓練記錄:', trainingRecords);
      
// //       // 🔥 返回結構化的資料
// //       return {
// //         Status: "Ok",
// //         Data: [{
// //           ...basicEmployeeData,
// //           training_records: trainingRecords // 🔥 添加訓練記錄
// //         }]
// //       };
// //     }
    
// //     return result;
// //   } catch (error) {
// //     console.error('查詢 PMX 員工資料失敗:', error);
// //     throw error;
// //   }
// // };

// // // 🔥 修正：更新員工資料的函數 - 加上 credentials
// // const updatePMXEmployeeInfo = async (id, updateData) => {
// //   try {
// //     console.log(`正在更新 PMX 員工資料 - ID: ${id}`, updateData);
    
// //     // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
// //     const response = await fetch(`https://rabbit.54ucl.com:3004/api/pmx/employee/update/${id}`, {
// //       method: 'PUT',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Accept': 'application/json',
// //       },
// //       credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
// //       body: JSON.stringify(updateData)
// //     });
    
// //     if (!response.ok) {
// //       // 🔥 提供更詳細的錯誤資訊
// //       const errorText = await response.text();
// //       console.error(`更新 API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
// //       throw new Error(`更新請求失敗: ${response.status} - ${errorText}`);
// //     }
    
// //     const result = await response.json();
// //     console.log('更新 PMX API 回應:', result);
// //     return result;
// //   } catch (error) {
// //     console.error('更新 PMX 員工資料失敗:', error);
// //     throw error;
// //   }
// // };

// // function PersonalData() {
// //   // 添加語言 hook
// //   const { t } = useLanguage();
  
// //   // Flutter 整合 hook
// //   const { isFlutterEnvironment } = useFlutterIntegration('home');
  
// //   // 🔥 新增：訓練記錄相關狀態
// //   const [trainingRecords, setTrainingRecords] = useState([]);
// //   const [showTrainingRecords, setShowTrainingRecords] = useState(false);
  
// //   // 原有狀態保持不變...
// //   const [currentTime, setCurrentTime] = useState('');
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showGenderSelector, setShowGenderSelector] = useState(false);
// //   const [showYearSelector, setShowYearSelector] = useState(false);
// //   const [showPensionSelector, setShowPensionSelector] = useState(false);
// //   const [errors, setErrors] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
  
// //   // 新增狀態來儲存從 cookies 獲取的資料
// //   const [companyId, setCompanyId] = useState('');
// //   const [employeeId, setEmployeeId] = useState('');
  
// //   // 新增狀態來儲存員工資料的 ID（用於更新）
// //   const [employeeDataId, setEmployeeDataId] = useState(null);
  
// //   const datePickerRef = useRef(null);
// //   const genderSelectorRef = useRef(null);
// //   const yearSelectorRef = useRef(null);
// //   const pensionSelectorRef = useRef(null);
// //   const navigate = useNavigate();

// //   // 其他狀態保持不變...
// //   const [isEditingHealthInsurance, setIsEditingHealthInsurance] = useState(false);
// //   const [selectedDependents, setSelectedDependents] = useState([]);
// //   const [dependents, setDependents] = useState([
// //     {
// //       id: 1,
// //       name: '朱大豬',
// //       birthDate: '民062年12月26日',
// //       idNumber: 'A123456789',
// //       relation: '3子女'
// //     },
// //     {
// //       id: 2,
// //       name: '朱二豬',
// //       birthDate: '民062年12月26日',
// //       idNumber: 'A123456789',
// //       relation: '3子女'
// //     },
// //     {
// //       id: 3,
// //       name: '朱三豬',
// //       birthDate: '民062年12月26日',
// //       idNumber: 'A123456789',
// //       relation: '3子女'
// //     }
// //   ]);

// //   // 從 context 取得公司和員工ID（作為備用）
// //   const { companyId: contextCompanyId, employeeId: contextEmployeeId } = useEmployee();

// //   // 退休金提撥比率選項
// //   const pensionOptions = [
// //     { value: '6%', label: '6%' },
// //     { value: '5%', label: '5%' },
// //     { value: '4%', label: '4%' },
// //     { value: '3%', label: '3%' },
// //     { value: '2%', label: '2%' },
// //     { value: '1%', label: '1%' },
// //     { value: '0%', label: '0%' }
// //   ];

// //   // 性別選項 - 使用翻譯
// //   const genderOptions = [
// //     { value: '男', label: t('personalData.genderOptions.male') || '男' },
// //     { value: '女', label: t('personalData.genderOptions.female') || '女' },
// //     { value: '非二元性別', label: t('personalData.genderOptions.nonBinary') || '非二元性別' }
// //   ];

// // // 🔥 修改：個人資料狀態 - 包含新增欄位
// // const [formData, setFormData] = useState({
// //   // 基本個人資料
// //   employeeId: '',
// //   name: '',
// //   gender: '',
// //   passportEnglishName: '',
// //   nationality: '',
// //   idNumber: '',
// //   residencePermitNumber: '',
// //   birthDate: '',
// //   age113: '', // 🔥 新增：113年度年齡
// //   age114: '', // 🔥 新增：114年度年齡
// //   address: '',
// //   homePhone: '',
// //   mobilePhone: '',
// //   companyPhone: '',
// //   hireDate: '',
// //   yearsOfService113: '',
// //   annualLeaveHours: '',
// //   annualLeaveExpiry: '',
// //   resignationDate: '',
// //   bloodType: '',
// //   highestEducation: '',
// //   schoolDepartment: '',
// //   personalEmail: '',
// //   companyEmail: '',
// //   department: '',
// //   position: '',
// //   professionalCertificates: '',
  
// //   // 保留原有欄位以保持相容性
// //   photo: null,
// //   residenceAddress: '',
// //   mailingAddress: '',
// //   mobile: '',
// //   phone: '',
// //   shiftSystem: '',
// //   identity: '',
// //   salaryType: '',
// //   jobTitle: '',
// //   jobLevel: '',
// //   trainingControlDate: '',
// //   pensionContribution: '',
// //   dependentsInsured: '',
// //   account: '',
// //   password: '',
// //   attachments: []
// // });


// //   // 暫存修改前的資料，用於取消操作
// //   const [originalData, setOriginalData] = useState({});
  
// //   // 當前是否正在編輯退休金
// //   const [isEditingPension, setIsEditingPension] = useState(false);

// // // 🔥 修改：欄位中文對應表
// // const fieldLabels = {
// //   employeeId: '職編',
// //   name: '中文名字',
// //   gender: '性別',
// //   passportEnglishName: '護照英文全名',
// //   nationality: '國籍（具有雙重國籍者請分別列出）',
// //   idNumber: '身分證字號',
// //   residencePermitNumber: '居留證號碼',
// //   birthDate: '西元出生日期',
// //   age113: '113年度年齡', // 🔥 新增
// //   age114: '114年度年齡', // 🔥 新增
// //   address: '地址',
// //   homePhone: '聯絡方式：市話',
// //   mobilePhone: '聯絡方式：手機',
// //   companyPhone: '公司手機',
// //   hireDate: '到職日',
// //   yearsOfService113: '113年資',
// //   annualLeaveHours: '特休時數',
// //   annualLeaveExpiry: '特休期限',
// //   resignationDate: '離職日',
// //   bloodType: '血型',
// //   highestEducation: '最高學歷',
// //   schoolDepartment: '就讀學校/科系',
// //   personalEmail: '個人電子郵件',
// //   companyEmail: '公司配發電子郵件',
// //   department: '部門',
// //   position: '職稱',
// //   professionalCertificates: '專業證照（若有相關資料，請分別列出並備妥電子檔）'
// // };

// //   // 🔥 新增：訓練記錄欄位中文對應
// //   const trainingFieldLabels = {
// //     item_number: '項次',
// //     course_name: '課程名稱',
// //     completion_date: '結訓日期',
// //     retraining_date: '回訓日期',
// //     scheduled_retraining_date: '應回訓日期',
// //     training_record: '受訓紀錄'
// //   };

// //   // 🔥 修改：創建一個函數來渲染有內容的欄位，添加特殊樣式類和響應式優化
// //   const renderFieldIfExists = (label, value, key = null) => {
// //     // 如果值存在且不為空字串，才顯示該欄位
// //     if (value && value.toString().trim() !== '') {
// //       // 判斷是否為長文字內容
// //       const isLongText = value.toString().length > 20;
// //       const isAddress = label.includes('地址');
// //       const isEmail = label.includes('電子郵件') || label.includes('email');
// //       const isCertificates = label.includes('證照');
      
// //       // 為特殊內容添加CSS類
// //       let valueClass = 'personal-value';
// //       if (isLongText) valueClass += ' long-text';
// //       if (isAddress) valueClass += ' address';
// //       if (isEmail) valueClass += ' email';
// //       if (isCertificates) valueClass += ' certificates';
      
// //       return (
// //         <div key={key} className="personal-row">
// //           <div className="personal-label">{label}</div>
// //           <div className={valueClass}>{value}</div>
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   // 輔助函數保持不變...
// //   const mapGender = (gender) => {
// //     if (!gender) return '';
// //     switch (gender.toLowerCase()) {
// //       case 'male':
// //       case '男':
// //         return '男';
// //       case 'female':
// //       case '女':
// //         return '女';
// //       default:
// //         return gender;
// //     }
// //   };

// //   const mapPensionContribution = (contribution) => {
// //     if (!contribution) return '';
// //     const percentage = parseFloat(contribution);
// //     if (isNaN(percentage)) return '';
// //     return `${Math.round(percentage * 100)}%`;
// //   };

// //   const mapDependentsInsured = (dependents) => {
// //     if (!dependents) return '';
// //     return `${dependents}人`;
// //   };

// //   // 從 cookies 獲取登入資料
// //   const getLoginDataFromCookies = () => {
// //     try {
// //       const cookieCompanyId = Cookies.get('company_id') || 
// //                              Cookies.get('companyId') || 
// //                              Cookies.get('Company_ID');
      
// //       const cookieEmployeeId = Cookies.get('employee_id') || 
// //                               Cookies.get('employeeId') || 
// //                               Cookies.get('Employee_ID');

// //       console.log('從 cookies 獲取的資料:', {
// //         company_id: cookieCompanyId,
// //         employee_id: cookieEmployeeId
// //       });

// //       if (!cookieCompanyId || !cookieEmployeeId) {
// //         const sessionCompanyId = sessionStorage.getItem('cookie_company_id') || 
// //                                  localStorage.getItem('temp_cookie_company_id');
// //         const sessionEmployeeId = sessionStorage.getItem('cookie_employee_id') || 
// //                                   localStorage.getItem('temp_cookie_employee_id');
        
// //         console.log('從 storage 獲取的資料:', {
// //           company_id: sessionCompanyId,
// //           employee_id: sessionEmployeeId
// //         });

// //         return {
// //           company_id: cookieCompanyId || sessionCompanyId,
// //           employee_id: cookieEmployeeId || sessionEmployeeId
// //         };
// //       }

// //       return {
// //         company_id: cookieCompanyId,
// //         employee_id: cookieEmployeeId
// //       };
// //     } catch (error) {
// //       console.error('從 cookies 獲取資料失敗:', error);
// //       return {
// //         company_id: null,
// //         employee_id: null
// //       };
// //     }
// //   };

// //   // 初始化時從 cookies 獲取資料
// //   useEffect(() => {
// //     console.log('初始化 PersonalData 組件');
    
// //     const cookieData = getLoginDataFromCookies();
    
// //     const finalCompanyId = cookieData.company_id || contextCompanyId || '';
// //     const finalEmployeeId = cookieData.employee_id || contextEmployeeId || '';
    
// //     console.log('最終使用的資料:', {
// //       company_id: finalCompanyId,
// //       employee_id: finalEmployeeId,
// //       source: cookieData.company_id ? 'cookies' : (contextCompanyId ? 'context' : 'none')
// //     });

// //     setCompanyId(finalCompanyId);
// //     setEmployeeId(finalEmployeeId);
// //   }, [contextCompanyId, contextEmployeeId]);

// //   // 點擊外部關閉選擇器
// //   useEffect(() => {
// //     function handleClickOutside(event) {
// //       if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
// //         setShowDatePicker(false);
// //         setShowYearSelector(false);
// //       }
// //       if (genderSelectorRef.current && !genderSelectorRef.current.contains(event.target)) {
// //         setShowGenderSelector(false);
// //       }
// //       if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target)) {
// //         setShowYearSelector(false);
// //       }
// //       if (pensionSelectorRef.current && !pensionSelectorRef.current.contains(event.target)) {
// //         setShowPensionSelector(false);
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   // 右上角時間
// //   useEffect(() => {
// //     const updateClock = () => {
// //       const now = new Date();
// //       const hours = String(now.getHours()).padStart(2, '0');
// //       const minutes = String(now.getMinutes()).padStart(2, '0');
// //       setCurrentTime(`${hours}:${minutes}`);
// //     };
// //     updateClock();
// //     const timer = setInterval(updateClock, 1000);
// //     return () => clearInterval(timer);
// //   }, []);

// //   // 🔥 修改：使用新的 PMX API 函數獲取完整員工資料，並加入登入狀態檢查
// //   useEffect(() => {
// //     const fetchEmployeeData = async () => {
// //       if (!employeeId) {
// //         console.log('缺少員工ID:', { employeeId });
// //         setError(t('personalData.pleaseLogin') || '請先登入以查看個人資料');
// //         return;
// //       }

// //       setLoading(true);
// //       setError('');

// //       try {
// //         console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
        
// //         // 🔥 首先檢查登入狀態
// //         const loginStatus = await checkPMXLoginStatus();
        
// //         if (loginStatus.Status !== "Ok" || !loginStatus.Data?.is_authenticated) {
// //           console.error('登入狀態無效:', loginStatus);
// //           setError('登入狀態已過期，請重新登入');
// //           // 🔥 可以選擇重定向到登入頁面
// //           setTimeout(() => {
// //             navigate('/apploginpmx');
// //           }, 2000);
// //           return;
// //         }
        
// //         console.log('登入狀態有效，繼續查詢員工資料...');
        
// //         // 🔥 使用修改後的 fetchPMXEmployeeInfo 函數
// //         const result = await fetchPMXEmployeeInfoByLogin(companyId, employeeId);
// //         console.log('PMX API 回傳結果:', result);
        
// //         if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
// //           // 取第一筆資料（基本員工資料）
// //           const employeeData = result.Data[0];
// //           console.log('PMX API 回傳的員工資料:', employeeData);
          
// //           // 儲存資料 ID 用於後續更新
// //           setEmployeeDataId(employeeData.id);
          
// //           // 🔥 設置訓練記錄
// //           if (employeeData.training_records && employeeData.training_records.length > 0) {
// //             setTrainingRecords(employeeData.training_records);
// //             console.log('設置訓練記錄:', employeeData.training_records);
// //           } else {
// //             setTrainingRecords([]);
// //             console.log('無訓練記錄');
// //           }
          
// //           // 🔥 處理 department_position 分割
// //           const departmentPosition = employeeData.department_position || '';
// //           let departmentName = '';
// //           let positionName = '';
          
// //           if (departmentPosition.includes('/')) {
// //             const parts = departmentPosition.split('/');
// //             departmentName = parts[0].trim();
// //             positionName = parts[1].trim();
// //           } else {
// //             departmentName = departmentPosition;
// //             positionName = departmentPosition;
// //           }
          
// // // 🔥 修改：將 PMX API 回傳的所有資料對應到表單欄位
// // const mappedData = {
// //   // 基本個人資料
// //   employeeId: employeeData.employee_id || '',
// //   name: employeeData.name || '',
// //   gender: mapGender(employeeData.gender),
// //   passportEnglishName: employeeData.passport_english_name || '',
// //   nationality: employeeData.nationality || '',
// //   idNumber: employeeData.id_card_number || '',
// //   residencePermitNumber: employeeData.residence_permit_number || '',
// //   birthDate: employeeData.birth_date || '',
// //   age113: employeeData.age_113 || '', // 🔥 新增：對應到 age_113 欄位
// //   age114: employeeData.age_114 || '', // 🔥 新增：對應到 age_114 欄位
// //   address: employeeData.address || '',
// //   homePhone: employeeData.home_phone || '',
// //   mobilePhone: employeeData.mobile_phone || '',
// //   companyPhone: employeeData.company_phone || '',
// //   hireDate: employeeData.hire_date || '',
// //   yearsOfService113: employeeData.years_of_service_113 || '',
// //   annualLeaveHours: employeeData.annual_leave_hours || '',
// //   annualLeaveExpiry: employeeData.annual_leave_expiry || '',
// //   resignationDate: employeeData.resignation_date || '',
// //   bloodType: employeeData.blood_type || '',
// //   highestEducation: employeeData.highest_education || '',
// //   schoolDepartment: employeeData.school_department || '',
// //   personalEmail: employeeData.personal_email || '',
// //   companyEmail: employeeData.company_email || '',
// //   department: departmentName,
// //   position: positionName,
// //   professionalCertificates: employeeData.professional_certificates || '',
  
// //   // 保留原有欄位以保持相容性
// //   residenceAddress: employeeData.address || '',
// //   mailingAddress: employeeData.address || '',
// //   mobile: employeeData.mobile_phone || '',
// //   phone: employeeData.home_phone || '',
// //   jobTitle: positionName,
// //   account: employeeData.employee_id ? employeeData.employee_id.toString() : '',
// //   password: '••••••••',
  
// //   // 其他欄位
// //   shiftSystem: '',
// //   identity: '',
// //   salaryType: '',
// //   jobLevel: '',
// //   trainingControlDate: '',
// //   pensionContribution: '',
// //   dependentsInsured: '',
// //   photo: null,
// //   attachments: []
// // };


// //           setFormData(mappedData);
// //           console.log('已設定 PMX 完整表單資料:', mappedData);
          
// //         } else {
// //           console.error('PMX API 回傳錯誤:', result.Msg || '未知錯誤');
// //           setError(result.Msg || t('personalData.fetchDataFailed') || '查詢員工資料失敗');
// //         }
        
// //       } catch (error) {
// //         console.error('PMX API 請求失敗:', error);
        
// //         // 🔥 更詳細的錯誤處理
// //         if (error.message.includes('401')) {
// //           setError('登入狀態已過期，請重新登入');
// //           setTimeout(() => {
// //             navigate('/apploginpmx');
// //           }, 2000);
// //         } else {
// //           setError(`${t('personalData.networkError') || '網路連線錯誤'}: ${error.message}`);
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (employeeId) {
// //       fetchEmployeeData();
// //     }
// //   }, [employeeId, t, navigate, companyId]);

// //   // 其他處理函數保持不變...
// //   const handleHomeClick = () => {
// //     navigate('/frontpagepmx');
// //   };

// //   const handleEdit = () => {
// //     setOriginalData({...formData});
// //     setIsEditing(true);
// //     setErrors({});
// //   };

// //   const handleCancel = () => {
// //     setFormData(originalData);
// //     setIsEditing(false);
// //     setIsEditingPension(false);
// //     setIsEditingHealthInsurance(false);
// //     setErrors({});
// //   };

// //   const validateMobile = (mobile) => {
// //     const regex = /^09\d{8}$/;
// //     return regex.test(mobile);
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
// //     if (!validateMobile(formData.mobile)) {
// //       newErrors.mobile = t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字';
// //     }
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   // 修改提交函數
// //   const handleSubmit = async () => {
// //     if (validateForm()) {
// //       try {
// //         setLoading(true);
// //         console.log('提交的數據:', formData);
        
// //         // 準備更新資料 - 根據 PMX API 的欄位格式
// //         const updateData = {
// //           address: formData.residenceAddress,
// //           mobile_phone: formData.mobile,
// //           home_phone: formData.phone,
// //         };

// //         // 呼叫更新 API
// //         if (employeeDataId) {
// //           const result = await updatePMXEmployeeInfo(employeeDataId, updateData);
          
// //           if (result.Status === "Ok") {
// //             setIsEditing(false);
// //             setIsEditingPension(false);
// //             setIsEditingHealthInsurance(false);
// //             alert(t('personalData.updateSuccess') || '資料更新成功！');
// //           } else {
// //             throw new Error(result.Msg || '更新失敗');
// //           }
// //         } else {
// //           throw new Error('缺少員工資料 ID');
// //         }
        
// //       } catch (error) {
// //         console.error('更新 PMX 資料失敗:', error);
        
// //         // 🔥 更詳細的錯誤處理
// //         if (error.message.includes('401')) {
// //           setError('登入狀態已過期，請重新登入');
// //           setTimeout(() => {
// //             navigate('/apploginpmx');
// //           }, 2000);
// //         } else {
// //           setError(t('personalData.updateFailed') || '更新資料失敗，請稍後再試');
// //           alert(`更新失敗: ${error.message}`);
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   // 其他處理函數保持不變...
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
// //     if (name === 'mobile') {
// //       if (!validateMobile(value)) {
// //         setErrors({...errors, mobile: t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字'});
// //       } else {
// //         const newErrors = {...errors};
// //         delete newErrors.mobile;
// //         setErrors(newErrors);
// //       }
// //     }
// //   };

// //   const handlePensionEdit = () => {
// //     setOriginalData({...formData});
// //     setIsEditingPension(true);
// //     setErrors({});
// //   };

// //   const handlePensionSelect = (value) => {
// //     setFormData({
// //       ...formData,
// //       pensionContribution: value
// //     });
// //     setShowPensionSelector(false);
// //   };

// //   const handlePensionClick = () => {
// //     setShowPensionSelector(true);
// //   };

// //   const handleHealthInsuranceEdit = () => {
// //     setOriginalData({...formData});
// //     setIsEditingHealthInsurance(true);
// //     setSelectedDependents([1, 2, 3]);
// //   };

// //   const handleDependentSelect = (id) => {
// //     if (selectedDependents.includes(id)) {
// //       setSelectedDependents(selectedDependents.filter(depId => depId !== id));
// //     } else {
// //       setSelectedDependents([...selectedDependents, id]);
// //     }
// //   };

// //   const handleAddNewDependent = () => {
// //     console.log('新增眷屬');
// //   };

// //   const handleHealthInsuranceSubmit = () => {
// //     console.log('提交選中的眷屬:', selectedDependents);
// //     setFormData({
// //       ...formData,
// //       dependentsInsured: `${selectedDependents.length}人`
// //     });
// //     setIsEditingHealthInsurance(false);
// //   };

// //   const handleResetPassword = () => {
// //     console.log('重設密碼');
// //     alert(t('personalData.resetPasswordInDevelopment') || '密碼重設功能開發中...');
// //   };

// //   // 如果正在載入，顯示載入畫面
// //   if (loading) {
// //     return (
// //       <div className="personal-container">
// //         <div className="personal-app-wrapper">
// //           <header className="personal-header">
// //             <div className="personal-home-icon" onClick={handleHomeClick}>
// //               <svg
// //                 width="20"
// //                 height="20"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 xmlns="http://www.w3.org/2000/svg"
// //               >
// //                 <path
// //                   d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
// //                   stroke="white"
// //                   strokeWidth="2"
// //                   fill="none"
// //                 />
// //                 <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
// //               </svg>
// //             </div>
// //             <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
// //             <div className="personal-header-right">
// //               <LanguageSwitch 
// //                 className="personal-page-language-switch"
// //                 position="relative"
// //               />
// //             </div>
// //           </header>
// //           <div className="personal-loading">
// //             <div className="personal-loading-spinner"></div>
// //             <div>{t('personalData.loading') || '載入中...'}</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // 如果有錯誤，顯示錯誤訊息
// //   if (error) {
// //     return (
// //       <div className="personal-container">
// //         <div className="personal-app-wrapper">
// //           <header className="personal-header">
// //             <div className="personal-home-icon" onClick={handleHomeClick}>
// //               <svg
// //                 width="20"
// //                 height="20"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 xmlns="http://www.w3.org/2000/svg"
// //               >
// //                 <path
// //                   d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
// //                   stroke="white"
// //                   strokeWidth="2"
// //                   fill="none"
// //                 />
// //                 <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
// //               </svg>
// //             </div>
// //             <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
// //             <div className="personal-header-right">
// //               <LanguageSwitch 
// //                 className="personal-page-language-switch"
// //                 position="relative"
// //               />
// //             </div>
// //           </header>
// //           <div className="personal-error">
// //             <div>{t('personalData.loadFailed') || '載入失敗'}</div>
// //             <div className="personal-error-message">{error}</div>
// //             <div className="personal-debug-info">
// //               Debug 資訊: 公司ID={companyId || '無'}, 員工ID={employeeId || '無'}
// //             </div>
// //             <button 
// //               onClick={() => window.location.reload()} 
// //               className="personal-reload-button"
// //             >
// //               {t('personalData.reload') || '重新載入'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="personal-container">
// //       <div className="personal-app-wrapper">
// //         <header className="personal-header">
// //           <div className="personal-home-icon" onClick={handleHomeClick}>
// //             <svg
// //               width="20"
// //               height="20"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <path
// //                 d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
// //                 stroke="white"
// //                 strokeWidth="2"
// //                 fill="none"
// //               />
// //               <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
// //             </svg>
// //           </div>
// //           <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
// //           <div className="personal-header-right">
// //             <LanguageSwitch 
// //               className="personal-page-language-switch"
// //               position="relative"
// //             />
// //           </div>
// //         </header>

// //         {/* 🔥 修改：顯示訓練記錄的完整視圖，加上 data-label 屬性 */}
// //         {showTrainingRecords ? (
// //           <div className="personal-training-records-view">
// //             <div className="personal-training-header">
// //               <button 
// //                 className="personal-back-button"
// //                 onClick={() => setShowTrainingRecords(false)}
// //               >
// //                 ← 返回
// //               </button>
// //               <h2>訓練記錄</h2>
// //             </div>
            
// //             <div className="personal-training-content">
// //               {trainingRecords.length > 0 ? (
// //                 <div className="personal-training-table">
// //                   <div className="personal-training-table-header">
// //                     {Object.values(trainingFieldLabels).map((label, index) => (
// //                       <div key={index} className="personal-training-cell header-cell">
// //                         {label}
// //                       </div>
// //                     ))}
// //                   </div>
                  
// //                   {trainingRecords.map((record, index) => (
// //                     <div key={record.id || index} className="personal-training-table-row">
// //                       {Object.entries(trainingFieldLabels).map(([key, label]) => (
// //                         <div 
// //                           key={key} 
// //                           className="personal-training-cell"
// //                           data-label={label} // 🔥 新增：為小螢幕響應式設計
// //                         >
// //                           {record[key] || '無'}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <div className="personal-no-training-records">
// //                   暫無訓練記錄
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         ) : isEditingHealthInsurance ? (
// //           // 健保眷屬編輯視圖保持不變...
// //           <div className="personal-editing-content">
// //             <div className="personal-editing-header">
// //               <h2>{t('personalData.editHealthInsurance') || '編輯健保眷屬'}</h2>
// //               <div className="personal-editing-actions">
// //                 <button onClick={handleCancel} className="personal-cancel-btn">
// //                   {t('personalData.cancel') || '取消'}
// //                 </button>
// //                 <button onClick={handleHealthInsuranceSubmit} className="personal-submit-btn">
// //                   {t('personalData.save') || '儲存'}
// //                 </button>
// //               </div>
// //             </div>
            
// //             <div className="personal-dependents-list">
// //               {dependents.map((dependent) => (
// //                 <div key={dependent.id} className="personal-dependent-item">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedDependents.includes(dependent.id)}
// //                     onChange={() => handleDependentSelect(dependent.id)}
// //                   />
// //                   <div className="personal-dependent-info">
// //                     <div className="personal-dependent-name">{dependent.name}</div>
// //                     <div className="personal-dependent-details">
// //                       {dependent.birthDate} | {dependent.idNumber} | {dependent.relation}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
            
// //             <button onClick={handleAddNewDependent} className="personal-add-dependent-btn">
// //               + {t('personalData.addNewDependent') || '新增眷屬'}
// //             </button>
// //           </div>
// //         ) : isEditingPension ? (
// //           // 退休金編輯視圖保持不變...
// //           <div className="personal-editing-content">
// //             <div className="personal-editing-header">
// //               <h2>{t('personalData.editPension') || '編輯退休金提撥'}</h2>
// //               <div className="personal-editing-actions">
// //                 <button onClick={handleCancel} className="personal-cancel-btn">
// //                   {t('personalData.cancel') || '取消'}
// //                 </button>
// //                 <button onClick={handleSubmit} className="personal-submit-btn">
// //                   {t('personalData.save') || '儲存'}
// //                 </button>
// //               </div>
// //             </div>
            
// //             <div className="personal-pension-editing">
// //               <div className="personal-row">
// //                 <div className="personal-label">{t('personalData.pensionContribution') || '退休金提撥比率'}</div>
// //                 <div className="personal-value">
// //                   <div 
// //                     className="personal-pension-selector" 
// //                     onClick={handlePensionClick}
// //                     ref={pensionSelectorRef}
// //                   >
// //                     {formData.pensionContribution || t('personalData.selectPension') || '請選擇提撥比率'}
// //                     <span className="personal-dropdown-arrow">▼</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ) : isEditing ? (
// //           // 基本資料編輯視圖
// //           <div className="personal-editing-content">
// //             <div className="personal-editing-header">
// //               <h2>{t('personalData.editBasicInfo') || '編輯基本資料'}</h2>
// //               <div className="personal-editing-actions">
// //                 <button onClick={handleCancel} className="personal-cancel-btn">
// //                   {t('personalData.cancel') || '取消'}
// //                 </button>
// //                 <button onClick={handleSubmit} className="personal-submit-btn">
// //                   {loading ? (t('personalData.saving') || '儲存中...') : (t('personalData.save') || '儲存')}
// //                 </button>
// //               </div>
// //             </div>
            
// //             <div className="personal-editing-form">
// //               <div className="personal-row">
// //                 <div className="personal-label">{t('personalData.residenceAddress') || '居住地址'}</div>
// //                 <div className="personal-value">
// //                   <input
// //                     type="text"
// //                     name="residenceAddress"
// //                     value={formData.residenceAddress}
// //                     onChange={handleInputChange}
// //                     className="personal-input"
// //                   />
// //                 </div>
// //               </div>
              
// //               <div className="personal-row">
// //                 <div className="personal-label">{t('personalData.mobile') || '手機號碼'}</div>
// //                 <div className="personal-value">
// //                   <input
// //                     type="text"
// //                     name="mobile"
// //                     value={formData.mobile}
// //                     onChange={handleInputChange}
// //                     className={`personal-input ${errors.mobile ? 'personal-input-error' : ''}`}
// //                   />
// //                   {errors.mobile && (
// //                     <div className="personal-error-text">{errors.mobile}</div>
// //                   )}
// //                 </div>
// //               </div>
              
// //               <div className="personal-row">
// //                 <div className="personal-label">{t('personalData.phone') || '市話'}</div>
// //                 <div className="personal-value">
// //                   <input
// //                     type="text"
// //                     name="phone"
// //                     value={formData.phone}
// //                     onChange={handleInputChange}
// //                     className="personal-input"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ) : (
// //           // 🔥 修改：主要個人資料視圖，顯示所有有內容的欄位
// //           <div className="personal-content">
// //             {/* 🔥 完整個人資料區塊 */}
// //             <div className="personal-section">
// //               <div className="personal-section-header">
// //                 <div className="personal-section-title">完整個人資料</div>
// //                 <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handleEdit(); }}>
// //                   {t('personalData.edit') || '修改'}
// //                 </a>
// //               </div>
              
// //               {/* 🔥 只顯示有內容的欄位 */}
// //               {Object.entries(fieldLabels).map(([key, label]) => 
// //                 renderFieldIfExists(label, formData[key], key)
// //               ).filter(Boolean)}
// //             </div>

// //             {/* 🔥 訓練記錄區塊 */}
// //             <div className="personal-section">
// //               <div className="personal-section-header">
// //                 <div className="personal-section-title">訓練記錄</div>
// //                 {trainingRecords.length > 0 && (
// //                   <a 
// //                     href="#" 
// //                     className="personal-edit-link" 
// //                     onClick={(e) => { 
// //                       e.preventDefault(); 
// //                       setShowTrainingRecords(true); 
// //                     }}
// //                   >
// //                     查看全部 ({trainingRecords.length})
// //                   </a>
// //                 )}
// //               </div>
              
// //               {trainingRecords.length > 0 ? (
// //                 <>
// //                   {/* 顯示前3筆訓練記錄 */}
// //                   {trainingRecords.slice(0, 3).map((record, index) => (
// //                     <div key={record.id || index} className="personal-training-summary">
// //                       {renderFieldIfExists('項次', record.item_number, `${index}-item_number`)}
// //                       {renderFieldIfExists('課程名稱', record.course_name, `${index}-course_name`)}
// //                       {renderFieldIfExists('結訓日期', record.completion_date, `${index}-completion_date`)}
// //                       {renderFieldIfExists('回訓日期', record.retraining_date, `${index}-retraining_date`)}
// //                       {renderFieldIfExists('應回訓日期', record.scheduled_retraining_date, `${index}-scheduled_retraining_date`)}
// //                       {renderFieldIfExists('受訓紀錄', record.training_record, `${index}-training_record`)}
                      
// //                       {index < 2 && trainingRecords.length > 1 && (
// //                         <div className="personal-training-divider"></div>
// //                       )}
// //                     </div>
// //                   ))}
                  
// //                   {trainingRecords.length > 3 && (
// //                     <div className="personal-row">
// //                       <div className="personal-label"></div>
// //                       <div className="personal-value personal-more-records">
// //                         還有 {trainingRecords.length - 3} 筆記錄...
// //                       </div>
// //                     </div>
// //                   )}
// //                 </>
// //               ) : (
// //                 <div className="personal-row">
// //                   <div className="personal-label">訓練記錄</div>
// //                   <div className="personal-value">暫無記錄</div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* 系統設定區塊 */}
// //             <div className="personal-section">
// //               <div className="personal-section-header">
// //                 <div className="personal-section-title">{t('personalData.accountInfo') || '系統設定'}</div>
// //               </div>
// //               <div className="personal-row">
// //                 <div className="personal-label">{t('personalData.account') || '帳號'}</div>
// //                 <div className="personal-value">{formData.account}</div>
// //               </div>
// //               <div className="personal-row">
// //                 <div className="personal-label">{t('personalData.password') || '密碼'}</div>
// //                 <div className="personal-value">
// //                   <button className="personal-reset-password-btn" onClick={handleResetPassword}>
// //                     {t('personalData.resetPassword') || '重設密碼'}
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* 退休金提撥比率選擇器 */}
// //         {showPensionSelector && (
// //           <div className="personal-pension-selector-container" ref={pensionSelectorRef}>
// //             {pensionOptions.map((option) => (
// //               <div 
// //                 key={option.value}
// //                 className={`personal-pension-option ${formData.pensionContribution === option.value ? 'personal-selected-pension' : ''}`}
// //                 onClick={() => handlePensionSelect(option.value)}
// //               >
// //                 {option.label}
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default PersonalData;
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useEmployee } from '../contexts/EmployeeContext';
// import { useFlutterIntegration } from './Hook/hooks'; // Flutter 整合
// import { useLanguage } from './Hook/useLanguage'; // 語言 hook
// import LanguageSwitch from './components/LanguageSwitch'; // 語言切換組件
// import './PMX_CSS/PersonalDataPMX.css';
// import Cookies from 'js-cookie';

// // 🔥 新增：檢查 PMX 登入狀態的函數
// const checkPMXLoginStatus = async () => {
//   try {
//     console.log('正在檢查 PMX 登入狀態...');
    
//     const response = await fetch('https://rabbit.54ucl.com:3004/pmx/employee/check-session', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       credentials: 'include', // 🔥 發送 HTTP-only cookies
//     });
    
//     const result = await response.json();
//     console.log('登入狀態檢查結果:', result);
    
//     return result;
//   } catch (error) {
//     console.error('檢查登入狀態失敗:', error);
//     return {
//       Status: "Failed",
//       Msg: "檢查登入狀態失敗",
//       Data: { is_authenticated: false }
//     };
//   }
// };

// // 🔥 修正：查詢 PMX 員工資料的函數 - 加上 credentials
// const fetchPMXEmployeeInfoByLogin = async (companyId, employeeId) => {
//   try {
//     console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
    
//     // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
//     const response = await fetch(`https://rabbit.54ucl.com:3004/pmx/employee/${employeeId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
//     });
    
//     if (!response.ok) {
//       // 🔥 提供更詳細的錯誤資訊
//       const errorText = await response.text();
//       console.error(`API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
//       throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
//     }
    
//     const result = await response.json();
//     console.log('PMX API 完整回應:', result);
    
//     if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
//       // 🔥 處理多筆資料：提取基本資料和訓練記錄
//       const allRecords = Array.isArray(result.Data) ? result.Data : [result.Data];
      
//       // 🔥 從第一筆記錄中提取基本員工資料
//       const basicEmployeeData = allRecords[0];
      
//       // 🔥 提取所有訓練記錄
//       const trainingRecords = allRecords.map((record, index) => ({
//         id: index + 1,
//         item_number: record.item_number,
//         course_name: record.course_name,
//         completion_date: record.completion_date,
//         retraining_date: record.retraining_date,
//         scheduled_retraining_date: record.scheduled_retraining_date,
//         training_record: record.training_record
//       }));
      
//       console.log('基本員工資料:', basicEmployeeData);
//       console.log('訓練記錄:', trainingRecords);
      
//       // 🔥 返回結構化的資料
//       return {
//         Status: "Ok",
//         Data: [{
//           ...basicEmployeeData,
//           training_records: trainingRecords // 🔥 添加訓練記錄
//         }]
//       };
//     }
    
//     return result;
//   } catch (error) {
//     console.error('查詢 PMX 員工資料失敗:', error);
//     throw error;
//   }
// };

// // 🔥 修正：更新員工資料的函數 - 加上 credentials
// const updatePMXEmployeeInfo = async (id, updateData) => {
//   try {
//     console.log(`正在更新 PMX 員工資料 - ID: ${id}`, updateData);
    
//     // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
//     const response = await fetch(`https://rabbit.54ucl.com:3004/api/pmx/employee/update/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
//       body: JSON.stringify(updateData)
//     });
    
//     if (!response.ok) {
//       // 🔥 提供更詳細的錯誤資訊
//       const errorText = await response.text();
//       console.error(`更新 API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
//       throw new Error(`更新請求失敗: ${response.status} - ${errorText}`);
//     }
    
//     const result = await response.json();
//     console.log('更新 PMX API 回應:', result);
//     return result;
//   } catch (error) {
//     console.error('更新 PMX 員工資料失敗:', error);
//     throw error;
//   }
// };

// function PersonalData() {
//   // 🔥 修改：添加語言 hook
//   const { t, currentLanguage } = useLanguage();
  
//   // Flutter 整合 hook
//   const { isFlutterEnvironment } = useFlutterIntegration('home');
  
//   // 🔥 新增：訓練記錄相關狀態
//   const [trainingRecords, setTrainingRecords] = useState([]);
//   const [showTrainingRecords, setShowTrainingRecords] = useState(false);
  
//   // 原有狀態保持不變...
//   const [currentTime, setCurrentTime] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showGenderSelector, setShowGenderSelector] = useState(false);
//   const [showYearSelector, setShowYearSelector] = useState(false);
//   const [showPensionSelector, setShowPensionSelector] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // 新增狀態來儲存從 cookies 獲取的資料
//   const [companyId, setCompanyId] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
  
//   // 新增狀態來儲存員工資料的 ID（用於更新）
//   const [employeeDataId, setEmployeeDataId] = useState(null);
  
//   const datePickerRef = useRef(null);
//   const genderSelectorRef = useRef(null);
//   const yearSelectorRef = useRef(null);
//   const pensionSelectorRef = useRef(null);
//   const navigate = useNavigate();

//   // 其他狀態保持不變...
//   const [isEditingHealthInsurance, setIsEditingHealthInsurance] = useState(false);
//   const [selectedDependents, setSelectedDependents] = useState([]);
//   const [dependents, setDependents] = useState([
//     {
//       id: 1,
//       name: '朱大豬',
//       birthDate: '民062年12月26日',
//       idNumber: 'A123456789',
//       relation: '3子女'
//     },
//     {
//       id: 2,
//       name: '朱二豬',
//       birthDate: '民062年12月26日',
//       idNumber: 'A123456789',
//       relation: '3子女'
//     },
//     {
//       id: 3,
//       name: '朱三豬',
//       birthDate: '民062年12月26日',
//       idNumber: 'A123456789',
//       relation: '3子女'
//     }
//   ]);

//   // 從 context 取得公司和員工ID（作為備用）
//   const { companyId: contextCompanyId, employeeId: contextEmployeeId } = useEmployee();

//   // 退休金提撥比率選項
//   const pensionOptions = [
//     { value: '6%', label: '6%' },
//     { value: '5%', label: '5%' },
//     { value: '4%', label: '4%' },
//     { value: '3%', label: '3%' },
//     { value: '2%', label: '2%' },
//     { value: '1%', label: '1%' },
//     { value: '0%', label: '0%' }
//   ];

//   // 🔥 修改：性別選項 - 使用翻譯
//   const genderOptions = [
//     { value: '男', label: t('personalData.genderOptions.male') || '男' },
//     { value: '女', label: t('personalData.genderOptions.female') || '女' },
//     { value: '非二元性別', label: t('personalData.genderOptions.nonBinary') || '非二元性別' }
//   ];

//   // 🔥 修改：個人資料狀態 - 包含新增欄位
//   const [formData, setFormData] = useState({
//     // 基本個人資料
//     employeeId: '',
//     name: '',
//     gender: '',
//     passportEnglishName: '',
//     nationality: '',
//     idNumber: '',
//     residencePermitNumber: '',
//     birthDate: '',
//     age113: '', // 🔥 新增：113年度年齡
//     age114: '', // 🔥 新增：114年度年齡
//     address: '',
//     homePhone: '',
//     mobilePhone: '',
//     companyPhone: '',
//     hireDate: '',
//     yearsOfService113: '',
//     annualLeaveHours: '',
//     annualLeaveExpiry: '',
//     resignationDate: '',
//     bloodType: '',
//     highestEducation: '',
//     schoolDepartment: '',
//     personalEmail: '',
//     companyEmail: '',
//     department: '',
//     position: '',
//     professionalCertificates: '',
    
//     // 保留原有欄位以保持相容性
//     photo: null,
//     residenceAddress: '',
//     mailingAddress: '',
//     mobile: '',
//     phone: '',
//     shiftSystem: '',
//     identity: '',
//     salaryType: '',
//     jobTitle: '',
//     jobLevel: '',
//     trainingControlDate: '',
//     pensionContribution: '',
//     dependentsInsured: '',
//     account: '',
//     password: '',
//     attachments: []
//   });

//   // 暫存修改前的資料，用於取消操作
//   const [originalData, setOriginalData] = useState({});
  
//   // 當前是否正在編輯退休金
//   const [isEditingPension, setIsEditingPension] = useState(false);

//   // 🔥 修改：多語言欄位對應表
//   const fieldLabels = {
//     employeeId: t('personalData.fields.employeeId') || '職編',
//     name: t('personalData.fields.name') || '中文名字',
//     gender: t('personalData.fields.gender') || '性別',
//     passportEnglishName: t('personalData.fields.passportEnglishName') || '護照英文全名',
//     nationality: t('personalData.fields.nationality') || '國籍（具有雙重國籍者請分別列出）',
//     idNumber: t('personalData.fields.idNumber') || '身分證字號',
//     residencePermitNumber: t('personalData.fields.residencePermitNumber') || '居留證號碼',
//     birthDate: t('personalData.fields.birthDate') || '西元出生日期',
//     age113: t('personalData.fields.age113') || '113年度年齡',
//     age114: t('personalData.fields.age114') || '114年度年齡',
//     address: t('personalData.fields.address') || '地址',
//     homePhone: t('personalData.fields.homePhone') || '聯絡方式：市話',
//     mobilePhone: t('personalData.fields.mobilePhone') || '聯絡方式：手機',
//     companyPhone: t('personalData.fields.companyPhone') || '公司手機',
//     hireDate: t('personalData.fields.hireDate') || '到職日',
//     yearsOfService113: t('personalData.fields.yearsOfService113') || '113年資',
//     annualLeaveHours: t('personalData.fields.annualLeaveHours') || '特休時數',
//     annualLeaveExpiry: t('personalData.fields.annualLeaveExpiry') || '特休期限',
//     resignationDate: t('personalData.fields.resignationDate') || '離職日',
//     bloodType: t('personalData.fields.bloodType') || '血型',
//     highestEducation: t('personalData.fields.highestEducation') || '最高學歷',
//     schoolDepartment: t('personalData.fields.schoolDepartment') || '就讀學校/科系',
//     personalEmail: t('personalData.fields.personalEmail') || '個人電子郵件',
//     companyEmail: t('personalData.fields.companyEmail') || '公司配發電子郵件',
//     department: t('personalData.fields.department') || '部門',
//     position: t('personalData.fields.position') || '職稱',
//     professionalCertificates: t('personalData.fields.professionalCertificates') || '專業證照（若有相關資料，請分別列出並備妥電子檔）'
//   };

//   // 🔥 修改：多語言訓練記錄欄位對應
//   const trainingFieldLabels = {
//     item_number: t('personalData.training.itemNumber') || '項次',
//     course_name: t('personalData.training.courseName') || '課程名稱',
//     completion_date: t('personalData.training.completionDate') || '結訓日期',
//     retraining_date: t('personalData.training.retrainingDate') || '回訓日期',
//     scheduled_retraining_date: t('personalData.training.scheduledRetrainingDate') || '應回訓日期',
//     training_record: t('personalData.training.trainingRecord') || '受訓紀錄'
//   };

//   // 🔥 修改：創建一個函數來渲染有內容的欄位，添加年齡欄位的特殊處理
//   const renderFieldIfExists = (label, value, key = null) => {
//     // 如果值存在且不為空字串，才顯示該欄位
//     if (value && value.toString().trim() !== '') {
//       // 判斷是否為長文字內容
//       const isLongText = value.toString().length > 20;
//       const isAddress = label.includes(t('personalData.fields.address')) || label.includes('地址');
//       const isEmail = label.includes(t('personalData.fields.personalEmail')) || 
//                      label.includes(t('personalData.fields.companyEmail')) || 
//                      label.includes('電子郵件') || label.includes('email');
//       const isCertificates = label.includes(t('personalData.fields.professionalCertificates')) || 
//                             label.includes('證照');
//       const isAge = label.includes(t('personalData.fields.age113')) || 
//                    label.includes(t('personalData.fields.age114')) || 
//                    label.includes('年度年齡');
      
//       // 為特殊內容添加CSS類
//       let valueClass = 'personal-value';
//       if (isLongText) valueClass += ' long-text';
//       if (isAddress) valueClass += ' address';
//       if (isEmail) valueClass += ' email';
//       if (isCertificates) valueClass += ' certificates';
//       if (isAge) valueClass += ' age';
      
//       return (
//         <div key={key} className="personal-row">
//           <div className="personal-label">{label}</div>
//           <div className={valueClass}>
//             {isAge ? `${value}${t('personalData.ageUnit') || '歲'}` : value}
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   // 輔助函數保持不變...
//   const mapGender = (gender) => {
//     if (!gender) return '';
//     switch (gender.toLowerCase()) {
//       case 'male':
//       case '男':
//         return t('personalData.genderOptions.male') || '男';
//       case 'female':
//       case '女':
//         return t('personalData.genderOptions.female') || '女';
//       default:
//         return gender;
//     }
//   };

//   const mapPensionContribution = (contribution) => {
//     if (!contribution) return '';
//     const percentage = parseFloat(contribution);
//     if (isNaN(percentage)) return '';
//     return `${Math.round(percentage * 100)}%`;
//   };

//   const mapDependentsInsured = (dependents) => {
//     if (!dependents) return '';
//     return `${dependents}${t('personalData.peopleUnit') || '人'}`;
//   };

//   // 從 cookies 獲取登入資料
//   const getLoginDataFromCookies = () => {
//     try {
//       const cookieCompanyId = Cookies.get('company_id') || 
//                              Cookies.get('companyId') || 
//                              Cookies.get('Company_ID');
      
//       const cookieEmployeeId = Cookies.get('employee_id') || 
//                               Cookies.get('employeeId') || 
//                               Cookies.get('Employee_ID');

//       console.log('從 cookies 獲取的資料:', {
//         company_id: cookieCompanyId,
//         employee_id: cookieEmployeeId
//       });

//       if (!cookieCompanyId || !cookieEmployeeId) {
//         const sessionCompanyId = sessionStorage.getItem('cookie_company_id') || 
//                                  localStorage.getItem('temp_cookie_company_id');
//         const sessionEmployeeId = sessionStorage.getItem('cookie_employee_id') || 
//                                   localStorage.getItem('temp_cookie_employee_id');
        
//         console.log('從 storage 獲取的資料:', {
//           company_id: sessionCompanyId,
//           employee_id: sessionEmployeeId
//         });

//         return {
//           company_id: cookieCompanyId || sessionCompanyId,
//           employee_id: cookieEmployeeId || sessionEmployeeId
//         };
//       }

//       return {
//         company_id: cookieCompanyId,
//         employee_id: cookieEmployeeId
//       };
//     } catch (error) {
//       console.error('從 cookies 獲取資料失敗:', error);
//       return {
//         company_id: null,
//         employee_id: null
//       };
//     }
//   };

//   // 初始化時從 cookies 獲取資料
//   useEffect(() => {
//     console.log('初始化 PersonalData 組件');
    
//     const cookieData = getLoginDataFromCookies();
    
//     const finalCompanyId = cookieData.company_id || contextCompanyId || '';
//     const finalEmployeeId = cookieData.employee_id || contextEmployeeId || '';
    
//     console.log('最終使用的資料:', {
//       company_id: finalCompanyId,
//       employee_id: finalEmployeeId,
//       source: cookieData.company_id ? 'cookies' : (contextCompanyId ? 'context' : 'none')
//     });

//     setCompanyId(finalCompanyId);
//     setEmployeeId(finalEmployeeId);
//   }, [contextCompanyId, contextEmployeeId]);

//   // 點擊外部關閉選擇器
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
//         setShowDatePicker(false);
//         setShowYearSelector(false);
//       }
//       if (genderSelectorRef.current && !genderSelectorRef.current.contains(event.target)) {
//         setShowGenderSelector(false);
//       }
//       if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target)) {
//         setShowYearSelector(false);
//       }
//       if (pensionSelectorRef.current && !pensionSelectorRef.current.contains(event.target)) {
//         setShowPensionSelector(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // 右上角時間
//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const hours = String(now.getHours()).padStart(2, '0');
//       const minutes = String(now.getMinutes()).padStart(2, '0');
//       setCurrentTime(`${hours}:${minutes}`);
//     };
//     updateClock();
//     const timer = setInterval(updateClock, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // 🔥 修改：使用新的 PMX API 函數獲取完整員工資料，並加入登入狀態檢查
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       if (!employeeId) {
//         console.log('缺少員工ID:', { employeeId });
//         setError(t('personalData.pleaseLogin') || '請先登入以查看個人資料');
//         return;
//       }

//       setLoading(true);
//       setError('');

//       try {
//         console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
        
//         // 🔥 首先檢查登入狀態
//         const loginStatus = await checkPMXLoginStatus();
        
//         if (loginStatus.Status !== "Ok" || !loginStatus.Data?.is_authenticated) {
//           console.error('登入狀態無效:', loginStatus);
//           setError(t('personalData.sessionExpired') || '登入狀態已過期，請重新登入');
//           // 🔥 可以選擇重定向到登入頁面
//           setTimeout(() => {
//             navigate('/apploginpmx');
//           }, 2000);
//           return;
//         }
        
//         console.log('登入狀態有效，繼續查詢員工資料...');
        
//         // 🔥 使用修改後的 fetchPMXEmployeeInfo 函數
//         const result = await fetchPMXEmployeeInfoByLogin(companyId, employeeId);
//         console.log('PMX API 回傳結果:', result);
        
//         if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
//           // 取第一筆資料（基本員工資料）
//           const employeeData = result.Data[0];
//           console.log('PMX API 回傳的員工資料:', employeeData);
          
//           // 儲存資料 ID 用於後續更新
//           setEmployeeDataId(employeeData.id);
          
//           // 🔥 設置訓練記錄
//           if (employeeData.training_records && employeeData.training_records.length > 0) {
//             setTrainingRecords(employeeData.training_records);
//             console.log('設置訓練記錄:', employeeData.training_records);
//           } else {
//             setTrainingRecords([]);
//             console.log('無訓練記錄');
//           }
          
//           // 🔥 處理 department_position 分割
//           const departmentPosition = employeeData.department_position || '';
//           let departmentName = '';
//           let positionName = '';
          
//           if (departmentPosition.includes('/')) {
//             const parts = departmentPosition.split('/');
//             departmentName = parts[0].trim();
//             positionName = parts[1].trim();
//           } else {
//             departmentName = departmentPosition;
//             positionName = departmentPosition;
//           }
          
//           // 🔥 修改：將 PMX API 回傳的所有資料對應到表單欄位
//           const mappedData = {
//             // 基本個人資料
//             employeeId: employeeData.employee_id || '',
//             name: employeeData.name || '',
//             gender: mapGender(employeeData.gender),
//             passportEnglishName: employeeData.passport_english_name || '',
//             nationality: employeeData.nationality || '',
//             idNumber: employeeData.id_card_number || '',
//             residencePermitNumber: employeeData.residence_permit_number || '',
//             birthDate: employeeData.birth_date || '',
//             age113: employeeData.age_113 || '', // 🔥 新增：對應到 age_113 欄位
//             age114: employeeData.age_114 || '', // 🔥 新增：對應到 age_114 欄位
//             address: employeeData.address || '',
//             homePhone: employeeData.home_phone || '',
//             mobilePhone: employeeData.mobile_phone || '',
//             companyPhone: employeeData.company_phone || '',
//             hireDate: employeeData.hire_date || '',
//             yearsOfService113: employeeData.years_of_service_113 || '',
//             annualLeaveHours: employeeData.annual_leave_hours || '',
//             annualLeaveExpiry: employeeData.annual_leave_expiry || '',
//             resignationDate: employeeData.resignation_date || '',
//             bloodType: employeeData.blood_type || '',
//             highestEducation: employeeData.highest_education || '',
//             schoolDepartment: employeeData.school_department || '',
//             personalEmail: employeeData.personal_email || '',
//             companyEmail: employeeData.company_email || '',
//             department: departmentName,
//             position: positionName,
//             professionalCertificates: employeeData.professional_certificates || '',
            
//             // 保留原有欄位以保持相容性
//             residenceAddress: employeeData.address || '',
//             mailingAddress: employeeData.address || '',
//             mobile: employeeData.mobile_phone || '',
//             phone: employeeData.home_phone || '',
//             jobTitle: positionName,
//             account: employeeData.employee_id ? employeeData.employee_id.toString() : '',
//             password: '••••••••',
            
//             // 其他欄位
//             shiftSystem: '',
//             identity: '',
//             salaryType: '',
//             jobLevel: '',
//             trainingControlDate: '',
//             pensionContribution: '',
//             dependentsInsured: '',
//             photo: null,
//             attachments: []
//           };

//           setFormData(mappedData);
//           console.log('已設定 PMX 完整表單資料:', mappedData);
          
//         } else {
//           console.error('PMX API 回傳錯誤:', result.Msg || '未知錯誤');
//           setError(result.Msg || t('personalData.fetchDataFailed') || '查詢員工資料失敗');
//         }
        
//       } catch (error) {
//         console.error('PMX API 請求失敗:', error);
        
//         // 🔥 更詳細的錯誤處理
//         if (error.message.includes('401')) {
//           setError(t('personalData.sessionExpired') || '登入狀態已過期，請重新登入');
//           setTimeout(() => {
//             navigate('/apploginpmx');
//           }, 2000);
//         } else {
//           setError(`${t('personalData.networkError') || '網路連線錯誤'}: ${error.message}`);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (employeeId) {
//       fetchEmployeeData();
//     }
//   }, [employeeId, t, navigate, companyId]);

//   // 其他處理函數保持不變...
//   const handleHomeClick = () => {
//     navigate('/frontpagepmx');
//   };

//   const handleEdit = () => {
//     setOriginalData({...formData});
//     setIsEditing(true);
//     setErrors({});
//   };

//   const handleCancel = () => {
//     setFormData(originalData);
//     setIsEditing(false);
//     setIsEditingPension(false);
//     setIsEditingHealthInsurance(false);
//     setErrors({});
//   };

//   const validateMobile = (mobile) => {
//     const regex = /^09\d{8}$/;
//     return regex.test(mobile);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!validateMobile(formData.mobile)) {
//       newErrors.mobile = t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // 🔥 修改：提交函數，包含新欄位
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         setLoading(true);
//         console.log('提交的數據:', formData);
        
//         // 準備更新資料 - 根據 PMX API 的欄位格式
//         const updateData = {
//           address: formData.residenceAddress,
//           mobile_phone: formData.mobile,
//           home_phone: formData.phone,
//           age_113: formData.age113, // 🔥 新增
//           age_114: formData.age114, // 🔥 新增
//         };

//         // 呼叫更新 API
//         if (employeeDataId) {
//           const result = await updatePMXEmployeeInfo(employeeDataId, updateData);
          
//           if (result.Status === "Ok") {
//             setIsEditing(false);
//             setIsEditingPension(false);
//             setIsEditingHealthInsurance(false);
//             alert(t('personalData.updateSuccess') || '資料更新成功！');
//           } else {
//             throw new Error(result.Msg || '更新失敗');
//           }
//         } else {
//           throw new Error('缺少員工資料 ID');
//         }
        
//       } catch (error) {
//         console.error('更新 PMX 資料失敗:', error);
        
//         // 🔥 更詳細的錯誤處理
//         if (error.message.includes('401')) {
//           setError(t('personalData.sessionExpired') || '登入狀態已過期，請重新登入');
//           setTimeout(() => {
//             navigate('/apploginpmx');
//           }, 2000);
//         } else {
//           setError(t('personalData.updateFailed') || '更新資料失敗，請稍後再試');
//           alert(`${t('personalData.updateFailed') || '更新失敗'}: ${error.message}`);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // 其他處理函數保持不變...
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//     if (name === 'mobile') {
//       if (!validateMobile(value)) {
//         setErrors({...errors, mobile: t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字'});
//       } else {
//         const newErrors = {...errors};
//         delete newErrors.mobile;
//         setErrors(newErrors);
//       }
//     }
//   };

//   const handlePensionEdit = () => {
//     setOriginalData({...formData});
//     setIsEditingPension(true);
//     setErrors({});
//   };

//   const handlePensionSelect = (value) => {
//     setFormData({
//       ...formData,
//       pensionContribution: value
//     });
//     setShowPensionSelector(false);
//   };

//   const handlePensionClick = () => {
//     setShowPensionSelector(true);
//   };

//   const handleHealthInsuranceEdit = () => {
//     setOriginalData({...formData});
//     setIsEditingHealthInsurance(true);
//     setSelectedDependents([1, 2, 3]);
//   };

//   const handleDependentSelect = (id) => {
//     if (selectedDependents.includes(id)) {
//       setSelectedDependents(selectedDependents.filter(depId => depId !== id));
//     } else {
//       setSelectedDependents([...selectedDependents, id]);
//     }
//   };

//   const handleAddNewDependent = () => {
//     console.log('新增眷屬');
//   };

//   const handleHealthInsuranceSubmit = () => {
//     console.log('提交選中的眷屬:', selectedDependents);
//     setFormData({
//       ...formData,
//       dependentsInsured: `${selectedDependents.length}${t('personalData.peopleUnit') || '人'}`
//     });
//     setIsEditingHealthInsurance(false);
//   };

//   const handleResetPassword = () => {
//     console.log('重設密碼');
//     alert(t('personalData.resetPasswordInDevelopment') || '密碼重設功能開發中...');
//   };

//   // 如果正在載入，顯示載入畫面
//   if (loading) {
//     return (
//       <div className="personal-container">
//         <div className="personal-app-wrapper">
//           <header className="personal-header">
//             <div className="personal-home-icon" onClick={handleHomeClick}>
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//                   stroke="white"
//                   strokeWidth="2"
//                   fill="none"
//                 />
//                 <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//               </svg>
//             </div>
//             <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
//             <div className="personal-header-right">
//               <LanguageSwitch 
//                 className="personal-page-language-switch"
//                 position="relative"
//               />
//             </div>
//           </header>
//           <div className="personal-loading">
//             <div className="personal-loading-spinner"></div>
//             <div>{t('personalData.loading') || '載入中...'}</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 如果有錯誤，顯示錯誤訊息
//   if (error) {
//     return (
//       <div className="personal-container">
//         <div className="personal-app-wrapper">
//           <header className="personal-header">
//             <div className="personal-home-icon" onClick={handleHomeClick}>
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//                   stroke="white"
//                   strokeWidth="2"
//                   fill="none"
//                 />
//                 <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//               </svg>
//             </div>
//             <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
//             <div className="personal-header-right">
//               <LanguageSwitch 
//                 className="personal-page-language-switch"
//                 position="relative"
//               />
//             </div>
//           </header>
//           <div className="personal-error">
//             <div>{t('personalData.loadFailed') || '載入失敗'}</div>
//             <div className="personal-error-message">{error}</div>
//             <div className="personal-debug-info">
//               Debug 資訊: 公司ID={companyId || '無'}, 員工ID={employeeId || '無'}
//             </div>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="personal-reload-button"
//             >
//               {t('personalData.reload') || '重新載入'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="personal-container">
//       <div className="personal-app-wrapper">
//         <header className="personal-header">
//           <div className="personal-home-icon" onClick={handleHomeClick}>
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//                 stroke="white"
//                 strokeWidth="2"
//                 fill="none"
//               />
//               <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//             </svg>
//           </div>
//           <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
//           <div className="personal-header-right">
//             <LanguageSwitch 
//               className="personal-page-language-switch"
//               position="relative"
//             />
//           </div>
//         </header>

//         {/* 🔥 修改：顯示訓練記錄的完整視圖 */}
//         {showTrainingRecords ? (
//           <div className="personal-training-records-view">
//             <div className="personal-training-header">
//               <button 
//                 className="personal-back-button"
//                 onClick={() => setShowTrainingRecords(false)}
//               >
//                 ← {t('common.back') || '返回'}
//               </button>
//               <h2>{t('personalData.trainingRecords') || '訓練記錄'}</h2>
//             </div>
            
//             <div className="personal-training-content">
//               {trainingRecords.length > 0 ? (
//                 <div className="personal-training-table">
//                   <div className="personal-training-table-header">
//                     {Object.values(trainingFieldLabels).map((label, index) => (
//                       <div key={index} className="personal-training-cell header-cell">
//                         {label}
//                       </div>
//                     ))}
//                   </div>
                  
//                   {trainingRecords.map((record, index) => (
//                     <div key={record.id || index} className="personal-training-table-row">
//                       {Object.entries(trainingFieldLabels).map(([key, label]) => (
//                         <div 
//                           key={key} 
//                           className="personal-training-cell"
//                           data-label={label}
//                         >
//                           {record[key] || t('personalData.noData') || '無'}
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="personal-no-training-records">
//                   {t('personalData.noTrainingRecords') || '暫無訓練記錄'}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : isEditingHealthInsurance ? (
//           // 🔥 修改：健保眷屬編輯視圖
//           <div className="personal-editing-content">
//             <div className="personal-editing-header">
//               <h2>{t('personalData.editHealthInsurance') || '編輯健保眷屬'}</h2>
//               <div className="personal-editing-actions">
//                 <button onClick={handleCancel} className="personal-cancel-btn">
//                   {t('personalData.cancel') || '取消'}
//                 </button>
//                 <button onClick={handleHealthInsuranceSubmit} className="personal-submit-btn">
//                   {t('personalData.save') || '儲存'}
//                 </button>
//               </div>
//             </div>
            
//             <div className="personal-dependents-list">
//               {dependents.map((dependent) => (
//                 <div key={dependent.id} className="personal-dependent-item">
//                   <input
//                     type="checkbox"
//                     checked={selectedDependents.includes(dependent.id)}
//                     onChange={() => handleDependentSelect(dependent.id)}
//                   />
//                   <div className="personal-dependent-info">
//                     <div className="personal-dependent-name">{dependent.name}</div>
//                     <div className="personal-dependent-details">
//                       {dependent.birthDate} | {dependent.idNumber} | {dependent.relation}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <button onClick={handleAddNewDependent} className="personal-add-dependent-btn">
//               + {t('personalData.addNewDependent') || '新增眷屬'}
//             </button>
//           </div>
//         ) : isEditingPension ? (
//           // 🔥 修改：退休金編輯視圖
//           <div className="personal-editing-content">
//             <div className="personal-editing-header">
//               <h2>{t('personalData.editPension') || '編輯退休金提撥'}</h2>
//               <div className="personal-editing-actions">
//                 <button onClick={handleCancel} className="personal-cancel-btn">
//                   {t('personalData.cancel') || '取消'}
//                 </button>
//                 <button onClick={handleSubmit} className="personal-submit-btn">
//                   {t('personalData.save') || '儲存'}
//                 </button>
//               </div>
//             </div>
            
//             <div className="personal-pension-editing">
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.pensionContribution') || '退休金提撥比率'}</div>
//                 <div className="personal-value">
//                   <div 
//                     className="personal-pension-selector" 
//                     onClick={handlePensionClick}
//                     ref={pensionSelectorRef}
//                   >
//                     {formData.pensionContribution || t('personalData.selectPension') || '請選擇提撥比率'}
//                     <span className="personal-dropdown-arrow">▼</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : isEditing ? (
//           // 🔥 修改：基本資料編輯視圖
//           <div className="personal-editing-content">
//             <div className="personal-editing-header">
//               <h2>{t('personalData.editBasicInfo') || '編輯基本資料'}</h2>
//               <div className="personal-editing-actions">
//                 <button onClick={handleCancel} className="personal-cancel-btn">
//                   {t('personalData.cancel') || '取消'}
//                 </button>
//                 <button onClick={handleSubmit} className="personal-submit-btn">
//                   {loading ? (t('personalData.saving') || '儲存中...') : (t('personalData.save') || '儲存')}
//                 </button>
//               </div>
//             </div>
            
//             <div className="personal-editing-form">
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.residenceAddress') || '居住地址'}</div>
//                 <div className="personal-value">
//                   <input
//                     type="text"
//                     name="residenceAddress"
//                     value={formData.residenceAddress}
//                     onChange={handleInputChange}
//                     className="personal-input"
//                   />
//                 </div>
//               </div>
              
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.mobile') || '手機號碼'}</div>
//                 <div className="personal-value">
//                   <input
//                     type="text"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleInputChange}
//                     className={`personal-input ${errors.mobile ? 'personal-input-error' : ''}`}
//                   />
//                   {errors.mobile && (
//                     <div className="personal-error-text">{errors.mobile}</div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.phone') || '市話'}</div>
//                 <div className="personal-value">
//                   <input
//                     type="text"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="personal-input"
//                   />
//                 </div>
//               </div>

//               {/* 🔥 新增：年齡欄位編輯 */}
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.fields.age113') || '113年度年齡'}</div>
//                 <div className="personal-value">
//                   <input
//                     type="number"
//                     name="age113"
//                     value={formData.age113}
//                     onChange={handleInputChange}
//                     className="personal-input"
//                     min="0"
//                     max="150"
//                     placeholder={t('personalData.ageInputPlaceholder') || '請輸入年齡'}
//                   />
//                 </div>
//               </div>

//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.fields.age114') || '114年度年齡'}</div>
//                 <div className="personal-value">
//                   <input
//                     type="number"
//                     name="age114"
//                     value={formData.age114}
//                     onChange={handleInputChange}
//                     className="personal-input"
//                     min="0"
//                     max="150"
//                     placeholder={t('personalData.ageInputPlaceholder') || '請輸入年齡'}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // 🔥 修改：主要個人資料視圖
//           <div className="personal-content">
//             {/* 🔥 完整個人資料區塊 */}
//             <div className="personal-section">
//               <div className="personal-section-header">
//                 <div className="personal-section-title">
//                   {t('personalData.completePersonalData') || '完整個人資料'}
//                 </div>
//                 <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handleEdit(); }}>
//                   {t('personalData.edit') || '修改'}
//                 </a>
//               </div>
              
//               {/* 🔥 只顯示有內容的欄位 */}
//               {Object.entries(fieldLabels).map(([key, label]) => 
//                 renderFieldIfExists(label, formData[key], key)
//               ).filter(Boolean)}
//             </div>

//             {/* 🔥 訓練記錄區塊 */}
//             <div className="personal-section">
//               <div className="personal-section-header">
//                 <div className="personal-section-title">
//                   {t('personalData.trainingRecords') || '訓練記錄'}
//                 </div>
//                 {trainingRecords.length > 0 && (
//                   <a 
//                     href="#" 
//                     className="personal-edit-link" 
//                     onClick={(e) => { 
//                       e.preventDefault(); 
//                       setShowTrainingRecords(true); 
//                     }}
//                   >
//                     {t('personalData.viewAll') || '查看全部'} ({trainingRecords.length})
//                   </a>
//                 )}
//               </div>
              
//               {trainingRecords.length > 0 ? (
//                 <>
//                   {/* 顯示前3筆訓練記錄 */}
//                   {trainingRecords.slice(0, 3).map((record, index) => (
//                     <div key={record.id || index} className="personal-training-summary">
//                       {renderFieldIfExists(trainingFieldLabels.item_number, record.item_number, `${index}-item_number`)}
//                       {renderFieldIfExists(trainingFieldLabels.course_name, record.course_name, `${index}-course_name`)}
//                       {renderFieldIfExists(trainingFieldLabels.completion_date, record.completion_date, `${index}-completion_date`)}
//                       {renderFieldIfExists(trainingFieldLabels.retraining_date, record.retraining_date, `${index}-retraining_date`)}
//                       {renderFieldIfExists(trainingFieldLabels.scheduled_retraining_date, record.scheduled_retraining_date, `${index}-scheduled_retraining_date`)}
//                       {renderFieldIfExists(trainingFieldLabels.training_record, record.training_record, `${index}-training_record`)}
                      
//                       {index < 2 && trainingRecords.length > 1 && (
//                         <div className="personal-training-divider"></div>
//                       )}
//                     </div>
//                   ))}
                  
//                   {trainingRecords.length > 3 && (
//                     <div className="personal-row">
//                       <div className="personal-label"></div>
//                       <div className="personal-value personal-more-records">
//                         {t('personalData.moreRecords', { count: trainingRecords.length - 3 }) || 
//                          `還有 ${trainingRecords.length - 3} 筆記錄...`}
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="personal-row">
//                   <div className="personal-label">{t('personalData.trainingRecords') || '訓練記錄'}</div>
//                   <div className="personal-value">{t('personalData.noRecords') || '暫無記錄'}</div>
//                 </div>
//               )}
//             </div>

//             {/* 🔥 修改：系統設定區塊 */}
//             <div className="personal-section">
//               <div className="personal-section-header">
//                 <div className="personal-section-title">{t('personalData.accountInfo') || '系統設定'}</div>
//               </div>
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.account') || '帳號'}</div>
//                 <div className="personal-value">{formData.account}</div>
//               </div>
//               <div className="personal-row">
//                 <div className="personal-label">{t('personalData.password') || '密碼'}</div>
//                 <div className="personal-value">
//                   <button className="personal-reset-password-btn" onClick={handleResetPassword}>
//                     {t('personalData.resetPassword') || '重設密碼'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 退休金提撥比率選擇器 */}
//         {showPensionSelector && (
//           <div className="personal-pension-selector-container" ref={pensionSelectorRef}>
//             {pensionOptions.map((option) => (
//               <div 
//                 key={option.value}
//                 className={`personal-pension-option ${formData.pensionContribution === option.value ? 'personal-selected-pension' : ''}`}
//                 onClick={() => handlePensionSelect(option.value)}
//               >
//                 {option.label}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PersonalData;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';
import { useFlutterIntegration } from './Hook/hooks'; // Flutter 整合
import { useLanguage } from './Hook/useLanguage'; // 語言 hook
import LanguageSwitch from './components/LanguageSwitch'; // 語言切換組件
import './PMX_CSS/PersonalDataPMX.css';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config';

// 🔥 新增：檢查 PMX 登入狀態的函數
const checkPMXLoginStatus = async () => {
  try {
    console.log('正在檢查 PMX 登入狀態...');
    
    const response = await fetch(`${API_BASE_URL}/api/pmx/employee/check-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // 🔥 發送 HTTP-only cookies
    });
    
    const result = await response.json();
    console.log('登入狀態檢查結果:', result);
    
    return result;
  } catch (error) {
    console.error('檢查登入狀態失敗:', error);
    return {
      Status: "Failed",
      Msg: "檢查登入狀態失敗",
      Data: { is_authenticated: false }
    };
  }
};

// 🔥 修正：查詢 PMX 員工資料的函數 - 加上 credentials
const fetchPMXEmployeeInfoByLogin = async (companyId, employeeId) => {
  try {
    console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
    
    // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
    const response = await fetch(`${API_BASE_URL}/api/pmx/employee/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
    });
    
    if (!response.ok) {
      // 🔥 提供更詳細的錯誤資訊
      const errorText = await response.text();
      console.error(`API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
      throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('PMX API 完整回應:', result);
    
    if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
      // 🔥 處理多筆資料：提取基本資料和訓練記錄
      const allRecords = Array.isArray(result.Data) ? result.Data : [result.Data];
      
      // 🔥 從第一筆記錄中提取基本員工資料
      const basicEmployeeData = allRecords[0];
      
      // 🔥 提取所有訓練記錄
      const trainingRecords = allRecords.map((record, index) => ({
        id: index + 1,
        item_number: record.item_number,
        course_name: record.course_name,
        completion_date: record.completion_date,
        retraining_date: record.retraining_date,
        scheduled_retraining_date: record.scheduled_retraining_date,
        training_record: record.training_record
      }));
      
      console.log('基本員工資料:', basicEmployeeData);
      console.log('訓練記錄:', trainingRecords);
      
      // 🔥 返回結構化的資料
      return {
        Status: "Ok",
        Data: [{
          ...basicEmployeeData,
          training_records: trainingRecords // 🔥 添加訓練記錄
        }]
      };
    }
    
    return result;
  } catch (error) {
    console.error('查詢 PMX 員工資料失敗:', error);
    throw error;
  }
};

// 🔥 修正：更新員工資料的函數 - 加上 credentials
const updatePMXEmployeeInfo = async (id, updateData) => {
  try {
    console.log(`正在更新 PMX 員工資料 - ID: ${id}`, updateData);
    
    // 🔥 重要：加上 credentials: 'include' 來發送 HTTP-only cookies
    const response = await fetch(`${API_BASE_URL}/api/pmx/employee/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // 🔥 這是關鍵！確保發送 HTTP-only cookies
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      // 🔥 提供更詳細的錯誤資訊
      const errorText = await response.text();
      console.error(`更新 API 請求失敗 - 狀態: ${response.status}, 回應: ${errorText}`);
      throw new Error(`更新請求失敗: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('更新 PMX API 回應:', result);
    return result;
  } catch (error) {
    console.error('更新 PMX 員工資料失敗:', error);
    throw error;
  }
};

function PersonalData() {
  // 🔥 修改：添加語言 hook
  const { t, currentLanguage } = useLanguage();
  
  // Flutter 整合 hook
  const { isFlutterEnvironment } = useFlutterIntegration('home');
  
  // 🔥 新增：訓練記錄相關狀態
  const [trainingRecords, setTrainingRecords] = useState([]);
  const [showTrainingRecords, setShowTrainingRecords] = useState(false);
  
  // 原有狀態保持不變...
  const [currentTime, setCurrentTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderSelector, setShowGenderSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showPensionSelector, setShowPensionSelector] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 新增狀態來儲存從 cookies 獲取的資料
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  // 新增狀態來儲存員工資料的 ID（用於更新）
  const [employeeDataId, setEmployeeDataId] = useState(null);
  
  const datePickerRef = useRef(null);
  const genderSelectorRef = useRef(null);
  const yearSelectorRef = useRef(null);
  const pensionSelectorRef = useRef(null);
  const navigate = useNavigate();

  // 其他狀態保持不變...
  const [isEditingHealthInsurance, setIsEditingHealthInsurance] = useState(false);
  const [selectedDependents, setSelectedDependents] = useState([]);
  const [dependents, setDependents] = useState([
    {
      id: 1,
      name: '朱大豬',
      birthDate: '民062年12月26日',
      idNumber: 'A123456789',
      relation: '3子女'
    },
    {
      id: 2,
      name: '朱二豬',
      birthDate: '民062年12月26日',
      idNumber: 'A123456789',
      relation: '3子女'
    },
    {
      id: 3,
      name: '朱三豬',
      birthDate: '民062年12月26日',
      idNumber: 'A123456789',
      relation: '3子女'
    }
  ]);

  // 從 context 取得公司和員工ID（作為備用）
  const { companyId: contextCompanyId, employeeId: contextEmployeeId } = useEmployee();

  // 退休金提撥比率選項
  const pensionOptions = [
    { value: '6%', label: '6%' },
    { value: '5%', label: '5%' },
    { value: '4%', label: '4%' },
    { value: '3%', label: '3%' },
    { value: '2%', label: '2%' },
    { value: '1%', label: '1%' },
    { value: '0%', label: '0%' }
  ];

  // 🔥 修改：性別選項 - 使用翻譯
  const genderOptions = [
    { value: '男', label: t('personalData.genderOptions.male') || '男' },
    { value: '女', label: t('personalData.genderOptions.female') || '女' },
    { value: '非二元性別', label: t('personalData.genderOptions.nonBinary') || '非二元性別' }
  ];

  // 🔥 修改：個人資料狀態 - 包含新增欄位
  const [formData, setFormData] = useState({
    // 基本個人資料
    employeeId: '',
    name: '',
    gender: '',
    passportEnglishName: '',
    nationality: '',
    idNumber: '',
    residencePermitNumber: '',
    birthDate: '',
    age113: '', // 🔥 新增：113年度年齡
    age114: '', // 🔥 新增：114年度年齡
    address: '',
    homePhone: '',
    mobilePhone: '',
    companyPhone: '',
    hireDate: '',
    yearsOfService113: '',
    annualLeaveHours: '',
    annualLeaveExpiry: '',
    resignationDate: '',
    bloodType: '',
    highestEducation: '',
    schoolDepartment: '',
    personalEmail: '',
    companyEmail: '',
    department: '',
    position: '',
    professionalCertificates: '',
    
    // 保留原有欄位以保持相容性
    photo: null,
    residenceAddress: '',
    mailingAddress: '',
    mobile: '',
    phone: '',
    shiftSystem: '',
    identity: '',
    salaryType: '',
    jobTitle: '',
    jobLevel: '',
    trainingControlDate: '',
    pensionContribution: '',
    dependentsInsured: '',
    account: '',
    password: '',
    attachments: []
  });

  // 暫存修改前的資料，用於取消操作
  const [originalData, setOriginalData] = useState({});
  
  // 當前是否正在編輯退休金
  const [isEditingPension, setIsEditingPension] = useState(false);

  // 🔥 修改：多語言欄位對應表
  const fieldLabels = {
    employeeId: t('personalData.fields.employeeId') || '職編',
    name: t('personalData.fields.name') || '中文名字',
    gender: t('personalData.fields.gender') || '性別',
    passportEnglishName: t('personalData.fields.passportEnglishName') || '護照英文全名',
    nationality: t('personalData.fields.nationality') || '國籍（具有雙重國籍者請分別列出）',
    idNumber: t('personalData.fields.idNumber') || '身分證字號',
    residencePermitNumber: t('personalData.fields.residencePermitNumber') || '居留證號碼',
    birthDate: t('personalData.fields.birthDate') || '西元出生日期',
    age113: t('personalData.fields.age113') || '113年度年齡',
    age114: t('personalData.fields.age114') || '114年度年齡',
    address: t('personalData.fields.address') || '地址',
    homePhone: t('personalData.fields.homePhone') || '聯絡方式：市話',
    mobilePhone: t('personalData.fields.mobilePhone') || '聯絡方式：手機',
    companyPhone: t('personalData.fields.companyPhone') || '公司手機',
    hireDate: t('personalData.fields.hireDate') || '到職日',
    yearsOfService113: t('personalData.fields.yearsOfService113') || '113年資',
    annualLeaveHours: t('personalData.fields.annualLeaveHours') || '特休時數',
    annualLeaveExpiry: t('personalData.fields.annualLeaveExpiry') || '特休期限',
    resignationDate: t('personalData.fields.resignationDate') || '離職日',
    bloodType: t('personalData.fields.bloodType') || '血型',
    highestEducation: t('personalData.fields.highestEducation') || '最高學歷',
    schoolDepartment: t('personalData.fields.schoolDepartment') || '就讀學校/科系',
    personalEmail: t('personalData.fields.personalEmail') || '個人電子郵件',
    companyEmail: t('personalData.fields.companyEmail') || '公司配發電子郵件',
    department: t('personalData.fields.department') || '部門',
    position: t('personalData.fields.position') || '職稱',
    professionalCertificates: t('personalData.fields.professionalCertificates') || '專業證照（若有相關資料，請分別列出並備妥電子檔）'
  };

  // 🔥 修改：多語言訓練記錄欄位對應
  const trainingFieldLabels = {
    item_number: t('personalData.training.itemNumber') || '項次',
    course_name: t('personalData.training.courseName') || '課程名稱',
    completion_date: t('personalData.training.completionDate') || '結訓日期',
    retraining_date: t('personalData.training.retrainingDate') || '回訓日期',
    scheduled_retraining_date: t('personalData.training.scheduledRetrainingDate') || '應回訓日期',
    training_record: t('personalData.training.trainingRecord') || '受訓紀錄'
  };

  // 🔥 修改：創建一個函數來渲染有內容的欄位，添加年齡欄位的特殊處理
  const renderFieldIfExists = (label, value, key = null) => {
    // 如果值存在且不為空字串，才顯示該欄位
    if (value && value.toString().trim() !== '') {
      // 判斷是否為長文字內容
      const isLongText = value.toString().length > 20;
      const isAddress = label.includes(t('personalData.fields.address')) || label.includes('地址');
      const isEmail = label.includes(t('personalData.fields.personalEmail')) || 
                     label.includes(t('personalData.fields.companyEmail')) || 
                     label.includes('電子郵件') || label.includes('email');
      const isCertificates = label.includes(t('personalData.fields.professionalCertificates')) || 
                            label.includes('證照');
      const isAge = label.includes(t('personalData.fields.age113')) || 
                   label.includes(t('personalData.fields.age114')) || 
                   label.includes('年度年齡');
      
      // 為特殊內容添加CSS類
      let valueClass = 'personal-value';
      if (isLongText) valueClass += ' long-text';
      if (isAddress) valueClass += ' address';
      if (isEmail) valueClass += ' email';
      if (isCertificates) valueClass += ' certificates';
      if (isAge) valueClass += ' age';
      
      return (
        <div key={key} className="personal-row">
          <div className="personal-label">{label}</div>
          <div className={valueClass}>
            {isAge ? `${value}${t('personalData.ageUnit') || '歲'}` : value}
          </div>
        </div>
      );
    }
    return null;
  };

  // 輔助函數保持不變...
  const mapGender = (gender) => {
    if (!gender) return '';
    switch (gender.toLowerCase()) {
      case 'male':
      case '男':
        return t('personalData.genderOptions.male') || '男';
      case 'female':
      case '女':
        return t('personalData.genderOptions.female') || '女';
      default:
        return gender;
    }
  };

  const mapPensionContribution = (contribution) => {
    if (!contribution) return '';
    const percentage = parseFloat(contribution);
    if (isNaN(percentage)) return '';
    return `${Math.round(percentage * 100)}%`;
  };

  const mapDependentsInsured = (dependents) => {
    if (!dependents) return '';
    return `${dependents}${t('personalData.peopleUnit') || '人'}`;
  };

  // 從 cookies 獲取登入資料
  const getLoginDataFromCookies = () => {
    try {
      const cookieCompanyId = Cookies.get('company_id') || 
                             Cookies.get('companyId') || 
                             Cookies.get('Company_ID');
      
      const cookieEmployeeId = Cookies.get('employee_id') || 
                              Cookies.get('employeeId') || 
                              Cookies.get('Employee_ID');

      console.log('從 cookies 獲取的資料:', {
        company_id: cookieCompanyId,
        employee_id: cookieEmployeeId
      });

      if (!cookieCompanyId || !cookieEmployeeId) {
        const sessionCompanyId = sessionStorage.getItem('cookie_company_id') || 
                                 localStorage.getItem('temp_cookie_company_id');
        const sessionEmployeeId = sessionStorage.getItem('cookie_employee_id') || 
                                  localStorage.getItem('temp_cookie_employee_id');
        
        console.log('從 storage 獲取的資料:', {
          company_id: sessionCompanyId,
          employee_id: sessionEmployeeId
        });

        return {
          company_id: cookieCompanyId || sessionCompanyId,
          employee_id: cookieEmployeeId || sessionEmployeeId
        };
      }

      return {
        company_id: cookieCompanyId,
        employee_id: cookieEmployeeId
      };
    } catch (error) {
      console.error('從 cookies 獲取資料失敗:', error);
      return {
        company_id: null,
        employee_id: null
      };
    }
  };

  // 初始化時從 cookies 獲取資料
  useEffect(() => {
    console.log('初始化 PersonalData 組件');
    
    const cookieData = getLoginDataFromCookies();
    
    const finalCompanyId = cookieData.company_id || contextCompanyId || '';
    const finalEmployeeId = cookieData.employee_id || contextEmployeeId || '';
    
    console.log('最終使用的資料:', {
      company_id: finalCompanyId,
      employee_id: finalEmployeeId,
      source: cookieData.company_id ? 'cookies' : (contextCompanyId ? 'context' : 'none')
    });

    setCompanyId(finalCompanyId);
    setEmployeeId(finalEmployeeId);
  }, [contextCompanyId, contextEmployeeId]);

  // 點擊外部關閉選擇器
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
        setShowYearSelector(false);
      }
      if (genderSelectorRef.current && !genderSelectorRef.current.contains(event.target)) {
        setShowGenderSelector(false);
      }
      if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target)) {
        setShowYearSelector(false);
      }
      if (pensionSelectorRef.current && !pensionSelectorRef.current.contains(event.target)) {
        setShowPensionSelector(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 修改：使用新的 PMX API 函數獲取完整員工資料，並加入登入狀態檢查
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) {
        console.log('缺少員工ID:', { employeeId });
        setError(t('personalData.pleaseLogin') || '請先登入以查看個人資料');
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log(`正在查詢 PMX 員工資料 - 員工ID: ${employeeId}`);
        
        // 🔥 首先檢查登入狀態
        const loginStatus = await checkPMXLoginStatus();
        
        if (loginStatus.Status !== "Ok" || !loginStatus.Data?.is_authenticated) {
          console.error('登入狀態無效:', loginStatus);
          setError(t('personalData.sessionExpired') || '登入狀態已過期，請重新登入');
          // 🔥 可以選擇重定向到登入頁面
          setTimeout(() => {
            navigate('/apploginpmx');
          }, 2000);
          return;
        }
        
        console.log('登入狀態有效，繼續查詢員工資料...');
        
        // 🔥 使用修改後的 fetchPMXEmployeeInfo 函數
        const result = await fetchPMXEmployeeInfoByLogin(companyId, employeeId);
        console.log('PMX API 回傳結果:', result);
        
        if (result.Status === "Ok" && result.Data && result.Data.length > 0) {
          // 取第一筆資料（基本員工資料）
          const employeeData = result.Data[0];
          console.log('PMX API 回傳的員工資料:', employeeData);
          
          // 儲存資料 ID 用於後續更新
          setEmployeeDataId(employeeData.id);
          
          // 🔥 設置訓練記錄
          if (employeeData.training_records && employeeData.training_records.length > 0) {
            setTrainingRecords(employeeData.training_records);
            console.log('設置訓練記錄:', employeeData.training_records);
          } else {
            setTrainingRecords([]);
            console.log('無訓練記錄');
          }
          
          // 🔥 處理 department_position 分割
          const departmentPosition = employeeData.department_position || '';
          let departmentName = '';
          let positionName = '';
          
          if (departmentPosition.includes('/')) {
            const parts = departmentPosition.split('/');
            departmentName = parts[0].trim();
            positionName = parts[1].trim();
          } else {
            departmentName = departmentPosition;
            positionName = departmentPosition;
          }
          
          // 🔥 修改：將 PMX API 回傳的所有資料對應到表單欄位
          const mappedData = {
            // 基本個人資料
            employeeId: employeeData.employee_id || '',
            name: employeeData.name || '',
            gender: mapGender(employeeData.gender),
            passportEnglishName: employeeData.passport_english_name || '',
            nationality: employeeData.nationality || '',
            idNumber: employeeData.id_card_number || '',
            residencePermitNumber: employeeData.residence_permit_number || '',
            birthDate: employeeData.birth_date || '',
            age113: employeeData.age_113 || '', // 🔥 新增：對應到 age_113 欄位
            age114: employeeData.age_114 || '', // 🔥 新增：對應到 age_114 欄位
            address: employeeData.address || '',
            homePhone: employeeData.home_phone || '',
            mobilePhone: employeeData.mobile_phone || '',
            companyPhone: employeeData.company_phone || '',
            hireDate: employeeData.hire_date || '',
            yearsOfService113: employeeData.years_of_service_113 || '',
            annualLeaveHours: employeeData.annual_leave_hours || '',
            annualLeaveExpiry: employeeData.annual_leave_expiry || '',
            resignationDate: employeeData.resignation_date || '',
            bloodType: employeeData.blood_type || '',
            highestEducation: employeeData.highest_education || '',
            schoolDepartment: employeeData.school_department || '',
            personalEmail: employeeData.personal_email || '',
            companyEmail: employeeData.company_email || '',
            department: departmentName,
            position: positionName,
            professionalCertificates: employeeData.professional_certificates || '',
            
            // 保留原有欄位以保持相容性
            residenceAddress: employeeData.address || '',
            mailingAddress: employeeData.address || '',
            mobile: employeeData.mobile_phone || '',
            phone: employeeData.home_phone || '',
            jobTitle: positionName,
            account: employeeData.employee_id ? employeeData.employee_id.toString() : '',
            password: '••••••••',
            
            // 其他欄位
            shiftSystem: '',
            identity: '',
            salaryType: '',
            jobLevel: '',
            trainingControlDate: '',
            pensionContribution: '',
            dependentsInsured: '',
            photo: null,
            attachments: []
          };

          setFormData(mappedData);
          console.log('已設定 PMX 完整表單資料:', mappedData);
          
        } else {
          console.error('PMX API 回傳錯誤:', result.Msg || '未知錯誤');
          setError(result.Msg || t('personalData.fetchDataFailed') || '查詢員工資料失敗');
        }
        
      } catch (error) {
        console.error('PMX API 請求失敗:', error);
        
        // 🔥 更詳細的錯誤處理
        if (error.message.includes('401')) {
          setError(t('personalData.sessionExpired') || '登入狀態已過期，請重新登入');
          setTimeout(() => {
            navigate('/apploginpmx');
          }, 2000);
        } else {
          setError(`${t('personalData.networkError') || '網路連線錯誤'}: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId, t, navigate, companyId]);

  // 其他處理函數保持不變...
  const handleHomeClick = () => {
    navigate('/frontpagepmx');
  };

  const handleEdit = () => {
    setOriginalData({...formData});
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setIsEditingPension(false);
    setIsEditingHealthInsurance(false);
    setErrors({});
  };

  const validateMobile = (mobile) => {
    const regex = /^09\d{8}$/;
    return regex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateMobile(formData.mobile)) {
      newErrors.mobile = t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 修改：提交函數，包含新欄位
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        console.log('提交的數據:', formData);
        
        // 準備更新資料 - 根據 PMX API 的欄位格式
        const updateData = {
          address: formData.residenceAddress,
          mobile_phone: formData.mobile,
          home_phone: formData.phone,
          age_113: formData.age113, // 🔥 新增
          age_114: formData.age114, // 🔥 新增
        };

        // 呼叫更新 API
        if (employeeDataId) {
          const result = await updatePMXEmployeeInfo(employeeDataId, updateData);
          
          if (result.Status === "Ok") {
            setIsEditing(false);
            setIsEditingPension(false);
            setIsEditingHealthInsurance(false);
            alert(t('personalData.updateSuccess') || '資料更新成功！');
          } else {
            throw new Error(result.Msg || '更新失敗');
          }
        } else {
          throw new Error('缺少員工資料 ID');
        }
        
      } catch (error) {
        console.error('更新 PMX 資料失敗:', error);
        
        // 🔥 更詳細的錯誤處理
        if (error.message.includes('401')) {
          setError(t('personalData.sessionExpired') || '登入狀態已過期，請重新登入');
          setTimeout(() => {
            navigate('/apploginpmx');
          }, 2000);
        } else {
          setError(t('personalData.updateFailed') || '更新資料失敗，請稍後再試');
          alert(`${t('personalData.updateFailed') || '更新失敗'}: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // 其他處理函數保持不變...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'mobile') {
      if (!validateMobile(value)) {
        setErrors({...errors, mobile: t('personalData.mobileValidation') || '手機號碼必須為09開頭，後面跟著8個數字'});
      } else {
        const newErrors = {...errors};
        delete newErrors.mobile;
        setErrors(newErrors);
      }
    }
  };

  const handlePensionEdit = () => {
    setOriginalData({...formData});
    setIsEditingPension(true);
    setErrors({});
  };

  const handlePensionSelect = (value) => {
    setFormData({
      ...formData,
      pensionContribution: value
    });
    setShowPensionSelector(false);
  };

  const handlePensionClick = () => {
    setShowPensionSelector(true);
  };

  const handleHealthInsuranceEdit = () => {
    setOriginalData({...formData});
    setIsEditingHealthInsurance(true);
    setSelectedDependents([1, 2, 3]);
  };

  const handleDependentSelect = (id) => {
    if (selectedDependents.includes(id)) {
      setSelectedDependents(selectedDependents.filter(depId => depId !== id));
    } else {
      setSelectedDependents([...selectedDependents, id]);
    }
  };

  const handleAddNewDependent = () => {
    console.log('新增眷屬');
  };

  const handleHealthInsuranceSubmit = () => {
    console.log('提交選中的眷屬:', selectedDependents);
    setFormData({
      ...formData,
      dependentsInsured: `${selectedDependents.length}${t('personalData.peopleUnit') || '人'}`
    });
    setIsEditingHealthInsurance(false);
  };

  const handleResetPassword = () => {
    console.log('重設密碼');
    alert(t('personalData.resetPasswordInDevelopment') || '密碼重設功能開發中...');
  };

  // 如果正在載入，顯示載入畫面
  if (loading) {
    return (
      <div className="personal-container">
        <div className="personal-app-wrapper">
          <header className="personal-header">
            <div className="personal-home-icon" onClick={handleHomeClick}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
            <div className="personal-header-right">
              <LanguageSwitch 
                className="personal-page-language-switch"
                position="relative"
              />
            </div>
          </header>
          <div className="personal-loading">
            <div className="personal-loading-spinner"></div>
            <div>{t('personalData.loading') || '載入中...'}</div>
          </div>
        </div>
      </div>
    );
  }

  // 如果有錯誤，顯示錯誤訊息
  if (error) {
    return (
      <div className="personal-container">
        <div className="personal-app-wrapper">
          <header className="personal-header">
            <div className="personal-home-icon" onClick={handleHomeClick}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
            <div className="personal-header-right">
              <LanguageSwitch 
                className="personal-page-language-switch"
                position="relative"
              />
            </div>
          </header>
          <div className="personal-error">
            <div>{t('personalData.loadFailed') || '載入失敗'}</div>
            <div className="personal-error-message">{error}</div>
            <div className="personal-debug-info">
              Debug 資訊: 公司ID={companyId || '無'}, 員工ID={employeeId || '無'}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="personal-reload-button"
            >
              {t('personalData.reload') || '重新載入'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-container">
      <div className="personal-app-wrapper">
        <header className="personal-header">
          <div className="personal-home-icon" onClick={handleHomeClick}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h1 className="personal-page-title">{t('personalData.title') || '人事資料'}</h1>
          <div className="personal-header-right">
            <LanguageSwitch 
              className="personal-page-language-switch"
              position="relative"
            />
          </div>
        </header>

        {/* 🔥 修改：顯示訓練記錄的完整視圖 */}
        {showTrainingRecords ? (
          <div className="personal-training-records-view">
            <div className="personal-training-header">
              <button 
                className="personal-back-button"
                onClick={() => setShowTrainingRecords(false)}
              >
                ← {t('common.back') || '返回'}
              </button>
              <h2>{t('personalData.trainingRecords') || '訓練記錄'}</h2>
            </div>
            
            <div className="personal-training-content">
              {trainingRecords.length > 0 ? (
                <div className="personal-training-table">
                  <div className="personal-training-table-header">
                    {Object.values(trainingFieldLabels).map((label, index) => (
                      <div key={index} className="personal-training-cell header-cell">
                        {label}
                      </div>
                    ))}
                  </div>
                  
                  {trainingRecords.map((record, index) => (
                    <div key={record.id || index} className="personal-training-table-row">
                      {Object.entries(trainingFieldLabels).map(([key, label]) => (
                        <div 
                          key={key} 
                          className="personal-training-cell"
                          data-label={label}
                        >
                          {record[key] || t('personalData.noData') || '無'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="personal-no-training-records">
                  {t('personalData.noTrainingRecords') || '暫無訓練記錄'}
                </div>
              )}
            </div>
          </div>
        ) : isEditingHealthInsurance ? (
          // 🔥 修改：健保眷屬編輯視圖
          <div className="personal-editing-content">
            <div className="personal-editing-header">
              <h2>{t('personalData.editHealthInsurance') || '編輯健保眷屬'}</h2>
              <div className="personal-editing-actions">
                <button onClick={handleCancel} className="personal-cancel-btn">
                  {t('personalData.cancel') || '取消'}
                </button>
                <button onClick={handleHealthInsuranceSubmit} className="personal-submit-btn">
                  {t('personalData.save') || '儲存'}
                </button>
              </div>
            </div>
            
            <div className="personal-dependents-list">
              {dependents.map((dependent) => (
                <div key={dependent.id} className="personal-dependent-item">
                  <input
                    type="checkbox"
                    checked={selectedDependents.includes(dependent.id)}
                    onChange={() => handleDependentSelect(dependent.id)}
                  />
                  <div className="personal-dependent-info">
                    <div className="personal-dependent-name">{dependent.name}</div>
                    <div className="personal-dependent-details">
                      {dependent.birthDate} | {dependent.idNumber} | {dependent.relation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={handleAddNewDependent} className="personal-add-dependent-btn">
              + {t('personalData.addNewDependent') || '新增眷屬'}
            </button>
          </div>
        ) : isEditingPension ? (
          // 🔥 修改：退休金編輯視圖
          <div className="personal-editing-content">
            <div className="personal-editing-header">
              <h2>{t('personalData.editPension') || '編輯退休金提撥'}</h2>
              <div className="personal-editing-actions">
                <button onClick={handleCancel} className="personal-cancel-btn">
                  {t('personalData.cancel') || '取消'}
                </button>
                <button onClick={handleSubmit} className="personal-submit-btn">
                  {t('personalData.save') || '儲存'}
                </button>
              </div>
            </div>
            
            <div className="personal-pension-editing">
              <div className="personal-row">
                <div className="personal-label">{t('personalData.pensionContribution') || '退休金提撥比率'}</div>
                <div className="personal-value">
                  <div 
                    className="personal-pension-selector" 
                    onClick={handlePensionClick}
                    ref={pensionSelectorRef}
                  >
                    {formData.pensionContribution || t('personalData.selectPension') || '請選擇提撥比率'}
                    <span className="personal-dropdown-arrow">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isEditing ? (
          // 🔥 修改：基本資料編輯視圖
          <div className="personal-editing-content">
            <div className="personal-editing-header">
              <h2>{t('personalData.editBasicInfo') || '編輯基本資料'}</h2>
              <div className="personal-editing-actions">
                <button onClick={handleCancel} className="personal-cancel-btn">
                  {t('personalData.cancel') || '取消'}
                </button>
                <button onClick={handleSubmit} className="personal-submit-btn">
                  {loading ? (t('personalData.saving') || '儲存中...') : (t('personalData.save') || '儲存')}
                </button>
              </div>
            </div>
            
            <div className="personal-editing-form">
              <div className="personal-row">
                <div className="personal-label">{t('personalData.residenceAddress') || '居住地址'}</div>
                <div className="personal-value">
                  <input
                    type="text"
                    name="residenceAddress"
                    value={formData.residenceAddress}
                    onChange={handleInputChange}
                    className="personal-input"
                  />
                </div>
              </div>
              
              <div className="personal-row">
                <div className="personal-label">{t('personalData.mobile') || '手機號碼'}</div>
                <div className="personal-value">
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`personal-input ${errors.mobile ? 'personal-input-error' : ''}`}
                  />
                  {errors.mobile && (
                    <div className="personal-error-text">{errors.mobile}</div>
                  )}
                </div>
              </div>
              
              <div className="personal-row">
                <div className="personal-label">{t('personalData.phone') || '市話'}</div>
                <div className="personal-value">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="personal-input"
                  />
                </div>
              </div>

              {/* 🔥 新增：年齡欄位編輯 */}
              <div className="personal-row">
                <div className="personal-label">{t('personalData.fields.age113') || '113年度年齡'}</div>
                <div className="personal-value">
                  <input
                    type="number"
                    name="age113"
                    value={formData.age113}
                    onChange={handleInputChange}
                    className="personal-input"
                    min="0"
                    max="150"
                    placeholder={t('personalData.ageInputPlaceholder') || '請輸入年齡'}
                  />
                </div>
              </div>

              <div className="personal-row">
                <div className="personal-label">{t('personalData.fields.age114') || '114年度年齡'}</div>
                <div className="personal-value">
                  <input
                    type="number"
                    name="age114"
                    value={formData.age114}
                    onChange={handleInputChange}
                    className="personal-input"
                    min="0"
                    max="150"
                    placeholder={t('personalData.ageInputPlaceholder') || '請輸入年齡'}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 🔥 修改：主要個人資料視圖
          <div className="personal-content">
            {/* 🔥 完整個人資料區塊 */}
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">
                  {t('personalData.completePersonalData') || '完整個人資料'}
                </div>
                <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handleEdit(); }}>
                  {t('personalData.edit') || '修改'}
                </a>
              </div>
              
              {/* 🔥 只顯示有內容的欄位 */}
              {Object.entries(fieldLabels).map(([key, label]) => 
                renderFieldIfExists(label, formData[key], key)
              ).filter(Boolean)}
            </div>

            {/* 🔥 訓練記錄區塊 */}
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">
                  {t('personalData.trainingRecords') || '訓練記錄'}
                </div>
                {trainingRecords.length > 0 && (
                  <a 
                    href="#" 
                    className="personal-edit-link" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setShowTrainingRecords(true); 
                    }}
                  >
                    {t('personalData.viewAll') || '查看全部'} ({trainingRecords.length})
                  </a>
                )}
              </div>
              
              {trainingRecords.length > 0 ? (
                <>
                  {/* 顯示前3筆訓練記錄 */}
                  {trainingRecords.slice(0, 3).map((record, index) => (
                    <div key={record.id || index} className="personal-training-summary">
                      {renderFieldIfExists(trainingFieldLabels.item_number, record.item_number, `${index}-item_number`)}
                      {renderFieldIfExists(trainingFieldLabels.course_name, record.course_name, `${index}-course_name`)}
                      {renderFieldIfExists(trainingFieldLabels.completion_date, record.completion_date, `${index}-completion_date`)}
                      {renderFieldIfExists(trainingFieldLabels.retraining_date, record.retraining_date, `${index}-retraining_date`)}
                      {renderFieldIfExists(trainingFieldLabels.scheduled_retraining_date, record.scheduled_retraining_date, `${index}-scheduled_retraining_date`)}
                      {renderFieldIfExists(trainingFieldLabels.training_record, record.training_record, `${index}-training_record`)}
                      
                      {index < 2 && trainingRecords.length > 1 && (
                        <div className="personal-training-divider"></div>
                      )}
                    </div>
                  ))}
                  
                  {trainingRecords.length > 3 && (
                    <div className="personal-row">
                      <div className="personal-label"></div>
                      <div className="personal-value personal-more-records">
                        {t('personalData.moreRecords', { count: trainingRecords.length - 3 }) || 
                         `還有 ${trainingRecords.length - 3} 筆記錄...`}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="personal-row">
                  <div className="personal-label">{t('personalData.trainingRecords') || '訓練記錄'}</div>
                  <div className="personal-value">{t('personalData.noRecords') || '暫無記錄'}</div>
                </div>
              )}
            </div>

            {/* 🔥 修改：系統設定區塊 */}
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">{t('personalData.accountInfo') || '系統設定'}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">{t('personalData.account') || '帳號'}</div>
                <div className="personal-value">{formData.account}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">{t('personalData.password') || '密碼'}</div>
                <div className="personal-value">
                  <button className="personal-reset-password-btn" onClick={handleResetPassword}>
                    {t('personalData.resetPassword') || '重設密碼'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 退休金提撥比率選擇器 */}
        {showPensionSelector && (
          <div className="personal-pension-selector-container" ref={pensionSelectorRef}>
            {pensionOptions.map((option) => (
              <div 
                key={option.value}
                className={`personal-pension-option ${formData.pensionContribution === option.value ? 'personal-selected-pension' : ''}`}
                onClick={() => handlePensionSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalData;
