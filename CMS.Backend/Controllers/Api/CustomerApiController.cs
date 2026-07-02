using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Controllers.Api
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập Họ tên")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập địa chỉ")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string Password { get; set; }
    }

    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập Email")]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class VerifyOtpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Otp { get; set; }
    }

    public class ResetPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Otp { get; set; }
        
        [Required]
        [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string NewPassword { get; set; }
    }

    public class OtpState
    {
        public string Otp { get; set; }
        public DateTime Expiry { get; set; }
        public int ResendCount { get; set; }
        public DateTime? LockoutEnd { get; set; }
    }

    /// <summary>
    /// API xử lý Đăng nhập và Đăng ký cho Khách hàng
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private static readonly Dictionary<string, OtpState> _otpStorage = new();

        public CustomerApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Đăng nhập Khách hàng
        /// </summary>
        /// <param name="req">Thông tin đăng nhập gồm Email và Mật khẩu</param>
        /// <returns>Thông tin khách hàng nếu thành công</returns>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == req.Email && c.Password == req.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        /// <summary>
        /// Đăng ký Khách hàng mới
        /// </summary>
        /// <param name="req">Thông tin đăng ký gồm Họ tên, Email, SĐT, Địa chỉ, Mật khẩu</param>
        /// <returns>Thông báo thành công</returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra email đã tồn tại chưa
            if (await _context.Customers.AnyAsync(c => c.Email == req.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng." });
            }

            var customer = new Customer
            {
                FullName = req.FullName,
                Email = req.Email,
                Phone = req.Phone,
                Address = req.Address,
                Password = req.Password // Lưu ý: Thực tế nên băm mật khẩu (Hash), ở đây làm đơn giản theo yêu cầu
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == req.Email);
            if (customer == null) return NotFound(new { message = "Email không tồn tại trong hệ thống." });

            if (!_otpStorage.ContainsKey(req.Email))
            {
                _otpStorage[req.Email] = new OtpState { ResendCount = 0 };
            }

            var state = _otpStorage[req.Email];

            if (state.LockoutEnd.HasValue)
            {
                if (DateTime.Now < state.LockoutEnd.Value)
                {
                    var waitMinutes = Math.Ceiling((state.LockoutEnd.Value - DateTime.Now).TotalMinutes);
                    return StatusCode(429, new { message = $"Bạn đã yêu cầu OTP quá số lần cho phép. Vui lòng thử lại sau {waitMinutes} phút." });
                }
                else
                {
                    // Reset after lockout
                    state.LockoutEnd = null;
                    state.ResendCount = 0;
                }
            }

            if (state.ResendCount >= 3)
            {
                state.LockoutEnd = DateTime.Now.AddMinutes(20);
                return StatusCode(429, new { message = "Bạn đã yêu cầu OTP quá 3 lần. Chức năng bị khóa trong 20 phút." });
            }

            // Generate 6 digit OTP
            var random = new Random();
            string otp = random.Next(100000, 999999).ToString();
            
            state.Otp = otp;
            state.Expiry = DateTime.Now.AddSeconds(120);
            state.ResendCount++;

            _ = CMS.Backend.Services.EmailService.SendOtpEmail(customer.Email, customer.FullName, otp);

            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn.", expirySeconds = 120, resendCount = state.ResendCount });
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!_otpStorage.TryGetValue(req.Email, out var state))
            {
                return BadRequest(new { message = "Không tìm thấy yêu cầu xác thực cho email này." });
            }

            if (DateTime.Now > state.Expiry)
            {
                return BadRequest(new { message = "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới." });
            }

            if (state.Otp != req.Otp)
            {
                return BadRequest(new { message = "Mã OTP không chính xác." });
            }

            return Ok(new { message = "Xác thực OTP thành công." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!_otpStorage.TryGetValue(req.Email, out var state))
            {
                return BadRequest(new { message = "Không tìm thấy yêu cầu đổi mật khẩu." });
            }

            if (DateTime.Now > state.Expiry || state.Otp != req.Otp)
            {
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn." });
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == req.Email);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng." });

            customer.Password = req.NewPassword;
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            // Clear state
            _otpStorage.Remove(req.Email);

            return Ok(new { message = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
        }
    }
}
