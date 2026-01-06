// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { OvertimeContent, CardReplenishContent } from '../Table/AuditTable';
// import axios from 'axios';

// function AuditSystem() {
//   const [currentTime, setCurrentTime] = useState('');
//   const [currentView, setCurrentView] = useState('main'); // 'main', 'overtime', 'replenish', 'leave', 'cardDetail'
//   const [activeTab, setActiveTab] = useState('總覽');
//   const [isApp, setIsApp] = useState(false);
//   const navigate = useNavigate();
  
//   // 請假相關狀態
//   const [leaveRecords, setLeaveRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showLeaveDetail, setShowLeaveDetail] = useState(false);
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [cancelingLeave, setCancelingLeave] = useState(false);
//   const [cancelMessage, setCancelMessage] = useState('');
//   const [showApproveUI, setShowApproveUI] = useState(false);
//   const [approveReason, setApproveReason] = useState('');
//   const [processingApproval, setProcessingApproval] = useState(false);
  
//   // 加班相關狀態
//   const [overtimeRecords, setOvertimeRecords] = useState([
//     {
//       id: 'E2409150001',
//       status: '簽核中',
//       submitTime: '2024-09-15 14:19',
//       employee: '朱彥光',
//       overtimeType: '工作日加班',
//       compensation: '加班費',
//       startDateTime: '2024-09-14 18:30',
//       endDateTime: '2024-09-14 20:30',
//       totalHours: '2小時0分鐘',
//       description: '設計新功能介面',
//       attachment: '附件名稱.pdf',
//       approver: '朱正聲'
//     },
//     {
//       id: 'E2409050005',
//       status: '已通過',
//       submitTime: '2024-09-05 21:19',
//       employee: '朱彥光',
//       overtimeType: '工作日加班',
//       compensation: '加班費',
//       startDateTime: '2024-09-05 19:30',
//       endDateTime: '2024-09-05 20:30',
//       totalHours: '1小時0分鐘',
//       description: '修復系統錯誤',
//       attachment: '',
//       approver: '朱正聲'
//     },
//     {
//       id: 'E2409020007',
//       status: '未通過',
//       submitTime: '2024-09-02 21:19',
//       employee: '朱彥光',
//       overtimeType: '工作日加班',
//       compensation: '加班費',
//       startDateTime: '2024-09-03 18:30',
//       endDateTime: '2024-09-03 19:30',
//       totalHours: '1小時0分鐘',
//       description: '準備客戶演示',
//       attachment: '',
//       approver: '朱正聲'
//     },
//     {
//       id: 'E2408150003',
//       status: '簽核中',
//       submitTime: '2024-08-15 14:30',
//       employee: '朱彥光',
//       overtimeType: '工作日加班',
//       compensation: '加班費',
//       startDateTime: '2024-08-16 18:30',
//       endDateTime: '2024-08-16 20:30',
//       totalHours: '2小時0分鐘',
//       description: '測試新功能',
//       attachment: '',
//       approver: '朱正聲'
//     }
//   ]);
//   const [showOvertimeDetail, setShowOvertimeDetail] = useState(false);
//   const [selectedOvertime, setSelectedOvertime] = useState(null);
//   const [cancelingOvertime, setCancelingOvertime] = useState(false);
//   const [overtimeCancelMessage, setOvertimeCancelMessage] = useState('');
//   const [showOvertimeApproveUI, setShowOvertimeApproveUI] = useState(false);
//   const [overtimeApproveReason, setOvertimeApproveReason] = useState('');
  
//   // 補卡相關狀態
//   const [cardRecords, setCardRecords] = useState([
//     {
//       id: 'R2409130001',
//       status: '簽核中',
//       submitTime: '2024-09-14 14:19',
//       employee: '范榕容',
//       replenishDate: '2024-09-13',
//       replenishTime: '09:00',
//       replenishType: '上班',
//       reason: '出差',
//       detailReason: '高雄出差',
//       attachment: '附件名稱.pdf',
//       approver: '朱正聲'
//     },
//     {
//       id: 'C2409080001',
//       status: '已通過',
//       submitTime: '2024-09-08 09:15',
//       employee: '朱彥光',
//       replenishDate: '2024-09-07',
//       replenishTime: '09:00',
//       replenishType: '上班',
//       reason: '忘記打卡',
//       detailReason: '',
//       approver: '朱正聲'
//     },
//     {
//       id: 'C2409010002',
//       status: '未通過',
//       submitTime: '2024-09-01 17:30',
//       employee: '朱彥光',
//       replenishDate: '2024-08-31',
//       replenishTime: '18:00',
//       replenishType: '下班',
//       reason: '加班忘記打卡',
//       detailReason: '',
//       approver: '朱正聲'
//     },
//     {
//       id: 'C2408250003',
//       status: '簽核中',
//       submitTime: '2024-08-25 10:20',
//       employee: '朱彥光',
//       replenishDate: '2024-08-24',
//       replenishTime: '08:30',
//       replenishType: '上班',
//       reason: '卡片故障',
//       detailReason: '',
//       approver: '朱正聲'
//     }
//   ]);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [showCardApproveUI, setShowCardApproveUI] = useState(false);
//   const [cardApproveReason, setCardApproveReason] = useState('');
  
//   // API的代理伺服器URL
//   const proxyServerUrl = '/api/erp-gateway';

//   // 檢測是否為 App 發出的請求
//   useEffect(() => {
//     // 檢查 User-Agent 或其他標記來判斷是否為 Flutter App
//     const userAgent = window.navigator.userAgent;
//     const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
//     setIsApp(isFlutterApp);
//   }, []);

//   // 更新右上角時間
//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const hours = String(now.getHours()).padStart(2, '0');
//       const minutes = String(now.getMinutes()).padStart(2, '0');
//       setCurrentTime(`${hours}:${minutes}`);
//     };
//     updateClock();
//     const timer = setInterval(updateClock, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // 處理回到首頁的邏輯
//   const handleHomeClick = () => {
//     if (isApp) {
//       // 如果是 App，使用 Flutter 的方法通知 App 進行導航
//       if (window.flutter) {
//         window.flutter.postMessage('navigateToHome');
//       }
//     } else {
//       // 如果是網頁，使用 React Router 導航
//       navigate('/frontpage');
//     }
//   };

//   const handleNavigate = (view) => {
//     setCurrentView(view);
//     setActiveTab('總覽'); // 切換視圖時重置標籤
    
//     // 如果切換到請假視圖，則獲取請假數據
//     if (view === 'leave') {
//       fetchLeaveData();
//     }
//   };

//   const handleGoHome = () => {
//     setCurrentView('main');
//   };

//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };

//   // 處理新增加班申請按鈕
//   const handleNewOvertimeRequest = () => {
//     navigate("/workovertimeapply");
//   };

//   // 處理新增補卡申請按鈕
//   const handleNewCardReplenishRequest = () => {
//     navigate("/cardreplenishapply");
//   };

//   // 處理新增請假申請按鈕
//   const handleNewLeaveRequest = () => {
//     navigate("/leaveapply");
//   };
  
//   // 查詢請假數據
//   const fetchLeaveData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const requestBody = {
//         "action": "query",
//         "company_id": "polime",
//         "data": {
//           "doctype": "Leave Application",
//           "fields": ["name", "client_id", "leavetype", "start_date", "start_time", "end_date", "end_time", "illustrate", "approval_status"],
//           "filters": [
//             ["approval_status", "=", "審核中"]
//           ],
//           "or_filters": [
//             ["client_id", "=", "HR_00001"]
//           ],
//           "with_child_tables": true,
//           "child_tables": {
//             "fields": ["name", "taskid"],
//             "filters": [
//               ["taskname", "=", "審核請假單"],
//               ["approval_status", "=", "審核中"],
//               ["assignee","=","admin"]
//             ]
//           },
//           "start": 0,
//           "limit": 20,
//           "order_by": "client_id asc"
//         }
//       };

//       console.log('發送請求到API，請求體:', JSON.stringify(requestBody, null, 2));
      
//       const axiosConfig = {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         timeout: 30000
//       };
      
//       const response = await axios.post(`${proxyServerUrl}/process-query`, requestBody, axiosConfig);
      
//       console.log('成功連接API');
//       console.log('收到API回應:', response.data);
      
//       processLeaveRecords(response.data);
      
//     } catch (err) {
//       console.error('獲取請假數據失敗:', err);
      
//       let errorMsg = `API連接失敗: ${err.message}`;
      
//       if (err.response) {
//         errorMsg += ` (狀態碼: ${err.response.status})`;
//       } else if (err.request) {
//         errorMsg += ' (沒有收到響應)';
//       }
      
//       setError(errorMsg);
//       setLeaveRecords([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 處理請假記錄數據
//   const processLeaveRecords = (apiResponse) => {
//     try {
//       let records = [];
      
//       // 從 API 回應中提取請假記錄
//       if (apiResponse && 
//           apiResponse.message && 
//           apiResponse.message.value && 
//           apiResponse.message.value.items &&
//           Array.isArray(apiResponse.message.value.items)) {
//         records = apiResponse.message.value.items;
//       } else {
//         // 嘗試其他可能的數據結構
//         if (apiResponse && Array.isArray(apiResponse)) {
//           records = apiResponse;
//         } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
//           records = apiResponse.data;
//         }
//       }
      
//       if (records.length === 0) {
//         setLeaveRecords([]);
//         return;
//       }
      
//       // 處理每條請假記錄
//       const processedRecords = records
//         .filter(record => record.approval_status !== '已取消') // 過濾掉已取消的請假記錄
//         .map(record => {
//           let status = record.approval_status || '簽核中';
//           let statusType = '事'; // 假別類型簡稱
//           let approver = '朱正聲'; // 預設核准人
          
//           // 解析假別類型
//           switch (record.leavetype) {
//             case 'personal_leave':
//               statusType = '事';
//               break;
//             case 'sick_leave':
//               statusType = '病';
//               break;
//             case 'annual_leave':
//               statusType = '特';
//               break;
//             case 'menstrual_leave':
//               statusType = '生';
//               break;
//             case 'makeup_leave':
//               statusType = '補';
//               break;
//             case 'compensatory_leave':
//               statusType = '換';
//               break;
//             case 'official_leave':
//               statusType = '公';
//               break;
//             case 'marriage_leave':
//               statusType = '婚';
//               break;
//             case 'prenatal_checkup_leave':
//               statusType = '產';
//               break;
//             case 'maternity_leave':
//               statusType = '產';
//               break;
//             case 'paternity_leave':
//               statusType = '陪';
//               break;
//             case 'study_leave':
//               statusType = '溫';
//               break;
//             case 'birthday_leave':
//               statusType = '生';
//               break;
//             default:
//               statusType = record.leavetype.charAt(0);
//           }

//           // 處理審核狀態 - 確保API返回的審核中狀態被正確處理
//           if (record.approval_status === '審核中') {
//             status = '簽核中';
//           } else if (record.leave_application_flowable_table && 
//               Array.isArray(record.leave_application_flowable_table) && 
//               record.leave_application_flowable_table.length > 0) {
            
//             // 檢查是否有「未通過」的審核記錄
//             const hasRejection = record.leave_application_flowable_table.some(
//               item => item.approval_status === '未通過'
//             );
            
//             if (hasRejection) {
//               status = '未通過';
//             } else {
//               // 檢查是否所有審核步驟都已完成
//               const allCompleted = record.leave_application_flowable_table.every(
//                 item => item.ended === 'True' || item.approval_status === '已通過' || item.approval_status === '已完成'
//               );
              
//               if (allCompleted) {
//                 status = '已通過';
//               }
//             }
            
//             // 尋找核准人
//             const completedApproval = record.leave_application_flowable_table.find(
//               item => item.approval_status === '已通過' || item.approval_status === '已完成'
//             );
            
//             if (completedApproval && completedApproval.approver_name) {
//               approver = completedApproval.approver_name;
//             }
//           }
          
//           // 計算請假時數
//           const startDate = new Date(`${record.start_date}T${record.start_time}`);
//           const endDate = new Date(`${record.end_date}T${record.end_time}`);
//           const diffMs = endDate - startDate;
          
//           const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
//           const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
//           const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
          
//           const leaveHours = `${days}天 ${hours}小時 ${minutes}分鐘`;

