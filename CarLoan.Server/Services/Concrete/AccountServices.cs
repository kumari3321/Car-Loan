using CarLoan.Server.Models;
using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.Services.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Hosting; // Include this namespace for IWebHostEnvironment
using Microsoft.Extensions.Hosting;  // This can stay

namespace CarLoan.Server.Services.Concrete
{
    public class AccountServices : IAccountServices
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IWebHostEnvironment _env; // Changed to IWebHostEnvironment
        private readonly IHttpContextAccessor _contextAccessor;

        public AccountServices(IAccountRepository accountRepository, IWebHostEnvironment env, IHttpContextAccessor contextAccessor)
        {
            _accountRepository = accountRepository;
            _env = env; // Use IWebHostEnvironment here
            _contextAccessor = contextAccessor;
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _accountRepository.EmailExists(email);
        }

        public async Task<IList<string>> GetUserRolesByUsername(string username)
        {
            return await _accountRepository.GetUserRolesByUsername(username);
        }

        public async Task<UserInfo> GetUserInfoByUserName(string username)
        {
            try
            {
                return await _accountRepository.GetUserInfoByUserName(username);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> PasswordSignIn(LoginRequests login)
        {
            try
            {
                var result = await _accountRepository.PasswordSignIn(login);

                if (result)
                {
                    var userRoles = await _accountRepository.GetUserRolesByUsername(login.UserName);
                    var userDetails = await _accountRepository.GetUserInfoByUserName(login.UserName);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred during sign-in.", ex);
            }
        }

        public async Task<bool> UpdateClientPanel(UpdateViewModel update, string UserId, int Id)
        {
            var url = _contextAccessor.HttpContext.Request;
            var Scheme = _contextAccessor.HttpContext.Request.Scheme;
            var BaseUrl = Scheme + "://" + url.Host.Value;

            if (!string.IsNullOrEmpty(update.ProfilePhoto))
            {
                var imgName = update.Extension;
                string rootFolderPath = _env.WebRootPath; 
                update.ProfilePhoto = ImageUpload.UploadImage(BaseUrl, rootFolderPath, update.ProfilePhoto, update.Extension, "/Images/");
            }
            var res = await _accountRepository.UpdateClientPanel(update, UserId, Id);
            return res;
        }

        public async Task<GetUserInfoViewModel> GetUserInfoById(int id)
        {
            var res = await _accountRepository.GetUserInfoById(id);
            return res;
        }


        public async Task<GetUserInfoViewModel>GetUserInfoByUserId(string UserId)
        {
            var res = await _accountRepository.GetUserInfoByUserId(UserId);
            return res; 
        }



        public async Task<List<GetUserInfoViewModel>> GetAllUsers()
        {
            var res = await _accountRepository.GetAllUsers();
            return res;
        }
    }
}
