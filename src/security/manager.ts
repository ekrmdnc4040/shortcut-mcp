/**
 * Security Manager - Handles security validation, permissions, and audit logging
 */

import { 
  SecurityResult, 
  SecurityRiskLevel, 
  ValidationResult,
  AuditEntry
} from '../types/security.js';
import { MCPRequest } from '../types/mcp.js';
import { SecurityConfig } from '../types/config.js';
import { Logger } from '../utils/logger.js';
// Removed unused imports

export class SecurityManager {
  private config: SecurityConfig;
  private logger: Logger;
  private auditLog: AuditEntry[] = [];
  private rateLimitTracker: Map<string, number[]> = new Map();
  
  constructor(config: SecurityConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  validateRequest(request: MCPRequest): SecurityResult {
    try {
      // Basic request validation
      if (!request.method || !request.params) {
        return {
          allowed: false,
          reason: 'Invalid request format',
          riskLevel: SecurityRiskLevel.MEDIUM
        };
      }

      // Rate limiting check
      if (this.config.enableRateLimit) {
        const rateLimitResult = this.checkRateLimit('default');
        if (!rateLimitResult.allowed) {
          return rateLimitResult;
        }
      }

      // Method-specific validation
      const methodResult = this.validateMethod(request.method, request.params);
      if (!methodResult.allowed) {
        return methodResult;
      }

      return {
        allowed: true,
        riskLevel: SecurityRiskLevel.LOW
      };

    } catch (error) {
      this.logger.error('Security validation error:', error);
      return {
        allowed: false,
        reason: 'Security validation failed',
        riskLevel: SecurityRiskLevel.HIGH
      };
    }
  }

  isShortcutAllowed(shortcutName: string): boolean {
    // Check blocked shortcuts
    if (this.config.blockedShortcuts?.includes(shortcutName)) {
      this.logger.warn('Shortcut blocked by security policy:', { shortcutName });
      return false;
    }

    // Check system shortcuts
    if (!this.config.allowSystemShortcuts && this.isSystemShortcut(shortcutName)) {
      this.logger.warn('System shortcut blocked:', { shortcutName });
      return false;
    }

    // Check allowed prefixes
    const allowedPrefixes = this.config.allowedPrefixes || [];
    if (allowedPrefixes.length > 0) {
      const hasAllowedPrefix = allowedPrefixes.some((prefix: string) =>
        shortcutName.startsWith(prefix)
      );
      
      if (!hasAllowedPrefix) {
        this.logger.warn('Shortcut does not have allowed prefix:', { 
          shortcutName, 
          allowedPrefixes 
        });
        return false;
      }
    }

    return true;
  }

  validateInput(input: any): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Check input size
    if (input && this.config.maxInputSize) {
      const inputSize = this.calculateInputSize(input);
      if (inputSize > this.config.maxInputSize) {
        errors.push({
          code: 'INPUT_TOO_LARGE',
          message: `Input size ${inputSize} exceeds maximum ${this.config.maxInputSize}`,
          field: 'input',
          value: inputSize
        });
      }
    }

    // Check for potentially dangerous content
    if (typeof input === 'string') {
      const dangerousPatterns = [
        /rm\s+-rf/,
        /sudo\s+/,
        /passwd/,
        /delete\s+from/i,
        /drop\s+table/i
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(input)) {
          warnings.push({
            code: 'POTENTIALLY_DANGEROUS_CONTENT',
            message: 'Input contains potentially dangerous content',
            field: 'input',
            suggestion: 'Review input for security implications'
          });
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Remove potential script injections
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return input;
  }

  filterOutput(output: any): any {
    if (typeof output === 'string') {
      // Remove potentially sensitive information
      return output
        .replace(/password\s*[:=]\s*\S+/gi, 'password: [REDACTED]')
        .replace(/token\s*[:=]\s*\S+/gi, 'token: [REDACTED]')
        .replace(/key\s*[:=]\s*\S+/gi, 'key: [REDACTED]')
        .replace(/secret\s*[:=]\s*\S+/gi, 'secret: [REDACTED]');
    }

    return output;
  }

  logExecution(shortcutName: string, details: any): void {
    const entry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      operation: 'shortcut_execution',
      shortcutName,
      input: this.config.logExecutions ? details.input : '[NOT_LOGGED]',
      success: details.success,
      executionTime: details.executionTime,
      error: details.error,
      riskLevel: this.assessRiskLevel(shortcutName, details)
    };

    this.auditLog.push(entry);
    
    // Keep only recent entries (last 1000)
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }

    this.logger.info('Execution logged:', {
      shortcutName,
      success: details.success,
      riskLevel: entry.riskLevel
    });
  }

