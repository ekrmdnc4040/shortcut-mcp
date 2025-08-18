# Sample Shortcuts for Testing

This document provides examples of shortcuts you can create in the macOS Shortcuts app to test the Shortcut MCP.

## Basic Shortcuts

### 1. Hello World
**Purpose**: Simple test shortcut that returns a greeting.

**Steps to create**:
1. Open Shortcuts app
2. Click "+" to create new shortcut
3. Add "Text" action with value: "Hello from Shortcuts MCP!"
4. Name the shortcut "Hello World"

**Test with MCP**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Hello World"
    }
  }
}
```

### 2. Echo Input
**Purpose**: Returns whatever input is provided.

**Steps to create**:
1. Add "Text" action
2. Add provided input as variable
3. Name the shortcut "Echo Input"

**Test with MCP**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Echo Input",
      "input": "This is my test input"
    }
  }
}
```

### 3. Current Time
**Purpose**: Returns the current date and time.

**Steps to create**:
1. Add "Date" action (Current Date)
2. Add "Format Date" action with custom format
3. Name the shortcut "Current Time"

**Test with MCP**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Current Time"
    }
  }
}
```

## Productivity Shortcuts

### 4. Daily Note Creator
**Purpose**: Creates a daily note with today's date.

**Steps to create**:
1. Add "Date" action (Current Date)
2. Add "Format Date" action with format "yyyy-MM-dd"
3. Add "Text" action: "# Daily Note for [formatted date]"
4. Add "Create Note" action (if you have note-taking app)
5. Name the shortcut "Daily Note Creator"

### 5. Quick Timer
**Purpose**: Starts a timer with specified duration.

**Steps to create**:
1. Add "Ask for Input" action (Number type)
2. Add "Start Timer" action with input minutes
3. Name the shortcut "Quick Timer"

**Test with MCP**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Quick Timer",
      "input": "5"
    }
  }
}
```

## System Information Shortcuts

### 6. System Info
**Purpose**: Returns basic system information.

**Steps to create**:
1. Add "Get Device Details" action
2. Add "Text" action to format the output
3. Name the shortcut "System Info"

### 7. Battery Status
**Purpose**: Returns current battery level.

**Steps to create**:
1. Add "Get Battery Level" action
2. Add "Text" action: "Battery: [Battery Level]%"
3. Name the shortcut "Battery Status"

## Communication Shortcuts

### 8. Quick Message
**Purpose**: Sends a quick message to a contact.

**Steps to create**:
1. Add "Ask for Input" action (Text type, prompt: "Message")
2. Add "Ask for Input" action (Contact type, prompt: "Recipient")
3. Add "Send Message" action
4. Name the shortcut "Quick Message"

### 9. Email Summary
**Purpose**: Creates an email with provided content.

**Steps to create**:
1. Add "Ask for Input" action (Text type, prompt: "Email subject")
2. Add "Ask for Input" action (Text type, prompt: "Email body")
3. Add "Mail" action with subject and body
4. Name the shortcut "Email Summary"

## File Operations

### 10. Text File Creator
**Purpose**: Creates a text file with provided content.

**Steps to create**:
1. Add "Ask for Input" action (Text type)
2. Add "Save to Files" action with provided text
3. Name the shortcut "Text File Creator"

### 11. File Counter
**Purpose**: Counts files in a specified folder.

**Steps to create**:
1. Add "Get Contents of Folder" action
2. Add "Count" action
3. Add "Text" action: "Found [count] files"
4. Name the shortcut "File Counter"

## Advanced Shortcuts

### 12. Weather Report
**Purpose**: Gets current weather for a location.

**Steps to create**:
1. Add "Ask for Input" action (Text type, prompt: "Location")
2. Add "Get Current Weather" action for the location
3. Add "Text" action to format weather info
4. Name the shortcut "Weather Report"

**Test with MCP**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Weather Report",
      "input": "San Francisco"
    }
  }
}
```

### 13. URL Shortener
**Purpose**: Shortens a provided URL.

**Steps to create**:
1. Add "Ask for Input" action (URL type)
2. Add "Shorten URLs" action
3. Add "Text" action with shortened URL
4. Name the shortcut "URL Shortener"

### 14. QR Code Generator
**Purpose**: Generates QR code for provided text.

**Steps to create**:
1. Add "Ask for Input" action (Text type)
2. Add "Generate QR Code" action
3. Add "Save to Photos" action (optional)
4. Name the shortcut "QR Code Generator"

## Testing Your Shortcuts

### List all shortcuts:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {}
  }
}
```

### Get information about a specific shortcut:
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_shortcut_info",
    "arguments": {
      "name": "Hello World"
    }
  }
}
```

### Filter shortcuts by category:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {
      "category": "productivity",
      "limit": 10
    }
  }
}
```

## Tips for Creating Shortcuts

1. **Keep it Simple**: Start with basic shortcuts and gradually add complexity
2. **Use Clear Names**: Make shortcut names descriptive and unique
3. **Handle Errors**: Add error handling for robust shortcuts
4. **Test Inputs**: Ensure shortcuts work with various input types
5. **Document Purpose**: Add comments in complex shortcuts
6. **Security**: Be careful with shortcuts that access sensitive data

## Troubleshooting

- **Shortcut not found**: Ensure the name matches exactly (case-sensitive)
- **Permission errors**: Grant necessary permissions to shortcuts
- **Timeout issues**: Increase timeout for complex shortcuts
- **Input format**: Check if shortcut expects specific input format

These sample shortcuts provide a good foundation for testing the Shortcut MCP functionality.
