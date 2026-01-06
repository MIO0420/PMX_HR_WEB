import React, { useState, useEffect, useCallback } from "react";
import { useEmployee } from '../contexts/EmployeeContext';

// API相關設定
const API_KEY = "AIzaSyCw_go3b8DH1jfTmPCdKTesVW-b6vw9DkM";
const MASTER_SHEET_ID = "1ziiWMZ_tSMO1-0PttLLymdtroT5UeLxW0rZwmr_NQZo"; // 總表 ID
const MASTER_RANGE = "總表"; // 總表範圍

// 共用樣式
const commonStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f7fa",
    overflow: "hidden",
  },
  appWrapper: {
    width: "360px",
    height: "100%",
    backgroundColor: "white",
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3a75b5",
    color: "white",
    padding: "0 16px",
    height: "50px",
  },
  homeIcon: {
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  timeDisplay: {
    fontSize: "16px",
    color: "#FFFFFF",
  },
  pageTitle: {
    fontSize: "16px",
    fontWeight: "normal",
    color: "#FFFFFF",
  },
  tabContainer: {
    display: "flex",
    width: "342px",
    height: "36px",
    marginBottom: "15px",
    gap: "2px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px",
  },
  tab: (isActive) => ({
    flex: 1,
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isActive ? "#3a75b5" : "#FFFFFF",
    color: isActive ? "#FFFFFF" : "#000000",
    fontWeight: "400",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid #e0e0e0",
    borderRadius: "0px",
  }),
  firstTab: (isActive) => ({
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
  }),
  lastTab: (isActive) => ({
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  }),
  statusTabContainer: {
    display: "flex",
    width: "342px",
    height: "36px",
    marginBottom: "15px",
    gap: "2px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px",
  },
  contentContainer: {
    flexGrow: 1,
    padding: "10px",
    overflowY: "auto",
  },
  requestCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  requestHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  status: (status) => ({
    color: status === "已通過" ? "green" : status === "未通過" ? "red" : "#FF9800",
    fontWeight: "bold",
  }),
  backLink: {
    fontSize: "14px",
    color: "#666",
    padding: "8px 16px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  backToSystemLink: {
    fontSize: "14px",
    color: "#666",
    padding: "8px 16px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "#f5f7fa",
    borderBottom: "1px solid #e0e0e0",
  },
  detailContainer: {
    padding: "15px",
    height: "calc(100% - 180px)", // 調整高度以適應底部按鈕
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    overflowY: "auto",
  },
  detailHeader: {
    padding: "5px 0 10px 0",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "14px",
    color: "#666",
  },
  detailRow: {
    display: "flex",
    padding: "8px 0",
    borderBottom: "1px solid #f5f5f5",
    fontSize: "14px",
  },
  detailLabel: {
    width: "80px",
    fontSize: "14px",
    color: "#666",
  },
  detailValue: {
    flex: 1,
    fontSize: "14px",
    color: "#333",
  },
  attachmentSection: {
    padding: "10px 0",
    borderBottom: "1px solid #f5f5f5",
  },
  attachmentLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px",
  },
  attachmentBox: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "80px",
  },
  attachmentName: {
    color: "#3a75b5",
    fontSize: "14px",
  },
  actionContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTop: "1px solid #e0e0e0",
    maxWidth: "360px",
    margin: "0 auto",
    gap: "10px",
  },
  rejectButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  approveButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#3a75b5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    fontSize: "14px",
    color: "#666",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    padding: "20px",
    fontSize: "14px",
  },
  noDataMessage: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
    fontSize: "14px",
  },
  companyInfo: {
    padding: "5px 10px",
    backgroundColor: "#f0f8ff",
    fontSize: "12px",
    color: "#666",
    textAlign: "center",
    borderBottom: "1px solid #eee",
  }
};

// 通用的頁頭組件
const Header = ({ title, currentTime, handleHomeClick }) => (
  <header style={commonStyles.header}>
    <div style={commonStyles.homeIcon} onClick={handleHomeClick}>
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
    <div style={commonStyles.pageTitle}>{title}</div>
    <div style={commonStyles.timeDisplay}>{currentTime}</div>
  </header>
);

// 新增返回簽核系統組件
const BackToSystemLink = ({ handleBackToAuditSystem }) => (
  <div style={commonStyles.backToSystemLink} onClick={handleBackToAuditSystem}>
    ← 返回簽核系統
  </div>
);

// 通用的標籤組件
const TabContainer = ({ activeTab, tabs, handleTabClick }) => (
  <div style={commonStyles.tabContainer}>
    {tabs.map((tab, index) => (
      <div
        key={tab}
        style={{
          ...commonStyles.tab(activeTab === tab),
          ...(index === 0 ? commonStyles.firstTab(activeTab === tab) : {}),
          ...(index === tabs.length - 1 ? commonStyles.lastTab(activeTab === tab) : {})
        }}
        onClick={() => handleTabClick(tab)}
      >
        {tab}
      </div>
    ))}
  </div>
);

// 狀態過濾標籤組件 - 已修改，移除「總覽」選項
const StatusTabContainer = ({ statusFilter, handleStatusFilterChange }) => (
  <div style={commonStyles.statusTabContainer}>
    {["簽核中", "已通過", "未通過"].map((status, index) => (
      <div
        key={status}
        style={{
          ...commonStyles.tab(statusFilter === status),
          ...(index === 0 ? commonStyles.firstTab(statusFilter === status) : {}),
          ...(index === 2 ? commonStyles.lastTab(statusFilter === status) : {})
        }}
        onClick={() => handleStatusFilterChange(status)}
      >
        {status}
      </div>
    ))}
  </div>
);