//           // 處理送出時間格式
//           const submitTime = record.name ? 
//             `${record.name.substring(0, 10)} 14:19` : 
//             new Date().toISOString().substring(0, 10) + ' 14:19';
          
//           return {
//             id: record.name || `L${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
//             submitTime: submitTime,
//             leaveType: getLeaveName(record.leavetype),
//             startDate: record.start_date,
//             startTime: record.start_time.substring(0, 5),
//             endDate: record.end_date, 
//             endTime: record.end_time.substring(0, 5),
//             leaveHours: leaveHours,
//             status: status,
//             statusType: statusType,
//             illustrate: record.illustrate || '放風自我',
//             approver: approver,
//             attachment: record.attachment_name || '附件名稱.pdf',
//             // 保存原始數據，以便後續API調用
//             originalData: record
//           };
//         });
      
//       setLeaveRecords(processedRecords);
      
//     } catch (error) {
//       console.error('處理請假記錄時出錯:', error);
//       setLeaveRecords([]);
//       setError('處理請假記錄時出錯');
//     }
//   };

//   // 將 API 中的假別代碼轉換為中文名稱
//   const getLeaveName = (leaveTypeApi) => {
//     const leaveTypeMap = {
//       'personal_leave': '事假',
//       'sick_leave': '病假',
//       'annual_leave': '特休',
//       'compensatory_leave': '換休',
//       'menstrual_leave': '生理假',
//       'makeup_leave': '補休',
//       'official_leave': '公假',
//       'marriage_leave': '婚假',
//       'prenatal_checkup_leave': '產檢假',
//       'maternity_leave': '產假',
//       'paternity_leave': '陪產假',
//       'study_leave': '溫書假',
//       'birthday_leave': '生日假'
//     };
    
//     return leaveTypeMap[leaveTypeApi] || leaveTypeApi;
//   };
  
//   // 處理點擊請假記錄
//   const handleLeaveRecordClick = (record) => {
//     setSelectedLeave(record);
//     setShowLeaveDetail(true);
//   };

//   // 處理關閉請假詳情
//   const handleCloseLeaveDetail = () => {
//     setShowLeaveDetail(false);
//     setSelectedLeave(null);
//     setCancelMessage('');
//     setShowApproveUI(false);
//     setApproveReason('');
//   };

//   // 處理點擊加班記錄
//   const handleOvertimeRecordClick = (record) => {
//     setSelectedOvertime(record);
//     setShowOvertimeDetail(true);
//   };

//   // 處理關閉加班詳情
//   const handleCloseOvertimeDetail = () => {
//     setShowOvertimeDetail(false);
//     setSelectedOvertime(null);
//     setOvertimeCancelMessage('');
//     setShowOvertimeApproveUI(false);
//     setOvertimeApproveReason('');
//   };
  
//   // 處理點擊補卡記錄 - 修改為頁面跳轉
//   const handleCardRecordClick = (record) => {
//     setSelectedCard(record);
//     setCurrentView('cardDetail'); // 切換到補卡詳情視圖
//   };
  
//   // 處理返回補卡列表
//   const handleBackToCardList = () => {
//     setCurrentView('replenish');
//     setSelectedCard(null);
//     setShowCardApproveUI(false);
//     setCardApproveReason('');
//   };

//   // 處理撤銷加班
//   const handleCancelOvertime = async () => {
//     if (!selectedOvertime || !selectedOvertime.id) {
//       setOvertimeCancelMessage('無法撤銷加班：找不到加班單號');
//       return;
//     }

//     setCancelingOvertime(true);
//     setOvertimeCancelMessage('正在撤銷加班...');

//     try {
//       // 模擬API請求
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setOvertimeCancelMessage('已成功取消加班申請');
      
//       // 從列表中移除已撤銷的加班記錄
//       setOvertimeRecords(prevRecords => 
//         prevRecords.filter(record => record.id !== selectedOvertime.id)
//       );
      
//       // 延遲關閉詳情視窗，讓用戶看到成功訊息
//       setTimeout(() => {
//         handleCloseOvertimeDetail();
//       }, 1500);
//     } catch (error) {
//       console.error('撤銷加班出錯:', error);
//       setOvertimeCancelMessage(`撤銷加班失敗：${error.message}`);
//     } finally {
//       setCancelingOvertime(false);
//     }
//   };

//   // 處理撤銷請假
//   const handleCancelLeave = async () => {
//     if (!selectedLeave || !selectedLeave.id) {
//       setCancelMessage('無法撤銷請假：找不到請假單號');
//       return;
//     }

//     setCancelingLeave(true);
//     setCancelMessage('正在撤銷請假...');

//     try {
//       // 模擬API請求
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setCancelMessage('已成功取消請假申請');
      
//       // 從列表中移除已撤銷的請假記錄
//       setLeaveRecords(prevRecords => 
//         prevRecords.filter(record => record.id !== selectedLeave.id)
//       );
      
//       // 延遲關閉詳情視窗，讓用戶看到成功訊息
//       setTimeout(() => {
//         handleCloseLeaveDetail();
//       }, 1500);
//     } catch (error) {
//       console.error('撤銷請假出錯:', error);
//       setCancelMessage(`撤銷請假失敗：${error.message}`);
//     } finally {
//       setCancelingLeave(false);
//     }
//   };
  
//   // 處理顯示審核界面
//   const handleShowApproveUI = () => {
//     setShowApproveUI(true);
//   };
  
//   // 處理顯示加班審核界面
//   const handleShowOvertimeApproveUI = () => {
//     setShowOvertimeApproveUI(true);
//   };
  
//   // 處理顯示補卡審核界面
//   const handleShowCardApproveUI = () => {
//     setShowCardApproveUI(true);
//   };
  
//   // 處理請假審核 - 統一的審核函數
//   const handleLeaveApproval = async (isApproved) => {
//     if (!selectedLeave || !selectedLeave.originalData || !selectedLeave.originalData.leave_application_flowable_table) {
//       setCancelMessage('無法審核請假：找不到請假單資料');
//       return;
//     }
    
//     setProcessingApproval(true);
//     setCancelMessage('正在處理審核...');
    
//     try {
//       // 獲取需要的資料
//       const leaveApplicationId = selectedLeave.id;
      
//       // 從 flowable_table 中提取所有 taskid
//       const allTaskIds = selectedLeave.originalData.leave_application_flowable_table.map(item => item.taskid);
      
//       // 只取第一個 taskid
//       const firstTaskId = allTaskIds.length > 0 ? allTaskIds[0] : null;
      
//       console.log('所有 taskid:', allTaskIds);
//       console.log('選擇的第一個 taskid:', firstTaskId);
      
//       if (!leaveApplicationId || !firstTaskId) {
//         throw new Error('缺少必要的請假單號或任務ID');
//       }
      
//       const requestBody = {
//         "action": "approve_leave_application",
//         "company_id": "polime",
//         "data": {
//           "leave_application_id": leaveApplicationId,
//           "task_ids": [firstTaskId], // 只發送第一個 taskid
//           "client_id": "HR_00001",
//           "approval_status": isApproved ? "已通過" : "已拒絕",
//           "approval_comment": approveReason // 加入審核意見
//         }
//       };
      
//       console.log('發送審核請求:', JSON.stringify(requestBody, null, 2));
      
//       const axiosConfig = {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         timeout: 30000
//       };
      
//       // 發送審核請求
//       const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
//       console.log('審核請求回應:', response.data);
      
//       // 檢查回應是否包含您提到的成功格式
//       if (response.data && 
//           (response.data.action === 'approve_leave_application' || 
//            response.data.status === 'success' ||
//            response.status === 200)) {
        
//         // 更新請假記錄狀態
//         setLeaveRecords(prevRecords => 
//           prevRecords.map(record => 
//             record.id === selectedLeave.id 
//               ? {...record, status: isApproved ? '已通過' : '未通過'} 
//               : record
//           )
//         );
        
//         setCancelMessage(isApproved ? '已成功批准請假申請' : '已拒絕請假申請');
//       } else {
//         throw new Error(response.data?.message || '伺服器回應異常');
//       }
      
//       // 延遲關閉詳情視窗
//       setTimeout(() => {
//         handleCloseLeaveDetail();
//       }, 1500);
//     } catch (error) {
//       console.error('審核請假出錯:', error);
//       setCancelMessage(`審核請假失敗：${error.message}`);
//     } finally {
//       setProcessingApproval(false);
//     }
//   };
  
//   // 處理請假審核通過
//   const handleApproveLeave = async () => {
//     await handleLeaveApproval(true);
//   };
  
//   // 處理請假審核拒絕
//   const handleRejectLeave = async () => {
//     await handleLeaveApproval(false);
//   };
  
//   // 處理加班審核通過
//   const handleApproveOvertime = async () => {
//     try {
//       // 模擬API請求
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // 更新加班記錄狀態
//       setOvertimeRecords(prevRecords => 
//         prevRecords.map(record => 
//           record.id === selectedOvertime.id 
//             ? {...record, status: '已通過'} 
//             : record
//         )
//       );
      
//       setOvertimeCancelMessage('已成功批准加班申請');
      
//       // 延遲關閉詳情視窗
//       setTimeout(() => {
//         handleCloseOvertimeDetail();
//       }, 1500);
//     } catch (error) {
//       console.error('批准加班出錯:', error);
//       setOvertimeCancelMessage(`批准加班失敗：${error.message}`);
//     }
//   };
  
//   // 處理加班審核拒絕
//   const handleRejectOvertime = async () => {
//     try {
//       // 模擬API請求
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // 更新加班記錄狀態
//       setOvertimeRecords(prevRecords => 
//         prevRecords.map(record => 
//           record.id === selectedOvertime.id 
//             ? {...record, status: '未通過'} 
//             : record
//         )
//       );
      
//       setOvertimeCancelMessage('已拒絕加班申請');
      
//       // 延遲關閉詳情視窗
//       setTimeout(() => {
//         handleCloseOvertimeDetail();
//       }, 1500);
//     } catch (error) {
//       console.error('拒絕加班出錯:', error);
//       setOvertimeCancelMessage(`拒絕加班失敗：${error.message}`);
//     }
//   };
  
//   // 處理補卡審核通過 (批准簽名)
//   const handleApproveCard = async () => {
//     try {
//       // 模擬API請求
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // 更新補卡記錄狀態
//       setCardRecords(prevRecords => 
//         prevRecords.map(record => 
//           record.id === selectedCard.id 
//             ? {...record, status: '已通過'} 
//             : record
//         )
//       );
      
//       // 延遲返回補卡列表
//       setTimeout(() => {
//         handleBackToCardList();
//       }, 1500);
//     } catch (error) {
//       console.error('批准補卡出錯:', error);
//     }
//   };
  
//   // 處理補卡審核拒絕 (退回申請)
//   const handleRejectCard = async () => {
//     try {
//       // 模擬API請求
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // 更新補卡記錄狀態
//       setCardRecords(prevRecords => 
//         prevRecords.map(record => 
//           record.id === selectedCard.id 
//             ? {...record, status: '未通過'} 
//             : record
//         )
//       );
      
//       // 延遲返回補卡列表
//       setTimeout(() => {
//         handleBackToCardList();
//       }, 1500);
//     } catch (error) {
//       console.error('拒絕補卡出錯:', error);
//     }
//   };
  
//   // 根據當前選擇的子標籤篩選記錄
//   const filteredLeaveRecords = activeTab === '總覽' 
//     ? leaveRecords 
//     : leaveRecords.filter(record => {
//       if (activeTab === '簽核中') return record.status === '簽核中';
//       if (activeTab === '已通過') return record.status === '已通過';
//       if (activeTab === '未通過') return record.status === '未通過';
//       return true;
//     });

// // 篩選補卡記錄      
// const filteredCardRecords = activeTab === '總覽' 
//   ? cardRecords 
//   : cardRecords.filter(record => {
//       if (activeTab === '簽核中') return record.status === '簽核中';
//       if (activeTab === '已通過') return record.status === '已通過';
//       if (activeTab === '未通過') return record.status === '未通過';
//       return true;
//     });

