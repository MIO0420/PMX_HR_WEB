// // import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// // import axios from 'axios';
// // import Cookies from 'js-cookie';
// // import './Salary_structure.css';
// // // 引入圖片
// // import IncreaseIcon from '../icon/Increase.png';
// // import ReduceIcon from '../icon/reduce.png';

// // const SalaryStructure = forwardRef(({ employee, isEditing }, ref) => {
// //   // 薪資結構狀態
// //   const [salaryData, setSalaryData] = useState({
// //     base_salary: 0,
// //     food_allowance: 0,
// //     basic_additions: [],
// //     total_salary: 0,
// //     insurance_level: 0,
// //     insurance_grade: ''
// //   });

// //   const [saving, setSaving] = useState(false);
// //   const [errors, setErrors] = useState({});

// //   // 投保級距對照表
// //   const insuranceLevels = [
// //     { level: 1, amount: 25200, grade: '第一級' },
// //     { level: 2, amount: 26400, grade: '第二級' },
// //     { level: 3, amount: 27600, grade: '第三級' },
// //     { level: 4, amount: 28800, grade: '第四級' },
// //     { level: 5, amount: 33000, grade: '第五級' },
// //     { level: 6, amount: 36300, grade: '第六級' },
// //     { level: 7, amount: 38200, grade: '第七級' },
// //     { level: 8, amount: 40100, grade: '第八級' },
// //     { level: 9, amount: 42000, grade: '第九級' },
// //     { level: 10, amount: 43900, grade: '第十級' }
// //   ];

// //   // 格式化金額顯示
// //   const formatAmount = (amount) => {
// //     return new Intl.NumberFormat('zh-TW').format(amount || 0);
// //   };

// //   // 初始化數據
// //   useEffect(() => {
// //     if (employee) {
// //       setSalaryData({
// //         base_salary: employee.base_salary || 0,
// //         food_allowance: employee.food_allowance || 0,
// //         basic_additions: employee.basic_additions || [],
// //         total_salary: employee.total_salary || 0,
// //         insurance_level: employee.insurance_level || 0,
// //         insurance_grade: employee.insurance_grade || ''
// //       });
// //     }
// //   }, [employee]);

// //   // 計算全薪
// //   const calculateTotalSalary = (baseSalary, foodAllowance, basicAdditions) => {
// //     const additionsTotal = basicAdditions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
// //     return (parseFloat(baseSalary) || 0) + (parseFloat(foodAllowance) || 0) + additionsTotal;
// //   };

// //   // 計算投保級距
// //   const calculateInsuranceLevel = (totalSalary) => {
// //     const salary = parseFloat(totalSalary) || 0;
    
// //     for (let i = 0; i < insuranceLevels.length; i++) {
// //       if (salary <= insuranceLevels[i].amount) {
// //         return {
// //           level: insuranceLevels[i].amount,
// //           grade: insuranceLevels[i].grade
// //         };
// //       }
// //     }
    
// //     const highest = insuranceLevels[insuranceLevels.length - 1];
// //     return {
// //       level: highest.amount,
// //       grade: highest.grade
// //     };
// //   };

// //   // 更新薪資數據
// //   const updateSalaryData = (newData) => {
// //     const total = calculateTotalSalary(newData.base_salary, newData.food_allowance, newData.basic_additions);
// //     const insurance = calculateInsuranceLevel(total);
    
// //     setSalaryData({
// //       ...newData,
// //       total_salary: total,
// //       insurance_level: insurance.level,
// //       insurance_grade: insurance.grade
// //     });
// //   };

// //   // 處理本薪變更
// //   const handleBaseSalaryChange = (value) => {
// //     const newData = { ...salaryData, base_salary: parseFloat(value) || 0 };
// //     updateSalaryData(newData);
// //   };

// //   // 處理伙食津貼變更
// //   const handleFoodAllowanceChange = (value) => {
// //     const newData = { ...salaryData, food_allowance: parseFloat(value) || 0 };
// //     updateSalaryData(newData);
// //   };

// //   // 處理基本加項變更
// //   const handleBasicAdditionChange = (index, field, value) => {
// //     const newAdditions = [...salaryData.basic_additions];
// //     newAdditions[index] = { ...newAdditions[index], [field]: value };
    
