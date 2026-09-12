# Tech Stack

## Decision Summary

- ทีม: KoenControl
- Domain: PairEval — ระบบประเมินผลนักศึกษาแบบ Pairwise Comparison
- Date: 2026-07-21
- วิธีตัดสินใจ: Weighted Scoring เทียบตัวเลือกแต่ละ Layer ตาม PRD requirements

---

## Frontend

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui (built on Radix UI)

### Rationale

เราเปรียบเทียบ 4 ตัวเลือก โดยใช้เกณฑ์จาก PRD:

| เกณฑ์ | น้ำหนัก | เหตุผล |
|---|---|---|
| Pairwise UI (ฟอร์ม interactive) | 30% | หน้า Evaluation มี radio button จำนวนมาก ต้อง Save/Submit ได้ |
| Mobile Responsive | 20% | NFR ระบุต้องรองรับ mobile |
| เรียนรู้ง่าย | 25% | โปรเจกต์ course ทีมต้องเรียนรู้เร็ว |
| Deploy ง่าย | 25% | ต้อง deploy ให้เสร็จภายใน Lab |

| ตัวเลือก | UI (30%) | Mobile (20%) | เรียนรู้ (25%) | Deploy (25%) | รวม |
|---|---|---|---|---|---|
| **Next.js** | 0.90 | 0.60 | 0.50 | 0.75 | **2.75** |
| Vite + React | 0.90 | 0.60 | 0.75 | 0.50 | 2.75 |
| Nuxt (Vue) | 0.90 | 0.60 | 0.50 | 0.75 | 2.75 |
| SvelteKit | 0.90 | 0.60 | 0.50 | 0.75 | 2.75 |

**ทำไมเลือก Next.js ทั้งที่คะแนนเท่ากัน:**
1. Next.js มี Backend ในตัว (API Routes) — ไม่ต้อง deploy แยก 2 ที่
2. React ecosystem ใหญ่ที่สุด — หาคำตอบ Stack Overflow ได้เร็ว
3. Vercel (platform ของทีม Next.js   ) deploy กดปุ่มเดียว + preview URL ทุก PR
4. shadcn/ui ใช้ Radix UI ทำให้ Radio Button accessible บน mobile ตรงกับ NFR

**ทำไมใช้ TypeScript:**
- PairEval มี Data Model ซับซ้อน (6+ entities เชื่อมกัน)
- TypeScript ตรวจจับ Bug ตั้งแต่ตอนเขียน ไม่ต้องรอรัน runtime แล้วพัง
- เหมาะกับการทำงานทีม 4 คน ลดโอกาส type ผิดข้าม component

**ทำไมใช้ Tailwind CSS:**
- ทีม 4 คน เขียน CSS แยกกัน → มีโอกาส class ชนกัน
- Tailwind style ผ่าน class ใน HTML ตรงๆ ไม่มีไฟล์ CSS ให้ conflict

---

## Backend

- Framework: Next.js API Routes (Route Handlers)
- Language: TypeScript
- Auth: NextAuth.js v5 (Auth.js) — Google OAuth 2.0 Provider

### Rationale

| เกณฑ์ | น้ำหนัก | เหตุผล |
|---|---|---|
| Google OAuth | 25% | FR-AUTH-01 กำหนด Google Login เท่านั้น |
| Pairing Algorithm | 25% | หัวใจระบบ ต้องเขียน algorithm สุ่มคู่ + coverage |
| Database/ORM support | 25% | Data Model มี 6+ ตาราง relations ซับซ้อน |
| Deploy ง่าย | 25% | ต้อง deploy ให้เสร็จภายใน Lab |

| ตัวเลือก | OAuth (25%) | Algorithm (25%) | DB/ORM (25%) | Deploy (25%) | รวม |
|---|---|---|---|---|---|
| **Next.js API Routes** | 0.75 | 0.50 | 0.75 | 0.75 | **2.75** |
| FastAPI (Python) | 0.50 | 0.75 | 0.75 | 0.50 | 2.50 |
| Express.js | 0.50 | 0.50 | 0.75 | 0.50 | 2.25 |
| Flask | 0.50 | 0.75 | 0.50 | 0.50 | 2.25 |

**ทำไมเลือก Next.js API Routes:**
1. Deploy รวม FE ที่เดียวบน Vercel — ไม่ต้องจัดการ 2 server
2. NextAuth.js มี Google Provider built-in — ตั้งค่า OAuth ได้ภายใน 30 นาที (ตรงกับ FR-AUTH-01)
3. ใช้ TypeScript เดียวกับ Frontend — ทีมเรียนรู้ภาษาเดียว ไม่ต้องสลับ

**ข้อด้อยที่ยอมรับ:**
- Pairing Algorithm เขียนด้วย JS อาจไม่สะดวกเท่า Python
- แก้ปัญหาโดย: แยก algorithm เป็น pure function ที่ test ได้ง่าย

---

## Database

- Database: PostgreSQL (Serverless via Neon.tech)
- ORM: Prisma
- Free tier: 0.5 GB (เพียงพอสำหรับ course project)

### Rationale

