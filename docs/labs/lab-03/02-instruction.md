# Lab Instruction: Unit Test Harness & First E2E

> เอกสารนี้เป็นขั้นตอนทำ Lab 03 ในห้อง งานเตรียมความพร้อมอยู่ที่ `01_prepared-before-lab-3.md`

## เป้าหมาย
สร้าง **Unit Test Harness** ของ project ให้ใช้งานได้จริง แล้วเริ่ม E2E test ตัวแรก

## 🎯 ทำ lab นี้แล้วได้ทักษะอะไร

| สิ่งที่จะทำได้ | ใช้ในงานจริงอย่างไร |
|---|---|
| สร้าง test harness (fake, fixture, factory) ที่ใช้ซ้ำได้ | ทำให้ test ชุดต่อ ๆ ไปเขียนได้เร็วขึ้น ซึ่งเป็นสิ่งที่ตัดสินว่าทีมจะเขียน test ต่อไปหรือเลิกเขียน |
| พิสูจน์ fidelity ของ test ด้วยการทำลาย code แล้วดูว่ามันแดง | เป็นวิธีตรวจ safety net ที่ใช้ได้จริงก่อนจะเริ่ม refactor ของสำคัญ |
| ควบคุมเวลารัน test ให้อยู่ในงบที่กำหนด | test ที่ช้าจะถูกข้ามไปในที่สุด ไม่ว่าจะเขียนไว้ดีแค่ไหน |
| เขียน E2E smoke test ตัวแรก | smoke test คือด่านแรกที่ทีมใช้ยืนยันว่า deploy ไม่ได้ทำระบบล่ม |

---

## 📦 ของที่ต้องมีอยู่แล้วก่อนเริ่ม lab

lab นี้ **ไม่เริ่มจากศูนย์** — มันต่อยอดจากงานใน `WS-03--before` ทันที
ถ้าแถวไหนยังว่าง ให้จัดการแถวนั้นก่อนเป็นอย่างแรก แล้วค่อยไล่ขั้นตอนตามปกติ

| ต้องมี | จะถูกใช้ที่ | ถ้ายังไม่มี |
|---|---|---|
| testing framework ที่ยืนยันแล้วว่ารันได้ | lab Part A — เริ่มเขียน test ได้ทันทีในนาทีแรก | หมดครึ่ง lab ไปกับการ debug config ของ test runner |
| backlog และ wireframe ที่ revise แล้ว | lab Part A — เลือก business rule ที่จะ test จากที่นี่ | ไม่รู้ว่าอะไรคือกฎที่ควรมี test คุ้มครองมากที่สุด |
| Playwright ที่ติดตั้งแล้ว | lab Part B — เขียน E2E ตัวแรก | เสียเวลา 30 นาทีสุดท้ายไปกับการ download browser |
| ตัวเลขเวลาที่ test loop ของกลุ่มใช้ | lecture หัวข้อ 1 — เทียบ latency ของ loop ระหว่างกลุ่ม | ไม่มีฐานเทียบว่า loop ของกลุ่มตัวเองเร็วหรือช้า |

**แผนสำรองเมื่อของไม่ครบ:** จับคู่กับเพื่อนที่ทำมาแล้ว ใช้เครื่องของเขาเดินต่อ
แล้วตามเก็บงานของตัวเองหลังคาบ — สิ่งที่ห้ามทำคือให้ทั้งกลุ่มหยุดรอคนเดียว

---

## Part A: Unit Test Harness (60 นาที)

### ขั้นตอนที่ 1 — สร้าง Test Structure (10 นาที)

```
project/
├── src/
│   ├── services/
│   │   └── booking_service.py (หรือ .ts)
│   └── repositories/
│       └── room_repository.py
├── tests/
│   ├── conftest.py           ← fixtures (Python)
│   ├── factories.py          ← factory functions
│   ├── fakes/
│   │   └── fake_room_repo.py ← fake implementations
│   └── unit/
│       └── test_booking_service.py
└── TEST_PLAN.md
```

```
PS E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03> New-Item -ItemType Directory -Force src/services, src/repositories, tests/fakes, tests/unit

    Directory: E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03\src


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----          9/5/2026   6:49 PM                services
d-----          9/5/2026   6:49 PM                repositories


    Directory: E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03\tests


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----          9/5/2026   6:49 PM                fakes
d-----          9/5/2026   6:49 PM                unit
```

**ทำอะไร:** สร้างพื้นที่แยกสำหรับ service, repository, fake repository และ unit tests
(`tests/e2e` มีอยู่แล้วจาก Playwright จึงไม่ต้องสร้างซ้ำ)

**ทำไม:** การแยกโครงสร้างทำให้ test ไม่ปนกับ production code และ fake สามารถแทน database ได้ โดยไม่ต้องพึ่ง external service

ตอน Demo พูดว่า:

