/**
 * Shortcut Builder - Creates and manages shortcut definitions
 */

import {
  ShortcutDefinition,
  ActionType,
  ShortcutInputType,
  ShortcutOutputType,
  ShortcutCreationRequest,
  ShortcutCreationResult,
  BuilderValidationResult,
  ShortcutTemplate
} from '../types/shortcut-builder.js';
import { Logger } from '../utils/logger.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export class ShortcutBuilder {
  private logger: Logger;
  private templates: Map<string, ShortcutTemplate> = new Map();

  constructor(logger: Logger) {
    this.logger = logger;
    this.initializeTemplates();
  }

  /**
   * Creates a new shortcut from a definition
   */
  async createShortcut(request: ShortcutCreationRequest): Promise<ShortcutCreationResult> {
    try {
      this.logger.info('Creating shortcut:', { name: request.definition.name });

      // Validate the definition
      if (request.validate !== false) {
        const validation = this.validateDefinition(request.definition);
        if (!validation.valid) {
          return {
            success: false,
            error: `Validation failed: ${validation.errors[0]?.message}`,
            validationResults: [validation]
          };
        }
      }

      // Check if shortcut already exists
      if (!request.overwriteExisting) {
        const exists = await this.shortcutExists(request.definition.name);
        if (exists) {
          return {
            success: false,
            error: `Shortcut "${request.definition.name}" already exists. Use overwriteExisting=true to replace it.`
          };
        }
      }

      // Generate shortcut file
      const shortcutData = this.generateShortcutData(request.definition);
      
      // Create temporary file
      const tempFile = join(tmpdir(), `shortcut_${Date.now()}.shortcut`);
      await writeFile(tempFile, JSON.stringify(shortcutData, null, 2));

      // Import the shortcut
      await execAsync(`shortcuts import "${tempFile}"`);
      
      // Clean up temporary file
      await unlink(tempFile);

      this.logger.info('Shortcut created successfully:', { name: request.definition.name });

      return {
        success: true,
        shortcutName: request.definition.name,
        warnings: []
      };

    } catch (error) {
      this.logger.error('Failed to create shortcut:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Creates a shortcut from a template
   */
  async createFromTemplate(templateName: string, customizations: Partial<ShortcutDefinition> = {}): Promise<ShortcutCreationResult> {
    const template = this.templates.get(templateName);
    if (!template) {
      return {
        success: false,
        error: `Template "${templateName}" not found`
      };
    }

    const definition: ShortcutDefinition = {
      ...template.definition,
      ...customizations,
      name: customizations.name || template.definition.name
    };

    return this.createShortcut({ definition, validate: true });
  }

  /**
   * Deletes a shortcut
   */
  async deleteShortcut(name: string): Promise<boolean> {
    try {
      await execAsync(`shortcuts delete "${name}"`);
      this.logger.info('Shortcut deleted:', { name });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete shortcut:', { name, error });
      return false;
    }
  }

  /**
   * Gets available templates
   */
  getTemplates(): ShortcutTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Adds a custom template
   */
  addTemplate(template: ShortcutTemplate): void {
    this.templates.set(template.name, template);
    this.logger.debug('Template added:', { name: template.name });
  }

  /**
   * Creates a simple text shortcut
   */
  createSimpleTextShortcut(name: string, text: string, description?: string): ShortcutDefinition {
    return {
      name,
      description: description || `Returns the text: "${text}"`,
      actions: [
        {
          type: ActionType.TEXT,
          identifier: 'text',
          parameters: { text }
        }
      ],
      outputType: ShortcutOutputType.TEXT
    };
  }

  /**
   * Creates an input echo shortcut
   */
  createEchoShortcut(name: string): ShortcutDefinition {
    return {
      name,
      description: 'Echoes back any input provided',
      inputType: ShortcutInputType.TEXT,
      outputType: ShortcutOutputType.TEXT,
      actions: [
        {
          type: ActionType.TEXT,
          identifier: 'echo',
          parameters: { text: '{input}' }
        }
      ]
    };
  }

  /**
   * Creates a current time shortcut
   */
  createCurrentTimeShortcut(name: string, format?: string): ShortcutDefinition {
    return {
      name,
      description: 'Returns the current date and time',
      actions: [
        {
          type: ActionType.DATE,
          identifier: 'current_date',
          parameters: {}
        },
        {
          type: ActionType.FORMAT_DATE,
          identifier: 'format_date',
          parameters: {
            format: format || 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ],
      outputType: ShortcutOutputType.TEXT
    };
  }

  /**
   * Creates a weather shortcut
   */
  createWeatherShortcut(name: string): ShortcutDefinition {
    return {
      name,
      description: 'Gets current weather for a location',
      inputType: ShortcutInputType.TEXT,
      actions: [
        {
          type: ActionType.GET_CURRENT_WEATHER,
          identifier: 'get_weather',
          parameters: {
            location: '{input}'
          }
        }
      ],
      outputType: ShortcutOutputType.TEXT
    };
  }

  /**
   * Creates a shell script shortcut
   */
  createShellScriptShortcut(name: string, script: string, description?: string): ShortcutDefinition {
    return {
      name,
      description: description || 'Runs a shell script',
      actions: [
        {
          type: ActionType.RUN_SHELL_SCRIPT,
          identifier: 'shell_script',
          parameters: {
            script,
            shell: '/bin/bash'
          }
        }
      ],
      outputType: ShortcutOutputType.TEXT
    };
  }

  private validateDefinition(definition: ShortcutDefinition): BuilderValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Check required fields
    if (!definition.name || definition.name.trim().length === 0) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Shortcut name is required'
      });
    }

    if (!definition.actions || definition.actions.length === 0) {
      errors.push({
        code: 'NO_ACTIONS',
        message: 'Shortcut must have at least one action'
      });
    }

    // Validate actions
    definition.actions?.forEach((action, index) => {
      if (!action.type) {
        errors.push({
          code: 'MISSING_ACTION_TYPE',
          message: 'Action type is required',
          actionIndex: index
        });
      }

      if (!action.identifier) {
        errors.push({
          code: 'MISSING_ACTION_IDENTIFIER',
          message: 'Action identifier is required',
          actionIndex: index
        });
      }
    });

    // Check for duplicate action identifiers
    const identifiers = new Set();
    definition.actions?.forEach((action, index) => {
      if (identifiers.has(action.identifier)) {
        warnings.push({
          code: 'DUPLICATE_IDENTIFIER',
          message: `Duplicate action identifier: ${action.identifier}`,
          suggestion: 'Use unique identifiers for each action',
          actionIndex: index
        });
      }
      identifiers.add(action.identifier);
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async shortcutExists(name: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync('shortcuts list');
      const shortcuts = stdout.split('\n').map(line => line.trim()).filter(Boolean);
      return shortcuts.includes(name);
    } catch {
      return false;
    }
  }

  private generateShortcutData(definition: ShortcutDefinition): any {
    // This generates the shortcut file format
    // The actual format is quite complex - this is a simplified version
    return {
      WFWorkflowName: definition.name,
      WFWorkflowDescription: definition.description || '',
      WFWorkflowIcon: {
        WFWorkflowIconImageData: null,
        WFWorkflowIconGlyphCharacter: definition.icon || '⚡'
      },
      WFWorkflowInputContentItemClasses: definition.inputType ? [definition.inputType] : [],
      WFWorkflowOutputContentItemClasses: definition.outputType ? [definition.outputType] : [],
      WFWorkflowActions: definition.actions.map(action => ({
        WFWorkflowActionIdentifier: action.type,
        WFWorkflowActionParameters: action.parameters || {},
        UUID: action.uuid || this.generateUUID()
      })),
      WFWorkflowImportQuestions: [],
      WFWorkflowTypes: ['NCWidget', 'WatchKit'],
      WFWorkflowHasShortcutInputVariables: !!definition.inputType
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private initializeTemplates(): void {
    // Initialize built-in templates
    const templates: ShortcutTemplate[] = [
      {
        name: 'hello-world',
        description: 'Simple hello world shortcut',
        category: 'basic',
        definition: this.createSimpleTextShortcut('Hello World', 'Hello from Shortcuts MCP!')
      },
      {
        name: 'echo-input',
        description: 'Echoes back any input',
        category: 'basic',
        definition: this.createEchoShortcut('Echo Input')
      },
      {
        name: 'current-time',
        description: 'Shows current date and time',
        category: 'utilities',
        definition: this.createCurrentTimeShortcut('Current Time')
      },
      {
        name: 'weather-report',
        description: 'Gets weather for a location',
        category: 'information',
        definition: this.createWeatherShortcut('Weather Report')
      },
      {
        name: 'system-info',
        description: 'Gets basic system information',
        category: 'system',
        definition: {
          name: 'System Info',
          description: 'Returns basic system information',
          actions: [
            {
              type: ActionType.GET_DEVICE_DETAILS,
              identifier: 'device_details',
              parameters: {}
            }
          ],
          outputType: ShortcutOutputType.TEXT
        }
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.name, template);
    });

    this.logger.debug('Initialized shortcut templates:', { count: templates.length });
  }
}
