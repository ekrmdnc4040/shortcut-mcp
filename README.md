
# Shortcut MCP - Save Your Long Prompts as Simple Commands

**Stop copying and pasting the same 500-word prompts every day.**

Shortcut MCP lets you save YOUR frequently used long prompts as custom shortcuts. That complex prompt you use for code reviews? Save it as `/review`. Your detailed debugging instructions prompt? Now it's just `/debug`. The elaborate persona you crafted? Simply `/expert`.

**Built for developers who value their time and hate repetition.**

## 🚀 Real Examples - See the Difference

### Before (What you used to type):
```
"You are a senior software engineer with 15+ years of experience in building 
production systems. Perform a thorough code review of the following code. 
Your review should cover: 1. Code Quality: Assess readability, maintainability, 
and adherence to best practices and design patterns. 2. Potential Bugs: 
Identify any logic errors, edge cases not handled, or potential runtime 
exceptions. 3. Security: Check for security vulnerabilities including 
injection attacks, data exposure, authentication/authorization issues. 
4. Performance: Analyze algorithmic complexity, database queries, caching 
opportunities, and potential bottlenecks. 5. Testing: Evaluate test coverage 
and suggest additional test cases. 6. Documentation: Assess inline comments, 
function documentation, and clarity. 7. Architecture: Comment on the overall 
design, separation of concerns, and scalability. Provide specific line-by-line 
feedback where appropriate, and conclude with a summary of the most critical 
issues to address. Be constructive but thorough - this code will go to 
production. Code to review: [YOUR CODE HERE]"
```

### After (What you type now):
```
/coderev [YOUR CODE HERE]
```

**That's it. From 300+ words to just 8 characters.**

## 💡 How It Works

### 1. You Have a Long Prompt You Use Often
Maybe it's a 300-word code review checklist, a 500-word debugging guide, or a complex persona description you've perfected over months.

### 2. Save It as a Shortcut
```json
{
  "command": "/myreview",
  "prompt": "[Your 300-word code review prompt here]"
}
```

### 3. Use It Instantly
Instead of: *[Paste 300 words]* + your code  
Now just type: `/myreview` + your code

**That's it. Your personal prompt library, always at your fingertips.**

## 📚 Complete Customization Guide

### Real Examples from Popular Prompts

#### Example 1: The "Perfect Code Assistant" Prompt (400+ words)
This is one of the most popular prompts developers use repeatedly:

```javascript
// Step 1: Define your custom shortcut
create_shortcut({
  command: "/assistant",
  name: "Perfect Coding Assistant",
  prompt: `You are an expert programmer with deep knowledge across multiple languages and frameworks. Your approach combines theoretical knowledge with practical experience from production systems.

CORE PRINCIPLES:
1. Write clean, maintainable code that follows SOLID principles
2. Always consider edge cases and error handling
3. Optimize for readability first, performance second (unless specified)
4. Include comprehensive comments for complex logic
5. Follow language-specific best practices and idioms

RESPONSE FORMAT:
- Start with a brief analysis of the problem
- Present the solution with clear explanations
- Include code with detailed comments
- Discuss time/space complexity when relevant
- Suggest alternative approaches if applicable
- Mention potential pitfalls or considerations

CODING STANDARDS:
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Implement proper error handling and logging
- Add input validation where necessary
- Consider security implications (input sanitization, SQL injection, XSS, etc.)
- Write code that is testable and mockable

DOCUMENTATION:
- Add docstrings/JSDoc comments for all public functions
- Include usage examples in comments
- Document any assumptions or limitations
- Explain complex algorithms or business logic

When reviewing code, check for:
- Logic errors and edge cases
- Security vulnerabilities
- Performance bottlenecks
- Code smells and anti-patterns
- Missing error handling
- Opportunities for refactoring

Always be constructive and educational in your responses. If you see a better way to do something, explain why it's better, not just that it is better.

Task to complete: {input}`
})

// Step 2: Use it with a simple command
// Instead of pasting all 400+ words every time, just type:
// /assistant "implement a rate limiter in Python"
```

#### Example 2: The "Chain of Thought" Reasoning Prompt (350+ words)
Popular for complex problem-solving:

```javascript
create_shortcut({
  command: "/think",
  name: "Chain of Thought Reasoning",
  prompt: `Let's approach this step-by-step using careful reasoning.

THINKING PROCESS:
1. First, I'll break down what's being asked
2. Then identify key components and constraints
3. Consider multiple approaches
4. Evaluate trade-offs
5. Select the best solution
6. Implement with careful consideration

