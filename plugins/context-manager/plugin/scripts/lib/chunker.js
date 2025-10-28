/**
 * Conversation Chunker
 * Splits conversation text into manageable chunks for summarization
 */
/**
 * Rough token estimation (approximately 4 chars per token)
 */
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}
/**
 * Parse conversation text into structured messages
 * Supports various formats from Claude Code conversation dumps
 */
export function parseConversation(text) {
    const messages = [];
    const lines = text.split('\n');
    let currentMessage = null;
    let currentContent = [];
    for (const line of lines) {
        // Detect role markers (user:, assistant:, system:, etc.)
        const roleMatch = line.match(/^(user|assistant|system):/i);
        if (roleMatch) {
            // Save previous message if exists
            if (currentMessage) {
                currentMessage.content = currentContent.join('\n').trim();
                if (currentMessage.content) {
                    messages.push(currentMessage);
                }
            }
            // Start new message
            const role = roleMatch[1].toLowerCase();
            const content = line.substring(roleMatch[0].length).trim();
            currentMessage = { role, content: '' };
            currentContent = [content];
        }
        else if (currentMessage) {
            // Continue current message
            currentContent.push(line);
        }
    }
    // Save last message
    if (currentMessage) {
        currentMessage.content = currentContent.join('\n').trim();
        if (currentMessage.content) {
            messages.push(currentMessage);
        }
    }
    return messages;
}
/**
 * Chunk messages into groups based on token count
 */
export function chunkMessages(messages, maxTokensPerChunk = 6000) {
    const chunks = [];
    let currentChunk = [];
    let currentTokens = 0;
    let chunkId = 0;
    for (const message of messages) {
        const messageTokens = estimateTokens(message.content);
        // If adding this message exceeds limit and we have messages in current chunk
        if (currentTokens + messageTokens > maxTokensPerChunk && currentChunk.length > 0) {
            // Save current chunk
            chunks.push({
                id: chunkId++,
                messages: currentChunk,
                tokenEstimate: currentTokens
            });
            // Start new chunk
            currentChunk = [message];
            currentTokens = messageTokens;
        }
        else {
            // Add to current chunk
            currentChunk.push(message);
            currentTokens += messageTokens;
        }
    }
    // Save last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            id: chunkId,
            messages: currentChunk,
            tokenEstimate: currentTokens
        });
    }
    return chunks;
}
/**
 * Convert messages back to text format
 */
export function messagesToText(messages) {
    return messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
}