> “ผมจัด test harness ให้แยก service, repository, fake และ unit test ชัดเจน เพื่อให้ unit test รันเร็วและทดสอบ business rules ได้โดยไม่เรียกฐานข้อมูลจริง”

### ขั้นตอนที่ 2 — เขียน TEST_PLAN.md (10 นาที)

สร้างไฟล์ `TEST_PLAN.md` ที่ root ของ `koencontrol-lab-03`
ให้ลอกมาจาก section *Key Business Rules* ใน `memory-bank/units/*/unit-brief.md` โดยตรง
— ทุกกฎที่เขียนไว้ตอน WS-02 ต้องมีบรรทัดของตัวเองที่นี่

```markdown
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
```

ทำอะไร: เปลี่ยน business rules จาก `memory-bank/units/` ให้เป็นรายการ test ที่ตรวจได้

ทำไม: ทำให้เราเขียน test เพื่อปกป้องกฎจริงของ PairEval ไม่ใช่ test ที่เช็กแค่ constructor หรือ implementation ภายใน

ตอน Demo พูดว่า:

> “Test Plan นี้ trace กลับไปที่ Key Business Rules ของ Pairing และ Evaluation โดยทุกกฎมี test case ที่ระบุไว้ชัดเจน”

### ขั้นตอนที่ 3 — สร้าง Repository Contract และ Fake Repository

เราจะเริ่มจาก `PairingService` เพราะมี business rule ที่ชัดที่สุด: ห้ามให้ student ประเมิน pair ที่มีกลุ่มของตัวเอง

สร้างไฟล์ `src/repositories/pair-assignment-repository.ts`:

```python
# tests/fakes/fake_room_repo.py
class FakeRoomRepo:
    def __init__(self, rooms=None):
        self._rooms = {r.id: r for r in (rooms or [])}

    def find_by_id(self, room_id):
        return self._rooms.get(room_id)

    def find_available(self, start_time, end_time):
        return [r for r in self._rooms.values() if r.is_available]

    def save(self, room):
        self._rooms[room.id] = room
        return room
```

```typescript
export type PairAssignment = {
  assignmentId: string;
  criterionId: string;
  evaluatorStudentId: string;
  groupAId: string;
  groupBId: string;
};

export interface PairAssignmentRepository {
  findByAssignmentId(assignmentId: string): PairAssignment[];
  saveMany(assignments: PairAssignment[]): PairAssignment[];
}
```

จากนั้นสร้าง `tests/fakes/fake-pair-assignment-repository.ts`:

```typescript
import type {
  PairAssignment,
  PairAssignmentRepository,
} from "../../src/repositories/pair-assignment-repository";

export class FakePairAssignmentRepository
  implements PairAssignmentRepository
{
  private assignments: PairAssignment[];

  constructor(initialAssignments: PairAssignment[] = []) {
    this.assignments = [...initialAssignments];
  }

  findByAssignmentId(assignmentId: string): PairAssignment[] {
    return this.assignments.filter(
      (assignment) => assignment.assignmentId === assignmentId,
    );
  }

  saveMany(assignments: PairAssignment[]): PairAssignment[] {
    this.assignments.push(...assignments);
    return assignments;
  }
}
```

**ทำอะไร:** กำหนด contract ของ repository แล้วสร้าง fake ที่เก็บข้อมูลใน memory แทน database จริง

**ทำไม:** Unit test ต้องเร็วและควบคุมข้อมูลได้เอง แต่ fake ยังใช้ interface เดียวกับของจริง จึงไม่กลายเป็น test ที่เขียวแต่ใช้จริงไม่ได้


> Fake ต้อง implement interface เดียวกับของจริง ไม่งั้น test เขียวแต่ production พัง
> ถ้าใช้ TypeScript ให้ `implements RoomRepository` เพื่อให้ compiler ช่วยตรวจให้

ตอน Demo พูดว่า:

> “Fake repository ใช้ contract เดียวกับ repository จริง แต่เก็บข้อมูลใน memory ทำให้ test business rules ได้เร็ว โดยไม่ต้องเชื่อม database”


### ขั้นตอนที่ 4 — สร้าง Factories และ Fixtures  สำหรับ test data

```python
# tests/factories.py
def make_room(**overrides):
    defaults = {"id": 1, "name": "A101", "capacity": 10, "is_available": True}
    return Room(**{**defaults, **overrides})

def make_user(**overrides):
    defaults = {"id": 1, "name": "John", "email": "john@uni.ac.th", "role": "student"}
    return User(**{**defaults, **overrides})
```
==
```typescript
// tests/factories.ts
export type TestAssignment = {
  id: string;
};

export type TestGroup = {
  id: string;
  name: string;
};

export type TestStudent = {
  id: string;
  groupId: string;
};

export type TestCriterion = {
  id: string;
  name: string;
};

export const makeAssignment = (
  overrides: Partial<TestAssignment> = {},
): TestAssignment => ({
  id: "assignment-1",
  ...overrides,
});

export const makeGroup = (
  overrides: Partial<TestGroup> = {},
): TestGroup => ({
  id: "group-a",
  name: "Group A",
  ...overrides,
});

export const makeStudent = (
  overrides: Partial<TestStudent> = {},
): TestStudent => ({
  id: "student-1",
  groupId: "group-a",
  ...overrides,
});

export const makeCriterion = (
  overrides: Partial<TestCriterion> = {},
): TestCriterion => ({
  id: "criterion-1",
  name: "Technical Implementation",
  ...overrides,
});
```

