
// const viVN = {
//   // 通用
//   common: {
//     loading: 'Đang tải...',
//     error: 'Lỗi',
//     success: 'Thành công',
//     confirm: 'Xác nhận',
//     cancel: 'Hủy',
//     save: 'Lưu',
//     back: 'Quay lại',
//     next: 'Tiếp theo',
//     submit: 'Gửi',
//     close: 'Đóng',
//     processing: 'Đang xử lý...',
//     noRecord: 'Không có bản ghi'
//   },

//   // 登入頁面
//   login: {
//     title: 'Đăng nhập nhân viên',
//     companyId: 'Mã công ty',
//     employeeId: 'Mã nhân viên',
//     password: 'Mật khẩu',
//     companyIdPlaceholder: 'Nhập mã số thuế công ty',
//     employeeIdPlaceholder: 'Nhập tài khoản',
//     passwordPlaceholder: 'Nhập mật khẩu',
//     newPassword: 'Mật khẩu mới',
//     confirmPassword: 'Xác nhận mật khẩu',
//     loginButton: 'Đăng nhập',
//     loggingIn: 'Đang đăng nhập...',
//     processing: 'Đang xử lý, vui lòng chờ...',
//     initializing: 'Đang khởi tạo, vui lòng chờ...',
//     rememberMe: 'Ghi nhớ tôi',
//     forgotPassword: 'Quên mật khẩu',
//     changePassword: 'Đổi mật khẩu',
//     congratsMessage: 'Chúc mừng bạn gia nhập công ty mới, vui lòng đổi mật khẩu trước khi đăng nhập',
//     updatePasswordAndLogin: 'Cập nhật mật khẩu và đăng nhập',
//     backToLogin: 'Quay lại đăng nhập',
//     passwordChangeRequired: 'Cần đổi mật khẩu',
//     loginSuccess: 'Đăng nhập thành công',
//     loginFailed: 'Đăng nhập thất bại',
//     loginError: 'Mã số thuế, tài khoản hoặc mật khẩu không đúng, vui lòng nhập lại',
//     autoLoginFailed: 'Đăng nhập tự động thất bại: Thiếu mã số thuế công ty hoặc mã nhân viên',
//     invalidCredentials: 'Tài khoản hoặc mật khẩu sai',
//     passwordMismatch: 'Mật khẩu không khớp',
//     passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
//     missingFields: 'Vui lòng điền tất cả các trường bắt buộc'
//   },

//   // 首頁
//   home: {
//     title: 'Trang chủ',
//     welcome: 'Chào mừng',
//     noCompany: 'Chưa thiết lập công ty',
//     noDepartment: 'Không có thông tin phòng ban',
//     noPosition: 'Không có thông tin chức vụ',
//     notLoggedIn: 'Chưa đăng nhập',
//     noEmployeeId: 'N/A',
//     functions: {
//       punch: 'Chấm công',
//       makeup: 'Chấm công bù',
//       overtime: 'Làm thêm giờ',
//       leave: 'Xin nghỉ',
//       salary: 'Lương',
//       approval: 'Hệ thống phê duyệt',
//       schedule: 'Lịch làm việc',
//       announcement: 'Thông báo',
//       message: 'Tin nhắn'
//     },
//     noPermission: 'Bạn không có quyền sử dụng chức năng này'
//   },

//   // 打卡頁面
//   checkin: {
//     title: 'Hệ thống chấm công',
//     home: 'Trang chủ',
//     clockIn: 'Vào làm',
//     clockOut: 'Tan làm',
//     clockInTime: 'Thời gian chấm công vào',
//     clockOutTime: 'Thời gian chấm công ra',
//     currentTime: 'Thời gian hiện tại',
//     status: 'Trạng thái chấm công',
//     notPunched: 'Chưa chấm công',
//     clockedIn: 'Đã vào làm',
//     clockedOut: 'Đã tan làm',
//     location: 'Thông tin vị trí',
//     network: 'Thông tin mạng',
//     workDuration: 'Thời gian làm việc',
//     queryAttendance: 'Tra cứu tình hình chấm công',
//     processing: 'Đang xử lý...',
//     clockInFirst: 'Vui lòng chấm công vào trước',
//     clockInSuccess: 'Chấm công vào thành công',
//     clockOutSuccess: 'Chấm công ra thành công',
//     clockInFailed: 'Chấm công vào thất bại',
//     clockOutFailed: 'Chấm công ra thất bại',
//     locationError: 'Không thể lấy thông tin vị trí, vui lòng bật quyền truy cập vị trí',
//     networkError: 'Lỗi kết nối mạng',
//     lateMinutes: 'Bạn đã đi muộn {minutes} phút',
//     earlyLeaveMinutes: 'Bạn đã về sớm {minutes} phút',
//     overtimeMinutes: 'Bạn đã làm thêm {minutes} phút',
//     nonCompanyNetwork: 'Chấm công bằng mạng không phải của công ty',
//     weekdays: {
//       sunday: 'Chủ nhật',
//       monday: 'Thứ hai',
//       tuesday: 'Thứ ba',
//       wednesday: 'Thứ tư',
//       thursday: 'Thứ năm',
//       friday: 'Thứ sáu',
//       saturday: 'Thứ bảy'
//     },
//     tags: {
//       ontime: 'Đúng giờ',
//       late: 'Muộn',
//       early: 'Sớm',
//       overtime: 'Tăng ca',
//       stay: 'Ở lại'
//     }
//   },

//   // 錯誤訊息
//   errors: {
//     networkError: 'Lỗi kết nối mạng',
//     serverError: 'Lỗi máy chủ',
//     unauthorized: 'Truy cập không được phép',
//     tokenExpired: 'Token đã hết hạn, vui lòng đăng nhập lại',
//     dataLoadFailed: 'Tải dữ liệu thất bại',
//     locationPermissionDenied: 'Quyền truy cập vị trí bị từ chối',
//     locationUnavailable: 'Thông tin vị trí không khả dụng',
//     locationTimeout: 'Hết thời gian lấy vị trí',
//     requestFailed: 'Yêu cầu thất bại',
//     queryFailed: 'Truy vấn thất bại'
//   },

