/**
 * MCP protocol related type definitions
 */

export interface MCPRequest {
  method: string;
  params: any;
  id?: string | number;
}

export interface MCPResponse {
  result?: any;
  error?: MCPError;
  id?: string | number;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: JSONSchema;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  content: ContentBlock[];
  isError?: boolean;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
}

export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  items?: JSONSchema;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

export interface JSONSchemaProperty {
  type: string | string[];
  description?: string;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  default?: any;
  items?: JSONSchema;
  properties?: Record<string, JSONSchemaProperty>;
}

export interface ServerCapabilities {
  tools?: ToolsCapability;
  resources?: ResourcesCapability;
  prompts?: PromptsCapability;
  logging?: LoggingCapability;
}

export interface ToolsCapability {
  listChanged?: boolean;
}

export interface ResourcesCapability {
  subscribe?: boolean;
  listChanged?: boolean;
}

export interface PromptsCapability {
  listChanged?: boolean;
}

export interface LoggingCapability {
  level?: 'debug' | 'info' | 'warning' | 'error';
}
