# Quick Start Guide

Get up and running with Shortcut MCP in minutes!

## Prerequisites

- macOS 12.0 (Monterey) or later
- Node.js 18.0 or later
- Shortcuts app installed (comes with macOS)

## Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd shortcut-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Create Test Shortcuts

Before testing, create a few basic shortcuts in the Shortcuts app:

1. **Hello World**: Simple text output "Hello from Shortcuts!"
2. **Echo Input**: Returns whatever input is provided
3. **Current Time**: Shows current date and time

See [examples/sample-shortcuts.md](examples/sample-shortcuts.md) for detailed instructions.

### 3. Test the Server

```bash
# Start the server in test mode
npm start
```

The server will start and wait for MCP connections via stdio.

## Integration with Claude Desktop

### 1. Configure Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "shortcut-mcp": {
      "command": "node",
      "args": ["/path/to/shortcut-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### 2. Restart Claude Desktop

After updating the configuration, restart Claude Desktop.

### 3. Test Integration

In Claude Desktop, try these commands:

**List available shortcuts:**
> "What shortcuts do I have available?"

**Run a simple shortcut:**
> "Run my Hello World shortcut"

**Get shortcut information:**
> "Tell me about my Current Time shortcut"

## Basic Usage Examples

### List Shortcuts
```
User: "Show me all my shortcuts"
Claude: [Lists all available shortcuts with descriptions]
```

### Execute Shortcut
```
User: "Run my Weather Report shortcut for San Francisco"
Claude: [Executes shortcut and shows weather information]
```

### Get Shortcut Info
```
User: "What does my Daily Note Creator shortcut do?"
Claude: [Shows detailed information about the shortcut]
```

## Common Issues and Solutions

### Issue: "shortcuts CLI not found"
**Solution**: Ensure you're running on macOS 12+ with Shortcuts app installed.

### Issue: "Permission denied"
**Solution**: Grant automation permissions:
1. System Preferences → Security & Privacy → Privacy
2. Select "Automation" from the left panel
3. Allow your terminal/app to control Shortcuts

### Issue: "Shortcut not found"
**Solution**: 
- Check shortcut name spelling (case-sensitive)
- Ensure shortcut exists in Shortcuts app
- Try listing shortcuts first to see available names

### Issue: Server won't start
**Solution**:
- Check Node.js version: `node --version`
- Verify dependencies: `npm install`
- Check logs for specific error messages

## Configuration

### Basic Configuration

Create `config/local.json` to override defaults:

```json
{
  "shortcuts": {
    "allowedPrefixes": ["Safe", "Public"],
    "maxExecutionTime": 45000
  },
  "security": {
    "logExecutions": true,
    "requireConfirmation": false
  },
  "logging": {
    "level": "debug"
  }
}
```

### Environment Variables

Set environment variables for quick configuration:

```bash
export LOG_LEVEL=debug
export MAX_EXECUTION_TIME=60000
export ENABLE_CACHE=true
```

## Development Mode

For development and testing:

```bash
# Start with hot reload
npm run dev

# Run tests
npm test

# Watch mode for development
npm run build:watch
```

## Next Steps

1. **Create More Shortcuts**: Build useful shortcuts in the Shortcuts app
2. **Explore Examples**: Check out [examples/](examples/) for more ideas
3. **Customize Security**: Configure allowed shortcuts and security policies
4. **Monitor Performance**: Use debug mode to monitor execution times
5. **Integrate with Workflows**: Build complex automation workflows

## Getting Help

- **Documentation**: See [docs/](docs/) for detailed documentation
- **Examples**: Check [examples/](examples/) for usage examples
- **Issues**: Report bugs or request features on GitHub
- **Logs**: Enable debug logging for troubleshooting

## Security Notes

- Review shortcuts before allowing execution
- Use allowlists for production environments
- Monitor execution logs for unusual activity
- Keep shortcuts simple and focused

You're now ready to automate macOS with LLMs! 🚀
