using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetailApi
        [HttpGet]
        public async Task<IActionResult> GetOrderDetails()
        {
            var items = await _context.OrderDetails.ToListAsync();
            return Ok(items);
        }

        // GET: api/OrderDetailApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            var item = await _context.OrderDetails.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
