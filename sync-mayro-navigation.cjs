const fs=require('fs'),crypto=require('crypto');
const pages=['index.html','versions/old.html','versions/change1.html','versions/change2.html','versions/review2.html','versions/change3.html','versions/change3-price.html'];
const items=[['index','一覧','index.html'],['old','古い版','versions/old.html'],['change1','変更1','versions/change1.html'],['change2','変更2','versions/change2.html'],['change3','変更3','versions/change3.html']];
for(const file of pages){
 const path='dist/'+file;let html=fs.readFileSync(path,'utf8');
 html=html.replace(/<(nav|aside)\b[^>]*class="(?:version-switcher|review-nav|version-nav|design-navigation)"[^>]*>[\s\S]*?<\/\1>/g,'');
 html=html.replace(/<link[^>]*href="(?:\.\.\/)?design-navigation.css"[^>]*>/g,'');
 const prefix=file.startsWith('versions/')?'../':'';
 const current=file==='versions/change3-price.html'?'change3':file==='versions/review2.html'?'change2':file.split('/').pop().replace('.html','');
 const nav='<nav class="design-navigation" aria-label="制作案の切り替え">'+items.map(([id,label,url])=>`<a href="${prefix+url}"${id===current?' aria-current="page"':''}>${label}</a>`).join('')+'</nav>';
 html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}design-navigation.css"></head>`).replace('</body>',nav+'</body>');
 fs.writeFileSync(path,html);
}
// The user authorized a navigation-only update to the archived HTML wrappers.
const baseline=JSON.parse(fs.readFileSync('version-baselines.json','utf8'));
for(const item of baseline)if(item.path.endsWith('.html'))item.sha256=crypto.createHash('sha256').update(fs.readFileSync(item.path,'utf8').replace(/\r\n/g,'\n')).digest('hex');
fs.writeFileSync('version-baselines.json',JSON.stringify(baseline,null,2)+'\n');
console.log('Unified navigation on '+pages.length+' pages.');
