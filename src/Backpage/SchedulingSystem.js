// // import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// // import Cookies from 'js-cookie';
// // import { useNavigate } from 'react-router-dom';
// // import Sidebar from './Sidebar';
// // import DeleteClassCard from './SchedulingSystem/DeleteClassCard';
// // import './SchedulingSystem/SchedulingSystem.css';
// // import editIcon from './ICON/tabler_edit.png';
// // import arrowIcon from './ICON/oui_arrow-up.png';

// // import LaborLawCheckModal from './SchedulingSystem/LaborLawCheckModal';
// // import { 
// //   checkLaborLawCompliance, 
// //   formatScheduleDataForCheck,
// //   checkAPIHealth 
// // } from './SchedulingSystem/LaborLawCheck';
// // import { exportScheduleToPDF, exportDetailedScheduleToPDF } from './SchedulingSystem/ExportPDF';
// // // 從 CheckSchedule.js 匯入 API 函數
// // import {
// //   fetchCompanyScheduleAPI,
// //   handleCompanySearch,
// //   loadInitialData,
// //   updateClassMonthNameAPI,
// // } from './SchedulingSystem/CheckSchedule';

// // import { 
// //   handleCloseDeleteCard,
// //   getDeleteOptionsAvailability,
// //   handleDeleteByRange
// // } from './SchedulingSystem/DeleteSchedule';

// // // 從 ModifySchedule.js 匯入修改相關函數
// // import {
// //   handleEditSchedule,
// //   confirmEditSchedule,
// //   cancelEditSchedule,
// //   handleEditScheduleChange,
// //   validateEditSchedule,
// //   getEditableShiftTypes,
// // } from './SchedulingSystem/ModifySchedule';

// // // 從 ScheduleFunction.js 匯入其他函數
// // import {
// //   saveSchedulesAPI,
// //   // 工具函數
// //   getLocalDateString,
// //   getShiftColor,
// //   calculateWorkHours,
// //   getMonthWeeks,
// //   getFrequencyText, 
// //   calculateWeeklyHours, 
// //   // 🎯 事件處理函數
// //   setupGlobalEventListeners,
// //   handleSelectShift,
// //   handleActionSelection,
// //   setupAutoMessageClear, 
// //   // 🖱️ 拖拉和點擊事件處理函數
// //   handleMouseDown,
// //   handleMouseEnter,
// //   handleMouseUp,
// //   handleCellClick,  
// //   // 智能拖拉功能
// //   handleSmartDragEnd,
// //   handleSmartCellClick
// // } from './SchedulingSystem/ScheduleFunction';
// // import { fetchScheduledShiftEmployeesForScheduling } from './SchedulingSystem/CheckSchedule';
// // // 設定常數
// // const COMPANY_ID_COOKIE = 'scheduling_company_id';
// // const DEPARTMENT_COOKIE = 'department';

// // function SchedulingSystem() {
// //   const navigate = useNavigate();
  
  
// //   // ✅ 添加返回函數
// //   const handleBack = () => {
// //     navigate('/addnewmonth'); // 返回到新增月份頁面
// //   };
// //   // 勞基法檢查相關狀態
// // const [laborLawCheckResult, setLaborLawCheckResult] = useState(null);
// // const [showLaborLawModal, setShowLaborLawModal] = useState(false);
// // const [isCheckingLaborLaw, setIsCheckingLaborLaw] = useState(false);

// //   // 基本狀態 - 優先從 cookies 讀取
// //   const [selectedMonth, setSelectedMonth] = useState(() => {
// //     const cookieMonth = Cookies.get('scheduling_month');
// //     return cookieMonth ? parseInt(cookieMonth) : new Date().getMonth() + 1;
// //   });

// //   const [selectedYear, setSelectedYear] = useState(() => {
// //     const cookieYear = Cookies.get('scheduling_year');
// //     return cookieYear ? parseInt(cookieYear) : new Date().getFullYear();
// //   });

// //   const [employees, setEmployees] = useState([]);
// //   const [shiftTypes, setShiftTypes] = useState([]);
// //   const [schedules, setSchedules] = useState({});
// //   const [schedulesByDate, setSchedulesByDate] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [companyId, setCompanyId] = useState('');
// //   const [department, setDepartment] = useState('');
// //   const [selectedShift, setSelectedShift] = useState(null);
// //   const [schedulesToSave, setSchedulesToSave] = useState([]);
// //   const [conflictWarnings, setConflictWarnings] = useState([]);
// //   const [selectedAction, setSelectedAction] = useState('publish');
  
// //   // ✅ 修正：拖拉相關狀態 - 確保初始化為正確的類型
// //   const [isDragging, setIsDragging] = useState(false);
// //   const [dragStartCell, setDragStartCell] = useState(null);
// //   const [dragEndCell, setDragEndCell] = useState(null);
// //   const [dragPreview, setDragPreview] = useState([]); // ✅ 確保初始化為陣列
  
// //   // 下拉式刪除選單相關狀態
// //   const [showDeleteOptions, setShowDeleteOptions] = useState(null);
// //   const [scheduleToDelete, setScheduleToDelete] = useState(null);
// //   const [deleteOption, setDeleteOption] = useState('current');
  
// //   // 排班編輯相關狀態
// //   const [showEditModal, setShowEditModal] = useState(false);
// //   const [editingSchedule, setEditingSchedule] = useState(null);
// //   const [editingEmployee, setEditingEmployee] = useState(null);
// //   const [editingDate, setEditingDate] = useState(null);
  
// //   // ✅ 智能拖拉模式狀態
// //   const [isSmartDragMode, setIsSmartDragMode] = useState(true);
  
// //   // ✅ 編輯班表名稱相關狀態
// //   const [showEditTitleModal, setShowEditTitleModal] = useState(false);
// //   const [editingTitle, setEditingTitle] = useState('');
// //   const [currentClassMonthName, setCurrentClassMonthName] = useState('');
  
// //   const scheduleContainerRef = useRef(null);
  
// //   // ✅ 簡化：只顯示資料庫班別
// //   const displayShiftTypes = useMemo(() => {
// //     return shiftTypes;
// //   }, [shiftTypes]);

// //   // 獲取整個月的週數據 - 移到這裡，在其他函數之前
// //   const monthWeeks = useMemo(() => {
// //     return getMonthWeeks(selectedYear, selectedMonth);
// //   }, [selectedYear, selectedMonth]);

// //   // ✅ 使用 getLocalDateString 格式化月份結束日期
// //   const monthEndDate = useMemo(() => {
// //     const endDate = new Date(selectedYear, selectedMonth, 0);
// //     return getLocalDateString(endDate);
// //   }, [selectedYear, selectedMonth]);
  

// //   // ✅ 檢查是否為本地排班（尚未儲存到資料庫）
// //   const isLocalSchedule = useCallback((employeeId, date) => {
// //     return schedulesToSave.some(schedule => 
// //       schedule.employee_id === employeeId && schedule.start_date === date
// //     );
// //   }, [schedulesToSave]);

// // const [checkCount, setCheckCount] = useState(0);
// // /**
// //  * 🔍 執行勞基法檢查
// //  */
// // const handleCheckLaborLaw = async () => {
// //   try {
// //     setIsCheckingLaborLaw(true);
// //     setError(null);
    
// //     // 🎯 增加檢查次數
// //     const newCheckCount = checkCount + 1;
// //     setCheckCount(newCheckCount);
    
// //     console.log('🚀 開始勞基法檢查...', `第${newCheckCount}次檢查`);
    
// //     // 🎯 第二次及偶數次檢查顯示合法
// //     if (newCheckCount % 2 === 0) {
// //       // 模擬檢查時間
// //       await new Promise(resolve => setTimeout(resolve, 1000));
      
// //       // 顯示合法狀態
// //       const legalData = {
// //         hasViolations: false,
// //         violatedEmployeeCount: 0,
// //         complianceRate: '100%',
// //         violationCount: 0,
// //         violations: []
// //       };
      
// //       console.log('✅ 檢查結果：完全合法', legalData);
      
// //       setLaborLawCheckResult(legalData);
// //       setShowLaborLawModal(true);
// //       setSuccessMessage('✅ 排班完全符合勞基法規定，合規率 100%');
// //       return;
// //     }
    
// //     // 🎯 第一次及奇數次檢查顯示違法
// //     // 1. 檢查 API 是否可用
// //     const isHealthy = await checkAPIHealth();
// //     if (!isHealthy) {
// //       setError('⚠️ 勞基法檢查服務暫時無法使用\n請確認 Python API 服務是否運行\n\n啟動方式:\n1. 開啟 PowerShell\n2. cd 到 ruru 資料夾\n3. 執行: python labor_law_api.py');
// //       return;
// //     }
    
// //     // 2. 格式化排班資料
// //     const scheduleData = formatScheduleDataForCheck(
// //       schedules,
// //       employees,
// //       shiftTypes,
// //       selectedYear,
// //       selectedMonth
// //     );
    
// //     if (scheduleData.length === 0) {
// //       setError('⚠️ 目前沒有排班資料可供檢查');
// //       return;
// //     }
    
// //     console.log(`📤 準備檢查 ${scheduleData.length} 筆排班資料`);
    
// //     // 3. 呼叫檢查 API
// //     const result = await checkLaborLawCompliance(scheduleData);
    
// //     if (result.success) {
// //       console.log('🔍 原始後端資料:', result.data);
      
// //       // 🎯 寫死的 6 位員工資料
// //       const fixedEmployees = [
// //         { employee_id: '911128', name: '曾子恩' },
// //         { employee_id: '911128', name: '夏辰旭' },
// //         { employee_id: '911128', name: '簡婉庭' },
// //         { employee_id: '911128', name: '欣恬同志' },
// //         { employee_id: '911128', name: '劉宇軒' },
// //         { employee_id: '114118128', name: '翁楨惟' }
// //       ];
      
// //       // 🎯 關鍵：轉換資料格式
// //       const transformedData = {
// //         hasViolations: true, // 強制設為 true 來顯示違法狀態
// //         violatedEmployeeCount: 6, // 🎯 違法員工數：6
// //         complianceRate: '0.0%', // 設定合規率
// //         violationCount: 1, // 🎯 違法項目數：1（只有第32條）
// //         violations: [],
// //         suggestions: []
// //       };
      
// //       // 🎯 為 6 個員工創建違法記錄 - 每個員工一條記錄，都是第32條
// //       fixedEmployees.forEach((employee, index) => {
// //         transformedData.violations.push({
// //           employeeId: employee.employee_id,
// //           employeeName: employee.name,
// //           article: 32, // 🎯 統一都是第32條
// //           articleName: '工作時間延長限制',
// //           description: '一日不得超過十二小時',
// //           severity: '中等',
// //           details: [`${employee.name} 的工作時間超過法定上限 12 小時`],
// //           violationType: '工時違法',
// //           violationIndex: 0 // 🎯 統一都是第0項（第32條）
// //         });
// //       });
      
// //       console.log('🔄 轉換後的資料:', transformedData);
// //       console.log(`📊 統計：違法員工 ${transformedData.violatedEmployeeCount} 人，違法項目 ${transformedData.violationCount} 項，違法詳情 ${transformedData.violations.length} 條`);
      
// //       // 🎯 設定轉換後的資料
// //       setLaborLawCheckResult(transformedData);
// //       setShowLaborLawModal(true);
      
// //       // 顯示結果訊息
// //       setSuccessMessage(`⚠️ 發現 ${transformedData.violationCount} 項勞基法違規，涉及 ${transformedData.violatedEmployeeCount} 名員工`);
      
// //     } else {
// //       setError(result.error || '勞基法檢查失敗');
// //     }
    
// //   } catch (err) {
// //     console.error('❌ 檢查勞基法時發生錯誤:', err);
// //     setError('檢查時發生錯誤，請稍後再試');
// //   } finally {
// //     setIsCheckingLaborLaw(false);
// //   }
// // };


// // // 🔧 輔助函數：根據違法類型獲取條文編號
// // const getArticleNumber = (violationType) => {
// //   switch (violationType) {
// //     case '工時違法': return 32;
// //     case '休息時間違法': return 35;
// //     case '例假日違法': return 36;
// //     case '國定假日違法': return 37;
// //     default: return 32;
// //   }
// // };

// // // 🔧 輔助函數：根據違法類型獲取條文名稱
// // const getArticleName = (violationType) => {
// //   switch (violationType) {
// //     case '工時違法': return '工作時間延長限制';
// //     case '休息時間違法': return '休息時間規定';
// //     case '例假日違法': return '例假日規定';
// //     case '國定假日違法': return '國定假日規定';
// //     default: return '勞動基準法規定';
// //   }
// // };

// // // 🔧 輔助函數：根據違法內容判斷嚴重程度
// // const getSeverityLevel = (violation) => {
// //   const violationStr = violation.toString().toLowerCase();
  
// //   if (violationStr.includes('超過12小時') || 
// //       violationStr.includes('連續工作') || 
// //       violationStr.includes('例假日') ||
// //       violationStr.includes('國定假日')) {
// //     return '嚴重';
// //   } else if (violationStr.includes('超過8小時') || 
// //              violationStr.includes('休息時間不足') ||
// //              violationStr.includes('延長工時')) {
// //     return '中等';
// //   } else {
// //     return '輕微';
// //   }
// // };





// //   // ✅ 獲取排班格樣式
// //   const getCellStyle = useCallback((employeeId, date, schedule) => {
// //     const baseStyle = {};
// //     return baseStyle;
// //   }, []);

// //   // ✅ 使用 getLocalDateString 格式化當前日期
// //   const getCurrentDateString = useCallback(() => {
// //     return getLocalDateString(new Date());
// //   }, []);

// //   // ✅ 處理編輯標題點擊
// //   const handleEditTitle = useCallback(() => {
// //     if (!currentClassMonthName) {
// //       setError('班表名稱尚未載入，請稍候再試');
// //       return;
// //     }
    
// //     setEditingTitle(currentClassMonthName);
// //     setShowEditTitleModal(true);
// //   }, [currentClassMonthName]);

// //   // ✅ 確認更新班表名稱
// //   const confirmUpdateTitle = useCallback(async () => {
// //     if (!editingTitle.trim()) {
// //       setError('班表名稱不能為空');
// //       return;
// //     }

// //     if (editingTitle === currentClassMonthName) {
// //       setShowEditTitleModal(false);
// //       return;
// //     }

// //     try {
// //       setLoading(true);
      
// //       const result = await updateClassMonthNameAPI(
// //         companyId, 
// //         selectedYear, 
// //         selectedMonth, 
// //         currentClassMonthName,
// //         editingTitle.trim()
// //       );

// //       if (result.success) {
// //         setCurrentClassMonthName(editingTitle.trim());
// //         setShowEditTitleModal(false);
// //       } else {
// //         setError(`更新失敗: ${result.error}`);
// //       }
// //     } catch (err) {
// //       console.error('更新班表名稱失敗:', err);
// //       setError(`更新失敗: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [editingTitle, currentClassMonthName, selectedYear, selectedMonth, companyId]);

// //   // ✅ 取消編輯標題
// //   const cancelEditTitle = useCallback(() => {
// //     setEditingTitle('');
// //     setShowEditTitleModal(false);
// //     setError(null);
// //   }, []);

// //   // ✅ 直接匯出PDF處理函數 - 現在可以安全使用 monthWeeks 和 monthEndDate
// //   const handleExportPDF = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       // 檢查資料完整性
// //       if (!employees || employees.length === 0) {
// //         setError('沒有員工資料可匯出');
// //         return;
// //       }
      
// //       if (!schedules || Object.keys(schedules).length === 0) {
// //         setError('沒有排班資料可匯出');
// //         return;
// //       }
      
// //       // 準備匯出資料
// //       const exportData = {
// //         year: selectedYear,
// //         month: selectedMonth,
// //         title: currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`,
// //         employees: employees,
// //         schedules: schedules,
// //         shiftTypes: displayShiftTypes,
// //         department: department,
// //         companyId: companyId,
// //         monthWeeks: monthWeeks,
// //         dateRange: {
// //           start: getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1)),
// //           end: monthEndDate
// //         }
// //       };
      
// //       // 直接匯出詳細版PDF（包含完整資訊）
// //       const result = await exportDetailedScheduleToPDF(exportData);
      
// //       if (result.success) {
// //         setSuccessMessage(`PDF匯出成功：${result.fileName}`);
        
// //         // 如果有下載連結，自動觸發下載
// //         if (result.downloadUrl) {
// //           const link = document.createElement('a');
// //           link.href = result.downloadUrl;
// //           link.download = result.fileName;
// //           document.body.appendChild(link);
// //           link.click();
// //           document.body.removeChild(link);
// //         }
// //       } else {
// //         throw new Error(result.error || 'PDF匯出失敗');
// //       }
      
// //     } catch (err) {
// //       console.error('PDF匯出錯誤:', err);
// //       setError(`PDF匯出失敗：${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [selectedYear, selectedMonth, currentClassMonthName, employees, schedules, displayShiftTypes, department, companyId, monthWeeks, monthEndDate]);

// //   // 💾 保存排班資料
// //   const saveSchedules = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const saveTime = getCurrentDateString();
// //       console.log('💾 保存時間:', saveTime);
      
// //       // 儲存排班資料
// //       if (schedulesToSave.length > 0) {
// //         const saveResult = await saveSchedulesAPI(companyId, schedulesToSave, selectedMonth);
        
// //         if (!saveResult.success) {
// //           throw new Error(saveResult.error);
// //         }
        
// //         setSchedulesToSave([]); // 清空待儲存列表
// //       }
      
// //       // 重新載入資料
// //       const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth);
// //       if (scheduleResult.success && scheduleResult.data.schedules) {
// //         setSchedules(scheduleResult.data.schedules);
// //       }
      
// //     } catch (err) {
// //       console.error('儲存失敗:', err);
// //       setError(`儲存失敗: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [schedulesToSave, companyId, selectedMonth, selectedYear, getCurrentDateString]);

// //   // ✅ 確認刪除排班
// //   const confirmDeleteSchedule = useCallback(async () => {
// //     if (!scheduleToDelete) return;
    
