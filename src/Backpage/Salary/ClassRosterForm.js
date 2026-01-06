import React, { useState, useEffect } from 'react';
import TimePickerInput from './Smallitems/Clock';

const ClassRosterForm = ({ 
  shifts = [],
  basicSettings = { monthlyLateLimit: 0, lateMinutesLimit: 0 },
  onUpdateShift, 
  onEditShift, 
  onDeleteShift, 
  onAddShift,
  onUpdateBasicSettings
}) => {
  
  // 本地狀態管理
  const [localShifts, setLocalShifts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // 🔥 新增：追蹤每個班別的修改狀態
  const [shiftChanges, setShiftChanges] = useState({});
  const [originalShifts, setOriginalShifts] = useState([]);

  // 添加獲取 cookies 的函數
  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // 🔥 修改：格式化可打卡時間範圍的輔助函數
  const formatPunchRange = (flexibleRange, tolerance, type) => {
    const minutes = flexibleRange || tolerance || 0;
    
  if (minutes === 0) return '選擇';
  if (minutes <= 5) return type === 'start' ? '5分鐘前' : '5分鐘後';
  if (minutes <= 10) return type === 'start' ? '10分鐘前' : '10分鐘後';
  if (minutes <= 15) return type === 'start' ? '15分鐘前' : '15分鐘後';
  if (minutes <= 30) return type === 'start' ? '30分鐘前' : '30分鐘後';
    return '選擇';
  };

  // 🔥 修改：將時間範圍文字轉換為分鐘數的輔助函數
  const convertRangeToMinutes = (rangeText) => {
    switch (rangeText) {
      case '5分鐘前':
      case '5分鐘後':
        return 5;
      case '10分鐘前':
      case '10分鐘後':
        return 10;
      case '15分鐘前':
      case '15分鐘後':
        return 15;
      case '30分鐘前':
      case '30分鐘後':
        return 30;
      default:
        return 10;
    }
  };


  // 🔥 新增：檢查單個班別是否有修改的函數
  const checkShiftChanges = (currentShift, originalShift) => {
    if (!originalShift) return true; // 新班別
    
    const fieldsToCheck = ['name', 'code', 'startTime', 'endTime', 'breakStart', 'breakEnd', 'punchStartRange', 'punchEndRange'];
    
    for (const field of fieldsToCheck) {
      if (currentShift[field] !== originalShift[field]) {
        return true;
      }
    }
    return false;
  };

  // 🔥 新增：載入現有班別資料的函數
  const loadExistingShifts = async () => {
    try {
      setIsLoading(true);
      const companyId = getCookieValue('company_id');
      
      if (!companyId) {
        console.error('無法獲取公司ID');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://rabbit.54ucl.com:3004/api/shift-types?company_id=${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.Status === "Ok" && result.Data) {
        // 🔥 將 API 資料轉換為前端需要的格式
        const formattedShifts = result.Data.map((shift, index) => ({
          id: `${shift.shift_type_id}_${index}`, // 確保唯一 ID
          name: shift.shift_category || '', // 班別名稱
          code: shift.shift_type_id || '', // 代號
          startTime: shift.start_time ? shift.start_time.substring(0, 5) : '09:00', // 上班時間（去掉秒數）
          endTime: shift.end_time ? shift.end_time.substring(0, 5) : '18:00', // 下班時間（去掉秒數）
          breakStart: shift.break_time_start ? shift.break_time_start.substring(0, 5) : '12:00', // 休息開始時間
          breakEnd: shift.break_time_end ? shift.break_time_end.substring(0, 5) : '13:00', // 休息結束時間
          // 🔥 根據 API 資料設定可打卡時間範圍
          punchStartRange: formatPunchRange(shift.flexible_range, shift.late_tolerance, 'start'),
          punchEndRange: formatPunchRange(shift.flexible_range, shift.early_leave_tolerance, 'end'),
          // 原始 API 資料（用於後續更新）
          originalData: shift,
          isNew: false // 標記為現有班別
        }));
        
        setLocalShifts(formattedShifts);
        setOriginalShifts(JSON.parse(JSON.stringify(formattedShifts))); // 深拷貝作為原始資料
        setShiftChanges({}); // 重置修改狀態
        console.log('載入班別資料成功:', formattedShifts);
      } else {
        console.log('沒有班別資料或載入失敗:', result);
        setLocalShifts([]);
        setOriginalShifts([]);
        setShiftChanges({});
      }
    } catch (error) {
      console.error('載入班別資料失敗:', error);
      setLocalShifts([]);
      setOriginalShifts([]);
      setShiftChanges({});
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 在組件載入時自動載入現有班別資料
  useEffect(() => {
    loadExistingShifts();
  }, []);

  // 🔥 新增：監聽 localShifts 變化，檢查每個班別的修改狀態
  useEffect(() => {
    if (originalShifts.length > 0) {
      const newShiftChanges = {};
      
      localShifts.forEach(shift => {
        const originalShift = originalShifts.find(orig => orig.id === shift.id);
        newShiftChanges[shift.id] = checkShiftChanges(shift, originalShift);
      });
      
      setShiftChanges(newShiftChanges);
    }
  }, [localShifts, originalShifts]);

  // 🔥 新增：創建班別類型 API
  const handleCreateShiftType = async (shiftData) => {
    try {
      const companyId = getCookieValue('company_id');
      
      if (!companyId) {
        throw new Error('無法獲取公司ID，請重新登入');
      }

      const response = await fetch('https://rabbit.54ucl.com:3004/api/shift-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: companyId,
          shift_type_id: shiftData.code,
          shift_category: shiftData.name,
          start_time: shiftData.startTime + ':00', // 加上秒數
          end_time: shiftData.endTime + ':00',
          break_time_start: shiftData.breakStart + ':00',
          break_time_end: shiftData.breakEnd + ':00',
          repeat_frequency: 'daily',
          flexible_range: convertRangeToMinutes(shiftData.punchStartRange),
          late_tolerance: convertRangeToMinutes(shiftData.punchStartRange),
          early_leave_tolerance: convertRangeToMinutes(shiftData.punchEndRange),
          department: null
        })
      });

      const result = await response.json();
      
      if (result.Status === "Ok") {
        return { success: true, data: result };
      } else {
        throw new Error(result.Msg || '新增班別失敗');
      }
    } catch (error) {
      console.error('API 調用錯誤:', error);
      throw error;
    }
  };

  // 🔥 新增：修改班別類型 API
  const handleUpdateShiftType = async (shiftTypeId, shiftData) => {
    try {
      const companyId = getCookieValue('company_id');
      
      if (!companyId) {
        throw new Error('無法獲取公司ID，請重新登入');
      }

      const response = await fetch(`https://rabbit.54ucl.com:3004/api/shift-types/${shiftTypeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `company_id=${companyId}`
        },
        body: JSON.stringify({
          company_id: companyId,
          shift_category: shiftData.name,
          start_time: shiftData.startTime + ':00',
          end_time: shiftData.endTime + ':00',
          break_time_start: shiftData.breakStart + ':00',
          break_time_end: shiftData.breakEnd + ':00',
          flexible_range: convertRangeToMinutes(shiftData.punchStartRange),
          late_tolerance: convertRangeToMinutes(shiftData.punchStartRange),
          early_leave_tolerance: convertRangeToMinutes(shiftData.punchEndRange)
        })
      });

      const result = await response.json();
      
      if (result.Status === "Ok") {
        return { success: true, data: result };
      } else {
        throw new Error(result.Msg || '修改班別失敗');
      }
    } catch (error) {
      console.error('修改班別 API 調用錯誤:', error);
      throw error;
    }
  };

  // 修改新增班別函數
  const handleAddShift = () => {
    const newShift = {
      id: Date.now(),
      name: '',
      code: '',
      startTime: '09:00',
      endTime: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      punchStartRange: '選擇',
      punchEndRange: '選擇',
      isNew: true
    };

    setLocalShifts(prev => [...prev, newShift]);
    
    if (onAddShift) {
      onAddShift(newShift);
    }
  };

  // 🔥 修改：統一的儲存函數，處理新建和修改
  const handleSaveShift = async (shift) => {
    if (!shift.name.trim()) {
      alert('請輸入班別名稱');
      return;
    }

    if (!shift.code.trim()) {
      alert('請輸入班別代號');
      return;
    }

    const shiftData = {
      code: shift.code,
      name: shift.name,
      startTime: shift.startTime || '09:00',
      endTime: shift.endTime || '18:00',
      breakStart: shift.breakStart || '12:00',
      breakEnd: shift.breakEnd || '13:00',
      punchStartRange: shift.punchStartRange,
      punchEndRange: shift.punchEndRange
    };

    try {
      setIsSubmitting(true);
      
      if (shift.isNew) {
        // 🔥 新建班別
        await handleCreateShiftType(shiftData);
        alert('班別新增成功！');
      } else {
        // 🔥 修改現有班別
        await handleUpdateShiftType(shift.originalData.shift_type_id, shiftData);
        alert('班別修改成功！');
      }
      
      // 🔥 成功後重新載入所有班別資料
      await loadExistingShifts();
      
    } catch (error) {
      console.error('儲存班別錯誤:', error);
      alert(`儲存班別失敗：${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 修改更新班別函數
  const handleUpdateShift = (shiftId, field, value) => {
    setLocalShifts(prev => 
      prev.map(shift => 
        shift.id === shiftId ? { ...shift, [field]: value } : shift
      )
    );
    
    if (onUpdateShift) {
      onUpdateShift(shiftId, field, value);
    }
  };

  // 刪除班別函數
  const handleDeleteShift = (shiftId) => {
    setLocalShifts(prev => prev.filter(shift => shift.id !== shiftId));
    if (onDeleteShift) {
      onDeleteShift(shiftId);
    }
  };

  // 獲取班別內部藍色線條顏色
  const getShiftLineColor = (index) => {
    return index % 2 === 0 ? '#699BF7' : '#C4D4E8';
  };

  // 🔥 載入中狀態
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px 5px',
        width: '100%',
        position: 'relative',
        minHeight: '400px'
      }}>
        <div style={{
          width: '10px',
          minHeight: '100%',
          background: '#3f5d96ff',
          flexShrink: 0,
          alignSelf: 'stretch'
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          width: '100%',
          padding: '60px 20px',
          background: '#F9F9F9',
          borderRadius: '10px',
          border: '1px solid #E9E9E9',
          borderLeft: 'none',
          minHeight: '400px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E9E9E9',
            borderTop: '4px solid #699BF7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <h4 style={{
            margin: '0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#699BF7',
            fontFamily: 'Microsoft JhengHei',
          }}>載入班別資料中...</h4>
          
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // 空狀態判斷
  if (!localShifts || localShifts.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px 5px',
        width: '100%',
        position: 'relative',
        minHeight: '200px'
      }}>
        <div style={{
          width: '10px',
          minHeight: '100%',
          background: '#3f5d96ff',
          flexShrink: 0,
          alignSelf: 'stretch'
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          width: '100%',
          flex: 1
        }}>
          {/* 當月可遲到次數/分鐘設定 */}
          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '25px 26px',
            width: '100%',
            height: '70px',
            background: '#FFFFFF',
            border: '1px solid #E9E9E9',
            borderRadius: '10px',
            borderLeft: 'none',
            position: 'relative',
            marginBottom: '0px'
          }}>
            <span style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '27px',
              color: '#3f5d96ff',
            }}>
              當月可遲到次數/分鐘
            </span>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                value={basicSettings.monthlyLateLimit}
                onChange={(e) => onUpdateBasicSettings && onUpdateBasicSettings(prev => ({ ...prev, monthlyLateLimit: e.target.value }))}
                style={{
                  width: '120px',
                  height: '40px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '16px',
                  fontFamily: 'Microsoft JhengHei',
                  background: '#F8F9FA',
                  color: '#919191',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23919191%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  paddingRight: '40px'
                }}
              >
                <option value={0}>選擇次數</option>
                <option value={1}>1次</option>
                <option value={2}>2次</option>
                <option value={3}>3次</option>
              </select>
              
              <select
                value={basicSettings.lateMinutesLimit}
                onChange={(e) => onUpdateBasicSettings && onUpdateBasicSettings(prev => ({ ...prev, lateMinutesLimit: e.target.value }))}
                style={{
                  width: '140px',
                  height: '40px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '16px',
                  fontFamily: 'Microsoft JhengHei',
                  background: '#F8F9FA',
                  color: '#919191',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23919191%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  paddingRight: '40px'
                }}
              >
                <option value={0}>選擇分鐘數</option>
                <option value={5}>5分鐘</option>
                <option value={10}>10分鐘</option>
                <option value={15}>15分鐘</option>
              </select>
            </div>
          </div>

          {/* 設定班別標題和新增班別按鈕 */}
          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '25px 26px',
            gap: '60px',
            width: '100%',
            height: '70px',
            borderBottom: '1px solid #E9E9E9',
            borderRadius: '5px',
            background: '#FFFFFF',
            borderLeft: 'none'
          }}>
            <h3 style={{
              margin: '0',
              fontSize: '22px',
              fontWeight: '700',
              color: '#699BF7',
              letterSpacing: '0.01em',
              fontFamily: 'Microsoft JhengHei',
            }}>設定班別</h3>
            
            <button
              onClick={handleAddShift}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: '#699BF7',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Microsoft JhengHei',
                height: '48px',
                boxShadow: '0px 2px 8px rgba(105, 155, 247, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5B8EC8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#699BF7';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                background: 'transparent',
                border: '2px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                +
              </div>
              
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                letterSpacing: '0.5px'
              }}>
                新增班別
              </span>
            </button>
          </div>

          {/* 空狀態提示 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            width: '100%',
            padding: '60px 20px',
            background: '#F9F9F9',
            borderRadius: '10px',
            border: '1px solid #E9E9E9',
            borderLeft: 'none',
            marginTop: '0px'
          }}>
            <div style={{
              fontSize: '48px',
              color: '#C0C0C0'
            }}>
              📋
            </div>
            <h4 style={{
              margin: '0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#919191',
              fontFamily: 'Microsoft JhengHei',
            }}>尚未設定班別</h4>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#919191',
              fontFamily: 'Microsoft JhengHei',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              點擊「新增班別」按鈕開始設定班別資訊
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '0px 5px',
      width: '100%',
      position: 'relative',
      minHeight: '200px'
    }}>
      <div style={{
        width: '10px',
        minHeight: '100%',
        background: '#3f5d96ff',
        flexShrink: 0,
        alignSelf: 'stretch'
      }} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        width: '100%',
        flex: 1
      }}>
        {/* 當月可遲到次數/分鐘設定 */}
        <div style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '25px 26px',
          width: '100%',
          height: '70px',
          background: '#FFFFFF',
          border: '1px solid #E9E9E9',
          borderRadius: '10px',
          borderLeft: 'none',
          position: 'relative',
          marginBottom: '0px'
        }}>
          <span style={{
            fontFamily: 'Microsoft JhengHei',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '20px',
            lineHeight: '27px',
            color: '#3f5d96ff',
          }}>
            當月可遲到次數/分鐘
          </span>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={basicSettings.monthlyLateLimit}
              onChange={(e) => onUpdateBasicSettings && onUpdateBasicSettings(prev => ({ ...prev, monthlyLateLimit: e.target.value }))}
              style={{
                width: '120px',
                height: '40px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '16px',
                fontFamily: 'Microsoft JhengHei',
                background: '#F8F9FA',
                color: '#919191',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23919191%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}
            >
              <option value={0}>選擇次數</option>
              <option value={1}>1次</option>
              <option value={2}>2次</option>
              <option value={3}>3次</option>
            </select>
            <select
              value={basicSettings.lateMinutesLimit}
              onChange={(e) => onUpdateBasicSettings && onUpdateBasicSettings(prev => ({ ...prev, lateMinutesLimit: e.target.value }))}
              style={{
                width: '140px',
                height: '40px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '16px',
                fontFamily: 'Microsoft JhengHei',
                background: '#F8F9FA',
                color: '#919191',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23919191%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}
            >
              <option value={0}>選擇分鐘數</option>
              <option value={5}>5分鐘</option>
              <option value={10}>10分鐘</option>
              <option value={15}>15分鐘</option>
            </select>
          </div>
        </div>

        {/* 設定班別標題和新增班別按鈕 */}
        <div style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '25px 26px',
          gap: '60px',
          width: '100%',
          height: '70px',
          borderBottom: '1px solid #E9E9E9',
          borderRadius: '5px',
          background: '#FFFFFF',
          borderLeft: 'none'
        }}>
          <h3 style={{
            margin: '0',
            fontSize: '22px',
            fontWeight: '700',
            color: '#699BF7',
            letterSpacing: '0.01em',
            fontFamily: 'Microsoft JhengHei',
          }}>設定班別</h3>
          
          <button
            onClick={handleAddShift}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: '#699BF7',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Microsoft JhengHei',
              height: '48px',
              boxShadow: '0px 2px 8px rgba(105, 155, 247, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#5B8EC8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#699BF7';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              background: 'transparent',
              border: '2px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              +
            </div>
            
            <span style={{
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '0.5px'
            }}>
              新增班別
            </span>
          </button>
        </div>

        {/* 🔥 班別列表 - 顯示從 API 載入的班別小卡 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          padding: '0px',
          width: '100%'
        }}>
          {localShifts.map((shift, index) => (
            <div key={shift.id} style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px 5px',
              width: '100%',
              minHeight: '280px'
            }}>
              {/* 每個班別的藍色線條 */}
              <div style={{
                width: '10px',
                minHeight: '100%',
                background: getShiftLineColor(index),
                flexShrink: 0,
                alignSelf: 'stretch'
              }} />

              {/* 班別內容 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                width: '100%',
                flex: 1
              }}>
                <div style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '25px 26px',
                  gap: '20px',
                  width: '100%',
                  borderBottom: '1px',
                  borderRadius: '5px',
                  background: '#FFFFFF',
                  borderLeft: 'none'
                }}>
                  {/* 班別名稱和代號 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%'
                  }}>
                    {/* 班別名稱 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      width: '285px'
                    }}>
                      <label style={{ 
                        fontSize: '18px', 
                        color: '#919191', 
                        fontFamily: 'Microsoft JhengHei',
                        width: '73px'
                      }}>
                        班別名稱
                      </label>
                      <input
                        type="text"
                        value={shift.name || ''}
                        onChange={(e) => handleUpdateShift(shift.id, 'name', e.target.value)}
                        placeholder="請輸入班別名稱"
                        style={{
                          width: '202px',
                          height: '40px',
                          border: '1px solid #C4D4E8',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '16px',
                          fontFamily: 'Microsoft JhengHei',
                          boxSizing: 'border-box',
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                          color: '#000000'
                        }}
                      />
                    </div>

                    {/* 代號 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      width: '101px',
                      marginLeft: '-650px'
                    }}>
                      <label style={{ 
                        fontSize: '18px', 
                        color: '#919191', 
                        fontFamily: 'Microsoft JhengHei',
                        width: '50px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        代號
                      </label>
                      <input
                        type="text"
                        value={shift.code || ''}
                        maxLength={20}
                        onChange={(e) => handleUpdateShift(shift.id, 'code', e.target.value)}
                        placeholder="代號"
                        disabled={!shift.isNew} // 🔥 代號只有新建時可以編輯
                        style={{
                          width: '120px',
                          height: '40px',
                          border: '1px solid #C4D4E8',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '16px',
                          fontFamily: 'Microsoft JhengHei',
                          boxSizing: 'border-box',
                          outline: 'none',
                          textAlign: 'center',
                          backgroundColor: shift.isNew ? '#FFFFFF' : '#F5F5F5',
                          color: shift.isNew ? '#000000' : '#666666'
                        }}
                      />
                    </div>
                    
                    {/* 🔥 修改：操作按鈕 - 所有班別都顯示儲存按鈕，但根據修改狀態變化 */}
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {/* 🔥 儲存按鈕 - 新建班別或有修改時顯示 */}
                      {(shift.isNew || shiftChanges[shift.id]) && (
                        <button
                          onClick={() => handleSaveShift(shift)}
                          disabled={isSubmitting}
                          style={{
                            background: isSubmitting ? '#cccccc' : '#4ECB71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Microsoft JhengHei',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubmitting) {
                              e.currentTarget.style.background = '#45B865';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubmitting) {
                              e.currentTarget.style.background = '#4ECB71';
                            }
                          }}
                        >
                          {isSubmitting ? '儲存中...' : '儲存'}
                        </button>
                      )}
                      
