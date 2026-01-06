// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import './Fake_Records.css';

// // const FakeRecords = ({ employee }) => {
// //   // 狀態管理
// //   const [leaveRecords, setLeaveRecords] = useState([]);
// //   const [leaveTypes, setLeaveTypes] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedRequest, setSelectedRequest] = useState(null);

// // // 直接在組件內添加 formatFormNumber 函數
// // const formatFormNumber = (formNumber) => {
// //   if (!formNumber) return `B${Date.now()}`;
  
// //   const formNumberStr = String(formNumber);
  
// //   // 如果是 B-FORM-20250924163343-4292347302 這種格式
// //   if (formNumberStr.startsWith('B-FORM-')) {
// //     // 移除 'B-FORM-' 前綴，取得後面的部分
// //     const withoutPrefix = formNumberStr.replace('B-FORM-', '');
// //     // 取第一個連字符前的部分 (日期時間部分)
// //     const datePart = withoutPrefix.split('-')[0];
// //     // 返回 B + 日期時間部分
// //     return `B${datePart}`;
// //   }
  
// //   // 如果已經是 B 開頭的格式，直接返回
// //   if (formNumberStr.startsWith('B') && !formNumberStr.startsWith('B-FORM-')) {
// //     return formNumberStr;
// //   }
  
// //   // 其他情況，直接加 B 前綴
// //   return `B${formNumberStr}`;
// // };


// //   // 添加調試日誌
// //   useEffect(() => {
// //     console.log('FakeRecords 接收到的 employee 資訊:', employee);
// //     console.log('employee 類型:', typeof employee);
// //     console.log('employee 內容:', JSON.stringify(employee, null, 2));
// //   }, [employee]);

// //   // 格式化日期時間函數
// //   const formatDateTime = (dateTimeStr) => {
// //     if (!dateTimeStr) return "未記錄";
// //     const date = new Date(dateTimeStr);
// //     if (isNaN(date.getTime())) return dateTimeStr;
    
// //     return date.toLocaleString('zh-TW', {
// //       year: 'numeric',
// //       month: '2-digit',
// //       day: '2-digit',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       hour12: false
// //     }).replace(/\//g, '-');
// //   };

// //   // API 調用
// //   useEffect(() => {
// //     console.log('開始處理員工資訊...');
    
// //     // 檢查員工資訊的多種可能格式
// //     if (!employee) {
// //       console.log('沒有提供員工資訊');
// //       setError('沒有提供員工資訊');
// //       setLoading(false);
// //       return;
// //     }

// //     // 支援多種員工資訊格式
// //     let companyId, employeeId, employeeName;
    
// //     // 檢查不同的可能屬性名稱
// //     if (employee.companyId || employee.company_id) {
// //       companyId = employee.companyId || employee.company_id;
// //     }
    
// //     if (employee.employeeId || employee.employee_id || employee.id) {
// //       employeeId = employee.employeeId || employee.employee_id || employee.id;
// //     }
    
// //     if (employee.employeeName || employee.employee_name || employee.name) {
// //       employeeName = employee.employeeName || employee.employee_name || employee.name;
// //     }

// //     // 如果還是沒有找到，嘗試從其他可能的屬性中獲取
// //     if (!companyId && employee.統編) {
// //       companyId = employee.統編;
// //     }
    
// //     if (!employeeId && employee.員工編號) {
// //       employeeId = employee.員工編號;
// //     }
    
// //     if (!employeeName && employee.姓名) {
// //       employeeName = employee.姓名;
// //     }

// //     console.log('解析後的員工資訊:', {
// //       companyId,
// //       employeeId,
// //       employeeName,
// //       originalEmployee: employee
// //     });

// //     // 檢查必要欄位
// //     if (!companyId) {
// //       console.log('缺少公司ID');
// //       setError('缺少公司ID');
// //       setLoading(false);
// //       return;
// //     }

// //     if (!employeeId) {
// //       console.log('缺少員工ID');
// //       setError('缺少員工ID');
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchLeaveRequests = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
        
// //         console.log(`正在查詢員工 ${employeeId} 的請假申請...`);
// //         console.log('公司ID:', companyId);
        
// //         // 調用 API
// //         const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/advanced-search', {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({
// //             company_id: parseInt(companyId),
// //             employee_id: String(employeeId), // 確保是字符串格式
// //             category: "leave",
// //             includeDetails: true
// //           })
// //         });
        
// //         console.log('發送的請求參數:', {
// //           company_id: parseInt(companyId),
// //           employee_id: String(employeeId),
// //           category: "leave",
// //           includeDetails: true
// //         });
        
// //         if (!response.ok) {
// //           throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
// //         }
        
// //         const data = await response.json();
// //         console.log('API 完整回應:', data);
        
// //         if (data.Status !== "Ok") {
// //           throw new Error(data.Msg || "查詢失敗");
// //         }
        
// //         if (!data.Data || data.Data.length === 0) {
// //           console.log('沒有找到請假申請數據');
// //           setLeaveRecords([]);
// //           setLoading(false);
// //           return;
// //         }
        
// //         // 過濾當前員工的申請 - 支援多種格式比較
// //         const currentEmployeeRequests = data.Data.filter(item => {
// //           const itemEmployeeId = String(item.employee_id);
// //           const currentEmployeeId = String(employeeId);
          
// //           console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
          
// //           // 嘗試多種比較方式
// //           return itemEmployeeId === currentEmployeeId || 
// //                  itemEmployeeId === employeeId ||
// //                  item.employee_id === employeeId ||
// //                  String(item.employee_id) === String(employeeId);
// //         });
        
// //         console.log(`過濾前共 ${data.Data.length} 筆申請`);
// //         console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的請假申請`);
        
// //         if (currentEmployeeRequests.length === 0) {
// //           console.log('當前員工沒有請假申請');
// //           console.log('所有申請的員工ID:', data.Data.map(item => ({
// //             employee_id: item.employee_id,
// //             employee_name: item.employee_name
// //           })));
// //           setLeaveRecords([]);
// //           setLoading(false);
// //           return;
// //         }
        
// //         // 處理回應數據
// //         const userLeaveRequests = currentEmployeeRequests.map((item, index) => {
// //           console.log('處理申請項目:', item);
          
// //           // 狀態映射
// //           let statusText = "簽核中";
// //           const currentStatus = item.status || '';
// //           const statusLower = currentStatus.toLowerCase();
          
// //           if (statusLower === 'approved' || statusLower === 'ok' || statusLower === '已完成' || statusLower === '1') {
// //             statusText = "已通過";
// //           } else if (statusLower === 'rejected' || statusLower === 'no' || statusLower === '未通過' || statusLower === '2') {
// //             statusText = "未通過";
// //           } else if (statusLower === 'pending' || statusLower === '待審核' || statusLower === 'approved_pending_hr') {
// //             statusText = "簽核中";
// //           }

// //           // 格式化申請日期
// //           let submitTime = "未記錄";
// //           if (item.application_date) {
// //             submitTime = formatDateTime(item.application_date);
// //           }
          
