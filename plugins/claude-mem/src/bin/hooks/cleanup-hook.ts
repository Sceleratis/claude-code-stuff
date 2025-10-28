
/**
 * Cleanup Hook Entry Point - SessionEnd
 * Standalone executable for plugin hooks
 */

import { cleanupHook } from '../../hooks/cleanup.js';
import { stdin } from 'process';

// Read input from stdin
let input = '';
stdin.on('data', (chunk) => input += chunk);
stdin.on('end', async () => {
  try {
    const parsed = input.trim() ? JSON.parse(input) : undefined;
    await cleanupHook(parsed);
    // Don't explicitly exit - let Node.js exit naturally
    // This ensures stdin handlers close gracefully before process exit
    // Prevents UV_HANDLE_CLOSING assertion errors on Windows
  } catch (error: any) {
    console.error(`[claude-mem cleanup-hook error: ${error.message}]`);
    console.log('{"continue": true, "suppressOutput": true}');
    // Don't explicitly exit - let Node.js exit naturally
    // This ensures stdin handlers close gracefully before process exit
    // Prevents UV_HANDLE_CLOSING assertion errors on Windows
  }
});
