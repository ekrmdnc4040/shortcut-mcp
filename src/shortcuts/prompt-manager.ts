/**
 * Prompt Shortcut Manager - Manages custom prompt shortcuts and commands
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
  private dataPath: string;

  constructor(logger: Logger, dataPath?: string) {
    this.logger = logger;
    this.dataPath = dataPath || join(homedir(), '.shortcut-mcp', 'shortcuts.json');
    this.initializeDefaultShortcuts();
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing Prompt Shortcut Manager...');
    
    try {
      await this.loadShortcuts();
      this.logger.info('Prompt shortcuts loaded successfully');
    } catch (error) {
      this.logger.warn('Failed to load shortcuts, using defaults:', error);
      await this.saveShortcuts();
    }
  }

  /**
   * Parse user input to check for shortcuts and expand them
   */
  parseCommand(input: string): ParsedCommand {
    const trimmed = input.trim();
    
    // Check if input starts with a command
    if (!trimmed.startsWith('/')) {
      return {
        isShortcut: false,
        remainingText: input
      };
    }

    // Extract command and remaining text
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const remainingText = parts.slice(1).join(' ');

    // Find matching shortcut
    const shortcut = this.findShortcutByCommand(command);
    if (!shortcut) {
      return {
        isShortcut: false,
        remainingText: input
      };
    }

    // Parse variables from remaining text
    const variables = this.parseVariables(shortcut, remainingText);

    return {
      isShortcut: true,
      command,
      shortcut,
      remainingText,
      variables
    };
  }

  /**
   * Execute a shortcut by expanding the prompt template
   */
  executeShortcut(parsed: ParsedCommand): ShortcutExecution {
    if (!parsed.isShortcut || !parsed.shortcut) {
      throw new Error('Invalid shortcut execution request');
    }

    const expandedPrompt = this.expandPromptTemplate(
      parsed.shortcut.prompt, 
      parsed.variables || {}, 
      parsed.remainingText
    );

    // Update usage statistics
    parsed.shortcut.usageCount++;
    this.saveShortcuts(); // Save asynchronously

    return {
      shortcut: parsed.shortcut,
      input: parsed.remainingText,
      expandedPrompt,
      variables: parsed.variables || {}
    };
  }

  /**
   * Create a new shortcut
   */
  createShortcut(data: Partial<PromptShortcut>): PromptShortcut {
    if (!data.command || !data.prompt) {
      throw new Error('Command and prompt are required');
    }

    // Validate command format
    if (!data.command.startsWith('/')) {
      data.command = '/' + data.command;
    }

    // Check for duplicates
    if (this.findShortcutByCommand(data.command)) {
      throw new Error(`Shortcut command "${data.command}" already exists`);
    }

    const shortcut: PromptShortcut = {
      id: this.generateId(),
      command: data.command,
      name: data.name || data.command.substring(1),
      description: data.description || '',
      prompt: data.prompt,
      category: data.category || ShortcutCategory.PERSONAL,
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

    this.logger.info('Created new shortcut:', { command: shortcut.command });
    return shortcut;
  }

  /**
   * Update an existing shortcut
   */
  updateShortcut(id: string, updates: Partial<PromptShortcut>): PromptShortcut {
    const shortcut = this.shortcuts.get(id);
    if (!shortcut) {
      throw new Error(`Shortcut with id "${id}" not found`);
    }

    // Check command conflicts if command is being updated
    if (updates.command && updates.command !== shortcut.command) {
      if (this.findShortcutByCommand(updates.command)) {
        throw new Error(`Command "${updates.command}" already exists`);
      }
    }

    const updated = {
      ...shortcut,
      ...updates,
      id: shortcut.id, // Ensure ID doesn't change
      updatedAt: new Date()
    };

    this.shortcuts.set(id, updated);
    this.saveShortcuts();

    this.logger.info('Updated shortcut:', { id, command: updated.command });
    return updated;
  }

  /**
   * Delete a shortcut
   */
  deleteShortcut(id: string): boolean {
    const shortcut = this.shortcuts.get(id);
    if (!shortcut) {
      return false;
    }

    this.shortcuts.delete(id);
    this.saveShortcuts();

    this.logger.info('Deleted shortcut:', { id, command: shortcut.command });
    return true;
  }

  /**
   * List shortcuts with optional filtering
   */
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
        const search = filter.search.toLowerCase();
        shortcuts = shortcuts.filter(s =>
          s.command.toLowerCase().includes(search) ||
          s.name.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search)
        );
      }
      
      if (filter.favorites) {
        shortcuts = shortcuts.filter(s => s.isFavorite);
      }
      
      if (filter.author) {
        shortcuts = shortcuts.filter(s => s.author === filter.author);
      }
      
      if (filter.limit && filter.limit > 0) {
        shortcuts = shortcuts.slice(0, filter.limit);
      }
    }

    return shortcuts.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Get shortcut by ID
   */
  getShortcut(id: string): PromptShortcut | undefined {
    return this.shortcuts.get(id);
  }

  /**
   * Get available categories
   */
  getCategories(): ShortcutCategory[] {
    return Object.values(ShortcutCategory);
  }

  private findShortcutByCommand(command: string): PromptShortcut | undefined {
    return Array.from(this.shortcuts.values()).find(s => s.command === command);
  }

  private parseVariables(_shortcut: PromptShortcut, input: string): Record<string, any> {
    const variables: Record<string, any> = {};
    
    // For now, simple implementation - assign full input to 'input' variable
    // This can be enhanced to parse specific variables
    variables.input = input;
    variables.userInput = input;
    
    return variables;
  }

  private expandPromptTemplate(template: string, variables: Record<string, any>, input: string): string {
    let expanded = template;
    
    // Replace common variables
    expanded = expanded.replace(/\{input\}/g, input);
    expanded = expanded.replace(/\{userInput\}/g, input);
    
    // Replace other variables
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      expanded = expanded.replace(regex, String(value));
    }
    
    return expanded;
  }

  private async loadShortcuts(): Promise<void> {
    if (!existsSync(this.dataPath)) {
      return;
    }

    const data = await readFile(this.dataPath, 'utf-8');
    const shortcuts: PromptShortcut[] = JSON.parse(data);
    
    this.shortcuts.clear();
    shortcuts.forEach(shortcut => {
      // Convert date strings back to Date objects
      shortcut.createdAt = new Date(shortcut.createdAt);
      shortcut.updatedAt = new Date(shortcut.updatedAt);
      this.shortcuts.set(shortcut.id, shortcut);
    });

    this.logger.debug('Loaded shortcuts:', { count: shortcuts.length });
  }

  private async saveShortcuts(): Promise<void> {
    try {
      // Ensure directory exists
      const dir = this.dataPath.substring(0, this.dataPath.lastIndexOf('/'));
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      const shortcuts = Array.from(this.shortcuts.values());
      await writeFile(this.dataPath, JSON.stringify(shortcuts, null, 2));
      
      this.logger.debug('Saved shortcuts:', { count: shortcuts.length });
    } catch (error) {
      this.logger.error('Failed to save shortcuts:', error);
    }
  }

  private generateId(): string {
    return `shortcut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDefaultShortcuts(): void {
    const defaults: Partial<PromptShortcut>[] = [
      {
        command: '/th',
        name: 'Think Harder',
        description: 'Enhances reasoning and analysis',
        prompt: 'Think harder about this problem. Analyze it step by step with deep reasoning and consider multiple perspectives. {input}',
        category: ShortcutCategory.THINKING,
        tags: ['analysis', 'reasoning', 'deep-thinking'],
        author: 'aezi zhu'
      },
      {
        command: '/ider',
        name: 'Science Fiction Writer',
        description: 'Role-play as a sci-fi writer',
        prompt: 'You are a skilled science fiction writer. Based on the following prompt, write a compelling story with rich details, character development, and imaginative world-building: {input}',
        category: ShortcutCategory.WRITING,
        tags: ['writing', 'fiction', 'creative', 'sci-fi'],
        author: 'aezi zhu'
      },
      {
        command: '/code',
        name: 'Expert Programmer',
        description: 'Generate clean, documented code',
        prompt: 'You are an expert programmer. Write clean, well-documented, and efficient code for the following requirement. Include comments and follow best practices: {input}',
        category: ShortcutCategory.CODING,
        tags: ['programming', 'code', 'development'],
        author: 'aezi zhu'
      },
      {
        command: '/explain',
        name: 'Simple Explainer',
        description: 'Explain complex topics simply',
        prompt: 'Explain the following concept in simple terms that anyone can understand. Use analogies, examples, and break it down step by step: {input}',
        category: ShortcutCategory.EXPLAINING,
        tags: ['explanation', 'teaching', 'simple'],
        author: 'aezi zhu'
      },
      {
        command: '/pros-cons',
        name: 'Pros and Cons Analysis',
        description: 'Analyze advantages and disadvantages',
        prompt: 'Analyze the following topic by listing the pros and cons. Be objective and consider multiple viewpoints: {input}',
        category: ShortcutCategory.ANALYSIS,
        tags: ['analysis', 'comparison', 'decision-making'],
        author: 'aezi zhu'
      }
    ];

    defaults.forEach(data => {
      try {
        this.createShortcut(data);
      } catch (error) {
        // Ignore errors for default shortcuts (might already exist)
      }
    });
  }
}
