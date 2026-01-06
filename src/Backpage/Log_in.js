// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import Cookies from 'js-cookie'; // 需要安裝: npm install js-cookie

// // function Login() {
// //   const [companyId, setCompanyId] = useState('');
// //   const [employeeId, setEmployeeId] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   // 處理表單提交
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       // 使用與第二份代碼相同的 API 進行登入
// //       const response = await axios.post('https://rabbit.54ucl.com:3004/api/employee/login', {
// //         company_id: companyId,
// //         employee_id: employeeId,
// //         password: password
// //       }, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json'
// //         }
// //       });
      
// //       console.log('API 回應:', response.data);
      
// //       // 檢查登入是否成功
// //       if (response.data.Status === "Ok") {
// //         // 只將統編和帳號存在 cookies 中
// //         // 設置過期時間為 3 小時
// //         const expirationHours = 3;
// //         const expirationDays = expirationHours / 24;
        
// //         // 保存統編
// //         Cookies.set('company_id', companyId.toString(), { 
// //           expires: expirationDays, 
// //           path: '/',
// //           secure: window.location.protocol === 'https:',
// //           sameSite: 'lax'
// //         });
        
// //         // 保存帳號
// //         Cookies.set('employee_id', employeeId.toString(), { 
// //           expires: expirationDays, 
// //           path: '/',
// //           secure: window.location.protocol === 'https:',
// //           sameSite: 'lax'
// //         });
        
// //         console.log('登入成功，已將統編和帳號存入 cookies');
        
// //         // 登入成功後導航到 /human 頁面
// //         navigate('/homepage');
// //       } else {
// //         // 登入失敗
// //         setError("統編或帳號或密碼錯誤，請重新輸入");
// //       }
// //     } catch (err) {
// //       console.error('登入失敗:', err);
      
// //       // 統一顯示錯誤訊息
// //       setError("統編或帳號或密碼錯誤，請重新輸入");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 處理忘記密碼
// //   const handleForgotPassword = () => {
// //     console.log('忘記密碼');
// //   };

// //   // 樣式定義
// //   const styles = {
// //     container: {
// //       display: 'flex',
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       height: '100vh',
// //       backgroundColor: '#f5f7fa',
// //       margin: 0,
// //       padding: 0,
// //       width: '100%',
// //       maxWidth: '100%',
// //       boxSizing: 'border-box',
// //       fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
// //     },
// //     loginBox: {
// //       width: '100%',
// //       maxWidth: '360px',
// //       backgroundColor: 'white',
// //       borderRadius: '8px',
// //       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
// //       padding: '30px 20px',
// //       boxSizing: 'border-box',
// //     },
// //     title: {
// //       fontSize: '20px',
// //       color: '#3a75b5',
// //       textAlign: 'center',
// //       marginBottom: '30px',
// //       fontWeight: 'bold',
// //     },
// //     form: {
// //       width: '100%',
// //     },
// //     inputGroup: {
// //       marginBottom: '20px',
// //       width: '100%',
// //     },
// //     input: {
// //       width: '100%',
// //       padding: '12px 15px',
// //       border: '1px solid #ddd',
// //       borderRadius: '4px',
// //       fontSize: '14px',
// //       boxSizing: 'border-box',
// //     },
// //     forgotPassword: {
// //       textAlign: 'right',
// //       marginBottom: '20px',
// //     },
// //     forgotPasswordLink: {
// //       color: '#3a75b5',
// //       fontSize: '14px',
// //       textDecoration: 'none',
// //       cursor: 'pointer',
// //     },
// //     loginButton: {
// //       width: '100%',
// //       padding: '12px',
// //       backgroundColor: '#3a75b5',
// //       color: 'white',
// //       border: 'none',
// //       borderRadius: '4px',
// //       fontSize: '16px',
// //       cursor: 'pointer',
// //       fontWeight: 'bold',
// //       opacity: loading ? 0.7 : 1,
// //     },
// //     errorMessage: {
// //       color: 'red',
// //       fontSize: '14px',
// //       marginBottom: '15px',
// //       textAlign: 'center',
// //     }
// //   };

