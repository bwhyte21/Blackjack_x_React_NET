# C# Development Guidelines

This document outlines the code quality standards and best practices for the .NET 8 backend portion of this project. All contributors should follow these guidelines to maintain consistency and code quality.

**IMPORTANT:** All changes, features, and implementations must adhere to these guidelines. Before submitting any code, review this document to ensure compliance with the established standards.

---

## Project Dependencies

### Core Technologies

- **.NET**: 8.0 (LTS)
- **ASP.NET Core**: 8.0
- **C#**: 12.0
- **Target Framework**: net8.0

### Important Version Compatibility Notes

- **Always use .NET 8** features and patterns
- **Enable nullable reference types** - this project uses C# 12 with nullable context
- **Use modern C# patterns** (pattern matching, records, primary constructors when appropriate)
- **Leverage minimal APIs** for simple endpoints when appropriate
- Always verify NuGet package compatibility with .NET 8 before adding dependencies

---

## Migration Reference

See [docs/MIGRATION_BACKEND.md](docs/MIGRATION_BACKEND.md) for .NET Framework to .NET 8
migration steps and API compatibility guidance.

---

## Core Development Principles

### KISS (Keep It Simple, Stupid)

- Write simple, straightforward code that is easy to understand
- Avoid over-engineering solutions with unnecessary abstractions
- Choose clarity over cleverness - readable code beats clever code
- Break complex business logic into smaller, manageable methods
- Favor composition over inheritance

### DRY (Don't Repeat Yourself)

- Avoid code duplication across controllers, services, and middleware
- Extract repeated logic into extension methods or utility classes
- Use shared constants and configuration instead of hardcoded values
- Create abstractions when the same pattern appears multiple times
- Utilize dependency injection to share common services

### YAGNI (You Aren't Gonna Need It)

- Only implement features that are currently required
- Don't add functionality based on speculation about future needs
- Remove unused usings, methods, and classes
- Keep the codebase lean and focused on actual requirements
- Avoid creating interfaces until you have multiple implementations

---

## Developer Approaches

### Root Cause Analysis First

- **Investigate the underlying problem** before implementing a solution
- Don't just treat symptoms - understand why the issue exists
- Ask "why" multiple times to get to the root cause
- Document your findings to prevent similar issues
- Consider the full request pipeline when debugging issues

### Architectural Thinking

- **Consider the big picture** before making changes
- Understand how controllers, services, and middleware interact
- Think about scalability, maintainability, and testability
- Design solutions that fit within the existing ASP.NET Core architecture
- Question whether the current architecture supports the change efficiently
- Consider the impact on both development and production environments

### Single Source of Truth

- **Maintain one authoritative source** for each piece of configuration or logic
- Avoid duplicating configuration across multiple appsettings files unnecessarily
- Use shared services and extension methods for common functionality
- Reference configuration sources rather than copying values
- Centralize security policies and middleware configuration

### Pattern Recognition

- **Identify existing patterns** in the codebase before implementing new solutions
- Look for similar controllers, services, or middleware that have already been implemented
- Reuse established patterns for consistency (controller structure, error handling, etc.)
- When introducing new patterns, ensure they're necessary and well-documented
- Follow established ASP.NET Core conventions and patterns

### Comprehensive Problem Solving

- **Consider all aspects** of a problem before implementing a solution
- Think about edge cases, error scenarios, and exception handling
- Evaluate performance, security, and monitoring implications
- Consider both immediate needs and future maintenance
- Test across different environments (development, staging, production)

### Technical Debt Reduction

- **Leave code better than you found it** (Boy Scout Rule)
- Address technical debt when working in an area
- Refactor incrementally as part of feature work when appropriate
- Document known technical debt for future reference
- Balance debt reduction with feature delivery
- Remove obsolete code and unused dependencies

### Change Impact Analysis

- **Assess the impact** of changes before implementation
- Identify all controllers, services, middleware, and configuration affected by a change
- Consider backward compatibility and API versioning
- Test thoroughly across all affected areas and environments
- Communicate potential impacts to the team
- Consider database migration impacts if applicable

