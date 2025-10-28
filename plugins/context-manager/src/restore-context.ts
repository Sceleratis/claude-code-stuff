#!/usr/bin/env node

/**
 * Restore Context Script
 * Lists and loads context summaries from .claude/context/
 */

import { listContextFiles, loadContext, getMostRecentContext } from './lib/storage.js';

interface RestoreContextOptions {
  projectRoot: string;
  filename?: string;
  list?: boolean;
}

/**
 * List available context files
 */
function listAvailableContexts(projectRoot: string): void {
  const files = listContextFiles(projectRoot);

  if (files.length === 0) {
    console.log('No saved context files found.\n');
    return;
  }

  console.log(`\n📁 Available Context Files (${files.length}):\n`);

  files.forEach((file, index) => {
    const date = file.timestamp.toLocaleDateString();
    const time = file.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(`${index + 1}. ${file.filename}`);
    console.log(`   📅 ${date} ${time}`);
    console.log(`   📝 ${file.description}`);
    console.log('');
  });
}

/**
 * Restore context from a file
 */
function restoreContext(options: RestoreContextOptions): void {
  const files = listContextFiles(options.projectRoot);

  if (files.length === 0) {
    console.log('No saved context files found.\n');
    return;
  }

  let selectedFile = files[0]; // Default to most recent

  if (options.filename) {
    const found = files.find(f => f.filename === options.filename);
    if (!found) {
      console.error(`❌ Context file not found: ${options.filename}\n`);
      console.log('Available files:');
      listAvailableContexts(options.projectRoot);
      process.exit(1);
    }
    selectedFile = found;
  }

  console.log(`\n📖 Loading context: ${selectedFile.filename}\n`);

  const content = loadContext(selectedFile.path);

  console.log('─'.repeat(80));
  console.log(content);
  console.log('─'.repeat(80));
  console.log(`\n✅ Context loaded successfully!\n`);
}

/**
 * CLI entry point
 */
function main() {
  const args = process.argv.slice(2);
  const projectRoot = process.cwd();

  // Parse flags
  const list = args.includes('--list') || args.includes('-l');
  const filenameIndex = args.findIndex(arg => !arg.startsWith('--') && !arg.startsWith('-'));
  const filename = filenameIndex >= 0 ? args[filenameIndex] : undefined;

  if (list) {
    listAvailableContexts(projectRoot);
  } else {
    restoreContext({
      projectRoot,
      filename
    });
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}

export { restoreContext, listAvailableContexts, RestoreContextOptions };
