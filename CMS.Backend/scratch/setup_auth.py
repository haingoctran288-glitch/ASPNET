import os
import re

base_dir = r"c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\asp-net-main\asp-net-main\CMS.Backend"
controllers_dir = os.path.join(base_dir, "Controllers")
views_account_dir = os.path.join(base_dir, "Views", "Account")
models_dir = os.path.join(base_dir, "Models")
helpers_dir = os.path.join(base_dir, "Helpers")
program_cs = os.path.join(base_dir, "Program.cs")
layout_cs = os.path.join(base_dir, "Views", "Shared", "_Layout.cshtml")

# Create dirs if not exist
for d in [views_account_dir, models_dir, helpers_dir]:
    os.makedirs(d, exist_ok=True)

# 1. SecurityHelper.cs
security_helper_code = """using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Helpers
{
    public static class SecurityHelper
    {
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password)) return string.Empty;
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
        
        public static bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return StringComparer.OrdinalIgnoreCase.Compare(hashOfInput, hash) == 0;
        }
    }
}
"""
with open(os.path.join(helpers_dir, "SecurityHelper.cs"), "w", encoding="utf-8") as f:
    f.write(security_helper_code)

# 2. LoginViewModel.cs
login_vm_code = """using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
"""
with open(os.path.join(models_dir, "LoginViewModel.cs"), "w", encoding="utf-8") as f:
    f.write(login_vm_code)

# 3. AccountController.cs
account_controller_code = """using CMS.Backend.Helpers;
using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);
                
                // Allow plain text login for legacy seeded data, but hash check for new ones
                if (user != null && (SecurityHelper.VerifyPassword(model.Password, user.PasswordHash) || user.PasswordHash == model.Password))
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Role, user.Role),
                        new Claim("FullName", user.FullName)
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme, 
                        new ClaimsPrincipal(claimsIdentity),
                        new AuthenticationProperties { IsPersistent = true });

                    return RedirectToAction("Index", "Home");
                }
                
                ModelState.AddModelError(string.Empty, "Tài khoản hoặc mật khẩu không chính xác.");
            }

            return View(model);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }

        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
"""
with open(os.path.join(controllers_dir, "AccountController.cs"), "w", encoding="utf-8") as f:
    f.write(account_controller_code)

# 4. Login.cshtml
login_view_code = """@model CMS.Backend.Models.LoginViewModel
@{
    Layout = null;
    ViewData["Title"] = "Đăng nhập CMS";
}
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"]</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-card {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            padding: 3rem 2rem;
            width: 100%;
            max-width: 450px;
        }
        .form-control {
            border-radius: 10px;
            padding: 0.8rem 1rem;
            background-color: #f8f9fc;
            border: 1px solid #edf2f9;
        }
        .form-control:focus {
            box-shadow: none;
            border-color: #4e73df;
            background-color: #fff;
        }
        .btn-primary {
            background-color: #4e73df;
            border: none;
            border-radius: 10px;
            padding: 0.8rem;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn-primary:hover {
            background-color: #2e59d9;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="text-center mb-4">
            <h2 class="fw-bold text-dark">CMS Admin</h2>
            <p class="text-muted">Đăng nhập để quản lý hệ thống</p>
        </div>

        <form asp-action="Login" method="post">
            <div asp-validation-summary="ModelOnly" class="text-danger mb-3 text-center small fw-bold"></div>
            
            <div class="mb-3">
                <label asp-for="Username" class="form-label text-muted small fw-bold">Tài khoản</label>
                <input asp-for="Username" class="form-control" placeholder="Nhập tài khoản (ví dụ: admin)" />
                <span asp-validation-for="Username" class="text-danger small"></span>
            </div>
            
            <div class="mb-4">
                <label asp-for="Password" class="form-label text-muted small fw-bold">Mật khẩu</label>
                <input asp-for="Password" class="form-control" type="password" placeholder="Nhập mật khẩu" />
                <span asp-validation-for="Password" class="text-danger small"></span>
            </div>
            
            <button type="submit" class="btn btn-primary w-100 mb-3">ĐĂNG NHẬP</button>
            <div class="text-center text-muted small">
                Tài khoản mẫu: admin / admin123
            </div>
        </form>
    </div>
</body>
</html>
"""
with open(os.path.join(views_account_dir, "Login.cshtml"), "w", encoding="utf-8") as f:
    f.write(login_view_code)

