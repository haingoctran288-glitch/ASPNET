using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.OrderDetails.Include(x => x.Order).Include(x => x.Product).ToList();
            return View(list);
        }

        public IActionResult Create()
        {
            ViewData["OrderId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Orders, "Id", "Id");
            ViewData["ProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Products, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(OrderDetail model)
        {
            ModelState.Remove("Order");
            ModelState.Remove("Product");
            if (ModelState.IsValid)
            {
                _context.OrderDetails.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["OrderId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Orders, "Id", "Id", model.OrderId);
            ViewData["ProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Products, "Id", "Name", model.ProductId);
            return View(model);
        }

        
        public IActionResult Details(int id)
        {
            var model = _context.OrderDetails.Include(x => x.Order).Include(x => x.Product).FirstOrDefault(m => m.Id == id);
            if (model == null) return NotFound();
            return View(model);
        }
        public IActionResult Edit(int id)
        {
            var model = _context.OrderDetails.Find(id);
            if (model == null) return NotFound();
            ViewData["OrderId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Orders, "Id", "Id", model.OrderId);
            ViewData["ProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Products, "Id", "Name", model.ProductId);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, OrderDetail model)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("Order");
            ModelState.Remove("Product");
            if (ModelState.IsValid)
            {
                _context.OrderDetails.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["OrderId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Orders, "Id", "Id", model.OrderId);
            ViewData["ProductId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Products, "Id", "Name", model.ProductId);
            return View(model);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var model = _context.OrderDetails.Find(id);
            if (model == null) return NotFound();
            
            try
            {
                _context.OrderDetails.Remove(model);
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