//   attendance: {
//     title: 'Tra cứu bản ghi chấm công',
//     home: 'Trang chủ',
    
//     // 篩選器
//     filters: {
//       attendanceStatus: 'Tình trạng chấm công',
//       punchResult: 'Kết quả chấm công',
//       time: 'Thời gian',
//       unlimited: 'Không giới hạn',
//       normal: 'Bình thường',
//       abnormal: 'Bất thường',
//       lastMonth: 'Tháng trước',
//       thisMonth: 'Tháng này'
//     },
    
//     // 狀態選項
//     statusOptions: {
//       unlimited: 'Không giới hạn',
//       onTime: 'Đúng giờ',
//       leave: 'Xin nghỉ',
//       late: 'Đi muộn',
//       earlyLeave: 'Về sớm',
//       absent: 'Vắng mặt'
//     },
    
//     // 表格標題
//     table: {
//       date: 'Ngày',
//       clockInTime: 'Giờ chấm công vào',
//       clockOutTime: 'Giờ chấm công ra'
//     },
    
//     // 狀態標籤
//     statusTags: {
//       onTime: 'Đúng giờ',
//       late: 'Đi muộn',
//       earlyLeave: 'Về sớm',
//       absent: 'Vắng mặt',
//       leave: 'Xin nghỉ',
//       abnormal: 'Bất thường'
//     },
    
//     // 訊息
//     messages: {
//       loading: 'Đang tải...',
//       processing: 'Đang xử lý, vui lòng đợi...',
//       noRecords: 'Không có bản ghi chấm công',
//       noMatchingRecords: 'Không có bản ghi chấm công phù hợp điều kiện',
//       noRecordsThisMonth: 'Tháng này không có bản ghi chấm công',
//       retry: 'Thử kết nối lại',
//       dataLoadFailed: 'Tải dữ liệu thất bại',
//       employeeNotFound: 'Không tìm thấy thông tin nhân viên, vui lòng đăng nhập lại',
//       fetchFailed: 'Lấy bản ghi chấm công thất bại'
//     },
    
//     // 錯誤處理
//     errors: {
//       networkError: 'Lỗi mạng, vui lòng thử lại sau',
//       unauthorized: 'Thiếu thông tin đăng nhập cần thiết',
//       dataProcessingError: 'Lỗi xử lý dữ liệu'
//     },
    
//     // 選擇器
//     picker: {
//       attendanceStatus: 'Trạng thái chấm công',
//       close: 'Đóng'
//     }
//   },

//   // 補卡申請
//   replenishApply: {
//     title: 'Đăng ký bù chấm công',
//     type: 'Loại',
//     reason: 'Lý do',
//     date: 'Ngày',
//     originalTime: 'Thời gian gốc',
//     modifiedTime: 'Thời gian sửa',
//     description: 'Mô tả bù chấm công',
//     descriptionPlaceholder: 'Vui lòng mô tả chi tiết lý do bù chấm công...',
//     clockIn: 'Vào làm',
//     clockOut: 'Tan làm',
//     businessTrip: 'Công tác',
//     forgotToClock: 'Quên chấm công',
//     personalBusiness: 'Bận việc riêng',
//     other: 'Khác',
//     reasonCategory: 'Lý do bù chấm công',
//     cancel: 'Hủy',
//     submit: 'Gửi',
//     submitting: 'Đang gửi...',
//     processingPleaseWait: 'Đang xử lý, vui lòng chờ...'
//   },

//   // 補卡頁面
//   replenish: {
//     title: 'Bù chấm công',
//     overview: 'Tổng quan',
//     statusPending: 'Đang phê duyệt',
//     statusApproved: 'Đã phê duyệt',
//     statusRejected: 'Không phê duyệt',
//     statusPendingHR: 'Chờ HR phê duyệt',
//     loadingData: 'Đang lấy dữ liệu đăng ký bù chấm công',
//     errorOccurred: 'Đã xảy ra lỗi',
//     tryAgainLater: 'Vui lòng thử lại sau hoặc liên hệ quản trị viên hệ thống',
//     noRequests: 'Hiện tại không có đơn đăng ký',
//     noPendingRequests: 'Hiện tại không có đơn đăng ký đang phê duyệt',
//     noApprovedRequests: 'Hiện tại không có đơn đăng ký đã phê duyệt',
//     noRejectedRequests: 'Hiện tại không có đơn đăng ký không phê duyệt',
//     submitTime: 'Thời gian gửi',
//     replenishType: 'Loại bù chấm công',
//     replenishReason: 'Lý do bù chấm công',
//     replenishTime: 'Thời gian bù chấm công',
//     newRequest: 'Thêm đăng ký bù chấm công',
//     modalTitle: 'Đơn đăng ký bù chấm công',
//     formNumber: 'Số đơn',
//     employee: 'Nhân viên',
//     status: 'Trạng thái',
//     replenishDescription: 'Lý do bù chấm công',
//     cancel: 'Hủy bỏ',
//     cancelRequestMessage: 'Đã hủy bỏ đăng ký {id}',
//     businessTrip: 'Công tác',
//     forgotPunch: 'Quên chấm công',
//     personalMatter: 'Bận việc riêng',
//     other: 'Khác',
//     notFilled: 'Chưa điền',
//     replenishDate: 'Ngày bù chấm công',
//     department: 'Phòng ban',
//     position: 'Chức vụ',
//     reviewer: 'Người phê duyệt',
//     detailDescription: 'Mô tả chi tiết',
//     networkError: 'Lỗi kết nối mạng hoặc CORS, vui lòng liên hệ quản trị viên hệ thống',
//     corsError: 'Lỗi yêu cầu cross-domain, vui lòng liên hệ quản trị viên để cấu hình CORS',
//     apiNotFoundError: 'Điểm cuối API không tồn tại, vui lòng liên hệ quản trị viên hệ thống',
//     requestFailed: 'Yêu cầu thất bại'
//   },

