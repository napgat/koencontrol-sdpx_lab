# Lab 04 — Prepared: เตรียมพร้อมก่อนเรียน E2E Testing

เอกสารนี้รวบรวมเฉพาะงานที่ต้องเตรียมให้พร้อมก่อนเริ่ม Lab 04

## ทำแล้วได้อะไร

| สิ่งที่จะทำได้ | ใช้ในงานจริงอย่างไร |
| --- | --- |
| ทำให้ UI มี role และ label ที่ test อ้างถึงได้ | ได้ accessibility ติดมาด้วย ซึ่งหลายองค์กรถือเป็นข้อบังคับตามกฎหมาย |
| เตรียม seed endpoint สำหรับตั้งต้น state ของ test | ระบบทดสอบที่ไม่มี state ตั้งต้นที่แน่นอนจะให้ผลที่เชื่อถือไม่ได้ |
| ใส่ guard ป้องกัน endpoint ทดสอบหลุดขึ้น production | Endpoint ที่ล้าง database ได้โดยไม่ต้อง login คือช่องโหว่ระดับร้ายแรง |
| ยืนยันว่า Docker ใช้งานได้ก่อนสัปดาห์หน้า | การเตรียมล่วงหน้าช่วยไม่ให้เสียเวลาของทั้งทีมในวันที่ต้องใช้จริง |

---

## งานที่ต้องทำก่อนเข้าห้อง

### 1. ติดตั้งและทดสอบ Docker Desktop

```bash
docker run hello-world
# ต้องเห็น "Hello from Docker!"

docker run --name test-db -e POSTGRES_PASSWORD=test -d postgres:17-alpine
docker ps
# ต้องเห็น container กำลังรัน

docker rm -f test-db
```

สิ่งที่ต้องตรวจจาก `docker ps`:

- `IMAGE` เป็น `postgres:17-alpine`
- `NAMES` เป็น `test-db`
- `STATUS` เป็น `Up ...`
- `PORTS` อาจว่างได้ เพราะยังไม่ได้เปิด port ออกนอก container

### 2. เพิ่ม Accessible Role และ `data-testid` ใน Components

ไปที่ frontend components ของ project แล้วทำสองอย่างต่อไปนี้

#### 2.1 ใช้ semantic HTML ให้ `getByRole` ทำงานได้

```tsx
<nav>...</nav>                        {/* role="navigation" */}
<button type="submit">Book Now</button>
<label htmlFor="date">Date</label>
<input id="date" name="date" />       {/* getByLabel('Date') ใช้ได้ */}
```

ตรวจ element ที่คลิกได้ว่าใช้ semantic element ที่เหมาะสม เช่น `<button>` แทน `<div>` และใช้สถานะ ARIA เมื่อจำเป็น

ตัวอย่างสำหรับ candidate card:

```tsx
<button
  type="button"
  data-testid="candidate-a-card"
  onClick={() => handleSelect("A")}
  aria-pressed={selectedWinner === "A"}
>
  ...
</button>
```

ใช้แนวทางเดียวกันกับ Candidate B เพื่อให้ทั้งสองตัวเลือกมี accessibility และ locator ที่สม่ำเสมอ

#### 2.2 เพิ่ม `data-testid` เฉพาะจุดที่ไม่มี role หรือ label ที่เสถียร

ตัวอย่างจุดที่เหมาะกับ `data-testid`:

- Error/success message container
- List item ที่ต้องอ้างถึงเป็นรายตัว เช่น `data-testid="room-card-1"`
- Element ที่ไม่มีข้อความคงที่

ตัวอย่าง success message:

```tsx
<span
  role="status"
  data-testid="success-msg"
  className="flex items-center gap-1.5 text-emerald-400 font-medium"
>
  ...
</span>
```

> อย่าใส่ `data-testid` ทุกที่ ถ้า element มี role ที่ชัดอยู่แล้ว การใช้ `getByRole`
> จะทำให้ test ช่วยตรวจจับ bug ด้าน accessibility ได้ด้วย

หลังแก้ component ให้ตรวจด้วยคำสั่งต่อไปนี้:

```bash
npm run lint
npx playwright test --project=chromium
```

### 3. เตรียม Seed Endpoint หากยังไม่มี

E2E ต้องเริ่มจาก state ที่รู้แน่ ให้เตรียม endpoint สำหรับ test:

```text
POST /api/test/seed      → ใส่ข้อมูลตัวอย่างชุดคงที่
POST /api/test/cleanup   → ล้างข้อมูลที่ seed ไว้
```

ทั้งสอง endpoint ต้องปิดใน production:

```typescript
if (process.env.NODE_ENV === "production") {
  return new Response("Not found", { status: 404 });
}
```

ทดสอบ endpoint ใน development:

```powershell
npm run dev
```

เปิด PowerShell อีกหน้าต่างหนึ่งแล้วรัน:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/test/seed
Invoke-RestMethod -Method Post http://localhost:3000/api/test/cleanup
```

ผลที่ต้องการจากแต่ละ endpoint คือ `success: true`

> หากลืม production guard บุคคลภายนอกอาจเรียก endpoint เพื่อล้าง database ผ่าน internet ได้
> ประเด็นนี้จะถูกถามในการ present และใน WS-08 เรื่อง security

---

## สิ่งที่เตรียมไว้จะถูกใช้ต่ออย่างไร

งานทุกชิ้นในหน้านี้เป็นวัตถุดิบของ Lab ไม่ใช่แบบฝึกหัดที่ทำแล้วทิ้ง โดยคาบเรียนเริ่มจากสมมติฐานว่าสิ่งเหล่านี้พร้อมแล้ว

| ผลงานจาก homework | ถูกใช้ต่อที่ | ถ้ายังไม่มี |
| --- | --- | --- |
| Docker Desktop ที่รันได้ | Lab ขั้นตอนที่ 2 และเป็นพื้นฐานทั้งหมดของ WS-05 | จะติดปัญหาหนักในสัปดาห์ถัดไป |
| Accessible role และ `data-testid` ใน component | Lab ขั้นตอนที่ 3–4: เขียน Page Object และ E2E | ต้องเขียน locator ที่ผูกกับโครงสร้าง HTML และ test จะ flaky ตั้งแต่ตัวแรก |
| Seed endpoint สำหรับเตรียมข้อมูลทดสอบ | Lab ขั้นตอนที่ 2: fixtures และ test isolation | Test แต่ละตัวจะแย่งข้อมูลกัน และผลจะเปลี่ยนตามลำดับการรัน |

> ถ้าทำไม่ทันข้อใด ให้แจ้งในห้านาทีแรกของคาบเพื่อจัดคู่ช่วยกันได้ทัน
> อย่าปล่อยให้ติดปัญหากลาง Lab เพราะจะกระทบทั้งกลุ่ม
