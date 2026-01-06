import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LeavePage() {
  // 主標籤狀態
  const [activeTab, setActiveTab] = useState('假別額度');
  // 子標籤狀態（審核進度下的子標籤）
  const [activeSubTab, setActiveSubTab] = useState('總覽');
  const [currentTime, setCurrentTime] = useState('');
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // 顯示請假詳情的狀態
  const [showLeaveDetail, setShowLeaveDetail] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  // 撤銷請假的狀態
  const [cancelingLeave, setCancelingLeave] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  
  // API的代理伺服器URL
  const proxyServerUrl = '/api/erp-gateway';
  
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

  // 假別資料，所有剩餘時間統一歸零
  const leaveTypes = [
    { category: '法定假別', types: [
      { name: '事假', remaining: '0天0小時' },
      { name: '病假', remaining: '0小時' },
      { name: '公假', remaining: '0小時' },
      { name: '生理假', remaining: '0天0小時' },
      { name: '家庭照顧假', remaining: '0小時' },
      { name: '公傷病假', remaining: '0小時' },
      { name: '婚假', remaining: '0天0小時' },
      { name: '產檢假', remaining: '0小時' },
      { name: '陪產(檢)假', remaining: '0天0小時' },
      { name: '安胎假', remaining: '0天0小時' },
      { name: '產假', remaining: '0天0小時' },
      { name: '育嬰假', remaining: '0天0小時' },
      { name: '換休', remaining: '0小時' },
      { name: '特休', remaining: '0小時' },
      { name: '喪假', remaining: '0天0小時' },
    ]},
    { category: '公司福利假別', types: [
      { name: '生日假', remaining: '0小時' },
    ]}
  ];

  // 獲取請假數據
  useEffect(() => {
    if (activeTab === '審核進度') {
      fetchLeaveData();
    }
  }, [activeTab]);

  // 處理主標籤點擊
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  
  // 處理子標籤點擊
  const handleSubTabClick = (subTabName) => {
    setActiveSubTab(subTabName);
  };

  // 處理返回首頁
  const handleGoHome = () => {
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
      console.log('檢測到 App 環境，使用 Flutter 導航');
      
      try {
        if (window.flutter && window.flutter.postMessage) {
          window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
          window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
        } else {
          const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
            detail: { action: 'navigate_home' }
          });
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.error('無法使用 Flutter 導航:', err);
        navigate('/frontpage');
      }
    } else {
      console.log('瀏覽器環境，使用 React Router 導航');
      navigate('/frontpage');
    }
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
          "filters": [],
          "or_filters": [
            ["client_id", "=", "HR_00001"]
          ],
          "with_child_tables": true,
          "child_tables": {}
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
            attachment: record.attachment_name || '附件名稱.pdf'
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

  // 獲取假別對應的圖示
  const getLeaveIcon = (leaveType) => {
    const iconMap = {
      'personal_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#3A6CA6"/>
        </svg>
      ),
      'sick_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3.01 3.9 3.01 5L3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 14H14V18H10V14H6V10H10V6H14V10H18V14Z" fill="#E53935"/>
        </svg>
      ),
      'annual_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM12 17L16 13H13V9H11V13H8L12 17Z" fill="#4CAF50"/>
        </svg>
      ),
      'compensatory_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#FF9800"/>
          <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#FF9800"/>
        </svg>
      ),
      'menstrual_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#E91E63"/>
        </svg>
      ),
      'makeup_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#9C27B0"/>
        </svg>
      ),
      'official_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#2196F3"/>
        </svg>
      ),
      'marriage_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#F06292"/>
        </svg>
      ),
      'prenatal_checkup_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#8BC34A"/>
        </svg>
      ),
      'maternity_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#FF7043"/>
        </svg>
      ),
      'paternity_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#5C6BC0"/>
        </svg>
      ),
      'study_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#795548"/>
        </svg>
      ),
      'birthday_leave': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6C13.11 6 14 5.1 14 4C14 3.62 13.9 3.27 13.71 2.97L12 0L10.29 2.97C10.1 3.27 10 3.62 10 4C10 5.1 10.9 6 12 6ZM16.6 16L15.53 14.92L14.45 16L13.38 14.92L12.31 16L11.23 14.92L10.16 16L9.08 14.92L8 16V15.27C8 14.12 8.89 13.14 10 13V5H14V13C15.11 13.14 16 14.12 16 15.27V16H16.6ZM18 18H6C4.9 18 4 18.9 4 20V22H20V20C20 18.9 19.1 18 18 18Z" fill="#FFC107"/>
        </svg>
      )
    };
    
    return iconMap[leaveType] || null;
  };

  // 處理新增請假申請
  const handleNewLeaveRequest = () => {
    navigate('/apply');
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
      const requestBody = {
        "action": "cancel_leave_application",
        "company_id": "polime",
        "data": {
          "leave_application_id": selectedLeave.id
        }
      };

      console.log('發送撤銷請假請求:', JSON.stringify(requestBody, null, 2));
      
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      };
      
      // 使用與 fetchLeaveData 相同的代理伺服器路徑格式，但改為 process-request
      const response = await axios.post(`${proxyServerUrl}/process-request`, requestBody, axiosConfig);
      
      console.log('撤銷請假回應:', response.data);
      
      if (response.data && response.data.message && response.data.message.status === 'success') {
        setCancelMessage('已成功取消請假申請');
        
        // 從列表中移除已撤銷的請假記錄
        setLeaveRecords(prevRecords => 
          prevRecords.filter(record => record.id !== selectedLeave.id)
        );
        
        // 延遲關閉詳情視窗，讓用戶看到成功訊息
        setTimeout(() => {
          handleCloseLeaveDetail();
        }, 1500);
      } else {
        setCancelMessage('撤銷請假失敗：' + (response.data?.message?.message || '未知錯誤'));
      }
    } catch (error) {
      console.error('撤銷請假出錯:', error);
      setCancelMessage(`撤銷請假失敗：${error.message}`);
    } finally {
      setCancelingLeave(false);
    }
  };

  // 根據當前選擇的子標籤篩選記錄
  const filteredRecords = activeSubTab === '總覽' 
    ? leaveRecords 
    : leaveRecords.filter(record => {
        if (activeSubTab === '簽核中') return record.status === '簽核中';
        if (activeSubTab === '已通過') return record.status === '已通過';
        if (activeSubTab === '未通過') return record.status === '未通過';
        return true;
      });

  // 解析剩餘時間字符串，分離天數和小時數
  const parseRemaining = (remaining) => {
    // 檢查是否包含"天"
    const hasDays = remaining.includes('天');
    
    if (hasDays) {
      const parts = remaining.split('天');
      return { 
        hasDays: true, 
        days: parts[0], 
        hours: parts[1].replace('小時', '') 
      };
    } else {
      return { 
        hasDays: false, 
        days: null, 
        hours: remaining.replace('小時', '') 
      };
    }
  };

  // 樣式定義
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa',
      overflow: 'hidden', // 防止整體頁面滾動
    },
    appWrapper: {
      width: '360px',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // 防止應用內滾動
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3a75b5',
      color: 'white',
      padding: '0 16px',
      height: '50px',
      flexShrink: 0, // 防止頭部被壓縮
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
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0px',
      gap: '10px',
      width: '100%',
      marginTop: '10px',
      flexGrow: 1, // 允許內容區域填充剩餘空間
      overflow: 'hidden', // 防止內容容器滾動
    },
    tabContainer: {
      width: '342px',
      height: '36px',
      position: 'relative',
      display: 'flex',
      flexShrink: 0, // 防止標籤被壓縮
    },
    tab: (isActive) => ({
      boxSizing: 'border-box',
      width: '171px',
      height: '36px',
      backgroundColor: isActive ? '#3A6CA6' : '#FFFFFF',
      border: isActive ? 'none' : '1px solid #E9E9E9',
      borderRadius: isActive ? '5px 0px 0px 5px' : '0px 5px 5px 0px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isActive ? '#FFFFFF' : '#3A6CA6',
      fontWeight: '700',
      fontSize: '16px',
    }),
    leaveContentFrame: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '15px',
      width: '342px',
      flexGrow: 1, // 允許內容區域填充剩餘空間
      overflowY: 'auto', // 只允許垂直滾動
      overflowX: 'hidden', // 禁止水平滾動
      marginBottom: '10px', // 底部留出一些空間
    },
    categorySection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '5px',
      width: '342px',
      flexShrink: 0, // 防止類別區域被壓縮
    },
    categoryHeader: {
      width: '342px',
      height: '19px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '19px',
      letterSpacing: '0.01em',
      color: '#909090',
    },
    leaveGrid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      padding: '0px',
      gap: '6px',
      width: '342px',
    },
    leaveCard: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '10px',
      gap: '5px',
      width: '110px', // 調整為一行3格的寬度
      height: '62px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E9E9E9',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    leaveCardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '2px',
      width: '90px',
      height: '42px',
    },
    leaveName: {
      width: '90px',
      height: '20px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '14px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
      color: '#3A6CA6',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    remainingContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: '0px',
      gap: '2px',
      width: '90px',
      height: '16px',
      overflow: 'hidden',
    },
    remainingLabel: {
      width: '24px',
      height: '16px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '16px',
      textAlign: 'right',
      color: '#909090',
      flexShrink: 0,
    },
    daysContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0px',
      gap: '1px',
      height: '16px',
      flexShrink: 0,
    },
    daysContainerHidden: {
      display: 'none',
    },
    daysValue: {
      height: '16px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '12px',
      lineHeight: '16px',
      textAlign: 'right',
      color: '#909090',
      flexShrink: 0,
    },
    daysUnit: {
      height: '16px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '16px',
      color: '#909090',
      flexShrink: 0,
    },
    hoursContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0px',
      gap: '1px',
      height: '16px',
      flexShrink: 0,
    },
    hoursValue: {
      height: '16px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '12px',
      lineHeight: '16px',
      textAlign: 'right',
      color: '#909090',
      flexShrink: 0,
    },
    hoursUnit: {
      height: '16px',
      fontFamily: '"Microsoft JhengHei"',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '16px',
      color: '#909090',
      flexShrink: 0,
    },
    subTabContainer: {
      display: 'flex',
      width: '342px',
      height: '36px',
      marginBottom: '15px',
      gap: '2px', // 標籤之間的間隔
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
      border: '1px solid #e0e0e0',
      borderRadius: '0px',
    }),
    firstSubTab: (isActive) => ({
      borderTopLeftRadius: '5px',
      borderBottomLeftRadius: '5px',
    }),
    lastSubTab: (isActive) => ({
      borderTopRightRadius: '5px',
      borderBottomRightRadius: '5px',
    }),
    newLeaveRequestButton: {
      width: '342px',
      height: '40px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #3A6CA6',
      borderRadius: '5px',
      color: '#3A6CA6',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
      marginBottom: '20px',
    },
    bottomButton: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    leaveRecordCard: {
      position: 'relative',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      padding: '16px',
      marginBottom: '10px',
      width: '100%',
      cursor: 'pointer',
    },
    statusCircle: (status) => {
      let bgColor;
      switch(status) {
        case '已通過':
          bgColor = '#4CAF50'; // 綠色
          break;
        case '未通過':
          bgColor = '#F44336'; // 紅色
          break;
        default:
          bgColor = '#3a75b5'; // 藍色
      }
      
      return {
        position: 'absolute',
        left: '16px',
        top: '30px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
      };
    },
    statusBadge: (status) => {
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
          color = '#3a75b5';
          bgColor = '#E3F2FD';
      }
      
      return {
        position: 'absolute',
        right: '16px',
        top: '16px',
        padding: '2px 8px',
        borderRadius: '4px',
        backgroundColor: bgColor,
        color: color,
        fontSize: '12px',
        fontWeight: 'bold',
      };
    },
    leaveInfo: {
      marginLeft: '50px',
    },
    leaveId: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '2px',
    },
    submitTime: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px',
    },
    leaveType: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    leaveTime: {
      fontSize: '13px',
      color: '#333',
      marginBottom: '4px',
    },
    leaveHours: {
      fontSize: '13px',
      color: '#333',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px',
      width: '100%',
    },
    errorContainer: {
      padding: '20px',
      textAlign: 'center',
      color: 'red',
      width: '100%',
    },
    noRecords: {
      padding: '30px 0',
      textAlign: 'center',
      color: '#666',
      width: '100%',
    },
    retryButton: {
      padding: '8px 16px',
      background: '#3a75b5',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
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
      backgroundColor: '#FFFFFF',
      borderRadius: '5px',
      padding: '20px',
      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      border: '1px solid #9c27b0',
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
          color = '#3a75b5';
          bgColor = '#E3F2FD';
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* 頁面標題與時間 */}
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={handleGoHome}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div style={styles.pageTitle}>請假</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>
        
        <div style={styles.contentContainer}>
          <div style={styles.tabContainer}>
            {/* 假別額度按鈕 */}
            <div 
              style={styles.tab(activeTab === '假別額度')}
              onClick={() => handleTabClick('假別額度')}
            >
              假別
            </div>
            
            {/* 審核進度按鈕 */}
            <div 
              style={styles.tab(activeTab === '審核進度')}
              onClick={() => handleTabClick('審核進度')}
            >
              審核進度
            </div>
          </div>
          
          <div style={styles.leaveContentFrame}>
            {/* 假別額度標籤頁 */}
            {activeTab === '假別額度' && (
              leaveTypes.map((category, categoryIndex) => (
                <div key={categoryIndex} style={styles.categorySection}>
                  <div style={styles.categoryHeader}>{category.category}</div>
                  <div style={styles.leaveGrid}>
                    {category.types.map((type, typeIndex) => {
                      const { hasDays, days, hours } = parseRemaining(type.remaining);
                      return (
                        <div 
                          key={typeIndex} 
                          style={styles.leaveCard}
                        >
                          <div style={styles.leaveCardContent}>
                            <div style={styles.leaveName}>{type.name}</div>
                            <div style={styles.remainingContainer}>
                              <div style={styles.remainingLabel}>剩餘</div>
                              {hasDays && (
                                <div style={styles.daysContainer}>
                                  <div style={styles.daysValue}>{days}</div>
                                  <div style={styles.daysUnit}>天</div>
                                </div>
                              )}
                              <div style={styles.hoursContainer}>
                                <div style={styles.hoursValue}>{hours}</div>
                                <div style={styles.hoursUnit}>小時</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            
            {/* 審核進度標籤頁 */}
            {activeTab === '審核進度' && (
              <>
                <div style={styles.subTabContainer}>
                  <div 
                    style={{
                      ...styles.subTab(activeSubTab === '總覽'),
                      ...styles.firstSubTab(activeSubTab === '總覽')
                    }}
                    onClick={() => handleSubTabClick('總覽')}
                  >
                    總覽
                  </div>
                  <div 
                    style={styles.subTab(activeSubTab === '簽核中')}
                    onClick={() => handleSubTabClick('簽核中')}
                  >
                    簽核中
                  </div>
                  <div 
                    style={styles.subTab(activeSubTab === '已通過')}
                    onClick={() => handleSubTabClick('已通過')}
                  >
                    已通過
                  </div>
                  <div 
                    style={{
                      ...styles.subTab(activeSubTab === '未通過'),
                      ...styles.lastSubTab(activeSubTab === '未通過')
                    }}
                    onClick={() => handleSubTabClick('未通過')}
                  >
                    未通過
                  </div>
                </div>
                
                {loading ? (
                  <div style={styles.loadingContainer}>載入中...</div>
                ) : error ? (
                  <div style={styles.errorContainer}>
                    {error}
                    <button style={styles.retryButton} onClick={fetchLeaveData}>重新嘗試</button>
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div style={styles.noRecords}>
                    目前無申請單
                  </div>
                ) : (
                  filteredRecords.map(record => (
                    <div 
                      key={record.id} 
                      style={styles.leaveRecordCard}
                      onClick={() => handleLeaveRecordClick(record)}
                    >
                      <div style={styles.statusCircle(record.status)}>
                        {record.statusType}
                      </div>
                      <div style={styles.statusBadge(record.status)}>
                        {record.status}
                      </div>
                      <div style={styles.leaveInfo}>
                        <div style={styles.leaveId}>{record.id}</div>
                        <div style={styles.submitTime}>送出時間：{record.submitTime}</div>
                        <div style={styles.leaveType}>請假類型：{record.leaveType}</div>
                        <div style={styles.leaveTime}>
                          時間起迄：{record.startDate} {record.startTime} ~ {record.endDate} {record.endTime}
                        </div>
                        <div style={styles.leaveHours}>請假時數：{record.leaveHours}</div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* 新增請假申請按鈕 */}
                <div style={styles.bottomButton}>
                  <button 
                    style={styles.newLeaveRequestButton}
                    onClick={handleNewLeaveRequest}
                  >
                    新增請假申請
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 請假詳情彈窗 - 修改：只有"簽核中"狀態的請假單才顯示撤銷按鈕 */}
      {showLeaveDetail && selectedLeave && (
        <div style={styles.modalOverlay}>
          <div style={styles.leaveDetailCard}>
            <div style={styles.detailTitle}>請假申請單</div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>送出時間:</div>
              <div style={styles.fieldValue}>{selectedLeave.submitTime}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>單號:</div>
              <div style={styles.fieldValue}>{selectedLeave.id}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>員工:</div>
              <div style={styles.fieldValue}>{selectedLeave.employeeName || '朱彥光'}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>狀態:</div>
              <div style={styles.fieldValue}>
                <span style={styles.statusBadgeDetail(selectedLeave.status)}>
                  {selectedLeave.status}
                </span>
              </div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>請假類型:</div>
              <div style={styles.fieldValue}>{selectedLeave.leaveType}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>請假時間起迄:</div>
              <div style={styles.fieldValue}>
                {selectedLeave.startDate} {selectedLeave.startTime}<br/>
                {selectedLeave.endDate} {selectedLeave.endTime}
              </div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>總時數:</div>
              <div style={styles.fieldValue}>{selectedLeave.leaveHours}</div>
            </div>
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>請假說明:</div>
              <div style={styles.fieldValue}>{selectedLeave.illustrate}</div>
            </div>
            
            {selectedLeave.attachment && (
              <div style={styles.detailField}>
                <div style={styles.fieldLabel}>附件:</div>
                <div style={styles.fieldValue}>
                  <span style={styles.attachmentLink}>{selectedLeave.attachment}</span>
                </div>
              </div>
            )}
            
            <div style={styles.detailField}>
              <div style={styles.fieldLabel}>核准人:</div>
              <div style={styles.fieldValue}>{selectedLeave.approver}</div>
            </div>
            
            {/* 顯示撤銷訊息 */}
            {cancelMessage && (
              <div style={styles.cancelMessage}>
                {cancelMessage}
              </div>
            )}
            
            <div style={styles.buttonContainer}>
              {/* 只有"簽核中"狀態的請假單才顯示撤銷按鈕 */}
              {selectedLeave.status === '簽核中' && (
                <button 
                  style={styles.cancelButton}
                  onClick={handleCancelLeave}
                  disabled={cancelingLeave}
                >
                  {cancelingLeave ? '處理中...' : '撤銷'}
                </button>
              )}
              <button 
                style={{
                  ...styles.closeButton,
                  flex: selectedLeave.status === '簽核中' ? 1 : 'auto',
                  width: selectedLeave.status === '簽核中' ? 'auto' : '100%'
                }}
                onClick={handleCloseLeaveDetail}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeavePage;
