/**
 * Logger utility for the Shortcut MCP
 */

import { LoggingConfig } from '../types/config.js';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
}

export class Logger {
  private config: LoggingConfig;
  private logLevel: LogLevel;

  constructor(config: LoggingConfig) {
    this.config = config;
    this.logLevel = this.parseLogLevel(config.level);
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    };

    if (this.config.console) {
      this.logToConsole(entry);
    }

    if (this.config.file) {
      this.logToFile(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;
    
    const message = entry.data 
      ? `${prefix} ${entry.message} ${this.formatData(entry.data)}`
      : `${prefix} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message);
        break;
    }
  }

  private logToFile(_entry: LogEntry): void {
    // File logging would be implemented here
    // For now, this is a placeholder
  }

  private formatData(data: any): string {
    if (this.config.format === 'json') {
      try {
        return JSON.stringify(data);
      } catch {
        return String(data);
      }
    }
    
    if (typeof data === 'object' && data !== null) {
      try {
        return JSON.stringify(data, null, 2);
      } catch {
        return String(data);
      }
    }
    
    return String(data);
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warn':
      case 'warning':
        return LogLevel.WARN;
      case 'error':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }
}

export function createLogger(config: LoggingConfig): Logger {
  return new Logger(config);
}
