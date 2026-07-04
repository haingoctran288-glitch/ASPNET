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
        public async Task<IActionResult> Edit(int id, Order model)
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
                await _context.SaveChangesAsync();

                if (oldOrder != null && oldOrder.Status != model.Status && model.Status != 0) // 0 is usually pending/Chờ duyệt
                {
                    var customer = oldOrder.Customer ?? _context.Customers.Find(model.CustomerId);
                    if (customer != null && !string.IsNullOrEmpty(customer.Email))
                    {
                        decimal total = oldOrder.OrderDetails?.Sum(x => x.Quantity * x.UnitPrice) ?? 0;
                        string itemsHtml = "";
                        if (oldOrder.OrderDetails != null)
                        {
                            foreach (var item in oldOrder.OrderDetails)
                            {
                                string pName = item.Product != null ? item.Product.Name : "Sản phẩm";
                                string sizeInfo = !string.IsNullOrEmpty(item.Size) ? $"<br/><small style='color: #858796;'>Size: {item.Size}</small>" : "";
                                itemsHtml += $@"
                                    <tr>
                                        <td style='padding: 10px 0; border-bottom: 1px dashed #e3e6f0;'>
                                            <strong>{pName}</strong>{sizeInfo}
                                        </td>
                                        <td style='padding: 10px 0; border-bottom: 1px dashed #e3e6f0; text-align: center;'>x{item.Quantity}</td>
                                        <td style='padding: 10px 0; border-bottom: 1px dashed #e3e6f0; text-align: right;'><strong>{(item.Quantity * item.UnitPrice).ToString("N0")} đ</strong></td>
                                    </tr>";
                            }
                        }
                        await CMS.Backend.Services.EmailService.SendOrderStatusUpdateEmail(customer.Email, customer.FullName, model.Id, total, model.Status, itemsHtml);
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Cancel(int id)
        {
            var model = await _context.Orders
                .Include(o => o.OrderDetails)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);
            
            if (model == null) return NotFound();
            
            if (model.Status != 3 && model.Status != 2) // Cannot cancel if already cancelled or completed
            {
                model.Status = 3; // 3 = Cancelled
                
                // Trả lại số lượng tồn kho
                if (model.OrderDetails != null)
                {
                    foreach (var detail in model.OrderDetails)
                    {
                        var product = await _context.Products.FindAsync(detail.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity += detail.Quantity;
                        }
                    }
                }

                _context.Orders.Update(model);
                await _context.SaveChangesAsync();
                
                // Send email
                var customer = model.Customer;
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    decimal total = model.OrderDetails?.Sum(x => x.Quantity * x.UnitPrice) ?? 0;
                    string itemsHtml = "";
                    if (model.OrderDetails != null)
                    {
                        foreach (var item in model.OrderDetails)
                        {
                            var pName = item.Product != null ? item.Product.Name : "Sản phẩm";
                            string sizeInfo = !string.IsNullOrEmpty(item.Size) ? $"<br/><small style='color: #858796;'>Size: {item.Size}</small>" : "";
                            itemsHtml += $@"
                                <tr>
                                    <td style='padding: 10px 0; border-bottom: 1px dashed #e3e6f0;'>
                                        <strong>{pName}</strong>{sizeInfo}
                                    </td>
                                    <td style='padding: 10px 0; border-bottom: 1px dashed #e3e6f0; text-align: center;'>x{item.Quantity}</td>
                                    <td style='padding: 10px 0; border-bottom: 1px dashed #e3e6f0; text-align: right;'><strong>{(item.Quantity * item.UnitPrice).ToString("N0")} đ</strong></td>
                                </tr>";
                        }
                    }
                    await CMS.Backend.Services.EmailService.SendOrderStatusUpdateEmail(customer.Email, customer.FullName, model.Id, total, 3, itemsHtml);
                }
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
