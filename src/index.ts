#!/usr/bin/env node

/**
 * Shortcut MCP Server Entry Point
 * 
 * This is the main entry point for the Shortcut MCP server that enables
 * Large Language Models to interact with macOS Shortcuts through the
 * Model Context Protocol.
 */

import { Command } from 'commander';
import { PromptShortcutMCPServer } from './server-prompt';
import { loadConfig } from './utils/config';
import { createLogger } from './utils/logger';
import { validateEnvironment } from './utils/environment';

const program = new Command();

program
  .name('shortcut-mcp')
  .description('Model Context Protocol server for macOS Shortcuts')
  .version('1.0.0')
  .option('-c, --config <path>', 'Configuration file path', 'config/default.json')
  .option('-l, --log-level <level>', 'Log level (debug, info, warn, error)', 'info')
  .option('-p, --port <number>', 'Server port (for HTTP transport)')
  .option('--stdio', 'Use stdio transport (default)', true)
  .option('--http', 'Use HTTP transport')
  .option('--debug', 'Enable debug mode')
  .parse();

async function main(): Promise<void> {
  const options = program.opts();
  
  try {
    // Load configuration
    const config = await loadConfig(options.config);
    
    // Override config with CLI options
    if (options.logLevel) {
      config.logging.level = options.logLevel;
    }
    
    if (options.debug) {
      config.logging.level = 'debug';
      config.logging.enableDebug = true;
    }
    
    // Initialize logger
    const logger = createLogger(config.logging);
    
    // Validate environment
    const envCheck = await validateEnvironment();
    if (!envCheck.valid) {
      logger.error('Environment validation failed:', envCheck.errors);
      process.exit(1);
    }
    
    logger.info('Starting Shortcut MCP Server...', {
      version: '1.0.0',
      config: options.config,
      logLevel: config.logging.level
    });
    
    // Create and start server
    const server = new PromptShortcutMCPServer(config, logger);
    
    // Handle graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      await server.stop();
      process.exit(0);
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    
    // Start the server
    await server.start();
    
    logger.info('Shortcut MCP Server started successfully');
    
    // Keep the process running
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', reason);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { PromptShortcutMCPServer } from './server-prompt';
export * from './types';
export * from './utils';
