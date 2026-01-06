// // import React, { useState } from 'react';
// // import Sidebar from './Sidebar';
// // import ClassRosterForm from './Salary/ClassRosterForm';
// // import FixedForm from './Salary/fixedForm';
// // import OvertimeRules from './Salary/OvertimeRules';

// // // 引入圖片
// // import SetAttendanceIcon from './ICON/Set_attendance_parameters.png';
// // import PayrollOperationsIcon from './ICON/Perform_payroll_operations.png';
// // import SalaryListIcon from './ICON/Salary_list.png';

// // const SalaryCalculator = () => {
// //   const [showShiftSettings, setShowShiftSettings] = useState(false);
// //   const [showBasicRules, setShowBasicRules] = useState(false);
// //   const [showOvertimeRules, setShowOvertimeRules] = useState(false);
  
// //   const [basicSettings, setBasicSettings] = useState({
// //     payrollDate: 5,
// //     monthlyLateLimit: 0,
// //     lateMinutesLimit: 0,
// //     restDays: '選擇',
// //     holidays: '選擇',
// //     punchCardRule: 'flexible'
// //   });

// //   const [overtimeSettings, setOvertimeSettings] = useState({
// //     workdayOvertimeStart: '18:30',
// //     workdayOvertimeEnd: '21:30',
// //     workdayOvertimeEnabled: true,
// //     restdayOvertimeStart: '08:00',
// //     restdayOvertimeEnd: '17:00',
// //     restdayOvertimeEnabled: true,
// //     holidayOvertimeEnabled: false,
// //     workdayOvertime0to2: '1.34',
// //     workdayOvertime2to4: '1.67',
// //     restdayOvertime0to2: '1.34',
// //     restdayOvertime2to8: '1.67',
// //     restdayOvertime8to12: '2.67',
// //     holidayOvertime0to8: '1',
// //     holidayOvertime8to12: '2',
// //     vacationOvertime0to8: '1',
// //     vacationOvertime8to10: '1.34',
// //     vacationOvertime10to12: '1.67',
// //     overtimeCompensation: '1'
// //   });

// //   const [shiftSettings, setShiftSettings] = useState({
// //     shiftType: 'scheduled',
// //     shifts: []
// //   });

// //   const [editingShift, setEditingShift] = useState(null);

// //   const addNewShift = () => {
// //     const newShift = {
// //       id: Date.now(),
// //       name: '',
// //       code: '',
// //       startTime: '09:00',
// //       endTime: '18:00',
// //       punchStartRange: '選擇',
// //       punchEndRange: '選擇',
// //       breakStart: '12:00',
// //       breakEnd: '13:00'
// //     };
    
// //     setShiftSettings(prev => ({
// //       ...prev,
// //       shifts: [...prev.shifts, newShift]
// //     }));
// //   };

// //   const deleteShift = (shiftId) => {
// //     setShiftSettings(prev => ({
// //       ...prev,
// //       shifts: prev.shifts.filter(shift => shift.id !== shiftId)
// //     }));
// //   };

// //   const updateShift = (shiftId, field, value) => {
// //     setShiftSettings(prev => ({
// //       ...prev,
// //       shifts: prev.shifts.map(shift => 
// //         shift.id === shiftId ? { ...shift, [field]: value } : shift
// //       )
// //     }));
// //   };

// //   const handleEditShift = (shift) => {
// //     setEditingShift({
// //       shift_name: shift.name,
// //       start_time: shift.startTime,
// //       end_time: shift.endTime,
// //       break_time_start: shift.breakStart,
// //       break_time_end: shift.breakEnd,
// //       repeat_frequency: shift.repeatFrequency || 'daily',
// //       punch_start_range: shift.punchStartRange,
// //       punch_end_range: shift.punchEndRange
// //     });
// //   };

// //   const handleUpdateShift = (shiftData) => {
// //     setShiftSettings(prev => ({
// //       ...prev,
// //       shifts: prev.shifts.map(shift => 
// //         shift.name === editingShift.shift_name ? {
// //           ...shift,
// //           name: shiftData.shift_name,
// //           code: shiftData.shift_name.charAt(0).toUpperCase(),
// //           startTime: shiftData.start_time,
// //           endTime: shiftData.end_time,
// //           punchStartRange: shiftData.punch_start_range,
// //           punchEndRange: shiftData.punch_end_range,
// //           breakStart: shiftData.break_time_start,
// //           breakEnd: shiftData.break_time_end,
// //           repeatFrequency: shiftData.repeat_frequency
// //         } : shift
// //       )
// //     }));
    
// //     setEditingShift(null);
// //     console.log('更新班別成功:', shiftData);
// //   };

// //   const renderShiftTypeSelection = () => (
// //     <div style={{
// //       display: 'flex',
// //       flexDirection: 'row',
// //       alignItems: 'flex-start',
// //       padding: '0px',
// //       position: 'relative',
// //       width: '100%',
// //       height: '70px',
// //       marginTop: '20px',
// //       marginLeft: '0px',
// //     }}>
// //       {[
// //         { key: 'fixed', label: '固定班制' },
// //         { key: 'rotating', label: '輪班制' },
// //         { key: 'scheduled', label: '排班制' }
// //       ].map((type, index) => (
// //         <button
// //           key={type.key}
// //           onClick={() => setShiftSettings(prev => ({ ...prev, shiftType: type.key }))}
// //           style={{
// //             flex: 1,
// //             height: '70px',
// //             padding: '20px',
// //             fontSize: '18px',
// //             fontWeight: '500',
// //             cursor: 'pointer',
// //             fontFamily: 'Microsoft JhengHei',
// //             transition: 'all 0.3s ease',
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'center',
            
// //             ...(shiftSettings.shiftType === type.key ? {
// //               background: '#5B8EC8',
// //               color: 'white',
// //               border: 'none',
// //               zIndex: 2,
// //             } : {
// //               background: 'white',
// //               color: '#666666',
// //               border: '1px solid #D0D0D0',
// //               zIndex: 1,
// //             }),
            
// //             borderRadius: '15px',
// //             borderLeft: index > 0 && shiftSettings.shiftType !== type.key ? 'none' : 
// //                        (shiftSettings.shiftType === type.key ? 'none' : '1px solid #D0D0D0'),
// //           }}
// //           onMouseEnter={(e) => {
// //             if (shiftSettings.shiftType !== type.key) {
// //               e.currentTarget.style.background = '#F0F0F0';
// //             }
// //           }}
// //           onMouseLeave={(e) => {
// //             if (shiftSettings.shiftType !== type.key) {
// //               e.currentTarget.style.background = 'white';
// //             }
// //           }}
// //         >
// //           {type.label}
// //         </button>
// //       ))}
// //     </div>
// //   );

