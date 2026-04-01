/**
 * Lightweight logger for analysis events (bonus: easy to swap for Winston/Pino later).
 */
const PREFIX = "[ai-cfo]";

export const log = {
  info(msg, meta = {}) {
    console.log(PREFIX, msg, Object.keys(meta).length ? JSON.stringify(meta) : "");
  },
  warn(msg, meta = {}) {
    console.warn(PREFIX, msg, Object.keys(meta).length ? JSON.stringify(meta) : "");
  },
  error(msg, err) {
    console.error(PREFIX, msg, err?.message || err);
  },
};
