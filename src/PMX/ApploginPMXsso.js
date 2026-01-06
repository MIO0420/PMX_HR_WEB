// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// // 生成隨機的 state 參數用於防範 CSRF 攻擊
// function generateState() {
//     const array = new Uint8Array(16);
//     crypto.getRandomValues(array);
//     return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
// }

// // 儲存 state 到 sessionStorage 以便後續驗證
// function storeState(state) {
//     sessionStorage.setItem('oauth_state', state);
// }

// // SSO 登入重新導向函數
// function redirectToSSO() {
//     // 生成隨機 state
//     const state = generateState();
    
//     // 儲存 state
//     storeState(state);
    
//     // SSO 參數配置
//     const ssoConfig = {
//         authUrl: 'https://identityprovider.54ucl.com:1989/authorize',
//         responseType: 'code',
//         clientId: 'd612d8bc-2f85-4eb6-8a09-6ff7f5a910eb',
//         redirectUri: 'https://rabbit.54ucl.com:3004/callback',
//         scope: 'openid',
//         state: state
//     };
    
//     // 建構授權 URL
//     const params = new URLSearchParams({
//         response_type: ssoConfig.responseType,
//         client_id: ssoConfig.clientId,
//         redirect_uri: ssoConfig.redirectUri,
//         scope: ssoConfig.scope,
//         state: ssoConfig.state
//     });
    
//     const authUrl = `${ssoConfig.authUrl}?${params.toString()}`;
    
//     console.log('重新導向到 SSO 登入頁面:', authUrl);
    
//     // 🔥 使用 window.location.replace 避免返回按鈕問題
//     window.location.replace(authUrl);
// }

// // 輔助函數：獲取 Cookie
// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
// }

// // 檢查登入狀態
// function checkLoginStatus() {
//     const ssoToken = getCookie('sso_access_token');
//     const companyId = getCookie('company_id');
//     const employeeId = getCookie('employee_id');
    
//     console.log('檢查登入狀態:', { 
//         ssoToken: !!ssoToken, 
//         companyId, 
//         employeeId 
//     });
    
//     return !!(ssoToken && companyId && employeeId);
// }

// // React 組件 - 處理 SSO 登入
// const ApploginPMXsso = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const [status, setStatus] = useState('初始化中...');
//     const [error, setError] = useState(null);
//     const [isProcessing, setIsProcessing] = useState(false);

// useEffect(() => {
//     // 避免重複執行
//     if (isProcessing) return;
//     setIsProcessing(true);

//     const code = searchParams.get('code');
//     const state = searchParams.get('state');
//     const errorParam = searchParams.get('error');
//     const ssoSuccess = searchParams.get('sso_success'); // 🔥 新增
    
//     console.log('SSO 組件初始化:', { 
//         hasCode: !!code, 
//         hasState: !!state, 
//         error: errorParam,
//         ssoSuccess: !!ssoSuccess,
//         currentUrl: window.location.href
//     });
    
//     // 檢查是否有錯誤參數
//     if (errorParam) {
//         setError(`SSO 錯誤: ${errorParam}`);
//         setStatus('登入失敗');
//         setTimeout(() => {
//             navigate('/apploginpmx');
//         }, 3000);
//         return;
//     }
    
//     // 🔥 如果有 sso_success 標記，表示後端已經處理完成
//     if (ssoSuccess) {
//         console.log('檢測到 SSO 成功標記，檢查登入狀態...');
//         setStatus('SSO 登入處理完成，正在驗證...');
        
//         // 輪詢檢查登入狀態
//         let attempts = 0;
//         const maxAttempts = 5;
        
//         const checkLogin = () => {
//             attempts++;
//             console.log(`檢查登入狀態 - 第 ${attempts} 次`);
//             console.log('所有 Cookies:', document.cookie); // 🔥 除錯用
            
//             if (checkLoginStatus()) {
//                 console.log('登入成功，重新導向到首頁');
//                 setStatus('登入成功！正在跳轉到首頁...');
//                 setTimeout(() => {
//                     navigate('/frontPagepmx');
//                 }, 1000);
//             } else if (attempts < maxAttempts) {
//                 setTimeout(checkLogin, 500); // 每 0.5 秒檢查一次
//             } else {
//                 console.log('登入狀態檢查失敗');
//                 setError('登入狀態驗證失敗，請重試');
//                 setTimeout(() => {
//                     navigate('/apploginpmx');
//                 }, 2000);
//             }
//         };
        
//         // 立即開始檢查
//         checkLogin();
//         return;
//     }
    
//     // 如果有 code 和 state，表示這是從 IDP 回來的 callback（這種情況不應該發生）
//     if (code && state) {
//         console.log('檢測到 code 和 state，但這不應該發生在 SSO 頁面');
//         setError('頁面狀態異常，請重新登入');
//         setTimeout(() => {
//             navigate('/apploginpmx');
//         }, 2000);
//         return;
//     }
    
