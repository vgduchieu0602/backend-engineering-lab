# Object

## 1. Problem

Primitive values phù hợp để biểu diễn các dữ liệu riêng lẻ:

```js
const name = "Monstera";
const age = 2;
const isHealthy = true;
```

Nhưng những dữ liệu trên thực chất cùng mô tả một thực thể: một `plant`.

Khi số lượng dữ liệu tăng lên, việc sử dụng nhiều variable riêng biệt làm mối quan hệ giữa chúng khó quản lý.

Object cho phép nhóm các dữ liệu có liên quan vào cùng một cấu trúc.

```js
const plant = {
  name: "Monstera",
  age: 2,
  isHealthy: true
};
```

---

## 2. Object là gì?

Ở mental model hiện tại:

> Object là một value cho phép nhóm các dữ liệu/property có liên quan để cùng mô tả một đối tượng hoặc thực thể.

Ví dụ:

```js
const user = {
  name: "Hieu",
  age: 25,
  isActive: true
};
```

Toàn bộ:

```js
{
  name: "Hieu",
  age: 25,
  isActive: true
}
```

là object value.

---

## 3. Variable vs Object Value

Cho:

```js
const user = {
  name: "Hieu",
  age: 25
};
```

Phân tích:

```text
const
└── declaration keyword

user
└── variable

{
  name: "Hieu",
  age: 25
}
└── object value
```

Không được nhầm:

```text
user ≠ object value
```

`user` là variable.

Object bên phải dấu `=` là value.

---

## 4. Property

Object chứa các **properties**.

Ví dụ:

```js
const user = {
  name: "Hieu",
  age: 25
};
```

Có hai properties:

```text
name: "Hieu"
age: 25
```

Mỗi property có thể được hiểu đơn giản gồm:

```text
property
├── key
└── value
```

Do đó:

```text
name: "Hieu"
│       │
│       └── property value
│
└────────── property key
```

---

## 5. Property Key và Property Value

Cho:

```js
const user = {
  name: "Hieu",
  age: 25,
  isActive: true
};
```

Property keys:

```text
name
age
isActive
```

Property values:

```text
"Hieu"
25
true
```

Các property values vẫn có type riêng:

```text
"Hieu" → string
25     → number
true   → boolean
```

---

## 6. Property không phải Variable

Cho:

```js
const plant = {
  name: "Monstera"
};
```

Phân biệt:

```text
plant
└── variable

name
└── property key

"Monstera"
└── property value
```

Không nên nói:

```text
plant và name đều là variable ❌
```

Ở đoạn code trên, `name` là property của object.

---

## 7. Dot Notation

Có thể truy cập property bằng dot notation:

```js
const plant = {
  name: "Monstera",
  age: 2
};

console.log(plant.name);
console.log(plant.age);
```

Kết quả:

```text
Monstera
2
```

Mental model:

```text
plant.name
  │     │
  │     └── property cần truy cập
  │
  └──────── object/variable dùng để truy cập object
```

`plant.name` lấy value của property `name` trong object.

---

## 8. Object giải quyết vấn đề gì?

Không có object:

```js
const plantAName = "Monstera";
const plantAAge = 2;

const plantBName = "Rose";
const plantBAge = 1;
```

Quan hệ giữa dữ liệu phải được thể hiện thông qua cách đặt tên variable.

Với object:

```js
const plantA = {
  name: "Monstera",
  age: 2
};

const plantB = {
  name: "Rose",
  age: 1
};
```

Cấu trúc thể hiện rõ:

```text
plantA
├── name → "Monstera"
└── age  → 2

plantB
├── name → "Rose"
└── age  → 1
```

Object giúp nhóm các dữ liệu có liên quan để biểu diễn cùng một thực thể.

---

## 9. Primitive vs Object

Primitive:

```js
25
"Hieu"
true
```

Object:

```js
{
  name: "Hieu",
  age: 25
}
```

Mental model hiện tại:

```text
Value
├── Primitive
│   ├── number
│   ├── string
│   ├── boolean
│   └── ...
│
└── Object
```

Object không phải primitive.

---

## 10. Phân tích một đoạn code

```js
const plant = {
  name: "Monstera",
  age: 2,
  isHealthy: true
};
```

Có thể phân tích:

```text
Declaration keyword = const

Variable
= plant

Value
= {
    name: "Monstera",
    age: 2,
    isHealthy: true
  }

Type
= object

Primitive
= no

Property keys
= name, age, isHealthy

Property values
= "Monstera", 2, true
```

---

## 11. Minimum Knowledge Checklist

Sau chủ đề này cần nắm được:

* Object là một value.
* Object không phải primitive.
* Object có thể nhóm các dữ liệu có liên quan.
* Object có properties.
* Property có key và value.
* Property không phải variable độc lập.
* Biết xác định object value.
* Biết xác định property key/value.
* Biết truy cập property cơ bản bằng dot notation.
* Hiểu problem cơ bản mà object giải quyết.
