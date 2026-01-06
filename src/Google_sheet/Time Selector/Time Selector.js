// import React, { useState } from 'react';

// const TimeSelector = ({ 
//   isVisible, 
//   onClose, 
//   onTimeSelect, 
//   currentTime = "09:00",
//   isEditingStart = true 
// }) => {
//   // 將24小時制轉換為12小時制和AM/PM
//   const convertTo12Hour = (hour24) => {
//     if (hour24 === 0) return { hour12: 12, period: 'AM' };
//     if (hour24 < 12) return { hour12: hour24, period: 'AM' };
//     if (hour24 === 12) return { hour12: 12, period: 'PM' };
//     return { hour12: hour24 - 12, period: 'PM' };
//   };

//   // 將12小時制和AM/PM轉換為24小時制
//   const convertTo24Hour = (hour12, period) => {
//     if (period === 'AM') {
//       return hour12 === 12 ? 0 : hour12;
//     } else {
//       return hour12 === 12 ? 12 : hour12 + 12;
//     }
//   };

//   const [currentHour24] = currentTime.split(':').map(Number);
//   const currentMinute = parseInt(currentTime.split(':')[1]);
  
//   const current12Hour = convertTo12Hour(currentHour24);
  
//   const [selectedHour12, setSelectedHour12] = useState(current12Hour.hour12);
//   const [selectedMinute, setSelectedMinute] = useState(currentMinute >= 30 ? 30 : 0);
//   const [selectedPeriod, setSelectedPeriod] = useState(current12Hour.period);
  
//   const hours12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
//   const minutes = [0, 30]; // 只有 00 和 30
//   const periods = ['AM', 'PM'];
  
//   const confirmSelection = () => {
//     const hour24 = convertTo24Hour(selectedHour12, selectedPeriod);
//     onTimeSelect(hour24, selectedMinute);
//   };
  
//   const cancelSelection = () => {
//     onClose();
//   };

//   if (!isVisible) return null;

//   // 內聯樣式
//   const styles = {
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       zIndex: 10
//     },
//     container: {
//       position: 'fixed',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       backgroundColor: 'white',
//       borderTopLeftRadius: '20px',
//       borderTopRightRadius: '20px',
//       padding: '20px',
//       boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
//       zIndex: 15,
//       maxHeight: '85vh',
//       overflow: 'hidden'
//     },
//     pickerContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'flex-start',
//       padding: '20px 0',
//       gap: '15px',
//       WebkitTouchCallout: 'none',
//       WebkitUserSelect: 'none',
//       KhtmlUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       userSelect: 'none'
//     },
//     column: {
//       flex: 1,
//       textAlign: 'center',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       minWidth: '60px'
//     },
//     scroll: {
//       height: '200px',
//       overflowY: 'auto',
//       overflowX: 'hidden',
//       width: '100%',
//       border: '1px solid #f0f0f0',
//       borderRadius: '8px',
//       backgroundColor: '#fafafa',
//       scrollbarWidth: 'none', // Firefox
//       msOverflowStyle: 'none', // IE and Edge
//       WebkitScrollbar: {
//         display: 'none' // Chrome, Safari, Opera
//       }
//     },
//     item: {
//       padding: '12px 0',
//       fontSize: '16px',
//       cursor: 'pointer',
//       borderBottom: '1px solid #f5f5f5',
//       userSelect: 'none',
//       WebkitUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       transition: 'all 0.2s ease'
//     },
//     itemSelected: {
//       fontWeight: 'bold',
//       color: 'white',
//       backgroundColor: '#3a75b5'
//     },
//     separator: {
//       fontSize: '24px',
//       fontWeight: 'bold',
//       color: '#3a75b5',
//       marginTop: '35px',
//       userSelect: 'none',
//       WebkitUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       flexShrink: 0
//     },
//     actions: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '20px 0 10px 0',
//       borderTop: '1px solid #f0f0f0',
//       marginTop: '20px',
//       WebkitTouchCallout: 'none',
//       WebkitUserSelect: 'none',
//       KhtmlUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       userSelect: 'none'
//     },
//     cancelButton: {
//       padding: '12px 24px',
//       border: '1px solid #ddd',
//       background: 'white',
//       fontSize: '14px',
//       cursor: 'pointer',
//       color: '#666',
//       borderRadius: '6px',
//       userSelect: 'none',
//       WebkitUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       transition: 'all 0.2s ease'
//     },
//     confirmButton: {
//       padding: '12px 24px',
//       border: 'none',
//       background: '#3a75b5',
//       fontSize: '14px',
//       fontWeight: 'bold',
//       cursor: 'pointer',
//       color: 'white',
//       borderRadius: '6px',
//       userSelect: 'none',
//       WebkitUserSelect: 'none',
//       MozUserSelect: 'none',
//       MsUserSelect: 'none',
//       transition: 'all 0.2s ease'
//     }
//   };

