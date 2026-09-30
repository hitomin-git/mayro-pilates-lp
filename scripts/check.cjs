const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),errors=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root).filter(f=>/\.(html|css)$/.test(f));let refs=0;
for(const file of files){
  const text=fs.readFileSync(file,'utf8');
  if(file.endsWith('.html')&&!/name="robots" content="(?:noindex|index),(?:nofollow|follow)"/.test(text))errors.push(`${file}: robots directive missing`);
  const urls=[...text.matchAll(/--node-image:url\(\s*['"]?([^)'"\s]+)|(?:href|src|data-image)="([^"]+)"|url\(\s*['"]?([^)'"\s]+)|@import\s+['"]([^'"]+)/g)].map(m=>({url:m[1]||m[2]||m[3]||m[4],nodeImage:!!m[1]}));
  for(const {url,nodeImage} of urls){
    if(/^(?:[a-z]+:|\/\/)/i.test(url))continue;
    refs++;const [pathname,hash]=url.split('#');
    // background-image:var(--node-image) is always declared in a stylesheet under dist/css/,
    // so the browser resolves this url() relative to dist/css/, not the HTML file's own location.
    const base=nodeImage&&file.endsWith('.html')?path.join(root,'css'):path.dirname(file);
    let target=path.resolve(base,pathname.split('?')[0]||path.basename(file));
    if(!target.startsWith(root+path.sep)&&target!==root){errors.push(`${file}: outside dist ${url}`);continue;}
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target)){errors.push(`${file}: missing ${url}`);continue;}
    if(hash&&target.endsWith('.html')&&!fs.readFileSync(target,'utf8').includes(`id="${decodeURIComponent(hash)}"`))errors.push(`${file}: missing anchor ${url}`);
  }
}
const lp=fs.readFileSync(path.join(root,'trial2/index.html'),'utf8');
if(/<source\b[^>]*media=/.test(lp)||!lp.includes('assets/hero-13.jpg'))errors.push('LP hero must use the same photograph at all widths');
console.log(JSON.stringify({pages:files.filter(f=>f.endsWith('.html')).length,references:refs,errors},null,2));process.exitCode=errors.length?1:0;
