// import axios from 'axios';
// import Cookies from 'js-cookie';
// /**
//  * 員工登入API
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} password - 密碼
//  * @returns {Promise<Object>} 返回登入結果
//  */
// export const employeeLogin = async (companyId, employeeId, password) => {
//   try {
//     console.log('開始員工登入...', {
//       companyId,
//       employeeId,
//       hasPassword: !!password
//     });

//     // 參數驗證
//     if (!companyId || !employeeId || !password) {
//       throw new Error('缺少必要參數：公司統編、員工編號或密碼');
//     }

//     // 發送POST請求到新的API端點
//     const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         company_id: companyId,
//         employee_id: employeeId,
//         password: password
//       })
//     });

//     // 檢查HTTP狀態
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('登入API回應錯誤:', response.status, errorText);
//       throw new Error(`API請求失敗: ${response.status} - ${errorText}`);
//     }

//     // 解析回應數據
//     const responseData = await response.json();
//     console.log('登入結果:', { ...responseData });

//     // 檢查API回應狀態
//     if (responseData.Status !== "Ok") {
//       throw new Error(responseData.Msg || '登入失敗');
//     }

//     // 處理登入結果
//     const result = {
//       success: true,
//       data: responseData.Data || {},
//       message: responseData.Msg || '登入成功',
//       token: responseData.Data?.xtbb || null  // 使用 xtbb 作為 token
//     };

//     console.log('處理後的登入結果:', { ...result, token: result.token ? '[已設置]' : null });
//     return result;

//   } catch (error) {
//     console.error('登入失敗:', error);
    
//     // 返回錯誤結果
//     return {
//       success: false,
//       data: {},
//       message: error.message || '登入時發生未知錯誤',
//       error: error
//     };
//   }
// };


// /**
//  * 更新員工密碼API
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} oldPassword - 舊密碼
//  * @param {string} newPassword - 新密碼
//  * @returns {Promise<Object>} 返回更新密碼結果
//  */
// export const updateEmployeePassword = async (companyId, employeeId, oldPassword, newPassword) => {
//   try {
//     console.log('開始更新密碼...', {
//       companyId,
//       employeeId,
//       hasOldPassword: !!oldPassword,
//       hasNewPassword: !!newPassword
//     });

//     // 參數驗證
//     if (!companyId || !employeeId || !oldPassword || !newPassword) {
//       throw new Error('缺少必要參數：公司統編、員工編號、舊密碼或新密碼');
//     }

//     // 發送POST請求
//     const response = await fetch('https://rabbit.54ucl.com:3002/api/update-password', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         company_id: companyId,
//         employee_id: employeeId,
//         old_password: oldPassword,
//         new_password: newPassword
//       })
//     });

//     // 檢查HTTP狀態
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('更新密碼API回應錯誤:', response.status, errorText);
//       throw new Error(`API請求失敗: ${response.status} - ${errorText}`);
//     }

//     // 解析回應數據
//     const responseData = await response.json();
//     console.log('更新密碼結果:', responseData);

//     // 檢查API回應狀態
//     if (!responseData.success) {
//       throw new Error(responseData.message || '更新密碼失敗');
//     }

//     // 處理更新密碼結果
//     const result = {
//       success: true,
//       data: responseData.data || {},
//       message: responseData.message || '更新密碼成功'
//     };

//     console.log('處理後的更新密碼結果:', result);
//     return result;

//   } catch (error) {
//     console.error('更新密碼失敗:', error);
    
//     // 返回錯誤結果
//     return {
//       success: false,
//       data: {},
//       message: error.message || '更新密碼時發生未知錯誤',
//       error: error
//     };
//   }
// };



// /**
//  * 獲取員工資訊API - 使用 token 驗證
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} [token] - 認證 token (auth_xtbb)
//  * @returns {Promise<Object>} 返回員工資訊
//  */
// export const fetchEmployeeInfo = async (companyId, employeeId, token) => {
//   try {
//     console.log(`正在獲取員工資訊: 公司ID=${companyId}, 員工ID=${employeeId}`);
    
//     // 參數驗證
//     if (!companyId || !employeeId) {
//       throw new Error('缺少必要資訊，無法獲取員工資料');
//     }
    
//     // 準備請求參數
//     const requestData = {
//       company_id: companyId,
//       employee_id: employeeId
//     };
    
//     // 準備請求標頭
//     const headers = {
//       'Content-Type': 'application/json'
//     };
    
//     // 如果有 token，添加到標頭中
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     // 發送POST請求
//     const response = await axios.post('https://rabbit.54ucl.com:3004/api/employee/info', requestData, {
//       headers: headers
//     });

//     console.log('API 回應:', response.data);
    
//     // 檢查API回應狀態
//     if (response.data && response.data.Status === "Ok" && response.data.Data) {
//       const employeeData = response.data.Data;
      
//       // 處理職級，轉換為小寫以便比較
//       if (employeeData.job_grade) {
//         employeeData.job_grade = employeeData.job_grade.toLowerCase();
//       }
      
//       console.log(`使用者 ${employeeData.name} 的職級為: ${employeeData.job_grade || '未設定'}`);
//       console.log(`公司名稱: ${employeeData.company_name || '未設定'}`);
      
//       // 返回成功結果
//       return {
//         success: true,
//         data: employeeData,
//         message: '獲取員工資訊成功'
//       };
//     } else {
//       console.log('API 回應中沒有有效的員工資料');
//       throw new Error(response.data?.Msg || 'API 回應中沒有有效的員工資料');
//     }
//   } catch (err) {
//     console.error('獲取員工資訊錯誤:', err);
    
//     // 返回錯誤結果
//     return {
//       success: false,
//       data: {},
//       message: err.message || '獲取員工資訊時發生未知錯誤',
//       error: err
//     };
//   }
// };

// /**
//  * 從 cookies 獲取並驗證用戶認證資訊
//  * @param {Function} setLoading - 設置載入狀態的函數
//  * @param {Function} setAuthToken - 設置認證 token 的函數
//  * @param {Function} setCompanyId - 設置公司 ID 的函數
//  * @param {Function} setEmployeeId - 設置員工 ID 的函數
//  * @param {string} redirectUrl - 驗證失敗時重定向的 URL
//  * @returns {Promise<Object>} 驗證結果
//  */
// export const validateUserFromCookies = async (
//   setLoading,
//   setAuthToken,
//   setCompanyId,
//   setEmployeeId,
//   redirectUrl = '/apploginpmx/'
// ) => {
//   try {
//     if (setLoading) setLoading(true);
    
//     // 從 cookies 獲取認證資訊
//     const cookieCompanyId = Cookies.get('company_id');
//     const cookieEmployeeId = Cookies.get('employee_id');
//     // 獲取 auth_xtbb token
//     const cookieAuthToken = Cookies.get('auth_xtbb');
    
//     console.log('從 cookies 獲取的認證資訊:', {
//       company_id: cookieCompanyId,
//       employee_id: cookieEmployeeId,
//       auth_xtbb: cookieAuthToken ? '已設置' : '未設置'
//     });
    
//     if (!cookieCompanyId || !cookieEmployeeId || !cookieAuthToken) {
//       console.log('cookies 中缺少認證資訊，跳轉到登入頁面');
//       window.location.href = redirectUrl;
//       return { success: false, message: 'cookies 中缺少認證資訊' };
//     }
    
//     // 存儲 token 到 state 中
//     if (setAuthToken) {
//       setAuthToken(cookieAuthToken);
//       console.log('已設置 auth_xtbb 到狀態中');
//     }
    
//     // 調用 API 進行驗證 - 只需要公司ID和員工ID，不需要密碼
//     const response = await fetch('https://rabbit.54ucl.com:3004/api/employee/info', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${cookieAuthToken}` // 使用 auth_xtbb token 進行驗證
//       },
//       body: JSON.stringify({
//         company_id: cookieCompanyId,
//         employee_id: cookieEmployeeId
//         // 不再需要密碼
//       })
//     });
    
//     const data = await response.json();
    
//     if (response.ok && data.Status === "Ok") {
//       console.log('API 驗證成功:', data);
      
//       // 設置狀態中的公司和員工 ID
//       if (setCompanyId) setCompanyId(cookieCompanyId);
//       if (setEmployeeId) setEmployeeId(cookieEmployeeId);
      
//       // 繼續加載頁面
//       console.log('認證成功，繼續加載頁面');
//       return { 
//         success: true, 
//         message: '認證成功',
//         data: {
//           companyId: cookieCompanyId,
//           employeeId: cookieEmployeeId,
//           authToken: cookieAuthToken
//         }
//       };
//     } else {
//       console.error('API 驗證失敗:', data);
//       // 驗證失敗，跳轉到登入頁面
//       window.location.href = redirectUrl;
//       return { success: false, message: 'API 驗證失敗' };
//     }
//   } catch (error) {
//     console.error('驗證過程中發生錯誤:', error);
//     // 發生錯誤，跳轉到登入頁面
//     window.location.href = redirectUrl;
//     return { success: false, message: '驗證過程中發生錯誤', error };
//   } finally {
//     if (setLoading) setLoading(false);
//   }
// };


// /**=========================打卡頁面相關功能=========================**/
// /**
//  * 上班打卡功能
//  * @param {Object} params - 打卡所需參數
//  * @returns {Promise<Object>} 打卡結果
//  */
// export const handleClockIn = async ({
//   setLoading,
//   setError,
//   Checkinfo,
//   userLocation,
//   updateLocation,
//   networkInfo,
//   privateIp,
//   publicIp,
//   companyId,
//   employeeId,
//   authToken,
//   setClockInTime,
//   setPunchStatus,
//   setClockOutTime,
//   setClockOutStatus,
//   setClockOutResult,
//   setCurrentEventId,
//   checkAttendanceStatus,
//   fetchAttendanceRecords,
//   clockInResult
// }) => {
//   setLoading(true);
//   setError(null);
  
//   try {
//     // 使用 Checkinfo 獲取完整信息
//     const info = await Checkinfo();
//     console.log('打卡使用的完整信息:', info);

//     // 準備位置信息 - 多層備用方案
//     let location = {
//       // 優先使用 Checkinfo 獲取的位置，其次是 userLocation，最後是全局變量
//       latitude: info.latitude || userLocation.latitude || window.latitude,
//       longitude: info.longitude || userLocation.longitude || window.longitude
//     };

//     // 如果沒有位置信息，嘗試更新位置
//     if (!location.latitude || !location.longitude) {
//       try {
//         location = await updateLocation();
//         console.log('已更新位置信息:', location);
//       } catch (locError) {
//         console.error('獲取位置失敗:', locError);
        
//         // 如果仍然沒有位置信息，使用預設值（最後的備用方案）
//         if (!location.latitude || !location.longitude) {
//           console.warn('無法獲取位置信息，使用預設值');
//           location = {
//             latitude: 22.757182,  // 使用預設值
//             longitude: 120.337638
//           };
//           console.log('使用預設位置:', location);
//         } else {
//           setError('打卡失敗: 無法獲取位置信息，請確保已開啟位置權限');
//           return {
//             success: false,
//             message: '無法獲取位置信息，請確保已開啟位置權限',
//             error: locError
//           };
//         }
//       }
//     }

//     // 確保經緯度是有效的數字
//     if (isNaN(location.latitude) || isNaN(location.longitude)) {
//       console.error('經緯度不是有效數字:', location);
      
//       // 使用預設值作為最後的備用方案
//       location = {
//         latitude: 22.757182,  // 使用預設值
//         longitude: 120.337638
//       };
//       console.log('經緯度無效，使用預設位置:', location);
//     }

//     // 準備網絡信息
//     let networkData = {
//       ssid: info.ssid || networkInfo.ssid || window.ssid || 'UNKNOWN',
//       bssid: info.bssid || networkInfo.bssid || window.bssid || 'XX:XX:XX:XX:XX:XX',
//       isWifi: (info.ssid || networkInfo.ssid || window.ssid) !== 'Network line'
//     };

//     // 準備私有 IP - 多層備用方案
//     let xtbbddtxValue = info.privateIp || privateIp || window.xtbbddtx;
    
//     // 如果還是沒有獲取到，再嘗試一次從 Flutter 獲取
//     if (!xtbbddtxValue && window.flutter && typeof window.flutter.getxtbbddtx === 'function') {
//       try {
//         xtbbddtxValue = await window.flutter.getxtbbddtx();
//         console.log('最後嘗試從 Flutter 獲取私有 IP:', xtbbddtxValue);
//       } catch (e) {
//         console.error('最後嘗試獲取私有 IP 失敗:', e);
//       }
//     }
    
//     // 如果仍然沒有私有 IP，使用空字符串
//     if (!xtbbddtxValue) {
//       xtbbddtxValue = '';
//     }
    
//     // 輸出調試信息
//     console.log('準備打卡數據:');
//     console.log('- 位置信息:', location);
//     console.log('- 網絡信息:', networkData);
//     console.log('- 私有 IP:', xtbbddtxValue);
//     console.log('- 公共 IP:', publicIp || window.publicIp || '');

//     // 獲取當前時間 - 使用帶時區的 ISO 格式
//     const now = new Date();
    
//     // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
//     const tzOffset = -now.getTimezoneOffset();
//     const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
//     const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
//     const tzSign = tzOffset >= 0 ? '+' : '-';
    
//     const year = now.getFullYear();
//     const month = (now.getMonth() + 1).toString().padStart(2, '0');
//     const day = now.getDate().toString().padStart(2, '0');
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const seconds = now.getSeconds().toString().padStart(2, '0');
    
//     const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
    
//     // 本地時間格式化 - 僅用於顯示
//     const formattedTime = `${hours}:${minutes}:${seconds}`;
//     const formattedDate = `${year}-${month}-${day}`;
//     const timeForDisplay = `${hours}:${minutes}`;
    
//     // 準備網路資訊 - 根據連接類型設置
//     let ssidValue;
//     if (networkData.isWifi) {
//       // 如果是WiFi連接，使用SSID
//       ssidValue = networkData.ssid;
//     } else {
//       // 如果是固定網路，設為Network line
//       ssidValue = 'Network line';
//     }
    
//     // 構建打卡數據 - 使用從 Flutter 獲取的完整信息，移除預設值
// const payload = {
//   company_id: companyId,
//   employee_id: employeeId,
//   utc_timestamp: utcTimestamp,
//   ssid: ssidValue,
//   bssid: networkData.bssid,  // 添加 bssid
//   xtbbddtx: xtbbddtxValue || '',
//   public_ip: publicIp || window.publicIp || '',
//   longitude: location.longitude,
//   latitude: location.latitude
// };
    
//     console.log(`發送上班打卡請求 (使用 Checkinfo):`, JSON.stringify(payload, null, 2));
  
// const apiResult = await handleApiWithOfflineCache(
//   'https://rabbit.54ucl.com:3004/api/check-in-google',
//   payload,
//   {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${authToken}`
//   }
// );

// let responseData;
// if (apiResult.cached) {
//   // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
//   console.log('上班打卡已快取，等待網路恢復後上傳');
  
//   // 模擬成功回應以繼續 UI 更新
//   responseData = {
//     Status: "Ok",
//     Data: {
//       event_id: null // 離線時沒有 event_id
//     }
//   };
// } else {
//   // 線上狀態 - 處理正常的 API 回應
//   responseData = apiResult.data;
  
//   if (responseData.Status !== "Ok") {
//     throw new Error(responseData.Msg || '打卡處理失敗');
//   }
// }

    
//     console.log('上班打卡成功:', responseData);
    
//     // 獲取事件 ID
//     const eventId = responseData.Data?.event_id || null;
    
//     // 更新UI
//     setClockInTime(timeForDisplay);
//     setPunchStatus('CLOCKED_IN');
//     setClockOutTime('--:--'); // 重置下班時間
//     setClockOutStatus(null); // 重置下班打卡狀態
//     setClockOutResult(null); // 重置下班考勤結果
//     setCurrentEventId(eventId); // 設置當前事件ID
    
//     // 檢查打卡時間是否遲到，並檢查 SSID
//     const attendanceCheckResult = await checkAttendanceStatus(
//       formattedTime,
//       formattedDate,
//       eventId,
//       utcTimestamp
//     );
    
//     console.log('打卡狀態檢查結果:', attendanceCheckResult);
    
//     // 重要：查詢考勤記錄以獲取上班標籤狀態
//     setTimeout(() => {
//       fetchAttendanceRecords();
//     }, 2000);
    
//     // 保存打卡記錄到本地存儲 - 保持現有的考勤結果
//     const punchData = {
//       clockInTime: timeForDisplay,
//       clockInFullTime: formattedTime,
//       clockInDate: formattedDate,
//       clockInUtcTimestamp: utcTimestamp,
//       clockOutTime: null,
//       clockOutFullTime: null,
//       clockOutDate: null,
//       clockOutUtcTimestamp: null,
//       eventId: eventId, // 儲存事件 ID 以便下班打卡時使用
//       attendanceStatus: attendanceCheckResult.status === 'success' ? attendanceCheckResult.data : null, // 儲存考勤狀態
//       clockOutStatus: null, // 重置下班打卡狀態
//       clockInResult: clockInResult, // 保持現有的上班考勤結果
//       clockOutResult: null, // 重置下班考勤結果
//       // 儲存從 Flutter 獲取的信息
//       flutterInfo: info,
//       // 儲存使用的位置信息
//       locationUsed: location
//     };
    
//     localStorage.setItem(`punchData_${companyId}_${employeeId}_${formattedDate}`, JSON.stringify(punchData));
    
//     return {
//       success: true,
//       data: responseData.Data,
//       eventId: eventId,
//       message: '上班打卡成功'
//     };
    
//   } catch (err) {
//     console.error('上班打卡失敗:', err);
//     setError('上班打卡失敗: ' + (err.message || '未知錯誤'));
    
//     return {
//       success: false,
//       message: err.message || '上班打卡失敗',
//       error: err
//     };
//   } finally {
//     setLoading(false);
//   }
// };


// /**
//  * 下班打卡功能
//  * @param {Object} params - 打卡所需參數
//  * @returns {Promise<Object>} 打卡結果
//  */
// // 修改後的 handleClockOut 函數 - 確保獲取最新的公共 IP
// export const handleClockOut = async ({
//   clockInTime,
//   setError,
//   setLoading,
//   Checkinfo,
//   userLocation,
//   updateLocation,
//   networkInfo,
//   privateIp,
//   publicIp,
//   companyId,
//   employeeId,
//   currentEventId,
//   authToken,
//   ssidError,
//   setClockOutTime,
//   setPunchStatus,
//   checkClockOutStatus,
//   fetchAttendanceRecords,
//   clockOutResult,
//   currentDate
// }) => {
//   if (clockInTime === '--:--') {
//     setError('請先進行上班打卡');
//     return {
//       success: false,
//       message: '請先進行上班打卡'
//     };
//   }
  
//   setLoading(true);
//   setError(null);
  
//   try {
//     // 使用 Checkinfo 獲取完整信息
//     const info = await Checkinfo();
//     console.log('下班打卡使用的完整信息:', info);

//     // 準備位置信息
//     let location = {
//       latitude: info.latitude || userLocation.latitude,
//       longitude: info.longitude || userLocation.longitude
//     };

//     // 如果沒有位置信息，嘗試更新位置
//     if (!location.latitude || !location.longitude) {
//       try {
//         location = await updateLocation();
//         console.log('已更新位置信息:', location);
//       } catch (locError) {
//         console.error('獲取位置失敗:', locError);
//         setError('打卡失敗: 無法獲取位置信息，請確保已開啟位置權限');
//         return {
//           success: false,
//           message: '無法獲取位置信息，請確保已開啟位置權限',
//           error: locError
//         };
//       }
//     }

//     // 如果仍然沒有位置信息，則無法打卡
//     if (!location.latitude || !location.longitude) {
//       setError('打卡失敗: 無法獲取位置信息，請確保已開啟位置權限');
//       return {
//         success: false,
//         message: '無法獲取位置信息，請確保已開啟位置權限'
//       };
//     }

//     // 確保經緯度是有效的數字
//     if (isNaN(location.latitude) || isNaN(location.longitude)) {
//       console.error('經緯度不是有效數字:', location);
//       setError('打卡失敗: 獲取到的位置信息無效，請確保已開啟位置權限');
//       return {
//         success: false,
//         message: '獲取到的位置信息無效，請確保已開啟位置權限'
//       };
//     }

//     // 準備網絡信息
//     let networkData = {
//       ssid: info.ssid || networkInfo.ssid || 'UNKNOWN',
//       bssid: info.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
//       isWifi: info.ssid !== 'Network line'
//     };

//     // 準備私有 IP - 移除預設值 0.0.0.0
//     let xtbbddtxValue = info.privateIp || privateIp;
    
//     // 如果還是沒有獲取到，再嘗試一次從 Flutter 獲取
//     if (!xtbbddtxValue && window.flutter && typeof window.flutter.getxtbbddtx === 'function') {
//       try {
//         xtbbddtxValue = await window.flutter.getxtbbddtx();
//         console.log('最後嘗試從 Flutter 獲取私有 IP:', xtbbddtxValue);
//       } catch (e) {
//         console.error('最後嘗試獲取私有 IP 失敗:', e);
//       }
//     }
    
//     // 重新獲取公共 IP 地址 - 這是關鍵修改部分
//     let currentPublicIp = publicIp;
//     try {
//       console.log('下班打卡前重新獲取公共 IP...');
      
