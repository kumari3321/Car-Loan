using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Services.Abstract
{
    public interface IRegistrationServices
    {
        Task<bool> Registration(RegistrationViewModel registrationView);
        //Task<string> UploadProfilePhotoAsync(ImageUploadViewModel viewModel);
    }
}