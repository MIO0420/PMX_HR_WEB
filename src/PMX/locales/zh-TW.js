
// const zhTW = {
//   // 通用
//   common: {
//     loading: '載入中...',
//     error: '錯誤',
//     success: '成功',
//     confirm: '確認',
//     cancel: '取消',
//     save: '儲存',
//     back: '返回',
//     next: '下一步',
//     submit: '提交',
//     close: '關閉',
//     processing: '處理中...',
//     noRecord: '無記錄'
//   },

//   // 登入頁面
//   login: {
//     title: '員工登入',
//     companyId: '公司統編',
//     employeeId: '員工編號',
//     password: '密碼',
//     companyIdPlaceholder: '請輸入公司統編',
//     employeeIdPlaceholder: '請輸入帳號',
//     passwordPlaceholder: '請輸入密碼',
//     newPassword: '新密碼',
//     confirmPassword: '確認新密碼',
//     loginButton: '登入',
//     loggingIn: '登入中...',
//     processing: '處理中，請稍候...',
//     initializing: '初始化中，請稍候...',
//     rememberMe: '記住我',
//     forgotPassword: '忘記密碼',
//     changePassword: '變更密碼',
//     congratsMessage: '恭喜加入新公司，請更改密碼後再登入',
//     updatePasswordAndLogin: '更新密碼並登入',
//     backToLogin: '返回登入',
//     passwordChangeRequired: '需要變更密碼',
//     loginSuccess: '登入成功',
//     loginFailed: '登入失敗',
//     loginError: '統編或帳號或密碼錯誤，請重新輸入',
//     autoLoginFailed: '自動登入失敗：缺少公司統編或員工編號',
//     invalidCredentials: '帳號或密碼錯誤',
//     passwordMismatch: '密碼不一致',
//     passwordTooShort: '密碼長度至少6位',
//     missingFields: '請填寫所有必填欄位'
//   },

//   // 首頁
//   home: {
//     title: '首頁',
//     welcome: '歡迎',
//     noCompany: '未設定公司',
//     noDepartment: '無部門資訊',
//     noPosition: '無職稱資訊',
//     notLoggedIn: '未登入',
//     noEmployeeId: 'N/A',
//     functions: {
//       punch: '打卡',
//       makeup: '補卡',
//       overtime: '加班',
//       leave: '請假',
//       salary: '薪資',
//       approval: '簽核系統',
//       schedule: '排班',
//       announcement: '公告',
//       message: '訊息'
//     },
//     noPermission: '您沒有權限使用此功能'
//   },

//   // 打卡頁面
//   checkin: {
//     title: '打卡系統',
//     home: '首頁',
//     clockIn: '上班',
//     clockOut: '下班',
//     clockInTime: '上班打卡時間',
//     clockOutTime: '下班打卡時間',
//     currentTime: '目前時間',
//     status: '打卡狀態',
//     notPunched: '未打卡',
//     clockedIn: '已上班',
//     clockedOut: '已下班',
//     location: '位置資訊',
//     network: '網路資訊',
//     workDuration: '工作時數',
//     queryAttendance: '查詢出勤狀況',
//     processing: '處理中...',
//     clockInFirst: '請先進行上班打卡',
//     clockInSuccess: '上班打卡成功',
//     clockOutSuccess: '下班打卡成功',
//     clockInFailed: '上班打卡失敗',
//     clockOutFailed: '下班打卡失敗',
//     locationError: '無法獲取位置資訊，請確保已開啟位置權限',
//     networkError: '網路連線錯誤',
//     lateMinutes: '您已遲到 {minutes} 分鐘',
//     earlyLeaveMinutes: '您已早退 {minutes} 分鐘',
//     overtimeMinutes: '您已加班 {minutes} 分鐘',
//     nonCompanyNetwork: '使用非公司網路打卡',
//     weekdays: {
//       sunday: '星期日',
//       monday: '星期一',
//       tuesday: '星期二',
//       wednesday: '星期三',
//       thursday: '星期四',
//       friday: '星期五',
//       saturday: '星期六'
//     },
//     tags: {
//       ontime: '準時',
//       late: '遲到',
//       early: '早退',
//       overtime: '加班',
//       stay: '滯留'
//     }
//   },