// //     if (field === 'amount') {
// //       newAdditions[index].amount = parseFloat(value) || 0;
// //     }
    
// //     const newData = { ...salaryData, basic_additions: newAdditions };
// //     updateSalaryData(newData);
// //   };

// //   // 新增基本加項
// //   const addBasicAddition = () => {
// //     const newAdditions = [...salaryData.basic_additions, { name: '', amount: 0 }];
// //     const newData = { ...salaryData, basic_additions: newAdditions };
// //     updateSalaryData(newData);
// //   };

// //   // 刪除基本加項
// //   const removeBasicAddition = (index) => {
// //     const newAdditions = salaryData.basic_additions.filter((_, i) => i !== index);
// //     const newData = { ...salaryData, basic_additions: newAdditions };
// //     updateSalaryData(newData);
// //   };

// //   // 保存薪資結構
// //   const saveSalaryStructure = async () => {
// //     if (!employee?.employee_id) {
// //       return { success: false, message: '員工ID不存在' };
// //     }

// //     setSaving(true);
// //     setErrors({});

// //     try {
// //       const companyId = Cookies.get('company_id') || '76014406';
      
// //       const updateData = {
// //         base_salary: salaryData.base_salary,
// //         food_allowance: salaryData.food_allowance,
// //         basic_additions: salaryData.basic_additions,
// //         total_salary: salaryData.total_salary,
// //         insurance_level: salaryData.insurance_level,
// //         insurance_grade: salaryData.insurance_grade,
// //         updated_by: 'admin'
// //       };

// //       console.log('🔄 準備發送薪資結構資料:', updateData);

// //       const response = await axios.put(
// //         `https://rabbit.54ucl.com:3004/api/employees/${companyId}/${employee.employee_id}/salary`,
// //         updateData,
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           },
// //           timeout: 15000
// //         }
// //       );

// //       if (response.data && response.data.Status === 'Ok') {
// //         console.log('✅ 薪資結構更新成功');
// //         return { success: true, message: '薪資結構更新成功', updatedData: response.data.Data };
// //       } else {
// //         console.error('❌ 薪資結構更新失敗:', response.data?.Msg);
// //         return { success: false, message: response.data?.Msg || '薪資結構更新失敗' };
// //       }
// //     } catch (error) {
// //       console.error('❌ 薪資結構更新失敗:', error);
// //       return { success: false, message: error.message || '薪資結構更新失敗' };
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // 暴露給父組件的方法
// //   useImperativeHandle(ref, () => ({
// //     saveSalaryStructure
// //   }));

// //   // 渲染基本加項
// //   const renderBasicAdditions = () => {
// //     // 如果有基本加項，渲染所有項目
// //     if (salaryData.basic_additions.length > 0) {
// //       return salaryData.basic_additions.map((addition, index) => (
// //         <div key={index} className="basic-addition-item">
// //           <div className="basic-addition-content">
// //             <div className="basic-addition-label-area">
// //               <div className="salary-label">基本加項</div>
// //               <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
// //             </div>
// //             <div className="basic-addition-input-area">
// //               <input
// //                 type="text"
// //                 value={addition.name || ''}
// //                 onChange={(e) => handleBasicAdditionChange(index, 'name', e.target.value)}
// //                 className="addition-name-input"
// //                 placeholder="加項名稱"
// //               />
// //               <input
// //                 type="number"
// //                 value={addition.amount || ''}
// //                 onChange={(e) => handleBasicAdditionChange(index, 'amount', e.target.value)}
// //                 className="addition-amount-input"
// //                 placeholder="輸入金額"
// //                 min="0"
// //               />
// //               <div className="button-area">
// //                 <button
// //                   type="button"
// //                   onClick={() => removeBasicAddition(index)}
// //                   className="remove-addition-btn"
// //                   title="刪除此項目"
// //                 >
// //                   <img src={ReduceIcon} alt="刪除" className="button-icon" />
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={addBasicAddition}
// //                   className="add-addition-btn"
// //                   title="新增項目"
// //                 >
// //                   <img src={IncreaseIcon} alt="新增" className="button-icon" />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       ));
// //     }

