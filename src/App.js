
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LanguageProvider } from './PMX/Hook/useLanguage';
import { EmployeeProvider } from './contexts/EmployeeContext';

import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import Apply from './pages/Apply';
import Checkin from './pages/Checkin'; 
import FrontPage from './pages/FrontPage';
import Replenish from './pages/Replenish';
import ReplenishApply from './pages/ReplenishApply';
import WorkOvertimeApply from './pages/WorkOvertimeApply';
import WorkOvertime from './pages/WorkOvertime';
import AuditSystem from './pages/AuditSystem';
import Salary from './pages/Salary';
import Schedule from './pages/Schedule';
import Announcement from './pages/Announcement';
import AppLogIn from './pages/AppLogIn';
import PersonalData from './pages/PersonalData';

// 婆婆部分
import ApploginPMX from './PMX/ApploginPMX';
import CheckinPMX from './PMX/CheckinPMX';
import FrontPagePMX from './PMX/FrontPagePMX';
import AttendancePagePMX from './PMX/AttendancePagePMX';
import ReplenishPMX from './PMX/ReplenishPMX';
import ReplenishApplyPMX from './PMX/ReplenishApplyPMX';
import WorkOvertimeApplyPMX from './PMX/WorkOvertimeApplyPMX';
import WorkOvertimePMX from './PMX/WorkOvertimePMX';
import LeavePagePMX from './PMX/LeavePagePMX';
import ApplyPMX from './PMX/ApplyPMX';
import PersonalDataPMX from './PMX/PersonalDataPMX';
import NewEmployeesPMX from './PMX/NewEmployeesPMX';
import ApploginPMXsso from './PMX/ApploginPMXsso';
import TunQueryResultsPmx from './PMX/TunQueryResultsPmx';
import TunQueryResultsPmxsso from './PMX/TunQueryResultsPmxsso';
import TunQueryResultsPmxlogin from './PMX/TunQueryResultsPmxlogin';


// google sheet部分
import AttendancePage01 from './Google_sheet/AttendancePage';
import LeavePage01 from './Google_sheet/LeavePage';
import Apply01 from './Google_sheet/Apply';
import AppLogIn01 from './Google_sheet/AppLogIn';
import Replenish01 from './Google_sheet/Replenish';
import ReplenishApply01 from './Google_sheet/ReplenishApply';
import WorkOvertimeApply01 from './Google_sheet/WorkOvertimeApply';
import WorkOvertime01 from './Google_sheet/WorkOvertime';
import AuditSystem01 from './Google_sheet/AuditSystem';
import Salary01 from './Google_sheet/Salary';
import Schedule01 from './Google_sheet/Schedule';
import Announcement01 from './Google_sheet/Announcement';
import FrontPage01 from './Google_sheet/FrontPage';
import PersonalData01 from './Google_sheet/PersonalData';
import Checkin01 from './Google_sheet/Checkin';
import Queryresults from './Google_sheet/Queryresults';
import TunQueryResults from './Google_sheet/TunQueryResults';

// 後台部分
import Login from './Backpage/Log_in'; 
import HomePage from './Backpage/HomePage'; 
import Human from './Backpage/EmployeeInformation/Human';
import SchedulingSystem from './Backpage/SchedulingSystem';
import AddNewMonth from './Backpage/AddNewMonth';
import SalaryCalculate from './Backpage/SalaryCalculate';
import CompanyInformation from './Backpage/CompanyBasicInformation/CompanyInformation';
import Permissions from './Backpage/Permissions_Control/Permissions';
import HypothesisSetting from './Backpage/Hypothesis_Setting/HypothesisSetting';
import UploadAnnouncement from './Backpage/NoticeBoard/Upload_Announcement';

