# JS-16 — Callback

## Status

- Status: Completed by explicit skip
- Feynman checkpoint: Not completed
- Needs review: Yes
- Strong areas:
  - Function as value
  - Passing function as argument
  - Callback invocation
  - Higher-Order Function
  - `map`
  - `filter`
- Needs review:
  - Vai trò của caller và Higher-Order Function
  - Vì sao callback giúp tách behavior khỏi flow xử lý

---

## 1. Problem

Trong JavaScript; đôi khi một function cần:

- nhận một logic khác từ bên ngoài
- quyết định khi nào logic đó được chạy
- truyền data cho logic đó
- tái sử dụng cùng một flow với nhiều behavior khác nhau

Ví dụ:

```js
function processPlant(plant) {
  console.log(plant.name);
}
```

Logic `console.log(plant.name)` đang bị hard-code.

Nếu sau này muốn save; validate; transform hoặc log plant; ta có thể cần thay đổi function.

Callback giúp truyền behavior vào function.

---

## 2. Function Is a Value

Trong JavaScript; function có thể được sử dụng như một value.

```js
function greet() {
  return "Hello";
}

const myFunction = greet;
```

`greet` không có `()` nên function chưa được thực thi.

```text
greet
↓
function value

myFunction
↓
reference tới cùng function
```

Khác với:

```js
const result = greet();
```

Ở đây:

```text
greet()
↓
execute function
↓
return "Hello"
↓
result = "Hello"
```

### Must Know

```text
greet
→ function value

greet()
→ execute function
→ return value
```

---

## 3. Function as Argument

Function value có thể được truyền vào function khác.

```js
function multiply(number) {
  return number * 2;
}

function process(callback) {
  return callback(10);
}

process(multiply);
```

Trong:

```js
process(multiply);
```

- `callback` = parameter
- `multiply` = argument

Sau khi gọi:

```text
callback → multiply
```

Do đó:

```js
callback(10);
```

sẽ gọi function mà `callback` đang reference tới.

Mental model:

```text
process(multiply)
        ↓
callback → multiply
        ↓
callback(10)
        ↓
multiply(10)
        ↓
20
```

JavaScript không rewrite source code từ `callback` thành `multiply`.

Parameter `callback` chỉ đang giữ/reference function value được truyền vào.

---

## 4. Callback

Callback là một function được truyền vào một function khác để function nhận nó có thể gọi lại khi cần.

```js
function save(name) {
  return `Saved ${name}`;
}

function execute(callback) {
  return callback("Hieu");
}

execute(save);
```

Ở đây:

```text
save
→ callback

execute
→ function nhận callback
```

Flow:

```text
execute(save)
↓
callback → save
↓
callback("Hieu")
↓
save("Hieu")
↓
"Saved Hieu"
```

---

## 5. Callback Does Not Mean Async

Callback không đồng nghĩa với asynchronous.

```js
function printName(name) {
  console.log(name);
}

function processUser(callback) {
  console.log("Start");

  callback("Hieu");

  console.log("End");
}

processUser(printName);
```

Output:

```text
Start
Hieu
End
```

Callback được thực thi synchronously.

Vì vậy:

```text
callback ≠ async
```

Callback chỉ mô tả relationship giữa các functions.

Timing phụ thuộc vào function/API sử dụng callback.

---

## 6. Higher-Order Function

Higher-Order Function là function:

1. nhận function khác làm argument; hoặc
2. return một function.

### Case 1 — Receive Function

```js
function execute(callback) {
  return callback();
}
```

`execute` là Higher-Order Function vì nó nhận function thông qua `callback`.

### Case 2 — Return Function

```js
function createGreeter() {
  function greet(name) {
    return `Hello ${name}`;
  }

  return greet;
}
```

`createGreeter` là Higher-Order Function vì nó return một function.

---

## 7. Callback vs Higher-Order Function

```js
function save(name) {
  return `Saved ${name}`;
}

function execute(callback) {
  return callback("Hieu");
}

execute(save);
```

Roles:

```text
execute
→ Higher-Order Function

save
→ Callback
```

Hai thuật ngữ mô tả hai vai trò khác nhau.

---

## 8. Return Callback vs Execute Callback

Hai đoạn này khác nhau.

### Return function

```js
return callback;
```

Nghĩa là return **function value**.

### Execute function

```js
return callback("Hieu");
```

Nghĩa là:

```text
execute callback
↓
get return value
↓
return that value
```

