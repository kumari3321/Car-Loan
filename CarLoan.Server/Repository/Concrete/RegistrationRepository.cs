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

                //string profilePhoto = null;


                //if (registrationView.ProfilePhoto != null && registrationView.ProfilePhoto.Length > 0)
                //{
                //    var uploadsFolder = Path.Combine("wwwroot", "uploads", "profile_photos");
                //    Directory.CreateDirectory(uploadsFolder);

                //    var uniqueFileName = Guid.NewGuid().ToString() + "_" + registrationView.ProfilePhotoPath.FileName;
                //    profilePhoto = Path.Combine(uploadsFolder, uniqueFileName);

                //    using (var fileStream = new FileStream(profilePhoto, FileMode.Create))
                //    {
                //        await registrationView.ProfilePhotoPath.CopyToAsync(fileStream);
                //    }
                //}

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
                    //registerView.Email=appUser.Email,
                    ProfilePhoto = registrationView. ProfilePhoto,
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



//using CarLoan.Server.DbContext;
//using CarLoan.Server.Models;
//using CarLoan.Server.Repository.Abstract;
//using CarLoan.Server.ViewModel;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Hosting;
//using System;
//using System.IO;
//using System.Linq;
//using System.Threading.Tasks;
//using static System.Net.Mime.MediaTypeNames;

//namespace CarLoan.Server.Repository.Concrete
//{
//    public class RegistrationRepository : IRegistrationRepository
//    {
//        private readonly LoansDbContext _context;
//        private readonly UserManager<ApplicationUser> _userManager;
//        private readonly IHostingEnvironment _environment;

//        public RegistrationRepository(LoansDbContext context, UserManager<ApplicationUser> userManager, IHostingEnvironment environment)
//        {
//            _context = context;
//            _userManager = userManager;
//            _environment = environment;
//        }

//        public async Task<bool> Registration(RegistrationViewModel registrationView)
//        {
//            try
//            {
//                // Check if email already exists
//                if (await _userManager.FindByEmailAsync(registrationView.Email) != null)
//                {
//                    throw new ApplicationException($"Email '{registrationView.Email}' already exists.");
//                }

//                // Create the application user
//                var appUser = new ApplicationUser
//                {
//                    UserName = registrationView.Email,
//                    Email = registrationView.Email.ToLower(),
//                    PhoneNumber = registrationView.PhoneNumber
//                };

//                // Create the user in Identity
//                var result = await _userManager.CreateAsync(appUser, registrationView.Password);
//                if (!result.Succeeded)
//                {
//                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
//                    throw new ApplicationException($"User registration failed: {errors}");
//                }

//                // Handle image upload for profile photo
//                string profilePhotoUrl = null;
//                if (registrationView.ProfilePhotoPath != null && registrationView.ProfilePhotoPath.Length > 0)
//                {
//                    // Here, we call the UploadImage API to upload the image and get the URL
//                    profilePhotoUrl = await UploadImage(new ImageRequest
//                    {
//                       // ProductId = 0, // Assuming we don't need to associate with a product here
//                        ImgName = "Profile Photo" // You can change this to any name you want
//                    }, new List<IFormFile> { registrationView.ProfilePhotoPath });
//                }

//                // Create the Users record in the database
//                var users = new Users
//                {
//                    AspNetUserId = appUser.Id,
//                    Address = registrationView.Address,
//                    CreatedUser = appUser,
//                    CreatedDate = DateTime.Now,
//                    ModifiedDate = DateTime.Now,
//                    CreatedUserId = appUser.Id,
//                    ModifiedUser = appUser,
//                    ModifiedUserId = appUser.Id,
//                    IsActive = true,
//                    ProfilePhoto = profilePhotoUrl, 
//                    UserName = registrationView.UserName,
//                };

//                // Save the user to the database
//                await _context.Users.AddAsync(users);
//                await _context.SaveChangesAsync();

//                return true;
//            }
//            catch (Exception ex)
//            {
//                var detailedError = ex.InnerException?.Message ?? ex.Message;
//                throw new ApplicationException($"Error during registration: {detailedError}");
//            }
//        }

//        // This method will handle uploading the image
//        public async Task<string> UploadImage(ImageRequest imageRequest, List<IFormFile> files)
//        {
//            var imageUrls = new List<string>();

//            try
//            {
//                var uploadsFolder = Path.Combine(_environment.WebRootPath, "Image");

//                if (!Directory.Exists(uploadsFolder))
//                    Directory.CreateDirectory(uploadsFolder);

//                foreach (var file in files)
//                {
//                    var uniqueFileName = Guid.NewGuid().ToString() + ".jpg"; // Assuming image format is JPG
//                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

//                    using (var fileStream = new FileStream(filePath, FileMode.Create))
//                    {
//                        await file.CopyToAsync(fileStream); // Copy the contents of the uploaded file to fileStream
//                    }

//                    var imageUrl = $"/Image/{uniqueFileName}";

//                    var image = new ImageRequest
//                    {
//                        //ImgName = imageRequest.ImgName,
//                        ProfilePhoto = ProfilePhoto,
//                       // ProductId = imageRequest.ProductId
//                    };

//                    await _context.Users.AddAsync(image);
//                    await _context.SaveChangesAsync();

//                    imageUrls.Add(imageUrl);
//                }

//                return imageUrls.FirstOrDefault();
//            }
//            catch (Exception ex)
//            {
//                throw new Exception($"Upload failed: {ex.Message}");
//            }
//        }
//    }
//}
