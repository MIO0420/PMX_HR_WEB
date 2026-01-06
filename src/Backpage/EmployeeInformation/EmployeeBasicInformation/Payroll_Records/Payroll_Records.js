// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './Payroll_Records.css';

// const PayrollRecords = ({ employee }) => {
//   // 狀態管理
//   const [payrollRecords, setPayrollRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [error, setError] = useState('');
//   const [salaryType, setSalaryType] = useState('不限');
//   const [showDetails, setShowDetails] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // 用於滾動的 ref
//   const detailsRef = useRef(null);

//   // 模擬發薪紀錄資料
//   useEffect(() => {
//     const loadPayrollData = async () => {
//       try {
//         setIsLoading(true);
//         // 模擬 API 調用延遲
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         const mockPayrollRecords = [
//           {
//             id: 1,
//             date: '8',
//             month: '一',
//             title: '薪資單',
//             baseSalary: 35000,
//             additions: 1000,
//             totalAfterAdditions: 36000,
//             deductions: 1000,
//             netPay: 35000,
//             details: {
//               baseSalary: { name: '本薪', amount: 35000 },
//               additions: [
//                 { name: '全勤獎金', amount: 1000, note: '(自動計算)' }
//               ],
//               deductions: [
//                 { name: '勞保自負額', amount: 500, note: '(自動計算)' },
//                 { name: '健保自負額', amount: 300, note: '(自動計算)' },
//                 { name: '勞工退休金提繳', amount: 200, note: '(自動計算)' }
//               ]
//             }
//           },
//           {
//             id: 2,
//             date: '8',
//             month: '二',
//             title: '薪資單',
//             baseSalary: 35000,
//             additions: 1500,
//             totalAfterAdditions: 36500,
//             deductions: 1200,
//             netPay: 35300,
//             details: {
//               baseSalary: { name: '本薪', amount: 35000 },
//               additions: [
//                 { name: '全勤獎金', amount: 1000, note: '(自動計算)' },
//                 { name: '績效獎金', amount: 500, note: '(手動輸入)' }
//               ],
//               deductions: [
//                 { name: '勞保自負額', amount: 500, note: '(自動計算)' },
//                 { name: '健保自負額', amount: 300, note: '(自動計算)' },
//                 { name: '勞工退休金提繳', amount: 200, note: '(自動計算)' },
//                 { name: '遲到扣款', amount: 200, note: '(手動輸入)' }
//               ]
//             }
//           },
//           {
//             id: 3,
//             date: '8',
//             month: '三',
//             title: '薪資單',
//             baseSalary: 35000,
//             additions: 2000,
//             totalAfterAdditions: 37000,
//             deductions: 1000,
//             netPay: 36000,
//             details: {
//               baseSalary: { name: '本薪', amount: 35000 },
//               additions: [
//                 { name: '全勤獎金', amount: 1000, note: '(自動計算)' },
//                 { name: '加班費', amount: 1000, note: '(自動計算)' }
//               ],
//               deductions: [
//                 { name: '勞保自負額', amount: 500, note: '(自動計算)' },
//                 { name: '健保自負額', amount: 300, note: '(自動計算)' },
//                 { name: '勞工退休金提繳', amount: 200, note: '(自動計算)' }
//               ]
//             }
//           },
//           {
//             id: 4,
//             date: '8',
//             month: '四',
//             title: '薪資單',
//             baseSalary: 35000,
//             additions: 800,
//             totalAfterAdditions: 35800,
//             deductions: 1000,
//             netPay: 34800,
//             details: {
//               baseSalary: { name: '本薪', amount: 35000 },
//               additions: [
//                 { name: '全勤獎金', amount: 800, note: '(自動計算)' }
//               ],
//               deductions: [
//                 { name: '勞保自負額', amount: 500, note: '(自動計算)' },
//                 { name: '健保自負額', amount: 300, note: '(自動計算)' },
//                 { name: '勞工退休金提繳', amount: 200, note: '(自動計算)' }
//               ]
//             }
//           },
//           {
//             id: 5,
//             date: '8',
//             month: '五',
//             title: '薪資單',
//             baseSalary: 35000,
//             additions: 1200,
//             totalAfterAdditions: 36200,
//             deductions: 1000,
//             netPay: 35200,
//             details: {
//               baseSalary: { name: '本薪', amount: 35000 },
//               additions: [
//                 { name: '全勤獎金', amount: 1000, note: '(自動計算)' },
//                 { name: '交通津貼', amount: 200, note: '(固定津貼)' }
//               ],
//               deductions: [
//                 { name: '勞保自負額', amount: 500, note: '(自動計算)' },
//                 { name: '健保自負額', amount: 300, note: '(自動計算)' },
//                 { name: '勞工退休金提繳', amount: 200, note: '(自動計算)' }
//               ]
//             }
//           },
//           {
//             id: 6,
//             date: '8',
//             month: '六',
//             title: '薪資單',
//             baseSalary: 35000,
//             additions: 0,
//             totalAfterAdditions: 35000,
//             deductions: 1500,
//             netPay: 33500,
//             details: {
//               baseSalary: { name: '本薪', amount: 35000 },
//               additions: [],
//               deductions: [
//                 { name: '勞保自負額', amount: 500, note: '(自動計算)' },
//                 { name: '健保自負額', amount: 300, note: '(自動計算)' },
//                 { name: '勞工退休金提繳', amount: 200, note: '(自動計算)' },
//                 { name: '請假扣款', amount: 500, note: '(手動輸入)' }
//               ]
//             }
//           }
//         ];

//         setPayrollRecords(mockPayrollRecords);
//       } catch (err) {
//         setError('載入薪資紀錄失敗，請稍後再試');
//         console.error('載入薪資紀錄錯誤:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadPayrollData();
//   }, [employee]);

//   // 格式化金額
//   const formatAmount = useCallback((amount) => {
//     return new Intl.NumberFormat('zh-TW').format(amount || 0);
//   }, []);

//   // 處理薪資單點擊
//   const handleRecordClick = useCallback(async (record) => {
//     if (!record || !record.id) {
//       console.error('無效的薪資紀錄資料');
//       return;
//     }

//     try {
//       // 如果點擊的是已展開的記錄，則收合
//       if (selectedRecord && selectedRecord.id === record.id) {
//         setSelectedRecord(null);
//         setShowDetails(false);
//         return;
//       }

//       // 設置載入狀態
//       setDetailsLoading(true);
      
//       // 模擬 API 調用獲取詳細資料
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       // 設置新的選中記錄
//       setSelectedRecord(record);
//       setShowDetails(true);
      
//       // 展開後滾動到詳情區域
//       setTimeout(() => {
//         const detailsElement = document.querySelector(`[data-record-id="${record.id}"] .payroll-details`);
//         if (detailsElement) {
//           detailsElement.scrollIntoView({ 
//             behavior: 'smooth', 
//             block: 'nearest',
//             inline: 'nearest'
//           });
//         }
//       }, 100);

//     } catch (err) {
//       console.error('載入薪資詳情錯誤:', err);
//       setError('載入薪資詳情失敗，請稍後再試');
//     } finally {
//       setDetailsLoading(false);
//     }
//   }, [selectedRecord]);

//   // 處理鍵盤事件
//   const handleKeyPress = useCallback((event, record) => {
//     if (event.key === 'Enter' || event.key === ' ') {
//       event.preventDefault();
//       handleRecordClick(record);
//     }
//   }, [handleRecordClick]);

//   // 處理薪資類型選擇
//   const handleSalaryTypeChange = useCallback((type) => {
//     setSalaryType(type);
//     // 可以在這裡添加篩選邏輯
//   }, []);

//   // 計算總加項金額
//   const calculateTotalAdditions = useCallback((additions) => {
//     return additions.reduce((total, item) => total + (item.amount || 0), 0);
//   }, []);

//   // 計算總減項金額
//   const calculateTotalDeductions = useCallback((deductions) => {
//     return deductions.reduce((total, item) => total + (item.amount || 0), 0);
//   }, []);

//   // 載入狀態
//   if (isLoading) {
//     return (
//       <div className="payroll-records-loading">
//         <div className="loading-spinner"></div>
//         <p>載入薪資紀錄中...</p>
//       </div>
//     );
//   }

//   // 錯誤狀態
//   if (error) {
//     return (
//       <div className="payroll-records-error">
//         <p>載入失敗：{error}</p>
//         <button 
//           className="retry-button"
//           onClick={() => {
//             setError('');
//             setIsLoading(true);
//             // 重新載入資料
//             window.location.reload();
//           }}
//         >
//           重試
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="payroll-records-container">
      
//       {/* 左側查詢區域 */}
//       <div className="payroll-query-section">
//         <div className="query-controls">
//           <div className="query-group">
//             <div className="query-label">薪資類型</div>
//             <div className="salary-type-selector">
//               <div 
//                 className={`salary-type-option ${salaryType === '不限' ? 'active' : ''}`}
//                 onClick={() => handleSalaryTypeChange('不限')}
//                 role="button"
//                 tabIndex={0}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault();
//                     handleSalaryTypeChange('不限');
//                   }
//                 }}
//               >
//                 不限
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 右側內容區域 */}
//       <div className="payroll-content-section">
        
