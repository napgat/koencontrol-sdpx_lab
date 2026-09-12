# Lab 04 — Instruction: E2E Testing & E2E Test Harness

## เวลา

1.5 ชั่วโมง

## เป้าหมาย

สร้าง E2E Test Harness ครบ 4 ชั้น ครอบคลุม user journey หลัก และพร้อมรันใน CI

## ทำ Lab นี้แล้วได้ทักษะอะไร

| สิ่งที่จะทำได้ | ใช้ในงานจริงอย่างไร |
| --- | --- |
| สร้าง Page Object ที่แยก locator ออกจาก assertion | เมื่อ UI เปลี่ยน แก้ที่เดียวแทนการไล่แก้ทุก test |
| ตั้ง fixture ที่ seed และ cleanup ให้ทุก test เริ่มจากจุดเดียวกัน | Test ที่ปนเปื้อนกันเองเป็นสาเหตุสำคัญของผลลัพธ์ที่เชื่อถือไม่ได้ |
| รัน test ซ้ำหลายรอบเพื่อจับ flaky test ก่อนขึ้น CI | ถูกกว่าและเร็วกว่าการพบ pipeline แดงภายหลัง |
| เขียน test ที่ trace กลับไปหา acceptance criteria ได้ | ช่วยตอบว่า feature ถูกทดสอบครบตามที่ตกลงไว้หรือไม่ |

---

## สิ่งที่ต้องมีอยู่แล้วก่อนเริ่ม Lab

Lab นี้ไม่เริ่มจากศูนย์ แต่ต่อยอดจากงานใน `WS-04--before` ทันที หากรายการใดยังไม่พร้อม ให้จัดการรายการนั้นก่อนเริ่มขั้นตอน Lab

| ต้องมี | จะถูกใช้ที่ | ถ้ายังไม่มี |
| --- | --- | --- |
| Docker Desktop ที่รันได้ | Lab ขั้นตอนที่ 2 และเป็นพื้นฐานทั้งหมดของ WS-05 | จะติดปัญหาหนักในสัปดาห์ถัดไป |
| Accessible role และ `data-testid` ใน component | Lab ขั้นตอนที่ 3–4: เขียน Page Object และ E2E | ต้องใช้ locator ที่ผูกกับโครงสร้าง HTML และ test จะ flaky ตั้งแต่ตัวแรก |
| Seed endpoint สำหรับเตรียมข้อมูลทดสอบ | Lab ขั้นตอนที่ 2: fixtures และ test isolation | Test แต่ละตัวจะแย่งข้อมูลกัน และผลจะเปลี่ยนตามลำดับการรัน |

**แผนสำรองเมื่อของไม่ครบ:** จับคู่กับเพื่อนที่เตรียมของพร้อมแล้ว ใช้เครื่องของเพื่อนเดินต่อ และตามเก็บงานของตนเองหลังคาบ ห้ามให้ทั้งกลุ่มหยุดรอคนเดียว

---

## ขั้นตอนที่ 1 — โครงสร้างและ Config

โครงสร้างเป้าหมาย:

```text
tests/
└── e2e/
    ├── fixtures/
    │   └── index.ts                 ← custom fixtures + seed lifecycle
    ├── pages/
    │   ├── HomePage.ts              ← Page Objects
    │   └── [Domain]Page.ts
    ├── seed/
    │   └── test-data.ts             ← seed data definitions
    └── specs/
        ├── smoke.spec.ts            ← basic health checks
        └── [domain].spec.ts         ← feature tests
playwright.config.ts
```

### 1.1 สร้างโฟลเดอร์ E2E ตามบทบาท

```powershell
New-Item -ItemType Directory -Force tests/e2e/fixtures
New-Item -ItemType Directory -Force tests/e2e/pages
New-Item -ItemType Directory -Force tests/e2e/seed
New-Item -ItemType Directory -Force tests/e2e/specs
```

ย้าย smoke test เดิมเข้า `specs`:

```powershell
Move-Item tests/e2e/smoke.spec.ts tests/e2e/specs/smoke.spec.ts
```

### 1.2 สร้าง Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e/specs",
  fullyParallel: !process.env.CI,   // local: ขนาน / CI: เรียงเพื่อความนิ่ง
  forbidOnly: !!process.env.CI,     // กัน test.only หลุดเข้า CI
  retries: process.env.CI ? 1 : 0,  // retry น้อย ๆ เพื่อไม่ให้ซ่อน flaky
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
  ],
  // ให้ Playwright เริ่ม app เองหากยังไม่ได้รัน เพื่อลดปัญหา "ลืมเปิด server"
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

