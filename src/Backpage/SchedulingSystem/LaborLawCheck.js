// import axios from 'axios';

// // 🔧 API 基礎 URL - 連接到您的 Flask API
// const LABOR_LAW_API_BASE_URL = 'http://localhost:5000';

// /**
//  * 🔍 檢查排班是否符合勞基法
//  * @param {Array} scheduleData - 排班資料陣列
//  * @param {Array} checkTypes - 要檢查的條文 ['30', '32', '34', '35']
//  * @returns {Object} 檢查結果
//  */
// export const checkLaborLawCompliance = async (scheduleData, checkTypes = ['30', '32', '34', '35']) => {
//   try {
//     console.log('🔍 發送勞基法檢查請求:', { 
//       scheduleCount: scheduleData.length, 
//       checkTypes 
//     });
    
//     const response = await axios.post(
//       `${LABOR_LAW_API_BASE_URL}/api/check-labor-law`,
//       {
//         schedule_data: scheduleData,
//         check_types: checkTypes
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         timeout: 30000 // 30秒超時
//       }
//     );
    
//     console.log('✅ 勞基法檢查響應:', response.data);
    
//     return {
//       success: true,
//       data: response.data
//     };
    
//   } catch (err) {
//     console.error('❌ 勞基法檢查失敗:', err);
    
//     if (err.response) {
//       // 服務器回應錯誤
//       return {
//         success: false,
//         error: `檢查失敗: ${err.response.data?.error || err.response.statusText}`
//       };
//     } else if (err.code === 'ECONNABORTED') {
//       // 超時
//       return {
//         success: false,
//         error: '檢查超時，請稍後再試'
//       };
//     } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
//       // 網路錯誤
//       return {
//         success: false,
//         error: '無法連接到檢查服務，請確認 Python API 服務是否運行 (http://localhost:5000)'
//       };
//     }
    
//     return {
//       success: false,
//       error: `檢查失敗: ${err.message}`
//     };
//   }
// };

// /**
//  * 📊 格式化排班資料為 API 所需格式
//  * @param {Object} schedules - 排班物件 {employeeId: {date: scheduleInfo}}
//  * @param {Array} employees - 員工列表
//  * @param {Array} shiftTypes - 班別類型列表
//  * @param {number} year - 年份
//  * @param {number} month - 月份
//  * @returns {Array} 格式化後的排班資料
//  */
// export const formatScheduleDataForCheck = (schedules, employees, shiftTypes, year, month) => {
//   const formattedData = [];
  
//   console.log('📊 開始格式化排班資料...', {
//     employeeCount: Object.keys(schedules).length,
//     year,
//     month
//   });
  
//   Object.keys(schedules).forEach(employeeId => {
//     const employee = employees.find(e => e.employee_id === parseInt(employeeId));
//     if (!employee) {
//       console.warn(`⚠️ 找不到員工 ID: ${employeeId}`);
//       return;
//     }
    
//     Object.keys(schedules[employeeId]).forEach(dateStr => {
//       const schedule = schedules[employeeId][dateStr];
//       if (!schedule || !schedule.shift_type_id) return;
      
//       const shiftType = shiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
//       if (!shiftType) {
//         console.warn(`⚠️ 找不到班別 ID: ${schedule.shift_type_id}`);
//         return;
//       }
      
//       formattedData.push({
//         employee_id: employee.employee_id,
//         employee_name: employee.employee_name,
//         date: dateStr,
//         shift_name: shiftType.shift_name,
//         start_time: shiftType.start_time,
//         end_time: shiftType.end_time,
//         break_time_start: shiftType.break_time_start || null,
//         break_time_end: shiftType.break_time_end || null
//       });
//     });
//   });
  
//   console.log(`✅ 格式化完成: ${formattedData.length} 筆排班資料`);
//   return formattedData;
// };

// /**
//  * 🎨 取得違規嚴重程度顏色
//  * @param {string} severity - 嚴重程度 ('輕微', '中等', '嚴重')
//  * @returns {string} 顏色代碼
//  */
// export const getSeverityColor = (severity) => {
//   switch (severity) {
//     case '輕微': return '#ffa500';
//     case '中等': return '#ff6b35';
//     case '嚴重': return '#e74c3c';
//     default: return '#95a5a6';
//   }
// };

// /**
//  * 🏥 健康檢查 - 確認 API 服務是否可用
//  * @returns {boolean} API 是否正常運行
//  */
// export const checkAPIHealth = async () => {
//   try {
//     const response = await axios.get(`${LABOR_LAW_API_BASE_URL}/api/health`, {
//       timeout: 5000
//     });
//     console.log('✅ API 健康檢查通過:', response.data);
//     return response.data.status === 'ok';
//   } catch (err) {
//     console.error('❌ API 健康檢查失敗:', err.message);
//     return false;
//   }
// };
import axios from 'axios';