---

## Developer Workflows

### Check IDE for Errors First

- **Always review IDE errors and warnings** before building or committing code
- **Check the IDE for errors after every change** - don't wait until the end
- Address C# compiler errors immediately - don't ignore or suppress them unnecessarily
- Pay attention to nullable reference type warnings
- **Fix warnings as well as errors** - warnings often indicate potential issues
- Use the Error List in Visual Studio to see all issues at a glance
- Fix errors at the source rather than working around them
- **This is a mandatory step** - no code should be committed with compilation errors or unresolved warnings

### Code Formatting

- **Use built-in Visual Studio formatting** (Ctrl+K, Ctrl+D) after creating or updating files
- **MANDATORY: Format all new or modified documents** after completing any implementation
- Configure consistent formatting rules in `.editorconfig`
- **Format on save is recommended** - configure your IDE to automatically format files you're actively editing
- **NEVER run formatters on all files** without explicit permission
- Running formatters globally can create massive diffs and obscure actual changes
- If you need to format multiple files, request permission first
- **Final step requirement**: Before committing code, ensure all modified files are properly formatted

#### Post-Implementation Formatting Checklist

After completing any code implementation:

- [ ] **Format all modified .cs files** using Ctrl+K, Ctrl+D
- [ ] **Check formatting is consistent** with existing code style
- [ ] **Verify no unintended formatting changes** were made to unrelated code
- [ ] **Ensure indentation and spacing** follow project standards
- [ ] **Confirm braces and line endings** are consistent

---

## C# Best Practices

### Proper Typing and Nullability

- **Always enable nullable reference types** and handle null cases appropriately
- **Use explicit types** for method parameters and return values
- **Avoid using `dynamic`** unless absolutely necessary for interop scenarios
- **Define DTOs/models** for API requests and responses
- **Use value types appropriately** and consider nullable value types when needed

```csharp
// Good Example
public async Task<ActionResult<UserDto>> GetUser(string userId)
{
    if (string.IsNullOrEmpty(userId))
        return BadRequest("User ID is required");

    var user = await _userService.GetUserAsync(userId);
    return user is not null ? Ok(user) : NotFound();
}

// Bad Example
public async Task<dynamic> GetUser(dynamic id)
{
    var user = await _userService.GetUserAsync(id);
    return user;
}
```

### Modern C# Features

- Use pattern matching where appropriate
- Leverage records for immutable data transfer objects
- Use string interpolation instead of string concatenation
- Utilize LINQ for collection operations
- Apply `async/await` properly for asynchronous operations

### Dependency Injection

- **Register services in Program.cs** using the built-in DI container
- **Use constructor injection** as the primary injection method
- **Avoid service locator pattern** - don't inject IServiceProvider
- **Register services with appropriate lifetimes** (Singleton, Scoped, Transient)

---

## Code Organization & Naming Conventions

### Follow Existing Patterns

- **Review existing code** before creating new controllers or services
- **Match the project's naming conventions** for classes, methods, and properties
- **Maintain consistency** with the established folder structure
- **Follow the same code style** (indentation, spacing, braces)

### Naming Conventions

- **Classes**: PascalCase (e.g., `SecurityHeadersMiddleware`, `ContactController`)
- **Methods**: PascalCase (e.g., `GetUserAsync`, `ValidateInput`)
- **Properties**: PascalCase (e.g., `UserName`, `MaxRetries`)
- **Fields**: camelCase with underscore prefix for private fields (e.g., `_logger`, `_configuration`)
- **Constants**: PascalCase (e.g., `DefaultTimeout`, `MaxRetries`)
- **Interfaces**: PascalCase with 'I' prefix (e.g., `IUserService`, `ISecurityPolicy`)
- **Namespaces**: Match folder structure (e.g., `WolfiesWebReact.Security`, `WolfiesWebReact.Controllers`)

### File and Folder Organization

```text
Controllers/          # API controllers
|-- HomeController.cs
|-- ErrorController.cs
`-- WeatherController.cs