//         {/* 表頭 */}
//         <div className="payroll-header">
//           <div className="header-row">
//             <div className="header-left">
//               <div className="header-group">
//                 <span className="header-item">本薪</span>
//                 <span className="header-item">加項</span>
//               </div>
//               <span className="header-item">加後總額</span>
//             </div>
//             <div className="header-right">
//               <span className="header-item">減項</span>
//               <div className="header-group-right">
//                 <span className="header-item">實發金額</span>
//                 <span className="header-item">詳情</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 薪資紀錄列表 */}
//         <div className="payroll-records-list">
//           {payrollRecords.length === 0 ? (
//             <div className="no-records">
//               <p>暫無薪資紀錄</p>
//             </div>
//           ) : (
//             payrollRecords.map((record) => (
//               <div key={record.id} className="payroll-record-item" data-record-id={record.id}>
                
//                 {/* 薪資單卡片 */}
//                 <div 
//                   className={`payroll-record-card ${selectedRecord?.id === record.id ? 'expanded' : ''} ${detailsLoading && selectedRecord?.id === record.id ? 'loading' : ''}`}
//                   onClick={() => handleRecordClick(record)}
//                   onKeyPress={(e) => handleKeyPress(e, record)}
//                   tabIndex={0}
//                   role="button"
//                   aria-expanded={selectedRecord?.id === record.id}
//                   aria-label={`${record.title} - ${record.month}月${record.date}日，實發金額 ${formatAmount(record.netPay)} 元`}
//                 >
                  
