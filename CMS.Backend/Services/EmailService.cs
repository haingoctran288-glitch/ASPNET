using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Services
{
    public class EmailService
    {
        public static async Task SendOrderConfirmationEmail(string toEmail, string customerName, int orderId, decimal totalAmount, string customerAddress, string customerPhone, DateTime orderDate, string itemsHtml = "")
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
                    <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: auto; padding: 30px; border: 1px solid #e3e6f0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);'>
                        <div style='text-align: center; border-bottom: 2px solid #f8f9fc; padding-bottom: 20px; margin-bottom: 25px;'>
                            <h1 style='color: #4e73df; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;'>HAI SPORT</h1>
                            <p style='color: #858796; margin-top: 5px;'>Xác nhận đơn hàng thành công</p>
                        </div>
                        <h2 style='color: #2c3e50;'>Cảm ơn bạn đã tin tưởng Hai Sport!</h2>
                        <p style='font-size: 15px; color: #5a5c69; line-height: 1.6;'>Xin chào <strong style='color: #4e73df;'>{customerName}</strong>,</p>
                        <p style='font-size: 15px; color: #5a5c69; line-height: 1.6;'>Đơn hàng của bạn đã được hệ thống của chúng tôi ghi nhận. Vui lòng kiểm tra lại thông tin chi tiết bên dưới:</p>
                        
                        <div style='background-color: #f8f9fc; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #4e73df;'>
                            <h3 style='margin-top: 0; color: #2c3e50; border-bottom: 1px solid #e3e6f0; padding-bottom: 10px;'>THÔNG TIN ĐƠN HÀNG <span style='color: #e74a3b;'>#{orderId}</span></h3>
                            <table style='width: 100%; border-collapse: collapse; font-size: 14px; color: #5a5c69;'>
                                <tr>
                                    <td style='padding: 8px 0; width: 40%;'><strong>Ngày đặt hàng:</strong></td>
                                    <td style='padding: 8px 0; color: #2c3e50;'>{orderDate.ToString("dd/MM/yyyy HH:mm:ss")}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 8px 0;'><strong>Người nhận:</strong></td>
                                    <td style='padding: 8px 0; color: #2c3e50;'>{customerName}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 8px 0;'><strong>Số điện thoại:</strong></td>
                                    <td style='padding: 8px 0; color: #2c3e50;'>{(string.IsNullOrEmpty(customerPhone) ? "Chưa cập nhật" : customerPhone)}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 8px 0;'><strong>Địa chỉ giao hàng:</strong></td>
                                    <td style='padding: 8px 0; color: #2c3e50;'>{(string.IsNullOrEmpty(customerAddress) ? "Chưa cập nhật" : customerAddress)}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 8px 0;'><strong>Phương thức thanh toán:</strong></td>
                                    <td style='padding: 8px 0; color: #2c3e50;'>Thanh toán khi nhận hàng (COD)</td>
                                </tr>
                                <tr>
                                    <td style='padding: 8px 0;'><strong>Tình trạng đơn:</strong></td>
                                    <td style='padding: 8px 0;'><span style='background-color: #f6c23e; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;'>Chờ duyệt</span></td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='padding: 15px 0 5px 0; border-top: 2px solid #e3e6f0; margin-top: 15px;'>
                                        <h4 style='margin: 10px 0; color: #2c3e50;'>Chi tiết sản phẩm:</h4>
                                        <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                                            {itemsHtml}
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 15px 0 5px 0; border-top: 2px solid #e3e6f0; margin-top: 10px;'><strong>Tổng thanh toán:</strong></td>
                                    <td style='padding: 15px 0 5px 0; border-top: 2px solid #e3e6f0; margin-top: 10px; text-align: right;'><strong style='color: #e74a3b; font-size: 18px;'>{totalAmount.ToString("N0")} VNĐ</strong></td>
                                </tr>
                            </table>
                        </div>
                        
                        <p style='font-size: 15px; color: #5a5c69; line-height: 1.6;'>Chúng tôi sẽ sớm liên hệ với bạn qua số điện thoại để xác nhận đơn hàng và tiến hành giao hàng. Vui lòng giữ liên lạc nhé!</p>
                        
                        <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #e3e6f0; text-align: center;'>
                            <p style='color: #858796; font-size: 13px; margin-bottom: 5px;'>Trân trọng,<br/><strong>Đội ngũ HAI SPORT</strong></p>
                            <p style='color: #b7b9cc; font-size: 11px; margin-top: 15px;'>Đây là email tự động, vui lòng không phản hồi lại email này.</p>
                        </div>
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

        public static async Task SendOrderStatusUpdateEmail(string toEmail, string customerName, int orderId, decimal totalAmount, int newStatusInt, string itemsHtml = "")
        {
            try
            {
                var fromAddress = new MailAddress("haingoctran288@gmail.com", "Hai Sport");
                var toAddress = new MailAddress(toEmail);
                const string fromPassword = "ydab mdzv dehn kqnq"; 
                string subject = $"Cập nhật trạng thái đơn hàng #{orderId}";
                
                string newStatus = newStatusInt == 1 ? "Đang giao hàng" : (newStatusInt == 2 ? "Đã giao/Hoàn thành" : (newStatusInt == 3 ? "Đã hủy" : "Đã cập nhật"));
                string statusColor = newStatusInt == 1 ? "#0dcaf0" : (newStatusInt == 2 ? "#20c997" : (newStatusInt == 3 ? "#dc3545" : "#198754"));
                
                string body = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #dc3545; text-align: center;'>Thông báo trạng thái đơn hàng!</h2>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Đơn hàng <strong>#{orderId}</strong> của bạn vừa được cập nhật trạng thái mới.</p>
                        <div style='background-color: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                            <p style='margin: 5px 0;'>Tình trạng mới: <span style='color: {statusColor}; font-weight: bold; text-transform: uppercase;'>{newStatus}</span></p>
                            <h4 style='margin: 15px 0 10px 0; border-top: 1px solid #e3e6f0; padding-top: 15px; color: #2c3e50;'>Chi tiết đơn hàng:</h4>
                            <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                                {itemsHtml}
                            </table>
                            <p style='margin: 15px 0 5px 0; text-align: right; border-top: 2px solid #e3e6f0; padding-top: 10px;'>Tổng thanh toán: <strong style='font-size: 16px; color: #e74a3b;'>{totalAmount.ToString("N0")} VNĐ</strong></p>
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

        public static async Task SendOrderModifiedEmail(string toEmail, string customerName, int orderId, decimal newTotalAmount, string itemsHtml = "")
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
                            <h4 style='margin: 5px 0 10px 0; color: #2c3e50;'>Danh sách sản phẩm mới cập nhật:</h4>
                            <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                                {itemsHtml}
                            </table>
                            <p style='margin: 15px 0 5px 0; text-align: right; border-top: 2px solid #e3e6f0; padding-top: 10px;'>Tổng tiền mới nhất cần thanh toán: <strong style='color: #dc3545; font-size: 18px;'>{newTotalAmount.ToString("N0")} VNĐ</strong></p>
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
