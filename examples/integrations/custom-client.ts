/**
 * Example of integrating Prompt Shortcut MCP with a custom client
 */

import { MCPClient } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

export class PromptShortcutClient {
  private client: MCPClient;
  private transport: StdioClientTransport;

  constructor(serverPath: string) {
    // Initialize transport
    this.transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath]
    });

    // Initialize client
    this.client = new MCPClient({
      name: 'custom-prompt-client',
      version: '1.0.0'
    });
  }

  async initialize() {
    await this.client.connect(this.transport);
    console.log('Connected to Prompt Shortcut MCP server');
  }

  /**
   * Parse input for shortcuts and expand them
   */
  async expandShortcuts(input: string): Promise<string> {
    try {
      const result = await this.client.callTool('parse_shortcut', { input });
      
      if (result.content && result.content[0] && result.content[0].type === 'text') {
        const text = result.content[0].text;
        
        // Extract expanded prompt from response
        const match = text.match(/\*\*Expanded Prompt:\*\*\s*(.+)$/s);
        if (match) {
          return match[1].trim();
        }
      }
      
      // If no shortcut detected, return original input
      return input;
    } catch (error) {
      console.error('Failed to expand shortcuts:', error);
      return input;
    }
  }

  /**
   * List available shortcuts
   */
  async listShortcuts(category?: string): Promise<any[]> {
    try {
      const args = category ? { category } : {};
      const result = await this.client.callTool('list_shortcuts', args);
      return result.content || [];
    } catch (error) {
      console.error('Failed to list shortcuts:', error);
      return [];
    }
  }

  /**
   * Create a new shortcut
   */
  async createShortcut(shortcut: {
    command: string;
    name: string;
    description: string;
    prompt: string;
    category?: string;
    tags?: string[];
  }): Promise<boolean> {
    try {
      await this.client.callTool('create_shortcut', shortcut);
      return true;
    } catch (error) {
      console.error('Failed to create shortcut:', error);
      return false;
    }
  }

  async close() {
    await this.client.close();
  }
}

// Usage example
async function example() {
  const client = new PromptShortcutClient('/path/to/shortcut-mcp/dist/index.js');
  
  try {
    await client.initialize();
    
    // Expand shortcuts in user input
    const userInput = '/th How can we improve renewable energy efficiency?';
    const expandedPrompt = await client.expandShortcuts(userInput);
    console.log('Expanded:', expandedPrompt);
    
    // List available shortcuts
    const shortcuts = await client.listShortcuts('thinking');
    console.log('Thinking shortcuts:', shortcuts);
    
    // Create a custom shortcut
    await client.createShortcut({
      command: '/analyze',
      name: 'Deep Analysis',
      description: 'Perform comprehensive analysis',
      prompt: 'Analyze the following topic comprehensively, considering multiple perspectives, potential implications, and providing actionable insights: {input}',
      category: 'analysis',
      tags: ['deep-thinking', 'comprehensive']
    });
    
  } finally {
    await client.close();
  }
}

// For web applications
export class WebPromptShortcutClient {
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  async expandShortcuts(input: string): Promise<string> {
    try {
      const response = await fetch(`${this.serverUrl}/mcp/tools/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'tools/call',
          params: {
            name: 'parse_shortcut',
            arguments: { input }
          }
        })
      });

      const result = await response.json();
      
      if (result.content && result.content[0] && result.content[0].type === 'text') {
        const text = result.content[0].text;
        const match = text.match(/\*\*Expanded Prompt:\*\*\s*(.+)$/s);
        if (match) {
          return match[1].trim();
        }
      }
      
      return input;
    } catch (error) {
      console.error('Failed to expand shortcuts:', error);
      return input;
    }
  }
}

export default PromptShortcutClient;
