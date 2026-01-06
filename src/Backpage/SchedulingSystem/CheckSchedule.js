// import axios from 'axios';
// import { getLocalDateString, getTargetYearMonth } from './ScheduleFunction';

// // 設定 API 基礎 URL
// const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

// // ===== 🔍 查詢相關 API 函數區域 =====

// // ✅ 新增：獲取班表名稱 API
// export const fetchClassMonthNameAPI = async (companyId, year, month) => {
//   try {
//     const params = {
//       company_id: String(companyId).trim(),
//       year: Number(year),
//       month: Number(month)
//     };
    
//     console.log('🔍 發送班表名稱查詢請求:', params);
    
//     const response = await axios.get(`${API_BASE_URL}/api/class-months`, {
//       params,
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       timeout: 15000
//     });

//     console.log('✅ 班表名稱查詢響應:', response.data);

//     if (response.data.Status === 'Ok' && response.data.Data && response.data.Data.length > 0) {
//       // 找到對應的班表記錄
//       const classMonth = response.data.Data.find(item => 
//         String(item.company_id).trim() === String(companyId).trim() && 
//         Number(item.year) === Number(year) && 
//         Number(item.month) === Number(month)
//       );
      
//       if (classMonth && classMonth.class_months_name) {
//         console.log('✅ 找到班表名稱:', classMonth.class_months_name);
//         return {
//           success: true,
//           data: classMonth.class_months_name
//         };
//       }
//     }
    
//     // 如果沒有找到，返回預設名稱
//     const defaultName = `${year}年${month}月班表`;
//     console.log('⚠️ 未找到班表名稱，使用預設名稱:', defaultName);
//     return {
//       success: true,
//       data: defaultName
//     };
    
//   } catch (err) {
//     console.error('❌ 獲取班表名稱失敗:', err);
//     const defaultName = `${year}年${month}月班表`;
    
//     if (err.response) {
//       const errorMsg = `班表名稱 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
//       return { 
//         success: false, 
//         error: errorMsg,
//         data: defaultName // 錯誤時也返回預設名稱
//       };
//     } else if (err.code === 'ECONNABORTED') {
//       return { 
//         success: false, 
//         error: '請求超時，請檢查網路連線',
//         data: defaultName
//       };
//     }
//     return { 
//       success: false, 
//       error: `網路錯誤: ${err.message}`,
//       data: defaultName
//     };
//   }
// };

// // 🔍 獲取公司排班資料 API - 修正版本
// export const fetchCompanyScheduleAPI = async (companyId, year, month, selectedMonth = '下月') => {
//   try {
//     const params = {
//       company_id: String(companyId).trim(),
//       year: Number(year),
//       month: Number(month)
//     };
    
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0);
//     const today = new Date();
    
//     const startDateStr = getLocalDateString(startDate);
//     const endDateStr = getLocalDateString(endDate);
//     const todayStr = getLocalDateString(today);
    
//     console.log('🔍 發送班表查詢請求:', params);
//     console.log('🗓️ 查詢日期範圍:', {
//       startDate: startDateStr,
//       endDate: endDateStr,
//       today: todayStr,
//       totalDays: endDate.getDate(),
//       isTodayInRange: todayStr >= startDateStr && todayStr <= endDateStr
//     });
    
//     // ✅ 同時查詢班表名稱和排班資料
//     const [scheduleResponse, classNameResult] = await Promise.all([
//       axios.get(`${API_BASE_URL}/api/company/schedule`, {
//         params: {
//           ...params,
//           start_date: startDateStr,
//           end_date: endDateStr
//         },
//         headers: {
//           'Accept': 'application/json'
//         },
//         timeout: 15000
//       }),
//       fetchClassMonthNameAPI(companyId, year, month)
//     ]);

//     console.log('✅ 班表查詢響應:', scheduleResponse.data);
//     console.log('✅ 班表名稱查詢結果:', classNameResult);
//     console.log('🎯 API 返回的排班數據:', scheduleResponse.data.Data?.schedules?.length || 0, '筆');

//     if (scheduleResponse.data.Status === 'Ok') {
//       const scheduleData = scheduleResponse.data.Data;
      
//       // ✅ 直接使用資料庫的原始日期，不要重新構建
//       const employeeSchedules = {};
//       if (scheduleData.schedules) {
//         scheduleData.schedules.forEach(schedule => {
//           if (!employeeSchedules[schedule.employee_id]) {
//             employeeSchedules[schedule.employee_id] = {};
//           }
          
//           // ✅ 直接使用資料庫返回的原始日期
//           const startDate = new Date(schedule.start_date);
//           const endDate = new Date(schedule.end_date);
          
//           console.log('🗓️ 處理排班:', {
//             employee: schedule.employee_id,
//             startDate: getLocalDateString(startDate),
//             endDate: getLocalDateString(endDate),
//             originalStart: schedule.start_date,
//             originalEnd: schedule.end_date
//             // 🎯 移除 targetYear 和 targetMonth 相關邏輯
//           });
          
//           for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//             const dateStr = getLocalDateString(date);
            
//             employeeSchedules[schedule.employee_id][dateStr] = {
//               shift_type_id: schedule.shift_type_id,
//               shift_name: schedule.shift_info.shift_category,
//               start_time: schedule.shift_info.start_time,
//               end_time: schedule.shift_info.end_time,
//               break_time_start: schedule.shift_info.break_time_start,
//               break_time_end: schedule.shift_info.break_time_end,
//               repeat_frequency: schedule.repeat_frequency,
//               schedule_id: schedule.schedule_id,
//               company_id: schedule.company_id,
//               employee_id: schedule.employee_id,
//               original_start_date: schedule.start_date,
//               original_end_date: schedule.end_date
//             };
//           }
//         });
        
//         const todaySchedules = Object.keys(employeeSchedules).filter(empId => 
//           employeeSchedules[empId][todayStr]
//         );
        
//         console.log('🎯 最終員工排班數據:', Object.keys(employeeSchedules).length, '名員工');
//         console.log('🎯 今日排班檢查:', {
//           today: todayStr,
//           employeesWithTodaySchedule: todaySchedules.length,
//           todaySchedules: todaySchedules.map(empId => ({
//             employeeId: empId,
//             schedule: employeeSchedules[empId][todayStr]
//           }))
//         });
//       }
      
