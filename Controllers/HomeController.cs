using Microsoft.AspNetCore.Mvc;

namespace BlackjackReact.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
