using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderApi
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var items = await _context.Orders.ToListAsync();
            return Ok(items);
        }

        // GET: api/OrderApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var item = await _context.Orders.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
