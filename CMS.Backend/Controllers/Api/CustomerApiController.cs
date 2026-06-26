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

    /// <summary>
    /// API xử lý Đăng nhập và Đăng ký cho Khách hàng
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

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
    }
}
