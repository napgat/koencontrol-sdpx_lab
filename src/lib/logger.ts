import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "pairwise-eval" },
  redact: {
    paths: [
      "authorization",
      "cookie",
      "password",
      "token",
      "email",
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.token",
      "req.body.email",
      "*.password",
      "*.token",
      "*.email",
    ],
    censor: "[REDACTED]",
  },
});