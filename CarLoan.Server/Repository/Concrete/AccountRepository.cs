using CarLoan.Server.DbContext;
using CarLoan.Server.Models;
using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CarLoan.Server.Repository.Concrete
{
    public class AccountRepository : IAccountRepository
    {
        private readonly LoansDbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public AccountRepository(LoansDbContext context, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
        }



        public async Task<IList<String>> GetUserRolesByUsername(string username)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(username);
                return await _userManager.GetRolesAsync(user);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }





        public async Task<bool> EmailExists(string email)
        {
            try
            {
                email = email?.Replace(" ", "+").Trim();
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return (false);
                }
                var roles = await _userManager.GetRolesAsync(user);
                var userDetail = await _context.Users
                    .Where(x => x.AspNetUserId == user.Id)
                    .OrderByDescending(q => q.CreatedDate)
                    .FirstOrDefaultAsync();
                if (userDetail == null || !userDetail.IsActive)
                {
                    return (false);
                }
                if (roles.Contains("Admin"))
                {
                    return (true);
                }
                else if (roles.Contains("User"))
                {
                    return (true);
                }
                return (true);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while checking email existence.", ex);
            }
        }


        public async Task<UserInfo> GetUserInfoByUserName(string username)
        {
            try
            {
                var userData = new UserInfo();
                var user = await _userManager.FindByEmailAsync(username);
                var mUser = _context.Users.Include(bus => bus.AspNetUser).FirstOrDefault(aa => aa.IsActive && aa.AspNetUserId.Equals(user.Id));

                var roles = await _userManager.GetRolesAsync(user);

                if (roles.Contains(Roles.Admin.ToString()))
                {
                    userData.UserName = user.UserName;
                    userData.Email = user.Email;
                    userData.Id = user.Id;
                    userData.IsActive = user.IsActive;
                    userData.PhoneNUmber = user.PhoneNumber;
                }
                else
                {
                    userData.UserName = user.UserName;
                    userData.Email = user.Email;
                    userData.Id = user.Id;
                    userData.IsActive = user.IsActive;
                    userData.PhoneNUmber = user.PhoneNumber;
                }

                return userData;
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
                var user = await _userManager.FindByNameAsync(login.UserName.Trim());
                if (user == null)
                {
                    return false;
                }
                var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, lockoutOnFailure: false);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred during sign-in.", ex);
            }
        }
        public async Task<bool> UpdateClientPanel(UpdateViewModel update, string UserId, int Id)
        {
            var clientInfo = await _context.Users.Include(a => a.AspNetUser).FirstOrDefaultAsync(a => a.Id == Id);

            if (clientInfo != null)
            {
                clientInfo.UserName = update?.UserName;

                clientInfo.AspNetUser.Email = update?.Email;
                clientInfo.AspNetUser.NormalizedEmail = update.Email.ToUpper();
                clientInfo.AspNetUser.NormalizedUserName = update?.Email.ToUpper();
                clientInfo.AspNetUser.UserName = update?.Email;
                clientInfo.AspNetUser.PhoneNumber = update?.PhoneNumber;
                clientInfo.Address = update?.Address;
                clientInfo.ModifiedUserId = UserId;
                clientInfo.ModifiedDate = DateTime.UtcNow;

            }

            _context.Update(clientInfo);
            await _context.SaveChangesAsync();
            return true;
        }

      
    }
}
