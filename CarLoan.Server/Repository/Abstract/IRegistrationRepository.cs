using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Repository.Abstract
{
    public interface IRegistrationRepository
    {
        Task<bool> Registration(RegistrationViewModel registrationView);
        //Task<string> UploadProfilePhotoAsync(ImageUploadViewModel viewModel);
    }
}
