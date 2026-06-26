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
    }
}