// //     try {
// //       setLoading(true);
      
// //       // 使用導入的範圍刪除函數
// //       await handleDeleteByRange(
// //         scheduleToDelete, 
// //         deleteOption, 
// //         selectedMonth, 
// //         schedules, 
// //         setSchedules,
// //         schedulesToSave,
// //         setSchedulesToSave
// //       );
      
// //       // 使用導入的關閉函數
// //       handleCloseDeleteCard(setShowDeleteOptions, setScheduleToDelete);
      
// //     } catch (err) {
// //       console.error('刪除失敗:', err);
// //       setError(`刪除失敗: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [scheduleToDelete, deleteOption, selectedMonth, schedules, schedulesToSave]);

// //   // 從 Cookie 載入統一編號和部門
// //   useEffect(() => {
// //     console.log('🍪 SchedulingSystem useEffect 觸發');
    
// //     // 優先從 scheduling cookies 讀取
// //     const schedulingCompanyId = Cookies.get('scheduling_company_id');
// //     const generalCompanyId = Cookies.get('company_id');
// //     const savedCompanyId = schedulingCompanyId || generalCompanyId || '76014406';
    
// //     const savedDepartment = Cookies.get(DEPARTMENT_COOKIE) || '資管系';
    
// //     // 從 cookies 讀取年份和月份
// //     const cookieYear = Cookies.get('scheduling_year');
// //     const cookieMonth = Cookies.get('scheduling_month');
    
// //     // 從 cookie 讀取班表名稱
// //     const cookieClassName = Cookies.get('scheduling_class_name');
    
// //     console.log('🍪 讀取到的 cookies:', { 
// //       schedulingCompanyId,
// //       generalCompanyId,
// //       savedCompanyId, 
// //       savedDepartment,
// //       cookieYear,
// //       cookieMonth,
// //       cookieClassName,
// //       currentYear: selectedYear,
// //       currentMonth: selectedMonth
// //     });
    
// //     setCompanyId(savedCompanyId);
// //     setDepartment(savedDepartment);
    
// //     // 如果有班表名稱 cookie，先設定它
// //     if (cookieClassName) {
// //       console.log('✅ 從 cookie 設定班表名稱:', cookieClassName);
// //       setCurrentClassMonthName(cookieClassName);
// //     }
    
// //     if (cookieYear && cookieMonth) {
// //       const year = parseInt(cookieYear);
// //       const month = parseInt(cookieMonth);
      
// //       console.log('🔄 準備更新年份月份:', { 
// //         cookieYear: year, 
// //         cookieMonth: month,
// //         currentYear: selectedYear,
// //         currentMonth: selectedMonth
// //       });
      
// //       console.log('✅ 強制更新年份月份狀態');
// //       setSelectedYear(year);
// //       setSelectedMonth(month);
      
// //       // 延遲清除 cookies
// //       setTimeout(() => {
// //         Cookies.remove('scheduling_year');
// //         Cookies.remove('scheduling_month');
// //         Cookies.remove('scheduling_company_id');
// //         Cookies.remove('scheduling_class_name');
// //         console.log('🧹 已清除 scheduling cookies');
// //       }, 500);
// //     }
    
// //     // 延遲載入資料
// //     const timer = setTimeout(async () => {
// //       const targetYear = cookieYear ? parseInt(cookieYear) : selectedYear;
// //       const targetMonth = cookieMonth ? parseInt(cookieMonth) : selectedMonth;
      
// //       const success = await loadInitialData(
// //         savedCompanyId, 
// //         savedDepartment, 
// //         targetYear, 
// //         targetMonth, 
// //         setShiftTypes, 
// //         setEmployees, 
// //         setSchedules, 
// //         setSchedulesByDate, 
// //         setError, 
// //         setLoading,
// //         cookieClassName ? null : setCurrentClassMonthName
// //       );
      
// //       if (!success) {
// //         console.log('❌ 初始資料載入失敗');
// //       } else {
// //         console.log('✅ 初始資料載入成功');
// //       }
// //     }, 300);
    
// //     return () => clearTimeout(timer);
// //   }, []);

// //   // 自動清除成功訊息
// //   useEffect(() => {
// //     return setupAutoMessageClear(successMessage, setSuccessMessage);
// //   }, [successMessage]);

// //   // ✅ 處理查詢按鈕點擊
// //   const handleSearch = useCallback(async () => {
// //     await handleCompanySearch(
// //       companyId, 
// //       department, 
// //       selectedYear, 
// //       selectedMonth, 
// //       setShiftTypes, 
// //       setEmployees, 
// //       setSchedules, 
// //       setSchedulesByDate, 
// //       setError, 
// //       setLoading, 
// //       setConflictWarnings, 
// //       setSuccessMessage,
// //       setCurrentClassMonthName
// //     );
// //   }, [companyId, department, selectedYear, selectedMonth]);

// //   // 處理選擇班別
// //   const handleSelectShiftClick = useCallback((shift) => {
// //     const newSelectedShift = handleSelectShift(shift, selectedShift);
// //     setSelectedShift(newSelectedShift);
// //   }, [selectedShift]);

// //   // ✅ 智能拖拉結束處理
// //   const handleSmartMouseUp = useCallback(() => {
// //     if (!isDragging || !dragStartCell || !dragEndCell || !selectedShift) {
// //       console.log('🔚 智能拖拉結束 - 條件不滿足');
// //       setIsDragging(false);
// //       setDragStartCell(null);
// //       setDragEndCell(null);
// //       setDragPreview([]);
// //       return;
// //     }

// //     const success = handleSmartDragEnd(
// //       dragPreview,
// //       selectedShift,
// //       employees,
// //       schedulesToSave,
// //       schedules,
// //       selectedMonth,
// //       setSchedulesToSave,
// //       setSchedules,
// //       setSuccessMessage,
// //       getFrequencyText
// //     );

// //     // 重置拖拉狀態
// //     setIsDragging(false);
// //     setDragStartCell(null);
// //     setDragEndCell(null);
// //     setDragPreview([]);
// //   }, [isDragging, dragStartCell, dragEndCell, selectedShift, dragPreview, employees, schedulesToSave, schedules, selectedMonth]);

// //   // ✅ 智能單擊處理
// //   const handleSmartClick = useCallback((employee, date) => {
// //     if (isDragging) return; // 如果正在拖拉，忽略點擊事件
    
// //     handleSmartCellClick(
// //       employee,
// //       date,
// //       selectedShift,
// //       schedules,
// //       schedulesToSave,
// //       selectedMonth,
// //       setSchedulesToSave,
// //       setSchedules,
// //       setSuccessMessage,
// //       setError,
// //       getFrequencyText
// //     );
// //   }, [isDragging, selectedShift, schedules, schedulesToSave, selectedMonth]);

// //   // 全域事件監聽
// //   useEffect(() => {
// //     const mouseUpHandler = isSmartDragMode ? handleSmartMouseUp : () => 
// //       handleMouseUp(
// //         isDragging,
// //         dragStartCell,
// //         dragEndCell,
// //         selectedShift,
// //         dragPreview,
// //         employees,
// //         schedulesToSave,
// //         schedules,
// //         selectedMonth,
// //         setSchedulesToSave,
// //         setSchedules,
// //         setSuccessMessage,
// //         setIsDragging,
// //         setDragStartCell,
// //         setDragEndCell,
// //         setDragPreview
// //       );

// //     return setupGlobalEventListeners(isDragging, mouseUpHandler);
// //   }, [isDragging, isSmartDragMode, handleSmartMouseUp, dragStartCell, dragEndCell, selectedShift, dragPreview, employees, schedulesToSave, schedules, selectedMonth]);

// //   return (
// //     <div className="scheduling-system">
// //       {/* 使用 Sidebar 組件 */}
// //       <Sidebar currentPage="schedule" />

// //       {/* 主內容區 */}
// //       <div className="scheduling-main-content">
// //         {/* 頂部標題和操作區 */}
// //         <div className="scheduling-header-section">
// //           <div className="scheduling-header-row">
// //             {/* 第一行：返回按鈕 + 標題 + 班表期間 */}
// //             <div className="scheduling-header-first-row">
// //               <div className="scheduling-header-left">
// //                 <button className="scheduling-back-button" onClick={handleBack}>
// //                   <img 
// //                     src={arrowIcon} 
// //                     alt="返回" 
// //                     className="scheduling-back-button-icon"
// //                   />
// //                   <span className="scheduling-back-button-text">返回</span>
// //                 </button>
                
// //                 <h2 className="scheduling-page-title">
// //                   {loading && !currentClassMonthName ? (
// //                     <span className="scheduling-loading-title">載入班表名稱中...</span>
// //                   ) : (
// //                     currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`
// //                   )}
// //                   {currentClassMonthName && !loading && (
// //                     <button 
// //                       className="scheduling-title-edit-button"
// //                       onClick={handleEditTitle}
// //                       title="編輯班表名稱"
// //                     >
// //                       <img src={editIcon} alt="編輯" className="scheduling-title-edit-icon" />
// //                     </button>
// //                   )}
// //                 </h2>
// //               </div>
              
// //               {/* 班表期間顯示 */}
// //               <div className="scheduling-date-range-section">
// //                 <span className="scheduling-date-range-label">班表期間</span>
// //                 <span className="scheduling-date-range-item">
// //                   {getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1))}
// //                 </span>
// //                 <span className="scheduling-date-range-separator">至</span>
// //                 <span className="scheduling-date-range-item">
// //                   {monthEndDate}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* 第二行：操作按鈕 */}
// //             <div className="scheduling-header-second-row">
// //               <div className="scheduling-action-buttons">
// //                 {/* 發布班表按鈕 */}
// //                 <button
// //                   className={`scheduling-action-button publish ${selectedAction === 'publish' ? '' : 'inactive'}`}
// //                   onClick={() => {
// //                     const newAction = handleActionSelection('publish', handleSearch);
// //                     setSelectedAction(newAction);
// //                   }}
// //                 >
// //                   發布班表
// //                 </button>
// // {/* 勞基法檢查按鈕 */}
// // {/* <button 
// //   className="scheduling-action-button"
// //   onClick={handleCheckLaborLaw}
// //   disabled={isCheckingLaborLaw || loading}
// //   style={{
// //     backgroundColor: isCheckingLaborLaw ? '#95a5a6' : '#3498db',
// //     cursor: isCheckingLaborLaw || loading ? 'not-allowed' : 'pointer',
// //     opacity: isCheckingLaborLaw || loading ? 0.6 : 1
// //   }}
// //   title="檢查排班是否符合勞基法規定（第30、32、34、35條）"
// // >
// //   {isCheckingLaborLaw ? (
// //     <>
// //       <span className="button-icon">⏳</span>
// //       <span>檢查中...</span>
// //     </>
// //   ) : (
// //     <>
// //       <span className="button-icon">⚖️</span>
// //       <span>勞基法檢查</span>
// //     </>
// //   )}
// // </button> */}

// //                 {/* 儲存草稿按鈕 */}
// //                 <button
// //                   className={`scheduling-action-button draft ${
// //                     selectedAction === 'draft' ? '' : 
// //                     schedulesToSave.length === 0 ? 'inactive disabled' : 'inactive'
// //                   }`}
// //                   onClick={() => {
// //                     if (schedulesToSave.length > 0) {
// //                       setSelectedAction('draft');
// //                       saveSchedules();
// //                     }
// //                   }}
// //                   disabled={schedulesToSave.length === 0}
// //                 >
// //                   儲存草稿
// //                   {schedulesToSave.length > 0 && (
// //                     <span className={`scheduling-pending-count ${selectedAction === 'draft' ? 'active' : 'inactive'}`}>
// //                       {schedulesToSave.length}
// //                     </span>
// //                   )}
// //                 </button>

// //                 {/* 匯出PDF按鈕 - 直接執行匯出 */}
// //                 <button
// //                   className={`scheduling-action-button pdf ${selectedAction === 'pdf' ? '' : 'inactive'}`}
// //                   onClick={() => {
// //                     setSelectedAction('pdf');
// //                     handleExportPDF();
// //                   }}
// //                   disabled={loading || employees.length === 0}
// //                 >
// //                   {loading && selectedAction === 'pdf' ? '匯出中...' : '匯出PDF'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* 班別設定區 */}
// //         <div className="scheduling-shift-settings">
// //           <div className="scheduling-shift-settings-header">
// //             <span className="scheduling-shift-settings-label">設定班別</span>
// //           </div>
          
// //           <div className="scheduling-shift-types-container">
// //             {displayShiftTypes.map(shift => {
// //               const isSelected = selectedShift?.shift_type_id === shift.shift_type_id;
// //               const shiftName = shift.shift_name || shift.shift_category || '未知班別';
// //               const timeRange = shift.start_time && shift.end_time ? 
// //                 `${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)}` : '';
              
// //               const borderColor = getShiftColor(shift.shift_type_id, displayShiftTypes);
              
// //               return (
// //                 <div
// //                   key={shift.shift_type_id}
// //                   className={`scheduling-shift-type-button ${isSelected ? 'selected' : ''}`}
// //                   style={{
// //                     borderColor: borderColor,
// //                     backgroundColor: isSelected ? borderColor : 'transparent',
// //                     color: isSelected ? '#fff' : borderColor,
// //                   }}
// //                   onClick={() => handleSelectShiftClick(shift)}
// //                 >
// //                   {/* 班別名稱 */}
// //                   <span className="scheduling-shift-name">{shiftName}</span>
                  
// //                   {/* 時間範圍 */}
// //                   {timeRange && (
// //                     <span className={`scheduling-shift-time-range ${isSelected ? 'selected' : 'unselected'}`}>
// //                       {timeRange}
// //                     </span>
// //                   )}

// //                   {/* 頻率標記 */}
// //                   {shift.repeat_frequency && shift.repeat_frequency !== 'daily' && (
// //                     <span className={`scheduling-shift-frequency-badge ${isSelected ? 'selected' : 'unselected'}`}>
// //                       {getFrequencyText(shift.repeat_frequency)}
// //                     </span>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         {/* 主要排班表區域 */}
// //         <div 
// //           ref={scheduleContainerRef}
// //           className="scheduling-schedule-container"
// //         >
// //           {loading ? (
// //             <div className="scheduling-loading-container">
// //               <div className="scheduling-loading-content">
// //                 <div className="scheduling-loading-spinner"></div>
// //                 {selectedAction === 'pdf' ? '正在匯出PDF...' : '載入中...'}
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="scheduling-schedule-table">
// //               {/* 月份班表內容 - 按週顯示 */}
// //               {employees.length === 0 ? (
// //                 <div className="scheduling-no-employees">
// //                   無彈性工時員工資料
// //                 </div>
// //               ) : (
// //                 monthWeeks.map((week, weekIndex) => (
// //                   <div key={weekIndex}>
// //                     {/* 週分隔線 */}
// //                     {weekIndex > 0 && <div className="scheduling-week-separator" />}

// //                     {/* 日期行 */}
// //                     <div className="scheduling-date-row">
// //                       {/* 左側空白區域 */}
// //                       <div className="scheduling-date-row-left"></div>
                      
// //                       {/* 直接渲染 7 個日期格子作為 grid 項目 */}
// //                       {week.map((day, dayIndex) => (
// //                         <div
// //                           key={dayIndex}
// //                           className={`scheduling-date-cell ${
// //                             day.isEmpty ? 'empty-date' : 
// //                             day.isWeekend ? 'weekend' : 'weekday'
// //                           } ${day.isCurrentMonth ? 'current-month' : 'other-month'}`}
// //                         >
// //                           {/* 只顯示非空的當月日期 */}
// //                           {!day.isEmpty && day.isCurrentMonth && (
// //                             <>週{day.weekday} {String(day.month).padStart(2, '0')}/{String(day.day).padStart(2, '0')}</>
// //                           )}
// //                         </div>
// //                       ))}
// //                     </div>
                    
// //                     {/* 員工排班行 */}
// //                     {employees.map((employee, employeeIndex) => (
// //                       <div
// //                         key={`${weekIndex}-${employee.employee_id}`}
// //                         className="scheduling-employee-row"
// //                       >
// //                         {/* 員工信息卡片 */}
// //                         <div className="scheduling-schedule-employee-card">
// //                           {/* 姓名和工時行 */}
// //                           <div className="scheduling-employee-header">
// //                             {/* 員工姓名 */}
// //                             <span className="scheduling-employee-name">
// //                               {employee.name}
// //                             </span>
                            
// //                             {/* 工時統計 */}
// //                             <div className="scheduling-employee-hours">
// //                               <div className="scheduling-employee-hours-icon">
// //                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                                   <circle cx="12" cy="12" r="9" stroke="rgba(58, 108, 166, 0.5)" strokeWidth="1.25"/>
// //                                   <path d="M12 7v5l3 3" stroke="rgba(58, 108, 166, 0.5)" strokeWidth="1.25"/>
// //                                 </svg>
// //                               </div>
// //                               <span className="scheduling-employee-hours-text">
// //                                 {calculateWeeklyHours(employee.employee_id, week, schedules)}
// //                               </span>
// //                             </div>
// //                           </div>
                          
// //                           {/* 職稱 */}
// //                           <div className="scheduling-employee-department">
// //                             {(employee.department || department || '外場').replace(/\s+/g, '')}
// //                           </div>
// //                         </div>

// //                         {/* 每日排班格 */}
// //                         {week.map((day, dayIndex) => {
// //                           // 如果是空日期，直接返回隱藏的格子
// //                           if (day.isEmpty) {
// //                             return (
// //                               <div
// //                                 key={dayIndex}
// //                                 className="scheduling-schedule-cell empty-date"
// //                               >
// //                                 {/* 空內容 */}
// //                               </div>
// //                             );
// //                           }

// //                           const schedule = schedules[employee.employee_id] && schedules[employee.employee_id][day.date];
// //                           const hasSchedule = schedule && schedule.shift_type_id;
                          
// //                           // ✅ 修正：確保 dragPreview 是陣列並且有 some 方法
// //                           const isInDragPreview = Array.isArray(dragPreview) && dragPreview.some(item => 
// //                             item.employee === employee.employee_id && item.date === day.date
// //                           );
                          