> `forbidOnly` ป้องกัน `test.only` ทำให้ CI เขียวทั้งที่รันเพียง test เดียว และ `webServer` ป้องกัน test แดงเพราะลืมเปิด server

### 1.3 รันตรวจ Config

```bash
npx playwright test --project=chromium
npx playwright show-report
```

ตรวจว่า Playwright หา spec ใน `tests/e2e/specs`, เปิด Next.js และสร้าง HTML report ใน `playwright-report` ได้

---

## ขั้นตอนที่ 2 — Seed Data และ Fixtures

### 2.1 สร้าง Seed Data Definition

สร้าง `tests/e2e/seed/test-data.ts`:

```typescript
export const testData = {
  assignment: {
    id: "assignment-lab-04",
    title: "Software Engineering Project Lab #2",
  },
  evaluator: {
    id: "student-evaluator-01",
    email: "student@test.com",
    role: "student",
  },
  pair: {
    id: "pair-01",
    criterion: "System Architecture",
    candidateA: "Group 01: Smart Campus IoT",
    candidateB: "Group 04: AI Vision Nav",
  },
} as const;
```

### 2.2 สร้าง Custom Fixture

สร้าง `tests/e2e/fixtures/index.ts`:

```typescript
import { test as base, expect } from "@playwright/test";

type TestFixtures = {
  cleanDb: void;
};

export const test = base.extend<TestFixtures>({
  cleanDb: [
    async ({ request }, use) => {
      // Setup: seed ข้อมูลก่อน test
      const seedResponse = await request.post("/api/test/seed");
      expect(seedResponse.ok(), "seed endpoint must succeed").toBeTruthy();

      await use();

      // Teardown: cleanup หลัง test แม้ test จะ fail
      const cleanupResponse = await request.post("/api/test/cleanup");
      expect(cleanupResponse.ok(), "cleanup endpoint must succeed").toBeTruthy();
    },
    { auto: true },
  ],
});

export { expect };
```

ใช้ `request` fixture ของ Playwright แทน `fetch` โดยตรง เพราะใช้ `baseURL` เดียวกับ test และเปลี่ยน environment ได้จากจุดเดียว

### 2.3 ให้ Spec ใช้ Custom Fixture

เปลี่ยน import ใน spec จาก:

```typescript
import { expect, test } from "@playwright/test";
```

เป็น:

```typescript
import { expect, test } from "../fixtures";
```

### 2.4 ยืนยันว่า Seed Endpoint ปิดใน Production

```typescript
// app/api/test/seed/route.ts
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }
  // ...
}
```

### 2.5 รันตรวจ Fixture

```bash
npx playwright test --project=chromium
```

หาก seed หรือ cleanup endpoint ตอบไม่สำเร็จ fixture ต้องทำให้ test fail เพื่อแสดงว่า test state ไม่พร้อม

---

## ขั้นตอนที่ 3 — สร้าง Page Objects

สร้าง `tests/e2e/pages/PairwiseEvaluationPage.ts`:

```typescript
import { Locator, Page } from "@playwright/test";

export class PairwiseEvaluationPage {
  readonly candidateAButton: Locator;
  readonly candidateBButton: Locator;
  readonly tieButton: Locator;
  readonly saveDraftButton: Locator;
  readonly nextPairButton: Locator;
  readonly successMessage: Locator;
  readonly pairProgress: Locator;

  constructor(private readonly page: Page) {
    this.candidateAButton = page.getByRole("button", {
      name: /Group 01: Smart Campus IoT/i,
    });
    this.candidateBButton = page.getByRole("button", {
      name: /Group 04: AI Vision Nav/i,
    });
    this.tieButton = page.getByRole("button", { name: /Tie \/ Equal/i });
    this.saveDraftButton = page.getByRole("button", { name: /Save Draft/i });
    this.nextPairButton = page.getByRole("button", { name: /Next Pair/i });
    this.successMessage = page.getByTestId("success-msg");
    this.pairProgress = page.getByTestId("pair-progress");
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectCandidateA() {
    await this.candidateAButton.click();
  }

  async selectCandidateB() {
    await this.candidateBButton.click();
  }

  async selectTie() {
    await this.tieButton.click();
  }

  async saveDraft() {
    await this.saveDraftButton.click();
  }

  async goToNextPair() {
    await this.nextPairButton.click();
  }
}
```