**ทำอะไร:** สร้างข้อมูลตัวอย่างมาตรฐานและเปลี่ยนเฉพาะค่าที่ test นั้นต้องการด้วย `overrides`

**ทำไม:** ช่วยให้ test อ่านง่าย ลดการเขียนข้อมูลซ้ำ และทำให้แต่ละ test เน้นเฉพาะ business rule ที่กำลังพิสูจน์

ตอน Demo พูดว่า:

> “Factories ทำให้แต่ละ test เริ่มจากข้อมูลมาตรฐานเดียวกัน แล้ว override เฉพาะเงื่อนไขที่ต้องการทดสอบ จึงลดความซ้ำซ้อนและอ่าน intent ของ test ได้ชัดเจน”

```python
# tests/conftest.py
import pytest
from tests.factories import make_room, make_user
from tests.fakes.fake_room_repo import FakeRoomRepo

@pytest.fixture
def available_room():
    return make_room(is_available=True)

@pytest.fixture
def unavailable_room():
    return make_room(is_available=False)

@pytest.fixture
def student():
    return make_user(role="student")
```

ไม่จำเป็นครับ `conftest.py` เป็น convention ของ Python + pytest เท่านั้น
โปรเจกต์เราคือ TypeScript + Vitest จึงใช้:

- `tests/factories.ts` — สร้าง test data ซ้ำได้
- `tests/fakes/` — fake repository
- `tests/unit/` — unit tests
- `tests/setup.ts` — ใช้เฉพาะเมื่อภายหลังมี global setup เช่น reset mock ก่อนทุก test

สำหรับ Lab นี้ factories ที่เราสร้างไว้แล้ว 4 ตัวถือว่าผ่านเกณฑ์ “มี factories หรือ fixtures อย่างน้อย 2 ตัว” ดังนั้นยังไม่ต้องสร้าง `tests/setup.ts`

ตอน Demo พูดว่า:

> “ตัวอย่าง conftest เป็นของ pytest แต่โปรเจกต์นี้ใช้ Vitest จึงใช้ factories และ fake repository เป็น test harness ที่เทียบเท่ากัน”


### ขั้นตอนที่ 5 — เขียน Unit Tests (20 นาที)
สร้าง “skeleton” ของ PairingService ก่อนเขียน test

เนื่องจาก baseline เป็นหน้า UI และยังไม่มี domain service เราจะใช้แนวคิด TDD: สร้าง contract ให้ test import ได้ก่อน จากนั้นเขียน test ให้แดง แล้วจึงใส่ logic ให้เขียว

สร้างไฟล์ `src/services/pairing-service.ts`:

```typescript
import type {
  PairAssignment,
  PairAssignmentRepository,
} from "../repositories/pair-assignment-repository";

export type Group = {
  id: string;
};

export type Student = {
  id: string;
  groupId: string;
};

export type Criterion = {
  id: string;
  name: string;
};

export type PairingRequest = {
  assignmentId: string;
  groups: Group[];
  criteria: Criterion[];
  evaluators: Student[];
};
export class PairingRuleError extends Error {}
```

ส่วนนี้ยังไม่มี logic ครับ เป็นการบอก TypeScript ว่า PairingService รับข้อมูลอะไรบ้าง และใช้ error ชนิดใดเมื่อผิด business rule
ฟังก์ชันถัดไปคือ `constructor` ของ `PairingService`

```typescript
export class PairingService {
  constructor(private readonly repository: PairAssignmentRepository) {}
}
```

**ทำอะไร:** รับ repository เข้ามาเก็บไว้ใน service

**ทำไม:** ตอนใช้งานจริง service จะรับ repository ที่ต่อ database แต่ตอน test เราส่ง `FakePairAssignmentRepository` เข้าไปแทนได้ โดยไม่เปลี่ยน logic ของ service

ตอน Demo พูดว่า:

> “PairingService รับ repository ผ่าน constructor ทำให้เปลี่ยนจาก database จริงเป็น fake repository ใน unit test ได้ง่าย”

ต่อไปเราจะเพิ่มฟังก์ชันหลัก `generatePairAssignments()` และให้มันแดงก่อนตาม TDD

```typescript
  generatePairAssignments(
    _request: PairingRequest,
  ): PairAssignment[] {
    throw new Error("Not implemented");
  }
```

