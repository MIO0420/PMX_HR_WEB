import React from 'react';
// API相關設定
export const API_KEY = "AIzaSyCw_go3b8DH1jfTmPCdKTesVW-b6vw9DkM";
export const MASTER_SHEET_ID = "1ziiWMZ_tSMO1-0PttLLymdtroT5UeLxW0rZwmr_NQZo"; // 總表 ID
export const MASTER_RANGE = "總表"; // 總表範圍


// 通用的頁頭組件
export const Header = ({ title, currentTime, handleHomeClick, styles }) => (
  <header className={styles?.header || "header"}>
    <div className={styles?.homeIcon || "homeIcon"} onClick={handleHomeClick}>
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
    <div className={styles?.pageTitle || "pageTitle"}>{title}</div>
    <div className={styles?.timeDisplay || "timeDisplay"}>{currentTime}</div>
  </header>
);

// 返回簽核系統組件
export const BackToSystemLink = ({ handleBackToAuditSystem, styles }) => (
  <div className={styles?.backToSystemLink || "backToSystemLink"} onClick={handleBackToAuditSystem}>
    ← 返回簽核系統
  </div>
);

// 狀態過濾標籤組件
export const StatusTabContainer = ({ statusFilter, handleStatusFilterChange, styles }) => (
  <div className={styles?.statusTabContainer || "statusTabContainer"}>
    {["簽核中", "已通過", "未通過"].map((status, index) => (
      <div
        key={status}
        className={`
          ${styles?.tab || "tab"} 
          ${statusFilter === status ? (styles?.activeTab || "active") : ''} 
          ${index === 0 ? (styles?.firstTab || "firstTab") : ''} 
          ${index === 2 ? (styles?.lastTab || "lastTab") : ''}
        `}
        onClick={() => handleStatusFilterChange(status)}
      >
        {status}
      </div>
    ))}
  </div>
);

// 從 Cookie 獲取值的通用函數
export const getCookieValue = (name) => {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// 獲取員工基本資料的通用函數
export const fetchEmployeeInfo = async (employeeId) => {
  try {
    const companyId = getCookieValue('company_id');
    const password = getCookieValue('password');

    if (!companyId || !password) {
      throw new Error('缺少認證資訊');
    }

    const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: companyId,
        employee_id: employeeId,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok && data.Status === "Ok") {
      console.log('員工資料獲取成功:', data.Data);
      return data.Data;
    } else {
      throw new Error(data.Msg || '獲取員工資料失敗');
    }
  } catch (err) {
    console.error("獲取員工資料失敗:", err);
    throw err;
  }
};

// 獲取審批員工的上級主管資訊
export const getSupervisorInfo = async (targetEmployeeId) => {
  try {
    const employeeData = await fetchEmployeeInfo(targetEmployeeId);
    return employeeData.supervisor;
  } catch (err) {
    console.error("獲取上級主管資訊失敗:", err);
    return null;
  }
};

