// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './css/FrontPage.css';
// import Cookies from 'js-cookie';
// import { 
//   fetchEmployeeInfo,
//   handleFunctionButtonClick, 
//   executeNavigation 
// } from './function/function';
// import { useFlutterIntegration } from './Hook/hooks';

// // 導入圖片
// import checkInIcon from './HomePageImage/Check-in.png';
// import replacementCardIcon from './HomePageImage/Replacement Card.png';
// import workOvertimeIcon from './HomePageImage/work overtime.png';
// import applyIcon from './HomePageImage/Apply.png';
// import salaryIcon from './HomePageImage/salary.png';
// import approvingIcon from './HomePageImage/Approving.png';
// import schedulingIcon from './HomePageImage/Scheduling.png';
// import announcementIcon from './HomePageImage/announcement.png';
// import messageIcon from './HomePageImage/message.png';

// function FrontPage() {
//   const [userName, setUserName] = useState('');
//   const [department, setDepartment] = useState('');
//   const [position, setPosition] = useState('');
//   const [jobGrade, setJobGrade] = useState(''); 
//   const [companyId, setCompanyId] = useState('');
//   const [companyName, setCompanyName] = useState(''); 
//   const [employeeId, setEmployeeId] = useState('');
//   const [authToken, setAuthToken] = useState('');
//   const [isLoading, setIsLoading] = useState(true); // 新增載入狀態
//   const [cookiesReady, setCookiesReady] = useState(false); // 新增 cookies 準備狀態
//   const navigate = useNavigate();
  
//   // 使用整合後的 Flutter 通訊 Hook，設定為首頁模式
//   const { 
//     isFlutterEnvironment, 
//     sendMessageToFlutter, 
//     registerFlutterJSFunctions, 
//     unregisterFlutterJSFunctions,
//     clearAllLoginCookies
//   } = useFlutterIntegration('home');

//   // 檢查 cookies 是否準備好
//   useEffect(() => {
//     let cancelled = false;
    
//     const checkCookies = async () => {
//       let attempts = 0;
//       const maxAttempts = 100; // 10秒內檢查
      
//       while (!cancelled && attempts < maxAttempts) {
//         const company_id = Cookies.get('company_id');
//         const employee_id = Cookies.get('employee_id');
//         const auth_token = Cookies.get('auth_xtbb');
        
//         if (company_id && employee_id && auth_token) {
//           console.log('所有必要的 cookies 已準備好');
//           setCookiesReady(true);
//           setCompanyId(company_id);
//           setEmployeeId(employee_id);
//           setAuthToken(auth_token);
          
//           // 獲取員工資訊並進行一次性 token 檢查
//           try {
//             await getEmployeeInfoAndCheckToken(company_id, employee_id, auth_token);
//             setIsLoading(false);
//           } catch (error) {
//             console.error('獲取員工資訊失敗:', error);
//             setIsLoading(false);
//           }
//           break;
//         } else {
//           console.log(`等待 cookies 準備... (${attempts + 1}/${maxAttempts})`);
//           await new Promise(resolve => setTimeout(resolve, 100));
//           attempts++;
//         }
//       }
      
//       // 如果超時還沒有 cookies，跳轉到登入頁面
//       if (attempts >= maxAttempts && !cancelled) {
//         console.log('等待 cookies 超時，跳轉到登入頁面');
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('authError', { message: '登入資訊載入超時', code: 'COOKIES_TIMEOUT' });
//         }
//         window.location.href = '/';
//       }
//     };
    
//     checkCookies();
    
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // 處理登出功能
//   const handleLogout = async () => {
//     try {
//       console.log('開始登出流程...');
      
