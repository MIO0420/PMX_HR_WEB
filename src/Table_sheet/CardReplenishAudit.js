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

// 格式化表單編號函數 - 使用 R 作為前綴 (Replenish)
const formatFormNumber = (formNumber) => {
  if (!formNumber) return formNumber;
  
  // 如果已經是簡短格式，直接返回
  if (!formNumber.startsWith('FORM-')) return formNumber;
  
  // 分割表單編號
  const parts = formNumber.split('-');
  if (parts.length >= 2 && parts[1].length >= 14) {
    // 取出年份後兩位數字和其餘部分
    const yearLastTwoDigits = parts[1].substring(2, 4);
    const restOfTimestamp = parts[1].substring(4);
    // 將 'FORM-' 替換為 'R'，並只使用年份後兩位數字
    return 'R' + yearLastTwoDigits + restOfTimestamp;
  }
  
  return formNumber;
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
    const month = parts[1].padStart(2, '0'); // 如果月份只有一位數，前面補0
    const day = parts[2].padStart(2, '0');   // 如果日期只有一位數，前面補0
    
    // 重新組合日期
    formattedDate = `${year}-${month}-${day}`;
  }
  
  return formattedDate;
};

// 格式化時間，只顯示到分鐘
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // 只取前5個字符，即 HH:MM
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
    return employeeId; // 如果獲取失敗，返回員工編號作為備用
  }
};

// 自定義 Header 組件 - 使用引入的首頁圖標
const Header = ({ title, currentTime, handleHomeClick, styles }) => (
  <div className={styles.header}>
    <div className={styles.homeIcon} onClick={handleHomeClick}>
      <img src={homeIcon} alt="首頁" style={{ width: '20px', height: '20px' }} />
    </div>
    <div className={styles.pageTitle}>{title}</div>
    <div className={styles.timeDisplay}>{currentTime}</div>
  </div>
);

// 自定義返回系統連結組件 - 使用引入的返回圖標
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