//     // 如果沒有任何參數，檢查是否已經登入
//     if (checkLoginStatus()) {
//         console.log('發現有效的登入狀態，重新導向到首頁');
//         setStatus('發現有效登入狀態，正在跳轉...');
//         setTimeout(() => {
//             navigate('/frontPagepmx');
//         }, 500);
//         return;
//     }
    
//     // 沒有登入狀態，執行 SSO 重新導向
//     console.log('沒有有效的登入狀態，執行 SSO 登入');
//     setStatus('正在重新導向到 SSO 登入...');
    
//     setTimeout(() => {
//         redirectToSSO();
//     }, 1000);
    
// }, [searchParams, navigate, isProcessing]);


//     return (
//         <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100vh',
//             flexDirection: 'column',
//             padding: '20px',
//             backgroundColor: '#f8f9fa'
//         }}>
//             <div style={{
//                 textAlign: 'center',
//                 backgroundColor: 'white',
//                 padding: '40px',
//                 borderRadius: '10px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 maxWidth: '500px',
//                 width: '100%'
//             }}>
//                 <h2 style={{ 
//                     color: '#333',
//                     marginBottom: '20px',
//                     fontSize: '24px'
//                 }}>
//                     SSO 登入處理中
//                 </h2>
                
//                 <p style={{ 
//                     color: '#666',
//                     fontSize: '16px',
//                     marginBottom: '30px'
//                 }}>
//                     {status}
//                 </p>
                
//                 {error ? (
//                     <div style={{
//                         color: '#dc3545',
//                         backgroundColor: '#f8d7da',
//                         border: '1px solid #f5c6cb',
//                         borderRadius: '5px',
//                         padding: '15px',
//                         marginBottom: '20px'
//                     }}>
//                         <strong>錯誤：</strong>{error}
//                         <br />
//                         <small>將在幾秒後重新導向到登入頁面...</small>
//                     </div>
//                 ) : (
//                     <div style={{ marginBottom: '30px' }}>
//                         <div style={{
//                             border: '4px solid #f3f3f3',
//                             borderTop: '4px solid #007bff',
//                             borderRadius: '50%',
//                             width: '50px',
//                             height: '50px',
//                             animation: 'spin 1s linear infinite',
//                             margin: '0 auto'
//                         }}></div>
//                     </div>
//                 )}
                
//                 {!error && (
//                     <>
//                         <p style={{ 
//                             color: '#666',
//                             fontSize: '14px',
//                             marginBottom: '20px'
//                         }}>
//                             如果沒有自動重新導向，請點擊下方按鈕：
//                         </p>
                        
//                         <button 
//                             onClick={redirectToSSO}
//                             style={{
//                                 padding: '12px 30px',
//                                 fontSize: '16px',
//                                 backgroundColor: '#007bff',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '5px',
//                                 cursor: 'pointer',
//                                 minWidth: '200px',
//                                 transition: 'background-color 0.2s'
//                             }}
//                             onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
//                             onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
//                         >
//                             前往 SSO 登入
//                         </button>
//                     </>
//                 )}
//             </div>
            
//             <style jsx>{`
//                 @keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default ApploginPMXsso;

// // 導出工具函數供其他地方使用
// export {
//     redirectToSSO,
//     checkLoginStatus,
//     generateState
// };
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// 生成隨機的 state 參數用於防範 CSRF 攻擊
function generateState() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// 儲存 state 到 sessionStorage 以便後續驗證
function storeState(state) {
    sessionStorage.setItem('oauth_state', state);
}

// SSO 登入重新導向函數
function redirectToSSO() {
    // 生成隨機 state
    const state = generateState();
    
    // 儲存 state
    storeState(state);
    
    // SSO 參數配置
    const ssoConfig = {
        authUrl: 'https://pmxsso.54ucl.com/authorize',
        responseType: 'code',
        clientId: '285fa946-fadb-40e5-b829-6880789813ec',
        redirectUri: `${API_BASE_URL}/api/callback`,
        scope: 'openid',
        state: state
    };
    
    // 建構授權 URL
    const params = new URLSearchParams({
        response_type: ssoConfig.responseType,
        client_id: ssoConfig.clientId,
        redirect_uri: ssoConfig.redirectUri,
        scope: ssoConfig.scope,
        state: ssoConfig.state
    });
    
    const authUrl = `${ssoConfig.authUrl}?${params.toString()}`;
    
    console.log('重新導向到 SSO 登入頁面:', authUrl);
    
    // 🔥 使用 window.location.replace 避免返回按鈕問題
    window.location.replace(authUrl);
}