//       return {
//         success: true,
//         data: {
//           shiftTypes: scheduleData.shiftTypes,
//           schedulesByDate: scheduleData.schedulesByDate,
//           schedules: employeeSchedules,
//           classMonthName: classNameResult.data || `${year}年${month}月班表`
//         }
//       };
//     } else {
//       return {
//         success: false,
//         error: scheduleResponse.data.Msg || '無法獲取排班資料',
//         data: {
//           schedules: {},
//           schedulesByDate: {},
//           shiftTypes: [],
//           classMonthName: classNameResult.data || `${year}年${month}月班表`
//         }
//       };
//     }
//   } catch (err) {
//     console.error('❌ 班表查詢失敗:', err);
//     if (err.response) {
//       const errorMsg = `班表查詢 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
//       return { 
//         success: false, 
//         error: errorMsg,
//         data: {
//           schedules: {},
//           schedulesByDate: {},
//           shiftTypes: [],
//           classMonthName: `${year}年${month}月班表`
//         }
//       };
//     } else if (err.code === 'ECONNABORTED') {
//       return { 
//         success: false, 
//         error: '請求超時，請檢查網路連線',
//         data: {
//           schedules: {},
//           schedulesByDate: {},
//           shiftTypes: [],
//           classMonthName: `${year}年${month}月班表`
//         }
//       };
//     }
//     return { 
//       success: false, 
//       error: `網路錯誤: ${err.message}`,
//       data: {
//         schedules: {},
//         schedulesByDate: {},
//         shiftTypes: [],
//         classMonthName: `${year}年${month}月班表`
//       }
//     };
//   }
// };

// // 在 CheckSchedule.js 的 fetchShiftTypesAPI 函數中添加
// export const fetchShiftTypesAPI = async (companyId, department) => {
//   try {
//     const params = { 
//       company_id: String(companyId).trim() 
//     };
    
//     // if (department && department.trim() !== '') {
//     //   params.department = String(department).trim();
//     // }
    
//     console.log('🔍 發送班別查詢請求:', params);
    
//     const response = await axios.get(`${API_BASE_URL}/api/company/shifts`, {
//       params,
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       timeout: 15000
//     });

//     console.log('✅ 班別查詢響應:', response.data);
    
//     // ✅ 添加詳細的數據檢查
//     console.log('🎯 班別數據詳細檢查:', {
//       status: response.data.Status,
//       dataExists: !!response.data.Data,
//       dataType: typeof response.data.Data,
//       dataLength: Array.isArray(response.data.Data) ? response.data.Data.length : 'not array',
//       actualData: response.data.Data
//     });

//     if (response.data.Status === 'Ok') {
//       const shifts = response.data.Data || [];
//       console.log('🎯 處理後的班別數據:', shifts);
      
//       // ✅ 檢查每個班別的結構
//       shifts.forEach((shift, index) => {
//         console.log(`🔍 班別 ${index + 1}:`, {
//           shift_type_id: shift.shift_type_id,
//           shift_name: shift.shift_name,
//           shift_category: shift.shift_category,
//           start_time: shift.start_time,
//           end_time: shift.end_time,
//           fullObject: shift
//         });
//       });
      
//       return {
//         success: true,
//         data: shifts
//       };
//     } else {
//       return {
//         success: false,
//         error: response.data.Msg || '無法獲取排班類型'
//       };
//     }
//   } catch (err) {
//     console.error('❌ 獲取排班類型失敗:', err);
//     if (err.response) {
//       const errorMsg = `班別 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
//       return { success: false, error: errorMsg };
//     } else if (err.code === 'ECONNABORTED') {
//       return { success: false, error: '請求超時，請檢查網路連線' };
//     }
//     return { success: false, error: `網路錯誤: ${err.message}` };
//   }
// };

// // 🔍 獲取輪班制員工 - 新的查詢方式
// export const fetchScheduledShiftEmployeesAPI = async (companyId) => {
//   try {
//     console.log('🔍 開始查詢輪班制員工...');
    
//     // 1. 先獲取所有員工
//     const allEmployeesResponse = await axios.post(`${API_BASE_URL}/api/employees`, {
//       company_id: companyId
//     });
    
//     if (allEmployeesResponse.data.Status !== 'Ok') {
//       throw new Error('獲取員工列表失敗');
//     }
    
//     const allEmployees = allEmployeesResponse.data.Data || [];
//     console.log(`✅ 獲取到 ${allEmployees.length} 位員工`);
    
//     const scheduledShiftEmployees = [];
    
//     // 2. 逐一查詢每個員工的職務詳情
//     for (const employee of allEmployees) {
//       try {
//         const jobDetailsResponse = await axios.get(
//           `${API_BASE_URL}/api/employee-job-details/${companyId}/${employee.employee_id}`
//         );
        
//         if (jobDetailsResponse.data.Status === 'Ok' && 
//             jobDetailsResponse.data.Data.shift_system === 'Scheduled Shift') {
          
//           scheduledShiftEmployees.push({
//             ...employee,
//             ...jobDetailsResponse.data.Data,
//             // 確保有必要的欄位
//             employee_id: employee.employee_id,
//             name: employee.name,
//             department: jobDetailsResponse.data.Data.department || employee.department,
//             shift_system: 'Scheduled Shift'
//           });
          
//           console.log(`✅ 找到輪班制員工: ${employee.name} (${employee.employee_id})`);
//         } else {
//           console.log(`⚪ 跳過非輪班制員工: ${employee.name} - ${jobDetailsResponse.data.Data?.shift_system || '未知'}`);
//         }
//       } catch (error) {
//         console.error(`❌ 查詢員工 ${employee.employee_id} 職務詳情失敗:`, error.message);
//         // 繼續處理下一個員工，不中斷整個流程
//       }
//     }
    
//     console.log(`🎯 最終找到 ${scheduledShiftEmployees.length} 位輪班制員工`);
    
//     return {
//       success: true,
//       data: scheduledShiftEmployees,
//       total: scheduledShiftEmployees.length
//     };
//   } catch (error) {
//     console.error('❌ 查詢輪班制員工失敗:', error);
//     return {
//       success: false,
//       error: error.message,
//       data: []
//     };
//   }
// };

// // 🔍 獲取員工資料 API - 修改版：查詢輪班制員工
// export const fetchEmployeesAPI = async (companyId, shiftSystem = "Scheduled Shift") => {
//   try {
//     // 🔥 使用新的輪班制員工查詢函數
//     console.log('🔍 開始查詢輪班制員工...');
//     const result = await fetchScheduledShiftEmployeesAPI(companyId);
    
//     if (result.success) {
//       console.log('🎯 成功獲取輪班制員工資料:', result.data);
//       return {
//         success: true,
//         data: result.data
//       };
//     } else {
//       console.error('❌ 輪班制員工資料獲取失敗:', result.error);
//       return {
//         success: false,
//         error: result.error || '無法獲取輪班制員工資料'
//       };
//     }
//   } catch (err) {
//     console.error('❌ 獲取輪班制員工失敗:', err);
//     if (err.response) {
//       const errorMsg = `員工 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
//       return { success: false, error: errorMsg };
//     } else if (err.code === 'ECONNABORTED') {
//       return { success: false, error: '請求超時，請檢查網路連線' };
//     }
//     return { success: false, error: `網路錯誤: ${err.message}` };
//   }
// };

// // ===== 🔍 搜尋和查詢處理函數區域 =====

