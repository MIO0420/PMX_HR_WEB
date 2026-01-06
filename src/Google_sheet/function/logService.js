// /**
//  * LogService - 統一 Log 格式日誌服務
//  * 專門針對 API 端點設計，支援統一格式、自動化功能和 IP 獲取
//  */

// // IP 獲取服務類
// class IPService {
//   constructor() {
//     this.ipServices = [
//       'https://api.ipify.org/?format=json',
//       'https://ipapi.co/json/',
//       'https://api.ip.sb/jsonip',
//       'https://ipinfo.io/json',
//       'https://api.myip.com'
//     ];
//   }

//   async getClientIP() {
//     for (const service of this.ipServices) {
//       try {
//         console.log(`嘗試獲取 IP: ${service}`);
        
//         const response = await fetch(service, {
//           method: 'GET',
//           signal: AbortSignal.timeout(5000) // 5秒超時
//         });

//         if (response.ok) {
//           const data = await response.json();
          
//           // 不同服務的回應格式不同
//           const ip = data.ip || data.query || data.ipAddress || data.origin;
          
//           if (ip && this.isValidIP(ip)) {
//             console.log(`成功獲取 IP: ${ip} (來源: ${service})`);
//             return ip;
//           }
//         }
//       } catch (error) {
//         console.warn(`IP 服務失敗 ${service}:`, error.message);
//         continue;
//       }
//     }

//     // 所有服務都失敗，返回預設值
//     console.warn('所有 IP 服務都失敗，使用預設 IP');
//     return '127.0.0.1';
//   }

//   isValidIP(ip) {
//     const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
//     return ipRegex.test(ip);
//   }
// }

// // 本地 IP 獲取服務類
// class LocalIPService {
//   async getLocalIP() {
//     return new Promise((resolve) => {
//       const pc = new RTCPeerConnection({
//         iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//       });

//       pc.createDataChannel('');
//       pc.createOffer().then(offer => pc.setLocalDescription(offer));

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           const candidate = event.candidate.candidate;
//           const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
//           if (ipMatch) {
//             pc.close();
//             resolve(ipMatch[1]);
//           }
//         }
//       };

//       // 超時處理
//       setTimeout(() => {
//         pc.close();
//         resolve('127.0.0.1');
//       }, 3000);
//     });
//   }
// }

// // 主要 LogService 類
// class LogService {
//   constructor() {
//     // 基本配置
//     this.serviceName = 'checkin-system';
//     this.serviceVersion = '1.0.0';
//     this.elkApiEndpoint = 'http://elk.54ucl.com:50000';
    
//     // 環境檢測
//     this.isLocalhost = this._detectLocalhost();
//     this.isHTTPS = window.location.protocol === 'https:';
//     this.mixedContentWorkaround = this.isHTTPS;
    
//     // 服務狀態
//     this.isEnabled = true; // 所有環境都啟用
//     this.isStarted = false;
    
//     // Heartbeat 配置
//     this.heartbeatInterval = null;
//     this.heartbeatIntervalMs = 60000; // 60 秒
//     this.isHeartbeatActive = false;
    
//     // Boot Log 標記
//     this.bootLogSent = false;
    
//     // IP 服務
//     this.ipService = new IPService();
//     this.localIPService = new LocalIPService();
//     this.clientIP = null;
    
//     // 初始化
//     this._initialize();
//   }

//   // ========== 初始化方法 ==========

//   _detectLocalhost() {
//     return window.location.hostname === 'localhost' || 
//            window.location.hostname === '127.0.0.1' ||
//            window.location.hostname.includes('localhost');
//   }

//   async _initialize() {
//     console.log('📡 LogService 已初始化');
//     console.log(`   服務: ${this.serviceName} v${this.serviceVersion}`);
//     console.log(`   API 端點: ${this.elkApiEndpoint}`);
//     console.log(`   環境: ${this.isLocalhost ? 'localhost' : 'production'}`);
//     console.log(`   HTTPS: ${this.isHTTPS ? '是' : '否'}`);
//     console.log(`   Mixed Content 處理: ${this.mixedContentWorkaround ? '啟用' : '禁用'}`);
//     console.log('💓 Heartbeat 服務已準備 (60秒間隔)');
//     console.log('🚀 Boot Log 服務已準備');
    
