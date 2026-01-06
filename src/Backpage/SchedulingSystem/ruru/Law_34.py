from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from collections import defaultdict
import json

class Law34Checker:
    """勞動基準法第34條 - 休息時間檢查器（API格式版本）"""
    
    def __init__(self):
        self.MIN_REST_BETWEEN_SHIFTS = 11  # 工作之間應有繼續11小時以上之休息時間
        self.CONTINUOUS_WORK_LIMIT = 24   # 連續工作時間限制（小時）
        
        # 預設班別時間設定
        self.shift_schedules = {
            "早班": {"開始": "08:00", "結束": "17:00", "休息": 60},
            "中班": {"開始": "16:00", "結束": "01:00", "休息": 60},
            "夜班": {"開始": "00:00", "結束": "09:00", "休息": 60},
            "白班": {"開始": "09:00", "結束": "18:00", "休息": 60},
            "大夜": {"開始": "22:00", "結束": "07:00", "休息": 60},
            "小夜": {"開始": "14:00", "結束": "23:00", "休息": 60},
            "加班早班": {"開始": "08:00", "結束": "20:00", "休息": 60},
            "延長白班": {"開始": "09:00", "結束": "21:00", "休息": 60},
            "日班": {"開始": "09:00", "結束": "18:00", "休息": 60},
            "晚班": {"開始": "12:00", "結束": "21:00", "休息": 60},
        }
    
    def add_shift_schedule(self, shift_name: str, start_time: str, 
                          end_time: str, break_minutes: int = 60):
        """新增或修改班別時間設定"""
        self.shift_schedules[shift_name] = {
            "開始": start_time,
            "結束": end_time,
            "休息": break_minutes
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
    
    def parse_datetime(self, date_str: str, time_str: str) -> datetime:
        """解析日期時間"""
        return datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    
    def get_shift_times(self, date: str, shift_name: str) -> Dict:
        """取得班別的開始和結束時間"""
        if shift_name not in self.shift_schedules:
            raise ValueError(f"未知班別: {shift_name}")
        
        shift_info = self.shift_schedules[shift_name]
        start_time = self.parse_datetime(date, shift_info["開始"])
        end_time = self.parse_datetime(date, shift_info["結束"])
        
        # 處理跨日情況
        if end_time <= start_time:
            end_time += timedelta(days=1)
        
        return {
            "開始時間": start_time,
            "結束時間": end_time,
            "班別資訊": shift_info
        }
    
    def calculate_rest_time(self, prev_shift_end: datetime, next_shift_start: datetime) -> float:
        """計算兩班之間的休息時間（小時）"""
        if next_shift_start <= prev_shift_end:
            # 處理跨日情況
            next_shift_start += timedelta(days=1)
        
        rest_duration = next_shift_start - prev_shift_end
        return rest_duration.total_seconds() / 3600
    
    def check_single_shift(self, employee_id: str, date: str, shift_name: str) -> Dict:
        """檢查單一班別基本資訊"""
        
        if shift_name not in self.shift_schedules:
            return {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "錯誤": f"未知班別: {shift_name}，僅支援：{', '.join(self.shift_schedules.keys())}"
            }
        
        try:
            shift_times = self.get_shift_times(date, shift_name)
            work_duration = shift_times["結束時間"] - shift_times["開始時間"]
            work_hours = work_duration.total_seconds() / 3600
            work_hours -= shift_times["班別資訊"]["休息"] / 60  # 扣除休息時間
            work_hours = max(0, work_hours)
            
            result = {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "開始時間": shift_times["開始時間"],
                "結束時間": shift_times["結束時間"],
                "工作時數": round(work_hours, 2),
                "班別時間": f"{shift_times['班別資訊']['開始']} - {shift_times['班別資訊']['結束']}",
                "是否合法": True,
                "違法情況": None
            }
            
            return result
            
        except Exception as e:
            return {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "錯誤": str(e)
            }
    
    def check_rest_between_shifts(self, shift1: Dict, shift2: Dict) -> Dict:
        """檢查兩班之間的休息時間是否符合第34條"""
        
        if "錯誤" in shift1 or "錯誤" in shift2:
            return {
                "前一班": f"{shift1.get('日期', 'N/A')} {shift1.get('班別', 'N/A')}",
                "後一班": f"{shift2.get('日期', 'N/A')} {shift2.get('班別', 'N/A')}",
                "錯誤": "班別資料錯誤，無法檢查休息時間"
            }
        
        rest_hours = self.calculate_rest_time(shift1["結束時間"], shift2["開始時間"])
        
        result = {
            "前一班": f"{shift1['日期']} {shift1['班別']}",
            "前一班結束": shift1["結束時間"].strftime("%Y-%m-%d %H:%M"),
            "後一班": f"{shift2['日期']} {shift2['班別']}",
            "後一班開始": shift2["開始時間"].strftime("%Y-%m-%d %H:%M"),
            "休息時間": round(rest_hours, 2),
            "法定最低休息": self.MIN_REST_BETWEEN_SHIFTS,
            "是否合法": rest_hours >= self.MIN_REST_BETWEEN_SHIFTS,
            "違法情況": None,
            "不足時數": max(0, self.MIN_REST_BETWEEN_SHIFTS - rest_hours)
        }
        
        if not result["是否合法"]:
            result["違法情況"] = f"違反第34條：休息時間{rest_hours}小時，不足法定{self.MIN_REST_BETWEEN_SHIFTS}小時"
        
        return result
    
    def check_employee_shifts(self, shift_records: List[Dict]) -> Dict:
        """
        檢查員工班別排班是否符合第34條規定
        
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
        
        # 檢查班別間休息時間
        rest_check_results = []
        violations = []
        total_insufficient_rest = 0
        
        for i in range(len(daily_results) - 1):
            current_shift = daily_results[i]
            next_shift = daily_results[i + 1]
            
            rest_check = self.check_rest_between_shifts(current_shift, next_shift)
            rest_check_results.append(rest_check)
            
            if "錯誤" in rest_check:
                violations.append(f"班別間休息檢查錯誤: {rest_check['錯誤']}")
            elif not rest_check["是否合法"]:
                violations.append(f"{rest_check['前一班']} → {rest_check['後一班']}: {rest_check['違法情況']}")
                total_insufficient_rest += rest_check["不足時數"]
        
        # 檢查每日班別錯誤
        for daily in daily_results:
            if "錯誤" in daily:
                violations.append(f"{daily['日期']}: {daily['錯誤']}")
        
        # 連續工作檢查
        continuous_work_violations = self._check_continuous_work(daily_results, rest_check_results)
        violations.extend(continuous_work_violations)
        
        # 整體結果
        result = {
            "員工編號": employee_id,
            "檢查期間": f"{shifts[0]['日期']} ~ {shifts[-1]['日期']}",
            "總排班天數": len(shifts),
            "班別間休息檢查次數": len(rest_check_results),
            "整體合法性": len(violations) == 0,
            "違法項目數": len(violations),
            "違法詳情": violations,
            "總不足休息時數": round(total_insufficient_rest, 2),
            "每日班別檢查": daily_results,
            "班別間休息檢查": rest_check_results,
            "連續工作檢查": self._analyze_continuous_work_patterns(daily_results, rest_check_results)
        }
        
        return result
    
    def _check_continuous_work(self, daily_results: List[Dict], rest_results: List[Dict]) -> List[str]:
        """檢查連續工作模式違法情況"""
        violations = []
        
        # 檢查是否有連續超過24小時的工作安排
        for i, rest_check in enumerate(rest_results):
            if "錯誤" not in rest_check and rest_check["休息時間"] < 8:
                # 休息時間過短可能導致連續工作
                prev_shift = daily_results[i]
                next_shift = daily_results[i + 1]
                
                if ("錯誤" not in prev_shift and "錯誤" not in next_shift and 
                    prev_shift["工作時數"] + next_shift["工作時數"] > 16):
                    violations.append(
                        f"疑似連續工作過長: {prev_shift['日期']} {prev_shift['班別']} "
                        f"+ {next_shift['日期']} {next_shift['班別']} "
                        f"(總工時{prev_shift['工作時數'] + next_shift['工作時數']}小時，"
                        f"休息僅{rest_check['休息時間']}小時)"
                    )
        
        return violations
    
    def _analyze_continuous_work_patterns(self, daily_results: List[Dict], rest_results: List[Dict]) -> Dict:
        """分析連續工作模式"""
        analysis = {
            "最短休息時間": float('inf'),
            "最長休息時間": 0,
            "平均休息時間": 0,
            "不足休息次數": 0,
            "連續工作風險": []
        }
        
        if not rest_results:
            return analysis
        
        valid_rest_times = []
        for rest_check in rest_results:
            if "錯誤" not in rest_check:
                rest_time = rest_check["休息時間"]
                valid_rest_times.append(rest_time)
                
                analysis["最短休息時間"] = min(analysis["最短休息時間"], rest_time)
                analysis["最長休息時間"] = max(analysis["最長休息時間"], rest_time)
                
                if rest_time < self.MIN_REST_BETWEEN_SHIFTS:
                    analysis["不足休息次數"] += 1
                
                if rest_time < 8:
                    analysis["連續工作風險"].append(f"休息時間{rest_time}小時過短")
        
        if valid_rest_times:
            analysis["平均休息時間"] = round(sum(valid_rest_times) / len(valid_rest_times), 2)
        else:
            analysis["最短休息時間"] = 0
        
        return analysis
    
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