//       // 嘗試使用多個服務獲取公共 IP
//       // 方法1: 使用 ipify API
//       try {
//         const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
//           cache: 'no-store',
//           headers: {
//             'Cache-Control': 'no-cache, no-store, must-revalidate',
//             'Pragma': 'no-cache',
//             'Expires': '0'
//           }
//         });
        
//         if (ipifyResponse.ok) {
//           const ipifyData = await ipifyResponse.json();
//           if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
//             currentPublicIp = ipifyData.ip;
//             console.log('下班打卡: 從 ipify 獲取公共 IP:', ipifyData.ip);
//           } else {
//             console.log('下班打卡: ipify 返回伺服器 IP，嘗試其他方法');
//           }
//         }
//       } catch (err) {
//         console.error('下班打卡: 從 ipify 獲取公共 IP 失敗:', err);
//       }
      
//       // 如果 ipify 失敗，嘗試 ipinfo.io
//       if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//         try {
//           const ipinfoResponse = await fetch('https://ipinfo.io/json', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (ipinfoResponse.ok) {
//             const ipinfoData = await ipinfoResponse.json();
//             if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
//               currentPublicIp = ipinfoData.ip;
//               console.log('下班打卡: 從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
//             } else {
//               console.log('下班打卡: ipinfo.io 返回伺服器 IP，嘗試其他方法');
//             }
//           }
//         } catch (err) {
//           console.error('下班打卡: 從 ipinfo.io 獲取公共 IP 失敗:', err);
//         }
//       }
      
//       // 如果 ipinfo.io 也失敗，嘗試 cloudflare
//       if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//         try {
//           const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (cfResponse.ok) {
//             const cfText = await cfResponse.text();
//             const ipMatch = cfText.match(/ip=([0-9.]+)/);
//             if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
//               currentPublicIp = ipMatch[1];
//               console.log('下班打卡: 從 Cloudflare 獲取公共 IP:', ipMatch[1]);
//             } else {
//               console.log('下班打卡: Cloudflare 返回伺服器 IP，嘗試其他方法');
//             }
//           }
//         } catch (err) {
//           console.error('下班打卡: 從 Cloudflare 獲取公共 IP 失敗:', err);
//         }
//       }
      
//       // 最後嘗試自定義 API
//       if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//         try {
//           const customApiResponse = await fetch('https://rabbit.54ucl.com:3004/api/client-ip', {
//             cache: 'no-store',
//             headers: {
//               'Cache-Control': 'no-cache, no-store, must-revalidate',
//               'Pragma': 'no-cache',
//               'Expires': '0'
//             }
//           });
          
//           if (customApiResponse.ok) {
//             const customApiData = await customApiResponse.json();
//             if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
//               currentPublicIp = customApiData.ip;
//               console.log('下班打卡: 從自定義 API 獲取公共 IP:', customApiData.ip);
//             } else {
//               console.log('下班打卡: 自定義 API 返回伺服器 IP，使用備用方法');
//             }
//           }
//         } catch (err) {
//           console.error('下班打卡: 從自定義 API 獲取公共 IP 失敗:', err);
//         }
//       }
      
//       // 如果所有方法都失敗，使用空字符串
//       if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
//         console.log('下班打卡: 所有方法獲取公共 IP 失敗，使用空字符串');
//         currentPublicIp = '';
//       }
      
//     } catch (ipError) {
//       console.error('下班打卡: 獲取公共 IP 過程中發生錯誤:', ipError);
//       currentPublicIp = ''; // 出錯時使用空字符串
//     }

//     // 獲取當前時間 - 使用帶時區的 ISO 格式
//     const now = new Date();
    
//     // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
//     const tzOffset = -now.getTimezoneOffset();
//     const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
//     const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
//     const tzSign = tzOffset >= 0 ? '+' : '-';
    
//     const year = now.getFullYear();
//     const month = (now.getMonth() + 1).toString().padStart(2, '0');
//     const day = now.getDate().toString().padStart(2, '0');
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const seconds = now.getSeconds().toString().padStart(2, '0');
    
//     const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
    
//     // 本地時間格式化 - 僅用於顯示
//     const formattedTime = `${hours}:${minutes}:${seconds}`;
//     const formattedDate = `${year}-${month}-${day}`;
//     const timeForDisplay = `${hours}:${minutes}`;
    
//     // 準備網路資訊 - 根據連接類型設置
//     let ssidValue;
//     if (networkData.isWifi) {
//       // 如果是WiFi連接，使用SSID
//       ssidValue = networkData.ssid;
//     } else {
//       // 如果是固定網路，設為Network line
//       ssidValue = 'Network line';
//     }
    
//     // 準備下班原因（如有需要）
//     let reason = '';
    
//     // 檢查是否有 SSID 錯誤，如果有，加入到 reason
//     if (ssidError) {
//       reason = `SSID錯誤: ${ssidError}`;
//     }
    
//     // 構建打卡數據 - 使用從 Flutter 獲取的完整信息，移除預設值
// const payload = {
//   company_id: companyId,
//   employee_id: employeeId,
//   utc_timestamp: utcTimestamp,
//   event_id: currentEventId || null, // 使用當前事件ID
//   ssid: ssidValue,
//   bssid: networkData.bssid, // 添加 BSSID
//   xtbbddtx: xtbbddtxValue || '', // 使用空字符串作為備用
//   public_ip: currentPublicIp, // 使用重新獲取的公共 IP
//   longitude: location.longitude,
//   latitude: location.latitude,
//   reason: reason || null // 添加下班原因
// };

    
//     console.log(`發送下班打卡請求 (使用 Checkinfo):`, JSON.stringify(payload, null, 2));
    
//     // 使用支援離線的 API 呼叫
// const apiResult = await handleApiWithOfflineCache(
//   'https://rabbit.54ucl.com:3004/api/check-out-google',
//   payload,
//   {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${authToken}`
//   }
// );

// let responseData;
// if (apiResult.cached) {
//   // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
//   console.log('下班打卡已快取，等待網路恢復後上傳');
  
//   // 模擬成功回應以繼續 UI 更新
//   responseData = {
//     Status: "Ok",
//     Data: {}
//   };
// } else {
//   // 線上狀態 - 處理正常的 API 回應
//   responseData = apiResult.data;
  
//   if (responseData.Status !== "Ok") {
//     throw new Error(responseData.Msg || '打卡處理失敗');
//   }
// }

    
//     console.log('下班打卡成功:', responseData);
    
//     // 更新UI
//     setClockOutTime(timeForDisplay);
//     setPunchStatus('CLOCKED_OUT');
    
//     // 檢查下班打卡狀態
//     const clockOutCheckResult = await checkClockOutStatus(
//       formattedTime,
//       formattedDate,
//       currentEventId,
//       utcTimestamp
//     );
    
//     console.log('下班打卡狀態檢查結果:', clockOutCheckResult);
    
//     // 查詢最新打卡記錄
//     setTimeout(() => {
//       fetchAttendanceRecords();
//     }, 2000);
    
//     // 更新本地存儲中的打卡記錄 - 保持現有的考勤結果
//     const storedData = localStorage.getItem(`punchData_${companyId}_${employeeId}_${currentDate}`);
//     let punchData = storedData ? JSON.parse(storedData) : {};
    
//     punchData.clockOutTime = timeForDisplay;
//     punchData.clockOutFullTime = formattedTime;
//     punchData.clockOutDate = formattedDate;
//     punchData.clockOutUtcTimestamp = utcTimestamp;
//     punchData.clockOutReason = reason; // 儲存下班原因
//     punchData.clockOutStatus = clockOutCheckResult.status === 'success' ? clockOutCheckResult.data?.attendance_status : null; // 儲存下班打卡狀態
//     punchData.clockOutResult = clockOutResult; // 保持現有的下班考勤結果
//     // 更新從 Flutter 獲取的信息
//     punchData.flutterInfo = { ...punchData.flutterInfo, ...info };
//     // 儲存使用的公共 IP
//     punchData.publicIp = currentPublicIp;
//     // 儲存使用的位置信息
//     punchData.locationUsedForClockOut = location;
    
//     localStorage.setItem(`punchData_${companyId}_${employeeId}_${currentDate}`, JSON.stringify(punchData));
    
//     return {
//       success: true,
//       data: responseData.Data,
//       message: '下班打卡成功'
//     };
    
//   } catch (err) {
//     console.error('下班打卡失敗:', err);
//     setError('下班打卡失敗: ' + (err.message || '未知錯誤'));
    
//     return {
//       success: false,
//       message: err.message || '下班打卡失敗',
//       error: err
//     };
//   } finally {
//     setLoading(false);
//   }
// };


// /**
//  * 查詢打卡記錄，更新標籤狀態
//  * @param {Object} params - 查詢所需參數
//  * @returns {Promise<Object>} 查詢結果
//  */
// export const fetchAttendanceRecordsFunction = async ({
//   companyId,
//   employeeId,
//   currentDate,
//   authToken,
//   setClockInTime,
//   setClockOutTime,
//   setPunchStatus,
//   setCurrentEventId,
//   setClockInResult,
//   setClockOutResult,
//   setIsLate,
//   updateLocalStorageWithResults
// }) => {
//   try {
//     if (!companyId || !employeeId || !currentDate) {
//       console.log('缺少查詢考勤記錄的必要參數');
//       return {
//         success: false,
//         message: '缺少查詢考勤記錄的必要參數'
//       };
//     }
    
//     console.log('使用新 API 查詢考勤記錄...');
    
//     // 使用新的 API 端點查詢考勤記錄
//     const queryParams = new URLSearchParams({
//       company_id: companyId,
//       employee_id: employeeId,
//       work_date: currentDate
//     });
    
//     const response = await fetch(`https://rabbit.54ucl.com:3004/api/attendance-check-in-view?${queryParams.toString()}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error(`API 回應錯誤: ${response.status}`);
//     }
    
//     const responseData = await response.json();
    
//     if (responseData.Status === "Ok" && responseData.Data.records && responseData.Data.records.length > 0) {
//       console.log('考勤記錄查詢成功:', responseData.Data.records);
      
//       // 找出最新的上班打卡記錄
//       const checkInRecords = responseData.Data.records.filter(record => record.attendance_type === 'check_in');
//       // 找出最新的下班打卡記錄
//       const checkOutRecords = responseData.Data.records.filter(record => record.attendance_type === 'check_out');
      
//       // 處理上班打卡的考勤結果
//       if (checkInRecords.length > 0) {
//         // 按記錄日期和時間排序，獲取最新的記錄
//         const latestCheckIn = checkInRecords.sort((a, b) => {
//           const dateA = new Date(`${a.record_date} ${a.record_time}`);
//           const dateB = new Date(`${b.record_date} ${b.record_time}`);
//           return dateB - dateA; // 降序排序
//         })[0];
        
//         // 更新上班時間
//         if (latestCheckIn.work_time) {
//           const timeOnly = latestCheckIn.work_time.split(':').slice(0, 2).join(':');
//           setClockInTime(timeOnly);
//         }
        
//         // 設置事件ID
//         if (latestCheckIn.event_id) {
//           setCurrentEventId(latestCheckIn.event_id);
//         }
        
//         // 根據 API 返回的 result 設置考勤結果
//         const clockInResultData = {
//           originalResult: latestCheckIn.result,
//           tagClass: getTagClassFromResult(latestCheckIn.result),
//           // 使用 result 而不是 reason
//           tagText: getTagTextFromResult(latestCheckIn.result)
//         };
        
//         setClockInResult(clockInResultData);
//         // 根據考勤結果設置遲到狀態
//         setIsLate(clockInResultData.originalResult === 'late');
//         console.log('設置上班考勤結果:', clockInResultData);
        
//         // 立即更新localStorage以保持狀態
//         updateLocalStorageWithResults(clockInResultData, null);
//       } else {
//         console.log('沒有找到上班打卡的考勤記錄');
//       }
      
//       // 處理下班打卡的考勤結果
//       if (checkOutRecords.length > 0) {
//         // 按記錄日期和時間排序，獲取最新的記錄
//         const latestCheckOut = checkOutRecords.sort((a, b) => {
//           const dateA = new Date(`${a.record_date} ${a.record_time}`);
//           const dateB = new Date(`${b.record_date} ${b.record_time}`);
//           return dateB - dateA; // 降序排序
//         })[0];
        
//         // 更新下班時間
//         if (latestCheckOut.get_off_work_time) {
//           const timeOnly = latestCheckOut.get_off_work_time.split(':').slice(0, 2).join(':');
//           setClockOutTime(timeOnly);
//         }
        
//         // 根據 API 返回的 result 設置考勤結果
//         const clockOutResultData = {
//           originalResult: latestCheckOut.result,
//           tagClass: getTagClassFromResult(latestCheckOut.result),
//           // 使用 result 而不是 reason
//           tagText: getTagTextFromResult(latestCheckOut.result)
//         };
        
//         setClockOutResult(clockOutResultData);
//         console.log('設置下班考勤結果:', clockOutResultData);
        
//         // 立即更新localStorage以保持狀態
//         updateLocalStorageWithResults(null, clockOutResultData);
//       } else {
//         console.log('沒有找到下班打卡的考勤記錄');
//       }
      
// // 設置打卡狀態 - 使用常數而不是硬編碼中文
// if (checkInRecords.length > 0 && checkOutRecords.length > 0) {
//   setPunchStatus('CLOCKED_OUT');
// } else if (checkInRecords.length > 0) {
//   setPunchStatus('CLOCKED_IN');
// } else {
//   setPunchStatus('NOT_PUNCHED');
// }

//       return {
//         success: true,
//         data: responseData.Data,
//         message: '考勤記錄查詢成功'
//       };
//     } else {
//       console.log('沒有找到考勤記錄或查詢失敗:', responseData.Msg);
//       return {
//         success: false,
//         message: responseData.Msg || '沒有找到考勤記錄或查詢失敗'
//       };
//     }
//   } catch (err) {
//     console.error('查詢考勤記錄失敗:', err);
//     return {
//       success: false,
//       message: err.message || '查詢考勤記錄失敗',
//       error: err
//     };
//   }
// };

// /**
//  * 獲取打卡狀態
//  * @param {Object} params - 查詢所需參數
//  * @returns {Promise<Object>} 查詢結果
//  */
// export const fetchPunchStatusFunction = async ({
//   companyId,
//   employeeId,
//   currentDate,
//   clockInTime,
//   setError,
//   setClockInTime,
//   setClockOutTime,
//   setPunchStatus,
//   setAttendanceStatus,
//   setIsLate,
//   setSsidError,
//   setClockOutStatus,
//   setCurrentEventId,
//   setClockInResult,
//   setClockOutResult,
//   setFlutterInfo,
//   fetchAttendanceRecords
// }) => {
//   if (!companyId || !employeeId || !currentDate) {
//     console.log('缺少必要參數，跳過打卡狀態獲取');
//     return {
//       success: false,
//       message: '缺少必要參數，跳過打卡狀態獲取'
//     };
//   }

//   try {
//     setError(null);
//     console.log('開始獲取打卡狀態...');
    
//     // 使用新的 API 查詢打卡記錄
//     await fetchAttendanceRecords();
    
//     // 如果API查詢後仍然沒有數據，再從localStorage獲取
//     if (clockInTime === '--:--') {
//       console.log('API查詢無結果，嘗試從localStorage獲取...');
      
//       const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
//       const storedData = localStorage.getItem(storageKey);
      
//       if (storedData) {
//         try {
//           const punchData = JSON.parse(storedData);
//           console.log('從localStorage獲取的資料:', punchData);
          
//           if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
//             setClockInTime(punchData.clockInTime);
//           }
          
//           if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
//             setClockOutTime(punchData.clockOutTime);
//           }
          
// // 根據打卡狀態設置狀態文字 - 使用常數
// if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
//   setPunchStatus('CLOCKED_OUT');
// } else if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
//   setPunchStatus('CLOCKED_IN');
// }
          
//           // 恢復其他狀態
//           if (punchData.attendanceStatus) {
//             setAttendanceStatus(punchData.attendanceStatus);
//             setIsLate(punchData.attendanceStatus.is_late || false);
            
//             if (punchData.attendanceStatus.message && 
//                 punchData.attendanceStatus.message.includes('使用非公司網路')) {
//               const ssidErrorMsg = punchData.attendanceStatus.message.split('；')[1] || 
//                                   punchData.attendanceStatus.message;
//               setSsidError(ssidErrorMsg);
//             }
//           }
          
//           if (punchData.clockOutStatus) {
//             setClockOutStatus(punchData.clockOutStatus);
//           }
          
//           if (punchData.eventId) {
//             setCurrentEventId(punchData.eventId);
//           }
          
//           // 恢復考勤結果（如果localStorage中有的話）
//           if (punchData.clockInResult) {
//             setClockInResult(punchData.clockInResult);
//             console.log('從localStorage恢復上班考勤結果:', punchData.clockInResult);
//           }
          
//           if (punchData.clockOutResult) {
//             setClockOutResult(punchData.clockOutResult);
//             console.log('從localStorage恢復下班考勤結果:', punchData.clockOutResult);
//           }

//           // 恢復從 Flutter 獲取的信息
//           if (punchData.flutterInfo) {
//             setFlutterInfo(punchData.flutterInfo);
//             console.log('從localStorage恢復Flutter信息:', punchData.flutterInfo);
//           }
          
//         } catch (parseErr) {
//           console.error('解析localStorage數據失敗:', parseErr);
//         }
//       }
//     }
    
//     return {
//       success: true,
//       message: '獲取打卡狀態成功'
//     };
    
//   } catch (err) {
//     console.error('獲取打卡狀態失敗:', err);
//     setError('獲取打卡狀態失敗: ' + err.message);
    
//     return {
//       success: false,
//       message: err.message || '獲取打卡狀態失敗',
//       error: err
//     };
//   }
// };


// /**
//  * 根據打卡結果返回對應的 CSS 類名，用在顯示標籤顏色上
//  * @param {string} result - 考勤結果
//  * @returns {string} 標籤樣式類名
//  */
// export const getTagClassFromResult = (result) => {
//   switch (result) {
//     case 'late':
//       return 'late';
//     case 'ontime':
//     case 'on_time':
//     case 'early':
//       return 'ontime';
//     case 'over_time':
//       return 'overtime';
//     case 'early_leave':
//       return 'early';
//     case 'stay':
//       return 'stay';
//     case 'too_early':
//       return 'early';
//     default:
//       return '';
//   }
// };

// /**
//  * 會在API中查詢回傳result，將英文轉換為中文標籤
//  * @param {string} result - 考勤結果
//  * @param {string} reason - 考勤原因
//  * @returns {string} 標籤文字
//  */
// export const getTagTextFromResult = (result, reason) => {
//   // 不再優先使用 reason，而是直接使用 result
//   // if (reason) return reason; // 移除這一行
  
//   switch (result) {
//     case 'late':
//       return '遲到';
//     case 'ontime':
//     case 'on_time':
//       return '準時';
//     case 'early':
//       return '提早';
//     case 'overtime':
//     case 'over_time':
//       return '加班';
//     case 'early_leave':
//       return '早退';
//     case 'stay':
//       return '滯留';
//     case 'too_early':
//       return '過早';
//     default:
//       return result || ''; // 如果沒有匹配的結果，直接顯示原始結果
//   }
// };


// /**=========================查詢打卡紀錄頁面相關功能=========================**/

// /**
//  * 查詢出勤記錄
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} startDate - 開始日期 (YYYY-MM-DD)
//  * @param {string} endDate - 結束日期 (YYYY-MM-DD)
//  * @param {string} statusFilter - 狀態篩選 (可選)
//  * @param {string} authToken - 認證 token (可選)
//  * @returns {Promise<Object>} 返回出勤記錄
//  */
// export const fetchAttendanceRecords = async (companyId, employeeId, startDate, endDate, statusFilter = '', authToken = null) => {
//   try {
//     console.log(`查詢從 ${startDate} 到 ${endDate} 的出勤記錄`);
    
//     // 建立查詢參數
//     const queryParams = new URLSearchParams({
//       company_id: companyId,
//       employee_id: employeeId,
//       start_date: startDate,
//       end_date: endDate
//     });
    
//     // 如果有選擇特定狀態，添加到查詢參數
//     if (statusFilter && statusFilter !== '不限') {
//       // 根據 API 的狀態參數格式調整
//       let apiStatus;
//       switch(statusFilter) {
//         case '準時':
//           apiStatus = 'on_time';
//           break;
//         case '請假':
//           apiStatus = 'leave';
//           break;
//         case '遲到':
//           apiStatus = 'late';
//           break;
//         case '早退':
//           apiStatus = 'early_leave';
//           break;
//         case '曠職':
//           apiStatus = 'absent';
//           break;
//         default:
//           apiStatus = '';
//       }
//       if (apiStatus) {
//         queryParams.append('result', apiStatus);
//       }
//     }
    
//     // 準備請求標頭
//     const headers = {
//       'Content-Type': 'application/json'
//     };
    
//     // 如果有 token，添加到標頭中
//     if (authToken) {
//       headers['Authorization'] = `Bearer ${authToken}`;
//     }
    
//     // 使用 API 端點
//     const response = await fetch(`https://rabbit.54ucl.com:3004/api/attendance-check-in-view?${queryParams.toString()}`, {
//       method: 'GET',
//       headers: headers,
//       cache: 'no-store'
//     });
    
//     const data = await response.json();
    