{/* 刪除按鈕 - 所有班別都可以刪除 */}
<button
  onClick={() => handleDeleteShift(shift.id)}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = '#FFE6E6';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = 'none';
  }}
>
  <svg width="24" height="26" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="16" height="1.5" rx="0.75" fill="#919191"/>
    <path d="M6.5 2.5C6.5 1.67157 7.17157 1 8 1H12C12.8284 1 13.5 1.67157 13.5 2.5V4H6.5V2.5Z" 
          stroke="#919191" strokeWidth="1.5" fill="none"/>
    <path d="M4 5.5L4.5 18.5C4.55 19.6 5.4 20.5 6.5 20.5H13.5C14.6 20.5 15.45 19.6 15.5 18.5L16 5.5" 
          stroke="#919191" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <line x1="8" y1="8" x2="8" y2="17" stroke="#919191" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="8" x2="12" y2="17" stroke="#919191" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
</button>

                    </div>
                  </div>

                  {/* 固定上下班時段 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <label style={{ 
                      fontSize: '18px', 
                      color: '#919191',
                      fontFamily: 'Microsoft JhengHei',
                      width: '128px'
                    }}>
                      固定上下班時段
                    </label>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '30px',
                      marginLeft: 'auto'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px'
                      }}>
                        <span style={{ 
                          fontSize: '16px', 
                          color: '#333333', 
                          fontWeight: '500',
                          fontFamily: 'Microsoft JhengHei'
                        }}>
                          上班
                        </span>
                        
                        <TimePickerInput
                          value={shift.startTime}
                          onChange={(time) => handleUpdateShift(shift.id, 'startTime', time)}
                          placeholder="選擇上班時間"
                          disabled={false}
                        />
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px'
                      }}>
                        <span style={{ 
                          fontSize: '16px', 
                          color: '#333333', 
                          fontWeight: '500',
                          fontFamily: 'Microsoft JhengHei'
                        }}>
                          下班
                        </span>
                        
                        <TimePickerInput
                          value={shift.endTime}
                          onChange={(time) => handleUpdateShift(shift.id, 'endTime', time)}
                          placeholder="選擇下班時間"
                          disabled={false}
                        />
                      </div>
                    </div>
                  </div>
{/* 🔥 修改：可打卡時間範圍 - 更新下拉選單選項 */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px'
}}>
  <label style={{ 
    fontSize: '18px', 
    color: '#919191',
    fontFamily: 'Microsoft JhengHei',
    width: '128px'
  }}>
    可打卡時間範圍
  </label>
  
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px',
    marginLeft: 'auto'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '22px', color: '#1F1F1F', width: '45px' }}>上班</span>
      <select
        value={shift.punchStartRange || '選擇'}
        onChange={(e) => handleUpdateShift(shift.id, 'punchStartRange', e.target.value)}
        disabled={false}
        style={{
          width: '200px',
          height: '40px',
          border: '1px solid #E0E0E0',
          borderRadius: '5px',
          padding: '8px 10px',
          fontSize: '18px',
          fontFamily: 'Microsoft JhengHei',
          background: '#F8F9FA',
          cursor: 'pointer',
          color: '#919191',
          appearance: 'none',
          outline: 'none',
          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23919191%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '16px',
          paddingRight: '40px'
        }}
      >
        <option value="選擇">選擇</option>
        <option value="5分鐘前">5分鐘前</option>
        <option value="10分鐘前">10分鐘前</option>
        <option value="15分鐘前">15分鐘前</option>
        <option value="30分鐘前">30分鐘前</option>
      </select>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '22px', color: '#1F1F1F', width: '45px' }}>下班</span>
      <select
        value={shift.punchEndRange || '選擇'}
        onChange={(e) => handleUpdateShift(shift.id, 'punchEndRange', e.target.value)}
        disabled={false}
        style={{
          width: '200px',
          height: '40px',
          border: '1px solid #E0E0E0',
          borderRadius: '5px',
          padding: '8px 10px',
          fontSize: '18px',
          fontFamily: 'Microsoft JhengHei',
          background: '#F8F9FA',
          cursor: 'pointer',
          color: '#919191',
          appearance: 'none',
          outline: 'none',
          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23919191%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276,9 12,15 18,9%27%3e%3c/polyline%3e%3c/svg%3e")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '16px',
          paddingRight: '40px'
        }}
      >
        <option value="選擇">選擇</option>
        <option value="5分鐘後">5分鐘後</option>
        <option value="10分鐘後">10分鐘後</option>
        <option value="15分鐘後">15分鐘後</option>
        <option value="30分鐘後">30分鐘後</option>
      </select>
    </div>
  </div>
</div>


                  {/* 休息時間 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <label style={{ 
                      fontSize: '18px', 
                      color: '#919191',
                      fontFamily: 'Microsoft JhengHei',
                      width: '73px'
                    }}>
                      休息時間
                    </label>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '30px',
                      marginLeft: 'auto'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px'
                      }}>
                        <span style={{ 
                          fontSize: '16px', 
                          color: '#333333', 
                          fontWeight: '500',
                          fontFamily: 'Microsoft JhengHei'
                        }}>
                          開始
                        </span>
                        
                        <TimePickerInput
                          value={shift.breakStart}
                          onChange={(time) => handleUpdateShift(shift.id, 'breakStart', time)}
                          placeholder="選擇開始時間"
                          disabled={false}
                        />
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px'
                      }}>
                        <span style={{ 
                          fontSize: '16px', 
                          color: '#333333', 
                          fontWeight: '500',
                          fontFamily: 'Microsoft JhengHei'
                        }}>
                          結束
                        </span>
                        
                        <TimePickerInput
                          value={shift.breakEnd}
                          onChange={(time) => handleUpdateShift(shift.id, 'breakEnd', time)}
                          placeholder="選擇結束時間"
                          disabled={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 新增：CSS 動畫樣式 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ClassRosterForm;
