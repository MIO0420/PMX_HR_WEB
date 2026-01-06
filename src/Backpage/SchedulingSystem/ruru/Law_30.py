from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from collections import defaultdict
import json

class Law30Checker:
    """勞動基準法第30條 - 工作時間檢查器（班別版本）"""
    
    def __init__(self):
        self.DAILY_LIMIT = 8  # 每日正常工作時間上限（小時）
        self.WEEKLY_LIMIT = 40  # 每週正常工作時間上限（小時）
        
        # 您的班別時間設定
        self.shift_schedules = {
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
    
    def parse_time(self, time_str: str) -> datetime:
        """解析時間字串 (格式: HH:MM)"""
        try:
            return datetime.strptime(time_str, "%H:%M")
        except ValueError:
            raise ValueError(f"時間格式錯誤: {time_str}，請使用 HH:MM 格式")
    
    def calculate_shift_hours(self, shift_name: str) -> float:
        """計算班別工作時數"""
        if shift_name not in self.shift_schedules:
            raise ValueError(f"未知班別: {shift_name}")
        
        shift_info = self.shift_schedules[shift_name]
        start = self.parse_time(shift_info["開始"])
        end = self.parse_time(shift_info["結束"])
        
        # 處理跨日情況
        if end <= start:
            end += timedelta(days=1)
        
        work_duration = end - start
        work_hours = work_duration.total_seconds() / 3600
        
        # 扣除休息時間
        work_hours -= shift_info["休息"] / 60
        
        return max(0, work_hours)
    
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
            "日班": "日班",
            "晚班": "晚班",
            "SHIFT_DAY": "日班",
            "SHIFT_NIGHT": "晚班",
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
    
    def check_single_shift(self, employee_id: str, date: str, shift_name: str) -> Dict:
        """檢查單一班別是否符合第30條規定"""
        
        if shift_name not in self.shift_schedules:
            return {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "錯誤": f"未知班別: {shift_name}，僅支援：{', '.join(self.shift_schedules.keys())}"
            }
        
        work_hours = self.calculate_shift_hours(shift_name)
        shift_info = self.shift_schedules[shift_name]
        
        result = {
            "員工編號": employee_id,
            "日期": date,
            "班別": shift_name,
            "班別時間": f"{shift_info['開始']} - {shift_info['結束']}",
            "工作時數": round(work_hours, 2),
            "法定上限": self.DAILY_LIMIT,
            "是否合法": work_hours <= self.DAILY_LIMIT,
            "違法情況": None,
            "超時時數": max(0, work_hours - self.DAILY_LIMIT)
        }
        
        if not result["是否合法"]:
            result["違法情況"] = f"違反勞基法第30條第1項：{shift_name}工作時間{work_hours}小時，超過每日{self.DAILY_LIMIT}小時限制"
        
        return result
    
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
    
    def check_employee_shifts(self, shift_records: List[Dict]) -> Dict:
        """檢查員工班別排班是否符合第30條規定"""
        
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
        
        # 按週計算工時
        weekly_results = self._calculate_weekly_hours(daily_results)
        
        # 統計違法情況
        violations = []
        total_violation_hours = 0
        
        # 每日違法檢查
        for daily in daily_results:
            if "錯誤" in daily:
                violations.append(f"{daily['日期']}: {daily['錯誤']}")
            elif not daily["是否合法"]:
                violations.append(f"{daily['日期']}: {daily['違法情況']}")
                total_violation_hours += daily["超時時數"]
        
        # 每週違法檢查
        for week in weekly_results:
            if not week["是否合法"]:
                violations.append(week["違法情況"])
                total_violation_hours += week["超時時數"]
        
        # 整體結果
        result = {
            "員工編號": employee_id,
            "檢查期間": f"{shifts[0]['日期']} ~ {shifts[-1]['日期']}",
            "總排班天數": len(shifts),
            "整體合法性": len(violations) == 0,
            "違法項目數": len(violations),
            "違法詳情": violations,
            "總超時時數": round(total_violation_hours, 2),
            "每日班別檢查": daily_results,
            "週別工時統計": weekly_results
        }
        
        return result
    
    def _calculate_weekly_hours(self, daily_results: List[Dict]) -> List[Dict]:
        """計算週工時統計"""
        weekly_results = []
        current_week = []
        
        for i, daily in enumerate(daily_results):
            if "錯誤" not in daily:
                current_week.append(daily)
            
            # 每7天或最後一組進行週統計
            if len(current_week) == 7 or i == len(daily_results) - 1:
                if current_week:
                    week_total = sum(day["工作時數"] for day in current_week)
                    week_result = {
                        "週期": f"{current_week[0]['日期']} ~ {current_week[-1]['日期']}",
                        "工作天數": len(current_week),
                        "總工作時數": round(week_total, 2),
                        "法定上限": self.WEEKLY_LIMIT,
                        "是否合法": week_total <= self.WEEKLY_LIMIT,
                        "違法情況": None,
                        "超時時數": max(0, week_total - self.WEEKLY_LIMIT)
                    }
                    
                    if not week_result["是否合法"]:
                        week_result["違法情況"] = f"違反勞基法第30條第2項：週工作時間{week_total}小時，超過{self.WEEKLY_LIMIT}小時限制"
                    
                    weekly_results.append(week_result)
                    current_week = []
        
        return weekly_results
    
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


# 使用範例
def main():
    checker = Law30Checker()
    
    # 測試 API 格式資料
    api_data = [
        {
            "company_id": "COMP001",
            "employee_id": "E001",
            "shift_type_id": "日班",
            "start_date": "2025-10-30",
            "end_date": "2025-10-30",
            "month": 10,
            "year": 2025,
            "department": "業務部"
        },
        {
            "company_id": "COMP001", 
            "employee_id": "E001",
            "shift_type_id": "晚班",
            "start_date": "2025-10-31",
            "end_date": "2025-10-31",
            "month": 10,
            "year": 2025,
            "department": "業務部"
        },
        {
            "company_id": "COMP001",
            "employee_id": "E001", 
            "shift_type_id": "日班",
            "start_date": "2025-11-01",
            "end_date": "2025-11-01",
            "month": 11,
            "year": 2025,
            "department": "業務部"
        },
        {
            "company_id": "COMP001",
            "employee_id": "E002",
            "shift_type_id": "晚班", 
            "start_date": "2025-10-30",
            "end_date": "2025-10-30",
            "month": 10,
            "year": 2025,
            "department": "技術部"
        }
    ]
    
    print("=" * 60)
    print("勞動基準法第30條 API格式排班檢查結果")
    print("=" * 60)
    
    # 使用 API 格式檢查
    result = checker.check_api_data(api_data)
    
    print(f"檢查員工數: {result['檢查員工數']}")
    print(f"違法員工數: {result['違法員工數']}")
    print(f"整體合規率: {result['整體合規率']}")
    
    print("\n📊 個別員工檢查結果:")
    for emp_id, emp_result in result['個別檢查結果'].items():
        print(f"\n👤 員工編號: {emp_id}")
        print(f"   檢查期間: {emp_result['檢查期間']}")
        print(f"   總排班天數: {emp_result['總排班天數']}")
        print(f"   整體合法性: {'✅ 合法' if emp_result['整體合法性'] else '❌ 違法'}")
        
        if emp_result['違法詳情']:
            print("   ❌ 違法詳情:")
            for violation in emp_result['違法詳情']:
                print(f"      • {violation}")
        
        print("   📅 每日班別:")
        for daily in emp_result['每日班別檢查']:
            if "錯誤" in daily:
                print(f"      {daily['日期']}: ❌ {daily['錯誤']}")
            else:
                status = "✅" if daily['是否合法'] else "❌"
                print(f"      {daily['日期']}: {status} {daily['班別']} ({daily['班別時間']}) - {daily['工作時數']}小時")


if __name__ == "__main__":
    main()