//     // 異步獲取 IP，不阻塞初始化
//     this._initializeIP();
//   }

//   async _initializeIP() {
//     try {
//       this.clientIP = await this.ipService.getClientIP();
//       console.log(`🌐 客戶端 IP: ${this.clientIP}`);
//     } catch (error) {
//       console.warn('🌐 IP 獲取失敗，使用預設值:', error.message);
//       this.clientIP = '127.0.0.1';
//     }
//   }

//   // ========== 核心方法 ==========

//   /**
//    * 取得 ISO 格式時間戳
//    */
//   _getTimestamp() {
//     return new Date().toISOString();
//   }

//   /**
//    * 取得服務資訊
//    */
//   _getServiceInfo() {
//     return {
//       name: this.serviceName,
//       version: this.serviceVersion
//     };
//   }

//   /**
//    * 生成事件 ID
//    */
//   _generateEventId() {
//     const now = new Date();
//     const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
//     const timeStr = now.toISOString().slice(11, 19).replace(/:/g, '');
//     const ms = String(now.getMilliseconds()).padStart(3, '0');
//     return `log_${dateStr}_${timeStr}_${ms}`;
//   }

//   /**
//    * 獲取會話 ID
//    */
//   _getSessionId() {
//     let sessionId = sessionStorage.getItem('log_session_id');
//     if (!sessionId) {
//       sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//       sessionStorage.setItem('log_session_id', sessionId);
//     }
//     return sessionId;
//   }

//   /**
//    * 獲取 IP 地址的方法
//    */
//   getClientIP() {
//     return this.clientIP || '127.0.0.1';
//   }

//   // ========== API 傳輸方法 ==========

//   /**
//    * 標準 HTTP API 發送
//    */
//   async _sendViaAPI(logData) {
//     const response = await fetch(this.elkApiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify(logData),
//       signal: AbortSignal.timeout(10000) // 10秒超時
//     });

//     if (!response.ok) {
//       throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//     }

//     return await response.json();
//   }

//   /**
//    * Mixed Content 環境下的 API 發送 (no-cors)
//    */
//   async _sendViaAPINoCors(logData) {
//     await fetch(this.elkApiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(logData),
//       mode: 'no-cors' // 不會收到回應，但可以發送
//     });
//     return { status: 'sent', mode: 'no-cors' };
//   }

//   /**
//    * iframe 方式發送 (Mixed Content 備用方案)
//    */
//   async _sendViaIframe(logData) {
//     return new Promise((resolve, reject) => {
//       const iframe = document.createElement('iframe');
//       iframe.style.display = 'none';
      
//       const html = `
//         <!DOCTYPE html>
//         <html>
//         <body>
//           <script>
//             fetch('${this.elkApiEndpoint}', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: '${JSON.stringify(logData).replace(/'/g, "\\'")}',
//               mode: 'no-cors'
//             }).then(() => {
//               parent.postMessage({type: 'success'}, '*');
//             }).catch(() => {
//               parent.postMessage({type: 'error'}, '*');
//             });
//           </script>
//         </body>
//         </html>
//       `;

//       const messageHandler = (event) => {
//         if (event.data.type === 'success') {
//           cleanup();
//           resolve({ status: 'sent', mode: 'iframe' });
//         } else if (event.data.type === 'error') {
//           cleanup();
//           reject(new Error('iframe 發送失敗'));
//         }
//       };

//       const cleanup = () => {
//         window.removeEventListener('message', messageHandler);
//         if (document.body.contains(iframe)) {
//           document.body.removeChild(iframe);
//         }
//       };

//       window.addEventListener('message', messageHandler);
//       setTimeout(() => {
//         cleanup();
//         reject(new Error('iframe 發送超時'));
//       }, 15000);

