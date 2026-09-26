# Closure

## 1. Problem

Một inner function có thể tiếp tục sử dụng variable thuộc outer function ngay cả khi outer function đã thực thi xong.

```js
function createGreeter() {
  const name = "Hieu";

  function greet() {
    console.log(name);
  }

  return greet;
}

const greetUser = createGreeter();

greetUser();
```

Output:

```text
Hieu
```

`createGreeter()` đã kết thúc trước khi `greetUser()` được gọi.

Nhưng `greet` vẫn truy cập được `name`.

Closure giải thích hiện tượng này.

---

## 2. Definition

**Closure là cơ chế cho phép một function tiếp tục truy cập các variable thuộc lexical outer scope của nó, kể cả sau khi outer function đã thực thi xong**.

Mental model:

```text
outer()
│
├── variable
│
└── inner()
      │
      └── uses variable
```

Sau khi outer return:

```text
returned inner function
        ↓
     closure
        ↓
lexical environment
        ↓
     variable
```

---

## 3. Closure Builds on Lexical Scope

Closure không thay đổi Lexical Scope.

```js
function outer() {
  const value = 100;

  function inner() {
    return value;
  }

  return inner;
}
```

`inner` được defined bên trong `outer`.

Do đó lexical scope chain:

```text
inner
  ↓
outer
  ↓
global
```

Closure cho phép `inner` tiếp tục truy cập lexical environment đó sau khi `outer()` kết thúc.

---

## 4. Returning a Function Is Not Closure Itself

```js
return inner;
```

chỉ có nghĩa là function được return như một value.

Nó không tự động cho function access tới variables của một function khác.

Ví dụ:

```js
function inner() {
  console.log(secret);
}

function outer() {
  const secret = "ABC";

  return inner;
}
```

Structure:

```text
Global
├── inner
└── outer
```

Lexical scope chain của `inner`:

```text
inner → global
```

`outer` không nằm trong lexical scope chain.

Vì vậy `inner` không thể truy cập local `secret` của `outer`.

---

## 5. Closure with Parameters

```js
function createAdder(amount) {
  function add(number) {
    return number + amount;
  }

  return add;
}

const add10 = createAdder(10);

console.log(add10(5));
```

Output:

```text
15
```

`number` được tìm trong:

```text
add scope
→ 5
```

`amount` được tìm:

```text
add
↓
createAdder
↓
10
```

Sau khi `createAdder(10)` kết thúc, returned `add` vẫn truy cập được `amount`.

---

## 6. Each Outer Function Call Can Create a Separate Environment

```js
const add10 = createAdder(10);
const add20 = createAdder(20);
```

Có hai lần gọi:

```text
createAdder(10)
createAdder(20)
```

Mental model:

```text
add10
 ↓
closure A
 ↓
amount = 10


add20
 ↓
closure B
 ↓
amount = 20
```

Do đó:

```js
add10(5); // 15
add20(5); // 25
```

Hai closures không dùng chung một `amount`.

---

## 7. Closure Can Keep State

```js
function createCounter() {
  let count = 0;

  function increment() {
    count = count + 1;

    return count;
  }

  return increment;
}

const counter = createCounter();
```

Mental model:

```text
counter
   ↓
increment
   ↓
closure
   ↓
count = 0
```

Gọi:

```js
counter(); // 1
counter(); // 2
counter(); // 3
```

`count` không reset vì `createCounter()` không được gọi lại.

Chúng ta đang gọi returned `increment` function.

Closure cho phép `increment` tiếp tục truy cập và thay đổi `count`.

---

## 8. State

Ở mức hiện tại:

> State là dữ liệu được giữ lại và có thể thay đổi theo thời gian.

Ví dụ:

```text
count = 0
   ↓
count = 1
   ↓
count = 2
   ↓
count = 3
```

Closure có thể giữ state giữa nhiều lần gọi function.

---

## 9. Multiple Independent States

```js
const counterA = createCounter();
const counterB = createCounter();
```

Hai lần gọi `createCounter()` tạo hai environments:

```text
counterA
 ↓
environment A
 ↓
count


counterB
 ↓
environment B
 ↓
count
```

Do đó:

```js
counterA(); // 1
counterA(); // 2

counterB(); // 1
```

State của hai counter độc lập.

---

## 10. Multiple Functions Can Share One Closure Environment

```js
function createCounter() {
  let count = 0;

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function getCount() {
    return count;
  }

  return {
    increment,
    decrement,
    getCount,
  };
}
```

Các functions được tạo trong cùng một invocation:

```text
increment ─┐
decrement ─┼──→ same environment
getCount ──┘
                ↓
              count
```

Do đó chúng tương tác với cùng state.

---

## 11. Controlled Access to State

Thay vì:

```js
let count = 0;
```

ở global scope, có thể đặt state bên trong:

```js
function createCounter() {
  let count = 0;

  // functions interacting with count
}
```

Code bên ngoài tương tác thông qua functions được expose.

Ví dụ:

```text
outside
   ↓
increment()
decrement()
getCount()
   ↓
count
```

Điều này có thể được sử dụng để kiểm soát cách code bên ngoài tương tác với state.

Closure không có nghĩa state không thể thay đổi.

---

## 12. Closure Is Not Immutability

Closure:

```text
keep access to lexical environment
```

Immutability:

```text
avoid changing existing data directly
```

Hai khái niệm khác nhau.

Closure state hoàn toàn có thể mutate:

```js
count++;
```

---

## 13. Closure Is Not Simply "Return a Function"

Một function không nhất thiết phải được return mới có closure behavior.

Điểm cốt lõi cần hiểu là:

```text
function
   +
lexical environment
   +
access to outer variables
```

`return function` chỉ là một cách rất dễ để quan sát closure vì inner function có thể tồn tại sau khi outer invocation kết thúc.

---

## 14. Mental Model

```text
Function defined inside outer scope
              ↓
        Lexical Scope
              ↓
Function can access outer variables
              ↓
Function remains reachable
              ↓
        Closure keeps access
              ↓
Outer variables can remain reachable
              ↓
Can maintain state across calls
```

---

## 15. Common Misconceptions

### Closure = return function

Không.

Returning a function và Closure là hai concepts khác nhau.

### Outer function finished → all local variables immediately disappear

Không nhất thiết.

Nếu variables vẫn reachable thông qua closure, chúng vẫn có thể được sử dụng.

### Every call shares the same closure state

Không.

Different outer function invocations có thể tạo different environments.

### Closure makes state immutable

Không.

Closure state có thể được thay đổi.

### Call location determines closure

Không.

Closure dựa trên Lexical Scope, mà lexical relationship phụ thuộc vào nơi function được defined.

---

## 16. Must Know

Sau bài này cần giải thích được:

- Closure là gì.
- Closure liên quan đến Lexical Scope như thế nào.
- Tại sao inner function vẫn access outer variable sau khi outer function kết thúc.
- `return function` khác Closure như thế nào.
- Mỗi outer function invocation có thể tạo environment riêng.
- Closure có thể giữ state.
- Nhiều functions có thể share cùng closure environment.
- Closure có thể được dùng để kiểm soát access tới state.
- Closure không đồng nghĩa với immutability.
- Call location không quyết định lexical environment.