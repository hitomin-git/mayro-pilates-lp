document.querySelectorAll('details summary').forEach(summary=>summary.setAttribute('aria-label',summary.textContent.trim()));
const dialog=document.querySelector('#mobile-nav');
document.querySelectorAll('[data-menu="open"],button[aria-label="menu"]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();dialog.showModal()}));
document.querySelector('[data-menu="close"]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)');

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
  function render(animate=false){
    const width=slides[0].getBoundingClientRect().width;
    if(!width)return;
    const offset=review?(track.clientWidth-width)/2:0;
    track.style.transition=animate&&!reduceMotion.matches?'transform 700ms cubic-bezier(.22,.61,.36,1)':'none';
    track.style.transform=`translate3d(${offset-index*width}px,0,0)`;
    const logical=((index%count)+count)%count;carousel.dataset.index=logical;
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i%count===logical));
  }
  function settle(){clearTimeout(timer);index=((index%count)+count)%count+count;render();busy=false;}
  function move(delta){if(busy)return;busy=true;index+=delta;render(true);timer=setTimeout(settle,reduceMotion.matches?0:750);}
  track.addEventListener('transitionend',e=>{if(e.target===track&&e.propertyName==='transform')settle()});
  carousel.querySelectorAll('[data-slide]').forEach(button=>{button.setAttribute('aria-label',button.dataset.slide==='next'?'次のお客様の声':'前のお客様の声');button.addEventListener('click',()=>move(button.dataset.slide==='next'?1:-1))});
  track.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;start={x:e.clientX,y:e.clientY};track.setPointerCapture(e.pointerId)});
  track.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1)});
  track.addEventListener('pointercancel',()=>{start=null});
  track.addEventListener('dragstart',e=>e.preventDefault());
  new ResizeObserver(()=>{if(busy)settle();else render()}).observe(carousel);
  render();
  if(!review)setInterval(()=>{if(!document.hidden&&!reduceMotion.matches&&!carousel.matches(':hover')&&!start)move(1)},3300);
});
document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const note=form.querySelector('.preview-note');note.textContent='再現確認用のため送信していません。正式なお問い合わせ・ご予約は公式窓口をご利用ください。';note.setAttribute('role','status');note.scrollIntoView({behavior:'smooth',block:'center'})}));
