You are being asked to restore (load and display) a previously saved context summary.

## Your Task

1. **Run the restore-context script**
   - Use the Bash tool to run: `node plugins/context-manager/plugin/scripts/restore-context.js [filename]`
   - If no filename is provided, it will load the most recent context file
   - The script will output the context summary content

2. **Display the results**
   - The script outputs the full context summary
   - Present this to the user in a clear, readable format
   - Highlight key sections (Overview, Code Changes, Decisions, Next Steps, etc.)

3. **Optional: List available contexts**
   - If the user wants to see all available context files first, run: `node plugins/context-manager/plugin/scripts/restore-context.js --list`
   - Show the list of available files with dates and descriptions
   - Ask which one they want to restore

## Important Notes

- Context files are stored in `.claude/context/` with format: `yyyyMMDD-HHmm - description.md`
- The script will automatically load the most recent file if no filename is specified
- You can use the loaded context to continue work or refresh your understanding of previous conversations

## Example Workflow

**Restore most recent:**
```
1. User: /restore-context
2. You: Run script (no filename)
3. Script: Loads most recent context file
4. You: Display the summary to user
```

**List and choose:**
```
1. User: /restore-context
2. You: Run script with --list flag
3. Script: Shows available context files
4. You: Ask user which to load
5. User: Selects one
6. You: Run script with that filename
7. You: Display the summary
```

**Restore specific file:**
```
1. User: /restore-context 20251028-1120 - Feature work.md
2. You: Run script with that filename
3. You: Display the summary
```
