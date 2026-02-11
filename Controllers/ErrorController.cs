using Microsoft.AspNetCore.Mvc;

namespace BlackjackReact.Controllers;

[ApiController]
[Route("[controller]")]
public class ErrorController : Controller
{
	[Route("/Error")]
	[ApiExplorerSettings(IgnoreApi = true)]
	public IActionResult HandleError()
	{
		return Problem(
			statusCode: 500,
			title: "An error occurred while processing your request."
		);
	}
}