//   // 處理滑鼠事件
//   const handleItemMouseEnter = (e, isSelected) => {
//     if (!isSelected) {
//       e.target.style.backgroundColor = '#f0f8ff';
//     }
//   };

//   const handleItemMouseLeave = (e, isSelected) => {
//     if (!isSelected) {
//       e.target.style.backgroundColor = 'transparent';
//     }
//   };

//   const handleItemMouseDown = (e, isSelected) => {
//     if (!isSelected) {
//       e.target.style.backgroundColor = '#e0f0ff';
//     }
//   };

//   const handleItemMouseUp = (e, isSelected) => {
//     if (!isSelected) {
//       e.target.style.backgroundColor = '#f0f8ff';
//     }
//   };

//   const handleCancelButtonMouseEnter = (e) => {
//     e.target.style.backgroundColor = '#f5f5f5';
//   };

//   const handleCancelButtonMouseLeave = (e) => {
//     e.target.style.backgroundColor = 'white';
//   };

//   const handleCancelButtonMouseDown = (e) => {
//     e.target.style.backgroundColor = '#eeeeee';
//   };

//   const handleCancelButtonMouseUp = (e) => {
//     e.target.style.backgroundColor = '#f5f5f5';
//   };

//   const handleConfirmButtonMouseEnter = (e) => {
//     e.target.style.backgroundColor = '#2d5a8f';
//   };

//   const handleConfirmButtonMouseLeave = (e) => {
//     e.target.style.backgroundColor = '#3a75b5';
//   };

//   const handleConfirmButtonMouseDown = (e) => {
//     e.target.style.backgroundColor = '#1e3f6f';
//   };

//   const handleConfirmButtonMouseUp = (e) => {
//     e.target.style.backgroundColor = '#2d5a8f';
//   };

//   const getItemStyle = (isSelected) => {
//     return {
//       ...styles.item,
//       ...(isSelected ? styles.itemSelected : {})
//     };
//   };

//   // 隱藏 webkit 滾動條的樣式
//   const scrollStyle = {
//     ...styles.scroll,
//     '::-webkit-scrollbar': {
//       display: 'none'
//     }
//   };
  
//   return (
//     <>
//       <div style={styles.overlay} onClick={cancelSelection}></div>
//       <div style={styles.container}>
//         <div style={styles.pickerContainer}>
//           <div style={styles.column}>
//             <div 
//               style={scrollStyle}
//               css={{
//                 '&::-webkit-scrollbar': {
//                   display: 'none'
//                 }
//               }}
//             >
//               {hours12.map((hour) => {
//                 const isSelected = hour === selectedHour12;
//                 return (
//                   <div 
//                     key={hour} 
//                     style={getItemStyle(isSelected)}
//                     onMouseEnter={(e) => handleItemMouseEnter(e, isSelected)}
//                     onMouseLeave={(e) => handleItemMouseLeave(e, isSelected)}
//                     onMouseDown={(e) => handleItemMouseDown(e, isSelected)}
//                     onMouseUp={(e) => handleItemMouseUp(e, isSelected)}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setSelectedHour12(hour);
//                     }}
//                   >
//                     {hour}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
          
//           <div style={styles.separator}>:</div>
          
