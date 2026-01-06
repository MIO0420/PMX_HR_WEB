// import React, { useState, useEffect } from 'react';
// // 移除 React Router 相關依賴
// // 修改匯入來源，從各自的檔案匯入
// import { OvertimeContent } from '../Table_sheet/OvertimeAudit';
// import { CardReplenishContent } from '../Table_sheet/CardReplenishAudit';
// import { LeaveContent } from '../Table_sheet/LeaveAudit';
// import './css/AuditSystem.css';
// import homeIcon from '../Google_sheet/HomePageImage/homepage.png'; // 引入首頁圖標

// function AuditSystem() {
//   const [companyId, setCompanyId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [currentTime, setCurrentTime] = useState('');
//   const [currentView, setCurrentView] = useState('main'); // 'main', 'overtime', 'replenish', 'leave'
//   const [activeTab, setActiveTab] = useState('總覽');
//   const [isApp, setIsApp] = useState(false);
//   const [loading, setLoading] = useState(true);
//   // 移除 useNavigate hook

//   // 從 cookies 獲取認證資訊並驗證
//   useEffect(() => {
//     const validateUserFromCookies = async () => {
//       try {
//         setLoading(true);
        
//         // 從 cookies 獲取認證資訊
//         const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//           const [key, value] = cookie.split('=');
//           acc[key] = value;
//           return acc;
//         }, {});
        
//         // 檢查是否有必要的 cookies
//         const cookieCompanyId = cookies.company_id;
//         const cookieEmployeeId = cookies.employee_id;
//         const cookiePassword = cookies.password;
        
//         console.log('從 cookies 獲取的認證資訊:', {
//           company_id: cookieCompanyId,
//           employee_id: cookieEmployeeId,
//           password: cookiePassword ? '已設置' : '未設置'
//         });
        
//         if (!cookieCompanyId || !cookieEmployeeId || !cookiePassword) {
//           console.log('cookies 中缺少認證資訊，跳轉到登入頁面');
//           window.location.href = '/applogin01/';
//           return;
//         }
        
//         // 調用 API 進行驗證
//         const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             company_id: cookieCompanyId,
//             employee_id: cookieEmployeeId,
//             password: cookiePassword
//           })
//         });
        
//         const data = await response.json();
        
//         if (response.ok && data.Status === "Ok") {
//           console.log('API 驗證成功:', data);
          
//           // 設置狀態中的公司和員工 ID
//           setCompanyId(cookieCompanyId);
//           setEmployeeId(cookieEmployeeId);
          
//           // 繼續加載頁面
//           console.log('認證成功，繼續加載頁面');
//         } else {
//           console.error('API 驗證失敗:', data);
//           // 驗證失敗，跳轉到登入頁面
//           window.location.href = '/applogin01/';
//         }
//       } catch (error) {
//         console.error('驗證過程中發生錯誤:', error);
//         // 發生錯誤，跳轉到登入頁面
//         window.location.href = '/applogin01/';
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     validateUserFromCookies();
//   }, []); // 移除 navigate 依賴

//   // 檢測是否為 App 發出的請求
//   useEffect(() => {
//     const userAgent = window.navigator.userAgent;
//     const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
//     setIsApp(isFlutterApp);
//   }, []);

//   // 更新右上角時間
//   // useEffect(() => {
//   //   const updateClock = () => {
//   //     const now = new Date();
//   //     const hours = String(now.getHours()).padStart(2, '0');
//   //     const minutes = String(now.getMinutes()).padStart(2, '0');
//   //     setCurrentTime(`${hours}:${minutes}`);
//   //   };
//   //   updateClock();
//   //   const timer = setInterval(updateClock, 1000);
//   //   return () => clearInterval(timer);
//   // }, []);

//   // 處理回到首頁的邏輯
//   const handleHomeClick = () => {
//     // 檢查是否為手機 app 環境
//     const isInMobileApp = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const isApp = urlParams.get('platform') === 'app';
      
//       const userAgent = navigator.userAgent.toLowerCase();
//       const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
//       const hasFlutterContext = 
//         typeof window.flutter !== 'undefined' || 
//         typeof window.FlutterNativeWeb !== 'undefined';
        
//       return isApp || hasFlutterAgent || hasFlutterContext;
//     };

//     if (isInMobileApp()) {
//       // 如果是 app 環境，使用 Flutter 的導航方法
//       console.log('檢測到 App 環境，使用 Flutter 導航');
      