// 輔助函數：獲取 Cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 檢查登入狀態
function checkLoginStatus() {
    const ssoToken = getCookie('sso_access_token');
    const companyId = getCookie('company_id');
    const employeeId = getCookie('employee_id');
    
    console.log('檢查登入狀態:', { 
        ssoToken: !!ssoToken, 
        companyId, 
        employeeId 
    });
    
    return !!(ssoToken && companyId && employeeId);
}

// React 組件 - 處理 SSO 登入
const ApploginPMXsso = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('初始化中...');
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

useEffect(() => {
    // 避免重複執行
    if (isProcessing) return;
    setIsProcessing(true);

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');
    const ssoSuccess = searchParams.get('sso_success'); // 🔥 新增
    
    console.log('SSO 組件初始化:', { 
        hasCode: !!code, 
        hasState: !!state, 
        error: errorParam,
        ssoSuccess: !!ssoSuccess,
        currentUrl: window.location.href
    });
    
    // 檢查是否有錯誤參數
    if (errorParam) {
        setError(`SSO 錯誤: ${errorParam}`);
        setStatus('登入失敗');
        setTimeout(() => {
            navigate('/apploginpmx');
        }, 3000);
        return;
    }
    
    // 🔥 如果有 sso_success 標記，表示後端已經處理完成
    if (ssoSuccess) {
        console.log('檢測到 SSO 成功標記，檢查登入狀態...');
        setStatus('SSO 登入處理完成，正在驗證...');
        
        // 輪詢檢查登入狀態
        let attempts = 0;
        const maxAttempts = 5;
        
        const checkLogin = () => {
            attempts++;
            console.log(`檢查登入狀態 - 第 ${attempts} 次`);
            console.log('所有 Cookies:', document.cookie); // 🔥 除錯用
            
            if (checkLoginStatus()) {
                console.log('登入成功，重新導向到首頁');
                setStatus('登入成功！正在跳轉到首頁...');
                setTimeout(() => {
                    navigate('/frontPagepmx');
                }, 1000);
            } else if (attempts < maxAttempts) {
                setTimeout(checkLogin, 500); // 每 0.5 秒檢查一次
            } else {
                console.log('登入狀態檢查失敗');
                setError('登入狀態驗證失敗，請重試');
                setTimeout(() => {
                    navigate('/apploginpmx');
                }, 2000);
            }
        };
        
        // 立即開始檢查
        checkLogin();
        return;
    }
    
    // 如果有 code 和 state，表示這是從 IDP 回來的 callback（這種情況不應該發生）
    if (code && state) {
        console.log('檢測到 code 和 state，但這不應該發生在 SSO 頁面');
        setError('頁面狀態異常，請重新登入');
        setTimeout(() => {
            navigate('/apploginpmx');
        }, 2000);
        return;
    }
    
    // 如果沒有任何參數，檢查是否已經登入
    if (checkLoginStatus()) {
        console.log('發現有效的登入狀態，重新導向到首頁');
        setStatus('發現有效登入狀態，正在跳轉...');
        setTimeout(() => {
            navigate('/frontPagepmx');
        }, 500);
        return;
    }
    
    // 沒有登入狀態，執行 SSO 重新導向
    console.log('沒有有效的登入狀態，執行 SSO 登入');
    setStatus('正在重新導向到 SSO 登入...');
    
    setTimeout(() => {
        redirectToSSO();
    }, 1000);
    
}, [searchParams, navigate, isProcessing]);


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '100%'
            }}>
                <h2 style={{ 
                    color: '#333',
                    marginBottom: '20px',
                    fontSize: '24px'
                }}>
                    SSO 登入處理中
                </h2>
                
                <p style={{ 
                    color: '#666',
                    fontSize: '16px',
                    marginBottom: '30px'
                }}>
                    {status}
                </p>
                
                {error ? (
                    <div style={{
                        color: '#dc3545',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '5px',
                        padding: '15px',
                        marginBottom: '20px'
                    }}>
                        <strong>錯誤：</strong>{error}
                        <br />
                        <small>將在幾秒後重新導向到登入頁面...</small>
                    </div>
                ) : (
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #007bff',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}></div>
                    </div>
                )}
                
                {!error && (
                    <>
                        <p style={{ 
                            color: '#666',
                            fontSize: '14px',
                            marginBottom: '20px'
                        }}>
                            如果沒有自動重新導向，請點擊下方按鈕：
                        </p>
                        
                        <button 
                            onClick={redirectToSSO}
                            style={{
                                padding: '12px 30px',
                                fontSize: '16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                minWidth: '200px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            前往 SSO 登入
                        </button>
                    </>
                )}
            </div>
            
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ApploginPMXsso;

// 導出工具函數供其他地方使用
export {
    redirectToSSO,
    checkLoginStatus,
    generateState
};
