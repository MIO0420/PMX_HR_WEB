import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import './HypothesisSetting.css';
import statutoryLeaveIcon from '../ICON/statutory_leave.png';
import companyWelfareLeaveIcon from '../ICON/Company_welfare_leave.png';
import CompanyWelfareLeave from './Company_Welfare_Leave/Company_Welfare_Leave';
import SpecialLeave from './Special_Leave/Special_Leave';
import { API_BASE_URL } from '../../config';

const HypothesisSetting = () => {
  const [activeTab, setActiveTab] = useState('statutory');
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState('general');
  
  const [leaveData, setLeaveData] = useState([]);
  const [specialLeaveData, setSpecialLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingSwitch, setUpdatingSwitch] = useState(null);
  // 🔸 新增：編輯狀態數據
  const [editingData, setEditingData] = useState([]);

  const getCompanyIdFromCookies = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'company_id') {
        return parseInt(value);
      }
    }
    return null;
  };

  // 🔸 定義固定條件的假別類型
  const FIXED_CONDITION_LEAVES = [
    '喪假', '產假', '陪產假', '育嬰留職停薪', '生理假', '家庭照顧假'
  ];

  // 🔸 獲取一般假別資料
  const fetchLeaveSettings = async () => {
    const companyId = getCompanyIdFromCookies();
    if (!companyId) {
      setError('無法獲取公司ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/salary/leave-settings/${companyId}`);
      const result = await response.json();

      if (result.Status === 'Ok') {
        const formattedData = result.Data.map((item, index) => ({
          id: item.id,
          title: item.leave_name,
          condition: item.text || '無限制',
          days: item.quota_hours ? `${Math.floor(item.quota_hours / 8)}天` : '無限制',
          period: item.quota_period_months === 12 ? '年度' : 
                  item.quota_period_months === 3 ? '季度' : 
                  item.quota_period_months === 1 ? '月度' : '年度',
          genderLimit: '無',
          salaryDeduction: item.salary_deduction_rate ? item.salary_deduction_rate.toString() : '0',
          hourlyRequest: Boolean(item.hour),
          category: '法定假別',
          leave_code: item.leave_code,
          group_code: item.group_code,
          // 🔸 新增：判斷是否為固定條件假別
          isFixedCondition: FIXED_CONDITION_LEAVES.includes(item.leave_name)
        }));

        setLeaveData(formattedData);
      } else {
        setError(result.Msg || '獲取假別設定失敗');
      }
    } catch (error) {
      console.error('獲取假別設定錯誤:', error);
      setError('網路連線錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 🔸 獲取特休假別資料
  const fetchSpecialLeave = async () => {
    const companyId = getCompanyIdFromCookies();
    if (!companyId) {
      console.log('無法獲取公司ID');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/salary/special-leave/${companyId}`);
      const result = await response.json();

      if (result.Status === 'Ok') {
        const formattedSpecialData = result.Data.map((item, index) => ({
          id: `special_${item.id}`,
          originalId: item.id, // 🔸 保存原始 ID
          title: '特別休假',
          condition: item.text || item.leave_name,
          days: item.quota_hours ? `${Math.floor(item.quota_hours / 8)}天` : '無限制',
          period: item.quota_period_months === 12 ? '年度' : 
                  item.quota_period_months === 3 ? '季度' : 
                  item.quota_period_months === 1 ? '月度' : '年度',
          genderLimit: '無',
          salaryDeduction: item.salary_deduction_rate ? item.salary_deduction_rate.toString() : '0',
          hourlyRequest: Boolean(item.hour),
          category: '特別休假',
          leave_code: item.leave_code,
          group_code: item.group_code,
          sort_order: index,
          // 🔸 特休假別的條件是固定的
          isFixedCondition: false
        }));

        setSpecialLeaveData(formattedSpecialData);
      } else {
        console.error('獲取特休假別失敗:', result.Msg);
        setSpecialLeaveData([]);
      }
    } catch (error) {
      console.error('獲取特休假別錯誤:', error);
      setSpecialLeaveData([]);
    }
  };

  // 🔸 更新假別設定 API 呼叫
  const updateLeaveSettings = async (id, updateData) => {
    const companyId = getCompanyIdFromCookies();
    if (!companyId) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/salary/leave-settings/${companyId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      return result.Status === 'Ok';
    } catch (error) {
      console.error('更新假別設定失敗:', error);
      return false;
    }
  };

  // 🔸 更新特休假別 API 呼叫
  const updateSpecialLeave = async (id, updateData) => {
    const companyId = getCompanyIdFromCookies();
    if (!companyId) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/salary/special-leave/${companyId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      return result.Status === 'Ok';
    } catch (error) {
      console.error('更新特休假別失敗:', error);
      return false;
    }
  };

  // 🔸 即時更新開關狀態的函數
  const updateHourField = async (id, newValue) => {
    const companyId = getCompanyIdFromCookies();
    if (!companyId) {
      console.error('無法獲取公司ID');
      return false;
    }

    const actualId = id.toString().startsWith('special_') ? 
      id.toString().replace('special_', '') : id;

    const apiEndpoint = id.toString().startsWith('special_') ?
      `${API_BASE_URL}/api/salary/special-leave/${companyId}/${actualId}` :
      `${API_BASE_URL}/api/salary/leave-settings/${companyId}/${actualId}`;

    try {
      setUpdatingSwitch(id);

      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hour: newValue ? 1 : 0 })
      });

      const result = await response.json();

      if (result.Status === 'Ok') {
        if (id.toString().startsWith('special_')) {
          setSpecialLeaveData(prev => 
            prev.map(item => 
              item.id === id ? { ...item, hourlyRequest: newValue } : item
            )
          );
        } else {
          setLeaveData(prev => 
            prev.map(item => 
              item.id === id ? { ...item, hourlyRequest: newValue } : item
            )
          );
        }
        
        console.log(`成功更新 ID ${id} 的 hour 欄位為 ${newValue ? 1 : 0}`);
        return true;
      } else {
        console.error('更新失敗:', result.Msg);
        return false;
      }
    } catch (error) {
      console.error('更新 hour 欄位錯誤:', error);
      return false;
    } finally {
      setUpdatingSwitch(null);
    }
  };

  // 🔸 處理編輯數據變更
  const handleEditDataChange = (id, field, value) => {
    setEditingData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 🔸 保存編輯變更
  const saveEditChanges = async () => {
    const companyId = getCompanyIdFromCookies();
    if (!companyId) return;

    try {
      setLoading(true);
      
      for (const item of editingData) {
        const updateData = {
          leave_name: item.title,
          text: item.condition,
          quota_hours: item.days === '無限制' ? null : parseInt(item.days) * 8,
          quota_period_months: item.period === '年度' ? 12 : 
                              item.period === '季度' ? 3 : 
                              item.period === '月度' ? 1 : 12,
          salary_deduction_rate: parseFloat(item.salaryDeduction) || 0,
          hour: item.hourlyRequest ? 1 : 0
        };

        let success = false;
        if (item.id.toString().startsWith('special_')) {
          success = await updateSpecialLeave(item.originalId, updateData);
        } else {
          success = await updateLeaveSettings(item.id, updateData);
        }

        if (!success) {
          alert(`更新 ${item.title} 失敗`);
          return;
        }
      }

      // 重新載入數據
      await fetchLeaveSettings();
      await fetchSpecialLeave();
      
      setIsEditing(false);
      setEditingData([]);
      alert('所有變更已保存成功！');
      
    } catch (error) {
      console.error('保存變更失敗:', error);
      alert('保存失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'statutory') {
      fetchLeaveSettings();
      fetchSpecialLeave();
    }
  }, [activeTab]);

  const refreshData = () => {
    fetchLeaveSettings();
    fetchSpecialLeave();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
    setEditingLeaveType('general');
    setEditingData([]);
    
    if (tab === 'statutory') {
      fetchLeaveSettings();
      fetchSpecialLeave();
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      // 取消編輯
      setIsEditing(false);
      setEditingData([]);
      setEditingLeaveType('general');
    } else {
      // 開始編輯
      setIsEditing(true);
      setEditingLeaveType('general');
      // 🔸 初始化編輯數據
      setEditingData([...leaveData]);
    }
  };

  const handleLeaveTypeToggle = (type) => {
    setEditingLeaveType(type);
    
    if (type === 'general') {
      setEditingData([...leaveData]);
    } else if (type === 'special') {
      setEditingData([...specialLeaveData]);
    }
  };

  const handleSwitchToggle = async (id) => {
    const allData = [...specialLeaveData, ...leaveData];
    const currentItem = allData.find(item => item.id === id);
    
    if (!currentItem) {
      console.error('找不到對應的假別項目');
      return;
    }

    const newValue = !currentItem.hourlyRequest;
    const success = await updateHourField(id, newValue);
    
    if (!success) {
      alert('更新失敗，請稍後再試');
    }
  };

  const handleSpecialLeaveSave = async (data) => {
    console.log('特別休假設定已保存:', data);
    
    // 🔸 處理特休假別保存邏輯
    const companyId = getCompanyIdFromCookies();
    if (!companyId) return;

    try {
      setLoading(true);
      
      for (const item of data) {
        const updateData = {
          leave_name: '特別休假',
          text: item.condition,
          quota_hours: item.days * 8,
          quota_period_months: 12,
          salary_deduction_rate: item.percentage || 0,
          hour: 1 // 特休假別預設可按小時請假
        };

        // 根據 ID 判斷是更新還是新增
        if (item.id <= specialLeaveData.length) {
          const originalItem = specialLeaveData.find(s => s.sort_order === item.id - 1);
          if (originalItem) {
            await updateSpecialLeave(originalItem.originalId, updateData);
          }
        }
      }

      await fetchSpecialLeave();
      setEditingLeaveType('general');
      alert('特別休假設定已保存成功！');
      
    } catch (error) {
      console.error('保存特休假別失敗:', error);
      alert('保存失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialLeaveCancel = () => {
    console.log('取消特別休假編輯');
    setEditingLeaveType('general');
  };

  const handleSpecialLeaveTabChange = (tab) => {
    if (tab === 'general') {
      setEditingLeaveType('general');
    }
  };

  const getCurrentLeaveData = () => {
    if (isEditing && editingLeaveType === 'special') {
      return specialLeaveData;
    } else if (isEditing && editingLeaveType === 'general') {
      return editingData.length > 0 ? editingData : leaveData;
    } else {
      const combinedData = [...specialLeaveData, ...leaveData];
      
      return combinedData.sort((a, b) => {
        if (a.category === '特別休假' && b.category !== '特別休假') return -1;
        if (a.category !== '特別休假' && b.category === '特別休假') return 1;
        
        if (a.category === '特別休假' && b.category === '特別休假') {
          return (a.sort_order || 0) - (b.sort_order || 0);
        }
        
        return a.id - b.id;
      });
    }
  };

  const renderStatutoryContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">載入中...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <p>錯誤: {error}</p>
            <button onClick={refreshData} className="retry-button">
              重新載入
            </button>
          </div>
        </div>
      );
    }

    if (isEditing && editingLeaveType === 'special') {
      return (
        <SpecialLeave 
          onSave={handleSpecialLeaveSave}
          onCancel={handleSpecialLeaveCancel}
          onTabChange={handleSpecialLeaveTabChange}
          specialLeaveData={specialLeaveData}
        />
      );
    }

    const currentData = getCurrentLeaveData();

    if (currentData.length === 0) {
      return (
        <div className="no-data-container">
          <div className="no-data-message">
            <p>目前沒有假別資料</p>
            <button onClick={refreshData} className="refresh-button">
              重新載入
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="leave-content-container">
        {isEditing && (
          <div className="leave-type-toggle">
            <div className="leave-type-frame">
              <div 
                className={`toggle-option ${editingLeaveType === 'general' ? 'active' : 'inactive'}`}
                onClick={() => handleLeaveTypeToggle('general')}
              >
                <span className="toggle-text">一般假別</span>
              </div>
              <div 
                className={`toggle-option ${editingLeaveType === 'special' ? 'active' : 'inactive'}`}
                onClick={() => handleLeaveTypeToggle('special')}
              >
                <span className="toggle-text">特別休假</span>
              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="edit-button-container">
            <button className="edit-button" onClick={handleEditClick}>
              <div className="edit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>編輯</span>
            </button>
          </div>
        )}

        <div className={`table-container ${isEditing ? 'editing-mode' : ''}`}>
          <div className="table-header">
            <div className="header-row">
              <div className="header-left">
                <div className="header-cell leave-type">假別種類</div>
                <div className="header-cell condition">條件</div>
              </div>
              <div className="header-group">
                <div className="header-cell days">可休假天數</div>
                <div className="header-cell period">週期</div>
                <div className="header-cell gender">性別限制</div>
                {isEditing && <div className="header-cell salary">扣薪比例</div>}
              </div>
              <div className="header-right">
                {!isEditing && <div className="header-cell salary">扣薪比例</div>}
                {!isEditing && <div className="header-cell hourly">可小時請假</div>}
              </div>
            </div>
          </div>

          <div className="table-content">
            {currentData.map((item, index) => (
              <div key={item.id} className={`table-row ${index === 5 ? 'highlighted' : ''}`}>
                <div className="row-content">
                  <div className="cell-group-left">
                    <div className="cell leave-title">{item.title}</div>
                    {isEditing ? (
                      // 🔸 根據假別類型顯示不同的條件輸入
                      item.isFixedCondition ? (
                        <div className="condition-text fixed-condition">
                          {item.condition}
                        </div>
                      ) : (
                        <select 
                          className="dropdown condition-dropdown"
                          value={item.condition}
                          onChange={(e) => handleEditDataChange(item.id, 'condition', e.target.value)}
                        >
                          <option value={item.condition}>{item.condition}</option>
                          <option value="無年資限制">無年資限制</option>
                          <option value="滿六個月以上">滿六個月以上</option>
                          <option value="未滿六個月">未滿六個月</option>
                          <option value="工作滿一年以上">工作滿一年以上</option>
                          <option value="工作滿兩年以上">工作滿兩年以上</option>
                        </select>
                      )
                    ) : (
                      <div 
                        className="condition-text"
                        data-full-text={item.condition}
                        title={item.condition}
                      >
                        {item.condition}
                      </div>
                    )}
                  </div>

                  <div className="cell-inputs">
                    {isEditing ? (
                      <select 
                        className="dropdown days-dropdown"
                        value={item.days}
                        onChange={(e) => handleEditDataChange(item.id, 'days', e.target.value)}
                      >
                        <option value={item.days}>{item.days}</option>
                        <option value="1天">1天</option>
                        <option value="3天">3天</option>
                        <option value="5天">5天</option>
                        <option value="7天">7天</option>
                        <option value="8天">8天</option>
                        <option value="10天">10天</option>
                        <option value="14天">14天</option>
                        <option value="30天">30天</option>
                        <option value="42天">42天</option>
                        <option value="56天">56天</option>
                        <option value="365天">365天</option>
                        <option value="無限制">無限制</option>
                        <option value="不定">不定</option>
                      </select>
                    ) : (
                      <div className="dropdown days-dropdown" style={{border: 'none', background: 'transparent'}}>
                        {item.days}
                      </div>
                    )}
                    
                    {isEditing ? (
                      <select 
                        className="dropdown period-dropdown"
                        value={item.period}
                        onChange={(e) => handleEditDataChange(item.id, 'period', e.target.value)}
                      >
                        <option value={item.period}>{item.period}</option>
                        <option value="年度">年度</option>
                        <option value="季度">季度</option>
                        <option value="月度">月度</option>
                        <option value="半年">半年</option>
                      </select>
                    ) : (
                      <div className="dropdown period-dropdown" style={{border: 'none', background: 'transparent'}}>
                        {item.period}
                      </div>
                    )}
                    
                    {isEditing ? (
                      <select 
                        className="dropdown gender-dropdown"
                        value={item.genderLimit}
                        onChange={(e) => handleEditDataChange(item.id, 'genderLimit', e.target.value)}
                      >
                        <option value={item.genderLimit}>{item.genderLimit}</option>
                        <option value="無">無</option>
                        <option value="限女性">限女性</option>
                        <option value="限男性">限男性</option>
                      </select>
                    ) : (
                      <div className="dropdown gender-dropdown" style={{border: 'none', background: 'transparent'}}>
                        {item.genderLimit}
                      </div>
                    )}
                    
                    {isEditing && (
                      <div className="salary-input-group">
                        <input 
                          type="text" 
                          className="salary-input" 
                          value={item.salaryDeduction} 
                          onChange={(e) => handleEditDataChange(item.id, 'salaryDeduction', e.target.value)}
                          style={{
                            border: '1px solid #E9E9E9',
                            background: '#FFFFFF'
                          }}
                        />
                        <span className="percentage">%</span>
                      </div>
                    )}
                  </div>
                  <div className="cell-group-right">
                    {!isEditing && (
                      <>
                        <div className="salary-input-group">
                          <input 
                            type="text" 
                            className="salary-input" 
                            value={item.salaryDeduction} 
                            readOnly
                            style={{
                              border: 'none',
                              background: 'transparent'
                            }}
                          />
                          <span className="percentage">%</span>
                        </div>
                        <div className="toggle-switch">
                          <div 
                            className={`switch ${item.hourlyRequest ? 'active' : ''} ${updatingSwitch === item.id ? 'updating' : ''}`}
                            onClick={() => handleSwitchToggle(item.id)}
                            style={{
                              cursor: updatingSwitch === item.id ? 'wait' : 'pointer',
                              opacity: updatingSwitch === item.id ? 0.6 : 1
                            }}
                          >
                            <div className="switch-handle"></div>
                            {updatingSwitch === item.id && (
                              <div className="switch-loading">
                                <div className="loading-spinner-small"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isEditing && editingLeaveType === 'general' && (
              <div className="edit-actions-row">
                <button className="cancel-button" onClick={handleEditClick}>
                  <span className="cancel-button-text">取消</span>
                  <span className="cancel-subtext">捨棄編輯</span>
                </button>
                
                <div className="complete-button-group">
                  <button className="complete-button" onClick={saveEditChanges}>
                    <span className="complete-button-text">完成</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="hypothesis-container">
      <div className="sidebar-wrapper">
        <Sidebar currentPage="hypothesis" />
      </div>

      <div className="submenu-wrapper">
        <div className="submenu-content">
          <div 
            className={`menu-item ${activeTab === 'statutory' ? 'active' : 'inactive'}`}
            onClick={() => handleTabClick('statutory')}
          >
            <div className="menu-icon">
              <img 
                src={statutoryLeaveIcon} 
                alt="法定假別" 
                className={`menu-icon-image ${activeTab !== 'statutory' ? 'inactive-icon-image' : ''}`}
              />
            </div>
            <div className={`menu-text ${activeTab === 'statutory' ? 'active-text' : 'inactive-text'}`}>
              法定假別
            </div>
          </div>

          <div 
            className={`menu-item ${activeTab === 'welfare' ? 'active' : 'inactive'}`}
            onClick={() => handleTabClick('welfare')}
          >
            <div className="menu-icon">
              <img 
                src={companyWelfareLeaveIcon} 
                alt="公司福利假別" 
                className={`menu-icon-image ${activeTab !== 'welfare' ? 'inactive-icon-image' : ''}`}
              />
            </div>
            <div className={`menu-text ${activeTab === 'welfare' ? 'active-text' : 'inactive-text'}`}>
              公司福利假別
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-area">
        {activeTab === 'statutory' && renderStatutoryContent()}
        {activeTab === 'welfare' && <CompanyWelfareLeave />}
      </div>
    </div>
  );
};

export default HypothesisSetting;
