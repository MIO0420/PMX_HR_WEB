import React, { useState, useEffect, useCallback, useRef } from 'react';
import './css/ReplenishApply.css';
import { 
  validateUserFromCookies,
  getCurrentDateTimeInfo,
  formatDateForApi,
  generateFormNumber,
  fetchEmployeeInfoFunction,
  submitReplenishForm,
  handleGoHomeFunction
} from './function/function'; // 引入共用函數
import homeIcon from '../Google_sheet/HomePageImage/homepage.png'; // 引入首頁圖標
import CalendarSelector from './Time Selector/Calendar Selector'; // 引入日期選擇器組件
import TimeSelector from './Time Selector/Time Selector'; // 引入時間選擇器組件

function ReplenishApply() {
  // 獲取當前日期時間信息
  const currentDateTimeInfo = getCurrentDateTimeInfo();

  const [currentTime, setCurrentTime] = useState('--:--');
  const [selectedCardType, setSelectedCardType] = useState('上班');
  const [reason, setReason] = useState('出差');
  const [illustrate, setIllustrate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState('');
  const [error, setError] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null); // 存儲員工資料
  const [companyId, setCompanyId] = useState(""); // 公司ID
  const [employeeId, setEmployeeId] = useState(""); // 員工ID
  const [authToken, setAuthToken] = useState(''); // 認證令牌
  const authInProgress = useRef(false); // 使用 ref 追蹤認證進度
  const formSubmitInProgress = useRef(false); // 使用 ref 追蹤表單提交進度

  // 日期和時間的狀態 - 初始化為當前日期和時間
  const [replenishDate, setReplenishDate] = useState(currentDateTimeInfo.formattedDate);
  const [originalTime, setOriginalTime] = useState(currentDateTimeInfo.formattedTime);
  const [modifiedTime, setModifiedTime] = useState(currentDateTimeInfo.formattedTime);

  // 日期和時間選擇器狀態
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showReasonOptions, setShowReasonOptions] = useState(false);
  const [isEditingOriginal, setIsEditingOriginal] = useState(true); // 標記是否編輯原始時間
  const [selectedWeekday, setSelectedWeekday] = useState(currentDateTimeInfo.weekday); // 星期幾

  // 🆕 添加自動填入相關狀態
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // 補卡事由選項
  const reasonOptions = [
    { name: '出差', category: '補卡事由' },
    { name: '忘記打卡', category: '補卡事由' },
    { name: '忙私人的事', category: '補卡事由' },
    { name: '其他', category: '補卡事由' }
  ];

  // 將 cookie 工具函數移到 useRef 中，避免重新創建
  const cookieUtils = useRef({
    get: (name) => {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        if (key && value) {
          acc[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        return acc;
      }, {});
      return cookies[name];
    },
    
    set: (name, value, expirationHours = 3) => {
      const date = new Date();
      date.setTime(date.getTime() + (expirationHours * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};${expires};path=/`;
      console.log(`已設置 cookie: ${name}=${value}, 有效期 ${expirationHours} 小時`);
    },
    
    remove: (name) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }).current;

  // 使用共用函數驗證用戶
  useEffect(() => {
    validateUserFromCookies(
      setLoading,
      setAuthToken,
      setCompanyId,
      setEmployeeId
    );
  }, []);

  // 🆕 處理異常資料自動填入
  useEffect(() => {
    // 檢查是否有異常資料傳入
    const abnormalDataString = sessionStorage.getItem('abnormalReplenishData');
    
    if (abnormalDataString) {
      try {
        const abnormalData = JSON.parse(abnormalDataString);
        console.log('接收到異常資料:', abnormalData);
        
        // 驗證資料是否有效且新鮮（5分鐘內）
        const isDataFresh = abnormalData.timestamp && 
          (Date.now() - abnormalData.timestamp) < 5 * 60 * 1000;
        
        if (abnormalData.fromAbnormal && isDataFresh) {
          console.log('開始自動填入異常資料...');
          
          // 1. 設定補卡類型
          if (abnormalData.type) {
            setSelectedCardType(abnormalData.type);
            console.log(`設定補卡類型: ${abnormalData.type}`);
          }
          
          // 2. 設定日期
          if (abnormalData.date) {
            const dateObj = new Date(abnormalData.date);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            
            // 使用傳入的星期幾資訊，或重新計算
            const weekday = abnormalData.dayOfWeek || (() => {
              const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
              return weekdays[dateObj.getDay()];
            })();
            
            const formattedDate = `${year}年 ${month}月${day}日 ${weekday}`;
            setReplenishDate(formattedDate);
            setSelectedWeekday(weekday);
            console.log(`設定補卡日期: ${formattedDate}`);
          }
          
          // 3. 設定已打卡時間（這是關鍵！）
          if (abnormalData.originalTime && abnormalData.originalTime !== '--:--') {
            setOriginalTime(abnormalData.originalTime);
            console.log(`設定已打卡時間: ${abnormalData.originalTime}`);
          } else {
            // 如果沒有打卡時間，設定為當前時間
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            setOriginalTime(currentTime);
            console.log(`設定預設已打卡時間: ${currentTime}`);
          }
          
          // 4. 設定改打卡時間（建議時間）
          if (abnormalData.originalTime && abnormalData.originalTime !== '--:--') {
            // 如果是上班遲到，建議改為正常上班時間（例如 09:00）
            if (abnormalData.type === '上班' && abnormalData.abnormalReason === '遲到') {
              setModifiedTime('09:00');
            }
            // 如果是下班早退，建議改為正常下班時間（例如 18:00）
            else if (abnormalData.type === '下班' && abnormalData.abnormalReason === '早退') {
              setModifiedTime('18:00');
            }
            // 其他情況，使用原始時間作為建議
            else {
              setModifiedTime(abnormalData.originalTime);
            }
          }
          
          // 5. 根據異常原因設定補卡事由
          const reasonMapping = {
            '遲到': '忘記打卡',
            '早退': '忙私人的事',
            '滯留': '其他',
            '延滯': '其他',
            '曠職': '忘記打卡',
            '過早': '其他'
          };
          
          const mappedReason = reasonMapping[abnormalData.abnormalReason] || '其他';
          setReason(mappedReason);
          console.log(`設定補卡事由: ${mappedReason} (根據異常原因: ${abnormalData.abnormalReason})`);
          
          // 6. 自動生成補卡說明
          const generateIllustrate = () => {
            const dateStr = abnormalData.date;
            const timeStr = abnormalData.originalTime;
            const typeStr = abnormalData.type;
            const reasonStr = abnormalData.abnormalReason;
            
            let autoText = '';
            
            if (reasonStr === '遲到') {
              autoText = `${dateStr} ${typeStr}打卡時間為 ${timeStr}，因交通延誤導致遲到，申請補打卡修正為正常上班時間。`;
            } else if (reasonStr === '早退') {
              autoText = `${dateStr} ${typeStr}打卡時間為 ${timeStr}，因私人事務需要提早離開，申請補打卡說明。`;
            } else if (reasonStr === '滯留' || reasonStr === '延滯') {
              autoText = `${dateStr} ${typeStr}打卡時間為 ${timeStr}，因工作需要延長工作時間，申請補打卡說明。`;
            } else if (reasonStr === '曠職') {
              autoText = `${dateStr} 當日忘記${typeStr}打卡，申請補打卡記錄。`;
            } else {
              autoText = `${dateStr} ${typeStr}打卡時間異常（${reasonStr}），申請補打卡修正。`;
            }
            
            return autoText;
          };
          
          const autoIllustrate = generateIllustrate();
          setIllustrate(autoIllustrate);
          console.log(`設定補卡說明: ${autoIllustrate}`);
          
          // 7. 顯示自動填入提示
          setIsAutoFilled(true);
          setTimeout(() => {
            setIsAutoFilled(false);
          }, 4000); // 4秒後隱藏提示
          
          console.log('異常資料自動填入完成！');
        } else {
          console.log('異常資料無效或已過期，清除資料');
        }
        
        // 清除 sessionStorage 中的異常資料，避免重複使用
        sessionStorage.removeItem('abnormalReplenishData');
        
      } catch (error) {
        console.error('解析異常資料失敗:', error);
        // 清除無效資料
        sessionStorage.removeItem('abnormalReplenishData');
      }
    }
  }, []); // 只在組件初始化時執行一次

  // 生成本地表單ID - 不再依賴API
  useEffect(() => {
    if (!companyId || formId) return; // 如果已經有 formId 或沒有 companyId，則不執行
    
    try {
      // 直接生成本地表單ID
      const localFormId = `FORM-${companyId}-${Date.now()}`;
      setFormId(localFormId);
      console.log(`已生成本地表單ID: ${localFormId}`);
    } catch (err) {
      console.error('生成表單ID時發生錯誤:', err);
      setError('生成表單ID時發生錯誤');
    }
  }, [companyId, formId]);

  // 查詢員工基本資料 - 使用從 function.js 引入的函數
  const fetchEmployeeInfo = useCallback(async () => {
    await fetchEmployeeInfoFunction(
      companyId, 
      employeeId, 
      authToken, 
      setLoading, 
      setEmployeeInfo, 
      setError, 
      cookieUtils,
      authInProgress
    );
  }, [companyId, employeeId, authToken, cookieUtils]);

  // 當認證資訊更新後，獲取員工資料
  useEffect(() => {
    if (companyId && employeeId && authToken) {
      fetchEmployeeInfo();
    }
  }, [companyId, employeeId, authToken, fetchEmployeeInfo]);

  // 處理日期點擊
  const handleDateClick = () => {
    setShowDatePicker(true);
  };
  
  // 處理時間點擊
  const handleTimeClick = (isOriginal) => {
    setIsEditingOriginal(isOriginal);
    setShowTimePicker(true);
  };
  
  // 處理日期選擇 - 修改版本，實現自動流程
  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[date.getDay()];
    
    setReplenishDate(`${year}年 ${month}月${day}日 ${weekday}`);
    setSelectedWeekday(weekday);
    setShowDatePicker(false);
    
    // 選擇完日期後自動開啟原始時間選擇
    setTimeout(() => {
      setIsEditingOriginal(true); // 設置為編輯原始時間
      setShowTimePicker(true);
    }, 300);
  };
  
  // 處理時間選擇 - 修改版本，實現自動流程
  const handleTimeSelect = (hour, minute) => {
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    if (isEditingOriginal) {
      // 選擇原始時間
      setOriginalTime(formattedTime);
      setShowTimePicker(false);
      
      // 自動開啟修改時間選擇
      setTimeout(() => {
        setIsEditingOriginal(false); // 切換到編輯修改時間
        setShowTimePicker(true);
      }, 300);
      
    } else {
      // 選擇修改時間
      setModifiedTime(formattedTime);
      setShowTimePicker(false);
      
      // 完成所有選擇，重置狀態
      setIsEditingOriginal(true); // 重置為編輯原始時間狀態，以備下次使用
    }
  };

  // 處理表單提交 - 使用從 function.js 引入的函數
  const handleSubmit = async () => {
    const result = await submitReplenishForm({
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
    });
    
    if (result && result.success) {
      window.location.href = '/replenish01';
    }
  };
  
  // 處理返回首頁 - 使用從 function.js 引入的函數
  const handleGoHome = () => {
    handleGoHomeFunction();
  };
  
  const handleCancel = () => {
    console.log('取消補卡申請');
    window.location.href = '/replenish01';
  };
  
  const handleCardTypeChange = (type) => {
    setSelectedCardType(type);
  };
  
  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason.name);
    setShowReasonOptions(false);
  };
  
  const handleIllustrateChange = (e) => {
    setIllustrate(e.target.value);
  };

  // 添加全局樣式以防止滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  // 添加錯誤處理組件
  const ErrorMessage = ({ message, onClose }) => {
    return (
      <div className="replenish-apply-error-container">
        <div className="replenish-apply-error-message">
          <div className="replenish-apply-error-icon">⚠️</div>
          <div className="replenish-apply-error-text">{message}</div>
          <button className="replenish-apply-error-close" onClick={onClose}>✕</button>
        </div>
      </div>
    );
  };

  return (
    <div className="replenish-apply-container">
      <div className="replenish-apply-wrapper">


        <header className="replenish-apply-header">
          <div className="replenish-apply-home-icon" onClick={handleGoHome}>
            <img src={homeIcon} alt="首頁" width="20" height="20" />
          </div>
          <div className="replenish-apply-page-title">補卡申請</div>
        </header>
        
        {/* 顯示錯誤訊息 */}
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        <div className="replenish-apply-form-container">
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">類型</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-card-type-container">
                <button 
                  className={`replenish-apply-card-type-button ${selectedCardType === '上班' ? 'replenish-apply-card-type-button-active' : ''}`}
                  onClick={() => handleCardTypeChange('上班')}
                >
                  上班
                </button>
                <button 
                  className={`replenish-apply-card-type-button ${selectedCardType === '下班' ? 'replenish-apply-card-type-button-active' : ''}`}
                  onClick={() => handleCardTypeChange('下班')}
                >
                  下班
                </button>
                </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">事由</div>
            <div className="replenish-apply-form-value">
              <div 
                className="replenish-apply-reason-selector" 
                onClick={() => setShowReasonOptions(true)}
              >
                <div className="replenish-apply-reason-name">{reason}</div>
                <div className="replenish-apply-dropdown-icon">▼</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">日期</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-date-time-row">
                <div className="replenish-apply-date-time" onClick={handleDateClick}>{replenishDate}</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">已打卡時間</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-date-time-row">
                <div className="replenish-apply-time-input" onClick={() => handleTimeClick(true)}>{originalTime}</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-form-row">
            <div className="replenish-apply-form-label">改打卡時間</div>
            <div className="replenish-apply-form-value">
              <div className="replenish-apply-date-time-row">
                <div className="replenish-apply-time-input" onClick={() => handleTimeClick(false)}>{modifiedTime}</div>
              </div>
            </div>
          </div>
          
          <div className="replenish-apply-description-container">
            <div className="replenish-apply-description-label">補卡說明</div>
            <textarea
              className="replenish-apply-description-textarea"
              placeholder="請詳細說明補卡原因..."
              value={illustrate}
              onChange={handleIllustrateChange}
            ></textarea>
          </div>
        </div>
        
        <div className="replenish-apply-button-container">
          <button 
            className="replenish-apply-cancel-button"
            onClick={handleCancel}
            disabled={loading || formSubmitInProgress.current}
          >
            取消
          </button>
          <button 
            className={`replenish-apply-submit-button ${loading || formSubmitInProgress.current ? 'replenish-apply-button-loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading || formSubmitInProgress.current}
          >
            {loading || formSubmitInProgress.current ? '送出中...' : '送出'}
          </button>
        </div>
        
        {/* 事由選項列表 */}
        {showReasonOptions && (
          <>
            <div className="replenish-apply-overlay" onClick={() => setShowReasonOptions(false)}></div>
            <div className="replenish-apply-reason-options-container">
              <div className="replenish-apply-reason-category">補卡事由</div>
              {reasonOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="replenish-apply-reason-option"
                  onClick={() => handleReasonSelect(option)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* 使用引入的日期選擇器組件 */}
        <CalendarSelector
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDateSelect}
          isEditingStart={true} // 補卡申請只有一個日期
        />
        
        {/* 使用引入的時間選擇器組件 */}
        <TimeSelector
          isVisible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onTimeSelect={handleTimeSelect}
          currentTime={isEditingOriginal ? originalTime : modifiedTime}
          isEditingStart={isEditingOriginal}
        />
        
        {/* 載入中指示器 */}
        {loading && (
          <div className="replenish-apply-loading-overlay">
            <div className="replenish-apply-loading-spinner"></div>
            <div className="replenish-apply-loading-text">處理中，請稍候...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReplenishApply;
