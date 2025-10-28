
/**
 * Save Hook Entry Point - PostToolUse
 * Standalone executable for plugin hooks
 */

import { saveHook } from '../../hooks/save.js';
import { stdin } from 'process';

// Read input from stdin
let input = '';
stdin.on('data', (chunk) => input += chunk);
stdin.on('end', async () => {
  const parsed = input.trim() ? JSON.parse(input) : undefined;
  await saveHook(parsed);
  // Let Node.js exit naturally - prevents UV_HANDLE_CLOSING assertion on Windows
});
