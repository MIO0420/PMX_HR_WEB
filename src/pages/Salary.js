import React, { useState, useEffect } from 'react';

function Salary() {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);

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
      width: '360px', // 調整為與參考版面相同的寬度
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
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
    menuContainer: {
      padding: '10px', // 調整與參考版面相符
      display: 'flex',
      flexDirection: 'column',
      gap: '10px', // 減少間距與參考版面相符
      flexGrow: 1,
      overflowY: 'auto',
    },
    menuItem: {
      backgroundColor: '#e5f0fc',
      borderRadius: '5px', // 調整圓角與參考版面相符
      padding: '10px', // 調整內邊距與參考版面相符
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      height: '40px', // 調整高度與參考版面相符
    },
    menuText: {
      fontSize: '16px',
      color: '#3a75b5',
      fontWeight: '500',
    },
    detailsContainer: {
      padding: '10px', // 調整與參考版面相符
      margin: '10px', // 調整與參考版面相符
      border: '1px solid #e0e0e0', // 調整邊框顏色與參考版面相符
      borderRadius: '5px', // 調整圓角與參考版面相符
      backgroundColor: '#f9f9f9',
    },
    detailItem: {
      marginBottom: '8px',
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
      fontSize: '14px',
      borderBottom: '1px solid #e0e0e0', // 調整邊框顏色與參考版面相符
      paddingBottom: '4px',
      color: '#3a75b5',
    },
    earningsAmount: {
      color: 'green',
    },
    deductionsAmount: {
      color: 'red',
    },
    employerTotal: {
      color: 'purple',
    },
    netPay: {
      marginTop: '8px',
      padding: '10px', // 調整內邊距與參考版面相符
      backgroundColor: '#e5f0fc',
      borderRadius: '5px', // 調整圓角與參考版面相符
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    confirmButton: {
      marginTop: '10px', // 調整與參考版面相符
      padding: '10px', // 調整內邊距與參考版面相符
      backgroundColor: '#3a75b5',
      color: 'white',
      borderRadius: '5px', // 調整圓角與參考版面相符
      textAlign: 'center',
      cursor: 'pointer',
      fontWeight: 'bold', // 與參考版面相符
    },
    noRecordsMessage: {
      fontSize: '16px', // 調整字體大小與參考版面相符
      color: '#9E9E9E',
      textAlign: 'center',
      marginTop: '20px',
    },
  };

  const salaryRecords = [
    // 如果此陣列為空，則顯示「目前無薪資記錄」
    // '2024年9月薪資單',
    // '2024年8月薪資單',
    // '2024年7月薪資單',
    // '2024年6月薪資單',
    // '2024年5月薪資單',
    // '2024年4月薪資單',
    // '2024年3月薪資單',
    // '2024年2月薪資單',
    // '2024年1月薪資單',
    // '2024年12月薪資單',
  ];

  const salaryDetails = {
    '2024年9月薪資單': {
      earnings: [
        { item: '本薪', amount: '28,000' },
        { item: '伙食津貼', amount: '5,000' },
        { item: '平日加班費', amount: '5,000' },
      ],
      earningsTotal: '38,000',
      deductions: [
        { item: '事假', amount: '2,000' },
        { item: '勞保費-勞工自負額', amount: '390' },
        { item: '健保費-勞工自負額', amount: '700' },
        { item: '勞工自願繳退休金', amount: '1,000' },
      ],
      deductionsTotal: '4,090',
      employerContributions: [
        { item: '勞保費', amount: '1,941' },
        { item: '健保費', amount: '1,329' },
        { item: '勞退金', amount: '1,386' },
      ],
      employerTotal: '4,656',
      netPay: '33,910',
    },
    // 其他月份的詳細資訊
  };

  const handleMenuItemClick = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        {/* 頁面標題與時間 */}
        <header style={styles.header}>
          <div style={styles.homeIcon}>
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
          <div style={styles.pageTitle}>薪資紀錄</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        {/* 薪資單列表或詳細資訊 */}
        {selectedMonth ? (
          <div style={styles.detailsContainer}>
            <h3>{selectedMonth}</h3>
            <div style={styles.detailItem}>
              <div style={styles.sectionTitle}>應發項目</div>
              {salaryDetails[selectedMonth].earnings.map((item, index) => (
                <div key={index}>{item.item}: <span style={styles.earningsAmount}>{item.amount}</span></div>
              ))}
              <div>應發合計(A): <span style={styles.earningsAmount}>{salaryDetails[selectedMonth].earningsTotal}</span></div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.sectionTitle}>應減項目</div>
              {salaryDetails[selectedMonth].deductions.map((item, index) => (
                <div key={index}>{item.item}: <span style={styles.deductionsAmount}>{item.amount}</span></div>
              ))}
              <div>應減合計(B): <span style={styles.deductionsAmount}>{salaryDetails[selectedMonth].deductionsTotal}</span></div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.sectionTitle}>雇主負擔（不計入）</div>
              {salaryDetails[selectedMonth].employerContributions.map((item, index) => (
                <div key={index}>{item.item}: <span style={styles.employerTotal}>{item.amount}</span></div>
              ))}
              <div>合計: <span style={styles.employerTotal}>{salaryDetails[selectedMonth].employerTotal}</span></div>
            </div>
            <div style={styles.netPay}>
              實發金額(A-B): {salaryDetails[selectedMonth].netPay}
            </div>
            <div style={styles.confirmButton} onClick={() => setSelectedMonth(null)}>
              確認並返回
            </div>
          </div>
        ) : (
          <div style={styles.menuContainer}>
            {salaryRecords.length === 0 ? (
              <div style={styles.noRecordsMessage}>目前無薪資記錄</div>
            ) : (
              salaryRecords.map((record, index) => (
                <div key={index} style={styles.menuItem} onClick={() => handleMenuItemClick(record)}>
                  <div style={styles.menuText}>{record}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Salary;