//           <div style={styles.column}>
//             <div 
//               style={scrollStyle}
//               css={{
//                 '&::-webkit-scrollbar': {
//                   display: 'none'
//                 }
//               }}
//             >
//               {minutes.map((minute) => {
//                 const isSelected = minute === selectedMinute;
//                 return (
//                   <div 
//                     key={minute} 
//                     style={getItemStyle(isSelected)}
//                     onMouseEnter={(e) => handleItemMouseEnter(e, isSelected)}
//                     onMouseLeave={(e) => handleItemMouseLeave(e, isSelected)}
//                     onMouseDown={(e) => handleItemMouseDown(e, isSelected)}
//                     onMouseUp={(e) => handleItemMouseUp(e, isSelected)}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setSelectedMinute(minute);
//                     }}
//                   >
//                     {String(minute).padStart(2, '0')}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <div style={styles.column}>
//             <div 
//               style={scrollStyle}
//               css={{
//                 '&::-webkit-scrollbar': {
//                   display: 'none'
//                 }
//               }}
//             >
//               {periods.map((period) => {
//                 const isSelected = period === selectedPeriod;
//                 return (
//                   <div 
//                     key={period} 
//                     style={getItemStyle(isSelected)}
//                     onMouseEnter={(e) => handleItemMouseEnter(e, isSelected)}
//                     onMouseLeave={(e) => handleItemMouseLeave(e, isSelected)}
//                     onMouseDown={(e) => handleItemMouseDown(e, isSelected)}
//                     onMouseUp={(e) => handleItemMouseUp(e, isSelected)}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setSelectedPeriod(period);
//                     }}
//                   >
//                     {period}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
        
//         <div style={styles.actions}>
//           <button 
//             style={styles.cancelButton}
//             onMouseEnter={handleCancelButtonMouseEnter}
//             onMouseLeave={handleCancelButtonMouseLeave}
//             onMouseDown={handleCancelButtonMouseDown}
//             onMouseUp={handleCancelButtonMouseUp}
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               cancelSelection();
//             }}
//           >
//             取消
//           </button>
//           <button 
//             style={styles.confirmButton}
//             onMouseEnter={handleConfirmButtonMouseEnter}
//             onMouseLeave={handleConfirmButtonMouseLeave}
//             onMouseDown={handleConfirmButtonMouseDown}
//             onMouseUp={handleConfirmButtonMouseUp}
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               confirmSelection();
//             }}
//           >
//             確認
//           </button>
//         </div>
//       </div>
      
//       {/* 添加全域樣式來隱藏滾動條 */}
//       <style>
//         {`
//           .time-picker-scroll-hide::-webkit-scrollbar {
//             display: none;
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default TimeSelector;
import React, { useState } from 'react';