// //   // 添加全局樣式
// //   React.useEffect(() => {
// //     document.body.style.margin = '0';
// //     document.body.style.padding = '0';
// //     document.documentElement.style.margin = '0';
// //     document.documentElement.style.padding = '0';
    
// //     return () => {
// //       document.body.style.margin = '';
// //       document.body.style.padding = '';
// //       document.documentElement.style.margin = '';
// //       document.documentElement.style.padding = '';
// //     };
// //   }, []);

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.loginBox}>
// //         <div style={styles.title}>老闆左右手事務所</div>
        
// //         <form style={styles.form} onSubmit={handleSubmit}>
// //           {error && <div style={styles.errorMessage}>{error}</div>}
          
// //           <div style={styles.inputGroup}>
// //             <input
// //               type="text"
// //               placeholder="公司統編"
// //               style={styles.input}
// //               value={companyId}
// //               onChange={(e) => setCompanyId(e.target.value)}
// //               required
// //             />
// //           </div>
          
// //           <div style={styles.inputGroup}>
// //             <input
// //               type="text"
// //               placeholder="帳號"
// //               style={styles.input}
// //               value={employeeId}
// //               onChange={(e) => setEmployeeId(e.target.value)}
// //               required
// //             />
// //           </div>
          
// //           <div style={styles.inputGroup}>
// //             <input
// //               type="password"
// //               placeholder="密碼"
// //               style={styles.input}
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //             />
// //           </div>
          
// //           <div style={styles.forgotPassword}>
// //             <span style={styles.forgotPasswordLink} onClick={handleForgotPassword}>
// //               忘記密碼
// //             </span>
// //           </div>
          
// //           <button 
// //             type="submit" 
// //             style={styles.loginButton}
// //             disabled={loading}
// //           >
// //             {loading ? '登入中...' : '登入'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Login;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { API_BASE_URL } from '../config'; // 🔥 引入配置文件

// function Login() {
//   const [companyId, setCompanyId] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // 處理表單提交
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       // 🔥 使用配置文件中的 API_BASE_URL
//       const response = await axios.post(`${API_BASE_URL}/api/employee/login`, {
//         company_id: companyId,
//         employee_id: employeeId,
//         password: password
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });
      
//       console.log('登入 API 回應:', response.data);
      
//       // 檢查登入是否成功
//       if (response.data.Status === "Ok") {
//         // 設置過期時間為 3 小時
//         const expirationHours = 3;
//         const expirationDays = expirationHours / 24;
        
//         // Cookie 設定選項
//         const cookieOptions = {
//           expires: expirationDays, 
//           path: '/',
//           secure: window.location.protocol === 'https:',
//           sameSite: 'lax'
//         };
        
//         // 🔥 保存基本資訊
//         Cookies.set('company_id', companyId.toString(), cookieOptions);
//         Cookies.set('employee_id', employeeId.toString(), cookieOptions);
        
//         // 🔥 儲存 auth_xtbb token（檢查多種可能的欄位名稱）
//         const authToken = response.data.auth_xtbb || 
//                          response.data.token || 
//                          response.data.access_token || 
//                          response.data.authToken;
        
//         if (authToken) {
//           Cookies.set('auth_xtbb', authToken.toString(), cookieOptions);
//           console.log('✅ 已儲存 auth_xtbb token:', authToken.substring(0, 10) + '...');
//         } else {
//           console.warn('⚠️ 登入回應中未找到 auth_xtbb token');
//         }
        
//         // 🔥 儲存其他可能的用戶資訊
//         const additionalFields = [
//           'user_name', 'employee_name', 'name',
//           'job_grade', 'position', 'role',
//           'department', 'dept_name'
//         ];
        
//         additionalFields.forEach(field => {
//           if (response.data[field]) {
//             Cookies.set(field, response.data[field].toString(), cookieOptions);
//             console.log(`✅ 已儲存 ${field}:`, response.data[field]);
//           }
//         });
        
//         // 🔥 如果回應中有巢狀的用戶資料
//         if (response.data.Data && typeof response.data.Data === 'object') {
//           additionalFields.forEach(field => {
//             if (response.data.Data[field]) {
//               Cookies.set(field, response.data.Data[field].toString(), cookieOptions);
//               console.log(`✅ 已儲存 Data.${field}:`, response.data.Data[field]);
//             }
//           });
          
