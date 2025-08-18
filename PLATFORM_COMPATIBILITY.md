# Platform Compatibility Guide

**Author**: aezi zhu  
**Date**: August 18, 2024  

## 🌍 Universal MCP Compatibility

The Prompt Shortcut MCP is designed to work with **any platform that supports the Model Context Protocol**. This ensures maximum compatibility and adoption across the AI ecosystem.

## ✅ Verified Compatible Platforms

### 🖥️ Desktop Applications

#### Claude Desktop (Anthropic)
- **Status**: ✅ Fully Compatible
- **Setup**: Add to `claude_desktop_config.json`
- **Features**: All shortcuts, full tool support
- **Config**: `examples/integrations/claude-desktop.json`

#### Cursor IDE
- **Status**: ✅ Fully Compatible  
- **Setup**: MCP server configuration in settings
- **Features**: Inline chat shortcuts, code context
- **Config**: `examples/integrations/cursor-ide.json`

#### Cline (VSCode Extension)
- **Status**: ✅ Fully Compatible
- **Setup**: Extension settings configuration
- **Features**: Sidebar chat, inline assistance
- **Config**: `examples/integrations/cline-vscode.json`

#### Continue.dev
- **Status**: ✅ Fully Compatible
- **Setup**: `~/.continue/config.json`
- **Features**: Autocomplete, chat, custom commands
- **Config**: `examples/integrations/continue-dev.json`

### 🌐 Web Applications

#### Custom Web Clients
- **Status**: ✅ Compatible via HTTP
- **Setup**: MCP-over-HTTP bridge required
- **Features**: Full API access through REST
- **Example**: Web interface integration

#### Browser Extensions
- **Status**: ✅ Compatible with MCP support
- **Setup**: Extension-specific configuration
- **Features**: Context-aware shortcuts

### 📱 Mobile Applications

#### Mobile AI Apps with MCP
- **Status**: ✅ Compatible when MCP supported
- **Setup**: Platform-dependent
- **Features**: Touch-optimized shortcut input

### ⌨️ Command Line Interfaces

#### Terminal Clients
- **Status**: ✅ Direct stdio support
- **Setup**: Direct command execution
- **Features**: Shell integration, scripting

#### Custom CLI Tools
- **Status**: ✅ Full programmatic access
- **Setup**: MCP SDK integration
- **Features**: Automation, batch processing

## 🔧 Integration Methods

### 1. Standard MCP Configuration

All MCP-compatible platforms use similar configuration:

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

### 2. Direct SDK Integration

For custom applications:

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

### 3. HTTP Bridge Integration

For web applications without direct MCP support:

```javascript
// Via MCP-to-HTTP bridge
const response = await fetch('/mcp/tools/call', {
  method: 'POST',
  body: JSON.stringify({
    name: 'parse_shortcut',
    arguments: { input: '/th example' }
  })
});
```

## 🧪 Testing Compatibility

### Quick Compatibility Test

```bash
# Test if platform can connect to MCP server
echo '{"method": "tools/list"}' | node dist/index.js --stdio
```

Expected response should include:
- `parse_shortcut`
- `list_shortcuts` 
- `create_shortcut`
- `update_shortcut`
- `delete_shortcut`
- `get_shortcut_details`

### Platform-Specific Testing

#### Claude Desktop
1. Add configuration to settings
2. Restart Claude Desktop  
3. Type `/th test` in conversation
4. Verify expansion occurs

#### VSCode Extensions
1. Install compatible extension (Cline, Continue.dev)
2. Add MCP configuration
3. Restart VSCode
4. Test shortcuts in extension chat

#### Custom Applications
1. Implement MCP client
2. Connect to server
3. Call `parse_shortcut` tool
4. Verify response format

## 🔍 Platform Requirements

### Minimum Requirements

All platforms need:
- **MCP Protocol Support**: Version 1.0+
- **Node.js Runtime**: Available for server execution
- **File System Access**: For shortcuts storage
- **JSON-RPC**: For protocol communication

### Optional Enhancements

Platforms may support:
- **Auto-completion**: Shortcut suggestions
- **Syntax Highlighting**: Command recognition
- **Context Integration**: Smart shortcut recommendations
- **Batch Operations**: Multiple shortcut processing

## 🚀 Future Platform Support

### Emerging Platforms

As new MCP-compatible platforms emerge:
- **Automatic Compatibility**: Protocol compliance ensures compatibility
- **No Code Changes**: Server works without modification
- **Configuration Only**: Platform-specific setup examples

### Mobile & Embedded

Future support for:
- **iOS Apps**: With MCP framework integration
- **Android Apps**: Via MCP SDK implementations
- **IoT Devices**: Edge AI with MCP protocol
- **Embedded Systems**: Lightweight MCP clients

## 🛠️ Adding New Platform Support

### For Platform Developers

To add Prompt Shortcut MCP support:

1. **Implement MCP Client**: Use official SDK
2. **Add Configuration UI**: For server setup
3. **Handle Tool Calls**: Route to shortcut parser
4. **Test Integration**: Verify all tools work

### For Users

To request new platform support:

1. **Check MCP Compatibility**: Verify platform supports MCP
2. **Create Configuration**: Follow MCP patterns
3. **Test Basic Connection**: Use compatibility test
4. **Share Results**: Help others with same platform

## 📊 Compatibility Matrix

| Platform | Status | Setup Difficulty | Features | Notes |
|----------|--------|------------------|----------|--------|
| Claude Desktop | ✅ Full | Easy | Complete | Official Anthropic app |
| Cline (VSCode) | ✅ Full | Easy | Complete | Popular VSCode extension |
| Continue.dev | ✅ Full | Medium | Complete | Open-source, customizable |
| Cursor IDE | ✅ Full | Easy | Complete | AI-first code editor |
| Custom Apps | ✅ Full | Hard | Complete | Requires development |
| Web Clients | ⚠️ Bridge | Medium | Limited | Needs HTTP bridge |
| Mobile Apps | 🔄 Planned | TBD | TBD | Waiting for MCP mobile SDKs |

**Legend:**
- ✅ Full: Complete compatibility, all features work
- ⚠️ Bridge: Requires additional bridge/proxy
- 🔄 Planned: Support planned but not yet available
- ❌ Limited: Partial compatibility or limitations

## 🤝 Community Support

### Getting Help

- **GitHub Issues**: Platform-specific problems
- **Discussions**: Share integration experiences  
- **Wiki**: Community-maintained platform guides
- **Examples**: Real-world configuration samples

### Contributing

Help expand platform support:
- Test new platforms
- Share configuration examples
- Report compatibility issues
- Contribute integration guides

The Prompt Shortcut MCP's universal compatibility ensures it works wherever you need AI assistance, regardless of your preferred platform or workflow.
