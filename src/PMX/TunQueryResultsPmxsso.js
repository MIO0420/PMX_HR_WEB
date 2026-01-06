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
//     sessionStorage.setItem('oauth_state_query', state);
//     // 標記這是查詢頁面的 SSO
//     sessionStorage.setItem('sso_source', 'query');
// }

// // SSO 登入重新導向函數 - 查詢頁面專用
// function redirectToSSOForQuery() {
//     // 生成隨機 state
//     const state = generateState();
    
//     // 儲存 state 和來源標記
//     storeState(state);
    
//     // SSO 參數配置 - 查詢頁面專用
//     const ssoConfig = {
//         authUrl: 'https://identityprovider.54ucl.com:1989/authorize',
//         responseType: 'code',
//         clientId: 'dc6d2a16-7dc4-435d-9410-273a20aef374',
//         redirectUri: 'https://rabbit.54ucl.com:3004/callback/query', // 查詢專用 callback
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
    
//     console.log('查詢頁面重新導向到 SSO 登入頁面:', authUrl);
    
//     // 使用 window.location.replace 避免返回按鈕問題
//     window.location.replace(authUrl);
// }

// const TunQueryResultsPmxsso = () => {
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const handleSSOCallback = async () => {
//             try {
//                 // 檢查是否有錯誤參數
//                 const errorParam = searchParams.get('error');
//                 if (errorParam) {
//                     setError(`SSO 登入失敗: ${errorParam}`);
//                     setLoading(false);
//                     return;
//                 }

//                 // 檢查是否有成功參數
//                 const ssoSuccess = searchParams.get('sso_login');
//                 if (ssoSuccess === 'success') {
//                     console.log('查詢頁面 SSO 登入成功，準備跳轉到查詢頁面');
                    
//                     // 檢查是否有必要的 cookies
//                     const checkCookies = () => {
//                         const pmxLoggedIn = document.cookie.includes('pmx_logged_in=true');
//                         const hasEmployeeId = document.cookie.includes('employee_id=');
//                         return pmxLoggedIn && hasEmployeeId;
//                     };

//                     if (checkCookies()) {
//                         // 延遲跳轉以確保 cookies 完全設置
//                         setTimeout(() => {
//                             navigate('/tunqueryresultspmx', { replace: true });
//                         }, 1000);
//                     } else {
//                         // 如果 cookies 還沒設置好，等待一下再檢查
//                         let retryCount = 0;
//                         const maxRetries = 5;
                        
//                         const checkAndRedirect = () => {
//                             if (checkCookies() || retryCount >= maxRetries) {
//                                 navigate('/tunqueryresultspmx', { replace: true });
//                             } else {
//                                 retryCount++;
//                                 setTimeout(checkAndRedirect, 500);
//                             }
//                         };
                        
//                         setTimeout(checkAndRedirect, 500);
//                     }
//                     return;
//                 }

//                 // 如果沒有任何參數，開始 SSO 流程
//                 console.log('開始查詢頁面 SSO 登入流程');
//                 redirectToSSOForQuery();

//             } catch (err) {
//                 console.error('查詢頁面 SSO 處理錯誤:', err);
//                 setError('SSO 處理失敗，請重新嘗試');
//                 setLoading(false);
//             }
//         };

//         handleSSOCallback();
//     }, [searchParams, navigate]);

//     // 重試函數
//     const handleRetry = () => {
//         setError('');
//         setLoading(true);
//         redirectToSSOForQuery();
//     };

//     // 返回登入頁面
//     const handleBackToLogin = () => {
//         navigate('/tunqueryresultspmxlogin', { replace: true });
//     };

//     if (loading) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 minHeight: '100vh',
//                 backgroundColor: '#f5f5f5',
//                 fontFamily: 'Arial, sans-serif'
//             }}>
//                 <div style={{
//                     backgroundColor: 'white',
//                     padding: '40px',
//                     borderRadius: '10px',
//                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                     textAlign: 'center',
//                     maxWidth: '400px',
//                     width: '90%'
//                 }}>
//                     <div style={{
//                         width: '50px',
//                         height: '50px',
//                         border: '4px solid #f3f3f3',
//                         borderTop: '4px solid #3498db',
//                         borderRadius: '50%',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 20px'
//                     }}></div>
//                     <h2 style={{ color: '#333', marginBottom: '10px' }}>正在進行 SSO 登入</h2>
//                     <p style={{ color: '#666', margin: '0' }}>請稍候，正在重新導向到身份驗證服務...</p>
//                 </div>
//                 <style jsx>{`
//                     @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                     }
//                 `}</style>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 minHeight: '100vh',
//                 backgroundColor: '#f5f5f5',
//                 fontFamily: 'Arial, sans-serif'
//             }}>
//                 <div style={{
//                     backgroundColor: 'white',
//                     padding: '40px',
//                     borderRadius: '10px',
//                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                     textAlign: 'center',
//                     maxWidth: '400px',
//                     width: '90%'
//                 }}>
//                     <div style={{
//                         color: '#e74c3c',
//                         fontSize: '48px',
//                         marginBottom: '20px'
//                     }}>⚠️</div>
//                     <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>登入失敗</h2>
//                     <p style={{ color: '#666', marginBottom: '25px' }}>{error}</p>
//                     <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
//                         <button
//                             onClick={handleRetry}
//                             style={{
//                                 backgroundColor: '#3498db',
//                                 color: 'white',
//                                 border: 'none',
//                                 padding: '12px 24px',
//                                 borderRadius: '5px',
//                                 cursor: 'pointer',
//                                 fontSize: '14px'
//                             }}
//                         >
//                             重新嘗試
//                         </button>
//                         <button
//                             onClick={handleBackToLogin}
//                             style={{
//                                 backgroundColor: '#95a5a6',
//                                 color: 'white',
//                                 border: 'none',
//                                 padding: '12px 24px',
//                                 borderRadius: '5px',
//                                 cursor: 'pointer',
//                                 fontSize: '14px'
//                             }}
//                         >
//                             返回登入
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return null;
// };

// export default TunQueryResultsPmxsso;
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
    sessionStorage.setItem('oauth_state_query', state);
    // 標記這是查詢頁面的 SSO
    sessionStorage.setItem('sso_source', 'query');
}

