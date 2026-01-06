var express = require("express");
var app = express();
const moment = require('moment-timezone');
var bodyParser = require("body-parser"); // request body 解析
var cookieParser = require("cookie-parser"); // cookie解析
var http = require("https");
const path = require('path');
var fs = require("fs");

// -- 確保日誌目錄存在 --
const logDir = './Log';
const errLogDir = './Log/err';

// 檢查並創建日誌目錄
try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    if (!fs.existsSync(errLogDir)) {
        fs.mkdirSync(errLogDir, { recursive: true });
    }
} catch (err) {
    console.error("創建日誌目錄失敗:", err);
}

// -- config讀取套件 --
const configjs = require("./config");
// 修正 SSL 證書路徑
var privateKey = fs.readFileSync("/home/mio7685411/police_ams_api/serverKey/private.key");
var certificate = fs.readFileSync("/home/mio7685411/police_ams_api/serverKey/ca.crt");

const DBServer_Url = configjs.api.chiDB_url;
// check running enviroment
var PORT = configjs.api.PORT;
var DOMAIN = configjs.api.DOMAIN;
var cors = require("cors"); // 跨域處理套件
const request = require('request');
var compression = require('compression');

// 創建日誌檔案名稱
const currentDate = moment().format("YYYY-MM-DD");
const errfile = `${errLogDir}/node_error_${currentDate}.log`;

// 保存原始的 stderr.write 方法
var origstderr = process.stderr.write;

