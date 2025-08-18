/**
 * Shortcut-related type definitions
 */

export enum ShortcutCategory {
  PRODUCTIVITY = 'productivity',
  COMMUNICATION = 'communication',
  MEDIA = 'media',
  UTILITIES = 'utilities',
  SYSTEM = 'system',
  CUSTOM = 'custom'
}

export enum InputType {
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

export enum OutputType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  URL = 'url',
  JSON = 'json',
  NOTIFICATION = 'notification',
  NONE = 'none'
}

export interface Shortcut {
  name: string;
  description?: string;
  category: ShortcutCategory;
  inputTypes: InputType[];
  outputType: OutputType;
  icon?: string;
  lastModified?: Date;
  actionCount?: number;
  size?: number;
  isSystemShortcut?: boolean;
}

export interface ShortcutInfo extends Shortcut {
  actions?: ShortcutAction[];
  dependencies?: string[];
  requirements?: SystemRequirement[];
  metadata?: Record<string, any>;
}

export interface ShortcutAction {
  type: string;
  identifier: string;
  parameters?: Record<string, any>;
}

export interface SystemRequirement {
  type: 'app' | 'permission' | 'feature';
  name: string;
  required: boolean;
  version?: string;
}

export interface ShortcutFilter {
  category?: string;
  search?: string;
  limit?: number;
  includeSystem?: boolean;
}

export interface ExecutionRequest {
  name: string;
  input?: any;
  timeout?: number;
  parameters?: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  executionTime: number;
  logs?: string[];
  metadata?: ExecutionMetadata;
}

export interface ExecutionMetadata {
  shortcutName: string;
  startTime: Date;
  endTime: Date;
  inputSize?: number;
  outputSize?: number;
  warningsCount: number;
  errorsCount: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}