// SSO 登入重新導向函數 - 查詢頁面專用
function redirectToSSOForQuery() {
    // 生成隨機 state
    const state = generateState();
    
    // 儲存 state 和來源標記
    storeState(state);
    
    // SSO 參數配置 - 查詢頁面專用
    const ssoConfig = {
        authUrl: 'https://pmxsso.54ucl.com/authorize',
        responseType: 'code',
        clientId: 'b50bf072-fbc9-4297-a31d-0a0fd37b48e6',
        redirectUri: `${API_BASE_URL}/api/callback/query`, // 查詢專用 callback
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
    
    console.log('查詢頁面重新導向到 SSO 登入頁面:', authUrl);
    
    // 使用 window.location.replace 避免返回按鈕問題
    window.location.replace(authUrl);
}

const TunQueryResultsPmxsso = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleSSOCallback = async () => {
            try {
                // 檢查是否有錯誤參數
                const errorParam = searchParams.get('error');
                if (errorParam) {
                    setError(`SSO 登入失敗: ${errorParam}`);
                    setLoading(false);
                    return;
                }

                // 檢查是否有成功參數
                const ssoSuccess = searchParams.get('sso_login');
                if (ssoSuccess === 'success') {
                    console.log('查詢頁面 SSO 登入成功，準備跳轉到查詢頁面');
                    
                    // 檢查是否有必要的 cookies
                    const checkCookies = () => {
                        const pmxLoggedIn = document.cookie.includes('pmx_logged_in=true');
                        const hasEmployeeId = document.cookie.includes('employee_id=');
                        return pmxLoggedIn && hasEmployeeId;
                    };

                    if (checkCookies()) {
                        // 延遲跳轉以確保 cookies 完全設置
                        setTimeout(() => {
                            navigate('/tunqueryresultspmx', { replace: true });
                        }, 1000);
                    } else {
                        // 如果 cookies 還沒設置好，等待一下再檢查
                        let retryCount = 0;
                        const maxRetries = 5;
                        
                        const checkAndRedirect = () => {
                            if (checkCookies() || retryCount >= maxRetries) {
                                navigate('/tunqueryresultspmx', { replace: true });
                            } else {
                                retryCount++;
                                setTimeout(checkAndRedirect, 500);
                            }
                        };
                        
                        setTimeout(checkAndRedirect, 500);
                    }
                    return;
                }

                // 如果沒有任何參數，開始 SSO 流程
                console.log('開始查詢頁面 SSO 登入流程');
                redirectToSSOForQuery();

            } catch (err) {
                console.error('查詢頁面 SSO 處理錯誤:', err);
                setError('SSO 處理失敗，請重新嘗試');
                setLoading(false);
            }
        };

        handleSSOCallback();
    }, [searchParams, navigate]);

    // 重試函數
    const handleRetry = () => {
        setError('');
        setLoading(true);
        redirectToSSOForQuery();
    };

    // 返回登入頁面
    const handleBackToLogin = () => {
        navigate('/tunqueryresultspmxlogin', { replace: true });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h2 style={{ color: '#333', marginBottom: '10px' }}>正在進行 SSO 登入</h2>
                    <p style={{ color: '#666', margin: '0' }}>請稍候，正在重新導向到身份驗證服務...</p>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    <div style={{
                        color: '#e74c3c',
                        fontSize: '48px',
                        marginBottom: '20px'
                    }}>⚠️</div>
                    <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>登入失敗</h2>
                    <p style={{ color: '#666', marginBottom: '25px' }}>{error}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                            onClick={handleRetry}
                            style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            重新嘗試
                        </button>
                        <button
                            onClick={handleBackToLogin}
                            style={{
                                backgroundColor: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            返回登入
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default TunQueryResultsPmxsso;
