const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'dist/hp');let files=[];
function walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);if(f.isDirectory())walk(p);else if(f.name.endsWith('.html'))files.push(p)}}walk(root);
const errors=[];let links=0;
for(const file of files){const html=fs.readFileSync(file,'utf8');if(html.includes('{{'))errors.push(`${file}: unresolved expression`);if(!html.includes('noindex,nofollow'))errors.push(`${file}: noindex missing`);
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=m[1];if(/^(https?:|data:)/.test(url))continue;links++;const [p,hash]=url.split('#');const target=path.resolve(path.dirname(file),p||path.basename(file));if(!fs.existsSync(target)){errors.push(`${path.relative(root,file)}: missing ${url}`);continue}if(hash&&!fs.readFileSync(target,'utf8').includes(`id="${hash}"`))errors.push(`${path.relative(root,file)}: missing anchor ${hash}`);}
if(/<script[^>]*src="https?:/.test(html))errors.push(`${file}: remote script`);
}
const result={checkedPages:files.length,localLinksAndAssets:links,errors};console.log(JSON.stringify(result,null,2));process.exitCode=errors.length?1:0;