//     if (response.ok && data.Status === "Ok") {
//       console.log(`成功獲取出勤記錄:`, data);
//       return {
//         success: true,
//         data: data.Data,
//         message: '成功獲取出勤記錄'
//       };
//     } else {
//       console.error('獲取出勤記錄失敗:', data);
//       return {
//         success: false,
//         data: null,
//         message: data.Msg || '獲取出勤記錄失敗'
//       };
//     }
//   } catch (err) {
//     console.error('查詢出勤記錄時發生錯誤:', err);
//     return {
//       success: false,
//       data: null,
//       message: err.message || '查詢出勤記錄時發生錯誤',
//       error: err
//     };
//   }
// };

// /**
//  * 根據日期取得星期幾的中文表示
//  * @param {Date} date - 日期物件
//  * @returns {string} 星期幾的中文表示
//  */
// export const getDayOfWeek = (date) => {
//   const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//   return weekdays[date.getDay()];
// };



// /**
//  * 將時間格式化為小時:分鐘格式
//  * @param {string} time - 時間字串 (可能包含秒數)
//  * @returns {string} 格式化後的時間 (HH:MM)
//  */
// export const formatTimeToMinutes = (time) => {
//   if (!time) return '--:--';
  
//   // 分割時間字串
//   const parts = time.split(':');
//   if (parts.length < 2) return time;
  
//   // 只取小時和分鐘
//   return `${parts[0]}:${parts[1]}`;
// };


// /**
//  * 處理出勤記錄數據
//  * @param {Object} data - API 返回的出勤數據
//  * @param {number} targetYear - 目標年份
//  * @param {number} targetMonth - 目標月份
//  * @returns {Promise<Array>} 處理後的出勤記錄
//  */
// export const processAttendanceData = async (data, targetYear, targetMonth) => {
//   try {
//     console.log('處理出勤記錄...', data);
    
//     // 檢查資料結構
//     if (!data || !data.records || !Array.isArray(data.records) || data.records.length === 0) {
//       console.log('沒有找到出勤記錄');
      
//       // 檢查是否需要添加曠職記錄
//       const datesWithRecords = new Set();
//       const groupedRecords = {};
      
//       // 添加曠職記錄
//       await addAbsentRecords(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
//       // 檢查是否有添加曠職記錄
//       const absentRecords = Object.values(groupedRecords);
      
//       if (absentRecords.length > 0) {
//         // 有曠職記錄，處理並顯示
//         const formattedAbsentData = absentRecords.sort((a, b) => {
//           const dateA = new Date(a.fullDate);
//           const dateB = new Date(b.fullDate);
//           return dateB - dateA; // 降序排序（由新到舊）
//         });
        
//         console.log('生成曠職記錄:', formattedAbsentData);
//         return formattedAbsentData;
//       }
      
//       // 沒有任何記錄（包括曠職記錄）
//       return [];
//     }
    
//     // 將記錄按日期分組，分別記錄上班和下班資訊
//     const groupedRecords = {};
    
//     // 存儲已有記錄的日期
//     const datesWithRecords = new Set();
    
//     // 按日期分組並分離上班和下班記錄
//     console.log('按日期分組並分離上班和下班記錄...');
    
//     // 首先按日期和事件ID對記錄進行分組
//     const recordsByDate = {};
    
//     data.records.forEach(record => {
//       const workDate = record.work_date;
//       if (!workDate) return;
      
//       if (!recordsByDate[workDate]) {
//         recordsByDate[workDate] = {};
//       }
      
//       if (!recordsByDate[workDate][record.event_id]) {
//         recordsByDate[workDate][record.event_id] = [];
//       }
      
//       recordsByDate[workDate][record.event_id].push(record);
//     });
    
//     // 遍歷每個日期，找出最新的上班和下班記錄
//     for (const dateKey in recordsByDate) {
//       datesWithRecords.add(dateKey);
      
//       const dateParts = dateKey.split(/[/-]/);
//       if (dateParts.length !== 3) continue;
      
//       const month = parseInt(dateParts[1], 10);
//       const day = parseInt(dateParts[2], 10);
//       const formattedDate = `${day}`;
      
//       // 建立日期物件以獲取星期幾
//       const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
//       const dayOfWeek = getDayOfWeek(dateObj);
      
//       // 初始化該日期的記錄
//       groupedRecords[dateKey] = {
//         date: formattedDate,
//         day: dayOfWeek,
//         fullDate: dateKey,
//         checkIn: '--:--',
//         checkOut: '--:--',
//         checkInResult: '',
//         checkOutResult: '',
//         checkInResultText: '',
//         checkOutResultText: '',
//         checkInAbnormal: false,
//         checkOutAbnormal: false
//       };
      
//       // 找出最新的上班和下班記錄
//       let latestCheckIn = null;
//       let latestCheckOut = null;
      
//       for (const eventId in recordsByDate[dateKey]) {
//         const records = recordsByDate[dateKey][eventId];
        
//         // 分離上班和下班記錄
//         const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
//         const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
        
//         // 如果有上班記錄，找出最新的一筆
//         if (checkInRecords.length > 0) {
//           const newestCheckIn = checkInRecords.reduce((newest, current) => {
//             const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
//             const currentDate = new Date(current.record_date + ' ' + current.record_time);
//             return currentDate > newestDate ? current : newest;
//           }, checkInRecords[0]);
          
//           if (!latestCheckIn || new Date(newestCheckIn.record_date + ' ' + newestCheckIn.record_time) > 
//                                new Date(latestCheckIn.record_date + ' ' + latestCheckIn.record_time)) {
//             latestCheckIn = newestCheckIn;
//           }
//         }
        
//         // 如果有下班記錄，找出最新的一筆
//         if (checkOutRecords.length > 0) {
//           const newestCheckOut = checkOutRecords.reduce((newest, current) => {
//             const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
//             const currentDate = new Date(current.record_date + ' ' + current.record_time);
//             return currentDate > newestDate ? current : newest;
//           }, checkOutRecords[0]);
          
//           if (!latestCheckOut || new Date(newestCheckOut.record_date + ' ' + newestCheckOut.record_time) > 
//                                 new Date(latestCheckOut.record_date + ' ' + latestCheckOut.record_time)) {
//             latestCheckOut = newestCheckOut;
//           }
//         }
//       }
      
//       // 更新該日期的上班記錄
//       if (latestCheckIn) {
//         groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
//         groupedRecords[dateKey].checkInResult = latestCheckIn.result;
        
//         // 設置上班打卡結果文字和異常標記
//         if (latestCheckIn.result === 'late') {
//           groupedRecords[dateKey].checkInResultText = '遲到';
//           groupedRecords[dateKey].checkInAbnormal = true;
//         } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
//           groupedRecords[dateKey].checkInResultText = '準時';
//           groupedRecords[dateKey].checkInAbnormal = false;
//         } else if (latestCheckIn.result === 'too_early') {
//           groupedRecords[dateKey].checkInResultText = '過早';
//           groupedRecords[dateKey].checkInAbnormal = true;
//         } else {
//           groupedRecords[dateKey].checkInResultText = '準時';
//           groupedRecords[dateKey].checkInAbnormal = false;
//         }
//       }
      
//       // 更新該日期的下班記錄
//       if (latestCheckOut) {
//         groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
//         groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
        
//         // 設置下班打卡結果文字和異常標記
//         if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
//           groupedRecords[dateKey].checkOutResultText = '早退';
//           groupedRecords[dateKey].checkOutAbnormal = true;
//         } else if (latestCheckOut.result === 'stay') {
//           groupedRecords[dateKey].checkOutResultText = '滯留';
//           groupedRecords[dateKey].checkOutAbnormal = true;
//         } else if (latestCheckOut.result === 'overtime' || latestCheckOut.result === 'over_time') {
//           groupedRecords[dateKey].checkOutResultText = '延滯';
//           groupedRecords[dateKey].checkOutAbnormal = false;
//         } else if (latestCheckOut.result === 'on_time') {
//           groupedRecords[dateKey].checkOutResultText = '準時';
//           groupedRecords[dateKey].checkOutAbnormal = false;
//         } else if (latestCheckOut.result === 'unknown') {
//           groupedRecords[dateKey].checkOutResultText = '準時';  // 改為準時而不是未知
//           groupedRecords[dateKey].checkOutAbnormal = false;
//         } else {
//           groupedRecords[dateKey].checkOutResultText = '準時';
//           groupedRecords[dateKey].checkOutAbnormal = false;
//         }
//       }
//     }
    
//     // 為沒有打卡記錄的工作日添加曠職記錄
//     await addAbsentRecords(groupedRecords, datesWithRecords, targetYear, targetMonth);
    
//     // 轉換為陣列並按日期排序 - 修改為降序排序（由新到舊）
//     console.log('格式化最終數據...');
//     const formattedData = Object.values(groupedRecords)
//       .map(item => {
//         // 如果是曠職記錄，直接返回
//         if (item.isAbsent) {
//           return {
//             ...item,
//             checkInAbnormal: true,
//             checkOutAbnormal: true,
//             checkInResultText: '曠職',
//             checkOutResultText: '曠職'
//           };
//         }
        
//         return item;
//       })
//       .sort((a, b) => {
//         // 按照日期降序排序
//         const dateA = new Date(a.fullDate);
//         const dateB = new Date(b.fullDate);
//         return dateB - dateA;
//       });
    
//     console.log('格式化後的數據:', formattedData);
//     return formattedData;
//   } catch (err) {
//     console.error('處理出勤記錄時出錯:', err);
//     throw err;
//   }
// };

// /**
//  * 為沒有打卡記錄的工作日添加曠職記錄
//  * @param {Object} groupedRecords - 按日期分組的記錄
//  * @param {Set} datesWithRecords - 已有記錄的日期集合
//  * @param {number} targetYear - 目標年份
//  * @param {number} targetMonth - 目標月份
//  */
// export const addAbsentRecords = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
//   // 獲取該月的天數
//   const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  
//   // 獲取當前日期
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();
  
//   // 遍歷該月的每一天
//   for (let day = 1; day <= daysInMonth; day++) {
//     // 格式化日期
//     const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
//     // 如果該日期已有記錄，則跳過
//     if (datesWithRecords.has(dateStr)) {
//       continue;
//     }
    
//     // 建立日期物件
//     const dateObj = new Date(targetYear, targetMonth - 1, day);
    
//     // 判斷是否為過去的日期（在當前日期之前）
//     const isPastDate = (targetYear < currentYear) || 
//                        (targetYear === currentYear && targetMonth < currentMonth) ||
//                        (targetYear === currentYear && targetMonth === currentMonth && day < currentDay);
    
//     // 只處理過去的日期
//     if (isPastDate) {
//       // 檢查是否為工作日（平日）
//       const dayOfWeek = dateObj.getDay(); // 0是星期日，1-5是星期一到五，6是星期六
//       const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
      
//       // 如果是工作日，添加曠職記錄
//       if (isWorkday) {
//         const dayOfWeekText = getDayOfWeek(dateObj);
        
//         groupedRecords[dateStr] = {
//           date: String(day),
//           day: dayOfWeekText,
//           fullDate: dateStr,
//           checkIn: '--:--',
//           checkOut: '--:--',
//           checkInTimestamp: 0,
//           checkOutTimestamp: 0,
//           checkInEventId: null,
//           checkOutEventId: null,
//           checkInResult: '',
//           checkOutResult: '',
//           isAbsent: true, // 標記為曠職
//           checkInAbnormal: true,
//           checkOutAbnormal: true,
//           checkInResultText: '曠職',
//           checkOutResultText: '曠職'
//         };
//       }
//     }
//   }
// };

// /**
//  * 計算目標月份的開始和結束日期
//  * @param {string} timeFilter - 時間篩選 ('本月' 或 '上月')
//  * @returns {Object} 包含開始和結束日期的物件
//  */
// export const calculateDateRange = (timeFilter) => {
//   const now = new Date();
//   let targetYear, targetMonth, nextMonth, nextYear;
  
//   if (timeFilter === '本月') {
//     targetYear = now.getFullYear();
//     targetMonth = now.getMonth() + 1; // JavaScript月份從0開始
//   } else { // 上月
//     if (now.getMonth() === 0) { // 如果是1月，則上個月是去年12月
//       targetYear = now.getFullYear() - 1;
//       targetMonth = 12;
//     } else {
//       targetYear = now.getFullYear();
//       targetMonth = now.getMonth(); // 上個月
//     }
//   }
  
//   // 計算下個月的年份和月份（用於設定結束日期）
//   if (targetMonth === 12) {
//     nextMonth = 1;
//     nextYear = targetYear + 1;
//   } else {
//     nextMonth = targetMonth + 1;
//     nextYear = targetYear;
//   }
  
//   // 格式化開始和結束日期
//   const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
//   const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
  
//   return {
//     startDate,
//     endDate,
//     targetYear,
//     targetMonth
//   };
// };

// /**
//  * 查詢表單資料
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} category - 表單類別 (例如: "replenish", "leave", "overtime")
//  * @param {string} authToken - 認證 token
//  * @param {boolean} includeDetails - 是否包含詳細資料
//  * @returns {Promise<Object>} 表單查詢結果
//  */
// export const fetchFormData = async (companyId, employeeId, category, authToken, includeDetails = true) => {
//   try {
//     console.log(`正在查詢員工 ${employeeId} 的${category}申請...`);
    
//     // 參數驗證
//     if (!companyId || !employeeId || !category || !authToken) {
//       throw new Error('缺少必要參數，無法查詢表單資料');
//     }
    
//     // 使用 /api/forms/advanced-search API 查詢表單
//     const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/advanced-search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}` // 添加 auth_xtbb token
//       },
//       body: JSON.stringify({
//         company_id: parseInt(companyId),
//         employee_id: employeeId,
//         category: category,
//         includeDetails: includeDetails
//       })
//     });
    
//     console.log('發送的請求參數:', {
//       company_id: parseInt(companyId),
//       employee_id: employeeId,
//       category: category,
//       includeDetails: includeDetails
//     });
    
//     if (!response.ok) {
//       throw new Error(`API 請求失敗: ${response.status}`);
//     }
    
//     const data = await response.json();
//     console.log('API 完整回應:', data);
    
//     if (data.Status !== "Ok") {
//       throw new Error(data.Msg || "查詢失敗");
//     }
    
//     // 如果沒有找到數據，返回空數組
//     if (!data.Data || data.Data.length === 0) {
//       console.log('沒有找到表單數據');
//       return {
//         success: true,
//         data: [],
//         message: '沒有找到表單數據'
//       };
//     }
    
//     // 強制在前端過濾，確保只顯示當前員工的申請
//     const currentEmployeeRequests = data.Data.filter(item => {
//       const itemEmployeeId = String(item.employee_id);
//       const currentEmployeeId = String(employeeId);
      
//       console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
      
//       return itemEmployeeId === currentEmployeeId;
//     });
    
//     console.log(`過濾前共 ${data.Data.length} 筆申請`);
//     console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的${category}申請`);
    
//     return {
//       success: true,
//       data: currentEmployeeRequests,
//       message: `成功查詢到 ${currentEmployeeRequests.length} 筆${category}申請`
//     };
    
//   } catch (err) {
//     console.error(`查詢${category}申請失敗:`, err);
//     return {
//       success: false,
//       data: [],
//       message: err.message || `查詢${category}申請失敗`,
//       error: err
//     };
//   }
// };

// /**
//  * 格式化表單編號
//  * @param {string} formNumber - 原始表單編號
//  * @returns {string} 格式化後的表單編號
//  */
// export const formatFormNumber = (formNumber) => {
//   if (!formNumber) return '';
  
//   // 檢查是否符合 'FORM-YYYYMMDDHHMMSS-XXXXXXXXXX' 格式
//   if (formNumber.startsWith('FORM-')) {
//     // 分割表單編號
//     const parts = formNumber.split('-');
//     if (parts.length >= 2 && parts[1].length >= 14) {
//       // 取出年份後兩位數字和其餘部分
//       const yearLastTwoDigits = parts[1].substring(2, 4);
//       const restOfTimestamp = parts[1].substring(4);
//       // 將 'FORM-' 替換為 'B'，並只使用年份後兩位數字
//       return 'B' + yearLastTwoDigits + restOfTimestamp;
//     }
//   }
  
//   // 如果不符合預期格式，返回原始編號
//   return formNumber;
// };

// /**
//  * 處理補卡申請數據
//  * @param {Array} formData - 原始表單數據
//  * @returns {Array} 處理後的補卡申請數據
//  */
// export const processReplenishFormData = (formData) => {
//   if (!formData || formData.length === 0) {
//     return [];
//   }
  
//   return formData.map((item, index) => {
//     console.log('處理申請項目:', item);
//     console.log('詳細資料:', item.details);
    
//     // 狀態映射 - 根據後端的狀態欄位
//     let statusText = "簽核中";
//     const currentStatus = item.status || '';
    
//     switch (currentStatus.toLowerCase()) {
//       case 'approved':
//         statusText = "已通過";
//         break;
//       case 'rejected':
//         statusText = "未通過";
//         break;
//       case 'pending':
//         statusText = "簽核中";
//         break;
//       case 'approved_pending_hr':
//         statusText = "待HR審核";
//         break;
//       default:
//         statusText = "簽核中";
//     }
    
//     // 格式化申請日期
//     let submitTime = "未記錄";
//     if (item.application_date) {
//       try {
//         const date = new Date(item.application_date);
//         submitTime = date.toLocaleString('zh-TW', {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit'
//         });
//       } catch (e) {
//         console.warn('日期格式化失敗:', item.application_date);
//         submitTime = String(item.application_date);
//       }
//     }
    
//     // 處理補卡類型 - 根據資料庫結構優先使用 type 欄位
//     let replenishType = "未指定";
    
//     // 1. 優先使用基本資料的 type 欄位
//     if (item.type) {
//       replenishType = item.type;
//     }
//     // 2. 如果基本資料沒有，嘗試從詳細資料獲取
//     else if (item.details && item.details.type) {
//       replenishType = item.details.type;
//     }
    
//     // 處理補卡原因 - 根據資料庫結構使用 Reason 欄位
//     let reason = "未填寫";
    
//     // 1. 優先使用詳細資料的 Reason 欄位（注意大寫R）
//     if (item.details && item.details.Reason) {
//       reason = item.details.Reason;
//     }
//     // 2. 備用：使用 illustrate 欄位
//     else if (item.details && item.details.illustrate) {
//       reason = item.details.illustrate;
//     }
//     // 3. 備用：使用基本資料的 description
//     else if (item.description) {
//       reason = item.description;
//     }
    
//     // 格式化補卡時間 - 根據資料庫結構處理
//     let replenishDateTime = "未指定";

//     if (item.details) {
//       const replenishDate = item.details.date;
//       const endTime = item.details.end_time;  // 只使用結束時間
      
//       if (replenishDate) {
//         // 格式化時間顯示（去除秒數）
//         const formatTime = (timeStr) => {
//           if (!timeStr) return '';
//           return timeStr.split(':').slice(0, 2).join(':');
//         };
        
//         // 只顯示日期和結束時間
//         const formattedEndTime = formatTime(endTime);
//         if (formattedEndTime) {
//           replenishDateTime = `${replenishDate} ${formattedEndTime}`;
//         } else {
//           replenishDateTime = replenishDate;
//         }
//       }
//     }
    
//     // 獲取員工姓名和其他基本資訊
//     const employeeName = item.employee_name || "未知";
//     const department = item.department || "未指定";
//     const position = item.position || "未指定";
//     const reviewer = item.reviewer || "未指定";
    
//     return {
//       id: item.form_number ? formatFormNumber(item.form_number) : `R${index + 1}`,
//       status: statusText,
//       originalStatus: currentStatus,
//       submitTime: submitTime,
//       replenishTime: replenishDateTime,
//       employee: item.employee_id,
//       employeeName: employeeName,
//       replenishType: replenishType,
//       reason: reason,
//       department: department,
//       position: position,
//       reviewer: reviewer,
//       // 保留原始資料以供詳細檢視使用
//       originalData: item,
//       details: item.details || null
//     };
//   });
// };


// // 在 function.js 中添加以下函數

// /**
//  * 獲取當前日期和時間信息
//  * @returns {Object} 包含格式化日期、星期幾和時間的對象
//  */
// export const getCurrentDateTimeInfo = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth() + 1;
//   const day = now.getDate();
  
//   // 獲取星期幾
//   const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
//   const weekday = weekdays[now.getDay()];
  
//   // 格式化日期
//   const formattedDate = `${year}年 ${month}月${day}日 ${weekday}`;
  
//   // 獲取當前時間，並向上取整到最近的五分鐘
//   const hours = now.getHours();
//   const minutes = Math.floor(now.getMinutes() / 5) * 5;
//   const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
//   return {
//     formattedDate,
//     weekday,
//     formattedTime
//   };
// };

// /**
//  * 格式化日期為 API 格式 (YYYY-MM-DD)
//  * @param {string} dateStr - 日期字符串，例如 "2024年 9月25日 週三"
//  * @returns {string} 格式化後的日期，例如 "2024-09-25"
//  */
// export const formatDateForApi = (dateStr) => {
//   // 處理包含星期的日期格式，例如 "2024年 9月25日 週三"
//   const match = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
//   if (match) {
//     const year = parseInt(match[1]);
//     const month = parseInt(match[2]);
//     const day = parseInt(match[3]);
//     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//   }
//   return '';
// };