### Checklist ของ Page Object

- [ ] ไม่มี `expect()` อยู่ข้างใน
- [ ] Locator เป็น `readonly` property ไม่ใช่ string ที่กระจายในแต่ละ method
- [ ] Method ใช้ชื่อตามภาษาของ domain เช่น `selectRoom` ไม่ใช่ภาษาของ UI เช่น `clickDiv3`

---

## ขั้นตอนที่ 4 — เขียน E2E Tests

### 4.1 Smoke Tests (Health Check)

```typescript
// tests/e2e/specs/smoke.spec.ts
import { expect, test } from "../fixtures";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/PairEval/);
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("main feature page is accessible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

### 4.2 Feature Tests (Happy Path และ Edge Cases)

เลือก acceptance criteria จาก GitHub Issue มา implement โดยตรง และเขียน comment อ้าง Issue กับ AC ไว้เหนือทุก feature test เพื่อให้ trace กลับไปหา story ได้ทันที

ตัวอย่างสำหรับ Pairwise Evaluation:

```typescript
// tests/e2e/specs/pairwise-evaluation.spec.ts
import { expect, test } from "../fixtures";
import { PairwiseEvaluationPage } from "../pages/PairwiseEvaluationPage";

test.describe("Pairwise evaluation", () => {
  // Trace: GitHub Issue #4 — https://github.com/napgat/koencontrol-sdpx_lab/issues/4
  // AC: Given assigned pairs, when a student selects one or more pairs and saves,
  // then the system stores the answers as a draft.
  test("student can save a selected pair as draft", async ({ page }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();
    await evaluationPage.selectCandidateA();
    await expect(evaluationPage.saveDraftButton).toBeEnabled();

    await evaluationPage.saveDraft();
    await expect(evaluationPage.successMessage).toBeVisible();
  });

  // Trace: GitHub Issue #3 — https://github.com/napgat/koencontrol-sdpx_lab/issues/3
  // AC: Given I am evaluating my assigned pairs, when I select an outcome for
  // the current pair and choose Next Pair, then the system displays the next assigned pair.
  test("student advances to the next pair after making a selection", async ({
    page,
  }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();
    await expect(evaluationPage.pairProgress).toHaveText("PAIR 3 / 5");

    await evaluationPage.selectCandidateB();
    await expect(evaluationPage.nextPairButton).toBeEnabled();

    await evaluationPage.goToNextPair();
    await expect(evaluationPage.pairProgress).toHaveText("PAIR 4 / 5");
  });
});
```

### 4.3 รันและตรวจผล

```bash
npx playwright test --project=chromium
npx playwright show-report

# รันซ้ำสามรอบเพื่อจับ flaky test
npx playwright test --project=chromium --repeat-each=3

# ตรวจ TypeScript/JSX และ code quality หลังแก้ไฟล์ทั้งหมด
npm run lint
```

หากรอบใดรอบหนึ่งแดง แสดงว่ามี flaky test ให้หา root cause ทันที ไม่ควรรอให้ปัญหาไปปรากฏใน CI

---

## Artifacts ที่ต้องส่ง

| Artifact | รายละเอียด | ที่ส่ง |
| --- | --- | --- |
| `playwright.config.ts` | มี baseURL, trace และ forbidOnly | GitHub repo |
| `tests/e2e/pages/` | มี Page Object อย่างน้อยหนึ่งไฟล์และไม่มี `expect()` ข้างใน | GitHub repo |
| `tests/e2e/fixtures/` | มี Custom fixture พร้อม seed/cleanup | GitHub repo |
| `tests/e2e/specs/` | มี Smoke test และ feature tests อย่างน้อยสองกรณีที่อ้าง AC | GitHub repo |
| `playwright-report/` | HTML report จากการรัน | GitHub repo |

## เกณฑ์ผ่าน

- [ ] E2E tests รันผ่านทั้งหมด
- [ ] `--repeat-each=3` แล้วยังเขียวทุกรอบ ไม่มี flaky test
- [ ] มี Page Object อย่างน้อยหนึ่งตัวและไม่มี `expect()` ข้างใน
- [ ] Seed data และ cleanup ทำงานได้ และ seed endpoint ปิดใน production
- [ ] ไม่มี `waitForTimeout` และไม่มีวันที่ hardcode ในทุก test
- [ ] ทุก feature test อ้างถึง acceptance criteria ที่มาจาก GitHub Issue
