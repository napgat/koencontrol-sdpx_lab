# API Traceability — PairEval

| User Story                      | Endpoint                                                     | Purpose                                             |
| ------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| US-01 Create assignment         | `POST /assignments`                                          | อาจารย์สร้าง Assignment พร้อม deadline และ criteria |
| US-02 Generate pairs            | `POST /assignments/{assignmentId}/pair-assignments/generate` | ระบบสร้างและแจก pairs                               |
| US-03 View assigned pairs       | `GET /assignments/{assignmentId}/my-pairs`                   | นักศึกษาดู pairs ที่ตนเองได้รับ                     |
| US-04 Save draft                | `PUT /pair-assignments/{pairAssignmentId}/response`          | นักศึกษาบันทึกคำตอบแบบ draft                        |
| US-05 Submit evaluation         | `POST /assignments/{assignmentId}/submit`                    | นักศึกษาส่งคำตอบให้มีผลต่อคะแนน                     |
| US-06 View submission status    | `GET /assignments/{assignmentId}/my-submission`              | นักศึกษาดูสถานะและเวลาส่ง                           |
| US-07 View report               | `GET /assignments/{assignmentId}/report`                     | อาจารย์ดู score summary และ coverage                |
| US-08 View assignment readiness | `GET /assignments/{assignmentId}`                            | อาจารย์ดูรายละเอียดและสถานะ Ready/Not Ready         |
