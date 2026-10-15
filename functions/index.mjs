import { onRequest } from "firebase-functions/v2/https";
import { loadSchedule } from "./schedule.mjs";
export const schedule = onRequest(
  {
    region: "asia-northeast1",
    timeoutSeconds: 60,
    memory: "256MiB",
    maxInstances: 3,
    invoker: "public",
    cors: [
      "https://mayro-pilates.com",
      "https://www.mayro-pilates.com",
      "https://hitomin-git.github.io",
    ],
  },
  async (req, res) => {
    res.set("Cache-Control", "no-store, max-age=0");
    if (req.method !== "GET") {
      res.status(405).json({ error: "GET only" });
      return;
    }
    try {
      res.json(await loadSchedule());
    } catch {
      res
        .status(502)
        .json({
          error:
            "最新の日程を取得できませんでした。時間を置いて再取得してください。",
        });
    }
  },
);
