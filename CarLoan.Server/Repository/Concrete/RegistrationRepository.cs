using CarLoan.Server.DbContext;
using CarLoan.Server.Models;
using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Identity;

namespace CarLoan.Server.Repository.Concrete
{
    public class RegistrationRepository : IRegistrationRepository
    {
        private readonly LoansDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        //private readonly SignInManager<ApplicationUser> _signInManager;

        public RegistrationRepository(LoansDbContext context, UserManager<ApplicationUser> userManager
            )
        {
            _context = context;
            _userManager = userManager;
        }
        public async Task<bool> Registration(RegistrationViewModel registrationView)
        {
            try
            {
                if (await _userManager.FindByEmailAsync(registrationView.Email) != null)
                {
                    throw new ApplicationException($"Email '{registrationView.Email}' already exists.");
                }

                var appUser = new ApplicationUser
                {
                    UserName = registrationView.Email,
                    Email = registrationView.Email.ToLower(),
                    PhoneNumber = registrationView.PhoneNumber
                };

                var result = await _userManager.CreateAsync(appUser, registrationView.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new ApplicationException($"User registration failed: {errors}");
                }

                string profilePhotoPath = null;


                if (registrationView.ProfilePhoto != null && registrationView.ProfilePhoto.Length > 0)
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", "profile_photos");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + registrationView.ProfilePhoto.FileName;
                    profilePhotoPath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(profilePhotoPath, FileMode.Create))
                    {
                        await registrationView.ProfilePhoto.CopyToAsync(fileStream);
                    }
                }

                var users = new Users
                {
                    AspNetUserId = appUser.Id,
                    Address = registrationView.Address,
                    CreatedUser = appUser,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    CreatedUserId = appUser.Id,
                    ModifiedUser = appUser,
                    ModifiedUserId = appUser.Id,
                    IsActive = true,
                    ProfilePhoto = profilePhotoPath,
                    UserName = registrationView.UserName,
                };

                await _context.Users.AddAsync(users);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                var detailedError = ex.InnerException?.Message ?? ex.Message;
                throw new ApplicationException($"Error during registration: {detailedError}");
            }
        }

    }
}
