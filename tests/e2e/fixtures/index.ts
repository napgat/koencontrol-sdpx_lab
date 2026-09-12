import { test as base, expect } from "@playwright/test";

type TestFixtures = {
  cleanDb: void;
};

export const test = base.extend<TestFixtures>({
  cleanDb: [
    async ({ request }, use) => {
      const seedResponse = await request.post("/api/test/seed");
      expect(seedResponse.ok(), "seed endpoint must succeed").toBeTruthy();

      await use();

      const cleanupResponse = await request.post("/api/test/cleanup");
      expect(cleanupResponse.ok(), "cleanup endpoint must succeed").toBeTruthy();
    },
    { auto: true },
  ],
});

export { expect };