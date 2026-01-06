import axios from 'axios';
import Cookies from 'js-cookie';

// 設定 API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';
const COMPANY_ID_COOKIE = 'scheduling_company_id';
const DEPARTMENT_COOKIE = 'department';

// ===== 工具函數區域 =====

// 🎯 本地日期字串函數 - 避免時區問題
export const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 🎨 獲取班別顏色函數 - 使用柔和彩虹顏色系統
export const getShiftColor = (shift_type_id, displayShiftTypes) => {
  if (!shift_type_id) return 'transparent';
  
  // 柔和彩虹顏色陣列 - 特別調整黃色為更柔和的金棕色
  const rainbowColors = [
    '#E57373', // 柔和紅色
    '#ff9d4dff', // 柔和橙色
    '#ffcb3aff', // 柔和金棕色 (替代刺眼的黃色 #FFF176)
    '#81C784', // 柔和綠色
    '#64B5F6', // 柔和藍色
    '#9575CD', // 柔和靛色
    '#ac5fbaff'  // 柔和紫色
  ];
  
  // 在合併的班別列表中找索引
  const shiftIndex = displayShiftTypes.findIndex(s => s.shift_type_id === shift_type_id);
  
  // 如果找不到班別，返回預設柔和紅色
  if (shiftIndex === -1) return rainbowColors[0];
  
  // 使用模運算來循環使用彩虹顏色
  const colorIndex = shiftIndex % rainbowColors.length;
  
  return rainbowColors[colorIndex];
};

// ✅ 添加記憶化緩存
const workHoursCache = new Map();

// ⏰ 計算工作時數函數 - 根據休息時間開始和結束時間計算
export const calculateWorkHours = (startTime, endTime, breakTimeStart, breakTimeEnd) => {
  // ✅ 創建緩存鍵
  const cacheKey = `${startTime}-${endTime}-${breakTimeStart || ''}-${breakTimeEnd || ''}`;
  
  // ✅ 檢查緩存
  if (workHoursCache.has(cacheKey)) {
    return workHoursCache.get(cacheKey);
  }

  console.log('🕐 計算工時輸入:', { startTime, endTime, breakTimeStart, breakTimeEnd });
  
  if (!startTime || !endTime) {
    console.log('❌ 缺少時間參數');
    const result = 0;
    workHoursCache.set(cacheKey, result); // ✅ 緩存結果
    return result;
  }
  
  // 確保時間格式正確
  const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    console.log('❌ 時間格式不正確:', { startTime, endTime });
    const result = 0;
    workHoursCache.set(cacheKey, result); // ✅ 緩存結果
    return result;
  }
  
  try {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    // 檢查日期是否有效
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.log('❌ 無效的時間:', { start, end });
      const result = 0;
      workHoursCache.set(cacheKey, result); // ✅ 緩存結果
      return result;
    }
    
    // 如果結束時間小於開始時間，表示跨日
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // 計算休息時間長度
    let breakHours = 0;
    if (breakTimeStart && breakTimeEnd && 
        timeRegex.test(breakTimeStart) && timeRegex.test(breakTimeEnd)) {
      
      const breakStart = new Date(`2000-01-01 ${breakTimeStart}`);
      const breakEnd = new Date(`2000-01-01 ${breakTimeEnd}`);
      
      if (!isNaN(breakStart.getTime()) && !isNaN(breakEnd.getTime())) {
        // 如果休息結束時間小於開始時間，表示跨日
        if (breakEnd < breakStart) {
          breakEnd.setDate(breakEnd.getDate() + 1);
        }
        
        const breakDiffMs = breakEnd - breakStart;
        breakHours = breakDiffMs / (1000 * 60 * 60);
      }
    }
    
    const netHours = diffHours - breakHours;
    const result = Math.round(Math.max(0, netHours) * 10) / 10;
    
    console.log('✅ 工時計算結果:', {
      diffHours,
      breakHours,
      netHours,
      result
    });
    
    // ✅ 緩存結果
    workHoursCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('❌ 工時計算錯誤:', error);
    const result = 0;
    workHoursCache.set(cacheKey, result); // ✅ 緩存錯誤結果
    return result;
  }
};

// ✅ 添加清除緩存的函數（可選）
export const clearWorkHoursCache = () => {
  workHoursCache.clear();
  console.log('🧹 工時計算緩存已清除');
};


