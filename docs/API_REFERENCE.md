# API Reference

This document provides detailed API reference for the Shortcut MCP server.

## MCP Tools

### list_shortcuts

Lists all available shortcuts on the system with optional filtering.

**Tool Definition:**
```typescript
{
  name: "list_shortcuts",
  description: "List all available macOS shortcuts with optional filtering",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Filter shortcuts by category",
        enum: ["productivity", "communication", "media", "utilities", "custom"]
      },
      search: {
        type: "string",
        description: "Search shortcuts by name or description"
      },
      limit: {
        type: "number",
        description: "Maximum number of shortcuts to return",
        minimum: 1,
        maximum: 100,
        default: 50
      }
    }
  }
}
```

**Example Request:**
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

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Found 10 productivity shortcuts:\n\n1. **Daily Setup** - Initialize daily workflow\n2. **Create Meeting Notes** - Generate meeting note template\n..."
    }
  ]
}
```

### run_shortcut

Executes a specific shortcut with optional input and parameters.

**Tool Definition:**
```typescript
{
  name: "run_shortcut",
  description: "Execute a macOS shortcut with optional input and parameters",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the shortcut to execute"
      },
      input: {
        type: ["string", "number", "boolean", "null"],
        description: "Input data to pass to the shortcut"
      },
      parameters: {
        type: "object",
        description: "Additional parameters for the shortcut",
        additionalProperties: true
      },
      timeout: {
        type: "number",
        description: "Execution timeout in milliseconds",
        minimum: 1000,
        maximum: 300000,
        default: 30000
      }
    },
    required: ["name"]
  }
}
```

**Example Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "run_shortcut",
    "arguments": {
      "name": "Weather Report",
      "input": "San Francisco",
      "timeout": 15000
    }
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Weather in San Francisco:\n☀️ Sunny, 72°F\nWind: 8 mph NW\nHumidity: 65%"
    }
  ]
}
```

### get_shortcut_info

Retrieves detailed information about a specific shortcut.

**Tool Definition:**
```typescript
{
  name: "get_shortcut_info",
  description: "Get detailed information about a specific shortcut",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the shortcut to get information about"
      }
    },
    required: ["name"]
  }
}
```

**Example Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_shortcut_info",
    "arguments": {
      "name": "Daily Setup"
    }
  }
}
```

**Example Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "**Daily Setup**\n\nDescription: Initializes daily productivity workflow\nInput Type: None required\nOutput Type: Confirmation message\nLast Modified: 2024-01-10\nActions: 15\nIcon: 📅"
    }
  ]
}
```

## TypeScript API

### ShortcutMCPServer

Main server class for the MCP implementation.

```typescript
class ShortcutMCPServer {
  constructor(config: Configuration, logger: Logger);
  
  async start(): Promise<void>;
  async stop(): Promise<void>;
  
  // Tool registration
  registerTool(tool: ToolDefinition): void;
  listTools(): ToolDefinition[];
  
  // Event handling
  on(event: string, listener: Function): void;
  emit(event: string, ...args: any[]): void;
}
```

### ShortcutManager

Manages shortcut discovery and metadata.

```typescript
class ShortcutManager {
  constructor(config: ShortcutConfig, logger: Logger);
  
  async discoverShortcuts(): Promise<Shortcut[]>;
  async getShortcutInfo(name: string): Promise<ShortcutInfo>;
  async validateShortcut(name: string): Promise<ValidationResult>;
  
  // Caching
  clearCache(): void;
  getCacheStats(): CacheStats;
}
```

### ShortcutExecutor

Handles shortcut execution.

```typescript
class ShortcutExecutor {
  constructor(config: ShortcutConfig, security: SecurityManager, logger: Logger);
  
  async execute(request: ExecutionRequest): Promise<ExecutionResult>;
  async validateInput(shortcut: Shortcut, input: any): Promise<boolean>;
  
  // Execution management
  abort(executionId: string): Promise<void>;
  getActiveExecutions(): ExecutionInfo[];
}
```

### SecurityManager

Manages security policies and validation.

```typescript
class SecurityManager {
  constructor(config: SecurityConfig, logger: Logger);
  
  validateRequest(request: MCPRequest): SecurityResult;
  authorizeShortcut(name: string, user?: string): boolean;
  sanitizeInput(input: any): any;
  filterOutput(output: any): any;
  
  // Audit
  auditLog(operation: string, details: AuditDetails): void;
  getAuditLogs(filter?: AuditFilter): AuditEntry[];
}
```

## Data Types

### Shortcut

