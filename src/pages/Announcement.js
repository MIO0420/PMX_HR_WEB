import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Announcement() {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedTab, setSelectedTab] = useState('總覽');
  const [currentPage, setCurrentPage] = useState(1);
  const [isApp, setIsApp] = useState(false);
  const announcementsPerPage = 5;
  const navigate = useNavigate();

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
      border: '1px solid #ddd',
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
    tabContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f5f7fa',
    },
    tab: {
      flex: 1,
      padding: '10px 0',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      border: '1px solid #ddd',
      margin: '0 5px',
      borderRadius: '5px',
    },
    activeTab: {
      backgroundColor: '#3a75b5',
      color: 'white',
      fontWeight: 'bold',
    },
    inactiveTab: {
      backgroundColor: 'white',
      color: '#3a75b5',
    },
    announcementList: {
      padding: '10px',
      flexGrow: 1,
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '5px',
      margin: '10px',
    },
    announcementItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #ddd',
      position: 'relative',
    },
    announcementText: {
      fontSize: '14px',
      color: '#3a75b5',
    },
    announcementDate: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      color: '#9E9E9E',
    },
    redDot: {
      width: '6px',
      height: '6px',
      backgroundColor: '#F44336',
      borderRadius: '50%',
      position: 'absolute',
      top: '10px',
      left: '-10px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0',
      alignItems: 'center',
    },
    pageButton: {
      margin: '0 5px',
      cursor: 'pointer',
      color: '#3a75b5',
      transition: 'background-color 0.3s',
      padding: '3px 6px',
      borderRadius: '50%',
      fontSize: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activePageButton: {
      backgroundColor: '#b0c4de',
      color: 'white',
    },
    inactivePageButton: {
      backgroundColor: 'transparent',
    },
    arrowButton: {
      cursor: 'pointer',
      color: '#3a75b5',
      padding: '3px 6px',
      fontSize: '12px',
    },
    disabledArrowButton: {
      color: '#9E9E9E',
    },
  };

  const allAnnouncements = [
    { title: '中秋節聚餐通知(更正)', date: '2024-09-01', unread: true },
    { title: '中秋節聚餐通知', date: '2024-09-01', unread: false },
    { title: '2024年表揚大會取消通知', date: '2024-08-31', unread: false },
    { title: '薪資調整通知', date: '2024-07-01', unread: true },
    { title: '新進員工通知', date: '2024-05-28', unread: false },
    { title: '員工調職公告', date: '2024-04-12', unread: false },
    { title: '配合疫情班次調整公告', date: '2023-05-31', unread: false },
  ];

  const unreadAnnouncements = allAnnouncements.filter(a => a.unread);
  const readAnnouncements = allAnnouncements.filter(a => !a.unread);

  const getAnnouncements = () => {
    switch (selectedTab) {
      case '未讀':
        return unreadAnnouncements;
      case '已讀':
        return readAnnouncements;
      default:
        return allAnnouncements;
    }
  };

  const totalPages = Math.ceil(getAnnouncements().length / announcementsPerPage);
  const currentAnnouncements = getAnnouncements().slice(
    (currentPage - 1) * announcementsPerPage,
    currentPage * announcementsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
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
          <div style={styles.pageTitle}>公告</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        <div style={styles.tabContainer}>
          {['總覽', '未讀', '已讀'].map((tab) => (
            <div
              key={tab}
              style={{
                ...styles.tab,
                ...(selectedTab === tab ? styles.activeTab : styles.inactiveTab),
              }}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <div style={styles.announcementList}>
          {currentAnnouncements.map((announcement, index) => (
            <div key={index} style={styles.announcementItem}>
              {announcement.unread && <div style={styles.redDot} />}
              <div style={styles.announcementText}>{announcement.title}</div>
              <div style={styles.announcementDate}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} />
                {announcement.date}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.pagination}>
          <span
            style={currentPage === 1 ? styles.disabledArrowButton : styles.arrowButton}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            {'<<'}
          </span>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <span
              key={page}
              style={{
                ...styles.pageButton,
                ...(currentPage === page ? styles.activePageButton : styles.inactivePageButton),
              }}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </span>
          ))}
          <span
            style={currentPage === totalPages ? styles.disabledArrowButton : styles.arrowButton}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          >
            {'>>'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Announcement;
