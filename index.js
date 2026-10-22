const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true // Enable WebSocket support for Voice/Video Calls
});

const server = http.createServer((req, res) => {
  // Handle standard HTTP / WebRTC proxy requests
  proxy.web(req, res, { target: req.url }, (err) => {
    res.writeHead(502);
    res.end('Proxy Error: ' + err.message);
  });
});

// Handle WebSocket proxying for VoIP Calls
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: req.url });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Live VoIP Proxy running on port ${PORT}`);
});
