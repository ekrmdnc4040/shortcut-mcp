/**
 * Developer-focused Prompt Shortcut Manager - Manages custom prompt shortcuts and commands for developers
 */

import { 
  PromptShortcut, 
  ShortcutCategory, 
  ShortcutFilter, 
  ShortcutExecution,
  ParsedCommand
} from '../types/prompt-shortcuts.js';
import { Logger } from '../utils/logger.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export class PromptShortcutManager {
  private shortcuts: Map<string, PromptShortcut> = new Map();
  private logger: Logger;
  private dataDir: string;
  private shortcutsFile: string;

  constructor(logger: Logger) {
    this.logger = logger;
    this.dataDir = join(homedir(), '.shortcut-mcp');
    this.shortcutsFile = join(this.dataDir, 'shortcuts.json');
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing Prompt Shortcut Manager...');
    
    // Ensure data directory exists
    if (!existsSync(this.dataDir)) {
      await mkdir(this.dataDir, { recursive: true });
    }

    // Load existing shortcuts or create built-ins
    if (existsSync(this.shortcutsFile)) {
      await this.loadShortcuts();
    } else {
      await this.createBuiltInShortcuts();
    }

    this.logger.info('Prompt shortcuts loaded successfully');
  }

  private async createBuiltInShortcuts(): Promise<void> {
    // Create built-in shortcuts for developers
    const builtInShortcuts = [
      {
        command: '/debug',
        name: 'Debug Assistant',
        description: 'Systematic debugging and troubleshooting',
        prompt: 'You are a senior debugging expert. Analyze this code issue systematically: identify potential causes, suggest debugging strategies, and provide step-by-step troubleshooting guidance: {input}',
        category: 'coding' as ShortcutCategory,
        tags: ['debugging', 'troubleshooting', 'analysis']
      },
      {
        command: '/review',
        name: 'Code Reviewer',
        description: 'Comprehensive code review and feedback',
        prompt: 'You are an experienced code reviewer. Perform a thorough code review focusing on: code quality, security, performance, maintainability, and best practices. Provide specific, actionable feedback: {input}',
        category: 'coding' as ShortcutCategory,
        tags: ['code-review', 'quality', 'security', 'best-practices']
      },
      {
        command: '/arch',
        name: 'System Architect',
        description: 'Architecture design and system planning',
        prompt: 'You are a senior software architect. Analyze the system design requirements and provide: architectural recommendations, technology choices, scalability considerations, and implementation strategy: {input}',
        category: 'thinking' as ShortcutCategory,
        tags: ['architecture', 'system-design', 'scalability', 'planning']
      },
      {
        command: '/test',
        name: 'Test Engineer',
        description: 'Comprehensive test case generation',
        prompt: 'You are a testing expert. Create comprehensive test cases including: unit tests, integration tests, edge cases, and test data. Follow testing best practices and include assertions: {input}',
        category: 'coding' as ShortcutCategory,
        tags: ['testing', 'unit-tests', 'quality-assurance']
      },
      {
        command: '/optimize',
        name: 'Performance Expert',
        description: 'Performance analysis and optimization',
        prompt: 'You are a performance optimization specialist. Analyze the code/system for: performance bottlenecks, memory usage, algorithmic efficiency, and provide specific optimization recommendations: {input}',
        category: 'coding' as ShortcutCategory,
        tags: ['performance', 'optimization', 'efficiency']
      }
    ];

    for (const data of builtInShortcuts) {
      const shortcut: PromptShortcut = {
        id: `builtin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        command: data.command,
        name: data.name,
        description: data.description,
        prompt: data.prompt,
        category: data.category,
        tags: data.tags || [],
        variables: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        isFavorite: false,
        author: 'system'
      };

      this.shortcuts.set(shortcut.id, shortcut);
      this.logger.info('Created new shortcut', { command: shortcut.command });
    }

    await this.saveShortcuts();
  }

  private async loadShortcuts(): Promise<void> {
    try {
      const data = await readFile(this.shortcutsFile, 'utf-8');
      const shortcutsData = JSON.parse(data);
      
      for (const shortcutData of shortcutsData) {
        const shortcut: PromptShortcut = {
          ...shortcutData,
          createdAt: new Date(shortcutData.createdAt),
          updatedAt: new Date(shortcutData.updatedAt)
        };
        this.shortcuts.set(shortcut.id, shortcut);
      }
    } catch (error) {
      this.logger.error('Failed to load shortcuts', { error });
      // Create built-ins if loading fails
      await this.createBuiltInShortcuts();
    }
  }

  private async saveShortcuts(): Promise<void> {
    try {
      const shortcutsData = Array.from(this.shortcuts.values());
      await writeFile(this.shortcutsFile, JSON.stringify(shortcutsData, null, 2));
    } catch (error) {
      this.logger.error('Failed to save shortcuts', { error });
    }
  }

  parseCommand(input: string): ParsedCommand {
    const trimmedInput = input.trim();
    
    // Check if input starts with a command prefix
    if (!trimmedInput.startsWith('/')) {
      return {
        isShortcut: false,
        originalInput: input,
        command: '',
        args: input
      };
    }

    // Extract command and arguments
    const parts = trimmedInput.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    // Check if command exists
    const shortcut = this.findShortcutByCommand(command);
    
    return {
      isShortcut: !!shortcut,
      originalInput: input,
      command,
      args: args || input.substring(command.length).trim()
    };
  }

  executeShortcut(parsedCommand: ParsedCommand): ShortcutExecution {
    if (!parsedCommand.isShortcut) {
      return {
        success: false,
        originalInput: parsedCommand.originalInput,
        expandedPrompt: parsedCommand.originalInput,
        shortcut: undefined,
        executionTime: 0,
        error: 'No shortcut found'
      };
    }

    const startTime = Date.now();
    const shortcut = this.findShortcutByCommand(parsedCommand.command);
    
    if (!shortcut) {
      return {
        success: false,
        originalInput: parsedCommand.originalInput,
        expandedPrompt: parsedCommand.originalInput,
        shortcut: undefined,
        executionTime: Date.now() - startTime,
        error: `Shortcut ${parsedCommand.command} not found`
      };
    }

    // Parse variables and expand template
    const variables = this.parseVariables(shortcut, parsedCommand.args);
    let expandedPrompt = shortcut.prompt;
    
    // Replace variables in template
    for (const [key, value] of Object.entries(variables)) {
      expandedPrompt = expandedPrompt.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    // Update usage count
    shortcut.usageCount++;
    shortcut.updatedAt = new Date();
    this.saveShortcuts();

    return {
      success: true,
      originalInput: parsedCommand.originalInput,
      expandedPrompt,
      shortcut,
      executionTime: Date.now() - startTime,
      variables
    };
  }

  private findShortcutByCommand(command: string): PromptShortcut | undefined {
    return Array.from(this.shortcuts.values()).find(s => s.command === command);
  }

  private parseVariables(_shortcut: PromptShortcut, input: string): Record<string, any> {
    const variables: Record<string, any> = {};
    
    // For now, simple implementation - assign full input to 'input' variable
    // This can be enhanced to parse specific variables
    variables.input = input;
    
    return variables;
  }

  // Public API methods
  listShortcuts(filter?: ShortcutFilter): PromptShortcut[] {
    let shortcuts = Array.from(this.shortcuts.values());

    if (filter) {
      if (filter.category) {
        shortcuts = shortcuts.filter(s => s.category === filter.category);
      }
      if (filter.tags && filter.tags.length > 0) {
        shortcuts = shortcuts.filter(s => 
          filter.tags!.some(tag => s.tags.includes(tag))
        );
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        shortcuts = shortcuts.filter(s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.command.toLowerCase().includes(searchLower) ||
          s.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      if (filter.favorites) {
        shortcuts = shortcuts.filter(s => s.isFavorite);
      }
    }

    // Sort by usage count (most used first), then by name
    shortcuts.sort((a, b) => {
      if (a.usageCount !== b.usageCount) {
        return b.usageCount - a.usageCount;
      }
      return a.name.localeCompare(b.name);
    });

    if (filter?.limit) {
      shortcuts = shortcuts.slice(0, filter.limit);
    }

    return shortcuts;
  }

  createShortcut(data: Partial<PromptShortcut>): PromptShortcut {
    const shortcut: PromptShortcut = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      command: data.command!,
      name: data.name!,
      description: data.description!,
      prompt: data.prompt!,
      category: data.category || 'personal',
      tags: data.tags || [],
      variables: data.variables || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: data.isFavorite || false,
      author: data.author || 'user'
    };

    this.shortcuts.set(shortcut.id, shortcut);
    this.saveShortcuts();
    
    return shortcut;
  }

  updateShortcut(id: string, updates: Partial<PromptShortcut>): PromptShortcut | null {
    const shortcut = this.shortcuts.get(id);
    if (!shortcut) {
      return null;
    }

    // Update fields
    Object.assign(shortcut, updates, { 
      updatedAt: new Date(),
      id // Ensure ID doesn't change
    });

    this.shortcuts.set(id, shortcut);
    this.saveShortcuts();
    
    return shortcut;
  }

  deleteShortcut(id: string): boolean {
    const deleted = this.shortcuts.delete(id);
    if (deleted) {
      this.saveShortcuts();
    }
    return deleted;
  }

  getShortcut(id: string): PromptShortcut | undefined {
    return this.shortcuts.get(id);
  }

  getShortcutByCommand(command: string): PromptShortcut | undefined {
    return this.findShortcutByCommand(command);
  }
}