**ทำอะไร:** สร้าง public function หลักที่รับข้อมูลการจับคู่ และมีหน้าที่คืน `PairAssignment[]`

**ทำไม:** ตอนนี้ตั้งใจให้มัน throw error ก่อน เพื่อให้เราสร้าง unit test ที่แดง แล้วค่อยเขียน logic ให้ test เขียวตาม TDD

`_request` มี `_` นำหน้าเพื่อบอกว่า parameter ยังไม่ถูกใช้ในช่วง skeleton จึงไม่เกิด lint warning

ตอน Demo พูดว่า:

> “ผมสร้าง contract ของฟังก์ชันก่อน แล้วเริ่มจาก test ที่ fail เพื่อให้ implementation ถูกขับเคลื่อนด้วย business rule”

 ต่อไปเราจะเขียน unit test ตัวที่ 1 ด้วยตัวเอง: “น้อยกว่า 3 กลุ่มต้องถูกปฏิเสธ”
สำหรับ PairEval เราจะให้คุณเขียนเอง 2 ตัวนี้:

1. `rejects pairing when there are fewer than three groups`
    - ตรวจ rule: ต้องมีอย่างน้อย 3 กลุ่มจึงสร้าง pair ได้
สร้างไฟล์:
```typescript
tests/unit/pairing-service.test.ts
```

เขียน test ตัวแรกให้แล้วที่ [pairing-service.test.ts](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03/tests/unit/pairing-service.test.ts)

ผล `npm test` แดงตามที่ควรเป็น:

```
Expected: PairingRuleError
Received: Error("Not implemented")
```

นี่คือ TDD ขั้น Red: test บอกชัดว่าระบบยังไม่ enforce กฎ “ต้องมีอย่างน้อย 3 กลุ่ม” อยู่

จุดสำคัญของ test นี้คือ:

- สร้างเพียง 2 กลุ่ม
- เรียก `generatePairAssignments()`
- คาดหวัง `PairingRuleError`
- ตอนนี้ service ยัง throw error ทั่วไป จึงแดง

ตอน Demo พูดว่า:

> “ผมเริ่มด้วย test ที่ fail เพื่อระบุ expected behavior ก่อน จากนั้นจะเขียน business logic ให้น้อยที่สุดจน test ผ่าน”

test ระบุว่า “ต้องได้ `PairingRuleError`” แต่โค้ดปัจจุบันยัง throw `Error("Not implemented")` ทั่วไปอยู่

ขั้นต่อไป: แก้ฟังก์ชัน `generatePairAssignments()` ใน [pairing-service.ts](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03/src/services/pairing-service.ts) เป็นนี้:

```
  generatePairAssignments(
    request: PairingRequest,
  ): PairAssignment[] {
    if (request.groups.length < 3) {
      throw new PairingRuleError(
        "Pair generation requires at least three groups.",
      );
    }

    return [];
  }
```

**ทำอะไร:** ตรวจจำนวนกลุ่มก่อนทำงาน และ throw error เฉพาะของ business rule เมื่อมีน้อยกว่า 3 กลุ่ม

**ทำไม:** validation ต้องอยู่ที่ service เพื่อให้ server เป็นผู้บังคับกฎ ไม่ว่าผู้ใช้จะเรียกจาก UI หรือ API

จากนั้นรัน:

```
npm test
```

ผลที่ควรได้: `pairing-service.test.ts` เขียวทั้งหมดครับ

```bash
 RUN  v5.0.0 E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03

 ✓ sample.test.ts (1 test) 3ms
 ✓ tests/unit/pairing-service.test.ts (1 test) 3ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  19:35:44
   Duration  174ms (transform 56%, import 29%, worker 8%, tests 6%)

```


2. `never assigns a student to a pair containing their own group`
    - ตรวจ rule สำคัญที่สุด: ห้าม self-evaluation
ในไฟล์ `tests/unit/pairing-service.test.ts` ให้เพิ่มโค้ดนี้ภายใน `describe(...)` และวางต่อจาก test แรก:
```typescript
  it("never assigns a student to a pair containing their own group", () => {
    const repository = new FakePairAssignmentRepository();
    const service = new PairingService(repository);
    const assignment = makeAssignment();
    const groups = [
      makeGroup({ id: "group-a" }),
      makeGroup({ id: "group-b" }),
      makeGroup({ id: "group-c" }),
    ];
    const evaluators = [
      makeStudent({ id: "student-a", groupId: "group-a" }),
      makeStudent({ id: "student-b", groupId: "group-b" }),
      makeStudent({ id: "student-c", groupId: "group-c" }),
    ];

    const assignments = service.generatePairAssignments({
      assignmentId: assignment.id,
      groups,
      criteria: [makeCriterion()],
      evaluators,
    });

    const evaluatorGroupByStudentId = new Map(
      evaluators.map((student) => [student.id, student.groupId]),
    );

    expect(assignments).toHaveLength(3);

    for (const assignment of assignments) {
      const evaluatorGroupId = evaluatorGroupByStudentId.get(
        assignment.evaluatorStudentId,
      );

      expect([assignment.groupAId, assignment.groupBId]).not.toContain(
        evaluatorGroupId,
      );
    }
  });
```

