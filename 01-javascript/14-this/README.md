# JS-14 — `this`

# 1. Problem

Xét object:

```js
const user = {
  name: "Hieu",

  showName() {
    console.log(this.name);
  },
};

user.showName();
```

Output:

```text
Hieu
```

Câu hỏi:

```text
this là gì?
Tại sao this.name lại lấy được "Hieu"?
```

Để hiểu code JavaScript thực tế, cần hiểu cách `this` được xác định.

---

# 2. Core Mental Model

Không nên học:

```text
this = object chứa function
```

hoặc:

```text
this = nơi function được viết
```

Mental model quan trọng hơn:

> Với regular function, giá trị của `this` phụ thuộc chủ yếu vào cách function được gọi.

Do đó cần quan sát **call-site**.

```text
function được gọi như thế nào?
```

---

# 3. Method Call

```js
const user = {
  name: "Hieu",

  showName() {
    console.log(this.name);
  },
};

user.showName();
```

Call-site:

```js
user.showName();
^^^^
```

Trong method call cơ bản:

```text
user.showName()

this → user
```

Do đó:

```js
this.name
```

tương đương việc lấy:

```js
user.name
```

Output:

```text
Hieu
```

---

# 4. Another Example

```js
const plant = {
  name: "Monstera",

  showName() {
    console.log(this.name);
  },
};

plant.showName();
```

Trong lúc `showName()` thực thi:

```text
this → plant
```

Do đó:

```text
this.name
↓
plant.name
↓
"Monstera"
```

---

# 5. Same Function — Different Receiver

```js
function showName() {
  console.log(this.name);
}

const userA = {
  name: "Hieu",
  showName,
};

const userB = {
  name: "Nam",
  showName,
};
```

Cùng một function:

```text
showName
```

nhưng:

```js
userA.showName();
```

thì:

```text
this → userA
```

Còn:

```js
userB.showName();
```

thì:

```text
this → userB
```

Output:

```text
Hieu
Nam
```

Điều này cho thấy `this` không đơn giản được quyết định bởi nơi function được defined.

---

# 6. `this` vs Lexical Scope

Đây là distinction quan trọng.

Lexical Scope:

```text
phụ thuộc nơi function được defined
```

Regular-function `this`:

```text
phụ thuộc cách function được called
```

Ví dụ:

```js
const name = "Global";

const user = {
  name: "Hieu",

  showName() {
    console.log(this.name);
  },
};
```

`this.name` không phải variable lookup giống lexical scope.

Không nên reasoning:

```text
showName
↓
user scope
↓
name
```

Object không tự động trở thành lexical scope.

`this.name` nghĩa là:

```text
lấy property name
từ object mà this đang reference tới
```

---

# 7. Detached Method

Đây là lỗi rất phổ biến.

```js
const user = {
  name: "Hieu",

  showName() {
    console.log(this.name);
  },
};

const show = user.showName;
```

Bây giờ:

```js
show();
```

không còn call-site:

```text
user.showName()
```

mà chỉ còn:

```text
show()
```

Do đó không nên mặc định:

```text
this → user
```

Việc function ban đầu nằm trong `user` không đảm bảo `this` luôn là `user`.

Đây là lý do **call-site** quan trọng.

Behavior cụ thể còn phụ thuộc execution context và strict mode, nên khi review sâu cần phân tích riêng.

---

# 8. Regular Function

Ví dụ:

```js
function showName() {
  console.log(this.name);
}
```

Regular function có `this` được xác định theo cách nó được gọi.

Ví dụ:

```js
user.showName();
```

có thể cho:

```text
this → user
```

Trong khi detached call:

```js
showName();
```

không có receiver `user`.

---

# 9. Arrow Function

Arrow function có behavior khác regular function.

```js
const showName = () => {
  console.log(this);
};
```

Arrow function không tạo `this` riêng theo regular call-site rules.

Nó sử dụng `this` từ lexical surrounding context.

Mental model:

```text
Regular Function
→ this phụ thuộc call-site

Arrow Function
→ không tạo this riêng
→ dùng surrounding lexical this
```

---

# 10. Arrow Function as Object Method

Cẩn thận với:

```js
const user = {
  name: "Hieu",

  showName: () => {
    console.log(this.name);
  },
};
```

Không nên reasoning:

```text
user.showName()
↓
this = user
```

theo method rule của regular function.

Vì `showName` là arrow function.

Arrow function không nhận `this` riêng từ `user.showName()` theo cách regular method làm.

Đây là lý do thường không dùng arrow function khi cần method-level dynamic `this`.

---

# 11. Nested Arrow Function

Arrow function lại hữu ích khi muốn giữ `this` của surrounding regular method.

Ví dụ:

```js
const user = {
  name: "Hieu",

  showName() {
    const print = () => {
      console.log(this.name);
    };

    print();
  },
};

user.showName();
```

`showName` là regular method:

```text
this → user
```

`print` là arrow function nên sử dụng surrounding `this`.

Mental model:

```text
user.showName()
     ↓
this → user
     ↓
arrow print
     ↓
uses surrounding this
     ↓
user
```

