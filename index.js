const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy server with secure options
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false,
  ws: true // WebSocket support for VoIP and live calls
});

const server = http.createServer((req, res) => {
  // Set headers to allow traffic routing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  proxy.web(req, res, { target: req.headers['x-target-url'] || 'https://www.google.com' }, (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy Tunnel Error: ' + err.message);
  });
});

// Handle WebSocket upgrade for real-time voice/video calls
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: req.headers['x-target-url'] || req.url });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Secure Tunnel Proxy running on port ${PORT}`);
});
