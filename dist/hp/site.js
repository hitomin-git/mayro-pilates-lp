document.querySelectorAll('details summary').forEach(summary=>summary.setAttribute('aria-label',summary.textContent.trim()));
const dialog=document.querySelector('#mobile-nav');
document.querySelectorAll('[data-menu="open"],button[aria-label="menu"]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();dialog.showModal()}));
document.querySelector('[data-menu="close"]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>{const track=button.closest('[data-carousel]').querySelector('.slide-track');track.scrollBy({left:(button.dataset.slide==='next'?1:-1)*track.querySelector('.slide').getBoundingClientRect().width,behavior:'smooth'})}));
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){document.querySelectorAll('[data-carousel="hero"]').forEach(carousel=>{const slides=carousel.querySelectorAll('.slide');let index=0;setInterval(()=>{if(document.hidden||carousel.matches(':hover'))return;slides[index].style.display='none';index=(index+1)%slides.length;slides[index].style.display='block'},4000)})}
document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const note=form.querySelector('.preview-note');note.textContent='再現確認用のため送信していません。正式なお問い合わせ・ご予約は公式窓口をご利用ください。';note.setAttribute('role','status');note.scrollIntoView({behavior:'smooth',block:'center'})}));
