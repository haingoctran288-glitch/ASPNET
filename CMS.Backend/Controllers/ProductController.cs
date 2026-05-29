using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.Products.Include(x => x.CategoryProduct).ToList();
            return View(list);
        }

        public IActionResult Create()
        {
            ViewData["CategoryProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model)
        {
            ModelState.Remove("CategoryProduct");
            if (ModelState.IsValid)
            {
                _context.Products.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        
        public IActionResult Details(int id)
        {
            var model = _context.Products.Include(x => x.CategoryProduct).FirstOrDefault(m => m.Id == id);
            if (model == null) return NotFound();
            return View(model);
        }
        public IActionResult Edit(int id)
        {
            var model = _context.Products.Find(id);
            if (model == null) return NotFound();
            ViewData["CategoryProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Product model)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("CategoryProduct");
            if (ModelState.IsValid)
            {
                _context.Products.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var model = _context.Products.Find(id);
            if (model == null) return NotFound();
            
            try
            {
                _context.Products.Remove(model);
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
