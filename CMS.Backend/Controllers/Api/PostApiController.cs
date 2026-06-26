using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PostApi
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Post>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPosts()
        {
            var items = await _context.Posts.ToListAsync();
            return Ok(items);
        }

        // GET: api/PostApi/newest
        [HttpGet("newest")]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Post>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetNewestPosts()
        {
            var items = await _context.Posts.OrderByDescending(p => p.CreatedDate).Take(3).ToListAsync();
            return Ok(items);
        }

        // GET: api/PostApi/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CMS.Data.Entities.Post), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPost(int id)
        {
            var item = await _context.Posts.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }

        // GET: api/PostApi/category/5
        [HttpGet("category/{categoryId}")]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Post>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPostsByCategory(int categoryId)
        {
            var items = await _context.Posts.Where(p => p.CategoryId == categoryId).OrderByDescending(p => p.CreatedDate).ToListAsync();
            return Ok(items);
        }
    }
}
