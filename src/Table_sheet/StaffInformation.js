import React from 'react';

const StaffInformation = ({ 
  newEmployee, 
  setNewEmployee, 
  departments, 
  handleAddEmployee, 
  onCancel 
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
      {/* 基本資料區塊 */}
      <div style={{ border: '1px solid #B2B2B2', borderRadius: '10px', padding: '20px', backgroundColor: '#F8F8F8' }}>
        <h4 style={{ color: '#3A6CA6', marginBottom: '20px' }}>基本資料</h4>
        <div style={{ marginBottom: '10px' }}>
          <label>員工編號：</label>
          <input 
            type="text" 
            placeholder="輸入" 
            value={newEmployee.id}
            onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>姓名：</label>
          <input 
            type="text" 
            placeholder="輸入" 
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>生理性別：</label>
          <select 
            value={newEmployee.gender}
            onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}
          >
            <option value="">選擇</option>
            <option value="女性">女性</option>
            <option value="男性">男性</option>
            <option value="非二元性別">非二元性別</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>身分證字號：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>出生年月日：</label>
          <input type="date" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>婚姻狀態：</label>
          <select style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}>
            <option value="">選擇</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>戶籍地址：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>通訊地址：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>電子郵件：</label>
          <input type="email" placeholder="輸入電子郵件" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>初始密碼：</label>
          <input type="text" placeholder="身分證號碼(英文大寫)" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>手機：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>市話：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
      </div>

      {/* 職務相關區塊 */}
      <div style={{ border: '1px solid #B2B2B2', borderRadius: '10px', padding: '20px', backgroundColor: '#F8F8F8' }}>
        <h4 style={{ color: '#3A6CA6', marginBottom: '20px' }}>職務相關</h4>
        <div style={{ marginBottom: '10px' }}>
          <label>身分別：</label>
          <select 
            value={newEmployee.identity}
            onChange={(e) => setNewEmployee({ ...newEmployee, identity: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}
          >
            <option value="">選擇</option>
            <option value="全職">全職</option>
            <option value="部分工時">部分工時</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>薪別：</label>
          <select 
            value={newEmployee.salaryType}
            onChange={(e) => setNewEmployee({ ...newEmployee, salaryType: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}
          >
            <option value="">選擇</option>
            <option value="月薪">月薪</option>
            <option value="時薪">時薪</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>輪班制：</label>
          <select 
            value={newEmployee.shiftType}
            onChange={(e) => setNewEmployee({ ...newEmployee, shiftType: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}
          >
            <option value="">選擇</option>
            <option value="固定班制">固定班制</option>
            <option value="輪班制">輪班制</option>
            <option value="排班制">排班制</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>部門：</label>
          <select 
            value={newEmployee.department}
            onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}
          >
            <option value="">選擇部門</option>
            {departments.map(department => (
              <option key={department.id} value={department.name}>{department.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>到職日：</label>
          <input type="date" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>職稱：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>是否為管理職：</label>
          <input type="checkbox" style={{ marginLeft: '10px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>上級主管：</label>
          <select style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}>
            <option value="">選擇</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>職級：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>受訓後管制：</label>
          <input type="date" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>年資（自動計算）：</label>
          <input type="text" disabled style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>試用期：</label>
          <input type="date" style={{ width: 'calc(50% - 5px)', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px', marginRight: '10px' }} />
          <input type="date" style={{ width: 'calc(50% - 5px)', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>離職日：</label>
          <input type="date" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>免打卡待遇：</label>
          <input type="checkbox" style={{ marginLeft: '10px' }} />
        </div>
      </div>

      {/* 薪資帳戶區塊 */}
      <div style={{ border: '1px solid #B2B2B2', borderRadius: '10px', padding: '20px', backgroundColor: '#F8F8F8' }}>
        <h4 style={{ color: '#3A6CA6', marginBottom: '20px' }}>薪資帳戶</h4>
        <div style={{ marginBottom: '10px' }}>
          <label>銀行名稱(代碼)：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>分行名稱(代碼)：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>帳號：</label>
          <input type="text" placeholder="輸入" style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>投保級距：</label>
          <select 
            value={newEmployee.insuranceLevel}
            onChange={(e) => setNewEmployee({ ...newEmployee, insuranceLevel: e.target.value })}
            style={{ width: '100%', borderRadius: '5px', border: '1px solid #E9E9E9', padding: '5px' }}
          >
            <option value="">選擇級距</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={`第${i + 1}級`}>第{i + 1}級</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ gridColumn: 'span 3', textAlign: 'center', marginTop: '20px' }}>
        <button 
          type="button" 
          onClick={handleAddEmployee}
          style={{ marginRight: '10px', backgroundColor: '#4a86e8', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}
        >
          完成
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default StaffInformation;
