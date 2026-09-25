(()=>{
 const bar=document.querySelector('.trial2-booking');
 const heroButton=document.querySelector('.fv-shell .cta');
 const closingButton=document.querySelector('.closing-booking .cta');
 const mobile=matchMedia('(max-width:640px)');
 let pending=false;
 function update(){pending=false;const end=closingButton.getBoundingClientRect();const viewport=window.visualViewport?.height||innerHeight;const closingVisible=end.width>0&&end.height>0&&end.top>=0&&end.bottom<=viewport-100;bar.hidden=!(mobile.matches&&heroButton.getBoundingClientRect().bottom<=0&&!closingVisible);}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);mobile.addEventListener('change',schedule);window.visualViewport?.addEventListener('resize',schedule);document.fonts.ready.then(schedule);update();
})();