//                   {/* 日曆圖示 */}
//                   <div className="calendar-icon">
//                     <div className="calendar-header"></div>
//                     <div className="calendar-body">
//                       <span className="calendar-month">{record.month}</span>
//                     </div>
//                     <div className="calendar-date">{record.date}</div>
//                   </div>

//                   {/* 薪資單標題 */}
//                   <div className="payroll-title">{record.title}</div>

//                   {/* 展開箭頭 */}
//                   <div className="expand-arrow">
//                     <svg width="30" height="30" viewBox="0 0 30 30">
//                       <path 
//                         d="M7.5 11.25L15 18.75L22.5 11.25" 
//                         stroke="#C5C5C5" 
//                         strokeWidth="2" 
//                         fill="none"
//                         style={{
//                           transform: selectedRecord?.id === record.id ? "rotate(180deg)" : "rotate(0deg)",
//                           transformOrigin: "15px 15px",
//                           transition: "transform 0.3s ease"
//                         }}
//                       />
//                     </svg>
//                   </div>

//                   {/* 載入指示器 */}
//                   {detailsLoading && selectedRecord?.id === record.id && (
//                     <div className="card-loading-indicator">
//                       <div className="mini-spinner"></div>
//                     </div>
//                   )}

//                   {/* 薪資資訊 */}
//                   <div className="payroll-amounts">
//                     <span className="amount-item">{formatAmount(record.baseSalary)}</span>
//                     <span className="amount-item">{formatAmount(record.additions)}</span>
//                     <span className="amount-item">{formatAmount(record.totalAfterAdditions)}</span>
//                     <span className="amount-item">{formatAmount(record.deductions)}</span>
//                     <span className="amount-item net-pay">{formatAmount(record.netPay)}</span>
//                   </div>
//                 </div>

