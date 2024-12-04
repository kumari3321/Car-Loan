
using CarLoan.Server.Models;
using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.ViewModel;

public class LoanConfigurationServices : ILoanConfigurationServices
{
    private readonly ILoanConfigurationRepository _loanConfigurationRepository;

    public LoanConfigurationServices(ILoanConfigurationRepository loanConfigurationRepository)
    {
        _loanConfigurationRepository = loanConfigurationRepository;
    }

    public async Task<LoanConfiguration> GetLoanConfigurationAsync()
    {
        return await _loanConfigurationRepository.GetLoanConfigurationAsync();
    }

    public async Task<LoanConfiguration> UpdateLoanConfigurationAsync(LoanConfigurationViewModel configuration)
    {
        return await _loanConfigurationRepository.UpdateLoanConfigurationAsync(configuration);
    }

    public async Task InitializeDefaultLoanConfigurationAsync()
    {
        await _loanConfigurationRepository.InitializeDefaultLoanConfigurationAsync();
    }

    public async Task<LoanCalculationResponse> CalculateLoanDetails(LoanCalculator request)
    {
        var response = await _loanConfigurationRepository.CalculateLoanDetails(request);
        return response;
        }
       
    }