// // 篩選加班記錄
// const filteredOvertimeRecords = activeTab === '總覽' 
//   ? overtimeRecords 
//   : overtimeRecords.filter(record => {
//       if (activeTab === '簽核中') return record.status === '簽核中';
//       if (activeTab === '已通過') return record.status === '已通過';
//       if (activeTab === '未通過') return record.status === '未通過';
//       return true;
//     });

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#f5f7fa',
//     overflow: 'hidden',
//   },
//   appWrapper: {
//     width: '360px',
//     height: '100%',
//     backgroundColor: 'white',
//     fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//     display: 'flex',
//     flexDirection: 'column',
//     overflow: 'hidden',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#3a75b5',
//     color: 'white',
//     padding: '0 16px',
//     height: '50px',
//   },
//   homeIcon: {
//     width: '30px',
//     height: '30px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     cursor: 'pointer',
//   },
//   timeDisplay: {
//     fontSize: '16px',
//     color: '#FFFFFF',
//   },
//   pageTitle: {
//     fontSize: '16px',
//     fontWeight: 'normal',
//     color: '#FFFFFF',
//   },
//   menuContainer: {
//     padding: '16px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//     flexGrow: 1,
//     overflow: 'auto',
//   },
//   menuItem: {
//     backgroundColor: '#e5f0fc',
//     borderRadius: '8px',
//     padding: '20px 16px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     cursor: 'pointer',
//     height: '70px',
//   },
//   menuItemLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px',
//   },
//   menuIcon: {
//     width: '32px',
//     height: '32px',
//     color: '#3a75b5',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   menuText: {
//     fontSize: '20px',
//     color: '#3a75b5',
//     fontWeight: '500',
//   },
//   notificationBadge: {
//     backgroundColor: '#ff4d4f',
//     color: 'white',
//     borderRadius: '50%',
//     width: '24px',
//     height: '24px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     fontSize: '14px',
//     fontWeight: 'bold',
//   },
//   // 通用子頁面樣式
//   contentContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '0',
//     width: '100%',
//     height: 'calc(100% - 50px)',
//     overflow: 'hidden',
//   },
//   subTabContainer: {
//     display: 'flex',
//     width: '100%',
//     height: '36px',
//     borderBottom: '1px solid #e0e0e0',
//   },
//   subTab: (isActive) => ({
//     flex: 1,
//     height: '36px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: isActive ? '#3a75b5' : '#FFFFFF',
//     color: isActive ? '#FFFFFF' : '#000000',
//     fontWeight: '400',
//     fontSize: '14px',
//     cursor: 'pointer',
//   }),
//   scrollArea: {
//     width: '100%',
//     flexGrow: 1,
//     overflowY: 'auto',
//     padding: '0',
//   },
//   recordCard: {
//     padding: '15px',
//     borderBottom: '1px solid #e0e0e0',
//     backgroundColor: 'white',
//     position: 'relative',
//     cursor: 'pointer',
//   },
//   statusTag: (status) => {
//     let color;
//     switch(status) {
//       case '已通過':
//         color = '#4CAF50';
//         break;
//       case '未通過':
//         color = '#F44336';
//         break;
//       default:
//         color = '#FF9800';
//     }
    
//     return {
//       position: 'absolute',
//       right: '15px',
//       top: '15px',
//       color: color,
//       fontWeight: 'bold',
//       fontSize: '14px',
//     };
//   },
//   recordId: {
//     fontSize: '16px',
//     fontWeight: 'bold',
//     marginBottom: '5px',
//   },
//   recordInfo: {
//     fontSize: '14px',
//     color: '#333',
//     marginBottom: '3px',
//   },
//   // 返回按鈕樣式
//   backButtonContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: '10px',
//     borderBottom: '1px solid #e0e0e0',
//     cursor: 'pointer',
//   },
//   backArrow: {
//     marginRight: '10px',
//     fontSize: '16px',
//     color: '#3a75b5',
//   },
//   backText: {
//     color: '#3a75b5',
//     fontSize: '14px',
//   },
//   // 請假詳情彈窗樣式
//   modalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 1000,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   leaveDetailCard: {
//     width: '300px',
//     maxHeight: '80vh',
//     backgroundColor: '#FFFFFF',
//     borderRadius: '5px',
//     padding: '20px',
//     boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
//     position: 'relative',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     border: '1px solid #9c27b0',
//     overflowY: 'auto',
//   },
//   overtimeDetailCard: {
//     width: '300px',
//     maxHeight: '80vh',
//     backgroundColor: '#FFFFFF',
//     borderRadius: '5px',
//     padding: '0',
//     boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
//     position: 'relative',
//     display: 'flex',
//     flexDirection: 'column',
//     border: '1px solid #3a75b5',
//     overflowY: 'auto',
//   },
//   overtimeDetailHeader: {
//     backgroundColor: '#3a75b5',
//     color: 'white',
//     padding: '10px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   overtimeDetailTitle: {
//     fontSize: '18px',
//     fontWeight: 'normal',
//     color: 'white',
//     textAlign: 'center',
//   },
//   overtimeDetailContent: {
//     padding: '15px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//   },
//   detailTitle: {
//     fontSize: '18px',
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: '10px',
//     textAlign: 'center',
//     borderBottom: '1px dotted #ccc',
//     paddingBottom: '10px',
//   },
//   detailField: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottom: '1px dotted #eee',
//     paddingBottom: '8px',
//     paddingTop: '5px',
//   },
//   fieldLabel: {
//     color: '#666',
//     width: '90px',
//     flexShrink: 0,
//     textAlign: 'left',
//   },
//   fieldValue: {
//     color: '#333',
//     textAlign: 'right',
//     flex: 1,
//   },
//   statusBadgeDetail: (status) => {
//     let color, bgColor;
//     switch(status) {
//       case '已通過':
//         color = '#4CAF50';
//         bgColor = '#E8F5E9';
//         break;
//       case '未通過':
//         color = '#F44336';
//         bgColor = '#FFEBEE';
//         break;
//       default:
//         color = '#FF9800';
//         bgColor = '#FFF3E0';
//     }
    
//     return {
//       padding: '2px 8px',
//       borderRadius: '4px',
//       backgroundColor: bgColor,
//       color: color,
//       fontSize: '12px',
//       fontWeight: 'bold',
//       display: 'inline-block',
//     };
//   },
//   attachmentLink: {
//     color: '#3A6CA6',
//     textDecoration: 'underline',
//     cursor: 'pointer',
//   },
//   buttonContainer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginTop: '15px',
//     gap: '10px',
//     padding: '0 15px 15px 15px',
//   },
//   cancelButton: {
//     flex: 1,
//     padding: '8px',
//     backgroundColor: '#F44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//     opacity: cancelingLeave ? 0.7 : 1,
//     pointerEvents: cancelingLeave ? 'none' : 'auto',
//   },
//   closeButton: {
//     flex: 1,
//     padding: '8px',
//     backgroundColor: '#3A6CA6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//   },
//   cancelMessage: {
//     textAlign: 'center',
//     color: cancelMessage.includes('成功') ? '#4CAF50' : '#F44336',
//     fontSize: '14px',
//     marginTop: '10px',
//     fontWeight: 'bold',
//     padding: '0 15px',
//   },
//   overtimeCancelMessage: {
//     textAlign: 'center',
//     color: overtimeCancelMessage.includes('成功') ? '#4CAF50' : '#F44336',
//     fontSize: '14px',
//     marginTop: '10px',
//     fontWeight: 'bold',
//     padding: '0 15px',
//   },
//   actionButtons: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: '10px 15px',
//   },
//   actionButton: (color) => ({
//     flex: 1,
//     padding: '10px 0',
//     backgroundColor: color,
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//     margin: '0 5px',
//     textAlign: 'center',
//   }),
//   approveUI: {
//     padding: '15px',
//     borderTop: '1px solid #e0e0e0',
//   },
//   approveTextarea: {
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     minHeight: '80px',
//     marginBottom: '10px',
//     fontSize: '14px',
//     resize: 'none',
//   },
//   approveButtons: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     gap: '10px',
//   },
//   approveButton: {
//     flex: 1,
//     padding: '8px 0',
//     backgroundColor: '#4CAF50',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//     opacity: processingApproval ? 0.7 : 1,
//     pointerEvents: processingApproval ? 'none' : 'auto',
//   },
//   rejectButton: {
//     flex: 1,
//     padding: '8px 0',
//     backgroundColor: '#F44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//     opacity: processingApproval ? 0.7 : 1,
//     pointerEvents: processingApproval ? 'none' : 'auto',
//   },
//   // 補卡詳情頁面專用樣式
//   cardDetailHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#3a75b5',
//     color: 'white',
//     padding: '0 16px',
//     height: '50px',
//     position: 'relative',
//   },
//   cardDetailBackIcon: {
//     position: 'absolute',
//     left: '16px',
//     cursor: 'pointer',
//   },
//   cardDetailTitle: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: '16px',
//   },
//   cardDetailButtons: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: '15px',
//     gap: '10px',
//   },
//   fixedButtonContainer: {
//     position: 'fixed',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: '15px',
//     gap: '10px',
//     backgroundColor: 'white',
//     boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
//     zIndex: 100,
//     width: '360px',
//     margin: '0 auto',
//   },
  
//   rejectCardButton: {
//     flex: 1,
//     padding: '10px 0',
//     backgroundColor: '#F44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//   },
//   approveCardButton: {
//     flex: 1,
//     padding: '10px 0',
//     backgroundColor: '#4CAF50',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: 'bold',
//   },
// };

// // 主頁面視圖
// const renderMainView = () => (
//   <>
//     <header style={styles.header}>
//       <div style={styles.homeIcon} onClick={handleHomeClick}>
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//             stroke="white"
//             strokeWidth="2"
//             fill="none"
//           />
//           <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//         </svg>
//       </div>
//       <div style={styles.pageTitle}>簽核系統</div>
//       <div style={styles.timeDisplay}>{currentTime}</div>
//     </header>

//     {/* 選單內容 */}
//     <div style={styles.menuContainer}>
//       {/* 加班選項 */}
//       <div style={styles.menuItem} onClick={() => handleNavigate('overtime')}>
//         <div style={styles.menuItemLeft}>
//           <div style={styles.menuIcon}>
//             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
//               <path d="M17 12H12V7" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div style={styles.menuText}>加班</div>
//         </div>
//         <div style={styles.notificationBadge}>2</div>
//       </div>

//       {/* 補卡選項 */}
//       <div style={styles.menuItem} onClick={() => handleNavigate('replenish')}>
//         <div style={styles.menuItemLeft}>
//           <div style={styles.menuIcon}>
//             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
//               <path d="M12 6V12L16 14" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div style={styles.menuText}>補卡</div>
//         </div>
//         <div style={styles.notificationBadge}>1</div>
//       </div>

//       {/* 請假選項 */}
//       <div style={styles.menuItem} onClick={() => handleNavigate('leave')}>
//         <div style={styles.menuItemLeft}>
//           <div style={styles.menuIcon}>
//             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3a75b5" strokeWidth="2" fill="none"/>
//               <path d="M16 2V6M8 2V6M3 10H21" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div style={styles.menuText}>請假</div>
//         </div>
//         <div style={styles.notificationBadge}>1</div>
//       </div>
//     </div>
//   </>
// );

// // 補卡內容視圖
// const renderCardReplenishContent = () => (
//   <>
//     <header style={styles.header}>
//       <div style={styles.homeIcon} onClick={handleGoHome}>
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//             stroke="white"
//             strokeWidth="2"
//             fill="none"
//           />
//           <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//         </svg>
//       </div>
//       <div style={styles.pageTitle}>補卡</div>
//       <div style={styles.timeDisplay}>{currentTime}</div>
//     </header>

//     {/* 返回簽核系統按鈕 */}
//     <div style={styles.backButtonContainer} onClick={handleGoHome}>
//       <span style={styles.backArrow}>←</span>
//       <span style={styles.backText}>返回簽核系統</span>
//     </div>

//     {/* 標籤頁 */}
//     <div style={styles.contentContainer}>
//       <div style={styles.subTabContainer}>
//         <div 
//           style={styles.subTab(activeTab === '總覽')}
//           onClick={() => handleTabClick('總覽')}
//         >
//           總覽
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '簽核中')}
//           onClick={() => handleTabClick('簽核中')}
//         >
//           簽核中
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '已通過')}
//           onClick={() => handleTabClick('已通過')}
//         >
//           已通過
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '未通過')}
//           onClick={() => handleTabClick('未通過')}
//         >
//           未通過
//         </div>
//       </div>
      
