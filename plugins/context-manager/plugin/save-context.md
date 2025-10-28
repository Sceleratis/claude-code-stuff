You are being asked to save the current conversation context to a compressed summary file.

## Your Task

1. **Export conversation to a temporary file**
   - Use the Write tool to write a formatted version of the current conversation to a temporary file (e.g., `/tmp/conversation-export.txt`)
   - Format each message as: `role: content` with blank lines between messages
   - Include as much of the conversation as you can recall from your context

2. **Prompt user for description**
   - Ask the user for a brief description of this conversation (e.g., "Feature implementation", "Bug fixes", "Refactoring work")
   - This will be used in the filename

3. **Run the save-context script**
   - Use the Bash tool to run the context-manager save-context script
   - Command: `node plugins/context-manager/plugin/scripts/save-context.js <temp-file-path> "<description>" "<project-root>"`
   - The script will:
     - Chunk the conversation into manageable pieces
     - Recursively summarize using Claude API
     - Save to `.claude/context/` with a timestamped filename
   - Monitor the output and report progress to the user

4. **Clean up and report**
   - Delete the temporary conversation file
   - Report success and show where the summary was saved
   - Show compression statistics (original tokens → summary tokens)

## Important Notes

- The script requires `ANTHROPIC_API_KEY` environment variable to be set
- Ensure the TypeScript has been built first (run `npm run build` in the plugin directory if needed)
- The process may take a few minutes depending on conversation length
- The script will show progress as it chunks and summarizes

## Example Workflow

```
1. User: /save-context
2. You: Export conversation → /tmp/conversation-20251028.txt
3. You: Ask user for description
4. User provides: "New feature development"
5. You: Run script with description
6. Script: Chunks conversation, summarizes recursively
7. You: Report results and cleanup
```
