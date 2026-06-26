using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{

    public class CheckoutRequest {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<CartItemRequest> Items { get; set; }
    }
    public class CartItemRequest {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string? Size { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
        {
            if (req.Items == null || !req.Items.Any()) return BadRequest("Giỏ hàng rỗng!");
            
            var order = new CMS.Data.Entities.Order {
                CustomerId = req.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0, // Chờ duyệt
                Notes = req.Notes
            };
            
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach(var item in req.Items) {
                var detail = new CMS.Data.Entities.OrderDetail {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Size = item.Size
                };
                _context.OrderDetails.Add(detail);
                
                // Trừ tồn kho
                var p = await _context.Products.FindAsync(item.ProductId);
                if (p != null) {
                    p.StockQuantity -= item.Quantity;
                }
            }
            await _context.SaveChangesAsync();

            // Lấy thông tin khách hàng để gửi email
            var customer = await _context.Customers.FindAsync(req.CustomerId);
            if (customer != null && !string.IsNullOrEmpty(customer.Email))
            {
                decimal totalAmount = req.Items.Sum(i => i.Quantity * i.UnitPrice);
                // Gọi EmailService để gửi mail (bất đồng bộ)
                _ = CMS.Backend.Services.EmailService.SendOrderConfirmationEmail(customer.Email, customer.FullName, order.Id, totalAmount);
            }

            return Ok(new { message = "Đặt hàng thành công", orderId = order.Id });
        }

        [HttpGet("customer/{customerId}")]
        [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    TotalAmount = o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice),
                    Details = o.OrderDetails.Select(d => new {
                        d.ProductId,
                        d.Product.Name,
                        d.Product.ImageUrl,
                        d.Quantity,
                        d.UnitPrice,
                        d.Size
                    })
                })
                .ToListAsync();
            return Ok(orders);
        }


        // GET: api/OrderApi
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CMS.Data.Entities.Order>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrders([FromQuery] int? customerId = null, [FromQuery] int? status = null)
        {
            var query = _context.Orders.AsQueryable();

            if (customerId.HasValue)
            {
                query = query.Where(o => o.CustomerId == customerId.Value);
            }

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var items = await query.ToListAsync();
            return Ok(items);
        }

        // GET: api/OrderApi/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CMS.Data.Entities.Order), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrder(int id)
        {
            var item = await _context.Orders.FindAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu" });
            }

            return Ok(item);
        }
    }
}
