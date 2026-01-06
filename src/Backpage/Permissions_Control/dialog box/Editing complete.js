import React from 'react';

const EditingComplete = ({
  isOpen,
  title = "編輯權限",
  message = "請確認資料編輯完成無誤並傳送通知。",
  cancelText = "取消",
  confirmText = "確定",
  onCancel,
  onConfirm,
  onClose
}) => {
  // 處理背景點擊
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  // 處理取消
  const handleCancel = () => {
    onCancel && onCancel();
    onClose && onClose();
  };

  // 處理確認
  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose && onClose();
  };

  if (!isOpen) {
    return null;
  }

  // 內聯樣式
  const styles = {
    // 對話框遮罩層
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    },

    // Dialog Body
    dialogBody: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '30px 32px',
      gap: '10px',
      position: 'relative',
      width: '466px',
      height: '201px',
      background: '#FFFFFF',
      border: '1px solid #D9D9D9',
      boxShadow: '0px 16px 32px -4px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
      borderRadius: '8px'
    },

    // Frame 563 - 主要內容容器
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '40px',
      width: '402px',
      height: '141px',
      flex: 'none',
      order: 0,
      alignSelf: 'stretch',
      flexGrow: 0
    },

    // Frame 562 - 文字區域
    textSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '17px',
      width: '402px',
      height: '61px',
      flex: 'none',
      order: 0,
      alignSelf: 'stretch',
      flexGrow: 0
    },

    // 標題容器
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '12px',
      width: '402px',
      height: '26px',
      flex: 'none',
      order: 0,
      alignSelf: 'stretch',
      flexGrow: 0
    },

    // 編輯權限標題
    title: {
      width: '104px',
      height: '26px',
      fontFamily: "'Microsoft JhengHei UI', 'Microsoft JhengHei', sans-serif",
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '26px',
      lineHeight: '100%',
      textAlign: 'center',
      color: '#3A6CA6',
      flex: 'none',
      order: 0,
      flexGrow: 0,
      margin: 0
    },

    // 訊息容器
    messageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '12px',
      width: '402px',
      height: '18px',
      flex: 'none',
      order: 1,
      alignSelf: 'stretch',
      flexGrow: 0
    },

    // 訊息文字
    message: {
      width: '306px',
      height: '18px',
      fontFamily: "'Microsoft JhengHei UI', 'Microsoft JhengHei', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '100%',
      textAlign: 'center',
      color: '#616161',
      flex: 'none',
      order: 0,
      flexGrow: 0,
      margin: 0
    },

    // Button Group
    buttonGroup: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '0px',
      gap: '12px',
      width: '402px',
      height: '40px',
      flex: 'none',
      order: 1,
      alignSelf: 'stretch',
      flexGrow: 0
    },

    // 取消按鈕 - Frame 98
    cancelButton: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 30px',
      gap: '10px',
      width: '92px',
      height: '40px',
      background: 'rgba(58, 108, 166, 0.15)',
      border: '1px solid #3A6CA6',
      borderRadius: '10px',
      flex: 'none',
      order: 0,
      flexGrow: 0,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },

    cancelText: {
      width: '32px',
      height: '16px',
      fontFamily: "'Inter', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      color: '#3A6CA6',
      flex: 'none',
      order: 0,
      flexGrow: 0
    },

    // 確定按鈕 - Frame 97
    confirmButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 30px',
      gap: '10px',
      width: '92px',
      height: '40px',
      background: '#3A6CA6',
      borderRadius: '10px',
      border: 'none',
      flex: 'none',
      order: 1,
      flexGrow: 0,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },

    confirmText: {
      width: '32px',
      height: '16px',
      fontFamily: "'Inter', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '100%',
      color: '#FFFFFF',
      flex: 'none',
      order: 0,
      flexGrow: 0
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.dialogBody}>
        <div style={styles.content}>
          <div style={styles.textSection}>
            <div style={styles.titleContainer}>
              <h2 style={styles.title}>{title}</h2>
            </div>
            <div style={styles.messageContainer}>
              <p style={styles.message}>{message}</p>
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              style={styles.cancelButton}
              onClick={handleCancel}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(58, 108, 166, 0.25)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(58, 108, 166, 0.15)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={styles.cancelText}>{cancelText}</span>
            </button>
            
            <button 
              style={styles.confirmButton}
              onClick={handleConfirm}
              onMouseEnter={(e) => {
                e.target.style.background = '#2d5a94';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(58, 108, 166, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#3A6CA6';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={styles.confirmText}>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditingComplete;
