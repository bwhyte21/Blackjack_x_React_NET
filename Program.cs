var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// Security: Configure CORS with explicit origins
builder.Services.AddCors(options =>
{
	options.AddPolicy("DefaultCorsPolicy", policy =>
	{
		policy.WithOrigins("https://localhost:5001", "https://localhost:7001") // Add your production domains
			  .AllowAnyHeader()
			  .AllowAnyMethod()
			  .AllowCredentials();
	});
});

// Security: Add Anti-forgery services
builder.Services.AddAntiforgery(options =>
{
	options.HeaderName = "X-CSRF-TOKEN";
	options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
	options.Cookie.SameSite = SameSiteMode.Strict;
});

// Security: Configure Kestrel server limits
builder.WebHost.ConfigureKestrel(serverOptions =>
{
	serverOptions.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // 10MB max request size
	serverOptions.Limits.MaxConcurrentConnections = 100;
	serverOptions.Limits.MaxConcurrentUpgradedConnections = 100;
});

var app = builder.Build();

// Security: Global exception handler - prevents error detail leakage
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	app.UseHsts();
}
else
{
	app.UseDeveloperExceptionPage();
}

// Security: Add security headers middleware
app.Use(async (context, next) =>
{
	// Content Security Policy - prevents XSS attacks
	context.Response.Headers.Append("Content-Security-Policy",
		"default-src 'self'; " +
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Adjust based on React requirements
		"style-src 'self' 'unsafe-inline'; " +
		"img-src 'self' data: https:; " +
		"font-src 'self' data:; " +
		"connect-src 'self'; " +
		"frame-ancestors 'none';");

	// Prevent clickjacking
	context.Response.Headers.Append("X-Frame-Options", "DENY");

	// Prevent MIME-type sniffing
	context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

	// Control referrer information
	context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

	// Restrict browser features
	context.Response.Headers.Append("Permissions-Policy",
		"accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()");

	// XSS Protection (legacy but still useful)
	context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

	await next();
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Security: Enable CORS
app.UseCors("DefaultCorsPolicy");

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

// Fallback to Index for SPA routing
app.MapFallbackToController("Index", "Home");

app.Run();