// //   const renderDevelopmentMessage = () => (
// //     <div style={{
// //       display: 'flex',
// //       flexDirection: 'column',
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //       gap: '20px',
// //       width: '100%',
// //       marginTop: '40px',
// //       padding: '60px 20px',
// //       background: '#F9F9F9',
// //       borderRadius: '10px',
// //       border: '1px solid #E9E9E9'
// //     }}>
// //       <div style={{
// //         fontSize: '48px',
// //         color: '#C0C0C0'
// //       }}>
// //         🚧
// //       </div>
// //       <h4 style={{
// //         margin: '0',
// //         fontSize: '24px',
// //         fontWeight: '700',
// //         color: '#919191',
// //         fontFamily: 'Microsoft JhengHei',
// //       }}>功能開發中</h4>
// //       <p style={{
// //         margin: '0',
// //         fontSize: '16px',
// //         color: '#919191',
// //         fontFamily: 'Microsoft JhengHei',
// //         textAlign: 'center',
// //         lineHeight: '1.5'
// //       }}>
// //         此功能正在開發中，敬請期待
// //       </p>
// //     </div>
// //   );

// //   return (
// //     <div style={{
// //       display: 'flex',
// //       flexDirection: 'row',
// //       alignItems: 'flex-start',
// //       padding: '0px',
// //       gap: '0px',
// //       width: '100vw',
// //       minHeight: '100vh',
// //       background: '#F8F8F8',
// //       fontFamily: 'Microsoft JhengHei, Arial, sans-serif',
// //     }}>
// //       {/* 側邊欄區域 */}
// //       <div style={{
// //         width: '300px',
// //         minHeight: '100vh',
// //         flexShrink: 0,
// //       }}>
// //         <Sidebar currentPage="salary" />
// //       </div>

// //       {/* 子功能表 */}
// //       <div style={{
// //         boxSizing: 'border-box',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         justifyContent: 'flex-start',
// //         alignItems: 'center',
// //         padding: '0px 0px 50px 0px',
// //         gap: '10px',
// //         width: '250px',
// //         minHeight: '100vh',
// //         background: 'rgba(255, 255, 255, 0.2)',
// //         borderRight: '1px solid #E9E9E9',
// //         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
// //         flexShrink: 0,
// //       }}>
// //         <div style={{
// //           display: 'flex',
// //           flexDirection: 'column',
// //           alignItems: 'center',
// //           padding: '100px 0px 0px 0px',
// //           gap: '10px',
// //           width: '100%',
// //         }}>
// //           {/* 設定考勤參數 */}
// //           <div style={{
// //             display: 'flex',
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             padding: '18px 20px',
// //             gap: '15px',
// //             width: 'calc(100% - 20px)',
// //             height: '86px',
// //             background: '#FFFFFF',
// //             border: '2px solid rgba(58, 108, 166, 0.2)',
// //             borderRadius: '10px 0px 0px 10px',
// //             marginLeft: '10px',
// //           }}>
// //             <img 
// //               src={SetAttendanceIcon}
// //               alt="設定考勤參數"
// //               style={{
// //                 width: '40px',
// //                 height: '40px',
// //                 flexShrink: 0,
// //                 objectFit: 'contain'
// //               }}
// //             />
            
// //             <div style={{
// //               fontFamily: 'Microsoft JhengHei UI',
// //               fontStyle: 'normal',
// //               fontWeight: '700',
// //               fontSize: '16px',
// //               lineHeight: '20px',
// //               color: '#616161',
// //               flex: 1,
// //             }}>
// //               設定考勤參數
// //             </div>
// //           </div>

// //           {/* 執行薪資作業 */}
// //           <div style={{
// //             boxSizing: 'border-box',
// //             display: 'flex',
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             padding: '18px 20px',
// //             gap: '15px',
// //             width: 'calc(100% - 20px)',
// //             height: '86px',
// //             border: '1px solid rgba(248, 248, 248, 0.5)',
// //             borderRadius: '10px 0px 0px 10px',
// //             marginLeft: '10px',
// //           }}>
// //             <img 
// //               src={PayrollOperationsIcon}
// //               alt="執行薪資作業"
// //               style={{
// //                 width: '40px',
// //                 height: '40px',
// //                 flexShrink: 0,
// //                 objectFit: 'contain',
// //                 opacity: 0.5
// //               }}
// //             />
            
// //             <div style={{
// //               fontFamily: 'Microsoft JhengHei UI',
// //               fontStyle: 'normal',
// //               fontWeight: '400',
// //               fontSize: '16px',
// //               lineHeight: '20px',
// //               color: 'rgba(97, 97, 97, 0.5)',
// //               flex: 1,
// //             }}>
// //               執行薪資作業
// //             </div>
// //           </div>

// //           {/* 薪資清冊 */}
// //           <div style={{
// //             boxSizing: 'border-box',
// //             display: 'flex',
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             padding: '18px 20px',
// //             gap: '15px',
// //             width: 'calc(100% - 20px)',
// //             height: '86px',
// //             borderRadius: '10px 0px 0px 10px',
// //             marginLeft: '10px',
// //           }}>
// //             <img 
// //               src={SalaryListIcon}
// //               alt="薪資清冊"
// //               style={{
// //                 width: '40px',
// //                 height: '40px',
// //                 flexShrink: 0,
// //                 objectFit: 'contain',
// //                 opacity: 0.5
// //               }}
// //             />
            
// //             <div style={{
// //               fontFamily: 'Microsoft JhengHei UI',
// //               fontStyle: 'normal',
// //               fontWeight: '400',
// //               fontSize: '16px',
// //               lineHeight: '20px',
// //               color: 'rgba(97, 97, 97, 0.5)',
// //               flex: 1,
// //             }}>
// //               薪資清冊
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 主內容區 */}
// //       <div style={{
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'flex-start',
// //         padding: '35px 40px 50px 40px',
// //         gap: '30px',
// //         flex: 1,
// //         minHeight: 'calc(100vh - 30px)',
// //         maxHeight: 'calc(100vh - 30px)',
// //         background: '#FFFFFF',
// //         margin: '15px 15px 15px 0px',
// //         borderRadius: '10px',
// //         overflowY: 'auto',
// //         overflowX: 'hidden',
// //       }}>
// //         {/* 基本參數設定標題 */}
// //         <h2 style={{
// //           fontFamily: 'Microsoft JhengHei',
// //           fontStyle: 'normal',
// //           fontWeight: '400',
// //           fontSize: '26px',
// //           lineHeight: '35px',
// //           letterSpacing: '0.01em',
// //           color: '#919191',
// //           margin: '0',
// //           flexShrink: 0,
// //         }}>
// //           基本參數設定
// //         </h2>

// //         {/* 基本參數設定區域 */}
// //         <div style={{
// //           display: 'flex',
// //           flexDirection: 'column',
// //           gap: '20px',
// //           width: '100%',
// //           flexShrink: 0,
// //         }}>
// //           {/* 設定發薪日 */}
// //           <div style={{
// //             boxSizing: 'border-box',
// //             display: 'flex',
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             justifyContent: 'space-between',
// //             padding: '25px 26px',
// //             width: '100%',
// //             height: '70px',
// //             background: '#FFFFFF',
// //             border: '1px solid #E9E9E9',
// //             borderRadius: '10px',
// //           }}>
// //             <span style={{
// //               fontFamily: 'Microsoft JhengHei',
// //               fontStyle: 'normal',
// //               fontWeight: '700',
// //               fontSize: '20px',
// //               lineHeight: '27px',
// //               color: '#1F1F1F',
// //             }}>
// //               設定發薪日
// //             </span>
            
