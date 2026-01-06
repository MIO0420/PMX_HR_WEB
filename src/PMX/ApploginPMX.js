// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import './PMX_CSS/ApploginPMX.css';
// // import { useFlutterIntegration } from './Hook/hooks';
// // import { useLanguage } from './Hook/useLanguage';
// // import axios from 'axios';
// // import Cookies from 'js-cookie';

// // function ApploginPMX() {
// //   // 添加語言功能
// //   const { t, language, changeLanguage } = useLanguage();
  
// //   const {
// //     // 基本狀態
// //     isFlutterEnvironment,
// //     error,
// //     isLoading,
// //     isIOS,
// //     isInitialized,
    
// //     // 登入表單相關
// //     credentials, 
// //     passwordChange, 
// //     updateCredential, 
// //     updatePasswordField, 
// //     setShowPasswordChange, 
// //     clearForm, 
// //     handleLogin: originalHandleLogin, 
// //     handlePasswordUpdate, 
// //     handleForgotPassword,
// //     setError,
// //     setIsLoading,
    
// //     // 記住我功能
// //     rememberMe,
// //     setRememberMe,
    
// //     // Flutter 通訊
// //     sendMessageToFlutter,
    
// //     // Cookie 相關
// //     checkExistingLogin,
// //     clearAllLoginCookies,
// //     getAllLoginCookies,
// //     saveLoginDataToCookies
// //   } = useFlutterIntegration('login');

// //   // 創建 refs 來獲取表單元素
// //   const employeeIdRef = useRef(null);
// //   const passwordRef = useRef(null);
  
// //   // 防抖計時器
// //   const debounceTimerRef = useRef(null);

// //   // 🔥 新增：SSO 檢查狀態
// //   const [ssoChecked, setSsoChecked] = useState(false);

// //   // 設置 cookie 的函數，過期時間為 120 小時（僅用於非敏感資料）
// //   const setCookieWithExpiry = (name, value) => {
// //     const expirationHours = 120;
// //     const expirationDays = expirationHours / 24;
    
// //     // 增強 Cookie 選項
// //     Cookies.set(name, value, { 
// //       expires: expirationDays, 
// //       path: '/',
// //       secure: window.location.protocol === 'https:',
// //       sameSite: 'lax'
// //     });
    
// //     console.log(`設置 Cookie: ${name} = ${name.includes('token') || name.includes('password') ? '[已隱藏]' : value}`);
    
// //     // 對於 iOS 設備，使用多種備份方式
// //     if (isIOS) {
// //       try {
// //         sessionStorage.setItem(`cookie_${name}`, value);
// //         localStorage.setItem(`temp_cookie_${name}`, value);
// //       } catch (error) {
// //         console.error(`保存 ${name} 到存儲失敗:`, error);
// //       }
// //     }
// //   };

// //   // 🔥 新增：檢查 PMX SSO 登入狀態
// //   const checkPMXSSOLogin = useCallback(() => {
// //     console.log('🔥 檢查 PMX SSO 登入狀態');
    
// //     // 檢查 PMX SSO 專用的 cookies
// //     const employeeId = Cookies.get('employee_id');
// //     const pmxLoggedIn = Cookies.get('pmx_logged_in');
// //     const authXtbb = Cookies.get('auth_xtbb'); // 🔥 添加 auth_xtbb 檢查
// //     const pmxSessionToken = Cookies.get('pmx_session_token');
// //     const ssoAccessToken = Cookies.get('sso_access_token');
// //     const name = Cookies.get('name');
    
// //     console.log('🔥 PMX SSO Cookies 檢查:', {
// //       employee_id: employeeId,
// //       pmx_logged_in: pmxLoggedIn,
// //       has_auth_xtbb: !!authXtbb, // 🔥 檢查 auth_xtbb
// //       has_pmx_session_token: !!pmxSessionToken,
// //       has_sso_access_token: !!ssoAccessToken,
// //       name: name
// //     });
    
// //     // 🔥 PMX SSO 登入成功的條件 - 必須包含 auth_xtbb
// //     if (employeeId && pmxLoggedIn === 'true' && authXtbb && (pmxSessionToken || ssoAccessToken)) {
// //       console.log('✅ 檢測到 PMX SSO 登入成功！');
      
