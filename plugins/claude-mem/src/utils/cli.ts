/**
 * CLI utilities for finding and interacting with Claude Code executable
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir, platform } from 'os';
import { logger } from './logger.js';

/**
 * Find Claude Code executable dynamically
 * 
 * Searches for the Claude Code executable in the following order:
 * 1. CLAUDE_CODE_PATH environment variable
 * 2. System PATH via which/where command
 * 3. Common installation paths
 * 
 * @returns Path to Claude Code executable
 * @throws Error if Claude Code executable cannot be found
 */
export function findClaudeExecutable(): string {
  // First check environment variable
  if (process.env.CLAUDE_CODE_PATH) {
    if (existsSync(process.env.CLAUDE_CODE_PATH)) {
      return process.env.CLAUDE_CODE_PATH;
    }
    logger.warn('SYSTEM', 'CLAUDE_CODE_PATH set but file not found', { path: process.env.CLAUDE_CODE_PATH });
  }

  // Try using 'which' or 'where' command
  try {
    const command = platform() === 'win32' ? 'where claude' : 'which claude';
    const result = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (result && existsSync(result.split('\n')[0])) {
      return result.split('\n')[0];
    }
  } catch (err) {
    // Command failed, continue to search common paths
  }

  // Search common installation paths
  const commonPaths = platform() === 'win32' ? [
    join(homedir(), '.local', 'bin', 'claude.exe'),
    join(homedir(), 'AppData', 'Local', 'Programs', 'claude', 'claude.exe'),
    'C:\Program Files\Claude\claude.exe',
  ] : [
    '/usr/local/bin/claude',
    '/usr/bin/claude',
    join(homedir(), '.local', 'bin', 'claude'),
    join(homedir(), 'bin', 'claude'),
  ];

  for (const path of commonPaths) {
    if (existsSync(path)) {
      logger.info('SYSTEM', 'Found Claude executable', { path });
      return path;
    }
  }

  // Not found
  throw new Error(
    'Claude Code executable not found. Please either:\n' +
    '  1. Ensure "claude" is in your PATH\n' +
    '  2. Set CLAUDE_CODE_PATH environment variable to the full path to claude executable\n' +
    '  3. Install Claude Code via the official installer'
  );
}