For each step, I will:
- State my current understanding
- Identify assumptions I'm making
- Consider what could go wrong
- Think about edge cases
- Validate my reasoning

PROBLEM ANALYSIS:
Let me start by understanding the core problem. The request is about: {input}

Key aspects to consider:
- What is the desired outcome?
- What constraints exist?
- What resources are available?
- What are the success criteria?

SOLUTION EXPLORATION:
I'll explore multiple solutions:

Option 1: [Describe first approach]
- Pros: 
- Cons:
- Complexity:
- Risks:

Option 2: [Describe alternative approach]
- Pros:
- Cons:
- Complexity:
- Risks:

Option 3: [Describe another alternative if applicable]
- Pros:
- Cons:
- Complexity:
- Risks:

DECISION RATIONALE:
Based on the analysis, I recommend [selected approach] because:
1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

IMPLEMENTATION PLAN:
Step 1: [Detailed first step]
Step 2: [Detailed second step]
Step 3: [Continue with all steps]

VALIDATION:
To ensure this solution works:
- Test case 1: [Description]
- Test case 2: [Description]
- Edge case consideration: [Description]

POTENTIAL IMPROVEMENTS:
Future enhancements could include:
- [Improvement 1]
- [Improvement 2]

Let me now provide the complete solution...`
})

// Usage: /think "design a distributed cache system"
```

#### Example 3: The "Code Reviewer" Prompt (500+ words)
Used by teams for consistent code reviews:

```javascript
create_shortcut({
  command: "/review",
  name: "Comprehensive Code Review",
  prompt: `As a senior engineer, I'll review this code across multiple dimensions. My review will be thorough but constructive, focusing on helping you improve the code and learn best practices.

REVIEW CHECKLIST:

1. FUNCTIONALITY & CORRECTNESS
- Does the code do what it's supposed to do?
- Are all requirements met?
- Are there any logic errors or bugs?
- Edge cases handled properly?
- Off-by-one errors?
- Null/undefined handling?

