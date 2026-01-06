// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Cookies from 'js-cookie';

// // const NewDepartments = ({ isOpen, onClose, onSuccess }) => {
// //   const [formData, setFormData] = useState({
// //     departmentName: '',
// //     departmentImage: null,
// //     parentDepartment: '',
// //     subDepartment: ''
// //   });
  
// //   const [departments, setDepartments] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [imagePreview, setImagePreview] = useState(null);

// //   // 獲取現有部門列表（用於階層設定）
// //   useEffect(() => {
// //     if (isOpen) {
// //       fetchDepartments();
// //     }
// //   }, [isOpen]);

// //   const fetchDepartments = async () => {
// //     try {
// //       const companyId = Cookies.get('company_id') || '76014406';
// //       const response = await axios.get(`https://rabbit.54ucl.com:3004/api/departments?company_id=${companyId}`);
      
// //       if (response.data.Status === 'Ok') {
// //         setDepartments(response.data.Data || []);
// //       }
// //     } catch (err) {
// //       console.error('獲取部門列表失敗:', err);
// //     }
// //   };

// //   // 修改 handleInputChange - 移除互斥邏輯
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setFormData(prev => ({
// //         ...prev,
// //         departmentImage: file
// //       }));
      
// //       // 建立預覽
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setImagePreview(e.target.result);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!formData.departmentName.trim()) {
// //       setError('請輸入部門名稱');
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const companyId = Cookies.get('company_id') || '76014406';
      
// //       // 準備提交資料 - 明確設定所有欄位
// //       const submitData = {
// //         department: formData.departmentName.trim(),
// //         company_id: parseInt(companyId),
// //         upperLayer: formData.parentDepartment ? parseInt(formData.parentDepartment) : null,
// //         NextLayer: formData.subDepartment ? parseInt(formData.subDepartment) : null
// //       };

// //       console.log('=== 前端提交資料 ===');
// //       console.log('formData.parentDepartment:', formData.parentDepartment);
// //       console.log('formData.subDepartment:', formData.subDepartment);
// //       console.log('submitData:', JSON.stringify(submitData, null, 2));

// //       const response = await axios.post('https://rabbit.54ucl.com:3004/api/departments', submitData, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json'
// //         }
// //       });

// //       console.log('=== 後端回應 ===');
// //       console.log('response.data:', response.data);

// //       if (response.data.Status === 'Ok') {
// //         // 成功後重置表單
// //         setFormData({
// //           departmentName: '',
// //           departmentImage: null,
// //           parentDepartment: '',
// //           subDepartment: ''
// //         });
// //         setImagePreview(null);
        
// //         // 通知父組件更新
// //         if (onSuccess) {
// //           onSuccess();
// //         }
        
// //         // 關閉對話框
// //         onClose();
// //       } else {
// //         setError(response.data.Msg || '新增部門失敗');
// //       }
// //     } catch (err) {
// //       console.error('新增部門失敗:', err);
// //       setError(err.response?.data?.Msg || '新增部門失敗，請稍後再試');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleClose = () => {
// //     // 重置表單
// //     setFormData({
// //       departmentName: '',
// //       departmentImage: null,
// //       parentDepartment: '',
// //       subDepartment: ''
// //     });
// //     setImagePreview(null);
// //     setError(null);
// //     onClose();
// //   };

// //   // CSS 樣式
// //   const styles = {
// //     overlay: {
// //       position: 'fixed',
// //       top: 0,
// //       left: 0,
// //       right: 0,
// //       bottom: 0,
// //       backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //       display: 'flex',
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       zIndex: 1000
// //     },
// //     modal: {
// //       backgroundColor: 'white',
// //       borderRadius: '12px',
// //       padding: '24px',
// //       width: '400px',
// //       maxWidth: '90vw',
// //       maxHeight: '90vh',
// //       overflow: 'auto',
// //       boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
// //     },
// //     header: {
// //       display: 'flex',
// //       justifyContent: 'space-between',
// //       alignItems: 'center',
// //       marginBottom: '20px',
// //       paddingBottom: '12px',
// //       borderBottom: '1px solid #e0e0e0'
// //     },
// //     title: {
// //       margin: 0,
// //       fontSize: '18px',
// //       fontWeight: '600',
// //       color: '#333'
// //     },
// //     closeBtn: {
// //       background: 'none',
// //       border: 'none',
// //       fontSize: '24px',
// //       cursor: 'pointer',
// //       color: '#999',
// //       padding: '0',
// //       width: '30px',
// //       height: '30px',
// //       display: 'flex',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       borderRadius: '50%',
// //       transition: 'all 0.2s ease'
// //     },
// //     form: {
// //       display: 'flex',
// //       flexDirection: 'column',
// //       gap: '20px'
// //     },
// //     formGroup: {
// //       display: 'flex',
// //       flexDirection: 'column',
// //       gap: '8px'
// //     },
// //     label: {
// //       fontSize: '14px',
// //       fontWeight: '500',
// //       color: '#4a86e8',
// //       marginBottom: '4px'
// //     },
// //     input: {
// //       padding: '12px',
// //       border: '1px solid #ddd',
// //       borderRadius: '8px',
// //       fontSize: '14px',
// //       outline: 'none',
// //       transition: 'border-color 0.2s ease'
// //     },
// //     imageUploadContainer: {
// //       display: 'flex',
// //       flexDirection: 'column',
// //       alignItems: 'center',
// //       gap: '8px'
// //     },
// //     imageUploadBtn: {
// //       display: 'flex',
// //       flexDirection: 'column',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       width: '120px',
// //       height: '120px',
// //       border: '2px dashed #ddd',
// //       borderRadius: '8px',
// //       cursor: 'pointer',
// //       transition: 'all 0.2s ease',
// //       backgroundColor: '#fafafa'
// //     },
// //     uploadPlaceholder: {
// //       display: 'flex',
// //       flexDirection: 'column',
// //       alignItems: 'center',
// //       gap: '8px',
// //       color: '#999'
// //     },
// //     uploadIcon: {
// //       fontSize: '24px'
// //     },
// //     imagePreview: {
// //       width: '100%',
// //       height: '100%',
// //       objectFit: 'cover',
// //       borderRadius: '6px'
// //     },
// //     hierarchyRow: {
// //       display: 'flex',
// //       alignItems: 'center',
// //       gap: '12px',
// //       marginBottom: '8px'
// //     },
// //     hierarchyLabel: {
// //       fontSize: '14px',
// //       color: '#666',
// //       minWidth: '60px'
// //     },
// //     select: {
// //       flex: 1,
// //       padding: '8px 12px',
// //       border: '1px solid #ddd',
// //       borderRadius: '6px',
// //       fontSize: '14px',
// //       outline: 'none',
// //       backgroundColor: 'white',
// //       cursor: 'pointer'
// //     },
// //     hierarchyNote: {
// //       fontSize: '12px',
// //       color: '#666',
// //       fontStyle: 'italic',
// //       marginTop: '4px'
// //     },
// //     errorMessage: {
// //       color: '#e74c3c',
// //       fontSize: '14px',
// //       marginTop: '8px',
// //       padding: '8px 12px',
// //       backgroundColor: '#fdf2f2',
// //       border: '1px solid #fecaca',
// //       borderRadius: '6px'
// //     },
// //     buttonGroup: {
// //       display: 'flex',
// //       gap: '12px',
// //       justifyContent: 'flex-end',
// //       marginTop: '20px'
// //     },
// //     cancelBtn: {
// //       padding: '10px 20px',
// //       border: '1px solid #ddd',
// //       borderRadius: '6px',
// //       backgroundColor: 'white',
// //       color: '#666',
// //       cursor: 'pointer',
// //       fontSize: '14px',
// //       transition: 'all 0.2s ease'
// //     },
// //     confirmBtn: {
// //       padding: '10px 20px',
// //       border: 'none',
// //       borderRadius: '6px',
// //       backgroundColor: '#4a86e8',
// //       color: 'white',
// //       cursor: 'pointer',
// //       fontSize: '14px',
// //       transition: 'all 0.2s ease',
// //       minWidth: '80px'
// //     },
// //     confirmBtnDisabled: {
// //       backgroundColor: '#ccc',
// //       cursor: 'not-allowed'
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div style={styles.overlay} onClick={handleClose}>
// //       <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
// //         <div style={styles.header}>
// //           <h3 style={styles.title}>新增部門</h3>
// //           <button 
// //             style={styles.closeBtn}
// //             onClick={handleClose}
// //             type="button"
// //             onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
// //             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
// //           >
// //             ×
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} style={styles.form}>
// //           {/* 部門名稱 */}
// //           <div style={styles.formGroup}>
// //             <label style={styles.label}>部門名稱</label>
// //             <input
// //               type="text"
// //               name="departmentName"
// //               value={formData.departmentName}
// //               onChange={handleInputChange}
// //               placeholder="請輸入部門名稱"
// //               style={{
// //                 ...styles.input,
// //                 borderColor: formData.departmentName ? '#4a86e8' : '#ddd'
// //               }}
// //               onFocus={(e) => e.target.style.borderColor = '#4a86e8'}
// //               onBlur={(e) => e.target.style.borderColor = formData.departmentName ? '#4a86e8' : '#ddd'}
// //               required
// //             />
// //           </div>

// //           {/* 部門圖片 */}
// //           <div style={styles.formGroup}>
// //             <label style={styles.label}>部門圖片</label>
// //             <div style={styles.imageUploadContainer}>
// //               <input
// //                 type="file"
// //                 id="departmentImage"
// //                 name="departmentImage"
// //                 accept="image/*"
// //                 onChange={handleImageChange}
// //                 style={{ display: 'none' }}
// //               />
// //               <label 
// //                 htmlFor="departmentImage" 
// //                 style={styles.imageUploadBtn}
// //                 onMouseEnter={(e) => e.target.style.borderColor = '#4a86e8'}
// //                 onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
// //               >
// //                 {imagePreview ? (
// //                   <img src={imagePreview} alt="預覽" style={styles.imagePreview} />
// //                 ) : (
// //                   <div style={styles.uploadPlaceholder}>
// //                     <span style={styles.uploadIcon}>📷</span>
// //                     <span>上傳圖片</span>
// //                   </div>
// //                 )}
// //               </label>
// //             </div>
// //           </div>

// //           {/* 設定部門階層 */}
// //           <div style={styles.formGroup}>
// //             <label style={styles.label}>設定部門階層</label>
// //             <div style={styles.hierarchyNote}>
// //               註：可以同時設定上一級和下一級部門
// //             </div>
            
// //             {/* 上一級 */}
// //             <div style={styles.hierarchyRow}>
// //               <span style={styles.hierarchyLabel}>上一級</span>
// //               <select
// //                 name="parentDepartment"
// //                 value={formData.parentDepartment}
// //                 onChange={handleInputChange}
// //                 style={styles.select}
// //               >
// //                 <option value="">選擇</option>
// //                 {departments.map(dept => (
// //                   <option key={dept.id} value={dept.id}>
// //                     {dept.department}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* 下一級 */}
// //             <div style={styles.hierarchyRow}>
// //               <span style={styles.hierarchyLabel}>下一級</span>
// //               <select
// //                 name="subDepartment"
// //                 value={formData.subDepartment}
// //                 onChange={handleInputChange}
// //                 style={styles.select}
// //               >
// //                 <option value="">選擇</option>
// //                 {departments.map(dept => (
// //                   <option key={dept.id} value={dept.id}>
// //                     {dept.department}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           {/* 錯誤訊息 */}
// //           {error && (
// //             <div style={styles.errorMessage}>
// //               {error}
// //             </div>
// //           )}

// //           {/* 按鈕群組 */}
// //           <div style={styles.buttonGroup}>
// //             <button
// //               type="button"
// //               onClick={handleClose}
// //               style={styles.cancelBtn}
// //               onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
// //               onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
// //             >
// //               取消
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={loading || !formData.departmentName.trim()}
// //               style={{
// //                 ...styles.confirmBtn,
// //                 ...(loading || !formData.departmentName.trim() ? styles.confirmBtnDisabled : {})
// //               }}
// //               onMouseEnter={(e) => {
// //                 if (!loading && formData.departmentName.trim()) {
// //                   e.target.style.backgroundColor = '#3a76d8';
// //                 }
// //               }}
// //               onMouseLeave={(e) => {
// //                 if (!loading && formData.departmentName.trim()) {
// //                   e.target.style.backgroundColor = '#4a86e8';
// //                 }
// //               }}
// //             >
// //               {loading ? '新增中...' : '確認'}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NewDepartments;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { API_BASE_URL } from '../../config'; // 引入配置

// const NewDepartments = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     departmentName: '',
//     departmentImage: null,
//     parentDepartment: '',
//     subDepartment: ''
//   });
  
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // 獲取現有部門列表（用於階層設定）
//   useEffect(() => {
//     if (isOpen) {
//       fetchDepartments();
//     }
//   }, [isOpen]);

//   const fetchDepartments = async () => {
//     try {
//       const companyId = Cookies.get('company_id') || '76014406';
//       const response = await axios.get(`${API_BASE_URL}/api/departments?company_id=${companyId}`);
      
//       if (response.data.Status === 'Ok') {
//         setDepartments(response.data.Data || []);
//       }
//     } catch (err) {
//       console.error('獲取部門列表失敗:', err);
//     }
//   };

//   // 修改 handleInputChange - 移除互斥邏輯
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         departmentImage: file
//       }));
      
//       // 建立預覽
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.departmentName.trim()) {
//       setError('請輸入部門名稱');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const companyId = Cookies.get('company_id') || '76014406';
      
//       // 準備提交資料 - 明確設定所有欄位
//       const submitData = {
//         department: formData.departmentName.trim(),
//         company_id: parseInt(companyId),
//         upperLayer: formData.parentDepartment ? parseInt(formData.parentDepartment) : null,
//         NextLayer: formData.subDepartment ? parseInt(formData.subDepartment) : null
//       };

//       console.log('=== 前端提交資料 ===');
//       console.log('formData.parentDepartment:', formData.parentDepartment);
//       console.log('formData.subDepartment:', formData.subDepartment);
//       console.log('submitData:', JSON.stringify(submitData, null, 2));

//       const response = await axios.post(`${API_BASE_URL}/api/departments`, submitData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       console.log('=== 後端回應 ===');
//       console.log('response.data:', response.data);

//       if (response.data.Status === 'Ok') {
//         // 成功後重置表單
//         setFormData({
//           departmentName: '',
//           departmentImage: null,
//           parentDepartment: '',
//           subDepartment: ''
//         });
//         setImagePreview(null);
        
//         // 通知父組件更新
//         if (onSuccess) {
//           onSuccess();
//         }
        
//         // 關閉對話框
//         onClose();
//       } else {
//         setError(response.data.Msg || '新增部門失敗');
//       }
//     } catch (err) {
//       console.error('新增部門失敗:', err);
//       setError(err.response?.data?.Msg || '新增部門失敗，請稍後再試');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     // 重置表單
//     setFormData({
//       departmentName: '',
//       departmentImage: null,
//       parentDepartment: '',
//       subDepartment: ''
//     });
//     setImagePreview(null);
//     setError(null);
//     onClose();
//   };

//   // CSS 樣式
//   const styles = {
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 1000
//     },
//     modal: {
//       backgroundColor: 'white',
//       borderRadius: '12px',
//       padding: '24px',
//       width: '400px',
//       maxWidth: '90vw',
//       maxHeight: '90vh',
//       overflow: 'auto',
//       boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '20px',
//       paddingBottom: '12px',
//       borderBottom: '1px solid #e0e0e0'
//     },
//     title: {
//       margin: 0,
//       fontSize: '18px',
//       fontWeight: '600',
//       color: '#333'
//     },
//     closeBtn: {
//       background: 'none',
//       border: 'none',
//       fontSize: '24px',
//       cursor: 'pointer',
//       color: '#999',
//       padding: '0',
//       width: '30px',
//       height: '30px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       borderRadius: '50%',
//       transition: 'all 0.2s ease'
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '20px'
//     },
//     formGroup: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '8px'
//     },
//     label: {
//       fontSize: '14px',
//       fontWeight: '500',
//       color: '#4a86e8',
//       marginBottom: '4px'
//     },
//     input: {
//       padding: '12px',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       fontSize: '14px',
//       outline: 'none',
//       transition: 'border-color 0.2s ease'
//     },
//     imageUploadContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     imageUploadBtn: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '120px',
//       height: '120px',
//       border: '2px dashed #ddd',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       transition: 'all 0.2s ease',
//       backgroundColor: '#fafafa'
//     },
//     uploadPlaceholder: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       gap: '8px',
//       color: '#999'
//     },
//     uploadIcon: {
//       fontSize: '24px'
//     },
//     imagePreview: {
//       width: '100%',
//       height: '100%',
//       objectFit: 'cover',
//       borderRadius: '6px'
//     },
//     hierarchyRow: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px',
//       marginBottom: '8px'
//     },
//     hierarchyLabel: {
//       fontSize: '14px',
//       color: '#666',
//       minWidth: '60px'
//     },
//     select: {
//       flex: 1,
//       padding: '8px 12px',
//       border: '1px solid #ddd',
//       borderRadius: '6px',
//       fontSize: '14px',
//       outline: 'none',
//       backgroundColor: 'white',
//       cursor: 'pointer'
//     },
//     hierarchyNote: {
//       fontSize: '12px',
//       color: '#666',
//       fontStyle: 'italic',
//       marginTop: '4px'
//     },
//     errorMessage: {
//       color: '#e74c3c',
//       fontSize: '14px',
//       marginTop: '8px',
//       padding: '8px 12px',
//       backgroundColor: '#fdf2f2',
//       border: '1px solid #fecaca',
//       borderRadius: '6px'
//     },
//     buttonGroup: {
//       display: 'flex',
//       gap: '12px',
//       justifyContent: 'flex-end',
//       marginTop: '20px'
//     },
//     cancelBtn: {
//       padding: '10px 20px',
//       border: '1px solid #ddd',
//       borderRadius: '6px',
//       backgroundColor: 'white',
//       color: '#666',
//       cursor: 'pointer',
//       fontSize: '14px',
//       transition: 'all 0.2s ease'
//     },
//     confirmBtn: {
//       padding: '10px 20px',
//       border: 'none',
//       borderRadius: '6px',
//       backgroundColor: '#4a86e8',
//       color: 'white',
//       cursor: 'pointer',
//       fontSize: '14px',
//       transition: 'all 0.2s ease',
//       minWidth: '80px'
//     },
//     confirmBtnDisabled: {
//       backgroundColor: '#ccc',
//       cursor: 'not-allowed'
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div style={styles.overlay} onClick={handleClose}>
//       <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div style={styles.header}>
//           <h3 style={styles.title}>新增部門</h3>
//           <button 
//             style={styles.closeBtn}
//             onClick={handleClose}
//             type="button"
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//           >
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           {/* 部門名稱 */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>部門名稱</label>
//             <input
//               type="text"
//               name="departmentName"
//               value={formData.departmentName}
//               onChange={handleInputChange}
//               placeholder="請輸入部門名稱"
//               style={{
//                 ...styles.input,
//                 borderColor: formData.departmentName ? '#4a86e8' : '#ddd'
//               }}
//               onFocus={(e) => e.target.style.borderColor = '#4a86e8'}
//               onBlur={(e) => e.target.style.borderColor = formData.departmentName ? '#4a86e8' : '#ddd'}
//               required
//             />
//           </div>

//           {/* 部門圖片 */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>部門圖片</label>
//             <div style={styles.imageUploadContainer}>
//               <input
//                 type="file"
//                 id="departmentImage"
//                 name="departmentImage"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{ display: 'none' }}
//               />
//               <label 
//                 htmlFor="departmentImage" 
//                 style={styles.imageUploadBtn}
//                 onMouseEnter={(e) => e.target.style.borderColor = '#4a86e8'}
//                 onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
//               >
//                 {imagePreview ? (
//                   <img src={imagePreview} alt="預覽" style={styles.imagePreview} />
//                 ) : (
//                   <div style={styles.uploadPlaceholder}>
//                     <span style={styles.uploadIcon}>📷</span>
//                     <span>上傳圖片</span>
//                   </div>
//                 )}
//               </label>
//             </div>
//           </div>

//           {/* 設定部門階層 */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>設定部門階層</label>
//             <div style={styles.hierarchyNote}>
//               註：可以同時設定上一級和下一級部門
//             </div>
            
//             {/* 上一級 */}
//             <div style={styles.hierarchyRow}>
//               <span style={styles.hierarchyLabel}>上一級</span>
//               <select
//                 name="parentDepartment"
//                 value={formData.parentDepartment}
//                 onChange={handleInputChange}
//                 style={styles.select}
//               >
//                 <option value="">選擇</option>
//                 {departments.map(dept => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.department}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* 下一級 */}
//             <div style={styles.hierarchyRow}>
//               <span style={styles.hierarchyLabel}>下一級</span>
//               <select
//                 name="subDepartment"
//                 value={formData.subDepartment}
//                 onChange={handleInputChange}
//                 style={styles.select}
//               >
//                 <option value="">選擇</option>
//                 {departments.map(dept => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.department}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* 錯誤訊息 */}
//           {error && (
//             <div style={styles.errorMessage}>
//               {error}
//             </div>
//           )}

//           {/* 按鈕群組 */}
//           <div style={styles.buttonGroup}>
//             <button
//               type="button"
//               onClick={handleClose}
//               style={styles.cancelBtn}
//               onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
//               onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
//             >
//               取消
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !formData.departmentName.trim()}
//               style={{
//                 ...styles.confirmBtn,
//                 ...(loading || !formData.departmentName.trim() ? styles.confirmBtnDisabled : {})
//               }}
//               onMouseEnter={(e) => {
//                 if (!loading && formData.departmentName.trim()) {
//                   e.target.style.backgroundColor = '#3a76d8';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!loading && formData.departmentName.trim()) {
//                   e.target.style.backgroundColor = '#4a86e8';
//                 }
//               }}
//             >
//               {loading ? '新增中...' : '確認'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewDepartments;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../config'; // 引入配置

const NewDepartments = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentImage: null,
    parentDepartment: '',
    subDepartment: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 🔥 新增：權限相關狀態
  const [currentUserPermissions, setCurrentUserPermissions] = useState(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  // 🔥 新增：檢查當前登入使用者的權限
  const checkCurrentUserPermissions = async () => {
    try {
      const companyId = Cookies.get('company_id');
      const currentUserId = Cookies.get('employee_id'); // 🔥 當前登入使用者的ID
      
      if (!companyId || !currentUserId) {
        return {
          success: false,
          message: '無法獲取公司ID或使用者ID',
          hasEditPermission: false
        };
      }
      
      console.log('🔍 檢查當前使用者新增部門的權限:', currentUserId);
      
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

      console.log('🔍 當前使用者新增部門權限檢查 API 回應:', response.data);
      
      if (response.data && response.data.Status === 'Ok') {
        // 🔥 從 raw_data 中讀取權限
        const rawData = response.data.Data?.raw_data;
        const hasPermission = rawData?.employee_data === 1 || rawData?.employee_data === '1';
        
        console.log('🔍 當前使用者新增部門原始權限資料:', rawData);
        console.log('🔍 employee_data 權限值:', rawData?.employee_data);
        console.log('🔍 新增部門最終權限判斷:', hasPermission);
        
        return {
          success: true,
          permissions: rawData,
          hasEditPermission: hasPermission
        };
      } else {
        return {
          success: false,
          message: response.data?.Msg || '權限檢查失敗',
          hasEditPermission: false
        };
      }
    } catch (error) {
      console.error('❌ 新增部門權限檢查 API 錯誤:', error);
      return {
        success: false,
        message: error.message || '權限檢查失敗',
        hasEditPermission: false
      };
    }
  };

  // 🔥 新增：檢查當前使用者權限
  useEffect(() => {
    const loadCurrentUserPermissions = async () => {
      if (isOpen) { // 🔥 只在彈窗開啟時檢查
        setPermissionLoading(true);
        setPermissionError('');
        
        try {
          const result = await checkCurrentUserPermissions();
          
          if (result.success) {
            setCurrentUserPermissions(result.permissions);
            setHasEditPermission(result.hasEditPermission);
            console.log('✅ 當前使用者新增部門權限檢查成功:', result.permissions);
            console.log('✅ 新增部門編輯權限:', result.hasEditPermission ? '有權限' : '無權限');
          } else {
            setPermissionError(result.message);
            setHasEditPermission(false);
            console.error('❌ 當前使用者新增部門權限檢查失敗:', result.message);
          }
        } catch (error) {
          setPermissionError('權限檢查發生錯誤');
          setHasEditPermission(false);
          console.error('❌ 當前使用者新增部門權限檢查異常:', error);
        } finally {
          setPermissionLoading(false);
        }
      }
    };

    loadCurrentUserPermissions();
  }, [isOpen]); // 🔥 依賴 isOpen，每次彈窗開啟時檢查

  // 獲取現有部門列表（用於階層設定）
  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      const companyId = Cookies.get('company_id') || '76014406';
      const response = await axios.get(`${API_BASE_URL}/api/departments?company_id=${companyId}`);
      
      if (response.data.Status === 'Ok') {
        setDepartments(response.data.Data || []);
      }
    } catch (err) {
      console.error('獲取部門列表失敗:', err);
    }
  };

  // 🔥 修正：處理輸入變更 - 加入權限檢查
  const handleInputChange = (e) => {
    if (!hasEditPermission) {
      return; // 🔥 無權限時不允許修改
    }

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔥 修正：處理圖片變更 - 加入權限檢查
  const handleImageChange = (e) => {
    if (!hasEditPermission) {
      alert('您沒有權限新增部門');
      return;
    }

    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        departmentImage: file
      }));
      
      // 建立預覽
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔥 修正：處理表單提交 - 加入權限檢查
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasEditPermission) {
      alert('您沒有權限新增部門');
      return;
    }
    
    if (!formData.departmentName.trim()) {
      setError('請輸入部門名稱');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const companyId = Cookies.get('company_id') || '76014406';
      
      // 準備提交資料 - 明確設定所有欄位
      const submitData = {
        department: formData.departmentName.trim(),
        company_id: parseInt(companyId),
        upperLayer: formData.parentDepartment ? parseInt(formData.parentDepartment) : null,
        NextLayer: formData.subDepartment ? parseInt(formData.subDepartment) : null
      };

      console.log('=== 前端提交資料 ===');
      console.log('formData.parentDepartment:', formData.parentDepartment);
      console.log('formData.subDepartment:', formData.subDepartment);
      console.log('submitData:', JSON.stringify(submitData, null, 2));

      const response = await axios.post(`${API_BASE_URL}/api/departments`, submitData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('=== 後端回應 ===');
      console.log('response.data:', response.data);

      if (response.data.Status === 'Ok') {
        // 成功後重置表單
        setFormData({
          departmentName: '',
          departmentImage: null,
          parentDepartment: '',
          subDepartment: ''
        });
        setImagePreview(null);
        
        // 通知父組件更新
        if (onSuccess) {
          onSuccess();
        }
        
        // 關閉對話框
        onClose();
      } else {
        setError(response.data.Msg || '新增部門失敗');
      }
    } catch (err) {
      console.error('新增部門失敗:', err);
      setError(err.response?.data?.Msg || '新增部門失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // 重置表單
    setFormData({
      departmentName: '',
      departmentImage: null,
      parentDepartment: '',
      subDepartment: ''
    });
    setImagePreview(null);
    setError(null);
    onClose();
  };

  // CSS 樣式
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      width: '400px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#999',
      padding: '0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.2s ease'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a86e8',
      marginBottom: '4px'
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    imageUploadContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    imageUploadBtn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '120px',
      height: '120px',
      border: '2px dashed #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: '#fafafa'
    },
    uploadPlaceholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      color: '#999'
    },
    uploadIcon: {
      fontSize: '24px'
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '6px'
    },
    hierarchyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    hierarchyLabel: {
      fontSize: '14px',
      color: '#666',
      minWidth: '60px'
    },
    select: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    hierarchyNote: {
      fontSize: '12px',
      color: '#666',
      fontStyle: 'italic',
      marginTop: '4px'
    },
    errorMessage: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '8px',
      padding: '8px 12px',
      backgroundColor: '#fdf2f2',
      border: '1px solid #fecaca',
      borderRadius: '6px'
    },
    // 🔥 新增：權限相關樣式
    permissionMessage: {
      padding: '15px',
      borderRadius: '6px',
      marginBottom: '15px',
      textAlign: 'center'
    },
    permissionError: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7'
    },
    permissionWarning: {
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      border: '1px solid #dee2e6'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    cancelBtn: {
      padding: '10px 20px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      color: '#666',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    },
    confirmBtn: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#4a86e8',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      minWidth: '80px'
    },
    confirmBtnDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    }
  };

  if (!isOpen) return null;

  // 🔥 權限載入中顯示
  if (permissionLoading) {
    return (
      <div style={styles.overlay} onClick={handleClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h3 style={styles.title}>新增部門</h3>
            <button 
              style={styles.closeBtn}
              onClick={handleClose}
              type="button"
            >
              ×
            </button>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#666'
          }}>
            檢查權限中...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {hasEditPermission ? '新增部門' : '查看部門設定'}
          </h3>
          <button 
            style={styles.closeBtn}
            onClick={handleClose}
            type="button"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* 🔥 權限錯誤訊息顯示 */}
        {permissionError && (
          <div style={{...styles.permissionMessage, ...styles.permissionError}}>
            <strong>權限警告：</strong>{permissionError}
          </div>
        )}

        {/* 🔥 無權限提示 */}
        {!hasEditPermission && !permissionLoading && (
          <div style={{...styles.permissionMessage, ...styles.permissionWarning}}>
            <strong>提示：</strong>您目前沒有新增部門的權限，僅能查看設定
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* 🔥 修正：部門名稱 - 加入權限檢查 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>部門名稱</label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
              placeholder={hasEditPermission ? "請輸入部門名稱" : "無權限編輯"}
              disabled={!hasEditPermission}
              style={{
                ...styles.input,
                borderColor: formData.departmentName ? '#4a86e8' : '#ddd',
                backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                cursor: !hasEditPermission ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => hasEditPermission && (e.target.style.borderColor = '#4a86e8')}
              onBlur={(e) => hasEditPermission && (e.target.style.borderColor = formData.departmentName ? '#4a86e8' : '#ddd')}
              required={hasEditPermission}
            />
          </div>

          {/* 🔥 修正：部門圖片 - 加入權限檢查 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>部門圖片</label>
            <div style={styles.imageUploadContainer}>
              <input
                type="file"
                id="departmentImage"
                name="departmentImage"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!hasEditPermission}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="departmentImage" 
                style={{
                  ...styles.imageUploadBtn,
                  cursor: hasEditPermission ? 'pointer' : 'not-allowed',
                  opacity: hasEditPermission ? 1 : 0.6
                }}
                onMouseEnter={(e) => hasEditPermission && (e.target.style.borderColor = '#4a86e8')}
                onMouseLeave={(e) => hasEditPermission && (e.target.style.borderColor = '#ddd')}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="預覽" style={styles.imagePreview} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <span style={styles.uploadIcon}>📷</span>
                    <span>{hasEditPermission ? '上傳圖片' : '無權限上傳'}</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* 🔥 修正：設定部門階層 - 加入權限檢查 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>設定部門階層</label>
            <div style={styles.hierarchyNote}>
              註：可以同時設定上一級和下一級部門
            </div>
            
            {/* 上一級 */}
            <div style={styles.hierarchyRow}>
              <span style={styles.hierarchyLabel}>上一級</span>
              <select
                name="parentDepartment"
                value={formData.parentDepartment}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
                style={{
                  ...styles.select,
                  backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                  cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">{hasEditPermission ? '選擇' : '無權限選擇'}</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>

            {/* 下一級 */}
            <div style={styles.hierarchyRow}>
              <span style={styles.hierarchyLabel}>下一級</span>
              <select
                name="subDepartment"
                value={formData.subDepartment}
                onChange={handleInputChange}
                disabled={!hasEditPermission}
                style={{
                  ...styles.select,
                  backgroundColor: !hasEditPermission ? '#f8f9fa' : 'white',
                  cursor: !hasEditPermission ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">{hasEditPermission ? '選擇' : '無權限選擇'}</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 錯誤訊息 */}
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* 🔥 修正：按鈕群組 - 加入權限檢查 */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              style={styles.cancelBtn}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !formData.departmentName.trim() || !hasEditPermission}
              style={{
                ...styles.confirmBtn,
                ...(loading || !formData.departmentName.trim() || !hasEditPermission ? styles.confirmBtnDisabled : {}),
                opacity: hasEditPermission ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (!loading && formData.departmentName.trim() && hasEditPermission) {
                  e.target.style.backgroundColor = '#3a76d8';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && formData.departmentName.trim() && hasEditPermission) {
                  e.target.style.backgroundColor = '#4a86e8';
                }
              }}
            >
              {!hasEditPermission ? '無新增權限' :
               loading ? '新增中...' : '確認'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDepartments;
