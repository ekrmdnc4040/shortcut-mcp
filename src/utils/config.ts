/**
 * Configuration management utilities
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { Configuration } from '../types/config.js';

const DEFAULT_CONFIG: Configuration = {
  server: {
    name: 'shortcut-mcp',
    version: '1.0.0',
    description: 'macOS Shortcuts MCP Server'
  },
  shortcuts: {
    allowedPrefixes: [],
    blockedShortcuts: [],
    maxExecutionTime: 30000,
    defaultTimeout: 10000,
    cacheTimeout: 300000,
    enableCache: true
  },
  security: {
    requireConfirmation: false,
    logExecutions: true,
    allowSystemShortcuts: false,
    sandboxMode: false,
    maxInputSize: 1048576,
    enableRateLimit: true,
    allowedPrefixes: [],
    blockedShortcuts: [],
    rateLimit: {
      windowMs: 60000,
      maxRequests: 100
    }
  },
  logging: {
    level: 'info',
    console: true,
    format: 'text',
    enableDebug: false
  },
  performance: {
    enableCaching: true,
    cacheSize: 1000,
    cacheTTL: 300,
    maxConcurrentExecutions: 5,
    enableMetrics: true
  }
};

export async function loadConfig(configPath?: string): Promise<Configuration> {
  const config = { ...DEFAULT_CONFIG };
  
  // Try to load from file
  if (configPath && existsSync(configPath)) {
    try {
      const fileContent = await readFile(configPath, 'utf-8');
      const fileConfig = JSON.parse(fileContent);
      mergeConfig(config, fileConfig);
    } catch (error) {
      console.warn(`Failed to load config from ${configPath}:`, error);
    }
  } else {
    // Try default locations
    const defaultPaths = [
      './config/default.json',
      './config.json',
      join(process.cwd(), 'config/default.json')
    ];
    
    for (const path of defaultPaths) {
      if (existsSync(path)) {
        try {
          const fileContent = await readFile(path, 'utf-8');
          const fileConfig = JSON.parse(fileContent);
          mergeConfig(config, fileConfig);
          break;
        } catch (error) {
          console.warn(`Failed to load config from ${path}:`, error);
        }
      }
    }
  }
  
  // Override with environment variables
  applyEnvironmentOverrides(config);
  
  // Validate configuration
  validateConfig(config);
  
  return config;
}

function mergeConfig(target: any, source: any): void {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      mergeConfig(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function applyEnvironmentOverrides(config: Configuration): void {
  // Server overrides
  if (process.env.SERVER_NAME) {
    config.server.name = process.env.SERVER_NAME;
  }
  if (process.env.SERVER_PORT) {
    config.server.port = parseInt(process.env.SERVER_PORT, 10);
  }
  
  // Logging overrides
  if (process.env.LOG_LEVEL) {
    config.logging.level = process.env.LOG_LEVEL as any;
  }
  if (process.env.LOG_FILE) {
    config.logging.file = process.env.LOG_FILE;
  }
  if (process.env.DEBUG === 'true') {
    config.logging.level = 'debug';
    config.logging.enableDebug = true;
  }
  
  // Security overrides
  if (process.env.ALLOW_SYSTEM_SHORTCUTS === 'true') {
    config.security.allowSystemShortcuts = true;
  }
  if (process.env.REQUIRE_CONFIRMATION === 'true') {
    config.security.requireConfirmation = true;
  }
  if (process.env.MAX_EXECUTION_TIME) {
    config.shortcuts.maxExecutionTime = parseInt(process.env.MAX_EXECUTION_TIME, 10);
  }
  
  // Performance overrides
  if (process.env.ENABLE_CACHE === 'false') {
    config.shortcuts.enableCache = false;
    config.performance.enableCaching = false;
  }
}

function validateConfig(config: Configuration): void {
  // Validate server config
  if (!config.server.name || !config.server.version) {
    throw new Error('Server name and version are required');
  }
  
  // Validate timeouts
  if (config.shortcuts.maxExecutionTime < 1000) {
    throw new Error('maxExecutionTime must be at least 1000ms');
  }
  if (config.shortcuts.defaultTimeout < 1000) {
    throw new Error('defaultTimeout must be at least 1000ms');
  }
  
  // Validate security config
  if (config.security.maxInputSize < 1024) {
    throw new Error('maxInputSize must be at least 1024 bytes');
  }
  
  // Validate rate limiting
  if (config.security.enableRateLimit) {
    if (config.security.rateLimit.windowMs < 1000) {
      throw new Error('Rate limit window must be at least 1000ms');
    }
    if (config.security.rateLimit.maxRequests < 1) {
      throw new Error('Rate limit max requests must be at least 1');
    }
  }
  
  // Validate logging level
  const validLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLevels.includes(config.logging.level)) {
    throw new Error(`Invalid log level: ${config.logging.level}`);
  }
}

export function getDefaultConfig(): Configuration {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}
