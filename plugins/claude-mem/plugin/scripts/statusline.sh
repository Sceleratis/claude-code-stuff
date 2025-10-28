#!/bin/bash
# Claude-mem status line
# Shows plugin activity in Claude Code status bar

# Read JSON input from Claude Code
input=$(cat)

# Get model info for display
MODEL=$(echo "$input" | jq -r '.model.display_name // "Claude"')

# Path to claude-mem database
CLAUDE_MEM_DB="${CLAUDE_MEM_DATA_DIR:-$HOME/.claude-mem}/claude-mem.db"

# Check if database exists
if [ ! -f "$CLAUDE_MEM_DB" ]; then
    echo "[$MODEL] 🧠 claude-mem: Not initialized"
    exit 0
fi

# Query recent activity
OBSERVATIONS=$(sqlite3 "$CLAUDE_MEM_DB" "SELECT COUNT(*) FROM observations WHERE created_at >= datetime('now', '-1 hour')" 2>/dev/null || echo "0")
SESSIONS=$(sqlite3 "$CLAUDE_MEM_DB" "SELECT COUNT(*) FROM sdk_sessions WHERE status = 'active'" 2>/dev/null || echo "0")
LAST_ACTIVITY=$(sqlite3 "$CLAUDE_MEM_DB" "SELECT MAX(created_at) FROM observations" 2>/dev/null || echo "")

# Format last activity time
if [ -n "$LAST_ACTIVITY" ]; then
    # Calculate time diff (simple version - just show the time)
    LAST_TIME=$(echo "$LAST_ACTIVITY" | cut -d' ' -f2 | cut -d'.' -f1)
    ACTIVITY_TEXT="| Last: $LAST_TIME"
else
    ACTIVITY_TEXT=""
fi

# Build status string with colors
# Green if active session, yellow if observations exist, gray otherwise
if [ "$SESSIONS" -gt 0 ]; then
    STATUS="\033[32m●\033[0m" # Green dot
elif [ "$OBSERVATIONS" -gt 0 ]; then
    STATUS="\033[33m◐\033[0m" # Yellow half-circle
else
    STATUS="\033[90m○\033[0m" # Gray circle
fi

# Output single line
echo "[$MODEL] 🧠 $STATUS mem: ${OBSERVATIONS}obs $ACTIVITY_TEXT"
