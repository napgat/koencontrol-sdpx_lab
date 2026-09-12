# Lab Instruction — Lab 01: Setup, First Deployment & Closing the Deploy Loop

เอกสารขั้นตอนปฏิบัติในคาบ ส่วนงานเตรียมตัวก่อนเรียนอยู่ใน [Prepared](01_prepared-before-lab.md)

## เป้าหมาย

- ทุกคนมี dev environment ที่ทำงานได้
- **ปิด Deploy Loop ให้ครบ**: commit → build → deploy → เห็น URL จริง และวัดเวลาได้
- สร้าง `AGENTS.md` และ `memory-bank/standards/tech-stack.md` — context ชุดแรกของ project

## 🎯 ทำ lab นี้แล้วได้ทักษะอะไร

| สิ่งที่จะทำได้                                                 | ใช้ในงานจริงอย่างไร                                                                      |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ปิด deploy loop ได้ครบวง และวัด commit-to-live time เป็นตัวเลข | lead time คือหนึ่งใน 4 ตัวชี้วัดที่ทีมซอฟต์แวร์ทั่วโลกใช้วัดตัวเอง (DORA)                |
| ตั้ง auto-deploy จาก branch ได้                                | งาน deploy ที่ยังต้องกดปุ่มเองคือจุดที่เกิดความผิดพลาดของมนุษย์มากที่สุด                 |
| เขียน `AGENTS.md` และ `tech-stack.md` ที่ทั้งคนและ AI ใช้ได้   | เอกสารที่เขียนให้เครื่องอ่าน มักกลายเป็นเอกสารที่คนใหม่ในทีมอ่านแล้วเข้าใจเร็วที่สุดด้วย |
| ตั้ง `.gitignore` และ `.env.example` ให้ถูกตั้งแต่ commit แรก  | ป้องกันปัญหา secret หลุดซึ่งเป็นเรื่องที่แก้ย้อนหลังไม่ได้                               |

---

## ขั้นตอนที่ 1 — เลือก Domain และ Stack

### เลือก Domain

ทุกกลุ่มเลือกงานจาก `project-ideas/`

Domain ที่เลือก: **Pairwise Evaluation**

### เลือก Stack

- **Next.js 16** — framework หลัก แบบ App Router
- **React 19** — สร้าง UI
- **TypeScript** — ทำให้โค้ดมี type ตรวจจับข้อผิดพลาดได้
- **Tailwind CSS 4** — จัด style หน้าเว็บ
- **Lucide React** — icon ต่าง ๆ
- **Vercel** — build และ deploy เว็บ
- **Node.js + npm** — จัดการ dependency และรันคำสั่ง

---

## ขั้นตอนที่ 2 — สร้าง Repository

```bash
# สมาชิกคนที่ 1: สร้าง repo บน GitHub
# ชื่อ: sdpx-lab-ai-01-koencontrol
# Visibility: Public, เพิ่ม README + .gitignore

# ทุกคน: clone และ setup
git clone https://github.com/napgat/sdpx-lab-ai-01-koencontrol.git
cd sdpx-lab-ai-01-koencontrol

# สร้าง develop branch
git switch -c develop
git push -u origin develop
```

### สร้าง structure สำหรับ context

```bash
mkdir -p memory-bank/standards
mkdir -p memory-bank/units
```

---

## ขั้นตอนที่ 3 — เขียน Context ให้ AI

### 3.1 `AGENTS.md` ที่ root ของ repo

ไฟล์นี้คือสิ่งที่ AI agent อ่านทุกครั้งที่เปิด repo — เขียนให้เครื่องอ่าน

ตัวอย่างเนื้อหา `AGENTS.md`:

> หมายเหตุประกอบเอกสาร: ตัวอย่างด้านล่างระบุ Next.js 14 แต่ Stack ในขั้นตอนที่ 1 ระบุ Next.js 16 โดยคงข้อความเดิมทั้งสองจุดไว้

```markdown
## Project
PairEval — ระบบประเมินผลนักศึกษาแบบ Pairwise Comparison สำหรับการให้คะแนนแบบอิงกลุ่ม/เดี่ยว

## Setup & Commands
- install: `npm install`
- dev:     `npm run dev`
- test:    `npm run test`
- lint:    `npm run lint`
- build:   `npm run build`

## Conventions
- ภาษา: TypeScript (Next.js 14 App Router)
- ใช้ `data-testid` กับ element ที่ test จะอ้างถึง
- Commit ตาม Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`)
- Branch: ทำงานบน `feature/*` แล้ว PR เข้า `develop`