function App() {
  return (
    <LanguageProvider>
      <EmployeeProvider>
        <Router>
          <Routes>
            {/* 手機畫面 */}
            <Route path="/attendance" element={<AttendancePage />} />{/* 查詢出勤畫面 */}
            <Route path="/leave" element={<LeavePage />} />{/* 請假畫面 */}
            <Route path="/apply" element={<Apply />} /> {/* 新增請假申請頁面 */}
            <Route path="/replenish" element={<Replenish />} /> {/* 補卡頁面 */}
            <Route path="/replenishapply" element={<ReplenishApply />} /> {/* 補卡申請頁面 */}
            <Route path="/workovertimeapply" element={<WorkOvertimeApply />} /> {/* 加班申請頁面 */}
            <Route path="/workovertime" element={<WorkOvertime />} /> {/* 加班頁面 */}
            <Route path="/auditsystem" element={<AuditSystem />} /> {/*審核系統頁面 */}
            <Route path="/salary" element={<Salary />} /> {/*薪資查詢頁面 */}
            <Route path="/schedule" element={<Schedule />} /> {/*班表查詢頁面 */}
            <Route path="/announcement" element={<Announcement />} /> {/*公告頁面 */}
            <Route path="/personaldata" element={<PersonalData />} /> {/*個人資料查詢頁面 */}
            
            {/* 網頁版畫面 */}
            <Route path="/checkin" element={<Checkin />} /> {/* 手機打卡畫面 */}
            <Route path="/frontpage" element={<FrontPage />} /> {/* 手機首頁畫面 */}
            <Route path="/applogin" element={<AppLogIn />} /> {/* 手機登入畫面 */}
            
            {/* 給婆婆的打卡登入部分11月要給新朋友的 */}
            <Route path="/apploginpmx" element={<ApploginPMX />} /> {/* 手機登入畫面 */}
            <Route path="/checkinpmx" element={<CheckinPMX />} /> {/* 手機打卡畫面 */}
            <Route path="/frontpagepmx" element={<FrontPagePMX />} /> {/* 手機首頁畫面 */}
            <Route path="/attendancepagepmx" element={<AttendancePagePMX/>} /> {/* 手機查詢打卡畫面 */}
            <Route path="/replenishpmx" element={<ReplenishPMX/>} /> {/* 手機補卡畫面 */}
            <Route path="/replenishapplypmx" element={<ReplenishApplyPMX/>} /> {/* 手機補卡申請畫面 */}
            <Route path="/leavepmx" element={<LeavePagePMX />} />{/* 請假畫面 */}
            <Route path="/applypmx" element={<ApplyPMX />} /> {/* 新增請假申請頁面 */}
            <Route path="/workovertimeapplypmx" element={<WorkOvertimeApplyPMX />} /> {/* 加班申請頁面 */}
            <Route path="/workovertimepmx" element={<WorkOvertimePMX />} /> {/* 加班頁面 */}
            <Route path="/personaldatapmx" element={<PersonalDataPMX />} /> {/* 個人資料查詢頁面 */}
            <Route path="/newemployeespmx" element={<NewEmployeesPMX />} /> {/* 新增員工頁面 */}
            <Route path="/apploginpmx/sso" element={<ApploginPMXsso />} /> {/* 新增員工頁面 */}
            <Route path="/tunqueryresultspmx" element={<TunQueryResultsPmx />} /> {/* 查詢員工出勤頁面 */}
            <Route path="/tunqueryresultspmx" element={<TunQueryResultsPmx />} /> {/* 查詢員工出勤頁面 */}
            <Route path="/tunqueryresultspmxlogin/sso" element={<TunQueryResultsPmxsso />} /> {/* 查詢員工出勤頁面 */}
            <Route path="/tunqueryresultspmxlogin" element={<TunQueryResultsPmxlogin />} /> {/* 查詢員工出勤頁面 */}
            
            {/* Google Sheet 部分 */}
            <Route path="/" element={<AppLogIn01 />} /> {/* 設置默認頁面 */}
            <Route path="/attendance01" element={<AttendancePage01 />} />{/* 查詢出勤畫面 */}
            <Route path="/leave01" element={<LeavePage01 />} />{/* 請假畫面 */}
            <Route path="/apply01" element={<Apply01 />} /> {/* 新增請假申請頁面 */}
            <Route path="/replenish01" element={<Replenish01 />} /> {/* 補卡頁面 */}
            <Route path="/replenishapply01" element={<ReplenishApply01 />} /> {/* 補卡申請頁面 */}
            <Route path="/workovertimeapply01" element={<WorkOvertimeApply01 />} /> {/* 加班申請頁面 */}
            <Route path="/workovertime01" element={<WorkOvertime01 />} /> {/* 加班頁面 */}
            <Route path="/auditsystem01" element={<AuditSystem01 />} /> {/*審核系統頁面 */}
            <Route path="/salary01" element={<Salary01 />} /> {/*薪資查詢頁面 */}
            <Route path="/schedule01" element={<Schedule01 />} /> {/*班表查詢頁面 */}
            <Route path="/announcement01" element={<Announcement01 />} /> {/*公告頁面 */}
            <Route path="/personaldata01" element={<PersonalData01 />} /> {/*個人資料查詢頁面 */}
            <Route path="/applogin01" element={<AppLogIn01 />} /> {/* 手機登入畫面 */}
            <Route path="/frontpage01" element={<FrontPage01 />} /> {/* 手機首頁畫面 */}
            <Route path="/checkin01" element={<Checkin01 />} /> {/* 手機打卡畫面 */}

            {/* 內部查詢資料用 */}
            <Route path="/Queryresults" element={<Queryresults />} /> {/* 打卡記錄查詢 */}
            <Route path="/tunqueryresults" element={<TunQueryResults />} /> {/* 打卡記錄查詢 給朱先生用的 */}
            <Route path="/tunqueryresults" element={<TunQueryResults />} /> {/* 打卡記錄查詢 給朱先生用的 */}
            
            {/* 後台 */}
            <Route path="/human" element={<Human />} /> {/* 後台員工資料畫面 */}
            <Route path="/login" element={<Login />} /> {/* 後台登入畫面 */}
            <Route path="/homepage" element={<HomePage />} /> {/* 後台員工出缺勤況畫面 */}
            <Route path="/addnewmonth" element={<AddNewMonth />} /> {/* 排班系統畫面新增月份 */}
            <Route path="/schedulingsystem" element={<SchedulingSystem />} /> {/* 正式排班畫面 */}
            <Route path="/salarycalculate" element={<SalaryCalculate />} /> {/* 薪資計算畫面 */}
            <Route path="/cmpanyinformation" element={<CompanyInformation />} /> {/* 甲方公司資料設定 */}
            <Route path="/permissions" element={<Permissions />} /> {/* 權限設定頁面 */}
            <Route path="/hypothesissetting" element={<HypothesisSetting />} /> {/* 假別設定頁面 */}
            <Route path="/uploadannouncement" element={<UploadAnnouncement />} /> {/* 假別設定頁面 */}

          </Routes>
        </Router>
      </EmployeeProvider>
    </LanguageProvider>
  );
}