// // 🔍 處理公司資料查詢 - 修改版本
// export const handleCompanySearch = async (
//   companyId, 
//   department, 
//   selectedYear, 
//   selectedMonth, 
//   setShiftTypes, 
//   setEmployees, 
//   setSchedules, 
//   setSchedulesByDate, 
//   setError, 
//   setLoading, 
//   setConflictWarnings, 
//   setSuccessMessage,
//   setCurrentClassMonthName,
//   selectedMonthType = '下月'
// ) => {
//   if (!companyId) {
//     setError('請輸入統一編號');
//     return false;
//   }
  
//   setLoading(true);
//   setError(null);
//   setConflictWarnings([]);
//   setSuccessMessage('');
  
//   try {
//     // 獲取班別類型
//     const shiftTypesResult = await fetchShiftTypesAPI(companyId, department);
//     if (shiftTypesResult.success) {
//       setShiftTypes(shiftTypesResult.data);
//     } else {
//       throw new Error(shiftTypesResult.error);
//     }

//     // 🔥 修改：獲取員工資料 - 查詢輪班制員工
//     console.log('🔍 開始查詢輪班制員工...');
//     const employeesResult = await fetchScheduledShiftEmployeesAPI(companyId);
//     if (employeesResult.success) {
//       console.log('🎯 成功獲取輪班制員工資料:', employeesResult.data);
//       setEmployees(employeesResult.data);
//     } else {
//       console.error('❌ 輪班制員工資料獲取失敗:', employeesResult.error);
//       throw new Error(employeesResult.error);
//     }

//     // 獲取排班資料（傳遞 selectedMonthType）
//     const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth, selectedMonthType);
//     if (scheduleResult.success) {
//       if (scheduleResult.data.shiftTypes) {
//         setShiftTypes(prev => {
//           return prev.length > 0 ? 
//             [...prev.filter(p => !scheduleResult.data.shiftTypes.find(s => s.shift_type_id === p.shift_type_id)), 
//              ...scheduleResult.data.shiftTypes] : 
//             scheduleResult.data.shiftTypes;
//         });
//       }
//       if (scheduleResult.data.schedulesByDate) {
//         setSchedulesByDate(scheduleResult.data.schedulesByDate);
//       }
//       if (scheduleResult.data.schedules) {
//         setSchedules(scheduleResult.data.schedules);
//       }
//       // ✅ 設定班表名稱
//       if (scheduleResult.data.classMonthName && setCurrentClassMonthName) {
//         console.log('✅ 設定班表名稱:', scheduleResult.data.classMonthName);
//         setCurrentClassMonthName(scheduleResult.data.classMonthName);
//       }
//     } else {
//       // ✅ 即使排班資料查詢失敗，也嘗試設定班表名稱
//       if (scheduleResult.data && scheduleResult.data.classMonthName && setCurrentClassMonthName) {
//         console.log('⚠️ 排班資料查詢失敗，但設定班表名稱:', scheduleResult.data.classMonthName);
//         setCurrentClassMonthName(scheduleResult.data.classMonthName);
//       }
//       throw new Error(scheduleResult.error);
//     }
    
//     return true;
//   } catch (err) {
//     console.error('查詢失敗:', err);
//     setError('查詢失敗，請檢查統一編號和部門是否正確');
//     return false;
//   } finally {
//     setLoading(false);
//   }
// };

// // 🔍 載入初始資料 - 修改版本
// export const loadInitialData = async (
//   companyId, 
//   department, 
//   selectedYear, 
//   selectedMonth, 
//   setShiftTypes, 
//   setEmployees, 
//   setSchedules, 
//   setSchedulesByDate, 
//   setError, 
//   setLoading,
//   setCurrentClassMonthName,
//   selectedMonthType = '下月'
// ) => {
//   if (!companyId || companyId.trim() === '') {
//     setError('無法從 Cookie 讀取統一編號');
//     return false;
//   }
  
//   setLoading(true);
//   console.log('開始執行 API 查詢...');
  
//   try {
//     // 獲取班別類型
//     const shiftTypesResult = await fetchShiftTypesAPI(companyId, department);
//     if (shiftTypesResult.success) {
//       setShiftTypes(shiftTypesResult.data);
//     } else {
//       throw new Error(shiftTypesResult.error);
//     }

//     // 🔥 修改：獲取員工資料 - 查詢輪班制員工
//     console.log('🔍 開始載入輪班制員工...');
//     const employeesResult = await fetchScheduledShiftEmployeesAPI(companyId);
//     if (employeesResult.success) {
//       console.log('🎯 成功載入輪班制員工資料:', employeesResult.data);
//       setEmployees(employeesResult.data);
//     } else {
//       console.error('❌ 輪班制員工資料載入失敗:', employeesResult.error);
//       throw new Error(employeesResult.error);
//     }

//     // 獲取排班資料（傳遞 selectedMonthType）
//     const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth, selectedMonthType);
//     if (scheduleResult.success) {
//       if (scheduleResult.data.shiftTypes) {
//         setShiftTypes(prev => {
//           return prev.length > 0 ? 
//             [...prev.filter(p => !scheduleResult.data.shiftTypes.find(s => s.shift_type_id === p.shift_type_id)), 
//              ...scheduleResult.data.shiftTypes] : 
//             scheduleResult.data.shiftTypes;
//         });
//       }
//       if (scheduleResult.data.schedulesByDate) {
//         setSchedulesByDate(scheduleResult.data.schedulesByDate);
//       }
//       if (scheduleResult.data.schedules) {
//         setSchedules(scheduleResult.data.schedules);
//       }
//       // ✅ 設定班表名稱
//       if (scheduleResult.data.classMonthName && setCurrentClassMonthName) {
//         console.log('✅ 載入初始資料時設定班表名稱:', scheduleResult.data.classMonthName);
//         setCurrentClassMonthName(scheduleResult.data.classMonthName);
//       }
//     } else {
//       // ✅ 即使失敗也嘗試設定班表名稱
//       if (scheduleResult.data && scheduleResult.data.classMonthName && setCurrentClassMonthName) {
//         console.log('⚠️ 排班資料查詢失敗，但設定班表名稱:', scheduleResult.data.classMonthName);
//         setCurrentClassMonthName(scheduleResult.data.classMonthName);
//       }
//       throw new Error(scheduleResult.error);
//     }
    
//     return true;
//   } catch (err) {
//     console.error('查詢失敗:', err);
//     setError(`查詢失敗: ${err.message}`);
//     return false;
//   } finally {
//     setLoading(false);
//   }
// };

// // 📅 載入月份資料 - 修改版本
// export const loadMonthData = async (
//   companyId, 
//   newYear, 
//   newMonth, 
//   setShiftTypes, 
//   setSchedulesByDate, 
//   setSchedules, 
//   setError, 
//   setLoading, 
//   setConflictWarnings,
//   setCurrentClassMonthName,
//   selectedMonthType = '下月'
// ) => {
//   if (!companyId) return;
  
