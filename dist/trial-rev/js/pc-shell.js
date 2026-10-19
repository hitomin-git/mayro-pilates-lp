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
    const spacer = document.createElement("div");
    spacer.className = "pc-spacer";
    document.body.append(shell, spacer);
    // ブラウザ全体をスクロールさせ、その量を iframe 内のページへ伝える（スクロールバーは画面の端に出る）
    const frame = shell.querySelector("iframe");
    const inner = () => frame.contentWindow;
    const size = () => {
      const doc = frame.contentDocument && frame.contentDocument.documentElement;
      if (doc) spacer.style.height = doc.scrollHeight + "px";
    };
    const toInner = () => {
      const w = inner();
      if (w && Math.abs(w.scrollY - scrollY) > 1) w.scrollTo({ top: scrollY, behavior: "instant" });
    };
    const toOuter = () => {
      const w = inner();
      if (w && Math.abs(w.scrollY - scrollY) > 1) scrollTo({ top: w.scrollY, behavior: "instant" });
    };
    frame.addEventListener("load", () => {
      const w = inner();
      size();
      new w.ResizeObserver(size).observe(w.document.documentElement);
      w.addEventListener("scroll", toOuter, { passive: true });
      toInner();
    });
    addEventListener("scroll", toInner, { passive: true });
    addEventListener("resize", size);
  } else if (top === self) {
    // スマホ幅から900px以上に広げたら、再読み込みしてPC用の枠にする
    matchMedia("(min-width:900px)").addEventListener("change", (e) => {
      if (e.matches && !/[?&]plain/.test(location.search)) location.reload();
    });
  } else {
    // PC用の枠の中では、スクロールバーを隠す（外側のブラウザ全体のスクロールバーを使う）
    try {
      if (top.document.documentElement.classList.contains("pc-outer")) {
        const st = document.createElement("style");
        st.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
        document.head.appendChild(st);
      }
    } catch (e) {}
    // PC用の枠の中ではページ全体で、端末別プレビューなど他の枠の中では新しいタブで開く
    let inShell = false;
    try {
      inShell = top.document.documentElement.classList.contains("pc-outer");
    } catch (e) {}
    document.querySelectorAll('a[href^="http"]').forEach((a) => (a.target = inShell ? "_top" : "_blank"));
  }
})();
