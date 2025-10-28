# Context Manager Plugin

**Efficient context management with chunked conversation summarization for Claude Code**

## Overview

The Context Manager plugin solves a critical problem with Claude Code's built-in `/compact` command: it fails when the conversation history is too large. This plugin uses a chunked, recursive summarization approach to efficiently compress conversation history without overwhelming the context window.

## Features

- 🤖 **Claude-Powered**: Uses Claude's own context to create summaries (no API key needed!)
- 📝 **Progressive Summarization**: Breaks large contexts into logical sections
- 💾 **Persistent Storage**: Saves summaries to `.claude/context/` with timestamps
- 🔍 **Easy Restoration**: Quick access to previous context summaries
- 🎯 **Focused Extraction**: Captures key decisions, code changes, and next steps
- ⚡ **No External Dependencies**: Works entirely through Claude Code's built-in tools

## Installation

### Prerequisites

- Claude Code CLI installed
- That's it! No API keys or external dependencies needed

### Install Plugin

```bash
# From marketplace root
claude plugin install ./plugins/context-manager

# Or install marketplace
claude plugin install /path/to/claude-code-stuff
```

### Build from Source

```bash
cd plugins/context-manager
npm install
npm run build
```

## Usage

### Save Current Context

```bash
/save-context
```

**What it does:**
1. Asks for a brief description
2. Claude analyzes its own conversation context
3. Creates progressive summary in logical sections
4. Synthesizes final comprehensive summary
5. Saves to `.claude/context/yyyyMMDD-HHmm - description.md`

**Example:**
```
User: /save-context
Claude: "What would you like to call this context summary?"
User: "Feature implementation and testing"
Claude: [Analyzes conversation, creates structured summary]
Claude: "✅ Context saved to .claude/context/20251028-1120 - Feature implementation and testing.md"
```

### Restore Previous Context

```bash
/restore-context
```

**What it does:**
- Lists available context files (if needed)
- Loads most recent or specified context
- Displays summary in readable format
- Offers to continue where you left off

**Example:**
```
User: /restore-context
Claude: "I found your most recent context from Oct 28, 11:20 AM (Feature implementation):"
Claude: [Displays the full summary]
Claude: "Would you like to continue where we left off?"
```

## How It Works

### The Problem

Claude Code's `/compact` tries to process the entire conversation at once, which can overwhelm the context window and fail.

### Our Solution

**Claude-powered progressive summarization:**
```
User invokes /save-context
       ↓
Claude analyzes its own context in logical sections
       ↓
Claude synthesizes comprehensive summary
       ↓
Claude saves to .claude/context/ ✅
```

**Key advantages:**
- No external API calls needed
- Uses Claude's existing context window intelligently
- No additional setup or API keys required
- Works when `/compact` fails
- Creates persistent, reloadable summaries

## Configuration

No configuration needed! The plugin works out of the box using Claude Code's built-in capabilities.

### Customization

You can customize the summary format by editing:
- `plugin/commands/save-context.md` - Adjust the markdown template and instructions
- `plugin/commands/restore-context.md` - Modify how contexts are displayed

## File Structure

```
plugins/context-manager/
├── plugin/
│   ├── .claude-plugin/
│   │   └── plugin.json           # Plugin metadata
│   ├── commands/
│   │   ├── save-context.md       # /save-context command
│   │   └── restore-context.md    # /restore-context command
│   └── scripts/
│       ├── save-context.js       # Built script
│       ├── restore-context.js    # Built script
│       └── lib/                  # Utilities
│           ├── chunker.js
│           ├── summarizer.js
│           └── storage.js
├── src/                          # TypeScript source
│   ├── save-context.ts
│   ├── restore-context.ts
│   └── lib/
│       ├── chunker.ts
│       ├── summarizer.ts
│       └── storage.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Context File Format

Saved contexts use this markdown format:

```markdown
# Context Summary - [Description]

**Date**: YYYY-MM-DD HH:mm
**Messages Processed**: N
**Compression Ratio**: X:Y (Z% reduction)

---

## Overview
[High-level summary]

## Key Topics
- Topic 1
- Topic 2

## Code Changes
- File 1: changes
- File 2: changes

## Decisions Made
1. Decision 1
2. Decision 2

## Next Steps
- [ ] Item 1
- [ ] Item 2
```

## Development

The plugin uses slash commands that direct Claude to perform the summarization work. No build process or external scripts required!

### Customization

To modify how summaries are created or displayed:
1. Edit `plugin/commands/save-context.md` for save behavior
2. Edit `plugin/commands/restore-context.md` for restore behavior
3. Adjust the markdown template format as needed

### Advanced Usage

The `src/` directory contains TypeScript utilities for potential future enhancements (like automated chunk processing), but they're not currently used by the slash commands.

## Comparison with /compact

| Feature | /compact | context-manager |
|---------|----------|-----------------|
| Works with large conversations | ❌ Fails | ✅ Works |
| Progressive processing | ❌ No | ✅ Yes |
| Persistent storage | ❌ No | ✅ Yes |
| Restoration | ❌ No | ✅ Yes |
| Setup required | ✅ None | ✅ None |
| API keys needed | ❌ No | ❌ No |

## Future Enhancements

- [ ] Auto-save on token threshold
- [ ] Context search/filtering
- [ ] Multiple compression levels
- [ ] Integration with claude-mem plugin
- [ ] Semantic clustering of topics
- [ ] Visual timeline of context files
- [ ] Diff between context versions
- [ ] Export to other formats (PDF, JSON)

## License

MIT

## Author

**Sceleratis**

## Contributing

This is part of a personal marketplace. Feel free to fork and adapt for your use.

## Support

Open an issue in the [claude-code-stuff](https://github.com/Sceleratis/claude-code-stuff) repository.
