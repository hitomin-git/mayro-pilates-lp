(()=>{
 const bar=document.querySelector('.trial2-booking');
 const heroButton=document.querySelector('.fv-shell .cta');
 const closingButton=document.querySelector('.closing-booking .cta');
 const mobile=matchMedia('(max-width:640px)');
 let pending=false;
 function update(){pending=false;const end=closingButton.getBoundingClientRect();const viewport=window.visualViewport?.height||innerHeight;const reachedEnd=end.width>0&&end.height>0&&end.top<viewport;bar.hidden=!(mobile.matches&&heroButton.getBoundingClientRect().bottom<=0&&!reachedEnd);}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);mobile.addEventListener('change',schedule);window.visualViewport?.addEventListener('resize',schedule);document.fonts.ready.then(schedule);update();
})();