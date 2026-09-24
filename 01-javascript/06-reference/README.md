# Reference

## 1. Problem

Với primitive:

```js id="3k7ffo"
let a = 10;
let b = a;

b = 20;
```

Kết quả:

```js id="1ykkjq"
console.log(a); // 10
console.log(b); // 20
```

Nhưng với object:

```js id="pykkij"
const userA = {
  name: "Hieu"
};

const userB = userA;

userB.name = "Nam";
```

Kết quả:

```js id="j7ovk5"
console.log(userA.name); // "Nam"
```

Để hiểu sự khác biệt này cần mental model về **reference**.

## 2. Reference là gì?

Ở mental model hiện tại:

> Reference là cách một variable có thể tham chiếu đến một object.

Ví dụ:

```js id="fh9xhy"
const user = {
  name: "Hieu"
};
```

Có thể hình dung:

```text id="cf35zo"
user
 │
 │ reference
 ▼
Object
{ name: "Hieu" }
```

## 3. Nhiều variable có thể cùng tham chiếu một object

```js id="ddx5rt"
const userA = {
  name: "Hieu"
};

const userB = userA;
```

Không tạo object mới cho `userB`.

Mental model:

```text id="6tb4h2"
userA ─────┐
           ▼
        Object
     { name: "Hieu" }
           ▲
userB ─────┘
```

Có:

```text id="jrywrx"
2 variables
1 object
```

## 4. Thay đổi object được quan sát qua cả hai variable

```js id="wq19qb"
const userA = {
  name: "Hieu"
};

const userB = userA;

userB.name = "Nam";

console.log(userA.name); // "Nam"
```

`userA` và `userB` cùng dẫn tới một object.

Do đó object hiện tại là:

```js id="5vj3le"
{
  name: "Nam"
}
```

Cả hai variable đều có thể truy cập object đó.

## 5. Primitive assignment

```js id="8r2tke"
let a = 10;
let b = a;
```

Mental model:

```text id="yq9fh8"
a → 10
b → 10
```

Sau:

```js id="5kb7op"
b = 20;
```

ta có:

```text id="4r8mtr"
a → 10
b → 20
```

Việc thay đổi `b` không làm `a` trở thành `20`.

## 6. Object assignment

```js id="ax10io"
const a = {
  score: 10
};

const b = a;
```

Mental model:

```text id="8z3mzu"
a ───┐
     ▼
  { score: 10 }
     ▲
b ───┘
```

Sau:

```js id="p5hhjo"
b.score = 20;
```

object trở thành:

```js id="2dpp16"
{
  score: 20
}
```

Vì vậy:

```js id="fbtkgu"
console.log(a.score); // 20
console.log(b.score); // 20
```

## 7. Assignment không phải lúc nào cũng giống nhau

Primitive:

```js id="a23v7n"
let a = 10;
let b = a;
```

`b` nhận primitive value.

Object:

```js id="vvso3s"
const a = {
  name: "Hieu"
};

const b = a;
```

`b` cùng tham chiếu đến object với `a`.

Do đó không thể nhìn:

```js id="r9x6gi"
const b = a;
```

rồi kết luận ngay `b` đang nhận primitive.

Phải biết `a` đang đại diện cho loại value nào.

## 8. Hai object có cùng dữ liệu vẫn có thể là hai object khác nhau

```js id="sfm1o2"
const userA = {
  name: "Hieu"
};

const userB = {
  name: "Hieu"
};
```

Mental model:

```text id="ypt8sp"
userA ──→ Object #1
          { name: "Hieu" }

userB ──→ Object #2
          { name: "Hieu" }
```

Hai object có dữ liệu giống nhau nhưng không phải cùng một object.

Vì vậy:

```js id="00py0q"
console.log(userA === userB); // false
```

## 9. So sánh reference

Nếu:

```js id="5y00vp"
const userA = {
  name: "Hieu"
};

const userB = userA;
```

thì:

```js id="r5b29q"
console.log(userA === userB); // true
```

Vì chúng cùng tham chiếu tới một object.

Ngược lại:

```js id="iwl7lq"
const userA = {
  name: "Hieu"
};

const userB = {
  name: "Hieu"
};
```

thì:

```js id="h7d5k0"
console.log(userA === userB); // false
```

Vì đây là hai object khác nhau.

## 10. Same Data không có nghĩa Same Object

Đây là distinction quan trọng:

```text id="9a0e1y"
Same data
≠
Same object
```

Hai object có thể chứa chính xác cùng dữ liệu nhưng vẫn là hai object riêng biệt.

## 11. Mental Model

Primitive:

```text id="k3a3fv"
a → 10
b → 10
```

Shared object reference:

```text id="3zyypp"
a ───┐
     ▼
   Object
     ▲
b ───┘
```

Separate objects:

```text id="ifc0ew"
a → Object #1

b → Object #2
```

## 12. Không cần Stack/Heap để hiểu Reference

Ở giai đoạn này không cần kết luận:

```text id="yktnn5"
primitive → stack
object → heap
```

Reference có thể được hiểu bằng mental model value/reference trước.

Memory, Stack và Heap sẽ được học riêng sau.

## 13. Minimum Knowledge Checklist

Sau chủ đề này cần nắm:

* Object có reference semantics.
* Nhiều variable có thể cùng tham chiếu đến một object.
* `const b = a` với object không tạo object mới.
* Thay đổi object thông qua một reference có thể được quan sát qua reference khác.
* Hai object literals riêng biệt tạo ra hai object riêng biệt.
* Cùng dữ liệu không đồng nghĩa cùng object.
* Object comparison bằng `===` liên quan đến việc có phải cùng object/reference hay không.
* Primitive assignment và object assignment có behavior khác nhau.
* Không cần dùng Stack/Heap để giải thích reference ở level hiện tại.

