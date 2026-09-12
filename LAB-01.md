# Lab 01 — Setup, First Deployment & Closing the Deploy Loop

## เป้าหมาย

Deploy หน้า landing page ของ **PairEval** ให้มี URL จริง และบันทึกเวลา
ตั้งแต่ commit จนผู้ใช้เปิดหน้าเว็บได้ (commit-to-live time)

## ขอบเขตของ Lab นี้

Lab 1 แสดงเพียง landing page และ prototype การเปรียบเทียบแบบ pairwise
ไม่ต้องสร้างระบบ login, database หรือระบบให้คะแนนจริงในรอบนี้

## ไฟล์ที่นำมาจากโปรเจกต์เดิม

| ไฟล์/โฟลเดอร์ | หน้าที่ใน Lab 1 |
| --- | --- |
| `src/app/page.tsx` | หน้า PairEval ที่จะเปิดให้ดูตอน Demo |
| `AGENTS.md` | คำสั่งและกติกาที่ AI agent ต้องทำตาม |
| `memory-bank/standards/tech-stack.md` | เหตุผลที่เลือก Next.js, TypeScript, Tailwind และ Vercel |
| `.gitignore` และ `.env.example` | ป้องกัน secret หลุด และบอกชื่อตัวแปรแวดล้อมที่ระบบต้องใช้ |
| `package.json` และ `package-lock.json` | ระบุ dependency และทำให้ติดตั้งเวอร์ชันเดิมซ้ำได้ |
| `vercel.json` | บอก Vercel ว่าโปรเจกต์นี้เป็น Next.js |

## คำสั่งตรวจสอบก่อน Deploy

```powershell
npm ci
npm run lint
npm run build
```

## หลักฐานที่ต้องเก็บ

- commit hash ที่ใช้ deploy
- เวลาเริ่ม push/commit
- URL ที่ deploy สำเร็จ
- เวลาเปิด URL ได้จริง
- commit-to-live time = เวลาที่เปิด URL ได้ − เวลาเริ่ม push/commit

## ประโยคสำหรับ Demo

“Lab นี้พิสูจน์ว่าเราไม่ได้แค่เขียนหน้าเว็บได้ แต่ปิด deploy loop ได้ครบ:
commit → build → deploy → live URL โดยมี AGENTS.md และ tech-stack.md เป็น context
ให้ทั้งคนและ AI ทำงานตามกติกาเดียวกัน”
