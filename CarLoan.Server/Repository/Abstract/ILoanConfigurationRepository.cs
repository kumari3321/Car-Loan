using CarLoan.Server.Models;
using CarLoan.Server.ViewModel;

namespace CarLoan.Server.Repository.Abstract
{
    public interface ILoanConfigurationRepository
    {
        Task<LoanConfiguration> GetLoanConfigurationAsync ();
        Task<LoanConfiguration> GetLoanConfigurationById(int id);
        Task InitializeDefaultLoanConfigurationAsync();
       // Task<LoanConfiguration> UpdateLoanConfigurationAsync(LoanConfiguration configuration);
        Task<LoanConfiguration> UpdateLoanConfigurationAsync(LoanConfigurationViewModel configuration);
        Task<LoanCalculationResponse> CalculateLoanDetails(LoanCalculator request);
    }
}
