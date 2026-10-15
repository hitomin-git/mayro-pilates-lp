const $ = (id) => document.getElementById(id),
  rank = ["①", "②", "③"];
let data = null,
  selected = [],
  week = 0;
const label = (d) =>
  new Date(d + "T00:00:00+09:00").toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  });
const add = (d, n) =>
  new Date(Date.parse(d + "T00:00:00Z") + n * 86400000)
    .toISOString()
    .slice(0, 10);
function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function step(n) {
  ["calendarStep", "nameStep", "messageStep"].forEach(
    (id, i) => ($(id).hidden = i !== n - 1),
  );
  document
    .querySelectorAll(".steps>span")
    .forEach((e, i) => e.classList.toggle("active", i === n - 1));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function choose(s) {
  const pageScroll = window.scrollY;
  $("notice").textContent = "";
  const index = selected.findIndex((x) => x.id === s.id);
  if (index >= 0) selected.splice(index, 1);
  else if (selected.some((x) => x.date === s.date && x.start === s.start))
    $("notice").textContent = "同じ日時は１つだけ選んでください。";
  else if (selected.length === 3)
    $("notice").textContent =
      "３つ選択済みです。選んだ枠をもう一度押すと解除できます。";
  else selected.push(s);
  render();
  window.scrollTo({ top: pageScroll, behavior: "instant" });
}
function render() {
  const calendarScroll = $("calendar").scrollTop;
  $("choices").replaceChildren();
  $("count").textContent = selected.length + "/3";
  $("toName").disabled = !selected.length || !data;
  if (!selected.length)
    $("choices").append(
      el("p", "カレンダーからご希望の日時を選んでください。"),
    );
  selected.forEach((s, i) => {
    const row = el("div", undefined, "choice"),
      details = el("span", label(s.date) + "　" + s.start + "〜" + s.end);
    const remove = el("button", "×");
    remove.setAttribute("aria-label", "第" + (i + 1) + "希望を削除");
    remove.onclick = () => choose(s);
    row.append(el("b", rank[i]), details, remove);
    $("choices").append(row);
  });
  if (!data) return;
  const days = Array.from({ length: 7 }, (_, i) =>
    add(data.calendarFrom, week * 7 + i),
  );
  $("range").textContent = label(days[0]) + " — " + label(days[6]);
  $("prev").disabled = week === 0;
  $("next").disabled = week === data.weekCount - 1;
  const grid = el("div", undefined, "calendar-grid");
  $("calendar").replaceChildren(grid);
  days.forEach((day) => {
    const col = el("div", undefined, "day");
    col.append(el("h4", label(day)));
    const list = el("div", undefined, "slot-list");
    list.setAttribute("aria-label", label(day) + "の時間枠");
    col.append(list);
    if (day < data.from || day > data.to) {
      col.classList.add("outside");
      const outside = el("p", "対象期間外", "none outside-label");
      col.insertBefore(outside, list);
      list.remove();
      grid.append(col);
      return;
    }
    const slots = [
      ...new Map(
        data.slots
          .filter((s) => s.date === day && s.available)
          .map((s) => [s.start + "_" + s.end, s]),
      ).values(),
    ];
    if (!slots.length) list.append(el("p", "受付可能な体験枠なし", "none"));
    slots.forEach((s) => {
      const i = selected.findIndex((x) => x.id === s.id),
        b = el("button", undefined, "slot" + (i >= 0 ? " selected" : ""));
      b.setAttribute("aria-pressed", String(i >= 0));
      b.append(el("strong", s.start), el("small", "〜" + s.end));
      if (i >= 0) b.append(el("b", rank[i], "badge"));
      b.onclick = () => choose(s);
      list.append(b);
    });
    grid.append(col);
  });
  $("calendar").scrollTop = calendarScroll;
}
async function refresh() {
  data = null;
  selected = [];
  week = 0;
  $("notice").textContent = "";
  $("calendarArea").hidden = true;
  $("status").hidden = false;
  $("status").textContent = "最新の日程を取得しています…";
  render();
  try {
    if (!window.MAYRO_SCHEDULE_URL) throw Error("日程ページは公開準備中です。");
    const r = await fetch(window.MAYRO_SCHEDULE_URL, { cache: "no-store" }),
      d = await r.json();
    if (!r.ok) throw Error(d.error);
    data = d;
    $("status").hidden = true;
    $("calendarArea").hidden = false;
    render();
  } catch (e) {
    $("status").textContent =
      e.message || "取得できませんでした。ページを再読み込みしてください。";
  }
}
$("prev").onclick = () => {
  week--;
  $("calendar").scrollTop = 0;
  render();
};
$("next").onclick = () => {
  week++;
  $("calendar").scrollTop = 0;
  render();
};
$("toName").onclick = () => step(2);
$("backCalendar").onclick = () => step(1);
$("backName").onclick = () => step(2);
$("nameForm").onsubmit = (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  if (!name) {
    $("name").setCustomValidity("お名前を入力してください。");
    $("name").reportValidity();
    return;
  }
  $("message").value =
    "無料体験を希望します。\nお名前：" +
    name +
    "\n\n" +
    selected
      .map(
        (s, i) =>
          "第" +
          (i + 1) +
          "希望：" +
          label(s.date) +
          " " +
          s.start +
          "〜" +
          s.end,
      )
      .join("\n") +
    "\n\nご確認をお願いいたします。";
  $("copy").textContent = "文章をコピー";
  $("copyStatus").textContent = "";
  step(3);
};
$("name").oninput = () => $("name").setCustomValidity("");
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("message").value);
    $("copy").textContent = "✓ コピーしました";
  } catch {
    $("message").select();
    $("copyStatus").textContent =
      "文章を選択しました。手動でコピーしてください。";
  }
};
refresh();