//       document.body.appendChild(iframe);
//       iframe.contentDocument.open();
//       iframe.contentDocument.write(html);
//       iframe.contentDocument.close();
//     });
//   }

//   /**
//    * 統一發送方法
//    */
//   async _sendToAPI(logData) {
//     if (!this.isEnabled) {
//       return false;
//     }

//     try {
//       let result;
      
//       if (this.mixedContentWorkaround) {
//         // HTTPS 環境下的處理
//         try {
//           result = await this._sendViaAPINoCors(logData);
//           console.log('✅ 日誌已透過 API 發送 (no-cors)');
//         } catch (error) {
//           console.warn('no-cors 發送失敗，嘗試 iframe 方法:', error.message);
//           result = await this._sendViaIframe(logData);
//           console.log('✅ 日誌已透過 API 發送 (iframe)');
//         }
//       } else {
//         // HTTP 環境下的標準發送
//         result = await this._sendViaAPI(logData);
//         console.log('✅ 日誌已透過 API 發送 (direct)');
//       }

//       return result;
//     } catch (error) {
//       console.warn('⚠️ API 日誌發送失敗:', error.message);
//       return false;
//     }
//   }

//   // ========== 統一 Log 格式方法 ==========

//   /**
//    * 發送 Heartbeat
//    */
//   async sendHeartbeat() {
//     const heartbeat = {
//       type: "heartbeat",
//       timestamp: this._getTimestamp(),
//       service: this._getServiceInfo(),
//       message: "存活"
//     };

//     // 記錄到控制台和本地
//     console.log('[HEARTBEAT]', heartbeat);
//     this._storeLogLocally(heartbeat);

//     // 發送到 API
//     const result = await this._sendToAPI(heartbeat);
    
//     if (result) {
//       console.log('💓 Heartbeat 已記錄');
//     } else {
//       console.warn('💓 Heartbeat 記錄失敗');
//     }

//     return !!result;
//   }

//   /**
//    * 發送 Boot Log
//    */
//   async sendBootLog() {
//     if (this.bootLogSent) {
//       console.log('Boot Log 已發送，跳過重複發送');
//       return true;
//     }

//     const bootLog = {
//       type: "bootlog",
//       timestamp: this._getTimestamp(),
//       service: this._getServiceInfo(),
//       message: "開機"
//     };

//     // 記錄到控制台和本地
//     console.log('[BOOT]', bootLog);
//     this._storeLogLocally(bootLog);

//     // 發送到 API
//     const result = await this._sendToAPI(bootLog);
    
//     if (result) {
//       console.log('🚀 Boot Log 已記錄');
//       this.bootLogSent = true;
//     } else {
//       console.warn('🚀 Boot Log 記錄失敗');
//     }

//     return !!result;
//   }

//   /**
//    * 發送一般 Log
//    * @param {string} logLevel - Log 等級 (DEBUG, INFO, WARN, ERROR)
//    * @param {Object} userInfo - 用戶資訊 {userId, ipAddress}
//    * @param {string} executionTarget - 執行目標
//    * @param {string} executionContent - 執行內容
//    * @param {Object} executionResult - 執行結果 {status, statusCode, processedCount}
//    * @param {string} message - 訊息
//    */
//   async sendLog(logLevel, userInfo, executionTarget, executionContent, executionResult, message) {
//     const logData = {
//       type: "log",
//       timestamp: this._getTimestamp(),
//       eventId: this._generateEventId(),
//       logLevel: logLevel,
//       service: this._getServiceInfo(),
//       userInfo: {
//         ...userInfo,
//         ipAddress: userInfo.ipAddress || this.getClientIP() // 自動使用獲取到的 IP
//       },
//       executionTarget: executionTarget,
//       executionContent: executionContent,
//       executionResult: executionResult,
//       message: message
//     };

//     // 記錄到控制台和本地
//     console.log(`[LOG-${logLevel}]`, message, logData);
//     this._storeLogLocally(logData);

//     // 發送到 API
//     const result = await this._sendToAPI(logData);
    