//       {/* 補卡記錄列表 */}
//       <div style={styles.scrollArea}>
//         {filteredCardRecords.map(record => (
//           <div 
//             key={record.id} 
//             style={styles.recordCard}
//             onClick={() => handleCardRecordClick(record)}
//           >
//             <div style={styles.statusTag(record.status)}>{record.status}</div>
//             <div style={styles.recordId}>{record.id}</div>
//             <div style={styles.recordInfo}>送出時間: {record.submitTime}</div>
//             <div style={styles.recordInfo}>員工: {record.employee || '朱彥光'}</div>
//             <div style={styles.recordInfo}>補卡類型: {record.replenishType}</div>
//             <div style={styles.recordInfo}>補卡時間: {record.replenishDate} {record.replenishTime}</div>
//             <div style={styles.recordInfo}>補卡事由: {record.reason}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </>
// );

// // 補卡詳情視圖 - 新增為獨立頁面
// const renderCardDetailView = () => (
//   <>
//     <header style={styles.header}>
//       <div style={styles.homeIcon} onClick={() => handleBackToCardList()}>
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//             stroke="white"
//             strokeWidth="2"
//             fill="none"
//           />
//           <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//         </svg>
//       </div>
//       <div style={styles.pageTitle}>補卡申請單</div>
//       <div style={styles.timeDisplay}>{currentTime}</div>
//     </header>

//     {/* 返回按鈕 */}
//     <div style={styles.backButtonContainer} onClick={() => handleBackToCardList()}>
//       <span style={styles.backArrow}>←</span>
//       <span style={styles.backText}>返回</span>
//     </div>

//     {/* 補卡詳情內容 */}
//     <div style={styles.contentContainer}>
//       <div style={styles.scrollArea}>
//         <div style={{padding: '15px'}}>
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>送出時間:</div>
//             <div style={styles.fieldValue}>{selectedCard.submitTime}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>單號:</div>
//             <div style={styles.fieldValue}>{selectedCard.id}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>員工:</div>
//             <div style={styles.fieldValue}>{selectedCard.employee || '朱彥光'}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>狀態:</div>
//             <div style={styles.fieldValue}>
//               <span style={styles.statusBadgeDetail(selectedCard.status)}>
//                 {selectedCard.status}
//               </span>
//             </div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>補卡類型:</div>
//             <div style={styles.fieldValue}>{selectedCard.replenishType}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>補卡事由:</div>
//             <div style={styles.fieldValue}>{selectedCard.reason}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>補卡時間:</div>
//             <div style={styles.fieldValue}>{selectedCard.replenishDate} {selectedCard.replenishTime}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>補卡原因:</div>
//             <div style={styles.fieldValue}>{selectedCard.detailReason}</div>
//           </div>
          
//           {selectedCard.attachment && (
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>附件:</div>
//               <div style={styles.fieldValue}>
//                 <span style={styles.attachmentLink}>{selectedCard.attachment}</span>
//               </div>
//             </div>
//           )}
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>核准人:</div>
//             <div style={styles.fieldValue}>{selectedCard.approver}</div>
//           </div>
          
//           {/* 審核按鈕區域 */}
//           {selectedCard.status === '簽核中' && (
//             <div style={styles.cardDetailButtons}>
//               <button 
//                 style={styles.rejectCardButton}
//                 onClick={handleRejectCard}
//               >
//                 退回申請
//               </button>
//               <button 
//                 style={styles.approveCardButton}
//                 onClick={handleApproveCard}
//               >
//                 批准簽名
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </>
// );

// // 請假內容視圖
// const renderLeaveContent = () => (
//   <>
//     <header style={styles.header}>
//       <div style={styles.homeIcon} onClick={handleGoHome}>
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//             stroke="white"
//             strokeWidth="2"
//             fill="none"
//           />
//           <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//         </svg>
//       </div>
//       <div style={styles.pageTitle}>請假</div>
//       <div style={styles.timeDisplay}>{currentTime}</div>
//     </header>
    
//     {/* 返回簽核系統按鈕 */}
//     <div style={styles.backButtonContainer} onClick={handleGoHome}>
//       <span style={styles.backArrow}>←</span>
//       <span style={styles.backText}>返回簽核系統</span>
//     </div>
    
//     <div style={styles.contentContainer}>
//       <div style={styles.subTabContainer}>
//         <div 
//           style={styles.subTab(activeTab === '總覽')}
//           onClick={() => handleTabClick('總覽')}
//         >
//           總覽
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '簽核中')}
//           onClick={() => handleTabClick('簽核中')}
//         >
//           簽核中
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '已通過')}
//           onClick={() => handleTabClick('已通過')}
//         >
//           已通過
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '未通過')}
//           onClick={() => handleTabClick('未通過')}
//         >
//           未通過
//         </div>
//       </div>
      
//       <div style={styles.scrollArea}>
//         {loading ? (
//           <div style={{padding: '20px', textAlign: 'center'}}>載入中...</div>
//         ) : error ? (
//           <div style={{padding: '20px', textAlign: 'center'}}>
//             <div style={{color: '#F44336', marginBottom: '10px'}}>{error}</div>
//             <button 
//               onClick={fetchLeaveData}
//               style={{
//                 padding: '8px 16px',
//                 backgroundColor: '#3a75b5',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               重新嘗試
//             </button>
//           </div>
//         ) : filteredLeaveRecords.length === 0 ? (
//           <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
//             目前無申請單
//           </div>
//         ) : (
//           filteredLeaveRecords.map(record => (
//             <div 
//               key={record.id} 
//               style={styles.recordCard}
//               onClick={() => handleLeaveRecordClick(record)}
//             >
//               <div style={styles.statusTag(record.status)}>{record.status}</div>
//               <div style={styles.recordId}>{record.id}</div>
//               <div style={styles.recordInfo}>送出時間：{record.submitTime}</div>
//               <div style={styles.recordInfo}>請假類型：{record.leaveType}</div>
//               <div style={styles.recordInfo}>
//                 時間起迄：{record.startDate} {record.startTime} ~ {record.endDate} {record.endTime}
//               </div>
//               <div style={styles.recordInfo}>請假時數：{record.leaveHours}</div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
    
//     {/* 請假詳情彈窗 */}
//     {showLeaveDetail && selectedLeave && (
//       <div style={styles.modalOverlay}>
//         <div style={styles.leaveDetailCard}>
//           <div style={styles.detailTitle}>請假詳情</div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>單號:</div>
//             <div style={styles.fieldValue}>{selectedLeave.id}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>送出時間:</div>
//             <div style={styles.fieldValue}>{selectedLeave.submitTime}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>假別:</div>
//             <div style={styles.fieldValue}>{selectedLeave.leaveType}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>開始時間:</div>
//             <div style={styles.fieldValue}>{selectedLeave.startDate} {selectedLeave.startTime}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>結束時間:</div>
//             <div style={styles.fieldValue}>{selectedLeave.endDate} {selectedLeave.endTime}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>請假時數:</div>
//             <div style={styles.fieldValue}>{selectedLeave.leaveHours}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>事由:</div>
//             <div style={styles.fieldValue}>{selectedLeave.illustrate}</div>
//           </div>
          
//           <div style={styles.detailField}>
//             <div style={styles.fieldLabel}>狀態:</div>
//             <div style={styles.fieldValue}>
//               <span style={styles.statusBadgeDetail(selectedLeave.status)}>
//                 {selectedLeave.status}
//               </span>
//             </div>
//           </div>
          
//           {selectedLeave.attachment && (
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>附件:</div>
//               <div style={styles.fieldValue}>
//                 <span style={styles.attachmentLink}>{selectedLeave.attachment}</span>
//               </div>
//             </div>
//           )}
          
//           {cancelMessage && <div style={styles.cancelMessage}>{cancelMessage}</div>}
          
//           {!showApproveUI && selectedLeave.status === '簽核中' && (
//             <div style={styles.actionButtons}>
//               <div 
//                 style={styles.actionButton('#F44336')}
//                 onClick={handleRejectLeave}
//               >
//                 {processingApproval ? '處理中...' : '拒絕'}
//               </div>
//               <div 
//                 style={styles.actionButton('#4CAF50')}
//                 onClick={handleShowApproveUI}
//               >
//                 審核
//               </div>
//             </div>
//           )}
          
//           {showApproveUI && (
//             <div style={styles.approveUI}>
//               <textarea 
//                 style={styles.approveTextarea}
//                 placeholder="請輸入審核意見..."
//                 value={approveReason}
//                 onChange={(e) => setApproveReason(e.target.value)}
//               />
//               <div style={styles.approveButtons}>
//                 <button 
//                   style={styles.rejectButton}
//                   onClick={handleRejectLeave}
//                   disabled={processingApproval}
//                 >
//                   {processingApproval ? '處理中...' : '退回申請'}
//                 </button>
//                 <button 
//                   style={styles.approveButton}
//                   onClick={handleApproveLeave}
//                   disabled={processingApproval}
//                 >
//                   {processingApproval ? '處理中...' : '批准同意'}
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {!showApproveUI && (
//             <div style={styles.buttonContainer}>
//               <button 
//                 style={styles.closeButton}
//                 onClick={handleCloseLeaveDetail}
//               >
//                 關閉
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     )}
//   </>
// );

// // 加班內容視圖
// const renderOvertimeContent = () => (
//   <>
//     <header style={styles.header}>
//       <div style={styles.homeIcon} onClick={handleGoHome}>
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
//             stroke="white"
//             strokeWidth="2"
//             fill="none"
//           />
//           <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
//         </svg>
//       </div>
//       <div style={styles.pageTitle}>加班</div>
//       <div style={styles.timeDisplay}>{currentTime}</div>
//     </header>

//     {/* 返回簽核系統按鈕 */}
//     <div style={styles.backButtonContainer} onClick={handleGoHome}>
//       <span style={styles.backArrow}>←</span>
//       <span style={styles.backText}>返回簽核系統</span>
//     </div>

//     <div style={styles.contentContainer}>
//       <div style={styles.subTabContainer}>
//         <div 
//           style={styles.subTab(activeTab === '總覽')}
//           onClick={() => handleTabClick('總覽')}
//         >
//           總覽
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '簽核中')}
//           onClick={() => handleTabClick('簽核中')}
//         >
//           簽核中
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '已通過')}
//           onClick={() => handleTabClick('已通過')}
//         >
//           已通過
//         </div>
//         <div 
//           style={styles.subTab(activeTab === '未通過')}
//           onClick={() => handleTabClick('未通過')}
//         >
//           未通過
//         </div>
//       </div>
      
//       <div style={styles.scrollArea}>
//         {filteredOvertimeRecords.map(record => (
//           <div 
//             key={record.id} 
//             style={styles.recordCard}
//             onClick={() => handleOvertimeRecordClick(record)}
//           >
//             <div style={styles.statusTag(record.status)}>{record.status}</div>
//             <div style={styles.recordId}>{record.id}</div>
//             <div style={styles.recordInfo}>送出時間: {record.submitTime}</div>
//             <div style={styles.recordInfo}>加班類型: {record.overtimeType}</div>
//             <div style={styles.recordInfo}>
//               時間起迄: {record.startDateTime} ~ {record.endDateTime}
//             </div>
//             <div style={styles.recordInfo}>加班時數: {record.totalHours}</div>
//           </div>
//         ))}
//       </div>
//     </div>
    
//     {/* 加班詳情彈窗 */}
//     {showOvertimeDetail && selectedOvertime && (
//       <div style={styles.modalOverlay}>
//         <div style={styles.overtimeDetailCard}>
//           <div style={styles.overtimeDetailHeader}>
//             <div style={styles.overtimeDetailTitle}>加班申請單</div>
//           </div>
          
//           <div style={styles.overtimeDetailContent}>
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>單號:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.id}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>送出時間:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.submitTime}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>員工:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.employee}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>狀態:</div>
//               <div style={styles.fieldValue}>
//                 <span style={styles.statusBadgeDetail(selectedOvertime.status)}>
//                   {selectedOvertime.status}
//                 </span>
//               </div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>加班類型:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.overtimeType}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>補償方式:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.compensation}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>開始時間:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.startDateTime}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>結束時間:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.endDateTime}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>加班時數:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.totalHours}</div>
//             </div>
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>加班事由:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.description}</div>
//             </div>
            