// 獲取 HR 待審核表單
export const fetchHRPendingForms = async (employeeId, category) => {
  try {
    console.log(`發送 HR 待審核表單請求到: https://rabbit.54ucl.com:3004/api/hr/pending-forms-new/${employeeId}`);
    
    const response = await fetch(`https://rabbit.54ucl.com:3004/api/hr/pending-forms-new/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HR API 請求失敗: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('HR API 返回原始數據:', result);
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "獲取 HR 待審核數據失敗");
    }
    
    if (result.Data && Array.isArray(result.Data)) {
      // 過濾出指定類別的申請單
      const filteredRequests = category 
        ? result.Data.filter(item => item.category === category)
        : result.Data;
      
      console.log(`HR 待審核的${category || ''}申請:`, filteredRequests);
      return filteredRequests;
    }
    
    return [];
  } catch (err) {
    console.error("獲取 HR 待審核表單失敗:", err);
    throw err;
  }
};

// 獲取 HR 已審核表單
export const fetchHRApprovedForms = async (employeeId, category) => {
  try {
    console.log(`發送 HR 已審核表單請求到: https://rabbit.54ucl.com:3004/api/hr/approved-forms-new/${employeeId}`);
    
    const response = await fetch(`https://rabbit.54ucl.com:3004/api/hr/approved-forms-new/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HR 已審核 API 請求失敗: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('HR 已審核 API 返回原始數據:', result);
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "獲取 HR 已審核數據失敗");
    }
    
    if (result.Data && Array.isArray(result.Data)) {
      // 過濾出指定類別的申請單
      const filteredRequests = category 
        ? result.Data.filter(item => item.category === category)
        : result.Data;
      
      console.log(`HR 已審核的${category || ''}申請:`, filteredRequests);
      return filteredRequests;
    }
    
    return [];
  } catch (err) {
    console.error("獲取 HR 已審核表單失敗:", err);
    throw err;
  }
};

// 根據狀態過濾器決定使用的 API 端點
export const getApiEndpoint = (filterStatus) => {
  switch (filterStatus) {
    case "簽核中":
      return "pending";
    case "已通過":
      return "approved_pending_hr";
    case "未通過":
      return "rejected";
    default:
      return "pending";
  }
};

// 顯示申請狀態的共用函數
export const getStatusDisplay = (request) => {
  const { status, reviewer_status, hr_status, currentUserJobGrade } = request;
  
  // 如果使用新 API 格式
  if (typeof status === 'string' && ["approved", "approved_pending_hr", "rejected", "pending"].includes(status)) {
    switch (status) {
      case "approved":
        return "已通過";
      case "approved_pending_hr":
        return "等待HR審核";
      case "rejected":
        return "未通過";
      case "pending":
        return "簽核中";
    }
  }
  
  // 舊的狀態邏輯作為備用
  if (currentUserJobGrade === 'hr') {
    // HR 角色的狀態顯示邏輯
    if (status === "已通過" || hr_status === "ok") return "已通過";
    if (status === "未通過" || hr_status === "no") return "未通過";
    if (reviewer_status === "ok" && status === "審核中") return "簽核中";
    return "簽核中";
  } else if (currentUserJobGrade === 'leader' || currentUserJobGrade === 'manager') {
    // leader 或 manager 角色的狀態顯示邏輯
    if (status === "已通過") return "已通過";
    if (status === "未通過") return "未通過";
    // 當 leader 已審核通過的項目，顯示為「已通過」
    if (reviewer_status === "ok" && status === "審核中") return "已通過";
    return "簽核中";
  } else {
    // 其他角色的狀態顯示邏輯
    if (status === "已通過" || hr_status === "ok") return "已通過";
    if (status === "未通過" || hr_status === "no") return "未通過";
    if (reviewer_status === "ok" && status === "審核中") return "簽核中";
    return "簽核中";
  }
};

// 通用的獲取申請表單數據函數
export const fetchFormRequests = async (employeeId, statusFilter, category) => {
  if (!employeeId) return [];
  
  try {
    let allData = [];
    
    if (statusFilter === "簽核中") {
      // 對於「簽核中」狀態，需要合併一般審核和 HR 審核的數據
      try {
        // 1. 獲取一般待審核數據
        console.log(`發送一般待審核請求到: https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/pending`);
        const regularPendingResponse = await fetch(`https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/pending`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (regularPendingResponse.ok) {
          const regularResult = await regularPendingResponse.json();
          console.log('一般待審核 API 返回數據:', regularResult);
          
          if (regularResult.Status === "Ok" && regularResult.Data && Array.isArray(regularResult.Data)) {
            const filteredRequests = regularResult.Data.filter(item => item.category === category);
            console.log(`一般待審核的${category}申請:`, filteredRequests);
            allData = allData.concat(filteredRequests);
          }
        } else {
          console.log('一般待審核 API 請求失敗:', regularPendingResponse.status);
        }
        
        // 2. 獲取 HR 待審核數據
        try {
          const hrPendingRequests = await fetchHRPendingForms(employeeId, category);
          // 為 HR 審核數據添加標識
          const hrRequestsWithFlag = hrPendingRequests.map(item => ({
            ...item,
            is_hr_review: true
          }));
          allData = allData.concat(hrRequestsWithFlag);
        } catch (hrErr) {
          console.log('獲取 HR 待審核數據失敗，繼續使用一般數據:', hrErr.message);
        }
        
      } catch (err) {
        console.error("獲取待審核數據失敗:", err);
        throw err;
      }
    } else if (statusFilter === "已通過") {
      // 對於「已通過」狀態，合併一般審核和 HR 審核的已通過數據
      try {
        // 1. 獲取一般已通過數據
        const apiUrls = [
          `https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/approved`,
          `https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/approved_pending_hr`
        ];
        
        console.log(`發送一般已通過請求到:`, apiUrls);
        
        // 並行請求所有 API
        const responses = await Promise.all(
          apiUrls.map(url => fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }))
        );
        
        // 解析所有回應
        const results = await Promise.all(responses.map(response => response.json()));
        
        // 合併所有數據
        for (let result of results) {
          console.log('一般已通過 API 返回原始數據:', result);
          
          if (result.Status === "Ok" && result.Data && Array.isArray(result.Data)) {
            const filteredRequests = result.Data.filter(item => item.category === category);
            allData = allData.concat(filteredRequests);
          }
        }
        
        // 2. 獲取 HR 已審核數據（已通過）
        try {
          const hrApprovedRequests = await fetchHRApprovedForms(employeeId, category);
          // 只取已通過的 HR 審核數據
          const hrApprovedOnly = hrApprovedRequests.filter(item => item.hrstatus === "approved");
          // 為 HR 審核數據添加標識
          const hrRequestsWithFlag = hrApprovedOnly.map(item => ({
            ...item,
            is_hr_review: true
          }));
          allData = allData.concat(hrRequestsWithFlag);
        } catch (hrErr) {
          console.log('獲取 HR 已通過數據失敗，繼續使用一般數據:', hrErr.message);
        }
        
      } catch (err) {
        console.error("獲取已通過數據失敗:", err);
        throw err;
      }
    } else if (statusFilter === "未通過") {
      // 對於「未通過」狀態，合併一般審核和 HR 審核的被拒絕數據
      try {
        // 1. 獲取一般被拒絕數據
        console.log(`發送一般被拒絕請求到: https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/rejected`);
        const regularRejectedResponse = await fetch(`https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/rejected`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (regularRejectedResponse.ok) {
          const regularResult = await regularRejectedResponse.json();
          console.log('一般被拒絕 API 返回數據:', regularResult);
          
          if (regularResult.Status === "Ok" && regularResult.Data && Array.isArray(regularResult.Data)) {
            const filteredRequests = regularResult.Data.filter(item => item.category === category);
            console.log(`一般被拒絕的${category}申請:`, filteredRequests);
            allData = allData.concat(filteredRequests);
          }
        }
        
        // 2. 獲取 HR 已審核數據（被拒絕）
        try {
          const hrApprovedRequests = await fetchHRApprovedForms(employeeId, category);
          // 只取被拒絕的 HR 審核數據
          const hrRejectedOnly = hrApprovedRequests.filter(item => item.hrstatus === "rejected");
          // 為 HR 審核數據添加標識
          const hrRequestsWithFlag = hrRejectedOnly.map(item => ({
            ...item,
            is_hr_review: true
          }));
          allData = allData.concat(hrRequestsWithFlag);
        } catch (hrErr) {
          console.log('獲取 HR 被拒絕數據失敗，繼續使用一般數據:', hrErr.message);
        }
        
      } catch (err) {
        console.error("獲取被拒絕數據失敗:", err);
        throw err;
      }
    }
    
    console.log('合併後的原始數據:', allData);
    return allData;
    
  } catch (err) {
    console.error(`獲取${category}申請失敗:`, err);
    throw err;
  }
};

// 格式化申請數據的通用函數
export const formatRequestData = (allData, category) => {
  if (!allData || allData.length === 0) return [];
  
  // 格式化數據以匹配原有的數據結構
  const formattedRequests = allData.map(item => {
    const baseFields = {
      form_number: item.form_number || "",
      company_id: item.company_id?.toString() || "",
      employee_id: item.employee_id?.toString() || "",
      name: item.employee_name || "",
      department: item.department || "",
      position: item.position || "",
      job_grade: item.job_grade || "",
      application_date: item.application_date ? new Date(item.application_date).toLocaleDateString('zh-TW') : "",
      start_date: item.start_date || "",
      start_time: item.start_time || "",
      illustrate: item.description || item.reason || "",
      status: item.status || "pending",
      reviewer_name: item.reviewer_name || "",
      reviewer_job_grade: item.reviewer_job_grade || "",
      reviewer_status: item.reviewer_status || "",
      hr_name: item.hr_name || item.hrreviewer_name || "",
      hr_status: item.hr_status || item.hrstatus || "",
      category: item.category,
      is_hr_review: item.is_hr_review || false
    };
    
    // 根據類別添加特定欄位
    if (category === "leave" || category === "work_overtime" || category === "overtime") {
      return {
        ...baseFields,
        end_date: item.end_date || "",
        end_time: item.end_time || "",
        total_calculation_hours: item.total_hours || "0",
        type: item.leave_type || item.application_type || ""
      };
    } else if (category === "replenish") {
      return baseFields;
    }
    
    return baseFields;
  });
  
  return formattedRequests;
};

// 處理審批操作的通用函數
export const handleApproveRequest = async (formNumber, employeeId, employeeData, requests, category, setLoading) => {
  try {
    setLoading(true);
    
    // 檢查當前申請是否為 HR 審核
    const currentRequest = requests.find(req => req.form_number === formNumber);
    const isHRReview = currentRequest?.is_hr_review || false;
    
    let apiUrl, payload;
    let commentText = "";
    
    switch (category) {
      case "leave":
        commentText = "核准請假申請";
        break;
      case "work_overtime":
      case "overtime":
        commentText = "核准加班申請";
        break;
      case "replenish":
        commentText = "核准補卡申請";
        break;
      default:
        commentText = "核准申請";
    }
    
    if (isHRReview) {
      // HR 審核使用不同的 API
      apiUrl = `https://rabbit.54ucl.com:3004/api/hr/approve-form/${formNumber}`;
      payload = {
        hrstatus: "approved",
        hrreviewer_name: employeeId,
        hr_review_comment: `同意此${category === "leave" ? "請假" : category === "work_overtime" || category === "overtime" ? "加班" : "補卡"}申請`
      };
      console.log('發送 HR 審批請求:', { apiUrl, payload });
    } else {
      // 一般審核
      apiUrl = `https://rabbit.54ucl.com:3004/api/supervisor/approve-form/${formNumber}`;
      
      // 獲取當前審批員工的上級主管作為 HR 審核人
      const hrReviewer = await getSupervisorInfo(employeeId);
      
      payload = {
        status: "approved",
        reviewer_name: employeeId,
        reviewer_job_grade: employeeData?.job_grade || "",
        comment: commentText,
        hr_required: true,
        hrreviewer: hrReviewer || employeeData?.supervisor || "003"
      };
      console.log('發送一般審批請求:', { apiUrl, payload });
    }
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 請求失敗: ${errorData.Msg || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('審批回應:', result);
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "審批操作失敗");
    }
    
    // 根據回應結果顯示不同的訊息
    let alertMessage = `已批准申請 ${formNumber}\n審核人: ${employeeData?.name || employeeId} (${employeeData?.job_grade || ""})\n審核狀態: 已通過`;
    
    // 顯示 HR 審核資訊
    if (!isHRReview && payload.hrreviewer) {
      alertMessage += `\n已設置HR審核人: ${payload.hrreviewer}`;
    }
    
    if (result.Data && result.Data.hr_required) {
      alertMessage += `\n表單已轉送HR審核`;
    }
    
    return { success: true, message: alertMessage };
    
  } catch (err) {
    console.error("審批操作失敗:", err);
    return { success: false, message: `審批操作失敗: ${err.message}` };
  } finally {
    setLoading(false);
  }
};