## Rules for agents
- ต้องรัน test ให้เขียวก่อนเสนอ diff เสมอ
- ถ้า test แดง ให้แก้ code — ห้ามแก้หรือลบ test เพื่อให้ผ่าน
- ห้ามใส่ค่า secret ลงไฟล์ใด ๆ ใช้ env var เท่านั้น
- ห้ามแก้ `docs/adr/` และ `memory-bank/` โดยไม่ถามก่อน
- แก้ทีละเรื่อง — diff ที่เกิน ~200 บรรทัดให้หยุดถามก่อน
```

### 3.2 `memory-bank/standards/tech-stack.md`

ตัวอย่างเนื้อหา Tech Stack:

> หมายเหตุประกอบเอกสาร: ตัวอย่างนี้ยังระบุว่าไม่ได้วัดเวลา ส่วนผลที่บันทึกแล้วอยู่ในขั้นตอนที่ 5

```markdown
# Tech Stack

## Decision Summary

ทีม: KoenControl
Domain: PairEval — ระบบประเมินผลงานนักศึกษาแบบเปรียบเทียบเป็นคู่
Date: 2026-09-05

## Frontend

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4
- Rationale: ใช้ Next.js เพราะสร้างทั้งหน้าเว็บและ API ในโปรเจกต์เดียว, deploy บน Vercel ได้ง่าย และ TypeScript ช่วยตรวจจับข้อผิดพลาดก่อนรันจริง ส่วน Tailwind CSS ทำให้จัดหน้าเว็บ responsive ได้รวดเร็ว

## Backend

- Framework: Next.js Route Handlers
- Language: TypeScript
- Rationale: Lab 1 ยังเป็น landing page และ prototype จึงใช้ Next.js เป็น full-stack framework เพื่อไม่ต้องแยก backend เป็นอีก service หนึ่ง โดยมี Route Handlers รองรับการเพิ่ม API ใน Lab ถัดไป

## Database

- TBD
- Rationale: Lab 1 ยังไม่มีการบันทึกข้อมูลจริง จึงยังไม่ต้องใช้ฐานข้อมูล เมื่อต้องเก็บข้อมูลผู้ใช้ การประเมิน และคะแนน จะพิจารณา PostgreSQL

## Deployment

- Platform: Vercel
- Staging URL: https://sdpx-lab-ai-01-koencontrol.vercel.app/
- Commit-to-live time: ยังไม่ได้วัดแบบจับเวลา; รอบถัดไปจะบันทึกเวลาตอน push และเวลาที่ Vercel ขึ้นสถานะ Ready

## AI Tools

- Agent ที่ใช้: Codex
- Review policy: ทุก AI-generated code ต้องอ่าน ทำความเข้าใจ และรัน lint/build ให้ผ่านก่อน commit
```

> **Context Engineering Note:** `AGENTS.md` = กติกาและคำสั่ง (เครื่องอ่าน)
> `memory-bank/` = เหตุผลและการตัดสินใจ (คนกับ AI อ่านร่วมกัน)
> แยกกันเพราะสองอย่างนี้เปลี่ยนคนละจังหวะ

---

## ขั้นตอนที่ 4 — Scaffold และ Deploy

### Scaffold ด้วย AI

ตัวอย่าง prompt:

```text
Read AGENTS.md and memory-bank/standards/tech-stack.md first.

