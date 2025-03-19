# **Hệ Thống Đặt Vé Máy Bay**

## **Cấu Trúc Dự Án**

Dự án được chia thành hai phần chính: `backend` (Express.js) và `frontend` (React.js). Dưới đây là cấu trúc thư mục đề xuất.

```
/project-root
│── /backend        # Thư mục backend (Node.js + Express.js)
│   ├── /src
│   │   ├── /config      # Cấu hình ứng dụng (DB, ENV, Middleware)
│   │   ├── /controllers # Xử lý logic API
│   │   ├── /models      # Mô hình dữ liệu (MongoDB hoặc MySQL)
│   │   ├── /routes      # Định tuyến API (Express Router)
│   │   ├── /services    # Các chức năng và xử lý nghiệp vụ chung
│   │   ├── /middlewares # Middleware bảo mật, xác thực
│   │   ├── /utils       # Các hàm tiện ích (định dạng dữ liệu, xác thực)
│   │   ├── /tests       # Unit tests cho API
│   │   ├── app.js       # Cấu hình ứng dụng Express
│   │   ├── server.js    # File khởi chạy server
│   ├── package.json     # Cấu hình Node.js
│   ├── .env             # Biến môi trường (DB, API Key)
│   ├── README.md        # Hướng dẫn backend
│
│── /frontend        # Thư mục frontend (React.js)
│   ├── /src
│   │   ├── /components   # Các component giao diện
│   │   ├── /pages        # Các trang chính của ứng dụng
│   │   ├── /assets       # Hình ảnh, icon, file CSS
│   │   ├── /services     # Gửi request API từ frontend đến backend
│   │   ├── /context      # Quản lý state toàn cục (React Context)
│   │   ├── /hooks        # Custom hooks nếu cần
│   │   ├── /routes       # Định tuyến frontend (React Router)
│   │   ├── App.js        # File chính của ứng dụng React
│   │   ├── index.js      # Điểm khởi chạy ứng dụng
│   ├── package.json      # Cấu hình React.js
│   ├── .env              # Biến môi trường frontend
│   ├── README.md         # Hướng dẫn frontend
│
│── /docs           # Thư mục chứa tài liệu hướng dẫn
│── .gitignore      # File để loại trừ các file không cần thiết khi push lên Git
│── README.md       # Tổng quan về dự án
```

---

## **Cấu Trúc Thư Mục Backend (Express.js)**

| **Thư mục**    | **Chức năng**                                                      |
| -------------- | ------------------------------------------------------------------ |
| `/config`      | Chứa file cấu hình môi trường, kết nối database                    |
| `/controllers` | Xử lý logic API và nghiệp vụ hệ thống                              |
| `/models`      | Định nghĩa Schema (MongoDB) hoặc Model (MySQL)                     |
| `/routes`      | Chứa tất cả các endpoint API sử dụng Express Router                |
| `/services`    | Chứa các chức năng logic tái sử dụng (email, thanh toán, xác thực) |
| `/middlewares` | Middleware xử lý xác thực, bảo mật, logging                        |
| `/utils`       | Các hàm tiện ích (định dạng dữ liệu, kiểm tra đầu vào)             |
| `/tests`       | Chứa các bài kiểm thử API (Jest hoặc Mocha)                        |
| `app.js`       | Cấu hình ứng dụng Express.js                                       |
| `server.js`    | Điểm khởi chạy chính của server backend                            |

---

## **Cấu Trúc Thư Mục Frontend (React.js)**

| **Thư mục**   | **Chức năng**                                                |
| ------------- | ------------------------------------------------------------ |
| `/components` | Các thành phần UI có thể tái sử dụng (nút bấm, form, modal)  |
| `/pages`      | Các trang chính của ứng dụng (Trang chủ, Đặt vé, Thanh toán) |
| `/assets`     | Lưu hình ảnh, icon và CSS toàn cục                           |
| `/services`   | Gửi request API bằng Axios                                   |
| `/context`    | Quản lý state toàn cục bằng React Context API                |
| `/hooks`      | Chứa custom hooks nếu cần                                    |
| `/routes`     | Định tuyến ứng dụng bằng React Router                        |
| `App.js`      | Component chính của ứng dụng React                           |
| `index.js`    | Điểm khởi chạy của ứng dụng React                            |

---

## **Hướng Dẫn Cài Đặt Và Chạy Dự Án**

### **1️⃣ Cài Đặt Các Thư Viện Cần Thiết**

Chạy lệnh sau trong cả thư mục `backend` và `frontend`:

```sh
npm install
```

### **2️⃣ Khởi Chạy Backend**

Di chuyển vào thư mục `backend` và chạy lệnh:

```sh
npm start
```

Điều này sẽ khởi động server Express.js.

### **3️⃣ Khởi Chạy Frontend**

Di chuyển vào thư mục `frontend` và chạy lệnh:

```sh
npm start
```

Điều này sẽ khởi động ứng dụng React.js.

---

## **Hướng Dẫn Đóng Góp**

- Tuân thủ cấu trúc thư mục.
- Sử dụng quy tắc đặt tên rõ ràng.
- Viết code sạch và có thể tái sử dụng.
- Ghi chép API routes và các chức năng quan trọng.

---

## **Giấy Phép**

Dự án này là mã nguồn mở và có thể sử dụng miễn phí. Bạn có thể tùy chỉnh và mở rộng theo nhu cầu.