```typescript
interface Shortcut {
  name: string;
  description?: string;
  category: ShortcutCategory;
  inputTypes: InputType[];
  outputType: OutputType;
  icon?: string;
  lastModified: Date;
  actionCount: number;
  size: number;
  isSystemShortcut: boolean;
  permissions: Permission[];
}
```

### ShortcutInfo

```typescript
interface ShortcutInfo extends Shortcut {
  actions: ShortcutAction[];
  dependencies: string[];
  requirements: SystemRequirement[];
  metadata: Record<string, any>;
}
```

### ExecutionRequest

```typescript
interface ExecutionRequest {
  shortcutName: string;
  input?: any;
  parameters?: Record<string, any>;
  timeout?: number;
  userId?: string;
  requestId: string;
}
```

### ExecutionResult

```typescript
interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: ExecutionError;
  executionTime: number;
  logs: string[];
  metadata: ExecutionMetadata;
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}
```

### SecurityResult

```typescript
interface SecurityResult {
  allowed: boolean;
  reason?: string;
  requirements: string[];
  riskLevel: 'low' | 'medium' | 'high';
}
```

## Enums

### ShortcutCategory

```typescript
enum ShortcutCategory {
  PRODUCTIVITY = 'productivity',
  COMMUNICATION = 'communication',
  MEDIA = 'media',
  UTILITIES = 'utilities',
  SYSTEM = 'system',
  CUSTOM = 'custom'
}
```

### InputType

```typescript
enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  FILE = 'file',
  IMAGE = 'image',
  URL = 'url',
  LOCATION = 'location',
  CONTACT = 'contact',
  DATE = 'date',
  BOOLEAN = 'boolean',
  NONE = 'none'
}
```

### OutputType

```typescript
enum OutputType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  URL = 'url',
  JSON = 'json',
  NOTIFICATION = 'notification',
  NONE = 'none'
}
```

## Error Codes

### MCPErrors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_REQUEST` | Request format is invalid | 400 |
| `TOOL_NOT_FOUND` | Requested tool does not exist | 404 |
| `INVALID_ARGUMENTS` | Tool arguments are invalid | 400 |
| `EXECUTION_ERROR` | Tool execution failed | 500 |

### ShortcutErrors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `SHORTCUT_NOT_FOUND` | Shortcut does not exist | 404 |
| `SHORTCUT_BLOCKED` | Shortcut is blocked by security policy | 403 |
| `EXECUTION_TIMEOUT` | Shortcut execution timed out | 408 |
| `PERMISSION_DENIED` | Insufficient permissions | 403 |
| `INVALID_INPUT` | Input validation failed | 400 |

### SecurityErrors

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Access denied | 403 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INPUT_TOO_LARGE` | Input exceeds size limit | 413 |

## Configuration Schema

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "server": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "version": {"type": "string"},
        "description": {"type": "string"},
        "port": {"type": "number", "minimum": 1, "maximum": 65535},
        "host": {"type": "string"}
      },
      "required": ["name", "version"]
    },
    "shortcuts": {
      "type": "object",
      "properties": {
        "allowedPrefixes": {
          "type": "array",
          "items": {"type": "string"}
        },
        "blockedShortcuts": {
          "type": "array",
          "items": {"type": "string"}
        },
        "maxExecutionTime": {
          "type": "number",
          "minimum": 1000,
          "maximum": 600000
        }
      }
    }
  },
  "required": ["server", "shortcuts"]
}
```

## Events

The server emits various events that can be listened to:

### Server Events

- `server:started` - Server has started
- `server:stopped` - Server has stopped
- `server:error` - Server error occurred

### Shortcut Events

- `shortcut:discovered` - New shortcut discovered
- `shortcut:executed` - Shortcut execution completed
- `shortcut:failed` - Shortcut execution failed

### Security Events

- `security:violation` - Security policy violation
- `security:audit` - Security audit event

## Rate Limiting

The server implements rate limiting to prevent abuse:

```typescript
interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}
```

Default limits:
- 100 requests per minute per client
- Sliding window implementation
- Separate limits for different tool types

## Caching

The server implements intelligent caching:

### Cache Types

1. **Shortcut Metadata Cache**: Caches shortcut information
2. **Execution Result Cache**: Caches deterministic results
3. **Permission Cache**: Caches authorization decisions

### Cache Configuration

```typescript
interface CacheConfig {
  enableCaching: boolean;
  shortcutMetadata: {
    ttl: number;        // 5 minutes
    maxSize: number;    // 1000 entries
  };
  executionResults: {
    ttl: number;        // 1 minute
    maxSize: number;    // 500 entries
  };
}
```

This API reference provides comprehensive documentation for integrating with and extending the Shortcut MCP server.
