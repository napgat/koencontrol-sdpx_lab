import { createHash, timingSafeEqual } from "node:crypto";

function hasDedicatedTestDatabase(): boolean {
  const value = process.env.LAB07_DATABASE_URL;
  if (!value) return false;

  try {
    const databaseUrl = new URL(value);
    return (
      (databaseUrl.protocol === "postgres:" ||
        databaseUrl.protocol === "postgresql:") &&
      databaseUrl.hostname.endsWith(".neon.tech") &&
      databaseUrl.pathname === "/lab07_preview"
    );
  } catch {
    return false;
  }
}

export function lab07PreviewEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "codex/lab-07-performance" &&
    hasDedicatedTestDatabase() &&
    (process.env.LAB07_WRITE_TOKEN?.length ?? 0) >= 32
  );
}

export function lab07PreviewWriteAuthorized(request: Request): boolean {
  if (!lab07PreviewEnabled()) return false;

  const expected = process.env.LAB07_WRITE_TOKEN;
  const supplied = request.headers.get("x-lab07-write-token");
  if (!expected || expected.length < 32 || !supplied) return false;

  const expectedHash = createHash("sha256").update(expected).digest();
  const suppliedHash = createHash("sha256").update(supplied).digest();
  return timingSafeEqual(expectedHash, suppliedHash);
}
