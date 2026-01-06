// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './PMX_CSS/FrontPagePMX.css';
// // import Cookies from 'js-cookie';
// // import { useFlutterIntegration } from './Hook/hooks';
// // import { useLanguage } from './Hook/useLanguage';
// // import LanguageSwitch from './components/LanguageSwitch';

// // // 導入圖片
// // import checkInIcon from '../Google_sheet/HomePageImage/Check-in.png';
// // import replacementCardIcon from '../Google_sheet/HomePageImage/Replacement Card.png';
// // import workOvertimeIcon from '../Google_sheet/HomePageImage/work overtime.png';
// // import applyIcon from '../Google_sheet/HomePageImage/Apply.png';
// // import salaryIcon from '../Google_sheet/HomePageImage/salary.png';
// // import approvingIcon from '../Google_sheet/HomePageImage/Approving.png';
// // import schedulingIcon from '../Google_sheet/HomePageImage/Scheduling.png';
// // import announcementIcon from '../Google_sheet/HomePageImage/announcement.png';
// // import messageIcon from '../Google_sheet/HomePageImage/message.png';

// // function FrontPagePMX() {
// //   // 使用 useLanguage Hook
// //   const { currentLanguage, changeLanguage, t } = useLanguage();
  
// //   const [userName, setUserName] = useState('');
// //   const [department, setDepartment] = useState('');
// //   const [position, setPosition] = useState('');
// //   const [jobGrade, setJobGrade] = useState(''); 
// //   const [companyName, setCompanyName] = useState('台灣波力梅');
// //   const [employeeId, setEmployeeId] = useState('');
// //   const [authToken, setAuthToken] = useState('');
// //   const [loading, setLoading] = useState(true);
  
// //   // 🔥 新增：防止重複請求的控制變數
// //   const [dataLoaded, setDataLoaded] = useState(false);
// //   const isLoadingRef = useRef(false);
// //   const hasInitializedRef = useRef(false);
  
// //   const navigate = useNavigate();
  
// //   // 使用整合後的 Flutter 通訊 Hook，設定為首頁模式
// //   const { 
// //     isFlutterEnvironment, 
// //     sendMessageToFlutter, 
// //     registerFlutterJSFunctions, 
// //     unregisterFlutterJSFunctions,
// //     clearAllLoginCookies
// //   } = useFlutterIntegration('home');

// //   // 🔥 修改：處理語言切換 - 不觸發資料重新載入
// //   const handleLanguageChange = useCallback((langCode) => {
// //     console.log('首頁語言切換:', langCode);
    
// //     // 只在已初始化後才處理語言切換
// //     if (hasInitializedRef.current && isFlutterEnvironment) {
// //       sendMessageToFlutter('languageChanged', { 
// //         newLanguage: langCode,
// //         previousLanguage: currentLanguage
// //       });
// //     }
// //   }, [currentLanguage, isFlutterEnvironment, sendMessageToFlutter]);

// // // 🔥 修改：PMX 員工資料獲取函數 - 加入完整的防重複機制
// // const getPMXEmployeeInfo = useCallback(async (employee_id, auth_token) => {
// //   // 🔥 多重防護：防止重複請求
// //   if (isLoadingRef.current || !employee_id || dataLoaded) {
// //     console.log('跳過重複請求或資料已載入');
// //     return;
// //   }

// //   try {
// //     isLoadingRef.current = true;
// //     setLoading(true);
    
// //     console.log(`正在獲取PMX員工資訊: 員工ID=${employee_id}`);
    
// //     if (isFlutterEnvironment) {
// //       sendMessageToFlutter('fetchInfoStart', { 
// //         employee_id
// //       });
// //     }
    
// //     // 調用 PMX 專用 API
// //     const apiUrl = `https://rabbit.54ucl.com:3004/pmx/employee/${employee_id}`;
    
// //     const response = await fetch(apiUrl, {
// //       method: 'GET',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': auth_token ? `Bearer ${auth_token}` : undefined,
// //       },
// //       credentials: 'include'
// //     });

// //     const data = await response.json();
// //     console.log('PMX API 回應:', data);

// //     if (data.Status === "Ok" && data.Data) {
// //       const employeeData = Array.isArray(data.Data) ? data.Data[0] : data.Data;
      
// //       // 🔥 處理 department_position 分割
// //       const departmentPosition = employeeData.department_position || '';
// //       let departmentName = '';
// //       let positionName = '';
      
// //       if (departmentPosition.includes('/')) {
// //         const parts = departmentPosition.split('/');
// //         departmentName = parts[0].trim(); // 前面是部門
// //         positionName = parts[1].trim();   // 後面是職稱
// //       } else {
// //         // 如果沒有 '/' 分隔符，將整個字串當作部門
// //         departmentName = departmentPosition;
// //         positionName = departmentPosition;
// //       }
      
// //       console.log('解析部門職位:', {
// //         原始資料: departmentPosition,
// //         部門: departmentName,
// //         職稱: positionName
// //       });
      
// //       // 🔥 設置員工資訊 - 使用分割後的資料
// //       setUserName(employeeData.name || '');
// //       setDepartment(departmentName); // 🔥 使用分割後的部門名稱
// //       setPosition(positionName);     // 🔥 使用分割後的職稱
// //       setCompanyName('台灣波力梅');
// //       setJobGrade('employee');
// //       setDataLoaded(true); // 🔥 標記資料已載入
      
// //       // 🔥 新增：自動設置 company_id 到 cookies
// //       const PMX_COMPANY_ID = '12400620';
      
// //       try {
// //         // 設置 company_id cookie，過期時間為 120 小時
// //         Cookies.set('company_id', PMX_COMPANY_ID, { 
// //           expires: 120 / 24, // 120小時轉換為天數
// //           path: '/',
// //           secure: window.location.protocol === 'https:',
// //           sameSite: 'lax'
// //         });
        
// //         console.log(`✅ 已自動設置 company_id cookie: ${PMX_COMPANY_ID}`);
        
// //         // 通知 Flutter（如果需要）
// //         if (isFlutterEnvironment) {
// //           sendMessageToFlutter('companyIdSet', { 
// //             company_id: PMX_COMPANY_ID,
// //             message: 'PMX company_id 已自動設置'
// //           });
// //         }
// //       } catch (cookieError) {
// //         console.error('設置 company_id cookie 失敗:', cookieError);
// //       }
      