// //             <div style={{ 
// //               display: 'flex', 
// //               alignItems: 'center', 
// //               gap: '10px' 
// //             }}>
// //               <span style={{ 
// //                 fontSize: '16px', 
// //                 color: '#666',
// //                 fontFamily: 'Microsoft JhengHei'
// //               }}>
// //                 每月
// //               </span>
// //               <input
// //                 type="number"
// //                 value={basicSettings.payrollDate}
// //                 onChange={(e) => setBasicSettings(prev => ({ ...prev, payrollDate: e.target.value }))}
// //                 style={{
// //                   width: '60px',
// //                   height: '40px',
// //                   border: '1px solid #C4D4E8',
// //                   borderRadius: '8px',
// //                   padding: '8px 10px',
// //                   fontSize: '16px',
// //                   textAlign: 'center',
// //                   fontFamily: 'Microsoft JhengHei'
// //                 }}
// //               />
// //               <span style={{ 
// //                 fontSize: '16px', 
// //                 color: '#666',
// //                 fontFamily: 'Microsoft JhengHei'
// //               }}>
// //                 日
// //               </span>
// //             </div>
// //           </div>

// //           {/* 班別按鈕 */}
// //           <div 
// //             style={{
// //               boxSizing: 'border-box',
// //               display: 'flex',
// //               flexDirection: 'row',
// //               alignItems: 'center',
// //               justifyContent: 'space-between',
// //               padding: '25px 26px',
// //               width: '100%',
// //               height: '70px',
// //               background: '#FFFFFF',
// //               border: '1px solid #E9E9E9',
// //               borderRadius: '10px',
// //               cursor: 'pointer',
// //               transition: 'all 0.3s ease',
// //             }}
// //             onClick={() => setShowShiftSettings(!showShiftSettings)}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.background = '#F8F9FA';
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.background = '#FFFFFF';
// //             }}
// //           >
// //             <span style={{
// //               fontFamily: 'Microsoft JhengHei',
// //               fontStyle: 'normal',
// //               fontWeight: '700',
// //               fontSize: '20px',
// //               lineHeight: '27px',
// //               color: '#1F1F1F',
// //             }}>
// //               班別
// //             </span>
// //           </div>
// //         </div>

// //         {/* 🔥 班別制度選擇區域 - 緊跟在班別按鈕後面 */}
// //         {showShiftSettings && renderShiftTypeSelection()}

// //         {/* 🔥 班別設定內容 - 緊跟在班別制度選擇後面 */}
// //         {showShiftSettings && (
// //           <div style={{
// //             display: 'flex',
// //             flexDirection: 'column',
// //             gap: '0px',
// //             width: '100%'
// //           }}>
// //             {shiftSettings.shiftType === 'fixed' ? (
// //               <FixedForm
// //                 shifts={shiftSettings.shifts}
// //                 basicSettings={basicSettings}
// //                 onUpdateShift={updateShift}
// //                 onEditShift={handleEditShift}
// //                 onDeleteShift={deleteShift}
// //                 onAddShift={addNewShift}
// //                 onUpdateBasicSettings={setBasicSettings}
// //               />
// //             ) : (shiftSettings.shiftType === 'scheduled' || shiftSettings.shiftType === 'rotating') ? (
// //               <ClassRosterForm
// //                 shifts={shiftSettings.shifts}
// //                 basicSettings={basicSettings}
// //                 onUpdateShift={updateShift}
// //                 onEditShift={handleEditShift}
// //                 onDeleteShift={deleteShift}
// //                 onAddShift={addNewShift}
// //                 onUpdateBasicSettings={setBasicSettings}
// //               />
// //             ) : (
// //               renderDevelopmentMessage()
// //             )}
// //           </div>
// //         )}

// //         {/* 🔥 基本考勤規則按鈕 - 移到這裡 */}
// //         <div 
// //           style={{
// //             boxSizing: 'border-box',
// //             display: 'flex',
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             justifyContent: 'space-between',
// //             padding: '25px 26px',
// //             width: '100%',
// //             height: '70px',
// //             background: '#FFFFFF',
// //             border: '1px solid #E9E9E9',
// //             borderRadius: '10px',
// //             cursor: 'pointer',
// //             transition: 'all 0.3s ease',
// //           }}
// //           onClick={() => setShowBasicRules(!showBasicRules)}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.background = '#F8F9FA';
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.background = '#FFFFFF';
// //           }}
// //         >
// //           <span style={{
// //             fontFamily: 'Microsoft JhengHei',
// //             fontStyle: 'normal',
// //             fontWeight: '700',
// //             fontSize: '20px',
// //             lineHeight: '27px',
// //             color: '#1F1F1F',
// //           }}>
// //             基本考勤規則
// //           </span>
// //         </div>

// //         {/* 🔥 基本考勤規則內容 - 緊跟在基本考勤規則按鈕後面 */}
// //         {showBasicRules && (
// //           <div style={{
// //             display: 'flex',
// //             flexDirection: 'column',
// //             gap: '20px',
// //             width: '100%',
// //             padding: '20px',
// //             background: '#F9F9F9',
// //             borderRadius: '10px',
// //             border: '1px solid #E9E9E9'
// //           }}>
// //             {/* 這裡可以放基本考勤規則的內容 */}
// //             <p>基本考勤規則內容（小卡）</p>
// //           </div>
// //         )}

// //         {/* 🔥 加班規則按鈕 - 移到這裡 */}
// //         <div 
// //           style={{
// //             boxSizing: 'border-box',
// //             display: 'flex',
// //             flexDirection: 'row',
// //             alignItems: 'center',
// //             justifyContent: 'space-between',
// //             padding: '25px 26px',
// //             width: '100%',
// //             height: '70px',
// //             background: '#FFFFFF',
// //             border: '1px solid #E9E9E9',
// //             borderRadius: '10px',
// //             cursor: 'pointer',
// //             transition: 'all 0.3s ease',
// //           }}
// //           onClick={() => setShowOvertimeRules(!showOvertimeRules)}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.background = '#F8F9FA';
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.background = '#FFFFFF';
// //           }}
// //         >
// //           <span style={{
// //             fontFamily: 'Microsoft JhengHei',
// //             fontStyle: 'normal',
// //             fontWeight: '700',
// //             fontSize: '20px',
// //             lineHeight: '27px',
// //             color: '#1F1F1F',
// //           }}>
// //             加班規則
// //           </span>
// //         </div>

// //         {/* 🔥 加班規則內容 - 緊跟在加班規則按鈕後面 */}
// //         {showOvertimeRules && (
// //           <OvertimeRules
// //             overtimeSettings={overtimeSettings}
// //             onUpdateOvertimeSettings={setOvertimeSettings}
// //           />
// //         )}
// //       </div>

// //       {/* 編輯班別彈窗 */}
// //       {editingShift && (
// //         <ClassRosterForm
// //           mode="edit"
// //           initialData={editingShift}
// //           onSave={handleUpdateShift}
// //           onCancel={() => setEditingShift(null)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default SalaryCalculator;
// import React, { useState, useEffect } from 'react';
// import { useAuth } from './Hook/useAuth'; // 🔥 引入 useAuth
// import Sidebar from './Sidebar';
// import ClassRosterForm from './Salary/ClassRosterForm';
// import FixedForm from './Salary/fixedForm';
// import OvertimeRules from './Salary/OvertimeRules';

