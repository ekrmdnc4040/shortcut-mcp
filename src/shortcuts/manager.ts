/**
 * Shortcut Manager - Handles discovery, validation, and execution of macOS shortcuts
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { 
  Shortcut, 
  ShortcutInfo, 
  ShortcutFilter, 
  ExecutionRequest, 
  ExecutionResult,
  ShortcutCategory,
  InputType,
  OutputType,
  CacheEntry,
  CacheStats
} from '../types/shortcuts.js';
import { ShortcutConfig } from '../types/config.js';
import { Logger } from '../utils/logger.js';
import { ShortcutNotFoundError, ExecutionError, TimeoutError } from '../types/errors.js';

const execAsync = promisify(exec);

export class ShortcutManager {
  private config: ShortcutConfig;
  private logger: Logger;
  private shortcutsCache: Map<string, CacheEntry<Shortcut[]>> = new Map();
  private infoCache: Map<string, CacheEntry<ShortcutInfo>> = new Map();
  private cacheStats = { hits: 0, misses: 0 };

  constructor(config: ShortcutConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing Shortcut Manager...');
    
    // Check if shortcuts CLI is available
    try {
      await execAsync('which shortcuts');
      this.logger.info('macOS shortcuts CLI found');
    } catch (error) {
      throw new Error('macOS shortcuts CLI not found. Please ensure you are running on macOS 12+ with Shortcuts app installed.');
    }

    // Warm up cache with initial shortcut list
    if (this.config.enableCache) {
      try {
        await this.discoverShortcuts();
        this.logger.info('Shortcut cache warmed up');
      } catch (error) {
        this.logger.warn('Failed to warm up cache:', error);
      }
    }
  }

  async listShortcuts(filter?: ShortcutFilter): Promise<Shortcut[]> {
    const cacheKey = this.getCacheKey('shortcuts', filter);
    
    // Check cache first
    if (this.config.enableCache) {
      const cached = this.shortcutsCache.get(cacheKey);
      if (cached && !this.isCacheExpired(cached)) {
        this.cacheStats.hits++;
        this.logger.debug('Cache hit for shortcuts list');
        return this.applyFilter(cached.data, filter);
      }
    }

    this.cacheStats.misses++;
    const shortcuts = await this.discoverShortcuts();
    
    // Cache the results
    if (this.config.enableCache) {
      this.shortcutsCache.set(cacheKey, {
        data: shortcuts,
        timestamp: Date.now(),
        ttl: this.config.cacheTimeout
      });
    }

    return this.applyFilter(shortcuts, filter);
  }

  async getShortcutInfo(name: string): Promise<ShortcutInfo | null> {
    const cacheKey = `info_${name}`;
    
    // Check cache first
    if (this.config.enableCache) {
      const cached = this.infoCache.get(cacheKey);
      if (cached && !this.isCacheExpired(cached)) {
        this.cacheStats.hits++;
        this.logger.debug('Cache hit for shortcut info:', { name });
        return cached.data;
      }
    }

    this.cacheStats.misses++;
    
    try {
      // Get basic info from shortcuts list
      const shortcuts = await this.listShortcuts();
      const shortcut = shortcuts.find(s => s.name === name);
      
      if (!shortcut) {
        return null;
      }

      // Get detailed info
      const detailedInfo = await this.getDetailedShortcutInfo(name);
      const info: ShortcutInfo = { ...shortcut, ...detailedInfo };

      // Cache the result
      if (this.config.enableCache) {
        this.infoCache.set(cacheKey, {
          data: info,
          timestamp: Date.now(),
          ttl: this.config.cacheTimeout
        });
      }

      return info;
    } catch (error) {
      this.logger.error('Failed to get shortcut info:', { name, error });
      return null;
    }
  }

  async executeShortcut(request: ExecutionRequest): Promise<ExecutionResult> {
    const { name, input, timeout = this.config.defaultTimeout } = request;
    const startTime = Date.now();
    
    this.logger.info('Executing shortcut:', { name, hasInput: !!input, timeout });

    try {
      // Validate shortcut exists
      const info = await this.getShortcutInfo(name);
      if (!info) {
        throw new ShortcutNotFoundError(`Shortcut "${name}" not found`);
      }

      // Build command
      let command = `shortcuts run "${name}"`;
      
      if (input !== undefined && input !== null) {
        const inputStr = this.prepareInput(input);
        command += ` -i "${inputStr}"`;
      }

      this.logger.debug('Executing command:', { command });

      // Execute with timeout
      const result = await this.executeWithTimeout(command, timeout);
      const executionTime = Date.now() - startTime;

      this.logger.info('Shortcut executed successfully:', { 
        name, 
        executionTime,
        outputLength: result.length 
      });

      return {
        success: true,
        output: this.parseOutput(result),
        executionTime,
        logs: [],
        metadata: {
          shortcutName: name,
          startTime: new Date(startTime),
          endTime: new Date(),
          inputSize: input ? JSON.stringify(input).length : 0,
          outputSize: result.length,
          warningsCount: 0,
          errorsCount: 0
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.logger.error('Shortcut execution failed:', { 
        name, 
        error: errorMessage, 
        executionTime 
      });

      return {
        success: false,
        error: errorMessage,
        executionTime,
        logs: [],
        metadata: {
          shortcutName: name,
          startTime: new Date(startTime),
          endTime: new Date(),
          inputSize: input ? JSON.stringify(input).length : 0,
          outputSize: 0,
          warningsCount: 0,
          errorsCount: 1
        }
      };
    }
  }

  private async discoverShortcuts(): Promise<Shortcut[]> {
    try {
      const { stdout } = await execAsync('shortcuts list');
      const lines = stdout.trim().split('\n').filter(line => line.trim());
      
      const shortcuts: Shortcut[] = [];
      
      for (const line of lines) {
        const name = line.trim();
        if (name) {
          const description = await this.getShortcutDescription(name);
          shortcuts.push({
            name,
            description: description || `macOS shortcut: ${name}`,
            category: this.categorizeShortcut(name),
            inputTypes: [InputType.TEXT], // Default, could be enhanced
            outputType: OutputType.TEXT,
            icon: '⚡',
            lastModified: new Date()
          });
        }
      }

      this.logger.debug('Discovered shortcuts:', { count: shortcuts.length });
      return shortcuts;
      
    } catch (error) {
      this.logger.error('Failed to discover shortcuts:', error);
      throw new ExecutionError('Failed to list shortcuts');
    }
  }

  private async getShortcutDescription(name: string): Promise<string | undefined> {
    try {
      // This would require additional AppleScript or other methods
      // For now, return a generic description
      return `macOS shortcut: ${name}`;
    } catch {
      return undefined;
    }
  }

  private async getDetailedShortcutInfo(_name: string): Promise<Partial<ShortcutInfo>> {
    // For now, return basic info
    // This could be enhanced with AppleScript to get more details
    return {
      actionCount: 1,
      size: 1024,
      isSystemShortcut: false
    };
  }

  private categorizeShortcut(name: string): ShortcutCategory {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('email') || lowerName.includes('message') || lowerName.includes('call')) {
      return ShortcutCategory.COMMUNICATION;
    }
    if (lowerName.includes('photo') || lowerName.includes('video') || lowerName.includes('music')) {
      return ShortcutCategory.MEDIA;
    }
    if (lowerName.includes('note') || lowerName.includes('task') || lowerName.includes('calendar')) {
      return ShortcutCategory.PRODUCTIVITY;
    }
    if (lowerName.includes('system') || lowerName.includes('setting')) {
      return ShortcutCategory.SYSTEM;
    }
    
    return ShortcutCategory.UTILITIES;
  }

  private applyFilter(shortcuts: Shortcut[], filter?: ShortcutFilter): Shortcut[] {
    if (!filter) return shortcuts;

    let filtered = shortcuts;

    if (filter.category) {
      filtered = filtered.filter(s => s.category === filter.category);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        (s.description && s.description.toLowerCase().includes(searchLower))
      );
    }

    if (filter.limit && filter.limit > 0) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }

  private prepareInput(input: any): string {
    if (typeof input === 'string') {
      return input.replace(/"/g, '\\"');
    }
    return JSON.stringify(input).replace(/"/g, '\\"');
  }

  private parseOutput(output: string): any {
    // Try to parse as JSON first
    try {
      return JSON.parse(output);
    } catch {
      // Return as plain text
      return output.trim();
    }
  }

  private async executeWithTimeout(command: string, timeoutMs: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new TimeoutError(`Execution timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      execAsync(command)
        .then(({ stdout, stderr }) => {
          clearTimeout(timer);
          if (stderr && stderr.trim()) {
            this.logger.warn('Command stderr:', stderr);
          }
          resolve(stdout);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(new ExecutionError(`Command failed: ${error.message}`));
        });
    });
  }

  private getCacheKey(type: string, filter?: ShortcutFilter): string {
    if (!filter) return type;
    
    const parts = [type];
    if (filter.category) parts.push(`cat:${filter.category}`);
    if (filter.search) parts.push(`search:${filter.search}`);
    if (filter.limit) parts.push(`limit:${filter.limit}`);
    
    return parts.join('|');
  }

  private isCacheExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  getCacheStats(): CacheStats {
    const totalRequests = this.cacheStats.hits + this.cacheStats.misses;
    return {
      size: this.shortcutsCache.size + this.infoCache.size,
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      hitRate: totalRequests > 0 ? this.cacheStats.hits / totalRequests : 0
    };
  }

  clearCache(): void {
    this.shortcutsCache.clear();
    this.infoCache.clear();
    this.cacheStats = { hits: 0, misses: 0 };
    this.logger.info('Cache cleared');
  }

  async cleanup(): Promise<void> {
    this.clearCache();
    this.logger.info('Shortcut Manager cleaned up');
  }
}