//   // 錯誤訊息
//   errors: {
//     networkError: '網路連線錯誤',
//     serverError: '伺服器錯誤',
//     unauthorized: '未授權訪問',
//     tokenExpired: 'Token 已失效，需要重新登入',
//     dataLoadFailed: '資料讀取失敗',
//     locationPermissionDenied: '位置權限被拒絕',
//     locationUnavailable: '位置資訊不可用',
//     locationTimeout: '獲取位置逾時',
//     requestFailed: '請求失敗',
//     queryFailed: '查詢失敗'
//   },

//   attendance: {
//     title: '查詢出勤紀錄',
//     home: '首頁',
    
//     // 篩選器
//     filters: {
//       attendanceStatus: '出勤狀況',
//       punchResult: '打卡結果',
//       time: '時間',
//       unlimited: '不限',
//       normal: '正常',
//       abnormal: '異常',
//       lastMonth: '上月',
//       thisMonth: '本月'
//     },
    
//     // 狀態選項
//     statusOptions: {
//       unlimited: '不限',
//       onTime: '準時',
//       leave: '請假',
//       late: '遲到',
//       earlyLeave: '早退',
//       absent: '曠職'
//     },
    
//     // 表格標題
//     table: {
//       date: '日期',
//       clockInTime: '上班打卡時間',
//       clockOutTime: '下班打卡時間'
//     },
    
//     // 狀態標籤
//     statusTags: {
//       onTime: '準時',
//       late: '遲到',
//       earlyLeave: '早退',
//       absent: '曠職',
//       leave: '請假',
//       abnormal: '異常'
//     },
    
//     // 訊息
//     messages: {
//       loading: '載入中...',
//       processing: '處理中，請稍候...',
//       noRecords: '無出勤紀錄',
//       noMatchingRecords: '無符合條件的出勤紀錄',
//       noRecordsThisMonth: '本月無出勤記錄',
//       retry: '重新嘗試連接',
//       dataLoadFailed: '資料讀取失敗',
//       employeeNotFound: '找不到員工資料，請重新登入',
//       fetchFailed: '獲取出勤記錄失敗'
//     },
    
//     // 錯誤處理
//     errors: {
//       networkError: '網路錯誤，請稍後再試',
//       unauthorized: '缺少必要的登入資訊',
//       dataProcessingError: '資料處理錯誤'
//     },
    
//     // 選擇器
//     picker: {
//       attendanceStatus: '出勤狀態',
//       close: '關閉'
//     }
//   },

//   // 補卡申請
//   replenishApply: {
//     title: '補卡申請',
//     type: '類型',
//     reason: '事由',
//     date: '日期',
//     originalTime: '原始時間',
//     modifiedTime: '修改時間',
//     description: '補卡說明',
//     descriptionPlaceholder: '請詳細說明補卡原因...',
//     clockIn: '上班',
//     clockOut: '下班',
//     businessTrip: '出差',
//     forgotToClock: '忘記打卡',
//     personalBusiness: '忙私人的事',
//     other: '其他',
//     reasonCategory: '補卡事由',
//     cancel: '取消',
//     submit: '送出',
//     submitting: '送出中...',
//     processingPleaseWait: '處理中，請稍候...'
//   },

//   // 補卡頁面
//   replenish: {
//     title: '補打卡',
//     overview: '總覽',
//     statusPending: '簽核中',
//     statusApproved: '已通過',
//     statusRejected: '未通過',
//     statusPendingHR: '待HR審核',
//     loadingData: '正在獲取補卡申請數據',
//     errorOccurred: '發生錯誤',
//     tryAgainLater: '請稍後再試或聯繫系統管理員',
//     noRequests: '目前無申請單',
//     noPendingRequests: '目前無簽核中的申請單',
//     noApprovedRequests: '目前無已通過的申請單',
//     noRejectedRequests: '目前無未通過的申請單',
//     submitTime: '送出時間',
//     replenishType: '補卡類型',
//     replenishReason: '補卡原因',
//     replenishTime: '補卡時間',
//     newRequest: '新增補卡申請',
//     modalTitle: '補卡申請單',
//     formNumber: '單號',
//     employee: '員工',
//     status: '狀態',
//     replenishDescription: '補卡原因',
//     cancel: '撤銷',
//     cancelRequestMessage: '已撤銷申請 {id}',
//     businessTrip: '出差',
//     forgotPunch: '忘記打卡',
//     personalMatter: '忙私人的事',
//     other: '其他',
//     notFilled: '未填寫',
//     replenishDate: '補卡日期',
//     department: '部門',
//     position: '職位',
//     reviewer: '審核者',
//     detailDescription: '詳細說明',
//     networkError: '網路連線錯誤或 CORS 問題，請聯繫系統管理員',
//     corsError: '跨域請求錯誤，請聯繫系統管理員設定 CORS',
//     apiNotFoundError: 'API 端點不存在，請聯繫系統管理員',
//     requestFailed: '請求失敗'
//   },