process.stderr.write = function (chunk) {
    try {
        fs.appendFile(errfile, chunk.replace(/\x1b\[[0-9;]*m/g, ''), (err) => {
            if (err) {
                console.error("寫入錯誤日誌失敗:", err);
            }
        });
    } catch (err) {
        console.error("處理錯誤日誌時發生錯誤:", err);
    }
    origstderr.apply(this, arguments);
}; // 將錯誤訊息記錄到檔案中

// 全域錯誤處理
process.on('uncaughtException', (err) => {
    const errorMsg = `[${moment().format("YYYY-MM-DD HH:mm:ss")}] 未捕獲的異常: ${err.message}\n${err.stack}\n`;
    try {
        fs.appendFile(errfile, errorMsg, (err) => {
            if (err) {
                console.error("寫入錯誤日誌失敗:", err);
            }
        });
    } catch (e) {
        console.error("處理錯誤日誌時發生錯誤:", e);
    }
    // 不立即結束程序，讓服務繼續運行
});

process.on('unhandledRejection', (reason, promise) => {
    const errorMsg = `[${moment().format("YYYY-MM-DD HH:mm:ss")}] 未處理的 Promise 拒絕: ${reason}\n`;
    try {
        fs.appendFile(errfile, errorMsg, (err) => {
            if (err) {
                console.error("寫入錯誤日誌失敗:", err);
            }
        });
    } catch (e) {
        console.error("處理錯誤日誌時發生錯誤:", e);
    }
});

// 中間件設定
app.use(cookieParser()); // 解析請求中的 Cookie
app.use(compression()); // 使用 Gzip 或其他壓縮算法壓縮 HTTP 回應，減少傳輸的數據量，提高效能
app.use(cors()); // 跨域處理
app.use(express.json({ limit: '2mb' })); // for parsing application/json
app.use(express.urlencoded({ limit: '2mb', extended: true })); // for parsing application/x-www-form-urlencoded

// 添加健康檢查端點供監控
app.get("/health", function (req, res) {
    res.status(200).json({
        status: "healthy",
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        uptime: process.uptime()
    });
});

// SSL
const options = {
    key: privateKey,
    cert: certificate
};

// 創建服務器
var server = http.createServer(options, app);

// 啟動服務器並處理可能的錯誤
server.listen(PORT, DOMAIN, function () {
    console.log(`服務器已啟動: https://${DOMAIN}:${PORT}`);
});

// 處理服務器錯誤
server.on('error', function (err) {
    console.error(`服務器錯誤: ${err.message}`);
    try {
        fs.appendFile(errfile, `[${moment().format("YYYY-MM-DD HH:mm:ss")}] 服務器錯誤: ${err.message}\n`, (err) => {
            if (err) {
                console.error("寫入錯誤日誌失敗:", err);
            }
        });
    } catch (e) {
        console.error("處理錯誤日誌時發生錯誤:", e);
    }
});

// 生成表單編號的輔助函數 - 注意：此函數在此檔案中定義但未使用，實際使用的是 function/form.js 中的函數
function generateFormNumber() {
    const prefix = 'FORM';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 使用4位隨機數
    return `${prefix}-${timestamp}-${random}`;
}

// 檢查表單編號是否已存在 - 注意：此函數在此檔案中定義但未使用，實際使用的是 function/form.js 中的函數
async function checkFormNumberExists(form_number) {
    try {
        const existingForm = await ApplicationForm.findOne({
            where: { form_number: form_number },
            raw: true
        });
        return existingForm !== null;
    } catch (error) {
        console.error("檢查表單編號存在性時出錯:", error);
        throw error;
    }
}

// 測試路由
app.post("/Test", function (req, res) {
    var ReqData = req.body;
    var headers = req.headers;
    var DataRow = {
        "Title": "success",
        "Date": moment().format("YYYY-MM-DD HH:mm:ss")
    };
    res.send(DataRow);
});

app.post("/testdbconnection", function (req, res) {
    try {
        // 嘗試執行一個簡單的查詢
        //await ApplicationForm.findOne();
        var DataRow = {
            Status: "Ok",
            Msg: "資料庫連接成功",
            Timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        res.status(200).send(DataRow);
    } catch (error) {
        console.error("資料庫連接測試失敗:", error);
        res.status(500).send({
            Status: "Failed",
            Msg: "資料庫連接失敗",
            Error: error.message || "未知錯誤",
            Timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
        });
    }
});

// 引入表單相關模型 - 放在API上方
const Form = require('./table/form');
const LeaveApplication = require('./table/leave_applications');
const ReplenishApplication = require('./table/replenish_applications');
const WorkOvertimeApplication = require('./table/work_overtime_applications');

const formFunctions = require('./function/form');

// 員工登入驗證 API
app.post("/api/employee/login", async function (req, res) {
    try {
        const { company_id, employee_id, password } = req.body;
        
        // 驗證必要參數
        if (!company_id || !employee_id || !password) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: company_id, employee_id 或 password"
            });
        }
        
        // 呼叫驗證函數
        const result = await formFunctions.validateEmployeeCredentials(
            company_id,
            employee_id,
            password
        );
        
        // 根據驗證結果回應
        if (result.Status === "Ok") {
            // 驗證成功
            return res.status(200).json(result);
        } else {
            // 驗證失敗
            return res.status(401).json(result);
        }
    } catch (error) {
        console.error("員工登入API錯誤:", error);
        return res.status(500).json({
            Status: "Failed",
            Msg: "伺服器內部錯誤",
            Error: error.message || "未知錯誤"
        });
    }
});

// 舊版 API 路由 - 保持向後兼容性
app.post("/employee/login", async function (req, res) {
    try {
        const { company_id, employee_id, password } = req.body;
        
        // 驗證必要參數
        if (!company_id || !employee_id || !password) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: company_id, employee_id 或 password"
            });
        }
        
        // 呼叫驗證函數
        const result = await formFunctions.validateEmployeeCredentials(
            company_id,
            employee_id,
            password
        );
        
        // 根據驗證結果回應
        if (result.Status === "Ok") {
            // 驗證成功
            return res.status(200).json(result);
        } else {
            // 驗證失敗
            return res.status(401).json(result);
        }
    } catch (error) {
        console.error("員工登入API錯誤:", error);
        return res.status(500).json({
            Status: "Failed",
            Msg: "伺服器內部錯誤",
            Error: error.message || "未知錯誤"
        });
    }
});

