(() => {
  const key='mayro-lp-favorites-v1';
  const notice=document.querySelector('#favorite-notice');
  let selected=[];
  try {const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))selected=saved.filter(x=>typeof x==='string');} catch {}
  document.querySelectorAll('[data-favorite]').forEach(button=>{
    const id=button.dataset.favorite;
    const render=()=>{const active=selected.includes(id);button.setAttribute('aria-pressed',String(active));button.textContent=active?'★ 気に入った版':'☆ 気に入った版にする';};
    render();
    button.addEventListener('click',()=>{selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];render();try{localStorage.setItem(key,JSON.stringify(selected));notice.textContent='印はこのブラウザーに保存されます。別の端末には共有されません。';}catch{notice.textContent='このブラウザーでは保存できないため、印はこの画面を開いている間だけ保持します。';}});
  });
})();
