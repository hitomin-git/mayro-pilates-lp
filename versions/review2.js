const wrap=document.querySelector('.live-preview');
const frame=wrap.querySelector('iframe');
function sizePreview(){const scale=wrap.clientWidth/1280;const height=frame.contentDocument?.querySelector('.lp')?.getBoundingClientRect().height||4100;frame.style.height=height+'px';frame.style.transform='scale('+scale+')';wrap.style.height=Math.ceil(height*scale)+'px';}
frame.addEventListener('load',()=>{const doc=frame.contentDocument;doc.querySelector('.review-nav')?.remove();doc.body.style.paddingBottom='0';sizePreview();Promise.all(Array.from(doc.images).map(i=>i.decode().catch(()=>{}))).then(sizePreview);});
new ResizeObserver(sizePreview).observe(wrap);
