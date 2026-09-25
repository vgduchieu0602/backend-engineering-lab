# Immutability

## 1. Problem

Cho:

```js id="c2r92a"
const originalUser = {
  name: "Hieu",
  role: "user"
};

const updatedUser = originalUser;

updatedUser.role = "admin";
```

Developer muốn:

```text id="m6ib70"
originalUser → state trước update
updatedUser  → state sau update
```

Nhưng `originalUser` và `updatedUser` cùng tham chiếu tới một object.

```text id="lx17x3"
originalUser ──┐
               ▼
             Object
          { role: "user" }
               ▲
updatedUser ───┘
```

Khi:

```js id="x1jwnl"
updatedUser.role = "admin";
```

object chung bị mutate.

Kết quả:

```js id="6znmru"
originalUser.role; // "admin"
updatedUser.role;  // "admin"
```

Original state không còn được giữ lại.

---

## 2. Mutation

Mutation là:

> Thay đổi trực tiếp dữ liệu bên trong một object đang tồn tại.

Ví dụ:

```js id="b8fnhc"
const product = {
  price: 100
};

product.price = 120;
```

Mental model:

```text id="kh3xux"
Object #1

{ price: 100 }
      ↓ mutation
{ price: 120 }
```

Vẫn là cùng một object.

Mutation không yêu cầu phải có nhiều variables hoặc shared references.

---

## 3. Immutable Update

Immutable approach:

> Khi cần state mới, giữ object cũ không thay đổi và tạo object mới biểu diễn state mới.

Ví dụ:

```js id="es1h0v"
const product = {
  name: "Keyboard",
  price: 100
};

const updatedProduct = {
  ...product,
  price: 120
};
```

Mental model:

```text id="v0lqdc"
product
   │
   ▼
Object #1
{
  name: "Keyboard",
  price: 100
}


updatedProduct
   │
   ▼
Object #2
{
  name: "Keyboard",
  price: 120
}
```

Kết quả:

```js id="hjnvhi"
product.price;        // 100
updatedProduct.price; // 120

product === updatedProduct; // false
```

---

## 4. Immutability không có nghĩa dữ liệu không bao giờ thay đổi

Application vẫn cần chuyển:

```text id="pcj38b"
old state
   ↓
new state
```

Ví dụ:

```text id="oy4fma"
role: "user"
      ↓
role: "admin"
```

Sự khác biệt nằm ở cách thực hiện.

Mutation:

```text id="9y7hfr"
Object #1
"user"
   ↓
"admin"
```

Immutable update:

```text id="a20w1g"
Object #1             Object #2
"user"      →         "admin"

old state              new state
```

---

## 5. Spread Syntax ở mức cơ bản

Có thể tạo object mới bằng:

```js id="p93pqm"
const updatedUser = {
  ...originalUser,
  role: "admin"
};
```

Ở mức mental model hiện tại:

```js id="pzghpr"
...originalUser
```

copy các properties của `originalUser` vào outer object mới.

Sau đó:

```js id="4z7xka"
role: "admin"
```

đặt value mới cho property `role`.

---

## 6. Shallow Copy

Đây là điểm rất quan trọng.

Cho:

```js id="ky4k3l"
const originalUser = {
  name: "Hieu",
  address: {
    city: "Hanoi"
  }
};

const updatedUser = {
  ...originalUser
};
```

Spread tạo outer object mới.

Vì vậy:

```js id="55g9dp"
originalUser === updatedUser;
// false
```

Nhưng nested `address` vẫn có thể là cùng một object:

```js id="5fs5jc"
originalUser.address === updatedUser.address;
// true
```

Mental model:

```text id="xdwhmt"
originalUser
    │
    ▼
Outer #1
    │
    └── address ──┐
                  ▼
              Nested #2
            { city: "Hanoi" }
                  ▲
                  │
    ┌── address ──┘
    │
Outer #3
    ▲
    │
updatedUser
```

Đây là **shallow copy**.

---

## 7. Problem của Shallow Copy

Nếu:

```js id="s18n8i"
updatedUser.address.city = "Danang";
```

nested object bị mutate.