// // 引入圖片
// import SetAttendanceIcon from './ICON/Set_attendance_parameters.png';
// import PayrollOperationsIcon from './ICON/Perform_payroll_operations.png';
// import SalaryListIcon from './ICON/Salary_list.png';

// const SalaryCalculator = () => {
//   // 🔥 使用 useAuth - 只用於 token 驗證
//   const { hasValidAuth, logout } = useAuth();

//   // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
//   useEffect(() => {
//     if (!hasValidAuth()) {
//       console.log('❌ SalaryCalculator Token 驗證失敗，重新導向登入頁面');
//       logout();
//       return;
//     }
//     console.log('✅ SalaryCalculator Token 驗證通過');
//   }, [hasValidAuth, logout]);

//   const [showShiftSettings, setShowShiftSettings] = useState(false);
//   const [showBasicRules, setShowBasicRules] = useState(false);
//   const [showOvertimeRules, setShowOvertimeRules] = useState(false);
  
//   const [basicSettings, setBasicSettings] = useState({
//     payrollDate: 5,
//     monthlyLateLimit: 0,
//     lateMinutesLimit: 0,
//     restDays: '選擇',
//     holidays: '選擇',
//     punchCardRule: 'flexible'
//   });

//   const [overtimeSettings, setOvertimeSettings] = useState({
//     workdayOvertimeStart: '18:30',
//     workdayOvertimeEnd: '21:30',
//     workdayOvertimeEnabled: true,
//     restdayOvertimeStart: '08:00',
//     restdayOvertimeEnd: '17:00',
//     restdayOvertimeEnabled: true,
//     holidayOvertimeEnabled: false,
//     workdayOvertime0to2: '1.34',
//     workdayOvertime2to4: '1.67',
//     restdayOvertime0to2: '1.34',
//     restdayOvertime2to8: '1.67',
//     restdayOvertime8to12: '2.67',
//     holidayOvertime0to8: '1',
//     holidayOvertime8to12: '2',
//     vacationOvertime0to8: '1',
//     vacationOvertime8to10: '1.34',
//     vacationOvertime10to12: '1.67',
//     overtimeCompensation: '1'
//   });

//   const [shiftSettings, setShiftSettings] = useState({
//     shiftType: 'scheduled',
//     shifts: []
//   });

//   const [editingShift, setEditingShift] = useState(null);

//   // 🔥 在需要身份驗證的操作中加入檢查
//   const addNewShift = () => {
//     // 🔥 檢查身份驗證
//     if (!hasValidAuth()) {
//       console.log('❌ 新增班別時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     const newShift = {
//       id: Date.now(),
//       name: '',
//       code: '',
//       startTime: '09:00',
//       endTime: '18:00',
//       punchStartRange: '選擇',
//       punchEndRange: '選擇',
//       breakStart: '12:00',
//       breakEnd: '13:00'
//     };
    
//     setShiftSettings(prev => ({
//       ...prev,
//       shifts: [...prev.shifts, newShift]
//     }));
//   };

//   const deleteShift = (shiftId) => {
//     // 🔥 檢查身份驗證
//     if (!hasValidAuth()) {
//       console.log('❌ 刪除班別時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     setShiftSettings(prev => ({
//       ...prev,
//       shifts: prev.shifts.filter(shift => shift.id !== shiftId)
//     }));
//   };

//   const updateShift = (shiftId, field, value) => {
//     // 🔥 檢查身份驗證
//     if (!hasValidAuth()) {
//       console.log('❌ 更新班別時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     setShiftSettings(prev => ({
//       ...prev,
//       shifts: prev.shifts.map(shift => 
//         shift.id === shiftId ? { ...shift, [field]: value } : shift
//       )
//     }));
//   };

//   const handleEditShift = (shift) => {
//     // 🔥 檢查身份驗證
//     if (!hasValidAuth()) {
//       console.log('❌ 編輯班別時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     setEditingShift({
//       shift_name: shift.name,
//       start_time: shift.startTime,
//       end_time: shift.endTime,
//       break_time_start: shift.breakStart,
//       break_time_end: shift.breakEnd,
//       repeat_frequency: shift.repeatFrequency || 'daily',
//       punch_start_range: shift.punchStartRange,
//       punch_end_range: shift.punchEndRange
//     });
//   };

//   const handleUpdateShift = (shiftData) => {
//     // 🔥 檢查身份驗證
//     if (!hasValidAuth()) {
//       console.log('❌ 更新班別資料時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     setShiftSettings(prev => ({
//       ...prev,
//       shifts: prev.shifts.map(shift => 
//         shift.name === editingShift.shift_name ? {
//           ...shift,
//           name: shiftData.shift_name,
//           code: shiftData.shift_name.charAt(0).toUpperCase(),
//           startTime: shiftData.start_time,
//           endTime: shiftData.end_time,
//           punchStartRange: shiftData.punch_start_range,
//           punchEndRange: shiftData.punch_end_range,
//           breakStart: shiftData.break_time_start,
//           breakEnd: shiftData.break_time_end,
//           repeatFrequency: shiftData.repeat_frequency
//         } : shift
//       )
//     }));
    
//     setEditingShift(null);
//     console.log('更新班別成功:', shiftData);
//   };

//   // 🔥 設定變更時也檢查身份驗證
//   const handleBasicSettingsChange = (field, value) => {
//     if (!hasValidAuth()) {
//       console.log('❌ 修改基本設定時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     setBasicSettings(prev => ({ ...prev, [field]: value }));
//   };

//   const handleOvertimeSettingsChange = (newSettings) => {
//     if (!hasValidAuth()) {
//       console.log('❌ 修改加班設定時 Token 驗證失敗');
//       logout();
//       return;
//     }

//     setOvertimeSettings(newSettings);
//   };

//   const renderShiftTypeSelection = () => (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       padding: '0px',
//       position: 'relative',
//       width: '100%',
//       height: '70px',
//       marginTop: '20px',
//       marginLeft: '0px',
//     }}>
//       {[
//         { key: 'fixed', label: '固定班制' },
//         { key: 'rotating', label: '輪班制' },
//         { key: 'scheduled', label: '排班制' }
//       ].map((type, index) => (
//         <button
//           key={type.key}
//           onClick={() => {
//             // 🔥 檢查身份驗證
//             if (!hasValidAuth()) {
//               console.log('❌ 切換班別類型時 Token 驗證失敗');
//               logout();
//               return;
//             }
//             setShiftSettings(prev => ({ ...prev, shiftType: type.key }));
//           }}
//           style={{
//             flex: 1,
//             height: '70px',
//             padding: '20px',
//             fontSize: '18px',
//             fontWeight: '500',
//             cursor: 'pointer',
//             fontFamily: 'Microsoft JhengHei',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
            
//             ...(shiftSettings.shiftType === type.key ? {
//               background: '#5B8EC8',
//               color: 'white',
//               border: 'none',
//               zIndex: 2,
//             } : {
//               background: 'white',
//               color: '#666666',
//               border: '1px solid #D0D0D0',
//               zIndex: 1,
//             }),
            