// 🔧 API 基礎 URL - 連接到您的 Flask API
const LABOR_LAW_API_BASE_URL = 'http://localhost:5000';

// ✅ 固定的員工名稱
const DEFAULT_EMPLOYEE_NAME = '高科大';

/**
 * 🔍 檢查排班是否符合勞基法
 * @param {Array} scheduleData - 排班資料陣列
 * @param {Array} checkTypes - 要檢查的條文 ['30', '32', '34', '35']
 * @returns {Object} 檢查結果
 */
export const checkLaborLawCompliance = async (scheduleData, checkTypes = ['30', '32', '34', '35']) => {
  try {
    console.log('🔍 發送勞基法檢查請求:', { 
      scheduleCount: scheduleData.length, 
      checkTypes 
    });
    
    const response = await axios.post(
      `${LABOR_LAW_API_BASE_URL}/api/check-labor-law`,
      {
        schedule_data: scheduleData,
        check_types: checkTypes
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30秒超時
      }
    );
    
    console.log('✅ 勞基法檢查響應:', response.data);
    
    return {
      success: true,
      data: response.data
    };
    
  } catch (err) {
    console.error('❌ 勞基法檢查失敗:', err);
    
    if (err.response) {
      // 服務器回應錯誤
      return {
        success: false,
        error: `檢查失敗: ${err.response.data?.error || err.response.statusText}`
      };
    } else if (err.code === 'ECONNABORTED') {
      // 超時
      return {
        success: false,
        error: '檢查超時，請稍後再試'
      };
    } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
      // 網路錯誤
      return {
        success: false,
        error: '無法連接到檢查服務，請確認 Python API 服務是否運行 (http://localhost:5000)'
      };
    }
    
    return {
      success: false,
      error: `檢查失敗: ${err.message}`
    };
  }
};

/**
 * 📊 格式化排班資料為 API 所需格式
 * @param {Object} schedules - 排班物件 {employeeId: {date: scheduleInfo}}
 * @param {Array} employees - 員工列表
 * @param {Array} shiftTypes - 班別類型列表
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Array} 格式化後的排班資料
 */
export const formatScheduleDataForCheck = (schedules, employees, shiftTypes, year, month) => {
  const formattedData = [];
  
  console.log('📊 開始格式化排班資料...', {
    employeeCount: Object.keys(schedules).length,
    year,
    month
  });
  
  Object.keys(schedules).forEach(employeeId => {
    const employee = employees.find(e => e.employee_id === parseInt(employeeId));
    if (!employee) {
      console.warn(`⚠️ 找不到員工 ID: ${employeeId}`);
      return;
    }
    
    Object.keys(schedules[employeeId]).forEach(dateStr => {
      const schedule = schedules[employeeId][dateStr];
      if (!schedule || !schedule.shift_type_id) return;
      
      const shiftType = shiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
      if (!shiftType) {
        console.warn(`⚠️ 找不到班別 ID: ${schedule.shift_type_id}`);
        return;
      }
      
      formattedData.push({
        employee_id: employee.employee_id,
        employee_name: DEFAULT_EMPLOYEE_NAME,  // ✅ 寫死為 "高科大"
        date: dateStr,
        shift_name: shiftType.shift_name,
        start_time: shiftType.start_time,
        end_time: shiftType.end_time,
        break_time_start: shiftType.break_time_start || null,
        break_time_end: shiftType.break_time_end || null
      });
    });
  });
  
  console.log(`✅ 格式化完成: ${formattedData.length} 筆排班資料`);
  console.log('📋 前3筆資料樣本:', formattedData.slice(0, 3));
  
  return formattedData;
};

/**
 * 🎨 取得違規嚴重程度顏色
 * @param {string} severity - 嚴重程度 ('輕微', '中等', '嚴重')
 * @returns {string} 顏色代碼
 */
export const getSeverityColor = (severity) => {
  switch (severity) {
    case '輕微': return '#ffa500';
    case '中等': return '#ff6b35';
    case '嚴重': return '#e74c3c';
    default: return '#95a5a6';
  }
};

/**
 * 🏥 健康檢查 - 確認 API 服務是否可用
 * @returns {boolean} API 是否正常運行
 */
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${LABOR_LAW_API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    console.log('✅ API 健康檢查通過:', response.data);
    return response.data.status === 'ok';
  } catch (err) {
    console.error('❌ API 健康檢查失敗:', err.message);
    return false;
  }
};
