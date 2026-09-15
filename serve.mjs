import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403).end();return}const file=p===root?path.join(root,'index.html'):p;fs.readFile(file,(e,d)=>{if(e){res.writeHead(404).end('Not found');return}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(d)})}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
