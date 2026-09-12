# Product Backlog — PairEval Group Evaluation MVP

## Story 1 — Instructor creates a group-evaluation assignment
**Label:** user-story
**Status:** To Do

### User Story
As an instructor, I want to create a group-evaluation assignment
with a title, deadline, and criteria, so that students can be assigned
a clearly defined evaluation task.

###  Acceptance Criteria
- Given I am an authenticated instructor, when I provide a title,
  a future deadline, and criteria whose total weight is 100%, then
  the system creates the assignment successfully.
- Given the criteria weights do not total 100%, when I try to create
  the assignment, then the system rejects the request and explains
  that the total must equal 100%.
- Given I am a student, when I try to create an assignment, then
  the system denies access.

###  Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover the assignment-validation business rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.
### Comment
ทำความเข้าใจ Story นี้:
- **Who:** instructor
- **Want:** สร้าง assignment
- **Benefit:** นักศึกษามีงานประเมินที่กติกาชัดเจน
- AC ข้อแรกคือ success case
- AC ข้อสองคือ validation/business rule
- AC ข้อสามคือ authorization rule
สิ่งทำ
1. เริ่ม backlog จากการสร้าง Assignment เพราะเป็นจุดเริ่มของ workflow ทุกอย่าง
2. เขียน AC ครบทั้งกรณีสำเร็จ
3. validation ว่าน้ำหนัก criteria ต้องรวม 100% , การป้องกันไม่ให้ student สร้างงานแทนอาจารย์
---
## Story 2 — System generates fair group-evaluation pairs
**Label:** user-story
**Status:** To Do

###  User Story
As an instructor, I want the system to generate and assign group-evaluation
pairs for each criterion, so that students receive fair comparisons to evaluate.

###  Acceptance Criteria
- Given an assignment has valid criteria and at least three groups,
  when I generate pair assignments, then the system creates comparison
  pairs for every criterion and assigns them to eligible students.
- Given a student belongs to one of the groups in a comparison pair,
  when the system assigns pairs, then that student does not receive
  that pair for evaluation.
- Given there are fewer than three groups, when I generate pair
  assignments, then the system rejects the request and explains that
  no eligible external evaluator is available.
- Given pair generation succeeds, when I view the assignment, then
  I can see that pair assignments have been generated.

###  Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover pair-generation and self-evaluation rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.

###  Comment
ความหมายสำคัญ
- **Pair assignment** คือระบบจับคู่ เช่น `Group A vs Group B` แล้วแจกให้นักศึกษาคนหนึ่งประเมิน
- นักศึกษาใน Group A หรือ Group B **ห้าม** ได้ pair นี้ เพราะเป็นการประเมินกลุ่มตัวเอง
- กรณีมีแค่ 2 กลุ่ม ไม่มีคนจากกลุ่มที่สามมาประเมิน จึงเป็น error case ที่ต้องกำหนดไว้ ไม่ปล่อยให้ระบบเดา

**ทำอะไร:** แยก logic การสร้างคู่ ออกจากการสร้าง Assignment ใน Story 1
**ทำไม:** กฎ “ห้ามประเมินกลุ่มตัวเอง” เป็น business rule สำคัญ ต้องมี AC และ unit test ของตัวเอง
สิ่งที่ทำ
1. แยกการ generate pairs เป็นอีก story เพราะเป็น logic ที่มีความเสี่ยงต่อความยุติธรรมของคะแนน
2. ระบบต้องแจก pair ต่อ criteria และต้องกรองไม่ให้นักศึกษาเห็น pair ที่มีกลุ่มตัวเองอยู่



---

## Story 3 — Student views assigned evaluation pairs
**Label:** user-story
**Status:** To Do

###  User Story
As a student, I want to view my assigned group-evaluation pairs,
criteria, and deadline, so that I know what I must evaluate and when
I must submit it.

###  Acceptance Criteria
- Given I am an authenticated student with assigned pairs, when I open
  an active assignment, then I see only my assigned group pairs,
  grouped by criterion.