// //     // 如果沒有基本加項，顯示空的基本加項框
// //     return (
// //       <div className="empty-basic-addition">
// //         <div className="basic-addition-content">
// //           <div className="basic-addition-label-area">
// //             <div className="salary-label">基本加項</div>
// //             <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
// //           </div>
// //           <div className="basic-addition-input-area">
// //             <div className="button-area">
// //               <button
// //                 type="button"
// //                 onClick={addBasicAddition}
// //                 className="add-addition-btn"
// //                 title="新增項目"
// //               >
// //                 <img src={IncreaseIcon} alt="新增" className="button-icon" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="salary-structure-container">
// //       <div className="salary-structure-content">
// //         {/* 本薪 - 最大框框，只有輸入框 */}
// //         <div className="salary-item base-salary">
// //           <div className="salary-item-content">
// //             <div className="salary-label-area">
// //               <div className="salary-label">本薪</div>
// //             </div>
// //             <div className="salary-input-area">
// //               <input
// //                 type="number"
// //                 value={salaryData.base_salary || ''}
// //                 onChange={(e) => handleBaseSalaryChange(e.target.value)}
// //                 className="salary-input"
// //                 placeholder="輸入金額"
// //                 min="0"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* 薪資結構細項 - 包含藍色線條和所有子項目 */}
// //         <div className="salary-structure-details">
// //           <div className="blue-vertical-line"></div>
// //           <div className="salary-structure-inner">
// //             {/* 伙食津貼 */}
// //             <div className="salary-item sub-item">
// //               <div className="salary-item-content">
// //                 <div className="salary-label-area">
// //                   <div className="salary-label">伙食津貼</div>
// //                   <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
// //                 </div>
// //                 <div className="salary-input-area">
// //                   <input
// //                     type="number"
// //                     value={salaryData.food_allowance || ''}
// //                     onChange={(e) => handleFoodAllowanceChange(e.target.value)}
// //                     className="salary-input"
// //                     placeholder="輸入金額"
// //                     min="0"
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             {/* 基本加項容器 */}
// //             <div className="basic-additions-container">
// //               {renderBasicAdditions()}
// //             </div>

// //             {/* 全薪 - 在藍色線內 */}
// //             <div className="salary-item total-salary">
// //               <div className="salary-item-content">
// //                 <div className="salary-label-area">
// //                   <div className="salary-label">全薪(以月計算)</div>
// //                 </div>
// //                 <div className="salary-input-area">
// //                   <div className="salary-display">
// //                     {formatAmount(salaryData.total_salary)}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* 投保級距 - 在藍色線內 */}
// //             <div className="salary-item insurance-level">
// //               <div className="salary-item-content">
// //                 <div className="salary-label-area">
// //                   <div className="salary-label">投保級距</div>
// //                   <div className="salary-description">(自動計算)</div>
// //                 </div>
// //                 <div className="insurance-display">
// //                   <div className="insurance-amount">{formatAmount(salaryData.insurance_level)}</div>
// //                   <div className="insurance-grade">({salaryData.insurance_grade})</div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // });

// // SalaryStructure.displayName = 'SalaryStructure';

// // export default SalaryStructure;
// import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './Salary_structure.css';
// // 引入圖片
// import IncreaseIcon from '../icon/Increase.png';
// import ReduceIcon from '../icon/reduce.png';

// const SalaryStructure = forwardRef(({ employee, isEditing }, ref) => {
//   // 薪資結構狀態
//   const [salaryData, setSalaryData] = useState({
//     base_salary: 0,
//     food_allowance: 0,
//     basic_additions: [],
//     total_salary: 0,
//     insurance_level: 0,
//     insurance_grade: ''
//   });

//   const [saving, setSaving] = useState(false);
//   const [errors, setErrors] = useState({});

//   // 投保級距對照表
//   const insuranceLevels = [
//     { level: 1, amount: 25200, grade: '第一級' },
//     { level: 2, amount: 26400, grade: '第二級' },
//     { level: 3, amount: 27600, grade: '第三級' },
//     { level: 4, amount: 28800, grade: '第四級' },
//     { level: 5, amount: 33000, grade: '第五級' },
//     { level: 6, amount: 36300, grade: '第六級' },
//     { level: 7, amount: 38200, grade: '第七級' },
//     { level: 8, amount: 40100, grade: '第八級' },
//     { level: 9, amount: 42000, grade: '第九級' },
//     { level: 10, amount: 43900, grade: '第十級' }
//   ];

