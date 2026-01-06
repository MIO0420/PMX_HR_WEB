// import React, { useState, useEffect } from 'react';
// import './Special_Leave.css';

// // 特別休假初始數據
// const initialSpecialLeaveData = [
//     { id: 1, condition: '6個月至未滿1年', days: 3, period: '每年', gender: '無', percentage: 0 },
//     { id: 2, condition: '工作滿第1年', days: 7, period: '每年', gender: '無', percentage: 0 },
//     { id: 3, condition: '工作滿第2年', days: 10, period: '每年', gender: '無', percentage: 0 },
//     { id: 4, condition: '工作滿第3年', days: 14, period: '每年', gender: '無', percentage: 0 },
//     { id: 5, condition: '工作滿第4年', days: 14, period: '每年', gender: '無', percentage: 0 },
//     { id: 6, condition: '工作滿第5年', days: 15, period: '每年', gender: '無', percentage: 0 },
//     { id: 7, condition: '工作滿第6年', days: 15, period: '每年', gender: '無', percentage: 0 },
//     { id: 8, condition: '工作滿第7年', days: 15, period: '每年', gender: '無', percentage: 0 },
//     { id: 9, condition: '工作滿第8年', days: 15, period: '每年', gender: '無', percentage: 0 },
//     { id: 10, condition: '工作滿第9年', days: 15, period: '每年', gender: '無', percentage: 0 },
//     { id: 11, condition: '工作滿第10年', days: 16, period: '每年', gender: '無', percentage: 0 },
//     { id: 12, condition: '工作滿第11年', days: 17, period: '每年', gender: '無', percentage: 0 },
//     { id: 13, condition: '工作滿第12年', days: 18, period: '每年', gender: '無', percentage: 0 },
//     { id: 14, condition: '工作滿第13年', days: 19, period: '每年', gender: '無', percentage: 0 },
//     { id: 15, condition: '工作滿第14年', days: 20, period: '每年', gender: '無', percentage: 0 },
//     { id: 16, condition: '工作滿第15年', days: 21, period: '每年', gender: '無', percentage: 0 },
//     { id: 17, condition: '工作滿第16年', days: 22, period: '每年', gender: '無', percentage: 0 },
//     { id: 18, condition: '工作滿第17年', days: 23, period: '每年', gender: '無', percentage: 0 },
//     { id: 19, condition: '工作滿第18年', days: 24, period: '每年', gender: '無', percentage: 0 },
//     { id: 20, condition: '工作滿第19年', days: 25, period: '每年', gender: '無', percentage: 0 }
// ];

// // 下拉選單選項
// const dropdownOptions = {
//     condition: [
//         '6個月至未滿1年',
//         '工作滿第1年', '工作滿第2年', '工作滿第3年', '工作滿第4年', '工作滿第5年',
//         '工作滿第6年', '工作滿第7年', '工作滿第8年', '工作滿第9年', '工作滿第10年',
//         '工作滿第11年', '工作滿第12年', '工作滿第13年', '工作滿第14年', '工作滿第15年',
//         '工作滿第16年', '工作滿第17年', '工作滿第18年', '工作滿第19年'
//     ],
//     days: Array.from({length: 30}, (_, i) => i + 1),
//     period: ['每年', '每月', '每週'],
//     gender: ['無', '男性', '女性']
// };

// const SpecialLeave = ({ onSave, onCancel, onTabChange }) => {
//     const [leaveData, setLeaveData] = useState(initialSpecialLeaveData);
//     const [activeTab, setActiveTab] = useState('special');
//     const [dropdownOpen, setDropdownOpen] = useState({ index: -1, field: '' });

//     // 更新單個項目的數據
//     const updateLeaveItem = (id, field, value) => {
//         setLeaveData(prev => 
//             prev.map(item => 
//                 item.id === id ? { ...item, [field]: value } : item
//             )
//         );
//     };

//     // 處理百分比輸入
//     const handlePercentageChange = (id, value) => {
//         const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
//         updateLeaveItem(id, 'percentage', numValue);
//     };

//     // 處理下拉選單選擇
//     const handleDropdownSelect = (id, field, value) => {
//         updateLeaveItem(id, field, value);
//         setDropdownOpen({ index: -1, field: '' });
//     };

//     // 切換下拉選單
//     const toggleDropdown = (index, field) => {
//         if (dropdownOpen.index === index && dropdownOpen.field === field) {
//             setDropdownOpen({ index: -1, field: '' });
//         } else {
//             setDropdownOpen({ index, field });
//         }
//     };

//     // 處理標籤切換
//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         if (onTabChange) {
//             onTabChange(tab);
//         }
//     };

//     // 保存更改
//     const handleSave = () => {
//         console.log('保存特別休假設定:', leaveData);
//         if (onSave) {
//             onSave(leaveData);
//         }
//         alert('設定已保存！');
//     };