//       try {
//         // 嘗試調用 Flutter 提供的導航方法
//         if (window.flutter && window.flutter.postMessage) {
//           window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
//         } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
//           window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
//         } else {
//           // 發送自定義事件，Flutter 可以監聽此事件
//           const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
//             detail: { action: 'navigate_home' }
//           });
//           document.dispatchEvent(event);
//         }
//       } catch (err) {
//         console.error('無法使用 Flutter 導航:', err);
//         // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用普通導航
//         window.location.href = '/frontpage01';
//       }
//     } else {
//       // 如果是瀏覽器環境，使用 window.location.href 導航
//       console.log('瀏覽器環境，使用 window.location.href 導航');
//       window.location.href = '/frontpage01';
//     }
//   };

//   const handleNavigate = (view) => {
//     setCurrentView(view);
//     setActiveTab('總覽'); // 切換視圖時重置標籤
//   };

//   const handleGoHome = () => {
//     setCurrentView('main');
//   };

//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };

//   // 處理新增加班申請按鈕
//   const handleNewOvertimeRequest = () => {
//     // 使用 window.location.href 替代 navigate
//     window.location.href = "/workovertimeapply";
//   };

//   // 處理新增補卡申請按鈕
//   const handleNewCardReplenishRequest = () => {
//     // 使用 window.location.href 替代 navigate
//     window.location.href = "/cardreplenishapply";
//   };

//   // 處理新增請假申請按鈕
//   const handleNewLeaveRequest = () => {
//     // 使用 window.location.href 替代 navigate
//     window.location.href = "/leaveapply";
//   };

//   // 主頁面視圖
//   const renderMainView = () => (
//     <>
//       <header className="audit-header">
//         <div className="audit-home-icon" onClick={handleHomeClick}>
//           <img src={homeIcon} alt="首頁" width="20" height="20" />
//         </div>
//         <div className="audit-page-title">簽核系統</div>
//         <div className="audit-time-display">{currentTime}</div>
//       </header>

//       {/* 顯示公司和員工資訊 */}
//       {/* <div className="audit-server-info">
//         公司ID: {companyId || '未設定'} | 員工ID: {employeeId || '未設定'}
//       </div> */}

//       {/* 選單內容 */}
//       <div className="audit-menu-container">
//         {/* 加班選項 */}
//         <div className="audit-menu-item" onClick={() => handleNavigate('overtime')}>
//           <div className="audit-menu-item-left">
//             <div className="audit-menu-icon">
//               <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
//                 <path d="M17 12H12V7" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="audit-menu-text">加班</div>
//           </div>

//         </div>

//         {/* 補卡選項 */}
//         <div className="audit-menu-item" onClick={() => handleNavigate('replenish')}>
//           <div className="audit-menu-item-left">
//             <div className="audit-menu-icon">
//               <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
//                 <path d="M12 6V12L16 14" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div className="audit-menu-text">補卡</div>
//           </div>
          
//         </div>

//         {/* 請假選項 */}
//         <div className="audit-menu-item" onClick={() => handleNavigate('leave')}>
//           <div className="audit-menu-item-left">
//             <div className="audit-menu-icon">
//               <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3a75b5" strokeWidth="2"/>
//                 <path d="M16 2V6" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round"/>
//                 <path d="M8 2V6" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round"/>
//                 <path d="M3 10H21" stroke="#3a75b5" strokeWidth="2"/>
//               </svg>
//             </div>
//             <div className="audit-menu-text">請假</div>
//           </div>
          
//         </div>
//       </div>
//     </>
//   );

//   // 根據當前視圖渲染不同內容
//   const renderContent = () => {
//     // 如果還在載入中，顯示載入畫面
//     if (loading) {
//       return (
//         <div className="audit-loading-container">
//           <div>載入中...</div>
//           <div className="audit-loading-text">正在驗證用戶資訊</div>
//         </div>
//       );
//     }

//     switch (currentView) {
//       case 'overtime':
//         return (
//           <OvertimeContent
//             activeTab={activeTab}
//             handleTabClick={handleTabClick}
//             handleNewOvertimeRequest={handleNewOvertimeRequest}
//             handleBackToAuditSystem={handleGoHome}
//             currentTime={currentTime}
//             handleHomeClick={handleHomeClick}
//             companyId={companyId}
//             employeeId={employeeId}
//           />
//         );
//       case 'replenish':
//         return (
//           <CardReplenishContent
//             activeTab={activeTab}
//             handleTabClick={handleTabClick}
//             handleNewCardReplenishRequest={handleNewCardReplenishRequest}
//             handleBackToAuditSystem={handleGoHome}
//             currentTime={currentTime}
//             handleHomeClick={handleHomeClick}
//             companyId={companyId}
//             employeeId={employeeId}
//           />
//         );
//       case 'leave':
//         return (
//           <LeaveContent
//             activeTab={activeTab}
//             handleTabClick={handleTabClick}
//             handleNewLeaveRequest={handleNewLeaveRequest}
//             handleBackToAuditSystem={handleGoHome}
//             currentTime={currentTime}
//             handleHomeClick={handleHomeClick}
//             companyId={companyId}
//             employeeId={employeeId}
//           />
//         );
//       default:
//         return renderMainView();
//     }
//   };

