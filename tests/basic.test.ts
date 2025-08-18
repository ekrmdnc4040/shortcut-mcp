/**
 * Basic tests for Shortcut MCP
 */

import { ShortcutManager } from '../src/shortcuts/manager';
import { SecurityManager } from '../src/security/manager';
import { createLogger } from '../src/utils/logger';
import { getDefaultConfig } from '../src/utils/config';

describe('ShortcutManager', () => {
  let shortcutManager: ShortcutManager;
  let logger: any;

  beforeEach(() => {
    const config = getDefaultConfig();
    logger = createLogger(config.logging);
    shortcutManager = new ShortcutManager(config.shortcuts, logger);
  });

  test('should initialize without errors', async () => {
    // Mock the shortcuts CLI check
    jest.spyOn(require('child_process'), 'exec').mockImplementation((...args: any[]) => {
      const [cmd, callback] = args;
      if (cmd === 'which shortcuts') {
        callback(null, { stdout: '/usr/bin/shortcuts', stderr: '' });
      }
    });

    await expect(shortcutManager.initialize()).resolves.not.toThrow();
  });

  test('should handle shortcut listing', async () => {
    // Mock shortcuts list command
    jest.spyOn(require('child_process'), 'exec').mockImplementation((...args: any[]) => {
      const [cmd, callback] = args;
      if (cmd === 'shortcuts list') {
        callback(null, { stdout: 'Hello World\nEcho Input\nCurrent Time\n', stderr: '' });
      }
    });

    const shortcuts = await shortcutManager.listShortcuts();
    expect(shortcuts).toHaveLength(3);
    expect(shortcuts[0].name).toBe('Hello World');
  });
});

describe('SecurityManager', () => {
  let securityManager: SecurityManager;
  let logger: any;

  beforeEach(() => {
    const config = getDefaultConfig();
    logger = createLogger(config.logging);
    securityManager = new SecurityManager(config.security, logger);
  });

  test('should validate basic requests', () => {
    const request = {
      method: 'tools/call',
      params: {
        name: 'list_shortcuts',
        arguments: {}
      }
    };

    const result = securityManager.validateRequest(request);
    expect(result.allowed).toBe(true);
  });

  test('should block invalid requests', () => {
    const request = {
      method: 'invalid_method',
      params: {}
    };

    const result = securityManager.validateRequest(request);
    expect(result.allowed).toBe(false);
  });

  test('should validate shortcut permissions', () => {
    expect(securityManager.isShortcutAllowed('Hello World')).toBe(true);
    expect(securityManager.isShortcutAllowed('System Configuration')).toBe(false);
  });
});

describe('Configuration', () => {
  test('should load default configuration', () => {
    const config = getDefaultConfig();
    expect(config.server.name).toBe('shortcut-mcp');
    expect(config.server.version).toBe('1.0.0');
    expect(config.shortcuts.enableCache).toBe(true);
  });
});
