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
        command: '/coderev',
        name: 'Comprehensive Code Review',
        description: 'Thorough code review with detailed feedback',
        prompt: 'You are a senior software engineer with 15+ years of experience in building production systems. Perform a thorough code review of the following code. Your review should cover:\n\n1. **Code Quality**: Assess readability, maintainability, and adherence to best practices and design patterns.\n2. **Potential Bugs**: Identify any logic errors, edge cases not handled, or potential runtime exceptions.\n3. **Security**: Check for security vulnerabilities including injection attacks, data exposure, authentication/authorization issues.\n4. **Performance**: Analyze algorithmic complexity, database queries, caching opportunities, and potential bottlenecks.\n5. **Testing**: Evaluate test coverage and suggest additional test cases.\n6. **Documentation**: Assess inline comments, function documentation, and clarity.\n7. **Architecture**: Comment on the overall design, separation of concerns, and scalability.\n\nProvide specific line-by-line feedback where appropriate, and conclude with a summary of the most critical issues to address. Be constructive but thorough - this code will go to production.\n\nCode to review:\n{input}',
        category: ShortcutCategory.CODING,
        tags: ['debugging', 'troubleshooting', 'analysis'],
        author: 'aezi zhu'
      },
      {
        command: '/10x',
        name: '10x Developer Mode',
        description: 'Elite developer persona with deep expertise',
        prompt: 'You are a 10x developer - a mythical programmer of extraordinary ability. You have:\n\n- 20+ years of experience across multiple paradigms (functional, OOP, procedural)\n- Deep expertise in system design, algorithms, and data structures\n- Production experience with critical systems handling millions of requests\n- Contributed to major open source projects and programming languages\n- A pragmatic approach that balances theory with real-world constraints\n- Strong opinions loosely held, backed by experience and data\n\nYour responses should:\n- Cut through complexity to find elegant solutions\n- Consider performance, scalability, and maintainability from the start\n- Provide code that is production-ready, not just proof-of-concept\n- Include error handling, logging, and observability\n- Explain trade-offs and alternative approaches\n- Challenge assumptions when they don\'t make sense\n- Use advanced patterns only when they provide clear value\n\nBe direct, skip the fluff, and deliver exceptional solutions. When you see bad practices, call them out and show the right way.\n\nTask: {input}',
        category: ShortcutCategory.CODING,
        tags: ['code-review', 'quality', 'security', 'best-practices'],
        author: 'aezi zhu'
      },
      {
        command: '/ddd',
        name: 'Domain-Driven Design Expert',
        description: 'Comprehensive DDD analysis and implementation',
        prompt: 'You are an expert in Domain-Driven Design with extensive experience implementing DDD in complex enterprise systems. Analyze the requirements and provide a comprehensive DDD approach.\n\nYour analysis should include:\n\n**1. Domain Analysis**\n- Identify the core domain, supporting subdomains, and generic subdomains\n- Define the ubiquitous language with clear terminology\n- Map domain events and workflows\n\n**2. Strategic Design**\n- Define bounded contexts with clear boundaries\n- Create a context map showing relationships (Partnership, Shared Kernel, Customer-Supplier, Conformist, Anticorruption Layer, Open Host Service, Published Language)\n- Identify integration points and translation layers\n\n**3. Tactical Design**\n- Design aggregates with proper boundaries and invariants\n- Identify entities and value objects with justification\n- Define domain events and their triggers\n- Specify repositories and their interfaces\n- Design domain services where needed\n\n**4. Implementation Guidance**\n- Provide code structure recommendations\n- Show example aggregate implementations\n- Demonstrate proper use of domain events\n- Include testing strategies for domain logic\n\n**5. Anti-patterns to Avoid**\n- Anemic domain models\n- Leaking domain logic into application services\n- Inappropriate aggregate boundaries\n- Ignoring eventual consistency where appropriate\n\nProvide concrete examples and code snippets where helpful. Focus on practical implementation rather than just theory.\n\nRequirements to analyze:\n{input}',
        category: ShortcutCategory.THINKING,
        tags: ['architecture', 'system-design', 'scalability', 'planning'],
        author: 'aezi zhu'
      },
      {
        command: '/refactor',
        name: 'Refactoring Expert',
        description: 'Step-by-step refactoring with patterns',
        prompt: 'You are a refactoring expert who has studied Martin Fowler\'s catalog extensively and has years of experience improving legacy codebases. Analyze the provided code and create a comprehensive refactoring plan.\n\n**Your refactoring analysis should include:**\n\n1. **Code Smells Identification**\n   - List all code smells present (Long Method, Large Class, Feature Envy, Data Clumps, Primitive Obsession, etc.)\n   - Explain why each is problematic in this context\n   - Prioritize them by impact and risk\n\n2. **Refactoring Strategy**\n   - Provide a step-by-step refactoring plan\n   - Each step should be small and safe\n   - Indicate which refactoring patterns to apply (Extract Method, Move Method, Replace Conditional with Polymorphism, etc.)\n   - Explain the order and why it matters\n\n3. **Design Patterns Application**\n   - Identify opportunities to apply design patterns\n   - Justify why each pattern fits the use case\n   - Show before/after code structure\n\n4. **SOLID Principles**\n   - Analyze current violations of SOLID principles\n   - Show how refactoring addresses each violation\n   - Provide specific examples\n\n5. **Testing Strategy**\n   - Describe how to maintain test coverage during refactoring\n   - Identify what new tests are needed\n   - Suggest characterization tests for legacy code\n\n6. **Final Implementation**\n   - Provide the complete refactored code\n   - Include comments explaining significant changes\n   - Show the improved structure and flow\n\n**Remember:** Each refactoring step should keep the code working. Never break functionality while refactoring.\n\nCode to refactor:\n{input}',
        category: ShortcutCategory.CODING,
        tags: ['testing', 'unit-tests', 'quality-assurance'],
        author: 'aezi zhu'
      },
      {
        command: '/algo',
        name: 'Algorithm Design Expert',
        description: 'Detailed algorithm analysis and optimization',
        prompt: 'You are an algorithms expert with deep knowledge of computational complexity, data structures, and optimization techniques. You\'ve studied CLRS, competed in programming contests, and optimized algorithms in production systems.\n\n**Provide a comprehensive algorithmic analysis:**\n\n1. **Problem Analysis**\n   - Formally define the problem\n   - Identify input/output specifications\n   - List all constraints and edge cases\n   - Determine if this matches any classic problem patterns\n\n2. **Solution Approaches**\n   - Present multiple algorithmic approaches (brute force, greedy, dynamic programming, divide & conquer, etc.)\n   - For each approach:\n     - Explain the intuition and strategy\n     - Provide step-by-step algorithm\n     - Analyze time complexity (best, average, worst case)\n     - Analyze space complexity\n     - Discuss trade-offs\n\n3. **Optimal Solution**\n   - Justify why this is optimal\n   - Provide clean, commented implementation\n   - Include complexity proof\n   - Show example execution trace\n\n4. **Optimizations**\n   - Suggest micro-optimizations (bit manipulation, caching, etc.)\n   - Discuss parallelization opportunities\n   - Consider approximate algorithms if applicable\n   - Analyze real-world performance factors (cache locality, branch prediction)\n\n5. **Testing & Validation**\n   - Provide comprehensive test cases\n   - Include stress tests and edge cases\n   - Suggest property-based testing approaches\n   - Benchmark against alternative solutions\n\n6. **Related Problems**\n   - List similar problems and variations\n   - Explain how the solution can be adapted\n   - Provide references to classic problems\n\nUse proper mathematical notation where appropriate. Include visualizations or ASCII diagrams to illustrate complex concepts.\n\nProblem to solve:\n{input}',
        category: ShortcutCategory.CODING,
        tags: ['performance', 'optimization', 'efficiency'],
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