Models/               # DTOs and data models
|-- SecurityModels.cs
`-- ApiModels.cs

Security/             # Security-related classes
|-- SecurityHeadersMiddleware.cs
`-- SecurityConfigurationExtensions.cs

Services/             # Business logic services
`-- (add services here as needed)

Extensions/           # Extension methods
`-- (add extensions here as needed)
```

---

## Security Guidelines

### Input Validation

- **Always validate input** at controller level using model validation
- **Use data annotations** for basic validation rules
- **Sanitize user input** to prevent XSS attacks
- **Never trust client input** - validate everything server-side

### Authentication & Authorization

- **Use built-in ASP.NET Core security** features when authentication is needed
- **Apply authorization policies** consistently across controllers
- **Secure API endpoints** with appropriate authentication/authorization
- **Follow principle of least privilege**

### Configuration Security

- **Never hardcode sensitive data** (connection strings, API keys, secrets)
- **Use User Secrets** for development configuration
- **Use environment variables** or Azure Key Vault for production secrets
- **Validate configuration** on application startup

```csharp
// Good Example
public class ContactController : ControllerBase
{
    private readonly string _apiKey;

    public ContactController(IConfiguration configuration)
    {
        _apiKey = configuration["ExternalApi:ApiKey"] ??
                 throw new InvalidOperationException("API key not configured");
    }
}

// Bad Example
public class ContactController : ControllerBase
{
    private const string ApiKey = "abc123-hardcoded-key"; // Never do this!
}
```

---

## Error Handling and Logging

### Exception Handling

- **Use global exception handling** middleware for unhandled exceptions
- **Return appropriate HTTP status codes** for different error scenarios
- **Don't expose internal details** in production error responses
- **Log exceptions with sufficient context** for debugging

### Logging Best Practices

- **Use structured logging** with proper log levels
- **Include relevant context** (user ID, request ID, etc.) in log messages
- **Don't log sensitive information** (passwords, tokens, personal data)
- **Use log levels appropriately**: Debug, Information, Warning, Error, Critical

```csharp
// Good Example
[HttpGet("{userId}")]
public async Task<ActionResult<UserDto>> GetUser(string userId)
{
    _logger.LogInformation("Getting user with ID: {UserId}", userId);

    try
    {
        var user = await _userService.GetUserAsync(userId);

        if (user is null)
        {
            _logger.LogWarning("User not found: {UserId}", userId);
            return NotFound();
        }

        return Ok(user);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving user {UserId}", userId);
        return StatusCode(500, "An error occurred while retrieving the user");
    }
}

// Bad Example
[HttpGet("{userId}")]
public async Task<ActionResult<UserDto>> GetUser(string userId)
{
    try
    {
        var user = await _userService.GetUserAsync(userId);
        return Ok(user);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message); // Exposes internal details
    }
}
```

---

## API Design Guidelines

### Controller Design

- **Keep controllers thin** - delegate business logic to services
- **Use appropriate HTTP verbs** (GET, POST, PUT, DELETE, PATCH)
- **Return appropriate status codes** (200, 201, 400, 404, 500)
- **Use consistent response formats** across all endpoints
- **Apply validation attributes** to action parameters

### Route Design

- **Use conventional routing** or attribute routing consistently
- **Keep URLs RESTful** and intuitive
- **Version APIs appropriately** when needed
- **Use route constraints** for parameter validation

### Response Handling

- **Return typed results** using `ActionResult<T>`
- **Use DTOs** for API responses rather than internal models
- **Include relevant metadata** in responses (pagination, etc.)
- **Handle content negotiation** appropriately

---

## Testing Guidelines

### Unit Testing

- **Write tests for business logic** in services and utilities
- **Mock external dependencies** properly
- **Use descriptive test names** that explain the scenario
- **Follow AAA pattern** (Arrange, Act, Assert)
- **Test both success and failure scenarios**

### Integration Testing

- **Test API endpoints** with realistic scenarios
- **Use TestHost** for ASP.NET Core integration tests
- **Test middleware behavior** and request pipeline
- **Verify error handling** and status codes

---

## Performance Considerations

### Async/Await

- **Use async/await** for I/O bound operations
- **Don't block on async calls** using `.Result` or `.Wait()`
- **Configure async context** properly in libraries
- **Avoid async void** except for event handlers

### Memory Management

- **Dispose resources properly** using `using` statements or `IDisposable`
- **Be mindful of large object allocations**
- **Use object pooling** for frequently allocated objects when appropriate
- **Profile memory usage** in performance-critical scenarios

### Caching

- **Cache expensive operations** appropriately
- **Use built-in ASP.NET Core caching** (IMemoryCache, IDistributedCache)
- **Consider cache invalidation strategies**
- **Be mindful of cache coherency** in distributed scenarios

---

## Configuration Management

### appsettings.json Structure

- **Organize configuration logically** by feature or component
- **Use hierarchical configuration** (Development, Staging, Production)
- **Document configuration options** with comments when appropriate
- **Validate required configuration** on startup

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Security": {
    "Cors": {
      "AllowedOrigins": ["https://example.com"]
    },
    "RateLimiting": {
      "Api": {
        "PermitLimit": 100,
        "WindowMinutes": 1
      }
    }
  }
}
```