//   // 請假頁面
//   leave: {
//     title: '請假',
//     leaveTypes: '假別',
//     approvalProgress: '審核進度',
//     overview: '總覽',
//     statusPending: '簽核中',
//     statusApproved: '已通過',
//     statusRejected: '未通過',
//     statusPendingHR: '待HR審核',
//     remaining: '剩餘',
//     days: '天',
//     hours: '小時',
//     minutes: '分鐘',
//     zeroDaysHours: '0天0小時',
//     zeroHours: '0小時',
    
//     // 假別類型
//     legalLeaveTypes: '法定假別',
//     companyBenefitLeaveTypes: '公司福利假別',
//     familyCareLeave: '家庭照顧假',
//     workInjurySickLeave: '公傷病假',
//     paternityCheckupLeave: '陪產(檢)假',
//     bedRestLeave: '安胎假',
//     parentalLeave: '育嬰假',
//     bereavementLeave: '喪假',
    
//     // 假別縮寫
//     typeShort: {
//       compensatory: '換',
//       annual: '特',
//       personal: '事',
//       sick: '病',
//       menstrual: '理',
//       makeup: '補',
//       official: '公',
//       marriage: '婚',
//       prenatalCheckup: '檢',
//       maternity: '產',
//       paternity: '陪',
//       study: '書',
//       birthday: '生日',
//       unspecified: '未'
//     },
    
//     // 狀態和訊息
//     loadingData: '正在獲取請假申請數據',
//     errorOccurred: '發生錯誤',
//     tryAgainLater: '請稍後再試或聯繫系統管理員',
//     noRequests: '目前無申請單',
//     noCurrent: '目前無',
//     requests: '的申請單',
//     newRequest: '新增請假申請',
    
//     // 申請單詳情
//     submitTime: '送出時間',
//     leaveType: '請假類型',
//     timeRange: '時間起迄',
//     leaveDuration: '請假時數',
//     modalTitle: '請假申請單',
//     formNumber: '單號',
//     employee: '員工',
//     status: '狀態',
//     leaveTimeRange: '請假時間起迄',
//     totalHours: '總時數',
//     leaveDescription: '請假說明',
//     attachment: '附件',
//     approver: '核准人',
//     cancel: '撤銷',
    
//     // 其他
//     unspecified: '未指定',
//     noReason: '未填寫',
//     cannotCancelNoId: '無法撤銷請假：找不到請假單號',
//     canceling: '正在撤銷請假...',
//     cancelSuccess: '已成功取消請假申請',
//     cancelFailed: '撤銷請假失敗'
//   },

//   // 請假申請頁面
//   apply: {
//     title: '請假申請',
//     leaveType: '假別',
//     startDate: '自',
//     endDate: '到',
//     duration: '時數',
//     description: '說明',
//     descriptionPlaceholder: '請輸入請假原因...',
//     addAttachment: '新增附件',
//     remaining: '剩餘',
    
//     // 時間單位
//     year: '年',
//     month: '月',
//     day: '日',
//     days: '天',
//     hours: '小時',
//     minutes: '分鐘',
    
//     // 星期
//     weekdays: {
//       sunday: '週日',
//       monday: '週一',
//       tuesday: '週二',
//       wednesday: '週三',
//       thursday: '週四',
//       friday: '週五',
//       saturday: '週六'
//     },
    
//     // 假別類型
//     legalLeaveTypes: '法定假別',
//     companyBenefitLeaveTypes: '公司福利假別',
    
//     // 假別類型翻譯 - 這是關鍵的部分
//     leaveTypes: {
//       compensatory: '換休',
//       annual: '特休',
//       personal: '事假',
//       sick: '病假',
//       menstrual: '生理假',
//       makeup: '補休',
//       official: '公假',
//       marriage: '婚假',
//       prenatalCheckup: '產檢假',
//       maternity: '產假',
//       paternity: '陪產假',
//       study: '溫書假',
//       birthday: '生日假'
//     },
    