Do cả hai outer objects cùng tham chiếu tới nested object đó:

```js id="t0h8zi"
originalUser.address.city;
// "Danang"

updatedUser.address.city;
// "Danang"
```

Outer object mới không có nghĩa tất cả nested objects đều mới.

---

## 8. Immutable Update với Nested Object

Nếu muốn thay đổi:

```text id="8odam6"
address.city
```

mà vẫn giữ original state:

```js id="as7j26"
const updatedUser = {
  ...originalUser,

  address: {
    ...originalUser.address,
    city: "Danang"
  }
};
```

Bây giờ:

```text id="hdgg17"
originalUser
    │
    ▼
Outer #1
    │
    └── address → Nested #2
                  { city: "Hanoi" }


updatedUser
    │
    ▼
Outer #3
    │
    └── address → Nested #4
                  { city: "Danang" }
```

Do đó:

```js id="uk7tr8"
originalUser === updatedUser;
// false

originalUser.address === updatedUser.address;
// false
```

Và:

```js id="7rwe4b"
originalUser.address.city;
// "Hanoi"

updatedUser.address.city;
// "Danang"
```

---

## 9. Chỉ Copy Path cần thay đổi

Cho:

```js id="m5a8e1"
const originalUser = {
  profile: {
    city: "Hanoi"
  },

  settings: {
    theme: "dark"
  }
};
```

Nếu chỉ thay đổi:

```text id="7x3a2v"
profile.city
```

có thể:

```js id="mcp7ht"
const updatedUser = {
  ...originalUser,

  profile: {
    ...originalUser.profile,
    city: "Danang"
  }
};
```

Khi đó:

```js id="twl4f6"
originalUser !== updatedUser;
// true

originalUser.profile !== updatedUser.profile;
// true

originalUser.settings === updatedUser.settings;
// true
```

`settings` không thay đổi nên vẫn có thể được shared.

Mental model:

> Tạo object mới trên đường dẫn chứa dữ liệu cần thay đổi.

---

## 10. Reference không phải Mutation

Không nhầm:

```text id="nh4vda"
Reference
→ quan hệ giữa variable/object

Mutation
→ thay đổi object hiện tại

Immutability
→ tránh thay đổi object cũ khi tạo state mới
```

Shared reference không phải mutation.

Nhưng:

```text id="xk08vn"
Shared Reference
       +
    Mutation
       ↓
Original state có thể bị thay đổi ngoài ý muốn
```

---

## 11. `const` không đồng nghĩa Immutability

```js id="kz4d0c"
const user = {
  name: "Hieu"
};

user.name = "Nam";
```

hợp lệ.

`const` ngăn reassignment của variable:

```js id="97is7x"
user = anotherUser; // error
```

Nó không tự động làm object immutable.

Do đó:

```text id="2op2x1"
const ≠ immutable
```

---

## 12. Mental Model tổng hợp

```text id="x8k0kv"
MUTATION

variable
   │
   ▼
Object #1
   │
   └── thay đổi trực tiếp


IMMUTABLE UPDATE

original
   │
   ▼
Object #1
(old state)

updated
   │
   ▼
Object #2
(new state)
```

Với nested object:

```text id="v4zxho"
Shallow copy
→ outer mới
→ nested có thể vẫn shared

Nested immutable update
→ outer mới
→ nested trên path thay đổi cũng mới
```

---

## 13. Minimum Knowledge Checklist

Sau chủ đề này cần nắm:

* Mutation thay đổi object hiện tại.
* Immutable update giữ old object và tạo object mới.
* Immutability không có nghĩa application không được có state mới.
* Spread syntax có thể dùng để tạo shallow copy.
* Shallow copy chỉ tạo outer object mới.
* Nested objects có thể vẫn shared reference.
* Mutation nested shared object có thể làm original state thay đổi.
* Khi immutable update nested data, cần tạo object mới trên path cần thay đổi.
* Những object không thay đổi có thể tiếp tục được shared.
* `const` không đồng nghĩa với immutable.
* Reference không phải mutation.
* Có thể dùng `===` để reasoning về shared object/reference.

