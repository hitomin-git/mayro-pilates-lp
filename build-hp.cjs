const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = __dirname;
const dataDir = path.join(root, 'hp-source');
const out = path.join(root, 'dist/hp');
fs.mkdirSync(dataDir, {recursive:true});
fs.mkdirSync(out, {recursive:true});
if (fs.existsSync(path.join(__dirname,'site-data.json'))) {
  fs.copyFileSync(path.join(__dirname,'site-data.json'),path.join(dataDir,'site-data.json'));
  fs.cpSync(path.join(__dirname,'source'),path.join(dataDir,'views'),{recursive:true});
}
const site = JSON.parse(fs.readFileSync(path.join(dataDir,'site-data.json')));
const product = site.pinia.productStore.product;
const views = Object.fromEntries(fs.readdirSync(path.join(dataDir,'views')).map(f=>[f.replace('.json',''),JSON.parse(fs.readFileSync(path.join(dataDir,'views',f)))]));
const article = {title:'Mayroスタジオがオープンします',name:'information',slug:'news1',body:'<p>この度、Mayroピラティススタジオが8月1日にオープンいたします。</p><p>先行してサイトからご予約が可能になっておりますので、皆さまのご来店を心よりお待ちしております。</p>',_meta:{slug:'news1',publishedAt:'2025/7/22'},tags:[{name:'information',_meta:{slug:'information'}}]};
let assets = fs.existsSync(path.join(dataDir,'assets.json')) ? JSON.parse(fs.readFileSync(path.join(dataDir,'assets.json'))) : {};
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const kebab=s=>s.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
let prefix='', css=new Map(), currentPage='';
function value(s,ctx={}) {return String(s??'').replace(/\{\{(.*?)\}\}/g,(_,q)=>{q=q.trim().replace(/\.value\b/g,'');if(q.includes('$fn.formatDate'))return '2025/7/22';if(q.includes('nBMr9hGx'))return 'information';if(q.includes('$fn.trimString'))return article.title.slice(0,16)+'...';if(q.includes('slug'))return ctx._meta?.slug||'news1';let v=q.split('.').reduce((o,k)=>o?.[k],ctx);if(v===undefined&&q==='title')v=article.title;return typeof v==='string'?v:'';});}
function asset(u){return assets[u]?prefix+'assets/'+assets[u]:u;}
function href(u){u=value(u,article).trim();if(u==='#month')return '#once-a-month';if(u.startsWith('studio-modal:'))return '#mobile-nav';if(u.startsWith('https://mayro-pilates.com'))u=u.replace('https://mayro-pilates.com','');if(u.startsWith('#'))return u;if(u.startsWith('/')){const [p,h]=u.split('#');return prefix+(p==='/'?'index.html':p.slice(1)+'/index.html')+(h?'#'+h:'');}return u;}
function rules(sel,style,media='') {
  const plain={};
  for(const [k,v] of Object.entries(style||{})) {
    if(typeof v==='object'||v===null)continue;
    if(String(v).includes('NaN')||String(v).includes('{{'))continue;
    plain[k]=v;
  }
  if(plain.margin){const m=String(plain.margin).split(/\s+/);const l=m[3]||m[1]||m[0],r=m[1]||m[0];if(l!=='auto'&&r!=='auto')plain.maxWidth=`calc(100% - ${l} - ${r})`;}
  let text=Object.entries(plain).map(([k,v])=>`${kebab(k)}:${v}`).join(';');
  if(text){text=`${sel}{${text}}`;css.set(media+sel,media?`@media(max-width:${media}px){${text}}`:text);}
  for(const [k,v]of Object.entries(style||{}))if(v&&typeof v==='object'){
    if(k.startsWith('@'))continue;
    if(k.startsWith('&')||k.startsWith('_'))continue;
    const selector=k.startsWith('in:')?sel+':is(a:hover *,button:hover *)':k.startsWith(':')?sel+k:sel+' '+k;
    rules(selector,v,media);
  }
  for(const [k,w]of [['small',1140],['tablet',950],['mobile',540],['mini',360]])if(style?.['@'+k])rules(sel,style['@'+k],w);
}
function render(n,ctx={}) {
  if(n.type==='ref')return render(views[n.refId],ctx);
  if(n.renderIf==='list.hasMore'||(n.renderIf==='list.noContent'&&!ctx.empty))return '';
  if(n.name==='Animation'||n.name==='Hoveraction ')return '';
  const cls='s'+n.uuid.replaceAll('-','');
  rules('.'+cls,n.style);
  let type=n.content?.type, tag=n.tagName||'div',attrs='',inner='';
  let children=n.children||[];
  if(n.action?.type==='link'){tag='a';attrs+=` href="${esc(href('/'+value(n.action.val,ctx)))}"`;}
  if(n.link?.path){tag='a';attrs+=` href="${esc(href(value(n.link.path,ctx)))}"`;if(n.link.newTab)attrs+=' target="_blank" rel="noopener noreferrer"';}
  if(type==='text'){tag=n.link?.path?'a':n.tagName||'p';inner=value(n.content.data,ctx);}
  if(type==='icon'||type==='icon-brands'){tag=n.link?.path?'a':'span';const icons={arrow_forward:'→',arrow_back:'←',launch:'↗',chevron_right:'›',keyboard_arrow_left:'‹',keyboard_arrow_right:'›',keyboard_arrow_down:'⌄',keyboard_arrow_up:'⌃',expand_more:'⌄',add:'＋',remove:'−',menu:'☰',close:'×'};inner=icons[n.content.data]||'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/></svg>';if(!n.link?.path)attrs+=' aria-hidden="true"';else attrs+=' aria-label="Instagram"';}
  if(type==='image'){const src=asset(value(n.content.src,ctx));rules('.'+cls+'::before',{content:'""',position:'absolute',inset:'0',backgroundImage:`url("${src}")`,backgroundSize:'cover',backgroundPosition:'center',borderRadius:'inherit',pointerEvents:'none'});rules('.'+cls+'>*',{zIndex:1});}
  if(type==='icon'&&['arrow_downward','call_made','arrow_drop_up'].includes(n.content.data))inner={arrow_downward:'↓',call_made:'↗',arrow_drop_up:'▴'}[n.content.data];
  if(type==='img'){tag='img';attrs+=` src="${esc(asset(value(n.content.src,ctx)))}" alt="${esc(n.attrs?.alt||'Mayro Pilates Studio')}" loading="lazy"`;}
  if(type==='input'||type==='checkbox'){tag='input';if(type==='checkbox')attrs+=' type="checkbox"';}
  if(type==='textarea')tag='textarea';
  if(type==='select'){tag='select';inner=(n.content.options||[]).map(o=>`<option value="${esc(o.value??o.label??o)}">${esc(o.label||o)}</option>`).join('');}
  if(type==='button')tag='button';
  if(type==='richText'){inner=article.body;tag='article';}
  if(n.id)attrs+=` id="${esc(n.id)}"`;
  for(const [k,v]of Object.entries(n.attrs||{}))if(!['style','class','src','alt','data-type'].includes(k)&&!k.startsWith('on'))attrs+=v===true?` ${k}`:v===false?'':` ${k}="${esc(value(v,ctx))}"`;
  if(n.on?.click==='next'||n.on?.click==='prev')attrs+=` data-slide="${n.on.click}" aria-label="${n.on.click==='next'?'次のお客様の声':'前のお客様の声'}"`;
  if(n.link?.path?.includes('mobilemenu')){attrs=attrs.replace(/ aria-label="[^"]*"/g,'');attrs+=' data-menu="open" role="button" aria-label="メニューを開く"';}
  if(n.type==='toggle'){
    tag='details';inner=children.map((c,i)=>render(i===0?{...c,tagName:'summary',content:undefined,on:undefined}:c,ctx)).join('');children=[];
    rules('.'+cls,{display:'block'});
  }else if(n.type==='carousel'){
    const items=n.state?.list||[];const template=children.find(c=>!c.slot);const slots=children.filter(c=>c.slot);
    attrs+=` data-carousel="${n.name==='ファーストビュー'?'hero':n.name==='カルーセル画像'?'gallery':'review'}"`;
    inner=slots.map(c=>render(c,ctx)).join('')+'<div class="slide-track">'+items.map((item,i)=>'<div class="slide" data-index="'+i+'">'+render(template,{...ctx,...item})+'</div>').join('')+'</div>';children=[];
    rules('.'+cls+' .slide > .'+('s'+template.uuid.replaceAll('-','')),{position:'relative',left:'auto',top:'auto',width:'100%',maxWidth:'100%',height:'100%',margin:'0',transform:'none'});
  }else if(n.type==='list'){
    let list=n.state?.list;
    if(!list||list[0]?.text1==='Type Something')list=n.defs?.some(d=>d.query?.path?.schemaKey==='tags')||list?.[0]?.text1==='Type Something'?['media','blog','information'].map(t=>({...article,title:t,name:t,_meta:{slug:t}})):currentPage.endsWith('/media')||currentPage.endsWith('/blog')?[]:[article];
    inner=list.length?list.map(item=>children.filter(c=>!c.slot).map(c=>render(c,{...ctx,...item})).join('')).join(''):children.filter(c=>c.renderIf==='list.noContent').map(c=>render(c,{...ctx,empty:true})).join('');children=[];
  }
  inner+=children.map(c=>render(c,ctx)).join('');
  if(tag==='form')inner='<p class="preview-note" role="note">再現確認用フォームです。入力内容は送信されません。</p>'+inner;
  if(tag==='a'&&!inner&&!type)attrs+=' aria-label="Mayro ホーム"';
  return `<${tag} class="node ${cls}${type==='text'?' text':''}${type==='icon'?' icon':''}"${attrs}>${['img','input','br','hr'].includes(tag)?'':inner+`</${tag}>`}`;
}
async function main(){
  const urls=new Set();for(const n of Object.values(views)){for(const m of JSON.stringify(n).matchAll(/https:\/\/storage\.googleapis\.com\/[^"\\\s]+/g))urls.add(m[0]);}urls.add(product.head.favicon);
  fs.mkdirSync(path.join(out,'assets'),{recursive:true});
  let failures=[];await Promise.all([...urls].map(async u=>{if(assets[u]&&fs.existsSync(path.join(out,'assets',assets[u])))return;try{const r=await fetch(u);if(!r.ok)throw Error(r.status);const b=Buffer.from(await r.arrayBuffer());const ext=({'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/svg+xml':'.svg','image/gif':'.gif'})[r.headers.get('content-type')?.split(';')[0]]||'.img';const name=crypto.createHash('sha256').update(u).digest('hex').slice(0,16)+ext;fs.writeFileSync(path.join(out,'assets',name),b);assets[u]=name;}catch(e){failures.push([u,String(e)]);}}));
  fs.writeFileSync(path.join(dataDir,'assets.json'),JSON.stringify(assets,null,2));
  const pages=product.pages.filter(p=>p.type==='page'&&p.id!=='test-a/page1').map(p=>({...p,id:p.id.replace('category/:slug','category/information').replace('detail/:slug','detail/news1')}));
  const category=pages.find(p=>p.id==='news/category/information');pages.push({...category,id:'news/category/media'},{...category,id:'news/category/blog'});
  let inventory=[];
  for(const p of pages){currentPage=p.id;const dir=p.id==='/'?'':p.id;prefix='../'.repeat(dir?dir.split('/').length:0);css=new Map();const pageContext=p.id.startsWith('news/category/')?{...article,title:p.id.split('/').pop(),_meta:{slug:p.id.split('/').pop()}}:article;const html=render(views[p.uuid],pageContext);let vars=':root{'+Object.entries(product.styleVars).flatMap(([t,vs])=>vs.map(v=>`--s-${t==='color'?'color':'font'}-${v.key}:${v.value};`)).join('')+'}';
    const nav=[['Home','/'],['News','/news'],['Menu/Price','/menu'],['Staff','/staff'],['Reviews','/#review'],['FAQ','/menu#faq'],['Access','/#access']].map(([t,u])=>`<a href="${href(u)}">${t}</a>`).join('');
    const pageDir=path.join(out,dir);fs.mkdirSync(pageDir,{recursive:true});
    fs.writeFileSync(path.join(pageDir,'index.html'),`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(p.head?.title||product.head.title)}</title><link rel="icon" href="${asset(product.head.favicon)}"><link rel="stylesheet" href="${prefix}base.css"><style>${vars}\n${[...css.values()].join('\n')}</style><script defer src="${prefix}site.js"></script></head><body>${html}<dialog id="mobile-nav"><button type="button" data-menu="close" aria-label="メニューを閉じる">×</button><nav>${nav}</nav></dialog></body></html>`);
    const texts=[];function textWalk(n){if(n.content?.data)texts.push(n.content.data);for(const c of n.children||[])textWalk(c);}textWalk(views[p.uuid]);inventory.push({path:p.id,url:'https://mayro-pilates.com'+(p.id==='/'?'':'/'+p.id),file:'dist/hp/'+(dir?dir+'/':'')+'index.html',text:texts});
  }
  fs.writeFileSync(path.join(dataDir,'page-inventory.json'),JSON.stringify(inventory,null,2));
  console.log(JSON.stringify({pages:pages.length,assets:Object.keys(assets).length,failures},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
