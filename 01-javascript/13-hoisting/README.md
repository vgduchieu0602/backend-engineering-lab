# JS-13 — Hoisting

## 1. Problem

JavaScript có một số behavior tưởng như code được sử dụng trước khi declaration xuất hiện.

Ví dụ:

```js
greet();

function greet() {
  console.log("Hello");
}
```

Output:

```text
Hello
```

Nhưng:

```js
console.log(age);

var age = 20;
```

Output:

```text
undefined
```

Trong khi:

```js
console.log(age);

let age = 20;
```

lại gây:

```text
ReferenceError
```

Hoisting giúp giải thích những behavior này.

---

# 2. Hoisting không có nghĩa code được di chuyển

Một mental model phổ biến:

```text
JavaScript đưa declaration lên đầu file
```

Cách nói này có thể giúp nhớ nhưng không chính xác.

Không nên hình dung JavaScript biến:

```js
greet();

function greet() {}
```

thành:

```js
function greet() {}

greet();
```

Mental model tốt hơn:

```text
Source Code
    ↓
Creation / Setup Phase
    ↓
Execution Phase
```

Trước khi execute code trong một scope, JavaScript thực hiện bước chuẩn bị các bindings cần thiết.

---

# 3. Creation Phase và Execution Phase

Mental model cơ bản:

```text
CREATION PHASE
      ↓
chuẩn bị scope / bindings
      ↓
EXECUTION PHASE
      ↓
thực thi code
```

Đây chỉ là mental model phục vụ bài Hoisting.

Execution Context sẽ được học sâu hơn ở phần JavaScript runtime sau.

---

# 4. Function Declaration Hoisting

```js
sayHello();

function sayHello() {
  console.log("Hello");
}
```

Trong Creation Phase:

```text
sayHello
    ↓
function value
```

Có thể hình dung:

```text
binding + function value
```

Sau đó Execution Phase chạy:

```js
sayHello();
```

Binding `sayHello` đã chứa function value nên function có thể được thực thi.

Output:

```text
Hello
```

---

# 5. Function Declaration vs Function Value

Ba syntax sau không giống nhau.

## Function Declaration

```js
function calculate() {}
```

Đây là:

```text
Function Declaration
```

## Function Expression

```js
const calculate = function () {};
```

Mental model:

```text
calculate
    ↓
const variable
    ↓
stores function value
```

## Arrow Function

```js
const calculate = () => {};
```

Mental model vẫn là:

```text
calculate
    ↓
const variable
    ↓
stores function value
```

Khi phân tích Hoisting, cần nhìn cách identifier được declared.

Không được reasoning:

```text
Nó chứa function
→ behavior giống Function Declaration
```

---

# 6. `var` Hoisting

Xét:

```js
console.log(age);

var age = 20;
```

Output:

```text
undefined
```

Trong Creation Phase:

```text
age → undefined
```

Không phải:

```text
age → 20
```

Assignment `20` xảy ra trong Execution Phase.

---

# 7. Declaration và Assignment

Có thể dùng mental model:

```js
var age = 20;
```

gồm:

```text
declaration
+
assignment
```

Creation Phase chuẩn bị declaration:

```text
age → undefined
```

Execution Phase khi chạy tới dòng:

```js
var age = 20;
```

thực hiện assignment:

```text
age → 20
```

---

# 8. `var` Timeline

```js
console.log(price);

var price = 200;

price = 300;

console.log(price);
```

Creation:

```text
price → undefined
```

Execution:

```text
console.log(price)
→ undefined

price = 200
→ price → 200

price = 300
→ price → 300

console.log(price)
→ 300
```

Output:

```text
undefined
300
```

---

# 9. `undefined` vs `not defined`

## Variable exists with `undefined`

```js
console.log(age);

var age = 20;
```

Creation:

```text
age → undefined
```

Variable tồn tại.

Value hiện tại là:

```text
undefined
```

## Identifier không tồn tại

```js
console.log(age);
```

nếu không có accessible declaration phù hợp:

```text
ReferenceError: age is not defined
```

Do đó:

```text
exists + value undefined
```

khác:

```text
identifier cannot be resolved
```

---

# 10. `let` và `const`

Xét:

```js
console.log(age);

let age = 20;
```

Không output:

```text
undefined
```

Mà gây:

```text
ReferenceError
```

Điều này không có nghĩa `let` hoàn toàn không được xử lý trong bước setup.

Mental model:

```text
Creation Phase

age binding exists
        ↓
uninitialized
```

---

# 11. Uninitialized không phải Undefined

Với `var`:

```text
age → undefined
```

`undefined` là một JavaScript value.

Với `let`/`const` trước initialization:

```text
age → uninitialized
```

`uninitialized` ở đây là mental model cho trạng thái internal của binding.

Không được viết:

```text
age = ReferenceError
```

`ReferenceError` không phải value của `age`.

---

# 12. Temporal Dead Zone — TDZ

Với:

```js
console.log(age);

let age = 20;
```

có thể hình dung:

```text
scope starts
    ↓
age binding created
    ↓
uninitialized
    ↓
TDZ
    ↓
console.log(age)
    ↓
attempt to access uninitialized binding
    ↓
ReferenceError
```

Khi execution chạy tới:

```js
let age = 20;
```

`age` được initialized:

```text
age → 20
```

TDZ kết thúc.

---

# 13. TDZ bắt đầu và kết thúc

Ví dụ:

```js
{
  console.log(name);

  const name = "Hieu";
}
```

Mental model:

```text
{                       ← scope begins
│
│ TDZ
│ name = uninitialized
│
├── console.log(name)
│          ↓
│    ReferenceError
│
├── const name = "Hieu"
│          ↓
│    initialization
│          ↓
│      TDZ ends
│
}
```

`console.log(name)` không kết thúc TDZ.

Nó chỉ cố access variable trong TDZ và gây lỗi.

---

# 14. ReferenceError trong TDZ

Ba concepts phải tách riêng:

```text
undefined
uninitialized
ReferenceError
```

## undefined

Một value:

```js
let value;

console.log(value);
```

Output:

```text
undefined
```

## uninitialized

Binding tồn tại nhưng chưa được initialized.

Ví dụ trạng thái của `let`/`const` trước declaration được thực thi.

## ReferenceError

Error xảy ra nếu code cố access binding trong TDZ.

Mental model:

```text
binding
   ↓
uninitialized
   ↓
currently in TDZ
   ↓
attempt access?
   ↓ yes
ReferenceError
```

Không có access thì không có ReferenceError chỉ vì TDZ tồn tại.

---

# 15. Comparison

## Function Declaration

```js
greet();

function greet() {}
```

Creation Phase:

```text
greet
↓
binding + function value
```

Có thể gọi trước dòng declaration.

---

## var

```js
console.log(age);

var age = 20;
```

Creation Phase:

```text
age
↓
binding + undefined
```

Output trước assignment:

```text
undefined
```

---

## let

```js
console.log(age);

let age = 20;
```

Creation Phase mental model:

```text
age
↓
binding
↓
uninitialized
```

Access trong TDZ:

```text
ReferenceError
```

---

## const

```js
console.log(name);

const name = "Hieu";
```

Mental model tương tự:

```text
name
↓
binding
↓
uninitialized
↓
TDZ
```

Access trước initialization:

```text
ReferenceError
```

---

# 16. Summary Table

| Declaration | Setup mental model | Access before declaration/initialization |
|---|---|---|
| Function Declaration | binding + function value | callable |
| `var` | binding + `undefined` | `undefined` |
| `let` | binding + uninitialized | `ReferenceError` |
| `const` | binding + uninitialized | `ReferenceError` |

---

# 17. Important Mental Model

Không nên học:

```text
Hoisting
=
JavaScript moves code to the top
```

Nên reasoning:

```text
Source code
    ↓
scope setup / creation
    ↓
bindings prepared differently
    ↓
execution
```

Sau đó hỏi:

```text
Identifier được declared bằng syntax nào?
```

Nếu:

```text
function declaration
→ function value available
```

Nếu:

```text
var
→ initialized with undefined
```

Nếu:

```text
let / const
→ binding exists but uninitialized
→ TDZ
```

---

# 18. Common Misconceptions

### "JavaScript physically moves declarations"

Không nên dùng đây làm mental model chính.

### "Mọi function đều có thể gọi trước declaration"

Sai.

```js
function greet() {}
```

khác:

```js
const greet = () => {};
```

### "Arrow function không được hoist"

Cách nói này thiếu chính xác.

Identifier trong:

```js
const greet = () => {};
```

tuân theo behavior của `const`.

### "`let` và `const` không được hoist"

Cách nói này tạo mental model sai.

Binding của chúng được tạo khi scope được setup nhưng vẫn uninitialized cho tới initialization.

### "ReferenceError là value của variable"

Sai.

```text
uninitialized
```

là trạng thái binding trong mental model.

```text
ReferenceError
```

là error xảy ra khi thực hiện access không hợp lệ.

### "`undefined` và `uninitialized` giống nhau"

Sai.

`undefined` là JavaScript value.

`uninitialized` không phải value mà code có thể đọc được.

---

# 19. Must Know

Sau bài này cần nhớ:

- Hoisting không nên hiểu đơn giản là di chuyển code lên đầu.
- Creation/Setup xảy ra trước Execution trong mental model của bài này.
- Function Declaration có function value sẵn khi execution bắt đầu.
- Function Expression và Arrow Function lưu function value trong variable.
- `var` được initialized với `undefined`.
- Assignment của `var` xảy ra khi Execution Phase chạy tới dòng assignment.
- `let` và `const` có binding nhưng uninitialized trước initialization.
- TDZ tồn tại trước initialization của `let`/`const`.
- Access variable trong TDZ gây `ReferenceError`.
- `undefined`, `uninitialized`, và `ReferenceError` là ba thứ khác nhau.

---
