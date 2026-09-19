# PairEval — SDPX Labs 01–05

Repository นี้เป็นจุดรวม source และเอกสารสำหรับ Demo งาน SDPX Lab 01–05
แอปที่ root เป็นเวอร์ชันที่พัฒนาต่อเนื่องจาก Lab 01 จนถึง Lab 05 ไม่ใช่แอปแยกห้าชุด

## เอกสารแต่ละ Lab

อ่าน [Prepared และ Instruction ของ Lab 01–05](./docs/labs/README.md) ตามลำดับ

## เริ่มใช้งาน

สำหรับการพัฒนา ให้เปิด Docker Desktop แล้วรัน:

```bash
docker compose up
```

สำหรับ unit tests และ E2E tests ให้ใช้คำสั่งใน [AGENTS.md](./AGENTS.md)
หรืออ่าน [ขั้นตอน setup](./docs/setup-steps.md)

## ประวัติ Lab 01

ไฟล์ที่ Git ติดตามใน [repo ที่ส่ง Lab 01 เดิม](https://github.com/napgat/sdpx-lab-ai-01-koencontrol)
มีอยู่ใน repository นี้ครบทุก path แล้ว ไฟล์ที่เนื้อหาต่างกันเป็นส่วนที่พัฒนาต่อใน Lab ถัดมา
จึงไม่คัดลอกไฟล์เก่าทับ source ปัจจุบันหรือสร้าง snapshot ซ้ำ
repo เดิมยังเก็บไว้เป็นหลักฐาน commit และ deployment ของ Lab 01

การเชื่อม Vercel เข้ากับ repository นี้เป็นงานแยกต่างหาก และยังไม่ถือว่าเสร็จจากการจัดเอกสารครั้งนี้
