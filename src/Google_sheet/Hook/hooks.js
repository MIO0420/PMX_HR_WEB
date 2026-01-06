import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { employeeLogin, updateEmployeePassword } from '../function/function';

/**
 * 統一的 Flutter 通訊 Hook，整合了所有 Flutter-Web 通訊功能
 * @param {string} handlerType - 處理器類型，可選值: 'login'(預設) 或 'home'
 * @returns {Object} - 包含所有通訊和功能的物件
 */
export function useFlutterIntegration(handlerType = 'login') {
  // 基本狀態
  const [isFlutterEnvironment, setIsFlutterEnvironment] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 記住我功能
  const [rememberMe, setRememberMe] = useState(() => {
    // 從 localStorage 讀取記住我的狀態，預設為 true
    const savedRememberMe = localStorage.getItem('rememberMe');
    return savedRememberMe !== null ? savedRememberMe !== 'false' : true;
  });
  
  // 登入表單狀態
  const [credentials, setCredentials] = useState({
    company_id: '',
    employee_id: '',
    password: ''
  });
  
  // 密碼變更狀態
  const [passwordChange, setPasswordChange] = useState({
    showPasswordChange: false,
    newPassword: '',
    confirmPassword: ''
  });

  // 根據不同的處理器類型設定對應的處理器名稱
  const FLUTTER_HANDLER_NAME = handlerType === 'home' ? 'HomePageHandler' : 'LoginHandler';
  const JS_FUNCTION_PREFIX = handlerType === 'home' ? 'flutterToHome' : 'flutterToWeb';

  // 檢查是否在 Flutter WebView 環境中
  useEffect(() => {
    const initialize = async () => {
      try {
        // 檢查是否在 Flutter 環境中運行
        const isInFlutter = window.flutter !== undefined || 
                            window.flutterInAppWebViewPlatformReady !== undefined ||
                            window.flutter_inappwebview !== undefined;
        setIsFlutterEnvironment(isInFlutter);
        console.log('是否在 Flutter 環境中:', isInFlutter);
        
        // 檢測是否為 iOS 設備
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);
        console.log('是否為 iOS 設備:', isIOSDevice);
        
        if (isIOSDevice) {
          // 初始化 IndexedDB 以確保可用
          await initIndexedDB();
          console.log('iOS 設備: IndexedDB 初始化完成');
        }
        
        // 註冊 Flutter 可調用的 JS 函數
        registerFlutterJSFunctions();
        
        // 檢查 Web 存儲是否可用
        await checkWebStorageAvailability();
        
        // 嘗試從 localStorage 和 IndexedDB 載入已保存的登入資訊
        await loadSavedCredentials();
        
        // 標記初始化完成
        setIsInitialized(true);
        console.log('初始化完成');
      } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
        // 即使出錯也標記為完成，以便用戶可以操作
        setIsInitialized(true);
      }
    };
    
    initialize();
    
    // 清理函數
    return () => {
      unregisterFlutterJSFunctions();
    };
  }, []);

  // 檢查 Web 存儲是否可用
  const checkWebStorageAvailability = async () => {
    try {
      // 測試 localStorage
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      
      // 測試 IndexedDB (如果是 iOS)
      if (isIOS) {
        await saveToIndexedDB('test', 'test');
        await removeFromIndexedDB('test');
      }
      
      console.log('Web 存儲可用');
      return true;
    } catch (error) {
      console.error('Web 存儲不可用:', error);
      
      // 通知 Flutter 使用原生存儲
      if (isFlutterEnvironment) {
        sendMessageToFlutter('webStorageUnavailable', {
          isIOS: isIOS
        });
      }
      return false;
    }
  };

  // 當 rememberMe 狀態改變時，保存到 localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        // 如果取消記住我，清除已保存的資訊
        if (!rememberMe) {
          localStorage.removeItem('savedCompanyId');
          localStorage.removeItem('savedEmployeeId');
          
          if (isIOS) {
            removeFromIndexedDB('savedCompanyId');
            removeFromIndexedDB('savedEmployeeId');
            removeFromIndexedDB('savedPassword');
          }
        }
      } catch (error) {
        console.error('保存 rememberMe 狀態失敗:', error);
      }
    }
  }, [rememberMe, isInitialized]);

  // IndexedDB 相關功能
  const DB_NAME = 'LoginDatabase';
  const STORE_NAME = 'loginData';
  const DB_VERSION = 1;

  // 初始化 IndexedDB
  const initIndexedDB = () => {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            console.log('已創建 IndexedDB 存儲');
          }
        };
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          console.log('IndexedDB 初始化成功');
          resolve(db);
        };
        
        request.onerror = (error) => {
          console.error('IndexedDB 初始化失敗:', error);
          reject(error);
        };
      } catch (error) {
        console.error('嘗試初始化 IndexedDB 時發生錯誤:', error);
        reject(error);
      }
    });
  };

  // 保存數據到 IndexedDB
  const saveToIndexedDB = async (key, value) => {
    try {
      const db = await initIndexedDB();
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const storeRequest = store.put({ id: key, value: value });
          
          storeRequest.onsuccess = () => {
            console.log(`已保存 ${key} 到 IndexedDB`);
            resolve(true);
          };
          
          storeRequest.onerror = (error) => {
            console.error(`保存 ${key} 到 IndexedDB 失敗:`, error);
            reject(error);
          };
        } catch (error) {
          console.error('創建 IndexedDB 事務失敗:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('保存到 IndexedDB 時發生錯誤:', error);
      return false;
    }
  };

  // 從 IndexedDB 獲取數據
  const getFromIndexedDB = async (key) => {
    try {
      const db = await initIndexedDB();
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([STORE_NAME], 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          
          const getRequest = store.get(key);
          
          getRequest.onsuccess = () => {
            const result = getRequest.result;
            resolve(result ? result.value : null);
          };
          
          getRequest.onerror = (error) => {
            console.error(`獲取 ${key} 從 IndexedDB 失敗:`, error);
            reject(error);
          };
        } catch (error) {
          console.error('創建 IndexedDB 讀取事務失敗:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('從 IndexedDB 獲取數據時發生錯誤:', error);
      return null;
    }
  };

  // 從 IndexedDB 移除數據
  const removeFromIndexedDB = async (key) => {
    try {
      const db = await initIndexedDB();
      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const deleteRequest = store.delete(key);
          
          deleteRequest.onsuccess = () => {
            console.log(`已從 IndexedDB 移除 ${key}`);
            resolve(true);
          };
          
          deleteRequest.onerror = (error) => {
            console.error(`從 IndexedDB 移除 ${key} 失敗:`, error);
            reject(error);
          };
        } catch (error) {
          console.error('創建 IndexedDB 刪除事務失敗:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('從 IndexedDB 移除數據時發生錯誤:', error);
      return false;
    }
  };

  // 從 localStorage 和 IndexedDB 載入保存的登入資訊
  const loadSavedCredentials = async () => {
    try {
      if (localStorage.getItem('rememberMe') === 'true') {
        let savedCompanyId = localStorage.getItem('savedCompanyId');
        let savedEmployeeId = localStorage.getItem('savedEmployeeId');
        let savedPassword = null;
        
        // 如果是 iOS 設備，嘗試從 IndexedDB 讀取
        if (isIOS) {
          try {
            // 使用 Promise.all 並行獲取所有資料
            const [idbCompanyId, idbEmployeeId, idbPassword] = await Promise.all([
              getFromIndexedDB('savedCompanyId'),
              getFromIndexedDB('savedEmployeeId'),
              getFromIndexedDB('savedPassword')
            ]);
            
            savedCompanyId = savedCompanyId || idbCompanyId;
            savedEmployeeId = savedEmployeeId || idbEmployeeId;
            savedPassword = idbPassword;
            
            console.log('從 IndexedDB 載入登入資訊:', { 
              hasCompanyId: !!savedCompanyId, 
              hasEmployeeId: !!savedEmployeeId,
              hasPassword: !!savedPassword
            });
          } catch (error) {
            console.error('從 IndexedDB 載入資訊失敗:', error);
          }
        }
        
        if (savedCompanyId && savedEmployeeId) {
          setCredentials(prev => ({
            ...prev,
            company_id: savedCompanyId,
            employee_id: savedEmployeeId,
            password: savedPassword || ''
          }));
          console.log('已載入保存的登入資訊');
          
          // 通知 Flutter 已載入保存的登入資訊
          if (isFlutterEnvironment) {
            sendMessageToFlutter('credentialsLoaded', {
              company_id: savedCompanyId,
              employee_id: savedEmployeeId,
              hasPassword: !!savedPassword,
              rememberMe: true,
              isIOS: isIOS
            });
          }
        }
      }
    } catch (error) {
      console.error('載入保存的登入資訊失敗:', error);
    }
  };

  // 保存登入資訊到 localStorage 和 IndexedDB
  const saveCredentialsToLocalStorage = async () => {
    try {
      if (rememberMe) {
        // 保存到 localStorage
        localStorage.setItem('savedCompanyId', credentials.company_id);
        localStorage.setItem('savedEmployeeId', credentials.employee_id);
        
        // 如果是 iOS 設備，同時保存到 IndexedDB
        if (isIOS) {
          try {
            await saveToIndexedDB('savedCompanyId', credentials.company_id);
            await saveToIndexedDB('savedEmployeeId', credentials.employee_id);
            
            // 如果勾選了記住我，也保存密碼到 IndexedDB
            if (credentials.password) {
              await saveToIndexedDB('savedPassword', credentials.password);
            }
          } catch (error) {
            console.error('保存到 IndexedDB 失敗:', error);
            
            // 通知 Flutter 保存失敗
            if (isFlutterEnvironment) {
              sendMessageToFlutter('saveToIndexedDBFailed', {
                isIOS: isIOS
              });
            }
          }
        }
        
        console.log('已保存登入資訊');
      } else {
        // 如果取消勾選記住我，則清除已保存的資訊
        localStorage.removeItem('savedCompanyId');
        localStorage.removeItem('savedEmployeeId');
        
        if (isIOS) {
          try {
            await removeFromIndexedDB('savedCompanyId');
            await removeFromIndexedDB('savedEmployeeId');
            await removeFromIndexedDB('savedPassword');
          } catch (error) {
            console.error('清除 IndexedDB 失敗:', error);
          }
        }
        
        console.log('已清除保存的登入資訊');
      }
    } catch (error) {
      console.error('保存登入資訊失敗:', error);
      
      // 通知 Flutter 保存失敗
      if (isFlutterEnvironment) {
        sendMessageToFlutter('saveCredentialsToLocalStorageFailed', {
          error: error.message,
          isIOS: isIOS
        });
      }
    }
  };

  // 向 Flutter 發送訊息的函數
  const sendMessageToFlutter = (action, data = {}) => {
    if (!isFlutterEnvironment) {
      console.log('不在 Flutter 環境中，模擬發送訊息:', { action, data });
      return;
    }

    try {
      const message = {
        action: action,
        data: {...data, isIOS: isIOS},  // 添加 isIOS 標記
        timestamp: Date.now()
      };

      console.log(`發送訊息到 Flutter (${FLUTTER_HANDLER_NAME}):`, message);
      
      // 嘗試使用不同的 Flutter 通訊方法，優先檢查 iOS 的 webkit 方法
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[FLUTTER_HANDLER_NAME]) {
        // iOS 優先
        window.webkit.messageHandlers[FLUTTER_HANDLER_NAME].postMessage(JSON.stringify(message));
      } else if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler(FLUTTER_HANDLER_NAME, message);
      } else if (window.flutter) {
        window.flutter.postMessage(JSON.stringify(message));
      } else {
        console.warn('找不到適合的 Flutter 通訊方法');
      }
    } catch (error) {
      console.error('發送訊息到 Flutter 失敗:', error);
    }
  };

  // ===== Cookie 相關功能 =====
  
  // 設置 cookie 的函數，過期時間為 3 小時
  const setCookieWithExpiry = (name, value) => {
    try {
      const expirationHours = 120;
      const expirationDays = expirationHours / 24;
      
      // 增強 Cookie 選項，特別是對 iOS 設備
      Cookies.set(name, value, { 
        expires: expirationDays, 
        path: '/',
        secure: window.location.protocol === 'https:',  // 在 HTTPS 下啟用 secure
        sameSite: 'lax'  // 改為 lax 以增加兼容性
      });
      
      console.log(`設置 Cookie: ${name} = ${name === 'password' || name === 'auth_token' || name === 'auth_xtbb' ? '[已隱藏]' : value}`);
      
      // 對於 iOS 設備，使用多種備份方式
      if (isIOS) {
        // 備份到 sessionStorage
        try {
          sessionStorage.setItem(`cookie_${name}`, value);
        } catch (error) {
          console.error(`保存 ${name} 到 sessionStorage 失敗:`, error);
        }
        
        // 備份到 localStorage (臨時)
        try {
          localStorage.setItem(`temp_cookie_${name}`, value);
        } catch (error) {
          console.error(`保存 ${name} 到 localStorage 失敗:`, error);
        }
        
        // 備份到 IndexedDB
        try {
          saveToIndexedDB(`cookie_${name}`, value);
        } catch (error) {
          console.error(`保存 ${name} 到 IndexedDB 失敗:`, error);
        }
      }
    } catch (error) {
      console.error(`設置 Cookie ${name} 失敗:`, error);
      
      // 通知 Flutter Cookie 設置失敗
      if (isFlutterEnvironment) {
        sendMessageToFlutter('cookieSetFailed', {
          name,
          value: name === 'password' || name === 'auth_token' || name === 'auth_xtbb' ? '[已隱藏]' : value,
          isIOS: isIOS
        });
      }
    }
  };

  // 儲存所有登入相關的資料到 Cookies
  const saveLoginDataToCookies = async (loginData, userCredentials) => {
    // 基本登入資料
    setCookieWithExpiry('company_id', userCredentials.company_id);
    setCookieWithExpiry('employee_id', userCredentials.employee_id);
    
    // 如果勾選了記住我，才保存密碼到 Cookie
    if (rememberMe) {
      setCookieWithExpiry('password', userCredentials.password);
    }
    
    // 員工資訊
    if (loginData.name) {
      setCookieWithExpiry('employee_name', loginData.name);
    }
    
    // Token 相關資料 - 處理 xtbb
    if (loginData.xtbb) {
      setCookieWithExpiry('auth_xtbb', loginData.xtbb);
    }
    
    // 如果有 refresh token
    if (loginData.refresh_token) {
      setCookieWithExpiry('refresh_token', loginData.refresh_token);
    }
    
    // 權限資料
    if (loginData.permissions) {
      setCookieWithExpiry('user_permissions', JSON.stringify(loginData.permissions));
    }
    
    // 部門資訊
    if (loginData.department) {
      setCookieWithExpiry('department', loginData.department);
    }
    
    // 職位資訊
    if (loginData.position) {
      setCookieWithExpiry('position', loginData.position);
    }
    
    // 職級資訊
    if (loginData.job_grade) {
      setCookieWithExpiry('job_grade', loginData.job_grade);
    }
    
    // 公司名稱
    if (loginData.company_name) {
      setCookieWithExpiry('company_name', loginData.company_name);
    }
    
    // 登入時間
    setCookieWithExpiry('login_time', new Date().toISOString());
    
    // 保存登入資訊到 localStorage 和 IndexedDB
    await saveCredentialsToLocalStorage();
    
    // 驗證資料是否成功保存
    verifyLoginDataSaved();
    
    console.log('已儲存所有登入資料到 Cookies');
  };

// 驗證登入資料是否成功保存
const verifyLoginDataSaved = () => {
  // 檢查 Cookie 是否成功設置
  const savedCompanyId = Cookies.get('company_id');
  const savedEmployeeId = Cookies.get('employee_id');
  const savedToken = Cookies.get('auth_xtbb');
  
  // 如果是 iOS 設備，也嘗試從備份中獲取
  let finalCompanyId = savedCompanyId;
  let finalEmployeeId = savedEmployeeId;
  let finalToken = savedToken;
  
  if (isIOS && (!savedCompanyId || !savedEmployeeId || !savedToken)) {
    // 從 sessionStorage 獲取
    finalCompanyId = finalCompanyId || sessionStorage.getItem('cookie_company_id');
    finalEmployeeId = finalEmployeeId || sessionStorage.getItem('cookie_employee_id');
    finalToken = finalToken || sessionStorage.getItem('cookie_auth_xtbb');
    
    // 從 localStorage 臨時備份獲取
    finalCompanyId = finalCompanyId || localStorage.getItem('temp_cookie_company_id');
    finalEmployeeId = finalEmployeeId || localStorage.getItem('temp_cookie_employee_id');
    finalToken = finalToken || localStorage.getItem('temp_cookie_auth_xtbb');
  }
  
  console.log('驗證登入資料保存狀態:', {
    cookie_company_id: savedCompanyId,
    cookie_employee_id: savedEmployeeId,
    cookie_token: savedToken ? '已設置' : '未設置',
    final_company_id: finalCompanyId,
    final_employee_id: finalEmployeeId,
    final_token: finalToken ? '已設置' : '未設置',
    localStorage_company_id: localStorage.getItem('savedCompanyId'),
    localStorage_employee_id: localStorage.getItem('savedEmployeeId'),
    rememberMe: rememberMe,
    isIOS: isIOS
  });
  
  // 如果 Cookie 未成功設置，嘗試使用其他方法
  if (!finalCompanyId || !finalEmployeeId || !finalToken) {
    console.warn('Cookie 可能未成功設置，嘗試使用替代方法');
    
    // 通知 Flutter 使用原生存儲
    sendMessageToFlutter('cookieStorageFailed', {
      company_id: credentials.company_id,
      employee_id: credentials.employee_id,
      rememberMe: rememberMe,
      isIOS: isIOS
    });
  }
};

  // 取得所有登入相關的 Cookies
  const getAllLoginCookies = () => {
    // 首先嘗試從 Cookies 獲取
    let result = {
      company_id: Cookies.get('company_id') || null,
      employee_id: Cookies.get('employee_id') || null,
      employee_name: Cookies.get('employee_name') || null,
      auth_xtbb: Cookies.get('auth_xtbb') ? '[已設置]' : null,
      refresh_token: Cookies.get('refresh_token') ? '[已設置]' : null,
      user_permissions: Cookies.get('user_permissions') || null,
      department: Cookies.get('department') || null,
      position: Cookies.get('position') || null,
      job_grade: Cookies.get('job_grade') || null,
      company_name: Cookies.get('company_name') || null,
      login_time: Cookies.get('login_time') || null,
      hasPassword: Cookies.get('password') ? true : false,
      rememberMe: rememberMe,
      isIOS: isIOS
    };
    
    // 如果是 iOS 設備，嘗試從多個備份源獲取
    if (isIOS) {
      // 從 sessionStorage 獲取備份
      if (!result.company_id) {
        result.company_id = sessionStorage.getItem('cookie_company_id') || null;
      }
      if (!result.employee_id) {
        result.employee_id = sessionStorage.getItem('cookie_employee_id') || null;
      }
      if (!result.auth_xtbb && sessionStorage.getItem('cookie_auth_xtbb')) {
        result.auth_xtbb = '[已設置]';
      }
      
      // 從 localStorage 臨時備份獲取
      if (!result.company_id) {
        result.company_id = localStorage.getItem('temp_cookie_company_id') || null;
      }
      if (!result.employee_id) {
        result.employee_id = localStorage.getItem('temp_cookie_employee_id') || null;
      }
      if (!result.auth_xtbb && localStorage.getItem('temp_cookie_auth_xtbb')) {
        result.auth_xtbb = '[已設置]';
      }
      
      // 如果仍然沒有，嘗試從 IndexedDB 獲取
      if (!result.company_id || !result.employee_id || !result.auth_xtbb) {
        // 這裡不能使用 await，因為 getAllLoginCookies 不是 async 函數
        // 但我們可以在 checkExistingLogin 中處理 IndexedDB 的讀取
      }
    }
    
    return result;
  };

  // 清除所有登入相關的 Cookies
  const clearAllLoginCookies = async () => {
    const cookiesToClear = [
      'company_id', 'employee_id', 'password', 'employee_name',
      'auth_xtbb', 'auth_token', 'refresh_token', 'user_permissions',
      'department', 'position', 'login_time', 'job_grade', 'company_name'
    ];
    
    cookiesToClear.forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
      
      // 如果是 iOS 設備，同時清除所有備份
      if (isIOS) {
        try {
          // 清除 sessionStorage 中的備份
          sessionStorage.removeItem(`cookie_${cookieName}`);
          
          // 清除 localStorage 中的臨時備份
          localStorage.removeItem(`temp_cookie_${cookieName}`);
          
          // 清除 IndexedDB 中的備份
          removeFromIndexedDB(`cookie_${cookieName}`);
        } catch (error) {
          console.error(`清除 ${cookieName} 的備份失敗:`, error);
        }
      }
    });
    
    // 如果不記住我，也清除 localStorage 和 IndexedDB 中的登入資訊
    if (!rememberMe) {
      localStorage.removeItem('savedCompanyId');
      localStorage.removeItem('savedEmployeeId');
      
      if (isIOS) {
        try {
          await removeFromIndexedDB('savedCompanyId');
          await removeFromIndexedDB('savedEmployeeId');
          await removeFromIndexedDB('savedPassword');
        } catch (error) {
          console.error('清除 IndexedDB 失敗:', error);
        }
      }
    }
    
    
if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
  window.flutter_inappwebview.callHandler('LogoutCallbackHandler', ['logoutSuccess']);
}

    console.log('已清除所有登入相關的 Cookies 和備份');
  };

  // 檢查是否有已存在的登入資料
  const checkExistingLogin = async () => {
    // 首先嘗試從 Cookies 獲取
    let savedCompanyId = Cookies.get('company_id');
    let savedEmployeeId = Cookies.get('employee_id');
    let savedToken = Cookies.get('auth_xtbb');
    
    // 如果是 iOS 設備，嘗試從多個備份源獲取
    if (isIOS && (!savedCompanyId || !savedEmployeeId || !savedToken)) {
      // 從 sessionStorage 獲取
      savedCompanyId = savedCompanyId || sessionStorage.getItem('cookie_company_id');
      savedEmployeeId = savedEmployeeId || sessionStorage.getItem('cookie_employee_id');
      savedToken = savedToken || sessionStorage.getItem('cookie_auth_xtbb');
      
      // 從 localStorage 臨時備份獲取
      savedCompanyId = savedCompanyId || localStorage.getItem('temp_cookie_company_id');
      savedEmployeeId = savedEmployeeId || localStorage.getItem('temp_cookie_employee_id');
      savedToken = savedToken || localStorage.getItem('temp_cookie_auth_xtbb');
      
      // 從 IndexedDB 獲取
      try {
        if (!savedCompanyId) {
          savedCompanyId = await getFromIndexedDB('cookie_company_id');
        }
        if (!savedEmployeeId) {
          savedEmployeeId = await getFromIndexedDB('cookie_employee_id');
        }
        if (!savedToken) {
          savedToken = await getFromIndexedDB('cookie_auth_xtbb');
        }
      } catch (error) {
        console.error('從 IndexedDB 獲取 Cookie 備份失敗:', error);
      }
    }
    
    if (savedCompanyId && savedEmployeeId && savedToken) {
      console.log('發現已存在的登入資料 (Cookies/備份)');
      return {
        company_id: savedCompanyId,
        employee_id: savedEmployeeId,
        hasToken: true
      };
    }
    
    // 如果沒有完整的登入資料，但有記住我功能保存的資料
    if (rememberMe) {
      const localCompanyId = localStorage.getItem('savedCompanyId');
      const localEmployeeId = localStorage.getItem('savedEmployeeId');
      
      if (localCompanyId && localEmployeeId) {
        console.log('發現已保存的登入資訊（記住我）');
        return {
          company_id: localCompanyId,
          employee_id: localEmployeeId,
          hasToken: false
        };
      }
      
      // 如果是 iOS 設備，嘗試從 IndexedDB 獲取
      if (isIOS) {
        try {
          const idbCompanyId = await getFromIndexedDB('savedCompanyId');
          const idbEmployeeId = await getFromIndexedDB('savedEmployeeId');
          
          if (idbCompanyId && idbEmployeeId) {
            console.log('從 IndexedDB 發現已保存的登入資訊（記住我）');
            return {
              company_id: idbCompanyId,
              employee_id: idbEmployeeId,
              hasToken: false
            };
          }
        } catch (error) {
          console.error('從 IndexedDB 獲取保存的登入資訊失敗:', error);
        }
      }
    }
    
    return null;
  };

  // ===== 登入表單相關功能 =====

  // 更新認證資料
  const updateCredential = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 更新密碼變更相關欄位
  const updatePasswordField = (field, value) => {
    setPasswordChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 設置是否顯示密碼變更界面
  const setShowPasswordChange = (show) => {
    setPasswordChange(prev => ({
      ...prev,
      showPasswordChange: show
    }));
  };

  // 清除表單
  const clearForm = () => {
    // 如果有記住我，只清除密碼欄位
    if (rememberMe) {
      setCredentials(prev => ({
        ...prev,
        password: ''
      }));
    } else {
      // 否則清除所有欄位
      setCredentials({
        company_id: '',
        employee_id: '',
        password: ''
      });
    }
    
    setPasswordChange({
      showPasswordChange: false,
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
  };

  // 處理一般登入按鈕點擊
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    // 向 Flutter 發送登入開始的訊息
    sendMessageToFlutter('loginStart', {
      company_id: credentials.company_id,
      employee_id: credentials.employee_id,
      rememberMe: rememberMe
    });

    try {
      if (!credentials.company_id || !credentials.employee_id || !credentials.password) {
        const errorMessage = '請輸入所有欄位';
        setError(errorMessage);
        setIsLoading(false);
        sendMessageToFlutter('loginError', { 
          message: errorMessage,
          code: 'MISSING_FIELDS'
        });
        return;
      }

      // 立即保存登入資訊到 localStorage 和 IndexedDB (如果勾選了記住我)
      if (rememberMe) {
        try {
          localStorage.setItem('savedCompanyId', credentials.company_id);
          localStorage.setItem('savedEmployeeId', credentials.employee_id);
          
          if (isIOS) {
            await saveToIndexedDB('savedCompanyId', credentials.company_id);
            await saveToIndexedDB('savedEmployeeId', credentials.employee_id);
            await saveToIndexedDB('savedPassword', credentials.password);
          }
        } catch (error) {
          console.error('保存到 localStorage/IndexedDB 失敗:', error);
        }
      }

      // 使用 function.js 中的登入函數
      const response = await employeeLogin(
        credentials.company_id, 
        credentials.employee_id, 
        credentials.password
      );

      if (response.success) {
        // 登入成功，將所有資料存入 cookies
        const loginData = response.data || {};
        await saveLoginDataToCookies(loginData, credentials);

        // 向 Flutter 發送登入成功的訊息
        sendMessageToFlutter('loginSuccess', {
          company_id: credentials.company_id,
          employee_id: credentials.employee_id,
          employee_name: loginData.name || '',
          token: loginData.token || loginData.xtbb || '',
          userData: loginData,
          rememberMe: rememberMe
        });

        // 如果在 Flutter 環境中，不直接跳轉，讓 Flutter 處理
        if (!isFlutterEnvironment) {
          setTimeout(() => {
            window.location.href = '/frontpage01';
          }, 1000);
        }
      } else {
        // 統一錯誤訊息
        setError("統編或帳號或密碼錯誤，請重新輸入");
        // 仍然保留原始錯誤訊息用於 log 和 Flutter 通訊
        sendMessageToFlutter('loginError', { 
          message: response.message || '帳號或密碼錯誤',
          code: 'LOGIN_FAILED',
          serverResponse: response
        });
      }
    } catch (err) {
      console.error('登入錯誤:', err);
      // 統一錯誤訊息
      setError("統編或帳號或密碼錯誤，請重新輸入");
      // 仍然保留原始錯誤訊息用於 log 和 Flutter 通訊
      sendMessageToFlutter('loginError', { 
        message: `登入失敗: ${err.message}`,
        code: 'NETWORK_ERROR',
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 更新密碼
  const handlePasswordUpdate = async () => {
    try {
      if (!passwordChange.newPassword || passwordChange.newPassword !== passwordChange.confirmPassword) {
        const errorMessage = '新密碼不一致，請重新輸入';
        setError(errorMessage);
        sendMessageToFlutter('passwordChangeError', { 
          message: errorMessage,
          code: 'PASSWORD_MISMATCH'
        });
        return;
      }
      if (passwordChange.newPassword.length < 8) {
        const errorMessage = '新密碼長度不足，請至少輸入8個字符';
        setError(errorMessage);
        sendMessageToFlutter('passwordChangeError', { 
          message: errorMessage,
          code: 'PASSWORD_TOO_SHORT'
        });
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      sendMessageToFlutter('passwordChangeStart', {
        company_id: credentials.company_id,
        employee_id: credentials.employee_id
      });

      // 使用 function.js 中的更新密碼函數
      const response = await updateEmployeePassword(
        credentials.company_id, 
        credentials.employee_id, 
        credentials.password, 
        passwordChange.newPassword
      );
      
      if (response.success) {
        setShowPasswordChange(false);
        
        // 更新密碼後重新登入
        const loginResponse = await employeeLogin(
          credentials.company_id, 
          credentials.employee_id, 
          passwordChange.newPassword
        );
        
        if (loginResponse.success) {
          // 更新密碼並儲存新的登入資料
          updateCredential('password', passwordChange.newPassword);
          const loginData = loginResponse.data || {};
          
          // 使用更新後的密碼
          const updatedCredentials = {
            ...credentials,
            password: passwordChange.newPassword
          };
          
          // 立即保存更新後的密碼到 localStorage 和 IndexedDB (如果勾選了記住我)
          if (rememberMe) {
            try {
              if (isIOS) {
                await saveToIndexedDB('savedPassword', passwordChange.newPassword);
              }
            } catch (error) {
              console.error('保存更新後的密碼到 IndexedDB 失敗:', error);
            }
          }
          
          await saveLoginDataToCookies(loginData, updatedCredentials);

          sendMessageToFlutter('passwordChangeSuccess', {
            company_id: credentials.company_id,
            employee_id: credentials.employee_id,
            employee_name: loginData.name || '',
            token: loginData.token || loginData.xtbb || '',
            userData: loginData,
            rememberMe: rememberMe
          });

          if (!isFlutterEnvironment) {
            setTimeout(() => {
              window.location.href = '/frontpage01';
            }, 1000);
          }
        } else {
          // 統一錯誤訊息
          setError("統編或帳號或密碼錯誤，請重新輸入");
          // 仍然保留原始錯誤訊息用於 log 和 Flutter 通訊
          sendMessageToFlutter('passwordChangeError', { 
            message: loginResponse.message || '更新密碼後登入失敗',
            code: 'LOGIN_AFTER_PASSWORD_CHANGE_FAILED'
          });
        }
      } else {
        // 統一錯誤訊息
        setError("統編或帳號或密碼錯誤，請重新輸入，請重新輸入");
        // 仍然保留原始錯誤訊息用於 log 和 Flutter 通訊
        sendMessageToFlutter('passwordChangeError', { 
          message: response.message || '更新密碼失敗',
          code: 'PASSWORD_UPDATE_FAILED'
        });
      }
    } catch (err) {
      console.error('更新密碼錯誤:', err);
      // 統一錯誤訊息
      setError("統編或帳號或密碼錯誤，請重新輸入，請重新輸入");
      // 仍然保留原始錯誤訊息用於 log 和 Flutter 通訊
      sendMessageToFlutter('passwordChangeError', { 
        message: `更新密碼失敗: ${err.message}`,
        code: 'NETWORK_ERROR',
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 處理忘記密碼
  const handleForgotPassword = () => {
    const message = '請聯絡管理員重設密碼';
    setError(message);
    sendMessageToFlutter('forgotPassword', { 
      message,
      company_id: credentials.company_id,
      employee_id: credentials.employee_id
    });
  };

  // ===== 註冊 Flutter 可調用的 JS 函數 =====
  
  // 註冊 Flutter 可以調用的 JS 函數
  const registerFlutterJSFunctions = () => {
    if (handlerType === 'login') {
      // 登入頁面專用函數
      
      // Flutter 調用：執行登入
      window[`${JS_FUNCTION_PREFIX}Login`] = async (loginData) => {
        console.log('Flutter 要求執行登入:', loginData);
        
        try {
          // 更新表單資料
          if (loginData && typeof loginData === 'object') {
            if (loginData.company_id) updateCredential('company_id', loginData.company_id);
            if (loginData.employee_id) updateCredential('employee_id', loginData.employee_id);
            if (loginData.password) updateCredential('password', loginData.password);
            if (loginData.rememberMe !== undefined) setRememberMe(loginData.rememberMe);
          }
          
          // 驗證資料
          if (!loginData.company_id || !loginData.employee_id || !loginData.password) {
            return { 
              status: "false", 
              message: '請提供所有必要的登入資訊',
              code: 'MISSING_FIELDS'
            };
          }
          
          // 立即保存登入資訊到 localStorage 和 IndexedDB (如果勾選了記住我)
          if (loginData.rememberMe) {
            try {
              localStorage.setItem('savedCompanyId', loginData.company_id);
              localStorage.setItem('savedEmployeeId', loginData.employee_id);
              
              if (isIOS) {
                await saveToIndexedDB('savedCompanyId', loginData.company_id);
                await saveToIndexedDB('savedEmployeeId', loginData.employee_id);
                await saveToIndexedDB('savedPassword', loginData.password);
              }
            } catch (error) {
              console.error('保存到 localStorage/IndexedDB 失敗:', error);
            }
          }
          
          // 直接調用新的 API 登入
          const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              company_id: loginData.company_id,
              employee_id: loginData.employee_id,
              password: loginData.password
            }),
          });
          
          const data = await response.json();
          
          if (data.Status === "Ok") {
            // 登入成功，儲存資料到 cookies
            const userData = data.Data || {};
            
            // 確保 userData 包含 xtbb 作為 token
            if (userData.xtbb) {
              userData.token = userData.xtbb;
            }
            
            // 使用 loginData 作為 credentials
            await saveLoginDataToCookies(userData, loginData);
            
            // 如果不在 Flutter 環境中，跳轉到首頁
            if (!isFlutterEnvironment) {
              setTimeout(() => {
                window.location.href = '/frontpage01';
              }, 500);
            }
            
            return { 
              status: "success", 
              message: '登入成功',
              userData: userData,
              rememberMe: rememberMe,
              isIOS: isIOS
            };
          } else {
            return { 
              status: "false", 
              // 統一錯誤訊息
              message: "統編或帳號或密碼錯誤，請重新輸入，請重新輸入",
              originalMessage: data.Msg || '登入失敗',
              code: 'LOGIN_FAILED',
              serverResponse: data
            };
          }
        } catch (err) {
          console.error('執行登入時出錯:', err);
          return { 
            status: "false", 
            // 統一錯誤訊息
            message: "統編或帳號或密碼錯誤，請重新輸入，請重新輸入",
            originalMessage: `登入錯誤: ${err.message}`,
            code: 'ERROR',
            error: err.message
          };
        }
      };

      // Flutter 調用：預填登入表單
      window[`${JS_FUNCTION_PREFIX}FillLoginData`] = (data) => {
        console.log('Flutter 要求預填登入表單:', data);
        if (data && typeof data === 'object') {
          if (data.company_id) setCredentials(prev => ({ ...prev, company_id: data.company_id }));
          if (data.employee_id) setCredentials(prev => ({ ...prev, employee_id: data.employee_id }));
          if (data.password) setCredentials(prev => ({ ...prev, password: data.password }));
          if (data.rememberMe !== undefined) setRememberMe(data.rememberMe);
        }
        return { status: "success" };
      };

      // Flutter 調用：設置記住我狀態
      window[`${JS_FUNCTION_PREFIX}SetRememberMe`] = (value) => {
        console.log('Flutter 要求設置記住我狀態:', value);
        setRememberMe(!!value);
        return { status: "success", rememberMe: !!value };
      };

      // Flutter 調用：清除表單和 Cookies
      window[`${JS_FUNCTION_PREFIX}ClearForm`] = async () => {
        console.log('Flutter 要求清除表單');
        clearForm();
        await clearAllLoginCookies();
        return { status: "success" };
      };

      // Flutter 調用：顯示錯誤訊息
      window[`${JS_FUNCTION_PREFIX}ShowError`] = (message) => {
        console.log('Flutter 要求顯示錯誤:', message);
        // 統一顯示錯誤訊息
        setError("統編或帳號或密碼錯誤，請重新輸入");
        return { status: "success" };
      };

      // Flutter 調用：切換到密碼變更模式
      window[`${JS_FUNCTION_PREFIX}ShowPasswordChange`] = () => {
        console.log('Flutter 要求切換到密碼變更模式');
        setShowPasswordChange(true);
        return { status: "success" };
      };

      // Flutter 調用：取得當前表單資料
      window[`${JS_FUNCTION_PREFIX}GetFormData`] = () => {
        const formData = {
          company_id: credentials.company_id,
          employee_id: credentials.employee_id,
          hasPassword: !!credentials.password,
          showPasswordChange: passwordChange.showPasswordChange,
          isLoading,
          rememberMe: rememberMe,
          isIOS: isIOS,
          isInitialized: isInitialized,
          cookies: getAllLoginCookies()
        };
        console.log('Flutter 要求獲取表單資料:', formData);
        return formData;
      };

      // Flutter 調用：登出（清除所有資料）
      window[`${JS_FUNCTION_PREFIX}Logout`] = async () => {
        console.log('Flutter 要求登出');
        await clearAllLoginCookies();
        clearForm();
        return { status: "success" };
      };
      
      // Flutter 調用：檢查登入狀態
      window[`${JS_FUNCTION_PREFIX}CheckLoginStatus`] = async () => {
        const loginStatus = await checkExistingLogin();
        console.log('Flutter 要求檢查登入狀態:', loginStatus);
        
        if (loginStatus) {
          return { 
            isLoggedIn: true,
            company_id: loginStatus.company_id,
            employee_id: loginStatus.employee_id,
            cookies: getAllLoginCookies(),
            rememberMe: rememberMe,
            isIOS: isIOS,
            isInitialized: isInitialized
          };
        } else {
          return { 
            isLoggedIn: false, 
            rememberMe: rememberMe, 
            isIOS: isIOS,
            isInitialized: isInitialized
          };
        }
      };
      
      // Flutter 調用：保存登入資訊到 Flutter 原生端
      window[`${JS_FUNCTION_PREFIX}SaveCredentialsToNative`] = (data) => {
        console.log('Flutter 要求保存登入資訊到原生端:', data);
        
        // 發送訊息給 Flutter，請求保存登入資訊
        sendMessageToFlutter('saveCredentialsToNative', {
          company_id: data.company_id || credentials.company_id,
          employee_id: data.employee_id || credentials.employee_id,
          password: data.rememberMe ? (data.password || credentials.password) : null,
          rememberMe: data.rememberMe !== undefined ? data.rememberMe : rememberMe
        });
        
        return { status: "success" };
      };
      
      // Flutter 調用：從 Flutter 原生端載入登入資訊
      window[`${JS_FUNCTION_PREFIX}LoadCredentialsFromNative`] = (data) => {
        console.log('Flutter 載入的登入資訊:', data);
        
        if (data && typeof data === 'object') {
          if (data.company_id) updateCredential('company_id', data.company_id);
          if (data.employee_id) updateCredential('employee_id', data.employee_id);
          if (data.password) updateCredential('password', data.password);
          if (data.rememberMe !== undefined) setRememberMe(data.rememberMe);
        }
        
        return { 
          status: "success",
          formData: {
            company_id: credentials.company_id,
            employee_id: credentials.employee_id,
            hasPassword: !!credentials.password,
            rememberMe: rememberMe,
            isIOS: isIOS,
            isInitialized: isInitialized
          }
        };
      };
      
      // Flutter 調用：檢查 Web 存儲可用性
      window[`${JS_FUNCTION_PREFIX}CheckWebStorage`] = async () => {
        const isAvailable = await checkWebStorageAvailability();
        return { 
          status: "success",
          isAvailable: isAvailable,
          isIOS: isIOS
        };
      };
      
    } else if (handlerType === 'home') {
      // 首頁專用函數
      
      // Flutter 調用：導航到特定頁面
      window[`${JS_FUNCTION_PREFIX}Navigate`] = (route) => {
        console.log('Flutter 要求導航到:', route);
        window.location.href = route;
        return { status: "success", route };
      };

      // Flutter 調用：刷新頁面
      window[`${JS_FUNCTION_PREFIX}Refresh`] = () => {
        console.log('Flutter 要求刷新頁面');
        window.location.reload();
        return { status: "success" };
      };

      // Flutter 調用：獲取當前用戶資訊
      window[`${JS_FUNCTION_PREFIX}GetUserInfo`] = () => {
        const userInfo = {
          companyId: Cookies.get('company_id') || '',
          employeeId: Cookies.get('employee_id') || '',
          userName: Cookies.get('employee_name') || '',
          department: Cookies.get('department') || '',
          position: Cookies.get('position') || '',
          jobGrade: Cookies.get('job_grade') || '',
          companyName: Cookies.get('company_name') || '',
          rememberMe: rememberMe,
          isIOS: isIOS
        };
        
        // 如果是 iOS 設備，嘗試從多個備份源獲取
        if (isIOS) {
          // 從 sessionStorage 獲取
          if (!userInfo.companyId) {
            userInfo.companyId = sessionStorage.getItem('cookie_company_id') || '';
          }
          if (!userInfo.employeeId) {
            userInfo.employeeId = sessionStorage.getItem('cookie_employee_id') || '';
          }
          if (!userInfo.userName) {
            userInfo.userName = sessionStorage.getItem('cookie_employee_name') || '';
          }
          
          // 從 localStorage 臨時備份獲取
          if (!userInfo.companyId) {
            userInfo.companyId = localStorage.getItem('temp_cookie_company_id') || '';
          }
          if (!userInfo.employeeId) {
            userInfo.employeeId = localStorage.getItem('temp_cookie_employee_id') || '';
          }
          if (!userInfo.userName) {
            userInfo.userName = localStorage.getItem('temp_cookie_employee_name') || '';
          }
        }
        
        console.log('Flutter 要求獲取用戶資訊:', userInfo);
        return userInfo;
      };

      // Flutter 調用：登出
      window[`${JS_FUNCTION_PREFIX}Logout`] = async () => {
        console.log('Flutter 要求登出');
        await clearAllLoginCookies();
        window.location.href = '/';
        return { status: "success" };
      };
    }
  };

  // 移除註冊的 JS 函式
  const unregisterFlutterJSFunctions = () => {
    if (handlerType === 'login') {
      window[`${JS_FUNCTION_PREFIX}Login`] = undefined;
      window[`${JS_FUNCTION_PREFIX}FillLoginData`] = undefined;
      window[`${JS_FUNCTION_PREFIX}SetRememberMe`] = undefined;
      window[`${JS_FUNCTION_PREFIX}ClearForm`] = undefined;
      window[`${JS_FUNCTION_PREFIX}ShowError`] = undefined;
      window[`${JS_FUNCTION_PREFIX}ShowPasswordChange`] = undefined;
      window[`${JS_FUNCTION_PREFIX}GetFormData`] = undefined;
      window[`${JS_FUNCTION_PREFIX}Logout`] = undefined;
      window[`${JS_FUNCTION_PREFIX}CheckLoginStatus`] = undefined;
      window[`${JS_FUNCTION_PREFIX}SaveCredentialsToNative`] = undefined;
      window[`${JS_FUNCTION_PREFIX}LoadCredentialsFromNative`] = undefined;
      window[`${JS_FUNCTION_PREFIX}CheckWebStorage`] = undefined;
    } else if (handlerType === 'home') {
      window[`${JS_FUNCTION_PREFIX}Navigate`] = undefined;
      window[`${JS_FUNCTION_PREFIX}Refresh`] = undefined;
      window[`${JS_FUNCTION_PREFIX}GetUserInfo`] = undefined;
      window[`${JS_FUNCTION_PREFIX}Logout`] = undefined;
    }
  };

  // 返回所有功能
  return {
    // 基本狀態
    isFlutterEnvironment,
    error,
    isLoading,
    isIOS,
    isInitialized,
    
    // 記住我功能
    rememberMe,
    setRememberMe,
    
    // Flutter 通訊
    sendMessageToFlutter,
    registerFlutterJSFunctions,
    unregisterFlutterJSFunctions,
    
    // Cookie 相關
    saveLoginDataToCookies,
    getAllLoginCookies,
    clearAllLoginCookies,
    checkExistingLogin,
    
    // 登入表單相關
    credentials,
    passwordChange,
    updateCredential,
    updatePasswordField,
    setShowPasswordChange,
    clearForm,
    handleLogin,
    handlePasswordUpdate,
    handleForgotPassword,
    setError
  };
}
