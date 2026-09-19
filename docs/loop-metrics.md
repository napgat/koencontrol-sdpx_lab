# Loop Metrics — Lab 06

| ตัวชี้วัด | ก่อน Full CI | หลัง Full CI |
|---|---|---|
| Unit test ใน local Compose | 8.97 วินาที; 5 ผ่าน; exit code 0 | รอวัด |
| E2E ใน local Compose | 3.39 นาที; 4 ผ่าน; exit code 0 | รอวัด |
| Pipeline ทั้งอัน | ยังมีเพียง smoke workflow | รอวัด |
| Commit ถึง Vercel Ready | ประมาณ 52 วินาที สำหรับ commit 09417ae | รอวัดหลัง merge |
| Deployment frequency | รอเก็บข้อมูล | รอเก็บข้อมูล |

## วิธีวัดและข้อจำกัด

- เวลา unit และ E2E วัดตั้งแต่สั่ง Compose จนจบ รวมขั้นเตรียม container
- E2E รอบที่วัดมีขั้นติดตั้ง dependencies; ตัว Playwright แสดง 4 passed (2.9s)
- 52 วินาทีคำนวณจากเวลา commit 14:19:07 ถึง Vercel Ready ประมาณ 14:19:59 ไม่ใช่เวลาจับจริงตั้งแต่ push จนเปิดเว็บตรวจ
- Lab 01 เดิมบันทึกไว้ 1 นาที 0.89 วินาทีบน deployment คนละชุด

## Pipeline ช้าที่สุดตรงไหน

รอผล CI run แรก

## จำนวน push ที่ใช้ debug pipeline

รอบนี้: 0 ครั้ง ณ เวลาที่บันทึก