//   return (
//     <div className="audit-container">
//       <div className="audit-app-wrapper">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default AuditSystem;
import React, { useState, useEffect } from 'react';
// 移除 React Router 相關依賴
// 修改匯入來源，從各自的檔案匯入
import { OvertimeContent } from '../Table_sheet/OvertimeAudit';
import { CardReplenishContent } from '../Table_sheet/CardReplenishAudit';
import { LeaveContent } from '../Table_sheet/LeaveAudit';
import './css/AuditSystem.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png'; // 引入首頁圖標

function AuditSystem() {
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [currentTime, setCurrentTime] = useState('');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'overtime', 'replenish', 'leave'
  const [activeTab, setActiveTab] = useState('總覽');
  const [isApp, setIsApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');
  // 移除 useNavigate hook

  // 從 cookies 獲取認證資訊並驗證
  useEffect(() => {
    const validateUserFromCookies = async () => {
      try {
        setLoading(true);
        
        // 從 cookies 獲取認證資訊
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        }, {});
        
        // 檢查是否有必要的 cookies
        const cookieCompanyId = cookies.company_id;
        const cookieEmployeeId = cookies.employee_id;
        const cookieAuthToken = cookies.auth_xtbb;
        
        console.log('從 cookies 獲取的認證資訊:', {
          company_id: cookieCompanyId,
          employee_id: cookieEmployeeId,
          auth_xtbb: cookieAuthToken ? '已設置' : '未設置'
        });
        
        if (!cookieCompanyId || !cookieEmployeeId || !cookieAuthToken) {
          console.log('cookies 中缺少認證資訊，跳轉到登入頁面');
          window.location.href = '/applogin01/';
          return;
        }
        
        // 存儲 token 到 state 中
        setAuthToken(cookieAuthToken);
        console.log('已設置 auth_xtbb 到狀態中');
        
        // 調用 API 進行驗證
        const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookieAuthToken}` // 使用 auth_xtbb token 進行驗證
          },
          body: JSON.stringify({
            company_id: cookieCompanyId,
            employee_id: cookieEmployeeId
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.Status === "Ok") {
          console.log('API 驗證成功:', data);
          
          // 設置狀態中的公司和員工 ID
          setCompanyId(cookieCompanyId);
          setEmployeeId(cookieEmployeeId);
          
          // 繼續加載頁面
          console.log('認證成功，繼續加載頁面');
        } else {
          console.error('API 驗證失敗:', data);
          // 驗證失敗，跳轉到登入頁面
          window.location.href = '/applogin01/';
        }
      } catch (error) {
        console.error('驗證過程中發生錯誤:', error);
        // 發生錯誤，跳轉到登入頁面
        window.location.href = '/applogin01/';
      } finally {
        setLoading(false);
      }
    };
    
    validateUserFromCookies();
  }, []); // 移除 navigate 依賴

  // 檢測是否為 App 發出的請求
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
    setIsApp(isFlutterApp);
  }, []);

  // 更新右上角時間
  // useEffect(() => {
  //   const updateClock = () => {
  //     const now = new Date();
  //     const hours = String(now.getHours()).padStart(2, '0');
  //     const minutes = String(now.getMinutes()).padStart(2, '0');
  //     setCurrentTime(`${hours}:${minutes}`);
  //   };
  //   updateClock();
  //   const timer = setInterval(updateClock, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // 處理回到首頁的邏輯
  const handleHomeClick = () => {
    // 檢查是否為手機 app 環境
    const isInMobileApp = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isApp = urlParams.get('platform') === 'app';
      
      const userAgent = navigator.userAgent.toLowerCase();
      const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
      
      const hasFlutterContext = 
        typeof window.flutter !== 'undefined' || 
        typeof window.FlutterNativeWeb !== 'undefined';
        
      return isApp || hasFlutterAgent || hasFlutterContext;
    };

    if (isInMobileApp()) {
      // 如果是 app 環境，使用 Flutter 的導航方法
      console.log('檢測到 App 環境，使用 Flutter 導航');
      
      try {
        // 嘗試調用 Flutter 提供的導航方法
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else {
          // 發送自定義事件，Flutter 可以監聽此事件
          const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
            detail: { action: 'navigate_home' }
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error('無法使用 Flutter 導航:', err);
        // 備用方案：可能在 app 中但無法使用 Flutter 方法，使用普通導航
        window.location.href = '/frontpage01';
      }
    } else {
      // 如果是瀏覽器環境，使用 window.location.href 導航
      console.log('瀏覽器環境，使用 window.location.href 導航');
      window.location.href = '/frontpage01';
    }
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setActiveTab('總覽'); // 切換視圖時重置標籤
  };

  const handleGoHome = () => {
    setCurrentView('main');
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 處理新增加班申請按鈕
  const handleNewOvertimeRequest = () => {
    // 使用 window.location.href 替代 navigate
    window.location.href = "/workovertimeapply";
  };

  // 處理新增補卡申請按鈕
  const handleNewCardReplenishRequest = () => {
    // 使用 window.location.href 替代 navigate
    window.location.href = "/cardreplenishapply";
  };

  // 處理新增請假申請按鈕
  const handleNewLeaveRequest = () => {
    // 使用 window.location.href 替代 navigate
    window.location.href = "/leaveapply";
  };

  // 主頁面視圖
  const renderMainView = () => (
    <>
      <header className="audit-header">
        <div className="audit-home-icon" onClick={handleHomeClick}>
          <img src={homeIcon} alt="首頁" width="20" height="20" />
        </div>
        <div className="audit-page-title">簽核系統</div>
        <div className="audit-time-display">{currentTime}</div>
      </header>

      {/* 顯示公司和員工資訊 */}
      {/* <div className="audit-server-info">
        公司ID: {companyId || '未設定'} | 員工ID: {employeeId || '未設定'}
      </div> */}

      {/* 選單內容 */}
      <div className="audit-menu-container">
        {/* 加班選項 */}
        <div className="audit-menu-item" onClick={() => handleNavigate('overtime')}>
          <div className="audit-menu-item-left">
            <div className="audit-menu-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
                <path d="M17 12H12V7" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="audit-menu-text">加班</div>
          </div>

        </div>

        {/* 補卡選項 */}
        <div className="audit-menu-item" onClick={() => handleNavigate('replenish')}>
          <div className="audit-menu-item-left">
            <div className="audit-menu-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="audit-menu-text">補卡</div>
          </div>
          
        </div>

        {/* 請假選項 */}
        <div className="audit-menu-item" onClick={() => handleNavigate('leave')}>
          <div className="audit-menu-item-left">
            <div className="audit-menu-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3a75b5" strokeWidth="2"/>
                <path d="M16 2V6" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 2V6" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 10H21" stroke="#3a75b5" strokeWidth="2"/>
              </svg>
            </div>
            <div className="audit-menu-text">請假</div>
          </div>
          
        </div>
      </div>
    </>
  );

  // 根據當前視圖渲染不同內容
  const renderContent = () => {
    // 如果還在載入中，顯示載入畫面
    if (loading) {
      return (
        <div className="audit-loading-container">
          <div>載入中...</div>
          <div className="audit-loading-text">正在驗證用戶資訊</div>
        </div>
      );
    }

    switch (currentView) {
      case 'overtime':
        return (
          <OvertimeContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            handleNewOvertimeRequest={handleNewOvertimeRequest}
            handleBackToAuditSystem={handleGoHome}
            currentTime={currentTime}
            handleHomeClick={handleHomeClick}
            companyId={companyId}
            employeeId={employeeId}
            authToken={authToken}
          />
        );
      case 'replenish':
        return (
          <CardReplenishContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            handleNewCardReplenishRequest={handleNewCardReplenishRequest}
            handleBackToAuditSystem={handleGoHome}
            currentTime={currentTime}
            handleHomeClick={handleHomeClick}
            companyId={companyId}
            employeeId={employeeId}
            authToken={authToken}
          />
        );
      case 'leave':
        return (
          <LeaveContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            handleNewLeaveRequest={handleNewLeaveRequest}
            handleBackToAuditSystem={handleGoHome}
            currentTime={currentTime}
            handleHomeClick={handleHomeClick}
            companyId={companyId}
            employeeId={employeeId}
            authToken={authToken}
          />
        );
      default:
        return renderMainView();
    }
  };

  return (
    <div className="audit-container">
      <div className="audit-app-wrapper">
        {renderContent()}
      </div>
    </div>
  );
}

export default AuditSystem;
