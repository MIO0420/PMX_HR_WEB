import React, { useState } from 'react';
import TimePickerInput from './Smallitems/Clock';

const OvertimeRules = ({ 
  overtimeSettings = {},
  onUpdateOvertimeSettings
}) => {
  
  // 法定最低倍率（勞基法規定）
  const legalMinimumRates = {
    workdayOvertime0to2: 1.34,
    workdayOvertime2to4: 1.67,
    restdayOvertime0to2: 1.34,
    restdayOvertime2to8: 1.67,
    restdayOvertime8to12: 2.67,
    holidayOvertime0to8: 1,
    holidayOvertime8to12: 2,
    vacationOvertime0to8: 1,
    vacationOvertime8to10: 1.34,
    vacationOvertime10to12: 1.67,
    overtimeCompensation: 1
  };

  // 預設加班設定
  const defaultSettings = {
    // 加班時段設定
    workdayOvertimeStart: '18:30',
    workdayOvertimeEnd: '21:30',
    workdayOvertimeEnabled: true,
    
    restdayOvertimeStart: '08:00',
    restdayOvertimeEnd: '17:00',
    restdayOvertimeEnabled: true,
    
    holidayOvertimeStart: '08:00',
    holidayOvertimeEnd: '17:00',
    holidayOvertimeEnabled: false,
    
    // 工作日加班費倍率
    workdayOvertime0to2: '1.34',
    workdayOvertime2to4: '1.67',
    
    // 休息日加班費倍率
    restdayOvertime0to2: '1.34',
    restdayOvertime2to8: '1.67',
    restdayOvertime8to12: '2.67',
    
    // 例假日加班費倍率
    holidayOvertime0to8: '1',
    holidayOvertime8to12: '2',
    
    // 休假日加班費倍率
    vacationOvertime0to8: '1',
    vacationOvertime8to10: '1.34',
    vacationOvertime10to12: '1.67',
    
    // 加班換休
    overtimeCompensation: '1',
    overtimeCompensationEnabled: true
  };

  // 合併預設設定和傳入的設定
  const settings = { ...defaultSettings, ...overtimeSettings };

  // 更新設定的函數
  const handleUpdateSetting = (field, value) => {
    if (onUpdateOvertimeSettings) {
      onUpdateOvertimeSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 處理倍率輸入的函數（確保不低於法定最低值）
  const handleRateChange = (field, value) => {
    const numValue = parseFloat(value);
    const minValue = legalMinimumRates[field];
    
    if (!isNaN(numValue) && numValue >= minValue) {
      handleUpdateSetting(field, value);
    } else if (value === '' || value === '0') {
      // 允許清空輸入框進行編輯
      handleUpdateSetting(field, value);
    }
  };

  // 切換開關的函數
  const handleToggle = (field) => {
    handleUpdateSetting(field, !settings[field]);
  };

  // 滑桿組件（使用與左側線條相同的顏色）
  const ToggleSlider = ({ enabled, onToggle, disabled = false }) => (
    <div
      onClick={disabled ? undefined : onToggle}
      style={{
        width: '50px',
        height: '24px',
        borderRadius: '12px',
        background: enabled ? '#3f5d96ff' : '#C0C0C0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#FFFFFF',
          position: 'absolute',
          top: '2px',
          left: enabled ? '28px' : '2px',
          transition: 'all 0.3s ease',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </div>
  );

  return (
    <div style={{
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '0px 5px',
      width: '100%',
      background: '#FFFFFF',
      border: '1px solid #E9E9E9',
      borderRadius: '10px'
    }}>
      {/* 左側藍色線條 */}
      <div style={{
        width: '10px',
        minHeight: '100%',
        background:'#3f5d96ff',
        flexShrink: 0,
        alignSelf: 'stretch'
      }} />

      {/* 主要內容區域 */}
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
          background: '#FFFFFF'
        }}>

          {/* 工作日可加班時段 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            width: '100%'
          }}>
            <ToggleSlider 
              enabled={settings.workdayOvertimeEnabled}
              onToggle={() => handleToggle('workdayOvertimeEnabled')}
            />
            
            <label style={{
              fontSize: '18px',
              color: settings.workdayOvertimeEnabled ? '#3f5d96ff' : '#999999',
              fontFamily: 'Microsoft JhengHei',
              fontWeight: 'bold',
              width: '150px',
              flexShrink: 0
            }}>
              工作日可加班時段
            </label>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginLeft: 'auto'
            }}>
              <TimePickerInput
                value={settings.workdayOvertimeStart}
                onChange={(time) => handleUpdateSetting('workdayOvertimeStart', time)}
                placeholder="開始時間"
                disabled={!settings.workdayOvertimeEnabled}
              />
              <span style={{ color: '#666666', fontSize: '18px', fontWeight: 'bold' }}>~</span>
              <TimePickerInput
                value={settings.workdayOvertimeEnd}
                onChange={(time) => handleUpdateSetting('workdayOvertimeEnd', time)}
                placeholder="結束時間"
                disabled={!settings.workdayOvertimeEnabled}
              />
            </div>
          </div>

          {/* 休息日可加班時段 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            width: '100%'
          }}>
            <ToggleSlider 
              enabled={settings.restdayOvertimeEnabled}
              onToggle={() => handleToggle('restdayOvertimeEnabled')}
            />
            
            <label style={{
              fontSize: '18px',
              color: settings.restdayOvertimeEnabled ? '#3f5d96ff' : '#999999',
              fontFamily: 'Microsoft JhengHei',
              fontWeight: 'bold',
              width: '150px',
              flexShrink: 0
            }}>
              休息日可加班時段
            </label>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginLeft: 'auto'
            }}>
              <TimePickerInput
                value={settings.restdayOvertimeStart}
                onChange={(time) => handleUpdateSetting('restdayOvertimeStart', time)}
                placeholder="開始時間"
                disabled={!settings.restdayOvertimeEnabled}
              />
              <span style={{ color: '#666666', fontSize: '18px', fontWeight: 'bold' }}>~</span>
              <TimePickerInput
                value={settings.restdayOvertimeEnd}
                onChange={(time) => handleUpdateSetting('restdayOvertimeEnd', time)}
                placeholder="結束時間"
                disabled={!settings.restdayOvertimeEnabled}
              />
            </div>
          </div>

          {/* 例假日可加班時段 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            width: '100%'
          }}>
            <ToggleSlider 
              enabled={settings.holidayOvertimeEnabled}
              onToggle={() => handleToggle('holidayOvertimeEnabled')}
            />
            
            <label style={{
              fontSize: '18px',
              color: settings.holidayOvertimeEnabled ? '#3f5d96ff' : '#999999',
              fontFamily: 'Microsoft JhengHei',
              fontWeight: 'bold',
              width: '150px',
              flexShrink: 0
            }}>
              例假日可加班時段
            </label>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginLeft: 'auto'
            }}>
              {settings.holidayOvertimeEnabled ? (
                <>
                  <TimePickerInput
                    value={settings.holidayOvertimeStart}
                    onChange={(time) => handleUpdateSetting('holidayOvertimeStart', time)}
                    placeholder="開始時間"
                    disabled={!settings.holidayOvertimeEnabled}
                  />
                  <span style={{ color: '#666666', fontSize: '18px', fontWeight: 'bold' }}>~</span>
                  <TimePickerInput
                    value={settings.holidayOvertimeEnd}
                    onChange={(time) => handleUpdateSetting('holidayOvertimeEnd', time)}
                    placeholder="結束時間"
                    disabled={!settings.holidayOvertimeEnabled}
                  />
                </>
              ) : (
                <span style={{
                  fontSize: '18px',
                  color: '#999999',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  fontStyle: 'italic'
                }}>
                  依勞基法規定，例假日原則上不得加班
                </span>
              )}
            </div>
          </div>

          {/* 加班費倍率設定 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '20px',
            padding: '0px'
          }}>
            {/* 標題和提示 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#919191',
                fontFamily: 'Microsoft JhengHei'
              }}>
                加班費倍率設定 (計算結果之金額將無條件進位至個位數)
              </span>
              <span style={{
                fontSize: '18px',
                color: '#FF6B6B',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                *提示：調整需優於勞基法最低標準
              </span>
            </div>

            {/* 工作日加班費倍率 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                工作日加班：0 ~ 2小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.workdayOvertime0to2}
                value={settings.workdayOvertime0to2}
                onChange={(e) => handleRateChange('workdayOvertime0to2', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.workdayOvertime0to2) {
                    handleUpdateSetting('workdayOvertime0to2', legalMinimumRates.workdayOvertime0to2.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                工作日加班：2 ~ 4小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.workdayOvertime2to4}
                value={settings.workdayOvertime2to4}
                onChange={(e) => handleRateChange('workdayOvertime2to4', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.workdayOvertime2to4) {
                    handleUpdateSetting('workdayOvertime2to4', legalMinimumRates.workdayOvertime2to4.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            {/* 休息日加班費倍率 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                休息日加班：0 ~ 2小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.restdayOvertime0to2}
                value={settings.restdayOvertime0to2}
                onChange={(e) => handleRateChange('restdayOvertime0to2', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.restdayOvertime0to2) {
                    handleUpdateSetting('restdayOvertime0to2', legalMinimumRates.restdayOvertime0to2.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                休息日加班：2 ~ 8小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.restdayOvertime2to8}
                value={settings.restdayOvertime2to8}
                onChange={(e) => handleRateChange('restdayOvertime2to8', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.restdayOvertime2to8) {
                    handleUpdateSetting('restdayOvertime2to8', legalMinimumRates.restdayOvertime2to8.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                休息日加班：8 ~ 12小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.restdayOvertime8to12}
                value={settings.restdayOvertime8to12}
                onChange={(e) => handleRateChange('restdayOvertime8to12', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.restdayOvertime8to12) {
                    handleUpdateSetting('restdayOvertime8to12', legalMinimumRates.restdayOvertime8to12.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            {/* 例假日加班費倍率 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                例假日加班：8小時以內，以8小時計薪 (1日薪)
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.holidayOvertime0to8}
                value={settings.holidayOvertime0to8}
                onChange={(e) => handleRateChange('holidayOvertime0to8', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.holidayOvertime0to8) {
                    handleUpdateSetting('holidayOvertime0to8', legalMinimumRates.holidayOvertime0to8.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                例假日加班：8 ~ 12小時以內 (2倍)
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.holidayOvertime8to12}
                value={settings.holidayOvertime8to12}
                onChange={(e) => handleRateChange('holidayOvertime8to12', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.holidayOvertime8to12) {
                    handleUpdateSetting('holidayOvertime8to12', legalMinimumRates.holidayOvertime8to12.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            {/* 休假日加班費倍率 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                休假日加班：8小時以內，以8小時計薪 (1日薪)
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.vacationOvertime0to8}
                value={settings.vacationOvertime0to8}
                onChange={(e) => handleRateChange('vacationOvertime0to8', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.vacationOvertime0to8) {
                    handleUpdateSetting('vacationOvertime0to8', legalMinimumRates.vacationOvertime0to8.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                休假日加班：8 ~ 10小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.vacationOvertime8to10}
                value={settings.vacationOvertime8to10}
                onChange={(e) => handleRateChange('vacationOvertime8to10', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.vacationOvertime8to10) {
                    handleUpdateSetting('vacationOvertime8to10', legalMinimumRates.vacationOvertime8to10.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#3f5d96ff',
                fontFamily: 'Microsoft JhengHei',
                fontWeight: 'bold'
              }}>
                休假日加班：10 ~ 12小時以內
              </span>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.vacationOvertime10to12}
                value={settings.vacationOvertime10to12}
                onChange={(e) => handleRateChange('vacationOvertime10to12', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.vacationOvertime10to12) {
                    handleUpdateSetting('vacationOvertime10to12', legalMinimumRates.vacationOvertime10to12.toString());
                  }
                }}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>

            {/* 加班換休 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginTop: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ToggleSlider 
                  enabled={settings.overtimeCompensationEnabled}
                  onToggle={() => handleToggle('overtimeCompensationEnabled')}
                />
                <span style={{
                  fontSize: '18px',
                  color: settings.overtimeCompensationEnabled ? '#3f5d96ff' : '#999999',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold'
                }}>
                  加班換休
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min={legalMinimumRates.overtimeCompensation}
                value={settings.overtimeCompensation}
                onChange={(e) => handleRateChange('overtimeCompensation', e.target.value)}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < legalMinimumRates.overtimeCompensation) {
                    handleUpdateSetting('overtimeCompensation', legalMinimumRates.overtimeCompensation.toString());
                  }
                }}
                disabled={!settings.overtimeCompensationEnabled}
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '18px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei',
                  fontWeight: 'bold',
                  outline: 'none',
                  opacity: settings.overtimeCompensationEnabled ? 1 : 0.5,
                  cursor: settings.overtimeCompensationEnabled ? 'text' : 'not-allowed'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeRules;
