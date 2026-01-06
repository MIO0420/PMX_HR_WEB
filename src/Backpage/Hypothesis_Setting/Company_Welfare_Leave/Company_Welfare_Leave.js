import React, { useState, useEffect } from 'react';
import './Company_Welfare_Leave.css';

const CompanyWelfareLeave = () => {
  const [welfareItems, setWelfareItems] = useState([
    {
      id: 1,
      title: '生日假',
      condition: '6個月至未滿1年',
      days: '1天',
      period: '每年',
      gender: '無',
      salaryDeduction: '0',
      hourlyRequest: true,
      isEditing: false
    }
  ]);

  const [isEditMode, setIsEditMode] = useState(false);

  // 管理 body 背景
  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add('edit-mode-active');
    } else {
      document.body.classList.remove('edit-mode-active');
    }
    
    // 清理函數
    return () => {
      document.body.classList.remove('edit-mode-active');
    };
  }, [isEditMode]);

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      condition: '條件',
      days: '天數',
      period: '選擇',
      gender: '選擇',
      salaryDeduction: '0',
      hourlyRequest: true,
      isEditing: true
    };
    setWelfareItems([...welfareItems, newItem]);
  };

  const handleRemoveItem = (id) => {
    setWelfareItems(welfareItems.filter(item => item.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setWelfareItems(welfareItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleComplete = () => {
    console.log('完成設定', welfareItems);
    setIsEditMode(false);
    setWelfareItems(welfareItems.map(item => ({ ...item, isEditing: false })));
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setWelfareItems(welfareItems.filter(item => !item.isEditing || item.title !== ''));
    setWelfareItems(prev => prev.map(item => ({ ...item, isEditing: false })));
  };

  const renderDropdownArrow = () => (
    <svg className="welfare-dropdown-arrow" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="#3A6CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const renderRemoveIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16.67" fill="#ED1313"/>
      <path d="M15 20H25" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const renderAddIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16.67" fill="#699BF7"/>
      <path d="M20 15V25M15 20H25" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  // 如果不是編輯模式，顯示簡化版本
  if (!isEditMode) {
    return (
      <div className="company-welfare-container">
        {/* 編輯按鈕 */}
        <div className="welfare-edit-button-container">
          <button className="welfare-edit-button" onClick={handleEditMode}>
            <div className="welfare-edit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>編輯</span>
          </button>
        </div>

        {/* 表格區域 */}
        <div className="welfare-table-container">
          {/* 表頭 */}
          <div className="welfare-table-header">
            <div className="welfare-header-row">
              <div className="welfare-header-left">
                <div className="welfare-header-cell welfare-leave-type">假別種類</div>
              </div>
              <div className="welfare-header-group">
                <div className="welfare-header-cell welfare-condition">條件/可休假天數</div>
              </div>
              <div className="welfare-header-right">
                <div className="welfare-header-cell welfare-salary">扣薪比例</div>
                <div className="welfare-header-cell welfare-hourly">換算小時</div>
              </div>
            </div>
          </div>

          {/* 表格內容 */}
          <div className="welfare-table-content">
            {welfareItems.map((item, index) => (
              <div key={item.id} className="welfare-table-row">
                <div className="welfare-row-content">
                  <div className="welfare-cell-group-left">
                    <div className="welfare-cell welfare-leave-title">{item.title}</div>
                  </div>
                  <div className="welfare-cell-condition-display">
                    {item.condition} {item.days} {item.period} {item.gender}
                  </div>
                  <div className="welfare-cell-group-right">
                    <div className="welfare-salary-display">
                      {item.salaryDeduction}%
                    </div>
                    <div className="welfare-toggle-display">
                      <div className={`welfare-switch ${item.hourlyRequest ? 'active' : ''}`}>
                        <div className="welfare-switch-handle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 編輯模式
  return (
    <div className="company-welfare-container">
      {/* 表頭 */}
      <div className="welfare-header">
        <div className="welfare-header-left">
          <span className="welfare-header-text">假別種類</span>
        </div>
        <div className="welfare-header-center">
          <span className="welfare-header-text">條件</span>
          <span className="welfare-header-text">天數</span>
          <span className="welfare-header-text">週期</span>
          <span className="welfare-header-text">性別</span>
        </div>
        <div className="welfare-header-right">
          <span className="welfare-header-text">扣薪比例</span>
          <span className="welfare-header-text">編輯</span>
        </div>
      </div>

      {/* 假別項目列表 - 添加編輯模式class */}
      <div className={`welfare-items-container ${isEditMode ? 'edit-mode' : ''}`}>
        {welfareItems.map((item, index) => (
          <div key={item.id} className={`welfare-item ${item.isEditing ? 'new-item' : ''}`}>
            <div className="welfare-item-content">
              <div className="welfare-item-main">
                <div className="welfare-item-left">
                  {/* 假別標題 */}
                  {!item.isEditing && (
                    <div className="welfare-title">{item.title}</div>
                  )}
                  
                  {/* 標題輸入框 */}
                  <div className={`welfare-title-input ${item.isEditing ? 'active' : ''}`}>
                    <input 
                      type="text" 
                      placeholder="假別名稱"
                      value={item.title}
                      onChange={(e) => handleInputChange(item.id, 'title', e.target.value)}
                    />
                  </div>
                </div>

                {/* 控制項組 - 中間平均分配 */}
                <div className="welfare-controls">
                  {/* 條件下拉選單 */}
                  <div className="welfare-dropdown welfare-dropdown-condition">
                    <div className="welfare-dropdown-content">
                      <span className="welfare-dropdown-text">{item.condition}</span>
                      {renderDropdownArrow()}
                    </div>
                  </div>

                  {/* 天數下拉選單 */}
                  <div className="welfare-dropdown welfare-dropdown-days">
                    <div className="welfare-dropdown-content">
                      <span className="welfare-dropdown-text">{item.days}</span>
                      {renderDropdownArrow()}
                    </div>
                  </div>

                  {/* 週期下拉選單 */}
                  <div className="welfare-dropdown welfare-dropdown-period">
                    <div className="welfare-dropdown-content">
                      <span className="welfare-dropdown-text">{item.period}</span>
                      {renderDropdownArrow()}
                    </div>
                  </div>

                  {/* 性別限制下拉選單 */}
                  <div className="welfare-dropdown welfare-dropdown-gender">
                    <div className="welfare-dropdown-content">
                      <span className="welfare-dropdown-text">{item.gender}</span>
                      {renderDropdownArrow()}
                    </div>
                  </div>
                </div>

                <div className="welfare-item-right">
                  {/* 扣薪比例輸入 */}
                  <div className="welfare-salary-input">
                    <div className="welfare-salary-field">
                      <input 
                        type="text" 
                        value={item.salaryDeduction}
                        onChange={(e) => handleInputChange(item.id, 'salaryDeduction', e.target.value)}
                      />
                    </div>
                    <span className="welfare-percentage">%</span>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="welfare-actions">
                    <button 
                      className="welfare-action-btn welfare-remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      {renderRemoveIcon()}
                    </button>
                    <button 
                      className="welfare-action-btn welfare-add-btn"
                      onClick={handleAddItem}
                    >
                      {renderAddIcon()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部操作區 - 固定定位，確保可點擊 */}
      <div className="welfare-bottom-actions">
        <div className="welfare-action-row">
          <button className="welfare-cancel-btn" onClick={handleCancel}>
            <span className="welfare-cancel-text">取消</span>
            <span className="welfare-cancel-subtext">捨棄編輯</span>
          </button>
          
          <div className="welfare-complete-group">
            <button className="welfare-complete-btn" onClick={handleComplete}>
              <span className="welfare-complete-text">完成</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyWelfareLeave;