//             borderRadius: '15px',
//             borderLeft: index > 0 && shiftSettings.shiftType !== type.key ? 'none' : 
//                        (shiftSettings.shiftType === type.key ? 'none' : '1px solid #D0D0D0'),
//           }}
//           onMouseEnter={(e) => {
//             if (shiftSettings.shiftType !== type.key) {
//               e.currentTarget.style.background = '#F0F0F0';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (shiftSettings.shiftType !== type.key) {
//               e.currentTarget.style.background = 'white';
//             }
//           }}
//         >
//           {type.label}
//         </button>
//       ))}
//     </div>
//   );

//   const renderDevelopmentMessage = () => (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '20px',
//       width: '100%',
//       marginTop: '40px',
//       padding: '60px 20px',
//       background: '#F9F9F9',
//       borderRadius: '10px',
//       border: '1px solid #E9E9E9'
//     }}>
//       <div style={{
//         fontSize: '48px',
//         color: '#C0C0C0'
//       }}>
//         🚧
//       </div>
//       <h4 style={{
//         margin: '0',
//         fontSize: '24px',
//         fontWeight: '700',
//         color: '#919191',
//         fontFamily: 'Microsoft JhengHei',
//       }}>功能開發中</h4>
//       <p style={{
//         margin: '0',
//         fontSize: '16px',
//         color: '#919191',
//         fontFamily: 'Microsoft JhengHei',
//         textAlign: 'center',
//         lineHeight: '1.5'
//       }}>
//         此功能正在開發中，敬請期待
//       </p>
//     </div>
//   );

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       padding: '0px',
//       gap: '0px',
//       width: '100vw',
//       minHeight: '100vh',
//       background: '#F8F8F8',
//       fontFamily: 'Microsoft JhengHei, Arial, sans-serif',
//     }}>
//       {/* 側邊欄區域 */}
//       <div style={{
//         width: '300px',
//         minHeight: '100vh',
//         flexShrink: 0,
//       }}>
//         <Sidebar currentPage="salary" />
//       </div>

//       {/* 子功能表 */}
//       <div style={{
//         boxSizing: 'border-box',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         padding: '0px 0px 50px 0px',
//         gap: '10px',
//         width: '250px',
//         minHeight: '100vh',
//         background: 'rgba(255, 255, 255, 0.2)',
//         borderRight: '1px solid #E9E9E9',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           padding: '100px 0px 0px 0px',
//           gap: '10px',
//           width: '100%',
//         }}>
//           {/* 設定考勤參數 */}
//           <div style={{
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             padding: '18px 20px',
//             gap: '15px',
//             width: 'calc(100% - 20px)',
//             height: '86px',
//             background: '#FFFFFF',
//             border: '2px solid rgba(58, 108, 166, 0.2)',
//             borderRadius: '10px 0px 0px 10px',
//             marginLeft: '10px',
//           }}>
//             <img 
//               src={SetAttendanceIcon}
//               alt="設定考勤參數"
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 flexShrink: 0,
//                 objectFit: 'contain'
//               }}
//             />
            
//             <div style={{
//               fontFamily: 'Microsoft JhengHei UI',
//               fontStyle: 'normal',
//               fontWeight: '700',
//               fontSize: '16px',
//               lineHeight: '20px',
//               color: '#616161',
//               flex: 1,
//             }}>
//               設定考勤參數
//             </div>
//           </div>

//           {/* 執行薪資作業 */}
//           <div style={{
//             boxSizing: 'border-box',
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             padding: '18px 20px',
//             gap: '15px',
//             width: 'calc(100% - 20px)',
//             height: '86px',
//             border: '1px solid rgba(248, 248, 248, 0.5)',
//             borderRadius: '10px 0px 0px 10px',
//             marginLeft: '10px',
//           }}>
//             <img 
//               src={PayrollOperationsIcon}
//               alt="執行薪資作業"
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 flexShrink: 0,
//                 objectFit: 'contain',
//                 opacity: 0.5
//               }}
//             />
            
//             <div style={{
//               fontFamily: 'Microsoft JhengHei UI',
//               fontStyle: 'normal',
//               fontWeight: '400',
//               fontSize: '16px',
//               lineHeight: '20px',
//               color: 'rgba(97, 97, 97, 0.5)',
//               flex: 1,
//             }}>
//               執行薪資作業
//             </div>
//           </div>

//           {/* 薪資清冊 */}
//           <div style={{
//             boxSizing: 'border-box',
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             padding: '18px 20px',
//             gap: '15px',
//             width: 'calc(100% - 20px)',
//             height: '86px',
//             borderRadius: '10px 0px 0px 10px',
//             marginLeft: '10px',
//           }}>
//             <img 
//               src={SalaryListIcon}
//               alt="薪資清冊"
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 flexShrink: 0,
//                 objectFit: 'contain',
//                 opacity: 0.5
//               }}
//             />
            
//             <div style={{
//               fontFamily: 'Microsoft JhengHei UI',
//               fontStyle: 'normal',
//               fontWeight: '400',
//               fontSize: '16px',
//               lineHeight: '20px',
//               color: 'rgba(97, 97, 97, 0.5)',
//               flex: 1,
//             }}>
//               薪資清冊
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 主內容區 */}
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'flex-start',
//         padding: '35px 40px 50px 40px',
//         gap: '30px',
//         flex: 1,
//         minHeight: 'calc(100vh - 30px)',
//         maxHeight: 'calc(100vh - 30px)',
//         background: '#FFFFFF',
//         margin: '15px 15px 15px 0px',
//         borderRadius: '10px',
//         overflowY: 'auto',
//         overflowX: 'hidden',
//       }}>
//         {/* 基本參數設定標題 */}
//         <h2 style={{
//           fontFamily: 'Microsoft JhengHei',
//           fontStyle: 'normal',
//           fontWeight: '400',
//           fontSize: '26px',
//           lineHeight: '35px',
//           letterSpacing: '0.01em',
//           color: '#919191',
//           margin: '0',
//           flexShrink: 0,
//         }}>
//           基本參數設定
//         </h2>

//         {/* 基本參數設定區域 */}
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '20px',
//           width: '100%',
//           flexShrink: 0,
//         }}>
//           {/* 設定發薪日 */}
//           <div style={{
//             boxSizing: 'border-box',
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '25px 26px',
//             width: '100%',
//             height: '70px',
//             background: '#FFFFFF',
//             border: '1px solid #E9E9E9',
//             borderRadius: '10px',
//           }}>
//             <span style={{
//               fontFamily: 'Microsoft JhengHei',
//               fontStyle: 'normal',
//               fontWeight: '700',
//               fontSize: '20px',
//               lineHeight: '27px',
//               color: '#1F1F1F',
//             }}>
//               設定發薪日
//             </span>
            
//             <div style={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: '10px' 
//             }}>
//               <span style={{ 
//                 fontSize: '16px', 
//                 color: '#666',
//                 fontFamily: 'Microsoft JhengHei'
//               }}>
//                 每月
//               </span>
//               <input
//                 type="number"
//                 value={basicSettings.payrollDate}
//                 onChange={(e) => handleBasicSettingsChange('payrollDate', e.target.value)}
//                 style={{
//                   width: '60px',
//                   height: '40px',
//                   border: '1px solid #C4D4E8',
//                   borderRadius: '8px',
//                   padding: '8px 10px',
//                   fontSize: '16px',
//                   textAlign: 'center',
//                   fontFamily: 'Microsoft JhengHei'
//                 }}
//               />
//               <span style={{ 
//                 fontSize: '16px', 
//                 color: '#666',
//                 fontFamily: 'Microsoft JhengHei'
//               }}>
//                 日
//               </span>
//             </div>
//           </div>