// 處理拒絕操作的通用函數
export const handleRejectRequest = async (formNumber, employeeId, employeeData, requests, category, setLoading) => {
  try {
    setLoading(true);
    
    // 檢查當前申請是否為 HR 審核
    const currentRequest = requests.find(req => req.form_number === formNumber);
    const isHRReview = currentRequest?.is_hr_review || false;
    
    let apiUrl, payload;
    let commentText = "";
    
    switch (category) {
      case "leave":
        commentText = "拒絕請假申請";
        break;
      case "work_overtime":
      case "overtime":
        commentText = "拒絕加班申請";
        break;
      case "replenish":
        commentText = "拒絕補卡申請";
        break;
      default:
        commentText = "拒絕申請";
    }
    
    if (isHRReview) {
      // HR 審核使用不同的 API
      apiUrl = `https://rabbit.54ucl.com:3004/api/hr/approve-form/${formNumber}`;
      payload = {
        hrstatus: "rejected",
        hrreviewer_name: employeeId,
        hr_review_comment: `不同意此${category === "leave" ? "請假" : category === "work_overtime" || category === "overtime" ? "加班" : "補卡"}申請`
      };
      console.log('發送 HR 拒絕請求:', { apiUrl, payload });
    } else {
      // 一般審核
      apiUrl = `https://rabbit.54ucl.com:3004/api/supervisor/approve-form/${formNumber}`;
      
      payload = {
        status: "rejected",
        reviewer_name: employeeId,
        reviewer_job_grade: employeeData?.job_grade || "",
        comment: commentText
      };
      console.log('發送一般拒絕請求:', { apiUrl, payload });
    }
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 請求失敗: ${errorData.Msg || response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "審批操作失敗");
    }
    
    return { 
      success: true, 
      message: `已退回申請 ${formNumber}\n審核人: ${employeeData?.name || employeeId} (${employeeData?.job_grade || ""})\n審核狀態: 未通過`
    };
    
  } catch (err) {
    console.error("拒絕操作失敗:", err);
    return { success: false, message: `拒絕操作失敗: ${err.message}` };
  } finally {
    setLoading(false);
  }
};