ทำไมต้องมี `expect(assignments).toHaveLength(3)`: ป้องกัน test หลอก เพราะถ้า service คืน `[]` วง `for` จะไม่ทำงาน และ test อาจเขียวทั้งที่ไม่ได้สร้าง pair เลย

รัน `npm test` แล้ว test ใหม่นี้ควรแดง เพราะ service ยังคืน `[]` สำหรับกรณี valid ครับ

```
 FAIL  tests/unit/pairing-service.test.ts > never assigns a student to a pair containing their own group
AssertionError: expected [] to have a length of 3 but got +0

- Expected
+ Received

- 3
+ 0

 ❯ tests/unit/pairing-service.test.ts:65:25
     63|     );
     64|
     65|     expect(assignments).toHaveLength(3);
       |                         ^
     66|
     67|     for (const assignment of assignments) {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 2 passed (3)
   Start at  19:42:59
   Duration  174ms (transform 55%, import 26%, tests 10%, worker 9%)

```

นี่คือ Red รอบที่ 2: service ยังไม่สร้าง pair จึงได้ `0` แทน `3`

ใน `generatePairAssignments()` ให้แทนที่บรรทัดนี้:

```
    return [];
```

ด้วยโค้ดนี้:

```typescript
    const assignments: PairAssignment[] = [];

    for (const criterion of request.criteria) {
      for (let firstIndex = 0; firstIndex < request.groups.length; firstIndex++) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < request.groups.length;
          secondIndex++
        ) {
          const groupA = request.groups[firstIndex];
          const groupB = request.groups[secondIndex];

          const evaluator = request.evaluators.find(
            (student) =>
              student.groupId !== groupA.id &&
              student.groupId !== groupB.id,
          );

          if (!evaluator) {
            throw new PairingRuleError(
              "No eligible evaluator exists for this pair.",
            );
          }

          assignments.push({
            assignmentId: request.assignmentId,
            criterionId: criterion.id,
            evaluatorStudentId: evaluator.id,
            groupAId: groupA.id,
            groupBId: groupB.id,
          });
        }
      }
    }

    return this.repository.saveMany(assignments);
```

ทำอะไร:

- loop สร้าง pair ทุกคู่ของกลุ่ม
- สำหรับ 3 กลุ่ม จะได้ 3 คู่: A–B, A–C, B–C
- เลือก evaluator ที่ไม่ได้อยู่ Group A หรือ Group B
- บันทึกผ่าน fake repository แล้วคืนผล

ทำไม: เงื่อนไข `student.groupId !== groupA.id && student.groupId !== groupB.id` คือ implementation ตรงของ business rule “ห้าม self-evaluation”

จากนั้นรัน:

```
npm test
```

```bash
E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03>npm test

> pairwise-eval@0.1.0 test
> vitest run


 RUN  v5.0.0 E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03

 ✓ sample.test.ts (1 test) 2ms
 ✓ tests/unit/pairing-service.test.ts (2 tests) 4ms

 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  19:45:34
   Duration  175ms (transform 56%, import 29%, worker 8%, tests 7%)
```

ตอนนี้ test 2 ควรเขียวครับ

หลังจากคุณเขียนและอธิบายได้ 2 ตัวนี้แล้ว ค่อยใช้ AI ช่วยร่าง test ที่เหลือ เช่น:
- สร้าง pairs แยกตาม criterion
- ห้ามสร้าง pair ซ้ำใน assignment เดิม

แต่ก่อนรับ test จาก AI ต้องตรวจทุก test ด้วยคำถามนี้:

1. Test นี้ปกป้อง business rule ข้อใดใน `TEST_PLAN.md`?
2. ถ้าลบ logic ของ rule นั้นออก test นี้จะแดงไหม?

**เมื่อ 2 tests แรกเขียวแล้ว ให้ใช้ prompt นี้แทน:**

```
Read TEST_PLAN.md, tests/factories.ts,
tests/fakes/fake-pair-assignment-repository.ts, and
src/services/pairing-service.ts first.

Write only the remaining unit tests for
PairingService.generatePairAssignments():

- creates pair assignments separately for each criterion
- rejects duplicate pair generation for the same assignment

Rules:
- Reuse existing factories and FakePairAssignmentRepository.
- Do not change the two existing tests.
- Each test name must state the business rule it protects.
- A test must fail if its specific business-rule logic is removed.
- Do not test private methods, constructor-only behavior, or internal call order.
- Run npm test.
- If a test fails because business logic is missing, fix source code, not the test.
```

