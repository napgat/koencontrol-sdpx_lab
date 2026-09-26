# Performance Report — SDPX Lab 07

## Setup และวิธีวัด

- วันที่ทดสอบ: 26 กันยายน 2026
- สภาพแวดล้อม: Next.js dev server บนเครื่องเดียว ใช้ข้อมูลทดสอบและ draft ที่เก็บใน memory
- Target: `http://127.0.0.1:3000/api/lab-07/*`
- สคริปต์: `performance/load-test.js`
- Load profile: เพิ่ม 0→5 VUs ใน 30 วินาที, คงเป้าหมาย 10 VUs นาน 1 นาที, ลดเป็น 0 ใน 30 วินาที
- Journey: ดูรายการ assignment → ดูรายละเอียดและคู่ประเมิน → บันทึก draft มี think time รวมประมาณ 4 วินาทีต่อรอบ
- วิธีเก็บผล: `k6 run --summary-export=performance/local-baseline.json performance/load-test.js`
- ไฟล์หลักฐาน: `performance/local-baseline.json`
- k6 exit code: `0`

## Hypothesis vs Actual

ไม่ได้บันทึกสมมติฐานก่อนรัน local รอบนี้ จึงไม่ระบุย้อนหลังว่าเดาถูกหรือผิด

**สมมติฐานก่อนวัด Preview staging:** `POST /api/lab-07/evaluation-drafts` น่าจะมี p95 สูงกว่า GET รายการและรายละเอียด เพราะต้องส่งคำสั่งเขียนไป Neon ผ่านเครือข่าย ขณะที่ข้อมูล assignment เป็นชุดตัวอย่างในแอป ต้องเทียบ p95 แยก endpoint และ log `duration_ms` หลังรันจริง; cold start และระยะห่างระหว่าง k6, Vercel และ Neon อาจทำให้ผลต่างกัน สมมติฐานนี้ยังไม่ได้รับการยืนยัน

## ผล local

| รายการ | ผลจริง |
|---|---:|
| Journeys ที่จบ | 168 |
| HTTP requests | 504 หรือ 4.17 requests/s |
| HTTP duration รวม p50 / p95 | 7.58 / 13.82 ms |
| HTTP failures | 0/504 (0%) |
| Journey errors | 0/168 (0%) |
| Checks | 1,008/1,008 ผ่าน |

| Endpoint | p50 | p95 | ผลคำขอ |
|---|---:|---:|---|
| GET รายการ assignment | 6.95 ms | 9.01 ms | 168 ครั้ง สถานะ 200 ทุกครั้ง |
| GET รายละเอียด assignment | ยังไม่ได้แยกวัด | ยังไม่ได้แยกวัด | 168 ครั้ง สถานะ 200 ทุกครั้ง |
| POST บันทึก draft | 7.22 ms | 9.16 ms | 168 ครั้ง สถานะ 201 ทุกครั้ง |

## Thresholds

ทุก threshold ในรอบ local ผ่าน: HTTP p95 `<500 ms`, list p95 `<300 ms`, draft p95 `<300 ms`, HTTP failure rate `<1%` และ journey error rate `<5%` โดย k6 คืน exit code `0`

### ทดสอบกรณี threshold ไม่ผ่าน

วันที่ 26 กันยายน 2026 ทดสอบกับ `http://127.0.0.1:3000` โดยทำสำเนา `performance/load-test.js` ไว้ในโฟลเดอร์ชั่วคราว และเปลี่ยนเฉพาะเกณฑ์ HTTP p95 จาก `<500 ms` เป็น `<1 ms` ใช้ load profile เดิม สูงสุด 10 VUs นาน 2 นาที ผลคือ 168 journeys, 504 HTTP requests, checks ผ่าน 1,008/1,008 และ HTTP failures 0/504 แต่ HTTP p95 เท่ากับ 13.17 ms ทำให้ threshold ไม่ผ่านและ k6 คืน exit code `99` จากนั้นลบสำเนาชั่วคราว โดยไฟล์สคริปต์ต้นฉบับยังใช้เกณฑ์เดิม

ผลนี้ยืนยันการทำงานของ pass/fail ใน k6 บน local เท่านั้น

## ผล CI บน GitHub Actions

CI เปิด Next.js development server บน GitHub runner แล้วรัน `performance/load-test.js` สูงสุด 10 VUs นาน 2 นาที ผลคือ 169 journeys, 507 HTTP requests, checks ผ่าน 1,014/1,014, HTTP failures 0/507 และ HTTP p95 รวม 9.27 ms ทุก threshold ผ่าน โดย job `performance` สำเร็จ

