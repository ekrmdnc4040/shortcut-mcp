/**
 * Type definitions for the Shortcut MCP
 */

export * from './config';
export * from './shortcuts';
export * from './shortcut-builder';
export * from './mcp';
export * from './security';

// Explicitly export prompt shortcut types to avoid conflicts
export {
  PromptShortcut,
  ShortcutCategory as PromptShortcutCategory,
  ShortcutFilter as PromptShortcutFilter,
  ShortcutExecution,
  ParsedCommand,
  TemplateVariable,
  VariableType,
  ShortcutCollection,
  ShortcutUsageStats
} from './prompt-shortcuts';

// Explicitly export non-conflicting types from errors
export { 
  MCPError as BaseMCPError,
  ValidationError as BaseValidationError,
  SecurityError,
  ShortcutNotFoundError,
  ExecutionError,
  TimeoutError,
  PermissionDeniedError,
  RateLimitError,
  ConfigurationError,
  SystemError,
  ErrorDetails
} from './errors';
