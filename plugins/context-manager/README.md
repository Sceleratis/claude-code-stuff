# Context Manager Plugin

**Efficient context management with chunked conversation summarization for Claude Code**

## Overview

The Context Manager plugin solves a critical problem with Claude Code's built-in `/compact` command: it fails when the conversation history is too large. This plugin uses a chunked, recursive summarization approach to efficiently compress conversation history without overwhelming the context window.

## Features

- 🧩 **Chunked Processing**: Splits conversations into manageable chunks
- 🔄 **Recursive Summarization**: Iteratively summarizes until reaching target size
- 💾 **Persistent Storage**: Saves summaries to `.claude/context/` with timestamps
- 📊 **Compression Stats**: Shows token reduction and compression ratios
- 🔍 **Easy Restoration**: Quick access to previous context summaries
- ⚡ **Smart Targeting**: Keeps summaries under 5k tokens for efficient loading

## Installation

### Prerequisites

- Node.js 18+ installed
- Claude Code CLI
- `ANTHROPIC_API_KEY` environment variable set

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
1. Exports current conversation to temporary file
2. Asks for a brief description
3. Chunks conversation into ~6k token pieces
4. Recursively summarizes using Claude API
5. Saves to `.claude/context/yyyyMMDD-HHmm - description.md`

**Example output:**
```
🔄 Starting context save process...
📖 Reading conversation file...
🔍 Parsing conversation...
   Found 250 messages

✂️  Chunking conversation...
   Created 8 chunks
   Total estimated tokens: 45000

🤖 Starting recursive summarization...
   Processing chunk 1/8...
   Processing chunk 2/8...
   ...
   Creating final summary from 3 summaries...

✅ Summarization complete!
   Summary tokens: 4200
   Compression: 45000:4200 (91% reduction)

💾 Saving summary...
   ✅ Saved to: .claude/context/20251028-1120 - Feature implementation.md

🎉 Context save complete!
```

### Restore Previous Context

```bash
/restore-context
```

**What it does:**
- Loads most recent context summary
- Displays the summary for your review

**List available contexts:**
```bash
/restore-context --list
```

**Load specific context:**
```bash
/restore-context "20251028-1120 - Feature implementation.md"
```

## How It Works

### The Problem

Claude Code's `/compact` tries to process the entire conversation at once:
```
[Full conversation] → [Claude API] → [Summary]
                      ↓
              Context overflow! ❌
```

### Our Solution

Chunked recursive summarization:
```
[Conversation] → [Chunk 1, Chunk 2, ..., Chunk N]
                      ↓
[Summary 1, Summary 2, ..., Summary N]
                      ↓
[Grouped summaries] → [Summary A, Summary B, Summary C]
                      ↓
           [Final summary] ✅
```

**Key advantages:**
- Never overwhelms context window
- Preserves important details through recursive merging
- Handles conversations of any size
- Shows progress throughout

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` (required): Your Anthropic API key
- Default model: `claude-sonnet-4-20250514`
- Target summary size: 5000 tokens
- Chunk size: 6000 tokens

### Customization

Edit `src/lib/summarizer.ts` to adjust:
- Model selection
- Max tokens per request
- Target summary size
- Summarization prompts

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

### Build

```bash
npm run build        # Compile TypeScript + copy commands
npm run dev          # Watch mode
```

### Testing

```bash
# Create test conversation file
echo "user: Hello\nassistant: Hi there!" > /tmp/test-conv.txt

# Test save (requires API key)
node plugin/scripts/save-context.js /tmp/test-conv.txt "Test" .

# Test restore
node plugin/scripts/restore-context.js --list
node plugin/scripts/restore-context.js
```

## Troubleshooting

### "ANTHROPIC_API_KEY not set"

Set your API key:
```bash
export ANTHROPIC_API_KEY="your-key-here"
```

### Build fails

Ensure TypeScript and dependencies are installed:
```bash
npm install
```

### Script not found

Make sure you've built the plugin:
```bash
npm run build
```

### API rate limits

The scripts include 500ms delays between API calls. If you hit rate limits, you can increase this in `src/lib/summarizer.ts`:
```typescript
await new Promise(resolve => setTimeout(resolve, 1000)); // Increase delay
```

## Comparison with /compact

| Feature | /compact | context-manager |
|---------|----------|-----------------|
| Works with large conversations | ❌ Fails | ✅ Always works |
| Chunked processing | ❌ No | ✅ Yes |
| Persistent storage | ❌ No | ✅ Yes |
| Restoration | ❌ No | ✅ Yes |
| Progress feedback | ❌ Limited | ✅ Detailed |
| Compression stats | ❌ No | ✅ Yes |

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