### Environment-Specific Configuration

- **Keep sensitive data out** of appsettings.json
- **Use User Secrets** for local development
- **Use environment variables** for production
- **Override configuration** appropriately per environment

---

## Code Documentation

### XML Documentation Comments

- **Document public APIs** with XML comments
- **Include parameter descriptions** and return value information
- **Document exceptions** that can be thrown
- **Provide usage examples** for complex APIs

```csharp
/// <summary>
/// Retrieves a user by their unique identifier.
/// </summary>
/// <param name="userId">The unique identifier of the user to retrieve.</param>
/// <returns>
/// A task that represents the asynchronous operation.
/// The task result contains the user data if found, or null if not found.
/// </returns>
/// <exception cref="ArgumentException">
/// Thrown when <paramref name="userId"/> is null or empty.
/// </exception>
public async Task<UserDto?> GetUserAsync(string userId)
{
    // Implementation
}
```

### Code Comments

- **Explain complex business logic** and algorithms
- **Document non-obvious design decisions**
- **Use TODO/FIXME/NOTE** comments appropriately
- **Keep comments up-to-date** when code changes
- **Don't comment obvious code**

### Documentation Formatting Standards

When creating or updating documentation files (.md):

- **Use ASCII characters only** for maximum GitHub compatibility
- **Avoid Unicode symbols** (checkmarks, X marks, emojis) - use descriptive text instead
- **Use ASCII tree characters** for folder structures: `|--`, `\`--`instead of`???`,`???`
- **Replace emojis with descriptive text** for professional documentation
- **Test rendering on GitHub** before committing documentation changes

#### README Template

For creating new README files, use the standardized template:

- **Template Location**: [`docs/README_TEMPLATE.md`](README_TEMPLATE.md)
- **Usage**: Follow the template structure and replace bracketed placeholders
- **Standards Compliance**: Template follows all ASCII formatting requirements
- **Customization**: Adapt sections based on project needs while maintaining professional standards

Example of ASCII-safe folder structure:

```text
ProjectRoot/
|-- Controllers/
|   |-- HomeController.cs
|   `-- ErrorController.cs
`-- Models/
    `-- SecurityModels.cs
