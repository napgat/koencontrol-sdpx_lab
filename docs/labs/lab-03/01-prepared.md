# Prepared: เตรียมพร้อมก่อนเรียน Unit Testing

> เอกสารนี้เป็นงานเตรียมความพร้อมก่อนเริ่ม Lab 03 ส่วนขั้นตอนในห้องอยู่ที่ `02_lab 3 instruction.md`

## 🎯 ทำแล้วได้อะไร

| สิ่งที่จะทำได้ | ใช้ในงานจริงอย่างไร |
|---|---|
| ยืนยันว่า test framework รันได้ก่อนเข้าห้อง | เวลาของทีมมีค่า — คนที่มาแล้วเครื่องรันไม่ได้ทำให้ทั้งกลุ่มช้าลง |
| วัดว่า test suite ของกลุ่มใช้เวลากี่วินาที | เวลารัน test คือตัวชี้วัดที่ทีมมืออาชีพเฝ้าดูเหมือน performance ของ product |
| ติดตั้ง Playwright ให้พร้อมล่วงหน้า | การเตรียมเครื่องมือก่อนถึงเวลาใช้ เป็นนิสัยที่ทำให้ sprint ไม่สะดุด |
| ปรับ backlog ตาม feedback ที่ได้รับ | requirement เปลี่ยนเป็นเรื่องปกติ — ทักษะคือปรับให้ทันโดยไม่ทำของเดิมพัง |

---

## งานที่ต้องทำก่อนเข้าห้อง

### 1. ยืนยัน Testing Framework ทำงานได้
```bash
# Python
pytest --version   # ต้องขึ้น version

# JavaScript / TypeScript
npm test           # ต้องเห็น test passed (จาก sample test ที่ทำใน WS-02--before)
```

