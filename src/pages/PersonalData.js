import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function PersonalData() {
  const [currentTime, setCurrentTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderSelector, setShowGenderSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [errors, setErrors] = useState({});
  const datePickerRef = useRef(null);
  const genderSelectorRef = useRef(null);
  const yearSelectorRef = useRef(null);
  const navigate = useNavigate();

  // 性別選項
  const genderOptions = [
    { value: '男', label: '男' },
    { value: '女', label: '女' },
    { value: '非二元性別', label: '非二元性別' }
  ];

  // 個人資料狀態
  const [formData, setFormData] = useState({
    name: '朱彥光',
    birthDate: '1972/09/02',
    gender: '男',
    idNumber: 'A123456789',
    photo: null,
    residenceAddress: '台北市文山區洛斯福路六段2號A棟18樓之7',
    mailingAddress: '台北市中正區館前路2號12樓1271室',
    mobile: '0985123456',
    phone: '02-98765432',
    shiftSystem: '非輪班制',
    identity: '全時',
    salaryType: '月薪',
    department: '業務部',
    jobTitle: '專員',
    jobLevel: '1級',
    trainingControlDate: '2025/09/02',
    pensionContribution: '6%',
    dependentsInsured: '3人',
    account: 'chuhideki@gms.tonsinhori.com.tw',
    attachments: []
  });

  // 暫存修改前的資料，用於取消操作
  const [originalData, setOriginalData] = useState({});
  
  // 當前選擇的年月
  const [currentYearMonth, setCurrentYearMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // 生成年份選擇器的年份範圍
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // 從當前年份往前100年，往後10年
    for (let year = currentYear - 100; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  // 關閉選擇器的點擊外部區域事件
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
        setShowYearSelector(false);
      }
      if (genderSelectorRef.current && !genderSelectorRef.current.contains(event.target)) {
        setShowGenderSelector(false);
      }
      if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target)) {
        setShowYearSelector(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 更新右上角時間
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHomeClick = () => {
    navigate('/frontpage');
  };

  const handleEdit = () => {
    // 儲存原始資料，以便取消時恢復
    setOriginalData({...formData});
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    // 恢復原始資料
    setFormData(originalData);
    setIsEditing(false);
    setErrors({});
  };

  const validateIdNumber = (idNumber) => {
    // 檢查是否為一個大寫英文字母加9個數字
    const regex = /^[A-Z]\d{9}$/;
    return regex.test(idNumber);
  };

  const validateMobile = (mobile) => {
    // 檢查是否為09開頭，後面跟著8個數字
    const regex = /^09\d{8}$/;
    return regex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateIdNumber(formData.idNumber)) {
      newErrors.idNumber = '身份證字號必須為一個大寫英文字母加9個數字';
    }
    
    if (!validateMobile(formData.mobile)) {
      newErrors.mobile = '手機號碼必須為09開頭，後面跟著8個數字';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // 處理提交邏輯
      console.log('提交的數據:', formData);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 即時驗證
    if (name === 'idNumber') {
      if (!validateIdNumber(value)) {
        setErrors({...errors, idNumber: '身份證字號必須為一個大寫英文字母加9個數字'});
      } else {
        const newErrors = {...errors};
        delete newErrors.idNumber;
        setErrors(newErrors);
      }
    }
    
    if (name === 'mobile') {
      if (!validateMobile(value)) {
        setErrors({...errors, mobile: '手機號碼必須為09開頭，後面跟著8個數字'});
      } else {
        const newErrors = {...errors};
        delete newErrors.mobile;
        setErrors(newErrors);
      }
    }
  };

  const handleGenderClick = () => {
    setShowGenderSelector(true);
  };

  const handleGenderSelect = (gender) => {
    setFormData({
      ...formData,
      gender: gender
    });
    setShowGenderSelector(false);
  };

  const handleDateClick = () => {
    // 從當前日期解析年月
    const dateParts = formData.birthDate.split('/');
    if (dateParts.length === 3) {
      setCurrentYearMonth({
        year: parseInt(dateParts[0]),
        month: parseInt(dateParts[1])
      });
    }
    setShowDatePicker(true);
    setShowYearSelector(false);
  };

  const handleDateSelect = (day) => {
    const selectedDate = `${currentYearMonth.year}/${String(currentYearMonth.month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    setFormData({
      ...formData,
      birthDate: selectedDate
    });
    setShowDatePicker(false);
  };

  const handleYearClick = () => {
    setShowYearSelector(!showYearSelector);
  };

  const handleYearSelect = (year) => {
    setCurrentYearMonth({
      ...currentYearMonth,
      year: year
    });
    setShowYearSelector(false);
  };

  const changeMonth = (increment) => {
    let newMonth = currentYearMonth.month + increment;
    let newYear = currentYearMonth.year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    
    setCurrentYearMonth({
      year: newYear,
      month: newMonth
    });
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYearMonth.year, currentYearMonth.month);
    const firstDay = getFirstDayOfMonth(currentYearMonth.year, currentYearMonth.month);
    
    const days = [];
    // 填充月初的空白天數
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.calendarDay}></div>);
    }
    
    // 填充實際天數
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = formData.birthDate === `${currentYearMonth.year}/${String(currentYearMonth.month).padStart(2, '0')}/${String(i).padStart(2, '0')}`;
      days.push(
        <div 
          key={`day-${i}`} 
          style={{
            ...styles.calendarDay,
            ...(isSelected ? styles.selectedDay : {}),
            cursor: 'pointer'
          }}
          onClick={() => handleDateSelect(i)}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        photo: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleAttachmentUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newAttachment = {
        id: Date.now(),
        name: e.target.files[0].name,
        file: e.target.files[0]
      };
      setFormData({
        ...formData,
        attachments: [...formData.attachments, newAttachment]
      });
    }
  };

  const handlePensionEdit = () => {
    // 這裡可以實現退休金修改功能
    console.log('修改退休金');
  };

  const handleHealthInsuranceEdit = () => {
    // 這裡可以實現健保修改功能
    console.log('修改健保');
  };

  const handleResetPassword = () => {
    // 這裡可以實現重設密碼功能
    console.log('重設密碼');
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa',
      overflow: 'hidden',
    },
    appWrapper: {
      width: '360px',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ddd',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#3a75b5',
      color: 'white',
      padding: '0 16px',
      height: '50px',
    },
    homeIcon: {
      width: '30px',
      height: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    timeDisplay: {
      fontSize: '16px',
      color: '#FFFFFF',
    },
    pageTitle: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: '0',
      overflowY: 'auto',
      overflowX: 'hidden',
      backgroundColor: '#f8f9fa',
    },
    section: {
      marginBottom: '10px',
      backgroundColor: 'white',
      padding: '0',
      borderBottom: '10px solid #f0f0f0',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '5px',
      marginBottom: '5px',
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#3a75b5',
    },
    editLink: {
      fontSize: '13px',
      color: '#3a75b5',
      textDecoration: 'none',
      cursor: 'pointer',
      padding: '3px 8px',
      borderRadius: '4px',
      backgroundColor: '#f0f5ff',
    },
    row: {
      display: 'flex',
      padding: '12px 15px',
      borderBottom: '1px solid #f0f0f0',
      alignItems: 'center',
    },
    label: {
      flex: '0 0 30%',
      color: '#666',
      fontSize: '14px',
    },
    value: {
      flex: '0 0 70%',
      color: '#333',
      fontSize: '14px',
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    resetPasswordBtn: {
      backgroundColor: '#f0f5ff',
      border: 'none',
      fontSize: '13px',
      cursor: 'pointer',
      color: '#3a75b5',
      padding: '3px 8px',
      borderRadius: '4px',
    },
    // 編輯模式的樣式
    editingContent: {
      flex: 1,
      padding: '0',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100% - 50px)', // 減去頭部高度
    },
    editingScrollArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    formGroup: {
      display: 'flex',
      padding: '10px 15px',
      borderBottom: '1px solid #f0f0f0',
      alignItems: 'center',
    },
    input: {
      flex: '0 0 70%',
      padding: '8px 10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      textAlign: 'right',
      width: '100%',
      boxSizing: 'border-box',
    },
    inputError: {
      border: '1px solid #ff4d4f',
      boxShadow: '0 0 0 2px rgba(255,77,79,0.2)',
    },
    errorText: {
      color: '#ff4d4f',
      fontSize: '12px',
      marginTop: '4px',
      textAlign: 'right',
    },
    select: {
      flex: '0 0 70%',
      padding: '8px 10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      textAlign: 'right',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233a75b5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      backgroundSize: '12px',
      width: '100%',
      boxSizing: 'border-box',
    },
    buttonContainer: {
      display: 'flex',
      padding: '12px 15px',
      gap: '10px',
      backgroundColor: 'white',
      borderTop: '1px solid #eee',
    },
    cancelButton: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      color: '#333',
      fontSize: '14px',
      cursor: 'pointer',
    },
    submitButton: {
      flex: 1,
      padding: '10px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#3a75b5',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
    editingSection: {
      backgroundColor: 'white',
    },
    editingTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#3a75b5',
      padding: '12px 15px',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9',
    },
    dateInput: {
      flex: '0 0 70%',
      padding: '8px 10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      textAlign: 'right',
      width: '100%',
      boxSizing: 'border-box',
      cursor: 'pointer',
    },
    genderInput: {
      flex: '0 0 70%',
      padding: '8px 10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      textAlign: 'right',
      width: '100%',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    genderIcon: {
      marginLeft: '8px',
      width: '12px',
      height: '12px',
      display: 'inline-block',
    },
    datePickerContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: '1px solid #007bff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      width: '300px',
      padding: '10px',
    },
    genderSelectorContainer: {
      position: 'absolute',
      top: '35%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: '1px solid #007bff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      width: '200px',
      padding: '10px',
    },
    yearSelectorContainer: {
      position: 'absolute',
      top: '0',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #007bff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1001,
      width: '100%',
      height: '200px',
      overflowY: 'auto',
      padding: '10px',
      boxSizing: 'border-box',
    },
    genderOption: {
      padding: '12px 15px',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    yearOption: {
      padding: '10px 15px',
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'center',
      borderBottom: '1px solid #f0f0f0',
    },
    selectedGender: {
      backgroundColor: '#f0f7ff',
      color: '#007bff',
    },
    selectedYear: {
      backgroundColor: '#f0f7ff',
      color: '#007bff',
      fontWeight: 'bold',
    },
    checkIcon: {
      color: '#007bff',
      fontWeight: 'bold',
    },
    datePickerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      position: 'relative',
    },
    yearMonth: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    yearText: {
      marginRight: '5px',
      textDecoration: 'underline',
      color: '#007bff',
    },
    arrowButton: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#007bff',
      padding: '0 5px',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '5px',
    },
    calendarHeader: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#666',
      padding: '5px 0',
      fontSize: '14px',
    },
    calendarDay: {
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px',
      borderRadius: '4px',
    },
    selectedDay: {
      backgroundColor: '#e6f7ff',
      borderRadius: '50%',
      color: '#007bff',
      border: '1px solid #007bff',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        <header style={styles.header}>
          <div style={styles.homeIcon} onClick={handleHomeClick}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path d="M9 22V14h6v8" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div style={styles.pageTitle}>人事資料</div>
          <div style={styles.timeDisplay}>{currentTime}</div>
        </header>

        {isEditing ? (
          // 編輯模式 - 使用固定佈局避免滾動條
          <div style={styles.editingContent}>
            <div style={styles.editingSection}>
              <div style={styles.editingTitle}>編輯基本資料</div>
            </div>
            
            <div style={styles.editingScrollArea}>
              <div style={styles.formGroup}>
                <div style={styles.label}>姓名</div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>出生日期</div>
                <div 
                  style={styles.dateInput}
                  onClick={handleDateClick}
                >
                  {formData.birthDate}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>生理性別</div>
                <div 
                  style={styles.genderInput}
                  onClick={handleGenderClick}
                >
                  {formData.gender}
                  <span style={styles.genderIcon}>▼</span>
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>身分證字號</div>
                <div style={{flex: '0 0 70%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.idNumber ? styles.inputError : {})
                    }}
                  />
                  {errors.idNumber && (
                    <div style={styles.errorText}>{errors.idNumber}</div>
                  )}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>戶籍地址</div>
                <input
                  type="text"
                  name="residenceAddress"
                  value={formData.residenceAddress}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>通訊地址</div>
                <input
                  type="text"
                  name="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>手機</div>
                <div style={{flex: '0 0 70%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.mobile ? styles.inputError : {})
                    }}
                  />
                  {errors.mobile && (
                    <div style={styles.errorText}>{errors.mobile}</div>
                  )}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.label}>市話</div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button style={styles.cancelButton} onClick={handleCancel}>
                取消
              </button>
              <button style={styles.submitButton} onClick={handleSubmit}>
                送出
              </button>
            </div>
          </div>
        ) : (
          // 檢視模式
          <div style={styles.content}>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>基本資料</div>
                <a href="#" style={styles.editLink} onClick={(e) => { e.preventDefault(); handleEdit(); }}>修改</a>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>姓名</div>
                <div style={styles.value}>{formData.name}</div>
              </div>
              
              <div style={styles.row}>
              <div style={styles.label}>出生日期</div>
                <div style={styles.value}>{formData.birthDate}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>生理性別</div>
                <div style={styles.value}>{formData.gender}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>身分證字號</div>
                <div style={styles.value}>{formData.idNumber}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>戶籍地址</div>
                <div style={styles.value}>{formData.residenceAddress}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>通訊地址</div>
                <div style={styles.value}>{formData.mailingAddress}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>手機</div>
                <div style={styles.value}>{formData.mobile}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>市話</div>
                <div style={styles.value}>{formData.phone}</div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>職務相關</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>排班制度</div>
                <div style={styles.value}>{formData.shiftSystem}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>身分別</div>
                <div style={styles.value}>{formData.identity}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>薪別</div>
                <div style={styles.value}>{formData.salaryType}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>部門</div>
                <div style={styles.value}>{formData.department}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>職稱</div>
                <div style={styles.value}>{formData.jobTitle}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>職等</div>
                <div style={styles.value}>{formData.jobLevel}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>受訓後管制</div>
                <div style={styles.value}>{formData.trainingControlDate}</div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>退休金勞工自提</div>
                <a href="#" style={styles.editLink} onClick={(e) => { e.preventDefault(); handlePensionEdit(); }}>修改</a>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>勞退金-自提</div>
                <div style={styles.value}>{formData.pensionContribution}</div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>健保</div>
                <a href="#" style={styles.editLink} onClick={(e) => { e.preventDefault(); handleHealthInsuranceEdit(); }}>修改</a>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>眷屬投保</div>
                <div style={styles.value}>{formData.dependentsInsured}</div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>系統設定</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>帳號</div>
                <div style={styles.value}>{formData.account}</div>
              </div>
              
              <div style={styles.row}>
                <div style={styles.label}>密碼</div>
                <div style={styles.value}>
                  <button style={styles.resetPasswordBtn} onClick={handleResetPassword}>重設密碼</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 日期選擇器 */}
        {showDatePicker && (
          <div style={styles.datePickerContainer} ref={datePickerRef}>
            <div style={styles.datePickerHeader}>
              <button style={styles.arrowButton} onClick={() => changeMonth(-1)}>
                &lt;
              </button>
              <div style={styles.yearMonth} onClick={handleYearClick}>
                <span style={styles.yearText}>{currentYearMonth.year}</span>年 {currentYearMonth.month}月
              </div>
              <button style={styles.arrowButton} onClick={() => changeMonth(1)}>
                &gt;
              </button>
            </div>
            
            {/* 年份選擇器 */}
            {showYearSelector && (
              <div style={styles.yearSelectorContainer} ref={yearSelectorRef}>
                {yearOptions.map((year) => (
                  <div 
                    key={year}
                    style={{
                      ...styles.yearOption,
                      ...(currentYearMonth.year === year ? styles.selectedYear : {})
                    }}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
            
            <div style={styles.calendarGrid}>
              <div style={styles.calendarHeader}>日</div>
              <div style={styles.calendarHeader}>一</div>
              <div style={styles.calendarHeader}>二</div>
              <div style={styles.calendarHeader}>三</div>
              <div style={styles.calendarHeader}>四</div>
              <div style={styles.calendarHeader}>五</div>
              <div style={styles.calendarHeader}>六</div>
              
              {generateCalendar()}
            </div>
          </div>
        )}

        {/* 性別選擇器 */}
        {showGenderSelector && (
          <div style={styles.genderSelectorContainer} ref={genderSelectorRef}>
            {genderOptions.map((option) => (
              <div 
                key={option.value}
                style={{
                  ...styles.genderOption,
                  ...(formData.gender === option.value ? styles.selectedGender : {})
                }}
                onClick={() => handleGenderSelect(option.value)}
              >
                <span>{option.label}</span>
                {formData.gender === option.value && <span style={styles.checkIcon}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalData;