//     // 訊息
//     success: '請假申請已送出',
//     failed: '請假申請失敗',
//     missingReason: '請填寫請假說明',
//     invalidDuration: '請假時間必須大於0',
//     attachmentNotAvailable: '附件功能尚未開放，請在說明欄位中描述相關資訊',
//     loginRequired: '請先登入系統',
//     employeeDataIncomplete: '無法獲取員工資料，請重新登入',
//     employeeDataQueryFailed: '員工資料查詢失敗',
//     employeeDataQueryError: '查詢員工資料時發生錯誤',
//     fetchLunchBreakFailed: '獲取中午休息時間失敗',
//     submitTimeout: '提交請求超時，請稍後再試',
//     requestProcessingError: '處理請求時發生錯誤',
//     allApiFailed: '所有API都提交失敗'
//   },

//   // 人事資料
//   personalData: {
//     title: '人事資料',
//     basicInfo: '基本資料',
//     workInfo: '職務相關',
//     contactInfo: '聯絡資料',
//     accountInfo: '系統設定',
//     edit: '修改',
//     save: '儲存',
//     cancel: '取消',
//     submit: '送出',
    
//     // 基本資料欄位
//     name: '姓名',
//     birthDate: '出生日期',
//     gender: '生理性別',
//     idNumber: '身分證字號',
//     photo: '照片',
    
//     // 聯絡資料欄位
//     residenceAddress: '戶籍地址',
//     mailingAddress: '通訊地址',
//     mobile: '手機',
//     phone: '市話',
    
//     // 工作資料欄位
//     shiftSystem: '排班制度',
//     identity: '身分別',
//     salaryType: '薪別',
//     department: '部門',
//     jobTitle: '職稱',
//     jobLevel: '職等',
//     trainingControlDate: '受訓後管制',
//     pensionContribution: '勞退金-自提',
//     dependentsInsured: '眷屬投保',
    
//     // 帳號資料欄位
//     account: '帳號',
//     password: '密碼',
//     resetPassword: '重設密碼',
    
//     // 性別選項
//     genderOptions: {
//       male: '男',
//       female: '女',
//       nonBinary: '非二元性別'
//     },
    
//     // 退休金和健保
//     pensionSelfContribution: '退休金勞工自提',
//     healthInsurance: '健保',
//     healthInsuranceDependents: '健保-眷屬加保',
//     addNew: '新增',
//     relation: '稱謂',
    
//     // 編輯相關
//     editBasicInfo: '編輯基本資料',
    
//     // 訊息
//     updateSuccess: '資料更新成功！',
//     updateFailed: '更新資料失敗，請稍後再試',
//     loading: '載入中...',
//     pleaseLogin: '請先登入以查看個人資料',
//     networkError: '網路連線錯誤',
//     loadFailed: '載入失敗',
//     reload: '重新載入',
//     fetchDataFailed: '查詢員工資料失敗',
//     resetPasswordInDevelopment: '密碼重設功能開發中...',
    
//     // 驗證訊息
//     mobileValidation: '手機號碼必須為09開頭，後面跟著8個數字'
//   }
// };