//   setLoading(true);
//   setError(null);
//   setConflictWarnings([]);
  
//   try {
//     // 傳遞 selectedMonthType
//     const scheduleResult = await fetchCompanyScheduleAPI(companyId, newYear, newMonth, selectedMonthType);
//     if (scheduleResult.success) {
//       if (scheduleResult.data.shiftTypes) {
//         setShiftTypes(prev => {
//           return prev.length > 0 ? 
//             [...prev.filter(p => !scheduleResult.data.shiftTypes.find(s => s.shift_type_id === p.shift_type_id)), 
//              ...scheduleResult.data.shiftTypes] : 
//             scheduleResult.data.shiftTypes;
//         });
//       }
//       if (scheduleResult.data.schedulesByDate) {
//         setSchedulesByDate(scheduleResult.data.schedulesByDate);
//       }
//       if (scheduleResult.data.schedules) {
//         setSchedules(scheduleResult.data.schedules);
//       }
//       // ✅ 設定班表名稱
//       if (scheduleResult.data.classMonthName && setCurrentClassMonthName) {
//         console.log('✅ 載入月份資料時設定班表名稱:', scheduleResult.data.classMonthName);
//         setCurrentClassMonthName(scheduleResult.data.classMonthName);
//       }
//     } else {
//       // ✅ 即使失敗也嘗試設定班表名稱
//       if (scheduleResult.data && scheduleResult.data.classMonthName && setCurrentClassMonthName) {
//         console.log('⚠️ 排班資料查詢失敗，但設定班表名稱:', scheduleResult.data.classMonthName);
//         setCurrentClassMonthName(scheduleResult.data.classMonthName);
//       }
//       throw new Error(scheduleResult.error);
//     }
//   } catch (err) {
//     console.error('查詢班表失敗:', err);
//     setError('查詢班表失敗，請手動點擊查詢按鈕重試');
//   } finally {
//     setLoading(false);
//   }
// };

// // ✅ 新增：更新班表名稱 API
// export const updateClassMonthNameAPI = async (companyId, year, month, oldName, newName) => {
//   try {
//     const response = await axios.put(`${API_BASE_URL}/api/class-months/update-name`, {
//       company_id: companyId,
//       year: year,
//       month: month,
//       old_class_months_name: oldName,
//       new_class_months_name: newName,
//       updated_by: 'system'
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       timeout: 15000
//     });

//     console.log('✅ 更新班表名稱響應:', response.data);

//     if (response.data.Status === 'Ok') {
//       return { success: true, data: response.data.Data };
//     } else {
//       return { success: false, error: response.data.Msg || '更新失敗' };
//     }
//   } catch (error) {
//     console.error('❌ 更新班表名稱失敗:', error);
    
//     if (error.response) {
//       const errorMsg = `更新班表名稱 API 錯誤 ${error.response.status}: ${error.response.data?.Msg || error.response.data?.message || '請求失敗'}`;
//       return { success: false, error: errorMsg };
//     } else if (error.code === 'ECONNABORTED') {
//       return { success: false, error: '請求超時，請檢查網路連線' };
//     }
    
//     // 提供更友好的錯誤訊息
//     if (error.message.includes('Unexpected token')) {
//       return { success: false, error: 'API 端點不存在，請聯繫系統管理員' };
//     }
    
//     return { success: false, error: error.message };
//   }
// };
import axios from 'axios';
import Cookies from 'js-cookie'; // 🔥 加入 Cookies 引入
import { getLocalDateString, getTargetYearMonth } from './ScheduleFunction';

// 設定 API 基礎 URL
const API_BASE_URL = 'https://rabbit.54ucl.com:3004';

// ===== 🔍 查詢相關 API 函數區域 =====