// //       console.log(`PMX 使用者 ${employeeData.name} 載入成功`);
// //       console.log('員工資料:', {
// //         name: employeeData.name,
// //         department_position: employeeData.department_position,
// //         解析後部門: departmentName,
// //         解析後職稱: positionName,
// //         employee_id: employeeData.employee_id,
// //         hire_date: employeeData.hire_date
// //       });
      
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('fetchInfoSuccess', { 
// //           userName: employeeData.name,
// //           department: departmentName,        // 🔥 使用分割後的部門
// //           position: positionName,           // 🔥 使用分割後的職稱
// //           jobGrade: 'employee',
// //           companyName: '台灣波力梅',
// //           companyId: PMX_COMPANY_ID,
// //           employeeData: employeeData
// //         });
// //       }
// //     } else {
// //       console.log('PMX API 回應中沒有有效的員工資料');
// //       setUserName(t('login.loginFailed'));
// //       setDepartment('');
// //       setPosition('');
// //       setJobGrade('');
      
// //       if (data.Msg && data.Msg.includes('未找到')) {
// //         console.log('員工資料不存在，可能需要重新登入');
        
// //         if (isFlutterEnvironment) {
// //           sendMessageToFlutter('fetchInfoError', { 
// //             message: '員工資料不存在',
// //             code: 'EMPLOYEE_NOT_FOUND',
// //             response: data
// //           });
// //         }
// //       }
// //     }
// //   } catch (err) {
// //     console.error('獲取PMX員工資訊錯誤:', err);
// //     setUserName(t('errors.networkError'));
// //     setDepartment('');
// //     setPosition('');
// //     setJobGrade('');
    
// //     if (isFlutterEnvironment) {
// //       sendMessageToFlutter('fetchInfoError', { 
// //         message: `獲取PMX員工資訊錯誤: ${err.message}`,
// //         code: 'API_ERROR',
// //         error: err.message
// //       });
// //     }
// //   } finally {
// //     setLoading(false);
// //     isLoadingRef.current = false;
// //   }
// // }, [isFlutterEnvironment, sendMessageToFlutter, t, dataLoaded]);

// // // 🔥 修改 FrontPagePMX.js 中的 checkPMXTokenValidity 函數
// // const checkPMXTokenValidity = useCallback(async () => {
// //   try {
// //     // 🔥 檢查 PMX SSO 專用 cookies
// //     const auth_token = Cookies.get('auth_xtbb') || Cookies.get('pmx_session_token') || Cookies.get('sso_access_token');
// //     const employee_id = Cookies.get('employee_id');
// //     const pmx_logged_in = Cookies.get('pmx_logged_in');
    
// //     console.log('🔥 FrontPagePMX 檢查登入狀態:', {
// //       employee_id,
// //       pmx_logged_in,
// //       has_auth_token: !!auth_token,
// //       auth_token_type: Cookies.get('auth_xtbb') ? 'auth_xtbb' : 
// //                        Cookies.get('pmx_session_token') ? 'pmx_session_token' : 
// //                        Cookies.get('sso_access_token') ? 'sso_access_token' : 'none'
// //     });
    
// //     // 🔥 PMX SSO 登入檢查條件
// //     if (!employee_id) {
// //       console.log('缺少員工ID，將導向登入頁面');
      
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('authError', { 
// //           message: t('errors.unauthorized'),
// //           code: 'MISSING_EMPLOYEE_ID'
// //         });
// //       }
      
// //       window.location.href = '/apploginpmx';
// //       return;
// //     }

// //     // 🔥 如果有 PMX SSO 登入標記，視為有效登入
// //     if (pmx_logged_in === 'true' && auth_token) {
// //       console.log('✅ PMX SSO Token 有效，繼續使用應用');
// //       return;
// //     }

// //     // 🔥 如果沒有 PMX SSO 標記但有 auth_token，嘗試驗證
// //     if (auth_token) {
// //       const response = await fetch(`https://rabbit.54ucl.com:3004/pmx/employee/${employee_id}`, {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${auth_token}`
// //         },
// //         credentials: 'include'
// //       });
      
// //       const result = await response.json();
      
// //       if (result.Status === "Ok") {
// //         console.log('✅ PMX Token 驗證成功，繼續使用應用');
// //         return;
// //       }
// //     }
    
// //     console.log('❌ PMX Token 無效或已失效，需要重新登入');
// //     clearAllLoginCookies();
    
// //     if (isFlutterEnvironment) {
// //       sendMessageToFlutter('authError', { 
// //         message: t('errors.tokenExpired'),
// //         code: 'PMX_TOKEN_EXPIRED'
// //       });
// //     }
    
// //     window.location.href = '/apploginpmx';
    
// //   } catch (err) {
// //     console.error('檢查 PMX token 有效性時出錯:', err);
// //     // 🔥 不要立即跳轉，給一次機會
// //     console.log('⚠️ Token 檢查出錯，但不立即跳轉，等待下次檢查');
// //   }
// // }, [isFlutterEnvironment, sendMessageToFlutter, clearAllLoginCookies, t]);


// //   // 🔥 修改：註冊 Flutter 函數 - 只執行一次
// //   useEffect(() => {
// //     registerFlutterJSFunctions();
    
// //     if (isFlutterEnvironment) {
// //       sendMessageToFlutter('pageLoaded', { page: 'homePage' });
// //     }
    
// //     return () => {
// //       unregisterFlutterJSFunctions();
// //     };
// //   }, []); // 🔥 空依賴陣列

// //   // 🔥 修改：語言變化處理 - 避免觸發 API 調用
// //   useEffect(() => {
// //     if (hasInitializedRef.current) {
// //       handleLanguageChange(currentLanguage);
// //     }
// //   }, [currentLanguage]); // 🔥 移除 handleLanguageChange 依賴

// //   // 🔥 修改：初始化和資料載入 - 只執行一次
// //   useEffect(() => {
// //     if (hasInitializedRef.current) {
// //       return; // 🔥 如果已經初始化過，直接返回
// //     }
    
// //     const initializeData = async () => {
// //       try {
// //         // 檢查 token 有效性
// //         await checkPMXTokenValidity();
        
// //         // 從 cookies 獲取資料
// //         const employee_id = Cookies.get('employee_id');
// //         const auth_token = Cookies.get('auth_xtbb');

// //         if (employee_id) {
// //           setEmployeeId(employee_id);
          
// //           if (auth_token) {
// //             setAuthToken(auth_token);
// //           } else {
// //             console.log('未找到認證 token，可能需要重新登入');
            
// //             if (isFlutterEnvironment) {
// //               sendMessageToFlutter('authError', { 
// //                 message: t('errors.tokenExpired'),
// //                 code: 'MISSING_AUTH_TOKEN'
// //               });
// //             }
// //           }
          
// //           // 🔥 調用 PMX 專用的員工資料獲取函數
// //           await getPMXEmployeeInfo(employee_id, auth_token);
          
// //         } else {
// //           console.log('未找到員工ID cookie，將導向登入頁面');
          
// //           if (isFlutterEnvironment) {
// //             sendMessageToFlutter('authError', { 
// //               message: t('errors.unauthorized'),
// //               code: 'MISSING_EMPLOYEE_ID_COOKIE'
// //             });
// //           }
          
// //           window.location.href = '/apploginpmx';
// //         }
        
// //         // 🔥 標記已初始化
// //         hasInitializedRef.current = true;
        
// //       } catch (error) {
// //         console.error('初始化過程中發生錯誤:', error);
// //         setLoading(false);
// //       }
// //     };
    
// //     initializeData();
// //   }, []); // 🔥 空依賴陣列，只執行一次

// // // 🔥 修改 FrontPagePMX.js 中的初始化 useEffect
// // useEffect(() => {
// //   if (hasInitializedRef.current) {
// //     return;
// //   }
  
// //   const initializeData = async () => {
// //     try {
// //       // 🔥 先檢查 PMX SSO cookies
// //       const employee_id = Cookies.get('employee_id');
// //       const pmx_logged_in = Cookies.get('pmx_logged_in');
// //       const auth_token = Cookies.get('auth_xtbb') || Cookies.get('pmx_session_token') || Cookies.get('sso_access_token');

// //       console.log('🔥 FrontPagePMX 初始化檢查:', {
// //         employee_id,
// //         pmx_logged_in,
// //         has_auth_token: !!auth_token
// //       });

// //       if (employee_id) {
// //         setEmployeeId(employee_id);
        
// //         if (auth_token) {
// //           setAuthToken(auth_token);
// //         }
        
// //         // 🔥 如果有 PMX SSO 登入標記，直接載入資料
// //         if (pmx_logged_in === 'true') {
// //           console.log('✅ 檢測到 PMX SSO 登入，直接載入員工資料');
// //           await getPMXEmployeeInfo(employee_id, auth_token);
// //         } else if (auth_token) {
// //           // 🔥 有 token 但沒有 PMX 標記，先檢查 token 有效性
// //           console.log('🔍 有 token 但無 PMX 標記，檢查 token 有效性');
// //           await checkPMXTokenValidity();
          
// //           // 如果沒有被重定向，載入員工資料
// //           if (window.location.pathname === '/frontpagepmx') {
// //             await getPMXEmployeeInfo(employee_id, auth_token);
// //           }
// //         } else {
// //           console.log('❌ 缺少認證 token，需要重新登入');
// //           window.location.href = '/apploginpmx';
// //           return;
// //         }
// //       } else {
// //         console.log('❌ 未找到員工ID cookie，將導向登入頁面');
        
// //         if (isFlutterEnvironment) {
// //           sendMessageToFlutter('authError', { 
// //             message: t('errors.unauthorized'),
// //             code: 'MISSING_EMPLOYEE_ID_COOKIE'
// //           });
// //         }
        
// //         window.location.href = '/apploginpmx';
// //         return;
// //       }
      
// //       hasInitializedRef.current = true;
      
// //     } catch (error) {
// //       console.error('初始化過程中發生錯誤:', error);
// //       setLoading(false);
// //     }
// //   };
  
// //   initializeData();
// // }, []);

// //   // 功能按鈕數據
// //   const functionButtons = [
// //     { 
// //       id: 'punch', 
// //       icon: 'clipboard', 
// //       text: t('home.functions.punch'), 
// //       route: '/checkinpmx', 
// //       notifications: 0 
// //     },
// //     { 
// //       id: 'makeup', 
// //       icon: 'clock', 
// //       text: t('home.functions.makeup'), 
// //       route: '/replenishpmx', 
// //       notifications: 0 
// //     },
// //     { 
// //       id: 'overtime', 
// //       icon: 'time-add', 
// //       text: t('home.functions.overtime'), 
// //       route: '/workovertimepmx', 
// //       notifications: 0 
// //     },
// //     { 
// //       id: 'leave', 
// //       icon: 'calendar-check', 
// //       text: t('home.functions.leave'), 
// //       route: '/leavepmx', 
// //       notifications: 0 
// //     },
// //     { 
// //       id: 'salary', 
// //       icon: 'money', 
// //       text: t('home.functions.salary'), 
// //       route: '/salary01', 
// //       notifications: 0,
// //       disabled: true
// //     },
// //     { 
// //       id: 'approval', 
// //       icon: 'file-check', 
// //       text: t('home.functions.approval'), 
// //       route: '/auditsystem01', 
// //       notifications: 0, 
// //       requiredRoles: ['leader', 'hr']
// //     },
// //     { 
// //       id: 'schedule', 
// //       icon: 'calendar', 
// //       text: t('home.functions.schedule'), 
// //       route: '/schedule01', 
// //       notifications: 0,
// //       disabled: true
// //     },
// //     { 
// //       id: 'announcement', 
// //       icon: 'megaphone', 
// //       text: t('home.functions.announcement'), 
// //       route: '/announcement01', 
// //       notifications: 0,
// //       disabled: true
// //     },
// //     { 
// //       id: 'message', 
// //       icon: 'message', 
// //       text: t('home.functions.message'), 
// //       route: '/message', 
// //       notifications: 0,
// //       disabled: true
// //     },
// //   ];

// //   // 渲染功能圖標
// //   const renderIcon = (iconName) => {
// //     const altTexts = {
// //       'clipboard': t('home.functions.punch'),
// //       'clock': t('home.functions.makeup'),
// //       'time-add': t('home.functions.overtime'),
// //       'calendar-check': t('home.functions.leave'),
// //       'money': t('home.functions.salary'),
// //       'file-check': t('home.functions.approval'),
// //       'calendar': t('home.functions.schedule'),
// //       'megaphone': t('home.functions.announcement'),
// //       'message': t('home.functions.message')
// //     };

// //     switch (iconName) {
// //       case 'clipboard':
// //         return <img src={checkInIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'clock':
// //         return <img src={replacementCardIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'time-add':
// //         return <img src={workOvertimeIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'calendar-check':
// //         return <img src={applyIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'money':
// //         return <img src={salaryIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'file-check':
// //         return <img src={approvingIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'calendar':
// //         return <img src={schedulingIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'megaphone':
// //         return <img src={announcementIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       case 'message':
// //         return <img src={messageIcon} alt={altTexts[iconName]} className="front-icon-image" />;
// //       default:
// //         return null;
// //     }
// //   };

// //   // 處理功能按鈕點擊
// //   const handleButtonClick = (route, requiredRoles, buttonId, disabled) => {
// //     console.log(`嘗試導航到: ${route}`);
    
// //     if (disabled) {
// //       alert(t('home.functionDisabled') || '此功能目前暫時停用');
// //       console.log(`功能 ${buttonId} 已被禁用`);
      
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('functionDisabled', { 
// //           route,
// //           buttonId,
// //           message: '此功能目前暫時停用'
// //         });
// //       }
// //       return;
// //     }
    
// //     if (requiredRoles && requiredRoles.length > 0) {
// //       if (!requiredRoles.includes(jobGrade)) {
// //         alert(t('home.noPermission'));
// //         console.log('用戶無權限訪問此功能');
        
// //         if (isFlutterEnvironment) {
// //           sendMessageToFlutter('permissionDenied', { 
// //             route,
// //             buttonId,
// //             requiredRoles,
// //             currentRole: jobGrade
// //           });
// //         }
// //         return;
// //       }
// //     }
    
// //     if (!authToken) {
// //       console.log('警告: 導航時缺少認證 token，可能會影響目標頁面的功能');
      
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('navigationWarning', { 
// //           message: '缺少認證 token，可能會影響目標頁面的功能',
// //           code: 'MISSING_AUTH_TOKEN',
// //           route,
// //           buttonId
// //         });
// //       }
// //     }
    
// //     console.log(`導航到: ${route}`);
    
// //     if (isFlutterEnvironment) {
// //       if (buttonId === 'punch') {
// //         sendMessageToFlutter('navigate', { 
// //           route,
// //           buttonId,
// //           hasToken: !!authToken,
// //           replace: true
// //         });
// //       } else {
// //         sendMessageToFlutter('navigate', { 
// //           route,
// //           buttonId,
// //           hasToken: !!authToken
// //         });
// //       }
// //     }
    
// //     if (buttonId === 'punch') {
// //       console.log('使用 replace 導航到打卡頁面，防止返回');
// //       window.location.replace(route);
// //     } else {
// //       window.location.href = route;
// //     }
// //   };

// //   // 處理個人資料卡點擊
// //   const handleProfileCardClick = () => {
// //     console.log('導航到個人資料頁面');
    
// //     if (!authToken) {
// //       console.log('警告: 導航到個人資料頁面時缺少認證 token，可能會影響頁面功能');
      
// //       if (isFlutterEnvironment) {
// //         sendMessageToFlutter('navigationWarning', { 
// //           message: '缺少認證 token，可能會影響個人資料頁面的功能',
// //           code: 'MISSING_AUTH_TOKEN',
// //           route: '/personaldatapmx',
// //           buttonId: 'profile'
// //         });
// //       }
// //     }
    
// //     if (isFlutterEnvironment) {
// //       sendMessageToFlutter('navigate', { 
// //         route: '/personaldatapmx',
// //         buttonId: 'profile',
// //         hasToken: !!authToken
// //       });
// //     }
    
// //     window.location.href = '/personaldatapmx';
// //   };

// //   // 🔥 如果正在載入，顯示載入畫面
// //   if (loading) {
// //     return (
// //       <div className="front-container">
// //         <div className="front-app-wrapper">
// //           <div className="front-loading">
// //             <div className="front-loading-spinner"></div>
// //             <div className="front-loading-text">載入中...</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="front-container">
// //       <div className="front-app-wrapper">
// //         <LanguageSwitch 
// //           position="absolute"
// //           containerClassName="front-page-language-switch"
// //         />
        
// //         <header className="front-header">
// //           <div className="front-page-title">{t('home.title')}</div>
// //         </header>

// //         <div className="front-content">
// //           <div 
// //             className="front-profile-card" 
// //             onClick={handleProfileCardClick}
// //           >
// //             <div className="front-company-name">
// //               {companyName || t('home.noCompany')}
// //             </div>
// //             <div className="front-department-info">
// //               {department || t('home.noDepartment')}<br />
// //               {position || t('home.noPosition')}
// //             </div>
// //             <div className="front-user-info-row">
// //               <div className="front-user-name">
// //                 {userName || t('home.notLoggedIn')}
// //               </div>
// //               <div className="front-user-number">
// //                 {employeeId || t('home.noEmployeeId')}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="front-placeholder-image">
// //             <div className="front-cross-line">
// //               <div className="front-line1"></div>
// //               <div className="front-line2"></div>
// //             </div>
// //           </div>

// //           <div className="front-functions-grid">
// //             {functionButtons.map((button) => (
// //               <div 
// //                 key={button.id} 
// //                 className={`front-function-button ${button.disabled ? 'disabled' : ''}`}
// //                 onClick={() => handleButtonClick(button.route, button.requiredRoles, button.id, button.disabled)}
// //               >
// //                 <div className="front-function-icon">
// //                   {renderIcon(button.icon)}
// //                   {button.notifications > 0 && (
// //                     <div className="front-notification-badge">{button.notifications}</div>
// //                   )}
// //                 </div>
// //                 <div className="front-function-text">{button.text}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default FrontPagePMX;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './PMX_CSS/FrontPagePMX.css';
// import Cookies from 'js-cookie';
// import { useFlutterIntegration } from './Hook/hooks';
// import { useLanguage } from './Hook/useLanguage';
// import LanguageSwitch from './components/LanguageSwitch';

// // 導入圖片
// import checkInIcon from '../Google_sheet/HomePageImage/Check-in.png';
// import replacementCardIcon from '../Google_sheet/HomePageImage/Replacement Card.png';
// import workOvertimeIcon from '../Google_sheet/HomePageImage/work overtime.png';
// import applyIcon from '../Google_sheet/HomePageImage/Apply.png';
// import salaryIcon from '../Google_sheet/HomePageImage/salary.png';
// import approvingIcon from '../Google_sheet/HomePageImage/Approving.png';
// import schedulingIcon from '../Google_sheet/HomePageImage/Scheduling.png';
// import announcementIcon from '../Google_sheet/HomePageImage/announcement.png';
// import messageIcon from '../Google_sheet/HomePageImage/message.png';

// // 🔥 添加前端 Token 生成函數
// const generateFrontendAuthToken = (employeeId) => {
//   const timestamp = Date.now();
//   const randomStr = Math.random().toString(36).substring(2, 15);
//   const sessionId = Math.random().toString(36).substring(2, 10);
  
//   // 創建一個唯一的 token
//   const tokenData = `${employeeId}_${timestamp}_${randomStr}_${sessionId}`;
//   const token = btoa(tokenData).replace(/[+/=]/g, '').substring(0, 64);
  
//   return `pmx_fe_${token}`;
// };

// function FrontPagePMX() {
//   // 使用 useLanguage Hook
//   const { currentLanguage, changeLanguage, t } = useLanguage();
  
//   const [userName, setUserName] = useState('');
//   const [department, setDepartment] = useState('');
//   const [position, setPosition] = useState('');
//   const [jobGrade, setJobGrade] = useState(''); 
//   const [companyName, setCompanyName] = useState('台灣波力梅');
//   const [employeeId, setEmployeeId] = useState('');
//   const [authToken, setAuthToken] = useState('');
//   const [loading, setLoading] = useState(true);
  
//   // 🔥 新增：防止重複請求的控制變數
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const isLoadingRef = useRef(false);
//   const hasInitializedRef = useRef(false);
  
//   const navigate = useNavigate();
  
//   // 使用整合後的 Flutter 通訊 Hook，設定為首頁模式
//   const { 
//     isFlutterEnvironment, 
//     sendMessageToFlutter, 
//     registerFlutterJSFunctions, 
//     unregisterFlutterJSFunctions,
//     clearAllLoginCookies
//   } = useFlutterIntegration('home');

//   // 🔥 修改：處理語言切換 - 不觸發資料重新載入
//   const handleLanguageChange = useCallback((langCode) => {
//     console.log('首頁語言切換:', langCode);
    
//     // 只在已初始化後才處理語言切換
//     if (hasInitializedRef.current && isFlutterEnvironment) {
//       sendMessageToFlutter('languageChanged', { 
//         newLanguage: langCode,
//         previousLanguage: currentLanguage
//       });
//     }
//   }, [currentLanguage, isFlutterEnvironment, sendMessageToFlutter]);

//   // 🔥 修改：PMX 員工資料獲取函數 - 加入完整的防重複機制
//   const getPMXEmployeeInfo = useCallback(async (employee_id, auth_token) => {
//     // 🔥 多重防護：防止重複請求
//     if (isLoadingRef.current || !employee_id || dataLoaded) {
//       console.log('跳過重複請求或資料已載入');
//       return;
//     }

//     try {
//       isLoadingRef.current = true;
//       setLoading(true);
      
//       console.log(`正在獲取PMX員工資訊: 員工ID=${employee_id}`);
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('fetchInfoStart', { 
//           employee_id
//         });
//       }
      
//       // 調用 PMX 專用 API
//       const apiUrl = `https://rabbit.54ucl.com:3004/pmx/employee/${employee_id}`;
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': auth_token ? `Bearer ${auth_token}` : undefined,
//         },
//         credentials: 'include'
//       });

//       const data = await response.json();
//       console.log('PMX API 回應:', data);

//       if (data.Status === "Ok" && data.Data) {
//         const employeeData = Array.isArray(data.Data) ? data.Data[0] : data.Data;
        
//         // 🔥 處理 department_position 分割
//         const departmentPosition = employeeData.department_position || '';
//         let departmentName = '';
//         let positionName = '';
        
//         if (departmentPosition.includes('/')) {
//           const parts = departmentPosition.split('/');
//           departmentName = parts[0].trim(); // 前面是部門
//           positionName = parts[1].trim();   // 後面是職稱
//         } else {
//           // 如果沒有 '/' 分隔符，將整個字串當作部門
//           departmentName = departmentPosition;
//           positionName = departmentPosition;
//         }
        
//         console.log('解析部門職位:', {
//           原始資料: departmentPosition,
//           部門: departmentName,
//           職稱: positionName
//         });
        
//         // 🔥 設置員工資訊 - 使用分割後的資料
//         setUserName(employeeData.name || '');
//         setDepartment(departmentName); // 🔥 使用分割後的部門名稱
//         setPosition(positionName);     // 🔥 使用分割後的職稱
//         setCompanyName('台灣波力梅');
//         setJobGrade('employee');
//         setDataLoaded(true); // 🔥 標記資料已載入
        
//         // 🔥 新增：自動設置 company_id 到 cookies
//         const PMX_COMPANY_ID = '12400620';
        
//         try {
//           // 設置 company_id cookie，過期時間為 120 小時
//           Cookies.set('company_id', PMX_COMPANY_ID, { 
//             expires: 120 / 24, // 120小時轉換為天數
//             path: '/',
//             secure: window.location.protocol === 'https:',
//             sameSite: 'lax'
//           });
          
//           console.log(`✅ 已自動設置 company_id cookie: ${PMX_COMPANY_ID}`);
          
//           // 通知 Flutter（如果需要）
//           if (isFlutterEnvironment) {
//             sendMessageToFlutter('companyIdSet', { 
//               company_id: PMX_COMPANY_ID,
//               message: 'PMX company_id 已自動設置'
//             });
//           }
//         } catch (cookieError) {
//           console.error('設置 company_id cookie 失敗:', cookieError);
//         }
        
//         console.log(`PMX 使用者 ${employeeData.name} 載入成功`);
//         console.log('員工資料:', {
//           name: employeeData.name,
//           department_position: employeeData.department_position,
//           解析後部門: departmentName,
//           解析後職稱: positionName,
//           employee_id: employeeData.employee_id,
//           hire_date: employeeData.hire_date
//         });
        
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('fetchInfoSuccess', { 
//             userName: employeeData.name,
//             department: departmentName,        // 🔥 使用分割後的部門
//             position: positionName,           // 🔥 使用分割後的職稱
//             jobGrade: 'employee',
//             companyName: '台灣波力梅',
//             companyId: PMX_COMPANY_ID,
//             employeeData: employeeData
//           });
//         }
//       } else {
//         console.log('PMX API 回應中沒有有效的員工資料');
//         setUserName(t('login.loginFailed'));
//         setDepartment('');
//         setPosition('');
//         setJobGrade('');
        
//         if (data.Msg && data.Msg.includes('未找到')) {
//           console.log('員工資料不存在，可能需要重新登入');
          
//           if (isFlutterEnvironment) {
//             sendMessageToFlutter('fetchInfoError', { 
//               message: '員工資料不存在',
//               code: 'EMPLOYEE_NOT_FOUND',
//               response: data
//             });
//           }
//         }
//       }
//     } catch (err) {
//       console.error('獲取PMX員工資訊錯誤:', err);
//       setUserName(t('errors.networkError'));
//       setDepartment('');
//       setPosition('');
//       setJobGrade('');
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('fetchInfoError', { 
//           message: `獲取PMX員工資訊錯誤: ${err.message}`,
//           code: 'API_ERROR',
//           error: err.message
//         });
//       }
//     } finally {
//       setLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, [isFlutterEnvironment, sendMessageToFlutter, t, dataLoaded]);

//   // 🔥 修改 checkPMXTokenValidity 函數 - 添加自動生成 auth_xtbb
//   const checkPMXTokenValidity = useCallback(async () => {
//     try {
//       // 🔥 檢查 PMX SSO 專用 cookies
//       let auth_token = Cookies.get('auth_xtbb') || Cookies.get('pmx_session_token') || Cookies.get('sso_access_token');
//       const employee_id = Cookies.get('employee_id');
//       const pmx_logged_in = Cookies.get('pmx_logged_in');
      
//       console.log('🔥 FrontPagePMX 檢查登入狀態:', {
//         employee_id,
//         pmx_logged_in,
//         has_auth_token: !!auth_token,
//         auth_token_type: Cookies.get('auth_xtbb') ? 'auth_xtbb' : 
//                          Cookies.get('pmx_session_token') ? 'pmx_session_token' : 
//                          Cookies.get('sso_access_token') ? 'sso_access_token' : 'none'
//       });
      
//       // 🔥 PMX SSO 登入檢查條件
//       if (!employee_id) {
//         console.log('缺少員工ID，將導向登入頁面');
        
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('authError', { 
//             message: t('errors.unauthorized'),
//             code: 'MISSING_EMPLOYEE_ID'
//           });
//         }
        
//         window.location.href = '/apploginpmx';
//         return;
//       }

//       // 🔥 如果沒有 auth_xtbb 但有其他登入標記，自動生成一個
//       if (!Cookies.get('auth_xtbb') && (pmx_logged_in === 'true' || auth_token)) {
//         console.log('🔥 沒有 auth_xtbb，但有其他登入標記，自動生成 auth_xtbb');
        
//         const newAuthToken = generateFrontendAuthToken(employee_id);
        
//         // 設置新的 auth_xtbb cookie
//         Cookies.set('auth_xtbb', newAuthToken, { 
//           expires: 120 / 24, // 120小時轉換為天數
//           path: '/',
//           secure: window.location.protocol === 'https:',
//           sameSite: 'lax'
//         });
        
//         auth_token = newAuthToken;
//         setAuthToken(newAuthToken);
        
//         console.log('✅ 已自動生成並設置 auth_xtbb token');
        
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('authTokenGenerated', { 
//             message: '已自動生成認證 token',
//             employee_id: employee_id
//           });
//         }
//       }

//       // 🔥 如果有 PMX SSO 登入標記，視為有效登入
//       if (pmx_logged_in === 'true' && auth_token) {
//         console.log('✅ PMX SSO Token 有效，繼續使用應用');
//         return;
//       }

//       // 🔥 如果沒有 PMX SSO 標記但有 auth_token，嘗試驗證
//       if (auth_token) {
//         try {
//           const response = await fetch(`https://rabbit.54ucl.com:3004/pmx/employee/${employee_id}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${auth_token}`
//             },
//             credentials: 'include'
//           });
          
//           const result = await response.json();
          
//           if (result.Status === "Ok") {
//             console.log('✅ PMX Token 驗證成功，繼續使用應用');
            
//             // 🔥 如果驗證成功但沒有 PMX 登入標記，設置它
//             if (pmx_logged_in !== 'true') {
//               Cookies.set('pmx_logged_in', 'true', { 
//                 expires: 120 / 24,
//                 path: '/',
//                 secure: window.location.protocol === 'https:',
//                 sameSite: 'lax'
//               });
//               console.log('✅ 已設置 pmx_logged_in 標記');
//             }
            
//             return;
//           }
//         } catch (apiError) {
//           console.error('API 驗證失敗:', apiError);
//           // 不要立即跳轉，繼續下面的邏輯
//         }
//       }
      
//       console.log('❌ PMX Token 無效或已失效，需要重新登入');
//       clearAllLoginCookies();
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('authError', { 
//           message: t('errors.tokenExpired'),
//           code: 'PMX_TOKEN_EXPIRED'
//         });
//       }
      
//       window.location.href = '/apploginpmx';
      
//     } catch (err) {
//       console.error('檢查 PMX token 有效性時出錯:', err);
//       // 🔥 不要立即跳轉，給一次機會
//       console.log('⚠️ Token 檢查出錯，但不立即跳轉，等待下次檢查');
//     }
//   }, [isFlutterEnvironment, sendMessageToFlutter, clearAllLoginCookies, t]);

//   // 🔥 修改：註冊 Flutter 函數 - 只執行一次
//   useEffect(() => {
//     registerFlutterJSFunctions();
    
//     if (isFlutterEnvironment) {
//       sendMessageToFlutter('pageLoaded', { page: 'homePage' });
//     }
    
//     return () => {
//       unregisterFlutterJSFunctions();
//     };
//   }, []); // 🔥 空依賴陣列

//   // 🔥 修改：語言變化處理 - 避免觸發 API 調用
//   useEffect(() => {
//     if (hasInitializedRef.current) {
//       handleLanguageChange(currentLanguage);
//     }
//   }, [currentLanguage]); // 🔥 移除 handleLanguageChange 依賴

//   // 🔥 修改：初始化和資料載入 - 整合所有邏輯到一個 useEffect
//   useEffect(() => {
//     if (hasInitializedRef.current) {
//       return; // 🔥 如果已經初始化過，直接返回
//     }
    
//     const initializeData = async () => {
//       try {
//         // 🔥 先檢查 PMX SSO cookies
//         const employee_id = Cookies.get('employee_id');
//         const pmx_logged_in = Cookies.get('pmx_logged_in');
//         let auth_token = Cookies.get('auth_xtbb') || Cookies.get('pmx_session_token') || Cookies.get('sso_access_token');

//         console.log('🔥 FrontPagePMX 初始化檢查:', {
//           employee_id,
//           pmx_logged_in,
//           has_auth_token: !!auth_token
//         });

//         if (employee_id) {
//           setEmployeeId(employee_id);
          
//           // 🔥 如果沒有 auth_xtbb 但有其他登入標記，自動生成一個
//           if (!Cookies.get('auth_xtbb') && (pmx_logged_in === 'true' || auth_token)) {
//             console.log('🔥 初始化時自動生成 auth_xtbb token');
            
//             const newAuthToken = generateFrontendAuthToken(employee_id);
            
//             // 設置新的 auth_xtbb cookie
//             Cookies.set('auth_xtbb', newAuthToken, { 
//               expires: 120 / 24,
//               path: '/',
//               secure: window.location.protocol === 'https:',
//               sameSite: 'lax'
//             });
            
//             auth_token = newAuthToken;
//             setAuthToken(newAuthToken);
            
//             console.log('✅ 初始化時已自動生成並設置 auth_xtbb token');
            
//             if (isFlutterEnvironment) {
//               sendMessageToFlutter('authTokenGenerated', { 
//                 message: '初始化時已自動生成認證 token',
//                 employee_id: employee_id
//               });
//             }
//           } else if (auth_token) {
//             setAuthToken(auth_token);
//           }
          
//           // 🔥 如果有 PMX SSO 登入標記，直接載入資料
//           if (pmx_logged_in === 'true') {
//             console.log('✅ 檢測到 PMX SSO 登入，直接載入員工資料');
//             await getPMXEmployeeInfo(employee_id, auth_token);
//           } else if (auth_token) {
//             // 🔥 有 token 但沒有 PMX 標記，先檢查 token 有效性
//             console.log('🔍 有 token 但無 PMX 標記，檢查 token 有效性');
//             await checkPMXTokenValidity();
            
//             // 如果沒有被重定向，載入員工資料
//             if (window.location.pathname === '/frontpagepmx') {
//               await getPMXEmployeeInfo(employee_id, auth_token);
//             }
//           } else {
//             console.log('❌ 缺少認證 token，需要重新登入');
//             window.location.href = '/apploginpmx';
//             return;
//           }
//         } else {
//           console.log('❌ 未找到員工ID cookie，將導向登入頁面');
          
//           if (isFlutterEnvironment) {
//             sendMessageToFlutter('authError', { 
//               message: t('errors.unauthorized'),
//               code: 'MISSING_EMPLOYEE_ID_COOKIE'
//             });
//           }
          
//           window.location.href = '/apploginpmx';
//           return;
//         }
        
//         hasInitializedRef.current = true;
        
//       } catch (error) {
//         console.error('初始化過程中發生錯誤:', error);
//         setLoading(false);
//       }
//     };
    
//     initializeData();
//   }, []); // 🔥 空依賴陣列，只執行一次

//   // 功能按鈕數據
//   const functionButtons = [
//     { 
//       id: 'punch', 
//       icon: 'clipboard', 
//       text: t('home.functions.punch'), 
//       route: '/checkinpmx', 
//       notifications: 0 
//     },
//     { 
//       id: 'makeup', 
//       icon: 'clock', 
//       text: t('home.functions.makeup'), 
//       route: '/replenishpmx', 
//       notifications: 0 
//     },
//     { 
//       id: 'overtime', 
//       icon: 'time-add', 
//       text: t('home.functions.overtime'), 
//       route: '/workovertimepmx', 
//       notifications: 0 
//     },
//     { 
//       id: 'leave', 
//       icon: 'calendar-check', 
//       text: t('home.functions.leave'), 
//       route: '/leavepmx', 
//       notifications: 0 
//     },
//     { 
//       id: 'salary', 
//       icon: 'money', 
//       text: t('home.functions.salary'), 
//       route: '/salary01', 
//       notifications: 0,
//       disabled: true
//     },
//     { 
//       id: 'approval', 
//       icon: 'file-check', 
//       text: t('home.functions.approval'), 
//       route: '/auditsystem01', 
//       notifications: 0, 
//       requiredRoles: ['leader', 'hr']
//     },
//     { 
//       id: 'schedule', 
//       icon: 'calendar', 
//       text: t('home.functions.schedule'), 
//       route: '/schedule01', 
//       notifications: 0,
//       disabled: true
//     },
//     { 
//       id: 'announcement', 
//       icon: 'megaphone', 
//       text: t('home.functions.announcement'), 
//       route: '/announcement01', 
//       notifications: 0,
//       disabled: true
//     },
//     { 
//       id: 'message', 
//       icon: 'message', 
//       text: t('home.functions.message'), 
//       route: '/message', 
//       notifications: 0,
//       disabled: true
//     },
//   ];

//   // 渲染功能圖標
//   const renderIcon = (iconName) => {
//     const altTexts = {
//       'clipboard': t('home.functions.punch'),
//       'clock': t('home.functions.makeup'),
//       'time-add': t('home.functions.overtime'),
//       'calendar-check': t('home.functions.leave'),
//       'money': t('home.functions.salary'),
//       'file-check': t('home.functions.approval'),
//       'calendar': t('home.functions.schedule'),
//       'megaphone': t('home.functions.announcement'),
//       'message': t('home.functions.message')
//     };

//     switch (iconName) {
//       case 'clipboard':
//         return <img src={checkInIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'clock':
//         return <img src={replacementCardIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'time-add':
//         return <img src={workOvertimeIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'calendar-check':
//         return <img src={applyIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'money':
//         return <img src={salaryIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'file-check':
//         return <img src={approvingIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'calendar':
//         return <img src={schedulingIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'megaphone':
//         return <img src={announcementIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       case 'message':
//         return <img src={messageIcon} alt={altTexts[iconName]} className="front-icon-image" />;
//       default:
//         return null;
//     }
//   };

//   // 處理功能按鈕點擊
//   const handleButtonClick = (route, requiredRoles, buttonId, disabled) => {
//     console.log(`嘗試導航到: ${route}`);
    
//     if (disabled) {
//       alert(t('home.functionDisabled') || '此功能目前暫時停用');
//       console.log(`功能 ${buttonId} 已被禁用`);
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('functionDisabled', { 
//           route,
//           buttonId,
//           message: '此功能目前暫時停用'
//         });
//       }
//       return;
//     }
    
//     if (requiredRoles && requiredRoles.length > 0) {
//       if (!requiredRoles.includes(jobGrade)) {
//         alert(t('home.noPermission'));
//         console.log('用戶無權限訪問此功能');
        
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('permissionDenied', { 
//             route,
//             buttonId,
//             requiredRoles,
//             currentRole: jobGrade
//           });
//         }
//         return;
//       }
//     }
    
//     if (!authToken) {
//       console.log('警告: 導航時缺少認證 token，可能會影響目標頁面的功能');
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('navigationWarning', { 
//           message: '缺少認證 token，可能會影響目標頁面的功能',
//           code: 'MISSING_AUTH_TOKEN',
//           route,
//           buttonId
//         });
//       }
//     }
    
//     console.log(`導航到: ${route}`);
    
//     if (isFlutterEnvironment) {
//       if (buttonId === 'punch') {
//         sendMessageToFlutter('navigate', { 
//           route,
//           buttonId,
//           hasToken: !!authToken,
//           replace: true
//         });
//       } else {
//         sendMessageToFlutter('navigate', { 
//           route,
//           buttonId,
//           hasToken: !!authToken
//         });
//       }
//     }
    
//     if (buttonId === 'punch') {
//       console.log('使用 replace 導航到打卡頁面，防止返回');
//       window.location.replace(route);
//     } else {
//       window.location.href = route;
//     }
//   };

//   // 處理個人資料卡點擊
//   const handleProfileCardClick = () => {
//     console.log('導航到個人資料頁面');
    
//     if (!authToken) {
//       console.log('警告: 導航到個人資料頁面時缺少認證 token，可能會影響頁面功能');
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('navigationWarning', { 
//           message: '缺少認證 token，可能會影響個人資料頁面的功能',
//           code: 'MISSING_AUTH_TOKEN',
//           route: '/personaldatapmx',
//           buttonId: 'profile'
//         });
//       }
//     }
    
//     if (isFlutterEnvironment) {
//       sendMessageToFlutter('navigate', { 
//         route: '/personaldatapmx',
//         buttonId: 'profile',
//         hasToken: !!authToken
//       });
//     }
    
//     window.location.href = '/personaldatapmx';
//   };

//   // 🔥 如果正在載入，顯示載入畫面
//   if (loading) {
//     return (
//       <div className="front-container">
//         <div className="front-app-wrapper">
//           <div className="front-loading">
//             <div className="front-loading-spinner"></div>
//             <div className="front-loading-text">載入中...</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="front-container">
//       <div className="front-app-wrapper">
//         <LanguageSwitch 
//           position="absolute"
//           containerClassName="front-page-language-switch"
//         />
        
//         <header className="front-header">
//           <div className="front-page-title">{t('home.title')}</div>
//         </header>

//         <div className="front-content">
//           <div 
//             className="front-profile-card" 
//             onClick={handleProfileCardClick}
//           >
//             <div className="front-company-name">
//               {companyName || t('home.noCompany')}
//             </div>
//             <div className="front-department-info">
//               {department || t('home.noDepartment')}<br />
//               {position || t('home.noPosition')}
//             </div>
//             <div className="front-user-info-row">
//               <div className="front-user-name">
//                 {userName || t('home.notLoggedIn')}
//               </div>
//               <div className="front-user-number">
//                 {employeeId || t('home.noEmployeeId')}
//               </div>
//             </div>
//           </div>

//           <div className="front-placeholder-image">
//             <div className="front-cross-line">
//               <div className="front-line1"></div>
//               <div className="front-line2"></div>
//             </div>
//           </div>

//           <div className="front-functions-grid">
//             {functionButtons.map((button) => (
//               <div 
//                 key={button.id} 
//                 className={`front-function-button ${button.disabled ? 'disabled' : ''}`}
//                 onClick={() => handleButtonClick(button.route, button.requiredRoles, button.id, button.disabled)}
//               >
//                 <div className="front-function-icon">
//                   {renderIcon(button.icon)}
//                   {button.notifications > 0 && (
//                     <div className="front-notification-badge">{button.notifications}</div>
//                   )}
//                 </div>
//                 <div className="front-function-text">{button.text}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FrontPagePMX;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PMX_CSS/FrontPagePMX.css';
import Cookies from 'js-cookie';
import { useFlutterIntegration } from './Hook/hooks';
import { useLanguage } from './Hook/useLanguage';
import LanguageSwitch from './components/LanguageSwitch';
import { API_BASE_URL } from '../config';

// 導入圖片
import checkInIcon from '../Google_sheet/HomePageImage/Check-in.png';
import replacementCardIcon from '../Google_sheet/HomePageImage/Replacement Card.png';
import workOvertimeIcon from '../Google_sheet/HomePageImage/work overtime.png';
import applyIcon from '../Google_sheet/HomePageImage/Apply.png';
import salaryIcon from '../Google_sheet/HomePageImage/salary.png';
import approvingIcon from '../Google_sheet/HomePageImage/Approving.png';
import schedulingIcon from '../Google_sheet/HomePageImage/Scheduling.png';
import announcementIcon from '../Google_sheet/HomePageImage/announcement.png';
import messageIcon from '../Google_sheet/HomePageImage/message.png';

// 🔥 添加前端 Token 生成函數
const generateFrontendAuthToken = (employeeId) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const sessionId = Math.random().toString(36).substring(2, 10);
  
  // 創建一個唯一的 token
  const tokenData = `${employeeId}_${timestamp}_${randomStr}_${sessionId}`;
  const token = btoa(tokenData).replace(/[+/=]/g, '').substring(0, 64);
  
  return `pmx_fe_${token}`;
};

function FrontPagePMX() {
  // 使用 useLanguage Hook
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  const [userName, setUserName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [jobGrade, setJobGrade] = useState(''); 
  const [companyName, setCompanyName] = useState('台灣波力梅');
  const [employeeId, setEmployeeId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 🔥 新增：防止重複請求的控制變數
  const [dataLoaded, setDataLoaded] = useState(false);
  const isLoadingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  
  const navigate = useNavigate();
  
  // 使用整合後的 Flutter 通訊 Hook，設定為首頁模式
  const { 
    isFlutterEnvironment, 
    sendMessageToFlutter, 
    registerFlutterJSFunctions, 
    unregisterFlutterJSFunctions,
    clearAllLoginCookies
  } = useFlutterIntegration('home');

  // 🔥 修改：處理語言切換 - 不觸發資料重新載入
  const handleLanguageChange = useCallback((langCode) => {
    console.log('首頁語言切換:', langCode);
    
    // 只在已初始化後才處理語言切換
    if (hasInitializedRef.current && isFlutterEnvironment) {
      sendMessageToFlutter('languageChanged', { 
        newLanguage: langCode,
        previousLanguage: currentLanguage
      });
    }
  }, [currentLanguage, isFlutterEnvironment, sendMessageToFlutter]);

  // 🔥 修改：PMX 員工資料獲取函數 - 加入完整的防重複機制
  const getPMXEmployeeInfo = useCallback(async (employee_id, auth_token) => {
    // 🔥 多重防護：防止重複請求
    if (isLoadingRef.current || !employee_id || dataLoaded) {
      console.log('跳過重複請求或資料已載入');
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      console.log(`正在獲取PMX員工資訊: 員工ID=${employee_id}`);
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('fetchInfoStart', { 
          employee_id
        });
      }
      
      // 調用 PMX 專用 API
      const apiUrl = `${API_BASE_URL}/api/pmx/employee/${employee_id}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth_token ? `Bearer ${auth_token}` : undefined,
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('PMX API 回應:', data);

      if (data.Status === "Ok" && data.Data) {
        const employeeData = Array.isArray(data.Data) ? data.Data[0] : data.Data;
        
        // 🔥 處理 department_position 分割
        const departmentPosition = employeeData.department_position || '';
        let departmentName = '';
        let positionName = '';
        
        if (departmentPosition.includes('/')) {
          const parts = departmentPosition.split('/');
          departmentName = parts[0].trim(); // 前面是部門
          positionName = parts[1].trim();   // 後面是職稱
        } else {
          // 如果沒有 '/' 分隔符，將整個字串當作部門
          departmentName = departmentPosition;
          positionName = departmentPosition;
        }
        
        console.log('解析部門職位:', {
          原始資料: departmentPosition,
          部門: departmentName,
          職稱: positionName
        });
        
        // 🔥 設置員工資訊 - 使用分割後的資料
        setUserName(employeeData.name || '');
        setDepartment(departmentName); // 🔥 使用分割後的部門名稱
        setPosition(positionName);     // 🔥 使用分割後的職稱
        setCompanyName('台灣波力梅');
        setJobGrade('employee');
        setDataLoaded(true); // 🔥 標記資料已載入
        
        // 🔥 新增：自動設置 company_id 到 cookies
        const PMX_COMPANY_ID = '12400620';
        
        try {
          // 設置 company_id cookie，過期時間為 120 小時
          Cookies.set('company_id', PMX_COMPANY_ID, { 
            expires: 120 / 24, // 120小時轉換為天數
            path: '/',
            secure: window.location.protocol === 'https:',
            sameSite: 'lax'
          });
          
          console.log(`✅ 已自動設置 company_id cookie: ${PMX_COMPANY_ID}`);
          
          // 通知 Flutter（如果需要）
          if (isFlutterEnvironment) {
            sendMessageToFlutter('companyIdSet', { 
              company_id: PMX_COMPANY_ID,
              message: 'PMX company_id 已自動設置'
            });
          }
        } catch (cookieError) {
          console.error('設置 company_id cookie 失敗:', cookieError);
        }
        
        console.log(`PMX 使用者 ${employeeData.name} 載入成功`);
        console.log('員工資料:', {
          name: employeeData.name,
          department_position: employeeData.department_position,
          解析後部門: departmentName,
          解析後職稱: positionName,
          employee_id: employeeData.employee_id,
          hire_date: employeeData.hire_date
        });
        
        if (isFlutterEnvironment) {
          sendMessageToFlutter('fetchInfoSuccess', { 
            userName: employeeData.name,
            department: departmentName,        // 🔥 使用分割後的部門
            position: positionName,           // 🔥 使用分割後的職稱
            jobGrade: 'employee',
            companyName: '台灣波力梅',
            companyId: PMX_COMPANY_ID,
            employeeData: employeeData
          });
        }
      } else {
        console.log('PMX API 回應中沒有有效的員工資料');
        setUserName(t('login.loginFailed'));
        setDepartment('');
        setPosition('');
        setJobGrade('');
        
        if (data.Msg && data.Msg.includes('未找到')) {
          console.log('員工資料不存在，可能需要重新登入');
          
          if (isFlutterEnvironment) {
            sendMessageToFlutter('fetchInfoError', { 
              message: '員工資料不存在',
              code: 'EMPLOYEE_NOT_FOUND',
              response: data
            });
          }
        }
      }
    } catch (err) {
      console.error('獲取PMX員工資訊錯誤:', err);
      setUserName(t('errors.networkError'));
      setDepartment('');
      setPosition('');
      setJobGrade('');
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('fetchInfoError', { 
          message: `獲取PMX員工資訊錯誤: ${err.message}`,
          code: 'API_ERROR',
          error: err.message
        });
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [isFlutterEnvironment, sendMessageToFlutter, t, dataLoaded]);

  // 🔥 修改 checkPMXTokenValidity 函數 - 添加自動生成 auth_xtbb
  const checkPMXTokenValidity = useCallback(async () => {
    try {
      // 🔥 檢查 PMX SSO 專用 cookies
      let auth_token = Cookies.get('auth_xtbb') || Cookies.get('pmx_session_token') || Cookies.get('sso_access_token');
      const employee_id = Cookies.get('employee_id');
      const pmx_logged_in = Cookies.get('pmx_logged_in');
      
      console.log('🔥 FrontPagePMX 檢查登入狀態:', {
        employee_id,
        pmx_logged_in,
        has_auth_token: !!auth_token,
        auth_token_type: Cookies.get('auth_xtbb') ? 'auth_xtbb' : 
                         Cookies.get('pmx_session_token') ? 'pmx_session_token' : 
                         Cookies.get('sso_access_token') ? 'sso_access_token' : 'none'
      });
      
      // 🔥 PMX SSO 登入檢查條件
      if (!employee_id) {
        console.log('缺少員工ID，將導向登入頁面');
        
        if (isFlutterEnvironment) {
          sendMessageToFlutter('authError', { 
            message: t('errors.unauthorized'),
            code: 'MISSING_EMPLOYEE_ID'
          });
        }
        
        window.location.href = '/apploginpmx';
        return;
      }

      // 🔥 如果沒有 auth_xtbb 但有其他登入標記，自動生成一個
      if (!Cookies.get('auth_xtbb') && (pmx_logged_in === 'true' || auth_token)) {
        console.log('🔥 沒有 auth_xtbb，但有其他登入標記，自動生成 auth_xtbb');
        
        const newAuthToken = generateFrontendAuthToken(employee_id);
        
        // 設置新的 auth_xtbb cookie
        Cookies.set('auth_xtbb', newAuthToken, { 
          expires: 120 / 24, // 120小時轉換為天數
          path: '/',
          secure: window.location.protocol === 'https:',
          sameSite: 'lax'
        });
        
        auth_token = newAuthToken;
        setAuthToken(newAuthToken);
        
        console.log('✅ 已自動生成並設置 auth_xtbb token');
        
        if (isFlutterEnvironment) {
          sendMessageToFlutter('authTokenGenerated', { 
            message: '已自動生成認證 token',
            employee_id: employee_id
          });
        }
      }

      // 🔥 如果有 PMX SSO 登入標記，視為有效登入
      if (pmx_logged_in === 'true' && auth_token) {
        console.log('✅ PMX SSO Token 有效，繼續使用應用');
        return;
      }

      // 🔥 如果沒有 PMX SSO 標記但有 auth_token，嘗試驗證
      if (auth_token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/pmx/employee/${employee_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth_token}`
            },
            credentials: 'include'
          });
          
          const result = await response.json();
          
          if (result.Status === "Ok") {
            console.log('✅ PMX Token 驗證成功，繼續使用應用');
            
            // 🔥 如果驗證成功但沒有 PMX 登入標記，設置它
            if (pmx_logged_in !== 'true') {
              Cookies.set('pmx_logged_in', 'true', { 
                expires: 120 / 24,
                path: '/',
                secure: window.location.protocol === 'https:',
                sameSite: 'lax'
              });
              console.log('✅ 已設置 pmx_logged_in 標記');
            }
            
            return;
          }
        } catch (apiError) {
          console.error('API 驗證失敗:', apiError);
          // 不要立即跳轉，繼續下面的邏輯
        }
      }
      
      console.log('❌ PMX Token 無效或已失效，需要重新登入');
      clearAllLoginCookies();
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('authError', { 
          message: t('errors.tokenExpired'),
          code: 'PMX_TOKEN_EXPIRED'
        });
      }
      
      window.location.href = '/apploginpmx';
      
    } catch (err) {
      console.error('檢查 PMX token 有效性時出錯:', err);
      // 🔥 不要立即跳轉，給一次機會
      console.log('⚠️ Token 檢查出錯，但不立即跳轉，等待下次檢查');
    }
  }, [isFlutterEnvironment, sendMessageToFlutter, clearAllLoginCookies, t]);

  // 🔥 修改：註冊 Flutter 函數 - 只執行一次
  useEffect(() => {
    registerFlutterJSFunctions();
    
    if (isFlutterEnvironment) {
      sendMessageToFlutter('pageLoaded', { page: 'homePage' });
    }
    
    return () => {
      unregisterFlutterJSFunctions();
    };
  }, []); // 🔥 空依賴陣列

  // 🔥 修改：語言變化處理 - 避免觸發 API 調用
  useEffect(() => {
    if (hasInitializedRef.current) {
      handleLanguageChange(currentLanguage);
    }
  }, [currentLanguage]); // 🔥 移除 handleLanguageChange 依賴

  // 🔥 修改：初始化和資料載入 - 整合所有邏輯到一個 useEffect
  useEffect(() => {
    if (hasInitializedRef.current) {
      return; // 🔥 如果已經初始化過，直接返回
    }
    
    const initializeData = async () => {
      try {
        // 🔥 先檢查 PMX SSO cookies
        const employee_id = Cookies.get('employee_id');
        const pmx_logged_in = Cookies.get('pmx_logged_in');
        let auth_token = Cookies.get('auth_xtbb') || Cookies.get('pmx_session_token') || Cookies.get('sso_access_token');

        console.log('🔥 FrontPagePMX 初始化檢查:', {
          employee_id,
          pmx_logged_in,
          has_auth_token: !!auth_token
        });

        if (employee_id) {
          setEmployeeId(employee_id);
          
          // 🔥 如果沒有 auth_xtbb 但有其他登入標記，自動生成一個
          if (!Cookies.get('auth_xtbb') && (pmx_logged_in === 'true' || auth_token)) {
            console.log('🔥 初始化時自動生成 auth_xtbb token');
            
            const newAuthToken = generateFrontendAuthToken(employee_id);
            
            // 設置新的 auth_xtbb cookie
            Cookies.set('auth_xtbb', newAuthToken, { 
              expires: 120 / 24,
              path: '/',
              secure: window.location.protocol === 'https:',
              sameSite: 'lax'
            });
            
            auth_token = newAuthToken;
            setAuthToken(newAuthToken);
            
            console.log('✅ 初始化時已自動生成並設置 auth_xtbb token');
            
            if (isFlutterEnvironment) {
              sendMessageToFlutter('authTokenGenerated', { 
                message: '初始化時已自動生成認證 token',
                employee_id: employee_id
              });
            }
          } else if (auth_token) {
            setAuthToken(auth_token);
          }
          
          // 🔥 如果有 PMX SSO 登入標記，直接載入資料
          if (pmx_logged_in === 'true') {
            console.log('✅ 檢測到 PMX SSO 登入，直接載入員工資料');
            await getPMXEmployeeInfo(employee_id, auth_token);
          } else if (auth_token) {
            // 🔥 有 token 但沒有 PMX 標記，先檢查 token 有效性
            console.log('🔍 有 token 但無 PMX 標記，檢查 token 有效性');
            await checkPMXTokenValidity();
            
            // 如果沒有被重定向，載入員工資料
            if (window.location.pathname === '/frontpagepmx') {
              await getPMXEmployeeInfo(employee_id, auth_token);
            }
          } else {
            console.log('❌ 缺少認證 token，需要重新登入');
            window.location.href = '/apploginpmx';
            return;
          }
        } else {
          console.log('❌ 未找到員工ID cookie，將導向登入頁面');
          
          if (isFlutterEnvironment) {
            sendMessageToFlutter('authError', { 
              message: t('errors.unauthorized'),
              code: 'MISSING_EMPLOYEE_ID_COOKIE'
            });
          }
          
          window.location.href = '/apploginpmx';
          return;
        }
        
        hasInitializedRef.current = true;
        
      } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
        setLoading(false);
      }
    };
    
    initializeData();
  }, []); // 🔥 空依賴陣列，只執行一次

  // 功能按鈕數據
  const functionButtons = [
    { 
      id: 'punch', 
      icon: 'clipboard', 
      text: t('home.functions.punch'), 
      route: '/checkinpmx', 
      notifications: 0 
    },
    { 
      id: 'makeup', 
      icon: 'clock', 
      text: t('home.functions.makeup'), 
      route: '/replenishpmx', 
      notifications: 0 
    },
    { 
      id: 'overtime', 
      icon: 'time-add', 
      text: t('home.functions.overtime'), 
      route: '/workovertimepmx', 
      notifications: 0 
    },
    { 
      id: 'leave', 
      icon: 'calendar-check', 
      text: t('home.functions.leave'), 
      route: '/leavepmx', 
      notifications: 0 
    },
    { 
      id: 'salary', 
      icon: 'money', 
      text: t('home.functions.salary'), 
      route: '/salary01', 
      notifications: 0,
      disabled: true
    },
    { 
      id: 'approval', 
      icon: 'file-check', 
      text: t('home.functions.approval'), 
      route: '/auditsystem01', 
      notifications: 0, 
      requiredRoles: ['leader', 'hr']
    },
    { 
      id: 'schedule', 
      icon: 'calendar', 
      text: t('home.functions.schedule'), 
      route: '/schedule01', 
      notifications: 0,
      disabled: true
    },
    { 
      id: 'announcement', 
      icon: 'megaphone', 
      text: t('home.functions.announcement'), 
      route: '/announcement01', 
      notifications: 0,
      disabled: true
    },
    { 
      id: 'message', 
      icon: 'message', 
      text: t('home.functions.message'), 
      route: '/message', 
      notifications: 0,
      disabled: true
    },
  ];

  // 渲染功能圖標
  const renderIcon = (iconName) => {
    const altTexts = {
      'clipboard': t('home.functions.punch'),
      'clock': t('home.functions.makeup'),
      'time-add': t('home.functions.overtime'),
      'calendar-check': t('home.functions.leave'),
      'money': t('home.functions.salary'),
      'file-check': t('home.functions.approval'),
      'calendar': t('home.functions.schedule'),
      'megaphone': t('home.functions.announcement'),
      'message': t('home.functions.message')
    };

    switch (iconName) {
      case 'clipboard':
        return <img src={checkInIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'clock':
        return <img src={replacementCardIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'time-add':
        return <img src={workOvertimeIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'calendar-check':
        return <img src={applyIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'money':
        return <img src={salaryIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'file-check':
        return <img src={approvingIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'calendar':
        return <img src={schedulingIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'megaphone':
        return <img src={announcementIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      case 'message':
        return <img src={messageIcon} alt={altTexts[iconName]} className="front-icon-image" />;
      default:
        return null;
    }
  };

  // 處理功能按鈕點擊
  const handleButtonClick = (route, requiredRoles, buttonId, disabled) => {
    console.log(`嘗試導航到: ${route}`);
    
    if (disabled) {
      alert(t('home.functionDisabled') || '此功能目前暫時停用');
      console.log(`功能 ${buttonId} 已被禁用`);
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('functionDisabled', { 
          route,
          buttonId,
          message: '此功能目前暫時停用'
        });
      }
      return;
    }
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(jobGrade)) {
        alert(t('home.noPermission'));
        console.log('用戶無權限訪問此功能');
        
        if (isFlutterEnvironment) {
          sendMessageToFlutter('permissionDenied', { 
            route,
            buttonId,
            requiredRoles,
            currentRole: jobGrade
          });
        }
        return;
      }
    }
    
    if (!authToken) {
      console.log('警告: 導航時缺少認證 token，可能會影響目標頁面的功能');
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('navigationWarning', { 
          message: '缺少認證 token，可能會影響目標頁面的功能',
          code: 'MISSING_AUTH_TOKEN',
          route,
          buttonId
        });
      }
    }
    
    console.log(`導航到: ${route}`);
    
    if (isFlutterEnvironment) {
      if (buttonId === 'punch') {
        sendMessageToFlutter('navigate', { 
          route,
          buttonId,
          hasToken: !!authToken,
          replace: true
        });
      } else {
        sendMessageToFlutter('navigate', { 
          route,
          buttonId,
          hasToken: !!authToken
        });
      }
    }
    
    if (buttonId === 'punch') {
      console.log('使用 replace 導航到打卡頁面，防止返回');
      window.location.replace(route);
    } else {
      window.location.href = route;
    }
  };

  // 處理個人資料卡點擊
  const handleProfileCardClick = () => {
    console.log('導航到個人資料頁面');
    
    if (!authToken) {
      console.log('警告: 導航到個人資料頁面時缺少認證 token，可能會影響頁面功能');
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('navigationWarning', { 
          message: '缺少認證 token，可能會影響個人資料頁面的功能',
          code: 'MISSING_AUTH_TOKEN',
          route: '/personaldatapmx',
          buttonId: 'profile'
        });
      }
    }
    
    if (isFlutterEnvironment) {
      sendMessageToFlutter('navigate', { 
        route: '/personaldatapmx',
        buttonId: 'profile',
        hasToken: !!authToken
      });
    }
    
    window.location.href = '/personaldatapmx';
  };

  // 🔥 如果正在載入，顯示載入畫面
  if (loading) {
    return (
      <div className="front-container">
        <div className="front-app-wrapper">
          <div className="front-loading">
            <div className="front-loading-spinner"></div>
            <div className="front-loading-text">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="front-container">
      <div className="front-app-wrapper">
        <LanguageSwitch 
          position="absolute"
          containerClassName="front-page-language-switch"
        />
        
        <header className="front-header">
          <div className="front-page-title">{t('home.title')}</div>
        </header>

        <div className="front-content">
          <div 
            className="front-profile-card" 
            onClick={handleProfileCardClick}
          >
            <div className="front-company-name">
              {companyName || t('home.noCompany')}
            </div>
            <div className="front-department-info">
              {department || t('home.noDepartment')}<br />
              {position || t('home.noPosition')}
            </div>
            <div className="front-user-info-row">
              <div className="front-user-name">
                {userName || t('home.notLoggedIn')}
              </div>
              <div className="front-user-number">
                {employeeId || t('home.noEmployeeId')}
              </div>
            </div>
          </div>

          <div className="front-placeholder-image">
            <div className="front-cross-line">
              <div className="front-line1"></div>
              <div className="front-line2"></div>
            </div>
          </div>

          <div className="front-functions-grid">
            {functionButtons.map((button) => (
              <div 
                key={button.id} 
                className={`front-function-button ${button.disabled ? 'disabled' : ''}`}
                onClick={() => handleButtonClick(button.route, button.requiredRoles, button.id, button.disabled)}
              >
                <div className="front-function-icon">
                  {renderIcon(button.icon)}
                  {button.notifications > 0 && (
                    <div className="front-notification-badge">{button.notifications}</div>
                  )}
                </div>
                <div className="front-function-text">{button.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPagePMX;
