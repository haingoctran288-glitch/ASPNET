using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductApi
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts([FromQuery] string? search = null, [FromQuery] int? categoryId = null, [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var items = await query.ToListAsync();
            return Ok(items);
        }

        // GET: api/ProductApi/newest
        [HttpGet("newest")]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetNewestProducts()
        {
            var items = await _context.Products.Where(p => p.ProductTag == "Mới").Take(3).ToListAsync();
            // Fallback nếu chưa gắn tag nào để tránh trang bị trống
            if (!items.Any())
            {
                items = await _context.Products.OrderByDescending(p => p.Id).Take(3).ToListAsync();
            }
            return Ok(items);
        }

        // GET: api/ProductApi/hot
        [HttpGet("hot")]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetHotProducts()
        {
            var items = await _context.Products.Where(p => p.ProductTag == "HOT").Take(3).ToListAsync();
            // Fallback nếu chưa gắn tag nào để tránh trang bị trống
            if (!items.Any())
            {
                items = await _context.Products.OrderBy(p => p.StockQuantity).Take(3).ToListAsync();
            }
            return Ok(items);
        }

        // GET: api/ProductApi/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CMS.Data.Entities.Product), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
            }

            return Ok(product);
        }

        // GET: api/ProductApi/category/5
        [HttpGet("category/{categoryId}")]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            var items = await _context.Products.Where(p => p.CategoryProductId == categoryId).ToListAsync();
            return Ok(items);
        }
    }
}