//           {/* 班別按鈕 */}
//           <div 
//             style={{
//               boxSizing: 'border-box',
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '25px 26px',
//               width: '100%',
//               height: '70px',
//               background: '#FFFFFF',
//               border: '1px solid #E9E9E9',
//               borderRadius: '10px',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//             }}
//             onClick={() => {
//               // 🔥 檢查身份驗證
//               if (!hasValidAuth()) {
//                 console.log('❌ 展開班別設定時 Token 驗證失敗');
//                 logout();
//                 return;
//               }
//               setShowShiftSettings(!showShiftSettings);
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = '#F8F9FA';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = '#FFFFFF';
//             }}
//           >
//             <span style={{
//               fontFamily: 'Microsoft JhengHei',
//               fontStyle: 'normal',
//               fontWeight: '700',
//               fontSize: '20px',
//               lineHeight: '27px',
//               color: '#1F1F1F',
//             }}>
//               班別
//             </span>
//           </div>
//         </div>

//         {/* 🔥 班別制度選擇區域 - 緊跟在班別按鈕後面 */}
//         {showShiftSettings && renderShiftTypeSelection()}

//         {/* 🔥 班別設定內容 - 緊跟在班別制度選擇後面 */}
//         {showShiftSettings && (
//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '0px',
//             width: '100%'
//           }}>
//             {shiftSettings.shiftType === 'fixed' ? (
//               <FixedForm
//                 shifts={shiftSettings.shifts}
//                 basicSettings={basicSettings}
//                 onUpdateShift={updateShift}
//                 onEditShift={handleEditShift}
//                 onDeleteShift={deleteShift}
//                 onAddShift={addNewShift}
//                 onUpdateBasicSettings={handleBasicSettingsChange}
//               />
//             ) : (shiftSettings.shiftType === 'scheduled' || shiftSettings.shiftType === 'rotating') ? (
//               <ClassRosterForm
//                 shifts={shiftSettings.shifts}
//                 basicSettings={basicSettings}
//                 onUpdateShift={updateShift}
//                 onEditShift={handleEditShift}
//                 onDeleteShift={deleteShift}
//                 onAddShift={addNewShift}
//                 onUpdateBasicSettings={handleBasicSettingsChange}
//               />
//             ) : (
//               renderDevelopmentMessage()
//             )}
//           </div>
//         )}

//         {/* 🔥 基本考勤規則按鈕 - 移到這裡 */}
//         <div 
//           style={{
//             boxSizing: 'border-box',
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '25px 26px',
//             width: '100%',
//             height: '70px',
//             background: '#FFFFFF',
//             border: '1px solid #E9E9E9',
//             borderRadius: '10px',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//           }}
//           onClick={() => {
//             // 🔥 檢查身份驗證
//             if (!hasValidAuth()) {
//               console.log('❌ 展開基本考勤規則時 Token 驗證失敗');
//               logout();
//               return;
//             }
//             setShowBasicRules(!showBasicRules);
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = '#F8F9FA';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = '#FFFFFF';
//           }}
//         >
//           <span style={{
//             fontFamily: 'Microsoft JhengHei',
//             fontStyle: 'normal',
//             fontWeight: '700',
//             fontSize: '20px',
//             lineHeight: '27px',
//             color: '#1F1F1F',
//           }}>
//             基本考勤規則
//           </span>
//         </div>

//         {/* 🔥 基本考勤規則內容 - 緊跟在基本考勤規則按鈕後面 */}
//         {showBasicRules && (
//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '20px',
//             width: '100%',
//             padding: '20px',
//             background: '#F9F9F9',
//             borderRadius: '10px',
//             border: '1px solid #E9E9E9'
//           }}>
//             {/* 這裡可以放基本考勤規則的內容 */}
//             <p>基本考勤規則內容（小卡）</p>
//           </div>
//         )}

//         {/* 🔥 加班規則按鈕 - 移到這裡 */}
//         <div 
//           style={{
//             boxSizing: 'border-box',
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '25px 26px',
//             width: '100%',
//             height: '70px',
//             background: '#FFFFFF',
//             border: '1px solid #E9E9E9',
//             borderRadius: '10px',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//           }}
//           onClick={() => {
//             // 🔥 檢查身份驗證
//             if (!hasValidAuth()) {
//               console.log('❌ 展開加班規則時 Token 驗證失敗');
//               logout();
//               return;
//             }
//             setShowOvertimeRules(!showOvertimeRules);
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = '#F8F9FA';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = '#FFFFFF';
//           }}
//         >
//           <span style={{
//             fontFamily: 'Microsoft JhengHei',
//             fontStyle: 'normal',
//             fontWeight: '700',
//             fontSize: '20px',
//             lineHeight: '27px',
//             color: '#1F1F1F',
//           }}>
//             加班規則
//           </span>
//         </div>

//         {/* 🔥 加班規則內容 - 緊跟在加班規則按鈕後面 */}
//         {showOvertimeRules && (
//           <OvertimeRules
//             overtimeSettings={overtimeSettings}
//             onUpdateOvertimeSettings={handleOvertimeSettingsChange}
//           />
//         )}
//       </div>

//       {/* 編輯班別彈窗 */}
//       {editingShift && (
//         <ClassRosterForm
//           mode="edit"
//           initialData={editingShift}
//           onSave={handleUpdateShift}
//           onCancel={() => setEditingShift(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default SalaryCalculator;
import React, { useState, useEffect } from 'react';
import { useAuth } from './Hook/useAuth'; // 🔥 引入 useAuth
// 🔥 引入 API_BASE_URL 配置
import { API_BASE_URL } from '../config';
import Sidebar from './Sidebar';
import ClassRosterForm from './Salary/ClassRosterForm';
import FixedForm from './Salary/fixedForm';
import OvertimeRules from './Salary/OvertimeRules';

// 引入圖片
import SetAttendanceIcon from './ICON/Set_attendance_parameters.png';
import PayrollOperationsIcon from './ICON/Perform_payroll_operations.png';
import SalaryListIcon from './ICON/Salary_list.png';

