using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.Services.Abstract;
using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Services.Concrete
{
    public class RegistrationServices : IRegistrationServices
    {
        private readonly IRegistrationRepository _userRepository;
        public RegistrationServices(IRegistrationRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Registration(RegistrationViewModel registerationView)
        {
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