// //           // 請假類型映射
// //           const leaveTypeMap = {
// //             'compensatory_leave': { name: '換休', short: '換' },
// //             'annual_leave': { name: '特休', short: '特' },
// //             'personal_leave': { name: '事假', short: '事' },
// //             'sick_leave': { name: '病假', short: '病' },
// //             'menstrual_leave': { name: '生理假', short: '理' },
// //             'makeup_leave': { name: '補休', short: '補' },
// //             'official_leave': { name: '公假', short: '公' },
// //             'marriage_leave': { name: '婚假', short: '婚' },
// //             'prenatal_checkup_leave': { name: '產檢假', short: '檢' },
// //             'maternity_leave': { name: '產假', short: '產' },
// //             'paternity_leave': { name: '陪產假', short: '陪' },
// //             'study_leave': { name: '溫書假', short: '書' },
// //             'birthday_leave': { name: '生日假', short: '生日' }
// //           };
          
// //           // 處理請假類型
// //           let leaveTypeName = "未指定";
// //           let leaveTypeShort = "未";
          
// //           if (item.type) {
// //             if (leaveTypeMap[item.type]) {
// //               leaveTypeName = leaveTypeMap[item.type].name;
// //               leaveTypeShort = leaveTypeMap[item.type].short;
// //             } else {
// //               leaveTypeName = item.type;
// //               leaveTypeShort = item.type.substring(0, 1);
// //             }
// //           } else if (item.details && item.details.type) {
// //             if (leaveTypeMap[item.details.type]) {
// //               leaveTypeName = leaveTypeMap[item.details.type].name;
// //               leaveTypeShort = leaveTypeMap[item.details.type].short;
// //             } else {
// //               leaveTypeName = item.details.type;
// //               leaveTypeShort = item.details.type.substring(0, 1);
// //             }
// //           }
          
// //           // 處理請假原因
// //           let reason = "未填寫";
// //           if (item.details && item.details.illustrate) {
// //             reason = item.details.illustrate;
// //           } else if (item.description) {
// //             reason = item.description;
// //           }
          
// //           // 格式化請假時間
// //           let startDateTime = "未指定";
// //           let endDateTime = "未指定";
// //           let totalTime = "0小時 0分鐘";
          
// //           if (item.details) {
// //             const formatTime = (timeStr) => {
// //               if (!timeStr) return '';
// //               return timeStr.split(':').slice(0, 2).join(':');
// //             };
            
// //             if (item.details.start_date && item.details.start_time) {
// //               startDateTime = `${item.details.start_date} ${formatTime(item.details.start_time)}`;
// //             }
            
// //             if (item.details.end_date && item.details.end_time) {
// //               endDateTime = `${item.details.end_date} ${formatTime(item.details.end_time)}`;
// //             } else {
// //               endDateTime = startDateTime;
// //             }
            
// //             if (item.details.total_calculation_hours) {
// //               const hours = Math.floor(item.details.total_calculation_hours);
// //               const minutes = Math.round((item.details.total_calculation_hours - hours) * 60);
// //               totalTime = `${hours}小時${minutes}分鐘`;
// //             }
// //           }
          
// // // 使用本地的 formatFormNumber 函數，與 LeavePage 邏輯一致
// // const formNumber = item.form_number ? 
// //   formatFormNumber(item.form_number) : 
// //   `B${Date.now()}${index}`;


// //           return {
// //             id: formNumber, // 使用修改後的表單編號
// //             status: statusText,
// //             originalStatus: currentStatus,
// //             submitTime: submitTime,
// //             startTime: startDateTime,
// //             endTime: endDateTime,
// //             totalTime: totalTime,
// //             employee: item.employee_id || employeeId,
// //             employeeName: item.employee_name || employeeName || "員工",
// //             leaveType: leaveTypeName,
// //             leaveTypeShort: leaveTypeShort,
// //             reason: reason,
// //             reviewer: item.reviewer,
// //             originalData: item,
// //             details: item.details || null
// //           };
// //         });
        
// //         console.log(`成功處理 ${userLeaveRequests.length} 筆請假申請`);
// //         console.log('處理後的申請列表:', userLeaveRequests);
// //         setLeaveRecords(userLeaveRequests);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("獲取請假申請失敗:", err);
// //         setError(`API 調用失敗: ${err.message}`);
// //         setLoading(false);
// //       }
// //     };
    
// //     fetchLeaveRequests();
// //   }, [employee]);

// //   // 初始化假別資料
// //   useEffect(() => {
// //     const mockLeaveTypes = [
// //       { name: '特休', remaining: 0, unit: 'hours' },
// //       { name: '病假', remaining: 0, unit: 'hours' },
// //       { name: '事假', remaining: 0, unit: 'hours' },
// //       { name: '婚假', remaining: 0, unit: 'hours' },
// //       { name: '喪假', remaining: 0, unit: 'hours' },
// //       { name: '產假', remaining: 0, unit: 'hours' },
// //       { name: '陪產假', remaining: 0, unit: 'hours' },
// //       { name: '家庭照顧假', remaining: 0, unit: 'hours' },
// //       { name: '生理假', remaining: 0, unit: 'hours' },
// //       { name: '公假', remaining: 0, unit: 'hours' },
// //       { name: '公傷假', remaining: 0, unit: 'hours' },
// //       { name: '颱風假', remaining: 0, unit: 'hours' },
// //       { name: '疫苗假', remaining: 0, unit: 'hours' },
// //       { name: '隔離假', remaining: 0, unit: 'hours' },
// //       { name: '防疫照顧假', remaining: 0, unit: 'hours' },
// //       { name: '年假', remaining: 0, unit: 'hours' }
// //     ];
// //     setLeaveTypes(mockLeaveTypes);
// //   }, []);

// //   // 獲取狀態樣式
// //   const getStatusStyle = (status) => {
// //     switch (status) {
// //       case '簽核中':
// //         return { backgroundColor: '#919191', borderColor: '#919191', iconColor: '#919191', text: '簽核中' };
// //       case '未通過':
// //         return { backgroundColor: '#F44336', borderColor: '#F44336', iconColor: '#F44336', text: '未通過' };
// //       case '已通過':
// //         return { backgroundColor: '#3AA672', borderColor: '#3AA672', iconColor: '#3AA672', text: '已通過' };
// //       default:
// //         return { backgroundColor: '#919191', borderColor: '#919191', iconColor: '#919191', text: '未知' };
// //     }
// //   };

// //   // 處理點擊申請單
// //   const handleRequestClick = (request) => {
// //     setSelectedRequest(request);
// //     setShowModal(true);
// //   };

// //   // 關閉模態框
// //   const handleCloseModal = () => {
// //     setShowModal(false);
// //     setSelectedRequest(null);
// //   };

// //   // 載入狀態
// //   if (loading) {
// //     return (
// //       <div className="fake-records-loading">
// //         <div className="fake-loading-spinner"></div>
// //         <p>載入中...</p>
// //       </div>
// //     );
// //   }

