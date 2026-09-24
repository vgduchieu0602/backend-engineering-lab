# Primitive Values

## 1. Value và Type

Mỗi value trong JavaScript có một **type**.

Ví dụ:

```js
25
"Plant Care"
true
```

Có các type tương ứng:

```text
25           → number
"Plant Care" → string
true         → boolean
```

Type giúp JavaScript xác định value thuộc loại dữ liệu nào và cách dữ liệu đó có thể được xử lý.

Ví dụ:

```js
10 + 20;       // 30
"10" + "20";   // "1020"
```

Mặc dù các value nhìn tương tự nhau, type khác nhau có thể dẫn đến cách xử lý khác nhau.

---

## 2. Primitive Value

Ở mental model hiện tại:

> Primitive value là một value đơn giản và không phải object.

JavaScript có 7 primitive types:

```text
string
number
boolean
undefined
null
bigint
symbol
```

---

## 3. Number

`number` biểu diễn dữ liệu dạng số.

```js
const age = 25;
const price = 100;
const temperature = 36.5;
const balance = -50;
```

Các value:

```text
25
100
36.5
-50
```

đều có type `number`.

Có thể kiểm tra bằng:

```js
typeof 25; // "number"
```

---

## 4. String

`string` biểu diễn dữ liệu dạng text.

```js
const name = "Hieu";
const projectName = "Plant Care";
```

```text
"Hieu"       → string
"Plant Care" → string
```

Có thể kiểm tra:

```js
typeof "Plant Care"; // "string"
```

Cần phân biệt:

```js
100
```

và:

```js
"100"
```

Chúng là hai value có type khác nhau:

```text
100   → number
"100" → string
```

---

## 5. Boolean

`boolean` có hai value:

```js
true
false
```

Ví dụ:

```js
const isActive = true;
const isDeleted = false;
```

Kiểm tra:

```js
typeof true; // "boolean"
```

Boolean thường được sử dụng để biểu diễn trạng thái:

```text
isActive
isDeleted
isVerified
hasPermission
```

---

## 6. `typeof`

`typeof` là operator có thể được sử dụng để kiểm tra type của một value.

```js
typeof 25;
// "number"

typeof "Hieu";
// "string"

typeof true;
// "boolean"
```

---

## 7. Phân biệt Declaration, Variable, Value và Type

Ví dụ:

```js
const age = 25;
```

Phân tích:

```text
const
└── declaration keyword

age
└── variable

25
└── value

number
└── type của value

number
└── primitive type
```

Do đó:

```text
const ≠ type
```

`const` liên quan đến cách khai báo variable và việc reassignment.

`number` mới là type của value `25`.

---

## 8. Primitive vs Object

Ví dụ:

```js
const age = 25;
```

`25` là primitive value.

Trong khi:

```js
const user = {
  name: "Hieu"
};
```

value của `user` là:

```js
{
  name: "Hieu"
}
```

Đây là object, không phải primitive.

Lưu ý:

```text
user               → variable

{ name: "Hieu" }   → value của user

"Hieu"              → value của property name
```

---

## 9. Mental Model

Khi gặp:

```js
const projectName = "Plant Care";
```

có thể phân tích:

```text
Declaration keyword = const
Variable            = projectName
Value               = "Plant Care"
Type                = string
Primitive           = yes
```

Khi gặp:

```js
const user = {
  name: "Hieu"
};
```

có thể phân tích:

```text
Declaration keyword = const
Variable            = user
Value               = { name: "Hieu" }
Type                = object
Primitive           = no
```

---

## 10. Những điều cần tránh nhầm

Không nhầm:

```text
variable ≠ value

const ≠ type

"100" ≠ 100

primitive ≠ object
```

Không kết luận:

```text
const = immutable value
```

`const` chỉ ngăn reassignment của variable. Mutation và immutability cần được học sau Object và Reference.

---

## 11. Minimum Knowledge Checklist

Sau chủ đề này cần nắm:

* Value là dữ liệu cụ thể.
* Value có type.
* `number`, `string`, `boolean` là primitive types.
* JavaScript có tổng cộng 7 primitive types.
* `100` và `"100"` có type khác nhau.
* Biết sử dụng `typeof` ở mức cơ bản.
* Phân biệt declaration keyword, variable, value và type.
* Primitive value không phải object.
* Object không phải primitive.
* Không nhầm `const` với data type.
