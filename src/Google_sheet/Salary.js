import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';

function SalaryPage() {
  const navigate = useNavigate();
  const { companyId, employeeId } = useEmployee();
  const [currentTime, setCurrentTime] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [salaryDetails, setSalaryDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sheetInfo, setSheetInfo] = useState(null);

  // API相關設定
  const API_KEY = "AIzaSyCw_go3b8DH1jfTmPCdKTesVW-b6vw9DkM";
  const MASTER_SHEET_ID = "1ziiWMZ_tSMO1-0PttLLymdtroT5UeLxW0rZwmr_NQZo"; // 總表 ID
  const MASTER_RANGE = "總表"; // 總表範圍
  const SHEET_NAME = "薪資單";

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

  // 獲取公司對應的表單資訊
  useEffect(() => {
    if (companyId) {
      fetchSheetInfo();
    }
    // eslint-disable-next-line
  }, [companyId]);

  // 獲取薪資數據
  useEffect(() => {
    if (sheetInfo) {
      fetchSalaryData();
    }
    // eslint-disable-next-line
  }, [sheetInfo, employeeId]);

  // 使用模擬數據（開發環境使用）
  const loadMockData = () => {
    console.log('使用模擬數據');
    const mockData = [
      { 
        company_id: companyId || 'ncku', 
        employee_id: employeeId || '123', 
        year: '2025', 
        month: '1',
        basic_salary: '28000',
        meal_allowance: '5000',
        regular_overtime_pay: '5000',
        total_earnings_a: '38000',
        personal_leave: '2000',
        labor_insurance_employee_share: '0',
        health_insurance_employee_share: '390',
        voluntary_retirement_contribution: '0',
        total_deductions_b: '390',
        labor_insurance: '700',
        health_insurance: '1000',
        retirement_fund: '4090',
        total: '1941',
        actual_amount_paid: '1329',
        remittance_amount: '1386'
      },
      { 
        company_id: companyId || 'ncku', 
        employee_id: employeeId || '123', 
        year: '2025', 
        month: '2',
        basic_salary: '28000',
        meal_allowance: '5000',
        regular_overtime_pay: '0',
        total_earnings_a: '33000',
        personal_leave: '0',
        labor_insurance_employee_share: '0',
        health_insurance_employee_share: '390',
        voluntary_retirement_contribution: '0',
        total_deductions_b: '390',
        labor_insurance: '700',
        health_insurance: '1000',
        retirement_fund: '4090',
        total: '1941',
        actual_amount_paid: '32610',
        remittance_amount: '32610'
      }
    ];
    
    processEmployeeRecords(mockData);
    setIsLoading(false);
  };

  // 從總表獲取公司對應的表單資訊
  const fetchSheetInfo = async () => {
    if (!companyId) {
      setError('找不到公司資料，請重新登入');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // 構建 Google Sheets API URL 查詢總表
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/${MASTER_RANGE}?key=${API_KEY}`;
      
      console.log('正在從總表獲取公司表單資訊...');
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        console.log('總表中沒有找到資料');
        setError('無法獲取公司表單資訊');
        return;
      }
      
      // 尋找匹配的公司ID
      const companyRow = data.values.find(row => 
        row[0] && row[0].toLowerCase() === companyId.toLowerCase()
      );
      
      if (!companyRow || !companyRow[1]) {
        console.error(`找不到公司 ${companyId} 的表單資訊`);
        setError(`找不到公司 ${companyId} 的表單資訊`);
        return;
      }
      
      const sheetId = companyRow[1];
      console.log(`找到公司 ${companyId} 的表單 ID: ${sheetId}`);
      
      setSheetInfo({
        id: sheetId,
        sheetName: SHEET_NAME
      });
      
    } catch (err) {
      console.error('獲取公司表單資訊失敗:', err);
      setError(`獲取公司表單資訊失敗: ${err.message}`);
      
      // 如果是開發環境，使用模擬數據
      if (process.env.NODE_ENV === 'development') {
        loadMockData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 從Google Sheet獲取薪資數據
  const fetchSalaryData = async () => {
    if (!companyId || !employeeId) {
      setError('找不到員工資料，請重新登入');
      
      // 如果是開發環境，使用模擬數據
      if (process.env.NODE_ENV === 'development') {
        loadMockData();
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const SHEET_ID = sheetInfo.id;
      const sheetName = sheetInfo.sheetName;
      
      // 設定查詢範圍 (獲取整個表單)
      const RANGE = `${sheetName}!A:Z`;
      
      // 構建 Google Sheets API URL
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      
      console.log('正在從 Google Sheets 獲取薪資資料...');
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        console.log('沒有找到薪資資料');
        setError('無薪資記錄');
        return;
      }
      
      console.log(`成功獲取 ${data.values.length} 筆資料`);
      processSalaryData(data.values);
      
    } catch (err) {
      console.error('獲取薪資數據失敗:', err);
      setError(`資料讀取失敗: ${err.message}`);
      
      // 如果是開發環境，使用模擬數據
      if (process.env.NODE_ENV === 'development') {
        loadMockData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 處理從Google Sheet獲取的薪資數據
  const processSalaryData = (records) => {
    try {
      console.log('處理薪資記錄...');
      
      // 獲取表頭行
      const headers = records[0].map(header => 
        header.toLowerCase().replace(/[()]/g, '').replace(/[-\s]/g, '_')
      );
      
      // 轉換數據為物件陣列
      const parsedData = records.slice(1).map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });
        return rowData;
      });
      
      // 過濾出當前員工的薪資記錄
      const employeeRecords = parsedData
        .filter(row => {
          const rowCompanyId = (row.company_id || '').trim();
          const rowEmployeeId = (row.employee_id || '').trim();
          return rowCompanyId === companyId && rowEmployeeId === employeeId;
        })
        .map(row => ({
          company_id: row.company_id,
          employee_id: row.employee_id,
          year: row.year,
          month: row.month,
          basic_salary: row.basic_salary,
          meal_allowance: row.meal_allowance,
          regular_overtime_pay: row.regular_overtime_pay,
          total_earnings_a: row.total_earnings_a,
          personal_leave: row.personal_leave,
          labor_insurance_employee_share: row.labor_insurance_employee_share,
          health_insurance_employee_share: row.health_insurance_employee_share,
          voluntary_retirement_contribution: row.voluntary_retirement_contribution,
          total_deductions_b: row.total_deductions_b,
          labor_insurance: row.labor_insurance,
          health_insurance: row.health_insurance,
          retirement_fund: row.retirement_fund,
          total: row.total,
          actual_amount_paid: row.actual_amount_paid,
          remittance_amount: row.remittance_amount
        }));
      
      console.log(`找到 ${employeeRecords.length} 筆符合條件的薪資記錄`);
      
      if (employeeRecords.length === 0) {
        setError('無薪資記錄');
      }
      
      processEmployeeRecords(employeeRecords);
    } catch (err) {
      console.error('處理薪資記錄時出錯:', err);
      setError(`處理薪資記錄時出錯: ${err.message}`);
      
      // 如果是開發環境，使用模擬數據
      if (process.env.NODE_ENV === 'development') {
        loadMockData();
      }
    }
  };

  // 處理員工薪資記錄
  const processEmployeeRecords = (employeeRecords) => {
    const records = [];
    const details = {};
    
    employeeRecords.forEach(record => {
      const recordKey = `${record.year}年${record.month}月薪資單`;
      
      records.push(recordKey);
      
      // 計算正確的總收入
      const basicSalary = Number(record.basic_salary || 0);
      const mealAllowance = Number(record.meal_allowance || 0);
      const regularOvertimePay = Number(record.regular_overtime_pay || 0);
      const calculatedTotalEarnings = basicSalary + mealAllowance + regularOvertimePay;
      
      // 計算正確的總扣除額
      const personalLeave = Number(record.personal_leave || 0);
      const laborInsuranceEmployeeShare = Number(record.labor_insurance_employee_share || 0);
      const healthInsuranceEmployeeShare = Number(record.health_insurance_employee_share || 0);
      const voluntaryRetirementContribution = Number(record.voluntary_retirement_contribution || 0);
      const calculatedTotalDeductions = personalLeave + laborInsuranceEmployeeShare + healthInsuranceEmployeeShare + voluntaryRetirementContribution;
      
      // 計算正確的實發金額
      const calculatedActualAmountPaid = calculatedTotalEarnings - calculatedTotalDeductions;
      
      details[recordKey] = {
        company_id: record.company_id,
        employee_id: record.employee_id,
        year: record.year,
        month: record.month,
        earnings: [
          { item: '本薪', amount: formatCurrency(record.basic_salary || '0') },
          { item: '伙食津貼', amount: formatCurrency(record.meal_allowance || '0') },
          { item: '平日加班費', amount: formatCurrency(record.regular_overtime_pay || '0') }
        ],
        earningsTotal: formatCurrency(calculatedTotalEarnings.toString()),
        deductions: [
          { item: '事假', amount: formatCurrency(record.personal_leave || '0') },
          { item: '勞保費-勞工自負額', amount: formatCurrency(record.labor_insurance_employee_share || '0') },
          { item: '健保費-勞工自負額', amount: formatCurrency(record.health_insurance_employee_share || '0') },
          { item: '勞工自願繳退休金', amount: formatCurrency(record.voluntary_retirement_contribution || '0') }
        ],
        deductionsTotal: formatCurrency(calculatedTotalDeductions.toString()),
        employerContributions: [
          { item: '勞保費', amount: formatCurrency(record.labor_insurance || '0') },
          { item: '健保費', amount: formatCurrency(record.health_insurance || '0') },
          { item: '勞退金', amount: formatCurrency(record.retirement_fund || '0') }
        ],
        employerTotal: formatCurrency(record.total || '0'),
        netPay: formatCurrency(calculatedActualAmountPaid.toString()),
        remittanceAmount: formatCurrency(record.remittance_amount || calculatedActualAmountPaid.toString())
      };
    });
    
    // 按照年月排序
    records.sort((a, b) => {
      const yearA = parseInt(a.match(/(\d+)年/)[1]);
      const monthA = parseInt(a.match(/(\d+)月/)[1]);
      const yearB = parseInt(b.match(/(\d+)年/)[1]);
      const monthB = parseInt(b.match(/(\d+)月/)[1]);
      
      if (yearA !== yearB) {
        return yearB - yearA; // 年份降序
      }
      return monthB - monthA; // 月份降序
    });
    
    setSalaryRecords(records);
    setSalaryDetails(details);
  };

  // 格式化貨幣數字
  const formatCurrency = (value) => {
    if (!value) return '0';
    // 移除任何非數字字符（除了小數點）
    const numericValue = value.toString().replace(/[^\d.]/g, '');
    return new Intl.NumberFormat('zh-TW').format(Number(numericValue));
  };

  const handleMenuItemClick = (month) => {
    setSelectedMonth(month);
  };

  const handleHomeClick = () => {
    navigate('/frontpage01');
  };

  // 重試功能
  const handleRetry = () => {
    setError(null);
    if (!sheetInfo) {
      fetchSheetInfo();
    } else {
      fetchSalaryData();
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
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      flexGrow: 1,
      overflowY: 'auto',
    },
    menuItem: {
      backgroundColor: '#ffffff',
      borderRadius: '5px',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
    },
    menuText: {
      fontSize: '16px',
      color: '#333333',
      fontWeight: '500',
    },
    detailsContainer: {
      padding: '15px',
      margin: '10px',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 70px)',
    },
    employeeInfoContainer: {
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#e5f0fc',
      borderRadius: '5px',
    },
    employeeInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    employeeInfoLabel: {
      fontWeight: 'bold',
      color: '#3a75b5',
    },
    detailItem: {
      marginBottom: '12px',
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
      fontSize: '14px',
      borderBottom: '1px solid #e0e0e0',
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
      padding: '10px',
      backgroundColor: '#e5f0fc',
      borderRadius: '5px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    confirmButton: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#3a75b5',
      color: 'white',
      borderRadius: '5px',
      textAlign: 'center',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    noRecordsMessage: {
      fontSize: '16px',
      color: '#9E9E9E',
      textAlign: 'center',
      marginTop: '20px',
    },
    loadingMessage: {
      fontSize: '16px',
      color: '#3a75b5',
      textAlign: 'center',
      marginTop: '20px',
    },
    errorText: {
      textAlign: 'center',
      padding: '20px',
      color: 'red',
    },
    retryButton: {
      padding: '8px 16px',
      fontSize: '14px',
      backgroundColor: '#3a75b5',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '10px auto',
      display: 'block',
    },
    remittanceInfo: {
      marginTop: '10px',
      padding: '8px',
      backgroundColor: '#f0f8ff',
      borderRadius: '5px',
      fontSize: '14px',
      color: 'green',
      fontWeight: 'bold',
    },
    apiInfo: {
      padding: '5px 10px',
      backgroundColor: '#f0f8ff',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
    },
    userInfo: {
      padding: '5px 10px',
      backgroundColor: '#f8fff0',
      fontSize: '12px',
      color: '#666',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
    }
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
          <div style={styles.pageTitle}>薪資紀錄</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        {/* 開發資訊 */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <div style={styles.userInfo}>
              使用者資訊: 公司 {companyId || '未登入'}, 員工 {employeeId || '未登入'}
            </div>
            <div style={styles.apiInfo}>
              查詢表單: {sheetInfo ? `${sheetInfo.id}/${sheetInfo.sheetName}` : '尚未獲取'}
            </div>
          </>
        )}

        {/* 薪資單列表或詳細資訊 */}
        {isLoading ? (
          <div style={styles.loadingMessage}>載入中...</div>
        ) : error && !salaryRecords.length ? (
          <div style={styles.errorText}>
            {error}
            <button style={styles.retryButton} onClick={handleRetry}>
              重新嘗試連接
            </button>
          </div>
        ) : selectedMonth ? (
          <div style={styles.detailsContainer}>
            <h3>{selectedMonth}</h3>
            
            {/* 員工基本資訊 */}
            <div style={styles.employeeInfoContainer}>
              <div style={styles.employeeInfoRow}>
                <span style={styles.employeeInfoLabel}>年份:</span>
                <span>{salaryDetails[selectedMonth]?.year || '-'}</span>
              </div>
              <div style={styles.employeeInfoRow}>
                <span style={styles.employeeInfoLabel}>月份:</span>
                <span>{salaryDetails[selectedMonth]?.month || '-'}</span>
              </div>
            </div>
            
            {/* 薪資明細 */}
            <div style={styles.detailItem}>
              <div style={styles.sectionTitle}>應發項目</div>
              {salaryDetails[selectedMonth]?.earnings.map((item, index) => (
                <div key={index}>{item.item}: <span style={styles.earningsAmount}>{item.amount}</span></div>
              ))}
              <div>應發合計(A): <span style={styles.earningsAmount}>{salaryDetails[selectedMonth]?.earningsTotal}</span></div>
            </div>
            
            <div style={styles.detailItem}>
              <div style={styles.sectionTitle}>應減項目</div>
              {salaryDetails[selectedMonth]?.deductions.map((item, index) => (
                <div key={index}>{item.item}: <span style={styles.deductionsAmount}>{item.amount}</span></div>
              ))}
              <div>應減合計(B): <span style={styles.deductionsAmount}>{salaryDetails[selectedMonth]?.deductionsTotal}</span></div>
            </div>
            
            <div style={styles.detailItem}>
              <div style={styles.sectionTitle}>雇主負擔(不計入)</div>
              {salaryDetails[selectedMonth]?.employerContributions.map((item, index) => (
                <div key={index}>{item.item}: <span style={styles.employerTotal}>{item.amount}</span></div>
              ))}
              <div>合計: <span style={styles.employerTotal}>{salaryDetails[selectedMonth]?.employerTotal}</span></div>
            </div>
            
            <div style={styles.netPay}>
              實發金額(A-B): {salaryDetails[selectedMonth]?.netPay}
            </div>
            
            <div style={styles.remittanceInfo}>
              匯款金額: {salaryDetails[selectedMonth]?.remittanceAmount}
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

export default SalaryPage;
