// import React, { useState, useEffect } from 'react';

// const CalendarSelector = ({ isVisible, onClose, onDateSelect, isEditingStart, selectedDate: externalSelectedDate }) => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(externalSelectedDate || new Date());

//   // 當外部傳入的選中日期改變時，更新內部狀態
//   useEffect(() => {
//     if (externalSelectedDate) {
//       setSelectedDate(externalSelectedDate);
//       // 同時更新當前顯示的月份到選中日期所在的月份
//       setCurrentMonth(new Date(externalSelectedDate.getFullYear(), externalSelectedDate.getMonth(), 1));
//     }
//   }, [externalSelectedDate]);
  
//   if (!isVisible) return null;

//   const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//   const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
//   const daysInMonth = lastDayOfMonth.getDate();
//   const firstDayOfWeek = firstDayOfMonth.getDay();
  
//   const days = [];
//   const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  
//   // 上個月的日期
//   for (let i = firstDayOfWeek - 1; i >= 0; i--) {
//     days.push({
//       day: prevMonthLastDay - i,
//       isCurrentMonth: false,
//       isSelected: false,
//       isToday: false
//     });
//   }
  
//   // 當月的日期
//   const today = new Date();
//   for (let i = 1; i <= daysInMonth; i++) {
//     const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
//     days.push({
//       day: i,
//       isCurrentMonth: true,
//       isSelected: selectedDate && 
//                   date.getDate() === selectedDate.getDate() && 
//                   date.getMonth() === selectedDate.getMonth() && 
//                   date.getFullYear() === selectedDate.getFullYear(),
//       isToday: today.getDate() === i && 
//               today.getMonth() === currentMonth.getMonth() && 
//               today.getFullYear() === currentMonth.getFullYear()
//     });
//   }
  
//   // 下個月的日期
//   const daysNeeded = 42 - days.length;
//   for (let i = 1; i <= daysNeeded; i++) {
//     days.push({
//       day: i,
//       isCurrentMonth: false,
//       isSelected: false,
//       isToday: false
//     });
//   }
  
//   const prevMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
//   };
  
//   const nextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
//   };
  
//   const handleDayClick = (day, isCurrentMonth) => {
//     if (isCurrentMonth) {
//       const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//       setSelectedDate(newDate);
//       onDateSelect(newDate);
//     }
//   };
  
//   const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  
//   const formatMonthTitle = () => {
//     return `${currentMonth.getMonth() + 1}月 ${currentMonth.getFullYear()}`;
//   };

//   // 🔥 計算絕對位置的函數
//   const getAbsolutePosition = (index) => {
//     const row = Math.floor(index / 7);
//     const col = index % 7;
//     const cellWidth = 52; // 44px + 8px gap
//     const cellHeight = 52; // 44px + 8px gap
    
//     return {
//       left: col * cellWidth,
//       top: row * cellHeight
//     };
//   };

//   // 🔥 完全固定位置的樣式
//   const styles = {
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       zIndex: 5
//     },
//     pickerContainer: {
//       position: 'absolute',
//       bottom: 0,
//       left: '50%',
//       transform: 'translateX(-50%)',
//       width: '450px',
//       maxWidth: '90vw',
//       backgroundColor: 'white',
//       borderTopLeftRadius: '20px',
//       borderTopRightRadius: '20px',
//       padding: 0,
//       boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
//       zIndex: 15,
//       maxHeight: '90vh',
//       overflow: 'hidden'
//     },
//     container: {
//       width: '100%',
//       padding: '20px',
//       backgroundColor: 'white',
//       WebkitTouchCallout: 'none',
//       WebkitUserSelect: 'none',
//       KhtmlUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       userSelect: 'none'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '25px',
//       padding: '0 10px'
//     },
//     title: {
//       fontSize: '18px',
//       fontWeight: 600,
//       color: '#333',
//       textAlign: 'left',
//       flex: 1
//     },
//     navButtons: {
//       display: 'flex',
//       gap: '8px'
//     },
//     navButton: {
//       background: 'none',
//       border: 'none',
//       fontSize: '22px',
//       cursor: 'pointer',
//       padding: '8px 12px',
//       borderRadius: '50%',
//       color: '#666',
//       userSelect: 'none',
//       WebkitUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       width: '40px',
//       height: '40px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     // 🔥 改用相對定位的容器
//     calendarContainer: {
//       position: 'relative',
//       width: '364px', // 7 * 52px
//       height: '364px', // 7 * 52px (包含週標題)
//       margin: '0 auto'
//     },
//     weekdayContainer: {
//       position: 'relative',
//       width: '364px',
//       height: '44px',
//       marginBottom: '8px'
//     },
//     weekday: {
//       position: 'absolute',
//       width: '44px',
//       height: '44px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontSize: '14px',
//       color: '#999',
//       fontWeight: 500
//     },
//     dayContainer: {
//       position: 'relative',
//       width: '364px',
//       height: '312px' // 6 rows * 52px
//     },
//     day: {
//       position: 'absolute',
//       width: '44px',
//       height: '44px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       textAlign: 'center',
//       borderRadius: '50%',
//       cursor: 'pointer',
//       fontSize: '16px',
//       userSelect: 'none',
//       WebkitUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       color: '#333',
//       fontWeight: 500,
//       // 🔥 完全禁用任何動畫和變化
//       transition: 'none',
//       transform: 'none',
//       boxShadow: 'none',
//       margin: 0,
//       padding: 0,
//       border: 'none',
//       outline: 'none',
//       boxSizing: 'border-box'
//     }
//   };