// /**
//  * 生成表單編號
//  * @returns {string} 生成的表單編號
//  */
// export const generateFormNumber = () => {
//   // 獲取當前日期（台灣時間）
//   const now = new Date();
//   const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  
//   // 提取年、月、日
//   const year = taiwanTime.getUTCFullYear();
//   const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
//   const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
  
//   // 日期部分：年月日
//   const datePart = `${year}${month}${day}`;
  
//   // 使用隨機數作為序號
//   const randomNumber = Math.floor(Math.random() * 99999) + 1;
//   const sequenceNumber = String(randomNumber).padStart(5, '0');
  
//   // 組合完整編號
//   return `${datePart}${sequenceNumber}`;
// };

// /**
//  * 查詢員工基本資料
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} authToken - 認證令牌
//  * @param {Function} setLoading - 設置載入狀態的函數
//  * @param {Function} setEmployeeInfo - 設置員工資料的函數
//  * @param {Function} setError - 設置錯誤訊息的函數
//  * @param {Object} cookieUtils - Cookie 工具函數
//  * @returns {Promise<void>}
//  */
// export const fetchEmployeeInfoFunction = async (
//   companyId, 
//   employeeId, 
//   authToken, 
//   setLoading, 
//   setEmployeeInfo, 
//   setError, 
//   cookieUtils,
//   authInProgress
// ) => {
//   // 避免重複請求
//   if (authInProgress.current || !companyId || !employeeId || !authToken) {
//     console.log('認證請求已在進行中或缺少必要參數，跳過請求');
//     return;
//   }
  
//   // 檢查 sessionStorage 中是否有緩存的員工資料
//   const cachedEmployeeInfo = sessionStorage.getItem('employee_info_cache');
//   if (cachedEmployeeInfo) {
//     const cacheData = JSON.parse(cachedEmployeeInfo);
//     const cacheTime = new Date(cacheData.timestamp);
//     const now = new Date();
//     // 緩存 5 分鐘內有效
//     if ((now - cacheTime) < 5 * 60 * 1000) {
//       console.log('使用緩存的員工資料');
//       setEmployeeInfo(cacheData.data);
//       return;
//     }
//   }
  
//   try {
//     authInProgress.current = true;
//     setLoading(true);
    
//     console.log('查詢員工資料，參數:', {
//       company_id: companyId,
//       employee_id: employeeId,
//       authToken: authToken ? '已設置' : '未設置'
//     });
    
//     // 使用新系統API端點
//     const response = await fetch(`https://rabbit.54ucl.com:3004/api/employee/info`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}` // 添加 auth_token
//       },
//       body: JSON.stringify({
//         company_id: companyId,
//         employee_id: employeeId
//       })
//     });
    
//     const result = await response.json();
    
//     if (result.Status === "Ok") {
//       // 將員工資料存入 sessionStorage
//       sessionStorage.setItem('employee_info_cache', JSON.stringify({
//         data: result.Data,
//         timestamp: new Date().toISOString()
//       }));
      
//       setEmployeeInfo(result.Data);
//       console.log('員工資料查詢成功:', result.Data);
      
//       // 將部門、職位和職等存入 cookies，有效期 3 小時
//       if (result.Data.department) {
//         cookieUtils.set('employee_department', result.Data.department);
//       }
//       if (result.Data.position) {
//         cookieUtils.set('employee_position', result.Data.position);
//       }
//       if (result.Data.job_grade) {
//         cookieUtils.set('employee_job_grade', result.Data.job_grade);
//       }
//     } else {
//       console.error('員工資料查詢失敗:', result.Msg);
//       setError(`員工資料查詢失敗: ${result.Msg}`);
//     }
//   } catch (err) {
//     if (err.name === 'AbortError') {
//       console.error('查詢員工資料請求超時');
//     } else {
//       console.error('查詢員工資料時發生錯誤:', err);
//       setError(`查詢員工資料時發生錯誤: ${err.message}`);
//     }
//   } finally {
//     setLoading(false);
//     authInProgress.current = false;
//   }
// };

// /**
//  * 提交補卡申請
//  * @param {Object} params - 提交參數
//  * @returns {Promise<Object>} 提交結果
//  */
// export const submitReplenishForm = async ({
//   loading,
//   formSubmitInProgress,
//   companyId,
//   employeeId,
//   authToken,
//   illustrate,
//   replenishDate,
//   originalTime,
//   modifiedTime,
//   reason,
//   selectedCardType,
//   employeeInfo,
//   cookieUtils,
//   setLoading,
//   setFormSubmitted,
//   setError
// }) => {
//   // 避免重複提交
//   if (loading || formSubmitInProgress.current) {
//     console.log('表單提交已在進行中，跳過重複提交');
//     return {
//       success: false,
//       message: '表單提交已在進行中'
//     };
//   }
  
//   if (!companyId || !employeeId || !authToken) {
//     alert('公司ID或員工ID不能為空，請重新登入');
//     window.location.href = '/apploginpmx/';
//     return {
//       success: false,
//       message: '缺少必要參數'
//     };
//   }
  
//   if (!illustrate.trim()) {
//     alert('請填寫補卡說明');
//     return {
//       success: false,
//       message: '請填寫補卡說明'
//     };
//   }
  
//   try {
//     formSubmitInProgress.current = true;
//     setLoading(true);
    
//     // 生成申請單號
//     const formNumber = generateFormNumber();
    
//     // 格式化日期
//     const formattedDate = formatDateForApi(replenishDate);
    
//     // 獲取當前日期時間，並調整為 UTC+8 時區
//     const now = new Date();
//     // 將當前時間轉換為 UTC+8 時區 (台灣時間)
//     const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
//     // 提取年、月、日
//     const year = taiwanTime.getUTCFullYear();
//     const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
//     // 提取時、分、秒
//     const hours = String(taiwanTime.getUTCHours()).padStart(2, '0');
//     const minutes = String(taiwanTime.getUTCMinutes()).padStart(2, '0');
//     const seconds = String(taiwanTime.getUTCSeconds()).padStart(2, '0');
    
//     // 分別設置申請日期和申請時間
//     const applicationDate = `${year}-${month}-${day}`;
    
//     // 從 cookies 或員工資料中獲取部門、職位和職等
//     const employeeDepartment = employeeInfo?.department || cookieUtils.get('employee_department') || '';
//     const employeePosition = employeeInfo?.position || cookieUtils.get('employee_position') || '';
//     const employeeJobGrade = employeeInfo?.job_grade || cookieUtils.get('employee_job_grade') || '';
//     const employeeSupervisor = employeeInfo?.supervisor || '';
    
//     // 準備新系統API的資料格式
//     const newSystemData = {
//       form_number: formNumber,
//       employee_id: String(employeeId), // 確保保持為字符串格式
//       company_id: parseInt(companyId),
//       department: employeeDepartment || '',
//       position: employeePosition || '',
//       job_grade: employeeJobGrade || '',
//       category: "replenish",
//       type: selectedCardType, // "上班" 或 "下班"
      
//       // 修正欄位名稱以符合後端期望
//       date: formattedDate,                     // 補卡日期
//       start_time: `${originalTime}:00`,        // 開始時間（原始時間）
//       end_time: `${modifiedTime}:00`,          // 結束時間（修改時間）
//       Reason: reason,                          // 原因 (注意大寫 R)
      
//       illustrate: illustrate || '',
//       status: "待審核",
//       application_date: applicationDate,
//       reviewer_name: null,
//       reviewer_job_grade: null,
//       reviewer_status: "待審核",
//       hr_name: null,
//       hr_status: "待審核",
//       reviewer: employeeSupervisor || '',
//       employee_name: employeeInfo?.name || '',
//       id_number: employeeInfo?.id_number || '',
//       mobile_number: employeeInfo?.mobile_number || ''
//     };

//     console.log('發送到新系統的資料:', newSystemData);
    
//     // 只發送到新系統 API
//     const response = await fetch("https://rabbit.54ucl.com:3004/application-forms", {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${authToken}`
//       },
//       body: JSON.stringify(newSystemData),
//     });
    
//     // 檢查回應
//     const result = await response.json();
    
//     if (!result.error && result.Status === "Ok") {
//       console.log('補卡申請提交成功:', result);
//       setFormSubmitted(true);
//       alert('補卡申請已成功提交');
//       return {
//         success: true,
//         message: '補卡申請已成功提交',
//         data: result
//       };
//     } else {
//       throw new Error(result.Msg || '提交失敗');
//     }
//   } catch (err) {
//     if (err.name === 'AbortError') {
//       console.error('提交請求超時');
//       alert('提交請求超時，請稍後再試');
//     } else {
//       console.error('補卡申請失敗:', err);
//       setError(err.message || '提交表單時發生錯誤');
//       alert(`提交失敗: ${err.message || '未知錯誤'}`);
//     }
//     return {
//       success: false,
//       message: err.message || '提交失敗',
//       error: err
//     };
//   } finally {
//     // 確保無論成功或失敗，loading 狀態和提交標記都會被重置
//     setLoading(false);
//     formSubmitInProgress.current = false;
//   }
// };

// /**
//  * 處理返回首頁 - 能夠區分瀏覽器請求和手機app請求
//  */
// export const handleGoHomeFunction = () => {
//   // 檢查是否為手機 app 環境
//   const isInMobileApp = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const isApp = urlParams.get('platform') === 'app';
    
//     const userAgent = navigator.userAgent.toLowerCase();
//     const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
    
//     const hasFlutterContext = 
//       typeof window.flutter !== 'undefined' || 
//       typeof window.FlutterNativeWeb !== 'undefined';
      
//     return isApp || hasFlutterAgent || hasFlutterContext;
//   };

//   if (isInMobileApp()) {
//     console.log('檢測到 App 環境，使用 Flutter 導航');
    
//     try {
//       if (window.flutter && window.flutter.postMessage) {
//         window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
//       } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
//         window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
//       } else {
//         const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
//           detail: { action: 'navigate_home' }
//         });
//         document.dispatchEvent(event);
//       }
//     } catch (err) {
//       console.error('無法使用 Flutter 導航:', err);
//       window.location.href = '/frontpagepmx';
//     }
//   } else {
//     console.log('瀏覽器環境，使用 window.location.href 導航');
//     window.location.href = '/frontpagepmx';
//   }
// };


// /**
//  * 獲取表單數據的通用函數（從 LeavePage 提取並通用化）
//  * @param {string} companyId - 公司ID
//  * @param {string} employeeId - 員工ID
//  * @param {string} category - 表單類別 (leave, work_overtime, replenish)
//  * @param {string} authToken - 認證token
//  * @returns {Promise<Object>} 處理後的申請數據
//  */
// export const fetchAndProcessFormData = async (companyId, employeeId, category, authToken) => {
//   try {
//     console.log(`正在查詢員工 ${employeeId} 的${category}申請...`);
    
//     // 使用與 LeavePage 相同的 API 調用
//     const response = await fetch('https://rabbit.54ucl.com:3004/api/forms/advanced-search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`
//       },
//       body: JSON.stringify({
//         company_id: parseInt(companyId),
//         employee_id: employeeId,
//         category: category,
//         includeDetails: true
//       })
//     });
    
//     console.log('發送的請求參數:', {
//       company_id: parseInt(companyId),
//       employee_id: employeeId,
//       category: category,
//       includeDetails: true
//     });
    
//     if (!response.ok) {
//       throw new Error(`API 請求失敗: ${response.status}`);
//     }
    
//     const data = await response.json();
//     console.log('API 完整回應:', data);
    
//     if (data.Status !== "Ok") {
//       throw new Error(data.Msg || "查詢失敗");
//     }
    
//     if (!data.Data || data.Data.length === 0) {
//       console.log(`沒有找到${category}申請數據`);
//       return [];
//     }
    
//     // 強制在前端過濾，確保只顯示當前員工的申請（與 LeavePage 相同邏輯）
//     const currentEmployeeRequests = data.Data.filter(item => {
//       const itemEmployeeId = String(item.employee_id);
//       const currentEmployeeId = String(employeeId);
      
//       console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
      
//       return itemEmployeeId === currentEmployeeId;
//     });
    
//     console.log(`過濾前共 ${data.Data.length} 筆申請`);
//     console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的${category}申請`);
    
//     // 根據不同類別處理數據
//     const processedRequests = currentEmployeeRequests.map((item, index) => {
//       console.log(`處理第 ${index + 1} 筆${category}申請:`, item);
//       console.log('詳細資料:', item.details);
      
//       // 狀態映射（與 LeavePage 相同邏輯）
//       let statusText = "簽核中";
//       const currentStatus = item.status || '';
      
//       const statusLower = currentStatus.toLowerCase();
      
//       if (statusLower === 'approved' || 
//           statusLower === 'ok' || 
//           statusLower === '已完成' || 
//           statusLower === '1') {
//         statusText = "已通過";
//       } 
//       else if (statusLower === 'rejected' || 
//                statusLower === 'no' || 
//                statusLower === '未通過' || 
//                statusLower === '2') {
//         statusText = "未通過";
//       }
//       else if (statusLower === 'pending' || 
//                statusLower === '待審核' || 
//                statusLower === 'approved_pending_hr') {
//         statusText = "簽核中";
//       }
      
//       // 格式化申請日期
//       let submitTime = "未記錄";
//       if (item.application_date) {
//         submitTime = formatDateTime(item.application_date);
//       }
      
//       // 格式化表單編號
//       const formNumber = formatFormNumber(item.form_number || `${category.toUpperCase()}${Date.now()}`);
      
//       console.log(`${category}狀態處理結果:`, {
//         原始狀態: currentStatus,
//         處理後狀態: statusText,
//         表單編號: formNumber
//       });
      
//       // 根據類別返回不同的數據結構
//       if (category === 'work_overtime') {
//         // 加班申請數據結構
//         let startDateTime = "未記錄";
//         let endDateTime = "未記錄";
//         let totalHours = "0";
        
//         if (item.details) {
//           if (item.details.start_time) {
//             startDateTime = formatDateTime(item.details.start_time);
//           }
//           if (item.details.end_time) {
//             endDateTime = formatDateTime(item.details.end_time);
//           }
//           if (item.details.total_hours) {
//             totalHours = item.details.total_hours.toString();
//           }
//         }
        
//         return {
//           id: formNumber,
//           status: statusText,
//           originalStatus: currentStatus,
//           submitTime: submitTime,
//           startTime: startDateTime,
//           endTime: endDateTime,
//           totalHours: totalHours,
//           employee: item.employee_id || employeeId,
//           employeeName: item.employee_name || "未指定",
//           overtimeType: item.details?.overtime_type || "一般加班",
//           compensationType: item.details?.compensation_type || "加班費",
//           reason: item.details?.illustrate || item.description || "未填寫",
//           reviewer: item.reviewer || "未指定",
//           originalData: item
//         };
//       } else if (category === 'replenish') {
//         // 補卡申請數據結構
//         let replenishDate = "未記錄";
//         let replenishTime = "未記錄";
//         let replenishType = "上班";
        
//         if (item.details) {
//           if (item.details.replenish_date) {
//             replenishDate = formatDateTime(item.details.replenish_date);
//           }
//           if (item.details.replenish_time) {
//             replenishTime = item.details.replenish_time;
//           }
//           if (item.details.replenish_type) {
//             replenishType = item.details.replenish_type;
//           }
//         }
        
//         return {
//           id: formNumber,
//           status: statusText,
//           originalStatus: currentStatus,
//           submitTime: submitTime,
//           replenishDate: replenishDate,
//           replenishTime: replenishTime,
//           replenishType: replenishType,
//           employee: item.employee_id || employeeId,
//           employeeName: item.employee_name || "未指定",
//           reason: item.details?.reason || item.description || "未填寫",
//           reviewer: item.reviewer || "未指定",
//           originalData: item
//         };
//       }
      
//       // 預設返回基本結構
//       return {
//         id: formNumber,
//         status: statusText,
//         originalStatus: currentStatus,
//         submitTime: submitTime,
//         employee: item.employee_id || employeeId,
//         employeeName: item.employee_name || "未指定",
//         reason: item.details?.reason || item.description || "未填寫",
//         reviewer: item.reviewer || "未指定",
//         originalData: item
//       };
//     });
    
//     console.log(`成功處理 ${processedRequests.length} 筆${category}申請`);
//     return processedRequests;
    
//   } catch (err) {
//     console.error(`獲取${category}申請失敗:`, err);
//     throw err;
//   }
// };

// /**
//  * 通用的狀態過濾函數（從 LeavePage 提取）
//  * @param {Array} requests - 申請列表
//  * @param {string} activeTab - 當前標籤
//  * @returns {Array} 過濾後的申請列表
//  */
// export const getFilteredRequests = (requests, activeTab) => {
//   if (activeTab === "總覽") {
//     return requests;
//   } else if (activeTab === "簽核中") {
//     return requests.filter(request => {
//       const status = request.originalStatus.toLowerCase();
//       return status === "pending" || 
//              status === "待審核" || 
//              status === "approved_pending_hr" ||
//              status === "" || 
//              !status;
//     });
//   } else if (activeTab === "已通過") {
//     return requests.filter(request => {
//       const status = request.originalStatus.toLowerCase();
//       return status === "ok" || 
//              status === "approved" || 
//              status === "已完成" || 
//              status === "1";
//     });
//   } else if (activeTab === "未通過") {
//     return requests.filter(request => {
//       const status = request.originalStatus.toLowerCase();
//       return status === "no" || 
//              status === "rejected" || 
//              status === "未通過" || 
//              status === "2";
//     });
//   }
//   return requests;
// };

// /**
//  * 格式化日期時間的函數（從 LeavePage 提取）
//  */
// export const formatDateTime = (dateTimeStr) => {
//   if (!dateTimeStr) return "未記錄";
//   const date = new Date(dateTimeStr);
//   if (isNaN(date.getTime())) return dateTimeStr; // 如果無法解析日期，返回原始字符串
  
//   return date.toLocaleString('zh-TW', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false
//   }).replace(/\//g, '-');
// };

// // 🔥 添加員工編號對應映射表
// const EMPLOYEE_ID_MAPPING = {
//   // PMX_employee_info ID -> Employee_Basic_Information ID
//   '0880311': '880311',
//   '0950301': '950301', 
//   '0950602': '950601',  // 陳信遑的對應
//   '0990601': '990601',
//   '0990623': '990623',
//   '1000314': '1000314',
//   '1010402': '1010402',
//   '1030925': '1030925',
//   '1041001': '1041001',
//   '1061222': '1061222',
//   '1071001-1': '1071001',  // 張嘉真
//   '1071001-3': '1071002',  // 盧宜姿
//   '1091005': '1091005',
//   '1091214': '1091214',
//   '1100126': '1100126',
//   '1100901-1': '1100901',  // 宋展輝
//   '1100901-2': '1100902',  // 王榮陞
//   '1100927': '1100927',
//   '1101018': '1101018',
//   '1110223': '1110223',
//   '1110530': '1110530',
//   '1111024': '1111024',
//   '1111128': '1111128',
//   '1120215': '1120215'
// };

// /**
//  * 將 PMX_employee_info 的員工編號轉換為 Employee_Basic_Information 的員工編號
//  * @param {string} pmxEmployeeId - PMX_employee_info 資料表的員工編號
//  * @returns {string} Employee_Basic_Information 資料表的員工編號
//  */
// export const mapPmxToBasicEmployeeId = (pmxEmployeeId) => {
//   if (!pmxEmployeeId) {
//     console.warn('員工編號為空，無法進行映射');
//     return pmxEmployeeId;
//   }
  
//   const mappedId = EMPLOYEE_ID_MAPPING[pmxEmployeeId];
  
//   if (mappedId) {
//     console.log(`員工編號映射: ${pmxEmployeeId} -> ${mappedId}`);
//     return mappedId;
//   } else {
//     console.log(`未找到員工編號 ${pmxEmployeeId} 的映射，使用原始編號`);
//     return pmxEmployeeId;
//   }
// };

// /**
//  * 將 Employee_Basic_Information 的員工編號轉換為 PMX_employee_info 的員工編號
//  * @param {string} basicEmployeeId - Employee_Basic_Information 資料表的員工編號
//  * @returns {string} PMX_employee_info 資料表的員工編號
//  */
// export const mapBasicToPmxEmployeeId = (basicEmployeeId) => {
//   if (!basicEmployeeId) {
//     console.warn('員工編號為空，無法進行映射');
//     return basicEmployeeId;
//   }
  
//   // 反向查找映射
//   const pmxId = Object.keys(EMPLOYEE_ID_MAPPING).find(key => 
//     EMPLOYEE_ID_MAPPING[key] === basicEmployeeId
//   );
  
//   if (pmxId) {
//     console.log(`員工編號反向映射: ${basicEmployeeId} -> ${pmxId}`);
//     return pmxId;
//   } else {
//     console.log(`未找到員工編號 ${basicEmployeeId} 的反向映射，使用原始編號`);
//     return basicEmployeeId;
//   }
// };

// /**
//  * 檢查員工編號是否存在於映射表中
//  * @param {string} employeeId - 員工編號
//  * @returns {boolean} 是否存在映射
//  */
// export const hasEmployeeIdMapping = (employeeId) => {
//   return EMPLOYEE_ID_MAPPING.hasOwnProperty(employeeId) || 
//          Object.values(EMPLOYEE_ID_MAPPING).includes(employeeId);
// };

// /**
//  * 獲取所有支援的員工編號列表
//  * @returns {Object} 包含 PMX 和 Basic 編號列表的物件
//  */
// export const getSupportedEmployeeIds = () => {
//   return {
//     pmxIds: Object.keys(EMPLOYEE_ID_MAPPING),
//     basicIds: Object.values(EMPLOYEE_ID_MAPPING),
//     mapping: EMPLOYEE_ID_MAPPING
//   };
// };

