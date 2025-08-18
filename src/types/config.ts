/**
 * Configuration type definitions
 */

export interface ServerConfig {
  name: string;
  version: string;
  description?: string;
  port?: number;
  host?: string;
}

export interface ShortcutConfig {
  allowedPrefixes: string[];
  blockedShortcuts: string[];
  maxExecutionTime: number;
  defaultTimeout: number;
  cacheTimeout: number;
  enableCache: boolean;
}

export interface SecurityConfig {
  requireConfirmation: boolean;
  logExecutions: boolean;
  allowSystemShortcuts: boolean;
  sandboxMode: boolean;
  maxInputSize: number;
  enableRateLimit: boolean;
  allowedPrefixes: string[];
  blockedShortcuts: string[];
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  console: boolean;
  file?: string;
  format: 'json' | 'text';
  enableDebug: boolean;
}

export interface PerformanceConfig {
  enableCaching: boolean;
  cacheSize: number;
  cacheTTL: number;
  maxConcurrentExecutions: number;
  enableMetrics: boolean;
}

export interface Configuration {
  server: ServerConfig;
  shortcuts: ShortcutConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
  performance: PerformanceConfig;
}

export interface EnvironmentValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  platform: string;
  nodeVersion: string;
  shortcutsAvailable: boolean;
}
