using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/UserApi
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.User>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUsers([FromQuery] string? search = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.Username.Contains(search) || u.FullName.Contains(search));
            }

            var items = await query.ToListAsync();
            return Ok(items);
        }

        // GET: api/UserApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var item = await _context.Users.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