//   // 格式化金額顯示
//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('zh-TW').format(amount || 0);
//   };

//   // 初始化數據
//   useEffect(() => {
//     if (employee) {
//       const basicAdditions = employee.basic_additions || [];
//       // 如果沒有基本加項，初始化一個空的加項
//       const initialAdditions = basicAdditions.length > 0 ? basicAdditions : [{ name: '', amount: 0 }];
      
//       setSalaryData({
//         base_salary: employee.base_salary || 0,
//         food_allowance: employee.food_allowance || 0,
//         basic_additions: initialAdditions,
//         total_salary: employee.total_salary || 0,
//         insurance_level: employee.insurance_level || 0,
//         insurance_grade: employee.insurance_grade || ''
//       });
//     } else {
//       // 如果沒有員工資料，也初始化一個空的基本加項
//       setSalaryData({
//         base_salary: 0,
//         food_allowance: 0,
//         basic_additions: [{ name: '', amount: 0 }],
//         total_salary: 0,
//         insurance_level: 0,
//         insurance_grade: ''
//       });
//     }
//   }, [employee]);

//   // 計算全薪
//   const calculateTotalSalary = (baseSalary, foodAllowance, basicAdditions) => {
//     const additionsTotal = basicAdditions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
//     return (parseFloat(baseSalary) || 0) + (parseFloat(foodAllowance) || 0) + additionsTotal;
//   };

//   // 計算投保級距
//   const calculateInsuranceLevel = (totalSalary) => {
//     const salary = parseFloat(totalSalary) || 0;
    
//     for (let i = 0; i < insuranceLevels.length; i++) {
//       if (salary <= insuranceLevels[i].amount) {
//         return {
//           level: insuranceLevels[i].amount,
//           grade: insuranceLevels[i].grade
//         };
//       }
//     }
    
//     const highest = insuranceLevels[insuranceLevels.length - 1];
//     return {
//       level: highest.amount,
//       grade: highest.grade
//     };
//   };

//   // 更新薪資數據
//   const updateSalaryData = (newData) => {
//     const total = calculateTotalSalary(newData.base_salary, newData.food_allowance, newData.basic_additions);
//     const insurance = calculateInsuranceLevel(total);
    
//     setSalaryData({
//       ...newData,
//       total_salary: total,
//       insurance_level: insurance.level,
//       insurance_grade: insurance.grade
//     });
//   };

//   // 處理本薪變更
//   const handleBaseSalaryChange = (value) => {
//     const newData = { ...salaryData, base_salary: parseFloat(value) || 0 };
//     updateSalaryData(newData);
//   };

//   // 處理伙食津貼變更
//   const handleFoodAllowanceChange = (value) => {
//     const newData = { ...salaryData, food_allowance: parseFloat(value) || 0 };
//     updateSalaryData(newData);
//   };

//   // 處理基本加項變更
//   const handleBasicAdditionChange = (index, field, value) => {
//     const newAdditions = [...salaryData.basic_additions];
//     newAdditions[index] = { ...newAdditions[index], [field]: value };
    
//     if (field === 'amount') {
//       newAdditions[index].amount = parseFloat(value) || 0;
//     }
    
//     const newData = { ...salaryData, basic_additions: newAdditions };
//     updateSalaryData(newData);
//   };

//   // 新增基本加項
//   const addBasicAddition = () => {
//     const newAdditions = [...salaryData.basic_additions, { name: '', amount: 0 }];
//     const newData = { ...salaryData, basic_additions: newAdditions };
//     updateSalaryData(newData);
//   };

//   // 刪除基本加項
//   const removeBasicAddition = (index) => {
//     // 如果只有一個項目，不刪除，只清空內容
//     if (salaryData.basic_additions.length === 1) {
//       const newAdditions = [{ name: '', amount: 0 }];
//       const newData = { ...salaryData, basic_additions: newAdditions };
//       updateSalaryData(newData);
//     } else {
//       // 如果有多個項目，才真正刪除
//       const newAdditions = salaryData.basic_additions.filter((_, i) => i !== index);
//       const newData = { ...salaryData, basic_additions: newAdditions };
//       updateSalaryData(newData);
//     }
//   };

