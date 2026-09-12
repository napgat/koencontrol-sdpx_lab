# PairEval Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ GROUP_MEMBER : belongs_to
    GROUP ||--o{ GROUP_MEMBER : has_members
    CLASSROOM ||--o{ GROUP : contains
    USER ||--o{ ASSIGNMENT : creates
    CLASSROOM ||--o{ ASSIGNMENT : has
    ASSIGNMENT ||--o{ CRITERION : defines
    ASSIGNMENT ||--o{ PAIR_ASSIGNMENT : generates
    CRITERION ||--o{ PAIR_ASSIGNMENT : applies_to
    USER ||--o{ PAIR_ASSIGNMENT : assigned_to
    GROUP ||--o{ PAIR_ASSIGNMENT : left_group
    GROUP ||--o{ PAIR_ASSIGNMENT : right_group
    PAIR_ASSIGNMENT ||--o| EVALUATION_RESPONSE : receives
    USER ||--o{ EVALUATION_RESPONSE : submits
    ASSIGNMENT ||--o{ COMPUTED_SCORE : produces
    GROUP ||--o{ COMPUTED_SCORE : receives
    CRITERION ||--o{ COMPUTED_SCORE : measures

    USER {
        uuid id PK
        string email
        string name
        string role
    }

    CLASSROOM {
        uuid id PK
        string name
        uuid instructor_id FK
    }

    GROUP {
        uuid id PK
        uuid classroom_id FK
        string name
    }

    GROUP_MEMBER {
        uuid id PK
        uuid group_id FK
        uuid user_id FK
    }

    ASSIGNMENT {
        uuid id PK
        uuid classroom_id FK
        uuid created_by FK
        string title
        datetime deadline_at
        string status
    }

    CRITERION {
        uuid id PK
        uuid assignment_id FK
        string name
        decimal weight_percent
    }

    PAIR_ASSIGNMENT {
        uuid id PK
        uuid assignment_id FK
        uuid criterion_id FK
        uuid left_group_id FK
        uuid right_group_id FK
        uuid assigned_to_user_id FK
        string status
    }

    EVALUATION_RESPONSE {
        uuid id PK
        uuid pair_assignment_id FK
        uuid evaluator_id FK
        int score
        string status
        datetime saved_at
        datetime submitted_at
    }

    COMPUTED_SCORE {
        uuid id PK
        uuid assignment_id FK
        uuid criterion_id FK
        uuid group_id FK
        decimal score
        datetime computed_at
    }
```

# Comment
ความสัมพันธ์หลัก

- `ASSIGNMENT → CRITERION` = งานประเมินหนึ่งงานมีหลายเกณฑ์
- `ASSIGNMENT → PAIR_ASSIGNMENT` = งานหนึ่งงานสร้าง pairs หลายคู่
- `PAIR_ASSIGNMENT → EVALUATION_RESPONSE` = pair ที่แจกหนึ่งคู่มีคำตอบได้ศูนย์หรือหนึ่งชุดใน Lab MVP
- `GROUP_MEMBER` = ตารางกลางที่บอกว่านักศึกษาคนใดอยู่กลุ่มใด
- `COMPUTED_SCORE` = คะแนนที่ระบบคำนวณเพื่อใช้ในรายงานของอาจารย์