//                 {/* 薪資條詳情 (展開時顯示) */}
//                 {selectedRecord?.id === record.id && showDetails && !detailsLoading && (
//                   <div className="payroll-details" ref={detailsRef}>
//                     <div className="details-content">
                      
//                       {/* 標題行 */}
//                       <div className="details-header">
//                         <div className="details-header-left">
//                           <span>項目</span>
//                         </div>
//                         <div className="details-header-right">
//                           <span>金額</span>
//                         </div>
//                       </div>

//                       {/* 本薪 */}
//                       <div className="details-section base-salary">
//                         <div className="details-row">
//                           <div className="details-left">
//                             <span className="item-name">{selectedRecord.details.baseSalary.name}</span>
//                           </div>
//                           <div className="details-right">
//                             <span className="item-amount">{formatAmount(selectedRecord.details.baseSalary.amount)}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* 加項 */}
//                       {selectedRecord.details.additions.length > 0 && (
//                         <div className="details-section additions">
//                           <div className="details-section-header">
//                             <div className="section-title">加項</div>
//                             <div className="section-total">{formatAmount(calculateTotalAdditions(selectedRecord.details.additions))}</div>
//                           </div>
//                           {selectedRecord.details.additions.map((addition, index) => (
//                             <div key={index} className="details-row">
//                               <div className="details-left">
//                                 <span className="item-name">{addition.name}</span>
//                                 {addition.note && <span className="item-note">{addition.note}</span>}
//                               </div>
//                               <div className="details-right">
//                                 <span className="item-amount">{formatAmount(addition.amount)}</span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* 減項 */}
//                       {selectedRecord.details.deductions.length > 0 && (
//                         <div className="details-section deductions">
//                           <div className="details-section-header">
//                             <div className="section-title">減項</div>
//                             <div className="section-total">{formatAmount(calculateTotalDeductions(selectedRecord.details.deductions))}</div>
//                           </div>
//                           {selectedRecord.details.deductions.map((deduction, index) => (
//                             <div key={index} className="details-row">
//                               <div className="details-left">
//                                 <span className="item-name">{deduction.name}</span>
//                                 {deduction.note && <span className="item-note">{deduction.note}</span>}
//                               </div>
//                               <div className="details-right">
//                                 <span className="item-amount">{formatAmount(deduction.amount)}</span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* 總計 */}
//                       <div className="details-section total">
//                         <div className="details-row">
//                           <div className="details-left">
//                             <span className="total-label">實發金額</span>
//                           </div>
//                           <div className="details-right">
//                             <span className="total-amount">{formatAmount(record.netPay)}</span>
//                           </div>
//                         </div>
//                       </div>

//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PayrollRecords;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Payroll_Records.css';

