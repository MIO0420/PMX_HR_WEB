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

const ApplicationForm = require('./table/ApplicationForm');

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

const formFunctions = require('./function/form');
// 處理申請表單提交
app.post("/application-forms", async function (req, res) {
    try {
        const result = await formFunctions.CreateApplicationForm(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.Status === "Failed" && error.Msg.includes("缺少必要參數") ? 400 : 500).json(error);
    }
});

// 新增申請表單相關的API
/*const FormFunctions = require('./Function/form');

// 獲取所有申請表單
app.post("/application-forms", function (req, res) {
    try {
        FormFunctions.ReadApplicationForms()
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

// 根據ID獲取特定申請表單
app.post("/application-form/:id", function (req, res) {
    const id = req.params.id;
    try {
        FormFunctions.ReadApplicationFormById(id)
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
});*/

// 處理申請表單提交
// 引入您的 ApplicationForm 模型

// 添加測試路由

// 添加 POST 路由處理資料插入
// app.post("/application-forms", async function (req, res) {
//     try {
//         const formData = req.body;
        
//         // 檢查必填欄位
//         if (!formData.BillNO || !formData.Meterial_ID || !formData.CustomerID || formData.Flag === undefined) {
//             return res.status(400).json({
//                 Status: "Failed",
//                 Msg: "缺少必要參數: BillNO, Meterial_ID, CustomerID 或 Flag"
//             });
//         }
        
//         // 創建記錄
//         const result = await ApplicationForm.create(formData);
        
//         res.status(201).json({
//             Status: "Ok",
//             Msg: "資料成功插入",
//             Data: result
//         });
        
//     } catch (error) {
//         console.error("插入資料錯誤:", error);
//         res.status(500).json({
//             Status: "Failed",
//             Msg: "資料插入失敗: " + (error.message || "系統處理請求時發生錯誤")
//         });
//     }
// });