หลัง AI สร้างแต่ละ test เราจะตรวจ:

1. มันวัดกฎข้อไหนใน `TEST_PLAN.md`?
2. ถ้าลบ logic ของกฎนั้นออก test แดงหรือไม่?

เก็บ review เรียบร้อย และยืนยันผ่านทั้ง test กับ lint

- `npm test`: 5 tests ผ่านใน 222ms
- `npm run lint`: ผ่าน
- แก้เฉพาะ Lab 03 copy ไม่กระทบ PairEval/KoenControl หลัก

สรุปการเปลี่ยนแปลง:

- [pairing-service.ts](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03/src/services/pairing-service.ts)
    - ลบ skeleton/comment เก่าและจัด format
    - บังคับอย่างน้อย 3 กลุ่ม
    - ห้ามสร้าง pair ซ้ำใน assignment เดิม
    - สร้าง pair แยกตาม criterion
    - เลือก evaluator ที่ไม่ได้อยู่ในทั้งสองกลุ่มของ pair
- [pairing-service.test.ts](</E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03/tests/unit/pairing-service.test.ts)
    - ย้าย self-evaluation test เข้า `describe` เดียวกัน
    - เพิ่มการตรวจว่าแต่ละ criterion มี 3 คู่ที่ “ไม่ซ้ำ” จริง ไม่ใช่แค่จำนวนครบ
    - ครอบคลุม 4 rules: ต้องมี 3 กลุ่ม, pair แยกตาม criterion, ห้าม self-evaluation, ห้ามสร้างซ้ำ

ตอน Demo สรุปได้ว่า:

> “ผมสร้าง test harness ที่มี factory และ fake repository แล้วใช้ unit test ปกป้อง business rules สำคัญของ PairingService ทั้ง 4 ข้อ โดย test suite ผ่านในประมาณ 0.22 วินาที”

### ขั้นตอนที่ 6 — วัด Fidelity ของ Harness (บังคับ, ~5 นาที)
**Fidelity Check** หรือพิสูจน์ว่า test ไม่ใช่ zombie test

เราจะทดลองทำลายกฎ “ห้าม self-evaluation” ชั่วคราว แล้วดูว่า test แดงจริงหรือไม่

ใน `src/services/pairing-service.ts` หาโค้ดนี้:

```
(student) =>
  student.groupId !== groupA.id && student.groupId !== groupB.id,
```

แก้ชั่วคราวเป็น:

```
(student) => student.groupId !== groupB.id,
```

จากนั้นรัน:

```bash
npm test

 RUN  v5.0.0 E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03

 ✓ sample.test.ts (1 test) 3ms
 ❯ tests/unit/pairing-service.test.ts (4 tests | 1 failed) 9ms
   ❯ PairingService.generatePairAssignments (4)
     ✓ rejects pairing when there are fewer than three groups 2ms
     ✓ creates pair assignments separately for each criterion 1ms
     ✓ rejects duplicate pair generation for the same assignment 0ms
     × never assigns a student to a pair containing their own group 4ms
```

ผลที่ต้องเกิด: test นี้ต้องแดง

```
never assigns a student to a pair containing their own group
```

**ทำไม:** เราจงใจลบเงื่อนไขที่ป้องกัน student จาก Group A เพื่อพิสูจน์ว่า test จับ regression ได้จริง

เห็น test แดงแล้ว ให้ Undo ทันที (`Ctrl+Z`) เพื่อคืนเป็น:

```
(student) =>
  student.groupId !== groupA.id && student.groupId !== groupB.id,
```

แล้วรัน `npm test` อีกครั้ง ต้องกลับมาเขียวทั้งหมด

ตอน Demo พูดว่า:

> “ผมทำ fidelity check โดยลบเงื่อนไขป้องกัน self-evaluation ชั่วคราว ผลคือ unit test แดง จึงพิสูจน์ได้ว่า test นี้ปกป้อง business rule จริง”

ส่งผล test ที่แดงมาได้เลยครับ แล้วผมจะพาเพิ่มบันทึก Fidelity Check ลง `TEST_PLAN.md` ต่อครับ

บันทึกผลลง `TEST_PLAN.md`:
```markdown
## Fidelity Check (WS-03)

- ลบกฎชั่วคราว: evaluator ต้องไม่อยู่ใน Group A หรือ Group B ของ pair
- Test ที่แดง: `never assigns a student to a pair containing their own group`
- ผล: ✅ test harness ปกป้องกฎ self-evaluation ได้จริง
```

**ถ้าเหลือเวลา:** ลองรัน mutation testing แล้วจดคะแนน
```bash
mutmut run          # Python
npx stryker run     # JS/TS
```

**ทำไมต้องบันทึก:** นี่คือหลักฐานว่า test ไม่ได้เขียวแบบไร้ความหมาย และใช้เป็น safety net ได้เมื่อทีม refactor โค้ดในอนาคต


