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
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.CategoryProduct>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategoryProducts([FromQuery] string? search = null)
        {
            var query = _context.CategoriesProducts.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Name.Contains(search) || c.Description.Contains(search));
            }

            var items = await query.ToListAsync();
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
