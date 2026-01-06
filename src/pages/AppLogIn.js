import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // 需要安裝: npm install js-cookie

// 配置
// 根據環境選擇適當的 REDIRECT_URI
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const REDIRECT_URI = isLocalhost 
  ? "http://localhost:3000/applogin/" 
  : "https://rabbit.54ucl.com:3003/applogin";

// 根據 REDIRECT_URI 選擇對應的 CLIENT_ID 和 CLIENT_SECRET
const CLIENT_ID = isLocalhost 
  ? "4d6ebbbb-66fb-4a4e-880b-91291bb923b7" 
  : "9243701f-8638-4f75-b100-9301337e6cee";
const CLIENT_SECRET = isLocalhost 
  ? "8lpJW-yj5wiVVG5lY1sqMmijQDQ7NlMn8P32JNhW87Y" 
  : "odxlyucNA2vmzI4Txl8fBIncBxz3n8pQkq-1nO-gn7I";

const IDP_BASE_URL = "https://identityprovider.54ucl.com:1989";
const EMAIL_SUFFIX = "@2330.rm";

// 檢查並顯示當前使用的配置
console.log("當前環境配置:");
console.log("REDIRECT_URI:", REDIRECT_URI);
console.log("CLIENT_ID:", CLIENT_ID);
console.log("CLIENT_SECRET:", CLIENT_SECRET.substring(0, 5) + "...");

// SQLite 操作工具函數
const initDatabase = async () => {
  try {
    // 檢查是否支援 IndexedDB (用於在瀏覽器中模擬 SQLite)
    if (!window.indexedDB) {
      console.error("您的瀏覽器不支援 IndexedDB，無法使用本地數據庫功能");
      return null;
    }
    
    // 打開或創建數據庫
    const request = window.indexedDB.open("authDatabase", 1);
    
    // 處理數據庫升級事件
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 創建存儲 token 的對象存儲
      if (!db.objectStoreNames.contains("tokens")) {
        const tokenStore = db.createObjectStore("tokens", { keyPath: "id" });
        tokenStore.createIndex("tokenType", "tokenType", { unique: false });
      }
      
      // 創建存儲用戶信息的對象存儲
      if (!db.objectStoreNames.contains("userInfo")) {
        const userStore = db.createObjectStore("userInfo", { keyPath: "id" });
      }
    };
    
    // 返回一個 Promise，在數據庫打開成功時解析
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        console.error("數據庫打開失敗:", event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("初始化數據庫失敗:", error);
    return null;
  }
};

// 保存 token 到數據庫
const saveTokenToDatabase = async (tokenData) => {
  try {
    const db = await initDatabase();
    if (!db) return false;
    
    const transaction = db.transaction(["tokens"], "readwrite");
    const tokenStore = transaction.objectStore("tokens");
    
    // 保存 access_token
    await tokenStore.put({
      id: "access_token",
      tokenType: "access",
      value: tokenData.access_token,
      expiresAt: Date.now() + 3600000 // 假設 1 小時有效期
    });
    
    // 保存 id_token
    if (tokenData.id_token) {
      await tokenStore.put({
        id: "id_token",
        tokenType: "id",
        value: tokenData.id_token,
        expiresAt: Date.now() + 3600000 // 假設 1 小時有效期
      });
    }
    
    // 保存 refresh_token
    if (tokenData.refresh_token) {
      await tokenStore.put({
        id: "refresh_token",
        tokenType: "refresh",
        value: tokenData.refresh_token,
        expiresAt: Date.now() + 7 * 24 * 3600000 // 假設 7 天有效期
      });
    }
    
    return true;
  } catch (error) {
    console.error("保存 token 到數據庫失敗:", error);
    return false;
  }
};