//   const getDayStyle = (day, index) => {
//     const position = getAbsolutePosition(index);
//     let style = { 
//       ...styles.day,
//       left: position.left + 'px',
//       top: position.top + 'px'
//     };
    
//     if (day.isSelected) {
//       style = {
//         ...style,
//         backgroundColor: '#007AFF',
//         color: 'white',
//         fontWeight: 600
//       };
//     } else if (day.isToday) {
//       style = {
//         ...style,
//         backgroundColor: '#e3f2fd',
//         color: '#1976d2',
//         fontWeight: 600
//       };
//     }
    
//     if (!day.isCurrentMonth) {
//       style = {
//         ...style,
//         color: '#ccc',
//         cursor: 'default'
//       };
//     }
    
//     return style;
//   };

//   const getWeekdayStyle = (index) => {
//     return {
//       ...styles.weekday,
//       left: (index * 52) + 'px'
//     };
//   };

//   return (
//     <>
//       <div style={styles.overlay} onClick={onClose}></div>
//       <div style={styles.pickerContainer}>
//         <div style={styles.container}>
//           <div style={styles.header}>
//             <div style={styles.title}>{formatMonthTitle()}</div>
//             <div style={styles.navButtons}>
//               <button 
//                 style={styles.navButton}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   prevMonth();
//                 }}
//               >
//                 &#8249;
//               </button>
//               <button 
//                 style={styles.navButton}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   nextMonth();
//                 }}
//               >
//                 &#8250;
//               </button>
//             </div>
//           </div>
          
//           <div style={styles.calendarContainer}>
//             {/* 週標題 */}
//             <div style={styles.weekdayContainer}>
//               {weekdays.map((day, index) => (
//                 <div key={index} style={getWeekdayStyle(index)}>
//                   {day}
//                 </div>
//               ))}
//             </div>
            
//             {/* 日期 */}
//             <div style={styles.dayContainer}>
//               {days.map((day, index) => (
//                 <div 
//                   key={index} 
//                   style={getDayStyle(day, index)}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleDayClick(day.day, day.isCurrentMonth);
//                   }}
//                 >
//                   {day.day}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CalendarSelector;
import React, { useState, useEffect } from 'react';

const CalendarSelector = ({ isVisible, onClose, onDateSelect, isEditingStart, selectedDate: externalSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || new Date());

  // 當外部傳入的選中日期改變時，更新內部狀態
  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
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
  
  // 🔥 修復點擊處理函數
  const handleDayClick = (day, isCurrentMonth, event) => {
    event.preventDefault();
    event.stopPropagation();
    
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

  // 🔥 修改為使用 CSS Grid 布局，避免絕對定位問題
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    },
    pickerContainer: {
      width: '450px',
      maxWidth: '90vw',
      backgroundColor: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: '20px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      maxHeight: '90vh',
      overflow: 'hidden'
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
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    // 🔥 使用 CSS Grid 替代絕對定位
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      width: '100%',
      maxWidth: '364px',
      margin: '0 auto'
    },
    weekday: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '44px',
      fontSize: '14px',
      color: '#999',
      fontWeight: 500,
      userSelect: 'none'
    },
    dayButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 500,
      color: '#333',
      userSelect: 'none',
      // 🔥 完全禁用動畫和變換
      transition: 'none !important',
      transform: 'none !important',
      position: 'static !important',
      margin: '0 !important',
      padding: '0 !important',
      outline: 'none'
    }
  };

  const getDayButtonStyle = (day) => {
    let style = { ...styles.dayButton };
    
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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.pickerContainer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>{formatMonthTitle()}</div>
          <div style={styles.navButtons}>
            <button 
              style={styles.navButton}
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
        
        {/* 🔥 使用 Grid 布局替代絕對定位 */}
        <div style={styles.calendarGrid}>
          {/* 週標題 */}
          {weekdays.map((day, index) => (
            <div key={`weekday-${index}`} style={styles.weekday}>
              {day}
            </div>
          ))}
          
          {/* 日期按鈕 */}
          {days.map((day, index) => (
            <button 
              key={`day-${index}`}
              style={getDayButtonStyle(day)}
              onClick={(e) => handleDayClick(day.day, day.isCurrentMonth, e)}
              disabled={!day.isCurrentMonth}
            >
              {day.day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSelector;
