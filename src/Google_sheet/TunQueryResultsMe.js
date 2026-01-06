// TunQueryResultsMe.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faFilePdf, faCalendarAlt, faBuilding, faUser } from '@fortawesome/free-solid-svg-icons';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle';

const TunQueryResultsMe = () => {
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [records, setRecords] = useState([]);
  const [processedRecords, setProcessedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [queryInfo, setQueryInfo] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  const contentRef = useRef(null);
  const API_URL = 'https://rabbit.54ucl.com:3004/api/attendance-check-in-view';

  // 設定當前日期為預設結束日期
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setEndDate(formattedDate);
    
    // 設定預設開始日期為當前月份的第一天
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0];
    setStartDate(formattedFirstDay);
  }, []);

  // 獲取星期幾
  const getWeekday = (dateString) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const date = new Date(dateString);
    return weekdays[date.getDay()];
  };

  // 將英文結果轉換為中文
  const translateResultToChinese = (result) => {
    switch (result) {
      case 'late':
        return '遲到';
      case 'ontime':
      case 'on_time':
        return '準時';
      case 'early':
        return '早到';
      case 'overtime':
      case 'over_time':
        return '加班';
      case 'early_leave':
        return '早退';
      case 'stay':
        return '滯留';
      case 'too_early':
        return '過早';
      default:
        return '';  // 如果沒有結果或未知結果，返回空字符串
    }
  };

  // 處理記錄，每天只保留最新的一筆上班和下班記錄
  const processRecords = (rawRecords) => {
    // 按日期分組
    const recordsByDate = {};
    
    // 先將記錄按日期分組
    rawRecords.forEach(record => {
      const date = record.work_date;
      if (!date) return; // 跳過沒有日期的記錄
      
      const weekday = getWeekday(date);
      
      // 初始化該日期的記錄
      if (!recordsByDate[date]) {
        recordsByDate[date] = {
          work_date: date,
          weekday: weekday,
          check_in_records: [],
          check_out_records: [],
          holiday_type: record.holiday_type || '',
          remarks: ''
        };
      }
      
      // 收集所有上班和下班記錄
      if (record.attendance_type === 'check_in' && record.work_time) {
        recordsByDate[date].check_in_records.push({
          time: record.work_time,
          result: record.result,
          timestamp: new Date(`${date}T${record.work_time}`).getTime()
        });
      }
      
      if (record.attendance_type === 'check_out' && record.get_off_work_time) {
        recordsByDate[date].check_out_records.push({
          time: record.get_off_work_time,
          result: record.result,
          timestamp: new Date(`${date}T${record.get_off_work_time}`).getTime()
        });
      }
      
      // 設置假日類型
      if (record.holiday_type) {
        recordsByDate[date].holiday_type = record.holiday_type;
      }
      
      // 設置備註
      if (record.holiday_type === '國定') {
        recordsByDate[date].remarks = '國定假日';
      }
    });
    
    // 處理每天的記錄，選擇最新的一筆上班和下班記錄
    const processedData = Object.values(recordsByDate).map(dayRecord => {
      // 按時間戳排序並選擇最新的上班記錄
      const latestCheckIn = dayRecord.check_in_records.length > 0 
        ? dayRecord.check_in_records.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null;
      
      // 按時間戳排序並選擇最新的下班記錄
      const latestCheckOut = dayRecord.check_out_records.length > 0
        ? dayRecord.check_out_records.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null;
      
      return {
        work_date: dayRecord.work_date,
        weekday: dayRecord.weekday,
        work_time: latestCheckIn ? latestCheckIn.time : null,
        work_result: latestCheckIn ? translateResultToChinese(latestCheckIn.result) : '',
        get_off_work_time: latestCheckOut ? latestCheckOut.time : null,
        get_off_work_result: latestCheckOut ? translateResultToChinese(latestCheckOut.result) : '',
        holiday_type: dayRecord.holiday_type,
        remarks: dayRecord.remarks
      };
    });
    
    // 按日期排序
    return processedData.sort((a, b) => new Date(a.work_date) - new Date(b.work_date));
  };

  const handleQuery = async () => {
    // 驗證輸入
    if (!companyId || !employeeId || !startDate || !endDate) {
      setError('所有欄位都必須填寫');
      setShowError(true);
      return;
    }

    // 驗證日期範圍
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setError('結束日期不能早於開始日期');
      setShowError(true);
      return;
    }
    
    // 驗證日期範圍不超過3個月
    const threeMonthsLater = new Date(start);
    threeMonthsLater.setMonth(start.getMonth() + 3);
    
    if (end > threeMonthsLater) {
      setError('查詢日期範圍不能超過3個月');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');
    setProcessedRecords([]);
    
    try {
      const response = await axios.get(API_URL, {
        params: {
          company_id: companyId,
          employee_id: employeeId,
          start_date: startDate,
          end_date: endDate
        },
        timeout: 30000 // 設置30秒超時
      });

      if (response.data.Status === 'Ok') {
        const rawRecords = response.data.Data.records || [];
        setRecords(rawRecords);
        
        if (rawRecords.length === 0) {
          setError('查詢期間內無打卡記錄');
          setShowError(true);
        } else {
          // 處理記錄，每天只保留最新的一筆
          const processed = processRecords(rawRecords);
          setProcessedRecords(processed);
          
          setQueryInfo({
            companyId: companyId,
            employeeId: employeeId,
            startDate: startDate,
            endDate: endDate,
            totalRecords: processed.length || 0
          });
        }
      } else {
        setError('查詢失敗: ' + (response.data.Msg || '未知錯誤'));
        setShowError(true);
      }
    } catch (err) {
      console.error('API請求錯誤:', err);
      if (err.code === 'ECONNABORTED') {
        setError('查詢超時，請稍後再試');
      } else {
        setError('查詢出錯: ' + (err.response?.data?.Msg || err.message || '未知錯誤'));
      }
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  // 格式化時間
  const formatTime = (timeString) => {
    if (!timeString) return '無記錄';
    
    // 如果時間格式為 HH:MM:SS，轉換為 HH:MM
    if (timeString.length === 8 && timeString.indexOf(':') !== -1) {
      return timeString.substring(0, 5);
    }
    
    return timeString;
  };

  // 匯出PDF功能
  const exportToPdf = () => {
    if (!queryInfo || processedRecords.length === 0) {
      setError('沒有可匯出的數據');
      setShowError(true);
      return;
    }

    setExportLoading(true);

    // 格式化日期為YYYYMMDD
    const formatDateForFilename = (dateString) => {
      return dateString.replace(/-/g, '');
    };

    // 產生檔名: 統編_員編_開始時間_結束時間
    const filename = `${companyId}_${employeeId}_${formatDateForFilename(startDate)}_${formatDateForFilename(endDate)}.pdf`;

    // 創建一個臨時的div來存放要匯出的內容
    const exportContent = document.createElement('div');
    exportContent.innerHTML = `
      <h2 style="text-align: center; margin-bottom: 20px;">打卡記錄報表</h2>
      <div style="margin-bottom: 20px;">
        <p><strong>公司ID:</strong> ${companyId}</p>
        <p><strong>員工ID:</strong> ${employeeId}</p>
        <p><strong>查詢期間:</strong> ${startDate} 至 ${endDate}</p>
        <p><strong>記錄總數:</strong> ${queryInfo.totalRecords}</p>
      </div>
    `;

    // 創建表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // 添加表頭
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">日期</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">星期</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">上班時間</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">狀態</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">下班時間</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">狀態</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">備註</th>
      </tr>
    `;
    table.appendChild(thead);

    // 添加表格內容
    const tbody = document.createElement('tbody');
    processedRecords.forEach((record) => {
      const tr = document.createElement('tr');
      
      // 獲取打卡結果的顏色
      let workResultColor = '#000000';
      let getOffWorkResultColor = '#000000';
      
      if (record.work_result === '準時') workResultColor = '#4caf50';
      else if (record.work_result === '遲到') workResultColor = '#f44336';
      
      if (record.get_off_work_result === '準時') getOffWorkResultColor = '#4caf50';
      else if (record.get_off_work_result === '早退') getOffWorkResultColor = '#ff9800';
      
      const isHoliday = record.holiday_type === '國定';
      
      tr.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px;">${record.work_date}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${record.weekday}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${isHoliday ? '國定' : formatTime(record.work_time)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; color: ${workResultColor};">${isHoliday ? '' : record.work_result}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${isHoliday ? '' : formatTime(record.get_off_work_time)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; color: ${getOffWorkResultColor};">${isHoliday ? '' : record.get_off_work_result}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${record.remarks}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    exportContent.appendChild(table);

    // 添加頁腳
    const footer = document.createElement('div');
    footer.innerHTML = `
      <p style="text-align: right; font-size: 12px;">匯出時間: ${new Date().toLocaleString()}</p>
    `;
    exportContent.appendChild(footer);

    // 使用html2pdf匯出
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().from(exportContent).set(opt).save().then(() => {
      setExportLoading(false);
    }).catch(err => {
      console.error('PDF匯出錯誤:', err);
      setError('PDF匯出失敗: ' + err.message);
      setShowError(true);
      setExportLoading(false);
    });
  };

  // 按下Enter鍵時觸發查詢
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'auto',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '0 15px 50px',
        fontFamily: 'Arial, sans-serif',
      }} ref={contentRef}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            打卡記錄查詢
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <label style={{
                marginBottom: '5px',
                fontWeight: '500',
              }} htmlFor="companyId">
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
                公司ID
              </label>
              <input
                id="companyId"
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="請輸入公司統編"
                required
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <label style={{
                marginBottom: '5px',
                fontWeight: '500',
              }} htmlFor="employeeId">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                員工ID
              </label>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="請輸入員工帳號"
                required
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <label style={{
                marginBottom: '5px',
                fontWeight: '500',
              }} htmlFor="startDate">
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                開始日期
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <label style={{
                marginBottom: '5px',
                fontWeight: '500',
              }} htmlFor="endDate">
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                結束日期
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '10px',
          }}>
            <button 
              style={{
                backgroundColor: loading ? '#b0bec5' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.3s',
              }}
              onClick={handleQuery}
              disabled={loading}
            >
              {loading ? (
                <><FontAwesomeIcon icon={faSpinner} spin /> 查詢中...</>
              ) : (
                <><FontAwesomeIcon icon={faSearch} /> 查詢</>
              )}
            </button>
          </div>
        </div>

        {showError && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <p style={{ margin: 0 }}>{error}</p>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#d32f2f',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
            }} onClick={handleCloseError}>×</button>
          </div>
        )}

        {queryInfo && (
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <p style={{ margin: 0 }}>
              <strong>查詢結果：</strong>公司ID: {queryInfo.companyId} | 員工ID: {queryInfo.employeeId} | 
              期間: {queryInfo.startDate} 至 {queryInfo.endDate} | 共 {queryInfo.totalRecords} 筆記錄
            </p>
          </div>
        )}

        {processedRecords.length > 0 ? (
          <>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
              maxHeight: '60vh',
              marginBottom: '20px',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>日期</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>星期</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>上班時間</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>狀態</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>下班時間</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>狀態</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f5f5f5',
                      fontWeight: '600',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>備註</th>
                  </tr>
                </thead>
                <tbody>
                  {processedRecords.map((record, index) => {
                    const isHoliday = record.holiday_type === '國定';
                    const isWeekend = record.weekday === '六' || record.weekday === '日';
                    
                    return (
                      <tr key={index} style={{
                        backgroundColor: isHoliday ? '#ffebee' : isWeekend ? '#fff8e1' : 'transparent',
                      }}>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                        }}>{record.work_date}</td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                          fontWeight: isWeekend ? 'bold' : 'normal',
                        }}>{record.weekday}</td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                        }}>
                          {isHoliday ? '國定' : formatTime(record.work_time)}
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                          color: record.work_result === '準時' ? '#4caf50' : 
                                record.work_result === '遲到' ? '#f44336' : 'inherit',
                          fontWeight: record.work_result === '準時' || record.work_result === '遲到' ? 'bold' : 'normal',
                        }}>
                          {isHoliday ? '' : record.work_result}
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                        }}>
                          {isHoliday ? '' : formatTime(record.get_off_work_time)}
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                          color: record.get_off_work_result === '準時' ? '#4caf50' : 
                                record.get_off_work_result === '早退' ? '#ff9800' : 'inherit',
                          fontWeight: record.get_off_work_result === '準時' || record.get_off_work_result === '早退' ? 'bold' : 'normal',
                        }}>
                          {isHoliday ? '' : record.get_off_work_result}
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          borderBottom: '1px solid #eee',
                        }}>{record.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px',
            }} id="exportPdfButton">
              <button 
                style={{
                  backgroundColor: exportLoading ? '#b0bec5' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: exportLoading || processedRecords.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onClick={exportToPdf}
                disabled={exportLoading || processedRecords.length === 0}
              >
                {exportLoading ? (
                  <><FontAwesomeIcon icon={faSpinner} spin /> 匯出中...</>
                ) : (
                  <><FontAwesomeIcon icon={faFilePdf} /> 匯出PDF</>
                )}
              </button>
            </div>
          </>
        ) : (
          !loading && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              padding: '40px',
              textAlign: 'center',
              color: '#757575',
              marginBottom: '20px',
            }}>
              <p>尚無查詢結果，請輸入查詢條件並點擊查詢按鈕</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TunQueryResultsMe;