//           // 特別檢查 auth_xtbb 是否在 Data 中
//           if (response.data.Data.auth_xtbb && !authToken) {
//             Cookies.set('auth_xtbb', response.data.Data.auth_xtbb.toString(), cookieOptions);
//             console.log('✅ 已儲存 Data.auth_xtbb token:', response.data.Data.auth_xtbb.substring(0, 10) + '...');
//           }
//         }
        
//         console.log('🎉 登入成功，已將用戶資訊存入 cookies');
//         console.log('📋 儲存的 cookies:', {
//           company_id: companyId,
//           employee_id: employeeId,
//           auth_xtbb: authToken ? authToken.substring(0, 10) + '...' : '未找到'
//         });
        
//         // 登入成功後導航到首頁
//         navigate('/homepage');
//       } else {
//         // 登入失敗
//         setError(response.data.Msg || "統編或帳號或密碼錯誤，請重新輸入");
//         console.error('❌ 登入失敗:', response.data);
//       }
//     } catch (err) {
//       console.error('❌ 登入請求失敗:', err);
      
//       // 根據錯誤類型顯示不同訊息
//       if (err.response) {
//         // 伺服器回應了錯誤狀態碼
//         const statusCode = err.response.status;
//         const errorMsg = err.response.data?.Msg || err.response.data?.message;
        
//         if (statusCode === 401) {
//           setError("統編或帳號或密碼錯誤，請重新輸入");
//         } else if (statusCode === 404) {
//           setError("登入服務暫時無法使用，請稍後再試");
//         } else if (statusCode >= 500) {
//           setError("伺服器錯誤，請稍後再試");
//         } else {
//           setError(errorMsg || "登入失敗，請重新輸入");
//         }
//       } else if (err.request) {
//         // 請求已發出但沒有收到回應
//         setError("網路連線異常，請檢查網路連線");
//       } else {
//         // 其他錯誤
//         setError("登入失敗，請重新輸入");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 處理忘記密碼
//   const handleForgotPassword = () => {
//     console.log('忘記密碼功能');
//     // TODO: 實作忘記密碼功能
//   };

//   // 樣式定義
//   const styles = {
//     container: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       backgroundColor: '#f5f7fa',
//       margin: 0,
//       padding: 0,
//       width: '100%',
//       maxWidth: '100%',
//       boxSizing: 'border-box',
//       fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//     },
//     loginBox: {
//       width: '100%',
//       maxWidth: '360px',
//       backgroundColor: 'white',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//       padding: '30px 20px',
//       boxSizing: 'border-box',
//     },
//     title: {
//       fontSize: '20px',
//       color: '#3a75b5',
//       textAlign: 'center',
//       marginBottom: '30px',
//       fontWeight: 'bold',
//     },
//     form: {
//       width: '100%',
//     },
//     inputGroup: {
//       marginBottom: '20px',
//       width: '100%',
//     },
//     input: {
//       width: '100%',
//       padding: '12px 15px',
//       border: '1px solid #ddd',
//       borderRadius: '4px',
//       fontSize: '14px',
//       boxSizing: 'border-box',
//       transition: 'border-color 0.3s ease',
//     },
//     inputFocus: {
//       borderColor: '#3a75b5',
//       outline: 'none',
//     },
//     forgotPassword: {
//       textAlign: 'right',
//       marginBottom: '20px',
//     },
//     forgotPasswordLink: {
//       color: '#3a75b5',
//       fontSize: '14px',
//       textDecoration: 'none',
//       cursor: 'pointer',
//       transition: 'color 0.3s ease',
//     },
//     loginButton: {
//       width: '100%',
//       padding: '12px',
//       backgroundColor: '#3a75b5',
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       fontSize: '16px',
//       cursor: loading ? 'not-allowed' : 'pointer',
//       fontWeight: 'bold',
//       opacity: loading ? 0.7 : 1,
//       transition: 'all 0.3s ease',
//     },
//     loginButtonHover: {
//       backgroundColor: '#2d5a8f',
//     },
//     errorMessage: {
//       color: '#d32f2f',
//       fontSize: '14px',
//       marginBottom: '15px',
//       textAlign: 'center',
//       padding: '8px',
//       backgroundColor: '#ffebee',
//       borderRadius: '4px',
//       border: '1px solid #ffcdd2',
//     }
//   };

