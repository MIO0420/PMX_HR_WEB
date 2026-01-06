import React, { useState, useEffect } from 'react';
import './css/LeavePage.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import Cookies from 'js-cookie'; // 引入 js-cookie 庫
import { validateUserFromCookies, formatFormNumber } from './function/function'; // 引入共用函數

function LeavePage() {
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [authToken, setAuthToken] = useState(""); // 新增 authToken 狀態
  const [activeTab, setActiveTab] = useState('假別');
  const [activeSubTab, setActiveSubTab] = useState('總覽');
  const [currentTime, setCurrentTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingLeave, setCancelingLeave] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "未記錄";
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr; // 如果無法解析日期，返回原始字符串
  
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
};

  
  // 使用 API 獲取請假申請數據 - 修改為使用 auth_xtbb token
  useEffect(() => {
    if (activeTab === '審核進度') {
      if (!companyId || !employeeId || !authToken) {
        return;
      }

      const fetchLeaveRequests = async () => {
        try {
          setLoading(true);
          
          console.log(`正在查詢員工 ${employeeId} 的請假申請...`);
          
          // 使用 /api/forms/advanced-search API 查詢請假申請，添加 auth_xtbb token
          const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/advanced-search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
            },
            body: JSON.stringify({
              company_id: parseInt(companyId),
              employee_id: employeeId,
              category: "leave",
              includeDetails: true
            })
          });
          
          console.log('發送的請求參數:', {
            company_id: parseInt(companyId),
            employee_id: employeeId,
            category: "leave",
            includeDetails: true
          });
          
          if (!response.ok) {
            throw new Error(`API 請求失敗: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('API 完整回應:', data);
          
          if (data.Status !== "Ok") {
            throw new Error(data.Msg || "查詢失敗");
          }
          
          if (!data.Data || data.Data.length === 0) {
            console.log('沒有找到請假申請數據');
            setLeaveRequests([]);
            setLoading(false);
            return;
          }
          
          // 強制在前端過濾，確保只顯示當前員工的申請
          const currentEmployeeRequests = data.Data.filter(item => {
            const itemEmployeeId = String(item.employee_id);
            const currentEmployeeId = String(employeeId);
            
            console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
            
            return itemEmployeeId === currentEmployeeId;
          });
          
          console.log(`過濾前共 ${data.Data.length} 筆申請`);
          console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的請假申請`);
          
          // 如果沒有找到當前員工的申請，顯示空列表
          if (currentEmployeeRequests.length === 0) {
            console.log('當前員工沒有請假申請');
            setLeaveRequests([]);
            setLoading(false);
            return;
          }
          
          // 處理回應數據，轉換為前端需要的格式
          const userLeaveRequests = currentEmployeeRequests.map((item, index) => {
            console.log('處理申請項目:', item);
            console.log('詳細資料:', item.details);
            
            // 狀態映射 - 根據後端的狀態欄位，更全面地處理所有可能的狀態
            let statusText = "簽核中";
            const currentStatus = item.status || '';
            
            // 轉換為小寫進行比較，確保大小寫不敏感
            const statusLower = currentStatus.toLowerCase();
            
            // 更全面的狀態映射
            if (statusLower === 'approved' || 
                statusLower === 'ok' || 
                statusLower === '已完成' || 
                statusLower === '1') {
              statusText = "已通過";
            } 
            else if (statusLower === 'rejected' || 
                     statusLower === 'no' || 
                     statusLower === '未通過' || 
                     statusLower === '2') {
              statusText = "未通過";
            }
            else if (statusLower === 'pending' || 
                     statusLower === '待審核' || 
                     statusLower === 'approved_pending_hr') {
              statusText = "簽核中";
            }
            
// 格式化申請日期
let submitTime = "未記錄";
if (item.application_date) {
  submitTime = formatDateTime(item.application_date);
}

            
            // 定義請假類型映射表
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
            
            // 處理請假類型 - 根據資料庫結構優先使用 type 欄位
            let leaveTypeName = "未指定";
            let leaveTypeShort = "未";
            
            // 1. 優先使用基本資料的 type 欄位
            if (item.type) {
              // 將 API 值轉換為顯示名稱
              if (leaveTypeMap[item.type]) {
                leaveTypeName = leaveTypeMap[item.type].name;
                leaveTypeShort = leaveTypeMap[item.type].short;
              } else {
                leaveTypeName = item.type;
                leaveTypeShort = item.type.substring(0, 1);
              }
            }
            // 2. 如果基本資料沒有，嘗試從詳細資料獲取
            else if (item.details && item.details.type) {
              // 同樣使用映射表處理詳細資料中的 type
              if (leaveTypeMap[item.details.type]) {
                leaveTypeName = leaveTypeMap[item.details.type].name;
                leaveTypeShort = leaveTypeMap[item.details.type].short;
              } else {
                leaveTypeName = item.details.type;
                leaveTypeShort = item.details.type.substring(0, 1);
              }
            }
            
            console.log('請假類型處理結果:', {
              基本資料type: item.type,
              詳細資料type: item.details?.type,
              最終結果: leaveTypeName
            });
            
            // 處理請假原因 - 根據資料庫結構使用 illustrate 欄位
            let reason = "未填寫";
            
            // 1. 優先使用詳細資料的 illustrate 欄位
            if (item.details && item.details.illustrate) {
              reason = item.details.illustrate;
            }
            // 2. 備用：使用基本資料的 description
            else if (item.description) {
              reason = item.description;
            }
            
            console.log('請假原因處理結果:', {
              詳細資料illustrate: item.details?.illustrate,
              基本資料description: item.description,
              最終結果: reason
            });
            
            // 格式化請假時間 - 根據資料庫結構處理
            let startDateTime = "未指定";
            let endDateTime = "未指定";
            let totalTime = "0小時 0分鐘";
            
            if (item.details) {
              const startDate = item.details.start_date;
              const startTime = item.details.start_time;
              const endDate = item.details.end_date;
              const endTime = item.details.end_time;
              const totalHours = item.details.total_calculation_hours;
              
              // 格式化時間顯示（去除秒數）
              const formatTime = (timeStr) => {
                if (!timeStr) return '';
                return timeStr.split(':').slice(0, 2).join(':');
              };
              
              if (startDate && startTime) {
                startDateTime = `${startDate} ${formatTime(startTime)}`;
              }
              
              if (endDate && endTime) {
                endDateTime = `${endDate} ${formatTime(endTime)}`;
              } else {
                endDateTime = startDateTime;
              }
              
              // 計算總時數
              if (totalHours) {
                const hours = Math.floor(totalHours);
                const minutes = Math.round((totalHours - hours) * 60);
                totalTime = `${hours}小時${minutes}分鐘`;
              }
            }
            
            console.log('請假時間處理結果:', {
              開始日期: item.details?.start_date,
              開始時間: item.details?.start_time,
              結束日期: item.details?.end_date,
              結束時間: item.details?.end_time,
              總時數: item.details?.total_calculation_hours,
              最終顯示: { startDateTime, endDateTime, totalTime }
            });
            
            // 獲取員工姓名和其他基本資訊
            const employeeName = item.employee_name || "朱彥光";
            const reviewer = item.reviewer;
            
            // 修改這裡，使用 formatFormNumber 函數並指定前綴為 'J'
            const formNumber = item.form_number ? 
              (typeof formatFormNumber === 'function' ? formatFormNumber(item.form_number, 'J') : `J${item.form_number}`) : 
              `J${index + 1}`;
            
            return {
              id: formNumber, // 使用修改後的表單編號
              status: statusText,
              originalStatus: currentStatus,
              submitTime: submitTime,
              startTime: startDateTime,
              endTime: endDateTime,
              totalTime: totalTime,
              employee: item.employee_id || employeeId,
              employeeName: employeeName,
              leaveType: leaveTypeName,
              leaveTypeShort: leaveTypeShort,
              reason: reason,
              reviewer: reviewer,
              reviewerJobGrade: item.reviewer_job_grade || "",
              approver: reviewer,
              attachment: item.attachment || '附件名稱.pdf',
              // 保留原始資料以供詳細檢視使用
              originalData: item,
              details: item.details || null
            };
          });
          
          console.log(`成功處理 ${userLeaveRequests.length} 筆請假申請`);
          console.log('處理後的申請列表:', userLeaveRequests);
          setLeaveRequests(userLeaveRequests);
          setLoading(false);
        } catch (err) {
          console.error("獲取請假申請失敗:", err);
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchLeaveRequests();
    }
  }, [activeTab, companyId, employeeId, authToken]);
  
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

  // 處理主標籤點擊
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  
  // 處理子標籤點擊
  const handleSubTabClick = (subTabName) => {
    setActiveSubTab(subTabName);
  };

  // 處理新增請假申請按鈕點擊
  const handleNewLeaveRequest = () => {
    window.location.href = '/apply01';
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
        window.location.href = '/frontpage01';
      }
    } else {
      console.log('瀏覽器環境，使用 window.location.href 導航');
      window.location.href = '/frontpage01';
    }
  };
  
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
  
  // 處理點擊申請單
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // 處理關閉彈窗
  const handleCloseModal = () => {
    setShowModal(false);
    setCancelMessage('');
  };

  // 處理撤銷申請 - 修改為使用 auth_xtbb token
  const handleCancelRequest = async () => {
    if (!selectedRequest || !selectedRequest.id) {
      setCancelMessage('無法撤銷請假：找不到請假單號');
      return;
    }

    setCancelingLeave(true);
    setCancelMessage('正在撤銷請假...');

    try {
      // 實際調用 API 進行撤銷
      const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
        },
        body: JSON.stringify({
          company_id: companyId,
          employee_id: employeeId,
          form_number: selectedRequest.id
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.Status === "Ok") {
        // 從列表中移除已撤銷的請假記錄
        setLeaveRequests(prevRequests => 
          prevRequests.filter(request => request.id !== selectedRequest.id)
        );
        
        setCancelMessage('已成功取消請假申請');
        
        // 延遲關閉詳情視窗，讓用戶看到成功訊息
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        throw new Error(data.Msg || '撤銷請假失敗');
      }
    } catch (err) {
      console.error('撤銷請假出錯:', err);
      setCancelMessage(`撤銷請假失敗：${err.message}`);
    } finally {
      setCancelingLeave(false);
    }
  };
  
  // 根據子標籤過濾請假申請 - 修改為使用 originalStatus 進行過濾
  const getFilteredRequests = () => {
    if (activeSubTab === "總覽") {
      return leaveRequests;
    } else if (activeSubTab === "簽核中") {
      return leaveRequests.filter(request => {
        const status = request.originalStatus.toLowerCase();
        return status === "pending" || status === "待審核" || status === "approved_pending_hr";
      });
    } else if (activeSubTab === "已通過") {
      return leaveRequests.filter(request => {
        const status = request.originalStatus.toLowerCase();
        return status === "ok" || status === "approved" || status === "已完成" || status === "1";
      });
    } else if (activeSubTab === "未通過") {
      return leaveRequests.filter(request => {
        const status = request.originalStatus.toLowerCase();
        return status === "no" || status === "rejected" || status === "未通過" || status === "2";
      });
    }
    return leaveRequests;
  };

  // 獲取請假類型對應的顏色
  const getLeaveTypeColor = (leaveType) => {
    const colorMap = {
      '事假': '#909090',
      '病假': '#FF4D4F',
      '特休': '#4CAF50',
      '換休': '#2196F3',
      '公假': '#9C27B0',
      '生理假': '#FF9800',
      '補休': '#607D8B',
      '婚假': '#E91E63',
      '產檢假': '#00BCD4',
      '產假': '#8BC34A',
      '陪產假': '#673AB7',
      '溫書假': '#795548',
      '生日假': '#FFC107'
    };
    
    return colorMap[leaveType] || '#909090';
  };

  // 獲取狀態對應的顏色 - 修改為符合要求的顏色標準
  const getStatusColor = (status) => {
    if (status === "已通過") {
      return "#4CAF50"; // 綠色
    } else if (status === "未通過") {
      return "#FF4D4F"; // 紅色
    } else {
      return "#909090"; // 灰色 - 簽核中
    }
  };

  // 獲取根據當前子標籤過濾後的申請列表
  const filteredRequests = getFilteredRequests();

  return (
    <div className="container">
      <div className="app-wrapper">
        {/* 頁面標題與時間 */}
        <header className="header">
          <div className="home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt="Home" width="20" height="20" />
          </div>
          <div className="page-title">請假</div>
          <div className="time-display">{currentTime}</div>
        </header>
        
        <div className="content-container">
          <div className="tab-container">
            {/* 假別額度按鈕 */}
            <div 
              className={`tab ${activeTab === '假別' ? 'active' : ''}`}
              onClick={() => handleTabClick('假別')}
            >
              假別
            </div>
            
            {/* 審核進度按鈕 */}
            <div 
              className={`tab ${activeTab === '審核進度' ? 'active' : ''}`}
              onClick={() => handleTabClick('審核進度')}
            >
              審核進度
            </div>
          </div>
          
          <div className="leave-content-frame">
            {activeTab === '假別' && (
              <>
                {leaveTypes.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="category-section">
                    <div className="category-header">{category.category}</div>
                    <div className="leave-grid">
                      {category.types.map((type, typeIndex) => {
                        const { hasDays, days, hours } = parseRemaining(type.remaining);
                        return (
                          <div 
                            key={typeIndex} 
                            className="leave-card"
                          >
                            <div className="leave-card-content">
                              <div className="leave-name">{type.name}</div>
                              <div className="remaining-container">
                                <div className="remaining-label">剩餘</div>
                                {hasDays && (
                                  <div className={`days-container ${!hasDays ? 'hidden' : ''}`}>
                                    <div className="days-value">{days}</div>
                                    <div className="days-unit">天</div>
                                  </div>
                                )}
                                <div className="hours-container">
                                  <div className="hours-value">{hours}</div>
                                  <div className="hours-unit">小時</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
{activeTab === '審核進度' && (
  <>
    {/* 子標籤容器 - 放在 leave-content-frame 內部 */}
    <div className="sub-tab-container" key="sub-tab-container">
      <div 
        className={`sub-tab ${activeSubTab === '總覽' ? 'active' : ''} first-sub-tab`}
        onClick={() => handleSubTabClick('總覽')}
      >
        總覽
      </div>
      <div 
        className={`sub-tab ${activeSubTab === '簽核中' ? 'active' : ''}`}
        onClick={() => handleSubTabClick('簽核中')}
      >
        簽核中
      </div>
      <div 
        className={`sub-tab ${activeSubTab === '已通過' ? 'active' : ''}`}
        onClick={() => handleSubTabClick('已通過')}
      >
        已通過
      </div>
      <div 
        className={`sub-tab ${activeSubTab === '未通過' ? 'active' : ''} last-sub-tab`}
        onClick={() => handleSubTabClick('未通過')}
      >
        未通過
      </div>
    </div>
    
    {/* 申請單列表內容 */}
    {loading ? (
      <div className="loading-container">
        <div>載入中...</div>
        <div className="loading-text">正在獲取請假申請數據</div>
      </div>
    ) : error ? (
      <div className="error-container">
        <div>發生錯誤: {error}</div>
        <div>請稍後再試或聯繫系統管理員</div>
      </div>
    ) : filteredRequests.length === 0 ? (
      <div className="empty-message">
        {activeSubTab === "總覽" ? "目前無申請單" : `目前無${activeSubTab}的申請單`}
      </div>
    ) : (
      <div className="requests-list">
        {filteredRequests.map((request, index) => (
          <div                       
            key={index} 
            className="request-card"
            onClick={() => handleRequestClick(request)}
          >
            <div className="request-id">{request.id}</div>
            <div className="submit-time">送出時間：{request.submitTime}</div>
            <div className="divider"></div>
            
            <div 
              className="leave-type-circle"
              style={{borderColor: getStatusColor(request.status)}}
            ></div>
            <div 
              className={`leave-type-text ${request.leaveTypeShort.length > 1 ? 'small-text' : ''}`}
              style={{color: getStatusColor(request.status)}}
            >
              {request.leaveTypeShort}
            </div>
            
            <div className="leave-type-label">請假類型：{request.leaveType}</div>
            <div className="leave-time-range">時間起迄：{request.startTime.split(' ')[0]} {request.startTime.split(' ')[1]}</div>
            <div className="leave-time-end">{request.endTime.split(' ')[0]} {request.endTime.split(' ')[1]}</div>
            <div className="leave-duration">請假時數：{request.totalTime}</div>
            
            <div 
              className="status-badge"
              style={{backgroundColor: getStatusColor(request.status)}}
            ></div>
            <div className="status-text">{request.status}</div>
          </div>
        ))}
      </div>
    )}
  </>
)}

          </div>
          
          {/* 只在審核進度頁面顯示新增請假申請按鈕 */}
          {activeTab === '審核進度' && (
            <div className="bottom-button">
              <button 
                className="new-leave-request-button"
                onClick={handleNewLeaveRequest}
              >
                新增請假申請
              </button>
            </div>
          )}
        </div>
      </div>

{/* 請假申請詳情彈窗 - 修改為與補卡申請一致的樣式 */}
{showModal && selectedRequest && (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <button className="close-button" onClick={handleCloseModal}>×</button>
        <div className="modal-title">請假申請單</div>
      </div>
      
      <div className="modal-body">
        <div className="modal-info-section">
<div className="modal-row">
  <span className="modal-label">送出時間：</span>
  <span className="modal-value">{selectedRequest.submitTime}</span>
</div>

          
          <div className="modal-row">
            <span className="modal-label">單號：<span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{selectedRequest.id}</span></span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">員工：{selectedRequest.employeeName}</span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">狀態：</span>
            <span style={{ 
              padding: '4px 10px', 
              backgroundColor: getStatusColor(selectedRequest.status),
              borderRadius: '8px', 
              color: '#ffffff', 
              fontSize: '14px',
              display: 'inline-block', 
              textAlign: 'center', 
              minWidth: '60px',
              marginLeft: '0',  // 移除左邊距
              position: 'relative',
              top: '0',
              left: '-35px'  // 向左移動一點，使其更接近冒號
            }}>
              {selectedRequest.status}
            </span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">請假類型：{selectedRequest.leaveType}</span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">請假時間起迄：{selectedRequest.startTime}</span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">{selectedRequest.endTime}</span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">總時數：{selectedRequest.totalTime}</span>
          </div>
          
          <div className="modal-row">
            <span className="modal-label">請假說明：{selectedRequest.reason}</span>
          </div>
          
          {selectedRequest.attachment && (
            <div className="modal-row">
              <span className="modal-label">附件：{selectedRequest.attachment}</span>
            </div>
          )}
          
          <div className="modal-row">
            <span className="modal-label">核准人：{selectedRequest.approver}</span>
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        {(selectedRequest.status === "簽核中" || selectedRequest.status === "待HR審核") && (
          <button 
            className="cancel-request-button" 
            onClick={handleCancelRequest}
            disabled={cancelingLeave}
          >
            {cancelingLeave ? '處理中...' : '撤銷'}
          </button>
        )}
        <button 
          className={`close-modal-button ${
            selectedRequest.status !== "簽核中" && selectedRequest.status !== "待HR審核" ? "full-width" : ""
          }`}
          onClick={handleCloseModal}
        >
          關閉
        </button>
      </div>
      
      {cancelMessage && (
        <div className="cancel-message">
          {cancelMessage}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}

export default LeavePage;
