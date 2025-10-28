
/**
 * New Hook Entry Point - UserPromptSubmit
 * Standalone executable for plugin hooks
 */

import { newHook } from '../../hooks/new.js';
import { stdin } from 'process';

// Read input from stdin
let input = '';
stdin.on('data', (chunk) => input += chunk);
stdin.on('end', async () => {
  const parsed = input.trim() ? JSON.parse(input) : undefined;
  await newHook(parsed);
  // Let Node.js exit naturally - prevents UV_HANDLE_CLOSING assertion on Windows
});