- Given I open an active assignment, when the deadline exists, then
  I see its date, time, and timezone clearly.
- Given I have no assigned pairs for an assignment, when I open it,
  then the system shows an informative empty state instead of showing
  other students' pairs.
- Given I am a student, when I try to access another student's assigned
  pairs, then the system denies access.
- Given I am evaluating my assigned pairs, when I select an outcome for the current pair and choose Next Pair, then the system displays the next assigned pair and preserves my current selection state.
###  Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover the data-access and assignment-visibility rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.

### Comment

ความหมาย
- ระบบต้องแสดงเฉพาะ pair ของผู้ที่ login อยู่เท่านั้น
- `grouped by criterion` เช่น หัวข้อ “UX” มี pairs ชุดหนึ่ง และหัวข้อ “Completeness” มีอีกชุดหนึ่ง
- empty state คือข้อความที่ช่วยผู้ใช้เข้าใจ เช่น “ยังไม่มี pairs ที่ได้รับมอบหมาย”
- AC เรื่อง timezone รับมาจาก Open Question ข้อ 1 เพื่อย้ำว่า deadline ต้องสื่อสารชัด

**ทำอะไร:** กำหนดสิ่งที่นักศึกษาเห็นและสิ่งที่ห้ามเห็น
**ทำไม:** เป็นทั้ง requirement ด้าน usability และ security/data isolation
สิ่งที่ทำ
1. Story นี้กำหนด data isolation ชัดเจน นักศึกษาเห็นเฉพาะ pair ที่ระบบแจกให้ตนเอง ไม่สามารถเปิดของคนอื่นได้
2. เห็น deadline พร้อม timezone เพื่อป้องกันการส่งงานผิดเวลา


---

## Story 4 — Student saves evaluation progress as a draft
**Label:** user-story
**Status:** To Do

### User Story
As a student, I want to save my evaluation progress as a draft,
so that I can return later without losing answers I have already entered.

### Acceptance Criteria
- Given I have assigned pairs in an active assignment, when I select
  scores for one or more pairs and save, then the system stores my
  answers as a draft.
- Given I have an existing draft, when I change scores and save again,
  then the system updates the draft with my latest answers.
- Given I have not answered every assigned pair, when I save a draft,
  then the system allows the save and clearly indicates that the
  evaluation is not yet submitted.
- Given I open an assignment with an existing draft, when the page loads,
  then the system shows my previously saved answers.
- Given I try to save answers for pairs not assigned to me, when I send
  the request, then the system denies the request.

### Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover draft-save and access-control rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.

### Comment
จุดสำคัญ:

- **Draft** คือคำตอบที่ยังแก้ได้ และยังไม่นำไปคำนวณคะแนน
- ผู้เรียนบันทึกได้แม้ตอบไม่ครบ เพื่อกลับมาทำต่อ
- กด Save ซ้ำ = อัปเดต draft เดิม ไม่สร้างคำตอบซ้ำหลายชุด
- ระบบต้องกันไม่ให้ผู้เรียนบันทึกคำตอบแทนคนอื่น

**ทำอะไร:** แยกพฤติกรรม “บันทึกชั่วคราว” ออกจาก “ส่งงานจริง”
**ทำไม:** Save และ Submit มีผลต่อคะแนนต่างกัน จึงต้องเป็นคนละ story และภายหลังเป็นคนละ API behavior
สิ่งที่ทำ
1. แยก draft ออกจาก submission เพราะ draft มีไว้ป้องกันข้อมูลหายและ
2. อนุญาตให้ตอบไม่ครบได้ แต่ยังไม่มีผลต่อคะแนน
3. ระบบจะเก็บเฉพาะคำตอบล่าสุดของ draft และตรวจว่าผู้ใช้เป็นเจ้าของ pair นั้น

---

## Story 5 — Student submits an evaluation
**Label:** user-story
**Status:** To Do

## User Story
As a student, I want to submit my group evaluation before the deadline,
so that my responses are included in the assignment results.

