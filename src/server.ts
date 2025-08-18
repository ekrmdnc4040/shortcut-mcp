/**
 * Main MCP Server Implementation
 * 
 * This implements the Model Context Protocol server that allows LLMs
 * to interact with macOS shortcuts through standardized tools.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
  TextContent
} from '@modelcontextprotocol/sdk/types.js';

import { ShortcutManager } from './shortcuts/manager.js';
import { SecurityManager } from './security/manager.js';
import { ShortcutBuilder } from './shortcuts/builder.js';
import { Configuration } from './types/config.js';
import { Logger } from './utils/logger.js';

export class ShortcutMCPServer {
  private server: Server;
  private shortcutManager: ShortcutManager;
  private securityManager: SecurityManager;
  private shortcutBuilder: ShortcutBuilder;
  private config: Configuration;
  private logger: Logger;

  constructor(config: Configuration, logger: Logger) {
    this.config = config;
    this.logger = logger;
    
    // Initialize server
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize managers
    this.shortcutManager = new ShortcutManager(config.shortcuts, logger);
    this.securityManager = new SecurityManager(config.security, logger);
    this.shortcutBuilder = new ShortcutBuilder(logger);

    this.setupToolHandlers();
    this.setupErrorHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'list_shortcuts',
          description: 'List all available macOS shortcuts with optional filtering',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter shortcuts by category',
                enum: ['productivity', 'communication', 'media', 'utilities', 'system']
              },
              search: {
                type: 'string',
                description: 'Search shortcuts by name or description'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of shortcuts to return (default: 50)',
                minimum: 1,
                maximum: 100
              }
            }
          }
        },
        {
          name: 'run_shortcut',
          description: 'Execute a specific macOS shortcut with optional input',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the shortcut to execute (case-sensitive)'
              },
              input: {
                type: ['string', 'number', 'boolean', 'null'],
                description: 'Input data to pass to the shortcut'
              },
              timeout: {
                type: 'number',
                description: 'Execution timeout in milliseconds (default: 30000)',
                minimum: 1000,
                maximum: 300000
              }
            },
            required: ['name']
          }
        },
        {
          name: 'get_shortcut_info',
          description: 'Get detailed information about a specific shortcut',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the shortcut to get information about'
              }
            },
            required: ['name']
          }
        },
        {
          name: 'create_shortcut',
          description: 'Create a new shortcut from a definition or template',
          inputSchema: {
            type: 'object',
            properties: {
              definition: {
                type: 'object',
                description: 'Complete shortcut definition with actions',
                properties: {
                  name: { type: 'string', description: 'Name of the shortcut' },
                  description: { type: 'string', description: 'Description of the shortcut' },
                  actions: {
                    type: 'array',
                    description: 'Array of actions that make up the shortcut',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string', description: 'Action type identifier' },
                        identifier: { type: 'string', description: 'Unique identifier for this action' },
                        parameters: { type: 'object', description: 'Action-specific parameters' }
                      },
                      required: ['type', 'identifier']
                    }
                  }
                },
                required: ['name', 'actions']
              },
              template: {
                type: 'string',
                description: 'Name of a predefined template to use instead of definition'
              },
              overwriteExisting: {
                type: 'boolean',
                description: 'Whether to overwrite if shortcut already exists (default: false)'
              }
            }
          }
        },
        {
          name: 'delete_shortcut',
          description: 'Delete an existing shortcut',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the shortcut to delete'
              },
              confirm: {
                type: 'boolean',
                description: 'Confirmation flag to prevent accidental deletion'
              }
            },
            required: ['name', 'confirm']
          }
        },
        {
          name: 'list_templates',
          description: 'List available shortcut templates',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter templates by category',
                enum: ['basic', 'utilities', 'information', 'system', 'communication']
              }
            }
          }
        },
        {
          name: 'create_simple_shortcut',
          description: 'Create a simple shortcut with basic parameters (easier than full definition)',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Name of the shortcut' },
              type: {
                type: 'string',
                description: 'Type of simple shortcut to create',
                enum: ['text', 'echo', 'current-time', 'weather', 'shell-script']
              },
              content: { type: 'string', description: 'Content for the shortcut (text, script, etc.)' },
              description: { type: 'string', description: 'Optional description' }
            },
            required: ['name', 'type']
          }
        }
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Security validation
        const securityResult = this.securityManager.validateRequest(request);
        if (!securityResult.allowed) {
          throw new Error(`Security check failed: ${securityResult.reason}`);
        }

        // Route to appropriate handler
        switch (name) {
          case 'list_shortcuts':
            return await this.handleListShortcuts(args);
          
          case 'run_shortcut':
            return await this.handleRunShortcut(args);
          
          case 'get_shortcut_info':
            return await this.handleGetShortcutInfo(args);
          
          case 'create_shortcut':
            return await this.handleCreateShortcut(args);
          
          case 'delete_shortcut':
            return await this.handleDeleteShortcut(args);
          
          case 'list_templates':
            return await this.handleListTemplates(args);
          
          case 'create_simple_shortcut':
            return await this.handleCreateSimpleShortcut(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        this.logger.error('Tool execution failed:', { 
          tool: name, 
          args, 
          error: error instanceof Error ? error.message : String(error) 
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            } as TextContent
          ],
          isError: true
        };
      }
    });
  }

  private async handleListShortcuts(args: any): Promise<CallToolResult> {
    this.logger.debug('Listing shortcuts with args:', args);
    
    const shortcuts = await this.shortcutManager.listShortcuts({
      category: args?.category,
      search: args?.search,
      limit: args?.limit || 50
    });

    if (shortcuts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No shortcuts found. Make sure you have shortcuts created in the Shortcuts app.'
          } as TextContent
        ]
      };
    }

    let response = `Found ${shortcuts.length} shortcuts:\n\n`;
    
    shortcuts.forEach((shortcut, index) => {
      response += `${index + 1}. **${shortcut.name}**`;
      if (shortcut.description) {
        response += ` - ${shortcut.description}`;
      }
      response += `\n   Category: ${shortcut.category}`;
      if (shortcut.inputTypes.length > 0) {
        response += ` | Input: ${shortcut.inputTypes.join(', ')}`;
      }
      response += `\n`;
    });

    return {
      content: [
        {
          type: 'text',
          text: response.trim()
        } as TextContent
      ]
    };
  }

  private async handleRunShortcut(args: any): Promise<CallToolResult> {
    if (!args?.name) {
      throw new Error('Shortcut name is required');
    }

    this.logger.info('Executing shortcut:', { name: args.name, hasInput: !!args.input });

    // Check if shortcut is allowed
    if (!this.securityManager.isShortcutAllowed(args.name)) {
      throw new Error(`Shortcut "${args.name}" is not allowed by security policy`);
    }

    const result = await this.shortcutManager.executeShortcut({
      name: args.name,
      input: args.input,
      timeout: args.timeout || this.config.shortcuts.defaultTimeout
    });

    if (!result.success) {
      throw new Error(result.error || 'Shortcut execution failed');
    }

    // Log execution for audit
    this.securityManager.logExecution(args.name, {
      input: args.input,
      executionTime: result.executionTime,
      success: result.success
    });

    let response = `✅ Shortcut "${args.name}" executed successfully`;
    
    if (result.output) {
      response += `\n\n**Output:**\n${result.output}`;
    }
    
    response += `\n\n*Execution time: ${result.executionTime}ms*`;

    return {
      content: [
        {
          type: 'text',
          text: response
        } as TextContent
      ]
    };
  }

  private async handleGetShortcutInfo(args: any): Promise<CallToolResult> {
    if (!args?.name) {
      throw new Error('Shortcut name is required');
    }

    this.logger.debug('Getting shortcut info:', { name: args.name });

    const info = await this.shortcutManager.getShortcutInfo(args.name);
    
    if (!info) {
      throw new Error(`Shortcut "${args.name}" not found`);
    }

    let response = `**${info.name}**\n\n`;
    
    if (info.description) {
      response += `**Description:** ${info.description}\n`;
    }
    
    response += `**Category:** ${info.category}\n`;
    response += `**Input Types:** ${info.inputTypes.length > 0 ? info.inputTypes.join(', ') : 'None'}\n`;
    response += `**Output Type:** ${info.outputType}\n`;
    
    if (info.lastModified) {
      response += `**Last Modified:** ${info.lastModified.toLocaleDateString()}\n`;
    }
    
    if (info.actionCount) {
      response += `**Actions:** ${info.actionCount}\n`;
    }
    
    if (info.icon) {
      response += `**Icon:** ${info.icon}\n`;
    }

    return {
      content: [
        {
          type: 'text',
          text: response.trim()
        } as TextContent
      ]
    };
  }

  private async handleCreateShortcut(args: any): Promise<CallToolResult> {
    this.logger.info('Creating shortcut with args:', args);

    if (args.template) {
      // Create from template
      const result = await this.shortcutBuilder.createFromTemplate(args.template, args.definition);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create shortcut from template');
      }

      let response = `✅ Shortcut "${result.shortcutName}" created successfully from template "${args.template}"`;
      
      if (result.warnings && result.warnings.length > 0) {
        response += `\n\n⚠️ Warnings:\n${result.warnings.join('\n')}`;
      }

      return {
        content: [
          {
            type: 'text',
            text: response
          } as TextContent
        ]
      };
    } else if (args.definition) {
      // Create from definition
      const result = await this.shortcutBuilder.createShortcut({
        definition: args.definition,
        overwriteExisting: args.overwriteExisting || false,
        validate: true
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create shortcut');
      }

      let response = `✅ Shortcut "${result.shortcutName}" created successfully`;
      
      if (result.warnings && result.warnings.length > 0) {
        response += `\n\n⚠️ Warnings:\n${result.warnings.join('\n')}`;
      }

      return {
        content: [
          {
            type: 'text',
            text: response
          } as TextContent
        ]
      };
    } else {
      throw new Error('Either definition or template must be provided');
    }
  }

  private async handleDeleteShortcut(args: any): Promise<CallToolResult> {
    if (!args?.name) {
      throw new Error('Shortcut name is required');
    }

    if (!args.confirm) {
      throw new Error('Confirmation required to delete shortcut. Set confirm=true');
    }

    this.logger.info('Deleting shortcut:', { name: args.name });

    const success = await this.shortcutBuilder.deleteShortcut(args.name);

    if (success) {
      return {
        content: [
          {
            type: 'text',
            text: `✅ Shortcut "${args.name}" deleted successfully`
          } as TextContent
        ]
      };
    } else {
      throw new Error(`Failed to delete shortcut "${args.name}"`);
    }
  }

  private async handleListTemplates(args: any): Promise<CallToolResult> {
    this.logger.debug('Listing templates with args:', args);

    const templates = this.shortcutBuilder.getTemplates();
    let filteredTemplates = templates;

    if (args?.category) {
      filteredTemplates = templates.filter(t => t.category === args.category);
    }

    if (filteredTemplates.length === 0) {
      const message = args?.category 
        ? `No templates found in category "${args.category}"`
        : 'No templates available';
      
      return {
        content: [
          {
            type: 'text',
            text: message
          } as TextContent
        ]
      };
    }

    let response = `Found ${filteredTemplates.length} template(s):\n\n`;
    
    filteredTemplates.forEach((template, index) => {
      response += `${index + 1}. **${template.name}** (${template.category})\n`;
      response += `   ${template.description}\n`;
      response += `   Actions: ${template.definition.actions.length}\n`;
      if (template.definition.inputType) {
        response += `   Input: ${template.definition.inputType}\n`;
      }
      response += `\n`;
    });

    return {
      content: [
        {
          type: 'text',
          text: response.trim()
        } as TextContent
      ]
    };
  }

  private async handleCreateSimpleShortcut(args: any): Promise<CallToolResult> {
    if (!args?.name || !args?.type) {
      throw new Error('Both name and type are required');
    }

    this.logger.info('Creating simple shortcut:', { name: args.name, type: args.type });

    let definition;

    switch (args.type) {
      case 'text':
        if (!args.content) {
          throw new Error('Content is required for text shortcuts');
        }
        definition = this.shortcutBuilder.createSimpleTextShortcut(
          args.name, 
          args.content, 
          args.description
        );
        break;

      case 'echo':
        definition = this.shortcutBuilder.createEchoShortcut(args.name);
        break;

      case 'current-time':
        definition = this.shortcutBuilder.createCurrentTimeShortcut(
          args.name, 
          args.content // format
        );
        break;

      case 'weather':
        definition = this.shortcutBuilder.createWeatherShortcut(args.name);
        break;

      case 'shell-script':
        if (!args.content) {
          throw new Error('Content (script) is required for shell-script shortcuts');
        }
        definition = this.shortcutBuilder.createShellScriptShortcut(
          args.name, 
          args.content, 
          args.description
        );
        break;

      default:
        throw new Error(`Unknown shortcut type: ${args.type}`);
    }

    const result = await this.shortcutBuilder.createShortcut({
      definition,
      overwriteExisting: false,
      validate: true
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create shortcut');
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Simple shortcut "${result.shortcutName}" (${args.type}) created successfully`
        } as TextContent
      ]
    };
  }

  private setupErrorHandlers(): void {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error:', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Received SIGINT, shutting down...');
      await this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      this.logger.info('Received SIGTERM, shutting down...');
      await this.stop();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    this.logger.info('Starting Shortcut MCP Server...', {
      name: this.config.server.name,
      version: this.config.server.version
    });

    // Initialize shortcut manager
    await this.shortcutManager.initialize();

    await this.server.connect(transport);
    
    this.logger.info('Shortcut MCP Server connected and ready');
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping Shortcut MCP Server...');
    
    await this.server.close();
    await this.shortcutManager.cleanup();
    
    this.logger.info('Shortcut MCP Server stopped');
  }
}
