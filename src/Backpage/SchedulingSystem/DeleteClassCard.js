import React, { useEffect, useState } from 'react';
import { getDeleteOptionsAvailability } from './DeleteSchedule';

const DeleteClassCard = ({ 
  showDeleteOptions, 
  scheduleToDelete, 
  deleteOption, 
  setDeleteOption, 
  confirmDeleteSchedule, 
  onClose, 
  loading,
  // ✅ 新增必要的 props
  schedules,
  schedulesToSave,
  selectedMonth
}) => {
  const [adjustedPosition, setAdjustedPosition] = useState({ top: 0, left: 0 });

  // ✅ 計算最佳彈窗位置，避免超出螢幕
  useEffect(() => {
    if (!showDeleteOptions) return;

    const calculateBestPosition = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // ✅ 根據刪除類型調整卡片大小
      const isShiftTypeDeletion = scheduleToDelete?.isShiftType;
      const cardHeight = isShiftTypeDeletion ? 200 : 280; // 班別刪除較小
      const cardWidth = isShiftTypeDeletion ? 320 : 320;  // 統一寬度
      
      let { top, left } = showDeleteOptions;
      
      // 檢查下方空間是否足夠
      const spaceBelow = viewportHeight - top;
      
      // 如果下方空間不足，調整到上方
      if (spaceBelow < cardHeight) {
        top = Math.max(10, top - cardHeight - 10);
      }
      
      // ✅ 檢查右邊界 - 如果卡片會超出右邊，往左移動
      if (left + cardWidth > viewportWidth - 10) {
        left = viewportWidth - cardWidth - 10;
      }
      
      // ✅ 檢查左邊界 - 確保不會移動到左邊界外
      if (left < 10) {
        left = 10;
      }
      
      // 確保不會超出上邊界
      if (top < 10) {
        top = 10;
      }
      
      setAdjustedPosition({ top, left });
    };

    calculateBestPosition();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', calculateBestPosition);
    return () => window.removeEventListener('resize', calculateBestPosition);
  }, [showDeleteOptions, scheduleToDelete]);

  if (!showDeleteOptions || !scheduleToDelete) return null;

  // ✅ 判斷是否為班別刪除
  const isShiftTypeDeletion = scheduleToDelete.isShiftType;
  const isLocalShift = scheduleToDelete.isLocal;

  // ✅ 使用修正後的可用性檢查函數