const SalaryCalculator = () => {
  // 🔥 使用 useAuth - 只用於 token 驗證
  const { hasValidAuth, logout } = useAuth();

  // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ SalaryCalculator Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    console.log('✅ SalaryCalculator Token 驗證通過');
  }, [hasValidAuth, logout]);

  const [showShiftSettings, setShowShiftSettings] = useState(false);
  const [showBasicRules, setShowBasicRules] = useState(false);
  const [showOvertimeRules, setShowOvertimeRules] = useState(false);
  
  const [basicSettings, setBasicSettings] = useState({
    payrollDate: 5,
    monthlyLateLimit: 0,
    lateMinutesLimit: 0,
    restDays: '選擇',
    holidays: '選擇',
    punchCardRule: 'flexible'
  });

  const [overtimeSettings, setOvertimeSettings] = useState({
    workdayOvertimeStart: '18:30',
    workdayOvertimeEnd: '21:30',
    workdayOvertimeEnabled: true,
    restdayOvertimeStart: '08:00',
    restdayOvertimeEnd: '17:00',
    restdayOvertimeEnabled: true,
    holidayOvertimeEnabled: false,
    workdayOvertime0to2: '1.34',
    workdayOvertime2to4: '1.67',
    restdayOvertime0to2: '1.34',
    restdayOvertime2to8: '1.67',
    restdayOvertime8to12: '2.67',
    holidayOvertime0to8: '1',
    holidayOvertime8to12: '2',
    vacationOvertime0to8: '1',
    vacationOvertime8to10: '1.34',
    vacationOvertime10to12: '1.67',
    overtimeCompensation: '1'
  });

  const [shiftSettings, setShiftSettings] = useState({
    shiftType: 'scheduled',
    shifts: []
  });

  const [editingShift, setEditingShift] = useState(null);

  // 🔥 在需要身份驗證的操作中加入檢查
  const addNewShift = () => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 新增班別時 Token 驗證失敗');
      logout();
      return;
    }

    const newShift = {
      id: Date.now(),
      name: '',
      code: '',
      startTime: '09:00',
      endTime: '18:00',
      punchStartRange: '選擇',
      punchEndRange: '選擇',
      breakStart: '12:00',
      breakEnd: '13:00'
    };
    
    setShiftSettings(prev => ({
      ...prev,
      shifts: [...prev.shifts, newShift]
    }));
  };

  const deleteShift = (shiftId) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 刪除班別時 Token 驗證失敗');
      logout();
      return;
    }

    setShiftSettings(prev => ({
      ...prev,
      shifts: prev.shifts.filter(shift => shift.id !== shiftId)
    }));
  };

  const updateShift = (shiftId, field, value) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 更新班別時 Token 驗證失敗');
      logout();
      return;
    }

    setShiftSettings(prev => ({
      ...prev,
      shifts: prev.shifts.map(shift => 
        shift.id === shiftId ? { ...shift, [field]: value } : shift
      )
    }));
  };

  const handleEditShift = (shift) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 編輯班別時 Token 驗證失敗');
      logout();
      return;
    }

    setEditingShift({
      shift_name: shift.name,
      start_time: shift.startTime,
      end_time: shift.endTime,
      break_time_start: shift.breakStart,
      break_time_end: shift.breakEnd,
      repeat_frequency: shift.repeatFrequency || 'daily',
      punch_start_range: shift.punchStartRange,
      punch_end_range: shift.punchEndRange
    });
  };

  const handleUpdateShift = (shiftData) => {
    // 🔥 檢查身份驗證
    if (!hasValidAuth()) {
      console.log('❌ 更新班別資料時 Token 驗證失敗');
      logout();
      return;
    }

    setShiftSettings(prev => ({
      ...prev,
      shifts: prev.shifts.map(shift => 
        shift.name === editingShift.shift_name ? {
          ...shift,
          name: shiftData.shift_name,
          code: shiftData.shift_name.charAt(0).toUpperCase(),
          startTime: shiftData.start_time,
          endTime: shiftData.end_time,
          punchStartRange: shiftData.punch_start_range,
          punchEndRange: shiftData.punch_end_range,
          breakStart: shiftData.break_time_start,
          breakEnd: shiftData.break_time_end,
          repeatFrequency: shiftData.repeat_frequency
        } : shift
      )
    }));
    
    setEditingShift(null);
    console.log('更新班別成功:', shiftData);
  };

  // 🔥 設定變更時也檢查身份驗證
  const handleBasicSettingsChange = (field, value) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改基本設定時 Token 驗證失敗');
      logout();
      return;
    }

    setBasicSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleOvertimeSettingsChange = (newSettings) => {
    if (!hasValidAuth()) {
      console.log('❌ 修改加班設定時 Token 驗證失敗');
      logout();
      return;
    }

    setOvertimeSettings(newSettings);
  };

  const renderShiftTypeSelection = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '0px',
      position: 'relative',
      width: '100%',
      height: '70px',
      marginTop: '20px',
      marginLeft: '0px',
    }}>
      {[
        { key: 'fixed', label: '固定班制' },
        { key: 'rotating', label: '輪班制' },
        { key: 'scheduled', label: '排班制' }
      ].map((type, index) => (
        <button
          key={type.key}
          onClick={() => {
            // 🔥 檢查身份驗證
            if (!hasValidAuth()) {
              console.log('❌ 切換班別類型時 Token 驗證失敗');
              logout();
              return;
            }
            setShiftSettings(prev => ({ ...prev, shiftType: type.key }));
          }}
          style={{
            flex: 1,
            height: '70px',
            padding: '20px',
            fontSize: '18px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'Microsoft JhengHei',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            ...(shiftSettings.shiftType === type.key ? {
              background: '#5B8EC8',
              color: 'white',
              border: 'none',
              zIndex: 2,
            } : {
              background: 'white',
              color: '#666666',
              border: '1px solid #D0D0D0',
              zIndex: 1,
            }),
            
            borderRadius: '15px',
            borderLeft: index > 0 && shiftSettings.shiftType !== type.key ? 'none' : 
                       (shiftSettings.shiftType === type.key ? 'none' : '1px solid #D0D0D0'),
          }}
          onMouseEnter={(e) => {
            if (shiftSettings.shiftType !== type.key) {
              e.currentTarget.style.background = '#F0F0F0';
            }
          }}
          onMouseLeave={(e) => {
            if (shiftSettings.shiftType !== type.key) {
              e.currentTarget.style.background = 'white';
            }
          }}
        >
          {type.label}
        </button>
      ))}
    </div>
  );

  const renderDevelopmentMessage = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      width: '100%',
      marginTop: '40px',
      padding: '60px 20px',
      background: '#F9F9F9',
      borderRadius: '10px',
      border: '1px solid #E9E9E9'
    }}>
      <div style={{
        fontSize: '48px',
        color: '#C0C0C0'
      }}>
        🚧
      </div>
      <h4 style={{
        margin: '0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#919191',
        fontFamily: 'Microsoft JhengHei',
      }}>功能開發中</h4>
      <p style={{
        margin: '0',
        fontSize: '16px',
        color: '#919191',
        fontFamily: 'Microsoft JhengHei',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        此功能正在開發中，敬請期待
      </p>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '0px',
      width: '100vw',
      minHeight: '100vh',
      background: '#F8F8F8',
      fontFamily: 'Microsoft JhengHei, Arial, sans-serif',
    }}>
      {/* 側邊欄區域 */}
      <div style={{
        width: '300px',
        minHeight: '100vh',
        flexShrink: 0,
      }}>
        <Sidebar currentPage="salary" />
      </div>

      {/* 子功能表 */}
      <div style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '0px 0px 50px 0px',
        gap: '10px',
        width: '250px',
        minHeight: '100vh',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRight: '1px solid #E9E9E9',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '100px 0px 0px 0px',
          gap: '10px',
          width: '100%',
        }}>
          {/* 設定考勤參數 */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '18px 20px',
            gap: '15px',
            width: 'calc(100% - 20px)',
            height: '86px',
            background: '#FFFFFF',
            border: '2px solid rgba(58, 108, 166, 0.2)',
            borderRadius: '10px 0px 0px 10px',
            marginLeft: '10px',
          }}>
            <img 
              src={SetAttendanceIcon}
              alt="設定考勤參數"
              style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                objectFit: 'contain'
              }}
            />
            
            <div style={{
              fontFamily: 'Microsoft JhengHei UI',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '16px',
              lineHeight: '20px',
              color: '#616161',
              flex: 1,
            }}>
              設定考勤參數
            </div>
          </div>

          {/* 執行薪資作業 */}
          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '18px 20px',
            gap: '15px',
            width: 'calc(100% - 20px)',
            height: '86px',
            border: '1px solid rgba(248, 248, 248, 0.5)',
            borderRadius: '10px 0px 0px 10px',
            marginLeft: '10px',
          }}>
            <img 
              src={PayrollOperationsIcon}
              alt="執行薪資作業"
              style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                objectFit: 'contain',
                opacity: 0.5
              }}
            />
            
            <div style={{
              fontFamily: 'Microsoft JhengHei UI',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '20px',
              color: 'rgba(97, 97, 97, 0.5)',
              flex: 1,
            }}>
              執行薪資作業
            </div>
          </div>

          {/* 薪資清冊 */}
          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '18px 20px',
            gap: '15px',
            width: 'calc(100% - 20px)',
            height: '86px',
            borderRadius: '10px 0px 0px 10px',
            marginLeft: '10px',
          }}>
            <img 
              src={SalaryListIcon}
              alt="薪資清冊"
              style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                objectFit: 'contain',
                opacity: 0.5
              }}
            />
            
            <div style={{
              fontFamily: 'Microsoft JhengHei UI',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '20px',
              color: 'rgba(97, 97, 97, 0.5)',
              flex: 1,
            }}>
              薪資清冊
            </div>
          </div>
        </div>
      </div>

      {/* 主內容區 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '35px 40px 50px 40px',
        gap: '30px',
        flex: 1,
        minHeight: 'calc(100vh - 30px)',
        maxHeight: 'calc(100vh - 30px)',
        background: '#FFFFFF',
        margin: '15px 15px 15px 0px',
        borderRadius: '10px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* 基本參數設定標題 */}
        <h2 style={{
          fontFamily: 'Microsoft JhengHei',
          fontStyle: 'normal',
          fontWeight: '400',
          fontSize: '26px',
          lineHeight: '35px',
          letterSpacing: '0.01em',
          color: '#919191',
          margin: '0',
          flexShrink: 0,
        }}>
          基本參數設定
        </h2>

        {/* 基本參數設定區域 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          flexShrink: 0,
        }}>
          {/* 設定發薪日 */}
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
          }}>
            <span style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '27px',
              color: '#1F1F1F',
            }}>
              設定發薪日
            </span>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <span style={{ 
                fontSize: '16px', 
                color: '#666',
                fontFamily: 'Microsoft JhengHei'
              }}>
                每月
              </span>
              <input
                type="number"
                value={basicSettings.payrollDate}
                onChange={(e) => handleBasicSettingsChange('payrollDate', e.target.value)}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '1px solid #C4D4E8',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '16px',
                  textAlign: 'center',
                  fontFamily: 'Microsoft JhengHei'
                }}
              />
              <span style={{ 
                fontSize: '16px', 
                color: '#666',
                fontFamily: 'Microsoft JhengHei'
              }}>
                日
              </span>
            </div>
          </div>

          {/* 班別按鈕 */}
          <div 
            style={{
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
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => {
              // 🔥 檢查身份驗證
              if (!hasValidAuth()) {
                console.log('❌ 展開班別設定時 Token 驗證失敗');
                logout();
                return;
              }
              setShowShiftSettings(!showShiftSettings);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8F9FA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
            }}
          >
            <span style={{
              fontFamily: 'Microsoft JhengHei',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '27px',
              color: '#1F1F1F',
            }}>
              班別
            </span>
          </div>
        </div>

        {/* 🔥 班別制度選擇區域 - 緊跟在班別按鈕後面 */}
        {showShiftSettings && renderShiftTypeSelection()}

        {/* 🔥 班別設定內容 - 緊跟在班別制度選擇後面 */}
        {showShiftSettings && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            width: '100%'
          }}>
            {shiftSettings.shiftType === 'fixed' ? (
              <FixedForm
                shifts={shiftSettings.shifts}
                basicSettings={basicSettings}
                onUpdateShift={updateShift}
                onEditShift={handleEditShift}
                onDeleteShift={deleteShift}
                onAddShift={addNewShift}
                onUpdateBasicSettings={handleBasicSettingsChange}
              />
            ) : (shiftSettings.shiftType === 'scheduled' || shiftSettings.shiftType === 'rotating') ? (
              <ClassRosterForm
                shifts={shiftSettings.shifts}
                basicSettings={basicSettings}
                onUpdateShift={updateShift}
                onEditShift={handleEditShift}
                onDeleteShift={deleteShift}
                onAddShift={addNewShift}
                onUpdateBasicSettings={handleBasicSettingsChange}
              />
            ) : (
              renderDevelopmentMessage()
            )}
          </div>
        )}

        {/* 🔥 基本考勤規則按鈕 - 移到這裡 */}
        <div 
          style={{
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
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => {
            // 🔥 檢查身份驗證
            if (!hasValidAuth()) {
              console.log('❌ 展開基本考勤規則時 Token 驗證失敗');
              logout();
              return;
            }
            setShowBasicRules(!showBasicRules);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F8F9FA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          <span style={{
            fontFamily: 'Microsoft JhengHei',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '20px',
            lineHeight: '27px',
            color: '#1F1F1F',
          }}>
            基本考勤規則
          </span>
        </div>

        {/* 🔥 基本考勤規則內容 - 緊跟在基本考勤規則按鈕後面 */}
        {showBasicRules && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
            padding: '20px',
            background: '#F9F9F9',
            borderRadius: '10px',
            border: '1px solid #E9E9E9'
          }}>
            {/* 這裡可以放基本考勤規則的內容 */}
            <p>基本考勤規則內容（小卡）</p>
          </div>
        )}

        {/* 🔥 加班規則按鈕 - 移到這裡 */}
        <div 
          style={{
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
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => {
            // 🔥 檢查身份驗證
            if (!hasValidAuth()) {
              console.log('❌ 展開加班規則時 Token 驗證失敗');
              logout();
              return;
            }
            setShowOvertimeRules(!showOvertimeRules);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F8F9FA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          <span style={{
            fontFamily: 'Microsoft JhengHei',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '20px',
            lineHeight: '27px',
            color: '#1F1F1F',
          }}>
            加班規則
          </span>
        </div>

        {/* 🔥 加班規則內容 - 緊跟在加班規則按鈕後面 */}
        {showOvertimeRules && (
          <OvertimeRules
            overtimeSettings={overtimeSettings}
            onUpdateOvertimeSettings={handleOvertimeSettingsChange}
          />
        )}
      </div>

      {/* 編輯班別彈窗 */}
      {editingShift && (
        <ClassRosterForm
          mode="edit"
          initialData={editingShift}
          onSave={handleUpdateShift}
          onCancel={() => setEditingShift(null)}
        />
      )}
    </div>
  );
};

export default SalaryCalculator;
