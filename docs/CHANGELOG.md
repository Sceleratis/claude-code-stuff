# Changelog

All notable changes to this marketplace will be documented in this file.

## [2025-10-27] - Marketplace Creation and Initial Setup

### Added
- Created Claude Code marketplace structure with `.claude-plugin/marketplace.json`
- Added `plugins/` directory for plugin distribution
- Migrated `claude-mem` v4.2.1 plugin from standalone repository
- Created comprehensive README.md with installation and usage instructions
- Added migration documentation in `.claude/memory/plans/`

### Changed
- Updated marketplace owner to "Sceleratis"
- Set homepage to https://github.com/Sceleratis/claude-code-stuff

### Plugin: claude-mem v4.2.1
- **Added**: Full plugin with all source code, build scripts, and configuration
- **Built**: All hook scripts compiled successfully:
  - context-hook.js (29 KB) - SessionStart hook for context injection
  - new-hook.js (27 KB) - UserPromptSubmit hook for session initialization
  - save-hook.js (27 KB) - PostToolUse hook for observation capture
  - summary-hook.js (27 KB) - Stop hook for summary generation
  - cleanup-hook.js (28 KB) - SessionEnd hook for graceful cleanup
  - worker-service.cjs (1.1 MB) - PM2-managed background worker
  - search-server.js (273 KB) - MCP search server with 8 tools
- **Features**:
  - Persistent memory compression across sessions
  - Automatic context injection from previous sessions
  - SQLite storage with FTS5 full-text search
  - PM2-managed async worker service
  - MCP search server integration
  - 5 lifecycle hooks for comprehensive session tracking
- **Tech**: TypeScript, Node.js 18+, SQLite3, Express.js, PM2, Claude Agent SDK
- **License**: AGPL-3.0

### Technical Details
- All plugins use `${CLAUDE_PLUGIN_ROOT}` for path resolution
- Build system uses esbuild for hook compilation
- Dependencies installed and verified (399 packages)
- Plugin source preserved with full git history

### Documentation
- Main README with marketplace overview and installation instructions
- Migration plan document (202510271327-marketplace-migration.md)
- Individual plugin documentation preserved
- CLAUDE.md files maintained for AI assistant guidance

### Repository Structure
```
claude-code-stuff/
├── .claude-plugin/
│   └── marketplace.json
├── .claude/
│   └── memory/
│       └── plans/
├── plugins/
│   └── claude-mem/
├── docs/
│   └── CHANGELOG.md
├── README.md
├── LICENSE
└── .gitignore
```

---

## Future Plans

- Add more plugins as they are developed
- Create automated testing for marketplace installations
- Add CI/CD pipeline for plugin builds
- Create marketplace website/landing page
