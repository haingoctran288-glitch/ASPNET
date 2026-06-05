using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoryApi
        [HttpGet]
        public async Task<IActionResult> GetCategorys()
        {
            var items = await _context.Categories.ToListAsync();
            return Ok(items);
        }

        // GET: api/CategoryApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var item = await _context.Categories.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
