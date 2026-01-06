// import { useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Cookies from 'js-cookie';

// export const useAuth = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const hasCheckedRef = useRef(false);
//   const cookieCacheRef = useRef({}); // 🔥 Cookie 緩存

//   useEffect(() => {
//     // 🔥 避免在登入頁面檢查
//     if (location.pathname === '/login' || location.pathname === '/applogin') {
//       return;
//     }

//     // 🔥 檢查 auth_xtbb token 而不是員工編號
//     const timer = setTimeout(() => {
//       if (hasCheckedRef.current) {
//         return;
//       }

//       const checkAuth = () => {
//         const authToken = getCookie('auth_xtbb');
//         const employeeId = getCookie('employee_id');
//         const companyId = getCookie('company_id');
        
//         console.log('🔍 檢查身份驗證狀態:', {
//           auth_xtbb: authToken ? authToken.substring(0, 20) + '...' : '未找到',
//           employee_id: employeeId || '未找到',
//           company_id: companyId || '未找到'
//         });
        
//         // 🔥 主要檢查：必須有 auth_xtbb token
//         if (!authToken) {
//           console.log('🔥 未找到 auth_xtbb token，重新導向登入頁面');
//           hasCheckedRef.current = true;
//           navigate('/login', { replace: true });
//           return false;
//         }
        
//         // 🔥 次要檢查：最好也要有員工編號和公司ID
//         if (!employeeId || !companyId) {
//           console.log('⚠️ 警告：找到 auth_xtbb 但缺少員工編號或公司ID');
//           console.log('🔥 為安全起見，重新導向登入頁面');
//           hasCheckedRef.current = true;
//           navigate('/login', { replace: true });
//           return false;
//         }
        
//         console.log('✅ 身份驗證成功 - Token 有效');
//         hasCheckedRef.current = true;
//         return true;
//       };

//       checkAuth();
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [navigate, location.pathname]);

//   const logout = () => {
//     // 🔥 更完整的 Cookie 清除列表
//     const cookies = [
//       'auth_xtbb', 'company_id', 'employee_id', 
//       'user_name', 'employee_name', 'name',
//       'job_grade', 'department', 'position', 
//       'company_name', 'login_time'
//     ];
    
//     console.log('🔥 開始清除所有 cookies...');
    
//     cookies.forEach(cookieName => {
//       // 🔥 使用 js-cookie 清除
//       Cookies.remove(cookieName, { path: '/' });
//       Cookies.remove(cookieName, { path: '/', domain: 'rabbit.54ucl.com' });
//       Cookies.remove(cookieName, { path: '/', domain: '.54ucl.com' });
//       Cookies.remove(cookieName, { path: '/', domain: '163.18.4.245' }); // 🔥 新增 IP 域名
      
//       // 🔥 原生方法清除
//       document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//       document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=rabbit.54ucl.com;`;
//       document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.54ucl.com;`;
//       document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=163.18.4.245;`;
      
//       console.log(`🗑️ 已清除 Cookie: ${cookieName}`);
//     });
    
//     // 🔥 清除緩存
//     cookieCacheRef.current = {};
    
//     // 🔥 驗證清除結果
//     setTimeout(() => {
//       const remainingToken = getCookie('auth_xtbb');
//       if (remainingToken) {
//         console.warn('⚠️ auth_xtbb 清除可能不完整，強制清除');
//         // 強制清除所有可能的域名和路徑組合
//         const domains = ['', 'rabbit.54ucl.com', '.54ucl.com', '163.18.4.245'];
//         const paths = ['/', '/homepage', '/permissions'];
        
//         domains.forEach(domain => {
//           paths.forEach(path => {
//             if (domain) {
//               document.cookie = `auth_xtbb=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
//             } else {
//               document.cookie = `auth_xtbb=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
//             }
//           });
//         });
//       } else {
//         console.log('✅ auth_xtbb 已成功清除');
//       }
//     }, 100);
    
//     console.log('🔥 已清除所有 cookies，重新導向登入頁面');
//     hasCheckedRef.current = false;
//     navigate('/login', { replace: true });
//   };

//   // 🔥 簡化的 getCookie 函數
//   const getCookie = (name) => {
//     // 🔥 檢查緩存
//     if (cookieCacheRef.current[name]) {
//       console.log(`🔍 從緩存獲取 ${name}:`, 
//         name === 'auth_xtbb' ? 
//         cookieCacheRef.current[name].substring(0, 20) + '...' : 
//         cookieCacheRef.current[name]
//       );
//       return cookieCacheRef.current[name];
//     }

//     console.log(`🔍 首次獲取 Cookie: ${name}`);

//     // 🔥 優先使用 js-cookie
//     const cookieValue = Cookies.get(name);
//     if (cookieValue) {
//       console.log(`🔍 js-cookie getCookie(${name}):`, 
//         name === 'auth_xtbb' ? 
//         cookieValue.substring(0, 20) + '...' : 
//         cookieValue
//       );
      
//       // 🔥 緩存結果
//       cookieCacheRef.current[name] = cookieValue;
//       return cookieValue;
//     }

//     // 🔥 備用：原生方法
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       const fallbackValue = parts.pop().split(';').shift();
//       if (fallbackValue) {
//         console.log(`🔍 原生方法 getCookie(${name}):`, 
//           name === 'auth_xtbb' ? 
//           fallbackValue.substring(0, 20) + '...' : 
//           fallbackValue
//         );
        
//         // 🔥 緩存結果
//         cookieCacheRef.current[name] = fallbackValue;
//         return fallbackValue;
//       }
//     }

