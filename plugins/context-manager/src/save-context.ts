#!/usr/bin/env node

/**
 * Save Context Script
 * Reads conversation history, chunks it, recursively summarizes, and saves to .claude/context/
 */

import { readFileSync, existsSync } from 'fs';
import { parseConversation, chunkMessages } from './lib/chunker.js';
import { Summarizer } from './lib/summarizer.js';
import { saveSummary } from './lib/storage.js';

interface SaveContextOptions {
  conversationFile: string;
  description: string;
  projectRoot: string;
  apiKey?: string;
}

/**
 * Main function to save context
 */
async function saveContext(options: SaveContextOptions): Promise<void> {
  console.log('🔄 Starting context save process...\n');

  // Validate inputs
  if (!existsSync(options.conversationFile)) {
    throw new Error(`Conversation file not found: ${options.conversationFile}`);
  }

  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }

  // Step 1: Read and parse conversation
  console.log('📖 Reading conversation file...');
  const conversationText = readFileSync(options.conversationFile, 'utf-8');

  console.log('🔍 Parsing conversation...');
  const messages = parseConversation(conversationText);
  console.log(`   Found ${messages.length} messages\n`);

  if (messages.length === 0) {
    throw new Error('No messages found in conversation file');
  }

  // Step 2: Chunk messages
  console.log('✂️  Chunking conversation...');
  const chunks = chunkMessages(messages, 6000);
  console.log(`   Created ${chunks.length} chunks`);
  const totalTokens = chunks.reduce((sum, c) => sum + c.tokenEstimate, 0);
  console.log(`   Total estimated tokens: ${totalTokens}\n`);

  // Step 3: Recursively summarize
  console.log('🤖 Starting recursive summarization...');
  const summarizer = new Summarizer({
    apiKey,
    targetSummaryTokens: 5000
  });

  const summary = await summarizer.recursiveSummarize(chunks, (status) => {
    console.log(`   ${status}`);
  });

  console.log(`\n✅ Summarization complete!`);
  console.log(`   Summary tokens: ${summary.tokenEstimate}`);
  console.log(`   Compression: ${totalTokens}:${summary.tokenEstimate} (${Math.round((1 - summary.tokenEstimate / totalTokens) * 100)}% reduction)\n`);

  // Step 4: Save to file
  console.log('💾 Saving summary...');
  const filepath = saveSummary(
    options.projectRoot,
    summary.text,
    options.description,
    messages.length,
    totalTokens,
    summary.tokenEstimate
  );

  console.log(`   ✅ Saved to: ${filepath}\n`);
  console.log('🎉 Context save complete!\n');
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node save-context.js <conversation-file> <description> [project-root]');
    console.error('');
    console.error('Example:');
    console.error('  node save-context.js /tmp/conversation.txt "Feature implementation" /path/to/project');
    process.exit(1);
  }

  const [conversationFile, description, projectRoot = process.cwd()] = args;

  try {
    await saveContext({
      conversationFile,
      description,
      projectRoot
    });
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}

export { saveContext, SaveContextOptions };
