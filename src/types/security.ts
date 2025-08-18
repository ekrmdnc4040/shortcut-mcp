/**
 * Security related type definitions
 */

export interface SecurityResult {
  allowed: boolean;
  reason?: string;
  requirements?: string[];
  riskLevel: SecurityRiskLevel;
}

export enum SecurityRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
}

export interface SecurityPolicy {
  allowedShortcuts?: string[];
  blockedShortcuts?: string[];
  allowedPrefixes?: string[];
  blockedPrefixes?: string[];
  requireConfirmation?: boolean;
  maxInputSize?: number;
  allowSystemShortcuts?: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  operation: string;
  shortcutName?: string;
  userId?: string;
  input?: any;
  output?: any;
  success: boolean;
  executionTime?: number;
  error?: string;
  riskLevel: SecurityRiskLevel;
}

export interface RateLimitInfo {
  windowMs: number;
  maxRequests: number;
  currentRequests: number;
  resetTime: Date;
}

export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  clientInfo?: ClientInfo;
  permissions?: Permission[];
}

export interface ClientInfo {
  userAgent?: string;
  platform?: string;
  version?: string;
}

export interface Permission {
  type: string;
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}
