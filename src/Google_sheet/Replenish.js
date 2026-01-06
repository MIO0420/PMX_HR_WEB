import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import './css/Replenish.css';
import homeIcon from '../Google_sheet/HomePageImage/homepage.png';
import { 
  validateUserFromCookies, 
  formatFormNumber, 
  fetchAndProcessFormData,
  getFilteredRequests 
} from './function/function';

function Replenish() {
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [activeTab, setActiveTab] = useState("總覽");
  const [currentTime, setCurrentTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replenishRequests, setReplenishRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [cookieReady, setCookieReady] = useState(false);

  // 解析 description 欄位，分離補卡原因和詳細說明
  const parseDescription = (description) => {
    if (!description) return { reason: "未填寫", detail: "無" };
    const reasons = ["出差", "忘記打卡", "防私人的事", "其他"];
    let reason = "未填寫";
    let detail = "無";
    for (const r of reasons) {
      if (description.startsWith(r)) {
        reason = r;
        detail = description.substring(r.length).trim();
        if (!detail) detail = "無";
        break;
      }
    }
    return { reason, detail };
  };

  // 狀態映射函數
  const mapStatus = (status) => {
    switch (status) {
      case "ok":
        return "已通過";
      case "no":
        return "未通過";
      case "pending":
        return "簽核中";
      default:
        return "簽核中";
    }
  };

  // 日期格式化
  const formatDate = (dateString) => {
    if (!dateString) return "未指定";
    try {
      return new Date(dateString).toLocaleDateString('zh-TW');
    } catch (error) {
      return "未指定";
    }
  };

  // 日期時間格式化
  const formatDateTime = (dateString) => {
    if (!dateString) return "未指定";
    try {
      return new Date(dateString).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return "未指定";
    }
  };

  // 處理 API 資料
  const processReplenishData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(item => {
      if (!item || !item.form_number) return null;
      const { reason, detail } = parseDescription(item.description);
      return {
        id: formatFormNumber(item.form_number, 'R'),
        status: mapStatus(item.status),
        submitTime: formatDateTime(item.application_date),
        employeeName: item.employee_name || "未指定",
        type: item.application_type || "未指定",
        reason: reason,
        applicationDate: formatDate(item.start_date),
        details: {
          type: item.application_type || "未指定",
          reason: reason,
          date: formatDate(item.start_date),
          start_time: item.start_time || "未指定",
          detail: detail,
          reviewer: item.reviewer || "未指定",
          department: item.department || "未指定",
          position: item.position || "未指定"
        }
      };
    }).filter(item => item !== null);
  };

  // cookieReady 檢查機制：等三個 cookie 都有值才算 ready
useEffect(() => {
  let cancelled = false;
  async function waitCookie() {
    while (!cancelled) {
      const token = Cookies.get('auth_xtbb');
      const cid = Cookies.get('company_id');
      const eid = Cookies.get('employee_id');
      if (token && cid && eid) {
        setCookieReady(true);
        break;
      }
      await new Promise(res => setTimeout(res, 100));
    }
  }
  waitCookie();
  return () => { cancelled = true; };
}, []);


  // 驗證用戶（等 cookieReady 才執行）
  useEffect(() => {
    if (!cookieReady) return;
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, [cookieReady]);

  // 取得補卡申請資料
  useEffect(() => {
    if (!companyId || !employeeId || !authToken) return;
    const fetchReplenishRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = 'https://rabbit.54ucl.com:3004/api/forms/advanced-search';
        const requestBody = {
          company_id: companyId,
          employee_id: employeeId,
          category: "replenish"
        };
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          mode: 'cors',
          body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API 請求失敗: ${response.status} - ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          throw new Error(`伺服器回傳非 JSON 格式資料，內容類型: ${contentType}`);
        }
        const result = await response.json();
        if (result.Status === "Ok") {
          if (Array.isArray(result.Data)) {
            const validData = result.Data.filter(item => 
              item && 
              item.form_number && 
              item.employee_id === employeeId && 
              item.company_id == companyId
            );
            const processedRequests = processReplenishData(validData);
            setReplenishRequests(processedRequests);
          } else {
            setReplenishRequests([]);
          }
        } else {
          setError(`API 回傳錯誤: ${result.Msg || result.Message || '未知錯誤'}`);
          setReplenishRequests([]);
        }
      } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          setError('網路連線錯誤或 CORS 問題，請聯繫系統管理員');
        } else if (err.message.includes('CORS')) {
          setError('跨域請求錯誤，請聯繫系統管理員設定 CORS');
        } else if (err.message.includes('404')) {
          setError('API 端點不存在，請聯繫系統管理員');
        } else {
          setError(`請求失敗: ${err.message}`);
        }
        setReplenishRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReplenishRequests();
  }, [companyId, employeeId, authToken]);

  // 標籤切換
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 新增補卡申請
  const handleNewReplenishRequest = () => {
    window.location.href = "/replenishapply01";
  };

  // 返回首頁
  const handleGoHome = () => {
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
        window.location.href = '/frontpage01';
      }
    } else {
      window.location.href = '/frontpage01';
    }
  };

  // 點擊申請單
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // 關閉彈窗
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 撤銷申請
  const handleCancelRequest = () => {
    alert(`已撤銷申請 ${selectedRequest?.id || ''}`);
    setShowModal(false);
  };

  // 狀態顏色
  const getStatusColor = (status) => {
    switch (status) {
      case "已通過":
        return "#3AA672";
      case "未通過":
        return "#F44336";
      case "待HR審核":
        return "#FF9800";
      default:
        return "#919191";
    }
  };

  // 禁止滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  // 申請單過濾
  const filteredRequests = Array.isArray(replenishRequests) ? replenishRequests.filter(request => {
    if (!request) return false;
    if (activeTab === "總覽") return true;
    return request.status === activeTab;
  }) : [];

  return (
    <div className="replenish-container">
      <div className="replenish-app-wrapper">
        <header className="replenish-header">
          <div className="replenish-home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt="Home" width="20" height="20" />
          </div>
          <div className="replenish-page-title">補打卡</div>
          <div className="replenish-time-display">{currentTime}</div>
        </header>
        <div className="replenish-content-container">
          <div className="replenish-tab-container">
            {["總覽", "簽核中", "已通過", "未通過"].map(tab => (
              <div 
                key={tab}
                className={`replenish-tab ${activeTab === tab ? "replenish-tab-active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="replenish-content-frame">
            {(!cookieReady || loading) ? (
              <div className="replenish-loading-container">
                <div className="replenish-loading-spinner"></div>
                <div className="replenish-loading-text">正在初始化...</div>
              </div>
            ) : error ? (
              <div className="replenish-error-container">
                <div className="replenish-error-title">發生錯誤</div>
                <div className="replenish-error-message">{error}</div>
                <button 
                  className="replenish-retry-button"
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    window.location.reload();
                  }}
                >
                  重試
                </button>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="replenish-empty-message">
                {activeTab === "總覽" ? "目前無申請單" : `目前無${activeTab}的申請單`}
              </div>
            ) : (
              <div className="replenish-requests-container">
                {filteredRequests.map((request, index) => (
                  <div 
                    key={request?.id || index} 
                    className="replenish-request-card"
                    onClick={() => handleRequestClick(request)}
                  >
                    <div className="replenish-request-id">{request?.id || "未指定"}</div>
                    <div className="replenish-submit-time">送出時間：{request?.submitTime || "未指定"}</div>
                    <div className="replenish-request-line"></div>
                    <div className={`replenish-status-badge ${
                      request?.status === "已通過" ? "replenish-status-approved" : 
                      request?.status === "未通過" ? "replenish-status-rejected" : ""
                    }`}>
                      <span className="replenish-status-text">{request?.status || "未知"}</span>
                    </div>
                    <div className="replenish-type">
                      補卡類型：{request?.type || "未指定"}
                    </div>
                    <div className="replenish-reason">
                      補卡原因：{request?.reason || "未填寫"}
                    </div>
                    <div className="replenish-time">
                      補卡日期：{request?.applicationDate || "未指定"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button 
          className="replenish-new-request-button"
          onClick={handleNewReplenishRequest}
        >
          新增補卡申請
        </button>
      </div>
      {showModal && selectedRequest && (
        <div className="replenish-modal-overlay" onClick={handleCloseModal}>
          <div className="replenish-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="replenish-modal-header">
              <button className="replenish-close-button" onClick={handleCloseModal}>×</button>
              <div className="replenish-modal-title">補卡申請單詳情</div>
            </div>
            <div className="replenish-modal-body">
              <div className="replenish-modal-info-section">
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">申請單號：</span>
                  <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>
                    {selectedRequest?.id || "未指定"}
                  </span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">送出時間：{selectedRequest?.submitTime || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">員工姓名：{selectedRequest?.employeeName || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">部門：{selectedRequest?.details?.department || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">職位：{selectedRequest?.details?.position || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">審核者：{selectedRequest?.details?.reviewer || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">狀態：</span>
                  <span style={{ 
                    padding: '4px 10px', 
                    backgroundColor: getStatusColor(selectedRequest?.status),
                    borderRadius: '8px', 
                    color: '#ffffff', 
                    fontSize: '14px',
                    display: 'inline-block', 
                    textAlign: 'center', 
                    minWidth: '60px',
                    marginLeft: '10px'
                  }}>
                    {selectedRequest?.status || "未知"}
                  </span>
                </div>
                <div className="replenish-modal-divider"></div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">補卡類型：{selectedRequest?.details?.type || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">補卡事由：{selectedRequest?.details?.reason || "未填寫"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">補卡日期：{selectedRequest?.details?.date || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">補卡時間：{selectedRequest?.details?.start_time || "未指定"}</span>
                </div>
                <div className="replenish-modal-row">
                  <span className="replenish-modal-label">詳細說明：</span>
                  <div className="replenish-modal-detail-text">
                    {selectedRequest?.details?.detail || "無"}
                  </div>
                </div>
              </div>
            </div>
            <div className="replenish-modal-footer">
              {(selectedRequest?.status === "簽核中" || selectedRequest?.status === "待HR審核") && (
                <button className="replenish-cancel-button" onClick={handleCancelRequest}>
                  撤銷申請
                </button>
              )}
              <button 
                className={`replenish-close-modal-button ${
                  selectedRequest?.status !== "簽核中" && selectedRequest?.status !== "待HR審核" ? "replenish-full-width" : ""
                }`}
                onClick={handleCloseModal}
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

export default Replenish;
