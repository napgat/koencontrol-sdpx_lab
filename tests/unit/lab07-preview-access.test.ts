import { afterEach, describe, expect, it, vi } from "vitest";
import {
  lab07PreviewEnabled,
  lab07PreviewWriteAuthorized,
} from "../../src/lib/lab07-preview-access";

const token = "FAKE_LAB07_TOKEN_FOR_UNIT_TEST_ONLY_123456";

function configurePreview() {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("VERCEL_GIT_COMMIT_REF", "codex/lab-07-performance");
  vi.stubEnv(
    "LAB07_DATABASE_URL",
    "postgresql://fake:fake@ep-example.neon.tech/lab07_preview",
  );
  vi.stubEnv("LAB07_WRITE_TOKEN", token);
}

afterEach(() => vi.unstubAllEnvs());

describe("Lab 07 Preview access", () => {
  it("stays disabled in production and on other branches", () => {
    configurePreview();
    vi.stubEnv("VERCEL_ENV", "production");
    expect(lab07PreviewEnabled()).toBe(false);

    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_GIT_COMMIT_REF", "main");
    expect(lab07PreviewEnabled()).toBe(false);
  });

  it("rejects a non-dedicated database and short token", () => {
    configurePreview();
    vi.stubEnv(
      "LAB07_DATABASE_URL",
      "postgresql://fake:fake@ep-example.neon.tech/neondb",
    );
    expect(lab07PreviewEnabled()).toBe(false);

    vi.stubEnv(
      "LAB07_DATABASE_URL",
      "postgresql://fake:fake@ep-example.neon.tech/lab07_preview",
    );
    vi.stubEnv("LAB07_WRITE_TOKEN", "too-short");
    expect(lab07PreviewEnabled()).toBe(false);
  });

  it("requires the exact write token", () => {
    configurePreview();
    expect(lab07PreviewEnabled()).toBe(true);
    expect(lab07PreviewWriteAuthorized(new Request("https://example.invalid"))).toBe(false);
    expect(
      lab07PreviewWriteAuthorized(
        new Request("https://example.invalid", {
          headers: { "x-lab07-write-token": "wrong-token" },
        }),
      ),
    ).toBe(false);
    expect(
      lab07PreviewWriteAuthorized(
        new Request("https://example.invalid", {
          headers: { "x-lab07-write-token": token },
        }),
      ),
    ).toBe(true);
  });
});
