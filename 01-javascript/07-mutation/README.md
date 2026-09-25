# Mutation

## 1. Problem

Cho:

```js id="o2im0b"
const user = {
  name: "Hieu",
  age: 25
};

user.name = "Nam";
```

Mặc dù `user` được khai báo bằng `const`, đoạn code vẫn hợp lệ.

Để hiểu tại sao cần phân biệt hai khái niệm:

* Mutation
* Reassignment

---

## 2. Mutation là gì?

Ở mental model hiện tại:

> Mutation là việc thay đổi trực tiếp dữ liệu bên trong một object đang tồn tại.

Ví dụ:

```js id="i1h3f6"
const user = {
  name: "Hieu"
};

user.name = "Nam";
```

Trước:

```text id="w8idkb"
user ──→ Object
         { name: "Hieu" }
```

Sau:

```text id="hm02zo"
user ──→ Same Object
         { name: "Nam" }
```

Object không được thay thế bằng object khác.

Object hiện tại bị thay đổi bên trong.

---

## 3. Reassignment là gì?

Reassignment là gán một value mới cho variable đã tồn tại.

```js id="m9tsot"
let user = {
  name: "Hieu"
};

user = {
  name: "Nam"
};
```

Mental model:

```text id="o5f8oc"
Trước:

user ──→ Object #1
         { name: "Hieu" }


Sau:

user ──→ Object #2
         { name: "Nam" }
```

Variable `user` được reassigned để tham chiếu đến một object khác.

---

## 4. Mutation vs Reassignment

Mutation:

```js id="jny5qn"
user.name = "Nam";
```

```text id="9hx6tp"
variable
   │
   ▼
same object
   │
   └── dữ liệu bên trong thay đổi
```

Reassignment:

```js id="92j1m4"
user = {
  name: "Nam"
};
```

```text id="e37jmn"
variable
   │
   ├──X──→ old object
   │
   └─────→ new object
```

Điểm khác biệt:

```text id="llpxc2"
Mutation
→ thay đổi object

Reassignment
→ thay đổi value/reference của variable
```

---

## 5. `const` và Mutation

Cho:

```js id="d18z9n"
const user = {
  age: 25
};
```

Đoạn này hợp lệ:

```js id="l7mp3p"
user.age = 26;
```

vì đây là mutation.

Nhưng:

```js id="71p4rw"
user = {
  age: 26
};
```

không hợp lệ vì đây là reassignment.

Mental model:

```text id="u16s88"
const
  │
  └── ngăn reassignment của variable

const
  │
  └── KHÔNG tự động ngăn mutation của object
```

Vì vậy không được hiểu:

```text id="pibkrx"
const = immutable value
```

---

## 6. Mutation kết hợp với Reference

Cho:

```js id="z8pxw8"
const configA = {
  timeout: 1000
};

const configB = configA;
```

`configA` và `configB` cùng tham chiếu tới một object:

```text id="d1jmyt"
configA ──┐
          ▼
       Object
    { timeout: 1000 }
          ▲
configB ──┘
```

Nếu:

```js id="2y67dd"
configB.timeout = 5000;
```

object bị mutate:

```text id="xq3ybh"
configA ──┐
          ▼
       Object
    { timeout: 5000 }
          ▲
configB ──┘
```

Do đó:

```js id="05zbng"
console.log(configA.timeout); // 5000
console.log(configB.timeout); // 5000
```

Không phải hai variable cùng bị thay đổi.

Chỉ có một object bị mutate và cả hai variable đều tham chiếu đến object đó.

---

## 7. Shared Reference + Mutation

Đây là combination cần đặc biệt chú ý:

```text id="p29ytd"
Shared Reference
       +
    Mutation
       ↓
Một thay đổi có thể được quan sát
thông qua nhiều references
```

Ví dụ:

```js id="y8ytxq"
const userA = {
  name: "Hieu"
};

const userB = userA;

userB.name = "Nam";

console.log(userA.name); // "Nam"
```

`userB` không thay đổi `userA`.

`userB` được sử dụng để mutate object mà `userA` cũng đang tham chiếu tới.

---

## 8. Same Data không có nghĩa Same Object

```js id="qap60g"
const userA = {
  name: "Nam"
};

const userB = {
  name: "Nam"
};
```

Có:

```text id="h6kyau"
userA → Object #1
userB → Object #2
```

Nên:

```js id="t22a39"
userA === userB; // false
```

Ngược lại:

```js id="13dfbs"
const userA = {
  name: "Nam"
};

const userB = userA;
```

Có:

```text id="usxk1u"
userA ──┐
        ▼
      Object
        ▲
userB ──┘
```

Nên:

```js id="rgx2l9"
userA === userB; // true
```

---

## 9. Ví dụ tổng hợp

```js id="wpw8he"
const userA = {
  name: "Hieu"
};

const userB = userA;

userB.name = "Nam";

const userC = {
  name: "Nam"
};
```

Mental model:

```text id="y3l0np"
userA ─────┐
           ▼
        Object #1
       { name: "Nam" }
           ▲
userB ─────┘


userC ─────→ Object #2
             { name: "Nam" }
```

Vì vậy:

```js id="lvmh34"
userA === userB; // true
userA === userC; // false
userB === userC; // false
```

---

## 10. Misconceptions

Không nói:

> `userB` thay đổi `userA`.

Chính xác hơn:

> `userA` và `userB` cùng tham chiếu tới một object. Object đó bị mutate thông qua `userB`.

Không nói:

> `const` làm object không thể thay đổi.

`const` ngăn reassignment của variable, không tự động ngăn object mutation.

Không nhầm:

```js id="32mx4n"
user.name = "Nam";
```

với:

```js id="5x4s0f"
user = {
  name: "Nam"
};
```

Dòng đầu là mutation.

Dòng sau là reassignment.

---

## 11. Minimum Knowledge Checklist

Sau chủ đề này cần nắm:

* Mutation là thay đổi dữ liệu bên trong object đang tồn tại.
* Reassignment và mutation là hai hành động khác nhau.
* `const` ngăn reassignment nhưng không tự động ngăn mutation.
* Nhiều variables có thể cùng reference tới một object.
* Mutation của shared object có thể được quan sát qua nhiều references.
* Không nên nói một variable "bị thay đổi" chỉ vì object mà nó tham chiếu tới bị mutate.
* Same data không có nghĩa same object.
* Có thể giải thích mutation bằng mental model variable → reference → object.
