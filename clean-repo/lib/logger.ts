// lib/logger.ts

type LogLevel = "info" | "error" | "warn";

function timestamp() {
  return new Date().toISOString(); // e.g. 2025-09-21T10:45:30.123Z
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const prefix = `[Schema:${level.toUpperCase()}]`;
  const time = timestamp();

  if (meta) {
    console[level === "error" ? "error" : level](
      `${time} ${prefix} ${message}`,
      JSON.stringify(meta, null, 2)
    );
  } else {
    console[level === "error" ? "error" : level](`${time} ${prefix} ${message}`);
  }
}

export const logger = {
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};