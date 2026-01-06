import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faFilePdf, faCalendarAlt, faBuilding, faUser, faChevronDown, faCheck, faTimes, faUsers, faClipboardList, faExclamationTriangle, faClock, faIdCard, faInfoCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle';

const TunQueryResults = React.memo(() => {
  const [companyId, setCompanyId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [records, setRecords] = useState([]);
  const [processedRecords, setProcessedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [queryInfo, setQueryInfo] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  // 員工相關狀態
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  // 申請單相關狀態（包含請假、加班、補卡）
  const [applications, setApplications] = useState({});
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [showApplicationInfo, setShowApplicationInfo] = useState(true);
  
  // 新增：申請單詳細資訊彈出視窗狀態
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  const contentRef = useRef(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const API_URL = 'https://rabbit.54ucl.com:3004/api/attendance-check-in-view';
  const EMPLOYEES_API_URL = 'https://rabbit.54ucl.com:3004/api/employees';
  const APPROVED_APPLICATIONS_API_URL = 'https://rabbit.54ucl.com:3004/api/attendance/approved-applications';

  // 使用 useMemo 優化過濾員工列表
  const filteredEmployees = useMemo(() => {
    if (!employeeSearchQuery) return employees;
    
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
      employee.employee_id.toString().includes(employeeSearchQuery) ||
      (employee.department && employee.department.toLowerCase().includes(employeeSearchQuery.toLowerCase()))
    );
  }, [employees, employeeSearchQuery]);

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

  // 點擊外部關閉下拉選單和彈出視窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowEmployeeDropdown(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowApplicationModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 當公司ID改變時，清空員工相關狀態並自動查詢員工
  useEffect(() => {
    if (companyId && companyId.length >= 8) {
      fetchEmployees();
    } else {
      setEmployees([]);
      setSelectedEmployees([]);
      setShowEmployeeDropdown(false);
    }
  }, [companyId]);

  // 查詢公司員工
  const fetchEmployees = async () => {
    if (!companyId) return;

    setLoadingEmployees(true);
    try {
      const response = await axios.post(EMPLOYEES_API_URL, {
        company_id: companyId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.Status === 'Ok') {
        const employeeData = response.data.Data || [];
        setEmployees(employeeData);
        
        if (employeeData.length === 0) {
          setError('該公司沒有找到任何員工資料');
          setShowError(true);
        }
      } else {
        setError('查詢員工失敗: ' + (response.data.Msg || '未知錯誤'));
        setShowError(true);
        setEmployees([]);
      }
    } catch (err) {
      console.error('查詢員工API錯誤:', err);
      
      let errorMessage = '查詢員工出錯: ';
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage += '請求超時，請稍後再試';
      } else if (err.response?.status === 401) {
        errorMessage += '權限不足，請檢查公司ID是否正確';
      } else if (err.response?.status === 404) {
        errorMessage += '找不到相關資料';
      } else if (err.response?.status >= 500) {
        errorMessage += '伺服器暫時無法回應，請稍後再試';
      } else if (!navigator.onLine) {
        errorMessage += '網路連線異常，請檢查網路狀態';
      } else {
        errorMessage += err.response?.data?.Msg || err.message || '未知錯誤';
      }
      
      setError(errorMessage);
      setShowError(true);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // 查詢特定日期的已核准申請單（包含請假、加班、補卡）
  const fetchApprovedApplicationsForDate = async (employeeId, date) => {
    if (!companyId || !employeeId || !date) return [];

    try {
      const response = await axios.post(APPROVED_APPLICATIONS_API_URL, {
        company_id: companyId,
        employee_id: employeeId,
        date: date
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      if (response.data.Status === 'Ok') {
        const data = response.data.Data;
        const allApplications = [];
        
        // 處理請假申請
        if (data.leave_applications && data.leave_applications.length > 0) {
          data.leave_applications.forEach(app => {
            allApplications.push({
              ...app,
              category: 'leave'
            });
          });
        }
        
        // 處理加班申請
        if (data.overtime_applications && data.overtime_applications.length > 0) {
          data.overtime_applications.forEach(app => {
            allApplications.push({
              ...app,
              category: 'overtime'
            });
          });
        }
        
        // 處理補卡申請
        if (data.replenish_applications && data.replenish_applications.length > 0) {
          data.replenish_applications.forEach(app => {
            allApplications.push({
              ...app,
              category: 'makeup_card'
            });
          });
        }
        
        return allApplications;
      } else {
        console.warn(`查詢員工 ${employeeId} 在 ${date} 的申請單失敗:`, response.data.Msg);
        return [];
      }
    } catch (err) {
      console.error(`查詢員工 ${employeeId} 在 ${date} 的申請單錯誤:`, err);
      return [];
    }
  };

  // 批量查詢所有員工在查詢期間的申請單
  const fetchAllApplications = async () => {
    if (selectedEmployees.length === 0 || !startDate || !endDate) return;

    setLoadingApplications(true);
    const applicationData = {};

    try {
      // 生成日期範圍
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateRange = [];
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateRange.push(new Date(d).toISOString().split('T')[0]);
      }

      // 為每個員工查詢每一天的申請單
      for (const employee of selectedEmployees) {
        applicationData[employee.employee_id] = {};
        
        for (const date of dateRange) {
          const applications = await fetchApprovedApplicationsForDate(employee.employee_id, date);
          if (applications.length > 0) {
            applicationData[employee.employee_id][date] = applications;
          }
        }
      }
      
      setApplications(applicationData);
    } catch (err) {
      console.error('批量查詢申請單錯誤:', err);
    } finally {
      setLoadingApplications(false);
    }
  };

  // 檢查特定日期是否有申請單
  const getApplicationsForDate = (employeeId, date) => {
    const employeeApplications = applications[employeeId] || {};
    return employeeApplications[date] || [];
  };

  // 新增：顯示申請單詳細資訊
  const showApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  // 新增：關閉申請單詳細資訊彈出視窗
  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedApplication(null);
  };

  // 新增：格式化日期時間
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 新增：格式化時間（只顯示時分）
  const formatTimeOnly = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  // 新增：格式化審核狀態
  const formatStatus = (status) => {
    const statusMap = {
      'ok': '已通過',
      'pending': '待審核',
      'rejected': '已拒絕'
    };
    return statusMap[status] || status || '-';
  };

  // 格式化申請類型
  const formatApplicationCategory = (category) => {
    const categoryMap = {
      'leave': '請假',
      'overtime': '加班',
      'makeup_card': '補卡',
      'replenish_applications': '補卡',
      'business_trip': '出差',
      'training': '培訓',
      'other': '其他'
    };
    return categoryMap[category] || category || '申請';
  };

  // 格式化請假類型
  const formatLeaveType = (type) => {
    const typeMap = {
      'annual_leave': '年假',
      'sick_leave': '病假',
      'personal_leave': '事假',
      'maternity_leave': '產假',
      'paternity_leave': '陪產假',
      'funeral_leave': '喪假',
      'marriage_leave': '婚假',
      'official_leave': '公假',
      'compensatory_leave': '補休',
      'other': '其他'
    };
    return typeMap[type] || type || '請假';
  };

  // 獲取申請單圖示
  const getApplicationIcon = (category) => {
    switch (category) {
      case 'leave':
        return faExclamationTriangle;
      case 'overtime':
        return faClock;
      case 'makeup_card':
        return faIdCard;
      default:
        return faClipboardList;
    }
  };

  // 獲取申請單顏色
  const getApplicationColor = (category) => {
    switch (category) {
      case 'leave':
        return '#ff9800'; // 橘色
      case 'overtime':
        return '#2196f3'; // 藍色
      case 'makeup_card':
        return '#4caf50'; // 綠色
      default:
        return '#666';
    }
  };

  // 使用 useCallback 優化員工選擇處理函數
  const handleEmployeeToggle = useCallback((employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.some(emp => emp.employee_id === employee.employee_id);
      if (isSelected) {
        return prev.filter(emp => emp.employee_id !== employee.employee_id);
      } else {
        return [...prev, employee];
      }
    });
  }, []);

  // 使用 useCallback 優化全選功能
  const handleSelectAll = useCallback(() => {
    const allSelected = filteredEmployees.every(emp => 
      selectedEmployees.some(selected => selected.employee_id === emp.employee_id)
    );
    
    if (allSelected) {
      // 取消選中所有篩選後的員工
      setSelectedEmployees(prev => 
        prev.filter(selected => 
          !filteredEmployees.some(emp => emp.employee_id === selected.employee_id)
        )
      );
    } else {
      // 選中所有篩選後的員工
      const newSelections = filteredEmployees.filter(emp => 
        !selectedEmployees.some(selected => selected.employee_id === emp.employee_id)
      );
      setSelectedEmployees(prev => [...prev, ...newSelections]);
    }
  }, [filteredEmployees, selectedEmployees]);

  // 移除單個選中的員工
  const removeSelectedEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.filter(emp => emp.employee_id !== employeeId)
    );
  };

  // 清空所有選中的員工
  const clearAllSelected = () => {
    setSelectedEmployees([]);
  };

  // 處理員工輸入框點擊
  const handleEmployeeInputClick = () => {
    if (employees.length > 0) {
      setShowEmployeeDropdown(true);
    } else if (companyId) {
      fetchEmployees();
    }
  };

  // 處理員工搜尋
  const handleEmployeeSearchChange = (e) => {
    const value = e.target.value;
    setEmployeeSearchQuery(value);
    setShowEmployeeDropdown(true);
  };

  // 處理公司ID變更
  const handleCompanyIdChange = (e) => {
    const value = e.target.value;
    setCompanyId(value);
    
    if (!value) {
      setEmployees([]);
      setSelectedEmployees([]);
      setShowEmployeeDropdown(false);
    }
  };

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
        return '';
    }
  };

  // 新增：生成完整日期範圍的函數
  const generateFullDateRange = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  // 修改：處理記錄，包含所有日期（即使沒有打卡記錄）
  const processRecords = (rawRecords, employeeInfo) => {
    const recordsByDate = {};
    
    // 先處理有打卡記錄的日期
    rawRecords.forEach(record => {
      const date = record.work_date;
      if (!date) return;
      
      const weekday = getWeekday(date);
      
      if (!recordsByDate[date]) {
        recordsByDate[date] = {
          work_date: date,
          weekday: weekday,
          check_in_records: [],
          check_out_records: [],
          holiday_type: record.holiday_type || '',
          remarks: '',
          employee_id: record.employee_id,
          employee_name: record.employee_name
        };
      }
      
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
      
      if (record.holiday_type) {
        recordsByDate[date].holiday_type = record.holiday_type;
      }
      
      if (record.holiday_type === '國定') {
        recordsByDate[date].remarks = '國定假日';
      }
    });

    // 生成完整日期範圍，包含沒有打卡記錄的日期
    const fullDateRange = generateFullDateRange(startDate, endDate);
    
    fullDateRange.forEach(date => {
      if (!recordsByDate[date]) {
        const weekday = getWeekday(date);
        recordsByDate[date] = {
          work_date: date,
          weekday: weekday,
          check_in_records: [],
          check_out_records: [],
          holiday_type: '',
          remarks: '',
          employee_id: employeeInfo.employee_id,
          employee_name: employeeInfo.name
        };
      }
    });
    
    const processedData = Object.values(recordsByDate).map(dayRecord => {
      const latestCheckIn = dayRecord.check_in_records.length > 0 
        ? dayRecord.check_in_records.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null;
      
      const latestCheckOut = dayRecord.check_out_records.length > 0
        ? dayRecord.check_out_records.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null;

      // 判斷是否為週末或國定假日
      const isWeekend = dayRecord.weekday === '六' || dayRecord.weekday === '日';
      const isHoliday = dayRecord.holiday_type === '國定';
      
      // 如果是平日且沒有打卡記錄，設為曠職
      let remarks = dayRecord.remarks;
      if (!isWeekend && !isHoliday && !latestCheckIn && !latestCheckOut) {
        remarks = '曠職';
      }
      
      return {
        work_date: dayRecord.work_date,
        weekday: dayRecord.weekday,
        work_time: latestCheckIn ? latestCheckIn.time : null,
        work_result: latestCheckIn ? translateResultToChinese(latestCheckIn.result) : '',
        get_off_work_time: latestCheckOut ? latestCheckOut.time : null,
        get_off_work_result: latestCheckOut ? translateResultToChinese(latestCheckOut.result) : '',
        holiday_type: dayRecord.holiday_type,
        remarks: remarks,
        employee_id: dayRecord.employee_id,
        employee_name: dayRecord.employee_name
      };
    });
    
    return processedData.sort((a, b) => new Date(a.work_date) - new Date(b.work_date));
  };

  // 多員工查詢 - 改善錯誤處理和資料驗證
  const handleQuery = async () => {
    // 加入更詳細的驗證
    if (!companyId || companyId.length < 8) {
      setError('請輸入有效的公司統編（至少8位數字）');
      setShowError(true);
      return;
    }

    if (selectedEmployees.length === 0) {
      setError('請至少選擇一位員工');
      setShowError(true);
      return;
    }

    if (!startDate || !endDate) {
      setError('請設定查詢的開始和結束日期');
      setShowError(true);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (end < start) {
      setError('結束日期不能早於開始日期');
      setShowError(true);
      return;
    }
    
    if (start > today) {
      setError('開始日期不能晚於今天');
      setShowError(true);
      return;
    }
    
    const threeMonthsLater = new Date(start);
    threeMonthsLater.setMonth(start.getMonth() + 3);
    
    if (end > threeMonthsLater) {
      setError('查詢日期範圍不能超過3個月');
      setShowError(true);
      return;
    }

    if (selectedEmployees.length > 20) {
      setError('一次最多只能查詢20位員工');
      setShowError(true);
      return;
    }

    setLoading(true);
    setError('');
    setProcessedRecords([]);
    
    try {
      const allRecords = [];
      let successCount = 0;
      let failCount = 0;

      // 同時查詢打卡記錄和申請單
      const attendancePromises = selectedEmployees.map(async (employee) => {
        try {
          console.log(`正在查詢員工 ${employee.employee_id}(${employee.name}) 的打卡記錄...`);
          
          const response = await axios.get(API_URL, {
            params: {
              company_id: companyId,
              employee_id: employee.employee_id,
              start_date: startDate,
              end_date: endDate
            },
            timeout: 30000
          });

          if (response.data.Status === 'Ok') {
            const employeeRecords = response.data.Data.records || [];
            
            employeeRecords.forEach(record => {
              allRecords.push({
                ...record,
                employee_id: employee.employee_id,
                employee_name: employee.name,
                employee_department: employee.department
              });
            });

            successCount++;
            console.log(`員工 ${employee.employee_id} 查詢完成，找到 ${employeeRecords.length} 筆記錄`);
          } else {
            failCount++;
            console.log(`員工 ${employee.employee_id} 查詢失敗: ${response.data.Msg}`);
          }
        } catch (error) {
          console.error(`查詢員工 ${employee.employee_id} 的打卡記錄失敗:`, error);
          failCount++;
        }
      });

      // 等待所有打卡記錄查詢完成
      await Promise.all(attendancePromises);

      // 查詢申請單
      if (showApplicationInfo) {
        await fetchAllApplications();
      }

      setRecords(allRecords);
      
      // 即使沒有打卡記錄也要處理
      const groupedRecords = {};
      selectedEmployees.forEach(employee => {
        groupedRecords[employee.employee_id] = allRecords.filter(record => 
          record.employee_id === employee.employee_id
        );
      });

      const processedGroupedRecords = {};
      selectedEmployees.forEach(employee => {
        const employeeRecords = groupedRecords[employee.employee_id] || [];
        processedGroupedRecords[employee.employee_id] = processRecords(employeeRecords, employee);
      });

      setProcessedRecords(processedGroupedRecords);
      
      setQueryInfo({
        companyId: companyId,
        selectedEmployees: selectedEmployees,
        startDate: startDate,
        endDate: endDate,
        totalRecords: allRecords.length,
        totalEmployees: selectedEmployees.length,
        successEmployees: successCount,
        failedEmployees: failCount
      });

    } catch (err) {
      console.error('多員工查詢錯誤:', err);
      
      let errorMessage = '多員工查詢出錯: ';
      
      // 根據錯誤類型提供更具體的訊息
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage += '請求超時，請稍後再試';
      } else if (err.response?.status === 401) {
        errorMessage += '權限不足，請檢查公司ID是否正確';
      } else if (err.response?.status === 404) {
        errorMessage += '找不到相關資料';
      } else if (err.response?.status >= 500) {
        errorMessage += '伺服器暫時無法回應，請稍後再試';
      } else if (!navigator.onLine) {
        errorMessage += '網路連線異常，請檢查網路狀態';
      } else {
        errorMessage += err.message || '未知錯誤';
      }
      
      setError(errorMessage);
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
    
    if (timeString.length === 8 && timeString.indexOf(':') !== -1) {
      return timeString.substring(0, 5);
    }
    
    return timeString;
  };

  // 修改：計算工時函數 - 新版本（扣除午休時間，格式為 00時00分）
  const calculateWorkingHours = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime || checkInTime === '無記錄' || checkOutTime === '無記錄') {
      return '-';
    }
    
    try {
      const checkIn = new Date(`2000-01-01T${checkInTime}`);
      let checkOut = new Date(`2000-01-01T${checkOutTime}`);
      
      // 如果下班時間早於上班時間，表示跨日
      if (checkOut < checkIn) {
        checkOut.setDate(checkOut.getDate() + 1);
      }
      
      let diffMs = checkOut - checkIn;
      
      // 處理午休時間扣除 (12:00-13:00)
      const lunchStart = new Date(`2000-01-01T12:00:00`);
      const lunchEnd = new Date(`2000-01-01T13:00:00`);
      
      // 檢查是否需要扣除午休時間
      if (checkIn < lunchEnd && checkOut > lunchStart) {
        // 計算實際的午休重疊時間
        const actualLunchStart = checkIn > lunchStart ? checkIn : lunchStart;
        const actualLunchEnd = checkOut < lunchEnd ? checkOut : lunchEnd;
        
        // 如果有重疊，扣除重疊的時間
        if (actualLunchStart < actualLunchEnd) {
          const lunchOverlapMs = actualLunchEnd - actualLunchStart;
          diffMs -= lunchOverlapMs;
        }
      }
      
      // 特殊處理：如果上班時間在12:15，從13:00開始計算
      if (checkInTime >= '12:15' && checkInTime < '13:00') {
        const adjustedCheckIn = new Date(`2000-01-01T13:00:00`);
        diffMs = checkOut - adjustedCheckIn;
      }
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours < 0 || diffHours > 24) {
        return '-';
      }
      
      return `${diffHours.toString().padStart(2, '0')}時${diffMinutes.toString().padStart(2, '0')}分`;
    } catch (error) {
      return '-';
    }
  };

  // 新增：判斷假別函數
  const getHolidayType = (weekday, holidayType) => {
    if (holidayType === '國定') {
      return '國定假日';
    } else if (weekday === '六') {
      return '休息日';
    } else if (weekday === '日') {
      return '例假日';
    } else {
      return '';
    }
  };

  // 新增：合併備註和申請狀態函數
  const getCombinedRemarks = (record, employeeId, applicationsOnDate, showApplicationInfo) => {
    let combinedRemarks = record.remarks || '';
    
    if (showApplicationInfo && applicationsOnDate && applicationsOnDate.length > 0) {
      const applicationTexts = applicationsOnDate.map(app => {
        let displayText = formatApplicationCategory(app.category);
        if (app.category === 'leave' && app.type) {
          displayText = formatLeaveType(app.type);
        }
        return displayText;
      });
      
      if (combinedRemarks) {
        combinedRemarks += ' | ' + applicationTexts.join(', ');
      } else {
        combinedRemarks = applicationTexts.join(', ');
      }
    }
    
    return combinedRemarks || '-';
  };

  // 新增：格式化上下班時間顯示（時間|狀態）
  const formatTimeWithStatus = (timeString, statusString) => {
    const time = formatTime(timeString);
    if (time === '無記錄') {
      return '無記錄';
    }
    
    if (statusString) {
      return `${time}|${statusString}`;
    }
    
    return time;
  };

  // 修改：單個員工PDF匯出功能
  const exportSingleEmployeeToPdf = async (employeeId) => {
    if (!queryInfo || !processedRecords[employeeId]) {
      setError('沒有可匯出的數據');
      setShowError(true);
      return;
    }

    setExportLoading(true);

    try {
      const employeeData = processedRecords[employeeId];
      const employeeInfo = selectedEmployees.find(emp => emp.employee_id.toString() === employeeId.toString());
      
      if (!employeeInfo) {
        setError('找不到員工資訊');
        setShowError(true);
        setExportLoading(false);
        return;
      }

      // 查詢公司名稱
      let companyName = '';
      try {
        const companyResponse = await axios.get('https://rabbit.54ucl.com:3004/api/employee', {
          params: {
            company_id: companyId,
            employee_id: employeeId
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        });

        if (companyResponse.data.Status === 'Ok' && companyResponse.data.Data && companyResponse.data.Data.company_name) {
          companyName = companyResponse.data.Data.company_name;
        } else {
          companyName = `公司ID: ${companyId}`;
        }
      } catch (err) {
        console.error('查詢公司名稱失敗:', err);
        companyName = `公司ID: ${companyId}`;
      }

      const filename = `${employeeInfo.name} 打卡紀錄表.pdf`;

      const exportContent = document.createElement('div');
      exportContent.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 10px; color: #333; font-size: 24px;">${companyName}</h2>
        <h3 style="text-align: center; margin-bottom: 5px; color: #666; font-size: 18px;">工號: ${employeeId}</h3>
        <h4 style="text-align: center; margin-bottom: 20px; color: #666; font-size: 16px;">姓名: ${employeeInfo.name} - ${employeeInfo.department}</h4>
        <div style="margin-bottom: 20px;">
          <p><strong>查詢期間:</strong> ${startDate} 至 ${endDate}</p>
        </div>
      `;

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginBottom = '20px';

      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">日期</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">星期</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">假別</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">上班時間</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">下班時間</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">工時</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">備註/申請狀態</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      employeeData.forEach((record) => {
        const tr = document.createElement('tr');
        
        const isHoliday = record.holiday_type === '國定';
        const isWeekend = record.weekday === '六' || record.weekday === '日';
        
        // 獲取申請資訊
        const applicationsOnDate = getApplicationsForDate(employeeId, record.work_date);
        
        // 格式化上班時間和狀態
        let checkInDisplay = '';
        if (isHoliday) {
          checkInDisplay = '國定';
        } else if (record.remarks === '曠職') {
          checkInDisplay = '曠職';
        } else {
          checkInDisplay = formatTimeWithStatus(record.work_time, record.work_result);
        }
        
        // 格式化下班時間和狀態
        let checkOutDisplay = '';
        if (isHoliday) {
          checkOutDisplay = '';
        } else if (record.remarks === '曠職') {
          checkOutDisplay = '';
        } else {
          checkOutDisplay = formatTimeWithStatus(record.get_off_work_time, record.get_off_work_result);
        }

        // 計算工時
        const workingHours = (isHoliday || record.remarks === '曠職') ? '-' : calculateWorkingHours(
          record.work_time === null ? '無記錄' : record.work_time,
          record.get_off_work_time === null ? '無記錄' : record.get_off_work_time
        );

        // 獲取假別
        const holidayType = getHolidayType(record.weekday, record.holiday_type);

        // 合併備註和申請狀態
        const combinedRemarks = getCombinedRemarks(record, employeeId, applicationsOnDate, showApplicationInfo);
        
        tr.innerHTML = `
          <td style="border: 1px solid #ddd; padding: 8px;">${record.work_date}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${record.weekday}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: ${holidayType ? '#f44336' : '#666'};">${holidayType}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${checkInDisplay}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${checkOutDisplay}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #2196f3;">${workingHours}</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: ${applicationsOnDate && applicationsOnDate.length > 0 ? '#ff9800' : '#666'};">${combinedRemarks}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      exportContent.appendChild(table);

      const footer = document.createElement('div');
      footer.innerHTML = `
        <p style="text-align: right; font-size: 12px;">匯出時間: ${new Date().toLocaleString()}</p>
      `;
      exportContent.appendChild(footer);

      const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(exportContent).set(opt).save().then(() => {
        setExportLoading(false);
      }).catch(err => {
        console.error('PDF匯出錯誤:', err);
        setError('PDF匯出失敗: ' + err.message);
        setShowError(true);
        setExportLoading(false);
      });

    } catch (err) {
      console.error('匯出PDF時發生錯誤:', err);
      setError('匯出PDF失敗: ' + err.message);
      setShowError(true);
      setExportLoading(false);
    }
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
      {/* 全螢幕載入提示 */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color: '#1976d2', marginBottom: '20px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>正在查詢中...</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              正在查詢 {selectedEmployees.length} 位員工的打卡記錄
              <br />
              查詢期間：{startDate} 至 {endDate}
            </p>
            {showApplicationInfo && (
              <p style={{ margin: '10px 0 0 0', color: '#ff9800', fontSize: '12px' }}>
                同時查詢申請單資訊...
              </p>
            )}
          </div>
        </div>
      )}

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
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px', color: '#4a86e8' }} />
            多員工打卡記錄查詢
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
          }}>
            {/* 公司ID輸入框 */}
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
                onChange={handleCompanyIdChange}
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
              {loadingEmployees && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '4px' }} />
                  正在查詢員工資料...
                </div>
              )}
            </div>

            {/* 員工多選下拉框 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }} ref={dropdownRef}>
              <label style={{
                marginBottom: '5px',
                fontWeight: '500',
              }} htmlFor="employeeSelect">
                <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                員工選擇 ({selectedEmployees.length} 位已選)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="employeeSelect"
                  type="text"
                  value={employeeSearchQuery}
                  onChange={handleEmployeeSearchChange}
                  onClick={handleEmployeeInputClick}
                  onKeyPress={handleKeyPress}
                  placeholder={employees.length > 0 ? "搜尋員工或點擊選擇" : "請先輸入公司統編"}
                  disabled={!companyId || loadingEmployees}
                  style={{
                    padding: '8px 32px 8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: (!companyId || loadingEmployees) ? '#f5f5f5' : 'white',
                    cursor: (!companyId || loadingEmployees) ? 'not-allowed' : 'pointer',
                  }}
                />
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* 員工多選下拉選單 */}
              {showEmployeeDropdown && employees.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderTop: 'none',
                  borderRadius: '0 0 4px 4px',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* 全選按鈕 */}
                  <div style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      共 {filteredEmployees.length} 位員工
                    </span>
                    <button
                      onClick={handleSelectAll}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {filteredEmployees.every(emp => 
                        selectedEmployees.some(selected => selected.employee_id === emp.employee_id)
                      ) ? '取消全選' : '全選'}
                    </button>
                  </div>

                  {filteredEmployees.length === 0 ? (
                    <div style={{
                      padding: '12px',
                      color: '#666',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      找不到符合條件的員工
                    </div>
                  ) : (
                    filteredEmployees.map((employee) => {
                      const isSelected = selectedEmployees.some(emp => emp.employee_id === employee.employee_id);
                      return (
                        <div
                          key={employee.employee_id}
                          onClick={() => handleEmployeeToggle(employee)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: isSelected ? '#e3f2fd' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.target.style.backgroundColor = '#f8f9fa';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = isSelected ? '#e3f2fd' : 'white';
                          }}
                        >
                          <FontAwesomeIcon 
                            icon={isSelected ? faCheck : faUser}
                            style={{ 
                              color: isSelected ? '#4caf50' : '#666',
                              minWidth: '14px'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                              {employee.name} ({employee.employee_id})
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {employee.department} - {employee.position || (employee.job_grade === 'hr' ? '主管' : '員工')}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* 開始日期 */}
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

            {/* 結束日期 */}
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

          {/* 申請資訊顯示選項 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <input
                type="checkbox"
                checked={showApplicationInfo}
                onChange={(e) => setShowApplicationInfo(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px', color: '#ff9800' }} />
              同時查詢申請單狀態（請假、加班、補卡等）
            </label>
            {loadingApplications && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginLeft: '24px' }}>
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '4px' }} />
                正在查詢申請單資料...
              </div>
            )}
          </div>
          
          {/* 已選擇的員工顯示 */}
          {selectedEmployees.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <label style={{ fontWeight: '500' }}>
                  已選擇的員工 ({selectedEmployees.length} 位)：
                </label>
                <button
                  onClick={clearAllSelected}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '4px' }} />
                  清空全部
                </button>
              </div>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                maxHeight: '120px',
                overflow: 'auto',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {selectedEmployees.map(employee => (
                  <span
                    key={employee.employee_id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      gap: '6px'
                    }}
                  >
                    {employee.name}({employee.employee_id})
                    <FontAwesomeIcon 
                      icon={faTimes}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedEmployee(employee.employee_id);
                      }}
                      style={{ 
                        cursor: 'pointer',
                        opacity: 0.8
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
          
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
                <><FontAwesomeIcon icon={faSearch} /> 開始查詢</>
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
              <strong>查詢結果：</strong>公司ID: {queryInfo.companyId} | 
              員工數: {queryInfo.totalEmployees} 位 | 
              期間: {queryInfo.startDate} 至 {queryInfo.endDate} | 
              共 {queryInfo.totalRecords} 筆記錄 | 
              成功: {queryInfo.successEmployees} 位，失敗: {queryInfo.failedEmployees} 位
              {showApplicationInfo && <span> | 已整合申請單資訊</span>}
            </p>
          </div>
        )}

        {Object.keys(processedRecords        ).length > 0 ? (
          <>
            {/* 為每個員工顯示表格 */}
            {Object.keys(processedRecords).map(employeeId => {
              const employeeData = processedRecords[employeeId];
              const employeeInfo = selectedEmployees.find(emp => emp.employee_id.toString() === employeeId.toString());
              
              return (
                <div key={employeeId} style={{ marginBottom: '30px' }}>
                  <h3 style={{ 
                    color: '#333', 
                    borderBottom: '2px solid #4a86e8', 
                    paddingBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>
                      員工編號: {employeeId} 
                      {employeeInfo && ` (姓名: ${employeeInfo.name}) - ${employeeInfo.department}`}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {employeeData.length} 筆記錄
                    </span>
                  </h3>
                  
                  {employeeData.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '20px', 
                      color: '#666',
                      fontStyle: 'italic',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      此員工在查詢期間內無打卡記錄
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      overflow: 'auto',
                      maxHeight: '400px',
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
                              textAlign: 'center',
                              borderBottom: '1px solid #eee',
                              backgroundColor: '#f5f5f5',
                              fontWeight: '600',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                            }}>假別</th>
                            <th style={{
                              padding: '12px 16px',
                              textAlign: 'center',
                              borderBottom: '1px solid #eee',
                              backgroundColor: '#f5f5f5',
                              fontWeight: '600',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                            }}>上班</th>
                            <th style={{
                              padding: '12px 16px',
                              textAlign: 'center',
                              borderBottom: '1px solid #eee',
                              backgroundColor: '#f5f5f5',
                              fontWeight: '600',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                            }}>下班</th>
                            <th style={{
                              padding: '12px 16px',
                              textAlign: 'center',
                              borderBottom: '1px solid #eee',
                              backgroundColor: '#f5f5f5',
                              fontWeight: '600',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                            }}>工時</th>
                            <th style={{
                              padding: '12px 16px',
                              textAlign: 'left',
                              borderBottom: '1px solid #eee',
                              backgroundColor: '#f5f5f5',
                              fontWeight: '600',
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                            }}>備註/申請狀態</th>
                          </tr>
                        </thead>

                        <tbody>
                          {employeeData.map((record, index) => {
                            const isHoliday = record.holiday_type === '國定';
                            const isWeekend = record.weekday === '六' || record.weekday === '日';
                            const isAbsent = record.remarks === '曠職';
                            
                            // 獲取該日期的申請資訊
                            const applicationsOnDate = showApplicationInfo ? getApplicationsForDate(employeeId, record.work_date) : [];
                            const hasApplications = applicationsOnDate.length > 0;
                            
                            // 計算工時
                            const workingHours = (isHoliday || isAbsent) ? '-' : calculateWorkingHours(record.work_time, record.get_off_work_time);
                            
                            // 獲取假別
                            const holidayType = getHolidayType(record.weekday, record.holiday_type);
                            
                            // 合併備註和申請狀態
                            const combinedRemarks = getCombinedRemarks(record, employeeId, applicationsOnDate, showApplicationInfo);
                            
                            // 判斷背景色
                            let backgroundColor = 'transparent';
                            if (isAbsent) {
                              backgroundColor = '#ffcdd2'; // 曠職 - 淺紅色
                            } else if (hasApplications) {
                              const hasLeave = applicationsOnDate.some(app => app.category === 'leave');
                              const hasOvertime = applicationsOnDate.some(app => app.category === 'overtime');
                              const hasMakeupCard = applicationsOnDate.some(app => app.category === 'makeup_card');
                              
                              if (hasLeave) backgroundColor = '#fff3cd'; // 請假 - 淺黃色
                              else if (hasOvertime) backgroundColor = '#cce5ff'; // 加班 - 淺藍色
                              else if (hasMakeupCard) backgroundColor = '#d4edda'; // 補卡 - 淺綠色
                              else backgroundColor = '#f8f9fa'; // 其他申請 - 淺灰色
                            } else if (isHoliday) {
                              backgroundColor = '#ffebee'; // 國定假日 - 淺紅色
                            } else if (isWeekend) {
                              backgroundColor = '#fff8e1'; // 週末 - 淺橘色
                            }
                            
                            return (
                              <tr key={index} style={{ backgroundColor }}>
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
                                  textAlign: 'center',
                                  borderBottom: '1px solid #eee',
                                  color: holidayType ? '#f44336' : '#666',
                                  fontWeight: holidayType ? 'bold' : 'normal',
                                }}>{holidayType}</td>
                                <td style={{
                                  padding: '12px 16px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #eee',
                                }}>
                                  {isHoliday ? (
                                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>國定</span>
                                  ) : isAbsent ? (
                                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>曠職</span>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {formatTime(record.work_time)}
                                      </span>
                                      {record.work_result && (
                                        <>
                                          <span style={{ color: '#ccc', fontSize: '12px' }}>|</span>
                                          <span style={{
                                            fontSize: '12px',
                                            color: record.work_result === '準時' ? '#4caf50' : 
                                                  record.work_result === '遲到' ? '#f44336' : '#666',
                                            fontWeight: 'bold',
                                            backgroundColor: record.work_result === '準時' ? '#e8f5e8' : 
                                                            record.work_result === '遲到' ? '#ffebee' : '#f5f5f5',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            minWidth: '36px',
                                            textAlign: 'center'
                                          }}>
                                            {record.work_result}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td style={{
                                  padding: '12px 16px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #eee',
                                }}>
                                  {isHoliday || isAbsent ? (
                                    <span></span>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {formatTime(record.get_off_work_time)}
                                      </span>
                                      {record.get_off_work_result && (
                                        <>
                                          <span style={{ color: '#ccc', fontSize: '12px' }}>|</span>
                                          <span style={{
                                            fontSize: '12px',
                                            color: record.get_off_work_result === '準時' ? '#4caf50' : 
                                                  record.get_off_work_result === '早退' ? '#ff9800' : '#666',
                                            fontWeight: 'bold',
                                            backgroundColor: record.get_off_work_result === '準時' ? '#e8f5e8' : 
                                                            record.get_off_work_result === '早退' ? '#fff3e0' : '#f5f5f5',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            minWidth: '36px',
                                            textAlign: 'center'
                                          }}>
                                            {record.get_off_work_result}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td style={{
                                  padding: '12px 16px',
                                  textAlign: 'center',
                                  borderBottom: '1px solid #eee',
                                  fontWeight: 'bold',
                                  color: '#2196f3'
                                }}>
                                  {workingHours}
                                </td>
                                <td style={{
                                  padding: '12px 16px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #eee',
                                  color: hasApplications ? '#ff9800' : isAbsent ? '#f44336' : '#666',
                                }}>
                                  {hasApplications && applicationsOnDate.length > 0 ? (
                                    <div>
                                      {applicationsOnDate.map((app, idx) => (
                                        <div 
                                          key={idx} 
                                          style={{ 
                                            fontSize: '12px',
                                            marginBottom: idx < applicationsOnDate.length - 1 ? '4px' : '0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            padding: '2px 4px',
                                            borderRadius: '3px',
                                            transition: 'background-color 0.2s'
                                          }}
                                          onClick={() => showApplicationDetails(app)}
                                          onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#f0f0f0';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                          }}
                                          title="點擊查看詳細資訊"
                                        >
                                          <FontAwesomeIcon 
                                            icon={getApplicationIcon(app.category)} 
                                            style={{ 
                                              color: getApplicationColor(app.category),
                                              minWidth: '12px'
                                            }}
                                          />
                                          <span style={{ color: getApplicationColor(app.category) }}>
                                            {app.category === 'leave' && app.type 
                                              ? formatLeaveType(app.type)
                                              : formatApplicationCategory(app.category)
                                            }
                                          </span>
                                          {app.total_calculation_hours && (
                                            <span style={{ color: '#666', fontSize: '11px' }}>
                                              ({app.total_calculation_hours}小時)
                                            </span>
                                          )}
                                          <FontAwesomeIcon 
                                            icon={faEye} 
                                            style={{ 
                                              color: '#999',
                                              fontSize: '10px',
                                              marginLeft: '2px'
                                            }}
                                          />
                                        </div>
                                      ))}
                                      {record.remarks && record.remarks !== '曠職' && (
                                        <div style={{ 
                                          fontSize: '12px', 
                                          color: '#666',
                                          marginTop: '4px',
                                          paddingTop: '4px',
                                          borderTop: '1px solid #eee'
                                        }}>
                                          {record.remarks}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    combinedRemarks
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* 每個員工的單獨匯出按鈕 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px',
                  }}>
                    <button 
                      style={{
                        backgroundColor: exportLoading ? '#b0bec5' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        cursor: exportLoading ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background-color 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                      onClick={() => exportSingleEmployeeToPdf(employeeId)}
                      disabled={exportLoading}
                    >
                      {exportLoading ? (
                        <><FontAwesomeIcon icon={faSpinner} spin /> 匯出中...</>
                      ) : (
                        <><FontAwesomeIcon icon={faFilePdf} /> 匯出 {employeeInfo?.name} PDF</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
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
              <p>尚無查詢結果，請選擇員工並點擊查詢按鈕</p>
            </div>
          )
        )}

        {/* 申請單詳細資訊彈出視窗 */}
        {showApplicationModal && selectedApplication && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}>
            <div 
              ref={modalRef}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: '0',
              }}
            >
              {/* 彈出視窗標題 */}
              <div style={{
                backgroundColor: getApplicationColor(selectedApplication.category),
                color: 'white',
                padding: '16px 20px',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{ 
                  margin: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <FontAwesomeIcon icon={getApplicationIcon(selectedApplication.category)} />
                  {selectedApplication.category === 'leave' && selectedApplication.type 
                    ? formatLeaveType(selectedApplication.type)
                    : formatApplicationCategory(selectedApplication.category)
                  }申請單詳細資訊
                </h3>
                <button
                  onClick={closeApplicationModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '0',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>

              {/* 彈出視窗內容 */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}>
                  {/* 基本資訊 */}
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#495057',
                      borderBottom: '1px solid #dee2e6',
                      paddingBottom: '8px'
                    }}>
                      <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', color: '#6c757d' }} />
                      基本資訊
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <strong>表單編號：</strong>
                        <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                          {selectedApplication.form_number || '-'}
                        </span>
                      </div>
                      <div>
                        <strong>申請類型：</strong>
                        <span style={{ color: getApplicationColor(selectedApplication.category) }}>
                          {selectedApplication.category === 'leave' && selectedApplication.type 
                            ? formatLeaveType(selectedApplication.type)
                            : formatApplicationCategory(selectedApplication.category)
                          }
                        </span>
                      </div>
                      <div>
                        <strong>審核狀態：</strong>
                        <span style={{ 
                          color: selectedApplication.status === 'ok' ? '#28a745' : '#ffc107',
                          fontWeight: 'bold'
                        }}>
                          {formatStatus(selectedApplication.status)}
                        </span>
                      </div>
                      {selectedApplication.reviewer && (
                        <div>
                          <strong>審核人：</strong>
                          <span>{selectedApplication.reviewer}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 時間資訊 */}
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#495057',
                      borderBottom: '1px solid #dee2e6',
                      paddingBottom: '8px'
                    }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px', color: '#6c757d' }} />
                      時間資訊
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <strong>開始日期：</strong>
                        <span>{selectedApplication.start_date || '-'}</span>
                      </div>
                      <div>
                        <strong>結束日期：</strong>
                        <span>{selectedApplication.end_date || '-'}</span>
                      </div>
                      {selectedApplication.start_time && (
                        <div>
                          <strong>開始時間：</strong>
                          <span>{formatTimeOnly(selectedApplication.start_time)}</span>
                        </div>
                      )}
                      {selectedApplication.end_time && (
                        <div>
                          <strong>結束時間：</strong>
                          <span>{formatTimeOnly(selectedApplication.end_time)}</span>
                        </div>
                      )}
                      {selectedApplication.total_calculation_hours && (
                        <div>
                          <strong>總計時數：</strong>
                          <span style={{ 
                            color: '#007bff', 
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {selectedApplication.total_calculation_hours} 小時
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 申請說明 */}
                {selectedApplication.illustrate && (
                  <div style={{
                    backgroundColor: '#fff3cd',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #ffeaa7',
                    marginTop: '16px',
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#856404',
                      borderBottom: '1px solid #ffeaa7',
                      paddingBottom: '8px'
                    }}>
                      申請說明
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#856404',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedApplication.illustrate}
                    </p>
                  </div>
                )}

                {/* 申請時間 */}
                {selectedApplication.application_date && (
                  <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #bbdefb',
                    marginTop: '16px',
                    textAlign: 'center',
                  }}>
                    <small style={{ color: '#1565c0' }}>
                      申請時間：{formatDateTime(selectedApplication.application_date)}
                    </small>
                  </div>
                )}

                {/* 關閉按鈕 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #dee2e6',
                }}>
                  <button
                    onClick={closeApplicationModal}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 24px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#545b62';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#6c757d';
                    }}
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default TunQueryResults;

