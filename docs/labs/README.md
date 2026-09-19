# SDPX Lab Documents

เอกสาร Prepared และ Instruction สำหรับสมาชิกในกลุ่ม ให้อ่านตามลำดับดังนี้:

1. อ่าน `01-prepared.md` และเตรียม prerequisite ให้ครบ
2. อ่าน `02-instruction.md` ก่อนเริ่มทำ Lab
3. เปิด artifacts เพิ่มเติมเมื่อ Lab นั้นระบุไว้

| Lab | Prepared | Instruction | หมายเหตุ |
| --- | --- | --- | --- |
| Lab 01 | [Prepared](./lab-01/01-prepared.md) | [Instruction](./lab-01/02-instruction.md) | Source เป็นฐานของแอปใน repo นี้; [repo เดิม](https://github.com/napgat/sdpx-lab-ai-01-koencontrol) เก็บหลักฐานการส่งและ deployment |
| Lab 02 | [Prepared](./lab-02/01-prepared.md) | [Instruction](./lab-02/02-instruction.md) | มี [prepared artifacts](./lab-02/prepared-artifacts/) เพิ่มเติม |
| Lab 03 | [Prepared](./lab-03/01-prepared.md) | [Instruction](./lab-03/02-instruction.md) | ใช้ source ที่ต่อยอดจาก Lab 02 |
| Lab 04 | [Prepared](./lab-04/01-prepared.md) | [Instruction](./lab-04/02-instruction.md) | ใช้ source ที่ต่อยอดจาก Lab 03 |
| Lab 05 | [Prepared](./lab-05/01-prepared.md) | [Instruction](./lab-05/02-instruction.md) | Docker และ Environment Loop |

## Repository Policy

- Lab 01–05 ใช้ repository นี้เป็น source และเอกสารร่วมกัน โดย source ที่ root เป็นเวอร์ชันที่พัฒนาต่อเนื่อง
- Repository เดิมของ Lab 01 ยังคงเป็นหลักฐานประวัติ Git และ deployment ที่ส่งไปแล้ว; [Vercel ปัจจุบัน](https://koencontrol-sdpx-lab.vercel.app/) deploy จาก `main` ของ repository นี้
- เอกสารในโฟลเดอร์นี้เป็นข้อมูลอ้างอิงสำหรับการเรียนและการ Demo
- ห้ามบันทึก `.env`, token, password หรือ secret จริงลงในเอกสาร
- AI Memory ไม่ได้รวมไว้ในชุดเอกสารสำหรับสมาชิก เนื่องจากเป็นบันทึกการทำงานเฉพาะเครื่องและ Agent
