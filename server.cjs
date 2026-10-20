const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};
const files = new Set(['index.html', 'styles.css', 'app.js', 'favicon.svg']);
http
  .createServer((req, res) => {
    const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
    const script = /^js\/[a-z-]+\.js$/.test(name);
    const template = /^plantillas\/[a-z-]+\.html$/.test(name);
    if (!files.has(name) && !script && !template) {
      res.writeHead(404);
      res.end('No encontrado');
      return;
    }
    fs.readFile(path.join(__dirname, name), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error al leer el archivo');
        return;
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(name)],
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    });
  })
  .listen(3000, '127.0.0.1', () => console.log('Café Mercadillo: http://localhost:3000'));
