import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEnvelope, faLock, faSignInAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';

const TunQueryResultsPmxLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const LOGIN_API_URL = 'https://pmxsso.54ucl.com/api/login';
  const CLIENT_ID = '392f3479-f075-4b97-bd29-8baa8522df9e';
  const CLIENT_SECRET = 'UWXJVkst2assIQriA2cBS939Ov4AVVKP7HBXW-WzYXg';

  // SSO 登入處理
  const handleSSOLogin = () => {
    // 跳轉到查詢頁面專用的 SSO 登入
    navigate('/tunqueryresultspmxlogin/sso');
  };

  // 處理登入
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      setLoginError('請輸入帳號和密碼');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await axios.post(LOGIN_API_URL, {
        email: loginForm.email,
        password: loginForm.password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Set-Session': 'true'
        },
        timeout: 10000
      });

      if (response.data && response.data.access_token) {
        // 登入成功
        const { access_token, token_type, id_token, refresh_token } = response.data;
        
        // 儲存 token 到 localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token_type', token_type);
        localStorage.setItem('id_token', id_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // 儲存用戶資訊
        const userInfo = {
          email: loginForm.email,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        
        // 清空登入表單
        setLoginForm({ email: '', password: '' });
        
        // 通知父組件登入成功
        if (onLoginSuccess) {
          onLoginSuccess(userInfo);
        }
        
        // 登入成功後跳轉到指定頁面
        navigate('/tunqueryresultspmx');
        
      } else {
        setLoginError('登入失敗：伺服器回應格式錯誤');
      }
    } catch (err) {
      console.error('登入錯誤:', err);
      
      let errorMessage = '登入失敗：';
      if (err.response?.status === 401) {
        errorMessage += '帳號或密碼錯誤';
      } else if (err.response?.status === 400) {
        errorMessage += '請求參數錯誤';
      } else if (err.response?.status >= 500) {
        errorMessage += '伺服器暫時無法回應，請稍後再試';
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage += '連線超時，請檢查網路狀態';
      } else {
        errorMessage += err.response?.data?.message || err.message || '未知錯誤';
      }
      
      setLoginError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  // 處理登入表單變更
  const handleLoginFormChange = (field, value) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除錯誤訊息
    if (loginError) {
      setLoginError('');
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        margin: '20px',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}>
          <FontAwesomeIcon 
            icon={faSignInAlt} 
            size="3x" 
            style={{ color: '#1976d2', marginBottom: '20px' }} 
          />
          <h2 style={{ 
            margin: '0 0 10px 0', 
            color: '#333',
            fontSize: '28px',
            fontWeight: '600'
          }}>
            系統登入
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#666', 
            fontSize: '14px' 
          }}>
            請輸入您的帳號和密碼
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: '#666' }} />
              電子郵件
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => handleLoginFormChange('email', e.target.value)}
              placeholder="請輸入您的電子郵件"
              required
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                backgroundColor: loginLoading ? '#f5f5f5' : 'white',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1976d2';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px', color: '#666' }} />
              密碼
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => handleLoginFormChange('password', e.target.value)}
              placeholder="請輸入您的密碼"
              required
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                backgroundColor: loginLoading ? '#f5f5f5' : 'white',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1976d2';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
              }}
            />
          </div>

          {loginError && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2',
            }}>
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loginLoading ? '#b0bec5' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loginLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '15px',
            }}
            onMouseEnter={(e) => {
              if (!loginLoading) {
                e.target.style.backgroundColor = '#1565c0';
              }
            }}
            onMouseLeave={(e) => {
              if (!loginLoading) {
                e.target.style.backgroundColor = '#1976d2';
              }
            }}
          >
            {loginLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                登入中...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} />
                登入
              </>
            )}
          </button>
        </form>

        {/* SSO 登入按鈕 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#ddd',
            }}></div>
            <span style={{
              margin: '0 15px',
              color: '#666',
              fontSize: '14px',
            }}>
              或
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#ddd',
            }}></div>
          </div>

          <button
            type="button"
            onClick={handleSSOLogin}
            disabled={loginLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loginLoading ? '#b0bec5' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loginLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
            onMouseEnter={(e) => {
              if (!loginLoading) {
                e.target.style.backgroundColor = '#1976d2';
              }
            }}
            onMouseLeave={(e) => {
              if (!loginLoading) {
                e.target.style.backgroundColor = '#2196f3';
              }
            }}
          >
            <FontAwesomeIcon icon={faUserShield} />
            使用 SSO 登入
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '12px', 
            color: '#6c757d',
            lineHeight: '1.4'
          }}>
            登入後即可使用多員工打卡記錄查詢功能
          </p>
        </div>
      </div>
    </div>
  );
};

export default TunQueryResultsPmxLogin;
