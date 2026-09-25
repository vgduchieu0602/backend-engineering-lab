# Scope

## 1. Problem

Một variable không phải lúc nào cũng có thể được truy cập từ mọi vị trí trong chương trình.

```js id="rm5y37"
function greet() {
  const message = "Hello";

  console.log(message);
}

greet();

console.log(message);
```

Bên trong function:

```js id="70nj96"
console.log(message);
```

có thể truy cập `message`.

Nhưng bên ngoài:

```js id="fpt1x6"
console.log(message);
```

không thể truy cập variable đó.

Đây là vấn đề mà scope giải thích.

---

## 2. Definition

Scope xác định:

> Vùng nào trong code có thể truy cập một variable.

Scope trả lời câu hỏi:

```text id="fsr6rv"
Variable
   ↓
accessible WHERE?
```

Scope không nói variable chứa value gì.

---

## 3. Function Scope

Variable được khai báo bên trong function thuộc phạm vi của function đó.

```js id="yrw7me"
function calculatePrice() {
  const price = 100;

  console.log(price);
}
```

`price` accessible bên trong function.

```js id="7bgm53"
console.log(price);
```

ở ngoài function không thể truy cập `price`.

Mental model:

```text id="4g1uz6"
calculatePrice scope

┌──────────────────┐
│ price = 100      │
│                  │
│ accessible       │
└──────────────────┘
```

---

## 4. Parameters và Function Scope

Parameter cũng là variable được sử dụng bên trong function.

```js id="l16hcl"
function calculatePrice(price, quantity) {
  return price * quantity;
}
```

`price` và `quantity` accessible trong function.

```text id="ihb87e"
calculatePrice
┌─────────────────────┐
│ price               │
│ quantity            │
│                     │
│ return price * ...  │
└─────────────────────┘
```

Bên ngoài function không thể trực tiếp truy cập hai parameters này.

---

## 5. Different Functions Have Different Scopes

```js id="zlytb8"
function createPlant() {
  const status = "created";

  console.log(status);
}

function deletePlant() {
  const status = "deleted";

  console.log(status);
}
```

Hai `status` không phải cùng một variable.

```text id="gmdk8k"
createPlant
┌────────────────────┐
│ status = "created" │
└────────────────────┘


deletePlant
┌────────────────────┐
│ status = "deleted" │
└────────────────────┘
```

Chúng thuộc hai function scopes khác nhau.

---

## 6. Block Scope

Một block:

```js id="avpkmd"
{
  // code
}
```

có thể tạo scope cho `let` và `const`.

Ví dụ:

```js id="4dmwqf"
{
  const message = "Hello";

  console.log(message);
}

console.log(message);
```

Dòng bên trong truy cập được `message`.

Dòng bên ngoài không truy cập được.

Mental model:

```text id="bf3wvg"
BLOCK

┌─────────────────────┐
│ message             │
│                     │
│ accessible          │
└─────────────────────┘

outside
→ message inaccessible
```

Ở mức hiện tại:

```text id="5xj1ws"
let   → block scoped
const → block scoped
```

---

## 7. Nested Scopes

Scopes có thể nằm bên trong nhau.

```js id="7iy5js"
const a = "A";

function test() {
  const b = "B";

  {
    const c = "C";

    console.log(a);
    console.log(b);
    console.log(c);
  }
}
```

Mental model:

```text id="0mkwbp"
Outer
┌────────────────────────────┐
│ a                          │
│                            │
│ Function                   │
│ ┌────────────────────────┐ │
│ │ b                      │ │
│ │                        │ │
│ │ Block                  │ │
│ │ ┌────────────────────┐ │ │
│ │ │ c                  │ │ │
│ │ └────────────────────┘ │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

---

## 8. Variable Lookup

Khi JavaScript cần một variable, mental model cơ bản là:

```text id="e0j0xz"
CURRENT SCOPE
      │
      │ not found
      ▼
OUTER SCOPE
      │
      │ not found
      ▼
NEXT OUTER SCOPE
      │
     ...
```

Khi tìm thấy:

```text id="m2kfc4"
FOUND
  ↓
use that variable
  ↓