// 保存用戶信息到數據庫
const saveUserInfoToDatabase = async (employee_id) => {
  try {
    const db = await initDatabase();
    if (!db) return false;
    
    const transaction = db.transaction(["userInfo"], "readwrite");
    const userStore = transaction.objectStore("userInfo");
    
    await userStore.put({
      id: "currentUser",
      employee_id: employee_id,
      lastLogin: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("保存用戶信息到數據庫失敗:", error);
    return false;
  }
};

// 添加檢查存儲的 Token 函數
const checkStoredTokens = async () => {
  console.log("=== 檢查存儲的 Token ===");
  
  // 檢查 Cookies
  console.log("--- Cookies ---");
  console.log('Access Token:', Cookies.get('access_token'));
  console.log('ID Token:', Cookies.get('id_token'));
  console.log('Refresh Token:', Cookies.get('refresh_token'));
  
  // 檢查 localStorage
  console.log("--- localStorage ---");
  console.log('Access Token:', localStorage.getItem('access_token'));
  console.log('ID Token:', localStorage.getItem('id_token'));
  console.log('Refresh Token:', localStorage.getItem('refresh_token'));
  
  // 檢查 IndexedDB
  try {
    const db = await initDatabase();
    if (db) {
      const transaction = db.transaction(["tokens"], "readonly");
      const tokenStore = transaction.objectStore("tokens");
      
      console.log("--- IndexedDB ---");
      
      // 獲取 access_token
      const accessTokenRequest = tokenStore.get("access_token");
      await new Promise(resolve => {
        accessTokenRequest.onsuccess = () => {
          console.log("Access Token:", accessTokenRequest.result?.value);
          resolve();
        };
      });
      
      // 獲取 id_token
      const idTokenRequest = tokenStore.get("id_token");
      await new Promise(resolve => {
        idTokenRequest.onsuccess = () => {
          console.log("ID Token:", idTokenRequest.result?.value);
          resolve();
        };
      });
      
      // 獲取 refresh_token
      const refreshTokenRequest = tokenStore.get("refresh_token");
      await new Promise(resolve => {
        refreshTokenRequest.onsuccess = () => {
          console.log("Refresh Token:", refreshTokenRequest.result?.value);
          resolve();
        };
      });
    }
  } catch (error) {
    console.error("檢查 IndexedDB 失敗:", error);
  }
};

function AppLogInForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [company_id, setCompany_id] = useState('');
  const [employee_id, setEmployee_id] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({});

  // 保存認證信息到 cookies 和 SQLite
  const saveAuthInfo = async (tokenData, employeeId) => {
    try {
      // 保存到 cookies (設置 7 天過期)
      const cookieOptions = { expires: 7, secure: true, sameSite: 'strict' };
      Cookies.set('access_token', tokenData.access_token, cookieOptions);
      
      if (tokenData.id_token) {
        Cookies.set('id_token', tokenData.id_token, cookieOptions);
      }
      
      if (tokenData.refresh_token) {
        Cookies.set('refresh_token', tokenData.refresh_token, cookieOptions);
      }
      
      Cookies.set('employee_id', employeeId, cookieOptions);
      
      // 保存到 localStorage (作為備份)
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('employee_id', employeeId);
      
      if (tokenData.id_token) {
        localStorage.setItem('id_token', tokenData.id_token);
      }
      
      if (tokenData.refresh_token) {
        localStorage.setItem('refresh_token', tokenData.refresh_token);
      }
      
      // 保存到 SQLite
      await saveTokenToDatabase(tokenData);
      await saveUserInfoToDatabase(employeeId);
      
      console.log("認證信息已保存到 cookies 和數據庫");
      return true;
    } catch (error) {
      console.error("保存認證信息失敗:", error);
      return false;
    }
  };

  // 處理一般登入按鈕點擊
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!employee_id || !password) {
        setError('請輸入員工帳號和密碼');
        setIsLoading(false);
        return;
      }
      
      // 將使用者名稱加上後綴，保留原始輸入（包括前綴 'f'）
      const email = employee_id + EMAIL_SUFFIX;
      
      // 呼叫 API 進行登入驗證
      const response = await axios.post(`${IDP_BASE_URL}/api/login`, {
        email: email,
        password: password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });
      
      console.log("登入回應:", response.data);
      
      // 處理登入成功的回應
      if (response.data && response.data.access_token) {
        // 保存認證信息
        await saveAuthInfo(response.data, employee_id);
        
        // 檢查是否需要更改密碼
        if (response.data.password_change_required) {
          setShowPasswordChange(true);
        } else {
          setIsAuthenticated(true);
          navigate('/frontpage');
        }
      } else {
        setError('登入失敗，請檢查您的憑證');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("登入錯誤:", err);
      setError(`登入失敗: ${err.response?.data?.message || err.message}`);
      setIsLoading(false);
    }
  };

  // 處理 SSO 登入按鈕點擊
  const handleSSOLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      console.log("嘗試 SSO 登入...");
      
      // 根據 Postman 截圖，使用相同的請求格式
      const response = await axios.post(`${IDP_BASE_URL}/api/login`, {
        email: "f113118122@2330.rm", // 使用預設的測試帳號
        password: "123456789",       // 使用預設的測試密碼
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });
      
      console.log("SSO 登入回應:", response.data);
      
      // 處理成功的回應
      if (response.data && response.data.access_token) {
        // 從 id_token 解析用戶信息
        let extractedEmployeeId = "f113118122"; // 預設值
        
        if (response.data.id_token) {
          try {
            const payload = parseJwt(response.data.id_token);
            console.log("解析的 id_token:", payload);
            
            if (payload.sub) {
              // 從 sub 或 email 提取員工 ID
              const email = payload.email || payload.sub;
              extractedEmployeeId = email.split('@')[0];
            }
          } catch (e) {
            console.error("解析 token 失敗:", e);
          }
        }
        
        // 保存認證信息
        await saveAuthInfo(response.data, extractedEmployeeId);
        
        // 顯示 token 信息（用於調試）
        if (response.data.id_token) {
          const decodedToken = parseJwt(response.data.id_token);
          setTokenInfo({
            accessToken: response.data.access_token.substring(0, 20) + "...",
            idToken: response.data.id_token.substring(0, 20) + "...",
            refreshToken: response.data.refresh_token ? 
              response.data.refresh_token.substring(0, 20) + "..." : "無",
            decoded: decodedToken
          });
          setShowTokenInfo(true);
        }
        
        // 檢查是否需要更改密碼
        if (response.data.password_change_required) {
          setShowPasswordChange(true);
        } else {
          setIsAuthenticated(true);
          // 如果不需要顯示 token 信息，則直接導航
          if (!showTokenInfo) {
            navigate('/frontpage');
          }
        }
      } else {
        setError('SSO 登入失敗，缺少必要的 token');
      }
    } catch (err) {
      console.error("SSO 登入錯誤:", err);
      console.error("錯誤詳情:", err.response?.data);
      setError(`SSO 登入失敗: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 輔助函數：解析 JWT token
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT 解析錯誤:", e);
      return {};
    }
  }

  // 更新密碼
  const updateEmployeePassword = async () => {
    try {
      if (!newPassword || newPassword !== confirmPassword) {
        setError('新密碼不一致，請重新輸入');
        return;
      }
      if (newPassword.length < 8) {
        setError('新密碼長度不足，請至少輸入8個字符');
        return;
      }
      if (/^[A-Za-z][0-9]{9}$/.test(newPassword)) {
        setError('新密碼不能為身分證字號格式');
        return;
      }
      setIsLoading(true);
      setError('');
      
      // 取得儲存的 token
      const token = Cookies.get('access_token') || localStorage.getItem('access_token');
      
      // 呼叫 API 更新密碼
      const response = await axios.post(`${IDP_BASE_URL}/api/change-password`, {
        new_password: newPassword,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        setShowPasswordChange(false);
        setIsAuthenticated(true);
        navigate('/frontpage');
      } else {
        setError('更新密碼失敗，請稍後再試');
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(`更新密碼失敗: ${err.response?.data?.message || err.message}`);
      setIsLoading(false);
    }
  };

  // 檢查 token 函數
  const handleCheckTokens = async () => {
    await checkStoredTokens();
    
    // 從 IndexedDB 獲取 token
    try {
      const db = await initDatabase();
      if (db) {
        const transaction = db.transaction(["tokens"], "readonly");
        const tokenStore = transaction.objectStore("tokens");
        
        // 獲取 id_token
        const idTokenRequest = tokenStore.get("id_token");
        await new Promise(resolve => {
          idTokenRequest.onsuccess = () => {
            if (idTokenRequest.result?.value) {
              const decodedToken = parseJwt(idTokenRequest.result.value);
              setTokenInfo({
                accessToken: "從 IndexedDB 獲取",
                idToken: idTokenRequest.result.value.substring(0, 20) + "...",
                decoded: decodedToken
              });
              setShowTokenInfo(true);
            } else {
              setError("未找到 ID Token，請先登入");
            }
            resolve();
          };
        });
      }
    } catch (error) {
      console.error("檢查 IndexedDB 失敗:", error);
      setError("檢查 token 失敗");
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    formWrapper: {
      width: '100%',
      maxWidth: '360px',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box',
    },
    title: {
      marginBottom: '1.5rem',
      fontSize: '1.625rem',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      margin: '0.75rem 0',
      border: '1px solid #ddd',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1.5rem',
    },
    button: {
      width: '45%',
      padding: '0.75rem',
      borderRadius: '0.25rem',
      border: '1px solid #3a75b5',
      backgroundColor: 'white',
      color: '#3a75b5',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'background-color 0.3s, color 0.3s',
    },
    fullWidthButton: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.25rem',
      border: '1px solid #3a75b5',
      backgroundColor: '#3a75b5',
      color: 'white',
      cursor: 'pointer',
      fontSize: '0.875rem',
      marginTop: '1rem',
      transition: 'background-color 0.3s',
    },
    primaryButton: {
      backgroundColor: '#3a75b5',
      color: 'white',
    },
    ssoLogin: {
      marginTop: '1rem',
      display: 'flex',
      justifyContent: 'center',
    },
    ssoButton: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.25rem',
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'background-color 0.3s',
    },
    error: {
      color: 'red',
      marginTop: '1rem',
      textAlign: 'center',
      fontSize: '0.95rem',
    },
    loading: {
      color: '#3a75b5',
      marginTop: '1rem',
      textAlign: 'center',
      fontSize: '0.95rem',
    },
    infoText: {
      color: '#666',
      marginTop: '1rem',
      textAlign: 'center',
      fontSize: '0.85rem',
    },
    congratsText: {
      color: '#4CAF50',
      marginTop: '1rem',
      textAlign: 'center',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    emailSuffix: {
      color: '#666',
      fontSize: '0.75rem',
      marginTop: '-0.5rem',
      marginLeft: '0.75rem',
      marginBottom: '0.5rem',
    },
    divider: {
      margin: '1.5rem 0',
      borderTop: '1px solid #ddd',
      position: 'relative',
    },
    dividerText: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      padding: '0 10px',
      color: '#666',
      fontSize: '0.85rem',
    },
    tokenInfo: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      maxHeight: '200px',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    },
    debugButton: {
      backgroundColor: '#f0f0f0',
      color: '#666',
      border: '1px solid #ddd',
      borderRadius: '0.25rem',
      padding: '0.5rem',
      fontSize: '0.75rem',
      cursor: 'pointer',
      marginTop: '1rem',
      width: '100%',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        {showTokenInfo ? (
          <>
            <div style={styles.title}>Token 信息</div>
            <div style={styles.tokenInfo}>
              <p><strong>Access Token:</strong> {tokenInfo.accessToken}</p>
              <p><strong>ID Token:</strong> {tokenInfo.idToken}</p>
              {tokenInfo.refreshToken && <p><strong>Refresh Token:</strong> {tokenInfo.refreshToken}</p>}
              <p><strong>解析的 ID Token:</strong></p>
              <pre>{JSON.stringify(tokenInfo.decoded, null, 2)}</pre>
            </div>
            <button
              style={styles.fullWidthButton}
              onClick={() => {
                setShowTokenInfo(false);
                navigate('/frontpage');
              }}
            >
              繼續前往首頁
            </button>
          </>
        ) : !showPasswordChange ? (
          <>
            <div style={styles.title}>登入</div>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="公司統編"
                style={styles.input}
                value={company_id}
                onChange={e => setCompany_id(e.target.value)}
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="員工帳號"
                style={styles.input}
                value={employee_id}
                onChange={e => setEmployee_id(e.target.value)}
                disabled={isLoading}
              />
              <div style={styles.emailSuffix}>
                登入時將自動添加 {EMAIL_SUFFIX} 後綴
              </div>
              <input
                type="password"
                placeholder="密碼"
                style={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.button}
                  onClick={() => setError('請聯絡管理員重設密碼')}
                  disabled={isLoading}
                >
                  忘記密碼
                </button>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                  disabled={isLoading}
                >
                  {isLoading ? '登入中...' : '登入'}
                </button>
              </div>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            {isLoading && <div style={styles.loading}>處理中，請稍候...</div>}
            
            <div style={styles.divider}>
              <span style={styles.dividerText}>或</span>
            </div>
            
            <div style={styles.ssoLogin}>
              <button 
                style={styles.ssoButton}
                onClick={handleSSOLogin}
                disabled={isLoading}
              >
                {isLoading ? '處理中...' : 'SSO 快速登入'}
              </button>
            </div>
            
            {/* 添加檢查 token 的按鈕 */}
            <button
              style={styles.debugButton}
              onClick={handleCheckTokens}
            >
              檢查已存儲的 Token
            </button>
            
            {/* 顯示當前環境信息 */}
            <div style={{...styles.infoText, fontSize: '0.7rem', marginTop: '0.5rem'}}>
              環境: {isLocalhost ? '本地開發' : '生產環境'}<br/>
              REDIRECT_URI: {REDIRECT_URI}
            </div>
          </>
        ) : (
          <>
            <div style={styles.title}>變更密碼</div>
            <div style={styles.congratsText}>
              恭喜加入新公司，請更改密碼後再登入
            </div>
            <input
              type="password"
              placeholder="新密碼"
              style={styles.input}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="確認新密碼"
              style={styles.input}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && <div style={styles.error}>{error}</div>}
            {isLoading && <div style={styles.loading}>處理中，請稍候...</div>}
            <button
              style={styles.fullWidthButton}
              onClick={updateEmployeePassword}
              disabled={isLoading}
            >
              {isLoading ? '處理中...' : '更新密碼並登入'}
            </button>
            <button
              style={{
                ...styles.button,
                width: '100%',
                marginTop: '0.75rem',
                backgroundColor: 'white'
              }}
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

function AppLogIn() {
  return <AppLogInForm />;
}

export default AppLogIn;
