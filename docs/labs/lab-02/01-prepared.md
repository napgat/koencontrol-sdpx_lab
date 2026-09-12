# Prepared — Lab 02: เตรียมพร้อมก่อนเรียน Requirements & API Design

เอกสารเตรียมตัวก่อนเรียน `WS-02--before` สำหรับโครงการ PairEval
ส่วนขั้นตอนระหว่าง Lab อยู่ใน `02_lab 2 instruction.md`

> แหล่งอ้างอิงโจทย์: `SDPX-AI/WS-02--before/homework.md` ตัวอย่างคำสั่งและบันทึกผลด้านล่างเป็นเอกสารอ้างอิงในการเรียน

## 🎯 ทำแล้วได้อะไร

| สิ่งที่จะทำได้ | ใช้ในงานจริงอย่างไร |
| --- | --- |
| ติดตั้งและยืนยันว่า test framework รันได้จริง | สภาพแวดล้อมที่รัน test ไม่ได้ = ทีมทั้งทีมทำงานแบบไร้สัญญาณ |
| ตรวจว่าคำสั่งใน `AGENTS.md` รันได้จริง | เอกสารที่บอกคำสั่งผิดจะทำให้ทั้งคนใหม่และ AI เดินผิดทางตั้งแต่ก้าวแรก |
| วาด component diagram ด้วย Mermaid ที่อยู่ใน git ได้ | diagram ที่อยู่ใน version control จะไม่ล้าสมัยเงียบ ๆ แบบรูปภาพที่แปะไว้ใน chat |
| ตั้งคำถามที่ requirement ยังตอบไม่ได้ | คำถามที่ยังไม่มีคำตอบคือช่องที่ทั้งคนและ AI จะเดาแทน และเป็นต้นเหตุของงานที่ต้องรื้อ |

---

## งานที่ต้องทำก่อนเข้าห้อง

### 1. ติดตั้ง Testing Framework

ติดตั้ง **Vitest** ให้พร้อม เพื่อใช้ในสัปดาห์ถัดไป:
**ทำไมต้องทำ:** Lab ถัดไปกำหนดให้ทุก User Story มี unit test อยู่ใน Definition of Done เราจึงต้องพิสูจน์ก่อนว่าโปรเจกต์รัน test ได้จริง

โปรเจกต์ `koencontrol-lab-02` เป็น Next.js/TypeScript ดังนั้นใช้ Vitest สำหรับรัน unit test

**JavaScript / TypeScript (Vitest):**

```bash
npm install --save-dev vitest @vitest/coverage-v8
# เพิ่มใน package.json: "test": "vitest run", "test:watch": "vitest" ใน `scripts`
# ทดสอบ
echo "import {test, expect} from 'vitest'; test('ok', () => expect(1+1).toBe(2))" > sample.test.ts
npm test  # ต้องเห็น 1 passed
rm sample.test.ts
```

#### บันทึกปัญหาที่พบระหว่างเตรียมเครื่อง

ตอนติดตั้ง test framework พบ dependency conflict ระหว่าง Node type version เดิมกับ Vitest ผมแก้ที่ต้นเหตุโดย align `@types/node` ให้ตรงกับ Node runtime แทนการบังคับติดตั้งด้วย `--force`

```
npm install --save-dev @types/node@^24 vitest @vitest/coverage-v8
```

**ผลทดสอบที่บันทึกไว้:**

```
 RUN  v5.0.0 E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-02/koencontrol-lab-02

 ✓ sample.test.ts (1 test) 2ms
   ✓ ok 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  13:59:04
   Duration  1.72s (worker 43%, import 30%, transform 24%, tests 3%)
```

#### การทำงานของไฟล์ทดสอบ

```
import { test, expect } from "vitest"; // นำฟังก์ชันสองตัวจาก Vitest มาใช้
```

```
test("ok", () => ...) // ประกาศ test case ชื่อ `"ok"` และส่งฟังก์ชันด้านในให้ Vitest รัน
```

```
expect(1 + 1).toBe(2) // คือ assertion: “คาดหวังว่า `1 + 1` ต้องเท่ากับ `2`” ถ้าจริง test ผ่าน; ถ้าเป็น `.toBe(3)` test จะ fail
```

การเรียกใช้เป็นลำดับนี้:

```
npm test
→ อ่าน scripts.test จาก package.json
→ รัน vitest run
→ Vitest ค้นหาไฟล์ที่ลงท้าย .test.ts
→ พบ sample.test.ts
→ รัน test ชื่อ "ok"
→ เปรียบเทียบ 1 + 1 กับ 2
→ แสดง 1 passed
```

### 2. เพิ่มคำสั่ง test ลงใน AGENTS.md

เปิด `AGENTS.md` ที่สร้างไว้ใน WS-01 แล้วยืนยันว่าบรรทัด `test:` ชี้ไปคำสั่งที่รันได้จริง

```bash
# ทดสอบว่า agent จะรันได้จริง — copy คำสั่งจาก AGENTS.md มารันตรง ๆ
npm test     # หรือ  pytest
```

> ถ้าคำสั่งใน `AGENTS.md` รันไม่ได้ แปลว่า loop ของ agent จะพังตั้งแต่ขั้น Verify

