/**
 * Storage
 * Handles saving and loading context summaries
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

export interface ContextFile {
  filename: string;
  path: string;
  timestamp: Date;
  description: string;
}

/**
 * Get the context directory path
 */
export function getContextDir(projectRoot: string): string {
  return join(projectRoot, '.claude', 'context');
}

/**
 * Ensure context directory exists
 */
export function ensureContextDir(projectRoot: string): string {
  const contextDir = getContextDir(projectRoot);

  if (!existsSync(contextDir)) {
    mkdirSync(contextDir, { recursive: true });
  }

  return contextDir;
}

/**
 * Generate filename with timestamp and description
 * Format: yyyyMMDD-HHmm - description.md
 */
export function generateFilename(description: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  const timestamp = `${year}${month}${day}-${hour}${minute}`;
  const safeDescription = description
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 50);

  return `${timestamp} - ${safeDescription}.md`;
}

/**
 * Format summary as markdown document
 */
export function formatSummary(
  summary: string,
  metadata: {
    description: string;
    messageCount: number;
    compressionRatio: string;
  }
): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

  return `# Context Summary - ${metadata.description}

**Date**: ${dateStr} ${timeStr}
**Messages Processed**: ${metadata.messageCount}
**Compression Ratio**: ${metadata.compressionRatio}

---

${summary}
`;
}

/**
 * Save summary to context directory
 */
export function saveSummary(
  projectRoot: string,
  summary: string,
  description: string,
  messageCount: number,
  originalTokens: number,
  summaryTokens: number
): string {
  const contextDir = ensureContextDir(projectRoot);
  const filename = generateFilename(description);
  const filepath = join(contextDir, filename);

  const compressionRatio = `${originalTokens}:${summaryTokens} (${Math.round((1 - summaryTokens / originalTokens) * 100)}% reduction)`;

  const content = formatSummary(summary, {
    description,
    messageCount,
    compressionRatio
  });

  writeFileSync(filepath, content, 'utf-8');

  return filepath;
}

/**
 * List all context files in directory
 */
export function listContextFiles(projectRoot: string): ContextFile[] {
  const contextDir = getContextDir(projectRoot);

  if (!existsSync(contextDir)) {
    return [];
  }

  const files = readdirSync(contextDir)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const filepath = join(contextDir, filename);
      const stats = statSync(filepath);

      // Parse filename: yyyyMMDD-HHmm - description.md
      const match = filename.match(/^(\d{8})-(\d{4}) - (.+)\.md$/);
      let timestamp = stats.mtime;
      let description = filename.replace('.md', '');

      if (match) {
        const [, dateStr, timeStr, desc] = match;
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        const hour = parseInt(timeStr.substring(0, 2));
        const minute = parseInt(timeStr.substring(2, 4));

        timestamp = new Date(year, month, day, hour, minute);
        description = desc;
      }

      return {
        filename,
        path: filepath,
        timestamp,
        description
      };
    });

  // Sort by timestamp, newest first
  files.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return files;
}

/**
 * Load context file content
 */
export function loadContext(filepath: string): string {
  return readFileSync(filepath, 'utf-8');
}

/**
 * Get most recent context file
 */
export function getMostRecentContext(projectRoot: string): ContextFile | null {
  const files = listContextFiles(projectRoot);
  return files.length > 0 ? files[0] : null;
}