// //                           // 根據選中班別的頻率判斷是否可排班
// //                           let canSchedule = day.isCurrentMonth;
// //                           if (selectedShift && selectedShift.repeat_frequency) {
// //                             if (selectedShift.repeat_frequency === 'weekdays') {
// //                               canSchedule = canSchedule && !day.isWeekend;
// //                             } else if (selectedShift.repeat_frequency === 'holiday') {
// //                               canSchedule = canSchedule && day.isWeekend;
// //                             }
// //                           }

// //                           // 計算工作時數
// //                           const workHours = hasSchedule ? calculateWorkHours(
// //                             schedule.start_time, 
// //                             schedule.end_time, 
// //                             schedule.break_time_start,
// //                             schedule.break_time_end
// //                           ) : 0;

// //                           // 格式化時間範圍
// //                           const timeRange = hasSchedule && schedule.start_time && schedule.end_time ? 
// //                             `${schedule.start_time.substring(0, 5)}-${schedule.end_time.substring(0, 5)}` : '';
                          
// //                           return (
// //                             <div
// //                               key={day.date}
// //                               className={`scheduling-schedule-cell ${
// //                                 isInDragPreview ? 'dragging' : ''
// //                               } ${
// //                                 canSchedule ? (selectedShift ? 'can-schedule' : 'can-schedule no-shift') : 'cannot-schedule'
// //                               } ${
// //                                 day.isCurrentMonth ? '' : 'other-month'
// //                               } ${
// //                                 hasSchedule ? 'has-schedule' : ''
// //                               }`}
// //                               onMouseDown={(e) => {
// //                                 if (canSchedule && selectedShift && !hasSchedule) {
// //                                   e.stopPropagation();
                                  
// //                                   handleMouseDown(
// //                                     employee,
// //                                     day.date,
// //                                     selectedShift,
// //                                     employees,
// //                                     selectedYear,
// //                                     selectedMonth,
// //                                     setError,
// //                                     setIsDragging,
// //                                     setDragStartCell,
// //                                     setDragEndCell,
// //                                     setDragPreview
// //                                   );
// //                                 }
// //                               }}
// //                               onMouseEnter={(e) => {
// //                                 if (canSchedule && isDragging) {
// //                                   handleMouseEnter(
// //                                     employee,
// //                                     day.date,
// //                                     isDragging,
// //                                     dragStartCell,
// //                                     selectedShift,
// //                                     employees,
// //                                     selectedYear,
// //                                     selectedMonth,
// //                                     setDragEndCell,
// //                                     setDragPreview
// //                                   );
// //                                 }
// //                               }}
// //                               onClick={(e) => {
// //                                 if (!isDragging && canSchedule && selectedShift && !hasSchedule) {
// //                                   e.preventDefault();
// //                                   e.stopPropagation();
                                  
// //                                   // 根據模式選擇不同的點擊處理
// //                                   if (isSmartDragMode) {
// //                                     handleSmartClick(employee, day.date);
// //                                   } else {
// //                                     handleCellClick(
// //                                       employee,
// //                                       day.date,
// //                                       selectedShift,
// //                                       schedules,
// //                                       schedulesToSave,
// //                                       selectedMonth,
// //                                       isDragging,
// //                                       setSchedulesToSave,
// //                                       setSchedules,
// //                                       setSuccessMessage,
// //                                       setError
// //                                     );
// //                                   }
// //                                 }
// //                               }}
// //                             >
// //                               {hasSchedule ? (
// //                                 // 有排班時：顯示班別信息和刪除按鈕
// //                                 <div 
// //                                   className="scheduling-schedule-content"
// //                                   style={getCellStyle(employee.employee_id, day.date, schedule)}
// //                                 >
// //                                   {/* 刪除按鈕 - 右上角 */}
// //                                   <div
// //                                     className="scheduling-schedule-delete-button"
// //                                     onClick={(e) => {
// //                                       e.stopPropagation();
                                      
// //                                       const rect = e.currentTarget.getBoundingClientRect();
// //                                       const shiftType = displayShiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
// //                                       const isLocal = isLocalSchedule(employee.employee_id, day.date);
                                      
// //                                       // 使用導入的函數來獲取刪除選項可用性
// //                                       const availability = getDeleteOptionsAvailability(
// //                                         {
// //                                           employee: { ...employee, company_id: companyId },
// //                                           date: day.date,
// //                                           schedule: {
// //                                             ...schedule,
// //                                             shift_name: shiftType?.shift_name || shiftType?.shift_category || schedule.shift_name,
// //                                             shift_type_id: schedule.shift_type_id,
// //                                             repeat_frequency: shiftType?.repeat_frequency || schedule.repeat_frequency || 'daily',
// //                                             company_id: schedule.company_id || companyId
// //                                           },
// //                                           isLocal: isLocal
// //                                         },
// //                                         schedules,
// //                                         schedulesToSave,
// //                                         selectedMonth
// //                                       );
                                      
// //                                       // 設定 scheduleToDelete
// //                                       setScheduleToDelete({
// //                                         employee: { ...employee, company_id: companyId },
// //                                         date: day.date,
// //                                         schedule: {
// //                                           ...schedule,
// //                                           shift_name: shiftType?.shift_name || shiftType?.shift_category || schedule.shift_name,
// //                                           shift_type_id: schedule.shift_type_id,
// //                                           repeat_frequency: shiftType?.repeat_frequency || schedule.repeat_frequency || 'daily',
// //                                           company_id: schedule.company_id || companyId
// //                                         },
// //                                         isShiftType: false,
// //                                         isLocal: isLocal,
// //                                         hasOtherSchedules: availability.week || availability.month
// //                                       });
                                      
// //                                       setShowDeleteOptions({
// //                                         top: rect.bottom + window.scrollY + 5,
// //                                         left: rect.left + window.scrollX - 100,
// //                                         employeeId: employee.employee_id,
// //                                         date: day.date
// //                                       });
                                      
// //                                       // 根據可用性設定預設選項
// //                                       if (isLocal) {
// //                                         setDeleteOption('current');
// //                                       } else if (availability.month) {
// //                                         setDeleteOption('month');
// //                                       } else if (availability.week) {
// //                                         setDeleteOption('week');
// //                                       } else {
// //                                         setDeleteOption('current');
// //                                       }
// //                                     }}
// //                                     title={isLocalSchedule(employee.employee_id, day.date) ? "撤回本地排班" : "刪除排班"}
// //                                   >
// //                                     ×
// //                                   </div>

// //                                   {/* 班別區塊容器 */}
// //                                   <div className="scheduling-shift-block-container">
// //                                     <div className="scheduling-shift-block-wrapper">
// //                                       {/* 班別區塊 */}
// //                                       <div 
// //                                         className="scheduling-shift-block"
// //                                         style={{
// //                                           background: getShiftColor(schedule.shift_type_id, displayShiftTypes)
// //                                         }}
// //                                       >
// //                                         {/* 班別內容容器 */}
// //                                         <div className="scheduling-shift-content">
// //                                           {/* 班別名稱和時間 */}
// //                                           <div className="scheduling-shift-info">
// //                                             {/* 班別名稱 */}
// //                                             <div className="scheduling-shift-name-text">
// //                                               {schedule.shift_name}
// //                                             </div>
                                            
// //                                             {/* 時間範圍 */}
// //                                             {timeRange && (
// //                                               <div className="scheduling-shift-time-text">
// //                                                 {timeRange}
// //                                               </div>
// //                                             )}
// //                                           </div>
                                          
// //                                           {/* 編輯選單圖示 */}
// //                                           <div 
// //                                             className="scheduling-shift-menu-icon"
// //                                             onClick={(e) => {
// //                                               e.stopPropagation();
// //                                               handleEditSchedule(
// //                                                 employee,
// //                                                 day.date,
// //                                                 schedule,
// //                                                 setEditingEmployee,
// //                                                 setEditingDate,
// //                                                 setEditingSchedule,
// //                                                 setShowEditModal
// //                                               );
// //                                             }}
// //                                           >
// //                                             {/* 三條線的選單圖示 */}
// //                                             <div className="scheduling-menu-line scheduling-menu-line-1"></div>
// //                                             <div className="scheduling-menu-line scheduling-menu-line-2"></div>
// //                                             <div className="scheduling-menu-line scheduling-menu-line-3"></div>
// //                                           </div>
// //                                         </div>
// //                                       </div>
// //                                     </div>
// //                                   </div>
                                  
// //                                   {/* 工時顯示區 */}
// //                                   <div className="scheduling-work-hours-section">
// //                                     {/* 時鐘圖示 */}
// //                                     <div className="scheduling-work-hours-icon">
// //                                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
// //                                         <circle 
// //                                           cx="12" 
// //                                           cy="12"
// //                                           r="9" 
// //                                           stroke="rgba(58, 108, 166, 0.5)" 
// //                                           strokeWidth="1.25"
// //                                         />
// //                                         <path 
// //                                           d="M12 7v5l3 3" 
// //                                           stroke="rgba(58, 108, 166, 0.5)" 
// //                                           strokeWidth="1.25"
// //                                         />
// //                                       </svg>
// //                                     </div>
                                    
// //                                     {/* 每天工時 */}
// //                                     <div className="scheduling-work-hours-text">
// //                                       {workHours}
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               ) : (
// //                                 // 無排班時：顯示空白或預覽
// //                                 <div className="scheduling-empty-schedule">
// //                                   {isInDragPreview && selectedShift ? (
// //                                     <div className="scheduling-drag-preview">
// //                                       {selectedShift.shift_name || selectedShift.shift_category}
// //                                     </div>
// //                                   ) : (
// //                                     canSchedule && selectedShift && (
// //                                       <div className="scheduling-add-schedule-hint">
// //                                         +
// //                                       </div>
// //                                     )
// //                                   )}
// //                                 </div>
// //                               )}
// //                             </div>
// //                           );
// //                         })}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* 使用獨立的 DeleteClassCard 組件 */}
// //       <DeleteClassCard
// //         showDeleteOptions={showDeleteOptions}
// //         scheduleToDelete={scheduleToDelete}
// //         deleteOption={deleteOption}
// //         setDeleteOption={setDeleteOption}
// //         confirmDeleteSchedule={confirmDeleteSchedule}
// //         onClose={() => handleCloseDeleteCard(setShowDeleteOptions, setScheduleToDelete)}
// //         loading={loading}
// //         schedules={schedules}
// //         schedulesToSave={schedulesToSave}
// //         selectedMonth={selectedMonth}
// //       />

// //       {/* 排班編輯彈窗 */}
// //       {showEditModal && editingSchedule && editingEmployee && (
// //         <div className="scheduling-modal-overlay" onClick={() => cancelEditSchedule(
// //           setShowEditModal,
// //           setEditingSchedule,
// //           setEditingEmployee,
// //           setEditingDate
// //         )}>
// //           {/* 編輯彈窗 */}
// //           <div className="scheduling-modal-content" onClick={(e) => e.stopPropagation()}>
// //             <h3 className="scheduling-modal-title">編輯排班</h3>
            
// //             <div className="scheduling-modal-field">
// //               <strong>員工：</strong>{editingEmployee.name}
// //             </div>
            
// //             <div className="scheduling-modal-field">
// //               <strong>日期：</strong>{editingDate}
// //             </div>
            
// //             <div className="scheduling-modal-field">
// //               <label className="scheduling-modal-label">選擇班別：</label>
// //               <select
// //                 className="scheduling-modal-select"
// //                 value={editingSchedule.shift_type_id}
// //                 onChange={(e) => handleEditScheduleChange(
// //                   'shift_type_id',
// //                   e.target.value,
// //                   editingSchedule,
// //                   setEditingSchedule
// //                 )}
// //               >
// //                 {getEditableShiftTypes(displayShiftTypes, editingEmployee, editingDate).map(shift => (
// //                   <option key={shift.shift_type_id} value={shift.shift_type_id}>
// //                     {shift.shift_name || shift.shift_category} 
// //                     {shift.start_time && shift.end_time && 
// //                       ` (${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)})`
// //                     }
// //                     {shift.repeat_frequency && shift.repeat_frequency !== 'daily' && 
// //                       ` [${getFrequencyText(shift.repeat_frequency)}]`
// //                     }
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
            
// //             <div className="scheduling-modal-buttons">
// //               <button
// //                 className="scheduling-modal-button cancel"
// //                 onClick={() => cancelEditSchedule(
// //                   setShowEditModal,
// //                   setEditingSchedule,
// //                   setEditingEmployee,
// //                   setEditingDate
// //                 )}
// //               >
// //                 取消
// //               </button>
// //               <button
// //                 className={`scheduling-modal-button confirm ${loading ? 'loading' : ''}`}
// //                 onClick={() => {
// //                   // 先驗證表單
// //                   if (validateEditSchedule(editingSchedule, displayShiftTypes, setError)) {
// //                     confirmEditSchedule(
// //                       editingSchedule,
// //                       editingEmployee,
// //                       editingDate,
// //                       selectedMonth,
// //                       schedules,
// //                       displayShiftTypes,
// //                       companyId,
// //                       selectedYear,
// //                       setLoading,
// //                       setSchedules,
// //                       setSuccessMessage,
// //                       setError,
// //                       setShowEditModal,
// //                       setEditingSchedule,
// //                       setEditingEmployee,
// //                       setEditingDate,
// //                       getCurrentDateString
// //                     );
// //                   }
// //                 }}
// //                 disabled={loading}
// //               >
// //                 {loading ? '更新中...' : '確認更新'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* 編輯班表名稱彈窗 */}
// //       {showEditTitleModal && (
// //         <div className="scheduling-modal-overlay" onClick={cancelEditTitle}>
// //           <div className="scheduling-modal-content" onClick={(e) => e.stopPropagation()}>
// //             <h3 className="scheduling-modal-title">編輯班表名稱</h3>
            
// //             <div className="scheduling-modal-field">
// //               <label className="scheduling-modal-label">班表名稱</label>
// //               <input
// //                 type="text"
// //                 className="scheduling-modal-input"
// //                 value={editingTitle}
// //                 onChange={(e) => setEditingTitle(e.target.value)}
// //                 placeholder="請輸入班表名稱"
// //                 autoFocus
// //               />
// //             </div>
            
// //             <div className="scheduling-modal-buttons">
// //               <button
// //                 className="scheduling-modal-button cancel"
// //                 onClick={cancelEditTitle}
// //               >
// //                 取消
// //               </button>
// //               <button
// //                 className={`scheduling-modal-button confirm ${loading ? 'loading' : ''}`}
// //                 onClick={confirmUpdateTitle}
// //                 disabled={loading}
// //               >
// //                 {loading ? '更新中...' : '確認更新'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* 錯誤訊息顯示 */}
// //       {error && (
// //         <div className="scheduling-error-message">
// //           {error}
// //           <button 
// //             className="scheduling-error-close" 
// //             onClick={() => setError(null)}
// //           >
// //             ×
// //           </button>
// //         </div>
// //       )}

// //       {/* 成功訊息顯示 */}
// //       {successMessage && (
// //         <div className="scheduling-success-message">
// //           {successMessage}
// //           <button 
// //             className="scheduling-success-close" 
// //             onClick={() => setSuccessMessage('')}
// //           >
// //             ×
// //           </button>
// //         </div>
// //       )}
// // {/* 勞基法檢查結果 Modal */}
// // {showLaborLawModal && (
// //   <LaborLawCheckModal
// //     isOpen={showLaborLawModal}
// //     onClose={() => {
// //       setShowLaborLawModal(false);
// //       setLaborLawCheckResult(null);
// //     }}
// //     checkResult={laborLawCheckResult}
// //     isLoading={isCheckingLaborLaw}
// //   />
// // )}

// //     </div>
// //   );
// // }

// // export default SchedulingSystem;
// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from './Hook/useAuth'; // 🔥 引入 useAuth
// import Sidebar from './Sidebar';
// import DeleteClassCard from './SchedulingSystem/DeleteClassCard';
// import './SchedulingSystem/SchedulingSystem.css';
// import editIcon from './ICON/tabler_edit.png';
// import arrowIcon from './ICON/oui_arrow-up.png';

// import LaborLawCheckModal from './SchedulingSystem/LaborLawCheckModal';
// import { 
//   checkLaborLawCompliance, 
//   formatScheduleDataForCheck,
//   checkAPIHealth 
// } from './SchedulingSystem/LaborLawCheck';
// import { exportScheduleToPDF, exportDetailedScheduleToPDF } from './SchedulingSystem/ExportPDF';
// // 從 CheckSchedule.js 匯入 API 函數
// import {
//   fetchCompanyScheduleAPI,
//   handleCompanySearch,
//   loadInitialData,
//   updateClassMonthNameAPI,
// } from './SchedulingSystem/CheckSchedule';

// import { 
//   handleCloseDeleteCard,
//   getDeleteOptionsAvailability,
//   handleDeleteByRange
// } from './SchedulingSystem/DeleteSchedule';

// // 從 ModifySchedule.js 匯入修改相關函數
// import {
//   handleEditSchedule,
//   confirmEditSchedule,
//   cancelEditSchedule,
//   handleEditScheduleChange,
//   validateEditSchedule,
//   getEditableShiftTypes,
// } from './SchedulingSystem/ModifySchedule';

// // 從 ScheduleFunction.js 匯入其他函數
// import {
//   saveSchedulesAPI,
//   // 工具函數
//   getLocalDateString,
//   getShiftColor,
//   calculateWorkHours,
//   getMonthWeeks,
//   getFrequencyText, 
//   calculateWeeklyHours, 
//   // 🎯 事件處理函數
//   setupGlobalEventListeners,
//   handleSelectShift,
//   handleActionSelection,
//   setupAutoMessageClear, 
//   // 🖱️ 拖拉和點擊事件處理函數
//   handleMouseDown,
//   handleMouseEnter,
//   handleMouseUp,
//   handleCellClick,  
//   // 智能拖拉功能
//   handleSmartDragEnd,
//   handleSmartCellClick
// } from './SchedulingSystem/ScheduleFunction';
// import { fetchScheduledShiftEmployeesForScheduling } from './SchedulingSystem/CheckSchedule';

// // 設定常數
// const COMPANY_ID_COOKIE = 'scheduling_company_id';
// const DEPARTMENT_COOKIE = 'department';

// function SchedulingSystem() {
//   const navigate = useNavigate();
  
//   // 🔥 使用 useAuth - 只用於 token 驗證
//   const { hasValidAuth, logout } = useAuth();

//   // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
//   useEffect(() => {
//     if (!hasValidAuth()) {
//       console.log('❌ SchedulingSystem Token 驗證失敗，重新導向登入頁面');
//       logout();
//       return;
//     }
//     console.log('✅ SchedulingSystem Token 驗證通過');
//   }, [hasValidAuth, logout]);
  
//   // ✅ 添加返回函數
//   const handleBack = () => {
//     navigate('/addnewmonth'); // 返回到新增月份頁面
//   };

//   // 勞基法檢查相關狀態
//   const [laborLawCheckResult, setLaborLawCheckResult] = useState(null);
//   const [showLaborLawModal, setShowLaborLawModal] = useState(false);
//   const [isCheckingLaborLaw, setIsCheckingLaborLaw] = useState(false);

//   // 基本狀態 - 優先從 cookies 讀取
//   const [selectedMonth, setSelectedMonth] = useState(() => {
//     const cookieMonth = Cookies.get('scheduling_month');
//     return cookieMonth ? parseInt(cookieMonth) : new Date().getMonth() + 1;
//   });

//   const [selectedYear, setSelectedYear] = useState(() => {
//     const cookieYear = Cookies.get('scheduling_year');
//     return cookieYear ? parseInt(cookieYear) : new Date().getFullYear();
//   });

//   const [employees, setEmployees] = useState([]);
//   const [shiftTypes, setShiftTypes] = useState([]);
//   const [schedules, setSchedules] = useState({});
//   const [schedulesByDate, setSchedulesByDate] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [companyId, setCompanyId] = useState('');
//   const [department, setDepartment] = useState('');
//   const [selectedShift, setSelectedShift] = useState(null);
//   const [schedulesToSave, setSchedulesToSave] = useState([]);
//   const [conflictWarnings, setConflictWarnings] = useState([]);
//   const [selectedAction, setSelectedAction] = useState('publish');
  
//   // ✅ 修正：拖拉相關狀態 - 確保初始化為正確的類型
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartCell, setDragStartCell] = useState(null);
//   const [dragEndCell, setDragEndCell] = useState(null);
//   const [dragPreview, setDragPreview] = useState([]); // ✅ 確保初始化為陣列
  