//   // 請假頁面
//   leave: {
//     title: 'Nghỉ phép',
//     leaveTypes: 'Loại nghỉ',
//     approvalProgress: 'Tiến độ',
//     overview: 'Tổng quan',
//     statusPending: 'Chờ duyệt',
//     statusApproved: 'Đã duyệt',
//     statusRejected: 'Từ chối',
//     statusPendingHR: 'Chờ HR phê duyệt',
//     remaining: 'Còn lại',
//     days: 'ngày',
//     hours: 'giờ',
//     minutes: 'phút',
//     zeroDaysHours: '0 ngày 0 giờ',
//     zeroHours: '0 giờ',
    
//     // 假別類型
//     legalLeaveTypes: 'Loại nghỉ theo luật định',
//     companyBenefitLeaveTypes: 'Loại nghỉ phúc lợi công ty',
//     familyCareLeave: 'Nghỉ chăm sóc gia đình',
//     workInjurySickLeave: 'Nghỉ ốm do tai nạn lao động',
//     paternityCheckupLeave: 'Nghỉ đi khám thai cùng vợ',
//     bedRestLeave: 'Nghỉ dưỡng thai',
//     parentalLeave: 'Nghỉ nuôi con',
//     bereavementLeave: 'Nghỉ tang',
    
//     // 假別縮寫
//     typeShort: {
//       compensatory: 'Bù',
//       annual: 'PN',
//       personal: 'VR',
//       sick: 'Ốm',
//       menstrual: 'SL',
//       makeup: 'Bù',
//       official: 'CT',
//       marriage: 'Cưới',
//       prenatalCheckup: 'KT',
//       maternity: 'Sinh',
//       paternity: 'CS',
//       study: 'Học',
//       birthday: 'SN',
//       unspecified: 'CXĐ'
//     },
    
//     // 狀態和訊息
//     loadingData: 'Đang lấy dữ liệu đăng ký nghỉ phép',
//     errorOccurred: 'Đã xảy ra lỗi',
//     tryAgainLater: 'Vui lòng thử lại sau hoặc liên hệ quản trị viên hệ thống',
//     noRequests: 'Hiện tại không có đơn đăng ký',
//     noCurrent: 'Hiện tại không có đơn đăng ký',
//     requests: '',
//     newRequest: 'Thêm đăng ký nghỉ phép',
    
//     // 申請單詳情
//     submitTime: 'Gửi',
//     leaveType: 'Loại',
//     timeRange: 'Từ',
//     leaveDuration: 'Thời gian',
//     modalTitle: 'Đơn đăng ký nghỉ phép',
//     formNumber: 'Số đơn',
//     employee: 'Nhân viên',
//     status: 'Trạng thái',
//     leaveTimeRange: 'Thời gian nghỉ phép',
//     totalHours: 'Tổng thời gian',
//     leaveDescription: 'Mô tả nghỉ phép',
//     attachment: 'Tệp đính kèm',
//     approver: 'Người phê duyệt',
//     cancel: 'Hủy bỏ',
    
//     // 其他
//     unspecified: 'Chưa xác định',
//     noReason: 'Chưa điền',
//     cannotCancelNoId: 'Không thể hủy nghỉ phép: Không tìm thấy số đơn nghỉ phép',
//     canceling: 'Đang hủy nghỉ phép...',
//     cancelSuccess: 'Đã hủy thành công đăng ký nghỉ phép',
//     cancelFailed: 'Hủy nghỉ phép thất bại'
//   },

//   // 請假申請頁面
//   apply: {
//     title: 'Đăng ký nghỉ phép',
//     leaveType: 'Loại nghỉ',
//     startDate: 'Từ',
//     endDate: 'Đến',
//     duration: 'Thời gian',
//     description: 'Mô tả',
//     descriptionPlaceholder: 'Vui lòng nhập lý do nghỉ phép...',
//     addAttachment: 'Thêm tệp đính kèm',
//     remaining: 'Còn lại',
    
//     // 時間單位
//     year: ' năm',
//     month: ' tháng',
//     day: ' ngày',
//     days: ' ngày',
//     hours: ' giờ',
//     minutes: ' phút',
    
//     // 星期
//     weekdays: {
//       sunday: 'CN',
//       monday: 'T2',
//       tuesday: 'T3',
//       wednesday: 'T4',
//       thursday: 'T5',
//       friday: 'T6',
//       saturday: 'T7'
//     },
    
//     // 假別類型
//     legalLeaveTypes: 'Loại nghỉ theo luật định',
//     companyBenefitLeaveTypes: 'Loại nghỉ phúc lợi công ty',
    
//     // 假別類型翻譯 - 這是關鍵的部分
//     leaveTypes: {
//       compensatory: 'Nghỉ bù',
//       annual: 'Nghỉ phép năm',
//       personal: 'Nghỉ việc riêng',
//       sick: 'Nghỉ ốm',
//       menstrual: 'Nghỉ sinh lý',
//       makeup: 'Nghỉ bù',
//       official: 'Nghỉ công tác',
//       marriage: 'Nghỉ cưới',
//       prenatalCheckup: 'Nghỉ khám thai',
//       maternity: 'Nghỉ sinh',
//       paternity: 'Nghỉ chăm sóc con',
//       study: 'Nghỉ học',
//       birthday: 'Nghỉ sinh nhật'
//     },
    
