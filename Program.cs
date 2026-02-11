var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddCors(options =>
{
	options.AddPolicy("DefaultCorsPolicy", policy =>
	{
		policy.WithOrigins("https://localhost:5001", "https://localhost:7001")
			  .AllowAnyHeader()
			  .AllowAnyMethod()
			  .AllowCredentials();
	});
});

builder.Services.AddAntiforgery(options =>
{
	options.HeaderName = "X-CSRF-TOKEN";
	options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
	options.Cookie.SameSite = SameSiteMode.Strict;
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
	serverOptions.Limits.MaxRequestBodySize = 10 * 1024 * 1024;
	serverOptions.Limits.MaxConcurrentConnections = 100;
	serverOptions.Limits.MaxConcurrentUpgradedConnections = 100;
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	app.UseHsts();
}
else
{
	app.UseDeveloperExceptionPage();
}

app.Use(async (context, next) =>
{
	context.Response.Headers.Append("Content-Security-Policy",
		"default-src 'self'; " +
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
		"style-src 'self' 'unsafe-inline'; " +
		"img-src 'self' data: https:; " +
		"font-src 'self' data:; " +
		"connect-src 'self'; " +
		"frame-ancestors 'none';");

	context.Response.Headers.Append("X-Frame-Options", "DENY");
	context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
	context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
	context.Response.Headers.Append("Permissions-Policy",
		"accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()");
	context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

	await next();
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("DefaultCorsPolicy");

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapFallbackToController("Index", "Home");

app.Run();