const PayrollRecords = ({ employee }) => {
  // 狀態管理
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState('');
  const [salaryType, setSalaryType] = useState('不限');
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 用於滾動的 ref
  const detailsRef = useRef(null);

  // 模擬發薪紀錄資料
  useEffect(() => {
    const loadPayrollData = async () => {
      try {
        setIsLoading(true);
        // 模擬 API 調用延遲
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockPayrollRecords = [
          {
            id: 9,
            date: '8',
            month: '九',
            title: '薪資單',
            baseSalary: 57000,
            additions: 3000,
            totalAfterAdditions: 60000,
            deductions: 3000,
            netPay: 57000,
            details: {
              baseSalary: { name: '本薪', amount: 57000 },
              additions: [
                { name: '伙食津貼', amount: 3000, note: '(全體加項、自動計算)' }
              ],
              deductions: [
                { name: '勞保費-勞工自負額', amount: 300, note: '(自動計算)' },
                { name: '健保費-勞工自負額', amount: 700, note: '(自動計算)' },
                { name: '勞工自願提繳退休金', amount: 1000, note: '(自動計算)' },
                { name: '事假', amount: 2000, note: '(自動計算)' }
              ],
              companyExpenses: [
                { name: '勞保費-公司負擔', amount: 2536, note: '(自動計算)' },
                { name: '健保費-公司負擔', amount: 500, note: '(自動計算)' },
                { name: '勞退金-公司負擔', amount: 500, note: '(自動計算)' }
              ]
            }
          },
          {
            id: 8,
            date: '8',
            month: '八',
            title: '薪資單',
            baseSalary: 35000,
            additions: 0,
            totalAfterAdditions: 35000,
            deductions: 1000,
            netPay: 34000,
            details: {
              baseSalary: { name: '本薪', amount: 35000 },
              additions: [],
              deductions: [
                { name: '勞保費-勞工自負額', amount: 300, note: '(自動計算)' },
                { name: '健保費-勞工自負額', amount: 400, note: '(自動計算)' },
                { name: '勞工自願提繳退休金', amount: 300, note: '(自動計算)' }
              ]
            }
          },
          {
            id: 7,
            date: '8',
            month: '七',
            title: '薪資單',
            baseSalary: 35000,
            additions: 0,
            totalAfterAdditions: 35000,
            deductions: 1000,
            netPay: 34000,
            details: {
              baseSalary: { name: '本薪', amount: 35000 },
              additions: [],
              deductions: [
                { name: '勞保費-勞工自負額', amount: 300, note: '(自動計算)' },
                { name: '健保費-勞工自負額', amount: 400, note: '(自動計算)' },
                { name: '勞工自願提繳退休金', amount: 300, note: '(自動計算)' }
              ]
            }
          },
          {
            id: 6,
            date: '8',
            month: '六',
            title: '薪資單',
            baseSalary: 35000,
            additions: 0,
            totalAfterAdditions: 35000,
            deductions: 1000,
            netPay: 34000,
            details: {
              baseSalary: { name: '本薪', amount: 35000 },
              additions: [],
              deductions: [
                { name: '勞保費-勞工自負額', amount: 300, note: '(自動計算)' },
                { name: '健保費-勞工自負額', amount: 400, note: '(自動計算)' },
                { name: '勞工自願提繳退休金', amount: 300, note: '(自動計算)' }
              ]
            }
          },
          {
            id: 5,
            date: '8',
            month: '五',
            title: '薪資單',
            baseSalary: 35000,
            additions: 0,
            totalAfterAdditions: 35000,
            deductions: 1000,
            netPay: 34000,
            details: {
              baseSalary: { name: '本薪', amount: 35000 },
              additions: [],
              deductions: [
                { name: '勞保費-勞工自負額', amount: 300, note: '(自動計算)' },
                { name: '健保費-勞工自負額', amount: 400, note: '(自動計算)' },
                { name: '勞工自願提繳退休金', amount: 300, note: '(自動計算)' }
              ]
            }
          },
          {
            id: 4,
            date: '8',
            month: '四',
            title: '薪資單',
            baseSalary: 35000,
            additions: 0,
            totalAfterAdditions: 35000,
            deductions: 1000,
            netPay: 34000,
            details: {
              baseSalary: { name: '本薪', amount: 35000 },
              additions: [],
              deductions: [
                { name: '勞保費-勞工自負額', amount: 300, note: '(自動計算)' },
                { name: '健保費-勞工自負額', amount: 400, note: '(自動計算)' },
                { name: '勞工自願提繳退休金', amount: 300, note: '(自動計算)' }
              ]
            }
          }
        ];

        setPayrollRecords(mockPayrollRecords);
        // 預設展開第一筆記錄
        setSelectedRecord(mockPayrollRecords[0]);
        setShowDetails(true);
      } catch (err) {
        setError('載入薪資紀錄失敗，請稍後再試');
        console.error('載入薪資紀錄錯誤:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayrollData();
  }, [employee]);

  // 格式化金額
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('zh-TW').format(amount || 0);
  }, []);

  // 處理薪資單點擊
  const handleRecordClick = useCallback(async (record) => {
    if (!record || !record.id) {
      console.error('無效的薪資紀錄資料');
      return;
    }

    try {
      // 如果點擊的是已展開的記錄，則收合
      if (selectedRecord && selectedRecord.id === record.id) {
        setSelectedRecord(null);
        setShowDetails(false);
        return;
      }

      // 設置載入狀態
      setDetailsLoading(true);
      
      // 模擬 API 調用獲取詳細資料
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 設置新的選中記錄
      setSelectedRecord(record);
      setShowDetails(true);
      
      // 展開後滾動到詳情區域
      setTimeout(() => {
        const detailsElement = document.querySelector(`[data-record-id="${record.id}"] .payroll-details`);
        if (detailsElement) {
          detailsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }, 100);

    } catch (err) {
      console.error('載入薪資詳情錯誤:', err);
      setError('載入薪資詳情失敗，請稍後再試');
    } finally {
      setDetailsLoading(false);
    }
  }, [selectedRecord]);

  // 處理鍵盤事件
  const handleKeyPress = useCallback((event, record) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRecordClick(record);
    }
  }, [handleRecordClick]);

  // 處理薪資類型選擇
  const handleSalaryTypeChange = useCallback((type) => {
    setSalaryType(type);
  }, []);

  // 計算總加項金額
  const calculateTotalAdditions = useCallback((additions) => {
    return additions.reduce((total, item) => total + (item.amount || 0), 0);
  }, []);

  // 計算總減項金額
  const calculateTotalDeductions = useCallback((deductions) => {
    return deductions.reduce((total, item) => total + (item.amount || 0), 0);
  }, []);

  // 計算公司負擔總額
  const calculateTotalCompanyExpenses = useCallback((expenses) => {
    return expenses.reduce((total, item) => total + (item.amount || 0), 0);
  }, []);

  // 載入狀態
  if (isLoading) {
    return (
      <div className="payroll-records-loading">
        <div className="loading-spinner"></div>
        <p>載入薪資紀錄中...</p>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="payroll-records-error">
        <p>載入失敗：{error}</p>
        <button 
          className="retry-button"
          onClick={() => {
            setError('');
            setIsLoading(true);
            window.location.reload();
          }}
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div className="payroll-records-container">
      
      {/* 左側查詢區域 */}
      <div className="payroll-query-section">
        <div className="query-controls">
          <div className="query-group">
            <div className="query-label">薪資類型</div>
            <div className="salary-type-selector">
              <div 
                className={`salary-type-option ${salaryType === '不限' ? 'active' : ''}`}
                onClick={() => handleSalaryTypeChange('不限')}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSalaryTypeChange('不限');
                  }
                }}
              >
                不限
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右側內容區域 */}
      <div className="payroll-content-section">
        
