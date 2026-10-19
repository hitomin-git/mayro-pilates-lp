// PC表示用：スマホ版（このページ自身）を、スマホ幅の枠の中に表示する。
//   ・外側（html.pc-outer）… 両脇の背景とご案内を作り、枠の中に ?embed 付きで同じページを読み込む
//   ・内側（枠の中）…… 外部リンク（LINE）を枠ではなくページ全体で開くようにする
(() => {
  if (document.documentElement.classList.contains("pc-outer")) {
    const shell = document.createElement("div");
    shell.className = "pc-shell";
    const src = location.pathname + "?embed" + location.hash;
    shell.innerHTML =
      '<aside class="pc-side pc-side--left">' +
      '<img class="pc-logo" src="assets/logo.svg" alt="Mayro Pilates Studio" />' +
      '<span class="pc-badge">女性専用・完全マンツーマン</span>' +
      "<h2>自分の身体に合わせて整える<br />オーダーメイドの<br />マシンピラティス</h2>" +
      "<p>赤坂・溜池山王駅 徒歩1分</p><p>朝8:30〜夜21:30営業</p>" +
      "</aside>" +
      '<div class="pc-phone"><iframe title="Mayro 無料体験のご案内" src="' +
      src +
      '"></iframe></div>' +
      '<aside class="pc-side pc-side--right">' +
      "<p>友だち追加して、希望日時を送るだけ</p>" +
      '<a class="pc-line" href="https://lin.ee/o3mdHEh"><img src="assets/line-icon.svg" alt="" width="28" height="28" /><span>LINEで簡単申し込み｜60分無料体験</span></a>' +
      "</aside>";
    document.body.appendChild(shell);
  } else if (top !== self) {
    document.querySelectorAll('a[href^="http"]').forEach((a) => (a.target = "_top"));
  }
})();