---
## Part B: E2E ตัวแรก (30 นาที)

### ขั้นตอนที่ 7 — First E2E Test ด้วย Playwright

Step 1: ตั้งค่า Playwright ให้เปิด PairEval local app อัตโนมัติ

ตั้ง `baseURL` ใน `playwright.config.ts` เพื่อให้ `page.goto('/')` ใช้ได้:
ตั้งค่า Playwright ให้เปิด PairEval local app อัตโนมัติ
แทนที่เนื้อหาใน `playwright.config.ts` ด้วย:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  reporter: "html",

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**ทำอะไร:** ตั้งให้ Playwright รันเฉพาะ `tests/e2e`, เปิด Next.js dev server เอง และให้ `page.goto("/")` ชี้ไปที่ PairEval

**ทำไม:** E2E test ต้องเปิดเว็บจริง ไม่ใช่เว็บไซต์ตัวอย่างของ Playwright และการจำกัด Chromium ทำให้ smoke test รันเร็ว

ตอน Demo พูดว่า:

> “Playwright config เริ่ม local application อัตโนมัติ และกำหนด base URL ทำให้ E2E test เขียนจากมุมมองผู้ใช้ด้วย `page.goto('/')` ได้”


**Step 2:** แทน Playwright sample ด้วย smoke test ของ PairEval

เปลี่ยนชื่อไฟล์:

```
Rename-Item tests/e2e/example.spec.ts smoke.spec.ts
```

จากนั้นแทนที่เนื้อหาใน `tests/e2e/smoke.spec.ts` ด้วย:

```typescript
import { expect, test } from "@playwright/test";

test("homepage loads and student can save a selected pair as draft", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/PairEval/);
  await expect(page.getByRole("navigation")).toBeVisible();

  await page.getByTestId("candidate-a-card").click();
  await expect(page.getByTestId("save-draft-btn")).toBeEnabled();

  await page.getByTestId("save-draft-btn").click();
  await expect(page.getByText("Draft Saved")).toBeVisible();
});
```

**ทำอะไร:** ตรวจ flow สำคัญของผู้ใช้ตั้งแต่เปิดหน้าเว็บ → เลือก Group A → กด Save Draft → เห็นสถานะบันทึกสำเร็จ

**ทำไม:** นี่คือ smoke test ที่ยืนยันว่า UI หลักและ interaction สำคัญยังไม่ล่มหลัง deploy หรือแก้โค้ด

ตอน Demo พูดว่า:

> “E2E smoke test เปิดหน้า PairEval จริง ตรวจ title กับ navigation แล้วจำลองผู้ใช้เลือกคู่และบันทึก draft จนเห็น feedback ว่าสำเร็จ”

ไฟล์เดิมของ Playwright ชี้ไปที่เว็บไซต์ภายนอก จึงต้องแทนที่ด้วย test ของ PairEval ครับ

**Step 3:** รัน E2E smoke test
ใน Terminal ของ `koencontrol-lab-03` รัน:

```
npx playwright test --project=chromium
```

ทำอะไร: Playwright จะเปิด Next.js local server อัตโนมัติ, เปิด Chromium และรัน flow ผู้ใช้ใน `smoke.spec.ts`

ผลที่ควรได้:

```
1 passed
```

หากผ่าน ให้เปิดรายงานภาพสำหรับใช้เดโม:

```
npx playwright show-report
```

ทำไม: HTML report แสดงหลักฐานว่าการทดสอบทำงานใน browser จริง และมี trace ให้ตรวจหาก test ล้ม

ตอน Demo พูดว่า:

> “ผมรัน smoke test บน Chromium ผ่าน Playwright โดย test ผ่านครบ 1 flow และสามารถเปิด HTML report เป็นหลักฐานการทดสอบได้”

ตัวอย่างผลลัพธ์:

```
E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03>npx playwright test --project=chromium

Running 1 test using 1 worker
  1 passed (1.1s)

To open last HTML report run:

  npx playwright show-report

```

#### เพิ่ม `data-testid` ใน Components
```tsx
<button data-testid="submit-booking">Book Now</button>
<nav data-testid="main-nav">...</nav>
<div data-testid="room-list">...</div>
```

> ลำดับที่แนะนำในการเลือก element: `getByRole` → `getByLabel` → `getByTestId`
> role/label สะท้อนสิ่งที่ user เห็นจริงและได้ accessibility ไปด้วย
> ใช้ `getByTestId` เมื่อไม่มี role/label ที่เสถียรพอ

#### รัน E2E Test
```bash
npx playwright test
npx playwright show-report   # เปิด HTML report
```

### ขั้นตอนที่ 8 — ตั้งค่าและสร้าง Coverage Report

