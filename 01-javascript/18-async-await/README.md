# JS-18 — Kiến thức cần nhớ: Async/Await và Promise Combinators

> Tài liệu tra cứu kiến thức JavaScript dành cho lập trình Backend. Tập trung vào **quy tắc hoạt động, cách dùng, lỗi thường gặp và quyết định kỹ thuật**.

## 1. `async function`

- Mọi lần gọi `async function` đều trả về **Promise**, kể cả khi `return` một giá trị thông thường.
- `return value` → Promise **fulfilled** với `value` (nếu `value` là Promise/thenable thì Promise trả về sẽ tiếp nhận trạng thái của nó).
- `throw reason` → Promise **rejected** với `reason`.
- `return new Error('X')` **không** tạo rejection: Promise fulfilled với một Error object.

```js
async function getUser() { return { id: 1 }; }
async function fail() { throw new Error('DB_FAILED'); }

getUser().then(user => console.log(user.id)); // 1
fail().catch(error => console.log(error.message)); // DB_FAILED
```

## 2. `await`

- `await` lấy **fulfillment value** của Promise hoặc **throw rejection reason** nếu Promise rejected.
- `await` tạm dừng **async function đang chứa nó**, không chặn toàn bộ JavaScript thread.
- Phần code sau `await` tiếp tục bất đồng bộ, kể cả Promise đã fulfilled.
- `await` có thể dùng trong `async function` hoặc ở top-level của ES module được hỗ trợ.

```js
async function main() {
  console.log('A');
  const value = await Promise.resolve(10);
  console.log(value);
}
main();
console.log('B');
// A, B, 10
```

## 3. Xử lý và lan truyền lỗi

- `try/catch` bắt lỗi `throw` đồng bộ trong khối `try` và rejection từ Promise được `await` tại đó.
- Không `catch` → async function trả về Promise rejected.
- `catch` xử lý xong mà không `throw` lại → function có thể tiếp tục và fulfilled.
- `throw error` trong `catch` → tiếp tục lan truyền lỗi lên caller.
- Không biến lỗi hệ thống thành `null`, `[]` hoặc kết quả thành công giả nếu contract không cho phép.

```js
async function repository() { throw new Error('DB_FAILED'); }
async function useCase() { return repository(); } // rejection lan truyền

async function controller() {
  try {
    await useCase();
  } catch (error) {
    console.log(error.message); // DB_FAILED
  }
}
```

**Phân biệt:** `error` là Error object; `error.message` là chuỗi thông báo. Rejection reason không bắt buộc phải là Error, nhưng nên `throw new Error(...)` để giữ thông tin lỗi và stack trace.

## 4. Sequential và Concurrent

- **Sequential:** thao tác sau chỉ bắt đầu khi thao tác trước đã hoàn thành; cần thiết nếu có phụ thuộc dữ liệu.
- **Concurrent:** khởi động các thao tác độc lập trước khi chờ; tổng thời gian thường gần thời gian của thao tác chậm nhất (bỏ qua overhead và giới hạn tài nguyên).
- Concurrent **không đồng nghĩa** các đoạn JavaScript chạy song song trên nhiều thread.

```js
// Sequential: ~3 giây nếu A mất 1s, B mất 2s
const a = await getA();
const b = await getB();

// Concurrent: ~2 giây
const [a2, b2] = await Promise.all([getA(), getB()]);

// Phụ thuộc dữ liệu: cần sequential
const user = await getUser();
const orders = await getOrders(user.id);
```

## 5. Bốn Promise combinators

| Phương thức | Khi fulfilled | Khi rejected | Kết quả |
|---|---|---|---|
| `Promise.all()` | Tất cả đầu vào fulfilled | Bất kỳ đầu vào rejected | Array fulfillment values theo thứ tự đầu vào |
| `Promise.allSettled()` | Khi tất cả settled (với iterable thông thường) | Không rejected do đầu vào rejected | Array `{status, value}` hoặc `{status, reason}` |
| `Promise.race()` | Đầu vào settled đầu tiên fulfilled | Đầu vào settled đầu tiên rejected | Outcome của đầu vào settled đầu tiên |
| `Promise.any()` | Có đầu vào fulfilled đầu tiên | Tất cả đầu vào rejected | Fulfillment value đầu tiên hoặc `AggregateError` |

### 5.1. `Promise.all()` — Cần tất cả kết quả

```js
const [user, products] = await Promise.all([getUser(), getProducts()]);
```

- **Phải `await`** (hoặc `.then`) để lấy array kết quả; bản thân `Promise.all()` trả về Promise.
- Thứ tự kết quả theo **thứ tự đầu vào**, không theo thời gian hoàn thành.
- Một Promise rejected làm Promise tổng hợp rejected; các tác vụ còn lại **không tự hủy**.

### 5.2. `Promise.allSettled()` — Chấp nhận thất bại một phần