// /**
//  * 批量轉換員工編號（PMX -> Basic）
//  * @param {Array} pmxEmployeeIds - PMX 員工編號陣列
//  * @returns {Array} 轉換後的 Basic 員工編號陣列
//  */
// export const batchMapPmxToBasic = (pmxEmployeeIds) => {
//   if (!Array.isArray(pmxEmployeeIds)) {
//     console.warn('輸入必須是陣列');
//     return [];
//   }
  
//   return pmxEmployeeIds.map(id => mapPmxToBasicEmployeeId(id));
// };

// /**
//  * 批量轉換員工編號（Basic -> PMX）
//  * @param {Array} basicEmployeeIds - Basic 員工編號陣列
//  * @returns {Array} 轉換後的 PMX 員工編號陣列
//  */
// export const batchMapBasicToPmx = (basicEmployeeIds) => {
//   if (!Array.isArray(basicEmployeeIds)) {
//     console.warn('輸入必須是陣列');
//     return [];
//   }
  
//   return basicEmployeeIds.map(id => mapBasicToPmxEmployeeId(id));
// };

// /**
//  * 檢查網路狀態並處理 API 請求（離線時快取到 Flutter）
//  * @param {string} url - API URL
//  * @param {Object} data - 請求資料
//  * @param {Object} headers - 請求標頭
//  * @returns {Promise<Object>} API 回應或快取狀態
//  */
// export const handleApiWithOfflineCache = async (url, data, headers = {}) => {
//   // 檢查網路連線狀態
//   if (!navigator.onLine) {
//     console.log('離線狀態，將請求快取到 Flutter');
    
//     // 打包完整的請求資料
//     const requestPacket = {
//       url: url,
//       method: 'POST',
//       body: data,
//       headers: headers,
//       timestamp: Date.now()
//     };
    
//     // 傳送給 Flutter 保管
//     if (window.FlutterBridge) {
//       try {
//         window.FlutterBridge.postMessage(JSON.stringify({
//           action: 'CACHE_REQUEST',
//           payload: requestPacket
//         }));
        
//         console.log('請求已快取到 Flutter:', requestPacket);
        
//         return {
//           success: true,
//           cached: true,
//           message: '請求已快取，將在網路恢復時自動上傳',
//           status: 'QUEUED'
//         };
//       } catch (error) {
//         console.error('無法將請求快取到 Flutter:', error);
//         throw new Error('離線狀態下無法處理請求');
//       }
//     } else {
//       console.error('Flutter Bridge 不可用');
//       throw new Error('離線狀態下無法處理請求');
//     }
//   }
  
//   // 有網路則正常呼叫原有 API
//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(data)
//     });
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
//     }
    
//     const result = await response.json();
//     return {
//       success: true,
//       cached: false,
//       data: result,
//       message: 'API 請求成功'
//     };
//   } catch (error) {
//     console.error('API 請求失敗:', error);
//     throw error;
//   }
// };
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../config';

/**
 * 員工登入API
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} password - 密碼
 * @returns {Promise<Object>} 返回登入結果
 */
export const employeeLogin = async (companyId, employeeId, password) => {
  try {
    console.log('開始員工登入...', {
      companyId,
      employeeId,
      hasPassword: !!password
    });

    // 參數驗證
    if (!companyId || !employeeId || !password) {
      throw new Error('缺少必要參數：公司統編、員工編號或密碼');
    }

    // 發送POST請求到新的API端點
    const response = await fetch(`${API_BASE_URL}/api/employee/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: companyId,
        employee_id: employeeId,
        password: password
      })
    });

    // 檢查HTTP狀態
    if (!response.ok) {
      const errorText = await response.text();
      console.error('登入API回應錯誤:', response.status, errorText);
      throw new Error(`API請求失敗: ${response.status} - ${errorText}`);
    }

    // 解析回應數據
    const responseData = await response.json();
    console.log('登入結果:', { ...responseData });

    // 檢查API回應狀態
    if (responseData.Status !== "Ok") {
      throw new Error(responseData.Msg || '登入失敗');
    }

    // 處理登入結果
    const result = {
      success: true,
      data: responseData.Data || {},
      message: responseData.Msg || '登入成功',
      token: responseData.Data?.xtbb || null  // 使用 xtbb 作為 token
    };

    console.log('處理後的登入結果:', { ...result, token: result.token ? '[已設置]' : null });
    return result;

  } catch (error) {
    console.error('登入失敗:', error);
    
    // 返回錯誤結果
    return {
      success: false,
      data: {},
      message: error.message || '登入時發生未知錯誤',
      error: error
    };
  }
};


/**
 * 更新員工密碼API
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} oldPassword - 舊密碼
 * @param {string} newPassword - 新密碼
 * @returns {Promise<Object>} 返回更新密碼結果
 */
export const updateEmployeePassword = async (companyId, employeeId, oldPassword, newPassword) => {
  try {
    console.log('開始更新密碼...', {
      companyId,
      employeeId,
      hasOldPassword: !!oldPassword,
      hasNewPassword: !!newPassword
    });

    // 參數驗證
    if (!companyId || !employeeId || !oldPassword || !newPassword) {
      throw new Error('缺少必要參數：公司統編、員工編號、舊密碼或新密碼');
    }

    // 發送POST請求
    const response = await fetch('https://rabbit.54ucl.com:3002/api/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: companyId,
        employee_id: employeeId,
        old_password: oldPassword,
        new_password: newPassword
      })
    });

    // 檢查HTTP狀態
    if (!response.ok) {
      const errorText = await response.text();
      console.error('更新密碼API回應錯誤:', response.status, errorText);
      throw new Error(`API請求失敗: ${response.status} - ${errorText}`);
    }

    // 解析回應數據
    const responseData = await response.json();
    console.log('更新密碼結果:', responseData);

    // 檢查API回應狀態
    if (!responseData.success) {
      throw new Error(responseData.message || '更新密碼失敗');
    }

    // 處理更新密碼結果
    const result = {
      success: true,
      data: responseData.data || {},
      message: responseData.message || '更新密碼成功'
    };

    console.log('處理後的更新密碼結果:', result);
    return result;

  } catch (error) {
    console.error('更新密碼失敗:', error);
    
    // 返回錯誤結果
    return {
      success: false,
      data: {},
      message: error.message || '更新密碼時發生未知錯誤',
      error: error
    };
  }
};



/**
 * 獲取員工資訊API - 使用 token 驗證
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} [token] - 認證 token (auth_xtbb)
 * @returns {Promise<Object>} 返回員工資訊
 */
export const fetchEmployeeInfo = async (companyId, employeeId, token) => {
  try {
    console.log(`正在獲取員工資訊: 公司ID=${companyId}, 員工ID=${employeeId}`);
    
    // 參數驗證
    if (!companyId || !employeeId) {
      throw new Error('缺少必要資訊，無法獲取員工資料');
    }
    
    // 準備請求參數
    const requestData = {
      company_id: companyId,
      employee_id: employeeId
    };
    
    // 準備請求標頭
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // 如果有 token，添加到標頭中
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 發送POST請求
    const response = await axios.post(`${API_BASE_URL}/api/employee/info`, requestData, {
      headers: headers
    });

    console.log('API 回應:', response.data);
    
    // 檢查API回應狀態
    if (response.data && response.data.Status === "Ok" && response.data.Data) {
      const employeeData = response.data.Data;
      
      // 處理職級，轉換為小寫以便比較
      if (employeeData.job_grade) {
        employeeData.job_grade = employeeData.job_grade.toLowerCase();
      }
      
      console.log(`使用者 ${employeeData.name} 的職級為: ${employeeData.job_grade || '未設定'}`);
      console.log(`公司名稱: ${employeeData.company_name || '未設定'}`);
      
      // 返回成功結果
      return {
        success: true,
        data: employeeData,
        message: '獲取員工資訊成功'
      };
    } else {
      console.log('API 回應中沒有有效的員工資料');
      throw new Error(response.data?.Msg || 'API 回應中沒有有效的員工資料');
    }
  } catch (err) {
    console.error('獲取員工資訊錯誤:', err);
    
    // 返回錯誤結果
    return {
      success: false,
      data: {},
      message: err.message || '獲取員工資訊時發生未知錯誤',
      error: err
    };
  }
};

/**
 * 從 cookies 獲取並驗證用戶認證資訊
 * @param {Function} setLoading - 設置載入狀態的函數
 * @param {Function} setAuthToken - 設置認證 token 的函數
 * @param {Function} setCompanyId - 設置公司 ID 的函數
 * @param {Function} setEmployeeId - 設置員工 ID 的函數
 * @param {string} redirectUrl - 驗證失敗時重定向的 URL
 * @returns {Promise<Object>} 驗證結果
 */
export const validateUserFromCookies = async (
  setLoading,
  setAuthToken,
  setCompanyId,
  setEmployeeId,
  redirectUrl = '/apploginpmx/'
) => {
  try {
    if (setLoading) setLoading(true);
    
    // 從 cookies 獲取認證資訊
    const cookieCompanyId = Cookies.get('company_id');
    const cookieEmployeeId = Cookies.get('employee_id');
    // 獲取 auth_xtbb token
    const cookieAuthToken = Cookies.get('auth_xtbb');
    
    console.log('從 cookies 獲取的認證資訊:', {
      company_id: cookieCompanyId,
      employee_id: cookieEmployeeId,
      auth_xtbb: cookieAuthToken ? '已設置' : '未設置'
    });
    
    if (!cookieCompanyId || !cookieEmployeeId || !cookieAuthToken) {
      console.log('cookies 中缺少認證資訊，跳轉到登入頁面');
      window.location.href = redirectUrl;
      return { success: false, message: 'cookies 中缺少認證資訊' };
    }
    
    // 存儲 token 到 state 中
    if (setAuthToken) {
      setAuthToken(cookieAuthToken);
      console.log('已設置 auth_xtbb 到狀態中');
    }
    
    // 調用 API 進行驗證 - 只需要公司ID和員工ID，不需要密碼
    const response = await fetch(`${API_BASE_URL}/api/employee/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookieAuthToken}` // 使用 auth_xtbb token 進行驗證
      },
      body: JSON.stringify({
        company_id: cookieCompanyId,
        employee_id: cookieEmployeeId
        // 不再需要密碼
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.Status === "Ok") {
      console.log('API 驗證成功:', data);
      
      // 設置狀態中的公司和員工 ID
      if (setCompanyId) setCompanyId(cookieCompanyId);
      if (setEmployeeId) setEmployeeId(cookieEmployeeId);
      
      // 繼續加載頁面
      console.log('認證成功，繼續加載頁面');
      return { 
        success: true, 
        message: '認證成功',
        data: {
          companyId: cookieCompanyId,
          employeeId: cookieEmployeeId,
          authToken: cookieAuthToken
        }
      };
    } else {
      console.error('API 驗證失敗:', data);
      // 驗證失敗，跳轉到登入頁面
      window.location.href = redirectUrl;
      return { success: false, message: 'API 驗證失敗' };
    }
  } catch (error) {
    console.error('驗證過程中發生錯誤:', error);
    // 發生錯誤，跳轉到登入頁面
    window.location.href = redirectUrl;
    return { success: false, message: '驗證過程中發生錯誤', error };
  } finally {
    if (setLoading) setLoading(false);
  }
};


/**=========================打卡頁面相關功能=========================**/
/**
 * 上班打卡功能
 * @param {Object} params - 打卡所需參數
 * @returns {Promise<Object>} 打卡結果
 */
export const handleClockIn = async ({
  setLoading,
  setError,
  Checkinfo,
  userLocation,
  updateLocation,
  networkInfo,
  privateIp,
  publicIp,
  companyId,
  employeeId,
  authToken,
  setClockInTime,
  setPunchStatus,
  setClockOutTime,
  setClockOutStatus,
  setClockOutResult,
  setCurrentEventId,
  checkAttendanceStatus,
  fetchAttendanceRecords,
  clockInResult
}) => {
  setLoading(true);
  setError(null);
  
  try {
    // 使用 Checkinfo 獲取完整信息
    const info = await Checkinfo();
    console.log('打卡使用的完整信息:', info);

    // 準備位置信息 - 多層備用方案
    let location = {
      // 優先使用 Checkinfo 獲取的位置，其次是 userLocation，最後是全局變量
      latitude: info.latitude || userLocation.latitude || window.latitude,
      longitude: info.longitude || userLocation.longitude || window.longitude
    };

    // 如果沒有位置信息，嘗試更新位置
    if (!location.latitude || !location.longitude) {
      try {
        location = await updateLocation();
        console.log('已更新位置信息:', location);
      } catch (locError) {
        console.error('獲取位置失敗:', locError);
        
        // 如果仍然沒有位置信息，使用預設值（最後的備用方案）
        if (!location.latitude || !location.longitude) {
          console.warn('無法獲取位置信息，使用預設值');
          location = {
            latitude: 22.757182,  // 使用預設值
            longitude: 120.337638
          };
          console.log('使用預設位置:', location);
        } else {
          setError('打卡失敗: 無法獲取位置信息，請確保已開啟位置權限');
          return {
            success: false,
            message: '無法獲取位置信息，請確保已開啟位置權限',
            error: locError
          };
        }
      }
    }

    // 確保經緯度是有效的數字
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      console.error('經緯度不是有效數字:', location);
      
      // 使用預設值作為最後的備用方案
      location = {
        latitude: 22.757182,  // 使用預設值
        longitude: 120.337638
      };
      console.log('經緯度無效，使用預設位置:', location);
    }

    // 準備網絡信息
    let networkData = {
      ssid: info.ssid || networkInfo.ssid || window.ssid || 'UNKNOWN',
      bssid: info.bssid || networkInfo.bssid || window.bssid || 'XX:XX:XX:XX:XX:XX',
      isWifi: (info.ssid || networkInfo.ssid || window.ssid) !== 'Network line'
    };

    // 準備私有 IP - 多層備用方案
    let xtbbddtxValue = info.privateIp || privateIp || window.xtbbddtx;
    
    // 如果還是沒有獲取到，再嘗試一次從 Flutter 獲取
    if (!xtbbddtxValue && window.flutter && typeof window.flutter.getxtbbddtx === 'function') {
      try {
        xtbbddtxValue = await window.flutter.getxtbbddtx();
        console.log('最後嘗試從 Flutter 獲取私有 IP:', xtbbddtxValue);
      } catch (e) {
        console.error('最後嘗試獲取私有 IP 失敗:', e);
      }
    }
    
    // 如果仍然沒有私有 IP，使用空字符串
    if (!xtbbddtxValue) {
      xtbbddtxValue = '';
    }
    
    // 輸出調試信息
    console.log('準備打卡數據:');
    console.log('- 位置信息:', location);
    console.log('- 網絡信息:', networkData);
    console.log('- 私有 IP:', xtbbddtxValue);
    console.log('- 公共 IP:', publicIp || window.publicIp || '');

    // 獲取當前時間 - 使用帶時區的 ISO 格式
    const now = new Date();
    
    // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
    const tzOffset = -now.getTimezoneOffset();
    const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
    const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
    const tzSign = tzOffset >= 0 ? '+' : '-';
    
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
    
    // 本地時間格式化 - 僅用於顯示
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedDate = `${year}-${month}-${day}`;
    const timeForDisplay = `${hours}:${minutes}`;
    
    // 準備網路資訊 - 根據連接類型設置
    let ssidValue;
    if (networkData.isWifi) {
      // 如果是WiFi連接，使用SSID
      ssidValue = networkData.ssid;
    } else {
      // 如果是固定網路，設為Network line
      ssidValue = 'Network line';
    }
    
    // 構建打卡數據 - 使用從 Flutter 獲取的完整信息，移除預設值
const payload = {
  company_id: companyId,
  employee_id: employeeId,
  utc_timestamp: utcTimestamp,
  ssid: ssidValue,
  bssid: networkData.bssid,  // 添加 bssid
  xtbbddtx: xtbbddtxValue || '',
  public_ip: publicIp || window.publicIp || '',
  longitude: location.longitude,
  latitude: location.latitude
};
    
    console.log(`發送上班打卡請求 (使用 Checkinfo):`, JSON.stringify(payload, null, 2));
  
const apiResult = await handleApiWithOfflineCache(
  `${API_BASE_URL}/api/check-in-google`,
  payload,
  {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  }
);

let responseData;
if (apiResult.cached) {
  // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
  console.log('上班打卡已快取，等待網路恢復後上傳');
  
  // 模擬成功回應以繼續 UI 更新
  responseData = {
    Status: "Ok",
    Data: {
      event_id: null // 離線時沒有 event_id
    }
  };
} else {
  // 線上狀態 - 處理正常的 API 回應
  responseData = apiResult.data;
  
  if (responseData.Status !== "Ok") {
    throw new Error(responseData.Msg || '打卡處理失敗');
  }
}

    
    console.log('上班打卡成功:', responseData);
    
    // 獲取事件 ID
    const eventId = responseData.Data?.event_id || null;
    
    // 更新UI
    setClockInTime(timeForDisplay);
    setPunchStatus('CLOCKED_IN');
    setClockOutTime('--:--'); // 重置下班時間
    setClockOutStatus(null); // 重置下班打卡狀態
    setClockOutResult(null); // 重置下班考勤結果
    setCurrentEventId(eventId); // 設置當前事件ID
    
    // 檢查打卡時間是否遲到，並檢查 SSID
    const attendanceCheckResult = await checkAttendanceStatus(
      formattedTime,
      formattedDate,
      eventId,
      utcTimestamp
    );
    
    console.log('打卡狀態檢查結果:', attendanceCheckResult);
    
    // 重要：查詢考勤記錄以獲取上班標籤狀態
    setTimeout(() => {
      fetchAttendanceRecords();
    }, 2000);
    
    // 保存打卡記錄到本地存儲 - 保持現有的考勤結果
    const punchData = {
      clockInTime: timeForDisplay,
      clockInFullTime: formattedTime,
      clockInDate: formattedDate,
      clockInUtcTimestamp: utcTimestamp,
      clockOutTime: null,
      clockOutFullTime: null,
      clockOutDate: null,
      clockOutUtcTimestamp: null,
      eventId: eventId, // 儲存事件 ID 以便下班打卡時使用
      attendanceStatus: attendanceCheckResult.status === 'success' ? attendanceCheckResult.data : null, // 儲存考勤狀態
      clockOutStatus: null, // 重置下班打卡狀態
      clockInResult: clockInResult, // 保持現有的上班考勤結果
      clockOutResult: null, // 重置下班考勤結果
      // 儲存從 Flutter 獲取的信息
      flutterInfo: info,
      // 儲存使用的位置信息
      locationUsed: location
    };
    
    localStorage.setItem(`punchData_${companyId}_${employeeId}_${formattedDate}`, JSON.stringify(punchData));
    
    return {
      success: true,
      data: responseData.Data,
      eventId: eventId,
      message: '上班打卡成功'
    };
    
  } catch (err) {
    console.error('上班打卡失敗:', err);
    setError('上班打卡失敗: ' + (err.message || '未知錯誤'));
    
    return {
      success: false,
      message: err.message || '上班打卡失敗',
      error: err
    };
  } finally {
    setLoading(false);
  }
};


/**
 * 下班打卡功能
 * @param {Object} params - 打卡所需參數
 * @returns {Promise<Object>} 打卡結果
 */
// 修改後的 handleClockOut 函數 - 確保獲取最新的公共 IP
export const handleClockOut = async ({
  clockInTime,
  setError,
  setLoading,
  Checkinfo,
  userLocation,
  updateLocation,
  networkInfo,
  privateIp,
  publicIp,
  companyId,
  employeeId,
  currentEventId,
  authToken,
  ssidError,
  setClockOutTime,
  setPunchStatus,
  checkClockOutStatus,
  fetchAttendanceRecords,
  clockOutResult,
  currentDate
}) => {
  if (clockInTime === '--:--') {
    setError('請先進行上班打卡');
    return {
      success: false,
      message: '請先進行上班打卡'
    };
  }
  
  setLoading(true);
  setError(null);
  
  try {
    // 使用 Checkinfo 獲取完整信息
    const info = await Checkinfo();
    console.log('下班打卡使用的完整信息:', info);

    // 準備位置信息
    let location = {
      latitude: info.latitude || userLocation.latitude,
      longitude: info.longitude || userLocation.longitude
    };

    // 如果沒有位置信息，嘗試更新位置
    if (!location.latitude || !location.longitude) {
      try {
        location = await updateLocation();
        console.log('已更新位置信息:', location);
      } catch (locError) {
        console.error('獲取位置失敗:', locError);
        setError('打卡失敗: 無法獲取位置信息，請確保已開啟位置權限');
        return {
          success: false,
          message: '無法獲取位置信息，請確保已開啟位置權限',
          error: locError
        };
      }
    }

    // 如果仍然沒有位置信息，則無法打卡
    if (!location.latitude || !location.longitude) {
      setError('打卡失敗: 無法獲取位置信息，請確保已開啟位置權限');
      return {
        success: false,
        message: '無法獲取位置信息，請確保已開啟位置權限'
      };
    }

    // 確保經緯度是有效的數字
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      console.error('經緯度不是有效數字:', location);
      setError('打卡失敗: 獲取到的位置信息無效，請確保已開啟位置權限');
      return {
        success: false,
        message: '獲取到的位置信息無效，請確保已開啟位置權限'
      };
    }

    // 準備網絡信息
    let networkData = {
      ssid: info.ssid || networkInfo.ssid || 'UNKNOWN',
      bssid: info.bssid || networkInfo.bssid || 'XX:XX:XX:XX:XX:XX',
      isWifi: info.ssid !== 'Network line'
    };

    // 準備私有 IP - 移除預設值 0.0.0.0
    let xtbbddtxValue = info.privateIp || privateIp;
    
    // 如果還是沒有獲取到，再嘗試一次從 Flutter 獲取
    if (!xtbbddtxValue && window.flutter && typeof window.flutter.getxtbbddtx === 'function') {
      try {
        xtbbddtxValue = await window.flutter.getxtbbddtx();
        console.log('最後嘗試從 Flutter 獲取私有 IP:', xtbbddtxValue);
      } catch (e) {
        console.error('最後嘗試獲取私有 IP 失敗:', e);
      }
    }
    
    // 重新獲取公共 IP 地址 - 這是關鍵修改部分
    let currentPublicIp = publicIp;
    try {
      console.log('下班打卡前重新獲取公共 IP...');
      
      // 嘗試使用多個服務獲取公共 IP
      // 方法1: 使用 ipify API
      try {
        const ipifyResponse = await fetch('https://api.ipify.org?format=json', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (ipifyResponse.ok) {
          const ipifyData = await ipifyResponse.json();
          if (ipifyData.ip && ipifyData.ip !== '54.238.176.82') {
            currentPublicIp = ipifyData.ip;
            console.log('下班打卡: 從 ipify 獲取公共 IP:', ipifyData.ip);
          } else {
            console.log('下班打卡: ipify 返回伺服器 IP，嘗試其他方法');
          }
        }
      } catch (err) {
        console.error('下班打卡: 從 ipify 獲取公共 IP 失敗:', err);
      }
      
      // 如果 ipify 失敗，嘗試 ipinfo.io
      if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
        try {
          const ipinfoResponse = await fetch('https://ipinfo.io/json', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (ipinfoResponse.ok) {
            const ipinfoData = await ipinfoResponse.json();
            if (ipinfoData.ip && ipinfoData.ip !== '54.238.176.82') {
              currentPublicIp = ipinfoData.ip;
              console.log('下班打卡: 從 ipinfo.io 獲取公共 IP:', ipinfoData.ip);
            } else {
              console.log('下班打卡: ipinfo.io 返回伺服器 IP，嘗試其他方法');
            }
          }
        } catch (err) {
          console.error('下班打卡: 從 ipinfo.io 獲取公共 IP 失敗:', err);
        }
      }
      
      // 如果 ipinfo.io 也失敗，嘗試 cloudflare
      if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
        try {
          const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (cfResponse.ok) {
            const cfText = await cfResponse.text();
            const ipMatch = cfText.match(/ip=([0-9.]+)/);
            if (ipMatch && ipMatch[1] && ipMatch[1] !== '54.238.176.82') {
              currentPublicIp = ipMatch[1];
              console.log('下班打卡: 從 Cloudflare 獲取公共 IP:', ipMatch[1]);
            } else {
              console.log('下班打卡: Cloudflare 返回伺服器 IP，嘗試其他方法');
            }
          }
        } catch (err) {
          console.error('下班打卡: 從 Cloudflare 獲取公共 IP 失敗:', err);
        }
      }
      
      // 最後嘗試自定義 API
      if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
        try {
          const customApiResponse = await fetch(`${API_BASE_URL}/api/client-ip`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (customApiResponse.ok) {
            const customApiData = await customApiResponse.json();
            if (customApiData.ip && customApiData.ip !== '54.238.176.82') {
              currentPublicIp = customApiData.ip;
              console.log('下班打卡: 從自定義 API 獲取公共 IP:', customApiData.ip);
            } else {
              console.log('下班打卡: 自定義 API 返回伺服器 IP，使用備用方法');
            }
          }
        } catch (err) {
          console.error('下班打卡: 從自定義 API 獲取公共 IP 失敗:', err);
        }
      }
      
      // 如果所有方法都失敗，使用空字符串
      if (!currentPublicIp || currentPublicIp === '54.238.176.82') {
        console.log('下班打卡: 所有方法獲取公共 IP 失敗，使用空字符串');
        currentPublicIp = '';
      }
      
    } catch (ipError) {
      console.error('下班打卡: 獲取公共 IP 過程中發生錯誤:', ipError);
      currentPublicIp = ''; // 出錯時使用空字符串
    }

    // 獲取當前時間 - 使用帶時區的 ISO 格式
    const now = new Date();
    
    // 創建帶時區的 ISO 字符串 (格式: "2025-06-25T17:55:00+08:00")
    const tzOffset = -now.getTimezoneOffset();
    const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
    const tzOffsetMinutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
    const tzSign = tzOffset >= 0 ? '+' : '-';
    
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const utcTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzSign}${tzOffsetHours}:${tzOffsetMinutes}`;
    
    // 本地時間格式化 - 僅用於顯示
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedDate = `${year}-${month}-${day}`;
    const timeForDisplay = `${hours}:${minutes}`;
    
    // 準備網路資訊 - 根據連接類型設置
    let ssidValue;
    if (networkData.isWifi) {
      // 如果是WiFi連接，使用SSID
      ssidValue = networkData.ssid;
    } else {
      // 如果是固定網路，設為Network line
      ssidValue = 'Network line';
    }
    
    // 準備下班原因（如有需要）
    let reason = '';
    
    // 檢查是否有 SSID 錯誤，如果有，加入到 reason
    if (ssidError) {
      reason = `SSID錯誤: ${ssidError}`;
    }
    
    // 構建打卡數據 - 使用從 Flutter 獲取的完整信息，移除預設值
const payload = {
  company_id: companyId,
  employee_id: employeeId,
  utc_timestamp: utcTimestamp,
  event_id: currentEventId || null, // 使用當前事件ID
  ssid: ssidValue,
  bssid: networkData.bssid, // 添加 BSSID
  xtbbddtx: xtbbddtxValue || '', // 使用空字符串作為備用
  public_ip: currentPublicIp, // 使用重新獲取的公共 IP
  longitude: location.longitude,
  latitude: location.latitude,
  reason: reason || null // 添加下班原因
};

    
    console.log(`發送下班打卡請求 (使用 Checkinfo):`, JSON.stringify(payload, null, 2));
    
    // 使用支援離線的 API 呼叫
const apiResult = await handleApiWithOfflineCache(
  `${API_BASE_URL}/api/check-out-google`,
  payload,
  {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  }
);

let responseData;
if (apiResult.cached) {
  // 離線狀態 - 請求已快取，繼續正常的 UI 更新流程
  console.log('下班打卡已快取，等待網路恢復後上傳');
  
  // 模擬成功回應以繼續 UI 更新
  responseData = {
    Status: "Ok",
    Data: {}
  };
} else {
  // 線上狀態 - 處理正常的 API 回應
  responseData = apiResult.data;
  
  if (responseData.Status !== "Ok") {
    throw new Error(responseData.Msg || '打卡處理失敗');
  }
}

    
    console.log('下班打卡成功:', responseData);
    
    // 更新UI
    setClockOutTime(timeForDisplay);
    setPunchStatus('CLOCKED_OUT');
    
    // 檢查下班打卡狀態
    const clockOutCheckResult = await checkClockOutStatus(
      formattedTime,
      formattedDate,
      currentEventId,
      utcTimestamp
    );
    
    console.log('下班打卡狀態檢查結果:', clockOutCheckResult);
    
    // 查詢最新打卡記錄
    setTimeout(() => {
      fetchAttendanceRecords();
    }, 2000);
    
    // 更新本地存儲中的打卡記錄 - 保持現有的考勤結果
    const storedData = localStorage.getItem(`punchData_${companyId}_${employeeId}_${currentDate}`);
    let punchData = storedData ? JSON.parse(storedData) : {};
    
    punchData.clockOutTime = timeForDisplay;
    punchData.clockOutFullTime = formattedTime;
    punchData.clockOutDate = formattedDate;
    punchData.clockOutUtcTimestamp = utcTimestamp;
    punchData.clockOutReason = reason; // 儲存下班原因
    punchData.clockOutStatus = clockOutCheckResult.status === 'success' ? clockOutCheckResult.data?.attendance_status : null; // 儲存下班打卡狀態
    punchData.clockOutResult = clockOutResult; // 保持現有的下班考勤結果
    // 更新從 Flutter 獲取的信息
    punchData.flutterInfo = { ...punchData.flutterInfo, ...info };
    // 儲存使用的公共 IP
    punchData.publicIp = currentPublicIp;
    // 儲存使用的位置信息
    punchData.locationUsedForClockOut = location;
    
    localStorage.setItem(`punchData_${companyId}_${employeeId}_${currentDate}`, JSON.stringify(punchData));
    
    return {
      success: true,
      data: responseData.Data,
      message: '下班打卡成功'
    };
    
  } catch (err) {
    console.error('下班打卡失敗:', err);
    setError('下班打卡失敗: ' + (err.message || '未知錯誤'));
    
    return {
      success: false,
      message: err.message || '下班打卡失敗',
      error: err
    };
  } finally {
    setLoading(false);
  }
};


