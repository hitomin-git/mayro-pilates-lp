// スマホで画面下に固定表示する予約バー（.trial2-booking）の表示/非表示を切り替える。
// 表示するのは、次の条件をすべて満たすときだけ：
//   ・スマホ幅（640px以下）
//   ・ファーストビューの予約ボタンを通り過ぎている
//   ・ページ一番下の「無料体験を予約する」がまだ画面に入っていない
(() => {
  const bar = document.querySelector(".trial2-booking");
  const heroButton = document.querySelector(".fv-shell .cta");
  const closingButton = document.querySelector(".closing-booking .cta");
  const mobile = matchMedia("(max-width:640px)");
  let pending = false;
  function update() {
    pending = false;
    const end = closingButton.getBoundingClientRect();
    const viewport = window.visualViewport?.height || innerHeight;
    // 一番下のボタンが画面の下から入ってきたら true（通り過ぎた後も true のまま）
    const reachedEnd = end.width > 0 && end.height > 0 && end.top < viewport;
    bar.hidden = !(mobile.matches && heroButton.getBoundingClientRect().bottom <= 0 && !reachedEnd);
  }
  // スクロール中の計算は1フレームに1回だけにする
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  addEventListener("pageshow", schedule);
  mobile.addEventListener("change", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  document.fonts.ready.then(schedule);
  update();
})();
