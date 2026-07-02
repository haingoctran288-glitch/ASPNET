using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Helpers
{
    public static class SecurityHelper
    {
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password)) return string.Empty;
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
        
        public static bool VerifyPassword(string password, string hash)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash)) return false;
            try 
            {
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Fallback for old SHA256 (no salt) or raw passwords
                using (var sha256 = SHA256.Create())
                {
                    var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                    var sha256Hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                    return StringComparer.OrdinalIgnoreCase.Compare(sha256Hash, hash) == 0 || password == hash;
                }
            }
        }
    }
}