//     if (result) {
//       console.log(`✅ Log 已記錄: ${logData.eventId}`);
//     } else {
//       console.warn(`⚠️ Log 記錄失敗: ${logData.eventId}`);
//     }

//     return !!result;
//   }

//   // ========== 自動化功能 ==========

//   /**
//    * 開始自動 Heartbeat
//    */
//   _startHeartbeat() {
//     if (this.isHeartbeatActive) {
//       return;
//     }

//     this.isHeartbeatActive = true;
//     console.log(`💓 開始 Heartbeat 服務 (間隔: ${this.heartbeatIntervalMs/1000}秒)`);

//     // 立即發送第一次
//     this.sendHeartbeat();

//     // 設置定時器
//     this.heartbeatInterval = setInterval(() => {
//       this.sendHeartbeat();
//     }, this.heartbeatIntervalMs);
//   }

//   /**
//    * 停止自動 Heartbeat
//    */
//   _stopHeartbeat() {
//     if (this.heartbeatInterval) {
//       clearInterval(this.heartbeatInterval);
//       this.heartbeatInterval = null;
//     }
//     this.isHeartbeatActive = false;
//     console.log('💓 Heartbeat 服務已停止');
//   }

//   // ========== 主要控制方法 ==========

//   /**
//    * 啟動 LogService
//    */
//   async start() {
//     if (this.isStarted) {
//       console.warn('LogService 已經啟動');
//       return;
//     }

//     console.log('🚀 啟動 LogService...');
    
//     // 發送 Boot Log
//     await this.sendBootLog();
    
//     // 開始 Heartbeat
//     this._startHeartbeat();
    
//     this.isStarted = true;
//     console.log('✅ LogService 已啟動');
//   }

//   /**
//    * 停止 LogService
//    */
//   stop() {
//     if (!this.isStarted) {
//       console.warn('LogService 尚未啟動');
//       return;
//     }

//     console.log('🛑 停止 LogService...');
    
//     // 停止 Heartbeat
//     this._stopHeartbeat();
    
//     this.isStarted = false;
//     console.log('✅ LogService 已停止');
//   }

//   // ========== 便利方法 (向後相容) ==========

//   /**
//    * 打卡成功日誌
//    */
//   async logCheckInSuccess(data) {
//     return await this.sendLog(
//       'INFO',
//       {
//         userId: data.employee_id || 'unknown',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'checkin_service',
//       'POST',
//       {
//         status: '成功',
//         statusCode: 200,
//         processedCount: 1
//       },
//       '上班打卡成功'
//     );
//   }

//   /**
//    * 打卡失敗日誌
//    */
//   async logCheckInFailure(data) {
//     return await this.sendLog(
//       'ERROR',
//       {
//         userId: data.employee_id || 'unknown',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'checkin_service',
//       'POST',
//       {
//         status: '失敗',
//         statusCode: 500,
//         processedCount: 0
//       },
//       `上班打卡失敗: ${data.error || '未知錯誤'}`
//     );
//   }

//   /**
//    * 下班打卡成功日誌
//    */
//   async logCheckOutSuccess(data) {
//     return await this.sendLog(
//       'INFO',
//       {
//         userId: data.employee_id || 'unknown',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'checkout_service',
//       'POST',
//       {
//         status: '成功',
//         statusCode: 200,
//         processedCount: 1
//       },
//       '下班打卡成功'
//     );
//   }

//   /**
//    * 下班打卡失敗日誌
//    */
//   async logCheckOutFailure(data) {
//     return await this.sendLog(
//       'ERROR',
//       {
//         userId: data.employee_id || 'unknown',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'checkout_service',
//       'POST',
//       {
//         status: '失敗',
//         statusCode: 500,
//         processedCount: 0
//       },
//       `下班打卡失敗: ${data.error || '未知錯誤'}`
//     );
//   }

//   /**
//    * 系統異常日誌
//    */
//   async logSystemError(data) {
//     return await this.sendLog(
//       'ERROR',
//       {
//         userId: data.employee_id || 'system',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'system',
//       'ERROR',
//       {
//         status: '失敗',
//         statusCode: 500,
//         processedCount: 0
//       },
//       `系統異常: ${data.error_message || '未知錯誤'}`
//     );
//   }