```js
const [userResult, productResult] = await Promise.allSettled([
  getUser(), getProducts()
]);

if (userResult.status === 'rejected') throw userResult.reason;
const user = userResult.value;
const products = productResult.status === 'fulfilled'
  ? productResult.value
  : null; // chỉ dùng nếu contract cho phép
```

- Fulfilled result: `.status === 'fulfilled'`, đọc `.value`.
- Rejected result: `.status === 'rejected'`, đọc `.reason`.
- Nếu `.reason` là Error object, lấy thông báo qua `.reason.message`.
- Phân biệt **không có dữ liệu** với **không tải được dữ liệu**.

### 5.3. `Promise.race()` — Outcome settled đầu tiên

```js
const result = await Promise.race([callProvider(), timeoutAfter(5000)]);
```

- **Settled** = fulfilled hoặc rejected; không phải chỉ lấy kết quả thành công.
- Phù hợp xây timeout, nhưng **không tự hủy** request thua cuộc.
- Khi cần hủy thật sự, dùng cancellation API được tác vụ hỗ trợ (ví dụ `AbortController`).
- Với timeout tự tạo bằng `setTimeout`, nên dọn timer khi không còn cần thiết.

### 5.4. `Promise.any()` — Thành công đầu tiên

```js
const response = await Promise.any([providerA(), providerB(), providerC()]);
```

- Bỏ qua các rejection riêng lẻ trong lúc chờ một fulfillment.
- Nếu **tất cả** rejected → `AggregateError` với `.errors` chứa các rejection reason theo thứ tự đầu vào.
- Không tự hủy tác vụ còn lại; cân nhắc chi phí và tác dụng phụ khi gọi nhiều provider đồng thời.

## 6. Chọn phương thức theo yêu cầu nghiệp vụ

| Yêu cầu | Lựa chọn |
|---|---|
| Cần đủ User + Products, thiếu một là thất bại | `Promise.all()` |
| Dashboard có thể hiển thị dữ liệu một phần | `Promise.allSettled()` |
| Trả về theo kết quả đến sớm nhất, kể cả lỗi | `Promise.race()` |
| Nhiều provider dự phòng, lấy thành công đầu tiên | `Promise.any()` |
| B cần dữ liệu từ A | `await A` rồi mới gọi B |

## 7. Timeout trong Backend: các điểm bắt buộc nhớ

```js
function timeoutAfter(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), ms);
  });
}

async function analyzePlantUseCase() {
  return Promise.race([callAIProvider(), timeoutAfter(5000)]);
}
```

- `5000` là **mili giây**, tương đương 5 giây.
- Nếu provider trả về lỗi trước timeout, lỗi provider được lan truyền.
- Nếu timeout thắng, caller nhận rejection `TIMEOUT`.
- Timeout bằng `race` **không bảo đảm** provider dừng xử lý.
- Ví dụ trên dùng để minh họa; bản production cần xem xét dọn timer, cancellation, tài nguyên và error mapping.

## 8. Các lỗi dễ mắc

1. Quên `await` khi destructuring kết quả `Promise.all()`.
2. Dùng `return new Error()` khi muốn báo lỗi; cần `throw new Error()`.
3. Nhầm `Promise.allSettled()` rejected khi một đầu vào rejected.
4. Nhầm `.value` và `.reason` trong kết quả `allSettled()`.
5. Nhầm `Promise.race()` với `Promise.any()`.
6. Dùng concurrent cho các thao tác có phụ thuộc dữ liệu.
7. Cho rằng timeout đồng nghĩa hủy tác vụ.
8. Quên truyền tham số `timeoutAfter(5000)`.
9. Catch rồi trả dữ liệu rỗng, che giấu lỗi thật.

## 9. Tự kiểm tra kiến thức

- Vì sao `async function` luôn trả Promise?
- Vì sao `await Promise.resolve()` vẫn làm phần code sau `await` tiếp tục bất đồng bộ?
- `return new Error()` khác `throw new Error()` như thế nào?
- Khi nào `try/catch` bắt được Promise rejection?
- Khi nào dùng sequential, khi nào dùng concurrent?
- Bốn Promise combinators khác nhau ở điều kiện settled/fulfilled/rejected nào?
- `AggregateError.errors` chứa gì?
- Vì sao timeout với `Promise.race()` không đủ để hủy request?

## 10. Thuật ngữ cần biết

| Thuật ngữ | Ý nghĩa |
|---|---|
| Fulfilled | Promise hoàn thành thành công, có fulfillment value |
| Rejected | Promise thất bại, có rejection reason |
| Settled | Promise đã fulfilled hoặc rejected |
| Error propagation | Lỗi được truyền qua các tầng gọi hàm |
| Concurrency | Nhiều tác vụ cùng có tiến trình xử lý/chờ |
| Latency | Độ trễ hoàn thành thao tác |
| Cancellation | Yêu cầu dừng một tác vụ đang chạy |
| AggregateError | Error chứa nhiều rejection reasons |
