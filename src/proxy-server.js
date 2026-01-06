const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { networkInterfaces } = require('os');
const https = require('https');

const app = express();

// 請求日誌中間件
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url} [開始] ${new Date().toISOString()}`);
  console.log(`來源IP: ${req.ip}, 來源主機: ${req.headers['host']}, 來源: ${req.headers['origin'] || '未知'}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} [完成] ${duration}ms`);
  });
  
  next();
});

// 增強的 CORS 配置 - 允許所有來源
app.use(cors({
  origin: '*', // 允許所有來源，生產環境可能需要限制
  credentials: true, // 允許帶憑證的請求
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 添加私有網路存取支援
app.use((req, res, next) => {
  res.setHeader('Access-Control-Request-Private-Network', 'true');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));

// 明確處理所有路徑的 OPTIONS 請求
app.options('*', cors());

// 健康檢查端點
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: '代理伺服器正常運行中',
    server_info: {
      hostname: require('os').hostname(),
      platform: process.platform,
      uptime: process.uptime()
    }
  });
});

// 原始處理代理請求的端點
app.post('/api/process-query', async (req, res) => {
  try {
    console.log('收到代理請求:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    const response = await axios.post(
      'https://uclerpnext.54ucl.com/erp-gateway/process-query',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超時
      }
    );
    
    console.log('代理請求成功，響應狀態:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('代理請求失敗:', error.message);
    
    // 詳細錯誤信息
    const errorDetails = {
      error: '代理請求失敗',
      message: error.message,
      code: error.code,
      status: error.response ? error.response.status : undefined,
      details: error.response ? error.response.data : undefined
    };
    
    console.error('錯誤詳情:', JSON.stringify(errorDetails));
    res.status(error.response ? error.response.status : 500).json(errorDetails);
  }
});

// 新增: 通用代理端點，可以處理任何目標伺服器的請求
app.post('/api/attendance', async (req, res) => {
  try {
    console.log('收到出勤代理請求:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    // 從請求體中獲取目標伺服器
    const targetServer = req.body.target_server || 'http://163.18.46.91:3001/api/process-query';
    
    // 移除目標伺服器字段，避免發送到實際API
    const requestBody = {...req.body};
    delete requestBody.target_server;
    
    console.log(`轉發請求到: ${targetServer}`);
    
    // 創建一個忽略SSL錯誤的axios實例 (僅用於HTTP目標)
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
    
    const response = await axiosInstance.post(
      targetServer,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超時
      }
    );
    
    console.log('代理請求成功，響應狀態:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('出勤代理請求失敗:', error.message);
    
    // 詳細錯誤信息
    const errorDetails = {
      error: '代理請求失敗',
      message: error.message,
      code: error.code,
      status: error.response ? error.response.status : undefined,
      details: error.response ? error.response.data : undefined
    };
    
    console.error('錯誤詳情:', JSON.stringify(errorDetails));
    res.status(error.response ? error.response.status : 500).json(errorDetails);
  }
});

// 處理根路徑請求 - 提供簡單的 HTML 頁面
app.get('/', (req, res) => {
  const interfaces = networkInterfaces();
  let ipAddresses = [];
  
  // 獲取所有網絡接口的 IP 地址
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // 只顯示 IPv4 地址且非內部地址
      if (net.family === 'IPv4' && !net.internal) {
        ipAddresses.push(net.address);
      }
    }
  }

  const PORT = process.env.PORT || 3001;

  res.send(`
    <html>
      <head>
        <title>API 代理伺服器</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .endpoint { background: #f4f4f4; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
          code { background: #eee; padding: 2px 5px; border-radius: 3px; }
          .ip-list { margin-top: 20px; }
          .ip-address { font-weight: bold; color: #3a75b5; }
        </style>
      </head>
      <body>
        <h1>API 代理伺服器</h1>
        <p>伺服器正在運行中。可用的端點:</p>
        
        <div class="endpoint">
          <h3>健康檢查</h3>
          <code>GET /health</code>
        </div>
        
        <div class="endpoint">
          <h3>處理查詢</h3>
          <code>POST /api/process-query</code>
        </div>
        
        <div class="endpoint">
          <h3>出勤查詢代理</h3>
          <code>POST /api/attendance</code>
        </div>
        
        <div class="ip-list">
          <h3>伺服器 IP 地址:</h3>
          <ul>
            ${ipAddresses.map(ip => `<li class="ip-address">${ip}:${PORT}</li>`).join('')}
          </ul>
          <p>前端應用需要連接到上述其中一個地址</p>
        </div>
        
        <p>伺服器時間: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({ error: '伺服器內部錯誤', message: err.message });
});

// 修改監聽設定，允許從其他設備訪問
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`代理伺服器運行在 http://localhost:${PORT}`);
  
  // 顯示所有網絡接口的 IP 地址
  console.log('可通過以下 IP 地址訪問:');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // 只顯示 IPv4 地址且非內部地址
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`http://${net.address}:${PORT}`);
      }
    }
  }
});
