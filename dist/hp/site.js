document.querySelectorAll('details summary').forEach(summary=>summary.setAttribute('aria-label',summary.textContent.trim()));
const dialog=document.querySelector('#mobile-nav');
let menuTimer;
function closeMenu(){if(!dialog.open||dialog.classList.contains('is-closing'))return;dialog.classList.add('is-closing');menuTimer=setTimeout(()=>{dialog.close();dialog.classList.remove('is-closing')},matchMedia('(prefers-reduced-motion:reduce)').matches?0:220)}
document.querySelectorAll('[data-menu="open"],button[aria-label="menu"]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();clearTimeout(menuTimer);dialog.classList.remove('is-closing');dialog.showModal();dialog.querySelector('.sac6c83141aa245929403adcfac0b7d1b').scrollTop=0}));
document.querySelector('[data-menu="close"]').addEventListener('click',closeMenu);
dialog.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});
dialog.addEventListener('click',e=>{if(e.target===dialog)closeMenu()});
dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)');

// Only hide offscreen content after the observer is available; no-JS stays readable.
if(!reduceMotion.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});
  document.querySelectorAll('h1,h2,#flow li,[data-image]').forEach(el=>{
    if(el.closest('[data-carousel],header,footer,dialog')||el.getBoundingClientRect().top<innerHeight)return;
    el.classList.add('scroll-reveal');observer.observe(el);
  });
}

// Keep all hero layers mounted so one fades in while the preceding layer fades out.
document.querySelectorAll('[data-carousel="hero"]').forEach(carousel=>{
  const slides=[...carousel.querySelectorAll('.slide')];let index=0;
  function show(){slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index))});carousel.dataset.index=index;}
  show();setInterval(()=>{if(document.hidden||reduceMotion.matches)return;index=(index+1)%slides.length;show()},5000);
});

// Surround the real items with complete copies; normalize only after animation ends.
// This leaves a previous card visible on the left even on the first review.
document.querySelectorAll('[data-carousel="gallery"],[data-carousel="review"]').forEach(carousel=>{
  const track=carousel.querySelector('.slide-track'),originals=[...track.children],count=originals.length;
  const review=carousel.dataset.carousel==='review';let index=count,busy=false,timer,start=null;
  function copy(slide){const clone=slide.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));return clone;}
  track.prepend(...originals.map(copy));track.append(...originals.map(copy));
  const slides=[...track.children];
  let dots=[];
  if(review){
    const pagination=document.createElement('div');pagination.className='review-pagination';pagination.setAttribute('aria-label','お客様の声の切り替え');
    dots=originals.map((_,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`${i+1}件目のお客様の声`);button.addEventListener('click',()=>move(i-Number(carousel.dataset.index)));pagination.append(button);return button});
    const hint=document.createElement('p');hint.className='review-hint';hint.textContent='左右にスワイプしてご覧いただけます';
    carousel.append(pagination,hint);
  }
  function render(animate=false){
    const width=slides[0].getBoundingClientRect().width;
    if(!width)return;
    const offset=review?(track.clientWidth-width)/2:0;
    track.style.transition=animate&&!reduceMotion.matches?'transform 700ms cubic-bezier(.22,.61,.36,1)':'none';
    track.style.transform=`translate3d(${offset-index*width}px,0,0)`;
    const logical=((index%count)+count)%count;carousel.dataset.index=logical;
    dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===logical)));
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i%count===logical));
  }
  function settle(){clearTimeout(timer);index=((index%count)+count)%count+count;render();busy=false;}
  function move(delta){if(busy)return;busy=true;index+=delta;render(true);timer=setTimeout(settle,reduceMotion.matches?0:750);}
  track.addEventListener('transitionend',e=>{if(e.target===track&&e.propertyName==='transform')settle()});
  carousel.querySelectorAll('[data-slide]').forEach(button=>{button.setAttribute('aria-label',button.dataset.slide==='next'?'次のお客様の声':'前のお客様の声');button.addEventListener('click',()=>move(button.dataset.slide==='next'?1:-1))});
  carousel.addEventListener('pointerdown',e=>{if(busy||(e.pointerType==='mouse'&&e.button!==0)||e.target.closest('a,button,[data-slide]'))return;start={x:e.clientX,y:e.clientY,base:parseFloat(getComputedStyle(track).transform.split(',')[4])||0};carousel.setPointerCapture(e.pointerId)});
  carousel.addEventListener('pointermove',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>8){carousel.classList.add('is-dragging');track.style.transition='none';track.style.transform=`translate3d(${start.base+dx}px,0,0)`}});
  carousel.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;carousel.classList.remove('is-dragging');if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);else render(true)});
  carousel.addEventListener('pointercancel',()=>{start=null;carousel.classList.remove('is-dragging');render(true)});
  track.addEventListener('dragstart',e=>e.preventDefault());
  new ResizeObserver(()=>{if(busy)settle();else render()}).observe(carousel);
  render();
  if(!review)setInterval(()=>{if(!document.hidden&&!reduceMotion.matches&&!carousel.matches(':hover')&&!start)move(1)},3300);
});
document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const note=form.querySelector('.preview-note');note.textContent='再現確認用のため送信していません。正式なお問い合わせ・ご予約は公式窓口をご利用ください。';note.setAttribute('role','status');note.scrollIntoView({behavior:'smooth',block:'center'})}));
