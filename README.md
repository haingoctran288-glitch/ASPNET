# 🛍️ HAI SPORT - E-Commerce Platform

![ASP.NET Core](https://img.shields.io/badge/Backend-ASP.NET%20Core%208.0-512BD4?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react)
![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-CC2927?style=for-the-badge&logo=microsoft-sql-server)
![Entity Framework Core](https://img.shields.io/badge/ORM-EF%20Core-33b27f?style=for-the-badge)

**HAI SPORT** là một nền tảng thương mại điện tử chuyên nghiệp cấp doanh nghiệp, được phát triển với kiến trúc chia tách rõ ràng (Decoupled Architecture) giữa **Frontend (React)** và **Backend (ASP.NET Core 8 MVC/API)**.

---

## 🌟 Chức Năng Nổi Bật (Key Features)

### 💻 1. Giao Diện Người Dùng (Frontend - React)
Được xây dựng với thiết kế hiện đại, sang trọng (Premium Design) và mang lại trải nghiệm người dùng (UX) mượt mà:
- **Trang chủ & Cửa hàng động:** Banner cuốn hút, danh sách sản phẩm hiển thị dạng lưới với các bộ lọc thông minh (theo danh mục).
- **Chi tiết sản phẩm:** Xem thông tin, giá cả và đặc biệt hỗ trợ chọn Size động (các kích cỡ giày/quần áo) cực kỳ linh hoạt.
- **Giỏ hàng & Thanh toán (Cart & Checkout):** Lưu trữ giỏ hàng an toàn qua `localStorage`. Luồng thanh toán mượt mà, tính toán tổng tiền và tự động liên kết với API backend.
- **Tài khoản Khách hàng:** Đăng nhập, đăng ký tài khoản với bảo mật. Xem lịch sử đơn hàng cá nhân trực tiếp trên giao diện.
- **Tin tức & Bài viết:** Tích hợp tính năng hiển thị bài viết blog (font chữ tùy chỉnh, hiển thị rich text dạng HTML an toàn).

### ⚙️ 2. Hệ Thống Quản Trị (Backend Admin - ASP.NET Core MVC)
Giao diện quản lý "HAI CMS" dành cho chủ shop, trực quan và đầy đủ nghiệp vụ:
- **Quản lý Đơn hàng (Order Management):**
  - Quản lý danh sách đơn hàng.
  - Sửa, xóa và thêm trực tiếp từng chi tiết sản phẩm (OrderDetail) ngay bên trong giao diện Đơn hàng một cách nhanh chóng.
  - Tự động cộng/trừ tổng tiền khi số lượng hoặc mặt hàng trong đơn thay đổi.
- **Quản lý Sản phẩm & Danh mục:** Thêm, sửa, xóa sản phẩm. Hỗ trợ trường thông tin `Size` linh hoạt.
- **Quản lý Khách hàng & Người dùng:** Xem danh sách khách hàng, cấp quyền quản trị viên.

### 🔌 3. Hệ Thống API & Dịch vụ (Backend API)
- **RESTful API Architecture:** 8 Controller tiêu chuẩn (Product, Category, Post, Order, User, Customer, v.v...) phục vụ cho Frontend.
- **Swagger Documentation:** Toàn bộ API đều được cung cấp `[ProducesResponseType]`, Schema bảng dữ liệu rõ ràng, và hỗ trợ các tham số Lọc tìm kiếm (`[FromQuery] search`, `categoryId`, `price`, `status`).
- **Gửi Email Tự động (SMTP):** Dịch vụ Email chạy ngầm (Asynchronous) tự động gửi hóa đơn xác nhận ngay sau khi khách hàng đặt hàng thành công.

---

## 🛠 Cấu Trúc Thư Mục (Folder Structure)

```text
asp-net-buoi-2/
│
├── CMS.Backend/            # Backend (ASP.NET Core 8)
│   ├── Controllers/        # API Controllers & MVC Controllers
│   ├── Data/               # Entity Framework DbContext & Entities (Models)
│   ├── Services/           # Các dịch vụ xử lý logic (VD: EmailService)
│   ├── Views/              # Giao diện Admin CMS (Razor Pages)
│   ├── appsettings.json    # Cấu hình chuỗi kết nối Database (SQL Server LocalDB)
│   └── Program.cs          # File cấu hình khởi chạy Backend
│
└── cms.frontend/           # Frontend (React.js + Vite)
    ├── src/
    │   ├── api/            # Cấu hình AxiosClient gọi về Backend
    │   ├── components/     # Các UI Component tái sử dụng (Header, Footer, ProductCard)
    │   ├── context/        # React Context (Quản lý State Giỏ hàng)
    │   └── pages/          # Các trang (Trang chủ, Checkout, Login, v.v...)
    └── package.json        # Danh sách thư viện Frontend
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu hệ thống (Prerequisites)
1. **.NET 8.0 SDK**
2. **Node.js** (Phiên bản >= 18)
3. **SQL Server LocalDB** (Có sẵn khi cài Visual Studio)

### Bước 1: Khởi chạy Backend (ASP.NET Core 8)
1. Mở Terminal (Command Prompt / PowerShell) và trỏ vào thư mục Backend:
   ```bash
   cd "c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\CMS.Backend"
   ```
2. Chạy lệnh sau để khởi động dự án:
   ```bash
   dotnet run
   ```
3. **Truy cập Backend:**
   - Trang quản trị Admin: [http://localhost:5173](http://localhost:5173) (Đăng nhập bằng tài khoản admin có sẵn).
   - Tài liệu Swagger API: [http://localhost:5173/swagger](http://localhost:5173/swagger)

*(Lưu ý: Backend được cấu hình chạy ở cổng `5173` theo cấu hình dự án. Database sẽ tự động được kết nối qua LocalDB `HaiCMS_DB` khai báo trong `appsettings.json`).*

### Bước 2: Khởi chạy Frontend (React)
1. Mở một Terminal MỚI, trỏ vào thư mục Frontend:
   ```bash
   cd "c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\cms.frontend"
   ```
2. Cài đặt toàn bộ thư viện npm:
   ```bash
   npm install
   ```
3. Chạy môi trường Development:
   ```bash
   npm start
   ```
4. Trình duyệt sẽ tự động mở trang web Shop tại [http://localhost:3000](http://localhost:3000).

---

## 💡 Lưu Ý Khi Sử Dụng & Kiểm Thử (Testing)
1. **Swagger UI:** Để test API trực tiếp trên Swagger, bạn cần ấn vào nút **"Try it out"** (Dùng thử) ở bên phải mỗi API, sau đó các ô nhập tham số (Tìm kiếm, Giá, CategoryId) mới được mở khóa để bạn có thể điền thông tin và lọc dữ liệu.
2. **Checkout & Email:** Khi test chức năng Đặt hàng, hệ thống sẽ tự động bắt luồng ngầm để gửi Mail hóa đơn đến Email của khách. Luồng chạy nền này đảm bảo không làm gián đoạn trải nghiệm người dùng.
3. **Admin Chi Tiết Đơn Hàng:** Admin có toàn quyền Sửa/Xóa sản phẩm trong đơn, mỗi thao tác sẽ tự động cập nhật lại tổng tiền thanh toán của đơn hàng một cách chính xác tuyệt đối.

---

**🎓 Dự án được phát triển bởi: Trần Ngọc Hải**
*Hoàn thiện đầy đủ nghiệp vụ đồ án E-commerce chuyên nghiệp bằng .NET 8 & React.*