// 📅 生成整個月份的週數據 - 只顯示當月日期
export const getMonthWeeks = (selectedYear, selectedMonth) => {
  const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
  const lastDay = new Date(selectedYear, selectedMonth, 0);
  const daysInMonth = lastDay.getDate();
  
  const weeks = [];
  let currentWeek = [];
  
  // ✅ 修改：填充第一週前面的空白日期（但標記為空格）
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    // 創建空的佔位符，但標記為不顯示
    currentWeek.push({
      date: null,
      day: null,
      month: null,
      year: null,
      weekday: null,
      isWeekend: false,
      isCurrentMonth: false,
      isEmpty: true // ✅ 新增：標記為空格
    });
  }
  
  // 填充當月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    currentWeek.push({
      date: getLocalDateString(date),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isCurrentMonth: true,
      isEmpty: false // ✅ 新增：標記為非空格
    });
    
    // 如果是週六或者是最後一天，結束當前週
    if (date.getDay() === 6 || day === daysInMonth) {
      // ✅ 修改：如果不足7天，填充空的佔位符
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: null,
          day: null,
          month: null,
          year: null,
          weekday: null,
          isWeekend: false,
          isCurrentMonth: false,
          isEmpty: true // ✅ 新增：標記為空格
        });
      }
      
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }
  
  return weeks;
};

// 📝 獲取頻率顯示文字
export const getFrequencyText = (repeatFrequency) => {
  switch (repeatFrequency) {
    case 'weekdays':
      return '平日';
    case 'holiday':
      return '假日';
    case 'daily':
      return '每日';
    default:
      return '';
  }
};

// ===== 📅 日期和月份處理函數區域 =====

// 📅 處理月份切換邏輯
export const handleMonthNavigation = (month, selectedYear) => {
  let newMonth = month;
  let newYear = selectedYear;
  
  if (month < 1) {
    newYear = selectedYear - 1;
    newMonth = 12;
  } 
  else if (month > 12) {
    newYear = selectedYear + 1;
    newMonth = 1;
  }
  
  return { newMonth, newYear };
};

// 📅 計算週工時
export const calculateWeeklyHours = (employeeId, weekDates, schedules) => {
  if (!schedules[employeeId]) return 0;
  let weeklyTotal = 0;
  weekDates.forEach(dayData => {
    const schedule = schedules[employeeId][dayData.date];
    if (schedule && schedule.start_time && schedule.end_time) {
      const dailyHours = calculateWorkHours(
        schedule.start_time, 
        schedule.end_time, 
        schedule.break_time_start,
        schedule.break_time_end
      );
      
      if (!isNaN(dailyHours)) {
        weeklyTotal += dailyHours;
      }
    }
  });

  return Math.round(weeklyTotal * 10) / 10;
};

// ===== 🎯 事件處理函數區域 =====

// 🎯 設置全域事件監聽
export const setupGlobalEventListeners = (isDragging, handleMouseUp) => {
  const handleGlobalMouseUp = (event) => {
    if (isDragging) {
      console.log('全域 mouseup 事件觸發');
      handleMouseUp();
    }
  };

  const handleGlobalMouseMove = (event) => {
    if (isDragging) {
      // 防止頁面滾動
      event.preventDefault();
    }
  };

  if (isDragging) {
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    // 返回清理函數
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }
  
  // 如果沒有拖拉，返回一個空的清理函數
  return () => {};
};

// 🎯 處理班別選擇
export const handleSelectShift = (shift, selectedShift) => {
  return selectedShift?.shift_type_id === shift.shift_type_id ? null : shift;
};

// 🎯 處理操作按鈕選擇
export const handleActionSelection = (action, handleSearch) => {
  if (action === 'publish') {
    handleSearch();
  }
  return action;
};

// 🎯 自動清除成功訊息
export const setupAutoMessageClear = (successMessage, setSuccessMessage) => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    // 返回清理函數
    return () => clearTimeout(timer);
  }
  // 如果沒有訊息，返回一個空的清理函數
  return () => {};
};

// ===== Cookie 處理函數區域 =====

// 🍪 設置 Cookie
export const setCookies = (companyId, department) => {
  Cookies.set(COMPANY_ID_COOKIE, companyId, { expires: 30 });
  if (department) {
    Cookies.set(DEPARTMENT_COOKIE, department, { expires: 30 });
  }
};

// 🍪 獲取 Cookie
export const getCookies = () => {
  return {
    companyId: Cookies.get(COMPANY_ID_COOKIE),
    department: Cookies.get(DEPARTMENT_COOKIE)
  };
};

// ===== 智能拖拉排班功能區域 =====

