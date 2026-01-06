import React, { useState, useEffect, useRef, useCallback } from 'react';
import './css/AppLogIn.css';
import { useFlutterIntegration } from './Hook/hooks';
import axios from 'axios';
import Cookies from 'js-cookie';

function AppLogIn() {
  const {
    // 基本狀態
    isFlutterEnvironment,
    error,
    isLoading,
    isIOS,
    isInitialized,
    
    // 登入表單相關
    credentials, 
    passwordChange, 
    updateCredential, 
    updatePasswordField, 
    setShowPasswordChange, 
    clearForm, 
    handleLogin: originalHandleLogin, 
    handlePasswordUpdate, 
    handleForgotPassword,
    setError,
    setIsLoading,
    
    // 記住我功能
    rememberMe,
    setRememberMe,
    
    // Flutter 通訊
    sendMessageToFlutter,
    
    // Cookie 相關
    checkExistingLogin,
    clearAllLoginCookies,
    getAllLoginCookies,
    saveLoginDataToCookies
  } = useFlutterIntegration('login');

  // 創建 refs 來獲取表單元素
  const companyIdRef = useRef(null);
  const employeeIdRef = useRef(null);
  const passwordRef = useRef(null);
  
  // 防抖計時器
  const debounceTimerRef = useRef(null);

  // 防抖函數 - 減少狀態更新頻率
  const debounceUpdate = useCallback((field, value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      updateCredential(field, value);
    }, 100); // 100ms 延遲
  }, [updateCredential]);

  // 處理輸入變更 - 使用防抖
  const handleInputChange = useCallback((field, value) => {
    // 直接更新顯示值，但延遲更新狀態
    debounceUpdate(field, value);
  }, [debounceUpdate]);