// //       // 通知 Flutter（如果在 Flutter 環境中）
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('ssoLoginDetected', {
// //           employee_id: employeeId,
// //           name: name || '',
// //           loginType: 'PMX_SSO',
// //           redirectTo: 'frontpagepmx'
// //         });
// //       }
      
// //       // 🔥 直接跳轉到首頁
// //       console.log('🔥 執行 PMX SSO 自動跳轉到首頁');
// //       window.location.href = 'https://rabbit.54ucl.com:3003/frontpagepmx';
// //       return true;
// //     }
    
// //     return false;
// //   }, [isFlutterEnvironment, sendMessageToFlutter]);

// //   // 🔥 新增：檢查 URL 參數中的 SSO 成功標記
// //   const checkURLSSOSuccess = useCallback(() => {
// //     const urlParams = new URLSearchParams(window.location.search);
// //     const ssoLogin = urlParams.get('sso_login');
    
// //     if (ssoLogin === 'success') {
// //       console.log('🔥 檢測到 URL 中的 SSO 登入成功參數');
      
// //       // 清理 URL 參數
// //       const newUrl = window.location.pathname;
// //       window.history.replaceState({}, document.title, newUrl);
      
// //       // 檢查 PMX SSO cookies
// //       return checkPMXSSOLogin();
// //     }
    
// //     return false;
// //   }, [checkPMXSSOLogin]);

// //   // 🔥 新增：頁面載入時的 SSO 檢查
// //   useEffect(() => {
// //     if (!ssoChecked && isInitialized) {
// //       console.log('🔥 執行頁面載入時的 SSO 檢查');
      
// //       // 首先檢查 URL 參數
// //       const urlSSODetected = checkURLSSOSuccess();
      
// //       // 如果 URL 沒有 SSO 參數，檢查 cookies
// //       if (!urlSSODetected) {
// //         checkPMXSSOLogin();
// //       }
      
// //       setSsoChecked(true);
// //     }
// //   }, [isInitialized, ssoChecked, checkURLSSOSuccess, checkPMXSSOLogin]);

// //   // 🔥 修改 handleDualLogin 函數，添加完整的 Cookie 設置
// //   const handleDualLogin = useCallback(async (employeeId, password) => {
// //     try {
// //       setIsLoading(true);
// //       setError('');
      
// //       console.log('=== 開始雙重登入流程 ===');
      
// //       // 🔥 第一步：調用外部 IDP API 登入
// //       const emailAddress = `${employeeId}@2330.rm`; // 自動添加後綴
// //       console.log('第一步: 外部 IDP 登入，郵箱:', emailAddress);
      
// //       try {
// //         const idpResponse = await axios.post('https://identityprovider.54ucl.com:1989/api/login', {
// //           email: emailAddress,
// //           password: password,
// //           client_id: "d612d8bc-2f85-4eb6-8a09-6ff7f5a910eb",
// //           client_secret: "e3Lu3P3O0veUdD7UYNsMc2Q6-Eb2YSgE1F1v11vG6-Y"
// //         }, {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'X-Set-Session': 'true'
// //           },
// //           withCredentials: true,
// //           timeout: 30000
// //         });

// //         console.log('外部 IDP API 回應:', idpResponse.data);

// //         if (idpResponse.data && idpResponse.data.access_token) {
// //           const idpTokens = {
// //             access_token: idpResponse.data.access_token,
// //             refresh_token: idpResponse.data.refresh_token,
// //             id_token: idpResponse.data.id_token,
// //             token_type: idpResponse.data.token_type
// //           };
          
// //           console.log('第一步成功: 獲得外部 IDP tokens');
          
// //           // 🔥 第二步：調用您自己的 PMX 登入 API
// //           console.log('第二步: 開始 PMX 登入流程');
          
// //           const pmxResponse = await axios.post('https://rabbit.54ucl.com:3004/pmx/employee/login', {
// //             employee_id: employeeId,
// //             password: password
// //           }, {
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Accept': 'application/json',
// //               'X-Set-Session': 'true'
// //             },
// //             withCredentials: true,
// //             timeout: 30000
// //           });

// //           console.log('PMX API 回應:', pmxResponse.data);

// //           if (pmxResponse.data.Status === "Ok") {
// //             console.log('=== 雙重登入成功 ===');
            
// //             const loginData = pmxResponse.data.Data || {};
            
// //             // 🔥 設置完整的認證 cookies
// //             setCookieWithExpiry('company_id', loginData.company_id || '');
// //             setCookieWithExpiry('employee_id', employeeId);
// //             setCookieWithExpiry('user_name', loginData.name || '');
// //             setCookieWithExpiry('department', loginData.department || '');
// //             setCookieWithExpiry('position', loginData.position || '');
// //             setCookieWithExpiry('job_grade', loginData.job_grade || '');
// //             setCookieWithExpiry('company_name', loginData.company_name || '');
            
// //             // 🔥 最重要：設置認證 token
// //             if (loginData.xtbb) {
// //               setCookieWithExpiry('auth_xtbb', loginData.xtbb);
// //               console.log('✅ 已設置 auth_xtbb token');
// //             } else {
// //               // 🔥 如果沒有 xtbb，生成一個臨時的認證標記
// //               const tempToken = `pmx_dual_${employeeId}_${Date.now()}`;
// //               setCookieWithExpiry('auth_xtbb', tempToken);
// //               console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
// //             }
            
// //             // 🔥 設置 PMX 登入狀態標記
// //             setCookieWithExpiry('pmx_logged_in', 'true');
// //             setCookieWithExpiry('login_timestamp', Date.now().toString());
// //             setCookieWithExpiry('login_method', 'DUAL_LOGIN');
            
// //             // 🔥 設置 IDP tokens
// //             if (idpTokens.access_token) {
// //               setCookieWithExpiry('sso_access_token', idpTokens.access_token);
// //               setCookieWithExpiry('sso_refresh_token', idpTokens.refresh_token || '');
// //               setCookieWithExpiry('sso_id_token', idpTokens.id_token || '');
// //             }
            
// //             if (rememberMe) {
// //               await saveLoginDataToCookies(loginData, {
// //                 employee_id: employeeId,
// //                 password: password
// //               });
// //             }

// //             if (isFlutterEnvironment) {
// //               sendMessageToFlutter('loginSuccess', {
// //                 employee_id: employeeId,
// //                 employee_name: loginData.name || '',
// //                 department_position: loginData.department_position || '',
// //                 idp_tokens: idpTokens,
// //                 pmx_data: loginData,
// //                 userData: loginData,
// //                 rememberMe: rememberMe,
// //                 language: language,
// //                 loginTimestamp: Date.now()
// //               });
// //             } else {
// //               console.log('準備跳轉到首頁...');
// //               setTimeout(() => {
// //                 window.location.href = 'https://rabbit.54ucl.com:3003/frontpagepmx';
// //               }, 1000);
// //             }
// //           } else {
// //             throw new Error(pmxResponse.data.Msg || 'PMX 登入失敗');
// //           }
// //         } else {
// //           throw new Error('外部 IDP 登入失敗，未獲得有效 token');
// //         }
// //       } catch (idpError) {
// //         console.error('IDP 登入失敗:', idpError);
        
// //         // 🔥 如果 IDP 登入失敗，嘗試直接使用 PMX 登入
// //         console.log('IDP 登入失敗，嘗試直接 PMX 登入...');
        
// //         const pmxResponse = await axios.post('https://rabbit.54ucl.com:3004/pmx/employee/login', {
// //           employee_id: employeeId,
// //           password: password
// //         }, {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json',
// //             'X-Set-Session': 'true'
// //           },
// //           withCredentials: true,
// //           timeout: 30000
// //         });

// //         console.log('直接 PMX API 回應:', pmxResponse.data);

// //         if (pmxResponse.data.Status === "Ok") {
// //           console.log('=== 直接 PMX 登入成功 ===');
          
// //           const loginData = pmxResponse.data.Data || {};
          
// //           // 🔥 設置完整的認證 cookies
// //           setCookieWithExpiry('company_id', loginData.company_id || '');
// //           setCookieWithExpiry('employee_id', employeeId);
// //           setCookieWithExpiry('user_name', loginData.name || '');
// //           setCookieWithExpiry('department', loginData.department || '');
// //           setCookieWithExpiry('position', loginData.position || '');
// //           setCookieWithExpiry('job_grade', loginData.job_grade || '');
// //           setCookieWithExpiry('company_name', loginData.company_name || '');
          
// //           // 🔥 最重要：設置認證 token
// //           if (loginData.xtbb) {
// //             setCookieWithExpiry('auth_xtbb', loginData.xtbb);
// //             console.log('✅ 已設置 auth_xtbb token');
// //           } else {
// //             // 🔥 如果沒有 xtbb，生成一個臨時的認證標記
// //             const tempToken = `pmx_only_${employeeId}_${Date.now()}`;
// //             setCookieWithExpiry('auth_xtbb', tempToken);
// //             console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
// //           }
          
// //           // 🔥 設置 PMX 登入狀態標記
// //           setCookieWithExpiry('pmx_logged_in', 'true');
// //           setCookieWithExpiry('login_timestamp', Date.now().toString());
// //           setCookieWithExpiry('login_method', 'PMX_ONLY');
          
// //           if (rememberMe) {
// //             await saveLoginDataToCookies(loginData, {
// //               employee_id: employeeId,
// //               password: password
// //             });
// //           }

// //           if (isFlutterEnvironment) {
// //             sendMessageToFlutter('loginSuccess', {
// //               employee_id: employeeId,
// //               employee_name: loginData.name || '',
// //               department_position: loginData.department_position || '',
// //               pmx_data: loginData,
// //               userData: loginData,
// //               rememberMe: rememberMe,
// //               language: language,
// //               loginTimestamp: Date.now(),
// //               loginMethod: 'PMX_ONLY' // 標記為僅 PMX 登入
// //             });
// //           } else {
// //             console.log('準備跳轉到首頁...');
// //             setTimeout(() => {
// //               window.location.href = 'https://rabbit.54ucl.com:3003/frontpagepmx';
// //             }, 1000);
// //           }
// //         } else {
// //           throw new Error(pmxResponse.data.Msg || 'PMX 登入失敗');
// //         }
// //       }
// //     } catch (error) {
// //       console.error('=== 登入過程發生錯誤 ===');
// //       console.error('錯誤詳情:', error);
      
// //       let errorMessage = '員工ID或密碼錯誤，請重新輸入';
      
// //       if (error.response) {
// //         console.error('HTTP 錯誤回應:', error.response.status, error.response.data);
        
// //         switch (error.response.status) {
// //           case 401:
// //             errorMessage = '員工ID或密碼錯誤，請重新輸入';
// //             break;
// //           case 408:
// //             errorMessage = '連線逾時，請檢查網路連線';
// //             break;
// //           case 502:
// //             errorMessage = '服務暫時無法使用，請稍後再試';
// //             break;
// //           case 503:
// //             errorMessage = '網路連線錯誤，請檢查網路設定';
// //             break;
// //           case 500:
// //             errorMessage = '伺服器暫時無法使用，請稍後再試';
// //             break;
// //           default:
// //             errorMessage = '登入失敗，請稍後再試';
// //         }
        
// //         if (error.response.data && error.response.data.Msg) {
// //           errorMessage = error.response.data.Msg;
// //         }
// //       } else if (error.code === 'ECONNABORTED') {
// //         errorMessage = '連線逾時，請檢查網路連線';
// //       } else if (error.message.includes('Network Error')) {
// //         errorMessage = '網路連線錯誤，請檢查網路設定';
// //       }
      
// //       setError(errorMessage);
      
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('loginError', {
// //           message: errorMessage,
// //           code: 'LOGIN_FAILED',
// //           httpStatus: error.response?.status,
// //           originalError: error.message
// //         });
// //       }
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [setIsLoading, setError, saveLoginDataToCookies, isFlutterEnvironment, sendMessageToFlutter, rememberMe, language, setCookieWithExpiry]);

// //   // 🔥 修改自動登入函數 - 添加 Cookie 設置
// //   const handleAutoLogin = useCallback(async (employee_id) => {
// //     if (!employee_id) {
// //       setError(t('login.autoLoginFailed'));
// //       return;
// //     }

// //     try {
// //       setIsLoading(true);
      
// //       // 🔥 PMX 自動登入不需要統編，直接使用 PMX API
// //       const response = await axios.post('https://rabbit.54ucl.com:3004/pmx/employee/auto-login', {
// //         employee_id
// //       }, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json',
// //           'X-Set-Session': 'true'
// //         },
// //         withCredentials: true
// //       });

// //       console.log("PMX 自動登入 API 回應:", response.data);

// //       if (response.data.Status === "Ok") {
// //         const loginData = response.data.Data || {};
        
// //         console.log('PMX 自動登入成功');
        
// //         // 🔥 設置完整的認證 cookies
// //         setCookieWithExpiry('company_id', loginData.company_id || '');
// //         setCookieWithExpiry('employee_id', employee_id);
// //         setCookieWithExpiry('user_name', loginData.name || '');
// //         setCookieWithExpiry('department', loginData.department || '');
// //         setCookieWithExpiry('position', loginData.position || '');
// //         setCookieWithExpiry('job_grade', loginData.job_grade || '');
// //         setCookieWithExpiry('company_name', loginData.company_name || '');
        
// //         // 🔥 最重要：設置認證 token
// //         if (loginData.xtbb) {
// //           setCookieWithExpiry('auth_xtbb', loginData.xtbb);
// //           console.log('✅ 已設置 auth_xtbb token');
// //         } else {
// //           const tempToken = `pmx_auto_${employee_id}_${Date.now()}`;
// //           setCookieWithExpiry('auth_xtbb', tempToken);
// //           console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
// //         }
        
// //         // 🔥 設置 PMX 登入狀態標記
// //         setCookieWithExpiry('pmx_logged_in', 'true');
// //         setCookieWithExpiry('login_timestamp', Date.now().toString());
// //         setCookieWithExpiry('login_method', 'AUTO_LOGIN');
        
// //         // 通知 Flutter 登入成功
// //         if (isFlutterEnvironment) {
// //           sendMessageToFlutter('loginSuccess', {
// //             employee_id: loginData.employee_id || employee_id,
// //             employee_name: loginData.name || '',
// //             userData: loginData,
// //             rememberMe: rememberMe,
// //             language: language
// //           });
// //         } else {
// //           // 在瀏覽器環境中，直接跳轉到首頁
// //           setTimeout(() => {
// //             window.location.href = 'https://rabbit.54ucl.com:3003/frontpagepmx';
// //           }, 500);
// //         }
// //       } else {
// //         setError(response.data.Msg || t('login.autoLoginFailed'));
// //       }
// //     } catch (err) {
// //       console.error("PMX 自動登入失敗:", err);
// //       setError(`${t('login.autoLoginFailed')}: ${err.response?.data?.Msg || err.message}`);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [setIsLoading, setError, isFlutterEnvironment, sendMessageToFlutter, rememberMe, language, t, setCookieWithExpiry]);

// //   // 處理語言切換
// //   const handleLanguageChange = (selectedLanguage) => {
// //     console.log('切換語言到:', selectedLanguage);
// //     changeLanguage(selectedLanguage);
    
// //     // 通知 Flutter 語言變更
// //     if (isFlutterEnvironment) {
// //       sendMessageToFlutter('languageChanged', { 
// //         language: selectedLanguage 
// //       });
// //     }
// //   };

// //   // 防抖函數 - 減少狀態更新頻率
// //   const debounceUpdate = useCallback((field, value) => {
// //     if (debounceTimerRef.current) {
// //       clearTimeout(debounceTimerRef.current);
// //     }
    
// //     debounceTimerRef.current = setTimeout(() => {
// //       updateCredential(field, value);
// //     }, 100); // 100ms 延遲
// //   }, [updateCredential]);

// //   // 處理輸入變更 - 使用防抖
// //   const handleInputChange = useCallback((field, value) => {
// //     // 直接更新顯示值，但延遲更新狀態
// //     debounceUpdate(field, value);
// //   }, [debounceUpdate]);

// //   // 🔥 修改 handleLogin 函數，使用雙重登入，PMX 不需要統編
// //   const handleLogin = async (e) => {
// //     if (e) e.preventDefault();
    
// //     // 獲取當前表單的實際值
// //     const currentEmployeeId = employeeIdRef.current?.value || credentials.employee_id;
// //     const currentPassword = passwordRef.current?.value || credentials.password;
    
// //     console.log('開始 PMX 登入流程:', {
// //       employee_id: currentEmployeeId,
// //       hasPassword: !!currentPassword
// //     });
    
// //     // 🔥 PMX 只需要驗證員工ID和密碼
// //     if (!currentEmployeeId || !currentPassword) {
// //       setError('請輸入員工ID和密碼');
// //       return;
// //     }
    
// //     // 🔥 執行雙重登入（PMX 不需要統編）
// //     await handleDualLogin(currentEmployeeId, currentPassword);
// //   };

// //   // 🔥 修改：檢查已存在登入資料的邏輯，加入 SSO 檢查
// //   useEffect(() => {
// //     if (!isInitialized) return;
    
// //     let isMounted = true;
    
// //     const checkLoginAndRedirect = async () => {
// //       try {
// //         const existingLogin = await checkExistingLogin();
        
// //         console.log('🔥 檢查登入狀態結果:', existingLogin);
        
// //         if (isMounted && existingLogin) {
// //           // 🔥 如果檢測到 PMX SSO 登入成功，直接跳轉
// //           if (existingLogin.hasToken && existingLogin.loginType?.includes('PMX_SSO')) {
// //             console.log('🔥 檢測到 PMX SSO 登入成功，準備跳轉到首頁');
            
// //             // 通知 Flutter（如果在 Flutter 環境中）
// //             if (isFlutterEnvironment) {
// //               sendMessageToFlutter('autoLoginSuccess', {
// //                 employee_id: existingLogin.employee_id,
// //                 loginType: existingLogin.loginType,
// //                 redirectTo: 'frontpagepmx'
// //               });
// //             } else {
// //               // 🔥 直接跳轉到首頁
// //               console.log('🔥 執行跳轉到首頁');
// //               window.location.href = 'https://rabbit.54ucl.com:3003/frontpagepmx';
// //             }
// //             return;
// //           }
          
// //           // 🔥 如果只是記住我的資料，更新表單但不跳轉
// //           if (existingLogin.employee_id !== credentials.employee_id) {
// //             updateCredential('employee_id', existingLogin.employee_id);
            
// //             sendMessageToFlutter('existingLoginFound', {
// //               employee_id: existingLogin.employee_id,
// //               hasToken: existingLogin.hasToken,
// //               loginType: existingLogin.loginType,
// //               isIOS: isIOS,
// //               language: language
// //             });
// //           }
// //         }
// //       } catch (error) {
// //         console.error('檢查已存在登入資料時出錯:', error);
// //       }
// //     };
    
// //     // 🔥 延遲執行，確保 SSO 檢查完成
// //     const timeoutId = setTimeout(checkLoginAndRedirect, 200);
    
// //     return () => {
// //       isMounted = false;
// //       clearTimeout(timeoutId);
// //     };
// //   }, [isInitialized, checkExistingLogin, updateCredential, sendMessageToFlutter, isFlutterEnvironment, isIOS, language, credentials.employee_id]);

// //   // 處理記住我的變更
// //   const handleRememberMeChange = (e) => {
// //     setRememberMe(e.target.checked);
// //   };

// //   // 如果還在初始化中，顯示加載提示
// //   if (!isInitialized) {
// //     return (
// //       <div className="container">
// //         <div className="form-wrapper">
// //           <div className="loading">{t('login.initializing')}</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container">
// //       <div className="form-wrapper">
// //         {/* 語言選擇器 */}
// //         <div className="language-selector">
// //           <button
// //             className={`language-btn ${language === 'zh-TW' ? 'active' : ''}`}
// //             onClick={() => handleLanguageChange('zh-TW')}
// //             type="button"
// //           >
// //             中文
// //           </button>
// //           <button
// //             className={`language-btn ${language === 'vi-VN' ? 'active' : ''}`}
// //             onClick={() => handleLanguageChange('vi-VN')}
// //             type="button"
// //           >
// //             Tiếng Việt
// //           </button>
// //         </div>
        
// //         {!passwordChange.showPasswordChange ? (
// //           <>
// //             <div className="title">{t('login.title')}</div>

// //             <form onSubmit={handleLogin} noValidate>
// //               {/* 🔥 PMX 不需要統編，移除統編輸入框 */}
              
// //               <input
// //                 ref={employeeIdRef}
// //                 type="text"
// //                 placeholder={t('login.employeeIdPlaceholder')}
// //                 className="input"
// //                 defaultValue={credentials.employee_id}
// //                 onChange={(e) => handleInputChange('employee_id', e.target.value)}
// //                 disabled={isLoading}
// //                 required
// //               />
// //               <input
// //                 ref={passwordRef}
// //                 type="password"
// //                 placeholder={t('login.passwordPlaceholder')}
// //                 className="input"
// //                 defaultValue={credentials.password}
// //                 onChange={(e) => handleInputChange('password', e.target.value)}
// //                 disabled={isLoading}
// //                 required
// //               />
              
// //               {/* 記住我選項 */}
// //               <div className="remember-me">
// //                 <label>
// //                   <input
// //                     type="checkbox"
// //                     checked={rememberMe}
// //                     onChange={handleRememberMeChange}
// //                     disabled={isLoading}
// //                   />
// //                   <span>{t('login.rememberMe')}</span>
// //                 </label>
// //               </div>
              
// //               <div className="button-group">
// //                 <button
// //                   type="button"
// //                   className="button"
// //                   onClick={handleForgotPassword}
// //                   disabled={isLoading}
// //                 >
// //                   {t('login.forgotPassword')}
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="button primary-button"
// //                   disabled={isLoading}
// //                 >
// //                   {isLoading ? t('login.loggingIn') : t('login.loginButton')}
// //                 </button>
// //               </div>
// //             </form>

// //             {error && <div className="error">{error}</div>}
// //             {isLoading && <div className="loading">{t('login.processing')}</div>}
// //           </>
// //         ) : (
// //           <>
// //             <div className="title">{t('login.changePassword')}</div>
// //             <div className="congrats-text">
// //               {t('login.congratsMessage')}
// //             </div>
// //             <input
// //               type="password"
// //               placeholder={t('login.newPassword')}
// //               className="input"
// //               value={passwordChange.newPassword}
// //               onChange={e => updatePasswordField('newPassword', e.target.value)}
// //               disabled={isLoading}
// //             />
// //             <input
// //               type="password"
// //               placeholder={t('login.confirmPassword')}
// //               className="input"
// //               value={passwordChange.confirmPassword}
// //               onChange={e => updatePasswordField('confirmPassword', e.target.value)}
// //               disabled={isLoading}
// //             />
// //             {error && <div className="error">{error}</div>}
// //             {isLoading && <div className="loading">{t('login.processing')}</div>}
// //             <button
// //               className="full-width-button"
// //               onClick={handlePasswordUpdate}
// //               disabled={isLoading}
// //             >
// //               {isLoading ? t('login.processing') : t('login.updatePasswordAndLogin')}
// //             </button>
// //             <button
// //               className="secondary-button"
// //               onClick={() => setShowPasswordChange(false)}
// //               disabled={isLoading}
// //             >
// //               {t('login.backToLogin')}
// //             </button>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default ApploginPMX;
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import './PMX_CSS/ApploginPMX.css';
// import { useFlutterIntegration } from './Hook/hooks';
// import { useLanguage } from './Hook/useLanguage';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// function ApploginPMX() {
//   // 添加語言功能
//   const { t, language, changeLanguage } = useLanguage();
  
//   const {
//     // 基本狀態
//     isFlutterEnvironment,
//     error,
//     isLoading,
//     isIOS,
//     isInitialized,
    
//     // 登入表單相關
//     credentials, 
//     passwordChange, 
//     updateCredential, 
//     updatePasswordField, 
//     setShowPasswordChange, 
//     clearForm, 
//     handleLogin: originalHandleLogin, 
//     handlePasswordUpdate, 
//     handleForgotPassword,
//     setError,
//     setIsLoading,
    
//     // 記住我功能
//     rememberMe,
//     setRememberMe,
    
//     // Flutter 通訊
//     sendMessageToFlutter,
    
//     // Cookie 相關
//     checkExistingLogin,
//     clearAllLoginCookies,
//     getAllLoginCookies,
//     saveLoginDataToCookies
//   } = useFlutterIntegration('login');

//   // 創建 refs 來獲取表單元素
//   const employeeIdRef = useRef(null);
//   const passwordRef = useRef(null);
  
//   // 防抖計時器
//   const debounceTimerRef = useRef(null);

//   // 🔥 新增：SSO 檢查狀態
//   const [ssoChecked, setSsoChecked] = useState(false);

//   // 設置 cookie 的函數，過期時間為 120 小時（僅用於非敏感資料）
//   const setCookieWithExpiry = (name, value) => {
//     const expirationHours = 120;
//     const expirationDays = expirationHours / 24;
    
//     // 增強 Cookie 選項
//     Cookies.set(name, value, { 
//       expires: expirationDays, 
//       path: '/',
//       secure: window.location.protocol === 'https:',
//       sameSite: 'lax'
//     });
    
//     console.log(`設置 Cookie: ${name} = ${name.includes('token') || name.includes('password') ? '[已隱藏]' : value}`);
    
//     // 對於 iOS 設備，使用多種備份方式
//     if (isIOS) {
//       try {
//         sessionStorage.setItem(`cookie_${name}`, value);
//         localStorage.setItem(`temp_cookie_${name}`, value);
//       } catch (error) {
//         console.error(`保存 ${name} 到存儲失敗:`, error);
//       }
//     }
//   };

//   // 🔥 新增：檢查 PMX SSO 登入狀態
//   const checkPMXSSOLogin = useCallback(() => {
//     console.log('🔥 檢查 PMX SSO 登入狀態');
    
//     // 檢查 PMX SSO 專用的 cookies
//     const employeeId = Cookies.get('employee_id');
//     const pmxLoggedIn = Cookies.get('pmx_logged_in');
//     const authXtbb = Cookies.get('auth_xtbb'); // 🔥 添加 auth_xtbb 檢查
//     const pmxSessionToken = Cookies.get('pmx_session_token');
//     const ssoAccessToken = Cookies.get('sso_access_token');
//     const name = Cookies.get('name');
    
//     console.log('🔥 PMX SSO Cookies 檢查:', {
//       employee_id: employeeId,
//       pmx_logged_in: pmxLoggedIn,
//       has_auth_xtbb: !!authXtbb, // 🔥 檢查 auth_xtbb
//       has_pmx_session_token: !!pmxSessionToken,
//       has_sso_access_token: !!ssoAccessToken,
//       name: name
//     });
    
//     // 🔥 PMX SSO 登入成功的條件 - 必須包含 auth_xtbb
//     if (employeeId && pmxLoggedIn === 'true' && authXtbb && (pmxSessionToken || ssoAccessToken)) {
//       console.log('✅ 檢測到 PMX SSO 登入成功！');
      
//       // 通知 Flutter（如果在 Flutter 環境中）
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('ssoLoginDetected', {
//           employee_id: employeeId,
//           name: name || '',
//           loginType: 'PMX_SSO',
//           redirectTo: 'frontpagepmx'
//         });
//       }
      
//       // 🔥 直接跳轉到首頁 - 改為相對路徑
//       console.log('🔥 執行 PMX SSO 自動跳轉到首頁');
//       window.location.href = '/frontpagepmx';
//       return true;
//     }
    
//     return false;
//   }, [isFlutterEnvironment, sendMessageToFlutter]);

//   // 🔥 新增：檢查 URL 參數中的 SSO 成功標記
//   const checkURLSSOSuccess = useCallback(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const ssoLogin = urlParams.get('sso_login');
    
//     if (ssoLogin === 'success') {
//       console.log('🔥 檢測到 URL 中的 SSO 登入成功參數');
      
//       // 清理 URL 參數
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);
      
//       // 檢查 PMX SSO cookies
//       return checkPMXSSOLogin();
//     }
    
//     return false;
//   }, [checkPMXSSOLogin]);

//   // 🔥 新增：頁面載入時的 SSO 檢查
//   useEffect(() => {
//     if (!ssoChecked && isInitialized) {
//       console.log('🔥 執行頁面載入時的 SSO 檢查');
      
//       // 首先檢查 URL 參數
//       const urlSSODetected = checkURLSSOSuccess();
      
//       // 如果 URL 沒有 SSO 參數，檢查 cookies
//       if (!urlSSODetected) {
//         checkPMXSSOLogin();
//       }
      
//       setSsoChecked(true);
//     }
//   }, [isInitialized, ssoChecked, checkURLSSOSuccess, checkPMXSSOLogin]);

//   // 🔥 修改 handleDualLogin 函數，添加完整的 Cookie 設置
//   const handleDualLogin = useCallback(async (employeeId, password) => {
//     try {
//       setIsLoading(true);
//       setError('');
      
//       console.log('=== 開始雙重登入流程 ===');
      
//       // 🔥 第一步：調用外部 IDP API 登入
//       const emailAddress = `${employeeId}@2330.rm`; // 自動添加後綴
//       console.log('第一步: 外部 IDP 登入，郵箱:', emailAddress);
      
//       try {
//         const idpResponse = await axios.post('https://identityprovider.54ucl.com:1989/api/login', {
//           email: emailAddress,
//           password: password,
//           client_id: "d612d8bc-2f85-4eb6-8a09-6ff7f5a910eb",
//           client_secret: "e3Lu3P3O0veUdD7UYNsMc2Q6-Eb2YSgE1F1v11vG6-Y"
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Set-Session': 'true'
//           },
//           withCredentials: true,
//           timeout: 30000
//         });

//         console.log('外部 IDP API 回應:', idpResponse.data);

//         if (idpResponse.data && idpResponse.data.access_token) {
//           const idpTokens = {
//             access_token: idpResponse.data.access_token,
//             refresh_token: idpResponse.data.refresh_token,
//             id_token: idpResponse.data.id_token,
//             token_type: idpResponse.data.token_type
//           };
          
//           console.log('第一步成功: 獲得外部 IDP tokens');
          
//           // 🔥 第二步：調用您自己的 PMX 登入 API
//           console.log('第二步: 開始 PMX 登入流程');
          
//           const pmxResponse = await axios.post('https://rabbit.54ucl.com:3004/pmx/employee/login', {
//             employee_id: employeeId,
//             password: password
//           }, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json',
//               'X-Set-Session': 'true'
//             },
//             withCredentials: true,
//             timeout: 30000
//           });

//           console.log('PMX API 回應:', pmxResponse.data);

//           if (pmxResponse.data.Status === "Ok") {
//             console.log('=== 雙重登入成功 ===');
            
//             const loginData = pmxResponse.data.Data || {};
            
//             // 🔥 設置完整的認證 cookies
//             setCookieWithExpiry('company_id', loginData.company_id || '');
//             setCookieWithExpiry('employee_id', employeeId);
//             setCookieWithExpiry('user_name', loginData.name || '');
//             setCookieWithExpiry('department', loginData.department || '');
//             setCookieWithExpiry('position', loginData.position || '');
//             setCookieWithExpiry('job_grade', loginData.job_grade || '');
//             setCookieWithExpiry('company_name', loginData.company_name || '');
            
//             // 🔥 最重要：設置認證 token
//             if (loginData.xtbb) {
//               setCookieWithExpiry('auth_xtbb', loginData.xtbb);
//               console.log('✅ 已設置 auth_xtbb token');
//             } else {
//               // 🔥 如果沒有 xtbb，生成一個臨時的認證標記
//               const tempToken = `pmx_dual_${employeeId}_${Date.now()}`;
//               setCookieWithExpiry('auth_xtbb', tempToken);
//               console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
//             }
            
//             // 🔥 設置 PMX 登入狀態標記
//             setCookieWithExpiry('pmx_logged_in', 'true');
//             setCookieWithExpiry('login_timestamp', Date.now().toString());
//             setCookieWithExpiry('login_method', 'DUAL_LOGIN');
            
//             // 🔥 設置 IDP tokens
//             if (idpTokens.access_token) {
//               setCookieWithExpiry('sso_access_token', idpTokens.access_token);
//               setCookieWithExpiry('sso_refresh_token', idpTokens.refresh_token || '');
//               setCookieWithExpiry('sso_id_token', idpTokens.id_token || '');
//             }
            
//             if (rememberMe) {
//               await saveLoginDataToCookies(loginData, {
//                 employee_id: employeeId,
//                 password: password
//               });
//             }

//             if (isFlutterEnvironment) {
//               sendMessageToFlutter('loginSuccess', {
//                 employee_id: employeeId,
//                 employee_name: loginData.name || '',
//                 department_position: loginData.department_position || '',
//                 idp_tokens: idpTokens,
//                 pmx_data: loginData,
//                 userData: loginData,
//                 rememberMe: rememberMe,
//                 language: language,
//                 loginTimestamp: Date.now()
//               });
//             } else {
//               console.log('準備跳轉到首頁...');
//               setTimeout(() => {
//                 window.location.href = '/frontpagepmx'; // 🔥 改為相對路徑
//               }, 1000);
//             }
//           } else {
//             throw new Error(pmxResponse.data.Msg || 'PMX 登入失敗');
//           }
//         } else {
//           throw new Error('外部 IDP 登入失敗，未獲得有效 token');
//         }
//       } catch (idpError) {
//         console.error('IDP 登入失敗:', idpError);
        
//         // 🔥 如果 IDP 登入失敗，嘗試直接使用 PMX 登入
//         console.log('IDP 登入失敗，嘗試直接 PMX 登入...');
        
//         const pmxResponse = await axios.post('https://rabbit.54ucl.com:3004/pmx/employee/login', {
//           employee_id: employeeId,
//           password: password
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'X-Set-Session': 'true'
//           },
//           withCredentials: true,
//           timeout: 30000
//         });

//         console.log('直接 PMX API 回應:', pmxResponse.data);

//         if (pmxResponse.data.Status === "Ok") {
//           console.log('=== 直接 PMX 登入成功 ===');
          
//           const loginData = pmxResponse.data.Data || {};
          
//           // 🔥 設置完整的認證 cookies
//           setCookieWithExpiry('company_id', loginData.company_id || '');
//           setCookieWithExpiry('employee_id', employeeId);
//           setCookieWithExpiry('user_name', loginData.name || '');
//           setCookieWithExpiry('department', loginData.department || '');
//           setCookieWithExpiry('position', loginData.position || '');
//           setCookieWithExpiry('job_grade', loginData.job_grade || '');
//           setCookieWithExpiry('company_name', loginData.company_name || '');
          
//           // 🔥 最重要：設置認證 token
//           if (loginData.xtbb) {
//             setCookieWithExpiry('auth_xtbb', loginData.xtbb);
//             console.log('✅ 已設置 auth_xtbb token');
//           } else {
//             // 🔥 如果沒有 xtbb，生成一個臨時的認證標記
//             const tempToken = `pmx_only_${employeeId}_${Date.now()}`;
//             setCookieWithExpiry('auth_xtbb', tempToken);
//             console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
//           }
          
//           // 🔥 設置 PMX 登入狀態標記
//           setCookieWithExpiry('pmx_logged_in', 'true');
//           setCookieWithExpiry('login_timestamp', Date.now().toString());
//           setCookieWithExpiry('login_method', 'PMX_ONLY');
          
//           if (rememberMe) {
//             await saveLoginDataToCookies(loginData, {
//               employee_id: employeeId,
//               password: password
//             });
//           }

//           if (isFlutterEnvironment) {
//             sendMessageToFlutter('loginSuccess', {
//               employee_id: employeeId,
//               employee_name: loginData.name || '',
//               department_position: loginData.department_position || '',
//               pmx_data: loginData,
//               userData: loginData,
//               rememberMe: rememberMe,
//               language: language,
//               loginTimestamp: Date.now(),
//               loginMethod: 'PMX_ONLY' // 標記為僅 PMX 登入
//             });
//           } else {
//             console.log('準備跳轉到首頁...');
//             setTimeout(() => {
//               window.location.href = '/frontpagepmx'; // 🔥 改為相對路徑
//             }, 1000);
//           }
//         } else {
//           throw new Error(pmxResponse.data.Msg || 'PMX 登入失敗');
//         }
//       }
//     } catch (error) {
//       console.error('=== 登入過程發生錯誤 ===');
//       console.error('錯誤詳情:', error);
      
//       let errorMessage = '員工ID或密碼錯誤，請重新輸入';
      
//       if (error.response) {
//         console.error('HTTP 錯誤回應:', error.response.status, error.response.data);
        
//         switch (error.response.status) {
//           case 401:
//             errorMessage = '員工ID或密碼錯誤，請重新輸入';
//             break;
//           case 408:
//             errorMessage = '連線逾時，請檢查網路連線';
//             break;
//           case 502:
//             errorMessage = '服務暫時無法使用，請稍後再試';
//             break;
//           case 503:
//             errorMessage = '網路連線錯誤，請檢查網路設定';
//             break;
//           case 500:
//             errorMessage = '伺服器暫時無法使用，請稍後再試';
//             break;
//           default:
//             errorMessage = '登入失敗，請稍後再試';
//         }
        
//         if (error.response.data && error.response.data.Msg) {
//           errorMessage = error.response.data.Msg;
//         }
//       } else if (error.code === 'ECONNABORTED') {
//         errorMessage = '連線逾時，請檢查網路連線';
//       } else if (error.message.includes('Network Error')) {
//         errorMessage = '網路連線錯誤，請檢查網路設定';
//       }
      
//       setError(errorMessage);
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('loginError', {
//           message: errorMessage,
//           code: 'LOGIN_FAILED',
//           httpStatus: error.response?.status,
//           originalError: error.message
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, [setIsLoading, setError, saveLoginDataToCookies, isFlutterEnvironment, sendMessageToFlutter, rememberMe, language, setCookieWithExpiry]);

//   // 🔥 修改自動登入函數 - 添加 Cookie 設置
//   const handleAutoLogin = useCallback(async (employee_id) => {
//     if (!employee_id) {
//       setError(t('login.autoLoginFailed'));
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       // 🔥 PMX 自動登入不需要統編，直接使用 PMX API
//       const response = await axios.post('https://rabbit.54ucl.com:3004/pmx/employee/auto-login', {
//         employee_id
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'X-Set-Session': 'true'
//         },
//         withCredentials: true
//       });

//       console.log("PMX 自動登入 API 回應:", response.data);

//       if (response.data.Status === "Ok") {
//         const loginData = response.data.Data || {};
        
//         console.log('PMX 自動登入成功');
        
//         // 🔥 設置完整的認證 cookies
//         setCookieWithExpiry('company_id', loginData.company_id || '');
//         setCookieWithExpiry('employee_id', employee_id);
//         setCookieWithExpiry('user_name', loginData.name || '');
//         setCookieWithExpiry('department', loginData.department || '');
//         setCookieWithExpiry('position', loginData.position || '');
//         setCookieWithExpiry('job_grade', loginData.job_grade || '');
//         setCookieWithExpiry('company_name', loginData.company_name || '');
        
//         // 🔥 最重要：設置認證 token
//         if (loginData.xtbb) {
//           setCookieWithExpiry('auth_xtbb', loginData.xtbb);
//           console.log('✅ 已設置 auth_xtbb token');
//         } else {
//           const tempToken = `pmx_auto_${employee_id}_${Date.now()}`;
//           setCookieWithExpiry('auth_xtbb', tempToken);
//           console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
//         }
        
//         // 🔥 設置 PMX 登入狀態標記
//         setCookieWithExpiry('pmx_logged_in', 'true');
//         setCookieWithExpiry('login_timestamp', Date.now().toString());
//         setCookieWithExpiry('login_method', 'AUTO_LOGIN');
        
//         // 通知 Flutter 登入成功
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('loginSuccess', {
//             employee_id: loginData.employee_id || employee_id,
//             employee_name: loginData.name || '',
//             userData: loginData,
//             rememberMe: rememberMe,
//             language: language
//           });
//         } else {
//           // 在瀏覽器環境中，直接跳轉到首頁
//           setTimeout(() => {
//             window.location.href = '/frontpagepmx'; // 🔥 改為相對路徑
//           }, 500);
//         }
//       } else {
//         setError(response.data.Msg || t('login.autoLoginFailed'));
//       }
//     } catch (err) {
//       console.error("PMX 自動登入失敗:", err);
//       setError(`${t('login.autoLoginFailed')}: ${err.response?.data?.Msg || err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [setIsLoading, setError, isFlutterEnvironment, sendMessageToFlutter, rememberMe, language, t, setCookieWithExpiry]);

//   // 處理語言切換
//   const handleLanguageChange = (selectedLanguage) => {
//     console.log('切換語言到:', selectedLanguage);
//     changeLanguage(selectedLanguage);
    
//     // 通知 Flutter 語言變更
//     if (isFlutterEnvironment) {
//       sendMessageToFlutter('languageChanged', { 
//         language: selectedLanguage 
//       });
//     }
//   };

//   // 防抖函數 - 減少狀態更新頻率
//   const debounceUpdate = useCallback((field, value) => {
//     if (debounceTimerRef.current) {
//       clearTimeout(debounceTimerRef.current);
//     }
    
//     debounceTimerRef.current = setTimeout(() => {
//       updateCredential(field, value);
//     }, 100); // 100ms 延遲
//   }, [updateCredential]);

//   // 處理輸入變更 - 使用防抖
//   const handleInputChange = useCallback((field, value) => {
//     // 直接更新顯示值，但延遲更新狀態
//     debounceUpdate(field, value);
//   }, [debounceUpdate]);

//   // 🔥 修改 handleLogin 函數，使用雙重登入，PMX 不需要統編
//   const handleLogin = async (e) => {
//     if (e) e.preventDefault();
    
//     // 獲取當前表單的實際值
//     const currentEmployeeId = employeeIdRef.current?.value || credentials.employee_id;
//     const currentPassword = passwordRef.current?.value || credentials.password;
    
//     console.log('開始 PMX 登入流程:', {
//       employee_id: currentEmployeeId,
//       hasPassword: !!currentPassword
//     });
    
//     // 🔥 PMX 只需要驗證員工ID和密碼
//     if (!currentEmployeeId || !currentPassword) {
//       setError('請輸入員工ID和密碼');
//       return;
//     }
    
//     // 🔥 執行雙重登入（PMX 不需要統編）
//     await handleDualLogin(currentEmployeeId, currentPassword);
//   };

//   // 🔥 修改：檢查已存在登入資料的邏輯，加入 SSO 檢查
//   useEffect(() => {
//     if (!isInitialized) return;
    
//     let isMounted = true;
    
//     const checkLoginAndRedirect = async () => {
//       try {
//         const existingLogin = await checkExistingLogin();
        
//         console.log('🔥 檢查登入狀態結果:', existingLogin);
        
//         if (isMounted && existingLogin) {
//           // 🔥 如果檢測到 PMX SSO 登入成功，直接跳轉
//           if (existingLogin.hasToken && existingLogin.loginType?.includes('PMX_SSO')) {
//             console.log('🔥 檢測到 PMX SSO 登入成功，準備跳轉到首頁');
            
//             // 通知 Flutter（如果在 Flutter 環境中）
//             if (isFlutterEnvironment) {
//               sendMessageToFlutter('autoLoginSuccess', {
//                 employee_id: existingLogin.employee_id,
//                 loginType: existingLogin.loginType,
//                 redirectTo: 'frontpagepmx'
//               });
//             } else {
//               // 🔥 直接跳轉到首頁 - 改為相對路徑
//               console.log('🔥 執行跳轉到首頁');
//               window.location.href = '/frontpagepmx';
//             }
//             return;
//           }
          
//           // 🔥 如果只是記住我的資料，更新表單但不跳轉
//           if (existingLogin.employee_id !== credentials.employee_id) {
//             updateCredential('employee_id', existingLogin.employee_id);
            
//             sendMessageToFlutter('existingLoginFound', {
//               employee_id: existingLogin.employee_id,
//               hasToken: existingLogin.hasToken,
//               loginType: existingLogin.loginType,
//               isIOS: isIOS,
//               language: language
//             });
//           }
//         }
//       } catch (error) {
//         console.error('檢查已存在登入資料時出錯:', error);
//       }
//     };
    
//     // 🔥 延遲執行，確保 SSO 檢查完成
//     const timeoutId = setTimeout(checkLoginAndRedirect, 200);
    
//     return () => {
//       isMounted = false;
//       clearTimeout(timeoutId);
//     };
//   }, [isInitialized, checkExistingLogin, updateCredential, sendMessageToFlutter, isFlutterEnvironment, isIOS, language, credentials.employee_id]);

//   // 處理記住我的變更
//   const handleRememberMeChange = (e) => {
//     setRememberMe(e.target.checked);
//   };

//   // 如果還在初始化中，顯示加載提示
//   if (!isInitialized) {
//     return (
//       <div className="container">
//         <div className="form-wrapper">
//           <div className="loading">{t('login.initializing')}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <div className="form-wrapper">
//         {/* 語言選擇器 */}
//         <div className="language-selector">
//           <button
//             className={`language-btn ${language === 'zh-TW' ? 'active' : ''}`}
//             onClick={() => handleLanguageChange('zh-TW')}
//             type="button"
//           >
//             中文
//           </button>
//           <button
//             className={`language-btn ${language === 'vi-VN' ? 'active' : ''}`}
//             onClick={() => handleLanguageChange('vi-VN')}
//             type="button"
//           >
//             Tiếng Việt
//           </button>
//         </div>
        
//         {!passwordChange.showPasswordChange ? (
//           <>
//             <div className="title">{t('login.title')}</div>

//             <form onSubmit={handleLogin} noValidate>
//               {/* 🔥 PMX 不需要統編，移除統編輸入框 */}
              
//               <input
//                 ref={employeeIdRef}
//                 type="text"
//                 placeholder={t('login.employeeIdPlaceholder')}
//                 className="input"
//                 defaultValue={credentials.employee_id}
//                 onChange={(e) => handleInputChange('employee_id', e.target.value)}
//                 disabled={isLoading}
//                 required
//               />
//               <input
//                 ref={passwordRef}
//                 type="password"
//                 placeholder={t('login.passwordPlaceholder')}
//                 className="input"
//                 defaultValue={credentials.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 disabled={isLoading}
//                 required
//               />
              
//               {/* 記住我選項 */}
//               <div className="remember-me">
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={handleRememberMeChange}
//                     disabled={isLoading}
//                   />
//                   <span>{t('login.rememberMe')}</span>
//                 </label>
//               </div>
              
//               <div className="button-group">
//                 <button
//                   type="button"
//                   className="button"
//                   onClick={handleForgotPassword}
//                   disabled={isLoading}
//                 >
//                   {t('login.forgotPassword')}
//                 </button>
//                 <button
//                   type="submit"
//                   className="button primary-button"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? t('login.loggingIn') : t('login.loginButton')}
//                 </button>
//               </div>
//             </form>

//             {error && <div className="error">{error}</div>}
//             {isLoading && <div className="loading">{t('login.processing')}</div>}
//           </>
//         ) : (
//           <>
//             <div className="title">{t('login.changePassword')}</div>
//             <div className="congrats-text">
//               {t('login.congratsMessage')}
//             </div>
//             <input
//               type="password"
//               placeholder={t('login.newPassword')}
//               className="input"
//               value={passwordChange.newPassword}
//               onChange={e => updatePasswordField('newPassword', e.target.value)}
//               disabled={isLoading}
//             />
//             <input
//               type="password"
//               placeholder={t('login.confirmPassword')}
//               className="input"
//               value={passwordChange.confirmPassword}
//               onChange={e => updatePasswordField('confirmPassword', e.target.value)}
//               disabled={isLoading}
//             />
//             {error && <div className="error">{error}</div>}
//             {isLoading && <div className="loading">{t('login.processing')}</div>}
//             <button
//               className="full-width-button"
//               onClick={handlePasswordUpdate}
//               disabled={isLoading}
//             >
//               {isLoading ? t('login.processing') : t('login.updatePasswordAndLogin')}
//             </button>
//             <button
//               className="secondary-button"
//               onClick={() => setShowPasswordChange(false)}
//               disabled={isLoading}
//             >
//               {t('login.backToLogin')}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ApploginPMX;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PMX_CSS/ApploginPMX.css';
import { useFlutterIntegration } from './Hook/hooks';
import { useLanguage } from './Hook/useLanguage';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config';

function ApploginPMX() {
  // 添加語言功能
  const { t, language, changeLanguage } = useLanguage();
  
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
  const employeeIdRef = useRef(null);
  const passwordRef = useRef(null);
  
  // 防抖計時器
  const debounceTimerRef = useRef(null);

  // 🔥 新增：SSO 檢查狀態
  const [ssoChecked, setSsoChecked] = useState(false);

  // 設置 cookie 的函數，過期時間為 120 小時（僅用於非敏感資料）
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
    
    console.log(`設置 Cookie: ${name} = ${name.includes('token') || name.includes('password') ? '[已隱藏]' : value}`);
    
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

  // 🔥 新增：檢查 PMX SSO 登入狀態
  const checkPMXSSOLogin = useCallback(() => {
    console.log('🔥 檢查 PMX SSO 登入狀態');
    
    // 檢查 PMX SSO 專用的 cookies
    const employeeId = Cookies.get('employee_id');
    const pmxLoggedIn = Cookies.get('pmx_logged_in');
    const authXtbb = Cookies.get('auth_xtbb'); // 🔥 添加 auth_xtbb 檢查
    const pmxSessionToken = Cookies.get('pmx_session_token');
    const ssoAccessToken = Cookies.get('sso_access_token');
    const name = Cookies.get('name');
    
    console.log('🔥 PMX SSO Cookies 檢查:', {
      employee_id: employeeId,
      pmx_logged_in: pmxLoggedIn,
      has_auth_xtbb: !!authXtbb, // 🔥 檢查 auth_xtbb
      has_pmx_session_token: !!pmxSessionToken,
      has_sso_access_token: !!ssoAccessToken,
      name: name
    });
    
    // 🔥 PMX SSO 登入成功的條件 - 必須包含 auth_xtbb
    if (employeeId && pmxLoggedIn === 'true' && authXtbb && (pmxSessionToken || ssoAccessToken)) {
      console.log('✅ 檢測到 PMX SSO 登入成功！');
      
      // 通知 Flutter（如果在 Flutter 環境中）
      if (isFlutterEnvironment) {
        sendMessageToFlutter('ssoLoginDetected', {
          employee_id: employeeId,
          name: name || '',
          loginType: 'PMX_SSO',
          redirectTo: 'frontpagepmx'
        });
      }
      
      // 🔥 直接跳轉到首頁 - 改為相對路徑
      console.log('🔥 執行 PMX SSO 自動跳轉到首頁');
      window.location.href = '/frontpagepmx';
      return true;
    }
    
    return false;
  }, [isFlutterEnvironment, sendMessageToFlutter]);

  // 🔥 新增：檢查 URL 參數中的 SSO 成功標記
  const checkURLSSOSuccess = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ssoLogin = urlParams.get('sso_login');
    
    if (ssoLogin === 'success') {
      console.log('🔥 檢測到 URL 中的 SSO 登入成功參數');
      
      // 清理 URL 參數
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // 檢查 PMX SSO cookies
      return checkPMXSSOLogin();
    }
    
    return false;
  }, [checkPMXSSOLogin]);

  // 🔥 新增：頁面載入時的 SSO 檢查
  useEffect(() => {
    if (!ssoChecked && isInitialized) {
      console.log('🔥 執行頁面載入時的 SSO 檢查');
      
      // 首先檢查 URL 參數
      const urlSSODetected = checkURLSSOSuccess();
      
      // 如果 URL 沒有 SSO 參數，檢查 cookies
      if (!urlSSODetected) {
        checkPMXSSOLogin();
      }
      
      setSsoChecked(true);
    }
  }, [isInitialized, ssoChecked, checkURLSSOSuccess, checkPMXSSOLogin]);

  // 🔥 修改 handleDualLogin 函數，添加完整的 Cookie 設置
  const handleDualLogin = useCallback(async (employeeId, password) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('=== 開始雙重登入流程 ===');
      
      // 🔥 第一步：調用外部 IDP API 登入
      const emailAddress = `${employeeId}@2330.rm`; // 自動添加後綴
      console.log('第一步: 外部 IDP 登入，郵箱:', emailAddress);
      
      try {
        const idpResponse = await axios.post('https://pmxsso.54ucl.com:1989/api/login', {
          email: emailAddress,
          password: password,
          client_id: "d612d8bc-2f85-4eb6-8a09-6ff7f5a910eb",
          client_secret: "e3Lu3P3O0veUdD7UYNsMc2Q6-Eb2YSgE1F1v11vG6-Y"
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Set-Session': 'true'
          },
          withCredentials: true,
          timeout: 30000
        });

        console.log('外部 IDP API 回應:', idpResponse.data);

        if (idpResponse.data && idpResponse.data.access_token) {
          const idpTokens = {
            access_token: idpResponse.data.access_token,
            refresh_token: idpResponse.data.refresh_token,
            id_token: idpResponse.data.id_token,
            token_type: idpResponse.data.token_type
          };
          
          console.log('第一步成功: 獲得外部 IDP tokens');
          
          // 🔥 第二步：調用您自己的 PMX 登入 API
          console.log('第二步: 開始 PMX 登入流程');
          
          const pmxResponse = await axios.post(`${API_BASE_URL}/pmx/employee/login`, {
            employee_id: employeeId,
            password: password
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Set-Session': 'true'
            },
            withCredentials: true,
            timeout: 30000
          });

          console.log('PMX API 回應:', pmxResponse.data);

          if (pmxResponse.data.Status === "Ok") {
            console.log('=== 雙重登入成功 ===');
            
            const loginData = pmxResponse.data.Data || {};
            
            // 🔥 設置完整的認證 cookies
            setCookieWithExpiry('company_id', loginData.company_id || '');
            setCookieWithExpiry('employee_id', employeeId);
            setCookieWithExpiry('user_name', loginData.name || '');
            setCookieWithExpiry('department', loginData.department || '');
            setCookieWithExpiry('position', loginData.position || '');
            setCookieWithExpiry('job_grade', loginData.job_grade || '');
            setCookieWithExpiry('company_name', loginData.company_name || '');
            
            // 🔥 最重要：設置認證 token
            if (loginData.xtbb) {
              setCookieWithExpiry('auth_xtbb', loginData.xtbb);
              console.log('✅ 已設置 auth_xtbb token');
            } else {
              // 🔥 如果沒有 xtbb，生成一個臨時的認證標記
              const tempToken = `pmx_dual_${employeeId}_${Date.now()}`;
              setCookieWithExpiry('auth_xtbb', tempToken);
              console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
            }
            
            // 🔥 設置 PMX 登入狀態標記
            setCookieWithExpiry('pmx_logged_in', 'true');
            setCookieWithExpiry('login_timestamp', Date.now().toString());
            setCookieWithExpiry('login_method', 'DUAL_LOGIN');
            
            // 🔥 設置 IDP tokens
            if (idpTokens.access_token) {
              setCookieWithExpiry('sso_access_token', idpTokens.access_token);
              setCookieWithExpiry('sso_refresh_token', idpTokens.refresh_token || '');
              setCookieWithExpiry('sso_id_token', idpTokens.id_token || '');
            }
            
            if (rememberMe) {
              await saveLoginDataToCookies(loginData, {
                employee_id: employeeId,
                password: password
              });
            }

            if (isFlutterEnvironment) {
              sendMessageToFlutter('loginSuccess', {
                employee_id: employeeId,
                employee_name: loginData.name || '',
                department_position: loginData.department_position || '',
                idp_tokens: idpTokens,
                pmx_data: loginData,
                userData: loginData,
                rememberMe: rememberMe,
                language: language,
                loginTimestamp: Date.now()
              });
            } else {
              console.log('準備跳轉到首頁...');
              setTimeout(() => {
                window.location.href = '/frontpagepmx'; // 🔥 改為相對路徑
              }, 1000);
            }
          } else {
            throw new Error(pmxResponse.data.Msg || 'PMX 登入失敗');
          }
        } else {
          throw new Error('外部 IDP 登入失敗，未獲得有效 token');
        }
      } catch (idpError) {
        console.error('IDP 登入失敗:', idpError);
        
        // 🔥 如果 IDP 登入失敗，嘗試直接使用 PMX 登入
        console.log('IDP 登入失敗，嘗試直接 PMX 登入...');
        
        const pmxResponse = await axios.post(`${API_BASE_URL}/api/pmx/employee/login`, {
          employee_id: employeeId,
          password: password
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Set-Session': 'true'
          },
          withCredentials: true,
          timeout: 30000
        });

        console.log('直接 PMX API 回應:', pmxResponse.data);

        if (pmxResponse.data.Status === "Ok") {
          console.log('=== 直接 PMX 登入成功 ===');
          
          const loginData = pmxResponse.data.Data || {};
          
          // 🔥 設置完整的認證 cookies
          setCookieWithExpiry('company_id', loginData.company_id || '');
          setCookieWithExpiry('employee_id', employeeId);
          setCookieWithExpiry('user_name', loginData.name || '');
          setCookieWithExpiry('department', loginData.department || '');
          setCookieWithExpiry('position', loginData.position || '');
          setCookieWithExpiry('job_grade', loginData.job_grade || '');
          setCookieWithExpiry('company_name', loginData.company_name || '');
          
          // 🔥 最重要：設置認證 token
          if (loginData.xtbb) {
            setCookieWithExpiry('auth_xtbb', loginData.xtbb);
            console.log('✅ 已設置 auth_xtbb token');
          } else {
            // 🔥 如果沒有 xtbb，生成一個臨時的認證標記
            const tempToken = `pmx_only_${employeeId}_${Date.now()}`;
            setCookieWithExpiry('auth_xtbb', tempToken);
            console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
          }
          
          // 🔥 設置 PMX 登入狀態標記
          setCookieWithExpiry('pmx_logged_in', 'true');
          setCookieWithExpiry('login_timestamp', Date.now().toString());
          setCookieWithExpiry('login_method', 'PMX_ONLY');
          
          if (rememberMe) {
            await saveLoginDataToCookies(loginData, {
              employee_id: employeeId,
              password: password
            });
          }

          if (isFlutterEnvironment) {
            sendMessageToFlutter('loginSuccess', {
              employee_id: employeeId,
              employee_name: loginData.name || '',
              department_position: loginData.department_position || '',
              pmx_data: loginData,
              userData: loginData,
              rememberMe: rememberMe,
              language: language,
              loginTimestamp: Date.now(),
              loginMethod: 'PMX_ONLY' // 標記為僅 PMX 登入
            });
          } else {
            console.log('準備跳轉到首頁...');
            setTimeout(() => {
              window.location.href = '/frontpagepmx'; // 🔥 改為相對路徑
            }, 1000);
          }
        } else {
          throw new Error(pmxResponse.data.Msg || 'PMX 登入失敗');
        }
      }
    } catch (error) {
      console.error('=== 登入過程發生錯誤 ===');
      console.error('錯誤詳情:', error);
      
      let errorMessage = '員工ID或密碼錯誤，請重新輸入';
      
      if (error.response) {
        console.error('HTTP 錯誤回應:', error.response.status, error.response.data);
        
        switch (error.response.status) {
          case 401:
            errorMessage = '員工ID或密碼錯誤，請重新輸入';
            break;
          case 408:
            errorMessage = '連線逾時，請檢查網路連線';
            break;
          case 502:
            errorMessage = '服務暫時無法使用，請稍後再試';
            break;
          case 503:
            errorMessage = '網路連線錯誤，請檢查網路設定';
            break;
          case 500:
            errorMessage = '伺服器暫時無法使用，請稍後再試';
            break;
          default:
            errorMessage = '登入失敗，請稍後再試';
        }
        
        if (error.response.data && error.response.data.Msg) {
          errorMessage = error.response.data.Msg;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = '連線逾時，請檢查網路連線';
      } else if (error.message.includes('Network Error')) {
        errorMessage = '網路連線錯誤，請檢查網路設定';
      }
      
      setError(errorMessage);
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('loginError', {
          message: errorMessage,
          code: 'LOGIN_FAILED',
          httpStatus: error.response?.status,
          originalError: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, saveLoginDataToCookies, isFlutterEnvironment, sendMessageToFlutter, rememberMe, language, setCookieWithExpiry]);

  // 🔥 修改自動登入函數 - 添加 Cookie 設置
  const handleAutoLogin = useCallback(async (employee_id) => {
    if (!employee_id) {
      setError(t('login.autoLoginFailed'));
      return;
    }

    try {
      setIsLoading(true);
      
      // 🔥 PMX 自動登入不需要統編，直接使用 PMX API
      const response = await axios.post(`${API_BASE_URL}/api/pmx/employee/auto-login`, {
        employee_id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Set-Session': 'true'
        },
        withCredentials: true
      });

      console.log("PMX 自動登入 API 回應:", response.data);

      if (response.data.Status === "Ok") {
        const loginData = response.data.Data || {};
        
        console.log('PMX 自動登入成功');
        
        // 🔥 設置完整的認證 cookies
        setCookieWithExpiry('company_id', loginData.company_id || '');
        setCookieWithExpiry('employee_id', employee_id);
        setCookieWithExpiry('user_name', loginData.name || '');
        setCookieWithExpiry('department', loginData.department || '');
        setCookieWithExpiry('position', loginData.position || '');
        setCookieWithExpiry('job_grade', loginData.job_grade || '');
        setCookieWithExpiry('company_name', loginData.company_name || '');
        
        // 🔥 最重要：設置認證 token
        if (loginData.xtbb) {
          setCookieWithExpiry('auth_xtbb', loginData.xtbb);
          console.log('✅ 已設置 auth_xtbb token');
        } else {
          const tempToken = `pmx_auto_${employee_id}_${Date.now()}`;
          setCookieWithExpiry('auth_xtbb', tempToken);
          console.log('⚠️ 未獲得 xtbb，設置臨時 token:', tempToken);
        }
        
        // 🔥 設置 PMX 登入狀態標記
        setCookieWithExpiry('pmx_logged_in', 'true');
        setCookieWithExpiry('login_timestamp', Date.now().toString());
        setCookieWithExpiry('login_method', 'AUTO_LOGIN');
        
        // 通知 Flutter 登入成功
        if (isFlutterEnvironment) {
          sendMessageToFlutter('loginSuccess', {
            employee_id: loginData.employee_id || employee_id,
            employee_name: loginData.name || '',
            userData: loginData,
            rememberMe: rememberMe,
            language: language
          });
        } else {
          // 在瀏覽器環境中，直接跳轉到首頁
          setTimeout(() => {
            window.location.href = '/frontpagepmx'; // 🔥 改為相對路徑
          }, 500);
        }
      } else {
        setError(response.data.Msg || t('login.autoLoginFailed'));
      }
    } catch (err) {
      console.error("PMX 自動登入失敗:", err);
      setError(`${t('login.autoLoginFailed')}: ${err.response?.data?.Msg || err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, isFlutterEnvironment, sendMessageToFlutter, rememberMe, language, t, setCookieWithExpiry]);

  // 處理語言切換
  const handleLanguageChange = (selectedLanguage) => {
    console.log('切換語言到:', selectedLanguage);
    changeLanguage(selectedLanguage);
    
    // 通知 Flutter 語言變更
    if (isFlutterEnvironment) {
      sendMessageToFlutter('languageChanged', { 
        language: selectedLanguage 
      });
    }
  };

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

  // 🔥 修改 handleLogin 函數，使用雙重登入，PMX 不需要統編
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    // 獲取當前表單的實際值
    const currentEmployeeId = employeeIdRef.current?.value || credentials.employee_id;
    const currentPassword = passwordRef.current?.value || credentials.password;
    
    console.log('開始 PMX 登入流程:', {
      employee_id: currentEmployeeId,
      hasPassword: !!currentPassword
    });
    
    // 🔥 PMX 只需要驗證員工ID和密碼
    if (!currentEmployeeId || !currentPassword) {
      setError('請輸入員工ID和密碼');
      return;
    }
    
    // 🔥 執行雙重登入（PMX 不需要統編）
    await handleDualLogin(currentEmployeeId, currentPassword);
  };

  // 🔥 修改：檢查已存在登入資料的邏輯，加入 SSO 檢查
  useEffect(() => {
    if (!isInitialized) return;
    
    let isMounted = true;
    
    const checkLoginAndRedirect = async () => {
      try {
        const existingLogin = await checkExistingLogin();
        
        console.log('🔥 檢查登入狀態結果:', existingLogin);
        
        if (isMounted && existingLogin) {
          // 🔥 如果檢測到 PMX SSO 登入成功，直接跳轉
          if (existingLogin.hasToken && existingLogin.loginType?.includes('PMX_SSO')) {
            console.log('🔥 檢測到 PMX SSO 登入成功，準備跳轉到首頁');
            
            // 通知 Flutter（如果在 Flutter 環境中）
            if (isFlutterEnvironment) {
              sendMessageToFlutter('autoLoginSuccess', {
                employee_id: existingLogin.employee_id,
                loginType: existingLogin.loginType,
                redirectTo: 'frontpagepmx'
              });
            } else {
              // 🔥 直接跳轉到首頁 - 改為相對路徑
              console.log('🔥 執行跳轉到首頁');
              window.location.href = '/frontpagepmx';
            }
            return;
          }
          
          // 🔥 如果只是記住我的資料，更新表單但不跳轉
          if (existingLogin.employee_id !== credentials.employee_id) {
            updateCredential('employee_id', existingLogin.employee_id);
            
            sendMessageToFlutter('existingLoginFound', {
              employee_id: existingLogin.employee_id,
              hasToken: existingLogin.hasToken,
              loginType: existingLogin.loginType,
              isIOS: isIOS,
              language: language
            });
          }
        }
      } catch (error) {
        console.error('檢查已存在登入資料時出錯:', error);
      }
    };
    
    // 🔥 延遲執行，確保 SSO 檢查完成
    const timeoutId = setTimeout(checkLoginAndRedirect, 200);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isInitialized, checkExistingLogin, updateCredential, sendMessageToFlutter, isFlutterEnvironment, isIOS, language, credentials.employee_id]);

  // 處理記住我的變更
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // 如果還在初始化中，顯示加載提示
  if (!isInitialized) {
    return (
      <div className="container">
        <div className="form-wrapper">
          <div className="loading">{t('login.initializing')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-wrapper">
        {/* 語言選擇器 */}
        <div className="language-selector">
          <button
            className={`language-btn ${language === 'zh-TW' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('zh-TW')}
            type="button"
          >
            中文
          </button>
          <button
            className={`language-btn ${language === 'vi-VN' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('vi-VN')}
            type="button"
          >
            Tiếng Việt
          </button>
        </div>
        
        {!passwordChange.showPasswordChange ? (
          <>
            <div className="title">{t('login.title')}</div>

            <form onSubmit={handleLogin} noValidate>
              {/* 🔥 PMX 不需要統編，移除統編輸入框 */}
              
              <input
                ref={employeeIdRef}
                type="text"
                placeholder={t('login.employeeIdPlaceholder')}
                className="input"
                defaultValue={credentials.employee_id}
                onChange={(e) => handleInputChange('employee_id', e.target.value)}
                disabled={isLoading}
                required
              />
              <input
                ref={passwordRef}
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                className="input"
                defaultValue={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                required
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
                  <span>{t('login.rememberMe')}</span>
                </label>
              </div>
              
              <div className="button-group">
                <button
                  type="button"
                  className="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  {t('login.forgotPassword')}
                </button>
                <button
                  type="submit"
                  className="button primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? t('login.loggingIn') : t('login.loginButton')}
                </button>
              </div>
            </form>

            {error && <div className="error">{error}</div>}
            {isLoading && <div className="loading">{t('login.processing')}</div>}
          </>
        ) : (
          <>
            <div className="title">{t('login.changePassword')}</div>
            <div className="congrats-text">
              {t('login.congratsMessage')}
            </div>
            <input
              type="password"
              placeholder={t('login.newPassword')}
              className="input"
              value={passwordChange.newPassword}
              onChange={e => updatePasswordField('newPassword', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder={t('login.confirmPassword')}
              className="input"
              value={passwordChange.confirmPassword}
              onChange={e => updatePasswordField('confirmPassword', e.target.value)}
              disabled={isLoading}
            />
            {error && <div className="error">{error}</div>}
            {isLoading && <div className="loading">{t('login.processing')}</div>}
            <button
              className="full-width-button"
              onClick={handlePasswordUpdate}
              disabled={isLoading}
            >
              {isLoading ? t('login.processing') : t('login.updatePasswordAndLogin')}
            </button>
            <button
              className="secondary-button"
              onClick={() => setShowPasswordChange(false)}
              disabled={isLoading}
            >
              {t('login.backToLogin')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ApploginPMX;
