//using CarLoan.Server.ViewModel;

//namespace CarLoan.Server.Services.Abstract
//{
//    public interface ILoanConfigurationServices
//    {
//        Task<LoanConfigurationViewModel> GetLoanConfigurationAsync();
//        Task<bool> UpdateLoanConfigurationAsync(LoanConfigurationViewModel config);

//    }
//}


using CarLoan.Server.Models;
using CarLoan.Server.ViewModel;

public interface ILoanConfigurationServices
{
    Task<LoanConfiguration> GetLoanConfigurationAsync();
    Task<LoanConfiguration> UpdateLoanConfigurationAsync(LoanConfigurationViewModel configuration);
    Task InitializeDefaultLoanConfigurationAsync();
    Task<LoanCalculationResponse> CalculateLoanDetails(LoanCalculator request);
}