//   // 保存薪資結構
//   const saveSalaryStructure = async () => {
//     if (!employee?.employee_id) {
//       return { success: false, message: '員工ID不存在' };
//     }

//     setSaving(true);
//     setErrors({});

//     try {
//       const companyId = Cookies.get('company_id') || '76014406';
      
//       // 過濾掉空的基本加項
//       const filteredAdditions = salaryData.basic_additions.filter(
//         addition => addition.name.trim() !== '' || (addition.amount && addition.amount > 0)
//       );
      
//       const updateData = {
//         base_salary: salaryData.base_salary,
//         food_allowance: salaryData.food_allowance,
//         basic_additions: filteredAdditions,
//         total_salary: salaryData.total_salary,
//         insurance_level: salaryData.insurance_level,
//         insurance_grade: salaryData.insurance_grade,
//         updated_by: 'admin'
//       };

//       console.log('🔄 準備發送薪資結構資料:', updateData);

//       const response = await axios.put(
//         `https://rabbit.54ucl.com:3004/api/employees/${companyId}/${employee.employee_id}/salary`,
//         updateData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 15000
//         }
//       );

//       if (response.data && response.data.Status === 'Ok') {
//         console.log('✅ 薪資結構更新成功');
//         return { success: true, message: '薪資結構更新成功', updatedData: response.data.Data };
//       } else {
//         console.error('❌ 薪資結構更新失敗:', response.data?.Msg);
//         return { success: false, message: response.data?.Msg || '薪資結構更新失敗' };
//       }
//     } catch (error) {
//       console.error('❌ 薪資結構更新失敗:', error);
//       return { success: false, message: error.message || '薪資結構更新失敗' };
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 暴露給父組件的方法
//   useImperativeHandle(ref, () => ({
//     saveSalaryStructure
//   }));

//   // 渲染基本加項
//   const renderBasicAdditions = () => {
//     // 確保至少有一個基本加項
//     const additions = salaryData.basic_additions.length > 0 ? salaryData.basic_additions : [{ name: '', amount: 0 }];
    
//     return additions.map((addition, index) => (
//       <div key={index} className="basic-addition-item">
//         <div className="basic-addition-content">
//           <div className="basic-addition-label-area">
//             <div className="salary-label">基本加項</div>
//             <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
//           </div>
//           <div className="basic-addition-input-area">
//             <input
//               type="text"
//               value={addition.name || ''}
//               onChange={(e) => handleBasicAdditionChange(index, 'name', e.target.value)}
//               className="addition-name-input"
//               placeholder="加項名稱"
//             />
//             <input
//               type="number"
//               value={addition.amount || ''}
//               onChange={(e) => handleBasicAdditionChange(index, 'amount', e.target.value)}
//               className="addition-amount-input"
//               placeholder="輸入金額"
//               min="0"
//             />
//             <div className="button-area">
//               <button
//                 type="button"
//                 onClick={() => removeBasicAddition(index)}
//                 className="remove-addition-btn"
//                 title="刪除此項目"
//               >
//                 <img src={ReduceIcon} alt="刪除" className="button-icon" />
//               </button>
//               <button
//                 type="button"
//                 onClick={addBasicAddition}
//                 className="add-addition-btn"
//                 title="新增項目"
//               >
//                 <img src={IncreaseIcon} alt="新增" className="button-icon" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <div className="salary-structure-container">
//       <div className="salary-structure-content">
//         {/* 本薪 - 最大框框，只有輸入框 */}
//         <div className="salary-item base-salary">
//           <div className="salary-item-content">
//             <div className="salary-label-area">
//               <div className="salary-label">本薪</div>
//             </div>
//             <div className="salary-input-area">
//               <input
//                 type="number"
//                 value={salaryData.base_salary || ''}
//                 onChange={(e) => handleBaseSalaryChange(e.target.value)}
//                 className="salary-input"
//                 placeholder="輸入金額"
//                 min="0"
//               />
//             </div>
//           </div>
//         </div>