```

---

## Change Management

### Minimize Changes

- **Only modify code directly related to the request** or task at hand
- **Avoid refactoring unrelated code** in the same commit
- **Keep pull requests focused** and scoped to a single feature or fix
- **Resist the urge to "improve" unrelated code** while working on a task

### Before Creating New Files

1. **Search for existing classes/services** that serve a similar purpose
2. **Check if functionality already exists** elsewhere in the codebase
3. **Consider extending existing classes** rather than creating new ones
4. **Follow the established folder structure** for new files
5. **Ensure the new file is truly necessary** and doesn't duplicate existing functionality

### Checklist Before Committing

- [ ] Have I checked the IDE for errors and warnings?
- [ ] **Have I formatted all new or modified files using Ctrl+K, Ctrl+D?**
- [ ] Have I checked for existing similar functionality?
- [ ] Are my changes minimal and focused?
- [ ] Have I removed any unused usings or code?
- [ ] Do my changes follow the existing naming conventions?
- [ ] Have I added appropriate XML documentation for public APIs?
- [ ] Have I included proper error handling and logging?
- [ ] Have I run the application to test my changes?
- [ ] Does my code follow KISS, DRY, and YAGNI principles?
- [ ] Have I considered security implications?
- [ ] Are my async methods properly implemented?
- [ ] Have I followed established patterns for dependency injection?\_

---

## MSBuild and Project File Guidelines

### Critical MSBuild Syntax

- **NEVER modify MSBuild item transformation syntax** without understanding the implications
- **The arrow operator (`->`) is critical** for MSBuild item transformations and collections
- **Do not format or alter** MSBuild expressions that use item functions
- **NEVER HTML-encode MSBuild syntax** - always preserve the raw `->` characters

#### Important Examples to Preserve

```xml
<!-- CRITICAL: Do not modify this arrow syntax (->) -->
<Error Condition="@(ReactBuildFiles->Count()) == 0" Text="No React build files found. React build may have failed." />

<!-- Other critical MSBuild patterns with arrows: -->
@(ItemGroup->'%(RecursiveDir)%(Filename)%(Extension)')
@(ReactDistFiles->Count())
@(ResolvedFileToPublish)
```

#### Common MSBuild Syntax Errors to Avoid

```xml
<!-- WRONG: HTML-encoded arrows will break the build -->
<Error Condition="@(ReactBuildFiles-&gt;Count()) == 0" Text="..." />

<!-- CORRECT: Raw arrow syntax must be preserved -->
<Error Condition="@(ReactBuildFiles->Count()) == 0" Text="..." />
```

**Warning**: Modifying these expressions can break the build and publishing process entirely. When working with `.csproj` files, only modify non-MSBuild content unless you fully understand MSBuild item transformation syntax.

### MSBuild Editing Guidelines

- **Use XML-aware editors** when possible to prevent encoding issues
- **Always validate syntax** after editing `.csproj` files
- **Test build and publish** after any MSBuild modifications
- **Never use HTML entities** (`&gt;`, `&lt;`, `&amp;`) in MSBuild expressions
- **Preserve whitespace and formatting** in complex MSBuild targets
- **Document any custom MSBuild targets** with comments explaining their purpose

---

## Code Quality Standards

### General Guidelines

- **Write self-documenting code** with clear class and method names
- **Keep methods small and focused** - ideally under 50 lines
- **Use meaningful parameter names** - avoid abbreviations
- **Handle errors appropriately** - don't silently swallow exceptions
- **Clean up after yourself** - remove debug code and commented-out code

### SOLID Principles

- **Single Responsibility** - Classes and methods should have one reason to change
- **Open/Closed** - Open for extension, closed for modification
- **Liskov Substitution** - Derived classes should be substitutable for base classes
- **Interface Segregation** - Many client-specific interfaces are better than one general-purpose interface
- **Dependency Inversion** - Depend on abstractions, not concretions

---

## Code Review Expectations

When submitting code for review:

- **Provide context and reasoning** for your changes
- **Self-review your code** before requesting review from others
- **Be open to feedback** and willing to make improvements
- **Respond to review comments** promptly
- **Test your changes thoroughly** before submitting

When reviewing code:

- **Check for adherence** to these guidelines
- **Look for potential bugs** or edge cases
- **Ensure code is understandable** and maintainable
- **Verify security best practices** are followed
- **Provide constructive feedback**

---

## Resources

- [.NET 8 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [ASP.NET Core Best Practices](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
- [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [Clean Code Principles](https://github.com/thangchung/clean-code-dotnet)
- [ASP.NET Core Security Best Practices](https://docs.microsoft.com/en-us/aspnet/core/security/)

---

### _Last Updated: January 27, 2026_
