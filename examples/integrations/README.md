# MCP Platform Integrations

This directory contains integration examples for various MCP-compatible platforms and clients.

## 🔌 Supported Platforms

The Prompt Shortcut MCP works with **any platform that supports the Model Context Protocol**:

### Desktop Applications
- **Claude Desktop** - Anthropic's official desktop app
- **Cursor IDE** - AI-powered code editor
- **Cline (VSCode)** - AI assistant extension for VS Code
- **Continue.dev** - Open-source coding assistant

### Web Applications
- **Custom web clients** using MCP over HTTP
- **Browser extensions** with MCP integration
- **Web-based AI interfaces**

### Command Line
- **Terminal-based clients**
- **Custom CLI tools**
- **Shell integrations**

### Programming Integrations
- **Node.js applications**
- **Python clients** (via MCP SDK)
- **Custom applications** using MCP protocol

## 📋 Integration Examples

### Claude Desktop
**File**: `claude-desktop.json`
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

**Setup**:
1. Copy configuration to Claude Desktop settings
2. Update path to your installation
3. Restart Claude Desktop
4. Use shortcuts like `/th`, `/ider` in conversations

### Cline (VSCode Extension)
**File**: `cline-vscode.json`

**Setup**:
1. Install Cline extension in VS Code
2. Add MCP server configuration
3. Restart VS Code
4. Use shortcuts in Cline conversations

### Continue.dev
**File**: `continue-dev.json`

**Setup**:
1. Install Continue extension
2. Update `~/.continue/config.json`
3. Add custom commands for shortcuts
4. Use in inline chat and sidebar

### Cursor IDE
**File**: `cursor-ide.json`

**Setup**:
1. Open Cursor IDE settings
2. Add MCP server configuration
3. Enable shortcut auto-expansion
4. Use shortcuts in chat interface

### Custom Client Integration
**File**: `custom-client.ts`

Example TypeScript client showing how to:
- Connect to the MCP server
- Parse and expand shortcuts
- Manage shortcut collections
- Integrate with web applications

## 🚀 Quick Start for Any Platform

### 1. Install Dependencies
```bash
cd shortcut-mcp
npm install
npm run build
```

### 2. Test MCP Server
```bash
# Test the server responds correctly
echo '{"method": "tools/list", "params": {}}' | node dist/index.js --stdio
```

### 3. Platform-Specific Setup

Choose your platform and follow the corresponding example:

#### For Claude Desktop:
- Copy `claude-desktop.json` to Claude settings
- Update the path to your installation

#### For VS Code Extensions:
- Use `cline-vscode.json` or `continue-dev.json`
- Add to extension settings

#### For Custom Applications:
- Use `custom-client.ts` as a starting point
- Implement MCP client using official SDK

### 4. Verify Integration
Test with a simple shortcut:
```
Input: "/th What is the meaning of life?"
Expected: Expanded prompt with deep thinking instructions
```

## 🔧 Configuration Options

### Environment Variables
```bash
export LOG_LEVEL=info          # Logging level
export DEBUG=false             # Debug mode
export SHORTCUTS_PATH=~/.shortcut-mcp/shortcuts.json
```

### MCP Server Arguments
```json
{
  "command": "node",
  "args": [
    "/path/to/shortcut-mcp/dist/index.js",
    "--log-level", "info",
    "--config", "/path/to/config.json"
  ]
}
```

## 🛠️ Troubleshooting

### Common Issues

**Server not starting**:
- Check Node.js version (18+)
- Verify file permissions
- Check path to `dist/index.js`

**Shortcuts not recognized**:
- Ensure shortcuts start with `/`
- Check shortcuts.json file exists
- Verify MCP connection

**Permission errors**:
- Check write access to `~/.shortcut-mcp/`
- Verify user permissions
- Try running with different permissions

### Debug Mode

Enable debug logging:
```bash
export DEBUG=shortcut-mcp:*
export LOG_LEVEL=debug
```

### Testing Connection

Test MCP connection:
```bash
# List available tools
echo '{"method": "tools/list"}' | node dist/index.js --stdio

# Test shortcut parsing
echo '{"method": "tools/call", "params": {"name": "parse_shortcut", "arguments": {"input": "/th test"}}}' | node dist/index.js --stdio
```

## 📚 Additional Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Official MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/mcp)
- [Continue.dev Documentation](https://docs.continue.dev/)

## 🤝 Contributing

To add support for new platforms:

1. Create configuration example
2. Add setup instructions
3. Test integration thoroughly
4. Submit pull request

Each platform has unique requirements, but the MCP protocol ensures compatibility across all implementations.