//   /**
//    * 用戶行為日誌
//    */
//   async logUserAction(data) {
//     return await this.sendLog(
//       'INFO',
//       {
//         userId: data.employee_id || 'unknown',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'user_service',
//       'POST',
//       {
//         status: '成功',
//         statusCode: 200,
//         processedCount: 1
//       },
//       `用戶行為: ${data.action || '未知行為'}`
//     );
//   }

//   /**
//    * 頁面載入日誌
//    */
//   async logPageLoad(data) {
//     return await this.sendLog(
//       'INFO',
//       {
//         userId: data.employee_id || 'unknown',
//         ipAddress: data.ip_address || this.getClientIP()
//       },
//       'page_service',
//       'GET',
//       {
//         status: '成功',
//         statusCode: 200,
//         processedCount: 1
//       },
//       `頁面載入: ${data.page || window.location.pathname}`
//     );
//   }

//   // ========== 輔助方法 ==========

//   /**
//    * 本地存儲日誌
//    */
//   _storeLogLocally(logData) {
//     try {
//       const localLogs = JSON.parse(localStorage.getItem('log_service_logs') || '[]');
//       localLogs.push({
//         ...logData,
//         stored_locally: true,
//         local_timestamp: new Date().toISOString(),
//         session_id: this._getSessionId()
//       });
      
//       // 只保留最近 100 條
//       if (localLogs.length > 100) {
//         localLogs.splice(0, localLogs.length - 100);
//       }
      
//       localStorage.setItem('log_service_logs', JSON.stringify(localLogs));
//     } catch (error) {
//       console.error('本地存儲日誌失敗:', error);
//     }
//   }

//   // ========== 管理方法 ==========

//   /**
//    * 獲取本地日誌
//    */
//   getLocalLogs() {
//     try {
//       return JSON.parse(localStorage.getItem('log_service_logs') || '[]');
//     } catch (error) {
//       console.error('讀取本地日誌失敗:', error);
//       return [];
//     }
//   }

//   /**
//    * 清除本地日誌
//    */
//   clearLocalLogs() {
//     try {
//       localStorage.removeItem('log_service_logs');
//       console.log('本地日誌已清除');
//     } catch (error) {
//       console.error('清除本地日誌失敗:', error);
//     }
//   }

//   /**
//    * 獲取服務狀態
//    */
//   getStatus() {
//     return {
//       serviceName: this.serviceName,
//       serviceVersion: this.serviceVersion,
//       isEnabled: this.isEnabled,
//       isStarted: this.isStarted,
//       elkApiEndpoint: this.elkApiEndpoint,
//       isLocalhost: this.isLocalhost,
//       isHTTPS: this.isHTTPS,
//       mixedContentWorkaround: this.mixedContentWorkaround,
//       heartbeatActive: this.isHeartbeatActive,
//       heartbeatInterval: this.heartbeatIntervalMs,
//       bootLogSent: this.bootLogSent,
//       sessionId: this._getSessionId(),
//       clientIP: this.clientIP
//     };
//   }

//   /**
//    * 測試 API 連接
//    */
//   async testConnection() {
//     console.log('🧪 測試 API 連接...');
//     const success = await this.sendLog(
//       'INFO',
//       { userId: 'test', ipAddress: this.getClientIP() },
//       'test_service',
//       'GET',
//       { status: '成功', statusCode: 200, processedCount: 1 },
//       'API 連接測試'
//     );
    
//     if (success) {
//       console.log('✅ API 連接測試成功');
//     } else {
//       console.error('❌ API 連接測試失敗');
//     }
    
//     return success;
//   }

//   /**
//    * 啟用/禁用服務
//    */
//   setEnabled(enabled) {
//     this.isEnabled = enabled;
//     console.log(`📡 LogService 已${enabled ? '啟用' : '禁用'}`);
//   }

//   /**
//    * 設置 API 端點
//    */
//   setApiEndpoint(endpoint) {
//     this.elkApiEndpoint = endpoint;
//     console.log(`📡 API 端點已設置為: ${endpoint}`);
//   }

