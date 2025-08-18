# Shortcut Creation Examples

This document provides comprehensive examples for creating shortcuts using the Shortcut MCP.

## 🏗️ Simple Shortcut Creation

### 1. Text Shortcuts

Create shortcuts that return static text:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_simple_shortcut",
    "arguments": {
      "name": "Daily Motivation",
      "type": "text",
      "content": "Today is a great day to accomplish your goals! 🌟",
      "description": "Returns a motivational message"
    }
  }
}
```

### 2. Echo Shortcuts

Create shortcuts that return whatever input is provided:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_simple_shortcut",
    "arguments": {
      "name": "Echo Chamber",
      "type": "echo",
      "description": "Echoes back any input provided"
    }
  }
}
```

### 3. Current Time Shortcuts

Create shortcuts that show the current date and time:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_simple_shortcut",
    "arguments": {
      "name": "Timestamp",
      "type": "current-time",
      "content": "yyyy-MM-dd HH:mm:ss",
      "description": "Shows current timestamp"
    }
  }
}
```

### 4. Weather Shortcuts

Create shortcuts that get weather information:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_simple_shortcut",
    "arguments": {
      "name": "Quick Weather",
      "type": "weather",
      "description": "Gets weather for specified location"
    }
  }
}
```

### 5. Shell Script Shortcuts

Create shortcuts that run shell commands:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_simple_shortcut",
    "arguments": {
      "name": "System Info",
      "type": "shell-script",
      "content": "uname -a && uptime",
      "description": "Shows system information and uptime"
    }
  }
}
```

## 🗂️ Template-Based Creation

### List Available Templates

First, see what templates are available:

```json
{
  "method": "tools/call",
  "params": {
    "name": "list_templates",
    "arguments": {}
  }
}
```

Filter by category:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_templates",
    "arguments": {
      "category": "basic"
    }
  }
}
```

### Create from Template

Use predefined templates for common patterns:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "template": "hello-world"
    }
  }
}
```

Customize template with your own values:
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "template": "echo-input",
      "definition": {
        "name": "My Custom Echo",
        "description": "A personalized echo shortcut"
      }
    }
  }
}
```

## 🔧 Advanced Shortcut Definitions

### Multi-Action Shortcuts

Create complex shortcuts with multiple actions:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "Enhanced Weather Report",
        "description": "Gets weather and formats it nicely",
        "inputType": "Text",
        "outputType": "Text",
        "actions": [
          {
            "type": "is.workflow.actions.weather.currentconditions",
            "identifier": "get_weather",
            "parameters": {
              "location": "{input}"
            }
          },
          {
            "type": "is.workflow.actions.text",
            "identifier": "format_response",
            "parameters": {
              "text": "Weather Report for {input}:\n{get_weather}"
            }
          }
        ]
      }
    }
  }
}
```

### File Processing Shortcut

Create a shortcut that processes files:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "File Info",
        "description": "Gets information about a file",
        "inputType": "File",
        "actions": [
          {
            "type": "is.workflow.actions.file.getcontentsoffolder",
            "identifier": "get_file_info",
            "parameters": {}
          },
          {
            "type": "is.workflow.actions.text",
            "identifier": "format_info",
            "parameters": {
              "text": "File Information:\n{get_file_info}"
            }
          }
        ]
      }
    }
  }
}
```

### System Integration Shortcut

Create shortcuts that interact with system features:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "Battery Alert",
        "description": "Shows battery level with alert",
        "actions": [
          {
            "type": "is.workflow.actions.getbatterylevel",
            "identifier": "battery_level",
            "parameters": {}
          },
          {
            "type": "is.workflow.actions.conditional",
            "identifier": "check_battery",
            "parameters": {
              "condition": "is less than",
              "value": 20
            }
          },
          {
            "type": "is.workflow.actions.showresult",
            "identifier": "show_alert",
            "parameters": {
              "text": "⚠️ Low Battery: {battery_level}%"
            }
          }
        ]
      }
    }
  }
}
```

## 🛠️ Practical Examples

### 1. Daily Note Creator

Create a shortcut that generates daily notes:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "Daily Note Creator",
        "description": "Creates a structured daily note",
        "actions": [
          {
            "type": "is.workflow.actions.date",
            "identifier": "today",
            "parameters": {}
          },
          {
            "type": "is.workflow.actions.format.date",
            "identifier": "formatted_date",
            "parameters": {
              "format": "EEEE, MMMM d, yyyy"
            }
          },
          {
            "type": "is.workflow.actions.text",
            "identifier": "note_content",
            "parameters": {
              "text": "# Daily Note - {formatted_date}\n\n## Goals\n- \n\n## Tasks\n- \n\n## Notes\n\n\n## Reflection\n"
            }
          }
        ]
      }
    }
  }
}
```