// 詳細內容顯示組件
const RequestDetail = ({ 
  type, 
  request, 
  onBack, 
  currentTime, 
  handleHomeClick,
  onApprove,
  onReject,
  handleBackToAuditSystem
}) => {
  let title = "申請詳情";
  if (type === "overtime") title = "加班申請詳情";
  if (type === "replenish") title = "補卡申請詳情";
  if (type === "leave") title = "請假申請詳情";

  // 根據 status、reviewer_status 或 hr_status 欄位顯示狀態
  const displayStatus = () => {
    // 從 request 中獲取當前用戶的職級
    const userJobGrade = request.currentUserJobGrade;
    
    if (userJobGrade === 'hr') {
      // HR 角色的狀態顯示邏輯保持不變
      if (request.status === "已通過" || request.hr_status === "ok") return "已通過";
      if (request.status === "未通過" || request.hr_status === "no") return "未通過";
      if (request.reviewer_status === "ok" && request.status === "審核中") return "簽核中";
      return "簽核中";
    } else if (userJobGrade === 'leader' || userJobGrade === 'manager') {
      // leader 或 manager 角色的狀態顯示邏輯
      if (request.status === "已通過") return "已通過";
      if (request.status === "未通過") return "未通過";
      // 關鍵修改：當 leader 已審核通過的項目，顯示為「已通過」
      if (request.reviewer_status === "ok" && request.status === "審核中") return "已通過";
      return "簽核中";
    } else {
      // 其他角色的狀態顯示邏輯
      if (request.status === "已通過" || request.hr_status === "ok") return "已通過";
      if (request.status === "未通過" || request.hr_status === "no") return "未通過";
      if (request.reviewer_status === "ok" && request.status === "審核中") return "簽核中";
      return "簽核中";
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Header title={title} currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 新增返回簽核系統按鈕 */}
      <BackToSystemLink handleBackToAuditSystem={handleBackToAuditSystem} />
      
      <div style={commonStyles.backLink} onClick={onBack}>
        ← 返回
      </div>
      
      <div style={commonStyles.detailContainer}>
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>申請單號:</div>
          <div style={commonStyles.detailValue}>{request.form_number}</div>
        </div>
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>狀態:</div>
          <div style={{
            ...commonStyles.detailValue, 
            color: displayStatus() === "已通過" ? "green" : 
                 displayStatus() === "未通過" ? "red" : "#FF9800",
            fontWeight: "bold"
          }}>
            {displayStatus()}
          </div>
        </div>
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>申請日期:</div>
          <div style={commonStyles.detailValue}>{request.application_date}</div>
        </div>
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>員工ID:</div>
          <div style={commonStyles.detailValue}>{request.employee_id}</div>
        </div>
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>部門:</div>
          <div style={commonStyles.detailValue}>{request.department}</div>
        </div>
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>職位:</div>
          <div style={commonStyles.detailValue}>{request.position}</div>
        </div>
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>職級:</div>
          <div style={commonStyles.detailValue}>{request.job_grade}</div>
        </div>
        
        {/* 根據不同申請類型顯示不同欄位 */}
        {type === "overtime" && (
          <>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>開始時間:</div>
              <div style={commonStyles.detailValue}>{`${request.start_date} ${request.start_time}`}</div>
            </div>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>結束時間:</div>
              <div style={commonStyles.detailValue}>{`${request.end_date} ${request.end_time}`}</div>
            </div>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>總時數:</div>
              <div style={commonStyles.detailValue}>{`${request.total_calculation_hours}小時`}</div>
            </div>
          </>
        )}
        
        {type === "replenish" && (
          <>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>補卡日期:</div>
              <div style={commonStyles.detailValue}>{request.start_date}</div>
            </div>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>補卡時間:</div>
              <div style={commonStyles.detailValue}>{request.start_time}</div>
            </div>
          </>
        )}
        
        {type === "leave" && (
          <>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>假別:</div>
              <div style={commonStyles.detailValue}>{request.type}</div>
            </div>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>開始時間:</div>
              <div style={commonStyles.detailValue}>{`${request.start_date} ${request.start_time}`}</div>
            </div>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>結束時間:</div>
              <div style={commonStyles.detailValue}>{`${request.end_date} ${request.end_time}`}</div>
            </div>
            <div style={commonStyles.detailRow}>
              <div style={commonStyles.detailLabel}>總時數:</div>
              <div style={commonStyles.detailValue}>{`${request.total_calculation_hours}小時`}</div>
            </div>
          </>
        )}
        
        <div style={commonStyles.detailRow}>
          <div style={commonStyles.detailLabel}>說明:</div>
          <div style={commonStyles.detailValue}>{request.illustrate}</div>
        </div>
        
        {request.reviewer_name && (
          <div style={commonStyles.detailRow}>
            <div style={commonStyles.detailLabel}>審核人:</div>
            <div style={commonStyles.detailValue}>{request.reviewer_name} ({request.reviewer_job_grade})</div>
          </div>
        )}
        
        {request.reviewer_status && (
          <div style={commonStyles.detailRow}>
            <div style={commonStyles.detailLabel}>審核狀態:</div>
            <div style={{
              ...commonStyles.detailValue,
              color: request.reviewer_status === "ok" ? "green" : 
                    request.reviewer_status === "no" ? "red" : "#FF9800",
              fontWeight: "bold"
            }}>
              {request.reviewer_status === "ok" ? "已通過" : 
               request.reviewer_status === "no" ? "未通過" : "簽核中"}
            </div>
          </div>
        )}
        
        {request.hr_name && (
          <div style={commonStyles.detailRow}>
            <div style={commonStyles.detailLabel}>HR審核:</div>
            <div style={commonStyles.detailValue}>{request.hr_name}</div>
          </div>
        )}
        
        {request.hr_status && (
          <div style={commonStyles.detailRow}>
            <div style={commonStyles.detailLabel}>HR狀態:</div>
            <div style={{
              ...commonStyles.detailValue,
              color: request.hr_status === "ok" ? "green" : 
                    request.hr_status === "no" ? "red" : "#FF9800",
              fontWeight: "bold"
            }}>
              {request.hr_status === "ok" ? "已通過" : 
               request.hr_status === "no" ? "未通過" : "簽核中"}
            </div>
          </div>
        )}
      </div>
      
      {/* 無論申請狀態如何，都顯示按鈕 */}
      <div style={commonStyles.actionContainer}>
        <button 
          style={commonStyles.rejectButton} 
          onClick={() => onReject(request.form_number)}
        >
          退回申請
        </button>
        <button 
          style={commonStyles.approveButton} 
          onClick={() => onApprove(request.form_number)}
        >
          批准簽名
        </button>
      </div>
    </div>
  );
};

