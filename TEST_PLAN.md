# Test Plan — PairEval

## PairingService.generatePairAssignments()

- มีอย่างน้อย 3 กลุ่ม → สร้าง pair assignments ได้
- น้อยกว่า 3 กลุ่ม → ปฏิเสธการสร้าง pairs
- สร้าง pairs แยกตาม criterion
- student ต้องไม่ได้รับ pair ที่มีกลุ่มของตนเอง
- Assignment เดิมต้องไม่สร้าง pair assignments ซ้ำ

## EvaluationService.saveDraft()

- เฉพาะ student ที่ได้รับมอบหมาย pair เท่านั้นที่ save draft ได้
- draft ที่ข้อมูลไม่ครบสามารถบันทึกและแก้ไขได้

## EvaluationService.submitEvaluation()

- server ปฏิเสธการ submit หลัง deadline
- ข้อมูลไม่ครบต้องส่ง `confirmIncomplete: true`
- เมื่อ submitted แล้ว ห้ามแก้ไข evaluation

## กฎที่ยังไม่มี test (ยอมรับไว้ชั่วคราว)

- EvaluationService ทุกข้อ — จะสร้างหลัง PairingService harness ผ่านแล้ว

## Fidelity Check (WS-03)

- ลบกฎชั่วคราว: evaluator ต้องไม่อยู่ใน Group A หรือ Group B ของ pair
- Test ที่แดง: `never assigns a student to a pair containing their own group`
- ผล: ✅ test harness ปกป้องกฎ self-evaluation ได้จริง
