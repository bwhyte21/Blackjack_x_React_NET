# Application Security Plan - Blackjack React App

## Security Assessment Summary
**Date:** 2024  
**Application:** Blackjack React (.NET 9)  
**Risk Level:** Low ? Medium (after hardening)

---

## ? IMPLEMENTED SECURITY MEASURES

### 1. Security Headers
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: DENY - Prevents clickjacking
- **X-Content-Type-Options**: nosniff - Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information leakage
- **Permissions-Policy**: Restricts browser features
- **X-XSS-Protection**: Legacy XSS protection

### 2. CORS Protection
- Explicit origin allowlist (localhost only by default)
- Method restrictions
- Credential policy configured

### 3. Exception Handling
- Production error handler prevents information leakage
- Custom error controller returns generic error messages
- Developer exception page only in development

### 4. Request Security
- Max request body size: 10MB (DoS prevention)
- Max concurrent connections: 100
- HTTPS enforcement via redirection
- HSTS enabled in production

### 5. Host Header Protection
- AllowedHosts restricted to specific domains
- Prevents Host Header injection attacks

---

## ?? FUTURE SECURITY ENHANCEMENTS

### Phase 2: API Security (When Adding Game API)

#### A. Input Validation
```csharp
public class GameActionDto
{
    [Required]
    [StringLength(20, MinimumLength = 3)]
    public string Action { get; set; } = string.Empty;
    
    [Range(1, 1000)]
    public int BetAmount { get; set; }
}

[HttpPost("action")]
[ValidateAntiForgeryToken]
public IActionResult PerformAction([FromBody] GameActionDto action)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    
    // Process action
    return Ok();
}
```

#### B. Rate Limiting
```csharp
// Install: AspNetCoreRateLimit
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*",
            Limit = 100,
            Period = "1m"
        }
    };
});
```

#### C. Anti-Forgery Tokens
- Already configured in Program.cs
- Use `[ValidateAntiForgeryToken]` on POST/PUT/DELETE actions
- Pass token from React app in headers

---

### Phase 3: Database Security (If Adding Persistence)

#### A. SQL Injection Prevention

**? CORRECT - Parameterized Queries:**
```csharp
// Entity Framework Core
var games = await context.Games
    .Where(g => g.PlayerId == playerId)
    .ToListAsync();

// Dapper
var games = await connection.QueryAsync<Game>(
    "SELECT * FROM Games WHERE PlayerId = @PlayerId",
    new { PlayerId = playerId });
```

**? NEVER DO - String Concatenation:**
```csharp
// VULNERABLE TO SQL INJECTION!
var query = $"SELECT * FROM Games WHERE PlayerId = {playerId}";
```

#### B. Connection String Security

**Development - User Secrets:**
```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=..."
```

**Production - Environment Variables/Key Vault:**
```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{keyVaultName}.vault.azure.net/"),
    new DefaultAzureCredential());
```

#### C. Data Protection
```csharp
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"./keys/"))
    .SetApplicationName("BlackjackReact");
```

---

### Phase 4: Authentication & Authorization (If Adding User Accounts)

#### A. ASP.NET Core Identity Setup
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    
    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();
```

#### B. JWT Token Authentication
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
```

#### C. Authorization Policies
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy => 
        policy.RequireRole("Admin"));
    
    options.AddPolicy("MinimumAge", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});

[Authorize(Policy = "MinimumAge")]
[HttpPost("bet")]
public IActionResult PlaceBet([FromBody] BetDto bet)
{
    // Only authorized users can place bets
}
```

---

## ?? SECURITY CHECKLIST

### Before Going to Production:

- [ ] Update CORS origins to production domain(s)
- [ ] Review and tighten CSP policy
- [ ] Configure AllowedHosts for production domain
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up centralized logging (Application Insights, Serilog)
- [ ] Implement health checks
- [ ] Set up security monitoring/alerting
- [ ] Perform security scanning (OWASP ZAP, SonarQube)
- [ ] Implement secrets management (Azure Key Vault)
- [ ] Enable automatic security updates
- [ ] Configure Web Application Firewall (WAF)
- [ ] Set up DDoS protection
- [ ] Review and minimize exposed headers
- [ ] Implement audit logging for sensitive operations
- [ ] Set up backup and disaster recovery
- [ ] Document incident response plan

### API Security Checklist (When Adding Endpoints):

- [ ] Input validation on all endpoints
- [ ] Anti-forgery tokens on state-changing operations
- [ ] Rate limiting per endpoint/user
- [ ] Request size limits
- [ ] Output encoding to prevent XSS
- [ ] Authentication required where needed
- [ ] Authorization checks on all protected resources
- [ ] API versioning strategy
- [ ] Comprehensive error handling
- [ ] Logging without sensitive data

### Database Security Checklist (When Adding Database):

- [ ] Use parameterized queries exclusively
- [ ] Connection string in secure storage
- [ ] Encrypt sensitive data at rest
- [ ] Encrypt data in transit (SSL/TLS)
- [ ] Principle of least privilege for DB user
- [ ] Regular database backups
- [ ] SQL injection testing
- [ ] Data retention policies
- [ ] GDPR/Privacy compliance if applicable

---

## ?? SECURITY RESOURCES

### .NET Security Best Practices:
- https://learn.microsoft.com/aspnet/core/security/
- https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html

### OWASP Top 10:
- https://owasp.org/www-project-top-ten/

### Security Testing:
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp
- SonarQube: https://www.sonarqube.org/

---

## ?? CURRENT STATUS

**Your application is now hardened against:**
? Clickjacking  
? MIME-type sniffing  
? Host Header attacks  
? Basic XSS attacks  
? Information leakage via errors  
? Unauthorized cross-origin requests  
? Basic DoS attacks (request size limits)  

**Not yet protected against (requires Phase 2-4):**
?? SQL Injection (no database yet)  
?? CSRF (need to implement anti-forgery token validation)  
?? Brute force attacks (need rate limiting)  
?? Unauthorized access (no authentication yet)  

**Recommendation:** Implement Phase 2-4 as you add corresponding features.
