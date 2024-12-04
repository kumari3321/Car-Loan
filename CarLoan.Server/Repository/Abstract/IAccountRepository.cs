using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Identity.Data;

namespace CarLoan.Server.Repository.Abstract
{
    public interface IAccountRepository
    {
        Task<bool> EmailExists(string email);
        Task<IList<String>> GetUserRolesByUsername(string username);
        Task<UserInfo> GetUserInfoByUserName(string username);
        Task<bool> PasswordSignIn(LoginRequests login);
        Task<bool> UpdateClientPanel(UpdateViewModel update, string UserId, int Id);
    }
}