2. CODE QUALITY & READABILITY
- Is the code self-documenting?
- Are variable/function names descriptive?
- Is the code DRY (Don't Repeat Yourself)?
- Appropriate abstraction levels?
- Consistent coding style?
- Proper indentation and formatting?

3. PERFORMANCE & EFFICIENCY
- Time complexity analysis
- Space complexity concerns
- Database query optimization
- Caching opportunities
- Unnecessary loops or operations
- Memory leaks potential
- Resource cleanup

4. SECURITY CONSIDERATIONS
- Input validation and sanitization
- SQL injection vulnerabilities
- XSS attack vectors
- Authentication/authorization issues
- Sensitive data exposure
- Proper encryption usage
- Security headers
- CORS configuration

5. ERROR HANDLING & RESILIENCE
- Proper try-catch blocks
- Meaningful error messages
- Graceful degradation
- Retry logic where appropriate
- Circuit breaker patterns
- Timeout handling
- Rollback mechanisms

6. TESTING & TESTABILITY
- Test coverage adequacy
- Edge cases in tests
- Mock usage appropriateness
- Test isolation
- Test naming clarity
- Integration test scenarios
- Performance test considerations

7. ARCHITECTURE & DESIGN PATTERNS
- SOLID principles adherence
- Design pattern usage
- Coupling and cohesion
- Dependency injection
- Interface segregation
- Modularity
- Scalability considerations

8. DOCUMENTATION & COMMENTS
- Function/class documentation
- Complex logic explanation
- API documentation
- README updates needed
- Inline comment quality
- TODO/FIXME items
- Changelog updates

9. DEPENDENCIES & COMPATIBILITY
- Unnecessary dependencies
- Dependency versions
- License compatibility
- Breaking changes
- Deprecation warnings
- Browser compatibility
- Backward compatibility

10. MAINTAINABILITY & FUTURE-PROOFING
- Code flexibility
- Configuration vs hardcoding
- Feature flags usage
- Database migration strategy
- API versioning
- Monitoring/logging hooks
- Debug capabilities

REVIEW OUTPUT FORMAT:
- Critical Issues: [Must fix before merge]
- Major Concerns: [Should address]
- Minor Suggestions: [Nice to have]
- Positive Feedback: [What was done well]
- Learning Opportunities: [Educational points]

Code to review: {input}`
})

// Usage: /review [paste your code]
```

### How to Create Your Own Custom Shortcuts

#### Step 1: Identify Your Repetitive Prompts
Look for prompts you use frequently:
- Complex debugging instructions
- Detailed code review checklists
- Specific formatting requirements
- Role-playing scenarios
- Analysis frameworks

#### Step 2: Create the Shortcut
Use the MCP tool to save your prompt:

```javascript
{
  "name": "create_shortcut",
  "arguments": {
    "command": "/your-command",
    "name": "Descriptive Name",
    "description": "What this prompt does",
    "prompt": "Your full prompt text here with {input} for dynamic content",
    "category": "coding|thinking|writing|analysis",
    "tags": ["relevant", "tags", "for", "search"]
  }
}
```

#### Step 3: Organize Your Shortcuts
- Use categories: `coding`, `debugging`, `review`, `architecture`, `testing`
- Add tags for easy discovery
- Mark favorites for quick access
- Track usage to optimize your library

### Popular Prompts You Can Add

1. **The "Explain Like I'm 5" Prompt** → `/eli5`
2. **The "Find Security Vulnerabilities" Prompt** → `/security`
3. **The "Convert to TypeScript" Prompt** → `/typescript`
4. **The "Write Unit Tests" Prompt** → `/unittest`
5. **The "Optimize for Performance" Prompt** → `/perf`
6. **The "API Documentation" Prompt** → `/apidoc`
7. **The "Database Schema Design" Prompt** → `/schema`
8. **The "React Best Practices" Prompt** → `/react`
9. **The "Python PEP8" Prompt** → `/pep8`
10. **The "System Design Interview" Prompt** → `/sysdesign`

## 🎯 Perfect For

- **Developers** with elaborate debugging or review prompts
- **Architects** using detailed system design templates  
- **Team Leads** with standardized code review checklists
- **Engineers** who've crafted the perfect prompts through trial and error
- **Anyone** tired of managing prompts in separate documents

## ✨ Key Features

### Core Functionality
- **⚡ Long Prompt Replacement**: Replace 500+ word prompts with simple `/commands`
- **🎨 Complex Templates**: Store multi-paragraph instructions, personas, and chain-of-thought reasoning
- **📝 Custom Creation**: Save your carefully crafted prompts and reuse them instantly
- **🗂️ Smart Organization**: Categorize by use case, project, or workflow
- **⭐ Favorites System**: Quick access to your most powerful prompts
- **🔍 Intelligent Search**: Find the right prompt by keyword or description

### Advanced Capabilities
- **💾 Persistent Storage**: Your shortcuts are saved locally and sync across sessions
- **📊 Usage Analytics**: Track which shortcuts you use most frequently
- **🏷️ Tag System**: Organize shortcuts with custom tags for better discovery
- **📤 Import/Export**: Share shortcut collections with others
- **🔄 Version Control**: Track changes and updates to your shortcuts

### Developer Experience
- **📚 TypeScript First**: Full type safety and IntelliSense support
- **🧪 Comprehensive Testing**: Unit tests, integration tests, and test scenarios
- **📖 Rich Documentation**: API reference, architecture guides, and examples
- **🔧 Easy Configuration**: JSON-based config with environment variable overrides

## 🏗️ Architecture

Built for universal MCP compatibility:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Any MCP       │    │  Prompt Shortcut │    │  Local Storage  │
│   Compatible    │◄──►│   MCP Server     │◄──►│   & Templates   │
│   Platform      │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Supported Platforms:**
- **Claude Desktop** - Anthropic's official app
- **Cline (VSCode)** - AI assistant extension
- **Continue.dev** - Open-source coding assistant  
- **Cursor IDE** - AI-powered code editor
- **Custom Applications** - Any MCP-compatible client

**Core Components:**
- **MCP Protocol**: Full Model Context Protocol compliance
- **Node.js/TypeScript**: Modern, type-safe server implementation
- **@modelcontextprotocol/sdk**: Official MCP SDK for protocol compliance
- **Prompt Manager**: Intelligent parsing and expansion of shortcut commands
- **Local Database**: Persistent storage of your custom shortcuts

## 📦 Installation

### System Requirements

- **macOS**: 12.0 (Monterey) or later
- **Node.js**: 18.0+ (LTS recommended)
- **Package Manager**: npm 8.0+ or yarn 1.22+
- **Shortcuts App**: Pre-installed with macOS

### 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd shortcut-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Verify installation
npm run test

# Start the MCP server
npm start
```

### 🔧 Configuration

Create a custom configuration file:

```bash
# Copy example config
cp examples/config.example.json config/local.json
```

**Basic Configuration:**
```json
{
  "server": {
    "name": "my-shortcut-mcp",
    "version": "1.0.0"
  },
  "shortcuts": {
    "allowedPrefixes": ["Safe", "Public", "Demo"],
    "blockedShortcuts": ["System Config", "Admin Tools"],
    "maxExecutionTime": 30000,
    "enableCache": true
  },
  "security": {
    "requireConfirmation": false,
    "logExecutions": true,
    "allowSystemShortcuts": false
  },
  "logging": {
    "level": "info",
    "console": true
  }
}
```

### 🔐 Environment Variables

Override configuration with environment variables:

```bash
export LOG_LEVEL=debug
export MAX_EXECUTION_TIME=45000
export ENABLE_CACHE=true
export ALLOW_SYSTEM_SHORTCUTS=false
```

### 🔌 MCP Platform Integration

This MCP server works with **any MCP-compatible platform**:

#### Claude Desktop
```json
{
  "mcpServers": {
    "prompt-shortcuts": {
      "command": "node",
      "args": ["/path/to/shortcut-mcp/dist/index.js"]
    }
  }
}
```

#### Cline (VSCode Extension)
```json
{
  "mcpServers": {
    "prompt-shortcuts": {
      "command": "node",
      "args": ["/path/to/shortcut-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

#### Continue.dev
```json
{
  "models": [...],
  "mcpServers": {
    "prompt-shortcuts": {
      "command": "node",
      "args": ["/path/to/shortcut-mcp/dist/index.js"]
    }
  }
}
```

#### Custom MCP Client
```typescript
import { MCPClient } from '@modelcontextprotocol/client';

const client = new MCPClient({
  transport: {
    type: 'stdio',
    command: 'node',
    args: ['/path/to/shortcut-mcp/dist/index.js']
  }
});

// Use parse_shortcut tool
const result = await client.callTool('parse_shortcut', {
  input: '/th How does AI reasoning work?'
});
```

## 📝 Create Your Own Shortcuts

### Example: Save Your Code Review Prompt
```javascript
// Your current workflow:
// 1. Open your prompts document
// 2. Find your code review prompt (300+ words)
// 3. Copy it
// 4. Paste into AI chat
// 5. Add your code

// With Shortcut MCP:
create_shortcut({
  command: "/myreview",
  name: "My Team's Code Review",
  prompt: `You are reviewing code for our team's production system.
  
  Check for:
  - Our style guide compliance (4 spaces, no tabs)
  - Security issues specific to our stack (Node.js, PostgreSQL)
  - Performance implications for our 100k daily users
  - Missing error handling for our payment system
  - Compliance with our logging standards
  - Unit test coverage (minimum 80%)
  - Documentation in our format
  
  [... your full 300+ word prompt ...]
  
  Code to review: {input}`
})

// Now just type: /myreview [code]
```

### Example: Save Your Debugging Template
```javascript
create_shortcut({
  command: "/debug-prod",
  name: "Production Debugging Guide",
  prompt: `[Your 500+ word debugging methodology that includes:
  - System architecture context
  - Common failure points
  - Log analysis steps
  - Database query patterns
  - Performance profiling steps
  - Rollback procedures
  - Incident documentation
  ...]
  
  Issue to debug: {input}`
})

// Usage: /debug-prod "Users can't login after deployment"
```

## 🚀 Usage

### Quick Start Examples

#### Basic Shortcut Usage
Simply type your shortcut command in any conversation:

```
User: "/th How can we solve climate change effectively?"
→ Expands to: "Think harder about this problem. Analyze it step by step with deep reasoning and consider multiple perspectives. How can we solve climate change effectively?"

User: "/ider 故事发生在2150年的火星殖民地，人类和AI共同治理社会..."
→ Expands to: "You are a skilled science fiction writer. Based on the following prompt, write a compelling story with rich details: 故事发生在2150年的火星殖民地..."

User: "/code Create a Python function to calculate Fibonacci numbers"
→ Expands to: "You are an expert programmer. Write clean, well-documented code for: Create a Python function to calculate Fibonacci numbers"
```

### Built-in Shortcuts

| Command | Purpose | Example |
|---------|---------|---------|
| `/th` | Think Harder | Deep analysis and reasoning |
| `/ider` | Sci-Fi Writer | Creative story writing |
| `/code` | Expert Programmer | Code generation |
| `/explain` | Simple Explainer | Break down complex topics |
| `/pros-cons` | Analysis | Pros and cons comparison |

### MCP Tools

#### `parse_shortcut` - Expand Commands
Detects and expands shortcut commands in user input.

```json
{
  "name": "parse_shortcut",
  "arguments": {
    "input": "/th How does quantum computing work?"
  }
}
```

#### `list_shortcuts` - Browse Available Shortcuts
View all your shortcuts with filtering options.

```json
{
  "name": "list_shortcuts",
  "arguments": {
    "category": "writing",
    "favorites": true
  }
}
```

### Shortcut Management Tools

#### `create_shortcut` - Create Custom Shortcuts
Build your own shortcuts with custom prompts and templates.

```json
{
  "name": "create_shortcut",
  "arguments": {
    "command": "/debug",
    "name": "Code Debugger",
    "description": "Help debug code issues",
    "prompt": "You are an expert debugger. Analyze this code and identify potential issues, suggest fixes, and explain your reasoning: {input}",
    "category": "coding",
    "tags": ["debug", "programming", "troubleshooting"]
  }
}
```

#### `update_shortcut` - Modify Existing Shortcuts
Update any aspect of your shortcuts.

```json
{
  "name": "update_shortcut",
  "arguments": {
    "id": "shortcut_123",
    "prompt": "Enhanced prompt with better instructions: {input}",
    "isFavorite": true
  }
}
```

#### `delete_shortcut` - Remove Shortcuts
Clean up shortcuts you no longer need.

```json
{
  "name": "delete_shortcut",
  "arguments": {
    "id": "shortcut_123",
    "confirm": true
  }
}
```

#### `get_shortcut_details` - Detailed View
Get comprehensive information about any shortcut.

```json
{
  "name": "get_shortcut_details",
  "arguments": {
    "id": "shortcut_123"
  }
}
```

### Real-World Examples

#### Creative Writing Assistant
```
User: "/ider 一个机器人意识觉醒的故事"
→ Creates a compelling sci-fi story about robot consciousness awakening

User: "/th What are the philosophical implications of AI consciousness?"
→ Deep analysis of AI consciousness from multiple perspectives
```

#### Programming Helper
```
User: "/code Create a REST API for user authentication"
→ Generates clean, documented code with best practices

User: "/debug My React component is not re-rendering properly"
→ Expert debugging assistance with step-by-step solutions
```

#### Learning Assistant
```
User: "/explain How does blockchain technology work?"
→ Simple, clear explanation with analogies and examples

User: "/pros-cons Remote work vs office work"
→ Balanced analysis of advantages and disadvantages
```

## Development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development instructions.

### Project Structure

```
shortcut-mcp/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── server.ts         # MCP server implementation
│   ├── shortcuts/        # Shortcut interaction logic
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── docs/                # Documentation
├── examples/            # Example configurations and usage
├── tests/              # Test suites
└── package.json        # Node.js package configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy & Security

- **Local Storage**: All shortcuts are stored locally on your machine
- **No Data Collection**: Your shortcuts and usage patterns stay private
- **Input Validation**: All inputs are validated before processing
- **Safe Execution**: Templates are expanded safely without code execution

## Troubleshooting

### Common Issues

1. **Shortcuts Not Loading**: Check if `~/.shortcut-mcp/shortcuts.json` exists and is readable
2. **Command Not Recognized**: Ensure your command starts with `/` (e.g., `/th`, not `th`)
3. **Permission Errors**: Verify the MCP has write access to create the shortcuts file
4. **Template Variables**: Use `{input}` in your prompt templates for user input

### Debug Mode

Enable debug logging:

```bash
DEBUG=shortcut-mcp:* npm start
```

## 👤 Author

**aezi zhu**
- GitHub: [@aezizhu](https://github.com/aezizhu)
- Project: [shortcut-mcp](https://github.com/aezizhu/shortcut-mcp)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Apple for the Shortcuts app and automation framework
- The MCP community for protocol development and standardization
- Open source contributors and the TypeScript ecosystem
- Early testers and feedback providers

## 🗺️ Roadmap

### Core Features
- [ ] Advanced template variables (conditional logic, loops)
- [ ] Shortcut collections and sharing
- [ ] Multi-language prompt templates
- [ ] Usage analytics and optimization recommendations

### Platform Integration
- [ ] Auto-completion suggestions for all MCP platforms
- [ ] Platform-specific UI enhancements
- [ ] Mobile app compatibility (iOS/Android)
- [ ] Web-based shortcut management interface

### Ecosystem
- [ ] Integration with external prompt libraries
- [ ] Community shortcut marketplace
- [ ] Plugin system for custom behaviors
- [ ] API for third-party integrations

### Enterprise Features  
- [ ] Team shortcut sharing and management
- [ ] Role-based access controls
- [ ] Analytics and usage reporting
- [ ] Centralized configuration management
=======
# shortcut-mcp
Universal MCP server for custom prompt shortcuts. Transform /th into 'think harder' prompts across Claude Desktop, Cursor, Cline, Continue.dev and any MCP-compatible platform.
>>>>>>> c402362fc942e18cae89ab3edfcceaa01ec327c3
