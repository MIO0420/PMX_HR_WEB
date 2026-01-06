from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from collections import defaultdict
import json

class Law32Checker:
    """勞動基準法第32條 - 延長工作時間檢查器（API格式版本）"""
    
    def __init__(self):
        self.DAILY_LIMIT = 8  # 每日正常工作時間上限（小時）
        self.WEEKLY_LIMIT = 40  # 每週正常工作時間上限（小時）
        self.DAILY_OVERTIME_LIMIT = 4  # 每日延長工作時間上限（小時）
        self.MONTHLY_OVERTIME_LIMIT = 46  # 每月延長工作時間上限（小時）
        self.MAX_DAILY_TOTAL = 12  # 每日總工作時間上限（小時）
        
        # 您的班別時間設定
        self.shift_schedules = {
            "日班": {"開始": "09:00", "結束": "18:00", "休息": 60},  # 8小時工作
            "晚班": {"開始": "12:00", "結束": "21:00", "休息": 60},  # 8小時工作
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
            # 兼容 HH:MM:SS 或 HH:MM
            time_part = time_str.split(':')
            return datetime.strptime(f"{time_part[0]}:{time_part[1]}", "%H:%M")
        except ValueError:
            raise ValueError(f"時間格式錯誤: {time_str}，請使用 HH:MM 格式")

    def parse_datetime(self, date_str: str, time_str: str) -> datetime:
        """解析日期時間（兼容 HH:MM:SS 或 HH:MM）"""
        try:
            time_part = time_str.split(':')
            return datetime.strptime(f"{date_str} {time_part[0]}:{time_part[1]}", "%Y-%m-%d %H:%M")
        except:
            return datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")

    def calculate_shift_hours(self, shift_record: Dict) -> Dict:
        """
        計算班別工作時數（正常+延長）
        修正版本：正確計算工時並添加詳細除錯資訊
        """
        date_str = shift_record.get("日期")
        start_time_str = shift_record.get("start_time")
        end_time_str = shift_record.get("end_time")
        
        break_start_str = shift_record.get("break_time_start")
        break_end_str = shift_record.get("break_time_end")
        
        if not (date_str and start_time_str and end_time_str):
            raise ValueError("工時計算錯誤: 缺少日期、開始或結束時間")

        # 1. 解析排班時間
        start = self.parse_datetime(date_str, start_time_str)
        end = self.parse_datetime(date_str, end_time_str)
        
        # 處理跨日情況
        if end <= start:
            end += timedelta(days=1)
        
        work_duration = end - start
        total_hours = work_duration.total_seconds() / 3600
        
        # 2. 計算並扣除休息時間
        total_break_minutes = 0
        if break_start_str and break_end_str:
            try:
                break_start = self.parse_datetime(date_str, break_start_str)
                break_end = self.parse_datetime(date_str, break_end_str)
                
                # 處理休息時間跨日情況
                if break_end <= break_start:
                    break_end += timedelta(days=1)
                
                # 確保休息時間在工作時間範圍內
                if break_start >= start and break_end <= end:
                    if break_end > break_start:
                        total_break_minutes = (break_end - break_start).total_seconds() / 60
                else:
                    print(f"⚠️ 休息時間超出工作時間範圍，將忽略休息時間計算")
                    
            except Exception as e:
                print(f"❌ 休息時間解析錯誤: {e}")
        
        # 扣除休息時間
        total_hours -= total_break_minutes / 60
        total_hours = max(0, total_hours)
        
        # 3. 計算正常工時和延長工時
        normal_hours = min(total_hours, self.DAILY_LIMIT)
        overtime_hours = max(0, total_hours - self.DAILY_LIMIT)
        
        # 4. 添加詳細除錯資訊
        print(f"\n🔍 工時計算詳情 - 員工 {shift_record.get('員工編號', 'N/A')} ({date_str}):")
        print(f"   📅 日期: {date_str}")
        print(f"   ⏰ 開始時間: {start_time_str} -> {start}")
        print(f"   ⏰ 結束時間: {end_time_str} -> {end}")
        print(f"   ⏱️ 總時長: {work_duration} = {total_hours + (total_break_minutes/60):.2f} 小時")
        print(f"   🛌 休息時間: {break_start_str} - {break_end_str} = {total_break_minutes:.2f} 分鐘")
        print(f"   💼 實際工時: {total_hours:.2f} 小時")
        print(f"   ✅ 正常工時: {normal_hours:.2f} 小時")
        print(f"   ⏳ 延長工時: {overtime_hours:.2f} 小時")
        print(f"   🚨 是否超過8小時: {'是' if total_hours > 8 else '否'}")
        print(f"   🚨 是否超過12小時: {'是' if total_hours > 12 else '否'}")
        
        return {
            "總工時": round(total_hours, 2),
            "正常工時": round(normal_hours, 2),
            "延長工時": round(overtime_hours, 2),
            "休息分鐘數": round(total_break_minutes, 2)
        }
    
    def convert_api_format_to_internal(self, api_data: List[Dict]) -> List[Dict]:
        """
        將 API 格式轉換為內部處理格式
        修改：在轉換時保留所有重要的時間資訊。
        """
        internal_data = []
        
        print(f"\n🔄 開始轉換 API 格式資料，共 {len(api_data)} 筆")
        
        # 班別 ID 對應表（用於兼容舊邏輯，但核心時間資訊以 start/end 為主）
        shift_id_mapping = {
            "day_shift": "日班",
            "night_shift": "晚班",
            "日班": "日班",
            "晚班": "晚班",
            "SHIFT_DAY": "日班",
            "SHIFT_NIGHT": "晚班",
        }
        
        for idx, record in enumerate(api_data):
            print(f"\n📋 處理第 {idx+1} 筆資料:")
            print(f"   原始資料: {record}")
            
            # 取得班別名稱
            shift_type_id = record.get("shift_type_id", record.get("shift_name", ""))
            shift_name = shift_id_mapping.get(shift_type_id, shift_type_id)
            
            # 確保有 start_date, end_date
            start_date_str = record.get("start_date", record.get("date"))
            end_date_str = record.get("end_date", record.get("date"))
            
            if not start_date_str or not end_date_str:
                print(f"   ⚠️ 跳過：缺少日期資訊")
                continue

            # 處理單日排班
            if start_date_str == end_date_str:
                internal_record = {
                    "員工編號": record.get("employee_id"),
                    "日期": start_date_str,
                    "班別": shift_name,
                    "公司ID": record.get("company_id"),
                    "部門": record.get("department"),
                    # 傳遞時間資訊
                    "start_time": record.get("start_time"),
                    "end_time": record.get("end_time"),
                    "break_time_start": record.get("break_time_start"),
                    "break_time_end": record.get("break_time_end"),
                }
                internal_data.append(internal_record)
                print(f"   ✅ 轉換成功: {internal_record}")
            else:
                # 處理多日排班（如果需要）
                try:
                    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
                    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
                except ValueError:
                    print(f"   ❌ 日期格式錯誤，跳過")
                    continue
                
                current_date = start_date
                while current_date <= end_date:
                    internal_record = {
                        "員工編號": record.get("employee_id"),
                        "日期": current_date.strftime("%Y-%m-%d"),
                        "班別": shift_name,
                        "公司ID": record.get("company_id"),
                        "部門": record.get("department"),
                        # 傳遞時間資訊
                        "start_time": record.get("start_time"),
                        "end_time": record.get("end_time"),
                        "break_time_start": record.get("break_time_start"),
                        "break_time_end": record.get("break_time_end"),
                    }
                    internal_data.append(internal_record)
                    print(f"   ✅ 多日轉換: {internal_record}")
                    current_date += timedelta(days=1)
        
        print(f"\n✅ 轉換完成，共產生 {len(internal_data)} 筆內部格式資料")
        return internal_data
    
    def check_single_shift(self, shift_record: Dict) -> Dict:
        """
        檢查單一班別是否符合第32條規定
        修改：直接接受 shift_record 字典
        """
        employee_id = shift_record["員工編號"]
        date = shift_record["日期"]
        shift_name = shift_record["班別"]
        
        print(f"\n🔍 檢查單一班別 - 員工 {employee_id} ({date})")
        
        try:
            # 呼叫修改後的工時計算，傳入 record
            hours_info = self.calculate_shift_hours(shift_record)
        except ValueError as e:
            return {
                "員工編號": employee_id,
                "日期": date,
                "班別": shift_name,
                "錯誤": f"工時計算錯誤: {str(e)}"
            }
        
        # 檢查各項限制
        violations = []
        
        # 1. 每日延長工時不得超過4小時
        if hours_info["延長工時"] > self.DAILY_OVERTIME_LIMIT:
            violations.append(f"違反第32條第1項：每日延長工時{hours_info['延長工時']}小時，超過{self.DAILY_OVERTIME_LIMIT}小時限制")
        
        # 2. 每日總工時不得超過12小時
        if hours_info["總工時"] > self.MAX_DAILY_TOTAL:
            violations.append(f"違反第32條第1項：每日總工時{hours_info['總工時']}小時，超過{self.MAX_DAILY_TOTAL}小時限制")
        
        # 3. 檢查是否有延長工時（超過8小時）
        if hours_info["延長工時"] > 0:
            print(f"⚠️ 發現延長工時: {hours_info['延長工時']} 小時")
        
        result = {
            "員工編號": employee_id,
            "日期": date,
            "班別": shift_name,
            "班別時間": f"{shift_record.get('start_time', 'N/A')} - {shift_record.get('end_time', 'N/A')}",
            "休息時間": f"{shift_record.get('break_time_start', 'N/A')} - {shift_record.get('break_time_end', 'N/A')}",
            "總工作時數": hours_info["總工時"],
            "正常工時": hours_info["正常工時"],
            "延長工時": hours_info["延長工時"],
            "休息分鐘數": hours_info["休息分鐘數"],
            "每日延長上限": self.DAILY_OVERTIME_LIMIT,
            "每日總工時上限": self.MAX_DAILY_TOTAL,
            "是否合法": len(violations) == 0,
            "違法情況": violations if violations else None,
            "超時情況": {
                "延長工時超時": round(max(0, hours_info["延長工時"] - self.DAILY_OVERTIME_LIMIT), 2),
                "總工時超時": round(max(0, hours_info["總工時"] - self.MAX_DAILY_TOTAL), 2)
            }
        }
        
        # 輸出檢查結果
        print(f"📊 檢查結果:")
        print(f"   總工時: {hours_info['總工時']} 小時")
        print(f"   延長工時: {hours_info['延長工時']} 小時")
        print(f"   是否合法: {'✅ 合法' if result['是否合法'] else '❌ 違法'}")
        if violations:
            for violation in violations:
                print(f"   🚨 {violation}")
        
        return result
    
    def check_api_data(self, api_data: List[Dict]) -> Dict:
        """
        直接檢查 API 格式的排班資料
        """
        if not api_data:
            return {"錯誤": "無排班資料"}
        
        print(f"\n🚀 開始檢查 API 資料，共 {len(api_data)} 筆")
        
        # 轉換 API 格式為內部格式 (已修改以傳遞時間資訊)
        internal_data = self.convert_api_format_to_internal(api_data)
        
        if not internal_data:
            return {"錯誤": "轉換後無有效排班資料"}
        
        # 使用現有的批量檢查功能
        return self.batch_check(internal_data)
    
    def check_employee_shifts(self, shift_records: List[Dict]) -> Dict:
        """
        檢查員工班別排班是否符合第32條規定
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
            # 關鍵修改：直接傳入 shift_record
            daily_result = self.check_single_shift(shift_record)
            daily_results.append(daily_result)
        
        # 計算月延長工時
        monthly_results = self._calculate_monthly_overtime(daily_results)
        
        # 統計違法情況
        violations = []
        total_violation_hours = 0
        
        # 每日違法檢查
        for daily in daily_results:
            if "錯誤" in daily:
                violations.append(f"{daily['日期']}: {daily['錯誤']}")
            elif not daily["是否合法"]:
                for violation in daily["違法情況"]:
                    violations.append(f"{daily['日期']}: {violation}")
                total_violation_hours += daily["超時情況"]["延長工時超時"]
                total_violation_hours += daily["超時情況"]["總工時超時"]
        
        # 月延長工時違法檢查
        for month in monthly_results:
            if not month["是否合法"]:
                violations.append(month["違法情況"])
                total_violation_hours += month["超時時數"]
        
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
            "月延長工時統計": monthly_results
        }
        
        return result
    
    def _calculate_monthly_overtime(self, daily_results: List[Dict]) -> List[Dict]:
        """計算月延長工時統計"""
        monthly_results = []
        monthly_overtime = defaultdict(float)
        
        # 按月份分組計算延長工時
        for daily in daily_results:
            if "錯誤" not in daily:
                date_obj = datetime.strptime(daily["日期"], "%Y-%m-%d")
                month_key = date_obj.strftime("%Y-%m")
                monthly_overtime[month_key] += daily["延長工時"]
        
        # 檢查每月延長工時限制
        for month, total_overtime in monthly_overtime.items():
            month_result = {
                "月份": month,
                "月延長工時": round(total_overtime, 2),
                "法定上限": self.MONTHLY_OVERTIME_LIMIT,
                "是否合法": total_overtime <= self.MONTHLY_OVERTIME_LIMIT,
                "違法情況": None,
                "超時時數": max(0, total_overtime - self.MONTHLY_OVERTIME_LIMIT)
            }
            
            if not month_result["是否合法"]:
                month_result["違法情況"] = f"違反第32條第2項：{month}月延長工時{total_overtime}小時，超過{self.MONTHLY_OVERTIME_LIMIT}小時限制"
            
            monthly_results.append(month_result)
        
        return monthly_results
    
    def batch_check(self, shift_data: List[Dict]) -> Dict:
        """批量檢查多個員工的班別排班"""
        
        print(f"\n📊 開始批量檢查，共 {len(shift_data)} 筆排班資料")
        
        # 按員工分組
        employee_groups = defaultdict(list)
        for record in shift_data:
            employee_groups[record["員工編號"]].append(record)
        
        print(f"📈 共有 {len(employee_groups)} 位員工需要檢查")
        
        results = {}
        overall_violations = 0
        
        for emp_id, shifts in employee_groups.items():
            print(f"\n👤 檢查員工 {emp_id}，共 {len(shifts)} 筆排班")
            emp_result = self.check_employee_shifts(shifts)
            results[emp_id] = emp_result
            if not emp_result.get("整體合法性", True):
                overall_violations += 1
                print(f"❌ 員工 {emp_id} 有違法情況")
            else:
                print(f"✅ 員工 {emp_id} 排班合法")
        
        final_result = {
            "檢查員工數": len(employee_groups),
            "違法員工數": overall_violations,
            "整體合規率": f"{((len(employee_groups) - overall_violations) / len(employee_groups) * 100):.1f}%",
            "個別檢查結果": results
        }
        
        print(f"\n📋 批量檢查完成:")
        print(f"   總員工數: {final_result['檢查員工數']}")
        print(f"   違法員工數: {final_result['違法員工數']}")
        print(f"   合規率: {final_result['整體合規率']}")
        
        return final_result
