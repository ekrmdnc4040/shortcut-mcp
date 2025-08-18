/**
 * Error type definitions and classes
 */

export abstract class MCPError extends Error {
  abstract code: string;
  abstract httpStatus: number;
  
  constructor(message: string, public details?: any) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends MCPError {
  code = 'VALIDATION_ERROR';
  httpStatus = 400;
}

export class SecurityError extends MCPError {
  code = 'SECURITY_ERROR';
  httpStatus = 403;
}

export class ShortcutNotFoundError extends MCPError {
  code = 'SHORTCUT_NOT_FOUND';
  httpStatus = 404;
}

export class ExecutionError extends MCPError {
  code = 'EXECUTION_ERROR';
  httpStatus = 500;
}

export class TimeoutError extends MCPError {
  code = 'EXECUTION_TIMEOUT';
  httpStatus = 408;
}

export class PermissionDeniedError extends MCPError {
  code = 'PERMISSION_DENIED';
  httpStatus = 403;
}

export class RateLimitError extends MCPError {
  code = 'RATE_LIMITED';
  httpStatus = 429;
}

export class ConfigurationError extends MCPError {
  code = 'CONFIGURATION_ERROR';
  httpStatus = 500;
}

export class SystemError extends MCPError {
  code = 'SYSTEM_ERROR';
  httpStatus = 500;
}

export interface ErrorDetails {
  code: string;
  message: string;
  timestamp: Date;
  operation?: string;
  shortcutName?: string;
  input?: any;
  stackTrace?: string;
  suggestions?: string[];
}