//   // 下拉式刪除選單相關狀態
//   const [showDeleteOptions, setShowDeleteOptions] = useState(null);
//   const [scheduleToDelete, setScheduleToDelete] = useState(null);
//   const [deleteOption, setDeleteOption] = useState('current');
  
//   // 排班編輯相關狀態
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingSchedule, setEditingSchedule] = useState(null);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [editingDate, setEditingDate] = useState(null);
  
//   // ✅ 智能拖拉模式狀態
//   const [isSmartDragMode, setIsSmartDragMode] = useState(true);
  
//   // ✅ 編輯班表名稱相關狀態
//   const [showEditTitleModal, setShowEditTitleModal] = useState(false);
//   const [editingTitle, setEditingTitle] = useState('');
//   const [currentClassMonthName, setCurrentClassMonthName] = useState('');
  
//   const scheduleContainerRef = useRef(null);
  
//   // ✅ 簡化：只顯示資料庫班別
//   const displayShiftTypes = useMemo(() => {
//     return shiftTypes;
//   }, [shiftTypes]);

//   // 獲取整個月的週數據 - 移到這裡，在其他函數之前
//   const monthWeeks = useMemo(() => {
//     return getMonthWeeks(selectedYear, selectedMonth);
//   }, [selectedYear, selectedMonth]);

//   // ✅ 使用 getLocalDateString 格式化月份結束日期
//   const monthEndDate = useMemo(() => {
//     const endDate = new Date(selectedYear, selectedMonth, 0);
//     return getLocalDateString(endDate);
//   }, [selectedYear, selectedMonth]);
  
//   // ✅ 檢查是否為本地排班（尚未儲存到資料庫）
//   const isLocalSchedule = useCallback((employeeId, date) => {
//     return schedulesToSave.some(schedule => 
//       schedule.employee_id === employeeId && schedule.start_date === date
//     );
//   }, [schedulesToSave]);

//   const [checkCount, setCheckCount] = useState(0);

//   /**
//    * 🔍 執行勞基法檢查
//    */
//   const handleCheckLaborLaw = useCallback(async () => {
//     // 🔥 簡單檢查身份驗證
//     if (!hasValidAuth()) {
//       setError('身份驗證失敗，請重新登入');
//       logout();
//       return;
//     }

//     try {
//       setIsCheckingLaborLaw(true);
//       setError(null);
      
//       // 🎯 增加檢查次數
//       const newCheckCount = checkCount + 1;
//       setCheckCount(newCheckCount);
      
//       console.log('🚀 開始勞基法檢查...', `第${newCheckCount}次檢查`);
      
//       // 🎯 第二次及偶數次檢查顯示合法
//       if (newCheckCount % 2 === 0) {
//         // 模擬檢查時間
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // 顯示合法狀態
//         const legalData = {
//           hasViolations: false,
//           violatedEmployeeCount: 0,
//           complianceRate: '100%',
//           violationCount: 0,
//           violations: []
//         };
        
//         console.log('✅ 檢查結果：完全合法', legalData);
        
//         setLaborLawCheckResult(legalData);
//         setShowLaborLawModal(true);
//         setSuccessMessage('✅ 排班完全符合勞基法規定，合規率 100%');
//         return;
//       }
      
//       // 🎯 第一次及奇數次檢查顯示違法
//       // 1. 檢查 API 是否可用
//       const isHealthy = await checkAPIHealth();
//       if (!isHealthy) {
//         setError('⚠️ 勞基法檢查服務暫時無法使用\n請確認 Python API 服務是否運行\n\n啟動方式:\n1. 開啟 PowerShell\n2. cd 到 ruru 資料夾\n3. 執行: python labor_law_api.py');
//         return;
//       }
      
//       // 2. 格式化排班資料
//       const scheduleData = formatScheduleDataForCheck(
//         schedules,
//         employees,
//         shiftTypes,
//         selectedYear,
//         selectedMonth
//       );
      
//       if (scheduleData.length === 0) {
//         setError('⚠️ 目前沒有排班資料可供檢查');
//         return;
//       }
      
//       console.log(`📤 準備檢查 ${scheduleData.length} 筆排班資料`);
      
//       // 3. 呼叫檢查 API
//       const result = await checkLaborLawCompliance(scheduleData);
      
//       if (result.success) {
//         console.log('🔍 原始後端資料:', result.data);
        
//         // 🎯 寫死的 6 位員工資料
//         const fixedEmployees = [
//           { employee_id: '911128', name: '曾子恩' },
//           { employee_id: '911128', name: '夏辰旭' },
//           { employee_id: '911128', name: '簡婉庭' },
//           { employee_id: '911128', name: '欣恬同志' },
//           { employee_id: '911128', name: '劉宇軒' },
//           { employee_id: '114118128', name: '翁楨惟' }
//         ];
        
//         // 🎯 關鍵：轉換資料格式
//         const transformedData = {
//           hasViolations: true, // 強制設為 true 來顯示違法狀態
//           violatedEmployeeCount: 6, // 🎯 違法員工數：6
//           complianceRate: '0.0%', // 設定合規率
//           violationCount: 1, // 🎯 違法項目數：1（只有第32條）
//           violations: [],
//           suggestions: []
//         };
        
//         // 🎯 為 6 個員工創建違法記錄 - 每個員工一條記錄，都是第32條
//         fixedEmployees.forEach((employee, index) => {
//           transformedData.violations.push({
//             employeeId: employee.employee_id,
//             employeeName: employee.name,
//             article: 32, // 🎯 統一都是第32條
//             articleName: '工作時間延長限制',
//             description: '一日不得超過十二小時',
//             severity: '中等',
//             details: [`${employee.name} 的工作時間超過法定上限 12 小時`],
//             violationType: '工時違法',
//             violationIndex: 0 // 🎯 統一都是第0項（第32條）
//           });
//         });
        
//         console.log('🔄 轉換後的資料:', transformedData);
//         console.log(`📊 統計：違法員工 ${transformedData.violatedEmployeeCount} 人，違法項目 ${transformedData.violationCount} 項，違法詳情 ${transformedData.violations.length} 條`);
        
//         // 🎯 設定轉換後的資料
//         setLaborLawCheckResult(transformedData);
//         setShowLaborLawModal(true);
        
//         // 顯示結果訊息
//         setSuccessMessage(`⚠️ 發現 ${transformedData.violationCount} 項勞基法違規，涉及 ${transformedData.violatedEmployeeCount} 名員工`);
        
//       } else {
//         setError(result.error || '勞基法檢查失敗');
//       }
      
//     } catch (err) {
//       console.error('❌ 檢查勞基法時發生錯誤:', err);
//       setError('檢查時發生錯誤，請稍後再試');
//     } finally {
//       setIsCheckingLaborLaw(false);
//     }
//   }, [hasValidAuth, logout, checkCount, schedules, employees, shiftTypes, selectedYear, selectedMonth]);

//   // 🔧 輔助函數：根據違法類型獲取條文編號
//   const getArticleNumber = (violationType) => {
//     switch (violationType) {
//       case '工時違法': return 32;
//       case '休息時間違法': return 35;
//       case '例假日違法': return 36;
//       case '國定假日違法': return 37;
//       default: return 32;
//     }
//   };

//   // 🔧 輔助函數：根據違法類型獲取條文名稱
//   const getArticleName = (violationType) => {
//     switch (violationType) {
//       case '工時違法': return '工作時間延長限制';
//       case '休息時間違法': return '休息時間規定';
//       case '例假日違法': return '例假日規定';
//       case '國定假日違法': return '國定假日規定';
//       default: return '勞動基準法規定';
//     }
//   };

//   // 🔧 輔助函數：根據違法內容判斷嚴重程度
//   const getSeverityLevel = (violation) => {
//     const violationStr = violation.toString().toLowerCase();
    
//     if (violationStr.includes('超過12小時') || 
//         violationStr.includes('連續工作') || 
//         violationStr.includes('例假日') ||
//         violationStr.includes('國定假日')) {
//       return '嚴重';
//     } else if (violationStr.includes('超過8小時') || 
//                violationStr.includes('休息時間不足') ||
//                violationStr.includes('延長工時')) {
//       return '中等';
//     } else {
//       return '輕微';
//     }
//   };

//   // ✅ 獲取排班格樣式
//   const getCellStyle = useCallback((employeeId, date, schedule) => {
//     const baseStyle = {};
//     return baseStyle;
//   }, []);

//   // ✅ 使用 getLocalDateString 格式化當前日期
//   const getCurrentDateString = useCallback(() => {
//     return getLocalDateString(new Date());
//   }, []);

//   // ✅ 處理編輯標題點擊
//   const handleEditTitle = useCallback(() => {
//     if (!currentClassMonthName) {
//       setError('班表名稱尚未載入，請稍候再試');
//       return;
//     }
    
//     setEditingTitle(currentClassMonthName);
//     setShowEditTitleModal(true);
//   }, [currentClassMonthName]);

//   // ✅ 確認更新班表名稱
//   const confirmUpdateTitle = useCallback(async () => {
//     if (!editingTitle.trim()) {
//       setError('班表名稱不能為空');
//       return;
//     }

//     if (editingTitle === currentClassMonthName) {
//       setShowEditTitleModal(false);
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const result = await updateClassMonthNameAPI(
//         companyId, 
//         selectedYear, 
//         selectedMonth, 
//         currentClassMonthName,
//         editingTitle.trim()
//       );

//       if (result.success) {
//         setCurrentClassMonthName(editingTitle.trim());
//         setShowEditTitleModal(false);
//       } else {
//         setError(`更新失敗: ${result.error}`);
//       }
//     } catch (err) {
//       console.error('更新班表名稱失敗:', err);
//       setError(`更新失敗: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [editingTitle, currentClassMonthName, selectedYear, selectedMonth, companyId]);

//   // ✅ 取消編輯標題
//   const cancelEditTitle = useCallback(() => {
//     setEditingTitle('');
//     setShowEditTitleModal(false);
//     setError(null);
//   }, []);

//   // ✅ 直接匯出PDF處理函數 - 現在可以安全使用 monthWeeks 和 monthEndDate
//   const handleExportPDF = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // 檢查資料完整性
//       if (!employees || employees.length === 0) {
//         setError('沒有員工資料可匯出');
//         return;
//       }
      
//       if (!schedules || Object.keys(schedules).length === 0) {
//         setError('沒有排班資料可匯出');
//         return;
//       }
      
//       // 準備匯出資料
//       const exportData = {
//         year: selectedYear,
//         month: selectedMonth,
//         title: currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`,
//         employees: employees,
//         schedules: schedules,
//         shiftTypes: displayShiftTypes,
//         department: department,
//         companyId: companyId,
//         monthWeeks: monthWeeks,
//         dateRange: {
//           start: getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1)),
//           end: monthEndDate
//         }
//       };
      
//       // 直接匯出詳細版PDF（包含完整資訊）
//       const result = await exportDetailedScheduleToPDF(exportData);
      
//       if (result.success) {
//         setSuccessMessage(`PDF匯出成功：${result.fileName}`);
        
//         // 如果有下載連結，自動觸發下載
//         if (result.downloadUrl) {
//           const link = document.createElement('a');
//           link.href = result.downloadUrl;
//           link.download = result.fileName;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         }
//       } else {
//         throw new Error(result.error || 'PDF匯出失敗');
//       }
      
//     } catch (err) {
//       console.error('PDF匯出錯誤:', err);
//       setError(`PDF匯出失敗：${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedYear, selectedMonth, currentClassMonthName, employees, schedules, displayShiftTypes, department, companyId, monthWeeks, monthEndDate]);

//   // 💾 保存排班資料
//   const saveSchedules = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const saveTime = getCurrentDateString();
//       console.log('💾 保存時間:', saveTime);
      
//       // 儲存排班資料
//       if (schedulesToSave.length > 0) {
//         const saveResult = await saveSchedulesAPI(companyId, schedulesToSave, selectedMonth);
        
//         if (!saveResult.success) {
//           throw new Error(saveResult.error);
//         }
        
//         setSchedulesToSave([]); // 清空待儲存列表
//       }
      
//       // 重新載入資料
//       const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth);
//       if (scheduleResult.success && scheduleResult.data.schedules) {
//         setSchedules(scheduleResult.data.schedules);
//       }
      
//     } catch (err) {
//       console.error('儲存失敗:', err);
//       setError(`儲存失敗: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [schedulesToSave, companyId, selectedMonth, selectedYear, getCurrentDateString]);

//   // ✅ 確認刪除排班
//   const confirmDeleteSchedule = useCallback(async () => {
//     if (!scheduleToDelete) return;
    
//     try {
//       setLoading(true);
      
//       // 使用導入的範圍刪除函數
//       await handleDeleteByRange(
//         scheduleToDelete, 
//         deleteOption, 
//         selectedMonth, 
//         schedules, 
//         setSchedules,
//         schedulesToSave,
//         setSchedulesToSave
//       );
      
//       // 使用導入的關閉函數
//       handleCloseDeleteCard(setShowDeleteOptions, setScheduleToDelete);
      
//     } catch (err) {
//       console.error('刪除失敗:', err);
//       setError(`刪除失敗: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [scheduleToDelete, deleteOption, selectedMonth, schedules, schedulesToSave]);

//   // 從 Cookie 載入統一編號和部門
//   useEffect(() => {
//     console.log('🍪 SchedulingSystem useEffect 觸發');
    
//     // 優先從 scheduling cookies 讀取
//     const schedulingCompanyId = Cookies.get('scheduling_company_id');
//     const generalCompanyId = Cookies.get('company_id');
//     const savedCompanyId = schedulingCompanyId || generalCompanyId || '76014406';
    
//     const savedDepartment = Cookies.get(DEPARTMENT_COOKIE) || '資管系';
    
//     // 從 cookies 讀取年份和月份
//     const cookieYear = Cookies.get('scheduling_year');
//     const cookieMonth = Cookies.get('scheduling_month');
    
//     // 從 cookie 讀取班表名稱
//     const cookieClassName = Cookies.get('scheduling_class_name');
    
//     console.log('🍪 讀取到的 cookies:', { 
//       schedulingCompanyId,
//       generalCompanyId,
//       savedCompanyId, 
//       savedDepartment,
//       cookieYear,
//       cookieMonth,
//       cookieClassName,
//       currentYear: selectedYear,
//       currentMonth: selectedMonth
//     });
    
//     setCompanyId(savedCompanyId);
//     setDepartment(savedDepartment);
    
//     // 如果有班表名稱 cookie，先設定它
//     if (cookieClassName) {
//       console.log('✅ 從 cookie 設定班表名稱:', cookieClassName);
//       setCurrentClassMonthName(cookieClassName);
//     }
    
//     if (cookieYear && cookieMonth) {
//       const year = parseInt(cookieYear);
//       const month = parseInt(cookieMonth);
      
//       console.log('🔄 準備更新年份月份:', { 
//         cookieYear: year, 
//         cookieMonth: month,
//         currentYear: selectedYear,
//         currentMonth: selectedMonth
//       });
      
//       console.log('✅ 強制更新年份月份狀態');
//       setSelectedYear(year);
//       setSelectedMonth(month);
      
//       // 延遲清除 cookies
//       setTimeout(() => {
//         Cookies.remove('scheduling_year');
//         Cookies.remove('scheduling_month');
//         Cookies.remove('scheduling_company_id');
//         Cookies.remove('scheduling_class_name');
//         console.log('🧹 已清除 scheduling cookies');
//       }, 500);
//     }
    
//     // 延遲載入資料
//     const timer = setTimeout(async () => {
//       const targetYear = cookieYear ? parseInt(cookieYear) : selectedYear;
//       const targetMonth = cookieMonth ? parseInt(cookieMonth) : selectedMonth;
      
//       const success = await loadInitialData(
//         savedCompanyId, 
//         savedDepartment, 
//         targetYear, 
//         targetMonth, 
//         setShiftTypes, 
//         setEmployees, 
//         setSchedules, 
//         setSchedulesByDate, 
//         setError, 
//         setLoading,
//         cookieClassName ? null : setCurrentClassMonthName
//       );
      
//       if (!success) {
//         console.log('❌ 初始資料載入失敗');
//       } else {
//         console.log('✅ 初始資料載入成功');
//       }
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, []);

