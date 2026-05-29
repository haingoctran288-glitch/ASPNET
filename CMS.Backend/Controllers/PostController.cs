using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.Posts.Include(x => x.Category).ToList();
            return View(list);
        }

        public IActionResult Create()
        {
            ViewData["CategoryId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model)
        {
            ModelState.Remove("Category");
            if (ModelState.IsValid)
            {
                _context.Posts.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        
        public IActionResult Details(int id)
        {
            var model = _context.Posts.Include(x => x.Category).FirstOrDefault(m => m.Id == id);
            if (model == null) return NotFound();
            return View(model);
        }
        public IActionResult Edit(int id)
        {
            var model = _context.Posts.Find(id);
            if (model == null) return NotFound();
            ViewData["CategoryId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Post model)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("Category");
            if (ModelState.IsValid)
            {
                _context.Posts.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var model = _context.Posts.Find(id);
            if (model == null) return NotFound();
            
            try
            {
                _context.Posts.Remove(model);
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                TempData["ErrorMessage"] = "Không thể xóa vì dữ liệu này đang được liên kết với dữ liệu khác.";
                return RedirectToAction(nameof(Index));
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
