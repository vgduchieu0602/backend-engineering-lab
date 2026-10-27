# JS-15 — Prototype

## Status

```text
Completed by explicit skip
Feynman: NOT COMPLETED
Score: N/A
Needs Review: YES
```

---

# 1. Problem

Một object có thể sử dụng property hoặc method không được khai báo trực tiếp trên chính object đó.

```js
const user = {
  name: "Hieu";
};

console.log(user.toString());
```

`user` chỉ khai báo:

```js
name
```

nhưng vẫn có thể truy cập:

```js
toString()
```

Prototype giải thích cơ chế này.

---

# 2. Own Property

```js
const user = {
  name: "Hieu";
};
```

`name` tồn tại trực tiếp trên `user`.

```text
user
│
└── name: "Hieu"
```

Đây được gọi là:

```text
Own Property
```

Có thể kiểm tra:

```js
Object.hasOwn(user; "name");
// true
```

---

# 3. Prototype

JavaScript object có thể có một internal link tới một object khác.

Internal link này được gọi là:

```text
[[Prototype]]
```

Ví dụ:

```js
const user = {
  name: "Hieu";
};
```

Mental model:

```text
user
│
├── name: "Hieu"
│
└── [[Prototype]]
        ↓
   Object.prototype
```

Với object literal thông thường:

```js
{}
```

prototype thường là:

```js
Object.prototype
```

Có thể kiểm tra bằng:

```js
Object.getPrototypeOf(user) === Object.prototype;
```

Kết quả:

```text
true
```

---

# 4. Property Lookup

Khi JavaScript gặp:

```js
user.name
```

nó tìm property trên `user`.

```text
user
 ↓
name?
 ↓
YES
 ↓
"Hieu"
```

Nếu tìm thấy; lookup dừng.

---

# 5. Property Không Có Trên Object

Ví dụ:

```js
user.toString
```

JavaScript tìm:

```text
user
 ↓
own property "toString"?
 ↓
NO
 ↓
[[Prototype]]
 ↓
Object.prototype
 ↓
"toString"?
 ↓
YES
```

Do đó `user` có thể sử dụng `toString()` dù đó không phải own property của `user`.

---

# 6. Prototype Không Copy Properties

Không nên hiểu:

```text
Object.prototype
↓
copy methods vào user
```

Không phải:

```js
user = {
  name: "Hieu";
  toString: ...;
  hasOwnProperty: ...;
};
```

Mental model đúng hơn:

```text
user
│
├── name
│
└── [[Prototype]]
       ↓
Object.prototype
       │
       ├── toString
       └── ...
```

Object liên kết tới prototype.

Property lookup có thể đi theo liên kết đó.

---

# 7. Inherited Property

Property tìm được thông qua prototype có thể được gọi là inherited property.

Ví dụ:

```js
const user = {
  name: "Hieu";
};
```

Mental model:

```text
user
│
├── name                 ← own
│
└── [[Prototype]]
       ↓
Object.prototype
       │
       └── toString      ← inherited
```

Do đó:

```js
Object.hasOwn(user; "name");
// true

Object.hasOwn(user; "toString");
// false
```

Nhưng:

```js
user.toString();
```

vẫn có thể hoạt động.

---

# 8. `Object.create()`

Có thể tạo object với prototype cụ thể:

```js
const animal = {
  eat() {
    return "eating";
  };
};

const dog = Object.create(animal);
```

Mental model:

```text
dog
 │
 └── [[Prototype]]
        ↓
      animal
        │
        └── eat()
```

Sau đó:

```js
dog.eat();
```

JavaScript lookup:

```text
dog
 ↓
eat?
 ↓
NO
 ↓
animal
 ↓
eat?
 ↓
YES
```

Do đó method chạy được.

---

# 9. Own vs Inherited

```js
const animal = {
  type: "Animal";
};

const dog = Object.create(animal);

dog.name = "Milo";
```

Mental model:

```text
dog
│
├── name: "Milo"        ← own
│
└── [[Prototype]]
       ↓
     animal
       │
       └── type          ← inherited by dog
```

Do đó:

```js
dog.name;
// "Milo"

dog.type;
// "Animal"
```

Nhưng:

```js
Object.hasOwn(dog; "name");
// true

Object.hasOwn(dog; "type");
// false
```

---

# 10. Property Shadowing

Nếu object và prototype cùng có một property:

```js
const animal = {
  name: "Animal";
};

const dog = Object.create(animal);

dog.name = "Milo";
```

Khi:

```js
console.log(dog.name);
```

JavaScript tìm:

```text
dog
 ↓
name?
 ↓
YES
 ↓
"Milo"
 ↓
STOP
```

Output:

```text
Milo
```

Nó không tiếp tục tìm:

```text
animal.name
```

vì đã tìm thấy property trên `dog`.

Đây thường được gọi là:

```text
property shadowing
```

---

# 11. Prototype Chain

Prototype cũng có thể có prototype.

Ví dụ mental model:

```text
dog
 ↓
animal
 ↓
Object.prototype
 ↓
null
```

Chuỗi này gọi là:

```text
Prototype Chain
```

Khi lookup property:

```text
current object
      ↓
property exists?
  ↙          ↘
YES          NO
 ↓            ↓
STOP       prototype
               ↓
           repeat lookup
```

Nếu đi hết chain tới:

```text
null
```

mà không tìm thấy property thì lookup kết thúc.

---

# 12. Example Prototype Chain

```js
const animal = {
  eat() {
    return "eating";
  };
};

const dog = Object.create(animal);

dog.name = "Milo";
```

Có thể hình dung:

```text
dog
│
├── name
│
└── [[Prototype]]
       ↓
     animal
       │
       ├── eat
       │
       └── [[Prototype]]
              ↓
        Object.prototype
              │
              └── [[Prototype]]
                     ↓
                    null
```

Lookup:

```js
dog.eat
```

đi:

```text
dog
 ↓
animal
 ↓
FOUND
```

Lookup một property khác có thể tiếp tục:

```text
dog
 ↓
animal
 ↓
Object.prototype
 ↓
null
```

---

# 13. Prototype vs Lexical Scope

Không được nhầm hai cơ chế.

## Lexical Scope

Dùng khi tìm identifier/variable:

```js
console.log(name);
```

Mental model:

```text
current scope
 ↓
outer lexical scope
 ↓
...
```

## Prototype Chain

Dùng khi tìm property:

```js
console.log(user.name);
```

Mental model:

```text
user
 ↓
prototype
 ↓
prototype...
```

Tóm lại:

```text
Lexical Scope
→ variable lookup

Prototype Chain
→ property lookup
```

---

# 14. Constructor Function

Trước khi JavaScript `class` phổ biến; constructor functions thường được dùng để tạo nhiều objects cùng cấu trúc.

```js
function User(name) {
  this.name = name;
}

const userA = new User("Hieu");
const userB = new User("Nam");
```

`User` là function.

Khi dùng:

```js
new User(...)
```

JavaScript tạo object mới và thiết lập prototype relationship.

---

# 15. Function `.prototype`

Functions dùng làm constructor có property:

```js
User.prototype
```

Ví dụ:

```js
function User(name) {
  this.name = name;
}

User.prototype.sayHello = function () {
  return `Hello ${this.name}`;
};
```

Sau đó:

```js
const user = new User("Hieu");

user.sayHello();
```

Mental model:

```text
user
│
├── name: "Hieu"
│
└── [[Prototype]]
       ↓
   User.prototype
       │
       └── sayHello
```

`sayHello` không cần được copy thành một method riêng cho từng instance.

---

# 16. Hai Khái Niệm Dễ Nhầm

Đây là distinction cần review kỹ:

```text
object's [[Prototype]]
```

và:

```text
Function.prototype property
```

Ví dụ:

```js
function User() {}
const user = new User();
```

Có relationship:

```text
user.[[Prototype]]
        ↓
User.prototype
```

Có thể kiểm tra:

```js
Object.getPrototypeOf(user) === User.prototype;
```

→ `true`

---

# 17. `new` Mental Model

Với:

```js
const user = new User("Hieu");
```

Ở mức đơn giản; có thể hình dung `new` làm những việc như:

```text
1. Create new object

2. Connect object's prototype
   to User.prototype

3. Execute User with
   this referring to new object

4. Return new object
```

Mental model:

```text
new User("Hieu")
       ↓
create object
       ↓
[[Prototype]] → User.prototype
       ↓
User executes
       ↓
this.name = "Hieu"
       ↓
return object
```

Chi tiết edge cases của `new` cần review riêng.

---

# 18. Why Put Methods on Prototype?

Không nên:

```js
function User(name) {
  this.name = name;

  this.sayHello = function () {
    return `Hello ${this.name}`;
  };
}
```

Mỗi instance có thể nhận function property riêng.

Một cách prototype-based:

```js
function User(name) {
  this.name = name;
}

User.prototype.sayHello = function () {
  return `Hello ${this.name}`;
};
```

Mental model:

```text
userA ─┐
       │
       ├──→ User.prototype
       │         ↓
userB ─┘      sayHello
```

Các instances có thể lookup cùng method thông qua prototype.

---

# 19. Class và Prototype

JavaScript class vẫn liên quan tới prototype system.

Ví dụ:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return `Hello ${this.name}`;
  }
}
```

Sử dụng:

```js
const user = new User("Hieu");
```

Mental model đơn giản:

```text
user
 ↓
[[Prototype]]
 ↓
User.prototype
 ↓
