import React, { useState, useEffect } from 'react';
import { useAuth } from '../Hook/useAuth';
import Sidebar from '../Sidebar';
import uploadIcon from '../ICON/image_upload.png';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../config';
import './CompanyInformation.css';

const CompanyInformation = () => {
  const { hasValidAuth, logout } = useAuth();

  // 🔥 簡單的 token 驗證
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ CompanyInformation Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    console.log('✅ CompanyInformation Token 驗證通過');
  }, [hasValidAuth, logout]);

  // 🔥 新增：API 相關狀態
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isNewCompany, setIsNewCompany] = useState(false); // 是否為新公司

  // 🔥 修改：將欄位名稱對應到 API 格式
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_id: '',
    registered_address: '',
    phone: '',
    fax: '',
    email: '',
    employee_id: '',
    admin_email: '',
    password: '',
    contact_name: '',
    id_number: '',
    birth_date: '',
    gender: '男',
    contact_phone: '',
    contact_email: '',
    mailing_address: '',
    household_address: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 權限相關狀態
  const [userPermissions, setUserPermissions] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(null);
  const [hasCompanyDataPermission, setHasCompanyDataPermission] = useState(false);

  // 🔥 新增：查詢公司資料 API
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      const companyId = Cookies.get('company_id') || '12345678';
      console.log('🔥 查詢公司資料，統編:', companyId);

      const response = await fetch(`${API_BASE_URL}/api/company/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      console.log('🔥 公司資料查詢回應:', result);

      if (response.ok && result.Status === 'Ok') {
        // 成功取得資料
        setCompanyData(result.Data);
        setIsNewCompany(false);
        console.log('✅ 公司資料載入成功');
      } else if (response.status === 404) {
        // 公司不存在，設為新公司模式
        console.log('🔥 公司資料不存在，進入新增模式');
        setIsNewCompany(true);
        setIsEditing(true); // 自動進入編輯模式
        // 設定預設統編
        setCompanyData(prev => ({
          ...prev,
          company_id: companyId
        }));
      } else {
        console.error('查詢公司資料失敗:', result.Msg);
        setApiError(result.Msg || '查詢公司資料失敗');
      }
    } catch (error) {
      console.error('查詢公司資料失敗:', error);
      setApiError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 新增：儲存公司資料 API
  const saveCompanyData = async () => {
    try {
      setLoading(true);
      setApiError(null);

      // 驗證必要欄位
      if (!companyData.company_name || !companyData.company_id) {
        setApiError('請填寫公司名稱和統編');
        return;
      }

      const url = isNewCompany 
        ? `${API_BASE_URL}/api/company`
        : `${API_BASE_URL}/api/company/${companyData.company_id}`;
      
      const method = isNewCompany ? 'POST' : 'PUT';

      console.log(`🔥 ${isNewCompany ? '新增' : '更新'}公司資料:`, companyData);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(companyData)
      });

      const result = await response.json();
      console.log(`🔥 ${isNewCompany ? '新增' : '更新'}公司資料回應:`, result);

      if (response.ok && result.Status === 'Ok') {
        console.log(`✅ 公司資料${isNewCompany ? '新增' : '更新'}成功`);
        setCompanyData(result.Data);
        setIsNewCompany(false);
        setIsEditing(false);
        
        // 顯示成功訊息
        alert(`公司資料${isNewCompany ? '新增' : '更新'}成功！`);
      } else {
        console.error(`${isNewCompany ? '新增' : '更新'}公司資料失敗:`, result.Msg);
        setApiError(result.Msg || `${isNewCompany ? '新增' : '更新'}公司資料失敗`);
      }
    } catch (error) {
      console.error(`${isNewCompany ? '新增' : '更新'}公司資料失敗:`, error);
      setApiError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 查詢用戶權限
  const fetchUserPermissions = async () => {
    if (!hasValidAuth()) {
      console.log('❌ 查詢用戶權限時 Token 驗證失敗');
      logout();
      return;
    }

    try {
      setPermissionLoading(true);
      setPermissionError(null);
      
      const companyId = Cookies.get('company_id') || '76014406';
      const currentUserId = Cookies.get('employee_id') || Cookies.get('user_id');
      
      if (!currentUserId) {
        console.warn('無法獲取當前用戶ID');
        setHasCompanyDataPermission(false);
        return;
      }

      console.log('🔥 查詢用戶權限，公司ID:', companyId, '用戶ID:', currentUserId);

      const response = await fetch(`${API_BASE_URL}/api/company/employee-permissions?company_id=${companyId}&permissions=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      console.log('🔥 權限查詢回應:', result);

      if (response.ok && result.Status === 'Ok') {
        const permissionsData = result.Data?.permissions || [];
        
        const currentUserPermission = permissionsData.find(emp => 
          emp.employee_id === currentUserId || emp.id.toString() === currentUserId
        );

        console.log('🔥 當前用戶權限資料:', currentUserPermission);

        if (currentUserPermission) {
          setUserPermissions(currentUserPermission);
          const hasPermission = currentUserPermission.company_data === 1;
          setHasCompanyDataPermission(hasPermission);
          console.log('🔥 company_data 欄位值:', currentUserPermission.company_data);
          console.log('🔥 公司資料權限:', hasPermission ? '有權限 (1)' : '沒有權限 (0)');
        } else {
          console.log('🔥 找不到用戶權限資料');
          setHasCompanyDataPermission(false);
        }
      } else {
        console.error('查詢權限失敗:', result.Msg);
        setPermissionError(result.Msg || '查詢權限失敗');
        setHasCompanyDataPermission(false);
      }
    } catch (error) {
      console.error('查詢用戶權限失敗:', error);
      setPermissionError('網路錯誤，請稍後再試');
      setHasCompanyDataPermission(false);
    } finally {
      setPermissionLoading(false);
    }
  };

  // 🔥 組件載入時查詢權限和公司資料
  useEffect(() => {
    const initializeData = async () => {
      await fetchUserPermissions();
      await fetchCompanyData();
    };
    
    initializeData();
  }, []);

  // 🔥 修改：處理輸入變更
  const handleInputChange = (field, value) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改資料時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasCompanyDataPermission && !isNewCompany) {
      console.log('🔥 沒有權限，無法修改資料');
      return;
    }

    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  // 🔥 修改：處理儲存
  const handleSave = async () => {
    if (!hasValidAuth()) {
      console.log('❌ 儲存資料時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasCompanyDataPermission && !isNewCompany) {
      alert('您沒有權限修改公司資料');
      return;
    }

    await saveCompanyData();
  };

  const handleCancel = () => {
    if (isNewCompany) {
      // 如果是新公司，取消後重新載入
      fetchCompanyData();
    } else {
      // 如果是編輯現有資料，恢復原始資料
      fetchCompanyData();
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (!hasValidAuth()) {
      console.log('❌ 編輯資料時 Token 驗證失敗');
      logout();
      return;
    }

    if (!hasCompanyDataPermission) {
      alert('您沒有權限編輯公司資料');
      return;
    }
    setIsEditing(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 🔥 載入中狀態
  if (loading || permissionLoading) {
    return (
      <div className="page-container">
        <Sidebar currentPage="company-information" />
        <div className="main-scroll-container">
          <div className="content-wrapper">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              fontSize: '16px',
              color: '#666666'
            }}>
              {permissionLoading ? '載入權限中...' : '載入資料中...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 錯誤狀態
  if (permissionError || apiError) {
    return (
      <div className="page-container">
        <Sidebar currentPage="company-information" />
        <div className="main-scroll-container">
          <div className="content-wrapper">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              gap: '20px'
            }}>
              <div style={{ fontSize: '16px', color: '#e74c3c' }}>
                {permissionError || apiError}
              </div>
              <button 
                onClick={() => {
                  if (permissionError) {
                    fetchUserPermissions();
                  }
                  if (apiError) {
                    setApiError(null);
                    fetchCompanyData();
                  }
                }}
                style={{
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const EditIcon = () => (
    <div className="edit-icon">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </div>
  );

  const EyeIcon = ({ isVisible, onClick }) => (
    <div 
      className={`eye-icon ${!isEditing ? 'visible' : 'hidden'}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
    >
      {isVisible ? (
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ) : (
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5-1.17"/>
          <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
      )}
    </div>
  );

  // 🔥 修改：渲染欄位函數
  const renderHorizontalField = (label, field, type = 'text', placeholder = '') => (
    <div className="horizontal-field-container">
      <label className="field-label">
        {label}
      </label>
      <input
        type={type}
        value={companyData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        disabled={!isEditing || (!hasCompanyDataPermission && !isNewCompany)}
        className="field-input"
      />
    </div>
  );

  const renderHorizontalSelectField = (label, field, options) => (
    <div className="horizontal-field-container">
      <label className="field-label">
        {label}
      </label>
      <select
        value={companyData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isEditing || (!hasCompanyDataPermission && !isNewCompany)}
        className="field-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const renderHorizontalPasswordField = (label, field) => (
    <div className="horizontal-field-container">
      <label className="field-label">
        {label}
      </label>
      <div className="password-container">
        <input
          type={isEditing ? 'text' : (showPassword ? 'text' : 'password')}
          value={companyData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={!isEditing || (!hasCompanyDataPermission && !isNewCompany)}
          className={`field-input password-input ${!isEditing ? 'with-eye-icon' : ''}`}
        />
        {!isEditing && (
          <EyeIcon 
            isVisible={showPassword} 
            onClick={togglePasswordVisibility}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <Sidebar currentPage="company" />

      <div className="main-scroll-container">
        <div className="content-wrapper">
          <div className="header-section">
            <h2 className="page-title">
              {isNewCompany ? '新增公司資料' : '公司基本資料'}
            </h2>

            {/* 🔥 根據權限和狀態顯示不同的按鈕 */}
            {(hasCompanyDataPermission || isNewCompany) ? (
              <button
                onClick={() => isEditing ? handleSave() : handleEdit()}
                className="edit-button"
                disabled={loading}
              >
                <EditIcon />
                <span className="edit-button-text">
                  {loading ? '處理中...' : (isEditing ? '完成' : '編輯')}
                </span>
              </button>
            ) : (
              <div style={{
                position: 'absolute',
                right: '0',
                padding: '10px 15px',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '10px',
                color: '#6c757d',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔒 唯讀模式
              </div>
            )}
          </div>

          {/* 🔥 權限提示訊息 */}
          {!hasCompanyDataPermission && !isNewCompany && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#856404',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ 您目前沒有公司資料的編輯權限，只能查看資料內容。
            </div>
          )}

          {/* 🔥 新公司提示訊息 */}
          {isNewCompany && (
            <div style={{
              background: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#155724',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ℹ️ 系統中尚未找到此公司的資料，請填寫基本資料後儲存。
            </div>
          )}

          <div className="main-content">
            <div className="basic-data-card">
              <div className="card-header">
                <h3 className="card-title">
                  基本資料
                </h3>
              </div>

              <div className="card-content">
                {renderHorizontalField('公司名稱', 'company_name')}
                {renderHorizontalField('統編', 'company_id')}
                {renderHorizontalField('登記地址', 'registered_address')}
                {renderHorizontalField('電話', 'phone', 'tel')}
                {renderHorizontalField('傳真', 'fax', 'tel')}
                {renderHorizontalField('E-mail', 'email', 'email')}
              </div>
            </div>

            <div className="right-cards-container">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    系統設定
                  </h3>
                </div>

                <div className="card-content">
                  {renderHorizontalField('管理者代號', 'employee_id')}
                  {renderHorizontalField('管理者帳號', 'admin_email', 'email')}
                  {renderHorizontalPasswordField('密碼', 'password')}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    負責人相關資料
                  </h3>
                </div>

                <div className="card-content">
                  {renderHorizontalField('姓名', 'contact_name')}
                  {renderHorizontalField('身分證字號', 'id_number')}
                  {renderHorizontalField('出生年月日', 'birth_date', 'date')}
                  {renderHorizontalSelectField('生理性別', 'gender', ['男', '女'])}
                  {renderHorizontalField('聯絡電話', 'contact_phone', 'tel')}
                  {renderHorizontalField('E-mail', 'contact_email', 'email')}
                  {renderHorizontalField('通訊地址', 'mailing_address')}
                  {renderHorizontalField('戶籍地址', 'household_address')}
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 只有有權限且在編輯模式下才顯示浮動按鈕 */}
          {isEditing && (hasCompanyDataPermission || isNewCompany) && (
            <div className="floating-button-container">
              <button
                onClick={handleCancel}
                className="cancel-button"
                disabled={loading}
              >
                <span className="button-main-text">取消</span>
                <span className="button-sub-text">捨棄資料</span>
              </button>

              <button
                onClick={handleSave}
                className="complete-button"
                disabled={loading}
              >
                <span className="button-main-text">
                  {loading ? '處理中...' : '完成'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;