//         {/* 薪資結構細項 - 包含藍色線條和所有子項目 */}
//         <div className="salary-structure-details">
//           <div className="blue-vertical-line"></div>
//           <div className="salary-structure-inner">
//             {/* 伙食津貼 */}
//             <div className="salary-item sub-item">
//               <div className="salary-item-content">
//                 <div className="salary-label-area">
//                   <div className="salary-label">伙食津貼</div>
//                   <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
//                 </div>
//                 <div className="salary-input-area">
//                   <input
//                     type="number"
//                     value={salaryData.food_allowance || ''}
//                     onChange={(e) => handleFoodAllowanceChange(e.target.value)}
//                     className="salary-input"
//                     placeholder="輸入金額"
//                     min="0"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* 基本加項容器 */}
//             <div className="basic-additions-container">
//               {renderBasicAdditions()}
//             </div>

//             {/* 全薪 - 在藍色線內 */}
//             <div className="salary-item total-salary">
//               <div className="salary-item-content">
//                 <div className="salary-label-area">
//                   <div className="salary-label">全薪(以月計算)</div>
//                 </div>
//                 <div className="salary-input-area">
//                   <div className="salary-display">
//                     {formatAmount(salaryData.total_salary)}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 投保級距 - 在藍色線內 */}
//             <div className="salary-item insurance-level">
//               <div className="salary-item-content">
//                 <div className="salary-label-area">
//                   <div className="salary-label">投保級距</div>
//                   <div className="salary-description">(自動計算)</div>
//                 </div>
//                 <div className="insurance-display">
//                   <div className="insurance-amount">{formatAmount(salaryData.insurance_level)}</div>
//                   <div className="insurance-grade">({salaryData.insurance_grade})</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// SalaryStructure.displayName = 'SalaryStructure';

// export default SalaryStructure;
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// 🔥 引入 API_BASE_URL 配置
import { API_BASE_URL } from '../../../../config';
import './Salary_structure.css';
// 引入圖片
import IncreaseIcon from '../icon/Increase.png';
import ReduceIcon from '../icon/reduce.png';

