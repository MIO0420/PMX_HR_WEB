// AuditTable.js
import React, { useState, useEffect } from "react";

// 共用樣式
export const commonStyles = {
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
};

// 通用的頁頭組件
export const Header = ({ title, currentTime, handleHomeClick }) => (
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

// 通用的標籤組件
export const TabContainer = ({ activeTab, tabs, handleTabClick }) => (
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

// 加班功能內容組件
export const OvertimeContent = ({ 
  activeTab, 
  handleTabClick, 
  handleNewOvertimeRequest, 
  handleBackToAuditSystem,
  currentTime,
  handleHomeClick
}) => {
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
    {
      id: "E2408150003",
      status: "簽核中",
      submitTime: "2024-08-15 14:30",
      startTime: "2024-08-16 18:30",
      endTime: "2024-08-16 20:30",
      totalTime: "2小時 0分鐘",
    },
  ];

  const tabs = ["總覽", "簽核中", "已通過", "未通過"];

  return (
    <>
      <Header title="加班" currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 返回連結 - 確保這裡的點擊事件正確 */}
      <div 
        style={commonStyles.backLink} 
        onClick={() => {
          if (handleBackToAuditSystem) handleBackToAuditSystem();
        }}
      >
        ← 返回簽核系統
      </div>
      
      <TabContainer activeTab={activeTab} tabs={tabs} handleTabClick={handleTabClick} />

      <div style={commonStyles.contentContainer}>
        {overtimeRequests
          .filter((request) => activeTab === "總覽" || request.status === activeTab)
          .map((request) => (
            <div key={request.id} style={commonStyles.requestCard}>
              <div style={commonStyles.requestHeader}>
                <span>{request.id}</span>
                <span style={commonStyles.status(request.status)}>{request.status}</span>
              </div>
              <div>送出時間: {request.submitTime}</div>
              <div>加班時間起迄: {request.startTime} ~ {request.endTime}</div>
              <div>加班總時數: {request.totalTime}</div>
            </div>
          ))}
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
  handleHomeClick
}) => {
  // 補卡申請資料
  const cardReplenishRequests = [
    {
      id: "C2409080001",
      status: "已通過",
      submitTime: "2024-09-08 09:15",
      replenishDate: "2024-09-07",
      replenishTime: "09:00",
      reason: "忘記打卡",
    },
    {
      id: "C2409010002",
      status: "未通過",
      submitTime: "2024-09-01 17:30",
      replenishDate: "2024-08-31",
      replenishTime: "18:00",
      reason: "加班忘記打卡",
    },
    {
      id: "C2408250003",
      status: "簽核中",
      submitTime: "2024-08-25 10:20",
      replenishDate: "2024-08-24",
      replenishTime: "08:30",
      reason: "卡片故障",
    },
  ];

  const tabs = ["總覽", "簽核中", "已通過", "未通過"];

  return (
    <>
      <Header title="補卡" currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 返回連結 - 確保這裡的點擊事件正確 */}
      <div 
        style={commonStyles.backLink} 
        onClick={() => {
          if (handleBackToAuditSystem) handleBackToAuditSystem();
        }}
      >
        ← 返回簽核系統
      </div>
      
      <TabContainer activeTab={activeTab} tabs={tabs} handleTabClick={handleTabClick} />

      <div style={commonStyles.contentContainer}>
        {cardReplenishRequests
          .filter((request) => activeTab === "總覽" || request.status === activeTab)
          .map((request) => (
            <div key={request.id} style={commonStyles.requestCard}>
              <div style={commonStyles.requestHeader}>
                <span>{request.id}</span>
                <span style={commonStyles.status(request.status)}>{request.status}</span>
              </div>
              <div>送出時間: {request.submitTime}</div>
              <div>補卡日期: {request.replenishDate}</div>
              <div>補卡時間: {request.replenishTime}</div>
              <div>補卡原因: {request.reason}</div>
            </div>
          ))}
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
  handleHomeClick
}) => {
  // 請假申請資料
  const leaveRequests = [
    {
      id: "L2409120001",
      status: "已通過",
      submitTime: "2024-09-12 14:30",
      leaveType: "事假",
      startTime: "2024-09-15 09:00",
      endTime: "2024-09-15 18:00",
      totalDays: "1天",
    },
    {
      id: "L2408280002",
      status: "未通過",
      submitTime: "2024-08-28 10:45",
      leaveType: "病假",
      startTime: "2024-08-29 09:00",
      endTime: "2024-08-30 18:00",
      totalDays: "2天",
    },
    {
      id: "L2408150003",
      status: "簽核中",
      submitTime: "2024-08-15 16:20",
      leaveType: "特休",
      startTime: "2024-08-20 09:00",
      endTime: "2024-08-22 18:00",
      totalDays: "3天",
    },
  ];

  const tabs = ["總覽", "簽核中", "已通過", "未通過"];

  return (
    <>
      <Header title="請假" currentTime={currentTime} handleHomeClick={handleHomeClick} />
      
      {/* 返回連結 - 確保這裡的點擊事件正確 */}
      <div 
        style={commonStyles.backLink} 
        onClick={() => {
          if (handleBackToAuditSystem) handleBackToAuditSystem();
        }}
      >
        ← 返回簽核系統
      </div>
      
      <TabContainer activeTab={activeTab} tabs={tabs} handleTabClick={handleTabClick} />

      <div style={commonStyles.contentContainer}>
        {leaveRequests
          .filter((request) => activeTab === "總覽" || request.status === activeTab)
          .map((request) => (
            <div key={request.id} style={commonStyles.requestCard}>
              <div style={commonStyles.requestHeader}>
                <span>{request.id}</span>
                <span style={commonStyles.status(request.status)}>{request.status}</span>
              </div>
              <div>送出時間: {request.submitTime}</div>
              <div>假別: {request.leaveType}</div>
              <div>請假時間起迄: {request.startTime} ~ {request.endTime}</div>
              <div>請假總天數: {request.totalDays}</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default {
  OvertimeContent,
  CardReplenishContent,
  LeaveContent
};
