using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.Orders.Include(x => x.Customer).OrderByDescending(x => x.OrderDate).ThenByDescending(x => x.Id).ToList();
            return View(list);
        }

        public IActionResult Create()
        {
            ViewData["CustomerId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Order model)
        {
            ModelState.Remove("Customer");
            ModelState.Remove("OrderDetails");
            if (ModelState.IsValid)
            {
                _context.Orders.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CustomerId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        
        public IActionResult Details(int id)
        {
            var model = _context.Orders
                .Include(x => x.Customer)
                .Include(x => x.OrderDetails)
                .ThenInclude(d => d.Product)
                .FirstOrDefault(m => m.Id == id);
            if (model == null) return NotFound();
            return View(model);
        }
        public IActionResult Edit(int id)
        {
            var model = _context.Orders.Find(id);
            if (model == null) return NotFound();
            ViewData["CustomerId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Order model)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("Customer");
            ModelState.Remove("OrderDetails");
            if (ModelState.IsValid)
            {
                var oldOrder = _context.Orders.AsNoTracking()
                    .Include(o => o.OrderDetails)
                    .Include(o => o.Customer)
                    .FirstOrDefault(o => o.Id == id);
                
                _context.Orders.Update(model);
                _context.SaveChanges();

                if (oldOrder != null && oldOrder.Status != model.Status && 
                    (model.Status == "Đã xác nhận" || model.Status == "Đang giao hàng" || model.Status == "Đã giao" || model.Status == "Đã hủy"))
                {
                    var customer = oldOrder.Customer ?? _context.Customers.Find(model.CustomerId);
                    if (customer != null && !string.IsNullOrEmpty(customer.Email))
                    {
                        decimal total = oldOrder.OrderDetails?.Sum(x => x.Quantity * x.UnitPrice) ?? 0;
                        _ = CMS.Backend.Services.EmailService.SendOrderStatusUpdateEmail(customer.Email, customer.FullName, model.Id, total, model.Status);
                    }
                }

                return RedirectToAction(nameof(Index));
            }
            ViewData["CustomerId"] = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var model = _context.Orders.Find(id);
            if (model == null) return NotFound();
            
            try
            {
                _context.Orders.Remove(model);
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