{/* 表頭 */}
<div className="payroll-header">
  <div className="header-row">
    <span className="header-item">本薪</span>
    <span className="header-item">加項</span>
    <span className="header-item">加後總額</span>
    <span className="header-item">減項</span>
    <span className="header-item">實發金額</span>
    <span className="header-item">詳情</span>
  </div>
</div>


        {/* 薪資紀錄列表 */}
        <div className="payroll-records-list">
          {payrollRecords.length === 0 ? (
            <div className="no-records">
              <p>暫無薪資紀錄</p>
            </div>
          ) : (
            payrollRecords.map((record, index) => (
              <div key={record.id} className="payroll-record-item" data-record-id={record.id}>
                
{/* 薪資單卡片 */}
<div 
  className={`payroll-record-card ${selectedRecord?.id === record.id ? 'expanded' : ''} ${detailsLoading && selectedRecord?.id === record.id ? 'loading' : ''}`}
  onClick={() => handleRecordClick(record)}
  onKeyPress={(e) => handleKeyPress(e, record)}
  tabIndex={0}
  role="button"
  aria-expanded={selectedRecord?.id === record.id}
  aria-label={`${record.title} - ${record.month}月${record.date}日，實發金額 ${formatAmount(record.netPay)} 元`}
>
  
  {/* 日曆圖示和標題 */}
  <div className="calendar-and-title">
    <div className="calendar-icon">
      <div className="calendar-header"></div>
      <div className="calendar-body">
        <span className="calendar-month">{record.month}</span>
      </div>
      <div className="calendar-date">{record.date}</div>
    </div>
    <div className="payroll-title">{record.title}</div>
  </div>

  {/* 薪資資訊 */}
  <div className="payroll-amounts">
    <span className="amount-item">{formatAmount(record.baseSalary)}</span>
    <span className="amount-item">{formatAmount(record.additions)}</span>
    <span className="amount-item">{formatAmount(record.totalAfterAdditions)}</span>
    <span className="amount-item">{formatAmount(record.deductions)}</span>
    <span className="amount-item net-pay">{formatAmount(record.netPay)}</span>
  </div>

  {/* 展開箭頭 */}
  <div className="expand-arrow">
    <svg width="30" height="30" viewBox="0 0 30 30">
      <path 
        d="M7.5 11.25L15 18.75L22.5 11.25" 
        stroke="#C5C5C5" 
        strokeWidth="2" 
        fill="none"
        style={{
          transform: selectedRecord?.id === record.id ? "rotate(180deg)" : "rotate(0deg)",
          transformOrigin: "15px 15px",
          transition: "transform 0.3s ease"
        }}
      />
    </svg>
  </div>

  {/* 載入指示器 */}
  {detailsLoading && selectedRecord?.id === record.id && (
    <div className="card-loading-indicator">
      <div className="mini-spinner"></div>
    </div>
  )}
</div>


                {/* 薪資條詳情 (展開時顯示) */}
                {selectedRecord?.id === record.id && showDetails && !detailsLoading && (
                  <div className="payroll-details" ref={detailsRef}>
                    <div className="details-content">
                      
                      {/* 標題行 */}
                      {/* <div className="details-header">
                        <div className="details-header-left">
                          <span>項目</span>
                        </div>
                        <div className="details-header-right">
                          <span>金額</span>
                        </div>
                      </div> */}

                      {/* 本薪 */}
                      <div className="details-section base-salary">
                        <div className="details-row">
                          <div className="details-left">
                            <span className="item-name">{selectedRecord.details.baseSalary.name}</span>
                          </div>
                          <div className="details-right">
                            <span className="item-amount">{formatAmount(selectedRecord.details.baseSalary.amount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 加項 */}
                      {selectedRecord.details.additions.length > 0 && (
                        <div className="details-section additions">
                          <div className="details-section-header">
                            <div className="section-title">加項</div>
                            <div className="section-total">{formatAmount(calculateTotalAdditions(selectedRecord.details.additions))}</div>
                          </div>
                          {selectedRecord.details.additions.map((addition, index) => (
                            <div key={index} className="details-row">
                              <div className="details-left">
                                <span className="item-name">{addition.name}</span>
                                {addition.note && <span className="item-note">{addition.note}</span>}
                              </div>
                              <div className="details-right">
                                <span className="item-amount">{formatAmount(addition.amount)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 減項 */}
                      {selectedRecord.details.deductions.length > 0 && (
                        <div className="details-section deductions">
                          <div className="details-section-header">
                            <div className="section-title">減項</div>
                            <div className="section-total">{formatAmount(calculateTotalDeductions(selectedRecord.details.deductions))}</div>
                          </div>
                          {selectedRecord.details.deductions.map((deduction, index) => (
                            <div key={index} className="details-row">
                              <div className="details-left">
                                <span className="item-name">{deduction.name}</span>
                                {deduction.note && <span className="item-note">{deduction.note}</span>}
                              </div>
                              <div className="details-right">
                                <span className="item-amount">{formatAmount(deduction.amount)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 不計入 (公司負擔) */}
                      {selectedRecord.details.companyExpenses && selectedRecord.details.companyExpenses.length > 0 && (
                        <div className="details-section company-expenses">
                          <div className="details-section-header">
                            <div className="section-title">不計入</div>
                            <div className="section-total">{formatAmount(calculateTotalCompanyExpenses(selectedRecord.details.companyExpenses))}</div>
                          </div>
                          {selectedRecord.details.companyExpenses.map((expense, index) => (
                            <div key={index} className="details-row">
                              <div className="details-left">
                                <span className="item-name">{expense.name}</span>
                                {expense.note && <span className="item-note">{expense.note}</span>}
                              </div>
                              <div className="details-right">
                                <span className="item-amount">{formatAmount(expense.amount)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 總計 */}
                      <div className="details-section total">
                        <div className="details-row">
                          {/* <div className="details-left">
                            <span className="total-label">實發金額</span>
                          </div> */}
                          <div className="details-right">
                            <span className="total-amount">{formatAmount(record.netPay)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollRecords;
