
using CarLoan.Server.DbContext;
using CarLoan.Server.Models;
using Microsoft.AspNetCore.Identity;
 
    namespace check.Models
    {
        public class SeedUsers
        {
            private static IServiceProvider serviceProvider;
            public static async Task SeedDataAsync(IServiceProvider serviceProvider)
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<LoansDbContext>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();


                var roles = new[] { Roles.Admin.ToString() };
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }


                var admin = await userManager.FindByEmailAsync("admin@yopmail.com");
                if (admin == null)
                {
                    admin = new ApplicationUser
                    {
                        Email = "admin@yopmail.com",
                        NormalizedEmail = "ADMIN@YOPMAIL.COM",
                        UserName = "admin@yopmail.com",
                        NormalizedUserName = "ADMIN@YOPMAIL.COM",
                        PhoneNumber = "123456789",
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = true,
                        IsActive = true,
                        SecurityStamp = Guid.NewGuid().ToString("D")
                    };

                    await userManager.CreateAsync(admin, "Admin@1234");
                    await userManager.AddToRoleAsync(admin, "Admin");
                }

            }
            public static async Task<IdentityResult> AssignRoles(IServiceProvider services, string email, string[] roles)
            {
                using var scope = services.CreateScope();

                UserManager<ApplicationUser> _userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
                ApplicationUser user = await _userManager.FindByEmailAsync(email);
                var result = await _userManager.AddToRolesAsync(user, roles);
                return result;
            }




            public static async Task<bool> AddUsers(IServiceProvider services, string email, LoansDbContext context)
            {
                using var scope = services.CreateScope();

                UserManager<ApplicationUser> _userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
                ApplicationUser aspnetuser = await _userManager.FindByEmailAsync(email);
                var User = new Users
                {
                    UserName = "ADMIN",
                    AspNetUserId = aspnetuser.Id,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow,
                    ModifiedDate = DateTime.UtcNow,

                };

                if (!context.Users.Any(a => a.AspNetUser != null && a.AspNetUser.UserName == "admin@yopmail.com"))
                {
                    context.Users.Add(User);
                    context.SaveChanges();
                }
                return true;
            }
        }
    }