// 共用的資料查詢函數 - 修改以支援 HR 角色
export const fetchRequestData = async (
  requestType, // 'workovertime', 'replenish', 'leave'
  companyId,
  employeeId,
  department,
  contextDepartment,
  currentUserJobGrade,
  setLoading,
  setError,
  setRequests,
  statusFilter // 狀態過濾參數
) => {
  if (!companyId) {
    setError("未設定公司ID");
    setLoading(false);
    return;
  }

  const currentDepartment = department || contextDepartment;
  if (!currentDepartment) {
    setError("未設定部門");
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    
    // 先從總表查詢表單ID
    const masterUrl = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/${encodeURIComponent(MASTER_RANGE)}?key=${API_KEY}`;
    
    const masterResponse = await fetch(masterUrl);
    if (!masterResponse.ok) {
      throw new Error(`總表 API 請求失敗: ${masterResponse.status}`);
    }
    
    const masterData = await masterResponse.json();
    
    if (!masterData.values || masterData.values.length <= 1) {
      throw new Error("總表中找不到數據");
    }
    
    // 假設總表第一行是標題行，從第二行開始查找
    // A欄位是company_id，B欄位是表單id
    const companyRow = masterData.values.find(row => 
      row[0]?.toLowerCase() === companyId.toLowerCase()
    );
    
    if (!companyRow || !companyRow[1]) {
      throw new Error(`找不到公司ID ${companyId} 對應的表單ID`);
    }
    
    // 獲取表單ID (B欄位)
    const sheetId = companyRow[1];
    console.log(`從總表查詢到 ${companyId} 對應的表單ID: ${sheetId}`);
    
    // 構建 Google Sheets API URL 查詢申請表單
    const sheetName = "申請表單"; // 所有表單都用相同的工作表名稱
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`申請表單 API 請求失敗: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.values || data.values.length <= 1) {
      setRequests([]);
      setLoading(false);
      return;
    }
    
    // 假設第一行是標題行
    const headers = data.values[0];
    
    // 將資料轉換為物件陣列
    const formattedData = data.values.slice(1).map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });
      // 添加當前用戶職級到每個請求對象中
      item.currentUserJobGrade = currentUserJobGrade;
      return item;
    });
    
    let filteredRequests = [];
    
    // 根據當前用戶職級篩選申請表單
    if (currentUserJobGrade === 'hr') {
      // HR 特殊處理：只顯示已經過主管審核的申請（有 reviewer_name, reviewer_job_grade, reviewer_status）
      // 且 status="審核中" 的申請表單
      filteredRequests = formattedData.filter(item => 
        item.company_id === companyId && 
        item.action === requestType &&
        item.reviewer_name && 
        item.reviewer_job_grade && 
        item.reviewer_status === "ok" &&
        (item.status === "審核中" || item.status === "已通過" || item.status === "未通過" || item.hr_status === "ok" || item.hr_status === "no")
      );
      console.log("HR 角色篩選到的申請表單數量:", filteredRequests.length);
    } else if (currentUserJobGrade === 'leader' || currentUserJobGrade === 'manager') {
      // leader 或 manager 只能看到自己部門的 job_grade 為 staff 的申請
      filteredRequests = formattedData.filter(item => 
        item.company_id === companyId && 
        item.department === currentDepartment && 
        item.job_grade === 'staff' &&
        item.action === requestType
      );
    } else {
      // staff 只能看到自己的申請
      filteredRequests = formattedData.filter(item => 
        item.company_id === companyId && 
        item.department === currentDepartment && 
        item.employee_id === employeeId &&
        item.action === requestType
      );
    }
    
    // 根據狀態過濾 - 修改此部分以考慮 reviewer_status 和 hr_status
    if (statusFilter === "簽核中") {
      if (currentUserJobGrade === 'hr') {
        // HR 的簽核中定義：已經過主管審核，等待 HR 審核
        filteredRequests = filteredRequests.filter(item => 
          item.reviewer_status === "ok" && 
          item.status === "審核中" && 
          !item.hr_status
        );
      } else {
        // 一般主管的簽核中定義 - 只顯示待審核的項目
        filteredRequests = filteredRequests.filter(item => 
          item.status === "待審核"
        );
      }
    } else if (statusFilter === "已通過") {
      if (currentUserJobGrade === 'hr') {
        // HR 的已通過定義保持不變
        filteredRequests = filteredRequests.filter(item => 
          item.hr_status === "ok" || item.status === "已通過"
        );
      } else {
        // 一般主管的已通過定義 - 包含審核中的項目
        filteredRequests = filteredRequests.filter(item => 
          item.status === "審核中" || item.status === "已通過"
        );
      }
    } else if (statusFilter === "未通過") {
      filteredRequests = filteredRequests.filter(item => 
        item.hr_status === "no" || item.status === "未通過"
      );
    }
    
    // 設置狀態
    setRequests(filteredRequests);
    setError(null);
  } catch (err) {
    console.error(`獲取${requestType}申請表單失敗:`, err);
    setError(`獲取數據失敗: ${err.message}`);
    setRequests([]);
  } finally {
    setLoading(false);
  }
};

