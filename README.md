# 🏆 HAI SPORT - Nền Tảng Thương Mại Điện Tử Đỉnh Cao (E-Commerce Platform)

![ASP.NET Core](https://img.shields.io/badge/Backend-ASP.NET%20Core%208.0-512BD4?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react)
![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-CC2927?style=for-the-badge&logo=microsoft-sql-server)
![Entity Framework Core](https://img.shields.io/badge/ORM-EF%20Core-33b27f?style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap)

**HAI SPORT** là một hệ thống thương mại điện tử chuyên nghiệp cấp doanh nghiệp chuyên về thời trang và phụ kiện thể thao (đặc biệt là giày bóng đá chính hãng). Dự án được thiết kế với kiến trúc hệ thống hiện đại, chia tách hoàn toàn (Decoupled Architecture) giữa **Frontend (ReactJS)** và **Backend (ASP.NET Core 8)**.

---

## 🌟 Chức Năng Nổi Bật (Key Features)

### 💻 1. Trải Nghiệm Khách Hàng (Customer Frontend - React)
Được xây dựng với thiết kế hiện đại, sang trọng (Premium Design) và mang lại trải nghiệm người dùng (UX) cực kỳ mượt mà:
- **Giao diện đẳng cấp:** Sử dụng các thành phần UI cao cấp, hiệu ứng hover mượt mà, danh sách danh mục hiển thị dạng Logo Circular Badge chuyên nghiệp giống các trang thương mại điện tử lớn (Shopee Mall, Lazada Mall).
- **Trang chủ động (Dynamic Homepage):** Banner cuốn hút, danh sách sản phẩm hiển thị dạng lưới chia theo danh mục (Hàng Mới, Hàng Hot) và bài viết nổi bật.
- **Chi tiết sản phẩm linh hoạt:** Cung cấp thông tin chi tiết, hiển thị hình ảnh sắc nét, theo dõi tình trạng kho hàng (`Còn hàng`/`Hết hàng`). Đặc biệt hỗ trợ **chọn Size động** (các kích cỡ giày/quần áo) cho từng mặt hàng cụ thể.
- **Giỏ hàng thông minh (Smart Cart):** Lưu trữ giỏ hàng an toàn, tự động tính toán tổng tiền. Khách hàng có thể dễ dàng tăng giảm số lượng hoặc xóa sản phẩm.
- **Thanh toán mượt mà (Checkout):** Form điền thông tin tự động lấy dữ liệu tài khoản, tính toán tổng bill và tích hợp tính năng **Gửi Email Hóa Đơn Tự Động** cực kỳ chuyên nghiệp ngay khi nhấn đặt hàng.
- **Quản lý Tài khoản (User Dashboard):** Hệ thống xác thực an toàn, khách hàng có thể đăng ký, đăng nhập và tự theo dõi lịch sử đơn hàng của mình ngay trên website. Quên mật khẩu được hỗ trợ lấy lại qua **mã OTP gửi qua Email**.

### ⚙️ 2. Hệ Thống Quản Trị Trọng Tâm (Admin CMS - ASP.NET Core MVC)
Giao diện quản lý "HAI CMS" dành cho chủ shop được thiết kế tối ưu, giúp quản lý toàn bộ hệ thống kinh doanh:
- **Quản lý Đơn hàng (Advanced Order Management):**
  - Quản lý danh sách đơn hàng chi tiết (Theo trạng thái: Chờ duyệt, Đang giao, Đã giao, Đã hủy).
  - Khả năng **can thiệp sâu vào đơn hàng**: Admin có thể Sửa/Xóa/Thêm sản phẩm trực tiếp vào đơn của khách. Hệ thống tự động tính lại tổng tiền.
  - Tự động **gửi Email thông báo** cho khách hàng mỗi khi trạng thái đơn hàng thay đổi hoặc đơn hàng bị chỉnh sửa bởi Admin.
- **Quản lý Sản phẩm & Danh mục (Product Catalog):** 
  - Thêm, sửa, xóa sản phẩm kèm theo tính năng Upload Hình ảnh trực tiếp lên Server.
  - Quản lý chuỗi danh mục, cho phép up Logo đại diện cho từng danh mục (Nike, Adidas, Puma...).
- **Quản lý Bài viết (Blog Management):** Viết bài SEO, cập nhật tin tức khuyến mãi với trình soạn thảo, gắn thẻ phân loại (Category Post).
- **Quản lý Khách hàng:** Theo dõi danh sách tài khoản, phân quyền quản trị trị viên.

### 🔌 3. Nền Tảng API Mạnh Mẽ (Backend API & Services)
- **Kiến trúc RESTful API:** Cung cấp dữ liệu chuẩn JSON cho Frontend thông qua hơn 8 Controller tiêu chuẩn (Product, Category, Post, Order, User, v.v...).
- **Swagger Documentation:** Tất cả API đều được đặc tả rõ ràng với `[ProducesResponseType]`, hỗ trợ Test trực tiếp với các tham số lọc đa dạng.
- **Hệ thống Xử lý Tự động (Background Services):** 
  - **Email Service:** Sử dụng SMTP gửi các template Email HTML thiết kế tuyệt đẹp (Gửi hóa đơn, gửi mã OTP, gửi cập nhật đơn hàng).
  - Tự động trừ số lượng Tồn Kho (Stock) ngay khi đơn hàng được đặt thành công.

---

## 🛠 Kiến Trúc Hệ Thống & Thư Mục (Folder Structure)

Dự án được phân chia thành 2 thư mục độc lập, dễ dàng cho việc bảo trì và nâng cấp (Micro-frontend / Micro-service tương lai):

```text
asp-net-buoi-2/
│
├── CMS.Backend/            # Backend (ASP.NET Core 8 MVC & Web API)
│   ├── Controllers/        # Chứa API Controllers (giao tiếp Frontend) & MVC Controllers (giao diện Admin)
│   ├── Data/               # Lớp truy xuất dữ liệu: Entity Framework DbContext & Entities (Models)
│   ├── Services/           # Logic nghiệp vụ độc lập (Ví dụ: EmailService gửi mail SMTP)
│   ├── Views/              # Giao diện Admin CMS (Razor Pages - HTML/C#)
│   ├── wwwroot/            # Nơi lưu trữ tĩnh (Hình ảnh sản phẩm, Logo, Banner upload từ Admin)
│   ├── appsettings.json    # Cấu hình chuỗi kết nối Database & các thông số môi trường
│   └── Program.cs          # Pipeline và Cấu hình khởi chạy hệ thống
│
└── cms.frontend/           # Frontend (React.js + Vite)
    ├── src/
    │   ├── api/            # Cấu hình AxiosClient tự động kết nối Backend API
    │   ├── components/     # Các UI Component tái sử dụng (Header, Footer, CategoryList, ProductCard)
    │   ├── context/        # React Context API (Quản lý State Giỏ hàng toàn cục)
    │   └── pages/          # Layout các trang (HomePage, CheckoutPage, ProfilePage...)
    ├── .env                # Lưu biến môi trường cấu hình API URL cho React
    └── package.json        # Danh sách thư viện Frontend (React Router, Axios, Bootstrap...)
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án Local

### Yêu cầu hệ thống (Prerequisites)
1. **.NET 8.0 SDK** (Hoặc phiên bản mới nhất)
2. **Node.js** (Phiên bản >= 18)
3. **SQL Server LocalDB** (Có sẵn khi cài Visual Studio) hoặc SQL Server thông thường.

### Bước 1: Khởi chạy Backend (ASP.NET Core 8)
1. Mở Terminal (Command Prompt / PowerShell) và trỏ vào thư mục Backend:
   ```bash
   cd "CMS.Backend"
   ```
2. Chạy lệnh sau để khởi động dự án:
   ```bash
   dotnet run
   ```
3. **Truy cập Backend:**
   - Trang quản trị Admin CMS: [http://localhost:5173](http://localhost:5173) (Đăng nhập bằng tài khoản admin).
   - Tài liệu API (Swagger UI): [http://localhost:5173/swagger](http://localhost:5173/swagger)

*(Lưu ý: Nếu đây là lần đầu tiên chạy, hệ thống EF Core sẽ tự động ánh xạ Entity và tạo Database `HaiCMS_DB` dựa trên chuỗi kết nối trong `appsettings.json`).*

### Bước 2: Khởi chạy Frontend (ReactJS)
1. Mở một Terminal MỚI, trỏ vào thư mục Frontend:
   ```bash
   cd "cms.frontend"
   ```
2. Cài đặt toàn bộ thư viện npm:
   ```bash
   npm install
   ```
3. Chạy môi trường Development (Sẽ tự động khởi chạy bằng Vite/Webpack):
   ```bash
   npm start
   ```
4. Trình duyệt sẽ tự động mở trang web cửa hàng tại [http://localhost:3000](http://localhost:3000).

---

## 💡 Hướng Dẫn Trải Nghiệm (Testing Guide)
Để thấy được toàn bộ sức mạnh của dự án, bạn nên thử các luồng (Flow) sau:
1. **Flow Đặt hàng & Gửi Mail (End-to-End):**
   - Đăng ký một tài khoản mới với **Email thật của bạn** trên Frontend.
   - Chọn giày, chọn Size, thêm vào giỏ hàng và tiến hành Thanh toán.
   - Ngay khi đặt hàng thành công, hãy mở Hộp thư Gmail của bạn. Bạn sẽ nhận được một **Hóa đơn điện tử cực đẹp** với đầy đủ chi tiết: Mã đơn, Thời gian, Tên người nhận, Địa chỉ, Phương thức thanh toán (COD), và Tổng tiền.
2. **Flow Quản lý Admin:**
   - Đăng nhập vào Backend (Cổng 5173).
   - Mở Đơn hàng vừa đặt. Thử **Thay đổi trạng thái** sang "Đang giao". Kiểm tra lại Email, bạn sẽ thấy thông báo cập nhật trạng thái đơn hàng.
   - Thử thêm Danh mục sản phẩm mới, upload Logo. Mở lại Frontend trang chủ sẽ thấy Logo hình tròn chuyên nghiệp hiện lên.

---

**🎓 Dự án được phát triển bởi: Trần Ngọc Hải - MSSV: 2123110179**
*Đây là đồ án toàn diện thể hiện kỹ năng Full-Stack (ReactJS & ASP.NET Core MVC/API), kiến trúc phần mềm và xử lý nghiệp vụ E-commerce chuyên nghiệp thực tế.*
