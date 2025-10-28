You are being asked to save the current conversation context to a compressed summary file by directly summarizing your own context.

## Your Task

1. **Prompt user for description**
   - Ask the user for a brief description of this conversation (e.g., "Feature implementation", "Bug fixes", "Refactoring work")
   - This will be used in the filename

2. **Analyze your conversation context**
   - Review the full conversation history available in your context
   - Identify key topics, decisions, code changes, and outcomes
   - Count approximate number of messages/exchanges

3. **Create progressive summary**
   - Since you can't process everything at once, work in logical sections:
     - Early conversation: Initial requests and setup
     - Middle sections: Main work and implementations
     - Recent exchanges: Final changes and current state
   - For each section, extract:
     - Key decisions made
     - Code changes and their purposes
     - Problems solved
     - Important discoveries
     - Ongoing work or next steps

4. **Synthesize final summary**
   - Combine section summaries into one coherent document
   - Use this markdown format:

```markdown
# Context Summary - [Description]

**Date**: YYYY-MM-DD HH:mm
**Messages**: Approximately N exchanges

## Overview
[High-level summary of the conversation]

## Key Topics
- Topic 1
- Topic 2
- ...

## Work Completed
### [Feature/Area 1]
- Changes made
- Files affected

### [Feature/Area 2]
- Changes made
- Files affected

## Decisions Made
1. Decision 1 and rationale
2. Decision 2 and rationale

## Problems Solved
- Problem 1: Solution
- Problem 2: Solution

## Next Steps
- [ ] Task 1
- [ ] Task 2
```

5. **Save the summary**
   - Create filename: `yyyyMMDD-HHmm - <description>.md`
   - Write to `.claude/context/` using Write tool
   - Report success with file path

## Important Notes

- You have direct access to your conversation context - no external API needed
- Focus on technical substance, omit pleasantries
- Be comprehensive but concise
- Preserve critical technical details and decisions
- Group related changes together

## Example

```
User: /save-context
You: "What would you like to call this context summary? (e.g., 'Feature implementation', 'Bug fixes')"
User: "Plugin development work"
You: [Analyzes conversation, creates structured summary, saves to .claude/context/20251028-1145 - Plugin development work.md]
You: "✅ Context saved to .claude/context/20251028-1145 - Plugin development work.md"
```