Output:

```text
Hieu
```

---

# 12. `call()`

JavaScript cho phép gọi function và chỉ định `this`.

```js
function showName() {
  console.log(this.name);
}

const user = {
  name: "Hieu",
};

showName.call(user);
```

Mental model:

```text
showName.call(user)
              ↓
          this → user
```

Output:

```text
Hieu
```

Có thể truyền arguments:

```js
function introduce(age) {
  console.log(this.name, age);
}

introduce.call(user, 25);
```

---

# 13. `apply()`

`apply()` tương tự `call()` nhưng arguments được truyền dưới dạng array/array-like collection.

```js
function introduce(age, city) {
  console.log(this.name, age, city);
}

introduce.apply(user, [25, "Hanoi"]);
```

Mental model:

```text
call

fn.call(thisValue, arg1, arg2)
```

vs:

```text
apply

fn.apply(thisValue, [arg1, arg2])
```

---

# 14. `bind()`

`bind()` khác `call()` và `apply()`.

`call()`:

```text
set this
+
execute immediately
```

`apply()`:

```text
set this
+
execute immediately
```

`bind()`:

```text
create a new function
with this bound
```

Ví dụ:

```js
function showName() {
  console.log(this.name);
}

const user = {
  name: "Hieu",
};

const boundShowName = showName.bind(user);

boundShowName();
```

Mental model:

```text
showName
   ↓
bind(user)
   ↓
new function
   ↓
this bound to user
```

---

# 15. Why `bind()` Can Be Useful

Detached method:

```js
const user = {
  name: "Hieu",

  showName() {
    console.log(this.name);
  },
};

const show = user.showName;
```

`show()` đã mất method call-site.

Có thể:

```js
const show = user.showName.bind(user);
```

Sau đó:

```js
show();
```

`this` được bound tới `user`.

---

# 16. `call` vs `apply` vs `bind`

| Method | Executes immediately | Returns bound function | Arguments |
|---|---:|---:|---|
| `call` | Yes | No | separate |
| `apply` | Yes | No | array |
| `bind` | No | Yes | can pre-bind |

Mental model:

```text
call
→ call now

apply
→ call now with argument array

bind
→ create function for later
```

---

# 17. `this` in Classes

Khi sau này học class:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  showName() {
    console.log(this.name);
  }
}

const user = new User("Hieu");
```

`this` tiếp tục đóng vai trò quan trọng.

Trong constructor:

```text
this
↓
instance being initialized
```

Sau:

```js
const user = new User("Hieu");
```

có:

```text
user
↓
{
  name: "Hieu"
}
```

Đây chỉ là preview. `new`, prototype và class cần được học riêng.

---

# 18. `this` and Backend JavaScript

Trong Backend Node.js, `this` có thể xuất hiện trong:

- class-based services
- controllers
- repository classes
- library APIs
- callbacks
- event handlers
- third-party frameworks

Ví dụ:

```js
class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  findUser(id) {
    return this.repository.findById(id);
  }
}
```

Nếu method bị truyền đi không đúng cách, context của `this` có thể bị mất.

Vì vậy hiểu `this` giúp debug các lỗi liên quan đến method context.

---

# 19. Common Misconceptions

## "`this` luôn là object chứa function"

Sai.

Cần xem function được gọi như thế nào.

---

## "`this` giống lexical variable lookup"

Sai.

Lexical Scope và `this` là hai cơ chế khác nhau.

```text
Lexical Scope
→ where function is defined

Regular Function this
→ how function is called
```

---

## "Arrow function có `this` riêng"

Sai.

Arrow function không tạo `this` riêng theo regular-function rules.

Nó sử dụng surrounding lexical `this`.

---

## "Function nằm trong object nên this luôn là object đó"

Sai.

Method có thể bị detached:

```js
const fn = user.showName;
```

Sau đó:

```js
fn();
```

call-site đã thay đổi.

---

## "`bind()` gọi function ngay"

Sai.

```js
const fn = showName.bind(user);
```

tạo bound function.

Sau đó mới:

```js
fn();
```

---

# 20. Mental Model

Khi gặp regular function:

```text
Function
   ↓
How is it called?
   ↓
Determine this
```

Khi gặp:

```js
user.showName();
```

hãy nhìn:

```text
user.showName()
^^^^
receiver
```

Với basic regular method call:

```text
this → user
```

Khi gặp arrow function:

```text
Arrow Function
     ↓
no own dynamic this
     ↓
use surrounding lexical this
```

---

# 21. Must Know

Khi quay lại review bài này, cần chứng minh được:

- `this` là gì ở mức mental model.
- Tại sao call-site quan trọng.
- `object.method()` ảnh hưởng `this` thế nào.
- Detached method là gì.
- Lexical Scope khác `this` thế nào.
- Regular Function khác Arrow Function về `this`.
- Arrow Function lấy `this` từ đâu.
- `call()` làm gì.
- `apply()` làm gì.
- `bind()` làm gì.
- `call/apply/bind` khác nhau thế nào.
- Vì sao mất `this` có thể tạo bug.

---