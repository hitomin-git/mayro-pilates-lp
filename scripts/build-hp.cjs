const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'source/hp');
const out = path.join(root, 'dist/hp');
fs.mkdirSync(dataDir, {recursive:true});
fs.mkdirSync(out, {recursive:true});

const site = JSON.parse(fs.readFileSync(path.join(dataDir,'site-data.json')));
const product = site.pinia.productStore.product;
const views = Object.fromEntries(fs.readdirSync(path.join(dataDir,'views')).map(f=>[f.replace('.json',''),JSON.parse(fs.readFileSync(path.join(dataDir,'views',f)))]));
const article = {title:'Mayroスタジオがオープンします',name:'information',slug:'news1',body:'<p>この度、Mayroピラティススタジオが8月1日にオープンいたします。</p><p>先行してサイトからご予約が可能になっておりますので、皆さまのご来店を心よりお待ちしております。</p>',_meta:{slug:'news1',publishedAt:'2025/7/22'},tags:[{name:'information',_meta:{slug:'information'}}]};
let assets = fs.existsSync(path.join(dataDir,'assets.json')) ? JSON.parse(fs.readFileSync(path.join(dataDir,'assets.json'))) : {};
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const kebab=s=>s.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
let prefix='', css=new Map(), currentPage='';
function value(s,ctx={}) {return String(s??'').replace(/\{\{(.*?)\}\}/g,(_,q)=>{q=q.trim().replace(/\.value\b/g,'');if(q.includes('$fn.formatDate'))return '2025/7/22';if(q.includes('nBMr9hGx'))return 'information';if(q.includes('$fn.trimString'))return article.title.slice(0,16)+'...';if(q.includes('slug'))return ctx._meta?.slug||'news1';let v=q.split('.').reduce((o,k)=>o?.[k],ctx);if(v===undefined&&q==='title')v=article.title;return typeof v==='string'?v:'';});}
function asset(u){return u.startsWith('assets/')?prefix+u:assets[u]?prefix+'assets/'+assets[u]:u;}
function href(u){u=value(u,article).trim();if(u==='#month')return '#once-a-month';if(u.startsWith('studio-modal:'))return '#mobile-nav';if(u.startsWith('https://mayro-pilates.com'))u=u.replace('https://mayro-pilates.com','');if(u.startsWith('#'))return u;if(u.startsWith('/')){const [p,h]=u.split('#');return prefix+(p==='/'?'./':p.slice(1)+'/')+(h?'#'+h:'');}return u;}
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
const trialURL='https://lin.ee/s3FrAv2';
const instagramURL='https://www.instagram.com/mayro_pilates_studio/';
const menuItems=[['Home','ホーム','/'],['Menu/Price','メニュー / 料金','/menu'],['Staff','スタッフ紹介','/staff'],['Reviews','お客様の声','/#review'],['FAQ','よくある質問','/menu#faq'],['Access','アクセス','/#access']];
const instagramIcon='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/></svg>';
function bookingButton(){return `<a class="booking-button" href="${trialURL}" target="_blank" rel="noopener noreferrer">無料体験を予約する<span aria-hidden="true">→</span></a>`;}
function siteHeader(){return `<header class="site-header"><a class="brand" href="${href('/')}" aria-label="Mayro ホーム"><img src="${prefix}assets/cbb4c180a8fa7cf1.svg" alt="Mayro Pilates Studio" width="300" height="58"></a><nav class="desktop-nav" aria-label="メインメニュー">${menuItems.map(([en,ja,u])=>`<a href="${href(u)}" aria-label="${ja}">${en}</a>`).join('')}</nav><div class="header-actions"><a href="${instagramURL}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${instagramIcon}</a>${bookingButton()}<button class="menu-toggle" type="button" data-menu="open" aria-label="メニューを開く" aria-controls="mobile-nav"><span></span><span></span></button></div></header>`;}
function homePricing(){return `<section class="home-pricing" id="price"><div class="home-price-title"><h2>メニュー・料金</h2><p class="home-price-english">Menu/Price</p></div><div class="home-price-inner"><div class="home-plan-grid">${[['月1回コース','月額','10,000'],['月2回コース','月額','18,000'],['月4回コース','月額','32,000'],['都度払い','1回','11,000']].map(([name,unit,amount])=>`<article><h3>${name}</h3><p class="home-plan-amount"><small>${unit}</small><span>¥${amount}</span></p><p class="home-plan-tax">税込</p></article>`).join('')}</div><p class="home-price-note">料金はすべて税込です。ご入会・プランについては、体験後のカウンセリングでご案内します。</p><a class="home-price-link" href="${href('/menu')}">メニュー・料金を詳しく見る <span aria-hidden="true">→</span></a></div></section>`;}
function render(n,ctx={}) {
  if(currentPage==='/'&&n.uuid==='d1a32cee-65b3-4ddc-9261-b1f73780708a')return homePricing();
  if(n.type==='ref')return render(views[n.refId],ctx);
  if(n.uuid==='efa9aadc-18e4-4331-b87c-7f62286a7a0c'||/^\/(?:news)(?:\/|$)/.test(n.link?.path||''))return '';
  if(n.tagName==='header')return siteHeader();
  if(n.style?.position==='fixed'&&n.link?.path?.includes('instagram.com/'))return '';
  if(n.children?.some(c=>c.content?.data==='Top'))return '<a class="back-to-top" href="#page-top" aria-label="このページの先頭へ戻る"><span aria-hidden="true">↑</span> Top</a>';
  if(n.uuid==='fb677e64-8fee-4d17-9c96-9f8a095b56cd')return '';
  if(n.uuid==='e133fd6a-0f0d-4bf9-a5e6-81b4839442fc')return `<div class="staff-booking">${bookingButton()}</div>`;
  if(n.uuid==='16ad1598-b0a3-4ec9-aa75-1cb8db7479b2')return `<div class="menu-booking-row">${bookingButton()}</div>`;
  // Replace the two floating badges and move the below-photo logo into the hero.
  if(['aec75746-d502-40c7-a5ec-e37d1dc49ed5','8ccb0053-1e33-4bab-bd53-59fe9cc0f267','2667f02f-d972-423f-80b1-d92941839fd8','593b37c0-6572-4d9b-8ab3-db6df499b773','31b671e5-5d52-42df-859f-2cd04a442d6f'].includes(n.uuid))return '';
  if(n.renderIf==='list.hasMore'||(n.renderIf==='list.noContent'&&!ctx.empty))return '';
  if(n.name==='Animation'||n.name==='Hoveraction ')return '';
  const cls='s'+n.uuid.replaceAll('-','');
  if(['sad441dadb8dc4d4b913d7f4277c053bf','s7f4a3736f6ac4ab9916ba3dc1348e6c1','s8f4f0eedadad4e169dbe2351e22eec1a','s48d6bbb95a9240d6a57d899901af2b67'].includes(cls))return `<div class="course-photo"><img src="${esc(asset(value(n.content.src,ctx)))}" alt="${esc(n.attrs?.alt||'Mayro Pilates Studio')}" loading="lazy" width="1200" height="900"></div>`;
  rules('.'+cls,n.style);
  let type=n.content?.type, tag=n.tagName||'div',attrs='',inner='';
  let children=n.children||[];
  if(n.action?.type==='link'){tag='a';attrs+=` href="${esc(href('/'+value(n.action.val,ctx)))}"`;}
  if(n.link?.path){tag='a';const destination=value(n.link.path,ctx);attrs+=` href="${esc(/^(?:https:\/\/mayro-pilates\.com)?\/reserve-1\/?$/.test(destination)?trialURL:href(destination))}"`;if(n.link.newTab)attrs+=' target="_blank" rel="noopener noreferrer"';}
  if(type==='text'){tag=n.link?.path?'a':n.tagName||'p';inner=value(n.content.data,ctx);}
  if(type==='text'&&ctx.mobileMenu){const label=inner.replace(/<br\s*\/?\s*>/g,'').replace(/\s/g,'');const item=menuItems.find(([,ja])=>ja.replace(/\s/g,'')===label);if(item)inner=item[0];}
  if(type==='icon'||type==='icon-brands'){tag=n.link?.path?'a':'span';const icons={arrow_forward:'→',arrow_back:'←',launch:'↗',chevron_right:'›',keyboard_arrow_left:'‹',keyboard_arrow_right:'›',keyboard_arrow_down:'⌄',keyboard_arrow_up:'⌃',expand_more:'⌄',add:'＋',remove:'−',menu:'☰',close:'×'};inner=icons[n.content.data]||'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/></svg>';if(!n.link?.path)attrs+=' aria-hidden="true"';else attrs+=' aria-label="Instagram"';}
  if(type==='image'){const src=asset(value(n.content.src,ctx));attrs+=` style="--node-image:url('${esc(src)}')" data-image="${esc(src)}"`;rules('.'+cls+'::before',{content:'""',position:'absolute',inset:'0',backgroundImage:'var(--node-image)',backgroundSize:'cover',backgroundPosition:'center',borderRadius:'inherit',pointerEvents:'none'});rules('.'+cls+'>*',{zIndex:1});}
  if(type==='icon'&&['arrow_downward','call_made','arrow_drop_up'].includes(n.content.data))inner={arrow_downward:'↓',call_made:'↗',arrow_drop_up:'▴'}[n.content.data];
  if(type==='img'){tag='img';attrs+=` src="${esc(asset(value(n.content.src,ctx)))}" alt="${esc(n.attrs?.alt||'Mayro Pilates Studio')}" loading="lazy"`;}
  if(type==='input'||type==='checkbox'){tag='input';if(type==='checkbox')attrs+=' type="checkbox"';}
  if(type==='textarea')tag='textarea';
  if(type==='select'){tag='select';inner=(n.content.options||[]).map(o=>`<option value="${esc(o.value??o.label??o)}">${esc(o.label||o)}</option>`).join('');}
  if(type==='button')tag='button';
  if(type==='richText'){inner=article.body;tag='article';}
  if(n.uuid==='21431f77-67fa-4b10-9be0-04fbdfcd3896'){tag='button';attrs=' type="button" data-menu="close" autofocus aria-label="メニューを閉じる"';}
  if(n.id&&n.id!=='faq')attrs+=` id="${esc(n.id)}"`;
  if(n.uuid==='a6cd2e8d-f2f1-45fc-b642-55f14718fe47')attrs+=' id="faq"';
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
    if(n.name==='ファーストビュー')inner+=`<div class="hero-brand"><img src="${prefix}assets/cbb4c180a8fa7cf1.svg" alt="Mayro Pilates Studio" width="300" height="58"></div>`;
    rules('.'+cls+' .slide > .'+('s'+template.uuid.replaceAll('-','')),{position:'relative',left:'auto',top:'auto',width:'100%',maxWidth:'100%',height:'100%',margin:'0',transform:'none'});
  }else if(n.type==='list'){
    let list=n.state?.list;
    if(!list||list[0]?.text1==='Type Something')list=n.defs?.some(d=>d.query?.path?.schemaKey==='tags')||list?.[0]?.text1==='Type Something'?['media','blog','information'].map(t=>({...article,title:t,name:t,_meta:{slug:t}})):currentPage.endsWith('/media')||currentPage.endsWith('/blog')?[]:[article];
    inner=list.length?list.map(item=>children.filter(c=>!c.slot).map(c=>render(c,{...ctx,...item})).join('')).join(''):children.filter(c=>c.renderIf==='list.noContent').map(c=>render(c,{...ctx,empty:true})).join('');children=[];
  }
  inner+=children.map(c=>render(c,ctx)).join('');
  if(tag==='form')inner='<p class="preview-note" role="note">再現確認用フォームです。入力内容は送信されません。</p>'+inner;
  if(tag==='a'&&!inner&&!type)attrs+=' aria-label="Mayro ホーム"';
  const semantic=n.name==='Qマーク'?' question-mark':n.name==='質問'?' question-copy':n.children?.some(c=>c.name==='Qマーク')?' question-group':'';
  return `<${tag} class="node ${cls}${semantic}${type==='text'&&!['list','carousel'].includes(n.type)?' text':''}${type==='icon'?' icon':''}"${attrs}>${['img','input','br','hr'].includes(tag)?'':inner+`</${tag}>`}`;
}
async function main(){
  const version=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(out,file))).digest('hex').slice(0,12);
  const cssVersion=version('base.css'),jsVersion=version('site.js');
  const urls=new Set();for(const n of Object.values(views)){for(const m of JSON.stringify(n).matchAll(/https:\/\/storage\.googleapis\.com\/[^"\\\s]+/g))urls.add(m[0]);}urls.add(product.head.favicon);
  fs.mkdirSync(path.join(out,'assets'),{recursive:true});
  let failures=[];await Promise.all([...urls].map(async u=>{if(assets[u]&&fs.existsSync(path.join(out,'assets',assets[u])))return;try{const r=await fetch(u);if(!r.ok)throw Error(r.status);const b=Buffer.from(await r.arrayBuffer());const ext=({'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/svg+xml':'.svg','image/gif':'.gif'})[r.headers.get('content-type')?.split(';')[0]]||'.img';const name=crypto.createHash('sha256').update(u).digest('hex').slice(0,16)+ext;fs.writeFileSync(path.join(out,'assets',name),b);assets[u]=name;}catch(e){failures.push([u,String(e)]);}}));
  fs.writeFileSync(path.join(dataDir,'assets.json'),JSON.stringify(assets,null,2));
  const pages=product.pages.filter(p=>p.type==='page'&&p.id!=='test-a/page1'&&!p.id.startsWith('news')).map(p=>({...p,id:p.id.replace('category/:slug','category/information').replace('detail/:slug','detail/news1')}));

  let inventory=[];
  for(const p of pages){currentPage=p.id;const dir=p.id==='/'?'':p.id;prefix='../'.repeat(dir?dir.split('/').length:0);css=new Map();const pageContext=p.id.startsWith('news/category/')?{...article,title:p.id.split('/').pop(),_meta:{slug:p.id.split('/').pop()}}:article;const html=render(views[p.uuid],pageContext);let vars=':root{'+Object.entries(product.styleVars).flatMap(([t,vs])=>vs.map(v=>`--s-${t==='color'?'color':'font'}-${v.key}:${v.value};`)).join('')+'}';
    const modal=render(views['a1d07ac1-9c28-4809-847c-9bc7749bd9c8'],{mobileMenu:true}).replace(/https:\/\/(?:www\.)?instagram\.com\/mayro_pilates\?[^"<>]+/g,instagramURL);
    const nav=menuItems.map(([en,ja,u])=>`<a href="${href(u)}"><span>${ja}</span><small>${en}</small></a>`).join('');
    const pageDir=path.join(out,dir);fs.mkdirSync(pageDir,{recursive:true});
    fs.writeFileSync(path.join(pageDir,'index.html'),`<!doctype html><html lang="ja"><head><!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MV96LBV4');</script>
<!-- End Google Tag Manager --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(p.head?.title||product.head.title)}</title><link rel="icon" href="${asset(product.head.favicon)}"><link rel="stylesheet" href="${prefix}base.css?v=${cssVersion}"><style>${vars}\n${[...css.values()].join('\n')}</style><script defer src="${prefix}site.js?v=${jsVersion}"></script></head><body id="page-top"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MV96LBV4" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>${html}<aside class="mobile-booking" aria-label="無料体験のご予約"><p>はじめての方も安心｜60分の無料体験</p>${bookingButton()}</aside><dialog id="mobile-nav" aria-label="メインメニュー">${modal}</dialog></body></html>`);
    const texts=[];function textWalk(n){if(n.content?.data)texts.push(n.content.data);for(const c of n.children||[])textWalk(c);}textWalk(views[p.uuid]);inventory.push({path:p.id,url:'https://mayro-pilates.com'+(p.id==='/'?'':'/'+p.id),file:'dist/hp/'+(dir?dir+'/':'')+'index.html',text:texts});
  }
  fs.writeFileSync(path.join(dataDir,'page-inventory.json'),JSON.stringify(inventory,null,2));
  console.log(JSON.stringify({pages:pages.length,assets:Object.keys(assets).length,failures},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