//   // 添加全局樣式
//   React.useEffect(() => {
//     document.body.style.margin = '0';
//     document.body.style.padding = '0';
//     document.documentElement.style.margin = '0';
//     document.documentElement.style.padding = '0';
    
//     return () => {
//       document.body.style.margin = '';
//       document.body.style.padding = '';
//       document.documentElement.style.margin = '';
//       document.documentElement.style.padding = '';
//     };
//   }, []);

//   // 🔥 調試：顯示當前使用的 API URL
//   React.useEffect(() => {
//     console.log('🔍 當前使用的 API_BASE_URL:', API_BASE_URL);
//   }, []);

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginBox}>
//         <div style={styles.title}>老闆左右手事務所</div>
        
//         <form style={styles.form} onSubmit={handleSubmit}>
//           {error && <div style={styles.errorMessage}>{error}</div>}
          
//           <div style={styles.inputGroup}>
//             <input
//               type="text"
//               placeholder="公司統編"
//               style={styles.input}
//               value={companyId}
//               onChange={(e) => setCompanyId(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>
          
//           <div style={styles.inputGroup}>
//             <input
//               type="text"
//               placeholder="帳號"
//               style={styles.input}
//               value={employeeId}
//               onChange={(e) => setEmployeeId(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>
          
//           <div style={styles.inputGroup}>
//             <input
//               type="password"
//               placeholder="密碼"
//               style={styles.input}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>
          
//           <div style={styles.forgotPassword}>
//             <span 
//               style={styles.forgotPasswordLink} 
//               onClick={handleForgotPassword}
//             >
//               忘記密碼
//             </span>
//           </div>
          
//           <button 
//             type="submit" 
//             style={styles.loginButton}
//             disabled={loading}
//           >
//             {loading ? '登入中...' : '登入'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config';