I am building a Pairwise Evaluation system for a university.
Create a simple landing page that shows the service name,
a navigation bar, and a placeholder for the main feature.
Add data-testid to the nav and the main CTA.
Keep it clean and simple — no extra dependencies.
```

**ก่อน commit:** ทุกคนอ่าน code ที่ AI generate และอธิบายให้เพื่อนฟังได้
ถ้ามีบรรทัดที่ไม่มีใครอธิบายได้ — ลบทิ้งหรือถาม AI ให้อธิบายจนเข้าใจ

### Deploy

**Vercel (Next.js):** vercel.com → Add New Project → Import repo → Deploy

เหตุผลที่เลือก Vercel สำหรับ `koencontrol-lab`: โปรเจกต์ใช้ **Next.js 16** และ Vercel ออกแบบมารองรับ Next.js โดยตรง สามารถ deploy แบบ zero-config และเชื่อม Git เพื่อสร้าง deployment/preview ได้ง่าย

ตั้งให้ deploy อัตโนมัติเมื่อ push เข้า `develop` — ถ้าต้องกดปุ่มเอง loop ยังไม่ปิด

---

## ขั้นตอนที่ 5 — วัด Deploy Loop (5 นาที)

ทดลองแก้ของเล็ก ๆ แล้วจับเวลา:

```bash
# แก้ข้อความบนหน้าแรก 1 บรรทัด
git add -A
git commit -m "feat: update landing headline"
git push               # ← เริ่มจับเวลาตรงนี้
# refresh URL จนกว่าจะเห็นข้อความใหม่   ← หยุดจับเวลาตรงนี้
```

บันทึกลงใน `memory-bank/standards/tech-stack.md`:

```markdown
## Deployment

- Staging URL: [URL ที่ได้จาก Vercel/Render]
- Commit-to-live time: X นาที Y วินาที (วัดเมื่อ WS-01)
```

### ผลที่บันทึก

```markdown
- Staging URL: https://sdpx-lab-ai-01-koencontrol.vercel.app/
- Commit-to-live time: 1 นาที 0.89 วินาที
```

### คุยกันในกลุ่ม 2 นาที

**ตอนนี้ loop เรามีขั้น Verify อะไรบ้าง**

คำตอบที่บันทึก:

- ก่อน push เรารัน `lint` และ `build`
- `lint` ตรวจข้อผิดพลาดเชิงโค้ด เช่น import ที่ไม่ได้ใช้ หรือรูปแบบ TypeScript ที่เสี่ยงมีปัญหา
- หลัง deploy ดู Vercel ว่า `Ready` แล้ว refresh URL ดูข้อความใหม่

**ถ้า deploy ตัวนี้พัง เราจะรู้ตอนไหน**

คำตอบที่บันทึก:

- Vercel จะขึ้น `Failed` และมี Build Logs
- URL หลักจะยังแสดงเวอร์ชันเก่า

**สัปดาห์หน้าเราจะเริ่มเติมด่านตรวจอัตโนมัติเข้าไปใน loop นี้**

คำตอบที่บันทึก: เพิ่ม automated gate ก่อน merge/deploy เช่น unit test, E2E test และ CI ที่รัน lint + build + test อัตโนมัติ เพื่อไม่ต้องพึ่งการตรวจด้วยตาอย่างเดียว

---

## สร้าง `.gitignore` ที่ครอบคลุม

```text
.env
.env.*
!.env.example
node_modules/
__pycache__/
.venv/
.next/
dist/
coverage/
playwright-report/
test-results/
*.log
.DS_Store
```

เพิ่ม `.env.example` ที่มีแต่ชื่อ key ไม่มีค่า — เพื่อให้คนอื่น (และ AI) รู้ว่าต้องตั้ง env อะไรบ้าง

---

## Artifacts ที่ต้องส่ง

| Artifact                              | รายละเอียด                           | ที่ส่ง          |
| ------------------------------------- | ------------------------------------ | --------------- |
| GitHub Repository URL                 | Public repo                          | ส่ง link ใน LMS |
| Live URL                              | App ที่ deploy แล้ว                  | ส่ง link ใน LMS |
| `AGENTS.md`                           | ครบทุก section รวม Rules for agents  | ใน repo         |
| `memory-bank/standards/tech-stack.md` | ครบทุก section + commit-to-live time | ใน repo         |
| `.env.example`                        | ชื่อ key อย่างเดียว ไม่มีค่า         | ใน repo         |

### เกณฑ์ผ่าน (ตรวจกันเองในกลุ่ม)

- [x] Live URL เปิดได้จาก browser ของทุกคน
- [x] ทุกคน clone และ run local ได้เอง
- [x] push เข้า `develop` แล้ว deploy เองอัตโนมัติ (ไม่ต้องกดปุ่ม)
- [x] จด commit-to-live time ไว้แล้ว
- [x] `AGENTS.md` มีข้อ "ห้ามแก้ test เพื่อให้ผ่าน"
- [x] ไม่มี `.env` หรือ secrets ใน repo
