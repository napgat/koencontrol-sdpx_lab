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

### ตรวจ CI อีกครั้งหลังเพิ่ม Preview staging

วันที่ 26 กันยายน 2026 ที่ commit `aafe7ac` งาน `lint-and-unit-test`, `e2e-tests` และ `performance` ผ่าน; `production-approval` ข้ามตามเงื่อนไขของ PR. งาน performance ยังรันกับ development server ใน GitHub runner ไม่ได้ยิง Vercel Preview: 168 journeys, 504 requests (4.145 requests/s), checks 1,008/1,008, HTTP failures 0/504, journey errors 0/168, HTTP p95 11.13 ms, detail p95 12.03 ms, list p95 6.35 ms และ draft p95 7.83 ms. คำขอที่นานสุด 590.65 ms; ยังระบุสาเหตุไม่ได้จาก summary นี้

หลักฐาน: [CI run](https://github.com/napgat/koencontrol-sdpx_lab/actions/runs/36232527865) และ [k6 results artifact](https://github.com/napgat/koencontrol-sdpx_lab/actions/runs/36232527865/artifacts/10902991946)

## ตรวจซ้ำบน local หลังเพิ่ม Preview guard

วันที่ 26 กันยายน 2026 ประมาณ 16:03–16:06 น. เวลาไทย รัน Next.js 16.3.6 development server ที่ `127.0.0.1:3000` พร้อม `LAB07_TEST_MODE=true` จากนั้นรัน `k6 run performance/smoke.js` (3 VUs / 30 วินาที) และ `k6 run performance/load-test.js` (สูงสุด 10 VUs / 2 นาที, `RUN_ID=local-recheck-20260926160414`) ตรวจ target และโปรไฟล์ก่อนรัน ทั้งสองคำสั่งคืน exit code `0`

| รอบ | Requests | HTTP p95 | HTTP failures | ผลเพิ่ม |
|---|---:|---:|---:|---|
| Smoke health | 90 | 13.46 ms | 0/90 | checks 180/180 ผ่าน |
| Journey | 504 | 15.95 ms | 0/504 | 168 journeys, checks 1,008/1,008, detail p95 17.17 ms, list p95 8.16 ms, draft p95 8.27 ms, journey errors 0/168 |

เป็นการตรวจสคริปต์หลังแก้ ไม่ใช่ staging baseline; รอบนี้เก็บผลจาก output ของ k6 ในแชท ไม่มี summary JSON แยก และมีคำขอ detail สูงสุด 711.57 ms ซึ่งอาจรวมการ compile ของ dev server ยังสรุปสาเหตุไม่ได้

ตรวจสิทธิ์ Preview แบบไม่เชื่อมฐานข้อมูลจริงด้วย production build บน local port 3001 และค่า environment ปลอมที่มีรูปแบบถูกต้อง: GET list/detail ได้ 200; POST draft และ POST cleanup ที่ไม่ส่ง write token ได้ 401 ทั้งคู่ การทดสอบนี้พิสูจน์เฉพาะการปฏิเสธคำขอ ไม่มีการเขียนหรืออ่าน Neon จริง

## Bottleneck และข้อจำกัด

ยังระบุ bottleneck ไม่ได้จากผลรอบนี้ แอปรันใน dev mode บนเครื่องเดียว ข้อมูล assignment เป็นชุดตัวอย่าง และ draft อยู่ใน memory จึงยังไม่ได้วัดการเขียนฐานข้อมูล, auth, เครือข่าย staging หรือหลาย instance ค่า latency ที่ต่ำนี้ไม่ใช่หลักฐานว่าระบบบน staging หรือ production จะเร็วเท่ากัน

สคริปต์ k6 ตรวจว่า POST ตอบ 201 พร้อม ID ส่วนการอ่าน draft กลับตรวจแยกด้วยคำขอ manual 3 รอบ ซึ่งได้ POST 201, GET 200 และ ID ตรงกันทุกครั้ง

## การเตรียม Preview staging

- ใช้เฉพาะ Preview branch `codex/lab-07-performance` ใน Vercel project เดิม ซึ่งมี Deployment Protection; คำขอจาก k6 ต้องส่ง automation bypass ผ่าน header ไม่ใส่ใน URL หรือไฟล์รายงาน
- ตรวจ Vercel แบบอ่านอย่างเดียวก่อนตั้งค่า: `Require Log In` เปิดด้วย `Standard Protection`, system environment variables เปิดอยู่, `DATABASE_URL` เดิมใช้ทั้ง Production และ Preview และตอนนั้นยังไม่มี automation bypass secret
- วันที่ 26 กันยายน 2026 สร้าง Neon Free project `PairEval Lab07 Staging` (project ID `square-haze-26680706`) แยกจาก project `PairEval` เดิม ตรวจในหน้า Databases ว่ามี `lab07_preview` และรัน `performance/lab07-preview-schema.sql` ผ่าน SQL Editor ของฐานข้อมูลนี้; Neon แสดง 2 queries และ `Statement executed successfully` การสร้าง schema ยังไม่ใช่หลักฐานว่าแอปเชื่อมฐานข้อมูลได้
- วันที่ 26 กันยายน 2026 ตรวจหน้า Vercel แล้วว่า `LAB07_DATABASE_URL` และ `LAB07_WRITE_TOKEN` เป็น Secret ที่จำกัดเฉพาะ Preview branch `codex/lab-07-performance`; ก่อนแก้ `LAB07_DATABASE_URL` เคยถูกเลือกเป็น Production และต่อมาเป็น Preview ทุก branch จึงแก้ขอบเขตให้ตรง branch โดยยังไม่ redeploy หรือทดสอบการเชื่อมต่อ ค่าลับไม่อยู่ในรายงาน
- token สำหรับ write สุ่มอย่างน้อย 32 ตัวอักษรและแยกจาก Vercel automation bypass secret; ไม่ใช้หรือแก้ `DATABASE_URL` เดิมที่ครอบคลุม Production/Preview วันที่ 26 กันยายน 2026 ตรวจหน้า Deployment Protection ว่ามี automation bypass secret เพิ่มแล้ว และ `Require Log In` ยังเปิดอยู่; secret นี้มีขอบเขตทั้ง Vercel project ไม่ใช่เฉพาะ branch ค่าจริงไม่ถูกบันทึก
- หลังได้รับอนุญาต redeploy เฉพาะ Preview จาก commit `aafe7ac` ด้วย Project Settings ล่าสุด; [Vercel deployment](https://vercel.com/npaha/koencontrol-sdpx-lab/HBFVgGqwsGNxJs9SPeDsLkeejxBM) แสดง `Ready`, environment `Preview` และ branch `codex/lab-07-performance` การ Ready ยังไม่ยืนยันว่า health endpoint หรือฐานข้อมูลตอบได้จริง
- หลังหมุนเวียน automation bypass secret (ไม่เก็บค่าไว้ในเอกสาร) ตรวจด้วย PowerShell `Invoke-WebRequest` ไปยัง branch URL เดียวกันที่ `/api/health` โดยส่ง bypass ผ่าน HTTP header `x-vercel-protection-bypass` และตั้ง `-MaximumRedirection 0`: ได้ HTTP `200` และ JSON `status: ok` ผลนี้พิสูจน์ว่า health ผ่าน Vercel Authentication บน Preview ที่ redeploy แล้ว แต่ยังไม่พิสูจน์ business API หรือ Neon
- ตรวจ business API แบบอ่านอย่างเดียวผ่าน branch URL และ bypass header: `GET /api/lab-07/assignments` ได้ `200` มี 1 assignment; `GET /api/lab-07/assignments/[id]` ได้ `200` มี 3 pairs; `POST /api/lab-07/evaluation-drafts` ที่ไม่ส่ง write token ได้ `401` แม้ส่ง bypass header แล้ว ยังไม่ได้ทดสอบการเขียน Neon
- การตรวจ manual write รอบ `manual-20260926212619` หยุดก่อนมี HTTP response เพราะ PowerShell session ไม่มี `LAB07_WRITE_TOKEN`; จึงไม่นับว่า POST หรือ cleanup ผ่าน ตรวจใน Neon SQL Editor ของ database `lab07_preview` ด้วย `SELECT COUNT(*) ... WHERE run_id = 'manual-20260926212619'` ได้ `remaining = 0` ไม่พบข้อมูลค้างจากรอบนั้น
- หลังเปลี่ยน `LAB07_WRITE_TOKEN` เฉพาะ Preview branch และ redeploy อีกครั้ง [deployment ใหม่](https://vercel.com/npaha/koencontrol-sdpx-lab/3bKQu6xtJrZ63MmFnWEuPn8uxxk4) แสดง `Ready`, environment `Preview`, branch `codex/lab-07-performance`, commit `aafe7ac` ทดสอบผ่าน branch URL ด้วย PowerShell และ token ที่ส่งเฉพาะใน HTTP header โดยใช้ `runId=manual-20260926215155`: POST draft ได้ `201`, GET ตาม ID ได้ `200` และ ID ตรงกัน, POST cleanup ตาม runId ได้ `200` พร้อม `deletedCount=1` ผลนี้ยืนยันการเขียน อ่าน และล้างข้อมูลทดลองหนึ่งรายการบน Preview; การตรวจฐานข้อมูลภายหลังพบจำนวนแถวรวมเป็น 0
- ก่อนทดสอบทุกครั้งตรวจ `BASE_URL`, โปรไฟล์ผู้ใช้จำลอง, ระยะเวลา และ `RUN_ID`; `performance/target.js` ยอมรับเฉพาะ local port 3000 หรือ Preview branch URL ที่กำหนด ไม่ยอมรับ Production
- วัด smoke ที่ 3 VUs / 30 วินาที แล้วจึงวัด journey สูงสุด 10 VUs / 2 นาทีบน Preview; export summary โดยแยกไฟล์จาก local baseline เก็บ exit code และเวลารันจริง แล้วใช้ `performance/cleanup.js` ลบเฉพาะ `RUN_ID` ที่วัด
- ตรวจจำนวนแถวคงเหลือของ `RUN_ID` ใน Neon หลัง cleanup และลบข้อมูลทดลองที่เหลือด้วยวิธีเดียวกัน; ห้ามนำข้อมูลจริงมาใช้ใน Lab นี้

### ผล health smoke บน Preview

วันที่ 26 กันยายน 2026 เวลาไทยประมาณ 21:52–21:53 น. รัน `performance/smoke.js` จากเครื่องผู้ทดสอบไปยัง Preview branch URL ที่ระบุข้างต้น โดยส่ง Vercel automation bypass ใน HTTP header, 3 VUs นาน 30 วินาที (`gracefulStop` สูงสุดอีก 30 วินาที), export ไปที่ `performance/preview-smoke-20260926215259.json` ผลจริง: 69 requests, checks 138/138 ผ่าน, health ตอบ 200 และ `status: ok` ทุกครั้ง, HTTP failures 0/69 แต่ HTTP duration p95 = 579.74 ms สูงกว่า threshold `<500 ms` จึง **ไม่ผ่าน** และ k6 คืน exit code `99` ค่า median = 297.31 ms, max = 666.81 ms. ในไฟล์ summary ค่า `http_req_waiting` p95 = 578.80 ms ขณะที่ connection และ TLS p95 เป็น 0 ms จึงเห็นว่าเวลาส่วนใหญ่ของคำขออยู่ระหว่างรอการตอบกลับ ไม่พอจะระบุว่าเกิดจาก Vercel, เครือข่าย หรือการประมวลผลของแอป ต้องตรวจ logs/วัดเพิ่ม; health endpoint เพียงคืน JSON ไม่มีการอ่าน Neon

### ผล business journey บน Preview

วันที่ 26 กันยายน 2026 เวลาไทยประมาณ 21:56–21:58 น. รัน `performance/load-test.js` จากเครื่องผู้ทดสอบไปยัง Preview branch URL เดียวกัน ด้วย `RUN_ID=preview-20260926215603`: เพิ่ม 0→5 VUs ใน 30 วินาที, เป้าหมาย 10 VUs นาน 1 นาที, ลดเป็น 0 ใน 30 วินาที รวม 2 นาที มี think time ใน journey ผล export อยู่ที่ `performance/preview-journey-preview-20260926215603.json`

| รายการ | ผลจริง | เกณฑ์ |
|---|---:|---|
| Journeys / HTTP requests | 138 / 414 (3.36 requests/s) | — |
| Checks | 828/828 ผ่าน | — |
| HTTP failures / journey errors | 0/414 / 0/138 | `<1%` / `<5%` ผ่าน |
| HTTP รวม p50 / p95 | 301.58 / 360.46 ms | p95 `<500 ms` ผ่าน |
| GET list p50 / p95 | 294.01 / 330.26 ms | p95 `<300 ms` **ไม่ผ่าน** |
| GET detail p50 / p95 | 292.94 / 333.04 ms | p95 `<300 ms` **ไม่ผ่าน** |
| POST draft p50 / p95 | 310.40 / 413.65 ms | p95 `<300 ms` **ไม่ผ่าน** |

k6 คืน exit code `99` เพราะ list, detail และ draft เกิน threshold; ไม่ถือว่ารอบ staging ผ่าน ถึงแม้ functional checks และ error rate ผ่านทั้งหมด จากนั้นรัน `performance/cleanup.js` กับ RUN_ID เดิมได้ HTTP 200, `deletedCount=138`, exit code `0` และตรวจใน Neon SQL Editor ของ database `lab07_preview` ด้วย `SELECT COUNT(*) AS total_remaining, COUNT(*) FILTER (WHERE run_id = 'preview-20260926215603') AS journey_remaining FROM lab07_evaluation_drafts;` ได้ `total_remaining=0`, `journey_remaining=0` หลัง cleanup

จากไฟล์ k6 `http_req_waiting` p95 = 351.89 ms จาก `http_req_duration` p95 = 360.46 ms ขณะที่ `http_req_connecting` และ TLS handshake มี p95 = 0 ms การกระจายของเวลารอคำตอบจึงเด่นกว่าเวลาเชื่อมต่อ แต่ k6 ไม่แยกว่าเกิดที่ Vercel edge, deployment protection, function scheduling, network ระหว่างระบบ หรือ handler

ตรวจ [Vercel runtime logs ของ deployment นี้](https://vercel.com/npaha/koencontrol-sdpx-lab/3bKQu6xtJrZ63MmFnWEuPn8uxxk4/logs) แบบอ่านอย่างเดียวในหน้าต่าง 30 นาทีหลังรัน: จาก 50 `http_request` events ที่หน้าแสดงอยู่ GET list 14 ตัวอย่างมี `duration_ms` 0.13–0.23 ms, GET detail 16 ตัวอย่าง 0.14–0.20 ms, POST draft 19 ตัวอย่าง 15.13–47.36 ms และ cleanup 1 ตัวอย่าง 20.18 ms `duration_ms` นี้วัดเฉพาะช่วงใน `withRequestLogging` ไม่ใช่เวลาตั้งแต่ k6 ส่งคำขอถึงได้รับคำตอบ และตัวอย่าง 50 รายการไม่ใช่ทุก 414 requests จึงใช้ชี้ว่ามีเวลาส่วนใหญ่ **นอกช่วง handler ที่วัด** ได้ แต่ยังระบุองค์ประกอบภายนอกที่ช้าไม่ได้

## AI Analysis จากผล Preview

สมมติฐานที่เขียนก่อนวัดว่า POST draft จะมี p95 สูงกว่า GET ได้รับการสนับสนุนในเชิงทิศทาง: POST 413.65 ms เทียบกับ list 330.26 ms และ detail 333.04 ms แต่ยังสรุปไม่ได้ว่าส่วนต่างทั้งหมดเกิดจาก Neon เพราะ p95 ของแต่ละ endpoint ไม่ใช่คำขอคู่เดียวกัน และ log ของ handler ครอบคลุมเวลาเพียงส่วนหนึ่ง

1. **เวลานอก handler เป็นส่วนหลักของ latency รวม — หลักฐานสูงสุด:** k6 วัด p95 รวม 360.46 ms และ waiting 351.89 ms, ขณะที่ log ตัวอย่าง GET handler ต่ำกว่า 1 ms และ health ซึ่งเพียงคืน JSON ก็มี p95 579.74 ms ต้องวัด client-to-edge/edge-to-function, Vercel function duration และ correlation กับ request เดียวกันเพื่อแยก network, protection และ scheduling
2. **การเขียน Neon เพิ่มเวลาของ POST — มีหลักฐานบางส่วน:** POST p95 สูงกว่า GET และ handler POST ใน log ตัวอย่าง 15.13–47.36 ms ขณะที่ GET 0.13–0.23 ms ต้องวัดเวลา SQL query แยกจาก validation/logging และเทียบ warm/cold connections จึงจะยืนยันสัดส่วนของ Neon ได้
3. **cold start หรือระยะทางเครือข่าย — ยังเป็นสมมติฐาน:** มีคำขอสูงสุด 669.81 ms และ p95 smoke สูงกว่า journey แต่ไม่มี trace หรือข้อมูล region ที่จับคู่กับคำขอช้า ต้องเก็บ Vercel invocation/region และวัดจาก client ใกล้ region พร้อมแยก warm/cold ก่อนรับหรือปฏิเสธสาเหตุนี้

ยังไม่รับคำอธิบายว่า “ฐานข้อมูลเป็น bottleneck ทั้งหมด” เพราะ GET และ health ซึ่งไม่อ่าน Neon ก็ช้ากว่า threshold บน Preview เช่นกัน ไม่ปรับ threshold เพียงเพื่อให้ผลเขียว; ต้องตัดสินใจ SLO ที่เหมาะกับสภาพแวดล้อมและวัดซ้ำโดยมีข้อมูลแยกชั้นก่อน

## งานที่ยังเหลือ

- พิสูจน์บน GitHub ว่า job `performance` แดงเมื่อ threshold ไม่ผ่าน แล้วคืนเกณฑ์เดิมให้ CI ผ่านอีกครั้ง
- ใช้ข้อมูลแยกชั้นตาม AI Analysis เพื่อหาสาเหตุ latency ของ Preview ก่อนปรับโค้ดหรือเกณฑ์จริง
- ตรวจ PR และเตรียมบันทึก Demo/AI Memory จากผลที่วัดได้
