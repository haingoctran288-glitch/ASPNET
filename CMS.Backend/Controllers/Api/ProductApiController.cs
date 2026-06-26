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
        public async Task<IActionResult> GetProducts()
        {
            var items = await _context.Products.ToListAsync();
            return Ok(items);
        }

        // GET: api/ProductApi/newest
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewestProducts()
        {
            var items = await _context.Products.Where(p => p.ProductTag == "Mới").ToListAsync();
            // Fallback nếu chưa gắn tag nào để tránh trang bị trống
            if (!items.Any())
            {
                items = await _context.Products.OrderByDescending(p => p.Id).Take(3).ToListAsync();
            }
            return Ok(items);
        }

        // GET: api/ProductApi/hot
        [HttpGet("hot")]
        public async Task<IActionResult> GetHotProducts()
        {
            var items = await _context.Products.Where(p => p.ProductTag == "HOT").ToListAsync();
            // Fallback nếu chưa gắn tag nào để tránh trang bị trống
            if (!items.Any())
            {
                items = await _context.Products.OrderBy(p => p.StockQuantity).Take(3).ToListAsync();
            }
            return Ok(items);
        }

        // GET: api/ProductApi/5
        [HttpGet("{id}")]
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
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            var items = await _context.Products.Where(p => p.CategoryProductId == categoryId).ToListAsync();
            return Ok(items);
        }
    }
}
