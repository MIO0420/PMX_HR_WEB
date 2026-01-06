// SchedulingSystem/ExportPDF.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getLocalDateString, getShiftColor, calculateWorkHours, getMonthWeeks, calculateWeeklyHours } from './ScheduleFunction';

// ✅ 添加中文字體支援函數
const addChineseFontSupport = (pdf) => {
  // 使用 jsPDF 內建的字體，設定為支援 Unicode
  pdf.setFont('helvetica');
  
  // 如果需要更好的中文支援，可以考慮載入中文字體
  // 但這需要額外的字體檔案，會增加檔案大小
};

// ✅ 安全的中文文字輸出函數
const safeText = (pdf, text, x, y, options = {}) => {
  try {
    // 確保文字是字串
    const safeTextContent = String(text || '');
    pdf.text(safeTextContent, x, y, options);
  } catch (error) {
    console.warn('文字輸出警告:', error);
    // 如果中文輸出失敗，使用英文替代
    const fallbackText = text.replace(/[\u4e00-\u9fff]/g, '?');
    pdf.text(fallbackText, x, y, options);
  }
};

// 匯出PDF函數
export const exportScheduleToPDF = async (
  selectedYear,
  selectedMonth,
  currentClassMonthName,
  employees,
  schedules,
  shiftTypes,
  department
) => {
  try {
    console.log('🖨️ 開始匯出PDF...');
    
    // 創建PDF文檔
    const pdf = new jsPDF({
      orientation: 'landscape', // 橫向
      unit: 'mm',
      format: 'a4'
    });

    // ✅ 添加中文字體支援
    addChineseFontSupport(pdf);
    
    // 獲取月份資料
    const monthWeeks = getMonthWeeks(selectedYear, selectedMonth);
    const monthStartDate = getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1));
    const monthEndDate = getLocalDateString(new Date(selectedYear, selectedMonth, 0));
    
    // 標題
    const title = currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`;
    pdf.setFontSize(16);
    safeText(pdf, title, 148, 20, { align: 'center' });
    
    // 期間
    pdf.setFontSize(10);
    safeText(pdf, `班表期間：${monthStartDate} 至 ${monthEndDate}`, 148, 30, { align: 'center' });
    
    let yPosition = 45;
    const lineHeight = 8;
    const cellWidth = 35;
    const employeeNameWidth = 40;
    
    // 遍歷每週
    for (let weekIndex = 0; weekIndex < monthWeeks.length; weekIndex++) {
      const week = monthWeeks[weekIndex];
      
      // 檢查是否需要新頁面
      if (yPosition + (employees.length + 2) * lineHeight > 200) {
        pdf.addPage();
        addChineseFontSupport(pdf);
        yPosition = 20;
      }
      
      // 週分隔線
      if (weekIndex > 0) {
        yPosition += 5;
      }
      
      // 日期標題行
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      
      // 員工欄位標題
      safeText(pdf, '員工', 10, yPosition);
      
      // 日期標題
      let xPosition = 10 + employeeNameWidth;
      week.forEach((day, dayIndex) => {
        if (!day.isEmpty && day.isCurrentMonth) {
          const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
          const weekdayName = weekdayNames[day.weekday] || day.weekday;
          const dateText = `週${weekdayName} ${String(day.month).padStart(2, '0')}/${String(day.day).padStart(2, '0')}`;
          safeText(pdf, dateText, xPosition, yPosition, { align: 'center' });
        }
        xPosition += cellWidth;
      });
      
      yPosition += lineHeight;
      
      // 員工排班資料
      pdf.setFont('helvetica', 'normal');
      employees.forEach((employee, employeeIndex) => {
        // 員工姓名
        safeText(pdf, employee.name || '未知員工', 10, yPosition);
        
        // 週工時
        const weeklyHours = calculateWeeklyHours(employee.employee_id, week, schedules);
        safeText(pdf, `(${weeklyHours})`, 10 + employeeNameWidth - 15, yPosition);
        
        // 每日排班
        xPosition = 10 + employeeNameWidth;
        week.forEach((day, dayIndex) => {
          if (!day.isEmpty && day.isCurrentMonth) {
            const schedule = schedules[employee.employee_id] && schedules[employee.employee_id][day.date];
            
            if (schedule && schedule.shift_type_id) {
              // 有排班
              const shiftType = shiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
              const shiftName = schedule.shift_name || shiftType?.shift_name || shiftType?.shift_category || '班';
              
              // 時間範圍
              const timeRange = schedule.start_time && schedule.end_time ? 
                `${schedule.start_time.substring(0, 5)}-${schedule.end_time.substring(0, 5)}` : '';
              
              // 工時
              const workHours = calculateWorkHours(
                schedule.start_time, 
                schedule.end_time, 
                schedule.break_time_start,
                schedule.break_time_end
              );
              
              // 班別資訊
              pdf.setFontSize(8);
              safeText(pdf, shiftName, xPosition, yPosition - 2, { align: 'center' });
              if (timeRange) {
                safeText(pdf, timeRange, xPosition, yPosition + 2, { align: 'center' });
              }
              safeText(pdf, `${workHours}h`, xPosition, yPosition + 6, { align: 'center' });
            }
          }
          xPosition += cellWidth;
        });
        
        yPosition += lineHeight;
      });
      
      yPosition += 10; // 週間距
    }
    
    // 班別圖例
    if (shiftTypes.length > 0) {
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      safeText(pdf, '班別說明：', 10, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      
      shiftTypes.forEach((shift, index) => {
        const shiftName = shift.shift_name || shift.shift_category || '未知班別';
        const timeRange = shift.start_time && shift.end_time ? 
          `${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)}` : '';
        
        const legendText = `• ${shiftName}${timeRange ? ` (${timeRange})` : ''}`;
        safeText(pdf, legendText, 10, yPosition);
        yPosition += 6;
        
        // 檢查是否需要新頁面
        if (yPosition > 190) {
          pdf.addPage();
          addChineseFontSupport(pdf);
          yPosition = 20;
        }
      });
    }
    
    // 匯出日期
    const exportDate = getLocalDateString(new Date());
    pdf.setFontSize(8);
    safeText(pdf, `匯出日期：${exportDate}`, 10, 200);
    
    // 儲存PDF
    const fileName = `${title}_${exportDate}.pdf`;
    pdf.save(fileName);
    
    console.log('✅ PDF匯出完成');
    return { success: true, fileName };
    
  } catch (error) {
    console.error('❌ PDF匯出失敗:', error);
    return { success: false, error: error.message };
  }
};

// ✅ 修正：匯出詳細版PDF（接受物件參數）
export const exportDetailedScheduleToPDF = async (exportData) => {
  try {
    console.log('🖨️ 開始匯出詳細PDF...', exportData);
    
    // ✅ 從 exportData 物件中解構所需參數
    const {
      year: selectedYear,
      month: selectedMonth,
      title: currentClassMonthName,
      employees,
      schedules,
      shiftTypes,
      department,
      companyId,
      monthWeeks,
      dateRange
    } = exportData;
    
    // ✅ 檢查必要資料
    if (!employees || !Array.isArray(employees)) {
      throw new Error('員工資料無效');
    }
    
    if (!schedules || typeof schedules !== 'object') {
      throw new Error('排班資料無效');
    }
    
    if (!shiftTypes || !Array.isArray(shiftTypes)) {
      throw new Error('班別資料無效');
    }
    
    if (!monthWeeks || !Array.isArray(monthWeeks)) {
      throw new Error('月份週數據無效');
    }
    
    const pdf = new jsPDF({
      orientation: 'portrait', // 直向
      unit: 'mm',
      format: 'a4'
    });

    // ✅ 添加中文字體支援
    addChineseFontSupport(pdf);
    
    // 標題頁
    const title = currentClassMonthName || `${selectedYear}年${selectedMonth}月班表`;
    pdf.setFontSize(20);
    safeText(pdf, title, 105, 40, { align: 'center' });
    
    // 基本資訊
    pdf.setFontSize(12);
    const monthStartDate = dateRange?.start || getLocalDateString(new Date(selectedYear, selectedMonth - 1, 1));
    const monthEndDate = dateRange?.end || getLocalDateString(new Date(selectedYear, selectedMonth, 0));
    
    safeText(pdf, `期間：${monthStartDate} 至 ${monthEndDate}`, 105, 60, { align: 'center' });
    safeText(pdf, `部門：${department || '未指定'}`, 105, 70, { align: 'center' });
    safeText(pdf, `統編：${companyId || '未指定'}`, 105, 80, { align: 'center' });
    
    // 員工列表
    let yPosition = 100;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    safeText(pdf, '員工列表', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    employees.forEach((employee, index) => {
      const monthlyHours = calculateMonthlyHours(employee.employee_id, selectedYear, selectedMonth, schedules);
      safeText(pdf, `${index + 1}. ${employee.name || '未知員工'} - 月總工時：${monthlyHours}小時`, 25, yPosition);
      yPosition += 8;
      
      // 檢查是否需要新頁面
      if (yPosition > 250) {
        pdf.addPage();
        addChineseFontSupport(pdf);
        yPosition = 20;
      }
    });
    
    // 班別說明
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    safeText(pdf, '班別說明', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    shiftTypes.forEach((shift, index) => {
      const shiftName = shift.shift_name || shift.shift_category || '未知班別';
      const timeRange = shift.start_time && shift.end_time ? 
        `${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)}` : '';
      const frequency = shift.repeat_frequency && shift.repeat_frequency !== 'daily' ? 
        ` [${getFrequencyText(shift.repeat_frequency)}]` : '';
      
      safeText(pdf, `${index + 1}. ${shiftName}${timeRange ? ` (${timeRange})` : ''}${frequency}`, 25, yPosition);
      yPosition += 8;
      
      // 檢查是否需要新頁面
      if (yPosition > 250) {
        pdf.addPage();
        addChineseFontSupport(pdf);
        yPosition = 20;
      }
    });
    
    // 新頁面 - 詳細排班表
    pdf.addPage();
    addChineseFontSupport(pdf);
    
    // ✅ 在新頁面添加排班表標題
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    safeText(pdf, '詳細排班表', 105, 20, { align: 'center' });
    
    // ✅ 添加簡化的排班表內容到當前PDF
    await addScheduleTableToPDF(pdf, {
      selectedYear,
      selectedMonth,
      currentClassMonthName,
      employees,
      schedules,
      shiftTypes,
      department,
      monthWeeks
    });
    
    const fileName = `${title}_詳細版_${getLocalDateString(new Date())}.pdf`;
    pdf.save(fileName);
    
    console.log('✅ 詳細PDF匯出完成');
    return { success: true, fileName };
    
  } catch (error) {
    console.error('❌ 詳細PDF匯出失敗:', error);
    return { success: false, error: error.message };
  }
};

// ✅ 新增：將排班表添加到PDF的函數
const addScheduleTableToPDF = async (pdf, data) => {
  const { selectedYear, selectedMonth, employees, schedules, shiftTypes, monthWeeks } = data;
  
  let yPosition = 35;
  const lineHeight = 8;
  const cellWidth = 25; // 縮小格子寬度以適應直向頁面
  const employeeNameWidth = 30;
  
  // 遍歷每週
  for (let weekIndex = 0; weekIndex < monthWeeks.length; weekIndex++) {
    const week = monthWeeks[weekIndex];
    
    // 檢查是否需要新頁面
    if (yPosition + (employees.length + 2) * lineHeight > 250) {
      pdf.addPage();
      addChineseFontSupport(pdf);
      yPosition = 20;
    }
    
    // 週分隔線
    if (weekIndex > 0) {
      yPosition += 5;
    }
    
    // 日期標題行
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    
    // 員工欄位標題
    safeText(pdf, '員工', 10, yPosition);
    
    // 日期標題
    let xPosition = 10 + employeeNameWidth;
    week.forEach((day, dayIndex) => {
      if (!day.isEmpty && day.isCurrentMonth) {
        const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
        const weekdayName = weekdayNames[day.weekday] || day.weekday;
        const dateText = `${weekdayName}${String(day.day).padStart(2, '0')}`;
        safeText(pdf, dateText, xPosition, yPosition, { align: 'center' });
      }
      xPosition += cellWidth;
    });
    
    yPosition += lineHeight;
    
    // 員工排班資料
    pdf.setFont('helvetica', 'normal');
    employees.forEach((employee, employeeIndex) => {
      // 員工姓名
      safeText(pdf, employee.name || '未知', 10, yPosition);
      
      // 每日排班
      xPosition = 10 + employeeNameWidth;
      week.forEach((day, dayIndex) => {
        if (!day.isEmpty && day.isCurrentMonth) {
          const schedule = schedules[employee.employee_id] && schedules[employee.employee_id][day.date];
          
          if (schedule && schedule.shift_type_id) {
            // 有排班
            const shiftType = shiftTypes.find(s => s.shift_type_id === schedule.shift_type_id);
            const shiftName = schedule.shift_name || shiftType?.shift_name || shiftType?.shift_category || '班';
            
            // 只顯示班別名稱（簡化版）
            pdf.setFontSize(7);
            safeText(pdf, shiftName.substring(0, 3), xPosition, yPosition, { align: 'center' });
          }
        }
        xPosition += cellWidth;
      });
      
      yPosition += lineHeight;
    });
    
    yPosition += 5; // 週間距
  }
};

// 計算月總工時
const calculateMonthlyHours = (employeeId, year, month, schedules) => {
  if (!schedules[employeeId]) return '0';
  
  let totalHours = 0;
  const monthWeeks = getMonthWeeks(year, month);
  
  monthWeeks.forEach(week => {
    week.forEach(day => {
      if (day.isCurrentMonth && schedules[employeeId] && schedules[employeeId][day.date]) {
        const schedule = schedules[employeeId][day.date];
        const hours = parseFloat(calculateWorkHours(
          schedule.start_time,
          schedule.end_time,
          schedule.break_time_start,
          schedule.break_time_end
        ));
        totalHours += hours;
      }
    });
  });
  
  return totalHours.toFixed(1);
};

// 獲取頻率文字
const getFrequencyText = (frequency) => {
  switch (frequency) {
    case 'weekdays': return '平日';
    case 'holiday': return '假日';
    case 'weekly': return '每週';
    case 'monthly': return '每月';
    default: return '每日';
  }
};
