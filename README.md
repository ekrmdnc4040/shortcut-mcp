
# Shortcut MCP

A professional Model Context Protocol (MCP) server that enables developers to create custom prompt shortcuts for enhanced coding workflows. Streamline your development process with shortcuts like `/debug` for debugging assistance, `/review` for code reviews, `/optimize` for performance analysis, and `/test` for test generation.

## 🚀 Overview

Shortcut MCP is built for professional developers who want to optimize their AI-assisted coding workflow. Create powerful shortcuts for common development tasks like debugging, code review, architecture design, testing, and optimization - making your development process faster and more systematic.

**What makes this special for developers?**
- 🎯 **Development-Focused Commands**: Create shortcuts like `/debug`, `/review`, `/refactor` for instant development assistance
- ⚡ **Workflow Optimization**: Transform short commands into detailed, context-aware development prompts
- 🔧 **Code-Centric Roles**: Quick assignments like `/architect` for system design, `/reviewer` for code analysis
- 📚 **Developer Library**: Build your collection of reusable development prompt patterns
- 🏗️ **Project Management**: Organize shortcuts by technology stack, project phase, or team standards

## ✨ Key Features

### Core Functionality
- **⚡ Command Parsing**: Instantly recognize and expand development shortcuts like `/debug`, `/review`, `/test`
- **🎨 Prompt Templates**: Rich template system with code context and variable substitution
- **📝 Custom Creation**: Create shortcuts for your specific tech stack, frameworks, and coding patterns
- **🗂️ Smart Organization**: Categorize shortcuts by language, framework, development phase, or team role
- **⭐ Favorites System**: Mark your most-used development shortcuts for instant access
- **🔍 Intelligent Search**: Find shortcuts by technology, task type, or development context

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
