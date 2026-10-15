export const SOURCE = "https://mayro.hacomono.jp/reserve/schedule/1/1/";
export const addDays = (d, n) =>
  new Date(Date.parse(d + "T00:00:00Z") + n * 86400000)
    .toISOString()
    .slice(0, 10);
export const todayJST = () =>
  new Date(Date.now() + 32400000).toISOString().slice(0, 10);
export function parseSchedule(html, from) {
  const root = { children: [], cls: [], text: "" },
    stack = [root];
  const clean = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  for (const m of clean.matchAll(
    /<div\b([^>]*)>|<\/div\s*>|([^<]+)|<[^>]*>/gi,
  )) {
    if (m[1] !== undefined) {
      const el = {
        children: [],
        cls: (m[1].match(/class="([^"]*)"/)?.[1] || "").split(/\s+/),
        text: "",
      };
      stack.at(-1).children.push(el);
      stack.push(el);
    } else if (/^<\/div/i.test(m[0])) {
      if (stack.length > 1) stack.pop();
    } else if (m[2]) stack.at(-1).text += m[2];
  }
  const find = (e, c) =>
    e.children.flatMap((x) => [
      ...(x.cls.includes(c) ? [x] : []),
      ...find(x, c),
    ]);
  const text = (e) =>
    e
      ? (e.text + " " + e.children.map(text).join(" "))
          .replace(/\s+/g, " ")
          .trim()
      : "";
  const rows = find(root, "lessons"),
    result = [];
  if (!rows.length) throw Error("Calendar structure missing");
  for (const row of rows) {
    if (row.children.length !== 7) throw Error("Calendar columns changed");
    row.children.forEach((col, day) => {
      for (const card of find(col, "d_lesson")) {
        const t = text(find(card, "time")[0]).match(
          /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/,
        );
        if (!t) throw Error("Missing time");
        const date = addDays(from, day),
          instructor = text(find(card, "instructor-name")[0]),
          trial = find(card, "trial").length > 0,
          full = card.cls.includes("full"),
          disabled = card.cls.includes("disabled");
        result.push({
          id: [date, t[1], instructor].join("_"),
          date,
          start: t[1],
          end: t[2],
          instructor,
          trial,
          full,
          disabled,
          available: trial && !full && !disabled,
        });
      }
    });
  }
  return result;
}
export function displayRange(today) {
  const d = new Date(today + "T00:00:00Z");
  const from = addDays(today, 2);
  const to = new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth() + (d.getUTCDate() >= 21 ? 2 : 1),
      0,
    ),
  )
    .toISOString()
    .slice(0, 10);
  const weekday = new Date(from + "T00:00:00Z").getUTCDay();
  const calendarFrom = addDays(from, -((weekday + 6) % 7));
  const weekCount = Math.ceil(
    (Date.parse(to + "T00:00:00Z") -
      Date.parse(calendarFrom + "T00:00:00Z") +
      86400000) /
      (7 * 86400000),
  );
  return { from, to, calendarFrom, weekCount };
}
export async function loadSchedule() {
  const today = todayJST(),
    range = displayRange(today);
  const weeks = await Promise.all(
    Array.from({ length: range.weekCount }, async (_, i) => {
      const date = addDays(range.calendarFrom, i * 7);
      const r = await fetch(SOURCE + "?date_from=" + date, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw Error("Fetch failed");
      return parseSchedule(await r.text(), date);
    }),
  );
  return {
    ...range,
    today,
    fetchedAt: new Date().toISOString(),
    slots: [
      ...new Map(
        weeks
          .flat()
          .filter((s) => s.date >= range.from && s.date <= range.to)
          .map((s) => [s.id, s]),
      ).values(),
    ].sort((a, b) =>
      (a.date + a.start.padStart(5, "0")).localeCompare(
        b.date + b.start.padStart(5, "0"),
      ),
    ),
    source: SOURCE,
  };
}
