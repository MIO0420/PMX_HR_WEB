import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // 需要安裝: npm install js-cookie

function FrontPage() {
  const [currentTime, setCurrentTime] = useState('--:--');
  const [userInfo, setUserInfo] = useState({
    companyName: '同鑫合立股份有限公司',
    department: '業務部',
    position: '業務專員',
    name: '朱彥光',
    employeeId: '15884'
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // 檢查用戶是否已登入
  useEffect(() => {
    const checkAuthentication = async () => {
      // 從 Cookies 獲取 token
      const accessToken = Cookies.get('access_token');
      
      // 如果沒有 token，則重定向到登入頁面
      if (!accessToken) {
        console.log('未檢測到登入狀態，重定向到登入頁面');
        // 使用 window.location.href 替代 navigate 以觸發實際的 URL 變化
        window.location.href = '/applogin'; // 使用絕對路徑更佳，例如：'https://yourdomain.com/applogin'
        return;
      }
      
      try {
        // 使用 userinfo API 驗證 token 是否有效
        const response = await fetch('https://identityprovider.54ucl.com:1989/userinfo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // 如果回傳 401 Unauthorized，表示 token 失效
          if (response.status === 401) {
            console.log('Token 已失效，需要重新登入');
            // 清除所有認證相關的 Cookies
            handleLogout();
            return;
          }
          throw new Error(`API 請求失敗: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('用戶資訊驗證成功:', data);
        
        // 如果有需要，可以從後端獲取更多用戶詳細信息
        // 這裡可以添加獲取用戶詳細信息的邏輯
        
        // 如果有 employeeId 在 Cookies 中，可以使用它
        const employeeId = Cookies.get('employee_id');
        if (employeeId) {
          console.log('已檢測到用戶 ID:', employeeId);
          // 可以根據 employeeId 更新用戶信息
          // 這裡可以添加從後端獲取用戶詳細信息的邏輯
        }
        
      } catch (error) {
        console.error('驗證用戶狀態時出錯:', error);
        // 如果是網絡錯誤等非授權問題，可以選擇不登出用戶
        // 但如果確定是授權問題，應該登出用戶
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, [navigate]);
  
  // 更新當前時間
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 每分鐘更新一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 處理功能按鈕點擊
  const handleButtonClick = (route) => {
    // 使用 window.location.href 替代 navigate
    // 可以選擇添加時間戳參數以確保 URL 變化被偵測
    window.location.href = `${route}?t=${Date.now()}`;
  };
  
  // 處理登出
  const handleLogout = () => {
    // 清除所有認證相關的 Cookies
    Cookies.remove('access_token');
    Cookies.remove('id_token');
    Cookies.remove('refresh_token');
    Cookies.remove('employee_id');
    
    // 清除 localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('employee_id');
    
    // 通知 Flutter WebView (如果有此功能)
    if (window.flutter_inappwebview) {
      try {
        window.flutter_inappwebview.callHandler('onLogout');
      } catch (e) {
        console.log('Flutter 通信失敗:', e);
      }
    }
    
    // 重定向到登入頁面，使用 window.location.href 替代 navigate
    window.location.href = '/applogin';
  };
  
  // 樣式定義
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
    appWrapper: {
      width: '100%',
      maxWidth: '360px',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3a75b5',
      color: 'white',
      padding: '0 16px',
      height: '50px',
      width: '100%',
      boxSizing: 'border-box',
    },
    homeIcon: {
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    timeDisplay: {
      fontSize: '16px',
      color: '#FFFFFF',
    },
    pageTitle: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      flex: 1,
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    },
    profileCard: {
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      margin: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    companyName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
    },
    departmentInfo: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '16px',
    },
    userInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
    },
    userNumber: {
      fontSize: '16px',
      color: '#333',
    },
    placeholderImage: {
      width: '100%',
      height: '180px',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '16px',
      marginBottom: '16px',
    },
    crossLine: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    line1: {
      position: 'absolute',
      top: '0',
      left: '50%',
      width: '1px',
      height: '100%',
      backgroundColor: '#ddd',
      transform: 'rotate(45deg)',
      transformOrigin: 'top',
    },
    line2: {
      position: 'absolute',
      top: '0',
      right: '50%',
      width: '1px',
      height: '100%',
      backgroundColor: '#ddd',
      transform: 'rotate(-45deg)',
      transformOrigin: 'top',
    },
    functionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1px',
      backgroundColor: '#eee',
      borderTop: '1px solid #eee',
    },
    functionButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 0',
      backgroundColor: '#fff',
      cursor: 'pointer',
      position: 'relative',
    },
    functionIcon: {
      width: '24px',
      height: '24px',
      color: '#3a75b5',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    functionText: {
      fontSize: '14px',
      color: '#333',
    },
    notificationBadge: {
      position: 'absolute',
      top: '12px',
      right: '25%',
      backgroundColor: '#ff4d4f',
      color: 'white',
      fontSize: '12px',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutButton: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '5px 10px',
      fontSize: '12px',
      color: '#666',
      cursor: 'pointer',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1000,
    },
    loadingText: {
      fontSize: '16px',
      color: '#3a75b5',
    },
  };

  // 功能按鈕數據 - 更新路由路徑
  const functionButtons = [
    { id: 'punch', icon: 'clipboard', text: '打卡', route: '/checkin', notifications: 0 },
    { id: 'makeup', icon: 'clock', text: '補卡', route: '/replenish', notifications: 0 },
    { id: 'overtime', icon: 'time-add', text: '加班', route: '/workovertime', notifications: 0 },
    { id: 'leave', icon: 'calendar-check', text: '請假', route: '/leave', notifications: 0 },
    { id: 'salary', icon: 'money', text: '薪資', route: '/salary', notifications: 0 },
    { id: 'approval', icon: 'file-check', text: '簽核系統', route: '/auditsystem', notifications: 0 },
    { id: 'schedule', icon: 'calendar', text: '排班', route: '/schedule', notifications: 0 },
    { id: 'announcement', icon: 'megaphone', text: '公告', route: '/announcement', notifications: 1 },
    { id: 'message', icon: 'message', text: '訊息', route: '/message', notifications: 1 },
  ];

  // 渲染功能圖標
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'clipboard':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          </svg>
        );
      case 'clock':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'time-add':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
      case 'calendar-check':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      case 'money':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case 'file-check':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15l2 2 4-4" />
          </svg>
        );
      case 'calendar':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      case 'megaphone':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l18-5v12L3 14v-3z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
        );
      case 'message':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 如果正在加載中，顯示加載指示器
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.appWrapper}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* 頁面標題與時間 - 使用與 Checkin 組件一致的房子圖標 */}
        <header style={styles.header}>
          <div style={styles.homeIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div style={styles.pageTitle}>首頁</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        <div style={styles.content}>
          {/* 個人資訊卡 */}
          <div style={styles.profileCard}>
            <div style={styles.companyName}>{userInfo.companyName}</div>
            <div style={styles.departmentInfo}>{userInfo.department} {userInfo.position}</div>
            <div style={styles.userInfoRow}>
              <div style={styles.userName}>{userInfo.name}</div>
              <div style={styles.userNumber}>{userInfo.employeeId}</div>
            </div>
          </div>

          {/* 佔位圖像 */}
          <div style={styles.placeholderImage}>
            <div style={styles.crossLine}>
              <div style={styles.line1}></div>
              <div style={styles.line2}></div>
            </div>
          </div>

          {/* 功能按鈕網格 */}
          <div style={styles.functionsGrid}>
            {functionButtons.map((button) => (
              <div 
                key={button.id} 
                style={styles.functionButton}
                onClick={() => handleButtonClick(button.route)}
              >
                <div style={styles.functionIcon}>
                  {renderIcon(button.icon)}
                  {button.notifications > 0 && (
                    <div style={styles.notificationBadge}>{button.notifications}</div>
                  )}
                </div>
                <div style={styles.functionText}>{button.text}</div>
              </div>
            ))}
          </div>
          
          {/* 登出按鈕 */}
          <button 
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