//             {selectedOvertime.attachment && (
//               <div style={styles.detailField}>
//                 <div style={styles.fieldLabel}>附件:</div>
//                 <div style={styles.fieldValue}>
//                   <span style={styles.attachmentLink}>{selectedOvertime.attachment}</span>
//                 </div>
//               </div>
//             )}
            
//             <div style={styles.detailField}>
//               <div style={styles.fieldLabel}>核准人:</div>
//               <div style={styles.fieldValue}>{selectedOvertime.approver}</div>
//             </div>
//           </div>
          
//           {overtimeCancelMessage && <div style={styles.overtimeCancelMessage}>{overtimeCancelMessage}</div>}
          
//           {!showOvertimeApproveUI && selectedOvertime.status === '簽核中' && (
//             <div style={styles.actionButtons}>
//               <div 
//                 style={styles.actionButton('#F44336')}
//                 onClick={handleCancelOvertime}
//               >
//                 {cancelingOvertime ? '處理中...' : '拒絕'}
//               </div>
//               <div 
//                 style={styles.actionButton('#4CAF50')}
//                 onClick={handleShowOvertimeApproveUI}
//               >
//                 審核
//               </div>
//             </div>
//           )}
          
//           {showOvertimeApproveUI && (
//             <div style={styles.approveUI}>
//               <textarea 
//                 style={styles.approveTextarea}
//                 placeholder="請輸入審核意見..."
//                 value={overtimeApproveReason}
//                 onChange={(e) => setOvertimeApproveReason(e.target.value)}
//               />
//               <div style={styles.approveButtons}>
//                 <button 
//                   style={styles.rejectButton}
//                   onClick={handleRejectOvertime}
//                 >
//                   拒絕
//                 </button>
//                 <button 
//                   style={styles.approveButton}
//                   onClick={handleApproveOvertime}
//                 >
//                   批准
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {!showOvertimeApproveUI && (
//             <div style={styles.buttonContainer}>
//               <button 
//                 style={styles.closeButton}
//                 onClick={handleCloseOvertimeDetail}
//               >
//                 關閉
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     )}
//   </>
// );

// return (
//   <div style={styles.container}>
//     <div style={styles.appWrapper}>
//       {currentView === 'main' && renderMainView()}
//       {currentView === 'overtime' && renderOvertimeContent()}
//       {currentView === 'replenish' && renderCardReplenishContent()}
//       {currentView === 'leave' && renderLeaveContent()}
//       {currentView === 'cardDetail' && renderCardDetailView()}
//     </div>
//   </div>
// );
// }

// export default AuditSystem;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OvertimeContent, CardReplenishContent } from '../Table/AuditTable';
import axios from 'axios';