STOP
```

JavaScript không tiếp tục tìm một variable cùng tên ở outer scope nếu đã tìm thấy ở current scope.

---

## 9. Same Variable Name in Different Scopes

```js id="a1mb26"
const status = "outside";

function checkStatus() {
  const status = "inside";

  console.log(status);
}

checkStatus();

console.log(status);
```

Output:

```text id="c13rjs"
inside
outside
```

Bên trong function:

```text id="btsrlk"
current function scope
      ↓
status found
      ↓
"inside"
      ↓
STOP
```

Variable `status` bên ngoài không được sử dụng cho dòng đó.

---

## 10. Inner Scope Can Look Outward

```js id="v38lqa"
const appName = "Plant Care";

function showName() {
  console.log(appName);
}
```

Function không có `appName` trong current scope.

Mental model:

```text id="dyl69r"
function scope
     ↓
appName?
     ↓ NO

outer scope
     ↓
appName?
     ↓ YES

"Plant Care"
```

---

## 11. Outer Scope Cannot Look Into Inner Scope

```js id="p3ec6r"
function test() {
  const secret = "hello";
}

console.log(secret);
```

Outer code không thể đi vào function scope để tìm `secret`.

Lookup đi:

```text id="7tr3xi"
current
   ↓
outer
   ↓
outer...
```

Không đi:

```text id="jjnzw1"
outer
  ↓
inner
```

---

## 12. undefined vs Not Defined

Hai trường hợp khác nhau.

### Variable tồn tại

```js id="qv94e1"
let age;

console.log(age);
```

Output:

```text id="vhsgdk"
undefined
```

`age` tồn tại và accessible.

Value hiện tại là `undefined`.

### Variable không tìm thấy

```js id="v8e88q"
console.log(age);
```

nếu không có `age` accessible:

```text id="5nlwhp"
ReferenceError: age is not defined
```

Mental model:

```text id="zzgh84"
VARIABLE EXISTS
      ↓
value = undefined


VARIABLE NOT FOUND
      ↓
ReferenceError
```

---

## 13. Function Declaration vs Execution

Scope reasoning cũng phải kết hợp với execution order.

```js id="6c4hjz"
const value = "global";

function test() {
  const value = "function";

  console.log(value);
}

console.log(value);

test();
```

Function declaration không execute function body.

Execution:

```text id="t9qk3v"
declare value
      ↓
declare test
      ↓
console.log(value)
      ↓
"global"
      ↓
test()
      ↓
execute function
      ↓
"function"
```

Output:

```text id="h85rnt"
global
function
```

---

## 14. Mental Model

```text id="bnp0qg"
SCOPE
│
├── Function scope
│
└── Block scope
```

Variable lookup:

```text id="o0w20s"
Need variable
     ↓
Current scope
     ↓
Found?
├── YES → use → STOP
│
└── NO
     ↓
Outer scope
     ↓
Found?
├── YES → use → STOP
│
└── NO → continue outward
```

---

## 15. Common Misconceptions

### Not accessible means undefined

Không.

```text id="xymtzb"
variable exists with undefined value
≠
variable cannot be found
```

### Outer scope can access everything inside

Không.

Inner scope có thể lookup outward.

Outer scope không lookup vào inner scope.

### Same name means same variable

Không.

```js id="ve0bqe"
const value = "outer";

function test() {
  const value = "inner";
}
```

Đây là hai variables thuộc hai scopes khác nhau.

### Function declaration executes the function

Không.

Function body chạy khi function được gọi.

---

## 16. Must Know

Sau bài này cần giải thích được:

* Scope là gì.
* Scope giải quyết vấn đề gì.
* Function scope.
* Block scope.
* Parameter thuộc function scope.
* Nested scopes.
* Variable lookup từ current scope ra outer scope.
* Lookup dừng khi tìm thấy variable.
* Inner scope có thể lookup outward.
* Outer scope không lookup vào inner scope.
* Hai variables cùng tên có thể thuộc hai scopes khác nhau.
* `undefined` khác `ReferenceError: x is not defined`.
* Execution order ảnh hưởng tới việc reasoning output.
