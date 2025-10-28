// =============================================================================
// DEPRECATION NOTICE: This module is not in active use
// =============================================================================
// The architecture has evolved to use SessionStore directly instead of this
// abstraction layer. The IStorageProvider interface and SQLiteStorageProvider
// class are preserved for reference and potential future use, but are not
// currently implemented or functional.
//
// MIGRATION GUIDE:
// - Instead of: getStorageProvider() [REMOVED - was non-functional]
// - Use: SessionStore directly from '../services/sqlite/SessionStore.js'
//
// The getStorageProvider() singleton function has been removed (v4.2.1) as it
// unconditionally threw errors and had no active callers in the codebase.
// =============================================================================

import {
  SessionInput,
  MemoryInput,
  OverviewInput,
  DiagnosticInput,
  SessionRow,
  MemoryRow,
  OverviewRow,
  DiagnosticRow,
} from '../services/sqlite/types.js';

/**
 * Storage backend types
 */
export type StorageBackend = 'sqlite' | 'jsonl';

/**
 * Unified interface for storage operations
 * NOTE: This is a reference interface - use SessionStore directly in practice
 */
export interface IStorageProvider {
  backend: StorageBackend;
  
  // Session operations
  createSession(session: SessionInput): Promise<SessionRow | void>;
  getSession(sessionId: string): Promise<SessionRow | null>;
  hasSession(sessionId: string): Promise<boolean>;
  getAllSessionIds(): Promise<Set<string>>;
  getRecentSessions(limit?: number): Promise<SessionRow[]>;
  getRecentSessionsForProject(project: string, limit?: number): Promise<SessionRow[]>;
  
  // Memory operations
  createMemory(memory: MemoryInput): Promise<MemoryRow | void>;
  createMemories(memories: MemoryInput[]): Promise<void>;
  getRecentMemories(limit?: number): Promise<MemoryRow[]>;
  getRecentMemoriesForProject(project: string, limit?: number): Promise<MemoryRow[]>;
  hasDocumentId(documentId: string): Promise<boolean>;
  
  // Overview operations
  createOverview(overview: OverviewInput): Promise<OverviewRow | void>;
  upsertOverview(overview: OverviewInput): Promise<OverviewRow | void>;
  getRecentOverviews(limit?: number): Promise<OverviewRow[]>;
  getRecentOverviewsForProject(project: string, limit?: number): Promise<OverviewRow[]>;
  
  // Diagnostic operations
  createDiagnostic(diagnostic: DiagnosticInput): Promise<DiagnosticRow | void>;
  
  // Health check
  isAvailable(): Promise<boolean>;
}

/**
 * SQLite-based storage provider
 * NOTE: This class is not currently implemented - use SessionStore directly
 * Kept as a reference interface for potential future abstraction needs
 */
export class SQLiteStorageProvider implements IStorageProvider {
  public readonly backend = 'sqlite';

  async isAvailable(): Promise<boolean> {
    throw new Error('SQLiteStorageProvider is not currently implemented. Use SessionStore directly.');
  }

  async createSession(_session: SessionInput): Promise<SessionRow> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getSession(_sessionId: string): Promise<SessionRow | null> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async hasSession(_sessionId: string): Promise<boolean> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getAllSessionIds(): Promise<Set<string>> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getRecentSessions(_limit = 5): Promise<SessionRow[]> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getRecentSessionsForProject(_project: string, _limit = 5): Promise<SessionRow[]> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async createMemory(_memory: MemoryInput): Promise<MemoryRow> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async createMemories(_memories: MemoryInput[]): Promise<void> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getRecentMemories(_limit = 10): Promise<MemoryRow[]> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getRecentMemoriesForProject(_project: string, _limit = 10): Promise<MemoryRow[]> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async hasDocumentId(_documentId: string): Promise<boolean> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async createOverview(_overview: OverviewInput): Promise<OverviewRow> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async upsertOverview(_overview: OverviewInput): Promise<OverviewRow> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getRecentOverviews(_limit = 5): Promise<OverviewRow[]> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async getRecentOverviewsForProject(_project: string, _limit = 5): Promise<OverviewRow[]> {
    throw new Error('Not implemented - use SessionStore directly');
  }

  async createDiagnostic(_diagnostic: DiagnosticInput): Promise<DiagnosticRow> {
    throw new Error('Not implemented - use SessionStore directly');
  }
}
