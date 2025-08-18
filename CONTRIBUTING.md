# Contributing to Shortcut MCP

Thank you for your interest in contributing to Shortcut MCP! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Search existing issues to avoid duplicates
- Use issue templates when available
- Provide detailed information including:
  - Operating system version
  - Node.js version
  - Steps to reproduce
  - Expected vs actual behavior
  - Error messages and logs

### Suggesting Features
- Check the roadmap to see if it's already planned
- Open a feature request with:
  - Clear use case description
  - Proposed implementation approach
  - Potential breaking changes
  - Alternative solutions considered

### Code Contributions
- Fork the repository
- Create a feature branch from main
- Make your changes following our coding standards
- Add tests for new functionality
- Update documentation as needed
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: 18.0+ (LTS recommended)
- **Git**: Latest version
- **Package Manager**: npm 8.0+ or yarn 1.22+

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/shortcut-mcp.git
cd shortcut-mcp

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Start development with hot reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

## 📝 Coding Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use explicit return types for public methods
- Avoid `any` type - use proper typing
- Use meaningful variable names

### Code Style
- Follow the ESLint configuration
- Use Prettier for formatting
- Use JSDoc comments for public APIs
- Follow conventional commit messages

### File Organization
```
src/
├── types/          # Type definitions
├── utils/          # Utility functions
├── shortcuts/      # Shortcut management
├── security/       # Security layer
├── tools/          # MCP tools
└── tests/          # Test files
```

### Naming Conventions
- Files: kebab-case (`shortcut-manager.ts`)
- Classes: PascalCase (`ShortcutManager`)
- Functions/Variables: camelCase (`executeShortcut`)
- Constants: UPPER_SNAKE_CASE (`MAX_TIMEOUT`)
- Interfaces: PascalCase with descriptive names (`ShortcutExecutionResult`)

## 🧪 Testing Guidelines

### Unit Tests
- Test individual functions in isolation
- Mock external dependencies
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('ShortcutManager', () => {
  describe('executeShortcut', () => {
    it('should execute shortcut successfully with valid input', async () => {
      // Arrange
      const manager = new ShortcutManager(mockConfig, mockLogger);
      const request = { name: 'Test Shortcut', input: 'test' };
      
      // Act
      const result = await manager.executeShortcut(request);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
    });
  });
});
```

### Integration Tests
- Test component interactions
- Use real configurations when possible
- Test error scenarios
- Verify security policies

### Test Coverage
- Aim for >90% code coverage
- Cover error paths
- Test edge cases
- Include performance tests for critical paths

## 📖 Documentation Standards

### Code Documentation
- Use JSDoc for all public APIs
- Include parameter descriptions
- Provide usage examples
- Document error conditions

```typescript
/**
 * Executes a prompt shortcut with the provided parameters.
 * 
 * @param request - The shortcut execution request
 * @param request.name - Name of the shortcut to execute
 * @param request.input - Optional input data for the shortcut
 * @param request.timeout - Execution timeout in milliseconds
 * @returns Promise resolving to execution result
 * 
 * @throws {ShortcutNotFoundError} When the specified shortcut doesn't exist
 * @throws {SecurityError} When security policies prevent execution
 * @throws {TimeoutError} When execution exceeds the timeout limit
 * 
 * @example
 * ```typescript
 * const result = await manager.executeShortcut({
 *   name: 'Code Review',
 *   input: 'function example() { return true; }',
 *   timeout: 10000
 * });
 * ```
 */
async executeShortcut(request: ExecutionRequest): Promise<ExecutionResult>
```

### README Updates
- Keep installation instructions current
- Update feature lists for new capabilities
- Add usage examples for new tools
- Update configuration options

### API Documentation
- Document all MCP tools
- Include JSON schema definitions
- Provide request/response examples
- Document error codes

## 🔒 Security Considerations

### Security Review Process
All contributions are reviewed for security implications:
- Input validation requirements
- Permission model compliance
- Audit logging coverage
- Error information disclosure

### Security Guidelines
- Validate all inputs before processing
- Sanitize outputs to prevent information leakage
- Use allowlists instead of blocklists when possible
- Log security events for monitoring
- Follow principle of least privilege

### Sensitive Information
- Never log sensitive data (passwords, tokens, etc.)
- Redact sensitive information in error messages
- Use secure defaults in configuration
- Document security implications of new features

## 🚀 Release Process

### Version Numbering
We follow Semantic Versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- Update version in `package.json`
- Update `CHANGELOG.md`
- Run full test suite
- Update documentation
- Create release notes
- Tag the release

### Changelog Format
```markdown
## [1.2.0] - 2024-01-15

### Added
- New shortcut filtering by category
- Enhanced error reporting with suggestions

### Changed
- Improved caching performance
- Updated security policy validation

### Fixed
- Fixed timeout handling for long-running shortcuts
- Resolved race condition in concurrent executions

### Security
- Enhanced input sanitization
- Added rate limiting for API calls
```

## 🤔 Questions and Support

### Getting Help
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussions
- **Documentation**: Check existing docs first
- **Code Review**: Ask questions in pull request comments

### Communication Guidelines
- Be respectful and constructive
- Provide context for your questions
- Use clear, descriptive titles
- Follow up on your issues and PRs

## 📋 Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] New tests added for changes

## Documentation
- [ ] Code comments updated
- [ ] API documentation updated
- [ ] README updated (if needed)
- [ ] CHANGELOG updated

## Security
- [ ] No sensitive information exposed
- [ ] Input validation implemented
- [ ] Security policies respected
- [ ] Audit logging included (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Breaking changes documented
- [ ] All tests pass
```

## 🏆 Recognition

Contributors will be recognized in:
- Contributors section of README
- Release notes for significant contributions
- GitHub contributors graph
- Special mentions for major features

---

Thank you for contributing to Shortcut MCP! Your efforts help make prompt management more efficient for developers everywhere.

**Author**: aezi zhu  
**GitHub**: [@aezizhu](https://github.com/aezizhu)  
**Project**: [shortcut-mcp](https://github.com/aezizhu/shortcut-mcp)
