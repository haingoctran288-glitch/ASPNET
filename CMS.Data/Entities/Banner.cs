using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [Display(Name = "Tiêu đề")]
        public string Title { get; set; }

        [Display(Name = "Hình ảnh")]
        public string ImageUrl { get; set; }

        [Display(Name = "Hiển thị")]
        public bool IsActive { get; set; } = true;
    }
}
