import axios from 'axios';

// 設定 API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

// ===== 📝 排班編輯 API 函數區域 =====

// 📝 更新排班 API
export const updateScheduleAPI = async (updateData) => {
  try {
    console.log('📝 發送排班更新請求:', updateData);
    
    const response = await axios.put(`${API_BASE_URL}/api/schedule`, updateData, {
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
        error: response.data.Msg || '更新排班失敗'
      };
    }
  } catch (err) {
    console.error('❌ 更新排班失敗:', err);
    if (err.response) {
      const errorMsg = `更新 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (err.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    return { success: false, error: `更新失敗: ${err.message}` };
  }
};

// ===== 📝 排班編輯處理函數區域 =====

// 處理排班編輯
export const handleEditSchedule = (
  employee,
  date,
  schedule,
  setEditingEmployee,
  setEditingDate,
  setEditingSchedule,
  setShowEditModal
) => {
  console.log('🖊️ 編輯排班:', { employee: employee.employee_id, date, schedule });
  
  setEditingEmployee(employee);
  setEditingDate(date);
  setEditingSchedule({
    ...schedule,
    original_shift_type_id: schedule.shift_type_id
  });
  setShowEditModal(true);
};

// 確認編輯排班
export const confirmEditSchedule = async (
  editingSchedule,
  editingEmployee,
  editingDate,
  selectedMonth,
  schedules,
  displayShiftTypes,
  companyId,
  selectedYear,
  setLoading,
  setSchedules,
  setSuccessMessage,
  setError,
  setShowEditModal,
  setEditingSchedule,
  setEditingEmployee,
  setEditingDate,
  getLocalDateString
) => {
  if (!editingSchedule || !editingEmployee || !editingDate) return;
  
  try {
    setLoading(true);
    
    const editTime = getLocalDateString ? getLocalDateString(new Date()) : new Date().toISOString().split('T')[0];
    console.log('📝 編輯時間:', editTime);
    
    const updateData = {
      company_id: editingSchedule.company_id,
      employee_id: editingSchedule.employee_id,
      start_date: editingDate,
      end_date: editingDate,
      month: selectedMonth,
      shift_type_id: editingSchedule.original_shift_type_id,
      new_shift_type_id: editingSchedule.shift_type_id,
      new_start_date: editingDate,
      new_end_date: editingDate,
      new_month: selectedMonth
    };
    
    const updateResult = await updateScheduleAPI(updateData);
    
    if (updateResult.success) {
      const newSchedules = { ...schedules };
      if (!newSchedules[editingEmployee.employee_id]) {
        newSchedules[editingEmployee.employee_id] = {};
      }
      
      const shiftType = displayShiftTypes.find(st => st.shift_type_id === editingSchedule.shift_type_id);
      newSchedules[editingEmployee.employee_id][editingDate] = {
        shift_type_id: editingSchedule.shift_type_id,
        shift_name: shiftType?.shift_name || shiftType?.shift_category || '未知班別',
        start_time: shiftType?.start_time || '00:00',
        end_time: shiftType?.end_time || '00:00',
        break_time_start: shiftType?.break_time_start,
        break_time_end: shiftType?.break_time_end,
        repeat_frequency: shiftType?.repeat_frequency,
        schedule_id: editingSchedule.schedule_id,
        company_id: editingSchedule.company_id,
        employee_id: editingSchedule.employee_id,
        original_start_date: editingSchedule.original_start_date,
        original_end_date: editingSchedule.original_end_date
      };
      
      setSchedules(newSchedules);
      setSuccessMessage(`已更新 ${editingEmployee.name} 在 ${editingDate} 的排班 (${editTime})`);
      
      // ✅ 需要動態匯入 fetchCompanyScheduleAPI
      try {
        const { fetchCompanyScheduleAPI } = await import('./CheckSchedule');
        const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth);
        if (scheduleResult.success && scheduleResult.data.schedules) {
          setSchedules(scheduleResult.data.schedules);
        }
      } catch (importError) {
        console.warn('無法重新載入排班資料:', importError);
      }
    } else {
      setError(updateResult.error);
    }
    
    setShowEditModal(false);
    setEditingSchedule(null);
    setEditingEmployee(null);
    setEditingDate(null);
    
  } catch (err) {
    console.error('更新排班失敗:', err);
    setError(`更新失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};


// 取消編輯排班
export const cancelEditSchedule = (
  setShowEditModal,
  setEditingSchedule,
  setEditingEmployee,
  setEditingDate
) => {
  setShowEditModal(false);
  setEditingSchedule(null);
  setEditingEmployee(null);
  setEditingDate(null);
};

// 處理編輯表單變更
export const handleEditScheduleChange = (
  field,
  value,
  editingSchedule,
  setEditingSchedule
) => {
  setEditingSchedule(prev => ({
    ...prev,
    [field]: value
  }));
};

// 驗證編輯表單
export const validateEditSchedule = (editingSchedule, displayShiftTypes, setError) => {
  if (!editingSchedule.shift_type_id) {
    setError('請選擇班別');
    return false;
  }
  
  const selectedShift = displayShiftTypes.find(shift => 
    shift.shift_type_id === editingSchedule.shift_type_id
  );
  
  if (!selectedShift) {
    setError('選擇的班別不存在');
    return false;
  }
  
  return true;
};

// 重置編輯狀態
export const resetEditState = (
  setShowEditModal,
  setEditingSchedule,
  setEditingEmployee,
  setEditingDate
) => {
  setShowEditModal(false);
  setEditingSchedule(null);
  setEditingEmployee(null);
  setEditingDate(null);
};

// 檢查編輯權限
export const checkEditPermission = (schedule, employee, currentUser) => {
  // 這裡可以添加權限檢查邏輯
  // 例如：只有管理員或排班負責人可以編輯
  // 或者只能編輯未來的排班等
  
  // 暫時返回 true，允許所有編輯
  return true;
};

// 獲取可編輯的班別列表
export const getEditableShiftTypes = (displayShiftTypes, employee, date) => {
  // 這裡可以根據員工和日期過濾可選的班別
  // 例如：根據員工的工作類型、日期的性質（平日/假日）等
  
  const dateObj = new Date(date);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
  
  return displayShiftTypes.filter(shift => {
    // 根據頻率過濾班別
    if (shift.repeat_frequency === 'weekdays' && isWeekend) {
      return false;
    }
    if (shift.repeat_frequency === 'holiday' && !isWeekend) {
      return false;
    }
    return true;
  });
};

// 格式化編輯歷史記錄
export const formatEditHistory = (schedule) => {
  const history = [];
  
  if (schedule.original_start_date && schedule.original_end_date) {
    history.push({
      action: '原始排班',
      date: schedule.original_start_date,
      details: `${schedule.original_start_date} 至 ${schedule.original_end_date}`
    });
  }
  
  // 可以添加更多歷史記錄邏輯
  
  return history;
};

// 比較排班變更
export const compareScheduleChanges = (originalSchedule, newSchedule, displayShiftTypes) => {
  const changes = [];
  
  if (originalSchedule.shift_type_id !== newSchedule.shift_type_id) {
    const originalShift = displayShiftTypes.find(s => s.shift_type_id === originalSchedule.shift_type_id);
    const newShift = displayShiftTypes.find(s => s.shift_type_id === newSchedule.shift_type_id);
    
    changes.push({
      field: '班別',
      from: originalShift?.shift_name || originalShift?.shift_category || '未知',
      to: newShift?.shift_name || newShift?.shift_category || '未知'
    });
  }
  
  return changes;
};

// 生成編輯確認訊息
export const generateEditConfirmMessage = (employee, date, changes) => {
  let message = `確定要修改 ${employee.name} 在 ${date} 的排班嗎？\n\n`;
  
  if (changes.length > 0) {
    message += '變更內容：\n';
    changes.forEach(change => {
      message += `• ${change.field}：${change.from} → ${change.to}\n`;
    });
  }
  
  return message;
};

// 處理批量編輯
export const handleBatchEdit = async (
  scheduleList,
  newShiftTypeId,
  displayShiftTypes,
  setLoading,
  setSchedules,
  setSuccessMessage,
  setError
) => {
  try {
    setLoading(true);
    
    const updatePromises = scheduleList.map(({ employee, date, schedule }) => {
      const updateData = {
        company_id: schedule.company_id,
        employee_id: schedule.employee_id,
        start_date: date,
        end_date: date,
        month: new Date(date).getMonth() + 1,
        shift_type_id: schedule.shift_type_id,
        new_shift_type_id: newShiftTypeId,
        new_start_date: date,
        new_end_date: date,
        new_month: new Date(date).getMonth() + 1
      };
      
      return updateScheduleAPI(updateData);
    });
    
    const results = await Promise.all(updatePromises);
    const failedUpdates = results.filter(result => !result.success);
    
    if (failedUpdates.length > 0) {
      throw new Error(`批量更新失敗: ${failedUpdates[0].error}`);
    }
    
    // 更新本地狀態
    const newSchedules = { ...scheduleList[0].schedules };
    const newShift = displayShiftTypes.find(s => s.shift_type_id === newShiftTypeId);
    
    scheduleList.forEach(({ employee, date }) => {
      if (!newSchedules[employee.employee_id]) {
        newSchedules[employee.employee_id] = {};
      }
      
      newSchedules[employee.employee_id][date] = {
        shift_type_id: newShiftTypeId,
        shift_name: newShift?.shift_name || newShift?.shift_category || '未知班別',
        start_time: newShift?.start_time || '00:00',
        end_time: newShift?.end_time || '00:00',
        break_time_start: newShift?.break_time_start,
        break_time_end: newShift?.break_time_end,
        repeat_frequency: newShift?.repeat_frequency
      };
    });
    
    setSchedules(newSchedules);
    setSuccessMessage(`已批量更新 ${scheduleList.length} 個排班`);
    
  } catch (err) {
    console.error('批量編輯失敗:', err);
    setError(`批量編輯失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
