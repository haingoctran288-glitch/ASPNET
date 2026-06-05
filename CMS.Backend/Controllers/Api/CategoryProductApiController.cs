using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoryProductApi
        [HttpGet]
        public async Task<IActionResult> GetCategoryProducts()
        {
            var items = await _context.CategoriesProducts.ToListAsync();
            return Ok(items);
        }

        // GET: api/CategoryProductApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryProduct(int id)
        {
            var item = await _context.CategoriesProducts.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