### 2. Quick Message Sender

Create a shortcut for sending messages:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "Team Update",
        "description": "Sends a quick update to the team",
        "inputType": "Text",
        "actions": [
          {
            "type": "is.workflow.actions.text",
            "identifier": "message_template",
            "parameters": {
              "text": "Team Update: {input}\n\nSent from Shortcuts MCP"
            }
          },
          {
            "type": "is.workflow.actions.sendmessage",
            "identifier": "send_message",
            "parameters": {
              "recipient": "Team Group",
              "message": "{message_template}"
            }
          }
        ]
      }
    }
  }
}
```

### 3. URL Processor

Create a shortcut that processes URLs:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "URL Info",
        "description": "Gets information about a URL",
        "inputType": "URL",
        "actions": [
          {
            "type": "is.workflow.actions.downloadurl",
            "identifier": "get_content",
            "parameters": {
              "url": "{input}"
            }
          },
          {
            "type": "is.workflow.actions.text",
            "identifier": "summary",
            "parameters": {
              "text": "Content length: {get_content.length} characters"
            }
          }
        ]
      }
    }
  }
}
```

## 🔄 Shortcut Management

### Update Existing Shortcuts

To update an existing shortcut, use overwrite:

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_shortcut",
    "arguments": {
      "definition": {
        "name": "Hello World",
        "description": "Updated hello world shortcut",
        "actions": [
          {
            "type": "is.workflow.actions.text",
            "identifier": "greeting",
            "parameters": {
              "text": "Hello from the updated Shortcuts MCP! 🚀"
            }
          }
        ]
      },
      "overwriteExisting": true
    }
  }
}
```

### Delete Shortcuts

Remove shortcuts you no longer need:

```json
{
  "method": "tools/call",
  "params": {
    "name": "delete_shortcut",
    "arguments": {
      "name": "Old Shortcut",
      "confirm": true
    }
  }
}
```

## 🎯 Use Cases

### 1. Automation Workflows

Create shortcuts for common automation tasks:

- **File Organization**: Sort downloads by file type
- **System Monitoring**: Check system resources
- **Backup Automation**: Create automated backup routines
- **Log Processing**: Parse and analyze log files

### 2. Productivity Boosters

Build shortcuts that enhance productivity:

- **Meeting Prep**: Generate meeting agendas
- **Status Updates**: Create formatted status reports
- **Task Management**: Quick task creation and updates
- **Time Tracking**: Log work activities

### 3. Information Processing

Create shortcuts for data processing:

- **Text Analysis**: Count words, extract keywords
- **Data Formatting**: Convert between formats
- **Report Generation**: Create structured reports
- **API Integration**: Fetch and process external data

## ⚠️ Best Practices

### 1. Naming Conventions

- Use descriptive, clear names
- Avoid special characters
- Be consistent with naming patterns
- Include version numbers for iterations

### 2. Error Handling

- Always include validation steps
- Provide meaningful error messages
- Use conditional logic for edge cases
- Test with various input types

### 3. Security Considerations

- Validate all inputs
- Avoid exposing sensitive data
- Use secure communication methods
- Limit permissions appropriately

### 4. Performance Optimization

- Keep shortcuts focused and simple
- Avoid unnecessary actions
- Use caching when appropriate
- Monitor execution times

## 🧪 Testing Your Shortcuts

After creation, test your shortcuts:

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Your New Shortcut",
      "input": "test input"
    }
  }
}
```

Get detailed information:
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_shortcut_info",
    "arguments": {
      "name": "Your New Shortcut"
    }
  }
}
```

This comprehensive guide should help you create powerful shortcuts that enhance your automation workflows with the Shortcut MCP!