function Sheet() {
  return (
    <LanguageProvider>
      <EmployeeProvider>
        <Router>
          <Routes>
            {/* 網頁畫面 */}
            <Route path="/attendance01" element={<AttendancePage01 />} />{/* 查詢出勤畫面 */}
            <Route path="/leave01" element={<LeavePage01 />} />{/* 請假畫面 */}
            <Route path="/apply01" element={<Apply01 />} /> {/* 新增請假申請頁面 */}
            <Route path="/replenish01" element={<Replenish01 />} /> {/* 補卡頁面 */}
            <Route path="/replenishapply01" element={<ReplenishApply01 />} /> {/* 補卡申請頁面 */}
            <Route path="/workovertimeapply01" element={<WorkOvertimeApply01 />} /> {/* 加班申請頁面 */}
            <Route path="/workovertime01" element={<WorkOvertime01 />} /> {/* 加班頁面 */}
            <Route path="/auditsystem01" element={<AuditSystem01 />} /> {/*審核系統頁面 */}
            <Route path="/salary01" element={<Salary01 />} /> {/*薪資查詢頁面 */}
            <Route path="/schedule01" element={<Schedule01 />} /> {/*班表查詢頁面 */}
            <Route path="/announcement01" element={<Announcement01 />} /> {/*公告頁面 */}
            <Route path="/personaldata01" element={<PersonalData01 />} /> {/*個人資料查詢頁面 */}
            <Route path="/applogin01" element={<AppLogIn01 />} /> {/* 手機登入畫面 */}
            <Route path="/frontpage01" element={<FrontPage01 />} /> {/* 手機首頁畫面 */}
            <Route path="/checkin01" element={<Checkin01 />} /> {/* 手機打卡畫面 */}
            {/* 內部查詢資料用 */}
            <Route path="/Queryresults" element={<Queryresults />} /> {/* 打卡記錄查詢 */}
            <Route path="/tunqueryresults" element={<TunQueryResults />} /> {/* 打卡記錄查詢 給朱先生用的 */}
            {/* 後台 */}
            <Route path="/human" element={<Human />} /> {/* 後台員工資料畫面 */}
            <Route path="/login" element={<Login />} /> {/* 後台登入畫面 */}
            <Route path="/homepage" element={<HomePage />} /> {/* 後台首頁畫面 */}
            <Route path="/addnewmonth" element={<AddNewMonth />} /> {/* 排班系統畫面新增月份 */}
            <Route path="/schedulingsystem" element={<SchedulingSystem />} /> {/* 正式排班畫面 */}
            <Route path="/salarycalculate" element={<SalaryCalculate />} /> {/* 薪資計算畫面 */}
          </Routes>
        </Router>
      </EmployeeProvider>
    </LanguageProvider>
  );
}

export { App, Sheet };
