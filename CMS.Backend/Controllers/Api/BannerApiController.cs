using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannerApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BannerApi
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Banner>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBanners()
        {
            var banners = await _context.Banners
                .Where(b => b.IsActive)
                .OrderByDescending(b => b.Id)
                .ToListAsync();
            return Ok(banners);
        }
    }
}