const SalaryStructure = forwardRef(({ employee, isEditing }, ref) => {
  // 薪資結構狀態
  const [salaryData, setSalaryData] = useState({
    base_salary: 0,
    food_allowance: 0,
    basic_additions: [],
    total_salary: 0,
    insurance_level: 0,
    insurance_grade: ''
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // 投保級距對照表
  const insuranceLevels = [
    { level: 1, amount: 25200, grade: '第一級' },
    { level: 2, amount: 26400, grade: '第二級' },
    { level: 3, amount: 27600, grade: '第三級' },
    { level: 4, amount: 28800, grade: '第四級' },
    { level: 5, amount: 33000, grade: '第五級' },
    { level: 6, amount: 36300, grade: '第六級' },
    { level: 7, amount: 38200, grade: '第七級' },
    { level: 8, amount: 40100, grade: '第八級' },
    { level: 9, amount: 42000, grade: '第九級' },
    { level: 10, amount: 43900, grade: '第十級' }
  ];

  // 格式化金額顯示
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('zh-TW').format(amount || 0);
  };

  // 初始化數據
  useEffect(() => {
    if (employee) {
      const basicAdditions = employee.basic_additions || [];
      // 如果沒有基本加項，初始化一個空的加項
      const initialAdditions = basicAdditions.length > 0 ? basicAdditions : [{ name: '', amount: 0 }];
      
      setSalaryData({
        base_salary: employee.base_salary || 0,
        food_allowance: employee.food_allowance || 0,
        basic_additions: initialAdditions,
        total_salary: employee.total_salary || 0,
        insurance_level: employee.insurance_level || 0,
        insurance_grade: employee.insurance_grade || ''
      });
    } else {
      // 如果沒有員工資料，也初始化一個空的基本加項
      setSalaryData({
        base_salary: 0,
        food_allowance: 0,
        basic_additions: [{ name: '', amount: 0 }],
        total_salary: 0,
        insurance_level: 0,
        insurance_grade: ''
      });
    }
  }, [employee]);

  // 計算全薪
  const calculateTotalSalary = (baseSalary, foodAllowance, basicAdditions) => {
    const additionsTotal = basicAdditions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    return (parseFloat(baseSalary) || 0) + (parseFloat(foodAllowance) || 0) + additionsTotal;
  };

  // 計算投保級距
  const calculateInsuranceLevel = (totalSalary) => {
    const salary = parseFloat(totalSalary) || 0;
    
    for (let i = 0; i < insuranceLevels.length; i++) {
      if (salary <= insuranceLevels[i].amount) {
        return {
          level: insuranceLevels[i].amount,
          grade: insuranceLevels[i].grade
        };
      }
    }
    
    const highest = insuranceLevels[insuranceLevels.length - 1];
    return {
      level: highest.amount,
      grade: highest.grade
    };
  };

  // 更新薪資數據
  const updateSalaryData = (newData) => {
    const total = calculateTotalSalary(newData.base_salary, newData.food_allowance, newData.basic_additions);
    const insurance = calculateInsuranceLevel(total);
    
    setSalaryData({
      ...newData,
      total_salary: total,
      insurance_level: insurance.level,
      insurance_grade: insurance.grade
    });
  };

  // 處理本薪變更
  const handleBaseSalaryChange = (value) => {
    const newData = { ...salaryData, base_salary: parseFloat(value) || 0 };
    updateSalaryData(newData);
  };

  // 處理伙食津貼變更
  const handleFoodAllowanceChange = (value) => {
    const newData = { ...salaryData, food_allowance: parseFloat(value) || 0 };
    updateSalaryData(newData);
  };

  // 處理基本加項變更
  const handleBasicAdditionChange = (index, field, value) => {
    const newAdditions = [...salaryData.basic_additions];
    newAdditions[index] = { ...newAdditions[index], [field]: value };
    
    if (field === 'amount') {
      newAdditions[index].amount = parseFloat(value) || 0;
    }
    
    const newData = { ...salaryData, basic_additions: newAdditions };
    updateSalaryData(newData);
  };

  // 新增基本加項
  const addBasicAddition = () => {
    const newAdditions = [...salaryData.basic_additions, { name: '', amount: 0 }];
    const newData = { ...salaryData, basic_additions: newAdditions };
    updateSalaryData(newData);
  };

  // 刪除基本加項
  const removeBasicAddition = (index) => {
    // 如果只有一個項目，不刪除，只清空內容
    if (salaryData.basic_additions.length === 1) {
      const newAdditions = [{ name: '', amount: 0 }];
      const newData = { ...salaryData, basic_additions: newAdditions };
      updateSalaryData(newData);
    } else {
      // 如果有多個項目，才真正刪除
      const newAdditions = salaryData.basic_additions.filter((_, i) => i !== index);
      const newData = { ...salaryData, basic_additions: newAdditions };
      updateSalaryData(newData);
    }
  };

  // 保存薪資結構
  const saveSalaryStructure = async () => {
    if (!employee?.employee_id) {
      return { success: false, message: '員工ID不存在' };
    }

    setSaving(true);
    setErrors({});

    try {
      const companyId = Cookies.get('company_id') || '76014406';
      
      // 過濾掉空的基本加項
      const filteredAdditions = salaryData.basic_additions.filter(
        addition => addition.name.trim() !== '' || (addition.amount && addition.amount > 0)
      );
      
      const updateData = {
        base_salary: salaryData.base_salary,
        food_allowance: salaryData.food_allowance,
        basic_additions: filteredAdditions,
        total_salary: salaryData.total_salary,
        insurance_level: salaryData.insurance_level,
        insurance_grade: salaryData.insurance_grade,
        updated_by: 'admin'
      };

      console.log('🔄 準備發送薪資結構資料:', updateData);

      // 🔥 使用 API_BASE_URL 替換硬編碼的 URL
      const response = await axios.put(
        `${API_BASE_URL}/api/employees/${companyId}/${employee.employee_id}/salary`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000
        }
      );

      if (response.data && response.data.Status === 'Ok') {
        console.log('✅ 薪資結構更新成功');
        return { success: true, message: '薪資結構更新成功', updatedData: response.data.Data };
      } else {
        console.error('❌ 薪資結構更新失敗:', response.data?.Msg);
        return { success: false, message: response.data?.Msg || '薪資結構更新失敗' };
      }
    } catch (error) {
      console.error('❌ 薪資結構更新失敗:', error);
      return { success: false, message: error.message || '薪資結構更新失敗' };
    } finally {
      setSaving(false);
    }
  };

  // 暴露給父組件的方法
  useImperativeHandle(ref, () => ({
    saveSalaryStructure
  }));

  // 渲染基本加項
  const renderBasicAdditions = () => {
    // 確保至少有一個基本加項
    const additions = salaryData.basic_additions.length > 0 ? salaryData.basic_additions : [{ name: '', amount: 0 }];
    
    return additions.map((addition, index) => (
      <div key={index} className="basic-addition-item">
        <div className="basic-addition-content">
          <div className="basic-addition-label-area">
            <div className="salary-label">基本加項</div>
            <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
          </div>
          <div className="basic-addition-input-area">
            <input
              type="text"
              value={addition.name || ''}
              onChange={(e) => handleBasicAdditionChange(index, 'name', e.target.value)}
              className="addition-name-input"
              placeholder="加項名稱"
            />
            <input
              type="number"
              value={addition.amount || ''}
              onChange={(e) => handleBasicAdditionChange(index, 'amount', e.target.value)}
              className="addition-amount-input"
              placeholder="輸入金額"
              min="0"
            />
            <div className="button-area">
              <button
                type="button"
                onClick={() => removeBasicAddition(index)}
                className="remove-addition-btn"
                title="刪除此項目"
              >
                <img src={ReduceIcon} alt="刪除" className="button-icon" />
              </button>
              <button
                type="button"
                onClick={addBasicAddition}
                className="add-addition-btn"
                title="新增項目"
              >
                <img src={IncreaseIcon} alt="新增" className="button-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="salary-structure-container">
      <div className="salary-structure-content">
        {/* 本薪 - 最大框框，只有輸入框 */}
        <div className="salary-item base-salary">
          <div className="salary-item-content">
            <div className="salary-label-area">
              <div className="salary-label">本薪</div>
            </div>
            <div className="salary-input-area">
              <input
                type="number"
                value={salaryData.base_salary || ''}
                onChange={(e) => handleBaseSalaryChange(e.target.value)}
                className="salary-input"
                placeholder="輸入金額"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* 薪資結構細項 - 包含藍色線條和所有子項目 */}
        <div className="salary-structure-details">
          <div className="blue-vertical-line"></div>
          <div className="salary-structure-inner">
            {/* 伙食津貼 */}
            <div className="salary-item sub-item">
              <div className="salary-item-content">
                <div className="salary-label-area">
                  <div className="salary-label">伙食津貼</div>
                  <div className="salary-description">在此輸入金額將會自動加入每月計算當中</div>
                </div>
                <div className="salary-input-area">
                  <input
                    type="number"
                    value={salaryData.food_allowance || ''}
                    onChange={(e) => handleFoodAllowanceChange(e.target.value)}
                    className="salary-input"
                    placeholder="輸入金額"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* 基本加項容器 */}
            <div className="basic-additions-container">
              {renderBasicAdditions()}
            </div>

            {/* 全薪 - 在藍色線內 */}
            <div className="salary-item total-salary">
              <div className="salary-item-content">
                <div className="salary-label-area">
                  <div className="salary-label">全薪(以月計算)</div>
                </div>
                <div className="salary-input-area">
                  <div className="salary-display">
                    {formatAmount(salaryData.total_salary)}
                  </div>
                </div>
              </div>
            </div>

            {/* 投保級距 - 在藍色線內 */}
            <div className="salary-item insurance-level">
              <div className="salary-item-content">
                <div className="salary-label-area">
                  <div className="salary-label">投保級距</div>
                  <div className="salary-description">(自動計算)</div>
                </div>
                <div className="insurance-display">
                  <div className="insurance-amount">{formatAmount(salaryData.insurance_level)}</div>
                  <div className="insurance-grade">({salaryData.insurance_grade})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SalaryStructure.displayName = 'SalaryStructure';

export default SalaryStructure;