// 自定義補卡請求詳情組件 - 修改為與加班申請詳情相似的樣式
const CardReplenishRequestDetail = ({ 
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
        bgColor: "#4caf50",  // 綠色背景
        color: "#ffffff"     // 白色文字
      };
    } else if (request.status === "no") {
      return { 
        text: "未通過", 
        bgColor: "#f44336",  // 紅色背景
        color: "#ffffff"     // 白色文字
      };
    } else {
      return { 
        text: "簽核中", 
        bgColor: "#9e9e9e",  // 灰色背景，與上傳圖片一致
        color: "#ffffff"     // 白色文字
      };
    }
  };

  // 從illustrate中提取補卡事由
  const getCardReplenishReason = () => {
    if (!request.illustrate) return "";
    
    // 檢查是否包含這四種事由之一
    const reasons = ["出差", "忘記打卡", "忙私人的事", "其他"];
    for (const reason of reasons) {
      if (request.illustrate.includes(reason)) {
        return reason;
      }
    }
    return "";
  };

  // 獲取去除事由後的申請說明
  const getFilteredIllustrate = () => {
    if (!request.illustrate) return "";
    
    const reason = getCardReplenishReason();
    if (!reason) return request.illustrate;
    
    // 移除事由，返回剩餘內容
    return request.illustrate.replace(reason, "").trim();
  };

  const statusDisplay = getStatusDisplay();
  const cardReplenishReason = getCardReplenishReason();
  const filteredIllustrate = getFilteredIllustrate();
  
  return (
    <div className={styles.container}>
      <div className={styles.appWrapper}>
        {/* 使用與主頁面相同的頂部導航欄樣式 */}
        <div className={styles.header}>
          <div className={styles.homeIcon} onClick={handleHomeClick}>
            <img src={homeIcon} alt="首頁" style={{ width: '20px', height: '20px' }} />
          </div>
          <div className={styles.pageTitle}>補卡申請單</div>
          <div className={styles.timeDisplay}>{currentTime}</div>
        </div>
        
        {/* 返回連結 */}
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
        
        {/* 申請單內容 - 簡化版本，只顯示必要資訊 */}
        <div className={styles.contentContainer}>
          <div style={{ 
            padding: '0 20px',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}>
            {/* 申請單資訊 - 冒號後直接接內容 */}
            <div style={{ padding: '10px 0' }}>
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>送出時間：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>{formatDate(request.application_date)} {formatTime(request.application_time)}</span>
              </div>
              
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>單號：</span>
                <span style={{ 
                  color: '#3A6CA6', // 藍色，與上方橫幅顏色相同
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
                  padding: '4px 10px', // 增加內邊距使其更寬更高
                  backgroundColor: statusDisplay.bgColor,
                  borderRadius: '8px', // 增加圓角半徑
                  color: statusDisplay.color, 
                  fontSize: '14px',
                  marginLeft: '4px',
                  display: 'inline-block', // 確保元素正確顯示
                  textAlign: 'center', // 文字居中
                  minWidth: '60px' // 設置最小寬度
                }}>
                  {statusDisplay.text}
                </span>
              </div>
              
              {/* 添加補卡類型顯示 */}
              {request.type && (
                <div style={{ margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>補卡類型：</span>
                  <span style={{ color: '#333', fontSize: '14px' }}>{request.type}</span>
                </div>
              )}
              
              {/* 添加補卡事由顯示 */}
              {cardReplenishReason && (
                <div style={{ margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>補卡事由：</span>
                  <span style={{ color: '#333', fontSize: '14px' }}>{cardReplenishReason}</span>
                </div>
              )}
              
              <div style={{ margin: '10px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>補卡時間：</span>
                <span style={{ color: '#333', fontSize: '14px' }}>{request.start_date} {formatTime(request.start_time)}</span>
              </div>
              
              {/* 只顯示過濾後的申請說明 */}
              {filteredIllustrate && (
                <div style={{ margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>申請說明：</span>
                  <span style={{ color: '#333', fontSize: '14px' }}>{filteredIllustrate}</span>
                </div>
              )}
              
              {/* 只在狀態不是「簽核中」時顯示核准人 */}
              {request.status !== "pending" && (
                <div style={{ margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>核准人：</span>
                  <span style={{ color: '#333', fontSize: '14px' }}>{request.reviewer || "-"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 底部操作按鈕 - 只在簽核中狀態顯示 */}
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

// 補卡審核組件
const CardReplenishAudit = ({ 
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
  const [employeeNames, setEmployeeNames] = useState({}); // 用於存儲員工編號對應的姓名

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

  // 獲取補卡申請表單數據 - 使用直接API調用方式
  const fetchCardReplenishRequests = useCallback(async () => {
    if (!employeeId || !companyId) return;
    
    try {
      setLoading(true);
      
      // 設置API查詢條件 - 根據UI狀態映射到API狀態
      const criteria = {
        company_id: companyId,
        category: "replenish", // 補卡申請類型
        status: statusFilter === "簽核中" ? "pending" : 
                statusFilter === "已通過" ? "ok" : 
                statusFilter === "未通過" ? "no" : undefined
      };
      
      console.log('發送請求條件:', criteria);
      
      // 構建完整的 API URL
      const apiUrl = `${API_BASE_URL}/api/applications/filter?company_id=${criteria.company_id}&category=${criteria.category}${criteria.status ? `&status=${criteria.status}` : ''}`;
      console.log('API 請求 URL:', apiUrl);
      
      // 呼叫API
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
        // 嘗試解析 JSON
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON 解析失敗:', parseError);
        console.log('返回的原始數據:', responseText);
        throw new Error(`無法解析 API 回應: ${parseError.message}`);
      }
      
      console.log('API返回結果:', result);
      
      if (result.Status !== "Ok") {
        throw new Error(result.Msg || "獲取補卡申請失敗");
      }
      
      // 檢查是否有數據
      if (!result.Data || result.Data.length === 0) {
        setRequests([]);
        return;
      }
      
// 處理獲取的數據
const formattedRequests = result.Data.map(item => ({
  form_id: item.form_id,
  form_number: formatFormNumber(item.form_number), // 使用格式化函數處理表單編號
  original_form_number: item.form_number, // 保留原始表單編號
  employee_id: item.employee_id,
  name: item.employee_name || "",
  department: item.department,
  position: item.position,
  job_grade: item.job_grade,
  application_date: new Date(item.application_date).toLocaleDateString('zh-TW'),
  application_time: item.application_time || "", // 添加時間字段，與請假部分一致
  start_date: item.primary_date,
  start_time: item.start_time,
  type: item.type || "", // 確保獲取補卡類型
  illustrate: item.illustrate,
  status: item.status,
  reviewer: item.reviewer,
  hrreviewer: item.hrreviewer,
  hrstatus: item.hrstatus,
  company_id: item.company_id
}));

      
      console.log('格式化後的補卡申請數據:', formattedRequests);
      
      // 獲取所有員工的姓名
      const employeeIds = formattedRequests.map(req => req.employee_id);
      const uniqueEmployeeIds = [...new Set(employeeIds)];
      
      const namesMap = {};
      for (const id of uniqueEmployeeIds) {
        if (!id) continue;
        const name = await fetchEmployeeName(companyId, id);
        namesMap[id] = name;
      }
      
      setEmployeeNames(namesMap);
      setRequests(formattedRequests);
      setError(null);
      
    } catch (err) {
      console.error("獲取補卡申請失敗:", err);
      setError(`獲取數據失敗: ${err.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, companyId, statusFilter]);

// 處理審批操作 - 修改為使用新的 PATCH API
const handleApprove = async (formNumber) => {
  try {
    setLoading(true);
    
    if (!companyId) {
      throw new Error("無法獲取公司ID");
    }
    
    // 找到對應請求，使用原始表單編號
    const request = requests.find(r => r.form_number === formNumber);
    const originalFormNumber = request ? request.original_form_number || formNumber : formNumber;
    
    // 🔥 使用新的 PATCH API 進行審批和修正出勤記錄
    const approveUrl = `${API_BASE_URL}/api/application/${originalFormNumber}/approve`;
    console.log('審批 API URL:', approveUrl);
    
    const requestData = {
      category: "replenish" // 補卡申請類別
    };
    
    console.log('發送審批請求數據:', requestData);
    
    const response = await fetch(approveUrl, {
      method: 'PATCH',
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
      throw new Error(`無法解析 API 回應: ${parseError.message}`);
    }
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "審批操作失敗");
    }
    
    console.log('✅ 審批和出勤修正操作成功:', result);
    
    // 🎯 顯示成功訊息，包含修正信息
    let successMessage = `✅ 已批准補卡申請 ${formNumber}\n`;
    successMessage += `審核人: ${employeeName || employeeId}\n`;
    successMessage += `審核狀態: 已通過\n`;
    
    // 如果有修正出勤記錄的信息
    if (result.Data) {
      if (result.Data.updated_count !== undefined) {
        successMessage += `📊 修正記錄數: ${result.Data.updated_count} 筆\n`;
      }
      if (result.Data.event_ids && result.Data.event_ids.length > 0) {
        successMessage += `🔧 修正事件ID: ${result.Data.event_ids.join(', ')}\n`;
      }
    }
    
    successMessage += `🎯 修正狀態: 異常 → 準時 (on_time)`;
    
    alert(successMessage);
    
    // 重新獲取申請列表
    await fetchCardReplenishRequests();
    
    // 關閉詳情視圖
    setSelectedRequest(null);
    
  } catch (err) {
    console.error("審批操作失敗:", err);
    alert(`審批操作失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};


// 處理退回操作 - 使用原有的 API（因為退回不需要修正出勤記錄）
const handleReject = async (formNumber) => {
  try {
    setLoading(true);
    
    if (!companyId) {
      throw new Error("無法獲取公司ID");
    }
    
    // 找到對應請求，使用原始表單編號
    const request = requests.find(r => r.form_number === formNumber);
    const originalFormNumber = request ? request.original_form_number || formNumber : formNumber;
    
    // 使用原有的退回 API
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
      throw new Error(`無法解析 API 回應: ${parseError.message}`);
    }
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "退回操作失敗");
    }
    
    alert(`已退回補卡申請 ${formNumber}\n審核人: ${employeeName || employeeId}\n審核狀態: 未通過`);
    
    // 重新獲取申請列表
    await fetchCardReplenishRequests();
    
    // 關閉詳情視圖
    setSelectedRequest(null);
    
  } catch (err) {
    console.error("退回操作失敗:", err);
    alert(`退回操作失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};


  // 處理返回首頁 - 簡化版本，直接使用 React Router
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
      fetchCardReplenishRequests();
    }
  }, [employeeId, companyId, statusFilter, fetchCardReplenishRequests]);

  // 如果選擇了特定申請，顯示詳細資訊
  if (selectedRequest) {
    return (
      <CardReplenishRequestDetail
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        currentTime={currentTime}
        handleHomeClick={handleHomeClick || handleGoHome}
        onApprove={handleApprove}
        onReject={handleReject}
        styles={styles}
        employeeNames={employeeNames} // 傳遞員工姓名對照表
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.appWrapper}>
        <Header 
          title="簽核補卡單" 
          currentTime={currentTime} 
          handleHomeClick={handleHomeClick || handleGoHome} 
          styles={styles}
        />
        
        {/* 返回簽核系統按鈕 */}
        <BackToSystemLink 
          handleBackToAuditSystem={handleBackToAuditSystem}
          styles={styles}
        />
        
        {/* 狀態過濾標籤 */}
        <StatusTabContainer
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilterChange}
          styles={styles}
        />
        
        <div className={styles.contentContainer}>
          {loading ? (
            <LoadingIndicator styles={styles} />
          ) : error ? (
            <ErrorMessage message={error} styles={styles} />
          ) : requests.length === 0 ? (
            <div></div> // 空白的 div，不顯示任何提示訊息
          ) : (
            requests.map((request) => (
              <div
                key={request.form_number}
                className={styles.requestCard}
                onClick={() => setSelectedRequest(request)}
              >
                <div className={styles.requestHeader}>
                  <div style={{ color: '#3a75c4' }}>{request.form_number}</div>
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
  <div className={styles.userName}>
    {request.name || employeeNames[request.employee_id] || request.employee_id}
  </div>
  <div className={styles.requestInfo}>補卡時間：{request.start_date} {formatTime(request.start_time)}</div>
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

// 補卡功能內容組件 - 使用與 CardReplenishAudit 相同的邏輯但可以接受不同的 props
export const CardReplenishContent = ({ 
  activeTab, 
  handleTabClick, 
  handleNewCardReplenishRequest, 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick,
  handleQueryRequests,
  handleApprovalAction
}) => {
  // 這裡使用與 CardReplenishAudit 相同的邏輯，但可以接受不同的 props
  return <CardReplenishAudit 
    handleBackToAuditSystem={handleBackToAuditSystem}
    currentTime={currentTime}
    handleHomeClick={handleHomeClick}
  />;
};

export default CardReplenishAudit;
export { Header, BackToSystemLink, StatusTabContainer };