## Acceptance Criteria
- Given I have assigned pairs and the deadline has not passed, when I
  submit my evaluation, then the system records my latest answers with
  a submitted timestamp.
- Given I have answered only some assigned pairs, when I submit, then
  the system shows my completion progress and asks me to confirm that
  the submission is incomplete.
- Given I confirm an incomplete submission before the deadline, when
  the submission succeeds, then the system records it for partial-credit
  calculation.
- Given the deadline has passed, when I try to submit, then the system
  rejects the request and explains that the assignment is closed.
- Given I have submitted the evaluation in this Lab MVP, when I try to
  change answers, then the system does not allow editing.

## Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover deadline and partial-submission rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.

### Comment

จุดสำคัญ:

- **Submit** เปลี่ยนคำตอบจาก draft เป็นคำตอบที่ระบบนำไปคำนวณผลได้
- หากตอบไม่ครบ ระบบต้องเตือนและบอก progress เช่น `6 / 10 pairs answered`
- PairEval PRD รองรับ **partial credit** จึงไม่บังคับว่าต้องตอบครบก่อน submit
- หลัง deadline ต้องปฏิเสธการ submit
- PRD ฉบับเต็มรองรับ re-submission แต่เราเขียนให้เป็น Out of Scope สำหรับ Lab MVP จึงล็อกการแก้หลัง submit ไว้ก่อน

**ทำอะไร:** กำหนดจุดที่คำตอบมีผลต่อคะแนน พร้อมกฎ deadline และ partial submission
**ทำไม:** เป็น business rule ที่ API ต้องบังคับบน server ไม่ใช่พึ่ง frontend ซ่อนปุ่มอย่างเดียว
สิ่งที่ทำ
1. แยก Save กับ Submit อย่างชัดเจน โดย draft ยังไม่มีผลต่อคะแนน
2. ส่วน submission จะถูกบันทึกพร้อมเวลา
3. ระบบตรวจ deadline ที่ฝั่ง server และรองรับการส่งไม่ครบเพื่อคำนวณ partial credit ตาม requirement


---

## Story 6 — Student views submission status
**Label:** user-story
**Status:** To Do

## User Story
As a student, I want to see the status and timestamp of my evaluation
submission, so that I know whether the system has recorded my work.

## Acceptance Criteria
- Given I have submitted an evaluation, when I open the assignment,
  then I see a Submitted status and the timestamp of my submission.
- Given I have saved a draft but have not submitted, when I open the
  assignment, then I see a Draft status and a clear message that it
  does not yet count as a submission.
- Given I have not saved or submitted any answers, when I open the
  assignment, then I see a Not Started status.
- Given I am a student, when I view an assignment, then I see only
  my own submission status and not another student's status.

## Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover status-display and data-isolation rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.


### Comment
ความหมายของสถานะ:

|สถานะ|หมายความว่า|
|---|---|
|`Not Started`|ยังไม่เคยบันทึกคำตอบ|
|`Draft`|Save แล้ว แต่ยังไม่มีผลต่อคะแนน|
|`Submitted`|ส่งแล้ว ระบบบันทึกเวลาส่งและนำคำตอบไปใช้ได้|

**ทำอะไร:** ทำให้ผู้เรียนตรวจสอบผลของการกระทำตัวเองได้
**ทำไม:** ลดปัญหา “ผมคิดว่าส่งแล้ว แต่จริง ๆ แค่ Save draft” ซึ่งเป็นความผิดพลาดที่เกิดบ่อยในระบบส่งงาน
สิ่งที่ทำ
1. เพิ่ม story สำหรับ submission status เพราะ Save กับ Submit มีความหมายต่างกัน
2. ผู้เรียนต้องเห็นอย่างชัดเจนว่าอยู่สถานะ Draft หรือ Submitted พร้อมเวลาส่ง เพื่อยืนยันว่าระบบได้รับงานแล้


---

## Story 7 — Instructor views a group-evaluation summary report
**Label:** user-story
**Status:** To Do

## User Story
As an instructor, I want to view a summary of group-evaluation results,
so that I can monitor submissions and review each group's score.