// ✅ 新增：獲取班表名稱 API
export const fetchClassMonthNameAPI = async (companyId, year, month) => {
  try {
    const params = {
      company_id: String(companyId).trim(),
      year: Number(year),
      month: Number(month)
    };
    
    console.log('🔍 發送班表名稱查詢請求:', params);
    
    const response = await axios.get(`${API_BASE_URL}/api/class-months`, {
      params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ 班表名稱查詢響應:', response.data);

    if (response.data.Status === 'Ok' && response.data.Data && response.data.Data.length > 0) {
      // 找到對應的班表記錄
      const classMonth = response.data.Data.find(item => 
        String(item.company_id).trim() === String(companyId).trim() && 
        Number(item.year) === Number(year) && 
        Number(item.month) === Number(month)
      );
      
      if (classMonth && classMonth.class_months_name) {
        console.log('✅ 找到班表名稱:', classMonth.class_months_name);
        return {
          success: true,
          data: classMonth.class_months_name
        };
      }
    }
    
    // 如果沒有找到，返回預設名稱
    const defaultName = `${year}年${month}月班表`;
    console.log('⚠️ 未找到班表名稱，使用預設名稱:', defaultName);
    return {
      success: true,
      data: defaultName
    };
    
  } catch (err) {
    console.error('❌ 獲取班表名稱失敗:', err);
    const defaultName = `${year}年${month}月班表`;
    
    if (err.response) {
      const errorMsg = `班表名稱 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { 
        success: false, 
        error: errorMsg,
        data: defaultName // 錯誤時也返回預設名稱
      };
    } else if (err.code === 'ECONNABORTED') {
      return { 
        success: false, 
        error: '請求超時，請檢查網路連線',
        data: defaultName
      };
    }
    return { 
      success: false, 
      error: `網路錯誤: ${err.message}`,
      data: defaultName
    };
  }
};

// 🔍 獲取公司排班資料 API - 修正版本
export const fetchCompanyScheduleAPI = async (companyId, year, month, selectedMonth = '下月') => {
  try {
    const params = {
      company_id: String(companyId).trim(),
      year: Number(year),
      month: Number(month)
    };
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const today = new Date();
    
    const startDateStr = getLocalDateString(startDate);
    const endDateStr = getLocalDateString(endDate);
    const todayStr = getLocalDateString(today);
    
    console.log('🔍 發送班表查詢請求:', params);
    console.log('🗓️ 查詢日期範圍:', {
      startDate: startDateStr,
      endDate: endDateStr,
      today: todayStr,
      totalDays: endDate.getDate(),
      isTodayInRange: todayStr >= startDateStr && todayStr <= endDateStr
    });
    
    // ✅ 同時查詢班表名稱和排班資料
    const [scheduleResponse, classNameResult] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/company/schedule`, {
        params: {
          ...params,
          start_date: startDateStr,
          end_date: endDateStr
        },
        headers: {
          'Accept': 'application/json'
        },
        timeout: 15000
      }),
      fetchClassMonthNameAPI(companyId, year, month)
    ]);

    console.log('✅ 班表查詢響應:', scheduleResponse.data);
    console.log('✅ 班表名稱查詢結果:', classNameResult);
    console.log('🎯 API 返回的排班數據:', scheduleResponse.data.Data?.schedules?.length || 0, '筆');

    if (scheduleResponse.data.Status === 'Ok') {
      const scheduleData = scheduleResponse.data.Data;
      
      // ✅ 直接使用資料庫的原始日期，不要重新構建
      const employeeSchedules = {};
      if (scheduleData.schedules) {
        scheduleData.schedules.forEach(schedule => {
          if (!employeeSchedules[schedule.employee_id]) {
            employeeSchedules[schedule.employee_id] = {};
          }
          
          // ✅ 直接使用資料庫返回的原始日期
          const startDate = new Date(schedule.start_date);
          const endDate = new Date(schedule.end_date);
          
          console.log('🗓️ 處理排班:', {
            employee: schedule.employee_id,
            startDate: getLocalDateString(startDate),
            endDate: getLocalDateString(endDate),
            originalStart: schedule.start_date,
            originalEnd: schedule.end_date
            // 🎯 移除 targetYear 和 targetMonth 相關邏輯
          });
          
          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dateStr = getLocalDateString(date);
            
            employeeSchedules[schedule.employee_id][dateStr] = {
              shift_type_id: schedule.shift_type_id,
              shift_name: schedule.shift_info.shift_category,
              start_time: schedule.shift_info.start_time,
              end_time: schedule.shift_info.end_time,
              break_time_start: schedule.shift_info.break_time_start,
              break_time_end: schedule.shift_info.break_time_end,
              repeat_frequency: schedule.repeat_frequency,
              schedule_id: schedule.schedule_id,
              company_id: schedule.company_id,
              employee_id: schedule.employee_id,
              original_start_date: schedule.start_date,
              original_end_date: schedule.end_date
            };
          }
        });
        
        const todaySchedules = Object.keys(employeeSchedules).filter(empId => 
          employeeSchedules[empId][todayStr]
        );
        
        console.log('🎯 最終員工排班數據:', Object.keys(employeeSchedules).length, '名員工');
        console.log('🎯 今日排班檢查:', {
          today: todayStr,
          employeesWithTodaySchedule: todaySchedules.length,
          todaySchedules: todaySchedules.map(empId => ({
            employeeId: empId,
            schedule: employeeSchedules[empId][todayStr]
          }))
        });
      }
      
      return {
        success: true,
        data: {
          shiftTypes: scheduleData.shiftTypes,
          schedulesByDate: scheduleData.schedulesByDate,
          schedules: employeeSchedules,
          classMonthName: classNameResult.data || `${year}年${month}月班表`
        }
      };
    } else {
      return {
        success: false,
        error: scheduleResponse.data.Msg || '無法獲取排班資料',
        data: {
          schedules: {},
          schedulesByDate: {},
          shiftTypes: [],
          classMonthName: classNameResult.data || `${year}年${month}月班表`
        }
      };
    }
  } catch (err) {
    console.error('❌ 班表查詢失敗:', err);
    if (err.response) {
      const errorMsg = `班表查詢 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { 
        success: false, 
        error: errorMsg,
        data: {
          schedules: {},
          schedulesByDate: {},
          shiftTypes: [],
          classMonthName: `${year}年${month}月班表`
        }
      };
    } else if (err.code === 'ECONNABORTED') {
      return { 
        success: false, 
        error: '請求超時，請檢查網路連線',
        data: {
          schedules: {},
          schedulesByDate: {},
          shiftTypes: [],
          classMonthName: `${year}年${month}月班表`
        }
      };
    }
    return { 
      success: false, 
      error: `網路錯誤: ${err.message}`,
      data: {
        schedules: {},
        schedulesByDate: {},
        shiftTypes: [],
        classMonthName: `${year}年${month}月班表`
      }
    };
  }
};

// 在 CheckSchedule.js 的 fetchShiftTypesAPI 函數中添加
export const fetchShiftTypesAPI = async (companyId, department) => {
  try {
    const params = { 
      company_id: String(companyId).trim() 
    };
    
    // if (department && department.trim() !== '') {
    //   params.department = String(department).trim();
    // }
    
    console.log('🔍 發送班別查詢請求:', params);
    
    const response = await axios.get(`${API_BASE_URL}/api/company/shifts`, {
      params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ 班別查詢響應:', response.data);
    
    // ✅ 添加詳細的數據檢查
    console.log('🎯 班別數據詳細檢查:', {
      status: response.data.Status,
      dataExists: !!response.data.Data,
      dataType: typeof response.data.Data,
      dataLength: Array.isArray(response.data.Data) ? response.data.Data.length : 'not array',
      actualData: response.data.Data
    });

    if (response.data.Status === 'Ok') {
      const shifts = response.data.Data || [];
      console.log('🎯 處理後的班別數據:', shifts);
      
      // ✅ 檢查每個班別的結構
      shifts.forEach((shift, index) => {
        console.log(`🔍 班別 ${index + 1}:`, {
          shift_type_id: shift.shift_type_id,
          shift_name: shift.shift_name,
          shift_category: shift.shift_category,
          start_time: shift.start_time,
          end_time: shift.end_time,
          fullObject: shift
        });
      });
      
      return {
        success: true,
        data: shifts
      };
    } else {
      return {
        success: false,
        error: response.data.Msg || '無法獲取排班類型'
      };
    }
  } catch (err) {
    console.error('❌ 獲取排班類型失敗:', err);
    if (err.response) {
      const errorMsg = `班別 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (err.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    return { success: false, error: `網路錯誤: ${err.message}` };
  }
};

// 🔥 新增：備用員工查詢方案
const fallbackEmployeeQuery = async (companyId) => {
  try {
    const actualCompanyId = Cookies.get('company_id') || companyId;
    
    // 🔥 嘗試使用不同的 API 端點
    const alternativeEndpoints = [
      `/api/company/employees/${actualCompanyId}`,
      `/api/company/${actualCompanyId}/employees`,
      `/api/employee-basic-information/${actualCompanyId}`
    ];

    for (const endpoint of alternativeEndpoints) {
      try {
        console.log('🔄 嘗試備用端點:', endpoint);
        
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-company-id': actualCompanyId
          },
          timeout: 5000
        });

        if (response.data && response.data.Status === 'Ok' && response.data.Data) {
          console.log('✅ 備用端點成功:', endpoint);
          
          const employees = Array.isArray(response.data.Data) ? response.data.Data : [response.data.Data];
          
          // 篩選排班制員工
          const scheduledEmployees = employees.filter(emp => 
            emp.shift_system === 'Scheduled Shift' || 
            emp.shift_system === 'scheduled_shift' ||
            emp.shift_system === '排班制'
          );

          return scheduledEmployees.map(employee => ({
            ...employee,
            employee_id: employee.employee_id || employee.id,
            name: employee.name || '未知姓名',
            department: employee.department || '未知部門',
            position: employee.position || '員工',
            company_id: actualCompanyId,
            job_details: {
              shift_system: employee.shift_system || 'Scheduled Shift',
              employment_status: employee.employment_status || 'Active',
              salary_type: employee.salary_type || 'Hourly'
            }
          }));
        }
      } catch (endpointError) {
        console.log('❌ 備用端點失敗:', endpoint, endpointError.message);
        continue;
      }
    }

    // 🔥 如果所有 API 都失敗，使用硬編碼的測試資料
    console.log('⚠️ 所有 API 端點都失敗，使用測試資料');
    return [
      {
        employee_id: '001',
        name: '朱先生',
        department: '資管系',
        position: '老師的學生',
        company_id: actualCompanyId,
        shift_system: 'Scheduled Shift',
        employment_status: 'Active',
        salary_type: 'Hourly',
        job_details: {
          shift_system: 'Scheduled Shift',
          employment_status: 'Active',
          salary_type: 'Hourly'
        }
      },
      {
        employee_id: '002',
        name: '朱先生',
        department: '資管系',
        position: '老師的學生',
        company_id: actualCompanyId,
        shift_system: 'Scheduled Shift',
        employment_status: 'Active',
        salary_type: 'Hourly',
        job_details: {
          shift_system: 'Scheduled Shift',
          employment_status: 'Active',
          salary_type: 'Hourly'
        }
      },
      {
        employee_id: '003',
        name: '蕭美女',
        department: '資管系',
        position: '老師的學生',
        company_id: actualCompanyId,
        shift_system: 'Scheduled Shift',
        employment_status: 'Active',
        salary_type: 'Hourly',
        job_details: {
          shift_system: 'Scheduled Shift',
          employment_status: 'Active',
          salary_type: 'Hourly'
        }
      }
    ];

  } catch (error) {
    console.error('❌ 備用查詢也失敗:', error);
    return [];
  }
};

