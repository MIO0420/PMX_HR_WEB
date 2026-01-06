"""
勞基法檢查主程式
整合所有條文檢查器
"""

import sys
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

# 導入各條文檢查器
try:
    from Law_30 import Law30Checker
    from Law_32 import Law32Checker
    from Law_34 import Law34Checker
    from Law_35 import Law35Checker
except ImportError as e:
    print(f"警告: 無法導入部分檢查器: {e}", file=sys.stderr)
    Law30Checker = None
    Law32Checker = None
    Law34Checker = None
    Law35Checker = None


class LaborStandardsChecker:
    """勞基法檢查器主類別"""
    
    def __init__(self):
        """初始化所有檢查器"""
        self.checkers = {}
        
        # 初始化各條文檢查器
        if Law30Checker:
            self.checkers['30'] = Law30Checker()
        if Law32Checker:
            self.checkers['32'] = Law32Checker()
        if Law34Checker:
            self.checkers['34'] = Law34Checker()
        if Law35Checker:
            self.checkers['35'] = Law35Checker()
        
        print(f"✅ 已載入 {len(self.checkers)} 個檢查器: {list(self.checkers.keys())}", file=sys.stderr)
    
    def check_schedules(self, schedule_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        檢查排班資料的主要方法
        
        Args:
            schedule_data: 排班資料列表
            
        Returns:
            dict: 檢查結果
        """
        try:
            print(f"🔍 開始檢查 {len(schedule_data)} 筆排班資料", file=sys.stderr)
            
            # 按員工分組
            employee_schedules = self._group_by_employee(schedule_data)
            
            print(f"👥 共有 {len(employee_schedules)} 位員工", file=sys.stderr)
            
            # 檢查結果
            individual_results = {}
            all_violations = []
            violated_articles_set = set()
            
            # 檢查每位員工
            for emp_id, emp_schedules in employee_schedules.items():
                print(f"👤 檢查員工: {emp_id}", file=sys.stderr)
                
                emp_result = self.check_employee_schedules(emp_id, emp_schedules)
                individual_results[str(emp_id)] = emp_result
                
                if emp_result.get('violations', []):
                    all_violations.extend(emp_result['violations'])
                    violated_articles_set.update(emp_result.get('violated_articles', []))
            
            # 計算合規率
            total_employees = len(employee_schedules)
            violated_employees = sum(1 for result in individual_results.values() 
                                   if result.get('violations', []))
            compliance_rate = f"{((total_employees - violated_employees) / total_employees * 100):.1f}%" if total_employees > 0 else "100%"
            
            # 生成改善建議
            suggestions = self.generate_suggestions(list(violated_articles_set))
            
            result = {
                '個別員工檢查結果': individual_results,
                '違法摘要': all_violations,
                '違反條文': sorted(list(violated_articles_set)),
                '改善建議': suggestions,
                '整體合規率': compliance_rate,
                '檢查統計': {
                    '總員工數': total_employees,
                    '違法員工數': violated_employees,
                    '違法項目數': len(all_violations)
                }
            }
            
            print(f"✅ 檢查完成，合規率: {compliance_rate}", file=sys.stderr)
            return result
            
        except Exception as e:
            print(f"❌ 檢查過程發生錯誤: {str(e)}", file=sys.stderr)
            import traceback
            traceback.print_exc(file=sys.stderr)
            raise
    
    def check_employee_schedules(self, employee_id: int, schedules: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        檢查單一員工的排班
        
        Args:
            employee_id: 員工ID
            schedules: 該員工的排班列表
            
        Returns:
            dict: 檢查結果
        """
        try:
            # 按日期排序
            schedules.sort(key=lambda x: x.get('date', x.get('start_date', '')))
            
            violations = []
            violated_articles = []
            
            # 執行各項檢查
            for check_name, checker in self.checkers.items():
                try:
                    check_violations = checker.check(schedules)
                    if check_violations:
                        violations.extend(check_violations)
                        violated_articles.append(int(check_name))
                except Exception as e:
                    print(f"❌ 員工 {employee_id} 執行第 {check_name} 條檢查時發生錯誤: {e}", file=sys.stderr)
            
            # 格式化違規訊息
            formatted_violations = []
            for v in violations:
                if isinstance(v, dict):
                    formatted_violations.append(v.get('description', str(v)))
                else:
                    formatted_violations.append(str(v))
            
            return {
                'employee_id': employee_id,
                'employee_name': schedules[0].get('employee_name', f'員工{employee_id}') if schedules else f'員工{employee_id}',
                'violations': formatted_violations,
                'violated_articles': list(set(violated_articles)),
                'severity': self.assess_severity(violated_articles),
                'total_shifts': len(schedules)
            }
            
        except Exception as e:
            print(f"❌ 員工 {employee_id} 檢查失敗: {str(e)}", file=sys.stderr)
            import traceback
            traceback.print_exc(file=sys.stderr)
            return {
                'employee_id': employee_id,
                'violations': [f'檢查過程發生錯誤: {str(e)}'],
                'violated_articles': [],
                'severity': '未知',
                'total_shifts': len(schedules)
            }
    
    def _group_by_employee(self, schedule_data: List[Dict[str, Any]]) -> Dict[int, List[Dict[str, Any]]]:
        """
        將排班資料依員工分組
        
        Args:
            schedule_data: 排班資料列表
            
        Returns:
            以員工ID為鍵的字典
        """
        employee_schedules = {}
        
        for schedule in schedule_data:
            employee_id = schedule.get('employee_id')
            if employee_id is None:
                continue
                
            if employee_id not in employee_schedules:
                employee_schedules[employee_id] = []
            employee_schedules[employee_id].append(schedule)
        
        return employee_schedules
    
    def assess_severity(self, violated_articles: List[int]) -> str:
        """
        評估違法嚴重程度
        
        Args:
            violated_articles: 違反的條文列表
            
        Returns:
            str: 嚴重程度
        """
        if not violated_articles:
            return '無'
        elif len(violated_articles) == 1:
            return '輕微'
        elif len(violated_articles) <= 2:
            return '中等'
        elif len(violated_articles) <= 3:
            return '嚴重'
        else:
            return '重大'
    
    def generate_suggestions(self, violated_articles: List[int]) -> List[str]:
        """
        生成改善建議
        
        Args:
            violated_articles: 違反的條文列表
            
        Returns:
            List[str]: 改善建議列表
        """
        suggestions = []
        
        suggestion_map = {
            30: "建議調整工作時間安排，確保每日正常工作時間不超過8小時",
            32: "建議重新安排延長工作時間，確保每月加班時數不超過46小時",
            34: "建議調整班次安排，確保連續工作4小時至少有30分鐘休息時間",
            35: "建議增加休息日安排，確保每7天至少有1天休息",
            36: "建議檢視例假日安排，確保每7天至少有1天例假"
        }
        
        for article in sorted(violated_articles):
            if article in suggestion_map:
                suggestions.append(f"【第{article}條】{suggestion_map[article]}")
        
        if not suggestions:
            suggestions.append("✅ 目前排班符合勞基法規定，請繼續保持良好的排班管理")
        else:
            suggestions.insert(0, "⚠️ 建議優先處理以下事項：")
        
        return suggestions


def main():
    """主程序入口 - 從 stdin 讀取資料並輸出結果"""
    try:
        # 從 stdin 讀取資料
        input_data = sys.stdin.read()
        
        if not input_data.strip():
            raise ValueError("沒有收到輸入資料")
        
        # 解析 JSON 資料
        data = json.loads(input_data)
        schedule_data = data.get('schedule_data', [])
        
        if not schedule_data:
            raise ValueError("沒有排班資料")
        
        print(f"🔍 收到 {len(schedule_data)} 筆排班資料", file=sys.stderr)
        
        # 創建檢查器實例
        checker = LaborStandardsChecker()
        
        # 執行檢查
        result = checker.check_schedules(schedule_data)
        
        # 輸出結果為 JSON
        output = {
            'success': True,
            'data': result,
            'timestamp': datetime.now().isoformat(),
            'processed_records': len(schedule_data)
        }
        
        # 輸出到 stdout (前端會接收這個)
        print(json.dumps(output, ensure_ascii=False, indent=2))
        
    except Exception as e:
        # 錯誤輸出
        error_output = {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
        
        print(json.dumps(error_output, ensure_ascii=False, indent=2))
        sys.exit(1)


# 為了向後兼容，保留 LaborLawChecker 別名
LaborLawChecker = LaborStandardsChecker


if __name__ == "__main__":
    main()