//       // 通知 Flutter 開始登出
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('logoutStart', {
//           company_id: companyId,
//           employee_id: employeeId
//         });
//       }
      
//       // 清除指定的 cookies
//       Cookies.remove('company_id');
//       Cookies.remove('employee_id');
//       Cookies.remove('auth_xtbb');
//       Cookies.remove('password');
      
//       // 也清除可能在不同路徑下的相同 cookies
//       Cookies.remove('company_id', { path: '/' });
//       Cookies.remove('employee_id', { path: '/' });
//       Cookies.remove('auth_xtbb', { path: '/' });
//       Cookies.remove('password', { path: '/' });
      
//       console.log('已清除指定的登入 cookies');
      
//       // 通知 Flutter 登出成功
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('logoutSuccess', {
//           message: '登出成功'
//         });
//       }
      
//       // 跳轉到登入頁面
//       window.location.href = '/applogin01';
      
//     } catch (error) {
//       console.error('登出過程中發生錯誤:', error);
      
//       // 通知 Flutter 登出失敗
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('logoutError', {
//           message: '登出失敗',
//           error: error.message
//         });
//       }
      
//       // 即使出錯也跳轉到登入頁面
//       window.location.href = '/applogin01';
//     }
//   };

//   // 註冊 Flutter 可調用的 JS 函式
//   useEffect(() => {
//     // 註冊 JS 函式
//     registerFlutterJSFunctions();
    
//     // 通知 Flutter 首頁已載入
//     if (isFlutterEnvironment) {
//       sendMessageToFlutter('pageLoaded', { page: 'homePage' });
//     }
    
//     // 清理函式
//     return () => {
//       unregisterFlutterJSFunctions();
//     };
//   }, [isFlutterEnvironment, registerFlutterJSFunctions, unregisterFlutterJSFunctions, sendMessageToFlutter]);

//   // 獲取員工資訊並檢查 token（只在載入時執行一次）
//   const getEmployeeInfoAndCheckToken = async (company_id, employee_id, auth_token) => {
//     try {
//       if (!company_id || !employee_id) {
//         console.log('缺少必要資訊');
//         window.location.href = '/';
//         return;
//       }
      
//       console.log('開始獲取員工資訊並檢查 token...');
//       const response = await fetchEmployeeInfo(company_id, employee_id, auth_token);
      
//       if (response.success) {
//         const employeeData = response.data;
//         setUserName(employeeData.name || '');
//         setDepartment(employeeData.department || '');
//         setPosition(employeeData.position || '');
//         setCompanyName(employeeData.company_name || '');
//         setJobGrade((employeeData.job_grade || '').toLowerCase());
        
//         console.log('員工資訊獲取成功，token 有效:', employeeData.name);
        
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('fetchInfoSuccess', { 
//             userName: employeeData.name, 
//             department: employeeData.department, 
//             position: employeeData.position, 
//             jobGrade: (employeeData.job_grade || '').toLowerCase(), 
//             companyName: employeeData.company_name, 
//             employeeData 
//           });
//         }
//       } else {
//         console.log('API 回應失敗或 token 無效');
        
//         // 檢查是否是 token 失效
//         if (response.tokenExpired) {
//           console.log('Token 已失效，需要重新登入');
//           clearAllLoginCookies();
//           if (isFlutterEnvironment) {
//             sendMessageToFlutter('authError', { message: 'Token 已失效，需要重新登入', code: 'TOKEN_EXPIRED' });
//           }
//           window.location.href = '/';
//           return;
//         }
        
//         // 如果不是 token 問題，顯示錯誤但不跳轉
//         setUserName('查無姓名');
//         setDepartment('');
//         setPosition('');
//         setJobGrade('');
//         setCompanyName('');
        
//         if (isFlutterEnvironment) {
//           sendMessageToFlutter('fetchInfoError', { 
//             message: response.message || 'API 回應中沒有有效的員工資料', 
//             code: 'INVALID_API_RESPONSE', 
//             response 
//           });
//         }
//       }
//     } catch (err) {
//       console.error('獲取員工資訊錯誤:', err);
      
//       // 網路錯誤不跳轉，顯示錯誤狀態
//       setUserName('資料讀取失敗');
//       setDepartment('');
//       setPosition('');
//       setJobGrade('');
//       setCompanyName('');
      
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('fetchInfoError', { 
//           message: `獲取員工資訊錯誤: ${err.message}`, 
//           code: 'API_ERROR', 
//           error: err.message 
//         });
//       }
//     }
//   };

//   // 功能按鈕數據 - 修改這裡，添加 disabled 屬性
//   const functionButtons = [
//     { id: 'punch', icon: 'clipboard', text: '打卡', route: '/checkin01', notifications: 0 },
//     { id: 'makeup', icon: 'clock', text: '補卡', route: '/replenish01', notifications: 0 },
//     { id: 'overtime', icon: 'time-add', text: '加班', route: '/workovertime01', notifications: 0 },
//     { id: 'leave', icon: 'calendar-check', text: '請假', route: '/leave01', notifications: 0 },
//     { id: 'salary', icon: 'money', text: '薪資', route: '/salary01', notifications: 0, disabled: true }, // 禁用薪資
//     { id: 'approval', icon: 'file-check', text: '簽核系統', route: '/auditsystem01', notifications: 0, requiredRoles: ['leader', 'hr'] },
//     { id: 'schedule', icon: 'calendar', text: '排班', route: '/schedule01', notifications: 0 }, // 禁用排班
//     // 修改後的設定（啟用狀態）
//     { id: 'announcement', icon: 'megaphone', text: '公告', route: '/announcement01', notifications: 0 }, // 啟用公告
//     { id: 'message', icon: 'message', text: '訊息', route: '/message', notifications: 0, disabled: true }, // 禁用訊息
//   ];

//   // 渲染功能圖標
//   const renderIcon = (iconName) => {
//     switch (iconName) {
//       case 'clipboard':
//         return <img src={checkInIcon} alt="打卡" className="front-icon-image" />;
//       case 'clock':
//         return <img src={replacementCardIcon} alt="補卡" className="front-icon-image" />;
//       case 'time-add':
//         return <img src={workOvertimeIcon} alt="加班" className="front-icon-image" />;
//       case 'calendar-check':
//         return <img src={applyIcon} alt="請假" className="front-icon-image" />;
//       case 'money':
//         return <img src={salaryIcon} alt="薪資" className="front-icon-image" />;
//       case 'file-check':
//         return <img src={approvingIcon} alt="簽核系統" className="front-icon-image" />;
//       case 'calendar':
//         return <img src={schedulingIcon} alt="排班" className="front-icon-image" />;
//       case 'megaphone':
//         return <img src={announcementIcon} alt="公告" className="front-icon-image" />;
//       case 'message':
//         return <img src={messageIcon} alt="訊息" className="front-icon-image" />;
//       default:
//         return null;
//     }
//   };

//   // 處理功能按鈕點擊 - 使用 function.js 中的函數
//   const handleButtonClick = (route, requiredRoles, buttonId, disabled) => {
//     const result = handleFunctionButtonClick({
//       route,
//       requiredRoles,
//       buttonId,
//       disabled,
//       jobGrade,
//       authToken,
//       sendMessageToFlutter,
//       isFlutterEnvironment
//     });
    
//     // 執行導航
//     executeNavigation(result);
//   };

//   // 處理個人資料卡點擊
//   const handleProfileCardClick = () => {
//     console.log('導航到個人資料頁面');
    
//     // 檢查 token 是否存在
//     if (!authToken) {
//       console.log('警告: 導航到個人資料頁面時缺少認證 token，可能會影響頁面功能');
      
//       // 通知 Flutter token 不存在
//       if (isFlutterEnvironment) {
//         sendMessageToFlutter('navigationWarning', { 
//           message: '缺少認證 token，可能會影響個人資料頁面的功能',
//           code: 'MISSING_AUTH_TOKEN',
//           route: '/personaldata01',
//           buttonId: 'profile'
//         });
//       }
//     }
    
//     // 通知 Flutter 即將導航到個人資料頁面
//     if (isFlutterEnvironment) {
//       sendMessageToFlutter('navigate', { 
//         route: '/personaldata01',
//         buttonId: 'profile',
//         hasToken: !!authToken
//       });
//     }
    
//     window.location.href = '/personaldata01';
//   };

//   // 處理首頁圖標點擊
//   const handleHomeClick = () => {
//     console.log('重新載入首頁');
    
//     // 通知 Flutter 即將重新載入首頁
//     if (isFlutterEnvironment) {
//       sendMessageToFlutter('refresh', {
//         hasToken: !!authToken
//       });
//     }
    
//     window.location.reload();
//   };

//   // 簡化的健康檢查 - 只在資料讀取失敗時重試
//   useEffect(() => {
//     if (!cookiesReady) return;
    
//     const healthCheckInterval = setInterval(() => {
//       const nameElement = document.querySelector('.front-user-name');
      
//       // 只有在明確的錯誤狀態才重新獲取資料
//       if (nameElement && nameElement.textContent === '資料讀取失敗') {
//         console.log('檢測到資料讀取失敗，嘗試重新獲取');
//         const company_id = Cookies.get('company_id');
//         const employee_id = Cookies.get('employee_id');
//         const auth_token = Cookies.get('auth_xtbb');
        
//         if (company_id && employee_id && auth_token) {
//           getEmployeeInfoAndCheckToken(company_id, employee_id, auth_token);
//         }
//       }
//     }, 5 * 60 * 1000); // 5分鐘檢查一次
    
//     return () => clearInterval(healthCheckInterval);
//   }, [cookiesReady]);

//   // 如果還在載入中，顯示載入畫面
//   if (isLoading || !cookiesReady) {
//     return (
//       <div className="front-container">
//         <div className="front-app-wrapper">
//           <div className="front-loading-container">
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
//         {/* 頁面標題 */}
//         <header className="front-header">
//           <div className="front-page-title">首頁</div>
//           {/* 登出按鈕 */}
//           <button className="front-logout-button" onClick={handleLogout}>
//             登出
//           </button>
//         </header>

//         <div className="front-content">
//           {/* 個人資訊卡 */}
//           <div 
//             className="front-profile-card" 
//             onClick={handleProfileCardClick}
//           >
//             <div className="front-company-name">{companyName || '未設定公司'}</div>
//             <div className="front-department-info">
//               {department || '無部門資訊'}<br />
//               {position || '無職稱資訊'}
//             </div>
//             <div className="front-user-info-row">
//               <div className="front-user-name">{userName || '未登入'}</div>
//               <div className="front-user-number">{employeeId || 'N/A'}</div>
//             </div>
//           </div>

//           {/* 佔位圖像 */}
//           <div className="front-placeholder-image">
//             <div className="front-cross-line">
//               <div className="front-line1"></div>
//               <div className="front-line2"></div>
//             </div>
//           </div>

//           {/* 功能按鈕網格 - 修改這裡，添加禁用狀態樣式 */}
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
//                 {/* 添加開發中標示 */}
//                 {button.disabled && (
//                   <div className="front-development-badge">開發中</div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FrontPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FrontPage.css';
import Cookies from 'js-cookie';
import axios from 'axios'; // 🔥 新增 axios 引入
import { API_BASE_URL } from '../config'; // 🔥 引入 config
import { 
  fetchEmployeeInfo,
  handleFunctionButtonClick, 
  executeNavigation 
} from './function/function';
import { useFlutterIntegration } from './Hook/hooks';

// 導入圖片
import checkInIcon from './HomePageImage/Check-in.png';
import replacementCardIcon from './HomePageImage/Replacement Card.png';
import workOvertimeIcon from './HomePageImage/work overtime.png';
import applyIcon from './HomePageImage/Apply.png';
import salaryIcon from './HomePageImage/salary.png';
import approvingIcon from './HomePageImage/Approving.png';
import schedulingIcon from './HomePageImage/Scheduling.png';
import announcementIcon from './HomePageImage/announcement.png';
import messageIcon from './HomePageImage/message.png';

function FrontPage() {
  const [userName, setUserName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [jobGrade, setJobGrade] = useState(''); 
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState(''); 
  const [employeeId, setEmployeeId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cookiesReady, setCookiesReady] = useState(false);
  
  // 🔥 新增：簽核系統權限相關狀態
  const [approvalPermissions, setApprovalPermissions] = useState(null);
  const [hasApprovalPermission, setHasApprovalPermission] = useState(false);
  const [approvalPermissionLoading, setApprovalPermissionLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // 使用整合後的 Flutter 通訊 Hook，設定為首頁模式
  const { 
    isFlutterEnvironment, 
    sendMessageToFlutter, 
    registerFlutterJSFunctions, 
    unregisterFlutterJSFunctions,
    clearAllLoginCookies
  } = useFlutterIntegration('home');

  // 🔥 新增：檢查當前登入使用者的簽核權限
  const checkApprovalPermissions = async () => {
    try {
      const companyId = Cookies.get('company_id');
      const currentUserId = Cookies.get('employee_id'); // 🔥 當前登入使用者的ID
      
      if (!companyId || !currentUserId) {
        console.log('🔍 簽核權限檢查：缺少公司ID或使用者ID');
        return {
          success: false,
          message: '無法獲取公司ID或使用者ID',
          hasApprovalPermission: false
        };
      }
      
      console.log('🔍 檢查當前使用者簽核權限:', currentUserId);
      
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

      console.log('🔍 當前使用者簽核權限檢查 API 回應:', response.data);
      
      if (response.data && response.data.Status === 'Ok') {
        // 🔥 從 raw_data 中讀取權限
        const rawData = response.data.Data?.raw_data;
        const hasPermission = rawData?.supervisor_approval === 1 || rawData?.supervisor_approval === '1';
        
        console.log('🔍 當前使用者簽核原始權限資料:', rawData);
        console.log('🔍 supervisor_approval 權限值:', rawData?.supervisor_approval);
        console.log('🔍 簽核系統最終權限判斷:', hasPermission);
        
        return {
          success: true,
          permissions: rawData,
          hasApprovalPermission: hasPermission
        };
      } else {
        return {
          success: false,
          message: response.data?.Msg || '簽核權限檢查失敗',
          hasApprovalPermission: false
        };
      }
    } catch (error) {
      console.error('❌ 簽核權限檢查 API 錯誤:', error);
      return {
        success: false,
        message: error.message || '簽核權限檢查失敗',
        hasApprovalPermission: false
      };
    }
  };

  // 檢查 cookies 是否準備好
  useEffect(() => {
    let cancelled = false;
    
    const checkCookies = async () => {
      let attempts = 0;
      const maxAttempts = 100; // 10秒內檢查
      
      while (!cancelled && attempts < maxAttempts) {
        const company_id = Cookies.get('company_id');
        const employee_id = Cookies.get('employee_id');
        const auth_token = Cookies.get('auth_xtbb');
        
        if (company_id && employee_id && auth_token) {
          console.log('所有必要的 cookies 已準備好');
          setCookiesReady(true);
          setCompanyId(company_id);
          setEmployeeId(employee_id);
          setAuthToken(auth_token);
          
          // 獲取員工資訊並進行一次性 token 檢查
          try {
            await getEmployeeInfoAndCheckToken(company_id, employee_id, auth_token);
            
            // 🔥 檢查簽核權限
            await loadApprovalPermissions();
            
            setIsLoading(false);
          } catch (error) {
            console.error('獲取員工資訊失敗:', error);
            setIsLoading(false);
          }
          break;
        } else {
          console.log(`等待 cookies 準備... (${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }
      
      // 如果超時還沒有 cookies，跳轉到登入頁面
      if (attempts >= maxAttempts && !cancelled) {
        console.log('等待 cookies 超時，跳轉到登入頁面');
        if (isFlutterEnvironment) {
          sendMessageToFlutter('authError', { message: '登入資訊載入超時', code: 'COOKIES_TIMEOUT' });
        }
        window.location.href = '/';
      }
    };
    
    checkCookies();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔥 新增：載入簽核權限
  const loadApprovalPermissions = async () => {
    setApprovalPermissionLoading(true);
    
    try {
      const result = await checkApprovalPermissions();
      
      if (result.success) {
        setApprovalPermissions(result.permissions);
        setHasApprovalPermission(result.hasApprovalPermission);
        console.log('✅ 當前使用者簽核權限檢查成功:', result.permissions);
        console.log('✅ 簽核系統權限:', result.hasApprovalPermission ? '有權限' : '無權限');
      } else {
        setHasApprovalPermission(false);
        console.error('❌ 當前使用者簽核權限檢查失敗:', result.message);
      }
    } catch (error) {
      setHasApprovalPermission(false);
      console.error('❌ 當前使用者簽核權限檢查異常:', error);
    } finally {
      setApprovalPermissionLoading(false);
    }
  };

  // 處理登出功能
  const handleLogout = async () => {
    try {
      console.log('開始登出流程...');
      
      // 通知 Flutter 開始登出
      if (isFlutterEnvironment) {
        sendMessageToFlutter('logoutStart', {
          company_id: companyId,
          employee_id: employeeId
        });
      }
      
      // 清除指定的 cookies
      Cookies.remove('company_id');
      Cookies.remove('employee_id');
      Cookies.remove('auth_xtbb');
      Cookies.remove('password');
      
      // 也清除可能在不同路徑下的相同 cookies
      Cookies.remove('company_id', { path: '/' });
      Cookies.remove('employee_id', { path: '/' });
      Cookies.remove('auth_xtbb', { path: '/' });
      Cookies.remove('password', { path: '/' });
      
      console.log('已清除指定的登入 cookies');
      
      // 通知 Flutter 登出成功
      if (isFlutterEnvironment) {
        sendMessageToFlutter('logoutSuccess', {
          message: '登出成功'
        });
      }
      
      // 跳轉到登入頁面
      window.location.href = '/applogin01';
      
    } catch (error) {
      console.error('登出過程中發生錯誤:', error);
      
      // 通知 Flutter 登出失敗
      if (isFlutterEnvironment) {
        sendMessageToFlutter('logoutError', {
          message: '登出失敗',
          error: error.message
        });
      }
      
      // 即使出錯也跳轉到登入頁面
      window.location.href = '/applogin01';
    }
  };

  // 註冊 Flutter 可調用的 JS 函式
  useEffect(() => {
    // 註冊 JS 函式
    registerFlutterJSFunctions();
    
    // 通知 Flutter 首頁已載入
    if (isFlutterEnvironment) {
      sendMessageToFlutter('pageLoaded', { page: 'homePage' });
    }
    
    // 清理函式
    return () => {
      unregisterFlutterJSFunctions();
    };
  }, [isFlutterEnvironment, registerFlutterJSFunctions, unregisterFlutterJSFunctions, sendMessageToFlutter]);

  // 獲取員工資訊並檢查 token（只在載入時執行一次）
  const getEmployeeInfoAndCheckToken = async (company_id, employee_id, auth_token) => {
    try {
      if (!company_id || !employee_id) {
        console.log('缺少必要資訊');
        window.location.href = '/';
        return;
      }
      
      console.log('開始獲取員工資訊並檢查 token...');
      const response = await fetchEmployeeInfo(company_id, employee_id, auth_token);
      
      if (response.success) {
        const employeeData = response.data;
        setUserName(employeeData.name || '');
        setDepartment(employeeData.department || '');
        setPosition(employeeData.position || '');
        setCompanyName(employeeData.company_name || '');
        setJobGrade((employeeData.job_grade || '').toLowerCase());
        
        console.log('員工資訊獲取成功，token 有效:', employeeData.name);
        
        if (isFlutterEnvironment) {
          sendMessageToFlutter('fetchInfoSuccess', { 
            userName: employeeData.name, 
            department: employeeData.department, 
            position: employeeData.position, 
            jobGrade: (employeeData.job_grade || '').toLowerCase(), 
            companyName: employeeData.company_name, 
            employeeData 
          });
        }
      } else {
        console.log('API 回應失敗或 token 無效');
        
        // 檢查是否是 token 失效
        if (response.tokenExpired) {
          console.log('Token 已失效，需要重新登入');
          clearAllLoginCookies();
          if (isFlutterEnvironment) {
            sendMessageToFlutter('authError', { message: 'Token 已失效，需要重新登入', code: 'TOKEN_EXPIRED' });
          }
          window.location.href = '/';
          return;
        }
        
        // 如果不是 token 問題，顯示錯誤但不跳轉
        setUserName('查無姓名');
        setDepartment('');
        setPosition('');
        setJobGrade('');
        setCompanyName('');
        
        if (isFlutterEnvironment) {
          sendMessageToFlutter('fetchInfoError', { 
            message: response.message || 'API 回應中沒有有效的員工資料', 
            code: 'INVALID_API_RESPONSE', 
            response 
          });
        }
      }
    } catch (err) {
      console.error('獲取員工資訊錯誤:', err);
      
      // 網路錯誤不跳轉，顯示錯誤狀態
      setUserName('資料讀取失敗');
      setDepartment('');
      setPosition('');
      setJobGrade('');
      setCompanyName('');
      
      if (isFlutterEnvironment) {
        sendMessageToFlutter('fetchInfoError', { 
          message: `獲取員工資訊錯誤: ${err.message}`, 
          code: 'API_ERROR', 
          error: err.message 
        });
      }
    }
  };

  // 🔥 修正：功能按鈕數據 - 根據權限動態設定簽核系統狀態
  const functionButtons = [
    { id: 'punch', icon: 'clipboard', text: '打卡', route: '/checkin01', notifications: 0 },
    { id: 'makeup', icon: 'clock', text: '補卡', route: '/replenish01', notifications: 0 },
    { id: 'overtime', icon: 'time-add', text: '加班', route: '/workovertime01', notifications: 0 },
    { id: 'leave', icon: 'calendar-check', text: '請假', route: '/leave01', notifications: 0 },
    { id: 'salary', icon: 'money', text: '薪資', route: '/salary01', notifications: 0, disabled: true },
    { 
      id: 'approval', 
      icon: 'file-check', 
      text: '簽核系統', 
      route: '/auditsystem01', 
      notifications: 0, 
      disabled: !hasApprovalPermission, // 🔥 根據權限動態設定
      permissionBased: true // 🔥 標記為基於權限的按鈕
    },
    { id: 'schedule', icon: 'calendar', text: '排班', route: '/schedule01', notifications: 0 },
    { id: 'announcement', icon: 'megaphone', text: '公告', route: '/announcement01', notifications: 0 },
    { id: 'message', icon: 'message', text: '訊息', route: '/message', notifications: 0, disabled: true },
  ];

  // 渲染功能圖標
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'clipboard':
        return <img src={checkInIcon} alt="打卡" className="front-icon-image" />;
      case 'clock':
        return <img src={replacementCardIcon} alt="補卡" className="front-icon-image" />;
      case 'time-add':
        return <img src={workOvertimeIcon} alt="加班" className="front-icon-image" />;
      case 'calendar-check':
        return <img src={applyIcon} alt="請假" className="front-icon-image" />;
      case 'money':
        return <img src={salaryIcon} alt="薪資" className="front-icon-image" />;
      case 'file-check':
        return <img src={approvingIcon} alt="簽核系統" className="front-icon-image" />;
      case 'calendar':
        return <img src={schedulingIcon} alt="排班" className="front-icon-image" />;
      case 'megaphone':
        return <img src={announcementIcon} alt="公告" className="front-icon-image" />;
      case 'message':
        return <img src={messageIcon} alt="訊息" className="front-icon-image" />;
      default:
        return null;
    }
  };

  // 🔥 修正：處理功能按鈕點擊 - 加入權限檢查
  const handleButtonClick = (route, requiredRoles, buttonId, disabled, permissionBased = false) => {
    // 🔥 如果是簽核系統且無權限，顯示提示
    if (buttonId === 'approval' && !hasApprovalPermission) {
      alert('您沒有簽核系統的使用權限');
      
      // 通知 Flutter 權限不足
      if (isFlutterEnvironment) {
        sendMessageToFlutter('permissionDenied', {
          buttonId: 'approval',
          message: '您沒有簽核系統的使用權限',
          route: route
        });
      }
      return;
    }

    const result = handleFunctionButtonClick({
      route,
      requiredRoles,
      buttonId,
      disabled,
      jobGrade,
      authToken,
      sendMessageToFlutter,
      isFlutterEnvironment
    });
    
    // 執行導航
    executeNavigation(result);
  };

  // 處理個人資料卡點擊
  const handleProfileCardClick = () => {
    console.log('導航到個人資料頁面');
    
    // 檢查 token 是否存在
    if (!authToken) {
      console.log('警告: 導航到個人資料頁面時缺少認證 token，可能會影響頁面功能');
      
      // 通知 Flutter token 不存在
      if (isFlutterEnvironment) {
        sendMessageToFlutter('navigationWarning', { 
          message: '缺少認證 token，可能會影響個人資料頁面的功能',
          code: 'MISSING_AUTH_TOKEN',
          route: '/personaldata01',
          buttonId: 'profile'
        });
      }
    }
    
    // 通知 Flutter 即將導航到個人資料頁面
    if (isFlutterEnvironment) {
      sendMessageToFlutter('navigate', { 
        route: '/personaldata01',
        buttonId: 'profile',
        hasToken: !!authToken
      });
    }
    
    window.location.href = '/personaldata01';
  };

  // 處理首頁圖標點擊
  const handleHomeClick = () => {
    console.log('重新載入首頁');
    
    // 通知 Flutter 即將重新載入首頁
    if (isFlutterEnvironment) {
      sendMessageToFlutter('refresh', {
        hasToken: !!authToken
      });
    }
    
    window.location.reload();
  };

  // 簡化的健康檢查 - 只在資料讀取失敗時重試
  useEffect(() => {
    if (!cookiesReady) return;
    
    const healthCheckInterval = setInterval(() => {
      const nameElement = document.querySelector('.front-user-name');
      
      // 只有在明確的錯誤狀態才重新獲取資料
      if (nameElement && nameElement.textContent === '資料讀取失敗') {
        console.log('檢測到資料讀取失敗，嘗試重新獲取');
        const company_id = Cookies.get('company_id');
        const employee_id = Cookies.get('employee_id');
        const auth_token = Cookies.get('auth_xtbb');
        
        if (company_id && employee_id && auth_token) {
          getEmployeeInfoAndCheckToken(company_id, employee_id, auth_token);
        }
      }
    }, 5 * 60 * 1000); // 5分鐘檢查一次
    
    return () => clearInterval(healthCheckInterval);
  }, [cookiesReady]);

  // 如果還在載入中，顯示載入畫面
  if (isLoading || !cookiesReady || approvalPermissionLoading) {
    return (
      <div className="front-container">
        <div className="front-app-wrapper">
          <div className="front-loading-container">
            <div className="front-loading-spinner"></div>
            <div className="front-loading-text">
              {approvalPermissionLoading ? '檢查權限中...' : '載入中...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="front-container">
      <div className="front-app-wrapper">
        {/* 頁面標題 */}
        <header className="front-header">
          <div className="front-page-title">首頁</div>
          {/* 登出按鈕 */}
          <button className="front-logout-button" onClick={handleLogout}>
            登出
          </button>
        </header>

        <div className="front-content">
          {/* 個人資訊卡 */}
          <div 
            className="front-profile-card" 
            onClick={handleProfileCardClick}
          >
            <div className="front-company-name">{companyName || '未設定公司'}</div>
            <div className="front-department-info">
              {department || '無部門資訊'}<br />
              {position || '無職稱資訊'}
            </div>
            <div className="front-user-info-row">
              <div className="front-user-name">{userName || '未登入'}</div>
              <div className="front-user-number">{employeeId || 'N/A'}</div>
            </div>
          </div>

          {/* 佔位圖像 */}
          <div className="front-placeholder-image">
            <div className="front-cross-line">
              <div className="front-line1"></div>
              <div className="front-line2"></div>
            </div>
          </div>

          {/* 🔥 修正：功能按鈕網格 - 加入權限檢查 */}
          <div className="front-functions-grid">
            {functionButtons.map((button) => (
              <div 
                key={button.id} 
                className={`front-function-button ${button.disabled ? 'disabled' : ''}`}
                onClick={() => handleButtonClick(
                  button.route, 
                  button.requiredRoles, 
                  button.id, 
                  button.disabled,
                  button.permissionBased
                )}
              >
                <div className="front-function-icon">
                  {renderIcon(button.icon)}
                  {button.notifications > 0 && (
                    <div className="front-notification-badge">{button.notifications}</div>
                  )}
                </div>
                <div className="front-function-text">{button.text}</div>
                {/* 🔥 修正：添加權限相關標示 */}
                {button.disabled && (
                  <div className="front-development-badge">
                    {button.id === 'approval' && button.permissionBased ? '無權限' : '開發中'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
