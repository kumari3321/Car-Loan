using Microsoft.Extensions.Hosting; // Use the correct namespace for IHostEnvironment
using CarLoan.Server.Models;
using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.Services.Abstract;
using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Services.Concrete
{
    public class RegistrationServices : IRegistrationServices
    {
        private readonly IRegistrationRepository _userRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _contextAccessor;


        public RegistrationServices(IRegistrationRepository userRepository, IWebHostEnvironment env, IHttpContextAccessor contextAccessor)
        {
            _userRepository = userRepository;
            _env = env;
            _contextAccessor = contextAccessor;
        }

        public async Task<bool> Registration(RegistrationViewModel registerationView)
        {
            var url = _contextAccessor.HttpContext.Request;
            var Scheme = _contextAccessor.HttpContext.Request.Scheme;
            var BaseUrl = Scheme + "://" + url.Host.Value;
            if (!string.IsNullOrEmpty(registerationView.ProfilePhoto))
            {

                var imgName = registerationView.Extension;
                string rootFolderPath = _env.WebRootPath ;
                registerationView.ProfilePhoto = ImageUpload.UploadImage(BaseUrl, rootFolderPath, registerationView.ProfilePhoto, registerationView.Extension, "/Images/");
            }
            try
            {
                var SignUpUser = await _userRepository.Registration(registerationView);

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}






