// 🎯 根據頻率生成智能預覽
export const generateFrequencyBasedPreview = (startEmployee, startDate, endEmployee, endDate, selectedShift, employees, selectedYear, selectedMonth) => {
  if (!selectedShift) return [];
  
  const preview = [];
  const startEmployeeIndex = employees.findIndex(emp => emp.employee_id === startEmployee.employee_id);
  const endEmployeeIndex = employees.findIndex(emp => emp.employee_id === endEmployee.employee_id);
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const minEmployeeIndex = Math.min(startEmployeeIndex, endEmployeeIndex);
  const maxEmployeeIndex = Math.max(startEmployeeIndex, endEmployeeIndex);
  const minDate = startDateObj < endDateObj ? startDateObj : endDateObj;
  const maxDate = startDateObj > endDateObj ? startDateObj : endDateObj;

  // 根據頻率過濾日期
  for (let empIndex = minEmployeeIndex; empIndex <= maxEmployeeIndex; empIndex++) {
    const currentDate = new Date(minDate);
    
    // 根據頻率類型生成不同的日期範圍
    if (selectedShift.repeat_frequency === 'weekdays') {
      // 平日重複：只選擇該月所有平日
      const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
      const lastDay = new Date(selectedYear, selectedMonth, 0);
      
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 不是週末
          preview.push({
            employee: employees[empIndex].employee_id,
            date: getLocalDateString(d)
          });
        }
      }
      
    } else if (selectedShift.repeat_frequency === 'holiday') {
      // 假日重複：只選擇該月所有假日
      const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
      const lastDay = new Date(selectedYear, selectedMonth, 0);
      
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // 是週末
          preview.push({
            employee: employees[empIndex].employee_id,
            date: getLocalDateString(d)
          });
        }
      }
      
    } else {
      // 每日或其他：選擇拖拉範圍內的所有日期
      while (currentDate <= maxDate) {
        preview.push({
          employee: employees[empIndex].employee_id,
          date: getLocalDateString(currentDate)
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  console.log('🎯 生成預覽:', { 
    frequency: selectedShift.repeat_frequency, 
    count: preview.length,
    preview: preview.slice(0, 5) // 只顯示前5個用於除錯
  });

  return preview;
};

// 🖱️ 智能拖拉開始處理
export const handleSmartDragStart = (employee, date, selectedShift, employees, selectedYear, selectedMonth, setError) => {
  if (!selectedShift) {
    setError('請先選擇班別');
    return null;
  }

  console.log('🎯 開始智能拖拉:', { 
    employee: employee.employee_id, 
    date, 
    frequency: selectedShift.repeat_frequency 
  });
  
  // 根據頻率立即生成預覽
  const initialPreview = generateFrequencyBasedPreview(
    employee, date, employee, date, 
    selectedShift, employees, selectedYear, selectedMonth
  );
  
  return {
    dragStartCell: { employee, date },
    dragEndCell: { employee, date },
    initialPreview
  };
};

// 🖱️ 智能拖拉移動處理
export const handleSmartDragMove = (employee, date, dragStartCell, selectedShift, employees, selectedYear, selectedMonth) => {
  if (!dragStartCell || !selectedShift) return [];

  console.log('🖱️ 拖拉移動到:', { employee: employee.employee_id, date });
  
  // 使用智能預覽生成
  const newPreview = generateFrequencyBasedPreview(
    dragStartCell.employee, 
    dragStartCell.date, 
    employee, 
    date,
    selectedShift,
    employees,
    selectedYear,
    selectedMonth
  );
  
  return newPreview;
};

// 🔚 智能拖拉結束處理 - 修改版本
export const handleSmartDragEnd = (
  dragPreview, 
  selectedShift, 
  employees, 
  schedulesToSave, 
  schedules, 
  selectedMonth,
  setSchedulesToSave,
  setSchedules,
  setSuccessMessage,
  getFrequencyText
) => {
  if (!selectedShift || dragPreview.length === 0) {
    console.log('🔚 拖拉結束 - 條件不滿足');
    return false;
  }

  console.log('🔚 拖拉結束 - 開始應用智能排班:', {
    frequency: selectedShift.repeat_frequency,
    previewCount: dragPreview.length
  });

  // 🎯 獲取正確的年月
  const { year, month } = getTargetYearMonth(selectedMonth);

  // 應用排班
  const newSchedulesToSave = [...schedulesToSave];
  const newSchedules = {...schedules};
  let appliedCount = 0;
  let skippedCount = 0;

  dragPreview.forEach(item => {
    const employee = employees.find(emp => emp.employee_id === item.employee);
    if (!employee) return;

    // 檢查是否已有排班
    const hasExistingSchedule = newSchedules[employee.employee_id] && 
                               newSchedules[employee.employee_id][item.date];
    
    if (hasExistingSchedule) {
      skippedCount++;
      return;
    }

    if (!newSchedules[employee.employee_id]) {
      newSchedules[employee.employee_id] = {};
    }

    // 檢查是否已在待保存列表中
    const existingIndex = newSchedulesToSave.findIndex(
      s => s.employee_id === employee.employee_id && s.start_date === item.date
    );

    if (existingIndex !== -1) {
      newSchedulesToSave[existingIndex] = {
        ...newSchedulesToSave[existingIndex],
        shift_type_id: selectedShift.shift_type_id,
        year: year, // 🎯 更新年份
        month: month // 🎯 更新月份
      };
    } else {
      const newSchedule = {
        employee_id: employee.employee_id,
        shift_type_id: selectedShift.shift_type_id,
        start_date: item.date,
        end_date: item.date,
        year: year, // 🎯 明確設定年份
        month: month, // 🎯 明確設定月份
        repeat_frequency: selectedShift.repeat_frequency
      };
      
      newSchedulesToSave.push(newSchedule);
    }

    newSchedules[employee.employee_id][item.date] = {
      shift_type_id: selectedShift.shift_type_id,
      shift_name: selectedShift.shift_name || selectedShift.shift_category,
      start_time: selectedShift.start_time,
      end_time: selectedShift.end_time,
      break_time_start: selectedShift.break_time_start,
      break_time_end: selectedShift.break_time_end,
      repeat_frequency: selectedShift.repeat_frequency
    };
    
    appliedCount++;
  });

  setSchedulesToSave(newSchedulesToSave);
  setSchedules(newSchedules);
  
  return true;
};



// 👆 單擊智能排班處理
export const handleSmartCellClick = (
  employee, 
  date, 
  selectedShift, 
  schedules, 
  schedulesToSave, 
  selectedMonth,
  setSchedulesToSave,
  setSchedules,
  setSuccessMessage,
  setError,
  getFrequencyText
) => {
  if (!selectedShift) {
    setError('請先選擇班別');
    return false;
  }

  console.log('單擊排班:', { employee: employee.employee_id, date });

  // 檢查是否已有排班
  const hasSchedule = schedules[employee.employee_id] && schedules[employee.employee_id][date];
  if (hasSchedule) {
    console.log('該日期已有排班，跳過');
    return false;
  }

  // 根據頻率檢查是否可排班
  const dateObj = new Date(date);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
  let canSchedule = true;
  
  if (selectedShift.repeat_frequency === 'weekdays' && isWeekend) {
    canSchedule = false;
  } else if (selectedShift.repeat_frequency === 'holiday' && !isWeekend) {
    canSchedule = false;
  }

  if (!canSchedule) {
    setError(`該班別 (${getFrequencyText(selectedShift.repeat_frequency)}) 無法在此日期排班`);
    return false;
  }

  // 單個排班邏輯
  const newSchedulesToSave = [...schedulesToSave];
  const newSchedules = {...schedules};
  
  if (!newSchedules[employee.employee_id]) {
    newSchedules[employee.employee_id] = {};
  }
  const newSchedule = {
    employee_id: employee.employee_id,
    shift_type_id: selectedShift.shift_type_id,
    start_date: date,
    end_date: date,
    month: selectedMonth,
    repeat_frequency: selectedShift.repeat_frequency
  };
  
  newSchedulesToSave.push(newSchedule);
  
  newSchedules[employee.employee_id][date] = {
    shift_type_id: selectedShift.shift_type_id,
    shift_name: selectedShift.shift_name || selectedShift.shift_category,
    start_time: selectedShift.start_time,
    end_time: selectedShift.end_time,
    break_time_start: selectedShift.break_time_start,
    break_time_end: selectedShift.break_time_end,
    repeat_frequency: selectedShift.repeat_frequency
  };
  
  setSchedulesToSave(newSchedulesToSave);
  setSchedules(newSchedules);
  setSuccessMessage(`已排班：${employee.name} - ${dateObj.getMonth() + 1}/${dateObj.getDate()}`);
  
  return true;
};

// ===== 💾 儲存排班資料 API =====

// 💾 儲存排班資料 API - 修改版本支援跨年
export const saveSchedulesAPI = async (companyId, schedulesToSave, selectedMonth = '本月') => {
  try {
    console.log('📅 儲存排班資料:', schedulesToSave.length, '筆');
    
    // 🎯 獲取正確的年月
    const { year, month } = getTargetYearMonth(selectedMonth);
    console.log(`🎯 目標年月: ${year}年${month}月`);
    
    const schedulesToSend = schedulesToSave.map(schedule => {
      let dayNum;
      
      if (schedule.start_date.includes('-')) {
        dayNum = parseInt(schedule.start_date.split('-')[2]);
      } else {
        dayNum = parseInt(schedule.start_date);
      }
      
      return {
        employee_id: String(schedule.employee_id),
        shift_type_id: schedule.shift_type_id,
        start_date: String(dayNum).padStart(2, '0'),
        end_date: String(dayNum).padStart(2, '0'),
        year: year, // 🎯 明確傳送年份
        month: month, // 🎯 使用計算出的月份
        repeat_frequency: schedule.repeat_frequency
      };
    });
    
    const requestData = {
      company_id: String(companyId),
      year: year, // 🎯 明確傳送年份
      month: month, // 🎯 明確傳送月份
      schedules: schedulesToSend
    };
    
    console.log('🚀 發送排班資料:', requestData);
    
    const response = await axios.post(`${API_BASE_URL}/api/schedule`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    if (response.data.Status === 'Ok') {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.data.Msg || '保存排班資料失敗'
      };
    }
  } catch (err) {
    console.error('❌ 儲存排班失敗:', err);
    if (err.response) {
      const errorMsg = `儲存 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (err.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    return { success: false, error: `儲存失敗: ${err.message}` };
  }
};


// ===== 🖱️ 拖拉和點擊事件處理函數區域 =====

// 🎯 智能拖拉處理
export const handleMouseDown = (
  employee,
  date,
  selectedShift,
  employees,
  selectedYear,
  selectedMonth,
  setError,
  setIsDragging,
  setDragStartCell,
  setDragEndCell,
  setDragPreview
) => {
  // 注意：這裡不需要 event 參數，因為 preventDefault 會在調用處處理
  
  const dragResult = handleSmartDragStart(
    employee, 
    date, 
    selectedShift, 
    employees, 
    selectedYear, 
    selectedMonth, 
    setError
  );
  
  if (dragResult) {
    setIsDragging(true);
    setDragStartCell(dragResult.dragStartCell);
    setDragEndCell(dragResult.dragEndCell);
    setDragPreview(dragResult.initialPreview);
  }
};

// 🖱️ 拖拉移動處理
export const handleMouseEnter = (
  employee,
  date,
  isDragging,
  dragStartCell,
  selectedShift,
  employees,
  selectedYear,
  selectedMonth,
  setDragEndCell,
  setDragPreview
) => {
  if (!isDragging || !dragStartCell || !selectedShift) return;

  console.log('🖱️ 拖拉移動到:', { employee: employee.employee_id, date });
  
  setDragEndCell({ employee, date });
  
  // 使用智能預覽生成
  const newPreview = handleSmartDragMove(
    employee, 
    date, 
    dragStartCell, 
    selectedShift, 
    employees, 
    selectedYear, 
    selectedMonth
  );
  
  setDragPreview(newPreview);
};

// 🔚 拖拉結束處理
export const handleMouseUp = (
  isDragging,
  dragStartCell,
  dragEndCell,
  selectedShift,
  dragPreview,
  employees,
  schedulesToSave,
  schedules,
  selectedMonth,
  setSchedulesToSave,
  setSchedules,
  setSuccessMessage,
  setIsDragging,
  setDragStartCell,
  setDragEndCell,
  setDragPreview
) => {
  if (!isDragging || !dragStartCell || !dragEndCell || !selectedShift) {
    console.log('🔚 拖拉結束 - 條件不滿足');
    setIsDragging(false);
    setDragStartCell(null);
    setDragEndCell(null);
    setDragPreview([]);
    return;
  }

  const success = handleSmartDragEnd(
    dragPreview,
    selectedShift,
    employees,
    schedulesToSave,
    schedules,
    selectedMonth,
    setSchedulesToSave,
    setSchedules,
    setSuccessMessage,
    getFrequencyText
  );

  // 重置拖拉狀態
  setIsDragging(false);
  setDragStartCell(null);
  setDragEndCell(null);
  setDragPreview([]);
};

// 🎯 單擊排班處理
export const handleCellClick = (
  employee,
  date,
  selectedShift,
  schedules,
  schedulesToSave,
  selectedMonth,
  isDragging,
  setSchedulesToSave,
  setSchedules,
  setSuccessMessage,
  setError
) => {
  if (isDragging) return; // 如果正在拖拉，忽略點擊事件
  
  // 注意：這裡不需要 event 參數，preventDefault 會在調用處處理

  // 根據頻率檢查是否可排班
  const dateObj = new Date(date);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
  let canSchedule = true;
  
  if (selectedShift?.repeat_frequency === 'weekdays' && isWeekend) {
    canSchedule = false;
  } else if (selectedShift?.repeat_frequency === 'holiday' && !isWeekend) {
    canSchedule = false;
  }

  if (!canSchedule) {
    setError(`該班別 (${getFrequencyText(selectedShift.repeat_frequency)}) 無法在此日期排班`);
    return;
  }

  handleSmartCellClick(
    employee,
    date,
    selectedShift,
    schedules,
    schedulesToSave,
    selectedMonth,
    setSchedulesToSave,
    setSchedules,
    setSuccessMessage,
    setError,
    getFrequencyText
  );
};
// 在 ScheduleFunction.js 中添加：

// ✅ 檢查是否為本地排班
export const checkIsLocalSchedule = (employeeId, date, schedulesToSave) => {
  return schedulesToSave.some(schedule => 
    schedule.employee_id === employeeId && schedule.start_date === date
  );
};

// ✅ 撤回單個本地排班
export const handleLocalScheduleRemoval = (
  employee, 
  date, 
  schedule, 
  schedulesToSave,
  setSchedulesToSave,
  setSchedules
) => {
  console.log('🔄 撤回本地排班:', { employee: employee.name, date, schedule: schedule.shift_name });
  
  // 從待儲存列表中移除
  const newSchedulesToSave = schedulesToSave.filter(s => 
    !(s.employee_id === employee.employee_id && s.start_date === date)
  );
  setSchedulesToSave(newSchedulesToSave);
  
  // 從本地排班狀態中移除
  setSchedules(prev => {
    const newSchedules = { ...prev };
    if (newSchedules[employee.employee_id] && newSchedules[employee.employee_id][date]) {
      delete newSchedules[employee.employee_id][date];
      
      // 如果該員工沒有其他排班，清空該員工的排班物件
      if (Object.keys(newSchedules[employee.employee_id]).length === 0) {
        delete newSchedules[employee.employee_id];
      }
    }
    return newSchedules;
  });
};

// ✅ 批量撤回所有本地排班
export const handleClearAllLocalSchedules = (
  schedulesToSave,
  setSchedulesToSave,
  setSchedules,
  setError
) => {
  const localCount = schedulesToSave.length;
  
  if (localCount === 0) {
    setError('沒有本地排班需要撤回');
    return;
  }
  
  // 清空所有待儲存的排班
  setSchedulesToSave([]);
  
  // 從排班狀態中移除所有本地排班
  setSchedules(prev => {
    const newSchedules = { ...prev };
    
    schedulesToSave.forEach(schedule => {
      if (newSchedules[schedule.employee_id] && newSchedules[schedule.employee_id][schedule.start_date]) {
        delete newSchedules[schedule.employee_id][schedule.start_date];
        
        // 如果該員工沒有其他排班，清空該員工的排班物件
        if (Object.keys(newSchedules[schedule.employee_id]).length === 0) {
          delete newSchedules[schedule.employee_id];
        }
      }
    });
    
    return newSchedules;
  });
};

// ===== 📅 日期和月份處理函數區域 =====

// 🎯 新增：獲取目標年月函數 - 處理跨年邏輯
export const getTargetYearMonth = (selectedMonth = '本月') => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  
  if (selectedMonth === '本月') {
    return {
      year: currentYear,
      month: currentMonth + 1 // 1-12
    };
  } else {
    // 下月
    if (currentMonth === 11) { // 12月
      return {
        year: currentYear + 1, // 🎯 2026
        month: 1
      };
    } else {
      return {
        year: currentYear,
        month: currentMonth + 2 // 1-12
      };
    }
  }
};

// 🎯 修改：更新 getLocalDateString 函數以支援跨年
export const getLocalDateStringWithMonth = (date, selectedMonth = '本月') => {
  const { year, month } = getTargetYearMonth(selectedMonth);
  
  if (date instanceof Date) {
    // 如果傳入的是 Date 物件，使用目標年月
    return `${year}-${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // 如果傳入的是數字（日期）
  if (typeof date === 'number' || typeof date === 'string') {
    const day = parseInt(date);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  
  return date;
};

// 🎯 新增：獲取顯示年月函數
export const getDisplayYearMonth = (selectedMonth = '本月') => {
  const { year, month } = getTargetYearMonth(selectedMonth);
  return `${year}年${month}月`;
};

// 🎯 新增：處理排班資料的年月
export const processScheduleWithYearMonth = (schedule, selectedMonth = '本月') => {
  const { year, month } = getTargetYearMonth(selectedMonth);
  
  return {
    ...schedule,
    year: year,
    month: month,
    start_date: typeof schedule.start_date === 'number' || /^\d{1,2}$/.test(schedule.start_date)
      ? `${year}-${String(month).padStart(2, '0')}-${String(schedule.start_date).padStart(2, '0')}`
      : schedule.start_date,
    end_date: typeof schedule.end_date === 'number' || /^\d{1,2}$/.test(schedule.end_date)
      ? `${year}-${String(month).padStart(2, '0')}-${String(schedule.end_date).padStart(2, '0')}`
      : schedule.end_date
  };
};

// ===== 員工職務詳情 API 函數區域 =====

// 🔍 查詢員工職務詳情 API
export const fetchEmployeeJobDetailsAPI = async (companyId, employeeId) => {
  try {
    console.log(`🔍 查詢員工職務詳情: ${companyId}/${employeeId}`);
    
    const response = await axios.get(`${API_BASE_URL}/api/employee-job-details/${companyId}/${employeeId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ 員工職務詳情響應:', response.data);
    
    if (response.data.Status === 'Ok') {
      return {
        success: true,
        data: response.data.Data
      };
    } else {
      return {
        success: false,
        message: response.data.Msg || '查詢失敗'
      };
    }
  } catch (error) {
    console.error('❌ 查詢員工職務詳情失敗:', error);
    return {
      success: false,
      message: error.message || '查詢失敗'
    };
  }
};

// 🔥 修改：獲取輪班制員工 - 使用正確的職務詳情 API
export const fetchScheduledShiftEmployeesAPI = async (companyId) => {
  try {
    console.log('🔍 開始查詢輪班制員工（從職務詳情表）...');
    
    // 🔥 使用動態獲取的 company_id
    const actualCompanyId = Cookies.get('company_id') || companyId;
    console.log('🔍 使用的 company_id:', actualCompanyId);

    // 🔥 步驟1：先查詢所有員工基本資料
    const basicResponse = await axios.post(`${API_BASE_URL}/api/employees`, {
      company_id: actualCompanyId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ 員工基本資料查詢響應:', basicResponse.data);

    if (!basicResponse.data || basicResponse.data.Status !== 'Ok' || !basicResponse.data.Data) {
      console.log('❌ 員工基本資料查詢失敗');
      return await fallbackEmployeeQuery(companyId);
    }

    const basicEmployees = basicResponse.data.Data;
    console.log('✅ 獲取到', basicEmployees.length, '位員工基本資料');

    // 🔥 步驟2：查詢每個員工的職務詳情並篩選排班制員工
    const scheduledShiftEmployees = [];
    
    for (const employee of basicEmployees) {
      try {
        console.log(`🔍 查詢員工 ${employee.employee_id} 的職務詳情...`);
        
        // 🔥 使用正確的 API 路由：GET /api/employee-job-details/:company_id/:employee_id
        const jobDetailsResponse = await axios.get(
          `${API_BASE_URL}/api/employee-job-details/${actualCompanyId}/${employee.employee_id}`,
          {
            headers: {
              'Accept': 'application/json'
            },
            timeout: 5000
          }
        );

        console.log(`✅ 員工 ${employee.employee_id} 職務詳情:`, jobDetailsResponse.data);

        if (jobDetailsResponse.data && jobDetailsResponse.data.Status === 'Ok' && jobDetailsResponse.data.Data) {
          const jobDetails = jobDetailsResponse.data.Data;
          
          // 🔥 檢查是否為排班制
          if (jobDetails.shift_system === 'Scheduled Shift' || 
              jobDetails.shift_system === 'scheduled_shift' ||
              jobDetails.shift_system === '排班制') {
            
            console.log(`✅ 員工 ${employee.employee_id} 是排班制員工`);
            
            // 🔥 合併基本資料和職務詳情
            scheduledShiftEmployees.push({
              // 基本資料
              employee_id: employee.employee_id,
              name: employee.name || '未知姓名',
              company_id: actualCompanyId,
              // 職務詳情
              department: jobDetails.department || employee.department || '未知部門',
              position: jobDetails.position || employee.position || '員工',
              job_grade: jobDetails.job_grade || employee.job_grade,
              shift_system: jobDetails.shift_system,
              employment_status: jobDetails.employment_status || employee.employment_status || 'Active',
              salary_type: jobDetails.salary_type || employee.salary_type || 'Hourly',
              is_manager: jobDetails.is_manager || false,
              supervisor: jobDetails.supervisor || employee.supervisor,
              hire_date: jobDetails.hire_date || employee.hire_date,
              // 完整的職務詳情
              job_details: jobDetails
            });
          } else {
            console.log(`❌ 員工 ${employee.employee_id} 不是排班制員工，班制: ${jobDetails.shift_system}`);
          }
        } else {
          console.log(`❌ 員工 ${employee.employee_id} 沒有職務詳情，跳過`);
        }
      } catch (detailError) {
        console.error(`❌ 查詢員工 ${employee.employee_id} 職務詳情失敗:`, detailError.message);
        
        // 🔥 如果職務詳情查詢失敗，檢查基本資料中的 shift_system
        if (employee.shift_system === 'Scheduled Shift' || 
            employee.shift_system === 'scheduled_shift' ||
            employee.shift_system === '排班制') {
          
          console.log(`⚠️ 員工 ${employee.employee_id} 職務詳情查詢失敗，但基本資料顯示為排班制，仍加入列表`);
          
          scheduledShiftEmployees.push({
            employee_id: employee.employee_id,
            name: employee.name || '未知姓名',
            department: employee.department || '未知部門',
            position: employee.position || '員工',
            company_id: actualCompanyId,
            shift_system: employee.shift_system,
            employment_status: employee.employment_status || 'Active',
            salary_type: employee.salary_type || 'Hourly',
            job_details: {
              shift_system: employee.shift_system,
              employment_status: employee.employment_status || 'Active',
              salary_type: employee.salary_type || 'Hourly',
              note: '職務詳情查詢失敗，使用基本資料'
            }
          });
        }
        continue;
      }
    }

    console.log('🎯 最終找到', scheduledShiftEmployees.length, '位輪班制員工');
    
    if (scheduledShiftEmployees.length > 0) {
      return scheduledShiftEmployees;
    } else {
      console.log('⚠️ 沒有找到排班制員工，使用備用方案');
      return await fallbackEmployeeQuery(companyId);
    }

  } catch (error) {
    console.error('❌ 查詢輪班制員工失敗:', error);
    return await fallbackEmployeeQuery(companyId);
  }
};

// 🔥 同時修改 fallbackEmployeeQuery 函數（如果存在的話）
const fallbackEmployeeQuery = async (companyId) => {
  try {
    const actualCompanyId = Cookies.get('company_id') || companyId;
    console.log('🔄 執行備用查詢方案...');
    
    // 🔥 使用基本員工資料查詢
    const response = await axios.post(`${API_BASE_URL}/api/employees`, {
      company_id: actualCompanyId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    });

    if (response.data && response.data.Status === 'Ok' && response.data.Data) {
      console.log('✅ 備用查詢成功，開始篩選排班制員工');
      
      const employees = Array.isArray(response.data.Data) ? response.data.Data : [response.data.Data];
      console.log(`📋 獲取到 ${employees.length} 位員工，開始篩選...`);
      
      // 🔥 在前端篩選排班制員工
      const scheduledEmployees = employees.filter(emp => {
        const isScheduledShift = emp.shift_system === 'Scheduled Shift' || 
                                emp.shift_system === 'scheduled_shift' ||
                                emp.shift_system === '排班制';
        
        console.log(`🔍 員工 ${emp.employee_id} (${emp.name}):`, {
          shift_system: emp.shift_system,
          isScheduledShift: isScheduledShift
        });
        
        return isScheduledShift;
      });

      console.log(`🎯 篩選出 ${scheduledEmployees.length} 位排班制員工`);

      if (scheduledEmployees.length > 0) {
        return scheduledEmployees.map(employee => ({
          ...employee,
          employee_id: employee.employee_id || employee.id,
          name: employee.name || '未知姓名',
          department: employee.department || '未知部門',
          position: employee.position || '員工',
          company_id: actualCompanyId,
          job_details: {
            shift_system: employee.shift_system || 'Scheduled Shift',
            employment_status: employee.employment_status || 'Active',
            salary_type: employee.salary_type || 'Hourly',
            note: '使用基本資料備用方案'
          }
        }));
      }
    }

    // 🔥 最終測試資料
    console.log('🔧 使用最終測試資料');
    return [
      {
        employee_id: '001',
        name: '朱先生',
        department: '資管系',
        position: '老師的學生',
        company_id: actualCompanyId,
        shift_system: 'Scheduled Shift',
        employment_status: 'Active',
        salary_type: 'Hourly',
        job_details: {
          shift_system: 'Scheduled Shift',
          employment_status: 'Active',
          salary_type: 'Hourly',
          note: '測試資料'
        }
      },
      {
        employee_id: '002',
        name: '朱先生',
        department: '資管系',
        position: '老師的學生',
        company_id: actualCompanyId,
        shift_system: 'Scheduled Shift',
        employment_status: 'Active',
        salary_type: 'Hourly',
        job_details: {
          shift_system: 'Scheduled Shift',
          employment_status: 'Active',
          salary_type: 'Hourly',
          note: '測試資料'
        }
      },
      {
        employee_id: '003',
        name: '蕭美女',
        department: '資管系',
        position: '老師的學生',
        company_id: actualCompanyId,
        shift_system: 'Scheduled Shift',
        employment_status: 'Active',
        salary_type: 'Hourly',
        job_details: {
          shift_system: 'Scheduled Shift',
          employment_status: 'Active',
          salary_type: 'Hourly',
          note: '測試資料'
        }
      }
    ];

  } catch (error) {
    console.error('❌ 備用查詢也失敗:', error);
    return [];
  }
};

