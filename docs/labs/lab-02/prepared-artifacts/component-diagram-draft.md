# Component Diagram Draft — PairEval

> Draft สำหรับ WS-02--before
> แสดงสถาปัตยกรรมเป้าหมาย ไม่ใช่รายการ component ที่ implement ครบแล้ว

```mermaid
flowchart LR
    Student[Student Browser]
    Instructor[Instructor Browser]

    Student -->|HTTPS| Web[Next.js Web App]
    Instructor -->|HTTPS| Web

    Web -->|REST /api + bearer token| API[Next.js API Routes]

    API -->|authenticate user| Auth[Auth Provider]
    API -->|create and assign pairs| Pairing[Pair Assignment Service]
    API -->|save draft and submit evaluation| Evaluation[Evaluation Service]
    API -->|read/write data| DB[(PostgreSQL Database)]

    Pairing -->|store pair assignments| DB
    Evaluation -->|store responses and scores| DB
```

## Notes
- Student evaluates assigned pairs and submits responses.
- Instructor creates assignments and reviews results.
- API Routes enforce authorization before calling services.
- Pair Assignment Service must prevent self-evaluation.
- Evaluation Service saves drafts and final submissions.

## Comment
**อ่าน diagram นี้อย่างไร**

- `Student Browser` และ `Instructor Browser` คือผู้ใช้สองบทบาท
- `Next.js Web App` คือหน้าจอที่ผู้ใช้กดใช้งาน
- `API Routes` คือ backend endpoint ที่ frontend เรียกผ่าน `/api`
- `Auth Provider` ยืนยันตัวตนและ role
- `Pair Assignment Service` รับผิดชอบสร้างคู่ประเมิน
- `Evaluation Service` รับผิดชอบ draft และการ submit
- `PostgreSQL` เก็บข้อมูลถาวร
- label บนลูกศรบอกว่า “เรียกอะไร/ใช้ protocol อะไร” ซึ่งเป็นเกณฑ์ของ Lab
