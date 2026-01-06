import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReplenishApply() {
  const [currentTime, setCurrentTime] = useState('14:19');
  const [selectedCardType, setSelectedCardType] = useState('上班');
  const [reason, setReason] = useState('出差');
  const [illustrate, setIllustrate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  // 日期和時間的狀態
  const [replenishDate, setReplenishDate] = useState('2024年 9月25日 週三');
  const [originalTime, setOriginalTime] = useState('09:37');
  const [modifiedTime, setModifiedTime] = useState('09:00');

  // 日期和時間選擇器狀態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showReasonOptions, setShowReasonOptions] = useState(false);

  // 補卡事由選項
  const reasonOptions = [
    { name: '出差', category: '補卡事由' },
    { name: '忘記打卡', category: '補卡事由' },
    { name: '忙私人的事', category: '補卡事由' },
    { name: '其他', category: '補卡事由' }
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

  const handleSubmit = () => {
    setFormSubmitted(true);
    console.log('補卡申請已送出');
    setTimeout(() => {
      setFormSubmitted(false);
      alert('申請已成功送出');
      navigate('/replenish');
    }, 2000);
  };

  const handleCancel = () => {
    console.log('取消補卡申請');
    navigate('/replenish');
  };

  const handleAddAttachment = () => {
    console.log('新增附件');
  };

  // 日期選擇器的處理函數
  const handleDateClick = () => {
    setShowDatePicker(true);
    setShowReasonOptions(false);
  };

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 取得星期幾
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[date.getDay()];
    
    const formattedDate = `${year}年 ${month}月${day}日 週${weekDay}`;
    setReplenishDate(formattedDate);
    setShowDatePicker(false);
  };

  // 時間選擇器的處理函數
  const handleTimeClick = () => {
    setShowTimePicker(true);
    setShowReasonOptions(false);
  };

  const handleTimeSelect = (hour, minute) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setModifiedTime(formattedTime);
    setShowTimePicker(false);
  };

  // 補卡事由選擇器的處理函數
  const handleReasonClick = () => {
    setShowReasonOptions(true);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason.name);
    setShowReasonOptions(false);
  };

  // 點擊覆蓋層關閉選擇器
  const handleOverlayClick = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowReasonOptions(false);
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
      padding: '0',
    },
    formItem: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      padding: '10px 20px',
      boxSizing: 'border-box',
    },
    formLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px',
    },
    cardTypeContainer: {
      display: 'flex',
      gap: '10px',
    },
    cardTypeButton: {
      padding: '10px 0',
      flex: 1,
      textAlign: 'center',
      borderRadius: '4px',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      backgroundColor: '#e9e9e9',
    },
    cardTypeButtonActive: {
      backgroundColor: '#3a75b5',
      color: 'white',
    },
    formRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      borderBottom: '1px solid #f0f0f0',
    },
    formRowLabel: {
      fontSize: '14px',
      color: '#666',
    },
    formRowValue: {
      fontSize: '14px',
      color: '#333',
      textAlign: 'right',
      cursor: 'pointer',
    },
    reasonSelect: {
      border: 'none',
      fontSize: '14px',
      color: '#333',
      backgroundColor: 'transparent',
      appearance: 'none',
      paddingRight: '16px',
      textAlign: 'right',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right center',
    },
    descriptionTextarea: {
      minHeight: '80px',
      width: '100%',
      border: 'none',
      padding: '12px 20px',
      fontSize: '14px',
      resize: 'none',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      boxSizing: 'border-box',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
    },
    attachmentButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#3a75b5',
      fontSize: '14px',
      border: 'none',
      background: 'none',
      padding: '15px 20px',
      cursor: 'pointer',
      width: 'fit-content',
    },
    attachmentIcon: {
      marginRight: '8px',
      color: '#3a75b5',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 20px',
      marginTop: 'auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    cancelButton: {
      width: '48%',
      padding: '12px 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'center',
    },
    submitButton: {
      width: '48%',
      padding: '12px 0',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#3a75b5',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'center',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 5,
      display: showDatePicker || showTimePicker || showReasonOptions ? 'block' : 'none',
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
    calendarContainer: {
      width: '100%',
      padding: '10px 0',
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    calendarTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
    },
    calendarNavButton: {
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '5px 10px',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '5px',
    },
    calendarWeekday: {
      textAlign: 'center',
      padding: '5px',
      fontSize: '12px',
      color: '#666',
    },
    calendarDay: {
      textAlign: 'center',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '14px',
    },
    calendarDaySelected: {
      backgroundColor: '#3a75b5',
      color: 'white',
    },
    calendarDayToday: {
      border: '1px solid #3a75b5',
    },
    calendarDayOtherMonth: {
      color: '#ccc',
    },
    timePickerContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '20px 0',
    },
    timePickerColumn: {
      flex: 1,
      textAlign: 'center',
      height: '150px',
      overflowY: 'auto',
      scrollbarWidth: 'none',
    },
    timePickerItem: {
      padding: '10px 0',
      fontSize: '16px',
      cursor: 'pointer',
    },
    timePickerItemSelected: {
      fontWeight: 'bold',
      color: '#3a75b5',
    },
    pickerActions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderTop: '1px solid #f0f0f0',
      marginTop: '10px',
    },
    pickerCancelButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      color: '#666',
    },
    pickerConfirmButton: {
      padding: '10px 20px',
      border: 'none',
      background: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      color: '#3a75b5',
    },
    reasonOptionsContainer: {
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
      display: showReasonOptions ? 'block' : 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    reasonCategory: {
      padding: '10px 16px',
      backgroundColor: '#f5f7fa',
      color: '#666',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '100%',
      boxSizing: 'border-box',
    },
    reasonOption: {
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
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
      </div>
    );
  };

  const TimePicker = () => {
    const [selectedHour, setSelectedHour] = useState(parseInt(modifiedTime.split(':')[0]));
    const [selectedMinute, setSelectedMinute] = useState(parseInt(modifiedTime.split(':')[1]));

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
          <div style={styles.pageTitle}>補卡申請</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        <div style={styles.formContainer}>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>補卡類型</div>
            <div style={styles.cardTypeContainer}>
              <button
                style={{
                  ...styles.cardTypeButton,
                  ...(selectedCardType === '上班' ? styles.cardTypeButtonActive : {}),
                }}
                onClick={() => setSelectedCardType('上班')}
              >
                上班
              </button>
              <button
                style={{
                  ...styles.cardTypeButton,
                  ...(selectedCardType === '下班' ? styles.cardTypeButtonActive : {}),
                }}
                onClick={() => setSelectedCardType('下班')}
              >
                下班
              </button>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formRowLabel}>補卡事由</div>
            <div style={styles.formRowValue} onClick={handleReasonClick}>
              {reason}
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formRowLabel}>欲補卡日期</div>
            <div style={styles.formRowValue} onClick={handleDateClick}>
              {replenishDate}
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formRowLabel}>已打卡時間</div>
            <div style={styles.formRowValue}>{originalTime}</div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formRowLabel}>改打卡時間</div>
            <div style={styles.formRowValue} onClick={handleTimeClick}>
              {modifiedTime}
            </div>
          </div>

          <div style={{padding: '10px 20px'}}>
            <div style={{...styles.formLabel, marginTop: '10px'}}>說明</div>
            <textarea
              style={styles.descriptionTextarea}
              placeholder=""
              value={illustrate}
              onChange={(e) => setIllustrate(e.target.value)}
            />
          </div>

          <button style={styles.attachmentButton} onClick={handleAddAttachment}>
            <span style={styles.attachmentIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#3a75b5" strokeWidth="2" fill="none"/>
              </svg>
            </span>
            新增附件
          </button>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.cancelButton} onClick={handleCancel}>取消</button>
          <button style={styles.submitButton} onClick={handleSubmit}>
            送出
          </button>
        </div>

        {/* 覆蓋層 */}
        <div style={styles.overlay} onClick={handleOverlayClick}></div>

        {/* 補卡事由選擇器 */}
        <div style={styles.reasonOptionsContainer}>
          <div style={styles.reasonCategory}>補卡事由</div>
          {reasonOptions.map((option, index) => (
            <div 
              key={index} 
              style={styles.reasonOption} 
              onClick={() => handleReasonSelect(option)}
            >
              <div>{option.name}</div>
            </div>
          ))}
        </div>

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

export default ReplenishApply;
