using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Identity.Data;

namespace CarLoan.Server.Repository.Abstract
{
    public interface IAccountRepository
    {
        Task<bool> EmailExists(string email);
        Task SignOut();
        Task<IList<String>> GetUserRolesByUsername(string username);
        Task<UserInfo> GetUserInfoByUserName(string username);
        Task<bool> PasswordSignIn(LoginRequests login);
        Task<bool> UpdateClientPanel(UpdateViewModel update, string UserId, int Id);
        Task<GetUserInfoViewModel> GetUserInfoById(int id);
        Task<GetUserInfoViewModel> GetUserInfoByUserId(string UserId);
        Task<List<GetUserInfoViewModel>> GetAllUsers();
    }
}
