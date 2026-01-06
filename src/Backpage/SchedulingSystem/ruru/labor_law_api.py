from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import traceback
import json

# 添加當前目錄到 Python 路徑
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main_checker import LaborStandardsChecker

app = Flask(__name__)
CORS(app)  # 允許跨域請求

# 🎯 添加計數器來追蹤按鈕點擊次數
click_counter = 0

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康檢查端點"""
    return jsonify({
        'status': 'ok',
        'message': '勞基法檢查 API 運行中',
        'version': '1.0.0'
    })

@app.route('/api/check-labor-law', methods=['POST'])
def check_labor_law():
    """勞基法檢查端點 - 測試版本（寫死結果）"""
    global click_counter
    click_counter += 1
    
    print(f"🔢 按鈕點擊次數: {click_counter}")
    
    try:
        # 第一次點擊：返回違法結果
        if click_counter == 1:
            print("📋 返回第一次結果：違法")
            return jsonify({
                "success": True,
                "檢查員工數": 1,
                "違法員工數": 1,
                "整體合規率": "0.0%",
                "個別檢查結果": {
                    "113118121": {
                        "員工編號": "113118121",
                        "檢查期間": "2025-10-26 ~ 2025-10-26",
                        "總排班天數": 1,
                        "整體合法性": False,
                        "違法項目數": 1,
                        "違法詳情": [
                            "2025-10-26: 違反第32條第1項：每日總工時15.0小時，超過12小時限制"
                        ],
                        "總超時時數": 3.0,
                        "每日班別檢查": [
                            {
                                "員工編號": "113118121",
                                "日期": "2025-10-26",
                                "班別": "延長班",
                                "班別時間": "12:00:00 - 03:00:00",
                                "休息時間": "18:00:00 - 19:00:00",
                                "總工作時數": 15.0,
                                "正常工時": 8.0,
                                "延長工時": 7.0,
                                "休息分鐘數": 60.0,
                                "每日延長上限": 4,
                                "每日總工時上限": 12,
                                "是否合法": False,
                                "違法情況": [
                                    "違反第32條第1項：每日延長工時7.0小時，超過4小時限制",
                                    "違反第32條第1項：每日總工時15.0小時，超過12小時限制"
                                ],
                                "超時情況": {
                                    "延長工時超時": 3.0,
                                    "總工時超時": 3.0
                                }
                            }
                        ],
                        "月延長工時統計": [
                            {
                                "月份": "2025-10",
                                "月延長工時": 7.0,
                                "法定上限": 46,
                                "是否合法": True,
                                "違法情況": None,
                                "超時時數": 0
                            }
                        ]
                    }
                }
            })
        
        # 第二次點擊：返回合法結果
        elif click_counter == 2:
            print("📋 返回第二次結果：合法")
            return jsonify({
                "success": True,
                "檢查員工數": 1,
                "違法員工數": 0,
                "整體合規率": "100.0%",
                "個別檢查結果": {
                    "113118121": {
                        "員工編號": "113118121",
                        "檢查期間": "2025-10-26 ~ 2025-10-26",
                        "總排班天數": 1,
                        "整體合法性": True,
                        "違法項目數": 0,
                        "違法詳情": [],
                        "總超時時數": 0.0,
                        "每日班別檢查": [
                            {
                                "員工編號": "113118121",
                                "日期": "2025-10-26",
                                "班別": "日班",
                                "班別時間": "09:00:00 - 18:00:00",
                                "休息時間": "12:00:00 - 13:00:00",
                                "總工作時數": 8.0,
                                "正常工時": 8.0,
                                "延長工時": 0.0,
                                "休息分鐘數": 60.0,
                                "每日延長上限": 4,
                                "每日總工時上限": 12,
                                "是否合法": True,
                                "違法情況": None,
                                "超時情況": {
                                    "延長工時超時": 0.0,
                                    "總工時超時": 0.0
                                }
                            }
                        ],
                        "月延長工時統計": [
                            {
                                "月份": "2025-10",
                                "月延長工時": 0.0,
                                "法定上限": 46,
                                "是否合法": True,
                                "違法情況": None,
                                "超時時數": 0
                            }
                        ]
                    }
                }
            })
        
        # 第三次之後：重置計數器，返回合法結果
        else:
            print("📋 重置計數器，返回合法結果")
            click_counter = 0  # 重置計數器
            return jsonify({
                "success": True,
                "檢查員工數": 1,
                "違法員工數": 0,
                "整體合規率": "100.0%",
                "個別檢查結果": {
                    "113118121": {
                        "員工編號": "113118121",
                        "檢查期間": "2025-10-26 ~ 2025-10-26",
                        "總排班天數": 1,
                        "整體合法性": True,
                        "違法項目數": 0,
                        "違法詳情": [],
                        "總超時時數": 0.0,
                        "每日班別檢查": [
                            {
                                "員工編號": "113118121",
                                "日期": "2025-10-26",
                                "班別": "日班",
                                "班別時間": "09:00:00 - 18:00:00",
                                "休息時間": "12:00:00 - 13:00:00",
                                "總工作時數": 8.0,
                                "正常工時": 8.0,
                                "延長工時": 0.0,
                                "休息分鐘數": 60.0,
                                "每日延長上限": 4,
                                "每日總工時上限": 12,
                                "是否合法": True,
                                "違法情況": None,
                                "超時情況": {
                                    "延長工時超時": 0.0,
                                    "總工時超時": 0.0
                                }
                            }
                        ],
                        "月延長工時統計": [
                            {
                                "月份": "2025-10",
                                "月延長工時": 0.0,
                                "法定上限": 46,
                                "是否合法": True,
                                "違法情況": None,
                                "超時時數": 0
                            }
                        ]
                    }
                }
            })
            
    except Exception as e:
        print(f"❌ API 錯誤: {str(e)}")
        print(f"錯誤詳情: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": f"檢查過程發生錯誤: {str(e)}",
            "details": traceback.format_exc()
        }), 500

@app.route('/api/reset-counter', methods=['POST'])
def reset_counter():
    """重置計數器的端點（用於測試）"""
    global click_counter
    click_counter = 0
    return jsonify({
        "success": True,
        "message": "計數器已重置",
        "counter": click_counter
    })

if __name__ == '__main__':
    print("🚀 啟動勞基法檢查 API 服務...")
    print("📍 健康檢查: http://localhost:5000/api/health")
    print("⚖️ 勞基法檢查: http://localhost:5000/api/check-labor-law")
    print("🔄 重置計數器: http://localhost:5000/api/reset-counter")
    app.run(debug=True, host='0.0.0.0', port=5000)
