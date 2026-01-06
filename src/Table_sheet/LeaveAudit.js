import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Table_sheet_css/SharedAuditStyles.module.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import returnIcon from '../Google_sheet/HomePageImage/return.png';
import portraitIcon from '../Google_sheet/HomePageImage/Portrait.png';

// 引入共用組件和函數
import {
  getCookieValue,
  fetchEmployeeInfo,
  getStatusDisplay,
  LoadingIndicator,
  EmptyData,
  ErrorMessage
} from './fun/SharedComponents';

// API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

// 假期類型中英文對照表
const leaveTypeMap = {
  'compensatory_leave': { name: '換休' },
  'annual_leave': { name: '特休' },
  'personal_leave': { name: '事假' },
  'sick_leave': { name: '病假' },
  'menstrual_leave': { name: '生理假' },
  'makeup_leave': { name: '補休' },
  'official_leave': { name: '公假' },
  'marriage_leave': { name: '婚假' },
  'prenatal_checkup_leave': { name: '產檢假' },
  'maternity_leave': { name: '產假' },
  'paternity_leave': { name: '陪產假' },
  'study_leave': { name: '溫書假' },
  'birthday_leave': { name: '生日假' }
};

// 格式化日期，將 / 替換為 - 並確保月份和日期都是兩位數
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // 先將 / 替換為 -
  let formattedDate = dateString.replace(/\//g, '-');
  
  // 分割日期部分
  const parts = formattedDate.split('-');
  if (parts.length === 3) {
    // 確保年份、月份和日期都是適當的格式
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    
    // 重新組合日期
    formattedDate = `${year}-${month}-${day}`;
  }
  
  return formattedDate;
};

// 格式化時間，只顯示到分鐘
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5);
};

// 獲取假期類型的中文名稱
const getLeaveTypeName = (englishType) => {
  if (leaveTypeMap[englishType]) {
    return leaveTypeMap[englishType].name;
  }
  return englishType;
};

// 自定義 Header 組件
const Header = ({ title, currentTime, handleHomeClick, styles }) => (
  <div className={styles.header}>
    <div className={styles.homeIcon} onClick={handleHomeClick}>
      <img src={homeIcon} alt="首頁" style={{ width: '20px', height: '20px' }} />
    </div>
    <div className={styles.pageTitle}>{title}</div>
    <div className={styles.timeDisplay}>{currentTime}</div>
  </div>
);

// 自定義返回系統連結組件
const BackToSystemLink = ({ handleBackToAuditSystem, styles }) => (
  <div className={styles.backToSystemLink} onClick={handleBackToAuditSystem}>
    <div className={styles.backLinkContent}>
      <img 
        src={returnIcon} 
        alt="返回" 
        className={styles.backIcon}
        style={{ width: '16px', height: '16px' }}
      />
      <span className={styles.backText}>返回簽核系統</span>
    </div>
  </div>
);

// 自定義狀態過濾標籤容器組件
const StatusTabContainer = ({ statusFilter, handleStatusFilterChange, styles }) => (
  <div className={styles.statusTabContainer}>
    <div 
      className={`${styles.tab} ${statusFilter === "簽核中" ? styles.activeTab : ""}`}
      onClick={() => handleStatusFilterChange("簽核中")}
    >
      <span className={`${styles.tabText} ${statusFilter === "簽核中" ? styles.activeTabText : ""}`}>
        簽核中
      </span>
    </div>
    <div 
      className={`${styles.tab} ${statusFilter === "已通過" ? styles.activeTab : ""}`}
      onClick={() => handleStatusFilterChange("已通過")}
    >
      <span className={`${styles.tabText} ${statusFilter === "已通過" ? styles.activeTabText : ""}`}>
        已通過
      </span>
    </div>
    <div 
      className={`${styles.tab} ${statusFilter === "未通過" ? styles.activeTab : ""}`}
      onClick={() => handleStatusFilterChange("未通過")}
    >
      <span className={`${styles.tabText} ${statusFilter === "未通過" ? styles.activeTabText : ""}`}>
        未通過
      </span>
    </div>
  </div>
);