// 詳細內容顯示組件
export const RequestDetail = ({ 
  type, 
  request, 
  onBack, 
  currentTime, 
  handleHomeClick,
  onApprove,
  onReject,
  handleBackToAuditSystem,
  styles
}) => {
  let title = "申請詳情";
  if (type === "workovertime" || type === "overtime" || type === "work_overtime") title = "加班申請詳情";
  if (type === "replenish") title = "補卡申請詳情";
  if (type === "leave") title = "請假申請詳情";

  const status = getStatusDisplay(request);
  const statusClass = status === "已通過" ? (styles?.statusApproved || "statusApproved") : 
                     status === "未通過" ? (styles?.statusRejected || "statusRejected") : 
                     (styles?.statusPending || "statusPending");

  // 根據類型渲染不同的內容
  const renderTypeSpecificFields = () => {
    if (type === "leave" || type === "workovertime" || type === "overtime" || type === "work_overtime") {
      return (
        <>
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>開始時間:</div>
            <div className={styles?.detailValue || "detailValue"}>{`${request.start_date} ${request.start_time}`}</div>
          </div>
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>結束時間:</div>
            <div className={styles?.detailValue || "detailValue"}>{`${request.end_date} ${request.end_time}`}</div>
          </div>
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>總時數:</div>
            <div className={styles?.detailValue || "detailValue"}>{`${request.total_calculation_hours || request.total_hours || "0"}小時`}</div>
          </div>
        </>
      );
    } else if (type === "replenish") {
      return (
        <>
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>補卡日期:</div>
            <div className={styles?.detailValue || "detailValue"}>{request.start_date}</div>
          </div>
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>補卡時間:</div>
            <div className={styles?.detailValue || "detailValue"}>{request.start_time}</div>
          </div>
        </>
      );
    }
    return null;
  };

  // 請假特有欄位
  const renderLeaveSpecificFields = () => {
    if (type === "leave") {
      return (
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>假別:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.type || request.leave_type}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles?.detailWrapper || "detailWrapper"}>
      <Header 
        title={title} 
        currentTime={currentTime} 
        handleHomeClick={handleHomeClick} 
        styles={styles} 
      />
      
      <BackToSystemLink 
        handleBackToAuditSystem={handleBackToAuditSystem} 
        styles={styles} 
      />
      
      <div className={styles?.backLink || "backLink"} onClick={onBack}>
        ← 返回
      </div>
      
      <div className={styles?.detailContainer || "detailContainer"}>
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>申請單號:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.form_number}</div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>狀態:</div>
          <div className={`${styles?.detailValue || "detailValue"} ${statusClass}`}>
            {status}
          </div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>申請日期:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.application_date}</div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>員工ID:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.employee_id}</div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>姓名:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.name || request.employee_name}</div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>部門:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.department}</div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>職位:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.position}</div>
        </div>
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>職級:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.job_grade}</div>
        </div>
        
        {renderLeaveSpecificFields()}
        {renderTypeSpecificFields()}
        
        <div className={styles?.detailRow || "detailRow"}>
          <div className={styles?.detailLabel || "detailLabel"}>說明:</div>
          <div className={styles?.detailValue || "detailValue"}>{request.illustrate}</div>
        </div>
        
        {request.reviewer_name && (
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>審核人:</div>
            <div className={styles?.detailValue || "detailValue"}>{request.reviewer_name} ({request.reviewer_job_grade})</div>
          </div>
        )}
        
        {request.reviewer_status && (
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>審核狀態:</div>
            <div className={`${styles?.detailValue || "detailValue"} ${
              request.reviewer_status === "ok" || request.reviewer_status === "approved" ? (styles?.statusApproved || "statusApproved") : 
              request.reviewer_status === "no" || request.reviewer_status === "rejected" ? (styles?.statusRejected || "statusRejected") : 
              (styles?.statusPending || "statusPending")
            }`}>
              {request.reviewer_status === "ok" || request.reviewer_status === "approved" ? "已通過" : 
               request.reviewer_status === "no" || request.reviewer_status === "rejected" ? "未通過" : "簽核中"}
            </div>
          </div>
        )}
        
        {(request.hr_name || request.hrreviewer_name) && (
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>HR審核:</div>
            <div className={styles?.detailValue || "detailValue"}>{request.hr_name || request.hrreviewer_name}</div>
          </div>
        )}
        
        {(request.hr_status || request.hrstatus) && (
          <div className={styles?.detailRow || "detailRow"}>
            <div className={styles?.detailLabel || "detailLabel"}>HR狀態:</div>
            <div className={`${styles?.detailValue || "detailValue"} ${
              request.hr_status === "ok" || request.hrstatus === "approved" ? (styles?.statusApproved || "statusApproved") : 
              request.hr_status === "no" || request.hrstatus === "rejected" ? (styles?.statusRejected || "statusRejected") : 
              (styles?.statusPending || "statusPending")
            }`}>
              {request.hr_status === "ok" || request.hrstatus === "approved" ? "已通過" : 
               request.hr_status === "no" || request.hrstatus === "rejected" ? "未通過" : "簽核中"}
            </div>
          </div>
        )}
      </div>
      
      {/* 無論申請狀態如何，都顯示按鈕 */}
      <div className={styles?.actionContainer || "actionContainer"}>
        <button 
          className={styles?.rejectButton || "rejectButton"} 
          onClick={() => onReject(request.form_number)}
        >
          退回申請
        </button>
        <button 
          className={styles?.approveButton || "approveButton"} 
          onClick={() => onApprove(request.form_number)}
        >
          批准簽名
        </button>
      </div>
    </div>
  );
};

