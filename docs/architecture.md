# PairEval Architecture

## Component Diagram

```mermaid
flowchart LR
    Student[Student Browser]
    Instructor[Instructor Browser]

    Student -->|HTTPS| Web[Next.js Web App]
    Instructor -->|HTTPS| Web

    Web -->|REST /api + bearer token| API[Next.js API Routes]

    API -->|authenticate user and role| Auth[Auth Provider]
    API -->|create and read assignments| Assignment[Assignment Service]
    API -->|generate eligible pairs| Pairing[Pair Generation Service]
    API -->|save drafts and submit evaluations| Evaluation[Evaluation Service]
    API -->|read scores and coverage| Reporting[Reporting Service]

    Assignment -->|read/write assignments and criteria| DB[(PostgreSQL Database)]
    Pairing -->|read groups and write pair assignments| DB
    Evaluation -->|read pairs and write responses| DB
    Reporting -->|read submitted responses and scores| DB
```

## Component Responsibilities

- **Next.js Web App:** Student และ Instructor ใช้หน้าจอระบบผ่าน browser
- **Next.js API Routes:** รับ REST request และตรวจ authorization
- **Auth Provider:** ยืนยันตัวตนและ role ของผู้ใช้
- **Assignment Service:** สร้าง Assignment, deadline และ criteria
- **Pair Generation Service:** สร้าง pairs และกัน self-evaluation
- **Evaluation Service:** Save draft และ Submit evaluation
- **Reporting Service:** แสดง score summary และ pair coverage
- **PostgreSQL Database:** เก็บข้อมูลระบบแบบถาวร