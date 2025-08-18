# Test Scenarios for Shortcut MCP

This document provides comprehensive test scenarios to validate the Shortcut MCP functionality.

## Basic Functionality Tests

### Test 1: Server Connection
**Objective**: Verify MCP server connects properly

**Steps**:
1. Start the MCP server
2. Connect with MCP client
3. Verify no errors in logs

**Expected Result**: Server starts without errors and accepts connections

### Test 2: Tool Discovery
**Objective**: Verify all tools are properly registered

**Test Request**:
```json
{
  "method": "tools/list"
}
```

**Expected Result**: Returns list with 3 tools:
- `list_shortcuts`
- `run_shortcut`
- `get_shortcut_info`

## Shortcut Discovery Tests

### Test 3: List All Shortcuts
**Objective**: Verify shortcut discovery works

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {}
  }
}
```

**Expected Result**: Returns formatted list of available shortcuts

### Test 4: Filter by Category
**Objective**: Test category filtering

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {
      "category": "productivity"
    }
  }
}
```

**Expected Result**: Returns only productivity shortcuts

### Test 5: Search Shortcuts
**Objective**: Test search functionality

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {
      "search": "hello"
    }
  }
}
```

**Expected Result**: Returns shortcuts containing "hello" in name or description

### Test 6: Limit Results
**Objective**: Test result limiting

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_shortcuts",
    "arguments": {
      "limit": 5
    }
  }
}
```

**Expected Result**: Returns maximum 5 shortcuts

## Shortcut Information Tests

### Test 7: Get Shortcut Info
**Objective**: Verify shortcut metadata retrieval

**Test Request**:
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

**Expected Result**: Returns detailed information about the shortcut

### Test 8: Non-existent Shortcut Info
**Objective**: Test error handling for missing shortcuts

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_shortcut_info",
    "arguments": {
      "name": "Non Existent Shortcut"
    }
  }
}
```

**Expected Result**: Returns error message indicating shortcut not found

## Shortcut Execution Tests

### Test 9: Simple Execution
**Objective**: Execute shortcut without input

**Prerequisites**: "Hello World" shortcut exists

**Test Request**:
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

**Expected Result**: Returns success with shortcut output

### Test 10: Execution with Input
**Objective**: Execute shortcut with text input

**Prerequisites**: "Echo Input" shortcut exists

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Echo Input",
      "input": "Test message for echo"
    }
  }
}
```

**Expected Result**: Returns the input text as output

### Test 11: Execution with Numeric Input
**Objective**: Execute shortcut with numeric input

**Prerequisites**: "Quick Timer" shortcut exists

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Quick Timer",
      "input": 5
    }
  }
}
```

**Expected Result**: Starts 5-minute timer

### Test 12: Execution with Custom Timeout
**Objective**: Test custom timeout setting

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Hello World",
      "timeout": 5000
    }
  }
}
```

**Expected Result**: Executes with 5-second timeout

## Error Handling Tests

### Test 13: Missing Shortcut Name
**Objective**: Test validation of required parameters

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {}
  }
}
```

**Expected Result**: Returns validation error

### Test 14: Non-existent Shortcut Execution
**Objective**: Test error handling for missing shortcuts

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "This Shortcut Does Not Exist"
    }
  }
}
```

**Expected Result**: Returns "shortcut not found" error

### Test 15: Invalid Tool Name
**Objective**: Test unknown tool handling

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "invalid_tool",
    "arguments": {}
  }
}
```

**Expected Result**: Returns "unknown tool" error

## Security Tests

### Test 16: Blocked Shortcut
**Objective**: Test security policy enforcement

**Prerequisites**: Configure "System Configuration" as blocked shortcut

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "System Configuration"
    }
  }
}
```

**Expected Result**: Returns security policy violation error

### Test 17: Large Input
**Objective**: Test input size limits

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Echo Input",
      "input": "[Very large string exceeding maxInputSize]"
    }
  }
}
```

**Expected Result**: Returns input size exceeded error

### Test 18: Malicious Input
**Objective**: Test input sanitization

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Echo Input",
      "input": "<script>alert('xss')</script>"
    }
  }
}
```

**Expected Result**: Input is sanitized, no script execution

## Performance Tests

### Test 19: Concurrent Executions
**Objective**: Test multiple simultaneous executions

**Steps**:
1. Send 5 simultaneous shortcut execution requests
2. Monitor execution times and success rates

**Expected Result**: All requests complete successfully within reasonable time

### Test 20: Cache Performance
**Objective**: Verify caching improves performance

**Steps**:
1. Execute `list_shortcuts` (cold cache)
2. Execute `list_shortcuts` again (warm cache)
3. Compare response times

**Expected Result**: Second request is significantly faster

### Test 21: Timeout Handling
**Objective**: Test execution timeout

**Prerequisites**: Create a slow shortcut or set very low timeout

**Test Request**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Slow Shortcut",
      "timeout": 1000
    }
  }
}
```

**Expected Result**: Returns timeout error after 1 second

## Integration Tests

### Test 22: Real-world Workflow
**Objective**: Test complete workflow

**Steps**:
1. List shortcuts to discover available options
2. Get info about a specific shortcut
3. Execute the shortcut with appropriate input
4. Verify results

**Expected Result**: Complete workflow works smoothly

### Test 23: Error Recovery
**Objective**: Test system recovery after errors

**Steps**:
1. Execute invalid request causing error
2. Execute valid request
3. Verify system continues working normally

**Expected Result**: System recovers and processes subsequent requests

## Configuration Tests

### Test 24: Custom Configuration
**Objective**: Test custom configuration loading

**Steps**:
1. Create custom config file
2. Start server with custom config
3. Verify settings are applied

**Expected Result**: Server uses custom configuration

### Test 25: Environment Variables
**Objective**: Test environment variable overrides

**Steps**:
1. Set environment variables
2. Start server
3. Verify variables override config

**Expected Result**: Environment variables take precedence

## Test Results Template

Use this template to document test results:

```
Test: [Test Number and Name]
Date: [Test Date]
Environment: [Test Environment Details]
Result: [PASS/FAIL]
Notes: [Any observations or issues]
Execution Time: [Time taken]
Output: [Actual output or error message]
```

## Automated Testing

To run automated tests:

```bash
# Install test dependencies
npm install

# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

## Performance Benchmarks

Expected performance benchmarks:

- Shortcut listing: < 2 seconds
- Shortcut execution: < 5 seconds (typical)
- Info retrieval: < 1 second
- Cache hit response: < 100ms

These test scenarios ensure comprehensive validation of the Shortcut MCP functionality across all major use cases and edge conditions.