/**
 * 查詢打卡記錄，更新標籤狀態
 * @param {Object} params - 查詢所需參數
 * @returns {Promise<Object>} 查詢結果
 */
export const fetchAttendanceRecordsFunction = async ({
  companyId,
  employeeId,
  currentDate,
  authToken,
  setClockInTime,
  setClockOutTime,
  setPunchStatus,
  setCurrentEventId,
  setClockInResult,
  setClockOutResult,
  setIsLate,
  updateLocalStorageWithResults
}) => {
  try {
    if (!companyId || !employeeId || !currentDate) {
      console.log('缺少查詢考勤記錄的必要參數');
      return {
        success: false,
        message: '缺少查詢考勤記錄的必要參數'
      };
    }
    
    console.log('使用新 API 查詢考勤記錄...');
    
    // 使用新的 API 端點查詢考勤記錄
    const queryParams = new URLSearchParams({
      company_id: companyId,
      employee_id: employeeId,
      work_date: currentDate
    });
    
    const response = await fetch(`${API_BASE_URL}/api/attendance-check-in-view?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // 使用 auth_xtbb token
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 回應錯誤: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.Status === "Ok" && responseData.Data.records && responseData.Data.records.length > 0) {
      console.log('考勤記錄查詢成功:', responseData.Data.records);
      
      // 找出最新的上班打卡記錄
      const checkInRecords = responseData.Data.records.filter(record => record.attendance_type === 'check_in');
      // 找出最新的下班打卡記錄
      const checkOutRecords = responseData.Data.records.filter(record => record.attendance_type === 'check_out');
      
      // 處理上班打卡的考勤結果
      if (checkInRecords.length > 0) {
        // 按記錄日期和時間排序，獲取最新的記錄
        const latestCheckIn = checkInRecords.sort((a, b) => {
          const dateA = new Date(`${a.record_date} ${a.record_time}`);
          const dateB = new Date(`${b.record_date} ${b.record_time}`);
          return dateB - dateA; // 降序排序
        })[0];
        
        // 更新上班時間
        if (latestCheckIn.work_time) {
          const timeOnly = latestCheckIn.work_time.split(':').slice(0, 2).join(':');
          setClockInTime(timeOnly);
        }
        
        // 設置事件ID
        if (latestCheckIn.event_id) {
          setCurrentEventId(latestCheckIn.event_id);
        }
        
        // 根據 API 返回的 result 設置考勤結果
        const clockInResultData = {
          originalResult: latestCheckIn.result,
          tagClass: getTagClassFromResult(latestCheckIn.result),
          // 使用 result 而不是 reason
          tagText: getTagTextFromResult(latestCheckIn.result)
        };
        
        setClockInResult(clockInResultData);
        // 根據考勤結果設置遲到狀態
        setIsLate(clockInResultData.originalResult === 'late');
        console.log('設置上班考勤結果:', clockInResultData);
        
        // 立即更新localStorage以保持狀態
        updateLocalStorageWithResults(clockInResultData, null);
      } else {
        console.log('沒有找到上班打卡的考勤記錄');
      }
      
      // 處理下班打卡的考勤結果
      if (checkOutRecords.length > 0) {
        // 按記錄日期和時間排序，獲取最新的記錄
        const latestCheckOut = checkOutRecords.sort((a, b) => {
          const dateA = new Date(`${a.record_date} ${a.record_time}`);
          const dateB = new Date(`${b.record_date} ${b.record_time}`);
          return dateB - dateA; // 降序排序
        })[0];
        
        // 更新下班時間
        if (latestCheckOut.get_off_work_time) {
          const timeOnly = latestCheckOut.get_off_work_time.split(':').slice(0, 2).join(':');
          setClockOutTime(timeOnly);
        }
        
        // 根據 API 返回的 result 設置考勤結果
        const clockOutResultData = {
          originalResult: latestCheckOut.result,
          tagClass: getTagClassFromResult(latestCheckOut.result),
          // 使用 result 而不是 reason
          tagText: getTagTextFromResult(latestCheckOut.result)
        };
        
        setClockOutResult(clockOutResultData);
        console.log('設置下班考勤結果:', clockOutResultData);
        
        // 立即更新localStorage以保持狀態
        updateLocalStorageWithResults(null, clockOutResultData);
      } else {
        console.log('沒有找到下班打卡的考勤記錄');
      }
      
// 設置打卡狀態 - 使用常數而不是硬編碼中文
if (checkInRecords.length > 0 && checkOutRecords.length > 0) {
  setPunchStatus('CLOCKED_OUT');
} else if (checkInRecords.length > 0) {
  setPunchStatus('CLOCKED_IN');
} else {
  setPunchStatus('NOT_PUNCHED');
}

      return {
        success: true,
        data: responseData.Data,
        message: '考勤記錄查詢成功'
      };
    } else {
      console.log('沒有找到考勤記錄或查詢失敗:', responseData.Msg);
      return {
        success: false,
        message: responseData.Msg || '沒有找到考勤記錄或查詢失敗'
      };
    }
  } catch (err) {
    console.error('查詢考勤記錄失敗:', err);
    return {
      success: false,
      message: err.message || '查詢考勤記錄失敗',
      error: err
    };
  }
};

/**
 * 獲取打卡狀態
 * @param {Object} params - 查詢所需參數
 * @returns {Promise<Object>} 查詢結果
 */
export const fetchPunchStatusFunction = async ({
  companyId,
  employeeId,
  currentDate,
  clockInTime,
  setError,
  setClockInTime,
  setClockOutTime,
  setPunchStatus,
  setAttendanceStatus,
  setIsLate,
  setSsidError,
  setClockOutStatus,
  setCurrentEventId,
  setClockInResult,
  setClockOutResult,
  setFlutterInfo,
  fetchAttendanceRecords
}) => {
  if (!companyId || !employeeId || !currentDate) {
    console.log('缺少必要參數，跳過打卡狀態獲取');
    return {
      success: false,
      message: '缺少必要參數，跳過打卡狀態獲取'
    };
  }

  try {
    setError(null);
    console.log('開始獲取打卡狀態...');
    
    // 使用新的 API 查詢打卡記錄
    await fetchAttendanceRecords();
    
    // 如果API查詢後仍然沒有數據，再從localStorage獲取
    if (clockInTime === '--:--') {
      console.log('API查詢無結果，嘗試從localStorage獲取...');
      
      const storageKey = `punchData_${companyId}_${employeeId}_${currentDate}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        try {
          const punchData = JSON.parse(storedData);
          console.log('從localStorage獲取的資料:', punchData);
          
          if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
            setClockInTime(punchData.clockInTime);
          }
          
          if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
            setClockOutTime(punchData.clockOutTime);
          }
          
// 根據打卡狀態設置狀態文字 - 使用常數
if (punchData.clockOutTime && punchData.clockOutTime !== '--:--') {
  setPunchStatus('CLOCKED_OUT');
} else if (punchData.clockInTime && punchData.clockInTime !== '--:--') {
  setPunchStatus('CLOCKED_IN');
}
          
          // 恢復其他狀態
          if (punchData.attendanceStatus) {
            setAttendanceStatus(punchData.attendanceStatus);
            setIsLate(punchData.attendanceStatus.is_late || false);
            
            if (punchData.attendanceStatus.message && 
                punchData.attendanceStatus.message.includes('使用非公司網路')) {
              const ssidErrorMsg = punchData.attendanceStatus.message.split('；')[1] || 
                                  punchData.attendanceStatus.message;
              setSsidError(ssidErrorMsg);
            }
          }
          
          if (punchData.clockOutStatus) {
            setClockOutStatus(punchData.clockOutStatus);
          }
          
          if (punchData.eventId) {
            setCurrentEventId(punchData.eventId);
          }
          
          // 恢復考勤結果（如果localStorage中有的話）
          if (punchData.clockInResult) {
            setClockInResult(punchData.clockInResult);
            console.log('從localStorage恢復上班考勤結果:', punchData.clockInResult);
          }
          
          if (punchData.clockOutResult) {
            setClockOutResult(punchData.clockOutResult);
            console.log('從localStorage恢復下班考勤結果:', punchData.clockOutResult);
          }

          // 恢復從 Flutter 獲取的信息
          if (punchData.flutterInfo) {
            setFlutterInfo(punchData.flutterInfo);
            console.log('從localStorage恢復Flutter信息:', punchData.flutterInfo);
          }
          
        } catch (parseErr) {
          console.error('解析localStorage數據失敗:', parseErr);
        }
      }
    }
    
    return {
      success: true,
      message: '獲取打卡狀態成功'
    };
    
  } catch (err) {
    console.error('獲取打卡狀態失敗:', err);
    setError('獲取打卡狀態失敗: ' + err.message);
    
    return {
      success: false,
      message: err.message || '獲取打卡狀態失敗',
      error: err
    };
  }
};


/**
 * 根據打卡結果返回對應的 CSS 類名，用在顯示標籤顏色上
 * @param {string} result - 考勤結果
 * @returns {string} 標籤樣式類名
 */
export const getTagClassFromResult = (result) => {
  switch (result) {
    case 'late':
      return 'late';
    case 'ontime':
    case 'on_time':
    case 'early':
      return 'ontime';
    case 'over_time':
      return 'overtime';
    case 'early_leave':
      return 'early';
    case 'stay':
      return 'stay';
    case 'too_early':
      return 'early';
    default:
      return '';
  }
};

/**
 * 會在API中查詢回傳result，將英文轉換為中文標籤
 * @param {string} result - 考勤結果
 * @param {string} reason - 考勤原因
 * @returns {string} 標籤文字
 */
export const getTagTextFromResult = (result, reason) => {
  // 不再優先使用 reason，而是直接使用 result
  // if (reason) return reason; // 移除這一行
  
  switch (result) {
    case 'late':
      return '遲到';
    case 'ontime':
    case 'on_time':
      return '準時';
    case 'early':
      return '提早';
    case 'overtime':
    case 'over_time':
      return '加班';
    case 'early_leave':
      return '早退';
    case 'stay':
      return '滯留';
    case 'too_early':
      return '過早';
    default:
      return result || ''; // 如果沒有匹配的結果，直接顯示原始結果
  }
};


/**=========================查詢打卡紀錄頁面相關功能=========================**/

/**
 * 查詢出勤記錄
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} startDate - 開始日期 (YYYY-MM-DD)
 * @param {string} endDate - 結束日期 (YYYY-MM-DD)
 * @param {string} statusFilter - 狀態篩選 (可選)
 * @param {string} authToken - 認證 token (可選)
 * @returns {Promise<Object>} 返回出勤記錄
 */