// //   // 錯誤狀態
// //   if (error) {
// //     return (
// //       <div className="fake-records-error">
// //         <p>載入失敗：{error}</p>
// //         <p>員工資訊：{JSON.stringify(employee)}</p>
// //         <button onClick={() => window.location.reload()}>重新載入</button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fake-records-container">
// //       {/* 左側：請假紀錄 */}
// //       <div className="fake-records-left">
// //         <div className="fake-records-section">
// //           <h3 className="fake-records-title">請假紀錄</h3>
          
// //           <div className="fake-leave-records-list">
// //             {leaveRecords.length === 0 ? (
// //               <div className="fake-mobile-no-records">
// //                 <p>目前沒有請假紀錄</p>
// //                 <p>員工ID: {employee?.employeeId || employee?.employee_id || employee?.id || '未知'}</p>
// //                 <p>公司ID: {employee?.companyId || employee?.company_id || employee?.統編 || '未知'}</p>
// //                 <p>員工姓名: {employee?.employeeName || employee?.employee_name || employee?.name || employee?.姓名 || '未知'}</p>
// //               </div>
// //             ) : (
// //               leaveRecords.map((record) => {
// //                 const statusStyle = getStatusStyle(record.status);
                
// //                 return (
// //                   <div 
// //                     key={record.id} 
// //                     className="fake-leave-record-card"
// //                     onClick={() => handleRequestClick(record)}
// //                     style={{ cursor: 'pointer' }}
// //                   >
// //                     <div className="fake-leave-record-id">{record.id}</div>
// //                     <div className="fake-leave-record-submit-time">
// //                       送出時間：{record.submitTime}
// //                     </div>
// //                     <div className="fake-leave-record-divider"></div>
                    
// //                     <div 
// //                       className="fake-leave-type-circle"
// //                       style={{ borderColor: statusStyle.borderColor }}
// //                     ></div>
// //                     <div 
// //                       className={`fake-leave-type-text ${record.leaveTypeShort.length > 1 ? 'small-text' : ''}`}
// //                       style={{ color: statusStyle.iconColor }}
// //                     >
// //                       {record.leaveTypeShort}
// //                     </div>
                    
// //                     <div className="fake-leave-type-label">
// //                       請假類型：{record.leaveType}
// //                     </div>
// //                     <div className="fake-leave-time-range">
// //                       時間起迄：{record.startTime.split(' ')[0]} {record.startTime.split(' ')[1]}
// //                     </div>
// //                     <div className="fake-leave-end-time">
// //                       {record.endTime.split(' ')[0]} {record.endTime.split(' ')[1]}
// //                     </div>
// //                     <div className="fake-leave-duration">
// //                       請假時數：{record.totalTime}
// //                     </div>
                    
// //                     <div 
// //                       className="fake-leave-status-badge"
// //                       style={{ backgroundColor: statusStyle.backgroundColor }}
// //                     ></div>
// //                     <div className="fake-leave-status-text">{statusStyle.text}</div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>
// //         </div>
// //       </div>
      
// //       {/* 中間分隔線 */}
// //       <div className="fake-records-divider"></div>
      
// //       {/* 右側：法定假別 */}
// //       <div className="fake-records-right">
// //         <div className="fake-records-section">
// //           <h3 className="fake-records-title">法定假別</h3>
// //           <div className="fake-leave-types-grid">
// //             {leaveTypes.slice(0, 15).map((leaveType, index) => (
// //               <div key={index} className="fake-leave-type-card">
// //                 <div className="fake-leave-type-content">
// //                   <div className="fake-leave-type-name">{leaveType.name}</div>
// //                   <div className="fake-leave-type-remaining">
// //                     <span className="fake-remaining-label">剩餘</span>
// //                     <div className="fake-remaining-time">
// //                       <span className="fake-remaining-hours">{leaveType.remaining}</span>
// //                       <span className="fake-remaining-unit">小時</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
        
// //         <div className="fake-records-section fake-company-benefits">
// //           <h3 className="fake-records-title">公司福利假別</h3>
// //           <div className="fake-leave-types-grid">
// //             {leaveTypes.slice(15).map((leaveType, index) => (
// //               <div key={index} className="fake-leave-type-card">
// //                 <div className="fake-leave-type-content">
// //                   <div className="fake-leave-type-name">{leaveType.name}</div>
// //                   <div className="fake-leave-type-remaining">
// //                     <span className="fake-remaining-label">剩餘</span>
// //                     <div className="fake-remaining-time">
// //                       <span className="fake-remaining-hours">{leaveType.remaining}</span>
// //                       <span className="fake-remaining-unit">小時</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* 詳細資訊模態框 */}
// //       {showModal && selectedRequest && (
// //         <div className="fake-modal-overlay" onClick={handleCloseModal}>
// //           <div className="fake-modal-content" onClick={(e) => e.stopPropagation()}>
// //             <div className="fake-modal-header">
// //               <h3>請假申請詳情</h3>
// //               <button className="fake-modal-close" onClick={handleCloseModal}>×</button>
// //             </div>
// //             <div className="fake-modal-body">
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">申請編號：</span>
// //                 <span className="fake-detail-value">{selectedRequest.id}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">申請狀態：</span>
// //                 <span className="fake-detail-value">{selectedRequest.status}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">請假類型：</span>
// //                 <span className="fake-detail-value">{selectedRequest.leaveType}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">開始時間：</span>
// //                 <span className="fake-detail-value">{selectedRequest.startTime}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">結束時間：</span>
// //                 <span className="fake-detail-value">{selectedRequest.endTime}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">請假時數：</span>
// //                 <span className="fake-detail-value">{selectedRequest.totalTime}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">申請原因：</span>
// //                 <span className="fake-detail-value">{selectedRequest.reason}</span>
// //               </div>
// //               <div className="fake-detail-row">
// //                 <span className="fake-detail-label">送出時間：</span>
// //                 <span className="fake-detail-value">{selectedRequest.submitTime}</span>
// //               </div>
// //               {selectedRequest.reviewer && (
// //                 <div className="fake-detail-row">
// //                   <span className="fake-detail-label">審核者：</span>
// //                   <span className="fake-detail-value">{selectedRequest.reviewer}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FakeRecords;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Fake_Records.css';

// const FakeRecords = ({ employee }) => {
//   // 狀態管理
//   const [leaveRecords, setLeaveRecords] = useState([]);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);

// // 修正 formatFormNumber 函數 - 專門處理 FORM- 格式
// const formatFormNumber = (formNumber) => {
//   if (!formNumber) return `B${Date.now()}`;
  
//   const formNumberStr = String(formNumber);
//   console.log('原始表單編號:', formNumberStr); // 調試用
  
//   // 處理 FORM-20251211172124-3230177195 這種格式
//   if (formNumberStr.startsWith('FORM-')) {
//     const withoutPrefix = formNumberStr.replace('FORM-', '');
//     const datePart = withoutPrefix.split('-')[0];
//     const result = `B${datePart}`;
//     console.log('FORM格式處理後:', result); // 調試用
//     return result;
//   }
  
