import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// 自定義時鐘選擇器組件
const ClockPicker = ({ value, onChange, onClose, isVisible, inputRef }) => {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isSelectingMinutes, setIsSelectingMinutes] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const clockRef = useRef(null);
  
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const hour24 = parseInt(hours) || 0;
      const minute = parseInt(minutes) || 0;
      
      setSelectedHour(hour24);
      setSelectedMinute(minute);
      setIs24Hour(hour24 >= 12);
    } else {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = Math.floor(now.getMinutes() / 5) * 5;
      
      setSelectedHour(currentHour);
      setSelectedMinute(currentMinute);
      setIs24Hour(currentHour >= 12);
    }
  }, [value]);

  // 🔥 修正：計算位置的函數，增加延遲確保 DOM 已更新
  useEffect(() => {
    if (isVisible && inputRef?.current) {
      // 🔥 使用 setTimeout 確保在下一個事件循環中計算位置
      const timer = setTimeout(() => {
        const inputRect = inputRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const clockWidth = 300;
        const clockHeight = 450;

        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        let newPosition = {};

        const spaceBelow = viewportHeight - inputRect.bottom - 10;
        const spaceAbove = inputRect.top - 10;

        if (spaceBelow >= clockHeight) {
          newPosition.top = inputRect.bottom + scrollY + 5;
        } else if (spaceAbove >= clockHeight) {
          newPosition.top = inputRect.top + scrollY - clockHeight - 5;
        } else {
          if (spaceBelow > spaceAbove) {
            newPosition.top = inputRect.bottom + scrollY + 5;
          } else {
            newPosition.top = Math.max(scrollY + 10, inputRect.top + scrollY - clockHeight - 5);
          }
        }

        if (inputRect.left + clockWidth <= viewportWidth - 10) {
          newPosition.left = inputRect.left + scrollX;
        } else {
          newPosition.left = Math.max(scrollX + 10, viewportWidth + scrollX - clockWidth - 10);
        }

        setPosition(newPosition);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isVisible, inputRef]);

  const handleHourClick = (displayHour) => {
    let actualHour = displayHour;
    if (is24Hour && displayHour !== 12) {
      actualHour = displayHour + 12;
    } else if (!is24Hour && displayHour === 12) {
      actualHour = 0;
    }
    
    setSelectedHour(actualHour);
    setIsSelectingMinutes(true);
  };

  const handleMinuteClick = (minute) => {
    setSelectedMinute(minute);
  };

  const handleHourDisplayClick = () => {
    setIsSelectingMinutes(false);
  };

  const handleMinuteDisplayClick = () => {
    setIsSelectingMinutes(true);
  };

  const togglePeriod = () => {
    const newIs24Hour = !is24Hour;
    setIs24Hour(newIs24Hour);
    
    if (newIs24Hour) {
      if (selectedHour < 12) {
        setSelectedHour(selectedHour === 0 ? 12 : selectedHour + 12);
      }
    } else {
      if (selectedHour >= 12) {
        setSelectedHour(selectedHour === 12 ? 0 : selectedHour - 12);
      }
    }
  };

  const handleComplete = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange(formattedTime);
    setIsSelectingMinutes(false);
    onClose();
  };

  // 🔥 修正：阻止事件冒泡的處理函數
  const handleClockClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const getHourPosition = (hour) => {
    const angle = (hour * 30 - 90) * (Math.PI / 180);
    const radius = 80;
    return {
      x: Math.cos(angle) * radius + 120,
      y: Math.sin(angle) * radius + 120
    };
  };

  const getMinutePosition = (minute) => {
    const angle = (minute * 6 - 90) * (Math.PI / 180);
    const radius = 80;
    return {
      x: Math.cos(angle) * radius + 120,
      y: Math.sin(angle) * radius + 120
    };
  };

  const getDisplayHour = () => {
    if (selectedHour === 0) return 12;
    if (selectedHour > 12) return selectedHour - 12;
    return selectedHour;
  };

  const getHourAngle = () => {
    const displayHour = getDisplayHour();
    return displayHour === 12 ? 0 : (displayHour * 30);
  };

  const getMinuteAngle = () => {
    return selectedMinute === 0 ? 0 : (selectedMinute * 6);
  };

  if (!isVisible) return null;

  // 🔥 使用 Portal 並增加事件處理
  return createPortal(
    <>
      {/* 🔥 遮罩層 - 修正事件處理 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2147483646,
          background: 'rgba(0, 0, 0, 0.1)' // 🔥 添加半透明背景便於調試
        }}
        onClick={handleOverlayClick}
        onMouseDown={handleOverlayClick} // 🔥 同時處理 mousedown 事件
      />
      
      {/* 🔥 時鐘選擇器 - 修正事件處理 */}
      <div 
        ref={clockRef}
        onClick={handleClockClick} // 🔥 阻止事件冒泡
        onMouseDown={handleClockClick} // 🔥 阻止 mousedown 事件冒泡
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 2147483647,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          width: '300px',
          maxHeight: '90vh',
          overflow: 'visible'
        }}
      >
        {/* 時間顯示和AM/PM切換 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '30px'
        }}>
          <span 
            onClick={handleHourDisplayClick}
            style={{ 
              color: !isSelectingMinutes ? '#4285f4' : '#666',
              cursor: 'pointer',
              padding: '5px 8px',
              borderRadius: '8px',
              background: !isSelectingMinutes ? '#e3f2fd' : 'transparent',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
          >
            {selectedHour.toString().padStart(2, '0')}
          </span>
          
          <span style={{ color: '#666' }}>:</span>
          
          <span 
            onClick={handleMinuteDisplayClick}
            style={{ 
              color: isSelectingMinutes ? '#4285f4' : '#666',
              cursor: 'pointer',
              padding: '5px 8px',
              borderRadius: '8px',
              background: isSelectingMinutes ? '#e3f2fd' : 'transparent',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
          >
            {selectedMinute.toString().padStart(2, '0')}
          </span>
          
          <button
            onClick={togglePeriod}
            style={{
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '14px',
              cursor: 'pointer',
              marginLeft: '10px',
              transition: 'all 0.2s ease'
            }}
          >
            {is24Hour ? 'PM' : 'AM'}
          </button>
        </div>

        {/* 時鐘面板 */}
        <div style={{
          position: 'relative',
          width: '240px',
          height: '240px',
          margin: '0 auto',
          background: '#f5f5f5',
          borderRadius: '50%',
          border: '1px solid #e0e0e0'
        }}>
          {/* 中心點 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            background: '#4285f4',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }} />

          {/* 指針 */}
          {!isSelectingMinutes ? (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '3px',
              height: '60px',
              background: '#4285f4',
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${getHourAngle()}deg)`,
              zIndex: 5,
              borderRadius: '2px'
            }} />
          ) : (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '80px',
              background: '#4285f4',
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${getMinuteAngle()}deg)`,
              zIndex: 5,
              borderRadius: '1px'
            }} />
          )}

          {/* 數字 */}
          {!isSelectingMinutes ? (
            Array.from({ length: 12 }, (_, i) => {
              const displayHour = i + 1;
              const pos = getHourPosition(displayHour);
              const isSelected = getDisplayHour() === displayHour;
              
              return (
                <div
                  key={displayHour}
                  onClick={() => handleHourClick(displayHour)}
                  style={{
                    position: 'absolute',
                    left: pos.x - 15,
                    top: pos.y - 15,
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: isSelected ? '#4285f4' : 'transparent',
                    color: isSelected ? 'white' : '#333',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                  }}
                >
                  {displayHour}
                </div>
              );
            })
          ) : (
            Array.from({ length: 12 }, (_, i) => {
              const minute = i * 5;
              const pos = getMinutePosition(minute);
              const isSelected = selectedMinute === minute;
              
              return (
                <div
                  key={minute}
                  onClick={() => handleMinuteClick(minute)}
                  style={{
                    position: 'absolute',
                    left: pos.x - 15,
                    top: pos.y - 15,
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    background: isSelected ? '#4285f4' : 'transparent',
                    color: isSelected ? 'white' : '#333',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                  }}
                >
                  {minute.toString().padStart(2, '0')}
                </div>
              );
            })
          )}
        </div>

        {/* 操作按鈕 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: 'Microsoft JhengHei',
              transition: 'all 0.2s ease'
            }}
          >
            取消
          </button>
          
          <button
            onClick={handleComplete}
            style={{
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              fontFamily: 'Microsoft JhengHei',
              transition: 'all 0.2s ease'
            }}
          >
            完成
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

// SVG 時鐘圖標組件
const ClockIcon = ({ size = 20, color = '#9CA3AF' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M12 6v6l4 2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 🔥 修正：時間選擇器輸入組件
const TimePickerInput = ({ value, onChange, placeholder = "選擇時間", disabled = false }) => {
  const [isClockVisible, setIsClockVisible] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // 🔥 修正：點擊外部關閉的邏輯
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 🔥 檢查點擊是否在容器外部，但不包括時鐘選擇器本身
      if (containerRef.current && 
          !containerRef.current.contains(event.target) &&
          !event.target.closest('[data-clock-picker]')) {
        setIsClockVisible(false);
      }
    };

    if (isClockVisible) {
      // 🔥 延遲添加事件監聽器，避免立即觸發
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isClockVisible]);

  // 🔥 修正：點擊輸入框的處理
  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled) {
      setIsClockVisible(prev => !prev);
    }
  };

  const formatTimeDisplay = (time) => {
    if (!time) return placeholder;
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  return (
    <div ref={containerRef} style={{ 
      position: 'relative',
      zIndex: 1
    }}>
      <div
        ref={inputRef}
        onClick={handleInputClick}
        onMouseDown={(e) => e.preventDefault()} // 🔥 防止 mousedown 事件干擾
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: disabled ? '#F5F5F5' : '#FFFFFF',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #DEE2E6',
          cursor: disabled ? 'not-allowed' : 'pointer',
          minWidth: '120px',
          height: '40px',
          transition: 'border-color 0.2s ease',
          userSelect: 'none' // 🔥 防止文字選取
        }}
      >

        <span style={{ 
          fontSize: '16px', 
          fontFamily: 'Microsoft JhengHei',
          color: disabled ? '#666666' : (value ? '#333333' : '#999999')
        }}>
          {formatTimeDisplay(value)}
        </span>
      </div>
      
      {/* 🔥 添加 data 屬性用於識別 */}
      <div data-clock-picker="true">
        <ClockPicker
          value={value}
          onChange={onChange}
          onClose={() => setIsClockVisible(false)}
          isVisible={isClockVisible && !disabled}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export { ClockPicker, TimePickerInput, ClockIcon };
export default TimePickerInput;