แก้ `vitest.config.mts` ให้เป็นแบบนี้:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "tests/e2e/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "docs/coverage",
      include: ["src/services/**/*.ts"],
    },
  },
});
```

**ทำอะไร:** ใช้ V8 วัดว่า unit tests ครอบคลุม logic ใน `src/services/` กี่เปอร์เซ็นต์ และสร้าง HTML report ใน `docs/coverage/`

**ทำไม:** เราวัดเฉพาะ domain service ที่ unit test รับผิดชอบ ไม่ปนหน้า UI ซึ่งถูกตรวจโดย E2E แล้ว

จากนั้นเพิ่ม script นี้ใน `package.json` ภายใต้ `scripts`:

```
"test:coverage": "vitest run --coverage"
```

แล้วรัน:

```
npm run test:coverage
 RUN  v5.0.0 E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03
      Coverage enabled with v8

 ✓ sample.test.ts (1 test) 3ms
 ✓ tests/unit/pairing-service.test.ts (4 tests) 6ms

 Test Files  2 passed (2)
      Tests  5 passed (5)
   Start at  20:38:21
   Duration  236ms (transform 45%, import 24%, worker 24%, tests 7%)

 % Coverage report from v8
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   94.73 |     87.5 |     100 |   94.44 |
 pairing-service.ts |   94.73 |     87.5 |     100 |   94.44 | 63
--------------------|---------|----------|---------|---------|-------------------

E:\CEPP Project\หลักศูตร\KMITL_Knowledge\SDPX\SPDX-Lab\AI-03\koencontrol-lab-03>
```

ผลที่ต้องดู:

- Unit tests ผ่านทั้งหมด
- Terminal แสดงตาราง coverage
- มีโฟลเดอร์ `docs/coverage/` พร้อม `index.html`

ตอน Demo พูดว่า:

> “ผมสร้าง coverage report ด้วย V8 สำหรับ domain service ที่ unit test รับผิดชอบ และเก็บ HTML report ไว้ใน docs/coverage เป็น artifact ของ Lab”

Coverage artifact เสร็จแล้ว และเพิ่ม Fidelity Check ลง [TEST_PLAN.md](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03/TEST_PLAN.md) ให้ครบตาม Lab

สถานะ Lab 03 ตอนนี้ครบเกณฑ์แล้ว:

- Unit tests: 5/5 ผ่าน, ประมาณ 0.2 วินาที
- Fake repository: มี
- Factories: มี 4 ตัว
- Fidelity Check: ทำแล้วและบันทึกแล้ว
- Coverage: 94.73% และมี [HTML report](E:/CEPP Project/หลักศูตร/KMITL_Knowledge/SDPX/SPDX-Lab/AI-03/koencontrol-lab-03/docs/coverage/index.html)
- E2E smoke test: ผ่านบน Chromium

ขั้นตอนต่อไปคือซ้อม Demo ตามลำดับนี้:

```
npm test
npm run test:coverage
npx playwright test --project=chromium
npx playwright show-report
```

สคริปต์พูดสั้น ๆ:

> “ผมเริ่มจาก Test Plan ที่ trace business rules ของ PairEval แล้วสร้าง test harness ด้วย factories และ fake repository. Unit tests ปกป้องกฎจำนวนกลุ่มขั้นต่ำ, การสร้าง pair ต่อ criterion, การห้าม self-evaluation และการห้ามสร้างซ้ำ. ผมทำ fidelity check โดยลบกฎ self-evaluation ชั่วคราว แล้ว test แดงจริง. Coverage ของ PairingService คือ 94.73% และ E2E smoke test ยืนยันว่า user เปิดหน้าเว็บ เลือก pair และ Save Draft ได้บน Chromium”

---

## Artifacts ที่ต้องส่ง

| Artifact                  | รายละเอียด                                            | ที่ส่ง                       |
| ------------------------- | ----------------------------------------------------- | ---------------------------- |
| `tests/` directory        | Unit tests พร้อม fakes, fixtures, factories           | GitHub repo                  |
| `TEST_PLAN.md`            | รายการ business rule ที่ต้อง test + ผล fidelity check | GitHub repo                  |
| `tests/e2e/smoke.spec.ts` | E2E smoke test ผ่าน                                   | GitHub repo                  |
| Coverage report           | `pytest --cov` หรือ `vitest run --coverage`           | GitHub repo `docs/coverage/` |

### เกณฑ์ผ่าน
- [x] Unit tests รันผ่านทั้งหมด และ **ทั้ง suite ใช้เวลา < 10 วินาที**
- [x] มี fake repository อย่างน้อย 1 ตัว
- [x] มี factories หรือ fixtures อย่างน้อย 2 ตัว
- [x] ทำ fidelity check แล้ว และบันทึกผลใน `TEST_PLAN.md`
- [x] E2E smoke test รันผ่าน
- [x] ทุกคนในกลุ่มอธิบาย test ที่ตัวเองเขียนได้ และตอบได้ว่า "ลบอะไรออกแล้วมันจะแดง"