function AuditSystem() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'overtime', 'replenish', 'leave', 'cardDetail'
  const [activeTab, setActiveTab] = useState('總覽');
  const [isApp, setIsApp] = useState(false);
  const navigate = useNavigate();
  
  // 請假相關狀態
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeaveDetail, setShowLeaveDetail] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [cancelingLeave, setCancelingLeave] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [showApproveUI, setShowApproveUI] = useState(false);
  const [approveReason, setApproveReason] = useState('');
  const [processingApproval, setProcessingApproval] = useState(false);
  
  // 加班相關狀態
  const [overtimeRecords, setOvertimeRecords] = useState([
    {
      id: 'E2409150001',
      status: '簽核中',
      submitTime: '2024-09-15 14:19',
      employee: '朱彥光',
      overtimeType: '工作日加班',
      compensation: '加班費',
      startDateTime: '2024-09-14 18:30',
      endDateTime: '2024-09-14 20:30',
      totalHours: '2小時0分鐘',
      description: '設計新功能介面',
      attachment: '附件名稱.pdf',
      approver: '朱正聲'
    },
    {
      id: 'E2409050005',
      status: '已通過',
      submitTime: '2024-09-05 21:19',
      employee: '朱彥光',
      overtimeType: '工作日加班',
      compensation: '加班費',
      startDateTime: '2024-09-05 19:30',
      endDateTime: '2024-09-05 20:30',
      totalHours: '1小時0分鐘',
      description: '修復系統錯誤',
      attachment: '',
      approver: '朱正聲'
    },
    {
      id: 'E2409020007',
      status: '未通過',
      submitTime: '2024-09-02 21:19',
      employee: '朱彥光',
      overtimeType: '工作日加班',
      compensation: '加班費',
      startDateTime: '2024-09-03 18:30',
      endDateTime: '2024-09-03 19:30',
      totalHours: '1小時0分鐘',
      description: '準備客戶演示',
      attachment: '',
      approver: '朱正聲'
    },
    {
      id: 'E2408150003',
      status: '簽核中',
      submitTime: '2024-08-15 14:30',
      employee: '朱彥光',
      overtimeType: '工作日加班',
      compensation: '加班費',
      startDateTime: '2024-08-16 18:30',
      endDateTime: '2024-08-16 20:30',
      totalHours: '2小時0分鐘',
      description: '測試新功能',
      attachment: '',
      approver: '朱正聲'
    }
  ]);
  const [showOvertimeDetail, setShowOvertimeDetail] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState(null);
  const [cancelingOvertime, setCancelingOvertime] = useState(false);
  const [overtimeCancelMessage, setOvertimeCancelMessage] = useState('');
  const [showOvertimeApproveUI, setShowOvertimeApproveUI] = useState(false);
  const [overtimeApproveReason, setOvertimeApproveReason] = useState('');
  
  // 補卡相關狀態
  const [cardRecords, setCardRecords] = useState([
    {
      id: 'R2409130001',
      status: '簽核中',
      submitTime: '2024-09-14 14:19',
      employee: '范榕容',
      replenishDate: '2024-09-13',
      replenishTime: '09:00',
      replenishType: '上班',
      reason: '出差',
      detailReason: '高雄出差',
      attachment: '附件名稱.pdf',
      approver: '朱正聲'
    },
    {
      id: 'C2409080001',
      status: '已通過',
      submitTime: '2024-09-08 09:15',
      employee: '朱彥光',
      replenishDate: '2024-09-07',
      replenishTime: '09:00',
      replenishType: '上班',
      reason: '忘記打卡',
      detailReason: '',
      approver: '朱正聲'
    },
    {
      id: 'C2409010002',
      status: '未通過',
      submitTime: '2024-09-01 17:30',
      employee: '朱彥光',
      replenishDate: '2024-08-31',
      replenishTime: '18:00',
      replenishType: '下班',
      reason: '加班忘記打卡',
      detailReason: '',
      approver: '朱正聲'
    },
    {
      id: 'C2408250003',
      status: '簽核中',
      submitTime: '2024-08-25 10:20',
      employee: '朱彥光',
      replenishDate: '2024-08-24',
      replenishTime: '08:30',
      replenishType: '上班',
      reason: '卡片故障',
      detailReason: '',
      approver: '朱正聲'
    }
  ]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardApproveUI, setShowCardApproveUI] = useState(false);
  const [cardApproveReason, setCardApproveReason] = useState('');
  
  // API的代理伺服器URL
  const proxyServerUrl = '/api/erp-gateway';

  // 檢測是否為 App 發出的請求
  useEffect(() => {
    // 檢查 User-Agent 或其他標記來判斷是否為 Flutter App
    const userAgent = window.navigator.userAgent;
    const isFlutterApp = userAgent.includes('Flutter') || window.flutter !== undefined;
    setIsApp(isFlutterApp);
  }, []);

  // 更新右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 處理回到首頁的邏輯
  const handleHomeClick = () => {
    if (isApp) {
      // 如果是 App，使用 Flutter 的方法通知 App 進行導航
      if (window.flutter) {
        window.flutter.postMessage('navigateToHome');
      }
    } else {
      // 如果是網頁，使用 React Router 導航
      navigate('/frontpage');
    }
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setActiveTab('總覽'); // 切換視圖時重置標籤
    
    // 如果切換到請假視圖，則獲取請假數據
    if (view === 'leave') {
      fetchLeaveData();
    }
  };

  const handleGoHome = () => {
    setCurrentView('main');
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 處理新增加班申請按鈕
  const handleNewOvertimeRequest = () => {
    navigate("/workovertimeapply");
  };

  // 處理新增補卡申請按鈕
  const handleNewCardReplenishRequest = () => {
    navigate("/cardreplenishapply");
  };

  // 處理新增請假申請按鈕
  const handleNewLeaveRequest = () => {
    navigate("/leaveapply");
  };
  
  // 查詢請假數據
  const fetchLeaveData = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        "action": "query",
        "company_id": "polime",
        "data": {
          "doctype": "Leave Application",
          "fields": ["name", "client_id", "leavetype", "start_date", "start_time", "end_date", "end_time", "illustrate", "approval_status"],
          "filters": [
            ["approval_status", "=", "審核中"]
          ],
          "or_filters": [
            ["client_id", "=", "HR_00001"]
          ],
          "with_child_tables": true,
          "child_tables": {
            "fields": ["name", "taskid"],
            "filters": [
              ["taskname", "=", "審核請假單"],
              ["approval_status", "=", "審核中"],
              ["assignee","=","admin"]
            ]
          },
          "start": 0,
          "limit": 20,
          "order_by": "client_id asc"
        }
      };

      console.log('發送請求到API，請求體:', JSON.stringify(requestBody, null, 2));
      
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      const response = await axios.post(`${proxyServerUrl}/process-query`, requestBody, axiosConfig);
      
      console.log('成功連接API');
      console.log('收到API回應:', response.data);
      
      processLeaveRecords(response.data);
      
    } catch (err) {
      console.error('獲取請假數據失敗:', err);
      
      let errorMsg = `API連接失敗: ${err.message}`;
      
      if (err.response) {
        errorMsg += ` (狀態碼: ${err.response.status})`;
      } else if (err.request) {
        errorMsg += ' (沒有收到響應)';
      }
      
      setError(errorMsg);
      setLeaveRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // 處理請假記錄數據
  const processLeaveRecords = (apiResponse) => {
    try {
      let records = [];
      
      // 從 API 回應中提取請假記錄
      if (apiResponse && 
          apiResponse.message && 
          apiResponse.message.value && 
          apiResponse.message.value.items &&
          Array.isArray(apiResponse.message.value.items)) {
        records = apiResponse.message.value.items;
      } else {
        // 嘗試其他可能的數據結構
        if (apiResponse && Array.isArray(apiResponse)) {
          records = apiResponse;
        } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
          records = apiResponse.data;
        }
      }
      
      if (records.length === 0) {
        setLeaveRecords([]);
        return;
      }
      
      // 處理每條請假記錄
      const processedRecords = records
        .filter(record => record.approval_status !== '已取消') // 過濾掉已取消的請假記錄
        .map(record => {
          let status = record.approval_status || '簽核中';
          let statusType = '事'; // 假別類型簡稱
          let approver = '朱正聲'; // 預設核准人
          
          // 解析假別類型
          switch (record.leavetype) {
            case 'personal_leave':
              statusType = '事';
              break;
            case 'sick_leave':
              statusType = '病';
              break;
            case 'annual_leave':
              statusType = '特';
              break;
            case 'menstrual_leave':
              statusType = '生';
              break;
            case 'makeup_leave':
              statusType = '補';
              break;
            case 'compensatory_leave':
              statusType = '換';
              break;
            case 'official_leave':
              statusType = '公';
              break;
            case 'marriage_leave':
              statusType = '婚';
              break;
            case 'prenatal_checkup_leave':
              statusType = '產';
              break;
            case 'maternity_leave':
              statusType = '產';
              break;
            case 'paternity_leave':
              statusType = '陪';
              break;
            case 'study_leave':
              statusType = '溫';
              break;
            case 'birthday_leave':
              statusType = '生';
              break;
            default:
              statusType = record.leavetype.charAt(0);
          }

          // 處理審核狀態 - 確保API返回的審核中狀態被正確處理
          if (record.approval_status === '審核中') {
            status = '簽核中';
          } else if (record.leave_application_flowable_table && 
              Array.isArray(record.leave_application_flowable_table) && 
              record.leave_application_flowable_table.length > 0) {
            
            // 檢查是否有「未通過」的審核記錄
            const hasRejection = record.leave_application_flowable_table.some(
              item => item.approval_status === '未通過'
            );
            
            if (hasRejection) {
              status = '未通過';
            } else {
              // 檢查是否所有審核步驟都已完成
              const allCompleted = record.leave_application_flowable_table.every(
                item => item.ended === 'True' || item.approval_status === '已通過' || item.approval_status === '已完成'
              );
              
              if (allCompleted) {
                status = '已通過';
              }
            }
            
            // 尋找核准人
            const completedApproval = record.leave_application_flowable_table.find(
              item => item.approval_status === '已通過' || item.approval_status === '已完成'
            );
            
            if (completedApproval && completedApproval.approver_name) {
              approver = completedApproval.approver_name;
            }
          }
          
          // 計算請假時數
          const startDate = new Date(`${record.start_date}T${record.start_time}`);
          const endDate = new Date(`${record.end_date}T${record.end_time}`);
          const diffMs = endDate - startDate;
          
          const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
          const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
          
          const leaveHours = `${days}天 ${hours}小時 ${minutes}分鐘`;

          // 處理送出時間格式
          const submitTime = record.name ? 
            `${record.name.substring(0, 10)} 14:19` : 
            new Date().toISOString().substring(0, 10) + ' 14:19';
          
          return {
            id: record.name || `L${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
            submitTime: submitTime,
            leaveType: getLeaveName(record.leavetype),
            startDate: record.start_date,
            startTime: record.start_time.substring(0, 5),
            endDate: record.end_date, 
            endTime: record.end_time.substring(0, 5),
            leaveHours: leaveHours,
            status: status,
            statusType: statusType,
            illustrate: record.illustrate || '放風自我',
            approver: approver,
            attachment: record.attachment_name || '附件名稱.pdf',
            file_url: record.file_url || '', // 保存文件URL
            // 保存原始數據，以便後續API調用
            originalData: record
          };
        });
      
      setLeaveRecords(processedRecords);
      
    } catch (error) {
      console.error('處理請假記錄時出錯:', error);
      setLeaveRecords([]);
      setError('處理請假記錄時出錯');
    }
  };

  // 將 API 中的假別代碼轉換為中文名稱
  const getLeaveName = (leaveTypeApi) => {
    const leaveTypeMap = {
      'personal_leave': '事假',
      'sick_leave': '病假',
      'annual_leave': '特休',
      'compensatory_leave': '換休',
      'menstrual_leave': '生理假',
      'makeup_leave': '補休',
      'official_leave': '公假',
      'marriage_leave': '婚假',
      'prenatal_checkup_leave': '產檢假',
      'maternity_leave': '產假',
      'paternity_leave': '陪產假',
      'study_leave': '溫書假',
      'birthday_leave': '生日假'
    };
    
    return leaveTypeMap[leaveTypeApi] || leaveTypeApi;
  };
  
  // 處理點擊請假記錄
  const handleLeaveRecordClick = (record) => {
    setSelectedLeave(record);
    setShowLeaveDetail(true);
  };

  // 處理關閉請假詳情
  const handleCloseLeaveDetail = () => {
    setShowLeaveDetail(false);
    setSelectedLeave(null);
    setCancelMessage('');
    setShowApproveUI(false);
    setApproveReason('');
  };

  // 處理點擊加班記錄
  const handleOvertimeRecordClick = (record) => {
    setSelectedOvertime(record);
    setShowOvertimeDetail(true);
  };

  // 處理關閉加班詳情
  const handleCloseOvertimeDetail = () => {
    setShowOvertimeDetail(false);
    setSelectedOvertime(null);
    setOvertimeCancelMessage('');
    setShowOvertimeApproveUI(false);
    setOvertimeApproveReason('');
  };
  
  // 處理點擊補卡記錄 - 修改為頁面跳轉
  const handleCardRecordClick = (record) => {
    setSelectedCard(record);
    setCurrentView('cardDetail'); // 切換到補卡詳情視圖
  };
  
  // 處理返回補卡列表
  const handleBackToCardList = () => {
    setCurrentView('replenish');
    setSelectedCard(null);
    setShowCardApproveUI(false);
    setCardApproveReason('');
  };

  // 處理撤銷加班
  const handleCancelOvertime = async () => {
    if (!selectedOvertime || !selectedOvertime.id) {
      setOvertimeCancelMessage('無法撤銷加班：找不到加班單號');
      return;
    }

    setCancelingOvertime(true);
    setOvertimeCancelMessage('正在撤銷加班...');

    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOvertimeCancelMessage('已成功取消加班申請');
      
      // 從列表中移除已撤銷的加班記錄
      setOvertimeRecords(prevRecords => 
        prevRecords.filter(record => record.id !== selectedOvertime.id)
      );
      
      // 延遲關閉詳情視窗，讓用戶看到成功訊息
      setTimeout(() => {
        handleCloseOvertimeDetail();
      }, 1500);
    } catch (error) {
      console.error('撤銷加班出錯:', error);
      setOvertimeCancelMessage(`撤銷加班失敗：${error.message}`);
    } finally {
      setCancelingOvertime(false);
    }
  };

  // 處理撤銷請假
  const handleCancelLeave = async () => {
    if (!selectedLeave || !selectedLeave.id) {
      setCancelMessage('無法撤銷請假：找不到請假單號');
      return;
    }

    setCancelingLeave(true);
    setCancelMessage('正在撤銷請假...');

    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCancelMessage('已成功取消請假申請');
      
      // 從列表中移除已撤銷的請假記錄
      setLeaveRecords(prevRecords => 
        prevRecords.filter(record => record.id !== selectedLeave.id)
      );
      
      // 延遲關閉詳情視窗，讓用戶看到成功訊息
      setTimeout(() => {
        handleCloseLeaveDetail();
      }, 1500);
    } catch (error) {
      console.error('撤銷請假出錯:', error);
      setCancelMessage(`撤銷請假失敗：${error.message}`);
    } finally {
      setCancelingLeave(false);
    }
  };
  
  // 處理顯示審核界面
  const handleShowApproveUI = () => {
    setShowApproveUI(true);
  };
  
  // 處理顯示加班審核界面
  const handleShowOvertimeApproveUI = () => {
    setShowOvertimeApproveUI(true);
  };
  
  // 處理顯示補卡審核界面
  const handleShowCardApproveUI = () => {
    setShowCardApproveUI(true);
  };
  
  // 處理請假審核 - 統一的審核函數
  const handleLeaveApproval = async (isApproved) => {
    if (!selectedLeave || !selectedLeave.originalData || !selectedLeave.originalData.leave_application_flowable_table) {
      setCancelMessage('無法審核請假：找不到請假單資料');
      return;
    }
    
    setProcessingApproval(true);
    setCancelMessage('正在處理審核...');
    
    try {
      // 獲取需要的資料
      const leaveApplicationId = selectedLeave.id;
      
      // 從 flowable_table 中提取所有 taskid
      const allTaskIds = selectedLeave.originalData.leave_application_flowable_table.map(item => item.taskid);
      
      // 只取第一個 taskid
      const firstTaskId = allTaskIds.length > 0 ? allTaskIds[0] : null;
      
      console.log('所有 taskid:', allTaskIds);
      console.log('選擇的第一個 taskid:', firstTaskId);
      
      if (!leaveApplicationId || !firstTaskId) {
        throw new Error('缺少必要的請假單號或任務ID');
      }
      
      const requestBody = {
        "action": "approve_leave_application",
        "company_id": "polime",
        "data": {
          "leave_application_id": leaveApplicationId,
          "task_ids": [firstTaskId], // 只發送第一個 taskid
          "client_id": "HR_00001",
          "approval_status": isApproved ? "已通過" : "已拒絕",
          "approval_comment": approveReason // 加入審核意見
        }
      };
      
      console.log('發送審核請求:', JSON.stringify(requestBody, null, 2));
      
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      // 發送審核請求
      const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
      console.log('審核請求回應:', response.data);
      
      // 檢查回應是否包含您提到的成功格式
      if (response.data && 
          (response.data.action === 'approve_leave_application' || 
           response.data.status === 'success' ||
           response.status === 200)) {
        
        // 更新請假記錄狀態
        setLeaveRecords(prevRecords => 
          prevRecords.map(record => 
            record.id === selectedLeave.id 
              ? {...record, status: isApproved ? '已通過' : '未通過'} 
              : record
          )
        );
        
        setCancelMessage(isApproved ? '已成功批准請假申請' : '已拒絕請假申請');
      } else {
        throw new Error(response.data?.message || '伺服器回應異常');
      }
      
      // 延遲關閉詳情視窗
      setTimeout(() => {
        handleCloseLeaveDetail();
      }, 1500);
    } catch (error) {
      console.error('審核請假出錯:', error);
      setCancelMessage(`審核請假失敗：${error.message}`);
    } finally {
      setProcessingApproval(false);
    }
  };
  
  // 處理請假審核通過
  const handleApproveLeave = async () => {
    await handleLeaveApproval(true);
  };
  
  // 處理請假審核拒絕
  const handleRejectLeave = async () => {
    await handleLeaveApproval(false);
  };
  
  // 處理加班審核通過
  const handleApproveOvertime = async () => {
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新加班記錄狀態
      setOvertimeRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === selectedOvertime.id 
            ? {...record, status: '已通過'} 
            : record
        )
      );
      
      setOvertimeCancelMessage('已成功批准加班申請');
      
      // 延遲關閉詳情視窗
      setTimeout(() => {
        handleCloseOvertimeDetail();
      }, 1500);
    } catch (error) {
      console.error('批准加班出錯:', error);
      setOvertimeCancelMessage(`批准加班失敗：${error.message}`);
    }
  };
  
  // 處理加班審核拒絕
  const handleRejectOvertime = async () => {
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新加班記錄狀態
      setOvertimeRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === selectedOvertime.id 
            ? {...record, status: '未通過'} 
            : record
        )
      );
      
      setOvertimeCancelMessage('已拒絕加班申請');
      
      // 延遲關閉詳情視窗
      setTimeout(() => {
        handleCloseOvertimeDetail();
      }, 1500);
    } catch (error) {
      console.error('拒絕加班出錯:', error);
      setOvertimeCancelMessage(`拒絕加班失敗：${error.message}`);
    }
  };
  
  // 處理補卡審核通過 (批准簽名)
  const handleApproveCard = async () => {
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新補卡記錄狀態
      setCardRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === selectedCard.id 
            ? {...record, status: '已通過'} 
            : record
        )
      );
      
      // 延遲返回補卡列表
      setTimeout(() => {
        handleBackToCardList();
      }, 1500);
    } catch (error) {
      console.error('批准補卡出錯:', error);
    }
  };
  
  // 處理補卡審核拒絕 (退回申請)
  const handleRejectCard = async () => {
    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新補卡記錄狀態
      setCardRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === selectedCard.id 
            ? {...record, status: '未通過'} 
            : record
        )
      );
      
      // 延遲返回補卡列表
      setTimeout(() => {
        handleBackToCardList();
      }, 1500);
    } catch (error) {
      console.error('拒絕補卡出錯:', error);
    }
  };

// 處理附件下載
const handleDownloadAttachment = async (fileUrl) => {
  try {
    setCancelMessage('正在下載附件...');

    // 首先使用 process-query API 獲取檔案 URL
    const queryResponse = await axios.post(`${proxyServerUrl}/process-query`, {
      action: "query",
      company_id: "polime",
      data: {
        doctype: "Leave Application", // 添加缺少的 doctype 參數
        file_url: fileUrl
      }
    });

    console.log('查詢檔案 URL 回應:', queryResponse.data);

    // 從回應中提取 file_url
let fileUrlFromResponse = '';
if (queryResponse.data && queryResponse.data.message && queryResponse.data.message.value) {
  fileUrlFromResponse = queryResponse.data.message.value.file_url || fileUrl;
}

if (!fileUrlFromResponse) {
  throw new Error('無法獲取檔案 URL');
}


      // 使用 FormData 發送下載請求
      const formData = new FormData();
      formData.append('action', 'download_file');
      formData.append('company_id', 'polime');
      formData.append('file_url', fileUrlFromResponse);

      const downloadResponse = await axios.post(
        `${proxyServerUrl}/download-file`,
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );


    console.log('下載檔案回應:', downloadResponse);

    // 創建下載連結
    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // 從 Content-Disposition 獲取檔名，如果沒有則使用預設名稱
    const contentDisposition = downloadResponse.headers['content-disposition'];
    let filename = '附件下載.pdf';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setCancelMessage('附件下載成功');
    setTimeout(() => setCancelMessage(''), 1500);
    
  } catch (error) {
    console.error('下載附件出錯:', error);
    setCancelMessage(`下載附件失敗: ${error.message}`);
  }
};

  
  // 根據當前選擇的子標籤篩選記錄
  const filteredLeaveRecords = activeTab === '總覽' 
    ? leaveRecords 
    : leaveRecords.filter(record => {
      if (activeTab === '簽核中') return record.status === '簽核中';
      if (activeTab === '已通過') return record.status === '已通過';
      if (activeTab === '未通過') return record.status === '未通過';
      return true;
    });

// 篩選補卡記錄      
const filteredCardRecords = activeTab === '總覽' 
  ? cardRecords 
  : cardRecords.filter(record => {
      if (activeTab === '簽核中') return record.status === '簽核中';
      if (activeTab === '已通過') return record.status === '已通過';
      if (activeTab === '未通過') return record.status === '未通過';
      return true;
    });

// 篩選加班記錄
const filteredOvertimeRecords = activeTab === '總覽' 
  ? overtimeRecords 
  : overtimeRecords.filter(record => {
      if (activeTab === '簽核中') return record.status === '簽核中';
      if (activeTab === '已通過') return record.status === '已通過';
      if (activeTab === '未通過') return record.status === '未通過';
      return true;
    });

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f7fa',
    overflow: 'hidden',
  },
  appWrapper: {
    width: '360px',
    height: '100%',
    backgroundColor: 'white',
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3a75b5',
    color: 'white',
    padding: '0 16px',
    height: '50px',
  },
  homeIcon: {
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  timeDisplay: {
    fontSize: '16px',
    color: '#FFFFFF',
  },
  pageTitle: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  menuContainer: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexGrow: 1,
    overflow: 'auto',
  },
  menuItem: {
    backgroundColor: '#e5f0fc',
    borderRadius: '8px',
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    height: '70px',
  },
  menuItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  menuIcon: {
    width: '32px',
    height: '32px',
    color: '#3a75b5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: '20px',
    color: '#3a75b5',
    fontWeight: '500',
  },
  notificationBadge: {
    backgroundColor: '#ff4d4f',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  // 通用子頁面樣式
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0',
    width: '100%',
    height: 'calc(100% - 50px)',
    overflow: 'hidden',
  },
  subTabContainer: {
    display: 'flex',
    width: '100%',
    height: '36px',
    borderBottom: '1px solid #e0e0e0',
  },
  subTab: (isActive) => ({
    flex: 1,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isActive ? '#3a75b5' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : '#000000',
    fontWeight: '400',
    fontSize: '14px',
    cursor: 'pointer',
  }),
  scrollArea: {
    width: '100%',
    flexGrow: 1,
    overflowY: 'auto',
    padding: '0',
  },
  recordCard: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: 'white',
    position: 'relative',
    cursor: 'pointer',
  },
  statusTag: (status) => {
    let color;
    switch(status) {
      case '已通過':
        color = '#4CAF50';
        break;
      case '未通過':
        color = '#F44336';
        break;
      default:
        color = '#FF9800';
    }
    
    return {
      position: 'absolute',
      right: '15px',
      top: '15px',
      color: color,
      fontWeight: 'bold',
      fontSize: '14px',
    };
  },
  recordId: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  recordInfo: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '3px',
  },
  // 返回按鈕樣式
  backButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
  },
  backArrow: {
    marginRight: '10px',
    fontSize: '16px',
    color: '#3a75b5',
  },
  backText: {
    color: '#3a75b5',
    fontSize: '14px',
  },
  // 請假詳情彈窗樣式
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveDetailCard: {
    width: '300px',
    maxHeight: '80vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '5px',
    padding: '20px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px solid #9c27b0',
    overflowY: 'auto',
  },
  overtimeDetailCard: {
    width: '300px',
    maxHeight: '80vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '5px',
    padding: '0',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #3a75b5',
    overflowY: 'auto',
  },
  overtimeDetailHeader: {
    backgroundColor: '#3a75b5',
    color: 'white',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overtimeDetailTitle: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
  },
  overtimeDetailContent: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
    borderBottom: '1px dotted #ccc',
    paddingBottom: '10px',
  },
  detailField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px dotted #eee',
    paddingBottom: '8px',
    paddingTop: '5px',
  },
  fieldLabel: {
    color: '#666',
    width: '90px',
    flexShrink: 0,
    textAlign: 'left',
  },
  fieldValue: {
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  statusBadgeDetail: (status) => {
    let color, bgColor;
    switch(status) {
      case '已通過':
        color = '#4CAF50';
        bgColor = '#E8F5E9';
        break;
      case '未通過':
        color = '#F44336';
        bgColor = '#FFEBEE';
        break;
      default:
        color = '#FF9800';
        bgColor = '#FFF3E0';
    }
    
    return {
      padding: '2px 8px',
      borderRadius: '4px',
      backgroundColor: bgColor,
      color: color,
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
    };
  },
  attachmentLink: {
    color: '#3A6CA6',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    gap: '10px',
    padding: '0 15px 15px 15px',
  },
  cancelButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: cancelingLeave ? 0.7 : 1,
    pointerEvents: cancelingLeave ? 'none' : 'auto',
  },
  closeButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#3A6CA6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  cancelMessage: {
    textAlign: 'center',
    color: cancelMessage.includes('成功') ? '#4CAF50' : '#F44336',
    fontSize: '14px',
    marginTop: '10px',
    fontWeight: 'bold',
    padding: '0 15px',
  },
  overtimeCancelMessage: {
    textAlign: 'center',
    color: overtimeCancelMessage.includes('成功') ? '#4CAF50' : '#F44336',
    fontSize: '14px',
    marginTop: '10px',
    fontWeight: 'bold',
    padding: '0 15px',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
  },
  actionButton: (color) => ({
    flex: 1,
    padding: '10px 0',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 5px',
    textAlign: 'center',
  }),
  approveUI: {
    padding: '15px',
    borderTop: '1px solid #e0e0e0',
  },
  approveTextarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    minHeight: '80px',
    marginBottom: '10px',
    fontSize: '14px',
    resize: 'none',
  },
  approveButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  approveButton: {
    flex: 1,
    padding: '8px 0',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: processingApproval ? 0.7 : 1,
    pointerEvents: processingApproval ? 'none' : 'auto',
  },
  rejectButton: {
    flex: 1,
    padding: '8px 0',
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: processingApproval ? 0.7 : 1,
    pointerEvents: processingApproval ? 'none' : 'auto',
  },
  // 補卡詳情頁面專用樣式
  cardDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3a75b5',
    color: 'white',
    padding: '0 16px',
    height: '50px',
    position: 'relative',
  },
  cardDetailBackIcon: {
    position: 'absolute',
    left: '16px',
    cursor: 'pointer',
  },
  cardDetailTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: '16px',
  },
  cardDetailButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    gap: '10px',
  },
  fixedButtonContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    gap: '10px',
    backgroundColor: 'white',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    width: '360px',
    margin: '0 auto',
  },
  
  rejectCardButton: {
    flex: 1,
    padding: '10px 0',
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  approveCardButton: {
    flex: 1,
    padding: '10px 0',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

// 主頁面視圖
const renderMainView = () => (
  <>
    <header style={styles.header}>
      <div style={styles.homeIcon} onClick={handleHomeClick}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div style={styles.pageTitle}>簽核系統</div>
      <div style={styles.timeDisplay}>{currentTime}</div>
    </header>

    {/* 選單內容 */}
    <div style={styles.menuContainer}>
      {/* 加班選項 */}
      <div style={styles.menuItem} onClick={() => handleNavigate('overtime')}>
        <div style={styles.menuItemLeft}>
          <div style={styles.menuIcon}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
              <path d="M17 12H12V7" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={styles.menuText}>加班</div>
        </div>
        <div style={styles.notificationBadge}>2</div>
      </div>

      {/* 補卡選項 */}
      <div style={styles.menuItem} onClick={() => handleNavigate('replenish')}>
        <div style={styles.menuItemLeft}>
          <div style={styles.menuIcon}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3a75b5" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={styles.menuText}>補卡</div>
        </div>
        <div style={styles.notificationBadge}>1</div>
      </div>

      {/* 請假選項 */}
      <div style={styles.menuItem} onClick={() => handleNavigate('leave')}>
        <div style={styles.menuItemLeft}>
          <div style={styles.menuIcon}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3a75b5" strokeWidth="2" fill="none"/>
              <path d="M16 2V6M8 2V6M3 10H21" stroke="#3a75b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={styles.menuText}>請假</div>
        </div>
        <div style={styles.notificationBadge}>1</div>
      </div>
    </div>
  </>
);

// 補卡內容視圖
const renderCardReplenishContent = () => (
  <>
    <header style={styles.header}>
      <div style={styles.homeIcon} onClick={handleGoHome}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div style={styles.pageTitle}>補卡</div>
      <div style={styles.timeDisplay}>{currentTime}</div>
    </header>

    {/* 返回簽核系統按鈕 */}
    <div style={styles.backButtonContainer} onClick={handleGoHome}>
      <span style={styles.backArrow}>←</span>
      <span style={styles.backText}>返回簽核系統</span>
    </div>

    {/* 標籤頁 */}
    <div style={styles.contentContainer}>
      <div style={styles.subTabContainer}>
        <div 
          style={styles.subTab(activeTab === '總覽')}
          onClick={() => handleTabClick('總覽')}
        >
          總覽
        </div>
        <div 
          style={styles.subTab(activeTab === '簽核中')}
          onClick={() => handleTabClick('簽核中')}
        >
          簽核中
        </div>
        <div 
          style={styles.subTab(activeTab === '已通過')}
          onClick={() => handleTabClick('已通過')}
        >
          已通過
        </div>
        <div 
          style={styles.subTab(activeTab === '未通過')}
          onClick={() => handleTabClick('未通過')}
        >
          未通過
        </div>
      </div>
      
      {/* 補卡記錄列表 */}
      <div style={styles.scrollArea}>
        {filteredCardRecords.map(record => (
          <div 
            key={record.id} 
            style={styles.recordCard}
            onClick={() => handleCardRecordClick(record)}
          >
            <div style={styles.statusTag(record.status)}>{record.status}</div>
            <div style={styles.recordId}>{record.id}</div>
            <div style={styles.recordInfo}>送出時間: {record.submitTime}</div>
            <div style={styles.recordInfo}>員工: {record.employee || '朱彥光'}</div>
            <div style={styles.recordInfo}>補卡類型: {record.replenishType}</div>
            <div style={styles.recordInfo}>補卡時間: {record.replenishDate} {record.replenishTime}</div>
            <div style={styles.recordInfo}>補卡事由: {record.reason}</div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// 補卡詳情視圖 - 新增為獨立頁面
const renderCardDetailView = () => (
  <>
    <header style={styles.header}>
      <div style={styles.homeIcon} onClick={() => handleBackToCardList()}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div style={styles.pageTitle}>補卡申請單</div>
      <div style={styles.timeDisplay}>{currentTime}</div>
    </header>

    {/* 返回按鈕 */}
    <div style={styles.backButtonContainer} onClick={() => handleBackToCardList()}>
      <span style={styles.backArrow}>←</span>
      <span style={styles.backText}>返回</span>
    </div>

    {/* 補卡詳情內容 */}
    <div style={styles.contentContainer}>
      <div style={styles.scrollArea}>
        <div style={{padding: '15px'}}>
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>送出時間:</div>
            <div style={styles.fieldValue}>{selectedCard.submitTime}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>單號:</div>
            <div style={styles.fieldValue}>{selectedCard.id}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>員工:</div>
            <div style={styles.fieldValue}>{selectedCard.employee || '朱彥光'}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>狀態:</div>
            <div style={styles.fieldValue}>
              <span style={styles.statusBadgeDetail(selectedCard.status)}>
                {selectedCard.status}
              </span>
            </div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>補卡類型:</div>
            <div style={styles.fieldValue}>{selectedCard.replenishType}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>補卡事由:</div>
            <div style={styles.fieldValue}>{selectedCard.reason}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>補卡時間:</div>
            <div style={styles.fieldValue}>{selectedCard.replenishDate} {selectedCard.replenishTime}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>補卡原因:</div>
            <div style={styles.fieldValue}>{selectedCard.detailReason}</div>
          </div>
          
          {selectedCard.attachment && (
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>附件:</div>
              <div style={styles.fieldValue}>
                <span style={styles.attachmentLink}>{selectedCard.attachment}</span>
              </div>
            </div>
          )}
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>核准人:</div>
            <div style={styles.fieldValue}>{selectedCard.approver}</div>
          </div>
          
          {/* 審核按鈕區域 */}
          {selectedCard.status === '簽核中' && (
            <div style={styles.cardDetailButtons}>
              <button 
                style={styles.rejectCardButton}
                onClick={handleRejectCard}
              >
                退回申請
              </button>
              <button 
                style={styles.approveCardButton}
                onClick={handleApproveCard}
              >
                批准簽名
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);

// 請假內容視圖
const renderLeaveContent = () => (
  <>
    <header style={styles.header}>
      <div style={styles.homeIcon} onClick={handleGoHome}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div style={styles.pageTitle}>請假</div>
      <div style={styles.timeDisplay}>{currentTime}</div>
    </header>
    
    {/* 返回簽核系統按鈕 */}
    <div style={styles.backButtonContainer} onClick={handleGoHome}>
      <span style={styles.backArrow}>←</span>
      <span style={styles.backText}>返回簽核系統</span>
    </div>
    
    <div style={styles.contentContainer}>
      <div style={styles.subTabContainer}>
        <div 
          style={styles.subTab(activeTab === '總覽')}
          onClick={() => handleTabClick('總覽')}
        >
          總覽
        </div>
        <div 
          style={styles.subTab(activeTab === '簽核中')}
          onClick={() => handleTabClick('簽核中')}
        >
          簽核中
        </div>
        <div 
          style={styles.subTab(activeTab === '已通過')}
          onClick={() => handleTabClick('已通過')}
        >
          已通過
        </div>
        <div 
          style={styles.subTab(activeTab === '未通過')}
          onClick={() => handleTabClick('未通過')}
        >
          未通過
        </div>
      </div>
      
      <div style={styles.scrollArea}>
        {loading ? (
          <div style={{padding: '20px', textAlign: 'center'}}>載入中...</div>
        ) : error ? (
          <div style={{padding: '20px', textAlign: 'center'}}>
            <div style={{color: '#F44336', marginBottom: '10px'}}>{error}</div>
            <button 
              onClick={fetchLeaveData}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3a75b5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              重新嘗試
            </button>
          </div>
        ) : filteredLeaveRecords.length === 0 ? (
          <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
            目前無申請單
          </div>
        ) : (
          filteredLeaveRecords.map(record => (
            <div 
              key={record.id} 
              style={styles.recordCard}
              onClick={() => handleLeaveRecordClick(record)}
            >
              <div style={styles.statusTag(record.status)}>{record.status}</div>
              <div style={styles.recordId}>{record.id}</div>
              <div style={styles.recordInfo}>送出時間：{record.submitTime}</div>
              <div style={styles.recordInfo}>請假類型：{record.leaveType}</div>
              <div style={styles.recordInfo}>
                時間起迄：{record.startDate} {record.startTime} ~ {record.endDate} {record.endTime}
              </div>
              <div style={styles.recordInfo}>請假時數：{record.leaveHours}</div>
            </div>
          ))
        )}
      </div>
    </div>
    
    {/* 請假詳情彈窗 */}
    {showLeaveDetail && selectedLeave && (
      <div style={styles.modalOverlay}>
        <div style={styles.leaveDetailCard}>
          <div style={styles.detailTitle}>請假詳情</div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>單號:</div>
            <div style={styles.fieldValue}>{selectedLeave.id}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>送出時間:</div>
            <div style={styles.fieldValue}>{selectedLeave.submitTime}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>假別:</div>
            <div style={styles.fieldValue}>{selectedLeave.leaveType}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>開始時間:</div>
            <div style={styles.fieldValue}>{selectedLeave.startDate} {selectedLeave.startTime}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>結束時間:</div>
            <div style={styles.fieldValue}>{selectedLeave.endDate} {selectedLeave.endTime}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>請假時數:</div>
            <div style={styles.fieldValue}>{selectedLeave.leaveHours}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>事由:</div>
            <div style={styles.fieldValue}>{selectedLeave.illustrate}</div>
          </div>
          
          <div style={styles.detailField}>
            <div style={styles.fieldLabel}>狀態:</div>
            <div style={styles.fieldValue}>
              <span style={styles.statusBadgeDetail(selectedLeave.status)}>
                {selectedLeave.status}
              </span>
            </div>
          </div>
          
          {selectedLeave.attachment && (
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>附件:</div>
              <div style={styles.fieldValue}>
                <span 
                  style={styles.attachmentLink}
                  onClick={() => handleDownloadAttachment(selectedLeave.file_url)}
                >
                  {selectedLeave.attachment}
                </span>
              </div>
            </div>
          )}
          
          {cancelMessage && <div style={styles.cancelMessage}>{cancelMessage}</div>}
          
          {!showApproveUI && selectedLeave.status === '簽核中' && (
            <div style={styles.actionButtons}>
              <div 
                style={styles.actionButton('#F44336')}
                onClick={handleRejectLeave}
              >
                {processingApproval ? '處理中...' : '拒絕'}
              </div>
              <div 
                style={styles.actionButton('#4CAF50')}
                onClick={handleShowApproveUI}
              >
                審核
              </div>
            </div>
          )}
          
          {showApproveUI && (
            <div style={styles.approveUI}>
              <textarea 
                style={styles.approveTextarea}
                placeholder="請輸入審核意見..."
                value={approveReason}
                onChange={(e) => setApproveReason(e.target.value)}
              />
              <div style={styles.approveButtons}>
                <button 
                  style={styles.rejectButton}
                  onClick={handleRejectLeave}
                  disabled={processingApproval}
                >
                  {processingApproval ? '處理中...' : '退回申請'}
                </button>
                <button 
                  style={styles.approveButton}
                  onClick={handleApproveLeave}
                  disabled={processingApproval}
                >
                  {processingApproval ? '處理中...' : '批准同意'}
                </button>
              </div>
            </div>
          )}
          
          {!showApproveUI && (
            <div style={styles.buttonContainer}>
              <button 
                style={styles.closeButton}
                onClick={handleCloseLeaveDetail}
              >
                關閉
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);

// 加班內容視圖
const renderOvertimeContent = () => (
  <>
    <header style={styles.header}>
      <div style={styles.homeIcon} onClick={handleGoHome}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div style={styles.pageTitle}>加班</div>
      <div style={styles.timeDisplay}>{currentTime}</div>
    </header>

    {/* 返回簽核系統按鈕 */}
    <div style={styles.backButtonContainer} onClick={handleGoHome}>
      <span style={styles.backArrow}>←</span>
      <span style={styles.backText}>返回簽核系統</span>
    </div>

    <div style={styles.contentContainer}>
      <div style={styles.subTabContainer}>
        <div 
          style={styles.subTab(activeTab === '總覽')}
          onClick={() => handleTabClick('總覽')}
        >
          總覽
        </div>
        <div 
          style={styles.subTab(activeTab === '簽核中')}
          onClick={() => handleTabClick('簽核中')}
        >
          簽核中
        </div>
        <div 
          style={styles.subTab(activeTab === '已通過')}
          onClick={() => handleTabClick('已通過')}
        >
          已通過
        </div>
        <div 
          style={styles.subTab(activeTab === '未通過')}
          onClick={() => handleTabClick('未通過')}
        >
          未通過
        </div>
      </div>
      
      <div style={styles.scrollArea}>
        {filteredOvertimeRecords.map(record => (
          <div 
            key={record.id} 
            style={styles.recordCard}
            onClick={() => handleOvertimeRecordClick(record)}
          >
            <div style={styles.statusTag(record.status)}>{record.status}</div>
            <div style={styles.recordId}>{record.id}</div>
            <div style={styles.recordInfo}>送出時間: {record.submitTime}</div>
            <div style={styles.recordInfo}>加班類型: {record.overtimeType}</div>
            <div style={styles.recordInfo}>
              時間起迄: {record.startDateTime} ~ {record.endDateTime}
            </div>
            <div style={styles.recordInfo}>加班時數: {record.totalHours}</div>
          </div>
        ))}
      </div>
    </div>
    
    {/* 加班詳情彈窗 */}
    {showOvertimeDetail && selectedOvertime && (
      <div style={styles.modalOverlay}>
        <div style={styles.overtimeDetailCard}>
          <div style={styles.overtimeDetailHeader}>
            <div style={styles.overtimeDetailTitle}>加班申請單</div>
          </div>
          
          <div style={styles.overtimeDetailContent}>
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>單號:</div>
              <div style={styles.fieldValue}>{selectedOvertime.id}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>送出時間:</div>
              <div style={styles.fieldValue}>{selectedOvertime.submitTime}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>員工:</div>
              <div style={styles.fieldValue}>{selectedOvertime.employee}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>狀態:</div>
              <div style={styles.fieldValue}>
                <span style={styles.statusBadgeDetail(selectedOvertime.status)}>
                  {selectedOvertime.status}
                </span>
              </div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>加班類型:</div>
              <div style={styles.fieldValue}>{selectedOvertime.overtimeType}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>補償方式:</div>
              <div style={styles.fieldValue}>{selectedOvertime.compensation}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>開始時間:</div>
              <div style={styles.fieldValue}>{selectedOvertime.startDateTime}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>結束時間:</div>
              <div style={styles.fieldValue}>{selectedOvertime.endDateTime}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>加班時數:</div>
              <div style={styles.fieldValue}>{selectedOvertime.totalHours}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>加班事由:</div>
              <div style={styles.fieldValue}>{selectedOvertime.description}</div>
            </div>
            
            {selectedOvertime.attachment && (
              <div style={styles.detailField}>
                <div style={styles.fieldLabel}>附件:</div>
                <div style={styles.fieldValue}>
                  <span style={styles.attachmentLink}>{selectedOvertime.attachment}</span>
                </div>
              </div>
            )}
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>核准人:</div>
              <div style={styles.fieldValue}>{selectedOvertime.approver}</div>
            </div>
          </div>
          
          {overtimeCancelMessage && <div style={styles.overtimeCancelMessage}>{overtimeCancelMessage}</div>}
          
          {!showOvertimeApproveUI && selectedOvertime.status === '簽核中' && (
            <div style={styles.actionButtons}>
              <div 
                style={styles.actionButton('#F44336')}
                onClick={handleCancelOvertime}
              >
                {cancelingOvertime ? '處理中...' : '拒絕'}
              </div>
              <div 
                style={styles.actionButton('#4CAF50')}
                onClick={handleShowOvertimeApproveUI}
              >
                審核
              </div>
            </div>
          )}
          
          {showOvertimeApproveUI && (
            <div style={styles.approveUI}>
              <textarea 
                style={styles.approveTextarea}
                placeholder="請輸入審核意見..."
                value={overtimeApproveReason}
                onChange={(e) => setOvertimeApproveReason(e.target.value)}
              />
              <div style={styles.approveButtons}>
                <button 
                  style={styles.rejectButton}
                  onClick={handleRejectOvertime}
                >
                  拒絕
                </button>
                <button 
                  style={styles.approveButton}
                  onClick={handleApproveOvertime}
                >
                  批准
                </button>
              </div>
            </div>
          )}
          
          {!showOvertimeApproveUI && (
            <div style={styles.buttonContainer}>
              <button 
                style={styles.closeButton}
                onClick={handleCloseOvertimeDetail}
              >
                關閉
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);

return (
  <div style={styles.container}>
    <div style={styles.appWrapper}>
      {currentView === 'main' && renderMainView()}
      {currentView === 'overtime' && renderOvertimeContent()}
      {currentView === 'replenish' && renderCardReplenishContent()}
      {currentView === 'leave' && renderLeaveContent()}
      {currentView === 'cardDetail' && renderCardDetailView()}
    </div>
  </div>
);
}

export default AuditSystem;