// 🔥 修改：使用正確的員工ID格式查詢職務詳情
export const fetchScheduledShiftEmployeesAPI = async (companyId) => {
  try {
    console.log('🔍 開始查詢輪班制員工...');
    
    const actualCompanyId = Cookies.get('company_id') || companyId;
    console.log('🔍 使用的 company_id:', actualCompanyId);

    // 🔥 步驟1：先獲取所有員工基本資料
    const basicResponse = await axios.post(`${API_BASE_URL}/api/employees`, {
      company_id: actualCompanyId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ 員工基本資料查詢響應:', basicResponse.data);

    if (!basicResponse.data || basicResponse.data.Status !== 'Ok' || !basicResponse.data.Data) {
      console.log('❌ 員工基本資料查詢失敗');
      return [];
    }

    const basicEmployees = Array.isArray(basicResponse.data.Data) ? basicResponse.data.Data : [basicResponse.data.Data];
    console.log('✅ 獲取到', basicEmployees.length, '位員工基本資料');

    // 🔥 步驟2：逐一查詢每個員工的職務詳情
    const scheduledShiftEmployees = [];
    
    for (const employee of basicEmployees) {
      try {
        const originalEmployeeId = employee.employee_id; // 1, 2, 3
        // 🔥 轉換為三位數字串格式
        const paddedEmployeeId = originalEmployeeId.toString().padStart(3, '0'); // 001, 002, 003
        
        console.log(`🔍 查詢員工 ${originalEmployeeId} -> ${paddedEmployeeId} (${employee.name}) 的職務詳情...`);
        
        // 🔥 使用職務詳情 API - 使用補零後的ID
        const jobDetailsResponse = await axios.get(
          `${API_BASE_URL}/api/employee-job-details/${actualCompanyId}/${paddedEmployeeId}`,
          {
            headers: {
              'Accept': 'application/json'
            },
            timeout: 8000
          }
        );

        console.log(`📋 員工 ${paddedEmployeeId} 職務詳情響應:`, jobDetailsResponse.data);

        if (jobDetailsResponse.data && jobDetailsResponse.data.Status === 'Ok' && jobDetailsResponse.data.Data) {
          const jobDetails = jobDetailsResponse.data.Data;
          
          console.log(`🔍 員工 ${paddedEmployeeId} 的班制: ${jobDetails.shift_system}`);
          
          // 🔥 檢查是否為排班制
          const isScheduledShift = jobDetails.shift_system === 'Scheduled Shift' || 
                                  jobDetails.shift_system === 'scheduled_shift' ||
                                  jobDetails.shift_system === '排班制';
          
          if (isScheduledShift) {
            console.log(`✅ 員工 ${paddedEmployeeId} (${employee.name}) 是排班制員工`);
            
            // 🔥 合併基本資料和職務詳情
            scheduledShiftEmployees.push({
              employee_id: paddedEmployeeId, // 001, 002, 003
              original_id: originalEmployeeId, // 1, 2, 3
              name: employee.name || jobDetails.name || '未知姓名',
              company_id: actualCompanyId,
              // 優先使用職務詳情，其次使用基本資料
              department: jobDetails.department || employee.department || '未知部門',
              position: jobDetails.position || employee.position || '員工',
              job_grade: jobDetails.job_grade || employee.job_grade,
              shift_system: jobDetails.shift_system,
              employment_status: jobDetails.employment_status || employee.employment_status || 'Active',
              salary_type: jobDetails.salary_type || employee.salary_type || 'Monthly',
              is_manager: jobDetails.is_manager || employee.job_grade === 'hr' || false,
              supervisor: jobDetails.supervisor || employee.supervisor,
              hire_date: jobDetails.hire_date || employee.hire_date,
              // 基本資料
              gender: employee.gender,
              mobile_number: employee.mobile_number,
              // 完整職務詳情
              job_details: jobDetails
            });
          } else {
            console.log(`❌ 員工 ${paddedEmployeeId} (${employee.name}) 不是排班制員工，班制: ${jobDetails.shift_system}`);
          }
        } else {
          console.log(`⚠️ 員工 ${paddedEmployeeId} 沒有職務詳情或查詢失敗`);
          
          // 🔥 如果職務詳情查詢失敗，檢查基本資料中的班制
          if (employee.shift_system === 'Scheduled Shift' || 
              employee.shift_system === 'scheduled_shift' ||
              employee.shift_system === '排班制') {
            
            console.log(`⚠️ 員工 ${paddedEmployeeId} 職務詳情查詢失敗，但基本資料顯示為排班制`);
            
            scheduledShiftEmployees.push({
              employee_id: paddedEmployeeId,
              original_id: originalEmployeeId,
              name: employee.name || '未知姓名',
              department: employee.department || '未知部門',
              position: employee.position || '員工',
              company_id: actualCompanyId,
              shift_system: employee.shift_system,
              employment_status: employee.employment_status || 'Active',
              salary_type: employee.salary_type || 'Monthly',
              is_manager: employee.job_grade === 'hr' || false,
              supervisor: employee.supervisor,
              gender: employee.gender,
              mobile_number: employee.mobile_number,
              job_details: {
                shift_system: employee.shift_system,
                employment_status: employee.employment_status || 'Active',
                salary_type: employee.salary_type || 'Monthly',
                note: '職務詳情查詢失敗，使用基本資料'
              }
            });
          }
        }
      } catch (detailError) {
        console.error(`❌ 查詢員工職務詳情時發生錯誤:`, detailError.message);
        
        // 🔥 如果職務詳情查詢失敗，嘗試使用原始ID再查一次
        if (detailError.response && detailError.response.status === 404) {
          console.log(`🔄 使用原始ID ${employee.employee_id} 重新嘗試查詢職務詳情...`);
          
          try {
            const retryResponse = await axios.get(
              `${API_BASE_URL}/api/employee-job-details/${actualCompanyId}/${employee.employee_id}`,
              {
                headers: { 'Accept': 'application/json' },
                timeout: 5000
              }
            );
            
            if (retryResponse.data && retryResponse.data.Status === 'Ok' && retryResponse.data.Data) {
              const jobDetails = retryResponse.data.Data;
              console.log(`✅ 使用原始ID查詢成功:`, jobDetails);
              
              if (jobDetails.shift_system === 'Scheduled Shift' || 
                  jobDetails.shift_system === 'scheduled_shift' ||
                  jobDetails.shift_system === '排班制') {
                
                const paddedEmployeeId = employee.employee_id.toString().padStart(3, '0');
                scheduledShiftEmployees.push({
                  employee_id: paddedEmployeeId,
                  original_id: employee.employee_id,
                  name: employee.name || jobDetails.name || '未知姓名',
                  company_id: actualCompanyId,
                  department: jobDetails.department || employee.department || '未知部門',
                  position: jobDetails.position || employee.position || '員工',
                  shift_system: jobDetails.shift_system,
                  employment_status: jobDetails.employment_status || 'Active',
                  salary_type: jobDetails.salary_type || 'Monthly',
                  job_details: jobDetails
                });
              }
            }
          } catch (retryError) {
            console.error(`❌ 使用原始ID重試也失敗:`, retryError.message);
          }
        }
        continue;
      }
    }

    console.log('🎯 最終找到', scheduledShiftEmployees.length, '位輪班制員工');
    
    if (scheduledShiftEmployees.length > 0) {
      console.log('✅ 輪班制員工列表:');
      scheduledShiftEmployees.forEach(emp => {
        console.log(`  - ${emp.employee_id} (${emp.name}) - ${emp.department} - ${emp.position} - 班制: ${emp.shift_system}`);
      });
      return scheduledShiftEmployees;
    } else {
      console.log('⚠️ 沒有找到輪班制員工');
      return [];
    }

  } catch (error) {
    console.error('❌ 查詢輪班制員工失敗:', error);
    return [];
  }
};


// 🔍 獲取員工資料 API - 修改版：查詢輪班制員工
export const fetchEmployeesAPI = async (companyId, shiftSystem = "Scheduled Shift") => {
  try {
    // 🔥 使用新的輪班制員工查詢函數
    console.log('🔍 開始查詢輪班制員工...');
    const result = await fetchScheduledShiftEmployeesAPI(companyId);
    
    if (result && result.length > 0) {
      console.log('🎯 成功獲取輪班制員工資料:', result);
      return {
        success: true,
        data: result
      };
    } else {
      console.error('❌ 輪班制員工資料獲取失敗: 沒有找到員工');
      return {
        success: false,
        error: '沒有找到輪班制員工'
      };
    }
  } catch (err) {
    console.error('❌ 獲取輪班制員工失敗:', err);
    if (err.response) {
      const errorMsg = `員工 API 錯誤 ${err.response.status}: ${err.response.data?.Msg || err.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (err.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    return { success: false, error: `網路錯誤: ${err.message}` };
  }
};

// ===== 🔍 搜尋和查詢處理函數區域 =====

// 🔍 處理公司資料查詢 - 修改版本
export const handleCompanySearch = async (
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
  setCurrentClassMonthName,
  selectedMonthType = '下月'
) => {
  if (!companyId) {
    setError('請輸入統一編號');
    return false;
  }
  
  setLoading(true);
  setError(null);
  setConflictWarnings([]);
  setSuccessMessage('');
  
  try {
    // 獲取班別類型
    const shiftTypesResult = await fetchShiftTypesAPI(companyId, department);
    if (shiftTypesResult.success) {
      setShiftTypes(shiftTypesResult.data);
    } else {
      throw new Error(shiftTypesResult.error);
    }

    // 🔥 修改：獲取員工資料 - 查詢輪班制員工
    console.log('🔍 開始查詢輪班制員工...');
    const employeesResult = await fetchScheduledShiftEmployeesAPI(companyId);
    if (employeesResult && employeesResult.length > 0) {
      console.log('🎯 成功獲取輪班制員工資料:', employeesResult);
      setEmployees(employeesResult);
    } else {
      console.error('❌ 輪班制員工資料獲取失敗: 沒有找到員工');
      throw new Error('沒有找到輪班制員工');
    }

    // 獲取排班資料（傳遞 selectedMonthType）
    const scheduleResult = await fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth, selectedMonthType);
    if (scheduleResult.success) {
      if (scheduleResult.data.shiftTypes) {
        setShiftTypes(prev => {
          return prev.length > 0 ? 
            [...prev.filter(p => !scheduleResult.data.shiftTypes.find(s => s.shift_type_id === p.shift_type_id)), 
             ...scheduleResult.data.shiftTypes] : 
            scheduleResult.data.shiftTypes;
        });
      }
      if (scheduleResult.data.schedulesByDate) {
        setSchedulesByDate(scheduleResult.data.schedulesByDate);
      }
      if (scheduleResult.data.schedules) {
        setSchedules(scheduleResult.data.schedules);
      }
      // ✅ 設定班表名稱
      if (scheduleResult.data.classMonthName && setCurrentClassMonthName) {
        console.log('✅ 設定班表名稱:', scheduleResult.data.classMonthName);
        setCurrentClassMonthName(scheduleResult.data.classMonthName);
      }
    } else {
      // ✅ 即使排班資料查詢失敗，也嘗試設定班表名稱
      if (scheduleResult.data && scheduleResult.data.classMonthName && setCurrentClassMonthName) {
        console.log('⚠️ 排班資料查詢失敗，但設定班表名稱:', scheduleResult.data.classMonthName);
        setCurrentClassMonthName(scheduleResult.data.classMonthName);
      }
      throw new Error(scheduleResult.error);
    }
    
    return true;
  } catch (err) {
    console.error('查詢失敗:', err);
    setError('查詢失敗，請檢查統一編號和部門是否正確');
    return false;
  } finally {
    setLoading(false);
  }
};

// 🔍 載入初始資料 - 修改版本，加入更好的錯誤處理
export const loadInitialData = async (
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
  setCurrentClassMonthName,
  selectedMonthType = '下月'
) => {
  if (!companyId || companyId.trim() === '') {
    setError('無法從 Cookie 讀取統一編號');
    return false;
  }
  
  setLoading(true);
  console.log('開始執行 API 查詢...');
  
  try {
    // 獲取班別類型
    const shiftTypesResult = await fetchShiftTypesAPI(companyId, department);
    if (shiftTypesResult.success) {
      setShiftTypes(shiftTypesResult.data);
    } else {
      throw new Error(shiftTypesResult.error);
    }

    // 🔥 修改：獲取員工資料 - 查詢輪班制員工
    console.log('🔍 開始載入輪班制員工...');
    const employeesResult = await fetchScheduledShiftEmployeesAPI(companyId);
    
    console.log('🎯 成功載入輪班制員工資料:', employeesResult);
    
    if (employeesResult && employeesResult.length === 0) {
      console.log('⚠️ 沒有找到排班制員工，但繼續載入其他資料...');
      // 🔥 不要因為沒有員工就停止載入其他資料
    }
    
    setEmployees(employeesResult || []);

    // 繼續載入其他資料...
    const [scheduleResult, classNameResult] = await Promise.allSettled([
      fetchCompanyScheduleAPI(companyId, selectedYear, selectedMonth, selectedMonthType),
      setCurrentClassMonthName ? fetchClassMonthNameAPI(companyId, selectedYear, selectedMonth) : Promise.resolve({ success: true, data: null })
    ]);

    // 處理排班資料結果
    if (scheduleResult.status === 'fulfilled' && scheduleResult.value.success) {
      const scheduleData = scheduleResult.value.data;
      if (scheduleData.shiftTypes) {
        setShiftTypes(prev => {
          return prev.length > 0 ? 
            [...prev.filter(p => !scheduleData.shiftTypes.find(s => s.shift_type_id === p.shift_type_id)), 
             ...scheduleData.shiftTypes] : 
            scheduleData.shiftTypes;
        });
      }
      if (scheduleData.schedulesByDate) {
        setSchedulesByDate(scheduleData.schedulesByDate);
      }
      if (scheduleData.schedules) {
        setSchedules(scheduleData.schedules);
      }
      // ✅ 設定班表名稱
      if (scheduleData.classMonthName && setCurrentClassMonthName) {
        console.log('✅ 載入初始資料時設定班表名稱:', scheduleData.classMonthName);
        setCurrentClassMonthName(scheduleData.classMonthName);
      }
    } else {
      console.log('⚠️ 排班資料載入失敗，使用空物件');
      setSchedules({});
      setSchedulesByDate({});
    }

    // 處理班表名稱結果
    if (classNameResult.status === 'fulfilled' && classNameResult.value.success && setCurrentClassMonthName) {
      if (classNameResult.value.data) {
        setCurrentClassMonthName(classNameResult.value.data);
      }
    }

    console.log('✅ 初始資料載入完成');
    return true;

  } catch (err) {
    console.error('❌ 載入初始資料失敗:', err);
    setError(`載入資料失敗: ${err.message}`);
    return false;
  } finally {
    setLoading(false);
  }
};

// 📅 載入月份資料 - 修改版本
export const loadMonthData = async (
  companyId, 
  newYear, 
  newMonth, 
  setShiftTypes, 
  setSchedulesByDate, 
  setSchedules, 
  setError, 
  setLoading, 
  setConflictWarnings,
  setCurrentClassMonthName,
  selectedMonthType = '下月'
) => {
  if (!companyId) return;
  
  setLoading(true);
  setError(null);
  setConflictWarnings([]);
  
  try {
    // 傳遞 selectedMonthType
    const scheduleResult = await fetchCompanyScheduleAPI(companyId, newYear, newMonth, selectedMonthType);
    if (scheduleResult.success) {
      if (scheduleResult.data.shiftTypes) {
        setShiftTypes(prev => {
          return prev.length > 0 ? 
            [...prev.filter(p => !scheduleResult.data.shiftTypes.find(s => s.shift_type_id === p.shift_type_id)), 
             ...scheduleResult.data.shiftTypes] : 
            scheduleResult.data.shiftTypes;
        });
      }
      if (scheduleResult.data.schedulesByDate) {
        setSchedulesByDate(scheduleResult.data.schedulesByDate);
      }
      if (scheduleResult.data.schedules) {
        setSchedules(scheduleResult.data.schedules);
      }
      // ✅ 設定班表名稱
      if (scheduleResult.data.classMonthName && setCurrentClassMonthName) {
        console.log('✅ 載入月份資料時設定班表名稱:', scheduleResult.data.classMonthName);
        setCurrentClassMonthName(scheduleResult.data.classMonthName);
      }
    } else {
      // ✅ 即使失敗也嘗試設定班表名稱
      if (scheduleResult.data && scheduleResult.data.classMonthName && setCurrentClassMonthName) {
        console.log('⚠️ 排班資料查詢失敗，但設定班表名稱:', scheduleResult.data.classMonthName);
        setCurrentClassMonthName(scheduleResult.data.classMonthName);
      }
      throw new Error(scheduleResult.error);
    }
  } catch (err) {
    console.error('查詢班表失敗:', err);
    setError('查詢班表失敗，請手動點擊查詢按鈕重試');
  } finally {
    setLoading(false);
  }
};

// ✅ 新增：更新班表名稱 API
export const updateClassMonthNameAPI = async (companyId, year, month, oldName, newName) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/class-months/update-name`, {
      company_id: companyId,
      year: year,
      month: month,
      old_class_months_name: oldName,
      new_class_months_name: newName,
      updated_by: 'system'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000
    });

    console.log('✅ 更新班表名稱響應:', response.data);

    if (response.data.Status === 'Ok') {
      return { success: true, data: response.data.Data };
    } else {
      return { success: false, error: response.data.Msg || '更新失敗' };
    }
  } catch (error) {
    console.error('❌ 更新班表名稱失敗:', error);
    
    if (error.response) {
      const errorMsg = `更新班表名稱 API 錯誤 ${error.response.status}: ${error.response.data?.Msg || error.response.data?.message || '請求失敗'}`;
      return { success: false, error: errorMsg };
    } else if (error.code === 'ECONNABORTED') {
      return { success: false, error: '請求超時，請檢查網路連線' };
    }
    
    // 提供更友好的錯誤訊息
    if (error.message.includes('Unexpected token')) {
      return { success: false, error: 'API 端點不存在，請聯繫系統管理員' };
    }
    
    return { success: false, error: error.message };
  }
};