function Login() {
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 使用配置文件中的 API_BASE_URL
      const response = await axios.post(`${API_BASE_URL}/api/employee/login`, {
        company_id: companyId,
        employee_id: employeeId,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // 🔥 重要：允許接收 Cookie
      });
      
      console.log('登入 API 回應:', response.data);
      
      // 檢查登入是否成功
      if (response.data.Status === "Ok") {
        // 設置過期時間為 3 小時（與後端一致）
        const expirationHours = 3;
        const expirationDays = expirationHours / 24;
        
        // Cookie 設定選項
        const cookieOptions = {
          expires: expirationDays, 
          path: '/',
          secure: window.location.protocol === 'https:',
          sameSite: 'lax'
        };
        
        // 🔥 重要：從 response.data.Data.xtbb 獲取 token
        const authToken = response.data.Data?.xtbb;
        
        if (authToken) {
          // 儲存為 auth_xtbb（與後端 Cookie 名稱一致）
          Cookies.set('auth_xtbb', authToken.toString(), cookieOptions);
          console.log('✅ 已儲存 auth_xtbb token:', authToken.substring(0, 20) + '...');
        } else {
          console.warn('⚠️ 登入回應中未找到 xtbb token');
        }
        
        // 🔥 儲存基本資訊（後端也會設置這些 Cookie，但前端也設置一份確保一致性）
        Cookies.set('company_id', companyId.toString(), cookieOptions);
        Cookies.set('employee_id', employeeId.toString(), cookieOptions);
        
        // 🔥 儲存後端返回的其他用戶資訊
        const userDataFields = [
          'name', 'department', 'position', 'job_grade', 'company_name'
        ];
        
        userDataFields.forEach(field => {
          if (response.data.Data && response.data.Data[field]) {
            Cookies.set(field, response.data.Data[field].toString(), cookieOptions);
            console.log(`✅ 已儲存 ${field}:`, response.data.Data[field]);
          }
        });
        
        // 🔥 儲存登入時間
        Cookies.set('login_time', new Date().toISOString(), cookieOptions);
        
        console.log('🎉 登入成功，已將用戶資訊存入 cookies');
        console.log('📋 儲存的主要 cookies:', {
          company_id: companyId,
          employee_id: employeeId,
          auth_xtbb: authToken ? authToken.substring(0, 20) + '...' : '未找到',
          name: response.data.Data?.name || '未提供',
          department: response.data.Data?.department || '未提供'
        });
        
        // 🔥 驗證 Cookie 是否成功儲存
        setTimeout(() => {
          const savedToken = Cookies.get('auth_xtbb');
          const savedCompanyId = Cookies.get('company_id');
          const savedEmployeeId = Cookies.get('employee_id');
          
          console.log('🔍 驗證 Cookie 儲存狀態:', {
            auth_xtbb: savedToken ? '✅ 已儲存' : '❌ 未儲存',
            company_id: savedCompanyId ? '✅ 已儲存' : '❌ 未儲存',
            employee_id: savedEmployeeId ? '✅ 已儲存' : '❌ 未儲存'
          });
          
          if (!savedToken) {
            console.error('❌ auth_xtbb Cookie 儲存失敗！');
          }
        }, 100);
        
        // 登入成功後導航到首頁
        navigate('/homepage');
      } else {
        // 登入失敗
        setError(response.data.Msg || "統編或帳號或密碼錯誤，請重新輸入");
        console.error('❌ 登入失敗:', response.data);
      }
    } catch (err) {
      console.error('❌ 登入請求失敗:', err);
      
      // 根據錯誤類型顯示不同訊息
      if (err.response) {
        const statusCode = err.response.status;
        const errorMsg = err.response.data?.Msg || err.response.data?.message;
        
        if (statusCode === 401) {
          setError("統編或帳號或密碼錯誤，請重新輸入");
        } else if (statusCode === 404) {
          setError("登入服務暫時無法使用，請稍後再試");
        } else if (statusCode >= 500) {
          setError("伺服器錯誤，請稍後再試");
        } else {
          setError(errorMsg || "登入失敗，請重新輸入");
        }
      } else if (err.request) {
        setError("網路連線異常，請檢查網路連線");
      } else {
        setError("登入失敗，請重新輸入");
      }
    } finally {
      setLoading(false);
    }
  };

  // 處理忘記密碼
  const handleForgotPassword = () => {
    console.log('忘記密碼功能');
    // TODO: 實作忘記密碼功能
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
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    },
    loginBox: {
      width: '100%',
      maxWidth: '360px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '30px 20px',
      boxSizing: 'border-box',
    },
    title: {
      fontSize: '20px',
      color: '#3a75b5',
      textAlign: 'center',
      marginBottom: '30px',
      fontWeight: 'bold',
    },
    form: {
      width: '100%',
    },
    inputGroup: {
      marginBottom: '20px',
      width: '100%',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: '20px',
    },
    forgotPasswordLink: {
      color: '#3a75b5',
      fontSize: '14px',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
    },
    loginButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3a75b5',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontWeight: 'bold',
      opacity: loading ? 0.7 : 1,
      transition: 'all 0.3s ease',
    },
    errorMessage: {
      color: '#d32f2f',
      fontSize: '14px',
      marginBottom: '15px',
      textAlign: 'center',
      padding: '8px',
      backgroundColor: '#ffebee',
      borderRadius: '4px',
      border: '1px solid #ffcdd2',
    }
  };

  // 添加全局樣式
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  // 調試：顯示當前使用的 API URL
  React.useEffect(() => {
    console.log('🔍 當前使用的 API_BASE_URL:', API_BASE_URL);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.title}>老闆左右手事務所</div>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.errorMessage}>{error}</div>}
          
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="公司統編"
              style={styles.input}
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="帳號"
              style={styles.input}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="密碼"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div style={styles.forgotPassword}>
            <span 
              style={styles.forgotPasswordLink} 
              onClick={handleForgotPassword}
            >
              忘記密碼
            </span>
          </div>
          
          <button 
            type="submit" 
            style={styles.loginButton}
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