### 2. Revise Backlog และ Wireframe
- แก้ user stories ตาม feedback ที่ได้รับจาก present
- วาด wireframe 3 screens หลักด้วย Excalidraw (https://excalidraw.com)
- เพิ่มใน `docs/wireframes/`

**วาด Wireframe 3 หน้าจอใน Excalidraw**
ให้ทำ 3 หน้า โดยยึดเฉพาะ “Group Evaluation” ตามขอบเขต Lab 02:

#### 1. `01-create-assignment.excalidraw` — Instructor สร้าง Assignment

- Assignment title
- Deadline
- Criteria 3 รายการ พร้อม weight
- ปุ่ม `Create assignment`
- กล่องแจ้งว่า total weight ต้องเท่ากับ 100%

ทำไม: สะท้อนกฎ Instructor เท่านั้นที่สร้าง assignment ได้ และ criteria ต้องรวม 100%

ตอน Demo พูดว่า:

> “หน้าจอนี้ทำให้เห็น input ที่ระบบต้อง validate โดยเฉพาะ deadline และผลรวมของ criteria weights ก่อนสร้าง assignment”

#### 2. `02-evaluate-pair.excalidraw` — Student ประเมินคู่ที่ได้รับ

- ชื่อ Assignment และ deadline
- Criterion ที่กำลังประเมิน
- Group A เทียบกับ Group B
- ตัวเลือก `Group A better / Equal / Group B better`
- ปุ่ม `Save draft` และ `Submit evaluation`
- สถานะ Draft หรือ Submitted

ทำไม: สะท้อน flow หลักของผู้เรียน—เลือกผล เปรียบเทียบ บันทึกร่าง และส่งงาน

ตอน Demo พูดว่า:

> “ผู้เรียนเห็นเฉพาะ pair ที่ได้รับมอบหมาย และบันทึก draft ได้ก่อนส่ง เมื่อส่งแล้วจะไม่แก้ไขได้ตามขอบเขต Lab MVP”

#### 3. `03-assignment-summary.excalidraw` — Instructor ดูสรุปผล

- ชื่อ Assignment และสถานะ deadline
- จำนวน pair ที่สร้างแล้ว
- Pair coverage / submission progress
- ตารางคะแนนสรุปของแต่ละกลุ่ม
- สถานะ readiness เช่น `Ready` หรือ `Needs more submissions`

ทำไม: สะท้อนความต้องการให้อาจารย์ติดตามความครบถ้วนและผลรวมได้

ตอน Demo พูดว่า:

> “หน้านี้ช่วยให้อาจารย์ตรวจว่า pair ถูกสร้างและมี coverage เพียงพอ รวมถึงเห็นภาพรวมคะแนนโดยไม่ต้องประเมินเอง”

### 3. ติดตั้ง Playwright (สำหรับ E2E ที่จะเริ่มใน week นี้)

```bash
npm init playwright@latest
# เลือก TypeScript, tests/ folder, GitHub Actions: No, browsers: yes (จะตั้งเองทีหลัง)
npx playwright install --with-deps chromium

# ยืนยัน
npx playwright --version
```

ทำอะไร: ติดตั้ง framework สำหรับจำลองผู้ใช้เปิดเว็บและคลิกใช้งานจริง

ทำไม: Unit test ตรวจ logic แบบแยกส่วน แต่ E2E จะยืนยันว่าเว็บหน้าแรกและ interaction หลักไม่พังเมื่อทำงานร่วมกัน

ตอน Demo พูดว่า:

> “ผมแยก unit test สำหรับ business rules ออกจาก E2E test ซึ่งใช้ Playwright จำลองพฤติกรรมผู้ใช้จริง เพื่อจับปัญหาที่เกิดระหว่าง UI กับระบบ”

### 4. เตรียมข้อมูลสำหรับ Lab: จับเวลา Test Loop
รัน test suite ปัจจุบัน (แม้จะมีแค่ 1 test) แล้วจดเวลา:
```bash
# Python
pytest --durations=5

# JS/TS
npm test
```

จดไว้ 2 ตัวเลข:
- test suite รันเสร็จในกี่วินาที
- ถ้าแก้ code 1 บรรทัดแล้วอยากรู้ว่าพังไหม ต้องรออีกกี่วินาที

> ตัวเลขนี้คือ **latency ของ Unit Test Loop** ของกลุ่ม เราจะพยายามรักษาให้ต่ำกว่า 10 วินาที
> ตลอดทั้งวิชา เพราะ loop ที่ช้าคือ loop ที่ไม่มีใครรัน (รวมถึง AI agent)

**Error**
สาเหตุชัดเจนครับ: `npm test` คือ Vitest แต่ Vitest ไปหยิบไฟล์ E2E ของ Playwright (`tests/example.spec.ts`) มารันด้วย จึงล้มเหลว ไม่ใช่ business logic พัง

ตอนนี้ยังใช้เวลา 450ms เป็น baseline ไม่ได้ เพราะ suite ยังแดง

ขั้นแก้ไข: แยก Unit test กับ E2E test ออกจากกัน

1. ย้าย Playwright sample ไปไว้ในโฟลเดอร์ E2E:

```
New-Item -ItemType Directory -Force tests/e2e
Move-Item tests/example.spec.ts tests/e2e/example.spec.ts
```

2. สร้างไฟล์ใหม่ชื่อ `vitest.config.ts` ที่ root ของ `koencontrol-lab-03` แล้วใส่:

```
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "tests/e2e/**",
    ],
  },
});
```

**ทำอะไร:** บอก Vitest ว่าอย่ารันไฟล์ใน `tests/e2e` เพราะไฟล์กลุ่มนั้นต้องรันด้วย Playwright

**ทำไม:** Unit test กับ E2E ใช้ test runner คนละตัว การแยกพื้นที่ทำให้ `npm test` เร็วและไม่ชนกัน

ตอน Demo พูดว่า:

> “ผมแยก Unit test และ E2E test ให้ใช้ runner ที่ถูกต้อง โดย Vitest จะรันเฉพาะ unit tests ส่วน Playwright จะรัน E2E เพื่อป้องกัน test framework ชนกัน”

จากนั้นรัน:

```
E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03>npm test

> pairwise-eval@0.1.0 test
> vitest run


 RUN  v5.0.0 E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03

 ✓ sample.test.ts (1 test) 2ms
   ✓ ok 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  18:42:26
   Duration  138ms (transform 46%, import 34%, worker 12%, tests 6%, environment 1%)
```

```
Unit test loop baseline (WS-03 before)
- Test suite: 0.138 วินาที
- แก้โค้ด 1 บรรทัดแล้วรันตรวจซ้ำ: ประมาณ 0.138 วินาที
- เป้าหมาย: ต่ำกว่า 10 วินาที
- สถานะ: ผ่าน
```

**เหตุผลที่ใช้ตัวเลขเดียวกัน:** การเปลี่ยนโค้ดเล็กน้อยแล้วรัน `npm test` จะใช้เวลาใกล้เคียงกับ test suite ปัจจุบัน; ในเครื่องนี้คือประมาณ 0.14 วินาที

ตอน Demo พูดว่า:

> “Baseline ของ unit test loop คือประมาณ 0.14 วินาทีต่อรอบ ซึ่งต่ำกว่าเกณฑ์ 10 วินาทีมาก จึงเหมาะที่จะรันทุกครั้งหลังแก้โค้ด”
---

## 🔗 ของที่ทำมา จะกลายเป็นอะไรในห้อง

งานทุกชิ้นในหน้านี้ถูกออกแบบให้เป็น **วัตถุดิบของ lab** ไม่ใช่แบบฝึกหัดที่ทำแล้วทิ้ง
คาบเรียนเริ่มจากสมมติฐานว่าของเหล่านี้พร้อมแล้ว

| ผลงานจาก homework | ถูกใช้ต่อที่ | ถ้ายังไม่มี |
|---|---|---|
| testing framework ที่ยืนยันแล้วว่ารันได้ | lab Part A — เริ่มเขียน test ได้ทันทีในนาทีแรก | หมดครึ่ง lab ไปกับการ debug config ของ test runner |
| backlog และ wireframe ที่ revise แล้ว | lab Part A — เลือก business rule ที่จะ test จากที่นี่ | ไม่รู้ว่าอะไรคือกฎที่ควรมี test คุ้มครองมากที่สุด |
| Playwright ที่ติดตั้งแล้ว | lab Part B — เขียน E2E ตัวแรก | เสียเวลา 30 นาทีสุดท้ายไปกับการ download browser |
| ตัวเลขเวลาที่ test loop ของกลุ่มใช้ | lecture หัวข้อ 1 — เทียบ latency ของ loop ระหว่างกลุ่ม | ไม่มีฐานเทียบว่า loop ของกลุ่มตัวเองเร็วหรือช้า |

> ถ้าทำไม่ทันข้อไหน ให้แจ้งใน 5 นาทีแรกของคาบ — จะได้จัดคู่ช่วยกันได้ทัน
> อย่าเงียบไว้แล้วไปติดกลาง lab เพราะจะกระทบทั้งกลุ่ม
