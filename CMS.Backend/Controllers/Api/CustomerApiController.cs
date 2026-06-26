using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{

    public class LoginRequest { public string Email { get; set; } public string Password { get; set; } }
    public class RegisterRequest { public string FullName { get; set; } public string Email { get; set; } public string Password { get; set; } }

    [Route("api/[controller]")]
    [ApiController]
    public class CustomerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public class UpdateProfileRequest {
            public int Id { get; set; }
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
        {
            var customer = await _context.Customers.FindAsync(req.Id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy user!" });
            
            customer.FullName = req.FullName;
            customer.Phone = req.Phone;
            customer.Address = req.Address;
            
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == req.Email && c.Password == req.Password);
            if(customer == null) return Unauthorized(new { message = "Sai email hoặc mật khẩu!" });
            return Ok(customer);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if(await _context.Customers.AnyAsync(c => c.Email == req.Email)) return BadRequest(new { message = "Email đã tồn tại!" });
            var cus = new Customer { FullName = req.FullName, Email = req.Email, Password = req.Password };
            _context.Customers.Add(cus); 
            await _context.SaveChangesAsync();
            return Ok(cus);
        }


        // GET: api/CustomerApi
        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var items = await _context.Customers.ToListAsync();
            return Ok(items);
        }

        // GET: api/CustomerApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var item = await _context.Customers.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
