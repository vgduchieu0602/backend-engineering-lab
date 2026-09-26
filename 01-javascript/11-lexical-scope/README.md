# Lexical Scope

## 1. Problem

Từ Scope, ta biết JavaScript có thể tìm variable từ current scope ra outer scope.

Nhưng xuất hiện câu hỏi:

> JavaScript xác định outer scope của một function là scope nào?

Ví dụ:

```js
const name = "Global";

function outer() {
  const name = "Outer";

  function inner() {
    console.log(name);
  }

  inner();
}

outer();
```

`inner` không có variable `name`.

JavaScript phải xác định scope tiếp theo cần tìm là scope nào.

---

## 2. Definition

Lexical Scope nghĩa là:

> Quan hệ giữa các scope được xác định dựa trên vị trí code/function được định nghĩa.

Mental model:

```text
WHERE IS THE FUNCTION DEFINED?
            ↓
determines
            ↓
LEXICAL OUTER SCOPE
```

Nơi function được gọi không thay đổi lexical scope chain của function đó.

---

## 3. Basic Example

```js
const name = "Global";

function outer() {
  const name = "Outer";

  function inner() {
    console.log(name);
  }

  inner();
}

outer();
```

Code structure:

```text
Global
└── outer
      └── inner
```

Lexical scope chain:

```text
inner
  ↓
outer
  ↓
global
```

Khi `inner` tìm `name`:

```text
inner
↓
name không có

outer
↓
name = "Outer"

FOUND
↓
STOP
```

Output:

```text
Outer
```

---

## 4. Definition Location vs Call Location

Đây là distinction quan trọng nhất.

```js
const name = "Global";

function printName() {
  console.log(name);
}

function run() {
  const name = "Run";

  printName();
}

run();
```

`printName` được:

```text
DEFINED → global scope

CALLED  → inside run
```

Code structure:

```text
Global
├── printName
└── run
```

Không phải:

```text
Global
└── run
      └── printName
```

`run` gọi `printName`, nhưng `printName` không được định nghĩa trong `run`.

---

## 5. Variable Lookup

Khi `printName` cần `name`:

```text
printName scope
      ↓
name?
      ↓ NO

lexical outer scope
      ↓
global
      ↓
name?
      ↓ YES

"Global"
```

JavaScript không tìm:

```text
printName
   ↓
run
   ↓
global
```

chỉ vì `run` gọi `printName`.

---

## 6. Calling a Function Does Not Change Its Lexical Scope

Ví dụ:

```js
const value = "global";

function A() {
  console.log(value);
}

function B() {
  const value = "B";

  A();
}

B();
```

`A` được defined ở global.

Structure:

```text
Global
├── A
└── B
```

Lexical scope chain của A:

```text
A → Global
```

Do đó output:

```text
global
```

`B` gọi A nhưng scope của B không trở thành lexical outer scope của A.

---

## 7. Moving the Definition Changes the Scope Chain

So sánh:

```js
const value = "global";

function B() {
  const value = "B";

  function A() {
    console.log(value);
  }

  A();
}

B();
```

Bây giờ A được defined bên trong B.

Structure:

```text
Global
└── B
      └── A
```

Lexical scope chain:

```text
A
↓
B
↓
Global
```

Khi A tìm `value`:

```text
A
↓
not found

B
↓
value = "B"

FOUND
↓
STOP
```

Output:

```text
B
```

---

## 8. Scope Chain

Ví dụ nhiều tầng:

```js
const app = "Plant Care";

function processPlant() {
  const plant = "Rose";

  function analyze() {
    const status = "healthy";

    console.log(status);
    console.log(plant);
    console.log(app);
  }

  analyze();
}

processPlant();
```

Structure:

```text
Global
│
├── app
│
└── processPlant
      │
      ├── plant
      │
      └── analyze
            │
            └── status
```

Lexical scope chain của `analyze`:

```text
analyze
   ↓
processPlant
   ↓
global
```

---

## 9. Lookup Stops When Variable Is Found

Scope chain đầy đủ có thể là:

```text
level3
  ↓
level2
  ↓
level1
  ↓
global
```

Nhưng JavaScript không nhất thiết đi hết chain.

Ví dụ:

```js
const value = "global";

function level1() {
  const value = "level1";

  function level2() {
    function level3() {
      console.log(value);
    }

    level3();
  }

  level2();
}

level1();
```

Lookup:

```text
level3
↓
not found

level2
↓
not found

level1
↓
FOUND "level1"

STOP
```

Global `value` không được sử dụng.

---

## 10. Scope vs Lexical Scope

### Scope

Trả lời:

> Variable có thể được truy cập ở đâu?

```text
variable
   ↓
accessible WHERE?
```

### Lexical Scope

Trả lời:

> Outer scope tiếp theo của function là scope nào?

Mental model:

```text
function defined WHERE?
        ↓
lexical relationship
        ↓
scope chain
```

---

## 11. Mental Model

Khi gặp:

```js
function A() {
  console.log(x);
}
```

Đừng bắt đầu bằng câu hỏi:

```text
WHO CALLED A?
```

Hãy hỏi:

```text
WHERE WAS A DEFINED?
```

Sau đó dựng structure:

```text
Global
└── ...
    └── A
```

Từ đó suy ra:

```text
A
↓
lexical outer scope
↓
next outer scope
↓
...
```

Variable lookup:

```text
CURRENT SCOPE
      ↓
found?
├── YES → USE → STOP
│
└── NO
      ↓
LEXICAL OUTER SCOPE
      ↓
found?
├── YES → USE → STOP
│
└── NO
      ↓
continue outward
```

---

## 12. Common Misconceptions

### Function tìm variable ở nơi nó được gọi

Sai.

```text
call location
≠
lexical scope
```

### Function B gọi A thì B trở thành outer scope của A

Sai.

Chỉ việc gọi A không thay đổi lexical relationship của A.

### Scope chain luôn phải đi đến global

Sai.

Lookup dừng ngay khi tìm thấy variable.

### Cùng tên nghĩa là cùng variable

Sai.

Các scope khác nhau có thể có variables cùng tên.

JavaScript sử dụng variable đầu tiên tìm thấy trong quá trình lookup.

---

## 13. Must Know

Sau bài này cần giải thích được:

- Lexical Scope là gì.
- Scope và Lexical Scope khác nhau thế nào.
- Lexical scope phụ thuộc vào code structure.
- Function definition location quan trọng như thế nào.
- Function call location không thay đổi lexical scope chain.
- Cách dựng lexical scope chain.
- Cách lookup variable qua nhiều nested scopes.
- Lookup dừng khi tìm thấy variable.
- Tại sao hai đoạn code giống nhau về function call nhưng khác definition location có thể cho output khác nhau.

## Checkpoint

Final score:

```text
9/10 — PASS
```

Mental model:

```text
DEFINED WHERE?
      ↓
LEXICAL SCOPE CHAIN
      ↓
VARIABLE LOOKUP

CALLED WHERE?
      ↓
does not redefine lexical scope chain
```