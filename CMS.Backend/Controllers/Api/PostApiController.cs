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
        public async Task<IActionResult> GetPosts()
        {
            var items = await _context.Posts.ToListAsync();
            return Ok(items);
        }

        // GET: api/PostApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var item = await _context.Posts.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