| เกณฑ์ | น้ำหนัก | เหตุผล |
|---|---|---|
| รองรับ Relations ซับซ้อน | 30% | 6+ ตาราง Classroom→Group→User→PairAssignment→EvaluationResponse→ComputedScore |
| ตั้งค่าง่าย / Free tier | 25% | โปรเจกต์ course ไม่มีงบ |
| Data Integrity | 25% | คะแนนนักศึกษาผิดพลาดไม่ได้ |
| ใช้กับ Next.js ง่าย | 20% | ลด setup time ให้ทีม |

| ตัวเลือก | Relations (30%) | ง่าย/ฟรี (25%) | Integrity (25%) | Next.js (20%) | รวม |
|---|---|---|---|---|---|
| **PostgreSQL (Neon)** | 0.90 | 0.75 | 0.75 | 0.60 | **3.00** |
| Supabase | 0.90 | 0.75 | 0.75 | 0.60 | 3.00 |
| SQLite | 0.90 | 0.75 | 0.50 | 0.40 | 2.55 |
| MongoDB | 0.30 | 0.50 | 0.25 | 0.40 | 1.45 |

**ทำไมเลือก PostgreSQL (Neon) ไม่ใช่ตัวอื่น:**
1. **ไม่เลือก MongoDB** — PairEval มี relations ซับซ้อน (6+ ตาราง FK เชื่อมกัน) MongoDB ไม่มี foreign key ต้อง join ด้วยโค้ดเอง ซับซ้อนเกินไป
2. **ไม่เลือก SQLite** — Deploy บน Vercel (serverless) ไฟล์ DB จะหายทุกครั้งที่ function restart
3. **เลือก Neon แทน Supabase** — Neon เบากว่า ใช้ Prisma ORM จัดการ schema ได้ type-safe ตรงกับ TypeScript stack ส่วน Supabase เหมาะกว่าถ้าต้องการ Auth ในตัว (แต่เราใช้ NextAuth.js แล้ว)

**ทำไมใช้ Prisma:**
- Type-safe query — เขียน TypeScript แล้ว autocomplete ชื่อ column ให้อัตโนมัติ
- Migration ง่าย — รัน `prisma migrate dev` แล้วจัดการ schema change ให้เอง
- สร้าง Entity Relationship ได้ตรงกับ Data Model ใน PRD Section 5

---

## Deployment

- Platform: Vercel
- Database Host: Neon.tech (Serverless PostgreSQL)
- Staging URL: https://sdpx-lab-ai-01-koencontrol.vercel.app/
- Commit-to-live time: 1 นาที 0.89 วินาที (วัดเมื่อ WS-01 จาก push บน branch `develop` จน URL หลักแสดง headline ใหม่)

### Rationale

| เกณฑ์ | น้ำหนัก | เหตุผล |
|---|---|---|
| Free tier เพียงพอ | 25% | โปรเจกต์ course ไม่มีงบ |
| Deploy ง่าย/เร็ว | 30% | Lab กำหนดให้ deploy เสร็จภายใน 25 นาที |
| รองรับ Next.js | 25% | Stack ที่เลือกเป็น Next.js |
| Uptime / เสถียร | 20% | NFR ระบุ 99.5% uptime ช่วงก่อน Deadline |

| ตัวเลือก | ฟรี (25%) | ง่าย (30%) | รองรับ (25%) | Uptime (20%) | รวม |
|---|---|---|---|---|---|
| **Vercel** | 0.75 | 0.90 | 0.75 | 0.60 | **3.00** |
| Netlify | 0.75 | 0.60 | 0.50 | 0.60 | 2.45 |
| Railway | 0.50 | 0.60 | 0.75 | 0.60 | 2.45 |
| Render | 0.75 | 0.60 | 0.50 | 0.40 | 2.25 |

**ทำไมเลือก Vercel:**
1. ทีม Next.js สร้าง Vercel ขึ้นมา — compatibility 100% ไม่ต้อง config อะไรเลย
2. เชื่อม GitHub → ทุก Push ได้ preview URL อัตโนมัติ ช่วยทีมทดสอบ feature ก่อน merge
3. Free tier ฟรีไม่จำกัดโปรเจกต์ + SLA 99.99% รองรับ NFR ได้สบาย
4. ไม่ sleep เหมือน Render free tier (Render หยุดหลัง 15 นาที ครั้งแรกโหลดช้า ~30 วินาที)

---

## AI Tools

- Code generation: GitHub Copilot / Claude
- Review policy: ทุก AI-generated code ต้องอ่านและอธิบายได้ก่อน commit
- กฎทอง: "ถ้า oral defense ถามแล้วตอบไม่ได้ว่า code ทำอะไร — นั่นคือ code ที่ไม่ควร commit"

---

## สรุป Full Stack Architecture

```
[Student / Instructor Browser]
        |
   Google OAuth (NextAuth.js)
        |
  [Next.js on Vercel]
   /           \
[React UI]   [API Routes]
   |              |
[shadcn/ui]   [Prisma ORM]
[Tailwind]        |
             [PostgreSQL]
             [Neon.tech]
```

| Layer | Technology | คะแนน Weighted |
|---|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind | 2.75 / 3.00 |
| Backend | Next.js API Routes + NextAuth.js | 2.75 / 3.00 |
| Database | PostgreSQL (Neon) + Prisma | 3.00 / 3.00 |
| Deployment | Vercel | 3.00 / 3.00 |
