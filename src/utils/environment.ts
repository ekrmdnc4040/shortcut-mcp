/**
 * Environment validation utilities
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';
import { EnvironmentValidation } from '../types/config.js';

const execAsync = promisify(exec);

export async function validateEnvironment(): Promise<EnvironmentValidation> {
  const validation: EnvironmentValidation = {
    valid: true,
    errors: [],
    warnings: [],
    platform: platform(),
    nodeVersion: process.version,
    shortcutsAvailable: false
  };

  // Check platform
  if (validation.platform !== 'darwin') {
    validation.errors.push('This MCP server only works on macOS');
    validation.valid = false;
  }

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    validation.errors.push(`Node.js 18+ required, found ${nodeVersion}`);
    validation.valid = false;
  }

  // Check macOS version
  if (validation.platform === 'darwin') {
    try {
      const { stdout } = await execAsync('sw_vers -productVersion');
      const macosVersion = stdout.trim();
      const majorVersion = parseInt(macosVersion.split('.')[0]);
      
      if (majorVersion < 12) {
        validation.errors.push(`macOS 12+ required for Shortcuts support, found ${macosVersion}`);
        validation.valid = false;
      } else {
        validation.warnings.push(`Running on macOS ${macosVersion}`);
      }
    } catch (error) {
      validation.warnings.push('Could not determine macOS version');
    }
  }

  // Check shortcuts CLI availability
  try {
    await execAsync('which shortcuts');
    validation.shortcutsAvailable = true;
    
    // Test shortcuts command
    try {
      await execAsync('shortcuts list');
      validation.warnings.push('Shortcuts CLI is working');
    } catch (error) {
      validation.errors.push('Shortcuts CLI found but not accessible. Check permissions.');
      validation.valid = false;
    }
  } catch (error) {
    validation.errors.push('macOS shortcuts CLI not found. Ensure Shortcuts app is installed.');
    validation.valid = false;
  }

  // Check for Shortcuts app
  try {
    await execAsync('ls /System/Applications/Shortcuts.app');
    validation.warnings.push('Shortcuts app found');
  } catch (error) {
    validation.warnings.push('Shortcuts app not found in expected location');
  }

  // Check permissions
  try {
    // This is a basic check - more sophisticated permission checking could be added
    await execAsync('osascript -e "tell application \\"System Events\\" to get name"');
    validation.warnings.push('Basic automation permissions available');
  } catch (error) {
    validation.warnings.push('Automation permissions may need to be granted');
  }

  return validation;
}

export function checkDependencies(): string[] {
  const missing: string[] = [];
  
  try {
    require('@modelcontextprotocol/sdk');
  } catch {
    missing.push('@modelcontextprotocol/sdk');
  }
  
  return missing;
}

export async function getSystemInfo(): Promise<Record<string, any>> {
  const info: Record<string, any> = {
    platform: platform(),
    nodeVersion: process.version,
    arch: process.arch,
    pid: process.pid,
    uptime: process.uptime()
  };

  if (platform() === 'darwin') {
    try {
      const { stdout: macosVersion } = await execAsync('sw_vers -productVersion');
      info.macosVersion = macosVersion.trim();
    } catch {
      info.macosVersion = 'unknown';
    }

    try {
      const { stdout: shortcutsVersion } = await execAsync('shortcuts --version');
      info.shortcutsVersion = shortcutsVersion.trim();
    } catch {
      info.shortcutsVersion = 'not available';
    }
  }

  return info;
}