//     console.log(`🔍 getCookie(${name}): 未找到`);
//     return null;
//   };

//   // 🔥 修改：檢查是否有有效的身份驗證（基於 auth_xtbb token）
//   const hasValidAuth = () => {
//     const authToken = getCookie('auth_xtbb');
//     const employeeId = getCookie('employee_id');
//     const companyId = getCookie('company_id');
    
//     // 🔥 主要條件：必須有 auth_xtbb
//     const hasToken = !!authToken;
//     // 🔥 次要條件：最好也有員工編號和公司ID
//     const hasBasicInfo = !!(employeeId && companyId);
    
//     const result = hasToken && hasBasicInfo;
    
//     console.log('🔍 hasValidAuth 檢查結果:', {
//       hasToken,
//       hasBasicInfo,
//       finalResult: result,
//       authToken: authToken ? authToken.substring(0, 20) + '...' : '無',
//       employeeId: employeeId || '無',
//       companyId: companyId || '無'
//     });
    
//     return result;
//   };

//   // 🔥 新增：僅檢查 token 的函數
//   const hasValidToken = () => {
//     const authToken = getCookie('auth_xtbb');
//     const result = !!authToken;
    
//     console.log('🔍 hasValidToken 檢查結果:', {
//       result,
//       token: authToken ? authToken.substring(0, 20) + '...' : '無'
//     });
    
//     return result;
//   };

//   // 🔥 新增：檢查 token 是否即將過期（可選功能）
//   const isTokenExpiringSoon = () => {
//     const loginTime = getCookie('login_time');
//     if (!loginTime) return false;
    
//     try {
//       const loginDate = new Date(loginTime);
//       const now = new Date();
//       const diffHours = (now - loginDate) / (1000 * 60 * 60);
      
//       // 如果登入超過 2.5 小時，認為即將過期（總共 3 小時）
//       const isExpiringSoon = diffHours > 2.5;
      
//       console.log('🔍 Token 過期檢查:', {
//         loginTime,
//         diffHours: diffHours.toFixed(2),
//         isExpiringSoon
//       });
      
//       return isExpiringSoon;
//     } catch (error) {
//       console.error('❌ Token 過期檢查錯誤:', error);
//       return false;
//     }
//   };

//   // 🔥 新增：刷新 token（如果後端支援）
//   const refreshToken = async () => {
//     try {
//       const companyId = getCookie('company_id');
//       const employeeId = getCookie('employee_id');
//       const currentToken = getCookie('auth_xtbb');
      
//       if (!companyId || !employeeId || !currentToken) {
//         console.log('🔥 刷新 token 失敗：缺少必要資訊');
//         return false;
//       }
      
//       // 這裡可以呼叫後端的 token 刷新 API
//       // const response = await axios.post('/api/refresh-token', { ... });
      
//       console.log('🔄 Token 刷新功能待實作');
//       return false;
//     } catch (error) {
//       console.error('❌ Token 刷新失敗:', error);
//       return false;
//     }
//   };

//   return { 
//     logout, 
//     getCookie, 
//     hasValidAuth,     // 🔥 檢查完整身份驗證（token + 基本資訊）
//     hasValidToken,    // 🔥 僅檢查 token
//     isTokenExpiringSoon, // 🔥 檢查 token 是否即將過期
//     refreshToken      // 🔥 刷新 token（待實作）
//   };
// };
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // 🔥 避免在登入頁面檢查
    if (location.pathname === '/login' || location.pathname === '/applogin') {
      return;
    }

    // 🔥 檢查 auth_xtbb token
    const timer = setTimeout(() => {
      if (hasCheckedRef.current) {
        return;
      }

      const checkAuth = () => {
        const authToken = getCookie('auth_xtbb');
        
        console.log('🔍 檢查 auth_xtbb token:', authToken ? '存在' : '不存在');
        
        // 🔥 簡單檢查：沒有 auth_xtbb token 就導向登入頁面
        if (!authToken) {
          console.log('🔥 未找到 auth_xtbb token，重新導向登入頁面');
          hasCheckedRef.current = true;
          navigate('/login', { replace: true });
          return false;
        }
        
        console.log('✅ 找到 auth_xtbb token，身份驗證通過');
        hasCheckedRef.current = true;
        return true;
      };

      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate, location.pathname]);

  const logout = () => {
    // 🔥 清除 cookies
    const cookies = [
      'auth_xtbb', 'company_id', 'employee_id', 
      'user_name', 'employee_name', 'name',
      'job_grade', 'department', 'position', 
      'company_name', 'login_time'
    ];
    
    console.log('🔥 開始清除所有 cookies...');
    
    cookies.forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
      Cookies.remove(cookieName, { path: '/', domain: 'rabbit.54ucl.com' });
      Cookies.remove(cookieName, { path: '/', domain: '.54ucl.com' });
      Cookies.remove(cookieName, { path: '/', domain: '163.18.4.245' });
      
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=rabbit.54ucl.com;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.54ucl.com;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=163.18.4.245;`;
    });
    
    console.log('🔥 已清除所有 cookies，重新導向登入頁面');
    hasCheckedRef.current = false;
    navigate('/login', { replace: true });
  };

  // 🔥 簡單的 getCookie 函數
  const getCookie = (name) => {
    return Cookies.get(name) || null;
  };

  // 🔥 簡單檢查是否有 auth_xtbb token
  const hasValidAuth = () => {
    const authToken = getCookie('auth_xtbb');
    return !!authToken;
  };

  return { 
    logout, 
    getCookie, 
    hasValidAuth
  };
};