# 5. AccessDenied.cshtml
access_denied_code = """@{
    ViewData["Title"] = "Không có quyền truy cập";
}
<div class="container text-center py-5 mt-5">
    <h1 class="display-1 fw-bold text-danger">403</h1>
    <h3 class="mb-4">Truy cập bị từ chối</h3>
    <p class="text-muted mb-4">Bạn không có quyền truy cập vào chức năng này. Vui lòng liên hệ Quản trị viên.</p>
    <a asp-controller="Home" asp-action="Index" class="btn btn-primary rounded-pill px-4">Quay lại trang chủ</a>
</div>
"""
with open(os.path.join(views_account_dir, "AccessDenied.cshtml"), "w", encoding="utf-8") as f:
    f.write(access_denied_code)

# 6. Patch Program.cs
with open(program_cs, "r", encoding="utf-8") as f:
    prog_content = f.read()

if "AddAuthentication" not in prog_content:
    import_str = "using Microsoft.AspNetCore.Authentication.Cookies;\n"
    auth_service_str = """
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromHours(2);
    });
"""
    prog_content = import_str + prog_content
    prog_content = prog_content.replace("builder.Services.AddControllersWithViews();", "builder.Services.AddControllersWithViews();\n" + auth_service_str)
    
    if "app.UseAuthentication();" not in prog_content:
        prog_content = prog_content.replace("app.UseRouting();\n", "app.UseRouting();\n\napp.UseAuthentication();\n")

with open(program_cs, "w", encoding="utf-8") as f:
    f.write(prog_content)

# 7. Patch Controllers to add [Authorize]
for filename in os.listdir(controllers_dir):
    if filename.endswith("Controller.cs") and filename != "AccountController.cs":
        filepath = os.path.join(controllers_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "[Authorize]" not in content:
            content = "using Microsoft.AspNetCore.Authorization;\n" + content
            if filename == "UserController.cs":
                content = content.replace("public class UserController", "[Authorize(Roles = \"Admin\")]\n    public class UserController")
                
                # Also hash password in UserController Create and Edit
                create_replace = """public IActionResult Create(User model)
        {
            model.PasswordHash = CMS.Backend.Helpers.SecurityHelper.HashPassword(model.PasswordHash);"""
                content = content.replace("public IActionResult Create(User model)\n        {", create_replace)
                
                edit_replace = """public IActionResult Edit(int id, User model)
        {
            if (id != model.Id) return NotFound();

            model.PasswordHash = CMS.Backend.Helpers.SecurityHelper.HashPassword(model.PasswordHash);"""
                content = content.replace("public IActionResult Edit(int id, User model)\n        {\n            if (id != model.Id) return NotFound();", edit_replace)
                
            else:
                content = content.replace(f"public class {filename.split('.')[0]}", f"[Authorize]\n    public class {filename.split('.')[0]}")
                
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

# 8. Patch _Layout.cshtml to hide sidebar if not authenticated and show User Name / Logout button
with open(layout_cs, "r", encoding="utf-8") as f:
    layout_content = f.read()

# Make User info dynamic in Topbar
user_topbar = """<div class="dropdown">
                        <a class="text-decoration-none text-dark d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="fw-semibold">Ngọc Hải</span>
                            <img src="https://ui-avatars.com/api/?name=Ngoc+Hai&background=4e73df&color=fff&rounded=true" width="35" height="35" alt="Avatar">
                        </a>"""
dynamic_user_topbar = """<div class="dropdown">
                        <a class="text-decoration-none text-dark d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="fw-semibold">@(User.Identity.IsAuthenticated ? User.Claims.FirstOrDefault(c => c.Type == "FullName")?.Value ?? User.Identity.Name : "Khách")</span>
                            <img src="https://ui-avatars.com/api/?name=@(User.Identity.Name)&background=4e73df&color=fff&rounded=true" width="35" height="35" alt="Avatar">
                        </a>"""
layout_content = layout_content.replace(user_topbar, dynamic_user_topbar)

# Replace Logout static link to Account/Logout
logout_static = """<li><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout</a></li>"""
logout_dynamic = """<li><a class="dropdown-item" asp-controller="Account" asp-action="Logout"><i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Đăng xuất</a></li>"""
layout_content = layout_content.replace(logout_static, logout_dynamic)

# Only render Sidebar and Topbar if Authenticated? Actually since all controllers have [Authorize], unauthenticated users will be redirected to Login. So Layout doesn't need to change much, just the dynamic name.

with open(layout_cs, "w", encoding="utf-8") as f:
    f.write(layout_content)

print("Auth setup complete.")