หลักฐาน: [CI run](https://github.com/napgat/koencontrol-sdpx_lab/actions/runs/36224640038) และ [ไฟล์ผล JSON](https://github.com/napgat/koencontrol-sdpx_lab/actions/runs/36224640038/artifacts/10900063741)

ผลนี้วัด development server ใน CI ไม่ใช่ staging ค่าสูงสุดของคำขอหนึ่งครั้งคือ 537.93 ms แม้ p95 ผ่าน และยังไม่ได้พิสูจน์กรณี job `performance` แดงบน GitHub

## Bottleneck และข้อจำกัด

ยังระบุ bottleneck ไม่ได้จากผลรอบนี้ แอปรันใน dev mode บนเครื่องเดียว ข้อมูล assignment เป็นชุดตัวอย่าง และ draft อยู่ใน memory จึงยังไม่ได้วัดการเขียนฐานข้อมูล, auth, เครือข่าย staging หรือหลาย instance ค่า latency ที่ต่ำนี้ไม่ใช่หลักฐานว่าระบบบน staging หรือ production จะเร็วเท่ากัน

สคริปต์ k6 ตรวจว่า POST ตอบ 201 พร้อม ID ส่วนการอ่าน draft กลับตรวจแยกด้วยคำขอ manual 3 รอบ ซึ่งได้ POST 201, GET 200 และ ID ตรงกันทุกครั้ง

## ขั้นต่อไป

1. เพิ่มการวัด p50/p95 แยกสำหรับ detail ในรอบ staging
2. เตรียม staging ที่แยกข้อมูลทดสอบจาก production และจำกัดสิทธิ์ write endpoint
3. รัน baseline บน staging แล้วบันทึก target, วันที่, load profile, ผล threshold และ exit code จริง
4. เก็บ structured logs ของคำขอที่ช้า ก่อนใช้ AI ช่วยวิเคราะห์สาเหตุ

## แผน Preview staging (ยังไม่วัด)

- ใช้เฉพาะ Preview branch `codex/lab-07-performance` ใน Vercel project เดิม ซึ่งมี Deployment Protection; คำขอจาก k6 ต้องส่ง automation bypass ผ่าน header ไม่ใส่ใน URL หรือไฟล์รายงาน
- วันที่ 26 กันยายน 2026 สร้าง Neon Free project `PairEval Lab07 Staging` (project ID `square-haze-26680706`) แยกจาก project `PairEval` เดิม ตรวจในหน้า Databases ว่ามี `lab07_preview` และรัน `performance/lab07-preview-schema.sql` ผ่าน SQL Editor ของฐานข้อมูลนี้; Neon แสดง 2 queries และ `Statement executed successfully` การสร้าง schema ยังไม่ใช่หลักฐานว่าแอปเชื่อมฐานข้อมูลได้
- ตั้ง `LAB07_DATABASE_URL` และ `LAB07_WRITE_TOKEN` เป็นตัวแปรลับเฉพาะ Preview branch นี้ โดย token สุ่มอย่างน้อย 32 ตัวอักษรและแยกจาก Vercel automation bypass secret; ห้ามใช้หรือแก้ `DATABASE_URL` เดิมที่ครอบคลุม Production/Preview
- หลังตั้งค่าและ deploy Preview ใหม่ ตรวจ health 200, GET assignment 200, POST ไม่มี write token ต้องได้ 401, POST ที่อนุญาตต้องได้ 201 และอ่าน draft กลับได้ 200 จากนั้นล้างด้วย `runId` เฉพาะรอบนั้น
- ก่อนทดสอบทุกครั้งตรวจ `BASE_URL`, โปรไฟล์ผู้ใช้จำลอง, ระยะเวลา และ `RUN_ID`; `performance/target.js` ยอมรับเฉพาะ local port 3000 หรือ Preview branch URL ที่กำหนด ไม่ยอมรับ Production
- วัด smoke ที่ 3 VUs / 30 วินาที แล้วจึงวัด journey สูงสุด 10 VUs / 2 นาทีบน Preview; export summary โดยแยกไฟล์จาก local baseline เก็บ exit code และเวลารันจริง แล้วใช้ `performance/cleanup.js` ลบเฉพาะ `RUN_ID` ที่วัด
- ตรวจจำนวนแถวคงเหลือของ `RUN_ID` ใน Neon หลัง cleanup และลบข้อมูลทดลองที่เหลือด้วยวิธีเดียวกัน; ห้ามนำข้อมูลจริงมาใช้ใน Lab นี้

ยังไม่มีตัวแปรลับบน Vercel, ผล smoke/journey บน Preview หรือหลักฐานว่า cleanup สำเร็จ จึงยังไม่สรุปว่า staging ผ่าน

## AI Analysis

รอผล staging และ structured logs ก่อน จึงยังไม่จัดอันดับสาเหตุหรือเสนอการแก้ performance