export const fetchAttendanceRecords = async (companyId, employeeId, startDate, endDate, statusFilter = '', authToken = null) => {
  try {
    console.log(`查詢從 ${startDate} 到 ${endDate} 的出勤記錄`);
    
    // 建立查詢參數
    const queryParams = new URLSearchParams({
      company_id: companyId,
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate
    });
    
    // 如果有選擇特定狀態，添加到查詢參數
    if (statusFilter && statusFilter !== '不限') {
      // 根據 API 的狀態參數格式調整
      let apiStatus;
      switch(statusFilter) {
        case '準時':
          apiStatus = 'on_time';
          break;
        case '請假':
          apiStatus = 'leave';
          break;
        case '遲到':
          apiStatus = 'late';
          break;
        case '早退':
          apiStatus = 'early_leave';
          break;
        case '曠職':
          apiStatus = 'absent';
          break;
        default:
          apiStatus = '';
      }
      if (apiStatus) {
        queryParams.append('result', apiStatus);
      }
    }
    
    // 準備請求標頭
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // 如果有 token，添加到標頭中
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // 使用 API 端點
    const response = await fetch(`${API_BASE_URL}/api/attendance-check-in-view?${queryParams.toString()}`, {
      method: 'GET',
      headers: headers,
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (response.ok && data.Status === "Ok") {
      console.log(`成功獲取出勤記錄:`, data);
      return {
        success: true,
        data: data.Data,
        message: '成功獲取出勤記錄'
      };
    } else {
      console.error('獲取出勤記錄失敗:', data);
      return {
        success: false,
        data: null,
        message: data.Msg || '獲取出勤記錄失敗'
      };
    }
  } catch (err) {
    console.error('查詢出勤記錄時發生錯誤:', err);
    return {
      success: false,
      data: null,
      message: err.message || '查詢出勤記錄時發生錯誤',
      error: err
    };
  }
};

/**
 * 根據日期取得星期幾的中文表示
 * @param {Date} date - 日期物件
 * @returns {string} 星期幾的中文表示
 */
export const getDayOfWeek = (date) => {
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  return weekdays[date.getDay()];
};



/**
 * 將時間格式化為小時:分鐘格式
 * @param {string} time - 時間字串 (可能包含秒數)
 * @returns {string} 格式化後的時間 (HH:MM)
 */
export const formatTimeToMinutes = (time) => {
  if (!time) return '--:--';
  
  // 分割時間字串
  const parts = time.split(':');
  if (parts.length < 2) return time;
  
  // 只取小時和分鐘
  return `${parts[0]}:${parts[1]}`;
};


/**
 * 處理出勤記錄數據
 * @param {Object} data - API 返回的出勤數據
 * @param {number} targetYear - 目標年份
 * @param {number} targetMonth - 目標月份
 * @returns {Promise<Array>} 處理後的出勤記錄
 */
export const processAttendanceData = async (data, targetYear, targetMonth) => {
  try {
    console.log('處理出勤記錄...', data);
    
    // 檢查資料結構
    if (!data || !data.records || !Array.isArray(data.records) || data.records.length === 0) {
      console.log('沒有找到出勤記錄');
      
      // 檢查是否需要添加曠職記錄
      const datesWithRecords = new Set();
      const groupedRecords = {};
      
      // 添加曠職記錄
      await addAbsentRecords(groupedRecords, datesWithRecords, targetYear, targetMonth);
      
      // 檢查是否有添加曠職記錄
      const absentRecords = Object.values(groupedRecords);
      
      if (absentRecords.length > 0) {
        // 有曠職記錄，處理並顯示
        const formattedAbsentData = absentRecords.sort((a, b) => {
          const dateA = new Date(a.fullDate);
          const dateB = new Date(b.fullDate);
          return dateB - dateA; // 降序排序（由新到舊）
        });
        
        console.log('生成曠職記錄:', formattedAbsentData);
        return formattedAbsentData;
      }
      
      // 沒有任何記錄（包括曠職記錄）
      return [];
    }
    
    // 將記錄按日期分組，分別記錄上班和下班資訊
    const groupedRecords = {};
    
    // 存儲已有記錄的日期
    const datesWithRecords = new Set();
    
    // 按日期分組並分離上班和下班記錄
    console.log('按日期分組並分離上班和下班記錄...');
    
    // 首先按日期和事件ID對記錄進行分組
    const recordsByDate = {};
    
    data.records.forEach(record => {
      const workDate = record.work_date;
      if (!workDate) return;
      
      if (!recordsByDate[workDate]) {
        recordsByDate[workDate] = {};
      }
      
      if (!recordsByDate[workDate][record.event_id]) {
        recordsByDate[workDate][record.event_id] = [];
      }
      
      recordsByDate[workDate][record.event_id].push(record);
    });
    
    // 遍歷每個日期，找出最新的上班和下班記錄
    for (const dateKey in recordsByDate) {
      datesWithRecords.add(dateKey);
      
      const dateParts = dateKey.split(/[/-]/);
      if (dateParts.length !== 3) continue;
      
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      const formattedDate = `${day}`;
      
      // 建立日期物件以獲取星期幾
      const dateObj = new Date(parseInt(dateParts[0], 10), month - 1, day);
      const dayOfWeek = getDayOfWeek(dateObj);
      
      // 初始化該日期的記錄
      groupedRecords[dateKey] = {
        date: formattedDate,
        day: dayOfWeek,
        fullDate: dateKey,
        checkIn: '--:--',
        checkOut: '--:--',
        checkInResult: '',
        checkOutResult: '',
        checkInResultText: '',
        checkOutResultText: '',
        checkInAbnormal: false,
        checkOutAbnormal: false
      };
      
      // 找出最新的上班和下班記錄
      let latestCheckIn = null;
      let latestCheckOut = null;
      
      for (const eventId in recordsByDate[dateKey]) {
        const records = recordsByDate[dateKey][eventId];
        
        // 分離上班和下班記錄
        const checkInRecords = records.filter(r => r.attendance_type === 'check_in');
        const checkOutRecords = records.filter(r => r.attendance_type === 'check_out');
        
        // 如果有上班記錄，找出最新的一筆
        if (checkInRecords.length > 0) {
          const newestCheckIn = checkInRecords.reduce((newest, current) => {
            const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
            const currentDate = new Date(current.record_date + ' ' + current.record_time);
            return currentDate > newestDate ? current : newest;
          }, checkInRecords[0]);
          
          if (!latestCheckIn || new Date(newestCheckIn.record_date + ' ' + newestCheckIn.record_time) > 
                               new Date(latestCheckIn.record_date + ' ' + latestCheckIn.record_time)) {
            latestCheckIn = newestCheckIn;
          }
        }
        
        // 如果有下班記錄，找出最新的一筆
        if (checkOutRecords.length > 0) {
          const newestCheckOut = checkOutRecords.reduce((newest, current) => {
            const newestDate = new Date(newest.record_date + ' ' + newest.record_time);
            const currentDate = new Date(current.record_date + ' ' + current.record_time);
            return currentDate > newestDate ? current : newest;
          }, checkOutRecords[0]);
          
          if (!latestCheckOut || new Date(newestCheckOut.record_date + ' ' + newestCheckOut.record_time) > 
                                new Date(latestCheckOut.record_date + ' ' + latestCheckOut.record_time)) {
            latestCheckOut = newestCheckOut;
          }
        }
      }
      
      // 更新該日期的上班記錄
      if (latestCheckIn) {
        groupedRecords[dateKey].checkIn = formatTimeToMinutes(latestCheckIn.work_time);
        groupedRecords[dateKey].checkInResult = latestCheckIn.result;
        
        // 設置上班打卡結果文字和異常標記
        if (latestCheckIn.result === 'late') {
          groupedRecords[dateKey].checkInResultText = '遲到';
          groupedRecords[dateKey].checkInAbnormal = true;
        } else if (latestCheckIn.result === 'on_time' || latestCheckIn.result === 'early') {
          groupedRecords[dateKey].checkInResultText = '準時';
          groupedRecords[dateKey].checkInAbnormal = false;
        } else if (latestCheckIn.result === 'too_early') {
          groupedRecords[dateKey].checkInResultText = '過早';
          groupedRecords[dateKey].checkInAbnormal = true;
        } else {
          groupedRecords[dateKey].checkInResultText = '準時';
          groupedRecords[dateKey].checkInAbnormal = false;
        }
      }
      
      // 更新該日期的下班記錄
      if (latestCheckOut) {
        groupedRecords[dateKey].checkOut = formatTimeToMinutes(latestCheckOut.get_off_work_time);
        groupedRecords[dateKey].checkOutResult = latestCheckOut.result;
        
        // 設置下班打卡結果文字和異常標記
        if (latestCheckOut.result === 'early_leave' || latestCheckOut.result === 'early') {
          groupedRecords[dateKey].checkOutResultText = '早退';
          groupedRecords[dateKey].checkOutAbnormal = true;
        } else if (latestCheckOut.result === 'stay') {
          groupedRecords[dateKey].checkOutResultText = '滯留';
          groupedRecords[dateKey].checkOutAbnormal = true;
        } else if (latestCheckOut.result === 'overtime' || latestCheckOut.result === 'over_time') {
          groupedRecords[dateKey].checkOutResultText = '延滯';
          groupedRecords[dateKey].checkOutAbnormal = false;
        } else if (latestCheckOut.result === 'on_time') {
          groupedRecords[dateKey].checkOutResultText = '準時';
          groupedRecords[dateKey].checkOutAbnormal = false;
        } else if (latestCheckOut.result === 'unknown') {
          groupedRecords[dateKey].checkOutResultText = '準時';  // 改為準時而不是未知
          groupedRecords[dateKey].checkOutAbnormal = false;
        } else {
          groupedRecords[dateKey].checkOutResultText = '準時';
          groupedRecords[dateKey].checkOutAbnormal = false;
        }
      }
    }
    
    // 為沒有打卡記錄的工作日添加曠職記錄
    await addAbsentRecords(groupedRecords, datesWithRecords, targetYear, targetMonth);
    
    // 轉換為陣列並按日期排序 - 修改為降序排序（由新到舊）
    console.log('格式化最終數據...');
    const formattedData = Object.values(groupedRecords)
      .map(item => {
        // 如果是曠職記錄，直接返回
        if (item.isAbsent) {
          return {
            ...item,
            checkInAbnormal: true,
            checkOutAbnormal: true,
            checkInResultText: '曠職',
            checkOutResultText: '曠職'
          };
        }
        
        return item;
      })
      .sort((a, b) => {
        // 按照日期降序排序
        const dateA = new Date(a.fullDate);
        const dateB = new Date(b.fullDate);
        return dateB - dateA;
      });
    
    console.log('格式化後的數據:', formattedData);
    return formattedData;
  } catch (err) {
    console.error('處理出勤記錄時出錯:', err);
    throw err;
  }
};

/**
 * 為沒有打卡記錄的工作日添加曠職記錄
 * @param {Object} groupedRecords - 按日期分組的記錄
 * @param {Set} datesWithRecords - 已有記錄的日期集合
 * @param {number} targetYear - 目標年份
 * @param {number} targetMonth - 目標月份
 */
export const addAbsentRecords = async (groupedRecords, datesWithRecords, targetYear, targetMonth) => {
  // 獲取該月的天數
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  
  // 獲取當前日期
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  
  // 遍歷該月的每一天
  for (let day = 1; day <= daysInMonth; day++) {
    // 格式化日期
    const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 如果該日期已有記錄，則跳過
    if (datesWithRecords.has(dateStr)) {
      continue;
    }
    
    // 建立日期物件
    const dateObj = new Date(targetYear, targetMonth - 1, day);
    
    // 判斷是否為過去的日期（在當前日期之前）
    const isPastDate = (targetYear < currentYear) || 
                       (targetYear === currentYear && targetMonth < currentMonth) ||
                       (targetYear === currentYear && targetMonth === currentMonth && day < currentDay);
    
    // 只處理過去的日期
    if (isPastDate) {
      // 檢查是否為工作日（平日）
      const dayOfWeek = dateObj.getDay(); // 0是星期日，1-5是星期一到五，6是星期六
      const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
      
      // 如果是工作日，添加曠職記錄
      if (isWorkday) {
        const dayOfWeekText = getDayOfWeek(dateObj);
        
        groupedRecords[dateStr] = {
          date: String(day),
          day: dayOfWeekText,
          fullDate: dateStr,
          checkIn: '--:--',
          checkOut: '--:--',
          checkInTimestamp: 0,
          checkOutTimestamp: 0,
          checkInEventId: null,
          checkOutEventId: null,
          checkInResult: '',
          checkOutResult: '',
          isAbsent: true, // 標記為曠職
          checkInAbnormal: true,
          checkOutAbnormal: true,
          checkInResultText: '曠職',
          checkOutResultText: '曠職'
        };
      }
    }
  }
};

/**
 * 計算目標月份的開始和結束日期
 * @param {string} timeFilter - 時間篩選 ('本月' 或 '上月')
 * @returns {Object} 包含開始和結束日期的物件
 */
export const calculateDateRange = (timeFilter) => {
  const now = new Date();
  let targetYear, targetMonth, nextMonth, nextYear;
  
  if (timeFilter === '本月') {
    targetYear = now.getFullYear();
    targetMonth = now.getMonth() + 1; // JavaScript月份從0開始
  } else { // 上月
    if (now.getMonth() === 0) { // 如果是1月，則上個月是去年12月
      targetYear = now.getFullYear() - 1;
      targetMonth = 12;
    } else {
      targetYear = now.getFullYear();
      targetMonth = now.getMonth(); // 上個月
    }
  }
  
  // 計算下個月的年份和月份（用於設定結束日期）
  if (targetMonth === 12) {
    nextMonth = 1;
    nextYear = targetYear + 1;
  } else {
    nextMonth = targetMonth + 1;
    nextYear = targetYear;
  }
  
  // 格式化開始和結束日期
  const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
  
  return {
    startDate,
    endDate,
    targetYear,
    targetMonth
  };
};

/**
 * 查詢表單資料
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} category - 表單類別 (例如: "replenish", "leave", "overtime")
 * @param {string} authToken - 認證 token
 * @param {boolean} includeDetails - 是否包含詳細資料
 * @returns {Promise<Object>} 表單查詢結果
 */
export const fetchFormData = async (companyId, employeeId, category, authToken, includeDetails = true) => {
  try {
    console.log(`正在查詢員工 ${employeeId} 的${category}申請...`);
    
    // 參數驗證
    if (!companyId || !employeeId || !category || !authToken) {
      throw new Error('缺少必要參數，無法查詢表單資料');
    }
    
    // 使用 /api/forms/advanced-search API 查詢表單
    const response = await fetch(`${API_BASE_URL}/api/forms/advanced-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // 添加 auth_xtbb token
      },
      body: JSON.stringify({
        company_id: parseInt(companyId),
        employee_id: employeeId,
        category: category,
        includeDetails: includeDetails
      })
    });
    
    console.log('發送的請求參數:', {
      company_id: parseInt(companyId),
      employee_id: employeeId,
      category: category,
      includeDetails: includeDetails
    });
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API 完整回應:', data);
    
    if (data.Status !== "Ok") {
      throw new Error(data.Msg || "查詢失敗");
    }
    
    // 如果沒有找到數據，返回空數組
    if (!data.Data || data.Data.length === 0) {
      console.log('沒有找到表單數據');
      return {
        success: true,
        data: [],
        message: '沒有找到表單數據'
      };
    }
    
    // 強制在前端過濾，確保只顯示當前員工的申請
    const currentEmployeeRequests = data.Data.filter(item => {
      const itemEmployeeId = String(item.employee_id);
      const currentEmployeeId = String(employeeId);
      
      console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
      
      return itemEmployeeId === currentEmployeeId;
    });
    
    console.log(`過濾前共 ${data.Data.length} 筆申請`);
    console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的${category}申請`);
    
    return {
      success: true,
      data: currentEmployeeRequests,
      message: `成功查詢到 ${currentEmployeeRequests.length} 筆${category}申請`
    };
    
  } catch (err) {
    console.error(`查詢${category}申請失敗:`, err);
    return {
      success: false,
      data: [],
      message: err.message || `查詢${category}申請失敗`,
      error: err
    };
  }
};

/**
 * 格式化表單編號
 * @param {string} formNumber - 原始表單編號
 * @returns {string} 格式化後的表單編號
 */
export const formatFormNumber = (formNumber) => {
  if (!formNumber) return '';
  
  // 檢查是否符合 'FORM-YYYYMMDDHHMMSS-XXXXXXXXXX' 格式
  if (formNumber.startsWith('FORM-')) {
    // 分割表單編號
    const parts = formNumber.split('-');
    if (parts.length >= 2 && parts[1].length >= 14) {
      // 取出年份後兩位數字和其餘部分
      const yearLastTwoDigits = parts[1].substring(2, 4);
      const restOfTimestamp = parts[1].substring(4);
      // 將 'FORM-' 替換為 'B'，並只使用年份後兩位數字
      return 'B' + yearLastTwoDigits + restOfTimestamp;
    }
  }
  
  // 如果不符合預期格式，返回原始編號
  return formNumber;
};

/**
 * 處理補卡申請數據
 * @param {Array} formData - 原始表單數據
 * @returns {Array} 處理後的補卡申請數據
 */
export const processReplenishFormData = (formData) => {
  if (!formData || formData.length === 0) {
    return [];
  }
  
  return formData.map((item, index) => {
    console.log('處理申請項目:', item);
    console.log('詳細資料:', item.details);
    
    // 狀態映射 - 根據後端的狀態欄位
    let statusText = "簽核中";
    const currentStatus = item.status || '';
    
    switch (currentStatus.toLowerCase()) {
      case 'approved':
        statusText = "已通過";
        break;
      case 'rejected':
        statusText = "未通過";
        break;
      case 'pending':
        statusText = "簽核中";
        break;
      case 'approved_pending_hr':
        statusText = "待HR審核";
        break;
      default:
        statusText = "簽核中";
    }
    
    // 格式化申請日期
    let submitTime = "未記錄";
    if (item.application_date) {
      try {
        const date = new Date(item.application_date);
        submitTime = date.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        console.warn('日期格式化失敗:', item.application_date);
        submitTime = String(item.application_date);
      }
    }
    
    // 處理補卡類型 - 根據資料庫結構優先使用 type 欄位
    let replenishType = "未指定";
    
    // 1. 優先使用基本資料的 type 欄位
    if (item.type) {
      replenishType = item.type;
    }
    // 2. 如果基本資料沒有，嘗試從詳細資料獲取
    else if (item.details && item.details.type) {
      replenishType = item.details.type;
    }
    
    // 處理補卡原因 - 根據資料庫結構使用 Reason 欄位
    let reason = "未填寫";
    
    // 1. 優先使用詳細資料的 Reason 欄位（注意大寫R）
    if (item.details && item.details.Reason) {
      reason = item.details.Reason;
    }
    // 2. 備用：使用 illustrate 欄位
    else if (item.details && item.details.illustrate) {
      reason = item.details.illustrate;
    }
    // 3. 備用：使用基本資料的 description
    else if (item.description) {
      reason = item.description;
    }
    
    // 格式化補卡時間 - 根據資料庫結構處理
    let replenishDateTime = "未指定";

    if (item.details) {
      const replenishDate = item.details.date;
      const endTime = item.details.end_time;  // 只使用結束時間
      
      if (replenishDate) {
        // 格式化時間顯示（去除秒數）
        const formatTime = (timeStr) => {
          if (!timeStr) return '';
          return timeStr.split(':').slice(0, 2).join(':');
        };
        
        // 只顯示日期和結束時間
        const formattedEndTime = formatTime(endTime);
        if (formattedEndTime) {
          replenishDateTime = `${replenishDate} ${formattedEndTime}`;
        } else {
          replenishDateTime = replenishDate;
        }
      }
    }
    
    // 獲取員工姓名和其他基本資訊
    const employeeName = item.employee_name || "未知";
    const department = item.department || "未指定";
    const position = item.position || "未指定";
    const reviewer = item.reviewer || "未指定";
    
    return {
      id: item.form_number ? formatFormNumber(item.form_number) : `R${index + 1}`,
      status: statusText,
      originalStatus: currentStatus,
      submitTime: submitTime,
      replenishTime: replenishDateTime,
      employee: item.employee_id,
      employeeName: employeeName,
      replenishType: replenishType,
      reason: reason,
      department: department,
      position: position,
      reviewer: reviewer,
      // 保留原始資料以供詳細檢視使用
      originalData: item,
      details: item.details || null
    };
  });
};


// 在 function.js 中添加以下函數

/**
 * 獲取當前日期和時間信息
 * @returns {Object} 包含格式化日期、星期幾和時間的對象
 */
export const getCurrentDateTimeInfo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // 獲取星期幾
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const weekday = weekdays[now.getDay()];
  
  // 格式化日期
  const formattedDate = `${year}年 ${month}月${day}日 ${weekday}`;
  
  // 獲取當前時間，並向上取整到最近的五分鐘
  const hours = now.getHours();
  const minutes = Math.floor(now.getMinutes() / 5) * 5;
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  return {
    formattedDate,
    weekday,
    formattedTime
  };
};

/**
 * 格式化日期為 API 格式 (YYYY-MM-DD)
 * @param {string} dateStr - 日期字符串，例如 "2024年 9月25日 週三"
 * @returns {string} 格式化後的日期，例如 "2024-09-25"
 */
export const formatDateForApi = (dateStr) => {
  // 處理包含星期的日期格式，例如 "2024年 9月25日 週三"
  const match = dateStr.match(/(\d+)年\s*(\d+)月(\d+)日/);
  if (match) {
    const year = parseInt(match[1]);
    const month = parseInt(match[2]);
    const day = parseInt(match[3]);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return '';
};

/**
 * 生成表單編號
 * @returns {string} 生成的表單編號
 */
export const generateFormNumber = () => {
  // 獲取當前日期（台灣時間）
  const now = new Date();
  const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  
  // 提取年、月、日
  const year = taiwanTime.getUTCFullYear();
  const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
  
  // 日期部分：年月日
  const datePart = `${year}${month}${day}`;
  
  // 使用隨機數作為序號
  const randomNumber = Math.floor(Math.random() * 99999) + 1;
  const sequenceNumber = String(randomNumber).padStart(5, '0');
  
  // 組合完整編號
  return `${datePart}${sequenceNumber}`;
};

/**
 * 查詢員工基本資料
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} authToken - 認證令牌
 * @param {Function} setLoading - 設置載入狀態的函數
 * @param {Function} setEmployeeInfo - 設置員工資料的函數
 * @param {Function} setError - 設置錯誤訊息的函數
 * @param {Object} cookieUtils - Cookie 工具函數
 * @returns {Promise<void>}
 */
export const fetchEmployeeInfoFunction = async (
  companyId, 
  employeeId, 
  authToken, 
  setLoading, 
  setEmployeeInfo, 
  setError, 
  cookieUtils,
  authInProgress
) => {
  // 避免重複請求
  if (authInProgress.current || !companyId || !employeeId || !authToken) {
    console.log('認證請求已在進行中或缺少必要參數，跳過請求');
    return;
  }
  
  // 檢查 sessionStorage 中是否有緩存的員工資料
  const cachedEmployeeInfo = sessionStorage.getItem('employee_info_cache');
  if (cachedEmployeeInfo) {
    const cacheData = JSON.parse(cachedEmployeeInfo);
    const cacheTime = new Date(cacheData.timestamp);
    const now = new Date();
    // 緩存 5 分鐘內有效
    if ((now - cacheTime) < 5 * 60 * 1000) {
      console.log('使用緩存的員工資料');
      setEmployeeInfo(cacheData.data);
      return;
    }
  }
  
  try {
    authInProgress.current = true;
    setLoading(true);
    
    console.log('查詢員工資料，參數:', {
      company_id: companyId,
      employee_id: employeeId,
      authToken: authToken ? '已設置' : '未設置'
    });
    
    // 使用新系統API端點
    const response = await fetch(`${API_BASE_URL}/api/employee/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // 添加 auth_token
      },
      body: JSON.stringify({
        company_id: companyId,
        employee_id: employeeId
      })
    });
    
    const result = await response.json();
    
    if (result.Status === "Ok") {
      // 將員工資料存入 sessionStorage
      sessionStorage.setItem('employee_info_cache', JSON.stringify({
        data: result.Data,
        timestamp: new Date().toISOString()
      }));
      
      setEmployeeInfo(result.Data);
      console.log('員工資料查詢成功:', result.Data);
      
      // 將部門、職位和職等存入 cookies，有效期 3 小時
      if (result.Data.department) {
        cookieUtils.set('employee_department', result.Data.department);
      }
      if (result.Data.position) {
        cookieUtils.set('employee_position', result.Data.position);
      }
      if (result.Data.job_grade) {
        cookieUtils.set('employee_job_grade', result.Data.job_grade);
      }
    } else {
      console.error('員工資料查詢失敗:', result.Msg);
      setError(`員工資料查詢失敗: ${result.Msg}`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('查詢員工資料請求超時');
    } else {
      console.error('查詢員工資料時發生錯誤:', err);
      setError(`查詢員工資料時發生錯誤: ${err.message}`);
    }
  } finally {
    setLoading(false);
    authInProgress.current = false;
  }
};

/**
 * 提交補卡申請
 * @param {Object} params - 提交參數
 * @returns {Promise<Object>} 提交結果
 */
export const submitReplenishForm = async ({
  loading,
  formSubmitInProgress,
  companyId,
  employeeId,
  authToken,
  illustrate,
  replenishDate,
  originalTime,
  modifiedTime,
  reason,
  selectedCardType,
  employeeInfo,
  cookieUtils,
  setLoading,
  setFormSubmitted,
  setError
}) => {
  // 避免重複提交
  if (loading || formSubmitInProgress.current) {
    console.log('表單提交已在進行中，跳過重複提交');
    return {
      success: false,
      message: '表單提交已在進行中'
    };
  }
  
  if (!companyId || !employeeId || !authToken) {
    alert('公司ID或員工ID不能為空，請重新登入');
    window.location.href = '/apploginpmx/';
    return {
      success: false,
      message: '缺少必要參數'
    };
  }
  
  if (!illustrate.trim()) {
    alert('請填寫補卡說明');
    return {
      success: false,
      message: '請填寫補卡說明'
    };
  }
  
  try {
    formSubmitInProgress.current = true;
    setLoading(true);
    
    // 生成申請單號
    const formNumber = generateFormNumber();
    
    // 格式化日期
    const formattedDate = formatDateForApi(replenishDate);
    
    // 獲取當前日期時間，並調整為 UTC+8 時區
    const now = new Date();
    // 將當前時間轉換為 UTC+8 時區 (台灣時間)
    const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    // 提取年、月、日
    const year = taiwanTime.getUTCFullYear();
    const month = String(taiwanTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(taiwanTime.getUTCDate()).padStart(2, '0');
    
    // 提取時、分、秒
    const hours = String(taiwanTime.getUTCHours()).padStart(2, '0');
    const minutes = String(taiwanTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(taiwanTime.getUTCSeconds()).padStart(2, '0');
    
    // 分別設置申請日期和申請時間
    const applicationDate = `${year}-${month}-${day}`;
    
    // 從 cookies 或員工資料中獲取部門、職位和職等
    const employeeDepartment = employeeInfo?.department || cookieUtils.get('employee_department') || '';
    const employeePosition = employeeInfo?.position || cookieUtils.get('employee_position') || '';
    const employeeJobGrade = employeeInfo?.job_grade || cookieUtils.get('employee_job_grade') || '';
    const employeeSupervisor = employeeInfo?.supervisor || '';
    
    // 準備新系統API的資料格式
    const newSystemData = {
      form_number: formNumber,
      employee_id: String(employeeId), // 確保保持為字符串格式
      company_id: parseInt(companyId),
      department: employeeDepartment || '',
      position: employeePosition || '',
      job_grade: employeeJobGrade || '',
      category: "replenish",
      type: selectedCardType, // "上班" 或 "下班"
      
      // 修正欄位名稱以符合後端期望
      date: formattedDate,                     // 補卡日期
      start_time: `${originalTime}:00`,        // 開始時間（原始時間）
      end_time: `${modifiedTime}:00`,          // 結束時間（修改時間）
      Reason: reason,                          // 原因 (注意大寫 R)
      
      illustrate: illustrate || '',
      status: "待審核",
      application_date: applicationDate,
      reviewer_name: null,
      reviewer_job_grade: null,
      reviewer_status: "待審核",
      hr_name: null,
      hr_status: "待審核",
      reviewer: employeeSupervisor || '',
      employee_name: employeeInfo?.name || '',
      id_number: employeeInfo?.id_number || '',
      mobile_number: employeeInfo?.mobile_number || ''
    };

    console.log('發送到新系統的資料:', newSystemData);
    
    // 只發送到新系統 API
    const response = await fetch(`${API_BASE_URL}/api/application-forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(newSystemData),
    });
    
    // 檢查回應
    const result = await response.json();
    
    if (!result.error && result.Status === "Ok") {
      console.log('補卡申請提交成功:', result);
      setFormSubmitted(true);
      alert('補卡申請已成功提交');
      return {
        success: true,
        message: '補卡申請已成功提交',
        data: result
      };
    } else {
      throw new Error(result.Msg || '提交失敗');
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('提交請求超時');
      alert('提交請求超時，請稍後再試');
    } else {
      console.error('補卡申請失敗:', err);
      setError(err.message || '提交表單時發生錯誤');
      alert(`提交失敗: ${err.message || '未知錯誤'}`);
    }
    return {
      success: false,
      message: err.message || '提交失敗',
      error: err
    };
  } finally {
    // 確保無論成功或失敗，loading 狀態和提交標記都會被重置
    setLoading(false);
    formSubmitInProgress.current = false;
  }
};

/**
 * 處理返回首頁 - 能夠區分瀏覽器請求和手機app請求
 */
export const handleGoHomeFunction = () => {
  // 檢查是否為手機 app 環境
  const isInMobileApp = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isApp = urlParams.get('platform') === 'app';
    
    const userAgent = navigator.userAgent.toLowerCase();
    const hasFlutterAgent = userAgent.includes('flutter') || userAgent.includes('widiget');
    
    const hasFlutterContext = 
      typeof window.flutter !== 'undefined' || 
      typeof window.FlutterNativeWeb !== 'undefined';
      
    return isApp || hasFlutterAgent || hasFlutterContext;
  };

  if (isInMobileApp()) {
    console.log('檢測到 App 環境，使用 Flutter 導航');
    
    try {
      if (window.flutter && window.flutter.postMessage) {
        window.flutter.postMessage(JSON.stringify({ action: 'navigate_home' }));
      } else if (window.FlutterNativeWeb && window.FlutterNativeWeb.postMessage) {
        window.FlutterNativeWeb.postMessage(JSON.stringify({ action: 'navigate_home' }));
      } else {
        const event = new CustomEvent('flutterInAppWebViewPlatformReady', {
          detail: { action: 'navigate_home' }
        });
        document.dispatchEvent(event);
      }
    } catch (err) {
      console.error('無法使用 Flutter 導航:', err);
      window.location.href = '/frontpagepmx';
    }
  } else {
    console.log('瀏覽器環境，使用 window.location.href 導航');
    window.location.href = '/frontpagepmx';
  }
};