// API 路由 - 標準化格式
// 獲取所有申請表單
app.get("/api/forms", function (req, res) {
    try {
        formFunctions.ReadApplicationForms()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({
                    Status: "Failed",
                    Msg: "查詢申請表單失敗",
                    Error: err.message || "未知錯誤"
                });
            });
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "系統處理請求時發生錯誤"
        });
    }
});

// 根據表單編號獲取特定申請表單
app.get("/api/forms/:formNumber", function (req, res) {
    const formNumber = req.params.formNumber;
    try {
        formFunctions.ReadApplicationFormById(formNumber)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({
                    Status: "Failed",
                    Msg: `查詢表單編號為 ${formNumber} 的申請表單失敗`,
                    Error: err.message || "未知錯誤"
                });
            });
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "系統處理請求時發生錯誤"
        });
    }
});

// 處理申請表單提交
app.post("/api/forms", async function (req, res) {
    try {
        const result = await formFunctions.CreateApplicationForm(req.body);
        res.status(result.Status === "Ok" ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "申請表單提交處理失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：查詢所有已審核表單 API
app.get("/api/forms/approved", async function (req, res) {
    try {
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            status: req.query.status, // 可以是 'approved' 或 'rejected'
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetApprovedForms(criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 獲取主管待審核的表單 - 新API
app.get("/api/supervisor/pending-forms/:reviewerName", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            start_date_from: req.query.start_date_from,
            start_date_to: req.query.start_date_to,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetSupervisorPendingForms(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取主管待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：查詢特定審核人的已審核表單 API
app.get("/api/supervisor/approved-forms/:reviewerName", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            status: req.query.status, // 可以是 'approved' 或 'rejected'
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetApprovedFormsByReviewer(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取審核人已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 主管審核表單 - 修改版本（支持自動設置HR審核人）
app.put("/api/supervisor/approve-form/:formNumber", async function (req, res) {
    try {
        const formNumber = req.params.formNumber;
        const reviewerData = req.body;
        
        // 檢查必要參數
        if (!reviewerData.status || !reviewerData.reviewer_name) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: 審核狀態或審核人姓名"
            });
        }
        
        // 如果審核通過，自動查詢並設置 HR 審核人
        if (reviewerData.status === "approved") {
            try {
                console.log(`正在查詢 ${reviewerData.reviewer_name} 的上級主管...`);
                const hrReviewer = await formFunctions.getEmployeeSupervisor(reviewerData.reviewer_name);
                
                if (hrReviewer && hrReviewer.Status === "Ok") {
                    reviewerData.hrreviewer_name = hrReviewer.Data.supervisor_name;
                    reviewerData.hrreviewer_job_grade = hrReviewer.Data.supervisor_job_grade;
                    console.log(`自動設置 HR 審核人: ${hrReviewer.Data.supervisor_name} (${hrReviewer.Data.supervisor_job_grade})`);
                } else {
                    console.log(`無法找到 ${reviewerData.reviewer_name} 的上級主管，將不設置 HR 審核人`);
                    console.log(`錯誤詳情: ${hrReviewer ? hrReviewer.Msg : '未知錯誤'}`);
                }
            } catch (error) {
                console.error("查詢上級主管時發生錯誤:", error);
                // 繼續處理，但不設置 HR 審核人
            }
        }
        
        const result = await formFunctions.SupervisorApproveForm(formNumber, reviewerData);
        
        // 在回應中加入 HR 審核人設置的資訊
        if (result.Status === "Ok" && reviewerData.hrreviewer_name) {
            result.Data.auto_hr_reviewer_set = true;
            result.Data.hr_reviewer_name = reviewerData.hrreviewer_name;
            result.Data.hr_reviewer_job_grade = reviewerData.hrreviewer_job_grade;
            result.Msg += `，已自動設置 HR 審核人: ${reviewerData.hrreviewer_name}`;
        }
        
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        console.error("主管審核表單失敗:", error);
        res.status(500).json({
            Status: "Failed",
            Msg: "主管審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});


// // 主管審核表單 - 新API
// app.put("/api/supervisor/approve-form/:formNumber", async function (req, res) {
//     try {
//         const formNumber = req.params.formNumber;
//         const reviewerData = req.body;
        
//         // 檢查必要參數
//         if (!reviewerData.status || !reviewerData.reviewer_name) {
//             return res.status(400).json({
//                 Status: "Failed",
//                 Msg: "缺少必要參數: 審核狀態或審核人姓名"
//             });
//         }
        
//         const result = await formFunctions.SupervisorApproveForm(formNumber, reviewerData);
//         res.status(result.Status === "Ok" ? 200 : 400).json(result);
//     } catch (error) {
//         res.status(500).json({
//             Status: "Failed",
//             Msg: "主管審核表單失敗",
//             Error: error.message || "未知錯誤"
//         });
//     }
// });

// ========== 新增：HR 審核相關 API 路由 ==========

// 獲取HR待審核的表單 API
app.get("/api/hr/pending-forms/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            start_date_from: req.query.start_date_from,
            start_date_to: req.query.start_date_to,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRPendingForms(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// HR審核表單 API
app.put("/api/hr/approve-form/:formNumber", async function (req, res) {
    try {
        const formNumber = req.params.formNumber;
        const hrReviewerData = req.body;
        
        // 檢查必要參數
        if (!hrReviewerData.hrstatus || !hrReviewerData.hrreviewer_name) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: HR審核狀態或HR審核人姓名"
            });
        }
        
        const result = await formFunctions.HRApproveForm(formNumber, hrReviewerData);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "HR審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 獲取HR已審核的表單 API
app.get("/api/hr/approved-forms/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            hrstatus: req.query.hrstatus, // 可以是 'approved' 或 'rejected'
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            hr_review_date_from: req.query.hr_review_date_from,
            hr_review_date_to: req.query.hr_review_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRApprovedForms(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 獲取表單審核歷史 - 新API
app.get("/api/forms/approval-history", async function (req, res) {
    try {
        // 從查詢參數中獲取篩選條件
        const criteria = {
            form_number: req.query.form_number,
            reviewer: req.query.reviewer,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            department: req.query.department,
            status: req.query.status,
            category: req.query.category,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetFormApprovalHistory(criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取表單審核歷史失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// ========== 新增：使用 ReviewView 的新 API 路由 ==========




// 新增：使用 ReviewView 查詢審核人的特定狀態表單 API
app.get("/api/reviewer/:reviewerName/forms", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        const status = req.query.status; // pending, approved, rejected 或不指定
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetFormsByReviewerAndStatus(reviewerName, status, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "查詢審核人表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：使用 ReviewView 查詢審核人的待審核表單（新版）API
app.get("/api/reviewer/:reviewerName/pending", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetPendingFormsByReviewerNew(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "查詢審核人待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：使用 ReviewView 查詢審核人的已核准表單（新版）API
app.get("/api/reviewer/:reviewerName/approved", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetApprovedFormsByReviewerNew(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "查詢審核人已核准表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});
app.get("/api/reviewer/:reviewerName/approved_pending_hr", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        // 修改：使用 GetFormsByReviewerAndStatus 並指定狀態為 'approved_pending_hr'
        const result = await formFunctions.GetFormsByReviewerAndStatus(reviewerName, 'approved_pending_hr', criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "查詢等待HR審核表單失敗", // 修改錯誤訊息
            Error: error.message || "未知錯誤"
        });
    }
});


// 新增：使用 ReviewView 查詢審核人的已拒絕表單 API
app.get("/api/reviewer/:reviewerName/rejected", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetRejectedFormsByReviewer(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "查詢審核人已拒絕表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：使用 ReviewView 分頁查詢所有表單 API
app.get("/api/forms/pagination", async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            reviewer: req.query.reviewer,
            status: req.query.status,
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetAllReviewFormsWithPagination(page, limit, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "分頁查詢表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：使用 ReviewView 查詢所有表單（不分頁）API
app.get("/api/forms/all", async function (req, res) {
    try {
        // 從查詢參數中獲取篩選條件
        const criteria = {
            reviewer: req.query.reviewer,
            status: req.query.status,
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetAllReviewForms(criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "查詢所有表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：使用 ReviewView 進行高級搜尋 API
app.post("/api/forms/advanced-search", async function (req, res) {
    try {
        const searchCriteria = req.body;
        
        const result = await formFunctions.AdvancedSearchForms(searchCriteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "高級搜尋表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：獲取審核統計資料 API
app.get("/api/statistics/review", async function (req, res) {
    try {
        const reviewerName = req.query.reviewer; // 可選，如果不提供則返回全體統計
        
        const result = await formFunctions.GetReviewStatistics(reviewerName);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取審核統計失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：簡化查詢審核人表單 API（不包含詳細資料）
app.get("/api/reviewer/:reviewerName/simple", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            status: req.query.status,
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetFormsByReviewerSimple(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "簡化查詢審核人表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：獲取表單詳細資料 API
app.get("/api/forms/:formNumber/details", async function (req, res) {
    try {
        const formNumber = req.params.formNumber;
        const category = req.query.category;
        
        if (!category) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: category"
            });
        }
        
        const result = await formFunctions.GetFormDetails(formNumber, category);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取表單詳細資料失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：獲取表單完整資訊 API（包含基本資訊和詳細資料）
app.get("/api/forms/:formNumber/complete", async function (req, res) {
    try {
        const formNumber = req.params.formNumber;
        
        const result = await formFunctions.GetCompleteFormInfo(formNumber);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取表單完整資訊失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 保留舊的路由以向後兼容
app.get("/application-forms", function (req, res) {
    try {
        formFunctions.ReadApplicationForms()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({
                    Status: "Failed",
                    Msg: "查詢申請表單失敗",
                    Error: err.message || "未知錯誤"
                });
            });
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "系統處理請求時發生錯誤"
        });
    }
});

app.get("/application-form/:id", function (req, res) {
    const id = req.params.id;
    try {
        formFunctions.ReadApplicationFormById(id)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({
                    Status: "Failed",
                    Msg: `查詢ID為 ${id} 的申請表單失敗`,
                    Error: err.message || "未知錯誤"
                });
            });
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "系統處理請求時發生錯誤"
        });
    }
});

app.post("/application-forms", async function (req, res) {
    try {
        const result = await formFunctions.CreateApplicationForm(req.body);
        res.status(result.Status === "Ok" ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "申請表單提交處理失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 為舊版API添加主管審核相關功能
app.get("/supervisor/pending-forms/:reviewerName", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            start_date_from: req.query.start_date_from,
            start_date_to: req.query.start_date_to,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetSupervisorPendingForms(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取主管待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

app.get("/supervisor/approved-forms/:reviewerName", async function (req, res) {
    try {
        const reviewerName = req.params.reviewerName;
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            status: req.query.status,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetApprovedFormsByReviewer(reviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取審核人已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

app.put("/supervisor/approve-form/:formNumber", async function (req, res) {
    try {
        const formNumber = req.params.formNumber;
        const reviewerData = req.body;
        
        // 確保審核狀態存在
        if (!reviewerData.status) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: 審核狀態"
            });
        }
        
        // 如果前端沒有提供審核人姓名，使用請求中的其他信息
        // 實際情況中，您可能需要從 JWT token 或 session 中獲取當前用戶信息
        // 這裡假設 reviewerData 中已包含從 context 獲取的 supervisor 值
        if (!reviewerData.reviewer_name && reviewerData.supervisor) {
            reviewerData.reviewer_name = reviewerData.supervisor;
        }
        
        // 仍然檢查 reviewer_name 是否存在
        if (!reviewerData.reviewer_name) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: 審核人姓名"
            });
        }
        
        const result = await formFunctions.SupervisorApproveForm(formNumber, reviewerData);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "主管審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// ========== 舊版 HR API 路由（向後兼容） ==========

// 舊版HR待審核表單 API
app.get("/hr/pending-forms/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            start_date_from: req.query.start_date_from,
            start_date_to: req.query.start_date_to,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRPendingForms(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 舊版HR審核表單 API
app.put("/hr/approve-form/:formNumber", async function (req, res) {
    try {
        const formNumber = req.params.formNumber;
        const hrReviewerData = req.body;
        
        if (!hrReviewerData.hrstatus || !hrReviewerData.hrreviewer_name) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: HR審核狀態或HR審核人姓名"
            });
        }
        
        const result = await formFunctions.HRApproveForm(formNumber, hrReviewerData);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "HR審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 舊版HR已審核表單 API
app.get("/hr/approved-forms/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            hrstatus: req.query.hrstatus,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            hr_review_date_from: req.query.hr_review_date_from,
            hr_review_date_to: req.query.hr_review_date_to
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRApprovedForms(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

app.get("/forms/approval-history", async function (req, res) {
    try {
        const criteria = {
            form_number: req.query.form_number,
            reviewer: req.query.reviewer,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            department: req.query.department,
            status: req.query.status,
            category: req.query.category,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetFormApprovalHistory(criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取表單審核歷史失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 查詢員工基本資料 API - 新API
app.get("/api/employee", async function (req, res) {
    try {
        const { company_id, employee_id } = req.query;
        
        // 驗證必要參數
        if (!company_id || !employee_id) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: company_id 或 employee_id"
            });
        }
        
        // 呼叫查詢函數
        const result = await formFunctions.getEmployeeInfo(
            parseInt(company_id),
            parseInt(employee_id)
        );
        
        // 根據查詢結果回應
        if (result.Status === "Ok") {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("查詢員工基本資料API錯誤:", error);
        return res.status(500).json({
            Status: "Failed",
            Msg: "伺服器內部錯誤",
            Error: error.message || "未知錯誤"
        });
    }
});

// 舊版 API 路由 - 保持向後兼容性
app.get("/employee", async function (req, res) {
    try {
        const { company_id, employee_id } = req.query;
        
        // 驗證必要參數
        if (!company_id || !employee_id) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: company_id 或 employee_id"
            });
        }
        
        // 呼叫查詢函數
        const result = await formFunctions.getEmployeeInfo(
            parseInt(company_id),
            parseInt(employee_id)
        );
        
        // 根據查詢結果回應
        if (result.Status === "Ok") {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("查詢員工基本資料API錯誤:", error);
        return res.status(500).json({
            Status: "Failed",
            Msg: "伺服器內部錯誤",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增一個 POST 端點，輸入員工統編帳號，可以查詢員工基本資料
app.post("/api/employee/info", async function (req, res) {
    try {
        const { company_id, employee_id, password } = req.body;
        
        // 驗證必要參數
        if (!company_id || !employee_id || !password) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要參數: company_id、employee_id 或 password"
            });
        }
        
        // 先驗證員工憑證
        const validationResult = await formFunctions.validateEmployeeCredentials(
            parseInt(company_id),
            parseInt(employee_id),
            password
        );
        
        // 如果驗證失敗，返回錯誤
        if (validationResult.Status !== "Ok") {
            return res.status(401).json(validationResult);
        }
        
        // 驗證成功，直接使用驗證結果中的員工資料
        return res.status(200).json(validationResult);
        
    } catch (error) {
        console.error("查詢員工基本資料API錯誤:", error);
        return res.status(500).json({
            Status: "Failed",
            Msg: "伺服器內部錯誤",
            Error: error.message || "未知錯誤"
        });
    }
});

app.post("/api/employee/verify-cookies", async function (req, res) {
    try {
        // 從 cookies 中獲取資料
        const company_id = req.cookies.company_id;
        const employee_id = req.cookies.employee_id;
        const password = req.cookies.password;
        
        // 檢查 cookies 是否存在所需資料
        if (!company_id || !employee_id || !password) {
            return res.status(400).json({
                Status: "Failed",
                Msg: "缺少必要的 cookies: company_id、employee_id 或 password",
                IsValid: false
            });
        }
        
        // 呼叫驗證函數檢查憑證是否有效
        const result = await formFunctions.validateEmployeeCredentials(
            parseInt(company_id),
            parseInt(employee_id),
            password
        );
        
        // 根據驗證結果回應
        if (result.Status === "Ok") {
            // 驗證成功
            return res.status(200).json({
                Status: "Ok",
                Msg: "員工憑證驗證成功",
                IsValid: true,
                Data: result.Data
            });
        } else {
            // 驗證失敗
            return res.status(401).json({
                Status: "Failed",
                Msg: "員工憑證驗證失敗",
                IsValid: false
            });
        }
    } catch (error) {
        console.error("驗證員工 cookies API 錯誤:", error);
        return res.status(500).json({
            Status: "Failed",
            Msg: "伺服器內部錯誤",
            IsValid: false,
            Error: error.message || "未知錯誤"
        });
    }
});
// ========== 新增：使用 HrPendingReviewView 的 HR API 路由 ==========

// 新增：使用新視圖獲取HR待審核表單 API
app.get("/api/hr/pending-forms-new/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            start_date_from: req.query.start_date_from,
            start_date_to: req.query.start_date_to,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRPendingFormsNew(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：使用新視圖獲取HR已審核表單 API
app.get("/api/hr/approved-forms-new/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            hrstatus: req.query.hrstatus, // 可以是 'approved' 或 'rejected'
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            review_date_from: req.query.review_date_from,
            review_date_to: req.query.review_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRApprovedFormsNew(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：HR表單分頁查詢 API
app.get("/api/hr/forms/pagination", async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            hrreviewer: req.query.hrreviewer,
            hrstatus: req.query.hrstatus,
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRFormsWithPagination(page, limit, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "HR表單分頁查詢失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：獲取HR審核統計資料 API
app.get("/api/statistics/hr-review", async function (req, res) {
    try {
        const hrReviewerName = req.query.hrreviewer; // 可選，如果不提供則返回全體HR統計
        
        const result = await formFunctions.GetHRReviewStatistics(hrReviewerName);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR審核統計失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 新增：HR審核人的簡化查詢 API（不包含詳細資料）
app.get("/api/hr/:hrReviewerName/simple", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        
        // 從查詢參數中獲取篩選條件
        const criteria = {
            hrstatus: req.query.hrstatus,
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to
        };
        
        // 移除未定義的篩選條件
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRPendingFormsNew(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "簡化查詢HR表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// ========== 舊版 HR API 路由（向後兼容）- 使用新視圖 ==========

// 舊版HR待審核表單 API（使用新視圖）
app.get("/hr/pending-forms-new/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            start_date_from: req.query.start_date_from,
            start_date_to: req.query.start_date_to,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRPendingFormsNew(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR待審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

// 舊版HR已審核表單 API（使用新視圖）
app.get("/hr/approved-forms-new/:hrReviewerName", async function (req, res) {
    try {
        const hrReviewerName = req.params.hrReviewerName;
        const criteria = {
            category: req.query.category,
            company_id: req.query.company_id ? parseInt(req.query.company_id) : undefined,
            department: req.query.department,
            employee_id: req.query.employee_id ? parseInt(req.query.employee_id) : undefined,
            hrstatus: req.query.hrstatus,
            application_date_from: req.query.application_date_from,
            application_date_to: req.query.application_date_to,
            includeDetails: req.query.includeDetails === 'true'
        };
        
        Object.keys(criteria).forEach(key => {
            if (criteria[key] === undefined) {
                delete criteria[key];
            }
        });
        
        const result = await formFunctions.GetHRApprovedFormsNew(hrReviewerName, criteria);
        res.status(result.Status === "Ok" ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            Status: "Failed",
            Msg: "獲取HR已審核表單失敗",
            Error: error.message || "未知錯誤"
        });
    }
});

module.exports = app;