// export default zhTW;
const zhTW = {
  // 通用
  common: {
    loading: '載入中...',
    error: '錯誤',
    success: '成功',
    confirm: '確認',
    cancel: '取消',
    save: '儲存',
    back: '返回',
    next: '下一步',
    submit: '提交',
    close: '關閉',
    processing: '處理中...',
    noRecord: '無記錄'
  },

  // 登入頁面
  login: {
    title: '員工登入',
    companyId: '公司統編',
    employeeId: '員工編號',
    password: '密碼',
    companyIdPlaceholder: '請輸入公司統編',
    employeeIdPlaceholder: '請輸入帳號',
    passwordPlaceholder: '請輸入密碼',
    newPassword: '新密碼',
    confirmPassword: '確認新密碼',
    loginButton: '登入',
    loggingIn: '登入中...',
    processing: '處理中，請稍候...',
    initializing: '初始化中，請稍候...',
    rememberMe: '記住我',
    forgotPassword: '忘記密碼',
    changePassword: '變更密碼',
    congratsMessage: '恭喜加入新公司，請更改密碼後再登入',
    updatePasswordAndLogin: '更新密碼並登入',
    backToLogin: '返回登入',
    passwordChangeRequired: '需要變更密碼',
    loginSuccess: '登入成功',
    loginFailed: '登入失敗',
    loginError: '統編或帳號或密碼錯誤，請重新輸入',
    autoLoginFailed: '自動登入失敗：缺少公司統編或員工編號',
    invalidCredentials: '帳號或密碼錯誤',
    passwordMismatch: '密碼不一致',
    passwordTooShort: '密碼長度至少6位',
    missingFields: '請填寫所有必填欄位'
  },

  // 首頁
  home: {
    title: '首頁',
    welcome: '歡迎',
    noCompany: '未設定公司',
    noDepartment: '無部門資訊',
    noPosition: '無職稱資訊',
    notLoggedIn: '未登入',
    noEmployeeId: 'N/A',
    functions: {
      punch: '打卡',
      makeup: '補卡',
      overtime: '加班',
      leave: '請假',
      salary: '薪資',
      approval: '簽核系統',
      schedule: '排班',
      announcement: '公告',
      message: '訊息'
    },
    noPermission: '您沒有權限使用此功能'
  },

  // 打卡頁面
  checkin: {
    title: '打卡系統',
    home: '首頁',
    clockIn: '上班',
    clockOut: '下班',
    clockInTime: '上班打卡時間',
    clockOutTime: '下班打卡時間',
    currentTime: '目前時間',
    status: '打卡狀態',
    notPunched: '未打卡',
    clockedIn: '已上班',
    clockedOut: '已下班',
    location: '位置資訊',
    network: '網路資訊',
    workDuration: '工作時數',
    queryAttendance: '查詢出勤狀況',
    processing: '處理中...',
    clockInFirst: '請先進行上班打卡',
    clockInSuccess: '上班打卡成功',
    clockOutSuccess: '下班打卡成功',
    clockInFailed: '上班打卡失敗',
    clockOutFailed: '下班打卡失敗',
    locationError: '無法獲取位置資訊，請確保已開啟位置權限',
    networkError: '網路連線錯誤',
    lateMinutes: '您已遲到 {minutes} 分鐘',
    earlyLeaveMinutes: '您已早退 {minutes} 分鐘',
    overtimeMinutes: '您已加班 {minutes} 分鐘',
    nonCompanyNetwork: '使用非公司網路打卡',
    
    // 上班打卡狀態
    checkinStatus: {
      too_early: '打卡時間過早',
      early: '準時',
      on_time: '準時',
      late: '遲到'
    },
    
    // 下班打卡狀態
    checkoutStatus: {
      early_leave: '早退',
      on_time: '準時',
      stay_late: '滯留',
      over_time: '加班'
    },
    
    // 狀態說明
    statusDescriptions: {
      too_early: '在允許打卡時間之前打卡',
      early: '提早到但在允許範圍內',
      on_time: '準時上班',
      late: '超過遲到容許時間',
      early_leave: '提早下班',
      stay_late: '超過下班時間但未達加班標準',
      over_time: '達到加班時間標準'
    },
    
    weekdays: {
      sunday: '星期日',
      monday: '星期一',
      tuesday: '星期二',
      wednesday: '星期三',
      thursday: '星期四',
      friday: '星期五',
      saturday: '星期六'
    },
    tags: {
      ontime: '準時',
      late: '遲到',
      early: '早退',
      overtime: '加班',
      stay: '滯留'
    }
  },

  // 錯誤訊息
  errors: {
    networkError: '網路連線錯誤',
    serverError: '伺服器錯誤',
    unauthorized: '未授權訪問',
    tokenExpired: 'Token 已失效，需要重新登入',
    dataLoadFailed: '資料讀取失敗',
    locationPermissionDenied: '位置權限被拒絕',
    locationUnavailable: '位置資訊不可用',
    locationTimeout: '獲取位置逾時',
    requestFailed: '請求失敗',
    queryFailed: '查詢失敗'
  },

  attendance: {
    title: '查詢出勤紀錄',
    home: '首頁',
    
    // 篩選器
    filters: {
      attendanceStatus: '出勤狀況',
      punchResult: '打卡結果',
      time: '時間',
      unlimited: '不限',
      normal: '正常',
      abnormal: '異常',
      lastMonth: '上月',
      thisMonth: '本月'
    },
    
    // 狀態選項
    statusOptions: {
      unlimited: '不限',
      onTime: '準時',
      leave: '請假',
      late: '遲到',
      earlyLeave: '早退',
      absent: '曠職'
    },
    
    // 表格標題
    table: {
      date: '日期',
      clockInTime: '上班打卡時間',
      clockOutTime: '下班打卡時間'
    },
    
    // 狀態標籤
    statusTags: {
      onTime: '準時',
      late: '遲到',
      earlyLeave: '早退',
      absent: '曠職',
      leave: '請假',
      abnormal: '異常'
    },
    
    // 訊息
    messages: {
      loading: '載入中...',
      processing: '處理中，請稍候...',
      noRecords: '無出勤紀錄',
      noMatchingRecords: '無符合條件的出勤紀錄',
      noRecordsThisMonth: '本月無出勤記錄',
      retry: '重新嘗試連接',
      dataLoadFailed: '資料讀取失敗',
      employeeNotFound: '找不到員工資料，請重新登入',
      fetchFailed: '獲取出勤記錄失敗'
    },
    
    // 錯誤處理
    errors: {
      networkError: '網路錯誤，請稍後再試',
      unauthorized: '缺少必要的登入資訊',
      dataProcessingError: '資料處理錯誤'
    },
    
    // 選擇器
    picker: {
      attendanceStatus: '出勤狀態',
      close: '關閉'
    }
  },

  // 補卡申請
  replenishApply: {
    title: '補卡申請',
    type: '類型',
    reason: '事由',
    date: '日期',
    originalTime: '原始時間',
    modifiedTime: '修改時間',
    description: '補卡說明',
    descriptionPlaceholder: '請詳細說明補卡原因...',
    clockIn: '上班',
    clockOut: '下班',
    businessTrip: '出差',
    forgotToClock: '忘記打卡',
    personalBusiness: '忙私人的事',
    other: '其他',
    reasonCategory: '補卡事由',
    cancel: '取消',
    submit: '送出',
    submitting: '送出中...',
    processingPleaseWait: '處理中，請稍候...'
  },

  // 補卡頁面
  replenish: {
    title: '補打卡',
    overview: '總覽',
    statusPending: '簽核中',
    statusApproved: '已通過',
    statusRejected: '未通過',
    statusPendingHR: '待HR審核',
    loadingData: '正在獲取補卡申請數據',
    errorOccurred: '發生錯誤',
    tryAgainLater: '請稍後再試或聯繫系統管理員',
    noRequests: '目前無申請單',
    noPendingRequests: '目前無簽核中的申請單',
    noApprovedRequests: '目前無已通過的申請單',
    noRejectedRequests: '目前無未通過的申請單',
    submitTime: '送出時間',
    replenishType: '補卡類型',
    replenishReason: '補卡原因',
    replenishTime: '補卡時間',
    newRequest: '新增補卡申請',
    modalTitle: '補卡申請單',
    formNumber: '單號',
    employee: '員工',
    status: '狀態',
    replenishDescription: '補卡原因',
    cancel: '撤銷',
    cancelRequestMessage: '已撤銷申請 {id}',
    businessTrip: '出差',
    forgotPunch: '忘記打卡',
    personalMatter: '忙私人的事',
    other: '其他',
    notFilled: '未填寫',
    replenishDate: '補卡日期',
    department: '部門',
    position: '職位',
    reviewer: '審核者',
    detailDescription: '詳細說明',
    networkError: '網路連線錯誤或 CORS 問題，請聯繫系統管理員',
    corsError: '跨域請求錯誤，請聯繫系統管理員設定 CORS',
    apiNotFoundError: 'API 端點不存在，請聯繫系統管理員',
    requestFailed: '請求失敗'
  },

  // 請假頁面
  leave: {
    title: '請假',
    leaveTypes: '假別',
    approvalProgress: '審核進度',
    overview: '總覽',
    statusPending: '簽核中',
    statusApproved: '已通過',
    statusRejected: '未通過',
    statusPendingHR: '待HR審核',
    remaining: '剩餘',
    days: '天',
    hours: '小時',
    minutes: '分鐘',
    zeroDaysHours: '0天0小時',
    zeroHours: '0小時',
    
    // 假別類型
    legalLeaveTypes: '法定假別',
    companyBenefitLeaveTypes: '公司福利假別',
    familyCareLeave: '家庭照顧假',
    workInjurySickLeave: '公傷病假',
    paternityCheckupLeave: '陪產(檢)假',
    bedRestLeave: '安胎假',
    parentalLeave: '育嬰假',
    bereavementLeave: '喪假',
    
    // 假別縮寫
    typeShort: {
      compensatory: '換',
      annual: '特',
      personal: '事',
      sick: '病',
      menstrual: '理',
      makeup: '補',
      official: '公',
      marriage: '婚',
      prenatalCheckup: '檢',
      maternity: '產',
      paternity: '陪',
      study: '書',
      birthday: '生日',
      unspecified: '未'
    },
    
    // 狀態和訊息
    loadingData: '正在獲取請假申請數據',
    errorOccurred: '發生錯誤',
    tryAgainLater: '請稍後再試或聯繫系統管理員',
    noRequests: '目前無申請單',
    noCurrent: '目前無',
    requests: '的申請單',
    newRequest: '新增請假申請',
    
    // 申請單詳情
    submitTime: '送出時間',
    leaveType: '請假類型',
    timeRange: '時間起迄',
    leaveDuration: '請假時數',
    modalTitle: '請假申請單',
    formNumber: '單號',
    employee: '員工',
    status: '狀態',
    leaveTimeRange: '請假時間起迄',
    totalHours: '總時數',
    leaveDescription: '請假說明',
    attachment: '附件',
    approver: '核准人',
    cancel: '撤銷',
    
    // 其他
    unspecified: '未指定',
    noReason: '未填寫',
    cannotCancelNoId: '無法撤銷請假：找不到請假單號',
    canceling: '正在撤銷請假...',
    cancelSuccess: '已成功取消請假申請',
    cancelFailed: '撤銷請假失敗'
  },

  // 請假申請頁面
  apply: {
    title: '請假申請',
    leaveType: '假別',
    startDate: '自',
    endDate: '到',
    duration: '時數',
    description: '說明',
    descriptionPlaceholder: '請輸入請假原因...',
    addAttachment: '新增附件',
    remaining: '剩餘',
    
    // 時間單位
    year: '年',
    month: '月',
    day: '日',
    days: '天',
    hours: '小時',
    minutes: '分鐘',
    
    // 星期
    weekdays: {
      sunday: '週日',
      monday: '週一',
      tuesday: '週二',
      wednesday: '週三',
      thursday: '週四',
      friday: '週五',
      saturday: '週六'
    },
    
    // 假別類型
    legalLeaveTypes: '法定假別',
    companyBenefitLeaveTypes: '公司福利假別',
    
    // 假別類型翻譯 - 這是關鍵的部分
    leaveTypes: {
      compensatory: '換休',
      annual: '特休',
      personal: '事假',
      sick: '病假',
      menstrual: '生理假',
      makeup: '補休',
      official: '公假',
      marriage: '婚假',
      prenatalCheckup: '產檢假',
      maternity: '產假',
      paternity: '陪產假',
      study: '溫書假',
      birthday: '生日假'
    },
    
    // 訊息
    success: '請假申請已送出',
    failed: '請假申請失敗',
    missingReason: '請填寫請假說明',
    invalidDuration: '請假時間必須大於0',
    attachmentNotAvailable: '附件功能尚未開放，請在說明欄位中描述相關資訊',
    loginRequired: '請先登入系統',
    employeeDataIncomplete: '無法獲取員工資料，請重新登入',
    employeeDataQueryFailed: '員工資料查詢失敗',
    employeeDataQueryError: '查詢員工資料時發生錯誤',
    fetchLunchBreakFailed: '獲取中午休息時間失敗',
    submitTimeout: '提交請求超時，請稍後再試',
    requestProcessingError: '處理請求時發生錯誤',
    allApiFailed: '所有API都提交失敗'
  },

  // 人事資料
  personalData: {
    title: '人事資料',
    basicInfo: '基本資料',
    workInfo: '職務相關',
    contactInfo: '聯絡資料',
    accountInfo: '系統設定',
    edit: '修改',
    save: '儲存',
    cancel: '取消',
    submit: '送出',
    
    // 基本資料欄位
    name: '姓名',
    birthDate: '出生日期',
    gender: '生理性別',
    idNumber: '身分證字號',
    photo: '照片',
    
    // 聯絡資料欄位
    residenceAddress: '戶籍地址',
    mailingAddress: '通訊地址',
    mobile: '手機',
    phone: '市話',
    
    // 工作資料欄位
    shiftSystem: '排班制度',
    identity: '身分別',
    salaryType: '薪別',
    department: '部門',
    jobTitle: '職稱',
    jobLevel: '職等',
    trainingControlDate: '受訓後管制',
    pensionContribution: '勞退金-自提',
    dependentsInsured: '眷屬投保',
    
    // 帳號資料欄位
    account: '帳號',
    password: '密碼',
    resetPassword: '重設密碼',
    
    // 性別選項
    genderOptions: {
      male: '男',
      female: '女',
      nonBinary: '非二元性別'
    },
    
    // 退休金和健保
    pensionSelfContribution: '退休金勞工自提',
    healthInsurance: '健保',
    healthInsuranceDependents: '健保-眷屬加保',
    addNew: '新增',
    relation: '稱謂',
    
    // 編輯相關
    editBasicInfo: '編輯基本資料',
    
    // 訊息
    updateSuccess: '資料更新成功！',
    updateFailed: '更新資料失敗，請稍後再試',
    loading: '載入中...',
    pleaseLogin: '請先登入以查看個人資料',
    networkError: '網路連線錯誤',
    loadFailed: '載入失敗',
    reload: '重新載入',
    fetchDataFailed: '查詢員工資料失敗',
    resetPasswordInDevelopment: '密碼重設功能開發中...',
    
    // 驗證訊息
    mobileValidation: '手機號碼必須為09開頭，後面跟著8個數字'
  },
 personalData: {
    title: '人事資料',
    loading: '載入中...',
    loadFailed: '載入失敗',
    reload: '重新載入',
    edit: '修改',
    cancel: '取消',
    save: '儲存',
    saving: '儲存中...',
    updateSuccess: '資料更新成功！',
    updateFailed: '更新資料失敗，請稍後再試',
    pleaseLogin: '請先登入以查看個人資料',
    networkError: '網路連線錯誤',
    fetchDataFailed: '查詢員工資料失敗',
    editBasicInfo: '編輯基本資料',
    editHealthInsurance: '編輯健保眷屬',
    editPension: '編輯退休金提撥',
    accountInfo: '系統設定',
    account: '帳號',
    password: '密碼',
    resetPassword: '重設密碼',
    resetPasswordInDevelopment: '密碼重設功能開發中...',
    residenceAddress: '居住地址',
    mobile: '手機號碼',
    phone: '市話',
    mobileValidation: '手機號碼必須為09開頭，後面跟著8個數字',
    pensionContribution: '退休金提撥比率',
    selectPension: '請選擇提撥比率',
    addNewDependent: '新增眷屬',
    ageUnit: '歲',
    
    fields: {
      employeeId: '職編',
      name: '中文名字',
      gender: '性別',
      passportEnglishName: '護照英文全名',
      nationality: '國籍（具有雙重國籍者請分別列出）',
      idNumber: '身分證字號',
      residencePermitNumber: '居留證號碼',
      birthDate: '西元出生日期',
      age113: '113年度年齡',
      age114: '114年度年齡',
      address: '地址',
      homePhone: '聯絡方式：市話',
      mobilePhone: '聯絡方式：手機',
      companyPhone: '公司手機',
      hireDate: '到職日',
      yearsOfService113: '113年資',
      annualLeaveHours: '特休時數',
      annualLeaveExpiry: '特休期限',
      resignationDate: '離職日',
      bloodType: '血型',
      highestEducation: '最高學歷',
      schoolDepartment: '就讀學校/科系',
      personalEmail: '個人電子郵件',
      companyEmail: '公司配發電子郵件',
      department: '部門',
      position: '職稱',
      professionalCertificates: '專業證照（若有相關資料，請分別列出並備妥電子檔）'
    },
    
    training: {
      itemNumber: '項次',
      courseName: '課程名稱',
      completionDate: '結訓日期',
      retrainingDate: '回訓日期',
      scheduledRetrainingDate: '應回訓日期',
      trainingRecord: '受訓紀錄'
    },
    
    genderOptions: {
      male: '男',
      female: '女',
      nonBinary: '非二元性別'
    }
  }
};

export default zhTW;
