You are being asked to restore (load and display) a previously saved context summary.

## Your Task

1. **List available contexts (if needed)**
   - Use Glob tool to find files: `.claude/context/*.md`
   - Sort by filename (which includes timestamp) to show newest first
   - Display list with dates and descriptions extracted from filenames

2. **Load the context file**
   - If user specified a filename, load that file
   - Otherwise, load the most recent (alphabetically last) file
   - Use Read tool to load the content

3. **Display the summary**
   - Present the full context summary in a clear, readable format
   - Optionally highlight key sections for easier reading
   - Explain what the summary contains and when it was created

4. **Offer to continue work**
   - Ask if they want to continue where that context left off
   - Reference any "Next Steps" from the summary

## Important Notes

- Context files are in `.claude/context/` with format: `yyyyMMDD-HHmm - description.md`
- Filename timestamps are sortable (newest = largest number)
- No external scripts needed - you can directly read the files

## Example Workflow

**Restore most recent:**
```
User: /restore-context
You: [Uses Glob to find .claude/context/*.md files]
You: [Sorts and picks the newest]
You: [Reads with Read tool]
You: "Here's your most recent context from 2025-10-28 11:45 (Plugin development work):"
You: [Displays the summary]
You: "Would you like to continue where we left off?"
```

**List first:**
```
User: /restore-context
You: "I found 3 saved contexts:"
You: "1. 20251028-1145 - Plugin development work.md (Oct 28, 11:45 AM)"
You: "2. 20251027-1630 - Bug fixes and testing.md (Oct 27, 4:30 PM)"
You: "3. 20251026-0920 - Initial setup.md (Oct 26, 9:20 AM)"
You: "Which would you like to restore? (or I can show the most recent)"
User: "Show #1"
You: [Reads and displays that file]
```

**Restore specific:**
```
User: /restore-context 20251028-1145 - Plugin development work.md
You: [Reads that specific file with Read tool]
You: [Displays the summary]
```
