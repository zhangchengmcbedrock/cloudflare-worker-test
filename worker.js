// 引入根目录下的 station_name.js 数据文件
import './station_name.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 解析 station_names 字符串，提取所有中文车站名
function parseStations() {
  // 正则匹配：@xxx|中文车站名|... 的格式，提取中文车站名
  const regex = /@[^|]+\|([^|]+)\|/g;
  const stations = [];
  let match;
  
  // 循环匹配所有车站
  while ((match = regex.exec(station_names)) !== null) {
    const stationName = match[1].trim();
    // 去重（避免重复车站）
    if (stationName && !stations.includes(stationName)) {
      stations.push(stationName);
    }
  }
  return stations;
}

async function handleRequest(request) {
  const stations = parseStations();
  // 随机选择一个车站
  const randomStation = stations[Math.floor(Math.random() * stations.length)] || "未获取到车站数据";

  // 构建响应页面
  const html = `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机火车站选择器</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif; 
        background: linear-gradient(120deg, #e0f7fa 0%, #f5fafe 100%); 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 1rem; 
      }
      .card { 
        background: #fff; 
        padding: 3rem 2rem; 
        border-radius: 16px; 
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); 
        max-width: 550px; 
        width: 100%; 
        text-align: center; 
      }
      h1 { 
        color: #263238; 
        font-size: 2rem; 
        margin-bottom: 2.5rem; 
        font-weight: 600; 
      }
      .station-display { 
        font-size: 3rem; 
        font-weight: bold; 
        color: #0288d1; 
        margin: 2rem 0; 
        padding: 1.5rem; 
        border: 2px dashed #7986cb; 
        border-radius: 12px; 
        background: #f8f9fa; 
        word-break: break-all; 
      }
      .refresh-btn { 
        padding: 1.2rem 2.5rem; 
        font-size: 1.1rem; 
        color: #fff; 
        background: #26a69a; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer; 
        transition: all 0.3s ease; 
        outline: none; 
      }
      .refresh-btn:hover { 
        background: #00897b; 
        transform: translateY(-3px); 
        box-shadow: 0 4px 8px rgba(38, 166, 154, 0.3); 
      }
      .footer { 
        margin-top: 2rem; 
        color: #78909c; 
        font-size: 0.95rem; 
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>🎯 随机火车站选择器</h1>
      <div class="station-display" id="station">${randomStation}</div>
      <button class="refresh-btn" onclick="window.location.reload()">🔄 重新随机</button>
      <div class="footer">共收录 ${stations.length} 个车站 | 数据来源：station_name.js</div>
    </div>
  </body>
  </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store', // 禁用缓存，确保每次随机有效
    },
  });
}
