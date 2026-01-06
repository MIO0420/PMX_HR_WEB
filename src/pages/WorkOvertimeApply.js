import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function WorkOvertimeApply() {
  const [currentTime, setCurrentTime] = useState('18:32');
  const [startDate, setStartDate] = useState('2024年9月14日');
  const [startTime, setStartTime] = useState('18:30');
  const [endDate, setEndDate] = useState('2024年9月14日');
  const [endTime, setEndTime] = useState('20:30');
  const [totalTime, setTotalTime] = useState('2小時 0分鐘');
  const [overtimeType, setOvertimeType] = useState('工作日加班');
  const [reason, setReason] = useState('');
  const [selectedOption, setSelectedOption] = useState('加班費'); // 加班費或換休
  const [loading, setLoading] = useState(false);
  const [showOvertimeTypeOptions, setShowOvertimeTypeOptions] = useState(false);
  const navigate = useNavigate();

  // 日期和時間選擇器狀態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentEditingField, setCurrentEditingField] = useState(null);

  // 加班類型選項
  const overtimeTypes = [
    { name: '工作日加班', category: '加班類型' },
    { name: '休息日加班', category: '加班類型' },
    { name: '例假日加班', category: '加班類型' },
    { name: '休假日加班', category: '加班類型' }
  ];

  // 更新右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 計算總時數
  useEffect(() => {
    // 解析開始和結束時間
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // 計算總分鐘數
    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (totalMinutes < 0) {
      // 跨天情況
      totalMinutes += 24 * 60;
    }

    // 轉換為小時和分鐘
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // 格式化結果
    setTotalTime(`${hours}小時 ${minutes}分鐘`);
  }, [startTime, endTime]);

  // 處理日期點擊
  const handleDateClick = (field) => {
    setCurrentEditingField(field);
    setShowDatePicker(true);
    setShowOvertimeTypeOptions(false);
  };
  
  // 處理時間點擊
  const handleTimeClick = (field) => {
    setCurrentEditingField(field);
    setShowTimePicker(true);
    setShowOvertimeTypeOptions(false);
  };

  // 處理日期選擇
  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}年${month}月${day}日`;
    
    if (currentEditingField === 'startDate') {
      setStartDate(formattedDate);
    } else if (currentEditingField === 'endDate') {
      setEndDate(formattedDate);
    }
    
    setShowDatePicker(false);
  };
  
  // 處理時間選擇
  const handleTimeSelect = (hour, minute) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    if (currentEditingField === 'startTime') {
      setStartTime(formattedTime);
    } else if (currentEditingField === 'endTime') {
      setEndTime(formattedTime);
    }
    
    setShowTimePicker(false);
  };

  // 處理加班類型點擊
  const handleOvertimeTypeClick = () => {
    setShowOvertimeTypeOptions(true);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  // 處理加班類型選擇
  const handleOvertimeTypeSelect = (type) => {
    setOvertimeType(type.name);
    setShowOvertimeTypeOptions(false);
  };

  // 處理表單提交
  const handleSubmit = () => {
    setLoading(true);
    console.log('加班申請已送出');
    
    setTimeout(() => {
      setLoading(false);
      alert('加班申請已送出');
      navigate('/workovertime');
    }, 1000);
  };

  const handleCancel = () => {
    console.log('取消加班申請');
    navigate('/workovertime');
  };

  const handleAddAttachment = () => {
    console.log('新增附件');
  };

  // 處理說明內容變更
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };
  
  // 處理選項選擇
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // 點擊外部關閉下拉選單
  const handleOverlayClick = () => {
    setShowOvertimeTypeOptions(false);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    appWrapper: {
      width: '100%',
      maxWidth: '360px',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3a75b5',
      color: 'white',
      padding: '0 16px',
      height: '50px',
      width: '100%',
      boxSizing: 'border-box',
    },
    homeIcon: {
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    timeDisplay: {
      fontSize: '16px',
      color: '#FFFFFF',
    },
    pageTitle: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      flex: 1,
    },
    formContainer: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    },
    formRow: {
      display: 'flex',
      borderBottom: '1px solid #f0f0f0',
      padding: '15px',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
    },
    formLabel: {
      width: '60px', // 固定寬度，與請假申請表單一致
      fontSize: '14px',
      color: '#666',
      flexShrink: 0,
    },
    formValue: {
      flex: 1,
      fontSize: '14px',
      color: '#333',
      display: 'flex',
      justifyContent: 'flex-end', // 內容靠右對齊
      width: 'calc(100% - 60px)',
      boxSizing: 'border-box',
    },
    dateTimeRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    dateTime: {
      cursor: 'pointer',
    },
    timeInput: {
      marginLeft: '5px',
      cursor: 'pointer',
    },
    optionsContainer: {
      display: 'flex',
      padding: '15px',
      justifyContent: 'space-between',
      gap: '10px',
      width: '100%',
      boxSizing: 'border-box',
    },
    optionButton: {
      flex: 1,
      padding: '10px 0',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'center',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    },
    optionButtonActive: {
      backgroundColor: '#3a75b5',
      color: 'white',
      border: 'none',
    },
    optionButtonInactive: {
      backgroundColor: 'white',
      color: '#333',
      border: '1px solid #ddd',
    },
    reasonSection: {
      padding: '15px',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
    reasonLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
    },
    reasonTextarea: {
      minHeight: '80px',
      width: '100%',
      border: 'none',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      padding: '10px',
      fontSize: '14px',
      resize: 'none',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      boxSizing: 'border-box',
    },
    attachmentButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#3a75b5',
      fontSize: '14px',
      border: 'none',
      background: 'none',
      padding: '5px 0 0 0',
      cursor: 'pointer',
      marginTop: '10px',
      width: 'fit-content',
    },
    attachmentIcon: {
      marginRight: '8px',
      color: '#3a75b5',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px',
      marginTop: 'auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    cancelButton: {
      width: '48%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
    submitButton: {
      width: '48%',
      padding: '12px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#CCCCCC',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
    submitButtonActive: {
      backgroundColor: '#3a75b5',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 5,
      display: showDatePicker || showTimePicker || showOvertimeTypeOptions ? 'block' : 'none',
    },
    pickerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      padding: '16px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 15,
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    overtimeTypeOptionsContainer: {
      position: 'absolute',
      top: '100px',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      zIndex: 10,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxHeight: '70vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: showOvertimeTypeOptions ? 'block' : 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    overtimeTypeCategory: {
      padding: '10px 16px',
      backgroundColor: '#f5f7fa',
      color: '#666',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '100%',
      boxSizing: 'border-box',
    },
    overtimeTypeOption: {
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
    },
    overtimeTypeDropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #f0f0f0',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 10,
      width: '120px',
    },
    overtimeTypeOptionSmall: {
      padding: '12px 15px',
      fontSize: '14px',
      color: '#333',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
    },
    overtimeTypeOptionLast: {
      borderBottom: 'none',
    },
  };

  const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false
      });
    }
    
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        day: i,
        isCurrentMonth: true,
        isSelected: selectedDate && 
                    date.getDate() === selectedDate.getDate() && 
                    date.getMonth() === selectedDate.getMonth() && 
                    date.getFullYear() === selectedDate.getFullYear(),
        isToday: today.getDate() === i && 
                today.getMonth() === currentMonth.getMonth() && 
                today.getFullYear() === currentMonth.getFullYear()
      });
    }
    
    const daysNeeded = 42 - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false
      });
    }
    
    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    
    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    
    const handleDayClick = (day, isCurrentMonth) => {
      if (isCurrentMonth) {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        handleDateSelect(newDate);
      }
    };
    
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    
    const formatMonthTitle = () => {
      return `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`;
    };
    
    return (
      <div style={styles.calendarContainer}>
        <div style={styles.calendarHeader}>
          <button style={styles.calendarNavButton} onClick={prevMonth}>&#8249;</button>
          <div style={styles.calendarTitle}>{formatMonthTitle()}</div>
          <button style={styles.calendarNavButton} onClick={nextMonth}>&#8250;</button>
        </div>
        
        <div style={styles.calendarGrid}>
          {weekdays.map((day, index) => (
            <div key={index} style={styles.calendarWeekday}>
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index} 
              style={{
                ...styles.calendarDay,
                ...(day.isSelected ? styles.calendarDaySelected : {}),
                ...(day.isToday && !day.isSelected ? styles.calendarDayToday : {}),
                ...(day.isCurrentMonth ? {} : styles.calendarDayOtherMonth)
              }}
              onClick={() => handleDayClick(day.day, day.isCurrentMonth)}
            >
              {day.day}
            </div>
          ))}
        </div>
        
        <div style={styles.pickerActions}>
          <button style={styles.pickerCancelButton} onClick={() => setShowDatePicker(false)}>
            取消
          </button>
          <button style={styles.pickerConfirmButton} onClick={() => setShowDatePicker(false)}>
            確認
          </button>
        </div>
      </div>
    );
  };
  
  const TimePicker = () => {
    const [selectedHour, setSelectedHour] = useState(
      currentEditingField === 'startTime' 
        ? parseInt(startTime.split(':')[0]) 
        : parseInt(endTime.split(':')[0])
    );
    const [selectedMinute, setSelectedMinute] = useState(
      currentEditingField === 'startTime' 
        ? parseInt(startTime.split(':')[1]) 
        : parseInt(endTime.split(':')[1])
    );
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    
    const confirmSelection = () => {
      handleTimeSelect(selectedHour, selectedMinute);
    };
    
    const cancelSelection = () => {
      setShowTimePicker(false);
    };
    
    return (
      <div>
        <div style={styles.timePickerContainer}>
          <div style={styles.timePickerColumn}>
            {hours.map((hour) => (
              <div 
                key={hour} 
                style={{
                  ...styles.timePickerItem,
                  ...(hour === selectedHour ? styles.timePickerItemSelected : {})
                }}
                onClick={() => setSelectedHour(hour)}
              >
                {String(hour).padStart(2, '0')}
              </div>
            ))}
          </div>
          
          <div style={styles.timePickerColumn}>
            {minutes.map((minute) => (
              <div 
                key={minute} 
                style={{
                  ...styles.timePickerItem,
                  ...(minute === selectedMinute ? styles.timePickerItemSelected : {})
                }}
                onClick={() => setSelectedMinute(minute)}
              >
                {String(minute).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.pickerActions}>
          <button style={styles.pickerCancelButton} onClick={cancelSelection}>
            取消
          </button>
          <button style={styles.pickerConfirmButton} onClick={confirmSelection}>
            確認
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={() => navigate('/frontpage')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div style={styles.pageTitle}>加班申請</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        <div style={styles.formContainer}>
          {/* 開始時間 */}
          <div style={styles.formRow}>
            <div style={styles.formLabel}>開始時間</div>
            <div style={styles.formValue}>
              <div style={styles.dateTimeRow}>
                <div style={styles.dateTime} onClick={() => handleDateClick('startDate')}>
                  {startDate}
                </div>
                <div style={styles.timeInput} onClick={() => handleTimeClick('startTime')}>
                  {startTime}
                </div>
              </div>
            </div>
          </div>

          {/* 結束時間 */}
          <div style={styles.formRow}>
            <div style={styles.formLabel}>結束時間</div>
            <div style={styles.formValue}>
              <div style={styles.dateTimeRow}>
                <div style={styles.dateTime} onClick={() => handleDateClick('endDate')}>
                  {endDate}
                </div>
                <div style={styles.timeInput} onClick={() => handleTimeClick('endTime')}>
                  {endTime}
                </div>
              </div>
            </div>
          </div>

          {/* 總時數 */}
          <div style={styles.formRow}>
            <div style={styles.formLabel}>總時數</div>
            <div style={styles.formValue}>{totalTime}</div>
          </div>

          {/* 加班類型 */}
          <div style={styles.formRow}>
            <div style={styles.formLabel}>加班類型</div>
            <div style={styles.formValue}>
              <div onClick={handleOvertimeTypeClick}>
                {overtimeType}
              </div>
            </div>
          </div>

          {/* 申請事由 */}
          <div style={styles.reasonSection}>
            <div style={styles.reasonLabel}>申請事由</div>
            <textarea 
              style={styles.reasonTextarea} 
              placeholder="" 
              value={reason} 
              onChange={handleReasonChange}
            />
            <button style={styles.attachmentButton} onClick={handleAddAttachment}>
              <span style={styles.attachmentIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              新增附件
            </button>
          </div>
          
          {/* 加班費/換休選擇 */}
          <div style={styles.optionsContainer}>
            <button 
              style={{
                ...styles.optionButton, 
                ...(selectedOption === '加班費' ? styles.optionButtonActive : styles.optionButtonInactive)
              }} 
              onClick={() => handleOptionSelect('加班費')}
            >
              加班費
            </button>
            <button 
              style={{
                ...styles.optionButton, 
                ...(selectedOption === '換休' ? styles.optionButtonActive : styles.optionButtonInactive)
              }} 
              onClick={() => handleOptionSelect('換休')}
            >
              換休
            </button>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.cancelButton} onClick={handleCancel} disabled={loading}>
            取消
          </button>
          <button 
            style={{
              ...styles.submitButton, 
              ...(reason.trim() !== '' ? styles.submitButtonActive : {})
            }} 
            onClick={handleSubmit}
            disabled={loading}
          >
            送出
          </button>
        </div>
        
        {/* 覆蓋層 */}
        {(showDatePicker || showTimePicker || showOvertimeTypeOptions) && (
          <div style={styles.overlay} onClick={handleOverlayClick}></div>
        )}
        
        {/* 加班類型選擇器 - 全頁面下拉選單 */}
        {showOvertimeTypeOptions && (
          <div style={styles.overtimeTypeOptionsContainer}>
            <div style={styles.overtimeTypeCategory}>加班類型</div>
            {overtimeTypes.map((type, index) => (
              <div 
                key={index} 
                style={styles.overtimeTypeOption} 
                onClick={() => handleOvertimeTypeSelect(type)}
              >
                <div>{type.name}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* 日期選擇器 */}
        {showDatePicker && (
          <div style={styles.pickerContainer}>
            <Calendar />
          </div>
        )}
        
        {/* 時間選擇器 */}
        {showTimePicker && (
          <div style={styles.pickerContainer}>
            <TimePicker />
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkOvertimeApply;
