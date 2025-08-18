# Usage Examples

This document provides practical examples of how to use the Shortcut MCP in various scenarios.

## Basic Examples

### 1. List Available Shortcuts

```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {}
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Found 15 shortcuts:\n\n1. **Create Daily Note** - Creates a new daily note with template\n2. **Weather Report** - Gets current weather and forecast\n3. **Send Quick Message** - Sends a message via Messages app\n..."
    }
  ]
}
```

### 2. Get Shortcut Information

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_shortcut_info",
    "arguments": {
      "name": "Weather Report"
    }
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "**Weather Report**\n\nDescription: Gets current weather conditions and 3-day forecast\nInput Type: Location (optional)\nOutput Type: Text\nLast Modified: 2024-01-15\nIcon: ☀️"
    }
  ]
}
```

### 3. Execute a Simple Shortcut

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Weather Report",
      "input": "San Francisco, CA"
    }
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Current weather in San Francisco, CA:\n\n🌤️ Partly Cloudy\n🌡️ Temperature: 68°F (20°C)\n💨 Wind: 12 mph NW\n💧 Humidity: 65%\n\n3-Day Forecast:\n• Today: Partly cloudy, High 72°F\n• Tomorrow: Sunny, High 75°F\n• Day 3: Cloudy, High 69°F"
    }
  ]
}
```

## Advanced Examples

### 1. Execute Shortcut with Complex Parameters

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Create Project Report",
      "input": "Q4 2024 Marketing Analysis",
      "parameters": {
        "template": "quarterly",
        "includeCharts": true,
        "format": "PDF",
        "recipients": ["manager@company.com", "team@company.com"]
      }
    }
  }
}
```

### 2. Chain Multiple Shortcuts

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Process Document Chain",
      "input": "contract_draft.pdf",
      "parameters": {
        "steps": [
          {"action": "extract_text", "output": "text"},
          {"action": "summarize", "input": "text", "output": "summary"},
          {"action": "send_email", "input": "summary", "recipient": "legal@company.com"}
        ]
      }
    }
  }
}
```

## Real-World Scenarios

### Scenario 1: Daily Productivity Automation

**User Request:** "Set up my daily productivity routine"

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Daily Setup",
      "parameters": {
        "date": "2024-01-15",
        "tasks": [
          "Check calendar",
          "Review priorities",
          "Create daily note",
          "Set focus mode"
        ]
      }
    }
  }
}
```

### Scenario 2: Content Creation Workflow

**User Request:** "Help me create and publish a blog post"

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Blog Publishing Workflow",
      "input": "AI and Automation in 2024",
      "parameters": {
        "category": "technology",
        "tags": ["AI", "automation", "productivity"],
        "publishDate": "2024-01-20",
        "socialShare": true
      }
    }
  }
}
```

### Scenario 3: Data Processing Pipeline

**User Request:** "Process this CSV file and generate insights"

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Data Analysis Pipeline",
      "input": "sales_data_q4.csv",
      "parameters": {
        "analysisType": "sales_performance",
        "generateCharts": true,
        "outputFormat": "presentation",
        "includeRecommendations": true
      }
    }
  }
}
```

## Error Handling Examples

### 1. Shortcut Not Found

```json
{
  "error": {
    "code": "SHORTCUT_NOT_FOUND",
    "message": "Shortcut 'Non Existent Shortcut' not found",
    "details": {
      "availableShortcuts": ["Weather Report", "Daily Setup", "..."]
    }
  }
}
```

### 2. Permission Denied

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "Shortcut 'System Configuration' is not allowed to run",
    "details": {
      "reason": "Shortcut is in blocked list",
      "securityPolicy": "system_shortcuts_disabled"
    }
  }
}
```

### 3. Execution Timeout

```json
{
  "error": {
    "code": "EXECUTION_TIMEOUT",
    "message": "Shortcut execution exceeded maximum time limit",
    "details": {
      "timeLimit": 30000,
      "actualTime": 35000,
      "suggestion": "Consider increasing timeout or optimizing shortcut"
    }
  }
}
```

## Integration Patterns

### 1. With Claude Desktop

```json
{
  "mcpServers": {
    "shortcuts": {
      "command": "node",
      "args": ["/path/to/shortcut-mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### 2. With Custom LLM Application

```typescript
import { MCPClient } from '@modelcontextprotocol/client';

const client = new MCPClient({
  transport: {
    type: 'stdio',
    command: 'shortcut-mcp'
  }
});

// List shortcuts
const shortcuts = await client.callTool('list_shortcuts', {});

// Run a shortcut
const result = await client.callTool('run_shortcut', {
  name: 'Weather Report',
  input: 'Current location'
});
```

### 3. Programmatic Usage

```typescript
import { ShortcutMCPServer } from 'shortcut-mcp';

const server = new ShortcutMCPServer({
  security: {
    allowedShortcuts: ['Weather Report', 'Daily Setup'],
    requireConfirmation: false
  }
});

await server.start();
```

## Best Practices

### 1. Shortcut Naming

- Use descriptive, clear names
- Avoid special characters
- Follow consistent naming conventions
- Include purpose in the name

### 2. Parameter Handling

- Validate input types and ranges
- Provide default values where appropriate
- Document expected parameter formats
- Handle missing or invalid parameters gracefully

### 3. Error Recovery

- Implement retry logic for transient failures
- Provide helpful error messages
- Log errors for debugging
- Gracefully degrade functionality when possible

### 4. Security

- Review shortcuts before allowing execution
- Use allowlists for production environments
- Monitor execution logs regularly
- Implement proper authentication if needed

### 5. Performance

- Cache shortcut metadata
- Implement execution timeouts
- Monitor resource usage
- Optimize shortcut logic for speed

These examples demonstrate the flexibility and power of the Shortcut MCP for various automation scenarios.
