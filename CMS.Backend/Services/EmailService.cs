using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Services
{
    public class EmailService
    {
        public static async Task SendOrderConfirmationEmail(string toEmail, string customerName, int orderId, decimal totalAmount)
        {
            try
            {
                // BẠN VUI LÒNG ĐIỀN ĐỊA CHỈ GMAIL CỦA BẠN VÀO DÒNG DƯỚI ĐÂY THAY CHO "GMAIL_CUA_BAN_O_DAY@gmail.com"
                var fromAddress = new MailAddress("haingoctran288@gmail.com", "Hai Sport");
                var toAddress = new MailAddress(toEmail);
                
                // Mật khẩu ứng dụng (App Password) bạn vừa cung cấp
                const string fromPassword = "ydab mdzv dehn kqnq"; 
                const string subject = "Xác nhận đơn hàng thành công từ Hai Sport";
                
                string body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #4e73df; text-align: center;'>Cảm ơn bạn đã mua hàng tại Hai Sport!</h2>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Đơn hàng của bạn đã được hệ thống ghi nhận thành công. Dưới đây là thông tin tóm tắt đơn hàng của bạn:</p>
                        <div style='background-color: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            <p style='margin: 5px 0;'>Mã đơn hàng: <strong style='color: #e74a3b;'>#{orderId}</strong></p>
                            <p style='margin: 5px 0;'>Tổng thanh toán: <strong>{totalAmount.ToString("N0")} VNĐ</strong></p>
                            <p style='margin: 5px 0;'>Tình trạng: <span style='color: #f6c23e; font-weight: bold;'>Chờ duyệt</span></p>
                        </div>
                        <p>Chúng tôi sẽ sớm liên hệ với bạn qua số điện thoại để xác nhận giao hàng. Vui lòng giữ liên lạc nhé!</p>
                        <br/>
                        <p style='text-align: center; color: #858796; font-size: 12px;'>Đây là email tự động, vui lòng không phản hồi lại email này.</p>
                    </div>
                ";

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                })
                {
                    await smtp.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email xác nhận: " + ex.Message);
            }
        }

        public static async Task SendOrderStatusUpdateEmail(string toEmail, string customerName, int orderId, decimal totalAmount, int newStatusInt)
        {
            try
            {
                var fromAddress = new MailAddress("haingoctran288@gmail.com", "Hai Sport");
                var toAddress = new MailAddress(toEmail);
                const string fromPassword = "ydab mdzv dehn kqnq"; 
                string subject = $"Cập nhật trạng thái đơn hàng #{orderId}";
                
                string newStatus = newStatusInt == 1 ? "Đang giao hàng" : (newStatusInt == 2 ? "Đã giao/Hoàn thành" : "Đã cập nhật");
                string statusColor = newStatusInt == 1 ? "#0dcaf0" : (newStatusInt == 2 ? "#20c997" : "#198754");
                
                string body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #dc3545; text-align: center;'>Thông báo trạng thái đơn hàng!</h2>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Đơn hàng <strong>#{orderId}</strong> của bạn vừa được cập nhật trạng thái mới.</p>
                        <div style='background-color: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            <p style='margin: 5px 0;'>Tổng thanh toán: <strong>{totalAmount.ToString("N0")} VNĐ</strong></p>
                            <p style='margin: 5px 0;'>Tình trạng mới: <span style='color: {statusColor}; font-weight: bold; text-transform: uppercase;'>{newStatus}</span></p>
                        </div>
                        <p>Cảm ơn bạn đã tin tưởng mua sắm tại Hai Sport!</p>
                        <br/>
                        <p style='text-align: center; color: #858796; font-size: 12px;'>Đây là email tự động, vui lòng không phản hồi lại email này.</p>
                    </div>
                ";

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress) { Subject = subject, Body = body, IsBodyHtml = true })
                {
                    await smtp.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email cập nhật trạng thái: " + ex.Message);
            }
        }

        public static async Task SendOrderModifiedEmail(string toEmail, string customerName, int orderId, decimal newTotalAmount)
        {
            try
            {
                var fromAddress = new MailAddress("haingoctran288@gmail.com", "Hai Sport");
                var toAddress = new MailAddress(toEmail);
                const string fromPassword = "ydab mdzv dehn kqnq"; 
                string subject = $"Thay đổi chi tiết đơn hàng #{orderId}";
                
                string body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #dc3545; text-align: center;'>Thông báo thay đổi đơn hàng!</h2>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Quản trị viên vừa thay đổi/cập nhật sản phẩm trong đơn hàng <strong>#{orderId}</strong> của bạn.</p>
                        <div style='background-color: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            <p style='margin: 5px 0;'>Tổng tiền mới nhất cần thanh toán: <strong style='color: #dc3545; font-size: 18px;'>{newTotalAmount.ToString("N0")} VNĐ</strong></p>
                        </div>
                        <p>Vui lòng đăng nhập vào website hoặc xem chi tiết để biết thêm thông tin. Xin lỗi vì sự bất tiện này!</p>
                        <br/>
                        <p style='text-align: center; color: #858796; font-size: 12px;'>Đây là email tự động, vui lòng không phản hồi lại email này.</p>
                    </div>
                ";

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress) { Subject = subject, Body = body, IsBodyHtml = true })
                {
                    await smtp.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email báo thay đổi đơn hàng: " + ex.Message);
            }
        }

        public static async Task SendOtpEmail(string toEmail, string customerName, string otpCode)
        {
            try
            {
                var fromAddress = new MailAddress("haingoctran288@gmail.com", "Hai Sport");
                var toAddress = new MailAddress(toEmail);
                const string fromPassword = "ydab mdzv dehn kqnq"; 
                const string subject = "Mã xác thực (OTP) - Lấy lại mật khẩu";
                
                string body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #dc3545; text-align: center;'>Yêu cầu lấy lại mật khẩu</h2>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Chúng tôi nhận được yêu cầu lấy lại mật khẩu cho tài khoản liên kết với email này.</p>
                        <div style='background-color: #f8f9fc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;'>
                            <p style='margin: 0; font-size: 16px;'>Mã xác thực (OTP) của bạn là:</p>
                            <h1 style='color: #dc3545; margin: 10px 0; letter-spacing: 5px; font-size: 32px;'>{otpCode}</h1>
                            <p style='margin: 0; font-size: 14px; color: #6c757d;'>Mã này có hiệu lực trong vòng 120 giây.</p>
                        </div>
                        <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
                        <br/>
                        <p style='text-align: center; color: #858796; font-size: 12px;'>Đây là email tự động, vui lòng không phản hồi lại email này.</p>
                    </div>
                ";

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress) { Subject = subject, Body = body, IsBodyHtml = true })
                {
                    await smtp.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email OTP: " + ex.Message);
            }
        }
    }
}
