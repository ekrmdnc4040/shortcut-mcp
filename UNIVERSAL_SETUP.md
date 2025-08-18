# Universal Setup Guide

**Quick setup for any MCP-compatible platform**

## 🚀 One-Time Setup

### 1. Install the MCP Server

```bash
# Clone and build
git clone https://github.com/aezizhu/shortcut-mcp.git
cd shortcut-mcp
npm install
npm run build

# Verify installation
node dist/index.js --help
```

### 2. Test Basic Functionality

```bash
# Test server responds correctly
echo '{"method": "tools/list"}' | node dist/index.js --stdio
```

You should see 6 available tools including `parse_shortcut`.

## 🔌 Platform Integration

### Choose Your Platform:

#### Option A: Claude Desktop
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
**Setup**: Add to Claude Desktop settings → Restart app

#### Option B: Cline (VSCode)
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
**Setup**: VSCode settings → Extensions → Cline → MCP servers

#### Option C: Continue.dev
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
**Setup**: `~/.continue/config.json` → Restart VSCode

#### Option D: Cursor IDE
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
**Setup**: Cursor settings → MCP servers → Restart

#### Option E: Custom Application
```typescript
import { MCPClient } from '@modelcontextprotocol/client';

const client = new MCPClient({
  transport: {
    type: 'stdio',
    command: 'node',
    args: ['/path/to/shortcut-mcp/dist/index.js']
  }
});
```

## ✅ Verify Setup

### Test Built-in Shortcuts

Try these in any MCP platform:

```
/th How does quantum computing work?
/ider A story about time travel
/code Create a Python web scraper
/explain Blockchain technology
/pros-cons Remote work vs office work
```

Each should expand into a detailed, specialized prompt.

## 🎯 Next Steps

1. **Explore shortcuts**: Try all 5 built-in shortcuts
2. **Create custom**: Use MCP tools to add your own
3. **Organize**: Set up categories and favorites
4. **Share**: Export your shortcuts for others

## 🆘 Need Help?

- Check `examples/integrations/` for platform-specific guides
- See `PLATFORM_COMPATIBILITY.md` for detailed compatibility info
- Open GitHub issue for platform-specific problems

**Universal compatibility means it works everywhere MCP is supported!**