---

## 9. Callback with `forEach`

```js
const plants = ["Rose"; "Monstera"; "Cactus"];

plants.forEach((plant) => {
  console.log(plant);
});
```

Callback:

```js
(plant) => {
  console.log(plant);
}
```

`forEach` gọi callback một lần cho mỗi element.

```text
callback("Rose")
callback("Monstera")
callback("Cactus")
```

`forEach` là Higher-Order Function.

Arrow function được truyền vào là callback.

---

## 10. Callback with `map`

```js
const prices = [100; 200; 300];

const doubledPrices = prices.map((price) => {
  return price * 2;
});
```

`map` gọi callback cho từng element.

```text
callback(100) → 200
callback(200) → 400
callback(300) → 600
```

`map` sử dụng return value của callback để tạo array mới.

Result:

```js
[200; 400; 600]
```

Mental model:

```text
element
↓
callback
↓
return new value
↓
map puts value into new array
```

---

## 11. Callback with `filter`

```js
const users = [
  { name: "Hieu"; active: true };
  { name: "Nam"; active: false };
  { name: "Lan"; active: true };
];

const activeUsers = users.filter((user) => {
  return user.active;
});
```

Callback returns:

```text
Hieu → true
Nam  → false
Lan  → true
```

`filter` sử dụng boolean để quyết định giữ element gốc.

```text
true  → keep element
false → remove element
```

Result:

```js
[
  { name: "Hieu"; active: true };
  { name: "Lan"; active: true };
]
```

Result không phải `[true; false; true]` vì boolean chỉ được `filter` sử dụng làm điều kiện.

---

## 12. `map` vs `filter`

### map

```text
callback return value
↓
becomes value in new array
```

```js
plants.map((plant) => {
  return plant.name;
});
```

Result:

```js
["Rose"; "Monstera"; "Cactus"]
```

### filter

```text
callback return value
↓
used as condition
↓
true  → keep original element
false → remove original element
```

```js
plants.filter((plant) => {
  return plant.price >= 100;
});
```

---

## 13. Why Callback Exists

Không dùng callback:

```js
function processNumbers(numbers) {
  for (const number of numbers) {
    console.log(number * 2);
  }
}
```

Behavior `number * 2` đang bị hard-code.

Với callback:

```js
function processNumbers(numbers; callback) {
  for (const number of numbers) {
    callback(number);
  }
}
```

Có thể truyền behavior khác nhau:

```js
processNumbers([1; 2; 3]; (number) => {
  console.log(number * 2);
});
```

Hoặc:

```js
processNumbers([1; 2; 3]; (number) => {
  console.log(number * 10);
});
```

Processing flow có thể giữ nguyên trong khi behavior thay đổi.

---

## 14. Mental Model

```text
Caller
↓
passes FUNCTION VALUE

Higher-Order Function
↓
receives function through parameter

parameter → callback function

Higher-Order Function
↓
calls callback when needed

callback(data)
↓
callback executes
```

---

## 15. Parameter vs Argument

```js
function multiply(number) {
  return number * 2;
}

multiply(10);
```

- `number` = parameter
- `10` = argument

Function cũng có thể là argument:

```js
function process(callback) {}

process(multiply);
```

- `callback` = parameter
- `multiply` = argument

Sau lời gọi:

```text
callback → multiply
```

Sau đó:

```js
callback(10);
```

thực thi function được `callback` reference tới.

---

## 16. Common Misconceptions

### Misconception 1 — Callback là function nhận function khác

Không chính xác.

Function nhận function khác thường là Higher-Order Function. Function được truyền vào là callback.

### Misconception 2 — Callback luôn asynchronous

Không chính xác.

Callback có thể synchronous hoặc asynchronous.

### Misconception 3 — `return callback` và `return callback()` giống nhau

Không chính xác.

```js
return callback;
```

return function value.

```js
return callback();
```

execute function rồi return kết quả.

### Misconception 4 — `map` và `filter` dùng return value giống nhau

Không chính xác.

```text
map
→ uses returned DATA

filter
→ uses returned condition
```

---

## 17. Must Know

```text
functionName
→ function value

functionName()
→ function execution
```

```text
Callback
→ function passed into another function
```

```text
Higher-Order Function
→ receives function
OR
→ returns function
```

```text
callback ≠ automatically async
```

```text
map
→ callback return value becomes new array value
```

```text
filter
→ callback return value decides keep/remove
```

