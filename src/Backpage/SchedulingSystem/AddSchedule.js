import axios from 'axios';

// 設定 API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

// ===== 📝 新增班別 API 函數區域 =====

// ➕ 新增班別 API
export const addShiftTypeAPI = async (companyId, department, shiftData) => {
  try {
    console.log('🆕 新增班別:', shiftData);
    
    const response = await axios.post(`${API_BASE_URL}/api/company/shifts`, {
      company_id: companyId,
      shift_name: shiftData.shift_name,
      start_time: shiftData.start_time,
      end_time: shiftData.end_time,
      break_time_start: shiftData.break_time_start,
      break_time_end: shiftData.break_time_end,
      repeat_frequency: shiftData.repeat_frequency,
      department: department
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    if (response.data.Status === 'Ok') {
      return { success: true, data: response.data.Data };
    } else {
      return {
        success: false,
        error: response.data.Msg || '新增班別失敗'
      };
    }
  } catch (err) {
    console.error('❌ 新增班別失敗:', err);
    if (err.response) {
      const errorMsg = `新增班別 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (err.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    return { success: false, error: `新增班別失敗: ${err.message}` };
  }
};

// ===== 🔧 班別新增處理函數區域 =====

// 處理新增班別
export const handleAddShift = (
  newShift,
  setLocalShiftTypes,
  setShowAddShiftModal,
  setNewShift,
  setSuccessMessage,
  setError
) => {
  if (!newShift.shift_name.trim()) {
    setError('請輸入班別名稱');
    return false;
  }
  if (!newShift.start_time || !newShift.end_time) {
    setError('請輸入開始和結束時間');
    return false;
  }

  // 驗證時間格式
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(newShift.start_time) || !timeRegex.test(newShift.end_time)) {
    setError('請輸入正確的時間格式 (HH:MM)');
    return false;
  }

  // 驗證休息時間（如果有填寫）
  if (newShift.break_time_start && newShift.break_time_end) {
    if (!timeRegex.test(newShift.break_time_start) || !timeRegex.test(newShift.break_time_end)) {
      setError('請輸入正確的休息時間格式 (HH:MM)');
      return false;
    }
  }

  const tempId = `temp_${Date.now()}`;
  const newShiftType = {
    shift_type_id: tempId,
    shift_name: newShift.shift_name,
    shift_category: newShift.shift_name,
    start_time: newShift.start_time,
    end_time: newShift.end_time,
    break_time_start: newShift.break_time_start || null,
    break_time_end: newShift.break_time_end || null,
    repeat_frequency: newShift.repeat_frequency,
    isLocal: true
  };
  
  setLocalShiftTypes(prev => [...prev, newShiftType]);
  setShowAddShiftModal(false);
  setNewShift({
    shift_name: '',
    start_time: '',
    end_time: '',
    break_time_start: '',
    break_time_end: '',
    repeat_frequency: 'daily'
  });
  setSuccessMessage(`已新增班別「${newShift.shift_name}」，請記得儲存草稿`);
  return true;
};

// 取消新增班別
export const cancelAddShift = (
  setShowAddShiftModal,
  setNewShift,
  setError
) => {
  setShowAddShiftModal(false);
  setNewShift({
    shift_name: '',
    start_time: '',
    end_time: '',
    break_time_start: '',
    break_time_end: '',
    repeat_frequency: 'daily'
  });
  setError('');
};

// 處理新增表單變更
export const handleAddShiftChange = (
  field,
  value,
  newShift,
  setNewShift
) => {
  setNewShift(prev => ({
    ...prev,
    [field]: value
  }));
};

// 驗證新增表單
export const validateAddShift = (newShift, localShiftTypes, setError) => {
  // 檢查班別名稱是否重複
  const isDuplicateName = localShiftTypes.some(shift => 
    shift.shift_name.toLowerCase() === newShift.shift_name.toLowerCase()
  );
  
  if (isDuplicateName) {
    setError('班別名稱已存在，請使用不同的名稱');
    return false;
  }

  // 檢查時間邏輯
  if (newShift.start_time && newShift.end_time) {
    const startTime = new Date(`2000-01-01 ${newShift.start_time}`);
    const endTime = new Date(`2000-01-01 ${newShift.end_time}`);
    
    // 如果結束時間小於開始時間，假設跨日
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const diffHours = (endTime - startTime) / (1000 * 60 * 60);
    if (diffHours > 24) {
      setError('工作時間不能超過24小時');
      return false;
    }
  }

  // 檢查休息時間邏輯
  if (newShift.break_time_start && newShift.break_time_end) {
    const breakStart = new Date(`2000-01-01 ${newShift.break_time_start}`);
    const breakEnd = new Date(`2000-01-01 ${newShift.break_time_end}`);
    
    if (breakEnd <= breakStart) {
      breakEnd.setDate(breakEnd.getDate() + 1);
    }
    
    const breakDiffHours = (breakEnd - breakStart) / (1000 * 60 * 60);
    if (breakDiffHours > 4) {
      setError('休息時間不能超過4小時');
      return false;
    }
  }

  return true;
};

// 重置新增表單
export const resetAddShiftForm = (setNewShift, setError) => {
  setNewShift({
    shift_name: '',
    start_time: '',
    end_time: '',
    break_time_start: '',
    break_time_end: '',
    repeat_frequency: 'daily'
  });
  setError('');
};

// 生成班別預覽
export const generateShiftPreview = (newShift) => {
  if (!newShift.shift_name || !newShift.start_time || !newShift.end_time) {
    return null;
  }

  const startTime = new Date(`2000-01-01 ${newShift.start_time}`);
  const endTime = new Date(`2000-01-01 ${newShift.end_time}`);
  
  // 如果結束時間小於開始時間，假設跨日
  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }
  
  const workHours = (endTime - startTime) / (1000 * 60 * 60);
  
  let breakHours = 0;
  if (newShift.break_time_start && newShift.break_time_end) {
    const breakStart = new Date(`2000-01-01 ${newShift.break_time_start}`);
    const breakEnd = new Date(`2000-01-01 ${newShift.break_time_end}`);
    
    if (breakEnd <= breakStart) {
      breakEnd.setDate(breakEnd.getDate() + 1);
    }
    
    breakHours = (breakEnd - breakStart) / (1000 * 60 * 60);
  }
  
  const netWorkHours = workHours - breakHours;

  return {
    workHours: Math.round(workHours * 10) / 10,
    breakHours: Math.round(breakHours * 10) / 10,
    netWorkHours: Math.round(netWorkHours * 10) / 10
  };
};

// 獲取頻率選項
export const getFrequencyOptions = () => {
  return [
    { value: 'daily', label: '每日', description: '適用於所有日期' },
    { value: 'weekdays', label: '平日', description: '僅適用於週一至週五' },
    { value: 'holiday', label: '假日', description: '僅適用於週六、週日' }
  ];
};

// 檢查班別時間衝突
export const checkShiftTimeConflict = (newShift, existingShifts) => {
  const conflicts = [];
  
  existingShifts.forEach(shift => {
    // 檢查同頻率的班別是否有時間重疊
    if (shift.repeat_frequency === newShift.repeat_frequency || 
        shift.repeat_frequency === 'daily' || 
        newShift.repeat_frequency === 'daily') {
      
      const newStart = new Date(`2000-01-01 ${newShift.start_time}`);
      const newEnd = new Date(`2000-01-01 ${newShift.end_time}`);
      const existingStart = new Date(`2000-01-01 ${shift.start_time}`);
      const existingEnd = new Date(`2000-01-01 ${shift.end_time}`);
      
      // 處理跨日情況
      if (newEnd <= newStart) newEnd.setDate(newEnd.getDate() + 1);
      if (existingEnd <= existingStart) existingEnd.setDate(existingEnd.getDate() + 1);
      
      // 檢查時間重疊
      if ((newStart < existingEnd && newEnd > existingStart)) {
        conflicts.push({
          shiftName: shift.shift_name,
          reason: '時間重疊'
        });
      }
    }
  });
  
  return conflicts;
};

// 批量新增班別
export const handleBatchAddShifts = async (
  shiftsToAdd,
  companyId,
  department,
  setLoading,
  setLocalShiftTypes,
  setSuccessMessage,
  setError
) => {
  try {
    setLoading(true);
    
    const addPromises = shiftsToAdd.map(shift => 
      addShiftTypeAPI(companyId, department, shift)
    );
    
    const results = await Promise.all(addPromises);
    const failedAdds = results.filter(result => !result.success);
    
    if (failedAdds.length > 0) {
      throw new Error(`批量新增失敗: ${failedAdds[0].error}`);
    }
    
    // 清空本地新增的班別
    setLocalShiftTypes(prev => 
      prev.filter(shift => !shiftsToAdd.find(s => s.shift_type_id === shift.shift_type_id))
    );
    
    setSuccessMessage(`已成功新增 ${shiftsToAdd.length} 個班別`);
    
  } catch (err) {
    console.error('批量新增班別失敗:', err);
    setError(`批量新增失敗: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

// 從範本新增班別
export const addShiftFromTemplate = (
  template,
  setLocalShiftTypes,
  setSuccessMessage
) => {
  const tempId = `temp_${Date.now()}`;
  const newShiftType = {
    shift_type_id: tempId,
    shift_name: template.shift_name,
    shift_category: template.shift_name,
    start_time: template.start_time,
    end_time: template.end_time,
    break_time_start: template.break_time_start || null,
    break_time_end: template.break_time_end || null,
    repeat_frequency: template.repeat_frequency,
    isLocal: true
  };
  
  setLocalShiftTypes(prev => [...prev, newShiftType]);
  setSuccessMessage(`已從範本新增班別「${template.shift_name}」`);
};

// 獲取常用班別範本
export const getShiftTemplates = () => {
  return [
    {
      shift_name: '早班',
      start_time: '08:00',
      end_time: '17:00',
      break_time_start: '12:00',
      break_time_end: '13:00',
      repeat_frequency: 'weekdays'
    },
    {
      shift_name: '晚班',
      start_time: '17:00',
      end_time: '02:00',
      break_time_start: '21:00',
      break_time_end: '22:00',
      repeat_frequency: 'daily'
    },
    {
      shift_name: '夜班',
      start_time: '22:00',
      end_time: '08:00',
      break_time_start: '02:00',
      break_time_end: '03:00',
      repeat_frequency: 'daily'
    },
    {
      shift_name: '假日班',
      start_time: '09:00',
      end_time: '18:00',
      break_time_start: '12:30',
      break_time_end: '13:30',
      repeat_frequency: 'holiday'
    }
  ];
};

// 複製現有班別
export const duplicateShift = (
  originalShift,
  setLocalShiftTypes,
  setSuccessMessage
) => {
  const tempId = `temp_${Date.now()}`;
  const duplicatedShift = {
    shift_type_id: tempId,
    shift_name: `${originalShift.shift_name} (副本)`,
    shift_category: `${originalShift.shift_name} (副本)`,
    start_time: originalShift.start_time,
    end_time: originalShift.end_time,
    break_time_start: originalShift.break_time_start,
    break_time_end: originalShift.break_time_end,
    repeat_frequency: originalShift.repeat_frequency,
    isLocal: true
  };
  
  setLocalShiftTypes(prev => [...prev, duplicatedShift]);
  setSuccessMessage(`已複製班別「${originalShift.shift_name}」`);
};

// 匯入班別資料
export const importShifts = (
  importData,
  setLocalShiftTypes,
  setSuccessMessage,
  setError
) => {
  try {
    const validShifts = [];
    const errors = [];
    
    importData.forEach((shift, index) => {
      // 驗證必要欄位
      if (!shift.shift_name || !shift.start_time || !shift.end_time) {
        errors.push(`第 ${index + 1} 行：缺少必要欄位`);
        return;
      }
      
      // 驗證時間格式
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(shift.start_time) || !timeRegex.test(shift.end_time)) {
        errors.push(`第 ${index + 1} 行：時間格式錯誤`);
        return;
      }
      
      const tempId = `temp_${Date.now()}_${index}`;
      validShifts.push({
        shift_type_id: tempId,
        shift_name: shift.shift_name,
        shift_category: shift.shift_name,
        start_time: shift.start_time,
        end_time: shift.end_time,
        break_time_start: shift.break_time_start || null,
        break_time_end: shift.break_time_end || null,
        repeat_frequency: shift.repeat_frequency || 'daily',
        isLocal: true
      });
    });
    
    if (errors.length > 0) {
      setError(`匯入錯誤：\n${errors.join('\n')}`);
      return false;
    }
    
    setLocalShiftTypes(prev => [...prev, ...validShifts]);
    setSuccessMessage(`已成功匯入 ${validShifts.length} 個班別`);
    return true;
    
  } catch (err) {
    console.error('匯入班別失敗:', err);
    setError(`匯入失敗: ${err.message}`);
    return false;
  }
};

// 匯出班別資料
export const exportShifts = (shifts) => {
  const exportData = shifts.map(shift => ({
    shift_name: shift.shift_name,
    start_time: shift.start_time,
    end_time: shift.end_time,
    break_time_start: shift.break_time_start || '',
    break_time_end: shift.break_time_end || '',
    repeat_frequency: shift.repeat_frequency
  }));
  
  return exportData;
};