// 自定義請求詳情組件
const RequestDetail = ({ 
  type, 
  request, 
  onBack, 
  currentTime, 
  handleHomeClick, 
  onApprove, 
  onReject,
  styles,
  employeeNames
}) => {
  // 根據申請單狀態設置顯示文字、背景顏色和文字顏色
  const getStatusDisplay = () => {
    if (request.status === "ok") {
      return { 
        text: "已通過", 
        bgColor: "#4caf50",
        color: "#ffffff"
      };
    } else if (request.status === "no") {
      return { 
        text: "未通過", 
        bgColor: "#f44336",
        color: "#ffffff"
      };
    } else {
      return { 
        text: "簽核中", 
        bgColor: "#9e9e9e",
        color: "#ffffff"
      };
    }
  };

  const statusDisplay = getStatusDisplay();
  
  return (
    <div className={styles.container}>
      <div className={styles.appWrapper}>
        <div className={styles.header}>
          <div className={styles.homeIcon} onClick={handleHomeClick}>
            <img src={homeIcon} alt="首頁" style={{ width: '20px', height: '20px' }} />
          </div>
          <div className={styles.pageTitle}>{type === 'leave' ? '請假申請單' : '補卡申請單'}</div>
          <div className={styles.timeDisplay}>{currentTime}</div>
        </div>
        
        <div 
          className={styles.backToSystemLink}
          onClick={onBack}
          style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}
        >
          <div className={styles.backLinkContent} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img 
              src={returnIcon} 
              alt="返回" 
              className={styles.backIcon}
              style={{ width: '16px', height: '16px', marginRight: '5px' }}
            />
            <span className={styles.backText}>返回</span>
          </div>
        </div>
        
        <div className={styles.contentContainer}>
          <div style={{ 
            padding: '0 20px',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '10px 0' }}>
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>送出時間：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>{formatDate(request.application_date)}</span>
              </div>
              
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>單號：</span>
                <span style={{ 
                  color: '#3A6CA6',
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}>
                  {request.form_number}
                </span>
              </div>
              
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>員工：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>
                  {request.name || (employeeNames && request.employee_id && employeeNames[request.employee_id]) || request.employee_id}
                </span>
              </div>
              
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>狀態：</span>
                <span style={{ 
                  padding: '4px 10px',
                  backgroundColor: statusDisplay.bgColor,
                  borderRadius: '8px',
                  color: statusDisplay.color, 
                  fontSize: '14px',
                  marginLeft: '4px',
                  display: 'inline-block',
                  textAlign: 'center',
                  minWidth: '60px'
                }}>
                  {statusDisplay.text}
                </span>
              </div>
              
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>請假類型：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>{getLeaveTypeName(request.type)}</span>
              </div>
              
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>請假時間起迄：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>
                  {request.start_date} {formatTime(request.start_time)}
                </span>
              </div>
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px', visibility: 'hidden' }}>請假時間起迄：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>
                  {request.end_date} {formatTime(request.end_time)}
                </span>
              </div>

              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>總時數：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>
                  {Math.floor(request.total_calculation_hours / 8)}天 {request.total_calculation_hours % 8}小時 0分鐘
                </span>
              </div>
              
              {request.illustrate && (
                <div style={{ margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>請假說明：</span>
                  <span style={{ color: '#333', fontSize: '14px' }}>{request.illustrate}</span>
                </div>
              )}
              
              {request.status !== "pending" && (
                <div style={{ margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>核准人：</span>
                  <span style={{ color: '#333', fontSize: '14px' }}>{request.reviewer || "朱老師"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {request.status === "pending" && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}>
            <button 
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              onClick={() => onReject(request.form_number)}
            >
              退回申請
            </button>
            <button 
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#3a75c4',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              onClick={() => onApprove(request.form_number)}
            >
              批准簽名
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 格式化表單編號函數
const formatFormNumber = (formNumber) => {
  if (!formNumber) return formNumber;
  
  if (!formNumber.startsWith('FORM-')) return formNumber;
  
  const parts = formNumber.split('-');
  if (parts.length >= 2 && parts[1].length >= 14) {
    const yearLastTwoDigits = parts[1].substring(2, 4);
    const restOfTimestamp = parts[1].substring(4);
    return 'E' + yearLastTwoDigits + restOfTimestamp;
  }
  
  return formNumber;
};

// 獲取員工姓名的函數
const fetchEmployeeName = async (companyId, employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/employee/info`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: companyId,
        employee_id: employeeId
      })
    });
    
    if (!response.ok) {
      throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.Status !== "Ok" || !result.Data) {
      throw new Error(result.Msg || "獲取員工資料失敗");
    }
    
    return result.Data.name || result.Data.employee_name || employeeId;
  } catch (error) {
    console.error("獲取員工姓名失敗:", error);
    return employeeId;
  }
};

// 請假審核組件
const LeaveAudit = ({ 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick
}) => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("簽核中");
  const [employeeNames, setEmployeeNames] = useState({});

  // 從 cookies 獲取員工編號、公司ID和員工姓名
  useEffect(() => {
    const cookieEmployeeId = getCookieValue('employee_id');
    const cookieCompanyId = getCookieValue('company_id');
    const cookieEmployeeName = getCookieValue('employee_name');
    console.log('從 cookies 獲取的員工編號:', cookieEmployeeId);
    console.log('從 cookies 獲取的公司ID:', cookieCompanyId);
    console.log('從 cookies 獲取的員工姓名:', cookieEmployeeName);
    
    if (!cookieEmployeeId || !cookieCompanyId) {
      console.log('cookies 中缺少必要資訊，跳轉到登入頁面');
      navigate('/applogin01/');
      return;
    }
    
    setEmployeeId(cookieEmployeeId);
    setCompanyId(cookieCompanyId);
    setEmployeeName(cookieEmployeeName || "");
  }, [navigate]);

  // 獲取員工基本資料和上級資訊
  const fetchEmployeeInformation = useCallback(async () => {
    if (!employeeId) return;

    try {
      const data = await fetchEmployeeInfo(employeeId);
      setEmployeeData(data);
      console.log('員工資料獲取成功:', data);
    } catch (err) {
      console.error("獲取員工資料失敗:", err);
      setError(`獲取員工資料失敗: ${err.message}`);
    }
  }, [employeeId]);

  // 處理狀態過濾變更
  const handleStatusFilterChange = (status) => {
    console.log('狀態過濾器變更為:', status);
    setStatusFilter(status);
  };

  // 獲取請假申請表單數據
  const fetchLeaveRequests = useCallback(async () => {
    if (!employeeId || !companyId) return;
    
    try {
      setLoading(true);
      
      const criteria = {
        company_id: companyId,
        category: "leave",
        status: statusFilter === "簽核中" ? "pending" : 
                statusFilter === "已通過" ? "ok" : 
                statusFilter === "未通過" ? "no" : undefined
      };
      
      console.log('發送請求條件:', criteria);
      
      const apiUrl = `${API_BASE_URL}/api/applications/filter?company_id=${criteria.company_id}&category=${criteria.category}${criteria.status ? `&status=${criteria.status}` : ''}`;
      console.log('API 請求 URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
      }
      
      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 解析失敗:', parseError);
        console.log('返回的原始數據:', responseText);
        throw new Error(`無法解析 API 回應: ${parseError.message}`);
      }
      
      console.log('API返回結果:', result);
      
      if (result.Status !== "Ok") {
        throw new Error(result.Msg || "獲取請假申請失敗");
      }
      
      if (!result.Data || result.Data.length === 0) {
        setRequests([]);
        return;
      }
      
      const formattedRequests = result.Data.map(item => ({
        form_id: item.form_id,
        form_number: formatFormNumber(item.form_number),
        original_form_number: item.form_number,
        employee_id: item.employee_id,
        name: item.employee_name || "",
        department: item.department,
        position: item.position,
        job_grade: item.job_grade,
        application_date: new Date(item.application_date).toLocaleDateString('zh-TW'),
        application_time: item.application_time || "",
        start_date: item.primary_date,
        start_time: item.start_time,
        end_date: item.end_date,
        end_time: item.end_time,
        total_calculation_hours: item.total_hours,
        type: item.type,
        illustrate: item.illustrate,
        status: item.status,
        reviewer: item.reviewer,
        hrreviewer: item.hrreviewer,
        hrstatus: item.hrstatus,
        company_id: item.company_id
      }));
      
      console.log('格式化後的請假申請數據:', formattedRequests);
      setRequests(formattedRequests);
      
      const employeeIds = formattedRequests.map(req => req.employee_id);
      const uniqueEmployeeIds = [...new Set(employeeIds)];
      
      const namesMap = {};
      for (const id of uniqueEmployeeIds) {
        if (!id) continue;
        const name = await fetchEmployeeName(companyId, id);
        namesMap[id] = name;
      }
      
      setEmployeeNames(namesMap);
      setError(null);
      
    } catch (err) {
      console.error("獲取請假申請失敗:", err);
      setError(`獲取數據失敗: ${err.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, companyId, statusFilter]);

  // 🔥 修改：處理審批操作 - 使用新的 PATCH API
  const handleApprove = async (formNumber) => {
    try {
      setLoading(true);
      
      // 找到對應請求，使用原始表單編號
      const request = requests.find(r => r.form_number === formNumber);
      const originalFormNumber = request ? request.original_form_number || formNumber : formNumber;
      
      console.log('🔥 開始審批流程 - 表單編號:', originalFormNumber);
      
      // 🔥 使用新的 PATCH API 端點
      const approveUrl = `${API_BASE_URL}/api/application/${encodeURIComponent(originalFormNumber)}/approve`;
      console.log('🔥 審批 API URL:', approveUrl);
      
      // 🔥 準備請求數據 - 只需要 category
      const requestData = {
        category: "leave" // 固定為請假類別
      };
      
      console.log('🔥 發送審批請求數據:', requestData);
      
      const response = await fetch(approveUrl, {
        method: 'PATCH', // 🔥 使用 PATCH 方法
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('🔥 錯誤回應解析失敗:', parseError);
          console.log('🔥 錯誤回應原始數據:', responseText);
          throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
        }
        
        throw new Error(`API請求失敗: ${errorData.Msg || response.statusText}`);
      }
      
      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🔥 JSON 解析失敗:', parseError);
        console.log('🔥 返回的原始數據:', responseText);
        throw new Error(`無法解析 API 回應: ${parseError.message}`);
      }
      
      console.log('🔥 API返回結果:', result);
      
      if (result.Status !== "Ok") {
        throw new Error(result.Msg || "審批操作失敗");
      }
      
      // 🔥 顯示詳細的成功訊息
      let successMessage = `✅ 已批准申請 ${formNumber}\n審核人: ${employeeName || employeeId}\n審核狀態: 已通過`;
      
      // 🔥 如果有出勤記錄修正結果，顯示詳細資訊
      if (result.Data) {
        const fixData = result.Data;
        successMessage += `\n\n📋 出勤記錄修正結果:`;
        
        if (fixData.updated_count !== undefined) {
          successMessage += `\n✅ 已修正 ${fixData.updated_count} 筆出勤異常記錄`;
        }
        
        if (fixData.leave_period) {
          successMessage += `\n📅 請假期間: ${fixData.leave_period.start_date} ${fixData.leave_period.start_time} ~ ${fixData.leave_period.end_date} ${fixData.leave_period.end_time}`;
        }
        
        if (fixData.event_ids && fixData.event_ids.length > 0) {
          successMessage += `\n🔢 影響的打卡事件: ${fixData.event_ids.join(', ')}`;
        }
        
        if (fixData.details && fixData.details.length > 0) {
          successMessage += `\n📝 修正詳情: ${fixData.details.join(', ')}`;
        }
      }
      
      alert(successMessage);
      
      // 重新獲取申請列表
      await fetchLeaveRequests();
      
      // 關閉詳情視圖
      setSelectedRequest(null);
      
    } catch (err) {
      console.error("🔥 審批操作失敗:", err);
      alert(`❌ 審批操作失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 處理退回操作 - 保持原有的邏輯
  const handleReject = async (formNumber) => {
    try {
      setLoading(true);
      
      if (!companyId) {
        throw new Error("無法獲取公司ID");
      }
      
      const request = requests.find(r => r.form_number === formNumber);
      const originalFormNumber = request ? request.original_form_number || formNumber : formNumber;
      
      const rejectUrl = `${API_BASE_URL}/api/applications/review`;
      console.log('退回 API URL:', rejectUrl);
      
      const requestData = {
        company_id: companyId,
        form_number: originalFormNumber,
        action: "reject",
        reviewer: employeeName || employeeId
      };
      
      console.log('發送退回請求數據:', requestData);
      
      const response = await fetch(rejectUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('錯誤回應解析失敗:', parseError);
          console.log('錯誤回應原始數據:', responseText);
          throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
        }
        
        throw new Error(`API請求失敗: ${errorData.Msg || response.statusText}`);
      }
      
      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 解析失敗:', parseError);
        console.log('返回的原始數據:', responseText);
        throw new Error(`無法解析 API 回應: ${parseError.message}`);
      }
      
      if (result.Status !== "Ok") {
        throw new Error(result.Msg || "退回操作失敗");
      }
      
      alert(`已退回申請 ${formNumber}\n審核人: ${employeeName || employeeId}\n審核狀態: 未通過`);
      
      await fetchLeaveRequests();
      setSelectedRequest(null);
      
    } catch (err) {
      console.error("拒絕操作失敗:", err);
      alert(`拒絕操作失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 處理返回首頁
  const handleGoHome = () => {
    navigate('/frontpage01');
  };

  // 初始化加載數據
  useEffect(() => {
    if (employeeId) {
      console.log('開始初始化，員工編號:', employeeId);
      fetchEmployeeInformation();
    }
  }, [employeeId, fetchEmployeeInformation]);

  // 當狀態過濾器或公司ID變更時重新獲取數據
  useEffect(() => {
    if (employeeId && companyId) {
      console.log('狀態過濾器或公司ID變更，重新獲取數據');
      fetchLeaveRequests();
    }
  }, [employeeId, companyId, statusFilter, fetchLeaveRequests]);

  // 如果選擇了特定申請，顯示詳細資訊
  if (selectedRequest) {
    return (
      <RequestDetail
        type="leave"
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        currentTime={currentTime}
        handleHomeClick={handleHomeClick || handleGoHome}
        onApprove={handleApprove}
        onReject={handleReject}
        styles={styles}
        employeeNames={employeeNames}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.appWrapper}>
        <Header 
          title="請假審核" 
          currentTime={currentTime} 
          handleHomeClick={handleHomeClick || handleGoHome} 
          styles={styles}
        />
        
        <BackToSystemLink 
          handleBackToAuditSystem={handleBackToAuditSystem}
          styles={styles}
        />
        
        <StatusTabContainer
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilterChange}
          styles={styles}
        />
        
        <div className={styles.contentContainer}>
          {loading ? (
            <LoadingIndicator styles={styles} />
          ) : error ? (
            <div></div>
          ) : requests.length === 0 ? (
            <div></div>
          ) : (
            requests.map((request) => (
              <div
                key={request.form_number}
                className={styles.requestCard}
                onClick={() => setSelectedRequest(request)}
              >
                <div className={styles.requestHeader}>
                  <div>{request.form_number}</div>
                  <div>送出時間：{formatDate(request.application_date)} {formatTime(request.application_time)}</div>
                </div>

                <div className={styles.requestContent}>
                  <div className={styles.userAvatar}>
                    <img 
                      src={portraitIcon} 
                      alt="頭像" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                    />
                  </div>
                  <div className={styles.requestDetails}>
                    <div className={styles.userName} style={{ display: 'flex', alignItems: 'center' }}>
                      {request.name || employeeNames[request.employee_id] || request.employee_id}
                      <span style={{ 
                        marginLeft: '8px',
                        fontSize: '12px',
                        padding: '1px 8px',
                        backgroundColor: 'white',
                        color: '#3A6CA6',
                        border: '1px solid #3A6CA6',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}>
                        {getLeaveTypeName(request.type)}
                      </span>
                    </div>
                    <div className={styles.requestInfo}>請假日期：{request.start_date}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 請假功能內容組件
const LeaveContent = ({ 
  activeTab, 
  handleTabClick, 
  handleNewLeaveRequest, 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick,
  handleQueryRequests,
  handleApprovalAction
}) => {
  return <LeaveAudit 
    handleBackToAuditSystem={handleBackToAuditSystem}
    currentTime={currentTime}
    handleHomeClick={handleHomeClick}
  />;
};

export default LeaveAudit;
export { LeaveContent, Header, BackToSystemLink, StatusTabContainer, RequestDetail };
