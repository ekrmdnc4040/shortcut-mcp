/**
 * Types for prompt shortcut system
 */

export interface PromptShortcut {
  id: string;
  command: string;           // e.g., "/th", "/ider"
  name: string;             // Display name
  description: string;      // What this shortcut does
  prompt: string;          // The actual prompt template
  category: ShortcutCategory;
  tags: string[];
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isFavorite: boolean;
  author?: string;
}

export interface TemplateVariable {
  name: string;            // Variable name in template (e.g., "input", "topic")
  description: string;     // What this variable represents
  required: boolean;       // Whether this variable is required
  defaultValue?: string;   // Default value if not provided
  type: VariableType;     // Type of variable
}

export enum VariableType {
  TEXT = 'text',
  NUMBER = 'number',
  CHOICE = 'choice',       // Multiple choice
  BOOLEAN = 'boolean'
}

export enum ShortcutCategory {
  THINKING = 'thinking',        // /th, /analyze, /reason
  WRITING = 'writing',         // /ider, /essay, /story
  CODING = 'coding',           // /code, /debug, /review
  EXPLAINING = 'explaining',   // /explain, /simplify, /teach
  ANALYSIS = 'analysis',       // /pros-cons, /compare, /evaluate
  CREATIVE = 'creative',       // /brainstorm, /ideate, /imagine
  PRODUCTIVITY = 'productivity', // /summarize, /plan, /organize
  PERSONAL = 'personal',       // User's custom categories
  OTHER = 'other'
}

export interface ShortcutExecution {
  shortcut: PromptShortcut;
  input: string;                    // Original user input
  expandedPrompt: string;          // Final prompt after variable substitution
  variables: Record<string, any>;  // Resolved variables
}

export interface ShortcutCollection {
  id: string;
  name: string;
  description: string;
  shortcuts: PromptShortcut[];
  isPublic: boolean;
  author: string;
  version: string;
}

export interface ShortcutFilter {
  category?: ShortcutCategory;
  tags?: string[];
  search?: string;
  favorites?: boolean;
  author?: string;
  limit?: number;
}

export interface ShortcutUsageStats {
  shortcutId: string;
  usageCount: number;
  lastUsed: Date;
  averageLength: number;
  successRate: number;
}

export interface ParsedCommand {
  isShortcut: boolean;
  command?: string;
  shortcut?: PromptShortcut;
  remainingText: string;
  variables?: Record<string, any>;
}
