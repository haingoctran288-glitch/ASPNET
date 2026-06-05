using CMS.Data.Entities;

namespace CMS.Data.Seed
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // =========================
            // Seed Category
            // =========================
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category
                    {
                        Name = "Tin công nghệ",
                        Description = "Các bài viết công nghệ"
                    },
                    new Category
                    {
                        Name = "Tin game",
                        Description = "Các bài viết game"
                    }
                );

                context.SaveChanges();
            }

            // =========================
            // Seed CategoryProduct
            // =========================
            if (!context.CategoriesProducts.Any())
            {
                context.CategoriesProducts.AddRange(
                    new CategoryProduct
                    {
                        Name = "Điện thoại",
                        Description = "Danh mục điện thoại"
                    },
                    new CategoryProduct
                    {
                        Name = "Laptop",
                        Description = "Danh mục laptop"
                    }
                );

                context.SaveChanges();
            }

            // =========================
            // Seed Product
            // =========================
            if (!context.Products.Any())
            {
                var categoryProduct = context.CategoriesProducts.First();

                context.Products.AddRange(
                    new Product
                    {
                        Name = "iPhone 15 Pro Max",
                        Description = "Điện thoại Apple cao cấp",
                        Price = 35000000,
                        StockQuantity = 10,
                        ImageUrl = "iphone15.jpg",
                        CategoryProductId = categoryProduct.Id
                    },
                    new Product
                    {
                        Name = "Samsung Galaxy S24",
                        Description = "Flagship Samsung",
                        Price = 28000000,
                        StockQuantity = 15,
                        ImageUrl = "s24.jpg",
                        CategoryProductId = categoryProduct.Id
                    }
                );

                context.SaveChanges();
            }

            // =========================
            // Seed User Admin
            // =========================
            if (!context.Users.Any())
            {
                context.Users.Add(
                    new User
                    {
                        Username = "admin",
                        PasswordHash = "123456",
                        FullName = "Administrator",
                        Role = "Admin"
                    }
                );

                context.SaveChanges();
            }

            // =========================
            // Seed Customer
            // =========================
            if (!context.Customers.Any())
            {
                context.Customers.Add(
                    new Customer
                    {
                        FullName = "Nguyễn Văn A",
                        Email = "vana@gmail.com",
                        Phone = "0123456789",
                        Address = "TP.HCM",
                        Password = "123456"
                    }
                );

                context.SaveChanges();
            }

            // =========================
            // Seed Post
            // =========================
            if (!context.Posts.Any())
            {
                var category = context.Categories.First();

                context.Posts.AddRange(
                    new Post
                    {
                        Title = "iPhone 15 ra mắt",
                        Content = "Apple chính thức ra mắt iPhone 15.",
                        ImageUrl = "post1.jpg",
                        CreatedDate = DateTime.Now,
                        CategoryId = category.Id
                    },
                    new Post
                    {
                        Title = "Top laptop gaming 2026",
                        Content = "Danh sách laptop gaming mạnh nhất.",
                        ImageUrl = "post2.jpg",
                        CreatedDate = DateTime.Now,
                        CategoryId = category.Id
                    }
                );

                context.SaveChanges();
            }
        }
    }
}