// 共用的審批函數 - 修改以支援 HR 角色
export const handleRequestAction = async (
  action, // 'approve' or 'reject'
  requestType, // 'workovertime', 'replenish', 'leave'
  formNumber,
  companyId,
  currentUserName,
  currentUserJobGrade,
  fetchRequests,
  setLoading,
  setSelectedRequest
) => {
  try {
    setLoading(true);
    
    // 先從總表查詢表單ID
    const masterUrl = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/${encodeURIComponent(MASTER_RANGE)}?key=${API_KEY}`;
    
    const masterResponse = await fetch(masterUrl);
    if (!masterResponse.ok) {
      throw new Error(`總表 API 請求失敗: ${masterResponse.status}`);
    }
    
    const masterData = await masterResponse.json();
    
    if (!masterData.values || masterData.values.length <= 1) {
      throw new Error("總表中找不到數據");
    }
    
    // 假設總表第一行是標題行，從第二行開始查找
    // A欄位是company_id，B欄位是表單id
    const companyRow = masterData.values.find(row => 
      row[0]?.toLowerCase() === companyId.toLowerCase()
    );
    
    if (!companyRow) {
      throw new Error(`找不到公司ID ${companyId} 對應的表單ID`);
    }
    
    // 確保有審核人姓名和職級
    if (!currentUserName || !currentUserJobGrade) {
      throw new Error("無法獲取審核人資訊，請重新登入");
    }
    
    // 設定審核狀態
    const reviewStatus = action === 'approve' ? "ok" : "no";
    
    // 構建要發送的數據
    let payload = {
      company_id: companyId,
      form_number: formNumber
    };
    
    // 根據審核人角色設定不同的欄位
    if (currentUserJobGrade === 'hr') {
      // HR 審核
      payload = {
        ...payload,
        hr_name: currentUserName,
        hr_status: reviewStatus,
        // HR 審核時，直接更新最終狀態
        status: action === 'approve' ? "已通過" : "未通過"
      };
    } else {
      // 主管審核
      payload = {
        ...payload,
        reviewer_name: currentUserName,
        reviewer_job_grade: currentUserJobGrade,
        reviewer_status: reviewStatus,
        // 主管審核通過後，狀態為"審核中"，等待 HR 審核
        status: reviewStatus === "ok" ? "審核中" : "未通過"
      };
    }
    
    console.log(`正在${action === 'approve' ? '批准' : '退回'}${requestType}申請: ${formNumber}`);
    console.log("處理數據:", payload);
    
    // 新增：實際發送請求到後端 API
    const response = await fetch('https://rabbit.54ucl.com:3002/api/approve-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 請求失敗: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log("審批結果:", result);
    
    // 根據角色顯示不同的提示訊息
    if (currentUserJobGrade === 'hr') {
      alert(`HR 已${action === 'approve' ? '批准' : '退回'}${requestType}申請 ${formNumber}
HR: ${currentUserName}
審核狀態: ${action === 'approve' ? "已通過" : "未通過"}`);
    } else {
      alert(`已${action === 'approve' ? '批准' : '退回'}${requestType}申請 ${formNumber}
審核人: ${currentUserName}
職級: ${currentUserJobGrade}
審核狀態: ${reviewStatus === "ok" ? "審核中" : "未通過"}`);
    }
    
    // 重新獲取數據以更新列表
    await fetchRequests();
    
    // 返回列表
    setSelectedRequest(null);
  } catch (err) {
    console.error(`${action === 'approve' ? '批准' : '退回'}申請失敗:`, err);
    alert(`${action === 'approve' ? '批准' : '退回'}申請失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

// 加班功能內容組件
export const OvertimeContent = ({ 
  activeTab, 
  handleTabClick, 
  handleNewOvertimeRequest, 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick,
  companyId,
  employeeId,
  handleQueryRequests, // 從 AuditSystem 傳入的共用查詢函數
  handleApprovalAction // 從 AuditSystem 傳入的共用審批函數
}) => {
  const { department: contextDepartment, position } = useEmployee();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [department, setDepartment] = useState(contextDepartment || '');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserJobGrade, setCurrentUserJobGrade] = useState('');
  const [statusFilter, setStatusFilter] = useState("簽核中"); // 預設狀態過濾為「簽核中」

  // 獲取員工基本資料
  const fetchEmployeeData = useCallback(async () => {
    if (!companyId || !employeeId) {
      setError("未設定公司ID或員工ID");
      setLoading(false);
      return;
    }

    try {
      // 先從總表查詢表單ID
      const masterUrl = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/${encodeURIComponent(MASTER_RANGE)}?key=${API_KEY}`;
      
      const masterResponse = await fetch(masterUrl);
      if (!masterResponse.ok) {
        throw new Error(`總表 API 請求失敗: ${masterResponse.status}`);
      }
      
      const masterData = await masterResponse.json();
      
      if (!masterData.values || masterData.values.length <= 1) {
        throw new Error("總表中找不到數據");
      }
      
      // 假設總表第一行是標題行，從第二行開始查找
      // A欄位是company_id，B欄位是表單id
      const companyRow = masterData.values.find(row => 
        row[0]?.toLowerCase() === companyId.toLowerCase()
      );
      
      if (!companyRow || !companyRow[1]) {
        throw new Error(`找不到公司ID ${companyId} 對應的表單ID`);
      }
      
      // 獲取表單ID (B欄位)
      const sheetId = companyRow[1];
      
      // 構建 Google Sheets API URL 獲取員工基本資料
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('員工基本資料')}?key=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        setError("找不到員工資料");
        setLoading(false);
        return;
      }
      
      // 假設第一行是標題行
      const headers = data.values[0];
      
      // 將資料轉換為物件陣列
      const formattedData = data.values.slice(1).map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || '';
        });
        return item;
      });
      
      // 找到當前登入的員工資料
      const employee = formattedData.find(item => 
        item.company_id === companyId && 
        item.employee_id === employeeId
      );
      
      if (!employee) {
        setError("找不到員工資料");
        setLoading(false);
        return;
      }
      
      // 設置員工資訊
      setEmployeeData(employee);
      setDepartment(employee.department);
      setCurrentUserName(employee.name); // 設置當前用戶姓名
      setCurrentUserJobGrade(employee.job_grade); // 設置當前用戶職等
      
      console.log("已獲取當前用戶資料:", {
        name: employee.name,
        job_grade: employee.job_grade
      });
      
      // 獲取到部門後，再獲取申請表單
      return employee.department;
      
    } catch (err) {
      console.error("獲取員工資料失敗:", err);
      setError(`獲取員工資料失敗: ${err.message}`);
      return null;
    }
  }, [companyId, employeeId]);

  // 處理狀態過濾變更
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // 使用共用函數獲取加班申請表單數據
  const fetchRequests = useCallback(async (dept) => {
    // 使用從 AuditSystem 傳入的共用查詢函數
    if (handleQueryRequests) {
      return handleQueryRequests(
        'workovertime', 
        companyId, 
        employeeId, 
        dept || department, 
        contextDepartment,
        currentUserJobGrade,
        setLoading,
        setError,
        setRequests,
        statusFilter
      );
    } else {
      // 如果沒有傳入共用函數，則使用本地的查詢函數
      await fetchRequestData(
        'workovertime',
        companyId,
        employeeId,
        dept || department,
        contextDepartment,
        currentUserJobGrade,
        setLoading,
        setError,
        setRequests,
        statusFilter
      );
    }
  }, [
    handleQueryRequests, 
    companyId, 
    employeeId, 
    department, 
    contextDepartment, 
    currentUserJobGrade,
    statusFilter
  ]);

  // 初始化加載數據
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const dept = await fetchEmployeeData();
        if (dept) {
          await fetchRequests(dept);
        }
      } catch (err) {
        console.error("初始化數據失敗:", err);
        setError(`初始化數據失敗: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchEmployeeData, fetchRequests]);

  // 當狀態過濾器變更時重新獲取數據
  useEffect(() => {
    if (department) {
      fetchRequests(department);
    }
  }, [statusFilter, fetchRequests, department]);

  // 處理審批操作
  const handleApprove = async (formNumber) => {
    if (handleApprovalAction) {
      // 使用從 AuditSystem 傳入的共用審批函數
      await handleApprovalAction(
        'approve',
        'workovertime',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    } else {
      // 如果沒有傳入共用函數，則使用本地的審批函數
      await handleRequestAction(
        'approve',
        'workovertime',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    }
  };

  // 處理退回操作
  const handleReject = async (formNumber) => {
    if (handleApprovalAction) {
      // 使用從 AuditSystem 傳入的共用審批函數
      await handleApprovalAction(
        'reject',
        'workovertime',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    } else {
      // 如果沒有傳入共用函數，則使用本地的審批函數
      await handleRequestAction(
        'reject',
        'workovertime',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    }
  };

  // 顯示申請狀態 - 修改後的函數
  const getStatusDisplay = (status, reviewerStatus, hrStatus, userJobGrade = currentUserJobGrade) => {
    if (userJobGrade === 'hr') {
      // HR 角色的狀態顯示邏輯保持不變
      if (status === "已通過" || hrStatus === "ok") return "已通過";
      if (status === "未通過" || hrStatus === "no") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "簽核中";
      return "簽核中";
    } else if (userJobGrade === 'leader' || userJobGrade === 'manager') {
      // leader 角色的狀態顯示邏輯
      if (status === "已通過") return "已通過";
      if (status === "未通過") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "已通過"; // 關鍵修改
      return "簽核中";
    } else {
      // 其他角色的狀態顯示邏輯
      if (status === "已通過" || hrStatus === "ok") return "已通過";
      if (status === "未通過" || hrStatus === "no") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "簽核中";
      return "簽核中";
    }
  };

  // 如果選擇了特定申請，顯示詳細資訊
  if (selectedRequest) {
    return (
      <RequestDetail
        type="overtime"
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        currentTime={currentTime}
        handleHomeClick={handleHomeClick}
        onApprove={handleApprove}
        onReject={handleReject}
        handleBackToAuditSystem={handleBackToAuditSystem}
      />
    );
  }

  return (
    <>
      <Header title="加班審核" currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 新增返回簽核系統按鈕 */}
      <BackToSystemLink handleBackToAuditSystem={handleBackToAuditSystem} />
      

      {/* 狀態過濾標籤 */}
      <StatusTabContainer
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
      />
      
      {employeeData && (
        <div style={commonStyles.companyInfo}>
          {employeeData.company_name} | {employeeData.department} | {employeeData.name} ({employeeData.job_grade})
        </div>
      )}
      
      <div style={commonStyles.contentContainer}>
        {loading ? (
          <div style={commonStyles.loadingContainer}>
            <p>載入中...</p>
          </div>
        ) : error ? (
          <div style={commonStyles.errorMessage}>
            <p>{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={commonStyles.noDataMessage}>
            <p>無加班申請資料</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.form_number}
              style={commonStyles.requestCard}
              onClick={() => setSelectedRequest(request)}
            >
              <div style={commonStyles.requestHeader}>
                <div>申請單號: {request.form_number}</div>
                <div style={commonStyles.status(getStatusDisplay(request.status, request.reviewer_status, request.hr_status, currentUserJobGrade))}>
                  {getStatusDisplay(request.status, request.reviewer_status, request.hr_status, currentUserJobGrade)}
                </div>
              </div>
              <div>申請人: {request.name} ({request.employee_id})</div>
              <div>申請日期: {request.application_date}</div>
              <div>加班日期: {request.start_date}</div>
              <div>時間: {request.start_time} - {request.end_time}</div>
              <div>總時數: {request.total_calculation_hours}小時</div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// 補卡功能內容組件
export const CardReplenishContent = ({ 
  activeTab, 
  handleTabClick, 
  handleNewCardReplenishRequest, 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick,
  companyId,
  employeeId,
  handleQueryRequests,
  handleApprovalAction
}) => {
  const { department: contextDepartment, position } = useEmployee();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [department, setDepartment] = useState(contextDepartment || '');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserJobGrade, setCurrentUserJobGrade] = useState('');
  const [statusFilter, setStatusFilter] = useState("簽核中"); // 預設狀態過濾為「簽核中」

  // 獲取員工基本資料
  const fetchEmployeeData = useCallback(async () => {
    if (!companyId || !employeeId) {
      setError("未設定公司ID或員工ID");
      setLoading(false);
      return;
    }

    try {
      // 先從總表查詢表單ID
      const masterUrl = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/${encodeURIComponent(MASTER_RANGE)}?key=${API_KEY}`;
      
      const masterResponse = await fetch(masterUrl);
      if (!masterResponse.ok) {
        throw new Error(`總表 API 請求失敗: ${masterResponse.status}`);
      }
      
      const masterData = await masterResponse.json();
      
      if (!masterData.values || masterData.values.length <= 1) {
        throw new Error("總表中找不到數據");
      }
      
      // 假設總表第一行是標題行，從第二行開始查找
      const companyRow = masterData.values.find(row => 
        row[0]?.toLowerCase() === companyId.toLowerCase()
      );
      
      if (!companyRow || !companyRow[1]) {
        throw new Error(`找不到公司ID ${companyId} 對應的表單ID`);
      }
      
      // 獲取表單ID
      const sheetId = companyRow[1];
      
      // 構建 Google Sheets API URL 獲取員工基本資料
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('員工基本資料')}?key=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        setError("找不到員工資料");
        setLoading(false);
        return;
      }
      
      // 假設第一行是標題行
      const headers = data.values[0];
      
      // 將資料轉換為物件陣列
      const formattedData = data.values.slice(1).map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || '';
        });
        return item;
      });
      
      // 找到當前登入的員工資料
      const employee = formattedData.find(item => 
        item.company_id === companyId && 
        item.employee_id === employeeId
      );
      
      if (!employee) {
        setError("找不到員工資料");
        setLoading(false);
        return;
      }
      
      // 設置員工資訊
      setEmployeeData(employee);
      setDepartment(employee.department);
      setCurrentUserName(employee.name);
      setCurrentUserJobGrade(employee.job_grade);
      
      // 獲取到部門後，再獲取申請表單
      return employee.department;
      
    } catch (err) {
      console.error("獲取員工資料失敗:", err);
      setError(`獲取員工資料失敗: ${err.message}`);
      return null;
    }
  }, [companyId, employeeId]);

  // 處理狀態過濾變更
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // 使用共用函數獲取補卡申請表單數據
  const fetchRequests = useCallback(async (dept) => {
    if (handleQueryRequests) {
      return handleQueryRequests(
        'replenish', 
        companyId, 
        employeeId, 
        dept || department, 
        contextDepartment,
        currentUserJobGrade,
        setLoading,
        setError,
        setRequests,
        statusFilter
      );
    } else {
      await fetchRequestData(
        'replenish',
        companyId,
        employeeId,
        dept || department,
        contextDepartment,
        currentUserJobGrade,
        setLoading,
        setError,
        setRequests,
        statusFilter
      );
    }
  }, [
    handleQueryRequests, 
    companyId, 
    employeeId, 
    department, 
    contextDepartment, 
    currentUserJobGrade,
    statusFilter
  ]);

  // 初始化加載數據
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const dept = await fetchEmployeeData();
        if (dept) {
          await fetchRequests(dept);
        }
      } catch (err) {
        console.error("初始化數據失敗:", err);
        setError(`初始化數據失敗: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchEmployeeData, fetchRequests]);

  // 當狀態過濾器變更時重新獲取數據
  useEffect(() => {
    if (department) {
      fetchRequests(department);
    }
  }, [statusFilter, fetchRequests, department]);

  // 處理審批操作
  const handleApprove = async (formNumber) => {
    if (handleApprovalAction) {
      await handleApprovalAction(
        'approve',
        'replenish',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    } else {
      await handleRequestAction(
        'approve',
        'replenish',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    }
  };

  // 處理退回操作
  const handleReject = async (formNumber) => {
    if (handleApprovalAction) {
      await handleApprovalAction(
        'reject',
        'replenish',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    } else {
      await handleRequestAction(
        'reject',
        'replenish',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    }
  };

  // 顯示申請狀態 - 修改後的函數
  const getStatusDisplay = (status, reviewerStatus, hrStatus, userJobGrade = currentUserJobGrade) => {
    if (userJobGrade === 'hr') {
      // HR 角色的狀態顯示邏輯保持不變
      if (status === "已通過" || hrStatus === "ok") return "已通過";
      if (status === "未通過" || hrStatus === "no") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "簽核中";
      return "簽核中";
    } else if (userJobGrade === 'leader' || userJobGrade === 'manager') {
      // leader 角色的狀態顯示邏輯
      if (status === "已通過") return "已通過";
      if (status === "未通過") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "已通過"; // 關鍵修改
      return "簽核中";
    } else {
      // 其他角色的狀態顯示邏輯
      if (status === "已通過" || hrStatus === "ok") return "已通過";
      if (status === "未通過" || hrStatus === "no") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "簽核中";
      return "簽核中";
    }
  };

  // 如果選擇了特定申請，顯示詳細資訊
  if (selectedRequest) {
    return (
      <RequestDetail
        type="replenish"
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        currentTime={currentTime}
        handleHomeClick={handleHomeClick}
        onApprove={handleApprove}
        onReject={handleReject}
        handleBackToAuditSystem={handleBackToAuditSystem}
      />
    );
  }

  return (
    <>
      <Header title="補卡審核" currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 新增返回簽核系統按鈕 */}
      <BackToSystemLink handleBackToAuditSystem={handleBackToAuditSystem} />
      

      
      {/* 狀態過濾標籤 */}
      <StatusTabContainer
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
      />
      
      {employeeData && (
        <div style={commonStyles.companyInfo}>
          {employeeData.company_name} | {employeeData.department} | {employeeData.name} ({employeeData.job_grade})
        </div>
      )}
      
      <div style={commonStyles.contentContainer}>
        {loading ? (
          <div style={commonStyles.loadingContainer}>
            <p>載入中...</p>
          </div>
        ) : error ? (
          <div style={commonStyles.errorMessage}>
            <p>{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={commonStyles.noDataMessage}>
            <p>無補卡申請資料</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.form_number}
              style={commonStyles.requestCard}
              onClick={() => setSelectedRequest(request)}
            >
              <div style={commonStyles.requestHeader}>
                <div>申請單號: {request.form_number}</div>
                <div style={commonStyles.status(getStatusDisplay(request.status, request.reviewer_status, request.hr_status, currentUserJobGrade))}>
                  {getStatusDisplay(request.status, request.reviewer_status, request.hr_status, currentUserJobGrade)}
                </div>
              </div>
              <div>申請人: {request.name} ({request.employee_id})</div>
              <div>申請日期: {request.application_date}</div>
              <div>補卡日期: {request.start_date}</div>
              <div>補卡時間: {request.start_time}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// 請假功能內容組件
export const LeaveContent = ({ 
  activeTab, 
  handleTabClick, 
  handleNewLeaveRequest, 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick,
  companyId,
  employeeId,
  handleQueryRequests,
  handleApprovalAction
}) => {
  const { department: contextDepartment, position } = useEmployee();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [department, setDepartment] = useState(contextDepartment || '');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserJobGrade, setCurrentUserJobGrade] = useState('');
  const [statusFilter, setStatusFilter] = useState("簽核中"); // 預設狀態過濾為「簽核中」

  // 獲取員工基本資料
  const fetchEmployeeData = useCallback(async () => {
    if (!companyId || !employeeId) {
      setError("未設定公司ID或員工ID");
      setLoading(false);
      return;
    }

    try {
      // 先從總表查詢表單ID
      const masterUrl = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/${encodeURIComponent(MASTER_RANGE)}?key=${API_KEY}`;
      
      const masterResponse = await fetch(masterUrl);
      if (!masterResponse.ok) {
        throw new Error(`總表 API 請求失敗: ${masterResponse.status}`);
      }
      
      const masterData = await masterResponse.json();
      
      if (!masterData.values || masterData.values.length <= 1) {
        throw new Error("總表中找不到數據");
      }
      
      // 假設總表第一行是標題行，從第二行開始查找
      const companyRow = masterData.values.find(row => 
        row[0]?.toLowerCase() === companyId.toLowerCase()
      );
      
      if (!companyRow || !companyRow[1]) {
        throw new Error(`找不到公司ID ${companyId} 對應的表單ID`);
      }
      
      // 獲取表單ID
      const sheetId = companyRow[1];
      
      // 構建 Google Sheets API URL 獲取員工基本資料
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('員工基本資料')}?key=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        setError("找不到員工資料");
        setLoading(false);
        return;
      }
      
      // 假設第一行是標題行
      const headers = data.values[0];
      
      // 將資料轉換為物件陣列
      const formattedData = data.values.slice(1).map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || '';
        });
        return item;
      });
      
      // 找到當前登入的員工資料
      const employee = formattedData.find(item => 
        item.company_id === companyId && 
        item.employee_id === employeeId
      );
      
      if (!employee) {
        setError("找不到員工資料");
        setLoading(false);
        return;
      }
      
      // 設置員工資訊
      setEmployeeData(employee);
      setDepartment(employee.department);
      setCurrentUserName(employee.name);
      setCurrentUserJobGrade(employee.job_grade);
      
      // 獲取到部門後，再獲取申請表單
      return employee.department;
      
    } catch (err) {
      console.error("獲取員工資料失敗:", err);
      setError(`獲取員工資料失敗: ${err.message}`);
      return null;
    }
  }, [companyId, employeeId]);

  // 處理狀態過濾變更
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // 使用共用函數獲取請假申請表單數據
  const fetchRequests = useCallback(async (dept) => {
    if (handleQueryRequests) {
      return handleQueryRequests(
        'leave', 
        companyId, 
        employeeId, 
        dept || department, 
        contextDepartment,
        currentUserJobGrade,
        setLoading,
        setError,
        setRequests,
        statusFilter
      );
    } else {
      await fetchRequestData(
        'leave',
        companyId,
        employeeId,
        dept || department,
        contextDepartment,
        currentUserJobGrade,
        setLoading,
        setError,
        setRequests,
        statusFilter
      );
    }
  }, [
    handleQueryRequests, 
    companyId, 
    employeeId, 
    department, 
    contextDepartment, 
    currentUserJobGrade,
    statusFilter
  ]);

  // 初始化加載數據
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const dept = await fetchEmployeeData();
        if (dept) {
          await fetchRequests(dept);
        }
      } catch (err) {
        console.error("初始化數據失敗:", err);
        setError(`初始化數據失敗: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchEmployeeData, fetchRequests]);

  // 當狀態過濾器變更時重新獲取數據
  useEffect(() => {
    if (department) {
      fetchRequests(department);
    }
  }, [statusFilter, fetchRequests, department]);

  // 處理審批操作
  const handleApprove = async (formNumber) => {
    if (handleApprovalAction) {
      await handleApprovalAction(
        'approve',
        'leave',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    } else {
      await handleRequestAction(
        'approve',
        'leave',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    }
  };

  // 處理退回操作
  const handleReject = async (formNumber) => {
    if (handleApprovalAction) {
      await handleApprovalAction(
        'reject',
        'leave',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    } else {
      await handleRequestAction(
        'reject',
        'leave',
        formNumber,
        companyId,
        currentUserName,
        currentUserJobGrade,
        fetchRequests,
        setLoading,
        setSelectedRequest
      );
    }
  };

  // 顯示申請狀態 - 修改後的函數
  const getStatusDisplay = (status, reviewerStatus, hrStatus, userJobGrade = currentUserJobGrade) => {
    if (userJobGrade === 'hr') {
      // HR 角色的狀態顯示邏輯保持不變
      if (status === "已通過" || hrStatus === "ok") return "已通過";
      if (status === "未通過" || hrStatus === "no") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "簽核中";
      return "簽核中";
    } else if (userJobGrade === 'leader' || userJobGrade === 'manager') {
      // leader 角色的狀態顯示邏輯
      if (status === "已通過") return "已通過";
      if (status === "未通過") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "已通過"; // 關鍵修改
      return "簽核中";
    } else {
      // 其他角色的狀態顯示邏輯
      if (status === "已通過" || hrStatus === "ok") return "已通過";
      if (status === "未通過" || hrStatus === "no") return "未通過";
      if (reviewerStatus === "ok" && status === "審核中") return "簽核中";
      return "簽核中";
    }
  };

  // 如果選擇了特定申請，顯示詳細資訊
  if (selectedRequest) {
    return (
      <RequestDetail
        type="leave"
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        currentTime={currentTime}
        handleHomeClick={handleHomeClick}
        onApprove={handleApprove}
        onReject={handleReject}
        handleBackToAuditSystem={handleBackToAuditSystem}
      />
    );
  }

  return (
    <>
      <Header title="請假審核" currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 新增返回簽核系統按鈕 */}
      <BackToSystemLink handleBackToAuditSystem={handleBackToAuditSystem} />

      
      {/* 狀態過濾標籤 */}
      <StatusTabContainer
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
      />
      
      {employeeData && (
        <div style={commonStyles.companyInfo}>
          {employeeData.company_name} | {employeeData.department} | {employeeData.name} ({employeeData.job_grade})
        </div>
      )}
      
      <div style={commonStyles.contentContainer}>
        {loading ? (
          <div style={commonStyles.loadingContainer}>
            <p>載入中...</p>
          </div>
        ) : error ? (
          <div style={commonStyles.errorMessage}>
            <p>{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={commonStyles.noDataMessage}>
            <p>無請假申請資料</p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.form_number}
              style={commonStyles.requestCard}
              onClick={() => setSelectedRequest(request)}
            >
              <div style={commonStyles.requestHeader}>
                <div>申請單號: {request.form_number}</div>
                <div style={commonStyles.status(getStatusDisplay(request.status, request.reviewer_status, request.hr_status, currentUserJobGrade))}>
                  {getStatusDisplay(request.status, request.reviewer_status, request.hr_status, currentUserJobGrade)}
                </div>
              </div>
              <div>申請人: {request.name} ({request.employee_id})</div>
              <div>申請日期: {request.application_date}</div>
              <div>假別: {request.type}</div>
              <div>請假時間: {request.start_date} {request.start_time} - {request.end_date} {request.end_time}</div>
              <div>總時數: {request.total_calculation_hours}小時</div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// 審核系統主組件
const AuditSystem = ({ companyId, employeeId, handleHomeClick }) => {
  const [activeTab, setActiveTab] = useState("加班審核");
  const [currentTime, setCurrentTime] = useState("");

  // 更新當前時間
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000); // 每分鐘更新一次
    return () => clearInterval(intervalId);
  }, []);

  // 處理標籤切換
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 處理返回簽核系統
  const handleBackToAuditSystem = () => {
    setActiveTab("加班審核"); // 重置為默認標籤
  };

  // 共用的查詢函數
  const handleQueryRequests = (
    requestType,
    companyId,
    employeeId,
    department,
    contextDepartment,
    currentUserJobGrade,
    setLoading,
    setError,
    setRequests,
    statusFilter
  ) => {
    return fetchRequestData(
      requestType,
      companyId,
      employeeId,
      department,
      contextDepartment,
      currentUserJobGrade,
      setLoading,
      setError,
      setRequests,
      statusFilter
    );
  };

  // 共用的審批函數
  const handleApprovalAction = (
    action,
    requestType,
    formNumber,
    companyId,
    currentUserName,
    currentUserJobGrade,
    fetchRequests,
    setLoading,
    setSelectedRequest
  ) => {
    return handleRequestAction(
      action,
      requestType,
      formNumber,
      companyId,
      currentUserName,
      currentUserJobGrade,
      fetchRequests,
      setLoading,
      setSelectedRequest
    );
  };

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.appWrapper}>
        {activeTab === "加班審核" && (
          <OvertimeContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            handleBackToAuditSystem={handleBackToAuditSystem}
            currentTime={currentTime}
            handleHomeClick={handleHomeClick}
            companyId={companyId}
            employeeId={employeeId}
            handleQueryRequests={handleQueryRequests}
            handleApprovalAction={handleApprovalAction}
          />
        )}
        
        {activeTab === "補卡審核" && (
          <CardReplenishContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            handleBackToAuditSystem={handleBackToAuditSystem}
            currentTime={currentTime}
            handleHomeClick={handleHomeClick}
            companyId={companyId}
            employeeId={employeeId}
            handleQueryRequests={handleQueryRequests}
            handleApprovalAction={handleApprovalAction}
          />
        )}
        
        {activeTab === "請假審核" && (
          <LeaveContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            handleBackToAuditSystem={handleBackToAuditSystem}
            currentTime={currentTime}
            handleHomeClick={handleHomeClick}
            companyId={companyId}
            employeeId={employeeId}
            handleQueryRequests={handleQueryRequests}
            handleApprovalAction={handleApprovalAction}
          />
        )}
      </div>
    </div>
  );
};

export default AuditSystem;
