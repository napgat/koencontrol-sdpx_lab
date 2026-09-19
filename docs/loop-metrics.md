# Loop Metrics — Lab 06

| ตัวชี้วัด | ก่อน Full CI | หลัง Full CI |
|---|---|---|
| Unit test | local Compose: 8.97 วินาที; 5 ผ่าน; exit code 0 | CI test step: 1 วินาที; ทั้ง job `lint-and-unit-test`: 30 วินาที; 5 ผ่าน |
| E2E | local Compose: 3.39 นาที; 4 ผ่าน; exit code 0 | CI job `e2e-tests`: 2 นาที 15 วินาที; ขั้นรันใน container: 2 นาที 7 วินาที |
| Pipeline ทั้งอัน | ยังมีเพียง smoke workflow | 2 นาที 51 วินาที |
| Commit ถึง Vercel Ready | ประมาณ 52 วินาที สำหรับ commit 09417ae | ประมาณ 6 นาที 16 วินาที สำหรับ merge commit `f171dfe`; รวมเวลารอ human approval  |
| Deployment frequency | รอเก็บข้อมูล | 1 production deployment ในรอบ Lab 06; ยังไม่มีข้อมูลพอคำนวณเป็นครั้งต่อสัปดาห์  |

## วิธีวัดและข้อจำกัด

- เวลา unit และ E2E วัดตั้งแต่สั่ง Compose จนจบ รวมขั้นเตรียม container
- E2E รอบที่วัดมีขั้นติดตั้ง dependencies; ตัว Playwright แสดง 4 passed (2.9s)
- 52 วินาทีคำนวณจากเวลา commit 14:19:07 ถึง Vercel Ready ประมาณ 14:19:59 ไม่ใช่เวลาจับจริงตั้งแต่ push จนเปิดเว็บตรวจ
- Lab 01 เดิมบันทึกไว้ 1 นาที 0.89 วินาทีบน deployment คนละชุด
- เวลาหลัง Full CI มาจาก [GitHub Actions run #23](https://github.com/napgat/koencontrol-sdpx_lab/actions/runs/35436055580) ของ PR #12; เวลา local Compose และ CI ใช้สภาพแวดล้อมต่างกัน
- การวัดหลัง Full CI ใช้ [GitHub Actions run #25](https://github.com/napgat/koencontrol-sdpx_lab/actions/runs/35438294473): เริ่ม 17:46:06, E2E จบ 17:48:35, เริ่มทำงานหลังอนุมัติ 17:52:17 และ Vercel รายงาน Production สำเร็จ 17:52:22
- เวลา 6 นาที 16 วินาทีรวมเวลารอ human approval ประมาณ 3 นาที 42 วินาที จึงไม่ใช่เวลาประมวลผลของระบบเพียงอย่างเดียว

## Pipeline ช้าที่สุดตรงไหน

`e2e-tests` ใช้ 2 นาที 15 วินาที โดยขั้นรันใน container ใช้ 2 นาที 7 วินาที มากที่สุดใน pipeline รอบนี้

## จำนวน push ที่ใช้ debug pipeline

รอบนี้: 0 ครั้ง ณ เวลาที่บันทึก
