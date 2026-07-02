using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadApiController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadApiController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("UploadCKEditor")]
        public async Task<IActionResult> UploadCKEditor(IFormFile upload)
        {
            if (upload != null && upload.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(upload.FileName);
                var uploadPath = Path.Combine(_env.WebRootPath, "uploads");
                
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }

                var url = $"/uploads/{fileName}";

                return Ok(new
                {
                    uploaded = 1,
                    fileName = fileName,
                    url = url
                });
            }

            return BadRequest(new { uploaded = 0, error = new { message = "Lỗi upload" } });
        }
    }
}
