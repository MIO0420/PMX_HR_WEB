import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Replenish() {
  const [activeTab, setActiveTab] = useState("總覽");
  const [currentTime, setCurrentTime] = useState("");
  const [isFlutterApp, setIsFlutterApp] = useState(false);
  const navigate = useNavigate();

  // 檢測是否為 Flutter APP 環境
  useEffect(() => {
    // 檢查是否為 Flutter 環境的方法
    const checkIfFlutter = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return userAgent.includes('flutter') || window.flutter !== undefined;
    };
    
    setIsFlutterApp(checkIfFlutter());
  }, []);

  // 更新右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 加班申請資料
  const overtimeRequests = [
    {
      id: "E2409050005",
      status: "已通過",
      submitTime: "2024-09-05 21:19",
      startTime: "2024-09-05 19:30",
      endTime: "2024-09-05 20:30",
      totalTime: "1小時 0分鐘",
    },
    {
      id: "E2409020007",
      status: "未通過",
      submitTime: "2024-09-02 21:19",
      startTime: "2024-09-03 18:30",
      endTime: "2024-09-03 19:30",
      totalTime: "1小時 0分鐘",
    },
  ];

  // 處理標籤點擊
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 處理新增加班申請按鈕
  const handleNewOvertimeRequest = () => {
    navigate("/replenishapply");
  };

  // 處理返回首頁
  const handleHomeClick = () => {
    if (isFlutterApp) {
      // 如果是 Flutter APP，使用 Flutter 提供的方法返回
      if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('goToHome');
        return;
      }
      
      // 或者使用其他 Flutter 與 WebView 通信的方式
      if (window.flutter) {
        window.flutter.postMessage(JSON.stringify({ action: 'goToHome' }));
        return;
      }
    }
    
    // 如果是網頁或無法確認，則使用 React Router 導航
    navigate('/frontpage');
  };

  // 樣式定義
  const styles = {
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
      justifyContent: "space-around",
      marginTop: "10px",
      borderBottom: "1px solid #e0e0e0",
    },
    tab: (isActive) => ({
      flex: 1,
      textAlign: "center",
      padding: "10px 0",
      cursor: "pointer",
      backgroundColor: isActive ? "#3a75b5" : "#ffffff",
      color: isActive ? "#ffffff" : "#3a75b5",
      fontWeight: isActive ? "bold" : "normal",
    }),
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
    },
    requestHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px",
    },
    status: (status) => ({
      color: status === "已通過" ? "green" : "red",
      fontWeight: "bold",
    }),
    newRequestButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#3a75b5",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* 頁面標題與時間 */}
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
          <div style={styles.pageTitle}>補卡</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        {/* 標籤 */}
        <div style={styles.tabContainer}>
          <div
            style={styles.tab(activeTab === "總覽")}
            onClick={() => handleTabClick("總覽")}
          >
            總覽
          </div>
          <div
            style={styles.tab(activeTab === "簽核中")}
            onClick={() => handleTabClick("簽核中")}
          >
            簽核中
          </div>
          <div
            style={styles.tab(activeTab === "已通過")}
            onClick={() => handleTabClick("已通過")}
          >
            已通過
          </div>
          <div
            style={styles.tab(activeTab === "未通過")}
            onClick={() => handleTabClick("未通過")}
          >
            未通過
          </div>
        </div>

        {/* 內容區域 */}
        <div style={styles.contentContainer}>
          {overtimeRequests
            .filter((request) => activeTab === "總覽" || request.status === activeTab)
            .map((request) => (
              <div key={request.id} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <span>{request.id}</span>
                  <span style={styles.status(request.status)}>{request.status}</span>
                </div>
                <div>送出時間: {request.submitTime}</div>
                <div>補卡時間起迄: {request.startTime} ~ {request.endTime}</div>
                <div>補卡總時數: {request.totalTime}</div>
              </div>
            ))}
        </div>

        {/* 新增按鈕 */}
        <button style={styles.newRequestButton} onClick={handleNewOvertimeRequest}>
          新增補卡申請
        </button>
      </div>
    </div>
  );
}

export default Replenish;