// 共用的資料查詢函數
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
    
    // 根據狀態過濾
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
    console.error(`獲取申請表單失敗:`, err);
    setError(`獲取數據失敗: ${err.message}`);
    setRequests([]);
  } finally {
    setLoading(false);
  }
};

// 共用的審批函數
export const handleRequestAction = async (
  action, // 'approve' or 'reject'
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
    
    console.log(`正在${action === 'approve' ? '批准' : '退回'}申請: ${formNumber}`);
    console.log("處理數據:", payload);
    
    // 發送請求到後端 API
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
      alert(`HR 已${action === 'approve' ? '批准' : '退回'}申請 ${formNumber}\nHR: ${currentUserName}\n審核狀態: ${action === 'approve' ? "已通過" : "未通過"}`);
    } else {
      alert(`已${action === 'approve' ? '批准' : '退回'}申請 ${formNumber}\n審核人: ${currentUserName} (${currentUserJobGrade})\n審核狀態: ${action === 'approve' ? "已通過" : "未通過"}`);
    }
    
    // 重新獲取申請列表
    if (fetchRequests) {
      await fetchRequests();
    }
    
    // 關閉詳情視圖
    if (setSelectedRequest) {
      setSelectedRequest(null);
    }
    
  } catch (err) {
    console.error(`審批操作失敗:`, err);
    alert(`審批操作失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

// 共用的獲取員工資料函數
export const fetchEmployeeData = async (
  companyId,
  employeeId,
  setEmployeeData,
  setDepartment,
  setCurrentUserName,
  setCurrentUserJobGrade,
  setError,
  setLoading
) => {
  if (!companyId || !employeeId) {
    setError("未設定公司ID或員工ID");
    setLoading(false);
    return null;
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
      return null;
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
      return null;
    }
    
    // 設置員工資訊
    if (setEmployeeData) setEmployeeData(employee);
    if (setDepartment) setDepartment(employee.department);
    if (setCurrentUserName) setCurrentUserName(employee.name);
    if (setCurrentUserJobGrade) setCurrentUserJobGrade(employee.job_grade);
    
    // 獲取到部門後，再獲取申請表單
    return employee.department;
    
  } catch (err) {
    console.error("獲取員工資料失敗:", err);
    if (setError) setError(`獲取員工資料失敗: ${err.message}`);
    return null;
  }
};

// 格式化當前時間的函數
export const formatCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

// 導航到主頁的函數
export const navigateToHome = (navigate) => {
  if (navigate) {
    navigate('/');
  } else {
    console.error('導航函數未提供');
  }
};

// 導航到簽核系統的函數
export const navigateToAuditSystem = (navigate) => {
  if (navigate) {
    navigate('/audit-system');
  } else {
    console.error('導航函數未提供');
  }
};

// 請求列表項組件
export const RequestListItem = ({ request, onSelect, styles }) => {
  const status = getStatusDisplay(request);
  
  const statusClass = status === "已通過" ? (styles?.statusApproved || "statusApproved") : 
                     status === "未通過" ? (styles?.statusRejected || "statusRejected") : 
                     (styles?.statusPending || "statusPending");
  
  return (
    <div 
      className={styles?.requestItem || "requestItem"} 
      onClick={() => onSelect(request)}
    >
      <div className={styles?.requestHeader || "requestHeader"}>
        <div className={styles?.requestNumber || "requestNumber"}>{request.form_number}</div>
        <div className={`${styles?.requestStatus || "requestStatus"} ${statusClass}`}>
          {status}
        </div>
      </div>
      
      <div className={styles?.requestInfo || "requestInfo"}>
        <div className={styles?.requestDate || "requestDate"}>
          <span className={styles?.label || "label"}>申請日期:</span> {request.application_date}
        </div>
        <div className={styles?.requestEmployee || "requestEmployee"}>
          <span className={styles?.label || "label"}>員工ID:</span> {request.employee_id}
        </div>
        <div className={styles?.requestName || "requestName"}>
          <span className={styles?.label || "label"}>姓名:</span> {request.name || request.employee_name}
        </div>
        <div className={styles?.requestDepartment || "requestDepartment"}>
          <span className={styles?.label || "label"}>部門:</span> {request.department}
        </div>
      </div>
    </div>
  );
};

// 載入中組件
export const LoadingIndicator = ({ styles }) => (
  <div className={styles?.loadingContainer || "loadingContainer"}>
    <div className={styles?.loadingSpinner || "loadingSpinner"}></div>
    <div className={styles?.loadingText || "loadingText"}>載入中...</div>
  </div>
);

// 錯誤訊息組件
export const ErrorMessage = ({ message, styles }) => (
  <div className={styles?.errorContainer || "errorContainer"}>
    <div className={styles?.errorIcon || "errorIcon"}>⚠️</div>
    <div className={styles?.errorText || "errorText"}>{message}</div>
  </div>
);

// 空資料組件
export const EmptyData = ({ message, styles }) => (
  <div className={styles?.emptyContainer || "emptyContainer"}>
    <div className={styles?.emptyIcon || "emptyIcon"}>📭</div>
    <div className={styles?.emptyText || "emptyText"}>{message || "沒有符合條件的資料"}</div>
  </div>
);

// 過濾請求資料的函數
export const filterRequestsByStatus = (requests, statusFilter, currentUserJobGrade) => {
  if (!statusFilter || statusFilter === "總覽") {
    return requests;
  }
  
  return requests.filter(request => {
    const displayStatus = getStatusDisplay(request);
    return displayStatus === statusFilter;
  });
};

// 處理頁面初始化的函數
export const initializePage = async (
  companyId,
  employeeId,
  setEmployeeData,
  setDepartment,
  setCurrentUserName,
  setCurrentUserJobGrade,
  setError,
  setLoading
) => {
  try {
    setLoading(true);
    
    // 獲取員工資料
    const departmentResult = await fetchEmployeeData(
      companyId,
      employeeId,
      setEmployeeData,
      setDepartment,
      setCurrentUserName,
      setCurrentUserJobGrade,
      setError,
      setLoading
    );
    
    return departmentResult;
  } catch (err) {
    console.error("頁面初始化失敗:", err);
    setError(`初始化失敗: ${err.message}`);
    return null;
  } finally {
    setLoading(false);
  }
};

// 請求列表容器組件
export const RequestList = ({ 
  requests, 
  onSelect, 
  loading, 
  error, 
  emptyMessage,
  styles 
}) => {
  if (loading) {
    return <LoadingIndicator styles={styles} />;
  }
  
  if (error) {
    return <ErrorMessage message={error} styles={styles} />;
  }
  
  if (!requests || requests.length === 0) {
    return <EmptyData message={emptyMessage} styles={styles} />;
  }
  
  return (
    <div className={styles?.requestList || "requestList"}>
      {requests.map(request => (
        <RequestListItem 
          key={request.form_number} 
          request={request} 
          onSelect={onSelect}
          styles={styles}
        />
      ))}
    </div>
  );
};

// 主頁面佈局組件
export const PageLayout = ({ 
  title,
  currentTime,
  handleHomeClick,
  handleBackToAuditSystem,
  statusFilter,
  handleStatusFilterChange,
  children,
  styles
}) => {
  return (
    <div className={styles?.container || "container"}>
      <Header 
        title={title} 
        currentTime={currentTime} 
        handleHomeClick={handleHomeClick}
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
      
      {children}
    </div>
  );
};
// 排序請求列表的函數
export const sortRequests = (requests, sortBy = 'application_date', sortOrder = 'desc') => {
  return [...requests].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];
    
    // 處理日期格式
    if (sortBy.includes('date')) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
    
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

// 通用的獲取申請表單數據函數 - 使用新的 API 接口
export const fetchFormRequestsNew = async (employeeId, statusFilter, category) => {
  if (!employeeId) return [];
  
  try {
    // 根據狀態決定使用的 API 端點
    const endpoint = getApiEndpoint(statusFilter);
    
    // 構建 API URL
    const apiUrl = `https://rabbit.54ucl.com:3004/api/reviewer/${employeeId}/${endpoint}`;
    console.log(`發送請求到: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('API 返回原始數據:', result);
    
    if (result.Status !== "Ok") {
      throw new Error(result.Msg || "獲取數據失敗");
    }
    
    if (result.Data && Array.isArray(result.Data)) {
      // 過濾出指定類別的申請單
      const filteredRequests = result.Data.filter(item => item.category === category);
      console.log(`過濾後的${category}申請:`, filteredRequests);
      return filteredRequests;
    }
    
    return [];
  } catch (err) {
    console.error(`獲取${category}申請失敗:`, err);
    throw err;
  }
};

// 獲取 HR 待審核和已審核數據的通用函數
export const fetchHRData = async (employeeId, statusFilter, category) => {
  try {
    let hrData = [];
    
    if (statusFilter === "簽核中") {
      // 獲取 HR 待審核數據
      const hrPendingRequests = await fetchHRPendingForms(employeeId, category);
      hrData = hrPendingRequests.map(item => ({
        ...item,
        is_hr_review: true
      }));
    } else if (statusFilter === "已通過" || statusFilter === "未通過") {
      // 獲取 HR 已審核數據
      const hrApprovedRequests = await fetchHRApprovedForms(employeeId, category);
      
      // 根據狀態過濾
      const filteredRequests = hrApprovedRequests.filter(item => {
        if (statusFilter === "已通過") {
          return item.hrstatus === "approved";
        } else {
          return item.hrstatus === "rejected";
        }
      });
      
      hrData = filteredRequests.map(item => ({
        ...item,
        is_hr_review: true
      }));
    }
    
    return hrData;
  } catch (err) {
    console.error(`獲取 HR ${statusFilter}數據失敗:`, err);
    return [];
  }
};

// 整合獲取數據的函數 - 同時獲取一般審核和 HR 審核的數據
export const fetchAllRequestData = async (employeeId, statusFilter, category, isHR = false) => {
  try {
    let allData = [];
    
    // 如果是 HR 角色，只獲取 HR 相關數據
    if (isHR) {
      allData = await fetchHRData(employeeId, statusFilter, category);
    } else {
      // 獲取一般審核數據
      const regularData = await fetchFormRequestsNew(employeeId, statusFilter, category);
      allData = regularData;
      
      // 如果用戶同時具有 HR 權限，也獲取 HR 數據
      try {
        const hrData = await fetchHRData(employeeId, statusFilter, category);
        allData = [...allData, ...hrData];
      } catch (err) {
        console.log('獲取 HR 數據失敗，只使用一般數據:', err.message);
      }
    }
    
    // 格式化數據
    return formatRequestData(allData, category);
  } catch (err) {
    console.error(`獲取所有${category}申請數據失敗:`, err);
    throw err;
  }
};

// 通用的審批處理函數 - 整合一般審核和 HR 審核
export const processApproval = async (
  action, // 'approve' 或 'reject'
  formNumber,
  employeeId,
  employeeData,
  requests,
  category,
  setLoading,
  fetchRequests, // 重新獲取數據的回調函數
  setSelectedRequest // 關閉詳情視圖的回調函數
) => {
  try {
    let result;
    
    if (action === 'approve') {
      result = await handleApproveRequest(
        formNumber, 
        employeeId, 
        employeeData, 
        requests, 
        category, 
        setLoading
      );
    } else {
      result = await handleRejectRequest(
        formNumber, 
        employeeId, 
        employeeData, 
        requests, 
        category, 
        setLoading
      );
    }
    
    if (result.success) {
      alert(result.message);
      
      // 重新獲取申請列表
      if (fetchRequests) {
        await fetchRequests();
      }
      
      // 關閉詳情視圖
      if (setSelectedRequest) {
        setSelectedRequest(null);
      }
      
      return true;
    } else {
      alert(result.message);
      return false;
    }
  } catch (err) {
    console.error(`處理${action === 'approve' ? '批准' : '拒絕'}操作失敗:`, err);
    alert(`操作失敗: ${err.message}`);
    return false;
  }
};

// 檢查用戶是否有 HR 權限的函數
export const checkHRPermission = async (employeeId) => {
  try {
    const employeeData = await fetchEmployeeInfo(employeeId);
    return employeeData && employeeData.job_grade === 'hr';
  } catch (err) {
    console.error("檢查 HR 權限失敗:", err);
    return false;
  }
};

// 通用的頁面初始化函數 - 整合獲取員工資料和請求數據
export const initializePageWithData = async (
  employeeId,
  category,
  statusFilter,
  setEmployeeData,
  setRequests,
  setLoading,
  setError
) => {
  try {
    setLoading(true);
    
    // 獲取員工資料
    const employeeData = await fetchEmployeeInfo(employeeId);
    setEmployeeData(employeeData);
    
    // 檢查是否是 HR 角色
    const isHR = employeeData.job_grade === 'hr';
    
    // 獲取請求數據
    const requests = await fetchAllRequestData(employeeId, statusFilter, category, isHR);
    setRequests(requests);
    
    return { employeeData, requests };
  } catch (err) {
    console.error("初始化頁面數據失敗:", err);
    setError(`初始化失敗: ${err.message}`);
    return { employeeData: null, requests: [] };
  } finally {
    setLoading(false);
  }
};

// 通用的審核頁面組件 - 可用於各種審核類型
export const AuditPage = ({ 
  type, // 'leave', 'overtime', 'replenish'
  title,
  employeeId,
  navigate,
  styles
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [requests, setRequests] = React.useState([]);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState("簽核中");
  const [employeeData, setEmployeeData] = React.useState(null);
  const [currentTime, setCurrentTime] = React.useState(formatCurrentTime());
  
  // 更新當前時間
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 獲取請求數據
  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // 檢查是否是 HR 角色
      const isHR = employeeData?.job_grade === 'hr';
      
      // 獲取請求數據
      const requestsData = await fetchAllRequestData(employeeId, statusFilter, type, isHR);
      setRequests(requestsData);
      setError(null);
    } catch (err) {
      console.error(`獲取${type}申請失敗:`, err);
      setError(`獲取數據失敗: ${err.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, statusFilter, type, employeeData]);
  
  // 初始化頁面
  React.useEffect(() => {
    const initialize = async () => {
      try {
        await initializePageWithData(
          employeeId,
          type,
          statusFilter,
          setEmployeeData,
          setRequests,
          setLoading,
          setError
        );
      } catch (err) {
        console.error("初始化頁面失敗:", err);
        setError(`初始化失敗: ${err.message}`);
      }
    };
    
    initialize();
  }, [employeeId, type, statusFilter]);
  
  // 處理狀態過濾器變更
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  // 處理選擇請求
  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };
  
  // 處理返回列表
  const handleBackToList = () => {
    setSelectedRequest(null);
  };
  
  // 處理批准請求
  const handleApprove = async (formNumber) => {
    await processApproval(
      'approve',
      formNumber,
      employeeId,
      employeeData,
      requests,
      type,
      setLoading,
      fetchRequests,
      setSelectedRequest
    );
  };
  
  // 處理拒絕請求
  const handleReject = async (formNumber) => {
    await processApproval(
      'reject',
      formNumber,
      employeeId,
      employeeData,
      requests,
      type,
      setLoading,
      fetchRequests,
      setSelectedRequest
    );
  };
  
  // 導航到主頁
  const handleHomeClick = () => {
    navigateToHome(navigate);
  };
  
  // 導航到簽核系統
  const handleBackToAuditSystem = () => {
    navigateToAuditSystem(navigate);
  };
  
  // 如果有選中的請求，顯示詳情
  if (selectedRequest) {
    return (
      <RequestDetail
        type={type}
        request={selectedRequest}
        onBack={handleBackToList}
        currentTime={currentTime}
        handleHomeClick={handleHomeClick}
        onApprove={handleApprove}
        onReject={handleReject}
        handleBackToAuditSystem={handleBackToAuditSystem}
        styles={styles}
      />
    );
  }
  
  // 否則顯示列表
  return (
    <PageLayout
      title={title}
      currentTime={currentTime}
      handleHomeClick={handleHomeClick}
      handleBackToAuditSystem={handleBackToAuditSystem}
      statusFilter={statusFilter}
      handleStatusFilterChange={handleStatusFilterChange}
      styles={styles}
    >
      <RequestList
        requests={requests}
        onSelect={handleSelectRequest}
        loading={loading}
        error={error}
        emptyMessage={`沒有${statusFilter}的${type === 'leave' ? '請假' : type === 'overtime' || type === 'work_overtime' ? '加班' : '補卡'}申請`}
        styles={styles}
      />
    </PageLayout>
  );
};
