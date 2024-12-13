using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Services.Abstract
{
    public interface IAccountServices
    {

        Task<bool> EmailExists(string email);
        Task<IList<String>> GetUserRolesByUsername(string username);
        Task<UserInfo> GetUserInfoByUserName(string username);
        Task<bool> PasswordSignIn(LoginRequests login);
        Task<bool> UpdateClientPanel(UpdateViewModel update, string UserId, int Id);
        Task<GetUserInfoViewModel> GetUserInfoById(int id);
        Task<GetUserInfoViewModel> GetUserInfoByUserId(string UserId);
        Task<List<GetUserInfoViewModel>> GetAllUsers();
    }
}
