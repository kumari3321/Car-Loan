using CarLoan.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CarLoan.Server.DbContext
{
    public class LoansDbContext : IdentityDbContext<ApplicationUser>
    {
        public LoansDbContext(DbContextOptions<LoansDbContext> options) : base(options)
        {

        }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<LoanConfiguration> LoanConfigurations { get; set; }
    }
}