//     // 訊息
//     success: 'Đã gửi đăng ký nghỉ phép',
//     failed: 'Đăng ký nghỉ phép thất bại',
//     missingReason: 'Vui lòng điền lý do nghỉ phép',
//     invalidDuration: 'Thời gian nghỉ phép phải lớn hơn 0',
//     attachmentNotAvailable: 'Chức năng tệp đính kèm chưa mở, vui lòng mô tả thông tin liên quan trong phần mô tả',
//     loginRequired: 'Vui lòng đăng nhập hệ thống trước',
//     employeeDataIncomplete: 'Không thể lấy thông tin nhân viên, vui lòng đăng nhập lại',
//     employeeDataQueryFailed: 'Truy vấn thông tin nhân viên thất bại',
//     employeeDataQueryError: 'Lỗi khi truy vấn thông tin nhân viên',
//     fetchLunchBreakFailed: 'Lấy thời gian nghỉ trưa thất bại',
//     submitTimeout: 'Gửi yêu cầu hết thời gian, vui lòng thử lại sau',
//     requestProcessingError: 'Lỗi khi xử lý yêu cầu',
//     allApiFailed: 'Tất cả API đều gửi thất bại'
//   },

//   // 人事資料
//   personalData: {
//     title: 'Thông tin cá nhân',
//     basicInfo: 'Thông tin cơ bản',
//     workInfo: 'Thông tin công việc',
//     contactInfo: 'Thông tin liên lạc',
//     accountInfo: 'Thông tin tài khoản',
//     edit: 'Chỉnh sửa',
//     save: 'Lưu',
//     cancel: 'Hủy',
//     submit: 'Gửi',
    
//     // 基本資料欄位
//     name: 'Họ tên',
//     birthDate: 'Ngày sinh',
//     gender: 'Giới tính sinh học',
//     idNumber: 'Số CMND/CCCD',
//     photo: 'Ảnh',
    
//     // 聯絡資料欄位
//     residenceAddress: 'Địa chỉ thường trú',
//     mailingAddress: 'Địa chỉ liên lạc',
//     mobile: 'Điện thoại di động',
//     phone: 'Điện thoại cố định',
    
//     // 工作資料欄位
//     shiftSystem: 'Hệ thống ca làm việc',
//     identity: 'Loại nhân viên',
//     salaryType: 'Loại lương',
//     department: 'Phòng ban',
//     jobTitle: 'Chức vụ',
//     jobLevel: 'Cấp bậc',
//     trainingControlDate: 'Kiểm soát sau đào tạo',
//     pensionContribution: 'Hưu trí - Tự đóng',
//     dependentsInsured: 'Người phụ thuộc tham gia BH',
    
//     // 帳號資料欄位
//     account: 'Tài khoản',
//     password: 'Mật khẩu',
//     resetPassword: 'Đặt lại mật khẩu',
    
//     // 性別選項
//     genderOptions: {
//       male: 'Nam',
//       female: 'Nữ',
//       nonBinary: 'Phi nhị phân'
//     },
    
//     // 退休金和健保
//     pensionSelfContribution: 'Đóng góp hưu trí tự nguyện',
//     healthInsurance: 'Bảo hiểm y tế',
//     healthInsuranceDependents: 'Bảo hiểm y tế - Người phụ thuộc',
//     addNew: 'Thêm mới',
//     relation: 'Mối quan hệ',
    
//     // 編輯相關
//     editBasicInfo: 'Chỉnh sửa thông tin cơ bản',
    
//     // 訊息
//     updateSuccess: 'Cập nhật thông tin thành công!',
//     updateFailed: 'Cập nhật thông tin thất bại, vui lòng thử lại sau',
//     loading: 'Đang tải...',
//     pleaseLogin: 'Vui lòng đăng nhập để xem thông tin cá nhân',
//     networkError: 'Lỗi kết nối mạng',
//     loadFailed: 'Tải thất bại',
//     reload: 'Tải lại',
//     fetchDataFailed: 'Truy vấn thông tin nhân viên thất bại',
//     resetPasswordInDevelopment: 'Chức năng đặt lại mật khẩu đang phát triển...',
    
//     // 驗證訊息
//     mobileValidation: 'Số điện thoại di động phải bắt đầu bằng 09, theo sau là 8 chữ số'
//   }
// };

