# Claude Code Marketplace

Personal marketplace for Claude Code plugins, agents, and extensions.

## About

This repository serves as a custom marketplace for Claude Code, providing a centralized location for installing and managing personal plugins and extensions.

## Structure

```
claude-code-stuff/
├── .claude-plugin/
│   └── marketplace.json       # Marketplace registry
├── plugins/
│   └── claude-mem/           # Memory compression plugin
└── README.md
```

## Available Plugins

### claude-mem (v4.2.1)

**Persistent memory system for Claude Code**

Automatically captures tool usage, generates semantic summaries, and restores context across sessions. Features include:

- Session continuity with automatic context injection
- PM2-managed worker service for async processing
- MCP search server with 8 specialized search tools
- SQLite storage with full-text search (FTS5)
- 5 lifecycle hooks for comprehensive session tracking

**Tech Stack**: TypeScript, Node.js 18+, SQLite3, Express.js, PM2, Claude Agent SDK

**License**: AGPL-3.0

[View plugin documentation](./plugins/claude-mem/README.md)

## Installation

### Install Entire Marketplace

```bash
# Install from local path
claude plugin install /path/to/claude-code-stuff

# Or install from GitHub (when published)
claude plugin install https://github.com/Sceleratis/claude-code-stuff
```

### Install Individual Plugin

```bash
# Navigate to the marketplace directory
cd claude-code-stuff

# Install specific plugin
claude plugin install ./plugins/claude-mem
```

## Adding New Plugins

To add a new plugin to this marketplace:

1. Create plugin directory: `plugins/your-plugin-name/`
2. Add plugin files to: `plugins/your-plugin-name/plugin/`
3. Update `.claude-plugin/marketplace.json`:

```json
{
  "plugins": [
    {
      "name": "your-plugin-name",
      "version": "1.0.0",
      "source": "./plugins/your-plugin-name/plugin",
      "description": "Your plugin description"
    }
  ]
}
```

4. Build and test your plugin
5. Commit changes

## Development

Each plugin in this marketplace maintains its own:
- Source code (`src/`)
- Build scripts (`scripts/`)
- Dependencies (`package.json`)
- Documentation (`README.md`, `CLAUDE.md`)
- Configuration files

Build plugins individually:

```bash
cd plugins/your-plugin-name
npm install
npm run build
```

## Repository Structure

- **`.claude-plugin/`** - Marketplace configuration and registry
- **`plugins/`** - Individual plugin directories
- **`.claude/memory/`** - Development notes and migration docs
- **`README.md`** - This file
- **`LICENSE`** - Repository license
- **`.gitignore`** - Git ignore patterns

## License

See individual plugin licenses. Main repository uses the same license structure.

## Author

**Sceleratis**

## Contributing

This is a personal marketplace. Feel free to fork and adapt for your own use.

## Support

For issues with specific plugins, see their individual documentation:
- [claude-mem issues](./plugins/claude-mem/README.md)

For marketplace structure issues, open an issue in this repository.