const TimeSelector = ({ 
  isVisible, 
  onClose, 
  onTimeSelect, 
  currentTime = "09:00",
  isEditingStart = true 
}) => {
  const [currentHour24] = currentTime.split(':').map(Number);
  const currentMinute = parseInt(currentTime.split(':')[1]);
  
  const [selectedHour24, setSelectedHour24] = useState(currentHour24);
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);
  
  const hours24 = Array.from({ length: 24 }, (_, i) => i); // 0-23
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0-59
  
  const confirmSelection = () => {
    onTimeSelect(selectedHour24, selectedMinute);
  };
  
  const cancelSelection = () => {
    onClose();
  };

  if (!isVisible) return null;

  // 內聯樣式
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10
    },
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      padding: '20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 15,
      maxHeight: '85vh',
      overflow: 'hidden'
    },
    pickerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px 0',
      gap: '15px',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none'
    },
    column: {
      flex: 1,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '80px'
    },
    scroll: {
      height: '200px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE and Edge
      WebkitScrollbar: {
        display: 'none' // Chrome, Safari, Opera
      }
    },
    item: {
      padding: '12px 0',
      fontSize: '16px',
      cursor: 'pointer',
      borderBottom: '1px solid #f5f5f5',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      transition: 'all 0.2s ease'
    },
    itemSelected: {
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#3a75b5'
    },
    separator: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#3a75b5',
      marginTop: '35px',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      flexShrink: 0
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px 0 10px 0',
      borderTop: '1px solid #f0f0f0',
      marginTop: '20px',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none'
    },
    cancelButton: {
      padding: '12px 24px',
      border: '1px solid #ddd',
      background: 'white',
      fontSize: '14px',
      cursor: 'pointer',
      color: '#666',
      borderRadius: '6px',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      transition: 'all 0.2s ease'
    },
    confirmButton: {
      padding: '12px 24px',
      border: 'none',
      background: '#3a75b5',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      color: 'white',
      borderRadius: '6px',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      transition: 'all 0.2s ease'
    }
  };

  // 處理滑鼠事件
  const handleItemMouseEnter = (e, isSelected) => {
    if (!isSelected) {
      e.target.style.backgroundColor = '#f0f8ff';
    }
  };

  const handleItemMouseLeave = (e, isSelected) => {
    if (!isSelected) {
      e.target.style.backgroundColor = 'transparent';
    }
  };

  const handleItemMouseDown = (e, isSelected) => {
    if (!isSelected) {
      e.target.style.backgroundColor = '#e0f0ff';
    }
  };

  const handleItemMouseUp = (e, isSelected) => {
    if (!isSelected) {
      e.target.style.backgroundColor = '#f0f8ff';
    }
  };

  const handleCancelButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleCancelButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = 'white';
  };

  const handleCancelButtonMouseDown = (e) => {
    e.target.style.backgroundColor = '#eeeeee';
  };

  const handleCancelButtonMouseUp = (e) => {
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleConfirmButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = '#2d5a8f';
  };

  const handleConfirmButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = '#3a75b5';
  };

  const handleConfirmButtonMouseDown = (e) => {
    e.target.style.backgroundColor = '#1e3f6f';
  };

  const handleConfirmButtonMouseUp = (e) => {
    e.target.style.backgroundColor = '#2d5a8f';
  };

  const getItemStyle = (isSelected) => {
    return {
      ...styles.item,
      ...(isSelected ? styles.itemSelected : {})
    };
  };

  // 隱藏 webkit 滾動條的樣式
  const scrollStyle = {
    ...styles.scroll,
    '::-webkit-scrollbar': {
      display: 'none'
    }
  };
  
  return (
    <>
      <div style={styles.overlay} onClick={cancelSelection}></div>
      <div style={styles.container}>
        <div style={styles.pickerContainer}>
          <div style={styles.column}>
            <div 
              style={scrollStyle}
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {hours24.map((hour) => {
                const isSelected = hour === selectedHour24;
                return (
                  <div 
                    key={hour} 
                    style={getItemStyle(isSelected)}
                    onMouseEnter={(e) => handleItemMouseEnter(e, isSelected)}
                    onMouseLeave={(e) => handleItemMouseLeave(e, isSelected)}
                    onMouseDown={(e) => handleItemMouseDown(e, isSelected)}
                    onMouseUp={(e) => handleItemMouseUp(e, isSelected)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedHour24(hour);
                    }}
                  >
                    {String(hour).padStart(2, '0')}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div style={styles.separator}>:</div>
          
          <div style={styles.column}>
            <div 
              style={scrollStyle}
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {minutes.map((minute) => {
                const isSelected = minute === selectedMinute;
                return (
                  <div 
                    key={minute} 
                    style={getItemStyle(isSelected)}
                    onMouseEnter={(e) => handleItemMouseEnter(e, isSelected)}
                    onMouseLeave={(e) => handleItemMouseLeave(e, isSelected)}
                    onMouseDown={(e) => handleItemMouseDown(e, isSelected)}
                    onMouseUp={(e) => handleItemMouseUp(e, isSelected)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedMinute(minute);
                    }}
                  >
                    {String(minute).padStart(2, '0')}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div style={styles.actions}>
          <button 
            style={styles.cancelButton}
            onMouseEnter={handleCancelButtonMouseEnter}
            onMouseLeave={handleCancelButtonMouseLeave}
            onMouseDown={handleCancelButtonMouseDown}
            onMouseUp={handleCancelButtonMouseUp}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              cancelSelection();
            }}
          >
            取消
          </button>
          <button 
            style={styles.confirmButton}
            onMouseEnter={handleConfirmButtonMouseEnter}
            onMouseLeave={handleConfirmButtonMouseLeave}
            onMouseDown={handleConfirmButtonMouseDown}
            onMouseUp={handleConfirmButtonMouseUp}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              confirmSelection();
            }}
          >
            確認
          </button>
        </div>
      </div>
      
      {/* 添加全域樣式來隱藏滾動條 */}
      <style>
        {`
          .time-picker-scroll-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  );
};

export default TimeSelector;