//   /**
//    * 設置 Heartbeat 間隔
//    */
//   setHeartbeatInterval(intervalMs) {
//     this.heartbeatIntervalMs = intervalMs;
//     console.log(`💓 Heartbeat 間隔已設置為: ${intervalMs/1000}秒`);
    
//     // 如果正在運行，重新啟動
//     if (this.isHeartbeatActive) {
//       this._stopHeartbeat();
//       this._startHeartbeat();
//     }
//   }

//   /**
//    * 手動重新獲取 IP
//    */
//   async refreshIP() {
//     console.log('🔄 重新獲取 IP...');
//     try {
//       this.clientIP = await this.ipService.getClientIP();
//       console.log(`🌐 新的客戶端 IP: ${this.clientIP}`);
//       return this.clientIP;
//     } catch (error) {
//       console.warn('🌐 IP 重新獲取失敗:', error.message);
//       return this.clientIP;
//     }
//   }

//   // ========== 舊版相容方法 ==========

//   /**
//    * 舊版 safeLog 方法 (相容性)
//    */
//   async safeLog(logData) {
//     return await this.sendLog(
//       logData.level || 'INFO',
//       {
//         userId: logData.employee_id || 'unknown',
//         ipAddress: this.getClientIP()
//       },
//       logData.log_type || 'general_service',
//       'POST',
//       {
//         status: '成功',
//         statusCode: 200,
//         processedCount: 1
//       },
//       logData.message || '一般日誌'
//     );
//   }

//   /**
//    * 舊版 logBootStart 方法 (相容性)
//    */
//   async logBootStart(data) {
//     return await this.sendBootLog();
//   }

//   /**
//    * 舊版 startHeartbeat 方法 (相容性)
//    */
//   startHeartbeat(data) {
//     this._startHeartbeat();
//   }

//   /**
//    * 舊版 stopHeartbeat 方法 (相容性)
//    */
//   stopHeartbeat() {
//     this._stopHeartbeat();
//   }

//   /**
//    * 舊版 getHeartbeatStatus 方法 (相容性)
//    */
//   getHeartbeatStatus() {
//     return {
//       isActive: this.isHeartbeatActive,
//       interval: this.heartbeatIntervalMs,
//       sessionId: this._getSessionId(),
//       elkEnabled: this.isEnabled,
//       environment: this.isLocalhost ? 'localhost' : 'production'
//     };
//   }

//   /**
//    * 舊版 getServiceStatus 方法 (相容性)
//    */
//   getServiceStatus() {
//     return this.getStatus();
//   }

//   /**
//    * 舊版 setELKEnabled 方法 (相容性)
//    */
//   setELKEnabled(enabled) {
//     this.setEnabled(enabled);
//   }

//   /**
//    * 舊版 testELKConnection 方法 (相容性)
//    */
//   async testELKConnection() {
//     return await this.testConnection();
//   }
// }

// // 創建預設實例
// const logService = new LogService();

// // 在控制台中提供調試方法
// if (typeof window !== 'undefined') {
//   window.logService = logService;
//   console.log('💡 LogService 調試方法:');
//   console.log('  - window.logService.start() 啟動服務');
//   console.log('  - window.logService.stop() 停止服務');
//   console.log('  - window.logService.testConnection() 測試 API 連接');
//   console.log('  - window.logService.getStatus() 查看狀態');
//   console.log('  - window.logService.getLocalLogs() 查看本地日誌');
//   console.log('  - window.logService.clearLocalLogs() 清除本地日誌');
//   console.log('  - window.logService.setEnabled(true/false) 啟用/禁用服務');
//   console.log('  - window.logService.setApiEndpoint("url") 設置 API 端點');
//   console.log('  - window.logService.setHeartbeatInterval(30000) 設置心跳間隔');
//   console.log('  - window.logService.refreshIP() 重新獲取 IP');
//   console.log('  - window.logService.getClientIP() 查看當前 IP');
// }

// export default logService;
