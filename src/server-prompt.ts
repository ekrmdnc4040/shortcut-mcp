/**
 * Prompt Shortcut MCP Server Implementation
 * 
 * This implements the Model Context Protocol server for custom prompt shortcuts
 * allowing users to create and use shortcuts like /th, /ider, etc.
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

import { PromptShortcutManager } from './shortcuts/prompt-manager.js';
import { SecurityManager } from './security/manager.js';
import { Configuration } from './types/config.js';
import { Logger } from './utils/logger.js';
import { ShortcutCategory } from './types/prompt-shortcuts.js';

export class PromptShortcutMCPServer {
  private server: Server;
  private shortcutManager: PromptShortcutManager;
  private securityManager: SecurityManager;
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
    this.shortcutManager = new PromptShortcutManager(logger);
    this.securityManager = new SecurityManager(config.security, logger);

    this.setupToolHandlers();
    this.setupErrorHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'parse_shortcut',
          description: 'Parse user input for shortcut commands and expand them',
          inputSchema: {
            type: 'object',
            properties: {
              input: {
                type: 'string',
                description: 'User input that may contain shortcut commands like /th or /ider'
              }
            },
            required: ['input']
          }
        },
        {
          name: 'list_shortcuts',
          description: 'List all available prompt shortcuts with optional filtering',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter by category',
                enum: ['thinking', 'writing', 'coding', 'explaining', 'analysis', 'creative', 'productivity', 'personal']
              },
              search: {
                type: 'string',
                description: 'Search shortcuts by name, command, or description'
              },
              favorites: {
                type: 'boolean',
                description: 'Show only favorite shortcuts'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of shortcuts to return'
              }
            }
          }
        },
        {
          name: 'create_shortcut',
          description: 'Create a new custom prompt shortcut',
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'Shortcut command (e.g., "/th", "/myshortcut")'
              },
              name: {
                type: 'string',
                description: 'Display name for the shortcut'
              },
              description: {
                type: 'string',
                description: 'Description of what this shortcut does'
              },
              prompt: {
                type: 'string',
                description: 'The prompt template with {input} placeholder'
              },
              category: {
                type: 'string',
                description: 'Category for organization',
                enum: ['thinking', 'writing', 'coding', 'explaining', 'analysis', 'creative', 'productivity', 'personal']
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Tags for categorization'
              }
            },
            required: ['command', 'prompt']
          }
        },
        {
          name: 'update_shortcut',
          description: 'Update an existing shortcut',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'ID of the shortcut to update'
              },
              command: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              prompt: { type: 'string' },
              category: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } },
              isFavorite: { type: 'boolean' }
            },
            required: ['id']
          }
        },
        {
          name: 'delete_shortcut',
          description: 'Delete a shortcut',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'ID of the shortcut to delete'
              },
              confirm: {
                type: 'boolean',
                description: 'Confirmation flag'
              }
            },
            required: ['id', 'confirm']
          }
        },
        {
          name: 'get_shortcut_details',
          description: 'Get detailed information about a specific shortcut',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Shortcut ID'
              }
            },
            required: ['id']
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
          case 'parse_shortcut':
            return await this.handleParseShortcut(args);
          
          case 'list_shortcuts':
            return await this.handleListShortcuts(args);
          
          case 'create_shortcut':
            return await this.handleCreateShortcut(args);
          
          case 'update_shortcut':
            return await this.handleUpdateShortcut(args);
          
          case 'delete_shortcut':
            return await this.handleDeleteShortcut(args);
          
          case 'get_shortcut_details':
            return await this.handleGetShortcutDetails(args);
          
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

  private async handleParseShortcut(args: any): Promise<CallToolResult> {
    if (!args?.input) {
      throw new Error('Input is required');
    }

    this.logger.debug('Parsing shortcut:', { input: args.input });

    const parsed = this.shortcutManager.parseCommand(args.input);
    
    if (!parsed.isShortcut) {
      return {
        content: [
          {
            type: 'text',
            text: `No shortcut detected in: "${args.input}"`
          } as TextContent
        ]
      };
    }

    const execution = this.shortcutManager.executeShortcut(parsed);
    
    return {
      content: [
        {
          type: 'text',
          text: `🔧 Shortcut Expanded: ${parsed.command}\n\n**Expanded Prompt:**\n${execution.expandedPrompt}`
        } as TextContent
      ]
    };
  }

  private async handleListShortcuts(args: any): Promise<CallToolResult> {
    this.logger.debug('Listing shortcuts with args:', args);
    
    const shortcuts = this.shortcutManager.listShortcuts({
      category: args?.category as ShortcutCategory,
      search: args?.search,
      favorites: args?.favorites,
      limit: args?.limit || 50
    });

    if (shortcuts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No shortcuts found. Create your first shortcut with the create_shortcut tool!'
          } as TextContent
        ]
      };
    }

    let response = `Found ${shortcuts.length} shortcut(s):\n\n`;
    
    shortcuts.forEach((shortcut, index) => {
      response += `${index + 1}. **${shortcut.command}** - ${shortcut.name}`;
      if (shortcut.isFavorite) response += ' ⭐';
      response += `\n   ${shortcut.description}\n`;
      response += `   Category: ${shortcut.category} | Uses: ${shortcut.usageCount}\n`;
      if (shortcut.tags.length > 0) {
        response += `   Tags: ${shortcut.tags.join(', ')}\n`;
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

  private async handleCreateShortcut(args: any): Promise<CallToolResult> {
    if (!args?.command || !args?.prompt) {
      throw new Error('Command and prompt are required');
    }

    this.logger.info('Creating shortcut:', { command: args.command });

    const shortcut = this.shortcutManager.createShortcut({
      command: args.command,
      name: args.name,
      description: args.description,
      prompt: args.prompt,
      category: args.category as ShortcutCategory,
      tags: args.tags || [],
      author: 'aezi zhu'
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Created shortcut: **${shortcut.command}** - ${shortcut.name}\n\n**Prompt:** ${shortcut.prompt}\n\n**Usage:** Type "${shortcut.command} [your input]" to use this shortcut.`
        } as TextContent
      ]
    };
  }

  private async handleUpdateShortcut(args: any): Promise<CallToolResult> {
    if (!args?.id) {
      throw new Error('Shortcut ID is required');
    }

    this.logger.info('Updating shortcut:', { id: args.id });

    const updated = this.shortcutManager.updateShortcut(args.id, args);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Updated shortcut: **${updated.command}** - ${updated.name}`
        } as TextContent
      ]
    };
  }

  private async handleDeleteShortcut(args: any): Promise<CallToolResult> {
    if (!args?.id) {
      throw new Error('Shortcut ID is required');
    }

    if (!args.confirm) {
      throw new Error('Confirmation required. Set confirm=true to delete.');
    }

    this.logger.info('Deleting shortcut:', { id: args.id });

    const success = this.shortcutManager.deleteShortcut(args.id);

    if (success) {
      return {
        content: [
          {
            type: 'text',
            text: `✅ Shortcut deleted successfully`
          } as TextContent
        ]
      };
    } else {
      throw new Error('Shortcut not found');
    }
  }

  private async handleGetShortcutDetails(args: any): Promise<CallToolResult> {
    if (!args?.id) {
      throw new Error('Shortcut ID is required');
    }

    const shortcut = this.shortcutManager.getShortcut(args.id);
    if (!shortcut) {
      throw new Error('Shortcut not found');
    }

    let response = `**${shortcut.command}** - ${shortcut.name}\n\n`;
    response += `**Description:** ${shortcut.description}\n`;
    response += `**Category:** ${shortcut.category}\n`;
    response += `**Prompt Template:** ${shortcut.prompt}\n`;
    response += `**Usage Count:** ${shortcut.usageCount}\n`;
    response += `**Created:** ${shortcut.createdAt.toLocaleDateString()}\n`;
    response += `**Updated:** ${shortcut.updatedAt.toLocaleDateString()}\n`;
    
    if (shortcut.tags.length > 0) {
      response += `**Tags:** ${shortcut.tags.join(', ')}\n`;
    }
    
    if (shortcut.author) {
      response += `**Author:** ${shortcut.author}\n`;
    }

    return {
      content: [
        {
          type: 'text',
          text: response
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
    
    this.logger.info('Starting Prompt Shortcut MCP Server...', {
      name: this.config.server.name,
      version: this.config.server.version
    });

    // Initialize shortcut manager
    await this.shortcutManager.initialize();

    await this.server.connect(transport);
    
    this.logger.info('Prompt Shortcut MCP Server connected and ready');
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping Prompt Shortcut MCP Server...');
    
    await this.server.close();
    
    this.logger.info('Prompt Shortcut MCP Server stopped');
  }
}
