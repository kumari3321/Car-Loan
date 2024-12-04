

using CarLoan.Server.Models;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LoanConfigurationsController : ControllerBase
{
    private readonly ILoanConfigurationServices _loanConfigurationService;

    public LoanConfigurationsController(ILoanConfigurationServices loanConfigurationService)
    {
        _loanConfigurationService = loanConfigurationService;
    }

    [HttpGet]
    [Route("GetLoanConfiguration")]
    public async Task<IActionResult> GetLoanConfiguration()
    {
        // Ensure default data is initialized if not already present
        await _loanConfigurationService.InitializeDefaultLoanConfigurationAsync();

        var loanConfig = await _loanConfigurationService.GetLoanConfigurationAsync();
        if (loanConfig == null)
        {
            return NotFound();
        }
        return Ok(loanConfig);
    }

    [HttpPut]
    [Route("UpdateLoanConfiguration")]
    public async Task<IActionResult> UpdateLoanConfiguration([FromBody] LoanConfigurationViewModel configuration)
    {
        if (configuration == null || configuration.Id <= 0)
        {
            return BadRequest();
        }

        var updatedConfig = await _loanConfigurationService.UpdateLoanConfigurationAsync(configuration);
        if (updatedConfig == null)
        {
            return NotFound();
        }

        return Ok(updatedConfig);
    }


    [HttpPost("calculate-loan")]
    public async Task<IActionResult> CalculateLoanDetails([FromBody] LoanCalculator request)
    {
        if (request == null)
        {
            return BadRequest("Loan request cannot be null.");
        }

        try
        {
            // Call the service to calculate the loan details
            var result = await _loanConfigurationService.CalculateLoanDetails(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            // Log exception if needed (logging setup required)
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