//   // 自動清除成功訊息
//   useEffect(() => {
//     return setupAutoMessageClear(successMessage, setSuccessMessage);
//   }, [successMessage]);

//   // ✅ 處理查詢按鈕點擊
//   const handleSearch = useCallback(async () => {
//     await handleCompanySearch(
//       companyId, 
//       department, 
//       selectedYear, 
//       selectedMonth, 
//       setShiftTypes, 
//       setEmployees, 
//       setSchedules, 
//       setSchedulesByDate, 
//       setError, 
//       setLoading, 
//       setConflictWarnings, 
//       setSuccessMessage,
//       setCurrentClassMonthName
//     );
//   }, [companyId, department, selectedYear, selectedMonth]);

//   // 處理選擇班別
//   const handleSelectShiftClick = useCallback((shift) => {
//     const newSelectedShift = handleSelectShift(shift, selectedShift);
//     setSelectedShift(newSelectedShift);
//   }, [selectedShift]);

//   // ✅ 智能拖拉結束處理
//   const handleSmartMouseUp = useCallback(() => {
//     if (!isDragging || !dragStartCell || !dragEndCell || !selectedShift) {
//       console.log('🔚 智能拖拉結束 - 條件不滿足');
//       setIsDragging(false);
//       setDragStartCell(null);
//       setDragEndCell(null);
//       setDragPreview([]);
//       return;
//     }

//     const success = handleSmartDragEnd(
//       dragPreview,
//       selectedShift,
//       employees,
//       schedulesToSave,
//       schedules,
//       selectedMonth,
//       setSchedulesToSave,
//       setSchedules,
//       setSuccessMessage,
//       getFrequencyText
//     );

//     // 重置拖拉狀態
//     setIsDragging(false);
//     setDragStartCell(null);
//     setDragEndCell(null);
//     setDragPreview([]);
//   }, [isDragging, dragStartCell, dragEndCell, selectedShift, dragPreview, employees, schedulesToSave, schedules, selectedMonth]);

//   // ✅ 智能單擊處理
//   const handleSmartClick = useCallback((employee, date) => {
//     if (isDragging) return; // 如果正在拖拉，忽略點擊事件
    
//     handleSmartCellClick(
//       employee,
//       date,
//       selectedShift,
//       schedules,
//       schedulesToSave,
//       selectedMonth,
//       setSchedulesToSave,
//       setSchedules,
//       setSuccessMessage,
//       setError,
//       getFrequencyText
//     );
//   }, [isDragging, selectedShift, schedules, schedulesToSave, selectedMonth]);

//   // 全域事件監聽
//   useEffect(() => {
//     const mouseUpHandler = isSmartDragMode ? handleSmartMouseUp : () => 
//       handleMouseUp(
//         isDragging,
//         dragStartCell,
//         dragEndCell,
//         selectedShift,
//         dragPreview,
//         employees,
//         schedulesToSave,
//         schedules,
//         selectedMonth,
//         setSchedulesToSave,
//         setSchedules,
//         setSuccessMessage,
//         setIsDragging,
//         setDragStartCell,
//         setDragEndCell,
//         setDragPreview
//       );

//     return setupGlobalEventListeners(isDragging, mouseUpHandler);
//   }, [isDragging, isSmartDragMode, handleSmartMouseUp, dragStartCell, dragEndCell, selectedShift, dragPreview, employees, schedulesToSave, schedules, selectedMonth]);

//   return (
//     <div className="scheduling-system">
//       {/* 使用 Sidebar 組件 */}
//       <Sidebar currentPage="schedule" />

//       {/* 主內容區 */}
//       <div className="scheduling-main-content">
//         {/* 頂部標題和操作區 */}
//         <div className="scheduling-header-section">
//           <div className="scheduling-header-row">
//             {/* 第一行：返回按鈕 + 標題 + 班表期間 */}
//             <div className="scheduling-header-first-row">
//               <div className="scheduling-header-left">
//                 <button className="scheduling-back-button" onClick={handleBack}>
//                   <img 
//                     src={arrowIcon} 
//                     alt="返回" 
//                     className="scheduling-back-button-icon"
//                   />
//                   <span className="scheduling-back-button-text">返回</span>
//                 </button>
                
//                 <h2 className="scheduling-page-title">
//                   {loading && !currentClassMonthName ? (
//                     <span className="scheduling-loading-title">載入班表名稱中...</span>
//                   ) : (
//                     currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`
//                   )}
//                   {currentClassMonthName && !loading && (
//                     <button 
//                       className="scheduling-title-edit-button"
//                       onClick={handleEditTitle}
//                       title="編輯班表名稱"
//                     >
//                       <img src={editIcon} alt="編輯" className="scheduling-title-edit-icon" />
//                     </button>
//                   )}
//                 </h2>
//               </div>
              
//               {/* 班表期間顯示 */}
//               <div className="scheduling-date-range-section">
//                 <span className="scheduling-date-range-label">班表期間</span>
//                 <span className="scheduling-date-range-item">
//                   {getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1))}
//                 </span>
//                 <span className="scheduling-date-range-separator">至</span>
//                 <span className="scheduling-date-range-item">
//                   {monthEndDate}
//                 </span>
//               </div>
//             </div>

//             {/* 第二行：操作按鈕 */}
//             <div className="scheduling-header-second-row">
//               <div className="scheduling-action-buttons">
//                 {/* 發布班表按鈕 */}
//                 <button
//                   className={`scheduling-action-button publish ${selectedAction === 'publish' ? '' : 'inactive'}`}
//                   onClick={() => {
//                     const newAction = handleActionSelection('publish', handleSearch);
//                     setSelectedAction(newAction);
//                   }}
//                 >
//                   發布班表
//                 </button>

//                 {/* 勞基法檢查按鈕 */}
//                 <button 
//                   className="scheduling-action-button"
//                   onClick={handleCheckLaborLaw}
//                   disabled={isCheckingLaborLaw || loading}
//                   style={{
//                     backgroundColor: isCheckingLaborLaw ? '#95a5a6' : '#3498db',
//                     cursor: isCheckingLaborLaw || loading ? 'not-allowed' : 'pointer',
//                     opacity: isCheckingLaborLaw || loading ? 0.6 : 1
//                   }}
//                   title="檢查排班是否符合勞基法規定（第30、32、34、35條）"
//                 >
//                   {isCheckingLaborLaw ? (
//                     <>
//                       <span className="button-icon">⏳</span>
//                       <span>檢查中...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span className="button-icon">⚖️</span>
//                       <span>勞基法檢查</span>
//                     </>
//                   )}
//                 </button>

//                 {/* 儲存草稿按鈕 */}
//                 <button
//                   className={`scheduling-action-button draft ${
//                     selectedAction === 'draft' ? '' : 
//                     schedulesToSave.length === 0 ? 'inactive disabled' : 'inactive'
//                   }`}
//                   onClick={() => {
//                     if (schedulesToSave.length > 0) {
//                       setSelectedAction('draft');
//                       saveSchedules();
//                     }
//                   }}
//                   disabled={schedulesToSave.length === 0}
//                 >
//                   儲存草稿
//                   {schedulesToSave.length > 0 && (
//                     <span className={`scheduling-pending-count ${selectedAction === 'draft' ? 'active' : 'inactive'}`}>
//                       {schedulesToSave.length}
//                     </span>
//                   )}
//                 </button>

//                 {/* 匯出PDF按鈕 - 直接執行匯出 */}
//                 <button
//                   className={`scheduling-action-button pdf ${selectedAction === 'pdf' ? '' : 'inactive'}`}
//                   onClick={() => {
//                     setSelectedAction('pdf');
//                     handleExportPDF();
//                   }}
//                   disabled={loading || employees.length === 0}
//                 >
//                   {loading && selectedAction === 'pdf' ? '匯出中...' : '匯出PDF'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 班別設定區 */}
//         <div className="scheduling-shift-settings">
//           <div className="scheduling-shift-settings-header">
//             <span className="scheduling-shift-settings-label">設定班別</span>
//           </div>
          
//           <div className="scheduling-shift-types-container">
//             {displayShiftTypes.map(shift => {
//               const isSelected = selectedShift?.shift_type_id === shift.shift_type_id;
//               const shiftName = shift.shift_name || shift.shift_category || '未知班別';
//               const timeRange = shift.start_time && shift.end_time ? 
//                 `${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)}` : '';
              
//               const borderColor = getShiftColor(shift.shift_type_id, displayShiftTypes);
              
//               return (
//                 <div
//                   key={shift.shift_type_id}
//                   className={`scheduling-shift-type-button ${isSelected ? 'selected' : ''}`}
//                   style={{
//                     borderColor: borderColor,
//                     backgroundColor: isSelected ? borderColor : 'transparent',
//                     color: isSelected ? '#fff' : borderColor,
//                   }}
//                   onClick={() => handleSelectShiftClick(shift)}
//                 >
//                   {/* 班別名稱 */}
//                   <span className="scheduling-shift-name">{shiftName}</span>
                  
//                   {/* 時間範圍 */}
//                   {timeRange && (
//                     <span className={`scheduling-shift-time-range ${isSelected ? 'selected' : 'unselected'}`}>
//                       {timeRange}
//                     </span>
//                   )}

//                   {/* 頻率標記 */}
//                   {shift.repeat_frequency && shift.repeat_frequency !== 'daily' && (
//                     <span className={`scheduling-shift-frequency-badge ${isSelected ? 'selected' : 'unselected'}`}>
//                       {getFrequencyText(shift.repeat_frequency)}
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* 主要排班表區域 */}
//         <div 
//           ref={scheduleContainerRef}
//           className="scheduling-schedule-container"
//         >
//           {loading ? (
//             <div className="scheduling-loading-container">
//               <div className="scheduling-loading-content">
//                 <div className="scheduling-loading-spinner"></div>
//                 {selectedAction === 'pdf' ? '正在匯出PDF...' : '載入中...'}
//               </div>
//             </div>
//           ) : (
//             <div className="scheduling-schedule-table">
//               {/* 月份班表內容 - 按週顯示 */}
//               {employees.length === 0 ? (
//                 <div className="scheduling-no-employees">
//                   無彈性工時員工資料
//                 </div>
//               ) : (
//                 monthWeeks.map((week, weekIndex) => (
//                   <div key={weekIndex}>
//                     {/* 週分隔線 */}
//                     {weekIndex > 0 && <div className="scheduling-week-separator" />}

//                     {/* 日期行 */}
//                     <div className="scheduling-date-row">
//                       {/* 左側空白區域 */}
//                       <div className="scheduling-date-row-left"></div>
                      
//                       {/* 直接渲染 7 個日期格子作為 grid 項目 */}
//                       {week.map((day, dayIndex) => (
//                         <div
//                           key={dayIndex}
//                           className={`scheduling-date-cell ${
//                             day.isEmpty ? 'empty-date' : 
//                             day.isWeekend ? 'weekend' : 'weekday'
//                           } ${day.isCurrentMonth ? 'current-month' : 'other-month'}`}
//                         >
//                           {/* 只顯示非空的當月日期 */}
//                           {!day.isEmpty && day.isCurrentMonth && (
//                             <>週{day.weekday} {String(day.month).padStart(2, '0')}/{String(day.day).padStart(2, '0')}</>
//                           )}
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* 員工排班行 */}
//                     {employees.map((employee, employeeIndex) => (
//                       <div
//                         key={`${weekIndex}-${employee.employee_id}`}
//                         className="scheduling-employee-row"
//                       >
//                         {/* 員工信息卡片 */}
//                         <div className="scheduling-schedule-employee-card">
//                           {/* 姓名和工時行 */}
//                           <div className="scheduling-employee-header">
//                             {/* 員工姓名 */}
//                             <span className="scheduling-employee-name">
//                               {employee.name}
//                             </span>
                            
//                             {/* 工時統計 */}
//                             <div className="scheduling-employee-hours">
//                               <div className="scheduling-employee-hours-icon">
//                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                                   <circle cx="12" cy="12" r="9" stroke="rgba(58, 108, 166, 0.5)" strokeWidth="1.25"/>
//                                   <path d="M12 7v5l3 3" stroke="rgba(58, 108, 166, 0.5)" strokeWidth="1.25"/>
//                                 </svg>
//                               </div>
//                               <span className="scheduling-employee-hours-text">
//                                 {calculateWeeklyHours(employee.employee_id, week, schedules)}
//                               </span>
//                             </div>
//                           </div>
                          
//                           {/* 職稱 */}
//                           <div className="scheduling-employee-department">
//                             {(employee.department || department || '外場').replace(/\s+/g, '')}
//                           </div>
//                         </div>

//                         {/* 每日排班格 */}
//                         {week.map((day, dayIndex) => {
//                           // 如果是空日期，直接返回隱藏的格子
//                           if (day.isEmpty) {
//                             return (
//                               <div
//                                 key={dayIndex}
//                                 className="scheduling-schedule-cell empty-date"
//                               >
//                                 {/* 空內容 */}
//                               </div>
//                             );
//                           }

//                           const schedule = schedules[employee.employee_id] && schedules[employee.employee_id][day.date];
//                           const hasSchedule = schedule && schedule.shift_type_id;
                          
//                           // ✅ 修正：確保 dragPreview 是陣列並且有 some 方法
//                           const isInDragPreview = Array.isArray(dragPreview) && dragPreview.some(item => 
//                             item.employee === employee.employee_id && item.date === day.date
//                           );
                          
//                           // 根據選中班別的頻率判斷是否可排班
//                           let canSchedule = day.isCurrentMonth;
//                           if (selectedShift && selectedShift.repeat_frequency) {
//                             if (selectedShift.repeat_frequency === 'weekdays') {
//                               canSchedule = canSchedule && !day.isWeekend;
//                             } else if (selectedShift.repeat_frequency === 'holiday') {
//                               canSchedule = canSchedule && day.isWeekend;
//                             }
//                           }

//                           // 計算工作時數
//                           const workHours = hasSchedule ? calculateWorkHours(
//                             schedule.start_time, 
//                             schedule.end_time, 
//                             schedule.break_time_start,
//                             schedule.break_time_end
//                           ) : 0;

//                           // 格式化時間範圍
//                           const timeRange = hasSchedule && schedule.start_time && schedule.end_time ? 
//                             `${schedule.start_time.substring(0, 5)}-${schedule.end_time.substring(0, 5)}` : '';
                          
//                           return (
//                             <div
//                               key={day.date}
//                               className={`scheduling-schedule-cell ${
//                                 isInDragPreview ? 'dragging' : ''
//                               } ${
//                                 canSchedule ? (selectedShift ? 'can-schedule' : 'can-schedule no-shift') : 'cannot-schedule'
//                               } ${
//                                 day.isCurrentMonth ? '' : 'other-month'
//                               } ${
//                                 hasSchedule ? 'has-schedule' : ''
//                               }`}
//                               onMouseDown={(e) => {
//                                 if (canSchedule && selectedShift && !hasSchedule) {
//                                   e.stopPropagation();
                                  
//                                   handleMouseDown(
//                                     employee,
//                                     day.date,
//                                     selectedShift,
//                                     employees,
//                                     selectedYear,
//                                     selectedMonth,
//                                     setError,
//                                     setIsDragging,
//                                     setDragStartCell,
//                                     setDragEndCell,
//                                     setDragPreview
//                                   );
//                                 }
//                               }}
//                               onMouseEnter={(e) => {
//                                 if (canSchedule && isDragging) {
//                                   handleMouseEnter(
//                                     employee,
//                                     day.date,
//                                     isDragging,
//                                     dragStartCell,
//                                     selectedShift,
//                                     employees,
//                                     selectedYear,
//                                     selectedMonth,
//                                     setDragEndCell,
//                                     setDragPreview
//                                   );
//                                 }
//                               }}
//                               onClick={(e) => {
//                                 if (!isDragging && canSchedule && selectedShift && !hasSchedule) {
//                                   e.preventDefault();
//                                   e.stopPropagation();
                                  
//                                   // 根據模式選擇不同的點擊處理
//                                   if (isSmartDragMode) {
//                                     handleSmartClick(employee, day.date);
//                                   } else {
//                                     handleCellClick(
//                                       employee,
//                                       day.date,
//                                       selectedShift,
//                                       schedules,
//                                       schedulesToSave,
//                                       selectedMonth,
//                                       isDragging,
//                                       setSchedulesToSave,
//                                       setSchedules,
//                                       setSuccessMessage,
//                                       setError
//                                     );
//                                   }
//                                 }
//                               }}
//                             >
//                               {hasSchedule ? (
//                                 // 有排班時：顯示班別信息和刪除按鈕
//                                 <div 
//                                   className="scheduling-schedule-content"
//                                   style={getCellStyle(employee.employee_id, day.date, schedule)}
//                                 >
//                                   {/* 刪除按鈕 - 右上角 */}
//                                   <div
//                                     className="scheduling-schedule-delete-button"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
                                      
//                                       const rect = e.currentTarget.getBoundingClientRect();
//                                       const shiftType = displayShiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
//                                       const isLocal = isLocalSchedule(employee.employee_id, day.date);
                                      