  private validateMethod(method: string, params: any): SecurityResult {
    switch (method) {
      case 'tools/call':
        return this.validateToolCall(params);
      
      case 'tools/list':
        return { allowed: true, riskLevel: SecurityRiskLevel.LOW };
      
      default:
        return {
          allowed: false,
          reason: `Unknown method: ${method}`,
          riskLevel: SecurityRiskLevel.MEDIUM
        };
    }
  }

  private validateToolCall(params: any): SecurityResult {
    const { name, arguments: args } = params;

    if (!name) {
      return {
        allowed: false,
        reason: 'Tool name is required',
        riskLevel: SecurityRiskLevel.MEDIUM
      };
    }

    // Validate specific tools
    switch (name) {
      case 'run_shortcut':
        return this.validateRunShortcut(args);
      
      case 'list_shortcuts':
      case 'get_shortcut_info':
        return { allowed: true, riskLevel: SecurityRiskLevel.LOW };
      
      default:
        return {
          allowed: false,
          reason: `Unknown tool: ${name}`,
          riskLevel: SecurityRiskLevel.MEDIUM
        };
    }
  }

  private validateRunShortcut(args: any): SecurityResult {
    if (!args?.name) {
      return {
        allowed: false,
        reason: 'Shortcut name is required',
        riskLevel: SecurityRiskLevel.MEDIUM
      };
    }

    // Check if shortcut is allowed
    if (!this.isShortcutAllowed(args.name)) {
      return {
        allowed: false,
        reason: `Shortcut "${args.name}" is not allowed`,
        riskLevel: SecurityRiskLevel.HIGH
      };
    }

    // Validate input if provided
    if (args.input !== undefined) {
      const inputValidation = this.validateInput(args.input);
      if (!inputValidation.valid) {
        return {
          allowed: false,
          reason: `Input validation failed: ${inputValidation.errors[0]?.message}`,
          riskLevel: SecurityRiskLevel.HIGH
        };
      }
    }

    return { allowed: true, riskLevel: SecurityRiskLevel.LOW };
  }

  private checkRateLimit(clientId: string): SecurityResult {
    const now = Date.now();
    const window = this.config.rateLimit.windowMs;
    const maxRequests = this.config.rateLimit.maxRequests;

    // Get or initialize request times for this client
    let requestTimes = this.rateLimitTracker.get(clientId) || [];
    
    // Remove requests outside the current window
    requestTimes = requestTimes.filter(time => now - time < window);
    
    // Check if limit exceeded
    if (requestTimes.length >= maxRequests) {
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${maxRequests} requests per ${window}ms`,
        riskLevel: SecurityRiskLevel.MEDIUM
      };
    }

    // Add current request
    requestTimes.push(now);
    this.rateLimitTracker.set(clientId, requestTimes);

    return { allowed: true, riskLevel: SecurityRiskLevel.LOW };
  }

  private isSystemShortcut(shortcutName: string): boolean {
    const systemKeywords = [
      'system', 'setting', 'preference', 'config', 'admin',
      'security', 'password', 'keychain', 'permission'
    ];
    
    const lowerName = shortcutName.toLowerCase();
    return systemKeywords.some(keyword => lowerName.includes(keyword));
  }

  private calculateInputSize(input: any): number {
    if (typeof input === 'string') {
      return Buffer.byteLength(input, 'utf8');
    }
    
    try {
      return Buffer.byteLength(JSON.stringify(input), 'utf8');
    } catch {
      return 0;
    }
  }

  private assessRiskLevel(shortcutName: string, details: any): SecurityRiskLevel {
    // System shortcuts are higher risk
    if (this.isSystemShortcut(shortcutName)) {
      return SecurityRiskLevel.HIGH;
    }

    // Failed executions might indicate issues
    if (!details.success) {
      return SecurityRiskLevel.MEDIUM;
    }

    // Long execution times might indicate complex operations
    if (details.executionTime > 30000) {
      return SecurityRiskLevel.MEDIUM;
    }

    return SecurityRiskLevel.LOW;
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getAuditLog(limit = 100): AuditEntry[] {
    return this.auditLog.slice(-limit);
  }

  clearAuditLog(): void {
    this.auditLog = [];
    this.logger.info('Audit log cleared');
  }
}
