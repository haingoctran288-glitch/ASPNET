import os

base_dir = r"c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\asp-net-main\asp-net-main\CMS.Backend"
api_dir = os.path.join(base_dir, "Controllers", "Api")

os.makedirs(api_dir, exist_ok=True)

entities = ["Category", "CategoryProduct", "Customer", "Order", "OrderDetail", "Post", "User"]

for entity in entities:
    # Pluralize simply by adding 's' for these specific entities (except Category -> Categories, CategoryProduct -> CategoriesProducts)
    db_set = entity + "s"
    if entity == "Category":
        db_set = "Categories"
    elif entity == "CategoryProduct":
        db_set = "CategoriesProducts"

    controller_code = f"""using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{{
    [Route("api/[controller]")]
    [ApiController]
    public class {entity}ApiController : ControllerBase
    {{
        private readonly ApplicationDbContext _context;

        public {entity}ApiController(ApplicationDbContext context)
        {{
            _context = context;
        }}

        // GET: api/{entity}Api
        [HttpGet]
        public async Task<IActionResult> Get{entity}s()
        {{
            var items = await _context.{db_set}.ToListAsync();
            return Ok(items);
        }}

        // GET: api/{entity}Api/5
        [HttpGet("{{id}}")]
        public async Task<IActionResult> Get{entity}(int id)
        {{
            var item = await _context.{db_set}.FindAsync(id);

            if (item == null)
            {{
                return NotFound(new {{ message = "Không tìm thấy dữ liệu" }});
            }}

            return Ok(item);
        }}
    }}
}}
"""
    file_path = os.path.join(api_dir, f"{entity}ApiController.cs")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(controller_code)

print("API Controllers generated successfully.")