// export default viVN;
const viVN = {
  // 通用
  common: {
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
    save: 'Lưu',
    back: 'Quay lại',
    next: 'Tiếp theo',
    submit: 'Gửi',
    close: 'Đóng',
    processing: 'Đang xử lý...',
    noRecord: 'Không có bản ghi'
  },

  // 登入頁面
  login: {
    title: 'Đăng nhập nhân viên',
    companyId: 'Mã công ty',
    employeeId: 'Mã nhân viên',
    password: 'Mật khẩu',
    companyIdPlaceholder: 'Nhập mã số thuế công ty',
    employeeIdPlaceholder: 'Nhập tài khoản',
    passwordPlaceholder: 'Nhập mật khẩu',
    newPassword: 'Mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu',
    loginButton: 'Đăng nhập',
    loggingIn: 'Đang đăng nhập...',
    processing: 'Đang xử lý, vui lòng chờ...',
    initializing: 'Đang khởi tạo, vui lòng chờ...',
    rememberMe: 'Ghi nhớ tôi',
    forgotPassword: 'Quên mật khẩu',
    changePassword: 'Đổi mật khẩu',
    congratsMessage: 'Chúc mừng bạn gia nhập công ty mới, vui lòng đổi mật khẩu trước khi đăng nhập',
    updatePasswordAndLogin: 'Cập nhật mật khẩu và đăng nhập',
    backToLogin: 'Quay lại đăng nhập',
    passwordChangeRequired: 'Cần đổi mật khẩu',
    loginSuccess: 'Đăng nhập thành công',
    loginFailed: 'Đăng nhập thất bại',
    loginError: 'Mã số thuế, tài khoản hoặc mật khẩu không đúng, vui lòng nhập lại',
    autoLoginFailed: 'Đăng nhập tự động thất bại: Thiếu mã số thuế công ty hoặc mã nhân viên',
    invalidCredentials: 'Tài khoản hoặc mật khẩu sai',
    passwordMismatch: 'Mật khẩu không khớp',
    passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
    missingFields: 'Vui lòng điền tất cả các trường bắt buộc'
  },

  // 首頁
  home: {
    title: 'Trang chủ',
    welcome: 'Chào mừng',
    noCompany: 'Chưa thiết lập công ty',
    noDepartment: 'Không có thông tin phòng ban',
    noPosition: 'Không có thông tin chức vụ',
    notLoggedIn: 'Chưa đăng nhập',
    noEmployeeId: 'N/A',
    functions: {
      punch: 'Chấm công',
      makeup: 'Chấm công bù',
      overtime: 'Làm thêm giờ',
      leave: 'Xin nghỉ',
      salary: 'Lương',
      approval: 'Hệ thống phê duyệt',
      schedule: 'Lịch làm việc',
      announcement: 'Thông báo',
      message: 'Tin nhắn'
    },
    noPermission: 'Bạn không có quyền sử dụng chức năng này'
  },

  // 打卡頁面
  checkin: {
    title: 'Hệ thống chấm công',
    home: 'Trang chủ',
    clockIn: 'Vào làm',
    clockOut: 'Tan làm',
    clockInTime: 'Thời gian chấm công vào',
    clockOutTime: 'Thời gian chấm công ra',
    currentTime: 'Thời gian hiện tại',
    status: 'Trạng thái chấm công',
    notPunched: 'Chưa chấm công',
    clockedIn: 'Đã vào làm',
    clockedOut: 'Đã tan làm',
    location: 'Thông tin vị trí',
    network: 'Thông tin mạng',
    workDuration: 'Thời gian làm việc',
    queryAttendance: 'Tra cứu tình hình chấm công',
    processing: 'Đang xử lý...',
    clockInFirst: 'Vui lòng chấm công vào trước',
    clockInSuccess: 'Chấm công vào thành công',
    clockOutSuccess: 'Chấm công ra thành công',
    clockInFailed: 'Chấm công vào thất bại',
    clockOutFailed: 'Chấm công ra thất bại',
    locationError: 'Không thể lấy thông tin vị trí, vui lòng bật quyền truy cập vị trí',
    networkError: 'Lỗi kết nối mạng',
    lateMinutes: 'Bạn đã đi muộn {minutes} phút',
    earlyLeaveMinutes: 'Bạn đã về sớm {minutes} phút',
    overtimeMinutes: 'Bạn đã làm thêm {minutes} phút',
    nonCompanyNetwork: 'Chấm công bằng mạng không phải của công ty',
    
    // 上班打卡狀態
    checkinStatus: {
      too_early: 'Chấm công quá sớm',
      early: 'Đúng giờ',
      on_time: 'Đúng giờ',
      late: 'Muộn'
    },
    
    // 下班打卡狀態
    checkoutStatus: {
      early_leave: 'Về sớm',
      on_time: 'Đúng giờ',
      stay_late: 'Ở lại muộn',
      over_time: 'Tăng ca'
    },
    
    // 狀態說明
    statusDescriptions: {
      too_early: 'Chấm công trước thời gian cho phép',
      early: 'Đến sớm nhưng trong phạm vi cho phép',
      on_time: 'Chấm công đúng giờ',
      late: 'Chấm công muộn',
      early_leave: 'Về sớm trước giờ quy định',
      stay_late: 'Ở lại sau giờ làm việc nhưng chưa đạt tiêu chuẩn tăng ca',
      over_time: 'Đạt tiêu chuẩn thời gian tăng ca'
    },
    
    weekdays: {
      sunday: 'Chủ nhật',
      monday: 'Thứ hai',
      tuesday: 'Thứ ba',
      wednesday: 'Thứ tư',
      thursday: 'Thứ năm',
      friday: 'Thứ sáu',
      saturday: 'Thứ bảy'
    },
    tags: {
      ontime: 'Đúng giờ',
      late: 'Muộn',
      early: 'Sớm',
      overtime: 'Tăng ca',
      stay: 'Ở lại'
    }
  },

  // 錯誤訊息
  errors: {
    networkError: 'Lỗi kết nối mạng',
    serverError: 'Lỗi máy chủ',
    unauthorized: 'Truy cập không được phép',
    tokenExpired: 'Token đã hết hạn, vui lòng đăng nhập lại',
    dataLoadFailed: 'Tải dữ liệu thất bại',
    locationPermissionDenied: 'Quyền truy cập vị trí bị từ chối',
    locationUnavailable: 'Thông tin vị trí không khả dụng',
    locationTimeout: 'Hết thời gian lấy vị trí',
    requestFailed: 'Yêu cầu thất bại',
    queryFailed: 'Truy vấn thất bại'
  },

  attendance: {
    title: 'Tra cứu bản ghi chấm công',
    home: 'Trang chủ',
    
    // 篩選器
    filters: {
      attendanceStatus: 'Tình trạng chấm công',
      punchResult: 'Kết quả chấm công',
      time: 'Thời gian',
      unlimited: 'Không giới hạn',
      normal: 'Bình thường',
      abnormal: 'Bất thường',
      lastMonth: 'Tháng trước',
      thisMonth: 'Tháng này'
    },
    
    // 狀態選項
    statusOptions: {
      unlimited: 'Không giới hạn',
      onTime: 'Đúng giờ',
      leave: 'Xin nghỉ',
      late: 'Đi muộn',
      earlyLeave: 'Về sớm',
      absent: 'Vắng mặt'
    },
    
    // 表格標題
    table: {
      date: 'Ngày',
      clockInTime: 'Giờ chấm công vào',
      clockOutTime: 'Giờ chấm công ra'
    },
    
    // 狀態標籤
    statusTags: {
      onTime: 'Đúng giờ',
      late: 'Đi muộn',
      earlyLeave: 'Về sớm',
      absent: 'Vắng mặt',
      leave: 'Xin nghỉ',
      abnormal: 'Bất thường'
    },
    
    // 訊息
    messages: {
      loading: 'Đang tải...',
      processing: 'Đang xử lý, vui lòng đợi...',
      noRecords: 'Không có bản ghi chấm công',
      noMatchingRecords: 'Không có bản ghi chấm công phù hợp điều kiện',
      noRecordsThisMonth: 'Tháng này không có bản ghi chấm công',
      retry: 'Thử kết nối lại',
      dataLoadFailed: 'Tải dữ liệu thất bại',
      employeeNotFound: 'Không tìm thấy thông tin nhân viên, vui lòng đăng nhập lại',
      fetchFailed: 'Lấy bản ghi chấm công thất bại'
    },
    
    // 錯誤處理
    errors: {
      networkError: 'Lỗi mạng, vui lòng thử lại sau',
      unauthorized: 'Thiếu thông tin đăng nhập cần thiết',
      dataProcessingError: 'Lỗi xử lý dữ liệu'
    },
    
    // 選擇器
    picker: {
      attendanceStatus: 'Trạng thái chấm công',
      close: 'Đóng'
    }
  },

  // 補卡申請
  replenishApply: {
    title: 'Đăng ký bù chấm công',
    type: 'Loại',
    reason: 'Lý do',
    date: 'Ngày',
    originalTime: 'Thời gian gốc',
    modifiedTime: 'Thời gian sửa',
    description: 'Mô tả bù chấm công',
    descriptionPlaceholder: 'Vui lòng mô tả chi tiết lý do bù chấm công...',
    clockIn: 'Vào làm',
    clockOut: 'Tan làm',
    businessTrip: 'Công tác',
    forgotToClock: 'Quên chấm công',
    personalBusiness: 'Bận việc riêng',
    other: 'Khác',
    reasonCategory: 'Lý do bù chấm công',
    cancel: 'Hủy',
    submit: 'Gửi',
    submitting: 'Đang gửi...',
    processingPleaseWait: 'Đang xử lý, vui lòng chờ...'
  },

  // 補卡頁面
  replenish: {
    title: 'Bù chấm công',
    overview: 'Tổng quan',
    statusPending: 'Đang phê duyệt',
    statusApproved: 'Đã phê duyệt',
    statusRejected: 'Không phê duyệt',
    statusPendingHR: 'Chờ HR phê duyệt',
    loadingData: 'Đang lấy dữ liệu đăng ký bù chấm công',
    errorOccurred: 'Đã xảy ra lỗi',
    tryAgainLater: 'Vui lòng thử lại sau hoặc liên hệ quản trị viên hệ thống',
    noRequests: 'Hiện tại không có đơn đăng ký',
    noPendingRequests: 'Hiện tại không có đơn đăng ký đang phê duyệt',
    noApprovedRequests: 'Hiện tại không có đơn đăng ký đã phê duyệt',
    noRejectedRequests: 'Hiện tại không có đơn đăng ký không phê duyệt',
    submitTime: 'Thời gian gửi',
    replenishType: 'Loại bù chấm công',
    replenishReason: 'Lý do bù chấm công',
    replenishTime: 'Thời gian bù chấm công',
    newRequest: 'Thêm đăng ký bù chấm công',
    modalTitle: 'Đơn đăng ký bù chấm công',
    formNumber: 'Số đơn',
    employee: 'Nhân viên',
    status: 'Trạng thái',
    replenishDescription: 'Lý do bù chấm công',
    cancel: 'Hủy bỏ',
    cancelRequestMessage: 'Đã hủy bỏ đăng ký {id}',
    businessTrip: 'Công tác',
    forgotPunch: 'Quên chấm công',
    personalMatter: 'Bận việc riêng',
    other: 'Khác',
    notFilled: 'Chưa điền',
    replenishDate: 'Ngày bù chấm công',
    department: 'Phòng ban',
    position: 'Chức vụ',
    reviewer: 'Người phê duyệt',
    detailDescription: 'Mô tả chi tiết',
    networkError: 'Lỗi kết nối mạng hoặc CORS, vui lòng liên hệ quản trị viên hệ thống',
    corsError: 'Lỗi yêu cầu cross-domain, vui lòng liên hệ quản trị viên để cấu hình CORS',
    apiNotFoundError: 'Điểm cuối API không tồn tại, vui lòng liên hệ quản trị viên hệ thống',
    requestFailed: 'Yêu cầu thất bại'
  },

  // 請假頁面
  leave: {
    title: 'Nghỉ phép',
    leaveTypes: 'Loại nghỉ',
    approvalProgress: 'Tiến độ',
    overview: 'Tổng quan',
    statusPending: 'Chờ duyệt',
    statusApproved: 'Đã duyệt',
    statusRejected: 'Từ chối',
    statusPendingHR: 'Chờ HR phê duyệt',
    remaining: 'Còn lại',
    days: 'ngày',
    hours: 'giờ',
    minutes: 'phút',
    zeroDaysHours: '0 ngày 0 giờ',
    zeroHours: '0 giờ',
    
    // 假別類型
    legalLeaveTypes: 'Loại nghỉ theo luật định',
    companyBenefitLeaveTypes: 'Loại nghỉ phúc lợi công ty',
    familyCareLeave: 'Nghỉ chăm sóc gia đình',
    workInjurySickLeave: 'Nghỉ ốm do tai nạn lao động',
    paternityCheckupLeave: 'Nghỉ đi khám thai cùng vợ',
    bedRestLeave: 'Nghỉ dưỡng thai',
    parentalLeave: 'Nghỉ nuôi con',
    bereavementLeave: 'Nghỉ tang',
    
    // 假別縮寫
    typeShort: {
      compensatory: 'Bù',
      annual: 'PN',
      personal: 'VR',
      sick: 'Ốm',
      menstrual: 'SL',
      makeup: 'Bù',
      official: 'CT',
      marriage: 'Cưới',
      prenatalCheckup: 'KT',
      maternity: 'Sinh',
      paternity: 'CS',
      study: 'Học',
      birthday: 'SN',
      unspecified: 'CXĐ'
    },
    
    // 狀態和訊息
    loadingData: 'Đang lấy dữ liệu đăng ký nghỉ phép',
    errorOccurred: 'Đã xảy ra lỗi',
    tryAgainLater: 'Vui lòng thử lại sau hoặc liên hệ quản trị viên hệ thống',
    noRequests: 'Hiện tại không có đơn đăng ký',
    noCurrent: 'Hiện tại không có đơn đăng ký',
    requests: '',
    newRequest: 'Thêm đăng ký nghỉ phép',
    
    // 申請單詳情
    submitTime: 'Gửi',
    leaveType: 'Loại',
    timeRange: 'Từ',
    leaveDuration: 'Thời gian',
    modalTitle: 'Đơn đăng ký nghỉ phép',
    formNumber: 'Số đơn',
    employee: 'Nhân viên',
    status: 'Trạng thái',
    leaveTimeRange: 'Thời gian nghỉ phép',
    totalHours: 'Tổng thời gian',
    leaveDescription: 'Mô tả nghỉ phép',
    attachment: 'Tệp đính kèm',
    approver: 'Người phê duyệt',
    cancel: 'Hủy bỏ',
    
    // 其他
    unspecified: 'Chưa xác định',
    noReason: 'Chưa điền',
    cannotCancelNoId: 'Không thể hủy nghỉ phép: Không tìm thấy số đơn nghỉ phép',
    canceling: 'Đang hủy nghỉ phép...',
    cancelSuccess: 'Đã hủy thành công đăng ký nghỉ phép',
    cancelFailed: 'Hủy nghỉ phép thất bại'
  },

  // 請假申請頁面
  apply: {
    title: 'Đăng ký nghỉ phép',
    leaveType: 'Loại nghỉ',
    startDate: 'Từ',
    endDate: 'Đến',
    duration: 'Thời gian',
    description: 'Mô tả',
    descriptionPlaceholder: 'Vui lòng nhập lý do nghỉ phép...',
    addAttachment: 'Thêm tệp đính kèm',
    remaining: 'Còn lại',
    
    // 時間單位
    year: ' năm',
    month: ' tháng',
    day: ' ngày',
    days: ' ngày',
    hours: ' giờ',
    minutes: ' phút',
    
    // 星期
    weekdays: {
      sunday: 'CN',
      monday: 'T2',
      tuesday: 'T3',
      wednesday: 'T4',
      thursday: 'T5',
      friday: 'T6',
      saturday: 'T7'
    },
    
    // 假別類型
    legalLeaveTypes: 'Loại nghỉ theo luật định',
    companyBenefitLeaveTypes: 'Loại nghỉ phúc lợi công ty',
    
    // 假別類型翻譯 - 這是關鍵的部分
    leaveTypes: {
      compensatory: 'Nghỉ bù',
      annual: 'Nghỉ phép năm',
      personal: 'Nghỉ việc riêng',
      sick: 'Nghỉ ốm',
      menstrual: 'Nghỉ sinh lý',
      makeup: 'Nghỉ bù',
      official: 'Nghỉ công tác',
      marriage: 'Nghỉ cưới',
      prenatalCheckup: 'Nghỉ khám thai',
      maternity: 'Nghỉ sinh',
      paternity: 'Nghỉ chăm sóc con',
      study: 'Nghỉ học',
      birthday: 'Nghỉ sinh nhật'
    },
    
    // 訊息
    success: 'Đã gửi đăng ký nghỉ phép',
    failed: 'Đăng ký nghỉ phép thất bại',
    missingReason: 'Vui lòng điền lý do nghỉ phép',
    invalidDuration: 'Thời gian nghỉ phép phải lớn hơn 0',
    attachmentNotAvailable: 'Chức năng tệp đính kèm chưa mở, vui lòng mô tả thông tin liên quan trong phần mô tả',
    loginRequired: 'Vui lòng đăng nhập hệ thống trước',
    employeeDataIncomplete: 'Không thể lấy thông tin nhân viên, vui lòng đăng nhập lại',
    employeeDataQueryFailed: 'Truy vấn thông tin nhân viên thất bại',
    employeeDataQueryError: 'Lỗi khi truy vấn thông tin nhân viên',
    fetchLunchBreakFailed: 'Lấy thời gian nghỉ trưa thất bại',
    submitTimeout: 'Gửi yêu cầu hết thời gian, vui lòng thử lại sau',
    requestProcessingError: 'Lỗi khi xử lý yêu cầu',
    allApiFailed: 'Tất cả API đều gửi thất bại'
  },

  // 人事資料
  personalData: {
    title: 'Thông tin cá nhân',
    basicInfo: 'Thông tin cơ bản',
    workInfo: 'Thông tin công việc',
    contactInfo: 'Thông tin liên lạc',
    accountInfo: 'Thông tin tài khoản',
    edit: 'Chỉnh sửa',
    save: 'Lưu',
    cancel: 'Hủy',
    submit: 'Gửi',
    
    // 基本資料欄位
    name: 'Họ tên',
    birthDate: 'Ngày sinh',
    gender: 'Giới tính sinh học',
    idNumber: 'Số CMND/CCCD',
    photo: 'Ảnh',
    
    // 聯絡資料欄位
    residenceAddress: 'Địa chỉ thường trú',
    mailingAddress: 'Địa chỉ liên lạc',
    mobile: 'Điện thoại di động',
    phone: 'Điện thoại cố định',
    
    // 工作資料欄位
    shiftSystem: 'Hệ thống ca làm việc',
    identity: 'Loại nhân viên',
    salaryType: 'Loại lương',
    department: 'Phòng ban',
    jobTitle: 'Chức vụ',
    jobLevel: 'Cấp bậc',
    trainingControlDate: 'Kiểm soát sau đào tạo',
    pensionContribution: 'Hưu trí - Tự đóng',
    dependentsInsured: 'Người phụ thuộc tham gia BH',
    
    // 帳號資料欄位
    account: 'Tài khoản',
    password: 'Mật khẩu',
    resetPassword: 'Đặt lại mật khẩu',
    
    // 性別選項
    genderOptions: {
      male: 'Nam',
      female: 'Nữ',
      nonBinary: 'Phi nhị phân'
    },
    
    // 退休金和健保
    pensionSelfContribution: 'Đóng góp hưu trí tự nguyện',
    healthInsurance: 'Bảo hiểm y tế',
    healthInsuranceDependents: 'Bảo hiểm y tế - Người phụ thuộc',
    addNew: 'Thêm mới',
    relation: 'Mối quan hệ',
    
    // 編輯相關
    editBasicInfo: 'Chỉnh sửa thông tin cơ bản',
    
    // 訊息
    updateSuccess: 'Cập nhật thông tin thành công!',
    updateFailed: 'Cập nhật thông tin thất bại, vui lòng thử lại sau',
    loading: 'Đang tải...',
    pleaseLogin: 'Vui lòng đăng nhập để xem thông tin cá nhân',
    networkError: 'Lỗi kết nối mạng',
    loadFailed: 'Tải thất bại',
    reload: 'Tải lại',
    fetchDataFailed: 'Truy vấn thông tin nhân viên thất bại',
    resetPasswordInDevelopment: 'Chức năng đặt lại mật khẩu đang phát triển...',
    
    // 驗證訊息
    mobileValidation: 'Số điện thoại di động phải bắt đầu bằng 09, theo sau là 8 chữ số'
  },
   personalData: {
    title: 'Dữ liệu nhân sự',
    loading: 'Đang tải...',
    loadFailed: 'Tải thất bại',
    reload: 'Tải lại',
    edit: 'Chỉnh sửa',
    cancel: 'Hủy',
    save: 'Lưu',
    saving: 'Đang lưu...',
    updateSuccess: 'Cập nhật dữ liệu thành công!',
    updateFailed: 'Cập nhật dữ liệu thất bại, vui lòng thử lại sau',
    pleaseLogin: 'Vui lòng đăng nhập để xem thông tin cá nhân',
    networkError: 'Lỗi kết nối mạng',
    fetchDataFailed: 'Truy vấn dữ liệu nhân viên thất bại',
    editBasicInfo: 'Chỉnh sửa thông tin cơ bản',
    editHealthInsurance: 'Chỉnh sửa người phụ thuộc bảo hiểm y tế',
    editPension: 'Chỉnh sửa đóng góp hưu trí',
    accountInfo: 'Cài đặt hệ thống',
    account: 'Tài khoản',
    password: 'Mật khẩu',
    resetPassword: 'Đặt lại mật khẩu',
    resetPasswordInDevelopment: 'Chức năng đặt lại mật khẩu đang phát triển...',
    residenceAddress: 'Địa chỉ cư trú',
    mobile: 'Số điện thoại di động',
    phone: 'Điện thoại cố định',
    mobileValidation: 'Số điện thoại di động phải bắt đầu bằng 09 và có 8 chữ số theo sau',
    pensionContribution: 'Tỷ lệ đóng góp hưu trí',
    selectPension: 'Vui lòng chọn tỷ lệ đóng góp',
    addNewDependent: 'Thêm người phụ thuộc mới',
    ageUnit: 'tuổi',
    
    fields: {
      employeeId: 'Mã nhân viên',
      name: 'Tên tiếng Trung',
      gender: 'Giới tính',
      passportEnglishName: 'Tên tiếng Anh trên hộ chiếu',
      nationality: 'Quốc tịch (nếu có đôi quốc tịch vui lòng liệt kê riêng)',
      idNumber: 'Số CMND/CCCD',
      residencePermitNumber: 'Số thẻ cư trú',
      birthDate: 'Ngày sinh (dương lịch)',
      age113: 'Tuổi năm 113',
      age114: 'Tuổi năm 114',
      address: 'Địa chỉ',
      homePhone: 'Liên lạc: Điện thoại nhà',
      mobilePhone: 'Liên lạc: Điện thoại di động',
      companyPhone: 'Điện thoại công ty',
      hireDate: 'Ngày nhận việc',
      yearsOfService113: 'Thâm niên năm 113',
      annualLeaveHours: 'Số giờ nghỉ phép',
      annualLeaveExpiry: 'Hạn nghỉ phép',
      resignationDate: 'Ngày nghỉ việc',
      bloodType: 'Nhóm máu',
      highestEducation: 'Học vấn cao nhất',
      schoolDepartment: 'Trường/Khoa học',
      personalEmail: 'Email cá nhân',
      companyEmail: 'Email công ty',
      department: 'Phòng ban',
      position: 'Chức vụ',
      professionalCertificates: 'Chứng chỉ chuyên nghiệp (nếu có dữ liệu liên quan, vui lòng liệt kê riêng và chuẩn bị file điện tử)'
    },
    
    training: {
      itemNumber: 'STT',
      courseName: 'Tên khóa học',
      completionDate: 'Ngày hoàn thành',
      retrainingDate: 'Ngày đào tạo lại',
      scheduledRetrainingDate: 'Ngày dự kiến đào tạo lại',
      trainingRecord: 'Hồ sơ đào tạo'
    },
    
    genderOptions: {
      male: 'Nam',
      female: 'Nữ',
      nonBinary: 'Phi nhị phân'
    }
  }
};

export default viVN;