const availableOptions = !isShiftTypeDeletion ? 
  getDeleteOptionsAvailability(scheduleToDelete, schedules, schedulesToSave, selectedMonth) : 
  { current: true, week: false, month: false };

  // ✅ 調試輸出
  console.log('🔍 DeleteClassCard 刪除選項可用性:', {
    isShiftTypeDeletion,
    frequency: scheduleToDelete?.schedule?.repeat_frequency,
    availableOptions,
    scheduleToDelete
  });

  return (
    <>
      {/* 透明背景遮罩 - 點擊關閉 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1003,
          backgroundColor: 'transparent'
        }}
        onClick={onClose}
      />

      {/* 刪除選項下拉選單 - 根據類型調整寬度 */}
      <div
        style={{
          position: 'fixed',
          top: adjustedPosition.top,
          left: adjustedPosition.left,
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          zIndex: 1004,
          minWidth: '320px', // ✅ 統一寬度以容納較長的選項文字
          width: 'auto',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        {/* ✅ 動態標題 */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          fontSize: '14px',
          fontWeight: '600',
          color: '#495057'
        }}>
          {isShiftTypeDeletion ? '刪除班別選項' : '刪除排班選項'}
        </div>

        {/* ✅ 選項內容 */}
        <div style={{ padding: '8px 0' }}>
          {isShiftTypeDeletion ? (
            // ✅ 班別刪除選項 - 簡化的確認訊息
            <>
              <div style={{
                padding: '12px 16px',
                fontSize: '14px',
                color: '#495057',
                lineHeight: '1.5'
              }}>
                {isLocalShift ? 
                  `確定要移除本地班別「${scheduleToDelete.schedule.shift_name}」嗎？` :
                  `確定要刪除班別「${scheduleToDelete.schedule.shift_name}」嗎？`
                }
              </div>
              <div style={{
                padding: '0 16px 12px 16px',
                fontSize: '12px',
                color: '#6c757d',
                lineHeight: '1.4'
              }}>
                {isLocalShift ? 
                  '此操作將立即生效' :
                  '此操作將在儲存後生效，相關排班也會被刪除'
                }
              </div>
            </>
          ) : (
            // ✅ 排班刪除選項 - 修改為新的三個選項
            <>
              {/* 選項1：刪除當天 - 永遠可用 */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#495057',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <input
                  type="radio"
                  name="deleteOption"
                  value="current"
                  checked={deleteOption === 'current'}
                  onChange={(e) => setDeleteOption(e.target.value)}
                  style={{ marginRight: '8px', flexShrink: 0 }}
                />
                <span style={{ whiteSpace: 'nowrap' }}>
                  刪除當天「{scheduleToDelete.schedule.shift_name}」班別
                </span>
              </label>
              
              {/* 選項2：刪除當周 - 根據頻率決定是否可用 */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                cursor: availableOptions.week ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                color: availableOptions.week ? '#495057' : '#6c757d',
                opacity: availableOptions.week ? 1 : 0.5,
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (availableOptions.week) {
                  e.target.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (availableOptions.week) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              >
                <input
                  type="radio"
                  name="deleteOption"
                  value="week"
                  checked={deleteOption === 'week'}
                  onChange={(e) => availableOptions.week && setDeleteOption(e.target.value)}
                  disabled={!availableOptions.week}
                  style={{ marginRight: '8px', flexShrink: 0 }}
                />
                <span style={{ whiteSpace: 'nowrap' }}>
                  刪除當周全部「{scheduleToDelete.schedule.shift_name}」班別
{!availableOptions.week && (
  <span style={{ color: '#6c757d', fontSize: '12px' }}>
    {scheduleToDelete?.schedule?.repeat_frequency === 'daily' ? 
      ' (每日班別不適用)' : ' (無其他排班)'
    }
  </span>
)}
                </span>
              </label>
              
              {/* 選項3：刪除當月 - 根據頻率決定是否可用 */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                cursor: availableOptions.month ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                color: availableOptions.month ? '#495057' : '#6c757d',
                opacity: availableOptions.month ? 1 : 0.5,
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (availableOptions.month) {
                  e.target.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (availableOptions.month) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              >
                <input
                  type="radio"
                  name="deleteOption"
                  value="month"
                  checked={deleteOption === 'month'}
                  onChange={(e) => availableOptions.month && setDeleteOption(e.target.value)}
                  disabled={!availableOptions.month}
                  style={{ marginRight: '8px', flexShrink: 0 }}
                />
                <span style={{ whiteSpace: 'nowrap' }}>
                  刪除當月全部「{scheduleToDelete.schedule.shift_name}」班別
{!availableOptions.month && (
  <span style={{ color: '#6c757d', fontSize: '12px' }}>
    {scheduleToDelete?.schedule?.repeat_frequency === 'daily' ? 
      ' (每日班別不適用)' : ' (無其他排班)'
    }
  </span>
)}
                </span>
              </label>

              {/* ✅ 顯示頻率資訊 */}
              <div style={{
                padding: '8px 16px',
                fontSize: '12px',
                color: '#6c757d',
                borderTop: '1px solid #f1f3f4',
                backgroundColor: '#f8f9fa'
              }}>
                班別頻率：{scheduleToDelete.schedule?.repeat_frequency === 'daily' ? '每日' : 
                         scheduleToDelete.schedule?.repeat_frequency === 'weekdays' ? '平日' : 
                         scheduleToDelete.schedule?.repeat_frequency === 'holiday' ? '假日' : '未知'}
              </div>
            </>
          )}
        </div>

        {/* 按鈕區 */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: '#6c757d',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            取消
          </button>
          <button
            onClick={confirmDeleteSchedule}
            disabled={loading}
            style={{
              padding: '6px 12px',
              backgroundColor: loading ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#c82333';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#dc3545';
              }
            }}
          >
            {loading ? '刪除中...' : (isShiftTypeDeletion ? 
              (isLocalShift ? '確認移除' : '確認刪除') : 
              '確認刪除'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteClassCard;
