import React, { useState, useEffect, useRef, useReducer } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../../config'; // 🔥 引入 config
import PortraitImage from '../../ICON/love.png'; 
import CalendarSelector from './Calendar_Selector';
import JobRelated from './Job_Related/JobRelated';
import PayrollAccountRelated from './Payroll_Account_Related/PayrollAccountRelated';
import './EmployeeBasicInformationTable.css';
import SalaryStructure from './Salary_structure/Salary_structure'
import TwoInsurancesAndOneHousingFund from './Two_Insurances_And_One_Housing_Fund/Two_Insurances_And_One_Housing_Fund';
import Attendance_Status from './Attendance_Status/Attendance_Status';
import FakeRecords from './Fake_Records/Fake_Records';
import PayrollRecords from './Payroll_Records/Payroll_Records';

const EmployeeBasicInformationTable = ({ 
  employee, 
  switches, 
  toggleSwitch, 
  ToggleSwitch,
  calculateAge,
  formatDate,
  onClose,
  onEmployeeUpdate // 🔥 新增：用於通知父組件更新員工資料
}) => {
  const [modalActiveTab, setModalActiveTab] = useState('基本資料');
  const jobRelatedRef = useRef(null);
  const payrollAccountRef = useRef(null);
  const salaryStructureRef = useRef(null);
  const twoInsurancesRef = useRef(null);
  
  // 編輯狀態管理
  const [isEditingJobDetails, setIsEditingJobDetails] = useState(false);
  const [hasJobDetails, setHasJobDetails] = useState(false);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  
  // 強制重新渲染的 hook
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  // 🔥 新增：權限相關狀態
  const [permissions, setPermissions] = useState(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // 🔥 新增：本地員工資料狀態（用於立即更新顯示）
  const [localEmployee, setLocalEmployee] = useState(employee);

  // 基本資料編輯表單狀態
  const [basicInfoForm, setBasicInfoForm] = useState({
    name: '',
    gender: '',
    id_number: '',
    date_of_birth: '',
    marriage: '',
    registered_address: '',
    mailing_address: '',
    mail: '',
    mobile_number: '',
    landline_number: '',
    new_password: ''
  });

  // 表單驗證錯誤狀態
  const [formErrors, setFormErrors] = useState({});

// 🔥 修正：檢查當前登入使用者的權限，而不是被查看員工的權限
const checkEmployeePermissions = async () => {
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
    
    console.log('🔍 檢查當前登入使用者權限:', currentUserId);
    
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

    console.log('🔍 當前使用者權限檢查 API 回應:', response.data);
    
    if (response.data && response.data.Status === 'Ok') {
      // 🔥 從 raw_data 中讀取權限
      const rawData = response.data.Data?.raw_data;
      const hasPermission = rawData?.employee_data === 1 || rawData?.employee_data === '1';
      
      console.log('🔍 當前使用者原始權限資料:', rawData);
      console.log('🔍 employee_data 權限值:', rawData?.employee_data);
      console.log('🔍 最終權限判斷:', hasPermission);
      
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
    console.error('❌ 權限檢查 API 錯誤:', error);
    return {
      success: false,
      message: error.message || '權限檢查失敗',
      hasEditPermission: false
    };
  }
};

// 🔥 修正：只在組件初始化時檢查一次當前使用者權限，不依賴被查看的員工
useEffect(() => {
  const loadCurrentUserPermissions = async () => {
    setPermissionLoading(true);
    setPermissionError('');
    
    try {
      const result = await checkEmployeePermissions();
      
      if (result.success) {
        setPermissions(result.permissions);
        setHasEditPermission(result.hasEditPermission);
        console.log('✅ 當前使用者權限檢查成功:', result.permissions);
        console.log('✅ 員工資料編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
      } else {
        setPermissionError(result.message);
        setHasEditPermission(false);
        console.error('❌ 當前使用者權限檢查失敗:', result.message);
      }
    } catch (error) {
      setPermissionError('權限檢查發生錯誤');
      setHasEditPermission(false);
      console.error('❌ 當前使用者權限檢查異常:', error);
    } finally {
      setPermissionLoading(false);
    }
  };

  loadCurrentUserPermissions();
}, []); // 🔥 移除對 localEmployee?.employee_id 的依賴，只在組件初始化時執行一次

  // 🔥 監聽 employee prop 變化，同步更新 localEmployee
  useEffect(() => {
    if (employee) {
      setLocalEmployee(employee);
    }
  }, [employee]);

  // 🔥 新增：檢查員工權限
  useEffect(() => {
    const loadEmployeePermissions = async () => {
      if (localEmployee?.employee_id) {
        setPermissionLoading(true);
        setPermissionError('');
        
        try {
          const result = await checkEmployeePermissions(localEmployee.employee_id);
          
          if (result.success) {
            setPermissions(result.permissions);
            setHasEditPermission(result.hasEditPermission);
            console.log('✅ 權限檢查成功:', result.permissions);
            console.log('✅ 編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
          } else {
            setPermissionError(result.message);
            setHasEditPermission(false);
            console.error('❌ 權限檢查失敗:', result.message);
          }
        } catch (error) {
          setPermissionError('權限檢查發生錯誤');
          setHasEditPermission(false);
          console.error('❌ 權限檢查異常:', error);
        } finally {
          setPermissionLoading(false);
        }
      }
    };

    loadEmployeePermissions();
  }, [localEmployee?.employee_id]);

  // 初始化基本資料表單
  useEffect(() => {
    if (localEmployee) {
      setBasicInfoForm({
        name: localEmployee.name || '',
        gender: localEmployee.gender || '',
        id_number: localEmployee.id_number || '',
        date_of_birth: localEmployee.date_of_birth || '',
        marriage: localEmployee.marriage || '',
        registered_address: localEmployee.registered_address || '',
        mailing_address: localEmployee.mailing_address || '',
        mail: localEmployee.mail || '',
        mobile_number: localEmployee.mobile_number ? (localEmployee.mobile_number.startsWith('0') ? localEmployee.mobile_number : '0' + localEmployee.mobile_number) : '',
        landline_number: localEmployee.landline_number ? (localEmployee.landline_number.startsWith('0') ? localEmployee.landline_number : '0' + localEmployee.landline_number) : '',
        new_password: ''
      });
      setApiError('');
      setFormErrors({});
    }
  }, [localEmployee]);

  // 監聽 JobRelated 組件的狀態變化
  useEffect(() => {
    const checkJobRelatedStatus = () => {
      if (jobRelatedRef.current) {
        setIsEditingJobDetails(jobRelatedRef.current.isEditing || false);
        setHasJobDetails(jobRelatedRef.current.hasJobDetails || false);
      }
    };

    const interval = setInterval(checkJobRelatedStatus, 100);
    return () => clearInterval(interval);
  }, []);

  // 修正的表單驗證函數
  const validateBasicInfo = () => {
    const errors = {};
    
    if (!basicInfoForm.name || basicInfoForm.name.trim() === '') {
      errors.name = '姓名不能為空';
    }
    
    if (basicInfoForm.id_number && basicInfoForm.id_number.trim() !== '') {
      const idPattern = /^[A-Z][12]\d{8}$/;
      if (!idPattern.test(basicInfoForm.id_number.trim())) {
        errors.id_number = '身分證字號格式不正確';
      }
    }
    
    if (basicInfoForm.mail && basicInfoForm.mail.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(basicInfoForm.mail.trim())) {
        errors.mail = 'Email 格式不正確';
      }
    }
    
    if (basicInfoForm.mobile_number && basicInfoForm.mobile_number.trim() !== '') {
      const mobile = basicInfoForm.mobile_number.trim();
      const mobilePattern = /^09\d{8}$/;
      if (!mobilePattern.test(mobile)) {
        errors.mobile_number = '手機號碼格式不正確（09xxxxxxxx）';
      }
    }
    
    if (basicInfoForm.landline_number && basicInfoForm.landline_number.trim() !== '') {
      const landline = basicInfoForm.landline_number.trim();
      const landlinePattern = /^0\d{1,3}-?\d{6,8}$/;
      if (!landlinePattern.test(landline)) {
        errors.landline_number = '市話號碼格式不正確（如：02-12345678）';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 處理基本資料表單變更
  const handleBasicInfoChange = (fieldName, value) => {
    setBasicInfoForm(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    if (formErrors[fieldName]) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
    
    if (apiError) {
      setApiError('');
    }
  };

  // 🔥 修正的保存基本資料函數 - 加入立即更新本地資料
  const saveBasicInfo = async () => {
    if (!localEmployee?.employee_id) {
      return { success: false, message: '員工ID不存在' };
    }
    
    if (!validateBasicInfo()) {
      return { success: false, message: '請修正表單錯誤後再提交' };
    }
    
    try {
      const companyId = Cookies.get('company_id');
      
      const updateData = {
        name: basicInfoForm.name?.trim() || '',
        gender: basicInfoForm.gender || '',
        id_number: basicInfoForm.id_number?.trim() || '',
        date_of_birth: basicInfoForm.date_of_birth || '',
        marriage: basicInfoForm.marriage || '',
        registered_address: basicInfoForm.registered_address?.trim() || '',
        mailing_address: basicInfoForm.mailing_address?.trim() || '',
        mail: basicInfoForm.mail?.trim() || '',
        mobile_number: basicInfoForm.mobile_number?.trim().replace(/^0/, '') || '',
        landline_number: basicInfoForm.landline_number?.trim().replace(/^0/, '') || '',
        updated_by: 'admin'
      };

      if (basicInfoForm.new_password && basicInfoForm.new_password.trim() !== '') {
        updateData.new_password = basicInfoForm.new_password.trim();
      }

      console.log('🔄 準備發送的資料:', updateData);

      const response = await axios.put(
        `${API_BASE_URL}/api/employees/${companyId}/${localEmployee.employee_id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000,
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );

      console.log('✅ API 回應狀態碼:', response.status);
      console.log('✅ API 回應資料:', response.data);

      if (response.data && response.data.Status === 'Ok') {
        // 🔥 立即更新本地員工資料
        if (response.data.Data) {
          console.log('✅ 立即更新本地員工資料:', response.data.Data);
          setLocalEmployee(response.data.Data);
          
          // 🔥 通知父組件更新員工資料（如果有提供回調函數）
          if (onEmployeeUpdate && typeof onEmployeeUpdate === 'function') {
            onEmployeeUpdate(response.data.Data);
          }
        } else {
          // 🔥 如果後端沒有返回完整資料，手動構建更新後的資料
          const updatedEmployee = {
            ...localEmployee,
            ...updateData,
            // 🔥 恢復手機和市話的顯示格式
            mobile_number: updateData.mobile_number ? updateData.mobile_number : localEmployee.mobile_number,
            landline_number: updateData.landline_number ? updateData.landline_number : localEmployee.landline_number
          };
          
          console.log('✅ 手動構建更新後的員工資料:', updatedEmployee);
          setLocalEmployee(updatedEmployee);
          
          if (onEmployeeUpdate && typeof onEmployeeUpdate === 'function') {
            onEmployeeUpdate(updatedEmployee);
          }
        }
        
        return { success: true, message: response.data.Msg || '基本資料更新成功', updatedData: response.data.Data };
      } else {
        console.error('❌ 保存基本資料失敗:', response.data?.Msg);
        return { success: false, message: response.data?.Msg || '保存基本資料失敗' };
      }
    } catch (error) {
      console.error('❌ 保存基本資料失敗:', error);
      
      if (error.response) {
        const errorMsg = error.response.data?.Msg || 
                        error.response.data?.message || 
                        `HTTP ${error.response.status} 錯誤`;
        return { success: false, message: errorMsg };
      } else if (error.request) {
        return { success: false, message: '網路連接失敗，請檢查網路連接' };
      } else if (error.code === 'ECONNABORTED') {
        return { success: false, message: '請求超時，請稍後再試' };
      } else {
        return { success: false, message: error.message || '未知錯誤，請稍後再試' };
      }
    }
  };

  // 🔥 新增性別狀態轉換函數
  const getGenderStatusText = (gender) => {
    const genderMap = {
      'Male': '男',
      'Female': '女',
      'Other': '其他'
    };

    if (!gender) return '未設定';
    
    const key = String(gender).trim();
    return genderMap[key] || gender || '未設定';
  };

  // 🔥 修正婚姻狀態轉換函數
  const getMarriageStatusText = (marriage) => {
    const marriageMap = {
      'married': '已婚',
      'unmarried': '未婚',
      'single': '單身'
    };

    if (!marriage) return '未設定';
    
    const key = String(marriage).toLowerCase().trim();
    return marriageMap[key] || marriage || '未設定';
  };

// 🔥 修正的統一處理編輯按鈕點擊
const handleEditButtonClick = async () => {
  if (permissionLoading) {
    alert('正在檢查權限，請稍候...');
    return;
  }

  if (!hasEditPermission) {
    alert('您沒有權限編輯員工基本資料');
    return;
  }

  if (isEditingJobDetails || isEditingBasicInfo) {
    setSaving(true);
    setApiError('');
    
    try {
      const results = [];
      let hasAnySuccess = false;
      
      // 🔥 保存基本資料（允許失敗）
      if (isEditingBasicInfo) {
        console.log('🔄 保存基本資料...');
        const basicResult = await saveBasicInfo();
        
        // 🔥 特殊處理：如果是 "沒有資料被更新"，視為成功
        if (basicResult.success || basicResult.message === '沒有資料被更新') {
          results.push({ 
            type: '基本資料', 
            success: true, 
            message: basicResult.success ? basicResult.message : '基本資料無變更（跳過）'
          });
          hasAnySuccess = true;
          console.log('✅ 基本資料處理完成（無變更或更新成功）');
        } else {
          results.push({ type: '基本資料', ...basicResult });
          console.error('❌ 基本資料更新失敗:', basicResult.message);
        }
      }
      
      // 🔥 保存職務詳情
      if (jobRelatedRef.current && isEditingJobDetails) {
        console.log('🔄 保存職務詳情...');
        const jobResult = await jobRelatedRef.current.finishEditing();
        results.push({ type: '職務資料', ...jobResult });
        
        if (jobResult.success) {
          hasAnySuccess = true;
          console.log('✅ 職務詳情更新成功');
          
          // 🔥 合併職務資料到本地員工資料
          if (jobResult.updatedData) {
            setLocalEmployee(prev => ({
              ...prev,
              ...jobResult.updatedData
            }));
          }
        } else {
          console.error('❌ 職務詳情更新失敗:', jobResult.message);
        }
      }
      
      // 🔥 保存薪資帳戶
      if (payrollAccountRef.current) {
        console.log('🔄 保存薪資帳戶...');
        const payrollResult = await payrollAccountRef.current.savePayrollAccount();
        results.push({ type: '薪資帳戶', ...payrollResult });
        
        if (payrollResult.success) {
          hasAnySuccess = true;
          console.log('✅ 薪資帳戶更新成功');
        } else {
          console.error('❌ 薪資帳戶更新失敗:', payrollResult.message);
        }
      }
      
      // 🔥 處理結果
      const failures = results.filter(result => !result.success);
      const successes = results.filter(result => result.success);
      
      console.log('📊 更新結果統計:', { 
        total: results.length,
        successes: successes.length, 
        failures: failures.length 
      });
      
      if (failures.length === 0 && results.length > 0) {
        // 🔥 全部成功
        alert('資料處理完成！');
        setIsEditingJobDetails(false);
        setIsEditingBasicInfo(false);
        setApiError('');
        setFormErrors({});
      } else if (hasAnySuccess) {
        // 🔥 部分成功
        const successMsg = successes.map(s => `✓ ${s.type}: ${s.message}`).join('\n');
        const failureMsg = failures.map(f => `✗ ${f.type}: ${f.message}`).join('\n');
        
        if (failures.length === 0) {
          alert(`所有資料處理完成:\n${successMsg}`);
        } else {
          alert(`部分資料處理完成:\n${successMsg}\n\n失敗項目:\n${failureMsg}`);
        }
        
        // 🔥 關閉編輯模式
        setIsEditingBasicInfo(false);
        setIsEditingJobDetails(false);
        
        setApiError(failures.length > 0 ? failures.map(f => f.message).join('; ') : '');
      } else if (results.length > 0) {
        // 🔥 全部失敗
        const errorMsg = failures.map(f => `${f.type}: ${f.message}`).join('\n');
        alert(`資料更新失敗:\n${errorMsg}`);
        setApiError(failures.map(f => f.message).join('; '));
      } else {
        // 🔥 沒有需要更新的資料
        alert('沒有需要更新的資料');
        setIsEditingJobDetails(false);
        setIsEditingBasicInfo(false);
      }
      
      // 🔥 強制重新渲染
      forceUpdate();
      
    } catch (error) {
      console.error('❌ 編輯完成處理錯誤:', error);
      setApiError('處理更新時發生錯誤，請稍後再試');
      alert('處理更新時發生錯誤，請稍後再試');
    } finally {
      setSaving(false);
    }
  } else {
    // 🔥 開始編輯
    console.log('🔄 開始編輯模式');
    if (jobRelatedRef.current) {
      jobRelatedRef.current.startEditing();
      setIsEditingJobDetails(true);
    }
    setIsEditingBasicInfo(true);
    setApiError('');
    setFormErrors({});
    forceUpdate();
  }
};

  // 處理取消編輯按鈕點擊
  const handleCancelEditButtonClick = () => {
    if (jobRelatedRef.current) {
      jobRelatedRef.current.cancelEditing();
      setIsEditingJobDetails(false);
    }
    
    if (payrollAccountRef.current) {
      payrollAccountRef.current.resetForm();
    }
    
    setIsEditingBasicInfo(false);
    
    // 重置基本資料表單
    if (localEmployee) {
      setBasicInfoForm({
        name: localEmployee.name || '',
        gender: localEmployee.gender || '',
        id_number: localEmployee.id_number || '',
        date_of_birth: localEmployee.date_of_birth || '',
        marriage: localEmployee.marriage || '',
        registered_address: localEmployee.registered_address || '',
        mailing_address: localEmployee.mailing_address || '',
        mail: localEmployee.mail || '',
        mobile_number: localEmployee.mobile_number ? (localEmployee.mobile_number.startsWith('0') ? localEmployee.mobile_number : '0' + localEmployee.mobile_number) : '',
        landline_number: localEmployee.landline_number ? (localEmployee.landline_number.startsWith('0') ? localEmployee.landline_number : '0' + localEmployee.landline_number) : '',
        new_password: ''
      });
    }
    
    setApiError('');
    setFormErrors({});
    forceUpdate();
  };

  // 🔥 修正的處理新增職務詳情按鈕點擊 - 加入權限檢查
  const handleCreateJobDetailsClick = () => {
    // 🔥 檢查權限
    if (permissionLoading) {
      alert('正在檢查權限，請稍候...');
      return;
    }

    if (!hasEditPermission) {
      alert('您沒有權限編輯員工基本資料');
      return;
    }

    if (jobRelatedRef.current) {
      jobRelatedRef.current.startEditing();
      setIsEditingJobDetails(true);
    }
    setIsEditingBasicInfo(true);
    setApiError('');
    setFormErrors({});
    forceUpdate();
  };

  // 🔥 修正的處理職務詳情更新回調
  const handleJobDetailsUpdated = (updatedJobDetails) => {
    console.log('職務詳情已更新:', updatedJobDetails);
    setHasJobDetails(!!updatedJobDetails);
    
    // 🔥 立即更新本地員工資料
    if (updatedJobDetails) {
      setLocalEmployee(prev => ({
        ...prev,
        ...updatedJobDetails
      }));
    }
    
    forceUpdate();
  };

  // 渲染錯誤訊息的輔助函數
  const renderFieldError = (fieldName) => {
    if (formErrors[fieldName]) {
      return <div className="field-error" style={{color: 'red', fontSize: '12px', marginTop: '2px'}}>{formErrors[fieldName]}</div>;
    }
    return null;
  };

  // 🔥 使用 localEmployee 而不是 employee
  if (!localEmployee) return null;

  // 標籤配置
  const tabs = [
    { id: '基本資料', label: '基本\n資料' },
    { id: '薪資結構', label: '薪資\n結構' },
    { id: '二險一金', label: '二險\n一金' },
    { id: '出勤狀況', label: '出勤\n狀況' },
    { id: '假別紀錄', label: '假別\n紀錄' },
    { id: '發薪紀錄', label: '發薪\n紀錄' }
  ];

  // 渲染標籤內容 - 所有 employee 都改為 localEmployee
  const renderTabContent = () => {
    switch (modalActiveTab) {
      case '基本資料':
        return (
          <>
            {/* 警告訊息 */}
            <div className="warning-message">
              *粗體字為員工可見的資料，如您主動修改將會通知該員工，若不可見將不會通知員工。
            </div>

            {/* 🔥 權限錯誤訊息顯示 */}
            {permissionError && (
              <div className="permission-error-message" style={{
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

            {/* API 錯誤訊息顯示 */}
            {apiError && (
              <div className="api-error-message" style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px',
                borderRadius: '4px',
                margin: '10px 0',
                border: '1px solid #ffcdd2'
              }}>
                <strong>錯誤：</strong>{apiError}
              </div>
            )}

            {/* 主要表單區域 */}
            <div className="main-form-area">
              {/* 左側：基本資料 */}
              <div className="left-section">
                {/* 基本資料區塊 */}
                <div className="basic-info-block">
                  <div className="basic-info-content">
                    {/* 標題 */}
                    <div className="section-title">
                      基本資料
                    </div>

                    {/* 員工照片區域 */}
                    <div className="employee-photo-area">
                      <div className="photo-container">
                        <div className="photo-wrapper">
                          <img 
                            src={PortraitImage} 
                            alt="員工照片"
                            className="employee-photo"
                          />
                        </div>
                      </div>

                      {/* 基本資料表格 */}
                      <div className="basic-info-table">
                        {/* 員工編號 */}
                        <div className="info-row">
                          <span className="info-label">員工編號</span>
                          <span className="info-value">{localEmployee.employee_id || ''}</span>
                        </div>

                        {/* 姓名 */}
                        <div className="info-row">
                          <span className="info-label">姓名 *</span>
                          {isEditingBasicInfo ? (
                            <div>
                              <input
                                type="text"
                                value={basicInfoForm.name}
                                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                                className={`info-input ${formErrors.name ? 'error' : ''}`}
                                style={formErrors.name ? {borderColor: 'red'} : {}}
                              />
                              {renderFieldError('name')}
                            </div>
                          ) : (
                            <span className="info-value">{localEmployee.name || ''}</span>
                          )}
                        </div>

                        {/* 🔥 修正生理性別 */}
                        <div className="info-row">
                          <span className="info-label">生理性別</span>
                          {isEditingBasicInfo ? (
                            <select
                              value={basicInfoForm.gender}
                              onChange={(e) => handleBasicInfoChange('gender', e.target.value)}
                              className="info-select"
                            >
                              <option value="">請選擇</option>
                              <option value="Male">男</option>
                              <option value="Female">女</option>
                              <option value="Other">其他</option>
                            </select>
                          ) : (
                            <span className="info-value">{getGenderStatusText(localEmployee.gender)}</span>
                          )}
                        </div>

                        {/* 身分證字號 */}
                        <div className="info-row">
                          <span className="info-label">身分證字號</span>
                          {isEditingBasicInfo ? (
                            <div>
                              <input
                                type="text"
                                value={basicInfoForm.id_number}
                                onChange={(e) => handleBasicInfoChange('id_number', e.target.value.toUpperCase())}
                                className={`info-input ${formErrors.id_number ? 'error' : ''}`}
                                style={formErrors.id_number ? {borderColor: 'red'} : {}}
                                placeholder="A123456789"
                                maxLength="10"
                              />
                              {renderFieldError('id_number')}
                            </div>
                          ) : (
                            <span className="info-value">{localEmployee.id_number || ''}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 其他資料欄位 */}
                    <div className="other-info-fields">
                      {/* 出生年月日 */}
                      <div className="info-row-wide">
                        <span className="info-label">出生年月日</span>
                        {isEditingBasicInfo ? (
                          <input
                            type="date"
                            value={basicInfoForm.date_of_birth}
                            onChange={(e) => handleBasicInfoChange('date_of_birth', e.target.value)}
                            className="info-input"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        ) : (
                          <div className="birth-info">
                            <span className="info-value">{formatDate(localEmployee.date_of_birth)}</span>
                            <span className="info-value">
                              {(() => {
                                const age = calculateAge(localEmployee.date_of_birth);
                                return age.years > 0 || age.months > 0 ? `(${age.years}歲${age.months.toString().padStart(2, '0')}個月)` : '';
                              })()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 婚姻狀態 */}
                      <div className="info-row-wide">
                        <span className="info-label">婚姻狀態</span>
                        {isEditingBasicInfo ? (
                          <select
                            value={basicInfoForm.marriage}
                            onChange={(e) => handleBasicInfoChange('marriage', e.target.value)}
                            className="info-select"
                          >
                            <option value="">請選擇</option>
                            <option value="unmarried">未婚</option>
                            <option value="single">單身</option>
                            <option value="married">已婚</option>
                          </select>
                        ) : (
                          <span className="info-value">{getMarriageStatusText(localEmployee.marriage)}</span>
                        )}
                      </div>

                      {/* 戶籍地址 */}
                      <div className="info-row-wide">
                        <span className="info-label">戶籍地址</span>
                        {isEditingBasicInfo ? (
                          <input
                            type="text"
                            value={basicInfoForm.registered_address}
                            onChange={(e) => handleBasicInfoChange('registered_address', e.target.value)}
                            className="info-input address-input"
                            placeholder="請輸入戶籍地址"
                          />
                        ) : (
                          <span className="info-value address">{localEmployee.registered_address || ''}</span>
                        )}
                      </div>

                      {/* 通訊地址 */}
                      <div className="info-row-wide">
                        <span className="info-label">通訊地址</span>
                        {isEditingBasicInfo ? (
                          <input
                            type="text"
                            value={basicInfoForm.mailing_address}
                            onChange={(e) => handleBasicInfoChange('mailing_address', e.target.value)}
                            className="info-input address-input"
                            placeholder="請輸入通訊地址"
                          />
                        ) : (
                          <span className="info-value address">{localEmployee.mailing_address || ''}</span>
                        )}
                      </div>

                      {/* E-mail */}
                      <div className="info-row-wide">
                        <span className="info-label">E-mail</span>
                        {isEditingBasicInfo ? (
                          <div>
                            <input
                              type="email"
                              value={basicInfoForm.mail}
                              onChange={(e) => handleBasicInfoChange('mail', e.target.value)}
                              className={`info-input address-input ${formErrors.mail ? 'error' : ''}`}
                              style={formErrors.mail ? {borderColor: 'red'} : {}}
                              placeholder="example@email.com"
                            />
                            {renderFieldError('mail')}
                          </div>
                        ) : (
                          <span className="info-value address">{localEmployee.mail || ''}</span>
                        )}
                      </div>

                      {/* 重設APP密碼 */}
                      <div className="info-row-wide">
                        <span className="info-label">重設APP密碼</span>
                        <div className="password-reset">
                          <input 
                            type="password" 
                            value={basicInfoForm.new_password}
                            onChange={(e) => handleBasicInfoChange('new_password', e.target.value)}
                            placeholder={isEditingBasicInfo ? "輸入新密碼" : ""}
                            className="password-input"
                            disabled={!isEditingBasicInfo}
                          />
                          {!isEditingBasicInfo && (
                            <button className="employee-password-complete-btn" disabled>完成</button>
                          )}
                        </div>
                      </div>

                      {/* 手機 */}
                      <div className="info-row-wide">
                        <span className="info-label">手機</span>
                        {isEditingBasicInfo ? (
                          <div>
                            <input
                              type="text"
                              value={basicInfoForm.mobile_number}
                              onChange={(e) => handleBasicInfoChange('mobile_number', e.target.value)}
                              className={`info-input ${formErrors.mobile_number ? 'error' : ''}`}
                              style={formErrors.mobile_number ? {borderColor: 'red'} : {}}
                              placeholder="0912345678"
                              maxLength="10"
                            />
                            {renderFieldError('mobile_number')}
                          </div>
                        ) : (
                          <span className="info-value">{localEmployee.mobile_number ? `0${localEmployee.mobile_number}` : ''}</span>
                        )}
                      </div>

                      {/* 市話 */}
                      <div className="info-row-wide">
                        <span className="info-label">市話</span>
                        {isEditingBasicInfo ? (
                          <div>
                            <input
                              type="text"
                              value={basicInfoForm.landline_number}
                              onChange={(e) => handleBasicInfoChange('landline_number', e.target.value)}
                              className={`info-input ${formErrors.landline_number ? 'error' : ''}`}
                              style={formErrors.landline_number ? {borderColor: 'red'} : {}}
                              placeholder="02-12345678"
                            />
                            {renderFieldError('landline_number')}
                          </div>
                        ) : (
                          <span className="info-value">{localEmployee.landline_number ? `0${localEmployee.landline_number}` : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 薪資帳戶區塊 */}
                <PayrollAccountRelated 
                  ref={payrollAccountRef}
                  employee={localEmployee} 
                  isEditing={isEditingBasicInfo}
                />
              </div>

              {/* 右側職務相關區塊 */}
              <div className="right-section">
                <JobRelated 
                  ref={jobRelatedRef}
                  employee={localEmployee}
                  ToggleSwitch={ToggleSwitch}
                  onJobDetailsUpdated={handleJobDetailsUpdated}
                />
              </div>
            </div>

            {/* 下方動作按鈕區域 */}
            <div className="bottom-action-buttons">
              {/* 🔥 修正編輯按鈕 - 加入權限檢查 */}
              <button 
                className="edit-button"
                onClick={handleEditButtonClick}
                disabled={saving || permissionLoading || !hasEditPermission}
                style={{
                  ...(saving ? {opacity: 0.6, cursor: 'not-allowed'} : {}),
                  ...(permissionLoading ? {opacity: 0.6, cursor: 'wait'} : {}),
                  ...(!hasEditPermission ? {opacity: 0.5, cursor: 'not-allowed'} : {})
                }}
              >
                <span className="edit-button-text">
                  {permissionLoading ? '檢查權限中...' :
                   !hasEditPermission ? '無編輯權限' :
                   (isEditingJobDetails || isEditingBasicInfo) ? 
                   (saving ? '保存中...' : '編輯完成') : 
                   '編輯所有資料'
                  }
                </span>
                {(isEditingJobDetails || isEditingBasicInfo) && !saving && hasEditPermission && (
                  <span className="edit-button-subtitle">通知員工及老闆</span>
                )}
              </button>

              {/* 🔥 修正新增職務詳情按鈕 - 加入權限檢查 */}
              {!hasJobDetails && !isEditingJobDetails && !isEditingBasicInfo && (
                hasEditPermission ? (
                  <button 
                    className="create-button"
                    onClick={handleCreateJobDetailsClick}
                    disabled={permissionLoading}
                    style={{ 
                      backgroundColor: '#2ed573', 
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: permissionLoading ? 'wait' : 'pointer',
                      opacity: permissionLoading ? 0.6 : 1
                    }}
                  >
                    <span className="create-button-text">
                      {permissionLoading ? '檢查權限中...' : '新增職務詳情'}
                    </span>
                  </button>
                ) : (
                  <button 
                    className="create-button"
                    disabled
                    style={{ 
                      backgroundColor: '#cccccc', 
                      color: '#666666',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'not-allowed'
                    }}
                  >
                    <span className="create-button-text">無編輯權限</span>
                  </button>
                )
              )}

              {/* 取消編輯按鈕 */}
              {(isEditingJobDetails || isEditingBasicInfo) && (
                <button 
                  className="cancel-edit-button"
                  onClick={handleCancelEditButtonClick}
                  disabled={saving}
                  style={saving ? {opacity: 0.6, cursor: 'not-allowed'} : {}}
                >
                  <span className="cancel-edit-button-text">取消編輯</span>
                </button>
              )}

              {/* 批准編輯按鈕 */}
              <button className="approve-button">
                <div className="approve-button-content">
                  <span className="approve-button-title">批准編輯內容</span>
                  <span className="approve-button-subtitle">員工編輯後須審核</span>
                </div>
              </button>

              {/* 封存按鈕 */}
              <button
                onClick={() => {
                  console.log('封存員工:', localEmployee);
                }}
                className="archive-button"
              >
                <span className="archive-button-title">封存</span>
                <span className="archive-button-subtitle">員工離職後封存檔案</span>
              </button>
            </div>
          </>
        );

      case '薪資結構':
        return (
          <SalaryStructure 
            ref={salaryStructureRef}
            employee={localEmployee}
            isEditing={isEditingBasicInfo}
          />
        );

      case '二險一金':
        return (
          <TwoInsurancesAndOneHousingFund 
            ref={twoInsurancesRef}
            employee={localEmployee}
            isEditing={isEditingBasicInfo}
          />
        );

      case '出勤狀況':
        return (
          <Attendance_Status employee={localEmployee}/>
        );

      case '假別紀錄':
        return (
          <FakeRecords employee={localEmployee} />
        );

      case '發薪紀錄':
        return (
          <PayrollRecords employee={localEmployee} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="employee-detail-container">
      {/* 🔥 左側標籤欄 */}
      <div className="ebit-employee-detail-sidebar">
        <div className="ebit-employee-detail-sidebar-inner">
          <div className="ebit-employee-detail-tabs">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => setModalActiveTab(tab.id)}
                className={`ebit-employee-detail-tab ${modalActiveTab === tab.id ? 'ebit-employee-detail-tab-active' : ''}`}
              >
                <div className={`ebit-employee-detail-tab-label ${modalActiveTab === tab.id ? 'ebit-employee-detail-tab-label-active' : ''}`}>
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 右側內容區域 */}
      <div className="ebit-employee-detail-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EmployeeBasicInformationTable;
