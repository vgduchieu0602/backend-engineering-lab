# Function

## 1. Problem

Trong chương trình, chúng ta thường có logic cần thực hiện nhiều lần.

Ví dụ:

```js id="vgc8em"
console.log("Starting server");
console.log("Starting server");
console.log("Starting server");
```

Việc lặp lại cùng một logic khiến code khó tái sử dụng và khó thể hiện ý nghĩa của hành động.

Function giúp đóng gói logic và đặt tên cho logic đó.

---

## 2. Definition

Function là:

> Một khối code/logic được đặt tên để có thể thực thi khi cần.

Ví dụ:

```js id="1rrd4x"
function startServer() {
  console.log("Starting server");
}
```

---

## 3. Function Declaration

```js id="d1o6u7"
function greet() {
  console.log("Hello");
}
```

Trong đó:

```text id="a6nj2q"
greet
→ function name

console.log("Hello")
→ logic bên trong function
```

Declaration định nghĩa function.

Nó không có nghĩa logic bên trong được thực thi ngay.

---

## 4. Function Call

Để execute function:

```js id="lppk7q"
greet();
```

Mental model:

```text id="v3ez0r"
greet()
   ↓
execute function
   ↓
run logic
```

Có thể gọi nhiều lần:

```js id="5id8rx"
greet();
greet();
greet();
```

Logic được execute ba lần.

---

## 5. Parameter

Function có thể cần input.

```js id="8fivmk"
function greet(name) {
  console.log("Hello " + name);
}
```

`name` là parameter.

Parameter có thể hiểu là:

> Variable trong function dùng để nhận input khi function được gọi.

---

## 6. Argument

Khi gọi:

```js id="ezsqb6"
greet("Hieu");
```

`"Hieu"` là argument.

Argument là:

> Value thực tế được truyền vào khi gọi function.

Mental model:

```text id="aczhxl"
"Hieu"
   ↓
argument
   ↓
name
   ↓
parameter
```

Không nói:

```text id="w6hwl7"
truyền parameter vào function
```

Nên nói:

```text id="vqzdb5"
truyền argument vào function
parameter nhận argument
```

---

## 7. Multiple Parameters

```js id="1acqxk"
function calculatePrice(price, quantity) {
  console.log(price * quantity);
}

calculatePrice(100, 3);
```

Mapping:

```text id="6zqhwv"
100 → price
3   → quantity
```

Logic:

```text id="3im0gp"
100 * 3
→ 300
```

---

## 8. Return

Function có thể đưa một value ra cho code gọi nó sử dụng.

```js id="d3i45n"
function calculatePrice(price, quantity) {
  return price * quantity;
}

const total = calculatePrice(100, 3);
```

Mental model:

```text id="2csh2m"
100 → price ─────┐
                 ├→ 100 * 3 → 300
3 → quantity ────┘
                         │
                       return
                         │
                         ▼
                       total
```

`total` có value:

```js id="o4olp7"
300
```

---

## 9. console.log vs return

Hai thứ này có mục đích khác nhau.

```js id="np39kv"
console.log(300);
```

Hiển thị value ra console.

Trong khi:

```js id="1w2uyz"
return 300;
```

đưa value từ function về nơi gọi function.

Ví dụ:

```js id="y55dkf"
function calculatePrice(price, quantity) {
  console.log(price * quantity);
}

const total = calculatePrice(100, 3);
```

Console in:

```text id="zv12cj"
300
```

nhưng:

```js id="44wcxm"
total === undefined;
```

vì function không return kết quả.

---

## 10. Function không có return

Nếu function kết thúc mà không có `return` value, returned value là:

```js id="wn9i9g"
undefined
```

Ví dụ:

```js id="5jdvdv"
function greet() {
  console.log("Hello");
}

const result = greet();
```

`"Hello"` được in ra nhưng:

```js id="ptdl3q"
result === undefined;
```

---

## 11. Return kết thúc Function

```js id="0zd6fe"
function calculate(a, b) {
  return a + b;

  console.log("Done");
}
```

Khi JavaScript gặp:

```js id="b83l73"
return a + b;
```

function kết thúc.

Do đó:

```js id="kyhtdp"
console.log("Done");
```

không được execute.

Mental model:

```text id="2ds85h"
enter function
      ↓
execute logic
      ↓
return value
      ↓
EXIT FUNCTION
```

---

## 12. Complete Data Flow

```js id="cfve62"
function calculateOrder(price, quantity) {
  const total = price * quantity;

  return total;
}

const orderTotal = calculateOrder(150, 2);
```

Flow:

```text id="2m0tpm"
Function declaration
        ↓
Function call
        ↓
Arguments
150       2
 ↓        ↓
Parameters
price   quantity
   \      /
    \    /
     Logic
   150 * 2
       ↓
      300
       ↓
     return
       ↓
returned value
       ↓
orderTotal = 300
```

---

## 13. Mental Model

Function có thể được nhìn như:

```text id="i0ly3a"
        INPUT
          │
          ▼
    ┌──────────┐
    │ FUNCTION │
    │          │
    │  LOGIC   │
    └────┬─────┘
         │
         ▼
       OUTPUT
```

Trong JavaScript:

```text id="nfy1ka"
Argument
   ↓
Parameter
   ↓
Logic
   ↓
return
   ↓
Returned value
```

---

## 14. Common Misconceptions

### Parameter và Argument giống nhau

Không.

```text id="dzdwmq"
Parameter
→ variable nhận input trong function definition

Argument
→ actual value truyền vào tại function call
```

### console.log giống return

Không.

```text id="b2gwsx"
console.log
→ hiển thị

return
→ trả value cho caller
```

### Declaration làm function chạy

Không.

```text id="z8ac0j"
Declaration
→ định nghĩa function

Call
→ execute function
```

### Code sau return vẫn chạy

Không. `return` kết thúc execution của function.

---

## 15. Must Know

Sau bài này cần giải thích được:

* Function là gì.
* Tại sao cần function.
* Function declaration.
* Function call/invocation.
* Parameter.
* Argument.
* Parameter và argument khác nhau thế nào.
* Function nhận input thế nào.
* `return` làm gì.
* `console.log` khác `return`.
* Function không return value sẽ trả `undefined`.
* Code sau `return` không được execute.
* Data flow từ argument → parameter → logic → return → caller.
