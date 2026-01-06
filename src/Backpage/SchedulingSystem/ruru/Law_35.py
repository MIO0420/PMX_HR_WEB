from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from collections import defaultdict
import json

class Law35Checker:
    """勞動基準法第35條 - 繼續工作4小時休息30分鐘檢查器（API格式版本）"""
    
    def __init__(self):
        self.CONTINUOUS_WORK_LIMIT = 4  # 繼續工作4小時
        self.MIN_REST_TIME = 30  # 至少休息30分鐘
        self.WORK_DAY_HOURS = 8  # 一般工作日時數
        
        # 預設班別時間設定（包含休息時間安排）
        self.shift_schedules = {
            "早班": {
                "開始": "08:00", 
                "結束": "17:00", 
                "休息安排": [
                    {"開始": "12:00", "結束": "13:00", "時長": 60}  # 午休1小時
                ]
            },
            "中班": {
                "開始": "16:00", 
                "結束": "01:00", 
                "休息安排": [
                    {"開始": "20:00", "結束": "20:30", "時長": 30}  # 晚餐休息30分鐘
                ]
            },
            "夜班": {
                "開始": "00:00", 
                "結束": "09:00", 
                "休息安排": [
                    {"開始": "04:00", "結束": "04:30", "時長": 30}  # 夜間休息30分鐘
                ]
            },
            "白班": {
                "開始": "09:00", 
                "結束": "18:00", 
                "休息安排": [
                    {"開始": "12:30", "結束": "13:30", "時長": 60}  # 午休1小時
                ]
            },
            "大夜": {
                "開始": "22:00", 
                "結束": "07:00", 
                "休息安排": [
                    {"開始": "02:00", "結束": "02:30", "時長": 30}  # 夜間休息30分鐘
                ]
            },
            "小夜": {
                "開始": "14:00", 
                "結束": "23:00", 
                "休息安排": [
                    {"開始": "18:00", "結束": "18:30", "時長": 30}  # 晚餐休息30分鐘
                ]
            },
            "加班早班": {
                "開始": "08:00", 
                "結束": "20:00", 
                "休息安排": [
                    {"開始": "12:00", "結束": "13:00", "時長": 60},  # 午休1小時
                    {"開始": "17:00", "結束": "17:30", "時長": 30}   # 加班前休息30分鐘
                ]
            },
            "延長白班": {
                "開始": "09:00", 
                "結束": "21:00", 
                "休息安排": [
                    {"開始": "12:30", "結束": "13:30", "時長": 60},  # 午休1小時
                    {"開始": "18:00", "結束": "18:30", "時長": 30}   # 加班前休息30分鐘
                ]
            },
            "日班": {
                "開始": "09:00", 
                "結束": "18:00", 
                "休息安排": [
                    {"開始": "12:30", "結束": "13:30", "時長": 60}  # 午休1小時
                ]
            },
            "晚班": {
                "開始": "12:00", 
                "結束": "21:00", 
                "休息安排": [
                    {"開始": "16:00", "結束": "16:30", "時長": 30}  # 休息30分鐘
                ]
            },
            "無休息班": {
                "開始": "08:00", 
                "結束": "17:00", 
                "休息安排": []  # 無休息時間 - 違法
            },
            "短休息班": {
                "開始": "08:00", 
                "結束": "17:00", 
                "休息安排": [
                    {"開始": "12:00", "結束": "12:15", "時長": 15}  # 僅15分鐘休息 - 違法
                ]
            }
        }
    
    def add_shift_schedule(self, shift_name: str, start_time: str, end_time: str, 
                          rest_periods: List[Dict]):
        """
        新增或修改班別時間設定
        rest_periods 格式: [{"開始": "12:00", "結束": "13:00", "時長": 60}]
        """
        self.shift_schedules[shift_name] = {
            "開始": start_time,
            "結束": end_time,
            "休息安排": rest_periods
        }
    
    def convert_api_format_to_internal(self, api_data: List[Dict]) -> List[Dict]:
        """
        將 API 格式轉換為內部處理格式
        
        API 格式:
        {
            "company_id": "公司ID",
            "employee_id": "員工ID", 
            "shift_type_id": "班別類型ID",
            "start_date": "2025-10-30",
            "end_date": "2025-10-30", 
            "month": 10,
            "year": 2025,
            "department": "部門名稱"
        }
        
        轉換為內部格式:
        {
            "員工編號": "員工ID",
            "日期": "2025-10-30", 
            "班別": "班別名稱"
        }
        """
        internal_data = []
        
        # 班別 ID 對應表（您可以根據實際情況調整）
        shift_id_mapping = {
            "day_shift": "日班",
            "night_shift": "晚班",
            "early_shift": "早班",
            "middle_shift": "中班",
            "late_shift": "夜班",
            "white_shift": "白班",
            "big_night": "大夜",
            "small_night": "小夜",
            "overtime_early": "加班早班",
            "extended_white": "延長白班",
            "no_rest": "無休息班",
            "short_rest": "短休息班",
            "日班": "日班",
            "晚班": "晚班",
            "早班": "早班",
            "中班": "中班",
            "夜班": "夜班",
            "白班": "白班",
            "大夜": "大夜",
            "小夜": "小夜",
            "加班早班": "加班早班",
            "延長白班": "延長白班",
            "無休息班": "無休息班",
            "短休息班": "短休息班",
            # 可以添加更多對應關係
        }
        
        for record in api_data:
            # 取得班別名稱
            shift_type_id = record.get("shift_type_id", "")
            shift_name = shift_id_mapping.get(shift_type_id, shift_type_id)
            
            # 如果 start_date 和 end_date 相同（單日排班）
            if record.get("start_date") == record.get("end_date"):
                internal_record = {
                    "員工編號": record.get("employee_id"),
                    "日期": record.get("start_date"),
                    "班別": shift_name,
                    "公司ID": record.get("company_id"),
                    "部門": record.get("department")
                }
                internal_data.append(internal_record)
            else:
                # 處理多日排班（如果需要）
                start_date = datetime.strptime(record.get("start_date"), "%Y-%m-%d")
                end_date = datetime.strptime(record.get("end_date"), "%Y-%m-%d")
                
                current_date = start_date
                while current_date <= end_date:
                    internal_record = {
                        "員工編號": record.get("employee_id"),
                        "日期": current_date.strftime("%Y-%m-%d"),
                        "班別": shift_name,
                        "公司ID": record.get("company_id"),
                        "部門": record.get("department")
                    }
                    internal_data.append(internal_record)
                    current_date += timedelta(days=1)
        
        return internal_data
    
    def check_api_data(self, api_data: List[Dict]) -> Dict:
        """
        直接檢查 API 格式的排班資料
        
        api_data: API 格式的排班資料列表
        """
        if not api_data:
            return {"錯誤": "無排班資料"}
        
        # 轉換 API 格式為內部格式
        internal_data = self.convert_api_format_to_internal(api_data)
        
        if not internal_data:
            return {"錯誤": "轉換後無有效排班資料"}
        
        # 使用現有的批量檢查功能
        return self.batch_check(internal_data)
    
    def parse_time(self, time_str: str) -> datetime:
        """解析時間字串 (格式: HH:MM)"""
        try:
            return datetime.strptime(time_str, "%H:%M")
        except ValueError:
            raise ValueError(f"時間格式錯誤: {time_str}，請使用 HH:MM 格式")
    
    def parse_datetime(self, date_str: str, time_str: str) -> datetime:
        """解析日期時間"""
        return datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    
    def get_work_periods(self, date: str, shift_name: str) -> List[Dict]:
        """計算班別的實際工作時段（扣除休息時間）"""
        if shift_name not in self.shift_schedules:
            raise ValueError(f"未知班別: {shift_name}")
        
        shift_info = self.shift_schedules[shift_name]
        shift_start = self.parse_datetime(date, shift_info["開始"])
        shift_end = self.parse_datetime(date, shift_info["結束"])
        
        # 處理跨日情況
        if shift_end <= shift_start:
            shift_end += timedelta(days=1)
        
        # 建立休息時間列表
        rest_periods = []
        for rest in shift_info["休息安排"]:
            rest_start = self.parse_datetime(date, rest["開始"])
            rest_end = self.parse_datetime(date, rest["結束"])
            
            # 處理跨日休息時間
            if rest_start < shift_start:
                rest_start += timedelta(days=1)
            if rest_end < rest_start:
                rest_end += timedelta(days=1)
            
            rest_periods.append({
                "開始": rest_start,
                "結束": rest_end,
                "時長": rest["時長"]
            })
        
        # 按時間排序休息時間
        rest_periods.sort(key=lambda x: x["開始"])
        
        # 計算工作時段
        work_periods = []
        current_work_start = shift_start
        
        for rest in rest_periods:
            if current_work_start < rest["開始"]:
                # 休息前的工作時段
                work_periods.append({
                    "開始": current_work_start,
                    "結束": rest["開始"],
                    "時長": (rest["開始"] - current_work_start).total_seconds() / 3600
                })
            current_work_start = rest["結束"]
        
        # 最後一段工作時間
        if current_work_start < shift_end:
            work_periods.append({
                "開始": current_work_start,
                "結束": shift_end,
                "時長": (shift_end - current_work_start).total_seconds() / 3600
            })
        
        return {
            "班別": shift_name,
            "班別開始": shift_start,
            "班別結束": shift_end,
            "工作時段": work_periods,
            "休息時段": rest_periods,
            "總工作時數": sum(period["時長"] for period in work_periods),
            "總休息時數": sum(rest["時長"] for rest in rest_periods) / 60
        }
    
    def check_continuous_work_rule(self, work_periods: List[Dict]) -> List[Dict]:
        """檢查是否違反繼續工作4小時須休息30分鐘規定"""
        violations = []
        
        for i, period in enumerate(work_periods):
            work_hours = period["時長"]
            
            # 檢查單一工作時段是否超過4小時
            if work_hours > self.CONTINUOUS_WORK_LIMIT:
                violations.append({
                    "工作時段": i + 1,
                    "開始時間": period["開始"].strftime("%H:%M"),
                    "結束時間": period["結束"].strftime("%H:%M"),
                    "工作時長": round(work_hours, 2),
                    "違法類型": "單一工作時段超過4小時",
                    "違法情況": f"連續工作{work_hours:.1f}小時，超過法定4小時限制",
                    "超時時數": round(work_hours - self.CONTINUOUS_WORK_LIMIT, 2)
                })
        
        return violations
    
    def check_rest_time_adequacy(self, rest_periods: List[Dict]) -> List[Dict]:
        """檢查休息時間是否充足（至少30分鐘）"""
        violations = []
        
        for i, rest in enumerate(rest_periods):
            if rest["時長"] < self.MIN_REST_TIME:
                violations.append({
                    "休息時段": i + 1,
                    "開始時間": rest["開始"].strftime("%H:%M"),
                    "結束時間": rest["結束"].strftime("%H:%M"),
                    "休息時長": rest["時長"],
                    "違法類型": "休息時間不足",
                    "違法情況": f"休息時間{rest['時長']}分鐘，不足法定30分鐘",
                    "不足時數": self.MIN_REST_TIME - rest["時長"]
                })
        
        return violations
    
    def check_single_shift(self, employee_id: str, date: str, shift_name: str) -> Dict:
        """檢查單一班別是否符合第35條規定"""
        
        if shift_name not in self.shift_schedules:
            return {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "錯誤": f"未知班別: {shift_name}，僅支援：{', '.join(self.shift_schedules.keys())}"
            }
        
        try:
            work_info = self.get_work_periods(date, shift_name)
            
            # 檢查連續工作時間違法
            work_violations = self.check_continuous_work_rule(work_info["工作時段"])
            
            # 檢查休息時間充足性
            rest_violations = self.check_rest_time_adequacy(work_info["休息時段"])
            
            # 合併所有違法情況
            all_violations = work_violations + rest_violations
            
            result = {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "班別時間": f"{self.shift_schedules[shift_name]['開始']} - {self.shift_schedules[shift_name]['結束']}",
                "總工作時數": round(work_info["總工作時數"], 2),
                "總休息時數": round(work_info["總休息時數"], 2),
                "工作時段數": len(work_info["工作時段"]),
                "休息時段數": len(work_info["休息時段"]),
                "是否合法": len(all_violations) == 0,
                "違法項目數": len(all_violations),
                "違法詳情": all_violations,
                "工作時段明細": [
                    {
                        "時段": i + 1,
                        "時間": f"{period['開始'].strftime('%H:%M')} - {period['結束'].strftime('%H:%M')}",
                        "時長": round(period["時長"], 2),
                        "是否超時": period["時長"] > self.CONTINUOUS_WORK_LIMIT
                    }
                    for i, period in enumerate(work_info["工作時段"])
                ],
                "休息時段明細": [
                    {
                        "時段": i + 1,
                        "時間": f"{rest['開始'].strftime('%H:%M')} - {rest['結束'].strftime('%H:%M')}",
                        "時長": rest["時長"],
                        "是否充足": rest["時長"] >= self.MIN_REST_TIME
                    }
                    for i, rest in enumerate(work_info["休息時段"])
                ]
            }
            
            return result
            
        except Exception as e:
            return {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "錯誤": str(e)
            }
    
    def check_employee_shifts(self, shift_records: List[Dict]) -> Dict:
        """
        檢查員工班別排班是否符合第35條規定
        
        shift_records 格式:
        [
            {"員工編號": "E001", "日期": "2024-01-01", "班別": "早班"},
            {"員工編號": "E001", "日期": "2024-01-02", "班別": "夜班"},
            ...
        ]
        """
        
        if not shift_records:
            return {"錯誤": "無排班資料"}
        
        employee_id = shift_records[0]["員工編號"]
        
        # 按員工分組並按日期排序
        employee_shifts = defaultdict(list)
        for record in shift_records:
            emp_id = record["員工編號"]
            employee_shifts[emp_id].append(record)
        
        # 只處理指定員工的資料
        if employee_id not in employee_shifts:
            return {"錯誤": f"找不到員工 {employee_id} 的排班資料"}
        
        shifts = sorted(employee_shifts[employee_id], key=lambda x: x["日期"])
        
        # 檢查每日班別
        daily_results = []
        for shift_record in shifts:
            daily_result = self.check_single_shift(
                shift_record["員工編號"],
                shift_record["日期"],
                shift_record["班別"]
            )
            daily_results.append(daily_result)
        
        # 統計違法情況
        violations = []
        total_overtime_hours = 0
        total_insufficient_rest = 0
        
        for daily in daily_results:
            if "錯誤" in daily:
                violations.append(f"{daily['日期']}: {daily['錯誤']}")
            elif not daily["是否合法"]:
                for violation in daily["違法詳情"]:
                    violation_desc = f"{daily['日期']} {daily['班別']}: {violation['違法情況']}"
                    violations.append(violation_desc)
                    
                    if violation["違法類型"] == "單一工作時段超過4小時":
                        total_overtime_hours += violation["超時時數"]
                    elif violation["違法類型"] == "休息時間不足":
                        total_insufficient_rest += violation["不足時數"]
        
        # 整體統計
        work_period_stats = self._calculate_work_period_statistics(daily_results)
        rest_period_stats = self._calculate_rest_period_statistics(daily_results)
        
        # 整體結果
        result = {
            "員工編號": employee_id,
            "檢查期間": f"{shifts[0]['日期']} ~ {shifts[-1]['日期']}",
            "總排班天數": len(shifts),
            "整體合法性": len(violations) == 0,
            "違法項目數": len(violations),
            "違法詳情": violations,
            "總超時工作時數": round(total_overtime_hours, 2),
            "總不足休息時數": round(total_insufficient_rest / 60, 2),  # 轉換為小時
            "每日班別檢查": daily_results,
            "工作時段統計": work_period_stats,
            "休息時段統計": rest_period_stats
        }
        
        return result
    
    def _calculate_work_period_statistics(self, daily_results: List[Dict]) -> Dict:
        """計算工作時段統計"""
        stats = {
            "總工作時段數": 0,
            "超時工作時段數": 0,
            "最長工作時段": 0,
            "平均工作時段長度": 0,
            "超時比例": "0%"
        }
        
        all_work_periods = []
        overtime_periods = 0
        
        for daily in daily_results:
            if "錯誤" not in daily and "工作時段明細" in daily:
                for period in daily["工作時段明細"]:
                    all_work_periods.append(period["時長"])
                    if period["是否超時"]:
                        overtime_periods += 1
        
        if all_work_periods:
            stats["總工作時段數"] = len(all_work_periods)
            stats["超時工作時段數"] = overtime_periods
            stats["最長工作時段"] = round(max(all_work_periods), 2)
            stats["平均工作時段長度"] = round(sum(all_work_periods) / len(all_work_periods), 2)
            stats["超時比例"] = f"{(overtime_periods / len(all_work_periods) * 100):.1f}%"
        
        return stats
    
    def _calculate_rest_period_statistics(self, daily_results: List[Dict]) -> Dict:
        """計算休息時段統計"""
        stats = {
            "總休息時段數": 0,
            "不足休息時段數": 0,
            "最短休息時段": 0,
            "平均休息時段長度": 0,
            "不足比例": "0%"
        }
        
        all_rest_periods = []
        insufficient_periods = 0
        
        for daily in daily_results:
            if "錯誤" not in daily and "休息時段明細" in daily:
                for period in daily["休息時段明細"]:
                    all_rest_periods.append(period["時長"])
                    if not period["是否充足"]:
                        insufficient_periods += 1
        
        if all_rest_periods:
            stats["總休息時段數"] = len(all_rest_periods)
            stats["不足休息時段數"] = insufficient_periods
            stats["最短休息時段"] = min(all_rest_periods)
            stats["平均休息時段長度"] = round(sum(all_rest_periods) / len(all_rest_periods), 1)
            stats["不足比例"] = f"{(insufficient_periods / len(all_rest_periods) * 100):.1f}%"
        
        return stats
    
    def generate_compliance_report(self, shift_data: List[Dict]) -> Dict:
        """生成第35條合規報告"""
        
        batch_result = self.batch_check(shift_data)
        
        # 統計各類違法情況
        violation_types = defaultdict(int)
        total_overtime_hours = 0
        total_insufficient_rest = 0
        
        for emp_id, emp_result in batch_result["個別檢查結果"].items():
            if not emp_result.get("整體合法性", True):
                total_overtime_hours += emp_result.get("總超時工作時數", 0)
                total_insufficient_rest += emp_result.get("總不足休息時數", 0)
                
                for violation in emp_result.get("違法詳情", []):
                    if "連續工作" in violation:
                        violation_types["連續工作超過4小時"] += 1
                    elif "休息時間" in violation:
                        violation_types["休息時間不足30分鐘"] += 1
        
        # 生成改善建議
        suggestions = self._generate_improvement_suggestions(batch_result)
        
        report = {
            "報告生成時間": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "檢查法條": "勞動基準法第35條",
            "法條內容": "勞工繼續工作四小時，至少應有三十分鐘之休息。",
            "檢查摘要": {
                "檢查員工數": batch_result["檢查員工數"],
                "違法員工數": batch_result["違法員工數"],
                "合規率": batch_result["整體合規率"],
                "總超時工作時數": round(total_overtime_hours, 2),
                "總不足休息時數": round(total_insufficient_rest, 2)
            },
            "違法類型統計": dict(violation_types),
            "改善建議": suggestions,
            "詳細檢查結果": batch_result["個別檢查結果"]
        }
        
        return report
    
    def _generate_improvement_suggestions(self, batch_result: Dict) -> List[str]:
        """生成改善建議"""
        suggestions = []
        
        violation_count = batch_result["違法員工數"]
        total_employees = batch_result["檢查員工數"]
        
        if violation_count > 0:
            suggestions.append(f"建議檢視{violation_count}名員工的班別安排，確保符合第35條規定")
            
            # 分析常見違法模式
            continuous_work_violations = 0
            insufficient_rest_violations = 0
            
            for emp_result in batch_result["個別檢查結果"].values():
                for violation in emp_result.get("違法詳情", []):
                    if "連續工作" in violation:
                        continuous_work_violations += 1
                    elif "休息時間" in violation:
                        insufficient_rest_violations += 1
            
            if continuous_work_violations > 0:
                suggestions.append(
                    f"發現{continuous_work_violations}項連續工作超過4小時的違法情況，"
                    "建議重新安排工作時段，確保每4小時有適當休息"
                )
            
            if insufficient_rest_violations > 0:
                suggestions.append(
                    f"發現{insufficient_rest_violations}項休息時間不足30分鐘的違法情況，"
                    "建議延長休息時間至法定標準"
                )
            
            # 合規率建議
            compliance_rate = (total_employees - violation_count) / total_employees * 100
            if compliance_rate < 80:
                suggestions.append("整體合規率偏低，建議全面檢討班別休息時間安排制度")
            elif compliance_rate < 95:
                suggestions.append("建議加強班別管理，提升整體合規水準")
        else:
            suggestions.append("所有員工班別安排均符合第35條規定，請持續維持良好的休息時間管理")
        
        return suggestions
    
    def export_violation_details(self, shift_data: List[Dict], format_type: str = "summary") -> Dict:
        """匯出違法詳情"""
        
        batch_result = self.batch_check(shift_data)
        
        if format_type == "summary":
            # 摘要格式
            violations_summary = []
            
            for emp_id, emp_result in batch_result["個別檢查結果"].items():
                if not emp_result.get("整體合法性", True):
                    violations_summary.append({
                        "員工編號": emp_id,
                        "檢查期間": emp_result.get("檢查期間", ""),
                        "違法項目數": emp_result.get("違法項目數", 0),
                        "總超時工作時數": emp_result.get("總超時工作時數", 0),
                        "總不足休息時數": emp_result.get("總不足休息時數", 0),
                        "主要違法類型": self._get_main_violation_type(emp_result.get("違法詳情", []))
                    })
            
            return {
                "格式": "摘要",
                "違法員工數": len(violations_summary),
                "違法詳情": violations_summary
            }
        
        elif format_type == "detailed":
            # 詳細格式
            return {
                "格式": "詳細",
                "完整檢查結果": batch_result
            }
        
        else:
            raise ValueError("format_type 必須是 'summary' 或 'detailed'")
    
    def _get_main_violation_type(self, violations: List[str]) -> str:
        """取得主要違法類型"""
        continuous_work_count = sum(1 for v in violations if "連續工作" in v)
        insufficient_rest_count = sum(1 for v in violations if "休息時間" in v)
        
        if continuous_work_count > insufficient_rest_count:
            return "連續工作超時"
        elif insufficient_rest_count > continuous_work_count:
            return "休息時間不足"
        else:
            return "混合違法"
    
    def validate_shift_schedule(self, shift_name: str) -> Dict:
        """驗證班別設定是否符合第35條"""
        
        if shift_name not in self.shift_schedules:
            return {"錯誤": f"未知班別: {shift_name}"}
        
        try:
            # 使用測試日期檢查班別設定
            test_date = "2024-01-01"
            work_info = self.get_work_periods(test_date, shift_name)
            
            # 檢查工作時段
            work_violations = self.check_continuous_work_rule(work_info["工作時段"])
            rest_violations = self.check_rest_time_adequacy(work_info["休息時段"])
            
            all_violations = work_violations + rest_violations
            
            result = {
                "班別名稱": shift_name,
                "班別時間": f"{self.shift_schedules[shift_name]['開始']} - {self.shift_schedules[shift_name]['結束']}",
                "總工作時數": round(work_info["總工作時數"], 2),
                "總休息時數": round(work_info["總休息時數"], 2),
                "工作時段數": len(work_info["工作時段"]),
                "休息時段數": len(work_info["休息時段"]),
                "是否合法": len(all_violations) == 0,
                "違法項目數": len(all_violations),
                "違法詳情": all_violations,
                "工作時段": [
                    {
                        "時段": i + 1,
                        "時間": f"{period['開始'].strftime('%H:%M')} - {period['結束'].strftime('%H:%M')}",
                        "時長": round(period["時長"], 2),
                        "狀態": "✅ 合法" if period["時長"] <= self.CONTINUOUS_WORK_LIMIT else "❌ 超時"
                    }
                    for i, period in enumerate(work_info["工作時段"])
                ],
                "休息時段": [
                    {
                        "時段": i + 1,
                        "時間": f"{rest['開始'].strftime('%H:%M')} - {rest['結束'].strftime('%H:%M')}",
                        "時長": f"{rest['時長']}分鐘",
                        "狀態": "✅ 充足" if rest["時長"] >= self.MIN_REST_TIME else "❌ 不足"
                    }
                    for i, rest in enumerate(work_info["休息時段"])
                ]
            }
            
            return result
            
        except Exception as e:
            return {"錯誤": f"班別設定驗證失敗: {str(e)}"}
    
    def get_compliant_shift_suggestions(self, total_work_hours: float) -> List[Dict]:
        """根據總工作時數建議合規的班別安排"""
        
        suggestions = []
        
        if total_work_hours <= 4:
            # 4小時以內不需要休息
            suggestions.append({
                "建議類型": "短時間工作",
                "工作安排": f"連續工作{total_work_hours}小時",
                "休息安排": "無需安排休息時間",
                "說明": "工作時間未超過4小時，符合第35條規定"
            })
        
        elif total_work_hours <= 8:
            # 4-8小時需要一次休息
            suggestions.append({
                "建議類型": "標準工作日",
                "工作安排": "前4小時 + 休息30分鐘 + 後段工作",
                "休息安排": "工作4小時後休息至少30分鐘",
                "範例": "09:00-13:00 工作4小時，13:00-13:30 休息30分鐘，13:30-17:30 工作4小時",
                "說明": "符合第35條繼續工作4小時須休息30分鐘規定"
            })
        
        elif total_work_hours <= 12:
            # 8-12小時需要多次休息
            suggestions.append({
                "建議類型": "延長工作日",
                "工作安排": "分段工作，每4小時休息一次",
                "休息安排": "至少安排2次30分鐘休息",
                "範例": "08:00-12:00 工作4小時，12:00-13:00 休息1小時，13:00-17:00 工作4小時，17:00-17:30 休息30分鐘，17:30-21:30 工作4小時",
                "說明": "確保每個4小時工作時段後都有充足休息"
            })
        
        else:
            suggestions.append({
                "建議類型": "超長工作日",
                "工作安排": "不建議安排超過12小時的工作",
                "休息安排": "如必須安排，每4小時至少休息30分鐘",
                "警告": "可能違反勞基法第32條總工時限制",
                "說明": "建議重新評估工作安排的必要性"
            })
        
        return suggestions
    
    def batch_check(self, shift_data: List[Dict]) -> Dict:
        """批量檢查多個員工的班別排班"""
        
        # 按員工分組
        employee_groups = defaultdict(list)
        for record in shift_data:
            employee_groups[record["員工編號"]].append(record)
        
        results = {}
        overall_violations = 0
        
        for emp_id, shifts in employee_groups.items():
            emp_result = self.check_employee_shifts(shifts)
            results[emp_id] = emp_result
            if not emp_result.get("整體合法性", True):
                overall_violations += 1
        
        return {
            "檢查員工數": len(employee_groups),
            "違法員工數": overall_violations,
            "整體合規率": f"{((len(employee_groups) - overall_violations) / len(employee_groups) * 100):.1f}%",
            "個別檢查結果": results
        }
