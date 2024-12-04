using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.Services.Abstract;
using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Services.Concrete
{
    public class AccountServices : IAccountServices
    {
        private readonly IAccountRepository _accountRepository;

        public AccountServices(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;

        }
        public async Task<bool> EmailExists(string email)
        {

            return await _accountRepository.EmailExists(email);

        }
        public async Task<IList<String>> GetUserRolesByUsername(string username)
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
            var res = await _accountRepository.UpdateClientPanel(update, UserId, Id);
            return res;
        }
    }
}