**ทำอะไร:** ตรวจเอกสารคำสั่งของโปรเจกต์ให้ตรงกับสิ่งที่รันได้
**ทำไม:** คนในทีมและ AI จะอ้างอิง `AGENTS.md`; ถ้าเอกสารบอกคำสั่งผิด ทุกคนจะ verify งานผิดตั้งแต่ต้น
**พูดตอน Demo:**

> “ผมไม่เพียงเขียนคำสั่ง test ไว้ใน AGENTS.md แต่สร้าง test ชั่วคราวและรัน `npm test` จนผ่าน 1 test เพื่อยืนยันว่าเอกสารใช้ได้จริง”

เมื่อคุณเปิดดูและยืนยันว่ามีบรรทัดนี้แล้ว บอกผมว่า “มีแล้ว” แล้วเราจะเริ่ม `WS-02--before` ข้อ 3: ร่าง Component Diagram ครับ

### 3. วาด Component Diagram

ตอนนี้เราจะวาด “ภาพรวมของระบบที่ตั้งใจจะสร้าง” ไม่ใช่บอกว่าโค้ดปัจจุบันมีทุก component แล้ว เพราะ baseline ตอนนี้ยังเป็น prototype เป็นหลัก
**ทำอะไร:** แสดงว่าใครใช้ระบบ, frontend คุยกับ backend อย่างไร, backend แยก business logic อะไร, และข้อมูลอยู่ที่ไหน
**ทำไม:** ก่อนเขียน User Story และ API เราต้องเห็นขอบเขตของระบบก่อน มิฉะนั้น AI อาจเสนอ endpoint หรือ database ที่ไม่เกี่ยวกับโจทย์

ไฟล์: `SPDX-Lab/AI-02/01_prepared-before-lab-2/component-diagram-draft.md`

1. เริ่มจาก component diagram เพื่อแยกความรับผิดชอบของระบบ
2. นักศึกษาและอาจารย์ใช้ Next.js web app ผ่าน HTTPS
3. frontend เรียก API ที่ตรวจสิทธิ์ก่อนส่งงานให้ Pair Assignment Service
4. frontend เรียก API ที่ตรวจสิทธิ์ก่อนส่งงานให้ Evaluation Service
5. เก็บข้อมูลใน PostgreSQL
6. จุดสำคัญคือ pairing กับ evaluation แยกกัน เพราะมีกฎธุรกิจคนละชุด

### 4. เตรียมคำถามสำหรับ Spec

เขียน 3 คำถามที่ **ยังตอบไม่ได้** เกี่ยวกับ requirement ของ project
แม้ PRD ของ PairEval จะละเอียดมาก แต่เรายังต้องระบุสิ่งที่ **API และ business rule ต้องการคำตอบเพิ่ม** ก่อนเขียน User Stories/Acceptance Criteria
ตัวอย่างคำถามจากโจทย์ (ตัวอย่างระบบจองห้อง): "นักศึกษาจองล่วงหน้าได้กี่วัน" "ยกเลิกได้ถึงเมื่อไหร่" "หนึ่งคนจองพร้อมกันได้กี่ห้อง"

ไฟล์: `SPDX-Lab/AI-02/01_prepared-before-lab-2/open-questions.md`

> คำถามพวกนี้คือช่องว่างที่ AI จะ "เดาแทน" ให้ถ้าเราไม่ตอบเอง — และมันมักเดาผิด
> **ทำอะไร:** จดช่องว่างที่ยังไม่ควรให้ AI เดาเอง
> **ทำไม:** คำถามเหล่านี้จะกลายเป็น decision ที่ต้องบันทึกใน `intent.md` และใช้เขียน Acceptance Criteria ให้ชัดใน Lab 02

## 🔗 ของที่ทำมา จะกลายเป็นอะไรในห้อง

งานทุกชิ้นในหน้านี้ถูกออกแบบให้เป็น **วัตถุดิบของ lab** ไม่ใช่แบบฝึกหัดที่ทำแล้วทิ้ง
คาบเรียนเริ่มจากสมมติฐานว่าของเหล่านี้พร้อมแล้ว

| ผลงานจาก homework | ถูกใช้ต่อที่ | ถ้ายังไม่มี |
| --- | --- | --- |
| testing framework ที่รันได้ + คำสั่ง test ใน `AGENTS.md` | เป็นเงื่อนไขใน Definition of Done ที่เขียนใน lab ขั้นตอนที่ 1 และใช้เต็มรูปแบบใน WS-03 | เขียน DoD ที่บังคับใช้ไม่ได้จริง |
| component diagram ฉบับร่าง | lab ขั้นตอนที่ 2 — ขัดเกลาเป็น diagram ที่เข้า repo | ใช้เวลา 20 นาทีของ lab ไปกับการเริ่มวาดใหม่ |
| รายการคำถามที่ spec ยังตอบไม่ได้ | lab ขั้นตอนที่ 1 — ใช้ปิดช่องว่างของ requirement ก่อนเขียน AC | เขียน backlog บนสมมติฐานที่ยังไม่มีใครยืนยัน |

> ถ้าทำไม่ทันข้อไหน ให้แจ้งใน 5 นาทีแรกของคาบ — จะได้จัดคู่ช่วยกันได้ทัน
> อย่าเงียบไว้แล้วไปติดกลาง lab เพราะจะกระทบทั้งกลุ่ม