/**
 * 獲取表單數據的通用函數（從 LeavePage 提取並通用化）
 * @param {string} companyId - 公司ID
 * @param {string} employeeId - 員工ID
 * @param {string} category - 表單類別 (leave, work_overtime, replenish)
 * @param {string} authToken - 認證token
 * @returns {Promise<Object>} 處理後的申請數據
 */
export const fetchAndProcessFormData = async (companyId, employeeId, category, authToken) => {
  try {
    console.log(`正在查詢員工 ${employeeId} 的${category}申請...`);
    
    // 使用與 LeavePage 相同的 API 調用
    const response = await fetch(`${API_BASE_URL}/api/forms/advanced-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        company_id: parseInt(companyId),
        employee_id: employeeId,
        category: category,
        includeDetails: true
      })
    });
    
    console.log('發送的請求參數:', {
      company_id: parseInt(companyId),
      employee_id: employeeId,
      category: category,
      includeDetails: true
    });
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API 完整回應:', data);
    
    if (data.Status !== "Ok") {
      throw new Error(data.Msg || "查詢失敗");
    }
    
    if (!data.Data || data.Data.length === 0) {
      console.log(`沒有找到${category}申請數據`);
      return [];
    }
    
    // 強制在前端過濾，確保只顯示當前員工的申請（與 LeavePage 相同邏輯）
    const currentEmployeeRequests = data.Data.filter(item => {
      const itemEmployeeId = String(item.employee_id);
      const currentEmployeeId = String(employeeId);
      
      console.log(`過濾檢查: API回應員工ID="${itemEmployeeId}", 當前員工ID="${currentEmployeeId}", 匹配=${itemEmployeeId === currentEmployeeId}`);
      
      return itemEmployeeId === currentEmployeeId;
    });
    
    console.log(`過濾前共 ${data.Data.length} 筆申請`);
    console.log(`過濾後找到 ${currentEmployeeRequests.length} 筆屬於員工 ${employeeId} 的${category}申請`);
    
    // 根據不同類別處理數據
    const processedRequests = currentEmployeeRequests.map((item, index) => {
      console.log(`處理第 ${index + 1} 筆${category}申請:`, item);
      console.log('詳細資料:', item.details);
      
      // 狀態映射（與 LeavePage 相同邏輯）
      let statusText = "簽核中";
      const currentStatus = item.status || '';
      
      const statusLower = currentStatus.toLowerCase();
      
      if (statusLower === 'approved' || 
          statusLower === 'ok' || 
          statusLower === '已完成' || 
          statusLower === '1') {
        statusText = "已通過";
      } 
      else if (statusLower === 'rejected' || 
               statusLower === 'no' || 
               statusLower === '未通過' || 
               statusLower === '2') {
        statusText = "未通過";
      }
      else if (statusLower === 'pending' || 
               statusLower === '待審核' || 
               statusLower === 'approved_pending_hr') {
        statusText = "簽核中";
      }
      
      // 格式化申請日期
      let submitTime = "未記錄";
      if (item.application_date) {
        submitTime = formatDateTime(item.application_date);
      }
      
      // 格式化表單編號
      const formNumber = formatFormNumber(item.form_number || `${category.toUpperCase()}${Date.now()}`);
      
      console.log(`${category}狀態處理結果:`, {
        原始狀態: currentStatus,
        處理後狀態: statusText,
        表單編號: formNumber
      });
      
      // 根據類別返回不同的數據結構
      if (category === 'work_overtime') {
        // 加班申請數據結構
        let startDateTime = "未記錄";
        let endDateTime = "未記錄";
        let totalHours = "0";
        
        if (item.details) {
          if (item.details.start_time) {
            startDateTime = formatDateTime(item.details.start_time);
          }
          if (item.details.end_time) {
            endDateTime = formatDateTime(item.details.end_time);
          }
          if (item.details.total_hours) {
            totalHours = item.details.total_hours.toString();
          }
        }
        
        return {
          id: formNumber,
          status: statusText,
          originalStatus: currentStatus,
          submitTime: submitTime,
          startTime: startDateTime,
          endTime: endDateTime,
          totalHours: totalHours,
          employee: item.employee_id || employeeId,
          employeeName: item.employee_name || "未指定",
          overtimeType: item.details?.overtime_type || "一般加班",
          compensationType: item.details?.compensation_type || "加班費",
          reason: item.details?.illustrate || item.description || "未填寫",
          reviewer: item.reviewer || "未指定",
          originalData: item
        };
      } else if (category === 'replenish') {
        // 補卡申請數據結構
        let replenishDate = "未記錄";
        let replenishTime = "未記錄";
        let replenishType = "上班";
        
        if (item.details) {
          if (item.details.replenish_date) {
            replenishDate = formatDateTime(item.details.replenish_date);
          }
          if (item.details.replenish_time) {
            replenishTime = item.details.replenish_time;
          }
          if (item.details.replenish_type) {
            replenishType = item.details.replenish_type;
          }
        }
        
        return {
          id: formNumber,
          status: statusText,
          originalStatus: currentStatus,
          submitTime: submitTime,
          replenishDate: replenishDate,
          replenishTime: replenishTime,
          replenishType: replenishType,
          employee: item.employee_id || employeeId,
          employeeName: item.employee_name || "未指定",
          reason: item.details?.reason || item.description || "未填寫",
          reviewer: item.reviewer || "未指定",
          originalData: item
        };
      }
      
      // 預設返回基本結構
      return {
        id: formNumber,
        status: statusText,
        originalStatus: currentStatus,
        submitTime: submitTime,
        employee: item.employee_id || employeeId,
        employeeName: item.employee_name || "未指定",
        reason: item.details?.reason || item.description || "未填寫",
        reviewer: item.reviewer || "未指定",
        originalData: item
      };
    });
    
    console.log(`成功處理 ${processedRequests.length} 筆${category}申請`);
    return processedRequests;
    
  } catch (err) {
    console.error(`獲取${category}申請失敗:`, err);
    throw err;
  }
};

/**
 * 通用的狀態過濾函數（從 LeavePage 提取）
 * @param {Array} requests - 申請列表
 * @param {string} activeTab - 當前標籤
 * @returns {Array} 過濾後的申請列表
 */
export const getFilteredRequests = (requests, activeTab) => {
  if (activeTab === "總覽") {
    return requests;
  } else if (activeTab === "簽核中") {
    return requests.filter(request => {
      const status = request.originalStatus.toLowerCase();
      return status === "pending" || 
             status === "待審核" || 
             status === "approved_pending_hr" ||
             status === "" || 
             !status;
    });
  } else if (activeTab === "已通過") {
    return requests.filter(request => {
      const status = request.originalStatus.toLowerCase();
      return status === "ok" || 
             status === "approved" || 
             status === "已完成" || 
             status === "1";
    });
  } else if (activeTab === "未通過") {
    return requests.filter(request => {
      const status = request.originalStatus.toLowerCase();
      return status === "no" || 
             status === "rejected" || 
             status === "未通過" || 
             status === "2";
    });
  }
  return requests;
};

/**
 * 格式化日期時間的函數（從 LeavePage 提取）
 */
export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "未記錄";
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr; // 如果無法解析日期，返回原始字符串
  
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
};

// 🔥 添加員工編號對應映射表
const EMPLOYEE_ID_MAPPING = {
  // PMX_employee_info ID -> Employee_Basic_Information ID
  '0880311': '880311',
  '0950301': '950301', 
  '0950602': '950601',  // 陳信遑的對應
  '0990601': '990601',
  '0990623': '990623',
  '1000314': '1000314',
  '1010402': '1010402',
  '1030925': '1030925',
  '1041001': '1041001',
  '1061222': '1061222',
  '1071001-1': '1071001',  // 張嘉真
  '1071001-3': '1071002',  // 盧宜姿
  '1091005': '1091005',
  '1091214': '1091214',
  '1100126': '1100126',
  '1100901-1': '1100901',  // 宋展輝
  '1100901-2': '1100902',  // 王榮陞
  '1100927': '1100927',
  '1101018': '1101018',
  '1110223': '1110223',
  '1110530': '1110530',
  '1111024': '1111024',
  '1111128': '1111128',
  '1120215': '1120215'
};

/**
 * 將 PMX_employee_info 的員工編號轉換為 Employee_Basic_Information 的員工編號
 * @param {string} pmxEmployeeId - PMX_employee_info 資料表的員工編號
 * @returns {string} Employee_Basic_Information 資料表的員工編號
 */
export const mapPmxToBasicEmployeeId = (pmxEmployeeId) => {
  if (!pmxEmployeeId) {
    console.warn('員工編號為空，無法進行映射');
    return pmxEmployeeId;
  }
  
  const mappedId = EMPLOYEE_ID_MAPPING[pmxEmployeeId];
  
  if (mappedId) {
    console.log(`員工編號映射: ${pmxEmployeeId} -> ${mappedId}`);
    return mappedId;
  } else {
    console.log(`未找到員工編號 ${pmxEmployeeId} 的映射，使用原始編號`);
    return pmxEmployeeId;
  }
};

/**
 * 將 Employee_Basic_Information 的員工編號轉換為 PMX_employee_info 的員工編號
 * @param {string} basicEmployeeId - Employee_Basic_Information 資料表的員工編號
 * @returns {string} PMX_employee_info 資料表的員工編號
 */
export const mapBasicToPmxEmployeeId = (basicEmployeeId) => {
  if (!basicEmployeeId) {
    console.warn('員工編號為空，無法進行映射');
    return basicEmployeeId;
  }
  
  // 反向查找映射
  const pmxId = Object.keys(EMPLOYEE_ID_MAPPING).find(key => 
    EMPLOYEE_ID_MAPPING[key] === basicEmployeeId
  );
  
  if (pmxId) {
    console.log(`員工編號反向映射: ${basicEmployeeId} -> ${pmxId}`);
    return pmxId;
  } else {
    console.log(`未找到員工編號 ${basicEmployeeId} 的反向映射，使用原始編號`);
    return basicEmployeeId;
  }
};

/**
 * 檢查員工編號是否存在於映射表中
 * @param {string} employeeId - 員工編號
 * @returns {boolean} 是否存在映射
 */
export const hasEmployeeIdMapping = (employeeId) => {
  return EMPLOYEE_ID_MAPPING.hasOwnProperty(employeeId) || 
         Object.values(EMPLOYEE_ID_MAPPING).includes(employeeId);
};

/**
 * 獲取所有支援的員工編號列表
 * @returns {Object} 包含 PMX 和 Basic 編號列表的物件
 */
export const getSupportedEmployeeIds = () => {
  return {
    pmxIds: Object.keys(EMPLOYEE_ID_MAPPING),
    basicIds: Object.values(EMPLOYEE_ID_MAPPING),
    mapping: EMPLOYEE_ID_MAPPING
  };
};

/**
 * 批量轉換員工編號（PMX -> Basic）
 * @param {Array} pmxEmployeeIds - PMX 員工編號陣列
 * @returns {Array} 轉換後的 Basic 員工編號陣列
 */
export const batchMapPmxToBasic = (pmxEmployeeIds) => {
  if (!Array.isArray(pmxEmployeeIds)) {
    console.warn('輸入必須是陣列');
    return [];
  }
  
  return pmxEmployeeIds.map(id => mapPmxToBasicEmployeeId(id));
};

/**
 * 批量轉換員工編號（Basic -> PMX）
 * @param {Array} basicEmployeeIds - Basic 員工編號陣列
 * @returns {Array} 轉換後的 PMX 員工編號陣列
 */
export const batchMapBasicToPmx = (basicEmployeeIds) => {
  if (!Array.isArray(basicEmployeeIds)) {
    console.warn('輸入必須是陣列');
    return [];
  }
  
  return basicEmployeeIds.map(id => mapBasicToPmxEmployeeId(id));
};

/**
 * 檢查網路狀態並處理 API 請求（離線時快取到 Flutter）
 * @param {string} url - API URL
 * @param {Object} data - 請求資料
 * @param {Object} headers - 請求標頭
 * @returns {Promise<Object>} API 回應或快取狀態
 */
export const handleApiWithOfflineCache = async (url, data, headers = {}) => {
  // 檢查網路連線狀態
  if (!navigator.onLine) {
    console.log('離線狀態，將請求快取到 Flutter');
    
    // 打包完整的請求資料
    const requestPacket = {
      url: url,
      method: 'POST',
      body: data,
      headers: headers,
      timestamp: Date.now()
    };
    
    // 傳送給 Flutter 保管
    if (window.FlutterBridge) {
      try {
        window.FlutterBridge.postMessage(JSON.stringify({
          action: 'CACHE_REQUEST',
          payload: requestPacket
        }));
        
        console.log('請求已快取到 Flutter:', requestPacket);
        
        return {
          success: true,
          cached: true,
          message: '請求已快取，將在網路恢復時自動上傳',
          status: 'QUEUED'
        };
      } catch (error) {
        console.error('無法將請求快取到 Flutter:', error);
        throw new Error('離線狀態下無法處理請求');
      }
    } else {
      console.error('Flutter Bridge 不可用');
      throw new Error('離線狀態下無法處理請求');
    }
  }
  
  // 有網路則正常呼叫原有 API
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return {
      success: true,
      cached: false,
      data: result,
      message: 'API 請求成功'
    };
  } catch (error) {
    console.error('API 請求失敗:', error);
    throw error;
  }
};

