import axios from 'axios';

// 設定 API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

// ===== 🗑️ 刪除相關 API 函數區域 =====

// 🗑️ 刪除班別 API
export const deleteShiftTypeAPI = async (shiftTypeId) => {
  try {
    console.log('🗑️ 刪除班別:', shiftTypeId);
    
    const response = await axios.delete(`${API_BASE_URL}/api/company/shifts/${shiftTypeId}`, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    if (response.data.Status === 'Ok') {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.data.Msg || '刪除班別失敗'
      };
    }
  } catch (err) {
    console.error('❌ 刪除班別失敗:', err);
    if (err.response) {
      const errorMsg = `刪除班別 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (err.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    return { success: false, error: `刪除班別失敗: ${err.message}` };
  }
};

// ===== 🗑️ 班別刪除處理函數區域 =====

// 處理刪除班別
export const handleDeleteShiftType = (
  shiftTypeId,
  displayShiftTypes,
  selectedShift,
  schedules,
  setLocalShiftTypes,
  setDeletedShiftTypes,
  setSuccessMessage,
  setSelectedShift,
  setSchedules,
  setSchedulesToSave
) => {
  const shift = displayShiftTypes.find(s => s.shift_type_id === shiftTypeId);
  
  if (shift?.isLocal) {
    setLocalShiftTypes(prev => prev.filter(s => s.shift_type_id !== shiftTypeId));
    setSuccessMessage(`已移除本地班別「${shift.shift_name}」`);
  } else {
    setDeletedShiftTypes(prev => [...prev, shiftTypeId]);
    setSuccessMessage(`已標記刪除班別「${shift.shift_name}」，請記得儲存草稿`);
  }
  
  if (selectedShift?.shift_type_id === shiftTypeId) {
    setSelectedShift(null);
  }
  
  const newSchedules = { ...schedules };
  Object.keys(newSchedules).forEach(employeeId => {
    Object.keys(newSchedules[employeeId]).forEach(date => {
      if (newSchedules[employeeId][date].shift_type_id === shiftTypeId) {
        delete newSchedules[employeeId][date];
      }
    });
  });
  setSchedules(newSchedules);
  
  setSchedulesToSave(prev => prev.filter(s => s.shift_type_id !== shiftTypeId));
};

// ===== 🗑️ 排班刪除處理函數區域 =====

// ✅ 獲取刪除選項的可用性 - 修正本地排班邏輯
export const getDeleteOptionsAvailability = (scheduleToDelete, schedules = {}, schedulesToSave = [], selectedMonth) => {
  if (!scheduleToDelete) {
    return { current: true, week: false, month: false };
  }

  // ✅ 如果是本地排班，只能撤回當天
// ✅ 如果是本地排班，根據頻率和其他排班情況決定選項
if (scheduleToDelete.isLocal) {
  console.log('🔍 本地排班檢查 - 根據頻率和其他本地排班決定選項');
  const frequency = scheduleToDelete.schedule?.repeat_frequency || 'daily';
  
  // 基本可用性：非每日班別才能選週/月
  const baseAvailability = {
    current: true,
    week: frequency !== 'daily',
    month: frequency !== 'daily'
  };
  
  // 如果是每日班別，直接返回基本可用性
  if (frequency === 'daily') {
    return baseAvailability;
  }
  
  // 檢查是否有其他相同班別的本地排班
  const employeeId = scheduleToDelete.employee.employee_id;
  const shiftTypeId = scheduleToDelete.schedule.shift_type_id;
  const currentDate = scheduleToDelete.date;
  
  const safeSchedulesToSave = Array.isArray(schedulesToSave) ? schedulesToSave : [];
  const otherLocalSchedules = safeSchedulesToSave.filter(schedule => 
    schedule.employee_id === employeeId && 
    schedule.shift_type_id === shiftTypeId &&
    schedule.start_date !== currentDate
  );
  
  // 如果沒有其他本地排班，則不能選週/月撤回
  if (otherLocalSchedules.length === 0) {
    return {
      current: true,
      week: false,
      month: false
    };
  }
  
  // 有其他本地排班且頻率允許，則可以使用週/月撤回
  return baseAvailability;
}



  const frequency = scheduleToDelete.schedule?.repeat_frequency || 'daily';
  
  // ✅ 基本可用性：非每日班別才能選週/月
  const baseAvailability = {
    current: true, // 當天選項永遠可用
    week: frequency !== 'daily', // 非每日班別才能選週
    month: frequency !== 'daily' // 非每日班別才能選月
  };

  // ✅ 如果基本規則就不允許，直接返回
  if (!baseAvailability.week && !baseAvailability.month) {
    return baseAvailability;
  }

  // ✅ 檢查是否有其他相同班別的排班（本地 + 資料庫）
  const employeeId = scheduleToDelete.employee.employee_id;
  const shiftTypeId = scheduleToDelete.schedule.shift_type_id;
  const currentDate = scheduleToDelete.date;
  
  // ✅ 確保 schedulesToSave 是數組
  const safeSchedulesToSave = Array.isArray(schedulesToSave) ? schedulesToSave : [];
  
  // ✅ 檢查本地排班（排除當前日期）
  const localSchedulesCount = safeSchedulesToSave.filter(schedule => 
    schedule.employee_id === employeeId && 
    schedule.shift_type_id === shiftTypeId &&
    schedule.start_date !== currentDate // ✅ 排除當前要刪除的日期
  ).length;
  
  // ✅ 確保 schedules 是對象
  const safeSchedules = schedules || {};
  
  // ✅ 檢查資料庫排班（排除當前日期和本地排班日期）
  const dbSchedules = safeSchedules[employeeId] || {};
  const localScheduleDates = new Set(safeSchedulesToSave.map(s => s.start_date));
  
  const dbSchedulesCount = Object.entries(dbSchedules).filter(([date, schedule]) => 
    schedule.shift_type_id === shiftTypeId &&
    date !== currentDate && // ✅ 排除當前要刪除的日期
    !localScheduleDates.has(date) // ✅ 排除已被本地排班覆蓋的日期
  ).length;
  
  const totalSchedulesCount = localSchedulesCount + dbSchedulesCount;
  
  console.log('🔍 資料庫排班刪除選項檢查:', {
    frequency,
    employeeId,
    shiftTypeId,
    currentDate,
    localSchedulesCount,
    dbSchedulesCount,
    totalSchedulesCount,
    baseAvailability,
    localScheduleDates: Array.from(localScheduleDates)
  });

  // ✅ 如果沒有其他排班，則不能選週/月刪除
  if (totalSchedulesCount === 0) {
    return {
      current: true,
      week: false,
      month: false
    };
  }

  // ✅ 有其他排班且頻率允許，則可以使用週/月刪除
  return baseAvailability;
};


// 在文件頂部確保有這個函數
export const getWeekDateRange = (date) => {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay(); // 0 = 週日, 1 = 週一, ...
  
  // 計算週一的日期
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - dayOfWeek + 1);
  
  // 計算週日的日期
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0]
  };
};


// ✅ 獲取月份的開始和結束日期
export const getMonthDateRange = (date) => {
  const targetDate = new Date(date);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

// ✅ 刪除當天排班
export const deleteSingleDaySchedule = async (scheduleToDelete, schedules, setSchedules) => {
  // ✅ 確保包含必要的欄位
  const deleteData = {
    company_id: scheduleToDelete.schedule.company_id || scheduleToDelete.employee.company_id,
    employee_id: scheduleToDelete.employee.employee_id,
    start_date: scheduleToDelete.date,
    end_date: scheduleToDelete.date
  };
  
  console.log('🗑️ 發送單日刪除請求:', deleteData);
  
  const response = await axios.delete(`${API_BASE_URL}/api/schedule`, {
    data: deleteData,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 15000
  });
  
  if (response.data.Status === 'Ok') {
    const newSchedules = { ...schedules };
    if (newSchedules[scheduleToDelete.employee.employee_id]) {
      delete newSchedules[scheduleToDelete.employee.employee_id][scheduleToDelete.date];
      
      // ✅ 如果該員工沒有其他排班，清空該員工的排班物件
      if (Object.keys(newSchedules[scheduleToDelete.employee.employee_id]).length === 0) {
        delete newSchedules[scheduleToDelete.employee.employee_id];
      }
    }
    setSchedules(newSchedules);
    return { success: true };
  } else {
    throw new Error(response.data.Msg || '刪除排班失敗');
  }
};

// ✅ 刪除當週排班（處理本地排班 + 逐天發送 API）
export const deleteWeekSchedule = async (scheduleToDelete, selectedMonth, schedules, setSchedules, schedulesToSave, setSchedulesToSave) => {
  const { startDate, endDate } = getWeekDateRange(scheduleToDelete.date);
  
  console.log('🗑️ 週刪除範圍:', { startDate, endDate });
  
  // ✅ 1. 處理本地排班（從 schedulesToSave 中移除）
  const localSchedulesToRemove = schedulesToSave.filter(schedule => {
    const scheduleDate = new Date(schedule.start_date);
    const weekStart = new Date(startDate);
    const weekEnd = new Date(endDate);
    
    return schedule.employee_id === scheduleToDelete.employee.employee_id &&
           schedule.shift_type_id === scheduleToDelete.schedule.shift_type_id &&
           scheduleDate >= weekStart && scheduleDate <= weekEnd;
  });
  
  console.log('🗑️ 要移除的本地排班:', localSchedulesToRemove.length, '個');
  
  // 從本地待儲存列表中移除
  if (localSchedulesToRemove.length > 0) {
    setSchedulesToSave(prev => prev.filter(schedule => 
      !localSchedulesToRemove.some(toRemove => 
        toRemove.employee_id === schedule.employee_id && 
        toRemove.start_date === schedule.start_date
      )
    ));
    
    // 從本地排班狀態中移除
    const newSchedules = { ...schedules };
    localSchedulesToRemove.forEach(localSchedule => {
      if (newSchedules[localSchedule.employee_id] && 
          newSchedules[localSchedule.employee_id][localSchedule.start_date]) {
        delete newSchedules[localSchedule.employee_id][localSchedule.start_date];
      }
    });
    setSchedules(newSchedules);
  }
  
  // ✅ 2. 處理資料庫排班（逐天發送 API）
  const employeeSchedules = schedules[scheduleToDelete.employee.employee_id] || {};
  const weekDatesToDelete = Object.keys(employeeSchedules).filter(date => {
    const scheduleDate = new Date(date);
    const weekStart = new Date(startDate);
    const weekEnd = new Date(endDate);
    
    // 排除本地排班（已經在步驟1處理）
    const isLocalSchedule = schedulesToSave.some(s => 
      s.employee_id === scheduleToDelete.employee.employee_id && s.start_date === date
    );
    
    return scheduleDate >= weekStart && 
           scheduleDate <= weekEnd &&
           employeeSchedules[date].shift_type_id === scheduleToDelete.schedule.shift_type_id &&
           !isLocalSchedule; // ✅ 排除本地排班
  });
  
  console.log('🗑️ 週刪除 - 要刪除的資料庫排班日期:', weekDatesToDelete);
  
  if (weekDatesToDelete.length === 0) {
    console.log('✅ 該週沒有需要從資料庫刪除的排班');
    return { success: true };
  }
  
  // ✅ 逐天發送刪除請求
  const deletePromises = weekDatesToDelete.map(async (date) => {
    const deleteData = {
      company_id: scheduleToDelete.schedule.company_id || scheduleToDelete.employee.company_id,
      employee_id: scheduleToDelete.employee.employee_id,
      start_date: date,
      end_date: date
    };
    
    console.log(`🗑️ 發送單日刪除請求 (${date}):`, deleteData);
    
    return axios.delete(`${API_BASE_URL}/api/schedule`, {
      data: deleteData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });
  });
  
  // ✅ 等待所有刪除請求完成
  const results = await Promise.all(deletePromises);
  const failedDeletes = results.filter(result => result.data.Status !== 'Ok');
  
  if (failedDeletes.length > 0) {
    const failedCount = failedDeletes.length;
    const totalCount = results.length;
    throw new Error(`週刪除失敗: ${failedCount}/${totalCount} 個日期刪除失敗`);
  }
  
  // ✅ 更新本地狀態（移除資料庫排班）
  const newSchedules = { ...schedules };
  if (newSchedules[scheduleToDelete.employee.employee_id]) {
    weekDatesToDelete.forEach(date => {
      delete newSchedules[scheduleToDelete.employee.employee_id][date];
    });
    
    // 如果該員工沒有其他排班，清空該員工的排班物件
    if (Object.keys(newSchedules[scheduleToDelete.employee.employee_id]).length === 0) {
      delete newSchedules[scheduleToDelete.employee.employee_id];
    }
  }
  setSchedules(newSchedules);
  
  const totalDeleted = localSchedulesToRemove.length + weekDatesToDelete.length;
  console.log(`✅ 週刪除成功: 共刪除 ${totalDeleted} 天的排班 (本地: ${localSchedulesToRemove.length}, 資料庫: ${weekDatesToDelete.length})`);
  return { success: true };
};

// ✅ 刪除當月排班（處理本地排班 + 逐天發送 API）
export const deleteMonthSchedule = async (scheduleToDelete, selectedMonth, schedules, setSchedules, schedulesToSave, setSchedulesToSave) => {
  console.log('🗑️ 月刪除開始，月份:', selectedMonth);
  
  // ✅ 1. 處理本地排班（從 schedulesToSave 中移除）
  const localSchedulesToRemove = schedulesToSave.filter(schedule => {
    const scheduleDate = new Date(schedule.start_date);
    
    return schedule.employee_id === scheduleToDelete.employee.employee_id &&
           schedule.shift_type_id === scheduleToDelete.schedule.shift_type_id &&
           scheduleDate.getMonth() + 1 === selectedMonth;
  });
  
  console.log('🗑️ 要移除的本地排班:', localSchedulesToRemove.length, '個');
  
  // 從本地待儲存列表中移除
  if (localSchedulesToRemove.length > 0) {
    setSchedulesToSave(prev => prev.filter(schedule => 
      !localSchedulesToRemove.some(toRemove => 
        toRemove.employee_id === schedule.employee_id && 
        toRemove.start_date === schedule.start_date
      )
    ));
    
    // 從本地排班狀態中移除
    const newSchedules = { ...schedules };
    localSchedulesToRemove.forEach(localSchedule => {
      if (newSchedules[localSchedule.employee_id] && 
          newSchedules[localSchedule.employee_id][localSchedule.start_date]) {
        delete newSchedules[localSchedule.employee_id][localSchedule.start_date];
      }
    });
    setSchedules(newSchedules);
  }
  
  // ✅ 2. 處理資料庫排班（逐天發送 API）
  const employeeSchedules = schedules[scheduleToDelete.employee.employee_id] || {};
  const monthDatesToDelete = Object.keys(employeeSchedules).filter(date => {
    const scheduleDate = new Date(date);
    
    // 排除本地排班（已經在步驟1處理）
    const isLocalSchedule = schedulesToSave.some(s => 
      s.employee_id === scheduleToDelete.employee.employee_id && s.start_date === date
    );
    
    return scheduleDate.getMonth() + 1 === selectedMonth &&
           employeeSchedules[date].shift_type_id === scheduleToDelete.schedule.shift_type_id &&
           !isLocalSchedule; // ✅ 排除本地排班
  });
  
  console.log('🗑️ 月刪除 - 要刪除的資料庫排班日期:', monthDatesToDelete);
  
  if (monthDatesToDelete.length === 0) {
    console.log('✅ 該月沒有需要從資料庫刪除的排班');
    return { success: true };
  }
  
  // ✅ 逐天發送刪除請求
  const deletePromises = monthDatesToDelete.map(async (date) => {
    const deleteData = {
      company_id: scheduleToDelete.schedule.company_id || scheduleToDelete.employee.company_id,
      employee_id: scheduleToDelete.employee.employee_id,
      start_date: date,
      end_date: date
    };
    
    console.log(`🗑️ 發送單日刪除請求 (${date}):`, deleteData);
    
    return axios.delete(`${API_BASE_URL}/api/schedule`, {
      data: deleteData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });
  });
  
  // ✅ 等待所有刪除請求完成
  const results = await Promise.all(deletePromises);
  const failedDeletes = results.filter(result => result.data.Status !== 'Ok');
  
  if (failedDeletes.length > 0) {
    const failedCount = failedDeletes.length;
    const totalCount = results.length;
    throw new Error(`月刪除失敗: ${failedCount}/${totalCount} 個日期刪除失敗`);
  }
  
  // ✅ 更新本地狀態（移除資料庫排班）
  const newSchedules = { ...schedules };
  if (newSchedules[scheduleToDelete.employee.employee_id]) {
    monthDatesToDelete.forEach(date => {
      delete newSchedules[scheduleToDelete.employee.employee_id][date];
    });
    
    // 如果該員工沒有其他排班，清空該員工的排班物件
    if (Object.keys(newSchedules[scheduleToDelete.employee.employee_id]).length === 0) {
      delete newSchedules[scheduleToDelete.employee.employee_id];
    }
  }
  setSchedules(newSchedules);
  
  const totalDeleted = localSchedulesToRemove.length + monthDatesToDelete.length;
  console.log(`✅ 月刪除成功: 共刪除 ${totalDeleted} 天的排班 (本地: ${localSchedulesToRemove.length}, 資料庫: ${monthDatesToDelete.length})`);
  return { success: true };
};

// ✅ 判斷是本地排班還是資料庫排班
export const isLocalSchedule = (schedulesToSave, employeeId, date) => {
  return schedulesToSave.some(schedule => 
    schedule.employee_id === employeeId && schedule.start_date === date
  );
};

export const handleDeleteByRange = async (scheduleToDelete, deleteOption, selectedMonth, schedules, setSchedules, schedulesToSave, setSchedulesToSave) => {
  console.log('🔍 handleDeleteByRange 接收到的參數:', { deleteOption, isLocal: scheduleToDelete.isLocal });
  
  // ✅ 如果是本地排班，統一處理所有刪除選項
  if (scheduleToDelete.isLocal) {
    console.log('✅ 處理本地排班刪除，選項:', deleteOption);
    
    const employeeId = scheduleToDelete.employee.employee_id;
    const shiftTypeId = scheduleToDelete.schedule.shift_type_id;
    const currentDate = scheduleToDelete.date;
    
    let datesToRemove = [];
    
    switch (deleteOption) {
      case 'current':
        // 只刪除當天
        datesToRemove = [currentDate];
        break;
        
      case 'week':
        // ✅ 修正：刪除當周所有相同班別的本地排班
        const { startDate, endDate } = getWeekDateRange(currentDate);
        console.log('🗑️ 本地排班週刪除範圍:', { startDate, endDate, currentDate });
        
        // ✅ 使用當前的 schedulesToSave 狀態來篩選
        datesToRemove = schedulesToSave
          .filter(schedule => {
            const scheduleDate = new Date(schedule.start_date);
            const weekStart = new Date(startDate);
            const weekEnd = new Date(endDate);
            
            const isInRange = schedule.employee_id === employeeId &&
                   schedule.shift_type_id === shiftTypeId &&
                   scheduleDate >= weekStart && scheduleDate <= weekEnd;
            
            console.log('🔍 檢查本地排班:', {
              scheduleDate: schedule.start_date,
              employeeMatch: schedule.employee_id === employeeId,
              shiftMatch: schedule.shift_type_id === shiftTypeId,
              dateInRange: scheduleDate >= weekStart && scheduleDate <= weekEnd,
              isInRange
            });
            
            return isInRange;
          })
          .map(schedule => schedule.start_date);
        break;
        
      case 'month':
        // ✅ 修正：刪除當月所有相同班別的本地排班
        console.log('🗑️ 本地排班月刪除，月份:', selectedMonth);
        
        datesToRemove = schedulesToSave
          .filter(schedule => {
            const scheduleDate = new Date(schedule.start_date);
            const isInRange = schedule.employee_id === employeeId &&
                   schedule.shift_type_id === shiftTypeId &&
                   scheduleDate.getMonth() + 1 === selectedMonth;
            
            console.log('🔍 檢查本地排班月份:', {
              scheduleDate: schedule.start_date,
              scheduleMonth: scheduleDate.getMonth() + 1,
              targetMonth: selectedMonth,
              employeeMatch: schedule.employee_id === employeeId,
              shiftMatch: schedule.shift_type_id === shiftTypeId,
              isInRange
            });
            
            return isInRange;
          })
          .map(schedule => schedule.start_date);
        break;
        
      default:
        throw new Error(`未知的刪除選項: ${deleteOption}`);
    }
    
    console.log('🗑️ 本地排班要刪除的日期:', datesToRemove);
    
    if (datesToRemove.length === 0) {
      console.log('⚠️ 沒有找到要刪除的本地排班');
      return { success: true };
    }
    
    // ✅ 從 schedulesToSave 中移除
    setSchedulesToSave(prev => {
      const filtered = prev.filter(schedule => 
        !(schedule.employee_id === employeeId && datesToRemove.includes(schedule.start_date))
      );
      console.log('🗑️ 更新 schedulesToSave:', {
        原本數量: prev.length,
        刪除後數量: filtered.length,
        刪除的日期: datesToRemove
      });
      return filtered;
    });
    
    // ✅ 從本地排班狀態中移除
    setSchedules(prev => {
      const newSchedules = { ...prev };
      datesToRemove.forEach(date => {
        if (newSchedules[employeeId] && newSchedules[employeeId][date]) {
          console.log('🗑️ 從 schedules 中移除:', { employeeId, date });
          delete newSchedules[employeeId][date];
        }
      });
      
      // 如果該員工沒有其他排班，清空該員工的排班物件
      if (newSchedules[employeeId] && Object.keys(newSchedules[employeeId]).length === 0) {
        console.log('🗑️ 清空員工排班物件:', employeeId);
        delete newSchedules[employeeId];
      }
      
      return newSchedules;
    });
    
    console.log(`✅ 本地排班刪除成功: 共刪除 ${datesToRemove.length} 天的排班`);
    return { success: true };
  }
  
  // ✅ 資料庫排班的處理邏輯
  switch (deleteOption) {
    case 'current':
      return await deleteSingleDaySchedule(scheduleToDelete, schedules, setSchedules);
      
    case 'week':
      return await deleteWeekSchedule(scheduleToDelete, selectedMonth, schedules, setSchedules, schedulesToSave, setSchedulesToSave);
      
    case 'month':
      return await deleteMonthSchedule(scheduleToDelete, selectedMonth, schedules, setSchedules, schedulesToSave, setSchedulesToSave);
      
    default:
      console.error('❌ 未知的刪除選項:', deleteOption);
      throw new Error(`未知的刪除選項: ${deleteOption}`);
  }
};


// 關閉刪除選項卡片的處理函數
export const handleCloseDeleteCard = (setShowDeleteOptions, setScheduleToDelete) => {
  setShowDeleteOptions(null);
  setScheduleToDelete(null);
};

// 批量刪除排班
export const batchDeleteSchedules = async (
  schedulesToDelete,
  setLoading,
  setSchedules,
  setSuccessMessage,
  setError
) => {
  try {
    setLoading(true);
    
    const deletePromises = schedulesToDelete.map(schedule => 
      axios.delete(`${API_BASE_URL}/api/schedule`, {
        data: {
          company_id: schedule.company_id,
          employee_id: schedule.employee_id,
          start_date: schedule.start_date,
          end_date: schedule.end_date
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      })
    );
    
    const results = await Promise.all(deletePromises);
    const failedDeletes = results.filter(result => result.data.Status !== 'Ok');
    
    if (failedDeletes.length > 0) {
      throw new Error(`批量刪除失敗: ${failedDeletes[0].data.Msg || '請求失敗'}`);
    }
    
    setSuccessMessage(`已成功刪除 ${schedulesToDelete.length} 個排班`);
    
  } catch (err) {
    console.error('批量刪除排班失敗:', err);
    setError(`批量刪除失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

// 檢查排班是否可刪除
export const checkScheduleDeletable = (schedule, schedules, employeeId) => {
  // 檢查是否有相關聯的排班
  const relatedSchedules = Object.entries(schedules).filter(([empId, empSchedules]) => 
    empId === employeeId && 
    Object.values(empSchedules).some(s => s.shift_type_id === schedule.shift_type_id)
  );
  
  return {
    canDelete: true,
    hasRelatedSchedules: relatedSchedules.length > 1,
    relatedCount: relatedSchedules.length
  };
};

// 獲取刪除選項
export const getDeleteOptions = (schedule, hasOtherSchedules) => {
  const options = [
    {
      value: 'current',
      label: '僅刪除此日期',
      description: '只刪除選定日期的排班'
    }
  ];
  
  if (hasOtherSchedules) {
    options.push({
      value: 'month',
      label: '刪除本月所有相同班別',
      description: '刪除該員工本月所有相同班別的排班'
    });
    
    if (schedule.repeat_frequency === 'daily') {
      options.push({
        value: 'all',
        label: '刪除所有相同班別',
        description: '刪除該員工所有相同班別的排班'
      });
    }
  }
  
  return options;
};

// 預覽刪除影響
export const previewDeleteImpact = (scheduleToDelete, deleteOption, schedules, selectedMonth) => {
  if (!scheduleToDelete) return { affectedDates: [], affectedCount: 0 };
  
  const { employee, schedule } = scheduleToDelete;
  const employeeSchedules = schedules[employee.employee_id] || {};
  
  let affectedDates = [];
  
  if (deleteOption === 'current') {
    affectedDates = [scheduleToDelete.date];
  } else if (deleteOption === 'week') {
    const { startDate, endDate } = getWeekDateRange(scheduleToDelete.date);
    affectedDates = Object.entries(employeeSchedules)
      .filter(([date, scheduleData]) => {
        const scheduleDate = new Date(date);
        const weekStart = new Date(startDate);
        const weekEnd = new Date(endDate);
        return scheduleData.shift_type_id === schedule.shift_type_id &&
               scheduleDate >= weekStart && scheduleDate <= weekEnd;
      })
      .map(([date]) => date);
  } else if (deleteOption === 'month') {
    affectedDates = Object.entries(employeeSchedules)
      .filter(([date, scheduleData]) => {
        const scheduleDate = new Date(date);
        return scheduleData.shift_type_id === schedule.shift_type_id &&
               scheduleDate.getMonth() + 1 === selectedMonth;
      })
      .map(([date]) => date);
  }
  
  return {
    affectedDates: affectedDates.sort(),
    affectedCount: affectedDates.length
  };
};

// 結束選取班別（不是刪除）
export const handleDeselectShiftType = (
  setSelectedShift,
  setSuccessMessage
) => {
  setSelectedShift(null);
  // setSuccessMessage('已結束班別選取');
};

// 切換班別選取狀態
export const toggleShiftSelection = (
  shift,
  selectedShift,
  setSelectedShift,
  setSuccessMessage
) => {
  if (selectedShift?.shift_type_id === shift.shift_type_id) {
    // 如果點擊的是已選取的班別，則結束選取
    handleDeselectShiftType(setSelectedShift, setSuccessMessage);
  } else {
    // 選取新的班別
    setSelectedShift(shift);
    setSuccessMessage(`已選取班別「${shift.shift_name}」`);
  }
};

// 檢查班別是否被選取
export const isShiftSelected = (shift, selectedShift) => {
  return selectedShift?.shift_type_id === shift.shift_type_id;
};