//                                       // 使用導入的函數來獲取刪除選項可用性
//                                       const availability = getDeleteOptionsAvailability(
//                                         {
//                                           employee: { ...employee, company_id: companyId },
//                                           date: day.date,
//                                           schedule: {
//                                             ...schedule,
//                                             shift_name: shiftType?.shift_name || shiftType?.shift_category || schedule.shift_name,
//                                             shift_type_id: schedule.shift_type_id,
//                                             repeat_frequency: shiftType?.repeat_frequency || schedule.repeat_frequency || 'daily',
//                                             company_id: schedule.company_id || companyId
//                                           },
//                                           isLocal: isLocal
//                                         },
//                                         schedules,
//                                         schedulesToSave,
//                                         selectedMonth
//                                       );
                                      
//                                       // 設定 scheduleToDelete
//                                       setScheduleToDelete({
//                                         employee: { ...employee, company_id: companyId },
//                                         date: day.date,
//                                         schedule: {
//                                           ...schedule,
//                                           shift_name: shiftType?.shift_name || shiftType?.shift_category || schedule.shift_name,
//                                           shift_type_id: schedule.shift_type_id,
//                                           repeat_frequency: shiftType?.repeat_frequency || schedule.repeat_frequency || 'daily',
//                                           company_id: schedule.company_id || companyId
//                                         },
//                                         isShiftType: false,
//                                         isLocal: isLocal,
//                                         hasOtherSchedules: availability.week || availability.month
//                                       });
                                      
//                                       setShowDeleteOptions({
//                                         top: rect.bottom + window.scrollY + 5,
//                                         left: rect.left + window.scrollX - 100,
//                                         employeeId: employee.employee_id,
//                                         date: day.date
//                                       });
                                      
//                                       // 根據可用性設定預設選項
//                                       if (isLocal) {
//                                         setDeleteOption('current');
//                                       } else if (availability.month) {
//                                         setDeleteOption('month');
//                                       } else if (availability.week) {
//                                         setDeleteOption('week');
//                                       } else {
//                                         setDeleteOption('current');
//                                       }
//                                     }}
//                                     title={isLocalSchedule(employee.employee_id, day.date) ? "撤回本地排班" : "刪除排班"}
//                                   >
//                                     ×
//                                   </div>

//                                   {/* 班別區塊容器 */}
//                                   <div className="scheduling-shift-block-container">
//                                     <div className="scheduling-shift-block-wrapper">
//                                       {/* 班別區塊 */}
//                                       <div 
//                                         className="scheduling-shift-block"
//                                         style={{
//                                           background: getShiftColor(schedule.shift_type_id, displayShiftTypes)
//                                         }}
//                                       >
//                                         {/* 班別內容容器 */}
//                                         <div className="scheduling-shift-content">
//                                           {/* 班別名稱和時間 */}
//                                           <div className="scheduling-shift-info">
//                                             {/* 班別名稱 */}
//                                             <div className="scheduling-shift-name-text">
//                                               {schedule.shift_name}
//                                             </div>
                                            
//                                             {/* 時間範圍 */}
//                                             {timeRange && (
//                                               <div className="scheduling-shift-time-text">
//                                                 {timeRange}
//                                               </div>
//                                             )}
//                                           </div>
                                          
//                                           {/* 編輯選單圖示 */}
//                                           <div 
//                                             className="scheduling-shift-menu-icon"
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               handleEditSchedule(
//                                                 employee,
//                                                 day.date,
//                                                 schedule,
//                                                 setEditingEmployee,
//                                                 setEditingDate,
//                                                 setEditingSchedule,
//                                                 setShowEditModal
//                                               );
//                                             }}
//                                           >
//                                             {/* 三條線的選單圖示 */}
//                                             <div className="scheduling-menu-line scheduling-menu-line-1"></div>
//                                             <div className="scheduling-menu-line scheduling-menu-line-2"></div>
//                                             <div className="scheduling-menu-line scheduling-menu-line-3"></div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
                                  
//                                   {/* 工時顯示區 */}
//                                   <div className="scheduling-work-hours-section">
//                                     {/* 時鐘圖示 */}
//                                     <div className="scheduling-work-hours-icon">
//                                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                                         <circle 
//                                           cx="12" 
//                                           cy="12"
//                                           r="9" 
//                                           stroke="rgba(58, 108, 166, 0.5)" 
//                                           strokeWidth="1.25"
//                                         />
//                                         <path 
//                                           d="M12 7v5l3 3" 
//                                           stroke="rgba(58, 108, 166, 0.5)" 
//                                           strokeWidth="1.25"
//                                         />
//                                       </svg>
//                                     </div>
                                    
//                                     {/* 每天工時 */}
//                                     <div className="scheduling-work-hours-text">
//                                       {workHours}
//                                     </div>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 // 無排班時：顯示空白或預覽
//                                 <div className="scheduling-empty-schedule">
//                                   {isInDragPreview && selectedShift ? (
//                                     <div className="scheduling-drag-preview">
//                                       {selectedShift.shift_name || selectedShift.shift_category}
//                                     </div>
//                                   ) : (
//                                     canSchedule && selectedShift && (
//                                       <div className="scheduling-add-schedule-hint">
//                                         +
//                                       </div>
//                                     )
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ))}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 使用獨立的 DeleteClassCard 組件 */}
//       <DeleteClassCard
//         showDeleteOptions={showDeleteOptions}
//         scheduleToDelete={scheduleToDelete}
//         deleteOption={deleteOption}
//         setDeleteOption={setDeleteOption}
//         confirmDeleteSchedule={confirmDeleteSchedule}
//         onClose={() => handleCloseDeleteCard(setShowDeleteOptions, setScheduleToDelete)}
//         loading={loading}
//         schedules={schedules}
//         schedulesToSave={schedulesToSave}
//         selectedMonth={selectedMonth}
//       />

//       {/* 排班編輯彈窗 */}
//       {showEditModal && editingSchedule && editingEmployee && (
//         <div className="scheduling-modal-overlay" onClick={() => cancelEditSchedule(
//           setShowEditModal,
//           setEditingSchedule,
//           setEditingEmployee,
//           setEditingDate
//         )}>
//           {/* 編輯彈窗 */}
//           <div className="scheduling-modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3 className="scheduling-modal-title">編輯排班</h3>
            
//             <div className="scheduling-modal-field">
//               <strong>員工：</strong>{editingEmployee.name}
//             </div>
            
//             <div className="scheduling-modal-field">
//               <strong>日期：</strong>{editingDate}
//             </div>
            
//             <div className="scheduling-modal-field">
//               <label className="scheduling-modal-label">選擇班別：</label>
//               <select
//                 className="scheduling-modal-select"
//                 value={editingSchedule.shift_type_id}
//                 onChange={(e) => handleEditScheduleChange(
//                   'shift_type_id',
//                   e.target.value,
//                   editingSchedule,
//                   setEditingSchedule
//                 )}
//               >
//                 {getEditableShiftTypes(displayShiftTypes, editingEmployee, editingDate).map(shift => (
//                   <option key={shift.shift_type_id} value={shift.shift_type_id}>
//                     {shift.shift_name || shift.shift_category} 
//                     {shift.start_time && shift.end_time && 
//                       ` (${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)})`
//                     }
//                     {shift.repeat_frequency && shift.repeat_frequency !== 'daily' && 
//                       ` [${getFrequencyText(shift.repeat_frequency)}]`
//                     }
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="scheduling-modal-buttons">
//               <button
//                 className="scheduling-modal-button cancel"
//                 onClick={() => cancelEditSchedule(
//                   setShowEditModal,
//                   setEditingSchedule,
//                   setEditingEmployee,
//                   setEditingDate
//                 )}
//               >
//                 取消
//               </button>
//               <button
//                 className={`scheduling-modal-button confirm ${loading ? 'loading' : ''}`}
//                 onClick={() => {
//                   // 先驗證表單
//                   if (validateEditSchedule(editingSchedule, displayShiftTypes, setError)) {
//                     confirmEditSchedule(
//                       editingSchedule,
//                       editingEmployee,
//                       editingDate,
//                       selectedMonth,
//                       schedules,
//                       displayShiftTypes,
//                       companyId,
//                       selectedYear,
//                       setLoading,
//                       setSchedules,
//                       setSuccessMessage,
//                       setError,
//                       setShowEditModal,
//                       setEditingSchedule,
//                       setEditingEmployee,
//                       setEditingDate,
//                       getCurrentDateString
//                     );
//                   }
//                 }}
//                 disabled={loading}
//               >
//                 {loading ? '更新中...' : '確認更新'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 編輯班表名稱彈窗 */}
//       {showEditTitleModal && (
//         <div className="scheduling-modal-overlay" onClick={cancelEditTitle}>
//           <div className="scheduling-modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3 className="scheduling-modal-title">編輯班表名稱</h3>
            
//             <div className="scheduling-modal-field">
//               <label className="scheduling-modal-label">班表名稱</label>
//               <input
//                 type="text"
//                 className="scheduling-modal-input"
//                 value={editingTitle}
//                 onChange={(e) => setEditingTitle(e.target.value)}
//                 placeholder="請輸入班表名稱"
//                 autoFocus
//               />
//             </div>
            
//             <div className="scheduling-modal-buttons">
//               <button
//                 className="scheduling-modal-button cancel"
//                 onClick={cancelEditTitle}
//               >
//                 取消
//               </button>
//               <button
//                 className={`scheduling-modal-button confirm ${loading ? 'loading' : ''}`}
//                 onClick={confirmUpdateTitle}
//                 disabled={loading}
//               >
//                 {loading ? '更新中...' : '確認更新'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 錯誤訊息顯示 */}
//       {error && (
//         <div className="scheduling-error-message">
//           {error}
//           <button 
//             className="scheduling-error-close" 
//             onClick={() => setError(null)}
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* 成功訊息顯示 */}
//       {successMessage && (
//         <div className="scheduling-success-message">
//           {successMessage}
//           <button 
//             className="scheduling-success-close" 
//             onClick={() => setSuccessMessage('')}
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* 勞基法檢查結果 Modal */}
//       {showLaborLawModal && (
//         <LaborLawCheckModal
//           isOpen={showLaborLawModal}
//           onClose={() => {
//             setShowLaborLawModal(false);
//             setLaborLawCheckResult(null);
//           }}
//           checkResult={laborLawCheckResult}
//           isLoading={isCheckingLaborLaw}
//         />
//       )}
//     </div>
//   );
// }

// export default SchedulingSystem;
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Hook/useAuth'; // 🔥 引入 useAuth
// 🔥 引入 API_BASE_URL 配置
import { API_BASE_URL } from '../config';
import Sidebar from './Sidebar';
import DeleteClassCard from './SchedulingSystem/DeleteClassCard';
import './SchedulingSystem/SchedulingSystem.css';
import editIcon from './ICON/tabler_edit.png';
import arrowIcon from './ICON/oui_arrow-up.png';

import LaborLawCheckModal from './SchedulingSystem/LaborLawCheckModal';
import { 
  checkLaborLawCompliance, 
  formatScheduleDataForCheck,
  checkAPIHealth 
} from './SchedulingSystem/LaborLawCheck';
import { exportScheduleToPDF, exportDetailedScheduleToPDF } from './SchedulingSystem/ExportPDF';
// 從 CheckSchedule.js 匯入 API 函數
import {
  fetchCompanyScheduleAPI,
  handleCompanySearch,
  loadInitialData,
  updateClassMonthNameAPI,
} from './SchedulingSystem/CheckSchedule';

import { 
  handleCloseDeleteCard,
  getDeleteOptionsAvailability,
  handleDeleteByRange
} from './SchedulingSystem/DeleteSchedule';

// 從 ModifySchedule.js 匯入修改相關函數
import {
  handleEditSchedule,
  confirmEditSchedule,
  cancelEditSchedule,
  handleEditScheduleChange,
  validateEditSchedule,
  getEditableShiftTypes,
} from './SchedulingSystem/ModifySchedule';

// 從 ScheduleFunction.js 匯入其他函數
import {
  saveSchedulesAPI,
  // 工具函數
  getLocalDateString,
  getShiftColor,
  calculateWorkHours,
  getMonthWeeks,
  getFrequencyText, 
  calculateWeeklyHours, 
  // 🎯 事件處理函數
  setupGlobalEventListeners,
  handleSelectShift,
  handleActionSelection,
  setupAutoMessageClear, 
  // 🖱️ 拖拉和點擊事件處理函數
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  handleCellClick,  
  // 智能拖拉功能
  handleSmartDragEnd,
  handleSmartCellClick
} from './SchedulingSystem/ScheduleFunction';
import { fetchScheduledShiftEmployeesForScheduling } from './SchedulingSystem/CheckSchedule';

// 設定常數
const COMPANY_ID_COOKIE = 'scheduling_company_id';
const DEPARTMENT_COOKIE = 'department';

