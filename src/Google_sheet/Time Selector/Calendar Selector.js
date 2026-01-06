import React, { useState, useEffect } from 'react';

const CalendarSelector = ({ isVisible, onClose, onDateSelect, isEditingStart, selectedDate: externalSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || new Date());

  // 當外部傳入的選中日期改變時，更新內部狀態
  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
      // 同時更新當前顯示的月份到選中日期所在的月份
      setCurrentMonth(new Date(externalSelectedDate.getFullYear(), externalSelectedDate.getMonth(), 1));
    }
  }, [externalSelectedDate]);
  if (!isVisible) return null;

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  const days = [];
  const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  
  // 上個月的日期
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isSelected: false,
      isToday: false
    });
  }
  
  // 當月的日期
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
  
  // 下個月的日期
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
      onDateSelect(newDate);
    }
  };
  
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  
  const formatMonthTitle = () => {
    return `${currentMonth.getMonth() + 1}月 ${currentMonth.getFullYear()}`;
  };

  // 內聯樣式
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 5
    },
    pickerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: 0,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      zIndex: 15,
      maxHeight: '85vh',
      overflow: 'hidden'
    },
    container: {
      width: '100%',
      padding: '20px',
      backgroundColor: 'white',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      padding: '0 10px'
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#333',
      textAlign: 'left',
      flex: 1
    },
    navButtons: {
      display: 'flex',
      gap: '8px'
    },
    navButton: {
      background: 'none',
      border: 'none',
      fontSize: '22px',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '50%',
      color: '#666',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      backgroundColor: 'white'
    },
    weekday: {
      textAlign: 'center',
      padding: '12px 8px',
      fontSize: '14px',
      color: '#999',
      fontWeight: 500
    },
    day: {
      textAlign: 'center',
      padding: '12px 8px',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '16px',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      transition: 'all 0.2s ease',
      color: '#333',
      fontWeight: 500,
      position: 'relative'
    },
    daySelected: {
      backgroundColor: '#007AFF !important',
      color: 'white !important',
      fontWeight: 600
    },
    dayToday: {
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      fontWeight: 600
    },
    dayOtherMonth: {
      color: '#ccc',
      cursor: 'default'
    }
  };

  const getDayStyle = (day) => {
    let style = { ...styles.day };
    
    if (day.isSelected) {
      style = {
        ...style,
        backgroundColor: '#007AFF',
        color: 'white',
        fontWeight: 600
      };
    } else if (day.isToday) {
      style = {
        ...style,
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
        fontWeight: 600
      };
    }
    
    if (!day.isCurrentMonth) {
      style = {
        ...style,
        color: '#ccc',
        cursor: 'default'
      };
    }
    
    return style;
  };

  const handleNavButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleNavButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
  };

  const handleNavButtonMouseDown = (e) => {
    e.target.style.backgroundColor = '#e0e0e0';
  };

  const handleNavButtonMouseUp = (e) => {
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleDayMouseEnter = (e, day) => {
    if (day.isCurrentMonth && !day.isSelected) {
      e.target.style.backgroundColor = '#f0f8ff';
    }
  };

  const handleDayMouseLeave = (e, day) => {
    if (day.isCurrentMonth && !day.isSelected) {
      if (day.isToday) {
        e.target.style.backgroundColor = '#e3f2fd';
      } else {
        e.target.style.backgroundColor = 'transparent';
      }
    }
  };

  const handleDayMouseDown = (e, day) => {
    if (day.isCurrentMonth && !day.isSelected) {
      e.target.style.backgroundColor = '#e0f0ff';
    }
  };

  const handleDayMouseUp = (e, day) => {
    if (day.isCurrentMonth && !day.isSelected) {
      e.target.style.backgroundColor = '#f0f8ff';
    }
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose}></div>
      <div style={styles.pickerContainer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.title}>{formatMonthTitle()}</div>
            <div style={styles.navButtons}>
              <button 
                style={styles.navButton}
                onMouseEnter={handleNavButtonMouseEnter}
                onMouseLeave={handleNavButtonMouseLeave}
                onMouseDown={handleNavButtonMouseDown}
                onMouseUp={handleNavButtonMouseUp}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevMonth();
                }}
              >
                &#8249;
              </button>
              <button 
                style={styles.navButton}
                onMouseEnter={handleNavButtonMouseEnter}
                onMouseLeave={handleNavButtonMouseLeave}
                onMouseDown={handleNavButtonMouseDown}
                onMouseUp={handleNavButtonMouseUp}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextMonth();
                }}
              >
                &#8250;
              </button>
            </div>
          </div>
          
          <div style={styles.grid}>
            {weekdays.map((day, index) => (
              <div key={index} style={styles.weekday}>
                {day}
              </div>
            ))}
            
            {days.map((day, index) => (
              <div 
                key={index} 
                style={getDayStyle(day)}
                onMouseEnter={(e) => handleDayMouseEnter(e, day)}
                onMouseLeave={(e) => handleDayMouseLeave(e, day)}
                onMouseDown={(e) => handleDayMouseDown(e, day)}
                onMouseUp={(e) => handleDayMouseUp(e, day)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDayClick(day.day, day.isCurrentMonth);
                }}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarSelector;
