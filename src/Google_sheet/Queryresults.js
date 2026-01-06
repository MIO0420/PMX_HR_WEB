// 修改 QueryResults 組件
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';

const QueryResults = () => {
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [queryInfo, setQueryInfo] = useState(null);

  const API_URL = 'https://rabbit.54ucl.com:3004/api/queryresults';

  const handleQuery = async () => {
    // 驗證輸入
    if (!companyId || !employeeId || !startDate || !endDate) {
      setError('所有欄位都必須填寫');
      setShowError(true);
      return;
    }

    // 驗證日期範圍
    if (new Date(endDate) < new Date(startDate)) {
      setError('結束日期不能早於開始日期');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(API_URL, {
        company_id: companyId,
        employee_id: employeeId,
        startDate: startDate,
        endDate: endDate
      });

      if (response.data.Status === 'Ok') {
        setRecords(response.data.Data.records);
        setQueryInfo({
          companyId: response.data.Data.company_id,
          employeeId: response.data.Data.employee_id,
          startDate: startDate,
          endDate: endDate,
          totalRecords: response.data.Data.records.length
        });
        setPage(0); // 重置分頁
      } else {
        setError('查詢失敗: ' + response.data.Msg);
        setShowError(true);
      }
    } catch (err) {
      console.error('API請求錯誤:', err);
      setError('查詢出錯: ' + (err.response?.data?.Msg || err.message));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  // 將經緯度轉換為可讀地址的函數
  const formatLocation = (longitude, latitude) => {
    if (!longitude || !latitude) return '無位置資訊';
    return `${longitude}, ${latitude}`;
  };

  // 格式化時間
  const formatTime = (timeString) => {
    if (!timeString) return '無記錄';
    return timeString;
  };

  // 計算總頁數
  const totalPages = Math.ceil(records.length / rowsPerPage);

  // 內聯樣式
  const styles = {
    queryContainer: {
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '0 15px',
    },
    queryPanel: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '5px',
      fontWeight: '500',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    queryButton: {
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '120px',
      justifyContent: 'center',
    },
    queryButtonDisabled: {
      backgroundColor: '#b0bec5',
      cursor: 'not-allowed',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    errorCloseButton: {
      background: 'none',
      border: 'none',
      color: '#d32f2f',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    queryInfo: {
      backgroundColor: '#e3f2fd',
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '20px',
    },
    tableContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'auto',  // 改為 auto，允許滾動
      maxHeight: '60vh',  // 限制最大高度，確保可以滾動
    },
    dataTable: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      padding: '12px 16px',
      textAlign: 'left',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f5f5f5',
      fontWeight: '600',
      position: 'sticky',  // 讓表頭固定
      top: 0,  // 固定在頂部
      zIndex: 1,  // 確保在內容上方
    },
    tableCell: {
      padding: '12px 16px',
      textAlign: 'left',
      borderBottom: '1px solid #eee',
    },
    tableRow: {
      ':hover': {
        backgroundColor: '#f9f9f9',
      },
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderTop: '1px solid #eee',
      backgroundColor: '#fff',  // 確保分頁區域有背景色
      position: 'sticky',  // 固定分頁控制器
      bottom: 0,  // 固定在底部
    },
    rowsPerPage: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    rowsPerPageSelect: {
      padding: '6px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    pageControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pageButton: {
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '6px 12px',
      cursor: 'pointer',
    },
    pageButtonDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#bdbdbd',
      cursor: 'not-allowed',
    },
    pageInfo: {
      margin: '0 8px',
    },
    noData: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      textAlign: 'center',
      color: '#757575',
    },
  };

  return (
    <div style={styles.queryContainer}>
      <div style={styles.queryPanel}>
        <h2>打卡記錄查詢</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="companyId">公司ID</label>
            <input
              id="companyId"
              type="text"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="employeeId">員工ID</label>
            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="startDate">開始日期</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="endDate">結束日期</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        </div>
        
        <button 
          style={{
            ...styles.queryButton,
            ...(loading ? styles.queryButtonDisabled : {})
          }}
          onClick={handleQuery}
          disabled={loading}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <>
              <FontAwesomeIcon icon={faSearch} /> 查詢
            </>
          )}
        </button>
      </div>

      {showError && (
        <div style={styles.errorMessage}>
          <p>{error}</p>
          <button style={styles.errorCloseButton} onClick={handleCloseError}>關閉</button>
        </div>
      )}

      {queryInfo && (
        <div style={styles.queryInfo}>
          <p>
            查詢結果：公司ID: {queryInfo.companyId} | 員工ID: {queryInfo.employeeId} | 
            期間: {queryInfo.startDate} 至 {queryInfo.endDate} | 共 {queryInfo.totalRecords} 筆記錄
          </p>
        </div>
      )}

      {records.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.dataTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>序號</th>
                <th style={styles.tableHeader}>打卡日期</th>
                <th style={styles.tableHeader}>打卡時間</th>
                <th style={styles.tableHeader}>退卡時間</th>
                {/* 移除工作時長欄位 */}
                <th style={styles.tableHeader}>網路</th>
                <th style={styles.tableHeader}>IP位址</th>
                <th style={styles.tableHeader}>位置</th>
              </tr>
            </thead>
            <tbody>
              {records
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{page * rowsPerPage + index + 1}</td>
                    <td style={styles.tableCell}>{record.checkInTime ? record.checkInTime.split(' ')[0] : '無記錄'}</td>
                    <td style={styles.tableCell}>{formatTime(record.checkInTime ? record.checkInTime.split(' ')[1] : null)}</td>
                    <td style={styles.tableCell}>{formatTime(record.checkOutTime ? record.checkOutTime.split(' ')[1] : null)}</td>
                    {/* 移除工作時長欄位 */}
                    <td style={styles.tableCell}>{record.ssid || '無網路資訊'}</td>
                    <td style={styles.tableCell}>{record.publicIp || '無IP資訊'}</td>
                    <td style={styles.tableCell}>{formatLocation(record.longitude, record.latitude)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          <div style={styles.pagination}>
            <div style={styles.rowsPerPage}>
              <label>每頁行數:</label>
              <select 
                value={rowsPerPage} 
                onChange={handleChangeRowsPerPage}
                style={styles.rowsPerPageSelect}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div style={styles.pageControls}>
              <button 
                style={{
                  ...styles.pageButton,
                  ...(page === 0 ? styles.pageButtonDisabled : {})
                }}
                onClick={() => handleChangePage(0)} 
                disabled={page === 0}
              >
                首頁
              </button>
              <button 
                style={{
                  ...styles.pageButton,
                  ...(page === 0 ? styles.pageButtonDisabled : {})
                }}
                onClick={() => handleChangePage(page - 1)} 
                disabled={page === 0}
              >
                上一頁
              </button>
              <span style={styles.pageInfo}>
                {page + 1} / {totalPages}
              </span>
              <button 
                style={{
                  ...styles.pageButton,
                  ...(page >= totalPages - 1 ? styles.pageButtonDisabled : {})
                }}
                onClick={() => handleChangePage(page + 1)} 
                disabled={page >= totalPages - 1}
              >
                下一頁
              </button>
              <button 
                style={{
                  ...styles.pageButton,
                  ...(page >= totalPages - 1 ? styles.pageButtonDisabled : {})
                }}
                onClick={() => handleChangePage(totalPages - 1)} 
                disabled={page >= totalPages - 1}
              >
                末頁
              </button>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div style={styles.noData}>
            <p>尚無查詢結果，請輸入查詢條件並點擊查詢按鈕</p>
          </div>
        )
      )}
    </div>
  );
};

export default QueryResults;