sayHello
```

Do đó:

```js
Object.getPrototypeOf(user) === User.prototype;
```

→ `true`

Prototype không biến mất khi sử dụng `class`.

Class cung cấp syntax dễ tổ chức hơn trên prototype-based object model của JavaScript.

---

# 20. Prototype Chain with Class

Ví dụ:

```js
class Animal {
  eat() {
    return "eating";
  }
}

class Dog extends Animal {
  bark() {
    return "woof";
  }
}

const dog = new Dog();
```

Mental model khái quát:

```text
dog
 ↓
Dog.prototype
 ↓
Animal.prototype
 ↓
Object.prototype
 ↓
null
```

Property/method lookup có thể đi qua chain này.

Chi tiết `class`; `extends` và inheritance cần học riêng khi review OOP/Class.

---

# 21. Why Prototype Matters

Prototype giúp hiểu:

- property lookup
- inherited methods
- JavaScript object model
- constructor functions
- `new`
- JavaScript classes
- inheritance
- method sharing
- debugging khi property không nằm trực tiếp trên object

Nó cũng giải thích tại sao:

```js
const users = [];
```

có thể:

```js
users.map(...)
users.filter(...)
users.push(...)
```

dù object `users` không chứa các method đó dưới dạng own properties.

Các methods của Array liên quan tới prototype chain.

---

# 22. Example: Array

```js
const numbers = [1; 2; 3];

numbers.map((number) => number * 2);
```

Mental model khái quát:

```text
numbers
 ↓
Array.prototype
 ↓
map
```

Prototype chain tiếp tục:

```text
numbers
 ↓
Array.prototype
 ↓
Object.prototype
 ↓
null
```

Đây là lý do Prototype không chỉ là lý thuyết OOP mà xuất hiện trong JavaScript hàng ngày.

---

# 23. Common Misconceptions

## "Prototype copy properties vào object"

Sai.

Object lookup property thông qua prototype chain.

---

## "Inherited property là own property"

Sai.

```js
Object.hasOwn(...)
```

có thể dùng để phân biệt.

---

## "Prototype Chain giống Scope Chain"

Sai.

```text
Scope Chain
→ variable lookup

Prototype Chain
→ property lookup
```

---

## "`class` thay thế prototype"

Sai mental model.

JavaScript class vẫn hoạt động trên prototype-based object model.

---

## "Mỗi instance phải có một copy của method"

Không nhất thiết.

Methods có thể nằm trên prototype và được lookup bởi nhiều instances.

---

## "`User.prototype` chính là user"

Sai.

Ví dụ:

```text
user
↓
[[Prototype]]
↓
User.prototype
```

Chúng là objects khác nhau có relationship với nhau.

---

# 24. Core Mental Model

Khi gặp:

```js
object.property
```

hãy nghĩ:

```text
object
 ↓
own property?
 ├── YES → use it → STOP
 │
 └── NO
      ↓
   prototype
      ↓
   property?
      ├── YES → use it → STOP
      │
      └── NO
           ↓
      next prototype
           ↓
          ...
           ↓
          null
```

Đây là mental model quan trọng nhất của Prototype.

---

# 25. Must Know

Khi quay lại review bài này; cần giải thích được:

- Prototype là gì.
- `[[Prototype]]` là gì ở mức mental model.
- Own property là gì.
- Inherited property là gì.
- Property lookup hoạt động thế nào.
- Prototype Chain là gì.
- Lookup dừng khi nào.
- Property shadowing là gì.
- `Object.getPrototypeOf()` dùng để làm gì.
- `Object.hasOwn()` dùng để làm gì.
- `Object.create()` tạo prototype relationship như thế nào.
- Scope Chain khác Prototype Chain như thế nào.
- Constructor Function là gì.
- `new` làm gì ở mức mental model.
- `User.prototype` liên quan instance như thế nào.
- Class liên quan Prototype như thế nào.
- Tại sao Array có `map`; `filter`; `push` dù methods không phải own properties của từng array.

---

# 26. Future Feynman Checkpoint

Khi review lại; cần giải thích:

```js
const animal = {
  eat() {
    return "eating";
  };
};

const dog = Object.create(animal);

dog.name = "Milo";

console.log(dog.name);
console.log(dog.eat());
```

Cần trả lời:

1. `dog` có những own properties nào?
2. `eat` nằm ở đâu?
3. Tại sao `dog.eat()` chạy được?
4. JavaScript lookup `eat` theo flow nào?
5. `Object.hasOwn(dog; "eat")` trả về gì?
6. Prototype chain của `dog` là gì?

Sau đó giải thích:

```js
function User(name) {
  this.name = name;
}

User.prototype.sayHello = function () {
  return `Hello ${this.name}`;
};

const user = new User("Hieu");
```

Cần mô tả relationship:

```text
user
↓
User.prototype
↓
Object.prototype
↓
null
```

---

