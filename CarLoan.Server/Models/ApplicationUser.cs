using Microsoft.AspNetCore.Identity;

namespace CarLoan.Server.Models
{
    public class ApplicationRole : IdentityRole
    {

        public ApplicationRole() : base()
        { }


        public ApplicationRole(string roleName) : base(roleName)
        { }


    }
    public class ApplicationUser : IdentityUser
    {
        public bool IsActive { get; set; } = true;
    }
}
