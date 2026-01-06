import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';
import './css/PersonalData.css';
import Cookies from 'js-cookie';

// 使用您的 API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

function PersonalData() {
  const [currentTime, setCurrentTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderSelector, setShowGenderSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showPensionSelector, setShowPensionSelector] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 新增狀態來儲存從 cookies 獲取的資料
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  const datePickerRef = useRef(null);
  const genderSelectorRef = useRef(null);
  const yearSelectorRef = useRef(null);
  const pensionSelectorRef = useRef(null);
  const pensionInputRef = useRef(null);
  const pensionContainerRef = useRef(null);
  const navigate = useNavigate();

  // 新增健保眷屬加保相關狀態
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

  // 性別選項
  const genderOptions = [
    { value: 'Male', label: '男' },
    { value: 'Female', label: '女' },
    { value: 'Other', label: '非二元性別' }
  ];

  // 個人資料狀態
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    idNumber: '',
    photo: null,
    residenceAddress: '',
    mailingAddress: '',
    mobile: '',
    phone: '',
    shiftSystem: '',
    identity: '',
    salaryType: '',
    department: '',
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

  // 從 cookies 獲取登入資料
  const getLoginDataFromCookies = () => {
    try {
      // 嘗試從多種可能的 cookie 名稱獲取資料
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

      // 也嘗試從 sessionStorage 和 localStorage 獲取（針對 iOS）
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
    
    // 首先嘗試從 cookies 獲取資料
    const cookieData = getLoginDataFromCookies();
    
    // 設定優先順序：cookies > context > 預設值
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

  // 🔥 修改：點擊外部關閉選擇器 - 移除退休金選擇器的自動關閉
  useEffect(() => {
    function handleClickOutside(event) {
      // 🔥 註解掉退休金選擇器的自動關閉
      /*
      if (showPensionSelector && pensionContainerRef.current && 
          !pensionContainerRef.current.contains(event.target)) {
        setShowPensionSelector(false);
      }
      */
      
      // 其他選擇器的處理保持不變
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
    }

    // 🔥 修改：只有在顯示其他選擇器時才添加事件監聽器
    if (showDatePicker || showGenderSelector || showYearSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDatePicker, showGenderSelector, showYearSelector]); // 🔥 移除 showPensionSelector

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

  // 使用您的資料庫 API 獲取員工資料
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!companyId || !employeeId) {
        console.log('缺少公司ID或員工ID:', { companyId, employeeId });
        if (companyId === '' && employeeId === '') {
          setError('請先登入以查看個人資料');
        }
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log(`正在查詢員工資料 - 公司ID: ${companyId}, 員工ID: ${employeeId}`);
        
        const response = await fetch(
          `${API_BASE_URL}/api/employee?company_id=${encodeURIComponent(companyId)}&employee_id=${encodeURIComponent(employeeId)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API 回傳結果:', result);
        
        if (result.Status === "Ok" && result.Data) {
          console.log('API 回傳的員工資料:', result.Data);
          
          // 將 API 回傳的資料對應到表單欄位
          const apiData = result.Data;
          const mappedData = {
            name: apiData.name || '',
            birthDate: apiData.date_of_birth || '',
            gender: apiData.gender === 'Male' ? '男' : apiData.gender === 'Female' ? '女' : apiData.gender || '',
            idNumber: apiData.id_number || '',
            residenceAddress: apiData.registered_address || '',
            mailingAddress: apiData.mailing_address || '',
            mobile: apiData.mobile_number || '',
            phone: apiData.landline_number || '',
            shiftSystem: apiData.shift_system || '',
            identity: apiData.employment_status || '',
            salaryType: apiData.salary_type || '',
            department: apiData.department || '',
            jobTitle: apiData.position || '',
            jobLevel: apiData.job_grade || '',
            trainingControlDate: apiData.post_training_control ? apiData.post_training_control.toString() : '',
            pensionContribution: apiData.retirement_fund_self_contribution ? 
              `${(parseFloat(apiData.retirement_fund_self_contribution) * 100).toFixed(0)}%` : '',
            dependentsInsured: apiData.dependent_insurance ? `${apiData.dependent_insurance}人` : '',
            account: apiData.employee_id ? apiData.employee_id.toString() : '',
            password: '••••••••',
            photo: null,
            attachments: []
          };

          setFormData(mappedData);
          console.log('已設定表單資料:', mappedData);
          
        } else {
          console.error('API 回傳錯誤:', result.Msg || '未知錯誤');
          setError(result.Msg || '查詢員工資料失敗');
        }
        
      } catch (error) {
        console.error('API 請求失敗:', error);
        setError(`網路連線錯誤: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (companyId && employeeId) {
      fetchEmployeeData();
    }
  }, [companyId, employeeId]);

  const handleHomeClick = () => {
    navigate('/frontpage01');
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
    setShowPensionSelector(false); // 🔥 保持這行，確保取消時關閉選單
    setErrors({});
  };

  const validateMobile = (mobile) => {
    const regex = /^09\d{8}$/;
    return regex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateMobile(formData.mobile)) {
      newErrors.mobile = '手機號碼必須為09開頭，後面跟著8個數字';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 更新員工資料的函數
  const updateEmployeeData = async (updateData) => {
    try {
      console.log('準備更新員工資料:', updateData);
      
      const response = await fetch(
        `${API_BASE_URL}/api/employee/${companyId}/${employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Msg || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('更新 API 回傳結果:', result);
      
      if (result.Status === "Ok") {
        return result;
      } else {
        throw new Error(result.Msg || '更新失敗');
      }
    } catch (error) {
      console.error('更新員工資料失敗:', error);
      throw error;
    }
  };

  // handleSubmit 函數，加入 API 呼叫
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 準備要更新的資料，只包含可以修改的欄位
      const updateData = {
        registered_address: formData.residenceAddress,
        mailing_address: formData.mailingAddress,
        mobile_phone: formData.mobile,
        home_phone: formData.phone
      };

      console.log('提交的更新資料:', updateData);
      
      // 呼叫更新 API
      const result = await updateEmployeeData(updateData);
      
      if (result.Status === "Ok") {
        console.log('更新成功:', result);
        
        // 更新成功後的處理
        setIsEditing(false);
        setIsEditingPension(false);
        setIsEditingHealthInsurance(false);
        
        // 顯示成功訊息
        alert('資料更新成功！');
        
      } else {
        throw new Error(result.Msg || '更新失敗');
      }
        
    } catch (error) {
      console.error('更新資料失敗:', error);
      setError(`更新資料失敗: ${error.message}`);
      alert(`更新失敗: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // handlePensionSubmit 函數，處理退休金更新
  const handlePensionSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // 將百分比轉換為小數（例如：6% -> 0.06）
      const pensionRate = parseFloat(formData.pensionContribution.replace('%', '')) / 100;
      
      const updateData = {
        labor_pension_self_contribution: pensionRate
      };

      console.log('提交的退休金更新資料:', updateData);
      
      // 呼叫更新 API
      const result = await updateEmployeeData(updateData);
      
      if (result.Status === "Ok") {
        console.log('退休金更新成功:', result);
        
        setIsEditingPension(false);
        setShowPensionSelector(false); // 🔥 保持這行，送出成功後關閉選單
        alert('退休金設定更新成功！');
      } else {
        throw new Error(result.Msg || '更新失敗');
      }
        
    } catch (error) {
      console.error('更新退休金設定失敗:', error);
      setError(`更新退休金設定失敗: ${error.message}`);
      alert(`更新失敗: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // handleHealthInsuranceSubmit 函數，處理健保更新
  const handleHealthInsuranceSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const updateData = {
        health_insurance_dependents: selectedDependents.length
      };

      console.log('提交的健保更新資料:', updateData);
      
      // 呼叫更新 API
      const result = await updateEmployeeData(updateData);
      
      if (result.Status === "Ok") {
        console.log('健保設定更新成功:', result);
        
        // 更新本地狀態
        setFormData({
          ...formData,
          dependentsInsured: `${selectedDependents.length}人`
        });
        
        setIsEditingHealthInsurance(false);
        alert('健保眷屬設定更新成功！');
      } else {
        throw new Error(result.Msg || '更新失敗');
      }
        
    } catch (error) {
      console.error('更新健保設定失敗:', error);
      setError(`更新健保設定失敗: ${error.message}`);
      alert(`更新失敗: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'mobile') {
      if (!validateMobile(value)) {
        setErrors({...errors, mobile: '手機號碼必須為09開頭，後面跟著8個數字'});
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

  // 🔥 修改：handlePensionSelect 函數 - 不自動關閉選單
  const handlePensionSelect = (value) => {
    setFormData({
      ...formData,
      pensionContribution: value
    });
    // 🔥 移除這行：不再自動關閉選擇器
    // setShowPensionSelector(false);
  };

  // handlePensionClick 函數 - 簡化邏輯
  const handlePensionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPensionSelector(prev => !prev);
  };

  const handleHealthInsuranceEdit = () => {
    setOriginalData({...formData});
    setIsEditingHealthInsurance(true);
    // 從當前的眷屬投保人數設定預設選擇
    const currentCount = parseInt(formData.dependentsInsured.replace('人', '')) || 0;
    setSelectedDependents(dependents.slice(0, currentCount).map(d => d.id));
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
    alert('新增眷屬功能開發中...');
  };

  const handleResetPassword = () => {
    console.log('重設密碼');
    alert('密碼重設功能開發中...');
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
            <div className="personal-page-title">人事資料</div>
            <div className="personal-time-display">{currentTime}</div>
          </header>
          <div className="personal-loading">
            <div className="personal-loading-spinner"></div>
            <div>載入中...</div>
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
            <div className="personal-page-title">人事資料</div>
            <div className="personal-time-display">{currentTime}</div>
          </header>
          <div className="personal-error">
            <div>載入失敗</div>
            <div className="personal-error-message">{error}</div>
            <div className="personal-debug-info">
              Debug 資訊: 公司ID={companyId || '無'}, 員工ID={employeeId || '無'}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="personal-reload-button"
            >
              重新載入
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
          <div className="personal-page-title">人事資料</div>
          <div className="personal-time-display">{currentTime}</div>
        </header>

        {isEditingHealthInsurance ? (
          <div className="personal-editing-content">
            <div className="personal-editing-section">
              <div className="personal-editing-title">健保-眷屬加保</div>
            </div>
            <div className="personal-editing-scroll-area">
              <div className="personal-health-insurance-header">
                <div>健保-眷屬加保</div>
                <button className="personal-add-button" onClick={handleAddNewDependent}>
                  新增
                </button>
              </div>
              
              <div className="personal-dependents-list">
                {dependents.map(dependent => (
                  <div key={dependent.id} className="personal-dependent-item">
                    <div className="personal-checkbox-row">
                      <input
                        type="checkbox"
                        className="personal-checkbox"
                        checked={selectedDependents.includes(dependent.id)}
                        onChange={() => handleDependentSelect(dependent.id)}
                      />
                      <span className="personal-name-text">{dependent.name}</span>
                    </div>
                    <div className="personal-info-row">
                      <span className="personal-label">出生日</span>
                      <span className="personal-value">{dependent.birthDate}</span>
                    </div>
                    <div className="personal-info-row">
                      <span className="personal-label">身分證字號</span>
                      <span className="personal-value">{dependent.idNumber}</span>
                    </div>
                    <div className="personal-info-row">
                      <span className="personal-label">稱謂</span>
                      <div className="personal-relation-container">
                        <span>{dependent.relation}</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="personal-chevron-icon"
                        >
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="personal-button-container">
              <button 
                className="personal-cancel-button" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button 
                className={`personal-submit-button ${selectedDependents.length === 0 || isSubmitting ? 'personal-submit-button-disabled' : ''}`}
                onClick={handleHealthInsuranceSubmit}
                disabled={selectedDependents.length === 0 || isSubmitting}
              >
                {isSubmitting ? '更新中...' : '送出'}
              </button>
            </div>
          </div>
        ) : isEditingPension ? (
          <div className="personal-editing-content">
            <div className="personal-editing-section">
              <div className="personal-editing-title">退休金勞工自提</div>
            </div>
            <div className="personal-editing-scroll-area">
              <div className="personal-form-group">
                <div className="personal-label">勞退金-自提</div>
                <div className="personal-pension-input-container" ref={pensionContainerRef}>
                  <div 
                    className="personal-pension-input"
                    onClick={handlePensionClick}
                  >
                    <span>{formData.pensionContribution}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="personal-chevron-down"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                    </svg>
                  </div>
                  
                  {/* 選擇器直接放在輸入框容器內 */}
                  {showPensionSelector && (
                    <div className="personal-pension-selector-container">
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
            </div>
            <div className="personal-button-container">
              <button 
                className="personal-cancel-button" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button 
                className={`personal-submit-button ${isSubmitting ? 'personal-submit-button-disabled' : ''}`}
                onClick={handlePensionSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '更新中...' : '送出'}
              </button>
            </div>
          </div>
        ) : isEditing ? (
          <div className="personal-editing-content">
            <div className="personal-editing-section">
              <div className="personal-editing-title">編輯基本資料</div>
            </div>
            <div className="personal-editing-scroll-area">
              <div className="personal-form-group">
                <div className="personal-label">姓名</div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="personal-input personal-input-disabled"
                />
              </div>
              <div className="personal-form-group">
                <div className="personal-label">出生日期</div>
                <div className="personal-date-input personal-input-disabled">
                  {formData.birthDate}
                </div>
              </div>
              <div className="personal-form-group">
                <div className="personal-label">生理性別</div>
                <div className="personal-gender-input personal-input-disabled">
                  {formData.gender}
                </div>
              </div>
              <div className="personal-form-group">
                <div className="personal-label">身分證字號</div>
                <div className="personal-input-container">
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    readOnly
                    className="personal-input personal-input-disabled"
                  />
                </div>
              </div>
              <div className="personal-form-group">
                <div className="personal-label">戶籍地址</div>
                <input
                  type="text"
                  name="residenceAddress"
                  value={formData.residenceAddress}
                  onChange={handleInputChange}
                  className="personal-input"
                  disabled={isSubmitting}
                />
              </div>
              <div className="personal-form-group">
                <div className="personal-label">通訊地址</div>
                <input
                  type="text"
                  name="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={handleInputChange}
                  className="personal-input"
                  disabled={isSubmitting}
                />
              </div>
              <div className="personal-form-group">
                <div className="personal-label">手機</div>
                <div className="personal-input-container">
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`personal-input ${errors.mobile ? 'personal-input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.mobile && (
                    <div className="personal-error-text">{errors.mobile}</div>
                  )}
                </div>
              </div>
              <div className="personal-form-group">
                <div className="personal-label">市話</div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="personal-input"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="personal-button-container">
              <button 
                className="personal-cancel-button" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button 
                className={`personal-submit-button ${isSubmitting ? 'personal-submit-button-disabled' : ''}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '更新中...' : '送出'}
              </button>
            </div>
          </div>
        ) : (
          <div className="personal-content">
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">基本資料</div>
                <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handleEdit(); }}>修改</a>
              </div>
              <div className="personal-row">
                <div className="personal-label">姓名</div>
                <div className="personal-value">{formData.name}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">出生日期</div>
                <div className="personal-value">{formData.birthDate}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">生理性別</div>
                <div className="personal-value">{formData.gender}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">身分證字號</div>
                <div className="personal-value">{formData.idNumber}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">戶籍地址</div>
                <div className="personal-value">{formData.residenceAddress}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">通訊地址</div>
                <div className="personal-value">{formData.mailingAddress}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">手機</div>
                <div className="personal-value">{formData.mobile}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">市話</div>
                <div className="personal-value">{formData.phone}</div>
              </div>
            </div>
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">職務相關</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">排班制度</div>
                <div className="personal-value">{formData.shiftSystem}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">身分別</div>
                <div className="personal-value">{formData.identity}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">薪別</div>
                <div className="personal-value">{formData.salaryType}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">部門</div>
                <div className="personal-value">{formData.department}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">職稱</div>
                <div className="personal-value">{formData.jobTitle}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">職等</div>
                <div className="personal-value">{formData.jobLevel}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">受訓後管制</div>
                <div className="personal-value">{formData.trainingControlDate}</div>
              </div>
            </div>
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">退休金勞工自提</div>
                <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handlePensionEdit(); }}>修改</a>
              </div>
              <div className="personal-row">
                <div className="personal-label">勞退金-自提</div>
                <div className="personal-value">{formData.pensionContribution}</div>
              </div>
            </div>
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">健保</div>
                <a href="#" className="personal-edit-link" onClick={(e) => { e.preventDefault(); handleHealthInsuranceEdit(); }}>修改</a>
              </div>
              <div className="personal-row">
                <div className="personal-label">眷屬投保</div>
                <div className="personal-value">{formData.dependentsInsured}</div>
              </div>
            </div>
            <div className="personal-section">
              <div className="personal-section-header">
                <div className="personal-section-title">系統設定</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">帳號</div>
                <div className="personal-value">{formData.account}</div>
              </div>
              <div className="personal-row">
                <div className="personal-label">密碼</div>
                <div className="personal-value">
                  <button className="personal-reset-password-btn" onClick={handleResetPassword}>重設密碼</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalData;