// 處理登入表單提交
const handleLogin = (e) => {
  if (e) e.preventDefault();
  
  // 在提交前同步 DOM 中的實際值到 React 狀態
  if (companyIdRef.current) {
    updateCredential('company_id', companyIdRef.current.value);
  }
  
  if (employeeIdRef.current) {
    updateCredential('employee_id', employeeIdRef.current.value);
  }
  
  if (passwordRef.current) {
    updateCredential('password', passwordRef.current.value);
  }
  
  // 確保狀態更新後再繼續處理登入
  setTimeout(() => {
    // 修改這裡，使用自訂的錯誤處理函數
    const customHandleLogin = async () => {
      try {
        await originalHandleLogin();
      } catch (error) {
        // 無論什麼錯誤，都只顯示統一的訊息
        setError("統編或帳號或密碼錯誤，請重新輸入");
      }
    };
    
    customHandleLogin();
  }, 10);
};


  // 設置 cookie 的函數，過期時間為 3 小時
  const setCookieWithExpiry = (name, value) => {
    const expirationHours = 120;
    const expirationDays = expirationHours / 24;
    
    // 增強 Cookie 選項
    Cookies.set(name, value, { 
      expires: expirationDays, 
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    });
    
    console.log(`設置 Cookie: ${name} = ${name === 'password' || name === 'auth_token' || name === 'auth_xtbb' ? '[已隱藏]' : value}`);
    
    // 對於 iOS 設備，使用多種備份方式
    if (isIOS) {
      try {
        sessionStorage.setItem(`cookie_${name}`, value);
        localStorage.setItem(`temp_cookie_${name}`, value);
      } catch (error) {
        console.error(`保存 ${name} 到存儲失敗:`, error);
      }
    }
  };

  // 自動登入功能
  const handleAutoLogin = async (company_id, employee_id) => {
    if (!company_id || !employee_id) {
      setError("自動登入失敗：缺少公司統編或員工編號");
      return;
    }

    try {
      setIsLoading(true);
      
      // 呼叫自動登入 API
      const response = await axios.post('https://rabbit.54ucl.com:3004/api/employee/auto-login', {
        company_id,
        employee_id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // 檢查 API 回應格式
      console.log("API 回應:", response.data);

      if (response.data.Status === "Ok") {
        // 登入成功，將資料儲存到 cookies
        const loginData = response.data.Data || {};
        
        // 儲存基本登入資訊到 cookies
        setCookieWithExpiry('company_id', loginData.company_id.toString());
        setCookieWithExpiry('employee_id', loginData.employee_id.toString());
        
        // 儲存員工資訊
        if (loginData.name) {
          setCookieWithExpiry('employee_name', loginData.name);
          setCookieWithExpiry('user_name', loginData.name);
        }
        
        // 儲存 token
        if (loginData.xtbb) {
          setCookieWithExpiry('auth_xtbb', loginData.xtbb);
          setCookieWithExpiry('xtbb_token', loginData.xtbb);
        }
        
        // 儲存其他相關資訊
        if (loginData.department) {
          setCookieWithExpiry('department', loginData.department);
        }
        
        if (loginData.position) {
          setCookieWithExpiry('position', loginData.position);
        }
        
        if (loginData.job_grade) {
          setCookieWithExpiry('job_grade', loginData.job_grade);
        }
        
        if (loginData.company_name) {
          setCookieWithExpiry('company_name', loginData.company_name);
        }
        
        // 儲存完整的用戶資料
        setCookieWithExpiry('user_data', JSON.stringify(loginData));
        
        // 儲存登入時間
        setCookieWithExpiry('login_timestamp', new Date().toISOString());
        
        console.log('自動登入成功，已儲存所有資料到 cookies');
        
        // 通知 Flutter 登入成功
        if (isFlutterEnvironment) {
          sendMessageToFlutter('loginSuccess', {
            company_id: loginData.company_id,
            employee_id: loginData.employee_id,
            employee_name: loginData.name || '',
            token: loginData.xtbb || '',
            userData: loginData,
            rememberMe: rememberMe
          });
        } else {
          // 在瀏覽器環境中，直接跳轉到首頁
          setTimeout(() => {
            window.location.href = 'https://rabbit.54ucl.com:3003/frontpage01';
          }, 500);
        }
      } else {
        setError(response.data.Msg || "自動登入失敗");
      }
    } catch (err) {
      console.error("自動登入失敗:", err);
      setError(`自動登入失敗: ${err.response?.data?.Msg || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 檢查URL參數，處理自動登入
  useEffect(() => {
    const handleUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const autoLoginCompanyId = urlParams.get('company_id');
      const autoLoginEmployeeId = urlParams.get('employee_id');
      
      if (autoLoginCompanyId && autoLoginEmployeeId) {
        console.log("檢測到自動登入參數，嘗試自動登入");
        handleAutoLogin(autoLoginCompanyId, autoLoginEmployeeId);
      }
    };
    
    if (isInitialized) {
      handleUrlParams();
    }
  }, [isInitialized]);

  // 檢查是否有已存在的登入資料
  useEffect(() => {
    if (isInitialized) {
      const checkLogin = async () => {
        const existingLogin = await checkExistingLogin();
        if (existingLogin) {
          updateCredential('company_id', existingLogin.company_id);
          updateCredential('employee_id', existingLogin.employee_id);
          
          sendMessageToFlutter('existingLoginFound', {
            company_id: existingLogin.company_id,
            employee_id: existingLogin.employee_id,
            hasToken: existingLogin.hasToken,
            isIOS: isIOS
          });
        }
      };
      
      checkLogin();
    }
  }, [isInitialized]);

  // 處理記住我的變更
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // 如果還在初始化中，顯示加載提示
  if (!isInitialized) {
    return (
      <div className="container">
        <div className="form-wrapper">
          <div className="loading">初始化中，請稍候...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-wrapper">        
        {!passwordChange.showPasswordChange ? (
          <>
            <div className="title">登入</div>
            <form onSubmit={handleLogin}>
              <input
                ref={companyIdRef}
                type="text"
                placeholder="公司統編"
                className="input"
                defaultValue={credentials.company_id}
                onChange={(e) => handleInputChange('company_id', e.target.value)}
                disabled={isLoading}
              />
              <input
                ref={employeeIdRef}
                type="text"
                placeholder="帳號"
                className="input"
                defaultValue={credentials.employee_id}
                onChange={(e) => handleInputChange('employee_id', e.target.value)}
                disabled={isLoading}
              />
              <input
                ref={passwordRef}
                type="password"
                placeholder="密碼"
                className="input"
                defaultValue={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
              />
              
              {/* 記住我選項 */}
              <div className="remember-me">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    disabled={isLoading}
                  />
                  <span>記住我</span>
                </label>
              </div>
              
              <div className="button-group">
                <button
                  type="button"
                  className="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  忘記密碼
                </button>
                <button
                  type="submit"
                  className="button primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? '登入中...' : '登入'}
                </button>
              </div>
            </form>
            {error && <div className="error">{error}</div>}
            {isLoading && <div className="loading">處理中，請稍候...</div>}
          </>
        ) : (
          <>
            <div className="title">變更密碼</div>
            <div className="congrats-text">
              恭喜加入新公司，請更改密碼後再登入
            </div>
            <input
              type="password"
              placeholder="新密碼"
              className="input"
              value={passwordChange.newPassword}
              onChange={e => updatePasswordField('newPassword', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="確認新密碼"
              className="input"
              value={passwordChange.confirmPassword}
              onChange={e => updatePasswordField('confirmPassword', e.target.value)}
              disabled={isLoading}
            />
            {error && <div className="error">{error}</div>}
            {isLoading && <div className="loading">處理中，請稍候...</div>}
            <button
              className="full-width-button"
              onClick={handlePasswordUpdate}
              disabled={isLoading}
            >
              {isLoading ? '處理中...' : '更新密碼並登入'}
            </button>
            <button
              className="secondary-button"
              onClick={() => setShowPasswordChange(false)}
              disabled={isLoading}
            >
              返回登入
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AppLogIn;
