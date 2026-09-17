const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve('dist');
const pages=['versions/change4.html','index.html','versions/old.html','versions/change1.html','versions/change2.html','versions/review2.html','versions/change3.html','versions/change3-price.html'];
const failures=[];
function checkRef(file,ref){if(/^(?:https?:|data:|#|mailto:|tel:)/.test(ref))return;const target=path.resolve(path.dirname(file),ref.split(/[?#]/)[0]);if(!fs.existsSync(target))failures.push(path.relative(root,file)+': '+ref);}
for(const page of pages){const file=path.join(root,page);const html=fs.readFileSync(file,'utf8');for(const [,ref]of html.matchAll(/(?:src|href)="([^"]+)"/g))checkRef(file,ref);if(!html.includes('lang="ja"'))failures.push(page+': missing Japanese language');const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));for(const [,id]of html.matchAll(/href="#([^"]+)"/g)){if(!ids.has(id))failures.push(page+': missing #'+id);}}
for(const name of ['comparison.css','versions/old.css','versions/change1.css','versions/change2.css','versions/review2.css']){const file=path.join(root,name);for(const [,ref]of fs.readFileSync(file,'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))checkRef(file,ref);}
const baselines=JSON.parse(fs.readFileSync('version-baselines.json','utf8'));
for(const item of baselines){const hash=crypto.createHash('sha256').update(fs.readFileSync(item.path,'utf8').replace(/\r\n/g,'\n')).digest('hex');if(hash!==item.sha256)failures.push('Existing version changed: '+item.path);}
if(failures.length){console.error(failures);process.exit(1);}console.log('PASS: '+pages.length+' pages, local assets, page anchors, and all preserved version hashes.');