//     // 取消更改
//     const handleCancel = () => {
//         if (window.confirm('確定要捨棄所有編輯嗎？')) {
//             setLeaveData(initialSpecialLeaveData);
//             if (onCancel) {
//                 onCancel();
//             }
//         }
//     };

//     // 點擊外部關閉下拉選單
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest('.dropdown')) {
//                 setDropdownOpen({ index: -1, field: '' });
//             }
//         };

//         document.addEventListener('click', handleClickOutside);
//         return () => document.removeEventListener('click', handleClickOutside);
//     }, []);

//     // 下拉選單組件
//     const Dropdown = ({ item, field, index, options, className }) => {
//         const isOpen = dropdownOpen.index === index && dropdownOpen.field === field;
        
//         return (
//             <div className={`dropdown ${className}`} onClick={() => toggleDropdown(index, field)}>
//                 <span className="dropdown-text">{item[field]}</span>
//                 <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></div>
//                 {isOpen && (
//                     <div className="dropdown-menu">
//                         {options.map((option, optIndex) => (
//                             <div
//                                 key={optIndex}
//                                 className="dropdown-option"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDropdownSelect(item.id, field, option);
//                                 }}
//                             >
//                                 {option}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="special-leave-container">
//             <div className="special-leave-wrapper">
//                 {/* 假別選擇標籤 */}
//                 <div className="leave-type-tabs">
//                     <div className="tab-container">
//                         <button 
//                             className={`tab-button ${activeTab === 'general' ? 'active' : 'inactive'}`}
//                             onClick={() => handleTabChange('general')}
//                         >
//                             一般假別
//                         </button>
//                         <button 
//                             className={`tab-button ${activeTab === 'special' ? 'active' : 'inactive'}`}
//                             onClick={() => handleTabChange('special')}
//                         >
//                             特別休假
//                         </button>
//                     </div>
//                 </div>

//                 {/* 表格內容 */}
//                 <div className="table-section">
//                     {/* 表頭 */}
//                     <div className="table-header">
//                         <div className="header-item">假別種類</div>
//                         <div className="header-item">條件/可休假天數/頻率</div>
//                         <div className="header-item">可休天數</div>
//                         <div className="header-item">週期</div>
//                         <div className="header-item">性別限制</div>
//                         <div className="header-item">扣薪比例</div>
//                     </div>

//                     {/* 特休項目列表 */}
//                     <div className="leave-items-container">
//                         {leaveData.map((item, index) => (
//                             <div key={item.id} className="leave-item">
//                                 <div className="leave-item-content">
//                                     <div className="leave-title">特別休假</div>
//                                     <div className="leave-controls">
//                                         <Dropdown
//                                             item={item}
//                                             field="condition"
//                                             index={index}
//                                             options={dropdownOptions.condition}
//                                             className="condition"
//                                         />
//                                         <Dropdown
//                                             item={item}
//                                             field="days"
//                                             index={index}
//                                             options={dropdownOptions.days}
//                                             className="days"
//                                         />
//                                         <Dropdown
//                                             item={item}
//                                             field="period"
//                                             index={index}
//                                             options={dropdownOptions.period}
//                                             className="period"
//                                         />
//                                         <Dropdown
//                                             item={item}
//                                             field="gender"
//                                             index={index}
//                                             options={dropdownOptions.gender}
//                                             className="gender"
//                                         />
//                                         <div className="input-group">
//                                             <input
//                                                 type="number"
//                                                 className="percentage-input"
//                                                 value={item.percentage}
//                                                 onChange={(e) => handlePercentageChange(item.id, e.target.value)}
//                                                 min="0"
//                                                 max="100"
//                                             />
//                                             <span className="percentage-symbol">%</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* 操作按鈕 */}
//                 <div className="action-buttons">
//                     <button className="btn-cancel" onClick={handleCancel}>
//                         <span className="btn-title">取消</span>
//                         <span className="btn-subtitle">捨棄編輯</span>
//                     </button>
//                     <button className="btn-complete" onClick={handleSave}>
//                         完成
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SpecialLeave;
import React, { useState, useEffect } from 'react';
import './Special_Leave.css';
import { API_BASE_URL } from '../../../config';

const SpecialLeave = ({ onSave, onCancel, onTabChange, specialLeaveData }) => {
    const [leaveData, setLeaveData] = useState([]);
    const [activeTab, setActiveTab] = useState('special');
    const [dropdownOpen, setDropdownOpen] = useState({ index: -1, field: '' });

    // 🔸 從 props 初始化數據
    useEffect(() => {
        if (specialLeaveData && specialLeaveData.length > 0) {
            const formattedData = specialLeaveData.map((item, index) => ({
                id: index + 1,
                originalId: item.originalId,
                condition: item.condition,
                days: parseInt(item.days) || 0,
                period: item.period === '年度' ? '每年' : item.period,
                gender: item.genderLimit || '無',
                percentage: parseFloat(item.salaryDeduction) || 0
            }));
            setLeaveData(formattedData);
        }
    }, [specialLeaveData]);

    // 下拉選單選項
    const dropdownOptions = {
        condition: [
            '6個月至未滿1年',
            '工作滿第1年', '工作滿第2年', '工作滿第3年', '工作滿第4年', '工作滿第5年',
            '工作滿第6年', '工作滿第7年', '工作滿第8年', '工作滿第9年', '工作滿第10年',
            '工作滿第11年', '工作滿第12年', '工作滿第13年', '工作滿第14年', '工作滿第15年',
            '工作滿第16年', '工作滿第17年', '工作滿第18年', '工作滿第19年'
        ],
        days: Array.from({length: 30}, (_, i) => i + 1),
        period: ['每年', '每月', '每週'],
        gender: ['無', '男性', '女性']
    };

    // 更新單個項目的數據
    const updateLeaveItem = (id, field, value) => {
        setLeaveData(prev => 
            prev.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // 處理百分比輸入
    const handlePercentageChange = (id, value) => {
        const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
        updateLeaveItem(id, 'percentage', numValue);
    };

    // 處理下拉選單選擇
    const handleDropdownSelect = (id, field, value) => {
        updateLeaveItem(id, field, value);
        setDropdownOpen({ index: -1, field: '' });
    };

    // 切換下拉選單
    const toggleDropdown = (index, field) => {
        if (dropdownOpen.index === index && dropdownOpen.field === field) {
            setDropdownOpen({ index: -1, field: '' });
        } else {
            setDropdownOpen({ index, field });
        }
    };

    // 處理標籤切換
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (onTabChange) {
            onTabChange(tab);
        }
    };

    // 保存更改
    const handleSave = () => {
        console.log('保存特別休假設定:', leaveData);
        if (onSave) {
            onSave(leaveData);
        }
    };

    // 取消更改
    const handleCancel = () => {
        if (window.confirm('確定要捨棄所有編輯嗎？')) {
            if (onCancel) {
                onCancel();
            }
        }
    };

    // 點擊外部關閉下拉選單
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setDropdownOpen({ index: -1, field: '' });
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // 下拉選單組件
    const Dropdown = ({ item, field, index, options, className }) => {
        const isOpen = dropdownOpen.index === index && dropdownOpen.field === field;
        
        return (
            <div className={`dropdown ${className}`} onClick={() => toggleDropdown(index, field)}>
                <span className="dropdown-text">{item[field]}</span>
                <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></div>
                {isOpen && (
                    <div className="dropdown-menu">
                        {options.map((option, optIndex) => (
                            <div
                                key={optIndex}
                                className="dropdown-option"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDropdownSelect(item.id, field, option);
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="special-leave-container">
            <div className="special-leave-wrapper">
                {/* 假別選擇標籤 */}
                <div className="leave-type-tabs">
                    <div className="tab-container">
                        <button 
                            className={`tab-button ${activeTab === 'general' ? 'active' : 'inactive'}`}
                            onClick={() => handleTabChange('general')}
                        >
                            一般假別
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'special' ? 'active' : 'inactive'}`}
                            onClick={() => handleTabChange('special')}
                        >
                            特別休假
                        </button>
                    </div>
                </div>

                {/* 表格內容 */}
                <div className="table-section">
                    {/* 表頭 */}
                    <div className="table-header">
                        <div className="header-item">假別種類</div>
                        <div className="header-item">條件/可休假天數/頻率</div>
                        <div className="header-item">可休天數</div>
                        <div className="header-item">週期</div>
                        <div className="header-item">性別限制</div>
                        <div className="header-item">扣薪比例</div>
                    </div>

                    {/* 特休項目列表 */}
                    <div className="leave-items-container">
                        {leaveData.map((item, index) => (
                            <div key={item.id} className="leave-item">
                                <div className="leave-item-content">
                                    <div className="leave-title">特別休假</div>
                                    <div className="leave-controls">
                                        <Dropdown
                                            item={item}
                                            field="condition"
                                            index={index}
                                            options={dropdownOptions.condition}
                                            className="condition"
                                        />
                                        <Dropdown
                                            item={item}
                                            field="days"
                                            index={index}
                                            options={dropdownOptions.days}
                                            className="days"
                                        />
                                        <Dropdown
                                            item={item}
                                            field="period"
                                            index={index}
                                            options={dropdownOptions.period}
                                            className="period"
                                        />
                                        <Dropdown
                                            item={item}
                                            field="gender"
                                            index={index}
                                            options={dropdownOptions.gender}
                                            className="gender"
                                        />
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="percentage-input"
                                                value={item.percentage}
                                                onChange={(e) => handlePercentageChange(item.id, e.target.value)}
                                                min="0"
                                                max="100"
                                            />
                                            <span className="percentage-symbol">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 操作按鈕 */}
                <div className="action-buttons">
                    <button className="btn-cancel" onClick={handleCancel}>
                        <span className="btn-title">取消</span>
                        <span className="btn-subtitle">捨棄編輯</span>
                    </button>
                    <button className="btn-complete" onClick={handleSave}>
                        完成
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpecialLeave;
