import cron from "node-cron";

// Render's free tier spins a service down after 15 minutes without inbound
// traffic. Pinging every 10 minutes keeps it awake with a safety margin.
const SCHEDULE = process.env.KEEP_ALIVE_CRON || "*/10 * * * *";
// Always pings the live Render deployment.
const LIVE_URL = "https://magic-draw-backend.onrender.com";
const TIMEOUT_MS = 30_000;

const ping = async (url) => {
  const started = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    console.log(`[keep-alive] ${url} -> ${res.status} (${Date.now() - started}ms)`);
  } catch (err) {
    console.error(`[keep-alive] ping failed: ${err.message}`);
  }
};

export const startKeepAlive = () => {
  const url = `${LIVE_URL}/health`;
  cron.schedule(SCHEDULE, () => ping(url));
  console.log(`[keep-alive] pinging ${url} on "${SCHEDULE}"`);
};