//   // 如果已經是正確的 B 格式，直接返回
//   if (formNumberStr.startsWith('B')) {
//     return formNumberStr;
//   }
  
//   // 其他情況，直接加 B 前綴
//   return `B${formNumberStr}`;
// };


//   // 添加調試日誌
//   useEffect(() => {
//     console.log('FakeRecords 接收到的 employee 資訊:', employee);
//     console.log('employee 類型:', typeof employee);
//     console.log('employee 內容:', JSON.stringify(employee, null, 2));
//   }, [employee]);

//   // 格式化日期時間函數
//   const formatDateTime = (dateTimeStr) => {
//     if (!dateTimeStr) return "未記錄";
//     const date = new Date(dateTimeStr);
//     if (isNaN(date.getTime())) return dateTimeStr;
    
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     }).replace(/\//g, '-');
//   };

//   // API 調用
//   useEffect(() => {
//     console.log('開始處理員工資訊...');
    
//     // 檢查員工資訊的多種可能格式
//     if (!employee) {
//       console.log('沒有提供員工資訊');
//       setError('沒有提供員工資訊');
//       setLoading(false);
//       return;
//     }

//     // 支援多種員工資訊格式
//     let companyId, employeeId, employeeName;
    
//     // 檢查不同的可能屬性名稱
//     if (employee.companyId || employee.company_id) {
//       companyId = employee.companyId || employee.company_id;
//     }
    
//     if (employee.employeeId || employee.employee_id || employee.id) {
//       employeeId = employee.employeeId || employee.employee_id || employee.id;
//     }
    
//     if (employee.employeeName || employee.employee_name || employee.name) {
//       employeeName = employee.employeeName || employee.employee_name || employee.name;
//     }

//     // 如果還是沒有找到，嘗試從其他可能的屬性中獲取
//     if (!companyId && employee.統編) {
//       companyId = employee.統編;
//     }
    
//     if (!employeeId && employee.員工編號) {
//       employeeId = employee.員工編號;
//     }
    
//     if (!employeeName && employee.姓名) {
//       employeeName = employee.姓名;
//     }

//     console.log('解析後的員工資訊:', {
//       companyId,
//       employeeId,
//       employeeName,
//       originalEmployee: employee
//     });

//     // 檢查必要欄位
//     if (!companyId) {
//       console.log('缺少公司ID');
//       setError('缺少公司ID');
//       setLoading(false);
//       return;
//     }

//     if (!employeeId) {
//       console.log('缺少員工ID');
//       setError('缺少員工ID');
//       setLoading(false);
//       return;
//     }

//     const fetchLeaveRequests = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         console.log(`正在查詢員工 ${employeeId} 的請假申請...`);
//         console.log('公司ID:', companyId);
        
//         // 調用 API
//         const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/advanced-search', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             company_id: parseInt(companyId),
//             employee_id: String(employeeId), // 確保是字符串格式
//             category: "leave",
//             includeDetails: true
//           })
//         });
        
//         console.log('發送的請求參數:', {
//           company_id: parseInt(companyId),
//           employee_id: String(employeeId),
//           category: "leave",
//           includeDetails: true
//         });
        
//         if (!response.ok) {
//           throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
//         }
        
//         const data = await response.json();
//         console.log('API 完整回應:', data);
        
//         if (data.Status !== "Ok") {
//           throw new Error(data.Msg || "查詢失敗");
//         }
        
//         if (!data.Data || data.Data.length === 0) {
//           console.log('沒有找到請假申請數據');
//           setLeaveRecords([]);
//           setLoading(false);
//           return;
//         }
        
//         // 過濾當前員工的申請 - 支援多種格式比較
//         const currentEmployeeRequests = data.Data.filter(item => {
//           const itemEmployeeId = String(item.employee_id);
//           const currentEmployeeId = String(employeeId);
          
//           console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
          
//           // 嘗試多種比較方式
//           return itemEmployeeId === currentEmployeeId || 
//                  itemEmployeeId === employeeId ||
//                  item.employee_id === employeeId ||
//                  String(item.employee_id) === String(employeeId);
//         });
        
//         console.log(`過濾前共 ${data.Data.length} 筆申請`);
//         console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的請假申請`);
        
//         if (currentEmployeeRequests.length === 0) {
//           console.log('當前員工沒有請假申請');
//           console.log('所有申請的員工ID:', data.Data.map(item => ({
//             employee_id: item.employee_id,
//             employee_name: item.employee_name
//           })));
//           setLeaveRecords([]);
//           setLoading(false);
//           return;
//         }
        
//         // 處理回應數據
//         const userLeaveRequests = currentEmployeeRequests.map((item, index) => {
//           console.log('處理申請項目:', item);
          
//           // 狀態映射
//           let statusText = "簽核中";
//           const currentStatus = item.status || '';
//           const statusLower = currentStatus.toLowerCase();
          
//           if (statusLower === 'approved' || statusLower === 'ok' || statusLower === '已完成' || statusLower === '1') {
//             statusText = "已通過";
//           } else if (statusLower === 'rejected' || statusLower === 'no' || statusLower === '未通過' || statusLower === '2') {
//             statusText = "未通過";
//           } else if (statusLower === 'pending' || statusLower === '待審核' || statusLower === 'approved_pending_hr') {
//             statusText = "簽核中";
//           }

//           // 格式化申請日期
//           let submitTime = "未記錄";
//           if (item.application_date) {
//             submitTime = formatDateTime(item.application_date);
//           }
          
//           // 請假類型映射
//           const leaveTypeMap = {
//             'compensatory_leave': { name: '換休', short: '換' },
//             'annual_leave': { name: '特休', short: '特' },
//             'personal_leave': { name: '事假', short: '事' },
//             'sick_leave': { name: '病假', short: '病' },
//             'menstrual_leave': { name: '生理假', short: '理' },
//             'makeup_leave': { name: '補休', short: '補' },
//             'official_leave': { name: '公假', short: '公' },
//             'marriage_leave': { name: '婚假', short: '婚' },
//             'prenatal_checkup_leave': { name: '產檢假', short: '檢' },
//             'maternity_leave': { name: '產假', short: '產' },
//             'paternity_leave': { name: '陪產假', short: '陪' },
//             'study_leave': { name: '溫書假', short: '書' },
//             'birthday_leave': { name: '生日假', short: '生日' }
//           };
          
//           // 處理請假類型
//           let leaveTypeName = "未指定";
//           let leaveTypeShort = "未";
          
//           if (item.type) {
//             if (leaveTypeMap[item.type]) {
//               leaveTypeName = leaveTypeMap[item.type].name;
//               leaveTypeShort = leaveTypeMap[item.type].short;
//             } else {
//               leaveTypeName = item.type;
//               leaveTypeShort = item.type.substring(0, 1);
//             }
//           } else if (item.details && item.details.type) {
//             if (leaveTypeMap[item.details.type]) {
//               leaveTypeName = leaveTypeMap[item.details.type].name;
//               leaveTypeShort = leaveTypeMap[item.details.type].short;
//             } else {
//               leaveTypeName = item.details.type;
//               leaveTypeShort = item.details.type.substring(0, 1);
//             }
//           }
          
//           // 處理請假原因
//           let reason = "未填寫";
//           if (item.details && item.details.illustrate) {
//             reason = item.details.illustrate;
//           } else if (item.description) {
//             reason = item.description;
//           }
          
//           // 格式化請假時間
//           let startDateTime = "未指定";
//           let endDateTime = "未指定";
//           let totalTime = "0小時 0分鐘";
          
//           if (item.details) {
//             const formatTime = (timeStr) => {
//               if (!timeStr) return '';
//               return timeStr.split(':').slice(0, 2).join(':');
//             };
            
//             if (item.details.start_date && item.details.start_time) {
//               startDateTime = `${item.details.start_date} ${formatTime(item.details.start_time)}`;
//             }
            
//             if (item.details.end_date && item.details.end_time) {
//               endDateTime = `${item.details.end_date} ${formatTime(item.details.end_time)}`;
//             } else {
//               endDateTime = startDateTime;
//             }
            
//             if (item.details.total_calculation_hours) {
//               const hours = Math.floor(item.details.total_calculation_hours);
//               const minutes = Math.round((item.details.total_calculation_hours - hours) * 60);
//               totalTime = `${hours}小時${minutes}分鐘`;
//             }
//           }
          
//           // 使用本地的 formatFormNumber 函數，與 LeavePage 邏輯一致
//           const formNumber = item.form_number ? 
//             formatFormNumber(item.form_number) : 
//             `B${Date.now()}${index}`;
          
//           return {
//             id: formNumber, // 使用修改後的表單編號
//             status: statusText,
//             originalStatus: currentStatus,
//             submitTime: submitTime,
//             startTime: startDateTime,
//             endTime: endDateTime,
//             totalTime: totalTime,
//             employee: item.employee_id || employeeId,
//             employeeName: item.employee_name || employeeName || "員工",
//             leaveType: leaveTypeName,
//             leaveTypeShort: leaveTypeShort,
//             reason: reason,
//             reviewer: item.reviewer,
//             originalData: item,
//             details: item.details || null
//           };
//         });
        
//         console.log(`成功處理 ${userLeaveRequests.length} 筆請假申請`);
//         console.log('處理後的申請列表:', userLeaveRequests);
//         setLeaveRecords(userLeaveRequests);
//         setLoading(false);
//       } catch (err) {
//         console.error("獲取請假申請失敗:", err);
//         setError(`API 調用失敗: ${err.message}`);
//         setLoading(false);
//       }
//     };
    
//     fetchLeaveRequests();
//   }, [employee]);

//   // 初始化假別資料
//   useEffect(() => {
//     const mockLeaveTypes = [
//       { name: '特休', remaining: 0, unit: 'hours' },
//       { name: '病假', remaining: 0, unit: 'hours' },
//       { name: '事假', remaining: 0, unit: 'hours' },
//       { name: '婚假', remaining: 0, unit: 'hours' },
//       { name: '喪假', remaining: 0, unit: 'hours' },
//       { name: '產假', remaining: 0, unit: 'hours' },
//       { name: '陪產假', remaining: 0, unit: 'hours' },
//       { name: '家庭照顧假', remaining: 0, unit: 'hours' },
//       { name: '生理假', remaining: 0, unit: 'hours' },
//       { name: '公假', remaining: 0, unit: 'hours' },
//       { name: '公傷假', remaining: 0, unit: 'hours' },
//       { name: '颱風假', remaining: 0, unit: 'hours' },
//       { name: '疫苗假', remaining: 0, unit: 'hours' },
//       { name: '隔離假', remaining: 0, unit: 'hours' },
//       { name: '防疫照顧假', remaining: 0, unit: 'hours' },
//       { name: '年假', remaining: 0, unit: 'hours' }
//     ];
//     setLeaveTypes(mockLeaveTypes);
//   }, []);

//   // 獲取狀態樣式
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case '簽核中':
//         return { backgroundColor: '#919191', borderColor: '#919191', iconColor: '#919191', text: '簽核中' };
//       case '未通過':
//         return { backgroundColor: '#F44336', borderColor: '#F44336', iconColor: '#F44336', text: '未通過' };
//       case '已通過':
//         return { backgroundColor: '#3AA672', borderColor: '#3AA672', iconColor: '#3AA672', text: '已通過' };
//       default:
//         return { backgroundColor: '#919191', borderColor: '#919191', iconColor: '#919191', text: '未知' };
//     }
//   };

//   // 處理點擊申請單
//   const handleRequestClick = (request) => {
//     setSelectedRequest(request);
//     setShowModal(true);
//   };

//   // 關閉模態框
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedRequest(null);
//   };

//   // 載入狀態
//   if (loading) {
//     return (
//       <div className="fake-records-loading">
//         <div className="fake-loading-spinner"></div>
//         <p>載入中...</p>
//       </div>
//     );
//   }

//   // 錯誤狀態
//   if (error) {
//     return (
//       <div className="fake-records-error">
//         <p>載入失敗：{error}</p>
//         <p>員工資訊：{JSON.stringify(employee)}</p>
//         <button onClick={() => window.location.reload()}>重新載入</button>
//       </div>
//     );
//   }

//   return (
//     <div className="fake-records-container">
//       {/* 左側：請假紀錄 */}
//       <div className="fake-records-left">
//         <div className="fake-records-section">
//           <h3 className="fake-records-title">請假紀錄</h3>
          
//           <div className="fake-leave-records-list">
//             {leaveRecords.length === 0 ? (
//               <div className="fake-mobile-no-records">
//                 <p>目前沒有請假紀錄</p>
//                 <p>員工ID: {employee?.employeeId || employee?.employee_id || employee?.id || '未知'}</p>
//                 <p>公司ID: {employee?.companyId || employee?.company_id || employee?.統編 || '未知'}</p>
//                 <p>員工姓名: {employee?.employeeName || employee?.employee_name || employee?.name || employee?.姓名 || '未知'}</p>
//               </div>
//             ) : (
//               leaveRecords.map((record) => {
//                 const statusStyle = getStatusStyle(record.status);
                
//                 return (
//                   <div 
//                     key={record.id} 
//                     className="fake-leave-record-card"
//                     onClick={() => handleRequestClick(record)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className="fake-leave-record-id">{record.id}</div>
//                     <div className="fake-leave-record-submit-time">
//                       送出時間：{record.submitTime}
//                     </div>
//                     <div className="fake-leave-record-divider"></div>
                    
//                     <div 
//                       className="fake-leave-type-circle"
//                       style={{ borderColor: statusStyle.borderColor }}
//                     ></div>
//                     <div 
//                       className={`fake-leave-type-text ${record.leaveTypeShort.length > 1 ? 'small-text' : ''}`}
//                       style={{ color: statusStyle.iconColor }}
//                     >
//                       {record.leaveTypeShort}
//                     </div>
                    
//                     <div className="fake-leave-type-label">
//                       請假類型：{record.leaveType}
//                     </div>
//                     <div className="fake-leave-time-range">
//                       時間起迄：{record.startTime.split(' ')[0]} {record.startTime.split(' ')[1]}
//                     </div>
//                     <div className="fake-leave-end-time">
//                       {record.endTime.split(' ')[0]} {record.endTime.split(' ')[1]}
//                     </div>
//                     <div className="fake-leave-duration">
//                       請假時數：{record.totalTime}
//                     </div>
                    
//                     <div 
//                       className="fake-leave-status-badge"
//                       style={{ backgroundColor: statusStyle.backgroundColor }}
//                     ></div>
//                     <div className="fake-leave-status-text">{statusStyle.text}</div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* 中間分隔線 */}
//       <div className="fake-records-divider"></div>
      
//       {/* 右側：法定假別 */}
//       <div className="fake-records-right">
//         <div className="fake-records-section">
//           <h3 className="fake-records-title">法定假別</h3>
//           <div className="fake-leave-types-grid">
//             {leaveTypes.slice(0, 15).map((leaveType, index) => (
//               <div key={index} className="fake-leave-type-card">
//                 <div className="fake-leave-type-content">
//                   <div className="fake-leave-type-name">{leaveType.name}</div>
//                   <div className="fake-leave-type-remaining">
//                     <span className="fake-remaining-label">剩餘</span>
//                     <div className="fake-remaining-time">
//                       <span className="fake-remaining-hours">{leaveType.remaining}</span>
//                       <span className="fake-remaining-unit">小時</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <div className="fake-records-section fake-company-benefits">
//           <h3 className="fake-records-title">公司福利假別</h3>
//           <div className="fake-leave-types-grid">
//             {leaveTypes.slice(15).map((leaveType, index) => (
//               <div key={index} className="fake-leave-type-card">
//                 <div className="fake-leave-type-content">
//                   <div className="fake-leave-type-name">{leaveType.name}</div>
//                   <div className="fake-leave-type-remaining">
//                     <span className="fake-remaining-label">剩餘</span>
//                     <div className="fake-remaining-time">
//                       <span className="fake-remaining-hours">{leaveType.remaining}</span>
//                       <span className="fake-remaining-unit">小時</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 詳細資訊模態框 */}
//       {showModal && selectedRequest && (
//         <div className="fake-modal-overlay" onClick={handleCloseModal}>
//           <div className="fake-modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="fake-modal-header">
//               <h3>請假申請詳情</h3>
//               <button className="fake-modal-close" onClick={handleCloseModal}>×</button>
//             </div>
//             <div className="fake-modal-body">
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">申請編號：</span>
//                 <span className="fake-detail-value">{selectedRequest.id}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">申請狀態：</span>
//                 <span className="fake-detail-value">{selectedRequest.status}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">請假類型：</span>
//                 <span className="fake-detail-value">{selectedRequest.leaveType}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">開始時間：</span>
//                 <span className="fake-detail-value">{selectedRequest.startTime}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">結束時間：</span>
//                 <span className="fake-detail-value">{selectedRequest.endTime}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">請假時數：</span>
//                 <span className="fake-detail-value">{selectedRequest.totalTime}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">申請原因：</span>
//                 <span className="fake-detail-value">{selectedRequest.reason}</span>
//               </div>
//               <div className="fake-detail-row">
//                 <span className="fake-detail-label">送出時間：</span>
//                 <span className="fake-detail-value">{selectedRequest.submitTime}</span>
//               </div>
//               {selectedRequest.reviewer && (
//                 <div className="fake-detail-row">
//                   <span className="fake-detail-label">審核者：</span>
//                   <span className="fake-detail-value">{selectedRequest.reviewer}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FakeRecords;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../config'; // 引入配置
import './Fake_Records.css';

const FakeRecords = ({ employee }) => {
  // 狀態管理
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // 修正 formatFormNumber 函數 - 專門處理 FORM- 格式
  const formatFormNumber = (formNumber) => {
    if (!formNumber) return `B${Date.now()}`;
    
    const formNumberStr = String(formNumber);
    console.log('原始表單編號:', formNumberStr); // 調試用
    
    // 處理 FORM-20251211172124-3230177195 這種格式
    if (formNumberStr.startsWith('FORM-')) {
      const withoutPrefix = formNumberStr.replace('FORM-', '');
      const datePart = withoutPrefix.split('-')[0];
      const result = `B${datePart}`;
      console.log('FORM格式處理後:', result); // 調試用
      return result;
    }
    
    // 如果已經是正確的 B 格式，直接返回
    if (formNumberStr.startsWith('B')) {
      return formNumberStr;
    }
    
    // 其他情況，直接加 B 前綴
    return `B${formNumberStr}`;
  };

  // 添加調試日誌
  useEffect(() => {
    console.log('FakeRecords 接收到的 employee 資訊:', employee);
    console.log('employee 類型:', typeof employee);
    console.log('employee 內容:', JSON.stringify(employee, null, 2));
  }, [employee]);

  // 格式化日期時間函數
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "未記錄";
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  // API 調用
  useEffect(() => {
    console.log('開始處理員工資訊...');
    
    // 檢查員工資訊的多種可能格式
    if (!employee) {
      console.log('沒有提供員工資訊');
      setError('沒有提供員工資訊');
      setLoading(false);
      return;
    }

    // 支援多種員工資訊格式
    let companyId, employeeId, employeeName;
    
    // 檢查不同的可能屬性名稱
    if (employee.companyId || employee.company_id) {
      companyId = employee.companyId || employee.company_id;
    }
    
    if (employee.employeeId || employee.employee_id || employee.id) {
      employeeId = employee.employeeId || employee.employee_id || employee.id;
    }
    
    if (employee.employeeName || employee.employee_name || employee.name) {
      employeeName = employee.employeeName || employee.employee_name || employee.name;
    }

    // 如果還是沒有找到，嘗試從其他可能的屬性中獲取
    if (!companyId && employee.統編) {
      companyId = employee.統編;
    }
    
    if (!employeeId && employee.員工編號) {
      employeeId = employee.員工編號;
    }
    
    if (!employeeName && employee.姓名) {
      employeeName = employee.姓名;
    }

    console.log('解析後的員工資訊:', {
      companyId,
      employeeId,
      employeeName,
      originalEmployee: employee
    });

    // 檢查必要欄位
    if (!companyId) {
      console.log('缺少公司ID');
      setError('缺少公司ID');
      setLoading(false);
      return;
    }

    if (!employeeId) {
      console.log('缺少員工ID');
      setError('缺少員工ID');
      setLoading(false);
      return;
    }

    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`正在查詢員工 ${employeeId} 的請假申請...`);
        console.log('公司ID:', companyId);
        
        // 調用 API - 使用配置檔案中的 API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/forms/advanced-search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company_id: parseInt(companyId),
            employee_id: String(employeeId), // 確保是字符串格式
            category: "leave",
            includeDetails: true
          })
        });
        
        console.log('發送的請求參數:', {
          company_id: parseInt(companyId),
          employee_id: String(employeeId),
          category: "leave",
          includeDetails: true
        });
        
        if (!response.ok) {
          throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API 完整回應:', data);
        
        if (data.Status !== "Ok") {
          throw new Error(data.Msg || "查詢失敗");
        }
        
        if (!data.Data || data.Data.length === 0) {
          console.log('沒有找到請假申請數據');
          setLeaveRecords([]);
          setLoading(false);
          return;
        }
        
        // 過濾當前員工的申請 - 支援多種格式比較
        const currentEmployeeRequests = data.Data.filter(item => {
          const itemEmployeeId = String(item.employee_id);
          const currentEmployeeId = String(employeeId);
          
          console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
          
          // 嘗試多種比較方式
          return itemEmployeeId === currentEmployeeId || 
                 itemEmployeeId === employeeId ||
                 item.employee_id === employeeId ||
                 String(item.employee_id) === String(employeeId);
        });
        
        console.log(`過濾前共 ${data.Data.length} 筆申請`);
        console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的請假申請`);
        
        if (currentEmployeeRequests.length === 0) {
          console.log('當前員工沒有請假申請');
          console.log('所有申請的員工ID:', data.Data.map(item => ({
            employee_id: item.employee_id,
            employee_name: item.employee_name
          })));
          setLeaveRecords([]);
          setLoading(false);
          return;
        }
        
        // 處理回應數據
        const userLeaveRequests = currentEmployeeRequests.map((item, index) => {
          console.log('處理申請項目:', item);
          
          // 狀態映射
          let statusText = "簽核中";
          const currentStatus = item.status || '';
          const statusLower = currentStatus.toLowerCase();
          
          if (statusLower === 'approved' || statusLower === 'ok' || statusLower === '已完成' || statusLower === '1') {
            statusText = "已通過";
          } else if (statusLower === 'rejected' || statusLower === 'no' || statusLower === '未通過' || statusLower === '2') {
            statusText = "未通過";
          } else if (statusLower === 'pending' || statusLower === '待審核' || statusLower === 'approved_pending_hr') {
            statusText = "簽核中";
          }

          // 格式化申請日期
          let submitTime = "未記錄";
          if (item.application_date) {
            submitTime = formatDateTime(item.application_date);
          }
          
          // 請假類型映射
          const leaveTypeMap = {
            'compensatory_leave': { name: '換休', short: '換' },
            'annual_leave': { name: '特休', short: '特' },
            'personal_leave': { name: '事假', short: '事' },
            'sick_leave': { name: '病假', short: '病' },
            'menstrual_leave': { name: '生理假', short: '理' },
            'makeup_leave': { name: '補休', short: '補' },
            'official_leave': { name: '公假', short: '公' },
            'marriage_leave': { name: '婚假', short: '婚' },
            'prenatal_checkup_leave': { name: '產檢假', short: '檢' },
            'maternity_leave': { name: '產假', short: '產' },
            'paternity_leave': { name: '陪產假', short: '陪' },
            'study_leave': { name: '溫書假', short: '書' },
            'birthday_leave': { name: '生日假', short: '生日' }
          };
          
          // 處理請假類型
          let leaveTypeName = "未指定";
          let leaveTypeShort = "未";
          
          if (item.type) {
            if (leaveTypeMap[item.type]) {
              leaveTypeName = leaveTypeMap[item.type].name;
              leaveTypeShort = leaveTypeMap[item.type].short;
            } else {
              leaveTypeName = item.type;
              leaveTypeShort = item.type.substring(0, 1);
            }
          } else if (item.details && item.details.type) {
            if (leaveTypeMap[item.details.type]) {
              leaveTypeName = leaveTypeMap[item.details.type].name;
              leaveTypeShort = leaveTypeMap[item.details.type].short;
            } else {
              leaveTypeName = item.details.type;
              leaveTypeShort = item.details.type.substring(0, 1);
            }
          }
          
          // 處理請假原因
          let reason = "未填寫";
          if (item.details && item.details.illustrate) {
            reason = item.details.illustrate;
          } else if (item.description) {
            reason = item.description;
          }
          
          // 格式化請假時間
          let startDateTime = "未指定";
          let endDateTime = "未指定";
          let totalTime = "0小時 0分鐘";
          
          if (item.details) {
            const formatTime = (timeStr) => {
              if (!timeStr) return '';
              return timeStr.split(':').slice(0, 2).join(':');
            };
            
            if (item.details.start_date && item.details.start_time) {
              startDateTime = `${item.details.start_date} ${formatTime(item.details.start_time)}`;
            }
            
            if (item.details.end_date && item.details.end_time) {
              endDateTime = `${item.details.end_date} ${formatTime(item.details.end_time)}`;
            } else {
              endDateTime = startDateTime;
            }
            
            if (item.details.total_calculation_hours) {
              const hours = Math.floor(item.details.total_calculation_hours);
              const minutes = Math.round((item.details.total_calculation_hours - hours) * 60);
              totalTime = `${hours}小時${minutes}分鐘`;
            }
          }
          
          // 使用本地的 formatFormNumber 函數，與 LeavePage 邏輯一致
          const formNumber = item.form_number ? 
            formatFormNumber(item.form_number) : 
            `B${Date.now()}${index}`;
          
          return {
            id: formNumber, // 使用修改後的表單編號
            status: statusText,
            originalStatus: currentStatus,
            submitTime: submitTime,
            startTime: startDateTime,
            endTime: endDateTime,
            totalTime: totalTime,
            employee: item.employee_id || employeeId,
            employeeName: item.employee_name || employeeName || "員工",
            leaveType: leaveTypeName,
            leaveTypeShort: leaveTypeShort,
            reason: reason,
            reviewer: item.reviewer,
            originalData: item,
            details: item.details || null
          };
        });
        
        console.log(`成功處理 ${userLeaveRequests.length} 筆請假申請`);
        console.log('處理後的申請列表:', userLeaveRequests);
        setLeaveRecords(userLeaveRequests);
        setLoading(false);
      } catch (err) {
        console.error("獲取請假申請失敗:", err);
        setError(`API 調用失敗: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchLeaveRequests();
  }, [employee]);

  // 初始化假別資料
  useEffect(() => {
    const mockLeaveTypes = [
      { name: '特休', remaining: 0, unit: 'hours' },
      { name: '病假', remaining: 0, unit: 'hours' },
      { name: '事假', remaining: 0, unit: 'hours' },
      { name: '婚假', remaining: 0, unit: 'hours' },
      { name: '喪假', remaining: 0, unit: 'hours' },
      { name: '產假', remaining: 0, unit: 'hours' },
      { name: '陪產假', remaining: 0, unit: 'hours' },
      { name: '家庭照顧假', remaining: 0, unit: 'hours' },
      { name: '生理假', remaining: 0, unit: 'hours' },
      { name: '公假', remaining: 0, unit: 'hours' },
      { name: '公傷假', remaining: 0, unit: 'hours' },
      { name: '颱風假', remaining: 0, unit: 'hours' },
      { name: '疫苗假', remaining: 0, unit: 'hours' },
      { name: '隔離假', remaining: 0, unit: 'hours' },
      { name: '防疫照顧假', remaining: 0, unit: 'hours' },
      { name: '年假', remaining: 0, unit: 'hours' }
    ];
    setLeaveTypes(mockLeaveTypes);
  }, []);

  // 獲取狀態樣式
  const getStatusStyle = (status) => {
    switch (status) {
      case '簽核中':
        return { backgroundColor: '#919191', borderColor: '#919191', iconColor: '#919191', text: '簽核中' };
      case '未通過':
        return { backgroundColor: '#F44336', borderColor: '#F44336', iconColor: '#F44336', text: '未通過' };
      case '已通過':
        return { backgroundColor: '#3AA672', borderColor: '#3AA672', iconColor: '#3AA672', text: '已通過' };
      default:
        return { backgroundColor: '#919191', borderColor: '#919191', iconColor: '#919191', text: '未知' };
    }
  };

  // 處理點擊申請單
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // 關閉模態框
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  // 載入狀態
  if (loading) {
    return (
      <div className="fake-records-loading">
        <div className="fake-loading-spinner"></div>
        <p>載入中...</p>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="fake-records-error">
        <p>載入失敗：{error}</p>
        <p>員工資訊：{JSON.stringify(employee)}</p>
        <button onClick={() => window.location.reload()}>重新載入</button>
      </div>
    );
  }

  return (
    <div className="fake-records-container">
      {/* 左側：請假紀錄 */}
      <div className="fake-records-left">
        <div className="fake-records-section">
          <h3 className="fake-records-title">請假紀錄</h3>
          
          <div className="fake-leave-records-list">
            {leaveRecords.length === 0 ? (
              <div className="fake-mobile-no-records">
                <p>目前沒有請假紀錄</p>
                <p>員工ID: {employee?.employeeId || employee?.employee_id || employee?.id || '未知'}</p>
                <p>公司ID: {employee?.companyId || employee?.company_id || employee?.統編 || '未知'}</p>
                <p>員工姓名: {employee?.employeeName || employee?.employee_name || employee?.name || employee?.姓名 || '未知'}</p>
              </div>
            ) : (
              leaveRecords.map((record) => {
                const statusStyle = getStatusStyle(record.status);
                
                return (
                  <div 
                    key={record.id} 
                    className="fake-leave-record-card"
                    onClick={() => handleRequestClick(record)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fake-leave-record-id">{record.id}</div>
                    <div className="fake-leave-record-submit-time">
                      送出時間：{record.submitTime}
                    </div>
                    <div className="fake-leave-record-divider"></div>
                    
                    <div 
                      className="fake-leave-type-circle"
                      style={{ borderColor: statusStyle.borderColor }}
                    ></div>
                    <div 
                      className={`fake-leave-type-text ${record.leaveTypeShort.length > 1 ? 'small-text' : ''}`}
                      style={{ color: statusStyle.iconColor }}
                    >
                      {record.leaveTypeShort}
                    </div>
                    
                    <div className="fake-leave-type-label">
                      請假類型：{record.leaveType}
                    </div>
                    <div className="fake-leave-time-range">
                      時間起迄：{record.startTime.split(' ')[0]} {record.startTime.split(' ')[1]}
                    </div>
                    <div className="fake-leave-end-time">
                      {record.endTime.split(' ')[0]} {record.endTime.split(' ')[1]}
                    </div>
                    <div className="fake-leave-duration">
                      請假時數：{record.totalTime}
                    </div>
                    
                    <div 
                      className="fake-leave-status-badge"
                      style={{ backgroundColor: statusStyle.backgroundColor }}
                    ></div>
                    <div className="fake-leave-status-text">{statusStyle.text}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {/* 中間分隔線 */}
      <div className="fake-records-divider"></div>
      
      {/* 右側：法定假別 */}
      <div className="fake-records-right">
        <div className="fake-records-section">
          <h3 className="fake-records-title">法定假別</h3>
          <div className="fake-leave-types-grid">
            {leaveTypes.slice(0, 15).map((leaveType, index) => (
              <div key={index} className="fake-leave-type-card">
                <div className="fake-leave-type-content">
                  <div className="fake-leave-type-name">{leaveType.name}</div>
                  <div className="fake-leave-type-remaining">
                    <span className="fake-remaining-label">剩餘</span>
                    <div className="fake-remaining-time">
                      <span className="fake-remaining-hours">{leaveType.remaining}</span>
                      <span className="fake-remaining-unit">小時</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="fake-records-section fake-company-benefits">
          <h3 className="fake-records-title">公司福利假別</h3>
          <div className="fake-leave-types-grid">
            {leaveTypes.slice(15).map((leaveType, index) => (
              <div key={index} className="fake-leave-type-card">
                <div className="fake-leave-type-content">
                  <div className="fake-leave-type-name">{leaveType.name}</div>
                  <div className="fake-leave-type-remaining">
                    <span className="fake-remaining-label">剩餘</span>
                    <div className="fake-remaining-time">
                      <span className="fake-remaining-hours">{leaveType.remaining}</span>
                      <span className="fake-remaining-unit">小時</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 詳細資訊模態框 */}
      {showModal && selectedRequest && (
        <div className="fake-modal-overlay" onClick={handleCloseModal}>
          <div className="fake-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="fake-modal-header">
              <h3>請假申請詳情</h3>
              <button className="fake-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="fake-modal-body">
              <div className="fake-detail-row">
                <span className="fake-detail-label">申請編號：</span>
                <span className="fake-detail-value">{selectedRequest.id}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">申請狀態：</span>
                <span className="fake-detail-value">{selectedRequest.status}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">請假類型：</span>
                <span className="fake-detail-value">{selectedRequest.leaveType}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">開始時間：</span>
                <span className="fake-detail-value">{selectedRequest.startTime}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">結束時間：</span>
                <span className="fake-detail-value">{selectedRequest.endTime}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">請假時數：</span>
                <span className="fake-detail-value">{selectedRequest.totalTime}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">申請原因：</span>
                <span className="fake-detail-value">{selectedRequest.reason}</span>
              </div>
              <div className="fake-detail-row">
                <span className="fake-detail-label">送出時間：</span>
                <span className="fake-detail-value">{selectedRequest.submitTime}</span>
              </div>
              {selectedRequest.reviewer && (
                <div className="fake-detail-row">
                  <span className="fake-detail-label">審核者：</span>
                  <span className="fake-detail-value">{selectedRequest.reviewer}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeRecords;
