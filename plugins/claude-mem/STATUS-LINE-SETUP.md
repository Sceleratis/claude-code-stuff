# Claude-mem Status Line Setup

Shows real-time plugin activity in your Claude Code status bar.

## What It Shows

```
[Model] 🧠 ● mem: 15obs | Last: 14:32:15
```

- **Status Indicator**:
  - 🟢 Green `●` - Active session with observations
  - 🟡 Yellow `◐` - Recent observations (last hour)
  - ⚪ Gray `○` - No recent activity

- **Observation Count**: Number of observations captured in last hour
- **Last Activity**: Timestamp of most recent observation

## Installation

### Option 1: Interactive Setup (Recommended)

```bash
/statusline
```

Follow the prompts and enter this path when asked:
```
~/.claude/plugins/marketplaces/claude-code-stuff/plugins/claude-mem/plugin/scripts/statusline.sh
```

### Option 2: Manual Setup

Add to your `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/plugins/marketplaces/claude-code-stuff/plugins/claude-mem/plugin/scripts/statusline.sh",
    "padding": 0
  }
}
```

## Requirements

- `jq` installed (`brew install jq` / `apt install jq` / `choco install jq`)
- `sqlite3` command-line tool (usually pre-installed)
- Claude-mem plugin running

## Troubleshooting

### "Command not found: jq"

Install jq:
- **macOS**: `brew install jq`
- **Linux**: `sudo apt install jq` or `sudo yum install jq`
- **Windows**: `choco install jq` or download from https://jqlang.github.io/jq/

### "Database file not found"

The status line will show "Not initialized" until you've had at least one conversation with claude-mem active.

### Status line not updating

- Make sure claude-mem plugin is installed and active
- Restart Claude Code after installing
- Check that the script has execute permissions: `chmod +x statusline.sh`

## Testing

Test the script manually:

```bash
# Test with sample input
echo '{"model":{"display_name":"Sonnet"},"cwd":"/test"}' | \
  ~/.claude/plugins/marketplaces/claude-code-stuff/plugins/claude-mem/plugin/scripts/statusline.sh
```

Should output something like:
```
[Sonnet] 🧠 ○ mem: 0obs
```

## Customization

Edit `statusline.sh` to customize:

- **Colors**: Modify ANSI color codes (`\033[32m` = green, `\033[33m` = yellow, etc.)
- **Emoji**: Change the brain emoji or status indicators
- **Time Window**: Change `-1 hour` to `-30 minutes` or other intervals
- **Format**: Adjust the output string format

## Integration with Other Tools

The status line can be combined with other tools like:
- Git branch info
- Token usage
- Project name
- Custom metrics

See Claude Code status line documentation for advanced examples.