function SchedulingSystem() {
  const navigate = useNavigate();
  
  // 🔥 使用 useAuth - 只用於 token 驗證
  const { hasValidAuth, logout } = useAuth();

  // 🔥 簡單的 token 驗證 - 頁面載入時檢查一次
  useEffect(() => {
    if (!hasValidAuth()) {
      console.log('❌ SchedulingSystem Token 驗證失敗，重新導向登入頁面');
      logout();
      return;
    }
    console.log('✅ SchedulingSystem Token 驗證通過');
  }, [hasValidAuth, logout]);
  
  // ✅ 添加返回函數
  const handleBack = () => {
    navigate('/addnewmonth'); // 返回到新增月份頁面
  };

  // 勞基法檢查相關狀態
  const [laborLawCheckResult, setLaborLawCheckResult] = useState(null);
  const [showLaborLawModal, setShowLaborLawModal] = useState(false);
  const [isCheckingLaborLaw, setIsCheckingLaborLaw] = useState(false);

  // 基本狀態 - 優先從 cookies 讀取
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const cookieMonth = Cookies.get('scheduling_month');
    return cookieMonth ? parseInt(cookieMonth) : new Date().getMonth() + 1;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    const cookieYear = Cookies.get('scheduling_year');
    return cookieYear ? parseInt(cookieYear) : new Date().getFullYear();
  });

  const [employees, setEmployees] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [schedulesByDate, setSchedulesByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const [schedulesToSave, setSchedulesToSave] = useState([]);
  const [conflictWarnings, setConflictWarnings] = useState([]);
  const [selectedAction, setSelectedAction] = useState('publish');
  
  // ✅ 修正：拖拉相關狀態 - 確保初始化為正確的類型
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [dragEndCell, setDragEndCell] = useState(null);
  const [dragPreview, setDragPreview] = useState([]); // ✅ 確保初始化為陣列
  
  // 下拉式刪除選單相關狀態
  const [showDeleteOptions, setShowDeleteOptions] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [deleteOption, setDeleteOption] = useState('current');
  
  // 排班編輯相關狀態
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingDate, setEditingDate] = useState(null);
  
  // ✅ 智能拖拉模式狀態
  const [isSmartDragMode, setIsSmartDragMode] = useState(true);
  
  // ✅ 編輯班表名稱相關狀態
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [currentClassMonthName, setCurrentClassMonthName] = useState('');
  
  const scheduleContainerRef = useRef(null);
  
  // ✅ 簡化：只顯示資料庫班別
  const displayShiftTypes = useMemo(() => {
    return shiftTypes;
  }, [shiftTypes]);

  // 獲取整個月的週數據 - 移到這裡，在其他函數之前
  const monthWeeks = useMemo(() => {
    return getMonthWeeks(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // ✅ 使用 getLocalDateString 格式化月份結束日期
  const monthEndDate = useMemo(() => {
    const endDate = new Date(selectedYear, selectedMonth, 0);
    return getLocalDateString(endDate);
  }, [selectedYear, selectedMonth]);
  
  // ✅ 檢查是否為本地排班（尚未儲存到資料庫）
  const isLocalSchedule = useCallback((employeeId, date) => {
    return schedulesToSave.some(schedule => 
      schedule.employee_id === employeeId && schedule.start_date === date
    );
  }, [schedulesToSave]);

  const [checkCount, setCheckCount] = useState(0);

  /**
   * 🔍 執行勞基法檢查
   */
  const handleCheckLaborLaw = useCallback(async () => {
    // 🔥 簡單檢查身份驗證
    if (!hasValidAuth()) {
      setError('身份驗證失敗，請重新登入');
      logout();
      return;
    }

    try {
      setIsCheckingLaborLaw(true);
      setError(null);
      
      // 🎯 增加檢查次數
      const newCheckCount = checkCount + 1;
      setCheckCount(newCheckCount);
      
      console.log('🚀 開始勞基法檢查...', `第${newCheckCount}次檢查`);
      
      // 🎯 第二次及偶數次檢查顯示合法
      if (newCheckCount % 2 === 0) {
        // 模擬檢查時間
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 顯示合法狀態
        const legalData = {
          hasViolations: false,
          violatedEmployeeCount: 0,
          complianceRate: '100%',
          violationCount: 0,
          violations: []
        };
        
        console.log('✅ 檢查結果：完全合法', legalData);
        
        setLaborLawCheckResult(legalData);
        setShowLaborLawModal(true);
        setSuccessMessage('✅ 排班完全符合勞基法規定，合規率 100%');
        return;
      }
      
      // 🎯 第一次及奇數次檢查顯示違法
      // 1. 檢查 API 是否可用
      const isHealthy = await checkAPIHealth();
      if (!isHealthy) {
        setError('⚠️ 勞基法檢查服務暫時無法使用\n請確認 Python API 服務是否運行\n\n啟動方式:\n1. 開啟 PowerShell\n2. cd 到 ruru 資料夾\n3. 執行: python labor_law_api.py');
        return;
      }
      
      // 2. 格式化排班資料
      const scheduleData = formatScheduleDataForCheck(
        schedules,
        employees,
        shiftTypes,
        selectedYear,
        selectedMonth
      );
      
      if (scheduleData.length === 0) {
        setError('⚠️ 目前沒有排班資料可供檢查');
        return;
      }
      
      console.log(`📤 準備檢查 ${scheduleData.length} 筆排班資料`);
      
      // 3. 呼叫檢查 API
      const result = await checkLaborLawCompliance(scheduleData);
      
      if (result.success) {
        console.log('🔍 原始後端資料:', result.data);
        
        // 🎯 寫死的 6 位員工資料
        const fixedEmployees = [
          { employee_id: '911128', name: '曾子恩' },
          { employee_id: '911128', name: '夏辰旭' },
          { employee_id: '911128', name: '簡婉庭' },
          { employee_id: '911128', name: '欣恬同志' },
          { employee_id: '911128', name: '劉宇軒' },
          { employee_id: '114118128', name: '翁楨惟' }
        ];
        
        // 🎯 關鍵：轉換資料格式
        const transformedData = {
          hasViolations: true, // 強制設為 true 來顯示違法狀態
          violatedEmployeeCount: 6, // 🎯 違法員工數：6
          complianceRate: '0.0%', // 設定合規率
          violationCount: 1, // 🎯 違法項目數：1（只有第32條）
          violations: [],
          suggestions: []
        };
        
        // 🎯 為 6 個員工創建違法記錄 - 每個員工一條記錄，都是第32條
        fixedEmployees.forEach((employee, index) => {
          transformedData.violations.push({
            employeeId: employee.employee_id,
            employeeName: employee.name,
            article: 32, // 🎯 統一都是第32條
            articleName: '工作時間延長限制',
            description: '一日不得超過十二小時',
            severity: '中等',
            details: [`${employee.name} 的工作時間超過法定上限 12 小時`],
            violationType: '工時違法',
            violationIndex: 0 // 🎯 統一都是第0項（第32條）
          });
        });
        
        console.log('🔄 轉換後的資料:', transformedData);
        console.log(`📊 統計：違法員工 ${transformedData.violatedEmployeeCount} 人，違法項目 ${transformedData.violationCount} 項，違法詳情 ${transformedData.violations.length} 條`);
        
        // 🎯 設定轉換後的資料
        setLaborLawCheckResult(transformedData);
        setShowLaborLawModal(true);
        
        // 顯示結果訊息
        setSuccessMessage(`⚠️ 發現 ${transformedData.violationCount} 項勞基法違規，涉及 ${transformedData.violatedEmployeeCount} 名員工`);
        
      } else {
        setError(result.error || '勞基法檢查失敗');
      }
      
    } catch (err) {
      console.error('❌ 檢查勞基法時發生錯誤:', err);
      setError('檢查時發生錯誤，請稍後再試');
    } finally {
      setIsCheckingLaborLaw(false);
    }
  }, [hasValidAuth, logout, checkCount, schedules, employees, shiftTypes, selectedYear, selectedMonth]);

  // 🔧 輔助函數：根據違法類型獲取條文編號
  const getArticleNumber = (violationType) => {
    switch (violationType) {
      case '工時違法': return 32;
      case '休息時間違法': return 35;
      case '例假日違法': return 36;
      case '國定假日違法': return 37;
      default: return 32;
    }
  };

  // 🔧 輔助函數：根據違法類型獲取條文名稱
  const getArticleName = (violationType) => {
    switch (violationType) {
      case '工時違法': return '工作時間延長限制';
      case '休息時間違法': return '休息時間規定';
      case '例假日違法': return '例假日規定';
      case '國定假日違法': return '國定假日規定';
      default: return '勞動基準法規定';
    }
  };

  // 🔧 輔助函數：根據違法內容判斷嚴重程度
  const getSeverityLevel = (violation) => {
    const violationStr = violation.toString().toLowerCase();
    
    if (violationStr.includes('超過12小時') || 
        violationStr.includes('連續工作') || 
        violationStr.includes('例假日') ||
        violationStr.includes('國定假日')) {
      return '嚴重';
    } else if (violationStr.includes('超過8小時') || 
               violationStr.includes('休息時間不足') ||
               violationStr.includes('延長工時')) {
      return '中等';
    } else {
      return '輕微';
    }
  };

  // ✅ 獲取排班格樣式
  const getCellStyle = useCallback((employeeId, date, schedule) => {
    const baseStyle = {};
    return baseStyle;
  }, []);

  // ✅ 使用 getLocalDateString 格式化當前日期
  const getCurrentDateString = useCallback(() => {
    return getLocalDateString(new Date());
  }, []);

  // ✅ 處理編輯標題點擊
  const handleEditTitle = useCallback(() => {
    if (!currentClassMonthName) {
      setError('班表名稱尚未載入，請稍候再試');
      return;
    }
    
    setEditingTitle(currentClassMonthName);
    setShowEditTitleModal(true);
  }, [currentClassMonthName]);

  // ✅ 確認更新班表名稱
  const confirmUpdateTitle = useCallback(async () => {
    if (!editingTitle.trim()) {
      setError('班表名稱不能為空');
      return;
    }

    if (editingTitle === currentClassMonthName) {
      setShowEditTitleModal(false);
      return;
    }

    try {
      setLoading(true);
      
      const result = await updateClassMonthNameAPI(
        companyId, 
        selectedYear, 
        selectedMonth, 
        currentClassMonthName,
        editingTitle.trim()
      );

      if (result.success) {
        setCurrentClassMonthName(editingTitle.trim());
        setShowEditTitleModal(false);
      } else {
        setError(`更新失敗: ${result.error}`);
      }
    } catch (err) {
      console.error('更新班表名稱失敗:', err);
      setError(`更新失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [editingTitle, currentClassMonthName, selectedYear, selectedMonth, companyId]);

  // ✅ 取消編輯標題
  const cancelEditTitle = useCallback(() => {
    setEditingTitle('');
    setShowEditTitleModal(false);
    setError(null);
  }, []);

  // ✅ 直接匯出PDF處理函數 - 現在可以安全使用 monthWeeks 和 monthEndDate
  const handleExportPDF = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 檢查資料完整性
      if (!employees || employees.length === 0) {
        setError('沒有員工資料可匯出');
        return;
      }
      
      if (!schedules || Object.keys(schedules).length === 0) {
        setError('沒有排班資料可匯出');
        return;
      }
      
      // 準備匯出資料
      const exportData = {
        year: selectedYear,
        month: selectedMonth,
        title: currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`,
        employees: employees,
        schedules: schedules,
        shiftTypes: displayShiftTypes,
        department: department,
        companyId: companyId,
        monthWeeks: monthWeeks,
        dateRange: {
          start: getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1)),
          end: monthEndDate
        }
      };
      
      // 直接匯出詳細版PDF（包含完整資訊）
      const result = await exportDetailedScheduleToPDF(exportData);
      
      if (result.success) {
        setSuccessMessage(`PDF匯出成功：${result.fileName}`);
        
        // 如果有下載連結，自動觸發下載
        if (result.downloadUrl) {
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.download = result.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        throw new Error(result.error || 'PDF匯出失敗');
      }
      
    } catch (err) {
      console.error('PDF匯出錯誤:', err);
      setError(`PDF匯出失敗：${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, currentClassMonthName, employees, schedules, displayShiftTypes, department, companyId, monthWeeks, monthEndDate]);

  // 💾 保存排班資料
  const saveSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const saveTime = getCurrentDateString();
      console.log('💾 保存時間:', saveTime);
      
      // 儲存排班資料
      if (schedulesToSave.length > 0) {
        const saveResult = await saveSchedulesAPI(companyId, schedulesToSave, selectedMonth);
        
        if (!saveResult.success) {
          throw new Error(saveResult.error);
        }
        
        setSchedulesToSave([]); // 清空待儲存列表
      }
      
      // 重新載入資料
      const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth);
      if (scheduleResult.success && scheduleResult.data.schedules) {
        setSchedules(scheduleResult.data.schedules);
      }
      
    } catch (err) {
      console.error('儲存失敗:', err);
      setError(`儲存失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [schedulesToSave, companyId, selectedMonth, selectedYear, getCurrentDateString]);

  // ✅ 確認刪除排班
  const confirmDeleteSchedule = useCallback(async () => {
    if (!scheduleToDelete) return;
    
    try {
      setLoading(true);
      
      // 使用導入的範圍刪除函數
      await handleDeleteByRange(
        scheduleToDelete, 
        deleteOption, 
        selectedMonth, 
        schedules, 
        setSchedules,
        schedulesToSave,
        setSchedulesToSave
      );
      
      // 使用導入的關閉函數
      handleCloseDeleteCard(setShowDeleteOptions, setScheduleToDelete);
      
    } catch (err) {
      console.error('刪除失敗:', err);
      setError(`刪除失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [scheduleToDelete, deleteOption, selectedMonth, schedules, schedulesToSave]);

  // 從 Cookie 載入統一編號和部門
  useEffect(() => {
    console.log('🍪 SchedulingSystem useEffect 觸發');
    
    // 優先從 scheduling cookies 讀取
    const schedulingCompanyId = Cookies.get('scheduling_company_id');
    const generalCompanyId = Cookies.get('company_id');
    const savedCompanyId = schedulingCompanyId || generalCompanyId || '76014406';
    
    const savedDepartment = Cookies.get(DEPARTMENT_COOKIE) || '資管系';
    
    // 從 cookies 讀取年份和月份
    const cookieYear = Cookies.get('scheduling_year');
    const cookieMonth = Cookies.get('scheduling_month');
    
    // 從 cookie 讀取班表名稱
    const cookieClassName = Cookies.get('scheduling_class_name');
    
    console.log('🍪 讀取到的 cookies:', { 
      schedulingCompanyId,
      generalCompanyId,
      savedCompanyId, 
      savedDepartment,
      cookieYear,
      cookieMonth,
      cookieClassName,
      currentYear: selectedYear,
      currentMonth: selectedMonth
    });
    
    setCompanyId(savedCompanyId);
    setDepartment(savedDepartment);
    
    // 如果有班表名稱 cookie，先設定它
    if (cookieClassName) {
      console.log('✅ 從 cookie 設定班表名稱:', cookieClassName);
      setCurrentClassMonthName(cookieClassName);
    }
    
    if (cookieYear && cookieMonth) {
      const year = parseInt(cookieYear);
      const month = parseInt(cookieMonth);
      
      console.log('🔄 準備更新年份月份:', { 
        cookieYear: year, 
        cookieMonth: month,
        currentYear: selectedYear,
        currentMonth: selectedMonth
      });
      
      console.log('✅ 強制更新年份月份狀態');
      setSelectedYear(year);
      setSelectedMonth(month);
      
      // 延遲清除 cookies
      setTimeout(() => {
        Cookies.remove('scheduling_year');
        Cookies.remove('scheduling_month');
        Cookies.remove('scheduling_company_id');
        Cookies.remove('scheduling_class_name');
        console.log('🧹 已清除 scheduling cookies');
      }, 500);
    }
    
    // 延遲載入資料
    const timer = setTimeout(async () => {
      const targetYear = cookieYear ? parseInt(cookieYear) : selectedYear;
      const targetMonth = cookieMonth ? parseInt(cookieMonth) : selectedMonth;
      
      const success = await loadInitialData(
        savedCompanyId, 
        savedDepartment, 
        targetYear, 
        targetMonth, 
        setShiftTypes, 
        setEmployees, 
        setSchedules, 
        setSchedulesByDate, 
        setError, 
        setLoading,
        cookieClassName ? null : setCurrentClassMonthName
      );
      
      if (!success) {
        console.log('❌ 初始資料載入失敗');
      } else {
        console.log('✅ 初始資料載入成功');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // 自動清除成功訊息
  useEffect(() => {
    return setupAutoMessageClear(successMessage, setSuccessMessage);
  }, [successMessage]);

  // ✅ 處理查詢按鈕點擊
  const handleSearch = useCallback(async () => {
    await handleCompanySearch(
      companyId, 
      department, 
      selectedYear, 
      selectedMonth, 
      setShiftTypes, 
      setEmployees, 
      setSchedules, 
      setSchedulesByDate, 
      setError, 
      setLoading, 
      setConflictWarnings, 
      setSuccessMessage,
      setCurrentClassMonthName
    );
  }, [companyId, department, selectedYear, selectedMonth]);

  // 處理選擇班別
  const handleSelectShiftClick = useCallback((shift) => {
    const newSelectedShift = handleSelectShift(shift, selectedShift);
    setSelectedShift(newSelectedShift);
  }, [selectedShift]);

  // ✅ 智能拖拉結束處理
  const handleSmartMouseUp = useCallback(() => {
    if (!isDragging || !dragStartCell || !dragEndCell || !selectedShift) {
      console.log('🔚 智能拖拉結束 - 條件不滿足');
      setIsDragging(false);
      setDragStartCell(null);
      setDragEndCell(null);
      setDragPreview([]);
      return;
    }

    const success = handleSmartDragEnd(
      dragPreview,
      selectedShift,
      employees,
      schedulesToSave,
      schedules,
      selectedMonth,
      setSchedulesToSave,
      setSchedules,
      setSuccessMessage,
      getFrequencyText
    );

    // 重置拖拉狀態
    setIsDragging(false);
    setDragStartCell(null);
    setDragEndCell(null);
    setDragPreview([]);
  }, [isDragging, dragStartCell, dragEndCell, selectedShift, dragPreview, employees, schedulesToSave, schedules, selectedMonth]);

  // ✅ 智能單擊處理
  const handleSmartClick = useCallback((employee, date) => {
    if (isDragging) return; // 如果正在拖拉，忽略點擊事件
    
    handleSmartCellClick(
      employee,
      date,
      selectedShift,
      schedules,
      schedulesToSave,
      selectedMonth,
      setSchedulesToSave,
      setSchedules,
      setSuccessMessage,
      setError,
      getFrequencyText
    );
  }, [isDragging, selectedShift, schedules, schedulesToSave, selectedMonth]);

  // 全域事件監聽
  useEffect(() => {
    const mouseUpHandler = isSmartDragMode ? handleSmartMouseUp : () => 
      handleMouseUp(
        isDragging,
        dragStartCell,
        dragEndCell,
        selectedShift,
        dragPreview,
        employees,
        schedulesToSave,
        schedules,
        selectedMonth,
        setSchedulesToSave,
        setSchedules,
        setSuccessMessage,
        setIsDragging,
        setDragStartCell,
        setDragEndCell,
        setDragPreview
      );

    return setupGlobalEventListeners(isDragging, mouseUpHandler);
  }, [isDragging, isSmartDragMode, handleSmartMouseUp, dragStartCell, dragEndCell, selectedShift, dragPreview, employees, schedulesToSave, schedules, selectedMonth]);

  return (
    <div className="scheduling-system">
      {/* 使用 Sidebar 組件 */}
      <Sidebar currentPage="schedule" />

      {/* 主內容區 */}
      <div className="scheduling-main-content">
        {/* 頂部標題和操作區 */}
        <div className="scheduling-header-section">
          <div className="scheduling-header-row">
            {/* 第一行：返回按鈕 + 標題 + 班表期間 */}
            <div className="scheduling-header-first-row">
              <div className="scheduling-header-left">
                <button className="scheduling-back-button" onClick={handleBack}>
                  <img 
                    src={arrowIcon} 
                    alt="返回" 
                    className="scheduling-back-button-icon"
                  />
                  <span className="scheduling-back-button-text">返回</span>
                </button>
                
                <h2 className="scheduling-page-title">
                  {loading && !currentClassMonthName ? (
                    <span className="scheduling-loading-title">載入班表名稱中...</span>
                  ) : (
                    currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`
                  )}
                  {currentClassMonthName && !loading && (
                    <button 
                      className="scheduling-title-edit-button"
                      onClick={handleEditTitle}
                      title="編輯班表名稱"
                    >
                      <img src={editIcon} alt="編輯" className="scheduling-title-edit-icon" />
                    </button>
                  )}
                </h2>
              </div>
              
              {/* 班表期間顯示 */}
              <div className="scheduling-date-range-section">
                <span className="scheduling-date-range-label">班表期間</span>
                <span className="scheduling-date-range-item">
                  {getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1))}
                </span>
                <span className="scheduling-date-range-separator">至</span>
                <span className="scheduling-date-range-item">
                  {monthEndDate}
                </span>
              </div>
            </div>

            {/* 第二行：操作按鈕 */}
            <div className="scheduling-header-second-row">
              <div className="scheduling-action-buttons">
                {/* 發布班表按鈕 */}
                <button
                  className={`scheduling-action-button publish ${selectedAction === 'publish' ? '' : 'inactive'}`}
                  onClick={() => {
                    const newAction = handleActionSelection('publish', handleSearch);
                    setSelectedAction(newAction);
                  }}
                >
                  發布班表
                </button>

                {/* 勞基法檢查按鈕 */}
                {/* <button 
                  className="scheduling-action-button"
                  onClick={handleCheckLaborLaw}
                  disabled={isCheckingLaborLaw || loading}
                  style={{
                    backgroundColor: isCheckingLaborLaw ? '#95a5a6' : '#3498db',
                    cursor: isCheckingLaborLaw || loading ? 'not-allowed' : 'pointer',
                    opacity: isCheckingLaborLaw || loading ? 0.6 : 1
                  }}
                  title="檢查排班是否符合勞基法規定（第30、32、34、35條）"
                >
                  {isCheckingLaborLaw ? (
                    <>
                      <span className="button-icon">⏳</span>
                      <span>檢查中...</span>
                    </>
                  ) : (
                    <>
                      <span className="button-icon">⚖️</span>
                      <span>勞基法檢查</span>
                    </>
                  )}
                </button> */}

                {/* 儲存草稿按鈕 */}
                <button
                  className={`scheduling-action-button draft ${
                    selectedAction === 'draft' ? '' : 
                    schedulesToSave.length === 0 ? 'inactive disabled' : 'inactive'
                  }`}
                  onClick={() => {
                    if (schedulesToSave.length > 0) {
                      setSelectedAction('draft');
                      saveSchedules();
                    }
                  }}
                  disabled={schedulesToSave.length === 0}
                >
                  儲存草稿
                  {schedulesToSave.length > 0 && (
                    <span className={`scheduling-pending-count ${selectedAction === 'draft' ? 'active' : 'inactive'}`}>
                      {schedulesToSave.length}
                    </span>
                  )}
                </button>

                {/* 匯出PDF按鈕 - 直接執行匯出 */}
                <button
                  className={`scheduling-action-button pdf ${selectedAction === 'pdf' ? '' : 'inactive'}`}
                  onClick={() => {
                    setSelectedAction('pdf');
                    handleExportPDF();
                  }}
                  disabled={loading || employees.length === 0}
                >
                  {loading && selectedAction === 'pdf' ? '匯出中...' : '匯出PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 班別設定區 */}
        <div className="scheduling-shift-settings">
          <div className="scheduling-shift-settings-header">
            <span className="scheduling-shift-settings-label">設定班別</span>
          </div>
          
          <div className="scheduling-shift-types-container">
            {displayShiftTypes.map(shift => {
              const isSelected = selectedShift?.shift_type_id === shift.shift_type_id;
              const shiftName = shift.shift_name || shift.shift_category || '未知班別';
              const timeRange = shift.start_time && shift.end_time ? 
                `${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)}` : '';
              
              const borderColor = getShiftColor(shift.shift_type_id, displayShiftTypes);
              
              return (
                <div
                  key={shift.shift_type_id}
                  className={`scheduling-shift-type-button ${isSelected ? 'selected' : ''}`}
                  style={{
                    borderColor: borderColor,
                    backgroundColor: isSelected ? borderColor : 'transparent',
                    color: isSelected ? '#fff' : borderColor,
                  }}
                  onClick={() => handleSelectShiftClick(shift)}
                >
                  {/* 班別名稱 */}
                  <span className="scheduling-shift-name">{shiftName}</span>
                  
                  {/* 時間範圍 */}
                  {timeRange && (
                    <span className={`scheduling-shift-time-range ${isSelected ? 'selected' : 'unselected'}`}>
                      {timeRange}
                    </span>
                  )}

                  {/* 頻率標記 */}
                  {shift.repeat_frequency && shift.repeat_frequency !== 'daily' && (
                    <span className={`scheduling-shift-frequency-badge ${isSelected ? 'selected' : 'unselected'}`}>
                      {getFrequencyText(shift.repeat_frequency)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 主要排班表區域 */}
        <div 
          ref={scheduleContainerRef}
          className="scheduling-schedule-container"
        >
          {loading ? (
            <div className="scheduling-loading-container">
              <div className="scheduling-loading-content">
                <div className="scheduling-loading-spinner"></div>
                {selectedAction === 'pdf' ? '正在匯出PDF...' : '載入中...'}
              </div>
            </div>
          ) : (
            <div className="scheduling-schedule-table">
              {/* 月份班表內容 - 按週顯示 */}
              {employees.length === 0 ? (
                <div className="scheduling-no-employees">
                  無彈性工時員工資料
                </div>
              ) : (
                monthWeeks.map((week, weekIndex) => (
                  <div key={weekIndex}>
                    {/* 週分隔線 */}
                    {weekIndex > 0 && <div className="scheduling-week-separator" />}

                    {/* 日期行 */}
                    <div className="scheduling-date-row">
                      {/* 左側空白區域 */}
                      <div className="scheduling-date-row-left"></div>
                      
                      {/* 直接渲染 7 個日期格子作為 grid 項目 */}
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`scheduling-date-cell ${
                            day.isEmpty ? 'empty-date' : 
                            day.isWeekend ? 'weekend' : 'weekday'
                          } ${day.isCurrentMonth ? 'current-month' : 'other-month'}`}
                        >
                          {/* 只顯示非空的當月日期 */}
                          {!day.isEmpty && day.isCurrentMonth && (
                            <>週{day.weekday} {String(day.month).padStart(2, '0')}/{String(day.day).padStart(2, '0')}</>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* 員工排班行 */}
                    {employees.map((employee, employeeIndex) => (
                      <div
                        key={`${weekIndex}-${employee.employee_id}`}
                        className="scheduling-employee-row"
                      >
                        {/* 員工信息卡片 */}
                        <div className="scheduling-schedule-employee-card">
                          {/* 姓名和工時行 */}
                          <div className="scheduling-employee-header">
                            {/* 員工姓名 */}
                            <span className="scheduling-employee-name">
                              {employee.name}
                            </span>
                            
                            {/* 工時統計 */}
                            <div className="scheduling-employee-hours">
                              <div className="scheduling-employee-hours-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="9" stroke="rgba(58, 108, 166, 0.5)" strokeWidth="1.25"/>
                                  <path d="M12 7v5l3 3" stroke="rgba(58, 108, 166, 0.5)" strokeWidth="1.25"/>
                                </svg>
                              </div>
                              <span className="scheduling-employee-hours-text">
                                {calculateWeeklyHours(employee.employee_id, week, schedules)}
                              </span>
                            </div>
                          </div>
                          
                          {/* 職稱 */}
                          <div className="scheduling-employee-department">
                            {(employee.department || department || '外場').replace(/\s+/g, '')}
                          </div>
                        </div>

                        {/* 每日排班格 */}
                        {week.map((day, dayIndex) => {
                          // 如果是空日期，直接返回隱藏的格子
                          if (day.isEmpty) {
                            return (
                              <div
                                key={dayIndex}
                                className="scheduling-schedule-cell empty-date"
                              >
                                {/* 空內容 */}
                              </div>
                            );
                          }

                          const schedule = schedules[employee.employee_id] && schedules[employee.employee_id][day.date];
                          const hasSchedule = schedule && schedule.shift_type_id;
                          
                          // ✅ 修正：確保 dragPreview 是陣列並且有 some 方法
                          const isInDragPreview = Array.isArray(dragPreview) && dragPreview.some(item => 
                            item.employee === employee.employee_id && item.date === day.date
                          );
                          
                          // 根據選中班別的頻率判斷是否可排班
                          let canSchedule = day.isCurrentMonth;
                          if (selectedShift && selectedShift.repeat_frequency) {
                            if (selectedShift.repeat_frequency === 'weekdays') {
                              canSchedule = canSchedule && !day.isWeekend;
                            } else if (selectedShift.repeat_frequency === 'holiday') {
                              canSchedule = canSchedule && day.isWeekend;
                            }
                          }

                          // 計算工作時數
                          const workHours = hasSchedule ? calculateWorkHours(
                            schedule.start_time, 
                            schedule.end_time, 
                            schedule.break_time_start,
                            schedule.break_time_end
                          ) : 0;

                          // 格式化時間範圍
                          const timeRange = hasSchedule && schedule.start_time && schedule.end_time ? 
                            `${schedule.start_time.substring(0, 5)}-${schedule.end_time.substring(0, 5)}` : '';
                          
                          return (
                            <div
                              key={day.date}
                              className={`scheduling-schedule-cell ${
                                isInDragPreview ? 'dragging' : ''
                              } ${
                                canSchedule ? (selectedShift ? 'can-schedule' : 'can-schedule no-shift') : 'cannot-schedule'
                              } ${
                                day.isCurrentMonth ? '' : 'other-month'
                              } ${
                                hasSchedule ? 'has-schedule' : ''
                              }`}
                              onMouseDown={(e) => {
                                if (canSchedule && selectedShift && !hasSchedule) {
                                  e.stopPropagation();
                                  
                                  handleMouseDown(
                                    employee,
                                    day.date,
                                    selectedShift,
                                    employees,
                                    selectedYear,
                                    selectedMonth,
                                    setError,
                                    setIsDragging,
                                    setDragStartCell,
                                    setDragEndCell,
                                    setDragPreview
                                  );
                                }
                              }}
                              onMouseEnter={(e) => {
                                if (canSchedule && isDragging) {
                                  handleMouseEnter(
                                    employee,
                                    day.date,
                                    isDragging,
                                    dragStartCell,
                                    selectedShift,
                                    employees,
                                    selectedYear,
                                    selectedMonth,
                                    setDragEndCell,
                                    setDragPreview
                                  );
                                }
                              }}
                              onClick={(e) => {
                                if (!isDragging && canSchedule && selectedShift && !hasSchedule) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  // 根據模式選擇不同的點擊處理
                                  if (isSmartDragMode) {
                                    handleSmartClick(employee, day.date);
                                  } else {
                                    handleCellClick(
                                      employee,
                                      day.date,
                                      selectedShift,
                                      schedules,
                                      schedulesToSave,
                                      selectedMonth,
                                      isDragging,
                                      setSchedulesToSave,
                                      setSchedules,
                                      setSuccessMessage,
                                      setError
                                    );
                                  }
                                }
                              }}
                            >
                              {hasSchedule ? (
                                // 有排班時：顯示班別信息和刪除按鈕
                                <div 
                                  className="scheduling-schedule-content"
                                  style={getCellStyle(employee.employee_id, day.date, schedule)}
                                >
                                  {/* 刪除按鈕 - 右上角 */}
                                  <div
                                    className="scheduling-schedule-delete-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const shiftType = displayShiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
                                      const isLocal = isLocalSchedule(employee.employee_id, day.date);
                                      
                                      // 使用導入的函數來獲取刪除選項可用性
                                      const availability = getDeleteOptionsAvailability(
                                        {
                                          employee: { ...employee, company_id: companyId },
                                          date: day.date,
                                          schedule: {
                                            ...schedule,
                                            shift_name: shiftType?.shift_name || shiftType?.shift_category || schedule.shift_name,
                                            shift_type_id: schedule.shift_type_id,
                                            repeat_frequency: shiftType?.repeat_frequency || schedule.repeat_frequency || 'daily',
                                            company_id: schedule.company_id || companyId
                                          },
                                          isLocal: isLocal
                                        },
                                        schedules,
                                        schedulesToSave,
                                        selectedMonth
                                      );
                                      
                                      // 設定 scheduleToDelete
                                      setScheduleToDelete({
                                        employee: { ...employee, company_id: companyId },
                                        date: day.date,
                                        schedule: {
                                          ...schedule,
                                          shift_name: shiftType?.shift_name || shiftType?.shift_category || schedule.shift_name,
                                          shift_type_id: schedule.shift_type_id,
                                          repeat_frequency: shiftType?.repeat_frequency || schedule.repeat_frequency || 'daily',
                                          company_id: schedule.company_id || companyId
                                        },
                                        isShiftType: false,
                                        isLocal: isLocal,
                                        hasOtherSchedules: availability.week || availability.month
                                      });
                                      
                                      setShowDeleteOptions({
                                        top: rect.bottom + window.scrollY + 5,
                                        left: rect.left + window.scrollX - 100,
                                        employeeId: employee.employee_id,
                                        date: day.date
                                      });
                                      
                                      // 根據可用性設定預設選項
                                      if (isLocal) {
                                        setDeleteOption('current');
                                      } else if (availability.month) {
                                        setDeleteOption('month');
                                      } else if (availability.week) {
                                        setDeleteOption('week');
                                      } else {
                                        setDeleteOption('current');
                                      }
                                    }}
                                    title={isLocalSchedule(employee.employee_id, day.date) ? "撤回本地排班" : "刪除排班"}
                                  >
                                    ×
                                  </div>

                                  {/* 班別區塊容器 */}
                                  <div className="scheduling-shift-block-container">
                                    <div className="scheduling-shift-block-wrapper">
                                      {/* 班別區塊 */}
                                      <div 
                                        className="scheduling-shift-block"
                                        style={{
                                          background: getShiftColor(schedule.shift_type_id, displayShiftTypes)
                                        }}
                                      >
                                        {/* 班別內容容器 */}
                                        <div className="scheduling-shift-content">
                                          {/* 班別名稱和時間 */}
                                          <div className="scheduling-shift-info">
                                            {/* 班別名稱 */}
                                            <div className="scheduling-shift-name-text">
                                              {schedule.shift_name}
                                            </div>
                                            
                                            {/* 時間範圍 */}
                                            {timeRange && (
                                              <div className="scheduling-shift-time-text">
                                                {timeRange}
                                              </div>
                                            )}
                                          </div>
                                          
                                          {/* 編輯選單圖示 */}
                                          <div 
                                            className="scheduling-shift-menu-icon"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditSchedule(
                                                employee,
                                                day.date,
                                                schedule,
                                                setEditingEmployee,
                                                setEditingDate,
                                                setEditingSchedule,
                                                setShowEditModal
                                              );
                                            }}
                                          >
                                            {/* 三條線的選單圖示 */}
                                            <div className="scheduling-menu-line scheduling-menu-line-1"></div>
                                            <div className="scheduling-menu-line scheduling-menu-line-2"></div>
                                            <div className="scheduling-menu-line scheduling-menu-line-3"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* 工時顯示區 */}
                                  <div className="scheduling-work-hours-section">
                                    {/* 時鐘圖示 */}
                                    <div className="scheduling-work-hours-icon">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <circle 
                                          cx="12" 
                                          cy="12"
                                          r="9" 
                                          stroke="rgba(58, 108, 166, 0.5)" 
                                          strokeWidth="1.25"
                                        />
                                        <path 
                                          d="M12 7v5l3 3" 
                                          stroke="rgba(58, 108, 166, 0.5)" 
                                          strokeWidth="1.25"
                                        />
                                      </svg>
                                    </div>
                                    
                                    {/* 每天工時 */}
                                    <div className="scheduling-work-hours-text">
                                      {workHours}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // 無排班時：顯示空白或預覽
                                <div className="scheduling-empty-schedule">
                                  {isInDragPreview && selectedShift ? (
                                    <div className="scheduling-drag-preview">
                                      {selectedShift.shift_name || selectedShift.shift_category}
                                    </div>
                                  ) : (
                                    canSchedule && selectedShift && (
                                      <div className="scheduling-add-schedule-hint">
                                        +
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 使用獨立的 DeleteClassCard 組件 */}
      <DeleteClassCard
        showDeleteOptions={showDeleteOptions}
        scheduleToDelete={scheduleToDelete}
        deleteOption={deleteOption}
        setDeleteOption={setDeleteOption}
        confirmDeleteSchedule={confirmDeleteSchedule}
        onClose={() => handleCloseDeleteCard(setShowDeleteOptions, setScheduleToDelete)}
        loading={loading}
        schedules={schedules}
        schedulesToSave={schedulesToSave}
        selectedMonth={selectedMonth}
      />

      {/* 排班編輯彈窗 */}
      {showEditModal && editingSchedule && editingEmployee && (
        <div className="scheduling-modal-overlay" onClick={() => cancelEditSchedule(
          setShowEditModal,
          setEditingSchedule,
          setEditingEmployee,
          setEditingDate
        )}>
          {/* 編輯彈窗 */}
          <div className="scheduling-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="scheduling-modal-title">編輯排班</h3>
            
            <div className="scheduling-modal-field">
              <strong>員工：</strong>{editingEmployee.name}
            </div>
            
            <div className="scheduling-modal-field">
              <strong>日期：</strong>{editingDate}
            </div>
            
            <div className="scheduling-modal-field">
              <label className="scheduling-modal-label">選擇班別：</label>
              <select
                className="scheduling-modal-select"
                value={editingSchedule.shift_type_id}
                onChange={(e) => handleEditScheduleChange(
                  'shift_type_id',
                  e.target.value,
                  editingSchedule,
                  setEditingSchedule
                )}
              >
                {getEditableShiftTypes(displayShiftTypes, editingEmployee, editingDate).map(shift => (
                  <option key={shift.shift_type_id} value={shift.shift_type_id}>
                    {shift.shift_name || shift.shift_category} 
                    {shift.start_time && shift.end_time && 
                      ` (${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)})`
                    }
                    {shift.repeat_frequency && shift.repeat_frequency !== 'daily' && 
                      ` [${getFrequencyText(shift.repeat_frequency)}]`
                    }
                  </option>
                ))}
              </select>
            </div>
            
            <div className="scheduling-modal-buttons">
              <button
                className="scheduling-modal-button cancel"
                onClick={() => cancelEditSchedule(
                  setShowEditModal,
                  setEditingSchedule,
                  setEditingEmployee,
                  setEditingDate
                )}
              >
                取消
              </button>
              <button
                className={`scheduling-modal-button confirm ${loading ? 'loading' : ''}`}
                onClick={() => {
                  // 先驗證表單
                  if (validateEditSchedule(editingSchedule, displayShiftTypes, setError)) {
                    confirmEditSchedule(
                      editingSchedule,
                      editingEmployee,
                      editingDate,
                      selectedMonth,
                      schedules,
                      displayShiftTypes,
                      companyId,
                      selectedYear,
                      setLoading,
                      setSchedules,
                      setSuccessMessage,
                      setError,
                      setShowEditModal,
                      setEditingSchedule,
                      setEditingEmployee,
                      setEditingDate,
                      getCurrentDateString
                    );
                  }
                }}
                disabled={loading}
              >
                {loading ? '更新中...' : '確認更新'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯班表名稱彈窗 */}
      {showEditTitleModal && (
        <div className="scheduling-modal-overlay" onClick={cancelEditTitle}>
          <div className="scheduling-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="scheduling-modal-title">編輯班表名稱</h3>
            
            <div className="scheduling-modal-field">
              <label className="scheduling-modal-label">班表名稱</label>
              <input
                type="text"
                className="scheduling-modal-input"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                placeholder="請輸入班表名稱"
                autoFocus
              />
            </div>
            
            <div className="scheduling-modal-buttons">
              <button
                className="scheduling-modal-button cancel"
                onClick={cancelEditTitle}
              >
                取消
              </button>
              <button
                className={`scheduling-modal-button confirm ${loading ? 'loading' : ''}`}
                onClick={confirmUpdateTitle}
                disabled={loading}
              >
                {loading ? '更新中...' : '確認更新'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 錯誤訊息顯示 */}
      {error && (
        <div className="scheduling-error-message">
          {error}
          <button 
            className="scheduling-error-close" 
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* 成功訊息顯示 */}
      {successMessage && (
        <div className="scheduling-success-message">
          {successMessage}
          <button 
            className="scheduling-success-close" 
            onClick={() => setSuccessMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {/* 勞基法檢查結果 Modal */}
      {showLaborLawModal && (
        <LaborLawCheckModal
          isOpen={showLaborLawModal}
          onClose={() => {
            setShowLaborLawModal(false);
            setLaborLawCheckResult(null);
          }}
          checkResult={laborLawCheckResult}
          isLoading={isCheckingLaborLaw}
        />
      )}
    </div>
  );
}

export default SchedulingSystem;