## Acceptance Criteria
- Given an assignment has submitted evaluations, when I open its report,
  then I see each group's score summary grouped by criterion.
- Given an assignment has submitted evaluations, when I open its report,
  then I see the submission count and pair-coverage information.
- Given no student has submitted an evaluation, when I open the report,
  then the system shows an informative empty report state.
- Given I am an instructor for the classroom, when I open the report,
  then I can view only reports for assignments in my classroom.
- Given I am a student, when I try to access an instructor report,
  then the system denies access.

## Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover score-summary and report-access rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.

### Comment

ความหมาย:

- **Score summary grouped by criterion** เช่น Group A ได้คะแนน UX เท่าไร และ Completeness เท่าไร
- **Submission count** เช่น มีนักศึกษา submit แล้ว `18 / 25 คน`
- **Pair coverage** คือแต่ละคู่ถูกประเมินกี่ครั้ง ช่วยให้อาจารย์ดูได้ว่าข้อมูลสมดุลหรือไม่
- รายงานเป็นข้อมูลของอาจารย์ นักศึกษาเปิดดูไม่ได้

**ทำอะไร:** กำหนดผลลัพธ์ที่อาจารย์ต้องได้รับหลังนักศึกษาส่งการประเมิน
**ทำไม:** ถ้าไม่มี report ระบบอาจรับคำตอบได้ แต่ยังไม่ปิด workflow ของการประเมิน
สิ่งที่ทำ
1. หลังนักศึกษาส่งข้อมูล อาจารย์ต้องใช้ผลลัพธ์ได้จริง
2. Story นี้จึงกำหนดรายงานรายกลุ่ม แยกตาม criteria พร้อมจำนวน submission และ pair coverage โดยจำกัดสิทธิ์ให้เฉพาะอาจารย์ของ classroom

เหลือ Story 8 ซึ่งจะปิด workflow ฝั่งอาจารย์: ดูรายละเอียด Assignment และสถานะการสร้าง pairs ครับ

---

## Story 8 — Instructor views assignment readiness
**Label:** user-story
**Status:** To Do

## User Story
As an instructor, I want to view an assignment's details and pair-generation
status, so that I know whether it is ready for students to evaluate.

## Acceptance Criteria
- Given I am an instructor for the classroom, when I open an assignment,
  then I see its title, deadline, and evaluation criteria.
- Given pair assignments have not been generated, when I open the
  assignment, then I see a Not Ready status and no students can begin
  evaluation.
- Given pair assignments have been generated, when I open the assignment,
  then I see a Ready status and the number of pairs generated.
- Given I am an instructor, when I try to open an assignment outside my
  classroom, then the system denies access.
- Given I am a student, when I try to access the instructor assignment
  management view, then the system denies access.

## Definition of Done
- [ ] Feature works according to the acceptance criteria.
- [ ] Unit tests cover readiness-status and access-control rules.
- [ ] At least one acceptance criterion has an E2E test in WS-04.
- [ ] Code is reviewed by a group member.
- [ ] The feature is deployed to staging and can be used.


### Comment

ความหมายของสถานะ:

|สถานะ|ความหมาย|
|---|---|
|`Not Ready`|อาจารย์สร้าง Assignment แล้ว แต่ระบบยังไม่ได้สร้าง/แจก pairs|
|`Ready`|สร้าง pairs สำเร็จ นักศึกษาจึงเริ่มประเมินได้|

**ทำอะไร:** ทำให้อาจารย์ตรวจสอบได้ว่า Assignment พร้อมใช้งานจริงหรือยัง
**ทำไม:** ป้องกันกรณีอาจารย์คิดว่าเปิดงานแล้ว แต่นักศึกษาไม่มี pair ให้ประเมิน
**สิ่งที่ทำ**
1. แยกสถานะ Not Ready และ Ready เพื่อบอกให้อาจารย์รู้ว่า Assignment ถูกสร้างแล้วอย่างเดียว หรือสร้างและแจก pairs สำเร็จจนพร้อมให้นักศึกษาประเมินแล้ว
