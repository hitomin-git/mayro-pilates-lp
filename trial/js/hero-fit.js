// ファーストビューの文字・ボタンが画面の高さに収まるように、必要なら縮小して表示する。
// 画面サイズが変わったとき・フォントの読み込みが終わったときに計算し直す。
(() => {
  const hero = document.querySelector(".hero"),
    content = document.querySelector(".hero-content");
  function fit() {
    // いったん縮小を解除して、本来の高さを測る
    content.style.transform = "none";
    content.style.minHeight = "0";
    const top = content.offsetTop;
    // iPhoneの画面下のバー（ホームバー）の分
    const safe =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom")) || 0;
    // 背の高いスマホでは、ボタンを少し上に持ち上げる
    const lift = matchMedia("(min-width:390px) and (max-width:599px) and (min-height:641px)")
      .matches
      ? 28
      : 0;
    const available = hero.clientHeight - top - 18 - safe - lift;
    const natural = content.scrollHeight;
    // 収まらないときだけ縮小する（拡大はしない）
    const scale = Math.min(1, available / natural);
    content.style.minHeight = available / Math.max(scale, 0.1) + "px";
    content.style.transform = "scale(" + Math.max(0.1, scale) + ")";
  }
  new ResizeObserver(fit).observe(hero);
  document.fonts.ready.then(fit);
  window.addEventListener("resize", fit);
  fit();
})();
